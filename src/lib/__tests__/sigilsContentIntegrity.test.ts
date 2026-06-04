import { describe, expect, it } from "vitest";
import { sigils } from "@/data/compendium/sigils";
import type {
	CompendiumEffects,
	CompendiumMechanics,
} from "@/types/compendium";

const isCompendiumMechanics = (
	value: unknown,
): value is CompendiumMechanics => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isCompendiumEffects = (value: unknown): value is CompendiumEffects => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

describe("sigils content integrity", () => {
	it("mechanics.special_abilities match effect_description (no generic placeholders)", () => {
		const genericPlaceholders = [
			"See active effect",
			"See ability",
			"Varies",
			"Depends",
			"See description",
			"TBD",
			"To be determined",
		];

		for (const sigil of sigils) {
			if (!isCompendiumMechanics(sigil.mechanics)) {
				continue;
			}

			const specialAbilities = sigil.mechanics.special_abilities;
			if (!specialAbilities) {
				continue;
			}

			const abilitiesArray = Array.isArray(specialAbilities)
				? specialAbilities
				: [specialAbilities];

			for (const ability of abilitiesArray) {
				const abilityLower = ability.toLowerCase();
				const hasPlaceholder = genericPlaceholders.some((placeholder) =>
					abilityLower.includes(placeholder.toLowerCase()),
				);

				expect(
					hasPlaceholder,
					`Sigil "${sigil.name}" has generic placeholder in special_abilities: "${ability}"`,
				).toBe(false);
			}
		}
	});

	it("socket type consistency between can_inscribe_on and restrictions", () => {
		for (const sigil of sigils) {
			const canInscribeOn = sigil.can_inscribe_on;

			if (!isCompendiumMechanics(sigil.mechanics)) {
				continue;
			}

			const restrictions = sigil.mechanics.restrictions;

			if (!restrictions) {
				continue;
			}

			const restrictionsArray = Array.isArray(restrictions)
				? restrictions
				: [restrictions];

			// Extract socket type from restrictions (e.g., "Socket type: weapon")
			const socketTypeRestriction = restrictionsArray.find(
				(r) => typeof r === "string" && r.toLowerCase().includes("socket type"),
			);

			if (!socketTypeRestriction || typeof socketTypeRestriction !== "string") {
				continue;
			}

			// Extract the socket type value (e.g., "weapon" from "Socket type: weapon")
			const socketTypeMatch =
				socketTypeRestriction.match(/socket type:\s*(.+)/i);
			if (!socketTypeMatch) {
				continue;
			}

			const restrictionSocketType = socketTypeMatch[1]
				.trim()
				.toLowerCase()
				.replace(/\s+or\s+/g, "/"); // Handle "or" cases like "helmet or accessory"

			// Check if the restriction socket type matches one of the can_inscribe_on values
			const matches = canInscribeOn.some(
				(type) =>
					type.toLowerCase() === restrictionSocketType ||
					restrictionSocketType.includes(type.toLowerCase()),
			);

			expect(
				matches,
				`Sigil "${sigil.name}" has socket type mismatch: can_inscribe_on=[${canInscribeOn.join(", ")}] but restrictions say "${socketTypeRestriction}"`,
			).toBe(true);
		}
	});

	it("unique discovery_lore (no duplicates)", () => {
		const discoveryLores = new Map<string, string[]>();

		for (const sigil of sigils) {
			const lore = sigil.discovery_lore;
			if (!lore) {
				continue;
			}

			const loreLower = lore.toLowerCase().trim();
			const bucket = discoveryLores.get(loreLower) ?? [];
			bucket.push(sigil.name);
			discoveryLores.set(loreLower, bucket);
		}

		const duplicates = [...discoveryLores.entries()]
			.filter(([, names]) => names.length > 1)
			.map(([lore, names]) => `"${lore}" used by: ${names.join(", ")}`);

		expect(duplicates, "Discovery lore should be unique across sigils").toEqual(
			[],
		);
	});

	it("actual damage formulas in damage_profile (no 'See active effect' placeholders)", () => {
		const genericPlaceholders = [
			"see active effect",
			"see effect",
			"varies",
			"depends",
			"see description",
			"tbd",
			"to be determined",
		];

		for (const sigil of sigils) {
			if (!isCompendiumMechanics(sigil.mechanics)) {
				continue;
			}

			const damageProfile = sigil.mechanics.damage_profile;
			if (!damageProfile) {
				continue;
			}

			const damageProfileLower = damageProfile.toLowerCase();
			const hasPlaceholder = genericPlaceholders.some((placeholder) =>
				damageProfileLower.includes(placeholder.toLowerCase()),
			);

			// Allow "No direct damage bonus" as a valid description for utility sigils
			const isUtilitySigil =
				damageProfileLower.includes("no direct damage") ||
				damageProfileLower.includes("utility") ||
				damageProfileLower.includes("immunity") ||
				damageProfileLower.includes("resistance");

			if (isUtilitySigil) {
				continue;
			}

			expect(
				hasPlaceholder,
				`Sigil "${sigil.name}" has generic placeholder in damage_profile: "${damageProfile}"`,
			).toBe(false);
		}
	});

	it("effects.primary and effects.secondary describe actual sigil effects (not generic damage)", () => {
		const genericDamagePatterns = [
			/deals \d+d\d+ physical or magical damage on hit/i,
			/target must make a standard dc saving throw or suffer stunning for 1 round/i,
		];

		for (const sigil of sigils) {
			if (!isCompendiumEffects(sigil.effects)) {
				continue;
			}

			const primary = sigil.effects.primary;
			const secondary = sigil.effects.secondary;

			if (primary) {
				const hasGenericDamage = genericDamagePatterns.some((pattern) =>
					pattern.test(primary),
				);
				expect(
					hasGenericDamage,
					`Sigil "${sigil.name}" has generic damage pattern in effects.primary: "${primary}"`,
				).toBe(false);
			}

			if (secondary && secondary !== "None") {
				const hasGenericDamage = genericDamagePatterns.some((pattern) =>
					pattern.test(secondary),
				);
				expect(
					hasGenericDamage,
					`Sigil "${sigil.name}" has generic damage pattern in effects.secondary: "${secondary}"`,
				).toBe(false);
			}
		}
	});
});
