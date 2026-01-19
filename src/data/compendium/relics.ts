// Relics Compendium - Authoritative Solo Leveling Content
// Legendary and mythic items with unique powers and lore
// Based on Solo Leveling canon with D&D 5e mechanics

export interface Relic {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'artifact';
  rarity: 'uncommon' | 'rare' | 'very_rare' | 'epic' | 'legendary' | 'mythic';
  attunement?: boolean;
  requirements?: {
    level?: number;
    alignment?: string;
    class?: string;
    ability?: string;
    score?: number;
  };
  properties: {
    magical?: boolean;
    sentient?: boolean;
    cursed?: boolean;
    unique?: boolean;
  };
  abilities: {
    name: string;
    description: string;
    type: 'passive' | 'active' | 'command' | 'consumable' | 'triggered' | 'reaction';
    frequency?: 'at-will' | 'short-rest' | 'long-rest' | 'once-per-day' | 'once-per-week' | 'once-per-turn' | 'when-critical-hit' | 'when-creature-dies';
    action?: 'action' | 'bonus-action' | 'reaction' | 'free';
    dc?: number;
    charges?: number;
  }[];
  lore: {
    origin: string;
    history: string;
    currentOwner?: string;
    previousOwners?: string[];
  };
  mechanics: {
    bonus?: {
      type: 'attack' | 'damage' | 'AC' | 'saving-throws' | 'ability-checks' | 'skill-checks';
      value: number;
      ability?: string;
      skills?: string[];
    };
    resistance?: string[];
    immunity?: string[];
    vulnerabilities?: string[];
  };
  source: string;
  image?: string;
}

export const relics: Relic[] = [
  // WEAPONS
  {
    id: 'monarchs-shadow-dagger',
    name: 'Monarch\'s Shadow Dagger',
    description: 'A dagger forged from pure shadow energy, capable of piercing dimensional barriers and striking at the very essence of beings.',
    type: 'weapon',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 15,
      ability: 'Dexterity',
      score: 17
    },
    properties: {
      magical: true,
      sentient: true,
      unique: true
    },
    abilities: [
      {
        name: 'Shadow Pierce',
        description: 'The dagger ignores all armor and resistance, dealing damage directly to the target\'s HP.',
        type: 'passive'
      },
      {
        name: 'Dimensional Strike',
        description: 'As a bonus action, teleport up to 60 feet and make a dagger attack against one creature.',
        type: 'active',
        frequency: 'short-rest',
        action: 'bonus-action'
      },
      {
        name: 'Essence Drain',
        description: 'On a critical hit, drain the target\'s life essence, gaining temporary HP equal to the damage dealt.',
        type: 'triggered',
        frequency: 'when-critical-hit'
      },
      {
        name: 'Shadow Portal',
        description: 'Once per day, create a portal between two points you can see within 120 feet.',
        type: 'command',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Forged by the first Shadow Monarch from the essence of a defeated god',
      history: 'This dagger has served as the symbol of power for countless Shadow Monarchs throughout history. It is said to contain the collective will and power of all who have wielded it.',
      previousOwners: ['First Shadow Monarch', 'Ashborn', 'Various Shadow Monarchs']
    },
    mechanics: {
      bonus: {
        type: 'attack',
        value: 3,
        ability: 'Dexterity'
      },
      resistance: ['necrotic', 'force'],
      immunity: ['poison']
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'bloodthirsty-greatsword',
    name: 'Bloodthirsty Greatsword',
    description: 'A massive greatsword that feeds on the blood of its victims, growing stronger with each kill.',
    type: 'weapon',
    rarity: 'very_rare',
    attunement: true,
    requirements: {
      level: 10,
      ability: 'Strength',
      score: 15
    },
    properties: {
      magical: true,
      cursed: true
    },
    abilities: [
      {
        name: 'Blood Frenzy',
        description: 'After reducing a creature to 0 HP, gain advantage on attack rolls and +2 damage for 1 minute.',
        type: 'triggered',
        frequency: 'when-creature-dies'
      },
      {
        name: 'Life Drain',
        description: 'Once per turn when you hit a creature, you can deal extra necrotic damage equal to your Strength modifier.',
        type: 'active',
        frequency: 'once-per-turn'
      },
      {
        name: 'Blood Healing',
        description: 'When you kill a creature, regain HP equal to half the damage you dealt.',
        type: 'triggered',
        frequency: 'when-creature-dies'
      }
    ],
    lore: {
      origin: 'Created by a demon lord from the blood of thousands of victims',
      history: 'This cursed weapon grants immense power but slowly corrupts its wielder, driving them to seek ever greater carnage.',
      previousOwners: ['Demon Lord Malgorath', 'Warlord Kael', 'Countless fallen warriors']
    },
    mechanics: {
      bonus: {
        type: 'damage',
        value: 2
      },
      vulnerabilities: ['radiant']
    },
    source: 'Solo Compendium Canon'
  },

  // ARMOR
  {
    id: 'kamishs-gauntlet',
    name: 'Kamish\'s Gauntlet',
    description: 'The legendary gauntlet of the Shadow Monarch, containing the power to command shadows and bend reality.',
    type: 'armor',
    rarity: 'mythic',
    attunement: true,
    requirements: {
      level: 20,
      class: 'Shadow Monarch'
    },
    properties: {
      magical: true,
      sentient: true,
      unique: true
    },
    abilities: [
      {
        name: 'Shadow Command',
        description: 'As an action, take control of all shadow creatures within 120 feet for 1 minute.',
        type: 'command',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Reality Bend',
        description: 'Once per week, alter reality in a 30-foot radius for 1 minute.',
        type: 'command',
        frequency: 'once-per-week',
        action: 'action'
      },
      {
        name: 'Monarch\'s Protection',
        description: 'You have resistance to all damage types and advantage on all saving throws.',
        type: 'passive'
      },
      {
        name: 'Shadow Army',
        description: 'Summon an army of 100 shadow soldiers that serve you for 24 hours.',
        type: 'command',
        frequency: 'once-per-week',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Created by the original Shadow Monarch from the essence of conquered dimensions',
      history: 'This gauntlet represents the pinnacle of shadow power, containing the authority to command all shadows and reshape reality itself.',
      currentOwner: 'Current Shadow Monarch'
    },
    mechanics: {
      resistance: ['bludgeoning', 'piercing', 'slashing', 'fire', 'cold', 'lightning', 'thunder', 'acid', 'poison', 'necrotic', 'radiant', 'force'],
      immunity: ['magical']
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'abyssal-plate',
    name: 'Abyssal Plate Armor',
    description: 'Armor forged in the deepest shadows, offering protection while enhancing shadow abilities.',
    type: 'armor',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 15,
      ability: 'Constitution',
      score: 16
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Shadow Meld',
        description: 'As a bonus action, become incorporeal for 1 minute, moving through walls and creatures.',
        type: 'active',
        frequency: 'short-rest',
        action: 'bonus-action'
      },
      {
        name: 'Darkness Aura',
        description: 'Magical darkness surrounds you in a 15-foot radius. You can see through this darkness.',
        type: 'passive'
      },
      {
        name: 'Shadow Fortification',
        description: 'When you would take damage, you can use your reaction to reduce it by half.',
        type: 'reaction',
        frequency: 'short-rest'
      }
    ],
    lore: {
      origin: 'Forged in the Abyss by shadow smiths using materials from defeated shadow lords',
      history: 'This armor has protected many powerful shadow warriors throughout the ages, each adding their own essence to its power.',
      previousOwners: ['Shadow Knight Commander', 'Dark Paladin Vorlag', 'Shadow Warlord Zara']
    },
    mechanics: {
      bonus: {
        type: 'AC',
        value: 3
      },
      resistance: ['necrotic', 'cold'],
      immunity: ['poison']
    },
    source: 'Solo Compendium Canon'
  },

  // ACCESSORIES
  {
    id: 'rulers-authority',
    name: 'Ruler\'s Authority',
    description: 'An artifact that grants the user command over lesser shadows and the respect of all beings.',
    type: 'accessory',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 12,
      ability: 'Charisma',
      score: 15
    },
    properties: {
      magical: true,
      sentient: true
    },
    abilities: [
      {
        name: 'Command Shadows',
        description: 'As an action, issue a command to all shadow creatures within 60 feet. They must obey if they fail a Wisdom save.',
        type: 'command',
        frequency: 'long-rest',
        action: 'action',
        dc: 18
      },
      {
        name: 'Royal Presence',
        description: 'All creatures except those with higher CR have disadvantage on attack rolls against you.',
        type: 'passive'
      },
      {
        name: 'Inspire Loyalty',
        description: 'Your allies within 30 feet gain +2 to saving throws and cannot be frightened.',
        type: 'passive'
      },
      {
        name: 'Decree',
        description: 'Once per week, issue a decree that affects all creatures in a 1-mile radius.',
        type: 'command',
        frequency: 'once-per-week',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Created by the first Monarch to establish authority over their growing shadow empire',
      history: 'This artifact represents the right to rule, containing the essence of leadership and command that all Monarchs must possess.',
      previousOwners: ['First Shadow Monarch', 'Queen of Shadows', 'Emperor of Night']
    },
    mechanics: {
      bonus: {
        type: 'saving-throws',
        value: 2,
        ability: 'Charisma'
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'bloodstone-amulet',
    name: 'Bloodstone Amulet',
    description: 'An amulet that enhances shadow manipulation abilities and protects against shadow corruption.',
    type: 'accessory',
    rarity: 'epic',
    attunement: true,
    requirements: {
      level: 8,
      ability: 'Wisdom',
      score: 14
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Shadow Enhancement',
        description: 'Your shadow abilities deal +1d6 extra damage and have advantage on attack rolls.',
        type: 'passive'
      },
      {
        name: 'Blood Protection',
        description: 'Immunity to shadow corruption and advantage on saves against shadow spells.',
        type: 'passive'
      },
      {
        name: 'Essence Storage',
        description: 'Can store up to 10 essence points that can be used to power shadow abilities.',
        type: 'passive'
      },
      {
        name: 'Shadow Sight',
        description: 'Can see in magical darkness and perceive invisible creatures.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by ancient shadow mages to protect against the corrupting influence of raw shadow energy',
      history: 'This amulet has saved countless shadow users from falling to shadow madness, allowing them to harness shadow power safely.',
      previousOwners: ['Shadow Archmage Theron', 'Dark Sage Marina', 'Shadow Cultist Kael']
    },
    mechanics: {
      resistance: ['necrotic'],
      immunity: ['shadow corruption']
    },
    source: 'Solo Compendium Canon'
  },

  // UTILITY ITEMS
  {
    id: 'dimensional-compass',
    name: 'Dimensional Compass',
    description: 'A compass that points toward dimensional disturbances and can guide through shadow realms.',
    type: 'accessory',
    rarity: 'very_rare',
    attunement: false,
    properties: {
      magical: true,
      unique: true
    },
    abilities: [
      {
        name: 'Dimension Sense',
        description: 'Always points toward the nearest dimensional disturbance within 100 miles.',
        type: 'passive'
      },
      {
        name: 'Shadow Navigation',
        description: 'Cannot get lost in shadow realms or dimensional spaces.',
        type: 'passive'
      },
      {
        name: 'Portal Detection',
        description: 'Vibrates when within 100 feet of a portal or dimensional rift.',
        type: 'passive'
      },
      {
        name: 'Wayfinding',
        description: 'Once per day, can show the safest path through dangerous dimensional areas.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Forged by dimensional travelers who learned to navigate the spaces between worlds',
      history: 'This compass has guided countless adventurers through dangerous dimensional journeys, its needle always pointing toward safety or adventure.',
      previousOwners: ['Dimensional Explorer Alara', 'Portal Hunter Marcus', 'Shadow Walker Lena']
    },
    mechanics: {
      immunity: ['getting lost']
    },
    source: 'Solo Compendium Canon'
  },

  // CONSUMABLES
  {
    id: 'essence-potion',
    name: 'Essence Potion',
    description: 'A potion containing concentrated life essence that can heal wounds and enhance abilities.',
    type: 'consumable',
    rarity: 'rare',
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Essence Restoration',
        description: 'Drink to restore 4d4+4 HP and gain +1 to all ability checks for 1 hour.',
        type: 'consumable',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Brewed by shadow alchemists using extracted life essence',
      history: 'These potions are highly valued by shadow users for their healing and enhancing properties.'
    },
    mechanics: {
      bonus: {
        type: 'ability-checks',
        value: 1
      }
    },
    source: 'Solo Compendium Canon'
  },

  // ADVANCED WEAPONS
  {
    id: 'shadow-bow',
    name: 'Shadow Bow',
    description: 'A bow crafted from shadow wood that fires arrows of pure darkness, capable of piercing any defense.',
    type: 'weapon',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 12,
      ability: 'Dexterity',
      score: 16
    },
    properties: {
      magical: true,
      sentient: true
    },
    abilities: [
      {
        name: 'Shadow Arrows',
        description: 'Creates arrows of shadow that ignore cover and resistance.',
        type: 'passive'
      },
      {
        name: 'Phantom Shot',
        description: 'Once per turn, can shoot through walls to hit targets behind them.',
        type: 'active',
        frequency: 'once-per-turn'
      },
      {
        name: 'Darkness Volley',
        description: 'Once per day, fire shadow arrows at all enemies in 30-foot radius.',
        type: 'command',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Crafted by shadow archers from the wood of the Shadow Realm',
      history: 'This bow has been used by legendary shadow hunters to strike down enemies from impossible angles.',
      previousOwners: ['Shadow Hunter Selene', 'Dark Archer Marcus', 'Night Stalker Elena']
    },
    mechanics: {
      bonus: {
        type: 'attack',
        value: 3,
        ability: 'Dexterity'
      },
      resistance: ['radiant']
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'flame-greatsword',
    name: 'Flame Greatsword',
    description: 'A greatsword that burns with eternal fire, dealing devastating damage to all who touch it.',
    type: 'weapon',
    rarity: 'very_rare',
    attunement: true,
    requirements: {
      level: 10,
      ability: 'Strength',
      score: 15
    },
    properties: {
      magical: true,
      cursed: true
    },
    abilities: [
      {
        name: 'Flame Burst',
        description: 'On hit, deals extra 2d6 fire damage in 10-foot radius.',
        type: 'triggered',
        frequency: 'when-critical-hit'
      },
      {
        name: 'Fire Shield',
        description: 'Wielder has resistance to fire damage and deals fire damage to melee attackers.',
        type: 'passive'
      },
      {
        name: 'Inferno Strike',
        description: 'Once per day, create explosion dealing 10d6 fire damage to all in 30 feet.',
        type: 'command',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Forged in the heart of a volcano by fire giants',
      history: 'This cursed weapon grants immense power but slowly consumes its wielder from within.',
      previousOwners: ['Fire Giant King', 'Berserker Warrior', 'Flame Champion']
    },
    mechanics: {
      bonus: {
        type: 'damage',
        value: 2
      },
      vulnerabilities: ['cold']
    },
    source: 'Solo Compendium Canon'
  },

  // ADVANCED ARMOR
  {
    id: 'shadow-robe',
    name: 'Shadow Robe',
    description: 'Robes woven from pure shadow that grant enhanced stealth and shadow abilities.',
    type: 'armor',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 13,
      ability: 'Wisdom',
      score: 15
    },
    properties: {
      magical: true,
      sentient: true
    },
    abilities: [
      {
        name: 'Shadow Form',
        description: 'Can become incorporeal for 1 minute as bonus action.',
        type: 'active',
        frequency: 'short-rest',
        action: 'bonus-action'
      },
      {
        name: 'Stealth Enhancement',
        description: 'Advantage on all Stealth checks and can hide in plain sight.',
        type: 'passive'
      },
      {
        name: 'Shadow Teleport',
        description: 'Can teleport between shadows up to 120 feet as action.',
        type: 'active',
        frequency: 'once-per-turn',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Created by the Shadow Weaver from the essence of eternal night',
      history: 'These robes have been worn by the greatest shadow mages throughout history.',
      previousOwners: ['Shadow Weaver', 'Night Mage Council', 'Shadow Archmage Theron']
    },
    mechanics: {
      resistance: ['necrotic', 'force'],
      immunity: ['poison']
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'crystal-plate',
    name: 'Crystal Plate Armor',
    description: 'Armor made from enchanted crystal that reflects magical attacks and enhances spell resistance.',
    type: 'armor',
    rarity: 'epic',
    attunement: true,
    requirements: {
      level: 11,
      ability: 'Constitution',
      score: 14
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Spell Reflection',
        description: 'Once per round, can reflect a spell back at caster.',
        type: 'reaction',
        frequency: 'once-per-turn'
      },
      {
        name: 'Crystal Shield',
        description: 'Advantage on saves against spells and magical effects.',
        type: 'passive'
      },
      {
        name: 'Resonance',
        description: 'Absorbs magical energy to power spell-like abilities.',
        type: 'triggered',
        frequency: 'when-creature-dies'
      }
    ],
    lore: {
      origin: 'Forged by crystal mages from enchanted meteor fragments',
      history: 'This armor was designed to protect against the most powerful magical threats.',
      previousOwners: ['Crystal Guardian', 'Mage Knight Commander', 'Arcane Defender']
    },
    mechanics: {
      bonus: {
        type: 'AC',
        value: 2
      },
      resistance: ['force', 'lightning', 'thunder']
    },
    source: 'Solo Compendium Canon'
  },

  // ADVANCED ACCESSORIES
  {
    id: 'shadow-ring',
    name: 'Ring of Shadows',
    description: 'A ring that grants the wearer control over shadows and enhanced stealth capabilities.',
    type: 'accessory',
    rarity: 'very_rare',
    attunement: true,
    requirements: {
      level: 8,
      ability: 'Dexterity',
      score: 13
    },
    properties: {
      magical: true,
      sentient: true
    },
    abilities: [
      {
        name: 'Shadow Invisibility',
        description: 'Can become invisible in shadows as action.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Shadow Manipulation',
        description: 'Can shape and control shadows within 30 feet.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Darkness Sight',
        description: 'Can see in magical darkness and perceive invisible creatures.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by shadow enchanters from condensed shadow essence',
      history: 'This ring has been passed down through generations of shadow users.',
      previousOwners: ['Shadow Enchanter', 'Night Thief Guild', 'Shadow Assassin Elena']
    },
    mechanics: {
      resistance: ['necrotic']
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'mana-amulet',
    name: 'Mana Amulet',
    description: 'An amulet that enhances magical power and allows for greater spellcasting efficiency.',
    type: 'accessory',
    rarity: 'epic',
    attunement: true,
    requirements: {
      level: 9,
      ability: 'Intelligence',
      score: 14
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Mana Enhancement',
        description: 'Spells cost 1 less spell slot to cast (minimum 1).',
        type: 'passive'
      },
      {
        name: 'Spell Recovery',
        description: 'Once per day, recover all expended spell slots.',
        type: 'command',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Arcane Shield',
        description: 'Resistance to force, lightning, and thunder damage.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by archmages to overcome magical limitations',
      history: 'This amulet has enabled countless mages to achieve feats beyond their normal capabilities.',
      previousOwners: ['Archmage Council', 'Master Spellcaster', 'Arcane Scholar']
    },
    mechanics: {
      resistance: ['force', 'lightning', 'thunder']
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'time-circlet',
    name: 'Circlet of Time',
    description: 'A circlet that grants limited control over time and enhances perception.',
    type: 'accessory',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 15,
      ability: 'Wisdom',
      score: 16
    },
    properties: {
      magical: true,
      sentient: true,
      unique: true
    },
    abilities: [
      {
        name: 'Time Sense',
        description: 'Can see 3 seconds into the future, granting advantage on all rolls.',
        type: 'passive'
      },
      {
        name: 'Time Stop',
        description: 'Once per week, stop time for 1 round (except you).',
        type: 'command',
        frequency: 'once-per-week',
        action: 'action'
      },
      {
        name: 'Temporal Recall',
        description: 'Once per day, rewind time by 6 seconds.',
        type: 'command',
        frequency: 'once-per-day',
        action: 'reaction'
      }
    ],
    lore: {
      origin: 'Forged by temporal mages from fragments of frozen time',
      history: 'This circlet represents the pinnacle of temporal manipulation, allowing its wearer to bend the flow of time itself.',
      previousOwners: ['Temporal Master', 'Time Guardian', 'Chronomancer Supreme']
    },
    mechanics: {
      immunity: ['time-based effects']
    },
    source: 'Solo Compendium Canon'
  },

  // ADVANCED UTILITY ITEMS
  {
    id: 'shadow-map',
    name: 'Shadow Map',
    description: 'A map that reveals hidden paths and shows the layout of shadow realms and dungeons.',
    type: 'accessory',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true,
      unique: true
    },
    abilities: [
      {
        name: 'Realm Mapping',
        description: 'Automatically maps areas as you explore them.',
        type: 'passive'
      },
      {
        name: 'Path Finding',
        description: 'Reveals the safest path through dangerous areas.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Shadow Detection',
        description: 'Reveals hidden doors and secret passages.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by shadow cartographers to navigate the endless realms',
      history: 'This map has guided countless adventurers through the most dangerous shadow territories.',
      previousOwners: ['Shadow Explorer Guild', 'Dungeon Master Association', 'Realm Walker']
    },
    mechanics: {
      immunity: ['getting lost']
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'crystal-ball',
    name: 'Crystal Ball of Scrying',
    description: 'A crystal ball that allows remote viewing and divination of distant locations.',
    type: 'accessory',
    rarity: 'very_rare',
    attunement: true,
    properties: {
      magical: true,
      sentient: true
    },
    abilities: [
      {
        name: 'Remote Viewing',
        description: 'Can view any location within 1 mile as action.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Divination',
        description: 'Once per day, can ask one question about the future.',
        type: 'command',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'True Sight',
        description: 'Can see through illusions and perceive true forms.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by seers to pierce the veils of reality',
      history: 'This crystal ball has been used by prophets and spies throughout the ages.',
      previousOwners: ['Oracle Council', 'Royal Spy Network', 'Divine Seer']
    },
    mechanics: {
      immunity: ['illusions']
    },
    source: 'Solo Compendium Canon'
  },

  // ADVANCED CONSUMABLES
  {
    id: 'shadow-elixir',
    name: 'Shadow Elixir',
    description: 'A powerful elixir that grants temporary shadow powers and enhanced abilities.',
    type: 'consumable',
    rarity: 'very_rare',
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Shadow Enhancement',
        description: 'Drink to gain shadow abilities and +2 to Dexterity for 1 hour.',
        type: 'consumable',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Brewed by shadow alchemists from pure shadow essence',
      history: 'These elixirs are highly sought after by those seeking temporary access to shadow powers.'
    },
    mechanics: {
      bonus: {
        type: 'ability-checks',
        value: 2,
        ability: 'Dexterity'
      }
    },
    source: 'Solo Compendium Canon'
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    description: 'A feather from a phoenix that can bring the dead back to life.',
    type: 'consumable',
    rarity: 'legendary',
    properties: {
      magical: true,
      unique: true
    },
    abilities: [
      {
        name: 'Resurrection',
        description: 'Can bring one creature back from death with no penalties.',
        type: 'consumable',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Plucked from a phoenix during its rebirth cycle',
      history: 'This feather contains the essence of life itself, capable of overcoming even death.'
    },
    mechanics: {
      immunity: ['death effects']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/phoenix-feather.webp'
  },
  {
    id: 'dragonscale-helmet',
    name: 'Dragonscale Helmet',
    description: 'A helmet forged from dragon scales that provides protection against fire and mental attacks.',
    type: 'armor',
    rarity: 'rare',
    attunement: true,
    requirements: {
      level: 8
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Fire Resistance',
        description: 'Complete immunity to fire damage.',
        type: 'passive'
      },
      {
        name: 'Mind Shield',
        description: 'Advantage on saving throws against being charmed or frightened.',
        type: 'passive'
      },
      {
        name: 'Dragon Sight',
        description: 'Can see through smoke and fog as if they were clear air.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Crafted from the scales of an ancient red dragon',
      history: 'This helmet was worn by a legendary dragon slayer who learned to harness the power of their fallen foe.'
    },
    mechanics: {
      resistance: ['fire'],
      bonus: {
        type: 'saving-throws',
        value: 2,
        ability: 'Wisdom'
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/dragonscale-helmet.webp'
  },
  {
    id: 'shadow-leather-boots',
    name: 'Shadow Leather Boots',
    description: 'Boots made from enchanted shadow leather that grant enhanced speed and stealth.',
    type: 'armor',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Swift Movement',
        description: 'Movement speed increased by 10 feet.',
        type: 'passive'
      },
      {
        name: 'Silent Steps',
        description: 'Advantage on Dexterity (Stealth) checks to move silently.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Crafted from the hide of a shadow beast',
      history: 'These boots are favored by assassins and scouts who need to move quickly and quietly.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Stealth']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/shadow-leather-boots.webp'
  },
  {
    id: 'crystal-of-clairvoyance',
    name: 'Crystal of Clairvoyance',
    description: 'A crystal that allows the user to see distant places and events.',
    type: 'accessory',
    rarity: 'very_rare',
    attunement: true,
    requirements: {
      level: 12
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Remote Viewing',
        description: 'Can observe a location within 1 mile as if standing there.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Scrying',
        description: 'Can observe a specific creature known to you.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'True Sight',
        description: 'Can see through illusions and into the Ethereal Plane.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a powerful seer who could see through time',
      history: 'This crystal has been used by spies and generals to gain crucial information about their enemies.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 3,
        skills: ['Perception', 'Investigation']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/crystal-of-clairvoyance.webp'
  },
  {
    id: 'giants-belt',
    name: 'Giant\'s Belt',
    description: 'A thick leather belt that grants enhanced strength and endurance.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    requirements: {
      ability: 'Strength',
      score: 13
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Giant Strength',
        description: 'Strength score increases by 2, up to a maximum of 20.',
        type: 'passive'
      },
      {
        name: 'Endless Endurance',
        description: 'Advantage on Constitution saving throws against exhaustion.',
        type: 'passive'
      },
      {
        name: 'Powerful Blows',
        description: 'Weapon damage rolls with Strength gain a +1 bonus.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Taken from a hill giant chieftain',
      history: 'This belt has passed through many strong warriors, each adding to its legendary power.'
    },
    mechanics: {
      bonus: {
        type: 'damage',
        value: 1
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/giants-belt.webp'
  },
  {
    id: 'ring-of-mind-shielding',
    name: 'Ring of Mind Shielding',
    description: 'A simple silver ring that protects against mental attacks and scrying.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Mental Protection',
        description: 'Immunity to damage from psychic attacks.',
        type: 'passive'
      },
      {
        name: 'Thought Shield',
        description: 'Cannot be detected by divination spells or effects.',
        type: 'passive'
      },
      {
        name: 'Memory Protection',
        description: 'Can choose to have memories erased from mind-reading effects.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a reclusive order of mentalists',
      history: 'These rings are highly prized by spies and those who value their privacy above all else.'
    },
    mechanics: {
      immunity: ['psychic']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/ring-of-mind-shielding.webp'
  },
  {
    id: 'amulet-of-health',
    name: 'Amulet of Health',
    description: 'A golden amulet that grants enhanced vitality and resistance to disease.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Vitality Boost',
        description: 'Constitution score increases by 2, up to a maximum of 20.',
        type: 'passive'
      },
      {
        name: 'Disease Immunity',
        description: 'Complete immunity to all diseases and poisons.',
        type: 'passive'
      },
      {
        name: 'Rapid Healing',
        description: 'Regenerate 1 hit point per hour, even when not resting.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Blessed by a deity of health and vitality',
      history: 'This amulet has saved countless lives during plagues and battles.'
    },
    mechanics: {
      bonus: {
        type: 'ability-checks',
        value: 2,
        ability: 'Constitution'
      },
      immunity: ['disease', 'poison']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/amulet-of-health.webp'
  },
  {
    id: 'boots-of-levitation',
    name: 'Boots of Levitation',
    description: 'Magical boots that allow the wearer to float and move through the air.',
    type: 'armor',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Levitate',
        description: 'Can levitate up to 20 feet above the ground.',
        type: 'active',
        frequency: 'at-will',
        action: 'bonus-action'
      },
      {
        name: 'Gentle Descent',
        description: 'Fall damage is reduced to zero.',
        type: 'passive'
      },
      {
        name: 'Air Walk',
        description: 'Can move horizontally while levitating at normal speed.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by an air elemental sorcerer',
      history: 'These boots have been used to reach otherwise inaccessible places and escape dangerous situations.'
    },
    mechanics: {
      immunity: ['falling']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/boots-of-levitation.webp'
  },
  {
    id: 'cloak-of-elvenkind',
    name: 'Cloak of Elvenkind',
    description: 'A magical cloak that enhances stealth and grants elven grace.',
    type: 'armor',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Stealth Enhancement',
        description: 'Advantage on Dexterity (Stealth) checks.',
        type: 'passive'
      },
      {
        name: 'Silent Movement',
        description: 'Cannot be heard by normal hearing when moving stealthily.',
        type: 'passive'
      },
      {
        name: 'Woodland Stride',
        description: 'Can move through difficult terrain in forests without penalty.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Woven by elven craftsmen in an ancient forest',
      history: 'This cloak has been passed down through generations of elven scouts and rangers.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Stealth']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/cloak-of-elvenkind.webp'
  },
  {
    id: 'gauntlets-of-ogre-power',
    name: 'Gauntlets of Ogre Power',
    description: 'Heavy iron gauntlets that grant immense physical strength.',
    type: 'armor',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Ogre Strength',
        description: 'Strength score becomes 19 if it was lower.',
        type: 'passive'
      },
      {
        name: 'Powerful Grip',
        description: 'Advantage on Strength (Athletics) checks to grapple or break objects.',
        type: 'passive'
      },
      {
        name: 'Crushing Blow',
        description: 'Critical hits deal an additional 1d10 damage.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Forged in the fires of a dwarven mountain',
      history: 'These gauntlets were once worn by a champion who could single-handedly defeat ogres.'
    },
    mechanics: {
      bonus: {
        type: 'damage',
        value: 2
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/gauntlets-of-ogre-power.webp'
  },
  {
    id: 'necklace-of-fireballs',
    name: 'Necklace of Fireballs',
    description: 'A necklace embedded with beads that explode as fireballs when thrown.',
    type: 'accessory',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Fireball Beads',
        description: 'Each bead can be thrown as a 3d6 fireball with 20-foot radius.',
        type: 'consumable',
        action: 'action',
        charges: 4
      },
      {
        name: 'Bead Combination',
        description: 'Can throw multiple beads together for increased damage.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Created by a pyromancer who loved explosive displays',
      history: 'This necklace has been used in many battles where area damage was crucial.'
    },
    mechanics: {
      resistance: ['fire']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/necklace-of-fireballs.webp'
  },
  {
    id: 'ring-of-invisibility',
    name: 'Ring of Invisibility',
    description: 'A simple gold ring that grants the power of invisibility.',
    type: 'accessory',
    rarity: 'legendary',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Invisibility',
        description: 'Become invisible when wearing the ring.',
        type: 'active',
        frequency: 'at-will',
        action: 'bonus-action'
      },
      {
        name: 'Silent Casting',
        description: 'Spells cast while invisible have no verbal components.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Forged by a master illusionist who perfected the art of unseen movement',
      history: 'This ring has been used by spies and assassins throughout history.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 5,
        skills: ['Stealth']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/ring-of-invisibility.webp'
  },
  {
    id: 'bracers-of-archery',
    name: 'Bracers of Archery',
    description: 'Leather bracers that enhance skill with bows and crossbows.',
    type: 'armor',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Archery Mastery',
        description: 'Gain proficiency with longbows, shortbows, and crossbows.',
        type: 'passive'
      },
      {
        name: 'Eagle Eye',
        description: 'Ranged attacks gain a +2 bonus to damage rolls.',
        type: 'passive'
      },
      {
        name: 'Swift Reload',
        description: 'Loading a ranged weapon is a free action.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Crafted by elven archers who perfected the art of ranged combat',
      history: 'These bracers have been worn by legendary hunters and marksmen.'
    },
    mechanics: {
      bonus: {
        type: 'attack',
        value: 2
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/bracers-of-archery.webp'
  },
  {
    id: 'helm-of-telepathy',
    name: 'Helm of Telepathy',
    description: 'A helmet that allows communication through thoughts and reading minds.',
    type: 'armor',
    rarity: 'very_rare',
    attunement: true,
    requirements: {
      level: 10
    },
    properties: {
      magical: true,
      sentient: true
    },
    abilities: [
      {
        name: 'Telepathic Communication',
        description: 'Can communicate telepathically with any creature within 100 feet.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Mind Reading',
        description: 'Can read the surface thoughts of creatures.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Mental Shield',
        description: 'Advantage on saving throws against psychic damage.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a powerful psion who could communicate across dimensions',
      history: 'This helm has been used by diplomats and spies to gain crucial information.'
    },
    mechanics: {
      resistance: ['psychic'],
      bonus: {
        type: 'saving-throws',
        value: 2,
        ability: 'Wisdom'
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/helm-of-telepathy.webp'
  },
  {
    id: 'cloak-of-protection',
    name: 'Cloak of Protection',
    description: 'A magical cloak that provides defensive benefits and good fortune.',
    type: 'armor',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Protective Aura',
        description: 'AC and saving throws improve by 1.',
        type: 'passive'
      },
      {
        name: 'Fortune\'s Favor',
        description: 'Once per day, reroll a failed saving throw.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'reaction'
      },
      {
        name: 'Defensive Stance',
        description: 'Advantage on death saving throws.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Blessed by a deity of protection and luck',
      history: 'This cloak has saved many warriors from certain death.'
    },
    mechanics: {
      bonus: {
        type: 'AC',
        value: 1
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/cloak-of-protection.webp'
  },
  {
    id: 'gloves-of-thievery',
    name: 'Gloves of Thievery',
    description: 'Silent gloves that enhance skills in stealth and lockpicking.',
    type: 'armor',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Silent Touch',
        description: 'Advantage on Dexterity (Sleight of Hand) checks.',
        type: 'passive'
      },
      {
        name: 'Master Lockpick',
        description: 'Advantage on checks to open locks.',
        type: 'passive'
      },
      {
        name: 'Trap Disarmament',
        description: 'Advantage on checks to disarm traps.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by the master thief of a legendary thieves\' guild',
      history: 'These gloves have been used in countless heists and infiltrations.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Sleight of Hand', 'Investigation']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/gloves-of-thievery.webp'
  },
  {
    id: 'boots-of-speed',
    name: 'Boots of Speed',
    description: 'Magical boots that grant incredible swiftness and agility.',
    type: 'armor',
    rarity: 'very_rare',
    attunement: true,
    requirements: {
      level: 10
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Lightning Speed',
        description: 'Movement speed doubled and can take the Dash action as a bonus action.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'bonus-action'
      },
      {
        name: 'Agile Movement',
        description: 'Opportunity attacks against you have disadvantage.',
        type: 'passive'
      },
      {
        name: 'Quick Reflexes',
        description: 'Advantage on Dexterity saving throws.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Enchanted by a storm giant who could move like lightning',
      history: 'These boots have been worn by messengers and scouts who value speed above all.'
    },
    mechanics: {
      bonus: {
        type: 'saving-throws',
        value: 2,
        ability: 'Dexterity'
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/boots-of-speed.webp'
  },
  {
    id: 'ring-of-shooting-stars',
    name: 'Ring of Shooting Stars',
    description: 'A ring that contains the power of falling stars and cosmic energy.',
    type: 'accessory',
    rarity: 'very_rare',
    attunement: true,
    requirements: {
      level: 12
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Shooting Star',
        description: 'Once per day, cast Fireball as a 5th-level spell.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Lightning Bolt',
        description: 'Once per day, cast Lightning Bolt as a 3rd-level spell.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Faerie Fire',
        description: 'At will, cast Faerie Fire.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Forged from a meteor that fell during a celestial alignment',
      history: 'This ring contains the raw power of the cosmos itself.'
    },
    mechanics: {
      resistance: ['fire', 'lightning']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/ring-of-shooting-stars.webp'
  },
  {
    id: 'amulet-of-the-forsaken',
    name: 'Amulet of the Forsaken',
    description: 'A dark amulet that grants power from the shadows and forgotten realms.',
    type: 'accessory',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 15,
      ability: 'Charisma',
      score: 16
    },
    properties: {
      magical: true,
      cursed: true
    },
    abilities: [
      {
        name: 'Shadow Command',
        description: 'Can command undead creatures within 60 feet.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Forsaken Power',
        description: 'Gain advantage on Charisma checks against undead and fiends.',
        type: 'passive'
      },
      {
        name: 'Dark Resilience',
        description: 'Resistance to necrotic damage and advantage on death saving throws.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created from the essence of a forgotten deity',
      history: 'This amulet grants power at a terrible cost to its wearer.'
    },
    mechanics: {
      resistance: ['necrotic'],
      bonus: {
        type: 'saving-throws',
        value: 2,
        ability: 'Charisma'
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/amulet-of-the-forsaken.webp'
  },
  {
    id: 'mantle-of-spell-resistance',
    name: 'Mantle of Spell Resistance',
    description: 'A magical mantle that provides protection against magical effects.',
    type: 'armor',
    rarity: 'very_rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Spell Resistance',
        description: 'Advantage on saving throws against spells and magical effects.',
        type: 'passive'
      },
      {
        name: 'Magic Disruption',
        description: 'Enemies within 10 feet have disadvantage on concentration checks.',
        type: 'passive'
      },
      {
        name: 'Absorb Magic',
        description: 'Once per day, completely negate a spell targeting you.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'reaction'
      }
    ],
    lore: {
      origin: 'Woven by archmages who sought protection from rival spellcasters',
      history: 'This mantle has turned the tide of many magical duels.'
    },
    mechanics: {
      bonus: {
        type: 'saving-throws',
        value: 2
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/mantle-of-spell-resistance.webp'
  },
  {
    id: 'circlet-of-wisdom',
    name: 'Circlet of Wisdom',
    description: 'A silver circlet that enhances mental clarity and divine connection.',
    type: 'accessory',
    rarity: 'very_rare',
    attunement: true,
    requirements: {
      level: 12
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Enhanced Wisdom',
        description: 'Wisdom score increases by 2, up to a maximum of 20.',
        type: 'passive'
      },
      {
        name: 'Divine Insight',
        description: 'Advantage on Wisdom (Insight) and Wisdom (Perception) checks.',
        type: 'passive'
      },
      {
        name: 'Mental Clarity',
        description: 'Resistance to psychic damage and advantage on saving throws against being charmed.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Blessed by a deity of knowledge and wisdom',
      history: 'This circlet has been worn by sages and priests who seek divine guidance.'
    },
    mechanics: {
      resistance: ['psychic'],
      bonus: {
        type: 'saving-throws',
        value: 2,
        ability: 'Wisdom'
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/circlet-of-wisdom.webp'
  },
  {
    id: 'bracers-of-defense',
    name: 'Bracers of Defense',
    description: 'Leather bracers that provide magical protection without hindering movement.',
    type: 'armor',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Magical Protection',
        description: 'AC increases by 2 while wearing no armor.',
        type: 'passive'
      },
      {
        name: 'Defensive Stance',
        description: 'Advantage on Dexterity saving throws.',
        type: 'passive'
      },
      {
        name: 'Quick Reflexes',
        description: 'Can use reaction to impose disadvantage on an attack against you.',
        type: 'active',
        frequency: 'once-per-turn',
        action: 'reaction'
      }
    ],
    lore: {
      origin: 'Created by monks who needed protection without sacrificing agility',
      history: 'These bracers have been worn by martial artists and unarmored warriors.'
    },
    mechanics: {
      bonus: {
        type: 'AC',
        value: 2
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/bracers-of-defense.webp'
  },
  {
    id: 'pendant-of-the-abyss',
    name: 'Pendant of the Abyss',
    description: 'A dark pendant that grants power over shadows and demonic forces.',
    type: 'accessory',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 15,
      ability: 'Charisma',
      score: 15
    },
    properties: {
      magical: true,
      cursed: true
    },
    abilities: [
      {
        name: 'Abyssal Command',
        description: 'Can command fiends and demons within 60 feet.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Shadow Step',
        description: 'Can teleport between shadows within 120 feet.',
        type: 'active',
        frequency: 'short-rest',
        action: 'bonus-action'
      },
      {
        name: 'Demonic Resilience',
        description: 'Resistance to fire and poison damage.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Forged in the deepest pits of the abyss',
      history: 'This pendant grants immense power but slowly corrupts its wearer.'
    },
    mechanics: {
      resistance: ['fire', 'poison']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/pendant-of-the-abyss.webp'
  },
  {
    id: 'gauntlets-of-the-sky',
    name: 'Gauntlets of the Sky',
    description: 'Lightweight gauntlets that grant control over wind and weather.',
    type: 'armor',
    rarity: 'very_rare',
    attunement: true,
    requirements: {
      level: 12
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Wind Control',
        description: 'Can create gusts of wind to push or pull creatures.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Flight',
        description: 'Can fly at a speed of 60 feet.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'bonus-action'
      },
      {
        name: 'Storm Resistance',
        description: 'Resistance to lightning and thunder damage.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by storm giants who rule the skies',
      history: 'These gauntlets have been used to control weather in battles.'
    },
    mechanics: {
      resistance: ['lightning', 'thunder']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/gauntlets-of-the-sky.webp'
  },
  {
    id: 'amulet-of-life-draining',
    name: 'Amulet of Life Draining',
    description: 'A cursed amulet that steals life force from enemies.',
    type: 'accessory',
    rarity: 'legendary',
    attunement: true,
    properties: {
      magical: true,
      cursed: true
    },
    abilities: [
      {
        name: 'Life Drain',
        description: 'When you hit a creature, they take necrotic damage and you heal the same amount.',
        type: 'triggered',
        frequency: 'when-creature-dies'
      },
      {
        name: 'Undead Command',
        description: 'Can raise and command undead servants.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Dark Vitality',
        description: 'Advantage on death saving throws and resistance to necrotic damage.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a necromancer who sought eternal life',
      history: 'This amulet drains life from all around it to sustain its wearer.'
    },
    mechanics: {
      resistance: ['necrotic']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/amulet-of-life-draining.webp'
  },
  {
    id: 'boots-of-winter-wolf',
    name: 'Boots of Winter Wolf',
    description: 'Fur-lined boots that grant power over ice and cold.',
    type: 'armor',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Cold Resistance',
        description: 'Complete immunity to cold damage.',
        type: 'passive'
      },
      {
        name: 'Ice Walk',
        description: 'Can move across ice and snow without penalty.',
        type: 'passive'
      },
      {
        name: 'Frost Breath',
        description: 'Once per day, exhale a cone of cold.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Crafted from the hide of an ancient winter wolf',
      history: 'These boots have been used by arctic explorers and ice mages.'
    },
    mechanics: {
      immunity: ['cold']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/boots-of-winter-wolf.webp'
  },
  {
    id: 'ring-of-elemental-command',
    name: 'Ring of Elemental Command',
    description: 'A ring that grants mastery over one of the four elements.',
    type: 'accessory',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 15
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Elemental Mastery',
        description: 'Can cast spells related to chosen element at will.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Elemental Resistance',
        description: 'Immunity to damage from chosen element.',
        type: 'passive'
      },
      {
        name: 'Elemental Servant',
        description: 'Can summon an elemental of chosen type.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Created by archmages who mastered the elements',
      history: 'These rings represent the pinnacle of elemental control.'
    },
    mechanics: {
      immunity: ['fire', 'cold', 'lightning', 'acid']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/ring-of-elemental-command.webp'
  },
  {
    id: 'cloak-of-the-bat',
    name: 'Cloak of the Bat',
    description: 'A dark cloak that grants the powers of a bat.',
    type: 'armor',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Bat Flight',
        description: 'Can fly at a speed of 30 feet in darkness.',
        type: 'active',
        frequency: 'at-will',
        action: 'bonus-action'
      },
      {
        name: 'Echolocation',
        description: 'Can navigate perfectly in magical darkness.',
        type: 'passive'
      },
      {
        name: 'Night Vision',
        description: 'Can see in darkness as if it were dim light.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a vampire lord who loved bats',
      history: 'This cloak has been used by creatures of the night for centuries.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 3,
        skills: ['Perception', 'Stealth']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/cloak-of-the-bat.webp'
  },
  {
    id: 'helm-of-brilliance',
    name: 'Helm of Brilliance',
    description: 'A jeweled helmet that grants radiant power and fire resistance.',
    type: 'armor',
    rarity: 'very_rare',
    attunement: true,
    requirements: {
      level: 12
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Radiant Aura',
        description: 'Enemies within 10 feet have disadvantage on attacks against you.',
        type: 'passive'
      },
      {
        name: 'Fire Resistance',
        description: 'Complete immunity to fire damage.',
        type: 'passive'
      },
      {
        name: 'Blinding Light',
        description: 'Once per day, emit a blinding flash of light.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Created by a sun deity who fought against darkness',
      history: 'This helm has been used by paladins and sun warriors.'
    },
    mechanics: {
      immunity: ['fire'],
      bonus: {
        type: 'saving-throws',
        value: 2,
        ability: 'Charisma'
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/helm-of-brilliance.webp'
  },
  {
    id: 'bracers-of-weapon-throwing',
    name: 'Bracers of Weapon Throwing',
    description: 'Bracers that enhance the ability to throw weapons with deadly accuracy.',
    type: 'armor',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Returning Weapons',
        description: 'Thrown weapons automatically return to your hand after attacking.',
        type: 'passive'
      },
      {
        name: 'Enhanced Throwing',
        description: 'Thrown weapon attacks gain a +2 bonus to damage rolls.',
        type: 'passive'
      },
      {
        name: 'Quick Draw',
        description: 'Can draw and throw weapons as part of the same action.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by master weapon throwers who perfected the art',
      history: 'These bracers have been worn by legendary warriors and hunters.'
    },
    mechanics: {
      bonus: {
        type: 'attack',
        value: 2
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/bracers-of-weapon-throwing.webp'
  },
  {
    id: 'necklace-of-adaptation',
    name: 'Necklace of Adaptation',
    description: 'A magical necklace that allows breathing in any environment.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Underwater Breathing',
        description: 'Can breathe underwater indefinitely.',
        type: 'passive'
      },
      {
        name: 'Air Filtration',
        description: 'Immune to inhaled poisons and gases.',
        type: 'passive'
      },
      {
        name: 'Pressure Adaptation',
        description: 'No penalties from extreme pressure or vacuum.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by deep-sea explorers who needed to survive the ocean depths',
      history: 'This necklace has saved many from drowning and suffocation.'
    },
    mechanics: {
      immunity: ['poison']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/necklace-of-adaptation.webp'
  },
  {
    id: 'ring-of-water-walking',
    name: 'Ring of Water Walking',
    description: 'A simple ring that allows walking on water.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Water Walking',
        description: 'Can walk on water as if it were solid ground.',
        type: 'passive'
      },
      {
        name: 'Dry Movement',
        description: 'Clothing and equipment remain dry while walking on water.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Blessed by water spirits who helped travelers cross rivers',
      history: 'This ring has been used by pilgrims and merchants for safe water crossings.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 0,
        skills: ['athletics']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/ring-of-water-walking.webp'
  },
  {
    id: 'cloak-of-the-manta-ray',
    name: 'Cloak of the Manta Ray',
    description: 'A cloak that grants swimming abilities and underwater movement.',
    type: 'armor',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Underwater Swimming',
        description: 'Swim speed of 60 feet and can breathe underwater.',
        type: 'passive'
      },
      {
        name: 'Water Adaptation',
        description: 'No penalties for underwater combat.',
        type: 'passive'
      },
      {
        name: 'Deep Vision',
        description: 'Can see clearly underwater even in darkness.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by sea druids who communed with manta rays',
      history: 'This cloak has been used by underwater explorers and naval warriors.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['athletics', 'survival']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/cloak-of-the-manta-ray.webp'
  },
  {
    id: 'boots-of-striding-and-springing',
    name: 'Boots of Striding and Springing',
    description: 'Magical boots that enhance movement and jumping ability.',
    type: 'armor',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Enhanced Movement',
        description: 'Movement speed increased by 10 feet.',
        type: 'passive'
      },
      {
        name: 'Superior Jumping',
        description: 'Jump distance tripled and standing jump height doubled.',
        type: 'passive'
      },
      {
        name: 'Graceful Landing',
        description: 'Take no damage from falls of 20 feet or less.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by acrobats who defied gravity',
      history: 'These boots have been worn by performers and escape artists.'
    },
    mechanics: {
      immunity: ['falling']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/boots-of-striding-and-springing.webp'
  },
  {
    id: 'gloves-of-swimming-and-climbing',
    name: 'Gloves of Swimming and Climbing',
    description: 'Webbed gloves that enhance swimming and climbing abilities.',
    type: 'armor',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Enhanced Swimming',
        description: 'Swim speed of 40 feet and advantage on Athletics checks to swim.',
        type: 'passive'
      },
      {
        name: 'Climbing Mastery',
        description: 'Climb speed of 20 feet and advantage on Athletics checks to climb.',
        type: 'passive'
      },
      {
        name: 'Water Grip',
        description: 'Can climb wet surfaces without penalty.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by amphibious explorers who mastered land and water',
      history: 'These gloves have been used by adventurers who face diverse terrain.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Athletics']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/gloves-of-swimming-and-climbing.webp'
  },
  {
    id: 'amulet-of-proof-against-detection',
    name: 'Amulet of Proof Against Detection',
    description: 'An amulet that protects against scrying and location magic.',
    type: 'accessory',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Scrying Immunity',
        description: 'Cannot be detected by divination spells.',
        type: 'passive'
      },
      {
        name: 'Location Protection',
        description: 'Cannot be located by magical means.',
        type: 'passive'
      },
      {
        name: 'True Name Protection',
        description: 'Spells that require your true name fail to affect you.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by spies who needed to remain hidden from magical detection',
      history: 'This amulet has been used by those who value their privacy above all.'
    },
    mechanics: {
      resistance: ['divination', 'scrying']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/amulet-of-proof-against-detection.webp'
  },
  {
    id: 'bracers-of-mountaineering',
    name: 'Bracers of Mountaineering',
    description: 'Bracers that grant climbing abilities and mountain survival.',
    type: 'armor',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Mountain Climbing',
        description: 'Climb speed of 20 feet and advantage on Athletics checks to climb.',
        type: 'passive'
      },
      {
        name: 'Altitude Adaptation',
        description: 'No penalties from high altitude or thin air.',
        type: 'passive'
      },
      {
        name: 'Ice Grip',
        description: 'Can climb ice and snow without penalty.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by mountain dwarves who scaled the highest peaks',
      history: 'These bracers have been used by climbers and mountain explorers.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Athletics', 'Survival']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/bracers-of-mountaineering.webp'
  },
  {
    id: 'ring-of-x-ray-vision',
    name: 'Ring of X-Ray Vision',
    description: 'A ring that grants the ability to see through solid objects.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'X-Ray Vision',
        description: 'Can see through up to 30 feet of solid material.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Secret Detection',
        description: 'Can see secret doors and compartments within vision range.',
        type: 'passive'
      },
      {
        name: 'Medical Insight',
        description: 'Can see inside creatures to diagnose injuries.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a healer who needed to see internal injuries',
      history: 'This ring has been used by doctors and investigators.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 3,
        skills: ['Investigation', 'Medicine']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/ring-of-x-ray-vision.webp'
  },
  {
    id: 'cloak-of-displacement',
    name: 'Cloak of Displacement',
    description: 'A cloak that creates illusionary duplicates to mislead attackers.',
    type: 'armor',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Displacement',
        description: 'Attacks against you have disadvantage unless you are incapacitated.',
        type: 'passive'
      },
      {
        name: 'Mirror Image',
        description: 'Once per day, create mirror images of yourself.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'bonus-action'
      },
      {
        name: 'Evasive Movement',
        description: 'Advantage on Dexterity saving throws against area effects.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by illusionists who perfected the art of misdirection',
      history: 'This cloak has been used by duelists and spies who avoid direct confrontation.'
    },
    mechanics: {
      bonus: {
        type: 'saving-throws',
        value: 2,
        ability: 'Dexterity'
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/cloak-of-displacement.webp'
  },
  {
    id: 'helm-of-comprehending-languages',
    name: 'Helm of Comprehending Languages',
    description: 'A helmet that grants understanding of all languages.',
    type: 'armor',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Comprehend Languages',
        description: 'Understand all spoken and written languages.',
        type: 'passive'
      },
      {
        name: 'Communication',
        description: 'Can be understood by any creature that knows a language.',
        type: 'passive'
      },
      {
        name: 'Code Breaking',
        description: 'Advantage on Intelligence checks to decipher codes.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by diplomats who needed to communicate across cultures',
      history: 'This helm has been used by ambassadors and scholars.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Investigation']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/helm-of-comprehending-languages.webp'
  },
  {
    id: 'eyes-of-the-eagle',
    name: 'Eyes of the Eagle',
    description: 'A pair of lenses that grant incredible vision and perception.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Eagle Vision',
        description: 'Advantage on Wisdom (Perception) checks that rely on sight.',
        type: 'passive'
      },
      {
        name: 'Long Sight',
        description: 'Can read text and see details up to 1 mile away.',
        type: 'passive'
      },
      {
        name: 'Low Light Vision',
        description: 'Can see in dim light as if it were bright light.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by hunters who needed to spot prey from great distances',
      history: 'These lenses have been used by scouts and marksmen for centuries.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 3,
        skills: ['Perception']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/eyes-of-the-eagle.webp'
  },
  {
    id: 'eyes-of-minute-seeing',
    name: 'Eyes of Minute Seeing',
    description: 'Lenses that grant the ability to see extremely fine details.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Fine Vision',
        description: 'Can see details as small as 1/100th of an inch.',
        type: 'passive'
      },
      {
        name: 'Trap Detection',
        description: 'Advantage on Intelligence (Investigation) checks to find traps.',
        type: 'passive'
      },
      {
        name: 'Forgery Detection',
        description: 'Advantage on checks to detect forgeries and illusions.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by jewelers who needed to examine fine craftsmanship',
      history: 'These lenses have been used by artisans and investigators.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Investigation']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/eyes-of-minute-seeing.webp'
  },
  {
    id: 'goggles-of-night',
    name: 'Goggles of Night',
    description: 'Goggles that grant the ability to see in magical darkness.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Darkvision',
        description: 'Can see in darkness as if it were dim light, even magical darkness.',
        type: 'passive'
      },
      {
        name: 'Night Adaptation',
        description: 'No penalties from darkness or low light conditions.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by night creatures who needed to hunt in total darkness',
      history: 'These goggles have been used by nocturnal adventurers and dungeon explorers.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 1,
        skills: ['perception', 'investigation']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/goggles-of-night.webp'
  },
  {
    id: 'medallion-of-thoughts',
    name: 'Medallion of Thoughts',
    description: 'A medallion that allows reading surface thoughts of creatures.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Thought Reading',
        description: 'Can read surface thoughts of creatures within 60 feet.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Mental Communication',
        description: 'Can communicate telepathically with creatures whose thoughts you can read.',
        type: 'active',
        frequency: 'at-will',
        action: 'bonus-action'
      },
      {
        name: 'Mind Shield',
        description: 'Advantage on Wisdom saving throws against mental effects.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a powerful telepath who wanted to understand others',
      history: 'This medallion has been used by diplomats and interrogators.'
    },
    mechanics: {
      resistance: ['psychic']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/medallion-of-thoughts.webp'
  },
  {
    id: 'pearl-of-power',
    name: 'Pearl of Power',
    description: 'A pearl that allows recovery of a spent spell slot.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    requirements: {
      class: 'Wizard',
      level: 10
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Spell Recovery',
        description: 'Once per day, recover one 1st through 3rd level spell slot.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Magical Resonance',
        description: 'Advantage on Intelligence (Arcana) checks.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by archmages who needed more magical endurance',
      history: 'This pearl has been used by powerful wizards throughout history.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Arcana']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/pearl-of-power.webp'
  },
  {
    id: 'robe-of-the-archmagi',
    name: 'Robe of the Archmagi',
    description: 'A powerful robe that enhances spellcasting and magical defense.',
    type: 'armor',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      class: 'Wizard',
      level: 15
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Spell Power',
        description: 'Spell save DC and spell attack rolls increase by 2.',
        type: 'passive'
      },
      {
        name: 'Magical Protection',
        description: 'Advantage on saving throws against spells and magical effects.',
        type: 'passive'
      },
      {
        name: 'Free Spell',
        description: 'Can cast one spell of 1st or 2nd level without using a spell slot.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Woven by the greatest archmage of all time',
      history: 'This robe represents the pinnacle of magical achievement.'
    },
    mechanics: {
      bonus: {
        type: 'saving-throws',
        value: 2
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/robe-of-the-archmagi.webp'
  },
  {
    id: 'cloak-of-the-manta-ray',
    name: 'Cloak of the Manta Ray',
    description: 'A cloak that grants underwater movement and breathing abilities.',
    type: 'armor',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Underwater Breathing',
        description: 'Can breathe underwater indefinitely.',
        type: 'passive'
      },
      {
        name: 'Swimming Speed',
        description: 'Swim speed of 60 feet.',
        type: 'passive'
      },
      {
        name: 'Water Adaptation',
        description: 'No penalties for underwater combat or movement.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by sea druids who communed with ocean creatures',
      history: 'This cloak has been used by underwater explorers and naval warriors.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['athletics', 'survival']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/cloak-of-the-manta-ray-2.webp'
  },
  {
    id: 'horn-of-blasting',
    name: 'Horn of Blasting',
    description: 'A horn that emits destructive sonic waves.',
    type: 'accessory',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Sonic Blast',
        description: 'Once per day, emit a cone of thunder damage.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Deafening Roar',
        description: 'Creatures in the blast must make Constitution saving throws or be deafened.',
        type: 'passive'
      },
      {
        name: 'Structural Damage',
        description: 'The blast can damage structures and objects.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by storm giants who could shatter mountains with their voice',
      history: 'This horn has been used in sieges and battles.'
    },
    mechanics: {
      resistance: ['thunder']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/horn-of-blasting.webp'
  },
  {
    id: 'instrument-of-the-bards',
    name: 'Instrument of the Bards',
    description: 'A magical instrument that enhances bardic performances.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    requirements: {
      class: 'Bard',
      level: 8
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Enhanced Performance',
        description: 'Bardic inspiration dice become d8s instead of d6s.',
        type: 'passive'
      },
      {
        name: 'Magical Songs',
        description: 'Can cast certain spells through the instrument.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Captivating Performance',
        description: 'Advantage on Charisma (Performance) checks.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by the greatest bard who ever lived',
      history: 'This instrument has inspired countless heroes and legends.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 3,
        skills: ['Performance']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/instrument-of-the-bards.webp'
  },
  {
    id: 'wand-of-magic-missiles',
    name: 'Wand of Magic Missiles',
    description: 'A wand that casts Magic Missile spells.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Magic Missile',
        description: 'Cast Magic Missile at 2nd level.',
        type: 'active',
        frequency: 'at-will',
        action: 'action',
        charges: 7
      },
      {
        name: 'Enhanced Missiles',
        description: 'The missiles deal +1 force damage each.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a wizard who loved the reliability of Magic Missile',
      history: 'This wand has been used by battle mages and duelists.'
    },
    mechanics: {
      bonus: {
        type: 'attack',
        value: 1
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/wand-of-magic-missiles.webp'
  },
  {
    id: 'staff-of-fire',
    name: 'Staff of Fire',
    description: 'A staff that grants power over fire and flame.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    requirements: {
      class: 'Wizard',
      level: 10
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Fire Spells',
        description: 'Can cast Fireball and Wall of Fire.',
        type: 'active',
        frequency: 'at-will',
        action: 'action',
        charges: 10
      },
      {
        name: 'Fire Resistance',
        description: 'Complete immunity to fire damage.',
        type: 'passive'
      },
      {
        name: 'Flame Weapon',
        description: 'Can enchant a weapon with fire damage.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'bonus-action'
      }
    ],
    lore: {
      origin: 'Created by a fire elemental who loved to share its power',
      history: 'This staff has been used by pyromancers and fire mages.'
    },
    mechanics: {
      immunity: ['fire']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/staff-of-fire.webp'
  },
  {
    id: 'staff-of-frost',
    name: 'Staff of Frost',
    description: 'A staff that grants power over ice and cold.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    requirements: {
      class: 'Wizard',
      level: 10
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Ice Spells',
        description: 'Can cast Cone of Cold and Wall of Ice.',
        type: 'active',
        frequency: 'at-will',
        action: 'action',
        charges: 10
      },
      {
        name: 'Cold Resistance',
        description: 'Complete immunity to cold damage.',
        type: 'passive'
      },
      {
        name: 'Ice Weapon',
        description: 'Can enchant a weapon with cold damage.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'bonus-action'
      }
    ],
    lore: {
      origin: 'Created by a frost giant who wanted to share winter\'s power',
      history: 'This staff has been used by ice mages and winter witches.'
    },
    mechanics: {
      immunity: ['cold']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/staff-of-frost.webp'
  },
  {
    id: 'staff-of-lightning',
    name: 'Staff of Lightning',
    description: 'A staff that grants power over lightning and storms.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    requirements: {
      class: 'Wizard',
      level: 10
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Lightning Spells',
        description: 'Can cast Lightning Bolt and Chain Lightning.',
        type: 'active',
        frequency: 'at-will',
        action: 'action',
        charges: 10
      },
      {
        name: 'Lightning Resistance',
        description: 'Complete immunity to lightning damage.',
        type: 'passive'
      },
      {
        name: 'Storm Weapon',
        description: 'Can enchant a weapon with lightning damage.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'bonus-action'
      }
    ],
    lore: {
      origin: 'Created by a storm giant who commanded the heavens',
      history: 'This staff has been used by storm mages and weather wizards.'
    },
    mechanics: {
      immunity: ['lightning']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/staff-of-lightning.webp'
  },
  {
    id: 'staff-of-power',
    name: 'Staff of Power',
    description: 'A powerful staff that enhances all spellcasting.',
    type: 'accessory',
    rarity: 'very_rare',
    attunement: true,
    requirements: {
      class: 'Wizard',
      level: 12
    },
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Enhanced Spells',
        description: 'Spell save DC and attack rolls increase by 2.',
        type: 'passive'
      },
      {
        name: 'Spell Absorption',
        description: 'Can absorb spells targeting you to regain charges.',
        type: 'active',
        frequency: 'once-per-turn',
        action: 'reaction'
      },
      {
        name: 'Power Surge',
        description: 'Once per day, cast a spell at maximum level without using a slot.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Created by the most powerful archmage in history',
      history: 'This staff represents the ultimate magical power.'
    },
    mechanics: {
      bonus: {
        type: 'saving-throws',
        value: 2
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/staff-of-power.webp'
  },
  {
    id: 'wand-of-fireballs',
    name: 'Wand of Fireballs',
    description: 'A wand that casts devastating fireball spells.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Fireball',
        description: 'Cast Fireball at 5th level.',
        type: 'active',
        frequency: 'at-will',
        action: 'action',
        charges: 7
      },
      {
        name: 'Fire Resistance',
        description: 'Resistance to fire damage.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a pyromancer who loved explosive magic',
      history: 'This wand has been used in countless battles and sieges.'
    },
    mechanics: {
      resistance: ['fire']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/wand-of-fireballs.webp'
  },
  {
    id: 'wand-of-lightning-bolts',
    name: 'Wand of Lightning Bolts',
    description: 'A wand that casts powerful lightning spells.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Lightning Bolt',
        description: 'Cast Lightning Bolt at 5th level.',
        type: 'active',
        frequency: 'at-will',
        action: 'action',
        charges: 7
      },
      {
        name: 'Lightning Resistance',
        description: 'Resistance to lightning damage.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a storm mage who harnessed the power of thunder',
      history: 'This wand has been used by battle mages and storm callers.'
    },
    mechanics: {
      resistance: ['lightning']
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/wand-of-lightning-bolts.webp'
  },
  {
    id: 'wand-of-secrets',
    name: 'Wand of Secrets',
    description: 'A wand that reveals hidden things and secrets.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Detect Magic',
        description: 'Cast Detect Magic at will.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Detect Secret Doors',
        description: 'Cast Detect Secret Doors at will.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'True Seeing',
        description: 'Once per day, cast True Seeing.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Created by a master spy who could find any secret',
      history: 'This wand has been used by investigators and treasure hunters.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Investigation']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/wand-of-secrets.webp'
  },
  {
    id: 'wand-of-paralysis',
    name: 'Wand of Paralysis',
    description: 'A wand that can paralyze creatures.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Paralysis',
        description: 'Target must make Constitution saving throw or be paralyzed.',
        type: 'active',
        frequency: 'at-will',
        action: 'action',
        charges: 7
      },
      {
        name: 'Paralyzing Touch',
        description: 'Melee attacks with the wand can paralyze on hit.',
        type: 'triggered',
        frequency: 'when-critical-hit'
      }
    ],
    lore: {
      origin: 'Created by a mesmer who loved to control others',
      history: 'This wand has been used by controllers and enforcers.'
    },
    mechanics: {
      bonus: {
        type: 'saving-throws',
        value: 1
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/wand-of-paralysis.webp'
  },
  {
    id: 'wand-of-the-war-mage',
    name: 'Wand of the War Mage',
    description: 'A wand that enhances combat spellcasting.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Combat Caster',
        description: 'Advantage on Constitution saving throws to maintain concentration.',
        type: 'passive'
      },
      {
        name: 'Defensive Ward',
        description: 'AC increases by 2 while holding the wand.',
        type: 'passive'
      },
      {
        name: 'Spell Accuracy',
        description: 'Spell attack rolls gain a +2 bonus.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a battle mage who fought in countless wars',
      history: 'This wand has been used by combat mages and duelists.'
    },
    mechanics: {
      bonus: {
        type: 'AC',
        value: 2
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/wand-of-the-war-mage.webp'
  },
  {
    id: 'chime-of-opening',
    name: 'Chime of Opening',
    description: 'A chime that can open locked doors and containers.',
    type: 'accessory',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Open Locks',
        description: 'Can open any locked door or container.',
        type: 'active',
        frequency: 'at-will',
        action: 'action',
        charges: 10
      },
      {
        name: 'Break Seals',
        description: 'Can break magical seals and wards.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Dispel Barriers',
        description: 'Can dispel magical barriers and force fields.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Created by a master thief who could open any lock',
      history: 'This chime has been used by adventurers and treasure hunters.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 3,
        skills: ['Investigation']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/chime-of-opening.webp'
  },
  {
    id: 'decanter-of-endless-water',
    name: 'Decanter of Endless Water',
    description: 'A decanter that produces unlimited water.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Water Production',
        description: 'Can produce unlimited water in three different flow rates.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Water Jet',
        description: 'Can create a powerful jet of water for combat or utility.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Purification',
        description: 'All water produced is pure and drinkable.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by water elementals who wanted to share their life-giving element',
      history: 'This decanter has saved countless lives in deserts and droughts.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 1,
        skills: ['survival']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/decanter-of-endless-water.webp'
  },
  {
    id: 'immovable-rod',
    name: 'Immovable Rod',
    description: 'A metal rod that can become fixed in space.',
    type: 'accessory',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Immovable',
        description: 'Can become fixed in space, supporting up to 8,000 pounds.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Anchor Point',
        description: 'Can be used as an anchor for climbing or blocking passages.',
        type: 'passive'
      },
      {
        name: 'Force Field',
        description: 'Creates a barrier that cannot be moved by physical force.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a master artificer who wanted to defy gravity',
      history: 'This rod has been used in countless construction and escape projects.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['athletics']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/immovable-rod.webp'
  },
  {
    id: 'lantern-of-revealing',
    name: 'Lantern of Revealing',
    description: 'A lantern that reveals invisible creatures and illusions.',
    type: 'accessory',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Revealing Light',
        description: 'Reveals invisible creatures and objects within 30 feet.',
        type: 'passive'
      },
      {
        name: 'Illusion Detection',
        description: 'Can see through illusions and magical disguises.',
        type: 'passive'
      },
      {
        name: 'True Sight',
        description: 'Once per day, grant True Sight for 1 minute.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      }
    ],
    lore: {
      origin: 'Created by a paladin who hunted invisible monsters',
      history: 'This lantern has been used by monster hunters and investigators.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Perception', 'Investigation']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/lantern-of-revealing.webp'
  },
  {
    id: 'lyre-of-building',
    name: 'Lyre of Building',
    description: 'A magical lyre that enhances construction and building.',
    type: 'accessory',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Construction Aid',
        description: 'Construction projects progress at twice the normal rate.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Structural Integrity',
        description: 'Buildings constructed with the lyre are more durable.',
        type: 'passive'
      },
      {
        name: 'Architectural Vision',
        description: 'Advantage on Intelligence checks related to construction.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by master builders who wanted to construct wonders',
      history: 'This lyre has been used to build many famous structures.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 3,
        skills: ['Carpenters Tools', 'Masons Tools']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/lyre-of-building.webp'
  },
  {
    id: 'manual-of-bodily-health',
    name: 'Manual of Bodily Health',
    description: 'A book that permanently increases Constitution when read.',
    type: 'consumable',
    rarity: 'very_rare',
    attunement: false,
    properties: {
      magical: true,
      unique: true
    },
    abilities: [
      {
        name: 'Constitution Increase',
        description: 'Reading the book permanently increases Constitution score by 2.',
        type: 'consumable',
        action: 'action'
      },
      {
        name: 'Health Knowledge',
        description: 'Gain advantage on Medicine checks while studying the book.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Written by a master physician who understood the body perfectly',
      history: 'This manual has been used by warriors and athletes who seek peak physical condition.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Medicine']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/manual-of-bodily-health.webp'
  },
  {
    id: 'manual-of-gainful-exercise',
    name: 'Manual of Gainful Exercise',
    description: 'A book that permanently increases Strength when read.',
    type: 'consumable',
    rarity: 'very_rare',
    attunement: false,
    properties: {
      magical: true,
      unique: true
    },
    abilities: [
      {
        name: 'Strength Increase',
        description: 'Reading the book permanently increases Strength score by 2.',
        type: 'consumable',
        action: 'action'
      },
      {
        name: 'Exercise Knowledge',
        description: 'Gain advantage on Athletics checks while studying the book.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Written by a champion who achieved perfect physical strength',
      history: 'This manual has been used by warriors who seek unmatched power.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Athletics']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/manual-of-gainful-exercise.webp'
  },
  {
    id: 'manual-of-quickness-of-action',
    name: 'Manual of Quickness of Action',
    description: 'A book that permanently increases Dexterity when read.',
    type: 'consumable',
    rarity: 'very_rare',
    attunement: false,
    properties: {
      magical: true,
      unique: true
    },
    abilities: [
      {
        name: 'Dexterity Increase',
        description: 'Reading the book permanently increases Dexterity score by 2.',
        type: 'consumable',
        action: 'action'
      },
      {
        name: 'Agility Knowledge',
        description: 'Gain advantage on Acrobatics checks while studying the book.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Written by a master acrobat who achieved perfect agility',
      history: 'This manual has been used by rogues and dancers who seek perfect grace.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Acrobatics']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/manual-of-quickness-of-action.webp'
  },
  {
    id: 'tome-of-clear-thought',
    name: 'Tome of Clear Thought',
    description: 'A book that permanently increases Intelligence when read.',
    type: 'consumable',
    rarity: 'very_rare',
    attunement: false,
    properties: {
      magical: true,
      unique: true
    },
    abilities: [
      {
        name: 'Intelligence Increase',
        description: 'Reading the book permanently increases Intelligence score by 2.',
        type: 'consumable',
        action: 'action'
      },
      {
        name: 'Knowledge Enhancement',
        description: 'Gain advantage on Arcana checks while studying the book.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Written by a sage who achieved perfect mental clarity',
      history: 'This tome has been used by wizards and scholars who seek ultimate knowledge.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Arcana']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/tome-of-clear-thought.webp'
  },
  {
    id: 'tome-of-leadership-and-influence',
    name: 'Tome of Leadership and Influence',
    description: 'A book that permanently increases Charisma when read.',
    type: 'consumable',
    rarity: 'very_rare',
    attunement: false,
    properties: {
      magical: true,
      unique: true
    },
    abilities: [
      {
        name: 'Charisma Increase',
        description: 'Reading the book permanently increases Charisma score by 2.',
        type: 'consumable',
        action: 'action'
      },
      {
        name: 'Leadership Enhancement',
        description: 'Gain advantage on Persuasion checks while studying the book.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Written by a legendary leader who inspired millions',
      history: 'This tome has been used by kings and diplomats who seek to influence others.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Persuasion']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/tome-of-leadership-and-influence.webp'
  },
  {
    id: 'tome-of-understanding',
    name: 'Tome of Understanding',
    description: 'A book that permanently increases Wisdom when read.',
    type: 'consumable',
    rarity: 'very_rare',
    attunement: false,
    properties: {
      magical: true,
      unique: true
    },
    abilities: [
      {
        name: 'Wisdom Increase',
        description: 'Reading the book permanently increases Wisdom score by 2.',
        type: 'consumable',
        action: 'action'
      },
      {
        name: 'Insight Enhancement',
        description: 'Gain advantage on Insight checks while studying the book.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Written by a wise sage who understood the universe',
      history: 'This tome has been used by priests and seers who seek divine wisdom.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['Insight']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/tome-of-understanding.webp'
  },
  {
    id: 'iron-bands-of-bilarro',
    name: 'Iron Bands of Bilarro',
    description: 'Magical bands that can restrain creatures.',
    type: 'accessory',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Binding',
        description: 'Can restrain a Large or smaller creature.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      {
        name: 'Magical Restraint',
        description: 'Bound creatures cannot use teleportation or ethereal travel.',
        type: 'passive'
      },
      {
        name: 'Break DC',
        description: 'DC 25 Strength (Athletics) check to break free.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a giant who wanted to capture powerful foes',
      history: 'These bands have been used to capture dragons and other mighty creatures.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 3,
        skills: ['athletics']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/iron-bands-of-bilarro.webp'
  },
  {
    id: 'portable-hole',
    name: 'Portable Hole',
    description: 'A black cloth that creates an extradimensional space.',
    type: 'accessory',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Extradimensional Space',
        description: 'Creates a 10-foot deep extradimensional hole.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Storage',
        description: 'Can hold up to 500 cubic feet of items.',
        type: 'passive'
      },
      {
        name: 'Breathable Space',
        description: 'The hole contains breathable air.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a master artificer who perfected dimensional magic',
      history: 'This portable hole has been used by adventurers for centuries.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 1,
        skills: ['investigation']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/portable-hole.webp'
  },
  {
    id: 'quiver-of-ehlonna',
    name: 'Quiver of Ehlonna',
    description: 'A quiver that can hold many items in extradimensional space.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Extradimensional Storage',
        description: 'Can hold up to 60 arrows, 30 javelins, or 18 bows.',
        type: 'passive'
      },
      {
        name: 'Quick Draw',
        description: 'Can draw items as a free action.',
        type: 'passive'
      },
      {
        name: 'Weight Reduction',
        description: 'Items in the quiver weigh nothing.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Blessed by a goddess of the hunt and nature',
      history: 'This quiver has been used by hunters and rangers for generations.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 1,
        skills: ['athletics']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/quiver-of-ehlonna.webp'
  },
  {
    id: 'robe-of-useful-items',
    name: 'Robe of Useful Items',
    description: 'A robe with patches that become various useful items.',
    type: 'armor',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Magical Patches',
        description: 'Contains patches that become various items when pulled.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      {
        name: 'Item Variety',
        description: 'Patches can become daggers, ropes, bags, lanterns, and more.',
        type: 'passive'
      },
      {
        name: 'Patch Regeneration',
        description: 'Patches regenerate at dawn.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a clever artificer who hated being unprepared',
      history: 'This robe has saved many adventurers from dangerous situations.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 1,
        skills: ['investigation', 'sleight-of-hand']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/robe-of-useful-items.webp'
  },
  {
    id: 'bag-of-holding',
    name: 'Bag of Holding',
    description: 'A bag that contains extradimensional space.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Extradimensional Space',
        description: 'Can hold up to 500 pounds of items in 64 cubic feet.',
        type: 'passive'
      },
      {
        name: 'Weight Reduction',
        description: 'Items in the bag weigh only 15 pounds total.',
        type: 'passive'
      },
      {
        name: 'Quick Access',
        description: 'Can retrieve items as a move action.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a master artificer who perfected storage magic',
      history: 'This bag has been used by adventurers and merchants for centuries.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 1,
        skills: ['investigation']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/bag-of-holding.webp'
  },
  {
    id: 'handy-haversack',
    name: 'Handy Haversack',
    description: 'A backpack with extradimensional compartments.',
    type: 'accessory',
    rarity: 'rare',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Multiple Compartments',
        description: 'Three compartments with different storage capacities.',
        type: 'passive'
      },
      {
        name: 'Quick Retrieval',
        description: 'Can retrieve items as a free action.',
        type: 'passive'
      },
      {
        name: 'Weight Reduction',
        description: 'Items in the haversack weigh only 5 pounds total.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by an organized adventurer who hated digging through packs',
      history: 'This haversack has been used by efficient adventurers everywhere.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 2,
        skills: ['investigation']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/handy-haversack.webp'
  },
  {
    id: 'efficient-quiver',
    name: 'Efficient Quiver',
    description: 'A quiver that can hold ammunition and weapons.',
    type: 'accessory',
    rarity: 'uncommon',
    attunement: false,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Amphibious Storage',
        description: 'Can hold up to 60 arrows, 30 javelins, or 18 bows.',
        type: 'passive'
      },
      {
        name: 'Quick Draw',
        description: 'Can draw items as a free action.',
        type: 'passive'
      },
      {
        name: 'Waterproof',
        description: 'Items remain dry even underwater.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by an elven archer who needed quick access to ammunition',
      history: 'This quiver has been used by archers and hunters for generations.'
    },
    mechanics: {
      bonus: {
        type: 'skill-checks',
        value: 1,
        skills: ['athletics']
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/efficient-quiver.webp'
  },
  {
    id: 'girdle-of-giant-strength',
    name: 'Girdle of Giant Strength',
    description: 'A belt that grants giant strength.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Giant Strength',
        description: 'Strength score becomes 19 if it was lower.',
        type: 'passive'
      },
      {
        name: 'Powerful Blows',
        description: 'Weapon damage rolls gain a +2 bonus.',
        type: 'passive'
      },
      {
        name: 'Athletic Prowess',
        description: 'Advantage on Strength (Athletics) checks.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Taken from a fire giant chief',
      history: 'This belt has been worn by warriors who seek unmatched strength.'
    },
    mechanics: {
      bonus: {
        type: 'damage',
        value: 2
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/girdle-of-giant-strength.webp'
  },
  {
    id: 'bracers-of-dexterity',
    name: 'Bracers of Dexterity',
    description: 'Bracers that enhance agility and reflexes.',
    type: 'armor',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Enhanced Dexterity',
        description: 'Dexterity score increases by 2, up to a maximum of 20.',
        type: 'passive'
      },
      {
        name: 'Quick Reflexes',
        description: 'Advantage on Dexterity saving throws.',
        type: 'passive'
      },
      {
        name: 'Agile Movement',
        description: 'Movement speed increases by 10 feet.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by master acrobats who achieved perfect agility',
      history: 'These bracers have been worn by rogues and dancers.'
    },
    mechanics: {
      bonus: {
        type: 'saving-throws',
        value: 2,
        ability: 'Dexterity'
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/bracers-of-dexterity.webp'
  },
  {
    id: 'headband-of-intellect',
    name: 'Headband of Intellect',
    description: 'A headband that enhances mental capacity.',
    type: 'accessory',
    rarity: 'rare',
    attunement: true,
    properties: {
      magical: true
    },
    abilities: [
      {
        name: 'Enhanced Intelligence',
        description: 'Intelligence score increases by 2, up to a maximum of 20.',
        type: 'passive'
      },
      {
        name: 'Mental Clarity',
        description: 'Advantage on Intelligence saving throws.',
        type: 'passive'
      },
      {
        name: 'Quick Thinking',
        description: 'Can take an additional reaction per turn.',
        type: 'passive'
      }
    ],
    lore: {
      origin: 'Created by a sage who achieved perfect mental clarity',
      history: 'This headband has been worn by wizards and scholars.'
    },
    mechanics: {
      bonus: {
        type: 'saving-throws',
        value: 2,
        ability: 'Intelligence'
      }
    },
    source: 'Solo Compendium Canon',
    image: '/generated/compendium/relics/headband-of-intellect.webp'
  }
];

