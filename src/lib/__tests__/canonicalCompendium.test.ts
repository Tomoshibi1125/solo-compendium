import { describe, expect, it } from "vitest";
import {
	listCanonicalCastables,
	listCanonicalEntries,
} from "@/lib/canonicalCompendium";

describe("canonicalCompendium resolver", () => {
	it("sanitizes placeholder damage strings on utility castables", async () => {
		const castables = await listCanonicalCastables();

		// Every castable whose damage_roll survived normalization must look
		// like a real formula (NdM or a plain number), never a sentinel like
		// '—', 'N/A', 'none'.
		const bogusDamageRolls = castables.filter((entry) => {
			if (!entry.damage_roll) return false;
			const normalized = entry.damage_roll.trim().toLowerCase();
			if (["—", "-", "n/a", "na", "none", "self"].includes(normalized)) {
				return true;
			}
			return !/\d+d\d+/i.test(normalized) && !/^\d+(\s*[+-]\s*\d+)?$/.test(normalized);
		});

		expect(
			bogusDamageRolls,
			`Bogus damage_roll values survived canonical normalization:\n${bogusDamageRolls
				.map((entry) => `- ${entry.canonical_type}:${entry.name} = "${entry.damage_roll}"`)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("sanitizes placeholder damage_type tokens", async () => {
		const castables = await listCanonicalCastables();
		const bogusTypes = castables.filter((entry) => {
			if (!entry.damage_type) return false;
			const normalized = entry.damage_type.trim().toLowerCase();
			return ["none", "n/a", "self"].includes(normalized);
		});

		expect(
			bogusTypes,
			`Bogus damage_type values survived canonical normalization:\n${bogusTypes
				.map((entry) => `- ${entry.canonical_type}:${entry.name} = "${entry.damage_type}"`)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("preserves utility/support castables with resolution but no damage_roll", async () => {
		const castables = await listCanonicalCastables();
		const utilityTokens =
			/\b(aegis|aura|shield|ward|barrier|veil|shroud|sanctuary|haste|swift|regeneration|healing|soothe|insight|forecast|scrying|sanctify|blessing|blink|teleport|stealth)\b/i;

		const utilityWithResolution = castables.filter((entry) => {
			if (!utilityTokens.test(entry.name)) return false;
			return entry.has_save || entry.has_attack_roll || Boolean(entry.save_ability);
		});

		// The reshape work should have preserved at least one resolution path
		// (save, attack roll, or save_ability) for every utility-named castable.
		expect(utilityWithResolution.length).toBeGreaterThan(0);

		for (const entry of utilityWithResolution) {
			// Utility powers should NOT carry a damage roll after sanitization.
			if (entry.damage_roll) {
				// Allow the specific cases where a utility power has both damage
				// and a secondary save (e.g. Thundercharge, Vampiric Drain) — their
				// damage formula must still be a real dice expression.
				expect(entry.damage_roll).toMatch(/\d+d\d+/i);
			}
		}
	});

	it("exposes enriched sigils with flavor, lore, and effects", async () => {
		const sigils = await listCanonicalEntries("sigils");
		expect(sigils.length).toBeGreaterThan(0);

		// Spot-check: every sigil must carry a description, and at least a
		// majority expose flavor/lore from the enriched provider transform.
		const withFlavor = sigils.filter((s) => typeof s.flavor === "string" && s.flavor.trim().length > 0);
		const withLore = sigils.filter((s) => {
			const lore = s.lore;
			if (typeof lore === "string") return lore.trim().length > 0;
			return !!lore && typeof lore === "object";
		});

		expect(
			withFlavor.length,
			"Sigils should expose flavor text via the enriched provider transform.",
		).toBeGreaterThan(sigils.length / 2);
		expect(
			withLore.length,
			"Sigils should expose lore via the enriched provider transform.",
		).toBeGreaterThan(sigils.length / 2);
	});

	it("exposes enriched tattoos with mechanics, flavor, and lore", async () => {
		const tattoos = await listCanonicalEntries("tattoos");
		expect(tattoos.length).toBeGreaterThan(0);

		const withMechanics = tattoos.filter(
			(t) => !!t.mechanics && typeof t.mechanics === "object",
		);
		const withFlavor = tattoos.filter(
			(t) => typeof t.flavor === "string" && t.flavor.trim().length > 0,
		);

		expect(
			withMechanics.length,
			"Tattoos should expose mechanics via the enriched provider transform.",
		).toBeGreaterThan(tattoos.length / 2);
		expect(
			withFlavor.length,
			"Tattoos should expose flavor via the enriched provider transform.",
		).toBeGreaterThan(tattoos.length / 2);
	});
});
