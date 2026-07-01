import { describe, expect, it } from "vitest";
import {
	fieldRosterNPCs,
	getRecruitablePool,
} from "@/data/compendium/recruitable-roster";
import {
	getUnaffiliatedNPCs,
	sandboxRecruitableNPCs,
} from "@/data/compendium/sandbox-npcs";

describe("recruitable field roster", () => {
	it("contains the planned 36 fully-built NPCs", () => {
		expect(fieldRosterNPCs.length).toBe(36);
	});

	it("has unique ids that never collide with the Run Silent roster", () => {
		const ids = fieldRosterNPCs.map((n) => n.id);
		expect(new Set(ids).size).toBe(ids.length);
		const sandboxIds = new Set(sandboxRecruitableNPCs.map((n) => n.id));
		for (const id of ids) expect(sandboxIds.has(id)).toBe(false);
	});

	it("is entirely recruitable and unaffiliated (so the guild pool surfaces it)", () => {
		for (const npc of fieldRosterNPCs) {
			expect(npc.isRecruitable).toBe(true);
			expect(npc.guildAffiliation).toBeNull();
		}
	});

	it("distinguishes mundane vs ascendant: ascendants carry a rank, mundanes do not", () => {
		for (const npc of fieldRosterNPCs) {
			if (npc.kind === "mundane") {
				expect(npc.rank).toBeUndefined();
			} else {
				expect(npc.kind).toBe("ascendant");
				expect(npc.rank).toBeTruthy();
			}
		}
		// The roster is deliberately a varied mix of both kinds.
		expect(fieldRosterNPCs.some((n) => n.kind === "mundane")).toBe(true);
		expect(fieldRosterNPCs.some((n) => n.kind === "ascendant")).toBe(true);
	});

	it("gives every NPC a full, valid leveling track", () => {
		for (const npc of fieldRosterNPCs) {
			expect(npc.leveling.maxLevel).toBeGreaterThanOrEqual(npc.level);
			expect(npc.leveling.xpToNextLevel).toBeGreaterThan(0);
			expect(npc.hp).toBeGreaterThan(0);
			expect(npc.ac).toBeGreaterThan(0);
			expect(npc.keyAbilities.length).toBeGreaterThan(0);
		}
	});

	it("covers all three sources (Glassline, Bureau low-ranks, independents)", () => {
		const ids = new Set(fieldRosterNPCs.map((n) => n.id));
		expect(ids.has("npc-glx-001")).toBe(true); // Glassline crew
		expect(ids.has("npc-bfr-001")).toBe(true); // Bureau lower-rank
		expect(ids.has("npc-ia-001")).toBe(true); // independent ascendant
	});
});

describe("getRecruitablePool", () => {
	it("merges the unaffiliated Run Silent natives with the field roster, de-duplicated", () => {
		const pool = getRecruitablePool();
		const ids = pool.map((n) => n.id);
		expect(new Set(ids).size).toBe(ids.length);
		expect(pool.length).toBe(
			getUnaffiliatedNPCs().length + fieldRosterNPCs.length,
		);
	});

	it("only ever returns recruitable, unaffiliated NPCs", () => {
		for (const npc of getRecruitablePool()) {
			expect(npc.isRecruitable).toBe(true);
			expect(npc.guildAffiliation).toBeNull();
		}
	});
});
