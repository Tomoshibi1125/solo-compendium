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
 * Gemini 3.5 Flash leads (Google's free-tier flagship since May 2026; JSON-schema
 * output, 1M context, no card), with older Flash models as in-leg fallbacks.
 * OpenRouter adds the strongest current :free models (Nemotron 3 Ultra 550B,
 * Hermes 3 405B for creative work); Pollinations is the keyless zero-config
 * fallback. (Groq intentionally excluded.)
 *
 * Request:  { prompt, systemPrompt?, maxTokens?, provider?, model?, images? }
 *   images: optional base64 image data-URLs (or { mimeType, data } pairs) for
 *   multimodal analysis — routed to the vision-capable Gemini leg only.
 * Response: { success: true, text, model, usage } | { error, available }
 */

const MAX_OUTPUT_TOKENS = 4096;
const REQUEST_TIMEOUT_MS = 30000;

// ── Best-in-class FREE model ladders (verified July 2026) ───────────────────
// Each leg tries its models in order and falls through on any per-model error
// (404 model-not-found, rate limit, empty response), so accounts without the
// newest model still work. GEMINI_MODEL / OPENROUTER_MODEL env vars prepend.
const DEFAULT_GEMINI_MODELS = [
	"gemini-3.5-flash", // Google's free-tier flagship (May 2026)
	"gemini-3-flash-preview",
	"gemini-2.5-flash",
];
const DEFAULT_OPENROUTER_MODELS = [
	"nvidia/nemotron-3-ultra-550b-a55b:free", // strongest free general model
	"nousresearch/hermes-3-llama-3.1-405b:free", // best free creative/roleplay
	"nvidia/nemotron-3-super-120b-a12b:free",
	"openai/gpt-oss-120b:free",
	"meta-llama/llama-3.3-70b-instruct:free",
];

// ── Optional multimodal input ───────────────────────────────────────────────
// `images` accepts base64 image data-URLs ("data:image/png;base64,…") or
// { mimeType, data } pairs. Only the Gemini leg is vision-capable on the free
// tier, so requests carrying images skip non-vision providers.
const MAX_IMAGES = 4;
const MAX_IMAGE_BASE64_CHARS = 6_000_000; // ≈4.5MB binary per image

function normalizeImages(raw) {
	if (raw === undefined || raw === null) return { images: [] };
	if (!Array.isArray(raw)) return { error: "images must be an array" };
	if (raw.length > MAX_IMAGES) {
		return { error: `At most ${MAX_IMAGES} images per request` };
	}
	const images = [];
	for (const entry of raw) {
		let mimeType;
		let data;
		if (typeof entry === "string") {
			const match = /^data:(image\/[\w.+-]+);base64,(.+)$/s.exec(entry);
			if (!match) {
				return { error: "Image strings must be base64 image data-URLs" };
			}
			mimeType = match[1];
			data = match[2];
		} else if (entry && typeof entry === "object") {
			mimeType = entry.mimeType;
			data = entry.data;
		}
		if (
			typeof mimeType !== "string" ||
			!mimeType.startsWith("image/") ||
			typeof data !== "string" ||
			!data
		) {
			return { error: "Each image needs an image/* mimeType and base64 data" };
		}
		if (data.length > MAX_IMAGE_BASE64_CHARS) {
			return { error: "Image too large (max ~4.5MB each)" };
		}
		images.push({ mimeType, data });
	}
	return { images };
}

/** Ordered, deduped model attempt list: override → env → defaults. */
function buildModelAttempts(override, envModel, defaults) {
	const seen = new Set();
	const out = [];
	for (const model of [override, envModel, ...defaults]) {
		const trimmed = typeof model === "string" ? model.trim() : "";
		if (!trimmed || seen.has(trimmed)) continue;
		seen.add(trimmed);
		out.push(trimmed);
	}
	return out;
}

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
async function callOpenRouter({
	prompt,
	systemPrompt,
	maxTokens,
	model: modelOverride,
}) {
	const apiKey = process.env.OPENROUTER_API_KEY;
	const models = buildModelAttempts(
		modelOverride,
		process.env.OPENROUTER_MODEL,
		DEFAULT_OPENROUTER_MODELS,
	);
	const messages = [];
	if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
	messages.push({ role: "user", content: prompt });

	const errors = [];
	for (const model of models) {
		try {
			const response = await fetchWithTimeout(
				"https://openrouter.ai/api/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
						// Optional attribution headers (recommended by OpenRouter).
						"HTTP-Referer":
							process.env.PUBLIC_SITE_URL || "https://rift-ascendant.app",
						"X-Title": "Rift Ascendant",
					},
					body: JSON.stringify({
						model,
						messages,
						max_tokens: Math.min(
							maxTokens || MAX_OUTPUT_TOKENS,
							MAX_OUTPUT_TOKENS,
						),
						temperature: 0.8,
					}),
				},
			);
			if (!response.ok) {
				const err = await response.json().catch(() => ({}));
				throw new Error(
					err?.error?.message || `OpenRouter error ${response.status}`,
				);
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
		} catch (err) {
			errors.push(`${model}: ${err?.message || "error"}`);
			// fall through to the next free model
		}
	}
	throw new Error(errors.join(" | ") || "OpenRouter: no models attempted");
}
callOpenRouter.available = () => Boolean(process.env.OPENROUTER_API_KEY);

/** Google Gemini free tier (generous, strong). Vision-capable. */
async function callGemini({
	prompt,
	systemPrompt,
	maxTokens,
	model: modelOverride,
	images = [],
}) {
	const apiKey = process.env.GEMINI_API_KEY;
	const models = buildModelAttempts(
		modelOverride,
		process.env.GEMINI_MODEL,
		DEFAULT_GEMINI_MODELS,
	);

	const parts = [
		{ text: prompt },
		...images.map(({ mimeType, data }) => ({
			inlineData: { mimeType, data },
		})),
	];
	const geminiBody = {
		contents: [{ role: "user", parts }],
		generationConfig: {
			maxOutputTokens: Math.min(
				maxTokens || MAX_OUTPUT_TOKENS,
				MAX_OUTPUT_TOKENS,
			),
			temperature: 0.8,
		},
		// Relaxed for TTRPG fantasy combat content.
		safetySettings: [
			{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
			{ category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
			{
				category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
				threshold: "BLOCK_MEDIUM_AND_ABOVE",
			},
			{
				category: "HARM_CATEGORY_DANGEROUS_CONTENT",
				threshold: "BLOCK_ONLY_HIGH",
			},
		],
	};
	if (systemPrompt)
		geminiBody.systemInstruction = { parts: [{ text: systemPrompt }] };

	const errors = [];
	for (const model of models) {
		const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
		try {
			const response = await fetchWithTimeout(`${endpoint}?key=${apiKey}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(geminiBody),
			});
			if (!response.ok) {
				const err = await response.json().catch(() => ({}));
				throw new Error(
					err?.error?.message || `Gemini error ${response.status}`,
				);
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
		} catch (err) {
			errors.push(`${model}: ${err?.message || "error"}`);
			// fall through to the next free model
		}
	}
	throw new Error(errors.join(" | ") || "Gemini: no models attempted");
}
callGemini.available = () => Boolean(process.env.GEMINI_API_KEY);
callGemini.supportsImages = true;

/** Pollinations — keyless and free. Always-on last-resort fallback. */
async function callPollinations({
	prompt,
	systemPrompt,
	model: modelOverride,
}) {
	const model = modelOverride || process.env.POLLINATIONS_MODEL || "openai";
	const messages = [];
	if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
	messages.push({ role: "user", content: prompt });

	const response = await fetchWithTimeout(
		"https://text.pollinations.ai/openai",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ model, messages }),
		},
	);
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
	if (!text || !text.trim())
		throw new Error("Pollinations returned empty response");
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
	const images = normalizedImages.images;

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
		// Vision requests only run on vision-capable legs (Gemini).
		if (images.length > 0 && !provider.supportsImages) continue;
		try {
			// The model override applies only to the provider the user chose.
			const model = name === normalizedPreferred ? requestedModel : undefined;
			const result = await provider({
				prompt,
				systemPrompt,
				maxTokens,
				model,
				images,
			});
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
				: images.length > 0
					? "Image analysis needs the Gemini leg (set GEMINI_API_KEY)."
					: "No free AI provider is configured.",
		available: false,
	});
}
