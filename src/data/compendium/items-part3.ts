// Items Compendium - Part 3
// Generated with full admin privileges
// System Ascendant themed items with images

import type { Item } from "./items";

export const items = [
	{
		id: "item-0401",
		name: "Shadow Bow of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0401.webp",
		stats: {
			attack: 177,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 16847,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 16847,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0402",
		name: "Eternal Plate of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0402.webp",
		stats: {
			defense: 122,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 85764,
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
				"Reduces damage from critical hits by your proficiency bonus",
			],
			value: 85764,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0403",
		name: "Void Elixir of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0403.webp",
		stats: {
			health: 397,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 19819,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 19819,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0404",
		name: "Abyssal Amulet of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0404.webp",
		stats: {
			mana: 91,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 50852,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 50852,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0405",
		name: "Demonic Protocol of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0405.webp",
		stats: {
			mana: 214,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 95981,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 95981,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0406",
		name: "Celestial Staff of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0406.webp",
		stats: {
			attack: 206,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 29806,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 29806,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0407",
		name: "Divine Cuirass of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0407.webp",
		stats: {
			defense: 190,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 72656,
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
				"Grants advantage on saving throws against one damage type",
			],
			value: 72656,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0408",
		name: "Ancient Essence of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0408.webp",
		stats: {
			health: 372,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 94492,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Removes one condition affecting the user",
			],
			value: 94492,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0409",
		name: "Forgotten Ring of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0409.webp",
		stats: {
			mana: 236,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 12821,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 12821,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0410",
		name: "Cursed Neural Chip of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0410.webp",
		stats: {
			mana: 196,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 86910,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 86910,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0411",
		name: "Blessed Warhammer of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0411.webp",
		stats: {
			attack: 239,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 6823,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 6823,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0412",
		name: "Sacred Shrouds of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0412.webp",
		stats: {
			defense: 238,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 46999,
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
				"The armor adjusts to fit perfectly, imposing no stealth disadvantage",
			],
			value: 46999,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0413",
		name: "Profane Capsule of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0413.webp",
		stats: {
			health: 395,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 42069,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 42069,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0414",
		name: "Mystic Pendant of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0414.webp",
		stats: {
			mana: 196,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 48865,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 48865,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0415",
		name: "Arcane Data Slate of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0415.webp",
		stats: {
			mana: 226,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 6384,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
			],
			value: 6384,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0416",
		name: "Infernal Dagger of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0416.webp",
		stats: {
			attack: 176,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 86729,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 86729,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0417",
		name: "Frozen Raiment of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0417.webp",
		stats: {
			defense: 131,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 100954,
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
			value: 100954,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0418",
		name: "Thunder Core of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0418.webp",
		stats: {
			health: 248,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 12267,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 12267,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0419",
		name: "Holy Earring of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0419.webp",
		stats: {
			mana: 184,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 40950,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 40950,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0420",
		name: "Dark Scroll of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0420.webp",
		stats: {
			mana: 196,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 10414,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 10414,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0421",
		name: "Shadow Saber of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0421.webp",
		stats: {
			attack: 166,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 46763,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 46763,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0422",
		name: "Eternal Vest of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0422.webp",
		stats: {
			defense: 107,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 68933,
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
				"The armor adjusts to fit perfectly, imposing no stealth disadvantage",
			],
			value: 68933,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0423",
		name: "Void Stim of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0423.webp",
		stats: {
			health: 207,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 28664,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 28664,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0424",
		name: "Abyssal Bracer of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0424.webp",
		stats: {
			mana: 90,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 42601,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 42601,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0425",
		name: "Demonic Tablet of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0425.webp",
		stats: {
			mana: 123,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 37418,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 37418,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0426",
		name: "Celestial Blade of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0426.webp",
		stats: {
			attack: 103,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 92493,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 92493,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0427",
		name: "Divine Mail of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0427.webp",
		stats: {
			defense: 113,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 16462,
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
				"Grants advantage on saving throws against one damage type",
			],
			value: 16462,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0428",
		name: "Ancient Vial of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0428.webp",
		stats: {
			health: 558,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 45408,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
			],
			value: 45408,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0429",
		name: "Forgotten Circlet of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0429.webp",
		stats: {
			mana: 111,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 50858,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 50858,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0430",
		name: "Cursed Script of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0430.webp",
		stats: {
			mana: 155,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 12907,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
			],
			value: 12907,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0431",
		name: "Blessed Bow of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0431.webp",
		stats: {
			attack: 170,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 13147,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 13147,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0432",
		name: "Sacred Plate of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0432.webp",
		stats: {
			defense: 100,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 92056,
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
				"Reduces damage from critical hits by your proficiency bonus",
			],
			value: 92056,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0433",
		name: "Profane Elixir of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0433.webp",
		stats: {
			health: 259,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 99925,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 99925,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0434",
		name: "Mystic Amulet of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0434.webp",
		stats: {
			mana: 129,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 5149,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 5149,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0435",
		name: "Arcane Protocol of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0435.webp",
		stats: {
			mana: 198,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 50657,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 50657,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0436",
		name: "Infernal Staff of Kael",
		description:
			"A standard-issue System construct often found in lower-rank gates. This weapon was recovered from the depths of the System.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0436.webp",
		stats: {
			attack: 212,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 77021,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 77021,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0437",
		name: "Frozen Cuirass of Kael",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of the System.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0437.webp",
		stats: {
			defense: 99,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 28037,
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
				"Reduces damage from critical hits by your proficiency bonus",
			],
			value: 28037,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0438",
		name: "Thunder Essence of Kael",
		description:
			"A specialized piece of gear recovered from a boss-tier construct. Exceptional craftsmanship. This consumable was recovered from the depths of the System.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0438.webp",
		stats: {
			health: 457,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 93308,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 93308,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0439",
		name: "Holy Ring of Kael",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of the System.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0439.webp",
		stats: {
			mana: 193,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 86193,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 86193,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0440",
		name: "Dark Neural Chip of Kael",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of the System.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0440.webp",
		stats: {
			mana: 140,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 53691,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 53691,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0441",
		name: "Shadow Warhammer of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0441.webp",
		stats: {
			attack: 149,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 52565,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 52565,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0442",
		name: "Eternal Shrouds of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0442.webp",
		stats: {
			defense: 203,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 2862,
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
				"Grants advantage on saving throws against one damage type",
			],
			value: 2862,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0443",
		name: "Void Capsule of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0443.webp",
		stats: {
			health: 425,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 27059,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 27059,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0444",
		name: "Abyssal Pendant of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0444.webp",
		stats: {
			mana: 191,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 83837,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 83837,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0445",
		name: "Demonic Data Slate of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0445.webp",
		stats: {
			mana: 186,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 20912,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 20912,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0446",
		name: "Celestial Dagger of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0446.webp",
		stats: {
			attack: 97,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 57582,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 57582,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0447",
		name: "Divine Raiment of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0447.webp",
		stats: {
			defense: 140,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 48164,
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
			value: 48164,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0448",
		name: "Ancient Core of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0448.webp",
		stats: {
			health: 585,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 95906,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 95906,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0449",
		name: "Forgotten Earring of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0449.webp",
		stats: {
			mana: 160,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 21447,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 21447,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0450",
		name: "Cursed Scroll of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0450.webp",
		stats: {
			mana: 179,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 59189,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 59189,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0451",
		name: "Blessed Saber of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0451.webp",
		stats: {
			attack: 207,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 46362,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 46362,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0452",
		name: "Sacred Vest of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0452.webp",
		stats: {
			defense: 129,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 43768,
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
				"Reduces damage from critical hits by your proficiency bonus",
			],
			value: 43768,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0453",
		name: "Profane Stim of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0453.webp",
		stats: {
			health: 432,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 51337,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 51337,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0454",
		name: "Mystic Bracer of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0454.webp",
		stats: {
			mana: 51,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 65393,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 65393,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0455",
		name: "Arcane Tablet of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0455.webp",
		stats: {
			mana: 54,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 23170,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 23170,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0456",
		name: "Infernal Blade of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0456.webp",
		stats: {
			attack: 158,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 75907,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 75907,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0457",
		name: "Frozen Mail of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0457.webp",
		stats: {
			defense: 184,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 41447,
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
			value: 41447,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0458",
		name: "Thunder Vial of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0458.webp",
		stats: {
			health: 587,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 26277,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants temporary hit points equal to your level for 1 hour",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 26277,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0459",
		name: "Holy Circlet of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0459.webp",
		stats: {
			mana: 105,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 84558,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 84558,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0460",
		name: "Dark Script of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0460.webp",
		stats: {
			mana: 115,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 98253,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 98253,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0461",
		name: "Shadow Bow of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0461.webp",
		stats: {
			attack: 227,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 23285,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 23285,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0462",
		name: "Eternal Plate of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0462.webp",
		stats: {
			defense: 69,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 34309,
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
			value: 34309,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0463",
		name: "Void Elixir of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0463.webp",
		stats: {
			health: 284,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 33198,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Removes one condition affecting the user",
			],
			value: 33198,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0464",
		name: "Abyssal Amulet of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0464.webp",
		stats: {
			mana: 133,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 99072,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 99072,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0465",
		name: "Demonic Protocol of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0465.webp",
		stats: {
			mana: 142,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 87597,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 87597,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0466",
		name: "Celestial Staff of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0466.webp",
		stats: {
			attack: 162,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 91924,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 91924,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0467",
		name: "Divine Cuirass of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0467.webp",
		stats: {
			defense: 146,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 1306,
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
			value: 1306,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0468",
		name: "Ancient Essence of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0468.webp",
		stats: {
			health: 119,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 19545,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Grants temporary hit points equal to your level for 1 hour",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 19545,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0469",
		name: "Forgotten Ring of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0469.webp",
		stats: {
			mana: 102,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 32030,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 32030,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0470",
		name: "Cursed Neural Chip of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0470.webp",
		stats: {
			mana: 233,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 17937,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 17937,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0471",
		name: "Blessed Warhammer of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0471.webp",
		stats: {
			attack: 95,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 76040,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 76040,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0472",
		name: "Sacred Shrouds of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0472.webp",
		stats: {
			defense: 72,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 23118,
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
				"The armor adjusts to fit perfectly, imposing no stealth disadvantage",
			],
			value: 23118,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0473",
		name: "Profane Capsule of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0473.webp",
		stats: {
			health: 398,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 68312,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 68312,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0474",
		name: "Mystic Pendant of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0474.webp",
		stats: {
			mana: 189,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 90808,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 90808,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0475",
		name: "Arcane Data Slate of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0475.webp",
		stats: {
			mana: 189,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 50785,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 50785,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0476",
		name: "Infernal Dagger of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0476.webp",
		stats: {
			attack: 115,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 41808,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 41808,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0477",
		name: "Frozen Raiment of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0477.webp",
		stats: {
			defense: 221,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 75888,
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
				"The armor adjusts to fit perfectly, imposing no stealth disadvantage",
			],
			value: 75888,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0478",
		name: "Thunder Core of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0478.webp",
		stats: {
			health: 166,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 10285,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 10285,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0479",
		name: "Holy Earring of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0479.webp",
		stats: {
			mana: 203,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 69734,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 69734,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0480",
		name: "Dark Scroll of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0480.webp",
		stats: {
			mana: 131,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 51461,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 51461,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0481",
		name: "Shadow Saber of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0481.webp",
		stats: {
			attack: 193,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 98160,
		weight: 1,
		properties: {
			weapon: {
				damage: "1d4",
				damageType: "piercing",
				finesse: true,
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 98160,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0482",
		name: "Eternal Vest of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0482.webp",
		stats: {
			defense: 168,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 25893,
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
				"Reduces damage from critical hits by your proficiency bonus",
			],
			value: 25893,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0483",
		name: "Void Stim of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0483.webp",
		stats: {
			health: 407,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 8892,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 8892,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0484",
		name: "Abyssal Bracer of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0484.webp",
		stats: {
			mana: 179,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 33230,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 33230,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0485",
		name: "Demonic Tablet of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0485.webp",
		stats: {
			mana: 140,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 17401,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 17401,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0486",
		name: "Celestial Blade of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0486.webp",
		stats: {
			attack: 229,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 61601,
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
			value: 61601,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0487",
		name: "Divine Mail of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0487.webp",
		stats: {
			defense: 241,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 10511,
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
				"Reduces damage from critical hits by your proficiency bonus",
			],
			value: 10511,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0488",
		name: "Ancient Vial of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0488.webp",
		stats: {
			health: 425,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 94885,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 94885,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0489",
		name: "Forgotten Circlet of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0489.webp",
		stats: {
			mana: 80,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 85707,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 85707,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0490",
		name: "Cursed Script of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0490.webp",
		stats: {
			mana: 196,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 98159,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
			],
			value: 98159,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0491",
		name: "Blessed Bow of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0491.webp",
		stats: {
			attack: 94,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 8010,
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
			value: 8010,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0492",
		name: "Sacred Plate of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0492.webp",
		stats: {
			defense: 205,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 68519,
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
			value: 68519,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0493",
		name: "Profane Elixir of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0493.webp",
		stats: {
			health: 187,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 4514,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Removes one condition affecting the user",
			],
			value: 4514,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0494",
		name: "Mystic Amulet of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0494.webp",
		stats: {
			mana: 228,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 73771,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 73771,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0495",
		name: "Arcane Protocol of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0495.webp",
		stats: {
			mana: 115,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 26597,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 26597,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0496",
		name: "Infernal Staff of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0496.webp",
		stats: {
			attack: 65,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 70667,
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
			value: 70667,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0497",
		name: "Frozen Cuirass of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0497.webp",
		stats: {
			defense: 228,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 70148,
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
				"Grants advantage on saving throws against one damage type",
			],
			value: 70148,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0498",
		name: "Thunder Essence of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0498.webp",
		stats: {
			health: 174,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 35943,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
			],
			value: 35943,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0499",
		name: "Holy Ring of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0499.webp",
		stats: {
			mana: 230,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 83396,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 83396,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0500",
		name: "Dark Neural Chip of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0500.webp",
		stats: {
			mana: 73,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 36409,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 36409,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
];
