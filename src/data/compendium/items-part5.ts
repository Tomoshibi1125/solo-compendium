import type { Item } from "./items";

export const items_part5: Item[] = [
	{
		id: "item_p5_0",
		name: "Obsidian Gauntlets",
		description:
			"Field-issued combat gauntlets for Striker-class Ascendants and tactical brawlers.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0164.webp",
		weight: 8,
		value: 126,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d6",
		damage_type: "necrotic",
		simple_properties: ["light", "striker"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "necrotic",
			},
		},
		effects: {
			passive: [
				"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
				"+1d4 damage when attacking from an unseen position.",
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
				"Issued from the Bureau's mid-tier Ascendant requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Carried by people who know the difference between a kill and a survival.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: [
			"equipment",
			"psychic",
			"single-target",
			"defensive",
			"stealth",
			"melee",
		],
		theme_tags: ["dungeon-core", "urban-combat"],
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
				fingerprint: "36403bd8",
				payload_complete: true,
				uniqueness_seed: "item_p5_0::Obsidian Gauntlets",
				variant_note:
					"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d6 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_gauntlet",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Obsidian Gauntlets keys shadow melee gauntlet rules through signature 1f3c3c48.",
				role: "offense",
				signature: "1f3c3c48",
				theme: "shadow",
			},
			passive_rules: [
				"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
				"+1d4 damage when attacking from an unseen position.",
				"Once per short rest, reroll a missed attack roll.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
					"+1d4 damage when attacking from an unseen position.",
					"Once per short rest, reroll a missed attack roll.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_1",
		name: "Abyssal Whip",
		description:
			"A finesse reach weapon — surprising on first contact, devastating with practice.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0021.webp",
		weight: 1,
		value: 84,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "necrotic",
		simple_properties: ["finesse", "reach"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "necrotic",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Logged in over a hundred E-to-C clears before being adopted as a quartermaster default.",
			origin: "Recovered from a Bureau-cleared safehouse during a Guild raid.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "debuff", "support", "melee"],
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
				fingerprint: "31866f64",
				payload_complete: true,
				uniqueness_seed: "item_p5_1::Abyssal Whip",
				variant_note: "Reach: melee attacks have 10 ft. range.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus",
				damage_roll: "1d4 + STR or AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_whip",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Abyssal Whip keys void melee whip rules through signature 10361ab8.",
				role: "offense",
				signature: "10361ab8",
				theme: "void",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"+1 to Investigation and Insight checks while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d4 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Reach: melee attacks have 10 ft. range.",
					"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
					"+1 to Investigation and Insight checks while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_2",
		name: "Unstable Liquid Shadow",
		description:
			"A pocket-sized recovery potion. Standard kit for any Ascendant on assignment.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0690.webp",
		weight: 4,
		value: 225,
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
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Issued to a B-rank Ascendant on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Bureau's standard answer to 'how are we still alive?'",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "buff", "offensive", "consumable"],
		theme_tags: ["experimental", "mana-overflow", "gate-zone"],
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
				uniqueness_seed: "item_p5_2::Unstable Liquid Shadow",
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
					"Unstable Liquid Shadow keys shadow consumable potion rules through signature 6990b635.",
				role: "consumable",
				signature: "6990b635",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_3",
		name: "Mana-Infused Whip",
		description:
			"A control-class weapon for Ascendants who prefer winning fights without finishing them.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0019.webp",
		weight: 3,
		value: 398,
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
				"+5 ft. to your speed while wielding this item.",
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
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip.",
		tags: ["equipment", "burst", "damage", "melee"],
		theme_tags: ["system-glitch", "guild-ops", "regent-era"],
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
				fingerprint: "9e822693",
				payload_complete: true,
				uniqueness_seed: "item_p5_3::Mana-Infused Whip",
				variant_note: "Reach: melee attacks have 10 ft. range.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus",
				damage_roll: "1d4 + STR or AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_whip",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Mana-Infused Whip keys aetheric melee whip rules through signature f6c49f85.",
				role: "offense",
				signature: "f6c49f85",
				theme: "aetheric",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+5 ft. to your speed while wielding this item.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d4 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Reach: melee attacks have 10 ft. range.",
					"While attuned, gain +1 to spell-attack rolls.",
					"+5 ft. to your speed while wielding this item.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_4",
		name: "Aetheric Gauntlets",
		description:
			"A reinforced gauntlet that turns unarmed strikes into solid kinetic blows.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0752.webp",
		weight: 6,
		value: 119,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d6",
		damage_type: "force",
		simple_properties: ["light", "striker"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "force",
			},
		},
		effects: {
			passive: [
				"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
				"While attuned, gain +1 to spell-attack rolls.",
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
				"Looted from a mid-rank Anomaly nest cleared by Strike Team Echo.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "defensive", "fire", "lightning", "utility", "melee"],
		theme_tags: ["rift-energy", "system-glitch"],
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
				fingerprint: "31010b45",
				payload_complete: true,
				uniqueness_seed: "item_p5_4::Aetheric Gauntlets",
				variant_note:
					"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d6 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_gauntlet",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aetheric Gauntlets keys aetheric melee gauntlet rules through signature 7960c348.",
				role: "offense",
				signature: "7960c348",
				theme: "aetheric",
			},
			passive_rules: [
				"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1 to one save of your choice while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
					"While attuned, gain +1 to spell-attack rolls.",
					"+1 to one save of your choice while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_5",
		name: "Starlight Gauntlets",
		description:
			"A pair of impact gauntlets shaped for clinch fighting inside cramped gate corridors.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0481.webp",
		weight: 6,
		value: 296,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d4",
		damage_type: "radiant",
		simple_properties: ["light", "striker", "arcane focus"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "radiant",
			},
		},
		effects: {
			passive: [
				"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
				"On a critical hit, target is Blinded until the end of its next turn.",
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
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "sustained", "burst", "support", "melee"],
		theme_tags: ["guild-ops", "survival", "experimental"],
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
				fingerprint: "abeb78ba",
				payload_complete: true,
				uniqueness_seed: "item_p5_5::Starlight Gauntlets",
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
					"Starlight Gauntlets keys starlight melee gauntlet rules through signature 9e9644ba.",
				role: "offense",
				signature: "9e9644ba",
				theme: "starlight",
			},
			passive_rules: [
				"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
				"On a critical hit, target is Blinded until the end of its next turn.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "radiant",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d4 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
					"On a critical hit, target is Blinded until the end of its next turn.",
					"On a hit against a Frightened creature, deal +1d4 damage.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_6",
		name: "Purified Stamina Stim",
		description: "A Bureau-stamped emergency injector. Last-resort kit.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0254.webp",
		weight: 2,
		value: 431,
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
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Logged into the Ascendant Bureau's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: [
			"equipment",
			"control",
			"offensive",
			"healing",
			"fire",
			"consumable",
		],
		theme_tags: ["elite-tier", "gate-zone", "experimental"],
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
				uniqueness_seed: "item_p5_6::Purified Stamina Stim",
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
					"Purified Stamina Stim keys standard consumable stim rules through signature 56db32a5.",
				role: "consumable",
				signature: "56db32a5",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_7",
		name: "Aegis Trench Coat",
		description:
			"A multi-layer combat coat woven from impact-resistant fabric.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0767.webp",
		weight: 6,
		value: 382,
		item_type: "armor",
		armor_class: "11 + AGI modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"On a kill with this item, gain 1d4 temporary HP.",
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
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: [
			"equipment",
			"perception",
			"burst",
			"single-target",
			"control",
			"armor",
		],
		theme_tags: ["shadow-domain", "ancient-power", "system-glitch"],
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
				fingerprint: "f0284043",
				payload_complete: true,
				uniqueness_seed: "item_p5_7::Aegis Trench Coat",
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
					"Aegis Trench Coat keys standard armor light rules through signature 6f605eca.",
				role: "defense",
				signature: "6f605eca",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
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
					"Light, flexible armor weave. Standard kit for fast movers.",
					"On a kill with this item, gain 1d4 temporary HP.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_8",
		name: "Shadow Combat Vest",
		description: "A Stalker-class light armor sized for extended gate sweeps.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0708.webp",
		weight: 8,
		value: 322,
		item_type: "armor",
		armor_class: "12 + AGI modifier",
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
				"Earned a footnote in the Ascendant Bureau's quarterly equipment audit.",
			origin:
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "mobility", "offensive", "armor"],
		theme_tags: ["survival", "gate-zone", "elite-tier"],
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
				fingerprint: "58096af4",
				payload_complete: true,
				uniqueness_seed: "item_p5_8::Shadow Combat Vest",
				variant_note: "Reinforced light armor. AC 12 + AGI.",
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
					"Shadow Combat Vest keys shadow armor light rules through signature 4168f705.",
				role: "defense",
				signature: "4168f705",
				theme: "shadow",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"Disadvantage on attacks against you while you are obscured.",
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
					"Reinforced light armor. AC 12 + AGI.",
					"Disadvantage on attacks against you while you are obscured.",
					"Add +1d4 damage when target is below half HP.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_9",
		name: "Guild-Standard Aetheric Antidote",
		description:
			"A purifier vial labeled with the Bureau's medical-clearance stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0565.webp",
		weight: 1,
		value: 366,
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
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Recovered from a Guild's deep-storage archive after a leadership audit.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: [
			"equipment",
			"debuff",
			"offensive",
			"damage",
			"sustained",
			"consumable",
		],
		theme_tags: ["system-glitch", "dimensional-bleed"],
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
				uniqueness_seed: "item_p5_9::Guild-Standard Aetheric Antidote",
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
					"Guild-Standard Aetheric Antidote keys aetheric consumable purifier rules through signature 76b4e8eb.",
				role: "consumable",
				signature: "76b4e8eb",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_10",
		name: "Greater Mana Elixir",
		description:
			"A clear-glass restorative phial sealed with a Bureau quartermaster stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0085.webp",
		weight: 7,
		value: 245,
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
				"Quietly stockpiled by the Ascendant Bureau after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "One dose. Make it count.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "damage", "defensive", "consumable"],
		theme_tags: ["rift-energy", "ancient-power"],
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
				uniqueness_seed: "item_p5_10::Greater Mana Elixir",
				variant_note:
					"Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.",
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
					"Greater Mana Elixir keys aetheric consumable potion rules through signature 80ae791a.",
				role: "consumable",
				signature: "80ae791a",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_11",
		name: "Aegis Bracers",
		description:
			"A wrist-worn focus and protective plate combined into one piece.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0228.webp",
		weight: 3,
		value: 417,
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
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Boring kit. Boring kit comes home.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: [
			"equipment",
			"radiant",
			"lightning",
			"burst",
			"healing",
			"armor",
			"gear",
		],
		theme_tags: ["urban-combat", "system-glitch", "dungeon-core"],
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
				uniqueness_seed: "item_p5_11::Aegis Bracers",
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
					"Aegis Bracers keys standard gear bracer rules through signature 2b130b43.",
				role: "utility",
				signature: "2b130b43",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_12",
		name: "Phantom Tactical Helmet",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0859.webp",
		weight: 5,
		value: 96,
		item_type: "armor",
		armor_class: "11 + AGI modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
				"+1 to one save of your choice while attuned.",
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
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: [
			"equipment",
			"debuff",
			"single-target",
			"perception",
			"ice",
			"armor",
		],
		theme_tags: ["black-market", "guild-ops", "rift-energy"],
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
				fingerprint: "30391427",
				payload_complete: true,
				uniqueness_seed: "item_p5_12::Phantom Tactical Helmet",
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
					"Phantom Tactical Helmet keys void armor headgear rules through signature 02d73bee.",
				role: "defense",
				signature: "02d73bee",
				theme: "void",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
				"+1 to one save of your choice while attuned.",
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
					"+1 to one save of your choice while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_13",
		name: "Gate-Forged Tactical Helmet",
		description: "Reinforced headgear with mana-treated impact lining.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0754.webp",
		weight: 4,
		value: 350,
		item_type: "armor",
		armor_class: "11 + AGI modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Showed up in pawn shops across three districts before the Bureau issued a recall.",
			origin:
				"Brokered to a Ascendant Bureau quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "burst", "radiant", "armor"],
		theme_tags: ["mana-overflow", "shadow-domain"],
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
				fingerprint: "81e32544",
				payload_complete: true,
				uniqueness_seed: "item_p5_13::Gate-Forged Tactical Helmet",
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
					"Gate-Forged Tactical Helmet keys standard armor headgear rules through signature 5eed3c35.",
				role: "defense",
				signature: "5eed3c35",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
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
					"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
					"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_14",
		name: "Greater Health Potion",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0545.webp",
		weight: 5,
		value: 149,
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
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Forged in Bureau Forge Bay 12 from ichor-grade alloys harvested mid-clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Read the label. Then drink anyway.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "area", "shadow", "stealth", "consumable"],
		theme_tags: ["classified", "modern-warfare", "regent-era"],
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
				uniqueness_seed: "item_p5_14::Greater Health Potion",
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
					"Greater Health Potion keys standard consumable potion rules through signature 4a21aecf.",
				role: "consumable",
				signature: "4a21aecf",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_15",
		name: "Crimson Gauntlets",
		description:
			"A pair of impact gauntlets shaped for clinch fighting inside cramped gate corridors.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0816.webp",
		weight: 6,
		value: 20,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d4",
		damage_type: "slashing",
		simple_properties: ["light", "striker", "arcane focus"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "slashing",
			},
		},
		effects: {
			passive: [
				"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
				"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Quiet, until it isn't.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "support", "single-target", "control", "melee"],
		theme_tags: ["black-market", "modern-warfare"],
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
				fingerprint: "6083f155",
				payload_complete: true,
				uniqueness_seed: "item_p5_15::Crimson Gauntlets",
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
					"Crimson Gauntlets keys crimson melee gauntlet rules through signature f326bb36.",
				role: "offense",
				signature: "f326bb36",
				theme: "crimson",
			},
			passive_rules: [
				"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
				"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
				"+1 to Investigation and Insight checks while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "slashing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d4 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
					"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
					"+1 to Investigation and Insight checks while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_16",
		name: "Shattered Dagger",
		description: "A precision-balanced knife with a mana-treated edge.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0831.webp",
		weight: 2,
		value: 123,
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
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
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
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "single-target", "sustained", "melee"],
		theme_tags: ["guild-ops", "elite-tier", "dimensional-bleed"],
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
				fingerprint: "66ff38a1",
				payload_complete: true,
				uniqueness_seed: "item_p5_16::Shattered Dagger",
				variant_note: "Crit on 19-20.",
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
					"Shattered Dagger keys standard melee blade finesse rules through signature fce1b671.",
				role: "offense",
				signature: "fce1b671",
				theme: "standard",
			},
			passive_rules: [
				"Crit on 19-20.",
				"+1 to attack rolls against creatures within 5 ft. of an ally.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "piercing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Crit on 19-20.",
					"+1 to attack rolls against creatures within 5 ft. of an ally.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_17",
		name: "Guild-Standard Beast Repellent",
		description: "A field-issued potion. Bitter, fast-acting, reliable.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0294.webp",
		weight: 4,
		value: 339,
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
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "void", "defensive", "shadow", "damage", "consumable"],
		theme_tags: ["modern-warfare", "classified", "urban-combat"],
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
				uniqueness_seed: "item_p5_17::Guild-Standard Beast Repellent",
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
					"Guild-Standard Beast Repellent keys standard consumable potion rules through signature 7de957d8.",
				role: "consumable",
				signature: "7de957d8",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_18",
		name: "Aetheric Warhammer",
		description:
			"A reinforced sledge — for when an obstacle needs to stop being one.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0629.webp",
		weight: 5,
		value: 65,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d10",
		damage_type: "force",
		simple_properties: ["heavy", "two-handed"],
		properties: {
			weapon: {
				damage: "1d10",
				damage_type: "force",
			},
		},
		effects: {
			passive: [
				"On a hit, target makes a DC 13 Strength save or is knocked prone.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It rewards the steady, punishes the loud.",
		discovery_lore:
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "damage", "psychic", "shadow", "stealth", "melee"],
		theme_tags: ["rift-energy", "mana-overflow", "ascendant-bureau"],
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
				fingerprint: "ddf1c3bd",
				payload_complete: true,
				uniqueness_seed: "item_p5_18::Aetheric Warhammer",
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
					"Aetheric Warhammer keys aetheric melee bludgeon heavy rules through signature bae3c1b4.",
				role: "offense",
				signature: "bae3c1b4",
				theme: "aetheric",
			},
			passive_rules: [
				"On a hit, target makes a DC 13 Strength save or is knocked prone.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1 to Investigation and Insight checks while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"On a hit, target makes a DC 13 Strength save or is knocked prone.",
					"While attuned, gain +1 to spell-attack rolls.",
					"+1 to Investigation and Insight checks while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_19",
		name: "Aetheric Dagger",
		description: "A precision-balanced knife with a mana-treated edge.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0532.webp",
		weight: 6,
		value: 24,
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
					name: "Suppressive Volley",
					description:
						"As an action, force all creatures within a 15-ft. cone to make a DC 13 Agility save or take 2d6 damage of this weapon's type.",
					action: "action",
					dc: 13,
					frequency: "short-rest",
				},
			],
			passive: [
				"Crit on 19-20.",
				"On a hit, target loses 1 mana point (if any).",
				"Once per long rest, regain HP equal to half the damage dealt by a single hit.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Ascendants' survival.",
			origin:
				"Pulled from the gear locker of a mid-rank Ascendant declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "sustained", "necrotic", "melee"],
		theme_tags: ["mana-overflow", "black-market", "rift-energy"],
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
					name: "Suppressive Volley",
					description:
						"As an action, force all creatures within a 15-ft. cone to make a DC 13 Agility save or take 2d6 damage of this weapon's type.",
					action: "action",
					dc: 13,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "d7f49ec7",
				payload_complete: true,
				uniqueness_seed: "item_p5_19::Aetheric Dagger",
				variant_note: "Crit on 19-20.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus + 1",
				damage_roll: "1d6 + STR or AGI modifier + 1",
				recharge: "short-rest",
				save_dc: "DC 13",
			},
			identity: {
				rarity: "rare",
				archetype: "melee_blade_finesse",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aetheric Dagger keys aetheric melee blade finesse rules through signature 4943367f.",
				role: "offense",
				signature: "4943367f",
				theme: "aetheric",
			},
			passive_rules: [
				"Crit on 19-20.",
				"On a hit, target loses 1 mana point (if any).",
				"Once per long rest, regain HP equal to half the damage dealt by a single hit.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [
					{
						name: "Suppressive Volley",
						description:
							"As an action, force all creatures within a 15-ft. cone to make a DC 13 Agility save or take 2d6 damage of this weapon's type.",
						dc: 13,
					},
				],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Crit on 19-20.",
					"On a hit, target loses 1 mana point (if any).",
					"Once per long rest, regain HP equal to half the damage dealt by a single hit.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_20",
		name: "Abyssal Whip",
		description: "A weighted whip for trip, disarm, and grappling work.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0324.webp",
		weight: 6,
		value: 126,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "necrotic",
		simple_properties: ["finesse", "reach"],
		properties: {
			weapon: {
				damage: "1d4",
				damage_type: "necrotic",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Cited in two Bureau accident reports as 'performed within tolerance.'",
			origin:
				"Drew the eye of the Bureau quartermaster after surviving three consecutive gate clears.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Sized for the wielder who finishes fights, not the one who starts them.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "buff", "mobility", "control", "melee"],
		theme_tags: ["guild-ops", "modern-warfare"],
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
				fingerprint: "764ac35e",
				payload_complete: true,
				uniqueness_seed: "item_p5_20::Abyssal Whip",
				variant_note: "Reach: melee attacks have 10 ft. range.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus",
				damage_roll: "1d4 + STR or AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_whip",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Abyssal Whip keys void melee whip rules through signature 7635bc8f.",
				role: "offense",
				signature: "7635bc8f",
				theme: "void",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d4 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Reach: melee attacks have 10 ft. range.",
					"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
					"Once per long rest, when you take damage, you may halve it as a reaction.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_21",
		name: "Shadow Tactical Helmet",
		description: "Reinforced headgear with mana-treated impact lining.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0181.webp",
		weight: 7,
		value: 500,
		item_type: "armor",
		armor_class: "11 + AGI modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Reinforced headgear. Advantage on saves vs. concussive impacts.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"+5 ft. to your speed while wielding this item.",
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
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip.",
		tags: ["equipment", "debuff", "utility", "armor"],
		theme_tags: ["ascendant-bureau", "rift-energy", "guild-ops"],
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
				fingerprint: "9181dd63",
				payload_complete: true,
				uniqueness_seed: "item_p5_21::Shadow Tactical Helmet",
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
					"Shadow Tactical Helmet keys shadow armor headgear rules through signature 0f52581d.",
				role: "defense",
				signature: "0f52581d",
				theme: "shadow",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Reinforced headgear. Advantage on saves vs. concussive impacts.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"+5 ft. to your speed while wielding this item.",
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
					"Advantage on Stealth checks made in dim light or darkness.",
					"+5 ft. to your speed while wielding this item.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_22",
		name: "Crimson Sniper Rifle",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0850.webp",
		weight: 1,
		value: 141,
		item_type: "weapon",
		weapon_type: "martial ranged",
		damage: "1d8",
		damage_type: "slashing",
		simple_properties: ["ammunition", "two-handed", "burst-fire"],
		range: "Ranged (60/180)",
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "slashing",
				range: 60,
			},
		},
		effects: {
			passive: [
				"Auto-rifle. Burst-fire (3 rd, +1d6) on a single attack.",
				"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
				"+1 to initiative rolls while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Saw use in two named clears and one unnamed one no one talks about.",
			origin:
				"Issued from the Bureau's mid-tier Ascendant requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "single-target", "ice", "necrotic", "firearm"],
		theme_tags: ["modern-warfare", "rift-energy"],
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
				fingerprint: "cbad9abb",
				payload_complete: true,
				uniqueness_seed: "item_p5_22::Crimson Sniper Rifle",
				variant_note: "Auto-rifle. Burst-fire (3 rd, +1d6) on a single attack.",
			},
			formulas: {
				attack_roll: "d20 + AGI modifier + proficiency bonus",
				damage_roll: "1d8 + AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "firearm_rifle",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Crimson Sniper Rifle keys crimson firearm rifle rules through signature bc6a627c.",
				role: "offense",
				signature: "bc6a627c",
				theme: "crimson",
			},
			passive_rules: [
				"Auto-rifle. Burst-fire (3 rd, +1d6) on a single attack.",
				"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
				"+1 to initiative rolls while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "slashing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Auto-rifle. Burst-fire (3 rd, +1d6) on a single attack.",
					"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
					"+1 to initiative rolls while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: false,
			},
			targeting: {
				range: "Ranged (60/180)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p5_23",
		name: "Nano-Weave Spaulders",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0955.webp",
		weight: 6,
		value: 286,
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
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Ascendants' survival.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Pulled out of a sealed cache during a Guild succession dispute.",
		tags: ["equipment", "single-target", "stealth", "armor"],
		theme_tags: ["classified", "mana-overflow"],
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
				fingerprint: "9437a9f3",
				payload_complete: true,
				uniqueness_seed: "item_p5_23::Nano-Weave Spaulders",
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
					"Nano-Weave Spaulders keys standard armor heavy rules through signature 5ff4c621.",
				role: "defense",
				signature: "5ff4c621",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
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
					"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_24",
		name: "Abyssal Whip",
		description:
			"A reinforced whip used by control-style Ascendants to disarm and entangle.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0640.webp",
		weight: 6,
		value: 451,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d6",
		damage_type: "necrotic",
		simple_properties: ["finesse", "reach"],
		properties: {
			weapon: {
				damage: "1d6",
				damage_type: "necrotic",
				finesse: true,
			},
		},
		effects: {
			passive: [
				"Reach. On a hit, target makes a DC 11 Agility save or is pulled 5 ft. toward you.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
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
				"Pulled from the gear locker of a mid-rank Ascendant declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "shadow", "lightning", "melee"],
		theme_tags: ["classified", "regent-era"],
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
				fingerprint: "b01a90b4",
				payload_complete: true,
				uniqueness_seed: "item_p5_24::Abyssal Whip",
				variant_note:
					"Reach. On a hit, target makes a DC 11 Agility save or is pulled 5 ft. toward you.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus",
				damage_roll: "1d6 + STR or AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_whip",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Abyssal Whip keys void melee whip rules through signature 6804167b.",
				role: "offense",
				signature: "6804167b",
				theme: "void",
			},
			passive_rules: [
				"Reach. On a hit, target makes a DC 11 Agility save or is pulled 5 ft. toward you.",
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
				"+5 ft. to your speed while wielding this item.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Reach. On a hit, target makes a DC 11 Agility save or is pulled 5 ft. toward you.",
					"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
					"+5 ft. to your speed while wielding this item.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_25",
		name: "Nano-Weave Combat Vest",
		description: "A Stalker-class light armor sized for extended gate sweeps.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0625.webp",
		weight: 1,
		value: 117,
		item_type: "armor",
		armor_class: "12 + AGI modifier",
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
				"Shifted between three Bureau quartermaster depots over a five-year period.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "support", "perception", "armor"],
		theme_tags: ["black-market", "urban-combat", "dungeon-core"],
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
				fingerprint: "4f1df573",
				payload_complete: true,
				uniqueness_seed: "item_p5_25::Nano-Weave Combat Vest",
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
					"Nano-Weave Combat Vest keys standard armor light rules through signature e5ab6943.",
				role: "defense",
				signature: "e5ab6943",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"+1 to attack rolls when at full HP.",
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
					"+1 to attack rolls when at full HP.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_26",
		name: "Vanguard Exo-Suit",
		description:
			"A compact tactical layer designed for fast movers operating inside C-rank gates.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0398.webp",
		weight: 1,
		value: 435,
		item_type: "armor",
		armor_class: "12 + AGI modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
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
				"Pulled from the gear locker of a mid-rank Ascendant declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "stealth", "ice", "burst", "armor"],
		theme_tags: ["regent-era", "rift-energy"],
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
				fingerprint: "c1590f47",
				payload_complete: true,
				uniqueness_seed: "item_p5_26::Vanguard Exo-Suit",
				variant_note: "Reinforced light armor. AC 12 + AGI.",
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
					"Vanguard Exo-Suit keys standard armor light rules through signature 50677b25.",
				role: "defense",
				signature: "50677b25",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "12 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 12 + AGI modifier.",
					"Reinforced light armor. AC 12 + AGI.",
					"On a hit against a Frightened creature, deal +1d4 damage.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_27",
		name: "Nano-Weave Breastplate",
		description:
			"A full-coverage heavy carapace built for vanguard tanks holding gate breaches.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0911.webp",
		weight: 7,
		value: 295,
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
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "stealth", "fire", "armor"],
		theme_tags: ["urban-combat", "elite-tier"],
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
				uniqueness_seed: "item_p5_27::Nano-Weave Breastplate",
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
					"Nano-Weave Breastplate keys standard armor heavy rules through signature 3d7bd811.",
				role: "defense",
				signature: "3d7bd811",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_28",
		name: "Shattered Longsword",
		description:
			"A reliable mid-weight blade — the kind every Ascendant learns on, and many never replace.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0812.webp",
		weight: 4,
		value: 383,
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
				"Was once misattributed in a post-clear report; the correction is still in the record.",
			origin:
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "What survives a Ascendant's tour usually outlives the Ascendant.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "control", "defensive", "radiant", "utility", "melee"],
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
				fingerprint: "d551ca6d",
				payload_complete: true,
				uniqueness_seed: "item_p5_28::Shattered Longsword",
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
					"Shattered Longsword keys standard melee blade versatile rules through signature 8ebd252f.",
				role: "offense",
				signature: "8ebd252f",
				theme: "standard",
			},
			passive_rules: [
				"When wielded two-handed, +1 to damage rolls.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
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
					"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_29",
		name: "Lesser Health Potion",
		description:
			"A regulated alchemical compound. Restores hit points on consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0669.webp",
		weight: 8,
		value: 425,
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
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "shadow", "necrotic", "burst", "consumable"],
		theme_tags: ["guild-ops", "elite-tier", "dungeon-core"],
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
				uniqueness_seed: "item_p5_29::Lesser Health Potion",
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
					"Lesser Health Potion keys standard consumable potion rules through signature b0191a57.",
				role: "consumable",
				signature: "b0191a57",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_30",
		name: "Aether-Plated Combat Vest",
		description:
			"Modern light armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0007.webp",
		weight: 2,
		value: 273,
		item_type: "armor",
		armor_class: "11 + AGI modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Resistance to force damage.",
				"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Made a brief appearance in a guild quartermaster's leaving inventory dispute.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "single-target", "void", "sustained", "armor"],
		theme_tags: ["experimental", "gate-zone"],
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
				fingerprint: "d1fcf5b7",
				payload_complete: true,
				uniqueness_seed: "item_p5_30::Aether-Plated Combat Vest",
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
					"Aether-Plated Combat Vest keys aetheric armor light rules through signature d243a3a6.",
				role: "defense",
				signature: "d243a3a6",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Resistance to force damage.",
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
					"Resistance to force damage.",
					"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_31",
		name: "Lesser Mana Elixir",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0270.webp",
		weight: 3,
		value: 462,
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
				"Issued from the Bureau's mid-tier Ascendant requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "damage", "void", "consumable"],
		theme_tags: ["regent-era", "urban-combat"],
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
				uniqueness_seed: "item_p5_31::Lesser Mana Elixir",
				variant_note: "Grants 5 + Vitality temporary HP for 10 minutes.",
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
					"Lesser Mana Elixir keys aetheric consumable potion rules through signature f99230fd.",
				role: "consumable",
				signature: "f99230fd",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_32",
		name: "Shattered Halberd",
		description:
			"A balanced spear with a reinforced shaft and mana-conductive head.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0481.webp",
		weight: 6,
		value: 340,
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
				"Crit on 19-20 against gate-spawned creatures.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Briefly classified for export until the Guild Inspectors lifted the embargo.",
			origin:
				"Hand-built in a clandestine Daejeon workshop and sold through the gray market.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Tagged at the gate seal during the Bureau's standard cataloging sweep.",
		tags: ["equipment", "psychic", "stealth", "burst", "utility", "melee"],
		theme_tags: ["guild-ops", "shadow-domain", "mana-overflow"],
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
				fingerprint: "ba2db3a3",
				payload_complete: true,
				uniqueness_seed: "item_p5_32::Shattered Halberd",
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
					"Shattered Halberd keys standard melee polearm rules through signature 03e2d6bf.",
				role: "offense",
				signature: "03e2d6bf",
				theme: "standard",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "piercing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Reach: melee attacks have 10 ft. range.",
					"Crit on 19-20 against gate-spawned creatures.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_33",
		name: "Nano-Weave Spaulders",
		description:
			"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0776.webp",
		weight: 2,
		value: 167,
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
				"Brokered to a Ascendant Bureau quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "healing", "buff", "psychic", "armor"],
		theme_tags: ["regent-era", "rift-energy", "mana-overflow"],
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
				fingerprint: "33d59d41",
				payload_complete: true,
				uniqueness_seed: "item_p5_33::Nano-Weave Spaulders",
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
					"Nano-Weave Spaulders keys standard armor heavy rules through signature 44a25022.",
				role: "defense",
				signature: "44a25022",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Reinforced carapace. AC 16. Stealth disadvantage.",
				"+1 to one save of your choice while attuned.",
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
					"+1 to one save of your choice while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_34",
		name: "Obsidian Dagger",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0035.webp",
		weight: 8,
		value: 284,
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
				"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
				"On a hit, target's speed is reduced by 5 ft. until the start of your next turn.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "buff", "psychic", "sustained", "melee"],
		theme_tags: ["mana-overflow", "guild-ops"],
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
				fingerprint: "460c33da",
				payload_complete: true,
				uniqueness_seed: "item_p5_34::Obsidian Dagger",
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
					"Obsidian Dagger keys shadow melee blade finesse rules through signature b35cfeb6.",
				role: "offense",
				signature: "b35cfeb6",
				theme: "shadow",
			},
			passive_rules: [
				"Crit on 19-20.",
				"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
				"On a hit, target's speed is reduced by 5 ft. until the start of your next turn.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [
					{
						name: "Disengaging Strike",
						description:
							"As an action, make a weapon attack and immediately move up to your speed without provoking opportunity attacks.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Crit on 19-20.",
					"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
					"On a hit, target's speed is reduced by 5 ft. until the start of your next turn.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_35",
		name: "Nano-Weave Tactical Helmet",
		description: "Bureau-issued head protection, lightweight and fitted.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0970.webp",
		weight: 5,
		value: 291,
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
				"Reinforced headgear. Advantage on saves vs. concussive impacts.",
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
				"Issued from the Bureau's mid-tier Ascendant requisition channel after standard certification.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "debuff", "void", "defensive", "armor"],
		theme_tags: ["guild-ops", "elite-tier"],
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
				fingerprint: "585b3a58",
				payload_complete: true,
				uniqueness_seed: "item_p5_35::Nano-Weave Tactical Helmet",
				variant_note:
					"Reinforced headgear. Advantage on saves vs. concussive impacts.",
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
					"Nano-Weave Tactical Helmet keys standard armor headgear rules through signature fc101c4f.",
				role: "defense",
				signature: "fc101c4f",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced headgear. Advantage on saves vs. concussive impacts.",
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
					"Reinforced headgear. Advantage on saves vs. concussive impacts.",
					"Critical hits with this item ignore resistance to its damage type.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_36",
		name: "Abyssal Spear",
		description: "A reach weapon used by Bureau gate-line teams.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0037.webp",
		weight: 8,
		value: 171,
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
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "radiant", "void", "debuff", "melee"],
		theme_tags: ["dungeon-core", "ancient-power"],
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
				fingerprint: "cbf05c86",
				payload_complete: true,
				uniqueness_seed: "item_p5_36::Abyssal Spear",
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
					"Abyssal Spear keys void melee polearm rules through signature c96bc281.",
				role: "offense",
				signature: "c96bc281",
				theme: "void",
			},
			passive_rules: [
				"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "2d4 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
					"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
					"On a critical hit, regain 1 HP per Hit Die spent today.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_37",
		name: "Lattice-Scale Exo-Suit",
		description:
			"A flexible mana-weave layer that beads ichor and shrugs off minor concussive impacts.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0180.webp",
		weight: 3,
		value: 416,
		item_type: "armor",
		armor_class: "11 + AGI modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Resistance to force damage.",
				"+5 ft. to your speed while wielding this item.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Used in a controlled recovery operation that became the Bureau's textbook example.",
			origin:
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It won't make you faster. It'll just make sure you walk out.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "stealth", "lightning", "defensive", "armor"],
		theme_tags: ["experimental", "system-glitch"],
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
				fingerprint: "dc0b8d53",
				payload_complete: true,
				uniqueness_seed: "item_p5_37::Lattice-Scale Exo-Suit",
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
					"Lattice-Scale Exo-Suit keys aetheric armor light rules through signature c634e9da.",
				role: "defense",
				signature: "c634e9da",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Resistance to force damage.",
				"+5 ft. to your speed while wielding this item.",
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
					"Resistance to force damage.",
					"+5 ft. to your speed while wielding this item.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_38",
		name: "Unstable Beast Repellent",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0295.webp",
		weight: 4,
		value: 77,
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
				"Featured in a Bureau training video as an example of safe field maintenance.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Shelf life is a guideline. Trust the cap, not the date.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "void", "defensive", "consumable"],
		theme_tags: ["dungeon-core", "post-awakening", "elite-tier"],
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
				uniqueness_seed: "item_p5_38::Unstable Beast Repellent",
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
					"Unstable Beast Repellent keys standard consumable potion rules through signature 9d23ca00.",
				role: "consumable",
				signature: "9d23ca00",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_39",
		name: "Phantom Breastplate",
		description:
			"A full-coverage heavy carapace built for vanguard tanks holding gate breaches.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0814.webp",
		weight: 1,
		value: 458,
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
				"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
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
				"Logged into the Ascendant Bureau's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau artificers who've patched real wounds.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: [
			"equipment",
			"single-target",
			"support",
			"healing",
			"psychic",
			"armor",
		],
		theme_tags: ["gate-zone", "dimensional-bleed"],
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
				fingerprint: "67953e8e",
				payload_complete: true,
				uniqueness_seed: "item_p5_39::Phantom Breastplate",
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
					"Phantom Breastplate keys void armor heavy rules through signature 24195b52.",
				role: "defense",
				signature: "24195b52",
				theme: "void",
			},
			passive_rules: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Reinforced carapace. AC 16. Stealth disadvantage.",
				"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
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
					"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
					"Once per long rest, you may make one weapon attack as a bonus action.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_40",
		name: "Ceramic Shin Guards",
		description:
			"A reinforced kevlar-and-mana-weave layer. Cheap, common, effective.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0350.webp",
		weight: 6,
		value: 169,
		item_type: "armor",
		armor_class: "12 + AGI modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"+1 to attack rolls when at full HP.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Constructed in Bureau-affiliated ateliers from gate-recovered raw materials.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "ice", "stealth", "debuff", "armor"],
		theme_tags: ["forbidden", "shadow-domain", "survival"],
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
				fingerprint: "17fcf2eb",
				payload_complete: true,
				uniqueness_seed: "item_p5_40::Ceramic Shin Guards",
				variant_note: "Reinforced light armor. AC 12 + AGI.",
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
					"Ceramic Shin Guards keys standard armor light rules through signature fdaf5ab9.",
				role: "defense",
				signature: "fdaf5ab9",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"+1 to attack rolls when at full HP.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "12 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 12 + AGI modifier.",
					"Reinforced light armor. AC 12 + AGI.",
					"+1 to attack rolls when at full HP.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_41",
		name: "Greater Stamina Stim",
		description: "A pre-measured combat stim with Bureau-coded markings.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0087.webp",
		weight: 2,
		value: 107,
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
				"Saw heavy rotation among second-strike teams during the Busan Incident.",
			origin:
				"Crafted by a defector ex-Guild forgewright operating out of a Manila workshop.",
			personality: "",
			prior_owners: [],
		},
		flavor: "For the part of the fight that comes after the fight.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "perception", "burst", "control", "consumable"],
		theme_tags: ["dimensional-bleed", "rift-energy", "dungeon-core"],
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
				uniqueness_seed: "item_p5_41::Greater Stamina Stim",
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
					"Greater Stamina Stim keys standard consumable stim rules through signature 80ebcafa.",
				role: "consumable",
				signature: "80ebcafa",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_42",
		name: "Lesser Liquid Shadow",
		description:
			"A regulated alchemical compound. Restores hit points on consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0872.webp",
		weight: 7,
		value: 209,
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
				"Logged into the Ascendant Bureau's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "The Bureau's standard answer to 'how are we still alive?'",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "stealth", "support", "consumable"],
		theme_tags: ["urban-combat", "survival", "post-awakening"],
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
				uniqueness_seed: "item_p5_42::Lesser Liquid Shadow",
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
					"Lesser Liquid Shadow keys shadow consumable potion rules through signature e4613411.",
				role: "consumable",
				signature: "e4613411",
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
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_43",
		name: "Aetheric Warhammer",
		description:
			"A demolition-grade hammer with reinforced grip and a mana-stable striking surface.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0601.webp",
		weight: 5,
		value: 497,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d12",
		damage_type: "force",
		simple_properties: ["heavy", "two-handed"],
		properties: {
			weapon: {
				damage: "1d12",
				damage_type: "force",
			},
		},
		effects: {
			passive: [
				"Crit on 19-20. Critical hits push target 5 ft.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1 to Investigation and Insight checks while attuned.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Noted in the official record as 'standard issue' for second-line Bureau auxiliaries.",
			origin:
				"Pulled from a foreign Guild's stockpile after a cooperation agreement was signed.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Quiet, until it isn't.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip.",
		tags: ["equipment", "perception", "sustained", "melee"],
		theme_tags: ["elite-tier", "forbidden"],
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
				fingerprint: "7d2dec6f",
				payload_complete: true,
				uniqueness_seed: "item_p5_43::Aetheric Warhammer",
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
					"Aetheric Warhammer keys aetheric melee bludgeon heavy rules through signature 0841d500.",
				role: "offense",
				signature: "0841d500",
				theme: "aetheric",
			},
			passive_rules: [
				"Crit on 19-20. Critical hits push target 5 ft.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1 to Investigation and Insight checks while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d12 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Crit on 19-20. Critical hits push target 5 ft.",
					"While attuned, gain +1 to spell-attack rolls.",
					"+1 to Investigation and Insight checks while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_44",
		name: "Aetheric Warhammer",
		description:
			"A massive impact weapon balanced for sweeping strikes and structural breaks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0810.webp",
		weight: 3,
		value: 177,
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
				"On a hit, target loses 1 mana point (if any).",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
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
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "offensive", "area", "lightning", "debuff", "melee"],
		theme_tags: ["forbidden", "modern-warfare", "shadow-domain"],
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
				fingerprint: "ae99a65f",
				payload_complete: true,
				uniqueness_seed: "item_p5_44::Aetheric Warhammer",
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
					"Aetheric Warhammer keys aetheric melee bludgeon heavy rules through signature 173fbff5.",
				role: "offense",
				signature: "173fbff5",
				theme: "aetheric",
			},
			passive_rules: [
				"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
				"On a hit, target loses 1 mana point (if any).",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "2d6 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
					"On a hit, target loses 1 mana point (if any).",
					"On a critical hit, regain 1 HP per Hit Die spent today.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_45",
		name: "Starlight Warhammer",
		description:
			"A massive impact weapon balanced for sweeping strikes and structural breaks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0139.webp",
		weight: 8,
		value: 482,
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
				"Crit on 19-20 against gate-spawned creatures.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Stamped at a Bureau forge in Incheon and field-tested in a B-rank clear.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: [
			"equipment",
			"single-target",
			"support",
			"psychic",
			"shadow",
			"melee",
		],
		theme_tags: ["post-awakening", "shadow-domain", "modern-warfare"],
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
				fingerprint: "2f15f060",
				payload_complete: true,
				uniqueness_seed: "item_p5_45::Starlight Warhammer",
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
					"Starlight Warhammer keys starlight melee bludgeon heavy rules through signature 268e51bf.",
				role: "offense",
				signature: "268e51bf",
				theme: "starlight",
			},
			passive_rules: [
				"On a hit, target makes a DC 13 Strength save or is knocked prone.",
				"On a critical hit, target is Blinded until the end of its next turn.",
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
					"On a hit, target makes a DC 13 Strength save or is knocked prone.",
					"On a critical hit, target is Blinded until the end of its next turn.",
					"Crit on 19-20 against gate-spawned creatures.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_46",
		name: "Ascendant's Katana",
		description:
			"A versatile blade — single-handed for speed, two-handed for finishing strokes.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0284.webp",
		weight: 1,
		value: 487,
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
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's killed before. It will again.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "psychic", "healing", "melee"],
		theme_tags: ["ascendant-bureau", "modern-warfare", "rift-energy"],
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
				fingerprint: "4481827f",
				payload_complete: true,
				uniqueness_seed: "item_p5_46::Ascendant's Katana",
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
					"Ascendant's Katana keys standard melee blade versatile rules through signature eaa90634.",
				role: "offense",
				signature: "eaa90634",
				theme: "standard",
			},
			passive_rules: [
				"When wielded two-handed, +1 to damage rolls.",
				"+1 to one save of your choice while attuned.",
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
					"+1 to one save of your choice while attuned.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_47",
		name: "Shadow Bracers",
		description:
			"A Bureau-issued forearm guard for Ascendants operating melee-forward.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0141.webp",
		weight: 8,
		value: 409,
		item_type: "tool",
		properties: {},
		effects: {
			passive: [
				"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Quietly stockpiled by the Ascendant Bureau after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Manufactured by a Bureau-licensed artificer cell operating under contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Small enough to forget. Big enough to matter when it counts.",
		discovery_lore:
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "necrotic", "stealth", "gear"],
		theme_tags: ["black-market", "mana-overflow"],
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
				fingerprint: "9433c099",
				payload_complete: true,
				uniqueness_seed: "item_p5_47::Shadow Bracers",
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
					"Shadow Bracers keys shadow gear bracer rules through signature 3a7fbff5.",
				role: "utility",
				signature: "3a7fbff5",
				theme: "shadow",
			},
			passive_rules: [
				"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				passive_effects: [
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
					"Advantage on Stealth checks made in dim light or darkness.",
					"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_48",
		name: "Aegis Trench Coat",
		description:
			"A compact tactical layer designed for fast movers operating inside C-rank gates.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0062.webp",
		weight: 2,
		value: 377,
		item_type: "armor",
		armor_class: "12 + AGI modifier",
		armor_type: "Light",
		properties: {},
		effects: {
			passive: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
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
				"Acquired from a Bureau-stamped supplier under a long-term contract.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Dents tell stories. Read them before you trust the wearer.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "fire", "healing", "necrotic", "armor"],
		theme_tags: ["ancient-power", "forbidden", "dimensional-bleed"],
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
				fingerprint: "2600abff",
				payload_complete: true,
				uniqueness_seed: "item_p5_48::Aegis Trench Coat",
				variant_note: "Reinforced light armor. AC 12 + AGI.",
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
					"Aegis Trench Coat keys standard armor light rules through signature 7b8dfe01.",
				role: "defense",
				signature: "7b8dfe01",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"Once per short rest, treat a single failed Vitality save as a success.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "12 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 12 + AGI modifier.",
					"Reinforced light armor. AC 12 + AGI.",
					"Once per short rest, treat a single failed Vitality save as a success.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
		id: "item_p5_49",
		name: "Starlight Longsword",
		description:
			"A balanced blade with a fuller groove that channels excess kinetic mana.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0575.webp",
		weight: 6,
		value: 49,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "radiant",
		simple_properties: ["versatile (1d10)"],
		properties: {
			weapon: {
				damage: "1d8",
				damage_type: "radiant",
				versatile: "1d10",
			},
		},
		effects: {
			passive: [
				"Counts as both slashing and piercing for resistance bypass.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
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
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip.",
		tags: ["equipment", "void", "support", "damage", "radiant", "melee"],
		theme_tags: ["survival", "regent-era"],
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
				fingerprint: "9661c468",
				payload_complete: true,
				uniqueness_seed: "item_p5_49::Starlight Longsword",
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
					"Starlight Longsword keys starlight melee blade versatile rules through signature 26fe005a.",
				role: "offense",
				signature: "26fe005a",
				theme: "starlight",
			},
			passive_rules: [
				"Counts as both slashing and piercing for resistance bypass.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "radiant",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Counts as both slashing and piercing for resistance bypass.",
					"+1d4 radiant damage on the first hit each round against an Anomaly.",
					"On a hit against a Frightened creature, deal +1d4 damage.",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: false,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, Ascendant Bureau, mana lattice, and anomaly terminology.",
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
