import type { CompendiumSpell } from "@/types/compendium";
export const spells_b: CompendiumSpell[] = [
	{
		id: "spell-b-1",
		name: "Entropy lance",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-1.webp",
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
					dice: "4d8",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-2",
		name: "Ichor edge",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-2.webp",
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
					dice: "4d8",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-3",
		name: "Glacial tomb",
		description:
			"A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-3.webp",
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
					dice: "4d8",
					type: "cold",
				},
			},
		},
		limitations: {},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-4",
		name: "Dawn spike",
		description:
			"A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-4.webp",
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
					dice: "4d8",
					type: "radiant",
				},
			},
		},
		limitations: {},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-5",
		name: "Solar burst",
		description:
			"A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-5.webp",
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
					dice: "4d8",
					type: "radiant",
				},
			},
		},
		limitations: {},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-6",
		name: "Void edge",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-6.webp",
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
					dice: "4d8",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-7",
		name: "Pulse spike",
		description:
			"The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-7.webp",
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
					dice: "4d8",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-8",
		name: "Tempest shackle",
		description:
			"The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-8.webp",
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
					dice: "4d8",
					type: "lightning",
				},
			},
		},
		limitations: {},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-9",
		name: "Heart tear",
		description:
			"The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-9.webp",
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
					dice: "4d8",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-10",
		name: "Arctic burst",
		description:
			"A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-10.webp",
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
					dice: "4d8",
					type: "cold",
				},
			},
		},
		limitations: {},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-11",
		name: "Void tomb",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-11.webp",
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
					dice: "4d8",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-12",
		name: "Bolt pulse",
		description:
			"The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-12.webp",
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
					dice: "4d8",
					type: "lightning",
				},
			},
		},
		limitations: {},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-13",
		name: "Sanguine burst",
		description:
			"The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-13.webp",
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
					dice: "4d8",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-14",
		name: "Rime blast",
		description:
			"A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-14.webp",
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
					dice: "4d8",
					type: "cold",
				},
			},
		},
		limitations: {},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
	{
		id: "spell-b-15",
		name: "Void lance",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "B",
		image: "/generated/compendium/spells/spell-b-15.webp",
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
					dice: "4d8",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d8 per tier.",
	},
];
