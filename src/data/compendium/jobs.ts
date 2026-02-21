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
  // WARRIOR - Pure martial combat
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Battlefield Instinct",
        "description": "Your combat awareness sharpens, allowing you to anticipate enemy movements and react more quickly in combat.",
        "level": 1
      },
      {
        "name": "Enhanced Physique",
        "description": "Your physical conditioning improves, granting you enhanced strength and the ability to push through pain.",
        "level": 3
      },
      {
        "name": "Combat Focus",
        "description": "You can concentrate intensely in combat, gaining advantage on your first attack roll each round.",
        "level": 7
      },
      {
        "name": "Leadership Presence",
        "description": "Your confidence inspires allies and intimidates foes, granting you advantage on Persuasion and Intimidation checks.",
        "level": 11
      }
    ],
    "jobTraits": [
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
    "startingEquipment": [
      ["Chain mail", "Leather armor and a longbow with 20 arrows"],
      ["A martial weapon and a shield", "Two martial weapons"],
      ["A light crossbow and 20 bolts", "Two handaxes"],
      ["A dungeoneer's pack", "An explorer's pack"]
    ],
    "hitPointsAtFirstLevel": "10 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d10 (or 6) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Strength 13 or Dexterity 13",
    "classFeatures": [
      { "level": 1, "name": "Fighting Style", "description": "You adopt a particular style of fighting as your specialty. Choose one: Defense (+1 AC in armor), Dueling (+2 damage one-handed), Great Weapon Fighting (reroll 1-2 damage with two-handed), Two-Weapon Fighting (add ability mod to off-hand damage), or Archery (+2 to ranged attack rolls)." },
      { "level": 1, "name": "Second Wind", "description": "You have a limited well of stamina. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your warrior level. Once you use this feature, you must finish a short or long rest before using it again." },
      { "level": 2, "name": "Action Surge", "description": "You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before using it again. Starting at 17th level, you can use it twice before a rest." },
      { "level": 3, "name": "Martial Path", "description": "Choose a Martial Path that shapes your combat techniques: Champion (raw physical power), Battle Master (tactical superiority), or Eldritch Knight (martial magic). Your path grants features at 3rd, 7th, 10th, 15th, and 18th level." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 6th, 8th, 12th, 14th, 16th, and 19th level." },
      { "level": 5, "name": "Extra Attack", "description": "You can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three at 11th level and four at 20th level." },
      { "level": 7, "name": "Path Feature", "description": "You gain a feature from your Martial Path." },
      { "level": 9, "name": "Indomitable", "description": "You can reroll a saving throw that you fail. If you do so, you must use the new roll. You can use this feature once per long rest. You gain additional uses at 13th level (2) and 17th level (3)." },
      { "level": 10, "name": "Path Feature", "description": "You gain an additional feature from your Martial Path." },
      { "level": 11, "name": "Extra Attack (2)", "description": "You can now attack three times whenever you take the Attack action on your turn." },
      { "level": 13, "name": "Indomitable (2 uses)", "description": "You can now use Indomitable twice between long rests." },
      { "level": 15, "name": "Path Feature", "description": "You gain an additional feature from your Martial Path." },
      { "level": 17, "name": "Action Surge (2 uses)", "description": "You can now use Action Surge twice before a rest, but only once on the same turn." },
      { "level": 17, "name": "Indomitable (3 uses)", "description": "You can now use Indomitable three times between long rests." },
      { "level": 18, "name": "Path Feature", "description": "You gain an additional feature from your Martial Path." },
      { "level": 20, "name": "System-Forged Champion", "description": "You can attack four times whenever you take the Attack action. The System has refined your body into the ultimate weapon—every muscle fiber, every reflex, every instinct has been optimized for combat perfection." }
    ],
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
  // MAGE - Arcane magic mastery
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Arcane Insight",
        "description": "Your mind opens to magical theory, allowing you to understand spell patterns and identify magical effects.",
        "level": 1
      },
      {
        "name": "Essence Channeling",
        "description": "Your body becomes attuned to magical energy, allowing you to cast spells without material components.",
        "level": 3
      },
      {
        "name": "Magical Awareness",
        "description": "You can sense the presence of magic and identify spell schools by their energy signatures.",
        "level": 7
      },
      {
        "name": "Spell Mastery",
        "description": "You gain the ability to cast certain spells without using spell slots.",
        "level": 11
      }
    ],
    "jobTraits": [
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
      { "level": 1, "name": "Spellcasting", "description": "You have learned to channel essence through arcane formulae. Intelligence is your spellcasting ability. You use a spellbook to prepare spells and can cast rituals from it." },
      { "level": 1, "name": "Arcane Recovery", "description": "Once per day when you finish a short rest, you can recover expended spell slots with a combined level equal to half your mage level (rounded up). None of the recovered slots can be 6th level or higher." },
      { "level": 2, "name": "Arcane Tradition", "description": "Choose an Arcane Tradition that shapes your practice of magic: Evocation (destructive force), Abjuration (protective wards), Divination (future sight), Illusion (deception), Conjuration (summoning), Necromancy (death magic), Transmutation (transformation), or Enchantment (mind control). Your tradition grants features at 2nd, 6th, 10th, and 14th level." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 6, "name": "Tradition Feature", "description": "You gain an additional feature from your Arcane Tradition." },
      { "level": 10, "name": "Tradition Feature", "description": "You gain an additional feature from your Arcane Tradition." },
      { "level": 14, "name": "Tradition Feature", "description": "You gain an additional feature from your Arcane Tradition." },
      { "level": 18, "name": "Spell Mastery", "description": "Choose a 1st-level and a 2nd-level spell from your spellbook. You can cast them at their lowest level without expending a spell slot. You can change your selections with 8 hours of study." },
      { "level": 20, "name": "Arcane Ascension", "description": "You gain two 3rd-level spells as Signature Spells that you always have prepared and can cast once each without a spell slot per short rest. The System recognizes your mastery—reality bends to your intellect." }
    ],
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
  // ASSASSIN - Stealth and precision
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Shadow Affinity",
        "description": "Your body attunes to darkness, allowing you to blend into shadows and become nearly invisible.",
        "level": 1
      },
      {
        "name": "Silent Movement",
        "description": "Your movements become unnaturally quiet and your presence fades from casual observation.",
        "level": 3
      },
      {
        "name": "Shadow Step",
        "description": "You learn to step between shadows, teleporting short distances between areas of dim light.",
        "level": 7
      },
      {
        "name": "Shadow Mastery",
        "description": "You gain the ability to manipulate shadows and create areas of magical darkness.",
        "level": 11
      }
    ],
    "jobTraits": [
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
    "startingEquipment": [
      ["A rapier", "A shortsword"],
      ["A shortbow and quiver of 20 arrows", "A shortsword"],
      ["A burglar's pack", "A dungeoneer's pack", "An explorer's pack"],
      ["Leather armor, two daggers, and thieves' tools"]
    ],
    "hitPointsAtFirstLevel": "8 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d8 (or 5) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Dexterity 13",
    "classFeatures": [
      { "level": 1, "name": "Expertise", "description": "Choose two of your skill proficiencies or one skill and thieves' tools. Your proficiency bonus is doubled for any check with those proficiencies. At 6th level, choose two more." },
      { "level": 1, "name": "Precision Kill", "description": "Once per turn, deal extra damage to a creature you hit if you have advantage or an ally is within 5 feet of the target. Extra damage is 1d6, increasing by 1d6 at every odd level (2d6 at 3rd, 3d6 at 5th, etc., up to 10d6 at 19th)." },
      { "level": 1, "name": "Shadow Cant", "description": "You know a secret mix of dialect, jargon, and code used by assassins and shadow operatives. You can hide short messages in seemingly normal conversation that only another shadow operative can understand." },
      { "level": 2, "name": "Cunning Action", "description": "You can take a bonus action on each turn to Dash, Disengage, or Hide. Your body moves with System-enhanced speed and precision." },
      { "level": 3, "name": "Shadow Path", "description": "Choose a Shadow Path: Phantom (death magic), Shadow Blade (martial stealth), or Arcane Trickster (spell-enhanced trickery). Your path grants features at 3rd, 9th, 13th, and 17th level." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 10th, 12th, 16th, and 19th level." },
      { "level": 5, "name": "Uncanny Dodge", "description": "When an attacker you can see hits you with an attack, you can use your reaction to halve the attack's damage against you." },
      { "level": 7, "name": "Evasion", "description": "When you are subjected to an effect that allows a Dexterity saving throw to take half damage, you instead take no damage on a success and half damage on a failure." },
      { "level": 9, "name": "Shadow Path Feature", "description": "You gain an additional feature from your Shadow Path." },
      { "level": 11, "name": "Reliable Talent", "description": "Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10." },
      { "level": 13, "name": "Shadow Path Feature", "description": "You gain an additional feature from your Shadow Path." },
      { "level": 14, "name": "Blindsense", "description": "If you can hear, you are aware of the location of any hidden or invisible creature within 10 feet of you." },
      { "level": 15, "name": "Slippery Mind", "description": "You gain proficiency in Wisdom saving throws. The System has hardened your mind against manipulation." },
      { "level": 17, "name": "Shadow Path Feature", "description": "You gain an additional feature from your Shadow Path." },
      { "level": 18, "name": "Elusive", "description": "No attack roll has advantage against you while you aren't incapacitated. You move through reality like a ghost—always one step ahead." },
      { "level": 20, "name": "Stroke of Luck", "description": "If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, treat the d20 roll as a 20. Once used, you must finish a short or long rest to use it again." }
    ],
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
  // HEALER - Divine healing magic
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Divine Touch",
        "description": "Your hands become conduits for healing energy, allowing you to heal through touch.",
        "level": 1
      },
      {
        "name": "Life Essence",
        "description": "Your presence promotes healing, allowing you to stabilize the wounded and cure minor ailments.",
        "level": 3
      },
      {
        "name": "Divine Protection",
        "description": "Your essence resonates with protective energy, allowing you to shield allies from harm.",
        "level": 7
      },
      {
        "name": "Healing Focus",
        "description": "You gain the ability to enhance your healing spells and restore life to the recently deceased.",
        "level": 11
      }
    ],
    "jobTraits": [
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
    "startingEquipment": [
      ["A mace", "A warhammer (if proficient)"],
      ["Scale mail", "Leather armor", "Chain mail (if proficient)"],
      ["A light crossbow and 20 bolts", "Any simple weapon"],
      ["A priest's pack", "An explorer's pack"],
      ["A shield and a holy symbol"]
    ],
    "hitPointsAtFirstLevel": "8 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d8 (or 5) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Wisdom 13",
    "spellcasting": {
      "ability": "Wisdom",
      "focus": "Holy symbol",
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
      { "level": 1, "name": "Spellcasting", "description": "As a conduit for divine essence, you can cast healer spells. Wisdom is your spellcasting ability. You prepare spells from the full healer spell list each day." },
      { "level": 1, "name": "Divine Domain", "description": "Choose a Divine Domain that reflects the source of your healing power: Life (restoration), Light (radiance), Knowledge (divination), Tempest (storms), War (battle prayers), Nature (primal healing), Trickery (deception), or Death (necrotic reversal). Your domain grants features at 1st, 2nd, 6th, 8th, and 17th level." },
      { "level": 2, "name": "Channel Divinity", "description": "You gain the ability to channel divine essence directly. You start with Turn Undead and one domain-specific option. You can use this feature once per short rest (twice at 6th, three times at 18th)." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 5, "name": "Destroy Undead", "description": "When an undead fails its saving throw against your Turn Undead, the creature is instantly destroyed if its CR is at or below a certain threshold (CR 1/2 at 5th, CR 1 at 8th, CR 2 at 11th, CR 3 at 14th, CR 4 at 17th)." },
      { "level": 6, "name": "Channel Divinity (2 uses)", "description": "You can now use Channel Divinity twice between rests." },
      { "level": 6, "name": "Domain Feature", "description": "You gain an additional feature from your Divine Domain." },
      { "level": 8, "name": "Domain Feature", "description": "You gain an additional feature from your Divine Domain, typically enhanced divine strikes or potent spellcasting." },
      { "level": 10, "name": "Divine Intervention", "description": "You can call upon your divine source to intervene on your behalf. Roll percentile dice; if you roll a number equal to or lower than your healer level, the intervention succeeds. You can try once per long rest." },
      { "level": 17, "name": "Domain Feature", "description": "You gain the final feature from your Divine Domain." },
      { "level": 18, "name": "Channel Divinity (3 uses)", "description": "You can now use Channel Divinity three times between rests." },
      { "level": 20, "name": "Divine Intervention Improved", "description": "Your call for divine intervention automatically succeeds. The System recognizes you as a true vessel of higher power—when you speak, the cosmos answers." }
    ],
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
  // RANGER - Nature and tracking
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Nature's Bond",
        "description": "Your body connects to the natural world, allowing you to communicate with animals and sense environmental changes.",
        "level": 1
      },
      {
        "name": "Wilderness Instinct",
        "description": "Your senses sharpen to track prey and navigate any terrain with supernatural accuracy.",
        "level": 3
      },
      {
        "name": "Beast Affinity",
        "description": "You gain the ability to befriend and command animals, making them loyal companions.",
        "level": 7
      },
      {
        "name": "Ascendant's Focus",
        "description": "Your mind attunes to hunting patterns, allowing you to predict prey movements and find weaknesses.",
        "level": 11
      }
    ],
    "jobTraits": [
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
    "startingEquipment": [
      ["Scale mail", "Leather armor"],
      ["Two shortswords", "Two simple melee weapons"],
      ["A dungeoneer's pack", "An explorer's pack"],
      ["A longbow and a quiver of 20 arrows"]
    ],
    "hitPointsAtFirstLevel": "10 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d10 (or 6) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Dexterity 13 and Wisdom 13",
    "spellcasting": {
      "ability": "Wisdom",
      "focus": "None (material components)",
      "spellsKnown": [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      "spellSlots": {
        "1st": [0, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        "2nd": [0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "3rd": [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "4th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3],
        "5th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2]
      }
    },
    "classFeatures": [
      { "level": 1, "name": "Favored Enemy", "description": "Choose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. You gain advantage on Survival checks to track them and Intelligence checks to recall information about them. You choose an additional favored enemy at 6th and 14th level." },
      { "level": 1, "name": "Natural Explorer", "description": "Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, swamp, or the Underdark. While in your favored terrain, your proficiency bonus is doubled for Intelligence and Wisdom checks, difficult terrain doesn't slow your group, and you can't become lost except by magical means." },
      { "level": 2, "name": "Fighting Style", "description": "Choose a fighting style: Archery (+2 ranged attack), Defense (+1 AC in armor), Dueling (+2 one-handed damage), or Two-Weapon Fighting (add ability mod to off-hand)." },
      { "level": 2, "name": "Spellcasting", "description": "You can cast ranger spells using Wisdom as your spellcasting ability. You learn spells from the ranger spell list." },
      { "level": 3, "name": "Ranger Conclave", "description": "Choose a Ranger Conclave: Hunter (specialized combat), Beast Master (animal companion), or Gloom Stalker (shadow hunting). Your conclave grants features at 3rd, 7th, 11th, and 15th level." },
      { "level": 3, "name": "Primeval Awareness", "description": "You can expend a spell slot to sense whether aberrations, celestials, dragons, elementals, fey, fiends, or undead are within 1 mile (6 miles in favored terrain)." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 5, "name": "Extra Attack", "description": "You can attack twice whenever you take the Attack action on your turn." },
      { "level": 8, "name": "Land's Stride", "description": "Moving through nonmagical difficult terrain costs no extra movement, and you can pass through nonmagical plants without being slowed or taking damage. You also have advantage on saves against magically created plants." },
      { "level": 10, "name": "Hide in Plain Sight", "description": "You can spend 1 minute creating camouflage. With it, you can try to hide while pressed against a solid surface, gaining +10 to Stealth checks while remaining motionless." },
      { "level": 14, "name": "Vanish", "description": "You can use the Hide action as a bonus action on your turn. Also, you can't be tracked by nonmagical means unless you choose to leave a trail." },
      { "level": 18, "name": "Feral Senses", "description": "You gain preternatural senses. Attacking invisible creatures doesn't impose disadvantage, and you are aware of the location of any invisible creature within 30 feet if you aren't blinded or deafened." },
      { "level": 20, "name": "Apex Predator", "description": "You become the ultimate hunter. Once per turn, you can add your Wisdom modifier to the attack or damage roll of an attack you make against a favored enemy. The System has sharpened your senses to supernatural precision." }
    ],
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
  // BERSERKER - Rage and fury
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Primal Fury",
        "description": "Your body channels primal rage, granting you enhanced strength and damage resistance when angered.",
        "level": 1
      },
      {
        "name": "Rage Blood",
        "description": "Your blood runs hot with fury, allowing you to ignore pain and fight through injuries.",
        "level": 3
      },
      {
        "name": "Battle Fury",
        "description": "Your mind enters a battle trance where you can track multiple enemies and strike with deadly precision.",
        "level": 7
      },
      {
        "name": "Fury Ascension",
        "description": "You gain the ability to channel your rage into devastating attacks that can break through defenses.",
        "level": 11
      }
    ],
    "jobTraits": [
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
    "startingEquipment": [
      ["A greataxe", "Any martial melee weapon"],
      ["Two handaxes", "Any simple weapon"],
      ["An explorer's pack and four javelins"]
    ],
    "hitPointsAtFirstLevel": "12 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d12 (or 7) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Strength 13",
    "classFeatures": [
      { "level": 1, "name": "Rage", "description": "In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain advantage on Strength checks and saving throws, bonus rage damage on melee attacks, and resistance to bludgeoning, piercing, and slashing damage. You can rage 2 times per long rest (3 at 3rd, 4 at 6th, 5 at 12th, 6 at 17th, unlimited at 20th)." },
      { "level": 1, "name": "Unarmored Defense", "description": "While not wearing armor, your AC equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit." },
      { "level": 2, "name": "Reckless Attack", "description": "When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn." },
      { "level": 2, "name": "Danger Sense", "description": "You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. You can't use this if you are blinded, deafened, or incapacitated." },
      { "level": 3, "name": "Primal Path", "description": "Choose a Primal Path: Path of the Berserker (unstoppable fury), Path of the Totem Warrior (spirit animal), or Path of the Storm Herald (elemental rage). Your path grants features at 3rd, 6th, 10th, and 14th level." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 5, "name": "Extra Attack", "description": "You can attack twice whenever you take the Attack action on your turn." },
      { "level": 5, "name": "Fast Movement", "description": "Your speed increases by 10 feet while you aren't wearing heavy armor." },
      { "level": 7, "name": "Feral Instinct", "description": "You have advantage on initiative rolls. Additionally, if you are surprised and aren't incapacitated, you can act normally on your first turn if you enter your rage before doing anything else." },
      { "level": 9, "name": "Brutal Critical", "description": "You can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack. This increases to two additional dice at 13th level and three at 17th." },
      { "level": 11, "name": "Relentless Rage", "description": "Your rage can keep you fighting despite grievous wounds. If you drop to 0 HP while raging, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 HP instead. The DC increases by 5 each time until you rest." },
      { "level": 15, "name": "Persistent Rage", "description": "Your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it." },
      { "level": 18, "name": "Indomitable Might", "description": "If your total for a Strength check is less than your Strength score, you can use that score in place of the total." },
      { "level": 20, "name": "Primal Champion", "description": "You embody the power of the wilds. Your Strength and Constitution scores each increase by 4, to a maximum of 24. The System has unleashed your full primal potential—you are a force of nature incarnate." }
    ],
    // Legacy properties for backward compatibility
    "abilities": [
      "Rage",
      "Unarmored Defense",
      "Reckless Attack",
      "Danger Sense",
      "Fast Movement",
      "Berserker Path"
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
  // TANK - Defense and protection
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Iron Will",
        "description": "Your mind becomes unshakeable, granting you resistance to mental effects and fear.",
        "level": 1
      },
      {
        "name": "Stonelike Body",
        "description": "Your body toughens, granting you enhanced durability and the ability to absorb damage.",
        "level": 3
      },
      {
        "name": "Protective Instinct",
        "description": "Your senses attune to threats against allies, allowing you to intercept attacks and shield others.",
        "level": 7
      },
      {
        "name": "Shield Mastery",
        "description": "You gain the ability to create protective barriers and absorb damage meant for others.",
        "level": 11
      }
    ],
    "jobTraits": [
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
    "startingEquipment": [
      ["Chain mail", "Scale mail and a shield"],
      ["A martial weapon and a shield", "Two martial weapons"],
      ["A light crossbow and 20 bolts", "Two handaxes"],
      ["A dungeoneer's pack", "An explorer's pack"]
    ],
    "hitPointsAtFirstLevel": "10 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d10 (or 6) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Constitution 13",
    "classFeatures": [
      { "level": 1, "name": "Defensive Style", "description": "You adopt a defensive fighting style. Choose one: Defense (+1 AC in armor), Protection (impose disadvantage on attacks against adjacent allies using your reaction and a shield), or Interception (reduce damage to an ally within 5 feet by 1d10 + proficiency bonus as a reaction)." },
      { "level": 1, "name": "Second Wind", "description": "On your turn, you can use a bonus action to regain hit points equal to 1d10 + your tank level. Once used, you must finish a short or long rest to use it again." },
      { "level": 2, "name": "Shield Wall", "description": "As an action, you can enter a Shield Wall stance until the start of your next turn. You and all allies within 5 feet of you gain +2 AC. You can use this feature a number of times equal to your proficiency bonus per long rest." },
      { "level": 3, "name": "Defensive Path", "description": "Choose a Defensive Path: Bulwark (damage absorption), Sentinel (counterattack), or Warden (area control). Your path grants features at 3rd, 7th, 10th, 15th, and 18th level." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 6th, 8th, 12th, 14th, 16th, and 19th level." },
      { "level": 5, "name": "Extra Attack", "description": "You can attack twice whenever you take the Attack action on your turn." },
      { "level": 7, "name": "Path Feature", "description": "You gain a feature from your Defensive Path." },
      { "level": 9, "name": "Indomitable", "description": "You can reroll a saving throw that you fail. You must use the new roll. Usable once per long rest, increasing to twice at 13th and three times at 17th." },
      { "level": 10, "name": "Path Feature", "description": "You gain an additional feature from your Defensive Path." },
      { "level": 11, "name": "Fortified Body", "description": "You gain resistance to one damage type of your choice. You can change this after a long rest. At 17th level, choose a second type." },
      { "level": 15, "name": "Path Feature", "description": "You gain an additional feature from your Defensive Path." },
      { "level": 18, "name": "Path Feature", "description": "You gain the final feature from your Defensive Path." },
      { "level": 20, "name": "Immovable Fortress", "description": "You cannot be moved against your will, knocked prone, or stunned while conscious. When you use Second Wind, you also grant temporary HP equal to your level to all allies within 10 feet. The System has forged you into an unbreakable wall." }
    ],
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
  // SUMMONER - Essence bonding with magical creatures
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Beast Bond",
        "description": "Your voice and movements can communicate with magical creatures, forming temporary bonds through performance.",
        "level": 1
      },
      {
        "name": "Essence Resonance",
        "description": "Your body attunes to magical creature essences, allowing you to call them temporarily to your aid.",
        "level": 3
      },
      {
        "name": "Creature Empathy",
        "description": "You can sense the emotions and intentions of magical creatures, understanding their needs and desires.",
        "level": 7
      },
      {
        "name": "Performance Magic",
        "description": "Your performances can manifest magical effects, creating temporary illusions and enchantments.",
        "level": 11
      }
    ],
    "jobTraits": [
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
      { "level": 1, "name": "Spellcasting", "description": "You can channel essence through performance and creature bonds. Charisma is your spellcasting ability. You know spells from the summoner spell list." },
      { "level": 1, "name": "Essence Bond", "description": "You can use a bonus action to forge a temporary essence bond with a willing creature within 30 feet, granting it a Bonding Die (1d6). The creature can add the die to one ability check, attack roll, or saving throw within 10 minutes. You can use this a number of times equal to your Charisma modifier per long rest. The die increases at 5th (1d8), 10th (1d10), and 15th (1d12)." },
      { "level": 2, "name": "Jack of All Trades", "description": "You add half your proficiency bonus (rounded down) to any ability check you make that doesn't already include your proficiency bonus." },
      { "level": 2, "name": "Song of Rest", "description": "During a short rest, if you or allies spend Hit Dice, each creature that hears your performance regains an extra 1d6 HP. This increases to 1d8 at 9th, 1d10 at 13th, and 1d12 at 17th level." },
      { "level": 3, "name": "Summoner College", "description": "Choose a Summoner College: College of Beasts (creature companions), College of Spirits (ethereal allies), or College of Elements (elemental summoning). Your college grants features at 3rd, 6th, and 14th level." },
      { "level": 3, "name": "Expertise", "description": "Choose two of your skill proficiencies. Your proficiency bonus is doubled for any check with those skills. At 10th level, choose two more." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 5, "name": "Font of Inspiration", "description": "You regain all expended uses of Essence Bond when you finish a short or long rest." },
      { "level": 6, "name": "Countercharm", "description": "As an action, you can start a performance that lasts until the end of your next turn. During that time, you and friendly creatures within 30 feet have advantage on saving throws against being frightened or charmed." },
      { "level": 6, "name": "College Feature", "description": "You gain an additional feature from your Summoner College." },
      { "level": 10, "name": "Magical Secrets", "description": "Choose two spells from any class's spell list. They count as summoner spells for you. You gain additional Magical Secrets at 14th and 18th level." },
      { "level": 14, "name": "College Feature", "description": "You gain the final feature from your Summoner College." },
      { "level": 20, "name": "Primal Resonance", "description": "When you roll initiative and have no uses of Essence Bond remaining, you regain one use. Additionally, your bonded creatures gain temporary HP equal to your summoner level when you forge a bond. The System recognizes your mastery over the bonds between all living things." }
    ],
    // Legacy properties for backward compatibility
    "abilities": [
      "Bardic Inspiration",
      "Jack of All Trades",
      "Song of Rest",
      "Expertise",
      "Magical Secrets",
      "Countercharm"
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
  // PALADIN - Holy power and sacred duty
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Divine Blessing",
        "description": "Your body becomes blessed with holy energy, granting you enhanced strength and protective powers.",
        "level": 1
      },
      {
        "name": "Sacred Aura",
        "description": "Your presence radiates divine energy that protects allies and harms evil creatures.",
        "level": 3
      },
      {
        "name": "Holy Weapon",
        "description": "Your weapons become conduits for divine power, dealing extra damage to evil creatures.",
        "level": 7
      },
      {
        "name": "Divine Oath",
        "description": "You swear an oath to protect the innocent, gaining supernatural abilities to enforce your vows.",
        "level": 11
      }
    ],
    "jobTraits": [
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
    "startingEquipment": [
      ["A martial weapon and a shield", "Two martial weapons"],
      ["Five javelins", "Any simple melee weapon"],
      ["A priest's pack", "An explorer's pack"],
      ["Chain mail and a holy symbol"]
    ],
    "hitPointsAtFirstLevel": "10 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d10 (or 6) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Strength 13 and Charisma 13",
    "spellcasting": {
      "ability": "Charisma",
      "focus": "Holy symbol",
      "spellSlots": {
        "1st": [0, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        "2nd": [0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "3rd": [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "4th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3],
        "5th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2]
      }
    },
    "classFeatures": [
      { "level": 1, "name": "Divine Sense", "description": "As an action, you can detect the location of any celestial, fiend, or undead within 60 feet that is not behind total cover. You can use this feature a number of times equal to 1 + your Charisma modifier per long rest." },
      { "level": 1, "name": "Lay on Hands", "description": "You have a pool of healing power equal to your paladin level × 5. As an action, you can touch a creature and restore any number of HP from your pool. Alternatively, spend 5 points to cure one disease or neutralize one poison." },
      { "level": 2, "name": "Fighting Style", "description": "Choose a fighting style: Defense (+1 AC), Dueling (+2 one-handed damage), Great Weapon Fighting (reroll 1-2 damage), or Protection (impose disadvantage on attacks against adjacent allies)." },
      { "level": 2, "name": "Spellcasting", "description": "You can cast paladin spells using Charisma as your spellcasting ability. You prepare spells from the paladin spell list each day." },
      { "level": 2, "name": "Divine Smite", "description": "When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage in addition to the weapon's damage: 2d8 for a 1st-level slot, plus 1d8 for each slot level above 1st (max 5d8). +1d8 against undead or fiends." },
      { "level": 3, "name": "Sacred Oath", "description": "Choose a Sacred Oath: Oath of Devotion (holy protector), Oath of Vengeance (divine hunter), or Oath of the Ancients (nature guardian). Your oath grants features at 3rd, 7th, 15th, and 20th level." },
      { "level": 3, "name": "Divine Health", "description": "The divine essence flowing through you makes you immune to disease." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 5, "name": "Extra Attack", "description": "You can attack twice whenever you take the Attack action on your turn." },
      { "level": 6, "name": "Aura of Protection", "description": "Whenever you or a friendly creature within 10 feet must make a saving throw, the creature gains a bonus equal to your Charisma modifier (minimum +1). At 18th level, the range increases to 30 feet." },
      { "level": 10, "name": "Aura of Courage", "description": "You and friendly creatures within 10 feet can't be frightened while you are conscious. At 18th level, the range increases to 30 feet." },
      { "level": 11, "name": "Improved Divine Smite", "description": "Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage." },
      { "level": 14, "name": "Cleansing Touch", "description": "You can use your action to end one spell on yourself or on one willing creature that you touch. You can use this feature a number of times equal to your Charisma modifier per long rest." },
      { "level": 20, "name": "Oath Capstone", "description": "You gain the final feature of your Sacred Oath—a transcendent transformation that makes you an avatar of your divine principles. The System channels the full weight of your conviction into physical reality." }
    ],
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Tech Affinity",
        "description": "Your mind connects to technological devices, allowing you to understand and modify them instantly.",
        "level": 1
      },
      {
        "name": "Arcane Infusion",
        "description": "Your body can channel magical energy into technology, enhancing its capabilities.",
        "level": 3
      },
      {
        "name": "Device Mastery",
        "description": "You gain intuitive understanding of complex mechanisms and can repair or create advanced devices.",
        "level": 7
      },
      {
        "name": "Tech Evolution",
        "description": "You can rapidly upgrade and evolve technological items with magical enhancements.",
        "level": 11
      }
    ],
    "jobTraits": [
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
    "startingEquipment": [
      ["Any two simple weapons"],
      ["A light crossbow and 20 bolts"],
      ["Studded leather armor", "Scale mail"],
      ["Thieves' tools and a dungeoneer's pack"]
    ],
    "hitPointsAtFirstLevel": "8 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d8 (or 5) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Intelligence 13",
    "spellcasting": {
      "ability": "Intelligence",
      "focus": "Tinker's tools or infused item",
      "cantripsKnown": [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4],
      "spellSlots": {
        "1st": [2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        "2nd": [0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "3rd": [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        "4th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3],
        "5th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2]
      }
    },
    "classFeatures": [
      { "level": 1, "name": "Magical Tinkering", "description": "You can invest a spark of essence into mundane objects, granting them minor magical properties: emit light, play a recorded message, emit an odor, or display a static visual. You can affect a number of objects equal to your Intelligence modifier." },
      { "level": 1, "name": "Spellcasting", "description": "You have studied the workings of essence and learned to channel it through objects. Intelligence is your spellcasting ability. You prepare spells from the technomancer list each day and can use tinker's tools as a spellcasting focus." },
      { "level": 2, "name": "Infuse Item", "description": "You gain the ability to imbue mundane items with certain magical infusions. You learn 4 infusions at 2nd level, gaining more as you level. You can have a number of infused items equal to half your infusions known (rounded down) at once." },
      { "level": 3, "name": "Technomancer Specialty", "description": "Choose a specialty: Alchemist (potions and elixirs), Artillerist (arcane cannons), Battle Smith (combat constructs), or Armorer (magical power armor). Your specialty grants features at 3rd, 5th, 9th, and 15th level." },
      { "level": 3, "name": "The Right Tool for the Job", "description": "You can produce any set of artisan's tools from thin air by spending 1 hour of work with your tinker's tools." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 6, "name": "Tool Expertise", "description": "Your proficiency bonus is doubled for any ability check you make that uses your proficiency with a tool." },
      { "level": 7, "name": "Flash of Genius", "description": "When you or another creature within 30 feet makes an ability check or saving throw, you can use your reaction to add your Intelligence modifier to the roll. You can use this a number of times equal to your Intelligence modifier per long rest." },
      { "level": 10, "name": "Magic Item Adept", "description": "You can attune to up to four magic items at once, and crafting a common or uncommon magic item takes you a quarter of the normal time and half the normal cost." },
      { "level": 11, "name": "Spell-Storing Item", "description": "You can store a spell in an object. A creature holding the object can cast the stored spell using your spellcasting ability. The spell can be cast a number of times equal to twice your Intelligence modifier." },
      { "level": 14, "name": "Magic Item Savant", "description": "You can attune to up to five magic items at once and ignore all class, race, and level requirements on attuning to or using a magic item." },
      { "level": 18, "name": "Magic Item Master", "description": "You can attune to up to six magic items at once." },
      { "level": 20, "name": "Soul of Artifice", "description": "You gain a +1 bonus to all saving throws per magic item you are attuned to. If you're reduced to 0 HP, you can end one infusion to drop to 1 HP instead. The System recognizes you as a master of merging essence with technology." }
    ],
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
  // WARLOCK - Pact magic and umbral contracts
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Pact Binding",
        "description": "Your soul becomes attuned to otherworldly entities, allowing you to form supernatural contracts.",
        "level": 1
      },
      {
        "name": "Essence Channeling",
        "description": "Your body becomes a conduit for otherworldly energy, granting you enhanced magical abilities.",
        "level": 3
      },
      {
        "name": "Contract Magic",
        "description": "You gain the ability to cast spells through supernatural pacts with powerful beings.",
        "level": 7
      },
      {
        "name": "Pact Mastery",
        "description": "Your understanding of supernatural contracts allows you to manipulate and enhance your pact abilities.",
        "level": 11
      }
    ],
    "jobTraits": [
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
    "startingEquipment": [
      ["A light crossbow and 20 bolts", "Any simple weapon"],
      ["A component pouch", "An arcane focus"],
      ["A scholar's pack", "A dungeoneer's pack"],
      ["Leather armor, any simple weapon, and two daggers"]
    ],
    "hitPointsAtFirstLevel": "8 + your Constitution modifier",
    "hitPointsAtHigherLevels": "1d8 (or 5) + your Constitution modifier per level after 1st",
    "multiclassPrerequisites": "Charisma 13",
    "spellcasting": {
      "ability": "Charisma",
      "focus": "Arcane focus",
      "cantripsKnown": [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      "spellsKnown": [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
      "spellSlots": {
        "pact": [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4]
      }
    },
    "classFeatures": [
      { "level": 1, "name": "Otherworldly Patron", "description": "You have struck a bargain with an otherworldly being: The Archfey (fey lord), The Fiend (demon prince), The Great Old One (eldritch entity), or The Umbral Regent (shadow monarch). Your patron grants features at 1st, 6th, 10th, and 14th level." },
      { "level": 1, "name": "Pact Magic", "description": "Your patron bestows upon you the ability to cast spells. Charisma is your spellcasting ability. You have a limited number of spell slots that recharge on a short rest. All slots are cast at your highest available spell level." },
      { "level": 2, "name": "Eldritch Invocations", "description": "You gain two eldritch invocations—fragments of forbidden knowledge that grant you ongoing magical abilities. You learn additional invocations as you level and can replace one when you gain a level." },
      { "level": 3, "name": "Pact Boon", "description": "Your patron grants you a special gift: Pact of the Chain (enhanced familiar), Pact of the Blade (magical weapon), or Pact of the Tome (book of shadows with extra cantrips)." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 6, "name": "Patron Feature", "description": "You gain an additional feature from your Otherworldly Patron." },
      { "level": 9, "name": "Pact Magic (5th level)", "description": "Your pact spell slots are now 5th level." },
      { "level": 10, "name": "Patron Feature", "description": "You gain an additional feature from your Otherworldly Patron." },
      { "level": 11, "name": "Mystic Arcanum (6th)", "description": "Your patron bestows upon you a magical secret called an arcanum. Choose one 6th-level spell from the warlock spell list. You can cast it once without a spell slot per long rest. You gain additional arcanums at 13th (7th), 15th (8th), and 17th (9th) level." },
      { "level": 14, "name": "Patron Feature", "description": "You gain the final feature from your Otherworldly Patron." },
      { "level": 20, "name": "Eldritch Master", "description": "You can entreat your patron to restore all your expended Pact Magic spell slots. Once used, you must finish a long rest to use this feature again. The System acknowledges your contract—you and your patron are bound beyond mortality." }
    ],
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
  // NECROMANCER - Death magic and shadow extraction
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Death Essence",
        "description": "Your body becomes attuned to death energy, allowing you to sense and manipulate life force.",
        "level": 1
      },
      {
        "name": "Undead Command",
        "description": "Your mind gains the ability to control undead creatures and command their loyalty.",
        "level": 3
      },
      {
        "name": "Life Manipulation",
        "description": "You can drain life force from creatures and transfer it to yourself or allies.",
        "level": 7
      },
      {
        "name": "Death Resistance",
        "description": "Your body becomes resistant to effects that would harm the living, granting you enhanced survivability.",
        "level": 11
      }
    ],
    "jobTraits": [
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
      { "level": 1, "name": "Spellcasting", "description": "You have learned to channel essence through death magic formulae. Intelligence is your spellcasting ability. You use a grimoire to prepare spells and can perform necromantic rituals." },
      { "level": 1, "name": "Arcane Recovery", "description": "Once per day when you finish a short rest, you can recover expended spell slots with a combined level equal to half your necromancer level (rounded up). None of the recovered slots can be 6th level or higher." },
      { "level": 2, "name": "School of Necromancy", "description": "You focus your study on the school of necromancy. The gold and time to copy necromancy spells into your grimoire is halved. When you kill a creature with a necromancy spell of 1st level or higher, you regain HP equal to twice the spell's level (three times for undead)." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 6, "name": "Undead Thralls", "description": "When you cast Animate Dead, you can target one additional corpse or pile of bones. Undead you create with necromancy spells gain extra HP equal to your necromancer level and add your proficiency bonus to their damage rolls." },
      { "level": 10, "name": "Inured to Undeath", "description": "You have resistance to necrotic damage, and your hit point maximum can't be reduced. The boundary between life and death has become blurred for you." },
      { "level": 14, "name": "Command Undead", "description": "As an action, you can target one undead you can see within 60 feet. It must make a Charisma saving throw against your spell save DC. On a failure, it becomes friendly to you and obeys your commands." },
      { "level": 18, "name": "Spell Mastery", "description": "Choose a 1st-level and a 2nd-level necromancy spell. You can cast them at their lowest level without expending a spell slot." },
      { "level": 20, "name": "Lord of the Dead", "description": "You gain two 3rd-level necromancy spells as Signature Spells. Additionally, undead you control gain resistance to all damage except radiant. The System has recognized you as a master of the boundary between life and death." }
    ],
    // Legacy properties for backward compatibility
    "abilities": [
      "Arcane Recovery",
      "Spell Mastery",
      "Signature Spells",
      "Ritual Casting",
      "Spellbook",
      "Necromancy School"
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
  // MONK - Essence-channeled martial discipline
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Ki Control",
        "description": "Your body learns to channel inner energy (ki) through martial discipline, enhancing your physical abilities.",
        "level": 1
      },
      {
        "name": "Combat Focus",
        "description": "Your mind achieves perfect combat awareness, allowing you to react instantly to threats.",
        "level": 3
      },
      {
        "name": "Body Mastery",
        "description": "Your physical form becomes perfectly attuned to combat, granting you enhanced speed and agility.",
        "level": 7
      },
      {
        "name": "Martial Enlightenment",
        "description": "Your spirit aligns with combat perfection, granting you supernatural martial abilities.",
        "level": 11
      }
    ],
    "jobTraits": [
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
  // BARD - Harmonic resonance and inspiration magic
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
    // System Ascendant Awakening Features (job-linked progression)
    "awakeningFeatures": [
      {
        "name": "Performance Magic",
        "description": "Your performances can manifest magical effects, creating illusions and enchantments through artistic expression.",
        "level": 1
      },
      {
        "name": "Inspiration Aura",
        "description": "Your presence inspires allies and demoralizes enemies, affecting their combat effectiveness.",
        "level": 3
      },
      {
        "name": "Musical Energy",
        "description": "Your body channels magical energy through music and performance, enhancing your abilities.",
        "level": 7
      },
      {
        "name": "Storytelling Power",
        "description": "Your words and stories can shape reality, creating temporary magical effects.",
        "level": 11
      }
    ],
    "jobTraits": [
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
      { "level": 1, "name": "Spellcasting", "description": "You can channel essence through artistic expression. Charisma is your spellcasting ability. You know spells from the bard spell list and use a musical instrument as your focus." },
      { "level": 1, "name": "Bardic Inspiration", "description": "You can inspire others through stirring words or music. As a bonus action, give one creature within 60 feet a Bardic Inspiration die (d6). Within 10 minutes, it can add the die to one ability check, attack roll, or saving throw. Uses equal to Charisma modifier per long rest (short rest at 5th). Die increases at 5th (d8), 10th (d10), 15th (d12)." },
      { "level": 2, "name": "Jack of All Trades", "description": "You add half your proficiency bonus (rounded down) to any ability check that doesn't already include your proficiency bonus." },
      { "level": 2, "name": "Song of Rest", "description": "During a short rest, if you or allies spend Hit Dice to regain HP, each creature that hears your performance regains an extra 1d6 HP. Increases to 1d8 at 9th, 1d10 at 13th, 1d12 at 17th." },
      { "level": 3, "name": "Bard College", "description": "Choose a Bard College: College of Lore (knowledge and cutting words), College of Valor (martial inspiration), or College of Glamour (fey enchantment). Your college grants features at 3rd, 6th, and 14th level." },
      { "level": 3, "name": "Expertise", "description": "Choose two of your skill proficiencies. Your proficiency bonus is doubled for checks with those skills. At 10th level, choose two more." },
      { "level": 4, "name": "Ability Score Improvement", "description": "Increase one ability score by 2, or two ability scores by 1 each. Alternatively, choose a feat. You gain this feature again at 8th, 12th, 16th, and 19th level." },
      { "level": 5, "name": "Font of Inspiration", "description": "You regain all expended uses of Bardic Inspiration when you finish a short or long rest." },
      { "level": 6, "name": "Countercharm", "description": "As an action, you can start a performance that lasts until the end of your next turn. During that time, you and friendly creatures within 30 feet have advantage on saving throws against being frightened or charmed." },
      { "level": 6, "name": "College Feature", "description": "You gain an additional feature from your Bard College." },
      { "level": 10, "name": "Magical Secrets", "description": "Choose two spells from any class's spell list. They count as bard spells for you and don't count against your spells known. You gain additional Magical Secrets at 14th and 18th level." },
      { "level": 14, "name": "College Feature", "description": "You gain the final feature from your Bard College." },
      { "level": 20, "name": "Superior Inspiration", "description": "When you roll initiative and have no uses of Bardic Inspiration remaining, you regain one use. The System recognizes your mastery of performance magic—your very presence reshapes the battlefield." }
    ],
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





