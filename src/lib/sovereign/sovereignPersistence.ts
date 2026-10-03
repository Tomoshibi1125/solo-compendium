import type { GeneratedSovereign } from "@/lib/geminiProtocol";
import { requireDistinctCanonicalRegents } from "@/lib/regentIdentity";
import type { SovereignV2Definition } from "@/lib/sovereign/sovereignV2Contract";

export const SOVEREIGN_STORAGE_SCHEMA_VERSION = 2 as const;
export const SOVEREIGN_PROJECTION_REVISION = "sovereign-projection-v1" as const;

/** Projected feature rows are rebuilt only by attachment; imports must skip them. */
export function isRebuildableSovereignFeature(row: {
	source?: unknown;
	sovereign_definition_id?: unknown;
}): boolean {
	return (
		(typeof row.source === "string" && row.source.startsWith("Sovereign:")) ||
		(typeof row.sovereign_definition_id === "string" &&
			row.sovereign_definition_id.length > 0)
	);
}

export interface LegacySovereignSavePayload {
	name: string;
	title: string;
	description: string;
	fusion_theme: string;
	fusion_description: string;
	fusion_method: string;
	power_multiplier: string | null;
	fusion_stability: string | null;
	job_id: string;
	path_id: string;
	regent_a_id: string;
	regent_b_id: string;
	abilities: GeneratedSovereign["abilities"];
}

const normalizeOptionalText = (value: unknown): string | null =>
	typeof value === "string" && value.trim() ? value.trim() : null;

/**
 * Canonicalize the two Regent IDs once at the persistence boundary. The server
 * repeats the validation; this client copy exists only to produce a stable
 * payload and useful preflight errors.
 */
export function canonicalizeLegacySovereign(
	sovereign: GeneratedSovereign,
): GeneratedSovereign {
	const [regentAId, regentBId] = requireDistinctCanonicalRegents(
		sovereign.regentA?.id,
		sovereign.regentB?.id,
	);
	return {
		...sovereign,
		regentA:
			sovereign.regentA.id === regentAId
				? sovereign.regentA
				: { ...sovereign.regentA, id: regentAId },
		regentB:
			sovereign.regentB.id === regentBId
				? sovereign.regentB
				: { ...sovereign.regentB, id: regentBId },
	};
}

export function buildLegacySovereignSavePayload(
	sovereign: GeneratedSovereign,
): LegacySovereignSavePayload {
	const canonical = canonicalizeLegacySovereign(sovereign);
	return {
		name: canonical.name.trim(),
		title: canonical.title.trim(),
		description: canonical.description.trim(),
		fusion_theme: canonical.fusion_theme.trim(),
		fusion_description: canonical.fusion_description.trim(),
		fusion_method: canonical.fusion_method.trim() || "Gemini Protocol",
		power_multiplier: normalizeOptionalText(canonical.power_multiplier),
		fusion_stability: normalizeOptionalText(canonical.fusion_stability),
		job_id: canonical.job.id,
		path_id: canonical.path.id,
		regent_a_id: canonical.regentA.id,
		regent_b_id: canonical.regentB.id,
		abilities: canonical.abilities,
	};
}

const canonicalJson = (value: unknown): string => {
	if (value === undefined) return "null";
	if (value === null || typeof value !== "object") {
		return JSON.stringify(value) ?? "null";
	}
	if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
	const record = value as Record<string, unknown>;
	return `{${Object.keys(record)
		.sort()
		.map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
		.join(",")}}`;
};

/** Small deterministic content hash used only for idempotency-key identity. */
const fnv1a32 = (value: string): string => {
	let hash = 0x811c9dc5;
	for (let index = 0; index < value.length; index++) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 0x01000193);
	}
	return (hash >>> 0).toString(16).padStart(8, "0");
};

export function legacySovereignSaveOperationId(
	payload: LegacySovereignSavePayload,
): string {
	return `s2-save-legacy-${fnv1a32(canonicalJson(payload))}`;
}

export function sovereignV2SaveOperationId(
	definition: SovereignV2Definition,
): string {
	const authoredOperation = definition.generation.operation_id.trim();
	return authoredOperation
		? `s2-save-v2-${authoredOperation}`.slice(0, 200)
		: `s2-save-v2-${fnv1a32(canonicalJson(definition))}`;
}

export function sovereignAttachmentOperationId(
	characterId: string,
	sovereignId: string,
): string {
	return `s2-attach-${SOVEREIGN_PROJECTION_REVISION}-${characterId}-${sovereignId}`;
}
