// Regents Compendium - Authoritative Source
// Regents are quest-locked CLASS OVERLAYS (Hunter specializations), not NPC names
// Unlock: DM-approved quest completion only — no gate-rank or level gating
// Post-unlock progression: level-based (regent level = character level)
// Kael Voss is the Supreme Deity / Prime Architect — NOT selectable as a regent
// Shadow soldiers and umbral features are exclusive to Umbral Regent

export interface Monarch {
	id: string;
	name: string;
	title: string;
	theme: string;
	description: string;
	rank: "D" | "C" | "B" | "A" | "S";
	image?: string;
	type?: string;
	tags?: string[];
	created_at?: string;
	source_book?: string;

	// System Ascendant 5e-style Hunter progression
	hit_dice: string; // "1d12", "1d8", etc.
	primary_ability: string[]; // Primary abilities for the Hunter
	saving_throws: string[]; // Additional saving throw proficiencies
	skill_proficiencies: string[]; // Hunter-specific skill proficiencies
	armor_proficiencies: string[]; // Any armor proficiencies granted
	weapon_proficiencies: string[]; // Any weapon proficiencies granted
	tool_proficiencies: string[]; // Any tool proficiencies granted

	// Level-based progression (1-20) - Hunter Rank Advancement
	class_features: {
		level: number;
		name: string;
		description: string;
		type: "passive" | "active" | "action" | "bonus-action" | "reaction";
		frequency?:
			| "at-will"
			| "short-rest"
			| "long-rest"
			| "once-per-day"
			| "once-per-long-rest";
	}[];

	// Spellcasting integration (if applicable) - System Awakening Powers
	spellcasting?: {
		ability: string;
		spell_slots: Record<string, number[]>;
		cantrips_known?: number[];
		spells_known?: number[];
		spell_preparation?: boolean;
		additional_spells?: string[]; // Hunter-specific spells
	};

	// Feature progression mapping - Hunter Level Progression
	progression_table: {
		[level: number]: {
			features_gained: string[];
			abilities_improved?: string[];
			spell_slots?: Record<string, number>;
			special_abilities?: string[];
		};
	};

	// Integration requirements - Quest-based Hunter Qualification
	regent_requirements?: {
		level: number;
		abilities: Record<string, number>;
		quest_completion: string;
		dm_approval: boolean;
	};

	// System Ascendant Hunter mechanics
	requirements: {
		quest_completion: string;
		dm_verification: boolean;
		prerequisite_job?: string;
		power_level: number; // 1-10 scale matching System Ascendant power levels
		system_awakening?: boolean; // Requires System Awakening
	};

	abilities: {
		name: string;
		description: string;
		type: "passive" | "active" | "action" | "bonus-action" | "reaction";
		frequency?: "at-will" | "short-rest" | "long-rest" | "once-per-day";
		dc?: number;
		spell_slot?: number;
		power_level?: number; // When this ability is unlocked
		essence_cost?: number; // Essence cost to use
	}[];

	features: {
		name: string;
		description: string;
		power_level: number; // When this feature is unlocked
	}[];

	mechanics: {
		stat_bonuses: {
			strength?: number;
			dexterity?: number;
			constitution?: number;
			intelligence?: number;
			wisdom?: number;
			charisma?: number;
		};
		special_abilities: string[];
		restrictions?: string[];
		progression: {
			level_1: string[];
			level_3: string[];
			level_5: string[];
			level_7: string[];
			level_9: string[];
			level_10: string[];
			level_11: string[];
			level_13: string[];
			level_15: string[];
			level_17: string[];
			level_19: string[];
			level_20: string[];
		};
		// Only Umbral Regent gets shadow soldier abilities
		shadow_legion_command?: boolean; // Can command Shadow Legion (Umbral Regent only)
		essence_manipulation?: boolean; // Can manipulate essence
	};
}

export const monarchs = [
	{
		id: "umbral-monarch-overlay",
		name: "Umbral Regent",
		title: "Umbral Regent Hunter Class",
		theme: "Umbral and Death",
		description:
			"The ultimate umbral manipulation Hunter class overlay, embodying mastery over the veil, death, and the ability to command the Umbral Legion. This is the highest tier veil-based Hunter class available to players, granting true Regent-level power over the umbral realm and the ability to command shadows.",
		rank: "S",
		image: "/generated/compendium/monarchs/umbral-sovereign.webp",
		type: "hunter-class-overlay",
		tags: [
			"regent",
			"umbral",
			"death",
			"hunter-class-overlay",
			"shadow-soldier-command",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",

		// System Ascendant 5e-style Hunter progression
		hit_dice: "1d12",
		primary_ability: ["Charisma", "Wisdom"],
		saving_throws: ["Wisdom", "Charisma"],
		skill_proficiencies: ["Stealth", "Intimidation", "Arcana", "Religion"],
		armor_proficiencies: ["Light armor", "Medium armor", "Shields"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],

		// Level-based progression (1-20) - Hunter Rank Advancement
		class_features: [
			{
				level: 1,
				name: "Umbral Command",
				description:
					"Command up to 20 umbral creatures as if they were your loyal followers. They obey your telepathic commands.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Veilstep Supreme",
				description:
					"As a bonus action, teleport up to 120 feet to any unoccupied space in dim light or darkness.",
				type: "bonus-action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Umbral Dominion",
				description:
					"You gain immunity to necrotic damage and advantage on all saving throws against umbral effects.",
				type: "passive",
			},
			{
				level: 2,
				name: "Essence Harvest",
				description:
					"When a creature dies within 30 feet, you can harvest its essence to regain 2d10 hit points.",
				type: "reaction",
				frequency: "short-rest",
			},
			{
				level: 2,
				name: "Regent's Presence",
				description:
					"Frightening presence: enemies within 30 feet must make a Wisdom saving throw (DC 18) or be frightened of you.",
				type: "passive",
			},
			{
				level: 3,
				name: "Legion of the Veil",
				description:
					"As an action, summon 2d6 umbral legionnaires that fight for you for 1 hour. They have the stats of shadows but obey your commands.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 3,
				name: "Umbral Mastery",
				description:
					"You can cast umbral spells at will without expending spell slots.",
				type: "passive",
			},
			{
				level: 4,
				name: "Army of the Damned",
				description:
					"Once per long rest, you can raise an army of up to 100 shadow creatures that serve you for 24 hours.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 5,
				name: "Dimensional Regent",
				description:
					"You can cast gate and plane shift without expending spell slots. You have advantage on saving throws against teleportation effects.",
				type: "passive",
			},
			{
				level: 5,
				name: "Dimensional Authority",
				description:
					"You can travel between planes at will and control dimensional gates.",
				type: "passive",
			},
			{
				level: 6,
				name: "Essence Lord",
				description:
					"You can harvest the essence of any creature, gaining their memories and abilities temporarily.",
				type: "action",
				frequency: "short-rest",
			},
			{
				level: 7,
				name: "Umbral Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute umbral control. All umbral creatures within gain advantage on all attacks.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 7,
				name: "Umbral God",
				description:
					"You become a living embodiment of the veil, able to shape umbral essence at will.",
				type: "passive",
			},
			{
				level: 8,
				name: "Death's Command",
				description:
					"You can command any undead creature, regardless of its origin or power.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Death's Authority",
				description:
					"As an action, force all undead within 300 feet to make a Wisdom save (DC 20) or become your loyal servants.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 9,
				name: "Umbral Emperor",
				description:
					"Your umbral powers extend across multiple planes, allowing you to affect the veil anywhere.",
				type: "passive",
			},
			{
				level: 10,
				name: "Absolute Umbral",
				description:
					"You achieve the ultimate umbral power, becoming immune to all effects and able to reshape reality through the veil.",
				type: "passive",
			},
		],

		// Spellcasting integration - System Awakening Powers
		spellcasting: {
			ability: "Charisma",
			spell_slots: {
				"1st": [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"2nd": [2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"3rd": [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"4th": [0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"5th": [0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"6th": [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"7th": [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"8th": [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"9th": [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4],
			},
			cantrips_known: [
				4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
			],
			spells_known: [
				6, 7, 9, 10, 12, 14, 15, 15, 15, 18, 19, 19, 20, 22, 22, 24, 24, 25, 26,
				27,
			],
			spell_preparation: false,
			additional_spells: [
				"Shadow Bolt",
				"Void Bolt",
				"Abyssal Bolt",
				"Dimensional Lock",
				"Plane Shift",
			],
		},

		// Feature progression mapping - Hunter Level Progression
		progression_table: {
			1: {
				features_gained: [
					"Umbral Command",
					"Veilstep Supreme",
					"Umbral Dominion",
				],
				spell_slots: { "1st": 4 },
			},
			2: {
				features_gained: ["Essence Harvest", "Regent's Presence"],
				spell_slots: { "1st": 3, "2nd": 2 },
			},
			3: {
				features_gained: ["Legion of the Veil", "Umbral Mastery"],
				spell_slots: { "1st": 4, "2nd": 3, "3rd": 2 },
			},
			4: {
				features_gained: ["Army of the Damned"],
				spell_slots: { "1st": 4, "2nd": 3, "3rd": 3, "4th": 1 },
			},
			5: {
				features_gained: ["Dimensional Regent", "Dimensional Authority"],
				spell_slots: { "1st": 4, "2nd": 3, "3rd": 3, "4th": 2, "5th": 1 },
			},
			6: {
				features_gained: ["Essence Lord"],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 2,
					"6th": 1,
				},
			},
			7: {
				features_gained: ["Umbral Dominion", "Umbral God"],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 2,
					"7th": 1,
				},
			},
			8: {
				features_gained: ["Death's Command"],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 2,
					"8th": 1,
				},
			},
			9: {
				features_gained: ["Death's Authority", "Umbral Emperor"],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 2,
					"9th": 1,
				},
			},
			10: {
				features_gained: ["Absolute Umbral"],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 3,
					"9th": 2,
				},
			},
			11: {
				features_gained: ["Shadow Ascendant", "Dimensional Lord", "Death God"],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 3,
					"9th": 3,
				},
			},
			12: {
				features_gained: [],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 3,
					"9th": 3,
				},
			},
			13: {
				features_gained: ["Shadow Apocalypse", "Void Dominion", "Essence God"],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 3,
					"9th": 3,
				},
			},
			14: {
				features_gained: [],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 3,
					"9th": 3,
				},
			},
			15: {
				features_gained: ["Shadow Reality", "Dimensional God", "Death Emperor"],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 3,
					"9th": 3,
				},
			},
			16: {
				features_gained: [],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 3,
					"9th": 3,
				},
			},
			17: {
				features_gained: [
					"Shadow Transcendence",
					"Void God",
					"Essence Emperor",
				],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 3,
					"9th": 3,
				},
			},
			18: {
				features_gained: [],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 3,
					"9th": 3,
				},
			},
			19: {
				features_gained: [
					"Shadow Omnipotence",
					"Dimensional Emperor",
					"Death Regent",
				],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 3,
					"9th": 3,
				},
			},
			20: {
				features_gained: [
					"Shadow Supremacy",
					"Absolute Shadow",
					"Ultimate Umbral Power",
				],
				spell_slots: {
					"1st": 4,
					"2nd": 3,
					"3rd": 3,
					"4th": 3,
					"5th": 3,
					"6th": 3,
					"7th": 3,
					"8th": 3,
					"9th": 4,
				},
			},
		},

		// Integration requirements - Quest-based Hunter Qualification
		regent_requirements: {
			level: 5,
			abilities: { charisma: 13, wisdom: 13 },
			quest_completion: "Complete the Umbral Regent Ascension quest series",
			dm_approval: true,
		},
		abilities: [
			{
				name: "Umbral Command",
				description:
					"Command up to 20 umbral creatures as if they were your loyal followers. They obey your telepathic commands.",
				type: "action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Legion of the Veil",
				description:
					"As an action, summon 2d6 umbral legionnaires that fight for you for 1 hour. They have the stats of shadows but obey your commands.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Veilstep Supreme",
				description:
					"As a bonus action, teleport up to 120 feet to any unoccupied space in dim light or darkness.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Essence Harvest",
				description:
					"When a creature dies within 30 feet, you can harvest its essence to regain 2d10 hit points.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Dimensional Regent",
				description:
					"You can cast gate and plane shift without expending spell slots. You have advantage on saving throws against teleportation effects.",
				type: "passive",
				frequency: "at-will",
				power_level: 5,
			},
			{
				name: "Umbral Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute umbral control. All umbral creatures within gain advantage on all attacks.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Death's Authority",
				description:
					"As an action, force all undead within 300 feet to make a Wisdom save (DC 20) or become your loyal servants.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Absolute Umbral",
				description:
					"You become the ultimate master of the veil, gaining immunity to all damage and the ability to command any umbral creature anywhere in the multiverse.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Umbral Dominion",
				description:
					"You gain immunity to necrotic damage and advantage on all saving throws against umbral effects.",
				power_level: 1,
			},
			{
				name: "Regent's Presence",
				description:
					"Frightening presence: enemies within 30 feet must make a Wisdom saving throw (DC 18) or be frightened of you.",
				power_level: 2,
			},
			{
				name: "Umbral Mastery",
				description:
					"You can cast umbral spells at will without expending spell slots.",
				power_level: 3,
			},
			{
				name: "Army of the Damned",
				description:
					"Once per long rest, you can raise an army of up to 100 shadow creatures that serve you for 24 hours.",
				power_level: 4,
			},
			{
				name: "Dimensional Authority",
				description:
					"You can travel between planes at will and control dimensional gates.",
				power_level: 5,
			},
			{
				name: "Essence Lord",
				description:
					"You can harvest the essence of any creature, gaining their memories and abilities temporarily.",
				power_level: 6,
			},
			{
				name: "Umbral God",
				description:
					"You become a living embodiment of the veil, able to shape umbral essence at will.",
				power_level: 7,
			},
			{
				name: "Death's Command",
				description:
					"You can command any undead creature, regardless of its origin or power.",
				power_level: 8,
			},
			{
				name: "Umbral Emperor",
				description:
					"Your umbral powers extend across multiple planes, allowing you to affect the veil anywhere.",
				power_level: 9,
			},
			{
				name: "Absolute Umbral",
				description:
					"You achieve the ultimate umbral power, becoming immune to all effects and able to reshape reality through the veil.",
				power_level: 10,
			},
			{
				name: "Shadow Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist in multiple planes simultaneously and command shadows across dimensions.",
				power_level: 11,
			},
			{
				name: "Dimensional Lord",
				description:
					"You gain complete control over dimensional travel, able to create permanent portals and reshape dimensional boundaries.",
				power_level: 11,
			},
			{
				name: "Death God",
				description:
					"You become a living embodiment of death, able to command all undead and determine the fate of souls.",
				power_level: 11,
			},
			{
				name: "Shadow Apocalypse",
				description:
					"Once per day, you can unleash a shadow apocalypse that covers a 10-mile radius in absolute darkness, where only you and your shadow creatures can see.",
				power_level: 13,
			},
			{
				name: "Void Dominion",
				description:
					"You gain control over the void itself, able to create pockets of nothingness that erase matter and energy.",
				power_level: 13,
			},
			{
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being, gaining their memories, abilities, and power permanently.",
				power_level: 13,
			},
			{
				name: "Shadow Reality",
				description:
					"You can reshape reality itself through shadows, creating alternate dimensions and rewriting physical laws.",
				power_level: 15,
			},
			{
				name: "Dimensional God",
				description:
					"You become a master of all dimensions, able to create, destroy, and reshape entire planes of existence.",
				power_level: 15,
			},
			{
				name: "Death Emperor",
				description:
					"Your command over death extends across all realities, allowing you to resurrect or destroy any being at will.",
				power_level: 15,
			},
			{
				name: "Shadow Transcendence",
				description:
					"You transcend the concept of shadows, becoming a fundamental force of the universe that cannot be contained or destroyed.",
				power_level: 17,
			},
			{
				name: "Void God",
				description:
					"You gain mastery over nothingness itself, able to erase concepts, memories, and even existence from reality.",
				power_level: 17,
			},
			{
				name: "Essence Emperor",
				description:
					"You can absorb and control the essence of entire worlds, gaining the collective power of civilizations.",
				power_level: 17,
			},
			{
				name: "Shadow Omnipotence",
				description:
					"You achieve true omnipotence within the shadow domain, able to control all shadows across all timelines and realities simultaneously.",
				power_level: 19,
			},
			{
				name: "Dimensional Emperor",
				description:
					"Your dimensional power extends across the multiverse, allowing you to create and destroy entire universes.",
				power_level: 19,
			},
			{
				name: "Death Monarch",
				description:
					"You become the ultimate authority over death and life, able to determine the fate of all existence.",
				power_level: 19,
			},
			{
				name: "Shadow Supremacy",
				description:
					"You achieve absolute supremacy over all shadows, becoming the source and master of all shadow power in existence.",
				power_level: 20,
			},
			{
				name: "Absolute Umbral",
				description:
					"You become the embodiment of absolute shadow, a force beyond comprehension that exists outside all laws of reality.",
				power_level: 20,
			},
			{
				name: "Kael's Power",
				description:
					"You achieve the full power of Kael Voss at his peak - the ability to command infinite shadow armies, reshape reality, control all dimensions, master death itself, and transcend to become a fundamental force of the multiverse. This is the ultimate power of the Umbral Monarch, surpassing all other beings in existence.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 4,
				dexterity: 4,
				constitution: 4,
				intelligence: 4,
				wisdom: 4,
				charisma: 4,
			},
			special_abilities: [
				"Immune to fear and charm effects",
				"Can see perfectly in magical and non-magical darkness",
				"Shadow creatures are automatically friendly toward you",
				"Can communicate with shadows and shadow creatures",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
			progression: {
				level_1: ["Shadow Command", "Shadow Step Supreme", "Shadow Dominion"],
				level_3: ["Army of Shadows", "Shadow Mastery", "Monarch's Presence"],
				level_5: [
					"Dimensional Regent",
					"Dimensional Authority",
					"Army of the Damned",
				],
				level_7: ["Shadow Dominion", "Shadow God", "Essence Lord"],
				level_9: ["Death's Authority", "Death's Command", "Shadow Emperor"],
				level_10: ["Shadow Dominion", "Absolute Shadow"],
				level_11: ["Shadow Ascendant", "Dimensional Lord", "Death God"],
				level_13: ["Shadow Apocalypse", "Void Dominion", "Essence God"],
				level_15: ["Shadow Reality", "Dimensional God", "Death Emperor"],
				level_17: ["Shadow Transcendence", "Void God", "Essence Emperor"],
				level_19: [
					"Shadow Omnipotence",
					"Dimensional Emperor",
					"Death Monarch",
				],
				level_20: ["Shadow Supremacy", "Absolute Shadow", "Kael's Power"],
			},
		},
	},
	{
		id: "flame-monarch-overlay",
		name: "Flame Monarch",
		title: "Flame Monarch Class",
		theme: "White Flames",
		description:
			"A powerful fire-based class overlay that grants mastery over white flames and purification fire. Users can incinerate enemies and purify corruption with sacred flames, embodying the Monarch of White Flames' absolute control over fire.",
		rank: "S",
		image: "/generated/compendium/monarchs/white-flame-monarch.webp",
		type: "class-overlay",
		tags: ["monarch", "flame", "fire", "white-flames", "class-overlay"],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Flame Monarch Trials quest series",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "White Flame Burst",
				description:
					"As an action, create a 30-foot radius of white flames. Creatures take 10d10 fire damage and must make a Constitution saving throw (DC 18) or be blinded for 1 minute. This mirrors the Monarch of White Flames' devastating fire attacks.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Purification Flame",
				description:
					"As an action, cleanse an area of 60-foot radius of all curses, diseases, and poisons. Fiends and undead in the area take 8d8 radiant damage. This reflects the purifying nature of white flames.",
				type: "action",
				frequency: "long-rest",
				power_level: 2,
			},
			{
				name: "Flame Step",
				description:
					"As a bonus action, teleport through flames up to 120 feet to any unoccupied space you can see. This mirrors the Monarch of White Flames' fire-based mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Flame Shield",
				description:
					"As a reaction when targeted by an attack, create a shield of white flames that grants resistance to the damage and deals 2d6 fire damage to the attacker. This reflects the defensive capabilities of white flames.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Immolation Aura",
				description:
					"Enemies within 10 feet take 1d6 fire damage at the start of their turn. You are immune to fire damage. This represents the Monarch of White Flames' passive fire control.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Flame Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute flame control. All fire creatures within gain advantage on all attacks. This mirrors the Monarch's domain over fire.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Purification Authority",
				description:
					"As an action, force all fiends and undead within 300 feet to make a Wisdom save (DC 20) or be purified and become your allies. This reflects the purifying power of white flames.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Flame Dominion",
				description:
					"You become the ultimate master of flames, gaining immunity to all damage and the ability to command any fire creature anywhere in the multiverse. This represents the Monarch of White Flames' ultimate power.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Flame Dominion",
				description:
					"You gain immunity to fire damage and resistance to radiant damage.",
				power_level: 1,
			},
			{
				name: "Purifying Presence",
				description:
					"Fiends and undead cannot willingly approach within 30 feet of you. This reflects the purifying aura of white flames.",
				power_level: 2,
			},
			{
				name: "White Flame Mastery",
				description:
					"You can cast fire-based spells at will without expending spell slots.",
				power_level: 3,
			},
			{
				name: "Phoenix Rebirth",
				description:
					"Once per long rest, when reduced to 0 hit points, you can explode in white flames (dealing 10d10 fire damage to all enemies within 30 feet) and return to life with full hit points.",
				power_level: 4,
			},
			{
				name: "Flame Authority",
				description:
					"You can travel through flames at will and control any fire source.",
				power_level: 5,
			},
			{
				name: "Purification Lord",
				description:
					"You can purify any creature, object, or area, removing all curses, diseases, and corruption.",
				power_level: 6,
			},
			{
				name: "Flame God",
				description:
					"You become a living embodiment of flame, able to create and control fire at will.",
				power_level: 7,
			},
			{
				name: "Purification Command",
				description:
					"You can command any fiend or undead creature, forcing them to serve your will.",
				power_level: 8,
			},
			{
				name: "Flame Emperor",
				description:
					"Your flame powers extend across multiple planes, allowing you to affect fire anywhere.",
				power_level: 9,
			},
			{
				name: "Absolute Flame",
				description:
					"You achieve the ultimate flame power, becoming immune to all effects and able to reshape reality through fire.",
				power_level: 10,
			},
			{
				name: "Flame Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure flame and command fire across all dimensions.",
				power_level: 11,
			},
			{
				name: "Purification Lord",
				description:
					"You gain complete control over purification, able to cleanse entire worlds of corruption and evil.",
				power_level: 11,
			},
			{
				name: "Fire God",
				description:
					"You become a living embodiment of fire, able to create and control flames that can reshape reality.",
				power_level: 11,
			},
			{
				name: "Flame Apocalypse",
				description:
					"Once per day, you can unleash a flame apocalypse that purifies a 10-mile radius, burning away all evil and corruption.",
				power_level: 13,
			},
			{
				name: "Purification Dominion",
				description:
					"You gain control over purification itself, able to remove any impurity from any being or object.",
				power_level: 13,
			},
			{
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being through purification, gaining their purified power.",
				power_level: 13,
			},
			{
				name: "Flame Reality",
				description:
					"You can reshape reality itself through white flames, creating worlds of pure light and purification.",
				power_level: 15,
			},
			{
				name: "Purification God",
				description:
					"You become a master of purification, able to cleanse entire universes of corruption.",
				power_level: 15,
			},
			{
				name: "Fire Emperor",
				description:
					"Your command over fire extends across all realities, allowing you to create and destroy with white flames.",
				power_level: 15,
			},
			{
				name: "Flame Transcendence",
				description:
					"You transcend the concept of fire, becoming a fundamental force of purification that cannot be contained.",
				power_level: 17,
			},
			{
				name: "Purification Emperor",
				description:
					"You gain mastery over purification itself, able to remove concepts like evil and corruption from existence.",
				power_level: 17,
			},
			{
				name: "Essence Emperor",
				description:
					"You can absorb and control the purified essence of entire worlds, gaining their collective power.",
				power_level: 17,
			},
			{
				name: "Flame Omnipotence",
				description:
					"You achieve true omnipotence within the flame domain, able to control all fire across all timelines.",
				power_level: 19,
			},
			{
				name: "Purification Monarch",
				description:
					"Your purification power extends across the multiverse, allowing you to cleanse entire universes.",
				power_level: 19,
			},
			{
				name: "Fire Monarch",
				description:
					"You become the ultimate authority over fire and purification, able to determine the fate of all existence.",
				power_level: 19,
			},
			{
				name: "Flame Supremacy",
				description:
					"You achieve absolute supremacy over all flames, becoming the source and master of all fire power in existence.",
				power_level: 20,
			},
			{
				name: "Absolute Flame",
				description:
					"You become the embodiment of absolute flame, a force beyond comprehension that exists outside all laws of reality.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description:
					"You achieve the full power of a Monarch at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Monarch, equal to all other Monarchs at their maximum potential.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 2,
				dexterity: 2,
				constitution: 4,
				intelligence: 2,
				wisdom: 2,
				charisma: 4,
			},
			special_abilities: [
				"Immune to fire and poison damage",
				"Can see through smoke and flames without penalty",
				"Fire creatures are automatically friendly toward you",
				"Can purify corrupted areas and creatures",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
			progression: {
				level_1: ["Flame Step", "Immolation Aura", "Flame Dominion"],
				level_3: [
					"White Flame Burst",
					"White Flame Mastery",
					"Purifying Presence",
				],
				level_5: ["Flame Shield", "Flame Authority", "Phoenix Rebirth"],
				level_7: ["Flame Dominion", "Flame God", "Purification Lord"],
				level_9: [
					"Purification Authority",
					"Purification Command",
					"Flame Emperor",
				],
				level_10: ["Flame Dominion", "Absolute Flame"],
				level_11: ["Flame Ascendant", "Purification Lord", "Fire God"],
				level_13: ["Flame Apocalypse", "Purification Dominion", "Essence God"],
				level_15: ["Flame Reality", "Purification God", "Fire Emperor"],
				level_17: [
					"Flame Transcendence",
					"Purification Emperor",
					"Essence Emperor",
				],
				level_19: ["Flame Omnipotence", "Purification Monarch", "Fire Monarch"],
				level_20: ["Flame Supremacy", "Absolute Flame", "Monarch Power"],
			},
		},
	},
	{
		id: "steel-flesh-monarch-overlay",
		name: "Steel Monarch",
		title: "Steel Monarch Class",
		theme: "Steel and Flesh",
		description:
			"A defensive class overlay that grants control over flesh manipulation and steel enhancement. Users can reinforce their bodies and manipulate organic matter, embodying the Steel Monarch's absolute mastery over biological and metallic matter.",
		rank: "S",
		image: "/generated/compendium/monarchs/steel-flesh-monarch.webp",
		type: "class-overlay",
		tags: [
			"monarch",
			"steel",
			"flesh",
			"defense",
			"steel-monarch",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Steel Monarch Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Flesh Reconstruction",
				description:
					"As an action, reshape your body to gain resistance to all damage for 1 minute and regenerate 10 hit points per round. This mirrors the Steel Monarch's ultimate flesh manipulation.",
				type: "action",
				frequency: "long-rest",
				power_level: 3,
			},
			{
				name: "Steel Weaving",
				description:
					"As a bonus action, create steel armor that provides +3 AC and resistance to piercing and slashing damage. This reflects the Steel Monarch's steel manipulation abilities.",
				type: "bonus-action",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Organic Manipulation",
				description:
					"As an action, reshape organic matter within 60 feet. Can heal allies or reshape terrain. This represents the Steel Monarch's control over biological matter.",
				type: "action",
				frequency: "once-per-day",
				power_level: 5,
			},
			{
				name: "Adaptive Defense",
				description:
					"As a reaction when targeted by an attack, adapt your body to gain immunity to that damage type until your next turn. This mirrors the Steel Monarch's adaptive defenses.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Regeneration Core",
				description:
					"You regenerate 1 hit point at the start of your turn if you have at least 1 hit point. This represents the Steel Monarch's passive regeneration.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Flesh Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute flesh control. All organic creatures within gain regeneration. This mirrors the Steel Monarch's domain over organic matter.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Steel Authority",
				description:
					"As an action, force all constructs within 300 feet to make a Wisdom save (DC 20) or become your loyal servants. This reflects the Steel Monarch's command over steel.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Flesh Dominion",
				description:
					"You become the ultimate master of flesh and steel, gaining immunity to all damage and the ability to reshape any organic matter anywhere in the multiverse. This represents the Steel Monarch's ultimate power.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Flesh Dominion",
				description:
					"You gain immunity to poison damage and disease. You cannot be aged or polymorphed.",
				power_level: 1,
			},
			{
				name: "Steel Presence",
				description:
					"Constructs and metal objects cannot willingly approach within 30 feet of you. This reflects the Steel Monarch's metallic aura.",
				power_level: 2,
			},
			{
				name: "Flesh Mastery",
				description:
					"You can cast healing and transmutation spells at will without expending spell slots. This represents the Steel Monarch's complete mastery over flesh magic.",
				power_level: 3,
			},
			{
				name: "Living Fortress",
				description:
					"Your natural armor class becomes 20 + your Constitution modifier. You cannot be knocked prone.",
				power_level: 4,
			},
			{
				name: "Steel Authority",
				description:
					"You can control any metal object within 120 feet as if with telekinesis.",
				power_level: 5,
			},
			{
				name: "Regeneration Lord",
				description:
					"You can regenerate any lost limb or organ in 1 minute, and can regenerate others at will.",
				power_level: 6,
			},
			{
				name: "Flesh God",
				description:
					"You become a living embodiment of flesh and steel, able to create and reshape organic matter at will.",
				power_level: 7,
			},
			{
				name: "Steel Command",
				description:
					"You can command any construct creature, regardless of its origin or power.",
				power_level: 8,
			},
			{
				name: "Flesh Emperor",
				description:
					"Your flesh powers extend across multiple planes, allowing you to affect organic matter anywhere.",
				power_level: 9,
			},
			{
				name: "Absolute Flesh",
				description:
					"You achieve the ultimate flesh power, becoming immune to all effects and able to reshape reality through organic matter.",
				power_level: 10,
			},
			{
				name: "Flesh Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure organic matter and command flesh across all dimensions.",
				power_level: 11,
			},
			{
				name: "Steel Lord",
				description:
					"You gain complete control over steel and metal, able to reshape entire worlds of metal at will.",
				power_level: 11,
			},
			{
				name: "Regeneration God",
				description:
					"You become a living embodiment of regeneration, able to regenerate anything from nothing.",
				power_level: 11,
			},
			{
				name: "Flesh Apocalypse",
				description:
					"Once per day, you can unleash a flesh apocalypse that reshapes a 10-mile radius, transforming all matter into organic perfection.",
				power_level: 13,
			},
			{
				name: "Steel Dominion",
				description:
					"You gain control over metal itself, able to create and destroy any metallic substance.",
				power_level: 13,
			},
			{
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being through organic matter, gaining their power.",
				power_level: 13,
			},
			{
				name: "Flesh Reality",
				description:
					"You can reshape reality itself through organic matter, creating living worlds.",
				power_level: 15,
			},
			{
				name: "Steel God",
				description:
					"You become a master of all metals, able to create and destroy entire metallic worlds.",
				power_level: 15,
			},
			{
				name: "Regeneration Emperor",
				description:
					"Your regeneration extends across all realities, allowing you to resurrect any organic form.",
				power_level: 15,
			},
			{
				name: "Flesh Transcendence",
				description:
					"You transcend the concept of flesh, becoming a fundamental force of life that cannot be contained.",
				power_level: 17,
			},
			{
				name: "Steel Emperor",
				description:
					"You gain mastery over metal itself, able to create concepts of metallurgy from nothing.",
				power_level: 17,
			},
			{
				name: "Essence Emperor",
				description:
					"You can absorb and control the organic essence of entire worlds, gaining their collective power.",
				power_level: 17,
			},
			{
				name: "Flesh Omnipotence",
				description:
					"You achieve true omnipotence within the organic domain, able to control all life across all timelines.",
				power_level: 19,
			},
			{
				name: "Steel Monarch",
				description:
					"Your metallic power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Regeneration Monarch",
				description:
					"You become the ultimate authority over life and regeneration, able to determine the fate of all existence.",
				power_level: 19,
			},
			{
				name: "Flesh Supremacy",
				description:
					"You achieve absolute supremacy over all organic matter, becoming the source and master of all life.",
				power_level: 20,
			},
			{
				name: "Absolute Flesh",
				description:
					"You become the embodiment of absolute life, a force beyond comprehension that exists outside all laws of reality.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description:
					"You achieve the full power of a Monarch at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Monarch, equal to all other Monarchs at their maximum potential.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 4,
				dexterity: 2,
				constitution: 6,
				intelligence: 2,
				wisdom: 2,
				charisma: 2,
			},
			special_abilities: [
				"Immune to disease, poison, and aging effects",
				"Can regenerate lost limbs in 1 minute",
				"Can reshape organic matter at will",
				"Steel and metal objects respond to your will",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
			progression: {
				level_1: ["Regeneration Core", "Flesh Dominion", "Steel Presence"],
				level_3: ["Flesh Reconstruction", "Flesh Mastery", "Adaptive Defense"],
				level_5: ["Steel Weaving", "Steel Authority", "Living Fortress"],
				level_7: ["Organic Manipulation", "Flesh God", "Regeneration Lord"],
				level_9: ["Flesh Dominion", "Steel Command", "Flesh Emperor"],
				level_10: ["Steel Authority", "Absolute Flesh"],
				level_11: ["Flesh Ascendant", "Steel Lord", "Regeneration God"],
				level_13: ["Flesh Apocalypse", "Steel Dominion", "Essence God"],
				level_15: ["Flesh Reality", "Steel God", "Regeneration Emperor"],
				level_17: ["Flesh Transcendence", "Steel Emperor", "Essence Emperor"],
				level_19: [
					"Flesh Omnipotence",
					"Steel Monarch",
					"Regeneration Monarch",
				],
				level_20: ["Flesh Supremacy", "Absolute Flesh", "Monarch Power"],
			},
		},
	},
	{
		id: "frost-monarch-overlay",
		name: "Frost Monarch",
		title: "Ice Monarch Class",
		theme: "Ice and Cold",
		description:
			"An ice-based class overlay that grants absolute control over cold and ice. Users can freeze enemies solid and create blizzards at will, embodying the Frost Monarch's complete mastery over the cold domain.",
		rank: "S",
		image: "/generated/compendium/monarchs/ice-cold-monarch.webp",
		type: "class-overlay",
		tags: ["monarch", "ice", "cold", "frost", "class-overlay"],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Frost Monarch Trials quest series",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Absolute Zero",
				description:
					"As an action, create a 30-foot radius of extreme cold. Creatures take 12d8 cold damage and must make Constitution saves (DC 18) or be frozen solid for 1 minute. This mirrors the Frost Monarch's ultimate freezing power.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Ice Shard Storm",
				description:
					"As an action, create a storm of ice shards in a 60-foot cone. Creatures take 8d10 piercing and cold damage. This reflects the Frost Monarch's ice-based attacks.",
				type: "action",
				frequency: "long-rest",
				power_level: 2,
			},
			{
				name: "Frost Step",
				description:
					"As a bonus action, teleport by freezing the air and reappearing up to 120 feet away, leaving behind a patch of slippery ice. This mirrors the Frost Monarch's ice-based mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Cryo Shield",
				description:
					"As a reaction when targeted by an attack, create a shield of ice that blocks the attack and freezes the attacker for 1 round. This reflects the Frost Monarch's defensive ice capabilities.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Winter's Grasp",
				description:
					"Enemies within 15 feet have their speed reduced to 0 and cannot take reactions. This represents the Frost Monarch's passive cold control.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Ice Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute ice control. All ice creatures within gain advantage on all attacks. This mirrors the Frost Monarch's domain over ice.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Cold Authority",
				description:
					"As an action, force all fire creatures within 300 feet to make a Wisdom save (DC 20) or become frozen and serve your will. This reflects the Frost Monarch's command over opposing elements.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Frost Dominion",
				description:
					"You become the ultimate master of cold, gaining immunity to all damage and the ability to command any ice creature anywhere in the multiverse. This represents the Frost Monarch's ultimate power.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Ice Dominion",
				description:
					"You gain immunity to cold damage and resistance to piercing damage.",
				power_level: 1,
			},
			{
				name: "Frost Presence",
				description:
					"Fire-based creatures cannot willingly approach within 30 feet of you. This reflects the Frost Monarch's chilling aura.",
				power_level: 2,
			},
			{
				name: "Ice Mastery",
				description:
					"You can cast cold-based spells at will without expending spell slots. This represents the Frost Monarch's complete mastery over ice magic.",
				power_level: 3,
			},
			{
				name: "Glacial Rebirth",
				description:
					"Once per long rest, when reduced to 0 hit points, you can shatter into ice and reform with full hit points, dealing 8d8 cold damage to all enemies within 30 feet.",
				power_level: 4,
			},
			{
				name: "Ice Authority",
				description:
					"You can travel through ice at will and control any ice source.",
				power_level: 5,
			},
			{
				name: "Winter Lord",
				description:
					"You can freeze any creature, object, or area, creating permanent ice structures.",
				power_level: 6,
			},
			{
				name: "Ice God",
				description:
					"You become a living embodiment of cold, able to create and control ice at will.",
				power_level: 7,
			},
			{
				name: "Cold Command",
				description:
					"You can command any fire creature, forcing them to serve your will.",
				power_level: 8,
			},
			{
				name: "Frost Emperor",
				description:
					"Your ice powers extend across multiple planes, allowing you to affect cold anywhere.",
				power_level: 9,
			},
			{
				name: "Absolute Cold",
				description:
					"You achieve the ultimate cold power, becoming immune to all effects and able to reshape reality through ice.",
				power_level: 10,
			},
			{
				name: "Frost Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure ice and command cold across all dimensions.",
				power_level: 11,
			},
			{
				name: "Ice Lord",
				description:
					"You gain complete control over ice and cold, able to reshape entire worlds of ice at will.",
				power_level: 11,
			},
			{
				name: "Winter God",
				description:
					"You become a living embodiment of winter, able to create eternal winters.",
				power_level: 11,
			},
			{
				name: "Frost Apocalypse",
				description:
					"Once per day, you can unleash a frost apocalypse that freezes a 10-mile radius in absolute zero.",
				power_level: 13,
			},
			{
				name: "Ice Dominion",
				description:
					"You gain control over ice itself, able to create and destroy any frozen substance.",
				power_level: 13,
			},
			{
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being through cold, gaining their frozen power.",
				power_level: 13,
			},
			{
				name: "Frost Reality",
				description:
					"You can reshape reality itself through ice, creating frozen worlds.",
				power_level: 15,
			},
			{
				name: "Ice God",
				description:
					"You become a master of all ice, able to create and destroy entire frozen worlds.",
				power_level: 15,
			},
			{
				name: "Winter Emperor",
				description:
					"Your winter extends across all realities, allowing you to freeze entire universes.",
				power_level: 15,
			},
			{
				name: "Frost Transcendence",
				description:
					"You transcend the concept of cold, becoming a fundamental force of winter that cannot be contained.",
				power_level: 17,
			},
			{
				name: "Ice Emperor",
				description:
					"You gain mastery over ice itself, able to create concepts of cold from nothing.",
				power_level: 17,
			},
			{
				name: "Essence Emperor",
				description:
					"You can absorb and control the frozen essence of entire worlds, gaining their collective power.",
				power_level: 17,
			},
			{
				name: "Frost Omnipotence",
				description:
					"You achieve true omnipotence within the cold domain, able to control all ice across all timelines.",
				power_level: 19,
			},
			{
				name: "Ice Monarch",
				description:
					"Your ice power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Winter Monarch",
				description:
					"You become the ultimate authority over cold and winter, able to determine the fate of all existence.",
				power_level: 19,
			},
			{
				name: "Frost Supremacy",
				description:
					"You achieve absolute supremacy over all cold, becoming the source and master of all ice.",
				power_level: 20,
			},
			{
				name: "Absolute Cold",
				description:
					"You become the embodiment of absolute cold, a force beyond comprehension that exists outside all laws of reality.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description:
					"You achieve the full power of a Monarch at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Monarch, equal to all other Monarchs at their maximum potential.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 2,
				dexterity: 2,
				constitution: 4,
				intelligence: 2,
				wisdom: 4,
				charisma: 2,
			},
			special_abilities: [
				"Immune to cold and poison damage",
				"Can see through snow and ice without penalty",
				"Ice and cold creatures are automatically friendly toward you",
				"Can create and control ice structures at will",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
			progression: {
				level_1: ["Frost Step", "Winter's Grasp", "Ice Dominion"],
				level_3: ["Absolute Zero", "Ice Mastery", "Frost Presence"],
				level_5: ["Ice Shard Storm", "Ice Authority", "Glacial Rebirth"],
				level_7: ["Cryo Shield", "Ice God", "Winter Lord"],
				level_9: ["Ice Dominion", "Cold Command", "Frost Emperor"],
				level_10: ["Cold Authority", "Absolute Cold"],
				level_11: ["Frost Ascendant", "Ice Lord", "Winter God"],
				level_13: ["Frost Apocalypse", "Ice Dominion", "Essence God"],
				level_15: ["Frost Reality", "Ice God", "Winter Emperor"],
				level_17: ["Frost Transcendence", "Ice Emperor", "Essence Emperor"],
				level_19: ["Frost Omnipotence", "Ice Monarch", "Winter Monarch"],
				level_20: ["Frost Supremacy", "Absolute Cold", "Monarch Power"],
			},
		},
	},
	{
		id: "destruction-monarch-overlay",
		name: "Destruction Monarch",
		title: "Destruction Monarch Class",
		theme: "Destruction",
		description:
			"A destructive class overlay focused on pure annihilation and devastation. Users can obliterate targets with overwhelming destructive force, embodying Varkun' absolute power over destruction.",
		rank: "S",
		image: "/generated/compendium/monarchs/destruction-monarch.webp",
		type: "class-overlay",
		tags: ["monarch", "destruction", "annihilation", "varkun", "class-overlay"],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Path of Destruction quest series",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Annihilation Wave",
				description:
					"As an action, unleash a wave of pure destructive force in a 60-foot line. Creatures take 15d10 force damage and objects are destroyed. This mirrors Varkun' devastating destructive power.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Decimation Field",
				description:
					"As an action, create a 30-foot radius field where all creatures take 6d6 force damage at the start of their turn for 1 minute. This reflects the Destruction Monarch's area of devastation.",
				type: "action",
				frequency: "long-rest",
				power_level: 2,
			},
			{
				name: "Destruction Step",
				description:
					"As a bonus action, teleport by destroying the space between locations, dealing 3d6 force damage to creatures passed through. This mirrors the Destruction Monarch's destructive mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Vortex Shield",
				description:
					"As a reaction when targeted by an attack, create a destructive vortex that redirects the attack back at the attacker. This reflects the Destruction Monarch's destructive defense.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Aura of Ruin",
				description:
					"Non-magical objects within 20 feet crumble to dust over time. Structures take 1d10 damage per round. This represents the Destruction Monarch's passive destructive aura.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Destruction Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute destruction control. All destructive effects within are maximized. This mirrors the Destruction Monarch's domain over destruction.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Annihilation Authority",
				description:
					"As an action, force all constructs within 300 feet to make a Wisdom save (DC 20) or be destroyed and become your servants. This reflects the Destruction Monarch's command over destruction.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Destruction Dominion",
				description:
					"You become the ultimate master of destruction, gaining immunity to all damage and the ability to destroy any object or creature anywhere in the multiverse. This represents Varkun' ultimate destructive power.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Destruction Dominion",
				description:
					"You gain resistance to force damage and advantage on saving throws against being moved against your will.",
				power_level: 1,
			},
			{
				name: "Annihilation Presence",
				description:
					"Constructs and objects cannot willingly approach within 30 feet of you. This reflects the Destruction Monarch's destructive aura.",
				power_level: 2,
			},
			{
				name: "Destruction Mastery",
				description:
					"You can cast force-based spells at will without expending spell slots. This represents the Destruction Monarch's complete mastery over destructive magic.",
				power_level: 3,
			},
			{
				name: "Cataclysmic Rebirth",
				description:
					"Once per long rest, when reduced to 0 hit points, you can explode in destructive force (dealing 12d10 force damage to all enemies within 60 feet) and reform with full hit points.",
				power_level: 4,
			},
			{
				name: "Destruction Authority",
				description:
					"You can destroy any non-magical object at will and control destructive energy.",
				power_level: 5,
			},
			{
				name: "Ruin Lord",
				description:
					"You can reshape terrain through destruction, creating permanent areas of devastation.",
				power_level: 6,
			},
			{
				name: "Destruction God",
				description:
					"You become a living embodiment of destruction, able to create and control destructive energy at will.",
				power_level: 7,
			},
			{
				name: "Annihilation Command",
				description:
					"You can command any construct creature, forcing them to serve your will.",
				power_level: 8,
			},
			{
				name: "Destruction Emperor",
				description:
					"Your destruction powers extend across multiple planes, allowing you to affect destruction anywhere.",
				power_level: 9,
			},
			{
				name: "Absolute Destruction",
				description:
					"You achieve the ultimate destruction power, becoming immune to all effects and able to reshape reality through destruction.",
				power_level: 10,
			},
			{
				name: "Destruction Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure destruction and command destruction across all dimensions.",
				power_level: 11,
			},
			{
				name: "Ruin Lord",
				description:
					"You gain complete control over ruin and destruction, able to reshape entire worlds through destruction.",
				power_level: 11,
			},
			{
				name: "Annihilation God",
				description:
					"You become a living embodiment of annihilation, able to erase anything from existence.",
				power_level: 11,
			},
			{
				name: "Destruction Apocalypse",
				description:
					"Once per day, you can unleash a destruction apocalypse that obliterates a 10-mile radius completely.",
				power_level: 13,
			},
			{
				name: "Annihilation Dominion",
				description:
					"You gain control over destruction itself, able to erase any concept from existence.",
				power_level: 13,
			},
			{
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being through destruction, gaining their annihilated power.",
				power_level: 13,
			},
			{
				name: "Destruction Reality",
				description:
					"You can reshape reality itself through destruction, creating worlds of pure annihilation.",
				power_level: 15,
			},
			{
				name: "Ruin God",
				description:
					"You become a master of all destruction, able to create and destroy through ruin.",
				power_level: 15,
			},
			{
				name: "Annihilation Emperor",
				description:
					"Your destruction extends across all realities, allowing you to annihilate entire universes.",
				power_level: 15,
			},
			{
				name: "Destruction Transcendence",
				description:
					"You transcend the concept of destruction, becoming a fundamental force of annihilation that cannot be contained.",
				power_level: 17,
			},
			{
				name: "Ruin Emperor",
				description:
					"You gain mastery over destruction itself, able to create concepts of ruin from nothing.",
				power_level: 17,
			},
			{
				name: "Essence Emperor",
				description:
					"You can absorb and control the destructive essence of entire worlds, gaining their collective power.",
				power_level: 17,
			},
			{
				name: "Destruction Omnipotence",
				description:
					"You achieve true omnipotence within the destruction domain, able to control all destruction across all timelines.",
				power_level: 19,
			},
			{
				name: "Annihilation Monarch",
				description:
					"Your destructive power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Ruin Monarch",
				description:
					"You become the ultimate authority over destruction and ruin, able to determine the fate of all existence.",
				power_level: 19,
			},
			{
				name: "Destruction Supremacy",
				description:
					"You achieve absolute supremacy over all destruction, becoming the source and master of all ruin.",
				power_level: 20,
			},
			{
				name: "Absolute Destruction",
				description:
					"You become the embodiment of absolute destruction, a force beyond comprehension that exists outside all laws of reality.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description:
					"You achieve the full power of a Monarch at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Monarch, equal to all other Monarchs at their maximum potential.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 6,
				dexterity: 2,
				constitution: 4,
				intelligence: 2,
				wisdom: 2,
				charisma: 2,
			},
			special_abilities: [
				"Immune to force and thunder damage",
				"Can destroy non-magical objects at will",
				"Destructive energy flows through your attacks",
				"Can reshape terrain through destruction",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
			progression: {
				level_1: ["Destruction Step", "Aura of Ruin", "Destruction Dominion"],
				level_3: [
					"Annihilation Wave",
					"Destruction Mastery",
					"Annihilation Presence",
				],
				level_5: [
					"Decimation Field",
					"Destruction Authority",
					"Cataclysmic Rebirth",
				],
				level_7: ["Vortex Shield", "Destruction God", "Ruin Lord"],
				level_9: [
					"Destruction Dominion",
					"Annihilation Command",
					"Destruction Emperor",
				],
				level_10: ["Annihilation Authority", "Absolute Destruction"],
				level_11: ["Destruction Ascendant", "Ruin Lord", "Annihilation God"],
				level_13: [
					"Destruction Apocalypse",
					"Annihilation Dominion",
					"Essence God",
				],
				level_15: ["Destruction Reality", "Ruin God", "Annihilation Emperor"],
				level_17: [
					"Destruction Transcendence",
					"Ruin Emperor",
					"Essence Emperor",
				],
				level_19: [
					"Destruction Omnipotence",
					"Annihilation Monarch",
					"Ruin Monarch",
				],
				level_20: [
					"Destruction Supremacy",
					"Absolute Destruction",
					"Monarch Power",
				],
			},
		},
	},
	{
		id: "plague-monarch-overlay",
		name: "Plague Monarch",
		title: "Plague Monarch Class",
		theme: "Disease and Plague",
		description:
			"A pestilence-based class overlay that grants control over diseases and plagues. Users can inflict devastating ailments and manipulate biological corruption, embodying the Monarch of Plagues' absolute mastery over disease.",
		rank: "S",
		image: "/generated/compendium/monarchs/plague-monarch.webp",
		type: "class-overlay",
		tags: [
			"monarch",
			"plague",
			"disease",
			"poison",
			"plague-monarch",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Plague Monarch Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Pandemic Wave",
				description:
					"As an action, release a wave of plague that infects all creatures in 60-foot radius. Victims must make Constitution saves (DC 18) or contract multiple diseases. This mirrors the Monarch of Plagues' devastating plague attacks.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Contagion Cloud",
				description:
					"As an action, create a 30-foot radius cloud of disease that deals 6d6 poison damage and imposes disadvantage on Constitution saves. This reflects the Monarch of Plagues' area disease control.",
				type: "action",
				frequency: "long-rest",
				power_level: 2,
			},
			{
				name: "Plague Step",
				description:
					"As a bonus action, teleport through disease vectors (insects, spores) up to 120 feet, leaving behind a trail of infection. This mirrors the Monarch of Plagues' disease-based mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Disease Shield",
				description:
					"As a reaction when targeted by an attack, infect the attacker with a debilitating disease that imposes disadvantage on attack rolls. This reflects the Monarch of Plagues' defensive disease capabilities.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Miasma Aura",
				description:
					"Enemies within 20 feet must make Constitution saves each turn or take 1d6 poison damage and gain a level of exhaustion. This represents the Monarch of Plagues' passive disease aura.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Plague Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute plague control. All disease creatures within gain advantage on all attacks. This mirrors the Monarch of Plagues' domain over disease.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Disease Authority",
				description:
					"As an action, force all living creatures within 300 feet to make a Wisdom save (DC 20) or become diseased and serve your will. This reflects the Monarch of Plagues' command over disease.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Plague Dominion",
				description:
					"You become the ultimate master of disease, gaining immunity to all damage and the ability to command any disease anywhere in the multiverse. This represents the Monarch of Plagues' ultimate power.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Plague Dominion",
				description:
					"You gain immunity to disease, poison, and all negative conditions. You cannot be aged or poisoned.",
				power_level: 1,
			},
			{
				name: "Pestilence Presence",
				description:
					"Living creatures cannot willingly approach within 30 feet of you. This reflects the Monarch of Plagues' disease aura.",
				power_level: 2,
			},
			{
				name: "Plague Mastery",
				description:
					"You can cast disease-based spells at will without expending spell slots. This represents the Monarch of Plagues' complete mastery over disease magic.",
				power_level: 3,
			},
			{
				name: "Rebirth from Corruption",
				description:
					"Once per long rest, when reduced to 0 hit points, you can dissolve into plague and reform with full hit points, infecting all enemies within 30 feet.",
				power_level: 4,
			},
			{
				name: "Plague Authority",
				description:
					"You can create and control disease vectors at will and control any disease source.",
				power_level: 5,
			},
			{
				name: "Disease Lord",
				description:
					"You can inflict any disease on any creature, object, or area, creating permanent areas of corruption.",
				power_level: 6,
			},
			{
				name: "Plague God",
				description:
					"You become a living embodiment of disease, able to create and control plague at will.",
				power_level: 7,
			},
			{
				name: "Disease Command",
				description:
					"You can command any living creature, forcing them to serve your will through disease.",
				power_level: 8,
			},
			{
				name: "Plague Emperor",
				description:
					"Your plague powers extend across multiple planes, allowing you to affect disease anywhere.",
				power_level: 9,
			},
			{
				name: "Absolute Plague",
				description:
					"You achieve the ultimate plague power, becoming immune to all effects and able to reshape reality through disease.",
				power_level: 10,
			},
			{
				name: "Plague Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure disease and command plague across all dimensions.",
				power_level: 11,
			},
			{
				name: "Disease Lord",
				description:
					"You gain complete control over disease and plague, able to reshape entire worlds through disease.",
				power_level: 11,
			},
			{
				name: "Pestilence God",
				description:
					"You become a living embodiment of pestilence, able to create any disease.",
				power_level: 11,
			},
			{
				name: "Plague Apocalypse",
				description:
					"Once per day, you can unleash a plague apocalypse that infects a 10-mile radius with ultimate disease.",
				power_level: 13,
			},
			{
				name: "Disease Dominion",
				description:
					"You gain control over disease itself, able to create any ailment.",
				power_level: 13,
			},
			{
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being through disease, gaining their infected power.",
				power_level: 13,
			},
			{
				name: "Plague Reality",
				description:
					"You can reshape reality itself through disease, creating worlds of pure pestilence.",
				power_level: 15,
			},
			{
				name: "Disease God",
				description:
					"You become a master of all disease, able to create and destroy through plague.",
				power_level: 15,
			},
			{
				name: "Pestilence Emperor",
				description:
					"Your plague extends across all realities, allowing you to infect entire universes.",
				power_level: 15,
			},
			{
				name: "Plague Transcendence",
				description:
					"You transcend the concept of disease, becoming a fundamental force of plague that cannot be contained.",
				power_level: 17,
			},
			{
				name: "Disease Emperor",
				description:
					"You gain mastery over disease itself, able to create concepts of plague from nothing.",
				power_level: 17,
			},
			{
				name: "Essence Emperor",
				description:
					"You can absorb and control the disease essence of entire worlds, gaining their collective power.",
				power_level: 17,
			},
			{
				name: "Plague Omnipotence",
				description:
					"You achieve true omnipotence within the plague domain, able to control all disease across all timelines.",
				power_level: 19,
			},
			{
				name: "Disease Monarch",
				description:
					"Your plague power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Pestilence Monarch",
				description:
					"You become the ultimate authority over disease and plague, able to determine the fate of all existence.",
				power_level: 19,
			},
			{
				name: "Plague Supremacy",
				description:
					"You achieve absolute supremacy over all disease, becoming the source and master of all plague.",
				power_level: 20,
			},
			{
				name: "Absolute Plague",
				description:
					"You become the embodiment of absolute disease, a force beyond comprehension that exists outside all laws of reality.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description:
					"You achieve the full power of a Monarch at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Monarch, equal to all other Monarchs at their maximum potential.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 2,
				dexterity: 2,
				constitution: 4,
				intelligence: 4,
				wisdom: 2,
				charisma: 2,
			},
			special_abilities: [
				"Immune to all diseases and poisons",
				"Can create and control disease vectors at will",
				"Disease creatures are automatically friendly toward you",
				"Can diagnose and cure any disease",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
			progression: {
				level_1: ["Plague Step", "Miasma Aura", "Plague Dominion"],
				level_3: ["Pandemic Wave", "Disease Mastery", "Pestilence Presence"],
				level_5: [
					"Contagion Cloud",
					"Plague Authority",
					"Rebirth from Corruption",
				],
				level_7: ["Disease Shield", "Plague God", "Disease Lord"],
				level_9: ["Plague Dominion", "Disease Command", "Plague Emperor"],
				level_10: ["Disease Authority", "Absolute Plague"],
				level_11: ["Plague Ascendant", "Disease Lord", "Pestilence God"],
				level_13: ["Plague Apocalypse", "Disease Dominion", "Essence God"],
				level_15: ["Plague Reality", "Disease God", "Pestilence Emperor"],
				level_17: [
					"Plague Transcendence",
					"Disease Emperor",
					"Essence Emperor",
				],
				level_19: [
					"Plague Omnipotence",
					"Disease Monarch",
					"Pestilence Monarch",
				],
				level_20: ["Plague Supremacy", "Absolute Plague", "Monarch Power"],
			},
		},
	},
	{
		id: "blood-monarch-overlay",
		name: "Blood Monarch",
		title: "Blood Monarch Class",
		theme: "Blood Manipulation",
		description:
			"A hemomancy-based class overlay that grants control over blood and life force. Users can manipulate blood in living beings and enhance their physical abilities, embodying the Monarch of Blood's absolute mastery over blood.",
		rank: "S",
		image: "/generated/compendium/monarchs/blood-monarch.webp",
		type: "class-overlay",
		tags: [
			"monarch",
			"blood",
			"life-force",
			"hemomancy",
			"blood-monarch",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Blood Monarch Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Blood Boil",
				description:
					"As an action, cause the blood of all creatures in 60-foot radius to boil. Victims take 14d8 necrotic damage and must make Constitution saves (DC 18) or be incapacitated. This mirrors the Monarch of Blood's devastating blood attacks.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Life Drain",
				description:
					"As an action, drain life force from up to 6 creatures within 30 feet. You regain 2d10 hit points per creature affected. This reflects the Monarch of Blood's life force manipulation.",
				type: "action",
				frequency: "long-rest",
				power_level: 2,
			},
			{
				name: "Blood Step",
				description:
					"As a bonus action, teleport through blood vessels and life force up to 120 feet, leaving behind a trail of blood. This mirrors the Monarch of Blood's blood-based mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Hemomantic Shield",
				description:
					"As a reaction when targeted by an attack, create a shield of blood that absorbs the damage and heals you for half the damage prevented. This reflects the Monarch of Blood's defensive blood capabilities.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Vampiric Aura",
				description:
					"Enemies within 20 feet lose 1d6 hit points at the start of their turn, and you regain the same amount. This represents the Monarch of Blood's passive blood aura.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Blood Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute blood control. All blood creatures within gain regeneration. This mirrors the Monarch of Blood's domain over blood.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Life Authority",
				description:
					"As an action, force all undead within 300 feet to make a Wisdom save (DC 20) or become your blood servants. This reflects the Monarch of Blood's command over life force.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Blood Dominion",
				description:
					"You become the ultimate master of blood, gaining immunity to all damage and the ability to command any blood creature anywhere in the multiverse. This represents the Monarch of Blood's ultimate power.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Blood Dominion",
				description:
					"You gain immunity to necrotic damage and cannot be drained of life force. You regenerate 5 hit points per round.",
				power_level: 1,
			},
			{
				name: "Life Force Presence",
				description:
					"Undead and constructs cannot willingly approach within 30 feet of you. This reflects the Monarch of Blood's life force aura.",
				power_level: 2,
			},
			{
				name: "Hemomancy Mastery",
				description:
					"You can cast blood and life force-based spells at will without expending spell slots. This represents the Monarch of Blood's complete mastery over blood magic.",
				power_level: 3,
			},
			{
				name: "Rebirth from Blood",
				description:
					"Once per long rest, when reduced to 0 hit points, you can dissolve into blood and reform with full hit points, draining 1d10 hit points from each enemy within 60 feet.",
				power_level: 4,
			},
			{
				name: "Blood Authority",
				description:
					"You can sense and manipulate blood in living creatures within 120 feet.",
				power_level: 5,
			},
			{
				name: "Life Lord",
				description:
					"You can drain life force from any creature, gaining their memories and abilities temporarily.",
				power_level: 6,
			},
			{
				name: "Blood God",
				description:
					"You become a living embodiment of blood, able to create and control blood at will.",
				power_level: 7,
			},
			{
				name: "Life Command",
				description:
					"You can command any undead creature, forcing them to serve your will through blood manipulation.",
				power_level: 8,
			},
			{
				name: "Blood Emperor",
				description:
					"Your blood powers extend across multiple planes, allowing you to affect blood anywhere.",
				power_level: 9,
			},
			{
				name: "Absolute Blood",
				description:
					"You achieve the ultimate blood power, becoming immune to all effects and able to reshape reality through blood.",
				power_level: 10,
			},
			{
				name: "Blood Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure blood and command blood across all dimensions.",
				power_level: 11,
			},
			{
				name: "Life Lord",
				description:
					"You gain complete control over life force and blood, able to reshape entire worlds through blood.",
				power_level: 11,
			},
			{
				name: "Hemomancy God",
				description:
					"You become a living embodiment of hemomancy, able to control any blood.",
				power_level: 11,
			},
			{
				name: "Blood Apocalypse",
				description:
					"Once per day, you can unleash a blood apocalypse that transforms a 10-mile radius into pure blood.",
				power_level: 13,
			},
			{
				name: "Life Dominion",
				description:
					"You gain control over life force itself, able to create or destroy any life.",
				power_level: 13,
			},
			{
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being through blood, gaining their life force.",
				power_level: 13,
			},
			{
				name: "Blood Reality",
				description:
					"You can reshape reality itself through blood, creating worlds of pure life force.",
				power_level: 15,
			},
			{
				name: "Life God",
				description:
					"You become a master of all life force, able to create and destroy through blood.",
				power_level: 15,
			},
			{
				name: "Hemomancy Emperor",
				description:
					"Your blood extends across all realities, allowing you to control entire universes.",
				power_level: 15,
			},
			{
				name: "Blood Transcendence",
				description:
					"You transcend the concept of blood, becoming a fundamental force of life that cannot be contained.",
				power_level: 17,
			},
			{
				name: "Life Emperor",
				description:
					"You gain mastery over life force itself, able to create concepts of life from nothing.",
				power_level: 17,
			},
			{
				name: "Essence Emperor",
				description:
					"You can absorb and control the blood essence of entire worlds, gaining their collective power.",
				power_level: 17,
			},
			{
				name: "Blood Omnipotence",
				description:
					"You achieve true omnipotence within the blood domain, able to control all life force across all timelines.",
				power_level: 19,
			},
			{
				name: "Life Monarch",
				description:
					"Your blood power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Hemomancy Monarch",
				description:
					"You become the ultimate authority over blood and life force, able to determine the fate of all existence.",
				power_level: 19,
			},
			{
				name: "Blood Supremacy",
				description:
					"You achieve absolute supremacy over all blood, becoming the source and master of all life force.",
				power_level: 20,
			},
			{
				name: "Absolute Blood",
				description:
					"You become the embodiment of absolute life force, a force beyond comprehension that exists outside all laws of reality.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description:
					"You achieve the full power of a Monarch at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Monarch, equal to all other Monarchs at their maximum potential.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 4,
				dexterity: 2,
				constitution: 6,
				intelligence: 2,
				wisdom: 2,
				charisma: 2,
			},
			special_abilities: [
				"Immune to life drain and necrotic damage",
				"Can sense and manipulate blood in living creatures",
				"Can heal through blood manipulation",
				"Blood creatures are automatically friendly toward you",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
			progression: {
				level_1: ["Blood Step", "Vampiric Aura", "Blood Dominion"],
				level_3: ["Blood Boil", "Hemomancy Mastery", "Life Force Presence"],
				level_5: ["Life Drain", "Blood Authority", "Rebirth from Blood"],
				level_7: ["Hemomantic Shield", "Blood God", "Life Lord"],
				level_9: ["Blood Dominion", "Life Command", "Blood Emperor"],
				level_10: ["Life Authority", "Absolute Blood"],
				level_11: ["Blood Ascendant", "Life Lord", "Hemomancy God"],
				level_13: ["Blood Apocalypse", "Life Dominion", "Essence God"],
				level_15: ["Blood Reality", "Life God", "Hemomancy Emperor"],
				level_17: ["Blood Transcendence", "Life Emperor", "Essence Emperor"],
				level_19: ["Blood Omnipotence", "Life Monarch", "Hemomancy Monarch"],
				level_20: ["Blood Supremacy", "Absolute Blood", "Monarch Power"],
			},
		},
	},
	{
		id: "berserk-monarch-overlay",
		name: "Berserk Monarch",
		title: "Berserk Monarch Class",
		theme: "Berserker Rage",
		description:
			"A rage-based class overlay that grants uncontrollable power through berserker fury. Users become unstoppable forces of destruction when enraged, embodying the Berserk Monarch's absolute mastery over rage.",
		rank: "S",
		image: "/generated/compendium/monarchs/berserker-monarch.webp",
		type: "class-overlay",
		tags: [
			"monarch",
			"berserk",
			"rage",
			"fury",
			"berserk-monarch",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Berserk Monarch Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Unstoppable Rage",
				description:
					"As an action, enter a berserk rage for 1 minute. You gain advantage on all attack rolls, resistance to all damage, and your attacks deal maximum damage. This mirrors the Berserk Monarch's ultimate rage state.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Fury Storm",
				description:
					"As an action, unleash a storm of fury that forces all creatures in 60-foot radius to make Wisdom saves (DC 18) or be frightened and take 8d8 psychic damage. This reflects the Berserk Monarch's area rage control.",
				type: "action",
				frequency: "long-rest",
				power_level: 2,
			},
			{
				name: "Rage Step",
				description:
					"As a bonus action, teleport through pure rage up to 120 feet, leaving behind a trail of destructive energy. This mirrors the Berserk Monarch's rage-based mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Fury Shield",
				description:
					"As a reaction when targeted by an attack, absorb the damage and add it to your next attack roll as bonus damage. This reflects the Berserk Monarch's defensive rage capabilities.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Berserk Aura",
				description:
					"Enemies within 20 feet must make Wisdom saves each turn or be frightened and take 1d8 psychic damage. This represents the Berserk Monarch's passive rage aura.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Rage Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute rage control. All berserk creatures within gain advantage on all attacks. This mirrors the Berserk Monarch's domain over rage.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Fury Authority",
				description:
					"As an action, force all peaceful creatures within 300 feet to make a Wisdom save (DC 20) or become enraged and serve your will. This reflects the Berserk Monarch's command over rage.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Berserk Dominion",
				description:
					"You become the ultimate master of rage, gaining immunity to all damage and the ability to command any berserk creature anywhere in the multiverse. This represents the Berserk Monarch's ultimate power.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Berserk Dominion",
				description:
					"You gain immunity to being frightened and charmed. You cannot be knocked unconscious while raging. This reflects the Berserk Monarch's mental fortitude.",
				power_level: 1,
			},
			{
				name: "Fury Presence",
				description:
					"Peaceful creatures cannot willingly approach within 30 feet of you. This reflects the Berserk Monarch's intimidating aura.",
				power_level: 2,
			},
			{
				name: "Rage Mastery",
				description:
					"You can cast rage-based spells at will without expending spell slots. This represents the Berserk Monarch's complete mastery over rage magic.",
				power_level: 3,
			},
			{
				name: "Rebirth from Fury",
				description:
					"Once per long rest, when reduced to 0 hit points, you can explode in fury (dealing 10d8 psychic damage to all enemies within 60 feet) and reform with full hit points in a rage state.",
				power_level: 4,
			},
			{
				name: "Rage Authority",
				description:
					"You can sense and manipulate rage in others within 120 feet.",
				power_level: 5,
			},
			{
				name: "Fury Lord",
				description:
					"You can induce rage in any creature, gaining their loyalty through fury.",
				power_level: 6,
			},
			{
				name: "Berserk God",
				description:
					"You become a living embodiment of rage, able to create and control fury at will.",
				power_level: 7,
			},
			{
				name: "Fury Command",
				description:
					"You can command any berserk creature, forcing them to serve your will.",
				power_level: 8,
			},
			{
				name: "Berserk Emperor",
				description:
					"Your rage powers extend across multiple planes, allowing you to affect fury anywhere.",
				power_level: 9,
			},
			{
				name: "Absolute Rage",
				description:
					"You achieve the ultimate rage power, becoming immune to all effects and able to reshape reality through fury.",
				power_level: 10,
			},
			{
				name: "Rage Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure rage and command fury across all dimensions.",
				power_level: 11,
			},
			{
				name: "Fury Lord",
				description:
					"You gain complete control over rage and fury, able to reshape entire worlds through anger.",
				power_level: 11,
			},
			{
				name: "Berserk God",
				description:
					"You become a living embodiment of berserk rage, able to unleash unlimited fury.",
				power_level: 11,
			},
			{
				name: "Rage Apocalypse",
				description:
					"Once per day, you can unleash a rage apocalypse that transforms a 10-mile radius into pure berserk fury.",
				power_level: 13,
			},
			{
				name: "Fury Dominion",
				description:
					"You gain control over rage itself, able to create or destroy any anger.",
				power_level: 13,
			},
			{
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being through rage, gaining their furious power.",
				power_level: 13,
			},
			{
				name: "Rage Reality",
				description:
					"You can reshape reality itself through rage, creating worlds of pure fury.",
				power_level: 15,
			},
			{
				name: "Fury God",
				description:
					"You become a master of all rage, able to create and destroy through fury.",
				power_level: 15,
			},
			{
				name: "Berserk Emperor",
				description:
					"Your rage extends across all realities, allowing you to control entire universes.",
				power_level: 15,
			},
			{
				name: "Rage Transcendence",
				description:
					"You transcend the concept of rage, becoming a fundamental force of fury that cannot be contained.",
				power_level: 17,
			},
			{
				name: "Fury Emperor",
				description:
					"You gain mastery over rage itself, able to create concepts of fury from nothing.",
				power_level: 17,
			},
			{
				name: "Essence Emperor",
				description:
					"You can absorb and control the rage essence of entire worlds, gaining their collective power.",
				power_level: 17,
			},
			{
				name: "Rage Omnipotence",
				description:
					"You achieve true omnipotence within the rage domain, able to control all fury across all timelines.",
				power_level: 19,
			},
			{
				name: "Fury Monarch",
				description:
					"Your rage power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Berserk Monarch",
				description:
					"You become the ultimate authority over rage and fury, able to determine the fate of all existence.",
				power_level: 19,
			},
			{
				name: "Rage Supremacy",
				description:
					"You achieve absolute supremacy over all rage, becoming the source and master of all fury.",
				power_level: 20,
			},
			{
				name: "Absolute Rage",
				description:
					"You become the embodiment of absolute fury, a force beyond comprehension that exists outside all laws of reality.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description:
					"You achieve the full power of a Monarch at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Monarch, equal to all other Monarchs at their maximum potential.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 8,
				dexterity: 2,
				constitution: 6,
				intelligence: 2,
				wisdom: 2,
				charisma: 2,
			},
			special_abilities: [
				"Immune to fear and charm effects",
				"Cannot be reduced below 1 hit point while raging",
				"Can sense and manipulate rage in others",
				"Berserk creatures are automatically friendly toward you",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
			progression: {
				level_1: ["Rage Step", "Berserk Aura", "Berserk Dominion"],
				level_3: ["Unstoppable Rage", "Rage Mastery", "Fury Presence"],
				level_5: ["Fury Storm", "Rage Authority", "Rebirth from Fury"],
				level_7: ["Fury Shield", "Berserk God", "Fury Lord"],
				level_9: ["Rage Dominion", "Fury Command", "Berserk Emperor"],
				level_10: ["Fury Authority", "Absolute Rage"],
				level_11: ["Rage Ascendant", "Fury Lord", "Berserk God"],
				level_13: ["Rage Apocalypse", "Fury Dominion", "Essence God"],
				level_15: ["Rage Reality", "Fury God", "Berserk Emperor"],
				level_17: ["Rage Transcendence", "Fury Emperor", "Essence Emperor"],
				level_19: ["Rage Omnipotence", "Fury Monarch", "Berserk Monarch"],
				level_20: ["Rage Supremacy", "Absolute Rage", "Monarch Power"],
			},
		},
	},
	{
		id: "dragonic-monarch-overlay",
		name: "Dragonic Monarch",
		title: "Dragon Monarch Class",
		theme: "Dragon Fire",
		description:
			"A draconic class overlay that grants dragon-like abilities and fire manipulation. Users can breathe fire and gain dragon physical traits, embodying the Dragonic Monarch's absolute mastery over draconic power.",
		rank: "S",
		image: "/generated/compendium/monarchs/dragon-monarch.webp",
		type: "class-overlay",
		tags: [
			"monarch",
			"dragon",
			"fire",
			"draconic",
			"dragonic-monarch",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Dragon Monarch Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Dragon Breath",
				description:
					"As an action, unleash a devastating breath weapon in a 90-foot cone. Creatures take 16d8 fire damage and must make Dexterity saves (DC 18) or catch fire. This mirrors the Dragonic Monarch's devastating breath attacks.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Draconic Presence",
				description:
					"As an action, project an aura of draconic majesty that forces all creatures in 60-foot radius to make Wisdom saves (DC 18) or be frightened for 1 minute. This reflects the Dragonic Monarch's intimidating presence.",
				type: "action",
				frequency: "long-rest",
				power_level: 2,
			},
			{
				name: "Dragon Flight",
				description:
					"As a bonus action, sprout draconic wings and gain a flying speed of 120 feet for 1 minute. This mirrors the Dragonic Monarch's draconic mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Dragon Scales",
				description:
					"As a reaction when targeted by an attack, grow protective dragon scales that grant resistance to the damage. This reflects the Dragonic Monarch's defensive draconic capabilities.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Fire Aura",
				description:
					"Enemies within 15 feet take 1d6 fire damage at the start of their turn. You are immune to fire damage. This represents the Dragonic Monarch's passive fire aura.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Dragon Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute dragon control. All dragon creatures within gain advantage on all attacks. This mirrors the Dragonic Monarch's domain over draconic power.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Draconic Authority",
				description:
					"As an action, force all humanoids and beasts within 300 feet to make a Wisdom save (DC 20) or become your loyal subjects. This reflects the Dragonic Monarch's command over lesser beings.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Dragon Dominion",
				description:
					"You become the ultimate master of dragons, gaining immunity to all damage and the ability to command any dragon anywhere in the multiverse. This represents the Dragonic Monarch's ultimate power.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Dragon Dominion",
				description:
					"You gain immunity to fire damage and resistance to all other damage types. You grow dragon-like physical features. This reflects the Dragonic Monarch's draconic nature.",
				power_level: 1,
			},
			{
				name: "Draconic Presence",
				description:
					"Humanoids and beasts cannot willingly approach within 30 feet of you unless they make a successful Wisdom save. This reflects the Dragonic Monarch's intimidating aura.",
				power_level: 2,
			},
			{
				name: "Dragon Mastery",
				description:
					"You can cast fire-based spells at will without expending spell slots and can speak Draconic. This represents the Dragonic Monarch's complete mastery over draconic magic.",
				power_level: 3,
			},
			{
				name: "Dragon Rebirth",
				description:
					"Once per long rest, when reduced to 0 hit points, you can transform into a true dragon (adult red dragon stats) for 1 hour, dealing 8d8 fire damage to all enemies within 60 feet when you transform.",
				power_level: 4,
			},
			{
				name: "Dragon Authority",
				description:
					"You can grow and retract dragon wings at will and have a permanent flying speed of 60 feet.",
				power_level: 5,
			},
			{
				name: "Draconic Lord",
				description:
					"You can transform into any dragon type at will for 1 hour.",
				power_level: 6,
			},
			{
				name: "Dragon God",
				description:
					"You become a living embodiment of dragons, able to create and control draconic energy at will.",
				power_level: 7,
			},
			{
				name: "Draconic Command",
				description:
					"You can command any dragon creature, forcing them to serve your will.",
				power_level: 8,
			},
			{
				name: "Dragon Emperor",
				description:
					"Your dragon powers extend across multiple planes, allowing you to affect dragons anywhere.",
				power_level: 9,
			},
			{
				name: "Absolute Dragon",
				description:
					"You achieve the ultimate dragon power, becoming immune to all effects and able to reshape reality through draconic might.",
				power_level: 10,
			},
			{
				name: "Dragon Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure draconic power and command dragons across all dimensions.",
				power_level: 11,
			},
			{
				name: "Draconic Lord",
				description:
					"You gain complete control over dragons and fire, able to reshape entire worlds through draconic power.",
				power_level: 11,
			},
			{
				name: "Fire God",
				description:
					"You become a living embodiment of draconic fire, able to unleash unlimited dragon power.",
				power_level: 11,
			},
			{
				name: "Dragon Apocalypse",
				description:
					"Once per day, you can unleash a dragon apocalypse that transforms a 10-mile radius into pure draconic power.",
				power_level: 13,
			},
			{
				name: "Fire Dominion",
				description:
					"You gain control over draconic power itself, able to create or destroy any dragon.",
				power_level: 13,
			},
			{
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being through draconic power, gaining their dragon essence.",
				power_level: 13,
			},
			{
				name: "Dragon Reality",
				description:
					"You can reshape reality itself through draconic power, creating worlds of pure dragons.",
				power_level: 15,
			},
			{
				name: "Fire God",
				description:
					"You become a master of all dragons, able to create and destroy through draconic power.",
				power_level: 15,
			},
			{
				name: "Draconic Emperor",
				description:
					"Your draconic extends across all realities, allowing you to control entire universes.",
				power_level: 15,
			},
			{
				name: "Dragon Transcendence",
				description:
					"You transcend the concept of dragons, becoming a fundamental force of draconic power that cannot be contained.",
				power_level: 17,
			},
			{
				name: "Fire Emperor",
				description:
					"You gain mastery over draconic power itself, able to create concepts of dragons from nothing.",
				power_level: 17,
			},
			{
				name: "Essence Emperor",
				description:
					"You can absorb and control the draconic essence of entire worlds, gaining their collective power.",
				power_level: 17,
			},
			{
				name: "Dragon Omnipotence",
				description:
					"You achieve true omnipotence within the draconic domain, able to control all dragons across all timelines.",
				power_level: 19,
			},
			{
				name: "Fire Monarch",
				description:
					"Your draconic power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Draconic Monarch",
				description:
					"You become the ultimate authority over dragons and draconic power, able to determine the fate of all existence.",
				power_level: 19,
			},
			{
				name: "Dragon Supremacy",
				description:
					"You achieve absolute supremacy over all dragons, becoming the source and master of all draconic power.",
				power_level: 20,
			},
			{
				name: "Absolute Dragon",
				description:
					"You become the embodiment of absolute draconic power, a force beyond comprehension that exists outside all laws of reality.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description:
					"You achieve the full power of a Monarch at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Monarch, equal to all other Monarchs at their maximum potential.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 6,
				dexterity: 2,
				constitution: 6,
				intelligence: 2,
				wisdom: 2,
				charisma: 4,
			},
			special_abilities: [
				"Immune to fire and poison damage",
				"Can grow and retract dragon wings at will",
				"Can speak Draconic and communicate with dragons",
				"Dragon creatures are automatically friendly toward you",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
			progression: {
				level_1: ["Dragon Flight", "Fire Aura", "Dragon Dominion"],
				level_3: ["Dragon Breath", "Dragon Mastery", "Draconic Presence"],
				level_5: ["Dragon Scales", "Dragon Authority", "Dragon Rebirth"],
				level_7: ["Draconic Presence", "Dragon God", "Draconic Lord"],
				level_9: ["Dragon Dominion", "Draconic Command", "Dragon Emperor"],
				level_10: ["Draconic Authority", "Absolute Dragon"],
				level_11: ["Dragon Ascendant", "Draconic Lord", "Fire God"],
				level_13: ["Dragon Apocalypse", "Fire Dominion", "Essence God"],
				level_15: ["Dragon Reality", "Fire God", "Draconic Emperor"],
				level_17: ["Dragon Transcendence", "Fire Emperor", "Essence Emperor"],
				level_19: ["Dragon Omnipotence", "Fire Monarch", "Draconic Monarch"],
				level_20: ["Dragon Supremacy", "Absolute Dragon", "Monarch Power"],
			},
		},
	},
	{
		id: "commander-monarch-overlay",
		name: "Commander Monarch",
		title: "Command Monarch Class",
		theme: "Shadow Command",
		description:
			"A leadership-based class overlay that grants command over shadow armies and tactical supremacy. Users can lead legions of umbral legionnaires, embodying the Commander Monarch's absolute mastery over shadow command.",
		rank: "S",
		image: "/generated/compendium/monarchs/shadow-command-monarch.webp",
		type: "class-overlay",
		tags: [
			"monarch",
			"command",
			"leadership",
			"tactics",
			"commander-monarch",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Command Monarch Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Army Command",
				description:
					"As an action, command up to 100 umbral legionnaires as if they were your loyal followers. They obey your telepathic commands. This mirrors the Commander Monarch's ultimate umbral legion control.",
				type: "action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Legion Summon",
				description:
					"As an action, summon a legion of 4d10 umbral legionnaires that fight for you for 1 hour. They have the stats of shadows but obey your commands. This reflects the Commander Monarch's legion summoning abilities.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Tactical Step",
				description:
					"As a bonus action, teleport through command authority up to 120 feet, bringing up to 5 allies with you. This mirrors the Commander Monarch's tactical mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Command Shield",
				description:
					"As a reaction when an ally is targeted by an attack, redirect the attack to yourself and gain resistance to the damage. This reflects the Commander Monarch's protective command capabilities.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Leadership Aura",
				description:
					"Allies within 30 feet gain advantage on attack rolls and saving throws. Enemies within this range have disadvantage on attacks against your allies. This represents the Commander Monarch's passive leadership aura.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Command Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute command control. All allied creatures within gain advantage on all attacks and cannot be frightened. This mirrors the Commander Monarch's domain over command.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Tactical Authority",
				description:
					"As an action, force all enemy commanders within 300 feet to make a Wisdom save (DC 20) or surrender their forces to your command. This reflects the Commander Monarch's command over enemy leadership.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Command Dominion",
				description:
					"You become the ultimate commander, gaining immunity to all damage and the ability to command any army anywhere in the multiverse. This represents the Commander Monarch's ultimate power.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Command Dominion",
				description:
					"You gain immunity to being frightened and charmed. You cannot be compelled to act against your will. This reflects the Commander Monarch's mental fortitude.",
				power_level: 1,
			},
			{
				name: "Leadership Presence",
				description:
					"Enemy commanders cannot willingly approach within 30 feet of you. This reflects the Commander Monarch's intimidating leadership aura.",
				power_level: 2,
			},
			{
				name: "Command Mastery",
				description:
					"You can cast command-based spells at will without expending spell slots. This represents the Commander Monarch's complete mastery over command magic.",
				power_level: 3,
			},
			{
				name: "Army Rebirth",
				description:
					"Once per long rest, when reduced to 0 hit points, you can rally your forces (healing all allies within 60 feet for 4d8 hit points) and return to life with full hit points.",
			},
			{
				name: "Command Authority",
				description:
					"You can communicate telepathically with any creature within 1 mile and issue commands.",
				power_level: 5,
			},
			{
				name: "Tactical Lord",
				description:
					"You can command any army, gaining their loyalty through tactical superiority.",
				power_level: 6,
			},
			{
				name: "Command God",
				description:
					"You become a living embodiment of command, able to create and control armies at will.",
				power_level: 7,
			},
			{
				name: "Tactical Command",
				description:
					"You can command any commander, forcing them to serve your will.",
				power_level: 8,
			},
			{
				name: "Command Emperor",
				description:
					"Your command powers extend across multiple planes, allowing you to affect armies anywhere.",
				power_level: 9,
			},
			{
				name: "Absolute Command",
				description:
					"You achieve the ultimate command power, becoming immune to all effects and able to reshape reality through tactical supremacy.",
				power_level: 10,
			},
			{
				name: "Command Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure command and control armies across all dimensions.",
				power_level: 11,
			},
			{
				name: "Tactical Lord",
				description:
					"You gain complete control over tactics and command, able to reshape entire worlds through strategy.",
				power_level: 11,
			},
			{
				name: "Leadership God",
				description:
					"You become a living embodiment of leadership, able to command any army.",
				power_level: 11,
			},
			{
				name: "Command Apocalypse",
				description:
					"Once per day, you can unleash a command apocalypse that transforms a 10-mile radius into absolute tactical control.",
				power_level: 13,
			},
			{
				name: "Tactical Dominion",
				description:
					"You gain control over command itself, able to create or destroy any strategy.",
				power_level: 13,
			},
			{
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being through command, gaining their tactical power.",
				power_level: 13,
			},
			{
				name: "Command Reality",
				description:
					"You can reshape reality itself through command, creating worlds of pure tactical supremacy.",
				power_level: 15,
			},
			{
				name: "Tactical God",
				description:
					"You become a master of all command, able to create and destroy through strategy.",
				power_level: 15,
			},
			{
				name: "Leadership Emperor",
				description:
					"Your command extends across all realities, allowing you to control entire universes.",
				power_level: 15,
			},
			{
				name: "Command Transcendence",
				description:
					"You transcend the concept of command, becoming a fundamental force of tactical power that cannot be contained.",
				power_level: 17,
			},
			{
				name: "Tactical Emperor",
				description:
					"You gain mastery over command itself, able to create concepts of strategy from nothing.",
				power_level: 17,
			},
			{
				name: "Essence Emperor",
				description:
					"You can absorb and control the command essence of entire worlds, gaining their collective power.",
				power_level: 17,
			},
			{
				name: "Command Omnipotence",
				description:
					"You achieve true omnipotence within the command domain, able to control all armies across all timelines.",
				power_level: 19,
			},
			{
				name: "Tactical Monarch",
				description:
					"Your command power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Leadership Monarch",
				description:
					"You become the ultimate authority over command and leadership, able to determine the fate of all existence.",
				power_level: 19,
			},
			{
				name: "Command Supremacy",
				description:
					"You achieve absolute supremacy over all command, becoming the source and master of all tactical power.",
				power_level: 20,
			},
			{
				name: "Absolute Command",
				description:
					"You become the embodiment of absolute tactical power, a force beyond comprehension that exists outside all laws of reality.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description:
					"You achieve the full power of a Monarch at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Monarch, equal to all other Monarchs at their maximum potential.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 2,
				dexterity: 2,
				constitution: 4,
				intelligence: 4,
				wisdom: 4,
				charisma: 6,
			},
			special_abilities: [
				"Immune to fear and charm effects",
				"Can communicate telepathically with any creature",
				"Can command any army or group",
				"Commanders are automatically respectful toward you",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
			progression: {
				level_1: ["Army Command", "Leadership Aura", "Command Dominion"],
				level_3: ["Legion Summon", "Tactical Mastery", "Leadership Presence"],
				level_5: ["Tactical Step", "Command Authority", "Army Rebirth"],
				level_7: ["Command Shield", "Command God", "Tactical Lord"],
				level_9: ["Command Dominion", "Tactical Command", "Command Emperor"],
				level_10: ["Tactical Authority", "Absolute Command"],
				level_11: ["Command Ascendant", "Tactical Lord", "Leadership God"],
				level_13: ["Command Apocalypse", "Tactical Dominion", "Essence God"],
				level_15: ["Command Reality", "Tactical God", "Leadership Emperor"],
				level_17: [
					"Command Transcendence",
					"Tactical Emperor",
					"Essence Emperor",
				],
				level_19: [
					"Command Omnipotence",
					"Tactical Monarch",
					"Leadership Monarch",
				],
				level_20: ["Command Supremacy", "Absolute Command", "Monarch Power"],
			},
		},
	},
	{
		id: "dragon-regent-overlay",
		name: "Dragon Regent",
		title: "Dragon Regent Hunter Class",
		theme: "Draconic Apocalypse",
		description:
			"The incarnation of primordial destruction. Transform into an ancient dragon of apocalypse whose breath erases matter from existence. Asphalt melts under your feet, satellites detect thermal spikes, and the Hunter Bureau classifies you as a Kaiju-class extinction event. Your awakening tapped into the primal draconic force that predates the System itself — a power from the original gates that opened before humanity had words for fire.",
		rank: "S",
		image: "/generated/compendium/monarchs/dragon-regent.webp",
		type: "hunter-class-overlay",
		tags: ["regent", "dragon", "fire", "destruction", "class-overlay"],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d12",
		primary_ability: ["Strength", "Vitality"],
		saving_throws: ["Strength", "Vitality"],
		skill_proficiencies: [
			"Athletics",
			"Intimidation",
			"Perception",
			"Survival",
		],
		armor_proficiencies: ["All armor", "Shields"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		class_features: [
			{
				level: 1,
				name: "Breath of Annihilation",
				description:
					"120-ft cone: 12d10 fire damage (AGI save DC 8+prof+STR). On kill, target is erased (no resurrection). Recharge 4-6.",
				type: "action",
				frequency: "short-rest",
			},
			{
				level: 1,
				name: "Destruction Aura",
				description:
					"Constant 60-ft aura of apocalyptic heat. Enemies: 4d6 fire/round. Objects ignite. Concrete cracks.",
				type: "passive",
			},
			{
				level: 2,
				name: "Draconic Pressure",
				description:
					"Your presence generates crushing gravitational force. Creatures within 30 ft: STR save or speed halved and disadvantage on attacks.",
				type: "action",
				frequency: "short-rest",
			},
			{
				level: 3,
				name: "Cataclysm Wings",
				description:
					"Manifest draconic wings (bonus action). Fly 90 ft. Wing buffet (30-ft cone, STR save or 6d6 + prone).",
				type: "bonus-action",
				frequency: "at-will",
			},
			{
				level: 4,
				name: "Scale Armor",
				description:
					"Dragon scales harden your skin. AC = 17 + AGI mod (max 2). Resistance to fire and physical damage.",
				type: "passive",
			},
			{
				level: 5,
				name: "True Dragon Form",
				description:
					"Transform into ancient red dragon (1 hour, 1/long rest). Gargantuan, fly 120 ft, AC 22, 4d10+STR, immunity fire/physical.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 6,
				name: "Primordial Flame",
				description:
					"Your fire damage ignores resistance and treats immunity as resistance.",
				type: "passive",
			},
			{
				level: 7,
				name: "World Burn",
				description:
					"1-mile radius: all flammable objects ignite, temperature rises 100°C. 1/long rest, 10 minutes.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 8,
				name: "Dragon's Hoard",
				description:
					"Sense all magical items within 1 mile. Know their rarity and school.",
				type: "passive",
			},
			{
				level: 9,
				name: "Apocalypse Breath",
				description:
					"Breath upgrades to 20d10. Terrain hit becomes magma (difficult, 4d10 fire/round) for 1 hour.",
				type: "passive",
			},
			{
				level: 10,
				name: "Absolute Dragon",
				description:
					"True Dragon Form becomes permanent toggle. You are immune to all fire and physical damage at all times.",
				type: "passive",
			},
		],
		spellcasting: {
			ability: "Strength",
			spell_slots: {
				"1st": [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"2nd": [2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"3rd": [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"4th": [0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"5th": [0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"6th": [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"7th": [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"8th": [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"9th": [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4],
			},
			cantrips_known: [
				3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
			],
			spells_known: [
				4, 5, 7, 8, 10, 12, 13, 13, 14, 16, 17, 17, 18, 20, 20, 22, 22, 23, 24,
				25,
			],
			spell_preparation: false,
			additional_spells: [
				"Burning Hands",
				"Fireball",
				"Wall of Fire",
				"Delayed Blast Fireball",
				"Meteor Swarm",
			],
		},
		progression_table: {
			1: { features_gained: ["Breath of Annihilation", "Destruction Aura"] },
			2: { features_gained: ["Draconic Pressure"] },
			3: { features_gained: ["Cataclysm Wings"] },
			4: { features_gained: ["Scale Armor"] },
			5: { features_gained: ["True Dragon Form"] },
			6: { features_gained: ["Primordial Flame"] },
			7: { features_gained: ["World Burn"] },
			8: { features_gained: ["Dragon's Hoard"] },
			9: { features_gained: ["Apocalypse Breath"] },
			10: { features_gained: ["Absolute Dragon"] },
			11: {
				features_gained: ["Dragon Ascendant", "Flame Lord", "Destruction God"],
			},
			13: {
				features_gained: ["Dragon Apocalypse", "Fire Dominion", "Essence God"],
			},
			15: {
				features_gained: ["Dragon Reality", "Flame God", "Destruction Emperor"],
			},
			17: {
				features_gained: [
					"Dragon Transcendence",
					"Fire Emperor",
					"Essence Emperor",
				],
			},
			19: {
				features_gained: [
					"Dragon Omnipotence",
					"Flame Monarch",
					"Destruction Monarch",
				],
			},
			20: {
				features_gained: [
					"Dragon Supremacy",
					"Absolute Dragon",
					"Monarch Power",
				],
			},
		},
		regent_requirements: {
			level: 12,
			abilities: { strength: 18 },
			quest_completion: "Complete the Trial of the Dragon Gate",
			dm_approval: true,
		},
		requirements: {
			quest_completion: "Complete the Trial of the Dragon Gate",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Breath of Annihilation",
				description:
					"120-ft cone: 12d10 fire. On kill, target erased from reality.",
				type: "action",
				frequency: "short-rest",
				power_level: 1,
			},
			{
				name: "True Dragon Form",
				description:
					"Ancient red dragon form. Gargantuan, fly 120 ft, AC 22, immunity fire/physical.",
				type: "action",
				frequency: "long-rest",
				power_level: 5,
			},
			{
				name: "Cataclysm Wings",
				description: "Fly 90 ft. Wing buffet 30-ft cone, 6d6 + prone.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 3,
			},
			{
				name: "Destruction Aura",
				description: "60-ft aura: 4d6 fire/round to enemies. Objects ignite.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "World Burn",
				description: "1-mile radius incendiary apocalypse. 10 min duration.",
				type: "action",
				frequency: "long-rest",
				power_level: 7,
			},
			{
				name: "Absolute Dragon",
				description:
					"Permanent dragon form. Immune to fire and physical at all times.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Destruction Aura",
				description:
					"60-ft aura of apocalyptic heat. 4d6 fire/round to enemies.",
				power_level: 1,
			},
			{
				name: "Draconic Pressure",
				description:
					"Crushing gravitational force. Speed halved, disadvantage on attacks.",
				power_level: 2,
			},
			{
				name: "Cataclysm Wings",
				description: "Manifest wings, fly 90 ft, wing buffet attack.",
				power_level: 3,
			},
			{
				name: "Scale Armor",
				description: "Natural AC 17 + AGI (max 2). Resistance fire/physical.",
				power_level: 4,
			},
			{
				name: "True Dragon Form",
				description: "Transform into ancient dragon with full stats.",
				power_level: 5,
			},
			{
				name: "Primordial Flame",
				description: "Fire ignores resistance, treats immunity as resistance.",
				power_level: 6,
			},
			{
				name: "World Burn",
				description: "1-mile incendiary zone.",
				power_level: 7,
			},
			{
				name: "Dragon's Hoard",
				description: "Sense all magic items within 1 mile.",
				power_level: 8,
			},
			{
				name: "Apocalypse Breath",
				description: "Breath upgrades to 20d10, creates magma terrain.",
				power_level: 9,
			},
			{
				name: "Absolute Dragon",
				description: "Permanent dragon form, total fire/physical immunity.",
				power_level: 10,
			},
			{
				name: "Dragon Ascendant",
				description: "Exist as pure draconic force across dimensions.",
				power_level: 11,
			},
			{
				name: "Dragon Apocalypse",
				description: "10-mile radius destruction zone.",
				power_level: 13,
			},
			{
				name: "Dragon Reality",
				description: "Reshape reality through draconic will.",
				power_level: 15,
			},
			{
				name: "Dragon Transcendence",
				description: "Transcend concept of destruction.",
				power_level: 17,
			},
			{
				name: "Dragon Omnipotence",
				description: "Control all fire across all timelines.",
				power_level: 19,
			},
			{
				name: "Dragon Supremacy",
				description: "Ultimate draconic power.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description:
					"Full Monarch power: reshape reality, command infinite armies, transcend existence.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 4,
				dexterity: 2,
				constitution: 4,
				intelligence: 2,
				wisdom: 2,
				charisma: 2,
			},
			special_abilities: [
				"Immune to fire damage",
				"Resistance to physical damage",
				"Fly 90 ft with wings",
				"Sense magic items within 1 mile",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"STR 18+ required",
			],
			progression: {
				level_1: ["Breath of Annihilation", "Destruction Aura"],
				level_3: ["Cataclysm Wings", "Draconic Pressure"],
				level_5: ["True Dragon Form", "Scale Armor"],
				level_7: ["World Burn", "Primordial Flame"],
				level_9: ["Apocalypse Breath", "Dragon's Hoard"],
				level_10: ["Absolute Dragon"],
				level_11: ["Dragon Ascendant", "Flame Lord", "Destruction God"],
				level_13: ["Dragon Apocalypse", "Fire Dominion", "Essence God"],
				level_15: ["Dragon Reality", "Flame God", "Destruction Emperor"],
				level_17: ["Dragon Transcendence", "Fire Emperor", "Essence Emperor"],
				level_19: [
					"Dragon Omnipotence",
					"Flame Monarch",
					"Destruction Monarch",
				],
				level_20: ["Dragon Supremacy", "Absolute Dragon", "Monarch Power"],
			},
		},
	},
	{
		id: "frost-regent-overlay",
		name: "Frost Regent",
		title: "Frost Regent Hunter Class",
		theme: "Eternal Winter",
		description:
			"Herald of the eternal winter. Bring ice age to modern cities. Thermometers break showing impossible temperatures and the Hunter Bureau classifies you as a climate catastrophe event. Your power taps into the absolute zero boundary — the point where molecular motion ceases and time itself slows to a crawl. Scientists monitoring your activities have documented localized temporal distortions near frost zones.",
		rank: "S",
		image: "/generated/compendium/monarchs/frost-regent.webp",
		type: "hunter-class-overlay",
		tags: ["regent", "frost", "ice", "cold", "time", "class-overlay"],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d10",
		primary_ability: ["Intelligence", "Sense"],
		saving_throws: ["Intelligence", "Sense"],
		skill_proficiencies: ["Arcana", "Investigation", "Nature", "Perception"],
		armor_proficiencies: ["Light armor", "Medium armor"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		class_features: [
			{
				level: 1,
				name: "Ice Age Advent",
				description:
					"5-mile radius ice storm (1/long rest, 8 hours). Temperature -100°C. Fire impossible.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 1,
				name: "Frost Dominion",
				description:
					"Immune to cold. Resistance to fire. Cannot slip on ice. Move at full speed on frozen surfaces.",
				type: "passive",
			},
			{
				level: 2,
				name: "Absolute Zero",
				description:
					"Touch: 10d10 cold + paralyzed (VIT save). On kill: diamond-hard ice statue at -273.15°C.",
				type: "action",
				frequency: "short-rest",
			},
			{
				level: 3,
				name: "Glacial Time",
				description:
					"60-ft radius: enemies half speed, disadvantage AGI, no reactions. 1 min, prof/long rest.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 5,
				name: "Winter's Immortality",
				description:
					"Immune to cold, fire, aging. Regenerate 20 HP/round below freezing. Auto-stabilize at 0 HP.",
				type: "passive",
			},
			{
				level: 7,
				name: "Cryogenic Prison",
				description:
					"Encase target in absolute-zero ice. VIT save DC 20 or imprisoned (only Wish frees).",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 9,
				name: "Temporal Frost",
				description:
					"Freeze time in 120-ft radius for 1 round. Only you act. 1/long rest.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Frost",
				description:
					"All cold damage you deal is maximized. Ice structures you create are permanent.",
				type: "passive",
			},
		],
		spellcasting: {
			ability: "Intelligence",
			spell_slots: {
				"1st": [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"2nd": [2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"3rd": [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"4th": [0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"5th": [0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"6th": [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"7th": [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"8th": [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"9th": [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4],
			},
			additional_spells: [
				"Ice Knife",
				"Sleet Storm",
				"Cone of Cold",
				"Freezing Sphere",
				"Time Stop",
			],
		},
		progression_table: {
			1: { features_gained: ["Ice Age Advent", "Frost Dominion"] },
			2: { features_gained: ["Absolute Zero"] },
			3: { features_gained: ["Glacial Time"] },
			5: { features_gained: ["Winter's Immortality"] },
			7: { features_gained: ["Cryogenic Prison"] },
			9: { features_gained: ["Temporal Frost"] },
			10: { features_gained: ["Absolute Frost"] },
			11: { features_gained: ["Frost Ascendant", "Temporal Lord", "Ice God"] },
			13: {
				features_gained: ["Frost Apocalypse", "Time Dominion", "Cryo God"],
			},
			15: { features_gained: ["Frost Reality", "Temporal God", "Ice Emperor"] },
			17: {
				features_gained: [
					"Frost Transcendence",
					"Time Emperor",
					"Cryo Emperor",
				],
			},
			19: {
				features_gained: [
					"Frost Omnipotence",
					"Temporal Monarch",
					"Ice Monarch",
				],
			},
			20: {
				features_gained: ["Frost Supremacy", "Absolute Frost", "Monarch Power"],
			},
		},
		regent_requirements: {
			level: 10,
			abilities: { intelligence: 16 },
			quest_completion: "Complete the Trial of the Frost Gate",
			dm_approval: true,
		},
		requirements: {
			quest_completion: "Complete the Trial of the Frost Gate",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Ice Age Advent",
				description: "5-mile ice storm, 8 hours. -100°C.",
				type: "action",
				frequency: "long-rest",
				power_level: 1,
			},
			{
				name: "Absolute Zero",
				description: "Touch: 10d10 cold + paralyzed.",
				type: "action",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Glacial Time",
				description: "Slow time in 60-ft radius.",
				type: "action",
				frequency: "long-rest",
				power_level: 3,
			},
			{
				name: "Temporal Frost",
				description: "Freeze time 120-ft for 1 round.",
				type: "action",
				frequency: "long-rest",
				power_level: 9,
			},
			{
				name: "Absolute Frost",
				description: "Maximize cold damage. Permanent ice structures.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Frost Dominion",
				description: "Immune to cold, resistance to fire.",
				power_level: 1,
			},
			{
				name: "Absolute Zero",
				description: "Touch attack: 10d10 cold + paralyzed.",
				power_level: 2,
			},
			{
				name: "Glacial Time",
				description: "Slow time in 60-ft radius.",
				power_level: 3,
			},
			{
				name: "Winter's Immortality",
				description: "Immune to cold/fire/aging, regeneration.",
				power_level: 5,
			},
			{
				name: "Cryogenic Prison",
				description: "Imprison in absolute-zero ice.",
				power_level: 7,
			},
			{
				name: "Temporal Frost",
				description: "Freeze time for 1 round.",
				power_level: 9,
			},
			{
				name: "Absolute Frost",
				description: "Maximize cold, permanent ice.",
				power_level: 10,
			},
			{
				name: "Frost Ascendant",
				description: "Transcend mortal limitations of cold.",
				power_level: 11,
			},
			{
				name: "Frost Apocalypse",
				description: "Continental ice age.",
				power_level: 13,
			},
			{
				name: "Frost Reality",
				description: "Reshape reality through ice.",
				power_level: 15,
			},
			{
				name: "Frost Transcendence",
				description: "Become fundamental force of entropy.",
				power_level: 17,
			},
			{
				name: "Frost Omnipotence",
				description: "Control cold across all timelines.",
				power_level: 19,
			},
			{
				name: "Frost Supremacy",
				description: "Ultimate frost power.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description: "Full Monarch power.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 2,
				dexterity: 2,
				constitution: 4,
				intelligence: 4,
				wisdom: 2,
				charisma: 2,
			},
			special_abilities: [
				"Immune to cold damage",
				"Resistance to fire damage",
				"Cannot slip on ice",
				"Slow time in radius",
			],
			restrictions: ["Requires Warden verification", "INT 16+ required"],
			progression: {
				level_1: ["Ice Age Advent", "Frost Dominion"],
				level_3: ["Absolute Zero", "Glacial Time"],
				level_5: ["Winter's Immortality"],
				level_7: ["Cryogenic Prison", "Primordial Frost"],
				level_9: ["Temporal Frost"],
				level_10: ["Absolute Frost"],
				level_11: ["Frost Ascendant", "Temporal Lord", "Ice God"],
				level_13: ["Frost Apocalypse", "Time Dominion", "Cryo God"],
				level_15: ["Frost Reality", "Temporal God", "Ice Emperor"],
				level_17: ["Frost Transcendence", "Time Emperor", "Cryo Emperor"],
				level_19: ["Frost Omnipotence", "Temporal Monarch", "Ice Monarch"],
				level_20: ["Frost Supremacy", "Absolute Frost", "Monarch Power"],
			},
		},
	},
	{
		id: "beast-regent-overlay",
		name: "Beast Regent",
		title: "Beast Regent Hunter Class",
		theme: "Primal Evolution",
		description:
			"Avatar of primordial evolution. All beasts recognize you as alpha. Transform into an apex predator from before human history. The Hunter Bureau classifies you as an Alpha-class biodiversity threat. Zoo animals break containment when you pass, police K-9 units refuse to engage, and wildlife documentarians film you instead of their subjects.",
		rank: "S",
		image: "/generated/compendium/monarchs/beast-regent.webp",
		type: "hunter-class-overlay",
		tags: ["regent", "beast", "primal", "evolution", "class-overlay"],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d12",
		primary_ability: ["Strength", "Vitality"],
		saving_throws: ["Strength", "Vitality"],
		skill_proficiencies: ["Athletics", "Animal Handling", "Nature", "Survival"],
		armor_proficiencies: ["Light armor", "Medium armor", "Shields"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		class_features: [
			{
				level: 1,
				name: "Apex Form",
				description:
					"Transform into primordial beast (10 min, prof/long rest). Huge, +6 STR/AGI/VIT (max 26), 3d10+STR natural weapons, regen 15 HP/turn, tremorsense 120 ft.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 1,
				name: "Alpha's Presence",
				description:
					"120-ft aura. Beasts friendly. Enemies: SENSE save or frightened + cannot attack you.",
				type: "passive",
			},
			{
				level: 2,
				name: "Beast King's Call",
				description:
					"Command ALL beasts within 10 miles (CR ≤ level). 1 hour, 1/week.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 3,
				name: "Primordial Regeneration",
				description:
					"Regrow limbs in 1 min. 25 HP/turn below half. Immune to age/disease. Toxins metabolize instantly.",
				type: "passive",
			},
			{
				level: 5,
				name: "Evolutionary Leap",
				description:
					"Adapt to any environment. Grow gills, wings, or thermal insulation as needed. 1 action.",
				type: "bonus-action",
				frequency: "at-will",
			},
			{
				level: 7,
				name: "Pack Tactics",
				description:
					"All allies within 30 ft gain advantage on attack rolls against targets you've damaged this turn.",
				type: "passive",
			},
			{
				level: 9,
				name: "Extinction Event",
				description:
					"1-mile radius: all hostile creatures take 6d10 force + frightened (SENSE save). 1/long rest.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Beast",
				description:
					"Apex Form becomes permanent. Command any beast worldwide. Immune to all physical damage.",
				type: "passive",
			},
		],
		progression_table: {
			1: { features_gained: ["Apex Form", "Alpha's Presence"] },
			2: { features_gained: ["Beast King's Call"] },
			3: { features_gained: ["Primordial Regeneration"] },
			5: { features_gained: ["Evolutionary Leap"] },
			7: { features_gained: ["Pack Tactics"] },
			9: { features_gained: ["Extinction Event"] },
			10: { features_gained: ["Absolute Beast"] },
			11: {
				features_gained: ["Beast Ascendant", "Primal Lord", "Evolution God"],
			},
			13: {
				features_gained: ["Beast Apocalypse", "Primal Dominion", "Essence God"],
			},
			15: {
				features_gained: ["Beast Reality", "Primal God", "Evolution Emperor"],
			},
			17: {
				features_gained: [
					"Beast Transcendence",
					"Primal Emperor",
					"Essence Emperor",
				],
			},
			19: {
				features_gained: [
					"Beast Omnipotence",
					"Primal Monarch",
					"Evolution Monarch",
				],
			},
			20: {
				features_gained: ["Beast Supremacy", "Absolute Beast", "Monarch Power"],
			},
		},
		regent_requirements: {
			level: 11,
			abilities: { strength: 17 },
			quest_completion: "Complete the Trial of the Beast Gate",
			dm_approval: true,
		},
		requirements: {
			quest_completion: "Complete the Trial of the Beast Gate",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Apex Form",
				description:
					"Huge primordial beast. +6 STR/AGI/VIT, 3d10 natural weapons, regen.",
				type: "action",
				frequency: "long-rest",
				power_level: 1,
			},
			{
				name: "Beast King's Call",
				description: "Command all beasts within 10 miles.",
				type: "action",
				frequency: "once-per-day",
				power_level: 2,
			},
			{
				name: "Extinction Event",
				description: "1-mile AoE: 6d10 force + frightened.",
				type: "action",
				frequency: "long-rest",
				power_level: 9,
			},
			{
				name: "Absolute Beast",
				description:
					"Permanent Apex Form. Global beast command. Physical immunity.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Alpha's Presence",
				description: "120-ft aura. Beasts friendly, enemies frightened.",
				power_level: 1,
			},
			{
				name: "Beast King's Call",
				description: "Command all beasts within 10 miles.",
				power_level: 2,
			},
			{
				name: "Primordial Regeneration",
				description: "Regrow limbs, 25 HP/turn below half, immune age/disease.",
				power_level: 3,
			},
			{
				name: "Evolutionary Leap",
				description: "Adapt to any environment on demand.",
				power_level: 5,
			},
			{
				name: "Pack Tactics",
				description: "Allies gain advantage on your targets.",
				power_level: 7,
			},
			{
				name: "Extinction Event",
				description: "1-mile AoE devastation.",
				power_level: 9,
			},
			{
				name: "Absolute Beast",
				description: "Permanent form, total physical immunity.",
				power_level: 10,
			},
			{
				name: "Beast Ascendant",
				description: "Transcend biology.",
				power_level: 11,
			},
			{
				name: "Beast Apocalypse",
				description: "Global primal event.",
				power_level: 13,
			},
			{
				name: "Beast Reality",
				description: "Reshape reality through evolution.",
				power_level: 15,
			},
			{
				name: "Beast Transcendence",
				description: "Fundamental force of nature.",
				power_level: 17,
			},
			{
				name: "Beast Omnipotence",
				description: "Control all life.",
				power_level: 19,
			},
			{
				name: "Beast Supremacy",
				description: "Ultimate primal power.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description: "Full Monarch power.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 4,
				dexterity: 2,
				constitution: 4,
				intelligence: 2,
				wisdom: 2,
				charisma: 2,
			},
			special_abilities: [
				"Beasts automatically friendly",
				"Regeneration 15 HP/turn",
				"Tremorsense 120 ft",
				"Immune to disease and aging",
			],
			restrictions: ["Requires Warden verification", "STR or VIT 17+ required"],
			progression: {
				level_1: ["Apex Form", "Alpha's Presence"],
				level_3: ["Beast King's Call", "Primordial Regeneration"],
				level_5: ["Evolutionary Leap"],
				level_7: ["Pack Tactics"],
				level_9: ["Extinction Event"],
				level_10: ["Absolute Beast"],
				level_11: ["Beast Ascendant", "Primal Lord", "Evolution God"],
				level_13: ["Beast Apocalypse", "Primal Dominion", "Essence God"],
				level_15: ["Beast Reality", "Primal God", "Evolution Emperor"],
				level_17: ["Beast Transcendence", "Primal Emperor", "Essence Emperor"],
				level_19: ["Beast Omnipotence", "Primal Monarch", "Evolution Monarch"],
				level_20: ["Beast Supremacy", "Absolute Beast", "Monarch Power"],
			},
		},
	},
	{
		id: "plague-regent-overlay",
		name: "Plague Regent",
		title: "Plague Regent Hunter Class",
		theme: "Pandemic Incarnate",
		description:
			"Incarnation of plague and pestilence. Walking biological apocalypse. The CDC tracks 47 unknown pathogens in your wake. The Hunter Bureau classifies you as a Pandemic-class bioweapon. Insects obey your will, diseases are your art form, and quarantine zones form wherever you walk. Hospitals refuse your admittance, biohazard teams follow your movements, and the WHO has a dedicated task force assigned to you.",
		rank: "S",
		image: "/generated/compendium/monarchs/plague-regent.webp",
		type: "hunter-class-overlay",
		tags: ["regent", "plague", "disease", "swarm", "class-overlay"],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d10",
		primary_ability: ["Intelligence", "Sense"],
		saving_throws: ["Intelligence", "Vitality"],
		skill_proficiencies: ["Arcana", "Medicine", "Nature", "Survival"],
		armor_proficiencies: ["Light armor"],
		weapon_proficiencies: ["Simple weapons"],
		tool_proficiencies: ["Poisoner's kit", "Herbalism kit"],
		class_features: [
			{
				level: 1,
				name: "Typhoid Incarnate",
				description:
					"60-ft aura: VIT save DC 8+prof+INT or contract supernatural disease (4d12 necrotic/day, spreads). Only you or Wish can cure.",
				type: "passive",
			},
			{
				level: 1,
				name: "Insect God",
				description:
					"Command all insects within 5 miles. Insect Plague centered on any point.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 2,
				name: "Pandemic Protocol",
				description:
					"Create supernatural pandemic (1/month). Choose properties. R0=10. Only you can cure.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 3,
				name: "Billion Swarm",
				description:
					"Dissolve into insect swarm (1 hour). Fly 60 ft, squeeze 1-inch gaps, immune to non-AoE.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 5,
				name: "Pathogen Mastery",
				description:
					"Immune to all disease/poison. Detect diseases within 1 mile.",
				type: "passive",
			},
			{
				level: 7,
				name: "Plague Vector",
				description:
					"Touch: transfer any disease to target (no save). Cure any disease by touch.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Biological Apocalypse",
				description:
					"1-mile radius: all organic matter begins rapid decay. 8d10 necrotic/round. 1/long rest.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Plague",
				description:
					"Diseases you create are permanent, resist all curing. Swarm form is permanent toggle.",
				type: "passive",
			},
		],
		progression_table: {
			1: { features_gained: ["Typhoid Incarnate", "Insect God"] },
			2: { features_gained: ["Pandemic Protocol"] },
			3: { features_gained: ["Billion Swarm"] },
			5: { features_gained: ["Pathogen Mastery"] },
			7: { features_gained: ["Plague Vector"] },
			9: { features_gained: ["Biological Apocalypse"] },
			10: { features_gained: ["Absolute Plague"] },
			11: {
				features_gained: ["Plague Ascendant", "Swarm Lord", "Disease God"],
			},
			13: {
				features_gained: [
					"Plague Apocalypse",
					"Swarm Dominion",
					"Pathogen God",
				],
			},
			15: {
				features_gained: ["Plague Reality", "Swarm God", "Disease Emperor"],
			},
			17: {
				features_gained: [
					"Plague Transcendence",
					"Swarm Emperor",
					"Pathogen Emperor",
				],
			},
			19: {
				features_gained: [
					"Plague Omnipotence",
					"Swarm Monarch",
					"Disease Monarch",
				],
			},
			20: {
				features_gained: [
					"Plague Supremacy",
					"Absolute Plague",
					"Monarch Power",
				],
			},
		},
		regent_requirements: {
			level: 10,
			abilities: { intelligence: 16 },
			quest_completion: "Complete the Trial of the Plague Gate",
			dm_approval: true,
		},
		requirements: {
			quest_completion: "Complete the Trial of the Plague Gate",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Typhoid Incarnate",
				description: "60-ft disease aura. Incurable except by you.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Billion Swarm",
				description: "Dissolve into insect swarm. Immune to non-AoE.",
				type: "action",
				frequency: "long-rest",
				power_level: 3,
			},
			{
				name: "Biological Apocalypse",
				description: "1-mile decay zone. 8d10 necrotic/round.",
				type: "action",
				frequency: "long-rest",
				power_level: 9,
			},
			{
				name: "Absolute Plague",
				description: "Permanent incurable diseases. Permanent swarm.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Typhoid Incarnate",
				description: "Permanent disease aura.",
				power_level: 1,
			},
			{
				name: "Insect God",
				description: "Command insects within 5 miles.",
				power_level: 1,
			},
			{
				name: "Pandemic Protocol",
				description: "Create supernatural pandemics.",
				power_level: 2,
			},
			{
				name: "Billion Swarm",
				description: "Insect swarm form.",
				power_level: 3,
			},
			{
				name: "Pathogen Mastery",
				description: "Immune to disease/poison, detect diseases.",
				power_level: 5,
			},
			{
				name: "Plague Vector",
				description: "Transfer or cure any disease.",
				power_level: 7,
			},
			{
				name: "Biological Apocalypse",
				description: "1-mile decay zone.",
				power_level: 9,
			},
			{
				name: "Absolute Plague",
				description: "Permanent diseases, permanent swarm.",
				power_level: 10,
			},
			{
				name: "Plague Ascendant",
				description: "Transcend biological limitations.",
				power_level: 11,
			},
			{
				name: "Plague Apocalypse",
				description: "Continental pandemic.",
				power_level: 13,
			},
			{
				name: "Plague Reality",
				description: "Reshape reality through disease.",
				power_level: 15,
			},
			{
				name: "Plague Transcendence",
				description: "Become fundamental force of decay.",
				power_level: 17,
			},
			{
				name: "Plague Omnipotence",
				description: "Control all disease everywhere.",
				power_level: 19,
			},
			{
				name: "Plague Supremacy",
				description: "Ultimate plague power.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description: "Full Monarch power.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 2,
				dexterity: 2,
				constitution: 4,
				intelligence: 4,
				wisdom: 2,
				charisma: 2,
			},
			special_abilities: [
				"Immune to disease and poison",
				"Command insects within 5 miles",
				"Disease aura 60 ft",
				"Detect diseases within 1 mile",
			],
			restrictions: [
				"Requires Warden verification",
				"INT or SENSE 16+ required",
			],
			progression: {
				level_1: ["Typhoid Incarnate", "Insect God"],
				level_3: ["Pandemic Protocol", "Billion Swarm"],
				level_5: ["Pathogen Mastery"],
				level_7: ["Plague Vector"],
				level_9: ["Biological Apocalypse"],
				level_10: ["Absolute Plague"],
				level_11: ["Plague Ascendant", "Swarm Lord", "Disease God"],
				level_13: ["Plague Apocalypse", "Swarm Dominion", "Pathogen God"],
				level_15: ["Plague Reality", "Swarm God", "Disease Emperor"],
				level_17: ["Plague Transcendence", "Swarm Emperor", "Pathogen Emperor"],
				level_19: ["Plague Omnipotence", "Swarm Monarch", "Disease Monarch"],
				level_20: ["Plague Supremacy", "Absolute Plague", "Monarch Power"],
			},
		},
	},
	{
		id: "architect-regent-overlay",
		name: "Architect Regent",
		title: "Architect Regent Hunter Class",
		theme: "Reality Architecture",
		description:
			"Reality's architect. Reshape space, time, and dimensions. Create permanent worlds. Your System HUD shows universe blueprints. The Hunter Bureau classifies you as a Dimensional sovereignty threat. You build structures from nothing, create pocket dimensions for storage/bases/prisons, and place dimensional anchors worldwide for instant teleportation. Building inspectors have given up filing reports on your constructions.",
		rank: "S",
		image: "/generated/compendium/monarchs/architect-regent.webp",
		type: "hunter-class-overlay",
		tags: [
			"regent",
			"architect",
			"dimensional",
			"construction",
			"class-overlay",
		],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d8",
		primary_ability: ["Intelligence"],
		saving_throws: ["Intelligence", "Sense"],
		skill_proficiencies: ["Arcana", "Investigation", "History", "Perception"],
		armor_proficiencies: ["Light armor"],
		weapon_proficiencies: ["Simple weapons"],
		tool_proficiencies: ["Mason's tools", "Cartographer's tools"],
		class_features: [
			{
				level: 1,
				name: "World Creation",
				description:
					"Create permanent demiplane (1 mile cube, 1/month). Full control: gravity, time flow, atmosphere, structures.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 1,
				name: "Instant Architecture",
				description:
					"Create any structure (300 ft cube) as action. AC 25, 500 HP, permanent.",
				type: "action",
				frequency: "short-rest",
			},
			{
				level: 2,
				name: "Spatial Anchors",
				description:
					"Place 12 invisible anchors anywhere. Teleport between them (action, unlimited). Permanent.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Living Lair",
				description:
					"In your structures: reshape layout as bonus action, create/remove doors/walls/floors, control gravity per room.",
				type: "passive",
			},
			{
				level: 5,
				name: "Dimensional Lock",
				description:
					"Prevent all teleportation/plane shifting in 1-mile radius. 1 hour, 1/long rest.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 7,
				name: "Blueprint Vision",
				description:
					"See structural weaknesses, hidden rooms, and dimensional instabilities. Detect all portals/gates within 5 miles.",
				type: "passive",
			},
			{
				level: 9,
				name: "Reality Rewrite",
				description:
					"Reshape 1-mile area: change terrain, gravity direction, physics rules. Permanent. 1/week.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 10,
				name: "Absolute Architect",
				description:
					"Create demiplanes at will. All structures are indestructible. Reality Rewrite becomes daily.",
				type: "passive",
			},
		],
		progression_table: {
			1: { features_gained: ["World Creation", "Instant Architecture"] },
			2: { features_gained: ["Spatial Anchors"] },
			3: { features_gained: ["Living Lair"] },
			5: { features_gained: ["Dimensional Lock"] },
			7: { features_gained: ["Blueprint Vision"] },
			9: { features_gained: ["Reality Rewrite"] },
			10: { features_gained: ["Absolute Architect"] },
			11: {
				features_gained: [
					"Architect Ascendant",
					"Spatial Lord",
					"Dimensional God",
				],
			},
			13: {
				features_gained: [
					"Architect Apocalypse",
					"Space Dominion",
					"Reality God",
				],
			},
			15: {
				features_gained: [
					"Architect Reality",
					"Spatial God",
					"Dimensional Emperor",
				],
			},
			17: {
				features_gained: [
					"Architect Transcendence",
					"Space Emperor",
					"Reality Emperor",
				],
			},
			19: {
				features_gained: [
					"Architect Omnipotence",
					"Spatial Monarch",
					"Dimensional Monarch",
				],
			},
			20: {
				features_gained: [
					"Architect Supremacy",
					"Absolute Architect",
					"Monarch Power",
				],
			},
		},
		regent_requirements: {
			level: 13,
			abilities: { intelligence: 18 },
			quest_completion: "Complete the Trial of the Architect Gate",
			dm_approval: true,
		},
		requirements: {
			quest_completion: "Complete the Trial of the Architect Gate",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "World Creation",
				description: "Create permanent 1-mile demiplane.",
				type: "action",
				frequency: "once-per-day",
				power_level: 1,
			},
			{
				name: "Instant Architecture",
				description: "Create 300-ft structure instantly.",
				type: "action",
				frequency: "short-rest",
				power_level: 1,
			},
			{
				name: "Spatial Anchors",
				description: "12 teleport anchors, unlimited use.",
				type: "action",
				frequency: "at-will",
				power_level: 2,
			},
			{
				name: "Reality Rewrite",
				description: "Reshape 1-mile area permanently.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Absolute Architect",
				description: "At-will demiplanes, indestructible structures.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Instant Architecture",
				description: "Create any structure as action.",
				power_level: 1,
			},
			{
				name: "Spatial Anchors",
				description: "12 permanent teleport points.",
				power_level: 2,
			},
			{
				name: "Living Lair",
				description: "Control structures you created.",
				power_level: 3,
			},
			{
				name: "Dimensional Lock",
				description: "Block teleportation in 1-mile.",
				power_level: 5,
			},
			{
				name: "Blueprint Vision",
				description: "See structure internals and portals.",
				power_level: 7,
			},
			{
				name: "Reality Rewrite",
				description: "Reshape 1-mile permanently.",
				power_level: 9,
			},
			{
				name: "Absolute Architect",
				description: "At-will creation, indestructible.",
				power_level: 10,
			},
			{
				name: "Architect Ascendant",
				description: "Build across dimensions.",
				power_level: 11,
			},
			{
				name: "Architect Apocalypse",
				description: "Reshape continents.",
				power_level: 13,
			},
			{
				name: "Architect Reality",
				description: "Create/destroy planes.",
				power_level: 15,
			},
			{
				name: "Architect Transcendence",
				description: "Fundamental force of space.",
				power_level: 17,
			},
			{
				name: "Architect Omnipotence",
				description: "Control all space.",
				power_level: 19,
			},
			{
				name: "Architect Supremacy",
				description: "Ultimate spatial power.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description: "Full Monarch power.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 2,
				dexterity: 2,
				constitution: 2,
				intelligence: 4,
				wisdom: 4,
				charisma: 2,
			},
			special_abilities: [
				"Create permanent demiplanes",
				"Instant construction",
				"Teleport via spatial anchors",
				"Detect portals within 5 miles",
			],
			restrictions: ["Requires Warden verification", "INT 18+ required"],
			progression: {
				level_1: ["World Creation", "Instant Architecture"],
				level_3: ["Spatial Anchors", "Living Lair"],
				level_5: ["Dimensional Lock"],
				level_7: ["Blueprint Vision"],
				level_9: ["Reality Rewrite"],
				level_10: ["Absolute Architect"],
				level_11: ["Architect Ascendant", "Spatial Lord", "Dimensional God"],
				level_13: ["Architect Apocalypse", "Space Dominion", "Reality God"],
				level_15: ["Architect Reality", "Spatial God", "Dimensional Emperor"],
				level_17: [
					"Architect Transcendence",
					"Space Emperor",
					"Reality Emperor",
				],
				level_19: [
					"Architect Omnipotence",
					"Spatial Monarch",
					"Dimensional Monarch",
				],
				level_20: [
					"Architect Supremacy",
					"Absolute Architect",
					"Monarch Power",
				],
			},
		},
	},
	{
		id: "mimic-regent-overlay",
		name: "Mimic Regent",
		title: "Mimic Regent Hunter Class",
		theme: "Infinite Forms",
		description:
			"Embodiment of infinite forms. Copy anything — creatures, objects, concepts. No detection possible. The Hunter Bureau has contradictory records on you because you appear as a different person in every database. DNA tests return different results each time. Your awakening unlocked the ability to become ANYTHING you observe, perfectly and undetectably, making you the ultimate infiltrator, spy, and adaptive combatant.",
		rank: "S",
		image: "/generated/compendium/monarchs/mimic-regent.webp",
		type: "hunter-class-overlay",
		tags: ["regent", "mimic", "shapeshifting", "adaptation", "class-overlay"],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d10",
		primary_ability: ["Agility", "Presence"],
		saving_throws: ["Agility", "Presence"],
		skill_proficiencies: ["Deception", "Stealth", "Perception", "Performance"],
		armor_proficiencies: ["Light armor", "Medium armor"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: ["Disguise kit", "Forgery kit"],
		class_features: [
			{
				level: 1,
				name: "Perfect Imitation",
				description:
					"Transform into ANYTHING you've seen (Tiny to Gargantuan, CR ≤ level). Undetectable. DNA matches. Unlimited duration.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Power Theft",
				description:
					"Observe any ability: copy it permanently (no save). Store up to level/2 stolen powers. Prof uses/long rest.",
				type: "reaction",
				frequency: "long-rest",
			},
			{
				level: 2,
				name: "Reactive Evolution",
				description:
					"Damaged by element: gain immunity. Failed save: auto-succeed next. Attacked by weapon: gain resistance.",
				type: "reaction",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Quantum Existence",
				description:
					"Each observer sees different form (1 hour, 1/long rest). Appear as most trusted/feared/irrelevant.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 5,
				name: "Memory Access",
				description:
					"While mimicking a creature, access all their memories and skills.",
				type: "passive",
			},
			{
				level: 7,
				name: "Form Archive",
				description:
					"Store unlimited forms. Switch between archived forms as bonus action.",
				type: "passive",
			},
			{
				level: 9,
				name: "Perfect Copy",
				description:
					"Copy legendary actions, lair actions, and regional effects of observed creatures.",
				type: "passive",
			},
			{
				level: 10,
				name: "Absolute Mimic",
				description:
					"Copy anything including concepts (copy 'invulnerability', 'flight', 'time stop'). No CR limit.",
				type: "passive",
			},
		],
		progression_table: {
			1: { features_gained: ["Perfect Imitation", "Power Theft"] },
			2: { features_gained: ["Reactive Evolution"] },
			3: { features_gained: ["Quantum Existence"] },
			5: { features_gained: ["Memory Access"] },
			7: { features_gained: ["Form Archive"] },
			9: { features_gained: ["Perfect Copy"] },
			10: { features_gained: ["Absolute Mimic"] },
			11: { features_gained: ["Mimic Ascendant", "Form Lord", "Copy God"] },
			13: {
				features_gained: ["Mimic Apocalypse", "Form Dominion", "Copy Dominion"],
			},
			15: { features_gained: ["Mimic Reality", "Form God", "Copy Emperor"] },
			17: {
				features_gained: [
					"Mimic Transcendence",
					"Form Emperor",
					"Copy Transcendence",
				],
			},
			19: {
				features_gained: ["Mimic Omnipotence", "Form Monarch", "Copy Monarch"],
			},
			20: {
				features_gained: ["Mimic Supremacy", "Absolute Mimic", "Monarch Power"],
			},
		},
		regent_requirements: {
			level: 11,
			abilities: { dexterity: 17 },
			quest_completion: "Complete the Trial of the Mimic Gate",
			dm_approval: true,
		},
		requirements: {
			quest_completion: "Complete the Trial of the Mimic Gate",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Perfect Imitation",
				description: "Become anything. Undetectable. Unlimited duration.",
				type: "action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Power Theft",
				description: "Copy any observed ability permanently.",
				type: "reaction",
				frequency: "long-rest",
				power_level: 1,
			},
			{
				name: "Reactive Evolution",
				description: "Auto-adapt to any threat.",
				type: "reaction",
				frequency: "at-will",
				power_level: 2,
			},
			{
				name: "Perfect Copy",
				description: "Copy legendary/lair/regional effects.",
				type: "passive",
				frequency: "at-will",
				power_level: 9,
			},
			{
				name: "Absolute Mimic",
				description: "Copy concepts. No CR limit.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Perfect Imitation",
				description: "Transform into anything observed.",
				power_level: 1,
			},
			{
				name: "Power Theft",
				description: "Permanently copy abilities.",
				power_level: 1,
			},
			{
				name: "Reactive Evolution",
				description: "Auto-adapt to threats.",
				power_level: 2,
			},
			{
				name: "Quantum Existence",
				description: "Different form per observer.",
				power_level: 3,
			},
			{
				name: "Memory Access",
				description: "Access mimicked creature's memories.",
				power_level: 5,
			},
			{
				name: "Form Archive",
				description: "Unlimited stored forms.",
				power_level: 7,
			},
			{
				name: "Perfect Copy",
				description: "Copy legendary actions.",
				power_level: 9,
			},
			{
				name: "Absolute Mimic",
				description: "Copy concepts, no limits.",
				power_level: 10,
			},
			{
				name: "Mimic Ascendant",
				description: "Transcend form limitations.",
				power_level: 11,
			},
			{
				name: "Mimic Apocalypse",
				description: "Become everything simultaneously.",
				power_level: 13,
			},
			{
				name: "Mimic Reality",
				description: "Reshape reality by becoming it.",
				power_level: 15,
			},
			{
				name: "Mimic Transcendence",
				description: "Fundamental force of adaptation.",
				power_level: 17,
			},
			{
				name: "Mimic Omnipotence",
				description: "Copy reality itself.",
				power_level: 19,
			},
			{
				name: "Mimic Supremacy",
				description: "Ultimate mimic power.",
				power_level: 20,
			},
			{
				name: "Monarch Power",
				description: "Full Monarch power.",
				power_level: 20,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 2,
				dexterity: 4,
				constitution: 2,
				intelligence: 2,
				wisdom: 2,
				charisma: 4,
			},
			special_abilities: [
				"Undetectable shapeshifting",
				"Copy any ability permanently",
				"Auto-adapt to threats",
				"Access mimicked memories",
			],
			restrictions: ["Requires Warden verification", "AGI or PRE 17+ required"],
			progression: {
				level_1: ["Perfect Imitation", "Power Theft"],
				level_3: ["Reactive Evolution", "Quantum Existence"],
				level_5: ["Memory Access"],
				level_7: ["Form Archive"],
				level_9: ["Perfect Copy"],
				level_10: ["Absolute Mimic"],
				level_11: ["Mimic Ascendant", "Form Lord", "Copy God"],
				level_13: ["Mimic Apocalypse", "Form Dominion", "Copy Dominion"],
				level_15: ["Mimic Reality", "Form God", "Copy Emperor"],
				level_17: ["Mimic Transcendence", "Form Emperor", "Copy Transcendence"],
				level_19: ["Mimic Omnipotence", "Form Monarch", "Copy Monarch"],
				level_20: ["Mimic Supremacy", "Absolute Mimic", "Monarch Power"],
			},
		},
	},
];
