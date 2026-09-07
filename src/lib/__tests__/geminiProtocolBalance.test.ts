/**
 * Fusion deep-balance and canonical identity guards.
 */

import { describe, expect, it } from "vitest";
import type { Job, Path, Regent } from "@/lib/geminiProtocol";
import {
	generateSovereign,
	generateSovereignWithAI,
	mergeSources,
} from "@/lib/geminiProtocol";

const job = { id: "job-1", name: "Destroyer" } as unknown as Job;
const path = {
	id: "path-1",
	name: "Path of the Frostwarden",
} as unknown as Path;
const regentA = {
	id: "umbral_regent",
	name: "Umbral Regent",
	title: "Regent of Shadow",
	theme: "Umbral and Death",
	damage_type: "Necrotic",
} as unknown as Regent;
const regentB = {
	id: "frost_regent",
	name: "Frost Regent",
	title: "Regent of Frost",
	theme: "Eternal Winter & absolute Zero",
	damage_type: "Cold",
} as unknown as Regent;

describe("generateSovereign — balance invariants", () => {
	const sovereign = generateSovereign(job, path, regentA, regentB);

	it("emits exactly the ordered 8-ability ladder", () => {
		expect(sovereign.abilities.map((ability) => ability.level)).toEqual([
			1, 3, 5, 7, 10, 14, 17, 20,
		]);
	});

	it("flags only the 17/20 abilities as capstones", () => {
		expect(
			sovereign.abilities
				.filter((ability) => ability.is_capstone)
				.map((ability) => ability.level),
		).toEqual([17, 20]);
	});

	it("never bakes a stale numeric proficiency bonus into feature text", () => {
		for (const ability of sovereign.abilities) {
			expect(ability.description, ability.name).not.toMatch(/\+\d+\s+bonus/i);
		}
		expect(
			sovereign.abilities.find((ability) => ability.level === 3)?.description,
		).toMatch(/proficiency bonus/i);
	});

	it("leaves no unresolved placeholder tokens", () => {
		for (const ability of sovereign.abilities) {
			expect(ability.name, ability.name).not.toMatch(/\{[a-zA-Z]+\}/);
			expect(ability.description, ability.name).not.toMatch(/\{[a-zA-Z]+\}/);
		}
	});

	it("normalizes explicit aliases while preserving A/B dominance and order", () => {
		const legacyA = { ...regentA, id: "shadow_regent" } as Regent;
		const forward = generateSovereign(job, path, legacyA, regentB);
		const reverse = generateSovereign(job, path, regentB, legacyA);

		expect([forward.regentA.id, forward.regentB.id]).toEqual([
			"umbral_regent",
			"frost_regent",
		]);
		expect([reverse.regentA.id, reverse.regentB.id]).toEqual([
			"frost_regent",
			"umbral_regent",
		]);
		expect(forward.name).not.toBe(reverse.name);
	});

	it("rejects normalized self-fusion at deterministic and AI boundaries", async () => {
		const legacyA = { ...regentA, id: "shadow_regent" } as Regent;
		expect(() => generateSovereign(job, path, legacyA, regentA)).toThrow(
			/distinct canonical Regents/i,
		);
		await expect(
			generateSovereignWithAI(job, path, legacyA, regentA),
		).rejects.toThrow(/distinct canonical Regents/i);
	});

	it("generates safely for canonical Regents with no theme or damage type", () => {
		const noThemeA = {
			...regentA,
			theme: null,
			damage_type: null,
		} as unknown as Regent;
		const noThemeB = {
			...regentB,
			theme: null,
			damage_type: null,
		} as unknown as Regent;
		const generated = generateSovereign(job, path, noThemeA, noThemeB);
		const authoredText = [
			generated.name,
			generated.title,
			generated.fusion_theme,
			generated.fusion_description,
			...generated.abilities.flatMap((ability) => [
				ability.name,
				ability.description,
			]),
		].join(" ");

		expect(authoredText).not.toMatch(/\b(?:undefined|null)\b/i);
		expect(authoredText).not.toMatch(/\bForce\b/);
		expect(authoredText).toContain("originating features");
	});

	it("deduplicates sources by normalized vernacular identity", () => {
		expect(
			mergeSources(
				["Shadow Monarch", "  Destroyer  "],
				["shadow regent", "Destroyer", "Frost Regent"],
			),
		).toEqual(["Shadow Regent", "Destroyer", "Frost Regent"]);
	});
});
