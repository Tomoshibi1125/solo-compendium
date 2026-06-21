// Sovereign Fusion — External AI Export / Import Contract
//
// Lets a player take the SAME fusion inputs our embedded AI uses, run them
// through ANY outside AI (ChatGPT / Claude / Gemini web / etc.), and bring the
// result back so it applies to the character exactly as if our embedded AI had
// generated it. The strict JSON schema below is the single source of truth for
// both the export prompt and the import validator, so round-trips are
// deterministic regardless of which AI produced the fusion.

import { z } from "zod";
import type {
	FusionAbility,
	GeneratedSovereign,
	Job,
	Path,
	Regent,
} from "@/lib/geminiProtocol";

/** Bump when the wire format changes in a backward-incompatible way. */
export const SOVEREIGN_CONTRACT_VERSION = 1 as const;

/** The 8 sovereign ability milestones (mirrors the embedded generator). */
export const SOVEREIGN_ABILITY_LEVELS = [1, 3, 5, 7, 10, 14, 17, 20] as const;

// ── Schema (the AI-authored subset) ─────────────────────────────────────────
// job / path / regentA / regentB / fusion_method are re-attached locally from
// canonical compendium data and are intentionally NOT trusted from the import.
// Schemas are deliberately tolerant (outside AIs vary): we trim, coerce, and
// fall back rather than reject on cosmetic deviations.

/** Trim-then-require, so whitespace-only strings fail validation. */
const requiredString = (msg: string) =>
	z.preprocess(
		(v) => (typeof v === "string" ? v.trim() : v),
		z.string().min(1, msg),
	);

/** "" / whitespace / null / undefined → null; otherwise the trimmed string. */
const nullableString = z.preprocess((v) => {
	if (typeof v !== "string") return null;
	const t = v.trim();
	return t ? t : null;
}, z.string().nullable());

/** Accept real booleans or the strings "true"/"false" (and 0/1). */
const looseBoolean = z.preprocess((v) => {
	if (typeof v === "boolean") return v;
	if (typeof v === "string") return v.trim().toLowerCase() === "true";
	if (typeof v === "number") return v !== 0;
	return false;
}, z.boolean());

/** Accept an array of strings, a single string, or nothing → string[]. */
const originSources = z.preprocess((v) => {
	if (Array.isArray(v))
		return v
			.filter((x) => typeof x === "string" && x.trim())
			.map((x) => (x as string).trim());
	if (typeof v === "string" && v.trim()) return [v.trim()];
	return [];
}, z.array(z.string()));

const FusionAbilitySchema = z.object({
	name: requiredString("ability name is required"),
	description: requiredString("ability description is required"),
	level: z.coerce.number().int().min(1).max(20),
	action_type: nullableString,
	recharge: nullableString,
	is_capstone: looseBoolean,
	origin_sources: originSources,
	fusion_type: z.preprocess(
		(v) => (typeof v === "string" && v.trim() ? v.trim() : "fusion"),
		z.string(),
	),
});

export const SovereignPayloadSchema = z.object({
	name: requiredString("name is required"),
	title: requiredString("title is required"),
	description: requiredString("description (fusion origin) is required"),
	fusion_theme: requiredString("fusion_theme is required"),
	fusion_description: requiredString(
		"fusion_description (combat doctrine) is required",
	),
	power_multiplier: requiredString("power_multiplier is required"),
	fusion_stability: requiredString("fusion_stability is required"),
	abilities: z
		.array(FusionAbilitySchema)
		.min(1, "at least one fusion ability is required"),
});

export type SovereignPayload = z.infer<typeof SovereignPayloadSchema>;

/** Canonical fusion inputs the player selected (re-attached on import). */
export interface SovereignInputs {
	job: Job;
	path: Path;
	regentA: Regent;
	regentB: Regent;
}

/** Self-describing bundle for the file-download transport. */
export interface SovereignExportBundle {
	kind: "rift-sovereign-request";
	version: typeof SOVEREIGN_CONTRACT_VERSION;
	generatedAt: string;
	inputs: {
		jobId: string;
		jobName: string;
		pathId: string;
		pathName: string;
		regentAId: string;
		regentAName: string;
		regentBId: string;
		regentBName: string;
	};
	prompt: string;
	/** A minimal example so the AI mirrors the exact shape. */
	responseShape: Record<string, unknown>;
}

export interface SovereignExport {
	/** Ready-to-paste prompt for any chatbot (copy/paste transport). */
	prompt: string;
	/** Downloadable request bundle (file transport). */
	bundle: SovereignExportBundle;
}

// ── Export ───────────────────────────────────────────────────────────────────

const RESPONSE_EXAMPLE: Record<string, unknown> = {
	name: "Frostvoid Sovereign",
	title: "Sovereign of the Frozen Shadow",
	description:
		"2-3 paragraphs describing the Ascendant Event where Job, Path, and both Regents dissolved into one new being.",
	fusion_theme: "Singularity Frost",
	fusion_description:
		"The fused martial style — how this Sovereign fights in a way neither component could alone.",
	power_multiplier: "Zenith-Tier",
	fusion_stability: "Stable (Unified, Sovereign-Grade)",
	abilities: [
		{
			name: "Fusion Awakening",
			description:
				"2-3 sentences describing a MERGED effect with concrete mechanics (dice, DCs, ranges).",
			level: 1,
			action_type: "Passive",
			recharge: null,
			is_capstone: false,
			origin_sources: ["RegentA+RegentB"],
			fusion_type: "fusion",
		},
	],
};

const pathShort = (name: string): string =>
	name.replace(/^Path of the\s*/i, "").replace(/\s*Path$/i, "");

/**
 * Build the export prompt + downloadable bundle for the outside-AI path.
 * The prompt body mirrors the embedded generator's fusion philosophy but
 * demands STRICT JSON output matching {@link SovereignPayloadSchema}.
 */
export function buildSovereignExport(inputs: SovereignInputs): SovereignExport {
	const { job, path, regentA, regentB } = inputs;
	const levels = SOVEREIGN_ABILITY_LEVELS.join(", ");

	const prompt = `You are the Gemini Protocol — the sovereign fusion engine of Rift Ascendant. Fuse two Regents with a Job and Path into a UNIQUE sovereign class overlay.

FUSION PHILOSOPHY:
This is a TRUE ZENITH FUSION. The components do not merely "work together" — they CEASE TO EXIST as individuals and MERGE into a FULLY NEW hybrid entity. The Sovereign's name, title, and EVERY ability must reflect this transformative synthesis. Every ability should read as an inseparable hybrid of Job, Path, and both Regents.

FUSION INPUTS:
- Job: ${job.name} (${job.hit_die ?? "d8"} hit die, ${(job.primary_abilities || []).join("/") || "varies"} primary)
- Path: ${pathShort(path.name)}
- Regent A (Dominant): ${regentA.name} — Theme: ${regentA.theme}, Damage: ${regentA.damage_type || "Force"}
- Regent B (Merged): ${regentB.name} — Theme: ${regentB.theme}, Damage: ${regentB.damage_type || "Force"}

OUTPUT FORMAT — CRITICAL:
Return ONLY a single valid JSON object. No markdown, no code fences, no commentary before or after. It MUST match this exact shape and key names:

${JSON.stringify(RESPONSE_EXAMPLE, null, 2)}

REQUIREMENTS:
- "abilities" MUST contain EXACTLY 8 entries, one per level milestone: ${levels}.
- "is_capstone" is true ONLY for levels 17 and 20.
- "action_type" is one of: "1 action", "1 bonus action", "1 reaction", "Passive".
- "recharge" is one of: "At will", "Short Rest", "Long Rest", or null.
- Each ability "description" must describe a MERGED effect with specific mechanics (dice, DCs, ranges).
- "origin_sources" lists which inputs contributed (e.g. "Job+Path+RegentA").
- Do NOT include "job", "path", "regentA", "regentB", or "fusion_method" — those are re-attached automatically.`;

	const bundle: SovereignExportBundle = {
		kind: "rift-sovereign-request",
		version: SOVEREIGN_CONTRACT_VERSION,
		generatedAt: new Date().toISOString(),
		inputs: {
			jobId: job.id,
			jobName: job.name,
			pathId: path.id,
			pathName: path.name,
			regentAId: regentA.id,
			regentAName: regentA.name,
			regentBId: regentB.id,
			regentBName: regentB.name,
		},
		prompt,
		responseShape: RESPONSE_EXAMPLE,
	};

	return { prompt, bundle };
}

// ── Import ───────────────────────────────────────────────────────────────────

export type SovereignImportResult =
	| { ok: true; sovereign: GeneratedSovereign }
	| { ok: false; errors: string[] };

/**
 * Pull the first balanced JSON object out of arbitrary text. Tolerates code
 * fences and surrounding prose so a user can paste a whole chatbot reply.
 */
export function extractJsonObject(raw: string): string | null {
	if (typeof raw !== "string") return null;
	let text = raw.trim();
	if (!text) return null;

	// Strip a leading/trailing ```json ... ``` fence if present.
	const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
	if (fence?.[1]) text = fence[1].trim();

	const start = text.indexOf("{");
	if (start === -1) return null;

	let depth = 0;
	let inString = false;
	let escaped = false;
	for (let i = start; i < text.length; i++) {
		const ch = text[i];
		if (inString) {
			if (escaped) escaped = false;
			else if (ch === "\\") escaped = true;
			else if (ch === '"') inString = false;
			continue;
		}
		if (ch === '"') inString = true;
		else if (ch === "{") depth++;
		else if (ch === "}") {
			depth--;
			if (depth === 0) return text.slice(start, i + 1);
		}
	}
	return null;
}

const normalizeAbility = (
	a: SovereignPayload["abilities"][number],
): FusionAbility => ({
	name: a.name,
	description: a.description,
	level: a.level,
	action_type: a.action_type,
	recharge: a.recharge,
	is_capstone: a.is_capstone,
	origin_sources: a.origin_sources,
	fusion_type: a.fusion_type,
});

/**
 * Validate an outside-AI result and compose a {@link GeneratedSovereign} that is
 * shape-identical to the embedded generator's output. Canonical job/path/regent
 * objects are taken from {@link SovereignInputs} — never from the imported text —
 * so the applied overlay is always backed by trusted compendium data.
 */
export function parseImportedSovereign(
	raw: string | unknown,
	inputs: SovereignInputs,
): SovereignImportResult {
	let candidate: unknown = raw;

	if (typeof raw === "string") {
		const json = extractJsonObject(raw);
		if (!json) {
			return {
				ok: false,
				errors: [
					"No JSON object found. Paste the AI's full reply or the result file.",
				],
			};
		}
		try {
			candidate = JSON.parse(json);
		} catch (err) {
			return {
				ok: false,
				errors: [
					`Invalid JSON: ${err instanceof Error ? err.message : "parse error"}`,
				],
			};
		}
	}

	// Guard: user uploaded the REQUEST bundle instead of the AI's result.
	if (
		candidate &&
		typeof candidate === "object" &&
		!Array.isArray(candidate) &&
		(candidate as Record<string, unknown>).kind === "rift-sovereign-request"
	) {
		return {
			ok: false,
			errors: [
				"This is the request file you exported, not the AI's result. Run the prompt through an AI first, then import its reply.",
			],
		};
	}

	// Allow a wrapped { payload: {...} } gracefully.
	if (
		candidate &&
		typeof candidate === "object" &&
		!Array.isArray(candidate) &&
		"payload" in (candidate as Record<string, unknown>)
	) {
		candidate = (candidate as Record<string, unknown>).payload;
	}

	const parsed = SovereignPayloadSchema.safeParse(candidate);
	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.issues.map(
				(issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
			),
		};
	}

	const payload = parsed.data;
	const { job, path, regentA, regentB } = inputs;

	const sovereign: GeneratedSovereign = {
		name: payload.name,
		title: payload.title,
		description: payload.description,
		fusion_theme: payload.fusion_theme,
		fusion_description: payload.fusion_description,
		fusion_method: "Gemini Protocol (External Fusion)",
		abilities: payload.abilities.map(normalizeAbility),
		job,
		path,
		regentA,
		regentB,
		power_multiplier: payload.power_multiplier,
		fusion_stability: payload.fusion_stability,
	};

	return { ok: true, sovereign };
}
