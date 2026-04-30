import type { Item } from "./items";

export const items_part3: Item[] = [
	{
		id: "item_p3_0",
		name: "Starlight Dagger",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0548.webp",
		weight: 5,
		value: 448,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "radiant",
		simple_properties: ["light", "finesse", "thrown"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "radiant",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Off-hand attack on a hit deals +1 damage if you are wielding two weapons.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"Once per short rest, reroll a missed attack roll.",
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
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "single-target", "buff", "melee"],
		theme_tags: ["black-market", "dungeon-core", "classified"],
	},
	{
		id: "item_p3_1",
		name: "Void Revolver",
		description:
			"A Bureau-spec sidearm tuned for close-quarters work inside collapsed gates.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0405.webp",
		weight: 5,
		value: 345,
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
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
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
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "ice", "shadow", "lightning", "firearm"],
		theme_tags: ["modern-warfare", "survival"],
	},
	{
		id: "item_p3_2",
		name: "Lesser Aetheric Antidote",
		description: "A clear-glass cure compound suitable for field application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0042.webp",
		weight: 6,
		value: 399,
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
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "One dose. Make it count.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "control", "ice", "consumable"],
		theme_tags: ["hunter-bureau", "mana-overflow"],
	},
	{
		id: "item_p3_3",
		name: "Phantom Tactical Helmet",
		description: "Reinforced headgear with mana-treated impact lining.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0147.webp",
		weight: 6,
		value: 372,
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
				"Catalogued in the Hunter Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "defensive", "fire", "armor"],
		theme_tags: ["classified", "dungeon-core"],
	},
	{
		id: "item_p3_4",
		name: "Greater Liquid Shadow",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0880.webp",
		weight: 4,
		value: 425,
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
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Procured through the Hunter Association's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "psychic", "support", "consumable"],
		theme_tags: ["ancient-power", "post-awakening", "dimensional-bleed"],
	},
	{
		id: "item_p3_5",
		name: "Obsidian Gauntlets",
		description: "Articulated combat gauntlets that double as a martial focus.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0865.webp",
		weight: 8,
		value: 297,
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
				"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
				"+5 ft. to your speed while wielding this item.",
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
		flavor: "It does the job. That's all the Bureau asks of it.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "buff", "ice", "area", "healing", "melee"],
		theme_tags: ["modern-warfare", "regent-era"],
	},
	{
		id: "item_p3_6",
		name: "Mana-Infused Warhammer",
		description:
			"A heavy maul with a Bureau-stamped haft and a head heavy enough to dent gate steel.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0638.webp",
		weight: 8,
		value: 459,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "force",
		simple_properties: ["heavy", "two-handed"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "force",
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
				"On a hit, target makes a DC 13 Strength save or is knocked prone.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1d4 damage against creatures of the Anomaly tag.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: [
			"equipment",
			"shadow",
			"buff",
			"lightning",
			"single-target",
			"melee",
		],
		theme_tags: ["experimental", "shadow-domain", "hunter-bureau"],
	},
	{
		id: "item_p3_7",
		name: "Purified Stamina Stim",
		description:
			"A medical stim packed for one-handed application during a fight.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0119.webp",
		weight: 5,
		value: 266,
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
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Surfaced in the Hunter Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "One dose. Make it count.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: [
			"equipment",
			"radiant",
			"lightning",
			"healing",
			"mobility",
			"consumable",
		],
		theme_tags: ["modern-warfare", "post-awakening"],
	},
	{
		id: "item_p3_8",
		name: "Lesser Beast Repellent",
		description:
			"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0004.webp",
		weight: 7,
		value: 415,
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
				"Brokered to a Hunter Association quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "ice", "void", "stealth", "consumable"],
		theme_tags: ["dungeon-core", "elite-tier", "shadow-domain"],
	},
	{
		id: "item_p3_9",
		name: "Abyssal Warhammer",
		description:
			"A heavy two-handed crusher. Best used against fortified anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0893.webp",
		weight: 1,
		value: 503,
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
				"On a critical hit, target is Frightened until the end of its next turn.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
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
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "offensive", "mobility", "melee"],
		theme_tags: ["experimental", "guild-ops", "survival"],
	},
	{
		id: "item_p3_10",
		name: "Guild-Issue Warhammer",
		description:
			"A massive impact weapon balanced for sweeping strikes and structural breaks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0469.webp",
		weight: 5,
		value: 499,
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
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: ["equipment", "buff", "necrotic", "melee"],
		theme_tags: ["urban-combat", "mana-overflow", "black-market"],
	},
	{
		id: "item_p3_11",
		name: "Purified Aetheric Antidote",
		description:
			"A purifier vial labeled with the Bureau's medical-clearance stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0612.webp",
		weight: 2,
		value: 334,
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
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "offensive", "area", "consumable"],
		theme_tags: ["forbidden", "urban-combat", "guild-ops"],
	},
	{
		id: "item_p3_12",
		name: "Shattered Gauntlets",
		description:
			"A reinforced gauntlet that turns unarmed strikes into solid kinetic blows.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0467.webp",
		weight: 4,
		value: 128,
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
				"Once per long rest, you may make one weapon attack as a bonus action.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: [
			"equipment",
			"perception",
			"psychic",
			"support",
			"necrotic",
			"melee",
		],
		theme_tags: ["rift-energy", "experimental"],
	},
	{
		id: "item_p3_13",
		name: "Mana-Infused Dagger",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0106.webp",
		weight: 1,
		value: 174,
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
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"+1 to attack rolls when at full HP.",
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
		flavor: "What survives a Hunter's tour usually outlives the Hunter.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "stealth", "buff", "void", "melee"],
		theme_tags: ["modern-warfare", "elite-tier"],
	},
	{
		id: "item_p3_14",
		name: "Lesser Mana Elixir",
		description:
			"A clear-glass restorative phial sealed with a Bureau quartermaster stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0913.webp",
		weight: 8,
		value: 190,
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
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Hunter's anonymous tip.",
		tags: [
			"equipment",
			"support",
			"debuff",
			"single-target",
			"lightning",
			"consumable",
		],
		theme_tags: ["post-awakening", "system-glitch", "mana-overflow"],
	},
	{
		id: "item_p3_15",
		name: "Void Revolver",
		description:
			"A reinforced sidearm with a Bureau-stamped frame and ichor-resistant action.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0168.webp",
		weight: 3,
		value: 197,
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
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
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
		flavor: "It does the job. That's all the Bureau asks of it.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "mobility", "shadow", "fire", "firearm"],
		theme_tags: ["classified", "shadow-domain"],
	},
	{
		id: "item_p3_16",
		name: "Guild-Issue Whip",
		description:
			"A long flexible weapon with a finesse grip. Reach without weight.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0415.webp",
		weight: 6,
		value: 301,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "bludgeoning",
		simple_properties: ["finesse", "reach"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "bludgeoning",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Reach. On a hit, target makes a DC 11 Strength save or is disarmed.",
				"+1 to one save of your choice while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "What survives a Hunter's tour usually outlives the Hunter.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "defensive", "shadow", "utility", "buff", "melee"],
		theme_tags: ["dungeon-core", "ancient-power"],
	},
	{
		id: "item_p3_17",
		name: "Black-Market Health Potion",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0678.webp",
		weight: 2,
		value: 388,
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
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Hunters' survival.",
			origin:
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "offensive", "stealth", "fire", "area", "consumable"],
		theme_tags: ["dungeon-core", "rift-energy", "black-market"],
	},
	{
		id: "item_p3_18",
		name: "Lesser Liquid Shadow",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0181.webp",
		weight: 2,
		value: 184,
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
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "sustained", "fire", "buff", "consumable"],
		theme_tags: ["dungeon-core", "survival"],
	},
	{
		id: "item_p3_19",
		name: "Lesser Stamina Stim",
		description: "A Bureau-stamped emergency injector. Last-resort kit.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0068.webp",
		weight: 7,
		value: 241,
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
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The first sip is the worst. Drink past it.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: [
			"equipment",
			"mobility",
			"offensive",
			"utility",
			"healing",
			"consumable",
		],
		theme_tags: ["dimensional-bleed", "urban-combat", "regent-era"],
	},
	{
		id: "item_p3_20",
		name: "Abyssal Revolver",
		description:
			"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0836.webp",
		weight: 2,
		value: 84,
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
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Don't trust a weapon you can't put down.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "offensive", "void", "damage", "defensive", "firearm"],
		theme_tags: ["dungeon-core", "system-glitch", "shadow-domain"],
	},
	{
		id: "item_p3_21",
		name: "Titanium Combat Vest",
		description:
			"A compact tactical layer designed for fast movers operating inside C-rank gates.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0949.webp",
		weight: 4,
		value: 98,
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
				"Was the subject of a dismissed bidding war between two mid-tier Guilds.",
			origin:
				"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Comfort is a luxury. Coming back is the requirement.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "area", "stealth", "armor"],
		theme_tags: ["modern-warfare", "shadow-domain"],
	},
	{
		id: "item_p3_22",
		name: "Concentrated Liquid Shadow",
		description:
			"A combat-grade healing compound packaged for sub-action consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0586.webp",
		weight: 3,
		value: 165,
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
				"Showed up in pawn shops across three districts before the Bureau issued a recall.",
			origin:
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The first sip is the worst. Drink past it.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "area", "sustained", "necrotic", "consumable"],
		theme_tags: ["experimental", "system-glitch", "black-market"],
	},
	{
		id: "item_p3_23",
		name: "Starlight Sniper Rifle",
		description:
			"A Bureau-issued service rifle, balanced for accuracy over rate of fire.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0683.webp",
		weight: 8,
		value: 260,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d12",
		damage_type: "radiant",
		simple_properties: ["ammunition", "two-handed", "loading"],
		range: "Ranged (100/400)",
		properties: {
			weapon: {
				damage: "1d12",
				damage_type: "radiant",
				range: 100,
			},
		},
		effects: {
			passive: [
				"Bolt-action. One attack per turn; +1 to attack rolls.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"+1 to one save of your choice while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Passed quietly between three guildhalls before settling into the Bureau's surplus cycle.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: [
			"equipment",
			"mobility",
			"necrotic",
			"sustained",
			"perception",
			"firearm",
		],
		theme_tags: ["mana-overflow", "ancient-power", "regent-era"],
	},
	{
		id: "item_p3_24",
		name: "Mana-Infused Longsword",
		description:
			"A reliable mid-weight blade â€” the kind every Hunter learns on, and many never replace.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0392.webp",
		weight: 4,
		value: 362,
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
				"Counts as both slashing and piercing for resistance bypass.",
				"On a hit, target loses 1 mana point (if any).",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
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
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "buff", "shadow", "control", "melee"],
		theme_tags: ["hunter-bureau", "guild-ops"],
	},
	{
		id: "item_p3_25",
		name: "Concentrated Stamina Stim",
		description: "A Hunter-grade injector. Burns hot and fast. Trust the cap.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0377.webp",
		weight: 1,
		value: 268,
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
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "damage", "stealth", "consumable"],
		theme_tags: ["elite-tier", "rift-energy", "shadow-domain"],
	},
	{
		id: "item_p3_26",
		name: "Lesser Aetheric Antidote",
		description:
			"A small dose of curative liquid. One condition cleared per application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0126.webp",
		weight: 3,
		value: 108,
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
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: [
			"equipment",
			"offensive",
			"perception",
			"support",
			"void",
			"consumable",
		],
		theme_tags: ["regent-era", "ancient-power", "survival"],
	},
	{
		id: "item_p3_27",
		name: "Titanium Spaulders",
		description:
			"A heavy plate-and-scale shell built for sustained engagements with armored anomalies.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0639.webp",
		weight: 3,
		value: 90,
		item_type: "armor",
		armor_class: "15",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"+5 ft. to your speed while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Showed up in pawn shops across three districts before the Bureau issued a recall.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "offensive", "stealth", "radiant", "buff", "armor"],
		theme_tags: ["dimensional-bleed", "forbidden", "guild-ops"],
	},
	{
		id: "item_p3_28",
		name: "Obsidian Whip",
		description:
			"A control-class weapon for Hunters who prefer winning fights without finishing them.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0364.webp",
		weight: 7,
		value: 46,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "necrotic",
		simple_properties: ["finesse", "reach"],
		requires_attunement: true,
		properties: {
			weapon: {
				damage: "1d4",
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
				"Reach: melee attacks have 10 ft. range.",
				"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
				"+1 AC against the first attack made against you each round.",
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
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "lightning", "radiant", "area", "melee"],
		theme_tags: ["system-glitch", "shadow-domain"],
	},
	{
		id: "item_p3_29",
		name: "Gate-Forged Shin Guards",
		description:
			"A light, flexible armor weave. Standard kit for stealth-focused Hunters.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0205.webp",
		weight: 7,
		value: 67,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Surfaced in the Hunter Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Logged in a Hunter's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "sustained", "support", "single-target", "armor"],
		theme_tags: ["guild-ops", "forbidden"],
	},
	{
		id: "item_p3_30",
		name: "Gate-Forged Breastplate",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0383.webp",
		weight: 8,
		value: 166,
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
				"Stayed in service longer than expected, primarily because nothing newer was available.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Comfort is a luxury. Coming back is the requirement.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "sustained", "defensive", "area", "necrotic", "armor"],
		theme_tags: ["dungeon-core", "survival"],
	},
	{
		id: "item_p3_31",
		name: "Lesser Health Potion",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0902.webp",
		weight: 6,
		value: 273,
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
				"Pulled from the gear locker of a mid-rank Hunter declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Found by a B-rank Hunter on a bounty assignment in a half-cleared gate annex.",
		tags: [
			"equipment",
			"damage",
			"shadow",
			"perception",
			"sustained",
			"consumable",
		],
		theme_tags: ["dimensional-bleed", "dungeon-core"],
	},
	{
		id: "item_p3_32",
		name: "Shadow Combat Vest",
		description:
			"A flexible mana-weave layer that beads ichor and shrugs off minor concussive impacts.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0097.webp",
		weight: 4,
		value: 465,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
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
				"Provides AC 12 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"On a critical hit, deal an additional 2d6 damage of this weapon's damage type.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "buff", "support", "armor"],
		theme_tags: ["shadow-domain", "hunter-bureau"],
	},
	{
		id: "item_p3_33",
		name: "Ceramic Exo-Suit",
		description:
			"A close-fitting armor jacket cut from mana-treated synthetic fiber.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0112.webp",
		weight: 8,
		value: 413,
		item_type: "armor",
		armor_class: "13 + Dex modifier",
		armor_type: "Light",
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
				"Provides AC 13 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"On a kill, your next attack within 1 minute deals an extra 2d6 damage.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "sustained", "single-target", "armor"],
		theme_tags: ["system-glitch", "experimental", "black-market"],
	},
	{
		id: "item_p3_34",
		name: "Aetheric Sniper Rifle",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0411.webp",
		weight: 3,
		value: 202,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "2d6",
		damage_type: "force",
		simple_properties: ["ammunition", "two-handed", "heavy"],
		range: "Ranged (80/240)",
		properties: {
			weapon: {
				damage: "2d6",
				damage_type: "force",
				range: 80,
			},
		},
		effects: {
			passive: [
				"Marksman variant. Crit on 19-20.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "damage", "shadow", "offensive", "necrotic", "firearm"],
		theme_tags: ["experimental", "dimensional-bleed", "hunter-bureau"],
	},
	{
		id: "item_p3_35",
		name: "Mana-Infused Sniper Rifle",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0306.webp",
		weight: 2,
		value: 145,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d10",
		damage_type: "force",
		simple_properties: ["ammunition", "two-handed"],
		range: "Ranged (80/240)",
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "force",
				range: 80,
			},
		},
		effects: {
			passive: [
				"Long-arm. Disadvantage on attacks within 5 ft.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Crit on 19-20 against gate-spawned creatures.",
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
		flavor: "Don't trust a weapon you can't put down.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "perception", "fire", "firearm"],
		theme_tags: ["post-awakening", "forbidden", "hunter-bureau"],
	},
	{
		id: "item_p3_36",
		name: "Vanguard Tactical Helmet",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0685.webp",
		weight: 7,
		value: 506,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
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
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "fire", "sustained", "armor"],
		theme_tags: ["elite-tier", "mana-overflow", "ancient-power"],
	},
	{
		id: "item_p3_37",
		name: "Aether-Plated Breastplate",
		description:
			"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0828.webp",
		weight: 3,
		value: 385,
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
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
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Comfort is a luxury. Coming back is the requirement.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "radiant", "debuff", "armor"],
		theme_tags: ["gate-zone", "dimensional-bleed"],
	},
	{
		id: "item_p3_38",
		name: "Ceramic Bracers",
		description:
			"A Bureau-issued forearm guard for Hunters operating melee-forward.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0871.webp",
		weight: 6,
		value: 95,
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
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Recovered from a sealed Guild Vault after a Bureau audit ordered the doors opened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Boring kit. Boring kit comes home.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "necrotic", "void", "fire", "stealth", "gear"],
		theme_tags: ["classified", "shadow-domain", "mana-overflow"],
	},
	{
		id: "item_p3_39",
		name: "Obsidian Revolver",
		description:
			"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0358.webp",
		weight: 4,
		value: 17,
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
				"While in dim light or darkness, attacks with this weapon have advantage.",
				"+1 to one save of your choice while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Tested through a Guild's three-tier review and approved for sustained use.",
			origin:
				"Bought at auction by a private guild and re-issued to a Hunter strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "damage", "fire", "debuff", "necrotic", "firearm"],
		theme_tags: ["dungeon-core", "dimensional-bleed", "regent-era"],
	},
	{
		id: "item_p3_40",
		name: "High-Grade Health Potion",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0094.webp",
		weight: 7,
		value: 247,
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
				"Stayed in service longer than expected, primarily because nothing newer was available.",
			origin:
				"Issued to a B-rank Hunter on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's not pretty going down. It's prettier than the alternative.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "offensive", "defensive", "ice", "consumable"],
		theme_tags: ["hunter-bureau", "survival", "rift-energy"],
	},
	{
		id: "item_p3_41",
		name: "High-Grade Mana Elixir",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0607.webp",
		weight: 4,
		value: 134,
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
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Hand-built in a clandestine Daejeon workshop and sold through the gray market.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "control", "perception", "damage", "consumable"],
		theme_tags: ["experimental", "guild-ops", "shadow-domain"],
	},
	{
		id: "item_p3_42",
		name: "Crimson Gauntlets",
		description:
			"Field-issued combat gauntlets for Striker-class Hunters and tactical brawlers.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0592.webp",
		weight: 1,
		value: 418,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d6",
		damage_type: "slashing",
		simple_properties: ["light", "striker"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "slashing",
			},
		},
		effects: {
			passive: [
				"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
				"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
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
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It will only ever be as deadly as the hand that holds it.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "buff", "stealth", "melee"],
		theme_tags: ["classified", "urban-combat", "post-awakening"],
	},
	{
		id: "item_p3_43",
		name: "Concentrated Liquid Shadow",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0321.webp",
		weight: 3,
		value: 220,
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
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "mobility", "single-target", "void", "consumable"],
		theme_tags: ["regent-era", "gate-zone"],
	},
	{
		id: "item_p3_44",
		name: "Concentrated Stamina Stim",
		description: "A Bureau-stamped emergency injector. Last-resort kit.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0546.webp",
		weight: 2,
		value: 206,
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
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Read the label. Then drink anyway.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "single-target", "debuff", "consumable"],
		theme_tags: ["mana-overflow", "system-glitch"],
	},
	{
		id: "item_p3_45",
		name: "Nano-Weave Breastplate",
		description:
			"A heavy mana-stable carapace built around composite plating and ichor-treated joints.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0891.webp",
		weight: 1,
		value: 195,
		item_type: "armor",
		armor_class: "17",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		properties: {},
		effects: {
			passive: [
				"Provides AC 17. Stealth checks at disadvantage.",
				"Heavy carapace plating. AC 17. Stealth disadvantage.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "damage", "perception", "buff", "armor"],
		theme_tags: ["dungeon-core", "survival"],
	},
	{
		id: "item_p3_46",
		name: "Void Katana",
		description: "A saber cut for fluid offense and parry-driven defense.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0020.webp",
		weight: 5,
		value: 398,
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
					name: "Disengaging Strike",
					description:
						"As an action, make a weapon attack and immediately move up to your speed without provoking opportunity attacks.",
					action: "action",
					frequency: "short-rest",
				},
			],
			passive: [
				"When wielded two-handed, +1 to damage rolls.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"Once per short rest, cast Misty Step (no spell slot required) while wielding this item.",
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
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "lightning", "burst", "support", "melee"],
		theme_tags: ["hunter-bureau", "survival", "dungeon-core"],
	},
	{
		id: "item_p3_47",
		name: "Shattered Sniper Rifle",
		description:
			"A precision rifle with mana-stable optics. Effective against armored anomalies at extended range.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0909.webp",
		weight: 3,
		value: 190,
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
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Resurfaced after twenty years in deep storage during a Bureau cleanup of legacy lockers.",
			origin:
				"Surfaced in the Hunter Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Hunter's pack, mostly forgotten.",
		tags: ["equipment", "single-target", "offensive", "area", "firearm"],
		theme_tags: ["dungeon-core", "regent-era"],
	},
	{
		id: "item_p3_48",
		name: "Black-Market Beast Repellent",
		description:
			"A pocket-sized recovery potion. Standard kit for any Hunter on assignment.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0638.webp",
		weight: 3,
		value: 128,
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
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
			origin:
				"Logged into the Hunter Association's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "psychic", "support", "radiant", "consumable"],
		theme_tags: ["dimensional-bleed", "experimental", "classified"],
	},
	{
		id: "item_p3_49",
		name: "Guild-Issue Katana",
		description: "A saber cut for fluid offense and parry-driven defense.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0119.webp",
		weight: 4,
		value: 191,
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
			passive: ["+1 to one save of your choice while attuned."],
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
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "buff", "ice", "stealth", "melee"],
		theme_tags: ["rift-energy", "gate-zone", "guild-ops"],
	},
];
