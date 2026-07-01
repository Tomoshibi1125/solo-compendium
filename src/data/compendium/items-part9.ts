import type { Item } from "./items";

export const items_part9: Item[] = [
	{
		id: "item_p9_0",
		name: "Mana-Infused Dagger",
		source_book: "Rift Ascendant Canon",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0876.webp",
		weight: 2,
		value: { currency: "gate", amount: 501 },
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
		flavor: "What survives a Ascendant's tour usually outlives the Ascendant.",
		discovery_lore:
			"Recovered during the post-clear sweep of a B-rank facility seal.",
		tags: ["equipment", "radiant", "buff", "ice", "melee"],
		theme_tags: ["mana-overflow", "elite-tier", "shadow-domain"],
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
				fingerprint: "bee5a73d",
				payload_complete: true,
				uniqueness_seed: "item_p9_0::Mana-Infused Dagger",
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
					"Mana-Infused Dagger keys aetheric melee blade finesse rules through signature 8df963e0.",
				role: "offense",
				signature: "8df963e0",
				theme: "aetheric",
			},
			passive_rules: [
				"Crit on 19-20.",
				"While attuned, gain +1 to spell-attack rolls.",
				"Once per short rest, reroll a missed attack roll.",
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
					"While attuned, gain +1 to spell-attack rolls.",
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
		id: "item_p9_1",
		name: "Crimson Longsword",
		source_book: "Rift Ascendant Canon",
		description:
			"A versatile cutting blade with a tempered edge and Bureau service marks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0989.webp",
		weight: 5,
		value: { currency: "gate", amount: 407 },
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
				fingerprint: "abea8d41",
				payload_complete: true,
				uniqueness_seed: "item_p9_1::Crimson Longsword",
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
					"Crimson Longsword keys crimson melee blade versatile rules through signature bf3eb8bf.",
				role: "offense",
				signature: "bf3eb8bf",
				theme: "crimson",
			},
			passive_rules: [
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
		id: "item_p9_2",
		name: "Concentrated Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A small dose of curative liquid. One condition cleared per application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0610.webp",
		weight: 2,
		value: { currency: "crystal", amount: 4000 },
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
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "shadow", "area", "necrotic", "consumable"],
		theme_tags: ["elite-tier", "experimental"],
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
				uniqueness_seed: "item_p9_2::Concentrated Aetheric Antidote",
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
					"Concentrated Aetheric Antidote keys aetheric consumable purifier rules through signature 1834bc51.",
				role: "consumable",
				signature: "1834bc51",
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
		id: "item_p9_3",
		name: "Abyssal Dagger",
		source_book: "Rift Ascendant Canon",
		description:
			"A short blade with a fluted spine, weighted for offhand throws.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0707.webp",
		weight: 3,
		value: { currency: "gate", amount: 429 },
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
				fingerprint: "96151c92",
				payload_complete: true,
				uniqueness_seed: "item_p9_3::Abyssal Dagger",
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
					"Abyssal Dagger keys void melee blade finesse rules through signature da450822.",
				role: "offense",
				signature: "da450822",
				theme: "void",
			},
			passive_rules: [
				"Crit on 19-20.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"+1d4 damage against creatures with the Construct or Anomaly tag.",
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
					"On a critical hit, target is Frightened until the end of its next turn.",
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
		id: "item_p9_4",
		name: "Void Warhammer",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced sledge — for when an obstacle needs to stop being one.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0416.webp",
		weight: 4,
		value: { currency: "gate", amount: 34 },
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
				"Procured through the Ascendant Bureau's gray-market quartermaster network.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It will only ever be as deadly as the hand that holds it.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "damage", "ice", "area", "melee"],
		theme_tags: ["regent-era", "modern-warfare"],
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
				fingerprint: "d9cec6ae",
				payload_complete: true,
				uniqueness_seed: "item_p9_4::Void Warhammer",
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
					"Void Warhammer keys void melee bludgeon heavy rules through signature 30005e28.",
				role: "offense",
				signature: "30005e28",
				theme: "void",
			},
			passive_rules: [
				"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"Once per short rest, treat a single failed Vitality save as a success.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "2d6 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Slow swing. On hit, deal +1 damage per 2 levels of the wielder.",
					"On a critical hit, target is Frightened until the end of its next turn.",
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
		id: "item_p9_5",
		name: "Mana-Infused Halberd",
		source_book: "Rift Ascendant Canon",
		description:
			"A two-handed reach weapon used to break melee lines and protect spellcasters.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0401.webp",
		weight: 4,
		value: { currency: "gate", amount: 420 },
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
				fingerprint: "d4126a3b",
				payload_complete: true,
				uniqueness_seed: "item_p9_5::Mana-Infused Halberd",
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
					"Mana-Infused Halberd keys aetheric melee polearm rules through signature d8e17fbf.",
				role: "offense",
				signature: "d8e17fbf",
				theme: "aetheric",
			},
			passive_rules: [
				"Reach: melee attacks have 10 ft. range.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Once per long rest, when you take damage, you may halve it as a reaction.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d10 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Reach: melee attacks have 10 ft. range.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p9_6",
		name: "Concentrated Beast Repellent",
		source_book: "Rift Ascendant Canon",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0166.webp",
		weight: 2,
		value: { currency: "crystal", amount: 3280 },
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
				uniqueness_seed: "item_p9_6::Concentrated Beast Repellent",
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
					"Concentrated Beast Repellent keys standard consumable potion rules through signature beb94615.",
				role: "consumable",
				signature: "beb94615",
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
		id: "item_p9_7",
		name: "Aether-Plated Breastplate",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced heavy armor shell. Designed for line-holders and gate-breach teams.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0679.webp",
		weight: 2,
		value: { currency: "gate", amount: 247 },
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
				uniqueness_seed: "item_p9_7::Aether-Plated Breastplate",
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
					"Aether-Plated Breastplate keys aetheric armor heavy rules through signature c0c787c2.",
				role: "defense",
				signature: "c0c787c2",
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
		id: "item_p9_8",
		name: "Concentrated Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A neutralizing agent calibrated for gate-acquired contamination.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0388.webp",
		weight: 4,
		value: { currency: "crystal", amount: 3700 },
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
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "damage", "healing", "area", "necrotic", "consumable"],
		theme_tags: ["guild-ops", "urban-combat"],
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
				uniqueness_seed: "item_p9_8::Concentrated Aetheric Antidote",
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
					"Concentrated Aetheric Antidote keys aetheric consumable purifier rules through signature b133b6fb.",
				role: "consumable",
				signature: "b133b6fb",
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
		id: "item_p9_9",
		name: "Shadow Spaulders",
		source_book: "Rift Ascendant Canon",
		description:
			"Heavy Bureau-stamped plate. Designed to be hit. Designed to keep working when it is.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0245.webp",
		weight: 2,
		value: { currency: "gate", amount: 79 },
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
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "area", "necrotic", "armor"],
		theme_tags: ["experimental", "ascendant-bureau"],
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
				fingerprint: "f1ecd700",
				payload_complete: true,
				uniqueness_seed: "item_p9_9::Shadow Spaulders",
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
					"Shadow Spaulders keys shadow armor heavy rules through signature 32e01fec.",
				role: "defense",
				signature: "32e01fec",
				theme: "shadow",
			},
			passive_rules: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Mana-stable plate. Resistance to force damage.",
				"Disadvantage on attacks against you while you are obscured.",
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
					"Disadvantage on attacks against you while you are obscured.",
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
		id: "item_p9_10",
		name: "Vanguard Shin Guards",
		source_book: "Rift Ascendant Canon",
		description:
			"A multi-layer combat coat woven from impact-resistant fabric.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0973.webp",
		weight: 5,
		value: { currency: "gate", amount: 345 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				fingerprint: "dd95d543",
				payload_complete: true,
				uniqueness_seed: "item_p9_10::Vanguard Shin Guards",
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
					"Vanguard Shin Guards keys standard armor light rules through signature 0fd95dd6.",
				role: "defense",
				signature: "0fd95dd6",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
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
		id: "item_p9_11",
		name: "Black-Market Stamina Stim",
		source_book: "Rift Ascendant Canon",
		description:
			"A high-uptake injector used by frontline Ascendants under sustained fire.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0100.webp",
		weight: 7,
		value: { currency: "crystal", amount: 2040 },
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
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You'll know it worked. You'll know if it didn't.",
		discovery_lore:
			"Was set aside by a Guild quartermaster who 'meant to do something with it.'",
		tags: ["equipment", "radiant", "sustained", "healing", "consumable"],
		theme_tags: ["regent-era", "forbidden", "post-awakening"],
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
				uniqueness_seed: "item_p9_11::Black-Market Stamina Stim",
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
					"Black-Market Stamina Stim keys standard consumable stim rules through signature bfda4e6f.",
				role: "consumable",
				signature: "bfda4e6f",
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
		id: "item_p9_12",
		name: "Abyssal Longsword",
		source_book: "Rift Ascendant Canon",
		description:
			"A versatile cutting blade with a tempered edge and Bureau service marks.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0971.webp",
		weight: 6,
		value: { currency: "gate", amount: 217 },
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
				fingerprint: "3124567c",
				payload_complete: true,
				uniqueness_seed: "item_p9_12::Abyssal Longsword",
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
					"Abyssal Longsword keys void melee blade versatile rules through signature fa5e5ccd.",
				role: "offense",
				signature: "fa5e5ccd",
				theme: "void",
			},
			passive_rules: [
				"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
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
					"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
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
		id: "item_p9_13",
		name: "Aetheric Longsword",
		source_book: "Rift Ascendant Canon",
		description:
			"A versatile blade — single-handed for speed, two-handed for finishing strokes.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0890.webp",
		weight: 6,
		value: { currency: "gate", amount: 165 },
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
				fingerprint: "6d022dd5",
				payload_complete: true,
				uniqueness_seed: "item_p9_13::Aetheric Longsword",
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
					"Aetheric Longsword keys aetheric melee blade versatile rules through signature 239fa7d4.",
				role: "offense",
				signature: "239fa7d4",
				theme: "aetheric",
			},
			passive_rules: [
				"While attuned, gain +1 to spell-attack rolls.",
				"+1 to initiative rolls while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "force",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"While attuned, gain +1 to spell-attack rolls.",
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
		id: "item_p9_14",
		name: "Abyssal Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A compact firearm machined to standard Ascendant Bureau tolerances. Fits any standard-issue holster.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0401.webp",
		weight: 4,
		value: { currency: "gate", amount: 42 },
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
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "shadow", "burst", "stealth", "void", "firearm"],
		theme_tags: ["elite-tier", "survival"],
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
				fingerprint: "38c360d9",
				payload_complete: true,
				uniqueness_seed: "item_p9_14::Abyssal Revolver",
				variant_note: "Sidearm. Reload (1) on a bonus action.",
			},
			formulas: {
				attack_roll: "d20 + AGI modifier + proficiency bonus + 1",
				damage_roll: "1d8 + AGI modifier + 1",
				recharge: "short-rest",
				save_dc: null,
			},
			identity: {
				rarity: "rare",
				archetype: "firearm_pistol",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Abyssal Revolver keys void firearm pistol rules through signature b6707284.",
				role: "offense",
				signature: "b6707284",
				theme: "void",
			},
			passive_rules: [
				"Sidearm. Reload (1) on a bonus action.",
				"On a critical hit, target is Frightened until the end of its next turn.",
				"While attuned, you have advantage on saves against the Stunned condition.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [
					{
						name: "Phase Step",
						description:
							"As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "1d8 + AGI modifier",
				damage_roll: true,
				on_hit: [
					"Sidearm. Reload (1) on a bonus action.",
					"On a critical hit, target is Frightened until the end of its next turn.",
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
				range: "Ranged (40/120)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p9_15",
		name: "Guild-Standard Stamina Stim",
		source_book: "Rift Ascendant Canon",
		description: "A pre-measured combat stim with Bureau-coded markings.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0680.webp",
		weight: 1,
		value: { currency: "crystal", amount: 3630 },
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
				uniqueness_seed: "item_p9_15::Guild-Standard Stamina Stim",
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
					"Guild-Standard Stamina Stim keys standard consumable stim rules through signature e33fcd2e.",
				role: "consumable",
				signature: "e33fcd2e",
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
		id: "item_p9_16",
		name: "Starlight Gauntlets",
		source_book: "Rift Ascendant Canon",
		description:
			"Field-issued combat gauntlets for Striker-class Ascendants and tactical brawlers.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0943.webp",
		weight: 1,
		value: { currency: "gate", amount: 42 },
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
				fingerprint: "918b130c",
				payload_complete: true,
				uniqueness_seed: "item_p9_16::Starlight Gauntlets",
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
					"Starlight Gauntlets keys starlight melee gauntlet rules through signature 02de9c14.",
				role: "offense",
				signature: "02de9c14",
				theme: "starlight",
			},
			passive_rules: [
				"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
				"On a critical hit, target is Blinded until the end of its next turn.",
				"+1 to Investigation and Insight checks while attuned.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "radiant",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
					"On a critical hit, target is Blinded until the end of its next turn.",
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
		id: "item_p9_17",
		name: "Purified Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-graded antidote calibrated for the most common gate-acquired afflictions.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0174.webp",
		weight: 8,
		value: { currency: "crystal", amount: 870 },
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
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "fire", "sustained", "consumable"],
		theme_tags: ["post-awakening", "black-market", "classified"],
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
				uniqueness_seed: "item_p9_17::Purified Aetheric Antidote",
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
					"Purified Aetheric Antidote keys aetheric consumable purifier rules through signature be1a7d93.",
				role: "consumable",
				signature: "be1a7d93",
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
		id: "item_p9_18",
		name: "Ascendant's Sniper Rifle",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-issued service rifle, balanced for accuracy over rate of fire.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0501.webp",
		weight: 4,
		value: { currency: "gate", amount: 324 },
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
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "sustained", "utility", "fire", "damage", "firearm"],
		theme_tags: ["dungeon-core", "modern-warfare", "elite-tier"],
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
				fingerprint: "2f8d92a7",
				payload_complete: true,
				uniqueness_seed: "item_p9_18::Ascendant's Sniper Rifle",
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
					"Ascendant's Sniper Rifle keys standard firearm rifle rules through signature 9f8873ee.",
				role: "offense",
				signature: "9f8873ee",
				theme: "standard",
			},
			passive_rules: [
				"Bolt-action. One attack per turn; +1 to attack rolls.",
				"Once per short rest, reroll a missed attack roll.",
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
				range: "Ranged (100/400)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p9_19",
		name: "Shadow Tactical Helmet",
		source_book: "Rift Ascendant Canon",
		description: "Reinforced headgear with mana-treated impact lining.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0644.webp",
		weight: 6,
		value: { currency: "gate", amount: 127 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				"Issued to a B-rank Ascendant on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "It's been hit so you don't have to be.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "shadow", "defensive", "damage", "armor"],
		theme_tags: ["dungeon-core", "ancient-power", "elite-tier"],
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
				fingerprint: "624d8573",
				payload_complete: true,
				uniqueness_seed: "item_p9_19::Shadow Tactical Helmet",
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
					"Shadow Tactical Helmet keys shadow armor headgear rules through signature 404fecee.",
				role: "defense",
				signature: "404fecee",
				theme: "shadow",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Reinforced headgear. Advantage on saves vs. concussive impacts.",
				"Disadvantage on attacks against you while you are obscured.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
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
					"Disadvantage on attacks against you while you are obscured.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p9_20",
		name: "Shadow Exo-Suit",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced kevlar-and-mana-weave layer. Cheap, common, effective.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0204.webp",
		weight: 3,
		value: { currency: "gate", amount: 381 },
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
				"Marked for retirement twice; pulled back into rotation by quartermaster discretion.",
			origin:
				"Issued to a B-rank Ascendant on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Pull the straps tight. Trust the maker.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "mobility", "void", "utility", "armor"],
		theme_tags: ["shadow-domain", "classified", "mana-overflow"],
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
				uniqueness_seed: "item_p9_20::Shadow Exo-Suit",
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
					"Shadow Exo-Suit keys shadow armor light rules through signature c127964d.",
				role: "defense",
				signature: "c127964d",
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
		id: "item_p9_21",
		name: "Nano-Weave Shin Guards",
		source_book: "Rift Ascendant Canon",
		description: "A Stalker-class light armor sized for extended gate sweeps.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0061.webp",
		weight: 5,
		value: { currency: "gate", amount: 308 },
		item_type: "armor",
		armor_class: "13 + AGI modifier",
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
					name: "Lattice Pulse",
					description:
						"As an action, emit a 15-ft. cone pulse. Each creature in the cone makes a DC 13 Vitality save, taking 3d6 force damage on a fail (half on success).",
					action: "action",
					dc: 13,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "d9e104d7",
				payload_complete: true,
				uniqueness_seed: "item_p9_21::Nano-Weave Shin Guards",
				variant_note:
					"Mana-stable weave. Resistance to a chosen damage type while attuned.",
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
					"Nano-Weave Shin Guards keys standard armor light rules through signature d1cde2a9.",
				role: "defense",
				signature: "d1cde2a9",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 13 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"Once per short rest, cast Misty Step (no spell slot required) while wielding this item.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "13 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides AC 13 + AGI modifier.",
					"Mana-stable weave. Resistance to a chosen damage type while attuned.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p9_22",
		name: "Obsidian Gauntlets",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced gauntlet that turns unarmed strikes into solid kinetic blows.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0714.webp",
		weight: 7,
		value: { currency: "gate", amount: 168 },
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
				"Earned a footnote in the Ascendant Bureau's quarterly equipment audit.",
			origin:
				"Salvaged from a collapsed B-rank gate in the old Cheongdam district.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "defensive", "burst", "melee"],
		theme_tags: ["experimental", "regent-era"],
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
				fingerprint: "77744faa",
				payload_complete: true,
				uniqueness_seed: "item_p9_22::Obsidian Gauntlets",
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
					"Obsidian Gauntlets keys shadow melee gauntlet rules through signature b65df502.",
				role: "offense",
				signature: "b65df502",
				theme: "shadow",
			},
			passive_rules: [
				"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
				"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
				"Add +1d4 damage when target is below half HP.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d4 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Aether-knuckles. Counts as an arcane focus and a Striker weapon.",
					"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
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
		id: "item_p9_23",
		name: "High-Grade Liquid Shadow",
		source_book: "Rift Ascendant Canon",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0043.webp",
		weight: 8,
		value: { currency: "crystal", amount: 3040 },
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
				uniqueness_seed: "item_p9_23::High-Grade Liquid Shadow",
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
					"High-Grade Liquid Shadow keys shadow consumable potion rules through signature 5723a55e.",
				role: "consumable",
				signature: "5723a55e",
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
		id: "item_p9_24",
		name: "Concentrated Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A small dose of curative liquid. One condition cleared per application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0776.webp",
		weight: 7,
		value: { currency: "crystal", amount: 2880 },
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
				"Pulled from the gear locker of a mid-rank Ascendant declared MIA during a C-rank sweep.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Calm hands, steady draw, full vial. Pick at least two.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "support", "damage", "shadow", "control", "consumable"],
		theme_tags: ["elite-tier", "system-glitch"],
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
				uniqueness_seed: "item_p9_24::Concentrated Aetheric Antidote",
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
					"Concentrated Aetheric Antidote keys aetheric consumable purifier rules through signature 5665705f.",
				role: "consumable",
				signature: "5665705f",
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
		id: "item_p9_25",
		name: "Greater Health Potion",
		source_book: "Rift Ascendant Canon",
		description: "A Bureau-licensed restorative draught.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0505.webp",
		weight: 3,
		value: { currency: "crystal", amount: 860 },
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
				uniqueness_seed: "item_p9_25::Greater Health Potion",
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
					"Greater Health Potion keys standard consumable potion rules through signature cc601247.",
				role: "consumable",
				signature: "cc601247",
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
		id: "item_p9_26",
		name: "Guild-Issue Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A short-barrel handgun tuned for fast draw and reliable function inside cramped gate corridors.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0270.webp",
		weight: 2,
		value: { currency: "gate", amount: 75 },
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
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "perception", "support", "buff", "firearm"],
		theme_tags: ["ancient-power", "mana-overflow", "black-market"],
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
				fingerprint: "523c4bce",
				payload_complete: true,
				uniqueness_seed: "item_p9_26::Guild-Issue Revolver",
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
					"Guild-Issue Revolver keys standard firearm pistol rules through signature a8f6caf7.",
				role: "offense",
				signature: "a8f6caf7",
				theme: "standard",
			},
			passive_rules: [
				"Snub-frame. Counts as a finesse weapon.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "piercing",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d6 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Snub-frame. Counts as a finesse weapon.",
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
		id: "item_p9_27",
		name: "Obsidian Revolver",
		source_book: "Rift Ascendant Canon",
		description:
			"A compact firearm machined to standard Ascendant Bureau tolerances. Fits any standard-issue holster.",
		rarity: "uncommon",
		type: "weapon",
		image:
			"/generated/compendium/weapons/weapon-weapon-obsidian-revolver-1o1uen.webp",
		weight: 5,
		value: { currency: "gate", amount: 464 },
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
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: [
			"equipment",
			"perception",
			"damage",
			"mobility",
			"single-target",
			"firearm",
		],
		theme_tags: ["black-market", "regent-era", "survival"],
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
				fingerprint: "aa9a3191",
				payload_complete: true,
				uniqueness_seed: "item_p9_27::Obsidian Revolver",
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
					"Obsidian Revolver keys shadow firearm pistol rules through signature 01418804.",
				role: "offense",
				signature: "01418804",
				theme: "shadow",
			},
			passive_rules: [
				"Magnum-frame. -1 to attack within 5 ft.",
				"While in dim light or darkness, attacks with this weapon have advantage.",
				"On a kill with this item, gain 1d4 temporary HP.",
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
					"While in dim light or darkness, attacks with this weapon have advantage.",
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
				range: "Ranged (40/120)",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p9_28",
		name: "Greater Mana Elixir",
		source_book: "Rift Ascendant Canon",
		description:
			"A regulated alchemical compound. Restores hit points on consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0692.webp",
		weight: 6,
		value: { currency: "crystal", amount: 1990 },
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
		theme_tags: ["dungeon-core", "ascendant-bureau"],
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
				uniqueness_seed: "item_p9_28::Greater Mana Elixir",
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
					"Greater Mana Elixir keys aetheric consumable potion rules through signature 5de521a5.",
				role: "consumable",
				signature: "5de521a5",
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
		id: "item_p9_29",
		name: "Lattice-Scale Combat Vest",
		source_book: "Rift Ascendant Canon",
		description: "A Stalker-class light armor sized for extended gate sweeps.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0789.webp",
		weight: 1,
		value: { currency: "gate", amount: 90 },
		item_type: "armor",
		armor_class: "12 + AGI modifier",
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
				fingerprint: "6f3d6247",
				payload_complete: true,
				uniqueness_seed: "item_p9_29::Lattice-Scale Combat Vest",
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
					"Lattice-Scale Combat Vest keys aetheric armor light rules through signature ad974607.",
				role: "defense",
				signature: "ad974607",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"+1 to spell-save DCs while worn.",
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
					"Mana-stable weave. Resistance to a chosen damage type while attuned.",
					"+1 to spell-save DCs while worn.",
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
		id: "item_p9_30",
		name: "Black-Market Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A regulated cure compound. Removes a single condition on application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0911.webp",
		weight: 2,
		value: { currency: "crystal", amount: 1490 },
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
				"Surfaced in the Ascendant Bureau's quartermaster log after a mid-tier extraction.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Half pharmacology, half hope.",
		discovery_lore:
			"Walked out of the gate in the bottom of a Ascendant's pack, mostly forgotten.",
		tags: ["equipment", "defensive", "healing", "consumable"],
		theme_tags: ["gate-zone", "experimental"],
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
				uniqueness_seed: "item_p9_30::Black-Market Aetheric Antidote",
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
					"Black-Market Aetheric Antidote keys aetheric consumable purifier rules through signature ea178a6a.",
				role: "consumable",
				signature: "ea178a6a",
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
		id: "item_p9_31",
		name: "Gate-Forged Tactical Helmet",
		source_book: "Rift Ascendant Canon",
		description: "Bureau-issued head protection, lightweight and fitted.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0374.webp",
		weight: 3,
		value: { currency: "gate", amount: 19 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				"Issued to a B-rank Ascendant on first deployment and never replaced.",
			personality: "",
			prior_owners: [],
		},
		flavor: "You don't notice it until you do. Then it's already saved you.",
		discovery_lore:
			"Catalogued at a Bureau intake desk after a routine third-party deposit.",
		tags: ["equipment", "control", "ice", "healing", "armor"],
		theme_tags: ["regent-era", "classified"],
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
				fingerprint: "7733ebdc",
				payload_complete: true,
				uniqueness_seed: "item_p9_31::Gate-Forged Tactical Helmet",
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
					"Gate-Forged Tactical Helmet keys standard armor headgear rules through signature 070d7571.",
				role: "defense",
				signature: "070d7571",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
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
					"Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter.",
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
		id: "item_p9_32",
		name: "Aegis Shin Guards",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced shield. Standard kit for line-holders inside high-rank gates.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0625.webp",
		weight: 8,
		value: { currency: "gate", amount: 190 },
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
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Recovered from the Bureau Vault-7 evidence locker after the Jeju Outbreak.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Showed up on a Bureau auction list after the original owner's contract lapsed.",
		tags: ["equipment", "burst", "ice", "armor"],
		theme_tags: ["dungeon-core", "guild-ops", "ascendant-bureau"],
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
				fingerprint: "d97a6764",
				payload_complete: true,
				uniqueness_seed: "item_p9_32::Aegis Shin Guards",
				variant_note: "Standard shield. +2 AC.",
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
					"Aegis Shin Guards keys standard armor shield rules through signature f15ea3a8.",
				role: "defense",
				signature: "f15ea3a8",
				theme: "standard",
			},
			passive_rules: [
				"Provides +3 AC while wielded.",
				"Standard shield. +2 AC.",
				"Once per short rest, treat a roll of 1-9 on an attack as a 10.",
			],
			resolution: {
				type: "armor_class",
				armor_class: "+2",
				armor_type: "Shield",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Provides +3 AC while wielded.",
					"Standard shield. +2 AC.",
					"Once per short rest, treat a roll of 1-9 on an attack as a 10.",
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
		id: "item_p9_33",
		name: "Titanium Tactical Helmet",
		source_book: "Rift Ascendant Canon",
		description: "Bureau-issued head protection, lightweight and fitted.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0896.webp",
		weight: 5,
		value: { currency: "gate", amount: 433 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				fingerprint: "ae00fe64",
				payload_complete: true,
				uniqueness_seed: "item_p9_33::Titanium Tactical Helmet",
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
					"Titanium Tactical Helmet keys standard armor headgear rules through signature 82d6c4b1.",
				role: "defense",
				signature: "82d6c4b1",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
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
					"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
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
		id: "item_p9_34",
		name: "Mana-Infused Spear",
		source_book: "Rift Ascendant Canon",
		description:
			"A two-handed reach weapon — good against fast, low-ground anomalies.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0939.webp",
		weight: 3,
		value: { currency: "gate", amount: 465 },
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
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Once per short rest, reroll a missed attack roll.",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Earned a footnote in the Ascendant Bureau's quarterly equipment audit.",
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
				fingerprint: "2dcc9c41",
				payload_complete: true,
				uniqueness_seed: "item_p9_34::Mana-Infused Spear",
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
					"Mana-Infused Spear keys aetheric melee polearm rules through signature f1983f10.",
				role: "offense",
				signature: "f1983f10",
				theme: "aetheric",
			},
			passive_rules: [
				"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
				"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
				"Once per short rest, reroll a missed attack roll.",
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
					"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
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
		id: "item_p9_35",
		name: "Void Gauntlets",
		source_book: "Rift Ascendant Canon",
		description:
			"A close-combat gauntlet favored by Strikers and unarmed-Mage hybrids.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0834.webp",
		weight: 2,
		value: { currency: "gate", amount: 474 },
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
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reliable. Honest. Mean when it has to be.",
		discovery_lore:
			"Surfaced from a private collection following the owner's retirement.",
		tags: ["equipment", "damage", "support", "psychic", "melee"],
		theme_tags: ["elite-tier", "dungeon-core", "mana-overflow"],
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
				fingerprint: "8bc82f36",
				payload_complete: true,
				uniqueness_seed: "item_p9_35::Void Gauntlets",
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
					"Void Gauntlets keys void melee gauntlet rules through signature dbf33f21.",
				role: "offense",
				signature: "dbf33f21",
				theme: "void",
			},
			passive_rules: [
				"Counts as an unarmed strike for Striker class features.",
				"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
				"On a kill with this item, gain 1d4 temporary HP.",
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
					"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
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
		id: "item_p9_36",
		name: "Lattice-Scale Combat Vest",
		source_book: "Rift Ascendant Canon",
		description:
			"A close-fitting armor jacket cut from mana-treated synthetic fiber.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0165.webp",
		weight: 1,
		value: { currency: "gate", amount: 278 },
		item_type: "armor",
		armor_class: "12 + AGI modifier",
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
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial.",
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
				fingerprint: "29baf307",
				payload_complete: true,
				uniqueness_seed: "item_p9_36::Lattice-Scale Combat Vest",
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
					"Lattice-Scale Combat Vest keys aetheric armor light rules through signature b10c8b77.",
				role: "defense",
				signature: "b10c8b77",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 12 + AGI modifier.",
				"Mana-stable weave. Resistance to a chosen damage type while attuned.",
				"+1 to spell-save DCs while worn.",
				"+1 to one save of your choice while attuned.",
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
					"+1 to spell-save DCs while worn.",
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
				range: "worn or wielded",
				area: null,
				line_of_effect: "equipment slot",
				target: "Self",
			},
		},
	},
	{
		id: "item_p9_37",
		name: "Greater Health Potion",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-graded medicinal draught. Effective when applied promptly.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0308.webp",
		weight: 5,
		value: { currency: "crystal", amount: 4390 },
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
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
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
				uniqueness_seed: "item_p9_37::Greater Health Potion",
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
					"Greater Health Potion keys standard consumable potion rules through signature 8459c068.",
				role: "consumable",
				signature: "8459c068",
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
		id: "item_p9_38",
		name: "Concentrated Stamina Stim",
		source_book: "Rift Ascendant Canon",
		description:
			"A medical stim packed for one-handed application during a fight.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0423.webp",
		weight: 7,
		value: { currency: "crystal", amount: 570 },
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
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "debuff", "damage", "void", "consumable"],
		theme_tags: ["ancient-power", "survival"],
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
				uniqueness_seed: "item_p9_38::Concentrated Stamina Stim",
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
					"Concentrated Stamina Stim keys standard consumable stim rules through signature e214e890.",
				role: "consumable",
				signature: "e214e890",
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
		id: "item_p9_39",
		name: "Guild-Issue Halberd",
		source_book: "Rift Ascendant Canon",
		description:
			"A glaive favored by gate-line tanks for keeping anomalies at distance.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/item-0918.webp",
		weight: 6,
		value: { currency: "gate", amount: 288 },
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "2d4",
		damage_type: "piercing",
		simple_properties: ["reach", "two-handed", "thrown"],
		range: "Thrown (20/60)",
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
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "healing", "fire", "debuff", "utility", "melee"],
		theme_tags: ["urban-combat", "rift-energy"],
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
					name: "Suppressive Volley",
					description:
						"As an action, force all creatures within a 15-ft. cone to make a DC 13 Agility save or take 2d6 damage of this weapon's type.",
					action: "action",
					dc: 13,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "1791601d",
				payload_complete: true,
				uniqueness_seed: "item_p9_39::Guild-Issue Halberd",
				variant_note:
					"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus + 1",
				damage_roll: "2d4 + STR modifier + 1",
				recharge: "short-rest",
				save_dc: "DC 13",
			},
			identity: {
				rarity: "rare",
				archetype: "melee_polearm",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Guild-Issue Halberd keys standard melee polearm rules through signature 7d53cdef.",
				role: "offense",
				signature: "7d53cdef",
				theme: "standard",
			},
			passive_rules: [
				"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
				"Critical hits with this item ignore resistance to its damage type.",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "piercing",
				active_options: [
					{
						name: "Suppressive Volley",
						description:
							"As an action, force all creatures within a 15-ft. cone to make a DC 13 Agility save or take 2d6 damage of this weapon's type.",
						dc: 13,
					},
				],
				attack_roll: true,
				damage_formula: "2d4 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Thrown reach (range 20/60). Returns to your hand at the start of your next turn.",
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
				range: "Melee",
				area: null,
				line_of_effect: "standard weapon targeting",
				target: "One creature or object",
			},
		},
	},
	{
		id: "item_p9_40",
		name: "Ceramic Bracers",
		source_book: "Rift Ascendant Canon",
		description: "A reinforced bracer with mild armor weave on the inner face.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0478.webp",
		weight: 7,
		value: { currency: "gate", amount: 205 },
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
			"What you carry tells the Bureau what kind of Ascendant you intend to be.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "defensive", "control", "lightning", "gear"],
		theme_tags: ["urban-combat", "rift-energy", "ancient-power"],
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
				fingerprint: "eaeb291a",
				payload_complete: true,
				uniqueness_seed: "item_p9_40::Ceramic Bracers",
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
					"Ceramic Bracers keys standard gear bracer rules through signature 55028e40.",
				role: "utility",
				signature: "55028e40",
				theme: "standard",
			},
			passive_rules: [
				"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				"Once per long rest, you may make one weapon attack as a bonus action.",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
				passive_effects: [
					"While worn, your unarmed strikes deal 1d4 bludgeoning damage.",
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
				range: "self",
				area: null,
				line_of_effect: "as item description permits",
				target: "Self, touched object, or listed utility target",
			},
		},
	},
	{
		id: "item_p9_41",
		name: "Black-Market Health Potion",
		source_book: "Rift Ascendant Canon",
		description:
			"A combat-grade healing compound packaged for sub-action consumption.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0991.webp",
		weight: 6,
		value: { currency: "crystal", amount: 2640 },
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
				uniqueness_seed: "item_p9_41::Black-Market Health Potion",
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
					"Black-Market Health Potion keys standard consumable potion rules through signature a81aabc9.",
				role: "consumable",
				signature: "a81aabc9",
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
		id: "item_p9_42",
		name: "Crimson Spear",
		source_book: "Rift Ascendant Canon",
		description:
			"A long-reach polearm balanced for crowd control and formation work.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0720.webp",
		weight: 2,
		value: { currency: "gate", amount: 410 },
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
				"Catalogued in the Ascendant Bureau's standard equipment registry after a six-month field trial.",
			origin:
				"Found embedded in a rift-touched alley wall in the post-gate Seoul reclamation zone.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tested in the dark, blooded in the bright.",
		discovery_lore:
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "support", "debuff", "radiant", "ice", "melee"],
		theme_tags: ["classified", "modern-warfare", "rift-energy"],
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
				fingerprint: "51bb85ef",
				payload_complete: true,
				uniqueness_seed: "item_p9_42::Crimson Spear",
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
					"Crimson Spear keys crimson melee polearm rules through signature dfe2b92a.",
				role: "offense",
				signature: "dfe2b92a",
				theme: "crimson",
			},
			passive_rules: [
				"Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft.",
				"On a hit, target takes 1d4 ongoing slashing damage at the start of its next two turns (Bleeding).",
				"Add +1d4 damage when target is below half HP.",
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
					"On a hit, target takes 1d4 ongoing slashing damage at the start of its next two turns (Bleeding).",
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
		id: "item_p9_43",
		name: "Titanium Breastplate",
		source_book: "Rift Ascendant Canon",
		description:
			"A breach-line plate harness rated for sustained anomaly contact.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/item-0705.webp",
		weight: 2,
		value: { currency: "gate", amount: 215 },
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
			"Brought to Bureau attention by a freelance Ascendant's anonymous tip.",
		tags: ["equipment", "stealth", "ice", "armor"],
		theme_tags: ["mana-overflow", "survival", "ancient-power"],
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
				fingerprint: "55a9ef50",
				payload_complete: true,
				uniqueness_seed: "item_p9_43::Titanium Breastplate",
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
					"Titanium Breastplate keys standard armor heavy rules through signature 5bcfc9d7.",
				role: "defense",
				signature: "5bcfc9d7",
				theme: "standard",
			},
			passive_rules: [
				"Provides AC 16. Stealth checks at disadvantage.",
				"Standard heavy plate. Stealth disadvantage.",
				"On a hit, target makes a DC 13 Vitality save or is disarmed of one held item.",
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
					"On a hit, target makes a DC 13 Vitality save or is disarmed of one held item.",
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
		id: "item_p9_44",
		name: "High-Grade Health Potion",
		source_book: "Rift Ascendant Canon",
		description:
			"A field-grade restorative used during extraction and post-fight recovery.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0930.webp",
		weight: 6,
		value: { currency: "crystal", amount: 2840 },
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
			"Found by a B-rank Ascendant on a bounty assignment in a half-cleared gate annex.",
		tags: ["equipment", "control", "shadow", "burst", "consumable"],
		theme_tags: ["gate-zone", "system-glitch", "ascendant-bureau"],
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
				uniqueness_seed: "item_p9_44::High-Grade Health Potion",
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
					"High-Grade Health Potion keys standard consumable potion rules through signature e76676cc.",
				role: "consumable",
				signature: "e76676cc",
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
		id: "item_p9_45",
		name: "Lattice-Scale Tactical Helmet",
		source_book: "Rift Ascendant Canon",
		description: "Bureau-issued head protection, lightweight and fitted.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0003.webp",
		weight: 6,
		value: { currency: "gate", amount: 473 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				fingerprint: "5ed85f02",
				payload_complete: true,
				uniqueness_seed: "item_p9_45::Lattice-Scale Tactical Helmet",
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
					"Lattice-Scale Tactical Helmet keys aetheric armor headgear rules through signature d2406f8e.",
				role: "defense",
				signature: "d2406f8e",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
				"+1 to spell-save DCs while worn.",
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
					"Mask-style headgear. Advantage on saves vs. inhaled poisons and gases.",
					"+1 to spell-save DCs while worn.",
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
		id: "item_p9_46",
		name: "Lesser Aetheric Antidote",
		source_book: "Rift Ascendant Canon",
		description:
			"A small dose of curative liquid. One condition cleared per application.",
		rarity: "common",
		type: "consumable",
		image: "/generated/compendium/items/item-0404.webp",
		weight: 2,
		value: { currency: "crystal", amount: 4970 },
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
				"Earned a footnote in the Ascendant Bureau's quarterly equipment audit.",
			origin:
				"Logged into the Ascendant Bureau's master inventory the day it was first sold.",
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
				uniqueness_seed: "item_p9_46::Lesser Aetheric Antidote",
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
					"Lesser Aetheric Antidote keys aetheric consumable purifier rules through signature 5bedb62d.",
				role: "consumable",
				signature: "5bedb62d",
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
		id: "item_p9_47",
		name: "Aether-Plated Exo-Suit",
		source_book: "Rift Ascendant Canon",
		description:
			"A multi-layer combat coat woven from impact-resistant fabric.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0261.webp",
		weight: 6,
		value: { currency: "gate", amount: 123 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
			"Logged in a Ascendant's after-action report as 'recovered with the rest of the load.'",
		tags: ["equipment", "single-target", "debuff", "shadow", "void", "armor"],
		theme_tags: ["experimental", "urban-combat"],
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
				fingerprint: "6c7fcf17",
				payload_complete: true,
				uniqueness_seed: "item_p9_47::Aether-Plated Exo-Suit",
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
					"Aether-Plated Exo-Suit keys aetheric armor light rules through signature ec15460a.",
				role: "defense",
				signature: "ec15460a",
				theme: "aetheric",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Resistance to force damage.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
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
		id: "item_p9_48",
		name: "Starlight Warhammer",
		source_book: "Rift Ascendant Canon",
		description:
			"A heavy maul with a Bureau-stamped haft and a head heavy enough to dent gate steel.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/item-0966.webp",
		weight: 5,
		value: { currency: "gate", amount: 73 },
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
				"Mentioned in the post-mortem on the Cheongdam cascade event as critical to two Ascendants' survival.",
			origin:
				"Bought at auction by a private guild and re-issued to a Ascendant strike team.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Carried by people who know the difference between a kill and a survival.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "shadow", "stealth", "melee"],
		theme_tags: ["post-awakening", "system-glitch"],
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
				fingerprint: "5c92b4c4",
				payload_complete: true,
				uniqueness_seed: "item_p9_48::Starlight Warhammer",
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
					"Starlight Warhammer keys starlight melee bludgeon heavy rules through signature 3d99778e.",
				role: "offense",
				signature: "3d99778e",
				theme: "starlight",
			},
			passive_rules: [
				"On a hit, target makes a DC 13 Strength save or is knocked prone.",
				"On a critical hit, target is Blinded until the end of its next turn.",
				"On a hit against a Frightened creature, deal +1d4 damage.",
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
		id: "item_p9_49",
		name: "Shadow Combat Vest",
		source_book: "Rift Ascendant Canon",
		description:
			"A field armor designed to keep mobility without sacrificing all protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0447.webp",
		weight: 7,
		value: { currency: "gate", amount: 434 },
		item_type: "armor",
		armor_class: "11 + AGI modifier",
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
				fingerprint: "7edb34d0",
				payload_complete: true,
				uniqueness_seed: "item_p9_49::Shadow Combat Vest",
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
					"Shadow Combat Vest keys shadow armor light rules through signature 1d403a42.",
				role: "defense",
				signature: "1d403a42",
				theme: "shadow",
			},
			passive_rules: [
				"Provides AC 11 + AGI modifier.",
				"Light, flexible armor weave. Standard kit for fast movers.",
				"Advantage on Stealth checks made in dim light or darkness.",
				"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
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
];
