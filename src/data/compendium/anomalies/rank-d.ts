// D-Rank Anomalies — reconstructed to complete 5e statblocks
// (Phase D). CR/HP/attack/DC/XP derived from monster5eTable.ts so a single
// rank-appropriate anomaly stays within a party-of-4 Deadly budget.

export const anomalies_d = [
	{
		id: "anomaly-0006",
		name: "Eternal Ancient Dragon",
		type: "Elemental",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 12,
		hit_dice: "12 (1d10 + 6)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0006.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "Primordial",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
		xp: 25,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 16,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.125,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Elemental Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 necrotic damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 1d6 lightning damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 1d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "force",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Lightning Mote",
				description:
					"Ranged Spell Attack: +3 to hit, range 60 ft., one target. Hit: 1d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0011",
		name: "Eternal Abyssal Titan",
		type: "Dragon",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 22,
		hit_dice: "22 (2d10 + 11)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0011.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 25,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 12,
				vitality: 18,
				intelligence: 10,
				sense: 10,
				presence: 12,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 0.125,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Vitality: 6,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Dragon Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 force damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 cold damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "fire",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
	},
	{
		id: "anomaly-0016",
		name: "Eternal Ancient Lich",
		type: "Anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 11,
		hit_dice: "11 (1d8 + 6)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0016.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 25,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 12,
				vitality: 16,
				intelligence: 10,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.125,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 1d6 psychic damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "psychic",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 1d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "thunder",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in psychic energy: the attacker must succeed on a DC 13 Vitality saving throw or take 1d6 psychic damage.",
			},
		],
	},
	{
		id: "anomaly-0021",
		name: "Corrupted Shadow anomaly",
		type: "Humanoid",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 21,
		hit_dice: "21 (4d8 + 3)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0021.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 25,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 12,
				intelligence: 12,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.125,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 4,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Humanoid Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 thunder damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 1d6 necrotic damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "necrotic",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 1d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "lightning",
				range: 20,
				save: "Agility",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0026",
		name: "Corrupted Ancient Dragon",
		type: "Beast",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 10,
		hit_dice: "10 (2d8 + 1)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0026.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 25,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 14,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.125,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Beast Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 fire damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 acid damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0031",
		name: "Corrupted Abyssal Titan",
		type: "anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 20,
		hit_dice: "20 (4d8 + 2)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0031.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 25,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 12,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 0.125,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Presence: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 poison damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 cold damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0036",
		name: "Corrupted Ancient Lich",
		type: "Elemental",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 9,
		hit_dice: "9 (1d10 + 3)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0036.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "Primordial",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
		xp: 25,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 16,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.125,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Elemental Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 lightning damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 1d6 force damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 1d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +3 to hit, range 60 ft., one target. Hit: 1d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0041",
		name: "Blessed Shadow anomaly",
		type: "Dragon",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 19,
		hit_dice: "19 (2d10 + 8)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0041.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 25,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 12,
				vitality: 18,
				intelligence: 10,
				sense: 10,
				presence: 12,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 0.125,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Vitality: 6,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Dragon Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 fire damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "acid",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
	},
	{
		id: "anomaly-0046",
		name: "Blessed Ancient Dragon",
		type: "Anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 38,
		hit_dice: "38 (5d8 + 15)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0046.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 12,
				vitality: 16,
				intelligence: 10,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 psychic damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 1d6 thunder damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "thunder",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 1d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "necrotic",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in thunder energy: the attacker must succeed on a DC 13 Vitality saving throw or take 1d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0051",
		name: "Blessed Abyssal Titan",
		type: "Humanoid",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 49,
		hit_dice: "49 (9d8 + 8)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0051.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 12,
				intelligence: 12,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 4,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Humanoid Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 necrotic damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 1d6 lightning damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "lightning",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 1d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "force",
				range: 20,
				save: "Agility",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0056",
		name: "Blessed Ancient Lich",
		type: "Beast",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 39,
		hit_dice: "39 (7d8 + 7)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0056.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 14,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Beast Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 acid damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 poison damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0061",
		name: "Cursed Shadow anomaly",
		type: "anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 36,
		hit_dice: "36 (7d8 + 4)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0061.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 12,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Presence: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 psychic damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0066",
		name: "Cursed Ancient Dragon",
		type: "Elemental",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 40,
		hit_dice: "40 (5d10 + 12)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0066.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "Primordial",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 16,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Elemental Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 force damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 1d6 cold damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 1d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "fire",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Cold Mote",
				description:
					"Ranged Spell Attack: +3 to hit, range 60 ft., one target. Hit: 1d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0071",
		name: "Cursed Abyssal Titan",
		type: "Dragon",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 37,
		hit_dice: "37 (4d10 + 15)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0071.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 12,
				vitality: 18,
				intelligence: 10,
				sense: 10,
				presence: 12,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Vitality: 6,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Dragon Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 fire damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 acid damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
	},
	{
		id: "anomaly-0076",
		name: "Cursed Ancient Lich",
		type: "Anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 41,
		hit_dice: "41 (5d8 + 18)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0076.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 12,
				vitality: 16,
				intelligence: 10,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 thunder damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 1d6 necrotic damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 1d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "lightning",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in necrotic energy: the attacker must succeed on a DC 13 Vitality saving throw or take 1d6 necrotic damage.",
			},
		],
	},
	{
		id: "anomaly-0081",
		name: "Ancient Shadow anomaly",
		type: "Humanoid",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 38,
		hit_dice: "38 (7d8 + 6)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0081.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 12,
				intelligence: 12,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 4,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Humanoid Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 lightning damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 1d6 force damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "force",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 1d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "cold",
				range: 20,
				save: "Agility",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0086",
		name: "Ancient Ancient Dragon",
		type: "Beast",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 42,
		hit_dice: "42 (8d8 + 6)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0086.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 14,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Beast Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 poison damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 cold damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0091",
		name: "Ancient Abyssal Titan",
		type: "anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 39,
		hit_dice: "39 (7d8 + 7)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0091.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 12,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Presence: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 psychic damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 thunder damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "necrotic",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0096",
		name: "Ancient Ancient Lich",
		type: "Elemental",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 43,
		hit_dice: "43 (5d10 + 15)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0096.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "Primordial",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 16,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Elemental Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 1d6 fire damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "fire",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 1d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "acid",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Fire Mote",
				description:
					"Ranged Spell Attack: +3 to hit, range 60 ft., one target. Hit: 1d6 fire damage.",
			},
		],
	},
	{
		id: "anomaly-0101",
		name: "Primordial Shadow anomaly",
		type: "Dragon",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 47,
		hit_dice: "47 (5d10 + 19)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0101.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 12,
				vitality: 18,
				intelligence: 10,
				sense: 10,
				presence: 12,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Vitality: 6,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Dragon Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 force damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 cold damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "fire",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
	},
	{
		id: "anomaly-0106",
		name: "Primordial Ancient Dragon",
		type: "Anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 37,
		hit_dice: "37 (5d8 + 14)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0106.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 12,
				vitality: 16,
				intelligence: 10,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 1d6 psychic damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "psychic",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 1d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "thunder",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in psychic energy: the attacker must succeed on a DC 13 Vitality saving throw or take 1d6 psychic damage.",
			},
		],
	},
	{
		id: "anomaly-0111",
		name: "Primordial Abyssal Titan",
		type: "Humanoid",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 48,
		hit_dice: "48 (9d8 + 7)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0111.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 12,
				intelligence: 12,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 4,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Humanoid Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 thunder damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 1d6 necrotic damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "necrotic",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 1d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "lightning",
				range: 20,
				save: "Agility",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0116",
		name: "Primordial Ancient Lich",
		type: "Beast",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 38,
		hit_dice: "38 (7d8 + 6)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0116.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 14,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Beast Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 fire damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 acid damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0121",
		name: "Supreme Shadow anomaly",
		type: "anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 49,
		hit_dice: "49 (9d8 + 8)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0121.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 50,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 12,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 0.25,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Presence: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6 poison damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "1d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 1d6 cold damage.",
				type: "ranged",
				damage: "1d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 1d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "1d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0126",
		name: "Supreme Ancient Dragon",
		type: "Elemental",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 67,
		hit_dice: "67 (8d10 + 23)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0126.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "Primordial",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 16,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Elemental Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 lightning damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 2d6 force damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 2d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +3 to hit, range 60 ft., one target. Hit: 1d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0131",
		name: "Supreme Abyssal Titan",
		type: "Dragon",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 64,
		hit_dice: "64 (7d10 + 25)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0131.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 12,
				vitality: 18,
				intelligence: 10,
				sense: 10,
				presence: 12,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Vitality: 6,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Dragon Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 2d6 fire damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 2d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "acid",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
	},
	{
		id: "anomaly-0136",
		name: "Supreme Ancient Lich",
		type: "Anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 61,
		hit_dice: "61 (8d8 + 25)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0136.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 12,
				vitality: 16,
				intelligence: 10,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 psychic damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 2d6 thunder damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "thunder",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 2d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "necrotic",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in thunder energy: the attacker must succeed on a DC 13 Vitality saving throw or take 1d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0141",
		name: "Legendary Shadow anomaly",
		type: "Humanoid",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 58,
		hit_dice: "58 (11d8 + 8)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0141.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 12,
				intelligence: 12,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 4,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Humanoid Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 necrotic damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 2d6 lightning damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "lightning",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 2d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "force",
				range: 20,
				save: "Agility",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0146",
		name: "Legendary Ancient Dragon",
		type: "Beast",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 55,
		hit_dice: "55 (10d8 + 10)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0146.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 14,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Beast Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 acid damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 2d6 poison damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 2d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0151",
		name: "Legendary Abyssal Titan",
		type: "anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 52,
		hit_dice: "52 (9d8 + 11)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0151.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 12,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Presence: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 2d6 psychic damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 2d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0156",
		name: "Legendary Ancient Lich",
		type: "Elemental",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 70,
		hit_dice: "70 (8d10 + 26)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0156.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "Primordial",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 16,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Elemental Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 force damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 2d6 cold damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 2d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "fire",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Cold Mote",
				description:
					"Ranged Spell Attack: +3 to hit, range 60 ft., one target. Hit: 1d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0161",
		name: "Mythic Shadow anomaly",
		type: "Dragon",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 67,
		hit_dice: "67 (7d10 + 28)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0161.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 12,
				vitality: 18,
				intelligence: 10,
				sense: 10,
				presence: 12,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Vitality: 6,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Dragon Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 fire damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 2d6 acid damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 2d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
	},
	{
		id: "anomaly-0166",
		name: "Mythic Ancient Dragon",
		type: "Anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 64,
		hit_dice: "64 (9d8 + 23)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0166.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 12,
				vitality: 16,
				intelligence: 10,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 thunder damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 2d6 necrotic damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 2d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "lightning",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in necrotic energy: the attacker must succeed on a DC 13 Vitality saving throw or take 1d6 necrotic damage.",
			},
		],
	},
	{
		id: "anomaly-0171",
		name: "Mythic Abyssal Titan",
		type: "Humanoid",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 61,
		hit_dice: "61 (11d8 + 11)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0171.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 12,
				intelligence: 12,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 4,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Humanoid Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 lightning damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 2d6 force damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "force",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 2d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "cold",
				range: 20,
				save: "Agility",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0176",
		name: "Mythic Ancient Lich",
		type: "Beast",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 58,
		hit_dice: "58 (11d8 + 8)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0176.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 14,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Beast Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 poison damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 2d6 cold damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 2d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0181",
		name: "Divine Shadow anomaly",
		type: "anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 55,
		hit_dice: "55 (10d8 + 10)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0181.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 12,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Presence: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 psychic damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 2d6 thunder damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 2d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "necrotic",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0186",
		name: "Divine Ancient Dragon",
		type: "Elemental",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 52,
		hit_dice: "52 (6d10 + 19)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0186.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "Primordial",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 16,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Elemental Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 2d6 fire damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "fire",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 2d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "acid",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Fire Mote",
				description:
					"Ranged Spell Attack: +3 to hit, range 60 ft., one target. Hit: 1d6 fire damage.",
			},
		],
	},
	{
		id: "anomaly-0191",
		name: "Divine Abyssal Titan",
		type: "Dragon",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 70,
		hit_dice: "70 (7d10 + 31)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0191.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 12,
				vitality: 18,
				intelligence: 10,
				sense: 10,
				presence: 12,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Vitality: 6,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Dragon Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 acid damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 2d6 poison damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 2d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
	},
	{
		id: "anomaly-0196",
		name: "Divine Ancient Lich",
		type: "Anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 67,
		hit_dice: "67 (9d8 + 26)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0196.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 12,
				vitality: 16,
				intelligence: 10,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 necrotic damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 2d6 lightning damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 2d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "force",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in lightning energy: the attacker must succeed on a DC 13 Vitality saving throw or take 1d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0201",
		name: "Infernal Shadow anomaly",
		type: "Humanoid",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 64,
		hit_dice: "64 (12d8 + 10)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0201.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 100,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 12,
				intelligence: 12,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 0.5,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 4,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Humanoid Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6 thunder damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "2d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 2d6 necrotic damage.",
				type: "ranged",
				damage: "2d6",
				damage_type: "necrotic",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 2d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "2d6",
				damage_type: "lightning",
				range: 20,
				save: "Agility",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0206",
		name: "Infernal Ancient Dragon",
		type: "Beast",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 73,
		hit_dice: "73 (13d8 + 14)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0206.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 200,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 14,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 1,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Beast Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3d6 fire damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "3d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 3d6 acid damage.",
				type: "ranged",
				damage: "3d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 3d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "3d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0211",
		name: "Infernal Abyssal Titan",
		type: "anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 82,
		hit_dice: "82 (15d8 + 14)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0211.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 200,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 12,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 1,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Presence: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3d6 poison damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "3d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 3d6 cold damage.",
				type: "ranged",
				damage: "3d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 3d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "3d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0216",
		name: "Infernal Ancient Lich",
		type: "Elemental",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 85,
		hit_dice: "85 (10d10 + 30)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0216.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "Primordial",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
		xp: 200,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 16,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 1,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Elemental Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3d6 lightning damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "3d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 3d6 force damage.",
				type: "ranged",
				damage: "3d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 3d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "3d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +3 to hit, range 60 ft., one target. Hit: 2d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0221",
		name: "Celestial Shadow anomaly",
		type: "Dragon",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 79,
		hit_dice: "79 (8d10 + 35)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0221.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 200,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 12,
				vitality: 18,
				intelligence: 10,
				sense: 10,
				presence: 12,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 1,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Vitality: 6,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Dragon Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "3d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 3d6 fire damage.",
				type: "ranged",
				damage: "3d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 3d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "3d6",
				damage_type: "acid",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
	},
	{
		id: "anomaly-0226",
		name: "Celestial Ancient Dragon",
		type: "Anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 82,
		hit_dice: "82 (11d8 + 32)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0226.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 200,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 12,
				vitality: 16,
				intelligence: 10,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 1,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 5,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3d6 psychic damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "3d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 3d6 thunder damage.",
				type: "ranged",
				damage: "3d6",
				damage_type: "thunder",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 3d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "3d6",
				damage_type: "necrotic",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in thunder energy: the attacker must succeed on a DC 13 Vitality saving throw or take 1d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0231",
		name: "Celestial Abyssal Titan",
		type: "Humanoid",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 76,
		hit_dice: "76 (14d8 + 13)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0231.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 200,
		stats: {
			ability_scores: {
				strength: 12,
				agility: 14,
				vitality: 12,
				intelligence: 12,
				sense: 12,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 1,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 4,
				Strength: 3,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Humanoid Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3d6 necrotic damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "3d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 3d6 lightning damage.",
				type: "ranged",
				damage: "3d6",
				damage_type: "lightning",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 3d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "3d6",
				damage_type: "force",
				range: 20,
				save: "Agility",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0236",
		name: "Celestial Ancient Lich",
		type: "Beast",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 79,
		hit_dice: "79 (14d8 + 16)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0236.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 200,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 14,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 10,
			},
			speed: 30,
			challenge_rating: 1,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Agility: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Beast Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3d6 acid damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "3d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 3d6 poison damage.",
				type: "ranged",
				damage: "3d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 3d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "3d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Shadow Strike attack against that creature.",
			},
		],
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0241",
		name: "Eternal Shadow anomaly",
		type: "anomaly",
		rank: "D",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 73,
		hit_dice: "73 (13d8 + 14)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0241.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This D rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 200,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 12,
				vitality: 12,
				intelligence: 10,
				sense: 10,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 1,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 5,
				Presence: 4,
			},
		},
		traits: [
			{
				name: "Ascendant Physiology",
				description:
					"This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "anomaly Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Shadow Strike",
				description:
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "3d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 3d6 psychic damage.",
				type: "ranged",
				damage: "3d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 3d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "3d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
];
