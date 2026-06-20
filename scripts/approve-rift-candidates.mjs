#!/usr/bin/env node
/**
 * Marks generated Rift asset candidates as approved for apply.
 *
 * This is intentionally separate from generation so ordinary dry-run/review flows
 * still default to pending. Use it only when the user has explicitly approved
 * applying generated local candidates into app asset paths.
 */

import { existsSync, readdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const PROMPTS_FILE = join(ROOT, "data", "rift-image-prompts.json");
const CANDIDATE_DIR = join(
	ROOT,
	"public",
	"generated",
	"rift-ascendant-candidates",
);

function parseArgs(argv) {
	const args = {
		all: false,
		onlyHighPriority: false,
		type: null,
		candidate: null,
		promptId: null,
		note:
			"Approved for apply by explicit user instruction to run the Rift asset workflow start to finish.",
	};
	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];
		if (arg === "--all") args.all = true;
		else if (arg === "--only-high-priority") args.onlyHighPriority = true;
		else if (arg === "--type") args.type = String(argv[++i] ?? "").toLowerCase();
		else if (arg === "--candidate") args.candidate = String(argv[++i] ?? "");
		else if (arg === "--prompt-id") args.promptId = String(argv[++i] ?? "");
		else if (arg === "--note") args.note = String(argv[++i] ?? args.note);
	}
	return args;
}

async function readJson(file) {
	return JSON.parse(await readFile(file, "utf8"));
}

function rasterApplyTargetPath(targetPath) {
	const ext = extname(targetPath).toLowerCase();
	if ([".webp", ".png", ".jpg", ".jpeg"].includes(ext)) return targetPath;
	if (!ext) return `${targetPath}.webp`;
	return `${targetPath.slice(0, -ext.length)}.webp`;
}

function currentPromptSidecarMatch(sidecar, prompt) {
	return (
		sidecar.prompt === prompt.positivePrompt &&
		sidecar.negativePrompt === prompt.negativePrompt &&
		sidecar.assetType === prompt.type
	);
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	if (!existsSync(PROMPTS_FILE)) {
		console.error(`[approve] Missing ${PROMPTS_FILE}. Run audit first.`);
		process.exit(1);
	}
	if (!existsSync(CANDIDATE_DIR)) {
		console.log("[approve] No candidate directory found.");
		return;
	}

	const prompts = await readJson(PROMPTS_FILE);
	const promptById = new Map(prompts.map((prompt) => [prompt.promptRecordId, prompt]));
	const hasApprovalScope =
		args.all ||
		args.onlyHighPriority ||
		Boolean(args.type) ||
		Boolean(args.candidate) ||
		Boolean(args.promptId);
	if (!hasApprovalScope) {
		console.log(
			"[approve] No approval scope provided. Pass --candidate, --prompt-id, --type, --only-high-priority, or --all after visual review.",
		);
		return;
	}
	const files = readdirSync(CANDIDATE_DIR)
		.filter((file) => file.endsWith(".json"))
		.map((file) => join(CANDIDATE_DIR, file));

	let approved = 0;
	let skipped = 0;
	for (const file of files) {
		let sidecar;
		try {
			sidecar = await readJson(file);
		} catch {
			skipped += 1;
			continue;
		}
		if (!sidecar?.candidatePath || !sidecar?.promptRecordId) {
			skipped += 1;
			continue;
		}
		if (args.candidate && sidecar.candidatePath !== args.candidate) {
			skipped += 1;
			continue;
		}
		if (args.promptId && sidecar.promptRecordId !== args.promptId) {
			skipped += 1;
			continue;
		}
		const prompt = promptById.get(sidecar.promptRecordId);
		if (!prompt || !currentPromptSidecarMatch(sidecar, prompt)) {
			skipped += 1;
			continue;
		}
		if (args.onlyHighPriority && prompt.priority !== "high") {
			skipped += 1;
			continue;
		}
		if (args.type && String(prompt.type).toLowerCase() !== args.type) {
			skipped += 1;
			continue;
		}
		if (!prompt.type || prompt.type === "unknown") {
			skipped += 1;
			continue;
		}

		const next = {
			...sidecar,
			sourceAssetPath: prompt.assetPath,
			applyTargetPath: rasterApplyTargetPath(prompt.applyTargetPath),
			priority: prompt.priority,
			subject: prompt.subject,
			assetType: prompt.type,
			category: prompt.category,
			sourceCategory: prompt.sourceCategory ?? [],
			sourceRecordKeys: prompt.sourceRecordKeys ?? [],
			sourceRecordIds: prompt.sourceRecordIds ?? [],
			sourceRecordNames: prompt.sourceRecordNames ?? [],
			references: prompt.references ?? [],
			updateReferencesOnApply:
				Boolean(prompt.updateReferencesOnApply) ||
				rasterApplyTargetPath(prompt.applyTargetPath) !== prompt.applyTargetPath,
			recommendedReplacement: "yes",
			confidence: "high",
			notes: sidecar.notes ? `${sidecar.notes}\n${args.note}` : args.note,
			approvedAt: new Date().toISOString(),
		};
		await writeFile(file, `${JSON.stringify(next, null, 2)}\n`, "utf8");
		approved += 1;
	}

	console.log(`[approve] Approved ${approved} current candidate sidecars.`);
	console.log(`[approve] Skipped ${skipped} stale, unmatched, or filtered sidecars.`);
}

main().catch((error) => {
	console.error("[approve] FAILED:", error);
	process.exit(1);
});
