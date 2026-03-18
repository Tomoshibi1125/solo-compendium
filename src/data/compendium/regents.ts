import type { Regent } from "@/lib/regentTypes";

export const regents: Regent[] = [
	{
		id: "umbral_regent",
		name: "Umbral Regent",
		title: "Umbral Regent (Monarch of Shadows)",
		theme: "Umbral and Death",
		description:
			"The ultimate umbral manipulation Ascendant class overlay, embodying mastery over the veil, death, and the ability to command the Umbral Legion. This is the highest tier veil-based Ascendant class available to players, granting true Regent-level power over the umbral realm and the ability to command umbral shadows.",
		rank: "S",
		image: "/generated/compendium/Regents/umbral-sovereign.webp",
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"umbral",
			"death",
			"ascendant-class-overlay",
			"shadow-soldier-command",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d12",
		primary_ability: ["Charisma", "Wisdom"],
		saving_throws: ["Wisdom", "Charisma"],
		skill_proficiencies: ["Stealth", "Intimidation", "Arcana", "Religion"],
		armor_proficiencies: ["Light armor", "Medium armor", "Shields"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
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
				name: "Umbral Dominion (Passive)",
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
				name: "Umbral Dominion (Active)",
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
			{
				level: 11,
				name: "Shadow Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist in multiple planes simultaneously and command shadows across dimensions.",
				type: "passive",
			},
			{
				level: 11,
				name: "Dimensional Lord",
				description:
					"You gain complete control over dimensional travel, able to create permanent portals and reshape dimensional boundaries.",
				type: "passive",
			},
			{
				level: 11,
				name: "Death God",
				description:
					"You become a living embodiment of death, able to command all undead and determine the fate of souls.",
				type: "passive",
			},
			{
				level: 12,
				name: "Regent Attribute Enhancement",
				description:
					"Your primary and secondary attributes increase by +2, reflecting your growing Regent power.",
				type: "passive",
			},
			{
				level: 13,
				name: "Shadow Apocalypse",
				description:
					"Once per day, you can unleash a shadow apocalypse that covers a 10-mile radius in absolute darkness, where only you and your shadow creatures can see.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 13,
				name: "Void Dominion",
				description:
					"You gain control over the void itself, able to create pockets of nothingness that erase matter and energy.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being, gaining their memories, abilities, and power permanently.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 14,
				name: "Regent Power Resonance",
				description:
					"Your abilities resonate with the power of the Monarchs, increasing their effectiveness and reducing cooldowns.",
				type: "passive",
			},
			{
				level: 15,
				name: "Shadow Reality",
				description:
					"You can reshape reality itself through shadows, creating alternate dimensions and rewriting physical laws.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 15,
				name: "Dimensional God",
				description:
					"You become a master of all dimensions, able to create, destroy, and reshape entire planes of existence.",
				type: "passive",
			},
			{
				level: 15,
				name: "Death Emperor",
				description:
					"Your command over death extends across all realities, allowing you to resurrect or destroy any being at will.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 16,
				name: "Regent Attribute Enhancement",
				description:
					"Your primary and secondary attributes increase by another +2.",
				type: "passive",
			},
			{
				level: 17,
				name: "Shadow Transcendence",
				description:
					"You transcend the concept of shadows, becoming a fundamental force of the universe that cannot be contained or destroyed.",
				type: "passive",
			},
			{
				level: 17,
				name: "Void God",
				description:
					"You gain mastery over nothingness itself, able to erase concepts, memories, and even existence from reality.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 17,
				name: "Essence Emperor",
				description:
					"You can absorb and control the essence of entire worlds, gaining the collective power of civilizations.",
				type: "passive",
			},
			{
				level: 18,
				name: "Regent Power Resonance",
				description:
					"Your Regent powers reach their peak resonance, further enhancing all your class features.",
				type: "passive",
			},
			{
				level: 19,
				name: "Shadow Omnipotence",
				description:
					"You achieve true omnipotence within the shadow domain, able to control all shadows across all timelines and realities simultaneously.",
				type: "passive",
			},
			{
				level: 19,
				name: "Dimensional Emperor",
				description:
					"Your dimensional power extends across the multiverse, allowing you to create and destroy entire universes.",
				type: "passive",
			},
			{
				level: 19,
				name: "Death Regent",
				description:
					"You become the ultimate authority over death and life, able to determine the fate of all existence.",
				type: "passive",
			},
			{
				level: 20,
				name: "Shadow Supremacy",
				description:
					"You achieve absolute supremacy over all shadows, becoming the source and master of all shadow power in existence.",
				type: "passive",
			},
			{
				level: 20,
				name: "Absolute Shadow",
				description:
					"You become the embodiment of absolute shadow, a force beyond comprehension that exists outside all laws of reality.",
				type: "passive",
			},
			{
				level: 20,
				name: "Ultimate Umbral Power",
				description:
					"You achieve the full power of the Umbral Regent at peak performance - the ability to command infinite shadow armies and master death itself.",
				type: "passive",
			},
		],
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
		progression_table: {
			"1": {
				features_gained: [
					"Umbral Command",
					"Veilstep Supreme",
					"Umbral Dominion",
				],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Essence Harvest", "Regent's Presence"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Legion of the Veil", "Umbral Mastery"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Army of the Damned"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Dimensional Regent", "Dimensional Authority"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Essence Lord"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Umbral Dominion", "Umbral God"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Death's Command"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Death's Authority", "Umbral Emperor"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Umbral"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Shadow Ascendant", "Dimensional Lord", "Death God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: ["Shadow Apocalypse", "Void Dominion", "Essence God"],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Shadow Reality", "Dimensional God", "Death Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Shadow Transcendence",
					"Void God",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Shadow Omnipotence",
					"Dimensional Emperor",
					"Death Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Shadow Supremacy",
					"Absolute Shadow",
					"Ultimate Umbral Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		regent_requirements: {
			level: 5,
			abilities: {
				charisma: 13,
				wisdom: 13,
			},
			quest_completion: "Complete the Umbral Regent Ascension quest series",
			dm_approval: true,
		},
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
		},
	},
	{
		id: "radiant_regent",
		name: "Radiant Regent",
		title: "Radiant Regent (Monarch of White Flames)",
		theme: "White Flames and Purification",
		description:
			"The ultimate manifestation of purification fire, embodying the power of the Monarch of White Flames. You command sacred flames that incinerate corruption, cleanse the wicked, and illuminate the darkest depths of the multiverse.",
		rank: "S",
		image: "/generated/compendium/Regents/white-flame-Regent.webp",
		type: "ascendant-class-overlay",
		tags: ["regent", "radiant", "white-flames", "purification", "fire"],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d10",
		primary_ability: ["Presence", "Strength"],
		saving_throws: ["Presence", "Dexterity"],
		skill_proficiencies: ["Perception", "Insight", "Religion", "Athletics"],
		armor_proficiencies: ["Light armor", "Medium armor", "Shields"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		requirements: {
			quest_completion: "Complete the Flame Regent Trials quest series",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "White Flame Burst",
				description:
					"As an action, create a 30-foot radius of white flames. Creatures take 10d10 fire damage and must make a Constitution saving throw (DC 18) or be blinded for 1 minute. Purification fire that erases corruption.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Seraphim Wings",
				description:
					"As a bonus action, manifest 6 wings of white flame. Fly 120 ft. Light up 300 ft radius. Evil/fiend/undead within 60 ft must save or be blinded + 6d8 radiant damage per turn.",
				type: "bonus-action",
				frequency: "long-rest",
				power_level: 5,
			},
			{
				name: "Purification Flame",
				description:
					"As an action, target a creature or area to purge all diseases, curses, and fiendish influence. Undead take 10d10 radiant damage. This mirrors the Monarch of White Flames' holy domain.",
				type: "action",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Divine Judgment",
				description:
					"As a reaction, point at a creature dealing damage to you. PRE save (DC 20) or they take 8d10 radiant damage and are stunned. On kill, their soul is purified and released.",
				type: "reaction",
				frequency: "at-will",
				power_level: 2,
			},
			{
				name: "Immolation Aura",
				description:
					"Enemies within 30 feet take 2d12 radiant damage and are unable to benefit from regeneration or healing. This reflects your passive purifying presence.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Flame Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute holy protection. All allies within gain immunity to fire and radiant damage. This mirrors the Monarch's sanctification sovereignty.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Purification Authority",
				description:
					"As an action, force all fiends or undead within 300 feet to make a Wisdom save (DC 22) or be instantly banished or destroyed. This reflects your command over the spiritual realms.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Absolute Flame",
				description:
					"You become the ultimate master of purification fire. You are immune to all damage except necrotic, and you can erase the concept of sin or corruption itself as a bonus action.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "White Flame Mastery",
				description:
					"Immunity to fire and radiant damage. Your presence purifies any magical or mundane pollution within 60 ft.",
				power_level: 1,
			},
			{
				name: "Purification Flame",
				description: "Purge diseases and curses from any living creature.",
				power_level: 2,
			},
			{
				name: "Phoenix Rebirth",
				description: "On death, explode in white fire and reform with full HP.",
				power_level: 3,
			},
			{
				name: "Holy Light",
				description: "Permanent aura of light that dispels magical darkness.",
				power_level: 4,
			},
			{
				name: "Flame authority",
				description: "Command all elemental fire and light creatures.",
				power_level: 5,
			},
			{
				name: "Radiant Judgment",
				description:
					"Target a creature to judge their soul and deal radiant damage.",
				power_level: 6,
			},
			{
				name: "Flame God",
				description: "Incarnate as the fundamental force of holy fire.",
				power_level: 7,
			},
			{
				name: "Purification Lord",
				description: "Absolute control over all spiritual corruption.",
				power_level: 8,
			},
			{
				name: "White Flame Emperor",
				description: "Universal reach of your purifying fire.",
				power_level: 9,
			},
			{
				name: "Absolute Flame",
				description: "Total immunity and reality-warping purification.",
				power_level: 10,
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 4,
				dexterity: 2,
				constitution: 2,
				intelligence: 2,
				wisdom: 4,
				charisma: 6,
			},
			special_abilities: [
				"Immune to fire and radiant damage",
				"Can see through any smoke or magical darkness",
				"White fire automatically purifies any area you stand in",
				"Fiends and undead are automatically hostile toward you",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		progression_table: {
			"1": {
				features_gained: [
					"White Flame Mastery",
					"Immolation Aura",
					"Flame Dominion",
				],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: [
					"White Flame Burst",
					"Purification Flame",
					"Purifying Presence",
				],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: [
					"Seraphim Wings",
					"Flame Authority",
					"Phoenix Rebirth",
				],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Flame God", "Purification Lord"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Purification Authority", "Flame Emperor"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Flame"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Flame Ascendant", "Purification Lord", "Fire God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: [
					"Flame Apocalypse",
					"Purification Dominion",
					"Essence God",
				],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Flame Reality", "Purification God", "Fire Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Flame Transcendence",
					"Purification Emperor",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Flame Omnipotence",
					"Purification Regent",
					"Fire Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: ["Flame Supremacy", "Absolute Flame", "Regent Power"],
				abilities_improved: ["Primary Ability +2"],
			},
		},
	},
	{
		id: "steel_regent",
		name: "Steel Regent",
		title: "Steel Regent (Monarch of Iron Body)",
		theme: "Conceptual Invulnerability & Absolutist Defense",
		description:
			"Embodiment of absolute defense and iron-willed sovereignty, wielding the power of the Monarch of Iron Body. You are conceptually invulnerable, an immovable object that disregards the laws of physics. The Ascendant Bureau classifies you as an unkillable entity whose containment is fundamentally impossible.",
		rank: "S",
		image: "/generated/compendium/Regents/steel-flesh-Regent.webp",
		type: "ascendant-class-overlay",
		tags: ["regent", "iron_body", "tarnak", "invulnerable", "titan", "defense"],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d12",
		primary_ability: ["Vitality", "Strength"],
		saving_throws: ["Vitality", "Constitution"],
		skill_proficiencies: ["Athletics", "Intimidation", "Survival"],
		armor_proficiencies: ["All armor", "Shields"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		requirements: {
			quest_completion: "Complete the Steel Regent Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Conceptual Invulnerability",
				description:
					"As an action, enter a state of absolute defense for 1 minute. You are immune to ALL damage and your AC becomes 30. This mirrors the Monarch of Iron Body's physics-defying resilience.",
				type: "action",
				frequency: "long-rest",
				power_level: 3,
			},
			{
				name: "Immovable Anchor",
				description:
					"As a bonus action, root yourself in space. You cannot be moved, grappled, or teleported against your will. Gravity ceases to affect you. This reflects the Titan's immovable nature.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 2,
			},
			{
				name: "Steel Weaving",
				description:
					"As a bonus action, reinforce your structure to gain +3 AC and resistance to all physical damage. This reflects the Steel Regent's core defensive capabilities.",
				type: "bonus-action",
				frequency: "short-rest",
				power_level: 1,
			},
			{
				name: "Titan's Law",
				description:
					"As a reaction, reflect the damage of an attack back at the attacker (force damage). This mirrors the Titan Regent's law of retribution.",
				type: "reaction",
				frequency: "at-will",
				power_level: 2,
			},
			{
				name: "Infinite Stamina",
				description:
					"You no longer require sleep, food, or air. You are immune to exhaustion and all vital-sign based targeting. This represents the Steel Regent's perfect biology.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Iron Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute defensive control. All allies within gain your resistances. This mirrors the Steel Regent's territorial sovereignty.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Titan Authority",
				description:
					"As an action, command any construct within 300 feet (Wis save DC 20) to serve you permanently. This reflects your absolute command over the 'Monstrous Humanoids'.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Absolute Invulnerability",
				description:
					"You become the ultimate master of defense. You are permanently resistant to all damage, and can toggle full invulnerability as a bonus action. Physics itself bows to your iron will.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Iron Body",
				description:
					"Your skin becomes hard as dragon scales. Immunity to poison and disease. Cannot be aged or polymorphed.",
				power_level: 1,
			},
			{
				name: "Immovable Anchor",
				description: "Root yourself in space. Gravity cannot affect you.",
				power_level: 2,
			},
			{
				name: "Steel Weaving",
				description: "Reinforce structure for massive AC and resistance.",
				power_level: 3,
			},
			{
				name: "Titan's Law",
				description: "Reflect damage back at attackers (force damage).",
				power_level: 4,
			},
			{
				name: "Infinite Stamina",
				description: "No need for sleep, food, or air. Immune to exhaustion.",
				power_level: 5,
			},
			{
				name: "Regeneration Lord",
				description:
					"Regrow any lost limb in 1 minute. Mastery over biological repair.",
				power_level: 6,
			},
			{
				name: "Iron God",
				description: "Incarnate as the fundamental force of defense.",
				power_level: 7,
			},
			{
				name: "Titan Command",
				description: "Command all constructs and Monstrous Humanoids.",
				power_level: 8,
			},
			{
				name: "Iron Emperor",
				description: "Universal reach of your defensive sovereignty.",
				power_level: 9,
			},
			{
				name: "Absolute Invulnerability",
				description: "Total immunity and reality-warping defense.",
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
				name: "Steel Regent",
				description:
					"Your metallic power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Regeneration Regent",
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
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Regent, equal to all other Regents at their maximum potential.",
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
		},
		progression_table: {
			"1": {
				features_gained: ["Iron Body", "Immovable Anchor", "Infinite Stamina"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: [
					"Steel Weaving",
					"Titan's Law",
					"Conceptual Invulnerability",
				],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: [
					"Iron Dominion",
					"Titan Authority",
					"Regeneration Lord",
				],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: [
					"Organic Manipulation",
					"Flesh God",
					"Regeneration Lord",
				],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Flesh Dominion", "Steel Command", "Flesh Emperor"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Steel Authority", "Absolute Flesh"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Flesh Ascendant", "Steel Lord", "Regeneration God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: ["Flesh Apocalypse", "Steel Dominion", "Essence God"],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Flesh Reality", "Steel God", "Regeneration Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Flesh Transcendence",
					"Steel Emperor",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Flesh Omnipotence",
					"Steel Regent",
					"Regeneration Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: ["Flesh Supremacy", "Absolute Flesh", "Regent Power"],
				abilities_improved: ["Primary Ability +2"],
			},
		},
	},
	{
		id: "destruction_regent",
		name: "Destruction Regent",
		title: "Destruction Regent (Monarch of Destruction)",
		theme: "Primordial Destruction and Draconic Apocalypse",
		description:
			"Incarnation of primordial destruction, embodying the power of the Monarch of Destruction. You can transform into the dragon of apocalypse, whose breath incinerates reality and presence melts the very asphalt. As the ultimate force of annihilation, you are classified as a Kaiju-class extinction event.",
		rank: "S",
		image: "/generated/compendium/Regents/destruction-Regent.webp",
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"destruction",
			"annihilation",
			"dragon",
			"antares",
			"apocalypse",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d12",
		primary_ability: ["Strength", "Vitality"],
		saving_throws: ["Strength", "Dexterity"],
		skill_proficiencies: ["Athletics", "Intimidation", "Perception"],
		armor_proficiencies: ["Light armor", "Medium armor", "Shields"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		requirements: {
			quest_completion: "Complete the Path of Destruction quest series",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Breath of Annihilation",
				description:
					"120-ft cone: 12d10 fire damage (AGI save DC 18). On kill, target is erased from reality (no resurrection). Buildings collapse, steel melts, and stone sublimates. This mirrors the Monarch of Destruction's devastating breath.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "True Dragon Form",
				description:
					"Transform into an ancient red dragon for 1 hour. Gargantuan size, fly 120 ft, AC 22, and immunity fire/physical. News declares 'dragon sighting confirmed.' You become the living embodiment of the apocalypse.",
				type: "action",
				frequency: "long-rest",
				power_level: 5,
			},
			{
				name: "Destruction Step",
				description:
					"As a bonus action, teleport by destroying the space between locations, dealing 3d6 force damage to creatures passed through. This mirrors the Destruction Regent's destructive mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Vortex Shield",
				description:
					"As a reaction when targeted by an attack, create a destructive vortex that redirects the attack back at the attacker. This reflects the Destruction Regent's destructive defense.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Aura of Ruin",
				description:
					"Non-magical objects within 20 feet crumble to dust over time. Structures take 1d10 damage per round. This represents the Destruction Regent's passive destructive aura.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Destruction Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute destruction control. All destructive effects within are maximized. This mirrors the Destruction Regent's domain over destruction.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Annihilation Authority",
				description:
					"As an action, force all constructs within 300 feet to make a Wisdom save (DC 20) or be destroyed and become your servants. This reflects the Destruction Regent's command over destruction.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Calamity Wings",
				description:
					"Manifest draconic wings. Fly 90 ft. Wing buffet (30-ft cone, STR save or 6d6 + knocked prone). Hurricanes form from your wingbeats.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Breath of Annihilation",
				description:
					"Unleash a cone of apocalyptic fire that erases matter from existence.",
				power_level: 1,
			},
			{
				name: "Destruction Step",
				description: "Teleport by destroying the space between points.",
				power_level: 1,
			},
			{
				name: "Annihilation Presence",
				description:
					"Your mere presence causes structures to weaken and enemies to falter.",
				power_level: 2,
			},
			{
				name: "Destruction Mastery",
				description: "Perfect control over destructive force and energy.",
				power_level: 3,
			},
			{
				name: "Cataclysmic Rebirth",
				description: "Explode on death and reform with full power.",
				power_level: 4,
			},
			{
				name: "True Dragon Form",
				description: "Transform into a gargantuan dragon of destruction.",
				power_level: 5,
			},
			{
				name: "Ruin Lord",
				description: "Reshape the world through pure destructive will.",
				power_level: 6,
			},
			{
				name: "Destruction God",
				description: "Incarnate as the fundamental force of annihilation.",
				power_level: 7,
			},
			{
				name: "Annihilation Command",
				description: "Command all constructs and destructive forces.",
				power_level: 8,
			},
			{
				name: "Destruction Emperor",
				description: "Universal reach of your destructive powers.",
				power_level: 9,
			},
			{
				name: "Absolute Destruction",
				description: "Total immunity and reality-warping annihilation.",
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
				name: "Annihilation Regent",
				description:
					"Your destructive power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Ruin Regent",
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
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Regent, equal to all other Regents at their maximum potential.",
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
		},
		progression_table: {
			"1": {
				features_gained: [
					"Breath of Annihilation",
					"Destruction Step",
					"Destruction Dominion",
				],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: [
					"Annihilation Presence",
					"Destruction Mastery",
					"Aura of Ruin",
				],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: [
					"Decimation Field",
					"True Dragon Form",
					"Cataclysmic Rebirth",
				],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Vortex Shield", "Destruction God", "Ruin Lord"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: [
					"Destruction Dominion",
					"Annihilation Command",
					"Destruction Emperor",
				],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Annihilation Authority", "Absolute Destruction"],
				abilities_improved: [],
			},
			"11": {
				features_gained: [
					"Destruction Ascendant",
					"Ruin Lord",
					"Annihilation God",
				],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: [
					"Destruction Apocalypse",
					"Annihilation Dominion",
					"Essence God",
				],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: [
					"Destruction Reality",
					"Ruin God",
					"Annihilation Emperor",
				],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Destruction Transcendence",
					"Ruin Emperor",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Destruction Omnipotence",
					"Annihilation Regent",
					"Ruin Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Destruction Supremacy",
					"Absolute Destruction",
					"Regent Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
	},

	{
		id: "war_regent",
		name: "War Regent",
		title: "War Regent (Monarch of Command)",
		theme: "Tactical Battlefield Supremacy & Absolute Command",
		description:
			"Embodiment of tactical genius and absolute battlefield authority, wielding the power of the Monarch of Command. You command the vanguard legions with unmatched supremacy, turning every conflict into a masterpiece of war. Your presence governs the flow of battle across dimensions, as you lead the charge of the eternal vanguard.",
		rank: "S",
		image: "/generated/compendium/Regents/shadow-command-Regent.webp",
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"war",
			"command",
			"leadership",
			"tactics",
			"vanguard",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d10",
		primary_ability: ["Presence", "Intelligence"],
		saving_throws: ["Presence", "Intelligence"],
		skill_proficiencies: ["History", "Insight", "Persuasion", "Intimidation"],
		armor_proficiencies: ["All armor", "Shields"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		requirements: {
			quest_completion: "Complete the Command Regent Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Warlord's Command",
				description:
					"As a bonus action, grant an ally within 60 feet an immediate action. This reflects the War Regent's ability to dictate the tempo of battle.",
				type: "bonus-action",
				power_level: 1,
			},
			{
				name: "Tactical Step",
				description:
					"Teleport up to 120 feet, bringing up to 10 allies with you. This mirrors the War Regent's absolute control over position and deployment.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 2,
			},
			{
				name: "Conquest",
				description:
					"Unleash a 100-ft wave of tactical suppression that stuns all enemies (Presence save DC 20). This represents your absolute authority on the field.",
				type: "action",
				frequency: "long-rest",
				power_level: 3,
			},
			{
				name: "Command Shield",
				description:
					"Redirect an attack from an ally to yourself and gain resistance. This reflects your role as the unbreakable center of the vanguard.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Leadership Aura",
				description:
					"Allies within 60 feet gain advantage on all rolls. Enemies have disadvantage against them. This represents your passive tactical dominance.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "War Dominion",
				description:
					"Create a 1-mile radius area of absolute war control. Allies cannot be frightened and gain extra attacks. This mirrors your domain over the battlefield.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Vanguard Authority",
				description:
					"Force all enemy leaders within 300 feet to surrender (Wis save DC 20). Surrendered forces join your legion for 24 hours.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Absolute Command",
				description:
					"You become the ultimate master of war. You are immune to all damage while leading an army, and can command any soul in existence to take a tactical action.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "War Dominion",
				description:
					"Immunity to fear and charm. Your tactical mind cannot be breached or influenced.",
				power_level: 1,
			},
			{
				name: "Vanguard Step",
				description: "Tactical teleportation for you and your soldiers.",
				power_level: 2,
			},
			{
				name: "Command Mastery",
				description: "Perfect control over military magic and strategy.",
				power_level: 3,
			},
			{
				name: "Army Rebirth",
				description: "Rally fallen troops and cheat death through sheer will.",
				power_level: 4,
			},
			{
				name: "Command Authority",
				description: "Telepathic command over any being within 1 mile.",
				power_level: 5,
			},
			{
				name: "Tactical Lord",
				description: "Subjugate enemy armies through strategic brilliance.",
				power_level: 6,
			},
			{
				name: "War God",
				description: "Incarnate as the fundamental force of conflict.",
				power_level: 7,
			},
			{
				name: "Tactical Command",
				description: "Absolute control over enemy leadership and intent.",
				power_level: 8,
			},
			{
				name: "War Emperor",
				description: "Command entire planets and dimensions as one unit.",
				power_level: 9,
			},
			{
				name: "Absolute War",
				description: "Total immunity while commanding; reshape reality by war.",
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
				name: "Tactical Regent",
				description:
					"Your command power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Leadership Regent",
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
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Regent, equal to all other Regents at their maximum potential.",
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
		},
		progression_table: {
			"1": {
				features_gained: [
					"Warlord's Command",
					"Leadership Aura",
					"War Dominion",
				],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Vanguard Step", "Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Conquest", "Command Mastery", "Leadership Presence"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Tactical Step", "Command Authority", "Army Rebirth"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Command Shield", "War God", "Tactical Lord"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["War Dominion", "Tactical Command", "War Emperor"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Vanguard Authority", "Absolute War"],
				abilities_improved: [],
			},
			"11": {
				features_gained: [
					"Command Ascendant",
					"Tactical Lord",
					"Leadership God",
				],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: [
					"Command Apocalypse",
					"Tactical Dominion",
					"Essence God",
				],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: [
					"Command Reality",
					"Tactical God",
					"Leadership Emperor",
				],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Command Transcendence",
					"Tactical Emperor",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Command Omnipotence",
					"Tactical Regent",
					"Leadership Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Command Supremacy",
					"Absolute Command",
					"Regent Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
	},
	{
		id: "frost_regent",
		name: "Frost Regent",
		title: "Frost Regent (Monarch of Frost)",
		theme: "Eternal Winter & absolute Zero",
		description:
			"Herald of eternal winter and absolute zero, wielding the power of the Monarch of Frost. You command the biting winds, glacial shards, and the crystalline silence of the void. Your presence freezes the very soul of the world, turning landscapes into frozen wastes of pure order. The Ascendant Bureau classifies you as a Climate Catastrophe event, capable of bringing a global ice age.",
		rank: "S",
		image: "/generated/compendium/Regents/frost-Regent.webp",
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"frost",
			"cold",
			"winter",
			"monarch_of_frost",
			"ice",
			"legia",
		],
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
				name: "Ice Age Protocol",
				description:
					"Create a 5-mile radius supernatural ice storm for 8 hours (1/long rest). The temperature drops to -100°C instantly, freezing all water and making fire damage impossible. This mirrors the Monarch of Frost's climate-shattering power.",
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
				name: "Absolute Zero Touch",
				description:
					"As a touch attack, channel the boundary of absolute zero. Target takes 10d10 cold damage and must make a VIT save or be paralyzed. On kill, they become a permanent ice statue at -273.15°C.",
				type: "action",
				frequency: "short-rest",
			},
			{
				level: 3,
				name: "Glacial Eternity",
				description:
					"60-ft radius: enemies half speed, disadvantage AGI, no reactions. 1 min, prof/long rest. Time slows as heat is drained from the area.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 5,
				name: "Winter's Immortality",
				description:
					"Immune to cold, fire, aging. Regenerate 20 HP/round in freezing temperatures. Auto-stabilize at 0 HP.",
				type: "passive",
			},
			{
				level: 7,
				name: "Cryogenic Prison",
				description:
					"Encase a target in absolute-zero ice. VIT save DC 20 or imprisoned indefinitely until thawed by Wish.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 9,
				name: "Temporal Frost",
				description:
					"Freeze time in a 120-ft radius for 1 round. Only you can act. This reflects your absolute thermodynamic authority.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Frost",
				description:
					"All cold damage you deal is maximized. Ice structures you create are permanent and indestructible.",
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
			"1": {
				features_gained: ["Ice Age Protocol", "Frost Dominion"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Absolute Zero Touch", "Glacial Eternity"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Winter's Immortality"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Cryogenic Prison"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Temporal Frost"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Frost"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Frost Ascendant", "Temporal Lord", "Ice God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: ["Frost Apocalypse", "Time Dominion", "Cryo God"],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Frost Reality", "Temporal God", "Ice Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Frost Transcendence",
					"Time Emperor",
					"Cryo Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: ["Frost Omnipotence", "Temporal Regent", "Ice Regent"],
				abilities_improved: [],
			},
			"20": {
				features_gained: ["Frost Supremacy", "Absolute Frost", "Regent Power"],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		mechanics: {
			stat_bonuses: {
				strength: 2,
				dexterity: 2,
				constitution: 6,
				intelligence: 8,
				wisdom: 4,
				charisma: 2,
			},
			special_abilities: [
				"Immune to cold damage",
				"Resistance to fire damage",
				"Cannot slip on ice",
				"Slow time within 60-ft radius",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		requirements: {
			quest_completion: "Complete the Trial of the Frost Gate",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
	},
	{
		id: "beast_regent",
		name: "Beast Regent",
		title: "Beast Regent (Monarch of Beasts)",
		theme: "Primal Evolution & Apex Sovereignty",
		description:
			"Avatar of primordial evolution and sovereign of the wild, wielding the power of the Monarch of Beasts. All creatures recognize you as the ultimate alpha, and your roar can shatter the instincts of any living being. You embody the perfect predatory form, adaptive and unstoppable. The Ascendant Bureau classifies you as an Alpha-class biodiversity threat.",
		rank: "S",
		image: "/generated/compendium/Regents/beast-regent.webp",
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"beast",
			"primal",
			"evolution",
			"monarch_of_beasts",
			"nature",
		],
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
					"Transform into a gargantuan primordial beast for 10 minutes (prof/long rest). You gain +6 to STR/AGI/VIT (max 26), 3d10+STR natural weapons, and regenerate 15 HP/turn. Your tremorsense extends to 120 ft as you become the ultimate evolutionary apex predator.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 1,
				name: "Alpha's Presence",
				description:
					"You emit a constant 120-foot aura of primal dominance. All beasts within this range recognize you as the alpha and are automatically friendly. Hostile creatures must make a SENSE save or be frightened.",
				type: "passive",
			},
			{
				level: 2,
				name: "Beast King's Call",
				description:
					"Exert mental command over all beasts within a 10-mile radius (CR ≤ level). They obey your orders absolutely for 1 hour. useable 1/week. Zoo animals break containment, police K-9 units refuse to engage you.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 3,
				name: "Primordial Regeneration",
				description:
					"Your cellular structure adapts with impossible speed. Regrow lost limbs in 1 minute and regain 25 HP at the start of your turn if below half health. Immune to aging and disease.",
				type: "passive",
			},
			{
				level: 5,
				name: "Evolutionary Leap",
				description:
					"Adapt to any environment. Grow gills, wings, or thermal insulation as needed as a bonus action.",
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
					"1-mile radius: all hostile creatures take 6d10 force + frightened (SENSE save DC 20). 1/long rest.",
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
			"1": {
				features_gained: ["Apex Form", "Alpha's Presence"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Beast King's Call"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Primordial Regeneration"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Evolutionary Leap"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Pack Tactics"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Extinction Event"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Beast"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Beast Ascendant", "Primal Lord", "Evolution God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: ["Beast Apocalypse", "Primal Dominion", "Essence God"],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Beast Reality", "Primal God", "Evolution Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Beast Transcendence",
					"Primal Emperor",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Beast Omnipotence",
					"Primal Regent",
					"Evolution Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: ["Beast Supremacy", "Absolute Beast", "Regent Power"],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		mechanics: {
			stat_bonuses: {
				strength: 4,
				dexterity: 2,
				constitution: 6,
				intelligence: 2,
				wisdom: 4,
				charisma: 2,
			},
			special_abilities: [
				"Beasts automatically friendly",
				"Regeneration 25 HP/turn",
				"Tremorsense 120 ft",
				"Immune to disease and aging",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		requirements: {
			quest_completion: "Complete the Trial of the Beast Gate",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
	},
	{
		id: "plague_regent",
		name: "Plague Regent",
		title: "Plague Regent Ascendant Class",
		theme: "Pandemic Incarnate",
		description:
			"Incarnation of plague and pestilence. Walking biological apocalypse. The CDC tracks 47 unknown pathogens in your wake. The Ascendant Bureau classifies you as a Pandemic-class bioweapon. Insects obey your will, diseases are your art form, and quarantine zones form wherever you walk. Hospitals refuse your admittance, biohazard teams follow your movements, and the WHO has a dedicated task force assigned to you.",
		rank: "S",
		image: "/generated/compendium/Regents/plague-regent.webp",
		type: "ascendant-class-overlay",
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
					"You emit a 60-foot aura of supernatural pestilence. Any creature entering the aura must make a VIT save (DC 8+prof+INT) or contract a disease that causes 4d12 necrotic damage per day and spreads to others. You see the infected via the System HUD as [INFECTED: TARGET]. Only you or a Wish can cure it.",
				type: "passive",
			},
			{
				level: 1,
				name: "Insect God",
				description:
					"Command all insects within a 5-mile radius with a mental link. You can direct insect swarms to attack specific targets or create an Insect Plague effect at will. Food supplies collapse and biblical-level locust swarms follow in your wake.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 2,
				name: "Pandemic Protocol",
				description:
					"You can design and release a supernatural pandemic once per month. You determine its transmission method (airborne, touch, or water), symptoms, and lethality. The disease spreads with an R0 of 10 and cannot be cured by conventional medicine or magic. The System displays [PANDEMIC STATUS: ACTIVE] and tracks the infection rate globally.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 3,
				name: "Billion Swarm",
				description:
					"Your physical form disintegrates into a massive swarm of billions of insects for up to 1 hour (1/long rest). In this form, you gain a fly speed of 60 feet, can squeeze through gaps as small as 1 inch, and are immune to all non-area-of-effect damage. You can split into multiple sub-swarms to overwhelm city blocks simultaneously.",
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
			"1": {
				features_gained: ["Typhoid Incarnate", "Insect God"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Pandemic Protocol"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Billion Swarm"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Pathogen Mastery"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Plague Vector"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Biological Apocalypse"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Plague"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Plague Ascendant", "Swarm Lord", "Disease God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: [
					"Plague Apocalypse",
					"Swarm Dominion",
					"Pathogen God",
				],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Plague Reality", "Swarm God", "Disease Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Plague Transcendence",
					"Swarm Emperor",
					"Pathogen Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Plague Omnipotence",
					"Swarm Regent",
					"Disease Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Plague Supremacy",
					"Absolute Plague",
					"Regent Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		regent_requirements: {
			level: 10,
			abilities: {
				intelligence: 16,
			},
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
				name: "Regent Power",
				description: "Full Regent power.",
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
		},
	},
	{
		id: "spatial_regent",
		name: "Spatial Regent",
		title: "Spatial Regent (Monarch of Space)",
		theme: "Cosmic Weaving & Dimensional Void",
		description:
			"Sovereign of the void and master of the dimensional weave. You reshape space, time, and distance with absolute authority. Your Cosmic Senses allow you to perceive the very fabric of the multiverse. The Ascendant Bureau classifies you as a Dimensional Sovereignty Threat. You collapse distances, create pocket dimensions, and place anchors that bypass the laws of physics.",
		rank: "S",
		image: "/generated/compendium/Regents/spatial-regent.webp",
		type: "ascendant-class-overlay",
		tags: ["regent", "spatial", "dimensional", "void", "class-overlay"],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d8",
		primary_ability: ["Intelligence"],
		saving_throws: ["Intelligence", "Sense"],
		skill_proficiencies: ["Arcana", "Investigation", "History", "Perception"],
		armor_proficiencies: ["Light armor"],
		weapon_proficiencies: ["Simple weapons"],
		tool_proficiencies: ["Cartographer's tools", "Navigator's tools"],
		class_features: [
			{
				level: 1,
				name: "Void Singularity",
				description:
					"You create a localized gravity well of pure void essence at a point within 120 feet. All creatures within a 20-foot radius are pulled toward the center and take 6d10 force damage. You perceive the blueprints of reality and can tear them apart to crush your enemies.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Planar Blink",
				description:
					"You achieve the ability to step through the dimensional lattice of the universe. As a bonus action, you can teleport up to 30 feet to any unoccupied space you can see. This 'blink' is instantaneous and creates a minor spatial ripple that only specialized sensors can detect.",
				type: "bonus-action",
				frequency: "at-will",
			},
			{
				level: 2,
				name: "Spatial Anchors",
				description:
					"You can place up to 12 invisible dimensional anchors anywhere in the multiverse. As an action, you can teleport between these anchors regardless of distance. These anchors are permanent and undetectable by normal means, appearing on your System HUD as [QUANTUM TUNNEL POINTS].",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Dimensional Sanctum",
				description:
					"In your pocket dimensions or anchored zones: reshape the physical layout as a bonus action, control gravity per room, and decide who can enter.",
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
				name: "Lattice Vision",
				description:
					"See spatial weaknesses, hidden dimensions, and dimensional instabilities. Detect all portals/gates within 5 miles.",
				type: "passive",
			},
			{
				level: 9,
				name: "Reality Rewrite",
				description:
					"Reshape 1-mile area: change terrain, gravity direction, physics rules. Permanent. 1/week.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Spatial",
				description:
					"Create demiplanes at will. All spatial folds are indestructible. Reality Rewrite becomes daily.",
				type: "passive",
			},
		],
		progression_table: {
			"1": {
				features_gained: ["Void Singularity", "Planar Blink"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Spatial Anchors"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Dimensional Sanctum"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Dimensional Lock"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Lattice Vision"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Reality Rewrite"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Spatial"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Spatial Ascendant", "Void Lord", "Dimensional God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: [
					"Spatial Apocalypse",
					"Space Dominion",
					"Reality God",
				],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Spatial Reality", "Void God", "Dimensional Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Spatial Transcendence",
					"Space Emperor",
					"Reality Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Spatial Omnipotence",
					"Void Regent",
					"Dimensional Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Spatial Supremacy",
					"Absolute Spatial",
					"Regent Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		mechanics: {
			stat_bonuses: {
				strength: 2,
				dexterity: 2,
				constitution: 2,
				intelligence: 8,
				wisdom: 4,
				charisma: 2,
			},
			special_abilities: [
				"Create permanent demiplanes",
				"Instant spatial folding",
				"Teleport via spatial anchors",
				"Detect portals within 5 miles",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		requirements: {
			quest_completion: "Complete the Trial of the Spatial Gate",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
	},
	{
		id: "mimic_regent",
		name: "Mimic Regent",
		title: "Mimic Regent Ascendant Class",
		theme: "Infinite Forms",
		description:
			"Embodiment of infinite forms. Copy anything — creatures, objects, concepts. No detection possible. The Ascendant Bureau has contradictory records on you because you appear as a different person in every database. DNA tests return different results each time. Your awakening unlocked the ability to become ANYTHING you observe, perfectly and undetectably, making you the ultimate infiltrator, spy, and adaptive combatant.",
		rank: "S",
		image: "/generated/compendium/Regents/mimic-regent.webp",
		type: "ascendant-class-overlay",
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
					"Transform into ANYTHING you've seen, from Tiny to Gargantuan (CR ≤ level). The imitation is perfect and undetectable by True Seeing or Divine Sense. Your DNA matches the target, and the transformation lasts indefinitely. You become the ultimate master of infinite forms.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Power Theft",
				description:
					"By observing a feature, spell, or ability being used, you can archive and copy it perfectly (no save required). You can store up to level/2 stolen powers in your System's [ABILITY ARCHIVE]. You can use any stolen power a number of times equal to your proficiency bonus per long rest.",
				type: "reaction",
				frequency: "long-rest",
			},
			{
				level: 2,
				name: "Reactive Evolution",
				description:
					"Your cellular structure adapts instantly to incoming threats. If you are damaged by an element, you gain immunity to it. If you fail a saving throw, you automatically succeed on the next save of that type. If attacked by a weapon, you gain resistance to its damage. Biologists describe this as 'physics-defying evolution speed'.",
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
			"1": {
				features_gained: ["Perfect Imitation", "Power Theft"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Reactive Evolution"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Quantum Existence"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Memory Access"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Form Archive"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Perfect Copy"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Mimic"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Mimic Ascendant", "Form Lord", "Copy God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: ["Mimic Apocalypse", "Form Dominion", "Copy Dominion"],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Mimic Reality", "Form God", "Copy Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Mimic Transcendence",
					"Form Emperor",
					"Copy Transcendence",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: ["Mimic Omnipotence", "Form Regent", "Copy Regent"],
				abilities_improved: [],
			},
			"20": {
				features_gained: ["Mimic Supremacy", "Absolute Mimic", "Regent Power"],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		regent_requirements: {
			level: 11,
			abilities: {
				dexterity: 17,
			},
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
				name: "Regent Power",
				description: "Full Regent power.",
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
		},
	},
	{
		id: "blood_regent",
		name: "Blood Regent",
		title: "Blood Regent (Monarch of Blood)",
		theme: "Hemomancy & Sanguine Sovereignty",
		description:
			"Sovereign of life essence and master of hemomancy, wielding the power of the Monarch of Blood. You control the very fluid of life, turning it into a weapon or a restorative force at your whim. Your presence causes the hearts of enemies to falter and the wounds of allies to seal instantly. The Ascendant Bureau classifies you as a Sanguine Catastrophe, capable of draining the life from an entire city.",
		rank: "S",
		image: "/generated/compendium/Regents/blood-regent.webp",
		type: "ascendant-class-overlay",
		tags: ["regent", "blood", "hemomancy", "life", "monarch_of_blood"],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d10",
		primary_ability: ["Vitality", "Charisma"],
		saving_throws: ["Vitality", "Charisma"],
		skill_proficiencies: ["Medicine", "Persuasion", "Intimidation", "Arcana"],
		armor_proficiencies: ["Light armor", "Medium armor"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		class_features: [
			{
				level: 1,
				name: "Sanguine Command",
				description:
					"Control the blood of any creature you've damaged. They must make a VIT save or be forced to move or attack a target of your choice.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Blood Shield",
				description:
					"As a reaction to taking damage, create a shield of blood that reduces the damage by 2d10 + class level. You regain HP equal to half the damage reduced.",
				type: "reaction",
				frequency: "short-rest",
			},
			{
				level: 2,
				name: "Crimson Lance",
				description:
					"Form a spear of pressurized blood. Range 120 ft, 6d8 piercing + 4d8 necrotic. On hit, you regain 10 HP.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Life Drain Aura",
				description:
					"30-ft aura: enemies take 2d6 necrotic damage at start of turn, you gain total damage dealt as temporary HP.",
				type: "passive",
			},
			{
				level: 5,
				name: "Sanguine Rebirth",
				description:
					"When you drop to 0 HP, explode in a burst of blood (10d10 necrotic to all within 30 ft) and reappear at full HP. 1/long rest.",
				type: "passive",
			},
			{
				level: 7,
				name: "Hemocentric Control",
				description:
					"Stop the blood flow in a target. VIT save or paralyzed and 5d10 necrotic per turn until they succeed.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 9,
				name: "Blood Apocalypse",
				description:
					"1-mile radius: drain the blood of all living things. All take 20d10 necrotic, you gain 1000 temporary HP. 1/week.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Blood",
				description:
					"Immune to necrotic and poison. Any creature with blood is automatically detected by you within 1 mile.",
				type: "passive",
			},
		],
		progression_table: {
			"1": {
				features_gained: ["Sanguine Command", "Blood Shield"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Crimson Lance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Life Drain Aura"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Sanguine Rebirth"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Hemocentric Control"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Blood Apocalypse"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Blood"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Blood Ascendant", "Sanguine Lord", "Life God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: ["Blood Apocalypse", "Life Dominion", "Essence God"],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Blood Reality", "Sanguine God", "Life Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Blood Transcendence",
					"Life Emperor",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Blood Omnipotence",
					"Sanguine Regent",
					"Life Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: ["Blood Supremacy", "Absolute Blood", "Regent Power"],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		mechanics: {
			stat_bonuses: {
				strength: 2,
				dexterity: 2,
				constitution: 8,
				intelligence: 2,
				wisdom: 2,
				charisma: 6,
			},
			special_abilities: [
				"Sense all living beings within 1 mile",
				"Regen HP when dealing damage",
				"Immune to bloodborne diseases",
				"Control blood of enemies",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		requirements: {
			quest_completion: "Complete the Sanguine Ritual of the Monarch",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
	},
	{
		id: "gravity_regent",
		name: "Gravity Regent",
		title: "Gravity Regent (Monarch of Weight)",
		theme: "Gravitational Mastery & Fundamental Force",
		description:
			"God of attraction and repulsion, wielding the absolute authority of the Monarch of Weight. You command the fundamental force that binds galaxies and collapses stars. Your presence causes the Earth to groan under your footfall, and the air itself thickens as your will fluctuates. The Ascendant Bureau classifies you as a Singularity Event.",
		rank: "S",
		image: "/generated/compendium/Regents/gravity-regent.webp",
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"gravity",
			"weight",
			"force",
			"monarch_of_weight",
			"physics",
		],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "System Ascendant Canon",
		hit_dice: "1d12",
		primary_ability: ["Strength", "Intelligence"],
		saving_throws: ["Strength", "Intelligence"],
		skill_proficiencies: ["Athletics", "Arcana", "Science", "Perception"],
		armor_proficiencies: ["Light armor", "Medium armor", "Heavy armor"],
		weapon_proficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		class_features: [
			{
				level: 1,
				name: "Gravity Well",
				description:
					"Create a 30-ft radius zone where gravity is 10x normal. Enemies must make a STR save or be restrained. Ranged attacks automatically fail through the zone.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Weightless Step",
				description:
					"You can fly at your walking speed by negating your own gravity. You also have advantage on AGI checks.",
				type: "passive",
			},
			{
				level: 2,
				name: "Crushing Blows",
				description:
					"Increase the weight of your weapon at the moment of impact. Add 4d10 force damage to all melee attacks.",
				type: "passive",
			},
			{
				level: 3,
				name: "Planetary Field",
				description:
					"60-ft aura: you decide the direction of gravity for each creature within. You can cause enemies to fall upward or toward each other.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 5,
				name: "Event Horizon",
				description:
					"As a reaction, collapse space around you. Any attack made against you is sucked into a micro-singularity and negated.",
				type: "reaction",
				frequency: "short-rest",
			},
			{
				level: 7,
				name: "Orbital Striker",
				description:
					"Launch yourself into orbit and come down like a meteor. 1-mile impact: 20d10 force/fire damage. 1/long rest.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 9,
				name: "Singularity Genesis",
				description:
					"Create a black hole that pulls all matter within 500 ft into its center. Targets take 40d10 force damage and are erased from existence on kill.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Weight",
				description:
					"You are immune to forced movement. You can anchor yourself to the fabric of reality, becoming immovable and indestructible.",
				type: "passive",
			},
		],
		progression_table: {
			"1": {
				features_gained: ["Gravity Well", "Weightless Step"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Crushing Blows"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Planetary Field"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Event Horizon"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Orbital Striker"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Singularity Genesis"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Weight"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Gravity Ascendant", "Weight Lord", "Force God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: [
					"Gravity Apocalypse",
					"Force Dominion",
					"Essence God",
				],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Gravity Reality", "Weight God", "Force Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Gravity Transcendence",
					"Force Emperor",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Gravity Omnipotence",
					"Weight Regent",
					"Force Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Gravity Supremacy",
					"Absolute Weight",
					"Regent Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		mechanics: {
			stat_bonuses: {
				strength: 8,
				dexterity: 2,
				constitution: 6,
				intelligence: 6,
				wisdom: 2,
				charisma: 2,
			},
			special_abilities: [
				"Immune to forced movement",
				"Fly at walk speed",
				"Crush armor with focus",
				"Control gravitational vectors",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		requirements: {
			quest_completion: "Complete the Trial of the Star-Crusher",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
	},
];
