import { describe, expect, it } from "vitest";
import { Constants } from "@/integrations/supabase/types";
import { RARITY_ORDER } from "@/types/core-rules";

/**
 * Drift guard for the rarity ladder across two sources of truth:
 *  - app ladder: `RARITY_ORDER` in src/types/core-rules.ts (8 tiers, hyphen form)
 *  - persisted Postgres enum: `Constants.public.Enums.rarity` (generated from the
 *    DB; extended to the full 8 tiers in migration
 *    20260604000000_extend_rarity_enum_full_ladder.sql).
 *
 * If either drifts, equipment delivery silently loses the higher rarities — the
 * pre-extension enum had only 5 values, so epic/mythic/artifact NULLed out in
 * `warden_grant_character_equipment` / `normalizeRarityForDb`. These assertions
 * fail loudly if the DB enum and the app ladder fall out of sync again.
 */

// The app ladder uses hyphenated "very-rare"; the DB enum uses underscore
// "very_rare". This mirrors normalizeRarityForDb's separator normalization.
const toDbRarity = (rarity: string): string => rarity.replace(/[\s-]/g, "_");

describe("rarity DB enum ↔ app ladder alignment", () => {
	const dbRarities = Constants.public.Enums.rarity;

	it("DB enum carries the full 8-tier ladder in ascending order", () => {
		expect([...dbRarities]).toEqual([
			"common",
			"uncommon",
			"rare",
			"very_rare",
			"epic",
			"legendary",
			"mythic",
			"artifact",
		]);
	});

	it("every app-ladder rarity is storable in the DB enum (no down-mapping loss)", () => {
		for (const appRarity of RARITY_ORDER) {
			expect(dbRarities).toContain(toDbRarity(appRarity));
		}
	});

	it("app ladder and DB enum have the same number of tiers", () => {
		expect(dbRarities).toHaveLength(RARITY_ORDER.length);
	});
});
