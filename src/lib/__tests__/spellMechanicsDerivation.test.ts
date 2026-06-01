import { describe, expect, it } from "vitest";
import { deriveSpellResolution } from "@/lib/spellMechanicsDerivation";

describe("deriveSpellResolution", () => {
	it("derives a healing block from authored prose (Healing Resonance)", () => {
		const result = deriveSpellResolution({
			description:
				"Place your hands on a creature and channel restorative mana. The target regains 1d8 + your spellcasting ability modifier hit points.",
			type: "Healing",
		});
		expect(result.healing).toEqual({ dice: "1d8" });
		expect(result.attack).toBeUndefined();
		expect(result.saving_throw).toBeUndefined();
	});

	it("derives a saving throw + damage profile for a smite rider (Oath Smite)", () => {
		const result = deriveSpellResolution({
			description:
				"The next melee hit deals an extra 3d8 radiant damage. The target must also make a DC 14 Presence save or be frightened of you for 1 minute.",
			type: "Attack",
		});
		expect(result.saving_throw).toEqual({ ability: "Presence", dc: 14 });
		expect(result.damage_profile).toBe("3d8 radiant");
		// No "spell attack" phrase -> no spell-attack block (it is a weapon rider).
		expect(result.attack).toBeUndefined();
	});

	it("derives a ranged spell attack with ability + damage (Chill Lance shape)", () => {
		const result = deriveSpellResolution({
			description:
				"Make a ranged spell attack using Sense to deal 1d10 cold damage to a target within 30 feet.",
			type: "Attack",
		});
		expect(result.attack).toMatchObject({
			mode: "ranged",
			modifier: "Sense",
			damage: "1d10",
			damage_type: "cold",
			resolution: "spell_attack",
		});
		expect(result.damage_profile).toBe("1d10 cold");
	});

	it("derives an area saving throw with damage (Thunder Crack shape)", () => {
		const result = deriveSpellResolution({
			description:
				"Each creature within 15 feet must make a DC 13 Vitality save, taking 2d6 thunder damage on failure (half on success).",
			type: "Attack",
		});
		expect(result.saving_throw).toEqual({ ability: "Vitality", dc: 13 });
		expect(result.damage_profile).toBe("2d6 thunder");
		expect(result.attack).toBeUndefined();
	});

	it("returns an empty resolution for a pure-utility spell (Lattice Ping)", () => {
		const result = deriveSpellResolution({
			description:
				"Send a pulse of divination energy through the local mana lattice. You learn the number and general direction of all creatures within 30 feet, even through total cover.",
			type: "Utility",
		});
		expect(result.attack).toBeUndefined();
		expect(result.saving_throw).toBeUndefined();
		expect(result.healing).toBeUndefined();
		expect(result.damage_profile).toBeUndefined();
	});

	it("does not treat an offensive 'gains' clause as healing", () => {
		const result = deriveSpellResolution({
			description:
				"Make a ranged spell attack using Intelligence to deal 2d8 force damage; you gain advantage on your next attack.",
			type: "Attack",
		});
		expect(result.healing).toBeUndefined();
		expect(result.attack?.damage).toBe("2d8");
	});
});
