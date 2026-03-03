// Items Compendium - Part 3
// Generated with full admin privileges
// System Ascendant themed items with images

import type { Item } from "./items";

export const items: Item[] = [
	{
		id: "item-0401",
		name: "Shadow Soul of Kael",
		description:
			"An blessed weapon recovered from a legendary hunter's collection. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Eternal Soul of Kael",
		description:
			"An cursed armor recovered from a legendary hunter's collection. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 85764,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0403",
		name: "Void Soul of Kael",
		description:
			"An cursed consumable recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Abyssal Soul of Kael",
		description:
			"An forged accessory recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Demonic Soul of Kael",
		description:
			"An cursed scroll recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Celestial Soul of Kael",
		description:
			"An forged weapon recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Divine Soul of Kael",
		description:
			"An imbued armor recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 72656,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0408",
		name: "Ancient Soul of Kael",
		description:
			"An crafted consumable recovered from a legendary hunter's collection. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Forgotten Soul of Kael",
		description:
			"An imbued accessory recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
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
		name: "Cursed Soul of Kael",
		description:
			"An crafted scroll recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Blessed Soul of Kael",
		description:
			"An crafted weapon recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Sacred Soul of Kael",
		description:
			"An awakened armor recovered from a legendary hunter's collection. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 46999,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0413",
		name: "Profane Soul of Kael",
		description:
			"An blessed consumable recovered from a master techsmith. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Mystic Soul of Kael",
		description:
			"An blessed accessory recovered from a legendary hunter's collection. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Arcane Soul of Kael",
		description:
			"An blessed scroll recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Infernal Soul of Kael",
		description:
			"An awakened weapon recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Frozen Soul of Kael",
		description:
			"An blessed armor recovered from a legendary hunter's collection. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 100954,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0418",
		name: "Thunder Soul of Kael",
		description:
			"An imbued consumable recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Holy Soul of Kael",
		description:
			"An crafted accessory recovered from a legendary hunter's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
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
		name: "Dark Soul of Kael",
		description:
			"An cursed scroll recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Shadow Core of Kael",
		description:
			"An crafted weapon recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Eternal Core of Kael",
		description:
			"An forged armor recovered from a legendary hunter's collection. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 68933,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0423",
		name: "Void Core of Kael",
		description:
			"An cursed consumable recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Abyssal Core of Kael",
		description:
			"An forged accessory recovered from a legendary hunter's collection. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Demonic Core of Kael",
		description:
			"An enchanted scroll recovered from a legendary hunter's collection. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Celestial Core of Kael",
		description:
			"An enchanted weapon recovered from a legendary hunter's collection. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Divine Core of Kael",
		description:
			"An imbued armor recovered from a master techsmith. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 16462,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0428",
		name: "Ancient Core of Kael",
		description:
			"An awakened consumable recovered from a forgotten dungeon. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Forgotten Core of Kael",
		description:
			"An blessed accessory recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Cursed Core of Kael",
		description:
			"An enchanted scroll recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Blessed Core of Kael",
		description:
			"An enchanted weapon recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Sacred Core of Kael",
		description:
			"An crafted armor recovered from a legendary hunter's collection. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 92056,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0433",
		name: "Profane Core of Kael",
		description:
			"An awakened consumable recovered from a legendary hunter's collection. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Mystic Core of Kael",
		description:
			"An awakened accessory recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Arcane Core of Kael",
		description:
			"An awakened scroll recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Infernal Core of Kael",
		description:
			"An ancient weapon recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Frozen Core of Kael",
		description:
			"An ancient armor recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 28037,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0438",
		name: "Thunder Core of Kael",
		description:
			"An imbued consumable recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Holy Core of Kael",
		description:
			"An blessed accessory recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
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
		name: "Dark Core of Kael",
		description:
			"An blessed scroll recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Shadow Blade of the Umbral Regent",
		description:
			"An blessed weapon recovered from a master techsmith. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Eternal Blade of the Umbral Regent",
		description:
			"An blessed armor recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 2862,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0443",
		name: "Void Blade of the Umbral Regent",
		description:
			"An enchanted consumable recovered from a legendary hunter's collection. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Abyssal Blade of the Umbral Regent",
		description:
			"An cursed accessory recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Demonic Blade of the Umbral Regent",
		description:
			"An cursed scroll recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Celestial Blade of the Umbral Regent",
		description:
			"An forged weapon recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Divine Blade of the Umbral Regent",
		description:
			"An enchanted armor recovered from a legendary hunter's collection. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 48164,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0448",
		name: "Ancient Blade of the Umbral Regent",
		description:
			"An awakened consumable recovered from a legendary hunter's collection. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Forgotten Blade of the Umbral Regent",
		description:
			"An forged accessory recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
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
		name: "Cursed Blade of the Umbral Regent",
		description:
			"An ancient scroll recovered from a legendary hunter's collection. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Blessed Blade of the Umbral Regent",
		description:
			"An crafted weapon recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Sacred Blade of the Umbral Regent",
		description:
			"An crafted armor recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 43768,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0453",
		name: "Profane Blade of the Umbral Regent",
		description:
			"An ancient consumable recovered from a legendary hunter's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Mystic Blade of the Umbral Regent",
		description:
			"An crafted accessory recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Arcane Blade of the Umbral Regent",
		description:
			"An imbued scroll recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
			"An cursed weapon recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Frozen Blade of the Umbral Regent",
		description:
			"An forged armor recovered from a legendary hunter's collection. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 41447,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0458",
		name: "Thunder Blade of the Umbral Regent",
		description:
			"An forged consumable recovered from a forgotten dungeon. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Holy Blade of the Umbral Regent",
		description:
			"An awakened accessory recovered from a master techsmith. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Dark Blade of the Umbral Regent",
		description:
			"An cursed scroll recovered from a legendary hunter's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Shadow Sword of the Umbral Regent",
		description:
			"An forged weapon recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Eternal Sword of the Umbral Regent",
		description:
			"An awakened armor recovered from a master techsmith. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 34309,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0463",
		name: "Void Sword of the Umbral Regent",
		description:
			"An ancient consumable recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Abyssal Sword of the Umbral Regent",
		description:
			"An forged accessory recovered from a master techsmith. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Demonic Sword of the Umbral Regent",
		description:
			"An crafted scroll recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Celestial Sword of the Umbral Regent",
		description:
			"An enchanted weapon recovered from a legendary hunter's collection. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Divine Sword of the Umbral Regent",
		description:
			"An forged armor recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 1306,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0468",
		name: "Ancient Sword of the Umbral Regent",
		description:
			"An imbued consumable recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Forgotten Sword of the Umbral Regent",
		description:
			"An blessed accessory recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
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
		name: "Cursed Sword of the Umbral Regent",
		description:
			"An awakened scroll recovered from a legendary hunter's collection. Infused with poison energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Blessed Sword of the Umbral Regent",
		description:
			"An blessed weapon recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Sacred Sword of the Umbral Regent",
		description:
			"An blessed armor recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 23118,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0473",
		name: "Profane Sword of the Umbral Regent",
		description:
			"An enchanted consumable recovered from a master techsmith. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Mystic Sword of the Umbral Regent",
		description:
			"An crafted accessory recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Arcane Sword of the Umbral Regent",
		description:
			"An cursed scroll recovered from a fallen gate boss. Infused with radiant energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Infernal Sword of the Umbral Regent",
		description:
			"An blessed weapon recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Frozen Sword of the Umbral Regent",
		description:
			"An forged armor recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 75888,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0478",
		name: "Thunder Sword of the Umbral Regent",
		description:
			"An awakened consumable recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Holy Sword of the Umbral Regent",
		description:
			"An blessed accessory recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
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
		name: "Dark Sword of the Umbral Regent",
		description:
			"An cursed scroll recovered from a legendary hunter's collection. Infused with fire energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Shadow Dagger of the Umbral Regent",
		description:
			"An cursed weapon recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Eternal Dagger of the Umbral Regent",
		description:
			"An forged armor recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 25893,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0483",
		name: "Void Dagger of the Umbral Regent",
		description:
			"An cursed consumable recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Abyssal Dagger of the Umbral Regent",
		description:
			"An forged accessory recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Demonic Dagger of the Umbral Regent",
		description:
			"An ancient scroll recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Celestial Dagger of the Umbral Regent",
		description:
			"An crafted weapon recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Divine Dagger of the Umbral Regent",
		description:
			"An cursed armor recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 10511,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0488",
		name: "Ancient Dagger of the Umbral Regent",
		description:
			"An ancient consumable recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Forgotten Dagger of the Umbral Regent",
		description:
			"An crafted accessory recovered from a legendary hunter's collection. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Cursed Dagger of the Umbral Regent",
		description:
			"An crafted scroll recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Blessed Dagger of the Umbral Regent",
		description:
			"An cursed weapon recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Sacred Dagger of the Umbral Regent",
		description:
			"An ancient armor recovered from a legendary hunter's collection. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 68519,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0493",
		name: "Profane Dagger of the Umbral Regent",
		description:
			"An blessed consumable recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Mystic Dagger of the Umbral Regent",
		description:
			"An ancient accessory recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Arcane Dagger of the Umbral Regent",
		description:
			"An cursed scroll recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
		name: "Infernal Dagger of the Umbral Regent",
		description:
			"An forged weapon recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Frozen Dagger of the Umbral Regent",
		description:
			"An cursed armor recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
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
			value: 70148,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0498",
		name: "Thunder Dagger of the Umbral Regent",
		description:
			"An cursed consumable recovered from a master techsmith. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
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
		name: "Holy Dagger of the Umbral Regent",
		description:
			"An forged accessory recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
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
		name: "Dark Dagger of the Umbral Regent",
		description:
			"An ancient scroll recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
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
	{
		id: "item-0501",
		name: "Shadow Axe of the Umbral Regent",
		description:
			"An ancient weapon recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0501.webp",
		stats: {
			attack: 223,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 42812,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 42812,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0502",
		name: "Eternal Axe of the Umbral Regent",
		description:
			"An crafted armor recovered from a legendary hunter's collection. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0502.webp",
		stats: {
			defense: 224,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 29994,
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
			value: 29994,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0503",
		name: "Void Axe of the Umbral Regent",
		description:
			"An ancient consumable recovered from a legendary hunter's collection. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0503.webp",
		stats: {
			health: 161,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 31377,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 31377,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0504",
		name: "Abyssal Axe of the Umbral Regent",
		description:
			"An ancient accessory recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0504.webp",
		stats: {
			mana: 167,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 76196,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 76196,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0505",
		name: "Demonic Axe of the Umbral Regent",
		description:
			"An ancient scroll recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0505.webp",
		stats: {
			mana: 115,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 66860,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 66860,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0506",
		name: "Celestial Axe of the Umbral Regent",
		description:
			"An ancient weapon recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0506.webp",
		stats: {
			attack: 80,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 8495,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 8495,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0507",
		name: "Divine Axe of the Umbral Regent",
		description:
			"An enchanted armor recovered from a master techsmith. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0507.webp",
		stats: {
			defense: 172,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 72601,
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
			value: 72601,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0508",
		name: "Ancient Axe of the Umbral Regent",
		description:
			"An ancient consumable recovered from a legendary hunter's collection. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0508.webp",
		stats: {
			health: 120,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 69019,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 69019,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0509",
		name: "Forgotten Axe of the Umbral Regent",
		description:
			"An forged accessory recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0509.webp",
		stats: {
			mana: 121,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 58987,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 58987,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0510",
		name: "Cursed Axe of the Umbral Regent",
		description:
			"An forged scroll recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0510.webp",
		stats: {
			mana: 72,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 40048,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 40048,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0511",
		name: "Blessed Axe of the Umbral Regent",
		description:
			"An imbued weapon recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0511.webp",
		stats: {
			attack: 217,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 38175,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["The weapon returns to your hand when thrown (range 20/60)"],
			value: 38175,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0512",
		name: "Sacred Axe of the Umbral Regent",
		description:
			"An imbued armor recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0512.webp",
		stats: {
			defense: 171,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 80636,
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
			value: 80636,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0513",
		name: "Profane Axe of the Umbral Regent",
		description:
			"An forged consumable recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0513.webp",
		stats: {
			health: 429,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 40704,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 40704,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0514",
		name: "Mystic Axe of the Umbral Regent",
		description:
			"An imbued accessory recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0514.webp",
		stats: {
			mana: 96,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 98050,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 98050,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0515",
		name: "Arcane Axe of the Umbral Regent",
		description:
			"An imbued scroll recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0515.webp",
		stats: {
			mana: 233,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 83148,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 83148,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0516",
		name: "Infernal Axe of the Umbral Regent",
		description:
			"An cursed weapon recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0516.webp",
		stats: {
			attack: 222,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 100312,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 100312,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0517",
		name: "Frozen Axe of the Umbral Regent",
		description:
			"An awakened armor recovered from a legendary hunter's collection. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0517.webp",
		stats: {
			defense: 63,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 56666,
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
			value: 56666,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0518",
		name: "Thunder Axe of the Umbral Regent",
		description:
			"An crafted consumable recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0518.webp",
		stats: {
			health: 334,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 44939,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 44939,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0519",
		name: "Holy Axe of the Umbral Regent",
		description:
			"An imbued accessory recovered from the depths of an A-rank gate. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0519.webp",
		stats: {
			mana: 149,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 31533,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 31533,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0520",
		name: "Dark Axe of the Umbral Regent",
		description:
			"An enchanted scroll recovered from a forgotten dungeon. Infused with psychic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0520.webp",
		stats: {
			mana: 214,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 27080,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 27080,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0521",
		name: "Shadow Hammer of the Umbral Regent",
		description:
			"An forged weapon recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0521.webp",
		stats: {
			attack: 205,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 93469,
		weight: 5,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "bludgeoning",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 93469,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0522",
		name: "Eternal Hammer of the Umbral Regent",
		description:
			"An awakened armor recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0522.webp",
		stats: {
			defense: 171,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 2565,
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
			value: 2565,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0523",
		name: "Void Hammer of the Umbral Regent",
		description:
			"An awakened consumable recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0523.webp",
		stats: {
			health: 198,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 7439,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Restores 2d4+2 hit points when consumed",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 7439,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0524",
		name: "Abyssal Hammer of the Umbral Regent",
		description:
			"An cursed accessory recovered from a fallen gate boss. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0524.webp",
		stats: {
			mana: 222,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 5912,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 5912,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0525",
		name: "Demonic Hammer of the Umbral Regent",
		description:
			"An forged scroll recovered from a legendary hunter's collection. Infused with psychic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0525.webp",
		stats: {
			mana: 219,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 5811,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 5811,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0526",
		name: "Celestial Hammer of the Umbral Regent",
		description:
			"An forged weapon recovered from a master techsmith. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0526.webp",
		stats: {
			attack: 170,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 51895,
		weight: 5,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "bludgeoning",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 51895,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0527",
		name: "Divine Hammer of the Umbral Regent",
		description:
			"An enchanted armor recovered from the depths of an A-rank gate. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0527.webp",
		stats: {
			defense: 81,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 32735,
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
			value: 32735,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0528",
		name: "Ancient Hammer of the Umbral Regent",
		description:
			"An blessed consumable recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0528.webp",
		stats: {
			health: 449,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 79042,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 79042,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0529",
		name: "Forgotten Hammer of the Umbral Regent",
		description:
			"An awakened accessory recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0529.webp",
		stats: {
			mana: 201,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 72029,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 72029,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0530",
		name: "Cursed Hammer of the Umbral Regent",
		description:
			"An crafted scroll recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0530.webp",
		stats: {
			mana: 141,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 28676,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 28676,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0531",
		name: "Blessed Hammer of the Umbral Regent",
		description:
			"An ancient weapon recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0531.webp",
		stats: {
			attack: 235,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 74777,
		weight: 5,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "bludgeoning",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 74777,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0532",
		name: "Sacred Hammer of the Umbral Regent",
		description:
			"An ancient armor recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0532.webp",
		stats: {
			defense: 154,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 88991,
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
			value: 88991,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0533",
		name: "Profane Hammer of the Umbral Regent",
		description:
			"An imbued consumable recovered from a master techsmith. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0533.webp",
		stats: {
			health: 346,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 6518,
		weight: 0.5,
		effects: {
			passive: [
				"Allows the user to see invisible creatures for 10 minutes",
				"Restores 2d4+2 hit points when consumed",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 6518,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0534",
		name: "Mystic Hammer of the Umbral Regent",
		description:
			"An enchanted accessory recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0534.webp",
		stats: {
			mana: 75,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 33444,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 33444,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0535",
		name: "Arcane Hammer of the Umbral Regent",
		description:
			"An crafted scroll recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0535.webp",
		stats: {
			mana: 224,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 10480,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 10480,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0536",
		name: "Infernal Hammer of the Umbral Regent",
		description:
			"An blessed weapon recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0536.webp",
		stats: {
			attack: 232,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 74026,
		weight: 5,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "bludgeoning",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 74026,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0537",
		name: "Frozen Hammer of the Umbral Regent",
		description:
			"An forged armor recovered from a master techsmith. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0537.webp",
		stats: {
			defense: 221,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 75890,
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
			value: 75890,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0538",
		name: "Thunder Hammer of the Umbral Regent",
		description:
			"An ancient consumable recovered from a forgotten dungeon. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0538.webp",
		stats: {
			health: 385,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 94299,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 94299,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0539",
		name: "Holy Hammer of the Umbral Regent",
		description:
			"An crafted accessory recovered from a fallen gate boss. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0539.webp",
		stats: {
			mana: 179,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 19582,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 19582,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0540",
		name: "Dark Hammer of the Umbral Regent",
		description:
			"An imbued scroll recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0540.webp",
		stats: {
			mana: 70,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 51441,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 51441,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0541",
		name: "Shadow Staff of the Umbral Regent",
		description:
			"An crafted weapon recovered from a master techsmith. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0541.webp",
		stats: {
			attack: 151,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 96069,
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
			value: 96069,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0542",
		name: "Eternal Staff of the Umbral Regent",
		description:
			"An cursed armor recovered from a legendary hunter's collection. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0542.webp",
		stats: {
			defense: 72,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 76080,
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
			value: 76080,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0543",
		name: "Void Staff of the Umbral Regent",
		description:
			"An cursed consumable recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0543.webp",
		stats: {
			health: 408,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 40930,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Removes one condition affecting the user",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 40930,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0544",
		name: "Abyssal Staff of the Umbral Regent",
		description:
			"An awakened accessory recovered from the depths of an A-rank gate. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0544.webp",
		stats: {
			mana: 228,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 1580,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 1580,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0545",
		name: "Demonic Staff of the Umbral Regent",
		description:
			"An awakened scroll recovered from a master techsmith. Infused with psychic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0545.webp",
		stats: {
			mana: 66,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 3658,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 3658,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0546",
		name: "Celestial Staff of the Umbral Regent",
		description:
			"An ancient weapon recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0546.webp",
		stats: {
			attack: 120,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 99120,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d6",
				damageType: "bludgeoning",
				versatile: "1d8",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 99120,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0547",
		name: "Divine Staff of the Umbral Regent",
		description:
			"An enchanted armor recovered from a fallen gate boss. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0547.webp",
		stats: {
			defense: 177,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 64505,
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
			value: 64505,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0548",
		name: "Ancient Staff of the Umbral Regent",
		description:
			"An cursed consumable recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0548.webp",
		stats: {
			health: 451,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 31571,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Removes one condition affecting the user",
			],
			value: 31571,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0549",
		name: "Forgotten Staff of the Umbral Regent",
		description:
			"An forged accessory recovered from a legendary hunter's collection. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0549.webp",
		stats: {
			mana: 110,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 89184,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
			],
			value: 89184,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0550",
		name: "Cursed Staff of the Umbral Regent",
		description:
			"An awakened scroll recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0550.webp",
		stats: {
			mana: 111,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 46613,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 46613,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0551",
		name: "Blessed Staff of the Umbral Regent",
		description:
			"An ancient weapon recovered from the depths of an A-rank gate. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0551.webp",
		stats: {
			attack: 127,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 97103,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d6",
				damageType: "bludgeoning",
				versatile: "1d8",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 97103,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0552",
		name: "Sacred Staff of the Umbral Regent",
		description:
			"An cursed armor recovered from a master techsmith. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0552.webp",
		stats: {
			defense: 212,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 89365,
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
			value: 89365,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0553",
		name: "Profane Staff of the Umbral Regent",
		description:
			"An blessed consumable recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0553.webp",
		stats: {
			health: 119,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 59057,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Grants temporary hit points equal to your level for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 59057,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0554",
		name: "Mystic Staff of the Umbral Regent",
		description:
			"An enchanted accessory recovered from a master techsmith. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0554.webp",
		stats: {
			mana: 226,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 2516,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 2516,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0555",
		name: "Arcane Staff of the Umbral Regent",
		description:
			"An cursed scroll recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0555.webp",
		stats: {
			mana: 111,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 34399,
		weight: 0.1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 34399,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0556",
		name: "Infernal Staff of the Umbral Regent",
		description:
			"An ancient weapon recovered from the depths of an A-rank gate. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0556.webp",
		stats: {
			attack: 231,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 92390,
		weight: 4,
		properties: {
			weapon: {
				damage: "1d6",
				damageType: "bludgeoning",
				versatile: "1d8",
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 92390,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0557",
		name: "Frozen Staff of the Umbral Regent",
		description:
			"An awakened armor recovered from a master techsmith. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0557.webp",
		stats: {
			defense: 160,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 94392,
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
			value: 94392,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0558",
		name: "Thunder Staff of the Umbral Regent",
		description:
			"An blessed consumable recovered from the depths of an A-rank gate. Infused with poison energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0558.webp",
		stats: {
			health: 142,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 56509,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 56509,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0559",
		name: "Holy Staff of the Umbral Regent",
		description:
			"An ancient accessory recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0559.webp",
		stats: {
			mana: 130,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 69834,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 69834,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0560",
		name: "Dark Staff of the Umbral Regent",
		description:
			"An cursed scroll recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0560.webp",
		stats: {
			mana: 68,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 39219,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 39219,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0561",
		name: "Shadow Wand of the Umbral Regent",
		description:
			"An awakened weapon recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0561.webp",
		stats: {
			attack: 113,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 68796,
		weight: 1,
		properties: {
			weapon: {
				damage: "1d4",
				damageType: "force",
				range: 60,
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 68796,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0562",
		name: "Eternal Wand of the Umbral Regent",
		description:
			"An enchanted armor recovered from a fallen gate boss. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0562.webp",
		stats: {
			defense: 205,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 8889,
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
			value: 8889,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0563",
		name: "Void Wand of the Umbral Regent",
		description:
			"An awakened consumable recovered from a fallen gate boss. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0563.webp",
		stats: {
			health: 357,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 57789,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
				"Grants advantage on ability checks for 1 hour",
			],
			value: 57789,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0564",
		name: "Abyssal Wand of the Umbral Regent",
		description:
			"An crafted accessory recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0564.webp",
		stats: {
			mana: 159,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 94113,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants darkvision 60 feet if you don't already have it",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 94113,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0565",
		name: "Demonic Wand of the Umbral Regent",
		description:
			"An enchanted scroll recovered from the depths of an A-rank gate. Infused with acid energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0565.webp",
		stats: {
			mana: 199,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 54635,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 54635,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0566",
		name: "Celestial Wand of the Umbral Regent",
		description:
			"An blessed weapon recovered from a legendary hunter's collection. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0566.webp",
		stats: {
			attack: 213,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 43932,
		weight: 1,
		properties: {
			weapon: {
				damage: "1d4",
				damageType: "force",
				range: 60,
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 43932,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0567",
		name: "Divine Wand of the Umbral Regent",
		description:
			"An ancient armor recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0567.webp",
		stats: {
			defense: 172,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 70017,
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
			value: 70017,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0568",
		name: "Ancient Wand of the Umbral Regent",
		description:
			"An blessed consumable recovered from a fallen gate boss. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0568.webp",
		stats: {
			health: 470,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 16274,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Grants temporary hit points equal to your level for 1 hour",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 16274,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0569",
		name: "Forgotten Wand of the Umbral Regent",
		description:
			"An crafted accessory recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0569.webp",
		stats: {
			mana: 142,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 80650,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 80650,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0570",
		name: "Cursed Wand of the Umbral Regent",
		description:
			"An forged scroll recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0570.webp",
		stats: {
			mana: 154,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 10000,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You gain proficiency in one saving throw while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 10000,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0571",
		name: "Blessed Wand of the Umbral Regent",
		description:
			"An cursed weapon recovered from a legendary hunter's collection. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0571.webp",
		stats: {
			attack: 61,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 4894,
		weight: 1,
		properties: {
			weapon: {
				damage: "1d4",
				damageType: "force",
				range: 60,
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 4894,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0572",
		name: "Sacred Wand of the Umbral Regent",
		description:
			"An crafted armor recovered from a forgotten dungeon. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0572.webp",
		stats: {
			defense: 199,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 52799,
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
			value: 52799,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0573",
		name: "Profane Wand of the Umbral Regent",
		description:
			"An crafted consumable recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0573.webp",
		stats: {
			health: 108,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 12396,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 12396,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0574",
		name: "Mystic Wand of the Umbral Regent",
		description:
			"An blessed accessory recovered from a forgotten dungeon. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0574.webp",
		stats: {
			mana: 164,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 83712,
		weight: 1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 83712,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0575",
		name: "Arcane Wand of the Umbral Regent",
		description:
			"An enchanted scroll recovered from a master techsmith. Infused with poison energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0575.webp",
		stats: {
			mana: 87,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 30303,
		weight: 0.1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 30303,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0576",
		name: "Infernal Wand of the Umbral Regent",
		description:
			"An cursed weapon recovered from a master techsmith. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0576.webp",
		stats: {
			attack: 77,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 53571,
		weight: 1,
		properties: {
			weapon: {
				damage: "1d4",
				damageType: "force",
				range: 60,
			},
		},
		effects: {
			passive: ["You gain +1 to initiative while carrying this weapon"],
			value: 53571,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0577",
		name: "Frozen Wand of the Umbral Regent",
		description:
			"An cursed armor recovered from the depths of an A-rank gate. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0577.webp",
		stats: {
			defense: 113,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 7762,
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
			value: 7762,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0578",
		name: "Thunder Wand of the Umbral Regent",
		description:
			"An awakened consumable recovered from a legendary hunter's collection. Infused with psychic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0578.webp",
		stats: {
			health: 392,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 86413,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 86413,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0579",
		name: "Holy Wand of the Umbral Regent",
		description:
			"An forged accessory recovered from a legendary hunter's collection. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0579.webp",
		stats: {
			mana: 199,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 32319,
		weight: 1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
				"Once per day, reroll a failed saving throw",
			],
			value: 32319,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0580",
		name: "Dark Wand of the Umbral Regent",
		description:
			"An cursed scroll recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0580.webp",
		stats: {
			mana: 160,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 58737,
		weight: 0.1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants darkvision 60 feet if you don't already have it",
				"Grants +1 to one ability score while attuned",
			],
			value: 58737,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0581",
		name: "Shadow Orb of the Umbral Regent",
		description:
			"An awakened weapon recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0581.webp",
		stats: {
			attack: 196,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 31866,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 31866,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0582",
		name: "Eternal Orb of the Umbral Regent",
		description:
			"An imbued armor recovered from the depths of an A-rank gate. Infused with ice energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0582.webp",
		stats: {
			defense: 212,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 81589,
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
			value: 81589,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0583",
		name: "Void Orb of the Umbral Regent",
		description:
			"An awakened consumable recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0583.webp",
		stats: {
			health: 212,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 12021,
		weight: 0.5,
		effects: {
			passive: [
				"Grants advantage on ability checks for 1 hour",
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
			],
			value: 12021,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0584",
		name: "Abyssal Orb of the Umbral Regent",
		description:
			"An forged accessory recovered from a master techsmith. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0584.webp",
		stats: {
			mana: 240,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 72637,
		weight: 1,
		effects: {
			passive: [
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 72637,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0585",
		name: "Demonic Orb of the Umbral Regent",
		description:
			"An cursed scroll recovered from a master techsmith. Infused with psychic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0585.webp",
		stats: {
			mana: 195,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 49826,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"Once per day, reroll a failed saving throw",
				"Grants +1 to one ability score while attuned",
			],
			value: 49826,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0586",
		name: "Celestial Orb of the Umbral Regent",
		description:
			"An enchanted weapon recovered from the depths of an A-rank gate. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0586.webp",
		stats: {
			attack: 147,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 41704,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Once per day, the weapon can cast a cantrip-level effect"],
			value: 41704,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0587",
		name: "Divine Orb of the Umbral Regent",
		description:
			"An blessed armor recovered from the depths of an A-rank gate. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0587.webp",
		stats: {
			defense: 192,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 8254,
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
			value: 8254,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0588",
		name: "Ancient Orb of the Umbral Regent",
		description:
			"An ancient consumable recovered from a legendary hunter's collection. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0588.webp",
		stats: {
			health: 278,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 67139,
		weight: 0.5,
		effects: {
			passive: [
				"Removes one condition affecting the user",
				"Restores 2d4+2 hit points when consumed",
				"Grants temporary hit points equal to your level for 1 hour",
			],
			value: 67139,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0589",
		name: "Forgotten Orb of the Umbral Regent",
		description:
			"An ancient accessory recovered from a master techsmith. Infused with force energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0589.webp",
		stats: {
			mana: 161,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 87924,
		weight: 1,
		effects: {
			passive: [
				"You gain proficiency in one saving throw while attuned",
				"Grants +1 to one ability score while attuned",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 87924,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0590",
		name: "Cursed Orb of the Umbral Regent",
		description:
			"An imbued scroll recovered from the depths of an A-rank gate. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0590.webp",
		stats: {
			mana: 194,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 1787,
		weight: 0.1,
		effects: {
			passive: [
				"Grants darkvision 60 feet if you don't already have it",
				"You can cast Detect Magic at will while wearing this",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 1787,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0591",
		name: "Blessed Orb of the Umbral Regent",
		description:
			"An awakened weapon recovered from a forgotten dungeon. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0591.webp",
		stats: {
			attack: 83,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 98225,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Glows faintly when enemies are within 60 feet"],
			value: 98225,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0592",
		name: "Sacred Orb of the Umbral Regent",
		description:
			"An awakened armor recovered from a legendary hunter's collection. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0592.webp",
		stats: {
			defense: 185,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 14115,
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
			value: 14115,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0593",
		name: "Profane Orb of the Umbral Regent",
		description:
			"An enchanted consumable recovered from a fallen gate boss. Infused with fire energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0593.webp",
		stats: {
			health: 266,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 83685,
		weight: 0.5,
		effects: {
			passive: [
				"Grants temporary hit points equal to your level for 1 hour",
				"Allows the user to see invisible creatures for 10 minutes",
				"Restores 2d4+2 hit points when consumed",
			],
			value: 83685,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0594",
		name: "Mystic Orb of the Umbral Regent",
		description:
			"An imbued accessory recovered from a forgotten dungeon. Infused with thunder energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0594.webp",
		stats: {
			mana: 176,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 33303,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
			],
			value: 33303,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0595",
		name: "Arcane Orb of the Umbral Regent",
		description:
			"An awakened scroll recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0595.webp",
		stats: {
			mana: 184,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 25147,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"You gain proficiency in one saving throw while attuned",
				"Once per day, reroll a failed saving throw",
			],
			value: 25147,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0596",
		name: "Infernal Orb of the Umbral Regent",
		description:
			"An cursed weapon recovered from a fallen gate boss. Infused with acid energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0596.webp",
		stats: {
			attack: 242,
		},
		effect: "Grants enhanced weapon abilities and shadow power.",
		value: 61955,
		weight: 3,
		properties: {
			weapon: {
				damage: "1d8",
				damageType: "slashing",
			},
		},
		effects: {
			passive: ["Deals an extra 1d6 elemental damage on a critical hit"],
			value: 61955,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0597",
		name: "Frozen Orb of the Umbral Regent",
		description:
			"An awakened armor recovered from a master techsmith. Infused with radiant energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0597.webp",
		stats: {
			defense: 223,
		},
		effect: "Grants enhanced armor abilities and shadow power.",
		value: 62273,
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
			value: 62273,
		},
		source: "System Ascendant Canon",
	},
	{
		id: "item-0598",
		name: "Thunder Orb of the Umbral Regent",
		description:
			"An crafted consumable recovered from a forgotten dungeon. Infused with necrotic energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "rare",
		type: "consumable",
		image: "/generated/compendium/items/item-0598.webp",
		stats: {
			health: 125,
		},
		effect: "Grants enhanced consumable abilities and shadow power.",
		value: 74561,
		weight: 0.5,
		effects: {
			passive: [
				"Restores 2d4+2 hit points when consumed",
				"Removes one condition affecting the user",
				"Allows the user to see invisible creatures for 10 minutes",
			],
			value: 74561,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0599",
		name: "Holy Orb of the Umbral Regent",
		description:
			"An awakened accessory recovered from a forgotten dungeon. Infused with lightning energy, it resonates with power when wielded by a worthy hunter.",
		rarity: "epic",
		type: "accessory",
		image: "/generated/compendium/items/item-0599.webp",
		stats: {
			mana: 165,
		},
		effect: "Grants enhanced accessory abilities and shadow power.",
		value: 27709,
		weight: 1,
		effects: {
			passive: [
				"You can cast Detect Magic at will while wearing this",
				"Grants +1 to one ability score while attuned",
				"Grants darkvision 60 feet if you don't already have it",
			],
			value: 27709,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
	{
		id: "item-0600",
		name: "Dark Orb of the Umbral Regent",
		description:
			"An forged scroll recovered from a legendary hunter's collection. Infused with lightning energy, it resonates with power when wielded by a worthy hunter. Only a handful exist in the known world.",
		rarity: "legendary",
		type: "scroll",
		image: "/generated/compendium/items/item-0600.webp",
		stats: {
			mana: 64,
		},
		effect: "Grants enhanced scroll abilities and shadow power.",
		value: 46011,
		weight: 0.1,
		effects: {
			passive: [
				"Grants +1 to one ability score while attuned",
				"Once per day, reroll a failed saving throw",
				"You can cast Detect Magic at will while wearing this",
			],
			value: 46011,
		},
		attunement: true,
		source: "System Ascendant Canon",
	},
];
