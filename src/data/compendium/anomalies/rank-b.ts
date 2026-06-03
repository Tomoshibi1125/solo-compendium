// B-Rank Anomalies — reconstructed to complete 5e statblocks
// (Phase D). CR/HP/attack/DC/XP derived from monster5eTable.ts so a single
// rank-appropriate anomaly stays within a party-of-4 Deadly budget.

export const anomalies_b = [
	{
		id: "anomaly-0003",
		name: "Eternal Abyssal Horror",
		type: "Humanoid",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 148,
		hit_dice: "148 (20d8 + 58)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Deception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0003.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 15",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 16,
				intelligence: 14,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Agility: 7,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 thunder damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Agility saving throw or take 10d6 necrotic damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "necrotic",
				range: 60,
				save: "Agility",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Agility saving throw, taking 12d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
				damage_type: "lightning",
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
		id: "anomaly-0008",
		name: "Eternal Shadow Lurker",
		type: "Beast",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 151,
		hit_dice: "151 (20d8 + 61)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Stealth: 7,
		},
		image: "/generated/compendium/anomalies/anomaly-0008.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 14",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 18,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 fire damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 10d6 acid damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 12d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
				damage_type: "poison",
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
		id: "anomaly-0013",
		name: "Eternal Shadow Revenant",
		type: "anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 160,
		hit_dice: "160 (21d8 + 65)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0013.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 14",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 16,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 16,
			},
			speed: 30,
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 poison damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 10d6 cold damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 12d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0018",
		name: "Eternal Shadow Assassin",
		type: "Elemental",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 148,
		hit_dice: "148 (14d10 + 71)",
		ac: 15,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 4,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0018.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 14",
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
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 20,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 lightning damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 10d6 force damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 12d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +6 to hit, range 60 ft., one target. Hit: 6d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0023",
		name: "Corrupted Abyssal Horror",
		type: "Dragon",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 157,
		hit_dice: "157 (14d10 + 80)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Intimidation: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0023.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 14",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 16,
				vitality: 22,
				intelligence: 12,
				sense: 12,
				presence: 14,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 9,
				Vitality: 9,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 cold damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 10d6 fire damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 12d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
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
	},
	{
		id: "anomaly-0028",
		name: "Corrupted Shadow Lurker",
		type: "Anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 160,
		hit_dice: "160 (17d8 + 83)",
		ac: 15,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 5,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0028.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 16,
				vitality: 20,
				intelligence: 12,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 psychic damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 10d6 thunder damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "thunder",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 12d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
				damage_type: "necrotic",
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
					"When the anomaly is hit by an attack, it wreathes itself in thunder energy: the attacker must succeed on a DC 15 Vitality saving throw or take 5d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0033",
		name: "Corrupted Shadow Revenant",
		type: "Humanoid",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 154,
		hit_dice: "154 (21d8 + 59)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Deception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0033.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 15",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 16,
				intelligence: 14,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Agility: 7,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 necrotic damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Agility saving throw or take 10d6 lightning damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "lightning",
				range: 60,
				save: "Agility",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Agility saving throw, taking 12d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
				damage_type: "force",
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
		id: "anomaly-0038",
		name: "Corrupted Shadow Assassin",
		type: "Beast",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 157,
		hit_dice: "157 (21d8 + 62)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Stealth: 7,
		},
		image: "/generated/compendium/anomalies/anomaly-0038.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 14",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 18,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 acid damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 10d6 poison damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 12d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
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
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0043",
		name: "Blessed Abyssal Horror",
		type: "anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 151,
		hit_dice: "151 (20d8 + 61)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0043.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 14",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 16,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 16,
			},
			speed: 30,
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 cold damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 10d6 psychic damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 12d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0048",
		name: "Blessed Shadow Lurker",
		type: "Elemental",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 154,
		hit_dice: "154 (15d10 + 71)",
		ac: 15,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 4,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0048.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 14",
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
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 20,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 force damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 10d6 cold damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 12d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
				damage_type: "fire",
				range: 20,
				save: "Vitality",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Cold Mote",
				description:
					"Ranged Spell Attack: +6 to hit, range 60 ft., one target. Hit: 6d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0053",
		name: "Blessed Shadow Revenant",
		type: "Dragon",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 148,
		hit_dice: "148 (13d10 + 76)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Intimidation: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0053.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 14",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 16,
				vitality: 22,
				intelligence: 12,
				sense: 12,
				presence: 14,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 9,
				Vitality: 9,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 fire damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 10d6 acid damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 12d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
				damage_type: "poison",
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
		id: "anomaly-0058",
		name: "Blessed Shadow Assassin",
		type: "Anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 151,
		hit_dice: "151 (16d8 + 79)",
		ac: 15,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 5,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0058.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2300,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 16,
				vitality: 20,
				intelligence: 12,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 6,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12d6 thunder damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "12d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 10d6 necrotic damage.",
				type: "ranged",
				damage: "10d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 12d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "12d6",
				damage_type: "lightning",
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
					"When the anomaly is hit by an attack, it wreathes itself in necrotic energy: the attacker must succeed on a DC 15 Vitality saving throw or take 5d6 necrotic damage.",
			},
		],
	},
	{
		id: "anomaly-0063",
		name: "Cursed Abyssal Horror",
		type: "Humanoid",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 175,
		hit_dice: "175 (23d8 + 71)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Deception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0063.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 15",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 16,
				intelligence: 14,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Agility: 7,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 lightning damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Agility saving throw or take 11d6 force damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "force",
				range: 60,
				save: "Agility",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Agility saving throw, taking 14d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
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
		id: "anomaly-0068",
		name: "Cursed Shadow Lurker",
		type: "Beast",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 163,
		hit_dice: "163 (22d8 + 64)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Stealth: 7,
		},
		image: "/generated/compendium/anomalies/anomaly-0068.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 14",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 18,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 poison damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 cold damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "psychic",
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
		id: "anomaly-0073",
		name: "Cursed Shadow Revenant",
		type: "anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 172,
		hit_dice: "172 (23d8 + 68)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0073.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 14",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 16,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 16,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 psychic damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 thunder damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
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
		id: "anomaly-0078",
		name: "Cursed Shadow Assassin",
		type: "Elemental",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 175,
		hit_dice: "175 (17d10 + 81)",
		ac: 15,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 4,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0078.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 14",
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
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 20,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 cold damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 11d6 fire damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "fire",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 14d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "acid",
				range: 20,
				save: "Vitality",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Fire Mote",
				description:
					"Ranged Spell Attack: +6 to hit, range 60 ft., one target. Hit: 7d6 fire damage.",
			},
		],
	},
	{
		id: "anomaly-0083",
		name: "Ancient Abyssal Horror",
		type: "Dragon",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 169,
		hit_dice: "169 (15d10 + 86)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Intimidation: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0083.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 14",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 16,
				vitality: 22,
				intelligence: 12,
				sense: 12,
				presence: 14,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 9,
				Vitality: 9,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 acid damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 poison damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
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
		id: "anomaly-0088",
		name: "Ancient Shadow Lurker",
		type: "Anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 172,
		hit_dice: "172 (18d8 + 91)",
		ac: 15,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 5,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0088.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 16,
				vitality: 20,
				intelligence: 12,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 necrotic damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 11d6 lightning damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 14d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "force",
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
					"When the anomaly is hit by an attack, it wreathes itself in lightning energy: the attacker must succeed on a DC 15 Vitality saving throw or take 5d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0093",
		name: "Ancient Shadow Revenant",
		type: "Humanoid",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 166,
		hit_dice: "166 (22d8 + 67)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Deception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0093.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 15",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 16,
				intelligence: 14,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Agility: 7,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 force damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Agility saving throw or take 11d6 cold damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "cold",
				range: 60,
				save: "Agility",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Agility saving throw, taking 14d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
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
		id: "anomaly-0098",
		name: "Ancient Shadow Assassin",
		type: "Beast",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 169,
		hit_dice: "169 (23d8 + 65)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Stealth: 7,
		},
		image: "/generated/compendium/anomalies/anomaly-0098.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 14",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 18,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 cold damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 psychic damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "thunder",
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
		id: "anomaly-0103",
		name: "Primordial Abyssal Horror",
		type: "anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 169,
		hit_dice: "169 (23d8 + 65)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0103.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 14",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 16,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 16,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 poison damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 cold damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0108",
		name: "Primordial Shadow Lurker",
		type: "Elemental",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 172,
		hit_dice: "172 (16d10 + 84)",
		ac: 15,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 4,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0108.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 14",
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
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 20,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 lightning damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 11d6 force damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 14d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +6 to hit, range 60 ft., one target. Hit: 7d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0113",
		name: "Primordial Shadow Revenant",
		type: "Dragon",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 166,
		hit_dice: "166 (14d10 + 89)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Intimidation: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0113.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 14",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 16,
				vitality: 22,
				intelligence: 12,
				sense: 12,
				presence: 14,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 9,
				Vitality: 9,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 cold damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 fire damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
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
	},
	{
		id: "anomaly-0118",
		name: "Primordial Shadow Assassin",
		type: "Anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 169,
		hit_dice: "169 (18d8 + 88)",
		ac: 15,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 5,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0118.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 16,
				vitality: 20,
				intelligence: 12,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 psychic damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 11d6 thunder damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "thunder",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 14d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "necrotic",
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
					"When the anomaly is hit by an attack, it wreathes itself in thunder energy: the attacker must succeed on a DC 15 Vitality saving throw or take 5d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0123",
		name: "Supreme Abyssal Horror",
		type: "Humanoid",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 163,
		hit_dice: "163 (22d8 + 64)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Deception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0123.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 15",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 16,
				intelligence: 14,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Agility: 7,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 necrotic damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Agility saving throw or take 11d6 lightning damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "lightning",
				range: 60,
				save: "Agility",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Agility saving throw, taking 14d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "force",
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
		id: "anomaly-0128",
		name: "Supreme Shadow Lurker",
		type: "Beast",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 166,
		hit_dice: "166 (22d8 + 67)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Stealth: 7,
		},
		image: "/generated/compendium/anomalies/anomaly-0128.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 14",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 18,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 acid damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 poison damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
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
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
	},
	{
		id: "anomaly-0133",
		name: "Supreme Shadow Revenant",
		type: "anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 175,
		hit_dice: "175 (23d8 + 71)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0133.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 14",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 16,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 16,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 cold damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 psychic damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0138",
		name: "Supreme Shadow Assassin",
		type: "Elemental",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 163,
		hit_dice: "163 (16d10 + 75)",
		ac: 15,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 4,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0138.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 14",
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
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 20,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 force damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 11d6 cold damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 14d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "fire",
				range: 20,
				save: "Vitality",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Cold Mote",
				description:
					"Ranged Spell Attack: +6 to hit, range 60 ft., one target. Hit: 7d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0143",
		name: "Legendary Abyssal Horror",
		type: "Dragon",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 172,
		hit_dice: "172 (15d10 + 89)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Intimidation: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0143.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 14",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 16,
				vitality: 22,
				intelligence: 12,
				sense: 12,
				presence: 14,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 9,
				Vitality: 9,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 fire damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 acid damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "poison",
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
		id: "anomaly-0148",
		name: "Legendary Shadow Lurker",
		type: "Anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 175,
		hit_dice: "175 (18d8 + 94)",
		ac: 15,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 5,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0148.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 16,
				vitality: 20,
				intelligence: 12,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 thunder damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 11d6 necrotic damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 14d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "lightning",
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
					"When the anomaly is hit by an attack, it wreathes itself in necrotic energy: the attacker must succeed on a DC 15 Vitality saving throw or take 5d6 necrotic damage.",
			},
		],
	},
	{
		id: "anomaly-0153",
		name: "Legendary Shadow Revenant",
		type: "Humanoid",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 169,
		hit_dice: "169 (23d8 + 65)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Deception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0153.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 15",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 16,
				intelligence: 14,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Agility: 7,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 lightning damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Agility saving throw or take 11d6 force damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "force",
				range: 60,
				save: "Agility",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Agility saving throw, taking 14d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
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
		id: "anomaly-0158",
		name: "Legendary Shadow Assassin",
		type: "Beast",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 172,
		hit_dice: "172 (23d8 + 68)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Stealth: 7,
		},
		image: "/generated/compendium/anomalies/anomaly-0158.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 14",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 18,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 poison damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 cold damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "psychic",
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
		id: "anomaly-0163",
		name: "Mythic Abyssal Horror",
		type: "anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 166,
		hit_dice: "166 (22d8 + 67)",
		ac: 15,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0163.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 14",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 16,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 16,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 psychic damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 thunder damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
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
		id: "anomaly-0168",
		name: "Mythic Shadow Lurker",
		type: "Elemental",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 169,
		hit_dice: "169 (16d10 + 81)",
		ac: 15,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 4,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0168.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 14",
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
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 20,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 cold damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 11d6 fire damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "fire",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 14d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "acid",
				range: 20,
				save: "Vitality",
				dc: 15,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Fire Mote",
				description:
					"Ranged Spell Attack: +6 to hit, range 60 ft., one target. Hit: 7d6 fire damage.",
			},
		],
	},
	{
		id: "anomaly-0173",
		name: "Mythic Shadow Revenant",
		type: "Dragon",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 163,
		hit_dice: "163 (14d10 + 86)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Intimidation: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0173.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 14",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 16,
				vitality: 22,
				intelligence: 12,
				sense: 12,
				presence: 14,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 9,
				Vitality: 9,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 acid damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Strength saving throw or take 11d6 poison damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Strength saving throw, taking 14d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
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
		id: "anomaly-0178",
		name: "Mythic Shadow Assassin",
		type: "Anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 166,
		hit_dice: "166 (17d8 + 89)",
		ac: 15,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 5,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0178.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 2900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 16,
				vitality: 20,
				intelligence: 12,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 7,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Strength: 6,
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
					"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14d6 necrotic damage.",
				type: "melee",
				attack_bonus: 6,
				damage: "14d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 15 Vitality saving throw or take 11d6 lightning damage.",
				type: "ranged",
				damage: "11d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 15,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 15 Vitality saving throw, taking 14d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "14d6",
				damage_type: "force",
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
					"When the anomaly is hit by an attack, it wreathes itself in lightning energy: the attacker must succeed on a DC 15 Vitality saving throw or take 5d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0183",
		name: "Divine Abyssal Horror",
		type: "Humanoid",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 190,
		hit_dice: "190 (25d8 + 77)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Deception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0183.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 15",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 16,
				intelligence: 14,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Agility: 7,
				Strength: 6,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 force damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Agility saving throw or take 12d6 cold damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "cold",
				range: 60,
				save: "Agility",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Agility saving throw, taking 15d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "fire",
				range: 20,
				save: "Agility",
				dc: 16,
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
		id: "anomaly-0188",
		name: "Divine Shadow Lurker",
		type: "Beast",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 178,
		hit_dice: "178 (24d8 + 70)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Stealth: 7,
		},
		image: "/generated/compendium/anomalies/anomaly-0188.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 14",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 18,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 cold damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 12d6 psychic damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 15d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 16,
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
		id: "anomaly-0193",
		name: "Divine Shadow Revenant",
		type: "anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 187,
		hit_dice: "187 (25d8 + 74)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0193.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 14",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 16,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 16,
			},
			speed: 30,
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 thunder damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 12d6 necrotic damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "necrotic",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 15d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "lightning",
				range: 20,
				save: "Strength",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0198",
		name: "Divine Shadow Assassin",
		type: "Elemental",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 190,
		hit_dice: "190 (18d10 + 91)",
		ac: 16,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 4,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0198.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 14",
		languages: "Primordial",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: ["poison"],
		condition_immunities: [
			"exhaustion",
			"paralyzed",
			"petrified",
			"poisoned",
			"unconscious",
		],
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 20,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 fire damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 12d6 acid damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "acid",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 15d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "poison",
				range: 20,
				save: "Vitality",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Acid Mote",
				description:
					"Ranged Spell Attack: +7 to hit, range 60 ft., one target. Hit: 8d6 acid damage.",
			},
		],
	},
	{
		id: "anomaly-0203",
		name: "Infernal Abyssal Horror",
		type: "Dragon",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 190,
		hit_dice: "190 (17d10 + 96)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Intimidation: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0203.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 14",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 16,
				vitality: 22,
				intelligence: 12,
				sense: 12,
				presence: 14,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 9,
				Vitality: 9,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 cold damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 12d6 fire damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 15d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "acid",
				range: 20,
				save: "Strength",
				dc: 16,
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
		id: "anomaly-0208",
		name: "Infernal Shadow Lurker",
		type: "Anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 178,
		hit_dice: "178 (19d8 + 92)",
		ac: 16,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 5,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0208.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 16,
				vitality: 20,
				intelligence: 12,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Strength: 6,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 psychic damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 12d6 thunder damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "thunder",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 15d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "necrotic",
				range: 20,
				save: "Vitality",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in thunder energy: the attacker must succeed on a DC 16 Vitality saving throw or take 6d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0213",
		name: "Infernal Shadow Revenant",
		type: "Humanoid",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 187,
		hit_dice: "187 (25d8 + 74)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Deception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0213.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 15",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 16,
				intelligence: 14,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Agility: 7,
				Strength: 6,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 necrotic damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Agility saving throw or take 12d6 lightning damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "lightning",
				range: 60,
				save: "Agility",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Agility saving throw, taking 15d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "force",
				range: 20,
				save: "Agility",
				dc: 16,
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
		id: "anomaly-0218",
		name: "Infernal Shadow Assassin",
		type: "Beast",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 190,
		hit_dice: "190 (25d8 + 77)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Stealth: 7,
		},
		image: "/generated/compendium/anomalies/anomaly-0218.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 14",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 18,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 acid damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 12d6 poison damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 15d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 16,
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
		id: "anomaly-0223",
		name: "Celestial Abyssal Horror",
		type: "anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 184,
		hit_dice: "184 (25d8 + 71)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0223.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 14",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 16,
				vitality: 16,
				intelligence: 12,
				sense: 12,
				presence: 16,
			},
			speed: 30,
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 cold damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 12d6 psychic damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 15d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
	},
	{
		id: "anomaly-0228",
		name: "Celestial Shadow Lurker",
		type: "Elemental",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 187,
		hit_dice: "187 (18d10 + 88)",
		ac: 16,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 4,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0228.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 14",
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
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 18,
				vitality: 20,
				intelligence: 12,
				sense: 12,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Agility: 7,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 force damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 12d6 cold damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 15d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "fire",
				range: 20,
				save: "Vitality",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Cold Mote",
				description:
					"Ranged Spell Attack: +7 to hit, range 60 ft., one target. Hit: 8d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0233",
		name: "Celestial Shadow Revenant",
		type: "Dragon",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 181,
		hit_dice: "181 (16d10 + 93)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 4,
			Intimidation: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0233.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 14",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 16,
				vitality: 22,
				intelligence: 12,
				sense: 12,
				presence: 14,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Strength: 9,
				Vitality: 9,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 fire damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 12d6 acid damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 15d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 16,
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
		id: "anomaly-0238",
		name: "Celestial Shadow Assassin",
		type: "Anomaly",
		rank: "B",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 184,
		hit_dice: "184 (19d8 + 98)",
		ac: 16,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 5,
			Arcana: 4,
		},
		image: "/generated/compendium/anomalies/anomaly-0238.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This B rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 3900,
		stats: {
			ability_scores: {
				strength: 16,
				agility: 16,
				vitality: 20,
				intelligence: 12,
				sense: 14,
				presence: 12,
			},
			speed: 30,
			challenge_rating: 8,
			proficiency_bonus: 3,
			saving_throws: {
				Vitality: 8,
				Strength: 6,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15d6 thunder damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "15d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 12d6 necrotic damage.",
				type: "ranged",
				damage: "12d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 15d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "15d6",
				damage_type: "lightning",
				range: 20,
				save: "Vitality",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in necrotic energy: the attacker must succeed on a DC 16 Vitality saving throw or take 6d6 necrotic damage.",
			},
		],
	},
];
