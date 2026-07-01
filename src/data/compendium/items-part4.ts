import type { Item } from "./items";

export const items_part4: Item[] = [
	{
		id: "item_p4_0",
		name: "Guild-Standard Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description:
			"An alchemist-licensed restorative. Mana-conductive, fast-absorbing.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0128.webp",
		weight: 6,
		value: { currency: "crystal", amount: 2050 },
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
				uniqueness_seed: "item_p4_0::Guild-Standard Liquid Shadow",
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
					"Guild-Standard Liquid Shadow keys shadow consumable potion rules through signature 0412013a.",
				role: "consumable",
				signature: "0412013a",
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
		id: "item_p4_1",
		name: "Purified Beast Repellent",
		source_book: "Rift Ascendant Canon",
		description:
			"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0889.webp",
		weight: 7,
		value: { currency: "crystal", amount: 3700 },
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
					description: "Action. Drink the potion. Restore 2d4 + 2 HP.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "e0271cc6",
				payload_complete: true,
				uniqueness_seed: "item_p4_1::Purified Beast Repellent",
				variant_note: "Restores HP on consumption.",
			},
			formulas: {
				effect_formula: "2d4 + 2",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Purified Beast Repellent keys standard consumable potion rules through signature 0d340218.",
				role: "consumable",
				signature: "0d340218",
				theme: "standard",
			},
			passive_rules: ["On drink, restore 2d4 + 2 hit points."],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: "2d4 + 2",
				save: null,
				use_rule: "Action. Drink the potion. Restore 2d4 + 2 HP.",
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
		id: "item_p4_2",
		name: "Void Katana",
		source_book: "Rift Ascendant Canon",
		description:
			"A mid-weight longsword with a Bureau-stamped pommel and reinforced grip.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0894.webp",
		weight: 8,
		value: { currency: "gate", amount: 14 },
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
				fingerprint: "9a3abd7c",
				payload_complete: true,
				uniqueness_seed: "item_p4_2::Void Katana",
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
					"Void Katana keys void melee blade versatile rules through signature 00507060.",
				role: "offense",
				signature: "00507060",
				theme: "void",
			},
			passive_rules: [
				"On a critical hit, target is Frightened until the end of its next turn.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"On a critical hit, target is Frightened until the end of its next turn.",
					"Once per long rest, when you take damage, you may halve it as a reaction.",
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
		id: "item_p4_3",
		name: "Shadow Bracers",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-issued forearm guard for Ascendants operating melee-forward.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0399.webp",
		weight: 3,
		value: { currency: "gate", amount: 89 },
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
				"Quietly stockpiled by the Ascendant Bureau after an A-rank cascade exposed gaps in standard kit.",
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
				fingerprint: "d4105efd",
				payload_complete: true,
				uniqueness_seed: "item_p4_3::Shadow Bracers",
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
					"Shadow Bracers keys shadow gear bracer rules through signature 356ff9f3.",
				role: "utility",
				signature: "356ff9f3",
				theme: "shadow",
			},
			passive_rules: [
				"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				"Disadvantage on attacks against you while you are obscured.",
				"+1 to one save of your choice while attuned.",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				passive_effects: [
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
					"Disadvantage on attacks against you while you are obscured.",
					"+1 to one save of your choice while attuned.",
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
		id: "item_p4_4",
		name: "Unstable Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0572.webp",
		weight: 7,
		value: { currency: "crystal", amount: 1690 },
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
				fingerprint: "379e85b6",
				payload_complete: true,
				uniqueness_seed: "item_p4_4::Unstable Liquid Shadow",
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
					"Unstable Liquid Shadow keys shadow consumable potion rules through signature d6aa43bf.",
				role: "consumable",
				signature: "d6aa43bf",
				theme: "shadow",
			},
			passive_rules: [
				"Grants 5 + Vitality temporary HP for 10 minutes.",
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
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
		id: "item_p4_5",
		name: "Aetheric Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0685.webp",
		weight: 7,
		value: { currency: "gate", amount: 135 },
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
				"Brokered to a Ascendant Bureau quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "sustained", "offensive", "firearm"],
		theme_tags: ["forbidden", "rift-energy", "black-market"],
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
				fingerprint: "08bda334",
				payload_complete: true,
				uniqueness_seed: "item_p4_5::Aetheric Revolver",
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
					"Aetheric Revolver keys aetheric firearm pistol rules through signature ab4b691a.",
				role: "offense",
				signature: "ab4b691a",
				theme: "aetheric",
			},
			passive_rules: [
				"Snub-frame. Counts as a finesse weapon.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"+1 to one save of your choice while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Snub-frame. Counts as a finesse weapon.",
					"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
					"+1 to one save of your choice while attuned.",
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
		id: "item_p4_6",
		name: "High-Grade Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-graded antidote calibrated for the most common gate-acquired afflictions.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0322.webp",
		weight: 1,
		value: { currency: "crystal", amount: 3080 },
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
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "lightning", "stealth", "consumable"],
		theme_tags: ["ancient-power", "shadow-domain", "system-glitch"],
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
				uniqueness_seed: "item_p4_6::High-Grade Aetheric Antidote",
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
					"High-Grade Aetheric Antidote keys aetheric consumable purifier rules through signature 5015b277.",
				role: "consumable",
				signature: "5015b277",
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
		id: "item_p4_7",
		name: "Lattice-Scale Exo-Suit",
		source_book: "Rift Ascendant Canon",
		description:
			"A flexible armor cloak shaped to sit unobtrusively under Bureau-issue uniforms.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0427.webp",
		weight: 5,
		value: { currency: "gate", amount: 109 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				"Issued from the Bureau's mid-tier Ascendant requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Pull the straps tight. Trust the maker.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "support", "offensive", "armor"],
		theme_tags: ["shadow-domain", "mana-overflow", "elite-tier"],
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
				fingerprint: "e3a58e8d",
				payload_complete: true,
				uniqueness_seed: "item_p4_7::Lattice-Scale Exo-Suit",
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
					"Lattice-Scale Exo-Suit keys aetheric armor light rules through signature c92d388d.",
				role: "defense",
				signature: "c92d388d",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"Resistance to force damage.",
				"On a kill with this item, gain 1d4 temporary HP.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p4_8",
		name: "Purified Stamina Stim",
		source_book: "Rift Ascendant Canon",
		description:
			"A Ascendant-grade injector. Burns hot and fast. Trust the cap.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0872.webp",
		weight: 8,
		value: { currency: "crystal", amount: 2490 },
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
		activation: {
			type: "bonus-action",
			consumes_item: true,
			cost: "1 bonus action",
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
				type: "bonus-action",
				consumes_item: true,
				cost: "1 bonus action",
				frequency: "at-will",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Inject",
					description:
						"Bonus action. Restore 2d4 + 2 HP to a willing creature within 5 ft..",
					action: "bonus-action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "60cd1f60",
				payload_complete: true,
				uniqueness_seed: "item_p4_8::Purified Stamina Stim",
				variant_note: "Restores HP on injection.",
			},
			formulas: {
				effect_formula: "2d4 + 2",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_stim",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Purified Stamina Stim keys standard consumable stim rules through signature 025a5ebf.",
				role: "consumable",
				signature: "025a5ebf",
				theme: "standard",
			},
			passive_rules: ["On inject, restore 2d4 + 2 hit points."],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: "2d4 + 2",
				save: null,
				use_rule:
					"Bonus action. Restore 2d4 + 2 HP to a willing creature within 5 ft..",
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
		id: "item_p4_9",
		name: "Nano-Weave Spaulders",
		source_book: "Rift Ascendant Canon",
		description:
			"Heavy carapace plating; favored by S-rank tanks and Holy Knights.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0601.webp",
		weight: 1,
		value: { currency: "gate", amount: 210 },
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
				"Logged into the Ascendant Bureau's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "perception", "shadow", "lightning", "armor"],
		theme_tags: ["mana-overflow", "dungeon-core"],
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
				fingerprint: "9bd792ef",
				payload_complete: true,
				uniqueness_seed: "item_p4_9::Nano-Weave Spaulders",
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
					"Nano-Weave Spaulders keys standard armor heavy rules through signature ebb66e33.",
				role: "defense",
				signature: "ebb66e33",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Reinforced carapace. AC 16. Stealth disadvantage.",
				"+1 to Investigation and Insight checks while attuned.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p4_10",
		name: "Vanguard Breastplate",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced battle-plate composed of layered ichor-treated sections.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0257.webp",
		weight: 4,
		value: { currency: "gate", amount: 323 },
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
				"Issued to a B-rank Ascendant on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"What's left of you after it's done its job is what you started with.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "damage", "buff", "area", "debuff", "armor"],
		theme_tags: ["system-glitch", "mana-overflow"],
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
				fingerprint: "6b7732b3",
				payload_complete: true,
				uniqueness_seed: "item_p4_10::Vanguard Breastplate",
				variant_note: "Standard heavy plate. Stealth disadvantage.",
			},
			formulas: {
				armor_class: "15",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: "Requires STR 13",
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Vanguard Breastplate keys standard armor heavy rules through signature 9d9fe8ee.",
				role: "defense",
				signature: "9d9fe8ee",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "15",
				armor_type: "Heavy",
				stealth_disadvantage: true,
				strength_requirement: 13,
				equipped_effects: [
					"Provides AC 15. Stealth checks at disadvantage.",
					"Standard heavy plate. Stealth disadvantage.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p4_11",
		name: "Ceramic Trench Coat",
		source_book: "Rift Ascendant Canon",
		description:
			"A light, flexible armor weave. Standard kit for stealth-focused Ascendants.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0528.webp",
		weight: 3,
		value: { currency: "gate", amount: 419 },
		item_type: "armor",
		armor_class: "12 + AGI modifier",
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
				fingerprint: "eba5f7d3",
				payload_complete: true,
				uniqueness_seed: "item_p4_11::Ceramic Trench Coat",
				variant_note:
					"Mana-stable weave. Resistance to a chosen damage type while attuned.",
			},
			formulas: {
				armor_class: "12 + AGI modifier",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_light",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Ceramic Trench Coat keys standard armor light rules through signature 1b87135e.",
				role: "defense",
				signature: "1b87135e",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"Add +1d4 damage when target is below half HP.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "12 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 12 + AGI modifier.",
					"Mana-stable weave. Resistance to a chosen damage type while attuned.",
					"Add +1d4 damage when target is below half HP.",
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
		id: "item_p4_12",
		name: "Starlight Warhammer",
		source_book: "Rift Ascendant Canon",
		description: "A two-handed warhammer built to crater armored targets.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0543.webp",
		weight: 4,
		value: { currency: "gate", amount: 69 },
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
				"Issued to a B-rank Ascendant on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "shadow", "support", "damage", "offensive", "melee"],
		theme_tags: ["gate-zone", "ascendant-bureau"],
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
				fingerprint: "f797f0ec",
				payload_complete: true,
				uniqueness_seed: "item_p4_12::Starlight Warhammer",
				variant_note:
					"On a hit, target makes a DC 13 Strength save or is knocked prone.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d10 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_bludgeon_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Starlight Warhammer keys starlight melee bludgeon heavy rules through signature eb35f103.",
				role: "offense",
				signature: "eb35f103",
				theme: "starlight",
			},
			passive_rules: [
				"On a hit, target makes a DC 13 Strength save or is knocked prone.",
				"On a hit, target sheds dim light in a 5-ft. radius until the start of your next turn.",
				"Add +1d4 damage when target is below half HP.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "radiant",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"On a hit, target makes a DC 13 Strength save or is knocked prone.",
					"On a hit, target sheds dim light in a 5-ft. radius until the start of your next turn.",
					"Add +1d4 damage when target is below half HP.",
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
		id: "item_p4_13",
		name: "Shadow Shin Guards",
		source_book: "Rift Ascendant Canon",
		description:
			"A field armor designed to keep mobility without sacrificing all protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0030.webp",
		weight: 4,
		value: { currency: "gate", amount: 41 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Reverse-engineered by Bureau artificers from materials harvested in a lattice-bleed event.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "area", "void", "armor"],
		theme_tags: ["elite-tier", "rift-energy", "forbidden"],
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
				fingerprint: "17a54bec",
				payload_complete: true,
				uniqueness_seed: "item_p4_13::Shadow Shin Guards",
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
					"Shadow Shin Guards keys shadow armor light rules through signature a7c2260b.",
				role: "defense",
				signature: "a7c2260b",
				theme: "shadow",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"On a kill with this item, gain 1d4 temporary HP.",
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
					"Advantage on Stealth checks made in dim light or darkness.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p4_14",
		name: "Lattice-Scale Breastplate",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced heavy armor shell. Designed for line-holders and gate-breach teams.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0829.webp",
		weight: 4,
		value: { currency: "gate", amount: 154 },
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
				"Procured through the Ascendant Bureau's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "area", "lightning", "perception", "armor"],
		theme_tags: ["urban-combat", "dungeon-core"],
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
				fingerprint: "eaab202b",
				payload_complete: true,
				uniqueness_seed: "item_p4_14::Lattice-Scale Breastplate",
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
					"Lattice-Scale Breastplate keys aetheric armor heavy rules through signature d642f0a3.",
				role: "defense",
				signature: "d642f0a3",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Reinforced carapace. AC 16. Stealth disadvantage.",
				"+1 to spell-save DCs while worn.",
				"Once per short rest, treat a single failed Vitality save as a success.",
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
					"+1 to spell-save DCs while worn.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p4_15",
		name: "Gate-Forged Spaulders",
		source_book: "Rift Ascendant Canon",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0972.webp",
		weight: 5,
		value: { currency: "gate", amount: 487 },
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
				"Showed up in pawn shops across three districts before the Bureau issued a recall.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "single-target", "psychic", "armor"],
		theme_tags: ["classified", "elite-tier", "black-market"],
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
				fingerprint: "1fb6dac3",
				payload_complete: true,
				uniqueness_seed: "item_p4_15::Gate-Forged Spaulders",
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
					"Gate-Forged Spaulders keys standard armor heavy rules through signature 401f7ede.",
				role: "defense",
				signature: "401f7ede",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 17. Stealth checks at disadvantage.",
				"Heavy carapace plating. AC 17. Stealth disadvantage. Requires STR 15.",
				"Crit on 19-20 against gate-spawned creatures.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p4_16",
		name: "Unstable Beast Repellent",
		source_book: "Rift Ascendant Canon",
		description:
			"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0827.webp",
		weight: 4,
		value: { currency: "crystal", amount: 1800 },
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
				uniqueness_seed: "item_p4_16::Unstable Beast Repellent",
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
					"Unstable Beast Repellent keys standard consumable potion rules through signature 0677c004.",
				role: "consumable",
				signature: "0677c004",
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
		id: "item_p4_17",
		name: "Guild-Standard Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A purifier vial labeled with the Bureau's medical-clearance stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0466.webp",
		weight: 5,
		value: { currency: "crystal", amount: 3990 },
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
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: [
			"equipment",
			"offensive",
			"single-target",
			"lightning",
			"stealth",
			"consumable",
		],
		theme_tags: ["urban-combat", "classified", "ascendant-bureau"],
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
					description: "Action. Cures the poisoned condition.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "ae6ace10",
				payload_complete: true,
				uniqueness_seed: "item_p4_17::Guild-Standard Aetheric Antidote",
				variant_note: "Cures the poisoned condition.",
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
					"Guild-Standard Aetheric Antidote keys aetheric consumable purifier rules through signature b9ecfce0.",
				role: "consumable",
				signature: "b9ecfce0",
				theme: "aetheric",
			},
			passive_rules: ["Cures the poisoned condition."],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule: "Action. Cures the poisoned condition.",
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
		id: "item_p4_18",
		name: "Nano-Weave Spaulders",
		source_book: "Rift Ascendant Canon",
		description:
			"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0801.webp",
		weight: 4,
		value: { currency: "gate", amount: 84 },
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
				"Brokered to a Ascendant Bureau quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "debuff", "utility", "damage", "armor"],
		theme_tags: ["urban-combat", "black-market"],
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
				fingerprint: "4b653adf",
				payload_complete: true,
				uniqueness_seed: "item_p4_18::Nano-Weave Spaulders",
				variant_note: "Mana-stable plate. Resistance to force damage.",
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
					"Nano-Weave Spaulders keys standard armor heavy rules through signature 9ca584ab.",
				role: "defense",
				signature: "9ca584ab",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Mana-stable plate. Resistance to force damage.",
				"Once per short rest, reroll a missed attack roll.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "16",
				armor_type: "Heavy",
				stealth_disadvantage: true,
				strength_requirement: 13,
				equipped_effects: [
					"Provides AC 16. Stealth checks at disadvantage.",
					"Mana-stable plate. Resistance to force damage.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p4_19",
		name: "Void Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0816.webp",
		weight: 4,
		value: { currency: "gate", amount: 445 },
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
				fingerprint: "1577a357",
				payload_complete: true,
				uniqueness_seed: "item_p4_19::Void Revolver",
				variant_note: "Suppressed. Doesn't reveal your position when fired.",
			},
			formulas: {
				attack_roll: "d20 + AGI modifier + proficiency bonus",
				damage_roll: "1d8 + AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "firearm_pistol",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Void Revolver keys void firearm pistol rules through signature 53dac1d6.",
				role: "offense",
				signature: "53dac1d6",
				theme: "void",
			},
			passive_rules: [
				"Suppressed. Doesn't reveal your position when fired.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"+1 to attack rolls when at full HP.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Suppressed. Doesn't reveal your position when fired.",
					"On a critical hit, target is Frightened until the end of its next turn.",
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
				range: "Ranged (30/90)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p4_20",
		name: "Concentrated Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0624.webp",
		weight: 4,
		value: { currency: "crystal", amount: 1940 },
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
				fingerprint: "379e85b6",
				payload_complete: true,
				uniqueness_seed: "item_p4_20::Concentrated Liquid Shadow",
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
					"Concentrated Liquid Shadow keys shadow consumable potion rules through signature ecb50d83.",
				role: "consumable",
				signature: "ecb50d83",
				theme: "shadow",
			},
			passive_rules: [
				"Grants 5 + Vitality temporary HP for 10 minutes.",
				"Grants 1 minute of stealth advantage in dim light or darkness.",
			],
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
		id: "item_p4_21",
		name: "Nano-Weave Breastplate",
		source_book: "Rift Ascendant Canon",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0353.webp",
		weight: 6,
		value: { currency: "gate", amount: 265 },
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
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "sustained", "burst", "armor"],
		theme_tags: ["classified", "forbidden"],
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
				fingerprint: "5144bfe7",
				payload_complete: true,
				uniqueness_seed: "item_p4_21::Nano-Weave Breastplate",
				variant_note: "Mana-stable plate. Resistance to force damage.",
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
					"Nano-Weave Breastplate keys standard armor heavy rules through signature ad9463bf.",
				role: "defense",
				signature: "ad9463bf",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Mana-stable plate. Resistance to force damage.",
				"+1 to initiative rolls while attuned.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "16",
				armor_type: "Heavy",
				stealth_disadvantage: true,
				strength_requirement: 13,
				equipped_effects: [
					"Provides AC 16. Stealth checks at disadvantage.",
					"Mana-stable plate. Resistance to force damage.",
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
		id: "item_p4_22",
		name: "Obsidian Spear",
		source_book: "Rift Ascendant Canon",
		description: "A reach weapon used by Bureau gate-line teams.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0118.webp",
		weight: 7,
		value: { currency: "gate", amount: 91 },
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
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Ascendants' survival.",
			origin:
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "void", "perception", "area", "burst", "melee"],
		theme_tags: ["urban-combat", "gate-zone", "mana-overflow"],
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
				fingerprint: "7b8def78",
				payload_complete: true,
				uniqueness_seed: "item_p4_22::Obsidian Spear",
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
					"Obsidian Spear keys shadow melee polearm rules through signature a53251ea.",
				role: "offense",
				signature: "a53251ea",
				theme: "shadow",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"While in dim light or darkness, attacks with this weapon have advantage.",
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Reach: melee attacks have 10 ft. range.",
					"While in dim light or darkness, attacks with this weapon have advantage.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p4_23",
		name: "Purified Stamina Stim",
		source_book: "Rift Ascendant Canon",
		description:
			"A field stim packaged in a one-use injector. Standard medic kit.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0631.webp",
		weight: 3,
		value: { currency: "crystal", amount: 980 },
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
				"Pulled from the gear locker of a mid-rank Ascendant declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "burst", "area", "consumable"],
		theme_tags: ["black-market", "rift-energy"],
		activation: {
			type: "bonus-action",
			consumes_item: true,
			cost: "1 bonus action",
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
				type: "bonus-action",
				consumes_item: true,
				cost: "1 bonus action",
				frequency: "at-will",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Inject",
					description:
						"Bonus action. Grants advantage on the next attack roll within 1 minute. After, take 1 fatigue.",
					action: "bonus-action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "408d0e68",
				payload_complete: true,
				uniqueness_seed: "item_p4_23::Purified Stamina Stim",
				variant_note:
					"Grants advantage on the next attack roll within 1 minute. After, take 1 fatigue.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_stim",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Purified Stamina Stim keys standard consumable stim rules through signature 05128222.",
				role: "consumable",
				signature: "05128222",
				theme: "standard",
			},
			passive_rules: [
				"Grants advantage on the next attack roll within 1 minute. After, take 1 fatigue.",
			],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule:
					"Bonus action. Grants advantage on the next attack roll within 1 minute. After, take 1 fatigue.",
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
		id: "item_p4_24",
		name: "Concentrated Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0028.webp",
		weight: 2,
		value: { currency: "crystal", amount: 2000 },
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
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "debuff", "offensive", "lightning", "consumable"],
		theme_tags: ["dimensional-bleed", "survival"],
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
				uniqueness_seed: "item_p4_24::Concentrated Liquid Shadow",
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
					"Concentrated Liquid Shadow keys shadow consumable potion rules through signature f239a78f.",
				role: "consumable",
				signature: "f239a78f",
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
		id: "item_p4_25",
		name: "Lesser Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0917.webp",
		weight: 2,
		value: { currency: "crystal", amount: 3480 },
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
				"Logged into the Ascendant Bureau's master inventory the day it was first sold.",
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
				uniqueness_seed: "item_p4_25::Lesser Liquid Shadow",
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
					"Lesser Liquid Shadow keys shadow consumable potion rules through signature fdb33aa4.",
				role: "consumable",
				signature: "fdb33aa4",
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
		id: "item_p4_26",
		name: "Black-Market Mana Elixir",
		source_book: "Rift Ascendant Canon",
		description: "A regulated emergency draught. Quick draw, reliable effect.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0578.webp",
		weight: 3,
		value: { currency: "crystal", amount: 4860 },
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
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "area", "buff", "ice", "consumable"],
		theme_tags: ["regent-era", "classified", "elite-tier"],
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
				uniqueness_seed: "item_p4_26::Black-Market Mana Elixir",
				variant_note: "Restores HP on consumption.",
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
					"Black-Market Mana Elixir keys aetheric consumable potion rules through signature a88c66c9.",
				role: "consumable",
				signature: "a88c66c9",
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
		id: "item_p4_27",
		name: "Ceramic Trench Coat",
		source_book: "Rift Ascendant Canon",
		description:
			"A modern Bureau armor jacket built for fast extraction and door-to-door work.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0915.webp",
		weight: 6,
		value: { currency: "gate", amount: 164 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Ascendants' survival.",
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
				fingerprint: "a7abb29f",
				payload_complete: true,
				uniqueness_seed: "item_p4_27::Ceramic Trench Coat",
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
					"Ceramic Trench Coat keys standard armor light rules through signature 9f1d0d9b.",
				role: "defense",
				signature: "9f1d0d9b",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
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
					"Once per long rest, when you take damage, you may halve it as a reaction.",
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
		id: "item_p4_28",
		name: "Purified Stamina Stim",
		source_book: "Rift Ascendant Canon",
		description: "A pre-measured combat stim with Bureau-coded markings.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0080.webp",
		weight: 8,
		value: { currency: "crystal", amount: 2320 },
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
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: [
			"equipment",
			"area",
			"mobility",
			"perception",
			"support",
			"consumable",
		],
		theme_tags: ["dungeon-core", "system-glitch", "post-awakening"],
		activation: {
			type: "bonus-action",
			consumes_item: true,
			cost: "1 bonus action",
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
				type: "bonus-action",
				consumes_item: true,
				cost: "1 bonus action",
				frequency: "at-will",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Inject",
					description:
						"Bonus action. Grants resistance to non-magical bludgeoning, piercing, and slashing for 1 minute.",
					action: "bonus-action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "e4b9e35f",
				payload_complete: true,
				uniqueness_seed: "item_p4_28::Purified Stamina Stim",
				variant_note:
					"Grants resistance to non-magical bludgeoning, piercing, and slashing for 1 minute.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_stim",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Purified Stamina Stim keys standard consumable stim rules through signature 7f52ae9f.",
				role: "consumable",
				signature: "7f52ae9f",
				theme: "standard",
			},
			passive_rules: [
				"Grants resistance to non-magical bludgeoning, piercing, and slashing for 1 minute.",
			],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule:
					"Bonus action. Grants resistance to non-magical bludgeoning, piercing, and slashing for 1 minute.",
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
		id: "item_p4_29",
		name: "Abyssal Longsword",
		source_book: "Rift Ascendant Canon",
		description:
			"A versatile mid-weight blade. Handles single- and two-handed equally well.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0833.webp",
		weight: 8,
		value: { currency: "gate", amount: 104 },
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
				"Issued to a B-rank Ascendant on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "debuff", "support", "sustained", "melee"],
		theme_tags: ["dungeon-core", "ascendant-bureau", "forbidden"],
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
				fingerprint: "c8e31f14",
				payload_complete: true,
				uniqueness_seed: "item_p4_29::Abyssal Longsword",
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
					"Abyssal Longsword keys void melee blade versatile rules through signature 6f1086cf.",
				role: "offense",
				signature: "6f1086cf",
				theme: "void",
			},
			passive_rules: [
				"When wielded two-handed, +1 to damage rolls.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"When wielded two-handed, +1 to damage rolls.",
					"On a critical hit, target is Frightened until the end of its next turn.",
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
		id: "item_p4_30",
		name: "Phantom Shin Guards",
		source_book: "Rift Ascendant Canon",
		description:
			"A multi-layer combat coat woven from impact-resistant fabric.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0299.webp",
		weight: 6,
		value: { currency: "gate", amount: 266 },
		item_type: "armor",
		armor_class: "12 + AGI modifier",
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
					name: "Steady Aim",
					description:
						"As a bonus action, your next ranged attack before the end of your turn ignores cover and gains advantage.",
					action: "bonus-action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "95ff9826",
				payload_complete: true,
				uniqueness_seed: "item_p4_30::Phantom Shin Guards",
				variant_note:
					"Stealth-treated armor. Advantage on Stealth checks while worn.",
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
					"Phantom Shin Guards keys void armor light rules through signature 3277fd53.",
				role: "defense",
				signature: "3277fd53",
				theme: "void",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"Resistance to necrotic damage.",
				"Critical hits with this item ignore resistance to its damage type.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "12 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 12 + AGI modifier.",
					"Stealth-treated armor. Advantage on Stealth checks while worn.",
					"Resistance to necrotic damage.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p4_31",
		name: "Nano-Weave Bracers",
		source_book: "Rift Ascendant Canon",
		description:
			"A wrist-worn focus and protective plate combined into one piece.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0970.webp",
		weight: 5,
		value: { currency: "gate", amount: 244 },
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
				fingerprint: "e03d9c96",
				payload_complete: true,
				uniqueness_seed: "item_p4_31::Nano-Weave Bracers",
				variant_note:
					"+1 to attack rolls with light or finesse weapons while worn.",
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
					"Nano-Weave Bracers keys standard gear bracer rules through signature d31d1bf1.",
				role: "utility",
				signature: "d31d1bf1",
				theme: "standard",
			},
			passive_rules: [
				"+1 to attack rolls with light or finesse weapons while worn.",
				"Add +1d4 damage when target is below half HP.",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+1 to attack rolls with light or finesse weapons while worn.",
				passive_effects: [
					"+1 to attack rolls with light or finesse weapons while worn.",
					"Add +1d4 damage when target is below half HP.",
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
		id: "item_p4_32",
		name: "Ceramic Spaulders",
		source_book: "Rift Ascendant Canon",
		description:
			"A full-coverage heavy carapace built for vanguard tanks holding gate breaches.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0317.webp",
		weight: 2,
		value: { currency: "gate", amount: 305 },
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
				"Issued from the Bureau's mid-tier Ascendant requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "necrotic", "utility", "armor"],
		theme_tags: ["guild-ops", "experimental", "black-market"],
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
				fingerprint: "b3aa949b",
				payload_complete: true,
				uniqueness_seed: "item_p4_32::Ceramic Spaulders",
				variant_note: "Standard heavy plate. Stealth disadvantage.",
			},
			formulas: {
				armor_class: "15",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: "Requires STR 13",
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Ceramic Spaulders keys standard armor heavy rules through signature 56827bbc.",
				role: "defense",
				signature: "56827bbc",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "15",
				armor_type: "Heavy",
				stealth_disadvantage: true,
				strength_requirement: 13,
				equipped_effects: [
					"Provides AC 15. Stealth checks at disadvantage.",
					"Standard heavy plate. Stealth disadvantage.",
					"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
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
		id: "item_p4_33",
		name: "Aetheric Spear",
		source_book: "Rift Ascendant Canon",
		description:
			"A two-handed reach weapon used to break melee lines and protect spellcasters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0460.webp",
		weight: 2,
		value: { currency: "gate", amount: 41 },
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "2d4",
		damage_type: "force",
		simple_properties: ["reach", "two-handed", "thrown"],
		range: "Thrown (20/60)",
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
				fingerprint: "ec22d049",
				payload_complete: true,
				uniqueness_seed: "item_p4_33::Aetheric Spear",
				variant_note:
					"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "2d4 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_polearm",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aetheric Spear keys aetheric melee polearm rules through signature 5524f268.",
				role: "offense",
				signature: "5524f268",
				theme: "aetheric",
			},
			passive_rules: [
				"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
				"While attuned, gain +1 to spell-attack rolls.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "2d4 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
					"While attuned, gain +1 to spell-attack rolls.",
					"Once per long rest, when you take damage, you may halve it as a reaction.",
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
		id: "item_p4_34",
		name: "Lattice-Scale Combat Vest",
		source_book: "Rift Ascendant Canon",
		description:
			"A field armor designed to keep mobility without sacrificing all protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0263.webp",
		weight: 1,
		value: { currency: "gate", amount: 15 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				fingerprint: "b1194c3f",
				payload_complete: true,
				uniqueness_seed: "item_p4_34::Lattice-Scale Combat Vest",
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
					"Lattice-Scale Combat Vest keys aetheric armor light rules through signature d2517201.",
				role: "defense",
				signature: "d2517201",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Stealth-treated armor. Advantage on Stealth checks while worn.",
				"Resistance to force damage.",
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
					"Stealth-treated armor. Advantage on Stealth checks while worn.",
					"Resistance to force damage.",
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
		id: "item_p4_35",
		name: "Phantom Tactical Helmet",
		source_book: "Rift Ascendant Canon",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0526.webp",
		weight: 6,
		value: { currency: "gate", amount: 76 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "sustained", "radiant", "ice", "area", "armor"],
		theme_tags: ["regent-era", "forbidden", "mana-overflow"],
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
				fingerprint: "9409c68d",
				payload_complete: true,
				uniqueness_seed: "item_p4_35::Phantom Tactical Helmet",
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
					"Phantom Tactical Helmet keys void armor headgear rules through signature f6015c3b.",
				role: "defense",
				signature: "f6015c3b",
				theme: "void",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
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
					"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
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
		id: "item_p4_36",
		name: "Ascendant's Dagger",
		source_book: "Rift Ascendant Canon",
		description:
			"A discreet sidearm blade meant for civilian-zone work and quiet exits.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0761.webp",
		weight: 2,
		value: { currency: "gate", amount: 104 },
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
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "defensive", "fire", "single-target", "melee"],
		theme_tags: ["urban-combat", "gate-zone"],
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
				fingerprint: "602b2bb5",
				payload_complete: true,
				uniqueness_seed: "item_p4_36::Ascendant's Dagger",
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
					"Ascendant's Dagger keys standard melee blade finesse rules through signature 5372ee5b.",
				role: "offense",
				signature: "5372ee5b",
				theme: "standard",
			},
			passive_rules: [
				"+1 to attack rolls when you have advantage.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "slashing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"+1 to attack rolls when you have advantage.",
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
		id: "item_p4_37",
		name: "Lattice-Scale Breastplate",
		source_book: "Rift Ascendant Canon",
		description:
			"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		rarity: "uncommon",
		type: "armor",
		image:
			"/generated/compendium/armor/armor-armor-lattice-scale-breastplate-1p3rkp.webp",
		weight: 2,
		value: { currency: "gate", amount: 28 },
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
				fingerprint: "1e37c8af",
				payload_complete: true,
				uniqueness_seed: "item_p4_37::Lattice-Scale Breastplate",
				variant_note: "Standard heavy plate. Stealth disadvantage.",
			},
			formulas: {
				armor_class: "15",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: "Requires STR 13",
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Lattice-Scale Breastplate keys aetheric armor heavy rules through signature aa0ea1dc.",
				role: "defense",
				signature: "aa0ea1dc",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Resistance to force damage.",
				"+5 ft. to your speed while wielding this item.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "15",
				armor_type: "Heavy",
				stealth_disadvantage: true,
				strength_requirement: 13,
				equipped_effects: [
					"Provides AC 15. Stealth checks at disadvantage.",
					"Standard heavy plate. Stealth disadvantage.",
					"Resistance to force damage.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p4_38",
		name: "Starlight Gauntlets",
		source_book: "Rift Ascendant Canon",
		description: "Articulated combat gauntlets that double as a martial focus.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0779.webp",
		weight: 4,
		value: { currency: "gate", amount: 443 },
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
				"Procured through the Ascendant Bureau's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It does the job. That's all the Bureau asks of it.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "necrotic", "healing", "area", "melee"],
		theme_tags: ["ascendant-bureau", "classified"],
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
				fingerprint: "61d64d96",
				payload_complete: true,
				uniqueness_seed: "item_p4_38::Starlight Gauntlets",
				variant_note: "Bladed knuckles. Finesse.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus",
				damage_roll: "1d6 + STR or AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_gauntlet",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Starlight Gauntlets keys starlight melee gauntlet rules through signature 110ff288.",
				role: "offense",
				signature: "110ff288",
				theme: "starlight",
			},
			passive_rules: [
				"Bladed knuckles. Finesse.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "radiant",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Bladed knuckles. Finesse.",
					"+1d4 radiant damage on the first hit each round against an Anomaly.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p4_39",
		name: "Shadow Exo-Suit",
		source_book: "Rift Ascendant Canon",
		description:
			"Modern light armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0682.webp",
		weight: 5,
		value: { currency: "gate", amount: 159 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				"Earned a footnote in the Ascendant Bureau's quarterly equipment audit.",
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
				fingerprint: "59f6e4f8",
				payload_complete: true,
				uniqueness_seed: "item_p4_39::Shadow Exo-Suit",
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
					"Shadow Exo-Suit keys shadow armor light rules through signature 4227aa47.",
				role: "defense",
				signature: "4227aa47",
				theme: "shadow",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
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
					"Advantage on Stealth checks made in dim light or darkness.",
					"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
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
		id: "item_p4_40",
		name: "Lesser Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0242.webp",
		weight: 8,
		value: { currency: "crystal", amount: 3200 },
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
		theme_tags: ["urban-combat", "ascendant-bureau"],
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
				uniqueness_seed: "item_p4_40::Lesser Liquid Shadow",
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
					"Lesser Liquid Shadow keys shadow consumable potion rules through signature 7d1a2d53.",
				role: "consumable",
				signature: "7d1a2d53",
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
		id: "item_p4_41",
		name: "Aetheric Dagger",
		source_book: "Rift Ascendant Canon",
		description: "A precision short blade favored by Strikers and Assassins.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0347.webp",
		weight: 6,
		value: { currency: "gate", amount: 418 },
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
				"Procured through the Ascendant Bureau's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "ice", "healing", "fire", "offensive", "melee"],
		theme_tags: ["ancient-power", "modern-warfare"],
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
				damage: ["STR", "AGI"],
				armor_class: [],
				attack: ["STR", "AGI"],
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
				fingerprint: "adf6ec85",
				payload_complete: true,
				uniqueness_seed: "item_p4_41::Aetheric Dagger",
				variant_note: "Crit on 19-20.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus + 1",
				damage_roll: "1d6 + STR or AGI modifier + 1",
				recharge: "short-rest",
				save_dc: null,
			},
			identity: {
				rarity: "rare",
				archetype: "melee_blade_finesse",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aetheric Dagger keys aetheric melee blade finesse rules through signature 5533a1f2.",
				role: "offense",
				signature: "5533a1f2",
				theme: "aetheric",
			},
			passive_rules: [
				"Crit on 19-20.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Once per long rest, cast a 2nd-level spell (player choice) without expending a spell slot.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [
					{
						name: "Phase Step",
						description:
							"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Crit on 19-20.",
					"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p4_42",
		name: "Ascendant's Longsword",
		source_book: "Rift Ascendant Canon",
		description:
			"A balanced blade with a fuller groove that channels excess kinetic mana.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0748.webp",
		weight: 3,
		value: { currency: "gate", amount: 288 },
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
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "shadow", "utility", "control", "melee"],
		theme_tags: ["guild-ops", "ancient-power", "classified"],
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
				fingerprint: "b48c9a4b",
				payload_complete: true,
				uniqueness_seed: "item_p4_42::Ascendant's Longsword",
				variant_note:
					"Counts as both slashing and piercing for resistance bypass.",
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
					"Ascendant's Longsword keys standard melee blade versatile rules through signature d751a775.",
				role: "offense",
				signature: "d751a775",
				theme: "standard",
			},
			passive_rules: [
				"Counts as both slashing and piercing for resistance bypass.",
				"+1 to Investigation and Insight checks while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "piercing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Counts as both slashing and piercing for resistance bypass.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p4_43",
		name: "Crimson Halberd",
		source_book: "Rift Ascendant Canon",
		description: "A reach weapon used by Bureau gate-line teams.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0605.webp",
		weight: 8,
		value: { currency: "gate", amount: 484 },
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
				"Brokered to a Ascendant Bureau quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "sustained", "ice", "void", "melee"],
		theme_tags: ["experimental", "black-market", "forbidden"],
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
				fingerprint: "f1cbb4c7",
				payload_complete: true,
				uniqueness_seed: "item_p4_43::Crimson Halberd",
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
					"Crimson Halberd keys crimson melee polearm rules through signature 49b9d7a8.",
				role: "offense",
				signature: "49b9d7a8",
				theme: "crimson",
			},
			passive_rules: [
				"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
				"While target is below half HP, attacks with this weapon deal +1d4 damage.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "slashing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
					"While target is below half HP, attacks with this weapon deal +1d4 damage.",
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
		id: "item_p4_44",
		name: "Greater Health Potion",
		source_book: "Rift Ascendant Canon",
		description:
			"A Ascendant-grade restorative; sealed against ambient mana decay.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0838.webp",
		weight: 1,
		value: { currency: "crystal", amount: 550 },
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
				uniqueness_seed: "item_p4_44::Greater Health Potion",
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
					"Greater Health Potion keys standard consumable potion rules through signature c5c757de.",
				role: "consumable",
				signature: "c5c757de",
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
		id: "item_p4_45",
		name: "Concentrated Stamina Stim",
		source_book: "Rift Ascendant Canon",
		description: "A Bureau-stamped emergency injector. Last-resort kit.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0319.webp",
		weight: 3,
		value: { currency: "crystal", amount: 3450 },
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
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The first sip is the worst. Drink past it.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "psychic", "lightning", "consumable"],
		theme_tags: ["urban-combat", "black-market", "post-awakening"],
		activation: {
			type: "bonus-action",
			consumes_item: true,
			cost: "1 bonus action",
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
				type: "bonus-action",
				consumes_item: true,
				cost: "1 bonus action",
				frequency: "at-will",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Inject",
					description:
						"Bonus action. Grants advantage on Investigation, Insight, and Sense saves for 10 minutes.",
					action: "bonus-action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "fcfad326",
				payload_complete: true,
				uniqueness_seed: "item_p4_45::Concentrated Stamina Stim",
				variant_note:
					"Grants advantage on Investigation, Insight, and Sense saves for 10 minutes.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "consumable_stim",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Concentrated Stamina Stim keys standard consumable stim rules through signature ed4e5e40.",
				role: "consumable",
				signature: "ed4e5e40",
				theme: "standard",
			},
			passive_rules: [
				"Grants advantage on Investigation, Insight, and Sense saves for 10 minutes.",
			],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule:
					"Bonus action. Grants advantage on Investigation, Insight, and Sense saves for 10 minutes.",
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
		id: "item_p4_46",
		name: "Phantom Spaulders",
		source_book: "Rift Ascendant Canon",
		description:
			"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0032.webp",
		weight: 3,
		value: { currency: "gate", amount: 354 },
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
				"Surfaced in the Ascendant Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "burst", "debuff", "damage", "control", "armor"],
		theme_tags: ["urban-combat", "forbidden", "shadow-domain"],
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
				fingerprint: "e633b592",
				payload_complete: true,
				uniqueness_seed: "item_p4_46::Phantom Spaulders",
				variant_note: "Standard heavy plate. Stealth disadvantage.",
			},
			formulas: {
				armor_class: "15",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: "Requires STR 13",
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Phantom Spaulders keys void armor heavy rules through signature 8e12ec9c.",
				role: "defense",
				signature: "8e12ec9c",
				theme: "void",
			},
			passive_rules: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Resistance to necrotic damage.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "15",
				armor_type: "Heavy",
				stealth_disadvantage: true,
				strength_requirement: 13,
				equipped_effects: [
					"Provides AC 15. Stealth checks at disadvantage.",
					"Standard heavy plate. Stealth disadvantage.",
					"Resistance to necrotic damage.",
					"Once per long rest, when you take damage, you may halve it as a reaction.",
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
		id: "item_p4_47",
		name: "Mana-Infused Dagger",
		source_book: "Rift Ascendant Canon",
		description:
			"A light blade balanced for finesse strikes. Common in close-quarters Ascendant loadouts.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0017.webp",
		weight: 2,
		value: { currency: "gate", amount: 490 },
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
				"Pulled from the gear locker of a mid-rank Ascendant declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Sized for the wielder who finishes fights, not the one who starts them.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "utility", "shadow", "damage", "offensive", "melee"],
		theme_tags: ["modern-warfare", "dimensional-bleed"],
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
				fingerprint: "15a74871",
				payload_complete: true,
				uniqueness_seed: "item_p4_47::Mana-Infused Dagger",
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
					"Mana-Infused Dagger keys aetheric melee blade finesse rules through signature b7e9f74b.",
				role: "offense",
				signature: "b7e9f74b",
				theme: "aetheric",
			},
			passive_rules: [
				"+1 to attack rolls when you have advantage.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"+1 to Investigation and Insight checks while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"+1 to attack rolls when you have advantage.",
					"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p4_48",
		name: "Starlight Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-spec sidearm tuned for close-quarters work inside collapsed gates.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0730.webp",
		weight: 1,
		value: { currency: "gate", amount: 90 },
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
				fingerprint: "bd358b97",
				payload_complete: true,
				uniqueness_seed: "item_p4_48::Starlight Revolver",
				variant_note: "Suppressed. Doesn't reveal your position when fired.",
			},
			formulas: {
				attack_roll: "d20 + AGI modifier + proficiency bonus",
				damage_roll: "1d8 + AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "firearm_pistol",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Starlight Revolver keys starlight firearm pistol rules through signature d92cc2a8.",
				role: "offense",
				signature: "d92cc2a8",
				theme: "starlight",
			},
			passive_rules: [
				"Suppressed. Doesn't reveal your position when fired.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"+1 to attack rolls when at full HP.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "radiant",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Suppressed. Doesn't reveal your position when fired.",
					"+1d4 radiant damage on the first hit each round against an Anomaly.",
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
				range: "Ranged (30/90)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p4_49",
		name: "High-Grade Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A neutralizing agent calibrated for gate-acquired contamination.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0059.webp",
		weight: 5,
		value: { currency: "crystal", amount: 2140 },
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
						"Action. Cures one mana-class condition (mana-burn, lattice-bleed, channel-lock).",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "0596204e",
				payload_complete: true,
				uniqueness_seed: "item_p4_49::High-Grade Aetheric Antidote",
				variant_note:
					"Cures one mana-class condition (mana-burn, lattice-bleed, channel-lock).",
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
					"High-Grade Aetheric Antidote keys aetheric consumable purifier rules through signature 0b7ab4b2.",
				role: "consumable",
				signature: "0b7ab4b2",
				theme: "aetheric",
			},
			passive_rules: [
				"Cures one mana-class condition (mana-burn, lattice-bleed, channel-lock).",
			],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule:
					"Action. Cures one mana-class condition (mana-burn, lattice-bleed, channel-lock).",
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
];
