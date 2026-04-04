export const items = [
	{
		id: "item-p6-1",
		name: "Basalt Boots",
		description:
			"Inscribed with the gravity-runes of a Titan. This boots pulses with titanic resonance.",
		rarity: "common",
		type: "accessory",
		image: "/generated/compendium/items/item-p6-1.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 5,
		value: 44531,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-2",
		name: "Storm-Caller Rod",
		description:
			"Recovered during a Mana-Resonance event. This rod pulses with storm resonance.",
		rarity: "uncommon",
		type: "wand",
		image: "/generated/compendium/items/item-p6-2.webp",
		effects: {
			passive: [
				"You gain resistance to lightning damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 4,
		value: 30875,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-3",
		name: "Essence-Core Gauntlets",
		description:
			"Discovered in a stable Rift fracture. This gauntlets pulses with aetheric resonance.",
		rarity: "very_rare",
		type: "consumable",
		image: "/generated/compendium/items/item-p6-3.webp",
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
		weight: 1,
		value: 21738,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-4",
		name: "Dawn-Guard Vial",
		description:
			"Forged in the heart of a dying sun. This vial pulses with solar resonance.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-p6-4.webp",
		effects: {
			passive: [
				"You gain resistance to fire damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [
				{
					name: "Solar Resonance Burst",
					description:
						"Unleash a wave of fire energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 2,
		value: 28460,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals fire damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-5",
		name: "Basalt Shield",
		description:
			"Immune to all base-level kinetic force. This shield pulses with titanic resonance.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-p6-5.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 4,
		value: 25795,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-6",
		name: "Light-Bringer Plate",
		description:
			"Found in a solar-synchronized floating gate. This plate pulses with solar resonance.",
		rarity: "very_rare",
		type: "ring",
		image: "/generated/compendium/items/item-p6-6.webp",
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
		weight: 4,
		value: 28046,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals radiant damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-7",
		name: "Granite Cloak",
		description:
			"Heavy enough to level a city block. This cloak pulses with titanic resonance.",
		rarity: "uncommon",
		type: "consumable",
		image: "/generated/compendium/items/item-p6-7.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 1,
		value: 32252,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-8",
		name: "Frozen Rod",
		description:
			"Solid water that never melts. This rod pulses with glacial resonance.",
		rarity: "epic",
		type: "wand",
		image: "/generated/compendium/items/item-p6-8.webp",
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
		weight: 5,
		value: 14549,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-9",
		name: "Thunder-Clap Tome",
		description:
			"Recovered during a Mana-Resonance event. This tome pulses with storm resonance.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/item-p6-9.webp",
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
		value: 38685,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals thunder damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-10",
		name: "Ice-Veined Boots",
		description:
			"Cold enough to freeze the blood in mid-air. This boots pulses with glacial resonance.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/item-p6-10.webp",
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
		weight: 4,
		value: 51298,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-11",
		name: "Chronos-Plate Cloak",
		description:
			"Discovered in a stable Rift fracture. This cloak pulses with aetheric resonance.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/item-p6-11.webp",
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
		weight: 1,
		value: 46018,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals force damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-12",
		name: "Solar-Forged Tome",
		description:
			"Blinds those with unworthy souls. This tome pulses with solar resonance.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/item-p6-12.webp",
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
		weight: 4,
		value: 41346,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals radiant damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-13",
		name: "Umbral Cloak",
		description:
			"Recovered from the depths of a Shadow Rift. This cloak pulses with void resonance.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/item-p6-13.webp",
		effects: {
			passive: [
				"You gain resistance to psychic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 3,
		value: 5335,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-14",
		name: "Vampiric Cowl",
		description:
			"Strengthens with every drop of mana spilled. This cowl pulses with blood resonance.",
		rarity: "uncommon",
		type: "scroll",
		image: "/generated/compendium/items/item-p6-14.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Strength increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 5,
		value: 37744,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-15",
		name: "Radiant-Steel Gauntlets",
		description:
			"Found in a solar-synchronized floating gate. This gauntlets pulses with solar resonance.",
		rarity: "legendary",
		type: "consumable",
		image: "/generated/compendium/items/item-p6-15.webp",
		effects: {
			passive: [
				"You gain resistance to fire damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [
				{
					name: "Solar Resonance Burst",
					description:
						"Unleash a wave of fire energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 2,
		value: 37498,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals fire damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-16",
		name: "Winter-Blight Shield",
		description:
			"Solid water that never melts. This shield pulses with glacial resonance.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-p6-16.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 4,
		value: 7235,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-17",
		name: "Umbral Boots",
		description:
			"Absorbs all ambient light. This boots pulses with void resonance.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/item-p6-17.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 2,
		value: 19420,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-18",
		name: "Aether-Bound Necklace",
		description:
			"A fragment of the original System code. This necklace pulses with aetheric resonance.",
		rarity: "very_rare",
		type: "consumable",
		image: "/generated/compendium/items/item-p6-18.webp",
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
		weight: 5,
		value: 15478,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-19",
		name: "Frozen Circlet",
		description:
			"Extracted from an S-Rank frost gate. This circlet pulses with glacial resonance.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/item-p6-19.webp",
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
		weight: 5,
		value: 13783,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-20",
		name: "Abyssal-Hand Plate",
		description:
			"Absorbs all ambient light. This plate pulses with void resonance.",
		rarity: "rare",
		type: "accessory",
		image: "/generated/compendium/items/item-p6-20.webp",
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
		weight: 5,
		value: 48700,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-21",
		name: "Solar-Forged Blade",
		description:
			"Found in a solar-synchronized floating gate. This blade pulses with solar resonance.",
		rarity: "very_rare",
		type: "consumable",
		image: "/generated/compendium/items/item-p6-21.webp",
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
		weight: 2,
		value: 15337,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals radiant damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-22",
		name: "Heart-Linked Greatsword",
		description:
			"Hungers for the life force of its wielder. This greatsword pulses with blood resonance.",
		rarity: "very_rare",
		type: "consumable",
		image: "/generated/compendium/items/item-p6-22.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Strength increases by 1.",
			],
			active: [
				{
					name: "Blood Resonance Burst",
					description:
						"Unleash a wave of necrotic energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 2,
		value: 30560,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-23",
		name: "Static Boots",
		description:
			"Crackles with residual kinetic energy. This boots pulses with storm resonance.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-p6-23.webp",
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
		weight: 4,
		value: 13759,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals thunder damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-24",
		name: "Arctic-Shard Rod",
		description:
			"Extracted from an S-Rank frost gate. This rod pulses with glacial resonance.",
		rarity: "common",
		type: "wand",
		image: "/generated/compendium/items/item-p6-24.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 5,
		value: 5195,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-25",
		name: "Thunder-Clap Plate",
		description:
			"Recovered during a Mana-Resonance event. This plate pulses with storm resonance.",
		rarity: "very_rare",
		type: "accessory",
		image: "/generated/compendium/items/item-p6-25.webp",
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
		weight: 5,
		value: 50552,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-26",
		name: "Core-Forged Cloak",
		description:
			"Immune to all base-level kinetic force. This cloak pulses with titanic resonance.",
		rarity: "uncommon",
		type: "scroll",
		image: "/generated/compendium/items/item-p6-26.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 5,
		value: 32761,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-27",
		name: "Aurelian Plate",
		description:
			"Blinds those with unworthy souls. This plate pulses with solar resonance.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/item-p6-27.webp",
		effects: {
			passive: [
				"You gain resistance to fire damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 5,
		value: 26809,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals fire damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-28",
		name: "Rime Greatsword",
		description:
			"Cold enough to freeze the blood in mid-air. This greatsword pulses with glacial resonance.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-p6-28.webp",
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
		value: 2489,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-29",
		name: "Winter-Blight Circlet",
		description:
			"Extracted from an S-Rank frost gate. This circlet pulses with glacial resonance.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/item-p6-29.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 2,
		value: 47364,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p6-30",
		name: "Frost-Bound Rod",
		description:
			"Cold enough to freeze the blood in mid-air. This rod pulses with glacial resonance.",
		rarity: "very_rare",
		type: "accessory",
		image: "/generated/compendium/items/item-p6-30.webp",
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
		value: 6452,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
];
