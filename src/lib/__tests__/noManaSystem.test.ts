/**
 * Rift Ascendant has no mana system. Casting uses spell slots, Powers and
 * Techniques use their own economies, and Regent acquisitions use Resonance
 * (RA-1). Nothing may restore, spend, drain, cost, or pool mana, so these
 * checks keep mana mechanics from creeping back into the compendium, the
 * Warden tables, the daily quests, the sourcebook, or the item generators.
 *
 * Mana as setting vocabulary (the mana lattice, Mana Credits, Mana Flow) is
 * not a mechanic and is out of scope here.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildCanonicalRegistry } from "@/data/compendium/registry";
import {
	RIFT_COMPLICATIONS,
	RIFT_HAZARDS,
} from "@/data/wardenGeneratorContent";
import { findCanonicalEntryById } from "@/lib/canonicalCompendium";
import { resolveRef } from "@/lib/compendiumResolver";
import { DEFAULT_DAILY_QUEST_TEMPLATES } from "@/lib/dailyQuests/data";

const REPO_ROOT = join(__dirname, "..", "..", "..");

/** A mana-as-resource pattern and a phrase it must catch (self-probe). */
const MANA_MECHANICS: Array<{ pattern: RegExp; probe: string }> = [
	{
		pattern:
			/\b(restores?|restored|restoring|regains?|regained|recovers?|recovered|replenish(es)?|refills?)\s+(\d+d\d+(\s*\+\s*\d+)?\s+)?mana\b/i,
		probe: "On drink, restore 2d4 mana.",
	},
	{
		pattern:
			/\bmana[- ](points?|pools?|costs?|regen\w*|recovery|reserves?|depletion|drain|restoration|bar)\b/i,
		probe: "On a hit, target loses 1 mana point (if any).",
	},
	{
		pattern:
			/\b(spend|spends|spent|spending|expends?|expended)\s+(\d+\s+)?mana\b/i,
		probe: "cast one without spending mana once per long rest",
	},
	{
		pattern: /\b(max|maximum|current|total)\s+mana\b(?!-)/i,
		probe: "Your maximum mana increases by 5.",
	},
	{
		pattern: /\bloses?\s+\d+\s+mana\b/i,
		probe: "the target loses 3 mana",
	},
	{
		pattern: /\bmana[- ]based abilit|\bmana abilities\b|\bmana-casting\b/i,
		probe: "it cannot use mana-based abilities",
	},
	{
		pattern: /\bdrains?\s+(your|their|its)\s+mana\b/i,
		probe: "The field drains your mana each turn.",
	},
];

const findManaMechanics = (text: string): string | null => {
	for (const { pattern } of MANA_MECHANICS) {
		const match = text.match(pattern);
		if (match) return match[0];
	}
	return null;
};

const collectStrings = (
	value: unknown,
	path: string,
	out: Array<{ path: string; text: string }>,
): void => {
	if (typeof value === "string") {
		out.push({ path, text: value });
	} else if (Array.isArray(value)) {
		value.forEach((child, index) => {
			collectStrings(child, `${path}[${index}]`, out);
		});
	} else if (value && typeof value === "object") {
		for (const [key, child] of Object.entries(value)) {
			collectStrings(child, path ? `${path}.${key}` : key, out);
		}
	}
};

describe("no mana system", () => {
	it("every mana-mechanics pattern catches its probe", () => {
		for (const { pattern, probe } of MANA_MECHANICS) {
			expect(pattern.test(probe), `${pattern} should match "${probe}"`).toBe(
				true,
			);
		}
	});

	it("no compendium entry restores, spends, drains, costs, or pools mana", async () => {
		const registry = await buildCanonicalRegistry();
		const offenders: string[] = [];
		for (const [category, candidates] of Object.entries(registry.candidates)) {
			for (const candidate of candidates) {
				const strings: Array<{ path: string; text: string }> = [];
				collectStrings(candidate.raw, "", strings);
				for (const { path, text } of strings) {
					// Ids are stable keys that persisted rows reference, not rules text.
					if (path === "id") continue;
					const hit = findManaMechanics(text);
					if (hit) {
						offenders.push(
							`${category}:${candidate.rawId ?? "?"} (${candidate.source.id}) ${path} → "${hit}"`,
						);
					}
				}
			}
		}
		expect(offenders).toEqual([]);
	}, 60_000);

	it("Warden tables and daily quests carry no mana mechanics", () => {
		const offenders = [
			...RIFT_COMPLICATIONS,
			...RIFT_HAZARDS,
			...DEFAULT_DAILY_QUEST_TEMPLATES.flatMap((quest) => [
				quest.name,
				quest.description,
				quest.base_rewards.description ?? "",
			]),
		].filter((text) => findManaMechanics(text));
		expect(offenders).toEqual([]);
	});

	it("the sourcebook bestiary and the item generators carry no mana mechanics", () => {
		const offenders: string[] = [];
		for (const relPath of [
			"src/components/compendium/anomaly-manifest/BestiaryEcologies.tsx",
			"src/components/compendium/players-book/IntroChapter.tsx",
			"scripts/loot/rebuild.mjs",
			"scripts/loot/variation.mjs",
			"scripts/loot/lib.mjs",
		]) {
			const content = readFileSync(join(REPO_ROOT, relPath), "utf8").replace(
				/\s+/g,
				" ",
			);
			const hit = findManaMechanics(content);
			if (hit) offenders.push(`${relPath} → "${hit}"`);
		}
		expect(offenders).toEqual([]);
	});
});

describe("folded duplicate item ids", () => {
	it("resolve to the item the compendium already showed under that name", async () => {
		// Lesser Aetheric Antidote and Void Warhammer each had several ids; the
		// folded ids now live on the surviving entry's aliases.
		const antidote = await findCanonicalEntryById("items", "item_p9_46");
		expect(antidote?.id).toBe("item_p3_26");
		expect(antidote?.name).toBe("Lesser Aetheric Antidote");

		const warhammer = await findCanonicalEntryById("equipment", "item_p9_4");
		expect(warhammer?.id).toBe("item_p8_5");

		const resolved = await resolveRef("equipment", "item_p2_2");
		expect(resolved?.id).toBe("item_p8_5");
		expect(resolved?.name).toBe("Void Warhammer");
	}, 30_000);

	it("keep every item name unique", async () => {
		const registry = await buildCanonicalRegistry();
		const collisions = registry.blockingConflicts.filter(
			(conflict) =>
				conflict.category === "items" && conflict.kind === "identity-collision",
		);
		expect(collisions).toEqual([]);
	}, 60_000);
});
