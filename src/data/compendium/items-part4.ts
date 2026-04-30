import type { Item } from "./items";

export const items_part4: Item[] = [
	{
		id: "item_p4_0",
		name: "Guild-Standard Liquid Shadow",
		description:
			"An alchemist-licensed restorative. Mana-conductive, fast-absorbing.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0128.webp",
		weight: 6,
		value: 205,
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
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Read the label. Then drink anyway.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "damage", "utility", "consumable"],
		theme_tags: ["dimensional-bleed", "gate-zone", "classified"],
	},
	{
		id: "item_p4_1",
		name: "Purified Beast Repellent",
		description:
			"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0889.webp",
		weight: 7,
		value: 370,
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
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "psychic", "sustained", "single-target", "consumable"],
		theme_tags: ["elite-tier", "urban-combat", "dungeon-core"],
	},
	{
		id: "item_p4_2",
		name: "Void Katana",
		description:
			"A mid-weight longsword with a Bureau-stamped pommel and reinforced grip.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0894.webp",
		weight: 8,
		value: 14,
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
				"On a critical hit, target is Frightened until the end of its next turn.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Don't trust a weapon you can't put down.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "damage", "healing", "control", "melee"],
		theme_tags: ["guild-ops", "rift-energy", "ancient-power"],
	},
	{
		id: "item_p4_3",
		name: "Shadow Bracers",
		description:
			"A Bureau-issued forearm guard for Hunters operating melee-forward.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0399.webp",
		weight: 3,
		value: 89,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				"Disadvantage on attacks against you while you are obscured.",
				"+1 to one save of your choice while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Designed by people who survived. Issued to people who hope to.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: [
			"equipment",
			"area",
			"defensive",
			"single-target",
			"control",
			"gear",
		],
		theme_tags: ["black-market", "survival"],
	},
	{
		id: "item_p4_4",
		name: "Unstable Liquid Shadow",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0572.webp",
		weight: 7,
		value: 169,
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
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "mobility", "stealth", "sustained", "consumable"],
		theme_tags: ["shadow-domain", "ancient-power", "dungeon-core"],
	},
	{
		id: "item_p4_5",
		name: "Aetheric Revolver",
		description:
			"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0685.webp",
		weight: 7,
		value: 135,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d6",
		damage_type: "force",
		simple_properties: ["ammunition", "light", "finesse"],
		range: "Ranged (50/150)",
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "force",
				range: 50,
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Snub-frame. Counts as a finesse weapon.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"+1 to one save of your choice while attuned.",
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
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "sustained", "offensive", "firearm"],
		theme_tags: ["forbidden", "rift-energy", "black-market"],
	},
	{
		id: "item_p4_6",
		name: "High-Grade Aetheric Antidote",
		description:
			"A Bureau-graded antidote calibrated for the most common gate-acquired afflictions.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0322.webp",
		weight: 1,
		value: 308,
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
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "lightning", "stealth", "consumable"],
		theme_tags: ["ancient-power", "shadow-domain", "system-glitch"],
	},
	{
		id: "item_p4_7",
		name: "Lattice-Scale Exo-Suit",
		description:
			"A flexible armor cloak shaped to sit unobtrusively under Bureau-issue uniforms.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0427.webp",
		weight: 5,
		value: 109,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"Resistance to force damage.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Passed quietly between three guildhalls before settling into the Bureau's surplus cycle.",
			origin:
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Pull the straps tight. Trust the maker.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "support", "offensive", "armor"],
		theme_tags: ["shadow-domain", "mana-overflow", "elite-tier"],
	},
	{
		id: "item_p4_8",
		name: "Purified Stamina Stim",
		description: "A Hunter-grade injector. Burns hot and fast. Trust the cap.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0872.webp",
		weight: 8,
		value: 249,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Inject",
					description:
						"Bonus action. Restore 2d4 + 2 HP to a willing creature within 5 ft..",
					action: "bonus-action",
					frequency: "at-will",
				},
			],
			passive: ["On inject, restore 2d4 + 2 hit points."],
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
		flavor: "One dose. Make it count.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "radiant", "ice", "utility", "consumable"],
		theme_tags: ["black-market", "post-awakening", "regent-era"],
	},
	{
		id: "item_p4_9",
		name: "Nano-Weave Spaulders",
		description:
			"Heavy carapace plating; favored by S-rank tanks and Holy Knights.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0601.webp",
		weight: 1,
		value: 210,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Reinforced carapace. AC 16. Stealth disadvantage.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "perception", "shadow", "lightning", "armor"],
		theme_tags: ["mana-overflow", "dungeon-core"],
	},
	{
		id: "item_p4_10",
		name: "Vanguard Breastplate",
		description:
			"A reinforced battle-plate composed of layered ichor-treated sections.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0257.webp",
		weight: 4,
		value: 323,
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
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"What's left of you after it's done its job is what you started with.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "damage", "buff", "area", "debuff", "armor"],
		theme_tags: ["system-glitch", "mana-overflow"],
	},
	{
		id: "item_p4_11",
		name: "Ceramic Trench Coat",
		description:
			"A light, flexible armor weave. Standard kit for stealth-focused Hunters.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0528.webp",
		weight: 3,
		value: 419,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"Add +1d4 damage when target is below half HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "psychic", "control", "fire", "armor"],
		theme_tags: ["elite-tier", "rift-energy"],
	},
	{
		id: "item_p4_12",
		name: "Starlight Warhammer",
		description: "A two-handed warhammer built to crater armored targets.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0543.webp",
		weight: 4,
		value: 69,
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
				"On a hit, target sheds dim light in a 5-ft. radius until the start of your next turn.",
				"Add +1d4 damage when target is below half HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "shadow", "support", "damage", "offensive", "melee"],
		theme_tags: ["gate-zone", "hunter-bureau"],
	},
	{
		id: "item_p4_13",
		name: "Shadow Shin Guards",
		description:
			"A field armor designed to keep mobility without sacrificing all protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0030.webp",
		weight: 4,
		value: 41,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "area", "void", "armor"],
		theme_tags: ["elite-tier", "rift-energy", "forbidden"],
	},
	{
		id: "item_p4_14",
		name: "Lattice-Scale Breastplate",
		description:
			"A reinforced heavy armor shell. Designed for line-holders and gate-breach teams.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0829.webp",
		weight: 4,
		value: 154,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Reinforced carapace. AC 16. Stealth disadvantage.",
				"+1 to spell-save DCs while worn.",
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
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "area", "lightning", "perception", "armor"],
		theme_tags: ["urban-combat", "dungeon-core"],
	},
	{
		id: "item_p4_15",
		name: "Gate-Forged Spaulders",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0972.webp",
		weight: 5,
		value: 487,
		item_type: "armor",
		armor_class: "17",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 17. Stealth checks at disadvantage.",
				"Heavy carapace plating. AC 17. Stealth disadvantage.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Showed up in pawn shops across three districts before the Bureau issued a recall.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "single-target", "psychic", "armor"],
		theme_tags: ["classified", "elite-tier", "black-market"],
	},
	{
		id: "item_p4_16",
		name: "Unstable Beast Repellent",
		description:
			"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0827.webp",
		weight: 4,
		value: 180,
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
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Read the label. Then drink anyway.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "buff", "radiant", "ice", "utility", "consumable"],
		theme_tags: ["post-awakening", "guild-ops"],
	},
	{
		id: "item_p4_17",
		name: "Guild-Standard Aetheric Antidote",
		description:
			"A purifier vial labeled with the Bureau's medical-clearance stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0466.webp",
		weight: 5,
		value: 399,
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
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Hand-finished by a Bureau master artificer working out of the Seoul Forge District.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: [
			"equipment",
			"offensive",
			"single-target",
			"lightning",
			"stealth",
			"consumable",
		],
		theme_tags: ["urban-combat", "classified", "hunter-bureau"],
	},
	{
		id: "item_p4_18",
		name: "Nano-Weave Spaulders",
		description:
			"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0801.webp",
		weight: 4,
		value: 84,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Mana-stable plate. Resistance to force damage.",
				"Once per short rest, reroll a missed attack roll.",
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
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "debuff", "utility", "damage", "armor"],
		theme_tags: ["urban-combat", "black-market"],
	},
	{
		id: "item_p4_19",
		name: "Void Revolver",
		description:
			"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0816.webp",
		weight: 4,
		value: 445,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d8",
		damage_type: "necrotic",
		simple_properties: ["ammunition", "light", "silent"],
		range: "Ranged (30/90)",
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "necrotic",
				range: 30,
			},
		},
		effects: {
			passive: [
				"Suppressed. Doesn't reveal your position when fired.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"+1 to attack rolls when at full HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Sized for the wielder who finishes fights, not the one who starts them.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "damage", "stealth", "radiant", "firearm"],
		theme_tags: ["dimensional-bleed", "shadow-domain", "elite-tier"],
	},
	{
		id: "item_p4_20",
		name: "Concentrated Liquid Shadow",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0624.webp",
		weight: 4,
		value: 194,
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
				"Stayed in service longer than expected, primarily because nothing newer was available.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "void", "healing", "defensive", "fire", "consumable"],
		theme_tags: ["shadow-domain", "regent-era", "forbidden"],
	},
	{
		id: "item_p4_21",
		name: "Nano-Weave Breastplate",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0353.webp",
		weight: 6,
		value: 265,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Mana-stable plate. Resistance to force damage.",
				"+1 to initiative rolls while attuned.",
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
		flavor: "Pull the straps tight. Trust the maker.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "sustained", "burst", "armor"],
		theme_tags: ["classified", "forbidden"],
	},
	{
		id: "item_p4_22",
		name: "Obsidian Spear",
		description: "A reach weapon used by Bureau gate-line teams.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0118.webp",
		weight: 7,
		value: 91,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "necrotic",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "necrotic",
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"While in dim light or darkness, attacks with this weapon have advantage.",
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
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "void", "perception", "area", "burst", "melee"],
		theme_tags: ["urban-combat", "gate-zone", "mana-overflow"],
	},
	{
		id: "item_p4_23",
		name: "Purified Stamina Stim",
		description:
			"A field stim packaged in a one-use injector. Standard medic kit.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0631.webp",
		weight: 3,
		value: 98,
		item_type: "consumable",
		properties: {},
		effects: {
			active: [
				{
					name: "Inject",
					description:
						"Bonus action. Grants advantage on the next attack roll within 1 minute. After, take 1 fatigue.",
					action: "bonus-action",
					frequency: "at-will",
				},
			],
			passive: [
				"Grants advantage on the next attack roll within 1 minute. After, take 1 fatigue.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Pulled from the gear locker of a mid-rank Hunter declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "burst", "area", "consumable"],
		theme_tags: ["black-market", "rift-energy"],
	},
	{
		id: "item_p4_24",
		name: "Concentrated Liquid Shadow",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0028.webp",
		weight: 2,
		value: 200,
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
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "debuff", "offensive", "lightning", "consumable"],
		theme_tags: ["dimensional-bleed", "survival"],
	},
	{
		id: "item_p4_25",
		name: "Lesser Liquid Shadow",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0917.webp",
		weight: 2,
		value: 348,
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
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: [
			"equipment",
			"single-target",
			"perception",
			"support",
			"control",
			"consumable",
		],
		theme_tags: ["dungeon-core", "urban-combat"],
	},
	{
		id: "item_p4_26",
		name: "Black-Market Mana Elixir",
		description: "A regulated emergency draught. Quick draw, reliable effect.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0578.webp",
		weight: 3,
		value: 486,
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
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "area", "buff", "ice", "consumable"],
		theme_tags: ["regent-era", "classified", "elite-tier"],
	},
	{
		id: "item_p4_27",
		name: "Ceramic Trench Coat",
		description:
			"A modern Bureau armor jacket built for fast extraction and door-to-door work.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0915.webp",
		weight: 6,
		value: 164,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "fire", "healing", "burst", "armor"],
		theme_tags: ["rift-energy", "dungeon-core", "dimensional-bleed"],
	},
	{
		id: "item_p4_28",
		name: "Purified Stamina Stim",
		description: "A pre-measured combat stim with Bureau-coded markings.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0080.webp",
		weight: 8,
		value: 232,
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
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: [
			"equipment",
			"area",
			"mobility",
			"perception",
			"support",
			"consumable",
		],
		theme_tags: ["dungeon-core", "system-glitch", "post-awakening"],
	},
	{
		id: "item_p4_29",
		name: "Abyssal Longsword",
		description:
			"A versatile mid-weight blade. Handles single- and two-handed equally well.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0833.webp",
		weight: 8,
		value: 104,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "necrotic",
		simple_properties: ["versatile (1d12)", "two-handed-bonus"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "necrotic",
				versatile: "1d12",
			},
		},
		effects: {
			passive: [
				"When wielded two-handed, +1 to damage rolls.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
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
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "debuff", "support", "sustained", "melee"],
		theme_tags: ["dungeon-core", "hunter-bureau", "forbidden"],
	},
	{
		id: "item_p4_30",
		name: "Phantom Shin Guards",
		description:
			"A multi-layer combat coat woven from impact-resistant fabric.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0299.webp",
		weight: 6,
		value: 266,
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
				"Resistance to necrotic damage.",
				"Critical hits with this item ignore resistance to its damage type.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Sourced from the post-clear loot dispersion of a successful A-rank gate operation.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The cost of standing the line is right here, on your shoulders.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: [
			"equipment",
			"single-target",
			"area",
			"defensive",
			"healing",
			"armor",
		],
		theme_tags: ["urban-combat", "regent-era", "post-awakening"],
	},
	{
		id: "item_p4_31",
		name: "Nano-Weave Bracers",
		description:
			"A wrist-worn focus and protective plate combined into one piece.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0970.webp",
		weight: 5,
		value: 244,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"+1 to attack rolls with light or finesse weapons while worn.",
				"Add +1d4 damage when target is below half HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Designed by people who survived. Issued to people who hope to.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "debuff", "offensive", "stealth", "gear"],
		theme_tags: ["rift-energy", "elite-tier", "shadow-domain"],
	},
	{
		id: "item_p4_32",
		name: "Ceramic Spaulders",
		description:
			"A full-coverage heavy carapace built for vanguard tanks holding gate breaches.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0317.webp",
		weight: 2,
		value: 305,
		item_type: "armor",
		armor_class: "15",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
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
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "necrotic", "utility", "armor"],
		theme_tags: ["guild-ops", "experimental", "black-market"],
	},
	{
		id: "item_p4_33",
		name: "Aetheric Spear",
		description:
			"A two-handed reach weapon used to break melee lines and protect spellcasters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0460.webp",
		weight: 2,
		value: 41,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "2d4",
		damage_type: "force",
		simple_properties: ["reach", "two-handed", "thrown"],
		properties: {
			weapon: {
				damage: "2d4",
				damage_type: "force",
			},
		},
		effects: {
			passive: [
				"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
				"While attuned, gain +1 to spell-attack rolls.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Recommissioned three times across its service life. Inspected at every reissue.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Sized for the wielder who finishes fights, not the one who starts them.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "void", "damage", "radiant", "lightning", "melee"],
		theme_tags: ["survival", "gate-zone"],
	},
	{
		id: "item_p4_34",
		name: "Lattice-Scale Combat Vest",
		description:
			"A field armor designed to keep mobility without sacrificing all protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0263.webp",
		weight: 1,
		value: 15,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"Resistance to force damage.",
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
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "perception", "psychic", "armor"],
		theme_tags: ["shadow-domain", "modern-warfare", "system-glitch"],
	},
	{
		id: "item_p4_35",
		name: "Phantom Tactical Helmet",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0526.webp",
		weight: 6,
		value: 76,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
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
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The cost of standing the line is right here, on your shoulders.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "sustained", "radiant", "ice", "area", "armor"],
		theme_tags: ["regent-era", "forbidden", "mana-overflow"],
	},
	{
		id: "item_p4_36",
		name: "Hunter's Dagger",
		description:
			"A discreet sidearm blade meant for civilian-zone work and quiet exits.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0761.webp",
		weight: 2,
		value: 104,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d6",
		damage_type: "slashing",
		simple_properties: ["light", "finesse"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "slashing",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"+1 to attack rolls when you have advantage.",
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
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Don't trust a weapon you can't put down.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "defensive", "fire", "single-target", "melee"],
		theme_tags: ["urban-combat", "gate-zone"],
	},
	{
		id: "item_p4_37",
		name: "Lattice-Scale Breastplate",
		description:
			"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-1032.webp",
		weight: 2,
		value: 28,
		item_type: "armor",
		armor_class: "15",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Resistance to force damage.",
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
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Comfort is a luxury. Coming back is the requirement.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "mobility", "area", "debuff", "armor"],
		theme_tags: ["survival", "mana-overflow", "forbidden"],
	},
	{
		id: "item_p4_38",
		name: "Starlight Gauntlets",
		description: "Articulated combat gauntlets that double as a martial focus.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0779.webp",
		weight: 4,
		value: 443,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d6",
		damage_type: "radiant",
		simple_properties: ["light", "finesse", "striker"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "radiant",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Bladed knuckles. Finesse.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It does the job. That's all the Bureau asks of it.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "necrotic", "healing", "area", "melee"],
		theme_tags: ["hunter-bureau", "classified"],
	},
	{
		id: "item_p4_39",
		name: "Shadow Exo-Suit",
		description:
			"Modern light armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0682.webp",
		weight: 5,
		value: 159,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Earned a footnote in the Hunter Association's quarterly equipment audit.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "fire", "single-target", "armor"],
		theme_tags: ["elite-tier", "classified", "dungeon-core"],
	},
	{
		id: "item_p4_40",
		name: "Lesser Liquid Shadow",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0242.webp",
		weight: 8,
		value: 320,
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
				"Hand-finished by a Bureau master artificer working out of the Seoul Forge District.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "shadow", "offensive", "radiant", "consumable"],
		theme_tags: ["urban-combat", "hunter-bureau"],
	},
	{
		id: "item_p4_41",
		name: "Aetheric Dagger",
		description: "A precision short blade favored by Strikers and Assassins.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0347.webp",
		weight: 6,
		value: 418,
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
					name: "Phase Step",
					description:
						"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
					action: "bonus-action",
					frequency: "short-rest",
				},
			],
			passive: [
				"Crit on 19-20.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Once per long rest, cast a 2nd-level spell (player choice) without expending a spell slot.",
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
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "ice", "healing", "fire", "offensive", "melee"],
		theme_tags: ["ancient-power", "modern-warfare"],
	},
	{
		id: "item_p4_42",
		name: "Hunter's Longsword",
		description:
			"A balanced blade with a fuller groove that channels excess kinetic mana.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0748.webp",
		weight: 3,
		value: 288,
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
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "shadow", "utility", "control", "melee"],
		theme_tags: ["guild-ops", "ancient-power", "classified"],
	},
	{
		id: "item_p4_43",
		name: "Crimson Halberd",
		description: "A reach weapon used by Bureau gate-line teams.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0605.webp",
		weight: 8,
		value: 484,
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
				"While target is below half HP, attacks with this weapon deal +1d4 damage.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Brokered to a Hunter Association quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "sustained", "ice", "void", "melee"],
		theme_tags: ["experimental", "black-market", "forbidden"],
	},
	{
		id: "item_p4_44",
		name: "Greater Health Potion",
		description:
			"A Hunter-grade restorative; sealed against ambient mana decay.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0838.webp",
		weight: 1,
		value: 55,
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
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Read the label. Then drink anyway.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: [
			"equipment",
			"healing",
			"support",
			"defensive",
			"utility",
			"consumable",
		],
		theme_tags: ["shadow-domain", "dungeon-core"],
	},
	{
		id: "item_p4_45",
		name: "Concentrated Stamina Stim",
		description: "A Bureau-stamped emergency injector. Last-resort kit.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0319.webp",
		weight: 3,
		value: 345,
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
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The first sip is the worst. Drink past it.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "psychic", "lightning", "consumable"],
		theme_tags: ["urban-combat", "black-market", "post-awakening"],
	},
	{
		id: "item_p4_46",
		name: "Phantom Spaulders",
		description:
			"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0032.webp",
		weight: 3,
		value: 354,
		item_type: "armor",
		armor_class: "15",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Resistance to necrotic damage.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Recommissioned three times across its service life. Inspected at every reissue.",
			origin:
				"Surfaced in the Hunter Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "burst", "debuff", "damage", "control", "armor"],
		theme_tags: ["urban-combat", "forbidden", "shadow-domain"],
	},
	{
		id: "item_p4_47",
		name: "Mana-Infused Dagger",
		description:
			"A light blade balanced for finesse strikes. Common in close-quarters Hunter loadouts.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0017.webp",
		weight: 2,
		value: 490,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d6",
		damage_type: "force",
		simple_properties: ["light", "finesse"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "force",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"+1 to attack rolls when you have advantage.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
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
				"Pulled from the gear locker of a mid-rank Hunter declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Sized for the wielder who finishes fights, not the one who starts them.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "utility", "shadow", "damage", "offensive", "melee"],
		theme_tags: ["modern-warfare", "dimensional-bleed"],
	},
	{
		id: "item_p4_48",
		name: "Starlight Revolver",
		description:
			"A Bureau-spec sidearm tuned for close-quarters work inside collapsed gates.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0730.webp",
		weight: 1,
		value: 90,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d8",
		damage_type: "radiant",
		simple_properties: ["ammunition", "light", "silent"],
		range: "Ranged (30/90)",
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "radiant",
				range: 30,
			},
		},
		effects: {
			passive: [
				"Suppressed. Doesn't reveal your position when fired.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"+1 to attack rolls when at full HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Hand-finished by a Bureau master artificer working out of the Seoul Forge District.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "mobility", "burst", "support", "healing", "firearm"],
		theme_tags: ["urban-combat", "experimental", "post-awakening"],
	},
	{
		id: "item_p4_49",
		name: "High-Grade Aetheric Antidote",
		description:
			"A neutralizing agent calibrated for gate-acquired contamination.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0059.webp",
		weight: 5,
		value: 214,
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
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "offensive", "mobility", "consumable"],
		theme_tags: ["urban-combat", "shadow-domain", "mana-overflow"],
	},
];
