export const spells_s = [
	{
		id: "spell-0801",
		name: "Eternal Shadow Convergence",
		description:
			"The ultimate shadow spell that merges all shadow elements into one devastating attack. This S rank spell represents the pinnacle of shadow magic.",
		type: "Attack",
		rank: "S",
		image: "/generated/compendium/spells/spell-0801.webp",
		effect:
			"Deals ultimate shadow damage and applies eternal shadow corruption to all enemies in range.",
		range: {
			type: "distance",
			value: 100,
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
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Deals ultimate shadow damage and applies eternal shadow corruption to all enemies in range.",
		},
		mechanics: {
			attack: {
				mode: "ranged",
				resolution: "spell_attack",
				damage: {
					dice: "10d6",
					type: "necrotic",
				},
			},
		},
		limitations: {
			mana_cost: 150,
		},
		flavor:
			"Denies the fragile limits of flesh. An ancient breaking point of the world.",
	},
	{
		id: "spell-0802",
		name: "Void Reality Distortion",
		description:
			"A god-tier void spell that bends reality itself to the caster's will. This S rank spell can alter the fabric of existence.",
		type: "Utility",
		rank: "S",
		image: "/generated/compendium/spells/spell-0802.webp",
		effect:
			"Distorts reality in a massive area, creating void zones that nullify all other magic.",
		range: {
			type: "distance",
			value: 150,
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
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Distorts reality in a massive area, creating void zones that nullify all other magic.",
		},
		mechanics: {
			saving_throw: {
				ability: "CON",
				dc: 18,
				on_save: "Half effect or negates secondary impairment (if any).",
			},
		},
		limitations: {
			mana_cost: 200,
		},
		flavor:
			"Cleanses the flow of time itself. An intricate symphony of violence.",
	},
	{
		id: "spell-0803",
		name: "Supreme Abyssal Ascension",
		description:
			"The final spell that grants temporary godhood to the caster. This S rank spell channels the power of the supreme abyssal deity.",
		type: "Healing",
		rank: "S",
		image: "/generated/compendium/spells/spell-0803.webp",
		effect:
			"Grants complete invincibility and unlimited mana for a short duration while healing all allies.",
		range: {
			type: "distance",
			value: 200,
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
			focus: "Ascendant focus (attuned conduit)",
		},
		effects: {
			primary:
				"Grants complete invincibility and unlimited mana for a short duration while healing all allies.",
		},
		mechanics: {
			healing: {
				dice: "6d8",
				notes: "Restores vitality; does not remove conditions unless stated.",
			},
		},
		limitations: {
			mana_cost: 100,
		},
		flavor:
			"Commands the fragile limits of flesh. A desperate breaking point of the world.",
	},
];
