// Comprehensive Asset Index
// Generated with full admin privileges
// Complete index of all assets in the project

export interface AssetReference {
  id: string;
  name: string;
  category: string;
  type: string;
  path: string;
  description: string;
}

export interface AssetCategory {
  [key: string]: AssetReference;
}

export interface AssetIndex {
  ui: AssetCategory;
  items: AssetCategory;
  runes: AssetCategory;
  maps: AssetCategory;
  tokens: AssetCategory;
  spells: AssetCategory;
}

// UI Assets
export const uiAssets: AssetCategory = {
  loginPageBg: {
    id: 'login-page-bg',
    name: 'Login Page Background',
    category: 'ui',
    type: 'background',
    path: '/generated/ui/login-page-bg.jpg',
    description: 'Solo Leveling styled login page background with shadow theme'
  },
  landingPageHero: {
    id: 'landing-page-hero',
    name: 'Landing Page Hero',
    category: 'ui',
    type: 'background',
    path: '/generated/ui/landing-page-hero.jpg',
    description: 'Solo Leveling styled landing page hero image'
  },
  dashboardBg: {
    id: 'dashboard-bg',
    name: 'Dashboard Background',
    category: 'ui',
    type: 'background',
    path: '/generated/ui/dashboard-bg.jpg',
    description: 'Solo Leveling styled dashboard background'
  }
};

// Item Assets
export const itemAssets: AssetCategory = {
  shadowBlade: {
    id: 'shadow-blade',
    name: 'Shadow Blade of Jinwoo',
    category: 'items',
    type: 'weapon',
    path: '/generated/items/shadow-blade.jpg',
    description: 'Legendary blade forged from shadow essence'
  },
  shadowArmor: {
    id: 'shadow-armor',
    name: 'Shadow Commander\'s Armor',
    category: 'items',
    type: 'armor',
    path: '/generated/items/shadow-armor.jpg',
    description: 'Dark armor infused with shadow energy'
  },
  shadowRing: {
    id: 'shadow-ring',
    name: 'Ring of Shadow Sovereignty',
    category: 'items',
    type: 'accessory',
    path: '/generated/items/shadow-ring.jpg',
    description: 'Mysterious ring that channels shadow realm power'
  },
  healthPotion: {
    id: 'health-potion',
    name: 'Elixir of Vital Restoration',
    category: 'items',
    type: 'consumable',
    path: '/generated/items/health-potion.jpg',
    description: 'Potent healing elixir with restorative properties'
  },
  manaPotion: {
    id: 'mana-potion',
    name: 'Elixir of Arcane Renewal',
    category: 'items',
    type: 'consumable',
    path: '/generated/items/mana-potion.jpg',
    description: 'Magical elixir that restores mana'
  },
  shadowScroll: {
    id: 'shadow-scroll',
    name: 'Scroll of Shadow Dominion',
    category: 'items',
    type: 'scroll',
    path: '/generated/items/shadow-scroll.jpg',
    description: 'Ancient scroll containing powerful shadow magic'
  }
};

// Rune Assets
export const runeAssets: AssetCategory = {
  shadowRune: {
    id: 'shadow-rune',
    name: 'Rune of Eternal Shadow',
    category: 'runes',
    type: 'shadow',
    path: '/generated/runes/shadow-rune.jpg',
    description: 'Powerful rune embodying shadow essence'
  },
  fireRune: {
    id: 'fire-rune',
    name: 'Rune of Infernal Flames',
    category: 'runes',
    type: 'fire',
    path: '/generated/runes/fire-rune.jpg',
    description: 'Blazing rune that channels fire power'
  },
  iceRune: {
    id: 'ice-rune',
    name: 'Rune of Frozen Eternal',
    category: 'runes',
    type: 'ice',
    path: '/generated/runes/ice-rune.jpg',
    description: 'Chilling rune that harnesses ice power'
  },
  lightningRune: {
    id: 'lightning-rune',
    name: 'Rune of Thunder Strike',
    category: 'runes',
    type: 'lightning',
    path: '/generated/runes/lightning-rune.jpg',
    description: 'Electrifying rune commanding lightning'
  },
  healingRune: {
    id: 'healing-rune',
    name: 'Rune of Vital Restoration',
    category: 'runes',
    type: 'healing',
    path: '/generated/runes/healing-rune.jpg',
    description: 'Soothing rune with restorative energy'
  },
  protectionRune: {
    id: 'protection-rune',
    name: 'Rune of Divine Protection',
    category: 'runes',
    type: 'protection',
    path: '/generated/runes/protection-rune.jpg',
    description: 'Protective rune creating barriers'
  }
};

// Map Assets
export const mapAssets: AssetCategory = {
  dungeonFloor: {
    id: 'dungeon-floor',
    name: 'Shadow Dungeon Floor',
    category: 'maps',
    type: 'floor',
    path: '/generated/maps/dungeon-floor.jpg',
    description: 'Dark stone floor with shadow energy patterns'
  },
  stoneWall: {
    id: 'stone-wall',
    name: 'Shadow Stone Wall',
    category: 'maps',
    type: 'wall',
    path: '/generated/maps/stone-wall.jpg',
    description: 'Impenetrable stone walls with shadow magic'
  },
  woodenDoor: {
    id: 'wooden-door',
    name: 'Ancient Wooden Door',
    category: 'maps',
    type: 'door',
    path: '/generated/maps/wooden-door.jpg',
    description: 'Sturdy wooden door with metal fittings'
  },
  ironGate: {
    id: 'iron-gate',
    name: 'Shadow Iron Gate',
    category: 'maps',
    type: 'gate',
    path: '/generated/maps/iron-gate.jpg',
    description: 'Massive iron gate with shadow energy'
  },
  treasureChest: {
    id: 'treasure-chest',
    name: 'Shadow Treasure Chest',
    category: 'maps',
    type: 'object',
    path: '/generated/maps/treasure-chest.jpg',
    description: 'Mysterious chest with valuable items'
  },
  throneRoom: {
    id: 'throne-room',
    name: 'Shadow Lord\'s Throne',
    category: 'maps',
    type: 'special',
    path: '/generated/maps/throne-room.jpg',
    description: 'Imposing throne radiating power'
  }
};

// Token Assets
export const tokenAssets: AssetCategory = {
  playerToken: {
    id: 'player-token',
    name: 'Shadow Hunter',
    category: 'tokens',
    type: 'player',
    path: '/generated/tokens/player-token.jpg',
    description: 'Elite warrior trained in shadow arts'
  },
  monsterToken: {
    id: 'monster-token',
    name: 'Shadow Demon',
    category: 'tokens',
    type: 'monster',
    path: '/generated/tokens/monster-token.jpg',
    description: 'Malevolent creature from shadow energy'
  },
  bossToken: {
    id: 'boss-token',
    name: 'Shadow Lord',
    category: 'tokens',
    type: 'boss',
    path: '/generated/tokens/boss-token.jpg',
    description: 'Powerful ruler of shadow realm'
  },
  npcToken: {
    id: 'npc-token',
    name: 'Mysterious Stranger',
    category: 'tokens',
    type: 'npc',
    path: '/generated/tokens/npc-token.jpg',
    description: 'Enigmatic figure with unknown motives'
  },
  merchantToken: {
    id: 'merchant-token',
    name: 'Shadow Realm Merchant',
    category: 'tokens',
    type: 'merchant',
    path: '/generated/tokens/merchant-token.jpg',
    description: 'Trader specializing in rare items'
  },
  guardToken: {
    id: 'guard-token',
    name: 'Shadow Guard',
    category: 'tokens',
    type: 'guard',
    path: '/generated/tokens/guard-token.jpg',
    description: 'Elite soldier protecting locations'
  }
};

// Spell Assets
export const spellAssets: AssetCategory = {
  shadowBolt: {
    id: 'shadow-bolt',
    name: 'Shadow Bolt',
    category: 'spells',
    type: 'shadow',
    path: '/generated/spells/shadow-bolt.jpg',
    description: 'Bolt of pure shadow energy'
  },
  fireball: {
    id: 'fireball',
    name: 'Infernal Fireball',
    category: 'spells',
    type: 'fire',
    path: '/generated/spells/fireball.jpg',
    description: 'Massive ball of explosive fire'
  },
  iceShard: {
    id: 'ice-shard',
    name: 'Piercing Ice Shard',
    category: 'spells',
    type: 'ice',
    path: '/generated/spells/ice-shard.jpg',
    description: 'Sharp shard of penetrating ice'
  },
  lightningStrike: {
    id: 'lightning-strike',
    name: 'Thunder Strike',
    category: 'spells',
    type: 'lightning',
    path: '/generated/spells/lightning-strike.jpg',
    description: 'Powerful lightning from above'
  },
  healingLight: {
    id: 'healing-light',
    name: 'Restorative Light',
    category: 'spells',
    type: 'healing',
    path: '/generated/spells/healing-light.jpg',
    description: 'Healing energy that restores health'
  },
  protectionBarrier: {
    id: 'protection-barrier',
    name: 'Shield of Protection',
    category: 'spells',
    type: 'protection',
    path: '/generated/spells/protection-barrier.jpg',
    description: 'Magical barrier absorbing damage'
  }
};

// Complete Asset Index
export const comprehensiveAssetIndex: AssetIndex = {
  ui: uiAssets,
  items: itemAssets,
  runes: runeAssets,
  maps: mapAssets,
  tokens: tokenAssets,
  spells: spellAssets
};

export default comprehensiveAssetIndex;
