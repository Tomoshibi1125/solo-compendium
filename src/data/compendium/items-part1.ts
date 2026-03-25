// Items Compendium - Part 1
// Generated with full admin privileges
// System Ascendant themed items with images

export const items = [
	{
		id: "item-0001",
		name: "Shadow Saber of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This weapon was recovered from the depths of the System.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/item-0001.webp",
		requirements: {
			class: ["Warrior", "Assassin", "Shadow Reaver"],
		},
		properties: {
			weapon: {
				damage: "1d8 + 2",
				damageType: "slashing",
				versatile: "1d10 + 2",
				finesse: true,
			},
			protocol_enhanced: {
				bonus: {
					attack: 2,
					damage: 2,
				},
				resistance: ["necrotic", "psychic"],
				immunity: ["frightened"],
			},
		},
		effects: {
			passive: [
				"You gain advantage on attack rolls against creatures in dim light or darkness",
				"The weapon deals an additional 1d6 necrotic damage on hit",
				"You can use your reaction to teleport up to 30 feet to an unoccupied space in dim light or darkness when targeted by an attack",
			],
			active: [
				{
					name: "Shadow Strike",
					description:
						"As an action, the blade releases a wave of shadow energy. All creatures in a 15-foot cone must make a DC 18 Constitution saving throw or take 4d8 necrotic damage and be frightened for 1 minute.",
					action: "action",
					frequency: "once-per-day",
				},
			],
			value: 65285,
		},
		attunement: true,
		charges: {
			max: 3,
			current: 3,
			recharge: "dawn",
		},
		weight: 3,
		value: 65285,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0002",
		name: "Eternal Vest of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0002.webp",
		stats: {
			defense: 134,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 78255,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Grants advantage on saving throws against one damage type",
				"The armor adjusts to fit perfectly, imposing no stealth disadvantage",
			],
			value: 78255,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0003",
		name: "Void Stim of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0003.webp",
		stats: {
			health: 496,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 90290,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 90290,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0004",
		name: "Abyssal Bracer of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0004.webp",
		stats: {
			mana: 206,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 8454,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 8454,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0005",
		name: "Demonic Tablet of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0005.webp",
		stats: {
			mana: 194,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 100287,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 100287,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0006",
		name: "Celestial Blade of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0006.webp",
		stats: {
			attack: 108,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 68235,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 68235,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0007",
		name: "Divine Mail of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0007.webp",
		stats: {
			defense: 190,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 36836,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"The armor adjusts to fit perfectly, imposing no stealth disadvantage",
				"You can cast Shield once per long rest while wearing this armor",
			],
			value: 36836,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0008",
		name: "Ancient Vial of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0008.webp",
		stats: {
			health: 302,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 86734,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 86734,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0009",
		name: "Forgotten Circlet of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0009.webp",
		stats: {
			mana: 108,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 3571,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 3571,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0010",
		name: "Cursed Script of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0010.webp",
		stats: {
			mana: 234,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 42455,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 42455,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0011",
		name: "Blessed Bow of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0011.webp",
		stats: {
			attack: 79,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 64016,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 64016,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0012",
		name: "Sacred Plate of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0012.webp",
		stats: {
			defense: 148,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 10313,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Reduces damage from critical hits by your proficiency bonus",
				"You can cast Shield once per long rest while wearing this armor",
			],
			value: 10313,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0013",
		name: "Profane Elixir of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0013.webp",
		stats: {
			health: 524,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 80589,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 80589,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0014",
		name: "Mystic Amulet of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0014.webp",
		stats: {
			mana: 153,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 57376,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 57376,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0015",
		name: "Arcane Protocol of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0015.webp",
		stats: {
			mana: 137,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 86376,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 86376,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0016",
		name: "Infernal Staff of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0016.webp",
		stats: {
			attack: 188,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 35100,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 35100,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0017",
		name: "Frozen Cuirass of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0017.webp",
		stats: {
			defense: 117,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 5925,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Reduces damage from critical hits by your proficiency bonus",
				"Grants advantage on saving throws against one damage type",
			],
			value: 5925,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0018",
		name: "Thunder Essence of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0018.webp",
		stats: {
			health: 264,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 88613,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 88613,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0019",
		name: "Holy Ring of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0019.webp",
		stats: {
			mana: 51,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 56647,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
			],
			value: 56647,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0020",
		name: "Dark Neural Chip of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0020.webp",
		stats: {
			mana: 161,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 59943,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 59943,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0021",
		name: "Shadow Warhammer of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0021.webp",
		stats: {
			attack: 82,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 85846,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 85846,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0022",
		name: "Eternal Shrouds of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0022.webp",
		stats: {
			defense: 94,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 13792,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"You can cast Shield once per long rest while wearing this armor",
				"Grants resistance to one elemental damage type while attuned",
			],
			value: 13792,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0023",
		name: "Void Capsule of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0023.webp",
		stats: {
			health: 478,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 64937,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 64937,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0024",
		name: "Abyssal Pendant of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0024.webp",
		stats: {
			mana: 234,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 2888,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 2888,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0025",
		name: "Demonic Data Slate of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0025.webp",
		stats: {
			mana: 81,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 3629,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 3629,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0026",
		name: "Celestial Dagger of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0026.webp",
		stats: {
			attack: 85,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 43318,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 43318,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0027",
		name: "Divine Raiment of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0027.webp",
		stats: {
			defense: 88,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 9224,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Reduces damage from critical hits by your proficiency bonus",
				"The armor adjusts to fit perfectly, imposing no stealth disadvantage",
			],
			value: 9224,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0028",
		name: "Ancient Core of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0028.webp",
		stats: {
			health: 357,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 51211,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 51211,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0029",
		name: "Forgotten Earring of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0029.webp",
		stats: {
			mana: 230,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 13993,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 13993,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0030",
		name: "Cursed Scroll of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0030.webp",
		stats: {
			mana: 115,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 4632,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 4632,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0031",
		name: "Blessed Saber of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0031.webp",
		stats: {
			attack: 152,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 10804,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 10804,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0032",
		name: "Sacred Vest of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0032.webp",
		stats: {
			defense: 228,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 73474,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Reduces damage from critical hits by your proficiency bonus",
				"You can cast Shield once per long rest while wearing this armor",
			],
			value: 73474,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0033",
		name: "Profane Stim of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0033.webp",
		stats: {
			health: 357,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 7693,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
			],
			value: 7693,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0034",
		name: "Mystic Bracer of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0034.webp",
		stats: {
			mana: 223,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 21758,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 21758,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0035",
		name: "Arcane Tablet of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0035.webp",
		stats: {
			mana: 111,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 26161,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 26161,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0036",
		name: "Infernal Blade of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0036.webp",
		stats: {
			attack: 244,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 22250,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 22250,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0037",
		name: "Frozen Mail of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0037.webp",
		stats: {
			defense: 101,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 16867,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Grants resistance to one elemental damage type while attuned",
				"Reduces damage from critical hits by your proficiency bonus",
			],
			value: 16867,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0038",
		name: "Thunder Vial of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0038.webp",
		stats: {
			health: 562,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 42018,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 42018,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0039",
		name: "Holy Circlet of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0039.webp",
		stats: {
			mana: 69,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 49102,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 49102,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0040",
		name: "Dark Script of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0040.webp",
		stats: {
			mana: 121,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 76441,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 76441,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0041",
		name: "Shadow Bow of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0041.webp",
		stats: {
			attack: 63,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 61004,
		weight: 1,
		properties: {
			weapon: {
				damage: "1d4",
				damageType: "piercing",
				finesse: true,
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 61004,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0042",
		name: "Eternal Plate of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0042.webp",
		stats: {
			defense: 242,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 35278,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Reduces damage from critical hits by your proficiency bonus",
				"Grants resistance to one elemental damage type while attuned",
			],
			value: 35278,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0043",
		name: "Void Elixir of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0043.webp",
		stats: {
			health: 437,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 30303,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 30303,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0044",
		name: "Abyssal Amulet of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0044.webp",
		stats: {
			mana: 161,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 72622,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 72622,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0045",
		name: "Demonic Protocol of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0045.webp",
		stats: {
			mana: 163,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 6999,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 6999,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0046",
		name: "Celestial Staff of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0046.webp",
		stats: {
			attack: 104,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 34067,
		weight: 1,
		properties: {
			weapon: {
				damage: "1d4",
				damageType: "piercing",
				finesse: true,
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 34067,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0047",
		name: "Divine Cuirass of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0047.webp",
		stats: {
			defense: 223,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 57406,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Grants resistance to one elemental damage type while attuned",
				"You can cast Shield once per long rest while wearing this armor",
			],
			value: 57406,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0048",
		name: "Ancient Essence of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0048.webp",
		stats: {
			health: 412,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 41241,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 41241,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0049",
		name: "Forgotten Ring of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0049.webp",
		stats: {
			mana: 181,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 77456,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 77456,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0050",
		name: "Cursed Neural Chip of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0050.webp",
		stats: {
			mana: 208,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 32883,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 32883,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0051",
		name: "Blessed Warhammer of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0051.webp",
		stats: {
			attack: 162,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 75837,
		weight: 1,
		properties: {
			weapon: {
				damage: "1d4",
				damageType: "piercing",
				finesse: true,
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 75837,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0052",
		name: "Sacred Shrouds of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0052.webp",
		stats: {
			defense: 212,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 25151,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Grants resistance to one elemental damage type while attuned",
				"Reduces damage from critical hits by your proficiency bonus",
			],
			value: 25151,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0053",
		name: "Profane Capsule of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0053.webp",
		stats: {
			health: 379,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 23639,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 23639,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0054",
		name: "Mystic Pendant of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0054.webp",
		stats: {
			mana: 81,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 10255,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 10255,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0055",
		name: "Arcane Data Slate of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0055.webp",
		stats: {
			mana: 94,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 90026,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 90026,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0056",
		name: "Infernal Dagger of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0056.webp",
		stats: {
			attack: 85,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 8160,
		weight: 1,
		properties: {
			weapon: {
				damage: "1d4",
				damageType: "piercing",
				finesse: true,
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 8160,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0057",
		name: "Frozen Raiment of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0057.webp",
		stats: {
			defense: 232,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 38722,
		weight: 20,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Grants resistance to one elemental damage type while attuned",
				"You can cast Shield once per long rest while wearing this armor",
			],
			value: 38722,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0058",
		name: "Thunder Core of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0058.webp",
		stats: {
			health: 414,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 42188,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 42188,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0059",
		name: "Holy Earring of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0059.webp",
		stats: {
			mana: 50,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 8707,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 8707,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0060",
		name: "Dark Scroll of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0060.webp",
		stats: {
			mana: 226,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 42138,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 42138,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0181",
		name: "Shadow Shield of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0181.webp",
		stats: {
			attack: 133,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 11148,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 11148,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0182",
		name: "Eternal Shield of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0182.webp",
		stats: {
			defense: 109,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 38234,
		weight: 6,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"You can cast Shield once per long rest while wearing this armor",
				"Grants advantage on saving throws against one damage type",
			],
			value: 38234,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0186",
		name: "Celestial Shield of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0186.webp",
		stats: {
			attack: 122,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 26430,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 26430,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0187",
		name: "Divine Shield of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0187.webp",
		stats: {
			defense: 220,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 88024,
		weight: 6,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Grants advantage on saving throws against one damage type",
				"Reduces damage from critical hits by your proficiency bonus",
			],
			value: 88024,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0191",
		name: "Blessed Shield of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0191.webp",
		stats: {
			attack: 103,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 40424,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 40424,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0192",
		name: "Sacred Shield of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0192.webp",
		stats: {
			defense: 230,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 91585,
		weight: 6,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"You can cast Shield once per long rest while wearing this armor",
				"Grants resistance to one elemental damage type while attuned",
			],
			value: 91585,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0196",
		name: "Infernal Shield of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0196.webp",
		stats: {
			attack: 168,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 100479,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 100479,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0197",
		name: "Frozen Shield of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0197.webp",
		stats: {
			defense: 197,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 58442,
		weight: 6,
		properties: {
			protocol_enhanced: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"You can cast Shield once per long rest while wearing this armor",
				"Grants resistance to one elemental damage type while attuned",
			],
			value: 58442,
		},
		source: "System Ascendant Canon",
	},
];
