/**
 * F9 guard — anomaly stat reconciliation across raw vs. provider-transformed
 * shapes. `listCanonicalEntries("anomalies")` yields TRANSFORMED entries whose
 * combat stats live at `armor_class` / `hit_points_average` / `gate_rank` /
 * `cr`. Reading only the raw authored shape collapsed every anomaly to
 * HP 1 / rank UNKNOWN / CR 1/2 / XP 100 and poisoned the encounter difficulty
 * math. These tests fail RED if the helper reverts to raw-only reads.
 */
import { describe, expect, it } from "vitest";
import { resolveAnomalyStats } from "@/lib/anomalyStats";
import type { CompendiumAnomaly } from "@/types/compendium";

const asAnomaly = (shape: Record<string, unknown>): CompendiumAnomaly =>
	shape as unknown as CompendiumAnomaly;

describe("resolveAnomalyStats", () => {
	it("reads provider-TRANSFORMED fields (the F9/F11 regression path)", () => {
		// The exact shape `listCanonicalEntries("anomalies")` hands the builder:
		// numbers at armor_class / hit_points_average / gate_rank / cr, the type
		// at creature_type, and ability scores + saving_throws at the TOP level —
		// and NO raw ac / hp / rank / type / stats.*.
		const stats = resolveAnomalyStats(
			asAnomaly({
				id: "a1",
				name: "Rift Behemoth",
				gate_rank: "A",
				hit_points_average: 120,
				armor_class: 16,
				cr: "8",
				creature_type: "Dragon",
				str: 26,
				agi: 20,
				vit: 26,
				int: 14,
				sense: 14,
				pre: 16,
				saving_throws: { Strength: 13, Vitality: 13 },
			}),
		);

		expect(stats.rank).toBe("A");
		expect(stats.hp).toBe(120);
		expect(stats.ac).toBe(16);
		expect(stats.cr).toBe("8");
		expect(stats.xp).toBe(3900); // getCRXP("8")
		expect(stats.creatureType).toBe("Dragon");
		expect(stats.abilities).toEqual({
			str: 26,
			agi: 20,
			vit: 26,
			int: 14,
			sense: 14,
			pre: 16,
		});
		expect(stats.savingThrows).toEqual({ Strength: 13, Vitality: 13 });

		// Explicitly assert it did NOT collapse to the raw-only defaults.
		expect(stats.hp).not.toBe(1);
		expect(stats.rank).not.toBeNull();
		expect(stats.cr).not.toBe("1/2");
		expect(stats.xp).not.toBe(100);
		expect(stats.creatureType).not.toBe("Unknown");
		expect(stats.abilities.str).not.toBe(10);
	});

	it("still resolves the raw authored shape via fallbacks", () => {
		const stats = resolveAnomalyStats(
			asAnomaly({
				id: "a2",
				name: "Lesser Wisp",
				type: "Aberration",
				rank: "B",
				hp: 45,
				ac: 14,
				stats: {
					challenge_rating: 4,
					ability_scores: { strength: 12, agility: 18 },
					saving_throws: { Agility: 5 },
				},
			}),
		);

		expect(stats.rank).toBe("B");
		expect(stats.hp).toBe(45);
		expect(stats.ac).toBe(14);
		expect(stats.cr).toBe("4");
		expect(stats.xp).toBe(1100); // getCRXP("4")
		expect(stats.creatureType).toBe("Aberration");
		expect(stats.abilities.str).toBe(12);
		expect(stats.abilities.agi).toBe(18);
		expect(stats.abilities.vit).toBe(10); // absent → default
		expect(stats.savingThrows).toEqual({ Agility: 5 });
	});

	it("prefers a numeric challenge_rating and labels fractional CRs", () => {
		const stats = resolveAnomalyStats(
			asAnomaly({
				id: "a3",
				name: "Fractional Fiend",
				gate_rank: "D",
				cr: "1", // should be overridden by the numeric CR below
				stats: { challenge_rating: 0.5 },
			}),
		);

		expect(stats.cr).toBe("1/2");
		expect(stats.xp).toBe(100);
	});

	it("accepts a transformed fractional CR string when no numeric CR is present", () => {
		const stats = resolveAnomalyStats(
			asAnomaly({
				id: "a4",
				name: "Quarter Quasit",
				gate_rank: "D",
				cr: "1/4",
				hit_points_average: 7,
			}),
		);

		expect(stats.cr).toBe("1/4");
		expect(stats.xp).toBe(50); // getCRXP("1/4")
		expect(stats.hp).toBe(7);
	});

	it("falls back to sane defaults for an empty entry", () => {
		const stats = resolveAnomalyStats(asAnomaly({ id: "a5", name: "Unknown" }));

		expect(stats.hp).toBe(1);
		expect(stats.ac).toBe(10);
		expect(stats.rank).toBeNull();
		expect(stats.cr).toBe("1/2"); // RANK_CR_MAP["D"] fallback
		expect(stats.xp).toBe(100);
		expect(stats.creatureType).toBe("Unknown");
		expect(stats.abilities).toEqual({
			str: 10,
			agi: 10,
			vit: 10,
			int: 10,
			sense: 10,
			pre: 10,
		});
		expect(stats.savingThrows).toBeNull();
	});
});
