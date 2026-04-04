export const items = [
	{
		id: "item-p8-1",
		name: "Basalt Cowl",
		description:
			"Immune to all base-level kinetic force. This cowl pulses with titanic resonance.",
		rarity: "uncommon",
		type: "consumable",
		image: "/generated/compendium/items/item-p8-1.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 1,
		value: 26691,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-2",
		name: "Shadow-Veined Greatsword",
		description:
			"Absorbs all ambient light. This greatsword pulses with void resonance.",
		rarity: "common",
		type: "accessory",
		image: "/generated/compendium/items/item-p8-2.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 3,
		value: 3720,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-3",
		name: "Dawn-Guard Gauntlets",
		description:
			"Found in a solar-synchronized floating gate. This gauntlets pulses with solar resonance.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/item-p8-3.webp",
		effects: {
			passive: [
				"You gain resistance to fire damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 4,
		value: 43870,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals fire damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-4",
		name: "Cryo-Steel Greatsword",
		description:
			"Cold enough to freeze the blood in mid-air. This greatsword pulses with glacial resonance.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-p8-4.webp",
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
		value: 30677,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-5",
		name: "Grave-Walker Shield",
		description:
			"Whispers in the tongue of the Monarchs. This shield pulses with void resonance.",
		rarity: "very_rare",
		type: "ring",
		image: "/generated/compendium/items/item-p8-5.webp",
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
		weight: 2,
		value: 46815,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-6",
		name: "Essence-Core Shield",
		description:
			"A fragment of the original System code. This shield pulses with aetheric resonance.",
		rarity: "rare",
		type: "accessory",
		image: "/generated/compendium/items/item-p8-6.webp",
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
		value: 41580,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-7",
		name: "Frost-Bound Plate",
		description:
			"Extracted from an S-Rank frost gate. This plate pulses with glacial resonance.",
		rarity: "epic",
		type: "scroll",
		image: "/generated/compendium/items/item-p8-7.webp",
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
		value: 38169,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-8",
		name: "Flesh-Stitcher Circlet",
		description:
			"Hungers for the life force of its wielder. This circlet pulses with blood resonance.",
		rarity: "very_rare",
		type: "consumable",
		image: "/generated/compendium/items/item-p8-8.webp",
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
		weight: 4,
		value: 40196,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-9",
		name: "Sanguine Circlet",
		description:
			"A dark soul-contract made in blood. This circlet pulses with blood resonance.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/item-p8-9.webp",
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
		value: 12579,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-10",
		name: "Sunbeam Blade",
		description:
			"Blinds those with unworthy souls. This blade pulses with solar resonance.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/item-p8-10.webp",
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
		weight: 3,
		value: 7623,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals radiant damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-11",
		name: "Blood-Iron Circlet",
		description:
			"A dark soul-contract made in blood. This circlet pulses with blood resonance.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/item-p8-11.webp",
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
		weight: 3,
		value: 29934,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-12",
		name: "Grave-Walker Vial",
		description:
			"Whispers in the tongue of the Monarchs. This vial pulses with void resonance.",
		rarity: "uncommon",
		type: "consumable",
		image: "/generated/compendium/items/item-p8-12.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 4,
		value: 42667,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-13",
		name: "Dawn-Guard Plate",
		description:
			"Forged in the heart of a dying sun. This plate pulses with solar resonance.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/item-p8-13.webp",
		effects: {
			passive: [
				"You gain resistance to fire damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 2,
		value: 35971,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals fire damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-14",
		name: "Nightfall Circlet",
		description:
			"Absorbs all ambient light. This circlet pulses with void resonance.",
		rarity: "rare",
		type: "scroll",
		image: "/generated/compendium/items/item-p8-14.webp",
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
		weight: 2,
		value: 41844,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-15",
		name: "Sanguine Tome",
		description:
			"Hungers for the life force of its wielder. This tome pulses with blood resonance.",
		rarity: "uncommon",
		type: "accessory",
		image: "/generated/compendium/items/item-p8-15.webp",
		effects: {
			passive: [
				"You gain resistance to slashing damage.",
				"While using this item, your Strength increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 1,
		value: 25748,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals slashing damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-16",
		name: "Rift-Walker Cowl",
		description:
			"A fragment of the original System code. This cowl pulses with aetheric resonance.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-p8-16.webp",
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
		value: 40426,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals force damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-17",
		name: "Winter-Blight Vial",
		description:
			"Extracted from an S-Rank frost gate. This vial pulses with glacial resonance.",
		rarity: "uncommon",
		type: "accessory",
		image: "/generated/compendium/items/item-p8-17.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 3,
		value: 16614,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-18",
		name: "Storm-Caller Shield",
		description:
			"Fast as a blink of an eye. This shield pulses with storm resonance.",
		rarity: "very_rare",
		type: "consumable",
		image: "/generated/compendium/items/item-p8-18.webp",
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
		weight: 5,
		value: 49236,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals thunder damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-19",
		name: "Sunbeam Band",
		description:
			"Forged in the heart of a dying sun. This band pulses with solar resonance.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/item-p8-19.webp",
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
		weight: 5,
		value: 29869,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals fire damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-20",
		name: "Arctic-Shard Shield",
		description:
			"Cold enough to freeze the blood in mid-air. This shield pulses with glacial resonance.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-p8-20.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 2,
		value: 41312,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-21",
		name: "Heart-Linked Band",
		description:
			"Strengthens with every drop of mana spilled. This band pulses with blood resonance.",
		rarity: "epic",
		type: "consumable",
		image: "/generated/compendium/items/item-p8-21.webp",
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
		weight: 4,
		value: 20488,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-22",
		name: "Abyssal-Hand Cloak",
		description:
			"Whispers in the tongue of the Monarchs. This cloak pulses with void resonance.",
		rarity: "very_rare",
		type: "weapon",
		image: "/generated/compendium/items/item-p8-22.webp",
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
		weight: 2,
		value: 50397,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-23",
		name: "Arctic-Shard Boots",
		description:
			"Cold enough to freeze the blood in mid-air. This boots pulses with glacial resonance.",
		rarity: "very_rare",
		type: "armor",
		image: "/generated/compendium/items/item-p8-23.webp",
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
		value: 49871,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-24",
		name: "Winter-Blight Boots",
		description:
			"Solid water that never melts. This boots pulses with glacial resonance.",
		rarity: "uncommon",
		type: "wand",
		image: "/generated/compendium/items/item-p8-24.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 5,
		value: 19729,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-25",
		name: "Bolt-Struck Shield",
		description:
			"Crackles with residual kinetic energy. This shield pulses with storm resonance.",
		rarity: "uncommon",
		type: "consumable",
		image: "/generated/compendium/items/item-p8-25.webp",
		effects: {
			passive: [
				"You gain resistance to lightning damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 4,
		value: 18422,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-26",
		name: "Flesh-Stitcher Vial",
		description:
			"A dark soul-contract made in blood. This vial pulses with blood resonance.",
		rarity: "epic",
		type: "wand",
		image: "/generated/compendium/items/item-p8-26.webp",
		effects: {
			passive: [
				"You gain resistance to slashing damage.",
				"While using this item, your Strength increases by 1.",
			],
			active: [
				{
					name: "Blood Resonance Burst",
					description:
						"Unleash a wave of slashing energy dealing 4d8 damage in a 15ft cone.",
					action: "action",
					frequency: "once-per-rest",
				},
			],
		},
		attunement: true,
		weight: 2,
		value: 21831,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals slashing damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-27",
		name: "Spatial-Shard Band",
		description:
			"Discovered in a stable Rift fracture. This band pulses with aetheric resonance.",
		rarity: "legendary",
		type: "wand",
		image: "/generated/compendium/items/item-p8-27.webp",
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
		value: 5011,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-28",
		name: "Storm-Caller Rod",
		description:
			"Fast as a blink of an eye. This rod pulses with storm resonance.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/item-p8-28.webp",
		effects: {
			passive: [
				"You gain resistance to lightning damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 2,
		value: 10641,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-29",
		name: "Winter-Blight Boots",
		description:
			"Cold enough to freeze the blood in mid-air. This boots pulses with glacial resonance.",
		rarity: "rare",
		type: "accessory",
		image: "/generated/compendium/items/item-p8-29.webp",
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
		value: 45326,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p8-30",
		name: "Umbral Rod",
		description:
			"Whispers in the tongue of the Monarchs. This rod pulses with void resonance.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/item-p8-30.webp",
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
		weight: 2,
		value: 50988,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
];
