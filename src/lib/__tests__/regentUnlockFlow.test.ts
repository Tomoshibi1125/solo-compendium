/**
 * Regent unlock-flow guarantees (Warden-gated grant → player 1-of-3 → catch-up).
 */

import { describe, expect, it } from "vitest";
import {
	classifyCatchUpOptions,
	getCatchUpBucketReadiness,
	resolveKnownTechniqueAbilities,
} from "@/components/character/RegentCatchUpModal";
import { getRegentUnlockQuests } from "@/data/compendium/quest-contracts";
import { regents } from "@/data/compendium/regents";
import { hydrateRegentUnlock } from "@/hooks/useRegentUnlocks";
import { calculateTotalChoices } from "@/lib/choiceCalculations";
import { getGestaltClassFeatures } from "@/lib/regentGestalt";
import { resolveCanonicalPickEntries } from "@/lib/regentPickPersistence";
import {
	getRegentLeveledFeatures,
	regentToChoiceSource,
} from "@/lib/regentProgression";
import type { Regent } from "@/lib/regentTypes";

describe("regent-tagged unlock quests", () => {
	it("exist and span multiple ranks (unlock can happen at any level)", () => {
		const quests = getRegentUnlockQuests();
		expect(quests.length).toBeGreaterThan(0);
		expect(quests.every((quest) => quest.grantsRegentUnlock === true)).toBe(
			true,
		);
		const ranks = new Set(quests.map((quest) => quest.rank));
		expect(ranks.size).toBeGreaterThanOrEqual(4);
		expect(ranks.has("E")).toBe(true);
		expect(ranks.has("S")).toBe(true);
	});
});

describe("retroactive catch-up owes the full accumulated picks at the level", () => {
	const owedAt = (regent: Regent, level: number) => {
		const totals = calculateTotalChoices(
			null,
			null,
			[regentToChoiceSource(regent)],
			level,
		);
		return {
			powers: totals.powers ?? 0,
			techniques: totals.techniques ?? 0,
			cantrips: totals.cantrips ?? 0,
			spells: totals.spells ?? 0,
		};
	};

	it("a caster regent unlocked at level 20 owes its full L20 cantrip+spell counts", () => {
		const umbral = regents.find((regent) => regent.id === "umbral_regent");
		expect(umbral).toBeDefined();
		if (!umbral) return;
		expect(owedAt(umbral, 1)).toMatchObject({ cantrips: 4, spells: 6 });
		expect(owedAt(umbral, 20)).toMatchObject({ cantrips: 5, spells: 27 });
	});

	it("a martial regent owes its full power+technique counts", () => {
		const steel = regents.find((regent) => regent.id === "steel_regent");
		expect(steel).toBeDefined();
		if (!steel) return;
		const owed = owedAt(steel, 1);
		expect(owed.powers).toBe(2);
		expect(owed.techniques).toBe(2);
		expect(owed.spells).toBe(0);
	});
});

describe("sheet gestalt normalizer agrees with the wizard's leveled normalizer", () => {
	const featureNames = (items: Regent[], level: number) =>
		new Set(
			getGestaltClassFeatures(items, level).map((feature) =>
				feature.name.toLowerCase(),
			),
		);

	for (const id of ["umbral_regent", "steel_regent"]) {
		it(`${id}: gestalt surfaces every leveled feature (no content loss)`, () => {
			const regent = regents.find((candidate) => candidate.id === id);
			expect(regent).toBeDefined();
			if (!regent) return;
			const gestaltNames = featureNames([regent], 20);
			const leveled = getRegentLeveledFeatures(regent);
			expect(leveled.length).toBeGreaterThan(0);
			for (const feature of leveled) {
				expect(
					gestaltNames.has(feature.name.toLowerCase()),
					`${id}: "${feature.name}" (level ${feature.level}) must appear on the sheet`,
				).toBe(true);
			}
		});
	}

	it("gestalt gates by character level", () => {
		const umbral = regents.find((regent) => regent.id === "umbral_regent");
		if (!umbral) return;
		const atOne = getGestaltClassFeatures([umbral], 1);
		expect(atOne.every((feature) => feature.level <= 1)).toBe(true);
		const atTwenty = getGestaltClassFeatures([umbral], 20);
		expect(atTwenty.length).toBeGreaterThan(atOne.length);
	});
});

describe("catch-up exact-count readiness", () => {
	it("requires exactly the remaining owed count", () => {
		const ready = getCatchUpBucketReadiness({
			owed: 4,
			completedSameSource: 1,
			available: 5,
			selected: 3,
		});
		expect(ready).toMatchObject({
			requiredSelections: 3,
			hasCatalogDeficit: false,
			isReady: true,
		});

		expect(
			getCatchUpBucketReadiness({
				owed: 4,
				completedSameSource: 1,
				available: 5,
				selected: 2,
			}).isReady,
		).toBe(false);
		expect(
			getCatchUpBucketReadiness({
				owed: 4,
				completedSameSource: 1,
				available: 5,
				selected: 4,
			}).isReady,
		).toBe(false);
	});

	it("reports a catalog deficit instead of using Math.min", () => {
		const readiness = getCatchUpBucketReadiness({
			owed: 3,
			completedSameSource: 0,
			available: 2,
			selected: 2,
		});
		expect(readiness.requiredSelections).toBe(3);
		expect(readiness.hasCatalogDeficit).toBe(true);
		expect(readiness.isReady).toBe(false);
	});

	it("allows zero-owed completion only with an exact empty bucket", () => {
		expect(
			getCatchUpBucketReadiness({
				owed: 0,
				completedSameSource: 0,
				available: 0,
				selected: 0,
			}).isReady,
		).toBe(true);
	});
});

describe("known catch-up option filtering", () => {
	const source = "Umbral Regent Attunement (Catch-Up)";
	const options = [
		{ id: "power-a", name: "Power A" },
		{ id: "power-b", name: "Power B" },
		{ id: "power-c", name: "Power C" },
		{ id: "power-d", name: "Power D" },
	];

	it("counts only exact same-source IDs and otherwise excludes by ID then name", () => {
		const result = classifyCatchUpOptions(
			options,
			[
				{ canonicalId: "power-a", name: "Power A", source },
				{
					canonicalId: "power-b",
					name: "Power B",
					source: "Another Source",
				},
				{ canonicalId: null, name: " power c ", source },
			],
			source,
		);

		expect(result.completedSameSource.map((option) => option.id)).toEqual([
			"power-a",
		]);
		expect(result.excludedExisting.map((option) => option.id)).toEqual([
			"power-b",
			"power-c",
		]);
		expect(result.available.map((option) => option.id)).toEqual(["power-d"]);
	});

	it("is deterministic and does not mutate option input", () => {
		const snapshot = structuredClone(options);
		const first = classifyCatchUpOptions(options, [], source);
		const second = classifyCatchUpOptions(options, [], source);
		expect(first.available).toEqual(second.available);
		expect(options).toEqual(snapshot);
	});
});

describe("flat Regent unlock hydration", () => {
	const baseRow = {
		id: "unlock-1",
		character_id: "character-1",
		unlocked_at: "2026-01-01T00:00:00.000Z",
		quest_name: "A completed quest",
		dm_notes: null,
		is_primary: true,
		caught_up_at_level: null,
	};

	it("preserves a legacy UUID row as visibly unresolved", () => {
		const hydrated = hydrateRegentUnlock({
			...baseRow,
			regent_id: null,
			legacy_regent_uuid: "11111111-1111-1111-1111-111111111111",
		});
		expect(hydrated.regent).toBeNull();
		expect(hydrated.resolved_regent_id).toBeNull();
		expect(hydrated.identity_issue).toBe("legacy_uuid");
		expect(hydrated.legacy_regent_uuid).toBe(
			"11111111-1111-1111-1111-111111111111",
		);
	});

	it("rejects unsupported text without guessing from names or themes", () => {
		const hydrated = hydrateRegentUnlock({
			...baseRow,
			regent_id: "The Shadow Regent",
			legacy_regent_uuid: null,
		});
		expect(hydrated.regent).toBeNull();
		expect(hydrated.resolved_regent_id).toBeNull();
		expect(hydrated.identity_issue).toBe("unsupported_regent_id");
	});

	it("hydrates an explicitly mapped retired ID from canonical static data", () => {
		const hydrated = hydrateRegentUnlock({
			...baseRow,
			regent_id: "shadow_regent",
			legacy_regent_uuid: null,
		});
		expect(hydrated.resolved_regent_id).toBe("umbral_regent");
		expect(hydrated.regent?.id).toBe("umbral_regent");
		expect(hydrated.identity_issue).toBeNull();
	});
});

describe("canonical catch-up persistence input", () => {
	it("returns canonical catalog metadata instead of caller-supplied metadata", () => {
		const requested = [
			{
				id: "power-a",
				name: "Caller-supplied name",
				power_level: 99,
				description: "Caller-supplied description",
			},
		];
		const catalog = [
			{
				id: "power-a",
				name: "Canonical Power",
				power_level: 2,
				description: "Canonical description",
			},
		];

		const resolved = resolveCanonicalPickEntries(requested, catalog, "Power");

		expect(resolved).toEqual(catalog);
		expect(resolved[0]).not.toBe(catalog[0]);
	});

	it("rejects requested IDs absent from the canonical bucket catalog", () => {
		expect(() =>
			resolveCanonicalPickEntries(
				[{ id: "unknown-power", name: "Unknown Power" }],
				[{ id: "power-a", name: "Canonical Power" }],
				"Power",
			),
		).toThrow(/not in the canonical power catalog/i);
	});
});

describe("known technique identity resolution", () => {
	const source = "Steel Regent Attunement (Catch-Up)";
	const catalog = [
		{
			id: "technique-a",
			name: "Technique A",
			aliases: ["legacy-technique-a"],
		},
		{ id: "technique-b", name: "Technique B" },
	];

	it("hydrates exact IDs and explicit aliases while reporting unresolved IDs", () => {
		const resolution = resolveKnownTechniqueAbilities(
			[
				{ technique_id: "technique-b", source },
				{ technique_id: "legacy-technique-a", source },
				{ technique_id: "unknown-technique", source: null },
			],
			catalog,
		);

		expect(resolution.abilities).toEqual([
			{ canonicalId: "technique-b", name: "Technique B", source },
			{
				canonicalId: "legacy-technique-a",
				name: "Technique A",
				source,
			},
		]);
		expect(resolution.unresolvedIds).toEqual(["unknown-technique"]);
	});

	it("uses an alias-resolved name only to exclude, never to fulfill by canonical ID", () => {
		const resolution = resolveKnownTechniqueAbilities(
			[{ technique_id: "legacy-technique-a", source }],
			catalog,
		);
		const classification = classifyCatchUpOptions(
			[{ id: "technique-a", name: "Technique A" }],
			resolution.abilities,
			source,
		);

		expect(classification.completedSameSource).toEqual([]);
		expect(classification.excludedExisting.map((entry) => entry.id)).toEqual([
			"technique-a",
		]);
		expect(classification.available).toEqual([]);
	});
});
