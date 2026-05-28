import { describe, expect, it } from "vitest";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";

describe("RA Canon Terminology Scrub", () => {
	it("no entry contains old Hunter Bureau or Association terms", async () => {
		const types = [
			"spells",
			"powers",
			"techniques",
			"items",
			"equipment",
			"backgrounds",
			"feats",
			"sigils",
			"tattoos",
			"artifacts",
			"relics",
			"runes",
			"anomalies",
			"locations",
		] as const;

		const FORBIDDEN_TERMS = [
			/Hunter Bureau/i,
			/Hunter Association/i,
			/Hunter Academy/i,
			/Hunter Conference/i,
			/hunter-bureau/i,
			/hunter-academy/i,
			/hunter-association/i,
			/hunter-conference/i,
		];

		const offenders: string[] = [];

		for (const t of types) {
			const entries = await listCanonicalEntries(t);
			for (const entry of entries) {
				const json = JSON.stringify(entry);
				if (FORBIDDEN_TERMS.some((re) => re.test(json))) {
					offenders.push(`[${t}] ${entry.name || entry.id}`);
				}
			}
		}

		expect(offenders).toEqual([]);
	}, 60000);
});
