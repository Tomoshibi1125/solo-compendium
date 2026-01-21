// Skills Compendium - Authoritative System Ascendant Content
// Character skills and abilities with detailed mechanics and progression
// Based on System Ascendant canon with SRD 5e mechanics

export interface Skill {
  id: string;
  name: string;
  description: string;
  ability: 'Strength' | 'Dexterity' | 'Constitution' | 'Intelligence' | 'Wisdom' | 'Charisma';
  type: 'combat' | 'exploration' | 'social' | 'magical' | 'shadow';
  uses: string;
  mechanics: {
    check: string;
    dc?: number | 'opposed' | 'contest' | string;
    scaling?: 'proficiency' | 'expertise' | 'ability-modifier';
    critical?: boolean;
    fumble?: boolean;
  };
  benefits: {
    basic: string[];
    expert: string[];
    master: string[];
  };
  applications: string[];
  synergies: string[];
  source: string;
  image?: string;
}

export const skills: Skill[] = [
  // SHADOW SKILLS
  {
    id: 'shadow-extraction',
    name: 'Shadow Extraction',
    description: 'The ability to extract shadows from defeated enemies and bind them to your service.',
    ability: 'Wisdom',
    type: 'shadow',
    uses: 'Action, 10 minutes per extraction',
    mechanics: {
      check: 'Wisdom (Arcana) or Intelligence (Arcana)',
      dc: '15 + target CR',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Extract shadows from creatures up to CR equal to your level',
        'Extracted shadows have basic combat abilities',
        'Can command 1 shadow at a time'
      ],
      expert: [
        'Extract shadows from creatures up to CR 2 higher than your level',
        'Extracted shadows gain +2 to ability scores',
        'Can command up to 3 shadows simultaneously'
      ],
      master: [
        'Extract shadows from any creature regardless of CR',
        'Extracted shadows gain special abilities based on original creature',
        'Can command up to 6 shadows simultaneously',
        'Extraction time reduced to 1 minute'
      ]
    },
    applications: [
      'Create shadow army for combat support',
      'Extract shadows from powerful enemies to gain their abilities',
      'Use shadows for reconnaissance and scouting',
      'Sacrifice shadows to power shadow abilities'
    ],
    synergies: ['Shadow Mastery', 'Monarch\'s Aura', 'Shadow Command'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-step',
    name: 'Shadow Step',
    description: 'Teleport through shadows between areas of dim light or darkness.',
    ability: 'Dexterity',
    type: 'shadow',
    uses: 'Bonus action, range 60 feet',
    mechanics: {
      check: 'Dexterity (Stealth)',
      dc: '10 + distance in 10-foot increments',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Teleport between shadows up to 30 feet',
        'Cannot be used in bright light',
        'Provokes opportunity attacks if enemies can see destination'
      ],
      expert: [
        'Range increased to 60 feet',
        'Can bring one willing creature with you',
        'Can use in magical darkness'
      ],
      master: [
        'Range increased to 120 feet',
        'Can bring up to 3 willing creatures',
        'No opportunity attacks when teleporting',
        'Can use as reaction when targeted by attack'
      ]
    },
    applications: [
      'Escape dangerous situations',
      'Reposition for tactical advantage',
      'Infiltrate secure locations',
      'Rescue allies from danger'
    ],
    synergies: ['Shadow Stealth', 'Shadow Dance', 'Dimensional Awareness'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-stealth',
    name: 'Shadow Stealth',
    description: 'Advanced stealth techniques using shadows to remain undetected.',
    ability: 'Dexterity',
    type: 'shadow',
    uses: 'Passive or action to hide',
    mechanics: {
      check: 'Dexterity (Stealth)',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        'Advantage on Stealth checks in dim light',
        'Can hide while being observed if in shadows',
        'Normal penalties for speed reduction while hiding don\'t apply'
      ],
      expert: [
        'Expertise in Stealth (double proficiency)',
        'Can hide in bright light with disadvantage',
        'Moving doesn\'t break stealth in shadows'
      ],
      master: [
        'Cannot be detected by non-magical means while in shadows',
        'Can hide in plain sight with minor shadow illusions',
        'Magical darkness doesn\'t impede your stealth'
      ]
    },
    applications: [
      'Assassination and surprise attacks',
      'Infiltration and espionage',
      'Escape and evasion',
      'Scouting and reconnaissance'
    ],
    synergies: ['Shadow Step', 'Shadow Dance', 'Assassin Training'],
    source: 'System Ascendant Canon'
  },

  // COMBAT SKILLS
  {
    id: 'dagger-mastery',
    name: 'Dagger Mastery',
    description: 'Expertise with daggers and similar small blades, especially effective for shadow assassins.',
    ability: 'Dexterity',
    type: 'combat',
    uses: 'Passive',
    mechanics: {
      check: 'Dexterity (Attack rolls)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        '+2 to attack rolls with daggers',
        'Daggers count as magical for overcoming resistance',
        'Can throw daggers at range without disadvantage'
      ],
      expert: [
        '+3 to attack rolls with daggers',
        'Critical hits with daggers deal extra 1d6 damage',
        'Can draw daggers as part of attack'
      ],
      master: [
        '+4 to attack rolls with daggers',
        'Daggers have thrown range 30/90 feet',
        'Can attack with two daggers as one attack action',
        'Dagger attacks ignore cover'
      ]
    },
    applications: [
      'Close-quarters combat',
      'Thrown weapon attacks',
      'Assassination strikes',
      'Dual wielding'
    ],
    synergies: ['Shadow Dance', 'Critical Shadow', 'Two-Weapon Fighting'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'unarmed-combat',
    name: 'Unarmed Combat',
    description: 'Mastery of hand-to-hand combat without weapons.',
    ability: 'Strength',
    type: 'combat',
    uses: 'Passive',
    mechanics: {
      check: 'Strength (Attack rolls)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Unarmed strikes deal 1d4 + Strength modifier damage',
        'Can use Dexterity instead of Strength for unarmed attacks',
        'No disadvantage when attacking with both hands occupied'
      ],
      expert: [
        'Unarmed strikes deal 1d6 + Strength modifier damage',
        'Can use bonus action to make second unarmed attack',
        'Advantage on grapple checks'
      ],
      master: [
        'Unarmed strikes deal 1d8 + Strength modifier damage',
        'Can make three unarmed attacks per attack action',
        'Can stun opponent on critical hit (Constitution save DC 15)'
      ]
    },
    applications: [
      'When disarmed or without weapons',
        'Non-lethal combat',
        'Grapple and restrain opponents',
        'Crowd control'
    ],
    synergies: ['Monk Training', 'Brawler Style', 'Improved Grapple'],
    source: 'System Ascendant Canon'
  },

  // MAGICAL SKILLS
  {
    id: 'shadow-magic',
    name: 'Shadow Magic',
    description: 'Understanding and manipulation of shadow energy and dark magic.',
    ability: 'Intelligence',
    type: 'magical',
    uses: 'Varies by spell',
    mechanics: {
      check: 'Intelligence (Arcana)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can identify shadow spells and effects',
        'Advantage on saves against shadow magic',
        '+1 to spell attack rolls with shadow spells'
      ],
      expert: [
        'Can cast minor shadow cantrips',
        'Shadow spells cost 1 less spell slot to cast',
        'Can counter shadow spells more effectively'
      ],
      master: [
        'Can modify shadow spells on the fly',
        'Can create new shadow spells with Warden approval',
        'Immunity to shadow spell damage'
      ]
    },
    applications: [
      'Spell casting and modification',
      'Magical research and development',
      'Countering enemy magic',
      'Creating magical items'
    ],
    synergies: ['Arcane Mastery', 'Spellcraft', 'Dark Arts'],
    source: 'System Ascendant Canon'
  },

  // EXPLORATION SKILLS
  {
    id: 'dungeon-navigation',
    name: 'Dungeon Navigation',
    description: 'Expertise in navigating complex underground environments and dungeons.',
    ability: 'Wisdom',
    type: 'exploration',
    uses: 'Passive',
    mechanics: {
      check: 'Wisdom (Survival)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Cannot get lost in dungeons',
        'Advantage on Perception checks to notice traps',
        'Can estimate dungeon depth and direction'
      ],
      expert: [
        'Can map dungeons from memory',
        'Automatically notice secret doors on passive Perception',
        'Can predict dungeon layouts and monster placements'
      ],
      master: [
        'Can sense dungeon magic and enchantments',
        'Can navigate dungeons without sight',
        'Can find optimal paths through complex dungeons'
      ]
    },
    applications: [
      'Dungeon crawling and exploration',
      'Trap detection and avoidance',
        'Finding secret areas and treasure',
      'Escaping from dungeons'
    ],
    synergies: ['Trap Disarmament', 'Cartography', 'Stonecunning'],
    source: 'System Ascendant Canon'
  },

  // SOCIAL SKILLS
  {
    id: 'intimidation',
    name: 'Intimidation',
    description: 'Using presence, threats, and reputation to influence others through fear.',
    ability: 'Charisma',
    type: 'social',
    uses: 'Action or conversation',
    mechanics: {
      check: 'Charisma (Intimidation)',
      dc: 'opposed',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can frighten creatures of equal or lower level',
        'Advantage on Intimidation against shadow creatures',
        'Can use reputation to intimidate without direct threats'
      ],
      expert: [
        'Can frighten creatures up to 2 levels higher',
        'Can intimidate groups of creatures',
        'Frightened creatures have disadvantage on attacks against you'
      ],
      master: [
        'Can frighten any creature regardless of level',
        'Can cause permanent fear effects',
        'Reputation spreads, giving advantage on future Intimidation checks'
      ]
    },
    applications: [
      'Getting information through threats',
      'Avoiding combat through intimidation',
      'Controlling crowds and situations',
      'Establishing dominance'
    ],
    synergies: ['Menacing Presence', 'Leadership', 'Reputation'],
    source: 'System Ascendant Canon'
  },

  // UTILITY SKILLS
  {
    id: 'healing-enhancement',
    name: 'Healing Enhancement',
    description: 'Improved natural and magical healing abilities.',
    ability: 'Wisdom',
    type: 'exploration',
    uses: 'Varies by method',
    mechanics: {
      check: 'Wisdom (Medicine)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Stabilize dying creatures without check',
        'Healing spells restore +1d4 extra HP',
        'Natural healing during rest improved by 25%'
      ],
      expert: [
        'Can heal critical wounds without magic',
        'Healing spells restore +2d4 extra HP',
        'Can remove poison and disease with extended rest'
      ],
      master: [
        'Can regenerate lost limbs over time',
        'Healing spells restore +3d4 extra HP',
        'Can bring recently dead back to life (within 1 minute)'
      ]
    },
    applications: [
      'Combat healing and recovery',
      'Disease and poison treatment',
      'Long-term care and recovery',
      'Emergency medical response'
    ],
    synergies: ['Medical Training', 'Nature Magic', 'Divine Magic'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'strength-enhancement',
    name: 'Strength Enhancement',
    description: 'Supernatural physical strength beyond normal limits.',
    ability: 'Constitution',
    type: 'combat',
    uses: 'Passive',
    mechanics: {
      check: 'Strength (Athletics)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        '+2 to Strength ability checks',
        'Carry capacity doubled',
        'Athletics checks made with advantage'
      ],
      expert: [
        '+4 to Strength ability checks',
        'Carry capacity tripled',
        'Can break through walls and barriers'
      ],
      master: [
        '+6 to Strength ability checks',
        'Carry capacity quadrupled',
        'Can lift and throw massive objects'
      ]
    },
    applications: [
      'Breaking obstacles and barriers',
      'Heavy lifting and carrying',
      'Athletics competitions',
      'Combat grappling and shoving'
    ],
    synergies: ['Athletic Training', 'Body Building', 'Rage Enhancement'],
    source: 'System Ascendant Canon'
  },

  // ADVANCED COMBAT SKILLS
  {
    id: 'archery-mastery',
    name: 'Archery Mastery',
    description: 'Expertise with bows and other ranged weapons, allowing for impossible shots and rapid firing.',
    ability: 'Dexterity',
    type: 'combat',
    uses: 'Passive',
    mechanics: {
      check: 'Dexterity (Attack rolls)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        '+2 to attack rolls with ranged weapons',
        'Ignore half cover and three-quarters cover',
        'Can make ranged attacks in melee without disadvantage'
      ],
      expert: [
        '+3 to attack rolls with ranged weapons',
        'Can shoot arrows that curve around corners',
        'Can make two ranged attacks as one action'
      ],
      master: [
        '+4 to attack rolls with ranged weapons',
        'Arrows seek targets and ignore total cover',
        'Can make three ranged attacks as one action',
        'Critical hits with ranged weapons deal extra 1d8 damage'
      ]
    },
    applications: [
      'Long-range combat',
      'Precision shooting',
      'Crowd control with area arrows',
      'Supporting allies from distance'
    ],
    synergies: ['Eagle Eye', 'Rapid Shot', 'Trick Arrows'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'sword-mastery',
    name: 'Sword Mastery',
    description: 'Complete mastery of blade combat, including swords, katanas, and similar cutting weapons.',
    ability: 'Strength',
    type: 'combat',
    uses: 'Passive',
    mechanics: {
      check: 'Strength (Attack rolls)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        '+2 to attack rolls with swords',
        'Can use Dexterity instead of Strength for sword attacks',
        'Swords count as magical for overcoming resistance'
      ],
      expert: [
        '+3 to attack rolls with swords',
        'Can parry ranged attacks with swords',
        'Can make two sword attacks as one action'
      ],
      master: [
        '+4 to attack rolls with swords',
        'Sword attacks ignore armor class',
        'Can make three sword attacks as one action',
        'Can cut through magical barriers'
      ]
    },
    applications: [
      'Melee combat dominance',
      'Dueling powerful enemies',
      'Breaking enemy weapons and armor',
      'Defensive sword techniques'
    ],
    synergies: ['Blade Dance', 'Perfect Parry', 'Sword Aura'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'polearm-mastery',
    name: 'Polearm Mastery',
    description: 'Expertise with polearms, spears, and other long-reaching weapons for battlefield control.',
    ability: 'Strength',
    type: 'combat',
    uses: 'Passive',
    mechanics: {
      check: 'Strength (Attack rolls)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        '+2 to attack rolls with polearms',
        'Reach increased by 5 feet',
        'Can attack all creatures in reach with one action'
      ],
      expert: [
        '+3 to attack rolls with polearms',
        'Creatures hit must make Strength save or be knocked prone',
        'Polearm attacks ignore cover'
      ],
      master: [
        '+4 to attack rolls with polearms',
        'Can attack creatures 15 feet away',
        'Polearm attacks create shockwaves that hit multiple enemies',
        'Cannot be disarmed while wielding polearms'
      ]
    },
    applications: [
      'Battlefield control',
      'Crowd management',
      'Defensive formations',
      'Attacking from safe distances'
    ],
    synergies: ['Reach Extension', 'Sweeping Strikes', 'Fortress Stance'],
    source: 'System Ascendant Canon'
  },

  // ADVANCED SHADOW SKILLS
  {
    id: 'shadow-illusion',
    name: 'Shadow Illusion',
    description: 'Creating realistic illusions using shadow energy to deceive and confuse enemies.',
    ability: 'Intelligence',
    type: 'shadow',
    uses: 'Action, varies by illusion',
    mechanics: {
      check: 'Intelligence (Arcana)',
      dc: '13 + spell level',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Create minor visual illusions up to 10-foot cube',
        'Illusions last for 1 minute',
        'Can create sounds with illusions'
      ],
      expert: [
        'Create complex illusions up to 20-foot cube',
        'Illusions last for 10 minutes',
        'Illusions can interact with objects'
      ],
      master: [
        'Create realistic illusions up to 30-foot cube',
        'Illusions last until dispelled',
        'Illusions can cause real damage to those who believe them'
      ]
    },
    applications: [
      'Deception and misdirection',
      'Creating diversions',
      'Infiltration and espionage',
      'Psychological warfare'
    ],
    synergies: ['Shadow Magic', 'Mind Games', 'Perception Manipulation'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-healing',
    name: 'Shadow Healing',
    description: 'Using shadow energy to heal wounds and restore vitality through dark regeneration.',
    ability: 'Wisdom',
    type: 'shadow',
    uses: 'Action, varies by healing',
    mechanics: {
      check: 'Wisdom (Medicine)',
      dc: '15',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Heal 2d4+2 HP as action',
        'Can heal shadow creatures without limit',
        'Healing works in magical darkness'
      ],
      expert: [
        'Heal 4d4+4 HP as action',
        'Can heal multiple creatures at once',
        'Can remove shadow corruption'
      ],
      master: [
        'Heal 8d4+8 HP as action',
        'Can regenerate lost limbs over time',
        'Can bring shadow creatures back from death'
      ]
    },
    applications: [
      'Combat recovery',
      'Treating shadow-related injuries',
      'Supporting shadow allies',
      'Dark regeneration techniques'
    ],
    synergies: ['Healing Enhancement', 'Shadow Magic', 'Essence Absorption'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'shadow-summoning',
    name: 'Shadow Summoning',
    description: 'Calling forth shadow creatures and beings from the shadow realm to serve as allies.',
    ability: 'Charisma',
    type: 'shadow',
    uses: 'Action, varies by summon',
    mechanics: {
      check: 'Charisma (Performance)',
      dc: '14 + CR of summoned creature',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Summon shadow creatures up to CR 1',
        'Can maintain 1 summoned creature at a time',
        'Summoned creatures last for 10 minutes'
      ],
      expert: [
        'Summon shadow creatures up to CR 3',
        'Can maintain 2 summoned creatures at a time',
        'Summoned creatures last for 1 hour'
      ],
      master: [
        'Summon shadow creatures up to CR 5',
        'Can maintain 3 summoned creatures at a time',
        'Summoned creatures last until dismissed',
        'Can summon unique shadow beings'
      ]
    },
    applications: [
      'Building shadow armies',
        'Reconnaissance with shadow scouts',
        'Combat support with shadow warriors',
        'Specialized shadow servants'
      ],
    synergies: ['Shadow Extraction', 'Monarch\'s Aura', 'Shadow Command'],
    source: 'System Ascendant Canon'
  },

  // ADVANCED MAGICAL SKILLS
  {
    id: 'rune-crafting',
    name: 'Rune Crafting',
    description: 'The art of creating and inscribing magical runes to enhance items and abilities.',
    ability: 'Intelligence',
    type: 'magical',
    uses: 'Varies by rune',
    mechanics: {
      check: 'Intelligence (Arcana)',
      dc: '15 + rune power',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can create basic runes with minor effects',
        'Runes last for 24 hours',
        'Can inscribe 1 rune per item'
      ],
      expert: [
        'Can create complex runes with powerful effects',
        'Runes last until dispelled',
        'Can inscribe 3 runes per item'
      ],
      master: [
        'Can create legendary runes with unique effects',
        'Runes are permanent',
        'Can inscribe unlimited runes per item',
        'Can create sentient runes'
      ]
    },
    applications: [
      'Enchanting weapons and armor',
      'Creating magical traps',
      'Enhancing spell effects',
      'Crafting magical items'
    ],
    synergies: ['Shadow Magic', 'Arcane Mastery', 'Enchanting'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'mana-control',
    name: 'Mana Control',
    description: 'Precise control over magical energy for enhanced spellcasting and mana efficiency.',
    ability: 'Constitution',
    type: 'magical',
    uses: 'Passive',
    mechanics: {
      check: 'Constitution (Saving throws)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        '+10% mana efficiency',
        'Can recover 1 mana point per round',
        'Spells cost 1 less mana to cast'
      ],
      expert: [
        '+25% mana efficiency',
        'Can recover 2 mana points per round',
        'Can cast spells with reduced mana cost'
      ],
      master: [
        '+50% mana efficiency',
        'Can recover 3 mana points per round',
        'Can cast some spells without mana cost',
        'Can store excess mana for later use'
      ]
    },
    applications: [
      'Extended spellcasting',
      'Mana regeneration',
      'Powerful spell combinations',
      'Magical endurance'
    ],
    synergies: ['Shadow Magic', 'Arcane Mastery', 'Spell Enhancement'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'spell-enhancement',
    name: 'Spell Enhancement',
    description: 'Modifying and amplifying existing spells to increase their power and effectiveness.',
    ability: 'Intelligence',
    type: 'magical',
    uses: 'Bonus action per spell',
    mechanics: {
      check: 'Intelligence (Arcana)',
      dc: '13 + spell level',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can increase spell damage by +1d6',
        'Can extend spell duration by 50%',
        'Can increase spell save DC by +1'
      ],
      expert: [
        'Can increase spell damage by +2d6',
        'Can extend spell duration by 100%',
        'Can increase spell save DC by +2',
        'Can change spell damage type'
      ],
      master: [
        'Can increase spell damage by +3d6',
        'Can make spells permanent',
        'Can increase spell save DC by +3',
        'Can combine multiple spell effects'
      ]
    },
    applications: [
      'Amplifying combat spells',
      'Extending beneficial spells',
      'Overcoming magical resistance',
      'Creating unique spell combinations'
    ],
    synergies: ['Mana Control', 'Shadow Magic', 'Arcane Mastery'],
    source: 'System Ascendant Canon'
  },

  // ADVANCED EXPLORATION SKILLS
  {
    id: 'trap-detection',
    name: 'Trap Detection',
    description: 'Expertise in finding and disarming traps of all kinds, from mechanical to magical.',
    ability: 'Wisdom',
    type: 'exploration',
    uses: 'Passive or action',
    mechanics: {
      check: 'Wisdom (Perception) or Intelligence (Investigation)',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        'Advantage on Perception checks to find traps',
        'Can disarm simple traps without tools',
        'Automatically notice obvious traps'
      ],
      expert: [
        'Can detect magical traps',
        'Can disarm complex traps',
        'Can identify trap trigger mechanisms'
      ],
      master: [
        'Can detect all traps automatically',
        'Can disarm legendary traps',
        'Can reverse traps to target enemies',
        'Can create traps from detected mechanisms'
      ]
    },
    applications: [
      'Dungeon exploration',
      'Treasure hunting',
      'Security assessment',
      'Trap creation and modification'
    ],
    synergies: ['Dungeon Navigation', 'Lock Picking', 'Mechanical Aptitude'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'lock-picking',
    name: 'Lock Picking',
    description: 'The art of opening locks without keys, from simple mechanical locks to complex magical seals.',
    ability: 'Dexterity',
    type: 'exploration',
    uses: 'Action per lock',
    mechanics: {
      check: 'Dexterity (Thieves\' Tools)',
      dc: 'varies by lock complexity',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        'Can open simple locks in 1 minute',
        'Can pick locks without tools using improvisation',
        'Can identify lock mechanisms'
      ],
      expert: [
        'Can open complex locks in 30 seconds',
        'Can open magical locks',
        'Can disable lock traps'
      ],
      master: [
        'Can open any lock instantly',
        'Can open dimensional locks',
        'Can create master keys',
        'Can lockpick as bonus action'
      ]
    },
    applications: [
      'Infiltration',
      'Treasure access',
      'Escape and evasion',
      'Security bypassing'
    ],
    synergies: ['Trap Detection', 'Stealth', 'Mechanical Aptitude'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'survival-tracking',
    name: 'Survival Tracking',
    description: 'Expert tracking and survival skills for navigating wilderness and following targets.',
    ability: 'Wisdom',
    type: 'exploration',
    uses: 'Passive or action',
    mechanics: {
      check: 'Wisdom (Survival)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can track creatures through difficult terrain',
        'Can find food and water in wilderness',
        'Can predict weather changes'
      ],
      expert: [
        'Can track creatures that hide their trail',
        'Can survive in extreme environments',
        'Can navigate without any tools'
      ],
      master: [
        'Can track creatures across dimensions',
        'Can survive in magical environments',
        'Can predict natural disasters',
        'Can guide others through any terrain'
      ]
    },
    applications: [
      'Wilderness exploration',
      'Hunting and tracking',
      'Emergency survival',
      'Guide and scout services'
    ],
    synergies: ['Dungeon Navigation', 'Nature Knowledge', 'Environmental Adaptation'],
    source: 'System Ascendant Canon'
  },

  // ADVANCED SOCIAL SKILLS
  {
    id: 'persuasion-mastery',
    name: 'Persuasion Mastery',
    description: 'Advanced techniques of influence and persuasion to win allies and change minds.',
    ability: 'Charisma',
    type: 'social',
    uses: 'Conversation or action',
    mechanics: {
      check: 'Charisma (Persuasion)',
      dc: 'opposed or varies by difficulty',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Advantage on Persuasion checks against friendly targets',
        'Can convince creatures of similar alignment',
        'Can negotiate better prices (10% improvement)'
      ],
      expert: [
        'Can persuade hostile creatures to consider alternatives',
        'Can convince groups of people simultaneously',
        'Can negotiate much better prices (25% improvement)'
      ],
      master: [
        'Can persuade anyone of anything given time',
        'Can change creature attitudes permanently',
        'Can negotiate exceptional deals (50% improvement)',
        'Can persuade through magical means'
      ]
    },
    applications: [
      'Diplomacy and negotiations',
      'Recruiting allies',
      'Gathering information',
      'Conflict resolution'
    ],
    synergies: ['Leadership', 'Intimidation', 'Deception'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'deception-mastery',
    name: 'Deception Mastery',
    description: 'Expert lying and misdirection techniques to manipulate others and conceal truth.',
    ability: 'Charisma',
    type: 'social',
    uses: 'Conversation or action',
    mechanics: {
      check: 'Charisma (Deception)',
      dc: 'opposed or varies by difficulty',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Advantage on Deception checks against unsuspecting targets',
        'Can create believable lies',
        'Can hide intentions and motives'
      ],
      expert: [
        'Can lie to magical truth detection',
        'Can maintain multiple deceptions simultaneously',
        'Can convince others of false realities'
      ],
      master: [
        'Cannot be detected in lies by any means',
        'Can create elaborate false histories',
        'Can gaslight entire groups',
        'Can deceive through telepathy'
      ]
    },
    applications: [
      'Espionage and infiltration',
      'Misdirection and distraction',
      'Information manipulation',
      'Psychological operations'
    ],
    synergies: ['Persuasion Mastery', 'Shadow Illusion', 'Mind Games'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'leadership-command',
    name: 'Leadership Command',
    description: 'Natural leadership abilities that inspire loyalty and coordinate group efforts.',
    ability: 'Charisma',
    type: 'social',
    uses: 'Passive or action',
    mechanics: {
      check: 'Charisma (Performance)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Allies within 30 feet gain +1 to attack rolls',
        'Can coordinate group actions effectively',
        'Can inspire courage in allies'
      ],
      expert: [
        'Allies within 60 feet gain +2 to attack rolls and saving throws',
        'Can command groups of followers',
        'Can rally broken allies'
      ],
      master: [
        'Allies within 120 feet gain +3 to all rolls',
        'Can lead armies effectively',
        'Can inspire legendary loyalty',
        'Can coordinate complex tactical maneuvers'
      ]
    },
    applications: [
      'Party leadership',
      'Military command',
      'Organizing resistance',
      'Building organizations'
    ],
    synergies: ['Persuasion Mastery', 'Intimidating Presence', 'Architect\'s Authority'],
    source: 'System Ascendant Canon'
  },

  // ADVANCED CRAFTING SKILLS
  {
    id: 'blacksmithing',
    name: 'Blacksmithing',
    description: 'The art of forging weapons and armor from metal, including enhanced and magical items.',
    ability: 'Strength',
    type: 'exploration',
    uses: 'Varies by project',
    mechanics: {
      check: 'Strength (Athletics) or Intelligence (Arcana)',
      dc: 'varies by item complexity',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can craft basic weapons and armor',
        'Can repair damaged equipment',
        'Can identify metal quality'
      ],
      expert: [
        'Can craft masterwork weapons and armor',
        'Can enchant items with basic properties',
        'Can work with exotic metals'
      ],
      master: [
        'Can craft legendary weapons and armor',
        'Can create unique magical items',
        'Can forge artifacts of immense power',
        'Can teach blacksmithing to others'
      ]
    },
    applications: [
      'Weapon and armor crafting',
      'Equipment repair and maintenance',
      'Magical item creation',
      'Teaching and apprenticeship'
    ],
    synergies: ['Enchanting', 'Mining', 'Metalworking'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'alchemy',
    name: 'Alchemy',
    description: 'The science of creating potions, elixirs, and magical substances through transmutation.',
    ability: 'Intelligence',
    type: 'magical',
    uses: 'Varies by creation',
    mechanics: {
      check: 'Intelligence (Nature) or Intelligence (Arcana)',
      dc: 'varies by potion complexity',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can create basic healing potions',
        'Can identify common magical substances',
        'Can brew simple elixirs'
      ],
      expert: [
        'Can create complex potions and elixirs',
        'Can transmute base metals',
        'Can create magical reagents'
      ],
      master: [
        'Can create legendary potions with unique effects',
        'Can perform true transmutation',
        'Can create philosopher\'s stones',
        'Can discover new alchemical formulas'
      ]
    },
    applications: [
      'Potion brewing',
      'Magical research',
      'Healing substance creation',
      'Transmutation experiments'
    ],
    synergies: ['Herbalism', 'Arcane Mastery', 'Chemistry'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'enchanting',
    name: 'Enchanting',
    description: 'The magical art of imbuing items with supernatural powers and properties.',
    ability: 'Intelligence',
    type: 'magical',
    uses: 'Varies by enchantment',
    mechanics: {
      check: 'Intelligence (Arcana)',
      dc: '15 + enchantment power',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can add basic magical properties to items',
        'Can identify enchantments on items',
        'Can create minor magical charms'
      ],
      expert: [
        'Can create complex magical items',
        'Can combine multiple enchantments',
        'Can enchant multiple items simultaneously'
      ],
      master: [
        'Can create artifacts of immense power',
        'Can invent new enchantment types',
        'Can enchant items with sentient properties',
        'Can bind souls to items'
      ]
    },
    applications: [
      'Magical item creation',
      'Equipment enhancement',
      'Artifact crafting',
      'Magical research and development'
    ],
    synergies: ['Rune Crafting', 'Arcane Mastery', 'Blacksmithing'],
    source: 'System Ascendant Canon'
  },

  // ADVANCED MOVEMENT SKILLS
  {
    id: 'acrobatics',
    name: 'Acrobatics',
    description: 'Extraordinary agility and balance allowing for amazing feats of movement and dodging.',
    ability: 'Dexterity',
    type: 'exploration',
    uses: 'Passive or action',
    mechanics: {
      check: 'Dexterity (Acrobatics)',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        'Advantage on Dexterity saves to avoid being knocked prone',
        'Can move through difficult terrain without penalty',
        'Can make difficult jumps with advantage'
      ],
      expert: [
        'Can move along ceilings and walls briefly',
        'Can dodge attacks that should be impossible to avoid',
        'Can perform amazing acrobatic feats'
      ],
      master: [
        'Can fly for short periods without magic',
        'Can dodge area effects completely',
        'Can perform impossible physical feats',
        'Can teach acrobatics to others'
      ]
    },
    applications: [
      'Combat evasion',
      'Environmental navigation',
      'Performance and entertainment',
      'Escape and infiltration'
    ],
    synergies: ['Perfect Dodge', 'Speed Enhancement', 'Stealth'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'climbing',
    name: 'Climbing',
    description: 'Expert climbing abilities allowing ascent of any surface, no matter how sheer or treacherous.',
    ability: 'Strength',
    type: 'exploration',
    uses: 'Passive or action',
    mechanics: {
      check: 'Strength (Athletics)',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        'Climb at full speed without penalty',
        'Can climb difficult surfaces with advantage',
        'Can maintain grip for extended periods'
      ],
      expert: [
        'Can climb perfectly smooth surfaces',
        'Can climb while carrying heavy loads',
        'Can climb in combat without opportunity attacks'
      ],
      master: [
        'Can climb upside down on ceilings',
        'Can climb magical surfaces',
        'Can teach climbing techniques to others',
        'Can climb in any conditions'
      ]
    },
    applications: [
      'Dungeon exploration',
      'Mountain climbing',
      'Urban exploration',
      'Infiltration and escape'
    ],
    synergies: ['Athletic Training', 'Environmental Adaptation', 'Survival Tracking'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'swimming',
    name: 'Swimming',
    description: 'Masterful swimming abilities allowing movement through any water with ease and grace.',
    ability: 'Constitution',
    type: 'exploration',
    uses: 'Passive or action',
    mechanics: {
      check: 'Constitution (Athletics)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Swim at full speed without penalty',
        'Can hold breath for twice as long',
        'Can swim in rough conditions'
      ],
      expert: [
        'Can swim underwater indefinitely',
        'Can swim in magical or dangerous waters',
        'Can swim while carrying others'
      ],
      master: [
        'Can swim through solid ice',
        'Can breathe underwater naturally',
        'Can teach swimming to others',
        'Can swim in any liquid'
      ]
    },
    applications: [
      'Underwater exploration',
      'Water-based combat',
      'Rescue operations',
      'Environmental traversal'
    ],
    synergies: ['Athletic Training', 'Environmental Adaptation', 'Survival Tracking'],
    source: 'System Ascendant Canon'
  },

  // ADVANCED KNOWLEDGE SKILLS
  {
    id: 'arcana-mastery',
    name: 'Arcana Mastery',
    description: 'Deep understanding of magical theory, spellcraft, and the fundamental nature of magic.',
    ability: 'Intelligence',
    type: 'magical',
    uses: 'Passive or action',
    mechanics: {
      check: 'Intelligence (Arcana)',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        'Can identify spells as they are being cast',
        'Can understand magical writings and symbols',
        'Can analyze magical effects'
      ],
      expert: [
        'Can counter spells without using counter-spell',
        'Can modify existing spells',
        'Can create new magical theories'
      ],
      master: [
        'Can invent entirely new schools of magic',
        'Can understand the fundamental laws of magic',
        'Can teach arcane theory to others',
        'Can rewrite magical reality'
      ]
    },
    applications: [
      'Magical research',
      'Spell analysis and counterspelling',
      'Magical item identification',
      'Teaching and scholarship'
    ],
    synergies: ['Spell Enhancement', 'Mana Control', 'Enchanting'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'history-knowledge',
    name: 'History Knowledge',
    description: 'Comprehensive knowledge of historical events, cultures, and the flow of time.',
    ability: 'Intelligence',
    type: 'social',
    uses: 'Passive or action',
    mechanics: {
      check: 'Intelligence (History)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can recall historical facts and events',
        'Can identify historical artifacts',
        'Can understand historical contexts'
      ],
      expert: [
        'Can predict historical patterns',
        'Can learn from past mistakes',
        'Can identify historical influences'
      ],
      master: [
        'Can remember all of history perfectly',
        'Can see how past events affect the future',
        'Can teach history to others',
        'Can change historical outcomes'
      ]
    },
    applications: [
      'Historical research',
      'Cultural understanding',
      'Predicting future events',
      'Teaching and scholarship'
    ],
    synergies: ['Leadership Command', 'Persuasion Mastery', 'Deception Mastery'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'nature-knowledge',
    name: 'Nature Knowledge',
    description: 'Deep understanding of the natural world, including plants, animals, and ecosystems.',
    ability: 'Wisdom',
    type: 'exploration',
    uses: 'Passive or action',
    mechanics: {
      check: 'Wisdom (Nature)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can identify plants and animals',
        'Can understand natural cycles',
        'Can predict weather changes'
      ],
      expert: [
        'Can communicate with animals',
        'Can control natural forces',
        'Can heal natural environments'
      ],
      master: [
        'Can command nature itself',
        'Can create new species',
        'Can teach nature to others',
        'Can change natural laws'
      ]
    },
    applications: [
      'Wilderness survival',
      'Animal handling',
      'Environmental protection',
      'Natural magic'
    ],
    synergies: ['Survival Tracking', 'Environmental Adaptation', 'Healing Enhancement'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'religion-knowledge',
    name: 'Religion Knowledge',
    description: 'Comprehensive understanding of divine beings, religious practices, and spiritual matters.',
    ability: 'Wisdom',
    type: 'social',
    uses: 'Passive or action',
    mechanics: {
      check: 'Wisdom (Religion)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can identify religious symbols',
        'Can understand religious practices',
        'Can recognize divine beings'
      ],
      expert: [
        'Can communicate with divine beings',
        'Can perform religious rituals',
        'Can understand divine will'
      ],
      master: [
        'Can command divine beings',
        'Can create new religions',
        'Can teach religion to others',
        'Can become divine yourself'
      ]
    },
    applications: [
      'Religious studies',
      'Divine communication',
      'Spiritual guidance',
      'Religious leadership'
    ],
    synergies: ['Leadership Command', 'Healing Enhancement', 'Intimidating Presence'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'investigation',
    name: 'Investigation',
    description: 'Expert analytical skills for uncovering clues, solving puzzles, and finding hidden information.',
    ability: 'Intelligence',
    type: 'exploration',
    uses: 'Passive or action',
    mechanics: {
      check: 'Intelligence (Investigation)',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        'Can find hidden clues and objects',
        'Can solve simple puzzles',
        'Can analyze evidence'
      ],
      expert: [
        'Can solve complex mysteries',
        'Can deduce hidden truths',
        'Can analyze magical evidence'
      ],
      master: [
        'Can solve any mystery instantly',
        'Can find any hidden information',
        'Can teach investigation to others',
        'Can deduce impossible truths'
      ]
    },
    applications: [
      'Mystery solving',
      'Evidence analysis',
      'Research and investigation',
      'Intelligence gathering'
    ],
    synergies: ['Perception Enhancement', 'Deception Mastery', 'Trap Detection'],
    source: 'System Ascendant Canon'
  },

  // ADVANCED PERCEPTION SKILLS
  {
    id: 'perception-enhancement',
    name: 'Perception Enhancement',
    description: 'Supernaturally sharp senses allowing perception of things others cannot detect.',
    ability: 'Wisdom',
    type: 'exploration',
    uses: 'Passive',
    mechanics: {
      check: 'Wisdom (Perception)',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        'Advantage on all Perception checks',
        'Can see in low light without penalty',
        'Can hear whispers from far away'
      ],
      expert: [
        'Can see invisible creatures',
        'Can hear through walls',
        'Can detect magical auras'
      ],
      master: [
        'Can see through solid objects',
        'Can hear thoughts',
        'Can perceive other dimensions',
        'Can teach perception to others'
      ]
    },
    applications: [
      'Surveillance and scouting',
      'Hidden object detection',
      'Magical perception',
      'Intelligence gathering'
    ],
    synergies: ['Enhanced Senses', 'Trap Detection', 'Stealth'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'insight-mastery',
    name: 'Insight Mastery',
    description: 'Extraordinary ability to understand others\' intentions, emotions, and true thoughts.',
    ability: 'Wisdom',
    type: 'social',
    uses: 'Passive or action',
    mechanics: {
      check: 'Wisdom (Insight)',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        'Advantage on Insight checks',
        'Can detect lies and deception',
        'Can understand surface emotions'
      ],
      expert: [
        'Can read deep emotions',
        'Can understand hidden motives',
        'Can predict actions'
      ],
      master: [
        'Can read minds completely',
        'Can understand any creature',
        'Can teach insight to others',
        'Can see into souls'
      ]
    },
    applications: [
      'Interrogation and investigation',
      'Social manipulation',
      'Diplomacy and negotiation',
      'Psychological analysis'
    ],
    synergies: ['Persuasion Mastery', 'Deception Mastery', 'Intimidating Presence'],
    source: 'System Ascendant Canon'
  },

  // ADVANCED PERFORMANCE SKILLS
  {
    id: 'performance-mastery',
    name: 'Performance Mastery',
    description: 'Exceptional performance abilities allowing captivating performances that move audiences.',
    ability: 'Charisma',
    type: 'social',
    uses: 'Varies by performance',
    mechanics: {
      check: 'Charisma (Performance)',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        'Advantage on Performance checks',
        'Can captivate small audiences',
        'Can earn money through performances'
      ],
      expert: [
        'Can inspire emotions through performance',
        'Can perform magical effects through art',
        'Can teach performance to others'
      ],
      master: [
        'Can change reality through performance',
        'Can inspire legendary emotions',
        'Can create art that lasts forever',
        'Can perform for divine beings'
      ]
    },
    applications: [
      'Entertainment and performance',
      'Social influence',
      'Magical art creation',
      'Teaching and mentorship'
    ],
    synergies: ['Persuasion Mastery', 'Leadership Command', 'Deception Mastery'],
    source: 'System Ascendant Canon'
  },

  // ADVANCED SURVIVAL SKILLS
  {
    id: 'environmental-adaptation',
    name: 'Environmental Adaptation',
    description: 'Ability to adapt to and thrive in any environment, no matter how hostile or extreme.',
    ability: 'Constitution',
    type: 'exploration',
    uses: 'Passive',
    mechanics: {
      check: 'Constitution (Saving throws)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Resistance to environmental damage',
        'Can survive in extreme conditions',
        'Can adapt to climate changes'
      ],
      expert: [
        'Immunity to environmental effects',
        'Can thrive in any environment',
        'Can adapt to magical environments'
      ],
      master: [
        'Can change environments to suit needs',
        'Can survive in any dimension',
        'Can teach adaptation to others',
        'Can create new environments'
      ]
    },
    applications: [
      'Extreme environment survival',
      'Environmental control',
      'Dimensional adaptation',
      'Environmental protection'
    ],
    synergies: ['Survival Tracking', 'Nature Knowledge', 'Healing Enhancement'],
    source: 'System Ascendant Canon'
  }
];




