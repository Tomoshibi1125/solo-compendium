// Items Compendium - Part 5
// Generated with full admin privileges
// System Ascendant themed items with images

import type { Item } from "./items";

export const items: Item[] = [
	{
		id: "item-0801",
		name: "Shadow Essence of the Umbral Regent",
		description:
			"An awakened weapon recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0801.webp",
		stats: {
			attack: 243,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 76525,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 76525,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0802",
		name: "Eternal Essence of the Umbral Regent",
		description:
			"An imbued armor recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0802.webp",
		stats: {
			defense: 197,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 87481,
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
			value: 87481,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0803",
		name: "Void Essence of the Umbral Regent",
		description:
			"An imbued consumable recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0803.webp",
		stats: {
			health: 516,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 88139,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 88139,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0804",
		name: "Abyssal Essence of the Umbral Regent",
		description:
			"An awakened accessory recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0804.webp",
		stats: {
			mana: 79,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 47112,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 47112,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0805",
		name: "Demonic Essence of the Umbral Regent",
		description:
			"An blessed scroll recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0805.webp",
		stats: {
			mana: 202,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 29893,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 29893,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0806",
		name: "Celestial Essence of the Umbral Regent",
		description:
			"An blessed weapon recovered from a legendary ascendant's collection. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0806.webp",
		stats: {
			attack: 58,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 2472,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 2472,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0807",
		name: "Divine Essence of the Umbral Regent",
		description:
			"An cursed armor recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0807.webp",
		stats: {
			defense: 61,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 70891,
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
			value: 70891,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0808",
		name: "Ancient Essence of the Umbral Regent",
		description:
			"An imbued consumable recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0808.webp",
		stats: {
			health: 231,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 19876,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 19876,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0809",
		name: "Forgotten Essence of the Umbral Regent",
		description:
			"An crafted accessory recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0809.webp",
		stats: {
			mana: 116,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 37313,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 37313,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0810",
		name: "Cursed Essence of the Umbral Regent",
		description:
			"An imbued scroll recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0810.webp",
		stats: {
			mana: 234,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 28244,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 28244,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0811",
		name: "Blessed Essence of the Umbral Regent",
		description:
			"An imbued weapon recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0811.webp",
		stats: {
			attack: 59,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 91578,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 91578,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0812",
		name: "Sacred Essence of the Umbral Regent",
		description:
			"An imbued armor recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0812.webp",
		stats: {
			defense: 97,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 32644,
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
			value: 32644,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0813",
		name: "Profane Essence of the Umbral Regent",
		description:
			"An ancient consumable recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0813.webp",
		stats: {
			health: 589,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 38965,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 38965,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0814",
		name: "Mystic Essence of the Umbral Regent",
		description:
			"An ancient accessory recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0814.webp",
		stats: {
			mana: 125,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 62565,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 62565,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0815",
		name: "Arcane Essence of the Umbral Regent",
		description:
			"An cursed scroll recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0815.webp",
		stats: {
			mana: 242,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 17702,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
			],
			value: 17702,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0816",
		name: "Infernal Essence of the Umbral Regent",
		description:
			"An imbued weapon recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0816.webp",
		stats: {
			attack: 89,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 25843,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 25843,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0817",
		name: "Frozen Essence of the Umbral Regent",
		description:
			"An crafted armor recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0817.webp",
		stats: {
			defense: 107,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 25748,
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
			value: 25748,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0818",
		name: "Thunder Essence of the Umbral Regent",
		description:
			"An awakened consumable recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0818.webp",
		stats: {
			health: 582,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 97732,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 97732,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0819",
		name: "Holy Essence of the Umbral Regent",
		description:
			"An imbued accessory recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0819.webp",
		stats: {
			mana: 74,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 84895,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
			],
			value: 84895,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0820",
		name: "Dark Essence of the Umbral Regent",
		description:
			"An blessed scroll recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0820.webp",
		stats: {
			mana: 186,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 34013,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 34013,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0821",
		name: "Shadow Heart of the Umbral Regent",
		description:
			"An crafted weapon recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0821.webp",
		stats: {
			attack: 131,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 16611,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 16611,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0822",
		name: "Eternal Heart of the Umbral Regent",
		description:
			"An awakened armor recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0822.webp",
		stats: {
			defense: 111,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 95498,
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
				"Grants resistance to one elemental damage type while attuned",
			],
			value: 95498,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0823",
		name: "Void Heart of the Umbral Regent",
		description:
			"An imbued consumable recovered from a master techsmith. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0823.webp",
		stats: {
			health: 457,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 7190,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 7190,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0824",
		name: "Abyssal Heart of the Umbral Regent",
		description:
			"An blessed accessory recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0824.webp",
		stats: {
			mana: 216,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 35554,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 35554,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0825",
		name: "Demonic Heart of the Umbral Regent",
		description:
			"An awakened scroll recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0825.webp",
		stats: {
			mana: 99,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 92857,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 92857,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0826",
		name: "Celestial Heart of the Umbral Regent",
		description:
			"An cursed weapon recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0826.webp",
		stats: {
			attack: 169,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 61515,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 61515,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0827",
		name: "Divine Heart of the Umbral Regent",
		description:
			"An imbued armor recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0827.webp",
		stats: {
			defense: 80,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 10902,
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
			value: 10902,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0828",
		name: "Ancient Heart of the Umbral Regent",
		description:
			"An enchanted consumable recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0828.webp",
		stats: {
			health: 117,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 92784,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 92784,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0829",
		name: "Forgotten Heart of the Umbral Regent",
		description:
			"An forged accessory recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0829.webp",
		stats: {
			mana: 158,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 21621,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 21621,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0830",
		name: "Cursed Heart of the Umbral Regent",
		description:
			"An cursed scroll recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0830.webp",
		stats: {
			mana: 125,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 18266,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
			],
			value: 18266,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0831",
		name: "Blessed Heart of the Umbral Regent",
		description:
			"An awakened weapon recovered from a legendary ascendant's collection. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0831.webp",
		stats: {
			attack: 78,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 25938,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 25938,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0832",
		name: "Sacred Heart of the Umbral Regent",
		description:
			"An awakened armor recovered from a master techsmith. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0832.webp",
		stats: {
			defense: 71,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 30925,
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
			value: 30925,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0833",
		name: "Profane Heart of the Umbral Regent",
		description:
			"An forged consumable recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0833.webp",
		stats: {
			health: 396,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 68585,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 68585,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0834",
		name: "Mystic Heart of the Umbral Regent",
		description:
			"An enchanted accessory recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0834.webp",
		stats: {
			mana: 78,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 5802,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 5802,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0835",
		name: "Arcane Heart of the Umbral Regent",
		description:
			"An forged scroll recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0835.webp",
		stats: {
			mana: 120,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 23349,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 23349,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0836",
		name: "Infernal Heart of the Umbral Regent",
		description:
			"An ancient weapon recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0836.webp",
		stats: {
			attack: 238,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 94894,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 94894,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0837",
		name: "Frozen Heart of the Umbral Regent",
		description:
			"An awakened armor recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0837.webp",
		stats: {
			defense: 241,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 98551,
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
			value: 98551,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0838",
		name: "Thunder Heart of the Umbral Regent",
		description:
			"An cursed consumable recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0838.webp",
		stats: {
			health: 184,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 44994,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 44994,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0839",
		name: "Holy Heart of the Umbral Regent",
		description:
			"An imbued accessory recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0839.webp",
		stats: {
			mana: 205,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 38403,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 38403,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0840",
		name: "Dark Heart of the Umbral Regent",
		description:
			"An awakened scroll recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0840.webp",
		stats: {
			mana: 87,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 48924,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 48924,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0841",
		name: "Shadow Soul of the Umbral Regent",
		description:
			"An blessed weapon recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0841.webp",
		stats: {
			attack: 109,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 83917,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 83917,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0842",
		name: "Eternal Soul of the Umbral Regent",
		description:
			"An blessed armor recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0842.webp",
		stats: {
			defense: 240,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 93773,
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
			value: 93773,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0843",
		name: "Void Soul of the Umbral Regent",
		description:
			"An forged consumable recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0843.webp",
		stats: {
			health: 415,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 20834,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 20834,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0844",
		name: "Abyssal Soul of the Umbral Regent",
		description:
			"An ancient accessory recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0844.webp",
		stats: {
			mana: 103,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 72567,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 72567,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0845",
		name: "Demonic Soul of the Umbral Regent",
		description:
			"An enchanted scroll recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0845.webp",
		stats: {
			mana: 97,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 75202,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 75202,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0846",
		name: "Celestial Soul of the Umbral Regent",
		description:
			"An imbued weapon recovered from a master techsmith. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0846.webp",
		stats: {
			attack: 196,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 86302,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 86302,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0847",
		name: "Divine Soul of the Umbral Regent",
		description:
			"An imbued armor recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0847.webp",
		stats: {
			defense: 238,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 45058,
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
			value: 45058,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0848",
		name: "Ancient Soul of the Umbral Regent",
		description:
			"An awakened consumable recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0848.webp",
		stats: {
			health: 279,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 5207,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 5207,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0849",
		name: "Forgotten Soul of the Umbral Regent",
		description:
			"An blessed accessory recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0849.webp",
		stats: {
			mana: 206,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 16526,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 16526,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0850",
		name: "Cursed Soul of the Umbral Regent",
		description:
			"An imbued scroll recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0850.webp",
		stats: {
			mana: 213,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 81243,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 81243,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0851",
		name: "Blessed Soul of the Umbral Regent",
		description:
			"An awakened weapon recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0851.webp",
		stats: {
			attack: 185,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 42767,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 42767,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0852",
		name: "Sacred Soul of the Umbral Regent",
		description:
			"An ancient armor recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0852.webp",
		stats: {
			defense: 119,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 48367,
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
				"Grants resistance to one elemental damage type while attuned",
			],
			value: 48367,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0853",
		name: "Profane Soul of the Umbral Regent",
		description:
			"An cursed consumable recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0853.webp",
		stats: {
			health: 563,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 23443,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 23443,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0854",
		name: "Mystic Soul of the Umbral Regent",
		description:
			"An imbued accessory recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0854.webp",
		stats: {
			mana: 188,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 59032,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 59032,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0855",
		name: "Arcane Soul of the Umbral Regent",
		description:
			"An ancient scroll recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0855.webp",
		stats: {
			mana: 117,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 100577,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
			],
			value: 100577,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0856",
		name: "Infernal Soul of the Umbral Regent",
		description:
			"An imbued weapon recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0856.webp",
		stats: {
			attack: 156,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 91317,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 91317,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0857",
		name: "Frozen Soul of the Umbral Regent",
		description:
			"An forged armor recovered from a master techsmith. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0857.webp",
		stats: {
			defense: 230,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 23900,
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
			value: 23900,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0858",
		name: "Thunder Soul of the Umbral Regent",
		description:
			"An forged consumable recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0858.webp",
		stats: {
			health: 130,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 81488,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 81488,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0859",
		name: "Holy Soul of the Umbral Regent",
		description:
			"An awakened accessory recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0859.webp",
		stats: {
			mana: 188,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 83943,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 83943,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0860",
		name: "Dark Soul of the Umbral Regent",
		description:
			"An imbued scroll recovered from a master techsmith. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0860.webp",
		stats: {
			mana: 166,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 40354,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 40354,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0861",
		name: "Shadow Core of the Umbral Regent",
		description:
			"An imbued weapon recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0861.webp",
		stats: {
			attack: 75,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 1266,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 1266,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0862",
		name: "Eternal Core of the Umbral Regent",
		description:
			"An forged armor recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0862.webp",
		stats: {
			defense: 81,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 3094,
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
			value: 3094,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0863",
		name: "Void Core of the Umbral Regent",
		description:
			"An ancient consumable recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0863.webp",
		stats: {
			health: 494,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 88419,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 88419,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0864",
		name: "Abyssal Core of the Umbral Regent",
		description:
			"An awakened accessory recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0864.webp",
		stats: {
			mana: 76,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 66034,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 66034,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0865",
		name: "Demonic Core of the Umbral Regent",
		description:
			"An awakened scroll recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0865.webp",
		stats: {
			mana: 169,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 22829,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 22829,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0866",
		name: "Celestial Core of the Umbral Regent",
		description:
			"An crafted weapon recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0866.webp",
		stats: {
			attack: 72,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 11306,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 11306,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0867",
		name: "Divine Core of the Umbral Regent",
		description:
			"An forged armor recovered from a master techsmith. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0867.webp",
		stats: {
			defense: 60,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 46605,
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
			value: 46605,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0868",
		name: "Ancient Core of the Umbral Regent",
		description:
			"An imbued consumable recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0868.webp",
		stats: {
			health: 216,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 54773,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 54773,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0869",
		name: "Forgotten Core of the Umbral Regent",
		description:
			"An ancient accessory recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0869.webp",
		stats: {
			mana: 169,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 1072,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 1072,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0870",
		name: "Cursed Core of the Umbral Regent",
		description:
			"An crafted scroll recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0870.webp",
		stats: {
			mana: 93,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 45761,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 45761,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0871",
		name: "Blessed Core of the Umbral Regent",
		description:
			"An blessed weapon recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0871.webp",
		stats: {
			attack: 232,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 35857,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 35857,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0872",
		name: "Sacred Core of the Umbral Regent",
		description:
			"An ancient armor recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0872.webp",
		stats: {
			defense: 224,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 96602,
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
			value: 96602,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0873",
		name: "Profane Core of the Umbral Regent",
		description:
			"An ancient consumable recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0873.webp",
		stats: {
			health: 212,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 24040,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 24040,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0874",
		name: "Mystic Core of the Umbral Regent",
		description:
			"An forged accessory recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0874.webp",
		stats: {
			mana: 180,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 40713,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 40713,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0875",
		name: "Arcane Core of the Umbral Regent",
		description:
			"An ancient scroll recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0875.webp",
		stats: {
			mana: 86,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 97000,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 97000,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0876",
		name: "Infernal Core of the Umbral Regent",
		description:
			"An enchanted weapon recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0876.webp",
		stats: {
			attack: 175,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 63826,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 63826,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0877",
		name: "Frozen Core of the Umbral Regent",
		description:
			"An cursed armor recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0877.webp",
		stats: {
			defense: 58,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 15268,
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
			value: 15268,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0878",
		name: "Thunder Core of the Umbral Regent",
		description:
			"An imbued consumable recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0878.webp",
		stats: {
			health: 582,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 28731,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
			],
			value: 28731,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0879",
		name: "Holy Core of the Umbral Regent",
		description:
			"An enchanted accessory recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0879.webp",
		stats: {
			mana: 145,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 76081,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 76081,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0880",
		name: "Dark Core of the Umbral Regent",
		description:
			"An ancient scroll recovered from a master techsmith. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0880.webp",
		stats: {
			mana: 196,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 76127,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 76127,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0881",
		name: "Shadow Blade of Supreme Power",
		description:
			"An enchanted weapon recovered from a legendary ascendant's collection. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0881.webp",
		stats: {
			attack: 63,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 64080,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 64080,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0882",
		name: "Eternal Blade of Supreme Power",
		description:
			"An awakened armor recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0882.webp",
		stats: {
			defense: 148,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 52459,
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
			value: 52459,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0883",
		name: "Void Blade of Supreme Power",
		description:
			"An forged consumable recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0883.webp",
		stats: {
			health: 591,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 10105,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 10105,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0884",
		name: "Abyssal Blade of Supreme Power",
		description:
			"An awakened accessory recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0884.webp",
		stats: {
			mana: 52,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 52872,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 52872,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0885",
		name: "Demonic Blade of Supreme Power",
		description:
			"An crafted scroll recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0885.webp",
		stats: {
			mana: 249,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 71135,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 71135,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0886",
		name: "Celestial Blade of Supreme Power",
		description:
			"An forged weapon recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0886.webp",
		stats: {
			attack: 103,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 96226,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 96226,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0887",
		name: "Divine Blade of Supreme Power",
		description:
			"An crafted armor recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0887.webp",
		stats: {
			defense: 108,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 47346,
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
			value: 47346,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0888",
		name: "Ancient Blade of Supreme Power",
		description:
			"An crafted consumable recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0888.webp",
		stats: {
			health: 267,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 98101,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 98101,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0889",
		name: "Forgotten Blade of Supreme Power",
		description:
			"An blessed accessory recovered from a legendary ascendant's collection. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0889.webp",
		stats: {
			mana: 106,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 82446,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 82446,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0890",
		name: "Cursed Blade of Supreme Power",
		description:
			"An enchanted scroll recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0890.webp",
		stats: {
			mana: 236,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 86159,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 86159,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0891",
		name: "Blessed Blade of Supreme Power",
		description:
			"An enchanted weapon recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0891.webp",
		stats: {
			attack: 152,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 46368,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 46368,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0892",
		name: "Sacred Blade of Supreme Power",
		description:
			"An ancient armor recovered from a master techsmith. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0892.webp",
		stats: {
			defense: 162,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 37269,
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
			value: 37269,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0893",
		name: "Profane Blade of Supreme Power",
		description:
			"An cursed consumable recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0893.webp",
		stats: {
			health: 360,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 16234,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 16234,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0894",
		name: "Mystic Blade of Supreme Power",
		description:
			"An blessed accessory recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0894.webp",
		stats: {
			mana: 151,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 28643,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 28643,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0895",
		name: "Arcane Blade of Supreme Power",
		description:
			"An cursed scroll recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0895.webp",
		stats: {
			mana: 206,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 99117,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 99117,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0896",
		name: "Infernal Blade of Supreme Power",
		description:
			"An enchanted weapon recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0896.webp",
		stats: {
			attack: 147,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 40709,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 40709,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0897",
		name: "Frozen Blade of Supreme Power",
		description:
			"An ancient armor recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0897.webp",
		stats: {
			defense: 189,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 93830,
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
			value: 93830,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0898",
		name: "Thunder Blade of Supreme Power",
		description:
			"An crafted consumable recovered from a legendary ascendant's collection. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0898.webp",
		stats: {
			health: 213,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 60072,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 60072,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0899",
		name: "Holy Blade of Supreme Power",
		description:
			"An ancient accessory recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0899.webp",
		stats: {
			mana: 61,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 17695,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 17695,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0900",
		name: "Dark Blade of Supreme Power",
		description:
			"An awakened scroll recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0900.webp",
		stats: {
			mana: 222,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 67825,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 67825,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0901",
		name: "Shadow Sword of Supreme Power",
		description:
			"An enchanted weapon recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0901.webp",
		stats: {
			attack: 196,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 60046,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 60046,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0902",
		name: "Eternal Sword of Supreme Power",
		description:
			"An imbued armor recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0902.webp",
		stats: {
			defense: 137,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 74100,
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
			value: 74100,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0903",
		name: "Void Sword of Supreme Power",
		description:
			"An cursed consumable recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0903.webp",
		stats: {
			health: 123,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 35706,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 35706,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0904",
		name: "Abyssal Sword of Supreme Power",
		description:
			"An ancient accessory recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0904.webp",
		stats: {
			mana: 177,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 100567,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 100567,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0905",
		name: "Demonic Sword of Supreme Power",
		description:
			"An imbued scroll recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0905.webp",
		stats: {
			mana: 117,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 74200,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 74200,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0906",
		name: "Celestial Sword of Supreme Power",
		description:
			"An cursed weapon recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0906.webp",
		stats: {
			attack: 95,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 58028,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 58028,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0907",
		name: "Divine Sword of Supreme Power",
		description:
			"An cursed armor recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0907.webp",
		stats: {
			defense: 51,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 71827,
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
			value: 71827,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0908",
		name: "Ancient Sword of Supreme Power",
		description:
			"An imbued consumable recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0908.webp",
		stats: {
			health: 437,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 63863,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
			],
			value: 63863,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0909",
		name: "Forgotten Sword of Supreme Power",
		description:
			"An crafted accessory recovered from a legendary ascendant's collection. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0909.webp",
		stats: {
			mana: 222,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 79602,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 79602,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0910",
		name: "Cursed Sword of Supreme Power",
		description:
			"An cursed scroll recovered from a master techsmith. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0910.webp",
		stats: {
			mana: 65,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 19446,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 19446,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0911",
		name: "Blessed Sword of Supreme Power",
		description:
			"An forged weapon recovered from a legendary ascendant's collection. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0911.webp",
		stats: {
			attack: 59,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 10443,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 10443,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0912",
		name: "Sacred Sword of Supreme Power",
		description:
			"An crafted armor recovered from a master techsmith. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0912.webp",
		stats: {
			defense: 108,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 91490,
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
			value: 91490,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0913",
		name: "Profane Sword of Supreme Power",
		description:
			"An forged consumable recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0913.webp",
		stats: {
			health: 568,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 3805,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
			],
			value: 3805,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0914",
		name: "Mystic Sword of Supreme Power",
		description:
			"An crafted accessory recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0914.webp",
		stats: {
			mana: 218,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 42449,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 42449,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0915",
		name: "Arcane Sword of Supreme Power",
		description:
			"An awakened scroll recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0915.webp",
		stats: {
			mana: 73,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 11806,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 11806,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0916",
		name: "Infernal Sword of Supreme Power",
		description:
			"An blessed weapon recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0916.webp",
		stats: {
			attack: 55,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 58457,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 58457,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0917",
		name: "Frozen Sword of Supreme Power",
		description:
			"An blessed armor recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0917.webp",
		stats: {
			defense: 166,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 43807,
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
			value: 43807,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0918",
		name: "Thunder Sword of Supreme Power",
		description:
			"An forged consumable recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0918.webp",
		stats: {
			health: 538,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 46066,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 46066,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0919",
		name: "Holy Sword of Supreme Power",
		description:
			"An awakened accessory recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0919.webp",
		stats: {
			mana: 87,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 14637,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 14637,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0920",
		name: "Dark Sword of Supreme Power",
		description:
			"An forged scroll recovered from a legendary ascendant's collection. Infused with poison energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0920.webp",
		stats: {
			mana: 209,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 55639,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 55639,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0921",
		name: "Shadow Dagger of Supreme Power",
		description:
			"An forged weapon recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0921.webp",
		stats: {
			attack: 109,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 4326,
		weight: 1,
		properties: {
			weapon: {
				damage: "1d4",
				damageType: "piercing",
				finesse: true,
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 4326,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0922",
		name: "Eternal Dagger of Supreme Power",
		description:
			"An ancient armor recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0922.webp",
		stats: {
			defense: 141,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 93922,
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
				"Grants resistance to one elemental damage type while attuned",
			],
			value: 93922,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0923",
		name: "Void Dagger of Supreme Power",
		description:
			"An awakened consumable recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0923.webp",
		stats: {
			health: 187,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 7287,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 7287,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0924",
		name: "Abyssal Dagger of Supreme Power",
		description:
			"An forged accessory recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0924.webp",
		stats: {
			mana: 106,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 68245,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 68245,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0925",
		name: "Demonic Dagger of Supreme Power",
		description:
			"An forged scroll recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0925.webp",
		stats: {
			mana: 206,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 84060,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 84060,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0926",
		name: "Celestial Dagger of Supreme Power",
		description:
			"An blessed weapon recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0926.webp",
		stats: {
			attack: 77,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 90917,
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
			value: 90917,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0927",
		name: "Divine Dagger of Supreme Power",
		description:
			"An cursed armor recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0927.webp",
		stats: {
			defense: 133,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 23611,
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
			value: 23611,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0928",
		name: "Ancient Dagger of Supreme Power",
		description:
			"An blessed consumable recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0928.webp",
		stats: {
			health: 318,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 79178,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants temporary hit points equal to your level for 1 hour",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 79178,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0929",
		name: "Forgotten Dagger of Supreme Power",
		description:
			"An enchanted accessory recovered from a legendary ascendant's collection. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0929.webp",
		stats: {
			mana: 231,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 75896,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 75896,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0930",
		name: "Cursed Dagger of Supreme Power",
		description:
			"An forged scroll recovered from a legendary ascendant's collection. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0930.webp",
		stats: {
			mana: 76,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 52803,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 52803,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0931",
		name: "Blessed Dagger of Supreme Power",
		description:
			"An blessed weapon recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0931.webp",
		stats: {
			attack: 168,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 100782,
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
			value: 100782,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0932",
		name: "Sacred Dagger of Supreme Power",
		description:
			"An forged armor recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0932.webp",
		stats: {
			defense: 137,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 15223,
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
			value: 15223,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0933",
		name: "Profane Dagger of Supreme Power",
		description:
			"An enchanted consumable recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0933.webp",
		stats: {
			health: 542,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 61501,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 61501,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0934",
		name: "Mystic Dagger of Supreme Power",
		description:
			"An blessed accessory recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0934.webp",
		stats: {
			mana: 58,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 16904,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 16904,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0935",
		name: "Arcane Dagger of Supreme Power",
		description:
			"An forged scroll recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0935.webp",
		stats: {
			mana: 163,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 18095,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 18095,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0936",
		name: "Infernal Dagger of Supreme Power",
		description:
			"An ancient weapon recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0936.webp",
		stats: {
			attack: 126,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 32948,
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
			value: 32948,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0937",
		name: "Frozen Dagger of Supreme Power",
		description:
			"An ancient armor recovered from a legendary ascendant's collection. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0937.webp",
		stats: {
			defense: 159,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 77369,
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
			value: 77369,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0938",
		name: "Thunder Dagger of Supreme Power",
		description:
			"An enchanted consumable recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0938.webp",
		stats: {
			health: 245,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 91560,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Removes one condition affecting the user",
			],
			value: 91560,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0939",
		name: "Holy Dagger of Supreme Power",
		description:
			"An imbued accessory recovered from a legendary ascendant's collection. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0939.webp",
		stats: {
			mana: 113,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 16556,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 16556,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0940",
		name: "Dark Dagger of Supreme Power",
		description:
			"An forged scroll recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0940.webp",
		stats: {
			mana: 71,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 33538,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 33538,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0941",
		name: "Shadow Axe of Supreme Power",
		description:
			"An cursed weapon recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0941.webp",
		stats: {
			attack: 104,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 76102,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 76102,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0942",
		name: "Eternal Axe of Supreme Power",
		description:
			"An cursed armor recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0942.webp",
		stats: {
			defense: 213,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 60496,
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
			value: 60496,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0943",
		name: "Void Axe of Supreme Power",
		description:
			"An blessed consumable recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0943.webp",
		stats: {
			health: 204,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 78043,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
				"Removes one condition affecting the user",
			],
			value: 78043,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0944",
		name: "Abyssal Axe of Supreme Power",
		description:
			"An imbued accessory recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0944.webp",
		stats: {
			mana: 100,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 92496,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 92496,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0945",
		name: "Demonic Axe of Supreme Power",
		description:
			"An blessed scroll recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0945.webp",
		stats: {
			mana: 211,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 73941,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 73941,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0946",
		name: "Celestial Axe of Supreme Power",
		description:
			"An cursed weapon recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0946.webp",
		stats: {
			attack: 77,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 9301,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 9301,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0947",
		name: "Divine Axe of Supreme Power",
		description:
			"An awakened armor recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0947.webp",
		stats: {
			defense: 155,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 71124,
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
			value: 71124,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0948",
		name: "Ancient Axe of Supreme Power",
		description:
			"An imbued consumable recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0948.webp",
		stats: {
			health: 177,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 46042,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 46042,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0949",
		name: "Forgotten Axe of Supreme Power",
		description:
			"An forged accessory recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0949.webp",
		stats: {
			mana: 239,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 99274,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 99274,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0950",
		name: "Cursed Axe of Supreme Power",
		description:
			"An ancient scroll recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0950.webp",
		stats: {
			mana: 131,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 20496,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 20496,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0951",
		name: "Blessed Axe of Supreme Power",
		description:
			"An forged weapon recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0951.webp",
		stats: {
			attack: 114,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 8386,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 8386,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0952",
		name: "Sacred Axe of Supreme Power",
		description:
			"An forged armor recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0952.webp",
		stats: {
			defense: 168,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 59015,
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
			value: 59015,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0953",
		name: "Profane Axe of Supreme Power",
		description:
			"An imbued consumable recovered from a master techsmith. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0953.webp",
		stats: {
			health: 520,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 14910,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 14910,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0954",
		name: "Mystic Axe of Supreme Power",
		description:
			"An crafted accessory recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0954.webp",
		stats: {
			mana: 59,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 69774,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 69774,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0955",
		name: "Arcane Axe of Supreme Power",
		description:
			"An crafted scroll recovered from a legendary ascendant's collection. Infused with force energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0955.webp",
		stats: {
			mana: 175,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 55607,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 55607,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0956",
		name: "Infernal Axe of Supreme Power",
		description:
			"An imbued weapon recovered from the depths of an A-rank gate. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0956.webp",
		stats: {
			attack: 218,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 18075,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 18075,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0957",
		name: "Frozen Axe of Supreme Power",
		description:
			"An ancient armor recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0957.webp",
		stats: {
			defense: 60,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 2195,
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
			value: 2195,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0958",
		name: "Thunder Axe of Supreme Power",
		description:
			"An awakened consumable recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0958.webp",
		stats: {
			health: 217,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 84181,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 84181,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0959",
		name: "Holy Axe of Supreme Power",
		description:
			"An ancient accessory recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0959.webp",
		stats: {
			mana: 242,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 46697,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 46697,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0960",
		name: "Dark Axe of Supreme Power",
		description:
			"An crafted scroll recovered from a legendary ascendant's collection. Infused with acid energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0960.webp",
		stats: {
			mana: 185,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 49210,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 49210,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0961",
		name: "Shadow Hammer of Supreme Power",
		description:
			"An forged weapon recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0961.webp",
		stats: {
			attack: 217,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 96828,
		weight: 5,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "bludgeoning",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 96828,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0962",
		name: "Eternal Hammer of Supreme Power",
		description:
			"An ancient armor recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0962.webp",
		stats: {
			defense: 208,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 57406,
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
			value: 57406,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0963",
		name: "Void Hammer of Supreme Power",
		description:
			"An cursed consumable recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0963.webp",
		stats: {
			health: 500,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 61681,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 61681,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0964",
		name: "Abyssal Hammer of Supreme Power",
		description:
			"An forged accessory recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0964.webp",
		stats: {
			mana: 179,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 54889,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 54889,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0965",
		name: "Demonic Hammer of Supreme Power",
		description:
			"An ancient scroll recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0965.webp",
		stats: {
			mana: 166,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 49991,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 49991,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0966",
		name: "Celestial Hammer of Supreme Power",
		description:
			"An enchanted weapon recovered from a legendary ascendant's collection. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0966.webp",
		stats: {
			attack: 193,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 64626,
		weight: 5,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "bludgeoning",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 64626,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0967",
		name: "Divine Hammer of Supreme Power",
		description:
			"An crafted armor recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0967.webp",
		stats: {
			defense: 187,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 61251,
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
			value: 61251,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0968",
		name: "Ancient Hammer of Supreme Power",
		description:
			"An forged consumable recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0968.webp",
		stats: {
			health: 370,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 7986,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 7986,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0969",
		name: "Forgotten Hammer of Supreme Power",
		description:
			"An ancient accessory recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0969.webp",
		stats: {
			mana: 62,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 81818,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 81818,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0970",
		name: "Cursed Hammer of Supreme Power",
		description:
			"An cursed scroll recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0970.webp",
		stats: {
			mana: 115,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 61236,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 61236,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0971",
		name: "Blessed Hammer of Supreme Power",
		description:
			"An imbued weapon recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0971.webp",
		stats: {
			attack: 244,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 1961,
		weight: 5,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "bludgeoning",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 1961,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0972",
		name: "Sacred Hammer of Supreme Power",
		description:
			"An crafted armor recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0972.webp",
		stats: {
			defense: 129,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 38412,
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
			value: 38412,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0973",
		name: "Profane Hammer of Supreme Power",
		description:
			"An enchanted consumable recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0973.webp",
		stats: {
			health: 184,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 13707,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Grants advantage on ability checks for 1 hour",
				"Removes one condition affecting the user",
			],
			value: 13707,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0974",
		name: "Mystic Hammer of Supreme Power",
		description:
			"An crafted accessory recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0974.webp",
		stats: {
			mana: 209,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 74178,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 74178,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0975",
		name: "Arcane Hammer of Supreme Power",
		description:
			"An awakened scroll recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0975.webp",
		stats: {
			mana: 157,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 94233,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 94233,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0976",
		name: "Infernal Hammer of Supreme Power",
		description:
			"An imbued weapon recovered from a legendary ascendant's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0976.webp",
		stats: {
			attack: 85,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 10629,
		weight: 5,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "bludgeoning",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 10629,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0977",
		name: "Frozen Hammer of Supreme Power",
		description:
			"An enchanted armor recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0977.webp",
		stats: {
			defense: 148,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 82941,
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
			value: 82941,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0978",
		name: "Thunder Hammer of Supreme Power",
		description:
			"An cursed consumable recovered from a fallen gate boss. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0978.webp",
		stats: {
			health: 304,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 89282,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 89282,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0979",
		name: "Holy Hammer of Supreme Power",
		description:
			"An imbued accessory recovered from the depths of an A-rank gate. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0979.webp",
		stats: {
			mana: 189,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 35093,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 35093,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0980",
		name: "Dark Hammer of Supreme Power",
		description:
			"An imbued scroll recovered from the depths of an A-rank gate. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0980.webp",
		stats: {
			mana: 159,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 80973,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 80973,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0981",
		name: "Shadow Staff of Supreme Power",
		description:
			"An forged weapon recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0981.webp",
		stats: {
			attack: 247,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 84320,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d6",
				damageType: "bludgeoning",
				versatile: "1d8",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 84320,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0982",
		name: "Eternal Staff of Supreme Power",
		description:
			"An crafted armor recovered from a legendary ascendant's collection. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0982.webp",
		stats: {
			defense: 209,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 88995,
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
			value: 88995,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0983",
		name: "Void Staff of Supreme Power",
		description:
			"An enchanted consumable recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0983.webp",
		stats: {
			health: 571,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 47644,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 47644,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0984",
		name: "Abyssal Staff of Supreme Power",
		description:
			"An awakened accessory recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0984.webp",
		stats: {
			mana: 154,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 60152,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 60152,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0985",
		name: "Demonic Staff of Supreme Power",
		description:
			"An awakened scroll recovered from a legendary ascendant's collection. Infused with ice energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0985.webp",
		stats: {
			mana: 58,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 78475,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 78475,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0986",
		name: "Celestial Staff of Supreme Power",
		description:
			"An awakened weapon recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0986.webp",
		stats: {
			attack: 143,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 17832,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d6",
				damageType: "bludgeoning",
				versatile: "1d8",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 17832,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0987",
		name: "Divine Staff of Supreme Power",
		description:
			"An awakened armor recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0987.webp",
		stats: {
			defense: 231,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 47041,
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
			value: 47041,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0988",
		name: "Ancient Staff of Supreme Power",
		description:
			"An imbued consumable recovered from a legendary ascendant's collection. Infused with poison energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0988.webp",
		stats: {
			health: 388,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 30225,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 30225,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0989",
		name: "Forgotten Staff of Supreme Power",
		description:
			"An crafted accessory recovered from a legendary ascendant's collection. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0989.webp",
		stats: {
			mana: 96,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 19162,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 19162,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0990",
		name: "Cursed Staff of Supreme Power",
		description:
			"An ancient scroll recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0990.webp",
		stats: {
			mana: 217,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 55142,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 55142,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0991",
		name: "Blessed Staff of Supreme Power",
		description:
			"An forged weapon recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0991.webp",
		stats: {
			attack: 143,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 65445,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d6",
				damageType: "bludgeoning",
				versatile: "1d8",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 65445,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0992",
		name: "Sacred Staff of Supreme Power",
		description:
			"An imbued armor recovered from a legendary ascendant's collection. Infused with lightning energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0992.webp",
		stats: {
			defense: 222,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 54521,
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
			value: 54521,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0993",
		name: "Profane Staff of Supreme Power",
		description:
			"An forged consumable recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0993.webp",
		stats: {
			health: 455,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 65836,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 65836,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0994",
		name: "Mystic Staff of Supreme Power",
		description:
			"An cursed accessory recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0994.webp",
		stats: {
			mana: 194,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 45089,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 45089,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0995",
		name: "Arcane Staff of Supreme Power",
		description:
			"An imbued scroll recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0995.webp",
		stats: {
			mana: 149,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 65444,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 65444,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0996",
		name: "Infernal Staff of Supreme Power",
		description:
			"An cursed weapon recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0996.webp",
		stats: {
			attack: 192,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 35693,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d6",
				damageType: "bludgeoning",
				versatile: "1d8",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 35693,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0997",
		name: "Frozen Staff of Supreme Power",
		description:
			"An enchanted armor recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0997.webp",
		stats: {
			defense: 189,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 7969,
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
			value: 7969,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0998",
		name: "Thunder Staff of Supreme Power",
		description:
			"An ancient consumable recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0998.webp",
		stats: {
			health: 487,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 3653,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Grants temporary hit points equal to your level for 1 hour",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 3653,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0999",
		name: "Holy Staff of Supreme Power",
		description:
			"An cursed accessory recovered from a legendary ascendant's collection. Infused with psychic energy, it resonates with power when wielded by a worthy ascendant.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0999.webp",
		stats: {
			mana: 174,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 68095,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
			],
			value: 68095,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-1000",
		name: "Dark Staff of Supreme Power",
		description:
			"An crafted scroll recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy ascendant. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-1000.webp",
		stats: {
			mana: 213,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 50685,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 50685,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
];
