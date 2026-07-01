import type { Item } from "./items";

export const items_part3: Item[] = [
	{
		id: "item_p3_0",
		name: "Starlight Dagger",
		source_book: "Rift Ascendant Canon",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0548.webp",
		weight: 5,
		value: { currency: "gate", amount: 448 },
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d4",
		damage_type: "radiant",
		simple_properties: ["light", "finesse", "thrown"],
		range: "Thrown (20/60)",
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
				"Logged into the Ascendant Bureau's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Honest steel. The kind that never apologizes.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "single-target", "buff", "melee"],
		theme_tags: ["black-market", "dungeon-core", "classified"],
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
				fingerprint: "2e71b520",
				payload_complete: true,
				uniqueness_seed: "item_p3_0::Starlight Dagger",
				variant_note:
					"Off-hand attack on a hit deals +1 damage if you are wielding two weapons.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus",
				damage_roll: "1d4 + STR or AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "melee_blade_finesse",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Starlight Dagger keys starlight melee blade finesse rules through signature a6eddbba.",
				role: "offense",
				signature: "a6eddbba",
				theme: "starlight",
			},
			passive_rules: [
				"Off-hand attack on a hit deals +1 damage if you are wielding two weapons.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"Once per short rest, reroll a missed attack roll.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "radiant",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d4 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Off-hand attack on a hit deals +1 damage if you are wielding two weapons.",
					"+1d4 radiant damage on the first hit each round against an Anomaly.",
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
		id: "item_p3_1",
		name: "Void Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-spec sidearm tuned for close-quarters work inside collapsed gates.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0405.webp",
		weight: 5,
		value: { currency: "gate", amount: 345 },
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
				"Quietly stockpiled by the Ascendant Bureau after an A-rank cascade exposed gaps in standard kit.",
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
				fingerprint: "9d7cb0df",
				payload_complete: true,
				uniqueness_seed: "item_p3_1::Void Revolver",
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
					"Void Revolver keys void firearm pistol rules through signature b19eb28f.",
				role: "offense",
				signature: "b19eb28f",
				theme: "void",
			},
			passive_rules: [
				"Suppressed. Doesn't reveal your position when fired.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"+1 to one save of your choice while attuned.",
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
					"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
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
				range: "Ranged (30/90)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p3_2",
		name: "Lesser Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description: "A clear-glass cure compound suitable for field application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0042.webp",
		weight: 6,
		value: { currency: "crystal", amount: 3990 },
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
		theme_tags: ["ascendant-bureau", "mana-overflow"],
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
				uniqueness_seed: "item_p3_2::Lesser Aetheric Antidote",
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
					"Lesser Aetheric Antidote keys aetheric consumable purifier rules through signature 806cfe9f.",
				role: "consumable",
				signature: "806cfe9f",
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
		id: "item_p3_3",
		name: "Phantom Tactical Helmet",
		source_book: "Rift Ascendant Canon",
		description: "Reinforced headgear with mana-treated impact lining.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0147.webp",
		weight: 6,
		value: { currency: "gate", amount: 372 },
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
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Salvaged from a partially-collapsed gate during a recovery sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "defensive", "fire", "armor"],
		theme_tags: ["classified", "dungeon-core"],
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
				uniqueness_seed: "item_p3_3::Phantom Tactical Helmet",
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
					"Phantom Tactical Helmet keys void armor headgear rules through signature 6ef4cab6.",
				role: "defense",
				signature: "6ef4cab6",
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
		id: "item_p3_4",
		name: "Greater Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0880.webp",
		weight: 4,
		value: { currency: "crystal", amount: 4250 },
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
				"Procured through the Ascendant Bureau's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "psychic", "support", "consumable"],
		theme_tags: ["ancient-power", "post-awakening", "dimensional-bleed"],
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
				uniqueness_seed: "item_p3_4::Greater Liquid Shadow",
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
					"Greater Liquid Shadow keys shadow consumable potion rules through signature e5d36013.",
				role: "consumable",
				signature: "e5d36013",
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
		id: "item_p3_5",
		name: "Obsidian Gauntlets",
		source_book: "Rift Ascendant Canon",
		description: "Articulated combat gauntlets that double as a martial focus.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0865.webp",
		weight: 8,
		value: { currency: "gate", amount: 297 },
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
				fingerprint: "5d09384c",
				payload_complete: true,
				uniqueness_seed: "item_p3_5::Obsidian Gauntlets",
				variant_note: "Counts as an unarmed strike for Striker class features.",
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
					"Obsidian Gauntlets keys shadow melee gauntlet rules through signature 79d16fbf.",
				role: "offense",
				signature: "79d16fbf",
				theme: "shadow",
			},
			passive_rules: [
				"Counts as an unarmed strike for Striker class features.",
				"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
				"+5 ft. to your speed while wielding this item.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d4 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Counts as an unarmed strike for Striker class features.",
					"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p3_6",
		name: "Mana-Infused Warhammer",
		source_book: "Rift Ascendant Canon",
		description:
			"A heavy maul with a Bureau-stamped haft and a head heavy enough to dent gate steel.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0638.webp",
		weight: 8,
		value: { currency: "gate", amount: 459 },
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
		theme_tags: ["experimental", "shadow-domain", "ascendant-bureau"],
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
				fingerprint: "d0141205",
				payload_complete: true,
				uniqueness_seed: "item_p3_6::Mana-Infused Warhammer",
				variant_note:
					"On a hit, target makes a DC 13 Strength save or is knocked prone.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus + 1",
				damage_roll: "1d10 + STR modifier + 1",
				recharge: "short-rest",
				save_dc: "DC 13",
			},
			identity: {
				rarity: "rare",
				archetype: "melee_bludgeon_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Mana-Infused Warhammer keys aetheric melee bludgeon heavy rules through signature e9a5093e.",
				role: "offense",
				signature: "e9a5093e",
				theme: "aetheric",
			},
			passive_rules: [
				"On a hit, target makes a DC 13 Strength save or is knocked prone.",
				"While attuned, gain +1 to spell-attack rolls.",
				"+1d4 damage against creatures of the Anomaly tag.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [
					{
						name: "Lattice Pulse",
						description:
							"As an action, emit a 15-ft. cone pulse. Each creature in the cone makes a DC 13 Vitality save, taking 3d6 force damage on a fail (half on success).",
						dc: 13,
					},
				],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"On a hit, target makes a DC 13 Strength save or is knocked prone.",
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
		id: "item_p3_7",
		name: "Purified Stamina Stim",
		source_book: "Rift Ascendant Canon",
		description:
			"A medical stim packed for one-handed application during a fight.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0119.webp",
		weight: 5,
		value: { currency: "crystal", amount: 2660 },
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
				"Surfaced in the Ascendant Bureau's quartermaster log after a mid-tier extraction.",
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
				uniqueness_seed: "item_p3_7::Purified Stamina Stim",
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
					"Purified Stamina Stim keys standard consumable stim rules through signature 0b1b3e72.",
				role: "consumable",
				signature: "0b1b3e72",
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
		id: "item_p3_8",
		name: "Lesser Beast Repellent",
		source_book: "Rift Ascendant Canon",
		description:
			"A small flask of medicinal potion. Drink slow if you can. Drink fast if you can't.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0004.webp",
		weight: 7,
		value: { currency: "crystal", amount: 4150 },
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
				"Brokered to a Ascendant Bureau quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Triage in a glass. Don't waste it.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "ice", "void", "stealth", "consumable"],
		theme_tags: ["dungeon-core", "elite-tier", "shadow-domain"],
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
				uniqueness_seed: "item_p3_8::Lesser Beast Repellent",
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
					"Lesser Beast Repellent keys standard consumable potion rules through signature 6601e775.",
				role: "consumable",
				signature: "6601e775",
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
		id: "item_p3_9",
		name: "Abyssal Warhammer",
		source_book: "Rift Ascendant Canon",
		description:
			"A heavy two-handed crusher. Best used against fortified anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0893.webp",
		weight: 1,
		value: { currency: "gate", amount: 503 },
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
				fingerprint: "4c9acc3c",
				payload_complete: true,
				uniqueness_seed: "item_p3_9::Abyssal Warhammer",
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
					"Abyssal Warhammer keys void melee bludgeon heavy rules through signature e73dbabc.",
				role: "offense",
				signature: "e73dbabc",
				theme: "void",
			},
			passive_rules: [
				"Crit on 19-20. Critical hits push target 5 ft.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
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
					"On a critical hit, target is Frightened until the end of its next turn.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p3_10",
		name: "Guild-Issue Warhammer",
		source_book: "Rift Ascendant Canon",
		description:
			"A massive impact weapon balanced for sweeping strikes and structural breaks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0469.webp",
		weight: 5,
		value: { currency: "gate", amount: 499 },
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
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip.",
		tags: ["equipment", "buff", "necrotic", "melee"],
		theme_tags: ["urban-combat", "mana-overflow", "black-market"],
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
				fingerprint: "3ef83dbe",
				payload_complete: true,
				uniqueness_seed: "item_p3_10::Guild-Issue Warhammer",
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
					"Guild-Issue Warhammer keys standard melee bludgeon heavy rules through signature 7b52d58c.",
				role: "offense",
				signature: "7b52d58c",
				theme: "standard",
			},
			passive_rules: [
				"Crit on 19-20. Critical hits push target 5 ft.",
				"+1 to initiative rolls while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "bludgeoning",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d12 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Crit on 19-20. Critical hits push target 5 ft.",
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
		id: "item_p3_11",
		name: "Purified Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A purifier vial labeled with the Bureau's medical-clearance stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0612.webp",
		weight: 2,
		value: { currency: "crystal", amount: 3340 },
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
				uniqueness_seed: "item_p3_11::Purified Aetheric Antidote",
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
					"Purified Aetheric Antidote keys aetheric consumable purifier rules through signature e35838b9.",
				role: "consumable",
				signature: "e35838b9",
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
	{
		id: "item_p3_12",
		name: "Shattered Gauntlets",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced gauntlet that turns unarmed strikes into solid kinetic blows.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0467.webp",
		weight: 4,
		value: { currency: "gate", amount: 128 },
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
				fingerprint: "19e5a575",
				payload_complete: true,
				uniqueness_seed: "item_p3_12::Shattered Gauntlets",
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
					"Shattered Gauntlets keys standard melee gauntlet rules through signature 89c7e900.",
				role: "offense",
				signature: "89c7e900",
				theme: "standard",
			},
			passive_rules: [
				"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
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
		id: "item_p3_13",
		name: "Mana-Infused Dagger",
		source_book: "Rift Ascendant Canon",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0106.webp",
		weight: 1,
		value: { currency: "gate", amount: 174 },
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
		flavor: "What survives a Ascendant's tour usually outlives the Ascendant.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "stealth", "buff", "void", "melee"],
		theme_tags: ["modern-warfare", "elite-tier"],
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
				fingerprint: "21c938fd",
				payload_complete: true,
				uniqueness_seed: "item_p3_13::Mana-Infused Dagger",
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
					"Mana-Infused Dagger keys aetheric melee blade finesse rules through signature 6ba25f52.",
				role: "offense",
				signature: "6ba25f52",
				theme: "aetheric",
			},
			passive_rules: [
				"Crit on 19-20.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"+1 to attack rolls when at full HP.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Crit on 19-20.",
					"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p3_14",
		name: "Lesser Mana Elixir",
		source_book: "Rift Ascendant Canon",
		description:
			"A clear-glass restorative phial sealed with a Bureau quartermaster stamp.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0913.webp",
		weight: 8,
		value: { currency: "crystal", amount: 1900 },
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
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip.",
		tags: [
			"equipment",
			"support",
			"debuff",
			"single-target",
			"lightning",
			"consumable",
		],
		theme_tags: ["post-awakening", "system-glitch", "mana-overflow"],
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
				uniqueness_seed: "item_p3_14::Lesser Mana Elixir",
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
					"Lesser Mana Elixir keys aetheric consumable potion rules through signature fcf3fa72.",
				role: "consumable",
				signature: "fcf3fa72",
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
		id: "item_p3_15",
		name: "Void Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced sidearm with a Bureau-stamped frame and ichor-resistant action.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0168.webp",
		weight: 3,
		value: { currency: "gate", amount: 197 },
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
				fingerprint: "c4f854b1",
				payload_complete: true,
				uniqueness_seed: "item_p3_15::Void Revolver",
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
					"Void Revolver keys void firearm pistol rules through signature 01ecc0b6.",
				role: "offense",
				signature: "01ecc0b6",
				theme: "void",
			},
			passive_rules: [
				"Magnum-frame. -1 to attack within 5 ft.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Magnum-frame. -1 to attack within 5 ft.",
					"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
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
				range: "Ranged (40/120)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p3_16",
		name: "Guild-Issue Whip",
		source_book: "Rift Ascendant Canon",
		description:
			"A long flexible weapon with a finesse grip. Reach without weight.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0415.webp",
		weight: 6,
		value: { currency: "gate", amount: 301 },
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
		flavor: "What survives a Ascendant's tour usually outlives the Ascendant.",
		discovery_lore:
			"Re-discovered in a deep-storage Bureau crate during an unrelated audit.",
		tags: ["equipment", "defensive", "shadow", "utility", "buff", "melee"],
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
				fingerprint: "bbc9fbc2",
				payload_complete: true,
				uniqueness_seed: "item_p3_16::Guild-Issue Whip",
				variant_note:
					"Reach. On a hit, target makes a DC 11 Strength save or is disarmed.",
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
					"Guild-Issue Whip keys standard melee whip rules through signature bfc5c40e.",
				role: "offense",
				signature: "bfc5c40e",
				theme: "standard",
			},
			passive_rules: [
				"Reach. On a hit, target makes a DC 11 Strength save or is disarmed.",
				"+1 to one save of your choice while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "bludgeoning",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d4 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Reach. On a hit, target makes a DC 11 Strength save or is disarmed.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p3_17",
		name: "Black-Market Health Potion",
		source_book: "Rift Ascendant Canon",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0678.webp",
		weight: 2,
		value: { currency: "crystal", amount: 3880 },
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
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Ascendants' survival.",
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
				uniqueness_seed: "item_p3_17::Black-Market Health Potion",
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
					"Black-Market Health Potion keys standard consumable potion rules through signature 2b804c18.",
				role: "consumable",
				signature: "2b804c18",
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
		id: "item_p3_18",
		name: "Lesser Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0181.webp",
		weight: 2,
		value: { currency: "crystal", amount: 1840 },
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
				uniqueness_seed: "item_p3_18::Lesser Liquid Shadow",
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
					"Lesser Liquid Shadow keys shadow consumable potion rules through signature 34ecc56c.",
				role: "consumable",
				signature: "34ecc56c",
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
		id: "item_p3_19",
		name: "Lesser Stamina Stim",
		source_book: "Rift Ascendant Canon",
		description: "A Bureau-stamped emergency injector. Last-resort kit.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0068.webp",
		weight: 7,
		value: { currency: "crystal", amount: 2410 },
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
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
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
				uniqueness_seed: "item_p3_19::Lesser Stamina Stim",
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
					"Lesser Stamina Stim keys standard consumable stim rules through signature 5acb4f2f.",
				role: "consumable",
				signature: "5acb4f2f",
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
		id: "item_p3_20",
		name: "Abyssal Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0836.webp",
		weight: 2,
		value: { currency: "gate", amount: 84 },
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
				fingerprint: "ef8a7c71",
				payload_complete: true,
				uniqueness_seed: "item_p3_20::Abyssal Revolver",
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
					"Abyssal Revolver keys void firearm pistol rules through signature fcc41c0d.",
				role: "offense",
				signature: "fcc41c0d",
				theme: "void",
			},
			passive_rules: [
				"Snub-frame. Counts as a finesse weapon.",
				"On a critical hit, target is Frightened until the end of its next turn.",
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
					"On a critical hit, target is Frightened until the end of its next turn.",
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
		id: "item_p3_21",
		name: "Titanium Combat Vest",
		source_book: "Rift Ascendant Canon",
		description:
			"A compact tactical layer designed for fast movers operating inside C-rank gates.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0949.webp",
		weight: 4,
		value: { currency: "gate", amount: 98 },
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
				uniqueness_seed: "item_p3_21::Titanium Combat Vest",
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
					"Titanium Combat Vest keys standard armor light rules through signature 7aff0479.",
				role: "defense",
				signature: "7aff0479",
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
		id: "item_p3_22",
		name: "Concentrated Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description:
			"A combat-grade healing compound packaged for sub-action consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0586.webp",
		weight: 3,
		value: { currency: "crystal", amount: 1650 },
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
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "area", "sustained", "necrotic", "consumable"],
		theme_tags: ["experimental", "system-glitch", "black-market"],
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
				uniqueness_seed: "item_p3_22::Concentrated Liquid Shadow",
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
					"Concentrated Liquid Shadow keys shadow consumable potion rules through signature f4b4d349.",
				role: "consumable",
				signature: "f4b4d349",
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
		id: "item_p3_23",
		name: "Starlight Sniper Rifle",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-issued service rifle, balanced for accuracy over rate of fire.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0683.webp",
		weight: 8,
		value: { currency: "gate", amount: 260 },
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
				fingerprint: "e7c9308e",
				payload_complete: true,
				uniqueness_seed: "item_p3_23::Starlight Sniper Rifle",
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
					"Starlight Sniper Rifle keys starlight firearm rifle rules through signature b37b2300.",
				role: "offense",
				signature: "b37b2300",
				theme: "starlight",
			},
			passive_rules: [
				"Bolt-action. One attack per turn; +1 to attack rolls.",
				"+1d4 radiant damage on the first hit each round against an Anomaly.",
				"+1 to one save of your choice while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "radiant",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d12 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Bolt-action. One attack per turn; +1 to attack rolls.",
					"+1d4 radiant damage on the first hit each round against an Anomaly.",
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
				range: "Ranged (100/400)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p3_24",
		name: "Mana-Infused Longsword",
		source_book: "Rift Ascendant Canon",
		description:
			"A reliable mid-weight blade — the kind every Ascendant learns on, and many never replace.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0392.webp",
		weight: 4,
		value: { currency: "gate", amount: 362 },
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
				"Procured through the Ascendant Bureau's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "buff", "shadow", "control", "melee"],
		theme_tags: ["ascendant-bureau", "guild-ops"],
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
				fingerprint: "ccc0ebbd",
				payload_complete: true,
				uniqueness_seed: "item_p3_24::Mana-Infused Longsword",
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
					"Mana-Infused Longsword keys aetheric melee blade versatile rules through signature 71d34191.",
				role: "offense",
				signature: "71d34191",
				theme: "aetheric",
			},
			passive_rules: [
				"Counts as both slashing and piercing for resistance bypass.",
				"On a hit, target loses 1 mana point (if any).",
				"On a critical hit, regain 1 HP per Hit Die spent today.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Counts as both slashing and piercing for resistance bypass.",
					"On a hit, target loses 1 mana point (if any).",
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
		id: "item_p3_25",
		name: "Concentrated Stamina Stim",
		source_book: "Rift Ascendant Canon",
		description:
			"A Ascendant-grade injector. Burns hot and fast. Trust the cap.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0377.webp",
		weight: 1,
		value: { currency: "crystal", amount: 2680 },
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
				"Quietly stockpiled by the Ascendant Bureau after an A-rank cascade exposed gaps in standard kit.",
			origin:
				"Recovered from a black-market shipment intercepted by Bureau agents.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "damage", "stealth", "consumable"],
		theme_tags: ["elite-tier", "rift-energy", "shadow-domain"],
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
				uniqueness_seed: "item_p3_25::Concentrated Stamina Stim",
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
					"Concentrated Stamina Stim keys standard consumable stim rules through signature 34a3a8b2.",
				role: "consumable",
				signature: "34a3a8b2",
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
		id: "item_p3_26",
		name: "Lesser Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A small dose of curative liquid. One condition cleared per application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0126.webp",
		weight: 3,
		value: { currency: "crystal", amount: 1080 },
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
				uniqueness_seed: "item_p3_26::Lesser Aetheric Antidote",
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
					"Lesser Aetheric Antidote keys aetheric consumable purifier rules through signature d5c5efc3.",
				role: "consumable",
				signature: "d5c5efc3",
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
		id: "item_p3_27",
		name: "Titanium Spaulders",
		source_book: "Rift Ascendant Canon",
		description:
			"A heavy plate-and-scale shell built for sustained engagements with armored anomalies.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0639.webp",
		weight: 3,
		value: { currency: "gate", amount: 90 },
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
				fingerprint: "98a624bb",
				payload_complete: true,
				uniqueness_seed: "item_p3_27::Titanium Spaulders",
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
					"Titanium Spaulders keys standard armor heavy rules through signature a5fe41d7.",
				role: "defense",
				signature: "a5fe41d7",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
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
		id: "item_p3_28",
		name: "Obsidian Whip",
		source_book: "Rift Ascendant Canon",
		description:
			"A control-class weapon for Ascendants who prefer winning fights without finishing them.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0364.webp",
		weight: 7,
		value: { currency: "gate", amount: 46 },
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
				"Earned a footnote in the Ascendant Bureau's quarterly equipment audit.",
			origin:
				"Procured through the Ascendant Bureau's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not pretty. Not elegant. Effective.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "lightning", "radiant", "area", "melee"],
		theme_tags: ["system-glitch", "shadow-domain"],
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
					name: "Surge Strike",
					description:
						"As a bonus action, your next attack with this weapon before the end of your turn deals an additional 2d6 damage.",
					action: "bonus-action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "d9965c42",
				payload_complete: true,
				uniqueness_seed: "item_p3_28::Obsidian Whip",
				variant_note: "Reach: melee attacks have 10 ft. range.",
			},
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus + 1",
				damage_roll: "1d4 + STR or AGI modifier + 1",
				recharge: "short-rest",
				save_dc: null,
			},
			identity: {
				rarity: "rare",
				archetype: "melee_whip",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Obsidian Whip keys shadow melee whip rules through signature 7108b3b7.",
				role: "offense",
				signature: "7108b3b7",
				theme: "shadow",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
				"+1 AC against the first attack made against you each round.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [
					{
						name: "Surge Strike",
						description:
							"As a bonus action, your next attack with this weapon before the end of your turn deals an additional 2d6 damage.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "1d4 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Reach: melee attacks have 10 ft. range.",
					"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
					"+1 AC against the first attack made against you each round.",
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
		id: "item_p3_29",
		name: "Gate-Forged Shin Guards",
		source_book: "Rift Ascendant Canon",
		description:
			"A light, flexible armor weave. Standard kit for stealth-focused Ascendants.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0205.webp",
		weight: 7,
		value: { currency: "gate", amount: 67 },
		item_type: "armor",
		armor_class: "12 + AGI modifier",
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
				"Surfaced in the Ascendant Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Not glamorous. Still alive.",
		discovery_lore:
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "sustained", "support", "single-target", "armor"],
		theme_tags: ["guild-ops", "forbidden"],
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
				fingerprint: "63b19c8b",
				payload_complete: true,
				uniqueness_seed: "item_p3_29::Gate-Forged Shin Guards",
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
					"Gate-Forged Shin Guards keys standard armor light rules through signature 9867c8d5.",
				role: "defense",
				signature: "9867c8d5",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"+1 to initiative rolls while attuned.",
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
		id: "item_p3_30",
		name: "Gate-Forged Breastplate",
		source_book: "Rift Ascendant Canon",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0383.webp",
		weight: 8,
		value: { currency: "gate", amount: 166 },
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
				fingerprint: "add147fb",
				payload_complete: true,
				uniqueness_seed: "item_p3_30::Gate-Forged Breastplate",
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
					"Gate-Forged Breastplate keys standard armor heavy rules through signature 59721d23.",
				role: "defense",
				signature: "59721d23",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 15. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
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
		id: "item_p3_31",
		name: "Lesser Health Potion",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0902.webp",
		weight: 6,
		value: { currency: "crystal", amount: 2730 },
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
				"Pulled from the gear locker of a mid-rank Ascendant declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's expensive, but cheaper than a coffin.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: [
			"equipment",
			"damage",
			"shadow",
			"perception",
			"sustained",
			"consumable",
		],
		theme_tags: ["dimensional-bleed", "dungeon-core"],
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
				uniqueness_seed: "item_p3_31::Lesser Health Potion",
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
					"Lesser Health Potion keys standard consumable potion rules through signature ed6f0d78.",
				role: "consumable",
				signature: "ed6f0d78",
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
		id: "item_p3_32",
		name: "Shadow Combat Vest",
		source_book: "Rift Ascendant Canon",
		description:
			"A flexible mana-weave layer that beads ichor and shrugs off minor concussive impacts.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0097.webp",
		weight: 4,
		value: { currency: "gate", amount: 465 },
		item_type: "armor",
		armor_class: "12 + AGI modifier",
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
		theme_tags: ["shadow-domain", "ascendant-bureau"],
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
					name: "Suppressive Volley",
					description:
						"As an action, force all creatures within a 15-ft. cone to make a DC 13 Agility save or take 2d6 damage of this weapon's type.",
					action: "action",
					dc: 13,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "b843134f",
				payload_complete: true,
				uniqueness_seed: "item_p3_32::Shadow Combat Vest",
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
					"Shadow Combat Vest keys shadow armor light rules through signature 5f03ee42.",
				role: "defense",
				signature: "5f03ee42",
				theme: "shadow",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"On a critical hit, deal an additional 2d6 damage of this weapon's damage type.",
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
					"Advantage on Stealth checks made in dim light or darkness.",
					"On a critical hit, deal an additional 2d6 damage of this weapon's damage type.",
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
		id: "item_p3_33",
		name: "Ceramic Exo-Suit",
		source_book: "Rift Ascendant Canon",
		description:
			"A close-fitting armor jacket cut from mana-treated synthetic fiber.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0112.webp",
		weight: 8,
		value: { currency: "gate", amount: 413 },
		item_type: "armor",
		armor_class: "13 + AGI modifier",
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
					name: "Lattice Tag",
					description:
						"As an action, mark a creature within 60 ft. for 1 minute. Attacks against the marked creature deal +1d6 damage of this item's theme.",
					action: "action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "197a16ec",
				payload_complete: true,
				uniqueness_seed: "item_p3_33::Ceramic Exo-Suit",
				variant_note: "Reinforced light armor. AC 12 + AGI.",
			},
			formulas: {
				armor_class: "13 + AGI modifier",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "rare",
				archetype: "armor_light",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Ceramic Exo-Suit keys standard armor light rules through signature abe3135d.",
				role: "defense",
				signature: "abe3135d",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 13 + AGI modifier.",
				"Reinforced light armor. AC 12 + AGI.",
				"On a kill, your next attack within 1 minute deals an extra 2d6 damage.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "13 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 13 + AGI modifier.",
					"Reinforced light armor. AC 12 + AGI.",
					"On a kill, your next attack within 1 minute deals an extra 2d6 damage.",
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
		id: "item_p3_34",
		name: "Aetheric Sniper Rifle",
		source_book: "Rift Ascendant Canon",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0411.webp",
		weight: 3,
		value: { currency: "gate", amount: 202 },
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
		theme_tags: ["experimental", "dimensional-bleed", "ascendant-bureau"],
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
				fingerprint: "aaf31625",
				payload_complete: true,
				uniqueness_seed: "item_p3_34::Aetheric Sniper Rifle",
				variant_note: "Marksman variant. Crit on 19-20.",
			},
			formulas: {
				attack_roll: "d20 + AGI modifier + proficiency bonus",
				damage_roll: "2d6 + AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "firearm_rifle",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aetheric Sniper Rifle keys aetheric firearm rifle rules through signature e66dad29.",
				role: "offense",
				signature: "e66dad29",
				theme: "aetheric",
			},
			passive_rules: [
				"Marksman variant. Crit on 19-20.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "2d6 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Marksman variant. Crit on 19-20.",
					"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
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
				range: "Ranged (80/240)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p3_35",
		name: "Mana-Infused Sniper Rifle",
		source_book: "Rift Ascendant Canon",
		description:
			"A long-barrel rifle stamped to Bureau specifications. Designed for stand-off engagements at gate perimeters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0306.webp",
		weight: 2,
		value: { currency: "gate", amount: 145 },
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
		theme_tags: ["post-awakening", "forbidden", "ascendant-bureau"],
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
				fingerprint: "f41ea66b",
				payload_complete: true,
				uniqueness_seed: "item_p3_35::Mana-Infused Sniper Rifle",
				variant_note: "Long-arm. Disadvantage on attacks within 5 ft.",
			},
			formulas: {
				attack_roll: "d20 + AGI modifier + proficiency bonus",
				damage_roll: "1d10 + AGI modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "firearm_rifle",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Mana-Infused Sniper Rifle keys aetheric firearm rifle rules through signature 9490563f.",
				role: "offense",
				signature: "9490563f",
				theme: "aetheric",
			},
			passive_rules: [
				"Long-arm. Disadvantage on attacks within 5 ft.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Crit on 19-20 against gate-spawned creatures.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Long-arm. Disadvantage on attacks within 5 ft.",
					"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
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
				range: "Ranged (80/240)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p3_36",
		name: "Vanguard Tactical Helmet",
		source_book: "Rift Ascendant Canon",
		description: "A combat helm with optional Bureau communication insert.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0685.webp",
		weight: 7,
		value: { currency: "gate", amount: 506 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				fingerprint: "9cdcbff4",
				payload_complete: true,
				uniqueness_seed: "item_p3_36::Vanguard Tactical Helmet",
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
					"Vanguard Tactical Helmet keys standard armor headgear rules through signature 98975d4b.",
				role: "defense",
				signature: "98975d4b",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
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
					"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
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
		id: "item_p3_37",
		name: "Aether-Plated Breastplate",
		source_book: "Rift Ascendant Canon",
		description:
			"A heavy armor system with sectional plating and a mana-conductive backing layer.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0828.webp",
		weight: 3,
		value: { currency: "gate", amount: 385 },
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
				fingerprint: "d4d08e6f",
				payload_complete: true,
				uniqueness_seed: "item_p3_37::Aether-Plated Breastplate",
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
					"Aether-Plated Breastplate keys aetheric armor heavy rules through signature 5a647799.",
				role: "defense",
				signature: "5a647799",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"Resistance to force damage.",
				"Critical hits with this item ignore resistance to its damage type.",
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
		id: "item_p3_38",
		name: "Ceramic Bracers",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-issued forearm guard for Ascendants operating melee-forward.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0871.webp",
		weight: 6,
		value: { currency: "gate", amount: 95 },
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
				fingerprint: "a11b4ae0",
				payload_complete: true,
				uniqueness_seed: "item_p3_38::Ceramic Bracers",
				variant_note:
					"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
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
					"Ceramic Bracers keys standard gear bracer rules through signature 883d6907.",
				role: "utility",
				signature: "883d6907",
				theme: "standard",
			},
			passive_rules: [
				"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
				"On a kill with this item, gain 1d4 temporary HP.",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
				passive_effects: [
					"Once per long rest, you may impose disadvantage on an attack made against you within 5 ft.",
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
				range: "self",
				area: null,
				line_of_effect: "as item description permits",
				target: "Self, touched object, or listed utility target",
			},
		},
	},
	{
		id: "item_p3_39",
		name: "Obsidian Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A balanced service pistol favored by C-rank strike teams. Stable in lattice-bleed conditions.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0358.webp",
		weight: 4,
		value: { currency: "gate", amount: 17 },
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
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Found in the back of a Guild's recovered-effects locker during inheritance review.",
		tags: ["equipment", "damage", "fire", "debuff", "necrotic", "firearm"],
		theme_tags: ["dungeon-core", "dimensional-bleed", "regent-era"],
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
				fingerprint: "73a164a7",
				payload_complete: true,
				uniqueness_seed: "item_p3_39::Obsidian Revolver",
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
					"Obsidian Revolver keys shadow firearm pistol rules through signature 2515932d.",
				role: "offense",
				signature: "2515932d",
				theme: "shadow",
			},
			passive_rules: [
				"Snub-frame. Counts as a finesse weapon.",
				"While in dim light or darkness, attacks with this weapon have advantage.",
				"+1 to one save of your choice while attuned.",
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
					"While in dim light or darkness, attacks with this weapon have advantage.",
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
		id: "item_p3_40",
		name: "High-Grade Health Potion",
		source_book: "Rift Ascendant Canon",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0094.webp",
		weight: 7,
		value: { currency: "crystal", amount: 2470 },
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
				"Issued to a B-rank Ascendant on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's not pretty going down. It's prettier than the alternative.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "offensive", "defensive", "ice", "consumable"],
		theme_tags: ["ascendant-bureau", "survival", "rift-energy"],
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
				uniqueness_seed: "item_p3_40::High-Grade Health Potion",
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
					"High-Grade Health Potion keys standard consumable potion rules through signature 0e4c57e8.",
				role: "consumable",
				signature: "0e4c57e8",
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
		id: "item_p3_41",
		name: "High-Grade Mana Elixir",
		source_book: "Rift Ascendant Canon",
		description:
			"A flask of mana-stable medicinal compound for in-field recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0607.webp",
		weight: 4,
		value: { currency: "crystal", amount: 1340 },
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
				uniqueness_seed: "item_p3_41::High-Grade Mana Elixir",
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
					"High-Grade Mana Elixir keys aetheric consumable potion rules through signature 3cea9ef8.",
				role: "consumable",
				signature: "3cea9ef8",
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
		id: "item_p3_42",
		name: "Crimson Gauntlets",
		source_book: "Rift Ascendant Canon",
		description:
			"Field-issued combat gauntlets for Striker-class Ascendants and tactical brawlers.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0592.webp",
		weight: 1,
		value: { currency: "gate", amount: 418 },
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
				fingerprint: "1e7af555",
				payload_complete: true,
				uniqueness_seed: "item_p3_42::Crimson Gauntlets",
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
					"Crimson Gauntlets keys crimson melee gauntlet rules through signature 6309e566.",
				role: "offense",
				signature: "6309e566",
				theme: "crimson",
			},
			passive_rules: [
				"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
				"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
				"+1 to one save of your choice while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "slashing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
					"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p3_43",
		name: "Concentrated Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0321.webp",
		weight: 3,
		value: { currency: "crystal", amount: 2200 },
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
				uniqueness_seed: "item_p3_43::Concentrated Liquid Shadow",
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
					"Concentrated Liquid Shadow keys shadow consumable potion rules through signature 45c9f436.",
				role: "consumable",
				signature: "45c9f436",
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
		id: "item_p3_44",
		name: "Concentrated Stamina Stim",
		source_book: "Rift Ascendant Canon",
		description: "A Bureau-stamped emergency injector. Last-resort kit.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0546.webp",
		weight: 2,
		value: { currency: "crystal", amount: 2060 },
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
				uniqueness_seed: "item_p3_44::Concentrated Stamina Stim",
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
					"Concentrated Stamina Stim keys standard consumable stim rules through signature 8a0d50cb.",
				role: "consumable",
				signature: "8a0d50cb",
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
		id: "item_p3_45",
		name: "Nano-Weave Breastplate",
		source_book: "Rift Ascendant Canon",
		description:
			"A heavy mana-stable carapace built around composite plating and ichor-treated joints.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0891.webp",
		weight: 1,
		value: { currency: "gate", amount: 195 },
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
				fingerprint: "caa75fef",
				payload_complete: true,
				uniqueness_seed: "item_p3_45::Nano-Weave Breastplate",
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
					"Nano-Weave Breastplate keys standard armor heavy rules through signature 48eb8a6d.",
				role: "defense",
				signature: "48eb8a6d",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 17. Stealth checks at disadvantage.",
				"Heavy carapace plating. AC 17. Stealth disadvantage. Requires STR 15.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p3_46",
		name: "Void Katana",
		source_book: "Rift Ascendant Canon",
		description: "A saber cut for fluid offense and parry-driven defense.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0020.webp",
		weight: 5,
		value: { currency: "gate", amount: 398 },
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
				"Brokered to a Ascendant Bureau quartermaster by a vetted second-hand seller.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "lightning", "burst", "support", "melee"],
		theme_tags: ["ascendant-bureau", "survival", "dungeon-core"],
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
					name: "Disengaging Strike",
					description:
						"As an action, make a weapon attack and immediately move up to your speed without provoking opportunity attacks.",
					action: "action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "72f553a0",
				payload_complete: true,
				uniqueness_seed: "item_p3_46::Void Katana",
				variant_note: "When wielded two-handed, +1 to damage rolls.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus + 1",
				damage_roll: "1d10 + STR modifier + 1",
				recharge: "short-rest",
				save_dc: null,
			},
			identity: {
				rarity: "rare",
				archetype: "melee_blade_versatile",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Void Katana keys void melee blade versatile rules through signature 1259d2c8.",
				role: "offense",
				signature: "1259d2c8",
				theme: "void",
			},
			passive_rules: [
				"When wielded two-handed, +1 to damage rolls.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"Once per short rest, cast Misty Step (no spell slot required) while wielding this item.",
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
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"When wielded two-handed, +1 to damage rolls.",
					"On a critical hit, target is Frightened until the end of its next turn.",
					"Once per short rest, cast Misty Step (no spell slot required) while wielding this item.",
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
		id: "item_p3_47",
		name: "Shattered Sniper Rifle",
		source_book: "Rift Ascendant Canon",
		description:
			"A precision rifle with mana-stable optics. Effective against armored anomalies at extended range.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0909.webp",
		weight: 3,
		value: { currency: "gate", amount: 190 },
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
				"Surfaced in the Ascendant Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't carry it to be seen. You carry it to come back.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "single-target", "offensive", "area", "firearm"],
		theme_tags: ["dungeon-core", "regent-era"],
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
				fingerprint: "809070c9",
				payload_complete: true,
				uniqueness_seed: "item_p3_47::Shattered Sniper Rifle",
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
					"Shattered Sniper Rifle keys standard firearm rifle rules through signature 61a713de.",
				role: "offense",
				signature: "61a713de",
				theme: "standard",
			},
			passive_rules: [
				"Auto-rifle. Burst-fire (3 rd, +1d6) on a single attack.",
				"+1 to initiative rolls while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "piercing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Auto-rifle. Burst-fire (3 rd, +1d6) on a single attack.",
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
				range: "Ranged (60/180)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p3_48",
		name: "Black-Market Beast Repellent",
		source_book: "Rift Ascendant Canon",
		description:
			"A pocket-sized recovery potion. Standard kit for any Ascendant on assignment.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0638.webp",
		weight: 3,
		value: { currency: "crystal", amount: 1280 },
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
				"Logged into the Ascendant Bureau's master inventory the day it was first sold.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "psychic", "support", "radiant", "consumable"],
		theme_tags: ["dimensional-bleed", "experimental", "classified"],
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
				uniqueness_seed: "item_p3_48::Black-Market Beast Repellent",
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
					"Black-Market Beast Repellent keys standard consumable potion rules through signature 55be0b83.",
				role: "consumable",
				signature: "55be0b83",
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
		id: "item_p3_49",
		name: "Guild-Issue Katana",
		source_book: "Rift Ascendant Canon",
		description: "A saber cut for fluid offense and parry-driven defense.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0119.webp",
		weight: 4,
		value: { currency: "gate", amount: 191 },
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
				fingerprint: "68623ef3",
				payload_complete: true,
				uniqueness_seed: "item_p3_49::Guild-Issue Katana",
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
					"Guild-Issue Katana keys standard melee blade versatile rules through signature c7e980f0.",
				role: "offense",
				signature: "c7e980f0",
				theme: "standard",
			},
			passive_rules: ["+1 to one save of your choice while attuned."],
			resolution: {
				type: "weapon_attack",
				damage_type: "slashing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + STR modifier",
				damage_roll: true,
				on_hit: ["+1 to one save of your choice while attuned."],
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
];
