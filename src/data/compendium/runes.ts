// Comprehensive Runes Compendium
// Generated with full admin privileges
// Solo Leveling themed magical runes with images

export interface Rune {
  id: string;
  name: string;
  description: string;
  element: 'shadow' | 'fire' | 'ice' | 'lightning' | 'healing' | 'protection';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  image: string;
  effect: string;
  power: number;
  cooldown: number;
}

export const runesCompendium: Rune[] = [
  {
    id: 'shadow-rune',
    name: 'Rune of Eternal Shadow',
    description: 'A powerful rune that embodies the essence of shadow itself. Grants mastery over shadow magic and enhances stealth capabilities.',
    element: 'shadow',
    rarity: 'legendary',
    image: '/generated/runes/shadow-rune.jpg',
    effect: 'Grants +50% shadow damage and +30% stealth effectiveness',
    power: 150,
    cooldown: 60
  },
  {
    id: 'fire-rune',
    name: 'Rune of Infernal Flames',
    description: 'A blazing rune that channels the destructive power of fire. Enhances fire-based abilities and grants resistance to heat.',
    element: 'fire',
    rarity: 'epic',
    image: '/generated/runes/fire-rune.jpg',
    effect: 'Grants +40% fire damage and +25% fire resistance',
    power: 120,
    cooldown: 45
  },
  {
    id: 'ice-rune',
    name: 'Rune of Frozen Eternal',
    description: 'A chilling rune that harnesses the power of ice. Slows enemies and enhances ice-based spells.',
    element: 'ice',
    rarity: 'epic',
    image: '/generated/runes/ice-rune.jpg',
    effect: 'Grants +35% ice damage and slows enemies by 20%',
    power: 110,
    cooldown: 40
  },
  {
    id: 'lightning-rune',
    name: 'Rune of Thunder Strike',
    description: 'An electrifying rune that commands the power of lightning. Grants speed and enhances electrical attacks.',
    element: 'lightning',
    rarity: 'rare',
    image: '/generated/runes/lightning-rune.jpg',
    effect: 'Grants +30% lightning damage and +15% movement speed',
    power: 100,
    cooldown: 35
  },
  {
    id: 'healing-rune',
    name: 'Rune of Vital Restoration',
    description: 'A soothing rune that channels restorative energy. Accelerates healing and removes harmful effects.',
    element: 'healing',
    rarity: 'rare',
    image: '/generated/runes/healing-rune.jpg',
    effect: 'Grants +25% healing effectiveness and removes debuffs',
    power: 80,
    cooldown: 30
  },
  {
    id: 'protection-rune',
    name: 'Rune of Divine Protection',
    description: 'A protective rune that creates barriers against harm. Provides defensive bonuses and shields allies.',
    element: 'protection',
    rarity: 'epic',
    image: '/generated/runes/protection-rune.jpg',
    effect: 'Grants +35% damage reduction and protective barrier',
    power: 90,
    cooldown: 50
  }
];

export default runesCompendium;
