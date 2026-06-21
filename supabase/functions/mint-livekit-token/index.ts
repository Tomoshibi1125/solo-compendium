/**
 * Misty Pearl I3 — LiveKit access-token minter.
 *
 * Mints a short-lived LiveKit room token for the calling user using
 * the campaign's stored `livekit_api_key` + `livekit_api_secret`.
 *
 * Flow:
 *   1. Caller is authenticated (Supabase JWT in Authorization header).
 *   2. Caller must be a member of the requested campaign — verified
 *      via the caller's RLS-scoped client.
 *   3. Server-side: read the API secret from the campaigns row (via
 *      service-role to bypass the column REVOKE), build a LiveKit JWT
 *      with the room name = `commnet:{campaignId}:{sessionId|shared}`.
 *   4. Token TTL: 6 hours (one session worth).
 *
 * RA theming: the response refers to this as a "Bureau uplink badge"
 * but the field shape is what the LiveKit client SDK expects.
 */

import { create as jwtCreate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const buildCorsHeaders = (origin: string | null) => {
	const allowOrigin = origin?.trim() ? origin : "*";
	return {
		"Access-Control-Allow-Origin": allowOrigin,
		"Access-Control-Allow-Headers":
			"authorization, x-client-info, apikey, content-type",
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		Vary: "Origin",
	};
};

const json = (status: number, body: unknown, origin: string | null) =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
			...buildCorsHeaders(origin),
		},
	});

interface TokenRequest {
	campaignId?: string;
	sessionId?: string | null;
}

async function importSecretKey(secret: string): Promise<CryptoKey> {
	return crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign", "verify"],
	);
}

Deno.serve(async (req) => {
	const origin = req.headers.get("origin");
	if (req.method === "OPTIONS") {
		return new Response(null, {
			status: 204,
			headers: buildCorsHeaders(origin),
		});
	}
	if (req.method !== "POST") {
		return json(405, { error: "Method not allowed" }, origin);
	}

	let body: TokenRequest;
	try {
		body = (await req.json()) as TokenRequest;
	} catch {
		return json(400, { error: "Invalid JSON body" }, origin);
	}
	const campaignId = body.campaignId?.trim();
	if (!campaignId) return json(400, { error: "campaignId required" }, origin);

	const supabaseUrl = Deno.env.get("SUPABASE_URL");
	const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
	const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
	if (!supabaseUrl || !anonKey || !serviceRoleKey) {
		console.error("Missing SUPABASE env");
		return json(500, { error: "Server not configured" }, origin);
	}

	// Caller-scoped client — confirms membership through RLS.
	const authHeader = req.headers.get("Authorization") ?? "";
	const callerClient = createClient(supabaseUrl, anonKey, {
		global: { headers: { Authorization: authHeader } },
		auth: { persistSession: false, autoRefreshToken: false },
	});
	const { data: userData } = await callerClient.auth.getUser();
	const callerId = userData?.user?.id;
	if (!callerId) {
		return json(401, { error: "Authentication required" }, origin);
	}

	// Membership check (Warden / co-Warden / Ascendant) via the caller's
	// own RLS-scoped read. A non-member sees no row and we 403.
	const { data: campaignRow } = await callerClient
		.from("campaigns")
		.select("id")
		.eq("id", campaignId)
		.maybeSingle();
	if (!campaignRow) {
		return json(403, { error: "Not a campaign member" }, origin);
	}

	// Service-role read of the secret column (REVOKE'd from anon/auth).
	const admin = createClient(supabaseUrl, serviceRoleKey, {
		auth: { persistSession: false, autoRefreshToken: false },
	});
	const { data: cfg, error: cfgErr } = await admin
		.from("campaigns")
		.select("livekit_url, livekit_api_key, livekit_api_secret")
		.eq("id", campaignId)
		.maybeSingle();
	if (cfgErr || !cfg) {
		return json(404, { error: "Campaign not found" }, origin);
	}
	const cfgTyped = cfg as {
		livekit_url?: string | null;
		livekit_api_key?: string | null;
		livekit_api_secret?: string | null;
	};
	if (
		!cfgTyped.livekit_url ||
		!cfgTyped.livekit_api_key ||
		!cfgTyped.livekit_api_secret
	) {
		return json(
			400,
			{ error: "LiveKit not configured for this campaign" },
			origin,
		);
	}

	const sessionToken = body.sessionId?.trim() || "shared";
	const roomName = `commnet:${campaignId}:${sessionToken}`;
	const now = Math.floor(Date.now() / 1000);
	const ttlSeconds = 6 * 60 * 60; // 6 hours — one session worth

	const claims = {
		iss: cfgTyped.livekit_api_key,
		sub: callerId,
		iat: now,
		exp: now + ttlSeconds,
		nbf: now,
		name: `Operative ${callerId.slice(0, 6)}`,
		video: {
			roomJoin: true,
			room: roomName,
			canPublish: true,
			canSubscribe: true,
			canPublishData: true,
		},
	};

	try {
		const key = await importSecretKey(cfgTyped.livekit_api_secret);
		const token = await jwtCreate(
			{ alg: "HS256", typ: "JWT" },
			claims as unknown as Record<string, unknown>,
			key,
		);
		return json(
			200,
			{
				url: cfgTyped.livekit_url,
				token,
				expiresAt: claims.exp,
				room: roomName,
			},
			origin,
		);
	} catch (err) {
		console.error("[mint-livekit-token] sign failed:", err);
		return json(500, { error: "Token sign failed" }, origin);
	}
});
