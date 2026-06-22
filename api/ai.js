/**
 * Vercel Serverless AI Proxy — best-in-class, 100% FREE provider chain.
 *
 * Tries an ordered list of FREE providers and returns the first success, so the
 * embedded AI is best-in-class without being tied to any single vendor. All keys
 * stay server-side; users never see or manage them. The keyless Pollinations leg
 * guarantees the app still works with ZERO configuration (no owner key at all).
 *
 * Order is configurable via AI_PROVIDER_ORDER (comma-separated). Default favours
 * the best-in-class free model first, then alternatives, then a keyless fallback:
 *     gemini, openrouter, pollinations
 * Gemini 2.5 Flash leads: independently rated the most capable zero-cost model
 * in 2026 (well-rounded quality, native JSON-schema output, ~1.5k req/day free,
 * 1M context, no card). OpenRouter adds free model variety; Pollinations is the
 * keyless zero-config fallback. (Groq intentionally excluded.)
 *
 * Request:  { prompt, systemPrompt?, maxTokens? }
 * Response: { success: true, text, model, usage } | { error, available }
 */

const MAX_OUTPUT_TOKENS = 4096;
const REQUEST_TIMEOUT_MS = 30000;

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

function fetchWithTimeout(url, options, timeoutMs = REQUEST_TIMEOUT_MS) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	return fetch(url, { ...options, signal: controller.signal }).finally(() =>
		clearTimeout(timer),
	);
}

// ── Free provider adapters ──────────────────────────────────────────────────
// Each adapter returns { text, model, usage } or throws. `available()` lets the
// chain skip a provider whose (free-tier) key is not configured. Pollinations is
// keyless, so it is always available.

/** OpenRouter free models — OpenAI-compatible. Best-in-class free quality. */
async function callOpenRouter({ prompt, systemPrompt, maxTokens, model: modelOverride }) {
	const apiKey = process.env.OPENROUTER_API_KEY;
	const model =
		modelOverride ||
		process.env.OPENROUTER_MODEL ||
		"deepseek/deepseek-chat-v3-0324:free";
	const messages = [];
	if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
	messages.push({ role: "user", content: prompt });

	const response = await fetchWithTimeout(
		"https://openrouter.ai/api/v1/chat/completions",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
				// Optional attribution headers (recommended by OpenRouter).
				"HTTP-Referer": process.env.PUBLIC_SITE_URL || "https://rift-ascendant.app",
				"X-Title": "Rift Ascendant",
			},
			body: JSON.stringify({
				model,
				messages,
				max_tokens: Math.min(maxTokens || MAX_OUTPUT_TOKENS, MAX_OUTPUT_TOKENS),
				temperature: 0.8,
			}),
		},
	);
	if (!response.ok) {
		const err = await response.json().catch(() => ({}));
		throw new Error(err?.error?.message || `OpenRouter error ${response.status}`);
	}
	const data = await response.json();
	const text = data?.choices?.[0]?.message?.content || "";
	if (!text.trim()) throw new Error("OpenRouter returned empty response");
	return {
		text,
		model: data?.model || model,
		usage: {
			promptTokens: data?.usage?.prompt_tokens,
			completionTokens: data?.usage?.completion_tokens,
			totalTokens: data?.usage?.total_tokens,
		},
	};
}
callOpenRouter.available = () => Boolean(process.env.OPENROUTER_API_KEY);

/** Google Gemini free tier (generous, strong). */
async function callGemini({ prompt, systemPrompt, maxTokens, model: modelOverride }) {
	const apiKey = process.env.GEMINI_API_KEY;
	// Best-in-class free model (2026). Override via GEMINI_MODEL or per-request.
	const model = modelOverride || process.env.GEMINI_MODEL || "gemini-2.5-flash";
	const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

	const geminiBody = {
		contents: [{ role: "user", parts: [{ text: prompt }] }],
		generationConfig: {
			maxOutputTokens: Math.min(maxTokens || MAX_OUTPUT_TOKENS, MAX_OUTPUT_TOKENS),
			temperature: 0.8,
		},
		// Relaxed for TTRPG fantasy combat content.
		safetySettings: [
			{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
			{ category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
			{ category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
			{ category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
		],
	};
	if (systemPrompt) geminiBody.systemInstruction = { parts: [{ text: systemPrompt }] };

	const response = await fetchWithTimeout(`${endpoint}?key=${apiKey}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(geminiBody),
	});
	if (!response.ok) {
		const err = await response.json().catch(() => ({}));
		throw new Error(err?.error?.message || `Gemini error ${response.status}`);
	}
	const data = await response.json();
	const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
	if (!text.trim()) throw new Error("Gemini returned empty response");
	return {
		text,
		model,
		usage: {
			promptTokens: data?.usageMetadata?.promptTokenCount,
			completionTokens: data?.usageMetadata?.candidatesTokenCount,
			totalTokens: data?.usageMetadata?.totalTokenCount,
		},
	};
}
callGemini.available = () => Boolean(process.env.GEMINI_API_KEY);

/** Pollinations — keyless and free. Always-on last-resort fallback. */
async function callPollinations({ prompt, systemPrompt, model: modelOverride }) {
	const model = modelOverride || process.env.POLLINATIONS_MODEL || "openai";
	const messages = [];
	if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
	messages.push({ role: "user", content: prompt });

	const response = await fetchWithTimeout("https://text.pollinations.ai/openai", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ model, messages }),
	});
	if (!response.ok) {
		throw new Error(`Pollinations error ${response.status}`);
	}
	// Pollinations may return OpenAI-shaped JSON or plain text.
	const raw = await response.text();
	let text = raw;
	try {
		const data = JSON.parse(raw);
		text = data?.choices?.[0]?.message?.content ?? raw;
	} catch {
		// plain text body — use as-is
	}
	if (!text || !text.trim()) throw new Error("Pollinations returned empty response");
	return { text, model: `pollinations:${model}`, usage: {} };
}
callPollinations.available = () => true;

const PROVIDERS = {
	openrouter: callOpenRouter,
	gemini: callGemini,
	pollinations: callPollinations,
};

function getProviderOrder(preferred) {
	const raw = process.env.AI_PROVIDER_ORDER || "gemini,openrouter,pollinations";
	let order = raw
		.split(",")
		.map((name) => name.trim().toLowerCase())
		.filter((name) => PROVIDERS[name]);
	if (order.length === 0) order = ["pollinations"];
	// User-selected provider is tried FIRST, but the rest of the chain stays as
	// fallback so a rate-limited/blocked choice still gets an answer.
	if (preferred && PROVIDERS[preferred]) {
		order = [preferred, ...order.filter((name) => name !== preferred)];
	}
	return order;
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
		if (bearer !== sharedSecret) return res.status(401).json({ error: "Unauthorized" });
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
	} = body;
	if (!prompt || typeof prompt !== "string") {
		return res.status(400).json({ error: "Missing required field: prompt" });
	}
	if (prompt.length > 8000) {
		return res.status(400).json({ error: "Prompt too long" });
	}

	// Optional user-selected provider/model (e.g. when one is rate-limited).
	const normalizedPreferred =
		typeof preferredProvider === "string"
			? preferredProvider.trim().toLowerCase()
			: undefined;
	const requestedModel =
		typeof preferredModel === "string" && preferredModel.trim()
			? preferredModel.trim()
			: undefined;

	const order = getProviderOrder(normalizedPreferred);
	const errors = [];
	for (const name of order) {
		const provider = PROVIDERS[name];
		if (!provider.available()) continue;
		try {
			// The model override applies only to the provider the user chose.
			const model = name === normalizedPreferred ? requestedModel : undefined;
			const result = await provider({ prompt, systemPrompt, maxTokens, model });
			return res.status(200).json({
				success: true,
				text: result.text,
				model: result.model,
				usage: result.usage || {},
				provider: name,
			});
		} catch (err) {
			errors.push(`${name}: ${err?.message || "error"}`);
			// try the next free provider
		}
	}

	// Every configured free provider failed (or none available).
	return res.status(502).json({
		error:
			errors.length > 0
				? `All free AI providers failed. ${errors.join(" | ")}`
				: "No free AI provider is configured.",
		available: false,
	});
}
