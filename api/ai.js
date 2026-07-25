/**
 * Vercel Serverless AI Proxy — HTTP shell around the shared FREE provider chain
 * in ./_aiProviders.js (the single source of truth shared with the Vite dev
 * middleware in vite.config.ts, so dev and prod can never drift).
 *
 * This file owns only the HTTP concerns: CORS, method guard, optional auth /
 * shared-secret, per-instance rate limiting, body parsing, and response shaping.
 * All provider/model logic lives in ./_aiProviders.js.
 *
 * Request:  { prompt, systemPrompt?, maxTokens?, provider?, model?, images? }
 * Response: { success: true, text, model, usage, provider } | { error, available }
 */

import { normalizeImages, runProviderChain } from "./_aiProviders.js";

// ── Rate limiting (per Vercel cold-start instance) ──────────────────────────
const rateBuckets = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20; // per IP / minute
const RATE_LIMIT_MAX_AUTH = 60; // per user token / minute

function rateKey(ip, userId) {
	return userId ? `user:${userId}` : `ip:${ip}`;
}

function isRateLimited(ip, userId) {
	const now = Date.now();
	const bucketKey = rateKey(ip, userId);
	const bucket = rateBuckets.get(bucketKey);
	if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
		rateBuckets.set(bucketKey, { windowStart: now, count: 1 });
		return false;
	}
	bucket.count += 1;
	const limit = userId ? RATE_LIMIT_MAX_AUTH : RATE_LIMIT_MAX;
	return bucket.count > limit;
}

export default async function handler(req, res) {
	const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
	res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

	if (req.method === "OPTIONS") return res.status(204).end();
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST, OPTIONS");
		return res.status(405).json({ error: "Method not allowed" });
	}

	// Optional auth (bearer = user token for rate keying, or shared secret).
	const authHeader = req.headers.authorization || "";
	const bearer = authHeader.startsWith("Bearer ")
		? authHeader.slice("Bearer ".length).trim()
		: null;
	const sharedSecret = process.env.AI_PROXY_SECRET || null;
	let userId = null;
	if (sharedSecret) {
		if (bearer !== sharedSecret)
			return res.status(401).json({ error: "Unauthorized" });
	} else if (bearer) {
		userId = bearer;
	}

	const clientIp =
		req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
		req.socket?.remoteAddress ||
		"unknown";
	if (isRateLimited(clientIp, userId)) {
		return res
			.status(429)
			.json({ error: "Rate limit exceeded. Try again in a minute." });
	}

	let body;
	try {
		body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
	} catch {
		return res.status(400).json({ error: "Invalid JSON body" });
	}

	const {
		prompt,
		systemPrompt,
		maxTokens,
		provider: preferredProvider,
		model: preferredModel,
		images: rawImages,
	} = body;
	if (!prompt || typeof prompt !== "string") {
		return res.status(400).json({ error: "Missing required field: prompt" });
	}
	if (prompt.length > 8000) {
		return res.status(400).json({ error: "Prompt too long" });
	}

	const normalizedImages = normalizeImages(rawImages);
	if (normalizedImages.error) {
		return res.status(400).json({ error: normalizedImages.error });
	}

	const result = await runProviderChain({
		prompt,
		systemPrompt,
		maxTokens,
		provider: preferredProvider,
		model: preferredModel,
		images: normalizedImages.images,
	});

	if (!result.ok) {
		return res.status(502).json({ error: result.error, available: false });
	}

	return res.status(200).json({
		success: true,
		text: result.text,
		model: result.model,
		usage: result.usage || {},
		provider: result.provider,
	});
}
