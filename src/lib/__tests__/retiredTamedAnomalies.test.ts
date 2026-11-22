import { describe, expect, it } from "vitest";
import { createCanonicalCompanionSource } from "@/lib/companions";
import { companionRowsFromRetiredTames } from "@/lib/retiredTamedAnomalies";

describe("retired personal tames become companions (RA-9)", () => {
	it("builds the species snapshot from the catalog and keeps the creature's state", async () => {
		const [row] = await companionRowsFromRetiredTames([
			{
				id: "old-row",
				character_id: "old-character",
				companion_instance_id: "foreign-instance",
				anomaly_id: "anomaly-0006",
				current_hp: 7,
				conditions: [{ id: "c1", name: "Frightened" }],
				initiative: 14,
				notes: "Found in the Rift",
				is_summoned: true,
			},
		]);
		expect(row).toMatchObject({
			name: "Eternal Ancient Dragon",
			extra_type: "companion",
			hp_current: 7,
			hp_max: 12,
			ac: 13,
			speed: 30,
			monster_id: null,
			conditions: [{ id: "c1", name: "Frightened" }],
			initiative: 14,
			notes: "Found in the Rift",
			is_active: true,
			npc_data: {
				kind: "canonical-compendium",
				provenance: {
					canonicalId: "anomaly-0006",
					canonicalType: "anomaly",
					canonicalCollection: "anomalies",
				},
				sourceFields: { name: "Eternal Ancient Dragon", rank: "D" },
			},
		});
		// The importing character owns it; the server assigns a new identity.
		expect(row).not.toHaveProperty("id");
		expect(row).not.toHaveProperty("character_id");
		expect(row).not.toHaveProperty("companion_instance_id");
	});

	it("prefers the frozen acquisition snapshot and the creature's nickname", async () => {
		const frozen = createCanonicalCompanionSource({
			canonicalId: "anomaly-0011",
			canonicalType: "anomaly",
			canonicalCollection: "anomalies",
			name: "Eternal Abyssal Titan",
			hpMax: 22,
			baseAc: 15,
			speed: 30,
			rank: "D",
		});
		const [row] = await companionRowsFromRetiredTames([
			{
				anomaly_id: "anomaly-0011",
				nickname: " Rook ",
				current_hp: 20,
				max_hp_override: 25,
				companion_source_snapshot: frozen,
			},
		]);
		expect(row).toMatchObject({
			name: "Rook",
			hp_current: 20,
			hp_max: 25,
			ac: 15,
			is_active: false,
			npc_data: frozen,
		});
	});

	it("ignores a snapshot for another species and keeps unknown species as named tames", async () => {
		const mismatched = createCanonicalCompanionSource({
			canonicalId: "anomaly-0006",
			canonicalType: "anomaly",
			canonicalCollection: "anomalies",
			name: "Wrong species",
			hpMax: 999,
			baseAc: 30,
			speed: 30,
			rank: "S",
		});
		const rows = await companionRowsFromRetiredTames([
			{ anomaly_id: "anomaly-0016", companion_source_snapshot: mismatched },
			{ anomaly_id: "not-in-catalog", nickname: "Mystery", current_hp: 4 },
			{ nickname: "No species" },
			"not a row",
		]);
		expect(rows).toHaveLength(2);
		expect(rows[0]).toMatchObject({
			name: "Eternal Ancient Lich",
			npc_data: { provenance: { canonicalId: "anomaly-0016" } },
		});
		expect(rows[1]).toMatchObject({
			name: "Mystery",
			hp_current: 4,
			hp_max: 4,
			npc_data: {
				provenance: { canonicalId: "not-in-catalog" },
				sourceFields: { name: "Mystery", rank: null },
			},
		});
	});

	it("returns nothing for files without personal tames", async () => {
		await expect(companionRowsFromRetiredTames(undefined)).resolves.toEqual([]);
		await expect(companionRowsFromRetiredTames([])).resolves.toEqual([]);
	});
});
