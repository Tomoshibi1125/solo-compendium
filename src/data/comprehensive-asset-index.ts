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
  props: AssetCategory;
  effects: AssetCategory;
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
    path: '/ui/login-page-bg.webp',
    description: 'System Ascendant styled login page background with shadow theme'
  },
  landingPageHero: {
    id: 'landing-page-hero',
    name: 'Landing Page Hero',
    category: 'ui',
    type: 'background',
    path: '/ui/landing-page-hero.webp',
    description: 'System Ascendant styled landing page hero image'
  },
  dashboardBg: {
    id: 'dashboard-bg',
    name: 'Dashboard Background',
    category: 'ui',
    type: 'background',
    path: '/ui/dashboard-bg.webp',
    description: 'System Ascendant styled dashboard background'
  }
};

// Item Assets
export const itemAssets: AssetCategory = {
  shadowBlade: {
    id: 'shadow-blade',
    name: 'Shadow Blade of Kael',
    category: 'items',
    type: 'weapon',
    path: '/generated/items/shadow-blade.webp',
    description: 'Legendary blade forged from shadow essence'
  },
  shadowArmor: {
    id: 'shadow-armor',
    name: 'Shadow Commander\'s Armor',
    category: 'items',
    type: 'armor',
    path: '/generated/items/shadow-armor.webp',
    description: 'Dark armor infused with shadow energy'
  },
  shadowRing: {
    id: 'shadow-ring',
    name: 'Ring of Shadow Dominion',
    category: 'items',
    type: 'accessory',
    path: '/generated/items/shadow-ring.webp',
    description: 'Mysterious ring that channels shadow realm power'
  },
  healthPotion: {
    id: 'health-potion',
    name: 'Elixir of Vital Restoration',
    category: 'items',
    type: 'consumable',
    path: '/generated/items/health-potion.webp',
    description: 'Potent healing elixir with restorative properties'
  },
  manaPotion: {
    id: 'mana-potion',
    name: 'Elixir of Arcane Renewal',
    category: 'items',
    type: 'consumable',
    path: '/generated/items/mana-potion.webp',
    description: 'Magical elixir that restores mana'
  },
  shadowScroll: {
    id: 'shadow-scroll',
    name: 'Scroll of Shadow Dominion',
    category: 'items',
    type: 'scroll',
    path: '/generated/items/shadow-scroll.webp',
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
    path: '/generated/runes/shadow-rune.webp',
    description: 'Powerful rune embodying shadow essence'
  },
  fireRune: {
    id: 'fire-rune',
    name: 'Rune of Infernal Flames',
    category: 'runes',
    type: 'fire',
    path: '/generated/runes/fire-rune.webp',
    description: 'Blazing rune that channels fire power'
  },
  iceRune: {
    id: 'ice-rune',
    name: 'Rune of Frozen Eternal',
    category: 'runes',
    type: 'ice',
    path: '/generated/runes/ice-rune.webp',
    description: 'Chilling rune that harnesses ice power'
  },
  lightningRune: {
    id: 'lightning-rune',
    name: 'Rune of Thunder Strike',
    category: 'runes',
    type: 'lightning',
    path: '/generated/runes/lightning-rune.webp',
    description: 'Electrifying rune commanding lightning'
  },
  healingRune: {
    id: 'healing-rune',
    name: 'Rune of Vital Restoration',
    category: 'runes',
    type: 'healing',
    path: '/generated/runes/healing-rune.webp',
    description: 'Soothing rune with restorative energy'
  },
  protectionRune: {
    id: 'protection-rune',
    name: 'Rune of Divine Protection',
    category: 'runes',
    type: 'protection',
    path: '/generated/runes/protection-rune.webp',
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
    path: '/generated/maps/dungeon-floor.webp',
    description: 'Dark stone floor with shadow energy patterns'
  },
  stoneWall: {
    id: 'stone-wall',
    name: 'Shadow Stone Wall',
    category: 'maps',
    type: 'wall',
    path: '/generated/maps/stone-wall.webp',
    description: 'Impenetrable stone walls with shadow magic'
  },
  woodenDoor: {
    id: 'wooden-door',
    name: 'Ancient Wooden Door',
    category: 'maps',
    type: 'door',
    path: '/generated/maps/wooden-door.webp',
    description: 'Sturdy wooden door with metal fittings'
  },
  ironGate: {
    id: 'iron-gate',
    name: 'Shadow Iron Portal',
    category: 'maps',
    type: 'gate',
    path: '/generated/maps/iron-gate.webp',
    description: 'Massive iron portal frame infused with shadow energy'
  },
  treasureChest: {
    id: 'treasure-chest',
    name: 'Shadow Treasure Chest',
    category: 'maps',
    type: 'object',
    path: '/generated/maps/treasure-chest.webp',
    description: 'Mysterious chest with valuable items'
  },
  throneRoom: {
    id: 'throne-room',
    name: 'Shadow Lord\'s Throne',
    category: 'maps',
    type: 'special',
    path: '/generated/maps/throne-room.webp',
    description: 'Imposing throne radiating power'
  },
  riftKeep: {
    id: 'rift-keep',
    name: 'Rift Keep',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/rift-keep.webp',
    description: 'Painterly top-down battle map of a fortified rift keep'
  },
  shadowCrypt: {
    id: 'shadow-crypt',
    name: 'Shadow Crypt',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/shadow-crypt.webp',
    description: 'Top-down crypt battle map with layered chambers'
  },
  frostboundVault: {
    id: 'frostbound-vault',
    name: 'Frostbound Vault',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/frostbound-vault.webp',
    description: 'Frozen vault battle map with narrow corridors'
  },
  ashenForge: {
    id: 'ashen-forge',
    name: 'Ashen Forge',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/ashen-forge.webp',
    description: 'Smoldering forge battle map with ritual platforms'
  },
  veilGarden: {
    id: 'veil-garden',
    name: 'Veil Garden',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/veil-garden.webp',
    description: 'Ruined garden battle map with overgrown corridors'
  },
  umbralThrone: {
    id: 'umbral-throne',
    name: 'Umbral Throne',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/umbral-throne.webp',
    description: 'Grand throne battle map with layered defenses'
  },
  riftCitadel: {
    id: 'rift-citadel',
    name: 'Rift Citadel',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/rift-citadel.webp',
    description: 'Massive rift citadel battle map with grand halls and a gate chamber'
  },
  shadowLabyrinth: {
    id: 'shadow-labyrinth',
    name: 'Shadow Labyrinth',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/shadow-labyrinth.webp',
    description: 'Sprawling shadow labyrinth battle map with bridges and twisted passages'
  },
  frostboundDepths: {
    id: 'frostbound-depths',
    name: 'Frostbound Depths',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/frostbound-depths.webp',
    description: 'Frozen dungeon battle map with crystal chambers and icy halls'
  },
  ashenForgeDepths: {
    id: 'ashen-forge-depths',
    name: 'Ashen Forge Depths',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/ashen-forge-depths.webp',
    description: 'Volcanic forge battle map with magma channels and scorched stone'
  },
  gateAntechamber: {
    id: 'gate-antechamber',
    name: 'Gate Antechamber',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/gate-antechamber.webp',
    description: 'Compact ritual antechamber battle map with a sealed gate'
  },
  sealedVault: {
    id: 'sealed-vault',
    name: 'Sealed Vault',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/sealed-vault.webp',
    description: 'Treasure vault battle map with trap tiles and guardian statues'
  },
  riftShrine: {
    id: 'rift-shrine',
    name: 'Rift Shrine',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/rift-shrine.webp',
    description: 'Secluded rift shrine battle map with a cracked altar'
  },
  veilVillage: {
    id: 'veil-village',
    name: 'Veil Village',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/veil-village.webp',
    description: 'Roofless village battle map with yards and a central square'
  },
  gatewatchTown: {
    id: 'gatewatch-town',
    name: 'Gatewatch Town',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/gatewatch-town.webp',
    description: 'Fortified town battle map with walls, market square, and river crossing'
  },
  ascendantCapital: {
    id: 'ascendant-capital',
    name: 'Ascendant Capital',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/ascendant-capital.webp',
    description: 'Large capital battle map with canals, plazas, and a citadel quarter'
  },
  sandsweptRuins: {
    id: 'sandswept-ruins',
    name: 'Sandswept Ruins',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/sandswept-ruins.webp',
    description: 'Desert ruins battle map with sand-swept corridors and collapsed arches'
  },
  crystalCaverns: {
    id: 'crystal-caverns',
    name: 'Crystal Caverns',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/crystal-caverns.webp',
    description: 'Luminous cavern battle map with crystalline chambers and fractured bridges'
  },
  rankEOutpost: {
    id: 'rank-e-outpost',
    name: 'Rank E Outpost',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/rank-e-outpost.webp',
    description: 'Low-rank outpost battle map with simple rooms and short corridors'
  },
  rankSAbyss: {
    id: 'rank-s-abyss',
    name: 'Rank S Abyss',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/rank-s-abyss.webp',
    description: 'Abyssal arena battle map with towering pillars and void chasms'
  },
  inkwashRuins: {
    id: 'inkwash-ruins',
    name: 'Inkwash Ruins',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/inkwash-ruins.webp',
    description: 'Monochrome inkwash ruins battle map with violet accents'
  },
  arcaneSchematic: {
    id: 'arcane-schematic',
    name: 'Arcane Schematic',
    category: 'maps',
    type: 'battlemap',
    path: '/generated/maps/premade/arcane-schematic.webp',
    description: 'Arcane schematic battle map with glowing linework and occult geometry'
  }
};

// Prop Assets
export const propAssets: AssetCategory = {
  riftGatePortal: {
    id: 'rift-gate-portal',
    name: 'Rift Gate Portal',
    category: 'props',
    type: 'portal',
    path: '/generated/props/rift-gate-portal.webp',
    description: 'Glowing rift gate portal prop for VTT scenes'
  },
  arcaneAltar: {
    id: 'arcane-altar',
    name: 'Arcane Altar',
    category: 'props',
    type: 'altar',
    path: '/generated/props/arcane-altar.webp',
    description: 'Rune-carved altar with a faint violet glow'
  },
  obsidianObelisk: {
    id: 'obsidian-obelisk',
    name: 'Obsidian Obelisk',
    category: 'props',
    type: 'obelisk',
    path: '/generated/props/obsidian-obelisk.webp',
    description: 'Obsidian monolith etched with shadow fractures'
  },
  runeCircle: {
    id: 'rune-circle',
    name: 'Rune Circle',
    category: 'props',
    type: 'ritual',
    path: '/generated/props/rune-circle.webp',
    description: 'Glowing rune circle etched into stone floor'
  },
  shadowBrazier: {
    id: 'shadow-brazier',
    name: 'Shadow Brazier',
    category: 'props',
    type: 'brazier',
    path: '/generated/props/shadow-brazier.webp',
    description: 'Iron brazier with violet flame and smoke'
  },
  crystalCluster: {
    id: 'crystal-cluster',
    name: 'Crystal Cluster',
    category: 'props',
    type: 'treasure',
    path: '/generated/props/crystal-cluster.webp',
    description: 'Jagged crystal cluster with icy glow'
  },
  ancientStatue: {
    id: 'ancient-statue',
    name: 'Ancient Statue',
    category: 'props',
    type: 'statue',
    path: '/generated/props/ancient-statue.webp',
    description: 'Weathered stone statue marked with ancient runes'
  },
  treasureCache: {
    id: 'treasure-cache',
    name: 'Treasure Cache',
    category: 'props',
    type: 'treasure',
    path: '/generated/props/treasure-cache.webp',
    description: 'Open cache of relics and coin'
  },
  woodenTableRect: {
    id: 'wooden-table-rect',
    name: 'Wooden Table (Rect)',
    category: 'props',
    type: 'furniture',
    path: '/generated/props/wooden-table-rect.webp',
    description: 'Rectangular wooden table with worn planks'
  },
  woodenTableRound: {
    id: 'wooden-table-round',
    name: 'Wooden Table (Round)',
    category: 'props',
    type: 'furniture',
    path: '/generated/props/wooden-table-round.webp',
    description: 'Round wooden table with a carved edge'
  },
  woodenChair: {
    id: 'wooden-chair',
    name: 'Wooden Chair',
    category: 'props',
    type: 'furniture',
    path: '/generated/props/wooden-chair.webp',
    description: 'Sturdy wooden chair with reinforced legs'
  },
  woodenBench: {
    id: 'wooden-bench',
    name: 'Wooden Bench',
    category: 'props',
    type: 'furniture',
    path: '/generated/props/wooden-bench.webp',
    description: 'Simple wooden bench for taverns or camps'
  },
  stoneRitualTable: {
    id: 'stone-ritual-table',
    name: 'Stone Ritual Table',
    category: 'props',
    type: 'ritual',
    path: '/generated/props/stone-ritual-table.webp',
    description: 'Stone ritual table carved with runes'
  },
  bookshelf: {
    id: 'bookshelf',
    name: 'Bookshelf',
    category: 'props',
    type: 'furniture',
    path: '/generated/props/bookshelf.webp',
    description: 'Tall bookshelf stacked with tomes and candles'
  },
  bedroll: {
    id: 'bedroll',
    name: 'Bedroll',
    category: 'props',
    type: 'camp',
    path: '/generated/props/bedroll.webp',
    description: 'Rolled bedroll with blanket and strap'
  },
  bunkBed: {
    id: 'bunk-bed',
    name: 'Bunk Bed',
    category: 'props',
    type: 'furniture',
    path: '/generated/props/bunk-bed.webp',
    description: 'Simple wooden bunk bed with folded bedding'
  },
  crateStack: {
    id: 'crate-stack',
    name: 'Crate Stack',
    category: 'props',
    type: 'storage',
    path: '/generated/props/crate-stack.webp',
    description: 'Stack of wooden crates bound with rope'
  },
  barrel: {
    id: 'barrel',
    name: 'Barrel',
    category: 'props',
    type: 'storage',
    path: '/generated/props/barrel.webp',
    description: 'Wooden barrel with iron hoops'
  },
  weaponRack: {
    id: 'weapon-rack',
    name: 'Weapon Rack',
    category: 'props',
    type: 'weapon',
    path: '/generated/props/weapon-rack.webp',
    description: 'Weapon rack holding swords and spears'
  },
  hangingChandelier: {
    id: 'hanging-chandelier',
    name: 'Hanging Chandelier',
    category: 'props',
    type: 'light',
    path: '/generated/props/hanging-chandelier.webp',
    description: 'Iron chandelier with candles and chain mount'
  }
};

// Effect Assets
export const effectAssets: AssetCategory = {
  fireBurst: {
    id: 'fire-burst',
    name: 'Fire Burst',
    category: 'effects',
    type: 'fire',
    path: '/generated/effects/fire-burst.webp',
    description: 'Painterly fire burst effect with ember glow'
  },
  iceBlast: {
    id: 'ice-blast',
    name: 'Ice Blast',
    category: 'effects',
    type: 'ice',
    path: '/generated/effects/ice-blast.webp',
    description: 'Icy blast effect with frost mist'
  },
  lightningStrike: {
    id: 'lightning-strike',
    name: 'Lightning Strike',
    category: 'effects',
    type: 'lightning',
    path: '/generated/effects/lightning-strike.webp',
    description: 'Lightning impact effect with crackling arcs'
  },
  shadowPool: {
    id: 'shadow-pool',
    name: 'Shadow Pool',
    category: 'effects',
    type: 'shadow',
    path: '/generated/effects/shadow-pool.webp',
    description: 'Dark shadow pool with tendrils'
  },
  poisonCloud: {
    id: 'poison-cloud',
    name: 'Poison Cloud',
    category: 'effects',
    type: 'poison',
    path: '/generated/effects/poison-cloud.webp',
    description: 'Toxic green cloud effect'
  },
  holyAura: {
    id: 'holy-aura',
    name: 'Holy Aura',
    category: 'effects',
    type: 'holy',
    path: '/generated/effects/holy-aura.webp',
    description: 'Radiant golden aura circle'
  },
  arcaneSigil: {
    id: 'arcane-sigil',
    name: 'Arcane Sigil',
    category: 'effects',
    type: 'arcane',
    path: '/generated/effects/arcane-sigil.webp',
    description: 'Glowing arcane sigil circle'
  },
  smokeScreen: {
    id: 'smoke-screen',
    name: 'Smoke Screen',
    category: 'effects',
    type: 'smoke',
    path: '/generated/effects/smoke-screen.webp',
    description: 'Dense smoke screen effect'
  },
  bloodSplatter: {
    id: 'blood-splatter',
    name: 'Blood Splatter',
    category: 'effects',
    type: 'blood',
    path: '/generated/effects/blood-splatter.webp',
    description: 'Dark blood splatter hazard'
  },
  webTrap: {
    id: 'web-trap',
    name: 'Web Trap',
    category: 'effects',
    type: 'web',
    path: '/generated/effects/web-trap.webp',
    description: 'Sticky web trap spread'
  },
  fogOfWarDense: {
    id: 'fog-of-war-dense',
    name: 'Fog of War (Dense)',
    category: 'effects',
    type: 'fog',
    path: '/generated/effects/fog-of-war-dense.webp',
    description: 'Dense fog of war overlay'
  },
  fogOfWarMist: {
    id: 'fog-of-war-mist',
    name: 'Fog of War (Mist)',
    category: 'effects',
    type: 'fog',
    path: '/generated/effects/fog-of-war-mist.webp',
    description: 'Light mist fog of war overlay'
  },
  darknessShroud: {
    id: 'darkness-shroud',
    name: 'Darkness Shroud',
    category: 'effects',
    type: 'darkness',
    path: '/generated/effects/darkness-shroud.webp',
    description: 'Deep shadow shroud overlay'
  },
  dimLightHalo: {
    id: 'dim-light-halo',
    name: 'Dim Light Halo',
    category: 'effects',
    type: 'lighting',
    path: '/generated/effects/dim-light-halo.webp',
    description: 'Dim radial light halo'
  },
  brightLightHalo: {
    id: 'bright-light-halo',
    name: 'Bright Light Halo',
    category: 'effects',
    type: 'lighting',
    path: '/generated/effects/bright-light-halo.webp',
    description: 'Bright radial light halo'
  },
  torchGlow: {
    id: 'torch-glow',
    name: 'Torch Glow',
    category: 'effects',
    type: 'lighting',
    path: '/generated/effects/torch-glow.webp',
    description: 'Warm torchlight glow'
  },
  lanternGlow: {
    id: 'lantern-glow',
    name: 'Lantern Glow',
    category: 'effects',
    type: 'lighting',
    path: '/generated/effects/lantern-glow.webp',
    description: 'Golden lantern glow'
  },
  arcaneGlow: {
    id: 'arcane-glow',
    name: 'Arcane Glow',
    category: 'effects',
    type: 'lighting',
    path: '/generated/effects/arcane-glow.webp',
    description: 'Violet-blue arcane glow'
  },
  spotlightCone: {
    id: 'spotlight-cone',
    name: 'Spotlight Cone',
    category: 'effects',
    type: 'lighting',
    path: '/generated/effects/spotlight-cone.webp',
    description: 'Soft spotlight cone overlay'
  },
  visionConeNarrow: {
    id: 'vision-cone-narrow',
    name: 'Vision Cone (Narrow)',
    category: 'effects',
    type: 'vision',
    path: '/generated/effects/vision-cone-narrow.webp',
    description: 'Narrow vision cone overlay'
  },
  visionConeWide: {
    id: 'vision-cone-wide',
    name: 'Vision Cone (Wide)',
    category: 'effects',
    type: 'vision',
    path: '/generated/effects/vision-cone-wide.webp',
    description: 'Wide vision cone overlay'
  }
};

// Token Assets
export const tokenAssets: AssetCategory = {
  playerToken: {
    id: 'player-token',
    name: 'Shadow Ascendant',
    category: 'tokens',
    type: 'player',
    path: '/generated/tokens/player-token.webp',
    description: 'Elite warrior trained in shadow arts'
  },
  monsterToken: {
    id: 'monster-token',
    name: 'Shadow Demon',
    category: 'tokens',
    type: 'monster',
    path: '/generated/tokens/monster-token.webp',
    description: 'Malevolent creature from shadow energy'
  },
  bossToken: {
    id: 'boss-token',
    name: 'Shadow Lord',
    category: 'tokens',
    type: 'boss',
    path: '/generated/tokens/boss-token.webp',
    description: 'Powerful regent of the shadow realm'
  },
  npcToken: {
    id: 'npc-token',
    name: 'Mysterious Stranger',
    category: 'tokens',
    type: 'npc',
    path: '/generated/tokens/npc-token.webp',
    description: 'Enigmatic figure with unknown motives'
  },
  merchantToken: {
    id: 'merchant-token',
    name: 'Shadow Realm Merchant',
    category: 'tokens',
    type: 'merchant',
    path: '/generated/tokens/merchant-token.webp',
    description: 'Trader specializing in rare items'
  },
  guardToken: {
    id: 'guard-token',
    name: 'Shadow Guard',
    category: 'tokens',
    type: 'guard',
    path: '/generated/tokens/guard-token.webp',
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
    path: '/generated/spells/shadow-bolt.webp',
    description: 'Bolt of pure shadow energy'
  },
  fireball: {
    id: 'fireball',
    name: 'Infernal Fireball',
    category: 'spells',
    type: 'fire',
    path: '/generated/spells/fireball.webp',
    description: 'Massive ball of explosive fire'
  },
  iceShard: {
    id: 'ice-shard',
    name: 'Piercing Ice Shard',
    category: 'spells',
    type: 'ice',
    path: '/generated/spells/ice-shard.webp',
    description: 'Sharp shard of penetrating ice'
  },
  lightningStrike: {
    id: 'lightning-strike',
    name: 'Thunder Strike',
    category: 'spells',
    type: 'lightning',
    path: '/generated/spells/lightning-strike.webp',
    description: 'Powerful lightning from above'
  },
  healingLight: {
    id: 'healing-light',
    name: 'Restorative Light',
    category: 'spells',
    type: 'healing',
    path: '/generated/spells/healing-light.webp',
    description: 'Healing energy that restores health'
  },
  protectionBarrier: {
    id: 'protection-barrier',
    name: 'Shield of Protection',
    category: 'spells',
    type: 'protection',
    path: '/generated/spells/protection-barrier.webp',
    description: 'Magical barrier absorbing damage'
  }
};

// Complete Asset Index
export const comprehensiveAssetIndex: AssetIndex = {
  ui: uiAssets,
  items: itemAssets,
  runes: runeAssets,
  maps: mapAssets,
  props: propAssets,
  effects: effectAssets,
  tokens: tokenAssets,
  spells: spellAssets
};

export default comprehensiveAssetIndex;

