import type { Item } from "./items";

export const items_part6: Item[] = [
	{
		id: "item_p6_0",
		name: "Void Katana",
		description:
			"A mid-weight longsword with a Bureau-stamped pommel and reinforced grip.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0368.webp",
		weight: 1,
		value: 222,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "necrotic",
		simple_properties: ["versatile (1d10)"],
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "necrotic",
				versatile: "1d10",
			},
		},
		effects: {
			passive: [
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Don't trust a weapon you can't put down.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "debuff", "stealth", "fire", "melee"],
		theme_tags: ["regent-era", "forbidden"],
	},
	{
		id: "item_p6_1",
		name: "Guild-Issue Spear",
		description:
			"A two-handed reach weapon â€” good against fast, low-ground anomalies.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0097.webp",
		weight: 6,
		value: 222,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "slashing",
		simple_properties: ["heavy", "reach", "two-handed"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "slashing",
			},
		},
		effects: {
			active: [
				{
					name: "Lattice Pulse",
					description:
						"As an action, emit a 15-ft. cone pulse. Each creature in the cone makes a DC 13 Vitality save, taking 3d6 force damage on a fail (half on success).",
					action: "action",
					dc: 13,
					frequency: "short-rest",
				},
			],
			passive: [
				"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
				"While attuned, gain +1 to one ability score (max 20).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "radiant", "shadow", "debuff", "melee"],
		theme_tags: ["regent-era", "dungeon-core", "urban-combat"],
	},
	{
		id: "item_p6_2",
		name: "Unstable Mana Elixir",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0902.webp",
		weight: 8,
		value: 361,
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
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "burst", "support", "consumable"],
		theme_tags: ["regent-era", "forbidden", "urban-combat"],
	},
	{
		id: "item_p6_3",
		name: "Greater Health Potion",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0383.webp",
		weight: 3,
		value: 150,
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
				"Earned a footnote in the Hunter Association's quarterly equipment audit.",
			origin:
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "utility", "debuff", "burst", "consumable"],
		theme_tags: ["regent-era", "ancient-power"],
	},
	{
		id: "item_p6_4",
		name: "Starlight Spear",
		description:
			"A two-handed reach weapon â€” good against fast, low-ground anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0828.webp",
		weight: 3,
		value: 108,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "radiant",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "radiant",
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a critical hit, target is Blinded until the end of its next turn.",
				"Once per short rest, reroll a missed attack roll.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "mobility", "area", "fire", "melee"],
		theme_tags: ["dimensional-bleed", "ancient-power", "dungeon-core"],
	},
	{
		id: "item_p6_5",
		name: "Aegis Exo-Suit",
		description: "A composite shield with mana-stable plating.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0685.webp",
		weight: 3,
		value: 299,
		item_type: "shield",
		armor_class: "+2",
		armor_type: "Shield",
		requires_attunement: true,
		properties: {},
		effects: {
			active: [
				{
					name: "Phase Step",
					description:
						"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
					action: "bonus-action",
					frequency: "short-rest",
				},
			],
			passive: [
				"Provides +3 AC while wielded.",
				"Buckler. +2 AC. Counts as a free hand for casting somatic components.",
				"+2 to attack rolls against creatures with more HP than you.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw heavy rotation among second-strike teams during the Busan Incident.",
			origin:
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "lightning", "buff", "shadow", "mobility", "armor"],
		theme_tags: ["mana-overflow", "guild-ops", "gate-zone"],
	},
	{
		id: "item_p6_6",
		name: "Concentrated Mana Elixir",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0322.webp",
		weight: 2,
		value: 482,
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
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: [
			"equipment",
			"defensive",
			"sustained",
			"radiant",
			"buff",
			"consumable",
		],
		theme_tags: ["modern-warfare", "hunter-bureau", "elite-tier"],
	},
	{
		id: "item_p6_7",
		name: "Lattice-Scale Exo-Suit",
		description:
			"A modern Bureau armor jacket built for fast extraction and door-to-door work.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0683.webp",
		weight: 8,
		value: 478,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		requires_attunement: true,
		properties: {},
		effects: {
			active: [
				{
					name: "Phase Step",
					description:
						"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
					action: "bonus-action",
					frequency: "short-rest",
				},
			],
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Resistance to force damage.",
				"Once per long rest, cast a 2nd-level spell (player choice) without expending a spell slot.",
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
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "radiant", "control", "defensive", "armor"],
		theme_tags: ["elite-tier", "classified"],
	},
	{
		id: "item_p6_8",
		name: "Aetheric Dagger",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0656.webp",
		weight: 8,
		value: 43,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "force",
		simple_properties: ["light", "finesse", "thrown"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "force",
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
				"Off-hand attack on a hit deals +1 damage if you are wielding two weapons.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1d4 damage against creatures of the Anomaly tag.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It does the job. That's all the Bureau asks of it.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "utility", "damage", "melee"],
		theme_tags: ["regent-era", "elite-tier", "classified"],
	},
	{
		id: "item_p6_9",
		name: "Titanium Breastplate",
		description:
			"A reinforced battle-plate composed of layered ichor-treated sections.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0641.webp",
		weight: 5,
		value: 490,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Reinforced carapace. AC 16. Stealth disadvantage.",
				"+1 to attack rolls when at full HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "utility", "defensive", "armor"],
		theme_tags: ["guild-ops", "urban-combat", "dimensional-bleed"],
	},
	{
		id: "item_p6_10",
		name: "Lesser Liquid Shadow",
		description:
			"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0529.webp",
		weight: 7,
		value: 215,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Drink",
					description: "Action. Restores HP on consumption.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: [
				"Restores HP on consumption.",
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "utility", "necrotic", "consumable"],
		theme_tags: ["dungeon-core", "rift-energy", "guild-ops"],
	},
	{
		id: "item_p6_11",
		name: "Shattered Sniper Rifle",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0800.webp",
		weight: 6,
		value: 187,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d12",
		damage_type: "piercing",
		simple_properties: ["ammunition", "two-handed", "loading"],
		range: "Ranged (100/400)",
		properties: {
			weapon: {
				damage: "1d12",
				damage_type: "piercing",
				range: 100,
			},
		},
		effects: {
			passive: [
				"Bolt-action. One attack per turn; +1 to attack rolls.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Carried by people who know the difference between a kill and a survival.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "void", "damage", "lightning", "offensive", "firearm"],
		theme_tags: ["rift-energy", "shadow-domain", "hunter-bureau"],
	},
	{
		id: "item_p6_12",
		name: "Vanguard Tactical Helmet",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0039.webp",
		weight: 8,
		value: 460,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Comfort is a luxury. Coming back is the requirement.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "defensive", "void", "debuff", "armor"],
		theme_tags: ["ancient-power", "black-market", "gate-zone"],
	},
	{
		id: "item_p6_13",
		name: "Lattice-Scale Breastplate",
		description:
			"Heavy carapace plating; favored by S-rank tanks and Holy Knights.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0550.webp",
		weight: 7,
		value: 111,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		requires_attunement: true,
		properties: {},
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
				"Provides AC 16. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Resistance to force damage.",
				"Crit on 19-20 against creatures with damage vulnerability to this weapon's damage type.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Surfaced in the Hunter Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "utility", "buff", "armor"],
		theme_tags: ["hunter-bureau", "modern-warfare", "mana-overflow"],
	},
	{
		id: "item_p6_14",
		name: "Concentrated Aetheric Antidote",
		description:
			"A Bureau-graded antidote calibrated for the most common gate-acquired afflictions.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0341.webp",
		weight: 6,
		value: 428,
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
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "burst", "necrotic", "consumable"],
		theme_tags: ["elite-tier", "regent-era"],
	},
	{
		id: "item_p6_15",
		name: "Obsidian Dagger",
		description:
			"A light blade balanced for finesse strikes. Common in close-quarters Hunter loadouts.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0228.webp",
		weight: 5,
		value: 154,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d6",
		damage_type: "necrotic",
		simple_properties: ["light", "finesse"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "necrotic",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"+1 to attack rolls when you have advantage.",
				"While in dim light or darkness, attacks with this weapon have advantage.",
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Showed up in pawn shops across three districts before the Bureau issued a recall.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It will only ever be as deadly as the hand that holds it.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "area", "ice", "melee"],
		theme_tags: ["elite-tier", "dungeon-core", "shadow-domain"],
	},
	{
		id: "item_p6_16",
		name: "Gate-Forged Bracers",
		description:
			"A Bureau-issued forearm guard for Hunters operating melee-forward.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0067.webp",
		weight: 2,
		value: 202,
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
				"Recommissioned three times across its service life. Inspected at every reissue.",
			origin:
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "defensive", "single-target", "gear"],
		theme_tags: ["dimensional-bleed", "system-glitch"],
	},
	{
		id: "item_p6_17",
		name: "Guild-Issue Revolver",
		description:
			"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0994.webp",
		weight: 2,
		value: 21,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d10",
		damage_type: "piercing",
		simple_properties: ["ammunition"],
		range: "Ranged (40/120)",
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "piercing",
				range: 40,
			},
		},
		effects: {
			passive: [
				"Magnum-frame. -1 to attack within 5 ft.",
				"+5 ft. to your speed while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Hand-built in a clandestine Daejeon workshop and sold through the gray market.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It will only ever be as deadly as the hand that holds it.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "control", "sustained", "firearm"],
		theme_tags: ["black-market", "dungeon-core"],
	},
	{
		id: "item_p6_18",
		name: "Starlight Halberd",
		description:
			"A two-handed reach weapon â€” good against fast, low-ground anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0241.webp",
		weight: 6,
		value: 83,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "radiant",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "radiant",
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a critical hit, target is Blinded until the end of its next turn.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Stayed in service longer than expected, primarily because nothing newer was available.",
			origin:
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "sustained", "defensive", "shadow", "melee"],
		theme_tags: ["hunter-bureau", "dimensional-bleed"],
	},
	{
		id: "item_p6_19",
		name: "Shattered Gauntlets",
		description:
			"A reinforced gauntlet that turns unarmed strikes into solid kinetic blows.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0512.webp",
		weight: 3,
		value: 199,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d4",
		damage_type: "force",
		simple_properties: ["light", "striker", "arcane focus"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "force",
			},
		},
		effects: {
			passive: [
				"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
				"Once per short rest, treat a single failed Vitality save as a success.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Passed quietly between three guildhalls before settling into the Bureau's surplus cycle.",
			origin:
				"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: [
			"equipment",
			"mobility",
			"offensive",
			"necrotic",
			"radiant",
			"melee",
		],
		theme_tags: ["system-glitch", "regent-era"],
	},
	{
		id: "item_p6_20",
		name: "Black-Market Liquid Shadow",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0248.webp",
		weight: 3,
		value: 118,
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
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "For the part of the fight that comes after the fight.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "debuff", "support", "lightning", "consumable"],
		theme_tags: ["classified", "modern-warfare", "ancient-power"],
	},
	{
		id: "item_p6_21",
		name: "Gate-Forged Combat Vest",
		description:
			"A multi-layer combat coat woven from impact-resistant fabric.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-1009.webp",
		weight: 4,
		value: 279,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"On a hit against a target you have not attacked this turn, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Sourced from the post-clear loot dispersion of a successful A-rank gate operation.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "psychic", "burst", "armor"],
		theme_tags: ["forbidden", "regent-era", "shadow-domain"],
	},
	{
		id: "item_p6_22",
		name: "Void Spear",
		description:
			"A halberd-class polearm cut for sweeping arcs and thrust finishes.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0774.webp",
		weight: 3,
		value: 258,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "necrotic",
		simple_properties: ["heavy", "reach", "two-handed"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "necrotic",
			},
		},
		effects: {
			active: [
				{
					name: "Mana Surge",
					description:
						"As a bonus action, regain 1 spell slot of 2nd level or lower.",
					action: "bonus-action",
					frequency: "long-rest",
				},
			],
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"+1d4 damage against creatures of the Anomaly tag.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "single-target", "healing", "melee"],
		theme_tags: ["regent-era", "urban-combat", "shadow-domain"],
	},
	{
		id: "item_p6_23",
		name: "Shattered Sniper Rifle",
		description:
			"A precision rifle with mana-stable optics. Effective against armored anomalies at extended range.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0263.webp",
		weight: 4,
		value: 398,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d10",
		damage_type: "piercing",
		simple_properties: ["ammunition", "two-handed"],
		range: "Ranged (80/240)",
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "piercing",
				range: 80,
			},
		},
		effects: {
			active: [
				{
					name: "Phase Step",
					description:
						"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
					action: "bonus-action",
					frequency: "short-rest",
				},
			],
			passive: [
				"Long-arm. Disadvantage on attacks within 5 ft.",
				"Critical hits with this item ignore resistance to its damage type.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Heavy in the hand. Heavier in consequence.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "fire", "lightning", "stealth", "control", "firearm"],
		theme_tags: ["system-glitch", "experimental"],
	},
	{
		id: "item_p6_24",
		name: "Abyssal Warhammer",
		description: "A two-handed warhammer built to crater armored targets.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0708.webp",
		weight: 7,
		value: 470,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d12",
		damage_type: "necrotic",
		simple_properties: ["heavy", "two-handed"],
		properties: {
			weapon: {
				damage: "1d12",
				damage_type: "necrotic",
			},
		},
		effects: {
			passive: [
				"Crit on 19-20. Critical hits push target 5 ft.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "buff", "utility", "defensive", "support", "melee"],
		theme_tags: ["regent-era", "survival", "black-market"],
	},
	{
		id: "item_p6_25",
		name: "Void Katana",
		description: "A Bureau-grade longsword with a mana-conductive crossguard.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0565.webp",
		weight: 1,
		value: 316,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "necrotic",
		simple_properties: ["versatile (1d12)", "two-handed-bonus"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "necrotic",
				versatile: "1d12",
			},
		},
		effects: {
			active: [
				{
					name: "Mana Surge",
					description:
						"As a bonus action, regain 1 spell slot of 2nd level or lower.",
					action: "bonus-action",
					frequency: "long-rest",
				},
			],
			passive: [
				"When wielded two-handed, +1 to damage rolls.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"+1d4 damage against creatures with the Construct or Anomaly tag.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Don't trust a weapon you can't put down.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "sustained", "healing", "area", "melee"],
		theme_tags: ["mana-overflow", "hunter-bureau"],
	},
	{
		id: "item_p6_26",
		name: "Black-Market Liquid Shadow",
		description: "A regulated emergency draught. Quick draw, reliable effect.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0202.webp",
		weight: 8,
		value: 395,
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
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "One dose. Make it count.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "void", "sustained", "offensive", "area", "consumable"],
		theme_tags: ["dimensional-bleed", "survival", "black-market"],
	},
	{
		id: "item_p6_27",
		name: "Purified Mana Elixir",
		description:
			"A pocket-sized recovery potion. Standard kit for any Hunter on assignment.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0291.webp",
		weight: 7,
		value: 254,
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
				"Pulled from the gear locker of a mid-rank Hunter declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "psychic", "burst", "consumable"],
		theme_tags: ["dimensional-bleed", "regent-era"],
	},
	{
		id: "item_p6_28",
		name: "Lattice-Scale Tactical Helmet",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0536.webp",
		weight: 4,
		value: 116,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		requires_attunement: true,
		properties: {},
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
				"Provides AC 12 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
				"+1 to spell-save DCs while worn.",
				"+1d4 damage against creatures of the Anomaly tag.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "perception", "radiant", "void", "armor"],
		theme_tags: ["post-awakening", "system-glitch"],
	},
	{
		id: "item_p6_29",
		name: "Phantom Tactical Helmet",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0265.webp",
		weight: 1,
		value: 120,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Reinforced headgear. Advantage on saves vs. concussive impacts.",
				"Resistance to necrotic damage.",
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"What's left of you after it's done its job is what you started with.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "lightning", "buff", "burst", "armor"],
		theme_tags: ["black-market", "experimental", "elite-tier"],
	},
	{
		id: "item_p6_30",
		name: "Nano-Weave Bracers",
		description:
			"A wrist-worn focus and protective plate combined into one piece.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0955.webp",
		weight: 3,
		value: 426,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				"+5 ft. to your speed while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Issue-grade. Not flashy, just thorough.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "necrotic", "defensive", "gear"],
		theme_tags: ["ancient-power", "regent-era"],
	},
	{
		id: "item_p6_31",
		name: "High-Grade Beast Repellent",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0594.webp",
		weight: 7,
		value: 96,
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
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
			origin:
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "utility", "control", "consumable"],
		theme_tags: ["guild-ops", "survival", "system-glitch"],
	},
	{
		id: "item_p6_32",
		name: "Lesser Liquid Shadow",
		description:
			"A combat-grade healing compound packaged for sub-action consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0973.webp",
		weight: 6,
		value: 152,
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
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "mobility", "healing", "consumable"],
		theme_tags: ["post-awakening", "gate-zone", "forbidden"],
	},
	{
		id: "item_p6_33",
		name: "Lesser Mana Elixir",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0084.webp",
		weight: 3,
		value: 242,
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
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's not pretty going down. It's prettier than the alternative.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "buff", "stealth", "necrotic", "consumable"],
		theme_tags: ["dimensional-bleed", "black-market", "elite-tier"],
	},
	{
		id: "item_p6_34",
		name: "Vanguard Tactical Helmet",
		description: "Bureau-issued head protection, lightweight and fitted.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0671.webp",
		weight: 1,
		value: 73,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Earned a footnote in the Hunter Association's quarterly equipment audit.",
			origin:
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You feel naked the day you take it off.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "fire", "psychic", "damage", "defensive", "armor"],
		theme_tags: ["dungeon-core", "guild-ops"],
	},
	{
		id: "item_p6_35",
		name: "Guild-Issue Warhammer",
		description:
			"A heavy two-handed crusher. Best used against fortified anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0158.webp",
		weight: 7,
		value: 370,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "2d6",
		damage_type: "bludgeoning",
		simple_properties: ["heavy", "two-handed", "loading"],
		properties: {
			weapon: {
				damage: "2d6",
				damage_type: "bludgeoning",
			},
		},
		effects: {
			passive: [
				"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Quiet, until it isn't.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "sustained", "support", "melee"],
		theme_tags: ["ancient-power", "hunter-bureau"],
	},
	{
		id: "item_p6_36",
		name: "Guild-Standard Beast Repellent",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0385.webp",
		weight: 6,
		value: 45,
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
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's not pretty going down. It's prettier than the alternative.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "control", "support", "consumable"],
		theme_tags: ["system-glitch", "urban-combat"],
	},
	{
		id: "item_p6_37",
		name: "Guild-Issue Longsword",
		description:
			"A versatile cutting blade with a tempered edge and Bureau service marks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0656.webp",
		weight: 7,
		value: 355,
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
				"On a kill with this item, gain 1d4 temporary HP.",
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
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: [
			"equipment",
			"defensive",
			"single-target",
			"utility",
			"void",
			"melee",
		],
		theme_tags: ["hunter-bureau", "guild-ops", "black-market"],
	},
	{
		id: "item_p6_38",
		name: "Abyssal Revolver",
		description:
			"A short-barrel handgun tuned for fast draw and reliable function inside cramped gate corridors.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0211.webp",
		weight: 1,
		value: 78,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d6",
		damage_type: "necrotic",
		simple_properties: ["ammunition", "light", "finesse"],
		range: "Ranged (50/150)",
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "necrotic",
				range: 50,
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Snub-frame. Counts as a finesse weapon.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Sourced from the post-clear loot dispersion of a successful A-rank gate operation.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "lightning", "healing", "firearm"],
		theme_tags: ["dungeon-core", "rift-energy"],
	},
	{
		id: "item_p6_39",
		name: "Greater Aetheric Antidote",
		description:
			"A purifier vial labeled with the Bureau's medical-clearance stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0106.webp",
		weight: 2,
		value: 53,
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
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Surfaced in the Hunter Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Bureau's standard answer to 'how are we still alive?'",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "lightning", "fire", "defensive", "consumable"],
		theme_tags: ["rift-energy", "gate-zone"],
	},
	{
		id: "item_p6_40",
		name: "Shadow Bracers",
		description:
			"A Bureau-issued forearm guard for Hunters operating melee-forward.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0914.webp",
		weight: 1,
		value: 210,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"+1 to attack rolls with light or finesse weapons while worn.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Small enough to forget. Big enough to matter when it counts.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "shadow", "damage", "gear"],
		theme_tags: ["elite-tier", "regent-era", "dimensional-bleed"],
	},
	{
		id: "item_p6_41",
		name: "Crimson Spear",
		description:
			"A two-handed reach weapon â€” good against fast, low-ground anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0995.webp",
		weight: 1,
		value: 507,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "slashing",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "slashing",
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target takes 1d4 ongoing slashing damage at the start of its next two turns (Bleeding).",
				"Once per short rest, treat a single failed Vitality save as a success.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "psychic", "stealth", "melee"],
		theme_tags: ["guild-ops", "mana-overflow"],
	},
	{
		id: "item_p6_42",
		name: "Aether-Plated Bracers",
		description: "A reinforced bracer with mild armor weave on the inner face.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/item-0132.webp",
		weight: 8,
		value: 484,
		item_type: "tool",
		requires_attunement: true,
		properties: {},
		effects: {
			active: [
				{
					name: "Phase Step",
					description:
						"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
					action: "bonus-action",
					frequency: "short-rest",
				},
			],
			passive: [
				"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				"Resistance to force damage.",
				"While attuned, you have advantage on saves against the Stunned condition.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Hunter's go-bag.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "shadow", "control", "psychic", "gear"],
		theme_tags: ["forbidden", "post-awakening", "guild-ops"],
	},
	{
		id: "item_p6_43",
		name: "Black-Market Beast Repellent",
		description:
			"A Hunter-grade restorative; sealed against ambient mana decay.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0245.webp",
		weight: 3,
		value: 320,
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
			passive: ["Grants 5 + Vitality temporary HP for 10 minutes."],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: [
			"equipment",
			"shadow",
			"offensive",
			"support",
			"debuff",
			"consumable",
		],
		theme_tags: ["post-awakening", "rift-energy"],
	},
	{
		id: "item_p6_44",
		name: "Starlight Halberd",
		description: "A reach weapon used by Bureau gate-line teams.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0454.webp",
		weight: 2,
		value: 117,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "radiant",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "radiant",
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target sheds dim light in a 5-ft. radius until the start of your next turn.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It owes nothing to luck. It is what it costs.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "lightning", "damage", "mobility", "melee"],
		theme_tags: ["dimensional-bleed", "regent-era", "elite-tier"],
	},
	{
		id: "item_p6_45",
		name: "High-Grade Liquid Shadow",
		description:
			"A combat-grade healing compound packaged for sub-action consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0967.webp",
		weight: 7,
		value: 262,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Drink",
					description: "Action. Restores mana on consumption.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: [
				"Restores mana on consumption.",
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "shadow", "fire", "stealth", "consumable"],
		theme_tags: ["hunter-bureau", "post-awakening"],
	},
	{
		id: "item_p6_46",
		name: "Aether-Plated Combat Vest",
		description: "A field-armor coat with reinforced shoulder and hip panels.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0704.webp",
		weight: 2,
		value: 250,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"Resistance to force damage.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "radiant", "shadow", "armor"],
		theme_tags: ["mana-overflow", "forbidden", "elite-tier"],
	},
	{
		id: "item_p6_47",
		name: "Ceramic Spaulders",
		description:
			"Bureau-grade heavy plate. Slow, but it stops what most armor doesn't.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0689.webp",
		weight: 2,
		value: 230,
		item_type: "armor",
		armor_class: "17",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 17. Stealth checks at disadvantage.",
				"Heavy carapace plating. AC 17. Stealth disadvantage.",
				"On a hit against a target you have not attacked this turn, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Sourced from the post-clear loot dispersion of a successful A-rank gate operation.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "radiant", "support", "armor"],
		theme_tags: ["classified", "modern-warfare"],
	},
	{
		id: "item_p6_48",
		name: "Mana-Infused Spear",
		description:
			"A two-handed reach weapon â€” good against fast, low-ground anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0170.webp",
		weight: 1,
		value: 198,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "force",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "force",
			},
		},
		effects: {
			passive: [
				"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
				"On a hit, target loses 1 mana point (if any).",
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
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "What survives a Hunter's tour usually outlives the Hunter.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "burst", "damage", "shadow", "melee"],
		theme_tags: ["guild-ops", "mana-overflow", "modern-warfare"],
	},
	{
		id: "item_p6_49",
		name: "Aetheric Sniper Rifle",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0531.webp",
		weight: 4,
		value: 478,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d12",
		damage_type: "force",
		simple_properties: ["ammunition", "two-handed", "loading"],
		range: "Ranged (100/400)",
		properties: {
			weapon: {
				damage: "1d12",
				damage_type: "force",
				range: 100,
			},
		},
		effects: {
			passive: [
				"Bolt-action. One attack per turn; +1 to attack rolls.",
				"On a hit, target loses 1 mana point (if any).",
				"Once per long rest, you may make one weapon attack as a bonus action.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Heavy in the hand. Heavier in consequence.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "fire", "radiant", "area", "firearm"],
		theme_tags: ["hunter-bureau", "dungeon-core", "regent-era"],
	},
];
