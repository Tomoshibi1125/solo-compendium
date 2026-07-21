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
import { isLocalCharacterId, updateLocalCharacter } from "@/lib/guestStore";

export interface DerivedStatsSnapshot {
	armorClass: number;
	/**
	 * @deprecated Do NOT cache speed through this write-through. Unlike AC and
	 * initiative (recomputed from abilities/equipment each render), the engine
	 * READS `character.speed` back as its own base input — and the display
	 * value includes TRANSIENT penalties (encumbrance, conditions, exhaustion).
	 * Persisting it re-feeds the penalty on the next render and the value
	 * compounds toward zero (35 → 17 → 8 → …, observed live Jul 20 the moment
	 * exhaustion halving shipped). The `speed` column stays the authoritative
	 * BASE, written only by creation/level-up/awakening traits. This field is
	 * ignored on write.
	 */
	speed?: number;
	initiative: number;
	/**
	 * @deprecated Do NOT cache hp_max through this write-through. Unlike AC /
	 * speed / initiative (pure functions of inputs, recomputed each render),
	 * `hp_max` is an AUTHORITATIVE STORED value: it preserves rolled HP and is
	 * maintained additively by creation/level-up/rest (`character.hp_max +
	 * hpIncrease`). The engine then READS `hp_max` as the base in
	 * `resolveHpMax` and adds reactive bonuses (gestalt Regent HP, custom HP
	 * modifiers) for display. Persisting the display value back into the base
	 * column re-feeds those bonuses on the next refetch → runaway HP inflation.
	 * Display/external truth = base `hp_max` + reactive bonuses, computed at
	 * read time (see `getEffectiveHpMax`). This field is ignored on write.
	 */
	hpMax?: number;
}

/**
 * Write the engine-computed derived stats back to the characters row.
 * No-op for unauthenticated or missing characterId.
 *
 * Caches ONLY the pure-derived columns (armor_class, speed, initiative) so
 * external readers (party dashboard, API consumers) see fresh values without
 * re-running the engine. `hp_max` is intentionally NOT written here — it is
 * authoritative-stored (see DerivedStatsSnapshot.hpMax).
 *
 * Best-effort: a failure does NOT throw — the engine remains the source of
 * truth at read time.
 */
export async function persistDerivedStats(
	characterId: string | null | undefined,
	snapshot: DerivedStatsSnapshot,
): Promise<void> {
	if (!characterId) return;
	try {
		if (isLocalCharacterId(characterId)) {
			// Guest characters: write the cache to the local store — the cloud
			// PATCH below 400s for `local_` ids on every derived-stats recompute.
			updateLocalCharacter(characterId, {
				armor_class: snapshot.armorClass,
				initiative: snapshot.initiative,
				derived_stats_cached_at: new Date().toISOString(),
			});
			return;
		}
		await supabase
			.from("characters")
			.update({
				armor_class: snapshot.armorClass,
				initiative: snapshot.initiative,
				derived_stats_cached_at: new Date().toISOString(),
			})
			.eq("id", characterId);
	} catch {
		// Swallow — see JSDoc above. The engine remains authoritative.
	}
}

/**
 * Resolve the BASE `hp_max` for a character, honoring the manual override
 * field when present. This is the authoritative-stored base (rolled HP
 * preserved); it does NOT include reactive bonuses. For the value shown to
 * users, use `getEffectiveHpMax`.
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
 * The TRUE HP max shown to users everywhere (interactive sheet + external
 * readers), so all surfaces agree with the engine. It is the override-aware
 * base (`resolveHpMax`) plus the additive gestalt Regent HP contribution.
 *
 * An explicit `hp_max_override` is treated as a final value and is NOT
 * augmented with gestalt HP (mirrors the interactive engine path). Custom
 * `hp-max` modifiers are layered on by the full engine
 * (`useCharacterDerivedStats` → `calculatedStats.hpMax`); this lightweight
 * helper covers the base + gestalt that external readers can compute without
 * the full custom-modifier pipeline.
 */
export function getEffectiveHpMax(
	character: {
		hp_max?: number | null;
		hp_max_override?: number | null;
		level?: number | null;
	},
	regentHpContribution: number,
): number {
	const base = resolveHpMax(character);
	const hasOverride =
		typeof character.hp_max_override === "number" &&
		character.hp_max_override > 0;
	if (hasOverride) return base;
	return Math.max(1, base + Math.max(0, regentHpContribution));
}
