import type { Item } from "./items";

export const items_part6: Item[] = [
	{
		id: "item_p6_0",
		name: "Void Katana",
		source_book: "Rift Ascendant Canon",
		description:
			"A mid-weight longsword with a Bureau-stamped pommel and reinforced grip.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0368.webp",
		weight: 1,
		value: { currency: "gate", amount: 222 },
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
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "debuff", "stealth", "fire", "melee"],
		theme_tags: ["regent-era", "forbidden"],
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
				fingerprint: "5a9114fe",
				payload_complete: true,
				uniqueness_seed: "item_p6_0::Void Katana",
				variant_note: "",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d8 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_blade_versatile",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Void Katana keys void melee blade versatile rules through signature 6068880e.",
				role: "offense",
				signature: "6068880e",
				theme: "void",
			},
			passive_rules: [
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
					"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_1",
		name: "Guild-Issue Spear",
		source_book: "Rift Ascendant Canon",
		description:
			"A two-handed reach weapon — good against fast, low-ground anomalies.",
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
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_2",
		name: "Unstable Mana Elixir",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0902.webp",
		weight: 8,
		value: { currency: "crystal", amount: 3610 },
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
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "burst", "support", "consumable"],
		theme_tags: ["regent-era", "forbidden", "urban-combat"],
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
					description: "Action. Restore 2d4 mana.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "aff50e98",
				payload_complete: true,
				uniqueness_seed: "item_p6_2::Unstable Mana Elixir",
				variant_note: "Restores mana on consumption.",
			},
			formulas: {
				effect_formula: "2d4",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Unstable Mana Elixir keys aetheric consumable potion rules through signature cb9847a3.",
				role: "consumable",
				signature: "cb9847a3",
				theme: "aetheric",
			},
			passive_rules: ["On drink, restore 2d4 mana."],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: "2d4",
				save: null,
				use_rule: "Action. Restore 2d4 mana.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_3",
		name: "Greater Health Potion",
		source_book: "Rift Ascendant Canon",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0383.webp",
		weight: 3,
		value: { currency: "crystal", amount: 1500 },
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
				"Earned a footnote in the Ascendant Bureau's quarterly equipment audit.",
			origin:
				"Issued from the Bureau's mid-tier Ascendant requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "utility", "debuff", "burst", "consumable"],
		theme_tags: ["regent-era", "ancient-power"],
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
						"Action. Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "8e0bdb0e",
				payload_complete: true,
				uniqueness_seed: "item_p6_3::Greater Health Potion",
				variant_note:
					"Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Greater Health Potion keys standard consumable potion rules through signature 04af0219.",
				role: "consumable",
				signature: "04af0219",
				theme: "standard",
			},
			passive_rules: [
				"Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
			],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule:
					"Action. Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_4",
		name: "Starlight Spear",
		source_book: "Rift Ascendant Canon",
		description:
			"A two-handed reach weapon — good against fast, low-ground anomalies.",
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
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		source_book: "Rift Ascendant Canon",
		description: "A composite shield with mana-stable plating.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_6",
		name: "Concentrated Mana Elixir",
		source_book: "Rift Ascendant Canon",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0322.webp",
		weight: 2,
		value: { currency: "crystal", amount: 4820 },
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
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: [
			"equipment",
			"defensive",
			"sustained",
			"radiant",
			"buff",
			"consumable",
		],
		theme_tags: ["modern-warfare", "ascendant-bureau", "elite-tier"],
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
					description: "Action. Restore 2d4 mana.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "aff50e98",
				payload_complete: true,
				uniqueness_seed: "item_p6_6::Concentrated Mana Elixir",
				variant_note:
					"Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
			},
			formulas: {
				effect_formula: "2d4",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Concentrated Mana Elixir keys aetheric consumable potion rules through signature 439896bb.",
				role: "consumable",
				signature: "439896bb",
				theme: "aetheric",
			},
			passive_rules: ["On drink, restore 2d4 mana."],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: "2d4",
				save: null,
				use_rule: "Action. Restore 2d4 mana.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_7",
		name: "Lattice-Scale Exo-Suit",
		source_book: "Rift Ascendant Canon",
		description:
			"A modern Bureau armor jacket built for fast extraction and door-to-door work.",
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
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Logged into the Ascendant Bureau's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_8",
		name: "Aetheric Dagger",
		source_book: "Rift Ascendant Canon",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0656.webp",
		weight: 8,
		value: { currency: "gate", amount: 43 },
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "force",
		simple_properties: ["light", "finesse", "thrown"],
		range: "Thrown (20/60)",
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
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Ascendants' survival.",
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
				damage: ["STR", "AGI"],
				armor_class: [],
				attack: ["STR", "AGI"],
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
					name: "Disengaging Strike",
					description:
						"As an action, make a weapon attack and immediately move up to your speed without provoking opportunity attacks.",
					action: "action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "879b9499",
				payload_complete: true,
				uniqueness_seed: "item_p6_8::Aetheric Dagger",
				variant_note:
					"Off-hand attack on a hit deals +1 damage if you are wielding two weapons.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus + 1",
				damage_roll: "1d4 + STR or AGI modifier + 1",
				recharge: "short-rest",
				save_dc: null,
			},
			identity: {
				rarity: "rare",
				archetype: "melee_blade_finesse",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aetheric Dagger keys aetheric melee blade finesse rules through signature 2fbc376b.",
				role: "offense",
				signature: "2fbc376b",
				theme: "aetheric",
			},
			passive_rules: [
				"Off-hand attack on a hit deals +1 damage if you are wielding two weapons.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1d4 damage against creatures of the Anomaly tag.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [
					{
						name: "Disengaging Strike",
						description:
							"As an action, make a weapon attack and immediately move up to your speed without provoking opportunity attacks.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "1d4 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Off-hand attack on a hit deals +1 damage if you are wielding two weapons.",
					"While attuned, gain +1 to spell-attack rolls.",
					"+1d4 damage against creatures of the Anomaly tag.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_9",
		name: "Titanium Breastplate",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced battle-plate composed of layered ichor-treated sections.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0641.webp",
		weight: 5,
		value: { currency: "gate", amount: 490 },
		item_type: "armor",
		armor_class: "16",
		armor_type: "Heavy",
		stealth_disadvantage: true,
		strength_requirement: 13,
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
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "utility", "defensive", "armor"],
		theme_tags: ["guild-ops", "urban-combat", "dimensional-bleed"],
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
				type: "passive",
				consumes_item: false,
				cost: "no action",
				frequency: "continuous",
				trigger: "Equipped, carried, worn, or used as described.",
			},
			active_rules: [],
			audit: {
				fingerprint: "02465b97",
				payload_complete: true,
				uniqueness_seed: "item_p6_9::Titanium Breastplate",
				variant_note: "Reinforced carapace. AC 16. Stealth disadvantage.",
			},
			formulas: {
				armor_class: "16",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: "Requires STR 13",
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Titanium Breastplate keys standard armor heavy rules through signature 398294f1.",
				role: "defense",
				signature: "398294f1",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Reinforced carapace. AC 16. Stealth disadvantage.",
				"+1 to attack rolls when at full HP.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "16",
				armor_type: "Heavy",
				stealth_disadvantage: true,
				strength_requirement: 13,
				equipped_effects: [
					"Provides AC 16. Stealth checks at disadvantage.",
					"Reinforced carapace. AC 16. Stealth disadvantage.",
					"+1 to attack rolls when at full HP.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_10",
		name: "Lesser Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description:
			"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0529.webp",
		weight: 7,
		value: { currency: "crystal", amount: 2150 },
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
				"Procured through the Ascendant Bureau's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "utility", "necrotic", "consumable"],
		theme_tags: ["dungeon-core", "rift-energy", "guild-ops"],
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
					description: "Action. Restores HP on consumption.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "1e58281c",
				payload_complete: true,
				uniqueness_seed: "item_p6_10::Lesser Liquid Shadow",
				variant_note: "Restores HP on consumption.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Lesser Liquid Shadow keys shadow consumable potion rules through signature bd964c90.",
				role: "consumable",
				signature: "bd964c90",
				theme: "shadow",
			},
			passive_rules: [
				"Restores HP on consumption.",
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule: "Action. Restores HP on consumption.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_11",
		name: "Shattered Sniper Rifle",
		source_book: "Rift Ascendant Canon",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0800.webp",
		weight: 6,
		value: { currency: "gate", amount: 187 },
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
		theme_tags: ["rift-energy", "shadow-domain", "ascendant-bureau"],
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
				damage: ["AGI"],
				armor_class: [],
				attack: ["AGI"],
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
				fingerprint: "e62adf6f",
				payload_complete: true,
				uniqueness_seed: "item_p6_11::Shattered Sniper Rifle",
				variant_note: "Bolt-action. One attack per turn; +1 to attack rolls.",
			},
			formulas: {
				attack_roll: "d20 + AGI modifier + proficiency bonus",
				damage_roll: "1d12 + AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "firearm_rifle",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Shattered Sniper Rifle keys standard firearm rifle rules through signature 1560ebeb.",
				role: "offense",
				signature: "1560ebeb",
				theme: "standard",
			},
			passive_rules: [
				"Bolt-action. One attack per turn; +1 to attack rolls.",
				"+1 to Investigation and Insight checks while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "piercing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d12 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Bolt-action. One attack per turn; +1 to attack rolls.",
					"+1 to Investigation and Insight checks while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Ranged (100/400)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p6_12",
		name: "Vanguard Tactical Helmet",
		source_book: "Rift Ascendant Canon",
		description: "A combat helm with optional Bureau communication insert.",
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
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Issued to a B-rank Ascendant on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Comfort is a luxury. Coming back is the requirement.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		source_book: "Rift Ascendant Canon",
		description:
			"Heavy carapace plating; favored by S-rank tanks and Holy Knights.",
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
				"Quietly stockpiled by the Ascendant Bureau after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Surfaced in the Ascendant Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_14",
		name: "Concentrated Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-graded antidote calibrated for the most common gate-acquired afflictions.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0341.webp",
		weight: 6,
		value: { currency: "crystal", amount: 4280 },
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
				uniqueness_seed: "item_p6_14::Concentrated Aetheric Antidote",
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
					"Concentrated Aetheric Antidote keys aetheric consumable purifier rules through signature 7c5642e6.",
				role: "consumable",
				signature: "7c5642e6",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_15",
		name: "Obsidian Dagger",
		source_book: "Rift Ascendant Canon",
		description:
			"A light blade balanced for finesse strikes. Common in close-quarters Ascendant loadouts.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0228.webp",
		weight: 5,
		value: { currency: "gate", amount: 154 },
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
				damage: ["STR", "AGI"],
				armor_class: [],
				attack: ["STR", "AGI"],
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
				fingerprint: "c0dfd1cc",
				payload_complete: true,
				uniqueness_seed: "item_p6_15::Obsidian Dagger",
				variant_note: "+1 to attack rolls when you have advantage.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus",
				damage_roll: "1d6 + STR or AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_blade_finesse",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Obsidian Dagger keys shadow melee blade finesse rules through signature 9ee2ab95.",
				role: "offense",
				signature: "9ee2ab95",
				theme: "shadow",
			},
			passive_rules: [
				"+1 to attack rolls when you have advantage.",
				"While in dim light or darkness, attacks with this weapon have advantage.",
				"+1 to initiative rolls while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"+1 to attack rolls when you have advantage.",
					"While in dim light or darkness, attacks with this weapon have advantage.",
					"+1 to initiative rolls while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_16",
		name: "Gate-Forged Bracers",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-issued forearm guard for Ascendants operating melee-forward.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0067.webp",
		weight: 2,
		value: { currency: "gate", amount: 202 },
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
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "as listed",
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
				type: "passive",
				consumes_item: false,
				cost: "no action",
				frequency: "continuous",
				trigger: "Equipped, carried, worn, or used as described.",
			},
			active_rules: [],
			audit: {
				fingerprint: "be6a4d84",
				payload_complete: true,
				uniqueness_seed: "item_p6_16::Gate-Forged Bracers",
				variant_note:
					"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "gear_bracer",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Gate-Forged Bracers keys standard gear bracer rules through signature 872db50a.",
				role: "utility",
				signature: "872db50a",
				theme: "standard",
			},
			passive_rules: [
				"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
				passive_effects: [
					"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
					"On a critical hit, regain 1 HP per Hit Die spent today.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_17",
		name: "Guild-Issue Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0994.webp",
		weight: 2,
		value: { currency: "gate", amount: 21 },
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
				damage: ["AGI"],
				armor_class: [],
				attack: ["AGI"],
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
				fingerprint: "dbad6886",
				payload_complete: true,
				uniqueness_seed: "item_p6_17::Guild-Issue Revolver",
				variant_note: "Magnum-frame. -1 to attack within 5 ft.",
			},
			formulas: {
				attack_roll: "d20 + AGI modifier + proficiency bonus",
				damage_roll: "1d10 + AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "firearm_pistol",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Guild-Issue Revolver keys standard firearm pistol rules through signature 92199d43.",
				role: "offense",
				signature: "92199d43",
				theme: "standard",
			},
			passive_rules: [
				"Magnum-frame. -1 to attack within 5 ft.",
				"+5 ft. to your speed while wielding this item.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "piercing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Magnum-frame. -1 to attack within 5 ft.",
					"+5 ft. to your speed while wielding this item.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Ranged (40/120)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p6_18",
		name: "Starlight Halberd",
		source_book: "Rift Ascendant Canon",
		description:
			"A two-handed reach weapon — good against fast, low-ground anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0241.webp",
		weight: 6,
		value: { currency: "gate", amount: 83 },
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
				"Procured through the Ascendant Bureau's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "sustained", "defensive", "shadow", "melee"],
		theme_tags: ["ascendant-bureau", "dimensional-bleed"],
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
				fingerprint: "6e91326a",
				payload_complete: true,
				uniqueness_seed: "item_p6_18::Starlight Halberd",
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
					"Starlight Halberd keys starlight melee polearm rules through signature 23993b33.",
				role: "offense",
				signature: "23993b33",
				theme: "starlight",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"On a critical hit, target is Blinded until the end of its next turn.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
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
					"Once per long rest, you may make one weapon attack as a bonus action.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_19",
		name: "Shattered Gauntlets",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced gauntlet that turns unarmed strikes into solid kinetic blows.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0512.webp",
		weight: 3,
		value: { currency: "gate", amount: 199 },
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
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: [
			"equipment",
			"mobility",
			"offensive",
			"necrotic",
			"radiant",
			"melee",
		],
		theme_tags: ["system-glitch", "regent-era"],
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
				fingerprint: "67264e2f",
				payload_complete: true,
				uniqueness_seed: "item_p6_19::Shattered Gauntlets",
				variant_note:
					"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d4 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_gauntlet",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Shattered Gauntlets keys standard melee gauntlet rules through signature f572f8e7.",
				role: "offense",
				signature: "f572f8e7",
				theme: "standard",
			},
			passive_rules: [
				"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
				"Once per short rest, treat a single failed Vitality save as a success.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d4 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
					"Once per short rest, treat a single failed Vitality save as a success.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_20",
		name: "Black-Market Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0248.webp",
		weight: 3,
		value: { currency: "crystal", amount: 1180 },
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
						"Action. Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "8d22e581",
				payload_complete: true,
				uniqueness_seed: "item_p6_20::Black-Market Liquid Shadow",
				variant_note:
					"Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Black-Market Liquid Shadow keys shadow consumable potion rules through signature 9c07ce19.",
				role: "consumable",
				signature: "9c07ce19",
				theme: "shadow",
			},
			passive_rules: [
				"Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule:
					"Action. Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_21",
		name: "Gate-Forged Combat Vest",
		source_book: "Rift Ascendant Canon",
		description:
			"A multi-layer combat coat woven from impact-resistant fabric.",
		rarity: "uncommon",
		type: "armor",
		image:
			"/generated/compendium/armor/armor-armor-gate-forged-combat-vest-1pacak.webp",
		weight: 4,
		value: { currency: "gate", amount: 279 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				fingerprint: "ca3f3635",
				payload_complete: true,
				uniqueness_seed: "item_p6_21::Gate-Forged Combat Vest",
				variant_note:
					"Light, flexible armor weave. Standard kit for fast movers.",
			},
			formulas: {
				armor_class: "11 + AGI modifier",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_light",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Gate-Forged Combat Vest keys standard armor light rules through signature 74cddb29.",
				role: "defense",
				signature: "74cddb29",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"On a hit against a target you have not attacked this turn, deal +1d4 damage.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "11 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 11 + AGI modifier.",
					"Light, flexible armor weave. Standard kit for fast movers.",
					"On a hit against a target you have not attacked this turn, deal +1d4 damage.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		source_book: "Rift Ascendant Canon",
		description:
			"A halberd-class polearm cut for sweeping arcs and thrust finishes.",
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
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
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
					name: "Mana Surge",
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
						name: "Mana Surge",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		source_book: "Rift Ascendant Canon",
		description:
			"A precision rifle with mana-stable optics. Effective against armored anomalies at extended range.",
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
				"Issued from the Bureau's mid-tier Ascendant requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Heavy in the hand. Heavier in consequence.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		source_book: "Rift Ascendant Canon",
		description: "A two-handed warhammer built to crater armored targets.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_25",
		name: "Void Katana",
		source_book: "Rift Ascendant Canon",
		description: "A Bureau-grade longsword with a mana-conductive crossguard.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0565.webp",
		weight: 1,
		value: { currency: "gate", amount: 316 },
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
				"Procured through the Ascendant Bureau's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Don't trust a weapon you can't put down.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "sustained", "healing", "area", "melee"],
		theme_tags: ["mana-overflow", "ascendant-bureau"],
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
					name: "Mana Surge",
					description:
						"As a bonus action, regain 1 spell slot of 2nd level or lower.",
					action: "bonus-action",
					dc: null,
					frequency: "long-rest",
				},
			],
			audit: {
				fingerprint: "08be91b8",
				payload_complete: true,
				uniqueness_seed: "item_p6_25::Void Katana",
				variant_note: "When wielded two-handed, +1 to damage rolls.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus + 1",
				damage_roll: "1d10 + STR modifier + 1",
				recharge: "long-rest",
				save_dc: null,
			},
			identity: {
				rarity: "rare",
				archetype: "melee_blade_versatile",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Void Katana keys void melee blade versatile rules through signature 7cd21c37.",
				role: "offense",
				signature: "7cd21c37",
				theme: "void",
			},
			passive_rules: [
				"When wielded two-handed, +1 to damage rolls.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"+1d4 damage against creatures with the Construct or Anomaly tag.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [
					{
						name: "Mana Surge",
						description:
							"As a bonus action, regain 1 spell slot of 2nd level or lower.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"When wielded two-handed, +1 to damage rolls.",
					"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
					"+1d4 damage against creatures with the Construct or Anomaly tag.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		source_book: "Rift Ascendant Canon",
		description: "A regulated emergency draught. Quick draw, reliable effect.",
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
			formulas: {
				effect_formula: "1d4",
				recharge: "at-will",
				save_dc: null,
			},
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_27",
		name: "Purified Mana Elixir",
		source_book: "Rift Ascendant Canon",
		description:
			"A pocket-sized recovery potion. Standard kit for any Ascendant on assignment.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0291.webp",
		weight: 7,
		value: { currency: "crystal", amount: 2540 },
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
				"Pulled from the gear locker of a mid-rank Ascendant declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "psychic", "burst", "consumable"],
		theme_tags: ["dimensional-bleed", "regent-era"],
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
					description: "Action. Restore 2d4 mana.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "aff50e98",
				payload_complete: true,
				uniqueness_seed: "item_p6_27::Purified Mana Elixir",
				variant_note:
					"Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
			},
			formulas: {
				effect_formula: "2d4",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Purified Mana Elixir keys aetheric consumable potion rules through signature 14e3c7c0.",
				role: "consumable",
				signature: "14e3c7c0",
				theme: "aetheric",
			},
			passive_rules: ["On drink, restore 2d4 mana."],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: "2d4",
				save: null,
				use_rule: "Action. Restore 2d4 mana.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_28",
		name: "Lattice-Scale Tactical Helmet",
		source_book: "Rift Ascendant Canon",
		description: "A combat helm with optional Bureau communication insert.",
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
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_29",
		name: "Phantom Tactical Helmet",
		source_book: "Rift Ascendant Canon",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0265.webp",
		weight: 1,
		value: { currency: "gate", amount: 120 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				fingerprint: "3e54e76d",
				payload_complete: true,
				uniqueness_seed: "item_p6_29::Phantom Tactical Helmet",
				variant_note:
					"Reinforced headgear. Advantage on saves vs. concussive impacts.",
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
					"Phantom Tactical Helmet keys void armor headgear rules through signature ee50f24c.",
				role: "defense",
				signature: "ee50f24c",
				theme: "void",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Reinforced headgear. Advantage on saves vs. concussive impacts.",
				"Resistance to necrotic damage.",
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "11 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 11 + AGI modifier.",
					"Reinforced headgear. Advantage on saves vs. concussive impacts.",
					"Resistance to necrotic damage.",
					"+1 to attack rolls against creatures within 5 ft. of an ally.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_30",
		name: "Nano-Weave Bracers",
		source_book: "Rift Ascendant Canon",
		description:
			"A wrist-worn focus and protective plate combined into one piece.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0955.webp",
		weight: 3,
		value: { currency: "gate", amount: 426 },
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
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "as listed",
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
				type: "passive",
				consumes_item: false,
				cost: "no action",
				frequency: "continuous",
				trigger: "Equipped, carried, worn, or used as described.",
			},
			active_rules: [],
			audit: {
				fingerprint: "73e8dd5e",
				payload_complete: true,
				uniqueness_seed: "item_p6_30::Nano-Weave Bracers",
				variant_note:
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
			},
			formulas: {
				effect_formula: "1d4",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "gear_bracer",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Nano-Weave Bracers keys standard gear bracer rules through signature b00f2468.",
				role: "utility",
				signature: "b00f2468",
				theme: "standard",
			},
			passive_rules: [
				"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				"+5 ft. to your speed while wielding this item.",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				passive_effects: [
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
					"+5 ft. to your speed while wielding this item.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_31",
		name: "High-Grade Beast Repellent",
		source_book: "Rift Ascendant Canon",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0594.webp",
		weight: 7,
		value: { currency: "crystal", amount: 960 },
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
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip.",
		tags: ["equipment", "utility", "control", "consumable"],
		theme_tags: ["guild-ops", "survival", "system-glitch"],
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
					description: "Action. Restore 2d4 mana.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "2cee4ba4",
				payload_complete: true,
				uniqueness_seed: "item_p6_31::High-Grade Beast Repellent",
				variant_note: "Restores mana on consumption.",
			},
			formulas: {
				effect_formula: "2d4",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"High-Grade Beast Repellent keys standard consumable potion rules through signature 308845ef.",
				role: "consumable",
				signature: "308845ef",
				theme: "standard",
			},
			passive_rules: ["On drink, restore 2d4 mana."],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: "2d4",
				save: null,
				use_rule: "Action. Restore 2d4 mana.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_32",
		name: "Lesser Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description:
			"A combat-grade healing compound packaged for sub-action consumption.",
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
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Came up in a Bureau audit and survived the resulting paperwork.",
			origin:
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
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
			formulas: {
				effect_formula: "1d4",
				recharge: "at-will",
				save_dc: null,
			},
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_33",
		name: "Lesser Mana Elixir",
		source_book: "Rift Ascendant Canon",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0084.webp",
		weight: 3,
		value: { currency: "crystal", amount: 2420 },
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
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip.",
		tags: ["equipment", "buff", "stealth", "necrotic", "consumable"],
		theme_tags: ["dimensional-bleed", "black-market", "elite-tier"],
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
					description: "Action. Restore 2d4 mana.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "aff50e98",
				payload_complete: true,
				uniqueness_seed: "item_p6_33::Lesser Mana Elixir",
				variant_note: "Restores mana on consumption.",
			},
			formulas: {
				effect_formula: "2d4",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Lesser Mana Elixir keys aetheric consumable potion rules through signature 58a6373f.",
				role: "consumable",
				signature: "58a6373f",
				theme: "aetheric",
			},
			passive_rules: ["On drink, restore 2d4 mana."],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: "2d4",
				save: null,
				use_rule: "Action. Restore 2d4 mana.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_34",
		name: "Vanguard Tactical Helmet",
		source_book: "Rift Ascendant Canon",
		description: "Bureau-issued head protection, lightweight and fitted.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0671.webp",
		weight: 1,
		value: { currency: "gate", amount: 73 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				"Earned a footnote in the Ascendant Bureau's quarterly equipment audit.",
			origin:
				"Logged into the Ascendant Bureau's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You feel naked the day you take it off.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "fire", "psychic", "damage", "defensive", "armor"],
		theme_tags: ["dungeon-core", "guild-ops"],
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
				fingerprint: "9a1ae052",
				payload_complete: true,
				uniqueness_seed: "item_p6_34::Vanguard Tactical Helmet",
				variant_note:
					"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
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
					"Vanguard Tactical Helmet keys standard armor headgear rules through signature aa5f1211.",
				role: "defense",
				signature: "aa5f1211",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "11 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 11 + AGI modifier.",
					"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
					"On a hit against a Frightened creature, deal +1d4 damage.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_35",
		name: "Guild-Issue Warhammer",
		source_book: "Rift Ascendant Canon",
		description:
			"A heavy two-handed crusher. Best used against fortified anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0158.webp",
		weight: 7,
		value: { currency: "gate", amount: 370 },
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
				"Quietly stockpiled by the Ascendant Bureau after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Quiet, until it isn't.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "sustained", "support", "melee"],
		theme_tags: ["ancient-power", "ascendant-bureau"],
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
				fingerprint: "305584ea",
				payload_complete: true,
				uniqueness_seed: "item_p6_35::Guild-Issue Warhammer",
				variant_note:
					"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "2d6 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_bludgeon_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Guild-Issue Warhammer keys standard melee bludgeon heavy rules through signature 9b347a27.",
				role: "offense",
				signature: "9b347a27",
				theme: "standard",
			},
			passive_rules: [
				"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
				"+1 to initiative rolls while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "bludgeoning",
				active_options: [],
				attack_roll: true,
				damage_formula: "2d6 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
					"+1 to initiative rolls while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_36",
		name: "Guild-Standard Beast Repellent",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0385.webp",
		weight: 6,
		value: { currency: "crystal", amount: 450 },
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
				"Logged into the Ascendant Bureau's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's not pretty going down. It's prettier than the alternative.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "control", "support", "consumable"],
		theme_tags: ["system-glitch", "urban-combat"],
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
				fingerprint: "1c4e51f5",
				payload_complete: true,
				uniqueness_seed: "item_p6_36::Guild-Standard Beast Repellent",
				variant_note:
					"Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
			},
			formulas: {
				effect_formula: "1d4",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Guild-Standard Beast Repellent keys standard consumable potion rules through signature db54c90f.",
				role: "consumable",
				signature: "db54c90f",
				theme: "standard",
			},
			passive_rules: [
				"Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_37",
		name: "Guild-Issue Longsword",
		source_book: "Rift Ascendant Canon",
		description:
			"A versatile cutting blade with a tempered edge and Bureau service marks.",
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
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_38",
		name: "Abyssal Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A short-barrel handgun tuned for fast draw and reliable function inside cramped gate corridors.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0211.webp",
		weight: 1,
		value: { currency: "gate", amount: 78 },
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
				"Quietly stockpiled by the Ascendant Bureau after an A-rank cascade exposed gaps in standard kit.",
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
				damage: ["STR", "AGI"],
				armor_class: [],
				attack: ["STR", "AGI"],
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
				fingerprint: "65b37d49",
				payload_complete: true,
				uniqueness_seed: "item_p6_38::Abyssal Revolver",
				variant_note: "Snub-frame. Counts as a finesse weapon.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus",
				damage_roll: "1d6 + STR or AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "firearm_pistol",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Abyssal Revolver keys void firearm pistol rules through signature de7ccc74.",
				role: "offense",
				signature: "de7ccc74",
				theme: "void",
			},
			passive_rules: [
				"Snub-frame. Counts as a finesse weapon.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Snub-frame. Counts as a finesse weapon.",
					"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
					"On a hit against a Frightened creature, deal +1d4 damage.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Ranged (50/150)",
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
			"A purifier vial labeled with the Bureau's medical-clearance stamp.",
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
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Figured in a debriefing hearing after a clear went sideways in an unstable Gate.",
			origin:
				"Surfaced in the Ascendant Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Bureau's standard answer to 'how are we still alive?'",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_40",
		name: "Shadow Bracers",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-issued forearm guard for Ascendants operating melee-forward.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0914.webp",
		weight: 1,
		value: { currency: "gate", amount: 210 },
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
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "as listed",
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
				type: "passive",
				consumes_item: false,
				cost: "no action",
				frequency: "continuous",
				trigger: "Equipped, carried, worn, or used as described.",
			},
			active_rules: [],
			audit: {
				fingerprint: "bcf65ae5",
				payload_complete: true,
				uniqueness_seed: "item_p6_40::Shadow Bracers",
				variant_note:
					"+1 to attack rolls with light or finesse weapons while worn.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "gear_bracer",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Shadow Bracers keys shadow gear bracer rules through signature 55f49ce6.",
				role: "utility",
				signature: "55f49ce6",
				theme: "shadow",
			},
			passive_rules: [
				"+1 to attack rolls with light or finesse weapons while worn.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+1 to attack rolls with light or finesse weapons while worn.",
				passive_effects: [
					"+1 to attack rolls with light or finesse weapons while worn.",
					"Advantage on Stealth checks made in dim light or darkness.",
					"+1 to attack rolls against creatures within 5 ft. of an ally.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_41",
		name: "Crimson Spear",
		source_book: "Rift Ascendant Canon",
		description:
			"A two-handed reach weapon — good against fast, low-ground anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0995.webp",
		weight: 1,
		value: { currency: "gate", amount: 507 },
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
				fingerprint: "c67cfd6f",
				payload_complete: true,
				uniqueness_seed: "item_p6_41::Crimson Spear",
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
					"Crimson Spear keys crimson melee polearm rules through signature 98bf0faf.",
				role: "offense",
				signature: "98bf0faf",
				theme: "crimson",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target takes 1d4 ongoing slashing damage at the start of its next two turns (Bleeding).",
				"Once per short rest, treat a single failed Vitality save as a success.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "slashing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Reach: melee attacks have 10 ft. range.",
					"On a hit, target takes 1d4 ongoing slashing damage at the start of its next two turns (Bleeding).",
					"Once per short rest, treat a single failed Vitality save as a success.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_42",
		name: "Aether-Plated Bracers",
		source_book: "Rift Ascendant Canon",
		description: "A reinforced bracer with mild armor weave on the inner face.",
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
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Ascendant's go-bag.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_43",
		name: "Black-Market Beast Repellent",
		source_book: "Rift Ascendant Canon",
		description:
			"A Ascendant-grade restorative; sealed against ambient mana decay.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0245.webp",
		weight: 3,
		value: { currency: "crystal", amount: 3200 },
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
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
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
						"Action. Grants 5 + Vitality temporary HP for 10 minutes.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "274b8169",
				payload_complete: true,
				uniqueness_seed: "item_p6_43::Black-Market Beast Repellent",
				variant_note: "Grants 5 + Vitality temporary HP for 10 minutes.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Black-Market Beast Repellent keys standard consumable potion rules through signature af5a6758.",
				role: "consumable",
				signature: "af5a6758",
				theme: "standard",
			},
			passive_rules: ["Grants 5 + Vitality temporary HP for 10 minutes."],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule: "Action. Grants 5 + Vitality temporary HP for 10 minutes.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_44",
		name: "Starlight Halberd",
		source_book: "Rift Ascendant Canon",
		description: "A reach weapon used by Bureau gate-line teams.",
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
				"Quietly stockpiled by the Ascendant Bureau after an A-rank cascade exposed gaps in standard kit.",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It owes nothing to luck. It is what it costs.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
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
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_45",
		name: "High-Grade Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description:
			"A combat-grade healing compound packaged for sub-action consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0967.webp",
		weight: 7,
		value: { currency: "crystal", amount: 2620 },
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
				"Procured through the Ascendant Bureau's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "shadow", "fire", "stealth", "consumable"],
		theme_tags: ["ascendant-bureau", "post-awakening"],
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
					description: "Action. Restores mana on consumption.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "82a0161b",
				payload_complete: true,
				uniqueness_seed: "item_p6_45::High-Grade Liquid Shadow",
				variant_note: "Restores mana on consumption.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"High-Grade Liquid Shadow keys shadow consumable potion rules through signature 7d9c4bb2.",
				role: "consumable",
				signature: "7d9c4bb2",
				theme: "shadow",
			},
			passive_rules: [
				"Restores mana on consumption.",
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule: "Action. Restores mana on consumption.",
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_46",
		name: "Aether-Plated Combat Vest",
		source_book: "Rift Ascendant Canon",
		description: "A field-armor coat with reinforced shoulder and hip panels.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0704.webp",
		weight: 2,
		value: { currency: "gate", amount: 250 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				fingerprint: "6f99abe3",
				payload_complete: true,
				uniqueness_seed: "item_p6_46::Aether-Plated Combat Vest",
				variant_note:
					"Stealth-treated armor. Advantage on Stealth checks while worn.",
			},
			formulas: {
				armor_class: "11 + AGI modifier",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_light",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aether-Plated Combat Vest keys aetheric armor light rules through signature 48e1d04f.",
				role: "defense",
				signature: "48e1d04f",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"Resistance to force damage.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "11 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 11 + AGI modifier.",
					"Stealth-treated armor. Advantage on Stealth checks while worn.",
					"Resistance to force damage.",
					"On a critical hit, regain 1 HP per Hit Die spent today.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_47",
		name: "Ceramic Spaulders",
		source_book: "Rift Ascendant Canon",
		description:
			"Bureau-grade heavy plate. Slow, but it stops what most armor doesn't.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0689.webp",
		weight: 2,
		value: { currency: "gate", amount: 230 },
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
			restrictions: ["Requires STR 15 to avoid armor penalties."],
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
				type: "passive",
				consumes_item: false,
				cost: "no action",
				frequency: "continuous",
				trigger: "Equipped, carried, worn, or used as described.",
			},
			active_rules: [],
			audit: {
				fingerprint: "f1fbad0b",
				payload_complete: true,
				uniqueness_seed: "item_p6_47::Ceramic Spaulders",
				variant_note:
					"Heavy carapace plating. AC 17. Stealth disadvantage. Requires STR 15.",
			},
			formulas: {
				armor_class: "17",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: "Requires STR 15",
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Ceramic Spaulders keys standard armor heavy rules through signature 79b2a8f0.",
				role: "defense",
				signature: "79b2a8f0",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 17. Stealth checks at disadvantage.",
				"Heavy carapace plating. AC 17. Stealth disadvantage. Requires STR 15.",
				"On a hit against a target you have not attacked this turn, deal +1d4 damage.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "17",
				armor_type: "Heavy",
				stealth_disadvantage: true,
				strength_requirement: 15,
				equipped_effects: [
					"Provides AC 17. Stealth checks at disadvantage.",
					"Heavy carapace plating. AC 17. Stealth disadvantage. Requires STR 15.",
					"On a hit against a target you have not attacked this turn, deal +1d4 damage.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_48",
		name: "Mana-Infused Spear",
		source_book: "Rift Ascendant Canon",
		description:
			"A two-handed reach weapon — good against fast, low-ground anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0170.webp",
		weight: 1,
		value: { currency: "gate", amount: 198 },
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
		flavor: "What survives a Ascendant's tour usually outlives the Ascendant.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip.",
		tags: ["equipment", "burst", "damage", "shadow", "melee"],
		theme_tags: ["guild-ops", "mana-overflow", "modern-warfare"],
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
				fingerprint: "40a4daf3",
				payload_complete: true,
				uniqueness_seed: "item_p6_48::Mana-Infused Spear",
				variant_note:
					"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d8 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_polearm",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Mana-Infused Spear keys aetheric melee polearm rules through signature ccf09945.",
				role: "offense",
				signature: "ccf09945",
				theme: "aetheric",
			},
			passive_rules: [
				"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
				"On a hit, target loses 1 mana point (if any).",
				"Once per short rest, reroll a missed attack roll.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
					"On a hit, target loses 1 mana point (if any).",
					"Once per short rest, reroll a missed attack roll.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
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
		id: "item_p6_49",
		name: "Aetheric Sniper Rifle",
		source_book: "Rift Ascendant Canon",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0531.webp",
		weight: 4,
		value: { currency: "gate", amount: 478 },
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
		theme_tags: ["ascendant-bureau", "dungeon-core", "regent-era"],
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
				damage: ["AGI"],
				armor_class: [],
				attack: ["AGI"],
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
				fingerprint: "f27d0783",
				payload_complete: true,
				uniqueness_seed: "item_p6_49::Aetheric Sniper Rifle",
				variant_note: "Bolt-action. One attack per turn; +1 to attack rolls.",
			},
			formulas: {
				attack_roll: "d20 + AGI modifier + proficiency bonus",
				damage_roll: "1d12 + AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "firearm_rifle",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aetheric Sniper Rifle keys aetheric firearm rifle rules through signature 60fccb89.",
				role: "offense",
				signature: "60fccb89",
				theme: "aetheric",
			},
			passive_rules: [
				"Bolt-action. One attack per turn; +1 to attack rolls.",
				"On a hit, target loses 1 mana point (if any).",
				"Once per long rest, you may make one weapon attack as a bonus action.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d12 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Bolt-action. One attack per turn; +1 to attack rolls.",
					"On a hit, target loses 1 mana point (if any).",
					"Once per long rest, you may make one weapon attack as a bonus action.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Ranged (100/400)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
];
