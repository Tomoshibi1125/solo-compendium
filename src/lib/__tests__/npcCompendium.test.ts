import { describe, expect, it } from "vitest";
import { staticDataProvider } from "@/data/compendium/providers";
import { fieldRosterNPCs } from "@/data/compendium/recruitable-roster";
import { sandboxRecruitableNPCs } from "@/data/compendium/sandbox-npcs";
import { isValidEntryType, resolveRef } from "@/lib/compendiumResolver";

const TOTAL_NPCS = sandboxRecruitableNPCs.length + fieldRosterNPCs.length;

describe("NPC compendium wiring", () => {
	it("registers npcs as a valid entry type", () => {
		expect(isValidEntryType("npcs")).toBe(true);
	});

	it("getNpcs surfaces every sandbox + field-roster NPC as a canon compendium entry", async () => {
		const entries = await staticDataProvider.getNpcs();
		expect(entries.length).toBe(TOTAL_NPCS);
		for (const entry of entries) {
			expect(entry.id).toBeTruthy();
			expect(entry.name).toBeTruthy();
			expect(entry.source_book).toBe("Rift Ascendant Canon");
		}
	});

	it("includes the field roster (Glassline / Bureau low-ranks / independents) as recruitable", async () => {
		const entries = await staticDataProvider.getNpcs();
		const byId = (id: string) =>
			entries.find((e) => e.id === id) as unknown as
				| Record<string, unknown>
				| undefined;
		// Glassline crew — mundane contractor.
		const mira = byId("npc-glx-001");
		expect(mira?.name).toBe("Mira Voss");
		expect(mira?.is_recruitable).toBe(true);
		expect(mira?.kind).toBe("mundane");
		// Bureau lower-rank field Ascendant — carries a rank.
		const vance = byId("npc-bfr-003");
		expect(vance?.is_recruitable).toBe(true);
		expect(vance?.rank).toBe("D");
		// Independent ascendant.
		expect(byId("npc-ia-015")?.name).toBe("Vael, the Quiet Star");
	});

	it("maps a known NPC's stat block and recruitment fields", async () => {
		const entries = await staticDataProvider.getNpcs();
		const park = entries.find((e) => e.id === "npc-bureau-001") as unknown as
			| Record<string, unknown>
			| undefined;
		expect(park).toBeDefined();
		expect(park?.name).toBe("Commander Park Jae-won");
		expect(park?.hit_points).toBe(95);
		expect(park?.armor_class).toBe(18);
		expect(park?.level).toBe(8);
		expect(park?.job).toBe("Destroyer");
		// Bureau ranking officer — ally, not a recruit (see eligibility test).
		expect(park?.is_recruitable).toBe(false);
		expect(park?.faction).toBe("Bureau Sentinels");
		expect(Array.isArray(park?.key_abilities)).toBe(true);
	});

	it("flags non-recruitable story NPCs", async () => {
		const entries = await staticDataProvider.getNpcs();
		const hollowMother = entries.find(
			(e) => e.id === "npc-awoko-001",
		) as unknown as Record<string, unknown> | undefined;
		expect(hollowMother?.name).toBe("The Hollow Mother");
		expect(hollowMother?.is_recruitable).toBe(false);
	});

	it("respects recruitment eligibility (essential vs non-essential)", async () => {
		const entries = await staticDataProvider.getNpcs();
		const recruitable = (id: string) =>
			(
				entries.find((e) => e.id === id) as unknown as
					| Record<string, unknown>
					| undefined
			)?.is_recruitable;
		// Non-essential NPCs remain recruitable.
		expect(recruitable("npc-ind-201")).toBe(true); // Maven Holt (merchant)
		// Bureau ranking officers are allies, not recruits.
		expect(recruitable("npc-bureau-001")).toBe(false); // Commander Park
		expect(recruitable("npc-bureau-007")).toBe(false); // Comms Officer Reyes
		// Faction leaders / unique high-tier figures are not recruitable.
		expect(recruitable("npc-verm-004")).toBe(false); // Guildmaster Orin
		expect(recruitable("npc-anom-002")).toBe(false); // The Watcher
		// ...but the green recruit and corporal-cook stay recruitable.
		expect(recruitable("npc-bureau-006")).toBe(true); // Corporal Deng
		expect(recruitable("npc-bureau-008")).toBe(true); // Warden-Aspirant Sato
	});

	it("filters by search text", async () => {
		const results = await staticDataProvider.getNpcs("Hollow Mother");
		expect(results.some((e) => e.name === "The Hollow Mother")).toBe(true);
		expect(results.length).toBeLessThan(TOTAL_NPCS);
	});

	it("resolveRef resolves an NPC by id", async () => {
		const entity = (await resolveRef("npcs", "npc-bureau-001")) as Record<
			string,
			unknown
		> | null;
		expect(entity).not.toBeNull();
		expect(entity?.name).toBe("Commander Park Jae-won");
		expect(entity?.type).toBe("npcs");
	});
});
