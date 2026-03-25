// Items Compendium - Part 4
// Generated with full admin privileges
// System Ascendant themed items with images

export const items = [
	{
		id: "item-0601",
		name: "Shadow Saber of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0601.webp",
		stats: {
			attack: 184,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 63809,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 63809,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0602",
		name: "Eternal Vest of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0602.webp",
		stats: {
			defense: 115,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 27625,
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
			value: 27625,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0603",
		name: "Void Stim of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0603.webp",
		stats: {
			health: 487,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 61472,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 61472,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0604",
		name: "Abyssal Bracer of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0604.webp",
		stats: {
			mana: 157,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 9077,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 9077,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0605",
		name: "Demonic Tablet of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0605.webp",
		stats: {
			mana: 104,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 1695,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 1695,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0606",
		name: "Celestial Blade of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0606.webp",
		stats: {
			attack: 242,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 41884,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 41884,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0607",
		name: "Divine Mail of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0607.webp",
		stats: {
			defense: 106,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 34479,
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
			value: 34479,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0608",
		name: "Ancient Vial of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0608.webp",
		stats: {
			health: 329,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 11030,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 11030,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0609",
		name: "Forgotten Circlet of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0609.webp",
		stats: {
			mana: 99,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 90069,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 90069,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0610",
		name: "Cursed Script of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0610.webp",
		stats: {
			mana: 177,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 62508,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 62508,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0611",
		name: "Blessed Bow of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0611.webp",
		stats: {
			attack: 167,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 67567,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 67567,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0612",
		name: "Sacred Plate of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0612.webp",
		stats: {
			defense: 176,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 77804,
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
			value: 77804,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0613",
		name: "Profane Elixir of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0613.webp",
		stats: {
			health: 340,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 77145,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 77145,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0614",
		name: "Mystic Amulet of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0614.webp",
		stats: {
			mana: 96,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 59689,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 59689,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0615",
		name: "Arcane Protocol of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0615.webp",
		stats: {
			mana: 105,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 71380,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 71380,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0616",
		name: "Infernal Staff of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0616.webp",
		stats: {
			attack: 52,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 31595,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 31595,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0617",
		name: "Frozen Cuirass of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0617.webp",
		stats: {
			defense: 135,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 77036,
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
			value: 77036,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0618",
		name: "Thunder Essence of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0618.webp",
		stats: {
			health: 505,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 99520,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 99520,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0619",
		name: "Holy Ring of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0619.webp",
		stats: {
			mana: 239,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 63612,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 63612,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0620",
		name: "Dark Neural Chip of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0620.webp",
		stats: {
			mana: 243,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 82731,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 82731,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0621",
		name: "Shadow Shield of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0621.webp",
		stats: {
			attack: 137,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 89022,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 89022,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0622",
		name: "Eternal Shield of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0622.webp",
		stats: {
			defense: 209,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 1840,
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
			value: 1840,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0623",
		name: "Void Capsule of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0623.webp",
		stats: {
			health: 554,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 81254,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 81254,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0624",
		name: "Abyssal Pendant of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0624.webp",
		stats: {
			mana: 226,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 90159,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 90159,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0625",
		name: "Demonic Data Slate of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0625.webp",
		stats: {
			mana: 78,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 6406,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 6406,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0626",
		name: "Celestial Shield of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0626.webp",
		stats: {
			attack: 90,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 58430,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 58430,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0627",
		name: "Divine Shield of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0627.webp",
		stats: {
			defense: 82,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 76152,
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
				"Grants resistance to one elemental damage type while attuned",
				"Reduces damage from critical hits by your proficiency bonus",
			],
			value: 76152,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0628",
		name: "Ancient Core of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0628.webp",
		stats: {
			health: 138,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 61423,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 61423,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0629",
		name: "Forgotten Earring of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0629.webp",
		stats: {
			mana: 97,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 86255,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 86255,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0630",
		name: "Cursed Scroll of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0630.webp",
		stats: {
			mana: 214,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 95353,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 95353,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0631",
		name: "Blessed Shield of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0631.webp",
		stats: {
			attack: 169,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 6566,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 6566,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0632",
		name: "Sacred Shield of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0632.webp",
		stats: {
			defense: 193,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 98816,
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
			value: 98816,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0633",
		name: "Profane Stim of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0633.webp",
		stats: {
			health: 316,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 44506,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 44506,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0634",
		name: "Mystic Bracer of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0634.webp",
		stats: {
			mana: 159,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 82960,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 82960,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0635",
		name: "Arcane Tablet of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0635.webp",
		stats: {
			mana: 217,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 55266,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
			],
			value: 55266,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0636",
		name: "Infernal Shield of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0636.webp",
		stats: {
			attack: 220,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 53293,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 53293,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0637",
		name: "Frozen Shield of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0637.webp",
		stats: {
			defense: 211,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 6128,
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
			value: 6128,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0638",
		name: "Thunder Vial of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0638.webp",
		stats: {
			health: 365,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 3832,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
				"Removes one condition affecting the user",
			],
			value: 3832,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0639",
		name: "Holy Circlet of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0639.webp",
		stats: {
			mana: 149,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 29025,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 29025,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0640",
		name: "Dark Script of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0640.webp",
		stats: {
			mana: 194,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 2654,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
			],
			value: 2654,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0641",
		name: "Shadow Bow of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0641.webp",
		stats: {
			attack: 207,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 74476,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 74476,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0642",
		name: "Eternal Plate of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0642.webp",
		stats: {
			defense: 50,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 30546,
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
			value: 30546,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0643",
		name: "Void Elixir of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0643.webp",
		stats: {
			health: 116,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 78613,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Grants advantage on ability checks for 1 hour",
				"Removes one condition affecting the user",
			],
			value: 78613,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0644",
		name: "Abyssal Amulet of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0644.webp",
		stats: {
			mana: 143,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 22496,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 22496,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0645",
		name: "Demonic Protocol of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0645.webp",
		stats: {
			mana: 62,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 36305,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 36305,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0646",
		name: "Celestial Staff of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0646.webp",
		stats: {
			attack: 195,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 31933,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 31933,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0647",
		name: "Divine Cuirass of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0647.webp",
		stats: {
			defense: 183,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 23367,
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
			value: 23367,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0648",
		name: "Ancient Essence of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0648.webp",
		stats: {
			health: 186,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 23986,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 23986,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0649",
		name: "Forgotten Ring of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0649.webp",
		stats: {
			mana: 161,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 32647,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 32647,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0650",
		name: "Cursed Neural Chip of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0650.webp",
		stats: {
			mana: 57,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 14747,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
			],
			value: 14747,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0651",
		name: "Blessed Warhammer of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0651.webp",
		stats: {
			attack: 152,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 69055,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 69055,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0652",
		name: "Sacred Shrouds of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0652.webp",
		stats: {
			defense: 100,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 31568,
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
			value: 31568,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0653",
		name: "Profane Capsule of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0653.webp",
		stats: {
			health: 146,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 69071,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 69071,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0654",
		name: "Mystic Pendant of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0654.webp",
		stats: {
			mana: 218,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 36405,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 36405,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0655",
		name: "Arcane Data Slate of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0655.webp",
		stats: {
			mana: 194,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 82881,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 82881,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0656",
		name: "Infernal Dagger of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0656.webp",
		stats: {
			attack: 200,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 13528,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 13528,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0657",
		name: "Frozen Raiment of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0657.webp",
		stats: {
			defense: 210,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 57462,
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
			value: 57462,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0658",
		name: "Thunder Core of the Umbral Regent",
		description:
			"A specialized piece of gear recovered from a boss-tier shadow entity. Exceptional craftsmanship. This consumable was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0658.webp",
		stats: {
			health: 473,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 10967,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 10967,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0659",
		name: "Holy Earring of the Umbral Regent",
		description:
			"A legendary-class artifact with unique System signatures. Extremely rare outside of S-Rank gates. This accessory was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/item-0659.webp",
		stats: {
			mana: 51,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 45682,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 45682,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0660",
		name: "Dark Scroll of the Umbral Regent",
		description:
			"A unique System masterpiece. Only a handful exist in the known world, each bonded to historical events. This scroll was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0660.webp",
		stats: {
			mana: 201,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 19783,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 19783,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0681",
		name: "Shadow Warhammer of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0681.webp",
		stats: {
			attack: 139,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 79362,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 79362,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0682",
		name: "Eternal Shrouds of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0682.webp",
		stats: {
			defense: 119,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 84633,
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
			value: 84633,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0686",
		name: "Celestial Dagger of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0686.webp",
		stats: {
			attack: 89,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 58920,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 58920,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0687",
		name: "Divine Raiment of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0687.webp",
		stats: {
			defense: 50,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 93576,
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
			value: 93576,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0691",
		name: "Blessed Saber of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0691.webp",
		stats: {
			attack: 68,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 71169,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 71169,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0692",
		name: "Sacred Vest of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0692.webp",
		stats: {
			defense: 157,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 44723,
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
			value: 44723,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0696",
		name: "Infernal Blade of the Umbral Regent",
		description:
			"A standard-issue System shadow entity often found in lower-rank gates. This weapon was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0696.webp",
		stats: {
			attack: 228,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 83919,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 83919,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0697",
		name: "Frozen Mail of the Umbral Regent",
		description:
			"An enhanced item resonating with moderate gate energy. Reliable and efficient. This armor was recovered from the depths of an Umbral Gate. It pulses with shadow energy.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0697.webp",
		stats: {
			defense: 177,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 46598,
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
			value: 46598,
		},
		source: "System Ascendant Canon",
	},
];
