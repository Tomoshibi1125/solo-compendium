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
  // System Ascendant Awakening Features (job-linked progression)
  awakeningFeatures: {
    name: string;
    description: string;
    level: number;
  }[];
  jobTraits: {
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
  // DDB-parity fields
  startingEquipment?: string[][];
  hitPointsAtFirstLevel?: string;
  hitPointsAtHigherLevels?: string;
  multiclassPrerequisites?: string;
  spellcasting?: {
    ability: string;
    focus?: string;
    cantripsKnown?: number[];
    spellsKnown?: number[];
    spellSlots?: Record<string, number[]>;
  };
  // Full 5e-style level progression table
  classFeatures?: {
    level: number;
    name: string;
    description: string;
  }[];
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
  // CONTRACTOR - Pact broker and dealmaker
  {
    "id": "contractor",
    "name": "Contractor",
    "type": "Job",
    "rank": "B",
    "description": "A master of pacts and agreements who brokers deals with extradimensional entities. Contractors excel at negotiation, binding contracts, and channeling otherworldly power through carefully worded agreements, embodying the art of the deal in the System Ascendant world.",
    // SRD 5e Class Features (Warlock-based)
    "hitDie": "1d8",
    "primaryAbility": "Charisma",
    "savingThrows": ["Wisdom", "Charisma"],
    "skillChoices": ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"],
    "armorProficiencies": ["Light armor"],
    "weaponProficiencies": ["Simple weapons"],
    "toolProficiencies": ["None"],
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Pact Sense",
        "description": "You can sense the presence of otherworldly entities and active pacts within 100 feet. As an action, you can concentrate on this sense for 1 minute to learn the number and general type (celestial, fiend, fey, elemental, etc.) of entities within range. This sense can penetrate most barriers, but is blocked by 3 feet of wood or dirt, 1 foot of stone, 1 inch of common metal, or a thin sheet of lead. You cannot use this feature while incapacitated.",
        "level": 1
      },
      {
        "name": "Contract Binding",
        "description": "Your words carry the weight of otherworldly law. When you speak a binding agreement with a creature that can understand you, you can magically bind them to its terms. If the creature breaks the agreement, they suffer disadvantage on all attack rolls, ability checks, and saving throws for 24 hours. Additionally, they take 2d6 psychic damage at the start of each of their turns while the penalty persists. This binding lasts until the agreement is fulfilled, broken, or dispelled with dispel magic or similar effects. You can have one active binding at a time, plus one additional binding at 5th, 11th, and 17th level.",
        "level": 3
      },
      {
        "name": "Entity Channel",
        "description": "You can directly channel power from your bound entities, enhancing your pact abilities. As a bonus action, you can draw upon your patron's essence to gain one of the following benefits for 1 minute: advantage on your next Charisma-based ability check, resistance to one damage type of your choice, or the ability to cast one of your known pact spells without expending a spell slot. Once you use this feature, you cannot use it again until you finish a short rest. At 14th level, you can use this feature twice between short rests.",
        "level": 7
      },
      {
        "name": "Pact Mastery",
        "description": "You have mastered the art of pact-making and can renegotiate terms of existing pacts and create new binding agreements with greater flexibility. You can add or remove clauses from existing contracts, and creatures bound to your pacts gain advantage on saving throws against being charmed or frightened by you. Additionally, when you cast a spell that affects a creature bound to your pact, you can add your Charisma modifier to the spell's save DC. At 18th level, you can cast geas on any creature bound to your pact without expending a spell slot once per long rest.",
        "level": 11
      }
    ],
    "jobTraits": [
      {
        "name": "Entity Awareness",
        "description": "You always know when you are being observed by otherworldly entities within 300 feet. This awareness manifests as a subtle sense of being watched, and you can determine the general direction and distance of the observing entity. You cannot be surprised by creatures from other planes, and you have advantage on initiative rolls against such creatures. Additionally, you can sense when a creature is attempting to magically scry on you.",
        "type": "bonus"
      },
      {
        "name": "Pact Resistance",
        "description": "You have advantage on saving throws against being charmed or frightened by otherworldly entities, and you have resistance to psychic damage from any source. Additionally, when you are affected by a spell or effect from your patron or their allies, you can use your reaction to gain advantage on the saving throw. You can use this reaction a number of times equal to your proficiency bonus per long rest.",
        "type": "resistance"
      },
      {
        "name": "Binding Words",
        "description": "Once per long rest, you can speak a binding command that a creature within 60 feet must obey or suffer disadvantage on their next attack roll, ability check, or saving throw. The creature must be able to hear you and understand your language. If the creature is hostile to you, they can make a Wisdom saving throw against your spell save DC to ignore the command. At 10th level, you can use this feature twice per long rest, and at 18th level three times per long rest.",
        "type": "active",
        "frequency": "long-rest"
      },
      {
        "name": "Entity Favor",
        "description": "Your bound entities are more likely to grant favors and respond to your requests. When you make a Charisma (Persuasion or Intimidation) check against an otherworldly entity, you can add your proficiency bonus to the roll. Additionally, when you cast a spell that calls upon your patron's power (such as through eldritch invocation or pact magic), you can treat your Charisma score as 2 higher for the purpose of determining spell effects. At 15th level, this bonus increases to your proficiency bonus + 2.",
        "type": "passive"
      }
    ],
    "abilityScoreImprovements": {
      "charisma": 2,
      "wisdom": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common"],
    "darkvision": 60,
    "specialSenses": ["Entity Awareness"],
    "damageResistances": [],
    "damageImmunities": [],
    "conditionImmunities": [],
    "startingEquipment": [
      ["A light crossbow and 20 bolts", "A simple weapon"],
      ["An arcane focus", "A component pouch"],
      ["A scholar's pack", "An explorer's pack"],
      ["Leather armor, two daggers, and thieves' tools"]
    ],
    "hitPointsAtFirstLevel": "8 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d8 (or 5) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Charisma 13",
    "spellcasting": {
      "ability": "Charisma",
      "focus": "Pact Object or Arcane Focus",
      "cantripsKnown": [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      "spellsKnown": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 11, 12, 12, 12, 13, 13, 13, 15],
      "spellSlots": {
        "1st": [1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        "2nd": [0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "3rd": [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        "4th": [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        "5th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      }
    },
    "classFeatures": [
      { "level": 1, "name": "Otherworldly Patron", "description": "You have struck a bargain with an otherworldly being. Your patron grants you power and features at 1st, 6th, 10th, and 14th level." },
      { "level": 1, "name": "Pact Magic", "description": "Your patron bestows upon you the ability to cast spells. Charisma is your spellcasting ability. You have a limited number of spell slots that recharge on a short rest." },
      { "level": 2, "name": "Eldritch Invocations", "description": "You learn invocations that enhance your pact magic abilities." },
      { "level": 3, "name": "Pact Boon", "description": "Choose a Pact Boon: Pact of the Chain (familiar), Pact of the Tome (book of shadows), or Pact of the Blade (pact weapon)." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 5, "name": "Pact Magic (3rd level)", "description": "You gain access to 3rd-level spell slots." },
      { "level": 6, "name": "Patron Feature", "description": "You gain an additional feature from your otherworldly patron." },
      { "level": 7, "name": "Pact Magic (4th level)", "description": "You gain access to 4th-level spell slots." },
      { "level": 8, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat." },
      { "level": 9, "name": "Pact Magic (5th level)", "description": "You gain access to 5th-level spell slots." },
      { "level": 10, "name": "Patron Feature", "description": "You gain an additional feature from your otherworldly patron." },
      { "level": 11, "name": "Mystic Arcanum (6th)", "description": "You learn one 6th-level spell from your patron's spell list. You can cast it once per long rest." },
      { "level": 12, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat." },
      { "level": 13, "name": "Patron Feature", "description": "You gain an additional feature from your otherworldly patron." },
      { "level": 14, "name": "Mystic Arcanum (7th)", "description": "You learn one 7th-level spell from your patron's spell list. You can cast it once per long rest." },
      { "level": 15, "name": "Mystic Arcanum (8th)", "description": "You learn one 8th-level spell from your patron's spell list. You can cast it once per long rest." },
      { "level": 16, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat." },
      { "level": 17, "name": "Mystic Arcanum (9th)", "description": "You learn one 9th-level spell from your patron's spell list. You can cast it once per long rest." },
      { "level": 18, "name": "Pact Master", "description": "You can cast your Mystic Arcanum spells twice per long rest." },
      { "level": 19, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat." },
      { "level": 20, "name": "Eldritch Master", "description": "You can cast any warlock spell you know without expending a spell slot. Once you use this feature, you can't use it again until you finish a long rest." }
    ],
    // Legacy properties for backward compatibility
    "abilities": [
      "Pact Magic",
      "Eldritch Invocations",
      "Pact Boon",
      "Mystic Arcanum",
      "Otherworldly Patron"
    ],
    "image": "/generated/compendium/jobs/warlock.webp",
    "stats": {
      "strength": 10,
      "dexterity": 14,
      "constitution": 12,
      "intelligence": 12,
      "wisdom": 14,
      "charisma": 15
    },
    "primary_abilities": ["Charisma", "Wisdom"],
    "source": "System Ascendant Canon"
  },
  // MAGE - Magic-Based Hunter and Arcane Specialist
  {
    "id": "mage",
    "name": "Mage",
    "type": "Job",
    "rank": "C",
    "description": "A hunter who awakened magical abilities through intense training and natural talent. Mages can cast powerful spells, analyze magical phenomena, and harness arcane energy for combat. They embody the magic-based hunters who use their arcane powers to clear Gates and defeat monsters that resist physical attacks.",
    // SRD 5e Class Features
    "hitDie": "1d6",
    "primaryAbility": "Intelligence",
    "savingThrows": ["Intelligence", "Wisdom"],
    "skillChoices": ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"],
    "armorProficiencies": [],
    "weaponProficiencies": ["Daggers", "darts", "slings", "quarterstaffs", "light crossbows"],
    "toolProficiencies": [],
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Arcane Awakening",
        "description": "Your body awakens to innate magical abilities, allowing you to cast spells without formal training. You can sense magical energy, identify spell components, and understand magical phenomena. Additionally, you gain the ability to cast basic spells instinctively.",
        "level": 1
      },
      {
        "name": "Essence Weaving",
        "description": "Your awakened consciousness can weave raw magical energy into complex spells. You can combine multiple spell effects, create custom magical patterns, and manipulate arcane energy flows. Additionally, you can amplify spell power through concentration.",
        "level": 3
      },
      {
        "name": "Spell Matrix Mastery",
        "description": "Your mastery of magic allows you to create spell matrices that automate casting. You can prepare instant-cast spells, create delayed effect spells, and set up magical traps. Additionally, you can analyze and counter enemy magic in real-time.",
        "level": 7
      },
      {
        "name": "Archmage Ascension",
        "description": "Your magical power transcends normal limits, allowing you to temporarily access archmage-level abilities. Once per long rest, you can enter archmage state for 1 minute. While in this state, your spells have maximum effect, you can cast multiple spells per turn, and your magical barriers become nearly impenetrable.",
        "level": 11
      }
    ],
    "jobTraits": [
      {
        "name": "Arcane Sight",
        "description": "Your awakened eyes can perceive magical energy flows and patterns. You automatically see magical auras, spell preparations, and essence concentrations. Additionally, you can identify the source and power level of any magical effect.",
        "type": "passive"
      },
      {
        "name": "Magical Adaptation",
        "description": "Your magic-attuned body adapts to and neutralizes hostile magic. You have resistance to magical damage and advantage on saving throws against spells. Additionally, you can absorb magical energy to restore your own power.",
        "type": "resistance"
      },
      {
        "name": "Metamagic Infusion",
        "description": "When you cast a spell, you can infuse it with additional arcane energy to enhance its effect. Choose one: double damage, extend duration, or affect additional targets. You can use this feature a number of times equal to your Intelligence modifier per long rest.",
        "type": "active",
        "frequency": "long-rest"
      },
      {
        "name": "Arcane Ritual",
        "description": "Once per long rest, you can perform an arcane ritual that creates a powerful magical effect. You can cast any spell you know without expending a spell slot, create a permanent magical ward, or analyze and dispel all magical effects in an area.",
        "type": "active",
        "frequency": "once-per-day"
      }
    ],
    "abilityScoreImprovements": {
      "intelligence": 2,
      "wisdom": 1
    },
    "racialASI": {
      "intelligence": 1,
      "constitution": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Draconic"],
    "darkvision": 60,
    "specialSenses": ["Essence Sight"],
    "damageResistances": ["force"],
    "damageImmunities": [],
    "conditionImmunities": [],
    "startingEquipment": [
      ["A quarterstaff", "A dagger"],
      ["A component pouch", "An arcane focus"],
      ["A scholar's pack", "An explorer's pack"],
      ["A spellbook"]
    ],
    "hitPointsAtFirstLevel": "6 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d6 (or 4) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Intelligence 13",
    "spellcasting": {
      "ability": "Intelligence",
      "focus": "Arcane focus or spellbook",
      "cantripsKnown": [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      "spellSlots": {
        "1st": [2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        "2nd": [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "3rd": [0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "4th": [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "5th": [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
        "6th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        "7th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2],
        "8th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        "9th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
      }
    },
    "classFeatures": [
      { "level": 1, "name": "Arcane Casting", "description": "You have learned to channel magical energy through study and practice. Intelligence is your spellcasting ability. You use a spellbook to prepare spells and can perform arcane rituals." },
      { "level": 1, "name": "Arcane Recovery", "description": "Once per day when you finish a short rest, you can recover expended spell slots with a combined level equal to half your mage level (rounded up). None of the recovered slots can be 6th level or higher." },
      { "level": 2, "name": "Arcane Tradition", "description": "You focus your study on a specific tradition of magic. The gold and time to copy spells of your chosen tradition into your spellbook is halved. When you defeat an enemy with a spell of your chosen tradition, you regain HP equal to twice the spell's level." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 6, "name": "Arcane Mastery", "description": "When you cast a spell of your chosen tradition, you can target one additional creature or object. Spells of your chosen tradition deal extra force damage equal to your Intelligence modifier." },
      { "level": 10, "name": "Magic Resistance", "description": "You have advantage on saving throws against spells and other magical effects." },
      { "level": 14, "name": "Spell Counter", "description": "As an action, you can counter one spell you can see within 60 feet. You must make an Intelligence check with a DC equal to 10 + the spell's level." },
      { "level": 18, "name": "Spell Mastery", "description": "Choose one 1st-level and one 2nd-level spell from your chosen tradition. You can cast them at their lowest level without expending a spell slot." },
      { "level": 20, "name": "Archmage Power", "description": "You gain two 3rd-level spells from your chosen tradition as Signature Spells. Additionally, your spells cannot be countered and you have advantage on all spellcasting ability checks. Your magical power is recognized as legendary among hunters." }
    ],
    // Legacy properties for backward compatibility
    "abilities": [
      "Arcane Casting",
      "Arcane Recovery",
      "Spell Mastery",
      "Signature Spells",
      "Ritual Casting",
      "Spellbook",
      "Arcane Tradition"
    ],
    "image": "/generated/compendium/jobs/mage.webp",
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
  // STRIKER - Essence-channeled martial combat specialist
  {
    "id": "striker",
    "name": "Striker",
    "type": "Job",
    "rank": "A",
    "description": "A master of martial combat who harnesses inner energy through unarmed strikes. Strikers can strike with precision and control their body's energy flow, embodying the disciplined warrior abilities seen in certain specialized ascendants in the System Ascendant world.",
    // SRD 5e Class Features
    "hitDie": "1d8",
    "primaryAbility": "Dexterity",
    "savingThrows": ["Strength", "Dexterity"],
    "skillChoices": ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"],
    "armorProficiencies": [],
    "weaponProficiencies": ["Simple weapons", "shortswords"],
    "toolProficiencies": [],
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Ki Awakening",
        "description": "Your body awakens to the flow of universal energy (ki), allowing you to perceive and manipulate the life force that flows through all things. You can see the ki auras of living creatures, sense the flow of energy in the environment, and gain the ability to channel ki through your body and mind. Additionally, you can achieve perfect mental clarity through meditation.",
        "level": 1
      },
      {
        "name": "Body Harmony",
        "description": "Your physical form achieves perfect harmony between mind and body. You can control your autonomic functions at will - slowing your heartbeat, holding your breath indefinitely, or accelerating your healing. Additionally, your movements become perfectly efficient, requiring no wasted energy.",
        "level": 3
      },
      {
        "name": "Elemental Attunement",
        "description": "Your ki allows you to attune to the elements, granting you control over natural forces. You can channel ki to create elemental effects - fire from your fists, wind for movement, earth for defense, or water for healing. Additionally, you can adapt your body to withstand extreme conditions.",
        "level": 7
      },
      {
        "name": "Enlightenment Ascension",
        "description": "Your connection to ki transcends physical limits, allowing you to temporarily achieve enlightenment. Once per long rest, you can enter enlightened state for 1 minute. While in this state, you can walk on air, become ethereal, and your attacks bypass all resistances and immunities.",
        "level": 11
      }
    ],
    "jobTraits": [
      {
        "name": "Ki Sight",
        "description": "Your awakened eyes can perceive the flow of ki energy in all living things. You can see the emotional and physical state of creatures as colored auras, predict their movements before they act, and sense the presence of other ki users within 120 feet. Additionally, you can see invisible creatures by their ki signatures.",
        "type": "passive"
      },
      {
        "name": "Perfect Balance",
        "description": "Your ki-attuned body maintains perfect physical and mental balance. You have advantage on all saving throws, cannot be knocked prone, and can walk on any surface (including liquids and walls). Additionally, you automatically succeed on saving throws against being moved against your will.",
        "type": "resistance"
      },
      {
        "name": "Elemental Strike",
        "description": "When you hit a creature with an unarmed strike, you can channel ki to add elemental energy. Choose one element: fire (extra fire damage), cold (slows target), lightning (disadvantage on next attack), or thunder (push 10 feet). You can use this feature a number of times equal to your Wisdom modifier per long rest.",
        "type": "active",
        "frequency": "long-rest"
      },
      {
        "name": "Deflect Projectiles",
        "description": "When you are targeted by a ranged weapon attack, you can use your reaction to deflect the missile. If you succeed, you take no damage and can redirect the projectile to another target within range. Additionally, you can catch missiles and throw them back as part of the same reaction.",
        "type": "active",
        "frequency": "at-will"
      }
    ],
    "abilityScoreImprovements": {
      "dexterity": 2,
      "wisdom": 1
    },
    "racialASI": {
      "dexterity": 1,
      "constitution": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Draconic"],
    "darkvision": 60,
    "specialSenses": ["Combat Awareness"],
    "damageResistances": ["force"],
    "damageImmunities": [],
    "conditionImmunities": [],
    "startingEquipment": [
      ["A shortsword", "Any simple weapon"],
      ["A dungeoneer's pack", "An explorer's pack"],
      ["10 darts"]
    ],
    "hitPointsAtFirstLevel": "8 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d8 (or 5) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Dexterity 13 and Wisdom 13",
    "classFeatures": [
      { "level": 1, "name": "Unarmored Defense", "description": "While wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier." },
      { "level": 1, "name": "Martial Arts", "description": "Your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons. You gain benefits: use Dexterity for attack/damage with monk weapons and unarmed, roll a d4 for unarmed damage (scales to d6 at 5th, d8 at 11th, d10 at 17th), and make one unarmed strike as a bonus action after attacking." },
      { "level": 2, "name": "Ki", "description": "Your training allows you to harness the mystic energy of ki. You have ki points equal to your monk level, regained on short rest. You can spend ki to fuel: Flurry of Blows (two unarmed strikes as bonus action), Patient Defense (Dodge as bonus action), or Step of the Wind (Disengage or Dash as bonus action with doubled jump distance)." },
      { "level": 2, "name": "Unarmored Movement", "description": "Your speed increases by 10 feet while not wearing armor or a shield. This bonus increases at 6th (+15), 10th (+20), 14th (+25), and 18th (+30) level. At 9th level, you can move along vertical surfaces and across liquids without falling." },
      { "level": 3, "name": "Monastic Tradition", "description": "Choose a Monastic Tradition: Way of the Open Hand (combat mastery), Way of Shadow (ninja arts), or Way of the Four Elements (elemental channeling). Your tradition grants features at 3rd, 6th, 11th, and 17th level." },
      { "level": 3, "name": "Deflect Missiles", "description": "You can use your reaction to deflect or catch a missile when hit by a ranged weapon attack, reducing the damage by 1d10 + Dexterity modifier + monk level. If you reduce it to 0, you can catch and throw it back (1 ki point, monk weapon attack)." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 4, "name": "Slow Fall", "description": "You can use your reaction to reduce falling damage by an amount equal to five times your monk level." },
      { "level": 5, "name": "Extra Attack", "description": "You can attack twice whenever you take the Attack action on your turn." },
      { "level": 5, "name": "Stunning Strike", "description": "When you hit a creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn." },
      { "level": 6, "name": "Ki-Empowered Strikes", "description": "Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage." },
      { "level": 7, "name": "Evasion", "description": "When you make a Dexterity saving throw to take half damage, you instead take no damage on a success and half damage on a failure." },
      { "level": 7, "name": "Stillness of Mind", "description": "You can use your action to end one effect on yourself that is causing you to be charmed or frightened." },
      { "level": 10, "name": "Purity of Body", "description": "Your mastery of ki flowing through you makes you immune to disease and poison." },
      { "level": 13, "name": "Tongue of the Sun and Moon", "description": "You learn to touch the ki of other minds. You can understand all spoken languages and any creature that can understand a language can understand you." },
      { "level": 14, "name": "Diamond Soul", "description": "Your mastery of ki grants you proficiency in all saving throws. When you fail a saving throw, you can spend 1 ki point to reroll it." },
      { "level": 15, "name": "Timeless Body", "description": "Your ki sustains you so that you suffer none of the frailty of old age, and you can't be aged magically. You still die of old age. You also no longer need food or water." },
      { "level": 18, "name": "Empty Body", "description": "You can spend 4 ki points to become invisible for 1 minute, gaining resistance to all damage except force. You can also spend 8 ki points to cast Astral Projection without material components." },
      { "level": 20, "name": "Perfect Self", "description": "When you roll initiative and have no ki points remaining, you regain 4 ki points. The System has refined your body and spirit into a perfect weapon—you are martial perfection incarnate." }
    ],
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
  // CHRONICLER - Information Broker and Battle Analyst
  {
    "id": "chronicler",
    "name": "Chronicler",
    "type": "Job",
    "rank": "B",
    "description": "A specialized hunter who excels at information gathering, battle analysis, and tactical support. Chroniclers can analyze enemy patterns, predict monster behaviors, and provide crucial intelligence to raid parties. They embody the information warfare specialists who support hunter teams through knowledge and tactical coordination.",
    // SRD 5e Class Features
    "hitDie": "1d8",
    "primaryAbility": "Charisma",
    "savingThrows": ["Dexterity", "Charisma"],
    "skillChoices": ["Acrobatics", "Animal Handling", "Athletics", "Deception", "Insight", "Intimidation", "Performance", "Persuasion", "Stealth"],
    "armorProficiencies": ["Light armor"],
    "weaponProficiencies": ["Simple weapons", "hand crossbows", "longswords", "rapiers", "shortswords"],
    "toolProficiencies": ["Three types of musical instruments"],
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Battle Analysis Awakening",
        "description": "Your mind awakens to the ability to analyze combat patterns and predict enemy behaviors. You can identify monster attack patterns, skill cooldowns, and tactical weaknesses. Additionally, you gain the ability to process battlefield information in real-time, allowing you to coordinate team actions effectively.",
        "level": 1
      },
      {
        "name": "Information Weaving",
        "description": "Your awakened consciousness can process and disseminate tactical information instantly. You can create detailed battle reports, share enemy weaknesses with allies, and predict monster movements. Additionally, you can maintain perfect situational awareness even in chaotic combat.",
        "level": 3
      },
      {
        "name": "Tactical Mastery",
        "description": "Your mastery of combat tactics allows you to direct hunter teams with precision. You can coordinate multi-pronged attacks, set up ambushes, and exploit enemy formations. Additionally, you can analyze and counter enemy strategies in real-time.",
        "level": 7
      },
      {
        "name": "Field Commander Ascension",
        "description": "Your tactical abilities transcend normal limits, allowing you to temporarily command hunter teams with expert precision. Once per long rest, you can enter commander state for 1 minute. While in this state, you can direct all allies with perfect coordination, predict all enemy actions, and execute flawless battle strategies.",
        "level": 11
      }
    ],
    "jobTraits": [
      {
        "name": "Combat Analysis",
        "description": "Your awakened mind can decode combat information in real-time. You automatically understand enemy attack patterns, skill usage, and tactical formations. Additionally, you can identify the optimal strategy for any combat situation.",
        "type": "passive"
      },
      {
        "name": "Mental Resilience",
        "description": "Your tactical mind resists mental pressure and fear effects. You have advantage on saving throws against being frightened or charmed, and you can maintain perfect focus even in life-threatening situations. Additionally, you can help allies resist mental attacks.",
        "type": "resistance"
      },
      {
        "name": "Tactical Broadcast",
        "description": "As an action, you can broadcast tactical information to allies within range. Choose one effect: advantage on attacks against specific enemies, temporary combat bonuses, or immunity to certain enemy abilities. The effect lasts for 1 minute. You can use this feature a number of times equal to your Charisma modifier per long rest.",
        "type": "active",
        "frequency": "long-rest"
      },
      {
        "name": "Battle Coordination",
        "description": "Once per long rest, you can coordinate a perfect team maneuver that alters combat flow. You can force one enemy to skip their turn, reduce all enemy damage by half for one round, or grant all allies an extra action. Additionally, you can set up tactical advantages that persist through the battle.",
        "type": "active",
        "frequency": "once-per-day"
      }
    ],
    "abilityScoreImprovements": {
      "charisma": 2,
      "dexterity": 1
    },
    "racialASI": {
      "charisma": 1,
      "intelligence": 1
    },
    "size": "medium",
    "speed": 30,
    "languages": ["Common", "Elvish", "Dwarvish"],
    "darkvision": 60,
    "specialSenses": ["Narrative Sense"],
    "damageResistances": ["psychic"],
    "damageImmunities": [],
    "conditionImmunities": [],
    "startingEquipment": [
      ["A rapier", "A longsword", "Any simple weapon"],
      ["A diplomat's pack", "An entertainer's pack"],
      ["A lute", "Any other musical instrument"],
      ["Leather armor and a dagger"]
    ],
    "hitPointsAtFirstLevel": "8 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d8 (or 5) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Charisma 13",
    "spellcasting": {
      "ability": "Charisma",
      "focus": "Musical instrument",
      "cantripsKnown": [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      "spellsKnown": [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
      "spellSlots": {
        "1st": [2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        "2nd": [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "3rd": [0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "4th": [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "5th": [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
        "6th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        "7th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2],
        "8th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        "9th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
      }
    },
    "classFeatures": [
      { "level": 1, "name": "Combat Casting", "description": "You can channel magical energy through tactical analysis. Charisma is your spellcasting ability. You know spells from the tactical support list and use your analytical focus as your spellcasting focus." },
      { "level": 1, "name": "Tactical Inspiration", "description": "You can inspire allies through tactical guidance. As a bonus action, give one creature within 60 feet a Tactical Inspiration die (d6). Within 10 minutes, it can add the die to one ability check, attack roll, or saving throw. Uses equal to Charisma modifier per long rest (short rest at 5th). Die increases at 5th (d8), 10th (d10), 15th (d12)." },
      { "level": 2, "name": "Battle Weaver", "description": "You add half your proficiency bonus (rounded down) to any ability check that doesn't already include your proficiency bonus." },
      { "level": 2, "name": "Tactical Rest", "description": "During a short rest, if you or allies spend Hit Dice to regain HP, each creature that benefits from your tactical analysis regains an extra 1d6 HP. Increases to 1d8 at 9th, 1d10 at 13th, 1d12 at 17th." },
      { "level": 3, "name": "Tactical College", "description": "Choose a Tactical College: College of Analysis (pattern recognition and prediction), College of Combat (battlefield coordination), or College of Strategy (long-term planning). Your college grants features at 3rd, 6th, and 14th level." },
      { "level": 3, "name": "Expertise", "description": "Choose two of your skill proficiencies. Your proficiency bonus is doubled for checks with those skills. At 10th level, choose two more." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 5, "name": "Font of Inspiration", "description": "You regain all expended uses of Narrative Inspiration when you finish a short or long rest." },
      { "level": 6, "name": "Counter Tactics", "description": "As an action, you can start a tactical analysis that lasts until the end of your next turn. During that time, you and friendly creatures within 30 feet have advantage on saving throws against enemy skills and tactical abilities." },
      { "level": 6, "name": "College Feature", "description": "You gain an additional feature from your Chronicle College." },
      { "level": 10, "name": "Magical Secrets", "description": "Choose two spells from any class's spell list. They count as chronicler spells for you and don't count against your spells known. You gain additional Magical Secrets at 14th and 18th level." },
      { "level": 14, "name": "College Feature", "description": "You gain the final feature from your Chronicle College." },
      { "level": 20, "name": "Master Commander", "description": "When you roll initiative and have no uses of Tactical Inspiration remaining, you regain one use. Your tactical mastery is recognized as legendary—your very presence can turn the tide of any battle." }
    ],
    // Legacy properties for backward compatibility
    "abilities": [
      "Tactical Inspiration",
      "Battle Weaver",
      "Tactical Rest",
      "Expertise",
      "Font of Inspiration",
      "Tactical College"
    ],
    "image": "/generated/compendium/jobs/chronicler.webp",
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





