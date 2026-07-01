import type { RaCurrencyValue } from "@/lib/currency";

export interface Relic {
	id: string;
	name: string;
	description: string;
	type: "weapon" | "armor" | "accessory" | "wondrous" | "consumable" | "tool";
	tier?: string;
	rarity: string;
	/** Structured catalog price (mirrors `Item.value`); assigned by rarity. */
	value?: RaCurrencyValue;
	cost?: number;
	attunement?: boolean | { required: boolean; requirements: string };
	mechanics: Record<string, unknown>;
	activation?: Record<string, unknown>;
	limitations?: Record<string, unknown>;
	quirks?: string[];
	corruption_risk?: string;
	properties: Record<string, boolean> | string[];
	abilities: Array<{
		name: string;
		description: string;
		usage?: string;
		type?: string;
		frequency?: string;
		action?: string;
		dc?: number;
		charges?: number;
	}>;
	lore: Record<string, string | string[]>;
	flavor: string;
	damage?: string;
	damage_type?: string;
	weapon_type?: string;
	armor_class?: number;
	armor_type?: string;
	requirements?: Record<string, string | number>;
	source?: string;
	source_book?: string;
	effects?: Record<string, string>;
}

export const comprehensiveRelics: Relic[] = [
	{
		id: "regents-shadow-dagger",
		name: "Regent's Shadow Dagger",
		source_book: "Rift Ascendant Canon",
		description:
			"A jagged shard of the First Singularity, wreathed in flickering black mana. It does not cut flesh; it deletes the spatial coordinates of whatever it touches.",
		rarity: "legendary",
		value: { currency: "core", amount: 800 },
		type: "weapon",
		weapon_type: "simple melee",
		damage: "2d8",
		damage_type: "necrotic",
		properties: {
			legendary_actions: true,
			protocol_enhanced: true,
			sentient: true,
			unique: true,
		},
		effects: {
			primary: "Deals 1d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
		attunement: true,
		requirements: {
			ability: "Agility",
			score: 17,
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This dagger has served as the symbol of power for countless Umbral Regents throughout history. It is said to contain the collective will and power of all who have wielded it.",
			origin:
				"Forged by the first Umbral Regent from the essence of a defeated god",
			personality: "",
			prior_owners: [],
			priorOwners: [
				"First Umbral Regent",
				"First Regent",
				"Various Umbral Regents",
			],
		},
		flavor: "Tread carefully; magic like this has a cost.",
		abilities: [
			{
				name: "Shadow Pierce",
				description:
					"The dagger ignores all armor and resistance, dealing damage directly to the target's HP.",
				type: "passive",
			},
			{
				name: "Dimensional Strike",
				description:
					"As a bonus action, teleport up to 60 feet and make a dagger attack against one creature.",
				type: "active",
				action: "bonus-action",
				frequency: "short-rest",
			},
			{
				name: "Essence Drain",
				description:
					"On a critical hit, drain the target's life essence, gaining temporary HP equal to the damage dealt.",
				type: "triggered",
				frequency: "when-critical-hit",
			},
			{
				name: "Shadow Portal",
				description:
					"Once per day, create a portal between two points you can see within 120 feet.",
				type: "command",
				action: "action",
				frequency: "once-per-day",
			},
		],
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
					name: "Dimensional Strike",
					description:
						"As a bonus action, teleport up to 60 feet and make a dagger attack against one creature.",
					action: "bonus-action",
					dc: null,
					frequency: "short-rest",
				},
				{
					name: "Shadow Portal",
					description:
						"Once per day, create a portal between two points you can see within 120 feet.",
					action: "action",
					dc: null,
					frequency: "once-per-day",
				},
			],
			audit: {
				fingerprint: "95792afb",
				payload_complete: true,
				uniqueness_seed: "regents-shadow-dagger::Regent's Shadow Dagger",
				variant_note: "+1 to attack rolls when you have advantage.",
			},
			condition: "Fear",
			damage_profile: "1d8",
			formulas: {
				attack_roll: "d20 + STR or AGI modifier + proficiency bonus + 3",
				damage_roll: "2d8 + STR or AGI modifier + 3",
				recharge: "short-rest",
				save_dc: null,
			},
			identity: {
				rarity: "legendary",
				archetype: "melee_blade_finesse",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Regent's Shadow Dagger keys shadow melee blade finesse rules through signature 4347d80e.",
				role: "offense",
				signature: "4347d80e",
				theme: "shadow",
			},
			passive_rules: [
				"Deals 1d8 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
				"Shadow Pierce: The dagger ignores all armor and resistance, dealing damage directly to the target's HP.",
				"Essence Drain: On a critical hit, drain the target's life essence, gaining temporary HP equal to the damage dealt.",
			],
			resistance: ["necrotic"],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [
					{
						name: "Dimensional Strike",
						description:
							"As a bonus action, teleport up to 60 feet and make a dagger attack against one creature.",
						dc: null,
					},
					{
						name: "Shadow Portal",
						description:
							"Once per day, create a portal between two points you can see within 120 feet.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "2d8 + STR or AGI modifier",
				damage_roll: true,
				on_hit: [
					"Deals 1d8 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Fear for 1 round.",
					"Shadow Pierce: The dagger ignores all armor and resistance, dealing damage directly to the target's HP.",
					"Essence Drain: On a critical hit, drain the target's life essence, gaining temporary HP equal to the damage dealt.",
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
			special: "Aligned with Void resonance.",
			stat_bonuses: {
				Intelligence: 1,
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
		id: "bloodthirsty-greatsword",
		name: "Bloodthirsty Greatsword",
		source_book: "Rift Ascendant Canon",
		description:
			"A jagged black slab of iron that hums with the rhythm of a heartbeat. It does not just cut; it drinks.",
		rarity: "very_rare",
		value: { currency: "gate", amount: 1000 },
		type: "weapon",
		weapon_type: "martial melee",
		damage: "2d8",
		damage_type: "necrotic",
		properties: {
			cursed: true,
			protocol_enhanced: true,
		},
		effects: {
			primary: "Deals 4d10 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
		attunement: true,
		requirements: {
			ability: "Strength",
			score: 15,
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This cursed weapon grants immense power but slowly corrupts its wielder, driving them to seek ever greater carnage.",
			origin:
				"Created by a regent of dread from the blood of thousands of victims",
			personality: "",
			prior_owners: [],
			priorOwners: [
				"Regent of Dread Malgorath",
				"Warlord Kael",
				"Countless fallen warriors",
			],
		},
		flavor: "Some items tell stories. This one ends them.",
		abilities: [
			{
				name: "Blood Frenzy",
				description:
					"After reducing a creature to 0 HP, gain advantage on attack rolls and +2 damage for 1 minute.",
				type: "triggered",
				frequency: "when-creature-dies",
			},
			{
				name: "Life Drain",
				description:
					"Once per turn when you hit a creature, you can deal extra necrotic damage equal to your Strength modifier.",
				type: "active",
				frequency: "once-per-turn",
			},
			{
				name: "Blood Healing",
				description:
					"When you kill a creature, regain HP equal to half the damage you dealt.",
				type: "triggered",
				frequency: "when-creature-dies",
			},
		],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "once-per-turn",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "once-per-turn",
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
				frequency: "once-per-turn",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Life Drain",
					description:
						"Once per turn when you hit a creature, you can deal extra necrotic damage equal to your Strength modifier.",
					action: "action",
					dc: null,
					frequency: "once-per-turn",
				},
			],
			audit: {
				fingerprint: "dc8a21f4",
				payload_complete: true,
				uniqueness_seed: "bloodthirsty-greatsword::Bloodthirsty Greatsword",
				variant_note: "On a critical hit, deal an additional 2d6 damage.",
			},
			condition: "Lethargy",
			damage_profile: "4d10",
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus + 2",
				damage_roll: "2d8 + STR modifier + 2",
				recharge: "once-per-turn",
				save_dc: null,
			},
			identity: {
				rarity: "very_rare",
				archetype: "melee_blade_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Bloodthirsty Greatsword keys standard melee blade heavy rules through signature 94633dc2.",
				role: "offense",
				signature: "94633dc2",
				theme: "standard",
			},
			passive_rules: [
				"Deals 4d10 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
				"Blood Frenzy: After reducing a creature to 0 HP, gain advantage on attack rolls and +2 damage for 1 minute.",
				"Blood Healing: When you kill a creature, regain HP equal to half the damage you dealt.",
			],
			resistance: ["necrotic"],
			resolution: {
				type: "weapon_attack",
				damage_type: "necrotic",
				active_options: [
					{
						name: "Life Drain",
						description:
							"Once per turn when you hit a creature, you can deal extra necrotic damage equal to your Strength modifier.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "2d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Deals 4d10 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
					"Blood Frenzy: After reducing a creature to 0 HP, gain advantage on attack rolls and +2 damage for 1 minute.",
					"Blood Healing: When you kill a creature, regain HP equal to half the damage you dealt.",
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
			special: "Aligned with Blood resonance.",
			stat_bonuses: {
				Strength: 1,
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
		id: "lightning-blade",
		name: "Lightning Blade",
		source_book: "Rift Ascendant Canon",
		description:
			"A rapier forged from a solidified lightning strike, vibrating with ultra-high frequency mana.",
		rarity: "legendary",
		value: { currency: "core", amount: 850 },
		type: "weapon",
		weapon_type: "martial melee",
		damage: "2d8",
		damage_type: "radiant",
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		effects: {
			primary: "Deals 1d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
		attunement: true,
		requirements: {
			ability: "Agility",
			score: 16,
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This blade was wielded by the Storm-Class Regent, who could command the very weather with its power.",
			origin: "Forged in the heart of a storm by a legendary weaponsmith",
			personality: "",
			prior_owners: [],
			priorOwners: [
				"Storm-Class Regent",
				"Storm-Class Ascendant",
				"Tempest-Class Ascendant",
			],
		},
		flavor: "Tread carefully; magic like this has a cost.",
		abilities: [
			{
				name: "Lightning Strike",
				description:
					"The sword deals extra lightning damage and can chain to nearby enemies.",
				type: "passive",
			},
			{
				name: "Thunder Clap",
				description:
					"Once per turn, can create a thunderous boom that deafens enemies within 10 feet.",
				type: "active",
				action: "bonus-action",
				frequency: "once-per-turn",
			},
			{
				name: "Storm Fury",
				description:
					"Once per day, call down a lightning storm that strikes all enemies in 30-foot radius.",
				type: "command",
				action: "action",
				frequency: "once-per-day",
			},
		],
		activation: {
			type: "bonus-action",
			consumes_item: false,
			cost: "1 bonus action",
			frequency: "once-per-turn",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "once-per-turn",
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
				frequency: "once-per-turn",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Thunder Clap",
					description:
						"Once per turn, can create a thunderous boom that deafens enemies within 10 feet.",
					action: "bonus-action",
					dc: null,
					frequency: "once-per-turn",
				},
				{
					name: "Storm Fury",
					description:
						"Once per day, call down a lightning storm that strikes all enemies in 30-foot radius.",
					action: "action",
					dc: null,
					frequency: "once-per-day",
				},
			],
			audit: {
				fingerprint: "6ceb3200",
				payload_complete: true,
				uniqueness_seed: "lightning-blade::Lightning Blade",
				variant_note: "When wielded two-handed, +1 to damage rolls.",
			},
			condition: "Lethargy",
			damage_profile: "1d6",
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus + 3",
				damage_roll: "2d8 + STR modifier + 3",
				recharge: "once-per-turn",
				save_dc: null,
			},
			identity: {
				rarity: "legendary",
				archetype: "melee_blade_versatile",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Lightning Blade keys storm melee blade versatile rules through signature f28e2a7c.",
				role: "offense",
				signature: "f28e2a7c",
				theme: "storm",
			},
			passive_rules: [
				"Deals 1d6 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
				"Lightning Strike: The sword deals extra lightning damage and can chain to nearby enemies.",
			],
			resistance: ["radiant"],
			resolution: {
				type: "weapon_attack",
				damage_type: "radiant",
				active_options: [
					{
						name: "Thunder Clap",
						description:
							"Once per turn, can create a thunderous boom that deafens enemies within 10 feet.",
						dc: null,
					},
					{
						name: "Storm Fury",
						description:
							"Once per day, call down a lightning storm that strikes all enemies in 30-foot radius.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "2d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Deals 1d6 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
					"Lightning Strike: The sword deals extra lightning damage and can chain to nearby enemies.",
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
			special: "Aligned with Solar resonance.",
			stat_bonuses: {
				Presence: 1,
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
		id: "frost-axe",
		name: "Frost Axe",
		source_book: "Rift Ascendant Canon",
		description:
			"This Legendary-Rank artifact vibrates with the power to freeze reality. It allows the wielder to manifest a cryogenic field that can shatter any proximity-based dimensional distortion.",
		rarity: "very_rare",
		value: { currency: "gate", amount: 1100 },
		type: "weapon",
		weapon_type: "martial melee",
		damage: "2d8",
		damage_type: "cold",
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		effects: {
			primary: "Deals 2d4 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
		},
		attunement: true,
		requirements: {
			ability: "Strength",
			score: 14,
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This axe has been passed down through generations of winter warriors, each adding to its icy power.",
			origin: "Carved from the heart of an ancient glacier by frost giants",
			personality: "",
			prior_owners: [],
			priorOwners: [
				"Frost-Class Regent",
				"Frost-Class Ascendant",
				"Frost-Class Ascendant",
			],
		},
		flavor: "Tread carefully; magic like this has a cost.",
		abilities: [
			{
				name: "Ice Touch",
				description:
					"The axe deals extra cold damage and can freeze enemies solid.",
				type: "passive",
			},
			{
				name: "Winter's Grasp",
				description:
					"Once per day, can create a blizzard in 60-foot radius for 1 minute.",
				type: "command",
				action: "action",
				frequency: "once-per-day",
			},
			{
				name: "Frost Shield",
				description:
					"Can create a wall of ice that blocks attacks and movement.",
				type: "active",
				action: "action",
				frequency: "short-rest",
			},
		],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "once-per-day",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "once-per-day",
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
				frequency: "once-per-day",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Winter's Grasp",
					description:
						"Once per day, can create a blizzard in 60-foot radius for 1 minute.",
					action: "action",
					dc: null,
					frequency: "once-per-day",
				},
				{
					name: "Frost Shield",
					description:
						"Can create a wall of ice that blocks attacks and movement.",
					action: "action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "45adeb6b",
				payload_complete: true,
				uniqueness_seed: "frost-axe::Frost Axe",
				variant_note: "Crit on 19-20.",
			},
			condition: "Blindness",
			damage_profile: "2d4",
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus + 2",
				damage_roll: "2d8 + STR modifier + 2",
				recharge: "once-per-day",
				save_dc: null,
			},
			identity: {
				rarity: "very_rare",
				archetype: "melee_axe",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Frost Axe keys frost melee axe rules through signature 91df33b8.",
				role: "offense",
				signature: "91df33b8",
				theme: "frost",
			},
			passive_rules: [
				"Deals 2d4 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
				"Ice Touch: The axe deals extra cold damage and can freeze enemies solid.",
			],
			resistance: ["cold"],
			resolution: {
				type: "weapon_attack",
				damage_type: "cold",
				active_options: [
					{
						name: "Winter's Grasp",
						description:
							"Once per day, can create a blizzard in 60-foot radius for 1 minute.",
						dc: null,
					},
					{
						name: "Frost Shield",
						description:
							"Can create a wall of ice that blocks attacks and movement.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "2d8 + STR modifier",
				damage_roll: true,
				on_hit: [
					"Deals 2d4 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
					"Ice Touch: The axe deals extra cold damage and can freeze enemies solid.",
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
			special: "Aligned with Glacial resonance.",
			stat_bonuses: {
				Vitality: 1,
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
		id: "skywyrms-gauntlet",
		name: "Skywyrm's Gauntlet",
		source_book: "Rift Ascendant Canon",
		description:
			"The legendary gauntlet of the Umbral Regent, containing the power to command shadows and bend reality.",
		rarity: "mythic",
		value: { currency: "core", amount: 2000 },
		type: "armor",
		armor_class: 16,
		armor_type: "heavy",
		properties: {
			legendary_actions: true,
			protocol_enhanced: true,
			sentient: true,
			unique: true,
		},
		effects: {
			primary: "Deals 3d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
		attunement: true,
		requirements: {
			class: "Umbral Regent",
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			currentOwner: "Current Umbral Regent",
			curse: "",
			history:
				"This gauntlet represents the pinnacle of shadow power, containing the authority to command all shadows and reshape reality itself.",
			origin:
				"Created by the original Umbral Regent from the essence of conquered dimensions",
			personality: "",
			prior_owners: [],
		},
		flavor: "Power lies not in the object, but the will of its master.",
		abilities: [
			{
				name: "Shadow Command",
				description:
					"As an action, take control of all shadow creatures within 120 feet for 1 minute.",
				type: "command",
				action: "action",
				frequency: "once-per-day",
			},
			{
				name: "Reality Bend",
				description:
					"Once per week, alter reality in a 30-foot radius for 1 minute.",
				type: "command",
				action: "action",
				frequency: "once-per-week",
			},
			{
				name: "Regent's Protection",
				description:
					"You have resistance to all damage types and advantage on all Decree checks.",
				type: "passive",
			},
			{
				name: "Umbral Legion",
				description:
					"Summon an army of 100 Umbral Legion that serve you for 24 hours.",
				type: "command",
				action: "action",
				frequency: "once-per-week",
			},
		],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "once-per-day",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "once-per-day",
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
				frequency: "once-per-day",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Shadow Command",
					description:
						"As an action, take control of all shadow creatures within 120 feet for 1 minute.",
					action: "action",
					dc: null,
					frequency: "once-per-day",
				},
				{
					name: "Reality Bend",
					description:
						"Once per week, alter reality in a 30-foot radius for 1 minute.",
					action: "action",
					dc: null,
					frequency: "once-per-week",
				},
				{
					name: "Umbral Legion",
					description:
						"Summon an army of 100 Umbral Legion that serve you for 24 hours.",
					action: "action",
					dc: null,
					frequency: "once-per-week",
				},
			],
			audit: {
				fingerprint: "2fe98496",
				payload_complete: true,
				uniqueness_seed: "skywyrms-gauntlet::Skywyrm's Gauntlet",
				variant_note:
					"Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled.",
			},
			condition: "Fear",
			damage_profile: "3d6",
			formulas: {
				attack_roll: "d20 + STR modifier + proficiency bonus",
				damage_roll: "weapon die + STR modifier",
				recharge: "once-per-day",
				save_dc: null,
			},
			identity: {
				rarity: "mythic",
				archetype: "melee_gauntlet",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Skywyrm's Gauntlet keys standard melee gauntlet rules through signature e411dffe.",
				role: "offense",
				signature: "e411dffe",
				theme: "standard",
			},
			passive_rules: [
				"Deals 3d6 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
				"Regent's Protection: You have resistance to all damage types and advantage on all Decree checks.",
			],
			resistance: ["force"],
			resolution: {
				type: "weapon_attack",
				damage_type: "physical",
				active_options: [
					{
						name: "Shadow Command",
						description:
							"As an action, take control of all shadow creatures within 120 feet for 1 minute.",
						dc: null,
					},
					{
						name: "Reality Bend",
						description:
							"Once per week, alter reality in a 30-foot radius for 1 minute.",
						dc: null,
					},
					{
						name: "Umbral Legion",
						description:
							"Summon an army of 100 Umbral Legion that serve you for 24 hours.",
						dc: null,
					},
				],
				attack_roll: true,
				damage_formula: "damage as listed by the item",
				damage_roll: false,
				on_hit: [
					"Deals 3d6 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Fear for 1 round.",
					"Regent's Protection: You have resistance to all damage types and advantage on all Decree checks.",
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
			special: "Aligned with Absolute resonance.",
			stat_bonuses: {
				Presence: 1,
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
		id: "abyssal-plate",
		name: "Abyssal Plate Armor",
		source_book: "Rift Ascendant Canon",
		description:
			"Armor forged in the deepest shadows, offering protection while enhancing shadow abilities.",
		rarity: "legendary",
		value: { currency: "core", amount: 900 },
		type: "armor",
		armor_class: 16,
		armor_type: "heavy",
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		effects: {
			primary: "Deals 2d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
		attunement: true,
		requirements: {
			ability: "Vitality",
			score: 16,
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This armor has protected many powerful shadow warriors throughout the ages, each adding their own essence to its power.",
			origin:
				"Forged in the Abyss by shadow smiths using materials from defeated shadow lords",
			personality: "",
			prior_owners: [],
			priorOwners: [
				"Shadow-Class Vanguard",
				"Umbral Herald Vorlag",
				"Shadow-Class Warlord Zara",
			],
		},
		flavor: "Not glamorous. Still alive.",
		abilities: [
			{
				name: "Shadow Meld",
				description:
					"As a bonus action, become incorporeal for 1 minute, moving through walls and creatures.",
				type: "active",
				action: "bonus-action",
				frequency: "short-rest",
			},
			{
				name: "Darkness Aura",
				description:
					"Magical darkness surrounds you in a 15-foot radius. You can see through this darkness.",
				type: "passive",
			},
			{
				name: "Shadow Fortification",
				description:
					"When you would take damage, you can use your reaction to reduce it by half.",
				type: "reaction",
				frequency: "short-rest",
			},
		],
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
					name: "Shadow Meld",
					description:
						"As a bonus action, become incorporeal for 1 minute, moving through walls and creatures.",
					action: "bonus-action",
					dc: null,
					frequency: "short-rest",
				},
			],
			audit: {
				fingerprint: "12e592b3",
				payload_complete: true,
				uniqueness_seed: "abyssal-plate::Abyssal Plate Armor",
				variant_note: "Mana-stable plate. Resistance to force damage.",
			},
			condition: "Fear",
			damage_profile: "2d8",
			formulas: {
				armor_class: 16,
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "legendary",
				archetype: "armor_heavy",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Abyssal Plate Armor keys void armor heavy rules through signature 0db44ee1.",
				role: "defense",
				signature: "0db44ee1",
				theme: "void",
			},
			passive_rules: [
				"Deals 2d8 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
				"Darkness Aura: Magical darkness surrounds you in a 15-foot radius. You can see through this darkness.",
			],
			resistance: ["necrotic"],
			resolution: {
				type: "armor_class",
				armor_class: 16,
				armor_type: "heavy",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Deals 2d8 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Fear for 1 round.",
					"Darkness Aura: Magical darkness surrounds you in a 15-foot radius. You can see through this darkness.",
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
			special: "Aligned with Void resonance.",
			stat_bonuses: {
				Intelligence: 1,
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
		id: "lattice-scale-mail",
		name: "Lattice-Scale Mail",
		source_book: "Rift Ascendant Canon",
		description:
			"Armor crafted from the scales of an ancient anomaly, offering exceptional protection and anomaly-like abilities.",
		rarity: "legendary",
		value: { currency: "core", amount: 950 },
		type: "armor",
		armor_class: 16,
		armor_type: "heavy",
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		effects: {
			primary: "Deals 1d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
		attunement: true,
		requirements: {
			ability: "Vitality",
			score: 17,
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This armor was worn by the Anomaly Slayer who defeated Ignis, inheriting its power.",
			origin:
				"Crafted from the scales of the ancient Ignis-Class Anomaly by master pre-gate smiths",
			personality: "",
			prior_owners: [],
			priorOwners: ["Anomaly Slayer", "Anomaly Slayer", "Scale-Forged Regent"],
		},
		flavor: "Reforged from the ashes of a fallen Regent.",
		abilities: [
			{
				name: "anomaly Resistance",
				description:
					"Resistance to the damage type of the anomaly whose scales were used.",
				type: "passive",
			},
			{
				name: "anomaly Breath",
				description: "Once per day, breathe a cone of anomaly energy.",
				type: "command",
				action: "action",
				frequency: "once-per-day",
			},
			{
				name: "anomaly Frightful Presence",
				description:
					"Creatures within 30 feet must make Sense check or be frightened.",
				type: "passive",
			},
		],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "once-per-day",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state: "must be equipped; attunement required when listed",
			recharge: "once-per-day",
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
				type: "action",
				consumes_item: false,
				cost: "1 action",
				frequency: "once-per-day",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "anomaly Breath",
					description: "Once per day, breathe a cone of anomaly energy.",
					action: "action",
					dc: null,
					frequency: "once-per-day",
				},
			],
			audit: {
				fingerprint: "af21bf73",
				payload_complete: true,
				uniqueness_seed: "lattice-scale-mail::Lattice-Scale Mail",
				variant_note: "Reinforced medium armor with Bureau-stamped joints.",
			},
			condition: "Stunning",
			damage_profile: "1d6",
			formulas: {
				armor_class: 16,
				recharge: "continuous",
				shield_bonus: null,
				speed_penalty: null,
			},
			identity: {
				rarity: "legendary",
				archetype: "armor_medium",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Lattice-Scale Mail keys aetheric armor medium rules through signature aafc01dc.",
				role: "defense",
				signature: "aafc01dc",
				theme: "aetheric",
			},
			passive_rules: [
				"Deals 1d6 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
				"anomaly Resistance: Resistance to the damage type of the anomaly whose scales were used.",
				"anomaly Frightful Presence: Creatures within 30 feet must make Sense check or be frightened.",
			],
			resistance: ["force"],
			resolution: {
				type: "armor_class",
				armor_class: 16,
				armor_type: "heavy",
				stealth_disadvantage: false,
				strength_requirement: null,
				equipped_effects: [
					"Deals 1d6 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
					"anomaly Resistance: Resistance to the damage type of the anomaly whose scales were used.",
					"anomaly Frightful Presence: Creatures within 30 feet must make Sense check or be frightened.",
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
			special: "Aligned with Absolute resonance.",
			stat_bonuses: {
				Presence: 1,
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
		id: "rulers-authority",
		name: "Architect's Authority",
		source_book: "Rift Ascendant Canon",
		description:
			"An artifact that grants the bearer command over lesser shadows and the respect of all beings.",
		rarity: "legendary",
		value: { currency: "core", amount: 1000 },
		type: "accessory",
		properties: {
			protocol_enhanced: true,
			sentient: true,
		},
		effects: {
			primary: "Deals 3d12 + 6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
		},
		attunement: true,
		requirements: {
			ability: "Presence",
			score: 15,
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This artifact represents the right to rule, containing the essence of leadership and command that all Regents must possess.",
			origin:
				"Created by the first Regent to establish authority over their growing shadow empire",
			personality: "",
			prior_owners: [],
			priorOwners: [
				"First Umbral Regent",
				"Regent of Shadows",
				"Regent of Night",
			],
		},
		flavor: "Tread carefully; magic like this has a cost.",
		abilities: [
			{
				name: "Command Shadows",
				description:
					"As an action, issue a command to all shadow creatures within 60 feet. They must obey if they fail a Sense check.",
				type: "command",
				action: "action",
				dc: 18,
				frequency: "long-rest",
			},
			{
				name: "Royal Presence",
				description:
					"All creatures except those with higher CR have disadvantage on attack rolls against you.",
				type: "passive",
			},
			{
				name: "Inspire Loyalty",
				description:
					"Your allies within 30 feet gain +2 to Decree checks and cannot be frightened.",
				type: "passive",
			},
			{
				name: "Decree",
				description:
					"Once per week, issue a decree that affects all creatures in a 1-mile radius.",
				type: "command",
				action: "action",
				frequency: "once-per-week",
			},
		],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "long-rest",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "long-rest",
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
				consumes_item: false,
				cost: "1 action",
				frequency: "long-rest",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Command Shadows",
					description:
						"As an action, issue a command to all shadow creatures within 60 feet. They must obey if they fail a Sense check.",
					action: "action",
					dc: 18,
					frequency: "long-rest",
				},
				{
					name: "Decree",
					description:
						"Once per week, issue a decree that affects all creatures in a 1-mile radius.",
					action: "action",
					dc: null,
					frequency: "once-per-week",
				},
			],
			audit: {
				fingerprint: "aea382a2",
				payload_complete: true,
				uniqueness_seed: "rulers-authority::Architect's Authority",
				variant_note: "A piece of Bureau-quartermastered field gear.",
			},
			condition: "Blindness",
			damage_profile: "3d12 + 6",
			formulas: {
				effect_formula: "3d12 + 6",
				recharge: "long-rest",
				save_dc: "DC 18",
			},
			identity: {
				rarity: "legendary",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Architect's Authority keys standard gear misc rules through signature 68dbf6ef.",
				role: "utility",
				signature: "68dbf6ef",
				theme: "standard",
			},
			passive_rules: [
				"Deals 3d12 + 6 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
				"Royal Presence: All creatures except those with higher CR have disadvantage on attack rolls against you.",
				"Inspire Loyalty: Your allies within 30 feet gain +2 to Decree checks and cannot be frightened.",
			],
			resistance: ["force"],
			resolution: {
				type: "equipment_utility",
				active_options: [
					{
						name: "Command Shadows",
						description:
							"As an action, issue a command to all shadow creatures within 60 feet. They must obey if they fail a Sense check.",
						dc: 18,
					},
					{
						name: "Decree",
						description:
							"Once per week, issue a decree that affects all creatures in a 1-mile radius.",
						dc: null,
					},
				],
				non_damage_resolution:
					"Deals 3d12 + 6 physical or magical damage on hit.",
				passive_effects: [
					"Deals 3d12 + 6 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
					"Royal Presence: All creatures except those with higher CR have disadvantage on attack rolls against you.",
					"Inspire Loyalty: Your allies within 30 feet gain +2 to Decree checks and cannot be frightened.",
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
			special: "Aligned with Absolute resonance.",
			stat_bonuses: {
				Presence: 1,
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
		id: "bloodstone-amulet",
		name: "Bloodstone Amulet",
		source_book: "Rift Ascendant Canon",
		description:
			"An amulet that enhances shadow manipulation abilities and protects against shadow corruption.",
		rarity: "epic",
		value: { currency: "core", amount: 300 },
		type: "accessory",
		properties: {
			protocol_enhanced: true,
		},
		effects: {
			primary: "Deals 1d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
		attunement: true,
		requirements: {
			ability: "Sense",
			score: 14,
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This amulet has saved countless shadow users from falling to shadow madness, allowing them to harness shadow power safely.",
			origin:
				"Created by ancient shadow mages to protect against the corrupting influence of raw shadow energy",
			personality: "",
			prior_owners: [],
			priorOwners: [
				"Shadow-Class Esper Theron",
				"Umbral Sage Marina",
				"Umbral Cultist Kael",
			],
		},
		flavor: "Issue-grade. Not flashy, just thorough.",
		abilities: [
			{
				name: "Shadow Enhancement",
				description:
					"Your shadow abilities deal +1d6 extra damage and have advantage on attack rolls.",
				type: "passive",
			},
			{
				name: "Blood Protection",
				description:
					"Immunity to shadow corruption and advantage on saves against shadow spells.",
				type: "passive",
			},
			{
				name: "Essence Storage",
				description:
					"Can store up to 10 essence points that can be used to power shadow abilities.",
				type: "passive",
			},
			{
				name: "Shadow Sight",
				description:
					"Can see in protocol-enhanced darkness and perceive invisible creatures.",
				type: "passive",
			},
		],
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
			attunement_required: true,
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
				fingerprint: "981cd940",
				payload_complete: true,
				uniqueness_seed: "bloodstone-amulet::Bloodstone Amulet",
				variant_note:
					"While attuned, you have advantage on saves against being Charmed.",
			},
			condition: "Stunning",
			damage_profile: "1d8",
			formulas: {
				effect_formula: "1d8",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "epic",
				archetype: "gear_amulet",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Bloodstone Amulet keys standard gear amulet rules through signature aaa5bfdb.",
				role: "utility",
				signature: "aaa5bfdb",
				theme: "standard",
			},
			passive_rules: [
				"Deals 1d8 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
				"Shadow Enhancement: Your shadow abilities deal +1d6 extra damage and have advantage on attack rolls.",
				"Blood Protection: Immunity to shadow corruption and advantage on saves against shadow spells.",
				"Essence Storage: Can store up to 10 essence points that can be used to power shadow abilities.",
				"Shadow Sight: Can see in protocol-enhanced darkness and perceive invisible creatures.",
			],
			resistance: ["necrotic"],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution: "Deals 1d8 physical or magical damage on hit.",
				passive_effects: [
					"Deals 1d8 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
					"Shadow Enhancement: Your shadow abilities deal +1d6 extra damage and have advantage on attack rolls.",
					"Blood Protection: Immunity to shadow corruption and advantage on saves against shadow spells.",
					"Essence Storage: Can store up to 10 essence points that can be used to power shadow abilities.",
					"Shadow Sight: Can see in protocol-enhanced darkness and perceive invisible creatures.",
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
			special: "Aligned with Blood resonance.",
			stat_bonuses: {
				Strength: 1,
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
		id: "dimensional-compass",
		name: "Dimensional Compass",
		source_book: "Rift Ascendant Canon",
		description:
			"A compass that points toward dimensional disturbances and can guide through abyssal realms.",
		rarity: "very_rare",
		value: { currency: "gate", amount: 1200 },
		type: "accessory",
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		effects: {
			primary: "Deals 1d12 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
		attunement: false,
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This compass has guided countless adventurers through dangerous dimensional journeys, its needle always pointing toward safety or adventure.",
			origin:
				"Forged by dimensional travelers who learned to navigate the spaces between worlds",
			personality: "",
			prior_owners: [],
			priorOwners: [
				"Dimensional Explorer Alara",
				"Gate-Tracker Marcus",
				"Umbral Walker Lena",
			],
		},
		flavor: "Reforged from the ashes of a fallen Regent.",
		abilities: [
			{
				name: "Dimension Sense",
				description:
					"Always points toward the nearest dimensional disturbance within 100 miles.",
				type: "passive",
			},
			{
				name: "Shadow Navigation",
				description: "Cannot get lost in abyssal realms or dimensional spaces.",
				type: "passive",
			},
			{
				name: "Portal Detection",
				description:
					"Vibrates when within 100 feet of a portal or dimensional rift.",
				type: "passive",
			},
			{
				name: "Wayfinding",
				description:
					"Once per day, can show the safest path through dangerous dimensional areas.",
				type: "active",
				action: "action",
				frequency: "once-per-day",
			},
		],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "once-per-day",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: false,
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "once-per-day",
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
				consumes_item: false,
				cost: "1 action",
				frequency: "once-per-day",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Wayfinding",
					description:
						"Once per day, can show the safest path through dangerous dimensional areas.",
					action: "action",
					dc: null,
					frequency: "once-per-day",
				},
			],
			audit: {
				fingerprint: "cadbe483",
				payload_complete: true,
				uniqueness_seed: "dimensional-compass::Dimensional Compass",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			condition: "Stunning",
			damage_profile: "1d12",
			formulas: {
				effect_formula: "1d12",
				recharge: "once-per-day",
				save_dc: null,
			},
			identity: {
				rarity: "very_rare",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Dimensional Compass keys rift gear misc rules through signature 2b7d5297.",
				role: "utility",
				signature: "2b7d5297",
				theme: "rift",
			},
			passive_rules: [
				"Deals 1d12 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
				"Dimension Sense: Always points toward the nearest dimensional disturbance within 100 miles.",
				"Shadow Navigation: Cannot get lost in abyssal realms or dimensional spaces.",
				"Portal Detection: Vibrates when within 100 feet of a portal or dimensional rift.",
			],
			resistance: ["force"],
			resolution: {
				type: "equipment_utility",
				active_options: [
					{
						name: "Wayfinding",
						description:
							"Once per day, can show the safest path through dangerous dimensional areas.",
						dc: null,
					},
				],
				non_damage_resolution: "Deals 1d12 physical or magical damage on hit.",
				passive_effects: [
					"Deals 1d12 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
					"Dimension Sense: Always points toward the nearest dimensional disturbance within 100 miles.",
					"Shadow Navigation: Cannot get lost in abyssal realms or dimensional spaces.",
					"Portal Detection: Vibrates when within 100 feet of a portal or dimensional rift.",
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
			special: "Aligned with Aetheric resonance.",
			stat_bonuses: {
				Sense: 1,
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
		id: "crown-of-sense",
		name: "Crown of Sense",
		source_book: "Rift Ascendant Canon",
		description:
			"This Legendary-Rank artifact vibrates with the power to mandate reality. It allows the wielder to manifest a fundamental field that can decree any proximity-based dimensional distortion.",
		rarity: "legendary",
		value: { currency: "core", amount: 1050 },
		type: "accessory",
		properties: {
			protocol_enhanced: true,
			sentient: true,
			unique: true,
		},
		effects: {
			primary: "Deals 2d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Paralysis for 1 round.",
		},
		attunement: true,
		requirements: {
			ability: "Intelligence",
			score: 18,
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This crown contains the accumulated sense of countless rulers and scholars who have worn it.",
			origin:
				"Created by the first sage king who collected all knowledge in the realm",
			personality: "",
			prior_owners: [],
			priorOwners: [
				"Sage King Solomon",
				"Regent of Sense Marcus",
				"Regent-Oracle Elena",
			],
		},
		flavor: "Power lies not in the object, but the will of its master.",
		abilities: [
			{
				name: "All-Knowledge",
				description:
					"You have proficiency in all skills and can add double proficiency bonus to Intelligence checks.",
				type: "passive",
			},
			{
				name: "True Sight",
				description:
					"Can see through illusions and perceive the true nature of things.",
				type: "passive",
			},
			{
				name: "Sense of Ages",
				description:
					"Once per day, can gain insight into any question by consulting the crown.",
				type: "command",
				action: "action",
				frequency: "once-per-day",
			},
			{
				name: "Mental Fortress",
				description:
					"Immunity to psychic damage and advantage on all mental Decree checks.",
				type: "passive",
			},
		],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "once-per-day",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "once-per-day",
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
				consumes_item: false,
				cost: "1 action",
				frequency: "once-per-day",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Sense of Ages",
					description:
						"Once per day, can gain insight into any question by consulting the crown.",
					action: "action",
					dc: null,
					frequency: "once-per-day",
				},
			],
			audit: {
				fingerprint: "ddb4be6d",
				payload_complete: true,
				uniqueness_seed: "crown-of-sense::Crown of Sense",
				variant_note: "A piece of Bureau-quartermastered field gear.",
			},
			condition: "Paralysis",
			damage_profile: "2d6",
			formulas: {
				effect_formula: "2d6",
				recharge: "once-per-day",
				save_dc: null,
			},
			identity: {
				rarity: "legendary",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Crown of Sense keys standard gear misc rules through signature 9364553c.",
				role: "utility",
				signature: "9364553c",
				theme: "standard",
			},
			passive_rules: [
				"Deals 2d6 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Paralysis for 1 round.",
				"All-Knowledge: You have proficiency in all skills and can add double proficiency bonus to Intelligence checks.",
				"True Sight: Can see through illusions and perceive the true nature of things.",
				"Mental Fortress: Immunity to psychic damage and advantage on all mental Decree checks.",
			],
			resistance: ["force"],
			resolution: {
				type: "equipment_utility",
				active_options: [
					{
						name: "Sense of Ages",
						description:
							"Once per day, can gain insight into any question by consulting the crown.",
						dc: null,
					},
				],
				non_damage_resolution: "Deals 2d6 physical or magical damage on hit.",
				passive_effects: [
					"Deals 2d6 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Paralysis for 1 round.",
					"All-Knowledge: You have proficiency in all skills and can add double proficiency bonus to Intelligence checks.",
					"True Sight: Can see through illusions and perceive the true nature of things.",
					"Mental Fortress: Immunity to psychic damage and advantage on all mental Decree checks.",
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
			special: "Aligned with Absolute resonance.",
			stat_bonuses: {
				Presence: 1,
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
		id: "shadow-orb",
		name: "Shadow Orb",
		source_book: "Rift Ascendant Canon",
		description:
			"This Legendary-Rank artifact vibrates with the power to nullify reality. It allows the wielder to manifest a umbral field that can devour any proximity-based dimensional distortion.",
		rarity: "epic",
		value: { currency: "core", amount: 325 },
		type: "accessory",
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		effects: {
			primary: "Deals 2d4 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
		attunement: true,
		requirements: {
			ability: "Sense",
			score: 15,
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This orb has been used by countless shadow users who needed portable power.",
			origin: "Created by shadow mages as a portable source of shadow energy",
			personality: "",
			prior_owners: [],
			priorOwners: [
				"Shadow-Class Esper",
				"Umbral Esper",
				"Shadow-Class Caster",
			],
		},
		flavor: "Tread carefully; magic like this has a cost.",
		abilities: [
			{
				name: "Shadow Power",
				description:
					"The orb contains 10 shadow charges that can be used to power shadow abilities.",
				type: "passive",
			},
			{
				name: "Shadow Shield",
				description:
					"As a reaction, expend a charge to create a shield that blocks one attack.",
				type: "reaction",
				frequency: "reaction",
			},
			{
				name: "Shadow Bolt",
				description:
					"As an action, expend a charge to fire a bolt of shadow energy.",
				type: "active",
				frequency: "action",
			},
			{
				name: "Shadow Renewal",
				description: "The orb regains 1d4 charges at dawn.",
				type: "passive",
			},
		],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "action",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "action",
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
				consumes_item: false,
				cost: "1 action",
				frequency: "action",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Shadow Bolt",
					description:
						"As an action, expend a charge to fire a bolt of shadow energy.",
					action: "action",
					dc: null,
					frequency: "action",
				},
			],
			audit: {
				fingerprint: "65c42d65",
				payload_complete: true,
				uniqueness_seed: "shadow-orb::Shadow Orb",
				variant_note:
					"Acts as an arcane focus. Spells cast through this focus add +1 to damage or healing rolls.",
			},
			condition: "Fear",
			damage_profile: "2d4",
			formulas: {
				effect_formula: "2d4",
				recharge: "action",
				save_dc: null,
			},
			identity: {
				rarity: "epic",
				archetype: "focus_caster",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Shadow Orb keys shadow focus caster rules through signature 8328ee72.",
				role: "utility",
				signature: "8328ee72",
				theme: "shadow",
			},
			passive_rules: [
				"Deals 2d4 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
				"Shadow Power: The orb contains 10 shadow charges that can be used to power shadow abilities.",
				"Shadow Renewal: The orb regains 1d4 charges at dawn.",
			],
			resistance: ["necrotic"],
			resolution: {
				type: "equipment_utility",
				active_options: [
					{
						name: "Shadow Bolt",
						description:
							"As an action, expend a charge to fire a bolt of shadow energy.",
						dc: null,
					},
				],
				non_damage_resolution: "Deals 2d4 physical or magical damage on hit.",
				passive_effects: [
					"Deals 2d4 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Fear for 1 round.",
					"Shadow Power: The orb contains 10 shadow charges that can be used to power shadow abilities.",
					"Shadow Renewal: The orb regains 1d4 charges at dawn.",
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
			special: "Aligned with Void resonance.",
			stat_bonuses: {
				Intelligence: 1,
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
		id: "time-turner",
		name: "Time Turner",
		source_book: "Rift Ascendant Canon",
		description:
			"This Legendary-Rank artifact vibrates with the power to suspend reality. It allows the wielder to manifest a recursive field that can accelerate any proximity-based dimensional distortion.",
		rarity: "mythic",
		value: { currency: "core", amount: 2200 },
		type: "accessory",
		properties: {
			legendary_actions: true,
			protocol_enhanced: true,
			unique: true,
		},
		effects: {
			primary: "Deals 2d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
		attunement: true,
		requirements: {
			ability: "Intelligence",
			score: 20,
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This device is one of the few objects that can truly affect the flow of time.",
			origin:
				"Created by a time mage who discovered the secrets of temporal manipulation",
			personality: "",
			prior_owners: [],
			priorOwners: [
				"Lattice Chronomancer Chronos",
				"Lattice Chronomancer",
				"Lattice Keeper",
			],
		},
		flavor: "Reforged from the ashes of a fallen Regent.",
		abilities: [
			{
				name: "Time Rewind",
				description:
					"Once per week, can rewind time by 6 seconds, undoing recent events.",
				type: "command",
				action: "action",
				frequency: "once-per-week",
			},
			{
				name: "Precognition",
				description: "Advantage on all attack rolls and Decree checks.",
				type: "passive",
			},
			{
				name: "Haste",
				description: "Once per day, can take an extra turn.",
				type: "command",
				action: "bonus-action",
				frequency: "once-per-day",
			},
			{
				name: "Slow Time",
				description:
					"Once per day, can force all enemies in 30-foot radius to act in slow motion.",
				type: "command",
				action: "action",
				frequency: "once-per-day",
			},
		],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "once-per-week",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
			equipment_state:
				"must be carried, consumed, or deployed as the activation describes",
			recharge: "once-per-week",
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
				consumes_item: false,
				cost: "1 action",
				frequency: "once-per-week",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Time Rewind",
					description:
						"Once per week, can rewind time by 6 seconds, undoing recent events.",
					action: "action",
					dc: null,
					frequency: "once-per-week",
				},
				{
					name: "Haste",
					description: "Once per day, can take an extra turn.",
					action: "bonus-action",
					dc: null,
					frequency: "once-per-day",
				},
				{
					name: "Slow Time",
					description:
						"Once per day, can force all enemies in 30-foot radius to act in slow motion.",
					action: "action",
					dc: null,
					frequency: "once-per-day",
				},
			],
			audit: {
				fingerprint: "84b3ba24",
				payload_complete: true,
				uniqueness_seed: "time-turner::Time Turner",
				variant_note: "A miscellaneous piece of standard Ascendant kit.",
			},
			condition: "Stunning",
			damage_profile: "2d6",
			formulas: {
				effect_formula: "2d6",
				recharge: "once-per-week",
				save_dc: null,
			},
			identity: {
				rarity: "mythic",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Time Turner keys standard gear misc rules through signature 9bfc82e2.",
				role: "utility",
				signature: "9bfc82e2",
				theme: "standard",
			},
			passive_rules: [
				"Deals 2d6 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
				"Precognition: Advantage on all attack rolls and Decree checks.",
			],
			resistance: ["force"],
			resolution: {
				type: "equipment_utility",
				active_options: [
					{
						name: "Time Rewind",
						description:
							"Once per week, can rewind time by 6 seconds, undoing recent events.",
						dc: null,
					},
					{
						name: "Haste",
						description: "Once per day, can take an extra turn.",
						dc: null,
					},
					{
						name: "Slow Time",
						description:
							"Once per day, can force all enemies in 30-foot radius to act in slow motion.",
						dc: null,
					},
				],
				non_damage_resolution: "Deals 2d6 physical or magical damage on hit.",
				passive_effects: [
					"Deals 2d6 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
					"Precognition: Advantage on all attack rolls and Decree checks.",
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
			special: "Aligned with Chrono resonance.",
			stat_bonuses: {
				Sense: 1,
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
		id: "essence-potion",
		name: "Essence Potion",
		source_book: "Rift Ascendant Canon",
		description:
			"A potion containing concentrated life essence that can heal wounds and enhance abilities.",
		rarity: "rare",
		value: { currency: "gate", amount: 300 },
		type: "consumable",
		properties: {
			protocol_enhanced: true,
		},
		effects: {
			primary: "Deals 3d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"These potions are highly valued by shadow users for their healing and enhancing properties.",
			origin: "Brewed by shadow alchemists using extracted life essence",
			personality: "",
			prior_owners: [],
		},
		flavor: "Tread carefully; magic like this has a cost.",
		abilities: [
			{
				name: "Essence Restoration",
				description:
					"Drink to restore 4d4+4 HP and gain +1 to all ability checks for 1 hour.",
				type: "consumable",
				action: "action",
			},
		],
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
				fingerprint: "9141dcd1",
				payload_complete: true,
				uniqueness_seed: "essence-potion::Essence Potion",
				variant_note: "Restores mana on consumption.",
			},
			condition: "Lethargy",
			damage_profile: "3d6",
			formulas: {
				effect_formula: "3d6",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "rare",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Essence Potion keys standard consumable potion rules through signature 1fe61ab7.",
				role: "consumable",
				signature: "1fe61ab7",
				theme: "standard",
			},
			passive_rules: [
				"Deals 3d6 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
			],
			resistance: ["force"],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule:
					"Deals 3d6 physical or magical damage on hit. Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
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
			special: "Aligned with Absolute resonance.",
			stat_bonuses: {
				Presence: 1,
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
		id: "shadow-elixir",
		name: "Shadow Elixir",
		source_book: "Rift Ascendant Canon",
		description:
			"This Legendary-Rank artifact vibrates with the power to nullify reality. It allows the wielder to manifest a umbral field that can devour any proximity-based dimensional distortion.",
		rarity: "very_rare",
		value: { currency: "gate", amount: 1300 },
		type: "consumable",
		properties: {
			protocol_enhanced: true,
		},
		effects: {
			primary: "Deals 4d10 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"These elixirs are used by those who wish to temporarily gain shadow powers.",
			origin: "Created by shadow alchemists from pure shadow essence",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reforged from the ashes of a fallen Regent.",
		abilities: [
			{
				name: "Shadow Empowerment",
				description: "Drink to gain shadow step and shadow stealth for 1 hour.",
				type: "consumable",
				action: "action",
			},
		],
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
				fingerprint: "674499e9",
				payload_complete: true,
				uniqueness_seed: "shadow-elixir::Shadow Elixir",
				variant_note:
					"Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.",
			},
			condition: "Stunning",
			damage_profile: "4d10",
			formulas: {
				effect_formula: "4d10",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "very_rare",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Shadow Elixir keys shadow consumable potion rules through signature 50077b50.",
				role: "consumable",
				signature: "50077b50",
				theme: "shadow",
			},
			passive_rules: [
				"Deals 4d10 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
			],
			resistance: ["necrotic"],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule:
					"Deals 4d10 physical or magical damage on hit. Target must make a standard DC saving throw or suffer Stunning for 1 round.",
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
			special: "Aligned with Void resonance.",
			stat_bonuses: {
				Intelligence: 1,
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
		id: "anomaly-blood-potion",
		name: "anomaly Blood Potion",
		source_book: "Rift Ascendant Canon",
		description:
			"This Legendary-Rank artifact vibrates with the power to siphon reality. It allows the wielder to manifest a sanguine field that can clot any proximity-based dimensional distortion.",
		rarity: "legendary",
		value: { currency: "core", amount: 1100 },
		type: "consumable",
		properties: {
			protocol_enhanced: true,
		},
		effects: {
			primary: "Deals 1d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"These potions are extremely rare and grant the drinker temporary regent-tier powers.",
			origin: "Brewed from the blood of an ancient anomaly",
			personality: "",
			prior_owners: [],
		},
		flavor: "Reforged from the ashes of a fallen Regent.",
		abilities: [
			{
				name: "regent-tier Power",
				description:
					"Drink to gain anomaly breath weapon and resistance for 1 hour.",
				type: "consumable",
				action: "action",
			},
		],
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
				fingerprint: "5a139508",
				payload_complete: true,
				uniqueness_seed: "anomaly-blood-potion::anomaly Blood Potion",
				variant_note: "Restores HP on consumption.",
			},
			condition: "Stunning",
			damage_profile: "1d6",
			formulas: {
				effect_formula: "1d6",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "legendary",
				archetype: "consumable_potion",
				canon_basis: "RA canon",
				distinguishing_rule:
					"anomaly Blood Potion keys standard consumable potion rules through signature 773899cf.",
				role: "consumable",
				signature: "773899cf",
				theme: "standard",
			},
			passive_rules: [
				"Deals 1d6 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
			],
			resistance: ["necrotic"],
			resolution: {
				type: "consumable",
				damage_type: null,
				consumes_item: true,
				damage_formula: null,
				save: null,
				use_rule:
					"Deals 1d6 physical or magical damage on hit. Target must make a standard DC saving throw or suffer Stunning for 1 round.",
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
			special: "Aligned with Blood resonance.",
			stat_bonuses: {
				Strength: 1,
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
		id: "shadow-lens",
		name: "Shadow Lens",
		source_book: "Rift Ascendant Canon",
		description:
			"A protocol-enhanced lens that can see through shadows and reveal hidden things.",
		rarity: "rare",
		value: { currency: "gate", amount: 325 },
		type: "tool",
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		effects: {
			primary: "Deals 2d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
		attunement: false,
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This lens has helped many adventurers discover hidden dangers and secrets.",
			origin:
				"Created by a shadow mage who wanted to see what others could not",
			personality: "",
			prior_owners: [],
		},
		flavor: "Power lies not in the object, but the will of its master.",
		abilities: [
			{
				name: "Shadow Vision",
				description: "Can see through shadows and protocol-enhanced darkness.",
				type: "passive",
			},
			{
				name: "True Sight",
				description:
					"Can see through illusions and detect invisible creatures.",
				type: "passive",
			},
			{
				name: "Shadow Detection",
				description: "Can detect shadow creatures and shadow protocol.",
				type: "passive",
			},
		],
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
				fingerprint: "65ff4752",
				payload_complete: true,
				uniqueness_seed: "shadow-lens::Shadow Lens",
				variant_note: "A miscellaneous piece of standard Ascendant kit.",
			},
			condition: "Lethargy",
			damage_profile: "2d8",
			formulas: {
				effect_formula: "2d8",
				recharge: "continuous",
				save_dc: null,
			},
			identity: {
				rarity: "rare",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Shadow Lens keys shadow gear misc rules through signature 1534660a.",
				role: "utility",
				signature: "1534660a",
				theme: "shadow",
			},
			passive_rules: [
				"Deals 2d8 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
				"Shadow Vision: Can see through shadows and protocol-enhanced darkness.",
				"True Sight: Can see through illusions and detect invisible creatures.",
				"Shadow Detection: Can detect shadow creatures and shadow protocol.",
			],
			resistance: ["necrotic"],
			resolution: {
				type: "equipment_utility",
				active_options: [],
				non_damage_resolution: "Deals 2d8 physical or magical damage on hit.",
				passive_effects: [
					"Deals 2d8 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
					"Shadow Vision: Can see through shadows and protocol-enhanced darkness.",
					"True Sight: Can see through illusions and detect invisible creatures.",
					"Shadow Detection: Can detect shadow creatures and shadow protocol.",
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
			special: "Aligned with Void resonance.",
			stat_bonuses: {
				Intelligence: 1,
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
		id: "essence-collector",
		name: "Essence Collector",
		source_book: "Rift Ascendant Canon",
		description:
			"This Legendary-Rank artifact vibrates with the power to mandate reality. It allows the wielder to manifest a fundamental field that can decree any proximity-based dimensional distortion.",
		rarity: "very_rare",
		value: { currency: "gate", amount: 1400 },
		type: "tool",
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		effects: {
			primary: "Deals 2d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
		attunement: true,
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This device has revolutionized the way shadow users collect and use essence.",
			origin:
				"Invented by a shadow scientist who wanted to harness the power of life essence",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		abilities: [
			{
				name: "Essence Collection",
				description:
					"Automatically collects essence from defeated enemies within 30 feet.",
				type: "passive",
			},
			{
				name: "Essence Storage",
				description: "Can store up to 20 essence points.",
				type: "passive",
			},
			{
				name: "Essence Release",
				description: "Can release stored essence to heal or power abilities.",
				type: "active",
				action: "action",
				frequency: "at-will",
			},
		],
		activation: {
			type: "action",
			consumes_item: false,
			cost: "1 action",
			frequency: "at-will",
			trigger: "User activates the item.",
		},
		limitations: {
			cursed: false,
			charges: null,
			attunement_required: true,
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
				consumes_item: false,
				cost: "1 action",
				frequency: "at-will",
				trigger: "User activates the item.",
			},
			active_rules: [
				{
					name: "Essence Release",
					description: "Can release stored essence to heal or power abilities.",
					action: "action",
					dc: null,
					frequency: "at-will",
				},
			],
			audit: {
				fingerprint: "6b5b0477",
				payload_complete: true,
				uniqueness_seed: "essence-collector::Essence Collector",
				variant_note:
					"A field accessory. Cataloged in the Bureau quartermaster registry.",
			},
			condition: "Stunning",
			damage_profile: "2d8",
			formulas: {
				effect_formula: "2d8",
				recharge: "at-will",
				save_dc: null,
			},
			identity: {
				rarity: "very_rare",
				archetype: "gear_misc",
				canon_basis: "RA canon",
				distinguishing_rule:
					"Essence Collector keys standard gear misc rules through signature 7661bfb3.",
				role: "utility",
				signature: "7661bfb3",
				theme: "standard",
			},
			passive_rules: [
				"Deals 2d8 physical or magical damage on hit.",
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
				"Essence Collection: Automatically collects essence from defeated enemies within 30 feet.",
				"Essence Storage: Can store up to 20 essence points.",
			],
			resistance: ["force"],
			resolution: {
				type: "equipment_utility",
				active_options: [
					{
						name: "Essence Release",
						description:
							"Can release stored essence to heal or power abilities.",
						dc: null,
					},
				],
				non_damage_resolution: "Deals 2d8 physical or magical damage on hit.",
				passive_effects: [
					"Deals 2d8 physical or magical damage on hit.",
					"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
					"Essence Collection: Automatically collects essence from defeated enemies within 30 feet.",
					"Essence Storage: Can store up to 20 essence points.",
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
			special: "Aligned with Absolute resonance.",
			stat_bonuses: {
				Presence: 1,
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
