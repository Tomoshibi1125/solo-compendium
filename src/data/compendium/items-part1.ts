import type { Item } from "./items";

export const items_part1: Item[] = [
	{
		id: "bg-emr-uniform",
		name: "Emergency Medical Responder Uniform",
		source_book: "Rift Ascendant Canon",
		description:
			"A fire-resistant, high-visibility uniform worn by emergency medical technicians. Features reflective strips, reinforced elbows, and multiple utility pockets. Surprisingly durable against minor aetheric burns.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/backgrounds/paramedic-generated-n8asxs.webp",
		weight: 4,
		value: 15,
		item_type: "misc",
		effects: {
			passive: ["+1 to Medicine checks when worn"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Paramedic uniforms became standard Ascendant Bureau gear after the First Gate Surge. Every team needs a medic.",
			origin:
				"Standard Bureau-issued emergency response gear, distributed to medical personnel attached to gate-clearing teams.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Run toward the chaos. That's the job.",
		discovery_lore:
			"Available from Ascendant Bureau medical supply depots. Unglamorous but essential.",
		tags: ["equipment", "area", "offensive", "single-target", "debuff"],
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
				fingerprint: "1a6e1dfe",
				payload_complete: true,
				uniqueness_seed: "bg-emr-uniform::Emergency Medical Responder Uniform",
				variant_note:
					"Tailored uniform. Conveys formal Bureau status; +2 to Intimidation checks against civilians.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_attire",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Emergency Medical Responder Uniform keys standard gear attire rules through signature 380589d8.",
				role: "utility",
				signature: "380589d8",
				theme: "standard",
			},
			passive_rules: ["+1 to Medicine checks when worn"],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution: "+1 to Medicine checks when worn",
				passive_effects: ["+1 to Medicine checks when worn"],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-trauma-kit",
		name: "First-Aid Trauma Kit",
		source_book: "Rift Ascendant Canon",
		description:
			"A professional-grade trauma kit containing tourniquets, chest seals, hemostatic gauze, airway management tools, and aetheric stabilization crystals added post-awakening. Functions as a Healer's Kit with 15 uses.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0471.webp",
		weight: 5,
		value: 25,
		item_type: "tool",
		effects: {
			passive: ["+2 to Medicine checks to stabilize a creature"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Upgraded with aetheric stabilization crystals after it was discovered that standard hemostatic agents are less effective on wounds from anomaly attacks.",
			origin:
				"Professional-grade trauma gear standard-issued to Ascendant Bureau medical teams after the First Gate Surge.",
			personality: "",
			prior_owners: [],
		},
		flavor: "15 uses. Make them count.",
		discovery_lore:
			"Available at Ascendant Bureau supply depots. Required kit for any certified medic on a gate team.",
		tags: ["equipment", "stealth", "control", "support"],
		theme_tags: ["mana-overflow", "guild-ops", "ancient-power"],
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
				fingerprint: "6f76a11c",
				payload_complete: true,
				uniqueness_seed: "bg-trauma-kit::First-Aid Trauma Kit",
				variant_note: "Bureau standard toolkit. +2 to relevant tool checks.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_kit",
				canon_basis: "RA canon",
				distinguishing_rule:
					"First-Aid Trauma Kit keys standard gear kit rules through signature 66eccdea.",
				role: "utility",
				signature: "66eccdea",
				theme: "standard",
			},
			passive_rules: ["+2 to Medicine checks to stabilize a creature"],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution: "+2 to Medicine checks to stabilize a creature",
				passive_effects: ["+2 to Medicine checks to stabilize a creature"],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-phantom-pager",
		name: "Phantom Pager",
		source_book: "Rift Ascendant Canon",
		description:
			"A pre-gate-era pager that still buzzes with phantom alerts. Sometimes it picks up frequencies from nearby rifts, providing a few seconds' warning before dimensional instability spikes. Old paramedics swear by them.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0177.webp",
		weight: 0.2,
		value: 5,
		item_type: "misc",
		effects: {
			passive: [
				"Buzzes faintly when within 300 feet of an unstable rift (50% reliability)",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			origin:
				"Emerged from the Ascendant Bureau's classified Project: Lattice Break experiments.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Ascendant's go-bag.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["equipment", "psychic", "single-target"],
		theme_tags: ["modern-warfare", "dimensional-bleed"],
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
				fingerprint: "9bde0dbf",
				payload_complete: true,
				uniqueness_seed: "bg-phantom-pager::Phantom Pager",
				variant_note: "A piece of Bureau-quartermastered field gear.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Phantom Pager keys void gear misc rules through signature 4e51c3a4.",
				role: "utility",
				signature: "4e51c3a4",
				theme: "void",
			},
			passive_rules: [
				"Buzzes faintly when within 300 feet of an unstable rift (50% reliability)",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Buzzes faintly when within 300 feet of an unstable rift (50% reliability)",
				passive_effects: [
					"Buzzes faintly when within 300 feet of an unstable rift (50% reliability)",
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
		id: "bg-cracked-laptop",
		name: "Cracked-Screen Laptop",
		source_book: "Rift Ascendant Canon",
		description:
			"A battered laptop with a spiderweb crack across the screen. Still functional, loaded with spreadsheet software, encrypted corporate data, and a surprisingly useful offline database of guild regulations.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0724.webp",
		weight: 3,
		value: 50,
		item_type: "tool",
		effects: {
			passive: ["+1 to Investigation checks involving data analysis"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Regent Wars.",
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Ascendant factions.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Cheap, ubiquitous, and sometimes the only thing between you and a black bag.",
		discovery_lore:
			"Appeared in a Ascendant's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "lightning", "necrotic", "defensive"],
		theme_tags: ["guild-ops", "ancient-power", "urban-combat"],
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
				fingerprint: "7deabe43",
				payload_complete: true,
				uniqueness_seed: "bg-cracked-laptop::Cracked-Screen Laptop",
				variant_note: "A miscellaneous piece of standard Ascendant kit.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Cracked-Screen Laptop keys standard gear misc rules through signature 70484368.",
				role: "utility",
				signature: "70484368",
				theme: "standard",
			},
			passive_rules: ["+1 to Investigation checks involving data analysis"],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+1 to Investigation checks involving data analysis",
				passive_effects: ["+1 to Investigation checks involving data analysis"],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-company-badge",
		name: "Dissolved Corporation ID Badge",
		source_book: "Rift Ascendant Canon",
		description:
			"A laminated ID badge from a corporation that no longer exists. The magnetic strip still works on some old security systems. A reminder of the world before gates.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0895.webp",
		weight: 0.1,
		value: 1,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			origin:
				"Born from a Order glitch that briefly merged two overlapping Gate instances.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "shadow", "control", "void"],
		theme_tags: ["ancient-power", "elite-tier", "survival"],
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
				fingerprint: "9ecfee76",
				payload_complete: true,
				uniqueness_seed: "bg-company-badge::Dissolved Corporation ID Badge",
				variant_note:
					"Bureau-recognized ID + lattice-coded encryption. Grants access to restricted Bureau labs.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_credential",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Dissolved Corporation ID Badge keys standard gear credential rules through signature 234755cf.",
				role: "utility",
				signature: "234755cf",
				theme: "standard",
			},
			passive_rules: [],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Resolve the item through the listed utility effect.",
				passive_effects: [],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-business-suit",
		name: "Crumpled Business Suit",
		source_book: "Rift Ascendant Canon",
		description:
			"A once-crisp business suit now wrinkled and worn from gate-zone exposure. Still passable for formal occasions. The jacket pockets are reinforced from years of carrying too many pens.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0656.webp",
		weight: 3,
		value: 20,
		item_type: "misc",
		effects: {
			passive: ["+1 to Persuasion checks in formal settings"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The American Ascendant Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			origin:
				"Translated from forbidden shadow-language inscriptions found in a Regent's throne room.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Ascendant's go-bag.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "debuff", "buff", "necrotic"],
		theme_tags: ["rift-energy", "survival"],
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
				fingerprint: "16ad8853",
				payload_complete: true,
				uniqueness_seed: "bg-business-suit::Crumpled Business Suit",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Crumpled Business Suit keys standard gear misc rules through signature 801795e7.",
				role: "utility",
				signature: "801795e7",
				theme: "standard",
			},
			passive_rules: ["+1 to Persuasion checks in formal settings"],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution: "+1 to Persuasion checks in formal settings",
				passive_effects: ["+1 to Persuasion checks in formal settings"],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-safety-vest",
		name: "Reinforced Safety Vest",
		source_book: "Rift Ascendant Canon",
		description:
			"A high-visibility safety vest with mana-threaded reflective strips. Post-gate modifications include aetheric shielding mesh in the lining. Provides minimal protection but excellent visibility.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/item-0893.webp",
		weight: 2,
		value: 10,
		item_type: "armor",
		armor_class: "11 + AGI modifier",
		armor_type: "Light",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Intelligence reports link this to the Shadow Regent's army, though the connection remains unconfirmed.",
			origin:
				"Pulled from the dreams of a comatose S-Rank Ascendant by a team of psychic-type Awakened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau Technomancer who've patched real wounds.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "debuff", "utility", "psychic", "healing"],
		theme_tags: ["ancient-power", "mana-overflow", "rift-energy"],
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
				fingerprint: "9db05e72",
				payload_complete: true,
				uniqueness_seed: "bg-safety-vest::Reinforced Safety Vest",
				variant_note:
					"Mana-stable weave. Resistance to a chosen damage type while attuned.",
			},
			formulas: {
				armor_class: "11 + AGI modifier",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "common",
				archetype: "armor_light",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Reinforced Safety Vest keys standard armor light rules through signature 17ca6b24.",
				role: "defense",
				signature: "17ca6b24",
				theme: "standard",
			},
			passive_rules: [],
			resolution: {
				type: "armor_class",
				armor_class: "11 + AGI modifier",
				armor_type: "Light",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
				canon_guardrails: [
					"Use RA ability names in formulas.",
					"Preserve gate, mana lattice, and anomaly terminology.",
					"Do not substitute unrelated fantasy species, regent, or D&D class lore.",
				],
				ra_specific_mundane: true,
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
		id: "bg-dented-hardhat",
		name: "Dented Hard Hat",
		source_book: "Rift Ascendant Canon",
		description:
			"A well-worn hard hat covered in scuff marks and dents from falling debris. The interior padding has been replaced with impact-absorbing gel salvaged from gate-beast shells.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0675.webp",
		weight: 1,
		value: 5,
		item_type: "misc",
		effects: {
			passive: ["Advantage on saves against falling debris and cave-ins"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Ascendant warfare.",
			origin:
				"Excavated from a pocket dimension that existed for exactly one hour before collapsing.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Ascendant's go-bag.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "debuff", "shadow", "single-target"],
		theme_tags: ["ancient-power", "dungeon-core", "ascendant-bureau"],
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
				fingerprint: "41da64dd",
				payload_complete: true,
				uniqueness_seed: "bg-dented-hardhat::Dented Hard Hat",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Dented Hard Hat keys standard gear misc rules through signature 5e3c4073.",
				role: "utility",
				signature: "5e3c4073",
				theme: "standard",
			},
			passive_rules: ["Advantage on saves against falling debris and cave-ins"],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Advantage on saves against falling debris and cave-ins",
				passive_effects: [
					"Advantage on saves against falling debris and cave-ins",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-heavy-multitool",
		name: "Heavy-Duty Multi-Tool",
		source_book: "Rift Ascendant Canon",
		description:
			"An industrial-grade multi-tool with pliers, wire cutters, screwdrivers, a bottle opener, and a small pry bar. Built to survive construction sites and gate zones alike.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0759.webp",
		weight: 1,
		value: 15,
		item_type: "tool",
		effects: {
			passive: ["+1 to checks involving improvised repairs"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Records indicate this was used by the original Clearing Party that neutralized the first S-Rank Gate on Korean soil.",
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Ascendant's go-bag.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "support", "damage", "stealth"],
		theme_tags: ["classified", "survival"],
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
				fingerprint: "1a52ad51",
				payload_complete: true,
				uniqueness_seed: "bg-heavy-multitool::Heavy-Duty Multi-Tool",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Heavy-Duty Multi-Tool keys standard gear misc rules through signature fd6d979b.",
				role: "utility",
				signature: "fd6d979b",
				theme: "standard",
			},
			passive_rules: ["+1 to checks involving improvised repairs"],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution: "+1 to checks involving improvised repairs",
				passive_effects: ["+1 to checks involving improvised repairs"],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-press-badge",
		name: "Weathered Press Badge",
		source_book: "Rift Ascendant Canon",
		description:
			"A laminated press badge from a major news outlet. Faded but still recognizable. Opens doors that would otherwise stay shut, and commands a begrudging respect from officials.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0887.webp",
		weight: 0.1,
		value: 5,
		item_type: "misc",
		effects: {
			passive: [
				"+2 to Persuasion checks when requesting access or information from officials",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"A-Rank appraiser Guild Master Ryker personally verified its authenticity before it entered general circulation.",
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Cheap, ubiquitous, and sometimes the only thing between you and a black bag.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "burst", "single-target"],
		theme_tags: ["experimental", "elite-tier"],
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
				fingerprint: "695adeca",
				payload_complete: true,
				uniqueness_seed: "bg-press-badge::Weathered Press Badge",
				variant_note:
					"Bureau-recognized ID. +1 to social checks made with Bureau personnel.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_credential",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Weathered Press Badge keys standard gear credential rules through signature 88253395.",
				role: "utility",
				signature: "88253395",
				theme: "standard",
			},
			passive_rules: [
				"+2 to Persuasion checks when requesting access or information from officials",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+2 to Persuasion checks when requesting access or information from officials",
				passive_effects: [
					"+2 to Persuasion checks when requesting access or information from officials",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-voice-recorder",
		name: "Digital Voice Recorder",
		source_book: "Rift Ascendant Canon",
		description:
			"A professional digital voice recorder with hours of gate-break interviews, eyewitness accounts, and field notes. The batteries last seemingly forever, and it picks up aetheric interference patterns.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0151.webp",
		weight: 0.3,
		value: 30,
		item_type: "tool",
		effects: {
			passive: ["+1 to Investigation checks involving interviews"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Regent Wars.",
			origin:
				"Found clutched in the hand of a petrified E-Rank Ascendant who had been missing for three years.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Ascendant's go-bag.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "healing", "stealth", "damage"],
		theme_tags: ["experimental", "rift-energy"],
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
				fingerprint: "357fdb60",
				payload_complete: true,
				uniqueness_seed: "bg-voice-recorder::Digital Voice Recorder",
				variant_note:
					"+1 to Investigation checks involving data analysis and surveillance.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_electronics",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Digital Voice Recorder keys standard gear electronics rules through signature df7b0810.",
				role: "utility",
				signature: "df7b0810",
				theme: "standard",
			},
			passive_rules: ["+1 to Investigation checks involving interviews"],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+1 to Investigation checks involving interviews",
				passive_effects: ["+1 to Investigation checks involving interviews"],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-encrypted-notebook",
		name: "Encrypted Contact Notebook",
		source_book: "Rift Ascendant Canon",
		description:
			"A leather-bound notebook filled with contacts, encrypted notes, source information, and hastily sketched gate-zone maps. Written in a personal shorthand that only you can decipher.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0580.webp",
		weight: 0.5,
		value: 10,
		item_type: "misc",
		effects: {
			passive: [
				"Contains d4 useful contacts in any major city (Warden discretion)",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
			origin:
				"Distilled from the ambient mana of a Red Gate that refused to close for seventeen days.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Binds the fabric of reality. A testament to what Ascendants have become.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "single-target", "stealth"],
		theme_tags: ["classified", "guild-ops"],
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
				fingerprint: "83b9a7c2",
				payload_complete: true,
				uniqueness_seed: "bg-encrypted-notebook::Encrypted Contact Notebook",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Encrypted Contact Notebook keys standard gear misc rules through signature 52e644ef.",
				role: "utility",
				signature: "52e644ef",
				theme: "standard",
			},
			passive_rules: [
				"Contains d4 useful contacts in any major city (Warden discretion)",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Contains d4 useful contacts in any major city (Warden discretion)",
				passive_effects: [
					"Contains d4 useful contacts in any major city (Warden discretion)",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-market-stall",
		name: "Collapsible Market Stall",
		source_book: "Rift Ascendant Canon",
		description:
			"A lightweight, foldable aluminum frame with a canvas awning. Sets up in under 2 minutes. Has survived three gate-storms and countless turf wars. Smells faintly of fried food.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0923.webp",
		weight: 15,
		value: 20,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			origin:
				"Emerged from the Ascendant Bureau's classified Project: Lattice Break experiments.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Commands the remnants of a dead world. Proof that some things cannot be survived.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["equipment", "damage", "lightning"],
		theme_tags: ["gate-zone", "black-market", "shadow-domain"],
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
				fingerprint: "f6aa3d87",
				payload_complete: true,
				uniqueness_seed: "bg-market-stall::Collapsible Market Stall",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Collapsible Market Stall keys standard gear misc rules through signature f7577325.",
				role: "utility",
				signature: "f7577325",
				theme: "standard",
			},
			passive_rules: [],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Resolve the item through the listed utility effect.",
				passive_effects: [],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-lucky-coin",
		name: "Lucky First-Sale Coin",
		source_book: "Rift Ascendant Canon",
		description:
			"A battered coin from your very first sale. You've carried it every day since. It's probably not magical, but you've never had a truly bad day while carrying it. Probably.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0004.webp",
		weight: 0.01,
		value: 0.1,
		item_type: "misc",
		effects: {
			passive: [
				"Once per long rest, reroll a failed Persuasion check involving commerce",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"A-Rank appraiser Guild Master Ryker personally verified its authenticity before it entered general circulation.",
			origin:
				"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Crushes the remnants of a dead world. A whisper from the edge of oblivion.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "healing", "sustained"],
		theme_tags: ["classified", "post-awakening", "system-glitch"],
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
				fingerprint: "e02733bb",
				payload_complete: true,
				uniqueness_seed: "bg-lucky-coin::Lucky First-Sale Coin",
				variant_note: "A piece of Bureau-quartermastered field gear.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Lucky First-Sale Coin keys standard gear misc rules through signature afb97053.",
				role: "utility",
				signature: "afb97053",
				theme: "standard",
			},
			passive_rules: [
				"Once per long rest, reroll a failed Persuasion check involving commerce",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Once per long rest, reroll a failed Persuasion check involving commerce",
				passive_effects: [
					"Once per long rest, reroll a failed Persuasion check involving commerce",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-customer-ledger",
		name: "Customer Ledger",
		source_book: "Rift Ascendant Canon",
		description:
			"A dog-eared ledger filled with regular customer names, preferences, debts owed, and favors to collect. An invaluable network resource disguised as a worn notebook.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0022.webp",
		weight: 0.5,
		value: 5,
		item_type: "misc",
		effects: {
			passive: [
				"+1 to Persuasion checks in marketplace or commercial settings",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Ignites the fabric of reality. A testament to what Ascendants have become.",
		discovery_lore:
			"Appeared in a Ascendant's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "control", "mobility", "defensive", "support"],
		theme_tags: ["dimensional-bleed", "elite-tier"],
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
				fingerprint: "724178ce",
				payload_complete: true,
				uniqueness_seed: "bg-customer-ledger::Customer Ledger",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Customer Ledger keys standard gear misc rules through signature 6e46fc8f.",
				role: "utility",
				signature: "6e46fc8f",
				theme: "standard",
			},
			passive_rules: [
				"+1 to Persuasion checks in marketplace or commercial settings",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+1 to Persuasion checks in marketplace or commercial settings",
				passive_effects: [
					"+1 to Persuasion checks in marketplace or commercial settings",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-security-uniform",
		name: "Reinforced Security Uniform",
		source_book: "Rift Ascendant Canon",
		description:
			"A private security uniform with kevlar-lined panels and guild-standard reinforcement patches. The badge is from a company that was absorbed into the Ascendant Bureau.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/item-0755.webp",
		weight: 5,
		value: 25,
		item_type: "armor",
		armor_class: "12 + AGI modifier",
		armor_type: "Light",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["equipment", "single-target", "defensive"],
		theme_tags: ["system-glitch", "black-market"],
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
				fingerprint: "587e25f8",
				payload_complete: true,
				uniqueness_seed: "bg-security-uniform::Reinforced Security Uniform",
				variant_note:
					"Tailored uniform. Conveys formal Bureau status; +2 to Intimidation checks against civilians.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_attire",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Reinforced Security Uniform keys standard gear attire rules through signature 4ede6bf1.",
				role: "utility",
				signature: "4ede6bf1",
				theme: "standard",
			},
			passive_rules: [],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Resolve the item through the listed utility effect.",
				passive_effects: [],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-tactical-flashlight",
		name: "Tactical Flashlight Baton",
		source_book: "Rift Ascendant Canon",
		description:
			"A heavy-duty flashlight that doubles as a baton. Military-grade LED with 1000 lumens. The weighted aluminum body makes it an effective improvised weapon (1d4 bludgeoning).",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0518.webp",
		weight: 2,
		value: 15,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d4",
		damage_type: "bludgeoning",
		simple_properties: ["light"],
		effects: {
			passive: ["Provides 60 ft bright light, 120 ft dim light"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The American Ascendant Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			origin:
				"Pulled from the dreams of a comatose S-Rank Ascendant by a team of psychic-type Awakened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Bureau-issue. Inventoried. Forgotten.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["equipment", "sustained", "mobility", "psychic", "buff"],
		theme_tags: ["elite-tier", "gate-zone"],
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
				fingerprint: "51f4db97",
				payload_complete: true,
				uniqueness_seed: "bg-tactical-flashlight::Tactical Flashlight Baton",
				variant_note:
					"Acts as an arcane focus. Once per short rest, cast a known cantrip without expending an action.",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d4 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "focus_wand",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Tactical Flashlight Baton keys standard focus wand rules through signature aa899e2e.",
				role: "offense",
				signature: "aa899e2e",
				theme: "standard",
			},
			passive_rules: ["Provides 60 ft bright light, 120 ft dim light"],
			resolution: {
				type: "weapon_attack",
				damage_type: "bludgeoning",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d4 + STR modifier",
				damage_roll: true,
				on_hit: ["Provides 60 ft bright light, 120 ft dim light"],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-guild-radio",
		name: "Modified Security Radio",
		source_book: "Rift Ascendant Canon",
		description:
			"A worn security radio jury-rigged to pick up guild tactical frequencies and emergency broadcasts. Range: 5 miles in urban environments, less in gate zones.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0663.webp",
		weight: 0.5,
		value: 20,
		item_type: "tool",
		effects: {
			passive: ["Can monitor guild and emergency frequencies within 5 miles"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The Japanese Ascendant Bureau attempted to classify this as a national treasure to prevent export.",
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Ascendant factions.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Binds the architect's design. Proof that some things cannot be survived.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "defensive", "psychic"],
		theme_tags: ["mana-overflow", "system-glitch"],
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
				fingerprint: "e89c1b4a",
				payload_complete: true,
				uniqueness_seed: "bg-guild-radio::Modified Security Radio",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Modified Security Radio keys standard gear misc rules through signature d15813db.",
				role: "utility",
				signature: "d15813db",
				theme: "standard",
			},
			passive_rules: [
				"Can monitor guild and emergency frequencies within 5 miles",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Can monitor guild and emergency frequencies within 5 miles",
				passive_effects: [
					"Can monitor guild and emergency frequencies within 5 miles",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-delivery-uniform",
		name: "Reflective Delivery Uniform",
		source_book: "Rift Ascendant Canon",
		description:
			"A battered delivery uniform with reflective strips and padding at the knees and elbows. Designed for long hours on the road. The company logo has been scratched off.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0461.webp",
		weight: 2,
		value: 10,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"First documented during the Second Awakening Wave, when Ascendants worldwide reported spontaneous power surges.",
			origin:
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Cheap, ubiquitous, and sometimes the only thing between you and a black bag.",
		discovery_lore:
			"Discovered by an E-Rank Ascendant who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["equipment", "sustained", "defensive", "utility", "offensive"],
		theme_tags: ["survival", "regent-era", "rift-energy"],
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
				fingerprint: "587e25f8",
				payload_complete: true,
				uniqueness_seed: "bg-delivery-uniform::Reflective Delivery Uniform",
				variant_note:
					"+1 to social checks in formal or guild-administrative settings.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_attire",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Reflective Delivery Uniform keys standard gear attire rules through signature c221e507.",
				role: "utility",
				signature: "c221e507",
				theme: "standard",
			},
			passive_rules: [],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Resolve the item through the listed utility effect.",
				passive_effects: [],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-gate-gps",
		name: "Gate-Zone GPS Device",
		source_book: "Rift Ascendant Canon",
		description:
			"A GPS device jury-rigged for navigation through gate-damaged urban zones. Crowd-sourced data from other drivers keeps the maps updated with rift locations, blocked roads, and safe passages.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0804.webp",
		weight: 0.3,
		value: 40,
		item_type: "tool",
		effects: {
			passive: [
				"+2 to Survival checks to navigate urban environments",
				"Shows known rift locations within 10 miles",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			origin:
				"Recovered from the personal vault of a National-Level Ascendant who vanished during the First Calamity.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Overrides the last defense of the unprepared. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "ice", "support", "lightning"],
		theme_tags: ["modern-warfare", "survival"],
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
				fingerprint: "5db8f6d7",
				payload_complete: true,
				uniqueness_seed: "bg-gate-gps::Gate-Zone GPS Device",
				variant_note: "A piece of Bureau-quartermastered field gear.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Gate-Zone GPS Device keys standard gear misc rules through signature c2b180b9.",
				role: "utility",
				signature: "c2b180b9",
				theme: "standard",
			},
			passive_rules: [
				"+2 to Survival checks to navigate urban environments",
				"Shows known rift locations within 10 miles",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+2 to Survival checks to navigate urban environments",
				passive_effects: [
					"+2 to Survival checks to navigate urban environments",
					"Shows known rift locations within 10 miles",
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
		id: "bg-thermal-bag",
		name: "Aetheric Thermal Bag",
		source_book: "Rift Ascendant Canon",
		description:
			"An insulated delivery bag modified with aetheric cold crystals. Originally for keeping food fresh, now used to transport rift potions, unstable reagents, and temperature-sensitive materials.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0320.webp",
		weight: 2,
		value: 15,
		item_type: "misc",
		effects: {
			passive: [
				"Keeps contents at a stable temperature for 24 hours",
				"Potions stored inside maintain potency 50% longer",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Cheap, ubiquitous, and sometimes the only thing between you and a black bag.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "void", "radiant", "sustained", "buff"],
		theme_tags: ["post-awakening", "gate-zone", "modern-warfare"],
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
				fingerprint: "d0564012",
				payload_complete: true,
				uniqueness_seed: "bg-thermal-bag::Aetheric Thermal Bag",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aetheric Thermal Bag keys aetheric gear misc rules through signature 107f8294.",
				role: "utility",
				signature: "107f8294",
				theme: "aetheric",
			},
			passive_rules: [
				"Keeps contents at a stable temperature for 24 hours",
				"Potions stored inside maintain potency 50% longer",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Keeps contents at a stable temperature for 24 hours",
				passive_effects: [
					"Keeps contents at a stable temperature for 24 hours",
					"Potions stored inside maintain potency 50% longer",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-teacher-satchel",
		name: "Teacher's Leather Satchel",
		source_book: "Rift Ascendant Canon",
		description:
			"A worn leather satchel containing a class roster from a school that no longer exists, graded papers, and a collection of educational materials. The strap has been repaired twice.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0291.webp",
		weight: 3,
		value: 15,
		item_type: "misc",
		effects: {
			passive: [
				"Can hold up to 30 lbs of books and documents without encumbrance",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"A-Rank appraiser Guild Master Ryker personally verified its authenticity before it entered general circulation.",
			origin:
				"Found clutched in the hand of a petrified E-Rank Ascendant who had been missing for three years.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "mobility", "psychic"],
		theme_tags: ["dimensional-bleed", "mana-overflow"],
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
				fingerprint: "b196125b",
				payload_complete: true,
				uniqueness_seed: "bg-teacher-satchel::Teacher's Leather Satchel",
				variant_note: "A piece of Bureau-quartermastered field gear.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Teacher's Leather Satchel keys standard gear misc rules through signature 33f7c2f6.",
				role: "utility",
				signature: "33f7c2f6",
				theme: "standard",
			},
			passive_rules: [
				"Can hold up to 30 lbs of books and documents without encumbrance",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Can hold up to 30 lbs of books and documents without encumbrance",
				passive_effects: [
					"Can hold up to 30 lbs of books and documents without encumbrance",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-red-pen",
		name: "Red Grading Pen",
		source_book: "Rift Ascendant Canon",
		description:
			"A well-used red pen. You mark everything with it out of habit—maps, notes, enemy weaknesses. Something about circling errors in red ink feels deeply satisfying.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0867.webp",
		weight: 0.01,
		value: 0.5,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"First documented during the Second Awakening Wave, when Ascendants worldwide reported spontaneous power surges.",
			origin:
				"Pulled from the dreams of a comatose S-Rank Ascendant by a team of psychic-type Awakened.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Unravels the dimensional barrier. Proof that some things cannot be survived.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "burst", "radiant", "perception"],
		theme_tags: ["dungeon-core", "rift-energy"],
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
				fingerprint: "f6aa3d87",
				payload_complete: true,
				uniqueness_seed: "bg-red-pen::Red Grading Pen",
				variant_note: "A miscellaneous piece of standard Ascendant kit.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Red Grading Pen keys standard gear misc rules through signature 4ea61b4b.",
				role: "utility",
				signature: "4ea61b4b",
				theme: "standard",
			},
			passive_rules: [],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Resolve the item through the listed utility effect.",
				passive_effects: [],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-ironic-textbook",
		name: "World History Textbook",
		source_book: "Rift Ascendant Canon",
		description:
			"A worn textbook on world history, now painfully ironic given how much the world has changed. Still useful as a reference for pre-gate geography, politics, and cultural context.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0477.webp",
		weight: 2,
		value: 10,
		item_type: "misc",
		effects: {
			passive: ["+1 to Dimensional Lore checks involving pre-gate events"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			origin:
				"Recovered from the personal vault of a National-Level Ascendant who vanished during the First Calamity.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Ascendant's go-bag.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "lightning", "shadow"],
		theme_tags: ["mana-overflow", "survival", "dimensional-bleed"],
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
				fingerprint: "1754db3b",
				payload_complete: true,
				uniqueness_seed: "bg-ironic-textbook::World History Textbook",
				variant_note: "A piece of Bureau-quartermastered field gear.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"World History Textbook keys standard gear misc rules through signature e759f19f.",
				role: "utility",
				signature: "e759f19f",
				theme: "standard",
			},
			passive_rules: [
				"+1 to Dimensional Lore checks involving pre-gate events",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+1 to Dimensional Lore checks involving pre-gate events",
				passive_effects: [
					"+1 to Dimensional Lore checks involving pre-gate events",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-oil-coveralls",
		name: "Oil-Stained Coveralls",
		source_book: "Rift Ascendant Canon",
		description:
			"Durable work coveralls permanently stained with motor oil, hydraulic fluid, and aetheric residue. Fire-resistant (sort of) and covered in useful pockets.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0994.webp",
		weight: 3,
		value: 10,
		item_type: "misc",
		effects: {
			passive: ["Resistance to acid damage from mechanical fluids"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"First documented during the Second Awakening Wave, when Ascendants worldwide reported spontaneous power surges.",
			origin:
				"Reverse-engineered from Architect combat data recovered by the Ascendant Bureau's R&D division.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Silences the remnants of a dead world. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "support", "utility", "healing"],
		theme_tags: ["mana-overflow", "experimental"],
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
				fingerprint: "957c032f",
				payload_complete: true,
				uniqueness_seed: "bg-oil-coveralls::Oil-Stained Coveralls",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Oil-Stained Coveralls keys standard gear misc rules through signature 94125302.",
				role: "utility",
				signature: "94125302",
				theme: "standard",
			},
			passive_rules: ["Resistance to acid damage from mechanical fluids"],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Resistance to acid damage from mechanical fluids",
				passive_effects: ["Resistance to acid damage from mechanical fluids"],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-rune-wrenches",
		name: "Rune-Modified Wrench Set",
		source_book: "Rift Ascendant Canon",
		description:
			"A portable toolbox containing wrenches, screwdrivers, and pliers that have been etched with minor reinforcement runes. They never rust and provide better grip on aetherically charged components.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0230.webp",
		weight: 8,
		value: 50,
		item_type: "tool",
		effects: {
			passive: [
				"+2 to checks involving repair or dismantling mechanical devices",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Regent Wars.",
			origin:
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Bureau-issue. Inventoried. Forgotten.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "sustained", "defensive", "healing"],
		theme_tags: ["forbidden", "mana-overflow"],
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
				fingerprint: "a509d83b",
				payload_complete: true,
				uniqueness_seed: "bg-rune-wrenches::Rune-Modified Wrench Set",
				variant_note: "A piece of Bureau-quartermastered field gear.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Rune-Modified Wrench Set keys standard gear misc rules through signature e7cbdf0a.",
				role: "utility",
				signature: "e7cbdf0a",
				theme: "standard",
			},
			passive_rules: [
				"+2 to checks involving repair or dismantling mechanical devices",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+2 to checks involving repair or dismantling mechanical devices",
				passive_effects: [
					"+2 to checks involving repair or dismantling mechanical devices",
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
		id: "bg-aetheric-scanner",
		name: "Aetheric Diagnostic Scanner",
		source_book: "Rift Ascendant Canon",
		description:
			"An automotive diagnostic scanner that sometimes picks up aetheric frequencies. The screen glitches near rifts, displaying energy readings that experienced mechanics have learned to interpret.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0916.webp",
		weight: 1,
		value: 35,
		item_type: "tool",
		effects: {
			passive: [
				"Can detect aetheric energy in objects within 10 feet",
				"+1 to Mana Flow checks involving magitech",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The American Ascendant Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			origin:
				"Reconstructed from fragments scattered across seven different C-Rank dungeons.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Cheap, ubiquitous, and sometimes the only thing between you and a black bag.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "support", "utility"],
		theme_tags: ["dimensional-bleed", "dungeon-core"],
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
				fingerprint: "ec02b792",
				payload_complete: true,
				uniqueness_seed: "bg-aetheric-scanner::Aetheric Diagnostic Scanner",
				variant_note:
					"Mana-trace scanner. Can detect spellcasting within 30 ft. as an action.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "gear_electronics",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Aetheric Diagnostic Scanner keys aetheric gear electronics rules through signature 14d9109e.",
				role: "utility",
				signature: "14d9109e",
				theme: "aetheric",
			},
			passive_rules: [
				"Can detect aetheric energy in objects within 10 feet",
				"+1 to Mana Flow checks involving magitech",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Can detect aetheric energy in objects within 10 feet",
				passive_effects: [
					"Can detect aetheric energy in objects within 10 feet",
					"+1 to Mana Flow checks involving magitech",
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
		id: "bg-fire-jacket",
		name: "Guild-Reinforced Tactical Jacket",
		source_book: "Rift Ascendant Canon",
		description:
			"A fire-resistant tactical jacket upgraded with guild-standard aetheric shielding. The Nomex outer layer has been treated with rift-crystal dust, providing enhanced heat protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0547.webp",
		weight: 8,
		value: 75,
		item_type: "armor",
		armor_class: "13 + AGI modifier (max 2)",
		armor_type: "Medium",
		effects: {
			passive: ["Resistance to fire damage from non-magical sources"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			origin:
				"Discovered embedded in the spine of a petrified World Tree fragment found in Scandinavia.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau Technomancer who've patched real wounds.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "stealth", "damage", "debuff", "support"],
		theme_tags: ["gate-zone", "shadow-domain"],
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
				fingerprint: "3c2172f6",
				payload_complete: true,
				uniqueness_seed: "bg-fire-jacket::Guild-Reinforced Tactical Jacket",
				variant_note:
					"Stealth-treated armor. Advantage on Stealth checks while worn.",
			},
			formulas: {
				armor_class: "13 + AGI modifier (max 2)",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_light",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Guild-Reinforced Tactical Jacket keys standard armor light rules through signature 41432c88.",
				role: "defense",
				signature: "41432c88",
				theme: "standard",
			},
			passive_rules: ["Resistance to fire damage from non-magical sources"],
			resolution: {
				type: "armor_class",
				armor_class: "13 + AGI modifier (max 2)",
				armor_type: "Medium",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Resistance to fire damage from non-magical sources",
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
		id: "bg-halligan-bar",
		name: "Halligan Bar",
		source_book: "Rift Ascendant Canon",
		description:
			"A firefighter's breaching tool—a steel bar with a claw, blade, and pike. Used for forcing open doors, breaking through walls, and prying apart wreckage. An effective improvised weapon.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0542.webp",
		weight: 10,
		value: 30,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "bludgeoning",
		simple_properties: ["versatile"],
		effects: {
			passive: [
				"Advantage on Strength checks to force open doors and barriers",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse:
				"The user becomes unable to dream, replaced by visions of the void between Gates.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "debuff", "control", "psychic"],
		theme_tags: ["post-awakening", "regent-era", "gate-zone"],
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
				fingerprint: "9b2ca28b",
				payload_complete: true,
				uniqueness_seed: "bg-halligan-bar::Halligan Bar",
				variant_note: "",
			},
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "1d8 + STR modifier",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "melee_blade_versatile",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Halligan Bar keys standard melee blade versatile rules through signature c3df1b66.",
				role: "offense",
				signature: "c3df1b66",
				theme: "standard",
			},
			passive_rules: [
				"Advantage on Strength checks to force open doors and barriers",
			],
			resolution: {
				type: "weapon_attack",
				damage_type: "bludgeoning",
				active_options: [],
				attack_roll: true,
				damage_formula: "1d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Advantage on Strength checks to force open doors and barriers",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-dept-radio",
		name: "Gate-Zone Department Radio",
		source_book: "Rift Ascendant Canon",
		description:
			"A department radio modified for gate-zone frequencies. Hardened against aetheric interference. Can communicate with other radios within 3 miles, or 1 mile inside a gate.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0789.webp",
		weight: 0.5,
		value: 25,
		item_type: "tool",
		effects: {
			passive: ["Communication range: 3 miles (1 mile in gate zones)"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The Japanese Ascendant Bureau attempted to classify this as a national treasure to prevent export.",
			origin:
				"Leaked through a micro-rift that appeared inside the International Ascendant Conference hall.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["equipment", "shadow", "area", "debuff"],
		theme_tags: ["modern-warfare", "dimensional-bleed", "dungeon-core"],
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
				fingerprint: "5b95b349",
				payload_complete: true,
				uniqueness_seed: "bg-dept-radio::Gate-Zone Department Radio",
				variant_note: "A miscellaneous piece of standard Ascendant kit.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Gate-Zone Department Radio keys standard gear misc rules through signature 14a9341e.",
				role: "utility",
				signature: "14a9341e",
				theme: "standard",
			},
			passive_rules: ["Communication range: 3 miles (1 mile in gate zones)"],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Communication range: 3 miles (1 mile in gate zones)",
				passive_effects: [
					"Communication range: 3 miles (1 mile in gate zones)",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-case-binder",
		name: "Case File Binder",
		source_book: "Rift Ascendant Canon",
		description:
			"A worn binder originally used for case files, now repurposed for anomaly reports, refugee tracking, and contact management. Color-coded tabs and meticulous organization.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0325.webp",
		weight: 2,
		value: 10,
		item_type: "misc",
		effects: {
			passive: ["+1 to Insight checks when reviewing documents or records"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse:
				"Prolonged use causes the wielder's shadow to move independently, whispering in dead languages.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Ascendant warfare.",
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Ascendant's go-bag.",
		discovery_lore:
			"Appeared in a Ascendant's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "control", "buff", "burst"],
		theme_tags: ["forbidden", "elite-tier", "experimental"],
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
				fingerprint: "1d8658da",
				payload_complete: true,
				uniqueness_seed: "bg-case-binder::Case File Binder",
				variant_note:
					"A bound creature has disadvantage on spellcasting checks. DC 20 Strength or DC 25 Sleight of Hand to escape.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_restraint",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Case File Binder keys standard gear restraint rules through signature e2ced2a3.",
				role: "utility",
				signature: "e2ced2a3",
				theme: "standard",
			},
			passive_rules: [
				"+1 to Insight checks when reviewing documents or records",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+1 to Insight checks when reviewing documents or records",
				passive_effects: [
					"+1 to Insight checks when reviewing documents or records",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-govt-id",
		name: "Government-Issued ID",
		source_book: "Rift Ascendant Canon",
		description:
			"A government social services ID that still opens some doors—literally. The lamination is peeling, but the barcode still works at Bureau-affiliated facilities.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0842.webp",
		weight: 0.1,
		value: 5,
		item_type: "misc",
		effects: {
			passive: [
				"Grants access to government and Bureau-affiliated public facilities",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The Ascendant Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			origin:
				"Recovered from the personal vault of a National-Level Ascendant who vanished during the First Calamity.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "single-target", "support"],
		theme_tags: ["guild-ops", "gate-zone"],
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
				fingerprint: "db7d9bb3",
				payload_complete: true,
				uniqueness_seed: "bg-govt-id::Government-Issued ID",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Government-Issued ID keys standard gear misc rules through signature d87bf642.",
				role: "utility",
				signature: "d87bf642",
				theme: "standard",
			},
			passive_rules: [
				"Grants access to government and Bureau-affiliated public facilities",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Grants access to government and Bureau-affiliated public facilities",
				passive_effects: [
					"Grants access to government and Bureau-affiliated public facilities",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-deescalation-guide",
		name: "Crisis De-Escalation Guide",
		source_book: "Rift Ascendant Canon",
		description:
			"A pocket-sized guide to crisis intervention techniques. Dog-eared, highlighted, and annotated with personal notes. Includes chapters on PTSD, aetheric shock syndrome, and post-awakening trauma.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0595.webp",
		weight: 0.3,
		value: 10,
		item_type: "misc",
		effects: {
			passive: ["+1 to Persuasion checks to calm frightened or hostile NPCs"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Intelligence reports link this to the Shadow Regent's army, though the connection remains unconfirmed.",
			origin:
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Bureau-issue. Inventoried. Forgotten.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "defensive", "damage", "perception", "debuff"],
		theme_tags: ["black-market", "elite-tier", "regent-era"],
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
				fingerprint: "2ed7205f",
				payload_complete: true,
				uniqueness_seed: "bg-deescalation-guide::Crisis De-Escalation Guide",
				variant_note: "A miscellaneous piece of standard Ascendant kit.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Crisis De-Escalation Guide keys standard gear misc rules through signature d753bdc1.",
				role: "utility",
				signature: "d753bdc1",
				theme: "standard",
			},
			passive_rules: [
				"+1 to Persuasion checks to calm frightened or hostile NPCs",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+1 to Persuasion checks to calm frightened or hostile NPCs",
				passive_effects: [
					"+1 to Persuasion checks to calm frightened or hostile NPCs",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
		id: "bg-tactical-vest",
		name: "Department-Issue Tactical Vest",
		source_book: "Rift Ascendant Canon",
		description:
			"A reinforced tactical vest from the police department, dented from a gate-creature encounter. The ceramic plates have been swapped for aetheric-dampening inserts by the Ascendant Bureau.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0834.webp",
		weight: 8,
		value: 50,
		item_type: "armor",
		armor_class: "14 + AGI modifier (max 2)",
		armor_type: "Medium",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The Japanese Ascendant Bureau attempted to classify this as a national treasure to prevent export.",
			origin:
				"Confiscated from a black-market dealer operating in the shadow districts of Manila.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"What's left of you after it's done its job is what you started with.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "psychic", "offensive", "single-target", "radiant"],
		theme_tags: ["survival", "elite-tier", "mana-overflow"],
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
				fingerprint: "132dcb94",
				payload_complete: true,
				uniqueness_seed: "bg-tactical-vest::Department-Issue Tactical Vest",
				variant_note:
					"Light, flexible armor weave. Standard kit for fast movers.",
			},
			formulas: {
				armor_class: "14 + AGI modifier (max 2)",
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "armor_light",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Department-Issue Tactical Vest keys standard armor light rules through signature 6d3bf9f6.",
				role: "defense",
				signature: "6d3bf9f6",
				theme: "standard",
			},
			passive_rules: [],
			resolution: {
				type: "armor_class",
				armor_class: "14 + AGI modifier (max 2)",
				armor_type: "Medium",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [],
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
		id: "bg-mana-handcuffs",
		name: "Mana-Inert Handcuffs",
		source_book: "Rift Ascendant Canon",
		description:
			"Specially forged handcuffs treated with mana-dampening alloy. A restrained creature has disadvantage on attempts to cast spells or use mana-based abilities. Standard issue for Bureau enforcement.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0226.webp",
		weight: 1,
		value: 40,
		item_type: "misc",
		effects: {
			passive: [
				"Restrained creature has disadvantage on spellcasting checks",
				"Requires DC 20 Strength or DC 25 Sleight of Hand to escape",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			origin:
				"Emerged from the Ascendant Bureau's classified Project: Lattice Break experiments.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "burst", "control", "ice", "necrotic"],
		theme_tags: ["experimental", "dimensional-bleed", "rift-energy"],
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
				fingerprint: "51cf00ca",
				payload_complete: true,
				uniqueness_seed: "bg-mana-handcuffs::Mana-Inert Handcuffs",
				variant_note:
					"Bound creatures with mana lattice augmentation are treated as having no augmentation. DC 22 Strength to break.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "uncommon",
				archetype: "gear_restraint",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Mana-Inert Handcuffs keys aetheric gear restraint rules through signature 1a581243.",
				role: "utility",
				signature: "1a581243",
				theme: "aetheric",
			},
			passive_rules: [
				"Restrained creature has disadvantage on spellcasting checks",
				"Requires DC 20 Strength or DC 25 Sleight of Hand to escape",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"Restrained creature has disadvantage on spellcasting checks",
				passive_effects: [
					"Restrained creature has disadvantage on spellcasting checks",
					"Requires DC 20 Strength or DC 25 Sleight of Hand to escape",
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
		id: "bg-police-badge",
		name: "Ascendant Bureau Badge",
		source_book: "Rift Ascendant Canon",
		description:
			"A police badge that has been reissued by the Ascendant Bureau. Carries weight with both civilian law enforcement and guild security. The shield design incorporates a stylized rift sigil.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0730.webp",
		weight: 0.2,
		value: 15,
		item_type: "misc",
		effects: {
			passive: [
				"+2 to Intimidation checks against non-hostile NPCs",
				"Grants access to law enforcement facilities and crime scenes",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			origin:
				"Leaked through a micro-rift that appeared inside the International Ascendant Conference hall.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "control", "buff", "mobility", "necrotic"],
		theme_tags: ["survival", "post-awakening", "system-glitch"],
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
				fingerprint: "ae21112b",
				payload_complete: true,
				uniqueness_seed: "bg-police-badge::Ascendant Bureau Badge",
				variant_note:
					"Bureau-recognized ID. +1 to social checks made with Bureau personnel.",
			},
			formulas: {
				effect_formula: "explicit non-damage item effect",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "common",
				archetype: "gear_credential",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Ascendant Bureau Badge keys standard gear credential rules through signature 5485e27f.",
				role: "utility",
				signature: "5485e27f",
				theme: "standard",
			},
			passive_rules: [
				"+2 to Intimidation checks against non-hostile NPCs",
				"Grants access to law enforcement facilities and crime scenes",
			],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution:
					"+2 to Intimidation checks against non-hostile NPCs",
				passive_effects: [
					"+2 to Intimidation checks against non-hostile NPCs",
					"Grants access to law enforcement facilities and crime scenes",
				],
			},
			rules_payload_version: "ra-item-v1",
			source_integrity: {
				allows_5e_baseline: true,
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
