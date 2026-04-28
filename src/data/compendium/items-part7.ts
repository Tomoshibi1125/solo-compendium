import type { Item } from "./items";

export const items_part7: Item[] = [
	{
		id: "item_p7_0",
		name: "Void Revolver",
		description:
			"A Bureau-spec sidearm tuned for close-quarters work inside collapsed gates.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0148.webp",
		weight: 6,
		value: 390,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d10",
		damage_type: "necrotic",
		simple_properties: ["ammunition"],
		range: "Ranged (40/120)",
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "necrotic",
				range: 40,
			},
		},
		effects: {
			passive: [
				"Magnum-frame. -1 to attack within 5 ft.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
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
		flavor: "Quiet, until it isn't.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "single-target", "lightning", "radiant", "firearm"],
		theme_tags: ["urban-combat", "regent-era"],
	},
	{
		id: "item_p7_1",
		name: "Abyssal Dagger",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0005.webp",
		weight: 6,
		value: 416,
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
				"On a critical hit, target is Frightened until the end of its next turn.",
				"On a kill, your next attack within 1 minute deals an extra 2d6 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Earned a footnote in the Hunter Association's quarterly equipment audit.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "psychic", "single-target", "void", "melee"],
		theme_tags: ["experimental", "system-glitch", "survival"],
	},
	{
		id: "item_p7_2",
		name: "Aether-Plated Tactical Helmet",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0674.webp",
		weight: 6,
		value: 507,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"+1 to spell-save DCs while worn.",
				"+1 to Investigation and Insight checks while attuned.",
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
		flavor: "The cost of standing the line is right here, on your shoulders.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "lightning", "mobility", "armor"],
		theme_tags: ["survival", "black-market"],
	},
	{
		id: "item_p7_3",
		name: "Abyssal Spear",
		description:
			"A glaive favored by gate-line tanks for keeping anomalies at distance.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0003.webp",
		weight: 6,
		value: 53,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "necrotic",
		simple_properties: ["heavy", "reach", "two-handed"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "necrotic",
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
				"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"While attuned, you have advantage on saves against the Stunned condition.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "necrotic", "sustained", "debuff", "healing", "melee"],
		theme_tags: ["ancient-power", "elite-tier", "survival"],
	},
	{
		id: "item_p7_4",
		name: "Aegis Breastplate",
		description:
			"A breach-line plate harness rated for sustained anomaly contact.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0720.webp",
		weight: 7,
		value: 387,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		strength_requirement: 13,
		properties: {},
		effects: {
			passive: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Mana-stable plate. Resistance to force damage.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Comfort is a luxury. Coming back is the requirement.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "single-target", "buff", "shadow", "area", "armor"],
		theme_tags: ["mana-overflow", "survival"],
	},
	{
		id: "item_p7_5",
		name: "Lesser Stamina Stim",
		description:
			"A close-fit auto-injector calibrated for fast subcutaneous delivery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0449.webp",
		weight: 5,
		value: 30,
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
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "For the part of the fight that comes after the fight.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "utility", "support", "consumable"],
		theme_tags: ["experimental", "system-glitch"],
	},
	{
		id: "item_p7_6",
		name: "Concentrated Liquid Shadow",
		description:
			"A pocket-sized recovery potion. Standard kit for any Hunter on assignment.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0214.webp",
		weight: 1,
		value: 106,
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
				"Earned a footnote in the Hunter Association's quarterly equipment audit.",
			origin:
				"Sourced from the post-clear loot dispersion of a successful A-rank gate operation.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The first sip is the worst. Drink past it.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "void", "support", "radiant", "consumable"],
		theme_tags: ["dungeon-core", "classified"],
	},
	{
		id: "item_p7_7",
		name: "Phantom Combat Vest",
		description: "A Stalker-class light armor sized for extended gate sweeps.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0983.webp",
		weight: 8,
		value: 250,
		item_type: "armor",
		armor_class: "13 + Dex modifier",
		armor_type: "Light",
		requires_attunement: true,
		properties: {},
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
				"Provides AC 13 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
				"+1d4 damage against creatures of the Anomaly tag.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Recommissioned three times across its service life. Inspected at every reissue.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "healing", "radiant", "armor"],
		theme_tags: ["dimensional-bleed", "shadow-domain", "system-glitch"],
	},
	{
		id: "item_p7_8",
		name: "Vanguard Bracers",
		description:
			"A wrist-worn focus and protective plate combined into one piece.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0636.webp",
		weight: 1,
		value: 339,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Hunter's go-bag.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "shadow", "single-target", "gear"],
		theme_tags: ["black-market", "classified", "hunter-bureau"],
	},
	{
		id: "item_p7_9",
		name: "Black-Market Mana Elixir",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0749.webp",
		weight: 7,
		value: 124,
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
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "radiant", "area", "debuff", "necrotic", "consumable"],
		theme_tags: ["hunter-bureau", "forbidden", "elite-tier"],
	},
	{
		id: "item_p7_10",
		name: "Hunter's Spear",
		description: "A field-issue spear designed for second-rank engagement.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0805.webp",
		weight: 5,
		value: 502,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "slashing",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "slashing",
			},
		},
		effects: {
			passive: [
				"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It does the job. That's all the Bureau asks of it.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "shadow", "lightning", "burst", "melee"],
		theme_tags: ["post-awakening", "shadow-domain", "dungeon-core"],
	},
	{
		id: "item_p7_11",
		name: "Nano-Weave Shin Guards",
		description: "A field-armor coat with reinforced shoulder and hip panels.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0948.webp",
		weight: 6,
		value: 463,
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
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
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
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "single-target", "fire", "control", "buff", "armor"],
		theme_tags: ["dimensional-bleed", "forbidden"],
	},
	{
		id: "item_p7_12",
		name: "Hunter's Halberd",
		description:
			"A two-handed reach weapon used to break melee lines and protect spellcasters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0547.webp",
		weight: 3,
		value: 95,
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
				"On a hit against a target you have not attacked this turn, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "lightning", "psychic", "melee"],
		theme_tags: ["experimental", "dungeon-core"],
	},
	{
		id: "item_p7_13",
		name: "Black-Market Aetheric Antidote",
		description: "A clear-glass cure compound suitable for field application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0442.webp",
		weight: 4,
		value: 168,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Apply",
					description:
						"Action. Cures one mana-class condition (mana-burn, lattice-bleed, channel-lock).",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: [
				"Cures one mana-class condition (mana-burn, lattice-bleed, channel-lock).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Sourced from the post-clear loot dispersion of a successful A-rank gate operation.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's not pretty going down. It's prettier than the alternative.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "healing", "radiant", "consumable"],
		theme_tags: ["guild-ops", "experimental", "modern-warfare"],
	},
	{
		id: "item_p7_14",
		name: "Crimson Sniper Rifle",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0217.webp",
		weight: 3,
		value: 226,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d10",
		damage_type: "slashing",
		simple_properties: ["ammunition", "two-handed"],
		range: "Ranged (80/240)",
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "slashing",
				range: 80,
			},
		},
		effects: {
			passive: [
				"Long-arm. Disadvantage on attacks within 5 ft.",
				"On a hit, target takes 1d4 ongoing slashing damage at the start of its next two turns (Bleeding).",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "stealth", "utility", "control", "firearm"],
		theme_tags: ["elite-tier", "post-awakening"],
	},
	{
		id: "item_p7_15",
		name: "Hunter's Dagger",
		description:
			"A discreet sidearm blade meant for civilian-zone work and quiet exits.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0232.webp",
		weight: 2,
		value: 385,
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
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It does the job. That's all the Bureau asks of it.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "damage", "void", "melee"],
		theme_tags: ["post-awakening", "classified"],
	},
	{
		id: "item_p7_16",
		name: "Lesser Beast Repellent",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0503.webp",
		weight: 7,
		value: 276,
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
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Hand-built in a clandestine Daejeon workshop and sold through the gray market.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "burst", "buff", "offensive", "consumable"],
		theme_tags: ["black-market", "system-glitch", "urban-combat"],
	},
	{
		id: "item_p7_17",
		name: "Guild-Issue Katana",
		description:
			"A mid-weight longsword with a Bureau-stamped pommel and reinforced grip.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-1022.webp",
		weight: 2,
		value: 165,
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
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Heavy in the hand. Heavier in consequence.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: [
			"equipment",
			"psychic",
			"single-target",
			"shadow",
			"support",
			"melee",
		],
		theme_tags: ["post-awakening", "survival"],
	},
	{
		id: "item_p7_18",
		name: "High-Grade Aetheric Antidote",
		description:
			"A small dose of curative liquid. One condition cleared per application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0261.webp",
		weight: 3,
		value: 115,
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
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "healing", "necrotic", "buff", "utility", "consumable"],
		theme_tags: ["classified", "hunter-bureau"],
	},
	{
		id: "item_p7_19",
		name: "Aetheric Whip",
		description:
			"A control-class weapon for Hunters who prefer winning fights without finishing them.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0404.webp",
		weight: 1,
		value: 451,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d6",
		damage_type: "force",
		simple_properties: ["finesse", "reach"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "force",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Reach. On a hit, target makes a DC 11 Agility save or is pulled 5 ft. toward you.",
				"While attuned, gain +1 to spell-attack rolls.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Stayed in service longer than expected, primarily because nothing newer was available.",
			origin:
				"Sourced from the post-clear loot dispersion of a successful A-rank gate operation.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "radiant", "psychic", "melee"],
		theme_tags: ["forbidden", "hunter-bureau"],
	},
	{
		id: "item_p7_20",
		name: "Greater Liquid Shadow",
		description:
			"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0140.webp",
		weight: 7,
		value: 358,
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
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Pulled from the gear locker of a mid-rank Hunter declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "support", "offensive", "consumable"],
		theme_tags: ["modern-warfare", "dungeon-core"],
	},
	{
		id: "item_p7_21",
		name: "Greater Liquid Shadow",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-1029.webp",
		weight: 4,
		value: 275,
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
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's not pretty going down. It's prettier than the alternative.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "stealth", "fire", "psychic", "consumable"],
		theme_tags: ["dimensional-bleed", "urban-combat"],
	},
	{
		id: "item_p7_22",
		name: "Nano-Weave Trench Coat",
		description:
			"A close-fitting armor jacket cut from mana-treated synthetic fiber.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0666.webp",
		weight: 2,
		value: 14,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "necrotic", "support", "armor"],
		theme_tags: ["forbidden", "ancient-power", "rift-energy"],
	},
	{
		id: "item_p7_23",
		name: "Aegis Spaulders",
		description:
			"A high-rank tank's plate, built to hold a line through C-to-A engagement waves.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-1027.webp",
		weight: 7,
		value: 440,
		item_type: "armor",
		armor_class: "15",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		strength_requirement: 13,
		properties: {},
		effects: {
			passive: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"On a hit against a target you have not attacked this turn, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You feel naked the day you take it off.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "shadow", "mobility", "single-target", "armor"],
		theme_tags: ["elite-tier", "dungeon-core"],
	},
	{
		id: "item_p7_24",
		name: "Gate-Forged Combat Vest",
		description:
			"A modern Bureau armor jacket built for fast extraction and door-to-door work.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0712.webp",
		weight: 3,
		value: 292,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		requires_attunement: true,
		properties: {},
		effects: {
			active: [
				{
					name: "Surge Strike",
					description:
						"As a bonus action, your next attack with this weapon before the end of your turn deals an additional 2d6 damage.",
					action: "bonus-action",
					frequency: "short-rest",
				},
			],
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"Once per long rest, cast a 2nd-level spell (player choice) without expending a spell slot.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Sourced from the post-clear loot dispersion of a successful A-rank gate operation.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "area", "support", "single-target", "armor"],
		theme_tags: ["experimental", "guild-ops"],
	},
	{
		id: "item_p7_25",
		name: "Ceramic Bracers",
		description: "A reinforced bracer with mild armor weave on the inner face.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0441.webp",
		weight: 6,
		value: 306,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw heavy rotation among second-strike teams during the Busan Incident.",
			origin:
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Boring kit. Boring kit comes home.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "sustained", "damage", "gear"],
		theme_tags: ["modern-warfare", "shadow-domain"],
	},
	{
		id: "item_p7_26",
		name: "Shattered Katana",
		description:
			"A balanced blade with a fuller groove that channels excess kinetic mana.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0230.webp",
		weight: 2,
		value: 423,
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
				"+1 to attack rolls when at full HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Quiet, until it isn't.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "fire", "single-target", "burst", "melee"],
		theme_tags: ["rift-energy", "survival"],
	},
	{
		id: "item_p7_27",
		name: "Black-Market Mana Elixir",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0743.webp",
		weight: 7,
		value: 228,
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
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "One dose. Make it count.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "offensive", "radiant", "consumable"],
		theme_tags: ["dimensional-bleed", "regent-era", "hunter-bureau"],
	},
	{
		id: "item_p7_28",
		name: "Unstable Mana Elixir",
		description:
			"A regulated alchemical compound. Restores hit points on consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0684.webp",
		weight: 3,
		value: 179,
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
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Brokered to a Hunter Association quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "stealth", "mobility", "consumable"],
		theme_tags: ["urban-combat", "survival"],
	},
	{
		id: "item_p7_29",
		name: "Shadow Shin Guards",
		description:
			"A flexible mana-weave layer that beads ichor and shrugs off minor concussive impacts.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0541.webp",
		weight: 8,
		value: 364,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Comfort is a luxury. Coming back is the requirement.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "debuff", "buff", "support", "armor"],
		theme_tags: ["modern-warfare", "mana-overflow"],
	},
	{
		id: "item_p7_30",
		name: "Void Sniper Rifle",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0711.webp",
		weight: 4,
		value: 118,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d8",
		damage_type: "necrotic",
		simple_properties: ["ammunition", "two-handed", "burst-fire"],
		range: "Ranged (60/180)",
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "necrotic",
				range: 60,
			},
		},
		effects: {
			passive: [
				"Auto-rifle. Burst-fire (3 rd, +1d6) on a single attack.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"Add +1d4 damage when target is below half HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Hand-finished by a Bureau master artificer working out of the Seoul Forge District.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "fire", "buff", "firearm"],
		theme_tags: ["black-market", "elite-tier"],
	},
	{
		id: "item_p7_31",
		name: "Nano-Weave Combat Vest",
		description:
			"A flexible mana-weave layer that beads ichor and shrugs off minor concussive impacts.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0974.webp",
		weight: 2,
		value: 450,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Crit on 19-20 against gate-spawned creatures.",
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
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "lightning", "void", "burst", "single-target", "armor"],
		theme_tags: ["survival", "guild-ops", "urban-combat"],
	},
	{
		id: "item_p7_32",
		name: "Phantom Tactical Helmet",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0193.webp",
		weight: 1,
		value: 209,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
				"Add +1d4 damage when target is below half HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Passed quietly between three guildhalls before settling into the Bureau's surplus cycle.",
			origin:
				"Surfaced in the Hunter Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "utility", "debuff", "mobility", "support", "armor"],
		theme_tags: ["shadow-domain", "regent-era", "mana-overflow"],
	},
	{
		id: "item_p7_33",
		name: "Lattice-Scale Combat Vest",
		description:
			"A multi-layer combat coat woven from impact-resistant fabric.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0464.webp",
		weight: 8,
		value: 389,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Resistance to force damage.",
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "void", "burst", "damage", "fire", "armor"],
		theme_tags: ["urban-combat", "rift-energy", "gate-zone"],
	},
	{
		id: "item_p7_34",
		name: "Ceramic Bracers",
		description: "A reinforced bracer with mild armor weave on the inner face.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0763.webp",
		weight: 4,
		value: 470,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Boring kit. Boring kit comes home.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "radiant", "burst", "stealth", "healing", "gear"],
		theme_tags: ["dimensional-bleed", "experimental", "elite-tier"],
	},
	{
		id: "item_p7_35",
		name: "Shattered Spear",
		description:
			"A glaive favored by gate-line tanks for keeping anomalies at distance.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0402.webp",
		weight: 7,
		value: 131,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "piercing",
		simple_properties: ["heavy", "reach", "two-handed"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "piercing",
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
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target makes a DC 13 Vitality save or is disarmed of one held item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It owes nothing to luck. It is what it costs.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: [
			"equipment",
			"defensive",
			"single-target",
			"sustained",
			"radiant",
			"melee",
		],
		theme_tags: ["black-market", "urban-combat"],
	},
	{
		id: "item_p7_36",
		name: "Titanium Breastplate",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0765.webp",
		weight: 8,
		value: 156,
		item_type: "armor",
		armor_class: "17",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		strength_requirement: 15,
		properties: {},
		effects: {
			passive: [
				"Provides AC 17. Stealth checks at disadvantage.",
				"Heavy carapace plating. AC 17. Stealth disadvantage. Requires STR 15.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Made a brief appearance in a guild quartermaster's leaving inventory dispute.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"What's left of you after it's done its job is what you started with.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "damage", "offensive", "debuff", "armor"],
		theme_tags: ["regent-era", "dimensional-bleed"],
	},
	{
		id: "item_p7_37",
		name: "Aether-Plated Spaulders",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0908.webp",
		weight: 7,
		value: 125,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		strength_requirement: 13,
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
				"Provides AC 16. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Resistance to force damage.",
				"+2 to attack rolls against creatures with more HP than you.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Sourced from the post-clear loot dispersion of a successful A-rank gate operation.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Pull the straps tight. Trust the maker.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "support", "psychic", "void", "perception", "armor"],
		theme_tags: ["system-glitch", "ancient-power"],
	},
	{
		id: "item_p7_38",
		name: "Void Spear",
		description: "A field-issue spear designed for second-rank engagement.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0167.webp",
		weight: 6,
		value: 77,
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
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Carried by people who know the difference between a kill and a survival.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "single-target", "shadow", "radiant", "fire", "melee"],
		theme_tags: ["shadow-domain", "black-market"],
	},
	{
		id: "item_p7_39",
		name: "Concentrated Beast Repellent",
		description:
			"An alchemist-licensed restorative. Mana-conductive, fast-absorbing.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0686.webp",
		weight: 1,
		value: 31,
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
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: [
			"equipment",
			"perception",
			"psychic",
			"burst",
			"single-target",
			"consumable",
		],
		theme_tags: ["guild-ops", "modern-warfare"],
	},
	{
		id: "item_p7_40",
		name: "Guild-Standard Aetheric Antidote",
		description:
			"A Bureau-graded antidote calibrated for the most common gate-acquired afflictions.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0422.webp",
		weight: 6,
		value: 305,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Apply",
					description:
						"Action. Cures one mana-class condition (mana-burn, lattice-bleed, channel-lock).",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: [
				"Cures one mana-class condition (mana-burn, lattice-bleed, channel-lock).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: [
			"equipment",
			"lightning",
			"healing",
			"damage",
			"single-target",
			"consumable",
		],
		theme_tags: ["dimensional-bleed", "survival", "hunter-bureau"],
	},
	{
		id: "item_p7_41",
		name: "Concentrated Beast Repellent",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0935.webp",
		weight: 7,
		value: 481,
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
				"Showed up in pawn shops across three districts before the Bureau issued a recall.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's not pretty going down. It's prettier than the alternative.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "necrotic", "buff", "damage", "utility", "consumable"],
		theme_tags: ["rift-energy", "experimental", "guild-ops"],
	},
	{
		id: "item_p7_42",
		name: "Nano-Weave Tactical Helmet",
		description: "Reinforced headgear with mana-treated impact lining.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0688.webp",
		weight: 7,
		value: 357,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
			origin:
				"Brokered to a Hunter Association quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Pull the straps tight. Trust the maker.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "support", "perception", "defensive", "armor"],
		theme_tags: ["gate-zone", "classified", "post-awakening"],
	},
	{
		id: "item_p7_43",
		name: "Obsidian Halberd",
		description:
			"A halberd-class polearm cut for sweeping arcs and thrust finishes.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0673.webp",
		weight: 6,
		value: 323,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "necrotic",
		simple_properties: ["heavy", "reach", "two-handed"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d8",
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
				"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
				"While in dim light or darkness, attacks with this weapon have advantage.",
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
				"Surfaced in the Hunter Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "psychic", "utility", "burst", "control", "melee"],
		theme_tags: ["dungeon-core", "dimensional-bleed", "rift-energy"],
	},
	{
		id: "item_p7_44",
		name: "Aether-Plated Bracers",
		description:
			"A wrist-worn focus and protective plate combined into one piece.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0882.webp",
		weight: 4,
		value: 34,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
				"+1 to spell-save DCs while worn.",
				"Add +1d4 damage when target is below half HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Hunter's go-bag.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "lightning", "sustained", "gear"],
		theme_tags: ["forbidden", "urban-combat", "black-market"],
	},
	{
		id: "item_p7_45",
		name: "Unstable Mana Elixir",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0979.webp",
		weight: 8,
		value: 412,
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
				"Earned a footnote in the Hunter Association's quarterly equipment audit.",
			origin:
				"Hand-built in a clandestine Daejeon workshop and sold through the gray market.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "perception", "offensive", "consumable"],
		theme_tags: ["system-glitch", "experimental", "forbidden"],
	},
	{
		id: "item_p7_46",
		name: "Gate-Forged Combat Vest",
		description:
			"Modern light armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0116.webp",
		weight: 4,
		value: 371,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "area", "utility", "support", "necrotic", "armor"],
		theme_tags: ["experimental", "post-awakening"],
	},
	{
		id: "item_p7_47",
		name: "Ceramic Shin Guards",
		description: "A field-armor coat with reinforced shoulder and hip panels.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0213.webp",
		weight: 2,
		value: 225,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
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
		flavor:
			"Steel between you and the world. Not always enough; usually enough.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "offensive", "control", "support", "mobility", "armor"],
		theme_tags: ["forbidden", "dungeon-core", "dimensional-bleed"],
	},
	{
		id: "item_p7_48",
		name: "Vanguard Breastplate",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0726.webp",
		weight: 3,
		value: 230,
		item_type: "armor",
		armor_class: "18",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		strength_requirement: 15,
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
				"Provides AC 18. Stealth checks at disadvantage.",
				"Heavy carapace plating. AC 17. Stealth disadvantage. Requires STR 15.",
				"Once per long rest, cast a 2nd-level spell (player choice) without expending a spell slot.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"What's left of you after it's done its job is what you started with.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "healing", "necrotic", "stealth", "armor"],
		theme_tags: ["mana-overflow", "hunter-bureau"],
	},
	{
		id: "item_p7_49",
		name: "Abyssal Longsword",
		description:
			"A standard sidearm blade for Hunters who prefer steel to firearms.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0463.webp",
		weight: 1,
		value: 148,
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
				"Counts as both slashing and piercing for resistance bypass.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
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
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "sustained", "mobility", "buff", "debuff", "melee"],
		theme_tags: ["gate-zone", "hunter-bureau", "experimental"],
	},
];
