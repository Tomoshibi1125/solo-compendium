/**
 * Locked canonical Regent identity boundary.
 *
 * Only canonical IDs and the four explicitly retired IDs below are accepted.
 * Display names, case variants, themes, generated slugs, UUIDs, and every
 * other heuristic identity are intentionally rejected.
 */
export const CANONICAL_REGENT_IDS = [
	"umbral_regent",
	"radiant_regent",
	"steel_regent",
	"destruction_regent",
	"war_regent",
	"frost_regent",
	"beast_regent",
	"plague_regent",
	"spatial_regent",
	"mimic_regent",
	"blood_regent",
	"gravity_regent",
] as const;

export type CanonicalRegentId = (typeof CANONICAL_REGENT_IDS)[number];

export const LEGACY_REGENT_ID_MAP: Readonly<Record<string, CanonicalRegentId>> =
	Object.freeze({
		shadow_regent: "umbral_regent",
		dragon_regent: "destruction_regent",
		titan_regent: "steel_regent",
		architect_regent: "spatial_regent",
	});

const CANONICAL_REGENT_ID_SET = new Set<string>(CANONICAL_REGENT_IDS);

/** Resolve an exact canonical or explicitly mapped legacy ID. */
export function resolveCanonicalRegentId(
	value: unknown,
): CanonicalRegentId | null {
	if (typeof value !== "string") return null;
	const id = value.trim();
	if (CANONICAL_REGENT_ID_SET.has(id)) return id as CanonicalRegentId;
	return Object.hasOwn(LEGACY_REGENT_ID_MAP, id)
		? LEGACY_REGENT_ID_MAP[id]
		: null;
}

/**
 * Resolve an ordered Regent pair and require two distinct canonical identities.
 * The tuple always preserves the caller's A-then-B dominance/order.
 */
export function requireDistinctCanonicalRegents(
	regentAId: unknown,
	regentBId: unknown,
): [CanonicalRegentId, CanonicalRegentId] {
	const regentA = resolveCanonicalRegentId(regentAId);
	if (!regentA) {
		throw new Error("Regent A must use a supported canonical Regent ID");
	}
	const regentB = resolveCanonicalRegentId(regentBId);
	if (!regentB) {
		throw new Error("Regent B must use a supported canonical Regent ID");
	}
	if (regentA === regentB) {
		throw new Error("Gemini fusion requires two distinct canonical Regents");
	}
	return [regentA, regentB];
}
