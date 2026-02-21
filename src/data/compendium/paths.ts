// Job Paths Compendium - Authoritative System Ascendant Content
// Paths are subclasses of base jobs - each job has 6 paths
// Based on System Ascendant canon with SRD 5e mechanics

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
    description: 'When the System awakened your rage, it didn\'t just unlock fury—it shattered your limiters. Berserker Champions channel raw, primal violence that would shatter a normal body, their muscles reinforced by essence until every blow lands like a collapsing rift wall. In the arenas of the Ascendant guilds, Berserker Champions are both feared and revered.',
    features: [
      {
        name: 'Berserker Mastery',
        description: 'Your rage transcends mortal fury. While raging, your melee attacks deal additional damage equal to your proficiency bonus, and you can make one additional attack as part of the Attack action. You ignore the first source of damage each turn that would reduce you below 1 HP.',
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
    source: 'System Ascendant Canon'
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
    description: 'The System measures combat potential in raw numbers, but Weapon Masters transcend those calculations. Through obsessive drilling in the rift-forged training grounds, you have achieved a fluid mastery that lets you pick up any blade, axe, or polearm and wield it as if born to it. Your fighting style shifts like water between stances.',
    features: [
      {
        name: 'Weapon Mastery',
        description: 'You gain proficiency with all weapons and can attune to any weapon as a bonus action. When you hit with a weapon attack, you can choose to use your Strength or Agility modifier for both the attack and damage rolls. You learn one additional Fighting Style.',
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
    source: 'System Ascendant Canon'
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
    description: 'Within the rifts, raw elemental essence swirls in concentrations that would incinerate the unprepared. Elemental Masters don\'t just cast spells—they commune with the primal forces that bleed through dimensional tears. Fire, frost, lightning, and stone answer your call not as tools, but as extensions of your awakened will.',
    features: [
      {
        name: 'Elemental Affinity',
        description: 'Choose one element (fire, cold, lightning, or earth). Spells you cast that deal your chosen damage type deal additional damage equal to your INT modifier. You have resistance to your chosen element\'s damage type, and once per long rest you can change your elemental affinity during a short rest.',
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
    source: 'System Ascendant Canon'
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
    description: 'The shadows are not empty—they are alive with dimensional residue, and you have learned to move within them like a predator beneath dark water. Shadow Stalkers are the System\'s answer to the unseen threat: assassins who step between the folds of reality, striking from angles that shouldn\'t exist and vanishing before the blood hits the ground.',
    features: [
      {
        name: 'Shadow Form',
        description: 'As a bonus action, you can become partially incorporeal while in dim light or darkness. While in Shadow Form, you have resistance to all damage except force and radiant, and you can move through creatures and objects as if they were difficult terrain. Lasts for 1 minute, usable once per short rest.',
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
    source: 'System Ascendant Canon'
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
    description: 'In the sprawling rift-scarred cityscapes, some threats must be eliminated before they even know they\'re targeted. The Distant Needle specializes in impossible shots across dimensional distortion fields, threading projectiles through reality\'s seams to strike targets that believe themselves untouchable.',
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
    source: 'System Ascendant Canon'
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
    description: 'Identity is fragile in the post-awakening world, and the Masked Ghost exploits that fragility with surgical precision. You don\'t just wear faces—you become them, slipping through guild security, regent courts, and rift expedition teams as whoever the mission demands. The System itself struggles to track you.',
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
    source: 'System Ascendant Canon'
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
    description: 'The rifts bleed substances that defy conventional chemistry—venoms that corrode essence, toxins that unravel mana pathways, poisons that eat through dimensional barriers. The Night Venom harvests these impossible compounds and distills them into weapons of exquisite lethality. Your targets don\'t die—they dissolve.',
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
    source: 'System Ascendant Canon'
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
    description: 'Blood carries essence—the fundamental currency of the System. Those who walk the Path of the Red Sigil have learned to inscribe living runes in crimson, turning life force into tracking beacons, cursed brands, and conduits for devastating power. The Awakened Council officially condemns this path, but the results speak louder than their edicts.',
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
    source: 'System Ascendant Canon'
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
    description: 'No assassin works alone—not truly. The Shadow Net weaves invisible threads of dimensional resonance between operatives, creating a hive-mind of killers who share senses, coordinate strikes across impossible distances, and vanish as one. When a Shadow Net operation activates, entire rift-boss security details simply cease to exist.',
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
    source: 'System Ascendant Canon'
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
    description: 'There is an art to killing that transcends mere violence. The Silent Knife reduces assassination to its purest form: one breath, one motion, one kill. Your blade slides between ribs like a whispered secret, and your target crumples without a sound. In a world of flashy System abilities, you are the reminder that sometimes the simplest solution is the most terrifying.',
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
    source: 'System Ascendant Canon'
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
    description: 'The System is data—and data can be rewritten. Those who forge the Data Pact learn to interface directly with the System\'s underlying architecture, pulling streams of raw information from rift networks, guild databases, and the dimensional lattice itself. Your mind becomes a living terminal, processing information at speeds that leave conventional analysts in the dust.',
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
    source: 'System Ascendant Canon'
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
    description: 'Reality reflects itself in the spaces between dimensions, and Mirror Pact walkers have learned to shatter those reflections into independent constructs. Each duplicate carries a fragment of your consciousness and combat ability, creating a hall of mirrors where every surface hides a lethal surprise. Opponents who face a Mirror Pact technomancer never know which version will strike the killing blow.',
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
    source: 'System Ascendant Canon'
  },
  {
    id: 'contractor--gate-construct',
    name: 'Path of the Gate Construct',
    jobId: 'technomancer',
    jobName: 'Technomancer',
    tier: 2,
    pathType: 'gate-summoning',
    requirements: {
      level: 5,
      abilities: ['Gate construct summoning', 'Pact magic'],
      skills: ['Arcana', 'History', 'Religion'],
      prerequisites: ['Must have mastered gate construct summoning']
    },
    description: 'Deep within the rifts, autonomous constructs patrol ancient corridors—remnants of civilizations that fell to dimensional catastrophe. Gate Construct summoners forge pacts with these mechanical guardians, calling fragments of their terrible power through stabilized micro-rifts. Each construct carries the memory of a fallen world\'s final defense.',
    features: [
      {
        name: 'Gate Fragment',
        description: 'Summon fragments of powerful gate constructs.',
        level: 7
      },
      {
        name: 'Construct\'s Wrath',
        description: 'Channel the power of summoned gate constructs.',
        level: 9
      },
      {
        name: 'Fragment Merge',
        description: 'Merge gate construct fragments for greater power.',
        level: 11
      },
      {
        name: 'Construct\'s Embrace',
        description: 'Gain the full power of gate constructs.',
        level: 13
      }
    ],
    abilities: [
      {
        name: 'Summon Construct',
        description: 'Summon a gate construct fragment.',
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
    source: 'System Ascendant Canon'
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
    description: 'Every relic carries an echo of its creator\'s intent—a fragment of will crystallized in enchanted steel and shadow-forged crystal. Relic Pact technomancers don\'t merely wield these artifacts; they merge with them, forging bonds so deep that relic and wielder become a single entity. The most powerful Relic Pact masters are indistinguishable from the legendary weapons they carry.',
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
    source: 'System Ascendant Canon'
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
    description: 'Where shadow meets circuitry, impossible technology is born. Shadow Pact technomancers weave dimensional darkness through technological frameworks, creating devices that operate in the spaces between reality. Their shadow-tech can bypass any firewall, penetrate any defense, and deliver payloads through dimensions that conventional weapons cannot reach.',
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
    source: 'System Ascendant Canon'
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
    description: 'The Weapon Pact binds your essence to instruments of destruction, forging a symbiotic bond between wielder and armament. Your weapons are not tools—they are extensions of your System-enhanced will, responding to your thoughts, evolving with your power, and eventually developing a hunger of their own. S-Rank Weapon Pact technomancers wield arsenals that fight alongside them like loyal shadow soldiers.',
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
    source: 'System Ascendant Canon'
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
    description: 'The System recognized something primal in you—a fury older than the rifts, deeper than dimensional theory. Path of the Berserker strips away everything civilized and leaves only the engine of destruction beneath. Your rage isn\'t just anger; it\'s a controlled detonation of essence that transforms your body into a living weapon, each blow carrying the force of a collapsing rift gate.',
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
    source: 'System Ascendant Canon'
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
    description: 'In a world where the System quantifies everything, the Lore Keeper proves that knowledge itself is the greatest weapon. You have spent years in the Archive Vaults beneath the Ascendant Academy, studying forbidden texts, deciphering rift-tongue inscriptions, and cataloging the secrets that the Awakened Council would rather forget. Your magic is fueled not by raw power, but by understanding.',
    features: [
      {
        name: 'Lore Mastery',
        description: 'You gain proficiency in two additional skills of your choice and expertise in one Intelligence-based skill you are already proficient in. When you use a spell that requires the target to make a saving throw, you can spend a use of Bardic Inspiration to change the saving throw ability to one of your choice.',
        level: 7
      }
    ],
    abilities: [
      {
        name: 'Lore Strike',
        description: 'As an action, you weave forbidden knowledge into a psychic assault. One creature within 60 feet must make an INT saving throw against your spell save DC or take 3d8 psychic damage and be stunned until the end of their next turn. On a success, half damage and no stun.',
        cooldown: 1,
        cost: 'Action'
      },
      {
        name: 'Lore Defense',
        description: 'As a bonus action, you recite a protective incantation that shields you and allies within 15 feet. Until the start of your next turn, affected creatures have advantage on saving throws against spells and magical effects. Usable a number of times equal to your PRE modifier per long rest.',
        cooldown: 2,
        cost: 'Bonus action'
      },
      {
        name: 'Lore Ultimate',
        description: 'Once per long rest, you can invoke the Forbidden Archive—channeling ancient knowledge into a devastating revelation. Each creature of your choice within 30 feet must make a SENSE saving throw or take 8d6 psychic damage, be frightened, and have their speed reduced to 0 for 1 minute. Affected creatures can repeat the save at the end of each turn.',
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
    source: 'System Ascendant Canon'
  }
];



