// S-Rank Anomalies — reconstructed to complete 5e statblocks
// (Phase D). CR/HP/attack/DC/XP derived from monster5eTable.ts so a single
// rank-appropriate anomaly stays within a party-of-4 Deadly budget.

export const anomalies_s = [
	{
		id: "anomaly-0005",
		name: "Eternal Celestial Guardian",
		type: "Dragon",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 255,
		hit_dice: "255 (19d10 + 150)",
		ac: 20,
		ac_source: "natural armor",
		skills: {
			Perception: 7,
			Intimidation: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-eternal-celestial-guardian-159jka.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 17",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 10000,
		stats: {
			ability_scores: {
				strength: 26,
				agility: 20,
				vitality: 26,
				intelligence: 14,
				sense: 14,
				presence: 16,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 13,
			proficiency_bonus: 5,
			saving_throws: {
				Strength: 13,
				Vitality: 13,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 24d6 cold damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "24d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Strength saving throw or take 19d6 fire damage.",
				type: "ranged",
				damage: "19d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Strength saving throw, taking 24d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "24d6",
				damage_type: "acid",
				range: 20,
				save: "Strength",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Strength saving throw or take 12d6 acid damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the cold resonance of its lair; difficult terrain laced with cold energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, cold phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0010",
		name: "Eternal Celestial Serpent",
		type: "Anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 264,
		hit_dice: "264 (23d8 + 160)",
		ac: 18,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 8,
			Arcana: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-eternal-celestial-serpent-6liz0p.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 18",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 10000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 20,
				vitality: 24,
				intelligence: 14,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 13,
			proficiency_bonus: 5,
			saving_throws: {
				Vitality: 12,
				Strength: 10,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 24d6 acid damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "24d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Vitality saving throw or take 19d6 poison damage.",
				type: "ranged",
				damage: "19d6",
				damage_type: "poison",
				range: 60,
				save: "Vitality",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Vitality saving throw, taking 24d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "24d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 18,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in poison energy: the attacker must succeed on a DC 18 Vitality saving throw or take 10d6 poison damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Vitality saving throw or take 12d6 cold damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the acid resonance of its lair; difficult terrain laced with acid energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, acid phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0015",
		name: "Eternal Celestial Phoenix",
		type: "Humanoid",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 252,
		hit_dice: "252 (27d8 + 130)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Deception: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-eternal-celestial-phoenix-1epks7.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 18",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 10000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 20,
				intelligence: 16,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 13,
			proficiency_bonus: 5,
			saving_throws: {
				Agility: 11,
				Strength: 10,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 24d6 necrotic damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "24d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Agility saving throw or take 19d6 lightning damage.",
				type: "ranged",
				damage: "19d6",
				damage_type: "lightning",
				range: 60,
				save: "Agility",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Agility saving throw, taking 24d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "24d6",
				damage_type: "force",
				range: 20,
				save: "Agility",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Agility saving throw or take 12d6 force damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the necrotic resonance of its lair; difficult terrain laced with necrotic energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, necrotic phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0020",
		name: "Eternal Celestial Herald",
		type: "Beast",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 261,
		hit_dice: "261 (27d8 + 139)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 7,
			Stealth: 11,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-eternal-celestial-herald-16pj6q.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 17",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 10000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 22,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 13,
			proficiency_bonus: 5,
			saving_throws: {
				Strength: 12,
				Agility: 11,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 24d6 force damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "24d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Strength saving throw or take 19d6 cold damage.",
				type: "ranged",
				damage: "19d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Strength saving throw, taking 24d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "24d6",
				damage_type: "fire",
				range: 20,
				save: "Strength",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Strength saving throw or take 12d6 fire damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the force resonance of its lair; difficult terrain laced with force energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, force phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0025",
		name: "Corrupted Celestial Guardian",
		type: "anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 279,
		hit_dice: "279 (29d8 + 148)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-corrupted-celestial-guardian-mfwlwd.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 17",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 11500,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 20,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 18,
			},
			speed: 30,
			challenge_rating: 14,
			proficiency_bonus: 5,
			saving_throws: {
				Strength: 12,
				Agility: 10,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 26d6 cold damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "26d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Strength saving throw or take 21d6 psychic damage.",
				type: "ranged",
				damage: "21d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Strength saving throw, taking 26d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "26d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 18,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Strength saving throw or take 13d6 thunder damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the cold resonance of its lair; difficult terrain laced with cold energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, cold phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0030",
		name: "Corrupted Celestial Serpent",
		type: "Elemental",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 273,
		hit_dice: "273 (22d10 + 152)",
		ac: 18,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 7,
			Arcana: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-corrupted-celestial-serpent-kv6kz7.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 17",
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
		xp: 11500,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 24,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 14,
			proficiency_bonus: 5,
			saving_throws: {
				Vitality: 12,
				Agility: 11,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 26d6 thunder damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "26d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Vitality saving throw or take 21d6 necrotic damage.",
				type: "ranged",
				damage: "21d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Vitality saving throw, taking 26d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "26d6",
				damage_type: "lightning",
				range: 20,
				save: "Vitality",
				dc: 18,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Necrotic Mote",
				description:
					"Ranged Spell Attack: +8 to hit, range 60 ft., one target. Hit: 13d6 necrotic damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Vitality saving throw or take 13d6 lightning damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the thunder resonance of its lair; difficult terrain laced with thunder energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, thunder phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0035",
		name: "Corrupted Celestial Phoenix",
		type: "Dragon",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 276,
		hit_dice: "276 (20d10 + 166)",
		ac: 20,
		ac_source: "natural armor",
		skills: {
			Perception: 7,
			Intimidation: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-corrupted-celestial-phoenix-1ikjo5.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 17",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 11500,
		stats: {
			ability_scores: {
				strength: 26,
				agility: 20,
				vitality: 26,
				intelligence: 14,
				sense: 14,
				presence: 16,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 14,
			proficiency_bonus: 5,
			saving_throws: {
				Strength: 13,
				Vitality: 13,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 26d6 fire damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "26d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Strength saving throw or take 21d6 acid damage.",
				type: "ranged",
				damage: "21d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Strength saving throw, taking 26d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "26d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Strength saving throw or take 13d6 poison damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the fire resonance of its lair; difficult terrain laced with fire energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, fire phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0040",
		name: "Corrupted Celestial Herald",
		type: "Anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 270,
		hit_dice: "270 (23d8 + 166)",
		ac: 18,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 8,
			Arcana: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-corrupted-celestial-herald-1quk3g.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 18",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 11500,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 20,
				vitality: 24,
				intelligence: 14,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 14,
			proficiency_bonus: 5,
			saving_throws: {
				Vitality: 12,
				Strength: 10,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 26d6 poison damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "26d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Vitality saving throw or take 21d6 cold damage.",
				type: "ranged",
				damage: "21d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Vitality saving throw, taking 26d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "26d6",
				damage_type: "psychic",
				range: 20,
				save: "Vitality",
				dc: 18,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in cold energy: the attacker must succeed on a DC 18 Vitality saving throw or take 10d6 cold damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Vitality saving throw or take 13d6 psychic damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the poison resonance of its lair; difficult terrain laced with poison energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, poison phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0045",
		name: "Blessed Celestial Guardian",
		type: "Humanoid",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 273,
		hit_dice: "273 (29d8 + 142)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Deception: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-blessed-celestial-guardian-5sjdfb.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 18",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 11500,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 20,
				intelligence: 16,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 14,
			proficiency_bonus: 5,
			saving_throws: {
				Agility: 11,
				Strength: 10,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 26d6 lightning damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "26d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Agility saving throw or take 21d6 force damage.",
				type: "ranged",
				damage: "21d6",
				damage_type: "force",
				range: 60,
				save: "Agility",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Agility saving throw, taking 26d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "26d6",
				damage_type: "cold",
				range: 20,
				save: "Agility",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Agility saving throw or take 13d6 cold damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the lightning resonance of its lair; difficult terrain laced with lightning energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, lightning phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0050",
		name: "Blessed Celestial Serpent",
		type: "Beast",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 267,
		hit_dice: "267 (28d8 + 141)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 7,
			Stealth: 11,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-blessed-celestial-serpent-12qc34.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 17",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 11500,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 22,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 14,
			proficiency_bonus: 5,
			saving_throws: {
				Strength: 12,
				Agility: 11,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 26d6 cold damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "26d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Strength saving throw or take 21d6 fire damage.",
				type: "ranged",
				damage: "21d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Strength saving throw, taking 26d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "26d6",
				damage_type: "acid",
				range: 20,
				save: "Strength",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Strength saving throw or take 13d6 acid damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the cold resonance of its lair; difficult terrain laced with cold energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, cold phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0055",
		name: "Blessed Celestial Phoenix",
		type: "anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 285,
		hit_dice: "285 (30d8 + 150)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-blessed-celestial-phoenix-1mzyny.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 17",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 13000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 20,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 18,
			},
			speed: 30,
			challenge_rating: 15,
			proficiency_bonus: 5,
			saving_throws: {
				Strength: 12,
				Agility: 10,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 27d6 psychic damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "27d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Strength saving throw or take 22d6 thunder damage.",
				type: "ranged",
				damage: "22d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Strength saving throw, taking 27d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "27d6",
				damage_type: "necrotic",
				range: 20,
				save: "Strength",
				dc: 18,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Strength saving throw or take 14d6 necrotic damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the psychic resonance of its lair; difficult terrain laced with psychic energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, psychic phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0060",
		name: "Blessed Celestial Herald",
		type: "Elemental",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 294,
		hit_dice: "294 (24d10 + 162)",
		ac: 18,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 7,
			Arcana: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-blessed-celestial-herald-1ux3cw.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 17",
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
		xp: 13000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 24,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 15,
			proficiency_bonus: 5,
			saving_throws: {
				Vitality: 12,
				Agility: 11,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 27d6 necrotic damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "27d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Vitality saving throw or take 22d6 lightning damage.",
				type: "ranged",
				damage: "22d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Vitality saving throw, taking 27d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "27d6",
				damage_type: "force",
				range: 20,
				save: "Vitality",
				dc: 18,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Lightning Mote",
				description:
					"Ranged Spell Attack: +8 to hit, range 60 ft., one target. Hit: 14d6 lightning damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Vitality saving throw or take 14d6 force damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the necrotic resonance of its lair; difficult terrain laced with necrotic energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, necrotic phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0065",
		name: "Cursed Celestial Guardian",
		type: "Dragon",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 282,
		hit_dice: "282 (21d10 + 166)",
		ac: 20,
		ac_source: "natural armor",
		skills: {
			Perception: 7,
			Intimidation: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-cursed-celestial-guardian-itup2x.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 17",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 13000,
		stats: {
			ability_scores: {
				strength: 26,
				agility: 20,
				vitality: 26,
				intelligence: 14,
				sense: 14,
				presence: 16,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 15,
			proficiency_bonus: 5,
			saving_throws: {
				Strength: 13,
				Vitality: 13,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 27d6 acid damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "27d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Strength saving throw or take 22d6 poison damage.",
				type: "ranged",
				damage: "22d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Strength saving throw, taking 27d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "27d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Strength saving throw or take 14d6 cold damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the acid resonance of its lair; difficult terrain laced with acid energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, acid phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0070",
		name: "Cursed Celestial Serpent",
		type: "Anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 291,
		hit_dice: "291 (25d8 + 178)",
		ac: 18,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 8,
			Arcana: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-cursed-celestial-serpent-1jxirn.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 18",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 13000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 20,
				vitality: 24,
				intelligence: 14,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 15,
			proficiency_bonus: 5,
			saving_throws: {
				Vitality: 12,
				Strength: 10,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 27d6 cold damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "27d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Vitality saving throw or take 22d6 psychic damage.",
				type: "ranged",
				damage: "22d6",
				damage_type: "psychic",
				range: 60,
				save: "Vitality",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Vitality saving throw, taking 27d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "27d6",
				damage_type: "thunder",
				range: 20,
				save: "Vitality",
				dc: 18,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in psychic energy: the attacker must succeed on a DC 18 Vitality saving throw or take 11d6 psychic damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Vitality saving throw or take 14d6 thunder damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the cold resonance of its lair; difficult terrain laced with cold energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, cold phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0075",
		name: "Cursed Celestial Phoenix",
		type: "Humanoid",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 294,
		hit_dice: "294 (31d8 + 154)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Deception: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-cursed-celestial-phoenix-7ybjbs.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 18",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 13000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 20,
				intelligence: 16,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 15,
			proficiency_bonus: 5,
			saving_throws: {
				Agility: 11,
				Strength: 10,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 27d6 force damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "27d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Agility saving throw or take 22d6 cold damage.",
				type: "ranged",
				damage: "22d6",
				damage_type: "cold",
				range: 60,
				save: "Agility",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Agility saving throw, taking 27d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "27d6",
				damage_type: "fire",
				range: 20,
				save: "Agility",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Agility saving throw or take 14d6 fire damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the force resonance of its lair; difficult terrain laced with force energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, force phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0080",
		name: "Cursed Celestial Herald",
		type: "Beast",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 288,
		hit_dice: "288 (30d8 + 153)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 7,
			Stealth: 11,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-cursed-celestial-herald-12a46x.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 17",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 13000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 22,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 15,
			proficiency_bonus: 5,
			saving_throws: {
				Strength: 12,
				Agility: 11,
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
					"Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 27d6 fire damage.",
				type: "melee",
				attack_bonus: 8,
				damage: "27d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Strength saving throw or take 22d6 acid damage.",
				type: "ranged",
				damage: "22d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Strength saving throw, taking 27d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "27d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Strength saving throw or take 14d6 poison damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the fire resonance of its lair; difficult terrain laced with fire energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, fire phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0085",
		name: "Ancient Celestial Guardian",
		type: "anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 306,
		hit_dice: "306 (32d8 + 162)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-ancient-celestial-guardian-4kr3qr.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 17",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 15000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 20,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 18,
			},
			speed: 30,
			challenge_rating: 16,
			proficiency_bonus: 5,
			saving_throws: {
				Strength: 12,
				Agility: 10,
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
					"Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 29d6 thunder damage.",
				type: "melee",
				attack_bonus: 9,
				damage: "29d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Strength saving throw or take 23d6 necrotic damage.",
				type: "ranged",
				damage: "23d6",
				damage_type: "necrotic",
				range: 60,
				save: "Strength",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Strength saving throw, taking 29d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "29d6",
				damage_type: "lightning",
				range: 20,
				save: "Strength",
				dc: 18,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Strength saving throw or take 15d6 lightning damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the thunder resonance of its lair; difficult terrain laced with thunder energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, thunder phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0090",
		name: "Ancient Celestial Serpent",
		type: "Elemental",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 300,
		hit_dice: "300 (24d10 + 168)",
		ac: 18,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 7,
			Arcana: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-ancient-celestial-serpent-1xowx2.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 17",
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
		xp: 15000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 24,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 16,
			proficiency_bonus: 5,
			saving_throws: {
				Vitality: 12,
				Agility: 11,
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
					"Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 29d6 lightning damage.",
				type: "melee",
				attack_bonus: 9,
				damage: "29d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Vitality saving throw or take 23d6 force damage.",
				type: "ranged",
				damage: "23d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Vitality saving throw, taking 29d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "29d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 18,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +9 to hit, range 60 ft., one target. Hit: 15d6 force damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Vitality saving throw or take 15d6 cold damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the lightning resonance of its lair; difficult terrain laced with lightning energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, lightning phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0095",
		name: "Ancient Celestial Phoenix",
		type: "Dragon",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 303,
		hit_dice: "303 (22d10 + 182)",
		ac: 20,
		ac_source: "natural armor",
		skills: {
			Perception: 7,
			Intimidation: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-ancient-celestial-phoenix-xds61m.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 17",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 15000,
		stats: {
			ability_scores: {
				strength: 26,
				agility: 20,
				vitality: 26,
				intelligence: 14,
				sense: 14,
				presence: 16,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 16,
			proficiency_bonus: 5,
			saving_throws: {
				Strength: 13,
				Vitality: 13,
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
					"Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 29d6 poison damage.",
				type: "melee",
				attack_bonus: 9,
				damage: "29d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Strength saving throw or take 23d6 cold damage.",
				type: "ranged",
				damage: "23d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Strength saving throw, taking 29d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "29d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Strength saving throw or take 15d6 psychic damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the poison resonance of its lair; difficult terrain laced with poison energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, poison phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0100",
		name: "Ancient Celestial Herald",
		type: "Anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 303,
		hit_dice: "303 (26d8 + 186)",
		ac: 18,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 8,
			Arcana: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-ancient-celestial-herald-1wwup2.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 18",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 15000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 20,
				vitality: 24,
				intelligence: 14,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 16,
			proficiency_bonus: 5,
			saving_throws: {
				Vitality: 12,
				Strength: 10,
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
					"Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 29d6 acid damage.",
				type: "melee",
				attack_bonus: 9,
				damage: "29d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Vitality saving throw or take 23d6 poison damage.",
				type: "ranged",
				damage: "23d6",
				damage_type: "poison",
				range: 60,
				save: "Vitality",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Vitality saving throw, taking 29d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "29d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 18,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in poison energy: the attacker must succeed on a DC 18 Vitality saving throw or take 12d6 poison damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Vitality saving throw or take 15d6 cold damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the acid resonance of its lair; difficult terrain laced with acid energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, acid phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0105",
		name: "Primordial Celestial Guardian",
		type: "Humanoid",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 306,
		hit_dice: "306 (32d8 + 162)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Deception: 7,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-primordial-celestial-guardian-1xua91.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 18",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["necrotic"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 15000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 20,
				intelligence: 16,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 16,
			proficiency_bonus: 5,
			saving_throws: {
				Agility: 11,
				Strength: 10,
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
					"Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 29d6 necrotic damage.",
				type: "melee",
				attack_bonus: 9,
				damage: "29d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Agility saving throw or take 23d6 lightning damage.",
				type: "ranged",
				damage: "23d6",
				damage_type: "lightning",
				range: 60,
				save: "Agility",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Agility saving throw, taking 29d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "29d6",
				damage_type: "force",
				range: 20,
				save: "Agility",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Agility saving throw or take 15d6 force damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the necrotic resonance of its lair; difficult terrain laced with necrotic energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, necrotic phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0110",
		name: "Primordial Celestial Serpent",
		type: "Beast",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 300,
		hit_dice: "300 (32d8 + 156)",
		ac: 18,
		ac_source: "natural armor",
		skills: {
			Perception: 7,
			Stealth: 11,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-primordial-celestial-serpent-1grmfe.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 17",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 15000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 22,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 16,
			proficiency_bonus: 5,
			saving_throws: {
				Strength: 12,
				Agility: 11,
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
					"Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 29d6 force damage.",
				type: "melee",
				attack_bonus: 9,
				damage: "29d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 18 Strength saving throw or take 23d6 cold damage.",
				type: "ranged",
				damage: "23d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 18,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 18 Strength saving throw, taking 29d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "29d6",
				damage_type: "fire",
				range: 20,
				save: "Strength",
				dc: 18,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 18 Strength saving throw or take 15d6 fire damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the force resonance of its lair; difficult terrain laced with force energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, force phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0115",
		name: "Primordial Celestial Phoenix",
		type: "anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 318,
		hit_dice: "318 (33d8 + 169)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-primordial-celestial-phoenix-s4lht5.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 18",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 18000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 20,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 18,
			},
			speed: 30,
			challenge_rating: 17,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 13,
				Agility: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 31d6 cold damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "31d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 25d6 psychic damage.",
				type: "ranged",
				damage: "25d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 31d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "31d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 15d6 thunder damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the cold resonance of its lair; difficult terrain laced with cold energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, cold phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0120",
		name: "Primordial Celestial Herald",
		type: "Elemental",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 312,
		hit_dice: "312 (25d10 + 174)",
		ac: 19,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 8,
			Arcana: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-primordial-celestial-herald-1lh8ph.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 18",
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
		xp: 18000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 24,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 17,
			proficiency_bonus: 6,
			saving_throws: {
				Vitality: 13,
				Agility: 12,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 31d6 thunder damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "31d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Vitality saving throw or take 25d6 necrotic damage.",
				type: "ranged",
				damage: "25d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Vitality saving throw, taking 31d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "31d6",
				damage_type: "lightning",
				range: 20,
				save: "Vitality",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Necrotic Mote",
				description:
					"Ranged Spell Attack: +10 to hit, range 60 ft., one target. Hit: 15d6 necrotic damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Vitality saving throw or take 15d6 lightning damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the thunder resonance of its lair; difficult terrain laced with thunder energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, thunder phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0125",
		name: "Supreme Celestial Guardian",
		type: "Dragon",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 315,
		hit_dice: "315 (23d10 + 188)",
		ac: 21,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Intimidation: 9,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-supreme-celestial-guardian-b7i2m.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 18",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 18000,
		stats: {
			ability_scores: {
				strength: 26,
				agility: 20,
				vitality: 26,
				intelligence: 14,
				sense: 14,
				presence: 16,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 17,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 14,
				Vitality: 14,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 31d6 fire damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "31d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 25d6 acid damage.",
				type: "ranged",
				damage: "25d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 31d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "31d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 15d6 poison damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the fire resonance of its lair; difficult terrain laced with fire energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, fire phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0130",
		name: "Supreme Celestial Serpent",
		type: "Anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 324,
		hit_dice: "324 (28d8 + 198)",
		ac: 19,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 9,
			Arcana: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-supreme-celestial-serpent-ptm94o.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 19",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 18000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 20,
				vitality: 24,
				intelligence: 14,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 17,
			proficiency_bonus: 6,
			saving_throws: {
				Vitality: 13,
				Strength: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 31d6 poison damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "31d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Vitality saving throw or take 25d6 cold damage.",
				type: "ranged",
				damage: "25d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Vitality saving throw, taking 31d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "31d6",
				damage_type: "psychic",
				range: 20,
				save: "Vitality",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in cold energy: the attacker must succeed on a DC 19 Vitality saving throw or take 12d6 cold damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Vitality saving throw or take 15d6 psychic damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the poison resonance of its lair; difficult terrain laced with poison energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, poison phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0135",
		name: "Supreme Celestial Phoenix",
		type: "Humanoid",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 312,
		hit_dice: "312 (33d8 + 163)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 9,
			Deception: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-supreme-celestial-phoenix-1ygt4m.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 19",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 18000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 20,
				intelligence: 16,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 17,
			proficiency_bonus: 6,
			saving_throws: {
				Agility: 12,
				Strength: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 31d6 lightning damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "31d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Agility saving throw or take 25d6 force damage.",
				type: "ranged",
				damage: "25d6",
				damage_type: "force",
				range: 60,
				save: "Agility",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Agility saving throw, taking 31d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "31d6",
				damage_type: "cold",
				range: 20,
				save: "Agility",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Agility saving throw or take 15d6 cold damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the lightning resonance of its lair; difficult terrain laced with lightning energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, lightning phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0140",
		name: "Supreme Celestial Herald",
		type: "Beast",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 321,
		hit_dice: "321 (34d8 + 168)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Stealth: 12,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-supreme-celestial-herald-1nozyw.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 18",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 18000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 22,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 17,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 13,
				Agility: 12,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 31d6 cold damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "31d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 25d6 fire damage.",
				type: "ranged",
				damage: "25d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 31d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "31d6",
				damage_type: "acid",
				range: 20,
				save: "Strength",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 15d6 acid damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the cold resonance of its lair; difficult terrain laced with cold energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, cold phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0145",
		name: "Legendary Celestial Guardian",
		type: "anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 324,
		hit_dice: "324 (34d8 + 171)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-legendary-celestial-guardian-dlm9rw.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 18",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 18000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 20,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 18,
			},
			speed: 30,
			challenge_rating: 17,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 13,
				Agility: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 31d6 psychic damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "31d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 25d6 thunder damage.",
				type: "ranged",
				damage: "25d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 31d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "31d6",
				damage_type: "necrotic",
				range: 20,
				save: "Strength",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 15d6 necrotic damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the psychic resonance of its lair; difficult terrain laced with psychic energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, psychic phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0150",
		name: "Legendary Celestial Serpent",
		type: "Elemental",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 333,
		hit_dice: "333 (27d10 + 184)",
		ac: 19,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 8,
			Arcana: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-legendary-celestial-serpent-1j1w2t.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 18",
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
		xp: 20000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 24,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 18,
			proficiency_bonus: 6,
			saving_throws: {
				Vitality: 13,
				Agility: 12,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 33d6 necrotic damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "33d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Vitality saving throw or take 26d6 lightning damage.",
				type: "ranged",
				damage: "26d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Vitality saving throw, taking 33d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "33d6",
				damage_type: "force",
				range: 20,
				save: "Vitality",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Lightning Mote",
				description:
					"Ranged Spell Attack: +10 to hit, range 60 ft., one target. Hit: 16d6 lightning damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Vitality saving throw or take 16d6 force damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the necrotic resonance of its lair; difficult terrain laced with necrotic energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, necrotic phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0155",
		name: "Legendary Celestial Phoenix",
		type: "Dragon",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 336,
		hit_dice: "336 (25d10 + 198)",
		ac: 21,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Intimidation: 9,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-legendary-celestial-phoenix-156t89.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 18",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["acid"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 20000,
		stats: {
			ability_scores: {
				strength: 26,
				agility: 20,
				vitality: 26,
				intelligence: 14,
				sense: 14,
				presence: 16,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 18,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 14,
				Vitality: 14,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 33d6 acid damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "33d6",
				damage_type: "acid",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 26d6 poison damage.",
				type: "ranged",
				damage: "26d6",
				damage_type: "poison",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 33d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "33d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 16d6 cold damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the acid resonance of its lair; difficult terrain laced with acid energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, acid phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0160",
		name: "Legendary Celestial Herald",
		type: "Anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 330,
		hit_dice: "330 (29d8 + 199)",
		ac: 19,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 9,
			Arcana: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-legendary-celestial-herald-lw1kc9.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 19",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 20000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 20,
				vitality: 24,
				intelligence: 14,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 18,
			proficiency_bonus: 6,
			saving_throws: {
				Vitality: 13,
				Strength: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 33d6 cold damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "33d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Vitality saving throw or take 26d6 psychic damage.",
				type: "ranged",
				damage: "26d6",
				damage_type: "psychic",
				range: 60,
				save: "Vitality",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Vitality saving throw, taking 33d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "33d6",
				damage_type: "thunder",
				range: 20,
				save: "Vitality",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in psychic energy: the attacker must succeed on a DC 19 Vitality saving throw or take 13d6 psychic damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Vitality saving throw or take 16d6 thunder damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the cold resonance of its lair; difficult terrain laced with cold energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, cold phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0165",
		name: "Mythic Celestial Guardian",
		type: "Humanoid",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 333,
		hit_dice: "333 (35d8 + 175)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 9,
			Deception: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-mythic-celestial-guardian-1u4ovc.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 30 ft., passive Perception 19",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 20000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 20,
				intelligence: 16,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 18,
			proficiency_bonus: 6,
			saving_throws: {
				Agility: 12,
				Strength: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 33d6 force damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "33d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Agility saving throw or take 26d6 cold damage.",
				type: "ranged",
				damage: "26d6",
				damage_type: "cold",
				range: 60,
				save: "Agility",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Agility saving throw, taking 33d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "33d6",
				damage_type: "fire",
				range: 20,
				save: "Agility",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Agility saving throw or take 16d6 fire damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the force resonance of its lair; difficult terrain laced with force energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, force phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0170",
		name: "Mythic Celestial Serpent",
		type: "Beast",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 327,
		hit_dice: "327 (34d8 + 174)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Stealth: 12,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-mythic-celestial-serpent-1ju77o.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 18",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 20000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 22,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 18,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 13,
				Agility: 12,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 33d6 fire damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "33d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 26d6 acid damage.",
				type: "ranged",
				damage: "26d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 33d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "33d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 16d6 poison damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the fire resonance of its lair; difficult terrain laced with fire energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, fire phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0175",
		name: "Mythic Celestial Phoenix",
		type: "anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 330,
		hit_dice: "330 (35d8 + 172)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-mythic-celestial-phoenix-158jvs.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 18",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["thunder"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 20000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 20,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 18,
			},
			speed: 30,
			challenge_rating: 18,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 13,
				Agility: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 33d6 thunder damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "33d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 26d6 necrotic damage.",
				type: "ranged",
				damage: "26d6",
				damage_type: "necrotic",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 33d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "33d6",
				damage_type: "lightning",
				range: 20,
				save: "Strength",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 16d6 lightning damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the thunder resonance of its lair; difficult terrain laced with thunder energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, thunder phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0180",
		name: "Mythic Celestial Herald",
		type: "Elemental",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 354,
		hit_dice: "354 (28d10 + 200)",
		ac: 19,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 8,
			Arcana: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-mythic-celestial-herald-xsxnxb.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 18",
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
		xp: 22000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 24,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 19,
			proficiency_bonus: 6,
			saving_throws: {
				Vitality: 13,
				Agility: 12,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 34d6 lightning damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "34d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Vitality saving throw or take 27d6 force damage.",
				type: "ranged",
				damage: "27d6",
				damage_type: "force",
				range: 60,
				save: "Vitality",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Vitality saving throw, taking 34d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "34d6",
				damage_type: "cold",
				range: 20,
				save: "Vitality",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +10 to hit, range 60 ft., one target. Hit: 17d6 force damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Vitality saving throw or take 17d6 cold damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the lightning resonance of its lair; difficult terrain laced with lightning energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, lightning phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0185",
		name: "Divine Celestial Guardian",
		type: "Dragon",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 342,
		hit_dice: "342 (25d10 + 204)",
		ac: 21,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Intimidation: 9,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-divine-celestial-guardian-145c8d.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 18",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 22000,
		stats: {
			ability_scores: {
				strength: 26,
				agility: 20,
				vitality: 26,
				intelligence: 14,
				sense: 14,
				presence: 16,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 19,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 14,
				Vitality: 14,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 34d6 poison damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "34d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 27d6 cold damage.",
				type: "ranged",
				damage: "27d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 34d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "34d6",
				damage_type: "psychic",
				range: 20,
				save: "Strength",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 17d6 psychic damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the poison resonance of its lair; difficult terrain laced with poison energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, poison phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0190",
		name: "Divine Celestial Serpent",
		type: "Anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 351,
		hit_dice: "351 (31d8 + 211)",
		ac: 19,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 9,
			Arcana: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-divine-celestial-serpent-qoa0q.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 19",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 22000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 20,
				vitality: 24,
				intelligence: 14,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 19,
			proficiency_bonus: 6,
			saving_throws: {
				Vitality: 13,
				Strength: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 34d6 psychic damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "34d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Vitality saving throw or take 27d6 thunder damage.",
				type: "ranged",
				damage: "27d6",
				damage_type: "thunder",
				range: 60,
				save: "Vitality",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Vitality saving throw, taking 34d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "34d6",
				damage_type: "necrotic",
				range: 20,
				save: "Vitality",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in thunder energy: the attacker must succeed on a DC 19 Vitality saving throw or take 14d6 thunder damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Vitality saving throw or take 17d6 necrotic damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the psychic resonance of its lair; difficult terrain laced with psychic energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, psychic phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0195",
		name: "Divine Celestial Phoenix",
		type: "Humanoid",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 354,
		hit_dice: "354 (37d8 + 187)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 9,
			Deception: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-divine-celestial-phoenix-6cfc7l.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 19",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 22000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 20,
				intelligence: 16,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 19,
			proficiency_bonus: 6,
			saving_throws: {
				Agility: 12,
				Strength: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 34d6 cold damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "34d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Agility saving throw or take 27d6 fire damage.",
				type: "ranged",
				damage: "27d6",
				damage_type: "fire",
				range: 60,
				save: "Agility",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Agility saving throw, taking 34d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "34d6",
				damage_type: "acid",
				range: 20,
				save: "Agility",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Agility saving throw or take 17d6 acid damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the cold resonance of its lair; difficult terrain laced with cold energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, cold phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0200",
		name: "Divine Celestial Herald",
		type: "Beast",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 354,
		hit_dice: "354 (37d8 + 187)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Stealth: 12,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-divine-celestial-herald-tkknc6.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 18",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["force"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 22000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 22,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 19,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 13,
				Agility: 12,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 34d6 force damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "34d6",
				damage_type: "force",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 27d6 cold damage.",
				type: "ranged",
				damage: "27d6",
				damage_type: "cold",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 34d6 fire damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "34d6",
				damage_type: "fire",
				range: 20,
				save: "Strength",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 17d6 fire damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the force resonance of its lair; difficult terrain laced with force energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, force phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0205",
		name: "Infernal Celestial Guardian",
		type: "anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 342,
		hit_dice: "342 (36d8 + 180)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-infernal-celestial-guardian-1lfjq4.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 18",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 22000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 20,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 18,
			},
			speed: 30,
			challenge_rating: 19,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 13,
				Agility: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 34d6 cold damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "34d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 27d6 psychic damage.",
				type: "ranged",
				damage: "27d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Cataclysm",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 34d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "34d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 17d6 thunder damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the cold resonance of its lair; difficult terrain laced with cold energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, cold phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0210",
		name: "Infernal Celestial Serpent",
		type: "Elemental",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 366,
		hit_dice: "366 (29d10 + 206)",
		ac: 19,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 8,
			Arcana: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-infernal-celestial-serpent-vd8jij.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 18",
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
		xp: 25000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 24,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 20,
			proficiency_bonus: 6,
			saving_throws: {
				Vitality: 13,
				Agility: 12,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 38d6 thunder damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "38d6",
				damage_type: "thunder",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Vitality saving throw or take 30d6 necrotic damage.",
				type: "ranged",
				damage: "30d6",
				damage_type: "necrotic",
				range: 60,
				save: "Vitality",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Vitality saving throw, taking 38d6 lightning damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "38d6",
				damage_type: "lightning",
				range: 20,
				save: "Vitality",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Necrotic Mote",
				description:
					"Ranged Spell Attack: +10 to hit, range 60 ft., one target. Hit: 19d6 necrotic damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Vitality saving throw or take 19d6 lightning damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the thunder resonance of its lair; difficult terrain laced with thunder energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, thunder phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0215",
		name: "Infernal Celestial Phoenix",
		type: "Dragon",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "chaotic evil",
		hp: 384,
		hit_dice: "384 (28d10 + 230)",
		ac: 21,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Intimidation: 9,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-infernal-celestial-phoenix-8zwvqc.webp",
		description:
			"A fearsome Dragon that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 120 ft., blindsight 30 ft., passive Perception 18",
		languages: "Common, Draconic",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: ["frightened"],
		xp: 25000,
		stats: {
			ability_scores: {
				strength: 26,
				agility: 20,
				vitality: 26,
				intelligence: 14,
				sense: 14,
				presence: 16,
			},
			speed: 30,
			extra_speeds: {
				fly: 80,
			},
			challenge_rating: 20,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 14,
				Vitality: 14,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 38d6 fire damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "38d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 30d6 acid damage.",
				type: "ranged",
				damage: "30d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 38d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "38d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 19d6 poison damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the fire resonance of its lair; difficult terrain laced with fire energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, fire phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0220",
		name: "Infernal Celestial Herald",
		type: "Anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 378,
		hit_dice: "378 (33d8 + 229)",
		ac: 19,
		ac_source: "unarmored (lattice ward)",
		skills: {
			Perception: 9,
			Arcana: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-infernal-celestial-herald-1e5733.webp",
		description:
			"A fearsome Anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 19",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["poison"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 25000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 20,
				vitality: 24,
				intelligence: 14,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 20,
			proficiency_bonus: 6,
			saving_throws: {
				Vitality: 13,
				Strength: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 38d6 poison damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "38d6",
				damage_type: "poison",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Vitality saving throw or take 30d6 cold damage.",
				type: "ranged",
				damage: "30d6",
				damage_type: "cold",
				range: 60,
				save: "Vitality",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Vitality saving throw, taking 38d6 psychic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "38d6",
				damage_type: "psychic",
				range: 20,
				save: "Vitality",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in cold energy: the attacker must succeed on a DC 19 Vitality saving throw or take 15d6 cold damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Vitality saving throw or take 19d6 psychic damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the poison resonance of its lair; difficult terrain laced with poison energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, poison phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0225",
		name: "Celestial Celestial Guardian",
		type: "Humanoid",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "any alignment",
		hp: 396,
		hit_dice: "396 (42d8 + 207)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 9,
			Deception: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-celestial-celestial-guardian-9875j7.webp",
		description:
			"A fearsome Humanoid that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 30 ft., passive Perception 19",
		languages: "Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 25000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 20,
				intelligence: 16,
				sense: 16,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 20,
			proficiency_bonus: 6,
			saving_throws: {
				Agility: 12,
				Strength: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 38d6 lightning damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "38d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Agility saving throw or take 30d6 force damage.",
				type: "ranged",
				damage: "30d6",
				damage_type: "force",
				range: 60,
				save: "Agility",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Agility saving throw, taking 38d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "38d6",
				damage_type: "cold",
				range: 20,
				save: "Agility",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Agility saving throw or take 19d6 cold damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the lightning resonance of its lair; difficult terrain laced with lightning energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, lightning phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0230",
		name: "Celestial Celestial Serpent",
		type: "Beast",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "unaligned",
		hp: 390,
		hit_dice: "390 (41d8 + 205)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
			Stealth: 12,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-celestial-celestial-serpent-1s6dfr.webp",
		description:
			"A fearsome Beast that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., passive Perception 18",
		languages: "—",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: [],
		xp: 25000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 22,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 20,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 13,
				Agility: 12,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 38d6 cold damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "38d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 30d6 fire damage.",
				type: "ranged",
				damage: "30d6",
				damage_type: "fire",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 38d6 acid damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "38d6",
				damage_type: "acid",
				range: 20,
				save: "Strength",
				dc: 19,
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
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 19d6 acid damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the cold resonance of its lair; difficult terrain laced with cold energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, cold phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0235",
		name: "Celestial Celestial Phoenix",
		type: "anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 363,
		hit_dice: "363 (38d8 + 192)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 8,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-celestial-celestial-phoenix-1cepxd.webp",
		description:
			"A fearsome anomaly that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar", "Demonic Rage"],
		weaknesses: ["Light"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 18",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["psychic"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 25000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 20,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 18,
			},
			speed: 30,
			challenge_rating: 20,
			proficiency_bonus: 6,
			saving_throws: {
				Strength: 13,
				Agility: 11,
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
					"Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 38d6 psychic damage.",
				type: "melee",
				attack_bonus: 10,
				damage: "38d6",
				damage_type: "psychic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 19 Strength saving throw or take 30d6 thunder damage.",
				type: "ranged",
				damage: "30d6",
				damage_type: "thunder",
				range: 60,
				save: "Strength",
				dc: 19,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 19 Strength saving throw, taking 38d6 necrotic damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "38d6",
				damage_type: "necrotic",
				range: 20,
				save: "Strength",
				dc: 19,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 19 Strength saving throw or take 19d6 necrotic damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the psychic resonance of its lair; difficult terrain laced with psychic energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, psychic phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0240",
		name: "Celestial Celestial Herald",
		type: "Elemental",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral",
		hp: 402,
		hit_dice: "402 (32d10 + 226)",
		ac: 19,
		ac_source: "unarmored (elemental form)",
		skills: {
			Perception: 9,
			Arcana: 9,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-celestial-celestial-herald-w58xp6.webp",
		description:
			"A fearsome Elemental that serves the shadow armies. This S rank anomaly possesses immense power and is a formidable opponent for even the most experienced ascendants.",
		abilities: ["Shadow Strike", "Void Blast", "Abyssal Roar"],
		weaknesses: ["Light", "Holy Damage"],
		senses: "darkvision 60 ft., passive Perception 19",
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
		xp: 33000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 22,
				vitality: 24,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 21,
			proficiency_bonus: 7,
			saving_throws: {
				Vitality: 14,
				Agility: 13,
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
					"Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 43d6 necrotic damage.",
				type: "melee",
				attack_bonus: 11,
				damage: "43d6",
				damage_type: "necrotic",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Blast",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 20 Vitality saving throw or take 34d6 lightning damage.",
				type: "ranged",
				damage: "34d6",
				damage_type: "lightning",
				range: 60,
				save: "Vitality",
				dc: 20,
				usage: "at-will",
			},
			{
				name: "Abyssal Roar",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 20 Vitality saving throw, taking 43d6 force damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "43d6",
				damage_type: "force",
				range: 20,
				save: "Vitality",
				dc: 20,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		bonus_actions: [
			{
				name: "Lightning Mote",
				description:
					"Ranged Spell Attack: +11 to hit, range 60 ft., one target. Hit: 21d6 lightning damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 20 Vitality saving throw or take 21d6 force damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the necrotic resonance of its lair; difficult terrain laced with necrotic energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, necrotic phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Shadow Strike attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Blast.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0601",
		name: "Eternal Shadow Overlord",
		type: "anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Medium",
		alignment: "chaotic evil",
		hp: 401,
		hit_dice: "401 (42d8 + 212)",
		ac: 19,
		ac_source: "natural armor",
		skills: {
			Perception: 9,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-eternal-shadow-overlord-su5yad.webp",
		description:
			"An eternal overlord of shadows that commands legions of darkness. This S rank anomaly possesses godlike power and threatens the very fabric of reality.",
		abilities: [
			"Eternal Shadow Dominion",
			"Void Reality Warp",
			"Abyssal God Strike",
		],
		weaknesses: ["Divine Light", "Celestial Power", "Holy Annihilation"],
		senses: "darkvision 60 ft., truesight 30 ft., passive Perception 19",
		languages: "telepathy 60 ft.",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["cold"],
		damage_immunities: [],
		condition_immunities: ["charmed"],
		xp: 33000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 20,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 18,
			},
			speed: 30,
			challenge_rating: 21,
			proficiency_bonus: 7,
			saving_throws: {
				Strength: 14,
				Agility: 12,
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
				name: "Eternal Shadow Dominion",
				description:
					"Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 43d6 cold damage.",
				type: "melee",
				attack_bonus: 11,
				damage: "43d6",
				damage_type: "cold",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Void Reality Warp",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 20 Strength saving throw or take 34d6 psychic damage.",
				type: "ranged",
				damage: "34d6",
				damage_type: "psychic",
				range: 60,
				save: "Strength",
				dc: 20,
				usage: "at-will",
			},
			{
				name: "Abyssal God Strike",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 20 Strength saving throw, taking 43d6 thunder damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "43d6",
				damage_type: "thunder",
				range: 20,
				save: "Strength",
				dc: 20,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 20 Strength saving throw or take 21d6 thunder damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the cold resonance of its lair; difficult terrain laced with cold energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, cold phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Eternal Shadow Dominion attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Void Reality Warp.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0602",
		name: "Void Titan Ascendant",
		type: "Titan",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Huge",
		alignment: "chaotic evil",
		hp: 415,
		hit_dice: "415 (29d12 + 226)",
		ac: 21,
		ac_source: "natural armor",
		skills: {
			Perception: 9,
			Athletics: 15,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-void-titan-ascendant-1dpw04.webp",
		description:
			"A titanic entity that has ascended beyond mortal comprehension. This S rank titan wields the power of the void itself.",
		abilities: ["Void Titan Slam", "Reality Shatter", "Abyssal Devastation"],
		weaknesses: ["Cosmic Light", "Divine Intervention", "Holy Transcendence"],
		senses: "truesight 60 ft., passive Perception 19",
		languages: "Giant, Common",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["fire"],
		damage_immunities: [],
		condition_immunities: ["frightened", "exhaustion"],
		xp: 33000,
		stats: {
			ability_scores: {
				strength: 26,
				agility: 20,
				vitality: 26,
				intelligence: 14,
				sense: 14,
				presence: 16,
			},
			speed: 30,
			challenge_rating: 21,
			proficiency_bonus: 7,
			saving_throws: {
				Strength: 15,
				Vitality: 15,
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
				name: "Titan Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Void Titan Slam",
				description:
					"Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 43d6 fire damage.",
				type: "melee",
				attack_bonus: 11,
				damage: "43d6",
				damage_type: "fire",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Reality Shatter",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 20 Strength saving throw or take 34d6 acid damage.",
				type: "ranged",
				damage: "34d6",
				damage_type: "acid",
				range: 60,
				save: "Strength",
				dc: 20,
				usage: "at-will",
			},
			{
				name: "Abyssal Devastation",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 20 Strength saving throw, taking 43d6 poison damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "43d6",
				damage_type: "poison",
				range: 20,
				save: "Strength",
				dc: 20,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Retaliate",
				description:
					"When a creature within 5 feet of the anomaly hits it with an attack, the anomaly makes one Void Titan Slam attack against that creature.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 20 Strength saving throw or take 21d6 poison damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the fire resonance of its lair; difficult terrain laced with fire energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, fire phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Void Titan Slam attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Reality Shatter.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0603",
		name: "Supreme Abyssal God",
		type: "God",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Gargantuan",
		alignment: "lawful neutral",
		hp: 429,
		hit_dice: "429 (28d20 + 135)",
		ac: 21,
		ac_source: "natural armor",
		skills: {
			Perception: 9,
			Insight: 9,
		},
		image:
			"/generated/compendium/anomalies/anomaly-anomaly-supreme-abyssal-god-1vhfid.webp",
		description:
			"The supreme god of the abyss who has achieved ultimate power. This S rank deity represents the pinnacle of shadow evolution.",
		abilities: [
			"Supreme Abyssal Command",
			"Divine Void Annihilation",
			"Eternal Shadow Godhood",
		],
		weaknesses: [
			"Supreme Divine Light",
			"Cosmic Harmony",
			"Absolute Holy Power",
		],
		senses: "truesight 120 ft., passive Perception 19",
		languages: "all",
		damage_vulnerabilities: ["radiant"],
		damage_resistances: ["lightning"],
		damage_immunities: ["psychic"],
		condition_immunities: [
			"charmed",
			"exhaustion",
			"frightened",
			"paralyzed",
			"poisoned",
		],
		xp: 33000,
		stats: {
			ability_scores: {
				strength: 20,
				agility: 20,
				vitality: 20,
				intelligence: 14,
				sense: 14,
				presence: 14,
			},
			speed: 30,
			challenge_rating: 21,
			proficiency_bonus: 7,
			saving_throws: {
				Strength: 12,
				Agility: 12,
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
				name: "God Instinct",
				description:
					"When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.",
				action: "passive",
				frequency: "once-per-day",
			},
		],
		actions: [
			{
				name: "Supreme Abyssal Command",
				description:
					"Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 43d6 lightning damage.",
				type: "melee",
				attack_bonus: 11,
				damage: "43d6",
				damage_type: "lightning",
				range: 5,
				usage: "at-will",
			},
			{
				name: "Divine Void Annihilation",
				description:
					"Ranged Decree (range 60 ft.), one target. The target must succeed on a DC 20 Strength saving throw or take 34d6 force damage.",
				type: "ranged",
				damage: "34d6",
				damage_type: "force",
				range: 60,
				save: "Strength",
				dc: 20,
				usage: "at-will",
			},
			{
				name: "Eternal Shadow Godhood",
				description:
					"Recharge 5–6. Each creature in a 20-foot cone must make a DC 20 Strength saving throw, taking 43d6 cold damage on a failed save, or half as much on a success.",
				type: "special",
				damage: "43d6",
				damage_type: "cold",
				range: 20,
				save: "Strength",
				dc: 20,
				recharge: "5-6",
				usage: "recharge",
			},
		],
		reactions: [
			{
				name: "Lattice Backlash",
				description:
					"When the anomaly is hit by an attack, it wreathes itself in force energy: the attacker must succeed on a DC 20 Strength saving throw or take 17d6 force damage.",
			},
		],
		bonus_actions: [
			{
				name: "Force Mote",
				description:
					"Ranged Spell Attack: +11 to hit, range 60 ft., one target. Hit: 21d6 force damage.",
			},
		],
		lair_actions: [
			{
				name: "Lattice Surge",
				description:
					"On initiative count 20 (losing ties), the anomaly warps the lair: each enemy in the lair must succeed on a DC 20 Strength saving throw or take 21d6 cold damage.",
			},
			{
				name: "Sundering Echo",
				description:
					"The anomaly pulls on the lightning resonance of its lair; difficult terrain laced with lightning energy spreads in a 20-foot radius until the next lair action.",
			},
		],
		regional_effects: [
			{
				name: "Warped Region",
				description:
					"Within 1 mile of the lair, lightning phenomena distort the land — compasses spin, and creatures hostile to the anomaly have disadvantage on the first saving throw they make each day there.",
			},
		],
		legendary_actions: [
			{
				name: "Detect",
				description: "The anomaly makes a Sense (Perception) check.",
				frequency: "1/round",
			},
			{
				name: "Strike",
				description: "The anomaly makes one Supreme Abyssal Command attack.",
				frequency: "1/round",
			},
			{
				name: "Surge (Costs 2 Actions)",
				description: "The anomaly uses Divine Void Annihilation.",
				frequency: "1/round",
			},
		],
	},
	{
		id: "anomaly-0700",
		name: "The Quiet",
		type: "Apex Anomaly",
		rank: "S",
		source_book: "Rift Ascendant Canon",
		size: "Large",
		alignment: "neutral evil",
		hp: 444,
		hit_dice: "444 (36d10 + 246)",
		ac: 19,
		ac_source: "it is never fully seen",
		skills: {
			Stealth: 20,
			Perception: 15,
		},
		description:
			"The apex predator of the Gloamreach, and the reason the Interior cannot be cleared. The Quiet is almost never seen; it is felt — a cold, a pressure, a silence where insect-sound should be. It hunts by noise, light, and the use of Essence, wears the faces and voices of the dead to lure prey into the dark, and cannot be put down by ordinary force. A stand-up fight with it is a party's last mistake — until, at high tier and with the right means assembled, it finally isn't. Use this block for the gated endgame attempt and for the rare moment the party must survive it directly; most of the campaign, the Quiet takes a character when the Hunt Clock peaks rather than rolling initiative.",
		abilities: [
			"Wears the Dead",
			"Drawn to Noise, Light, and Essence",
			"Almost Never Seen",
		],
		weaknesses: [
			"Only truly killable once the party is 9th level or higher and has assembled the means to end it (see the Run Silent module)",
		],
		senses:
			"blindsight 60 ft., tremorsense 120 ft. (it hunts by sound and the use of power, not sight), passive Perception 25",
		languages:
			"understands every tongue the dead it has worn once spoke; answers only in stolen voices",
		damage_vulnerabilities: [],
		damage_resistances: [
			"bludgeoning, piercing, and slashing from nonmagical attacks",
		],
		damage_immunities: ["necrotic", "poison"],
		condition_immunities: [
			"blinded",
			"charmed",
			"exhaustion",
			"frightened",
			"poisoned",
		],
		xp: 33000,
		stats: {
			ability_scores: {
				strength: 24,
				agility: 22,
				vitality: 24,
				intelligence: 19,
				sense: 26,
				presence: 22,
			},
			speed: 40,
			extra_speeds: {
				climb: 40,
			},
			challenge_rating: 21,
			proficiency_bonus: 7,
			saving_throws: {
				Agility: 13,
				Vitality: 14,
				Sense: 15,
			},
		},
		traits: [
			{
				name: "Drawn to the Living",
				description:
					"The Quiet always knows the direction and rough distance of the loudest source of noise, light, or Essence use within the Interior, and moves toward it. Whenever a creature within one mile makes a loud noise, lights a flame, or uses an Awakened ability, Sigil, or technique, the Warden advances the Hunt Clock (see Running This Horror).",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Nothing Ordinary Can End It",
				description:
					"Until the party has assembled the means to end the Quiet (a Warden-tracked campaign condition) AND is 9th level or higher, the Quiet cannot be reduced below 1 hit point. At the end of any turn on which it took damage, it withdraws into the dark and is gone, returning when the Hunt Clock next peaks. Once both conditions are met this trait ends, and the Quiet can be killed normally — though it fights to the last and takes someone with it if it can.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Wears the Dead",
				description:
					"The Quiet can perfectly mimic the appearance and voice of any dead creature it has touched. Any check or effect to discern its true nature is made with disadvantage. It always gets one small detail deliberately wrong; a creature with cause to be suspicious may make a DC 20 Sense check to catch it.",
				action: "passive",
				frequency: "at-will",
			},
			{
				name: "Legendary Resistance (3/Day)",
				description:
					"If the Quiet fails a saving throw, it can choose to succeed instead.",
				action: "passive",
				frequency: "3/day",
			},
			{
				name: "It Is Already Here",
				description:
					"The Quiet cannot be surprised, ignores difficult terrain, and is not slowed by closed doors, walls, or darkness. It cannot cross a native wardline it has not been let past — but the living rarely keep perfect silence behind one.",
				action: "passive",
				frequency: "at-will",
			},
		],
		actions: [
			{
				name: "Multiattack",
				description: "The Quiet makes two Take attacks.",
				type: "special",
				usage: "at-will",
			},
			{
				name: "Take",
				description:
					"Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 39 (6d10 + 6) necrotic damage, and the target's hit point maximum is reduced by an amount equal to the damage taken until it finishes a long rest. A creature reduced to 0 hit points by this attack is taken — gone into the dark, to be worn later.",
				type: "melee",
				attack_bonus: 11,
				damage: "6d10",
				damage_type: "necrotic",
				range: 10,
				usage: "at-will",
			},
			{
				name: "The Silence",
				description:
					"Recharge 5–6. A 30-foot-radius sphere of absolute dark and silence centered on the Quiet. Each creature in the area must make a DC 20 Sense saving throw, taking 55 (10d10) psychic damage and becoming frightened of the Quiet until the end of its next turn on a failure, or half as much damage on a success. No sound or light can exist inside the sphere until the start of the Quiet's next turn.",
				type: "special",
				damage: "10d10",
				damage_type: "psychic",
				range: 30,
				save: "Sense",
				dc: 20,
				recharge: "5-6",
				usage: "recharge",
			},
			{
				name: "Wear a Face",
				description:
					"The Quiet takes the shape and voice of a dead creature one target loved or lost. That target must succeed on a DC 20 Sense saving throw or be unable to attack the Quiet, and unable to move away from it, until the end of its next turn.",
				type: "special",
				save: "Sense",
				dc: 20,
				usage: "at-will",
			},
		],
		reactions: [
			{
				name: "Never Quite There",
				description:
					"When the Quiet is hit by an attack while Nothing Ordinary Can End It is active, it halves the damage and may immediately move up to half its speed without provoking opportunity attacks.",
			},
		],
		lair_actions: [
			{
				name: "The Lights Die",
				description:
					"On initiative count 20 (losing ties), all nonmagical light within 120 feet of the Quiet gutters to darkness, and magical light of 3rd level or lower is suppressed until the next round.",
			},
			{
				name: "It Heard That",
				description:
					"A creature that made noise or used Essence since the last lair action has disadvantage on the next saving throw it makes against the Quiet, and the Hunt Clock advances by one.",
			},
			{
				name: "Borrowed Voice",
				description:
					"A voice one creature has lost calls from somewhere in the dark. That creature must succeed on a DC 18 Sense saving throw or move its speed toward the voice by the most direct route, taking the path that seems safest into the worst danger.",
			},
		],
		legendary_actions: [
			{
				name: "Drift",
				description:
					"The Quiet moves up to its speed without a sound and without provoking opportunity attacks.",
				frequency: "at-will",
			},
			{
				name: "Listen",
				description:
					"The Quiet learns the exact location of every creature that made noise or used Essence since the start of its last turn.",
				frequency: "at-will",
			},
			{
				name: "Take (Costs 2 Actions)",
				description: "The Quiet makes one Take attack.",
				frequency: "1/round",
			},
		],
	},
];
