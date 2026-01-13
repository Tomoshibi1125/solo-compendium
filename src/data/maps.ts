// Comprehensive Maps Compendium
// Generated with full admin privileges
// Solo Leveling themed map tiles and environments with images

export interface MapTile {
  id: string;
  name: string;
  description: string;
  type: 'floor' | 'wall' | 'door' | 'gate' | 'object' | 'special';
  image: string;
  walkable: boolean;
  transparent: boolean;
  effect?: string;
}

export const mapsCompendium: MapTile[] = [
  {
    id: 'dungeon-floor',
    name: 'Shadow Dungeon Floor',
    description: 'Dark stone floor infused with shadow energy patterns. Provides a solid foundation for dungeon construction.',
    type: 'floor',
    image: '/generated/maps/dungeon-floor.jpg',
    walkable: true,
    transparent: false,
    effect: 'Grants +5% shadow resistance when standing on'
  },
  {
    id: 'stone-wall',
    name: 'Shadow Stone Wall',
    description: 'Impenetrable stone walls that block movement and sight. Reinforced with shadow magic for extra durability.',
    type: 'wall',
    image: '/generated/maps/stone-wall.jpg',
    walkable: false,
    transparent: false
  },
  {
    id: 'wooden-door',
    name: 'Ancient Wooden Door',
    description: 'Sturdy wooden door with metal fittings. Can be opened with proper keys or sufficient force.',
    type: 'door',
    image: '/generated/maps/wooden-door.jpg',
    walkable: false,
    transparent: false,
    effect: 'Requires key or strength check to open'
  },
  {
    id: 'iron-gate',
    name: 'Shadow Iron Gate',
    description: 'Massive iron gate infused with shadow energy. Provides security and serves as a dramatic entrance.',
    type: 'gate',
    image: '/generated/maps/iron-gate.jpg',
    walkable: false,
    transparent: false,
    effect: 'Requires special key or magical means to open'
  },
  {
    id: 'treasure-chest',
    name: 'Shadow Treasure Chest',
    description: 'Mysterious chest containing valuable items. Protected by shadow magic and may be trapped.',
    type: 'object',
    image: '/generated/maps/treasure-chest.jpg',
    walkable: false,
    transparent: false,
    effect: 'Contains random valuable items, may be trapped'
  },
  {
    id: 'throne-room',
    name: 'Shadow Lord\'s Throne',
    description: 'Imposing throne where the Shadow Lord holds court. Radiates immense power and authority.',
    type: 'special',
    image: '/generated/maps/throne-room.jpg',
    walkable: false,
    transparent: true,
    effect: 'Grants +20% intimidation when nearby'
  }
];

export default mapsCompendium;
