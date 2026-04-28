/**
 * Vercel Serverless AI Audio Proxy — Stable Audio Open via Hugging Face
 *
 * Reads HF_API_KEY from environment variables.
 * Validates Supabase JWT, gates to Warden role (if campaignId provided),
 * calls HF Inference API, uploads the returned WAV to Supabase Storage
 * (bucket "ai-audio"), and returns the public URL.
 *
 * This is the ONLY audio-generation backend. No paid providers (per "100%
 * free app" constraint).
 *
 * Environment variables:
 *   HF_API_KEY                  Hugging Face API token (required)
 *   HF_AUDIO_MODEL              HF model id (default: facebook/musicgen-small)
 *                               Works on free serverless inference tier.
 *                               Can be set to stabilityai/stable-audio-open-1.0
 *                               on paid Inference Endpoints.
 *   VITE_SUPABASE_URL           Supabase URL (shared with client)
 *   SUPABASE_SERVICE_ROLE_KEY   Supabase service role key (server-only)
 *   ALLOWED_ORIGIN              CORS origin (default *)
 */

import { createClient } from "@supabase/supabase-js";
import lamejs from "lamejs";

const HF_BASE = "https://api-inference.huggingface.co/models";
const DEFAULT_MODEL = "facebook/musicgen-small";
const REQUEST_TIMEOUT_MS = 120_000; // 2 min — HF cold-starts can be slow
const MAX_DURATION_SECONDS = 47;
const MIN_DURATION_SECONDS = 1;
const MAX_PROMPT_LEN = 300;
const STORAGE_BUCKET = "ai-audio";

// Rate limiter: 5 per minute per user (tight — HF free tier has low quota)
const rateBuckets = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(userId) {
	const now = Date.now();
	const bucket = rateBuckets.get(userId);
	if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
		rateBuckets.set(userId, { windowStart: now, count: 1 });
		return false;
	}
	bucket.count += 1;
	return bucket.count > RATE_LIMIT_MAX;
}

const getEnv = (...keys) => {
	for (const key of keys) {
		const value = process.env[key];
		if (typeof value === "string" && value.length > 0) return value;
	}
	return null;
};

const readJsonBody = (req) => {
	if (!req.body) return {};
	if (typeof req.body === "string") {
		try {
			return JSON.parse(req.body);
		} catch {
			return {};
		}
	}
	return req.body;
};

function slugify(s) {
	return (
		String(s || "audio")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
			.slice(0, 40) || "audio"
	);
}

async function fetchWithTimeout(
	url,
	options = {},
	timeoutMs = REQUEST_TIMEOUT_MS,
) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await fetch(url, { ...options, signal: controller.signal });
	} finally {
		clearTimeout(timer);
	}
}

function detectAudioMimeType(contentType, audioBuffer) {
	const normalized = String(contentType || "").toLowerCase();
	if (normalized.includes("mpeg")) return "audio/mpeg";
	if (normalized.includes("wav") || normalized.includes("wave")) {
		return "audio/wav";
	}
	if (normalized.includes("flac")) return "audio/flac";
	if (
		audioBuffer.length >= 12 &&
		audioBuffer.toString("ascii", 0, 4) === "RIFF" &&
		audioBuffer.toString("ascii", 8, 12) === "WAVE"
	) {
		return "audio/wav";
	}
	if (
		audioBuffer.length >= 3 &&
		audioBuffer.toString("ascii", 0, 3) === "ID3"
	) {
		return "audio/mpeg";
	}
	return "application/octet-stream";
}

function decodeWavSample(view, offset, audioFormat, bitsPerSample) {
	if (audioFormat === 3) {
		if (bitsPerSample === 32) return view.getFloat32(offset, true);
		if (bitsPerSample === 64) return view.getFloat64(offset, true);
		throw new Error(`Unsupported WAV float depth: ${bitsPerSample}`);
	}
	if (audioFormat !== 1) {
		throw new Error(`Unsupported WAV audio format: ${audioFormat}`);
	}
	if (bitsPerSample === 8) return (view.getUint8(offset) - 128) / 128;
	if (bitsPerSample === 16) return view.getInt16(offset, true) / 32768;
	if (bitsPerSample === 24) {
		let sample =
			view.getUint8(offset) |
			(view.getUint8(offset + 1) << 8) |
			(view.getUint8(offset + 2) << 16);
		if (sample & 0x800000) sample |= ~0xffffff;
		return sample / 8388608;
	}
	if (bitsPerSample === 32) return view.getInt32(offset, true) / 2147483648;
	throw new Error(`Unsupported WAV PCM depth: ${bitsPerSample}`);
}

function clampToInt16(sample) {
	const clamped = Math.max(-1, Math.min(1, sample));
	return clamped < 0
		? Math.round(clamped * 32768)
		: Math.round(clamped * 32767);
}

function parseWavToPcm16(audioBuffer) {
	if (
		audioBuffer.toString("ascii", 0, 4) !== "RIFF" ||
		audioBuffer.toString("ascii", 8, 12) !== "WAVE"
	) {
		throw new Error("Invalid WAV header");
	}

	const view = new DataView(
		audioBuffer.buffer,
		audioBuffer.byteOffset,
		audioBuffer.byteLength,
	);
	let fmt = null;
	let dataOffset = -1;
	let dataSize = 0;

	for (let offset = 12; offset + 8 <= audioBuffer.length; ) {
		const chunkId = audioBuffer.toString("ascii", offset, offset + 4);
		const chunkSize = view.getUint32(offset + 4, true);
		const chunkDataOffset = offset + 8;
		if (chunkId === "fmt ") {
			fmt = {
				audioFormat: view.getUint16(chunkDataOffset, true),
				numChannels: view.getUint16(chunkDataOffset + 2, true),
				sampleRate: view.getUint32(chunkDataOffset + 4, true),
				bitsPerSample: view.getUint16(chunkDataOffset + 14, true),
			};
		} else if (chunkId === "data") {
			dataOffset = chunkDataOffset;
			dataSize = chunkSize;
		}
		offset = chunkDataOffset + chunkSize + (chunkSize % 2);
	}

	if (!fmt || dataOffset < 0 || dataSize <= 0) {
		throw new Error("Incomplete WAV data");
	}

	const bytesPerSample = fmt.bitsPerSample / 8;
	const bytesPerFrame = bytesPerSample * fmt.numChannels;
	const frameCount = Math.floor(dataSize / bytesPerFrame);
	const channelCount = fmt.numChannels > 1 ? 2 : 1;
	const channelData = Array.from(
		{ length: channelCount },
		() => new Int16Array(frameCount),
	);

	for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
		for (let channelIndex = 0; channelIndex < channelCount; channelIndex++) {
			const sampleOffset =
				dataOffset + frameIndex * bytesPerFrame + channelIndex * bytesPerSample;
			const sample = decodeWavSample(
				view,
				sampleOffset,
				fmt.audioFormat,
				fmt.bitsPerSample,
			);
			channelData[channelIndex][frameIndex] = clampToInt16(sample);
		}
	}

	return {
		sampleRate: fmt.sampleRate,
		channelData,
	};
}

function transcodeWavToMp3(audioBuffer) {
	const { sampleRate, channelData } = parseWavToPcm16(audioBuffer);
	const channelCount = channelData.length > 1 ? 2 : 1;
	const encoder = new lamejs.Mp3Encoder(
		channelCount,
		sampleRate,
		channelCount === 1 ? 96 : 128,
	);
	const chunks = [];
	const frameSize = 1152;

	for (let offset = 0; offset < channelData[0].length; offset += frameSize) {
		const left = channelData[0].subarray(offset, offset + frameSize);
		const encoded =
			channelCount === 2
				? encoder.encodeBuffer(
						left,
						channelData[1].subarray(offset, offset + frameSize),
					)
				: encoder.encodeBuffer(left);
		if (encoded.length > 0) chunks.push(Buffer.from(encoded));
	}

	const flushed = encoder.flush();
	if (flushed.length > 0) chunks.push(Buffer.from(flushed));
	if (chunks.length === 0) throw new Error("MP3 encoder returned empty output");
	return Buffer.concat(chunks);
}

export default async function handler(req, res) {
	// CORS
	const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
	res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

	if (req.method === "OPTIONS") return res.status(204).end();
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST, OPTIONS");
		return res.status(405).json({ error: "Method not allowed" });
	}

	// ── Env checks ──────────────────────────────────────────────────────
	const hfKey = getEnv("HF_API_KEY");
	if (!hfKey) {
		return res.status(503).json({
			error:
				"Audio generation not configured. Set HF_API_KEY environment variable.",
			available: false,
		});
	}

	const supabaseUrl = getEnv("VITE_SUPABASE_URL", "SUPABASE_URL");
	const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
	const anonKey = getEnv(
		"VITE_SUPABASE_PUBLISHABLE_KEY",
		"VITE_SUPABASE_ANON_KEY",
		"SUPABASE_ANON_KEY",
	);
	if (!supabaseUrl || !serviceKey || !anonKey) {
		return res.status(503).json({
			error:
				"Supabase server env missing (VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY).",
			available: false,
		});
	}

	// ── Auth ────────────────────────────────────────────────────────────
	const authHeader = req.headers?.authorization || "";
	const accessToken = authHeader.startsWith("Bearer ")
		? authHeader.slice("Bearer ".length).trim()
		: null;
	if (!accessToken) {
		return res.status(401).json({ error: "Missing access token" });
	}

	const adminClient = createClient(supabaseUrl, serviceKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false,
		},
	});
	const userClient = createClient(supabaseUrl, anonKey, {
		global: { headers: { Authorization: `Bearer ${accessToken}` } },
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false,
		},
	});

	const { data: userData, error: userErr } =
		await adminClient.auth.getUser(accessToken);
	if (userErr || !userData?.user) {
		return res.status(401).json({ error: "Invalid or expired access token" });
	}
	const userId = userData.user.id;

	// ── Parse body ──────────────────────────────────────────────────────
	const body = readJsonBody(req);
	const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
	const durationSeconds = Math.max(
		MIN_DURATION_SECONDS,
		Math.min(MAX_DURATION_SECONDS, Number(body.durationSeconds) || 10),
	);
	const kind =
		body.kind === "sfx" || body.kind === "ambient" || body.kind === "music"
			? body.kind
			: "sfx";
	const campaignId =
		typeof body.campaignId === "string" && body.campaignId.length > 0
			? body.campaignId
			: null;

	if (!prompt) {
		return res.status(400).json({ error: "prompt is required" });
	}
	if (prompt.length > MAX_PROMPT_LEN) {
		return res.status(400).json({
			error: `prompt too long (max ${MAX_PROMPT_LEN} chars)`,
		});
	}

	const { data: profileRow, error: profileErr } = await adminClient
		.from("profiles")
		.select("role")
		.eq("id", userId)
		.maybeSingle();

	if (profileErr) {
		return res.status(403).json({ error: "Unable to verify Warden access" });
	}

	const normalizedProfileRole = String(profileRow?.role || "").toLowerCase();
	const hasGlobalWardenRole =
		normalizedProfileRole === "warden" ||
		normalizedProfileRole === "admin" ||
		normalizedProfileRole === "dm";

	let hasCampaignWardenAccess = false;
	if (campaignId) {
		const { data: memberRow, error: memberErr } = await userClient
			.from("campaign_members")
			.select("role")
			.eq("campaign_id", campaignId)
			.eq("user_id", userId)
			.maybeSingle();

		if (memberErr) {
			return res.status(403).json({ error: "Unable to verify campaign role" });
		}

		let role = memberRow?.role ?? null;
		if (!role) {
			const { data: campaignRow } = await userClient
				.from("campaigns")
				.select("warden_id, dm_id")
				.eq("id", campaignId)
				.maybeSingle();
			if (
				campaignRow &&
				(campaignRow.warden_id === userId || campaignRow.dm_id === userId)
			) {
				role = "warden";
			}
		}

		hasCampaignWardenAccess =
			role === "warden" || role === "co-warden" || role === "dm";
	}

	if (!hasGlobalWardenRole && !hasCampaignWardenAccess) {
		return res
			.status(403)
			.json({ error: "Audio generation is restricted to the Warden" });
	}

	// ── Rate limit ──────────────────────────────────────────────────────
	if (isRateLimited(userId)) {
		return res.status(429).json({
			error: `Rate limit exceeded (${RATE_LIMIT_MAX}/min). Try again shortly.`,
		});
	}

	// ── Call HF Inference API ───────────────────────────────────────────
	const model = getEnv("HF_AUDIO_MODEL") || DEFAULT_MODEL;
	const hfUrl = `${HF_BASE}/${model}`;

	// musicgen-small uses `inputs: string`; stable-audio-open accepts
	// `{ inputs: string, parameters: { duration } }`. Both tolerate the
	// parameters being present even if unused.
	const hfPayload = {
		inputs: prompt,
		parameters: { duration: durationSeconds },
		options: { wait_for_model: true },
	};

	let hfResponse;
	try {
		hfResponse = await fetchWithTimeout(hfUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${hfKey}`,
				"Content-Type": "application/json",
				Accept: "audio/mpeg, audio/wav, application/json",
			},
			body: JSON.stringify(hfPayload),
		});
	} catch (err) {
		if (err.name === "AbortError") {
			return res.status(504).json({
				error:
					"Hugging Face request timed out. The model may be cold-starting — try again in 30 seconds.",
				available: true,
				retryAfterSeconds: 30,
			});
		}
		return res.status(502).json({
			error: `Hugging Face request failed: ${err.message || err}`,
			available: true,
		});
	}

	if (!hfResponse.ok) {
		// Model loading state
		if (hfResponse.status === 503) {
			const errJson = await hfResponse.json().catch(() => ({}));
			const estimated = Number(errJson?.estimated_time || 20);
			return res.status(503).json({
				error: "Audio model is warming up. Please retry shortly.",
				status: "model_loading",
				available: true,
				retryAfterSeconds: Math.ceil(estimated),
			});
		}
		// Rate-limit from HF
		if (hfResponse.status === 429) {
			return res.status(429).json({
				error: "Hugging Face rate limit hit. Try again in a minute.",
				available: true,
			});
		}
		const errText = await hfResponse.text().catch(() => "");
		return res.status(502).json({
			error: `HF error ${hfResponse.status}: ${errText.slice(0, 300)}`,
			available: true,
		});
	}

	const contentType = hfResponse.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		// Some HF models return JSON error instead of binary audio
		const errJson = await hfResponse.json().catch(() => ({}));
		return res.status(502).json({
			error:
				errJson?.error ||
				"HF returned JSON instead of audio — model may not support audio generation",
			available: true,
		});
	}

	const audioArrayBuffer = await hfResponse.arrayBuffer();
	if (audioArrayBuffer.byteLength < 1000) {
		return res
			.status(502)
			.json({ error: "HF returned suspiciously small audio payload" });
	}

	let audioBuffer = Buffer.from(audioArrayBuffer);
	let mimeType = detectAudioMimeType(contentType, audioBuffer);
	let extension =
		mimeType === "audio/mpeg"
			? "mp3"
			: mimeType === "audio/wav"
				? "wav"
				: "bin";

	if (mimeType === "audio/wav") {
		try {
			audioBuffer = transcodeWavToMp3(audioBuffer);
			mimeType = "audio/mpeg";
			extension = "mp3";
		} catch (err) {
			return res.status(502).json({
				error: `Failed to transcode WAV to MP3: ${err.message || err}`,
				available: true,
			});
		}
	}

	if (mimeType !== "audio/mpeg") {
		return res.status(502).json({
			error: `HF returned unsupported audio format: ${mimeType}`,
			available: true,
		});
	}

	// ── Upload to Supabase Storage ──────────────────────────────────────
	const timestamp = Date.now();
	const slug = slugify(prompt);
	const storagePath = `${userId}/${timestamp}-${kind}-${slug}.${extension}`;

	const { error: uploadError } = await adminClient.storage
		.from(STORAGE_BUCKET)
		.upload(storagePath, audioBuffer, {
			contentType: mimeType,
			upsert: false,
			cacheControl: "31536000",
		});

	if (uploadError) {
		return res.status(500).json({
			error: `Failed to upload audio to storage: ${uploadError.message}`,
			available: true,
		});
	}

	const { data: publicUrlData } = adminClient.storage
		.from(STORAGE_BUCKET)
		.getPublicUrl(storagePath);

	return res.status(200).json({
		success: true,
		audioUrl: publicUrlData?.publicUrl,
		storagePath,
		mimeType,
		bytes: audioBuffer.byteLength,
		provider: model,
		prompt,
		kind,
		durationSeconds,
		createdAt: new Date(timestamp).toISOString(),
	});
}
