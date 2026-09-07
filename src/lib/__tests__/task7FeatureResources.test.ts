import { describe, expect, it } from "vitest";
import { regents } from "@/data/compendium/regents";
import {
	getRegentLeveledFeatures,
	materializeCanonicalRegentLedger,
} from "@/lib/regentProgression";

const feature = (regentId: string, level: number, name: string) => {
	const regent = regents.find((entry) => entry.id === regentId);
	if (!regent) throw new Error(`Missing Regent ${regentId}`);
	const match = getRegentLeveledFeatures(regent).find(
		(entry) => entry.level === level && entry.name === name,
	);
	if (!match) throw new Error(`Missing ${regentId} L${level} ${name}`);
	return match;
};

describe("Task 7 Regent action and resource metadata", () => {
	it("structures explicit rest cadences without parsing thematic prose", () => {
		expect(feature("umbral_regent", 2, "Essence Harvest")).toMatchObject({
			actionType: "Reaction",
			frequency: "short-rest",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		});
		expect(
			feature("steel_regent", 3, "Conceptual Invulnerability"),
		).toMatchObject({
			actionType: "Action",
			frequency: "long-rest",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		});
		expect(feature("gravity_regent", 5, "Event Horizon")).toMatchObject({
			actionType: "Reaction",
			frequency: "short-rest",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		});
	});

	it("keeps daily cadence manual instead of equating a day with a long rest", () => {
		const burst = feature("radiant_regent", 3, "White Flame Burst");
		expect(burst).toMatchObject({
			actionType: "Action",
			frequency: "once-per-day",
			tracking: "manual",
		});
		expect(burst.uses).toBeUndefined();
	});

	it("does not invent formulas for abbreviated or contradictory cadences", () => {
		for (const [regentId, level, name] of [
			["frost_regent", 3, "Glacial Eternity"],
			["beast_regent", 1, "Apex Form"],
			["beast_regent", 2, "Beast King's Call"],
			["plague_regent", 2, "Pandemic Decree"],
			["spatial_regent", 9, "Reality Rewrite"],
			["mimic_regent", 1, "Power Theft"],
			["blood_regent", 5, "Sanguine Rebirth"],
			["blood_regent", 9, "Blood Apocalypse"],
		] as const) {
			const row = feature(regentId, level, name);
			expect(row.tracking, `${regentId} ${name}`).toBe("manual");
			expect(row.uses, `${regentId} ${name}`).toBeUndefined();
			expect(row.reviewBlockerId).toBe(
				`task7:${regentId}:progression-mechanics`,
			);
		}
	});

	it("marks unresolved mechanics as manual and effect-free", () => {
		for (const regent of regents) {
			for (const row of getRegentLeveledFeatures(regent).filter(
				(feature) => feature.canonStatus === "review-blocked",
			)) {
				expect(row.tracking).toBe("manual");
				expect(row.uses).toBeUndefined();
				expect(row.resource).toBeUndefined();
			}
		}
	});

	it("is idempotent when the canonical ledger is materialized again", () => {
		for (const regent of regents) {
			const before = getRegentLeveledFeatures(regent).map((row) => ({
				id: row.id,
				level: row.level,
				name: row.name,
				actionType: row.actionType,
				uses: row.uses,
				tracking: row.tracking,
				canonStatus: row.canonStatus,
			}));
			const after = materializeCanonicalRegentLedger(regent).map((row) => ({
				id: row.id,
				level: row.level,
				name: row.name,
				actionType: row.actionType,
				uses: row.uses,
				tracking: row.tracking,
				canonStatus: row.canonStatus,
			}));
			expect(after, regent.id).toEqual(before);
		}
	});
});
