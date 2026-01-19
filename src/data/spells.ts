// Comprehensive Spells Compendium
// Generated with full admin privileges
// Solo Leveling themed spells with images

export interface Spell {
  id: string;
  name: string;
  description: string;
  element: 'shadow' | 'fire' | 'ice' | 'lightning' | 'healing' | 'protection';
  image: string;
  manaCost: number;
  damage?: number;
  healing?: number;
  effect: string;
  range: number;
  cooldown: number;
}

export const spellsCompendium: Spell[] = [
  {
    id: 'shadow-bolt',
    name: 'Shadow Bolt',
    description: 'Launches a bolt of pure shadow energy that deals massive damage and may silence the target.',
    element: 'shadow',
    image: '/generated/spells/shadow-bolt.webp',
    manaCost: 50,
    damage: 120,
    effect: 'Deals shadow damage and may silence target for 3 seconds',
    range: 30,
    cooldown: 5
  },
  {
    id: 'fireball',
    name: 'Infernal Fireball',
    description: 'Hurls a massive ball of fire that explodes on impact, dealing area damage to all enemies nearby.',
    element: 'fire',
    image: '/generated/spells/fireball.webp',
    manaCost: 60,
    damage: 150,
    effect: 'Deals fire damage in 5-meter radius and burns targets',
    range: 25,
    cooldown: 8
  },
  {
    id: 'ice-shard',
    name: 'Piercing Ice Shard',
    description: 'Launches a sharp shard of ice that penetrates armor and may freeze the target solid.',
    element: 'ice',
    image: '/generated/spells/ice-shard.webp',
    manaCost: 40,
    damage: 90,
    effect: 'Deals ice damage and may freeze target for 2 seconds',
    range: 35,
    cooldown: 4
  },
  {
    id: 'lightning-strike',
    name: 'Thunder Strike',
    description: 'Calls down a powerful lightning strike that deals massive damage and may stun enemies.',
    element: 'lightning',
    image: '/generated/spells/lightning-strike.webp',
    manaCost: 70,
    damage: 180,
    effect: 'Deals lightning damage and may stun target for 3 seconds',
    range: 40,
    cooldown: 10
  },
  {
    id: 'healing-light',
    name: 'Restorative Light',
    description: 'Channels healing energy that restores health and removes harmful effects from the target.',
    element: 'healing',
    image: '/generated/spells/healing-light.webp',
    manaCost: 45,
    healing: 200,
    effect: 'Restores health and removes all debuffs from target',
    range: 20,
    cooldown: 6
  },
  {
    id: 'protection-barrier',
    name: 'Shield of Protection',
    description: 'Creates a magical barrier that absorbs damage and protects the target from harm.',
    element: 'protection',
    image: '/generated/spells/protection-barrier.webp',
    manaCost: 55,
    effect: 'Creates barrier that absorbs 300 damage for 10 seconds',
    range: 15,
    cooldown: 12
  }
];

export default spellsCompendium;
