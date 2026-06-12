// A-Rank Anomalies — reconstructed to complete 5e statblocks
// (Phase D). CR/HP/attack/DC/XP derived from monster5eTable.ts so a single
// rank-appropriate anomaly stays within a party-of-4 Deadly budget.

export const anomalies_a = [
	{
		id: "anomaly-0004",
		name: "Eternal Demonic Knight",
		type: "Anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 194,
		hit_dice: "194 (18d8 + 113)",
		ac: 16,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 6,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0004.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 16",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 5000,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 18,
				vitality: 22,
				intelligence: 13,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 9,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Strength: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 17d6 poison damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "17d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 14d6 cold damage.",
				type: "ranged",
				damage: "14d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 17d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "17d6",
				damage_type: "psychic",
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
					"When the anomaly is hit by an attack, it wreathes itself in cold energy: the attacker must succeed on a DC 16 Vitality saving throw or take 7d6 cold damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Vitality saving throw or take 9d6 psychic damage.",
			},
		],
	},
	{
		id: "anomaly-0009",
		name: "Eternal Demonic Overlord",
		type: "Humanoid",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 197,
		hit_dice: "197 (23d8 + 93)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 6,
			Deception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0009.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 16",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 5000,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 18,
				intelligence: 15,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 9,
			proficiency_bonus: 4,
			saving_throws: {
				Agility: 9,
				Strength: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 17d6 lightning damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "17d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Agility saving throw or take 14d6 force damage.",
				type: "ranged",
				damage: "14d6",
				damage_type: "force",
				range: 60,
				save: "Agility",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Agility saving throw, taking 17d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "17d6",
				damage_type: "cold",
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Agility saving throw or take 9d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0014",
		name: "Eternal Demonic Warlord",
		type: "Beast",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 191,
		hit_dice: "191 (22d8 + 92)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Stealth: 9,
		},
		image: "/generated/compendium/anomalies/anomaly-0014.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 5000,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 20,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 9,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 17d6 cold damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "17d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 14d6 fire damage.",
				type: "ranged",
				damage: "14d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 17d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "17d6",
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
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 acid damage.",
			},
		],
	},
	{
		id: "anomaly-0019",
		name: "Eternal Demonic Berserker",
		type: "anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 194,
		hit_dice: "194 (23d8 + 90)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0019.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 5000,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 18,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 17,
			},
			speed: 30,
			challenge_rating: 9,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 17d6 psychic damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "17d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 14d6 thunder damage.",
				type: "ranged",
				damage: "14d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 17d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "17d6",
				damage_type: "necrotic",
				range: 20,
				save: "Strength",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 necrotic damage.",
			},
		],
	},
	{
		id: "anomaly-0024",
		name: "Corrupted Demonic Knight",
		type: "Elemental",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 203,
		hit_dice: "203 (18d10 + 104)",
		ac: 16,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 5,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0024.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 15",
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
		xp: 5000,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 22,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 9,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 17d6 necrotic damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "17d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 14d6 lightning damage.",
				type: "ranged",
				damage: "14d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 17d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "17d6",
				damage_type: "force",
				range: 20,
				save: "Vitality",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Lightning Mote",
				description:
					"Ranged Spell Attack: +7 to hit, range 60 ft., one target. Hit: 9d6 lightning damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Vitality saving throw or take 9d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0029",
		name: "Corrupted Demonic Overlord",
		type: "Dragon",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 191,
		hit_dice: "191 (15d10 + 108)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Intimidation: 6,
		},
		image: "/generated/compendium/anomalies/anomaly-0029.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 15",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 5000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 18,
				vitality: 24,
				intelligence: 13,
				sense: 13,
				presence: 15,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 9,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 11,
				Vitality: 11,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 17d6 acid damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "17d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 14d6 poison damage.",
				type: "ranged",
				damage: "14d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 17d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "17d6",
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0034",
		name: "Corrupted Demonic Warlord",
		type: "Anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 200,
		hit_dice: "200 (19d8 + 114)",
		ac: 16,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 6,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0034.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 16",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 5000,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 18,
				vitality: 22,
				intelligence: 13,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 9,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Strength: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 17d6 cold damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "17d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 14d6 psychic damage.",
				type: "ranged",
				damage: "14d6",
				damage_type: "psychic",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 17d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "17d6",
				damage_type: "thunder",
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
					"When the anomaly is hit by an attack, it wreathes itself in psychic energy: the attacker must succeed on a DC 16 Vitality saving throw or take 7d6 psychic damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Vitality saving throw or take 9d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0039",
		name: "Corrupted Demonic Berserker",
		type: "Humanoid",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 203,
		hit_dice: "203 (24d8 + 95)",
		ac: 16,
		ac_source: "natural armor",
		skills: {
			Perception: 6,
			Deception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0039.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 16",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 5000,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 18,
				intelligence: 15,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 9,
			proficiency_bonus: 4,
			saving_throws: {
				Agility: 9,
				Strength: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 17d6 force damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "17d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Agility saving throw or take 14d6 cold damage.",
				type: "ranged",
				damage: "14d6",
				damage_type: "cold",
				range: 60,
				save: "Agility",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Agility saving throw, taking 17d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "17d6",
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Agility saving throw or take 9d6 fire damage.",
			},
		],
	},
	{
		id: "anomaly-0044",
		name: "Blessed Demonic Knight",
		type: "Beast",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 212,
		hit_dice: "212 (25d8 + 99)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Stealth: 9,
		},
		image: "/generated/compendium/anomalies/anomaly-0044.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 20,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 fire damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 15d6 acid damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 19d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
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
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 poison damage.",
			},
		],
	},
	{
		id: "anomaly-0049",
		name: "Blessed Demonic Overlord",
		type: "anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 215,
		hit_dice: "215 (25d8 + 102)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0049.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 18,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 17,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 thunder damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 15d6 necrotic damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "necrotic",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 19d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
				damage_type: "lightning",
				range: 20,
				save: "Strength",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0054",
		name: "Blessed Demonic Warlord",
		type: "Elemental",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 209,
		hit_dice: "209 (18d10 + 110)",
		ac: 17,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 5,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0054.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
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
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 22,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 lightning damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 15d6 force damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 19d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +7 to hit, range 60 ft., one target. Hit: 9d6 force damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Vitality saving throw or take 9d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0059",
		name: "Blessed Demonic Berserker",
		type: "Dragon",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 212,
		hit_dice: "212 (17d10 + 118)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Intimidation: 6,
		},
		image: "/generated/compendium/anomalies/anomaly-0059.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 15",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 18,
				vitality: 24,
				intelligence: 13,
				sense: 13,
				presence: 15,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 11,
				Vitality: 11,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 poison damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 15d6 cold damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 19d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
				damage_type: "psychic",
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 psychic damage.",
			},
		],
	},
	{
		id: "anomaly-0064",
		name: "Cursed Demonic Knight",
		type: "Anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 206,
		hit_dice: "206 (20d8 + 116)",
		ac: 17,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 6,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0064.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 16",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 18,
				vitality: 22,
				intelligence: 13,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Strength: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 psychic damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 15d6 thunder damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "thunder",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 19d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
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
					"When the anomaly is hit by an attack, it wreathes itself in thunder energy: the attacker must succeed on a DC 16 Vitality saving throw or take 7d6 thunder damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Vitality saving throw or take 9d6 necrotic damage.",
			},
		],
	},
	{
		id: "anomaly-0069",
		name: "Cursed Demonic Overlord",
		type: "Humanoid",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 209,
		hit_dice: "209 (25d8 + 96)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 6,
			Deception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0069.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 16",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 18,
				intelligence: 15,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Agility: 9,
				Strength: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 cold damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Agility saving throw or take 15d6 fire damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "fire",
				range: 60,
				save: "Agility",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Agility saving throw, taking 19d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
				damage_type: "acid",
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Agility saving throw or take 9d6 acid damage.",
			},
		],
	},
	{
		id: "anomaly-0074",
		name: "Cursed Demonic Warlord",
		type: "Beast",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 218,
		hit_dice: "218 (26d8 + 101)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Stealth: 9,
		},
		image: "/generated/compendium/anomalies/anomaly-0074.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 15",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 20,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 acid damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 15d6 poison damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 19d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0079",
		name: "Cursed Demonic Berserker",
		type: "anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 206,
		hit_dice: "206 (24d8 + 98)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0079.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 18,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 17,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 necrotic damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 15d6 lightning damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "lightning",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 19d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
				damage_type: "force",
				range: 20,
				save: "Strength",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0084",
		name: "Ancient Demonic Knight",
		type: "Elemental",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 215,
		hit_dice: "215 (19d10 + 110)",
		ac: 17,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 5,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0084.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
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
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 22,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 force damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 15d6 cold damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 19d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
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
					"Ranged Spell Attack: +7 to hit, range 60 ft., one target. Hit: 9d6 cold damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Vitality saving throw or take 9d6 fire damage.",
			},
		],
	},
	{
		id: "anomaly-0089",
		name: "Ancient Demonic Overlord",
		type: "Dragon",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 218,
		hit_dice: "218 (17d10 + 124)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Intimidation: 6,
		},
		image: "/generated/compendium/anomalies/anomaly-0089.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 15",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 18,
				vitality: 24,
				intelligence: 13,
				sense: 13,
				presence: 15,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 11,
				Vitality: 11,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 cold damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 15d6 psychic damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 19d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0094",
		name: "Ancient Demonic Warlord",
		type: "Anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 212,
		hit_dice: "212 (20d8 + 122)",
		ac: 17,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 6,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0094.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 16",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 18,
				vitality: 22,
				intelligence: 13,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Strength: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 thunder damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 15d6 necrotic damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 19d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
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
					"When the anomaly is hit by an attack, it wreathes itself in necrotic energy: the attacker must succeed on a DC 16 Vitality saving throw or take 7d6 necrotic damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Vitality saving throw or take 9d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0099",
		name: "Ancient Demonic Berserker",
		type: "Humanoid",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 215,
		hit_dice: "215 (25d8 + 102)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 6,
			Deception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0099.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 16",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 18,
				intelligence: 15,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Agility: 9,
				Strength: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 fire damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Agility saving throw or take 15d6 acid damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "acid",
				range: 60,
				save: "Agility",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Agility saving throw, taking 19d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
				damage_type: "poison",
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Agility saving throw or take 9d6 poison damage.",
			},
		],
	},
	{
		id: "anomaly-0104",
		name: "Primordial Demonic Knight",
		type: "Beast",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 215,
		hit_dice: "215 (25d8 + 102)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Stealth: 9,
		},
		image: "/generated/compendium/anomalies/anomaly-0104.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 20,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 cold damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 15d6 fire damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 19d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
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
		bonus_actions: [
			{
				name: "Nimble Reposition",
				description:
					"The anomaly moves up to half its speed without provoking opportunity attacks.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 acid damage.",
			},
		],
	},
	{
		id: "anomaly-0109",
		name: "Primordial Demonic Overlord",
		type: "anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 218,
		hit_dice: "218 (26d8 + 101)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0109.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 18,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 17,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 8,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 psychic damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 15d6 thunder damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 19d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
				damage_type: "necrotic",
				range: 20,
				save: "Strength",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 necrotic damage.",
			},
		],
	},
	{
		id: "anomaly-0114",
		name: "Primordial Demonic Warlord",
		type: "Elemental",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 212,
		hit_dice: "212 (18d10 + 113)",
		ac: 17,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 5,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0114.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
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
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 22,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 necrotic damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Vitality saving throw or take 15d6 lightning damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Vitality saving throw, taking 19d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
				damage_type: "force",
				range: 20,
				save: "Vitality",
				dc: 16,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Lightning Mote",
				description:
					"Ranged Spell Attack: +7 to hit, range 60 ft., one target. Hit: 9d6 lightning damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Vitality saving throw or take 9d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0119",
		name: "Primordial Demonic Berserker",
		type: "Dragon",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 215,
		hit_dice: "215 (17d10 + 121)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Intimidation: 6,
		},
		image: "/generated/compendium/anomalies/anomaly-0119.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 15",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 5900,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 18,
				vitality: 24,
				intelligence: 13,
				sense: 13,
				presence: 15,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 10,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 11,
				Vitality: 11,
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
					"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 19d6 acid damage.",
				type: "melee",
				attack_bonus: 7,
				damage: "19d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 16 Strength saving throw or take 15d6 poison damage.",
				type: "ranged",
				damage: "15d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 16,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 16 Strength saving throw, taking 19d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "19d6",
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 16 Strength saving throw or take 9d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0124",
		name: "Supreme Demonic Knight",
		type: "Anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 224,
		hit_dice: "224 (21d8 + 129)",
		ac: 17,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 6,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0124.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 16",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 18,
				vitality: 22,
				intelligence: 13,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Strength: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 cold damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Vitality saving throw or take 17d6 psychic damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "psychic",
				range: 60,
				save: "Vitality",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Vitality saving throw, taking 21d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "thunder",
				range: 20,
				save: "Vitality",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in psychic energy: the attacker must succeed on a DC 17 Vitality saving throw or take 8d6 psychic damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Vitality saving throw or take 10d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0129",
		name: "Supreme Demonic Overlord",
		type: "Humanoid",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 227,
		hit_dice: "227 (27d8 + 105)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 6,
			Deception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0129.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 16",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 18,
				intelligence: 15,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Agility: 9,
				Strength: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 force damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Agility saving throw or take 17d6 cold damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "cold",
				range: 60,
				save: "Agility",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Agility saving throw, taking 21d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "fire",
				range: 20,
				save: "Agility",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Agility saving throw or take 10d6 fire damage.",
			},
		],
	},
	{
		id: "anomaly-0134",
		name: "Supreme Demonic Warlord",
		type: "Beast",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 221,
		hit_dice: "221 (26d8 + 104)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Stealth: 9,
		},
		image: "/generated/compendium/anomalies/anomaly-0134.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 20,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 fire damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 17d6 acid damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 21d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 10d6 poison damage.",
			},
		],
	},
	{
		id: "anomaly-0139",
		name: "Supreme Demonic Berserker",
		type: "anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 224,
		hit_dice: "224 (26d8 + 107)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0139.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 18,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 17,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 thunder damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 17d6 necrotic damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "necrotic",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 21d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "lightning",
				range: 20,
				save: "Strength",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 10d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0144",
		name: "Legendary Demonic Knight",
		type: "Elemental",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 233,
		hit_dice: "233 (20d10 + 123)",
		ac: 17,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 5,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0144.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 15",
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
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 22,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 lightning damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Vitality saving throw or take 17d6 force damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Vitality saving throw, taking 21d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +8 to hit, range 60 ft., one target. Hit: 10d6 force damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Vitality saving throw or take 10d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0149",
		name: "Legendary Demonic Overlord",
		type: "Dragon",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 221,
		hit_dice: "221 (18d10 + 122)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Intimidation: 6,
		},
		image: "/generated/compendium/anomalies/anomaly-0149.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 15",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 18,
				vitality: 24,
				intelligence: 13,
				sense: 13,
				presence: 15,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 11,
				Vitality: 11,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 poison damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 17d6 cold damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 21d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 10d6 psychic damage.",
			},
		],
	},
	{
		id: "anomaly-0154",
		name: "Legendary Demonic Warlord",
		type: "Anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 230,
		hit_dice: "230 (22d8 + 131)",
		ac: 17,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 6,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0154.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 16",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 18,
				vitality: 22,
				intelligence: 13,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Strength: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 psychic damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Vitality saving throw or take 17d6 thunder damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "thunder",
				range: 60,
				save: "Vitality",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Vitality saving throw, taking 21d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "necrotic",
				range: 20,
				save: "Vitality",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in thunder energy: the attacker must succeed on a DC 17 Vitality saving throw or take 8d6 thunder damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Vitality saving throw or take 10d6 necrotic damage.",
			},
		],
	},
	{
		id: "anomaly-0159",
		name: "Legendary Demonic Berserker",
		type: "Humanoid",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 233,
		hit_dice: "233 (27d8 + 111)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 6,
			Deception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0159.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 16",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 18,
				intelligence: 15,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Agility: 9,
				Strength: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 cold damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Agility saving throw or take 17d6 fire damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "fire",
				range: 60,
				save: "Agility",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Agility saving throw, taking 21d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "acid",
				range: 20,
				save: "Agility",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Agility saving throw or take 10d6 acid damage.",
			},
		],
	},
	{
		id: "anomaly-0164",
		name: "Mythic Demonic Knight",
		type: "Beast",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 227,
		hit_dice: "227 (27d8 + 105)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Stealth: 9,
		},
		image: "/generated/compendium/anomalies/anomaly-0164.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 15",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 20,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 acid damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 17d6 poison damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 21d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 10d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0169",
		name: "Mythic Demonic Overlord",
		type: "anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 230,
		hit_dice: "230 (27d8 + 108)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0169.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 18,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 17,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 necrotic damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 17d6 lightning damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "lightning",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 21d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "force",
				range: 20,
				save: "Strength",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 10d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0174",
		name: "Mythic Demonic Warlord",
		type: "Elemental",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 224,
		hit_dice: "224 (19d10 + 119)",
		ac: 17,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 5,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0174.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
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
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 22,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 force damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Vitality saving throw or take 17d6 cold damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Vitality saving throw, taking 21d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "fire",
				range: 20,
				save: "Vitality",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Cold Mote",
				description:
					"Ranged Spell Attack: +8 to hit, range 60 ft., one target. Hit: 10d6 cold damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Vitality saving throw or take 10d6 fire damage.",
			},
		],
	},
	{
		id: "anomaly-0179",
		name: "Mythic Demonic Berserker",
		type: "Dragon",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 227,
		hit_dice: "227 (18d10 + 128)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Intimidation: 6,
		},
		image: "/generated/compendium/anomalies/anomaly-0179.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 15",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 18,
				vitality: 24,
				intelligence: 13,
				sense: 13,
				presence: 15,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 11,
				Vitality: 11,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 cold damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 17d6 psychic damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 21d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 10d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0184",
		name: "Divine Demonic Knight",
		type: "Anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 221,
		hit_dice: "221 (21d8 + 126)",
		ac: 17,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 6,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0184.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 16",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 18,
				vitality: 22,
				intelligence: 13,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Strength: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 thunder damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Vitality saving throw or take 17d6 necrotic damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Vitality saving throw, taking 21d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "lightning",
				range: 20,
				save: "Vitality",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in necrotic energy: the attacker must succeed on a DC 17 Vitality saving throw or take 8d6 necrotic damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Vitality saving throw or take 10d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0189",
		name: "Divine Demonic Overlord",
		type: "Humanoid",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 224,
		hit_dice: "224 (26d8 + 107)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 6,
			Deception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0189.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 16",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 18,
				intelligence: 15,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Agility: 9,
				Strength: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 fire damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Agility saving throw or take 17d6 acid damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "acid",
				range: 60,
				save: "Agility",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Agility saving throw, taking 21d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "poison",
				range: 20,
				save: "Agility",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Agility saving throw or take 10d6 poison damage.",
			},
		],
	},
	{
		id: "anomaly-0194",
		name: "Divine Demonic Warlord",
		type: "Beast",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 233,
		hit_dice: "233 (27d8 + 111)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Stealth: 9,
		},
		image: "/generated/compendium/anomalies/anomaly-0194.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 20,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 poison damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 17d6 cold damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 21d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 10d6 psychic damage.",
			},
		],
	},
	{
		id: "anomaly-0199",
		name: "Divine Demonic Berserker",
		type: "anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 221,
		hit_dice: "221 (26d8 + 104)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0199.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 7200,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 18,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 17,
			},
			speed: 30,
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21d6 lightning damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "21d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 17d6 force damage.",
				type: "ranged",
				damage: "17d6",
				damage_type: "force",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 21d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "21d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 10d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0204",
		name: "Infernal Demonic Knight",
		type: "Elemental",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 236,
		hit_dice: "236 (21d10 + 120)",
		ac: 17,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 5,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0204.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
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
		xp: 8400,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 22,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 12,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 22d6 necrotic damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "22d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Vitality saving throw or take 18d6 lightning damage.",
				type: "ranged",
				damage: "18d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Vitality saving throw, taking 22d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "22d6",
				damage_type: "force",
				range: 20,
				save: "Vitality",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Lightning Mote",
				description:
					"Ranged Spell Attack: +8 to hit, range 60 ft., one target. Hit: 11d6 lightning damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Vitality saving throw or take 11d6 force damage.",
			},
		],
	},
	{
		id: "anomaly-0209",
		name: "Infernal Demonic Overlord",
		type: "Dragon",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 239,
		hit_dice: "239 (19d10 + 134)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Intimidation: 6,
		},
		image: "/generated/compendium/anomalies/anomaly-0209.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 15",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 8400,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 18,
				vitality: 24,
				intelligence: 13,
				sense: 13,
				presence: 15,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 12,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 11,
				Vitality: 11,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 22d6 acid damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "22d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 18d6 poison damage.",
				type: "ranged",
				damage: "18d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 22d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "22d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 11d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0214",
		name: "Infernal Demonic Warlord",
		type: "Anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 248,
		hit_dice: "248 (24d8 + 140)",
		ac: 17,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 6,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0214.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 16",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 8400,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 18,
				vitality: 22,
				intelligence: 13,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 12,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Strength: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 22d6 cold damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "22d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Vitality saving throw or take 18d6 psychic damage.",
				type: "ranged",
				damage: "18d6",
				damage_type: "psychic",
				range: 60,
				save: "Vitality",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Vitality saving throw, taking 22d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "22d6",
				damage_type: "thunder",
				range: 20,
				save: "Vitality",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in psychic energy: the attacker must succeed on a DC 17 Vitality saving throw or take 9d6 psychic damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Vitality saving throw or take 11d6 thunder damage.",
			},
		],
	},
	{
		id: "anomaly-0219",
		name: "Infernal Demonic Berserker",
		type: "Humanoid",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 236,
		hit_dice: "236 (28d8 + 110)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 6,
			Deception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0219.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 16",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 8400,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 18,
				intelligence: 15,
				sense: 15,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 12,
			proficiency_bonus: 4,
			saving_throws: {
				Agility: 9,
				Strength: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 22d6 force damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "22d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Agility saving throw or take 18d6 cold damage.",
				type: "ranged",
				damage: "18d6",
				damage_type: "cold",
				range: 60,
				save: "Agility",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Agility saving throw, taking 22d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "22d6",
				damage_type: "fire",
				range: 20,
				save: "Agility",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Agility saving throw or take 11d6 fire damage.",
			},
		],
	},
	{
		id: "anomaly-0224",
		name: "Celestial Demonic Knight",
		type: "Beast",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 245,
		hit_dice: "245 (29d8 + 114)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Stealth: 9,
		},
		image: "/generated/compendium/anomalies/anomaly-0224.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 8400,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 20,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 12,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 22d6 fire damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "22d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 18d6 acid damage.",
				type: "ranged",
				damage: "18d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 22d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "22d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 11d6 poison damage.",
			},
		],
	},
	{
		id: "anomaly-0229",
		name: "Celestial Demonic Overlord",
		type: "anomaly",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 248,
		hit_dice: "248 (29d8 + 117)",
		ac: 17,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0229.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 15",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 8400,
		stats: {
			ability_scores: {
				strength: 22,
				agility: 18,
				vitality: 18,
				intelligence: 13,
				sense: 13,
				presence: 17,
			},
			speed: 30,
			challenge_rating: 12,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 10,
				Agility: 8,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 22d6 thunder damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "22d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 18d6 necrotic damage.",
				type: "ranged",
				damage: "18d6",
				damage_type: "necrotic",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 22d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "22d6",
				damage_type: "lightning",
				range: 20,
				save: "Strength",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 11d6 lightning damage.",
			},
		],
	},
	{
		id: "anomaly-0234",
		name: "Celestial Demonic Warlord",
		type: "Elemental",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 242,
		hit_dice: "242 (21d10 + 126)",
		ac: 17,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 5,
			Arcana: 5,
		},
		image: "/generated/compendium/anomalies/anomaly-0234.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 15",
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
		xp: 8400,
		stats: {
			ability_scores: {
				strength: 18,
				agility: 20,
				vitality: 22,
				intelligence: 13,
				sense: 13,
				presence: 13,
			},
			speed: 30,
			challenge_rating: 12,
			proficiency_bonus: 4,
			saving_throws: {
				Vitality: 10,
				Agility: 9,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 22d6 lightning damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "22d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Vitality saving throw or take 18d6 force damage.",
				type: "ranged",
				damage: "18d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Vitality saving throw, taking 22d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "22d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +8 to hit, range 60 ft., one target. Hit: 11d6 force damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Vitality saving throw or take 11d6 cold damage.",
			},
		],
	},
	{
		id: "anomaly-0239",
		name: "Celestial Demonic Berserker",
		type: "Dragon",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 245,
		hit_dice: "245 (20d10 + 135)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 5,
			Intimidation: 6,
		},
		image: "/generated/compendium/anomalies/anomaly-0239.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This A rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 15",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 8400,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 18,
				vitality: 24,
				intelligence: 13,
				sense: 13,
				presence: 15,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 12,
			proficiency_bonus: 4,
			saving_throws: {
				Strength: 11,
				Vitality: 11,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 22d6 poison damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "22d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 17 Strength saving throw or take 18d6 cold damage.",
				type: "ranged",
				damage: "18d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 17,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 17 Strength saving throw, taking 22d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "22d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 17,
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
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 17 Strength saving throw or take 11d6 psychic damage.",
			},
		],
	},
	{
		id: "anomaly-0704",
		name: "The Hollowed",
		type: "Apex Fragment (Worn Dead)",
		rank: "A",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral evil",
		hp: 228,
		hit_dice: "228 (24d10 + 96)",
		ac: 17,
		ac_source: "the dark clings to it",
		skills: { Stealth: 12, Perception: 9 },
		description:
			"Deep in the Gloamreach, where the Quiet's attention pools, the worn dead stop being lures and become something closer to the thing that wears them — a hollowed apex-fragment that hunts like the Quiet in miniature. The Hollowed is the hardest thing the party can actually kill, and the surest sign they are nearing where the means to end the Quiet might be found.",
		abilities: ["Echo of the Quiet", "Drawn to Power"],
		weaknesses: ["Massed light and silence together", "A true thing it cannot abide"],
		senses: "blindsight 90 ft., tremorsense 60 ft., passive Perception 19",
		languages: "the stolen voices of many dead",
		damage_vulnerabilities: [],
		damage_resistances: ["necrotic", "psychic", "bludgeoning, piercing, and slashing from nonmagical attacks"],
		damage_immunities: ["poison"],
		condition_immunities: ["blinded", "charmed", "exhaustion", "frightened", "poisoned"],
		xp: 7200,
		stats: {
			ability_scores: { strength: 20, agility: 18, vitality: 18, intelligence: 13, sense: 20, presence: 18 },
			speed: 40,
			extra_speeds: { climb: 30 },
			challenge_rating: 11,
			proficiency_bonus: 4,
			saving_throws: { Agility: 8, Vitality: 8, Sense: 9 },
		},
		traits: [
			{
				name: "Echo of the Quiet",
				description:
					"The Hollowed is almost never seen until it strikes; it has advantage on Stealth and cannot be tracked by sound. The first time it appears in a scene, each creature that can sense it must succeed on a DC 16 Sense saving throw or gain a point of Dread.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Drawn to Power",
				description:
					"The Hollowed has advantage on attacks against any creature that used an Awakened ability, Sigil, or technique since the Hollowed's last turn. Using Essence near it is, as ever, a mistake.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Legendary Resistance (1/Day)",
				description:
					"If the Hollowed fails a saving throw, it can choose to succeed instead.",
				action: "passive",
				frequency: "1/day",
			},
		],
		actions: [
			{
				name: "Multiattack",
				description: "The Hollowed makes two Claim attacks.",
				type: "special",
				usage: "at-will",
			},
			{
				name: "Claim",
				description:
					"Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 27 (4d10 + 5) necrotic damage, and the target cannot regain hit points until the start of its next turn.",
				type: "melee",
				attack_bonus: 8,
				damage: "4d10",
				damage_type: "necrotic",
				range: 10,
				usage: "at-will",
			},
			{
				name: "Into the Dark",
				description:
					"Recharge 5-6. The light gutters out in a 20-foot radius around the Hollowed. Each creature in it must make a DC 17 Sense saving throw, taking 36 (8d8) psychic damage and being unable to see beyond 5 feet until the end of its next turn on a failure, or half as much damage on a success.",
				type: "special",
				damage: "8d8",
				damage_type: "psychic",
				range: 20,
				save: "Sense",
				dc: 17,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Slip the Light",
				description:
					"When a creature the Hollowed can see ends its turn in bright light, the Hollowed may move up to its speed toward the nearest darkness without provoking opportunity attacks.",
			},
		],
	},
];
