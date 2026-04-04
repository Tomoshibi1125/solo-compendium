export const items = [
	{
		id: "item-p7-1",
		name: "Bolt-Struck Band",
		description:
			"Fast as a blink of an eye. This band pulses with storm resonance.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-p7-1.webp",
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
		value: 14530,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-2",
		name: "Shadow-Veined Rod",
		description:
			"Whispers in the tongue of the Monarchs. This rod pulses with void resonance.",
		rarity: "epic",
		type: "scroll",
		image: "/generated/compendium/items/item-p7-2.webp",
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
		value: 50924,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-3",
		name: "Arctic-Shard Rod",
		description:
			"Solid water that never melts. This rod pulses with glacial resonance.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/item-p7-3.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 2,
		value: 32921,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-4",
		name: "Lightning-Carved Greatsword",
		description:
			"Crackles with residual kinetic energy. This greatsword pulses with storm resonance.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-p7-4.webp",
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
		value: 33874,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals lightning damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-5",
		name: "Mountain-Soul Rod",
		description:
			"Immune to all base-level kinetic force. This rod pulses with titanic resonance.",
		rarity: "rare",
		type: "wand",
		image: "/generated/compendium/items/item-p7-5.webp",
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
		value: 35698,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-6",
		name: "Granite Vial",
		description:
			"Inscribed with the gravity-runes of a Titan. This vial pulses with titanic resonance.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/item-p7-6.webp",
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
		weight: 5,
		value: 32119,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-7",
		name: "Aurelian Cloak",
		description:
			"Found in a solar-synchronized floating gate. This cloak pulses with solar resonance.",
		rarity: "common",
		type: "wand",
		image: "/generated/compendium/items/item-p7-7.webp",
		effects: {
			passive: [
				"You gain resistance to fire damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 2,
		value: 48828,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals fire damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-8",
		name: "Void-Touched Shield",
		description:
			"Whispers in the tongue of the Monarchs. This shield pulses with void resonance.",
		rarity: "legendary",
		type: "accessory",
		image: "/generated/compendium/items/item-p7-8.webp",
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
		value: 16338,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-9",
		name: "Frost-Bound Circlet",
		description:
			"Cold enough to freeze the blood in mid-air. This circlet pulses with glacial resonance.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/item-p7-9.webp",
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
		value: 31671,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-10",
		name: "Sanguine Plate",
		description:
			"A dark soul-contract made in blood. This plate pulses with blood resonance.",
		rarity: "very_rare",
		type: "weapon",
		image: "/generated/compendium/items/item-p7-10.webp",
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
		weight: 1,
		value: 26396,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals slashing damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-11",
		name: "Frost-Bound Vial",
		description:
			"Cold enough to freeze the blood in mid-air. This vial pulses with glacial resonance.",
		rarity: "common",
		type: "accessory",
		image: "/generated/compendium/items/item-p7-11.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 5,
		value: 4309,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-12",
		name: "Lightning-Carved Vial",
		description:
			"Crackles with residual kinetic energy. This vial pulses with storm resonance.",
		rarity: "very_rare",
		type: "armor",
		image: "/generated/compendium/items/item-p7-12.webp",
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
		weight: 2,
		value: 16773,
		source: "System Ascendant Canon",
		lore: "Dating back to the Storm Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Storm.",
		mechanics: {
			system_interaction:
				"Deals thunder damage and requires a DC 15 Agility Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-13",
		name: "Dredge Boots",
		description:
			"Whispers in the tongue of the Monarchs. This boots pulses with void resonance.",
		rarity: "common",
		type: "accessory",
		image: "/generated/compendium/items/item-p7-13.webp",
		effects: {
			passive: [
				"You gain resistance to psychic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 4,
		value: 44510,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-14",
		name: "Dawn-Guard Cloak",
		description:
			"Found in a solar-synchronized floating gate. This cloak pulses with solar resonance.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/item-p7-14.webp",
		effects: {
			passive: [
				"You gain resistance to radiant damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 4,
		value: 48201,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals radiant damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-15",
		name: "Umbral Gauntlets",
		description:
			"Absorbs all ambient light. This gauntlets pulses with void resonance.",
		rarity: "common",
		type: "scroll",
		image: "/generated/compendium/items/item-p7-15.webp",
		effects: {
			passive: [
				"You gain resistance to psychic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 1,
		value: 24220,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-16",
		name: "Grave-Walker Greatsword",
		description:
			"Recovered from the depths of a Shadow Rift. This greatsword pulses with void resonance.",
		rarity: "uncommon",
		type: "accessory",
		image: "/generated/compendium/items/item-p7-16.webp",
		effects: {
			passive: [
				"You gain resistance to psychic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 4,
		value: 47740,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-17",
		name: "Crimson-Pact Circlet",
		description:
			"Strengthens with every drop of mana spilled. This circlet pulses with blood resonance.",
		rarity: "very_rare",
		type: "weapon",
		image: "/generated/compendium/items/item-p7-17.webp",
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
		weight: 1,
		value: 18947,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals slashing damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-18",
		name: "Basalt Gauntlets",
		description:
			"Immune to all base-level kinetic force. This gauntlets pulses with titanic resonance.",
		rarity: "very_rare",
		type: "accessory",
		image: "/generated/compendium/items/item-p7-18.webp",
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
		weight: 5,
		value: 25090,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-19",
		name: "Earth-Crusher Vial",
		description:
			"Heavy enough to level a city block. This vial pulses with titanic resonance.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-p7-19.webp",
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
		value: 15700,
		source: "System Ascendant Canon",
		lore: "Dating back to the Titanic Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Titanic.",
		mechanics: {
			system_interaction:
				"Deals bludgeoning damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-20",
		name: "Nightfall Greatsword",
		description:
			"Recovered from the depths of a Shadow Rift. This greatsword pulses with void resonance.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-p7-20.webp",
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
		value: 50183,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals psychic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-21",
		name: "Mana-Flow Greatsword",
		description:
			"Bypasses the dimensional divide entirely. This greatsword pulses with aetheric resonance.",
		rarity: "common",
		type: "wand",
		image: "/generated/compendium/items/item-p7-21.webp",
		effects: {
			passive: [
				"You gain resistance to force damage.",
				"While using this item, your Sense increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 3,
		value: 32723,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals force damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-22",
		name: "Light-Bringer Necklace",
		description:
			"Found in a solar-synchronized floating gate. This necklace pulses with solar resonance.",
		rarity: "very_rare",
		type: "accessory",
		image: "/generated/compendium/items/item-p7-22.webp",
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
		value: 28034,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals radiant damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-23",
		name: "Cryo-Steel Necklace",
		description:
			"Cold enough to freeze the blood in mid-air. This necklace pulses with glacial resonance.",
		rarity: "uncommon",
		type: "consumable",
		image: "/generated/compendium/items/item-p7-23.webp",
		effects: {
			passive: [
				"You gain resistance to cold damage.",
				"While using this item, your Vitality increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 1,
		value: 33703,
		source: "System Ascendant Canon",
		lore: "Dating back to the Glacial Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Glacial.",
		mechanics: {
			system_interaction:
				"Deals cold damage and requires a DC 15 Strength Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-24",
		name: "Reaver Band",
		description:
			"Hungers for the life force of its wielder. This band pulses with blood resonance.",
		rarity: "very_rare",
		type: "scroll",
		image: "/generated/compendium/items/item-p7-24.webp",
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
		value: 32819,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-25",
		name: "Heart-Linked Vial",
		description:
			"Hungers for the life force of its wielder. This vial pulses with blood resonance.",
		rarity: "common",
		type: "accessory",
		image: "/generated/compendium/items/item-p7-25.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Strength increases by 1.",
			],
			active: [],
		},
		attunement: false,
		weight: 1,
		value: 28623,
		source: "System Ascendant Canon",
		lore: "Dating back to the Blood Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Blood.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-26",
		name: "Nightfall Blade",
		description:
			"Absorbs all ambient light. This blade pulses with void resonance.",
		rarity: "uncommon",
		type: "accessory",
		image: "/generated/compendium/items/item-p7-26.webp",
		effects: {
			passive: [
				"You gain resistance to necrotic damage.",
				"While using this item, your Presence increases by 1.",
			],
			active: [],
		},
		attunement: true,
		weight: 1,
		value: 26111,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-27",
		name: "Umbral Gauntlets",
		description:
			"Recovered from the depths of a Shadow Rift. This gauntlets pulses with void resonance.",
		rarity: "rare",
		type: "wand",
		image: "/generated/compendium/items/item-p7-27.webp",
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
		weight: 1,
		value: 35369,
		source: "System Ascendant Canon",
		lore: "Dating back to the Void Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Void.",
		mechanics: {
			system_interaction:
				"Deals necrotic damage and requires a DC 15 Sense Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-28",
		name: "Spatial-Shard Necklace",
		description:
			"A fragment of the original System code. This necklace pulses with aetheric resonance.",
		rarity: "epic",
		type: "scroll",
		image: "/generated/compendium/items/item-p7-28.webp",
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
		value: 24076,
		source: "System Ascendant Canon",
		lore: "Dating back to the Aetheric Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Aetheric.",
		mechanics: {
			system_interaction:
				"Deals force damage and requires a DC 15 Intelligence Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-29",
		name: "Solar-Forged Rod",
		description:
			"Blinds those with unworthy souls. This rod pulses with solar resonance.",
		rarity: "epic",
		type: "wand",
		image: "/generated/compendium/items/item-p7-29.webp",
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
		weight: 1,
		value: 29067,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals fire damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
	{
		id: "item-p7-30",
		name: "Radiant-Steel Shield",
		description:
			"Forged in the heart of a dying sun. This shield pulses with solar resonance.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-p7-30.webp",
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
		value: 10547,
		source: "System Ascendant Canon",
		lore: "Dating back to the Solar Resonance event, several high-tier hunters reported these manifesting in the depths of red gates.",
		flavor: "The dimensional divide shudders in the presence of the Solar.",
		mechanics: {
			system_interaction:
				"Deals fire damage and requires a DC 15 Vitality Decree check to resist secondary effects.",
		},
	},
];
