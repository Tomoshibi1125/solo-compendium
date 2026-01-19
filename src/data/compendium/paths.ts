// Job Paths Compendium - Authoritative Solo Leveling Content
// Paths are subclasses of base jobs - each job has 6 paths
// Based on Solo Leveling canon with D&D 5e mechanics

export interface Path {
  id: string;
  name: string;
  jobId: string; // Reference to the base job (e.g., "warrior")
  jobName: string; // Display name of the parent job
  tier: 1 | 2 | 3; // Path tier/level
  pathType: string; // Dynamic path type based on job theme
  requirements: {
    level: number;
    abilities?: string[];
    skills?: string[];
    prerequisites?: string[];
  };
  description: string;
  features: {
    name: string;
    description: string;
    level: number;
  }[];
  abilities: {
    name: string;
    description: string;
    cooldown?: number;
    cost?: string;
  }[];
  stats: {
    primaryAttribute: string;
    secondaryAttribute?: string;
    bonusStats: {
      strength?: number;
      dexterity?: number;
      constitution?: number;
      intelligence?: number;
      wisdom?: number;
      charisma?: number;
    };
  };
  source: string;
  image?: string;
}

// Essential paths data - Core path definitions for job progression
export const paths: Path[] = [
  // WARRIOR PATHS
  {
    id: 'warrior--berserker-rage',
    name: 'Berserker Champion',
    jobId: 'warrior',
    jobName: 'Warrior',
    tier: 2,
    pathType: 'champion',
    requirements: {
      level: 5,
      abilities: ['Basic Warrior abilities'],
      skills: ['Athletics', 'Intimidation'],
      prerequisites: ['Must have mastered Warrior fundamentals']
    },
    description: 'Master the art of berserker rage, specializing in champion techniques and abilities.',
    features: [
      {
        name: 'Berserker Mastery',
        description: 'Gain advanced abilities in berserker rage and enhanced champion capabilities.',
        level: 7
      }
    ],
    abilities: [
      {
        name: 'Berserker Strike',
        description: 'Execute a powerful berserker rage technique that overwhelms opponents.',
        cooldown: 1,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Strength',
      secondaryAttribute: 'Constitution',
      bonusStats: {
        strength: 2,
        constitution: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'warrior--weapon-master',
    name: 'Weapon Master',
    jobId: 'warrior',
    jobName: 'Warrior',
    tier: 2,
    pathType: 'specialist',
    requirements: {
      level: 5,
      abilities: ['Weapon proficiency'],
      skills: ['Athletics', 'Acrobatics'],
      prerequisites: ['Must have mastered multiple weapon types']
    },
    description: 'Become a master of all weapons, specializing in advanced combat techniques.',
    features: [
      {
        name: 'Weapon Mastery',
        description: 'Gain proficiency with all weapons and advanced combat techniques.',
        level: 7
      }
    ],
    abilities: [
      {
        name: 'Weapon Flurry',
        description: 'Execute a rapid series of attacks with multiple weapons.',
        cooldown: 2,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Dexterity',
      secondaryAttribute: 'Strength',
      bonusStats: {
        dexterity: 2,
        strength: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  
  // MAGE PATHS
  {
    id: 'mage--elemental-master',
    name: 'Elemental Master',
    jobId: 'mage',
    jobName: 'Mage',
    tier: 2,
    pathType: 'elementalist',
    requirements: {
      level: 5,
      abilities: ['Basic spellcasting'],
      skills: ['Arcana', 'Investigation'],
      prerequisites: ['Must have mastered basic elements']
    },
    description: 'Master the elements, gaining control over fire, ice, lightning, and earth.',
    features: [
      {
        name: 'Elemental Affinity',
        description: 'Gain enhanced power and control over elemental magic.',
        level: 7
      }
    ],
    abilities: [
      {
        name: 'Elemental Burst',
        description: 'Release a powerful burst of elemental energy.',
        cooldown: 3,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Intelligence',
      secondaryAttribute: 'Wisdom',
      bonusStats: {
        intelligence: 2,
        wisdom: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  
  // ASSASSIN PATHS
  {
    id: 'assassin--shadow-stalker',
    name: 'Shadow Stalker',
    jobId: 'assassin',
    jobName: 'Assassin',
    tier: 2,
    pathType: 'stealth',
    requirements: {
      level: 5,
      abilities: ['Stealth', 'Shadow manipulation'],
      skills: ['Stealth', 'Perception'],
      prerequisites: ['Must have mastered shadow arts']
    },
    description: 'Become one with the shadows, mastering stealth and shadow manipulation.',
    features: [
      {
        name: 'Shadow Form',
        description: 'Gain the ability to become partially incorporeal in shadows.',
        level: 7
      }
    ],
    abilities: [
      {
        name: 'Shadow Strike',
        description: 'Attack from the shadows with enhanced damage.',
        cooldown: 1,
        cost: 'Bonus action'
      }
    ],
    stats: {
      primaryAttribute: 'Dexterity',
      secondaryAttribute: 'Wisdom',
      bonusStats: {
        dexterity: 2,
        wisdom: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'assassin--distant-needle',
    name: 'Path of the Distant Needle',
    jobId: 'assassin',
    jobName: 'Assassin',
    tier: 2,
    pathType: 'ranged',
    requirements: {
      level: 5,
      abilities: ['Ranged weapons', 'Stealth'],
      skills: ['Stealth', 'Perception', 'Acrobatics'],
      prerequisites: ['Must have mastered ranged assassination']
    },
    description: 'Master the art of long-range assassination, specializing in precision strikes from distance.',
    features: [
      {
        name: 'Ranged Expertise',
        description: 'Gain expertise in ranged weapons and enhanced accuracy.',
        level: 7
      },
      {
        name: 'Precise Shot',
        description: 'Ignore cover and gain advantage on ranged attacks against unaware targets.',
        level: 9
      },
      {
        name: 'Deadly Range',
        description: 'Ranged attacks deal additional damage to unaware targets.',
        level: 11
      },
      {
        name: 'Perfect Shot',
        description: 'Once per day, make a ranged attack that automatically hits and critically wounds.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Long Range Strike',
        description: 'Attack from extreme range with enhanced damage.',
        cooldown: 2,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Dexterity',
      secondaryAttribute: 'Wisdom',
      bonusStats: {
        dexterity: 2,
        wisdom: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'assassin--masked-ghost',
    name: 'Path of the Masked Ghost',
    jobId: 'assassin',
    jobName: 'Assassin',
    tier: 2,
    pathType: 'infiltration',
    requirements: {
      level: 5,
      abilities: ['Disguise', 'Stealth', 'Deception'],
      skills: ['Deception', 'Stealth', 'Performance'],
      prerequisites: ['Must have mastered infiltration techniques']
    },
    description: 'Master the art of disguise and infiltration, becoming anyone you need to be.',
    features: [
      {
        name: 'Master of Disguise',
        description: 'Create perfect disguises that fool even magical detection.',
        level: 7
      },
      {
        name: 'False Identity',
        description: 'Maintain multiple false identities with perfect consistency.',
        level: 9
      },
      {
        name: 'Impostor',
        description: 'Perfectly mimic the appearance and mannerisms of others.',
        level: 11
      },
      {
        name: 'Master Infiltrator',
        description: 'Infiltrate any organization without detection.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Disguise Self',
        description: 'Change appearance at will.',
        cooldown: 1,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Charisma',
      secondaryAttribute: 'Dexterity',
      bonusStats: {
        charisma: 2,
        dexterity: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'assassin--night-venom',
    name: 'Path of the Night Venom',
    jobId: 'assassin',
    jobName: 'Assassin',
    tier: 2,
    pathType: 'poison',
    requirements: {
      level: 5,
      abilities: ['Poison crafting', 'Stealth'],
      skills: ['Stealth', 'Medicine', 'Nature'],
      prerequisites: ['Must have mastered poison techniques']
    },
    description: 'Master the deadly arts of poison, using toxins to eliminate targets silently.',
    features: [
      {
        name: 'Poisoner\'s Kit',
        description: 'Craft and apply deadly poisons with enhanced effects.',
        level: 7
      },
      {
        name: 'Toxic Strike',
        description: 'Weapons coated with poison deal additional damage and apply conditions.',
        level: 9
      },
      {
        name: 'Venomous Aura',
        description: 'Exude a poisonous aura that damages nearby enemies.',
        level: 11
      },
      {
        name: 'Master Poisoner',
        description: 'Immune to all poisons and can create legendary toxins.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Venom Blade',
        description: 'Enchant weapon with deadly poison.',
        cooldown: 2,
        cost: 'Bonus action'
      }
    ],
    stats: {
      primaryAttribute: 'Dexterity',
      secondaryAttribute: 'Intelligence',
      bonusStats: {
        dexterity: 2,
        intelligence: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'assassin--red-sigil',
    name: 'Path of the Red Sigil',
    jobId: 'assassin',
    jobName: 'Assassin',
    tier: 2,
    pathType: 'blood-magic',
    requirements: {
      level: 5,
      abilities: ['Blood magic', 'Stealth'],
      skills: ['Stealth', 'Arcana', 'Medicine'],
      prerequisites: ['Must have mastered blood sigil techniques']
    },
    description: 'Master the forbidden art of blood magic, using life force to power deadly abilities.',
    features: [
      {
        name: 'Blood Mark',
        description: 'Mark targets with blood sigils that track and weaken them.',
        level: 7
      },
      {
        name: 'Blood Bond',
        description: 'Create bonds with marked targets to manipulate their life force.',
        level: 9
      },
      {
        name: 'Crimson Strike',
        description: 'Attacks drain life force and heal the assassin.',
        level: 11
      },
      {
        name: 'Master of the Sigil',
        description: 'Control marked targets completely through blood sigils.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Blood Sigil',
        description: 'Mark target with tracking blood sigil.',
        cooldown: 1,
        cost: 'Bonus action'
      }
    ],
    stats: {
      primaryAttribute: 'Constitution',
      secondaryAttribute: 'Intelligence',
      bonusStats: {
        constitution: 2,
        intelligence: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'assassin--shadow-net',
    name: 'Path of the Shadow Net',
    jobId: 'assassin',
    jobName: 'Assassin',
    tier: 2,
    pathType: 'coordination',
    requirements: {
      level: 5,
      abilities: ['Shadow manipulation', 'Coordination'],
      skills: ['Stealth', 'Perception', 'Insight'],
      prerequisites: ['Must have mastered shadow coordination']
    },
    description: 'Coordinate with shadow allies to create deadly assassination networks.',
    features: [
      {
        name: 'Network Coordination',
        description: 'Coordinate multiple shadow assassins simultaneously.',
        level: 7
      },
      {
        name: 'Coordinated Strike',
        description: 'Synchronize attacks with shadow allies for maximum effect.',
        level: 9
      },
      {
        name: 'Shadow Relay',
        description: 'Pass information and abilities through shadow network.',
        level: 11
      },
      {
        name: 'Master Coordinator',
        description: 'Command entire shadow networks with perfect coordination.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Shadow Network',
        description: 'Create shadow network with allies.',
        cooldown: 3,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Wisdom',
      secondaryAttribute: 'Charisma',
      bonusStats: {
        wisdom: 2,
        charisma: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'assassin--silent-knife',
    name: 'Path of the Silent Knife',
    jobId: 'assassin',
    jobName: 'Assassin',
    tier: 2,
    pathType: 'stealth-combat',
    requirements: {
      level: 5,
      abilities: ['Stealth', 'Knife combat'],
      skills: ['Stealth', 'Acrobatics', 'Sleight of Hand'],
      prerequisites: ['Must have mastered silent assassination']
    },
    description: 'Master the art of silent close-range assassination with knives and daggers.',
    features: [
      {
        name: 'Assassinate',
        description: 'Instantly kill unaware targets with silent strikes.',
        level: 7
      },
      {
        name: 'Infiltration Expertise',
        description: 'Move silently and bypass all security measures.',
        level: 9
      },
      {
        name: 'Death Strike',
        description: 'Deliver fatal strikes that cannot be survived.',
        level: 11
      },
      {
        name: 'Perfect Assassin',
        description: 'Become the ultimate silent killer.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Silent Strike',
        description: 'Attack without making any sound.',
        cooldown: 1,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Dexterity',
      secondaryAttribute: 'Constitution',
      bonusStats: {
        dexterity: 2,
        constitution: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  
  // CONTRACTOR PATHS
  {
    id: 'contractor--data-pact',
    name: 'Path of the Data Pact',
    jobId: 'technomancer',
    jobName: 'Technomancer',
    tier: 2,
    pathType: 'data-manipulation',
    requirements: {
      level: 5,
      abilities: ['Data manipulation', 'Intrusion'],
      skills: ['Technology', 'Investigation', 'Arcana'],
      prerequisites: ['Must have mastered data interface']
    },
    description: 'Master the art of data manipulation, accessing and controlling digital information.',
    features: [
      {
        name: 'Data Interface',
        description: 'Interface directly with any digital system.',
        level: 7
      },
      {
        name: 'Information Overload',
        description: 'Access and process vast amounts of information instantly.',
        level: 9
      },
      {
        name: 'System Override',
        description: 'Override any digital security system.',
        level: 11
      },
      {
        name: 'Complete Data Mastery',
        description: 'Control all digital information systems.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Data Scan',
        description: 'Scan and analyze all nearby digital systems.',
        cooldown: 1,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Intelligence',
      secondaryAttribute: 'Wisdom',
      bonusStats: {
        intelligence: 2,
        wisdom: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'contractor--mirror-pact',
    name: 'Path of the Mirror Pact',
    jobId: 'technomancer',
    jobName: 'Technomancer',
    tier: 2,
    pathType: 'duplication',
    requirements: {
      level: 5,
      abilities: ['Mirror magic', 'Illusion'],
      skills: ['Deception', 'Performance', 'Arcana'],
      prerequisites: ['Must have mastered mirror duplication']
    },
    description: 'Master the art of creating and controlling mirror duplicates.',
    features: [
      {
        name: 'Mirror Double',
        description: 'Create perfect mirror duplicates of yourself.',
        level: 7
      },
      {
        name: 'Reflective Strike',
        description: 'Mirror attacks back at attackers.',
        level: 9
      },
      {
        name: 'Mirror Army',
        description: 'Create an army of mirror duplicates.',
        level: 11
      },
      {
        name: 'Perfect Reflection',
        description: 'Become immune to attacks through perfect mirroring.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Mirror Clone',
        description: 'Create a mirror duplicate.',
        cooldown: 2,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Charisma',
      secondaryAttribute: 'Intelligence',
      bonusStats: {
        charisma: 2,
        intelligence: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'contractor--monarch-pact',
    name: 'Path of the Monarch Pact',
    jobId: 'technomancer',
    jobName: 'Technomancer',
    tier: 2,
    pathType: 'monarch-summoning',
    requirements: {
      level: 5,
      abilities: ['Monarch summoning', 'Pact magic'],
      skills: ['Arcana', 'History', 'Religion'],
      prerequisites: ['Must have mastered monarch fragment summoning']
    },
    description: 'Master the art of summoning and controlling monarch fragments.',
    features: [
      {
        name: 'Monarch Fragment',
        description: 'Summon fragments of powerful monarchs.',
        level: 7
      },
      {
        name: 'Monarch\'s Wrath',
        description: 'Channel the power of summoned monarchs.',
        level: 9
      },
      {
        name: 'Fragment Merge',
        description: 'Merge monarch fragments for greater power.',
        level: 11
      },
      {
        name: 'Monarch\'s Embrace',
        description: 'Gain the full power of monarchs.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Summon Fragment',
        description: 'Summon a monarch fragment.',
        cooldown: 3,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Charisma',
      secondaryAttribute: 'Wisdom',
      bonusStats: {
        charisma: 2,
        wisdom: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'contractor--relic-pact',
    name: 'Path of the Relic Pact',
    jobId: 'technomancer',
    jobName: 'Technomancer',
    tier: 2,
    pathType: 'relic-bonding',
    requirements: {
      level: 5,
      abilities: ['Relic bonding', 'Artifact manipulation'],
      skills: ['Arcana', 'Investigation', 'History'],
      prerequisites: ['Must have mastered relic bonding']
    },
    description: 'Master the art of bonding with and controlling powerful relics.',
    features: [
      {
        name: 'Relic Bond',
        description: 'Form powerful bonds with magical relics.',
        level: 7
      },
      {
        name: 'Relic Empowerment',
        description: 'Enhance and empower bonded relics.',
        level: 9
      },
      {
        name: 'Living Relic',
        description: 'Merge with relics to gain their powers.',
        level: 11
      },
      {
        name: 'Relic Mastery',
        description: 'Control all relics completely.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Bond Relic',
        description: 'Bond with a nearby relic.',
        cooldown: 1,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Intelligence',
      secondaryAttribute: 'Constitution',
      bonusStats: {
        intelligence: 2,
        constitution: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'contractor--shadow-pact',
    name: 'Path of the Shadow Pact',
    jobId: 'technomancer',
    jobName: 'Technomancer',
    tier: 2,
    pathType: 'shadow-technology',
    requirements: {
      level: 5,
      abilities: ['Shadow technology', 'Stealth'],
      skills: ['Stealth', 'Technology', 'Arcana'],
      prerequisites: ['Must have mastered shadow tech']
    },
    description: 'Master the fusion of shadow magic and technology.',
    features: [
      {
        name: 'Shadow Step',
        description: 'Move through shadows using technology.',
        level: 7
      },
      {
        name: 'Shadow Sight',
        description: 'See through all shadows and technological barriers.',
        level: 9
      },
      {
        name: 'Shadow Form',
        description: 'Become pure shadow energy.',
        level: 11
      },
      {
        name: 'Master of Shadows',
        description: 'Control all shadow technology.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Shadow Warp',
        description: 'Teleport through shadows.',
        cooldown: 2,
        cost: 'Bonus action'
      }
    ],
    stats: {
      primaryAttribute: 'Dexterity',
      secondaryAttribute: 'Intelligence',
      bonusStats: {
        dexterity: 2,
        intelligence: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'contractor--weapon-pact',
    name: 'Path of the Weapon Pact',
    jobId: 'technomancer',
    jobName: 'Technomancer',
    tier: 2,
    pathType: 'techno-weaponry',
    requirements: {
      level: 5,
      abilities: ['Weapon technology', 'Combat'],
      skills: ['Technology', 'Athletics', 'Intimidation'],
      prerequisites: ['Must have mastered weapon bonding']
    },
    description: 'Master the art of technological weapon enhancement and control.',
    features: [
      {
        name: 'Pact Weapon',
        description: 'Create and bond with technological weapons.',
        level: 7
      },
      {
        name: 'Weapon\'s Will',
        description: 'Weapons gain sentience and fight alongside you.',
        level: 9
      },
      {
        name: 'Thirsting Weapon',
        description: 'Weapons drain energy from enemies.',
        level: 11
      },
      {
        name: 'Weapon\'s Master',
        description: 'Control all weapons within range.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Summon Tech Weapon',
        description: 'Create a technological weapon.',
        cooldown: 1,
        cost: 'Action'
      }
    ],
    stats: {
      primaryAttribute: 'Strength',
      secondaryAttribute: 'Intelligence',
      bonusStats: {
        strength: 2,
        intelligence: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  
  // DESTROYER PATHS
  {
    id: 'destroyer--berserker',
    name: 'Path of the Berserker',
    jobId: 'berserker',
    jobName: 'Berserker',
    tier: 2,
    pathType: 'rage-combat',
    requirements: {
      level: 5,
      abilities: ['Rage', 'Unarmed combat'],
      skills: ['Athletics', 'Intimidation'],
      prerequisites: ['Must have mastered berserker rage']
    },
    description: 'Master the art of berserker rage, becoming an unstoppable force of destruction.',
    features: [
      {
        name: 'Frenzy',
        description: 'Enter a state of pure rage with enhanced combat abilities.',
        level: 7
      },
      {
        name: 'Rage Mastery',
        description: 'Control and enhance berserker rage at will.',
        level: 9
      },
      {
        name: 'Destruction Aura',
        description: 'Exude an aura that damages and destroys nearby objects.',
        level: 11
      },
      {
        name: 'Perfect Rage',
        description: 'Achieve perfect control of rage for maximum destruction.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Berserker Fury',
        description: 'Enter enhanced rage state.',
        cooldown: 1,
        cost: 'Bonus action'
      }
    ],
    stats: {
      primaryAttribute: 'Strength',
      secondaryAttribute: 'Constitution',
      bonusStats: {
        strength: 2,
        constitution: 1
      }
    },
    source: 'Solo Compendium Canon'
  },
  
  // BARD PATHS
  {
    id: 'bard--lore-keeper',
    name: 'Lore Keeper',
    jobId: 'bard',
    jobName: 'Bard',
    tier: 2,
    pathType: 'knowledge',
    requirements: {
      level: 5,
      abilities: ['Basic Bard abilities'],
      skills: ['Bard skills', 'History'],
      prerequisites: ['Must have mastered Bard fundamentals']
    },
    description: 'Master the art of arcane knowledge, specializing in knowledge-magic techniques and abilities.',
    features: [
      {
        name: 'Lore Mastery',
        description: 'Gain access to ancient knowledge and enhanced magical abilities.',
        level: 7
      }
    ],
    abilities: [
      {
        name: 'Lore Strike',
        description: 'Execute a powerful arcane knowledge technique that overwhelms opponents.',
        cooldown: 1,
        cost: 'Action'
      },
      {
        name: 'Lore Defense',
        description: 'Activate defensive arcane knowledge abilities that protect you and allies.',
        cooldown: 2,
        cost: 'Bonus action'
      },
      {
        name: 'Lore Ultimate',
        description: 'Unleash the ultimate arcane knowledge technique that can change the tide of battle.',
        cooldown: 3,
        cost: 'Legendary action'
      }
    ],
    stats: {
      primaryAttribute: 'Charisma',
      secondaryAttribute: 'Intelligence',
      bonusStats: {
        charisma: 2,
        intelligence: 1
      }
    },
    source: 'Solo Compendium Canon'
  }
];

