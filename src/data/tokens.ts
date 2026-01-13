// Comprehensive Tokens Compendium
// Generated with full admin privileges
// Solo Leveling themed character tokens with images

export interface Token {
  id: string;
  name: string;
  description: string;
  type: 'player' | 'monster' | 'boss' | 'npc' | 'merchant' | 'guard';
  image: string;
  stats?: {
    health?: number;
    attack?: number;
    defense?: number;
    speed?: number;
  };
  abilities?: string[];
  friendly: boolean;
}

export const tokensCompendium: Token[] = [
  {
    id: 'player-token',
    name: 'Shadow Hunter',
    description: 'Elite warrior trained in shadow arts. Master of stealth and assassination techniques.',
    type: 'player',
    image: '/generated/tokens/player-token.jpg',
    stats: { health: 150, attack: 80, defense: 60, speed: 75 },
    abilities: ['Shadow Strike', 'Stealth', 'Critical Hit'],
    friendly: true
  },
  {
    id: 'monster-token',
    name: 'Shadow Demon',
    description: 'Malevolent creature born from pure shadow energy. Highly aggressive and dangerous.',
    type: 'monster',
    image: '/generated/tokens/monster-token.jpg',
    stats: { health: 100, attack: 60, defense: 40, speed: 50 },
    abilities: ['Shadow Claw', 'Dark Vision', 'Fear'],
    friendly: false
  },
  {
    id: 'boss-token',
    name: 'Shadow Lord',
    description: 'Powerful ruler of the shadow realm. Commands armies of shadow creatures and possesses immense power.',
    type: 'boss',
    image: '/generated/tokens/boss-token.jpg',
    stats: { health: 500, attack: 120, defense: 100, speed: 60 },
    abilities: ['Shadow Dominion', 'Army of Darkness', 'Ultimate Shadow'],
    friendly: false
  },
  {
    id: 'npc-token',
    name: 'Mysterious Stranger',
    description: 'Enigmatic figure with unknown motives. May offer quests or valuable information.',
    type: 'npc',
    image: '/generated/tokens/npc-token.jpg',
    stats: { health: 80, attack: 40, defense: 50, speed: 55 },
    abilities: ['Information Gathering', 'Quest Giver'],
    friendly: true
  },
  {
    id: 'merchant-token',
    name: 'Shadow Realm Merchant',
    description: 'Trader specializing in rare items and artifacts from the shadow realm.',
    type: 'merchant',
    image: '/generated/tokens/merchant-token.jpg',
    stats: { health: 60, attack: 20, defense: 30, speed: 40 },
    abilities: ['Trade', 'Item Identification', 'Bargaining'],
    friendly: true
  },
  {
    id: 'guard-token',
    name: 'Shadow Guard',
    description: 'Elite soldier protecting important locations and personages. Well-trained and loyal.',
    type: 'guard',
    image: '/generated/tokens/guard-token.jpg',
    stats: { health: 120, attack: 70, defense: 80, speed: 45 },
    abilities: ['Patrol', 'Arrest', 'Defend'],
    friendly: true
  }
];

export default tokensCompendium;
