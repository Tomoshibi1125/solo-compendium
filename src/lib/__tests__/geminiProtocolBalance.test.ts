/**
 * Fusion deep-balance guards.
 *
 * Sovereign fusion abilities are display+action features (modifiers: null),
 * so their generated TEXT is the table-facing rule. These tests pin the
 * balance-relevant invariants of the generator: the 8-ability level ladder,
 * capstone flagging, and that no template bakes a stale numeric proficiency
 * bonus into permanent feature text.
 */

import { describe, expect, it } from "vitest";
import type { Job, Path, Regent } from "@/lib/geminiProtocol";
import { generateSovereign } from "@/lib/geminiProtocol";

const job = { id: "job-1", name: "Destroyer" } as unknown as Job;
const path = {
	id: "path-1",
	name: "Path of the Frostwarden",
} as unknown as Path;
const regentA = {
	id: "umbral_regent",
	name: "Umbral Regent",
	title: "Regent of Shadow",
	theme: "Shadow",
	damage_type: "Necrotic",
} as unknown as Regent;
const regentB = {
	id: "frost_regent",
	name: "Frost Regent",
	title: "Regent of Frost",
	theme: "Frost",
	damage_type: "Cold",
} as unknown as Regent;

describe("generateSovereign — balance invariants", () => {
	const sovereign = generateSovereign(job, path, regentA, regentB);

	it("emits exactly the 8-ability level ladder 1/3/5/7/10/14/17/20", () => {
		expect(sovereign.abilities.map((a) => a.level)).toEqual([
			1, 3, 5, 7, 10, 14, 17, 20,
		]);
	});

	it("flags only the 17/20 abilities as capstones", () => {
		const capstoneLevels = sovereign.abilities
			.filter((a) => a.is_capstone)
			.map((a) => a.level);
		expect(capstoneLevels).toEqual([17, 20]);
	});

	it("never bakes a stale numeric proficiency bonus into feature text", () => {
		// The L3 class-integration text once hardcoded "+2 bonus" — correct at
		// level 3, wrong from level 5 on. Feature text persists for the life of
		// the character, so it must reference the scaling stat, not a snapshot.
		for (const ability of sovereign.abilities) {
			expect(ability.description, ability.name).not.toMatch(/\+\d+\s+bonus/i);
		}
		const classIntegration = sovereign.abilities.find((a) => a.level === 3);
		expect(classIntegration?.description).toMatch(/proficiency bonus/i);
	});

	it("leaves no unresolved {placeholder} tokens in generated text", () => {
		for (const ability of sovereign.abilities) {
			expect(ability.name, ability.name).not.toMatch(/\{[a-zA-Z]+\}/);
			expect(ability.description, ability.name).not.toMatch(/\{[a-zA-Z]+\}/);
		}
	});
});
