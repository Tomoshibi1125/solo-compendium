import type { Item } from "./items";

export const items_part5: Item[] = [
	{
		id: "item_p5_0",
		name: "Obsidian Gauntlets",
		description:
			"Field-issued combat gauntlets for Striker-class Hunters and tactical brawlers.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0164.webp",
		weight: 8,
		value: 126,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d6",
		damage_type: "necrotic",
		simple_properties: ["light", "striker"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "necrotic",
			},
		},
		effects: {
			passive: [
				"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
				"+1d4 damage when attacking from an unseen position.",
				"Once per short rest, reroll a missed attack roll.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Carried by people who know the difference between a kill and a survival.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: [
			"equipment",
			"psychic",
			"single-target",
			"defensive",
			"stealth",
			"melee",
		],
		theme_tags: ["dungeon-core", "urban-combat"],
	},
	{
		id: "item_p5_1",
		name: "Abyssal Whip",
		description:
			"A finesse reach weapon â€” surprising on first contact, devastating with practice.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0021.webp",
		weight: 1,
		value: 84,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "necrotic",
		simple_properties: ["finesse", "reach"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "necrotic",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "debuff", "support", "melee"],
		theme_tags: ["dungeon-core", "rift-energy"],
	},
	{
		id: "item_p5_2",
		name: "Unstable Liquid Shadow",
		description:
			"A pocket-sized recovery potion. Standard kit for any Hunter on assignment.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0690.webp",
		weight: 4,
		value: 225,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Drink",
					description:
						"Action. Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: [
				"Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Bureau's standard answer to 'how are we still alive?'",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "buff", "offensive", "consumable"],
		theme_tags: ["experimental", "mana-overflow", "gate-zone"],
	},
	{
		id: "item_p5_3",
		name: "Mana-Infused Whip",
		description:
			"A control-class weapon for Hunters who prefer winning fights without finishing them.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0019.webp",
		weight: 3,
		value: 398,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "force",
		simple_properties: ["finesse", "reach"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "force",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+5 ft. to your speed while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "burst", "damage", "melee"],
		theme_tags: ["system-glitch", "guild-ops", "regent-era"],
	},
	{
		id: "item_p5_4",
		name: "Aetheric Gauntlets",
		description:
			"A reinforced gauntlet that turns unarmed strikes into solid kinetic blows.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0752.webp",
		weight: 6,
		value: 119,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d6",
		damage_type: "force",
		simple_properties: ["light", "striker"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "force",
			},
		},
		effects: {
			passive: [
				"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1 to one save of your choice while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "defensive", "fire", "lightning", "utility", "melee"],
		theme_tags: ["rift-energy", "system-glitch"],
	},
	{
		id: "item_p5_5",
		name: "Starlight Gauntlets",
		description:
			"A pair of impact gauntlets shaped for clinch fighting inside cramped gate corridors.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0481.webp",
		weight: 6,
		value: 296,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d4",
		damage_type: "radiant",
		simple_properties: ["light", "striker", "arcane focus"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "radiant",
			},
		},
		effects: {
			passive: [
				"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
				"On a critical hit, target is Blinded until the end of its next turn.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "sustained", "burst", "support", "melee"],
		theme_tags: ["guild-ops", "survival", "experimental"],
	},
	{
		id: "item_p5_6",
		name: "Purified Stamina Stim",
		description: "A Bureau-stamped emergency injector. Last-resort kit.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0254.webp",
		weight: 2,
		value: 431,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Inject",
					description:
						"Bonus action. Grants advantage on Investigation, Insight, and Sense saves for 10 minutes.",
					action: "bonus-action",
					frequency: "at-will",
				},
			],
			passive: [
				"Grants advantage on Investigation, Insight, and Sense saves for 10 minutes.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: [
			"equipment",
			"control",
			"offensive",
			"healing",
			"fire",
			"consumable",
		],
		theme_tags: ["elite-tier", "gate-zone", "experimental"],
	},
	{
		id: "item_p5_7",
		name: "Aegis Trench Coat",
		description:
			"A multi-layer combat coat woven from impact-resistant fabric.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0767.webp",
		weight: 6,
		value: 382,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Hand-finished by a Bureau master artificer working out of the Seoul Forge District.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: [
			"equipment",
			"perception",
			"burst",
			"single-target",
			"control",
			"armor",
		],
		theme_tags: ["shadow-domain", "ancient-power", "system-glitch"],
	},
	{
		id: "item_p5_8",
		name: "Shadow Combat Vest",
		description: "A Stalker-class light armor sized for extended gate sweeps.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0708.webp",
		weight: 8,
		value: 322,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"Disadvantage on attacks against you while you are obscured.",
				"Add +1d4 damage when target is below half HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Earned a footnote in the Hunter Association's quarterly equipment audit.",
			origin:
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "mobility", "offensive", "armor"],
		theme_tags: ["survival", "gate-zone", "elite-tier"],
	},
	{
		id: "item_p5_9",
		name: "Guild-Standard Aetheric Antidote",
		description:
			"A purifier vial labeled with the Bureau's medical-clearance stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0565.webp",
		weight: 1,
		value: 366,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Apply",
					description:
						"Action. Cures one of: charmed, frightened, poisoned, weakened.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: ["Cures one of: charmed, frightened, poisoned, weakened."],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: [
			"equipment",
			"debuff",
			"offensive",
			"damage",
			"sustained",
			"consumable",
		],
		theme_tags: ["system-glitch", "dimensional-bleed"],
	},
	{
		id: "item_p5_10",
		name: "Greater Mana Elixir",
		description:
			"A clear-glass restorative phial sealed with a Bureau quartermaster stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0085.webp",
		weight: 7,
		value: 245,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Drink",
					description: "Action. Restore 2d4 mana.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: ["On drink, restore 2d4 mana."],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "One dose. Make it count.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "damage", "defensive", "consumable"],
		theme_tags: ["rift-energy", "ancient-power"],
	},
	{
		id: "item_p5_11",
		name: "Aegis Bracers",
		description:
			"A wrist-worn focus and protective plate combined into one piece.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0228.webp",
		weight: 3,
		value: 417,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Boring kit. Boring kit comes home.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: [
			"equipment",
			"radiant",
			"lightning",
			"burst",
			"healing",
			"armor",
			"gear",
		],
		theme_tags: ["urban-combat", "system-glitch", "dungeon-core"],
	},
	{
		id: "item_p5_12",
		name: "Phantom Tactical Helmet",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0859.webp",
		weight: 5,
		value: 96,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
				"+1 to one save of your choice while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: [
			"equipment",
			"debuff",
			"single-target",
			"perception",
			"ice",
			"armor",
		],
		theme_tags: ["black-market", "guild-ops", "rift-energy"],
	},
	{
		id: "item_p5_13",
		name: "Gate-Forged Tactical Helmet",
		description: "Reinforced headgear with mana-treated impact lining.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0754.webp",
		weight: 4,
		value: 350,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Showed up in pawn shops across three districts before the Bureau issued a recall.",
			origin:
				"Brokered to a Hunter Association quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "burst", "radiant", "armor"],
		theme_tags: ["mana-overflow", "shadow-domain"],
	},
	{
		id: "item_p5_14",
		name: "Greater Health Potion",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0545.webp",
		weight: 5,
		value: 149,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Drink",
					description:
						"Action. Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: [
				"Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Read the label. Then drink anyway.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "area", "shadow", "stealth", "consumable"],
		theme_tags: ["classified", "modern-warfare", "regent-era"],
	},
	{
		id: "item_p5_15",
		name: "Crimson Gauntlets",
		description:
			"A pair of impact gauntlets shaped for clinch fighting inside cramped gate corridors.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0816.webp",
		weight: 6,
		value: 20,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d4",
		damage_type: "slashing",
		simple_properties: ["light", "striker", "arcane focus"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "slashing",
			},
		},
		effects: {
			passive: [
				"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
				"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Quiet, until it isn't.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "support", "single-target", "control", "melee"],
		theme_tags: ["black-market", "modern-warfare"],
	},
	{
		id: "item_p5_16",
		name: "Shattered Dagger",
		description: "A precision-balanced knife with a mana-treated edge.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0831.webp",
		weight: 2,
		value: 123,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d6",
		damage_type: "piercing",
		simple_properties: ["light", "finesse"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "piercing",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Crit on 19-20.",
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "single-target", "sustained", "melee"],
		theme_tags: ["guild-ops", "elite-tier", "dimensional-bleed"],
	},
	{
		id: "item_p5_17",
		name: "Guild-Standard Beast Repellent",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0294.webp",
		weight: 4,
		value: 339,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Drink",
					description:
						"Action. Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: [
				"Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "void", "defensive", "shadow", "damage", "consumable"],
		theme_tags: ["modern-warfare", "classified", "urban-combat"],
	},
	{
		id: "item_p5_18",
		name: "Aetheric Warhammer",
		description:
			"A reinforced sledge â€” for when an obstacle needs to stop being one.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0629.webp",
		weight: 5,
		value: 65,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "force",
		simple_properties: ["heavy", "two-handed"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "force",
			},
		},
		effects: {
			passive: [
				"On a hit, target makes a DC 13 Strength save or is knocked prone.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "damage", "psychic", "shadow", "stealth", "melee"],
		theme_tags: ["rift-energy", "mana-overflow", "hunter-bureau"],
	},
	{
		id: "item_p5_19",
		name: "Aetheric Dagger",
		description: "A precision-balanced knife with a mana-treated edge.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0532.webp",
		weight: 6,
		value: 24,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d6",
		damage_type: "force",
		simple_properties: ["light", "finesse"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "force",
				finesse: true,
			},
		},
		effects: {
			active: [
				{
					name: "Suppressive Volley",
					description:
						"As an action, force all creatures within a 15-ft. cone to make a DC 13 Agility save or take 2d6 damage of this weapon's type.",
					action: "action",
					dc: 13,
					frequency: "short-rest",
				},
			],
			passive: [
				"Crit on 19-20.",
				"On a hit, target loses 1 mana point (if any).",
				"Once per long rest, regain HP equal to half the damage dealt by a single hit.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Pulled from the gear locker of a mid-rank Hunter declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "sustained", "necrotic", "melee"],
		theme_tags: ["mana-overflow", "black-market", "rift-energy"],
	},
	{
		id: "item_p5_20",
		name: "Abyssal Whip",
		description: "A weighted whip for trip, disarm, and grappling work.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0324.webp",
		weight: 6,
		value: 126,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "necrotic",
		simple_properties: ["finesse", "reach"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "necrotic",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Sized for the wielder who finishes fights, not the one who starts them.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "buff", "mobility", "control", "melee"],
		theme_tags: ["guild-ops", "modern-warfare"],
	},
	{
		id: "item_p5_21",
		name: "Shadow Tactical Helmet",
		description: "Reinforced headgear with mana-treated impact lining.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0181.webp",
		weight: 7,
		value: 500,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Reinforced headgear. Advantage on saves vs. concussive impacts.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"+5 ft. to your speed while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "debuff", "utility", "armor"],
		theme_tags: ["hunter-bureau", "rift-energy", "guild-ops"],
	},
	{
		id: "item_p5_22",
		name: "Crimson Sniper Rifle",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0850.webp",
		weight: 1,
		value: 141,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d8",
		damage_type: "slashing",
		simple_properties: ["ammunition", "two-handed", "burst-fire"],
		range: "Ranged (60/180)",
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "slashing",
				range: 60,
			},
		},
		effects: {
			passive: [
				"Auto-rifle. Burst-fire (3 rd, +1d6) on a single attack.",
				"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "single-target", "ice", "necrotic", "firearm"],
		theme_tags: ["modern-warfare", "rift-energy"],
	},
	{
		id: "item_p5_23",
		name: "Nano-Weave Spaulders",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0955.webp",
		weight: 6,
		value: 286,
		item_type: "armor",
		armor_class: "15",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "single-target", "stealth", "armor"],
		theme_tags: ["classified", "mana-overflow"],
	},
	{
		id: "item_p5_24",
		name: "Abyssal Whip",
		description:
			"A reinforced whip used by control-style Hunters to disarm and entangle.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0640.webp",
		weight: 6,
		value: 451,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d6",
		damage_type: "necrotic",
		simple_properties: ["finesse", "reach"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "necrotic",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Reach. On a hit, target makes a DC 11 Agility save or is pulled 5 ft. toward you.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"+5 ft. to your speed while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Pulled from the gear locker of a mid-rank Hunter declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "shadow", "lightning", "melee"],
		theme_tags: ["classified", "regent-era"],
	},
	{
		id: "item_p5_25",
		name: "Nano-Weave Combat Vest",
		description: "A Stalker-class light armor sized for extended gate sweeps.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0625.webp",
		weight: 1,
		value: 117,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"+1 to attack rolls when at full HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "support", "perception", "armor"],
		theme_tags: ["black-market", "urban-combat", "dungeon-core"],
	},
	{
		id: "item_p5_26",
		name: "Vanguard Exo-Suit",
		description:
			"A compact tactical layer designed for fast movers operating inside C-rank gates.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0398.webp",
		weight: 1,
		value: 435,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Pulled from the gear locker of a mid-rank Hunter declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "stealth", "ice", "burst", "armor"],
		theme_tags: ["regent-era", "rift-energy"],
	},
	{
		id: "item_p5_27",
		name: "Nano-Weave Breastplate",
		description:
			"A full-coverage heavy carapace built for vanguard tanks holding gate breaches.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0911.webp",
		weight: 7,
		value: 295,
		item_type: "armor",
		armor_class: "15",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "stealth", "fire", "armor"],
		theme_tags: ["urban-combat", "elite-tier"],
	},
	{
		id: "item_p5_28",
		name: "Shattered Longsword",
		description:
			"A reliable mid-weight blade â€” the kind every Hunter learns on, and many never replace.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0812.webp",
		weight: 4,
		value: 383,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "slashing",
		simple_properties: ["versatile (1d12)", "two-handed-bonus"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "slashing",
				versatile: "1d12",
			},
		},
		effects: {
			passive: [
				"When wielded two-handed, +1 to damage rolls.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "What survives a Hunter's tour usually outlives the Hunter.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "control", "defensive", "radiant", "utility", "melee"],
		theme_tags: ["dungeon-core", "rift-energy"],
	},
	{
		id: "item_p5_29",
		name: "Lesser Health Potion",
		description:
			"A regulated alchemical compound. Restores hit points on consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0669.webp",
		weight: 8,
		value: 425,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Drink",
					description:
						"Action. Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: [
				"Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "shadow", "necrotic", "burst", "consumable"],
		theme_tags: ["guild-ops", "elite-tier", "dungeon-core"],
	},
	{
		id: "item_p5_30",
		name: "Aether-Plated Combat Vest",
		description:
			"Modern light armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0007.webp",
		weight: 2,
		value: 273,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Resistance to force damage.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Made a brief appearance in a guild quartermaster's leaving inventory dispute.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "single-target", "void", "sustained", "armor"],
		theme_tags: ["experimental", "gate-zone"],
	},
	{
		id: "item_p5_31",
		name: "Lesser Mana Elixir",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0270.webp",
		weight: 3,
		value: 462,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Drink",
					description: "Action. Restore 2d4 mana.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: ["On drink, restore 2d4 mana."],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Recommissioned three times across its service life. Inspected at every reissue.",
			origin:
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "damage", "void", "consumable"],
		theme_tags: ["regent-era", "urban-combat"],
	},
	{
		id: "item_p5_32",
		name: "Shattered Halberd",
		description:
			"A balanced spear with a reinforced shaft and mana-conductive head.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0481.webp",
		weight: 6,
		value: 340,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "piercing",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "piercing",
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Hand-built in a clandestine Daejeon workshop and sold through the gray market.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "psychic", "stealth", "burst", "utility", "melee"],
		theme_tags: ["guild-ops", "shadow-domain", "mana-overflow"],
	},
	{
		id: "item_p5_33",
		name: "Nano-Weave Spaulders",
		description:
			"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0776.webp",
		weight: 2,
		value: 167,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Reinforced carapace. AC 16. Stealth disadvantage.",
				"+1 to one save of your choice while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Brokered to a Hunter Association quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "healing", "buff", "psychic", "armor"],
		theme_tags: ["regent-era", "rift-energy", "mana-overflow"],
	},
	{
		id: "item_p5_34",
		name: "Obsidian Dagger",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0035.webp",
		weight: 8,
		value: 284,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d6",
		damage_type: "necrotic",
		simple_properties: ["light", "finesse"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "necrotic",
				finesse: true,
			},
		},
		effects: {
			active: [
				{
					name: "Disengaging Strike",
					description:
						"As an action, make a weapon attack and immediately move up to your speed without provoking opportunity attacks.",
					action: "action",
					frequency: "short-rest",
				},
			],
			passive: [
				"Crit on 19-20.",
				"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
				"On a hit, target's speed is reduced by 5 ft. until the start of your next turn.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "buff", "psychic", "sustained", "melee"],
		theme_tags: ["mana-overflow", "guild-ops"],
	},
	{
		id: "item_p5_35",
		name: "Nano-Weave Tactical Helmet",
		description: "Bureau-issued head protection, lightweight and fitted.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0970.webp",
		weight: 5,
		value: 291,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		requires_attunement: true,
		properties: {},
		effects: {
			active: [
				{
					name: "Steady Aim",
					description:
						"As a bonus action, your next ranged attack before the end of your turn ignores cover and gains advantage.",
					action: "bonus-action",
					frequency: "short-rest",
				},
			],
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced headgear. Advantage on saves vs. concussive impacts.",
				"Critical hits with this item ignore resistance to its damage type.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
			origin:
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "debuff", "void", "defensive", "armor"],
		theme_tags: ["guild-ops", "elite-tier"],
	},
	{
		id: "item_p5_36",
		name: "Abyssal Spear",
		description: "A reach weapon used by Bureau gate-line teams.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0037.webp",
		weight: 8,
		value: 171,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "2d4",
		damage_type: "necrotic",
		simple_properties: ["reach", "two-handed", "thrown"],
		properties: {
			weapon: {
				damage: "2d4",
				damage_type: "necrotic",
			},
		},
		effects: {
			passive: [
				"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Showed up in pawn shops across three districts before the Bureau issued a recall.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "radiant", "void", "debuff", "melee"],
		theme_tags: ["dungeon-core", "ancient-power"],
	},
	{
		id: "item_p5_37",
		name: "Lattice-Scale Exo-Suit",
		description:
			"A flexible mana-weave layer that beads ichor and shrugs off minor concussive impacts.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0180.webp",
		weight: 3,
		value: 416,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Resistance to force damage.",
				"+5 ft. to your speed while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "stealth", "lightning", "defensive", "armor"],
		theme_tags: ["experimental", "system-glitch"],
	},
	{
		id: "item_p5_38",
		name: "Unstable Beast Repellent",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0295.webp",
		weight: 4,
		value: 77,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Drink",
					description: "Action. Drink the potion. Restore 2d4 + 2 HP.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: ["On drink, restore 2d4 + 2 hit points."],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "void", "defensive", "consumable"],
		theme_tags: ["dungeon-core", "post-awakening", "elite-tier"],
	},
	{
		id: "item_p5_39",
		name: "Phantom Breastplate",
		description:
			"A full-coverage heavy carapace built for vanguard tanks holding gate breaches.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0814.webp",
		weight: 1,
		value: 458,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Reinforced carapace. AC 16. Stealth disadvantage.",
				"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: [
			"equipment",
			"single-target",
			"support",
			"healing",
			"psychic",
			"armor",
		],
		theme_tags: ["gate-zone", "dimensional-bleed"],
	},
	{
		id: "item_p5_40",
		name: "Ceramic Shin Guards",
		description:
			"A reinforced kevlar-and-mana-weave layer. Cheap, common, effective.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0350.webp",
		weight: 6,
		value: 169,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"+1 to attack rolls when at full HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "ice", "stealth", "debuff", "armor"],
		theme_tags: ["forbidden", "shadow-domain", "survival"],
	},
	{
		id: "item_p5_41",
		name: "Greater Stamina Stim",
		description: "A pre-measured combat stim with Bureau-coded markings.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0087.webp",
		weight: 2,
		value: 107,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Inject",
					description:
						"Bonus action. Grants resistance to non-magical bludgeoning, piercing, and slashing for 1 minute.",
					action: "bonus-action",
					frequency: "at-will",
				},
			],
			passive: [
				"Grants resistance to non-magical bludgeoning, piercing, and slashing for 1 minute.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw heavy rotation among second-strike teams during the Busan Incident.",
			origin:
				"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
			personality: "",
			prior_owners: [],
		},
		flavor: "For the part of the fight that comes after the fight.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "perception", "burst", "control", "consumable"],
		theme_tags: ["dimensional-bleed", "rift-energy", "dungeon-core"],
	},
	{
		id: "item_p5_42",
		name: "Lesser Liquid Shadow",
		description:
			"A regulated alchemical compound. Restores hit points on consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0872.webp",
		weight: 7,
		value: 209,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Drink",
					description:
						"Action. Grants 5 + Vitality temporary HP for 10 minutes.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: [
				"Grants 5 + Vitality temporary HP for 10 minutes.",
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Bureau's standard answer to 'how are we still alive?'",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "stealth", "support", "consumable"],
		theme_tags: ["urban-combat", "survival", "post-awakening"],
	},
	{
		id: "item_p5_43",
		name: "Aetheric Warhammer",
		description:
			"A demolition-grade hammer with reinforced grip and a mana-stable striking surface.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0601.webp",
		weight: 5,
		value: 497,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d12",
		damage_type: "force",
		simple_properties: ["heavy", "two-handed"],
		properties: {
			weapon: {
				damage: "1d12",
				damage_type: "force",
			},
		},
		effects: {
			passive: [
				"Crit on 19-20. Critical hits push target 5 ft.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Quiet, until it isn't.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "perception", "sustained", "melee"],
		theme_tags: ["elite-tier", "forbidden"],
	},
	{
		id: "item_p5_44",
		name: "Aetheric Warhammer",
		description:
			"A massive impact weapon balanced for sweeping strikes and structural breaks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0810.webp",
		weight: 3,
		value: 177,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "2d6",
		damage_type: "force",
		simple_properties: ["heavy", "two-handed", "loading"],
		properties: {
			weapon: {
				damage: "2d6",
				damage_type: "force",
			},
		},
		effects: {
			passive: [
				"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
				"On a hit, target loses 1 mana point (if any).",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "offensive", "area", "lightning", "debuff", "melee"],
		theme_tags: ["forbidden", "modern-warfare", "shadow-domain"],
	},
	{
		id: "item_p5_45",
		name: "Starlight Warhammer",
		description:
			"A massive impact weapon balanced for sweeping strikes and structural breaks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0139.webp",
		weight: 8,
		value: 482,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "radiant",
		simple_properties: ["heavy", "two-handed"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "radiant",
			},
		},
		effects: {
			passive: [
				"On a hit, target makes a DC 13 Strength save or is knocked prone.",
				"On a critical hit, target is Blinded until the end of its next turn.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: [
			"equipment",
			"single-target",
			"support",
			"psychic",
			"shadow",
			"melee",
		],
		theme_tags: ["post-awakening", "shadow-domain", "modern-warfare"],
	},
	{
		id: "item_p5_46",
		name: "Hunter's Katana",
		description:
			"A versatile blade â€” single-handed for speed, two-handed for finishing strokes.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0284.webp",
		weight: 1,
		value: 487,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "slashing",
		simple_properties: ["versatile (1d12)", "two-handed-bonus"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "slashing",
				versatile: "1d12",
			},
		},
		effects: {
			passive: [
				"When wielded two-handed, +1 to damage rolls.",
				"+1 to one save of your choice while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "psychic", "healing", "melee"],
		theme_tags: ["hunter-bureau", "modern-warfare", "rift-energy"],
	},
	{
		id: "item_p5_47",
		name: "Shadow Bracers",
		description:
			"A Bureau-issued forearm guard for Hunters operating melee-forward.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0141.webp",
		weight: 8,
		value: 409,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Small enough to forget. Big enough to matter when it counts.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "necrotic", "stealth", "gear"],
		theme_tags: ["black-market", "mana-overflow"],
	},
	{
		id: "item_p5_48",
		name: "Aegis Trench Coat",
		description:
			"A compact tactical layer designed for fast movers operating inside C-rank gates.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0062.webp",
		weight: 2,
		value: 377,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"Once per short rest, treat a single failed Vitality save as a success.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "fire", "healing", "necrotic", "armor"],
		theme_tags: ["ancient-power", "forbidden", "dimensional-bleed"],
	},
	{
		id: "item_p5_49",
		name: "Starlight Longsword",
		description:
			"A balanced blade with a fuller groove that channels excess kinetic mana.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0575.webp",
		weight: 6,
		value: 49,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "radiant",
		simple_properties: ["versatile (1d10)"],
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "radiant",
				versatile: "1d10",
			},
		},
		effects: {
			passive: [
				"Counts as both slashing and piercing for resistance bypass.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw heavy rotation among second-strike teams during the Busan Incident.",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "void", "support", "damage", "radiant", "melee"],
		theme_tags: ["survival", "regent-era"],
	},
];
