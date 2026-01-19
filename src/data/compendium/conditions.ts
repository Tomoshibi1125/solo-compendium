// Conditions Compendium - Authoritative Solo Leveling Content
// Status effects and conditions that affect characters in combat and exploration
// Based on D&D 5e conditions with Solo Leveling themed additions

export interface Condition {
  id: string;
  name: string;
  type: 'combat' | 'exploration' | 'magical' | 'shadow';
  description: string;
  effects: string[];
  duration?: string;
  removal?: string[];
  save?: {
    type: 'Strength' | 'Dexterity' | 'Constitution' | 'Intelligence' | 'Wisdom' | 'Charisma';
    dc?: number;
    description?: string;
  };
  source: string;
  image?: string;
}

export const conditions: Condition[] = [
  // STANDARD D&D CONDITIONS
  {
    id: 'blinded',
    name: 'Blinded',
    type: 'combat',
    description: 'A blinded creature can\'t see and automatically fails any ability check that requires sight.',
    effects: [
      'Attack rolls against the creature have advantage',
      'The creature\'s attack rolls have disadvantage',
      'The creature automatically fails any ability check that requires sight'
    ],
    removal: ['The effect ends if the creature can see again', 'Lesser restoration spell'],
    source: 'SRD 5.1'
  },
  {
    id: 'charmed',
    name: 'Charmed',
    type: 'magical',
    description: 'A charmed creature can\'t attack the charmer or target the charmer with harmful abilities or magical effects.',
    effects: [
      'The charmer has advantage on any ability check to interact socially with the creature',
      'The creature can\'t attack the charmer',
      'The creature can\'t target the charmer with harmful abilities or magical effects'
    ],
    removal: ['The charmer or creature ends the effect', 'The charmer harms the creature'],
    source: 'SRD 5.1'
  },
  {
    id: 'deafened',
    name: 'Deafened',
    type: 'combat',
    description: 'A deafened creature can\'t hear and automatically fails any ability check that requires hearing.',
    effects: [
      'The creature automatically fails any ability check that requires hearing'
    ],
    removal: ['The effect ends if the creature can hear again', 'Lesser restoration spell'],
    source: 'SRD 5.1'
  },
  {
    id: 'exhaustion',
    name: 'Exhaustion',
    type: 'exploration',
    description: 'Exhaustion is measured in six levels. Each level of exhaustion has a cumulative effect.',
    effects: [
      'Level 1: Disadvantage on ability checks',
      'Level 2: Speed halved',
      'Level 3: Disadvantage on attack rolls and saving throws',
      'Level 4: Hit point maximum halved',
      'Level 5: Speed reduced to 0',
      'Level 6: Death'
    ],
    removal: ['Finishing a long rest reduces exhaustion level by 1', 'Greater restoration spell'],
    source: 'SRD 5.1'
  },
  {
    id: 'frightened',
    name: 'Frightened',
    type: 'combat',
    description: 'A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.',
    effects: [
      'Disadvantage on ability checks and attack rolls while source is in line of sight',
      'Can\'t willingly move closer to the source of its fear'
    ],
    removal: ['The source of fear is no longer present', 'End of turn if creature makes successful Wisdom save'],
    save: {
      type: 'Wisdom',
      description: 'Can repeat save at end of each turn'
    },
    source: 'SRD 5.1'
  },
  {
    id: 'grappled',
    name: 'Grappled',
    type: 'combat',
    description: 'A grappled creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed.',
    effects: [
      'Speed becomes 0',
      'Can\'t benefit from any bonus to speed',
      'The condition ends if the grappler is incapacitated',
      'The condition ends if an effect removes the grappled creature from the reach of the grappler'
    ],
    removal: ['Escape by succeeding on Strength (Athletics) or Dexterity (Acrobatics) check contested by grappler\'s Strength (Athletics)', 'Grappler becomes incapacitated', 'Effect removes grappled creature from grappler\'s reach'],
    source: 'SRD 5.1'
  },
  {
    id: 'incapacitated',
    name: 'Incapacitated',
    type: 'combat',
    description: 'An incapacitated creature can\'t take actions or reactions.',
    effects: [
      'Can\'t take actions',
      'Can\'t take reactions'
    ],
    source: 'SRD 5.1'
  },
  {
    id: 'invisible',
    name: 'Invisible',
    type: 'magical',
    description: 'An invisible creature is impossible to see without the aid of magic or a special sense.',
    effects: [
      'For the purposes of hiding, the creature is heavily obscured',
      'The creature\'s location can be detected by any noise it makes or tracks it leaves',
      'Attack rolls against the creature have disadvantage',
      'The creature\'s attack rolls have advantage'
    ],
    removal: ['The creature makes any attack', 'The creature casts a spell with verbal components', 'The creature grapples or interacts with an object'],
    source: 'SRD 5.1'
  },
  {
    id: 'paralyzed',
    name: 'Paralyzed',
    type: 'combat',
    description: 'A paralyzed creature is incapacitated and can\'t move or speak.',
    effects: [
      'Incapacitated (can\'t take actions or reactions)',
      'Can\'t move or speak',
      'Automatically fails Strength and Dexterity saving throws',
      'Attack rolls against the creature have advantage',
      'Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature'
    ],
    removal: ['Lesser restoration spell', 'Greater restoration spell'],
    source: 'SRD 5.1'
  },
  {
    id: 'petrified',
    name: 'Petrified',
    type: 'magical',
    description: 'A petrified creature is transformed into a solid substance.',
    effects: [
      'Has resistance to all damage',
      'Is immune to poison and disease',
      'Is incapacitated (can\'t take actions or reactions)',
      'Can\'t move or speak',
      'Automatically fails Strength and Dexterity saving throws'
    ],
    removal: ['Greater restoration spell', 'Wish spell'],
    source: 'SRD 5.1'
  },
  {
    id: 'poisoned',
    name: 'Poisoned',
    type: 'combat',
    description: 'A poisoned creature has disadvantage on attack rolls and ability checks.',
    effects: [
      'Disadvantage on attack rolls',
      'Disadvantage on ability checks'
    ],
    removal: ['Lesser restoration spell', 'Greater restoration spell'],
    source: 'SRD 5.1'
  },
  {
    id: 'prone',
    name: 'Prone',
    type: 'combat',
    description: 'A prone creature is lying flat on the ground.',
    effects: [
      'The only movement option is to crawl',
      'Attack rolls against the creature have advantage if the attacker is within 5 feet',
      'Attack rolls against the creature have disadvantage if the attacker is more than 5 feet away',
      'The creature\'s attack rolls have disadvantage'
    ],
    removal: ['Creature spends half of movement to stand up'],
    source: 'SRD 5.1'
  },
  {
    id: 'restrained',
    name: 'Restrained',
    type: 'combat',
    description: 'A restrained creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed.',
    effects: [
      'Speed becomes 0',
      'Attack rolls against the creature have advantage',
      'The creature\'s attack rolls have disadvantage'
    ],
    removal: ['Escape by succeeding on Strength (Athletics) or Dexterity (Acrobatics) check', 'Effect ends'],
    source: 'SRD 5.1'
  },
  {
    id: 'stunned',
    name: 'Stunned',
    type: 'combat',
    description: 'A stunned creature is incapacitated, can\'t move, and can speak only falteringly.',
    effects: [
      'Incapacitated (can\'t take actions or reactions)',
      'Can\'t move',
      'Can speak only falteringly',
      'Automatically fails Strength and Dexterity saving throws'
    ],
    removal: ['End of stunned condition', 'Lesser restoration spell'],
    source: 'SRD 5.1'
  },
  {
    id: 'unconscious',
    name: 'Unconscious',
    type: 'combat',
    description: 'An unconscious creature is incapacitated, can\'t move or speak, and is unaware of its surroundings.',
    effects: [
      'Incapacitated (can\'t take actions or reactions)',
      'Can\'t move or speak',
      'Unaware of surroundings',
      'Drops whatever is holding',
      'Falls prone',
      'Attack rolls against the creature have advantage',
      'Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature'
    ],
    removal: ['Creature regains consciousness', 'Healing magic'],
    source: 'SRD 5.1'
  },

  // SOLO LEVELING THEMED CONDITIONS
  {
    id: 'shadow-corrupted',
    name: 'Shadow Corrupted',
    type: 'shadow',
    description: 'The creature has been corrupted by shadow energy, twisting their mind and body.',
    effects: [
      'Disadvantage on Wisdom saving throws',
      'Take 1d6 necrotic damage at the start of each turn',
      'Cannot benefit from healing spells from light sources',
      'Advantage on attacks against creatures in bright light'
    ],
    duration: 'Until cured or 1 hour',
    removal: ['Greater restoration spell', 'Shadow cleansing ritual', 'Exposure to bright light for 10 minutes'],
    save: {
      type: 'Wisdom',
      description: 'Can repeat save at end of each turn after taking damage'
    },
    source: 'Solo Leveling Canon',
    image: '/generated/conditions/shadow-corrupted.webp'
  },
  {
    id: 'gate-exhausted',
    name: 'Gate Exhausted',
    type: 'shadow',
    description: 'Exhaustion from surviving a gate raid or intense shadow energy exposure.',
    effects: [
      'Disadvantage on all ability checks',
      'Speed reduced by half',
      'Cannot use shadow abilities or spells',
      'Take extra damage from shadow attacks'
    ],
    duration: 'Until long rest',
    removal: ['Long rest', 'Greater restoration spell', 'Shadow recovery potion'],
    source: 'Solo Leveling Canon',
    image: '/generated/conditions/gate-exhausted.webp'
  },
  {
    id: 'essence-drained',
    name: 'Essence Drained',
    type: 'shadow',
    description: 'The creature\'s life essence has been drained by shadow magic or a powerful shadow being.',
    effects: [
      'Maximum hit points reduced by 10',
      'Disadvantage on Constitution saving throws',
      'Cannot regain hit points except through long rest',
      'Shadow creatures have advantage on attacks against you'
    ],
    duration: 'Until cured',
    removal: ['Greater restoration spell', 'Essence recovery ritual', 'Defeating the creature that drained you'],
    source: 'Solo Leveling Canon',
    image: '/generated/conditions/essence-drained.webp'
  },
  {
    id: 'shadow-bound',
    name: 'Shadow Bound',
    type: 'shadow',
    description: 'The creature is magically bound to a shadow master or location.',
    effects: [
      'Cannot willingly move more than 30 feet from the binding point',
      'Disadvantage on attack rolls against the binder',
      'Binder can cause psychic damage as a bonus action',
      'Cannot use teleportation or planar travel abilities'
    ],
    duration: 'Until binding is broken',
    removal: ['Binder dies or releases the binding', 'Dispel magic spell', 'Breaking the binding ritual'],
    save: {
      type: 'Charisma',
      description: 'Can attempt to break free once per day'
    },
    source: 'Solo Leveling Canon',
    image: '/generated/conditions/shadow-bound.webp'
  },
  {
    id: 'monarch-marked',
    name: 'Monarch Marked',
    type: 'shadow',
    description: 'Marked by a Monarch for death or recruitment. The mark cannot be hidden.',
    effects: [
      'Monarch and their servants can always track your location',
      'Disadvantage on stealth checks',
      'Monarch can communicate with you telepathically',
      'Cannot benefit from illusions or disguises against the Monarch'
    ],
    duration: 'Until Monarch removes it or dies',
    removal: ['Monarch removes the mark', 'Monarch dies', 'Divine intervention', 'Wish spell'],
    source: 'Solo Leveling Canon',
    image: '/generated/conditions/monarch-marked.webp'
  },
  {
    id: 'shadow-fused',
    name: 'Shadow Fused',
    type: 'shadow',
    description: 'Temporarily fused with shadow energy, gaining enhanced abilities but losing control.',
    effects: [
      'Advantage on Dexterity and Strength checks',
      'Resistance to necrotic damage',
      'Can see in magical darkness',
      'Disadvantage on Intelligence and Wisdom saving throws',
      'Must make Wisdom save each turn or attack nearest creature'
    ],
    duration: '1 minute',
    removal: ['Duration expires', 'Lose consciousness', 'Remove curse spell'],
    save: {
      type: 'Wisdom',
      description: 'Must save each turn to maintain control'
    },
    source: 'Solo Leveling Canon',
    image: '/generated/conditions/shadow-fused.webp'
  }
];
