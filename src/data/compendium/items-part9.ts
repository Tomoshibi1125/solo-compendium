import type { Item } from "./items";

export const items_part9: Item[] = [
	{
		id: "item_p9_0",
		name: "Mana-Infused Dagger",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0876.webp",
		weight: 2,
		value: 501,
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
				"Crit on 19-20.",
				"While attuned, gain +1 to spell-attack rolls.",
				"Once per short rest, reroll a missed attack roll.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "What survives a Hunter's tour usually outlives the Hunter.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "radiant", "buff", "ice", "melee"],
		theme_tags: ["mana-overflow", "elite-tier", "shadow-domain"],
	},
	{
		id: "item_p9_1",
		name: "Crimson Longsword",
		description:
			"A versatile cutting blade with a tempered edge and Bureau service marks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0989.webp",
		weight: 5,
		value: 407,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "slashing",
		simple_properties: ["versatile (1d10)"],
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "slashing",
				versatile: "1d10",
			},
		},
		effects: {
			passive: [
				"While target is below half HP, attacks with this weapon deal +1d4 damage.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "sustained", "ice", "melee"],
		theme_tags: ["dungeon-core", "rift-energy", "urban-combat"],
	},
	{
		id: "item_p9_2",
		name: "Concentrated Aetheric Antidote",
		description:
			"A small dose of curative liquid. One condition cleared per application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0610.webp",
		weight: 2,
		value: 400,
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
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
			origin:
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "One dose. Make it count.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "shadow", "area", "necrotic", "consumable"],
		theme_tags: ["elite-tier", "experimental"],
	},
	{
		id: "item_p9_3",
		name: "Abyssal Dagger",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0707.webp",
		weight: 3,
		value: 429,
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
				"+1d4 damage against creatures with the Construct or Anomaly tag.",
			],
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
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "necrotic", "offensive", "fire", "melee"],
		theme_tags: ["regent-era", "urban-combat", "elite-tier"],
	},
	{
		id: "item_p9_4",
		name: "Void Warhammer",
		description:
			"A reinforced sledge â€” for when an obstacle needs to stop being one.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0416.webp",
		weight: 4,
		value: 34,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "2d6",
		damage_type: "necrotic",
		simple_properties: ["heavy", "two-handed", "loading"],
		properties: {
			weapon: {
				damage: "2d6",
				damage_type: "necrotic",
			},
		},
		effects: {
			passive: [
				"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"Once per short rest, treat a single failed Vitality save as a success.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Recommissioned three times across its service life. Inspected at every reissue.",
			origin:
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It will only ever be as deadly as the hand that holds it.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "damage", "ice", "area", "melee"],
		theme_tags: ["regent-era", "modern-warfare"],
	},
	{
		id: "item_p9_5",
		name: "Mana-Infused Halberd",
		description:
			"A two-handed reach weapon used to break melee lines and protect spellcasters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0401.webp",
		weight: 4,
		value: 420,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "force",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "force",
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It owes nothing to luck. It is what it costs.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "burst", "necrotic", "buff", "offensive", "melee"],
		theme_tags: ["post-awakening", "dimensional-bleed"],
	},
	{
		id: "item_p9_6",
		name: "Concentrated Beast Repellent",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0166.webp",
		weight: 2,
		value: 328,
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
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Bureau's standard answer to 'how are we still alive?'",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "lightning", "debuff", "consumable"],
		theme_tags: ["shadow-domain", "experimental"],
	},
	{
		id: "item_p9_7",
		name: "Aether-Plated Breastplate",
		description:
			"A reinforced heavy armor shell. Designed for line-holders and gate-breach teams.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0679.webp",
		weight: 2,
		value: 247,
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
				"Showed up in pawn shops across three districts before the Bureau issued a recall.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Comfort is a luxury. Coming back is the requirement.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "void", "shadow", "armor"],
		theme_tags: ["rift-energy", "shadow-domain", "survival"],
	},
	{
		id: "item_p9_8",
		name: "Concentrated Aetheric Antidote",
		description:
			"A neutralizing agent calibrated for gate-acquired contamination.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0388.webp",
		weight: 4,
		value: 370,
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
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "damage", "healing", "area", "necrotic", "consumable"],
		theme_tags: ["guild-ops", "urban-combat"],
	},
	{
		id: "item_p9_9",
		name: "Shadow Spaulders",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0245.webp",
		weight: 2,
		value: 79,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Mana-stable plate. Resistance to force damage.",
				"Disadvantage on attacks against you while you are obscured.",
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "area", "necrotic", "armor"],
		theme_tags: ["experimental", "hunter-bureau"],
	},
	{
		id: "item_p9_10",
		name: "Vanguard Shin Guards",
		description:
			"A multi-layer combat coat woven from impact-resistant fabric.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0973.webp",
		weight: 5,
		value: 345,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Comfort is a luxury. Coming back is the requirement.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "fire", "sustained", "healing", "stealth", "armor"],
		theme_tags: ["forbidden", "rift-energy", "classified"],
	},
	{
		id: "item_p9_11",
		name: "Black-Market Stamina Stim",
		description:
			"A high-uptake injector used by frontline Hunters under sustained fire.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0100.webp",
		weight: 7,
		value: 204,
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
				"Recommissioned three times across its service life. Inspected at every reissue.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "radiant", "sustained", "healing", "consumable"],
		theme_tags: ["regent-era", "forbidden", "post-awakening"],
	},
	{
		id: "item_p9_12",
		name: "Abyssal Longsword",
		description:
			"A versatile cutting blade with a tempered edge and Bureau service marks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0971.webp",
		weight: 6,
		value: 217,
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
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "support", "damage", "perception", "utility", "melee"],
		theme_tags: ["shadow-domain", "guild-ops", "regent-era"],
	},
	{
		id: "item_p9_13",
		name: "Aetheric Longsword",
		description:
			"A versatile blade â€” single-handed for speed, two-handed for finishing strokes.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0890.webp",
		weight: 6,
		value: 165,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "force",
		simple_properties: ["versatile (1d10)"],
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "force",
				versatile: "1d10",
			},
		},
		effects: {
			passive: [
				"While attuned, gain +1 to spell-attack rolls.",
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Don't trust a weapon you can't put down.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "necrotic", "healing", "damage", "melee"],
		theme_tags: ["forbidden", "urban-combat", "modern-warfare"],
	},
	{
		id: "item_p9_14",
		name: "Abyssal Revolver",
		description:
			"A compact firearm machined to standard Hunter Bureau tolerances. Fits any standard-issue holster.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0401.webp",
		weight: 4,
		value: 42,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d8",
		damage_type: "necrotic",
		simple_properties: ["ammunition", "light"],
		range: "Ranged (40/120)",
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "necrotic",
				range: 40,
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
				"Sidearm. Reload (1) on a bonus action.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"While attuned, you have advantage on saves against the Stunned condition.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "shadow", "burst", "stealth", "void", "firearm"],
		theme_tags: ["elite-tier", "survival"],
	},
	{
		id: "item_p9_15",
		name: "Guild-Standard Stamina Stim",
		description: "A pre-measured combat stim with Bureau-coded markings.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0680.webp",
		weight: 1,
		value: 363,
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
				"Showed up in pawn shops across three districts before the Bureau issued a recall.",
			origin:
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "healing", "lightning", "sustained", "consumable"],
		theme_tags: ["modern-warfare", "shadow-domain"],
	},
	{
		id: "item_p9_16",
		name: "Starlight Gauntlets",
		description:
			"Field-issued combat gauntlets for Striker-class Hunters and tactical brawlers.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0943.webp",
		weight: 1,
		value: 42,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d6",
		damage_type: "radiant",
		simple_properties: ["light", "striker"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "radiant",
			},
		},
		effects: {
			passive: [
				"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
				"On a critical hit, target is Blinded until the end of its next turn.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Hand-finished by a Bureau master artificer working out of the Seoul Forge District.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Carried by people who know the difference between a kill and a survival.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "offensive", "perception", "melee"],
		theme_tags: ["forbidden", "dungeon-core"],
	},
	{
		id: "item_p9_17",
		name: "Purified Aetheric Antidote",
		description:
			"A Bureau-graded antidote calibrated for the most common gate-acquired afflictions.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0174.webp",
		weight: 8,
		value: 87,
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
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "fire", "sustained", "consumable"],
		theme_tags: ["post-awakening", "black-market", "classified"],
	},
	{
		id: "item_p9_18",
		name: "Hunter's Sniper Rifle",
		description:
			"A Bureau-issued service rifle, balanced for accuracy over rate of fire.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0501.webp",
		weight: 4,
		value: 324,
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
				"Once per short rest, reroll a missed attack roll.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Passed quietly between three guildhalls before settling into the Bureau's surplus cycle.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "sustained", "utility", "fire", "damage", "firearm"],
		theme_tags: ["dungeon-core", "modern-warfare", "elite-tier"],
	},
	{
		id: "item_p9_19",
		name: "Shadow Tactical Helmet",
		description: "Reinforced headgear with mana-treated impact lining.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0644.webp",
		weight: 6,
		value: 127,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Reinforced headgear. Advantage on saves vs. concussive impacts.",
				"Disadvantage on attacks against you while you are obscured.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
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
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "shadow", "defensive", "damage", "armor"],
		theme_tags: ["dungeon-core", "ancient-power", "elite-tier"],
	},
	{
		id: "item_p9_20",
		name: "Shadow Exo-Suit",
		description:
			"A reinforced kevlar-and-mana-weave layer. Cheap, common, effective.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0204.webp",
		weight: 3,
		value: 381,
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
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Pull the straps tight. Trust the maker.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "mobility", "void", "utility", "armor"],
		theme_tags: ["shadow-domain", "classified", "mana-overflow"],
	},
	{
		id: "item_p9_21",
		name: "Nano-Weave Shin Guards",
		description: "A Stalker-class light armor sized for extended gate sweeps.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0061.webp",
		weight: 5,
		value: 308,
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
				"Once per short rest, cast Misty Step (no spell slot required) while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "ice", "offensive", "defensive", "armor"],
		theme_tags: ["dungeon-core", "system-glitch", "black-market"],
	},
	{
		id: "item_p9_22",
		name: "Obsidian Gauntlets",
		description:
			"A reinforced gauntlet that turns unarmed strikes into solid kinetic blows.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0714.webp",
		weight: 7,
		value: 168,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d4",
		damage_type: "necrotic",
		simple_properties: ["light", "striker", "arcane focus"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "necrotic",
			},
		},
		effects: {
			passive: [
				"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
				"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
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
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "defensive", "burst", "melee"],
		theme_tags: ["experimental", "regent-era"],
	},
	{
		id: "item_p9_23",
		name: "High-Grade Liquid Shadow",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0043.webp",
		weight: 8,
		value: 304,
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
				"Saw heavy rotation among second-strike teams during the Busan Incident.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's not pretty going down. It's prettier than the alternative.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "area", "perception", "buff", "psychic", "consumable"],
		theme_tags: ["forbidden", "modern-warfare", "guild-ops"],
	},
	{
		id: "item_p9_24",
		name: "Concentrated Aetheric Antidote",
		description:
			"A small dose of curative liquid. One condition cleared per application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0776.webp",
		weight: 7,
		value: 288,
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
				"Saw heavy rotation among second-strike teams during the Busan Incident.",
			origin:
				"Pulled from the gear locker of a mid-rank Hunter declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "support", "damage", "shadow", "control", "consumable"],
		theme_tags: ["elite-tier", "system-glitch"],
	},
	{
		id: "item_p9_25",
		name: "Greater Health Potion",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0505.webp",
		weight: 3,
		value: 86,
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
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The first sip is the worst. Drink past it.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "mobility", "damage", "consumable"],
		theme_tags: ["regent-era", "dungeon-core"],
	},
	{
		id: "item_p9_26",
		name: "Guild-Issue Revolver",
		description:
			"A short-barrel handgun tuned for fast draw and reliable function inside cramped gate corridors.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0270.webp",
		weight: 2,
		value: 75,
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
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Sized for the wielder who finishes fights, not the one who starts them.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "perception", "support", "buff", "firearm"],
		theme_tags: ["ancient-power", "mana-overflow", "black-market"],
	},
	{
		id: "item_p9_27",
		name: "Obsidian Revolver",
		description:
			"A compact firearm machined to standard Hunter Bureau tolerances. Fits any standard-issue holster.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0007.webp",
		weight: 5,
		value: 464,
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
				"While in dim light or darkness, attacks with this weapon have advantage.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Hand-finished by a Bureau master artificer working out of the Seoul Forge District.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Sized for the wielder who finishes fights, not the one who starts them.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: [
			"equipment",
			"perception",
			"damage",
			"mobility",
			"single-target",
			"firearm",
		],
		theme_tags: ["black-market", "regent-era", "survival"],
	},
	{
		id: "item_p9_28",
		name: "Greater Mana Elixir",
		description:
			"A regulated alchemical compound. Restores hit points on consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0692.webp",
		weight: 6,
		value: 199,
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
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "control", "psychic", "area", "consumable"],
		theme_tags: ["dungeon-core", "hunter-bureau"],
	},
	{
		id: "item_p9_29",
		name: "Lattice-Scale Combat Vest",
		description: "A Stalker-class light armor sized for extended gate sweeps.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0789.webp",
		weight: 1,
		value: 90,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"+1 to spell-save DCs while worn.",
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
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Steel between you and the world. Not always enough; usually enough.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "fire", "debuff", "healing", "stealth", "armor"],
		theme_tags: ["modern-warfare", "shadow-domain", "mana-overflow"],
	},
	{
		id: "item_p9_30",
		name: "Black-Market Aetheric Antidote",
		description:
			"A regulated cure compound. Removes a single condition on application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0911.webp",
		weight: 2,
		value: 149,
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
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Surfaced in the Hunter Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "defensive", "healing", "consumable"],
		theme_tags: ["gate-zone", "experimental"],
	},
	{
		id: "item_p9_31",
		name: "Gate-Forged Tactical Helmet",
		description: "Bureau-issued head protection, lightweight and fitted.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0374.webp",
		weight: 3,
		value: 19,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
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
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "control", "ice", "healing", "armor"],
		theme_tags: ["regent-era", "classified"],
	},
	{
		id: "item_p9_32",
		name: "Aegis Shin Guards",
		description:
			"A reinforced shield. Standard kit for line-holders inside high-rank gates.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0625.webp",
		weight: 8,
		value: 190,
		item_type: "shield",
		armor_class: "+2",
		armor_type: "Shield",
		requires_attunement: true,
		properties: {},
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
				"Provides +3 AC while wielded.",
				"Standard shield. +2 AC.",
				"Once per short rest, treat a roll of 1-9 on an attack as a 10.",
			],
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
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "burst", "ice", "armor"],
		theme_tags: ["dungeon-core", "guild-ops", "hunter-bureau"],
	},
	{
		id: "item_p9_33",
		name: "Titanium Tactical Helmet",
		description: "Bureau-issued head protection, lightweight and fitted.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0896.webp",
		weight: 5,
		value: 433,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Pull the straps tight. Trust the maker.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "ice", "sustained", "stealth", "lightning", "armor"],
		theme_tags: ["system-glitch", "forbidden"],
	},
	{
		id: "item_p9_34",
		name: "Mana-Infused Spear",
		description:
			"A two-handed reach weapon â€” good against fast, low-ground anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0939.webp",
		weight: 3,
		value: 465,
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
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Once per short rest, reroll a missed attack roll.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Earned a footnote in the Hunter Association's quarterly equipment audit.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "debuff", "lightning", "radiant", "psychic", "melee"],
		theme_tags: ["mana-overflow", "dimensional-bleed", "post-awakening"],
	},
	{
		id: "item_p9_35",
		name: "Void Gauntlets",
		description:
			"A close-combat gauntlet favored by Strikers and unarmed-Mage hybrids.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0834.webp",
		weight: 2,
		value: 474,
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
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Made a brief appearance in a guild quartermaster's leaving inventory dispute.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "damage", "support", "psychic", "melee"],
		theme_tags: ["elite-tier", "dungeon-core", "mana-overflow"],
	},
	{
		id: "item_p9_36",
		name: "Lattice-Scale Combat Vest",
		description:
			"A close-fitting armor jacket cut from mana-treated synthetic fiber.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0165.webp",
		weight: 1,
		value: 278,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"+1 to spell-save DCs while worn.",
				"+1 to one save of your choice while attuned.",
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
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "psychic", "radiant", "armor"],
		theme_tags: ["black-market", "shadow-domain", "guild-ops"],
	},
	{
		id: "item_p9_37",
		name: "Greater Health Potion",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0308.webp",
		weight: 5,
		value: 439,
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
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "For the part of the fight that comes after the fight.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: [
			"equipment",
			"defensive",
			"healing",
			"radiant",
			"utility",
			"consumable",
		],
		theme_tags: ["mana-overflow", "dimensional-bleed", "forbidden"],
	},
	{
		id: "item_p9_38",
		name: "Concentrated Stamina Stim",
		description:
			"A medical stim packed for one-handed application during a fight.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0423.webp",
		weight: 7,
		value: 57,
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
				"Quietly stockpiled by the Hunter Association after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "debuff", "damage", "void", "consumable"],
		theme_tags: ["ancient-power", "survival"],
	},
	{
		id: "item_p9_39",
		name: "Guild-Issue Halberd",
		description:
			"A glaive favored by gate-line tanks for keeping anomalies at distance.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0918.webp",
		weight: 6,
		value: 288,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "2d4",
		damage_type: "piercing",
		simple_properties: ["reach", "two-handed", "thrown"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "2d4",
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
				"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
				"Critical hits with this item ignore resistance to its damage type.",
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
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "healing", "fire", "debuff", "utility", "melee"],
		theme_tags: ["urban-combat", "rift-energy"],
	},
	{
		id: "item_p9_40",
		name: "Ceramic Bracers",
		description: "A reinforced bracer with mild armor weave on the inner face.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0478.webp",
		weight: 7,
		value: 205,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
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
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"What you carry tells the Bureau what kind of Hunter you intend to be.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "defensive", "control", "lightning", "gear"],
		theme_tags: ["urban-combat", "rift-energy", "ancient-power"],
	},
	{
		id: "item_p9_41",
		name: "Black-Market Health Potion",
		description:
			"A combat-grade healing compound packaged for sub-action consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0991.webp",
		weight: 6,
		value: 264,
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
				"Passed quietly between three guildhalls before settling into the Bureau's surplus cycle.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Bureau's standard answer to 'how are we still alive?'",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "defensive", "radiant", "single-target", "consumable"],
		theme_tags: ["post-awakening", "shadow-domain"],
	},
	{
		id: "item_p9_42",
		name: "Crimson Spear",
		description:
			"A long-reach polearm balanced for crowd control and formation work.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0720.webp",
		weight: 2,
		value: 410,
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
				"On a hit, target takes 1d4 ongoing slashing damage at the start of its next two turns (Bleeding).",
				"Add +1d4 damage when target is below half HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "support", "debuff", "radiant", "ice", "melee"],
		theme_tags: ["classified", "modern-warfare", "rift-energy"],
	},
	{
		id: "item_p9_43",
		name: "Titanium Breastplate",
		description:
			"A breach-line plate harness rated for sustained anomaly contact.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0705.webp",
		weight: 2,
		value: 215,
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
				"On a hit, target makes a DC 13 Vitality save or is disarmed of one held item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "stealth", "ice", "armor"],
		theme_tags: ["mana-overflow", "survival", "ancient-power"],
	},
	{
		id: "item_p9_44",
		name: "High-Grade Health Potion",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0930.webp",
		weight: 6,
		value: 284,
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
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "For the part of the fight that comes after the fight.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "control", "shadow", "burst", "consumable"],
		theme_tags: ["gate-zone", "system-glitch", "hunter-bureau"],
	},
	{
		id: "item_p9_45",
		name: "Lattice-Scale Tactical Helmet",
		description: "Bureau-issued head protection, lightweight and fitted.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0003.webp",
		weight: 6,
		value: 473,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"+1 to spell-save DCs while worn.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "burst", "ice", "single-target", "armor"],
		theme_tags: ["survival", "shadow-domain", "dungeon-core"],
	},
	{
		id: "item_p9_46",
		name: "Lesser Aetheric Antidote",
		description:
			"A small dose of curative liquid. One condition cleared per application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0404.webp",
		weight: 2,
		value: 497,
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
				"Earned a footnote in the Hunter Association's quarterly equipment audit.",
			origin:
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "One dose. Make it count.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: [
			"equipment",
			"sustained",
			"shadow",
			"offensive",
			"damage",
			"consumable",
		],
		theme_tags: ["regent-era", "system-glitch", "post-awakening"],
	},
	{
		id: "item_p9_47",
		name: "Aether-Plated Exo-Suit",
		description:
			"A multi-layer combat coat woven from impact-resistant fabric.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0261.webp",
		weight: 6,
		value: 123,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Resistance to force damage.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "single-target", "debuff", "shadow", "void", "armor"],
		theme_tags: ["experimental", "urban-combat"],
	},
	{
		id: "item_p9_48",
		name: "Starlight Warhammer",
		description:
			"A heavy maul with a Bureau-stamped haft and a head heavy enough to dent gate steel.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0966.webp",
		weight: 5,
		value: 73,
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
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Carried by people who know the difference between a kill and a survival.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "shadow", "stealth", "melee"],
		theme_tags: ["post-awakening", "system-glitch"],
	},
	{
		id: "item_p9_49",
		name: "Shadow Combat Vest",
		description:
			"A field armor designed to keep mobility without sacrificing all protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0447.webp",
		weight: 7,
		value: 434,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
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
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "support", "stealth", "armor"],
		theme_tags: ["system-glitch", "dimensional-bleed", "gate-zone"],
	},
];
