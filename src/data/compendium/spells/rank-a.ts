import type { CompendiumSpell } from "@/types/compendium";

export const spells_a: CompendiumSpell[] = [
	{
		id: "spell-a-1",
		name: "Heart wave",
		description:
			"The wielder taps into the Primal Source, bypassing all System safety protocols. The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-1.webp",
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
					dice: "8d10",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-2",
		name: "Bright spike",
		description:
			"The wielder taps into the Primal Source, bypassing all System safety protocols. A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-2.webp",
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
					dice: "8d10",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-3",
		name: "Umbral tear",
		description:
			"The wielder taps into the Primal Source, bypassing all System safety protocols. A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-3.webp",
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
					dice: "8d10",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-4",
		name: "Light burst",
		description:
			"A manifestation of the Monarch's will, forced into physical reality. A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-4.webp",
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
					dice: "8d10",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-5",
		name: "Corona shackle",
		description:
			"A manifestation of the Monarch's will, forced into physical reality. A brilliance that rivals the First Gate. This technique unleashes pure energy. Undead have disadvantage on Decree checks against this spell.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-5.webp",
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
					dice: "8d10",
					type: "radiant",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "A brilliance that rivals the First Gate.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-6",
		name: "Carnage tear",
		description:
			"Ancient mana, older than the System itself, coalesces into a singular point. The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-6.webp",
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
					dice: "8d10",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-7",
		name: "Shock tear",
		description:
			"A manifestation of the Monarch's will, forced into physical reality. The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-7.webp",
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
					dice: "8d10",
					type: "lightning",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-8",
		name: "Rime pulse",
		description:
			"Reality itself rejects the presence of this energy, causing recursive mana-voids. A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-8.webp",
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
					dice: "8d10",
					type: "cold",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-9",
		name: "Frost judgment",
		description:
			"A manifestation of the Monarch's will, forced into physical reality. A stillness more absolute than death. This technique unleashes pure energy. Target's movement speed is reduced by 10 feet.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-9.webp",
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
					dice: "8d10",
					type: "cold",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "A stillness more absolute than death.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-10",
		name: "Lightning strike",
		description:
			"Reality itself rejects the presence of this energy, causing recursive mana-voids. The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-10.webp",
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
					dice: "8d10",
					type: "lightning",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-11",
		name: "Shock spike",
		description:
			"Reality itself rejects the presence of this energy, causing recursive mana-voids. The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-11.webp",
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
					dice: "8d10",
					type: "lightning",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-12",
		name: "Volt wave",
		description:
			"A manifestation of the Monarch's will, forced into physical reality. The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-12.webp",
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
					dice: "8d10",
					type: "lightning",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-13",
		name: "Void blast",
		description:
			"Ancient mana, older than the System itself, coalesces into a singular point. A hunger that cannot be sated. This technique unleashes dark energy. Critical hits pull the target 10 feet toward the caster.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-13.webp",
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
					dice: "8d10",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "A hunger that cannot be sated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-14",
		name: "Pulse storm",
		description:
			"The wielder taps into the Primal Source, bypassing all System safety protocols. The rhythm of the kill. This technique unleashes dark energy. The caster regains HP equal to half the damage dealt.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-14.webp",
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
					dice: "8d10",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "The rhythm of the kill.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
	{
		id: "spell-a-15",
		name: "Surge grasp",
		description:
			"The air shudders as the dimensional divide thins. The sky's wrath concentrated. This technique unleashes pure energy. Target cannot take reactions until the start of its next turn.",
		type: "Combat",
		rank: "A",
		image: "/generated/compendium/spells/spell-a-15.webp",
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
					dice: "8d10",
					type: "lightning",
				},
			},
		},
		limitations: {
			mana_cost: 80,
		},
		flavor: "The sky's wrath concentrated.",
		atHigherLevels:
			"When cast at a higher tier, damage increases by 2d10 per tier.",
	},
];
