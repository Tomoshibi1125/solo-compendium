import type { RuneCompendiumEntry } from "../runes";

export const runes_skill_skills: RuneCompendiumEntry[] = [
	{
		id: "rune-skill-athletics-1",
		name: "Rune of Titan's Prowess",
		description:
			"A heavy, pulsating rune that hums with kinetic energy. Absorbing it grants permanent proficiency in Athletics.",
		effect_description:
			"You gain proficiency in the Athletics skill. If you already have proficiency, you gain expertise instead.",
		rune_type: "utility",
		rune_category: "General",
		rune_level: 1,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 1,
		passive_bonuses: {
			skill_proficiencies: ["Athletics"],
		},
		tags: ["skill", "athletics", "prowess"],
	},
	{
		id: "rune-skill-stealth-2",
		name: "Rune of Umbral Silence",
		description:
			"A dark, shadow-absorbing rune that feels cold to the touch. Absorbing it grants permanent expertise in Stealth.",
		effect_description:
			"You gain expertise in the Stealth skill. You must already be proficient in Stealth to absorb this rune's full power.",
		rune_type: "utility",
		rune_category: "General",
		rune_level: 2,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 3,
		passive_bonuses: {
			skill_expertise: ["Stealth"],
		},
		tags: ["skill", "stealth", "shadow"],
	},
	{
		id: "rune-skill-perception-3",
		name: "Rune of the All-Seeing Eye",
		description:
			"A crystalline rune that seems to track movement on its own. Absorbing it grants permanent proficiency in Perception.",
		effect_description:
			"You gain proficiency in the Perception skill. If you already have proficiency, you gain expertise instead.",
		rune_type: "utility",
		rune_category: "General",
		rune_level: 1,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 1,
		passive_bonuses: {
			skill_proficiencies: ["Perception"],
		},
		tags: ["skill", "perception", "vision"],
	},
];
