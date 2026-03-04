// Items Compendium - Part 4
// Generated with full admin privileges
// System Ascendant themed items with images

import type { Item } from "./items";

export const items: Item[] = [
	{
		id: "item-0601",
		name: "Shadow Armor of the Umbral Regent",
		description:
			"An ancient weapon recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Eternal Armor of the Umbral Regent",
		description:
			"An forged armor recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Void Armor of the Umbral Regent",
		description:
			"An awakened consumable recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Abyssal Armor of the Umbral Regent",
		description:
			"An crafted accessory recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Demonic Armor of the Umbral Regent",
		description:
			"An ancient scroll recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
		name: "Celestial Armor of the Umbral Regent",
		description:
			"An forged weapon recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Divine Armor of the Umbral Regent",
		description:
			"An forged armor recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Ancient Armor of the Umbral Regent",
		description:
			"An imbued consumable recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Forgotten Armor of the Umbral Regent",
		description:
			"An crafted accessory recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Cursed Armor of the Umbral Regent",
		description:
			"An blessed scroll recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
		name: "Blessed Armor of the Umbral Regent",
		description:
			"An ancient weapon recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Sacred Armor of the Umbral Regent",
		description:
			"An cursed armor recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Profane Armor of the Umbral Regent",
		description:
			"An ancient consumable recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Mystic Armor of the Umbral Regent",
		description:
			"An forged accessory recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Arcane Armor of the Umbral Regent",
		description:
			"An awakened scroll recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
		name: "Infernal Armor of the Umbral Regent",
		description:
			"An cursed weapon recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Frozen Armor of the Umbral Regent",
		description:
			"An enchanted armor recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Thunder Armor of the Umbral Regent",
		description:
			"An blessed consumable recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Holy Armor of the Umbral Regent",
		description:
			"An crafted accessory recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
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
		name: "Dark Armor of the Umbral Regent",
		description:
			"An cursed scroll recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
			"An cursed weapon recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
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
			"An crafted armor recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Void Shield of the Umbral Regent",
		description:
			"An imbued consumable recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Abyssal Shield of the Umbral Regent",
		description:
			"An forged accessory recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Demonic Shield of the Umbral Regent",
		description:
			"An imbued scroll recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
			"An awakened weapon recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
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
			"An blessed armor recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Ancient Shield of the Umbral Regent",
		description:
			"An crafted consumable recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Forgotten Shield of the Umbral Regent",
		description:
			"An cursed accessory recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
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
		name: "Cursed Shield of the Umbral Regent",
		description:
			"An crafted scroll recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
			"An ancient weapon recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
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
			"An enchanted armor recovered from a legendary ascendant's collection. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Profane Shield of the Umbral Regent",
		description:
			"An imbued consumable recovered from a legendary ascendant's collection. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Mystic Shield of the Umbral Regent",
		description:
			"An imbued accessory recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Arcane Shield of the Umbral Regent",
		description:
			"An awakened scroll recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
			"An cursed weapon recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
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
			"An blessed armor recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Thunder Shield of the Umbral Regent",
		description:
			"An blessed consumable recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Holy Shield of the Umbral Regent",
		description:
			"An cursed accessory recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Dark Shield of the Umbral Regent",
		description:
			"An awakened scroll recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
		name: "Shadow Helmet of the Umbral Regent",
		description:
			"An imbued weapon recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Eternal Helmet of the Umbral Regent",
		description:
			"An imbued armor recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Void Helmet of the Umbral Regent",
		description:
			"An blessed consumable recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Abyssal Helmet of the Umbral Regent",
		description:
			"An forged accessory recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Demonic Helmet of the Umbral Regent",
		description:
			"An blessed scroll recovered from the depths of an A-rank gate. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
		name: "Celestial Helmet of the Umbral Regent",
		description:
			"An crafted weapon recovered from a legendary ascendant's collection. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Divine Helmet of the Umbral Regent",
		description:
			"An enchanted armor recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Ancient Helmet of the Umbral Regent",
		description:
			"An enchanted consumable recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Forgotten Helmet of the Umbral Regent",
		description:
			"An blessed accessory recovered from a legendary ascendant's collection. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
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
		name: "Cursed Helmet of the Umbral Regent",
		description:
			"An imbued scroll recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
		name: "Blessed Helmet of the Umbral Regent",
		description:
			"An ancient weapon recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Sacred Helmet of the Umbral Regent",
		description:
			"An cursed armor recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Profane Helmet of the Umbral Regent",
		description:
			"An crafted consumable recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Mystic Helmet of the Umbral Regent",
		description:
			"An enchanted accessory recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Arcane Helmet of the Umbral Regent",
		description:
			"An ancient scroll recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
		name: "Infernal Helmet of the Umbral Regent",
		description:
			"An crafted weapon recovered from a master techsmith. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Frozen Helmet of the Umbral Regent",
		description:
			"An forged armor recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		name: "Thunder Helmet of the Umbral Regent",
		description:
			"An cursed consumable recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Holy Helmet of the Umbral Regent",
		description:
			"An crafted accessory recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
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
		name: "Dark Helmet of the Umbral Regent",
		description:
			"An cursed scroll recovered from a legendary ascendant's collection. Infused with force energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
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
		id: "item-0661",
		name: "Shadow Gauntlets of the Umbral Regent",
		description:
			"An enchanted weapon recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0661.webp",
		stats: {
			attack: 229,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 68241,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 68241,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0662",
		name: "Eternal Gauntlets of the Umbral Regent",
		description:
			"An imbued armor recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0662.webp",
		stats: {
			defense: 206,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 48576,
		weight: 20,
		properties: {
			magical: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"The armor adjusts to fit perfectly, imposing no stealth disadvantage",
				"Grants resistance to one elemental damage type while attuned",
			],
			value: 48576,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0663",
		name: "Void Gauntlets of the Umbral Regent",
		description:
			"An blessed consumable recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0663.webp",
		stats: {
			health: 217,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 57454,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
				"Removes one condition affecting the user",
			],
			value: 57454,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0664",
		name: "Abyssal Gauntlets of the Umbral Regent",
		description:
			"An crafted accessory recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0664.webp",
		stats: {
			mana: 204,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 62215,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 62215,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0665",
		name: "Demonic Gauntlets of the Umbral Regent",
		description:
			"An crafted scroll recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0665.webp",
		stats: {
			mana: 99,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 72257,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 72257,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0666",
		name: "Celestial Gauntlets of the Umbral Regent",
		description:
			"An enchanted weapon recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0666.webp",
		stats: {
			attack: 79,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 52501,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 52501,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0667",
		name: "Divine Gauntlets of the Umbral Regent",
		description:
			"An crafted armor recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0667.webp",
		stats: {
			defense: 88,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 65624,
		weight: 20,
		properties: {
			magical: {
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
			value: 65624,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0668",
		name: "Ancient Gauntlets of the Umbral Regent",
		description:
			"An blessed consumable recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0668.webp",
		stats: {
			health: 116,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 41955,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
				"Removes one condition affecting the user",
			],
			value: 41955,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0669",
		name: "Forgotten Gauntlets of the Umbral Regent",
		description:
			"An enchanted accessory recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0669.webp",
		stats: {
			mana: 231,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 40546,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 40546,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0670",
		name: "Cursed Gauntlets of the Umbral Regent",
		description:
			"An enchanted scroll recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0670.webp",
		stats: {
			mana: 211,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 99992,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 99992,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0671",
		name: "Blessed Gauntlets of the Umbral Regent",
		description:
			"An blessed weapon recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0671.webp",
		stats: {
			attack: 211,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 94528,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 94528,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0672",
		name: "Sacred Gauntlets of the Umbral Regent",
		description:
			"An forged armor recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0672.webp",
		stats: {
			defense: 131,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 56891,
		weight: 20,
		properties: {
			magical: {
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
			value: 56891,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0673",
		name: "Profane Gauntlets of the Umbral Regent",
		description:
			"An cursed consumable recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0673.webp",
		stats: {
			health: 235,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 94219,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
			],
			value: 94219,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0674",
		name: "Mystic Gauntlets of the Umbral Regent",
		description:
			"An awakened accessory recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0674.webp",
		stats: {
			mana: 156,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 21915,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 21915,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0675",
		name: "Arcane Gauntlets of the Umbral Regent",
		description:
			"An awakened scroll recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0675.webp",
		stats: {
			mana: 173,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 67821,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 67821,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0676",
		name: "Infernal Gauntlets of the Umbral Regent",
		description:
			"An crafted weapon recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0676.webp",
		stats: {
			attack: 55,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 60281,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 60281,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0677",
		name: "Frozen Gauntlets of the Umbral Regent",
		description:
			"An crafted armor recovered from a legendary ascendant's collection. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0677.webp",
		stats: {
			defense: 152,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 74086,
		weight: 20,
		properties: {
			magical: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Grants resistance to one elemental damage type while attuned",
				"Grants advantage on saving throws against one damage type",
			],
			value: 74086,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0678",
		name: "Thunder Gauntlets of the Umbral Regent",
		description:
			"An awakened consumable recovered from a legendary ascendant's collection. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0678.webp",
		stats: {
			health: 234,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 75182,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 75182,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0679",
		name: "Holy Gauntlets of the Umbral Regent",
		description:
			"An imbued accessory recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0679.webp",
		stats: {
			mana: 134,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 13794,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 13794,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0680",
		name: "Dark Gauntlets of the Umbral Regent",
		description:
			"An enchanted scroll recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0680.webp",
		stats: {
			mana: 84,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 41421,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 41421,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0681",
		name: "Shadow Boots of the Umbral Regent",
		description:
			"An enchanted weapon recovered from a master techsmith. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Eternal Boots of the Umbral Regent",
		description:
			"An cursed armor recovered from a legendary ascendant's collection. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		id: "item-0683",
		name: "Void Boots of the Umbral Regent",
		description:
			"An cursed consumable recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0683.webp",
		stats: {
			health: 358,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 49747,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 49747,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0684",
		name: "Abyssal Boots of the Umbral Regent",
		description:
			"An enchanted accessory recovered from the depths of an A-rank gate. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0684.webp",
		stats: {
			mana: 110,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 74730,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 74730,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0685",
		name: "Demonic Boots of the Umbral Regent",
		description:
			"An cursed scroll recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0685.webp",
		stats: {
			mana: 148,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 70990,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 70990,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0686",
		name: "Celestial Boots of the Umbral Regent",
		description:
			"An cursed weapon recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Divine Boots of the Umbral Regent",
		description:
			"An imbued armor recovered from a legendary ascendant's collection. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		id: "item-0688",
		name: "Ancient Boots of the Umbral Regent",
		description:
			"An crafted consumable recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0688.webp",
		stats: {
			health: 139,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 52855,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 52855,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0689",
		name: "Forgotten Boots of the Umbral Regent",
		description:
			"An cursed accessory recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0689.webp",
		stats: {
			mana: 222,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 57135,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
			],
			value: 57135,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0690",
		name: "Cursed Boots of the Umbral Regent",
		description:
			"An cursed scroll recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0690.webp",
		stats: {
			mana: 185,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 27003,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 27003,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0691",
		name: "Blessed Boots of the Umbral Regent",
		description:
			"An awakened weapon recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Sacred Boots of the Umbral Regent",
		description:
			"An cursed armor recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
		id: "item-0693",
		name: "Profane Boots of the Umbral Regent",
		description:
			"An ancient consumable recovered from a legendary ascendant's collection. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0693.webp",
		stats: {
			health: 268,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 30624,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 30624,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0694",
		name: "Mystic Boots of the Umbral Regent",
		description:
			"An awakened accessory recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0694.webp",
		stats: {
			mana: 227,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 49992,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 49992,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0695",
		name: "Arcane Boots of the Umbral Regent",
		description:
			"An awakened scroll recovered from a legendary ascendant's collection. Infused with poison energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0695.webp",
		stats: {
			mana: 79,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 5764,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 5764,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0696",
		name: "Infernal Boots of the Umbral Regent",
		description:
			"An imbued weapon recovered from a legendary ascendant's collection. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
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
		name: "Frozen Boots of the Umbral Regent",
		description:
			"An crafted armor recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
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
			magical: {
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
	{
		id: "item-0698",
		name: "Thunder Boots of the Umbral Regent",
		description:
			"An imbued consumable recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0698.webp",
		stats: {
			health: 311,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 35537,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 35537,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0699",
		name: "Holy Boots of the Umbral Regent",
		description:
			"An awakened accessory recovered from a legendary ascendant's collection. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0699.webp",
		stats: {
			mana: 125,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 89162,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 89162,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0700",
		name: "Dark Boots of the Umbral Regent",
		description:
			"An enchanted scroll recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0700.webp",
		stats: {
			mana: 157,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 39119,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 39119,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0701",
		name: "Shadow Ring of the Umbral Regent",
		description:
			"An cursed weapon recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0701.webp",
		stats: {
			attack: 133,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 87594,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 87594,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0702",
		name: "Eternal Ring of the Umbral Regent",
		description:
			"An cursed armor recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0702.webp",
		stats: {
			defense: 174,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 37223,
		weight: 20,
		properties: {
			magical: {
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
			value: 37223,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0703",
		name: "Void Ring of the Umbral Regent",
		description:
			"An imbued consumable recovered from a legendary ascendant's collection. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0703.webp",
		stats: {
			health: 248,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 81649,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants temporary hit points equal to your level for 1 hour",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 81649,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0704",
		name: "Abyssal Ring of the Umbral Regent",
		description:
			"An enchanted accessory recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0704.webp",
		stats: {
			mana: 171,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 38306,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 38306,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0705",
		name: "Demonic Ring of the Umbral Regent",
		description:
			"An crafted scroll recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0705.webp",
		stats: {
			mana: 113,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 28941,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
			],
			value: 28941,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0706",
		name: "Celestial Ring of the Umbral Regent",
		description:
			"An imbued weapon recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0706.webp",
		stats: {
			attack: 65,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 8595,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 8595,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0707",
		name: "Divine Ring of the Umbral Regent",
		description:
			"An crafted armor recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0707.webp",
		stats: {
			defense: 210,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 57760,
		weight: 20,
		properties: {
			magical: {
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
			value: 57760,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0708",
		name: "Ancient Ring of the Umbral Regent",
		description:
			"An blessed consumable recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0708.webp",
		stats: {
			health: 234,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 21780,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 21780,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0709",
		name: "Forgotten Ring of the Umbral Regent",
		description:
			"An enchanted accessory recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0709.webp",
		stats: {
			mana: 230,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 87910,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 87910,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0710",
		name: "Cursed Ring of the Umbral Regent",
		description:
			"An cursed scroll recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0710.webp",
		stats: {
			mana: 93,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 29914,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 29914,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0711",
		name: "Blessed Ring of the Umbral Regent",
		description:
			"An enchanted weapon recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0711.webp",
		stats: {
			attack: 233,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 3615,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 3615,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0712",
		name: "Sacred Ring of the Umbral Regent",
		description:
			"An imbued armor recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0712.webp",
		stats: {
			defense: 148,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 88681,
		weight: 20,
		properties: {
			magical: {
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
			value: 88681,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0713",
		name: "Profane Ring of the Umbral Regent",
		description:
			"An imbued consumable recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0713.webp",
		stats: {
			health: 422,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 7685,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 7685,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0714",
		name: "Mystic Ring of the Umbral Regent",
		description:
			"An cursed accessory recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0714.webp",
		stats: {
			mana: 221,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 54754,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 54754,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0715",
		name: "Arcane Ring of the Umbral Regent",
		description:
			"An crafted scroll recovered from a master techsmith. Infused with ice energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0715.webp",
		stats: {
			mana: 82,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 43097,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 43097,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0716",
		name: "Infernal Ring of the Umbral Regent",
		description:
			"An awakened weapon recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0716.webp",
		stats: {
			attack: 244,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 64526,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 64526,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0717",
		name: "Frozen Ring of the Umbral Regent",
		description:
			"An forged armor recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0717.webp",
		stats: {
			defense: 51,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 47570,
		weight: 20,
		properties: {
			magical: {
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
			value: 47570,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0718",
		name: "Thunder Ring of the Umbral Regent",
		description:
			"An cursed consumable recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0718.webp",
		stats: {
			health: 360,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 100902,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 100902,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0719",
		name: "Holy Ring of the Umbral Regent",
		description:
			"An cursed accessory recovered from a legendary ascendant's collection. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0719.webp",
		stats: {
			mana: 96,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 47588,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 47588,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0720",
		name: "Dark Ring of the Umbral Regent",
		description:
			"An cursed scroll recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0720.webp",
		stats: {
			mana: 108,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 18500,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 18500,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0721",
		name: "Shadow Amulet of the Umbral Regent",
		description:
			"An blessed weapon recovered from a legendary ascendant's collection. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0721.webp",
		stats: {
			attack: 170,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 5722,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 5722,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0722",
		name: "Eternal Amulet of the Umbral Regent",
		description:
			"An forged armor recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0722.webp",
		stats: {
			defense: 109,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 36902,
		weight: 20,
		properties: {
			magical: {
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
			value: 36902,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0723",
		name: "Void Amulet of the Umbral Regent",
		description:
			"An ancient consumable recovered from a legendary ascendant's collection. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0723.webp",
		stats: {
			health: 304,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 25002,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 25002,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0724",
		name: "Abyssal Amulet of the Umbral Regent",
		description:
			"An ancient accessory recovered from a legendary ascendant's collection. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0724.webp",
		stats: {
			mana: 189,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 18631,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 18631,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0725",
		name: "Demonic Amulet of the Umbral Regent",
		description:
			"An cursed scroll recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0725.webp",
		stats: {
			mana: 146,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 56823,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 56823,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0726",
		name: "Celestial Amulet of the Umbral Regent",
		description:
			"An enchanted weapon recovered from a legendary ascendant's collection. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0726.webp",
		stats: {
			attack: 95,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 49358,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 49358,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0727",
		name: "Divine Amulet of the Umbral Regent",
		description:
			"An enchanted armor recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0727.webp",
		stats: {
			defense: 64,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 84661,
		weight: 20,
		properties: {
			magical: {
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
			value: 84661,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0728",
		name: "Ancient Amulet of the Umbral Regent",
		description:
			"An ancient consumable recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0728.webp",
		stats: {
			health: 190,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 69524,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 69524,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0729",
		name: "Forgotten Amulet of the Umbral Regent",
		description:
			"An enchanted accessory recovered from a master techsmith. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0729.webp",
		stats: {
			mana: 55,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 46313,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 46313,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0730",
		name: "Cursed Amulet of the Umbral Regent",
		description:
			"An crafted scroll recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0730.webp",
		stats: {
			mana: 213,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 25746,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 25746,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0731",
		name: "Blessed Amulet of the Umbral Regent",
		description:
			"An awakened weapon recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0731.webp",
		stats: {
			attack: 165,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 85880,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 85880,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0732",
		name: "Sacred Amulet of the Umbral Regent",
		description:
			"An forged armor recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0732.webp",
		stats: {
			defense: 102,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 52613,
		weight: 20,
		properties: {
			magical: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Grants resistance to one elemental damage type while attuned",
				"Grants advantage on saving throws against one damage type",
			],
			value: 52613,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0733",
		name: "Profane Amulet of the Umbral Regent",
		description:
			"An ancient consumable recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0733.webp",
		stats: {
			health: 585,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 72148,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 72148,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0734",
		name: "Mystic Amulet of the Umbral Regent",
		description:
			"An crafted accessory recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0734.webp",
		stats: {
			mana: 88,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 2109,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 2109,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0735",
		name: "Arcane Amulet of the Umbral Regent",
		description:
			"An forged scroll recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0735.webp",
		stats: {
			mana: 227,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 84101,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 84101,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0736",
		name: "Infernal Amulet of the Umbral Regent",
		description:
			"An cursed weapon recovered from a legendary ascendant's collection. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0736.webp",
		stats: {
			attack: 101,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 41235,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 41235,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0737",
		name: "Frozen Amulet of the Umbral Regent",
		description:
			"An blessed armor recovered from a legendary ascendant's collection. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0737.webp",
		stats: {
			defense: 150,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 84247,
		weight: 20,
		properties: {
			magical: {
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
			value: 84247,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0738",
		name: "Thunder Amulet of the Umbral Regent",
		description:
			"An ancient consumable recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0738.webp",
		stats: {
			health: 271,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 98044,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 98044,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0739",
		name: "Holy Amulet of the Umbral Regent",
		description:
			"An awakened accessory recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0739.webp",
		stats: {
			mana: 69,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 18578,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
			],
			value: 18578,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0740",
		name: "Dark Amulet of the Umbral Regent",
		description:
			"An cursed scroll recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0740.webp",
		stats: {
			mana: 158,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 12631,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 12631,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0741",
		name: "Shadow Scroll of the Umbral Regent",
		description:
			"An imbued weapon recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0741.webp",
		stats: {
			attack: 190,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 74005,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 74005,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0742",
		name: "Eternal Scroll of the Umbral Regent",
		description:
			"An awakened armor recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0742.webp",
		stats: {
			defense: 111,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 67595,
		weight: 20,
		properties: {
			magical: {
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
			value: 67595,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0743",
		name: "Void Scroll of the Umbral Regent",
		description:
			"An blessed consumable recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0743.webp",
		stats: {
			health: 445,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 86285,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
			],
			value: 86285,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0744",
		name: "Abyssal Scroll of the Umbral Regent",
		description:
			"An crafted accessory recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0744.webp",
		stats: {
			mana: 144,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 15338,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 15338,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0745",
		name: "Demonic Scroll of the Umbral Regent",
		description:
			"An imbued scroll recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0745.webp",
		stats: {
			mana: 51,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 86477,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 86477,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0746",
		name: "Celestial Scroll of the Umbral Regent",
		description:
			"An imbued weapon recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0746.webp",
		stats: {
			attack: 221,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 42396,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 42396,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0747",
		name: "Divine Scroll of the Umbral Regent",
		description:
			"An awakened armor recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0747.webp",
		stats: {
			defense: 77,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 87906,
		weight: 20,
		properties: {
			magical: {
				bonus: {
					armorClass: 1,
				},
			},
		},
		effects: {
			passive: [
				"Grants advantage on saving throws against one damage type",
				"You can cast Shield once per long rest while wearing this armor",
			],
			value: 87906,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0748",
		name: "Ancient Scroll of the Umbral Regent",
		description:
			"An forged consumable recovered from a master techsmith. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0748.webp",
		stats: {
			health: 307,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 49383,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 49383,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0749",
		name: "Forgotten Scroll of the Umbral Regent",
		description:
			"An blessed accessory recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0749.webp",
		stats: {
			mana: 186,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 22534,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 22534,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0750",
		name: "Cursed Scroll of the Umbral Regent",
		description:
			"An awakened scroll recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0750.webp",
		stats: {
			mana: 86,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 49183,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
			],
			value: 49183,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0751",
		name: "Blessed Scroll of the Umbral Regent",
		description:
			"An enchanted weapon recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0751.webp",
		stats: {
			attack: 147,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 68304,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 68304,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0752",
		name: "Sacred Scroll of the Umbral Regent",
		description:
			"An imbued armor recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0752.webp",
		stats: {
			defense: 97,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 44126,
		weight: 20,
		properties: {
			magical: {
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
			value: 44126,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0753",
		name: "Profane Scroll of the Umbral Regent",
		description:
			"An ancient consumable recovered from a master techsmith. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0753.webp",
		stats: {
			health: 297,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 94879,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants temporary hit points equal to your level for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 94879,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0754",
		name: "Mystic Scroll of the Umbral Regent",
		description:
			"An imbued accessory recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0754.webp",
		stats: {
			mana: 187,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 60668,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 60668,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0755",
		name: "Arcane Scroll of the Umbral Regent",
		description:
			"An imbued scroll recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0755.webp",
		stats: {
			mana: 90,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 41915,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 41915,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0756",
		name: "Infernal Scroll of the Umbral Regent",
		description:
			"An forged weapon recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0756.webp",
		stats: {
			attack: 58,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 62698,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 62698,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0757",
		name: "Frozen Scroll of the Umbral Regent",
		description:
			"An forged armor recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0757.webp",
		stats: {
			defense: 156,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 90049,
		weight: 20,
		properties: {
			magical: {
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
			value: 90049,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0758",
		name: "Thunder Scroll of the Umbral Regent",
		description:
			"An awakened consumable recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0758.webp",
		stats: {
			health: 542,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 96756,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
			],
			value: 96756,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0759",
		name: "Holy Scroll of the Umbral Regent",
		description:
			"An awakened accessory recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0759.webp",
		stats: {
			mana: 92,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 37618,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 37618,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0760",
		name: "Dark Scroll of the Umbral Regent",
		description:
			"An blessed scroll recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0760.webp",
		stats: {
			mana: 169,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 34137,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 34137,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0761",
		name: "Shadow Tome of the Umbral Regent",
		description:
			"An enchanted weapon recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0761.webp",
		stats: {
			attack: 77,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 55684,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 55684,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0762",
		name: "Eternal Tome of the Umbral Regent",
		description:
			"An enchanted armor recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0762.webp",
		stats: {
			defense: 176,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 31731,
		weight: 20,
		properties: {
			magical: {
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
			value: 31731,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0763",
		name: "Void Tome of the Umbral Regent",
		description:
			"An awakened consumable recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0763.webp",
		stats: {
			health: 273,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 89597,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
				"Removes one condition affecting the user",
			],
			value: 89597,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0764",
		name: "Abyssal Tome of the Umbral Regent",
		description:
			"An blessed accessory recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0764.webp",
		stats: {
			mana: 238,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 18080,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 18080,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0765",
		name: "Demonic Tome of the Umbral Regent",
		description:
			"An cursed scroll recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0765.webp",
		stats: {
			mana: 54,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 34178,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 34178,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0766",
		name: "Celestial Tome of the Umbral Regent",
		description:
			"An enchanted weapon recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0766.webp",
		stats: {
			attack: 127,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 71068,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 71068,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0767",
		name: "Divine Tome of the Umbral Regent",
		description:
			"An enchanted armor recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0767.webp",
		stats: {
			defense: 159,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 49533,
		weight: 20,
		properties: {
			magical: {
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
			value: 49533,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0768",
		name: "Ancient Tome of the Umbral Regent",
		description:
			"An forged consumable recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0768.webp",
		stats: {
			health: 485,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 64863,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 64863,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0769",
		name: "Forgotten Tome of the Umbral Regent",
		description:
			"An ancient accessory recovered from a legendary ascendant's collection. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0769.webp",
		stats: {
			mana: 121,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 50097,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 50097,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0770",
		name: "Cursed Tome of the Umbral Regent",
		description:
			"An crafted scroll recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0770.webp",
		stats: {
			mana: 164,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 99965,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 99965,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0771",
		name: "Blessed Tome of the Umbral Regent",
		description:
			"An forged weapon recovered from a master techsmith. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0771.webp",
		stats: {
			attack: 126,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 30345,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 30345,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0772",
		name: "Sacred Tome of the Umbral Regent",
		description:
			"An ancient armor recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0772.webp",
		stats: {
			defense: 78,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 52200,
		weight: 20,
		properties: {
			magical: {
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
			value: 52200,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0773",
		name: "Profane Tome of the Umbral Regent",
		description:
			"An ancient consumable recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0773.webp",
		stats: {
			health: 282,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 24645,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 24645,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0774",
		name: "Mystic Tome of the Umbral Regent",
		description:
			"An cursed accessory recovered from a legendary ascendant's collection. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0774.webp",
		stats: {
			mana: 226,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 34626,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 34626,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0775",
		name: "Arcane Tome of the Umbral Regent",
		description:
			"An forged scroll recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0775.webp",
		stats: {
			mana: 247,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 58059,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 58059,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0776",
		name: "Infernal Tome of the Umbral Regent",
		description:
			"An enchanted weapon recovered from a master techsmith. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0776.webp",
		stats: {
			attack: 215,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 9869,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 9869,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0777",
		name: "Frozen Tome of the Umbral Regent",
		description:
			"An enchanted armor recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0777.webp",
		stats: {
			defense: 91,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 40469,
		weight: 20,
		properties: {
			magical: {
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
			value: 40469,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0778",
		name: "Thunder Tome of the Umbral Regent",
		description:
			"An blessed consumable recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0778.webp",
		stats: {
			health: 116,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 28275,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 28275,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0779",
		name: "Holy Tome of the Umbral Regent",
		description:
			"An blessed accessory recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0779.webp",
		stats: {
			mana: 168,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 6451,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 6451,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0780",
		name: "Dark Tome of the Umbral Regent",
		description:
			"An awakened scroll recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0780.webp",
		stats: {
			mana: 220,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 100479,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 100479,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0781",
		name: "Shadow Crystal of the Umbral Regent",
		description:
			"An blessed weapon recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0781.webp",
		stats: {
			attack: 78,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 95713,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 95713,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0782",
		name: "Eternal Crystal of the Umbral Regent",
		description:
			"An awakened armor recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0782.webp",
		stats: {
			defense: 204,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 1138,
		weight: 20,
		properties: {
			magical: {
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
			value: 1138,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0783",
		name: "Void Crystal of the Umbral Regent",
		description:
			"An cursed consumable recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0783.webp",
		stats: {
			health: 483,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 73826,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
			],
			value: 73826,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0784",
		name: "Abyssal Crystal of the Umbral Regent",
		description:
			"An enchanted accessory recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0784.webp",
		stats: {
			mana: 128,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 66063,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 66063,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0785",
		name: "Demonic Crystal of the Umbral Regent",
		description:
			"An forged scroll recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0785.webp",
		stats: {
			mana: 61,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 24376,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 24376,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0786",
		name: "Celestial Crystal of the Umbral Regent",
		description:
			"An imbued weapon recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0786.webp",
		stats: {
			attack: 69,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 14848,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 14848,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0787",
		name: "Divine Crystal of the Umbral Regent",
		description:
			"An awakened armor recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0787.webp",
		stats: {
			defense: 103,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 47323,
		weight: 20,
		properties: {
			magical: {
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
			value: 47323,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0788",
		name: "Ancient Crystal of the Umbral Regent",
		description:
			"An crafted consumable recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0788.webp",
		stats: {
			health: 477,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 100371,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 100371,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0789",
		name: "Forgotten Crystal of the Umbral Regent",
		description:
			"An forged accessory recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0789.webp",
		stats: {
			mana: 224,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 94887,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 94887,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0790",
		name: "Cursed Crystal of the Umbral Regent",
		description:
			"An crafted scroll recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0790.webp",
		stats: {
			mana: 199,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 29541,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
			],
			value: 29541,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0791",
		name: "Blessed Crystal of the Umbral Regent",
		description:
			"An crafted weapon recovered from a legendary ascendant's collection. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0791.webp",
		stats: {
			attack: 178,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 42964,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 42964,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0792",
		name: "Sacred Crystal of the Umbral Regent",
		description:
			"An forged armor recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0792.webp",
		stats: {
			defense: 217,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 73410,
		weight: 20,
		properties: {
			magical: {
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
			value: 73410,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0793",
		name: "Profane Crystal of the Umbral Regent",
		description:
			"An ancient consumable recovered from a master techsmith. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0793.webp",
		stats: {
			health: 177,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 77591,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 77591,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0794",
		name: "Mystic Crystal of the Umbral Regent",
		description:
			"An awakened accessory recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0794.webp",
		stats: {
			mana: 210,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 40586,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 40586,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0795",
		name: "Arcane Crystal of the Umbral Regent",
		description:
			"An blessed scroll recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0795.webp",
		stats: {
			mana: 131,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 93603,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 93603,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0796",
		name: "Infernal Crystal of the Umbral Regent",
		description:
			"An ancient weapon recovered from a master techsmith. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0796.webp",
		stats: {
			attack: 249,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 100504,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 100504,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0797",
		name: "Frozen Crystal of the Umbral Regent",
		description:
			"An ancient armor recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0797.webp",
		stats: {
			defense: 103,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 34487,
		weight: 20,
		properties: {
			magical: {
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
			value: 34487,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0798",
		name: "Thunder Crystal of the Umbral Regent",
		description:
			"An ancient consumable recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0798.webp",
		stats: {
			health: 190,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 73669,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 73669,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0799",
		name: "Holy Crystal of the Umbral Regent",
		description:
			"An cursed accessory recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0799.webp",
		stats: {
			mana: 120,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 11121,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 11121,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0800",
		name: "Dark Crystal of the Umbral Regent",
		description:
			"An enchanted scroll recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0800.webp",
		stats: {
			mana: 220,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 1609,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 1609,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
];
