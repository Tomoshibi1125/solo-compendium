import { describe, expect, it } from "vitest";
import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import {
	compendiumCategoryDefinitions,
	loadCanonicalRegistry,
} from "@/data/compendium/registry";
import { resolveCanonicalAbility } from "@/lib/canonicalAbilityResolution";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";

const entry = (value: Record<string, unknown>): StaticCompendiumEntry =>
	value as unknown as StaticCompendiumEntry;

describe("canonical ability resolution v1", () => {
	it("automates only a fully structured authored attack", () => {
		const resolution = resolveCanonicalAbility(
			entry({
				id: "test-bolt",
				name: "Test Bolt",
				source_book: "Rift Ascendant Canon",
				activation: "1 action",
				target: "one creature",
				range: "60 feet",
				duration: "Instantaneous",
				atWill: true,
				has_attack_roll: true,
				attack: { type: "ranged spell", roll: "1d20+5" },
				damage_roll: "2d6",
				damage_type: "force",
			}),
			{ canonicalType: "power" },
		);

		expect(resolution.status).toBe("automated");
		expect(resolution.resolutionKinds).toEqual(["attack", "damage"]);
		expect(resolution.damage).toEqual([
			{ formula: "2d6", type: "force", when: "hit" },
		]);
		expect(resolution.provenance.sourceFieldPaths).toEqual(
			expect.arrayContaining([
				"activation",
				"attack",
				"damage_roll",
				"damage_type",
				"target",
			]),
		);
	});

	it("keeps incomplete utility mechanics explicit and manual", () => {
		const resolution = resolveCanonicalAbility(
			entry({
				id: "unquantified-aura",
				name: "Unquantified Aura",
				description: "Nearby allies receive an unspecified benefit.",
			}),
			{ canonicalType: "spell" },
		);

		expect(resolution.status).toBe("manual");
		expect(resolution.resolutionKinds).toEqual(["effect"]);
		if (resolution.status !== "manual") throw new Error("expected manual");
		expect(resolution.manual.reason).toContain("activation");
		expect(resolution.manual.instructions).toContain("do not infer");
	});

	it("makes review-blocked abilities effect-free", () => {
		const resolution = resolveCanonicalAbility(
			entry({
				id: "blocked-strike",
				name: "Blocked Strike",
				activation: "1 action",
				target: "one creature",
				range: "30 feet",
				duration: "Instantaneous",
				atWill: true,
				damage_roll: "8d8",
			}),
			{
				canonicalType: "technique",
				reviewBlocker: {
					id: "task9:test:missing-save",
					message: "The source does not author the required save.",
				},
			},
		);

		expect(resolution.status).toBe("review-blocked");
		expect(resolution.resolutionKinds).toEqual([]);
		expect(resolution.damage).toBeUndefined();
		expect(resolution.attack).toBeUndefined();
		expect(resolution.save).toBeUndefined();
		if (resolution.status !== "review-blocked") {
			throw new Error("expected review-blocked");
		}
		expect(resolution.reviewBlockerId).toBe("task9:test:missing-save");
	});

	it("classifies every public ability without inventing review clearance", async () => {
		const categories = ["spells", "powers", "techniques"] as const;
		const entries = await Promise.all(
			categories.map(
				async (category) =>
					[category, await listCanonicalEntries(category)] as const,
			),
		);

		for (const [category, abilities] of entries) {
			const canonicalType = category.slice(0, -1) as
				| "spell"
				| "power"
				| "technique";
			for (const ability of abilities) {
				const resolution = resolveCanonicalAbility(ability, { canonicalType });
				expect(resolution.version, `${category}:${ability.id}`).toBe(1);
				expect(resolution.provenance.canonicalId).toBe(ability.id);
				expect(resolution.status).not.toBe("review-blocked");
				if (resolution.status === "manual") {
					expect(resolution.manual.reason.length).toBeGreaterThan(0);
				}
			}
		}
	});
});

describe("ability registry contracts", () => {
	it.each([
		"spells",
		"powers",
		"techniques",
	] as const)("declares typed mechanical fields for %s", (category) => {
		const schema = compendiumCategoryDefinitions[category].schema;
		expect(schema.resolutionField).toBe("ability_resolution");
		expect(schema.mechanicalFields).toEqual(
			expect.arrayContaining(["activation", "target", "duration", "mechanics"]),
		);
	});

	it("keeps unresolved Regent spell identities visible as non-invented references", async () => {
		const registry = await loadCanonicalRegistry();
		const references = registry.references.filter(
			(reference) => reference.descriptorId === "regents.additional-spells",
		);
		expect(references).toHaveLength(40);
		expect(references.every((reference) => reference.required === false)).toBe(
			true,
		);
		expect(
			references.every((reference) => reference.matchedBy === "none"),
		).toBe(true);
	});
});
