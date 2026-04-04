import type { CompendiumSpell } from "@/types/compendium";

export const spells_c: CompendiumSpell[] = [
	{
		id: "spell-c-1",
		name: "Void wave",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-1.webp",
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
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-2",
		name: "Corona burst",
		description:
			"A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-2.webp",
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
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-3",
		name: "Radiant shackle",
		description:
			"A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-3.webp",
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
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-4",
		name: "Abyssal strike",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-4.webp",
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
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-5",
		name: "Crimson strike",
		description:
			"The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-5.webp",
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
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-6",
		name: "Null spike",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-6.webp",
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
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-7",
		name: "Crimson shackle",
		description:
			"The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-7.webp",
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
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-8",
		name: "Abyssal shackle",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-8.webp",
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
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-9",
		name: "Celestial edge",
		description:
			"A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-9.webp",
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
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-10",
		name: "Singularity lance",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-10.webp",
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
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-11",
		name: "Frost grasp",
		description:
			"A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-11.webp",
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
					dice: "2d6",
					type: "cold",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-12",
		name: "Chill wave",
		description:
			"A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-12.webp",
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
					dice: "2d6",
					type: "cold",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-13",
		name: "Radiant grasp",
		description:
			"A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-13.webp",
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
					dice: "2d6",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-14",
		name: "Abyssal edge",
		description:
			"A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-14.webp",
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
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
	{
		id: "spell-c-15",
		name: "Gore shackle",
		description:
			"The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "C",
		image: "/generated/compendium/spells/spell-c-15.webp",
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
					dice: "2d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 20,
		},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d6 per tier.",
	},
];
