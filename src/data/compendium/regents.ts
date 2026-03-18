import type { Regent } from "@/lib/regentTypes";

export const regents: Regent[] = [
	{
		id: "umbral-regent",
		name: "Umbral Regent",
		title: "Umbral Regent Ascendant Class",
		theme: "Umbral and Death",
		description:
			"The ultimate umbral manipulation Ascendant class overlay, embodying mastery over the veil, death, and the ability to command the Umbral Legion. This is the highest tier veil-based Ascendant class available to players, granting true Regent-level power over the umbral realm and the ability to command shadows.",
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
				name: "Death Regent",
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
					"You achieve the full power of Kael Voss at his peak - the ability to command infinite shadow armies, reshape reality, control all dimensions, master death itself, and transcend to become a fundamental force of the multiverse. This is the ultimate power of the Umbral Regent, surpassing all other beings in existence.",
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
		},
	},
	{
		id: "flame-regent",
		name: "Flame Regent",
		title: "Flame Regent Class",
		theme: "White Flames",
		description:
			"A powerful fire-based class overlay that grants mastery over white flames and purification fire. Users can incinerate enemies and purify corruption with sacred flames, embodying the Regent of White Flames' absolute control over fire.",
		rank: "S",
		image: "/generated/compendium/Regents/white-flame-Regent.webp",
		type: "class-overlay",
		tags: ["Regent", "flame", "fire", "white-flames", "class-overlay"],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
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
					"As an action, create a 30-foot radius of white flames. Creatures take 10d10 fire damage and must make a Constitution saving throw (DC 18) or be blinded for 1 minute. This mirrors the Regent of White Flames' devastating fire attacks.",
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
					"As a bonus action, teleport through flames up to 120 feet to any unoccupied space you can see. This mirrors the Regent of White Flames' fire-based mobility.",
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
					"Enemies within 10 feet take 1d6 fire damage at the start of their turn. You are immune to fire damage. This represents the Regent of White Flames' passive fire control.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Flame Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute flame control. All fire creatures within gain advantage on all attacks. This mirrors the Regent's domain over fire.",
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
					"You become the ultimate master of flames, gaining immunity to all damage and the ability to command any fire creature anywhere in the multiverse. This represents the Regent of White Flames' ultimate power.",
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
				name: "Purification Regent",
				description:
					"Your purification power extends across the multiverse, allowing you to cleanse entire universes.",
				power_level: 19,
			},
			{
				name: "Fire Regent",
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
		},
		progression_table: {
			"1": {
				features_gained: ["Flame Step", "Immolation Aura", "Flame Dominion"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: [
					"White Flame Burst",
					"White Flame Mastery",
					"Purifying Presence",
				],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Flame Shield", "Flame Authority", "Phoenix Rebirth"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Flame Dominion", "Flame God", "Purification Lord"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: [
					"Purification Authority",
					"Purification Command",
					"Flame Emperor",
				],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Flame Dominion", "Absolute Flame"],
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
		id: "steel-regent",
		name: "Steel Regent",
		title: "Steel Regent Class",
		theme: "Steel and Flesh",
		description:
			"A defensive class overlay that grants control over flesh manipulation and steel enhancement. Users can reinforce their bodies and manipulate organic matter, embodying the Steel Regent's absolute mastery over biological and metallic matter.",
		rank: "S",
		image: "/generated/compendium/Regents/steel-flesh-Regent.webp",
		type: "class-overlay",
		tags: [
			"Regent",
			"steel",
			"flesh",
			"defense",
			"steel-Regent",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Steel Regent Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Flesh Reconstruction",
				description:
					"As an action, reshape your body to gain resistance to all damage for 1 minute and regenerate 10 hit points per round. This mirrors the Steel Regent's ultimate flesh manipulation.",
				type: "action",
				frequency: "long-rest",
				power_level: 3,
			},
			{
				name: "Steel Weaving",
				description:
					"As a bonus action, create steel armor that provides +3 AC and resistance to piercing and slashing damage. This reflects the Steel Regent's steel manipulation abilities.",
				type: "bonus-action",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Organic Manipulation",
				description:
					"As an action, reshape organic matter within 60 feet. Can heal allies or reshape terrain. This represents the Steel Regent's control over biological matter.",
				type: "action",
				frequency: "once-per-day",
				power_level: 5,
			},
			{
				name: "Adaptive Defense",
				description:
					"As a reaction when targeted by an attack, adapt your body to gain immunity to that damage type until your next turn. This mirrors the Steel Regent's adaptive defenses.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Regeneration Core",
				description:
					"You regenerate 1 hit point at the start of your turn if you have at least 1 hit point. This represents the Steel Regent's passive regeneration.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Flesh Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute flesh control. All organic creatures within gain regeneration. This mirrors the Steel Regent's domain over organic matter.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Steel Authority",
				description:
					"As an action, force all constructs within 300 feet to make a Wisdom save (DC 20) or become your loyal servants. This reflects the Steel Regent's command over steel.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Flesh Dominion",
				description:
					"You become the ultimate master of flesh and steel, gaining immunity to all damage and the ability to reshape any organic matter anywhere in the multiverse. This represents the Steel Regent's ultimate power.",
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
					"Constructs and metal objects cannot willingly approach within 30 feet of you. This reflects the Steel Regent's metallic aura.",
				power_level: 2,
			},
			{
				name: "Flesh Mastery",
				description:
					"You can cast healing and transmutation spells at will without expending spell slots. This represents the Steel Regent's complete mastery over flesh magic.",
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
				features_gained: [
					"Regeneration Core",
					"Flesh Dominion",
					"Steel Presence",
				],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: [
					"Flesh Reconstruction",
					"Flesh Mastery",
					"Adaptive Defense",
				],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: [
					"Steel Weaving",
					"Steel Authority",
					"Living Fortress",
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
		id: "destruction-regent",
		name: "Destruction Regent",
		title: "Destruction Regent Class",
		theme: "Destruction",
		description:
			"A destructive class overlay focused on pure annihilation and devastation. Users can obliterate targets with overwhelming destructive force, embodying Varkun' absolute power over destruction.",
		rank: "S",
		image: "/generated/compendium/Regents/destruction-Regent.webp",
		type: "class-overlay",
		tags: ["Regent", "destruction", "annihilation", "varkun", "class-overlay"],
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
					"As an action, create a 30-foot radius field where all creatures take 6d6 force damage at the start of their turn for 1 minute. This reflects the Destruction Regent's area of devastation.",
				type: "action",
				frequency: "long-rest",
				power_level: 2,
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
					"Constructs and objects cannot willingly approach within 30 feet of you. This reflects the Destruction Regent's destructive aura.",
				power_level: 2,
			},
			{
				name: "Destruction Mastery",
				description:
					"You can cast force-based spells at will without expending spell slots. This represents the Destruction Regent's complete mastery over destructive magic.",
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
					"Destruction Step",
					"Aura of Ruin",
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
					"Annihilation Wave",
					"Destruction Mastery",
					"Annihilation Presence",
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
					"Destruction Authority",
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
		id: "blood-regent",
		name: "Blood Regent",
		title: "Blood Regent Class",
		theme: "Blood Manipulation",
		description:
			"A hemomancy-based class overlay that grants control over blood and life force. Users can manipulate blood in living beings and enhance their physical abilities, embodying the Regent of Blood's absolute mastery over blood.",
		rank: "S",
		image: "/generated/compendium/Regents/blood-Regent.webp",
		type: "class-overlay",
		tags: [
			"Regent",
			"blood",
			"life-force",
			"hemomancy",
			"blood-Regent",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Blood Regent Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Blood Boil",
				description:
					"As an action, cause the blood of all creatures in 60-foot radius to boil. Victims take 14d8 necrotic damage and must make Constitution saves (DC 18) or be incapacitated. This mirrors the Regent of Blood's devastating blood attacks.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Life Drain",
				description:
					"As an action, drain life force from up to 6 creatures within 30 feet. You regain 2d10 hit points per creature affected. This reflects the Regent of Blood's life force manipulation.",
				type: "action",
				frequency: "long-rest",
				power_level: 2,
			},
			{
				name: "Blood Step",
				description:
					"As a bonus action, teleport through blood vessels and life force up to 120 feet, leaving behind a trail of blood. This mirrors the Regent of Blood's blood-based mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Hemomantic Shield",
				description:
					"As a reaction when targeted by an attack, create a shield of blood that absorbs the damage and heals you for half the damage prevented. This reflects the Regent of Blood's defensive blood capabilities.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Vampiric Aura",
				description:
					"Enemies within 20 feet lose 1d6 hit points at the start of their turn, and you regain the same amount. This represents the Regent of Blood's passive blood aura.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Blood Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute blood control. All blood creatures within gain regeneration. This mirrors the Regent of Blood's domain over blood.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Life Authority",
				description:
					"As an action, force all undead within 300 feet to make a Wisdom save (DC 20) or become your blood servants. This reflects the Regent of Blood's command over life force.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Blood Dominion",
				description:
					"You become the ultimate master of blood, gaining immunity to all damage and the ability to command any blood creature anywhere in the multiverse. This represents the Regent of Blood's ultimate power.",
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
					"Undead and constructs cannot willingly approach within 30 feet of you. This reflects the Regent of Blood's life force aura.",
				power_level: 2,
			},
			{
				name: "Hemomancy Mastery",
				description:
					"You can cast blood and life force-based spells at will without expending spell slots. This represents the Regent of Blood's complete mastery over blood magic.",
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
				name: "Life Regent",
				description:
					"Your blood power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Hemomancy Regent",
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
				"Immune to life drain and necrotic damage",
				"Can sense and manipulate blood in living creatures",
				"Can heal through blood manipulation",
				"Blood creatures are automatically friendly toward you",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		progression_table: {
			"1": {
				features_gained: ["Blood Step", "Vampiric Aura", "Blood Dominion"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: [
					"Blood Boil",
					"Hemomancy Mastery",
					"Life Force Presence",
				],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: [
					"Life Drain",
					"Blood Authority",
					"Rebirth from Blood",
				],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Hemomantic Shield", "Blood God", "Life Lord"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Blood Dominion", "Life Command", "Blood Emperor"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Life Authority", "Absolute Blood"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Blood Ascendant", "Life Lord", "Hemomancy God"],
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
				features_gained: ["Blood Reality", "Life God", "Hemomancy Emperor"],
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
					"Life Regent",
					"Hemomancy Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: ["Blood Supremacy", "Absolute Blood", "Regent Power"],
				abilities_improved: ["Primary Ability +2"],
			},
		},
	},
	{
		id: "berserker-regent",
		name: "Berserker Regent",
		title: "Berserk Regent Class",
		theme: "Berserker Rage",
		description:
			"A rage-based class overlay that grants uncontrollable power through berserker fury. Users become unstoppable forces of destruction when enraged, embodying the Berserk Regent's absolute mastery over rage.",
		rank: "S",
		image: "/generated/compendium/Regents/berserker-Regent.webp",
		type: "class-overlay",
		tags: [
			"Regent",
			"berserk",
			"rage",
			"fury",
			"berserk-Regent",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Berserk Regent Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Unstoppable Rage",
				description:
					"As an action, enter a berserk rage for 1 minute. You gain advantage on all attack rolls, resistance to all damage, and your attacks deal maximum damage. This mirrors the Berserk Regent's ultimate rage state.",
				type: "action",
				frequency: "once-per-day",
				power_level: 3,
			},
			{
				name: "Fury Storm",
				description:
					"As an action, unleash a storm of fury that forces all creatures in 60-foot radius to make Wisdom saves (DC 18) or be frightened and take 8d8 psychic damage. This reflects the Berserk Regent's area rage control.",
				type: "action",
				frequency: "long-rest",
				power_level: 2,
			},
			{
				name: "Rage Step",
				description:
					"As a bonus action, teleport through pure rage up to 120 feet, leaving behind a trail of destructive energy. This mirrors the Berserk Regent's rage-based mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Fury Shield",
				description:
					"As a reaction when targeted by an attack, absorb the damage and add it to your next attack roll as bonus damage. This reflects the Berserk Regent's defensive rage capabilities.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Berserk Aura",
				description:
					"Enemies within 20 feet must make Wisdom saves each turn or be frightened and take 1d8 psychic damage. This represents the Berserk Regent's passive rage aura.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Rage Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute rage control. All berserk creatures within gain advantage on all attacks. This mirrors the Berserk Regent's domain over rage.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Fury Authority",
				description:
					"As an action, force all peaceful creatures within 300 feet to make a Wisdom save (DC 20) or become enraged and serve your will. This reflects the Berserk Regent's command over rage.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Berserk Dominion",
				description:
					"You become the ultimate master of rage, gaining immunity to all damage and the ability to command any berserk creature anywhere in the multiverse. This represents the Berserk Regent's ultimate power.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Berserk Dominion",
				description:
					"You gain immunity to being frightened and charmed. You cannot be knocked unconscious while raging. This reflects the Berserk Regent's mental fortitude.",
				power_level: 1,
			},
			{
				name: "Fury Presence",
				description:
					"Peaceful creatures cannot willingly approach within 30 feet of you. This reflects the Berserk Regent's intimidating aura.",
				power_level: 2,
			},
			{
				name: "Rage Mastery",
				description:
					"You can cast rage-based spells at will without expending spell slots. This represents the Berserk Regent's complete mastery over rage magic.",
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
				name: "Fury Regent",
				description:
					"Your rage power extends across the multiverse, allowing you to reshape entire universes.",
				power_level: 19,
			},
			{
				name: "Berserker Regent",
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
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Regent, equal to all other Regents at their maximum potential.",
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
		},
		progression_table: {
			"1": {
				features_gained: ["Rage Step", "Berserk Aura", "Berserk Dominion"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Unstoppable Rage", "Rage Mastery", "Fury Presence"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Fury Storm", "Rage Authority", "Rebirth from Fury"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Fury Shield", "Berserk God", "Fury Lord"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Rage Dominion", "Fury Command", "Berserk Emperor"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Fury Authority", "Absolute Rage"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Rage Ascendant", "Fury Lord", "Berserk God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: ["Rage Apocalypse", "Fury Dominion", "Essence God"],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Rage Reality", "Fury God", "Berserk Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Rage Transcendence",
					"Fury Emperor",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: ["Rage Omnipotence", "Fury Regent", "Berserk Regent"],
				abilities_improved: [],
			},
			"20": {
				features_gained: ["Rage Supremacy", "Absolute Rage", "Regent Power"],
				abilities_improved: ["Primary Ability +2"],
			},
		},
	},
	{
		id: "war-regent",
		name: "War Regent",
		title: "War Regent Ascendant Class",
		theme: "Tactical Battlefield Supremacy",
		description:
			"A leadership-based class overlay that grants command over vanguard legions and tactical supremacy. Users can lead legions of vanguard soldiers, embodying the Commander Regent's absolute mastery over shadow command.",
		rank: "S",
		image: "/generated/compendium/Regents/shadow-command-Regent.webp",
		type: "class-overlay",
		tags: [
			"Regent",
			"command",
			"leadership",
			"tactics",
			"commander-Regent",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "System Ascendant Canon",
		requirements: {
			quest_completion: "Complete the Command Regent Ascension trials",
			dm_verification: true,
			prerequisite_job: "Any base job",
			power_level: 10,
		},
		abilities: [
			{
				name: "Warlord's Command",
				description: "Grant an ally within 60 feet an immediate action.",
				type: "bonus-action",
			},
			{
				name: "Conquest",
				description: "100-ft AoE tactical stun.",
				type: "action",
				frequency: "long-rest",
			},
			{
				name: "Tactical Step",
				description:
					"As a bonus action, teleport through command authority up to 120 feet, bringing up to 5 allies with you. This mirrors the Commander Regent's tactical mobility.",
				type: "bonus-action",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Command Shield",
				description:
					"As a reaction when an ally is targeted by an attack, redirect the attack to yourself and gain resistance to the damage. This reflects the Commander Regent's protective command capabilities.",
				type: "reaction",
				frequency: "short-rest",
				power_level: 2,
			},
			{
				name: "Leadership Aura",
				description:
					"Allies within 30 feet gain advantage on attack rolls and saving throws. Enemies within this range have disadvantage on attacks against your allies. This represents the Commander Regent's passive leadership aura.",
				type: "passive",
				frequency: "at-will",
				power_level: 1,
			},
			{
				name: "Command Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute command control. All allied creatures within gain advantage on all attacks and cannot be frightened. This mirrors the Commander Regent's domain over command.",
				type: "action",
				frequency: "once-per-day",
				power_level: 7,
			},
			{
				name: "Tactical Authority",
				description:
					"As an action, force all enemy commanders within 300 feet to make a Wisdom save (DC 20) or surrender their forces to your command. This reflects the Commander Regent's command over enemy leadership.",
				type: "action",
				frequency: "once-per-day",
				power_level: 9,
			},
			{
				name: "Command Dominion",
				description:
					"You become the ultimate commander, gaining immunity to all damage and the ability to command any army anywhere in the multiverse. This represents the Commander Regent's ultimate power.",
				type: "passive",
				frequency: "at-will",
				power_level: 10,
			},
		],
		features: [
			{
				name: "Command Dominion",
				description:
					"You gain immunity to being frightened and charmed. You cannot be compelled to act against your will. This reflects the Commander Regent's mental fortitude.",
				power_level: 1,
			},
			{
				name: "Leadership Presence",
				description:
					"Enemy commanders cannot willingly approach within 30 feet of you. This reflects the Commander Regent's intimidating leadership aura.",
				power_level: 2,
			},
			{
				name: "Command Mastery",
				description:
					"You can cast command-based spells at will without expending spell slots. This represents the Commander Regent's complete mastery over command magic.",
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
					"Army Command",
					"Leadership Aura",
					"Command Dominion",
				],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: [
					"Legion Summon",
					"Tactical Mastery",
					"Leadership Presence",
				],
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
				features_gained: ["Command Shield", "Command God", "Tactical Lord"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: [
					"Command Dominion",
					"Tactical Command",
					"Command Emperor",
				],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Tactical Authority", "Absolute Command"],
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
		id: "frost-regent",
		name: "Frost Regent",
		title: "Frost Regent Ascendant Class",
		theme: "Eternal Winter",
		description:
			"Herald of the eternal winter. Bring ice age to modern cities. Thermometers break showing impossible temperatures and the Ascendant Bureau classifies you as a climate catastrophe event. Your power taps into the absolute zero boundary — the point where molecular motion ceases and time itself slows to a crawl. Scientists monitoring your activities have documented localized temporal distortions near frost zones.",
		rank: "S",
		image: "/generated/compendium/Regents/frost-regent.webp",
		type: "ascendant-class-overlay",
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
			"1": {
				features_gained: ["Ice Age Advent", "Frost Dominion"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Absolute Zero"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Glacial Time"],
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
		regent_requirements: {
			level: 10,
			abilities: {
				intelligence: 16,
			},
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
				"Immune to cold damage",
				"Resistance to fire damage",
				"Cannot slip on ice",
				"Slow time in radius",
			],
			restrictions: ["Requires Warden verification", "INT 16+ required"],
		},
	},
	{
		id: "beast-regent",
		name: "Beast Regent",
		title: "Beast Regent Ascendant Class",
		theme: "Primal Evolution",
		description:
			"Avatar of primordial evolution. All beasts recognize you as alpha. Transform into an apex predator from before human history. The Ascendant Bureau classifies you as an Alpha-class biodiversity threat. Zoo animals break containment when you pass, police K-9 units refuse to engage, and wildlife documentarians film you instead of their subjects.",
		rank: "S",
		image: "/generated/compendium/Regents/beast-regent.webp",
		type: "ascendant-class-overlay",
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
		regent_requirements: {
			level: 11,
			abilities: {
				strength: 17,
			},
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
				name: "Regent Power",
				description: "Full Regent power.",
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
		},
	},
	{
		id: "plague-regent",
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
		id: "spatial-regent",
		name: "Spatial Regent",
		title: "Spatial Regent Ascendant Class",
		theme: "Cosmic Weaving & Dimensional Void",
		description:
			"Reality's architect. Reshape space, time, and dimensions. Create permanent worlds. Your Cosmic Senses shows universe blueprints. The Ascendant Bureau classifies you as a Dimensional sovereignty threat. You build structures from nothing, create pocket dimensions for storage/bases/prisons, and place dimensional anchors worldwide for instant teleportation. ",
		rank: "S",
		image: "/generated/compendium/Regents/architect-regent.webp",
		type: "ascendant-class-overlay",
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
				name: "Void Singularity",
				description: "Localized gravity well dealing force damage.",
				type: "action",
			},
			{
				level: 1,
				name: "Planar Blink",
				description: "At-will 30-ft teleport.",
				type: "bonus-action",
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
			"1": {
				features_gained: ["World Creation", "Instant Architecture"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Spatial Anchors"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Living Lair"],
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
				features_gained: ["Blueprint Vision"],
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
				features_gained: ["Absolute Architect"],
				abilities_improved: [],
			},
			"11": {
				features_gained: [
					"Architect Ascendant",
					"Spatial Lord",
					"Dimensional God",
				],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: [
					"Architect Apocalypse",
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
				features_gained: [
					"Architect Reality",
					"Spatial God",
					"Dimensional Emperor",
				],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Architect Transcendence",
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
					"Architect Omnipotence",
					"Spatial Regent",
					"Dimensional Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Architect Supremacy",
					"Absolute Architect",
					"Regent Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		regent_requirements: {
			level: 13,
			abilities: {
				intelligence: 18,
			},
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
				description:
					"Fabricator of reality. You perceive the dimensional weave of the universe and can fold, tear, or reshape it at will. You are the master of the void, capable of creating ethereal domains and manipulating gravity to crush your foes.",
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
				name: "Regent Power",
				description: "Full Regent power.",
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
		},
	},
	{
		id: "mimic-regent",
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
];
