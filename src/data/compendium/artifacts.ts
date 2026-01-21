// Artifacts Compendium - Authoritative System Ascendant Content
// God-tier items and legendary artifacts
// Based on System Ascendant canon with SRD 5e mechanics

export interface Artifact {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'tool' | 'relic';
  rarity: 'legendary' | 'mythic' | 'divine';
  attunement: boolean;
  requirements?: {
    level?: number;
    class?: string;
    ability?: string;
    score?: number;
    alignment?: string;
    quest?: string;
  };
  properties: {
    magical: boolean;
    unique: boolean;
    sentient?: boolean;
    cursed?: boolean;
    legendary?: boolean;
  };
  abilities: {
    primary: {
      name: string;
      description: string;
      type: 'passive' | 'active' | 'triggered';
      frequency?: 'at-will' | 'once-per-turn' | 'once-per-day' | 'once-per-week' | 'once-per-month';
      action?: 'action' | 'bonus-action' | 'reaction' | 'free';
    };
    secondary?: {
      name: string;
      description: string;
      type: 'passive' | 'active' | 'triggered';
      frequency?: 'at-will' | 'once-per-turn' | 'once-per-day' | 'once-per-week' | 'once-per-month';
      action?: 'action' | 'bonus-action' | 'reaction' | 'free';
    };
    tertiary?: {
      name: string;
      description: string;
      type: 'passive' | 'active' | 'triggered';
      frequency?: 'at-will' | 'once-per-turn' | 'once-per-day' | 'once-per-week' | 'once-per-month';
      action?: 'action' | 'bonus-action' | 'reaction' | 'free';
    };
    ultimate?: {
      name: string;
      description: string;
      type: 'active' | 'triggered';
      frequency: 'once-per-lifetime' | 'once-per-century' | 'once-per-millennium';
      action?: 'action' | 'bonus-action' | 'reaction' | 'free';
    };
  };
  lore: {
    origin: string;
    history: string;
    curse?: string;
    personality?: string;
  };
  mechanics: {
    bonus?: {
      type: 'AC' | 'attack' | 'damage' | 'saving-throws' | 'skill-checks' | 'ability-checks' | 'speed';
      value: number;
      ability?: string;
      skills?: string[];
    };
    immunity?: string[];
    resistance?: string[];
    vulnerability?: string[];
    special?: string[];
  };
  source: string;
  image?: string;
}

export const artifacts: Artifact[] = [
  // DIVINE WEAPONS
  {
    id: 'shadow-lord-blade',
    name: 'Shadow Lord Blade',
    description: 'The legendary blade of the Umbral Monarch, capable of cutting through dimensions.',
    type: 'weapon',
    rarity: 'divine',
    attunement: true,
    requirements: {
      level: 20,
      ability: 'Dexterity',
      score: 20,
      alignment: 'Chaotic Neutral',
      quest: 'Must defeat a umbral monarch or be chosen by the shadows'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Dimensional Cut',
        description: 'Attacks ignore all armor, resistance, and immunities.',
        type: 'passive'
      },
      secondary: {
        name: 'Shadow Teleport',
        description: 'Teleport through shadows within 120 feet as a bonus action.',
        type: 'active',
        frequency: 'at-will',
        action: 'bonus-action'
      },
      tertiary: {
        name: 'Umbral Legion',
        description: 'Summon Umbral Legion to fight for you.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      ultimate: {
        name: 'Void Annihilation',
        description: 'Erase a creature from existence, preventing any form of revival.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'Forged by the first Umbral Monarch from the essence of the void.',
      history: 'This blade has passed through countless hands, each wielder becoming a legend.',
      personality: 'The blade speaks in whispers of shadows and secrets, offering power at a cost.',
      curse: 'Wielders slowly lose their connection to the material world.'
    },
    mechanics: {
      bonus: {
        type: 'attack',
        value: 5
      },
      immunity: ['necrotic', 'poison'],
      resistance: ['bludgeoning', 'piercing', 'slashing', 'radiant'],
      special: ['Can cut through dimensions', 'Cannot be destroyed by conventional means']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/shadow-lord-blade.webp'
  },
  {
    id: 'dragon-god-spear',
    name: 'Dragon God Spear',
    description: 'A spear that channels the combined power of all dragon gods.',
    type: 'weapon',
    rarity: 'divine',
    attunement: true,
    requirements: {
      level: 20,
      ability: 'Strength',
      score: 20,
      quest: 'Must prove worthiness to the dragon council'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Dragon Fury',
        description: 'Deals 6d12 damage of any dragon type.',
        type: 'passive'
      },
      secondary: {
        name: 'Dragon Form',
        description: 'Transform into a dragon god for 1 minute.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      tertiary: {
        name: 'Elemental Mastery',
        description: 'Control all elements and dragon abilities.',
        type: 'passive'
      },
      ultimate: {
        name: 'Dragon Apocalypse',
        description: 'Summon all dragon gods to destroy your enemies.',
        type: 'active',
        frequency: 'once-per-century',
        action: 'action'
      }
    },
    lore: {
      origin: 'Created by the first dragon god from the essence of all dragons.',
      history: 'This spear has been used to save and destroy worlds.',
      personality: 'The spear roars with the voices of countless dragons.',
      curse: 'Wielders slowly transform into dragons.'
    },
    mechanics: {
      bonus: {
        type: 'damage',
        value: 10
      },
      immunity: ['fire', 'cold', 'lightning', 'poison', 'acid'],
      special: ['Can communicate with dragons', 'Cannot be broken']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/dragon-god-spear.webp'
  },
  {
    id: 'time-master-staff',
    name: 'Time Master Staff',
    description: 'A staff that grants complete control over time itself.',
    type: 'weapon',
    rarity: 'mythic',
    attunement: true,
    requirements: {
      level: 20,
      ability: 'Intelligence',
      score: 20,
      quest: 'Must solve the paradox of time'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Time Manipulation',
        description: 'Can slow, stop, or rewind time in a 30-foot radius.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      secondary: {
        name: 'Precognition',
        description: 'See 10 seconds into the future.',
        type: 'passive'
      },
      tertiary: {
        name: 'Time Travel',
        description: 'Travel to any point in time.',
        type: 'active',
        frequency: 'once-per-week',
        action: 'action'
      },
      ultimate: {
        name: 'Temporal Reset',
        description: 'Reset time to any previous moment.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'Created by the first chronomancer who mastered time.',
      history: 'This staff has altered the course of history countless times.',
      personality: 'The staff speaks in riddles of past, present, and future.',
      curse: 'Wielders age rapidly when using time powers.'
    },
    mechanics: {
      bonus: {
        type: 'saving-throws',
        value: 5
      },
      immunity: ['temporal', 'aging'],
      special: ['Cannot be affected by time magic', 'Exists outside normal time flow']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/time-master-staff.webp'
  },

  // DIVINE ARMOR
  {
    id: 'void-armor',
    name: 'Void Armor',
    description: 'Armor made from the essence of the void between dimensions.',
    type: 'armor',
    rarity: 'divine',
    attunement: true,
    requirements: {
      level: 20,
      quest: 'Must survive in the void for 24 hours'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Void Form',
        description: 'Become immune to all damage while in void.',
        type: 'passive'
      },
      secondary: {
        name: 'Dimensional Shift',
        description: 'Phase between dimensions to avoid attacks.',
        type: 'active',
        frequency: 'at-will',
        action: 'reaction'
      },
      tertiary: {
        name: 'Void Walk',
        description: 'Walk through walls and objects.',
        type: 'passive'
      },
      ultimate: {
        name: 'Void Collapse',
        description: 'Create a void that consumes everything in 1-mile radius.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'Forged in the void between dimensions.',
      history: 'This armor has been worn by beings who exist outside reality.',
      personality: 'The armor whispers secrets of other dimensions.',
      curse: 'Wielders slowly fade from existence.'
    },
    mechanics: {
      bonus: {
        type: 'AC',
        value: 10
      },
      immunity: ['all damage while in void'],
      special: ['Cannot be detected by normal means', 'Exists in multiple dimensions']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/void-armor.webp'
  },
  {
    id: 'divine-crown',
    name: 'Divine Crown',
    description: 'A crown that grants god-like powers and authority.',
    type: 'accessory',
    rarity: 'divine',
    attunement: true,
    requirements: {
      level: 20,
      ability: 'Charisma',
      score: 20,
      quest: 'Must be chosen by the gods'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Divine Authority',
        description: 'Commands are obeyed by all creatures.',
        type: 'passive'
      },
      secondary: {
        name: 'God Form',
        description: 'Transform into a god for 1 hour.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      tertiary: {
        name: 'Divine Intervention',
        description: 'Call upon gods for aid.',
        type: 'active',
        frequency: 'once-per-week',
        action: 'action'
      },
      ultimate: {
        name: 'Ascension',
        description: 'Become a true god.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'Created by the first gods to rule over mortals.',
      history: 'This crown has been worn by rulers who became gods.',
      personality: 'The crown speaks with divine authority.',
      curse: 'Wielders lose their mortality.'
    },
    mechanics: {
      bonus: {
        type: 'saving-throws',
        value: 10
      },
      immunity: ['charm', 'fear', 'poison'],
      special: ['Cannot be lied to', 'Commands cannot be resisted by mortals']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/divine-crown.webp'
  },
  {
    id: 'eternal-heart',
    name: 'Eternal Heart',
    description: 'A heart that grants immortality and infinite life force.',
    type: 'accessory',
    rarity: 'divine',
    attunement: true,
    requirements: {
      level: 20,
      quest: 'Must die and be reborn'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Immortality',
        description: 'Cannot die from age or damage.',
        type: 'passive'
      },
      secondary: {
        name: 'Life Force',
        description: 'Regenerate all damage instantly.',
        type: 'passive'
      },
      tertiary: {
        name: 'Life Giver',
        description: 'Grant immortality to others.',
        type: 'active',
        frequency: 'once-per-month',
        action: 'action'
      },
      ultimate: {
        name: 'Life Creation',
        description: 'Create new life forms.',
        type: 'active',
        frequency: 'once-per-century',
        action: 'action'
      }
    },
    lore: {
      origin: 'The heart of the first immortal being.',
      history: 'This heart has granted immortality to countless beings.',
      personality: 'The heart beats with the rhythm of life itself.',
      curse: 'Wielders cannot experience true death.'
    },
    mechanics: {
      immunity: ['death', 'necrotic', 'poison'],
      special: ['Cannot be killed', 'Regenerates from nothing']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/eternal-heart.webp'
  },

  // MYTHIC TOOLS
  {
    id: 'reality-weaver',
    name: 'Reality Weaver',
    description: 'A tool that can rewrite reality itself.',
    type: 'tool',
    rarity: 'mythic',
    attunement: true,
    requirements: {
      level: 20,
      ability: 'Wisdom',
      score: 20,
      quest: 'Must understand the nature of reality'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Reality Edit',
        description: 'Change one aspect of reality.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      secondary: {
        name: 'Illusion Reality',
        description: 'Make illusions real.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      tertiary: {
        name: 'Reality Sight',
        description: 'See the true nature of reality.',
        type: 'passive'
      },
      ultimate: {
        name: 'Reality Rewrite',
        description: 'Rewrite all of reality.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'Created by the first being who understood reality.',
      history: 'This tool has been used to create and destroy worlds.',
      personality: 'The tool speaks the language of creation.',
      curse: 'Wielders lose touch with what is real.'
    },
    mechanics: {
      immunity: ['illusion', 'reality-warping'],
      special: ['Cannot be deceived', 'Can perceive all truths']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/reality-weaver.webp'
  },
  {
    id: 'soul-harvester',
    name: 'Soul Harvester',
    description: 'A scythe that can harvest and control souls.',
    type: 'weapon',
    rarity: 'mythic',
    attunement: true,
    requirements: {
      level: 20,
      ability: 'Charisma',
      score: 20,
      quest: 'Must face death itself'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      cursed: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Soul Harvest',
        description: 'Harvest souls from defeated enemies.',
        type: 'active',
        frequency: 'at-will',
        action: 'bonus-action'
      },
      secondary: {
        name: 'Soul Command',
        description: 'Command harvested souls.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      tertiary: {
        name: 'Soul Fusion',
        description: 'Fuse souls to gain their power.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      ultimate: {
        name: 'Soul Apocalypse',
        description: 'Harvest all souls in existence.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'Forged by death itself.',
      history: 'This scythe has ended countless civilizations.',
      personality: 'The scythe whispers of death and rebirth.',
      curse: 'Wielders become death itself.'
    },
    mechanics: {
      immunity: ['necrotic', 'death'],
      special: ['Cannot be killed by normal means', 'Controls the flow of souls']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/soul-harvester.webp'
  },
  {
    id: 'infinity-orb',
    name: 'Infinity Orb',
    description: 'An orb that contains infinite power.',
    type: 'accessory',
    rarity: 'mythic',
    attunement: true,
    requirements: {
      level: 20,
      quest: 'Must comprehend infinity'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Infinite Power',
        description: 'Cast any spell without limit.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      secondary: {
        name: 'Infinite Knowledge',
        description: 'Know all things.',
        type: 'passive'
      },
      tertiary: {
        name: 'Infinite Presence',
        description: 'Be everywhere at once.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      ultimate: {
        name: 'Infinite Creation',
        description: 'Create infinite anything.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'The first thing that ever existed.',
      history: 'This orb contains the power of creation itself.',
      personality: 'The orb speaks in infinite voices.',
      curse: 'Wielders lose their individuality.'
    },
    mechanics: {
      immunity: ['all damage'],
      special: ['Cannot be destroyed', 'Exists in all places at once']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/infinity-orb.webp'
  },

  // LEGENDARY RELICS
  {
    id: 'monarch-gauntlets',
    name: 'Monarch Gauntlets',
    description: 'Gauntlets that grant the power of all monarchs.',
    type: 'accessory',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 20,
      quest: 'Must defeat all monarchs'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Monarch Power',
        description: 'Use all monarch abilities.',
        type: 'passive'
      },
      secondary: {
        name: 'Monarch Army',
        description: 'Command all armies.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      tertiary: {
        name: 'Monarch Authority',
        description: 'All must obey your commands.',
        type: 'passive'
      },
      ultimate: {
        name: 'Monarch Ascension',
        description: 'Become the ultimate monarch.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'Forged from the essence of all monarchs.',
      history: 'These gauntlets have been worn by the ultimate rulers.',
      personality: 'The gauntlets speak with the authority of countless rulers.',
      curse: 'Wielders lose their personal identity.'
    },
    mechanics: {
      bonus: {
        type: 'attack',
        value: 10
      },
      immunity: ['charm', 'fear'],
      special: ['Cannot be disobeyed', 'Commands all creatures']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/monarch-gauntlets.webp'
  },
  {
    id: 'world-tree-acorn',
    name: 'World Tree Acorn',
    description: 'An acorn that can grow into a world tree.',
    type: 'consumable',
    rarity: 'legendary',
    attunement: false,
    requirements: {
      level: 20,
      quest: 'Must protect nature for 100 years'
    },
    properties: {
      magical: true,
      unique: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'World Tree',
        description: 'Plant to grow a world tree connecting all realms.',
        type: 'active',
        frequency: 'once-per-month',
        action: 'action'
      },
      secondary: {
        name: 'Nature Power',
        description: 'Control all nature.',
        type: 'passive'
      },
      tertiary: {
        name: 'Life Growth',
        description: 'Accelerate growth of all life.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      ultimate: {
        name: 'World Creation',
        description: 'Create a new world.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'The seed of the first world tree.',
      history: 'This acorn has been protected by druids for millennia.',
      personality: 'The acorn whispers of growth and life.',
      curse: 'Wielders become bound to protect the new world.'
    },
    mechanics: {
      immunity: ['poison', 'disease'],
      special: ['Cannot be destroyed', 'Grows stronger with time']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/world-tree-acorn.webp'
  },
  {
    id: 'destiny-book',
    name: 'Book of Destiny',
    description: 'A book that contains all destinies.',
    type: 'tool',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 20,
      ability: 'Wisdom',
      score: 20,
      quest: 'Must accept the burden of destiny'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Destiny Read',
        description: 'Read any creature\'s destiny.',
        type: 'active',
        frequency: 'at-will',
        action: 'action'
      },
      secondary: {
        name: 'Destiny Write',
        description: 'Change any creature\'s destiny.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      tertiary: {
        name: 'Destiny See',
        description: 'See all possible futures.',
        type: 'passive'
      },
      ultimate: {
        name: 'Destiny Control',
        description: 'Control all destinies.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'Written by the first being who understood destiny.',
      history: 'This book has shaped the course of all history.',
      personality: 'The book speaks in the language of fate.',
      curse: 'Wielders become slaves to destiny.'
    },
    mechanics: {
      immunity: ['fate', 'destiny'],
      special: ['Cannot be surprised', 'Knows all outcomes']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/destiny-book.webp'
  },
  {
    id: 'chaos-heart',
    name: 'Heart of Chaos',
    description: 'A heart that embodies pure chaos.',
    type: 'accessory',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 20,
      alignment: 'Chaotic Evil',
      quest: 'Must embrace chaos'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      cursed: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Chaos Power',
        description: 'Wield unlimited chaotic power.',
        type: 'passive'
      },
      secondary: {
        name: 'Chaos Spread',
        description: 'Spread chaos to all reality.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      tertiary: {
        name: 'Chaos Form',
        description: 'Become pure chaos.',
        type: 'active',
        frequency: 'once-per-week',
        action: 'action'
      },
      ultimate: {
        name: 'Chaos Apocalypse',
        description: 'Destroy all order in existence.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'The heart of the first chaotic being.',
      history: 'This heart has brought down countless civilizations.',
      personality: 'The heart screams in pure chaos.',
      curse: 'Wielders lose all sanity and order.'
    },
    mechanics: {
      immunity: ['order', 'law'],
      special: ['Cannot be predicted', 'Random effects always beneficial']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/chaos-heart.webp'
  },
  {
    id: 'order-crystal',
    name: 'Crystal of Order',
    description: 'A crystal that embodies perfect order.',
    type: 'accessory',
    rarity: 'legendary',
    attunement: true,
    requirements: {
      level: 20,
      alignment: 'Lawful Good',
      quest: 'Must establish perfect order'
    },
    properties: {
      magical: true,
      unique: true,
      sentient: true,
      legendary: true
    },
    abilities: {
      primary: {
        name: 'Order Power',
        description: 'Enforce perfect order.',
        type: 'passive'
      },
      secondary: {
        name: 'Order Create',
        description: 'Create perfect order from chaos.',
        type: 'active',
        frequency: 'once-per-day',
        action: 'action'
      },
      tertiary: {
        name: 'Order Form',
        description: 'Become perfect order.',
        type: 'active',
        frequency: 'once-per-week',
        action: 'action'
      },
      ultimate: {
        name: 'Order Universe',
        description: 'Bring perfect order to all existence.',
        type: 'active',
        frequency: 'once-per-lifetime',
        action: 'action'
      }
    },
    lore: {
      origin: 'The crystal of the first ordered being.',
      history: 'This crystal has established countless utopias.',
      personality: 'The crystal speaks in perfect harmony.',
      curse: 'Wielders lose all creativity and chaos.'
    },
    mechanics: {
      immunity: ['chaos', 'randomness'],
      special: ['Cannot be surprised', 'All actions are predictable and perfect']
    },
    source: 'System Ascendant Canon',
    image: '/generated/compendium/artifacts/order-crystal.webp'
  }
];

export default artifacts;





