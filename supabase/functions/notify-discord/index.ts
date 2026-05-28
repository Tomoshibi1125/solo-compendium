/**
 * Misty Pearl E3 — Discord webhook bridge.
 *
 * Edge function that pushes campaign events (session reminders, Warden
 * broadcasts, dice rolls) to a Wardens's configured Discord webhook
 * URL. Fire-and-forget on the client side: a missing or invalid
 * webhook never blocks the action that triggered it.
 *
 * Auth model:
 *   - The function uses the **caller's** Supabase token to read the
 *     campaign row. RLS enforces that only campaign members can read
 *     `campaigns.discord_webhook_url`, so non-members can't probe.
 *   - The webhook URL itself is treated as low-sensitivity: anyone with
 *     it can post to the Discord channel, but it's per-campaign and the
 *     Warden controls it. The settings UI surfaces this with a warning
 *     on first enable.
 *
 * RA theming: "Bureau cross-channel uplink" — the Warden authorizes the
 * relay to mirror Field Reports into a Discord guild.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

type NotifyKind =
	| "session_scheduled"
	| "session_reminder"
	| "warden_broadcast"
	| "dice_roll"
	| "test";

interface NotifyRequest {
	campaignId?: string;
	kind?: NotifyKind;
	payload?: {
		title?: string;
		date?: string;
		message?: string;
		formula?: string;
		result?: number | string;
		actor?: string;
		[key: string]: unknown;
	};
}

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

const escapeMd = (s: string): string =>
	s.replace(/([\\*_~`>|])/g, "\\$1").slice(0, 1800);

const formatMessage = (kind: NotifyKind, payload: NotifyRequest["payload"]) => {
	const p = payload ?? {};
	switch (kind) {
		case "session_scheduled":
			return `📅 **Session scheduled** — **${escapeMd(p.title ?? "Untitled")}**${
				p.date ? ` for ${escapeMd(p.date)}` : ""
			}.`;
		case "session_reminder":
			return `⏰ **Session in 24 hours** — **${escapeMd(p.title ?? "Untitled")}**${
				p.date ? ` (${escapeMd(p.date)})` : ""
			}.`;
		case "warden_broadcast":
			return `📡 **Warden Broadcast**${
				p.actor ? ` (${escapeMd(p.actor)})` : ""
			}: ${escapeMd(p.message ?? "")}`;
		case "dice_roll":
			return `🎲 **${escapeMd(p.actor ?? "Ascendant")}** rolled \`${escapeMd(
				p.formula ?? "?",
			)}\` → **${escapeMd(String(p.result ?? "?"))}**`;
		case "test":
			return `✅ **Test relay** — Rift Ascendant Bureau cross-channel uplink confirmed.`;
		default:
			return null;
	}
};

const isValidDiscordWebhook = (url: string): boolean => {
	try {
		const u = new URL(url);
		if (u.protocol !== "https:") return false;
		// discord.com / discordapp.com webhook hosts.
		if (!/(^|\.)discord(app)?\.com$/.test(u.hostname)) return false;
		if (!u.pathname.startsWith("/api/webhooks/")) return false;
		return true;
	} catch {
		return false;
	}
};

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

	let body: NotifyRequest;
	try {
		body = (await req.json()) as NotifyRequest;
	} catch {
		return json(400, { error: "Invalid JSON body" }, origin);
	}

	const campaignId = body.campaignId?.trim();
	const kind = body.kind;
	if (!campaignId || !kind) {
		return json(400, { error: "campaignId and kind are required" }, origin);
	}

	const supabaseUrl = Deno.env.get("SUPABASE_URL");
	const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
	if (!supabaseUrl || !anonKey) {
		console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
		return json(500, { error: "Server is not configured" }, origin);
	}

	// Caller-scoped client so RLS enforces campaign membership on the read.
	const authHeader = req.headers.get("Authorization") ?? "";
	const callerClient = createClient(supabaseUrl, anonKey, {
		global: { headers: { Authorization: authHeader } },
		auth: { persistSession: false, autoRefreshToken: false },
	});

	const { data: campaign, error: campaignError } = await callerClient
		.from("campaigns")
		.select("id, discord_webhook_url")
		.eq("id", campaignId)
		.maybeSingle();

	if (campaignError) {
		console.error("Campaign read failed:", campaignError);
		return json(403, { error: "Cannot read campaign" }, origin);
	}
	if (!campaign) {
		return json(404, { error: "Campaign not found" }, origin);
	}

	const webhookUrl = (
		campaign as { discord_webhook_url?: string | null }
	).discord_webhook_url;

	if (!webhookUrl || !isValidDiscordWebhook(webhookUrl)) {
		// Soft-OK: caller doesn't need to know whether a hook is set.
		return json(
			200,
			{ delivered: false, reason: "no_webhook_configured" },
			origin,
		);
	}

	const content = formatMessage(kind, body.payload);
	if (!content) {
		return json(400, { error: "Unknown notification kind" }, origin);
	}

	try {
		const discordResp = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				content,
				username: "Rift Ascendant Bureau",
				allowed_mentions: { parse: [] },
			}),
		});
		if (!discordResp.ok) {
			console.warn("Discord webhook returned", discordResp.status);
			return json(
				200,
				{ delivered: false, status: discordResp.status },
				origin,
			);
		}
	} catch (error) {
		console.error("Discord webhook fetch failed:", error);
		return json(200, { delivered: false, reason: "network_error" }, origin);
	}

	return json(200, { delivered: true }, origin);
});
