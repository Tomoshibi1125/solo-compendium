import type { Item } from "./items";

export const items_part8: Item[] = [
	{
		id: "item_p8_0",
		name: "Phantom Breastplate",
		description:
			"A reinforced heavy armor shell. Designed for line-holders and gate-breach teams.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0944.webp",
		weight: 5,
		value: 21,
		item_type: "armor",
		armor_class: "17",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 17. Stealth checks at disadvantage.",
				"Heavy carapace plating. AC 17. Stealth disadvantage.",
				"Resistance to necrotic damage.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The cost of standing the line is right here, on your shoulders.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "offensive", "mobility", "lightning", "armor"],
		theme_tags: ["shadow-domain", "gate-zone", "forbidden"],
	},
	{
		id: "item_p8_1",
		name: "Obsidian Dagger",
		description: "A precision-balanced knife with a mana-treated edge.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0665.webp",
		weight: 3,
		value: 246,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "necrotic",
		simple_properties: ["light", "finesse", "thrown"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "necrotic",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Off-hand attack on a hit deals +1 damage if you are wielding two weapons.",
				"+1d4 damage when attacking from an unseen position.",
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
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "control", "radiant", "lightning", "ice", "melee"],
		theme_tags: ["guild-ops", "modern-warfare"],
	},
	{
		id: "item_p8_2",
		name: "Mana-Infused Whip",
		description: "A weighted whip for trip, disarm, and grappling work.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0438.webp",
		weight: 2,
		value: 499,
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
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "ice", "control", "area", "melee"],
		theme_tags: ["survival", "dungeon-core"],
	},
	{
		id: "item_p8_3",
		name: "Obsidian Halberd",
		description:
			"A balanced spear with a reinforced shaft and mana-conductive head.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0175.webp",
		weight: 3,
		value: 122,
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
				"While in dim light or darkness, attacks with this weapon have advantage.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It does the job. That's all the Bureau asks of it.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "support", "damage", "necrotic", "melee"],
		theme_tags: ["elite-tier", "rift-energy", "forbidden"],
	},
	{
		id: "item_p8_4",
		name: "Gate-Forged Breastplate",
		description:
			"A heavy plate-and-scale shell built for sustained engagements with armored anomalies.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0348.webp",
		weight: 7,
		value: 45,
		item_type: "armor",
		armor_class: "15",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "shadow", "lightning", "burst", "stealth", "armor"],
		theme_tags: ["modern-warfare", "regent-era"],
	},
	{
		id: "item_p8_5",
		name: "Void Warhammer",
		description:
			"A two-handed crusher tuned for breaking armor, walls, and anomaly carapace alike.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0205.webp",
		weight: 6,
		value: 402,
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
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "debuff", "lightning", "damage", "melee"],
		theme_tags: ["mana-overflow", "elite-tier", "regent-era"],
	},
	{
		id: "item_p8_6",
		name: "Unstable Health Potion",
		description:
			"A pocket-sized recovery potion. Standard kit for any Hunter on assignment.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0122.webp",
		weight: 5,
		value: 448,
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
				"Made a brief appearance in a guild quartermaster's leaving inventory dispute.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The first sip is the worst. Drink past it.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: [
			"equipment",
			"necrotic",
			"psychic",
			"defensive",
			"fire",
			"consumable",
		],
		theme_tags: ["modern-warfare", "elite-tier", "regent-era"],
	},
	{
		id: "item_p8_7",
		name: "Black-Market Mana Elixir",
		description:
			"A combat-grade healing compound packaged for sub-action consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0203.webp",
		weight: 5,
		value: 231,
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
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "buff", "healing", "utility", "consumable"],
		theme_tags: ["dimensional-bleed", "survival", "urban-combat"],
	},
	{
		id: "item_p8_8",
		name: "Purified Beast Repellent",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0456.webp",
		weight: 3,
		value: 224,
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
				"Recommissioned three times across its service life. Inspected at every reissue.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "For the part of the fight that comes after the fight.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: [
			"equipment",
			"sustained",
			"void",
			"necrotic",
			"offensive",
			"consumable",
		],
		theme_tags: ["survival", "urban-combat", "classified"],
	},
	{
		id: "item_p8_9",
		name: "Titanium Trench Coat",
		description:
			"A reinforced kevlar-and-mana-weave layer. Cheap, common, effective.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0185.webp",
		weight: 7,
		value: 485,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
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
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "single-target", "sustained", "armor"],
		theme_tags: ["guild-ops", "dungeon-core"],
	},
	{
		id: "item_p8_10",
		name: "Crimson Longsword",
		description: "A saber cut for fluid offense and parry-driven defense.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0593.webp",
		weight: 7,
		value: 466,
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
				"On a hit, target takes 1d4 ongoing slashing damage at the start of its next two turns (Bleeding).",
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
				"Brokered to a Hunter Association quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "defensive", "buff", "melee"],
		theme_tags: ["forbidden", "mana-overflow"],
	},
	{
		id: "item_p8_11",
		name: "Aegis Combat Vest",
		description:
			"A stealth-treated tactical vest issued by Bureau quartermasters.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0608.webp",
		weight: 1,
		value: 244,
		item_type: "armor",
		armor_class: "13 + Dex modifier",
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
				"Provides AC 13 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"While attuned, gain +1 to one ability score (max 20).",
			],
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
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "area", "debuff", "control", "armor"],
		theme_tags: ["ancient-power", "dungeon-core"],
	},
	{
		id: "item_p8_12",
		name: "Greater Liquid Shadow",
		description:
			"An alchemist-licensed restorative. Mana-conductive, fast-absorbing.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0879.webp",
		weight: 3,
		value: 84,
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
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The first sip is the worst. Drink past it.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "perception", "lightning", "support", "consumable"],
		theme_tags: ["elite-tier", "ancient-power"],
	},
	{
		id: "item_p8_13",
		name: "Hunter's Katana",
		description:
			"A reliable mid-weight blade â€” the kind every Hunter learns on, and many never replace.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0366.webp",
		weight: 1,
		value: 78,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "piercing",
		simple_properties: ["versatile (1d10)"],
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "piercing",
				versatile: "1d10",
			},
		},
		effects: {
			passive: [
				"Counts as both slashing and piercing for resistance bypass.",
				"On a hit against a target you have not attacked this turn, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Heavy in the hand. Heavier in consequence.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "burst", "stealth", "ice", "melee"],
		theme_tags: ["hunter-bureau", "ancient-power", "shadow-domain"],
	},
	{
		id: "item_p8_14",
		name: "Aetheric Gauntlets",
		description:
			"A pair of impact gauntlets shaped for clinch fighting inside cramped gate corridors.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0149.webp",
		weight: 3,
		value: 224,
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
				"While attuned, gain +1 to spell-attack rolls.",
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
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "mobility", "defensive", "fire", "perception", "melee"],
		theme_tags: ["guild-ops", "urban-combat", "experimental"],
	},
	{
		id: "item_p8_15",
		name: "Hunter's Dagger",
		description: "A precision-balanced knife with a mana-treated edge.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0292.webp",
		weight: 3,
		value: 344,
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
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Carried by people who know the difference between a kill and a survival.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "utility", "void", "healing", "stealth", "melee"],
		theme_tags: ["urban-combat", "ancient-power"],
	},
	{
		id: "item_p8_16",
		name: "Lesser Liquid Shadow",
		description:
			"A combat-grade healing compound packaged for sub-action consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0907.webp",
		weight: 2,
		value: 123,
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
				"Earned a footnote in the Hunter Association's quarterly equipment audit.",
			origin:
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "healing", "shadow", "consumable"],
		theme_tags: ["dungeon-core", "elite-tier", "ancient-power"],
	},
	{
		id: "item_p8_17",
		name: "High-Grade Beast Repellent",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0802.webp",
		weight: 8,
		value: 116,
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
				"Recommissioned three times across its service life. Inspected at every reissue.",
			origin:
				"Hand-finished by a Bureau master artificer working out of the Seoul Forge District.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: [
			"equipment",
			"area",
			"single-target",
			"buff",
			"healing",
			"consumable",
		],
		theme_tags: ["hunter-bureau", "system-glitch", "shadow-domain"],
	},
	{
		id: "item_p8_18",
		name: "Black-Market Health Potion",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0049.webp",
		weight: 8,
		value: 261,
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
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "damage", "support", "consumable"],
		theme_tags: ["mana-overflow", "guild-ops"],
	},
	{
		id: "item_p8_19",
		name: "Guild-Issue Revolver",
		description:
			"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0320.webp",
		weight: 8,
		value: 173,
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
				"On a hit against a target you have not attacked this turn, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Heavy in the hand. Heavier in consequence.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "shadow", "mobility", "damage", "firearm"],
		theme_tags: ["urban-combat", "system-glitch"],
	},
	{
		id: "item_p8_20",
		name: "Hunter's Sniper Rifle",
		description:
			"A Bureau-issued service rifle, balanced for accuracy over rate of fire.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0056.webp",
		weight: 3,
		value: 92,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d8",
		damage_type: "piercing",
		simple_properties: ["ammunition", "two-handed", "burst-fire"],
		range: "Ranged (60/180)",
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "piercing",
				range: 60,
			},
		},
		effects: {
			passive: [
				"Auto-rifle. Burst-fire (3 rd, +1d6) on a single attack.",
				"+1 to attack rolls when at full HP.",
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
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "shadow", "buff", "stealth", "sustained", "firearm"],
		theme_tags: ["ancient-power", "modern-warfare"],
	},
	{
		id: "item_p8_21",
		name: "Abyssal Revolver",
		description:
			"A compact firearm machined to standard Hunter Bureau tolerances. Fits any standard-issue holster.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0817.webp",
		weight: 8,
		value: 12,
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
				"On a critical hit, target is Frightened until the end of its next turn.",
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
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It does the job. That's all the Bureau asks of it.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "buff", "necrotic", "utility", "burst", "firearm"],
		theme_tags: ["black-market", "system-glitch"],
	},
	{
		id: "item_p8_22",
		name: "Unstable Aetheric Antidote",
		description:
			"A small dose of curative liquid. One condition cleared per application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0590.webp",
		weight: 7,
		value: 334,
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
				"Saw heavy rotation among second-strike teams during the Busan Incident.",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: [
			"equipment",
			"support",
			"radiant",
			"lightning",
			"damage",
			"consumable",
		],
		theme_tags: ["urban-combat", "black-market", "shadow-domain"],
	},
	{
		id: "item_p8_23",
		name: "Mana-Infused Dagger",
		description: "A swift, compact blade weighted for fast cuts and reversals.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0071.webp",
		weight: 8,
		value: 45,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "force",
		simple_properties: ["light", "finesse", "thrown"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "force",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Off-hand attack on a hit deals +1 damage if you are wielding two weapons.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
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
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "lightning", "ice", "melee"],
		theme_tags: ["forbidden", "guild-ops"],
	},
	{
		id: "item_p8_24",
		name: "High-Grade Aetheric Antidote",
		description:
			"A neutralizing agent calibrated for gate-acquired contamination.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0516.webp",
		weight: 6,
		value: 384,
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
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Hand-built in a clandestine Daejeon workshop and sold through the gray market.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "void", "lightning", "consumable"],
		theme_tags: ["post-awakening", "guild-ops"],
	},
	{
		id: "item_p8_25",
		name: "Purified Health Potion",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0373.webp",
		weight: 3,
		value: 210,
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
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "For the part of the fight that comes after the fight.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "single-target", "mobility", "offensive", "consumable"],
		theme_tags: ["post-awakening", "gate-zone", "shadow-domain"],
	},
	{
		id: "item_p8_26",
		name: "Unstable Aetheric Antidote",
		description:
			"A Bureau-graded antidote calibrated for the most common gate-acquired afflictions.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0010.webp",
		weight: 3,
		value: 448,
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
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Bureau's standard answer to 'how are we still alive?'",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: [
			"equipment",
			"shadow",
			"support",
			"control",
			"defensive",
			"consumable",
		],
		theme_tags: ["shadow-domain", "hunter-bureau"],
	},
	{
		id: "item_p8_27",
		name: "Obsidian Dagger",
		description: "A precision-balanced knife with a mana-treated edge.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0371.webp",
		weight: 7,
		value: 386,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "necrotic",
		simple_properties: ["light", "finesse", "thrown"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "necrotic",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Off-hand attack on a hit deals +1 damage if you are wielding two weapons.",
				"+1d4 damage when attacking from an unseen position.",
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
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Don't trust a weapon you can't put down.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "stealth", "healing", "perception", "melee"],
		theme_tags: ["ancient-power", "black-market", "urban-combat"],
	},
	{
		id: "item_p8_28",
		name: "Gate-Forged Bracers",
		description:
			"A Bureau-issued forearm guard for Hunters operating melee-forward.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0344.webp",
		weight: 5,
		value: 466,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Hunter's go-bag.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "single-target", "healing", "fire", "gear"],
		theme_tags: ["dimensional-bleed", "classified"],
	},
	{
		id: "item_p8_29",
		name: "Guild-Issue Dagger",
		description: "A precision-balanced knife with a mana-treated edge.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0329.webp",
		weight: 7,
		value: 61,
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
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Quiet, until it isn't.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "perception", "offensive", "melee"],
		theme_tags: ["forbidden", "urban-combat", "dimensional-bleed"],
	},
	{
		id: "item_p8_30",
		name: "Gate-Forged Spaulders",
		description:
			"Heavy carapace plating; favored by S-rank tanks and Holy Knights.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0771.webp",
		weight: 8,
		value: 349,
		item_type: "armor",
		armor_class: "17",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		requires_attunement: true,
		properties: {},
		effects: {
			active: [
				{
					name: "Lattice Tag",
					description:
						"As an action, mark a creature within 60 ft. for 1 minute. Attacks against the marked creature deal +1d6 damage of this item's theme.",
					action: "action",
					frequency: "short-rest",
				},
			],
			passive: [
				"Provides AC 17. Stealth checks at disadvantage.",
				"Reinforced carapace. AC 16. Stealth disadvantage.",
				"+1d4 damage against creatures with the Construct or Anomaly tag.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Brokered to a Hunter Association quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "radiant", "mobility", "armor"],
		theme_tags: ["post-awakening", "system-glitch"],
	},
	{
		id: "item_p8_31",
		name: "Phantom Breastplate",
		description:
			"Bureau-grade heavy plate. Slow, but it stops what most armor doesn't.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0674.webp",
		weight: 7,
		value: 340,
		item_type: "armor",
		armor_class: "17",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 17. Stealth checks at disadvantage.",
				"Heavy carapace plating. AC 17. Stealth disadvantage.",
				"Resistance to necrotic damage.",
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
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "ice", "control", "perception", "buff", "armor"],
		theme_tags: ["ancient-power", "elite-tier"],
	},
	{
		id: "item_p8_32",
		name: "High-Grade Aetheric Antidote",
		description: "A clear-glass cure compound suitable for field application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0773.webp",
		weight: 3,
		value: 434,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Apply",
					description: "Action. Cures the poisoned condition.",
					action: "action",
					frequency: "at-will",
				},
			],
			passive: ["Cures the poisoned condition."],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "necrotic", "burst", "consumable"],
		theme_tags: ["classified", "post-awakening", "dungeon-core"],
	},
	{
		id: "item_p8_33",
		name: "Lattice-Scale Exo-Suit",
		description:
			"A compact tactical layer designed for fast movers operating inside C-rank gates.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0916.webp",
		weight: 3,
		value: 116,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"+1 to spell-save DCs while worn.",
				"+1 to one save of your choice while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Surfaced in the Hunter Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"What's left of you after it's done its job is what you started with.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "fire", "sustained", "armor"],
		theme_tags: ["dimensional-bleed", "forbidden"],
	},
	{
		id: "item_p8_34",
		name: "Hunter's Warhammer",
		description:
			"A massive impact weapon balanced for sweeping strikes and structural breaks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0743.webp",
		weight: 4,
		value: 89,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d12",
		damage_type: "bludgeoning",
		simple_properties: ["heavy", "two-handed"],
		properties: {
			weapon: {
				damage: "1d12",
				damage_type: "bludgeoning",
			},
		},
		effects: {
			passive: [
				"Crit on 19-20. Critical hits push target 5 ft.",
				"Once per short rest, reroll a missed attack roll.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw heavy rotation among second-strike teams during the Busan Incident.",
			origin:
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "burst", "sustained", "offensive", "melee"],
		theme_tags: ["experimental", "post-awakening", "hunter-bureau"],
	},
	{
		id: "item_p8_35",
		name: "Titanium Bracers",
		description:
			"A wrist-worn focus and protective plate combined into one piece.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-1006.webp",
		weight: 3,
		value: 463,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
				"Add +1d4 damage when target is below half HP.",
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
		flavor: "Logged on the requisition manifest. Trusted on the line.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "stealth", "debuff", "gear"],
		theme_tags: ["black-market", "rift-energy", "experimental"],
	},
	{
		id: "item_p8_36",
		name: "Shattered Warhammer",
		description: "A two-handed warhammer built to crater armored targets.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0201.webp",
		weight: 5,
		value: 187,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "bludgeoning",
		simple_properties: ["heavy", "two-handed"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "bludgeoning",
			},
		},
		effects: {
			passive: [
				"On a hit, target makes a DC 13 Strength save or is knocked prone.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Recommissioned three times across its service life. Inspected at every reissue.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "lightning", "damage", "offensive", "support", "melee"],
		theme_tags: ["guild-ops", "hunter-bureau"],
	},
	{
		id: "item_p8_37",
		name: "Shattered Spear",
		description:
			"A two-handed reach weapon â€” good against fast, low-ground anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0480.webp",
		weight: 6,
		value: 431,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "2d4",
		damage_type: "piercing",
		simple_properties: ["reach", "two-handed", "thrown"],
		properties: {
			weapon: {
				damage: "2d4",
				damage_type: "piercing",
			},
		},
		effects: {
			passive: [
				"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
				"Once per short rest, reroll a missed attack roll.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Don't trust a weapon you can't put down.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "area", "debuff", "single-target", "melee"],
		theme_tags: ["mana-overflow", "elite-tier"],
	},
	{
		id: "item_p8_38",
		name: "Lattice-Scale Spaulders",
		description:
			"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0283.webp",
		weight: 7,
		value: 343,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Mana-stable plate. Resistance to force damage.",
				"+1 to spell-save DCs while worn.",
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
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "fire", "sustained", "void", "armor"],
		theme_tags: ["elite-tier", "urban-combat", "black-market"],
	},
	{
		id: "item_p8_39",
		name: "Void Whip",
		description:
			"A control-class weapon for Hunters who prefer winning fights without finishing them.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0978.webp",
		weight: 3,
		value: 435,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d6",
		damage_type: "necrotic",
		simple_properties: ["finesse", "reach"],
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
					name: "Suppressive Volley",
					description:
						"As an action, force all creatures within a 15-ft. cone to make a DC 13 Agility save or take 2d6 damage of this weapon's type.",
					action: "action",
					dc: 13,
					frequency: "short-rest",
				},
			],
			passive: [
				"Reach. On a hit, target makes a DC 11 Agility save or is pulled 5 ft. toward you.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"Critical hits with this item ignore resistance to its damage type.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Stayed in service longer than expected, primarily because nothing newer was available.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: [
			"equipment",
			"single-target",
			"damage",
			"control",
			"lightning",
			"melee",
		],
		theme_tags: ["shadow-domain", "classified"],
	},
	{
		id: "item_p8_40",
		name: "High-Grade Health Potion",
		description:
			"A regulated alchemical compound. Restores hit points on consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0722.webp",
		weight: 7,
		value: 463,
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
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "healing", "single-target", "consumable"],
		theme_tags: ["ancient-power", "classified"],
	},
	{
		id: "item_p8_41",
		name: "Void Halberd",
		description:
			"A two-handed reach weapon â€” good against fast, low-ground anomalies.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0827.webp",
		weight: 1,
		value: 181,
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
					name: "Lattice Pulse",
					description:
						"As an action, emit a 15-ft. cone pulse. Each creature in the cone makes a DC 13 Vitality save, taking 3d6 force damage on a fail (half on success).",
					action: "action",
					dc: 13,
					frequency: "short-rest",
				},
			],
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"Once per short rest, cast Misty Step (no spell slot required) while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Quiet, until it isn't.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "perception", "shadow", "fire", "lightning", "melee"],
		theme_tags: ["regent-era", "classified"],
	},
	{
		id: "item_p8_42",
		name: "Crimson Gauntlets",
		description:
			"A close-combat gauntlet favored by Strikers and unarmed-Mage hybrids.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0196.webp",
		weight: 4,
		value: 332,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d4",
		damage_type: "slashing",
		simple_properties: ["light", "striker"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "slashing",
			},
		},
		effects: {
			passive: [
				"Counts as an unarmed strike for Striker class features.",
				"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
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
		flavor: "It owes nothing to luck. It is what it costs.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "void", "radiant", "utility", "melee"],
		theme_tags: ["modern-warfare", "urban-combat"],
	},
	{
		id: "item_p8_43",
		name: "Guild-Issue Revolver",
		description:
			"A Bureau-spec sidearm tuned for close-quarters work inside collapsed gates.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0053.webp",
		weight: 1,
		value: 52,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d6",
		damage_type: "piercing",
		simple_properties: ["ammunition", "light", "finesse"],
		range: "Ranged (50/150)",
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "piercing",
				range: 50,
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Snub-frame. Counts as a finesse weapon.",
				"+1 to one save of your choice while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It does the job. That's all the Bureau asks of it.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "buff", "offensive", "fire", "shadow", "firearm"],
		theme_tags: ["classified", "system-glitch"],
	},
	{
		id: "item_p8_44",
		name: "Obsidian Dagger",
		description:
			"A discreet sidearm blade meant for civilian-zone work and quiet exits.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0262.webp",
		weight: 8,
		value: 338,
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
				"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Earned a footnote in the Hunter Association's quarterly equipment audit.",
			origin:
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "radiant", "buff", "melee"],
		theme_tags: ["elite-tier", "post-awakening", "guild-ops"],
	},
	{
		id: "item_p8_45",
		name: "Obsidian Sniper Rifle",
		description:
			"A precision rifle with mana-stable optics. Effective against armored anomalies at extended range.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0799.webp",
		weight: 2,
		value: 361,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d8",
		damage_type: "necrotic",
		simple_properties: ["ammunition", "two-handed", "burst-fire"],
		range: "Ranged (60/180)",
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "necrotic",
				range: 60,
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
				"Auto-rifle. Burst-fire (3 rd, +1d6) on a single attack.",
				"While in dim light or darkness, attacks with this weapon have advantage.",
				"Once per long rest, gain advantage on all attacks for 1 round as a bonus action.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw heavy rotation among second-strike teams during the Busan Incident.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Carried by people who know the difference between a kill and a survival.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "burst", "support", "debuff", "firearm"],
		theme_tags: ["hunter-bureau", "post-awakening"],
	},
	{
		id: "item_p8_46",
		name: "Guild-Issue Longsword",
		description:
			"A versatile cutting blade with a tempered edge and Bureau service marks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0768.webp",
		weight: 7,
		value: 35,
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
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Quiet, until it isn't.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "utility", "radiant", "single-target", "melee"],
		theme_tags: ["system-glitch", "forbidden", "hunter-bureau"],
	},
	{
		id: "item_p8_47",
		name: "Purified Health Potion",
		description:
			"A clear-glass restorative phial sealed with a Bureau quartermaster stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0497.webp",
		weight: 6,
		value: 389,
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
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "damage", "necrotic", "consumable"],
		theme_tags: ["survival", "ancient-power", "urban-combat"],
	},
	{
		id: "item_p8_48",
		name: "Unstable Mana Elixir",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0234.webp",
		weight: 6,
		value: 438,
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
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "area", "burst", "stealth", "shadow", "consumable"],
		theme_tags: ["regent-era", "modern-warfare", "urban-combat"],
	},
	{
		id: "item_p8_49",
		name: "Purified Mana Elixir",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0339.webp",
		weight: 6,
		value: 28,
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
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "buff", "psychic", "consumable"],
		theme_tags: ["classified", "black-market"],
	},
];
