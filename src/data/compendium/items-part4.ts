export const items = [
	{
		id: "item-p4-1",
		name: "Bolt-Struck Boots",
		description:
			"Fast as a blink of an eye. This boots pulses with storm resonance.",
		rarity: "legendary",
		type: "accessory",
		image: "/generated/compendium/items/item-p4-1.webp",
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
		weight: 4,
		value: 42338,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-2",
		name: "Lightning-Carved Vial",
		description:
			"Fast as a blink of an eye. This vial pulses with storm resonance.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-p4-2.webp",
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
		weight: 4,
		value: 28924,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-3",
		name: "Void-Touched Vial",
		description:
			"Whispers in the tongue of the Monarchs. This vial pulses with void resonance.",
		rarity: "epic",
		type: "wand",
		image: "/generated/compendium/items/item-p4-3.webp",
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
		weight: 3,
		value: 20035,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-4",
		name: "Sunbeam Vial",
		description:
			"Forged in the heart of a dying sun. This vial pulses with solar resonance.",
		rarity: "legendary",
		type: "consumable",
		image: "/generated/compendium/items/item-p4-4.webp",
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
		value: 5568,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals radiant damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-5",
		name: "Cryo-Steel Greatsword",
		description:
			"Solid water that never melts. This greatsword pulses with glacial resonance.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/item-p4-5.webp",
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
		value: 41832,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-6",
		name: "Sanguine Rod",
		description:
			"A dark soul-contract made in blood. This rod pulses with blood resonance.",
		rarity: "very_rare",
		type: "armor",
		image: "/generated/compendium/items/item-p4-6.webp",
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
		weight: 1,
		value: 2471,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-7",
		name: "Sanguine Plate",
		description:
			"Hungers for the life force of its wielder. This plate pulses with blood resonance.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/item-p4-7.webp",
		effects: {
			passive: [
				"You gain resistance to slashing damage.",
				"While using this item, your Strength increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 2,
		value: 48439,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals slashing damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-8",
		name: "Abyssal-Hand Cowl",
		description:
			"Absorbs all ambient light. This cowl pulses with void resonance.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-p4-8.webp",
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
		value: 4286,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-9",
		name: "Frozen Cloak",
		description:
			"Extracted from an S-Rank frost gate. This cloak pulses with glacial resonance.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-p4-9.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 3,
		value: 37337,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-10",
		name: "Essence-Core Gauntlets",
		description:
			"A fragment of the original System code. This gauntlets pulses with aetheric resonance.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/item-p4-10.webp",
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
		weight: 3,
		value: 44000,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals force damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-11",
		name: "Core-Forged Circlet",
		description:
			"Heavy enough to level a city block. This circlet pulses with titanic resonance.",
		rarity: "uncommon",
		type: "consumable",
		image: "/generated/compendium/items/item-p4-11.webp",
		effects: {
			passive: [
				"You gain resistance to bludgeoning damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 4,
		value: 23003,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-12",
		name: "Flesh-Stitcher Cloak",
		description:
			"Strengthens with every drop of mana spilled. This cloak pulses with blood resonance.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-p4-12.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Strength increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 5,
		value: 4194,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-13",
		name: "Nightfall Plate",
		description:
			"Whispers in the tongue of the Monarchs. This plate pulses with void resonance.",
		rarity: "epic",
		type: "wand",
		image: "/generated/compendium/items/item-p4-13.webp",
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
		weight: 3,
		value: 32289,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-14",
		name: "Static Plate",
		description:
			"Recovered during a Mana-Resonance event. This plate pulses with storm resonance.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/item-p4-14.webp",
		effects: {
			passive: [
				"You gain resistance to thunder damage.",
				"While using this item, your Intelligence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 2,
		value: 32233,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals thunder damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-15",
		name: "Storm-Caller Vial",
		description:
			"Crackles with residual kinetic energy. This vial pulses with storm resonance.",
		rarity: "legendary",
		type: "accessory",
		image: "/generated/compendium/items/item-p4-15.webp",
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
		weight: 2,
		value: 33850,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-16",
		name: "Light-Bringer Rod",
		description:
			"Forged in the heart of a dying sun. This rod pulses with solar resonance.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/item-p4-16.webp",
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
		value: 43444,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals fire damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-17",
		name: "Flesh-Stitcher Rod",
		description:
			"Strengthens with every drop of mana spilled. This rod pulses with blood resonance.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/item-p4-17.webp",
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
		value: 49164,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-18",
		name: "Umbral Cowl",
		description:
			"Recovered from the depths of a Shadow Rift. This cowl pulses with void resonance.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-p4-18.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 1,
		value: 39941,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-19",
		name: "Shadow-Veined Circlet",
		description:
			"Recovered from the depths of a Shadow Rift. This circlet pulses with void resonance.",
		rarity: "uncommon",
		type: "scroll",
		image: "/generated/compendium/items/item-p4-19.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 5,
		value: 16462,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-20",
		name: "Winter-Blight Band",
		description:
			"Solid water that never melts. This band pulses with glacial resonance.",
		rarity: "legendary",
		type: "wand",
		image: "/generated/compendium/items/item-p4-20.webp",
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
		value: 23397,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-21",
		name: "Flesh-Stitcher Vial",
		description:
			"Hungers for the life force of its wielder. This vial pulses with blood resonance.",
		rarity: "epic",
		type: "consumable",
		image: "/generated/compendium/items/item-p4-21.webp",
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
		weight: 5,
		value: 25987,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-22",
		name: "Spatial-Shard Necklace",
		description:
			"Discovered in a stable Rift fracture. This necklace pulses with aetheric resonance.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-p4-22.webp",
		effects: {
			passive: [
				"You gain resistance to psychic damage.",
				"While using this item, your Sense increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 5,
		value: 22646,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-23",
		name: "Grave-Walker Cloak",
		description:
			"Whispers in the tongue of the Monarchs. This cloak pulses with void resonance.",
		rarity: "common",
		type: "accessory",
		image: "/generated/compendium/items/item-p4-23.webp",
		effects: {
			passive: [
				"You gain resistance to psychic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 5,
		value: 50699,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-24",
		name: "Light-Bringer Cowl",
		description:
			"Found in a solar-synchronized floating gate. This cowl pulses with solar resonance.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/item-p4-24.webp",
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
		weight: 3,
		value: 47489,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals fire damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-25",
		name: "Thunder-Clap Band",
		description:
			"Crackles with residual kinetic energy. This band pulses with storm resonance.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-p4-25.webp",
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
		weight: 4,
		value: 37634,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-26",
		name: "Cryo-Steel Necklace",
		description:
			"Extracted from an S-Rank frost gate. This necklace pulses with glacial resonance.",
		rarity: "rare",
		type: "wand",
		image: "/generated/compendium/items/item-p4-26.webp",
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
		value: 47568,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-27",
		name: "Crimson-Pact Greatsword",
		description:
			"Strengthens with every drop of mana spilled. This greatsword pulses with blood resonance.",
		rarity: "very_rare",
		type: "consumable",
		image: "/generated/compendium/items/item-p4-27.webp",
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
		value: 37958,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-28",
		name: "Stone-Skin Cloak",
		description:
			"Inscribed with the gravity-runes of a Titan. This cloak pulses with titanic resonance.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-p4-28.webp",
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
		weight: 4,
		value: 48331,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-29",
		name: "Sanguine Vial",
		description:
			"Strengthens with every drop of mana spilled. This vial pulses with blood resonance.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/item-p4-29.webp",
		effects: {
			passive: [
				"You gain resistance to slashing damage.",
				"While using this item, your Strength increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 4,
		value: 15488,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals slashing damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p4-30",
		name: "Ice-Veined Necklace",
		description:
			"Cold enough to freeze the blood in mid-air. This necklace pulses with glacial resonance.",
		rarity: "very_rare",
		type: "armor",
		image: "/generated/compendium/items/item-p4-30.webp",
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
		value: 42642,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
];
