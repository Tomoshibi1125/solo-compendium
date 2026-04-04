export const items = [
	{
		id: "item-p3-1",
		name: "Mountain-Soul Boots",
		description:
			"Immune to all base-level kinetic force. This boots pulses with titanic resonance.",
		rarity: "uncommon",
		type: "scroll",
		image: "/generated/compendium/items/item-p3-1.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 3,
		value: 16200,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-2",
		name: "Vampiric Plate",
		description:
			"A dark soul-contract made in blood. This plate pulses with blood resonance.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/item-p3-2.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Strength increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 4,
		value: 46336,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-3",
		name: "Chronos-Plate Plate",
		description:
			"Bypasses the dimensional divide entirely. This plate pulses with aetheric resonance.",
		rarity: "very_rare",
		type: "consumable",
		image: "/generated/compendium/items/item-p3-3.webp",
		effects: {
			passive: [
				"You gain resistance to psychic damage.",
				"While using this item, your Sense increases by 1.",
			],
			active: [
				{
					name: "Aetheric Resonance Burst",
					description:
						"Unleash a wave of psychic energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 4,
		value: 37272,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-4",
		name: "Storm-Caller Boots",
		description:
			"Recovered during a Mana-Resonance event. This boots pulses with storm resonance.",
		rarity: "uncommon",
		type: "consumable",
		image: "/generated/compendium/items/item-p3-4.webp",
		effects: {
			passive: [
				"You gain resistance to thunder damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 5,
		value: 34234,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals thunder damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-5",
		name: "Frost-Bound Band",
		description:
			"Cold enough to freeze the blood in mid-air. This band pulses with glacial resonance.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/item-p3-5.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [
				{
					name: "Glacial Resonance Burst",
					description:
						"Unleash a wave of cold energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 3,
		value: 45714,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-6",
		name: "Earth-Crusher Band",
		description:
			"Heavy enough to level a city block. This band pulses with titanic resonance.",
		rarity: "common",
		type: "accessory",
		image: "/generated/compendium/items/item-p3-6.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 1,
		value: 24477,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-7",
		name: "Core-Forged Blade",
		description:
			"Inscribed with the gravity-runes of a Titan. This blade pulses with titanic resonance.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/item-p3-7.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [
				{
					name: "Titanic Resonance Burst",
					description:
						"Unleash a wave of bludgeoning energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 2,
		value: 36653,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-8",
		name: "Static Tome",
		description:
			"Recovered during a Mana-Resonance event. This tome pulses with storm resonance.",
		rarity: "legendary",
		type: "wand",
		image: "/generated/compendium/items/item-p3-8.webp",
		effects: {
			passive: [
				"You gain resistance to lightning damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [
				{
					name: "Storm Resonance Burst",
					description:
						"Unleash a wave of lightning energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 1,
		value: 49224,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-9",
		name: "Static Plate",
		description:
			"Recovered during a Mana-Resonance event. This plate pulses with storm resonance.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-p3-9.webp",
		effects: {
			passive: [
				"You gain resistance to thunder damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [
				{
					name: "Storm Resonance Burst",
					description:
						"Unleash a wave of thunder energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 1,
		value: 7343,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals thunder damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-10",
		name: "Granite Necklace",
		description:
			"Heavy enough to level a city block. This necklace pulses with titanic resonance.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-p3-10.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 2,
		value: 42083,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-11",
		name: "Umbral Necklace",
		description:
			"Whispers in the tongue of the Monarchs. This necklace pulses with void resonance.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/item-p3-11.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 3,
		value: 22893,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-12",
		name: "Static Rod",
		description:
			"Recovered during a Mana-Resonance event. This rod pulses with storm resonance.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-p3-12.webp",
		effects: {
			passive: [
				"You gain resistance to lightning damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 2,
		value: 46070,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-13",
		name: "Radiant-Steel Gauntlets",
		description:
			"Blinds those with unworthy souls. This gauntlets pulses with solar resonance.",
		rarity: "legendary",
		type: "consumable",
		image: "/generated/compendium/items/item-p3-13.webp",
		effects: {
			passive: [
				"You gain resistance to radiant damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [
				{
					name: "Solar Resonance Burst",
					description:
						"Unleash a wave of radiant energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 5,
		value: 7312,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals radiant damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-14",
		name: "Essence-Core Cloak",
		description:
			"Bypasses the dimensional divide entirely. This cloak pulses with aetheric resonance.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-p3-14.webp",
		effects: {
			passive: [
				"You gain resistance to force damage.",
				"While using this item, your Sense increases by 1.",
			],
			active: [
				{
					name: "Aetheric Resonance Burst",
					description:
						"Unleash a wave of force energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 4,
		value: 20533,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals force damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-15",
		name: "Umbral Gauntlets",
		description:
			"Whispers in the tongue of the Monarchs. This gauntlets pulses with void resonance.",
		rarity: "uncommon",
		type: "accessory",
		image: "/generated/compendium/items/item-p3-15.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 2,
		value: 33284,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-16",
		name: "Frost-Bound Blade",
		description:
			"Cold enough to freeze the blood in mid-air. This blade pulses with glacial resonance.",
		rarity: "very_rare",
		type: "accessory",
		image: "/generated/compendium/items/item-p3-16.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [
				{
					name: "Glacial Resonance Burst",
					description:
						"Unleash a wave of cold energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 2,
		value: 28073,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-17",
		name: "Bolt-Struck Cloak",
		description:
			"Fast as a blink of an eye. This cloak pulses with storm resonance.",
		rarity: "rare",
		type: "scroll",
		image: "/generated/compendium/items/item-p3-17.webp",
		effects: {
			passive: [
				"You gain resistance to lightning damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [
				{
					name: "Storm Resonance Burst",
					description:
						"Unleash a wave of lightning energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 1,
		value: 30757,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-18",
		name: "Cryo-Steel Cloak",
		description:
			"Extracted from an S-Rank frost gate. This cloak pulses with glacial resonance.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-p3-18.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [
				{
					name: "Glacial Resonance Burst",
					description:
						"Unleash a wave of cold energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 1,
		value: 51285,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-19",
		name: "Earth-Crusher Rod",
		description:
			"Heavy enough to level a city block. This rod pulses with titanic resonance.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/item-p3-19.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [
				{
					name: "Titanic Resonance Burst",
					description:
						"Unleash a wave of bludgeoning energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 3,
		value: 31095,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-20",
		name: "Vampiric Blade",
		description:
			"Hungers for the life force of its wielder. This blade pulses with blood resonance.",
		rarity: "uncommon",
		type: "consumable",
		image: "/generated/compendium/items/item-p3-20.webp",
		effects: {
			passive: [
				"You gain resistance to slashing damage.",
				"While using this item, your Strength increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 5,
		value: 16452,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals slashing damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-21",
		name: "Abyssal-Hand Rod",
		description:
			"Absorbs all ambient light. This rod pulses with void resonance.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-p3-21.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [
				{
					name: "Void Resonance Burst",
					description:
						"Unleash a wave of necrotic energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 4,
		value: 32407,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-22",
		name: "Lightning-Carved Cowl",
		description:
			"Fast as a blink of an eye. This cowl pulses with storm resonance.",
		rarity: "epic",
		type: "wand",
		image: "/generated/compendium/items/item-p3-22.webp",
		effects: {
			passive: [
				"You gain resistance to thunder damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [
				{
					name: "Storm Resonance Burst",
					description:
						"Unleash a wave of thunder energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 3,
		value: 6264,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals thunder damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-23",
		name: "Dredge Cloak",
		description:
			"Whispers in the tongue of the Monarchs. This cloak pulses with void resonance.",
		rarity: "rare",
		type: "wand",
		image: "/generated/compendium/items/item-p3-23.webp",
		effects: {
			passive: [
				"You gain resistance to psychic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [
				{
					name: "Void Resonance Burst",
					description:
						"Unleash a wave of psychic energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 5,
		value: 29886,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-24",
		name: "Earth-Crusher Cloak",
		description:
			"Inscribed with the gravity-runes of a Titan. This cloak pulses with titanic resonance.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/item-p3-24.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [
				{
					name: "Titanic Resonance Burst",
					description:
						"Unleash a wave of bludgeoning energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 1,
		value: 47609,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-25",
		name: "Thunder-Clap Plate",
		description:
			"Recovered during a Mana-Resonance event. This plate pulses with storm resonance.",
		rarity: "rare",
		type: "accessory",
		image: "/generated/compendium/items/item-p3-25.webp",
		effects: {
			passive: [
				"You gain resistance to lightning damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [
				{
					name: "Storm Resonance Burst",
					description:
						"Unleash a wave of lightning energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 3,
		value: 20136,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-26",
		name: "Earth-Crusher Rod",
		description:
			"Immune to all base-level kinetic force. This rod pulses with titanic resonance.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-p3-26.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [
				{
					name: "Titanic Resonance Burst",
					description:
						"Unleash a wave of bludgeoning energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 2,
		value: 2802,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-27",
		name: "Stone-Skin Blade",
		description:
			"Heavy enough to level a city block. This blade pulses with titanic resonance.",
		rarity: "legendary",
		type: "wand",
		image: "/generated/compendium/items/item-p3-27.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [
				{
					name: "Titanic Resonance Burst",
					description:
						"Unleash a wave of bludgeoning energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 1,
		value: 30099,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-28",
		name: "Storm-Caller Cloak",
		description:
			"Fast as a blink of an eye. This cloak pulses with storm resonance.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-p3-28.webp",
		effects: {
			passive: [
				"You gain resistance to lightning damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 2,
		value: 13470,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-29",
		name: "Umbral Gauntlets",
		description:
			"Whispers in the tongue of the Monarchs. This gauntlets pulses with void resonance.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-p3-29.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [
				{
					name: "Void Resonance Burst",
					description:
						"Unleash a wave of necrotic energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 2,
		value: 12165,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p3-30",
		name: "Thunder-Clap Rod",
		description:
			"Recovered during a Mana-Resonance event. This rod pulses with storm resonance.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/item-p3-30.webp",
		effects: {
			passive: [
				"You gain resistance to thunder damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 1,
		value: 45441,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals thunder damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
];
