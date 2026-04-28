import type { Item } from "./items";

export const items_part2: Item[] = [
	{
		id: "item_p2_0",
		name: "Black-Market Mana Elixir",
		description:
			"A field-stable potion. The Bureau's standard answer to early-fight injuries.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0656.webp",
		weight: 5,
		value: 68,
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
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: [
			"equipment",
			"stealth",
			"damage",
			"single-target",
			"mobility",
			"consumable",
		],
		theme_tags: ["system-glitch", "survival"],
	},
	{
		id: "item_p2_1",
		name: "Greater Liquid Shadow",
		description:
			"An alchemist-licensed restorative. Mana-conductive, fast-absorbing.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0385.webp",
		weight: 4,
		value: 211,
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
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "ice", "fire", "consumable"],
		theme_tags: ["survival", "system-glitch", "mana-overflow"],
	},
	{
		id: "item_p2_2",
		name: "Void Warhammer",
		description: "A two-handed warhammer built to crater armored targets.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0406.webp",
		weight: 3,
		value: 124,
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
				"+5 ft. to your speed while wielding this item.",
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
		flavor: "It owes nothing to luck. It is what it costs.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "fire", "control", "melee"],
		theme_tags: ["system-glitch", "shadow-domain", "modern-warfare"],
	},
	{
		id: "item_p2_3",
		name: "Crimson Revolver",
		description:
			"A compact firearm machined to standard Hunter Bureau tolerances. Fits any standard-issue holster.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0927.webp",
		weight: 7,
		value: 155,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d8",
		damage_type: "slashing",
		simple_properties: ["ammunition", "light", "silent"],
		range: "Ranged (30/90)",
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "slashing",
				range: 30,
			},
		},
		effects: {
			passive: [
				"Suppressed. Doesn't reveal your position when fired.",
				"While target is below half HP, attacks with this weapon deal +1d4 damage.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "burst", "sustained", "utility", "firearm"],
		theme_tags: ["guild-ops", "black-market", "post-awakening"],
	},
	{
		id: "item_p2_4",
		name: "Gate-Forged Spaulders",
		description:
			"Heavy carapace plating; favored by S-rank tanks and Holy Knights.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0084.webp",
		weight: 3,
		value: 345,
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
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Steel between you and the world. Not always enough; usually enough.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "damage", "offensive", "perception", "ice", "armor"],
		theme_tags: ["urban-combat", "forbidden"],
	},
	{
		id: "item_p2_5",
		name: "Void Gauntlets",
		description:
			"A close-combat gauntlet favored by Strikers and unarmed-Mage hybrids.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0197.webp",
		weight: 2,
		value: 459,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d4",
		damage_type: "necrotic",
		simple_properties: ["light", "striker"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "necrotic",
			},
		},
		effects: {
			passive: [
				"Counts as an unarmed strike for Striker class features.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor: "What survives a Hunter's tour usually outlives the Hunter.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "area", "debuff", "perception", "melee"],
		theme_tags: ["guild-ops", "mana-overflow"],
	},
	{
		id: "item_p2_6",
		name: "Lesser Aetheric Antidote",
		description: "A clear-glass cure compound suitable for field application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0866.webp",
		weight: 1,
		value: 370,
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
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The first sip is the worst. Drink past it.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: [
			"equipment",
			"stealth",
			"psychic",
			"sustained",
			"control",
			"consumable",
		],
		theme_tags: ["survival", "gate-zone"],
	},
	{
		id: "item_p2_7",
		name: "Phantom Combat Vest",
		description:
			"A flexible armor cloak shaped to sit unobtrusively under Bureau-issue uniforms.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0971.webp",
		weight: 7,
		value: 169,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"Resistance to necrotic damage.",
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
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"What's left of you after it's done its job is what you started with.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "stealth", "void", "single-target", "armor"],
		theme_tags: ["dimensional-bleed", "guild-ops"],
	},
	{
		id: "item_p2_8",
		name: "High-Grade Mana Elixir",
		description:
			"A field-stable potion. The Bureau's standard answer to early-fight injuries.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0368.webp",
		weight: 7,
		value: 346,
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
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Hand-finished by a Bureau master artificer working out of the Seoul Forge District.",
			personality: "",
			prior_owners: [],
		},
		flavor: "For the part of the fight that comes after the fight.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "damage", "utility", "consumable"],
		theme_tags: ["survival", "regent-era", "gate-zone"],
	},
	{
		id: "item_p2_9",
		name: "Unstable Aetheric Antidote",
		description: "A clear-glass cure compound suitable for field application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0097.webp",
		weight: 8,
		value: 325,
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
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "One dose. Make it count.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "area", "control", "fire", "consumable"],
		theme_tags: ["system-glitch", "survival"],
	},
	{
		id: "item_p2_10",
		name: "Purified Mana Elixir",
		description:
			"A pocket-sized recovery potion. Standard kit for any Hunter on assignment.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0817.webp",
		weight: 3,
		value: 367,
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
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Read the label. Then drink anyway.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "area", "damage", "shadow", "burst", "consumable"],
		theme_tags: ["classified", "system-glitch", "survival"],
	},
	{
		id: "item_p2_11",
		name: "Guild-Issue Whip",
		description: "A flexible reach weapon braided from mana-treated cord.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0056.webp",
		weight: 8,
		value: 459,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "slashing",
		simple_properties: ["finesse", "reach"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "slashing",
				finesse: true,
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
				"On a kill, your next attack within 1 minute deals an extra 2d6 damage.",
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
		flavor: "What survives a Hunter's tour usually outlives the Hunter.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: [
			"equipment",
			"lightning",
			"necrotic",
			"damage",
			"perception",
			"melee",
		],
		theme_tags: ["shadow-domain", "urban-combat", "survival"],
	},
	{
		id: "item_p2_12",
		name: "Void Longsword",
		description:
			"A standard sidearm blade for Hunters who prefer steel to firearms.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0071.webp",
		weight: 8,
		value: 336,
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
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It will only ever be as deadly as the hand that holds it.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: [
			"equipment",
			"burst",
			"single-target",
			"healing",
			"perception",
			"melee",
		],
		theme_tags: ["guild-ops", "classified", "hunter-bureau"],
	},
	{
		id: "item_p2_13",
		name: "Aetheric Spear",
		description:
			"A two-handed reach weapon used to break melee lines and protect spellcasters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0590.webp",
		weight: 2,
		value: 323,
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
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
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
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "fire", "utility", "healing", "melee"],
		theme_tags: ["dimensional-bleed", "shadow-domain"],
	},
	{
		id: "item_p2_14",
		name: "Aether-Plated Combat Vest",
		description:
			"A close-fitting armor jacket cut from mana-treated synthetic fiber.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0357.webp",
		weight: 8,
		value: 64,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
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
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You feel naked the day you take it off.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "area", "necrotic", "shadow", "buff", "armor"],
		theme_tags: ["dungeon-core", "mana-overflow", "elite-tier"],
	},
	{
		id: "item_p2_15",
		name: "Aegis Exo-Suit",
		description:
			"A reinforced shield. Standard kit for line-holders inside high-rank gates.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0500.webp",
		weight: 4,
		value: 452,
		item_type: "shield",
		armor_class: "+2",
		armor_type: "Shield",
		properties: {},
		effects: {
			passive: [
				"Provides +2 AC while wielded.",
				"Tower shield. +2 AC. Provides three-quarter cover when set as an action.",
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
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You feel naked the day you take it off.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "perception", "mobility", "armor"],
		theme_tags: ["rift-energy", "mana-overflow"],
	},
	{
		id: "item_p2_16",
		name: "Mana-Infused Katana",
		description:
			"A balanced blade with a fuller groove that channels excess kinetic mana.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0355.webp",
		weight: 2,
		value: 389,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "force",
		simple_properties: ["versatile (1d12)", "two-handed-bonus"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "force",
				versatile: "1d12",
			},
		},
		effects: {
			passive: [
				"When wielded two-handed, +1 to damage rolls.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "radiant", "psychic", "burst", "melee"],
		theme_tags: ["post-awakening", "classified"],
	},
	{
		id: "item_p2_17",
		name: "Nano-Weave Exo-Suit",
		description:
			"A stealth-treated tactical vest issued by Bureau quartermasters.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-1026.webp",
		weight: 1,
		value: 448,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Passed quietly between three guildhalls before settling into the Bureau's surplus cycle.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The cost of standing the line is right here, on your shoulders.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "void", "necrotic", "area", "armor"],
		theme_tags: ["classified", "guild-ops", "regent-era"],
	},
	{
		id: "item_p2_18",
		name: "Vanguard Shin Guards",
		description:
			"A close-fitting armor jacket cut from mana-treated synthetic fiber.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0329.webp",
		weight: 5,
		value: 368,
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
				"Once per short rest, treat a roll of 1-9 on an attack as a 10.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Pull the straps tight. Trust the maker.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "defensive", "buff", "armor"],
		theme_tags: ["mana-overflow", "elite-tier"],
	},
	{
		id: "item_p2_19",
		name: "High-Grade Health Potion",
		description:
			"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0344.webp",
		weight: 6,
		value: 61,
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
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Read the label. Then drink anyway.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: [
			"equipment",
			"support",
			"utility",
			"control",
			"single-target",
			"consumable",
		],
		theme_tags: ["post-awakening", "modern-warfare"],
	},
	{
		id: "item_p2_20",
		name: "Greater Mana Elixir",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0152.webp",
		weight: 7,
		value: 410,
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
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's not pretty going down. It's prettier than the alternative.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "void", "fire", "consumable"],
		theme_tags: ["modern-warfare", "hunter-bureau", "classified"],
	},
	{
		id: "item_p2_21",
		name: "Abyssal Katana",
		description:
			"A field-tested broadsword balanced for sustained engagements.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0913.webp",
		weight: 7,
		value: 432,
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
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"+5 ft. to your speed while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Carried by people who know the difference between a kill and a survival.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "shadow", "sustained", "ice", "melee"],
		theme_tags: ["regent-era", "elite-tier", "modern-warfare"],
	},
	{
		id: "item_p2_22",
		name: "Aetheric Warhammer",
		description:
			"A two-handed crusher tuned for breaking armor, walls, and anomaly carapace alike.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0678.webp",
		weight: 4,
		value: 417,
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
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"+1 to attack rolls when at full HP.",
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
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "area", "defensive", "healing", "psychic", "melee"],
		theme_tags: ["hunter-bureau", "classified"],
	},
	{
		id: "item_p2_23",
		name: "Abyssal Whip",
		description: "A weighted whip for trip, disarm, and grappling work.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0159.webp",
		weight: 6,
		value: 448,
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
					name: "Phase Step",
					description:
						"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
					action: "bonus-action",
					frequency: "short-rest",
				},
			],
			passive: [
				"Reach. On a hit, target makes a DC 11 Agility save or is pulled 5 ft. toward you.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"On a hit, target makes a DC 13 Vitality save or is disarmed of one held item.",
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
		flavor: "It will only ever be as deadly as the hand that holds it.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "single-target", "necrotic", "melee"],
		theme_tags: ["modern-warfare", "experimental", "regent-era"],
	},
	{
		id: "item_p2_24",
		name: "Obsidian Longsword",
		description:
			"A standard sidearm blade for Hunters who prefer steel to firearms.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0588.webp",
		weight: 1,
		value: 354,
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
				"While in dim light or darkness, attacks with this weapon have advantage.",
				"+5 ft. to your speed while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Don't trust a weapon you can't put down.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "single-target", "mobility", "melee"],
		theme_tags: ["ancient-power", "guild-ops"],
	},
	{
		id: "item_p2_25",
		name: "Crimson Warhammer",
		description:
			"A heavy two-handed crusher. Best used against fortified anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0445.webp",
		weight: 8,
		value: 451,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d12",
		damage_type: "slashing",
		simple_properties: ["heavy", "two-handed"],
		properties: {
			weapon: {
				damage: "1d12",
				damage_type: "slashing",
			},
		},
		effects: {
			passive: [
				"Crit on 19-20. Critical hits push target 5 ft.",
				"While target is below half HP, attacks with this weapon deal +1d4 damage.",
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
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "perception", "mobility", "melee"],
		theme_tags: ["elite-tier", "survival", "system-glitch"],
	},
	{
		id: "item_p2_26",
		name: "Lattice-Scale Exo-Suit",
		description:
			"A reinforced kevlar-and-mana-weave layer. Cheap, common, effective.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0106.webp",
		weight: 3,
		value: 112,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"+1 to spell-save DCs while worn.",
				"Add +1d4 damage when target is below half HP.",
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
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "buff", "control", "shadow", "armor"],
		theme_tags: ["urban-combat", "forbidden"],
	},
	{
		id: "item_p2_27",
		name: "Hunter's Warhammer",
		description:
			"A reinforced sledge — for when an obstacle needs to stop being one.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0443.webp",
		weight: 7,
		value: 280,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d12",
		damage_type: "bludgeoning",
		simple_properties: ["heavy", "two-handed"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d12",
				damage_type: "bludgeoning",
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
				"Crit on 19-20. Critical hits push target 5 ft.",
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
				"Issued from the Bureau's mid-tier Hunter requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It will only ever be as deadly as the hand that holds it.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "radiant", "lightning", "melee"],
		theme_tags: ["hunter-bureau", "urban-combat", "modern-warfare"],
	},
	{
		id: "item_p2_28",
		name: "Gate-Forged Tactical Helmet",
		description: "Reinforced headgear with mana-treated impact lining.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0640.webp",
		weight: 7,
		value: 197,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Reinforced headgear. Advantage on saves vs. concussive impacts.",
				"Once per short rest, treat a single failed Vitality save as a success.",
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
		flavor: "You feel naked the day you take it off.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "psychic", "ice", "armor"],
		theme_tags: ["modern-warfare", "dungeon-core", "regent-era"],
	},
	{
		id: "item_p2_29",
		name: "Aetheric Whip",
		description: "A weighted whip for trip, disarm, and grappling work.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0361.webp",
		weight: 5,
		value: 127,
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
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
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
		flavor: "It does the job. That's all the Bureau asks of it.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "sustained", "fire", "melee"],
		theme_tags: ["experimental", "hunter-bureau", "post-awakening"],
	},
	{
		id: "item_p2_30",
		name: "Aetheric Gauntlets",
		description:
			"A pair of impact gauntlets shaped for clinch fighting inside cramped gate corridors.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0859.webp",
		weight: 8,
		value: 437,
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
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
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
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "defensive", "sustained", "buff", "melee"],
		theme_tags: ["experimental", "elite-tier"],
	},
	{
		id: "item_p2_31",
		name: "Unstable Liquid Shadow",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0498.webp",
		weight: 8,
		value: 298,
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
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: [
			"equipment",
			"void",
			"ice",
			"single-target",
			"psychic",
			"consumable",
		],
		theme_tags: ["hunter-bureau", "dimensional-bleed"],
	},
	{
		id: "item_p2_32",
		name: "Guild-Standard Aetheric Antidote",
		description:
			"A Bureau-graded antidote calibrated for the most common gate-acquired afflictions.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0877.webp",
		weight: 8,
		value: 172,
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
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "damage", "control", "consumable"],
		theme_tags: ["hunter-bureau", "modern-warfare"],
	},
	{
		id: "item_p2_33",
		name: "Purified Beast Repellent",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-1020.webp",
		weight: 2,
		value: 186,
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
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "For the part of the fight that comes after the fight.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "necrotic", "control", "shadow", "consumable"],
		theme_tags: ["experimental", "shadow-domain", "guild-ops"],
	},
	{
		id: "item_p2_34",
		name: "Black-Market Beast Repellent",
		description:
			"A Hunter-grade restorative; sealed against ambient mana decay.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0823.webp",
		weight: 1,
		value: 413,
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
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Read the label. Then drink anyway.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "utility", "healing", "consumable"],
		theme_tags: ["urban-combat", "hunter-bureau"],
	},
	{
		id: "item_p2_35",
		name: "Unstable Health Potion",
		description:
			"An alchemist-licensed restorative. Mana-conductive, fast-absorbing.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0054.webp",
		weight: 7,
		value: 100,
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
				"Hand-built in a clandestine Daejeon workshop and sold through the gray market.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The first sip is the worst. Drink past it.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "control", "utility", "consumable"],
		theme_tags: ["elite-tier", "rift-energy"],
	},
	{
		id: "item_p2_36",
		name: "Guild-Issue Warhammer",
		description:
			"A heavy maul with a Bureau-stamped haft and a head heavy enough to dent gate steel.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0289.webp",
		weight: 6,
		value: 40,
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
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Recommissioned three times across its service life. Inspected at every reissue.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It will only ever be as deadly as the hand that holds it.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "radiant", "lightning", "melee"],
		theme_tags: ["mana-overflow", "forbidden"],
	},
	{
		id: "item_p2_37",
		name: "Hunter's Warhammer",
		description:
			"A heavy two-handed crusher. Best used against fortified anomalies.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0560.webp",
		weight: 8,
		value: 248,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "2d6",
		damage_type: "bludgeoning",
		simple_properties: ["heavy", "two-handed", "loading"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "2d6",
				damage_type: "bludgeoning",
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
				"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
				"+1 AC against the first attack made against you each round.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "shadow", "necrotic", "buff", "perception", "melee"],
		theme_tags: ["black-market", "gate-zone", "classified"],
	},
	{
		id: "item_p2_38",
		name: "Starlight Sniper Rifle",
		description:
			"A precision rifle with mana-stable optics. Effective against armored anomalies at extended range.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0307.webp",
		weight: 5,
		value: 310,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d10",
		damage_type: "radiant",
		simple_properties: ["ammunition", "two-handed"],
		range: "Ranged (80/240)",
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "radiant",
				range: 80,
			},
		},
		effects: {
			passive: [
				"Long-arm. Disadvantage on attacks within 5 ft.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "necrotic", "stealth", "firearm"],
		theme_tags: ["classified", "dungeon-core", "survival"],
	},
	{
		id: "item_p2_39",
		name: "Guild-Issue Halberd",
		description:
			"A long-reach polearm balanced for crowd control and formation work.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0210.webp",
		weight: 7,
		value: 505,
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
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Hand-built in a clandestine Daejeon workshop and sold through the gray market.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Sized for the wielder who finishes fights, not the one who starts them.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "utility", "sustained", "melee"],
		theme_tags: ["experimental", "elite-tier"],
	},
	{
		id: "item_p2_40",
		name: "Hunter's Spear",
		description: "A field-issue spear designed for second-rank engagement.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0802.webp",
		weight: 5,
		value: 238,
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
				"Once per short rest, treat a single failed Vitality save as a success.",
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
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "stealth", "control", "necrotic", "support", "melee"],
		theme_tags: ["dungeon-core", "gate-zone", "classified"],
	},
	{
		id: "item_p2_41",
		name: "Hunter's Warhammer",
		description:
			"A heavy two-handed crusher. Best used against fortified anomalies.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0907.webp",
		weight: 4,
		value: 380,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "2d6",
		damage_type: "bludgeoning",
		simple_properties: ["heavy", "two-handed", "loading"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "2d6",
				damage_type: "bludgeoning",
			},
		},
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
				"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
				"Once per long rest, gain advantage on all attacks for 1 round as a bonus action.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "lightning", "mobility", "psychic", "melee"],
		theme_tags: ["system-glitch", "survival"],
	},
	{
		id: "item_p2_42",
		name: "Crimson Sniper Rifle",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0276.webp",
		weight: 1,
		value: 34,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "2d6",
		damage_type: "slashing",
		simple_properties: ["ammunition", "two-handed", "heavy"],
		range: "Ranged (80/240)",
		properties: {
			weapon: {
				damage: "2d6",
				damage_type: "slashing",
				range: 80,
			},
		},
		effects: {
			passive: [
				"Marksman variant. Crit on 19-20.",
				"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "shadow", "necrotic", "lightning", "firearm"],
		theme_tags: ["system-glitch", "guild-ops", "post-awakening"],
	},
	{
		id: "item_p2_43",
		name: "Unstable Beast Repellent",
		description:
			"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0133.webp",
		weight: 6,
		value: 468,
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
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Read the label. Then drink anyway.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "support", "ice", "mobility", "consumable"],
		theme_tags: ["dimensional-bleed", "modern-warfare", "rift-energy"],
	},
	{
		id: "item_p2_44",
		name: "High-Grade Aetheric Antidote",
		description:
			"A field-issued purifier. Standard kit for medics and forward observers.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0366.webp",
		weight: 6,
		value: 117,
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
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "stealth", "ice", "psychic", "shadow", "consumable"],
		theme_tags: ["hunter-bureau", "dungeon-core"],
	},
	{
		id: "item_p2_45",
		name: "Mana-Infused Halberd",
		description:
			"A two-handed reach weapon — good against fast, low-ground anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0879.webp",
		weight: 1,
		value: 84,
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
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
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
				"Sourced from the post-clear loot dispersion of a successful A-rank gate operation.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It owes nothing to luck. It is what it costs.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "lightning", "burst", "psychic", "melee"],
		theme_tags: ["regent-era", "rift-energy"],
	},
	{
		id: "item_p2_46",
		name: "Aetheric Katana",
		description: "A Bureau-grade longsword with a mana-conductive crossguard.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0592.webp",
		weight: 4,
		value: 173,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "force",
		simple_properties: ["versatile (1d12)", "two-handed-bonus"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "force",
				versatile: "1d12",
			},
		},
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
				"When wielded two-handed, +1 to damage rolls.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1d4 damage against creatures with the Construct or Anomaly tag.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Heavy in the hand. Heavier in consequence.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "area", "support", "melee"],
		theme_tags: ["dimensional-bleed", "guild-ops"],
	},
	{
		id: "item_p2_47",
		name: "Abyssal Dagger",
		description: "A compact dagger sized for boot-sheath carry.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0577.webp",
		weight: 1,
		value: 444,
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
					name: "Surge Strike",
					description:
						"As a bonus action, your next attack with this weapon before the end of your turn deals an additional 2d6 damage.",
					action: "bonus-action",
					frequency: "short-rest",
				},
			],
			passive: [
				"+1 to attack rolls when you have advantage.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"Once per long rest, cast a 2nd-level spell (player choice) without expending a spell slot.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It owes nothing to luck. It is what it costs.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "ice", "necrotic", "area", "sustained", "melee"],
		theme_tags: ["dungeon-core", "system-glitch"],
	},
	{
		id: "item_p2_48",
		name: "Guild-Standard Beast Repellent",
		description:
			"An alchemist-licensed restorative. Mana-conductive, fast-absorbing.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0258.webp",
		weight: 7,
		value: 242,
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
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Bureau's standard answer to 'how are we still alive?'",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: [
			"equipment",
			"single-target",
			"buff",
			"radiant",
			"perception",
			"consumable",
		],
		theme_tags: ["mana-overflow", "elite-tier", "modern-warfare"],
	},
	{
		id: "item_p2_49",
		name: "Abyssal Dagger",
		description: "A precision short blade favored by Strikers and Assassins.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0619.webp",
		weight: 3,
		value: 385,
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
				"Crit on 19-20.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It will only ever be as deadly as the hand that holds it.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "fire", "single-target", "melee"],
		theme_tags: ["dimensional-bleed", "ancient-power"],
	},
];
