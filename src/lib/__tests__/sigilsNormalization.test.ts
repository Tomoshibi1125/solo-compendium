import { describe, expect, it } from "vitest";
import { sigils } from "@/data/compendium/sigils";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const sigilFunctionalFingerprint = (sigil: (typeof sigils)[number]): string =>
	stableStringify({
		rarity: sigil.rarity,
		can_inscribe_on: sigil.can_inscribe_on,
		passive_bonuses: sigil.passive_bonuses,
		effect_description: sigil.effect_description,
		active_feature: sigil.active_feature,
		effects: sigil.effects,
		mechanics: sigil.mechanics,
		limitations: sigil.limitations,
	});

describe("sigils data normalization", () => {
	it("does not duplicate sigil ids or names", () => {
		const ids = new Set<string>();
		const names = new Set<string>();
		for (const sigil of sigils) {
			expect(ids.has(sigil.id), `Duplicate sigil id ${sigil.id}`).toBe(false);
			expect(
				names.has(sigil.name.toLowerCase()),
				`Duplicate sigil name ${sigil.name}`,
			).toBe(false);
			ids.add(sigil.id);
			names.add(sigil.name.toLowerCase());
		}
	});

	it("does not contain functionally identical sigil clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const sigil of sigils) {
			const key = sigilFunctionalFingerprint(sigil);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), sigil.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});
});

describe("sigils data quality — mechanics consistency", () => {
	it("mechanics.special_abilities semantically matches effect_description", () => {
		for (const sigil of sigils) {
			const effectDesc = sigil.effect_description?.toLowerCase() ?? "";
			const mechanics = sigil.mechanics;

			// Skip if mechanics is not an object
			if (
				!mechanics ||
				typeof mechanics !== "object" ||
				Array.isArray(mechanics)
			) {
				continue;
			}

			const specialAbilities = Array.isArray(
				(mechanics as Record<string, unknown>).special_abilities,
			)
				? ((mechanics as Record<string, unknown>).special_abilities as string[])
						.join(" ")
						.toLowerCase()
				: String(
						(mechanics as Record<string, unknown>).special_abilities ?? "",
					).toLowerCase();

			// Extract key mechanical concepts from both fields
			const effectKeywords = extractMechanicalKeywords(effectDesc);
			const mechanicsKeywords = extractMechanicalKeywords(specialAbilities);

			// Check for obvious mismatches: if both have keywords but no overlap at all,
			// that indicates a problem (like fire resistance on a wind sigil)
			if (effectKeywords.length > 0 && mechanicsKeywords.length > 0) {
				const hasOverlap = mechanicsKeywords.some((kw) =>
					effectKeywords.some((ek) => ek.includes(kw) || kw.includes(ek)),
				);

				// Only fail if there's a clear mismatch - if effect mentions damage types
				// but mechanics mentions completely different ones
				const effectDamageTypes = effectKeywords.filter((k) =>
					[
						"fire",
						"cold",
						"lightning",
						"thunder",
						"acid",
						"poison",
						"necrotic",
						"radiant",
						"psychic",
						"force",
						"piercing",
						"slashing",
						"bludgeoning",
					].includes(k),
				);
				const mechanicsDamageTypes = mechanicsKeywords.filter((k) =>
					[
						"fire",
						"cold",
						"lightning",
						"thunder",
						"acid",
						"poison",
						"necrotic",
						"radiant",
						"psychic",
						"force",
						"piercing",
						"slashing",
						"bludgeoning",
					].includes(k),
				);

				// If both mention damage types, they should have some overlap
				if (effectDamageTypes.length > 0 && mechanicsDamageTypes.length > 0) {
					const damageTypeOverlap = mechanicsDamageTypes.some((kw) =>
						effectDamageTypes.some((ek) => ek === kw),
					);
					expect(
						damageTypeOverlap,
						`Sigil ${sigil.id} (${sigil.name}): mechanics.special_abilities damage types [${mechanicsDamageTypes.join(", ")}] should overlap with effect_description damage types [${effectDamageTypes.join(", ")}]`,
					).toBe(true);
				}
			}
		}
	});

	it("socket types in restrictions match can_inscribe_on", () => {
		for (const sigil of sigils) {
			const mechanics = sigil.mechanics;

			// Skip if mechanics is not an object
			if (
				!mechanics ||
				typeof mechanics !== "object" ||
				Array.isArray(mechanics)
			) {
				continue;
			}

			const restrictions = Array.isArray(
				(mechanics as Record<string, unknown>).restrictions,
			)
				? ((mechanics as Record<string, unknown>).restrictions as string[])
				: [];
			const canInscribeOn = sigil.can_inscribe_on ?? [];

			// Extract socket type from restrictions (pattern: "Socket type: X" or "Socket type: X or Y")
			const socketTypeRestriction = restrictions.find((r: string) =>
				String(r).toLowerCase().includes("socket type:"),
			);

			if (socketTypeRestriction) {
				const restrictionText = String(socketTypeRestriction).toLowerCase();
				const socketTypes = restrictionText
					.replace("socket type:", "")
					.trim()
					.split(/\s+or\s+/);

				// Verify each socket type in restrictions is present in can_inscribe_on
				for (const socketType of socketTypes) {
					const normalizedSocketType = socketType.trim();
					const isInscribeOnMatch = canInscribeOn.some(
						(inscribe) =>
							inscribe.toLowerCase() === normalizedSocketType ||
							normalizedSocketType.includes(inscribe.toLowerCase()),
					);
					expect(
						isInscribeOnMatch,
						`Sigil ${sigil.id} (${sigil.name}): socket type "${normalizedSocketType}" in restrictions not found in can_inscribe_on [${canInscribeOn.join(", ")}]`,
					).toBe(true);
				}
			}
		}
	});
});

describe("sigils data quality — content uniqueness", () => {
	it("discovery_lore entries are unique across all sigils", () => {
		const loreMap = new Map<string, string[]>();
		for (const sigil of sigils) {
			const lore = sigil.discovery_lore?.trim().toLowerCase() ?? "";
			if (lore.length > 0) {
				const normalizedLore = lore.replace(/\s+/g, " ").trim();
				loreMap.set(normalizedLore, [
					...(loreMap.get(normalizedLore) ?? []),
					sigil.name,
				]);
			}
		}

		const duplicates = [...loreMap.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));

		expect(duplicates, `Duplicate discovery_lore entries found`).toEqual([]);
	});
});

describe("sigils data quality — damage profile validity", () => {
	it("damage_profile contains actual formulas or descriptions, not placeholder text", () => {
		const PLACEHOLDER_PATTERNS = [
			/see active effect/i,
			/see effect/i,
			/tbd/i,
			/to be determined/i,
			/placeholder/i,
		];

		for (const sigil of sigils) {
			const mechanics = sigil.mechanics;

			// Skip if mechanics is not an object
			if (
				!mechanics ||
				typeof mechanics !== "object" ||
				Array.isArray(mechanics)
			) {
				continue;
			}

			const damageProfile =
				String((mechanics as Record<string, unknown>).damage_profile ?? "") ??
				"";

			// Check for placeholder patterns
			const hasPlaceholder = PLACEHOLDER_PATTERNS.some((pattern) =>
				pattern.test(damageProfile),
			);

			expect(
				hasPlaceholder,
				`Sigil ${sigil.id} (${sigil.name}): damage_profile contains placeholder text "${damageProfile}"`,
			).toBe(false);

			// If damage_profile exists, it should contain either dice notation or descriptive mechanics
			if (damageProfile.length > 0) {
				const hasDiceNotation = /\d+d\d+/i.test(damageProfile);
				const hasDescriptiveMechanics =
					/(bonus|damage|reduction|resistance|immunity|condition|none|utility)/i.test(
						damageProfile,
					);

				expect(
					hasDiceNotation || hasDescriptiveMechanics,
					`Sigil ${sigil.id} (${sigil.name}): damage_profile should contain dice notation or descriptive mechanics, not "${damageProfile}"`,
				).toBe(true);
			}
		}
	});
});

// Helper function to extract mechanical keywords from text
function extractMechanicalKeywords(text: string): string[] {
	const keywords: string[] = [];
	const mechanicalTerms = [
		"damage",
		"bonus",
		"reduction",
		"resistance",
		"immunity",
		"condition",
		"save",
		"dc",
		"attack",
		"roll",
		"dice",
		"healing",
		"hp",
		"movement",
		"speed",
		"advantage",
		"disadvantage",
		"prone",
		"stunned",
		"blinded",
		"charmed",
		"frightened",
		"paralyzed",
		"restrained",
		"exhaustion",
		"stealth",
		"perception",
		"initiative",
		"ac",
		"armor class",
		"fire",
		"cold",
		"lightning",
		"thunder",
		"acid",
		"poison",
		"necrotic",
		"radiant",
		"psychic",
		"force",
		"piercing",
		"slashing",
		"bludgeoning",
		"critical",
		"hit",
		"recover",
		"resource",
		"slot",
		"spell",
		"expended",
		"ignore",
		"bypass",
		"knock",
		"fall",
		"bleed",
		"imbue",
		"shockwave",
		"pulse",
		"burst",
		"teleport",
		"drop",
		"grant",
		"resistance",
		"immunity",
		"difficult",
		"terrain",
		"investigation",
		"surprised",
		"cover",
		"ready",
		"reaction",
		"grappling",
		"shoving",
		"carrying",
		"capacity",
		"target",
		"ally",
		"adjacent",
		"splash",
		"ranged",
		"below",
		"above",
		"percentage",
		"percent",
	];

	const lowerText = text.toLowerCase();
	for (const term of mechanicalTerms) {
		if (lowerText.includes(term)) {
			keywords.push(term);
		}
	}

	return keywords;
}
