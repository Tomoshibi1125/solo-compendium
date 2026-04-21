/**
 * anomalyImageResolver.ts
 *
 * Resolves a thematic hero image for any anomaly based on its name + type,
 * picking deterministically from pre-assigned pools of local webp slots so
 * that the same anomaly always gets the same image, all Dragons see dragon
 * images, all Liches see undead images, etc.
 *
 * Priority:
 *   1. Creature-role keyword found in the anomaly's name
 *   2. Type-category keyword (fallback)
 *   3. Default pool (catch-all)
 */

const BASE_PATH = "/generated/compendium/anomalies/anomaly-";

function pad4(n: number): string {
	return String(n).padStart(4, "0");
}

/** Deterministic string → non-negative integer hash (djb2-style). */
function hashString(s: string): number {
	let h = 5381;
	for (let i = 0; i < s.length; i++) {
		h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; // keep 32-bit unsigned
	}
	return h;
}

/** Pick one slot number from [start, end] inclusive, seeded by `seed`. */
function pickSlot(seed: string, start: number, end: number): number {
	const count = end - start + 1;
	return start + (hashString(seed) % count);
}

interface Pool {
	start: number;
	end: number;
}

// ---------------------------------------------------------------------------
// Pool definitions  (1-indexed slot numbers that match anomaly-XXXX.webp)
// 243 images total — pools can overlap where thematic imagery is shared.
// ---------------------------------------------------------------------------

/** Priority 1 — match against the anomaly's display name. */
const NAME_KEYWORD_POOLS: Array<{ keyword: string; pool: Pool }> = [
	{ keyword: "Dragon", pool: { start: 1, end: 20 } },
	{ keyword: "Lich", pool: { start: 21, end: 35 } },
	{ keyword: "Titan", pool: { start: 36, end: 50 } },
	{ keyword: "Wraith", pool: { start: 51, end: 65 } },
	{ keyword: "Phoenix", pool: { start: 66, end: 75 } },
	{ keyword: "Serpent", pool: { start: 76, end: 90 } },
	{ keyword: "Guardian", pool: { start: 91, end: 100 } },
	{ keyword: "Herald", pool: { start: 101, end: 108 } },
	{ keyword: "Horror", pool: { start: 109, end: 118 } },
	{ keyword: "Lurker", pool: { start: 119, end: 125 } },
	{ keyword: "Revenant", pool: { start: 126, end: 133 } },
	{ keyword: "Assassin", pool: { start: 134, end: 140 } },
	{ keyword: "Devourer", pool: { start: 141, end: 148 } },
	{ keyword: "Stalker", pool: { start: 149, end: 155 } },
	{ keyword: "Knight", pool: { start: 156, end: 163 } },
	{ keyword: "Overlord", pool: { start: 164, end: 170 } },
	{ keyword: "Warlord", pool: { start: 171, end: 177 } },
	{ keyword: "Berserker", pool: { start: 178, end: 184 } },
	{ keyword: "Demon", pool: { start: 185, end: 195 } },
];

/** Priority 2 — match against the anomaly's type field. */
const TYPE_KEYWORD_POOLS: Array<{ keyword: string; pool: Pool }> = [
	{ keyword: "Dragon", pool: { start: 1, end: 20 } },
	{ keyword: "Undead", pool: { start: 21, end: 40 } },
	{ keyword: "Beast", pool: { start: 41, end: 70 } },
	{ keyword: "Demon", pool: { start: 185, end: 200 } },
	{ keyword: "Elemental", pool: { start: 196, end: 210 } },
	{ keyword: "Humanoid", pool: { start: 211, end: 225 } },
	{ keyword: "Titan", pool: { start: 36, end: 50 } },
	{ keyword: "God", pool: { start: 226, end: 243 } },
];

/** Priority 3 — catch-all when no keyword matches. */
const DEFAULT_POOL: Pool = { start: 196, end: 243 };

// ---------------------------------------------------------------------------

/**
 * Return a deterministic `/generated/compendium/anomalies/anomaly-XXXX.webp`
 * path for the given anomaly, based on name-keyword → type-keyword → default.
 *
 * @param anomalyId   Stable unique ID used as the randomisation seed.
 * @param name        Anomaly display name (e.g. "Eternal Celestial Guardian").
 * @param type        Anomaly type field  (e.g. "Dragon").
 */
export function resolveAnomalyImage(
	anomalyId: string,
	name: string,
	type: string,
): string {
	const nameLower = name.toLowerCase();
	const typeLower = type.toLowerCase();

	// 1. Name keywords (highest priority)
	for (const entry of NAME_KEYWORD_POOLS) {
		if (nameLower.includes(entry.keyword.toLowerCase())) {
			const slot = pickSlot(anomalyId, entry.pool.start, entry.pool.end);
			return `${BASE_PATH}${pad4(slot)}.webp`;
		}
	}

	// 2. Type keywords
	for (const entry of TYPE_KEYWORD_POOLS) {
		if (typeLower.includes(entry.keyword.toLowerCase())) {
			const slot = pickSlot(anomalyId, entry.pool.start, entry.pool.end);
			return `${BASE_PATH}${pad4(slot)}.webp`;
		}
	}

	// 3. Default fallback
	const slot = pickSlot(anomalyId, DEFAULT_POOL.start, DEFAULT_POOL.end);
	return `${BASE_PATH}${pad4(slot)}.webp`;
}

/**
 * Convenience helper that respects any explicit image already set on the data
 * object before falling back to the resolver.
 *
 * Priority: data.image → data.image_url → resolved thematic image
 */
export function getAnomalyImageSrc(anomaly: {
	id: string;
	name: string;
	type: string;
	image?: string | null;
	image_url?: string | null;
}): string {
	return (
		anomaly.image ??
		anomaly.image_url ??
		resolveAnomalyImage(anomaly.id, anomaly.name, anomaly.type)
	);
}
