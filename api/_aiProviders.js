/**
 * Shared FREE AI provider chain — single source of truth for BOTH the Vercel
 * serverless proxy (api/ai.js) and the Vite dev middleware (vite.config.ts),
 * so local dev and production can never drift apart. The `_` filename prefix
 * keeps Vercel from treating this as a routable function while still bundling
 * it for import.
 *
 * Tries an ordered list of 100% FREE providers and returns the first success.
 * All keys stay server-side. The keyless Pollinations leg guarantees the app
 * works with ZERO configuration.
 *
 * Order (AI_PROVIDER_ORDER, comma-separated) defaults to: gemini, openrouter,
 * pollinations. Gemini `gemini-flash-latest` leads (Google's rolling free-tier
 * flagship alias; vision, 1M ctx — exact-version IDs 404 on the free tier).
 * OpenRouter adds the strongest current :free models + a free VISION ladder.
 * Pollinations is the keyless TEXT fallback (its keyless tier 402s on images, so
 * vision needs a Gemini or OpenRouter key). (Groq intentionally excluded.)
 */

export const MAX_OUTPUT_TOKENS = 4096;
export const REQUEST_TIMEOUT_MS = 30000;

// ── Best-in-class FREE model ladders (web-verified July 2026) ───────────────
// Each leg tries its models in order and falls through on any per-model error
// (404 model-not-found, rate limit, empty response). GEMINI_MODEL /
// OPENROUTER_MODEL / OPENROUTER_VISION_MODEL env vars prepend.
export const DEFAULT_GEMINI_MODELS = [
	// Google's rolling alias to the latest stable free Flash (vision, 1M ctx).
	// Verified live against the API — exact-version IDs like "gemini-3.5-flash"
	// 404 on the free tier, so we lead with the alias and keep an explicit
	// lite fallback for when the flagship is throttled.
	"gemini-flash-latest",
	"gemini-3.1-flash-lite",
];
export const DEFAULT_OPENROUTER_MODELS = [
	"nvidia/nemotron-3-ultra-550b-a55b:free", // strongest free general/reasoning
	"google/gemma-4-31b-it:free", // top free general quality (also vision)
	"nvidia/nemotron-3-super-120b-a12b:free", // strong long-context generation
	"openai/gpt-oss-20b:free",
	"nvidia/nemotron-nano-9b-v2:free",
];
// Free VISION/multimodal models (image input) for the OpenRouter leg — best-first
// so multimodal degrades gracefully when Gemini is unavailable.
export const DEFAULT_OPENROUTER_VISION_MODELS = [
	"google/gemma-4-31b-it:free", // best free VLM (262K ctx, 140+ languages)
	"nvidia/nemotron-nano-12b-v2-vl:free", // strong dedicated vision model
	"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", // omni text+image+video
];

// ── Optional multimodal input ───────────────────────────────────────────────
// `images` accepts base64 image data-URLs ("data:image/png;base64,…") or
// { mimeType, data } pairs. The chain skips any leg without `supportsImages`,
// so images only reach the keyed vision legs (Gemini, OpenRouter VLMs).
export const MAX_IMAGES = 4;
const MAX_IMAGE_BASE64_CHARS = 6_000_000; // ≈4.5MB binary per image

export function normalizeImages(raw) {
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
export function buildModelAttempts(override, envModel, defaults) {
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

export function fetchWithTimeout(url, options, timeoutMs = REQUEST_TIMEOUT_MS) {
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

/** OpenRouter free models — OpenAI-compatible. Best-in-class free quality.
 *  Vision-capable: with images, it uses the free VLM ladder and OpenAI-style
 *  multimodal content parts. */
async function callOpenRouter({
	prompt,
	systemPrompt,
	maxTokens,
	model: modelOverride,
	images = [],
}) {
	const apiKey = process.env.OPENROUTER_API_KEY;
	const hasImages = images.length > 0;
	const models = buildModelAttempts(
		modelOverride,
		hasImages
			? process.env.OPENROUTER_VISION_MODEL
			: process.env.OPENROUTER_MODEL,
		hasImages ? DEFAULT_OPENROUTER_VISION_MODELS : DEFAULT_OPENROUTER_MODELS,
	);
	const messages = [];
	if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
	messages.push({
		role: "user",
		content: hasImages
			? [
					{ type: "text", text: prompt },
					...images.map(({ mimeType, data }) => ({
						type: "image_url",
						image_url: { url: `data:${mimeType};base64,${data}` },
					})),
				]
			: prompt,
	});

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
callOpenRouter.supportsImages = true;

/** Google Gemini free tier (generous, strong). Vision-capable. Raw REST (no SDK)
 *  so the exact same code runs in the Vercel function and the Vite dev proxy. */
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

/** Pollinations — keyless and free. Always-on last-resort fallback for TEXT.
 *  Verified live: its keyless tier returns HTTP 402 for image input, so it is
 *  NOT a vision provider — image requests skip it (see supportsImages absence)
 *  and fall to the keyed Gemini/OpenRouter vision legs. */
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
	if (!text?.trim()) throw new Error("Pollinations returned empty response");
	return { text, model: `pollinations:${model}`, usage: {} };
}
callPollinations.available = () => true;
// Text-only — no `supportsImages`, so the chain skips it for image requests.

export const PROVIDERS = {
	openrouter: callOpenRouter,
	gemini: callGemini,
	pollinations: callPollinations,
};

export function getProviderOrder(preferred) {
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

/**
 * Run the ordered free-provider chain and return the first success. Pure of any
 * HTTP framework so both the Vercel handler and the Vite dev middleware call it
 * identically. Returns { ok:true, text, model, usage, provider } on success, or
 * { ok:false, error } when every available/eligible provider failed.
 */
export async function runProviderChain({
	prompt,
	systemPrompt,
	maxTokens,
	provider: preferredProvider,
	model: preferredModel,
	images = [],
}) {
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
		// Vision requests only run on vision-capable legs.
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
			return {
				ok: true,
				text: result.text,
				model: result.model,
				usage: result.usage || {},
				provider: name,
			};
		} catch (err) {
			errors.push(`${name}: ${err?.message || "error"}`);
			// try the next free provider
		}
	}
	return {
		ok: false,
		error:
			errors.length > 0
				? `All free AI providers failed. ${errors.join(" | ")}`
				: images.length > 0
					? "Image analysis needs a Gemini or OpenRouter API key."
					: "No free AI provider is available.",
	};
}
