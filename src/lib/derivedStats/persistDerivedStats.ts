/**
 * Derived-stats denormalized cache writer.
 *
 * The columns `armor_class`, `speed`, `initiative`, and `hp_max` on the
 * `characters` table are a write-through cache for engine-computed
 * values (see migration `20260528000500_derived_stats_cache.sql`).
 * This module is the **single canonical writer** for that cache.
 *
 * Call `persistDerivedStats(characterId, computed)` after every mutation
 * that touches an input the engine reads:
 *   - ability scores
 *   - level / job / path / regent
 *   - equipped items / attuned items
 *   - active features / feats / spells
 *   - active conditions / exhaustion level
 *
 * The override path: when the character has a non-null `hp_max_override`,
 * `resolveHpMax(character)` returns it verbatim. The engine's computed
 * value is still cached for diagnostics, but the override wins on read.
 */

import { supabase } from "@/integrations/supabase/client";

export interface DerivedStatsSnapshot {
	armorClass: number;
	speed: number;
	initiative: number;
	hpMax: number;
}

/**
 * Write the engine-computed derived stats back to the characters row.
 * No-op for unauthenticated or missing characterId.
 *
 * Note: this is best-effort. A failure here does NOT throw — the engine
 * remains the source of truth at read time, and a stale cache will only
 * affect external readers (VTT token sync, party dashboard) until the
 * next mutation triggers a refresh.
 */
export async function persistDerivedStats(
	characterId: string | null | undefined,
	snapshot: DerivedStatsSnapshot,
): Promise<void> {
	if (!characterId) return;
	try {
		await supabase
			.from("characters")
			.update({
				armor_class: snapshot.armorClass,
				speed: snapshot.speed,
				initiative: snapshot.initiative,
				hp_max: snapshot.hpMax,
				derived_stats_cached_at: new Date().toISOString(),
			})
			.eq("id", characterId);
	} catch {
		// Swallow — see JSDoc above. The engine remains authoritative.
	}
}

/**
 * Resolve the displayed `hp_max` for a character, honoring the manual
 * override field when present. Computed value wins by default.
 */
export function resolveHpMax(character: {
	hp_max?: number | null;
	hp_max_override?: number | null;
}): number {
	if (
		typeof character.hp_max_override === "number" &&
		character.hp_max_override > 0
	) {
		return character.hp_max_override;
	}
	return character.hp_max ?? 0;
}

/**
 * Whether the cached derived-stats row may be stale relative to a known
 * input-mutation timestamp. Use this on read paths that need to decide
 * whether to trust the cached column or trigger a fresh engine run.
 *
 * Returns true if the cache is missing or older than the input mutation.
 */
export function isDerivedCacheStale(
	cachedAt: string | null | undefined,
	inputsUpdatedAt: string | null | undefined,
): boolean {
	if (!cachedAt) return true;
	if (!inputsUpdatedAt) return false;
	return new Date(cachedAt) < new Date(inputsUpdatedAt);
}
