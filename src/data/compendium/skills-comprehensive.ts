// Comprehensive Skills Compendium - Authoritative System Ascendant Content
// ALL skills needed for the complete compendium system
// Based on System Ascendant canon with SRD 5e mechanics

export interface Skill {
  id: string;
  name: string;
  description: string;
  ability: 'Strength' | 'Dexterity' | 'Constitution' | 'Intelligence' | 'Wisdom' | 'Charisma';
  type: 'combat' | 'exploration' | 'social' | 'magical' | 'shadow' | 'crafting' | 'survival';
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

export const comprehensiveSkills: Skill[] = [
  // SHADOW SKILLS (Expanded)
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
  {
    id: 'shadow-command',
    name: 'Shadow Command',
    description: 'The ability to command and control shadow beings and entities.',
    ability: 'Charisma',
    type: 'shadow',
    uses: 'Action, contested check',
    mechanics: {
      check: 'Charisma (Intimidation) or Wisdom (Insight)',
      dc: 'opposed',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Command weak shadow creatures (CR 1 or less)',
        'Can issue simple commands to shadows',
        'Shadow creatures have disadvantage on saves against your commands'
      ],
      expert: [
        'Command moderate shadow creatures (CR 5 or less)',
        'Can issue complex commands',
        'Can maintain control over multiple shadows simultaneously'
      ],
      master: [
        'Command any shadow creature regardless of CR',
        'Can mentally command shadows without speaking',
        'Can force shadows to sacrifice themselves for you'
      ]
    },
    applications: [
      'Control shadow army in combat',
      'Interrogate captured shadow beings',
      'Force shadows to perform specific tasks',
      'Negotiate with powerful shadow entities'
    ],
    synergies: ['Monarch\'s Aura', 'Intimidation', 'Leadership'],
    source: 'System Ascendant Canon'
  },

  // COMBAT SKILLS (Expanded)
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
    id: 'sword-mastery',
    name: 'Sword Mastery',
    description: 'Expertise with all types of swords, from short swords to greatswords.',
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
        'Can use any sword type without penalty',
        'Sword attacks deal +1 damage'
      ],
      expert: [
        '+3 to attack rolls with swords',
        'Can parry with swords as reaction',
        'Sword attacks deal +2 damage'
      ],
      master: [
        '+4 to attack rolls with swords',
        'Can perform disarming attacks with swords',
        'Sword attacks deal +3 damage and ignore resistance'
      ]
    },
    applications: [
      'Melee combat',
      'Dueling and parrying',
      'Weapon-based techniques',
      'Military combat'
    ],
    synergies: ['Weapon Focus', 'Combat Training', 'Dueling'],
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
  {
    id: 'archery',
    name: 'Archery',
    description: 'Expertise with bows, crossbows, and other ranged weapons.',
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
        'Ignore cover penalties up to half cover',
        'Can reload ranged weapons as part of movement'
      ],
      expert: [
        '+3 to attack rolls with ranged weapons',
        'Ignore all cover penalties',
        'Ranged attacks deal +1 damage'
      ],
      master: [
        '+4 to attack rolls with ranged weapons',
        'Can make ranged attacks in melee without disadvantage',
        'Ranged attacks deal +2 damage and ignore resistance'
      ]
    },
    applications: [
      'Long-range combat',
      'Hunting and tracking',
      'Siege warfare',
      'Cover-based combat'
    ],
    synergies: ['Sharpshooter', 'Ascendant Training', 'Precision Shooting'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'shield-mastery',
    name: 'Shield Mastery',
    description: 'Expertise in using shields for both defense and offense.',
    ability: 'Strength',
    type: 'combat',
    uses: 'Passive',
    mechanics: {
      check: 'Strength (Athletics)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        '+2 AC when using shield',
        'Can use shield as improvised weapon (1d4 damage)',
        'Shield bash can knock opponent prone'
      ],
      expert: [
        '+3 AC when using shield',
        'Shield bash deals 1d6 damage',
        'Can use shield to block spells as reaction'
      ],
      master: [
        '+4 AC when using shield',
        'Shield bash deals 1d8 damage',
        'Can use shield to protect adjacent allies'
      ]
    },
    applications: [
      'Defensive combat',
      'Shield wall formations',
      'Protecting allies',
      'Shield-based tactics'
    ],
    synergies: ['Defense Training', 'Tank Combat', 'Protection'],
    source: 'System Ascendant Canon'
  },

  // EXPLORATION SKILLS (Expanded)
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
  {
    id: 'wilderness-survival',
    name: 'Wilderness Survival',
    description: 'Expertise in surviving and thriving in natural environments.',
    ability: 'Wisdom',
    type: 'exploration',
    uses: 'Passive',
    mechanics: {
      check: 'Wisdom (Survival)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can find food and water in the wild',
        'Can predict weather changes',
        'Can track creatures through natural terrain'
      ],
      expert: [
        'Can survive in extreme conditions',
        'Can navigate without tools',
        'Can identify dangerous plants and animals'
      ],
      master: [
        'Can live off the land indefinitely',
        'Can tame wild animals',
        'Can predict natural disasters'
      ]
    },
    applications: [
      'Long-distance travel',
      'Hunting and gathering',
      'Tracking and pursuit',
      'Natural disaster survival'
    ],
    synergies: ['Herbalism', 'Animal Handling', 'Nature Lore'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'urban-navigation',
    name: 'Urban Navigation',
    description: 'Expertise in navigating cities, towns, and other civilized areas.',
    ability: 'Intelligence',
    type: 'exploration',
    uses: 'Passive',
    mechanics: {
      check: 'Intelligence (Investigation)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Cannot get lost in cities',
        'Know shortest paths through urban areas',
        'Can identify dangerous neighborhoods'
      ],
      expert: [
        'Can navigate sewers and underground passages',
        'Can find hidden locations in cities',
        'Can predict guard patrol routes'
      ],
      master: [
        'Can navigate any city without ever being seen',
        'Can find secret passages and hideouts',
        'Can predict urban events and disturbances'
      ]
    },
    applications: [
      'Urban exploration',
      'Infiltration of cities',
      'Finding hidden locations',
      'Avoiding authorities'
    ],
    synergies: ['Street Smarts', 'Investigation', 'Urban Lore'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'tracking',
    name: 'Tracking',
    description: 'The ability to follow tracks and trails left by creatures.',
    ability: 'Wisdom',
    type: 'exploration',
    uses: 'Action or passive',
    mechanics: {
      check: 'Wisdom (Survival)',
      dc: 'Based on terrain and age of tracks',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can follow tracks in most terrains',
        'Can estimate time since tracks were made',
        'Can identify creature type from tracks'
      ],
      expert: [
        'Can follow tracks in difficult terrain',
        'Can determine creature\'s condition from tracks',
        'Can follow tracks up to 48 hours old'
      ],
      master: [
        'Can follow tracks in any terrain',
        'Can determine exact creature from tracks',
        'Can follow tracks up to 7 days old'
      ]
    },
    applications: [
      'Hunting and pursuit',
      'Finding lost creatures',
      'Investigating crime scenes',
      'Avoiding pursuit'
    ],
    synergies: ['Wilderness Survival', 'Investigation', 'Nature Lore'],
    source: 'System Ascendant Canon'
  },

  // SOCIAL SKILLS (Expanded)
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
        'Advantage on Charisma (Intimidation) checks',
        'Can use Wisdom modifier instead of Charisma for Intimidation',
        'Enemies within 30 feet have disadvantage on attacks against your allies'
      ],
      expert: [
        'Can intimidate groups of creatures',
        'Frightened creatures have disadvantage on attacks against you',
        'Can force creatures to reveal information through fear'
      ],
      master: [
        'Can intimidate any creature regardless of level',
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
  {
    id: 'persuasion',
    name: 'Persuasion',
    description: 'Using logic, charm, and reasoning to influence others\' opinions and actions.',
    ability: 'Charisma',
    type: 'social',
    uses: 'Conversation or action',
    mechanics: {
      check: 'Charisma (Persuasion)',
      dc: 'Based on target\'s attitude',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Advantage on Charisma (Persuasion) checks',
        'Can persuade neutral creatures more easily',
        'Can change attitudes of friendly creatures'
      ],
      expert: [
        'Can persuade hostile creatures',
        'Can convince groups of people',
        'Can persuade creatures to take risks'
      ],
      master: [
        'Can persuade any creature regardless of attitude',
        'Can convince creatures to act against their nature',
        'Can inspire loyalty and devotion'
      ]
    },
    applications: [
      'Negotiation and diplomacy',
      'Recruiting allies',
      'Changing opinions',
      'Resolving conflicts peacefully'
    ],
    synergies: ['Diplomacy', 'Leadership', 'Social Grace'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'deception',
    name: 'Deception',
    description: 'The art of lying, misleading others, and hiding the truth.',
    ability: 'Charisma',
    type: 'social',
    uses: 'Conversation or action',
    mechanics: {
      check: 'Charisma (Deception)',
      dc: 'opposed by Wisdom (Insight)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Advantage on Charisma (Deception) checks',
        'Can maintain lies under basic questioning',
        'Can create simple alibis'
      ],
      expert: [
        'Can lie under magical scrutiny',
        'Can create complex deceptions',
        'Can detect when others are lying'
      ],
      master: [
        'Can lie undetectable even to magical means',
        'Can convince others of impossible things',
        'Can create false memories in others'
      ]
    },
    applications: [
      'Espionage and infiltration',
      'Avoiding trouble',
      'Gathering information',
      'Creating diversions'
    ],
    synergies: ['Bluffing', 'Disguise', 'Acting'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Entertaining audiences through music, acting, storytelling, or other arts.',
    ability: 'Charisma',
    type: 'social',
    uses: 'Performance or action',
    mechanics: {
      check: 'Charisma (Performance)',
      dc: 'Based on audience and difficulty',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can entertain small audiences',
        'Can earn money through performances',
        'Can influence moods through performance'
      ],
      expert: [
        'Can captivate large audiences',
        'Can inspire emotions through performance',
        'Can earn significant money through performances'
      ],
      master: [
        'Can move audiences to action',
        'Can perform legendary feats that become stories',
        'Can inspire entire communities'
      ]
    },
    applications: [
      'Earning money',
      'Influencing crowds',
      'Spreading information',
      'Creating legends'
    ],
    synergies: ['Music', 'Acting', 'Storytelling'],
    source: 'System Ascendant Canon'
  },

  // MAGICAL SKILLS (Expanded)
  {
    id: 'arcana',
    name: 'Arcana',
    description: 'Knowledge of magical theory, spells, and magical phenomena.',
    ability: 'Intelligence',
    type: 'magical',
    uses: 'Knowledge check',
    mechanics: {
      check: 'Intelligence (Arcana)',
      dc: 'Based on complexity',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can identify common spells and effects',
        'Can understand basic magical theory',
        'Can identify magical items'
      ],
      expert: [
        'Can identify rare spells and effects',
        'Can understand complex magical theory',
        'Can create simple magical items'
      ],
      master: [
        'Can identify legendary spells and effects',
        'Can create new spells',
        'Can understand the nature of magic itself'
      ]
    },
    applications: [
      'Magical research',
      'Identifying spells',
      'Creating magical items',
      'Countering enemy magic'
    ],
    synergies: ['Spellcraft', 'Magical Theory', 'Research'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'spellcraft',
    name: 'Spellcraft',
    description: 'The practical art of casting, modifying, and creating spells.',
    ability: 'Intelligence',
    type: 'magical',
    uses: 'Varies by spell',
    mechanics: {
      check: 'Intelligence (Arcana)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can cast spells more efficiently',
        'Can modify existing spells slightly',
        'Can identify spell components'
      ],
      expert: [
        'Can significantly modify spells',
        'Can create new spells based on existing ones',
        'Can cast spells without components'
      ],
      master: [
        'Can create entirely new spells',
        'Can combine spells to create new effects',
        'Can cast spells without spell slots'
      ]
    },
    applications: [
      'Spell casting',
      'Magical research',
      'Creating new spells',
      'Improving existing spells'
    ],
    synergies: ['Arcana', 'Magical Theory', 'Research'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'magical-theory',
    name: 'Magical Theory',
    description: 'Deep understanding of how magic works at a fundamental level.',
    ability: 'Intelligence',
    type: 'magical',
    uses: 'Knowledge check',
    mechanics: {
      check: 'Intelligence (Arcana)',
      dc: 'Based on complexity',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        'Understand basic magical principles',
        'Can identify magical schools',
        'Can predict magical interactions'
      ],
      expert: [
        'Understand complex magical interactions',
        'Can identify magical patterns',
        'Can predict magical outcomes'
      ],
      master: [
        'Understand the nature of reality',
        'Can manipulate magical laws',
        'Can create new magical systems'
      ]
    },
    applications: [
      'Magical research',
      'Understanding complex spells',
      'Creating new magic systems',
      'Magical engineering'
    ],
    synergies: ['Arcana', 'Spellcraft', 'Research'],
    source: 'System Ascendant Canon'
  },

  // CRAFTING SKILLS (New Category)
  {
    id: 'blacksmithing',
    name: 'Blacksmithing',
    description: 'The art of forging metal weapons, armor, and tools.',
    ability: 'Strength',
    type: 'crafting',
    uses: 'Crafting action',
    mechanics: {
      check: 'Strength (Athletics) or Intelligence (Investigation)',
      dc: 'Based on item complexity',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can forge basic weapons and armor',
        'Can repair metal items',
        'Can identify metal quality'
      ],
      expert: [
        'Can forge masterwork weapons and armor',
        'Can enchant metal items',
        'Can work with rare metals'
      ],
      master: [
        'Can forge legendary weapons and armor',
        'Can create new metal alloys',
        'Can forge items with magical properties'
      ]
    },
    applications: [
      'Creating weapons and armor',
      'Repairing equipment',
      'Enchanting metal items',
      'Custom crafting'
    ],
    synergies: ['Metalworking', 'Enchanting', 'Crafting'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'alchemy',
    name: 'Alchemy',
    description: 'The art of brewing potions, creating magical substances, and chemical reactions.',
    ability: 'Intelligence',
    type: 'crafting',
    uses: 'Crafting action',
    mechanics: {
      check: 'Intelligence (Nature) or Intelligence (Arcana)',
      dc: 'Based on potion complexity',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can brew basic potions',
        'Can identify common ingredients',
        'Can create simple chemical reactions'
      ],
      expert: [
        'Can brew complex potions',
        'Can work with rare ingredients',
        'Can create magical substances'
      ],
      master: [
        'Can brew legendary potions',
        'Can create new ingredients',
        'Can transmute substances'
      ]
    },
    applications: [
      'Creating potions',
      'Magical research',
      'Healing and enhancement',
      'Chemical warfare'
    ],
    synergies: ['Herbalism', 'Magical Theory', 'Research'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'enchanting',
    name: 'Enchanting',
    description: 'The art of imbuing items with magical properties and enchantments.',
    ability: 'Intelligence',
    type: 'crafting',
    uses: 'Crafting action',
    mechanics: {
      check: 'Intelligence (Arcana)',
      dc: 'Based on enchantment complexity',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        'Can add basic enchantments to items',
        'Can identify existing enchantments',
        'Can repair magical items'
      ],
      expert: [
        'Can add complex enchantments to items',
        'Can create new enchantments',
        'Can combine multiple enchantments'
      ],
      master: [
        'Can create legendary enchantments',
        'Can enchant items with unique properties',
        'Can create sentient magical items'
      ]
    },
    applications: [
      'Enchanting weapons and armor',
      'Creating magical items',
      'Improving existing items',
      'Magical crafting'
    ],
    synergies: ['Arcana', 'Spellcraft', 'Crafting'],
    source: 'System Ascendant Canon'
  },

  // UTILITY SKILLS (Expanded)
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
  {
    id: 'perception-enhancement',
    name: 'Perception Enhancement',
    description: 'Supernatural senses and perception beyond normal limits.',
    ability: 'Wisdom',
    type: 'exploration',
    uses: 'Passive',
    mechanics: {
      check: 'Wisdom (Perception)',
      scaling: 'expertise'
    },
    benefits: {
      basic: [
        '+2 to Wisdom (Perception) checks',
        'Can see in dim light as if it were bright light',
        'Can hear whispers from 30 feet away'
      ],
      expert: [
        '+4 to Wisdom (Perception) checks',
        'Can see in magical darkness',
        'Can hear heartbeats from 10 feet away'
      ],
      master: [
        '+6 to Wisdom (Perception) checks',
        'Can see invisible creatures',
        'Can hear thoughts from 5 feet away'
      ]
    },
    applications: [
      'Scouting and reconnaissance',
      'Detecting ambushes',
      'Finding hidden objects',
      'Investigation'
    ],
    synergies: ['Awareness', 'Investigation', 'Stealth Counter'],
    source: 'System Ascendant Canon'
  },
  {
    id: 'agility-enhancement',
    name: 'Agility Enhancement',
    description: 'Supernatural agility and reflexes beyond normal limits.',
    ability: 'Dexterity',
    type: 'combat',
    uses: 'Passive',
    mechanics: {
      check: 'Dexterity (Acrobatics)',
      scaling: 'proficiency'
    },
    benefits: {
      basic: [
        '+2 to Dexterity ability checks',
        'Move through difficult terrain without penalty',
        'Reflex saves made with advantage'
      ],
      expert: [
        '+4 to Dexterity ability checks',
        'Can move on walls and ceilings briefly',
        'Can dodge attacks as reaction'
      ],
      master: [
        '+6 to Dexterity ability checks',
        'Can fly for short periods',
        'Can move faster than the eye can follow'
      ]
    },
    applications: [
      'Acrobatic maneuvers',
      'Dodging attacks',
      'Movement-based combat',
      'Escaping dangerous situations'
    ],
    synergies: ['Acrobatics Training', 'Reflex Enhancement', 'Speed Enhancement'],
    source: 'System Ascendant Canon'
  }
];




