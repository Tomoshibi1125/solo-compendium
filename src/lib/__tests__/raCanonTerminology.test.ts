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
			// Real-world Korea geography — RA runs on the Accord gazetteer
			// (Meridian City / Harrow Bay / Vantage Isle).
			/(?<![\w-])(Busan|Seoul|Jeju|Korea)(?![\w-])/i,
			// Solo Leveling vocabulary retired from prose. Lookarounds keep
			// kebab ids (dungeon-crawler, association-bureaucrat) intact.
			/(?<![\w-])dungeons?(?![\w-])/i,
			/(?<![\w-])Association(?![\w-])/,
			// "Gate" retired from display prose (Rift is canon). Applied after
			// stripping name-keyed proper nouns and the "gate" currency id.
			/(?<![\w-])Gates?(?![\w-])/,
		];

		// Name-keyed proper nouns that legitimately keep "Gate" (paths /
		// abilities / trials wired by name across pathAbilityAccess and
		// regent unlock quests; renaming would orphan persisted references).
		const PROTECTED_PHRASES =
			/\b(?:Gate Beast|Gate Runner|Gate Reader|Eight Gates|Nerve Gate|Shadow Gate|Dragon Gate|Frost Gate|Beast Gate|Titan Gate|Plague Gate|Architect Gate|Radiant Gate|Mimic Gate)\b/g;
		// The standard currency keeps its persisted id "gate".
		const CURRENCY_ID = /"(?:currency|legacyId)"\s*:\s*"gate"/g;

		const offenders: string[] = [];

		for (const t of types) {
			const entries = await listCanonicalEntries(t);
			for (const entry of entries) {
				const json = JSON.stringify(entry)
					.replace(PROTECTED_PHRASES, "")
					.replace(CURRENCY_ID, "");
				const hit = FORBIDDEN_TERMS.find((re) => re.test(json));
				if (hit) {
					offenders.push(`[${t}] ${entry.name || entry.id} — ${hit}`);
				}
			}
		}

		expect(offenders).toEqual([]);
	}, 60000);
});
