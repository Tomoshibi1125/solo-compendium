/**
 * Monster 5e-math + party-of-4 balance locks.
 *
 * Guards the calibration that keeps low-rank anomalies from overwhelming a
 * low-level party of 4, and that every anomaly statblock obeys the 5e CR
 * table. Pure-math assertions (rank bands) run independently of the data;
 * the integration assertion runs the contract validator over the live
 * provider output.
 */
import { describe, expect, it } from "vitest";
import { staticDataProvider } from "@/data/compendium/providers";
import { validateMonsterStatblock } from "@/lib/compendium5eContract";
import { singleMonsterXpBudget } from "@/lib/encounterMath";
import {
	getMonsterCrStats,
	getMonsterCrXp,
	MONSTER_CR_TABLE,
	RANK_CR_BANDS,
} from "@/lib/monster5eTable";

describe("monster 5e CR table integrity", () => {
	it("HP bands ascend and never invert", () => {
		for (const row of MONSTER_CR_TABLE) {
			expect(row.hp_min, `CR ${row.cr}`).toBeLessThanOrEqual(row.hp_max);
		}
		for (let i = 1; i < MONSTER_CR_TABLE.length; i += 1) {
			expect(
				MONSTER_CR_TABLE[i].hp_min,
				`CR ${MONSTER_CR_TABLE[i].cr} HP floor must exceed prior CR`,
			).toBeGreaterThan(MONSTER_CR_TABLE[i - 1].hp_min);
		}
	});
});

describe("rank → CR calibration is party-of-4 safe", () => {
	// The core "won't overwhelm a party of 4 at low level" guarantee, proven as
	// pure math: a single top-of-band monster must sit at or below the Deadly
	// budget for a party of 4 at the rank's entry level. S-rank (boss tier) is
	// the sole exemption.
	for (const rank of ["D", "C", "B", "A"] as const) {
		it(`${rank}-rank top CR stays within the party-of-4 Deadly budget`, () => {
			const band = RANK_CR_BANDS[rank];
			const topXp = getMonsterCrXp(band.cr_max);
			const budget = singleMonsterXpBudget(band.target_level_min, "deadly", 4);
			expect(
				topXp,
				`${rank}-rank CR ${band.cr_max} (${topXp} XP) must be ≤ Deadly budget ${budget} at L${band.target_level_min}`,
			).toBeLessThanOrEqual(budget);
		});
	}

	it("bands are contiguous and ascending (D < C < B < A < S)", () => {
		const order = ["D", "C", "B", "A", "S"] as const;
		for (let i = 1; i < order.length; i += 1) {
			const prev = RANK_CR_BANDS[order[i - 1]];
			const cur = RANK_CR_BANDS[order[i]];
			expect(
				cur.cr_min_value,
				`${order[i]} floor must exceed ${order[i - 1]} ceiling`,
			).toBeGreaterThan(prev.cr_max_value);
		}
	});
});

describe("every anomaly is a complete, 5e-correct statblock", () => {
	it("validateMonsterStatblock reports no issues for any anomaly", async () => {
		const anomalies = await staticDataProvider.getAnomalies("");
		const offenders: string[] = [];
		for (const a of anomalies) {
			const issues = validateMonsterStatblock(
				a as unknown as Record<string, unknown>,
			);
			if (issues.length > 0) {
				offenders.push(`${a.name}: ${issues.map((i) => i.code).join(", ")}`);
			}
		}
		expect(offenders, offenders.slice(0, 20).join("\n")).toEqual([]);
	}, 15000);

	it("D-rank anomalies span more than one CR (variety within a rank)", async () => {
		const anomalies = await staticDataProvider.getAnomalies("");
		const dRankCrs = new Set(
			anomalies
				.filter((a) => (a.gate_rank ?? a.rank) === "D")
				.map((a) => String(a.cr)),
		);
		expect(dRankCrs.size).toBeGreaterThan(1);
	});

	it("a single D-rank anomaly never exceeds the party-of-4 Deadly budget at L1", async () => {
		const anomalies = await staticDataProvider.getAnomalies("");
		const budget = singleMonsterXpBudget(1, "deadly", 4);
		const offenders = anomalies
			.filter((a) => (a.gate_rank ?? a.rank) === "D")
			.filter((a) => {
				const cr = String(a.cr);
				const stats = getMonsterCrStats(cr);
				return stats ? getMonsterCrXp(cr) > budget : false;
			})
			.map((a) => a.name);
		expect(offenders).toEqual([]);
	}, 15000);
});

describe("every anomaly carries DDB stat-block fields", () => {
	it("has a hit-dice formula whose average is within the CR HP band", async () => {
		const anomalies = await staticDataProvider.getAnomalies("");
		const offenders: string[] = [];
		for (const a of anomalies) {
			const formula = String(
				(a as { hit_points_formula?: string }).hit_points_formula ?? "",
			);
			const m = formula.match(/^(\d+)\s*\((\d+)d(\d+)/);
			if (!m) {
				offenders.push(`${a.name}: no hit-dice formula ("${formula}")`);
				continue;
			}
			const average = Number(m[1]);
			const stats = getMonsterCrStats(String(a.cr));
			if (stats && (average < stats.hp_min || average > stats.hp_max))
				offenders.push(
					`${a.name}: hit-dice avg ${average} outside CR ${a.cr} band ${stats.hp_min}-${stats.hp_max}`,
				);
		}
		expect(offenders, offenders.slice(0, 15).join("\n")).toEqual([]);
	}, 15000);

	it("has at least one proficient skill and an AC source", async () => {
		const anomalies = await staticDataProvider.getAnomalies("");
		const offenders: string[] = [];
		for (const a of anomalies) {
			const skills = (a as { skills?: Record<string, unknown> }).skills;
			if (!skills || Object.keys(skills).length === 0)
				offenders.push(`${a.name}: no skills`);
			if (!(a as { ac_source?: string }).ac_source)
				offenders.push(`${a.name}: no ac_source`);
		}
		expect(offenders, offenders.slice(0, 15).join("\n")).toEqual([]);
	}, 15000);

	it("every S-rank boss has legendary AND lair actions", async () => {
		const anomalies = await staticDataProvider.getAnomalies("");
		const offenders = anomalies
			.filter((a) => (a.gate_rank ?? a.rank) === "S")
			.filter((a) => {
				const lair = (a as { lair_actions?: unknown[] }).lair_actions;
				const legendary = (a as { legendary_actions?: unknown[] })
					.legendary_actions;
				return (
					!Array.isArray(lair) ||
					lair.length === 0 ||
					!Array.isArray(legendary) ||
					legendary.length === 0
				);
			})
			.map((a) => a.name);
		expect(offenders).toEqual([]);
	}, 15000);
});
