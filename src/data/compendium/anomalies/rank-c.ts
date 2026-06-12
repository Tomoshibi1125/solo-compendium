// C-Rank Anomalies — reconstructed to complete 5e statblocks
// (Phase D). CR/HP/attack/DC/XP derived from monster5eTable.ts so a single
// rank-appropriate anomaly stays within a party-of-4 Deadly budget.

export const anomalies_c = [
	{
		id: "anomaly-0002",
		name: "Eternal Void Beast",
		type: "Beast",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 87,
		hit_dice: "87 (13d8 + 28)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0002.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 450,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 16,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 2,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5d6 force damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "5d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 4d6 cold damage.",
				type: "ranged",
				damage: "4d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 5d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "5d6",
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
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0007",
		name: "Eternal Void Wraith",
		type: "anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 90,
		hit_dice: "90 (14d8 + 27)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0007.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 450,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 14,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 15,
			},
			speed: 30,
			challenge_rating: 2,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
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
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "5d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 4d6 psychic damage.",
				type: "ranged",
				damage: "4d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 5d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "5d6",
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
		id: "anomaly-0012",
		name: "Eternal Void Stalker",
		type: "Elemental",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 99,
		hit_dice: "99 (10d10 + 44)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0012.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "Primordial",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
		xp: 450,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 18,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 2,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5d6 thunder damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "5d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 4d6 necrotic damage.",
				type: "ranged",
				damage: "4d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 5d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "5d6",
				damage_type: "lightning",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Necrotic Mote",
				description:
					"Ranged Spell Attack: +3 to hit, range 60 ft., one target. Hit: 3d6 necrotic damage.",
			},
		],
	},
	{
		id: "anomaly-0017",
		name: "Eternal Void Devourer",
		type: "Dragon",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 87,
		hit_dice: "87 (8d10 + 43)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0017.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 450,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 14,
				vitality: 20,
				intelligence: 11,
				sense: 11,
				presence: 13,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 2,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 7,
				Vitality: 7,
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
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5d6 fire damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "5d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 4d6 acid damage.",
				type: "ranged",
				damage: "4d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 5d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "5d6",
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
		id: "anomaly-0022",
		name: "Corrupted Void Beast",
		type: "Anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 96,
		hit_dice: "96 (11d8 + 46)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0022.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 450,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 14,
				vitality: 18,
				intelligence: 11,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 2,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Strength: 4,
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
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5d6 poison damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "5d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 4d6 cold damage.",
				type: "ranged",
				damage: "4d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 5d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "5d6",
				damage_type: "psychic",
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
					"When the anomaly is hit by an attack, it wreathes itself in cold energy: the attacker must succeed on a DC 13 Vitality saving throw or take 2d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0027",
		name: "Corrupted Void Wraith",
		type: "Humanoid",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 99,
		hit_dice: "99 (15d8 + 31)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0027.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 450,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 14,
				intelligence: 13,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 2,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 5,
				Strength: 4,
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
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5d6 lightning damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "5d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 4d6 force damage.",
				type: "ranged",
				damage: "4d6",
				damage_type: "force",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 5d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "5d6",
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
		id: "anomaly-0032",
		name: "Corrupted Void Stalker",
		type: "Beast",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 93,
		hit_dice: "93 (14d8 + 30)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0032.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 450,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 16,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 2,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5d6 cold damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "5d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 4d6 fire damage.",
				type: "ranged",
				damage: "4d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 5d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "5d6",
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
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0037",
		name: "Corrupted Void Devourer",
		type: "anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 96,
		hit_dice: "96 (15d8 + 28)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0037.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 450,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 14,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 15,
			},
			speed: 30,
			challenge_rating: 2,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
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
					"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5d6 psychic damage.",
				type: "melee",
				attack_bonus: 3,
				damage: "5d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 4d6 thunder damage.",
				type: "ranged",
				damage: "4d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 5d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "5d6",
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
		id: "anomaly-0042",
		name: "Blessed Void Beast",
		type: "Elemental",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 105,
		hit_dice: "105 (11d10 + 44)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0042.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
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
		xp: 700,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 18,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 necrotic damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 5d6 lightning damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 7d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
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
					"Ranged Spell Attack: +4 to hit, range 60 ft., one target. Hit: 3d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0047",
		name: "Blessed Void Wraith",
		type: "Dragon",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 108,
		hit_dice: "108 (10d10 + 53)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0047.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 14,
				vitality: 20,
				intelligence: 11,
				sense: 11,
				presence: 13,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 7,
				Vitality: 7,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 acid damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 5d6 poison damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 7d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
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
		id: "anomaly-0052",
		name: "Blessed Void Stalker",
		type: "Anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 102,
		hit_dice: "102 (12d8 + 48)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0052.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 14,
				vitality: 18,
				intelligence: 11,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Strength: 4,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 cold damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 5d6 psychic damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "psychic",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 7d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
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
					"When the anomaly is hit by an attack, it wreathes itself in psychic energy: the attacker must succeed on a DC 13 Vitality saving throw or take 3d6 psychic damage.",
			},
		],
	},
	{
		id: "anomaly-0057",
		name: "Blessed Void Devourer",
		type: "Humanoid",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 105,
		hit_dice: "105 (16d8 + 33)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0057.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 14,
				intelligence: 13,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 5,
				Strength: 4,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 force damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 5d6 cold damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "cold",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 7d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
				damage_type: "fire",
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
		id: "anomaly-0062",
		name: "Cursed Void Beast",
		type: "Beast",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 114,
		hit_dice: "114 (18d8 + 33)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0062.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 16,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 fire damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 5d6 acid damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 7d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
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
		id: "anomaly-0067",
		name: "Cursed Void Wraith",
		type: "anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 102,
		hit_dice: "102 (16d8 + 30)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0067.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 14,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 15,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 thunder damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 5d6 necrotic damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "necrotic",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 7d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
				damage_type: "lightning",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0072",
		name: "Cursed Void Stalker",
		type: "Elemental",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 111,
		hit_dice: "111 (12d10 + 45)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0072.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
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
		xp: 700,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 18,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 lightning damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 5d6 force damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 7d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
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
					"Ranged Spell Attack: +4 to hit, range 60 ft., one target. Hit: 3d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0077",
		name: "Cursed Void Devourer",
		type: "Dragon",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 114,
		hit_dice: "114 (11d10 + 53)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0077.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 14,
				vitality: 20,
				intelligence: 11,
				sense: 11,
				presence: 13,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 7,
				Vitality: 7,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 poison damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 5d6 cold damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 7d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
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
	},
	{
		id: "anomaly-0082",
		name: "Ancient Void Beast",
		type: "Anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 108,
		hit_dice: "108 (13d8 + 49)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0082.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 14,
				vitality: 18,
				intelligence: 11,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Strength: 4,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 psychic damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 5d6 thunder damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "thunder",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 7d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
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
					"When the anomaly is hit by an attack, it wreathes itself in thunder energy: the attacker must succeed on a DC 13 Vitality saving throw or take 3d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0087",
		name: "Ancient Void Wraith",
		type: "Humanoid",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 111,
		hit_dice: "111 (17d8 + 34)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0087.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 14,
				intelligence: 13,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 5,
				Strength: 4,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 cold damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 5d6 fire damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "fire",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 7d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
				damage_type: "acid",
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
		id: "anomaly-0092",
		name: "Ancient Void Stalker",
		type: "Beast",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 105,
		hit_dice: "105 (16d8 + 33)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0092.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 16,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 acid damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 5d6 poison damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 7d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
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
		id: "anomaly-0097",
		name: "Ancient Void Devourer",
		type: "anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 108,
		hit_dice: "108 (17d8 + 31)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0097.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 14,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 15,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 necrotic damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 5d6 lightning damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "lightning",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 7d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
				damage_type: "force",
				range: 20,
				save: "Strength",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0102",
		name: "Primordial Void Beast",
		type: "Elemental",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 108,
		hit_dice: "108 (11d10 + 47)",
		ac: 13,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0102.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "Primordial",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 18,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 thunder damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 5d6 necrotic damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 7d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
				damage_type: "lightning",
				range: 20,
				save: "Vitality",
				dc: 13,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Necrotic Mote",
				description:
					"Ranged Spell Attack: +4 to hit, range 60 ft., one target. Hit: 3d6 necrotic damage.",
			},
		],
	},
	{
		id: "anomaly-0107",
		name: "Primordial Void Wraith",
		type: "Dragon",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 111,
		hit_dice: "111 (11d10 + 50)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0107.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 14,
				vitality: 20,
				intelligence: 11,
				sense: 11,
				presence: 13,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 7,
				Vitality: 7,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 fire damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Strength saving throw or take 5d6 acid damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Strength saving throw, taking 7d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
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
		id: "anomaly-0112",
		name: "Primordial Void Stalker",
		type: "Anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 105,
		hit_dice: "105 (12d8 + 51)",
		ac: 13,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0112.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 14,
				vitality: 18,
				intelligence: 11,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Strength: 4,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 poison damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Vitality saving throw or take 5d6 cold damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Vitality saving throw, taking 7d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
				damage_type: "psychic",
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
					"When the anomaly is hit by an attack, it wreathes itself in cold energy: the attacker must succeed on a DC 13 Vitality saving throw or take 3d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0117",
		name: "Primordial Void Devourer",
		type: "Humanoid",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 108,
		hit_dice: "108 (17d8 + 31)",
		ac: 13,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0117.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 700,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 14,
				intelligence: 13,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 3,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 5,
				Strength: 4,
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
					"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7d6 lightning damage.",
				type: "melee",
				attack_bonus: 4,
				damage: "7d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 13 Agility saving throw or take 5d6 force damage.",
				type: "ranged",
				damage: "5d6",
				damage_type: "force",
				range: 60,
				save: "Agility",
				dc: 13,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 13 Agility saving throw, taking 7d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "7d6",
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
		id: "anomaly-0122",
		name: "Supreme Void Beast",
		type: "Beast",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 117,
		hit_dice: "117 (18d8 + 36)",
		ac: 14,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0122.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 16,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 cold damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Strength saving throw or take 7d6 fire damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Strength saving throw, taking 9d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "acid",
				range: 20,
				save: "Strength",
				dc: 14,
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
		id: "anomaly-0127",
		name: "Supreme Void Wraith",
		type: "anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 120,
		hit_dice: "120 (18d8 + 39)",
		ac: 14,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0127.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 14,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 15,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 psychic damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Strength saving throw or take 7d6 thunder damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Strength saving throw, taking 9d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "necrotic",
				range: 20,
				save: "Strength",
				dc: 14,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0132",
		name: "Supreme Void Stalker",
		type: "Elemental",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 129,
		hit_dice: "129 (14d10 + 52)",
		ac: 14,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0132.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
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
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 18,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 necrotic damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Vitality saving throw or take 7d6 lightning damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Vitality saving throw, taking 9d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "force",
				range: 20,
				save: "Vitality",
				dc: 14,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Lightning Mote",
				description:
					"Ranged Spell Attack: +5 to hit, range 60 ft., one target. Hit: 4d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0137",
		name: "Supreme Void Devourer",
		type: "Dragon",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 117,
		hit_dice: "117 (11d10 + 56)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0137.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 14,
				vitality: 20,
				intelligence: 11,
				sense: 11,
				presence: 13,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 7,
				Vitality: 7,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 acid damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Strength saving throw or take 7d6 poison damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Strength saving throw, taking 9d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 14,
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
		id: "anomaly-0142",
		name: "Legendary Void Beast",
		type: "Anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 126,
		hit_dice: "126 (15d8 + 58)",
		ac: 14,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0142.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 14,
				vitality: 18,
				intelligence: 11,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Strength: 4,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 cold damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Vitality saving throw or take 7d6 psychic damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "psychic",
				range: 60,
				save: "Vitality",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Vitality saving throw, taking 9d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "thunder",
				range: 20,
				save: "Vitality",
				dc: 14,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in psychic energy: the attacker must succeed on a DC 14 Vitality saving throw or take 3d6 psychic damage.",
			},
		],
	},
	{
		id: "anomaly-0147",
		name: "Legendary Void Wraith",
		type: "Humanoid",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 129,
		hit_dice: "129 (20d8 + 39)",
		ac: 14,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0147.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 14,
				intelligence: 13,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 5,
				Strength: 4,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 force damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Agility saving throw or take 7d6 cold damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "cold",
				range: 60,
				save: "Agility",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Agility saving throw, taking 9d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "fire",
				range: 20,
				save: "Agility",
				dc: 14,
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
		id: "anomaly-0152",
		name: "Legendary Void Stalker",
		type: "Beast",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 123,
		hit_dice: "123 (19d8 + 37)",
		ac: 14,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0152.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 16,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 fire damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Strength saving throw or take 7d6 acid damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Strength saving throw, taking 9d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 14,
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
		id: "anomaly-0157",
		name: "Legendary Void Devourer",
		type: "anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 126,
		hit_dice: "126 (19d8 + 40)",
		ac: 14,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0157.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 14,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 15,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 thunder damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Strength saving throw or take 7d6 necrotic damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "necrotic",
				range: 60,
				save: "Strength",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Strength saving throw, taking 9d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "lightning",
				range: 20,
				save: "Strength",
				dc: 14,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0162",
		name: "Mythic Void Beast",
		type: "Elemental",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 120,
		hit_dice: "120 (13d10 + 48)",
		ac: 14,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0162.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
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
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 18,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 lightning damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Vitality saving throw or take 7d6 force damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Vitality saving throw, taking 9d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 14,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +5 to hit, range 60 ft., one target. Hit: 4d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0167",
		name: "Mythic Void Wraith",
		type: "Dragon",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 123,
		hit_dice: "123 (12d10 + 57)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0167.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 14,
				vitality: 20,
				intelligence: 11,
				sense: 11,
				presence: 13,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 7,
				Vitality: 7,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 poison damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Strength saving throw or take 7d6 cold damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Strength saving throw, taking 9d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 14,
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
		id: "anomaly-0172",
		name: "Mythic Void Stalker",
		type: "Anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 117,
		hit_dice: "117 (14d8 + 54)",
		ac: 14,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 3,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0172.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 14,
				vitality: 18,
				intelligence: 11,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Strength: 4,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 psychic damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Vitality saving throw or take 7d6 thunder damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "thunder",
				range: 60,
				save: "Vitality",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Vitality saving throw, taking 9d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "necrotic",
				range: 20,
				save: "Vitality",
				dc: 14,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in thunder energy: the attacker must succeed on a DC 14 Vitality saving throw or take 3d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0177",
		name: "Mythic Void Devourer",
		type: "Humanoid",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 120,
		hit_dice: "120 (18d8 + 39)",
		ac: 14,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Deception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0177.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 13",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 14,
				intelligence: 13,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Agility: 5,
				Strength: 4,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 cold damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Agility saving throw or take 7d6 fire damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "fire",
				range: 60,
				save: "Agility",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Agility saving throw, taking 9d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "acid",
				range: 20,
				save: "Agility",
				dc: 14,
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
		id: "anomaly-0182",
		name: "Divine Void Beast",
		type: "Beast",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 129,
		hit_dice: "129 (20d8 + 39)",
		ac: 14,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Stealth: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0182.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 12",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 16,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 acid damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Strength saving throw or take 7d6 poison damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Strength saving throw, taking 9d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 14,
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
		id: "anomaly-0187",
		name: "Divine Void Wraith",
		type: "anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 117,
		hit_dice: "117 (18d8 + 36)",
		ac: 14,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0187.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 12",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 14,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 15,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 6,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 necrotic damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Strength saving throw or take 7d6 lightning damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "lightning",
				range: 60,
				save: "Strength",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Strength saving throw, taking 9d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "force",
				range: 20,
				save: "Strength",
				dc: 14,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0192",
		name: "Divine Void Stalker",
		type: "Elemental",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 126,
		hit_dice: "126 (13d10 + 54)",
		ac: 14,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 2,
			Arcana: 2,
		},
		image: "/generated/compendium/anomalies/anomaly-0192.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
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
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 18,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Vitality: 6,
				Agility: 5,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 force damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Vitality saving throw or take 7d6 cold damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Vitality saving throw, taking 9d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "fire",
				range: 20,
				save: "Vitality",
				dc: 14,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Cold Mote",
				description:
					"Ranged Spell Attack: +5 to hit, range 60 ft., one target. Hit: 4d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0197",
		name: "Divine Void Devourer",
		type: "Dragon",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 129,
		hit_dice: "129 (12d10 + 63)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 2,
			Intimidation: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0197.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 12",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 1100,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 14,
				vitality: 20,
				intelligence: 11,
				sense: 11,
				presence: 13,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: {
				Strength: 7,
				Vitality: 7,
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
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9d6 cold damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "9d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 14 Strength saving throw or take 7d6 psychic damage.",
				type: "ranged",
				damage: "7d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 14,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 14 Strength saving throw, taking 9d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "9d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 14,
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
		id: "anomaly-0202",
		name: "Infernal Void Beast",
		type: "Anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 144,
		hit_dice: "144 (17d8 + 67)",
		ac: 15,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 4,
			Arcana: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0202.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 14",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 1800,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 14,
				vitality: 18,
				intelligence: 11,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 5,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 7,
				Strength: 5,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10d6 poison damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "10d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 8d6 cold damage.",
				type: "ranged",
				damage: "8d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 10d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "10d6",
				damage_type: "psychic",
				range: 20,
				save: "Vitality",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in cold energy: the attacker must succeed on a DC 15 Vitality saving throw or take 4d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0207",
		name: "Infernal Void Wraith",
		type: "Humanoid",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 132,
		hit_dice: "132 (20d8 + 42)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Deception: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0207.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 14",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 1800,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 14,
				intelligence: 13,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 5,
			proficiency_bonus: 3,
			saving_throws: {
				Agility: 6,
				Strength: 5,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10d6 lightning damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "10d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Agility saving throw or take 8d6 force damage.",
				type: "ranged",
				damage: "8d6",
				damage_type: "force",
				range: 60,
				save: "Agility",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Agility saving throw, taking 10d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "10d6",
				damage_type: "cold",
				range: 20,
				save: "Agility",
				dc: 15,
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
		id: "anomaly-0212",
		name: "Infernal Void Stalker",
		type: "Beast",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 141,
		hit_dice: "141 (22d8 + 42)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Stealth: 6,
		},
		image: "/generated/compendium/anomalies/anomaly-0212.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 13",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 1800,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 16,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 5,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 7,
				Agility: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10d6 cold damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "10d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 8d6 fire damage.",
				type: "ranged",
				damage: "8d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 10d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "10d6",
				damage_type: "acid",
				range: 20,
				save: "Strength",
				dc: 15,
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
		id: "anomaly-0217",
		name: "Infernal Void Devourer",
		type: "anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 144,
		hit_dice: "144 (22d8 + 45)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0217.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 13",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 1800,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 14,
				vitality: 14,
				intelligence: 11,
				sense: 11,
				presence: 15,
			},
			speed: 30,
			challenge_rating: 5,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 7,
				Presence: 5,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10d6 psychic damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "10d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 8d6 thunder damage.",
				type: "ranged",
				damage: "8d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 10d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "10d6",
				damage_type: "necrotic",
				range: 20,
				save: "Strength",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0222",
		name: "Celestial Void Beast",
		type: "Elemental",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 138,
		hit_dice: "138 (15d10 + 55)",
		ac: 15,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 3,
			Arcana: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0222.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 13",
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
		xp: 1800,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 18,
				intelligence: 11,
				sense: 11,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 5,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 7,
				Agility: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10d6 necrotic damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "10d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 8d6 lightning damage.",
				type: "ranged",
				damage: "8d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 10d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "10d6",
				damage_type: "force",
				range: 20,
				save: "Vitality",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Lightning Mote",
				description:
					"Ranged Spell Attack: +6 to hit, range 60 ft., one target. Hit: 5d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0227",
		name: "Celestial Void Wraith",
		type: "Dragon",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 141,
		hit_dice: "141 (13d10 + 69)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 3,
			Intimidation: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0227.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 13",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 1800,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 14,
				vitality: 20,
				intelligence: 11,
				sense: 11,
				presence: 13,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 5,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
				Vitality: 8,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10d6 acid damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "10d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 8d6 poison damage.",
				type: "ranged",
				damage: "8d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 10d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "10d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 15,
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
		id: "anomaly-0232",
		name: "Celestial Void Stalker",
		type: "Anomaly",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 135,
		hit_dice: "135 (16d8 + 63)",
		ac: 15,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 4,
			Arcana: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0232.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 14",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 1800,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 14,
				vitality: 18,
				intelligence: 11,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 5,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 7,
				Strength: 5,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10d6 cold damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "10d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 8d6 psychic damage.",
				type: "ranged",
				damage: "8d6",
				damage_type: "psychic",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 10d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "10d6",
				damage_type: "thunder",
				range: 20,
				save: "Vitality",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in psychic energy: the attacker must succeed on a DC 15 Vitality saving throw or take 4d6 psychic damage.",
			},
		],
	},
	{
		id: "anomaly-0237",
		name: "Celestial Void Devourer",
		type: "Humanoid",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 138,
		hit_dice: "138 (21d8 + 43)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Deception: 3,
		},
		image: "/generated/compendium/anomalies/anomaly-0237.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This C rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 14",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 1800,
		stats: {
			ability_scores: {
				strength: 14,
				agility: 16,
				vitality: 14,
				intelligence: 13,
				sense: 13,
				presence: 11,
			},
			speed: 30,
			challenge_rating: 5,
			proficiency_bonus: 3,
			saving_throws: {
				Agility: 6,
				Strength: 5,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10d6 force damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "10d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Agility saving throw or take 8d6 cold damage.",
				type: "ranged",
				damage: "8d6",
				damage_type: "cold",
				range: 60,
				save: "Agility",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Agility saving throw, taking 10d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "10d6",
				damage_type: "fire",
				range: 20,
				save: "Agility",
				dc: 15,
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
		id: "anomaly-0702",
		name: "The Caller",
		type: "Lure (Worn Dead)",
		rank: "C",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "neutral evil",
		hp: 123,
		hit_dice: "123 (13d8 + 65)",
		ac: 14,
		ac_source: "natural armor",
		skills: { Stealth: 6, Deception: 6 },
		description:
			"A worn dead the Quiet sets at the edge of safe places. It stands just past the wardline and calls in the voices of the lost — patient, tireless — until someone breaks the rules and goes to it. The Caller rarely fights; it splits the party and feeds the strays to the dark.",
		abilities: ["Voice of the Lost", "Patient"],
		weaknesses: ["Fire", "A true name spoken aloud"],
		senses: "blindsight 60 ft., passive Perception 12",
		languages: "every lost voice it has collected",
		damage_vulnerabilities: [],
		damage_resistances: ["necrotic", "psychic"],
		damage_immunities: ["poison"],
		condition_immunities: ["charmed", "frightened", "poisoned"],
		xp: 1100,
		stats: {
			ability_scores: { strength: 13, agility: 14, vitality: 16, intelligence: 9, sense: 16, presence: 17 },
			speed: 30,
			challenge_rating: 4,
			proficiency_bonus: 2,
			saving_throws: { Sense: 5 },
		},
		traits: [
			{
				name: "Voice of the Lost",
				description:
					"The Caller perfectly mimics any voice it has heard a creature grieve. Checks to recognize it as false are made with disadvantage.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "It Will Wait",
				description:
					"The Caller takes no aggressive action against a target who stays behind a native ward. It simply calls, and lets the rules do its work.",
				action: "passive",
				frequency: "at-will",
			},
		],
		actions: [
			{
				name: "Come Here",
				description:
					"The Caller calls in a voice a creature has lost. Each creature within 120 feet that can hear it must succeed on a DC 14 Sense saving throw or move its full speed toward the Caller by the most direct safe-seeming path. A creature that takes damage may repeat the save at the end of its turn.",
				type: "special",
				save: "Sense",
				dc: 14,
				range: 120,
				usage: "at-will",
			},
			{
				name: "Open Throat",
				description:
					"Melee Weapon Attack: +5 to hit, reach 5 ft., one target it has lured adjacent. Hit: 27 (6d6 + 6) necrotic damage.",
				type: "melee",
				attack_bonus: 5,
				damage: "6d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
		],
	},
];
