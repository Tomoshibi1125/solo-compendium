#!/usr/bin/env node
/**
 * Local SDXL asset generation workflow for Rift Ascendant.
 *
 * Examples:
 *   node scripts/generate-rift-assets.mjs --dry-run
 *   node scripts/generate-rift-assets.mjs --backend auto --limit 10
 *   node scripts/generate-rift-assets.mjs --backend a1111 --sd-url http://127.0.0.1:7860 --limit 10
 *   node scripts/generate-rift-assets.mjs --backend comfy --sd-url http://127.0.0.1:8188 --limit 10
 *   node scripts/generate-rift-assets.mjs --backend auto --checkpoint "sd_xl_base_1.0" --limit 10
 *   node scripts/generate-rift-assets.mjs --apply
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import {
	appendFile,
	copyFile,
	mkdir,
	readFile,
	rename,
	rm,
	writeFile,
} from "node:fs/promises";
import http from "node:http";
import https from "node:https";
import {
	basename,
	dirname,
	extname,
	join,
	relative,
	resolve,
} from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");
const PROMPTS_FILE = join(ROOT, "data", "rift-image-prompts.json");
const PLAN_FILE = join(ROOT, "data", "rift-image-replacement-plan.json");
const CANDIDATE_DIR = join(
	PUBLIC_DIR,
	"generated",
	"rift-ascendant-candidates",
);
const BACKUP_ROOT = join(PUBLIC_DIR, "generated", "original-backups");
const DOCS_DIR = join(ROOT, "docs");
const COMFY_EXAMPLE_WORKFLOW = join(
	ROOT,
	"config",
	"comfy-rift-sdxl-workflow-api.example.json",
);
const COMFY_WORKFLOW = join(ROOT, "config", "comfy-rift-sdxl-workflow-api.json");

const DEFAULT_CHECKPOINT = "stabilityai/stable-diffusion-xl-base-1.0";
const DEFAULT_A1111_URL = "http://127.0.0.1:7860";
const DEFAULT_COMFY_URL = "http://127.0.0.1:8188";
const DEFAULT_BACKEND = "auto";
const A1111_GENERATION_TIMEOUT_MS = Number(
	process.env.RIFT_A1111_TIMEOUT_MS ?? 1_200_000,
);
const COMFY_GENERATION_TIMEOUT_MS = Number(
	process.env.RIFT_COMFY_TIMEOUT_MS ?? 1_200_000,
);

const SUPPORTED_TYPES = new Set([
	"character",
	"anomaly",
	"regent",
	"location",
	"item",
	"relic",
	"weapon",
	"armor",
	"vehicle",
	"mount",
	"power",
	"technique",
	"background",
	"token",
	"map",
	"monster",
	"spell",
	"ui",
]);

function parseArgs(argv) {
	const args = {
		dryRun: false,
		apply: false,
		limit: null,
		variants: 1,
		backend: DEFAULT_BACKEND,
		sdUrl: null,
		checkpoint: process.env.RIFT_SD_CHECKPOINT || DEFAULT_CHECKPOINT,
		seed: null,
		onlyHighPriority: false,
		type: null,
		promptId: null,
		candidate: null,
		allReviewed: false,
		allowCurrentModel: false,
		skipExisting: false,
		continueOnError: false,
		skipPostApplyChecks: false,
	};

	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];
		if (arg === "--dry-run") args.dryRun = true;
		else if (arg === "--apply") args.apply = true;
		else if (arg === "--only-high-priority") args.onlyHighPriority = true;
		else if (arg === "--allow-current-model") args.allowCurrentModel = true;
		else if (arg === "--skip-existing") args.skipExisting = true;
		else if (arg === "--continue-on-error") args.continueOnError = true;
		else if (arg === "--skip-post-apply-checks") args.skipPostApplyChecks = true;
		else if (arg === "--all-reviewed") args.allReviewed = true;
		else if (arg === "--limit") args.limit = Number(argv[++i]);
		else if (arg === "--variants") args.variants = Math.max(1, Number(argv[++i]));
		else if (arg === "--backend") args.backend = String(argv[++i] ?? "auto");
		else if (arg === "--sd-url") args.sdUrl = String(argv[++i] ?? "");
		else if (arg === "--checkpoint") args.checkpoint = String(argv[++i] ?? "");
		else if (arg === "--seed") args.seed = Number(argv[++i]);
		else if (arg === "--type") args.type = normalizeType(argv[++i] ?? "");
		else if (arg === "--prompt-id") args.promptId = String(argv[++i] ?? "");
		else if (arg === "--candidate") args.candidate = String(argv[++i] ?? "");
		else if (arg === "--help" || arg === "-h") {
			printHelp();
			process.exit(0);
		}
	}

	if (!["auto", "a1111", "comfy"].includes(args.backend)) {
		throw new Error(`Unsupported backend: ${args.backend}`);
	}
	if (args.type && !SUPPORTED_TYPES.has(args.type)) {
		throw new Error(`Unsupported type filter: ${args.type}`);
	}
	if (args.limit !== null && (!Number.isFinite(args.limit) || args.limit < 1)) {
		throw new Error("--limit must be a positive number");
	}
	if (!Number.isFinite(args.variants) || args.variants < 1) {
		throw new Error("--variants must be a positive number");
	}
	if (args.seed !== null && !Number.isFinite(args.seed)) {
		throw new Error("--seed must be a number");
	}
	return args;
}

function printHelp() {
	console.log(`Rift Ascendant local SDXL asset generator

Commands:
  node scripts/generate-rift-assets.mjs --dry-run
  node scripts/generate-rift-assets.mjs --backend auto --limit 10
  node scripts/generate-rift-assets.mjs --backend a1111 --sd-url http://127.0.0.1:7860 --limit 10
  node scripts/generate-rift-assets.mjs --backend comfy --sd-url http://127.0.0.1:8188 --limit 10
  node scripts/generate-rift-assets.mjs --backend auto --checkpoint "sd_xl_base_1.0" --limit 10
  node scripts/generate-rift-assets.mjs --apply

Options:
  --dry-run                Write prompt pack and galleries without SD calls.
  --limit N                Limit prompt records.
  --variants N             Generate N candidates per prompt.
  --backend auto|a1111|comfy
  --sd-url URL             Override backend URL.
  --checkpoint NAME        Override SD checkpoint/model.
  --seed NUMBER            Override all prompt seeds.
  --apply                  Apply reviewed high-confidence candidates only.
  --only-high-priority     Filter to high-priority prompts.
  --type TYPE              Filter by asset type.
  --prompt-id ID           Filter to one prompt record id.
  --candidate PATH         Apply one exact reviewed candidate path.
  --all-reviewed           Allow applying every current reviewed candidate.
  --allow-current-model    Continue if requested checkpoint is unavailable.
  --skip-existing          Skip prompt records with matching local candidates.
  --continue-on-error      Log failed prompt records and keep generating.
  --skip-post-apply-checks Skip audit/package checks after apply.
`);
}

function normalizeType(value) {
	return String(value ?? "").toLowerCase();
}

async function readJson(file) {
	return JSON.parse(await readFile(file, "utf8"));
}

function appPathToDisk(appPath) {
	const clean = appPath.replace(/^\//, "");
	if (clean.startsWith("public/")) return join(ROOT, clean);
	return join(PUBLIC_DIR, clean);
}

function diskPathToAppPath(diskPath) {
	const rel = relative(PUBLIC_DIR, diskPath).replace(/\\/g, "/");
	return `/${rel}`;
}

function timestamp() {
	return new Date().toISOString().replace(/[:.]/g, "-");
}

async function writeTextFileWithRetry(file, content, encoding = "utf8") {
	const delays = [75, 150, 300, 600, 1000];
	let lastError = null;
	for (let attempt = 0; attempt <= delays.length; attempt += 1) {
		try {
			await writeFile(file, content, encoding);
			return;
		} catch (error) {
			lastError = error;
			if (!["UNKNOWN", "EBUSY", "EPERM", "EACCES"].includes(error.code)) {
				throw error;
			}
			if (attempt === delays.length) break;
			await wait(delays[attempt]);
		}
	}
	throw lastError;
}

function selectedPrompts(prompts, args) {
	let selected = prompts;
	if (args.onlyHighPriority) {
		selected = selected.filter((prompt) => prompt.priority === "high");
	}
	if (args.type) {
		selected = selected.filter((prompt) => normalizeType(prompt.type) === args.type);
	}
	if (args.promptId) {
		selected = selected.filter((prompt) => prompt.promptRecordId === args.promptId);
	}
	if (args.skipExisting) {
		selected = selected.filter((prompt) => !promptHasExistingCandidate(prompt, args));
	}
	if (args.limit !== null) {
		selected = selected.slice(0, args.limit);
	}
	return selected;
}

function promptHasExistingCandidate(prompt, args) {
	for (let variant = 0; variant < args.variants; variant += 1) {
		const seed = args.seed ?? prompt.seed + variant;
		const plannedDiskPath = appPathToDisk(candidateAppPath(prompt, seed, variant, "png"));
		if (!existingCandidateMatchesPrompt(plannedDiskPath, prompt, seed)) {
			return false;
		}
	}
	return true;
}

async function ensureCandidateDir() {
	await mkdir(CANDIDATE_DIR, { recursive: true });
}

async function ensureComfyExampleWorkflow() {
	if (existsSync(COMFY_EXAMPLE_WORKFLOW)) return;
	await mkdir(dirname(COMFY_EXAMPLE_WORKFLOW), { recursive: true });
	const workflow = {
		"1": {
			class_type: "CheckpointLoaderSimple",
			inputs: { ckpt_name: "sd_xl_base_1.0.safetensors" },
			_meta: { title: "Load SDXL Base checkpoint" },
		},
		"2": {
			class_type: "CLIPTextEncode",
			inputs: {
				text: "RIFT_POSITIVE_PROMPT",
				clip: ["1", 1],
			},
			_meta: { title: "Positive prompt" },
		},
		"3": {
			class_type: "CLIPTextEncode",
			inputs: {
				text: "RIFT_NEGATIVE_PROMPT",
				clip: ["1", 1],
			},
			_meta: { title: "Negative prompt" },
		},
		"4": {
			class_type: "EmptyLatentImage",
			inputs: {
				width: 1024,
				height: 1024,
				batch_size: 1,
			},
			_meta: { title: "Latent size" },
		},
		"5": {
			class_type: "KSampler",
			inputs: {
				seed: 1,
				steps: 30,
				cfg: 7,
				sampler_name: "dpmpp_2m",
				scheduler: "karras",
				denoise: 1,
				model: ["1", 0],
				positive: ["2", 0],
				negative: ["3", 0],
				latent_image: ["4", 0],
			},
			_meta: { title: "Sampler" },
		},
		"6": {
			class_type: "VAEDecode",
			inputs: {
				samples: ["5", 0],
				vae: ["1", 2],
			},
			_meta: { title: "Decode" },
		},
		"7": {
			class_type: "SaveImage",
			inputs: {
				filename_prefix: "rift_ascendant",
				images: ["6", 0],
			},
			_meta: { title: "Save image" },
		},
	};
	await writeTextFileWithRetry(
		COMFY_EXAMPLE_WORKFLOW,
		`${JSON.stringify(workflow, null, 2)}\n`,
		"utf8",
	);
}

async function requestBuffer(url, options = {}, timeoutMs = 4000, redirects = 0) {
	const parsed = new URL(url);
	const client = parsed.protocol === "https:" ? https : http;
	const body = options.body ? Buffer.from(options.body) : null;
	const headers = { ...(options.headers ?? {}) };
	if (body && !headers["content-length"]) {
		headers["content-length"] = String(body.length);
	}

	return await new Promise((resolve, reject) => {
		const req = client.request(
			parsed,
			{ method: options.method ?? "GET", headers },
			(res) => {
				if (
					res.statusCode >= 300 &&
					res.statusCode < 400 &&
					res.headers.location &&
					redirects < 5
				) {
					res.resume();
					const nextUrl = new URL(res.headers.location, parsed).toString();
					requestBuffer(nextUrl, options, timeoutMs, redirects + 1)
						.then(resolve)
						.catch(reject);
					return;
				}
				const chunks = [];
				res.on("data", (chunk) => chunks.push(chunk));
				res.on("end", () => {
					const buffer = Buffer.concat(chunks);
					if (res.statusCode < 200 || res.statusCode >= 300) {
						reject(
							new Error(
								`${res.statusCode} ${res.statusMessage}: ${buffer.toString("utf8", 0, 500)}`,
							),
						);
						return;
					}
					resolve(buffer);
				});
			},
		);
		req.setTimeout(timeoutMs, () => {
			req.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
		});
		req.on("error", reject);
		if (body) req.write(body);
		req.end();
	});
}

async function fetchJson(url, options = {}, timeoutMs = 4000) {
	const buffer = await requestBuffer(url, options, timeoutMs);
	return JSON.parse(buffer.toString("utf8"));
}

async function fetchBytes(url, timeoutMs = 30000) {
	return await requestBuffer(url, {}, timeoutMs);
}

function normalizeCheckpointName(value) {
	return String(value ?? "")
		.toLowerCase()
		.replace(/stabilityai\//g, "")
		.replace(/\.(safetensors|ckpt|pt)$/g, "")
		.replace(/[^a-z0-9]+/g, "");
}

function checkpointMatches(modelName, requested) {
	const model = normalizeCheckpointName(modelName);
	const req = normalizeCheckpointName(requested);
	if (!req) return true;
	if (model.includes(req) || req.includes(model)) return true;
	const sdxlBaseAliases = [
		"stablediffusionxlbase10",
		"sdxlbase10",
		"sdxlbase",
		"sdxl10",
		"sdxl",
	];
	if (
		req.includes("stablediffusionxlbase10") ||
		req.includes("sdxlbase10") ||
		req.includes("sdxlbase")
	) {
		return sdxlBaseAliases.some((alias) => model.includes(alias));
	}
	return false;
}

function findA1111Checkpoint(models, requested) {
	for (const model of models) {
		const candidates = [
			model.title,
			model.model_name,
			model.name,
			model.filename,
			model.hash,
		].filter(Boolean);
		if (candidates.some((candidate) => checkpointMatches(candidate, requested))) {
			return model.title || model.model_name || model.filename;
		}
	}
	return null;
}

function findComfyCheckpoint(objectInfo, requested) {
	const node = objectInfo?.CheckpointLoaderSimple;
	const names = node?.input?.required?.ckpt_name?.[0] ?? [];
	for (const name of names) {
		if (checkpointMatches(name, requested)) return name;
	}
	return null;
}

async function detectA1111(url, checkpoint, allowCurrentModel) {
	try {
		const [options, models] = await Promise.all([
			fetchJson(`${url}/sdapi/v1/options`),
			fetchJson(`${url}/sdapi/v1/sd-models`),
		]);
		const matchedCheckpoint = findA1111Checkpoint(models, checkpoint);
		if (!matchedCheckpoint && !allowCurrentModel) {
			return {
				ok: false,
				backend: "a1111",
				url,
				reason: "checkpoint-missing",
				options,
				models,
			};
		}
		return {
			ok: true,
			backend: "a1111",
			url,
			options,
			models,
			checkpoint: matchedCheckpoint ?? options.sd_model_checkpoint ?? null,
			usingCurrentModel: !matchedCheckpoint,
		};
	} catch (error) {
		return { ok: false, backend: "a1111", url, reason: error.message };
	}
}

async function detectComfy(url, checkpoint, allowCurrentModel) {
	try {
		const stats = await fetchJson(`${url}/system_stats`).catch(() => null);
		const objectInfo = await fetchJson(`${url}/object_info`).catch(() => null);
		if (!stats && !objectInfo) {
			return { ok: false, backend: "comfy", url, reason: "no-api-response" };
		}
		const matchedCheckpoint = objectInfo
			? findComfyCheckpoint(objectInfo, checkpoint)
			: null;
		if (objectInfo && !matchedCheckpoint && !allowCurrentModel) {
			return {
				ok: false,
				backend: "comfy",
				url,
				reason: "checkpoint-missing",
				objectInfo,
			};
		}
		return {
			ok: true,
			backend: "comfy",
			url,
			stats,
			objectInfo,
			checkpoint: matchedCheckpoint ?? checkpoint,
			usingCurrentModel: !matchedCheckpoint,
		};
	} catch (error) {
		return { ok: false, backend: "comfy", url, reason: error.message };
	}
}

async function detectBackend(args) {
	const a1111Url =
		args.backend === "a1111" ? args.sdUrl || DEFAULT_A1111_URL : DEFAULT_A1111_URL;
	const comfyUrl =
		args.backend === "comfy" ? args.sdUrl || DEFAULT_COMFY_URL : DEFAULT_COMFY_URL;

	if (args.backend === "a1111") {
		return await detectA1111(a1111Url, args.checkpoint, args.allowCurrentModel);
	}
	if (args.backend === "comfy") {
		return await detectComfy(comfyUrl, args.checkpoint, args.allowCurrentModel);
	}

	const a1111 = await detectA1111(
		args.sdUrl || DEFAULT_A1111_URL,
		args.checkpoint,
		args.allowCurrentModel,
	);
	if (a1111.ok) return a1111;
	const comfy = await detectComfy(
		args.sdUrl || DEFAULT_COMFY_URL,
		args.checkpoint,
		args.allowCurrentModel,
	);
	if (comfy.ok) return comfy;
	return {
		ok: false,
		backend: "auto",
		a1111,
		comfy,
		reason: "no-supported-backend",
	};
}

function printSetupInstructions(reason, checkpoint) {
	console.warn("");
	console.warn("[setup] Stable Diffusion backend is not ready.");
	if (reason) console.warn(`[setup] Reason: ${reason}`);
	console.warn(`[setup] Required default checkpoint: ${checkpoint}`);
	console.warn("");
	console.warn("AUTOMATIC1111:");
	console.warn(`  1. Install SDXL Base 1.0 from Hugging Face: ${DEFAULT_CHECKPOINT}`);
	console.warn(
		"  2. Place the checkpoint in stable-diffusion-webui/models/Stable-diffusion/",
	);
	console.warn("  3. Launch webui with --api");
	console.warn(`  4. Retry with --backend a1111 --sd-url ${DEFAULT_A1111_URL}`);
	console.warn("");
	console.warn("ComfyUI:");
	console.warn(`  1. Install SDXL Base 1.0 from Hugging Face: ${DEFAULT_CHECKPOINT}`);
	console.warn("  2. Place checkpoints in ComfyUI/models/checkpoints/");
	console.warn(
		"  3. Export an API workflow to config/comfy-rift-sdxl-workflow-api.json",
	);
	console.warn(`  4. Retry with --backend comfy --sd-url ${DEFAULT_COMFY_URL}`);
	console.warn("");
	console.warn(
		"Note: Hugging Face may prompt for an account/token before model download.",
	);
}

async function writePromptPack(prompts, args, backendInfo) {
	await ensureCandidateDir();
	const file = join(CANDIDATE_DIR, `prompt-pack-${timestamp()}.json`);
	const payload = {
		generatedAt: new Date().toISOString(),
		dryRun: true,
		backend: backendInfo?.backend ?? "dry-run",
		checkpoint: args.checkpoint,
		count: prompts.length,
		prompts,
	};
	await writeTextFileWithRetry(
		file,
		`${JSON.stringify(payload, null, 2)}\n`,
		"utf8",
	);
	await writeReviewGalleries(prompts, await readCandidateSidecars());
	console.log(`[dry-run] Wrote prompt pack: ${file}`);
	console.log("[dry-run] Review gallery: docs/generated-image-review.html");
}

async function generateWithA1111(prompts, args, backendInfo) {
	await ensureCandidateDir();
	await ensureA1111CheckpointLoaded(backendInfo);
	const sidecars = [];
	for (const prompt of prompts) {
		for (let variant = 0; variant < args.variants; variant += 1) {
			const seed = args.seed ?? prompt.seed + variant;
			const plannedCandidatePath = candidateAppPath(prompt, seed, variant, "png");
			const plannedDiskPath = appPathToDisk(plannedCandidatePath);
			if (existingCandidateMatchesPrompt(plannedDiskPath, prompt, seed)) {
				console.log(`[a1111] Skipped existing ${plannedCandidatePath}`);
				continue;
			}
			if (hasOutdatedCandidate(plannedDiskPath)) {
				console.log(`[a1111] Regenerating changed prompt ${plannedCandidatePath}`);
			}
			try {
				const payload = {
					prompt: prompt.positivePrompt,
					negative_prompt: prompt.negativePrompt,
					width: prompt.width,
					height: prompt.height,
					steps: prompt.steps,
					cfg_scale: prompt.cfgScale,
					sampler_name: prompt.sampler || "DPM++ 2M Karras",
					scheduler: prompt.scheduler || "Karras",
					seed,
					batch_size: 1,
					n_iter: 1,
					override_settings: {},
				};
				const result = await fetchJson(
					`${backendInfo.url}/sdapi/v1/txt2img`,
					{
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify(payload),
					},
					A1111_GENERATION_TIMEOUT_MS,
				);
				const imageBase64 = result.images?.[0];
				if (!imageBase64) {
					throw new Error(`A1111 returned no image for ${prompt.assetPath}`);
				}
				const candidatePath = await saveBase64Candidate(
					imageBase64,
					prompt,
					seed,
					variant,
					"png",
				);
				const sidecar = await writeSidecar(prompt, {
					candidatePath,
					backend: "a1111",
					checkpoint: backendInfo.checkpoint || args.checkpoint,
					seed,
				});
				sidecars.push(sidecar);
				console.log(`[a1111] Generated ${candidatePath}`);
			} catch (error) {
				await handleGenerationError(error, prompt, variant, seed, "a1111", args);
			}
		}
	}
	await writeReviewGalleries(prompts, [...(await readCandidateSidecars()), ...sidecars]);
}

async function ensureA1111CheckpointLoaded(backendInfo) {
	if (backendInfo.usingCurrentModel || !backendInfo.checkpoint) return;
	if (checkpointMatches(backendInfo.options?.sd_model_checkpoint, backendInfo.checkpoint)) {
		return;
	}
	console.log(`[a1111] Loading checkpoint once: ${backendInfo.checkpoint}`);
	await requestBuffer(
		`${backendInfo.url}/sdapi/v1/options`,
		{
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ sd_model_checkpoint: backendInfo.checkpoint }),
		},
		A1111_GENERATION_TIMEOUT_MS,
	);
}

async function saveBase64Candidate(imageBase64, prompt, seed, variant, extension) {
	const clean = imageBase64.replace(/^data:image\/\w+;base64,/, "");
	const bytes = Buffer.from(clean, "base64");
	const diskPath = candidateDiskPath(prompt, seed, variant, extension);
	await writeFile(diskPath, bytes);
	return diskPathToAppPath(diskPath);
}

function candidateFileName(prompt, seed, variant, extension) {
	return `${prompt.outputBaseName}-v${variant + 1}-${seed}.${extension}`;
}

function candidateDiskPath(prompt, seed, variant, extension) {
	return join(CANDIDATE_DIR, candidateFileName(prompt, seed, variant, extension));
}

function candidateAppPath(prompt, seed, variant, extension) {
	return diskPathToAppPath(candidateDiskPath(prompt, seed, variant, extension));
}

function existingCandidateMatchesPrompt(diskPath, prompt, seed) {
	if (!existsSync(diskPath) || !existsSync(`${diskPath}.json`)) return false;
	try {
		const sidecar = JSON.parse(readFileSync(`${diskPath}.json`, "utf8"));
		return (
			sidecar.promptRecordId === prompt.promptRecordId &&
			sidecar.prompt === prompt.positivePrompt &&
			sidecar.negativePrompt === prompt.negativePrompt &&
			normalizeType(sidecar.assetType) === normalizeType(prompt.type) &&
			Number(sidecar.seed) === Number(seed) &&
			Number(sidecar.width) === Number(prompt.width) &&
			Number(sidecar.height) === Number(prompt.height) &&
			Number(sidecar.steps) === Number(prompt.steps)
		);
	} catch {
		return false;
	}
}

function hasOutdatedCandidate(diskPath) {
	return existsSync(diskPath) && existsSync(`${diskPath}.json`);
}

async function generateWithComfy(prompts, args, backendInfo) {
	await ensureCandidateDir();
	await ensureComfyExampleWorkflow();
	if (!existsSync(COMFY_WORKFLOW)) {
		printSetupInstructions("ComfyUI workflow JSON is missing.", args.checkpoint);
		console.warn(
			`[comfy] Created/verified example workflow: ${COMFY_EXAMPLE_WORKFLOW}`,
		);
		await writePromptPack(prompts, args, backendInfo);
		return;
	}

	const baseWorkflow = await readJson(COMFY_WORKFLOW);
	const sidecars = [];
	for (const prompt of prompts) {
		for (let variant = 0; variant < args.variants; variant += 1) {
			const seed = args.seed ?? prompt.seed + variant;
			const plannedCandidatePath = candidateAppPath(prompt, seed, variant, "png");
			const plannedDiskPath = appPathToDisk(plannedCandidatePath);
			if (existingCandidateMatchesPrompt(plannedDiskPath, prompt, seed)) {
				console.log(`[comfy] Skipped existing ${plannedCandidatePath}`);
				continue;
			}
			if (hasOutdatedCandidate(plannedDiskPath)) {
				console.log(`[comfy] Regenerating changed prompt ${plannedCandidatePath}`);
			}
			try {
				const workflow = patchComfyWorkflow(baseWorkflow, prompt, seed, backendInfo);
				const queued = await fetchJson(
					`${backendInfo.url}/prompt`,
					{
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({
							prompt: workflow,
							client_id: `rift-assets-${Date.now()}`,
						}),
					},
					30000,
				);
				const promptId = queued.prompt_id;
				if (!promptId) throw new Error("ComfyUI did not return prompt_id");
				const imageInfo = await pollComfyImage(backendInfo.url, promptId);
				const viewUrl = new URL(`${backendInfo.url}/view`);
				viewUrl.searchParams.set("filename", imageInfo.filename);
				if (imageInfo.subfolder) {
					viewUrl.searchParams.set("subfolder", imageInfo.subfolder);
				}
				if (imageInfo.type) viewUrl.searchParams.set("type", imageInfo.type);
				const bytes = await fetchBytes(viewUrl.toString(), 120000);
				const sourceExt = extname(imageInfo.filename).replace(".", "") || "png";
				const fileName = `${prompt.outputBaseName}-v${variant + 1}-${seed}.${sourceExt}`;
				const diskPath = join(CANDIDATE_DIR, fileName);
				await writeFile(diskPath, bytes);
				const candidatePath = diskPathToAppPath(diskPath);
				const sidecar = await writeSidecar(prompt, {
					candidatePath,
					backend: "comfy",
					checkpoint: backendInfo.checkpoint || args.checkpoint,
					seed,
				});
				sidecars.push(sidecar);
				console.log(`[comfy] Generated ${candidatePath}`);
			} catch (error) {
				await handleGenerationError(error, prompt, variant, seed, "comfy", args);
			}
		}
	}
	await writeReviewGalleries(prompts, [...(await readCandidateSidecars()), ...sidecars]);
}

async function handleGenerationError(error, prompt, variant, seed, backend, args) {
	const message = `[${backend}] Failed ${prompt.promptRecordId || prompt.assetPath} v${variant + 1}: ${error?.message || error}`;
	if (!args.continueOnError) throw error;
	console.warn(message);
	await appendGenerationFailure({
		failedAt: new Date().toISOString(),
		backend,
		promptRecordId: prompt.promptRecordId,
		assetPath: prompt.assetPath,
		applyTargetPath: prompt.applyTargetPath,
		subject: prompt.subject,
		assetType: prompt.type,
		variant: variant + 1,
		seed,
		error: error?.message || String(error),
		stack: error?.stack,
	});
}

async function appendGenerationFailure(payload) {
	await ensureCandidateDir();
	const file = join(CANDIDATE_DIR, "generation-failures.jsonl");
	await appendFile(file, `${JSON.stringify(payload)}\n`, "utf8");
}

function patchComfyWorkflow(baseWorkflow, prompt, seed, backendInfo) {
	const workflow = JSON.parse(JSON.stringify(baseWorkflow));
	let textNodeIndex = 0;
	for (const node of Object.values(workflow)) {
		const inputs = node.inputs;
		if (!inputs) continue;
		if (Object.hasOwn(inputs, "ckpt_name") && backendInfo.checkpoint) {
			inputs.ckpt_name = backendInfo.checkpoint;
		}
		if (Object.hasOwn(inputs, "text")) {
			inputs.text = textNodeIndex === 0 ? prompt.positivePrompt : prompt.negativePrompt;
			textNodeIndex += 1;
		}
		if (Object.hasOwn(inputs, "width")) inputs.width = prompt.width;
		if (Object.hasOwn(inputs, "height")) inputs.height = prompt.height;
		if (Object.hasOwn(inputs, "seed")) inputs.seed = seed;
		if (Object.hasOwn(inputs, "steps")) inputs.steps = prompt.steps;
		if (Object.hasOwn(inputs, "cfg")) inputs.cfg = prompt.cfgScale;
		if (Object.hasOwn(inputs, "sampler_name")) {
			inputs.sampler_name = comfySamplerName(prompt.sampler);
		}
		if (Object.hasOwn(inputs, "scheduler")) {
			inputs.scheduler = String(prompt.scheduler || "karras").toLowerCase();
		}
		if (Object.hasOwn(inputs, "filename_prefix")) {
			inputs.filename_prefix = `rift_${prompt.outputBaseName}`;
		}
	}
	return workflow;
}

function comfySamplerName(sampler) {
	const normalized = String(sampler ?? "").toLowerCase();
	if (normalized.includes("dpm++") || normalized.includes("dpmpp")) {
		return "dpmpp_2m";
	}
	if (normalized.includes("euler")) return "euler";
	return "dpmpp_2m";
}

async function pollComfyImage(url, promptId) {
	const started = Date.now();
	while (Date.now() - started < COMFY_GENERATION_TIMEOUT_MS) {
		await wait(1500);
		const history = await fetchJson(`${url}/history/${promptId}`, {}, 15000).catch(
			() => null,
		);
		const item = history?.[promptId];
		if (!item) continue;
		const status = item.status ?? {};
		if (status.status_str === "error") {
			const messages = Array.isArray(status.messages) ? status.messages : [];
			const executionError = messages.find((message) => {
				const payload = Array.isArray(message) ? message[1] : null;
				return (
					(Array.isArray(message) && message[0] === "execution_error") ||
					payload?.exception_message ||
					payload?.exception_type
				);
			});
			const payload = Array.isArray(executionError) ? executionError[1] : {};
			const nodeType = payload?.node_type ? ` ${payload.node_type}` : "";
			const nodeId = payload?.node_id ? ` node ${payload.node_id}` : "";
			const exception = [
				payload?.exception_type,
				payload?.exception_message,
			]
				.filter(Boolean)
				.join(": ");
			const stderrHint = /invalid argument|tqdm|stderr|flush/i.test(exception)
				? " This often happens when ComfyUI was launched without a valid stderr stream; restart ComfyUI in a normal console or with redirected logs."
				: "";
			throw new Error(
				`ComfyUI prompt ${promptId} failed at${nodeType}${nodeId}: ${exception || "unknown execution error"}.${stderrHint}`,
			);
		}
		const outputs = Object.values(item.outputs ?? {});
		for (const output of outputs) {
			const image = output.images?.[0];
			if (image) return image;
		}
	}
	throw new Error(`Timed out waiting for ComfyUI prompt ${promptId}`);
}

function wait(ms) {
	return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

async function writeSidecar(prompt, generated) {
	const sidecar = {
		promptRecordId: prompt.promptRecordId,
		sourceAssetPath: prompt.assetPath,
		candidatePath: generated.candidatePath,
		prompt: prompt.positivePrompt,
		negativePrompt: prompt.negativePrompt,
		loreSourceFiles: prompt.loreSourceFiles ?? [],
		checkpoint: generated.checkpoint,
		backend: generated.backend,
		sampler: prompt.sampler,
		scheduler: prompt.scheduler,
		steps: prompt.steps,
		cfgScale: prompt.cfgScale,
		seed: generated.seed,
		width: prompt.width,
		height: prompt.height,
		generatedAt: new Date().toISOString(),
		applyTargetPath: prompt.applyTargetPath,
		priority: prompt.priority,
		subject: prompt.subject,
		assetType: prompt.type,
		category: prompt.category,
		sourceCategory: prompt.sourceCategory ?? [],
		sourceRecordKeys: prompt.sourceRecordKeys ?? [],
		sourceRecordIds: prompt.sourceRecordIds ?? [],
		sourceRecordNames: prompt.sourceRecordNames ?? [],
		recommendedReplacement: "pending",
		confidence: "pending",
		notes: "",
		references: prompt.references ?? [],
		updateReferencesOnApply: Boolean(prompt.updateReferencesOnApply),
	};
	const sidecarDisk = `${appPathToDisk(generated.candidatePath)}.json`;
	await writeTextFileWithRetry(
		sidecarDisk,
		`${JSON.stringify(sidecar, null, 2)}\n`,
		"utf8",
	);
	return sidecar;
}

async function readCandidateSidecars() {
	if (!existsSync(CANDIDATE_DIR)) return [];
	const files = readdirSync(CANDIDATE_DIR)
		.filter((file) => file.endsWith(".json"))
		.map((file) => join(CANDIDATE_DIR, file));
	const sidecars = [];
	for (const file of files) {
		try {
			const sidecar = JSON.parse(await readFile(file, "utf8"));
			if (sidecar?.candidatePath) sidecars.push(sidecar);
		} catch {
			// Ignore corrupt review sidecars; the generator should not block on one.
		}
	}
	return sidecars;
}

function sidecarMatchesCurrentPrompt(sidecar, prompt) {
	return (
		sidecar.promptRecordId === prompt.promptRecordId &&
		sidecar.prompt === prompt.positivePrompt &&
		sidecar.negativePrompt === prompt.negativePrompt &&
		normalizeType(sidecar.assetType) === normalizeType(prompt.type) &&
		Number(sidecar.width) === Number(prompt.width) &&
		Number(sidecar.height) === Number(prompt.height) &&
		Number(sidecar.steps) === Number(prompt.steps)
	);
}

async function writeReviewGalleries(prompts, sidecars) {
	await mkdir(DOCS_DIR, { recursive: true });
	const sidecarsByPrompt = new Map();
	const promptById = new Map(prompts.map((prompt) => [prompt.promptRecordId, prompt]));
	for (const sidecar of sidecars) {
		const key = sidecar.promptRecordId || sidecar.sourceAssetPath;
		const prompt = promptById.get(key);
		if (prompt && !sidecarMatchesCurrentPrompt(sidecar, prompt)) {
			continue;
		}
		if (!sidecarsByPrompt.has(key)) {
			sidecarsByPrompt.set(key, []);
		}
		sidecarsByPrompt.get(key).push(sidecar);
	}
	await writeTextFileWithRetry(
		join(DOCS_DIR, "generated-image-review.html"),
		buildReviewHtml(prompts, sidecarsByPrompt),
		"utf8",
	);
	await writeTextFileWithRetry(
		join(DOCS_DIR, "generated-image-review.md"),
		buildReviewMarkdown(prompts, sidecarsByPrompt),
		"utf8",
	);
}

function localPreviewPath(appPath) {
	if (!appPath) return "";
	const normalized = appPath.startsWith("/") ? appPath : `/${appPath}`;
	return `../public${normalized}`;
}

function htmlEscape(value) {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function promptReviewKey(prompt) {
	return prompt.promptRecordId || prompt.assetPath;
}

function buildReviewHtml(prompts, sidecarsByPrompt) {
	const cards = prompts
		.map((prompt) => {
			const sidecars = sidecarsByPrompt.get(promptReviewKey(prompt)) ?? [];
			const candidate = sidecars[0] ?? null;
			const candidateHtml = sidecars.length
				? sidecars
						.map(
							(sidecar, index) =>
								`<figure><figcaption>Candidate ${index + 1}: ${htmlEscape(sidecar.recommendedReplacement ?? "pending")}</figcaption><img src="${htmlEscape(localPreviewPath(sidecar.candidatePath))}" alt="${htmlEscape(prompt.subject)} candidate ${index + 1}" /><code>${htmlEscape(sidecar.candidatePath)}</code></figure>`,
						)
						.join("")
				: `<div class="empty">Pending generation</div>`;
			return `<article class="card">
  <div class="previews">
    <figure><figcaption>Original</figcaption><img src="${htmlEscape(localPreviewPath(prompt.assetPath))}" alt="${htmlEscape(prompt.subject)} original" onerror="this.closest('figure').classList.add('missing')" /></figure>
    <div class="candidate-list">${candidateHtml}</div>
  </div>
  <h2>${htmlEscape(prompt.subject)}</h2>
  <dl>
    <dt>Prompt ID</dt><dd><code>${htmlEscape(prompt.promptRecordId ?? "")}</code></dd>
    <dt>Asset path</dt><dd><code>${htmlEscape(prompt.assetPath)}</code></dd>
    <dt>Apply target</dt><dd><code>${htmlEscape(prompt.applyTargetPath)}</code></dd>
    <dt>Type</dt><dd>${htmlEscape(prompt.type)}</dd>
    <dt>Category</dt><dd>${htmlEscape(prompt.category ?? "")}</dd>
    <dt>Source</dt><dd>${htmlEscape((prompt.sourceCategory ?? []).join(", "))}</dd>
    <dt>Priority</dt><dd>${htmlEscape(prompt.priority)}</dd>
    <dt>Usage refs</dt><dd>${(prompt.references ?? []).length}</dd>
    <dt>Checkpoint</dt><dd>${htmlEscape(candidate?.checkpoint ?? prompt.checkpoint)}</dd>
    <dt>Seed</dt><dd>${htmlEscape(candidate?.seed ?? prompt.seed)}</dd>
    <dt>Replacement</dt><dd>${htmlEscape(candidate?.recommendedReplacement ?? "pending")}</dd>
    <dt>Notes</dt><dd><textarea placeholder="Review notes">${htmlEscape(candidate?.notes ?? "")}</textarea></dd>
  </dl>
  <details><summary>Prompt</summary><p>${htmlEscape(prompt.positivePrompt)}</p><p><strong>Negative:</strong> ${htmlEscape(prompt.negativePrompt)}</p></details>
</article>`;
		})
		.join("\n");
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Rift Ascendant Image Review</title>
  <style>
    body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #070914; color: #e8ecff; }
    header { position: sticky; top: 0; padding: 18px 24px; background: rgba(7, 9, 20, 0.94); border-bottom: 1px solid #26304f; z-index: 2; }
    h1 { margin: 0 0 4px; font-size: 22px; }
    main { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px; padding: 24px; }
    .card { border: 1px solid #27314f; border-radius: 8px; background: #0d1224; padding: 14px; box-shadow: 0 14px 36px rgba(0,0,0,.32); }
    .previews { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .candidate-list { display: grid; gap: 10px; }
    figure { margin: 0; min-height: 170px; background: #090d1a; border: 1px solid #202944; border-radius: 6px; overflow: hidden; }
    figcaption { padding: 7px 9px; color: #aeb9dc; font-size: 12px; border-bottom: 1px solid #202944; }
    img { width: 100%; height: 190px; object-fit: cover; display: block; }
    figure code { display: block; padding: 7px 9px; font-size: 11px; background: #070914; border-top: 1px solid #202944; }
    figure.missing::after, .empty { display: grid; min-height: 190px; place-items: center; color: #8290bd; font-size: 13px; content: "Missing"; }
    h2 { font-size: 17px; margin: 14px 0 10px; }
    dl { display: grid; grid-template-columns: 92px 1fr; gap: 7px 10px; font-size: 13px; }
    dt { color: #8fa0d1; }
    dd { margin: 0; min-width: 0; word-break: break-word; }
    code { color: #a7f3ff; }
    textarea { width: 100%; min-height: 54px; background: #070914; color: #e8ecff; border: 1px solid #2b365a; border-radius: 5px; }
    details { margin-top: 12px; color: #c8d2ef; font-size: 13px; }
  </style>
</head>
<body>
  <header>
    <h1>Rift Ascendant Image Review</h1>
    <div>Generated candidates default to pending. Mark sidecar JSON as recommended only after review.</div>
  </header>
  <main>
${cards}
  </main>
</body>
</html>
`;
}

function buildReviewMarkdown(prompts, sidecarsByPrompt) {
	const lines = [];
	lines.push("# Generated Image Review");
	lines.push("");
	lines.push("Generated candidates start as pending. Edit candidate sidecar JSON after review to apply a replacement.");
	lines.push("");
	for (const prompt of prompts) {
		const sidecars = sidecarsByPrompt.get(promptReviewKey(prompt)) ?? [];
		const candidate = sidecars[0] ?? null;
		lines.push(`## ${prompt.subject}`);
		lines.push("");
		lines.push(`- Prompt ID: \`${prompt.promptRecordId ?? ""}\``);
		lines.push(`- Original: \`${prompt.assetPath}\``);
		lines.push(`- Candidate: \`${candidate?.candidatePath ?? "pending"}\``);
		if (sidecars.length > 1) {
			lines.push(
				`- Variants: ${sidecars.map((sidecar) => `\`${sidecar.candidatePath}\``).join(", ")}`,
			);
		}
		lines.push(`- Apply target: \`${prompt.applyTargetPath}\``);
		lines.push(`- Type: ${prompt.type}`);
		lines.push(`- Category: ${prompt.category ?? ""}`);
		lines.push(`- Source category: ${(prompt.sourceCategory ?? []).join(", ")}`);
		lines.push(`- Priority: ${prompt.priority}`);
		lines.push(`- Usage references: ${(prompt.references ?? []).length}`);
		lines.push(`- Checkpoint: ${candidate?.checkpoint ?? prompt.checkpoint}`);
		lines.push(`- Seed: ${candidate?.seed ?? prompt.seed}`);
		lines.push(
			`- Recommended replacement: ${candidate?.recommendedReplacement ?? "pending"}`,
		);
		lines.push(`- Notes: ${candidate?.notes || "_pending review_"}`);
		lines.push("");
		lines.push("<details><summary>Prompt</summary>");
		lines.push("");
		lines.push(prompt.positivePrompt);
		lines.push("");
		lines.push(`Negative: ${prompt.negativePrompt}`);
		lines.push("");
		lines.push("</details>");
		lines.push("");
	}
	return lines.join("\n");
}

function isApproved(sidecar, planByAsset) {
	const plan =
		planByAsset.get(sidecar.promptRecordId) || planByAsset.get(sidecar.sourceAssetPath);
	const approved = (item) =>
		item?.recommendedReplacement === "yes" && item?.confidence === "high";
	return approved(sidecar) || approved(sidecar.review) || approved(plan);
}

function hasCurrentPlanEntry(sidecar, planByAsset) {
	return Boolean(
		planByAsset.get(sidecar.promptRecordId) ||
			planByAsset.get(sidecar.sourceAssetPath),
	);
}

function sidecarMatchesApplyScope(sidecar, args = {}) {
	if (args.candidate && sidecar.candidatePath !== args.candidate) return false;
	if (args.promptId && sidecar.promptRecordId !== args.promptId) return false;
	if (args.type && normalizeType(sidecar.assetType) !== args.type) return false;
	if (args.onlyHighPriority && sidecar.priority !== "high") return false;
	return true;
}

function hasExplicitApplyScope(args = {}) {
	return Boolean(
		args.candidate ||
			args.promptId ||
			args.type ||
			args.onlyHighPriority ||
			args.allReviewed,
	);
}

async function applyReviewedCandidates(args = {}) {
	const sidecars = await readCandidateSidecars();
	if (sidecars.length === 0) {
		console.log("[apply] No candidate sidecars found.");
		return;
	}
	const prompts = existsSync(PROMPTS_FILE) ? await readJson(PROMPTS_FILE) : [];
	const promptById = new Map(
		prompts.map((prompt) => [prompt.promptRecordId, prompt]),
	);
	const plan = existsSync(PLAN_FILE) ? await readJson(PLAN_FILE) : { assets: [] };
	const planByAsset = new Map();
	for (const item of [...(plan.promptRecords ?? []), ...(plan.assets ?? [])]) {
		if (item.promptRecordId) planByAsset.set(item.promptRecordId, item);
		if (item.assetPath ?? item.path) planByAsset.set(item.assetPath ?? item.path, item);
	}
	const approved = sidecars.filter((sidecar) => {
		const prompt = promptById.get(sidecar.promptRecordId);
		return (
			prompt &&
			sidecarMatchesCurrentPrompt(sidecar, prompt) &&
			hasCurrentPlanEntry(sidecar, planByAsset) &&
			isApproved(sidecar, planByAsset) &&
			sidecarMatchesApplyScope(sidecar, args)
		);
	});
	if (approved.length === 0) {
		console.log(
			"[apply] No reviewed high-confidence candidates found. Set recommendedReplacement to \"yes\" and confidence to \"high\" in a candidate sidecar first.",
		);
		return;
	}
	if (!hasExplicitApplyScope(args)) {
		console.log(
			`[apply] Found ${approved.length} current reviewed candidate(s). Refusing unscoped apply; pass --candidate, --prompt-id, --type, --only-high-priority, or --all-reviewed.`,
		);
		return;
	}

	const backupDir = join(BACKUP_ROOT, timestamp());
	await mkdir(backupDir, { recursive: true });
	const applied = [];
	for (const sidecar of approved) {
		const candidateDisk = appPathToDisk(sidecar.candidatePath);
		if (!existsSync(candidateDisk)) {
			console.warn(`[apply] Missing candidate file: ${sidecar.candidatePath}`);
			continue;
		}
		const originalTargetPath = sidecar.applyTargetPath || sidecar.sourceAssetPath;
		let targetPath = rasterApplyTargetPath(originalTargetPath);
		let targetDisk = appPathToDisk(targetPath);
		await mkdir(dirname(targetDisk), { recursive: true });

		if (await candidateAlreadyApplied(sidecar, targetPath)) {
			console.log(`[apply] Already applied ${sidecar.candidatePath} -> ${targetPath}`);
			continue;
		}

		for (const backupPath of new Set([
			sidecar.sourceAssetPath,
			originalTargetPath,
			targetPath,
		])) {
			const disk = appPathToDisk(backupPath);
			if (existsSync(disk)) {
				const relTarget = relative(PUBLIC_DIR, disk);
				const backupDisk = join(backupDir, relTarget);
				await mkdir(dirname(backupDisk), { recursive: true });
				await copyFile(disk, backupDisk);
			}
		}

		try {
			await writeCandidateToTarget(candidateDisk, targetDisk);
		} catch (error) {
			if (!isBusyFileError(error)) throw error;
			const fallbackPath = fallbackApplyTargetPath(targetPath, sidecar);
			const fallbackDisk = appPathToDisk(fallbackPath);
			await mkdir(dirname(fallbackDisk), { recursive: true });
			console.warn(
				`[apply] Target was locked, writing sibling replacement instead: ${targetPath} -> ${fallbackPath}`,
			);
			await writeCandidateToTarget(candidateDisk, fallbackDisk, targetDisk);
			targetPath = fallbackPath;
			targetDisk = fallbackDisk;
		}

		if (
			(sidecar.updateReferencesOnApply || targetPath !== originalTargetPath) &&
			sidecar.sourceAssetPath !== targetPath &&
			Array.isArray(sidecar.references)
		) {
			await updateReferences(sidecar.sourceAssetPath, targetPath, sidecar.references);
		}

		applied.push({ source: sidecar.candidatePath, target: targetPath });
		console.log(`[apply] Applied ${sidecar.candidatePath} -> ${targetPath}`);
	}

	if (applied.length > 0) {
		console.log(`[apply] Backups stored under ${backupDir}`);
		if (args.skipPostApplyChecks) {
			console.log("[apply] Skipped post-apply checks by request.");
		} else {
			runPostApplyChecks();
		}
	}
}

async function candidateAlreadyApplied(sidecar, targetPath) {
	if (!sidecar.sourceAssetPath || sidecar.sourceAssetPath === targetPath) {
		return false;
	}
	if (!existsSync(appPathToDisk(targetPath))) return false;
	const refs = Array.isArray(sidecar.references) ? sidecar.references : [];
	const files = [...new Set(refs.map((ref) => ref.file).filter(Boolean))];
	if (files.length === 0) return false;
	let sawTarget = false;
	let sawSource = false;
	for (const relFile of files) {
		const disk = join(ROOT, relFile);
		if (!existsSync(disk)) continue;
		const text = await readFile(disk, "utf8");
		if (text.includes(sidecar.sourceAssetPath)) sawSource = true;
		if (text.includes(targetPath)) sawTarget = true;
	}
	return sawTarget && !sawSource;
}

function rasterApplyTargetPath(targetPath) {
	const ext = extname(targetPath).toLowerCase();
	if ([".webp", ".png", ".jpg", ".jpeg"].includes(ext)) return targetPath;
	return `${targetPath.slice(0, -ext.length)}.webp`;
}

async function writeCandidateToTarget(
	candidateDisk,
	targetDisk,
	metadataSourceDisk = targetDisk,
) {
	const targetExt = extname(targetDisk).toLowerCase();
	if (![".webp", ".png", ".jpg", ".jpeg"].includes(targetExt)) {
		await copyFile(candidateDisk, targetDisk);
		return;
	}

	let targetMeta = null;
	if (existsSync(metadataSourceDisk)) {
		try {
			targetMeta = await sharp(metadataSourceDisk).metadata();
		} catch {
			targetMeta = null;
		}
	}

	let image = sharp(candidateDisk);
	if (targetMeta?.width && targetMeta?.height) {
		image = image.resize(targetMeta.width, targetMeta.height, { fit: "cover" });
	}

	const tmpDisk = `${targetDisk}.tmp-${process.pid}-${Date.now()}${targetExt}`;
	try {
		if (targetExt === ".webp") {
			await image.webp({ quality: 90 }).toFile(tmpDisk);
		} else if (targetExt === ".png") {
			await image.png().toFile(tmpDisk);
		} else {
			await image.jpeg({ quality: 92 }).toFile(tmpDisk);
		}
		await replaceFileWithRetry(tmpDisk, targetDisk);
	} catch (error) {
		await rm(tmpDisk, { force: true }).catch(() => {});
		throw error;
	}
}

function isBusyFileError(error) {
	return ["EBUSY", "EPERM", "EACCES"].includes(error?.code);
}

function fallbackApplyTargetPath(targetPath, sidecar) {
	const ext = extname(targetPath);
	const base = targetPath.slice(0, -ext.length);
	return `${base}-generated-${stableSuffix(sidecar.promptRecordId || sidecar.candidatePath)}${ext}`;
}

function stableSuffix(value) {
	let hash = 2166136261;
	for (const char of String(value ?? "")) {
		hash ^= char.charCodeAt(0);
		hash = Math.imul(hash, 16777619);
	}
	return (hash >>> 0).toString(36).slice(0, 7);
}

async function replaceFileWithRetry(sourceDisk, targetDisk) {
	let lastError = null;
	for (let attempt = 0; attempt < 8; attempt += 1) {
		try {
			await rename(sourceDisk, targetDisk);
			return;
		} catch (error) {
			lastError = error;
			if (!["EBUSY", "EPERM", "EACCES"].includes(error?.code)) throw error;
			await wait(250 * (attempt + 1));
		}
	}
	throw lastError;
}

async function updateReferences(sourcePath, targetPath, references) {
	const files = [...new Set(references.map((ref) => ref.file).filter(Boolean))];
	for (const relFile of files) {
		const disk = join(ROOT, relFile);
		if (!existsSync(disk)) continue;
		const original = await readFile(disk, "utf8");
		const fileRefs = references.filter((ref) => ref.file === relFile);
		const linesToPatch = new Set(
			fileRefs
				.map((ref) => Number(ref.line))
				.filter((line) => Number.isInteger(line) && line > 0),
		);
		let updated = original;
		if (linesToPatch.size > 0) {
			const lines = original.split(/\r?\n/);
			for (const lineNumber of linesToPatch) {
				const index = lineNumber - 1;
				if (lines[index]?.includes(sourcePath)) {
					lines[index] = lines[index].split(sourcePath).join(targetPath);
				}
			}
			updated = lines.join(original.includes("\r\n") ? "\r\n" : "\n");
		} else {
			updated = original.split(sourcePath).join(targetPath);
		}
		if (updated !== original) {
			await writeTextFileWithRetry(disk, updated, "utf8");
			console.log(`[apply] Updated references in ${relFile}`);
		}
	}
}

function runPostApplyChecks() {
	console.log("[apply] Running post-apply checks...");
	runCommand("node", ["scripts/audit-assets.mjs"]);

	const packageJson = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
	const postApplyScripts = [
		"lint",
		"typecheck",
		"build",
		packageJson.scripts?.["test:run"] ? "test:run" : "test",
	];
	for (const script of postApplyScripts) {
		if (packageJson.scripts?.[script]) {
			if (
				script === "lint" &&
				packageJson.scripts[script].includes("--write") &&
				process.env.RIFT_RUN_MUTATING_LINT !== "1"
			) {
				console.warn(
					"[apply] Skipping npm run lint because it contains --write. Set RIFT_RUN_MUTATING_LINT=1 to allow repo-wide formatting.",
				);
				continue;
			}
			runCommand(process.platform === "win32" ? "npm.cmd" : "npm", [
				"run",
				script,
			]);
		}
	}
}

function runCommand(command, args) {
	const result = spawnSync(command, args, {
		cwd: ROOT,
		stdio: "inherit",
		shell: false,
	});
	if (result.status !== 0) {
		process.exitCode = result.status || 1;
	}
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	await ensureComfyExampleWorkflow();

	if (args.apply) {
		await applyReviewedCandidates(args);
		return;
	}

	if (!existsSync(PROMPTS_FILE)) {
		console.error(
			`[generate] Missing ${PROMPTS_FILE}. Run node scripts/audit-assets.mjs first.`,
		);
		process.exitCode = 1;
		return;
	}

	const prompts = selectedPrompts(await readJson(PROMPTS_FILE), args);
	if (prompts.length === 0) {
		console.log("[generate] No prompt records matched the filters.");
		return;
	}

	if (args.dryRun) {
		await writePromptPack(prompts, args, { backend: "dry-run" });
		return;
	}

	const backendInfo = await detectBackend(args);
	if (!backendInfo.ok) {
		printSetupInstructions(backendInfo.reason, args.checkpoint);
		console.warn("[generate] Continuing in dry-run prompt-pack mode.");
		await writePromptPack(prompts, args, backendInfo);
		return;
	}

	if (backendInfo.usingCurrentModel) {
		console.warn(
			`[generate] Requested checkpoint was not matched; using backend current model because --allow-current-model was passed.`,
		);
	}

	if (backendInfo.backend === "a1111") {
		await generateWithA1111(prompts, args, backendInfo);
	} else if (backendInfo.backend === "comfy") {
		await generateWithComfy(prompts, args, backendInfo);
	}
}

main().catch((error) => {
	console.error("[generate] FAILED:", error);
	process.exit(1);
});
