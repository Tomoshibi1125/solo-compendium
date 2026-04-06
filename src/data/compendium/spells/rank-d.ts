import type { CompendiumSpell } from "@/types/compendium";
export const spells_d: CompendiumSpell[] = [
	{
		id: "spell-d-1",
		name: "Chill lance",
		description:
			"A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-1.webp",
		effect: "Target's movement speed is reduced by 10 feet.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "Target's movement speed is reduced by 10 feet.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "cold",
				},
			},
		},
		limitations: {},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-2",
		name: "Thunder shackle",
		description:
			"The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-2.webp",
		effect: "Target cannot take reactions until the start of its next turn.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "Target cannot take reactions until the start of its next turn.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "lightning",
				},
			},
		},
		limitations: {},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-3",
		name: "Tempest shackle",
		description:
			"The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-3.webp",
		effect: "Target cannot take reactions until the start of its next turn.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "Target cannot take reactions until the start of its next turn.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "lightning",
				},
			},
		},
		limitations: {},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-4",
		name: "Surge storm",
		description:
			"The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-4.webp",
		effect: "Target cannot take reactions until the start of its next turn.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "Target cannot take reactions until the start of its next turn.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "lightning",
				},
			},
		},
		limitations: {},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-5",
		name: "Sanguine strike",
		description:
			"The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-5.webp",
		effect: "The caster regains HP equal to half the damage dealt.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "The caster regains HP equal to half the damage dealt.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-6",
		name: "Bright tomb",
		description:
			"A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-6.webp",
		effect: "Undead have disadvantage on Decree checks against this spell.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "Undead have disadvantage on Decree checks against this spell.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "radiant",
				},
			},
		},
		limitations: {},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-7",
		name: "Arctic lance",
		description:
			"A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-7.webp",
		effect: "Target's movement speed is reduced by 10 feet.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "Target's movement speed is reduced by 10 feet.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "cold",
				},
			},
		},
		limitations: {},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-8",
		name: "Crimson strike",
		description:
			"The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-8.webp",
		effect: "The caster regains HP equal to half the damage dealt.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "The caster regains HP equal to half the damage dealt.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-9",
		name: "Blood tear",
		description:
			"The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-9.webp",
		effect: "The caster regains HP equal to half the damage dealt.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "The caster regains HP equal to half the damage dealt.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-10",
		name: "Night storm",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-10.webp",
		effect: "Critical hits pull the target 10 feet toward the caster.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "Critical hits pull the target 10 feet toward the caster.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-11",
		name: "Carnage strike",
		description:
			"The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-11.webp",
		effect: "The caster regains HP equal to half the damage dealt.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "The caster regains HP equal to half the damage dealt.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-12",
		name: "Entropy siphon",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-12.webp",
		effect: "Critical hits pull the target 10 feet toward the caster.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "Critical hits pull the target 10 feet toward the caster.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-13",
		name: "Corona storm",
		description:
			"A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-13.webp",
		effect: "Undead have disadvantage on Decree checks against this spell.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "Undead have disadvantage on Decree checks against this spell.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "radiant",
				},
			},
		},
		limitations: {},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-14",
		name: "Lightning strike",
		description:
			"The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-14.webp",
		effect: "Target cannot take reactions until the start of its next turn.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "Target cannot take reactions until the start of its next turn.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "lightning",
				},
			},
		},
		limitations: {},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
	{
		id: "spell-d-15",
		name: "Ice lance",
		description:
			"A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "D",
		image: "/generated/compendium/spells/spell-d-15.webp",
		effect: "Target's movement speed is reduced by 10 feet.",
		range: {
			type: "distance",
			value: 120,
			unit: "ft",
		},
		activation: {
			type: "action",
			cost: 1,
		},
		duration: {
			type: "instant",
		},
		components: {
			verbal: true,
			somatic: true,
			material: false,
			focus: "Ascendant focus",
		},
		effects: {
			primary: "Target's movement speed is reduced by 10 feet.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "1d4",
					type: "cold",
				},
			},
		},
		limitations: {},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d4 per tier.",
	},
];
