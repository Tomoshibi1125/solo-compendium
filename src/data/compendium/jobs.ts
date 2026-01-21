// Jobs Compendium - Authoritative PDF Content
// Extracted from internal compendium data pack
// This is the authoritative source for jobs data - FULL ADMIN PRIVILEGES INTEGRATION
// Generated on: 2026-01-13T22:03:39.607Z
// 13 Base Jobs with 6 Paths Each = 78 Total Jobs

export interface Job {
  id: string;
  name: string;
  type: string;
  rank: 'D' | 'C' | 'B' | 'A' | 'S';
  image: string;
  description: string;
  // SRD 5e Class Features
  hitDie: string;
  primaryAbility: string;
  savingThrows: string[];
  skillChoices: string[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  // System Ascendant Awakening Features (serves as racial bonuses)
  awakeningFeatures: {
    name: string;
    description: string;
    level: number;
  }[];
  racialTraits: {
    name: string;
    description: string;
    type: 'passive' | 'active' | 'resistance' | 'immunity' | 'bonus';
    frequency?: 'at-will' | 'short-rest' | 'long-rest' | 'once-per-day';
    dc?: number;
  }[];
  abilityScoreImprovements: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
  size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';
  speed: number;
  languages: string[];
  darkvision?: number;
  specialSenses?: string[];
  damageResistances?: string[];
  damageImmunities?: string[];
  conditionImmunities?: string[];
  // Legacy properties for backward compatibility
  abilities: string[];
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  primary_abilities: string[];
  source?: string;
}

export const jobs = [
  // WARRIOR - Fighter (Pure martial combat)
  {
    "id": "warrior",
    "name": "Warrior",
    "type": "Job",
    "rank": "C",
    "description": "A versatile combatant who masters various weapons and fighting styles. Warriors can specialize in offense, defense, or tactical leadership, embodying the foundation of martial prowess in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d10",
    "primaryAbility": "Strength",
    "savingThrows": ["Strength", "Constitution"],
    "skillChoices": ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"],
    "armorProficiencies": ["All armor", "shields"],
    "weaponProficiencies": ["Simple weapons", "martial weapons"],
    "toolProficiencies": ["One type of artisan's tools"],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Battlefield Instinct",
        "description": "Your combat awareness sharpens, allowing you to anticipate enemy movements and react more quickly in combat.",
        "level": 1
      },
      {
        "name": "Enhanced Physique",
        "description": "Your physical conditioning improves, granting you enhanced strength and the ability to push through pain.",
        "level": 1
      },
      {
        "name": "Combat Focus",
        "description": "You can concentrate intensely in combat, gaining advantage on your first attack roll each round.",
        "level": 1
      },
      {
        "name": "Leadership Presence",
        "description": "Your confidence inspires allies and intimidates foes, granting you advantage on Persuasion and Intimidation checks.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Combat Awareness",
        "description": "You have advantage on initiative rolls and can't be surprised while conscious.",
        "type": "bonus"
      },
      {
        "name": "Pain Tolerance",
        "description": "You can continue fighting while at 1 hit point and have advantage on Constitution saving throws against exhaustion.",
        "type": "resistance"
      },
      {
        "name": "Adrenaline Rush",
        "description": "When you take damage, you can gain temporary hit points equal to your proficiency bonus and advantage on your next attack.",
        "type": "active",
        "frequency": "short-rest"
      },
      {
        "name": "Intimidating Presence",
        "description": "Once per long rest, you can force a creature to make a Wisdom saving throw or be frightened of you for 1 minute.",
        "type": "active",
        "frequency": "long-rest"
      }
    ],
    "abilityScoreImprovements": {
      "strength": 2,
      "constitution": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common"],
    "darkvision": 60,
    "specialSenses": ["Combat Awareness"],
    "damageResistances": ["bludgeoning", "piercing", "slashing"],
    "damageImmunities": [],
    "conditionImmunities": [],
    // Legacy properties for backward compatibility
    "abilities": [
      "Fighting Style",
      "Second Wind",
      "Action Surge",
      "Martial Archetype",
      "Indomitable",
      "Extra Attack"
    ],
    "image": "/generated/compendium/jobs/warrior.webp",
    "stats": {
      "strength": 15,
      "dexterity": 14,
      "constitution": 15,
      "intelligence": 12,
      "wisdom": 13,
      "charisma": 12
    },
    "primary_abilities": ["Strength", "Constitution"],
    "source": "System Ascendant Canon"
  },
  // MAGE - Wizard (Arcane magic mastery)
  {
    "id": "mage",
    "name": "Mage",
    "type": "Job",
    "rank": "C",
    "description": "A master of arcane magic who manipulates the fundamental forces of reality. Mages can specialize in different schools of magic, from destructive evocation to protective abjuration, embodying the intellectual pursuit of power in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d6",
    "primaryAbility": "Intelligence",
    "savingThrows": ["Intelligence", "Wisdom"],
    "skillChoices": ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"],
    "armorProficiencies": [],
    "weaponProficiencies": ["Daggers", "darts", "slings", "quarterstaffs", "light crossbows"],
    "toolProficiencies": [],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Arcane Insight",
        "description": "Your mind opens to magical theory, allowing you to understand spell patterns and identify magical effects.",
        "level": 1
      },
      {
        "name": "Essence Channeling",
        "description": "Your body becomes attuned to magical energy, allowing you to cast spells without material components.",
        "level": 1
      },
      {
        "name": "Magical Awareness",
        "description": "You can sense the presence of magic and identify spell schools by their energy signatures.",
        "level": 1
      },
      {
        "name": "Spell Mastery",
        "description": "You gain the ability to cast certain spells without using spell slots.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Spell Intuition",
        "description": "You automatically know when someone is casting a spell and what school of magic it belongs to.",
        "type": "passive"
      },
      {
        "name": "Magic Resistance",
        "description": "You have advantage on saving throws against spells and magical effects.",
        "type": "bonus"
      },
      {
        "name": "Cantrip Enhancement",
        "description": "Your cantrips deal maximum damage when you roll damage dice.",
        "type": "active",
        "frequency": "at-will"
      },
      {
        "name": "Spell Recovery",
        "description": "When you finish a short rest, you can recover one spell slot of 3rd level or lower.",
        "type": "active",
        "frequency": "short-rest"
      }
    ],
    "abilityScoreImprovements": {
      "intelligence": 2,
      "wisdom": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Draconic"],
    "darkvision": 60,
    "specialSenses": ["Magical Awareness"],
    "damageResistances": ["force", "psychic"],
    "damageImmunities": [],
    "conditionImmunities": ["charmed"],
    // Legacy properties for backward compatibility
    "abilities": [
      "Arcane Recovery",
      "Spell Mastery",
      "Signature Spells",
      "Ritual Casting",
      "Spellbook",
      "Arcane Tradition"
    ],
    "image": "/generated/compendium/jobs/mage.webp",
    "stats": {
      "strength": 12,
      "dexterity": 14,
      "constitution": 13,
      "intelligence": 15,
      "wisdom": 14,
      "charisma": 12
    },
    "primary_abilities": ["Intelligence", "Wisdom"],
    "source": "System Ascendant Canon"
  },
  // ASSASSIN - Rogue (Stealth and precision)
  {
    "id": "assassin",
    "name": "Assassin",
    "type": "Job",
    "rank": "B",
    "description": "A master of stealth and precision strikes who moves unseen through the shadows. Assassins excel at infiltration, deception, and eliminating targets with deadly efficiency, embodying the shadow arts in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d8",
    "primaryAbility": "Dexterity",
    "savingThrows": ["Dexterity", "Intelligence"],
    "skillChoices": ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Persuasion", "Sleight of Hand", "Stealth"],
    "armorProficiencies": ["Light armor"],
    "weaponProficiencies": ["Simple weapons", "hand crossbows", "longswords", "rapiers", "shortswords"],
    "toolProficiencies": ["Thieves' tools"],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Shadow Affinity",
        "description": "Your body attunes to darkness, allowing you to blend into shadows and become nearly invisible.",
        "level": 1
      },
      {
        "name": "Silent Movement",
        "description": "Your movements become unnaturally quiet and your presence fades from casual observation.",
        "level": 1
      },
      {
        "name": "Shadow Step",
        "description": "You learn to step between shadows, teleporting short distances between areas of dim light.",
        "level": 1
      },
      {
        "name": "Shadow Mastery",
        "description": "You gain the ability to manipulate shadows and create areas of magical darkness.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Shadow Camouflage",
        "description": "You have advantage on Stealth checks in dim light or darkness.",
        "type": "bonus"
      },
      {
        "name": "Void Resistance",
        "description": "You have resistance to force and psychic damage.",
        "type": "resistance"
      },
      {
        "name": "Shadow Clone",
        "description": "As a bonus action, you can create a shadow duplicate of yourself that lasts until your next turn.",
        "type": "active",
        "frequency": "short-rest"
      },
      {
        "name": "Shadow Teleport",
        "description": "Once per day, you can teleport up to 60 feet to a shadow you can see.",
        "type": "active",
        "frequency": "once-per-day"
      }
    ],
    "abilityScoreImprovements": {
      "dexterity": 2,
      "intelligence": 1
    },
    "size": "medium",
    "speed": 35,
    "languages": ["Common", "Thieves' Cant"],
    "darkvision": 120,
    "specialSenses": ["Shadow Sense"],
    "damageResistances": ["necrotic", "poison"],
    "damageImmunities": [],
    "conditionImmunities": [],
    // Legacy properties for backward compatibility
    "abilities": [
      "Sneak Attack",
      "Thieves' Cant",
      "Cunning Action",
      "Uncanny Dodge",
      "Evasion",
      "Expertise"
    ],
    "image": "/generated/compendium/jobs/assassin.webp",
    "stats": {
      "strength": 12,
      "dexterity": 15,
      "constitution": 13,
      "intelligence": 14,
      "wisdom": 13,
      "charisma": 12
    },
    "primary_abilities": ["Dexterity", "Intelligence"],
    "source": "System Ascendant Canon"
  },
  // HEALER - Cleric (Divine healing magic)
  {
    "id": "healer",
    "name": "Healer",
    "type": "Job",
    "rank": "B",
    "description": "A divine conduit who channels healing energy to mend wounds and cure ailments. Healers can specialize in different domains of divine power, from restorative healing to protective wards, embodying the life-giving forces in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d8",
    "primaryAbility": "Wisdom",
    "savingThrows": ["Wisdom", "Charisma"],
    "skillChoices": ["History", "Insight", "Medicine", "Persuasion", "Religion"],
    "armorProficiencies": ["Light armor", "medium armor", "shields"],
    "weaponProficiencies": ["Simple weapons"],
    "toolProficiencies": ["Herbalism kit"],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Divine Touch",
        "description": "Your hands become conduits for healing energy, allowing you to heal through touch.",
        "level": 1
      },
      {
        "name": "Life Essence",
        "description": "Your presence promotes healing, allowing you to stabilize the wounded and cure minor ailments.",
        "level": 1
      },
      {
        "name": "Divine Protection",
        "description": "Your essence resonates with protective energy, allowing you to shield allies from harm.",
        "level": 1
      },
      {
        "name": "Healing Focus",
        "description": "You gain the ability to enhance your healing spells and restore life to the recently deceased.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Life Aura",
        "description": "Allies within 10 feet have advantage on saving throws against disease and poison.",
        "type": "bonus"
      },
      {
        "name": "Divine Immunity",
        "description": "You have advantage on saving throws against disease, poison, and necrotic damage.",
        "type": "resistance"
      },
      {
        "name": "Cure Wounds",
        "description": "As an action, you can touch a creature and restore 1d8 + your Wisdom modifier hit points.",
        "type": "active",
        "frequency": "short-rest"
      },
      {
        "name": "Stabilize",
        "description": "When a creature within 30 feet drops to 0 hit points, you can automatically stabilize them as a reaction.",
        "type": "active",
        "frequency": "long-rest"
      }
    ],
    "abilityScoreImprovements": {
      "wisdom": 2,
      "charisma": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Celestial"],
    "darkvision": 60,
    "specialSenses": ["Divine Sense"],
    "damageResistances": ["radiant"],
    "damageImmunities": ["poison"],
    "conditionImmunities": ["diseased"],
    // Legacy properties for backward compatibility
    "abilities": [
      "Divine Domain",
      "Channel Divinity",
      "Divine Spellcasting",
      "Destroy Undead",
      "Divine Intervention"
    ],
    "image": "/generated/compendium/jobs/healer.webp",
    "stats": {
      "strength": 12,
      "dexterity": 13,
      "constitution": 14,
      "intelligence": 13,
      "wisdom": 15,
      "charisma": 14
    },
    "primary_abilities": ["Wisdom", "Charisma"],
    "source": "System Ascendant Canon"
  },
  // RANGER - Ranger (Nature and tracking)
  {
    "id": "ranger",
    "name": "Ranger",
    "type": "Job",
    "rank": "B",
    "description": "A master of the wild who tracks and survives in any environment. Rangers excel at hunting, tracking, and surviving in the wilderness, embodying the connection to nature in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d10",
    "primaryAbility": "Dexterity",
    "savingThrows": ["Strength", "Dexterity"],
    "skillChoices": ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"],
    "armorProficiencies": ["Light armor", "medium armor", "shields"],
    "weaponProficiencies": ["Simple weapons", "martial weapons"],
    "toolProficiencies": [],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Nature's Bond",
        "description": "Your body connects to the natural world, allowing you to communicate with animals and sense environmental changes.",
        "level": 1
      },
      {
        "name": "Wilderness Instinct",
        "description": "Your senses sharpen to track prey and navigate any terrain with supernatural accuracy.",
        "level": 1
      },
      {
        "name": "Beast Affinity",
        "description": "You gain the ability to befriend and command animals, making them loyal companions.",
        "level": 1
      },
      {
        "name": "Ascendant's Focus",
        "description": "Your mind attunes to hunting patterns, allowing you to predict prey movements and find weaknesses.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Natural Camouflage",
        "description": "You have advantage on Stealth checks in natural environments.",
        "type": "bonus"
      },
      {
        "name": "Beast Speech",
        "description": "You can communicate simple ideas with beasts.",
        "type": "passive"
      },
      {
        "name": "Trackless Step",
        "description": "You cannot be tracked except by magical means.",
        "type": "resistance"
      },
      {
        "name": "Ascendant's Mark",
        "description": "As a bonus action, you can mark a creature. Your attacks against marked creatures have advantage.",
        "type": "active",
        "frequency": "short-rest"
      }
    ],
    "abilityScoreImprovements": {
      "dexterity": 2,
      "wisdom": 1
    },
    "size": "medium",
    "speed": 35,
    "languages": ["Common", "Elvish"],
    "darkvision": 60,
    "specialSenses": ["Natural Awareness"],
    "damageResistances": ["poison"],
    "damageImmunities": [],
    "conditionImmunities": [],
    // Legacy properties for backward compatibility
    "abilities": [
      "Favored Enemy",
      "Natural Explorer",
      "Primeval Awareness",
      "Fighting Style",
      "Spellcasting",
      "Ranger Archetype"
    ],
    "image": "/generated/compendium/jobs/ranger.webp",
    "stats": {
      "strength": 13,
      "dexterity": 15,
      "constitution": 14,
      "intelligence": 12,
      "wisdom": 14,
      "charisma": 13
    },
    "primary_abilities": ["Dexterity", "Wisdom"],
    "source": "System Ascendant Canon"
  },
  // BERSERKER - Barbarian (Rage and fury)
  {
    "id": "berserker",
    "name": "Berserker",
    "type": "Job",
    "rank": "A",
    "description": "A warrior who channels primal fury into devastating combat power. Berserkers can enter rage states that enhance their strength and resilience, embodying the raw power of fury in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d12",
    "primaryAbility": "Strength",
    "savingThrows": ["Strength", "Constitution"],
    "skillChoices": ["Athletics", "Intimidation", "Nature", "Perception", "Survival"],
    "armorProficiencies": ["Light armor", "medium armor", "shields"],
    "weaponProficiencies": ["Simple weapons", "martial weapons"],
    "toolProficiencies": [],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Primal Fury",
        "description": "Your body channels primal rage, granting you enhanced strength and damage resistance when angered.",
        "level": 1
      },
      {
        "name": "Rage Blood",
        "description": "Your blood runs hot with fury, allowing you to ignore pain and fight through injuries.",
        "level": 1
      },
      {
        "name": "Battle Fury",
        "description": "Your mind enters a battle trance where you can track multiple enemies and strike with deadly precision.",
        "level": 1
      },
      {
        "name": "Fury Ascension",
        "description": "You gain the ability to channel your rage into devastating attacks that can break through defenses.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Rage Resilience",
        "description": "While raging, you have resistance to bludgeoning, piercing, and slashing damage.",
        "type": "resistance"
      },
      {
        "name": "Fury Senses",
        "description": "You have advantage on Perception checks while raging.",
        "type": "bonus"
      },
      {
        "name": "Rage Recovery",
        "description": "When you finish a short rest, you can immediately enter a rage without expending a use.",
        "type": "active",
        "frequency": "short-rest"
      },
      {
        "name": "Devastating Blow",
        "description": "Once per rage, you can make an attack with advantage and add your rage damage bonus twice.",
        "type": "active",
        "frequency": "once-per-day"
      }
    ],
    "abilityScoreImprovements": {
      "strength": 2,
      "constitution": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Giant"],
    "darkvision": 60,
    "specialSenses": ["Fury Awareness"],
    "damageResistances": ["cold"],
    "damageImmunities": [],
    "conditionImmunities": ["frightened"],
    // Legacy properties for backward compatibility
    "abilities": [
      "Rage",
      "Unarmored Defense",
      "Reckless Attack",
      "Danger Sense",
      "Fast Movement",
      "Barbarian Path"
    ],
    "image": "/generated/compendium/jobs/berserker.webp",
    "stats": {
      "strength": 15,
      "dexterity": 13,
      "constitution": 15,
      "intelligence": 11,
      "wisdom": 12,
      "charisma": 12
    },
    "primary_abilities": ["Strength", "Constitution"],
    "source": "System Ascendant Canon"
  },
  // TANK - Fighter (Defense and protection)
  {
    "id": "tank",
    "name": "Tank",
    "type": "Job",
    "rank": "B",
    "description": "A defensive specialist who protects allies and absorbs damage. Tanks can withstand incredible punishment and shield others from harm, embodying the protective spirit in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d10",
    "primaryAbility": "Constitution",
    "savingThrows": ["Constitution", "Wisdom"],
    "skillChoices": ["Athletics", "Intimidation", "Medicine", "Perception", "Survival"],
    "armorProficiencies": ["All armor", "shields"],
    "weaponProficiencies": ["Simple weapons", "martial weapons"],
    "toolProficiencies": [],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Iron Will",
        "description": "Your mind becomes unshakeable, granting you resistance to mental effects and fear.",
        "level": 1
      },
      {
        "name": "Stonelike Body",
        "description": "Your body toughens, granting you enhanced durability and the ability to absorb damage.",
        "level": 1
      },
      {
        "name": "Protective Instinct",
        "description": "Your senses attune to threats against allies, allowing you to intercept attacks and shield others.",
        "level": 1
      },
      {
        "name": "Shield Mastery",
        "description": "You gain the ability to create protective barriers and absorb damage meant for others.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Damage Absorption",
        "description": "When you take damage, you can reduce the damage by your Constitution modifier.",
        "type": "resistance"
      },
      {
        "name": "Protective Presence",
        "description": "Allies within 5 feet of you have advantage on saving throws against area effects.",
        "type": "bonus"
      },
      {
        "name": "Shield Ally",
        "description": "As a reaction, you can intercept an attack against an adjacent ally, taking the damage instead.",
        "type": "active",
        "frequency": "short-rest"
      },
      {
        "name": "Iron Wall",
        "description": "Once per long rest, you can become immune to damage until your next turn.",
        "type": "active",
        "frequency": "long-rest"
      }
    ],
    "abilityScoreImprovements": {
      "constitution": 2,
      "strength": 1
    },
    "size": "medium",
    "speed": 25,
    "languages": ["Common", "Dwarvish"],
    "darkvision": 60,
    "specialSenses": ["Threat Detection"],
    "damageResistances": ["bludgeoning", "piercing", "slashing"],
    "damageImmunities": [],
    "conditionImmunities": ["charmed", "frightened"],
    // Legacy properties for backward compatibility
    "abilities": [
      "Fighting Style",
      "Second Wind",
      "Action Surge",
      "Martial Archetype",
      "Indomitable",
      "Extra Attack"
    ],
    "image": "/generated/compendium/jobs/tank.webp",
    "stats": {
      "strength": 14,
      "dexterity": 12,
      "constitution": 15,
      "intelligence": 11,
      "wisdom": 13,
      "charisma": 12
    },
    "primary_abilities": ["Constitution", "Strength"],
    "source": "System Ascendant Canon"
  },
  // SUMMONER - Bard (Essence bonding with magical creatures)
  {
    "id": "summoner",
    "name": "Summoner",
    "type": "Job",
    "rank": "A",
    "description": "A master of magical creature bonds who forms deep connections with mystical beasts. Summoners can communicate with and temporarily summon magical creatures through performance and essence bonding, embodying the beast tamer abilities seen in certain ascendants in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d8",
    "primaryAbility": "Charisma",
    "savingThrows": ["Dexterity", "Charisma"],
    "skillChoices": ["Acrobatics", "Animal Handling", "Athletics", "Deception", "Insight", "Intimidation", "Perception", "Performance", "Persuasion", "Stealth"],
    "armorProficiencies": ["Light armor"],
    "weaponProficiencies": ["Simple weapons", "hand crossbows", "longswords", "rapiers", "shortswords"],
    "toolProficiencies": ["One type of musical instrument"],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Beast Bond",
        "description": "Your voice and movements can communicate with magical creatures, forming temporary bonds through performance.",
        "level": 1
      },
      {
        "name": "Essence Resonance",
        "description": "Your body attunes to magical creature essences, allowing you to call them temporarily to your aid.",
        "level": 1
      },
      {
        "name": "Creature Empathy",
        "description": "You can sense the emotions and intentions of magical creatures, understanding their needs and desires.",
        "level": 1
      },
      {
        "name": "Performance Magic",
        "description": "Your performances can manifest magical effects, creating temporary illusions and enchantments.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Beast Friendship",
        "description": "Magical beasts are naturally friendly toward you and will not attack unless provoked.",
        "type": "bonus"
      },
      {
        "name": "Performance Enhancement",
        "description": "When you perform, you can enhance the abilities of allied creatures within 30 feet.",
        "type": "active",
        "frequency": "short-rest"
      },
      {
        "name": "Creature Call",
        "description": "As an action, you can call a magical creature to your location for 1 minute.",
        "type": "active",
        "frequency": "long-rest"
      },
      {
        "name": "Essence Sharing",
        "description": "You can temporarily share your senses with a bonded magical creature.",
        "type": "active",
        "frequency": "once-per-day"
      }
    ],
    "abilityScoreImprovements": {
      "charisma": 2,
      "dexterity": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Sylvan"],
    "darkvision": 60,
    "specialSenses": ["Beast Sense"],
    "damageResistances": ["psychic"],
    "damageImmunities": [],
    "conditionImmunities": [],
    // Legacy properties for backward compatibility
    "abilities": [
      "Bardic Inspiration",
      "Jack of All Trades",
      "Song of Rest",
      "Expertise",
      "Font of Inspiration",
      "Bard College"
    ],
    "image": "/generated/compendium/jobs/summoner.webp",
    "stats": {
      "strength": 12,
      "dexterity": 14,
      "constitution": 13,
      "intelligence": 12,
      "wisdom": 13,
      "charisma": 15
    },
    "primary_abilities": ["Charisma", "Dexterity"],
    "source": "System Ascendant Canon"
  },
  // PALADIN - Paladin (Holy power inspired by sacred hunters)
  {
    "id": "paladin",
    "name": "Paladin",
    "type": "Job",
    "rank": "A",
    "description": "A holy warrior who channels divine power through sacred combat. Paladins can smite enemies with holy energy and protect allies with divine auras, embodying the sacred warrior abilities seen in certain blessed ascendants in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d10",
    "primaryAbility": "Strength",
    "savingThrows": ["Wisdom", "Charisma"],
    "skillChoices": ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"],
    "armorProficiencies": ["All armor", "shields"],
    "weaponProficiencies": ["Simple weapons", "martial weapons"],
    "toolProficiencies": [],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Divine Blessing",
        "description": "Your body becomes blessed with holy energy, granting you enhanced strength and protective powers.",
        "level": 1
      },
      {
        "name": "Sacred Aura",
        "description": "Your presence radiates divine energy that protects allies and harms evil creatures.",
        "level": 1
      },
      {
        "name": "Holy Weapon",
        "description": "Your weapons become conduits for divine power, dealing extra damage to evil creatures.",
        "level": 1
      },
      {
        "name": "Divine Oath",
        "description": "You swear an oath to protect the innocent, gaining supernatural abilities to enforce your vows.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Divine Protection",
        "description": "You and allies within 10 feet have advantage on saving throws against fear.",
        "type": "bonus"
      },
      {
        "name": "Holy Resistance",
        "description": "You have resistance to necrotic and radiant damage.",
        "type": "resistance"
      },
      {
        "name": "Lay on Hands",
        "description": "As an action, you can touch a creature and restore hit points equal to your Paladin level × 5.",
        "type": "active",
        "frequency": "long-rest"
      },
      {
        "name": "Divine Smite",
        "description": "When you hit a creature with a weapon attack, you can expend a hit die to deal extra radiant damage.",
        "type": "active",
        "frequency": "short-rest"
      }
    ],
    "abilityScoreImprovements": {
      "strength": 2,
      "charisma": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Celestial"],
    "darkvision": 60,
    "specialSenses": ["Divine Sense"],
    "damageResistances": ["radiant"],
    "damageImmunities": [],
    "conditionImmunities": ["frightened"],
    // Legacy properties for backward compatibility
    "abilities": [
      "Divine Sense",
      "Lay on Hands",
      "Fighting Style",
      "Second Wind",
      "Martial Archetype",
      "Divine Smite"
    ],
    "image": "/generated/compendium/jobs/paladin.webp",
    "stats": {
      "strength": 15,
      "dexterity": 12,
      "constitution": 14,
      "intelligence": 11,
      "wisdom": 13,
      "charisma": 14
    },
    "primary_abilities": ["Strength", "Charisma"],
    "source": "System Ascendant Canon"
  },
  // TECHNOMANCER - Artificer (Technology manipulation inspired by tech hunters)
  {
    "id": "technomancer",
    "name": "Technomancer",
    "type": "Job",
    "rank": "A",
    "description": "A master of magical technology who infuses devices with arcane power. Technomancers can create and modify technological weapons and tools, embodying the fusion of magic and technology seen in advanced ascendants in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d8",
    "primaryAbility": "Intelligence",
    "savingThrows": ["Intelligence", "Constitution"],
    "skillChoices": ["Arcana", "Investigation", "Medicine", "Nature", "Perception", "Sleight of Hand"],
    "armorProficiencies": ["Light armor", "medium armor", "shields"],
    "weaponProficiencies": ["Simple weapons"],
    "toolProficiencies": ["Tinker's tools", "One type of artisan's tools"],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Tech Affinity",
        "description": "Your mind connects to technological devices, allowing you to understand and modify them instantly.",
        "level": 1
      },
      {
        "name": "Arcane Infusion",
        "description": "Your body can channel magical energy into technology, enhancing its capabilities.",
        "level": 1
      },
      {
        "name": "Device Mastery",
        "description": "You gain intuitive understanding of complex mechanisms and can repair or create advanced devices.",
        "level": 1
      },
      {
        "name": "Tech Evolution",
        "description": "You can rapidly upgrade and evolve technological items with magical enhancements.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Technical Intuition",
        "description": "You have advantage on Intelligence checks related to technology and devices.",
        "type": "bonus"
      },
      {
        "name": "Energy Resistance",
        "description": "You have resistance to lightning and thunder damage from technological sources.",
        "type": "resistance"
      },
      {
        "name": "Device Creation",
        "description": "As a short rest, you can create a simple technological device with basic magical properties.",
        "type": "active",
        "frequency": "short-rest"
      },
      {
        "name": "Tech Overload",
        "description": "Once per day, you can overload a technological device to create a powerful effect.",
        "type": "active",
        "frequency": "once-per-day"
      }
    ],
    "abilityScoreImprovements": {
      "intelligence": 2,
      "constitution": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Dwarvish"],
    "darkvision": 60,
    "specialSenses": ["Technical Sense"],
    "damageResistances": ["lightning", "thunder"],
    "damageImmunities": [],
    "conditionImmunities": [],
    // Legacy properties for backward compatibility
    "abilities": [
      "Magical Tinkering",
      "Infuse Item",
      "The Right Tool for the Job",
      "Spellcasting",
      "Artificer Specialist"
    ],
    "image": "/generated/compendium/jobs/artificer.webp",
    "stats": {
      "strength": 12,
      "dexterity": 13,
      "constitution": 14,
      "intelligence": 15,
      "wisdom": 12,
      "charisma": 13
    },
    "primary_abilities": ["Intelligence", "Constitution"],
    "source": "System Ascendant Canon"
  },
  // WARLOCK - Warlock (Pact magic inspired by umbral monarch contractors)
  {
    "id": "warlock",
    "name": "Warlock",
    "type": "Job",
    "rank": "A",
    "description": "A master of pact magic who forms supernatural bonds with powerful entities. Warlocks can channel otherworldly power through mystical contracts, embodying the contract-based abilities seen in ascendants who make deals with umbral monarchs in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d8",
    "primaryAbility": "Charisma",
    "savingThrows": ["Wisdom", "Charisma"],
    "skillChoices": ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"],
    "armorProficiencies": ["Light armor"],
    "weaponProficiencies": ["Simple weapons"],
    "toolProficiencies": [],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Pact Binding",
        "description": "Your soul becomes attuned to otherworldly entities, allowing you to form supernatural contracts.",
        "level": 1
      },
      {
        "name": "Essence Channeling",
        "description": "Your body becomes a conduit for otherworldly energy, granting you enhanced magical abilities.",
        "level": 1
      },
      {
        "name": "Contract Magic",
        "description": "You gain the ability to cast spells through supernatural pacts with powerful beings.",
        "level": 1
      },
      {
        "name": "Pact Mastery",
        "description": "Your understanding of supernatural contracts allows you to manipulate and enhance your pact abilities.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Pact Resistance",
        "description": "You have resistance to necrotic and psychic damage from otherworldly sources.",
        "type": "resistance"
      },
      {
        "name": "Contract Sense",
        "description": "You can sense the presence of supernatural contracts and otherworldly beings.",
        "type": "bonus"
      },
      {
        "name": "Pact Boon",
        "description": "As a bonus action, you can enhance your next spell with additional power from your pact.",
        "type": "active",
        "frequency": "short-rest"
      },
      {
        "name": "Otherworldly Protection",
        "description": "Once per long rest, you can call upon your patron for protection, gaining temporary hit points.",
        "type": "active",
        "frequency": "long-rest"
      }
    ],
    "abilityScoreImprovements": {
      "charisma": 2,
      "wisdom": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Abyssal"],
    "darkvision": 60,
    "specialSenses": ["Pact Sense"],
    "damageResistances": ["psychic"],
    "damageImmunities": [],
    "conditionImmunities": ["charmed"],
    // Legacy properties for backward compatibility
    "abilities": [
      "Otherworldly Patron",
      "Pact Magic",
      "Mystic Arcanum",
      "Eldritch Master",
      "Pact Boon"
    ],
    "image": "/generated/compendium/jobs/warlock.webp",
    "stats": {
      "strength": 12,
      "dexterity": 13,
      "constitution": 14,
      "intelligence": 12,
      "wisdom": 13,
      "charisma": 15
    },
    "primary_abilities": ["Charisma", "Wisdom"],
    "source": "System Ascendant Canon"
  },
  // NECROMANCER - Wizard (Death magic inspired by death-themed hunters)
  {
    "id": "necromancer",
    "name": "Necromancer",
    "type": "Job",
    "rank": "S",
    "description": "A master of death magic who commands undead and manipulates life force. Necromancers can raise and control the dead, embodying the dark powers seen in certain specialized ascendants in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d6",
    "primaryAbility": "Intelligence",
    "savingThrows": ["Intelligence", "Wisdom"],
    "skillChoices": ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"],
    "armorProficiencies": [],
    "weaponProficiencies": ["Daggers", "darts", "slings", "quarterstaffs", "light crossbows"],
    "toolProficiencies": [],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Death Essence",
        "description": "Your body becomes attuned to death energy, allowing you to sense and manipulate life force.",
        "level": 1
      },
      {
        "name": "Undead Command",
        "description": "Your mind gains the ability to control undead creatures and command their loyalty.",
        "level": 1
      },
      {
        "name": "Life Manipulation",
        "description": "You can drain life force from creatures and transfer it to yourself or allies.",
        "level": 1
      },
      {
        "name": "Death Resistance",
        "description": "Your body becomes resistant to effects that would harm the living, granting you enhanced survivability.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Undead Affinity",
        "description": "You have advantage on Charisma checks when interacting with undead creatures.",
        "type": "bonus"
      },
      {
        "name": "Necrotic Resistance",
        "description": "You have resistance to necrotic damage and cannot be frightened by undead.",
        "type": "resistance"
      },
      {
        "name": "Life Drain",
        "description": "When you hit a creature with a spell attack, you can drain life force to heal yourself.",
        "type": "active",
        "frequency": "short-rest"
      },
      {
        "name": "Raise Dead",
        "description": "Once per day, you can raise a humanoid corpse as a loyal undead servant.",
        "type": "active",
        "frequency": "once-per-day"
      }
    ],
    "abilityScoreImprovements": {
      "intelligence": 2,
      "wisdom": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Draconic"],
    "darkvision": 60,
    "specialSenses": ["Death Sense"],
    "damageResistances": ["necrotic", "cold"],
    "damageImmunities": [],
    "conditionImmunities": ["frightened"],
    // Legacy properties for backward compatibility
    "abilities": [
      "Arcane Recovery",
      "Spell Mastery",
      "Signature Spells",
      "Ritual Casting",
      "Spellbook",
      "Arcane Tradition"
    ],
    "image": "/generated/compendium/jobs/necromancer.webp",
    "stats": {
      "strength": 11,
      "dexterity": 12,
      "constitution": 14,
      "intelligence": 15,
      "wisdom": 13,
      "charisma": 12
    },
    "primary_abilities": ["Intelligence", "Wisdom"],
    "source": "System Ascendant Canon"
  },
  // MONK - Monk (Discipline mastery inspired by martial artist hunters)
  {
    "id": "monk",
    "name": "Monk",
    "type": "Job",
    "rank": "A",
    "description": "A master of martial discipline who harnesses inner energy through combat training. Monks can strike with unarmed precision and control their body's energy flow, embodying the disciplined warrior abilities seen in certain specialized ascendants in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d8",
    "primaryAbility": "Dexterity",
    "savingThrows": ["Strength", "Dexterity"],
    "skillChoices": ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"],
    "armorProficiencies": [],
    "weaponProficiencies": ["Simple weapons", "shortswords"],
    "toolProficiencies": ["One type of artisan's tools", "Musical instrument"],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Ki Control",
        "description": "Your body learns to channel inner energy (ki) through martial discipline, enhancing your physical abilities.",
        "level": 1
      },
      {
        "name": "Combat Focus",
        "description": "Your mind achieves perfect combat awareness, allowing you to react instantly to threats.",
        "level": 1
      },
      {
        "name": "Body Mastery",
        "description": "Your physical form becomes perfectly attuned to combat, granting you enhanced speed and agility.",
        "level": 1
      },
      {
        "name": "Martial Enlightenment",
        "description": "Your spirit aligns with combat perfection, granting you supernatural martial abilities.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Unarmored Movement",
        "description": "You can move at your full speed even when wearing armor.",
        "type": "bonus"
      },
      {
        "name": "Ki Defense",
        "description": "You can use your ki to reduce damage taken from attacks.",
        "type": "resistance"
      },
      {
        "name": "Flurry of Blows",
        "description": "As a bonus action, you can make two unarmed strikes.",
        "type": "active",
        "frequency": "short-rest"
      },
      {
        "name": "Stunning Strike",
        "description": "Once per turn, you can attempt to stun a creature with an unarmed strike.",
        "type": "active",
        "frequency": "once-per-day"
      }
    ],
    "abilityScoreImprovements": {
      "dexterity": 2,
      "wisdom": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Draconic"],
    "darkvision": 60,
    "specialSenses": ["Combat Awareness"],
    "damageResistances": ["force"],
    "damageImmunities": [],
    "conditionImmunities": [],
    // Legacy properties for backward compatibility
    "abilities": [
      "Unarmored Defense",
      "Martial Arts",
      "Ki",
      "Unarmored Movement",
      "Deflect Missiles",
      "Slow Fall",
      "Monastic Tradition"
    ],
    "image": "/generated/compendium/jobs/monk.webp",
    "stats": {
      "strength": 13,
      "dexterity": 15,
      "constitution": 14,
      "intelligence": 12,
      "wisdom": 13,
      "charisma": 11
    },
    "primary_abilities": ["Dexterity", "Wisdom"],
    "source": "System Ascendant Canon"
  },
  // BARD - Bard (Inspiration magic inspired by performance hunters)
  {
    "id": "bard",
    "name": "Bard",
    "type": "Job",
    "rank": "B",
    "description": "A master of inspirational performance who can motivate allies and demoralize enemies through music and storytelling. Bards can channel magical energy through artistic expression, embodying the performance-based abilities seen in certain charismatic ascendants in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d8",
    "primaryAbility": "Charisma",
    "savingThrows": ["Dexterity", "Charisma"],
    "skillChoices": ["Acrobatics", "Animal Handling", "Athletics", "Deception", "Insight", "Intimidation", "Performance", "Persuasion", "Stealth"],
    "armorProficiencies": ["Light armor"],
    "weaponProficiencies": ["Simple weapons", "hand crossbows", "longswords", "rapiers", "shortswords"],
    "toolProficiencies": ["Three types of musical instruments"],
    // System Ascendant Awakening Features (serves as racial bonuses)
    "awakeningFeatures": [
      {
        "name": "Performance Magic",
        "description": "Your performances can manifest magical effects, creating illusions and enchantments through artistic expression.",
        "level": 1
      },
      {
        "name": "Inspiration Aura",
        "description": "Your presence inspires allies and demoralizes enemies, affecting their combat effectiveness.",
        "level": 1
      },
      {
        "name": "Musical Energy",
        "description": "Your body channels magical energy through music and performance, enhancing your abilities.",
        "level": 1
      },
      {
        "name": "Storytelling Power",
        "description": "Your words and stories can shape reality, creating temporary magical effects.",
        "level": 1
      }
    ],
    "racialTraits": [
      {
        "name": "Bardic Inspiration",
        "description": "You can inspire others with your performance, granting them bonus dice on ability checks.",
        "type": "bonus"
      },
      {
        "name": "Performance Enhancement",
        "description": "When you perform, you can enhance the abilities of allies within 30 feet.",
        "type": "active",
        "frequency": "short-rest"
      },
      {
        "name": "Countercharm",
        "description": "As a reaction, you can attempt to counter a magical effect that targets you.",
        "type": "active",
        "frequency": "long-rest"
      },
      {
        "name": "Magical Performance",
        "description": "Once per day, your performance can create a powerful magical effect.",
        "type": "active",
        "frequency": "once-per-day"
      }
    ],
    "abilityScoreImprovements": {
      "charisma": 2,
      "dexterity": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Elvish", "Dwarvish"],
    "darkvision": 60,
    "specialSenses": ["Performance Sense"],
    "damageResistances": ["psychic"],
    "damageImmunities": [],
    "conditionImmunities": [],
    // Legacy properties for backward compatibility
    "abilities": [
      "Bardic Inspiration",
      "Jack of All Trades",
      "Song of Rest",
      "Expertise",
      "Font of Inspiration",
      "Bard College"
    ],
    "image": "/generated/compendium/jobs/bard.webp",
    "stats": {
      "strength": 11,
      "dexterity": 14,
      "constitution": 13,
      "intelligence": 12,
      "wisdom": 12,
      "charisma": 15
    },
    "primary_abilities": ["Charisma", "Dexterity"],
    "source": "System Ascendant Canon"
  }
];





