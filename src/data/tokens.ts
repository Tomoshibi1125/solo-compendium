// Comprehensive Tokens Compendium
// System Ascendant themed character tokens with images

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
    name: 'Umbral Ascendant',
    description: 'Elite warrior trained in umbral arts. Master of stealth and precision strikes.',
    type: 'player',
    image: '/generated/tokens/player-token.webp',
    stats: { health: 150, attack: 80, defense: 60, speed: 75 },
    abilities: ['Umbral Strike', 'Stealth', 'Critical Hit'],
    friendly: true
  },
  {
    id: 'monster-token',
    name: 'Veil Demon',
    description: 'Malevolent creature born from raw veil energy. Highly aggressive and dangerous.',
    type: 'monster',
    image: '/generated/tokens/monster-token.webp',
    stats: { health: 100, attack: 60, defense: 40, speed: 50 },
    abilities: ['Umbral Claw', 'Dark Vision', 'Fear'],
    friendly: false
  },
  {
    id: 'boss-token',
    name: 'Umbral Lord',
    description: 'Powerful regent of the umbral realm. Commands legions of veilbound creatures and possesses immense power.',
    type: 'boss',
    image: '/generated/tokens/boss-token.webp',
    stats: { health: 500, attack: 120, defense: 100, speed: 60 },
    abilities: ['Umbral Dominion', 'Army of Darkness', 'Veil Apex'],
    friendly: false
  },
  {
    id: 'npc-token',
    name: 'Veiled Stranger',
    description: 'Enigmatic figure with unknown motives. May offer quests or valuable information.',
    type: 'npc',
    image: '/generated/tokens/npc-token.webp',
    stats: { health: 80, attack: 40, defense: 50, speed: 55 },
    abilities: ['Information Gathering', 'Quest Giver'],
    friendly: true
  },
  {
    id: 'merchant-token',
    name: 'Veil Market Broker',
    description: 'Trader specializing in rare items and artifacts from the umbral realm.',
    type: 'merchant',
    image: '/generated/tokens/merchant-token.webp',
    stats: { health: 60, attack: 20, defense: 30, speed: 40 },
    abilities: ['Trade', 'Item Identification', 'Bargaining'],
    friendly: true
  },
  {
    id: 'guard-token',
    name: 'Veilguard',
    description: 'Elite soldier protecting important locations and personages. Well-trained and loyal.',
    type: 'guard',
    image: '/generated/tokens/guard-token.webp',
    stats: { health: 120, attack: 70, defense: 80, speed: 45 },
    abilities: ['Patrol', 'Arrest', 'Defend'],
    friendly: true
  }
];

export default tokensCompendium;

