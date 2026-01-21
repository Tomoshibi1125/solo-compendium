// Comprehensive Monsters Compendium - Digital Character Sheet Scale
// Generated with full admin privileges
// System Ascendant themed monsters with images

export interface Monster {
  id: string;
  name: string;
  type: string;
  rank: 'D' | 'C' | 'B' | 'A' | 'S';
  // SRD 5e stats
  stats: {
    abilityScores: {
      strength?: number;
      dexterity?: number;
      constitution?: number;
      intelligence?: number;
      wisdom?: number;
      charisma?: number;
    };
    armorClass: number;
    hitPoints: number;
    speed: number;
    challengeRating: number;
    proficiencyBonus: number;
    savingThrows: {
      strength?: number;
      dexterity?: number;
      constitution?: number;
      intelligence?: number;
      wisdom?: number;
      charisma?: number;
    };
    skills: string[];
    damageResistances: string[];
    damageImmunities: string[];
    damageVulnerabilities: string[];
    conditionImmunities: string[];
    senses: string[];
    languages: string[];
    traits: {
      name: string;
      description: string;
      action?: 'action' | 'bonus-action' | 'reaction' | 'legendary';
      frequency?: 'at-will' | 'recharge' | 'short-rest' | 'long-rest' | 'once-per-day';
      dc?: number;
    }[];
    actions: {
      name: string;
      description: string;
      type: 'melee' | 'ranged' | 'spell' | 'special';
      attackBonus?: number;
      damage?: string;
      damageType?: string;
      range?: number;
      save?: string;
      dc?: number;
      hit?: string;
      recharge?: 'recharge' | 'short-rest' | 'long-rest' | 'once-per-day';
      usage?: 'at-will' | 'recharge' | 'short-rest' | 'long-rest' | 'once-per-day';
    }[];
    legendary?: {
      name: string;
      description: string;
      frequency?: 'day' | 'week' | 'month';
      dc?: number;
    }[];
    lair?: {
      type: 'innate' | 'perception' | 'darkvision' | 'truesight' | 'blindsight' | 'tremorsense';
      range?: number;
      passive?: boolean;
    };
  };
  // System Ascendant flavor
  image: string;
  description: string;
  abilities: string[];
  weaknesses: string[];
  // Legacy stats for backward compatibility
  hp?: number;
  ac?: number;
  // Additional properties
  xp?: number;
  treasure?: {
    coin?: number;
    items?: string[];
  };
  environment?: string[];
  organization?: string;
  alignment?: string;
  source?: string;
}

export const monsters = [
  {
    "id": "monster-0001",
    "name": "Eternal Shadow Demon",
    "type": "Demon",
    "rank": "S",
    "stats": {
      "abilityScores": {
        "strength": 24,
        "dexterity": 18,
        "constitution": 22,
        "intelligence": 16,
        "wisdom": 14,
        "charisma": 18
      },
      "armorClass": 19,
      "hitPoints": 323,
      "speed": 40,
      "challengeRating": 18,
      "proficiencyBonus": 7,
      "savingThrows": {
        "constitution": 12,
        "wisdom": 8,
        "charisma": 10
      }
    },
    "skills": ["Perception", "Stealth", "Intimidation", "Deception"],
    "damageResistances": ["necrotic", "cold", "fire", "lightning"],
    "damageImmunities": ["poison", "disease"],
    "damageVulnerabilities": ["radiant"],
    "conditionImmunities": ["charmed", "frightened"],
    "senses": "darkvision 120 ft., passive Perception 15, tremorsense 60 ft.",
    "languages": "Abyssal, Common, Infernal",
    "traits": [
      {
        "name": "Shadow Step",
        "description": "As a bonus action, teleport up to 60 feet to an unoccupied space in dim light or darkness.",
        "action": "bonus-action",
        "frequency": "at-will"
      },
      {
        "name": "Shadow Regeneration",
        "description": "Regains 10 hit points at the start of its turn if it has at least 1 hit point.",
        "action": "legendary",
        "frequency": "day"
      }
    ],
    "actions": [
      {
        "name": "Shadow Claw",
        "description": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 5) slashing damage.",
        "type": "melee",
        "attackBonus": 10,
        "damage": "2d8 + 5",
        "damageType": "slashing",
        "range": 5,
        "hit": "13 (2d8 + 5) slashing damage.",
        "recharge": "recharge"
      },
      {
        "name": "Void Blast",
        "description": "Ranged Spell Attack: +8 to hit, range 150 ft., one target. Hit: 22 (4d10 force damage).",
        "type": "spell",
        "attackBonus": 8,
        "damage": "4d10",
        "damageType": "force",
        "range": 150,
        "hit": "22 (4d10 force damage).",
        "save": "Constitution",
        "dc": 18,
        "recharge": "short-rest"
      },
      {
        "name": "Abyssal Roar",
        "description": "Area Attack: 60-foot cone. Each creature in area must make a DC 18 Constitution saving throw or take 16 (4d8 cold damage) and be pushed 15 feet away.",
        "type": "special",
        "save": "Constitution",
        "dc": 18,
        "recharge": "long-rest"
      }
    ],
    "legendary": [
      {
        "name": "Shadow Dominion",
        "description": "Once per day, the demon can create a 1-mile radius area of shadow control for 1 hour.",
        "frequency": "day",
        "dc": 20
      }
    ],
    "lair": {
      "type": "darkvision",
      "range": 120,
      "passive": true
    },
    "image": "/generated/compendium/monsters/monster-0001.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Radiant"
    ],
    "xp": 78000,
    "treasure": {
      "coin": 15000,
      "items": ["Shadow Essence x3", "Void Crystal x1"]
    },
    "environment": ["Shadow Realm", "Abyss"],
    "organization": "Umbral Legion",
    "alignment": "chaotic evil",
    "source": "System Ascendant Canon"
  },
  {
    "id": "monster-0002",
    "name": "Eternal Void Beast",
    "type": "Beast",
    "rank": "C",
    "hp": 438,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0002.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0003",
    "name": "Eternal Abyssal Horror",
    "type": "Humanoid",
    "rank": "B",
    "hp": 957,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0003.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0004",
    "name": "Eternal Demonic Knight",
    "type": "Undead",
    "rank": "A",
    "hp": 136,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0004.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0005",
    "name": "Eternal Celestial Guardian",
    "type": "Dragon",
    "rank": "S",
    "hp": 894,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0005.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0006",
    "name": "Eternal Ancient Dragon",
    "type": "Elemental",
    "rank": "D",
    "hp": 935,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0006.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0007",
    "name": "Eternal Void Wraith",
    "type": "Demon",
    "rank": "C",
    "hp": 737,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0007.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0008",
    "name": "Eternal Shadow Lurker",
    "type": "Beast",
    "rank": "B",
    "hp": 900,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0008.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0009",
    "name": "Eternal Demonic Overlord",
    "type": "Humanoid",
    "rank": "A",
    "hp": 263,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0009.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0010",
    "name": "Eternal Celestial Serpent",
    "type": "Undead",
    "rank": "S",
    "hp": 724,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0010.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0011",
    "name": "Eternal Abyssal Titan",
    "type": "Dragon",
    "rank": "D",
    "hp": 568,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0011.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0012",
    "name": "Eternal Void Stalker",
    "type": "Elemental",
    "rank": "C",
    "hp": 626,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0012.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0013",
    "name": "Eternal Shadow Revenant",
    "type": "Demon",
    "rank": "B",
    "hp": 287,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0013.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0014",
    "name": "Eternal Demonic Warlord",
    "type": "Beast",
    "rank": "A",
    "hp": 918,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0014.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0015",
    "name": "Eternal Celestial Phoenix",
    "type": "Humanoid",
    "rank": "S",
    "hp": 695,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0015.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0016",
    "name": "Eternal Ancient Lich",
    "type": "Undead",
    "rank": "D",
    "hp": 169,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0016.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0017",
    "name": "Eternal Void Devourer",
    "type": "Dragon",
    "rank": "C",
    "hp": 157,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0017.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0018",
    "name": "Eternal Shadow Assassin",
    "type": "Elemental",
    "rank": "B",
    "hp": 787,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0018.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0019",
    "name": "Eternal Demonic Berserker",
    "type": "Demon",
    "rank": "A",
    "hp": 1079,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0019.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0020",
    "name": "Eternal Celestial Paladin",
    "type": "Beast",
    "rank": "S",
    "hp": 112,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0020.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0021",
    "name": "Corrupted Shadow Demon",
    "type": "Humanoid",
    "rank": "D",
    "hp": 264,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0021.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0022",
    "name": "Corrupted Void Beast",
    "type": "Undead",
    "rank": "C",
    "hp": 579,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0022.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0023",
    "name": "Corrupted Abyssal Horror",
    "type": "Dragon",
    "rank": "B",
    "hp": 768,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0023.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0024",
    "name": "Corrupted Demonic Knight",
    "type": "Elemental",
    "rank": "A",
    "hp": 479,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0024.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0025",
    "name": "Corrupted Celestial Guardian",
    "type": "Demon",
    "rank": "S",
    "hp": 979,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0025.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0026",
    "name": "Corrupted Ancient Dragon",
    "type": "Beast",
    "rank": "D",
    "hp": 827,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0026.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0027",
    "name": "Corrupted Void Wraith",
    "type": "Humanoid",
    "rank": "C",
    "hp": 518,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0027.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0028",
    "name": "Corrupted Shadow Lurker",
    "type": "Undead",
    "rank": "B",
    "hp": 1055,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0028.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0029",
    "name": "Corrupted Demonic Overlord",
    "type": "Dragon",
    "rank": "A",
    "hp": 542,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0029.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0030",
    "name": "Corrupted Celestial Serpent",
    "type": "Elemental",
    "rank": "S",
    "hp": 251,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0030.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0031",
    "name": "Corrupted Abyssal Titan",
    "type": "Demon",
    "rank": "D",
    "hp": 493,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0031.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0032",
    "name": "Corrupted Void Stalker",
    "type": "Beast",
    "rank": "C",
    "hp": 893,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0032.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0033",
    "name": "Corrupted Shadow Revenant",
    "type": "Humanoid",
    "rank": "B",
    "hp": 700,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0033.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0034",
    "name": "Corrupted Demonic Warlord",
    "type": "Undead",
    "rank": "A",
    "hp": 859,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0034.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0035",
    "name": "Corrupted Celestial Phoenix",
    "type": "Dragon",
    "rank": "S",
    "hp": 902,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0035.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0036",
    "name": "Corrupted Ancient Lich",
    "type": "Elemental",
    "rank": "D",
    "hp": 254,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0036.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0037",
    "name": "Corrupted Void Devourer",
    "type": "Demon",
    "rank": "C",
    "hp": 191,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0037.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0038",
    "name": "Corrupted Shadow Assassin",
    "type": "Beast",
    "rank": "B",
    "hp": 253,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0038.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0039",
    "name": "Corrupted Demonic Berserker",
    "type": "Humanoid",
    "rank": "A",
    "hp": 179,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0039.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0040",
    "name": "Corrupted Celestial Paladin",
    "type": "Undead",
    "rank": "S",
    "hp": 198,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0040.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0041",
    "name": "Blessed Shadow Demon",
    "type": "Dragon",
    "rank": "D",
    "hp": 169,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0041.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0042",
    "name": "Blessed Void Beast",
    "type": "Elemental",
    "rank": "C",
    "hp": 1037,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0042.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0043",
    "name": "Blessed Abyssal Horror",
    "type": "Demon",
    "rank": "B",
    "hp": 982,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0043.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0044",
    "name": "Blessed Demonic Knight",
    "type": "Beast",
    "rank": "A",
    "hp": 131,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0044.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0045",
    "name": "Blessed Celestial Guardian",
    "type": "Humanoid",
    "rank": "S",
    "hp": 632,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0045.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0046",
    "name": "Blessed Ancient Dragon",
    "type": "Undead",
    "rank": "D",
    "hp": 583,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0046.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0047",
    "name": "Blessed Void Wraith",
    "type": "Dragon",
    "rank": "C",
    "hp": 781,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0047.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0048",
    "name": "Blessed Shadow Lurker",
    "type": "Elemental",
    "rank": "B",
    "hp": 777,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0048.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0049",
    "name": "Blessed Demonic Overlord",
    "type": "Demon",
    "rank": "A",
    "hp": 444,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0049.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0050",
    "name": "Blessed Celestial Serpent",
    "type": "Beast",
    "rank": "S",
    "hp": 1018,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0050.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0051",
    "name": "Blessed Abyssal Titan",
    "type": "Humanoid",
    "rank": "D",
    "hp": 468,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0051.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0052",
    "name": "Blessed Void Stalker",
    "type": "Undead",
    "rank": "C",
    "hp": 573,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0052.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0053",
    "name": "Blessed Shadow Revenant",
    "type": "Dragon",
    "rank": "B",
    "hp": 903,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0053.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0054",
    "name": "Blessed Demonic Warlord",
    "type": "Elemental",
    "rank": "A",
    "hp": 611,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0054.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0055",
    "name": "Blessed Celestial Phoenix",
    "type": "Demon",
    "rank": "S",
    "hp": 1060,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0055.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0056",
    "name": "Blessed Ancient Lich",
    "type": "Beast",
    "rank": "D",
    "hp": 951,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0056.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0057",
    "name": "Blessed Void Devourer",
    "type": "Humanoid",
    "rank": "C",
    "hp": 675,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0057.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0058",
    "name": "Blessed Shadow Assassin",
    "type": "Undead",
    "rank": "B",
    "hp": 517,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0058.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0059",
    "name": "Blessed Demonic Berserker",
    "type": "Dragon",
    "rank": "A",
    "hp": 113,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0059.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0060",
    "name": "Blessed Celestial Paladin",
    "type": "Elemental",
    "rank": "S",
    "hp": 352,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0060.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0061",
    "name": "Cursed Shadow Demon",
    "type": "Demon",
    "rank": "D",
    "hp": 671,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0061.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0062",
    "name": "Cursed Void Beast",
    "type": "Beast",
    "rank": "C",
    "hp": 749,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0062.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0063",
    "name": "Cursed Abyssal Horror",
    "type": "Humanoid",
    "rank": "B",
    "hp": 576,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0063.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0064",
    "name": "Cursed Demonic Knight",
    "type": "Undead",
    "rank": "A",
    "hp": 839,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0064.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0065",
    "name": "Cursed Celestial Guardian",
    "type": "Dragon",
    "rank": "S",
    "hp": 716,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0065.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0066",
    "name": "Cursed Ancient Dragon",
    "type": "Elemental",
    "rank": "D",
    "hp": 573,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0066.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0067",
    "name": "Cursed Void Wraith",
    "type": "Demon",
    "rank": "C",
    "hp": 929,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0067.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0068",
    "name": "Cursed Shadow Lurker",
    "type": "Beast",
    "rank": "B",
    "hp": 722,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0068.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0069",
    "name": "Cursed Demonic Overlord",
    "type": "Humanoid",
    "rank": "A",
    "hp": 760,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0069.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0070",
    "name": "Cursed Celestial Serpent",
    "type": "Undead",
    "rank": "S",
    "hp": 365,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0070.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0071",
    "name": "Cursed Abyssal Titan",
    "type": "Dragon",
    "rank": "D",
    "hp": 135,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0071.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0072",
    "name": "Cursed Void Stalker",
    "type": "Elemental",
    "rank": "C",
    "hp": 627,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0072.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0073",
    "name": "Cursed Shadow Revenant",
    "type": "Demon",
    "rank": "B",
    "hp": 905,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0073.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0074",
    "name": "Cursed Demonic Warlord",
    "type": "Beast",
    "rank": "A",
    "hp": 173,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0074.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0075",
    "name": "Cursed Celestial Phoenix",
    "type": "Humanoid",
    "rank": "S",
    "hp": 316,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0075.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0076",
    "name": "Cursed Ancient Lich",
    "type": "Undead",
    "rank": "D",
    "hp": 825,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0076.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0077",
    "name": "Cursed Void Devourer",
    "type": "Dragon",
    "rank": "C",
    "hp": 589,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0077.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0078",
    "name": "Cursed Shadow Assassin",
    "type": "Elemental",
    "rank": "B",
    "hp": 194,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0078.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0079",
    "name": "Cursed Demonic Berserker",
    "type": "Demon",
    "rank": "A",
    "hp": 726,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0079.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0080",
    "name": "Cursed Celestial Paladin",
    "type": "Beast",
    "rank": "S",
    "hp": 155,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0080.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0081",
    "name": "Ancient Shadow Demon",
    "type": "Humanoid",
    "rank": "D",
    "hp": 563,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0081.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0082",
    "name": "Ancient Void Beast",
    "type": "Undead",
    "rank": "C",
    "hp": 806,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0082.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0083",
    "name": "Ancient Abyssal Horror",
    "type": "Dragon",
    "rank": "B",
    "hp": 702,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0083.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0084",
    "name": "Ancient Demonic Knight",
    "type": "Elemental",
    "rank": "A",
    "hp": 338,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0084.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0085",
    "name": "Ancient Celestial Guardian",
    "type": "Demon",
    "rank": "S",
    "hp": 1098,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0085.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0086",
    "name": "Ancient Ancient Dragon",
    "type": "Beast",
    "rank": "D",
    "hp": 1068,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0086.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0087",
    "name": "Ancient Void Wraith",
    "type": "Humanoid",
    "rank": "C",
    "hp": 547,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0087.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0088",
    "name": "Ancient Shadow Lurker",
    "type": "Undead",
    "rank": "B",
    "hp": 137,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0088.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0089",
    "name": "Ancient Demonic Overlord",
    "type": "Dragon",
    "rank": "A",
    "hp": 559,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0089.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0090",
    "name": "Ancient Celestial Serpent",
    "type": "Elemental",
    "rank": "S",
    "hp": 704,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0090.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0091",
    "name": "Ancient Abyssal Titan",
    "type": "Demon",
    "rank": "D",
    "hp": 477,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0091.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0092",
    "name": "Ancient Void Stalker",
    "type": "Beast",
    "rank": "C",
    "hp": 398,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0092.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0093",
    "name": "Ancient Shadow Revenant",
    "type": "Humanoid",
    "rank": "B",
    "hp": 983,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0093.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0094",
    "name": "Ancient Demonic Warlord",
    "type": "Undead",
    "rank": "A",
    "hp": 225,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0094.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0095",
    "name": "Ancient Celestial Phoenix",
    "type": "Dragon",
    "rank": "S",
    "hp": 897,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0095.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0096",
    "name": "Ancient Ancient Lich",
    "type": "Elemental",
    "rank": "D",
    "hp": 454,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0096.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0097",
    "name": "Ancient Void Devourer",
    "type": "Demon",
    "rank": "C",
    "hp": 765,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0097.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0098",
    "name": "Ancient Shadow Assassin",
    "type": "Beast",
    "rank": "B",
    "hp": 622,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0098.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0099",
    "name": "Ancient Demonic Berserker",
    "type": "Humanoid",
    "rank": "A",
    "hp": 140,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0099.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0100",
    "name": "Ancient Celestial Paladin",
    "type": "Undead",
    "rank": "S",
    "hp": 752,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0100.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0101",
    "name": "Primordial Shadow Demon",
    "type": "Dragon",
    "rank": "D",
    "hp": 813,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0101.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0102",
    "name": "Primordial Void Beast",
    "type": "Elemental",
    "rank": "C",
    "hp": 559,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0102.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0103",
    "name": "Primordial Abyssal Horror",
    "type": "Demon",
    "rank": "B",
    "hp": 406,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0103.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0104",
    "name": "Primordial Demonic Knight",
    "type": "Beast",
    "rank": "A",
    "hp": 1014,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0104.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0105",
    "name": "Primordial Celestial Guardian",
    "type": "Humanoid",
    "rank": "S",
    "hp": 193,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0105.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0106",
    "name": "Primordial Ancient Dragon",
    "type": "Undead",
    "rank": "D",
    "hp": 258,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0106.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0107",
    "name": "Primordial Void Wraith",
    "type": "Dragon",
    "rank": "C",
    "hp": 421,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0107.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0108",
    "name": "Primordial Shadow Lurker",
    "type": "Elemental",
    "rank": "B",
    "hp": 1042,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0108.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0109",
    "name": "Primordial Demonic Overlord",
    "type": "Demon",
    "rank": "A",
    "hp": 256,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0109.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0110",
    "name": "Primordial Celestial Serpent",
    "type": "Beast",
    "rank": "S",
    "hp": 548,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0110.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0111",
    "name": "Primordial Abyssal Titan",
    "type": "Humanoid",
    "rank": "D",
    "hp": 413,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0111.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0112",
    "name": "Primordial Void Stalker",
    "type": "Undead",
    "rank": "C",
    "hp": 688,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0112.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0113",
    "name": "Primordial Shadow Revenant",
    "type": "Dragon",
    "rank": "B",
    "hp": 102,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0113.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0114",
    "name": "Primordial Demonic Warlord",
    "type": "Elemental",
    "rank": "A",
    "hp": 394,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0114.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0115",
    "name": "Primordial Celestial Phoenix",
    "type": "Demon",
    "rank": "S",
    "hp": 752,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0115.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0116",
    "name": "Primordial Ancient Lich",
    "type": "Beast",
    "rank": "D",
    "hp": 598,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0116.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0117",
    "name": "Primordial Void Devourer",
    "type": "Humanoid",
    "rank": "C",
    "hp": 589,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0117.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0118",
    "name": "Primordial Shadow Assassin",
    "type": "Undead",
    "rank": "B",
    "hp": 1089,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0118.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0119",
    "name": "Primordial Demonic Berserker",
    "type": "Dragon",
    "rank": "A",
    "hp": 675,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0119.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0120",
    "name": "Primordial Celestial Paladin",
    "type": "Elemental",
    "rank": "S",
    "hp": 101,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0120.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0121",
    "name": "Supreme Shadow Demon",
    "type": "Demon",
    "rank": "D",
    "hp": 161,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0121.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0122",
    "name": "Supreme Void Beast",
    "type": "Beast",
    "rank": "C",
    "hp": 707,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0122.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0123",
    "name": "Supreme Abyssal Horror",
    "type": "Humanoid",
    "rank": "B",
    "hp": 172,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0123.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0124",
    "name": "Supreme Demonic Knight",
    "type": "Undead",
    "rank": "A",
    "hp": 995,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0124.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0125",
    "name": "Supreme Celestial Guardian",
    "type": "Dragon",
    "rank": "S",
    "hp": 560,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0125.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0126",
    "name": "Supreme Ancient Dragon",
    "type": "Elemental",
    "rank": "D",
    "hp": 208,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0126.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0127",
    "name": "Supreme Void Wraith",
    "type": "Demon",
    "rank": "C",
    "hp": 341,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0127.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0128",
    "name": "Supreme Shadow Lurker",
    "type": "Beast",
    "rank": "B",
    "hp": 1045,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0128.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0129",
    "name": "Supreme Demonic Overlord",
    "type": "Humanoid",
    "rank": "A",
    "hp": 182,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0129.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0130",
    "name": "Supreme Celestial Serpent",
    "type": "Undead",
    "rank": "S",
    "hp": 536,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0130.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0131",
    "name": "Supreme Abyssal Titan",
    "type": "Dragon",
    "rank": "D",
    "hp": 913,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0131.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0132",
    "name": "Supreme Void Stalker",
    "type": "Elemental",
    "rank": "C",
    "hp": 841,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0132.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0133",
    "name": "Supreme Shadow Revenant",
    "type": "Demon",
    "rank": "B",
    "hp": 1079,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0133.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0134",
    "name": "Supreme Demonic Warlord",
    "type": "Beast",
    "rank": "A",
    "hp": 599,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0134.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0135",
    "name": "Supreme Celestial Phoenix",
    "type": "Humanoid",
    "rank": "S",
    "hp": 572,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0135.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0136",
    "name": "Supreme Ancient Lich",
    "type": "Undead",
    "rank": "D",
    "hp": 331,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0136.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0137",
    "name": "Supreme Void Devourer",
    "type": "Dragon",
    "rank": "C",
    "hp": 452,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0137.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0138",
    "name": "Supreme Shadow Assassin",
    "type": "Elemental",
    "rank": "B",
    "hp": 546,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0138.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0139",
    "name": "Supreme Demonic Berserker",
    "type": "Demon",
    "rank": "A",
    "hp": 479,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0139.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0140",
    "name": "Supreme Celestial Paladin",
    "type": "Beast",
    "rank": "S",
    "hp": 261,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0140.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0141",
    "name": "Legendary Shadow Demon",
    "type": "Humanoid",
    "rank": "D",
    "hp": 275,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0141.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0142",
    "name": "Legendary Void Beast",
    "type": "Undead",
    "rank": "C",
    "hp": 647,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0142.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0143",
    "name": "Legendary Abyssal Horror",
    "type": "Dragon",
    "rank": "B",
    "hp": 1098,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0143.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0144",
    "name": "Legendary Demonic Knight",
    "type": "Elemental",
    "rank": "A",
    "hp": 512,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0144.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0145",
    "name": "Legendary Celestial Guardian",
    "type": "Demon",
    "rank": "S",
    "hp": 530,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0145.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0146",
    "name": "Legendary Ancient Dragon",
    "type": "Beast",
    "rank": "D",
    "hp": 1069,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0146.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0147",
    "name": "Legendary Void Wraith",
    "type": "Humanoid",
    "rank": "C",
    "hp": 508,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0147.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0148",
    "name": "Legendary Shadow Lurker",
    "type": "Undead",
    "rank": "B",
    "hp": 349,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0148.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0149",
    "name": "Legendary Demonic Overlord",
    "type": "Dragon",
    "rank": "A",
    "hp": 1063,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0149.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0150",
    "name": "Legendary Celestial Serpent",
    "type": "Elemental",
    "rank": "S",
    "hp": 1019,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0150.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0151",
    "name": "Legendary Abyssal Titan",
    "type": "Demon",
    "rank": "D",
    "hp": 607,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0151.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0152",
    "name": "Legendary Void Stalker",
    "type": "Beast",
    "rank": "C",
    "hp": 402,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0152.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0153",
    "name": "Legendary Shadow Revenant",
    "type": "Humanoid",
    "rank": "B",
    "hp": 526,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0153.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0154",
    "name": "Legendary Demonic Warlord",
    "type": "Undead",
    "rank": "A",
    "hp": 877,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0154.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0155",
    "name": "Legendary Celestial Phoenix",
    "type": "Dragon",
    "rank": "S",
    "hp": 829,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0155.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0156",
    "name": "Legendary Ancient Lich",
    "type": "Elemental",
    "rank": "D",
    "hp": 849,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0156.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0157",
    "name": "Legendary Void Devourer",
    "type": "Demon",
    "rank": "C",
    "hp": 278,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0157.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0158",
    "name": "Legendary Shadow Assassin",
    "type": "Beast",
    "rank": "B",
    "hp": 405,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0158.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0159",
    "name": "Legendary Demonic Berserker",
    "type": "Humanoid",
    "rank": "A",
    "hp": 825,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0159.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0160",
    "name": "Legendary Celestial Paladin",
    "type": "Undead",
    "rank": "S",
    "hp": 162,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0160.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0161",
    "name": "Mythic Shadow Demon",
    "type": "Dragon",
    "rank": "D",
    "hp": 424,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0161.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0162",
    "name": "Mythic Void Beast",
    "type": "Elemental",
    "rank": "C",
    "hp": 727,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0162.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0163",
    "name": "Mythic Abyssal Horror",
    "type": "Demon",
    "rank": "B",
    "hp": 802,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0163.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0164",
    "name": "Mythic Demonic Knight",
    "type": "Beast",
    "rank": "A",
    "hp": 142,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0164.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0165",
    "name": "Mythic Celestial Guardian",
    "type": "Humanoid",
    "rank": "S",
    "hp": 692,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0165.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0166",
    "name": "Mythic Ancient Dragon",
    "type": "Undead",
    "rank": "D",
    "hp": 478,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0166.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0167",
    "name": "Mythic Void Wraith",
    "type": "Dragon",
    "rank": "C",
    "hp": 329,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0167.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0168",
    "name": "Mythic Shadow Lurker",
    "type": "Elemental",
    "rank": "B",
    "hp": 300,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0168.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0169",
    "name": "Mythic Demonic Overlord",
    "type": "Demon",
    "rank": "A",
    "hp": 1020,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0169.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0170",
    "name": "Mythic Celestial Serpent",
    "type": "Beast",
    "rank": "S",
    "hp": 107,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0170.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0171",
    "name": "Mythic Abyssal Titan",
    "type": "Humanoid",
    "rank": "D",
    "hp": 1067,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0171.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0172",
    "name": "Mythic Void Stalker",
    "type": "Undead",
    "rank": "C",
    "hp": 742,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0172.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0173",
    "name": "Mythic Shadow Revenant",
    "type": "Dragon",
    "rank": "B",
    "hp": 431,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0173.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0174",
    "name": "Mythic Demonic Warlord",
    "type": "Elemental",
    "rank": "A",
    "hp": 188,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0174.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0175",
    "name": "Mythic Celestial Phoenix",
    "type": "Demon",
    "rank": "S",
    "hp": 142,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0175.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0176",
    "name": "Mythic Ancient Lich",
    "type": "Beast",
    "rank": "D",
    "hp": 895,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0176.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0177",
    "name": "Mythic Void Devourer",
    "type": "Humanoid",
    "rank": "C",
    "hp": 701,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0177.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0178",
    "name": "Mythic Shadow Assassin",
    "type": "Undead",
    "rank": "B",
    "hp": 669,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0178.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0179",
    "name": "Mythic Demonic Berserker",
    "type": "Dragon",
    "rank": "A",
    "hp": 202,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0179.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0180",
    "name": "Mythic Celestial Paladin",
    "type": "Elemental",
    "rank": "S",
    "hp": 555,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0180.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0181",
    "name": "Divine Shadow Demon",
    "type": "Demon",
    "rank": "D",
    "hp": 1055,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0181.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0182",
    "name": "Divine Void Beast",
    "type": "Beast",
    "rank": "C",
    "hp": 753,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0182.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0183",
    "name": "Divine Abyssal Horror",
    "type": "Humanoid",
    "rank": "B",
    "hp": 463,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0183.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0184",
    "name": "Divine Demonic Knight",
    "type": "Undead",
    "rank": "A",
    "hp": 158,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0184.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0185",
    "name": "Divine Celestial Guardian",
    "type": "Dragon",
    "rank": "S",
    "hp": 815,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0185.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0186",
    "name": "Divine Ancient Dragon",
    "type": "Elemental",
    "rank": "D",
    "hp": 212,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0186.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0187",
    "name": "Divine Void Wraith",
    "type": "Demon",
    "rank": "C",
    "hp": 737,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0187.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0188",
    "name": "Divine Shadow Lurker",
    "type": "Beast",
    "rank": "B",
    "hp": 892,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0188.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0189",
    "name": "Divine Demonic Overlord",
    "type": "Humanoid",
    "rank": "A",
    "hp": 561,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0189.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0190",
    "name": "Divine Celestial Serpent",
    "type": "Undead",
    "rank": "S",
    "hp": 612,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0190.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0191",
    "name": "Divine Abyssal Titan",
    "type": "Dragon",
    "rank": "D",
    "hp": 543,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0191.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0192",
    "name": "Divine Void Stalker",
    "type": "Elemental",
    "rank": "C",
    "hp": 281,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0192.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0193",
    "name": "Divine Shadow Revenant",
    "type": "Demon",
    "rank": "B",
    "hp": 541,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0193.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0194",
    "name": "Divine Demonic Warlord",
    "type": "Beast",
    "rank": "A",
    "hp": 1024,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0194.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0195",
    "name": "Divine Celestial Phoenix",
    "type": "Humanoid",
    "rank": "S",
    "hp": 363,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0195.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0196",
    "name": "Divine Ancient Lich",
    "type": "Undead",
    "rank": "D",
    "hp": 955,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0196.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0197",
    "name": "Divine Void Devourer",
    "type": "Dragon",
    "rank": "C",
    "hp": 434,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0197.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0198",
    "name": "Divine Shadow Assassin",
    "type": "Elemental",
    "rank": "B",
    "hp": 757,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0198.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0199",
    "name": "Divine Demonic Berserker",
    "type": "Demon",
    "rank": "A",
    "hp": 981,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0199.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0200",
    "name": "Divine Celestial Paladin",
    "type": "Beast",
    "rank": "S",
    "hp": 859,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0200.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0201",
    "name": "Infernal Shadow Demon",
    "type": "Humanoid",
    "rank": "D",
    "hp": 395,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0201.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0202",
    "name": "Infernal Void Beast",
    "type": "Undead",
    "rank": "C",
    "hp": 983,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0202.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0203",
    "name": "Infernal Abyssal Horror",
    "type": "Dragon",
    "rank": "B",
    "hp": 647,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0203.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0204",
    "name": "Infernal Demonic Knight",
    "type": "Elemental",
    "rank": "A",
    "hp": 485,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0204.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0205",
    "name": "Infernal Celestial Guardian",
    "type": "Demon",
    "rank": "S",
    "hp": 103,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0205.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0206",
    "name": "Infernal Ancient Dragon",
    "type": "Beast",
    "rank": "D",
    "hp": 482,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0206.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0207",
    "name": "Infernal Void Wraith",
    "type": "Humanoid",
    "rank": "C",
    "hp": 352,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0207.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0208",
    "name": "Infernal Shadow Lurker",
    "type": "Undead",
    "rank": "B",
    "hp": 741,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0208.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0209",
    "name": "Infernal Demonic Overlord",
    "type": "Dragon",
    "rank": "A",
    "hp": 822,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0209.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0210",
    "name": "Infernal Celestial Serpent",
    "type": "Elemental",
    "rank": "S",
    "hp": 605,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0210.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0211",
    "name": "Infernal Abyssal Titan",
    "type": "Demon",
    "rank": "D",
    "hp": 704,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0211.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0212",
    "name": "Infernal Void Stalker",
    "type": "Beast",
    "rank": "C",
    "hp": 372,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0212.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0213",
    "name": "Infernal Shadow Revenant",
    "type": "Humanoid",
    "rank": "B",
    "hp": 517,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0213.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0214",
    "name": "Infernal Demonic Warlord",
    "type": "Undead",
    "rank": "A",
    "hp": 669,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0214.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0215",
    "name": "Infernal Celestial Phoenix",
    "type": "Dragon",
    "rank": "S",
    "hp": 886,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0215.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0216",
    "name": "Infernal Ancient Lich",
    "type": "Elemental",
    "rank": "D",
    "hp": 112,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0216.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0217",
    "name": "Infernal Void Devourer",
    "type": "Demon",
    "rank": "C",
    "hp": 132,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0217.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0218",
    "name": "Infernal Shadow Assassin",
    "type": "Beast",
    "rank": "B",
    "hp": 771,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0218.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0219",
    "name": "Infernal Demonic Berserker",
    "type": "Humanoid",
    "rank": "A",
    "hp": 1023,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0219.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0220",
    "name": "Infernal Celestial Paladin",
    "type": "Undead",
    "rank": "S",
    "hp": 505,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0220.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0221",
    "name": "Celestial Shadow Demon",
    "type": "Dragon",
    "rank": "D",
    "hp": 606,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0221.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0222",
    "name": "Celestial Void Beast",
    "type": "Elemental",
    "rank": "C",
    "hp": 306,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0222.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0223",
    "name": "Celestial Abyssal Horror",
    "type": "Demon",
    "rank": "B",
    "hp": 124,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0223.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0224",
    "name": "Celestial Demonic Knight",
    "type": "Beast",
    "rank": "A",
    "hp": 587,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0224.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0225",
    "name": "Celestial Celestial Guardian",
    "type": "Humanoid",
    "rank": "S",
    "hp": 211,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0225.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0226",
    "name": "Celestial Ancient Dragon",
    "type": "Undead",
    "rank": "D",
    "hp": 122,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0226.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0227",
    "name": "Celestial Void Wraith",
    "type": "Dragon",
    "rank": "C",
    "hp": 783,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0227.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0228",
    "name": "Celestial Shadow Lurker",
    "type": "Elemental",
    "rank": "B",
    "hp": 523,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0228.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0229",
    "name": "Celestial Demonic Overlord",
    "type": "Demon",
    "rank": "A",
    "hp": 898,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0229.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0230",
    "name": "Celestial Celestial Serpent",
    "type": "Beast",
    "rank": "S",
    "hp": 1086,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0230.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0231",
    "name": "Celestial Abyssal Titan",
    "type": "Humanoid",
    "rank": "D",
    "hp": 237,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0231.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0232",
    "name": "Celestial Void Stalker",
    "type": "Undead",
    "rank": "C",
    "hp": 756,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0232.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0233",
    "name": "Celestial Shadow Revenant",
    "type": "Dragon",
    "rank": "B",
    "hp": 441,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0233.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0234",
    "name": "Celestial Demonic Warlord",
    "type": "Elemental",
    "rank": "A",
    "hp": 871,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0234.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0235",
    "name": "Celestial Celestial Phoenix",
    "type": "Demon",
    "rank": "S",
    "hp": 575,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0235.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0236",
    "name": "Celestial Ancient Lich",
    "type": "Beast",
    "rank": "D",
    "hp": 796,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0236.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0237",
    "name": "Celestial Void Devourer",
    "type": "Humanoid",
    "rank": "C",
    "hp": 824,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0237.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0238",
    "name": "Celestial Shadow Assassin",
    "type": "Undead",
    "rank": "B",
    "hp": 490,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0238.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0239",
    "name": "Celestial Demonic Berserker",
    "type": "Dragon",
    "rank": "A",
    "hp": 138,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0239.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0240",
    "name": "Celestial Celestial Paladin",
    "type": "Elemental",
    "rank": "S",
    "hp": 949,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0240.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0241",
    "name": "Eternal Shadow Demon",
    "type": "Demon",
    "rank": "D",
    "hp": 489,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0241.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0242",
    "name": "Eternal Void Beast",
    "type": "Beast",
    "rank": "C",
    "hp": 449,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0242.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0243",
    "name": "Eternal Abyssal Horror",
    "type": "Humanoid",
    "rank": "B",
    "hp": 441,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0243.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0244",
    "name": "Eternal Demonic Knight",
    "type": "Undead",
    "rank": "A",
    "hp": 159,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0244.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0245",
    "name": "Eternal Celestial Guardian",
    "type": "Dragon",
    "rank": "S",
    "hp": 286,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0245.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0246",
    "name": "Eternal Ancient Dragon",
    "type": "Elemental",
    "rank": "D",
    "hp": 459,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0246.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0247",
    "name": "Eternal Void Wraith",
    "type": "Demon",
    "rank": "C",
    "hp": 855,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0247.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0248",
    "name": "Eternal Shadow Lurker",
    "type": "Beast",
    "rank": "B",
    "hp": 128,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0248.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0249",
    "name": "Eternal Demonic Overlord",
    "type": "Humanoid",
    "rank": "A",
    "hp": 883,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0249.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0250",
    "name": "Eternal Celestial Serpent",
    "type": "Undead",
    "rank": "S",
    "hp": 161,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0250.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0251",
    "name": "Eternal Abyssal Titan",
    "type": "Dragon",
    "rank": "D",
    "hp": 379,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0251.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0252",
    "name": "Eternal Void Stalker",
    "type": "Elemental",
    "rank": "C",
    "hp": 285,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0252.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0253",
    "name": "Eternal Shadow Revenant",
    "type": "Demon",
    "rank": "B",
    "hp": 596,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0253.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0254",
    "name": "Eternal Demonic Warlord",
    "type": "Beast",
    "rank": "A",
    "hp": 845,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0254.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0255",
    "name": "Eternal Celestial Phoenix",
    "type": "Humanoid",
    "rank": "S",
    "hp": 600,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0255.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0256",
    "name": "Eternal Ancient Lich",
    "type": "Undead",
    "rank": "D",
    "hp": 300,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0256.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0257",
    "name": "Eternal Void Devourer",
    "type": "Dragon",
    "rank": "C",
    "hp": 1000,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0257.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0258",
    "name": "Eternal Shadow Assassin",
    "type": "Elemental",
    "rank": "B",
    "hp": 266,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0258.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0259",
    "name": "Eternal Demonic Berserker",
    "type": "Demon",
    "rank": "A",
    "hp": 363,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0259.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0260",
    "name": "Eternal Celestial Paladin",
    "type": "Beast",
    "rank": "S",
    "hp": 498,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0260.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0261",
    "name": "Corrupted Shadow Demon",
    "type": "Humanoid",
    "rank": "D",
    "hp": 1049,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0261.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0262",
    "name": "Corrupted Void Beast",
    "type": "Undead",
    "rank": "C",
    "hp": 905,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0262.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0263",
    "name": "Corrupted Abyssal Horror",
    "type": "Dragon",
    "rank": "B",
    "hp": 815,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0263.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0264",
    "name": "Corrupted Demonic Knight",
    "type": "Elemental",
    "rank": "A",
    "hp": 842,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0264.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0265",
    "name": "Corrupted Celestial Guardian",
    "type": "Demon",
    "rank": "S",
    "hp": 425,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0265.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0266",
    "name": "Corrupted Ancient Dragon",
    "type": "Beast",
    "rank": "D",
    "hp": 606,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0266.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0267",
    "name": "Corrupted Void Wraith",
    "type": "Humanoid",
    "rank": "C",
    "hp": 524,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0267.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0268",
    "name": "Corrupted Shadow Lurker",
    "type": "Undead",
    "rank": "B",
    "hp": 914,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0268.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0269",
    "name": "Corrupted Demonic Overlord",
    "type": "Dragon",
    "rank": "A",
    "hp": 701,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0269.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0270",
    "name": "Corrupted Celestial Serpent",
    "type": "Elemental",
    "rank": "S",
    "hp": 341,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0270.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0271",
    "name": "Corrupted Abyssal Titan",
    "type": "Demon",
    "rank": "D",
    "hp": 136,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0271.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0272",
    "name": "Corrupted Void Stalker",
    "type": "Beast",
    "rank": "C",
    "hp": 792,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0272.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0273",
    "name": "Corrupted Shadow Revenant",
    "type": "Humanoid",
    "rank": "B",
    "hp": 925,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0273.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0274",
    "name": "Corrupted Demonic Warlord",
    "type": "Undead",
    "rank": "A",
    "hp": 590,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0274.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0275",
    "name": "Corrupted Celestial Phoenix",
    "type": "Dragon",
    "rank": "S",
    "hp": 617,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0275.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0276",
    "name": "Corrupted Ancient Lich",
    "type": "Elemental",
    "rank": "D",
    "hp": 261,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0276.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0277",
    "name": "Corrupted Void Devourer",
    "type": "Demon",
    "rank": "C",
    "hp": 135,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0277.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0278",
    "name": "Corrupted Shadow Assassin",
    "type": "Beast",
    "rank": "B",
    "hp": 225,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0278.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0279",
    "name": "Corrupted Demonic Berserker",
    "type": "Humanoid",
    "rank": "A",
    "hp": 197,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0279.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0280",
    "name": "Corrupted Celestial Paladin",
    "type": "Undead",
    "rank": "S",
    "hp": 951,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0280.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0281",
    "name": "Blessed Shadow Demon",
    "type": "Dragon",
    "rank": "D",
    "hp": 400,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0281.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0282",
    "name": "Blessed Void Beast",
    "type": "Elemental",
    "rank": "C",
    "hp": 950,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0282.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0283",
    "name": "Blessed Abyssal Horror",
    "type": "Demon",
    "rank": "B",
    "hp": 706,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0283.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0284",
    "name": "Blessed Demonic Knight",
    "type": "Beast",
    "rank": "A",
    "hp": 907,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0284.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0285",
    "name": "Blessed Celestial Guardian",
    "type": "Humanoid",
    "rank": "S",
    "hp": 749,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0285.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0286",
    "name": "Blessed Ancient Dragon",
    "type": "Undead",
    "rank": "D",
    "hp": 860,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0286.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0287",
    "name": "Blessed Void Wraith",
    "type": "Dragon",
    "rank": "C",
    "hp": 598,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0287.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0288",
    "name": "Blessed Shadow Lurker",
    "type": "Elemental",
    "rank": "B",
    "hp": 791,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0288.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0289",
    "name": "Blessed Demonic Overlord",
    "type": "Demon",
    "rank": "A",
    "hp": 304,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0289.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0290",
    "name": "Blessed Celestial Serpent",
    "type": "Beast",
    "rank": "S",
    "hp": 984,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0290.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0291",
    "name": "Blessed Abyssal Titan",
    "type": "Humanoid",
    "rank": "D",
    "hp": 246,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0291.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0292",
    "name": "Blessed Void Stalker",
    "type": "Undead",
    "rank": "C",
    "hp": 459,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0292.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0293",
    "name": "Blessed Shadow Revenant",
    "type": "Dragon",
    "rank": "B",
    "hp": 1019,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0293.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0294",
    "name": "Blessed Demonic Warlord",
    "type": "Elemental",
    "rank": "A",
    "hp": 984,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0294.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0295",
    "name": "Blessed Celestial Phoenix",
    "type": "Demon",
    "rank": "S",
    "hp": 141,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0295.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0296",
    "name": "Blessed Ancient Lich",
    "type": "Beast",
    "rank": "D",
    "hp": 972,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0296.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0297",
    "name": "Blessed Void Devourer",
    "type": "Humanoid",
    "rank": "C",
    "hp": 504,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0297.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0298",
    "name": "Blessed Shadow Assassin",
    "type": "Undead",
    "rank": "B",
    "hp": 802,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0298.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0299",
    "name": "Blessed Demonic Berserker",
    "type": "Dragon",
    "rank": "A",
    "hp": 299,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0299.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0300",
    "name": "Blessed Celestial Paladin",
    "type": "Elemental",
    "rank": "S",
    "hp": 121,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0300.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0301",
    "name": "Cursed Shadow Demon",
    "type": "Demon",
    "rank": "D",
    "hp": 1078,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0301.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0302",
    "name": "Cursed Void Beast",
    "type": "Beast",
    "rank": "C",
    "hp": 644,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0302.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0303",
    "name": "Cursed Abyssal Horror",
    "type": "Humanoid",
    "rank": "B",
    "hp": 736,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0303.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0304",
    "name": "Cursed Demonic Knight",
    "type": "Undead",
    "rank": "A",
    "hp": 679,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0304.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0305",
    "name": "Cursed Celestial Guardian",
    "type": "Dragon",
    "rank": "S",
    "hp": 1003,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0305.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0306",
    "name": "Cursed Ancient Dragon",
    "type": "Elemental",
    "rank": "D",
    "hp": 579,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0306.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0307",
    "name": "Cursed Void Wraith",
    "type": "Demon",
    "rank": "C",
    "hp": 687,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0307.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0308",
    "name": "Cursed Shadow Lurker",
    "type": "Beast",
    "rank": "B",
    "hp": 448,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0308.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0309",
    "name": "Cursed Demonic Overlord",
    "type": "Humanoid",
    "rank": "A",
    "hp": 298,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0309.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0310",
    "name": "Cursed Celestial Serpent",
    "type": "Undead",
    "rank": "S",
    "hp": 271,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0310.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0311",
    "name": "Cursed Abyssal Titan",
    "type": "Dragon",
    "rank": "D",
    "hp": 387,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0311.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0312",
    "name": "Cursed Void Stalker",
    "type": "Elemental",
    "rank": "C",
    "hp": 580,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0312.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0313",
    "name": "Cursed Shadow Revenant",
    "type": "Demon",
    "rank": "B",
    "hp": 159,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0313.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0314",
    "name": "Cursed Demonic Warlord",
    "type": "Beast",
    "rank": "A",
    "hp": 649,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0314.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0315",
    "name": "Cursed Celestial Phoenix",
    "type": "Humanoid",
    "rank": "S",
    "hp": 521,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0315.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0316",
    "name": "Cursed Ancient Lich",
    "type": "Undead",
    "rank": "D",
    "hp": 634,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0316.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0317",
    "name": "Cursed Void Devourer",
    "type": "Dragon",
    "rank": "C",
    "hp": 527,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0317.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0318",
    "name": "Cursed Shadow Assassin",
    "type": "Elemental",
    "rank": "B",
    "hp": 592,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0318.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0319",
    "name": "Cursed Demonic Berserker",
    "type": "Demon",
    "rank": "A",
    "hp": 777,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0319.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0320",
    "name": "Cursed Celestial Paladin",
    "type": "Beast",
    "rank": "S",
    "hp": 912,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0320.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0321",
    "name": "Ancient Shadow Demon",
    "type": "Humanoid",
    "rank": "D",
    "hp": 836,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0321.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0322",
    "name": "Ancient Void Beast",
    "type": "Undead",
    "rank": "C",
    "hp": 823,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0322.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0323",
    "name": "Ancient Abyssal Horror",
    "type": "Dragon",
    "rank": "B",
    "hp": 136,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0323.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0324",
    "name": "Ancient Demonic Knight",
    "type": "Elemental",
    "rank": "A",
    "hp": 407,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0324.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0325",
    "name": "Ancient Celestial Guardian",
    "type": "Demon",
    "rank": "S",
    "hp": 906,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0325.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0326",
    "name": "Ancient Ancient Dragon",
    "type": "Beast",
    "rank": "D",
    "hp": 704,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0326.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0327",
    "name": "Ancient Void Wraith",
    "type": "Humanoid",
    "rank": "C",
    "hp": 658,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0327.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0328",
    "name": "Ancient Shadow Lurker",
    "type": "Undead",
    "rank": "B",
    "hp": 122,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0328.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0329",
    "name": "Ancient Demonic Overlord",
    "type": "Dragon",
    "rank": "A",
    "hp": 721,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0329.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0330",
    "name": "Ancient Celestial Serpent",
    "type": "Elemental",
    "rank": "S",
    "hp": 567,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0330.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0331",
    "name": "Ancient Abyssal Titan",
    "type": "Demon",
    "rank": "D",
    "hp": 106,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0331.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0332",
    "name": "Ancient Void Stalker",
    "type": "Beast",
    "rank": "C",
    "hp": 1088,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0332.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0333",
    "name": "Ancient Shadow Revenant",
    "type": "Humanoid",
    "rank": "B",
    "hp": 278,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0333.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0334",
    "name": "Ancient Demonic Warlord",
    "type": "Undead",
    "rank": "A",
    "hp": 586,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0334.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0335",
    "name": "Ancient Celestial Phoenix",
    "type": "Dragon",
    "rank": "S",
    "hp": 570,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0335.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0336",
    "name": "Ancient Ancient Lich",
    "type": "Elemental",
    "rank": "D",
    "hp": 226,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0336.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0337",
    "name": "Ancient Void Devourer",
    "type": "Demon",
    "rank": "C",
    "hp": 366,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0337.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0338",
    "name": "Ancient Shadow Assassin",
    "type": "Beast",
    "rank": "B",
    "hp": 1056,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0338.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0339",
    "name": "Ancient Demonic Berserker",
    "type": "Humanoid",
    "rank": "A",
    "hp": 480,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0339.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0340",
    "name": "Ancient Celestial Paladin",
    "type": "Undead",
    "rank": "S",
    "hp": 718,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0340.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0341",
    "name": "Primordial Shadow Demon",
    "type": "Dragon",
    "rank": "D",
    "hp": 319,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0341.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0342",
    "name": "Primordial Void Beast",
    "type": "Elemental",
    "rank": "C",
    "hp": 1050,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0342.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0343",
    "name": "Primordial Abyssal Horror",
    "type": "Demon",
    "rank": "B",
    "hp": 1089,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0343.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0344",
    "name": "Primordial Demonic Knight",
    "type": "Beast",
    "rank": "A",
    "hp": 921,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0344.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0345",
    "name": "Primordial Celestial Guardian",
    "type": "Humanoid",
    "rank": "S",
    "hp": 352,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0345.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0346",
    "name": "Primordial Ancient Dragon",
    "type": "Undead",
    "rank": "D",
    "hp": 494,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0346.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0347",
    "name": "Primordial Void Wraith",
    "type": "Dragon",
    "rank": "C",
    "hp": 721,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0347.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0348",
    "name": "Primordial Shadow Lurker",
    "type": "Elemental",
    "rank": "B",
    "hp": 190,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0348.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0349",
    "name": "Primordial Demonic Overlord",
    "type": "Demon",
    "rank": "A",
    "hp": 597,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0349.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0350",
    "name": "Primordial Celestial Serpent",
    "type": "Beast",
    "rank": "S",
    "hp": 145,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0350.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0351",
    "name": "Primordial Abyssal Titan",
    "type": "Humanoid",
    "rank": "D",
    "hp": 397,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0351.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0352",
    "name": "Primordial Void Stalker",
    "type": "Undead",
    "rank": "C",
    "hp": 552,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0352.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0353",
    "name": "Primordial Shadow Revenant",
    "type": "Dragon",
    "rank": "B",
    "hp": 452,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0353.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0354",
    "name": "Primordial Demonic Warlord",
    "type": "Elemental",
    "rank": "A",
    "hp": 202,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0354.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0355",
    "name": "Primordial Celestial Phoenix",
    "type": "Demon",
    "rank": "S",
    "hp": 658,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0355.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0356",
    "name": "Primordial Ancient Lich",
    "type": "Beast",
    "rank": "D",
    "hp": 668,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0356.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0357",
    "name": "Primordial Void Devourer",
    "type": "Humanoid",
    "rank": "C",
    "hp": 686,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0357.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0358",
    "name": "Primordial Shadow Assassin",
    "type": "Undead",
    "rank": "B",
    "hp": 395,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0358.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0359",
    "name": "Primordial Demonic Berserker",
    "type": "Dragon",
    "rank": "A",
    "hp": 1030,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0359.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0360",
    "name": "Primordial Celestial Paladin",
    "type": "Elemental",
    "rank": "S",
    "hp": 751,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0360.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0361",
    "name": "Supreme Shadow Demon",
    "type": "Demon",
    "rank": "D",
    "hp": 1065,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0361.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0362",
    "name": "Supreme Void Beast",
    "type": "Beast",
    "rank": "C",
    "hp": 646,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0362.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0363",
    "name": "Supreme Abyssal Horror",
    "type": "Humanoid",
    "rank": "B",
    "hp": 923,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0363.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0364",
    "name": "Supreme Demonic Knight",
    "type": "Undead",
    "rank": "A",
    "hp": 565,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0364.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0365",
    "name": "Supreme Celestial Guardian",
    "type": "Dragon",
    "rank": "S",
    "hp": 389,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0365.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0366",
    "name": "Supreme Ancient Dragon",
    "type": "Elemental",
    "rank": "D",
    "hp": 161,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0366.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0367",
    "name": "Supreme Void Wraith",
    "type": "Demon",
    "rank": "C",
    "hp": 203,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0367.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0368",
    "name": "Supreme Shadow Lurker",
    "type": "Beast",
    "rank": "B",
    "hp": 210,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0368.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0369",
    "name": "Supreme Demonic Overlord",
    "type": "Humanoid",
    "rank": "A",
    "hp": 394,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0369.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0370",
    "name": "Supreme Celestial Serpent",
    "type": "Undead",
    "rank": "S",
    "hp": 237,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0370.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0371",
    "name": "Supreme Abyssal Titan",
    "type": "Dragon",
    "rank": "D",
    "hp": 352,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0371.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0372",
    "name": "Supreme Void Stalker",
    "type": "Elemental",
    "rank": "C",
    "hp": 474,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0372.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0373",
    "name": "Supreme Shadow Revenant",
    "type": "Demon",
    "rank": "B",
    "hp": 458,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0373.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0374",
    "name": "Supreme Demonic Warlord",
    "type": "Beast",
    "rank": "A",
    "hp": 263,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0374.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0375",
    "name": "Supreme Celestial Phoenix",
    "type": "Humanoid",
    "rank": "S",
    "hp": 167,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0375.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0376",
    "name": "Supreme Ancient Lich",
    "type": "Undead",
    "rank": "D",
    "hp": 162,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0376.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0377",
    "name": "Supreme Void Devourer",
    "type": "Dragon",
    "rank": "C",
    "hp": 1029,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0377.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0378",
    "name": "Supreme Shadow Assassin",
    "type": "Elemental",
    "rank": "B",
    "hp": 144,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0378.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0379",
    "name": "Supreme Demonic Berserker",
    "type": "Demon",
    "rank": "A",
    "hp": 947,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0379.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0380",
    "name": "Supreme Celestial Paladin",
    "type": "Beast",
    "rank": "S",
    "hp": 419,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0380.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0381",
    "name": "Legendary Shadow Demon",
    "type": "Humanoid",
    "rank": "D",
    "hp": 553,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0381.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0382",
    "name": "Legendary Void Beast",
    "type": "Undead",
    "rank": "C",
    "hp": 1033,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0382.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0383",
    "name": "Legendary Abyssal Horror",
    "type": "Dragon",
    "rank": "B",
    "hp": 893,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0383.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0384",
    "name": "Legendary Demonic Knight",
    "type": "Elemental",
    "rank": "A",
    "hp": 794,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0384.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0385",
    "name": "Legendary Celestial Guardian",
    "type": "Demon",
    "rank": "S",
    "hp": 1038,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0385.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0386",
    "name": "Legendary Ancient Dragon",
    "type": "Beast",
    "rank": "D",
    "hp": 609,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0386.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0387",
    "name": "Legendary Void Wraith",
    "type": "Humanoid",
    "rank": "C",
    "hp": 1059,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0387.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0388",
    "name": "Legendary Shadow Lurker",
    "type": "Undead",
    "rank": "B",
    "hp": 743,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0388.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0389",
    "name": "Legendary Demonic Overlord",
    "type": "Dragon",
    "rank": "A",
    "hp": 352,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0389.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0390",
    "name": "Legendary Celestial Serpent",
    "type": "Elemental",
    "rank": "S",
    "hp": 1089,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0390.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0391",
    "name": "Legendary Abyssal Titan",
    "type": "Demon",
    "rank": "D",
    "hp": 696,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0391.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0392",
    "name": "Legendary Void Stalker",
    "type": "Beast",
    "rank": "C",
    "hp": 713,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0392.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0393",
    "name": "Legendary Shadow Revenant",
    "type": "Humanoid",
    "rank": "B",
    "hp": 271,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0393.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0394",
    "name": "Legendary Demonic Warlord",
    "type": "Undead",
    "rank": "A",
    "hp": 988,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0394.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0395",
    "name": "Legendary Celestial Phoenix",
    "type": "Dragon",
    "rank": "S",
    "hp": 505,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0395.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0396",
    "name": "Legendary Ancient Lich",
    "type": "Elemental",
    "rank": "D",
    "hp": 708,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0396.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0397",
    "name": "Legendary Void Devourer",
    "type": "Demon",
    "rank": "C",
    "hp": 164,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0397.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0398",
    "name": "Legendary Shadow Assassin",
    "type": "Beast",
    "rank": "B",
    "hp": 882,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0398.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0399",
    "name": "Legendary Demonic Berserker",
    "type": "Humanoid",
    "rank": "A",
    "hp": 904,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0399.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0400",
    "name": "Legendary Celestial Paladin",
    "type": "Undead",
    "rank": "S",
    "hp": 480,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0400.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0401",
    "name": "Mythic Shadow Demon",
    "type": "Dragon",
    "rank": "D",
    "hp": 1041,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0401.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0402",
    "name": "Mythic Void Beast",
    "type": "Elemental",
    "rank": "C",
    "hp": 1071,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0402.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0403",
    "name": "Mythic Abyssal Horror",
    "type": "Demon",
    "rank": "B",
    "hp": 625,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0403.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0404",
    "name": "Mythic Demonic Knight",
    "type": "Beast",
    "rank": "A",
    "hp": 1042,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0404.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0405",
    "name": "Mythic Celestial Guardian",
    "type": "Humanoid",
    "rank": "S",
    "hp": 133,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0405.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0406",
    "name": "Mythic Ancient Dragon",
    "type": "Undead",
    "rank": "D",
    "hp": 465,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0406.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0407",
    "name": "Mythic Void Wraith",
    "type": "Dragon",
    "rank": "C",
    "hp": 378,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0407.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0408",
    "name": "Mythic Shadow Lurker",
    "type": "Elemental",
    "rank": "B",
    "hp": 208,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0408.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0409",
    "name": "Mythic Demonic Overlord",
    "type": "Demon",
    "rank": "A",
    "hp": 874,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0409.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0410",
    "name": "Mythic Celestial Serpent",
    "type": "Beast",
    "rank": "S",
    "hp": 168,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0410.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0411",
    "name": "Mythic Abyssal Titan",
    "type": "Humanoid",
    "rank": "D",
    "hp": 248,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0411.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0412",
    "name": "Mythic Void Stalker",
    "type": "Undead",
    "rank": "C",
    "hp": 781,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0412.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0413",
    "name": "Mythic Shadow Revenant",
    "type": "Dragon",
    "rank": "B",
    "hp": 938,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0413.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0414",
    "name": "Mythic Demonic Warlord",
    "type": "Elemental",
    "rank": "A",
    "hp": 1030,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0414.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0415",
    "name": "Mythic Celestial Phoenix",
    "type": "Demon",
    "rank": "S",
    "hp": 384,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0415.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0416",
    "name": "Mythic Ancient Lich",
    "type": "Beast",
    "rank": "D",
    "hp": 615,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0416.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0417",
    "name": "Mythic Void Devourer",
    "type": "Humanoid",
    "rank": "C",
    "hp": 621,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0417.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0418",
    "name": "Mythic Shadow Assassin",
    "type": "Undead",
    "rank": "B",
    "hp": 333,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0418.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0419",
    "name": "Mythic Demonic Berserker",
    "type": "Dragon",
    "rank": "A",
    "hp": 465,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0419.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0420",
    "name": "Mythic Celestial Paladin",
    "type": "Elemental",
    "rank": "S",
    "hp": 1066,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0420.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0421",
    "name": "Divine Shadow Demon",
    "type": "Demon",
    "rank": "D",
    "hp": 694,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0421.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0422",
    "name": "Divine Void Beast",
    "type": "Beast",
    "rank": "C",
    "hp": 290,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0422.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0423",
    "name": "Divine Abyssal Horror",
    "type": "Humanoid",
    "rank": "B",
    "hp": 754,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0423.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0424",
    "name": "Divine Demonic Knight",
    "type": "Undead",
    "rank": "A",
    "hp": 405,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0424.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0425",
    "name": "Divine Celestial Guardian",
    "type": "Dragon",
    "rank": "S",
    "hp": 1023,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0425.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0426",
    "name": "Divine Ancient Dragon",
    "type": "Elemental",
    "rank": "D",
    "hp": 547,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0426.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0427",
    "name": "Divine Void Wraith",
    "type": "Demon",
    "rank": "C",
    "hp": 791,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0427.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0428",
    "name": "Divine Shadow Lurker",
    "type": "Beast",
    "rank": "B",
    "hp": 902,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0428.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0429",
    "name": "Divine Demonic Overlord",
    "type": "Humanoid",
    "rank": "A",
    "hp": 862,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0429.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0430",
    "name": "Divine Celestial Serpent",
    "type": "Undead",
    "rank": "S",
    "hp": 550,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0430.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0431",
    "name": "Divine Abyssal Titan",
    "type": "Dragon",
    "rank": "D",
    "hp": 910,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0431.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0432",
    "name": "Divine Void Stalker",
    "type": "Elemental",
    "rank": "C",
    "hp": 633,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0432.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0433",
    "name": "Divine Shadow Revenant",
    "type": "Demon",
    "rank": "B",
    "hp": 602,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0433.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0434",
    "name": "Divine Demonic Warlord",
    "type": "Beast",
    "rank": "A",
    "hp": 799,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0434.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0435",
    "name": "Divine Celestial Phoenix",
    "type": "Humanoid",
    "rank": "S",
    "hp": 838,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0435.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0436",
    "name": "Divine Ancient Lich",
    "type": "Undead",
    "rank": "D",
    "hp": 637,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0436.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0437",
    "name": "Divine Void Devourer",
    "type": "Dragon",
    "rank": "C",
    "hp": 611,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0437.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0438",
    "name": "Divine Shadow Assassin",
    "type": "Elemental",
    "rank": "B",
    "hp": 817,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0438.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0439",
    "name": "Divine Demonic Berserker",
    "type": "Demon",
    "rank": "A",
    "hp": 698,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0439.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0440",
    "name": "Divine Celestial Paladin",
    "type": "Beast",
    "rank": "S",
    "hp": 168,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0440.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0441",
    "name": "Infernal Shadow Demon",
    "type": "Humanoid",
    "rank": "D",
    "hp": 534,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0441.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0442",
    "name": "Infernal Void Beast",
    "type": "Undead",
    "rank": "C",
    "hp": 549,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0442.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0443",
    "name": "Infernal Abyssal Horror",
    "type": "Dragon",
    "rank": "B",
    "hp": 862,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0443.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0444",
    "name": "Infernal Demonic Knight",
    "type": "Elemental",
    "rank": "A",
    "hp": 920,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0444.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0445",
    "name": "Infernal Celestial Guardian",
    "type": "Demon",
    "rank": "S",
    "hp": 763,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0445.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0446",
    "name": "Infernal Ancient Dragon",
    "type": "Beast",
    "rank": "D",
    "hp": 1034,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0446.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0447",
    "name": "Infernal Void Wraith",
    "type": "Humanoid",
    "rank": "C",
    "hp": 940,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0447.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0448",
    "name": "Infernal Shadow Lurker",
    "type": "Undead",
    "rank": "B",
    "hp": 327,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0448.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0449",
    "name": "Infernal Demonic Overlord",
    "type": "Dragon",
    "rank": "A",
    "hp": 615,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0449.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0450",
    "name": "Infernal Celestial Serpent",
    "type": "Elemental",
    "rank": "S",
    "hp": 1077,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0450.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0451",
    "name": "Infernal Abyssal Titan",
    "type": "Demon",
    "rank": "D",
    "hp": 416,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0451.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0452",
    "name": "Infernal Void Stalker",
    "type": "Beast",
    "rank": "C",
    "hp": 852,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0452.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0453",
    "name": "Infernal Shadow Revenant",
    "type": "Humanoid",
    "rank": "B",
    "hp": 976,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0453.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0454",
    "name": "Infernal Demonic Warlord",
    "type": "Undead",
    "rank": "A",
    "hp": 937,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0454.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0455",
    "name": "Infernal Celestial Phoenix",
    "type": "Dragon",
    "rank": "S",
    "hp": 1041,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0455.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0456",
    "name": "Infernal Ancient Lich",
    "type": "Elemental",
    "rank": "D",
    "hp": 102,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0456.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0457",
    "name": "Infernal Void Devourer",
    "type": "Demon",
    "rank": "C",
    "hp": 247,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0457.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0458",
    "name": "Infernal Shadow Assassin",
    "type": "Beast",
    "rank": "B",
    "hp": 193,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0458.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0459",
    "name": "Infernal Demonic Berserker",
    "type": "Humanoid",
    "rank": "A",
    "hp": 108,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0459.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0460",
    "name": "Infernal Celestial Paladin",
    "type": "Undead",
    "rank": "S",
    "hp": 449,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0460.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0461",
    "name": "Celestial Shadow Demon",
    "type": "Dragon",
    "rank": "D",
    "hp": 1066,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0461.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0462",
    "name": "Celestial Void Beast",
    "type": "Elemental",
    "rank": "C",
    "hp": 134,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0462.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0463",
    "name": "Celestial Abyssal Horror",
    "type": "Demon",
    "rank": "B",
    "hp": 887,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0463.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0464",
    "name": "Celestial Demonic Knight",
    "type": "Beast",
    "rank": "A",
    "hp": 841,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0464.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0465",
    "name": "Celestial Celestial Guardian",
    "type": "Humanoid",
    "rank": "S",
    "hp": 1003,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0465.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0466",
    "name": "Celestial Ancient Dragon",
    "type": "Undead",
    "rank": "D",
    "hp": 1091,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0466.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0467",
    "name": "Celestial Void Wraith",
    "type": "Dragon",
    "rank": "C",
    "hp": 791,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0467.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0468",
    "name": "Celestial Shadow Lurker",
    "type": "Elemental",
    "rank": "B",
    "hp": 123,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0468.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0469",
    "name": "Celestial Demonic Overlord",
    "type": "Demon",
    "rank": "A",
    "hp": 1020,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0469.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0470",
    "name": "Celestial Celestial Serpent",
    "type": "Beast",
    "rank": "S",
    "hp": 834,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0470.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0471",
    "name": "Celestial Abyssal Titan",
    "type": "Humanoid",
    "rank": "D",
    "hp": 192,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0471.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0472",
    "name": "Celestial Void Stalker",
    "type": "Undead",
    "rank": "C",
    "hp": 316,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0472.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0473",
    "name": "Celestial Shadow Revenant",
    "type": "Dragon",
    "rank": "B",
    "hp": 1056,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0473.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0474",
    "name": "Celestial Demonic Warlord",
    "type": "Elemental",
    "rank": "A",
    "hp": 108,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0474.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0475",
    "name": "Celestial Celestial Phoenix",
    "type": "Demon",
    "rank": "S",
    "hp": 191,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0475.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0476",
    "name": "Celestial Ancient Lich",
    "type": "Beast",
    "rank": "D",
    "hp": 551,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0476.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0477",
    "name": "Celestial Void Devourer",
    "type": "Humanoid",
    "rank": "C",
    "hp": 898,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0477.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0478",
    "name": "Celestial Shadow Assassin",
    "type": "Undead",
    "rank": "B",
    "hp": 212,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0478.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0479",
    "name": "Celestial Demonic Berserker",
    "type": "Dragon",
    "rank": "A",
    "hp": 921,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0479.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0480",
    "name": "Celestial Celestial Paladin",
    "type": "Elemental",
    "rank": "S",
    "hp": 213,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0480.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0481",
    "name": "Eternal Shadow Demon",
    "type": "Demon",
    "rank": "D",
    "hp": 993,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0481.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0482",
    "name": "Eternal Void Beast",
    "type": "Beast",
    "rank": "C",
    "hp": 510,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0482.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0483",
    "name": "Eternal Abyssal Horror",
    "type": "Humanoid",
    "rank": "B",
    "hp": 770,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0483.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0484",
    "name": "Eternal Demonic Knight",
    "type": "Undead",
    "rank": "A",
    "hp": 848,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0484.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0485",
    "name": "Eternal Celestial Guardian",
    "type": "Dragon",
    "rank": "S",
    "hp": 105,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0485.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0486",
    "name": "Eternal Ancient Dragon",
    "type": "Elemental",
    "rank": "D",
    "hp": 684,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0486.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0487",
    "name": "Eternal Void Wraith",
    "type": "Demon",
    "rank": "C",
    "hp": 523,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0487.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0488",
    "name": "Eternal Shadow Lurker",
    "type": "Beast",
    "rank": "B",
    "hp": 740,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0488.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0489",
    "name": "Eternal Demonic Overlord",
    "type": "Humanoid",
    "rank": "A",
    "hp": 936,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0489.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0490",
    "name": "Eternal Celestial Serpent",
    "type": "Undead",
    "rank": "S",
    "hp": 785,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0490.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0491",
    "name": "Eternal Abyssal Titan",
    "type": "Dragon",
    "rank": "D",
    "hp": 895,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0491.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0492",
    "name": "Eternal Void Stalker",
    "type": "Elemental",
    "rank": "C",
    "hp": 530,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0492.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0493",
    "name": "Eternal Shadow Revenant",
    "type": "Demon",
    "rank": "B",
    "hp": 356,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0493.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0494",
    "name": "Eternal Demonic Warlord",
    "type": "Beast",
    "rank": "A",
    "hp": 822,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0494.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0495",
    "name": "Eternal Celestial Phoenix",
    "type": "Humanoid",
    "rank": "S",
    "hp": 784,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0495.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0496",
    "name": "Eternal Ancient Lich",
    "type": "Undead",
    "rank": "D",
    "hp": 186,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0496.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0497",
    "name": "Eternal Void Devourer",
    "type": "Dragon",
    "rank": "C",
    "hp": 918,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0497.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0498",
    "name": "Eternal Shadow Assassin",
    "type": "Elemental",
    "rank": "B",
    "hp": 171,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0498.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0499",
    "name": "Eternal Demonic Berserker",
    "type": "Demon",
    "rank": "A",
    "hp": 848,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0499.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0500",
    "name": "Eternal Celestial Paladin",
    "type": "Beast",
    "rank": "S",
    "hp": 593,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0500.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0501",
    "name": "Corrupted Shadow Demon",
    "type": "Humanoid",
    "rank": "D",
    "hp": 276,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0501.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0502",
    "name": "Corrupted Void Beast",
    "type": "Undead",
    "rank": "C",
    "hp": 571,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0502.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0503",
    "name": "Corrupted Abyssal Horror",
    "type": "Dragon",
    "rank": "B",
    "hp": 623,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0503.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0504",
    "name": "Corrupted Demonic Knight",
    "type": "Elemental",
    "rank": "A",
    "hp": 1059,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0504.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0505",
    "name": "Corrupted Celestial Guardian",
    "type": "Demon",
    "rank": "S",
    "hp": 346,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0505.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0506",
    "name": "Corrupted Ancient Dragon",
    "type": "Beast",
    "rank": "D",
    "hp": 259,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0506.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0507",
    "name": "Corrupted Void Wraith",
    "type": "Humanoid",
    "rank": "C",
    "hp": 458,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0507.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0508",
    "name": "Corrupted Shadow Lurker",
    "type": "Undead",
    "rank": "B",
    "hp": 841,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0508.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0509",
    "name": "Corrupted Demonic Overlord",
    "type": "Dragon",
    "rank": "A",
    "hp": 608,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0509.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0510",
    "name": "Corrupted Celestial Serpent",
    "type": "Elemental",
    "rank": "S",
    "hp": 585,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0510.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0511",
    "name": "Corrupted Abyssal Titan",
    "type": "Demon",
    "rank": "D",
    "hp": 243,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0511.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0512",
    "name": "Corrupted Void Stalker",
    "type": "Beast",
    "rank": "C",
    "hp": 249,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0512.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0513",
    "name": "Corrupted Shadow Revenant",
    "type": "Humanoid",
    "rank": "B",
    "hp": 629,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0513.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0514",
    "name": "Corrupted Demonic Warlord",
    "type": "Undead",
    "rank": "A",
    "hp": 812,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0514.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0515",
    "name": "Corrupted Celestial Phoenix",
    "type": "Dragon",
    "rank": "S",
    "hp": 517,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0515.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0516",
    "name": "Corrupted Ancient Lich",
    "type": "Elemental",
    "rank": "D",
    "hp": 883,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0516.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0517",
    "name": "Corrupted Void Devourer",
    "type": "Demon",
    "rank": "C",
    "hp": 841,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0517.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0518",
    "name": "Corrupted Shadow Assassin",
    "type": "Beast",
    "rank": "B",
    "hp": 472,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0518.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0519",
    "name": "Corrupted Demonic Berserker",
    "type": "Humanoid",
    "rank": "A",
    "hp": 1090,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0519.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0520",
    "name": "Corrupted Celestial Paladin",
    "type": "Undead",
    "rank": "S",
    "hp": 459,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0520.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0521",
    "name": "Blessed Shadow Demon",
    "type": "Dragon",
    "rank": "D",
    "hp": 853,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0521.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0522",
    "name": "Blessed Void Beast",
    "type": "Elemental",
    "rank": "C",
    "hp": 703,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0522.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0523",
    "name": "Blessed Abyssal Horror",
    "type": "Demon",
    "rank": "B",
    "hp": 119,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0523.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0524",
    "name": "Blessed Demonic Knight",
    "type": "Beast",
    "rank": "A",
    "hp": 757,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0524.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0525",
    "name": "Blessed Celestial Guardian",
    "type": "Humanoid",
    "rank": "S",
    "hp": 145,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0525.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0526",
    "name": "Blessed Ancient Dragon",
    "type": "Undead",
    "rank": "D",
    "hp": 419,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0526.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0527",
    "name": "Blessed Void Wraith",
    "type": "Dragon",
    "rank": "C",
    "hp": 676,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0527.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0528",
    "name": "Blessed Shadow Lurker",
    "type": "Elemental",
    "rank": "B",
    "hp": 170,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0528.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0529",
    "name": "Blessed Demonic Overlord",
    "type": "Demon",
    "rank": "A",
    "hp": 646,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0529.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0530",
    "name": "Blessed Celestial Serpent",
    "type": "Beast",
    "rank": "S",
    "hp": 367,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0530.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0531",
    "name": "Blessed Abyssal Titan",
    "type": "Humanoid",
    "rank": "D",
    "hp": 396,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0531.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0532",
    "name": "Blessed Void Stalker",
    "type": "Undead",
    "rank": "C",
    "hp": 819,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0532.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0533",
    "name": "Blessed Shadow Revenant",
    "type": "Dragon",
    "rank": "B",
    "hp": 554,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0533.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0534",
    "name": "Blessed Demonic Warlord",
    "type": "Elemental",
    "rank": "A",
    "hp": 1046,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0534.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0535",
    "name": "Blessed Celestial Phoenix",
    "type": "Demon",
    "rank": "S",
    "hp": 261,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0535.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0536",
    "name": "Blessed Ancient Lich",
    "type": "Beast",
    "rank": "D",
    "hp": 167,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0536.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0537",
    "name": "Blessed Void Devourer",
    "type": "Humanoid",
    "rank": "C",
    "hp": 961,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0537.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0538",
    "name": "Blessed Shadow Assassin",
    "type": "Undead",
    "rank": "B",
    "hp": 450,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0538.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0539",
    "name": "Blessed Demonic Berserker",
    "type": "Dragon",
    "rank": "A",
    "hp": 501,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0539.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0540",
    "name": "Blessed Celestial Paladin",
    "type": "Elemental",
    "rank": "S",
    "hp": 534,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0540.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0541",
    "name": "Cursed Shadow Demon",
    "type": "Demon",
    "rank": "D",
    "hp": 546,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0541.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0542",
    "name": "Cursed Void Beast",
    "type": "Beast",
    "rank": "C",
    "hp": 355,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0542.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0543",
    "name": "Cursed Abyssal Horror",
    "type": "Humanoid",
    "rank": "B",
    "hp": 102,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0543.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0544",
    "name": "Cursed Demonic Knight",
    "type": "Undead",
    "rank": "A",
    "hp": 539,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0544.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0545",
    "name": "Cursed Celestial Guardian",
    "type": "Dragon",
    "rank": "S",
    "hp": 377,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0545.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0546",
    "name": "Cursed Ancient Dragon",
    "type": "Elemental",
    "rank": "D",
    "hp": 224,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0546.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0547",
    "name": "Cursed Void Wraith",
    "type": "Demon",
    "rank": "C",
    "hp": 271,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0547.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0548",
    "name": "Cursed Shadow Lurker",
    "type": "Beast",
    "rank": "B",
    "hp": 502,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0548.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0549",
    "name": "Cursed Demonic Overlord",
    "type": "Humanoid",
    "rank": "A",
    "hp": 933,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0549.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0550",
    "name": "Cursed Celestial Serpent",
    "type": "Undead",
    "rank": "S",
    "hp": 877,
    "ac": 12,
    "image": "/generated/compendium/monsters/monster-0550.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0551",
    "name": "Cursed Abyssal Titan",
    "type": "Dragon",
    "rank": "D",
    "hp": 924,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0551.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0552",
    "name": "Cursed Void Stalker",
    "type": "Elemental",
    "rank": "C",
    "hp": 603,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0552.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0553",
    "name": "Cursed Shadow Revenant",
    "type": "Demon",
    "rank": "B",
    "hp": 114,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0553.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0554",
    "name": "Cursed Demonic Warlord",
    "type": "Beast",
    "rank": "A",
    "hp": 877,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0554.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0555",
    "name": "Cursed Celestial Phoenix",
    "type": "Humanoid",
    "rank": "S",
    "hp": 506,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0555.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0556",
    "name": "Cursed Ancient Lich",
    "type": "Undead",
    "rank": "D",
    "hp": 553,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0556.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0557",
    "name": "Cursed Void Devourer",
    "type": "Dragon",
    "rank": "C",
    "hp": 263,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0557.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0558",
    "name": "Cursed Shadow Assassin",
    "type": "Elemental",
    "rank": "B",
    "hp": 103,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0558.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0559",
    "name": "Cursed Demonic Berserker",
    "type": "Demon",
    "rank": "A",
    "hp": 968,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0559.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0560",
    "name": "Cursed Celestial Paladin",
    "type": "Beast",
    "rank": "S",
    "hp": 782,
    "ac": 18,
    "image": "/generated/compendium/monsters/monster-0560.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0561",
    "name": "Ancient Shadow Demon",
    "type": "Humanoid",
    "rank": "D",
    "hp": 820,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0561.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0562",
    "name": "Ancient Void Beast",
    "type": "Undead",
    "rank": "C",
    "hp": 541,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0562.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0563",
    "name": "Ancient Abyssal Horror",
    "type": "Dragon",
    "rank": "B",
    "hp": 374,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0563.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0564",
    "name": "Ancient Demonic Knight",
    "type": "Elemental",
    "rank": "A",
    "hp": 103,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0564.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0565",
    "name": "Ancient Celestial Guardian",
    "type": "Demon",
    "rank": "S",
    "hp": 732,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0565.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0566",
    "name": "Ancient Ancient Dragon",
    "type": "Beast",
    "rank": "D",
    "hp": 722,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0566.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0567",
    "name": "Ancient Void Wraith",
    "type": "Humanoid",
    "rank": "C",
    "hp": 811,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0567.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0568",
    "name": "Ancient Shadow Lurker",
    "type": "Undead",
    "rank": "B",
    "hp": 847,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0568.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0569",
    "name": "Ancient Demonic Overlord",
    "type": "Dragon",
    "rank": "A",
    "hp": 862,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0569.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0570",
    "name": "Ancient Celestial Serpent",
    "type": "Elemental",
    "rank": "S",
    "hp": 361,
    "ac": 11,
    "image": "/generated/compendium/monsters/monster-0570.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0571",
    "name": "Ancient Abyssal Titan",
    "type": "Demon",
    "rank": "D",
    "hp": 837,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0571.webp",
    "description": "A fearsome Demon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0572",
    "name": "Ancient Void Stalker",
    "type": "Beast",
    "rank": "C",
    "hp": 426,
    "ac": 29,
    "image": "/generated/compendium/monsters/monster-0572.webp",
    "description": "A fearsome Beast that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0573",
    "name": "Ancient Shadow Revenant",
    "type": "Humanoid",
    "rank": "B",
    "hp": 554,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0573.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0574",
    "name": "Ancient Demonic Warlord",
    "type": "Undead",
    "rank": "A",
    "hp": 141,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0574.webp",
    "description": "A fearsome Undead that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0575",
    "name": "Ancient Celestial Phoenix",
    "type": "Dragon",
    "rank": "S",
    "hp": 288,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0575.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0576",
    "name": "Ancient Ancient Lich",
    "type": "Elemental",
    "rank": "D",
    "hp": 121,
    "ac": 20,
    "image": "/generated/compendium/monsters/monster-0576.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0577",
    "name": "Ancient Void Devourer",
    "type": "Demon",
    "rank": "C",
    "hp": 659,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0577.webp",
    "description": "A fearsome Demon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0578",
    "name": "Ancient Shadow Assassin",
    "type": "Beast",
    "rank": "B",
    "hp": 150,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0578.webp",
    "description": "A fearsome Beast that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0579",
    "name": "Ancient Demonic Berserker",
    "type": "Humanoid",
    "rank": "A",
    "hp": 386,
    "ac": 17,
    "image": "/generated/compendium/monsters/monster-0579.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0580",
    "name": "Ancient Celestial Paladin",
    "type": "Undead",
    "rank": "S",
    "hp": 699,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0580.webp",
    "description": "A fearsome Undead that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0581",
    "name": "Primordial Shadow Demon",
    "type": "Dragon",
    "rank": "D",
    "hp": 282,
    "ac": 26,
    "image": "/generated/compendium/monsters/monster-0581.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0582",
    "name": "Primordial Void Beast",
    "type": "Elemental",
    "rank": "C",
    "hp": 283,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0582.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0583",
    "name": "Primordial Abyssal Horror",
    "type": "Demon",
    "rank": "B",
    "hp": 864,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0583.webp",
    "description": "A fearsome Demon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0584",
    "name": "Primordial Demonic Knight",
    "type": "Beast",
    "rank": "A",
    "hp": 241,
    "ac": 10,
    "image": "/generated/compendium/monsters/monster-0584.webp",
    "description": "A fearsome Beast that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0585",
    "name": "Primordial Celestial Guardian",
    "type": "Humanoid",
    "rank": "S",
    "hp": 512,
    "ac": 14,
    "image": "/generated/compendium/monsters/monster-0585.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0586",
    "name": "Primordial Ancient Dragon",
    "type": "Undead",
    "rank": "D",
    "hp": 306,
    "ac": 19,
    "image": "/generated/compendium/monsters/monster-0586.webp",
    "description": "A fearsome Undead that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0587",
    "name": "Primordial Void Wraith",
    "type": "Dragon",
    "rank": "C",
    "hp": 304,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0587.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0588",
    "name": "Primordial Shadow Lurker",
    "type": "Elemental",
    "rank": "B",
    "hp": 897,
    "ac": 27,
    "image": "/generated/compendium/monsters/monster-0588.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0589",
    "name": "Primordial Demonic Overlord",
    "type": "Demon",
    "rank": "A",
    "hp": 736,
    "ac": 21,
    "image": "/generated/compendium/monsters/monster-0589.webp",
    "description": "A fearsome Demon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0590",
    "name": "Primordial Celestial Serpent",
    "type": "Beast",
    "rank": "S",
    "hp": 813,
    "ac": 23,
    "image": "/generated/compendium/monsters/monster-0590.webp",
    "description": "A fearsome Beast that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0591",
    "name": "Primordial Abyssal Titan",
    "type": "Humanoid",
    "rank": "D",
    "hp": 837,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0591.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0592",
    "name": "Primordial Void Stalker",
    "type": "Undead",
    "rank": "C",
    "hp": 481,
    "ac": 16,
    "image": "/generated/compendium/monsters/monster-0592.webp",
    "description": "A fearsome Undead that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0593",
    "name": "Primordial Shadow Revenant",
    "type": "Dragon",
    "rank": "B",
    "hp": 523,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0593.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0594",
    "name": "Primordial Demonic Warlord",
    "type": "Elemental",
    "rank": "A",
    "hp": 554,
    "ac": 25,
    "image": "/generated/compendium/monsters/monster-0594.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0595",
    "name": "Primordial Celestial Phoenix",
    "type": "Demon",
    "rank": "S",
    "hp": 244,
    "ac": 24,
    "image": "/generated/compendium/monsters/monster-0595.webp",
    "description": "A fearsome Demon that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0596",
    "name": "Primordial Ancient Lich",
    "type": "Beast",
    "rank": "D",
    "hp": 697,
    "ac": 15,
    "image": "/generated/compendium/monsters/monster-0596.webp",
    "description": "A fearsome Beast that serves the shadow armies. This D rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar",
      "Demonic Rage"
    ],
    "weaknesses": [
      "Light"
    ]
  },
  {
    "id": "monster-0597",
    "name": "Primordial Void Devourer",
    "type": "Humanoid",
    "rank": "C",
    "hp": 204,
    "ac": 22,
    "image": "/generated/compendium/monsters/monster-0597.webp",
    "description": "A fearsome Humanoid that serves the shadow armies. This C rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast",
      "Abyssal Roar"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0598",
    "name": "Primordial Shadow Assassin",
    "type": "Undead",
    "rank": "B",
    "hp": 1043,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0598.webp",
    "description": "A fearsome Undead that serves the shadow armies. This B rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0599",
    "name": "Primordial Demonic Berserker",
    "type": "Dragon",
    "rank": "A",
    "hp": 569,
    "ac": 28,
    "image": "/generated/compendium/monsters/monster-0599.webp",
    "description": "A fearsome Dragon that serves the shadow armies. This A rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0600",
    "name": "Primordial Celestial Paladin",
    "type": "Elemental",
    "rank": "S",
    "hp": 607,
    "ac": 13,
    "image": "/generated/compendium/monsters/monster-0600.webp",
    "description": "A fearsome Elemental that serves the shadow armies. This S rank creature possesses immense power and is a formidable opponent for even the most experienced ascendants.",
    "abilities": [
      "Shadow Strike",
      "Void Blast"
    ],
    "weaknesses": [
      "Light",
      "Holy Damage"
    ]
  },
  {
    "id": "monster-0601",
    "name": "Eternal Shadow Overlord",
    "type": "Demon",
    "rank": "S",
    "hp": 650,
    "ac": 32,
    "image": "/generated/compendium/monsters/monster-0601.webp",
    "description": "An eternal overlord of shadows that commands legions of darkness. This S rank demon possesses godlike power and threatens the very fabric of reality.",
    "abilities": [
      "Eternal Shadow Dominion",
      "Void Reality Warp",
      "Abyssal God Strike"
    ],
    "weaknesses": [
      "Divine Light",
      "Celestial Power",
      "Holy Annihilation"
    ]
  },
  {
    "id": "monster-0602",
    "name": "Void Titan Ascendant",
    "type": "Titan",
    "rank": "S",
    "hp": 720,
    "ac": 35,
    "image": "/generated/compendium/monsters/monster-0602.webp",
    "description": "A titanic entity that has ascended beyond mortal comprehension. This S rank titan wields the power of the void itself.",
    "abilities": [
      "Void Titan Slam",
      "Reality Shatter",
      "Abyssal Devastation"
    ],
    "weaknesses": [
      "Cosmic Light",
      "Divine Intervention",
      "Holy Transcendence"
    ]
  },
  {
    "id": "monster-0603",
    "name": "Supreme Abyssal God",
    "type": "God",
    "rank": "S",
    "hp": 888,
    "ac": 42,
    "image": "/generated/compendium/monsters/monster-0603.webp",
    "description": "The supreme god of the abyss who has achieved ultimate power. This S rank deity represents the pinnacle of shadow evolution.",
    "abilities": [
      "Supreme Abyssal Command",
      "Divine Void Annihilation",
      "Eternal Shadow Godhood"
    ],
    "weaknesses": [
      "Supreme Divine Light",
      "Cosmic Harmony",
      "Absolute Holy Power"
    ]
  }
];

export default monsters;




