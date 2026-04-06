import type { CompendiumSpell } from "@/types/compendium";
export const spells_s: CompendiumSpell[] = [
	{
		id: "spell-s-1",
		name: "Tempest lance",
		description:
			"The wielder taps into the Primal Source, bypassing all System safety protocols. The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-1.webp",
		effect: "Target cannot take reactions until the start of its next turn.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "lightning",
				},
			},
		},
		limitations: {},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-2",
		name: "Dawn pulse",
		description:
			"The wielder taps into the Primal Source, bypassing all System safety protocols. A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-2.webp",
		effect: "Undead have disadvantage on Decree checks against this spell.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "radiant",
				},
			},
		},
		limitations: {},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-3",
		name: "Thunder siphon",
		description:
			"Reality itself rejects the presence of this energy, causing recursive mana-voids. The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-3.webp",
		effect: "Target cannot take reactions until the start of its next turn.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "lightning",
				},
			},
		},
		limitations: {},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-4",
		name: "Cold edge",
		description:
			"A manifestation of the Monarch's will, forced into physical reality. A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-4.webp",
		effect: "Target's movement speed is reduced by 10 feet.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "cold",
				},
			},
		},
		limitations: {},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-5",
		name: "Chill burst",
		description:
			"Ancient mana, older than the Rift itself, coalesces into a singular point. A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-5.webp",
		effect: "Target's movement speed is reduced by 10 feet.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "cold",
				},
			},
		},
		limitations: {},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-6",
		name: "Light lance",
		description:
			"A manifestation of the Monarch's will, forced into physical reality. A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-6.webp",
		effect: "Undead have disadvantage on Decree checks against this spell.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "radiant",
				},
			},
		},
		limitations: {},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-7",
		name: "Solar grasp",
		description:
			"A manifestation of the Monarch's will, forced into physical reality. A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-7.webp",
		effect: "Undead have disadvantage on Decree checks against this spell.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "radiant",
				},
			},
		},
		limitations: {},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-8",
		name: "Rime judgment",
		description:
			"The air shudders as the dimensional divide thins. A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-8.webp",
		effect: "Target's movement speed is reduced by 10 feet.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "cold",
				},
			},
		},
		limitations: {},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-9",
		name: "Light tomb",
		description:
			"The wielder taps into the Primal Source, bypassing all System safety protocols. A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-9.webp",
		effect: "Undead have disadvantage on Decree checks against this spell.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "radiant",
				},
			},
		},
		limitations: {},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-10",
		name: "Radiant siphon",
		description:
			"Reality itself rejects the presence of this energy, causing recursive mana-voids. A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-10.webp",
		effect: "Undead have disadvantage on Decree checks against this spell.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "radiant",
				},
			},
		},
		limitations: {},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-11",
		name: "Frozen shackle",
		description:
			"The wielder taps into the Primal Source, bypassing all System safety protocols. A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-11.webp",
		effect: "Target's movement speed is reduced by 10 feet.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "cold",
				},
			},
		},
		limitations: {},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-12",
		name: "Umbral burst",
		description:
			"The air shudders as the dimensional divide thins. A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-12.webp",
		effect: "Critical hits pull the target 10 feet toward the caster.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-13",
		name: "Shadow strike",
		description:
			"A manifestation of the Monarch's will, forced into physical reality. A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-13.webp",
		effect: "Critical hits pull the target 10 feet toward the caster.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-14",
		name: "Frost strike",
		description:
			"The air shudders as the dimensional divide thins. A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-14.webp",
		effect: "Target's movement speed is reduced by 10 feet.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "cold",
				},
			},
		},
		limitations: {},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
	{
		id: "spell-s-15",
		name: "Entropy burst",
		description:
			"The wielder taps into the Primal Source, bypassing all System safety protocols. A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "S",
		image: "/generated/compendium/spells/spell-s-15.webp",
		effect: "Critical hits pull the target 10 feet toward the caster.",
		range: {
			type: "distance",
			value: 300,
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
					dice: "12d12",
					type: "necrotic",
				},
			},
		},
		limitations: {},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d12 per tier.",
	},
];
