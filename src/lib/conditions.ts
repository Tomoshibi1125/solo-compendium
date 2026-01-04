/**
 * Condition effects and automation
 * Handles condition application and effects on characters
 */

export interface ConditionEffect {
  name: string;
  description: string;
  effects: string[];
  mechanical: {
    disadvantageOn?: string[];
    advantageAgainst?: string[];
    cantTake?: string[];
    autoFail?: string[];
    speedModifier?: number | 'zero';
    incapacitated?: boolean;
  };
}

export const CONDITIONS: Record<string, ConditionEffect> = {
  blinded: {
    name: 'Blinded',
    description: "Can't see and automatically fails any check that requires sight.",
    effects: [
      "Fails any ability check requiring sight",
      "Attack rolls have disadvantage",
      "Attacks against have advantage"
    ],
    mechanical: {
      disadvantageOn: ['attack'],
      advantageAgainst: ['attack'],
      autoFail: ['sight-checks'],
    }
  },
  charmed: {
    name: 'Charmed',
    description: "Can't attack the charmer or target them with harmful abilities.",
    effects: [
      "Can't attack the charmer",
      "Charmer has advantage on social checks"
    ],
    mechanical: {
      cantTake: ['attack-charmer'],
    }
  },
  deafened: {
    name: 'Deafened',
    description: "Can't hear and automatically fails any check that requires hearing.",
    effects: [
      "Fails any ability check requiring hearing"
    ],
    mechanical: {
      autoFail: ['hearing-checks'],
    }
  },
  frightened: {
    name: 'Frightened',
    description: "Has disadvantage while the source of fear is in line of sight.",
    effects: [
      "Disadvantage on ability checks and attacks while source visible",
      "Can't willingly move closer to source of fear"
    ],
    mechanical: {
      disadvantageOn: ['attack', 'ability-check'],
      cantTake: ['move-toward-source'],
    }
  },
  grappled: {
    name: 'Grappled',
    description: "Speed becomes 0 and can't benefit from speed bonuses.",
    effects: [
      "Speed is 0",
      "Ends if grappler is incapacitated or moved out of reach"
    ],
    mechanical: {
      speedModifier: 'zero',
    }
  },
  incapacitated: {
    name: 'Incapacitated',
    description: "Can't take actions or reactions.",
    effects: [
      "Can't take actions",
      "Can't take reactions"
    ],
    mechanical: {
      incapacitated: true,
      cantTake: ['action', 'reaction'],
    }
  },
  invisible: {
    name: 'Invisible',
    description: "Impossible to see without special senses.",
    effects: [
      "Considered heavily obscured",
      "Can be detected by noise or tracks",
      "Attack rolls have advantage",
      "Attacks against have disadvantage"
    ],
    mechanical: {
      disadvantageOn: [],
      advantageAgainst: [],
    }
  },
  paralyzed: {
    name: 'Paralyzed',
    description: "Incapacitated and can't move or speak.",
    effects: [
      "Incapacitated",
      "Can't move or speak",
      "Auto-fails STR and AGI saves",
      "Attacks against have advantage",
      "Hits within 5ft are critical"
    ],
    mechanical: {
      incapacitated: true,
      speedModifier: 'zero',
      autoFail: ['str-save', 'agi-save'],
      advantageAgainst: ['attack'],
    }
  },
  petrified: {
    name: 'Petrified',
    description: "Transformed into a solid inanimate substance.",
    effects: [
      "Transformed into solid substance",
      "Weight increases by factor of 10",
      "Doesn't age",
      "Incapacitated, can't move or speak",
      "Unaware of surroundings",
      "Attacks against have advantage",
      "Auto-fails STR and AGI saves",
      "Resistance to all damage",
      "Immune to poison and disease"
    ],
    mechanical: {
      incapacitated: true,
      speedModifier: 'zero',
      autoFail: ['str-save', 'agi-save'],
      advantageAgainst: ['attack'],
    }
  },
  poisoned: {
    name: 'Poisoned',
    description: "Has disadvantage on attack rolls and ability checks.",
    effects: [
      "Disadvantage on attack rolls",
      "Disadvantage on ability checks"
    ],
    mechanical: {
      disadvantageOn: ['attack', 'ability-check'],
    }
  },
  prone: {
    name: 'Prone',
    description: "Only movement option is to crawl. Disadvantage on attacks.",
    effects: [
      "Can only crawl (costs extra movement)",
      "Disadvantage on attack rolls",
      "Attacks from within 5ft have advantage",
      "Attacks from further have disadvantage"
    ],
    mechanical: {
      disadvantageOn: ['attack'],
    }
  },
  restrained: {
    name: 'Restrained',
    description: "Speed becomes 0 and can't benefit from speed bonuses.",
    effects: [
      "Speed is 0",
      "Attacks have disadvantage",
      "Attacks against have advantage",
      "Disadvantage on AGI saves"
    ],
    mechanical: {
      speedModifier: 'zero',
      disadvantageOn: ['attack', 'agi-save'],
      advantageAgainst: ['attack'],
    }
  },
  stunned: {
    name: 'Stunned',
    description: "Incapacitated, can't move, and speaks falteringly.",
    effects: [
      "Incapacitated",
      "Can't move",
      "Can speak only falteringly",
      "Auto-fails STR and AGI saves",
      "Attacks against have advantage"
    ],
    mechanical: {
      incapacitated: true,
      speedModifier: 'zero',
      autoFail: ['str-save', 'agi-save'],
      advantageAgainst: ['attack'],
    }
  },
  unconscious: {
    name: 'Unconscious',
    description: "Incapacitated, can't move or speak, unaware of surroundings.",
    effects: [
      "Incapacitated",
      "Can't move or speak",
      "Unaware of surroundings",
      "Drops held items, falls prone",
      "Auto-fails STR and AGI saves",
      "Attacks against have advantage",
      "Hits within 5ft are critical"
    ],
    mechanical: {
      incapacitated: true,
      speedModifier: 'zero',
      autoFail: ['str-save', 'agi-save'],
      advantageAgainst: ['attack'],
    }
  },
  exhaustion: {
    name: 'Exhaustion',
    description: "Cumulative condition with increasingly severe effects.",
    effects: [
      "Level 1: Disadvantage on ability checks",
      "Level 2: Speed halved",
      "Level 3: Disadvantage on attacks and saves",
      "Level 4: HP max halved",
      "Level 5: Speed reduced to 0",
      "Level 6: Death"
    ],
    mechanical: {},
  }
};

export function getCondition(name: string): ConditionEffect | undefined {
  return CONDITIONS[name.toLowerCase()];
}

export function getAllConditions(): ConditionEffect[] {
  return Object.values(CONDITIONS);
}

export function getActiveConditionEffects(conditions: string[]): {
  hasDisadvantage: (type: string) => boolean;
  hasAdvantageAgainst: (type: string) => boolean;
  cantTakeAction: (action: string) => boolean;
  autoFails: (check: string) => boolean;
  speedModifier: number | 'zero' | null;
  isIncapacitated: boolean;
} {
  const activeEffects = conditions.map(c => CONDITIONS[c.toLowerCase()]).filter(Boolean);

  return {
    hasDisadvantage: (type: string) => 
      activeEffects.some(e => e.mechanical.disadvantageOn?.includes(type)),
    hasAdvantageAgainst: (type: string) =>
      activeEffects.some(e => e.mechanical.advantageAgainst?.includes(type)),
    cantTakeAction: (action: string) =>
      activeEffects.some(e => e.mechanical.cantTake?.includes(action)),
    autoFails: (check: string) =>
      activeEffects.some(e => e.mechanical.autoFail?.includes(check)),
    speedModifier: activeEffects.find(e => e.mechanical.speedModifier !== undefined)?.mechanical.speedModifier ?? null,
    isIncapacitated: activeEffects.some(e => e.mechanical.incapacitated),
  };
}
