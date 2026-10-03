import type { Item } from "./items";

export const items_part6: Item[] = [
	{
		id: "item_p6_1",
		name: "Guild-Issue Spear",
		source_book: "Rift Ascendant Canon",
		description:
			"A two-handed reach weapon — good against fast, low-ground anomalies. Issued under the Guild-Issue Spear designation.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0097.webp",
		weight: 6,
		value: { currency: "gate", amount: 222 },
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "slashing",
		simple_properties: ["heavy", "reach", "two-handed"],
		requires_attunement: true,
		properties: {
			weapon: { damage: "1d8", damage_type: "slashing" },
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
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default. The Guild-Issue Spear's service record notes as much.",
			origin:
				"Bought at auction by a private guild and re-issued to an Ascendant strike team. Bureau provenance files log it as the Guild-Issue Spear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Guild-Issue Spear: built to hit. Built to keep working.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'. The recovery slip named it the Guild-Issue Spear.",
		tags: ["equipment", "radiant", "shadow", "debuff", "melee"],
		theme_tags: ["regent-era", "dungeon-core", "urban-combat"],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "short-rest",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "short-rest",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: ["STR"],
				armor_class: [],
				attack: ["STR"],
				notes:
					"Weapon formulas use RA ability modifiers plus proficiency when proficient.",
				save_dc: [],
			},
			action_economy: {
				type: "action",
				consumes_item: false,
				cost: "1 action",
				frequency: "short-rest",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Lattice Pulse",
					description:
						"As an action, emit a 15-ft. cone pulse. Each creature in the cone makes a DC 13 Vitality save, taking 3d6 force damage on a fail (half on success).",
					action: "action",
					dc: 13,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "91a8945d",
				payload_complete: true,
				uniqueness_seed: "item_p6_1::Guild-Issue Spear",
				variant_note:
					"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus + 1",
				damage_roll: "1d8 + STR modifier + 1",
				recharge: "short-rest",
				save_dc: "DC 13",
			},
			identity: {
				rarity: "rare",
				archetype: "melee_polearm",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Guild-Issue Spear keys standard melee polearm rules through signature d66e5553.",
				role: "offense",
				signature: "d66e5553",
				theme: "standard",
			},
			passive_rules: [
				"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
				"While attuned, gain +1 to one ability score (max 20).",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "slashing",
				active_options: [
					{
						name: "Lattice Pulse",
						description:
							"As an action, emit a 15-ft. cone pulse. Each creature in the cone makes a DC 13 Vitality save, taking 3d6 force damage on a fail (half on success).",
						dc: 13,
					},
				],
				attack_roll: true,
				damage_formula: "1d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
					"While attuned, gain +1 to one ability score (max 20).",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p6_4",
		name: "Starlight Spear",
		source_book: "Rift Ascendant Canon",
		description:
			"A two-handed reach weapon — good against fast, low-ground anomalies. The Starlight Spear, in Bureau parlance.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0828.webp",
		weight: 3,
		value: { currency: "gate", amount: 108 },
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "radiant",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: {
			weapon: { damage: "1d10", damage_type: "radiant" },
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a critical hit, target is Blinded until the end of its next turn.",
				"Once per short rest, reroll a missed attack roll.",
			],
		},
		source: "Rift Ascendant Canon",
		tags: ["equipment", "mobility", "area", "fire", "melee"],
		theme_tags: ["dimensional-bleed", "ancient-power", "dungeon-core"],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "at-will",
			trigger: "User makes an Attack action with the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: false,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "as listed",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: ["STR"],
				armor_class: [],
				attack: ["STR"],
				notes:
					"Weapon formulas use RA ability modifiers plus proficiency when proficient.",
				save_dc: [],
			},
			action_economy: {
				type: "action",
				consumes_item: false,
				cost: "1 action",
				frequency: "at-will",
				trigger: "User makes an Attack action with the item.",
			},
			active_rules: [],
			audit: {
				fingerprint: "df294a88",
				payload_complete: true,
				uniqueness_seed: "item_p6_4::Starlight Spear",
				variant_note: "Reach: melee attacks have 10 ft. range.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d10 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_polearm",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Starlight Spear keys starlight melee polearm rules through signature 1b47c9a5.",
				role: "offense",
				signature: "1b47c9a5",
				theme: "starlight",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"On a critical hit, target is Blinded until the end of its next turn.",
				"Once per short rest, reroll a missed attack roll.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "radiant",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Reach: melee attacks have 10 ft. range.",
					"On a critical hit, target is Blinded until the end of its next turn.",
					"Once per short rest, reroll a missed attack roll.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p6_5",
		name: "Aegis Exo-Suit",
		aliases: ["item_p2_15"],
		source_book: "Rift Ascendant Canon",
		description:
			"A composite shield with mana-stable plating. Issued under the Aegis Exo-Suit designation.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0685.webp",
		weight: 3,
		value: { currency: "gate", amount: 299 },
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
				"Saw heavy rotation among second-strike teams during the Harrow Bay Incident. That much survives in the Aegis Exo-Suit's field history.",
			origin:
				"Pulled from an unsanctioned weapons cache during a Guild Inspector raid. The Aegis Exo-Suit entered service from there.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Aegis Exo-Suit: not glamorous. Still alive.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'. Logged on arrival as the Aegis Exo-Suit.",
		tags: ["equipment", "lightning", "buff", "shadow", "mobility", "armor"],
		theme_tags: ["mana-overflow", "guild-ops", "gate-zone"],
		activation: {
			type: "bonus-action",
			consumes_item: false,
			cost: "1 bonus action",
			frequency: "short-rest",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "short-rest",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: [],
				armor_class: [],
				requirements: [],
				attack: [],
				notes:
					"Armor formulas use RA AGI modifiers when the armor category permits an agility bonus.",
				save_dc: [],
			},
			action_economy: {
				type: "bonus-action",
				consumes_item: false,
				cost: "1 bonus action",
				frequency: "short-rest",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Phase Step",
					description:
						"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
					action: "bonus-action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "5af20a3b",
				payload_complete: true,
				uniqueness_seed: "item_p6_5::Aegis Exo-Suit",
				variant_note:
					"Buckler. +2 AC. Counts as a free hand for casting somatic components.",
			},
			formulas: {
				armor_class: "+2",
				recharge: "continuous",
				shield_bonus: "+2 AC",
				speed_penalty: null,
			},
			identity: {
				rarity: "rare",
				archetype: "armor_shield",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aegis Exo-Suit keys standard armor shield rules through signature dce58d74.",
				role: "defense",
				signature: "dce58d74",
				theme: "standard",
			},
			passive_rules: [
				"Provides +3 AC while wielded.",
				"Buckler. +2 AC. Counts as a free hand for casting somatic components.",
				"+2 to attack rolls against creatures with more HP than you.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "+2",
				armor_type: "Shield",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides +3 AC while wielded.",
					"Buckler. +2 AC. Counts as a free hand for casting somatic components.",
					"+2 to attack rolls against creatures with more HP than you.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p6_7",
		name: "Lattice-Scale Exo-Suit",
		aliases: ["item_p2_26", "item_p4_7", "item_p5_37", "item_p8_33"],
		source_book: "Rift Ascendant Canon",
		description:
			"A modern Bureau armor jacket built for fast extraction and door-to-door work. On the requisition manifest it reads simply: Lattice-Scale Exo-Suit.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0683.webp",
		weight: 8,
		value: { currency: "gate", amount: 478 },
		item_type: "armor",
		armor_class: "12 + AGI modifier",
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
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion. The Lattice-Scale Exo-Suit carried the story forward.",
			origin:
				"Logged into the Ascendant Bureau's master inventory the day it was first sold. The Lattice-Scale Exo-Suit entered service from there.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Built by Bureau artificers who've patched real wounds. That's the Lattice-Scale Exo-Suit.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared Rift annex. Intake tagged it the Lattice-Scale Exo-Suit.",
		tags: ["equipment", "radiant", "control", "defensive", "armor"],
		theme_tags: ["elite-tier", "classified"],
		activation: {
			type: "bonus-action",
			consumes_item: false,
			cost: "1 bonus action",
			frequency: "short-rest",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "short-rest",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: [],
				armor_class: ["AGI"],
				requirements: [],
				attack: [],
				notes:
					"Armor formulas use RA AGI modifiers when the armor category permits an agility bonus.",
				save_dc: [],
			},
			action_economy: {
				type: "bonus-action",
				consumes_item: false,
				cost: "1 bonus action",
				frequency: "short-rest",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Phase Step",
					description:
						"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
					action: "bonus-action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "eae26523",
				payload_complete: true,
				uniqueness_seed: "item_p6_7::Lattice-Scale Exo-Suit",
				variant_note:
					"Light, flexible armor weave. Standard kit for fast movers.",
			},
			formulas: {
				armor_class: "12 + AGI modifier",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "rare",
				archetype: "armor_light",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Lattice-Scale Exo-Suit keys aetheric armor light rules through signature 42f2c6fb.",
				role: "defense",
				signature: "42f2c6fb",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Resistance to force damage.",
				"Once per long rest, cast a 2nd-level spell (player choice) without expending a spell slot.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "12 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 12 + AGI modifier.",
					"Light, flexible armor weave. Standard kit for fast movers.",
					"Resistance to force damage.",
					"Once per long rest, cast a 2nd-level spell (player choice) without expending a spell slot.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p6_12",
		name: "Vanguard Tactical Helmet",
		aliases: ["item_p3_36", "item_p6_34"],
		source_book: "Rift Ascendant Canon",
		description:
			"A combat helm with optional Bureau communication insert. Stamped and logged as the Vanguard Tactical Helmet.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0039.webp",
		weight: 8,
		value: { currency: "gate", amount: 460 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
		tags: ["equipment", "defensive", "void", "debuff", "armor"],
		theme_tags: ["ancient-power", "black-market", "gate-zone"],
		activation: {
			type: "passive",
			consumes_item: false,
			cost: "no action",
			frequency: "continuous",
			trigger: "Equipped, carried, worn, or used as described.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: false,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "as listed",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: [],
				armor_class: ["AGI"],
				requirements: [],
				attack: [],
				notes:
					"Armor formulas use RA AGI modifiers when the armor category permits an agility bonus.",
				save_dc: [],
			},
			action_economy: {
				type: "passive",
				consumes_item: false,
				cost: "no action",
				frequency: "continuous",
				trigger: "Equipped, carried, worn, or used as described.",
			},
			active_rules: [],
			audit: {
				fingerprint: "43bb16a8",
				payload_complete: true,
				uniqueness_seed: "item_p6_12::Vanguard Tactical Helmet",
				variant_note:
					"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
			},
			formulas: {
				armor_class: "11 + AGI modifier",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_headgear",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Vanguard Tactical Helmet keys standard armor headgear rules through signature 93e21e39.",
				role: "defense",
				signature: "93e21e39",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"+1 to initiative rolls while attuned.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "11 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 11 + AGI modifier.",
					"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
					"+1 to initiative rolls while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p6_13",
		name: "Lattice-Scale Breastplate",
		aliases: ["item_p4_14", "item_p4_37"],
		source_book: "Rift Ascendant Canon",
		description:
			"Heavy carapace plating; favored by S-rank tanks and Holy Knights. Field teams know this pattern as the Lattice-Scale Breastplate.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0550.webp",
		weight: 7,
		value: { currency: "gate", amount: 111 },
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
				"Quietly stockpiled by the Ascendant Bureau after an A-rank cascade exposed gaps in standard kit. The Lattice-Scale Breastplate carried the story forward.",
			origin:
				"Surfaced in the Ascendant Bureau's quartermaster log after a mid-tier extraction. The Lattice-Scale Breastplate entered service from there.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"It's been hit so you don't have to be. They call it the Lattice-Scale Breastplate for a reason.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip. Logged on arrival as the Lattice-Scale Breastplate.",
		tags: ["equipment", "utility", "buff", "armor"],
		theme_tags: ["ascendant-bureau", "modern-warfare", "mana-overflow"],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "short-rest",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "short-rest",
			restrictions: ["Requires STR 13 to avoid armor penalties."],
		},
		mechanics: {
			ability_modifiers: {
				damage: [],
				armor_class: [],
				requirements: ["STR"],
				attack: [],
				notes:
					"Armor formulas use RA AGI modifiers when the armor category permits an agility bonus.",
				save_dc: [],
			},
			action_economy: {
				type: "action",
				consumes_item: false,
				cost: "1 action",
				frequency: "short-rest",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Suppressive Volley",
					description:
						"As an action, force all creatures within a 15-ft. cone to make a DC 13 Agility save or take 2d6 damage of this weapon's type.",
					action: "action",
					dc: 13,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "3df96dbc",
				payload_complete: true,
				uniqueness_seed: "item_p6_13::Lattice-Scale Breastplate",
				variant_note: "Standard heavy plate. Stealth disadvantage.",
			},
			formulas: {
				armor_class: "16",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: "Requires STR 13",
			},
			identity: {
				rarity: "rare",
				archetype: "armor_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Lattice-Scale Breastplate keys aetheric armor heavy rules through signature 0098ff88.",
				role: "defense",
				signature: "0098ff88",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Resistance to force damage.",
				"Crit on 19-20 against creatures with damage vulnerability to this weapon's damage type.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "16",
				armor_type: "Heavy",
				stealth_disadvantage: true,
				strength_requirement: 13,
				equipped_effects: [
					"Provides AC 16. Stealth checks at disadvantage.",
					"Standard heavy plate. Stealth disadvantage.",
					"Resistance to force damage.",
					"Crit on 19-20 against creatures with damage vulnerability to this weapon's damage type.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p6_22",
		name: "Void Spear",
		aliases: ["item_p7_38"],
		source_book: "Rift Ascendant Canon",
		description:
			"A halberd-class polearm cut for sweeping arcs and thrust finishes. The Void Spear, in Bureau parlance.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0774.webp",
		weight: 3,
		value: { currency: "gate", amount: 258 },
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "necrotic",
		simple_properties: ["heavy", "reach", "two-handed"],
		requires_attunement: true,
		properties: {
			weapon: { damage: "1d10", damage_type: "necrotic" },
		},
		effects: {
			active: [
				{
					name: "Spell Surge",
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
				"Figured in a debriefing hearing after a clear went sideways in an unstable Rift. The Void Spear carried the story forward.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear. The Void Spear entered service from there.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"It's killed before. It will again. They call it the Void Spear for a reason.",
		discovery_lore:
			"Logged in an Ascendant's after-action report as 'recovered with the rest of the load.'. Logged on arrival as the Void Spear.",
		tags: ["equipment", "single-target", "healing", "melee"],
		theme_tags: ["regent-era", "urban-combat", "shadow-domain"],
		activation: {
			type: "bonus-action",
			consumes_item: false,
			cost: "1 bonus action",
			frequency: "long-rest",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "long-rest",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: ["STR"],
				armor_class: [],
				attack: ["STR"],
				notes:
					"Weapon formulas use RA ability modifiers plus proficiency when proficient.",
				save_dc: [],
			},
			action_economy: {
				type: "bonus-action",
				consumes_item: false,
				cost: "1 bonus action",
				frequency: "long-rest",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Spell Surge",
					description:
						"As a bonus action, regain 1 spell slot of 2nd level or lower.",
					action: "bonus-action",
					dc: null,
					frequency: "long-rest",
				},
			],
			audit: {
				fingerprint: "a219ced4",
				payload_complete: true,
				uniqueness_seed: "item_p6_22::Void Spear",
				variant_note: "Reach: melee attacks have 10 ft. range.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus + 1",
				damage_roll: "1d10 + STR modifier + 1",
				recharge: "long-rest",
				save_dc: null,
			},
			identity: {
				rarity: "rare",
				archetype: "melee_polearm",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Void Spear keys void melee polearm rules through signature e0b35cb9.",
				role: "offense",
				signature: "e0b35cb9",
				theme: "void",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"+1d4 damage against creatures of the Anomaly tag.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [
					{
						name: "Spell Surge",
						description:
							"As a bonus action, regain 1 spell slot of 2nd level or lower.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Reach: melee attacks have 10 ft. range.",
					"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
					"+1d4 damage against creatures of the Anomaly tag.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p6_23",
		name: "Shattered Sniper Rifle",
		aliases: ["item_p3_47", "item_p6_11"],
		source_book: "Rift Ascendant Canon",
		description:
			"A precision rifle with mana-stable optics. Effective against armored anomalies at extended range. Stamped and logged as the Shattered Sniper Rifle.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0263.webp",
		weight: 4,
		value: { currency: "gate", amount: 398 },
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d10",
		damage_type: "piercing",
		simple_properties: ["ammunition", "two-handed"],
		range: "Ranged (80/240)",
		requires_attunement: true,
		properties: {
			weapon: { damage: "1d10", damage_type: "piercing", range: 80 },
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
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion. The Shattered Sniper Rifle's service record notes as much.",
			origin:
				"Issued from the Bureau's mid-tier Ascendant requisition channel after standard certification. Archived under the Shattered Sniper Rifle designation.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"The Shattered Sniper Rifle: heavy in the hand. Heavier in consequence.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it. The recovery slip named it the Shattered Sniper Rifle.",
		tags: ["equipment", "fire", "lightning", "stealth", "control", "firearm"],
		theme_tags: ["system-glitch", "experimental"],
		activation: {
			type: "bonus-action",
			consumes_item: false,
			cost: "1 bonus action",
			frequency: "short-rest",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "short-rest",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: ["AGI"],
				armor_class: [],
				attack: ["AGI"],
				notes:
					"Weapon formulas use RA ability modifiers plus proficiency when proficient.",
				save_dc: [],
			},
			action_economy: {
				type: "bonus-action",
				consumes_item: false,
				cost: "1 bonus action",
				frequency: "short-rest",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Phase Step",
					description:
						"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
					action: "bonus-action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "df0faf35",
				payload_complete: true,
				uniqueness_seed: "item_p6_23::Shattered Sniper Rifle",
				variant_note: "Long-arm. Disadvantage on attacks within 5 ft.",
			},
			formulas: {
				attack_roll: "d20 + AGI modifier + proficiency bonus + 1",
				damage_roll: "1d10 + AGI modifier + 1",
				recharge: "short-rest",
				save_dc: null,
			},
			identity: {
				rarity: "rare",
				archetype: "firearm_rifle",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Shattered Sniper Rifle keys standard firearm rifle rules through signature fc37614e.",
				role: "offense",
				signature: "fc37614e",
				theme: "standard",
			},
			passive_rules: [
				"Long-arm. Disadvantage on attacks within 5 ft.",
				"Critical hits with this item ignore resistance to its damage type.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "piercing",
				active_options: [
					{
						name: "Phase Step",
						description:
							"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "1d10 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Long-arm. Disadvantage on attacks within 5 ft.",
					"Critical hits with this item ignore resistance to its damage type.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Ranged (80/240)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p6_24",
		name: "Abyssal Warhammer",
		aliases: ["item_p3_9"],
		source_book: "Rift Ascendant Canon",
		description:
			"A two-handed warhammer built to crater armored targets. Field teams know this pattern as the Abyssal Warhammer.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0708.webp",
		weight: 7,
		value: { currency: "gate", amount: 470 },
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d12",
		damage_type: "necrotic",
		simple_properties: ["heavy", "two-handed"],
		properties: {
			weapon: { damage: "1d12", damage_type: "necrotic" },
		},
		effects: {
			passive: [
				"Crit on 19-20. Critical hits push target 5 ft.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		tags: ["equipment", "buff", "utility", "defensive", "support", "melee"],
		theme_tags: ["regent-era", "survival", "black-market"],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "at-will",
			trigger: "User makes an Attack action with the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: false,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "as listed",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: ["STR"],
				armor_class: [],
				attack: ["STR"],
				notes:
					"Weapon formulas use RA ability modifiers plus proficiency when proficient.",
				save_dc: [],
			},
			action_economy: {
				type: "action",
				consumes_item: false,
				cost: "1 action",
				frequency: "at-will",
				trigger: "User makes an Attack action with the item.",
			},
			active_rules: [],
			audit: {
				fingerprint: "48e8b72c",
				payload_complete: true,
				uniqueness_seed: "item_p6_24::Abyssal Warhammer",
				variant_note: "Crit on 19-20. Critical hits push target 5 ft.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d12 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_bludgeon_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Abyssal Warhammer keys void melee bludgeon heavy rules through signature 57cbc8d5.",
				role: "offense",
				signature: "57cbc8d5",
				theme: "void",
			},
			passive_rules: [
				"Crit on 19-20. Critical hits push target 5 ft.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"+1 to initiative rolls while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d12 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Crit on 19-20. Critical hits push target 5 ft.",
					"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
					"+1 to initiative rolls while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p6_26",
		name: "Black-Market Liquid Shadow",
		aliases: ["item_p6_20"],
		source_book: "Rift Ascendant Canon",
		description:
			"A regulated emergency draught. Quick draw, reliable effect. Field teams know this pattern as the Black-Market Liquid Shadow.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0202.webp",
		weight: 8,
		value: { currency: "crystal", amount: 3950 },
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
		tags: ["equipment", "void", "sustained", "offensive", "area", "consumable"],
		theme_tags: ["dimensional-bleed", "survival", "black-market"],
		activation: {
			type: "action",
			consumes_item: true,
			cost: "1 action",
			frequency: "at-will",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: false,
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "at-will",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: [],
				armor_class: [],
				attack: [],
				notes:
					"Utility and consumable items only call for an ability when their explicit rule names one.",
				save_dc: [],
			},
			action_economy: {
				type: "action",
				consumes_item: true,
				cost: "1 action",
				frequency: "at-will",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Drink",
					description:
						"Action. Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "1f477284",
				payload_complete: true,
				uniqueness_seed: "item_p6_26::Black-Market Liquid Shadow",
				variant_note:
					"Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
			},
			formulas: { effect_formula: "1d4", recharge: "at-will", save_dc: null },
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Black-Market Liquid Shadow keys shadow consumable potion rules through signature 3687524b.",
				role: "consumable",
				signature: "3687524b",
				theme: "shadow",
			},
			passive_rules: [
				"Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: "1d4",
				save: null,
				use_rule:
					"Action. Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "self",
				area: null,
				line_of_effect: "as item description permits",
				target: "Self, touched object, or listed utility target",
			},
		},
	},
	{
		id: "item_p6_28",
		name: "Lattice-Scale Tactical Helmet",
		aliases: ["item_p9_45"],
		source_book: "Rift Ascendant Canon",
		description:
			"A combat helm with optional Bureau communication insert. Bureau quartermasters catalog it as the Lattice-Scale Tactical Helmet.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0536.webp",
		weight: 4,
		value: { currency: "gate", amount: 116 },
		item_type: "armor",
		armor_class: "12 + AGI modifier",
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
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial. The Lattice-Scale Tactical Helmet carried the story forward.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed. The Lattice-Scale Tactical Helmet entered service from there.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"You don't notice it until you do. Then it's already saved you. — the Lattice-Scale Tactical Helmet.",
		discovery_lore:
			"Tagged at the Rift seal during the Bureau's standard cataloging sweep. Logged on arrival as the Lattice-Scale Tactical Helmet.",
		tags: ["equipment", "perception", "radiant", "void", "armor"],
		theme_tags: ["post-awakening", "system-glitch"],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "short-rest",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "short-rest",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: [],
				armor_class: ["AGI"],
				requirements: [],
				attack: [],
				notes:
					"Armor formulas use RA AGI modifiers when the armor category permits an agility bonus.",
				save_dc: [],
			},
			action_economy: {
				type: "action",
				consumes_item: false,
				cost: "1 action",
				frequency: "short-rest",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Disengaging Strike",
					description:
						"As an action, make a weapon attack and immediately move up to your speed without provoking opportunity attacks.",
					action: "action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "edb8170d",
				payload_complete: true,
				uniqueness_seed: "item_p6_28::Lattice-Scale Tactical Helmet",
				variant_note:
					"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
			},
			formulas: {
				armor_class: "12 + AGI modifier",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "rare",
				archetype: "armor_headgear",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Lattice-Scale Tactical Helmet keys aetheric armor headgear rules through signature f69e27e7.",
				role: "defense",
				signature: "f69e27e7",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
				"+1 to spell-save DCs while worn.",
				"+1d4 damage against creatures of the Anomaly tag.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "12 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 12 + AGI modifier.",
					"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
					"+1 to spell-save DCs while worn.",
					"+1d4 damage against creatures of the Anomaly tag.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p6_32",
		name: "Lesser Liquid Shadow",
		aliases: ["item_p5_42", "item_p6_10", "item_p8_16"],
		source_book: "Rift Ascendant Canon",
		description:
			"A combat-grade healing compound packaged for sub-action consumption. Issued under the Lesser Liquid Shadow designation.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0973.webp",
		weight: 6,
		value: { currency: "crystal", amount: 1520 },
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
		tags: ["equipment", "mobility", "healing", "consumable"],
		theme_tags: ["post-awakening", "gate-zone", "forbidden"],
		activation: {
			type: "action",
			consumes_item: true,
			cost: "1 action",
			frequency: "at-will",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: false,
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "at-will",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: [],
				armor_class: [],
				attack: [],
				notes:
					"Utility and consumable items only call for an ability when their explicit rule names one.",
				save_dc: [],
			},
			action_economy: {
				type: "action",
				consumes_item: true,
				cost: "1 action",
				frequency: "at-will",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Drink",
					description:
						"Action. Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "1f477284",
				payload_complete: true,
				uniqueness_seed: "item_p6_32::Lesser Liquid Shadow",
				variant_note:
					"Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
			},
			formulas: { effect_formula: "1d4", recharge: "at-will", save_dc: null },
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Lesser Liquid Shadow keys shadow consumable potion rules through signature 7a0f01cc.",
				role: "consumable",
				signature: "7a0f01cc",
				theme: "shadow",
			},
			passive_rules: [
				"Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: "1d4",
				save: null,
				use_rule:
					"Action. Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "self",
				area: null,
				line_of_effect: "as item description permits",
				target: "Self, touched object, or listed utility target",
			},
		},
	},
	{
		id: "item_p6_37",
		name: "Guild-Issue Longsword",
		aliases: ["item_p8_46"],
		source_book: "Rift Ascendant Canon",
		description:
			"A versatile cutting blade with a tempered edge and Bureau service marks. Field teams know this pattern as the Guild-Issue Longsword.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0656.webp",
		weight: 7,
		value: { currency: "gate", amount: 355 },
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "slashing",
		simple_properties: ["versatile (1d12)", "two-handed-bonus"],
		properties: {
			weapon: { damage: "1d10", damage_type: "slashing", versatile: "1d12" },
		},
		effects: {
			passive: [
				"When wielded two-handed, +1 to damage rolls.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
		},
		source: "Rift Ascendant Canon",
		tags: [
			"equipment",
			"defensive",
			"single-target",
			"utility",
			"void",
			"melee",
		],
		theme_tags: ["ascendant-bureau", "guild-ops", "black-market"],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "at-will",
			trigger: "User makes an Attack action with the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: false,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "as listed",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: ["STR"],
				armor_class: [],
				attack: ["STR"],
				notes:
					"Weapon formulas use RA ability modifiers plus proficiency when proficient.",
				save_dc: [],
			},
			action_economy: {
				type: "action",
				consumes_item: false,
				cost: "1 action",
				frequency: "at-will",
				trigger: "User makes an Attack action with the item.",
			},
			active_rules: [],
			audit: {
				fingerprint: "2ee734a7",
				payload_complete: true,
				uniqueness_seed: "item_p6_37::Guild-Issue Longsword",
				variant_note: "When wielded two-handed, +1 to damage rolls.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d10 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_blade_versatile",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Guild-Issue Longsword keys standard melee blade versatile rules through signature 96cb2284.",
				role: "offense",
				signature: "96cb2284",
				theme: "standard",
			},
			passive_rules: [
				"When wielded two-handed, +1 to damage rolls.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "slashing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"When wielded two-handed, +1 to damage rolls.",
					"On a kill with this item, gain 1d4 temporary HP.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p6_39",
		name: "Greater Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A purifier vial labeled with the Bureau's medical-clearance stamp. Bureau quartermasters catalog it as the Greater Aetheric Antidote.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0106.webp",
		weight: 2,
		value: { currency: "crystal", amount: 530 },
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
		tags: ["equipment", "lightning", "fire", "defensive", "consumable"],
		theme_tags: ["rift-energy", "gate-zone"],
		activation: {
			type: "action",
			consumes_item: true,
			cost: "1 action",
			frequency: "at-will",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: false,
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "at-will",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: [],
				armor_class: [],
				attack: [],
				notes:
					"Utility and consumable items only call for an ability when their explicit rule names one.",
				save_dc: [],
			},
			action_economy: {
				type: "action",
				consumes_item: true,
				cost: "1 action",
				frequency: "at-will",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Apply",
					description:
						"Action. Cures one of: charmed, frightened, poisoned, weakened.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "b69f70db",
				payload_complete: true,
				uniqueness_seed: "item_p6_39::Greater Aetheric Antidote",
				variant_note: "Cures one of: charmed, frightened, poisoned, weakened.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_purifier",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Greater Aetheric Antidote keys aetheric consumable purifier rules through signature 66661ab9.",
				role: "consumable",
				signature: "66661ab9",
				theme: "aetheric",
			},
			passive_rules: ["Cures one of: charmed, frightened, poisoned, weakened."],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule:
					"Action. Cures one of: charmed, frightened, poisoned, weakened.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: true,
			},
			targeting: {
				range: "self",
				area: null,
				line_of_effect: "as item description permits",
				target: "Self, touched object, or listed utility target",
			},
		},
	},
	{
		id: "item_p6_42",
		name: "Aether-Plated Bracers",
		aliases: ["item_p7_44"],
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced bracer with mild armor weave on the inner face. Bureau quartermasters catalog it as the Aether-Plated Bracers.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/item-0132.webp",
		weight: 8,
		value: { currency: "gate", amount: 484 },
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
				"Was once misattributed in a post-clear report; the correction is still in the record. The Aether-Plated Bracers's service record notes as much.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event. Archived under the Aether-Plated Bracers designation.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Belongs in the bottom of every Ascendant's go-bag. — the Aether-Plated Bracers.",
		discovery_lore:
			"Pulled out of a B-rank Rift's last-room loot pile by a recovery team. The recovery slip named it the Aether-Plated Bracers.",
		tags: ["equipment", "shadow", "control", "psychic", "gear"],
		theme_tags: ["forbidden", "post-awakening", "guild-ops"],
		activation: {
			type: "bonus-action",
			consumes_item: false,
			cost: "1 bonus action",
			frequency: "short-rest",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "short-rest",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: [],
				armor_class: [],
				attack: [],
				notes:
					"Utility and consumable items only call for an ability when their explicit rule names one.",
				save_dc: [],
			},
			action_economy: {
				type: "bonus-action",
				consumes_item: false,
				cost: "1 bonus action",
				frequency: "short-rest",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Phase Step",
					description:
						"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
					action: "bonus-action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "52c723a1",
				payload_complete: true,
				uniqueness_seed: "item_p6_42::Aether-Plated Bracers",
				variant_note:
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
			},
			formulas: {
				effect_formula: "1d4",
				recharge: "short-rest",
				save_dc: null,
			},
			identity: {
				rarity: "rare",
				archetype: "gear_bracer",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aether-Plated Bracers keys aetheric gear bracer rules through signature a6ed4018.",
				role: "utility",
				signature: "a6ed4018",
				theme: "aetheric",
			},
			passive_rules: [
				"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				"Resistance to force damage.",
				"While attuned, you have advantage on saves against the Stunned condition.",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [
					{
						name: "Phase Step",
						description:
							"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
						dc: null,
					},
				],
				non_damage_resolution:
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				passive_effects: [
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
					"Resistance to force damage.",
					"While attuned, you have advantage on saves against the Stunned condition.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "self",
				area: null,
				line_of_effect: "as item description permits",
				target: "Self, touched object, or listed utility target",
			},
		},
	},
	{
		id: "item_p6_44",
		name: "Starlight Halberd",
		aliases: ["item_p6_18"],
		source_book: "Rift Ascendant Canon",
		description:
			"A reach weapon used by Bureau gate-line teams. The Starlight Halberd, in Bureau parlance.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0454.webp",
		weight: 2,
		value: { currency: "gate", amount: 117 },
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "radiant",
		simple_properties: ["heavy", "reach", "two-handed"],
		properties: {
			weapon: { damage: "1d10", damage_type: "radiant" },
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target sheds dim light in a 5-ft. radius until the start of your next turn.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
		},
		source: "Rift Ascendant Canon",
		tags: ["equipment", "lightning", "damage", "mobility", "melee"],
		theme_tags: ["dimensional-bleed", "regent-era", "elite-tier"],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "at-will",
			trigger: "User makes an Attack action with the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: false,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "as listed",
			restrictions: [],
		},
		mechanics: {
			ability_modifiers: {
				damage: ["STR"],
				armor_class: [],
				attack: ["STR"],
				notes:
					"Weapon formulas use RA ability modifiers plus proficiency when proficient.",
				save_dc: [],
			},
			action_economy: {
				type: "action",
				consumes_item: false,
				cost: "1 action",
				frequency: "at-will",
				trigger: "User makes an Attack action with the item.",
			},
			active_rules: [],
			audit: {
				fingerprint: "3128581a",
				payload_complete: true,
				uniqueness_seed: "item_p6_44::Starlight Halberd",
				variant_note: "Reach: melee attacks have 10 ft. range.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d10 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_polearm",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Starlight Halberd keys starlight melee polearm rules through signature 575853b6.",
				role: "offense",
				signature: "575853b6",
				theme: "starlight",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target sheds dim light in a 5-ft. radius until the start of your next turn.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "radiant",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Reach: melee attacks have 10 ft. range.",
					"On a hit, target sheds dim light in a 5-ft. radius until the start of your next turn.",
					"Crit on 19-20 against gate-spawned creatures.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve Rift, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
];
