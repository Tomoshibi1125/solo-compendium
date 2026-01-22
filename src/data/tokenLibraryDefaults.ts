import tokensCompendium, { type Token as BaseToken } from '@/data/tokens';

export type TokenType = 'character' | 'monster' | 'npc' | 'prop' | 'effect' | 'custom';
export type TokenCategory = 'ascendant' | 'monster' | 'boss' | 'npc' | 'treasure' | 'trap' | 'effect' | 'other';
export type TokenRenderMode = 'token' | 'overlay';
export type TokenBlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'lighten' | 'darken' | 'color-dodge' | 'plus-lighter';

export interface TokenRenderStyle {
  mode?: TokenRenderMode;
  opacity?: number;
  blendMode?: TokenBlendMode;
}

export interface LibraryToken {
  id: string;
  name: string;
  type: TokenType;
  category: TokenCategory;
  imageUrl?: string;
  emoji?: string;
  size: 'small' | 'medium' | 'large' | 'huge';
  color?: string;
  tags: string[];
  notes?: string;
  render?: TokenRenderStyle;
  createdAt: string;
}

const BASE_TOKEN_CREATED_AT = new Date().toISOString();
const DEFAULT_TOKEN_CREATED_AT = new Date().toISOString();
const OVERLAY_RENDER: TokenRenderStyle = { mode: 'overlay', blendMode: 'normal', opacity: 1 };
const EFFECT_LIGHT_RENDER: TokenRenderStyle = { mode: 'overlay', blendMode: 'screen', opacity: 0.9 };
const EFFECT_LIGHT_SOFT_RENDER: TokenRenderStyle = { mode: 'overlay', blendMode: 'screen', opacity: 0.7 };
const EFFECT_DARK_RENDER: TokenRenderStyle = { mode: 'overlay', blendMode: 'multiply', opacity: 0.85 };
const EFFECT_MIST_RENDER: TokenRenderStyle = { mode: 'overlay', blendMode: 'multiply', opacity: 0.6 };
const EFFECT_SMOKE_RENDER: TokenRenderStyle = { mode: 'overlay', blendMode: 'multiply', opacity: 0.7 };
const EFFECT_NEUTRAL_RENDER: TokenRenderStyle = { mode: 'overlay', blendMode: 'normal', opacity: 0.9 };

const BASE_TYPE_MAP: Record<
  BaseToken['type'],
  { type: TokenType; category: TokenCategory; size: LibraryToken['size']; tag: string }
> = {
  player: { type: 'character', category: 'ascendant', size: 'medium', tag: 'ascendant' },
  monster: { type: 'monster', category: 'monster', size: 'large', tag: 'monster' },
  boss: { type: 'monster', category: 'boss', size: 'huge', tag: 'boss' },
  npc: { type: 'npc', category: 'npc', size: 'medium', tag: 'npc' },
  merchant: { type: 'npc', category: 'npc', size: 'medium', tag: 'merchant' },
  guard: { type: 'npc', category: 'npc', size: 'medium', tag: 'guard' },
};

export const BASE_LIBRARY_TOKENS: LibraryToken[] = tokensCompendium.map((token: BaseToken) => {
  const mapped = BASE_TYPE_MAP[token.type] ?? {
    type: 'custom',
    category: 'other',
    size: 'medium',
    tag: 'custom',
  };

  return {
    id: `base-${token.id}`,
    name: token.name,
    type: mapped.type,
    category: mapped.category,
    imageUrl: token.image,
    size: mapped.size,
    tags: ['base', mapped.tag],
    notes: token.description,
    createdAt: BASE_TOKEN_CREATED_AT,
  };
});

export const DEFAULT_TOKENS: LibraryToken[] = [
  ...BASE_LIBRARY_TOKENS,
  // Ascendants
  {
    id: 'hunter-1',
    name: 'Ascendant (E-Rank)',
    type: 'character',
    category: 'ascendant',
    emoji: 'A-E',
    size: 'medium',
    tags: ['ascendant', 'e-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'hunter-2',
    name: 'Ascendant (D-Rank)',
    type: 'character',
    category: 'ascendant',
    emoji: 'A-D',
    size: 'medium',
    tags: ['ascendant', 'd-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'hunter-3',
    name: 'Ascendant (C-Rank)',
    type: 'character',
    category: 'ascendant',
    emoji: 'A-C',
    size: 'medium',
    tags: ['ascendant', 'c-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'hunter-4',
    name: 'Ascendant (B-Rank)',
    type: 'character',
    category: 'ascendant',
    emoji: 'A-B',
    size: 'medium',
    tags: ['ascendant', 'b-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'hunter-5',
    name: 'Ascendant (A-Rank)',
    type: 'character',
    category: 'ascendant',
    emoji: 'A-A',
    size: 'medium',
    tags: ['ascendant', 'a-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'hunter-6',
    name: 'Ascendant (S-Rank)',
    type: 'character',
    category: 'ascendant',
    emoji: 'A-S',
    size: 'large',
    tags: ['ascendant', 's-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },

  // Monsters
  {
    id: 'monster-1',
    name: 'Monster (E-Rank)',
    type: 'monster',
    category: 'monster',
    emoji: 'M-E',
    size: 'small',
    tags: ['monster', 'e-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'monster-2',
    name: 'Monster (D-Rank)',
    type: 'monster',
    category: 'monster',
    emoji: 'M-D',
    size: 'small',
    tags: ['monster', 'd-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'monster-3',
    name: 'Monster (C-Rank)',
    type: 'monster',
    category: 'monster',
    emoji: 'M-C',
    size: 'medium',
    tags: ['monster', 'c-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'monster-4',
    name: 'Monster (B-Rank)',
    type: 'monster',
    category: 'monster',
    emoji: 'M-B',
    size: 'medium',
    tags: ['monster', 'b-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'monster-5',
    name: 'Monster (A-Rank)',
    type: 'monster',
    category: 'monster',
    emoji: 'M-A',
    size: 'large',
    tags: ['monster', 'a-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'monster-6',
    name: 'Monster (S-Rank)',
    type: 'monster',
    category: 'monster',
    emoji: 'M-S',
    size: 'huge',
    tags: ['monster', 's-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },

  // Bosses
  {
    id: 'boss-1',
    name: 'Boss (E-Rank)',
    type: 'monster',
    category: 'boss',
    emoji: 'B-E',
    size: 'large',
    color: '#ef4444',
    tags: ['boss', 'e-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'boss-2',
    name: 'Boss (D-Rank)',
    type: 'monster',
    category: 'boss',
    emoji: 'B-D',
    size: 'large',
    color: '#f97316',
    tags: ['boss', 'd-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'boss-3',
    name: 'Boss (C-Rank)',
    type: 'monster',
    category: 'boss',
    emoji: 'B-C',
    size: 'large',
    color: '#eab308',
    tags: ['boss', 'c-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'boss-4',
    name: 'Boss (B-Rank)',
    type: 'monster',
    category: 'boss',
    emoji: 'B-B',
    size: 'huge',
    color: '#3b82f6',
    tags: ['boss', 'b-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'boss-5',
    name: 'Boss (A-Rank)',
    type: 'monster',
    category: 'boss',
    emoji: 'B-A',
    size: 'huge',
    color: '#8b5cf6',
    tags: ['boss', 'a-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'boss-6',
    name: 'Boss (S-Rank)',
    type: 'monster',
    category: 'boss',
    emoji: 'B-S',
    size: 'huge',
    color: '#ec4899',
    tags: ['boss', 's-rank'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },

  // NPCs
  {
    id: 'npc-1',
    name: 'NPC - Ascendant',
    type: 'npc',
    category: 'npc',
    emoji: 'N-A',
    size: 'medium',
    tags: ['npc', 'ascendant'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'npc-2',
    name: 'NPC - Merchant',
    type: 'npc',
    category: 'npc',
    emoji: 'N-M',
    size: 'medium',
    tags: ['npc', 'merchant'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'npc-3',
    name: 'NPC - Guild Master',
    type: 'npc',
    category: 'npc',
    emoji: 'N-G',
    size: 'medium',
    tags: ['npc', 'guild'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'npc-4',
    name: 'NPC - Civilian',
    type: 'npc',
    category: 'npc',
    emoji: 'N-C',
    size: 'medium',
    tags: ['npc', 'civilian'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },

  // Props and Effects
  {
    id: 'treasure-1',
    name: 'Treasure Chest',
    type: 'prop',
    category: 'treasure',
    emoji: 'TC',
    size: 'small',
    tags: ['treasure', 'chest'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'treasure-2',
    name: 'Relic',
    type: 'prop',
    category: 'treasure',
    emoji: 'RL',
    size: 'small',
    tags: ['treasure', 'relic'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'trap-1',
    name: 'Trap',
    type: 'prop',
    category: 'trap',
    emoji: 'TR',
    size: 'small',
    color: '#ef4444',
    tags: ['trap'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-1',
    name: 'Fire Effect',
    type: 'effect',
    category: 'effect',
    emoji: 'FX-F',
    size: 'medium',
    tags: ['effect', 'fire'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-2',
    name: 'Umbral Effect',
    type: 'effect',
    category: 'effect',
    emoji: 'FX-U',
    size: 'medium',
    tags: ['effect', 'umbral'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-3',
    name: 'Mana Effect',
    type: 'effect',
    category: 'effect',
    emoji: 'FX-M',
    size: 'medium',
    tags: ['effect', 'mana'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-rift-gate',
    name: 'Rift Gate Portal',
    type: 'prop',
    category: 'effect',
    imageUrl: '/generated/props/rift-gate-portal.webp',
    size: 'large',
    render: OVERLAY_RENDER,
    tags: ['prop', 'portal', 'rift', 'effect'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-arcane-altar',
    name: 'Arcane Altar',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/arcane-altar.webp',
    size: 'medium',
    render: OVERLAY_RENDER,
    tags: ['prop', 'altar', 'ritual'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-obsidian-obelisk',
    name: 'Obsidian Obelisk',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/obsidian-obelisk.webp',
    size: 'large',
    render: OVERLAY_RENDER,
    tags: ['prop', 'obelisk', 'umbral'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-rune-circle',
    name: 'Rune Circle',
    type: 'prop',
    category: 'effect',
    imageUrl: '/generated/props/rune-circle.webp',
    size: 'large',
    render: OVERLAY_RENDER,
    tags: ['prop', 'rune', 'ritual', 'effect'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-shadow-brazier',
    name: 'Shadow Brazier',
    type: 'prop',
    category: 'effect',
    imageUrl: '/generated/props/shadow-brazier.webp',
    size: 'small',
    render: OVERLAY_RENDER,
    tags: ['prop', 'brazier', 'fire', 'effect'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-crystal-cluster',
    name: 'Crystal Cluster',
    type: 'prop',
    category: 'treasure',
    imageUrl: '/generated/props/crystal-cluster.webp',
    size: 'medium',
    render: OVERLAY_RENDER,
    tags: ['prop', 'crystal', 'treasure'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-ancient-statue',
    name: 'Ancient Statue',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/ancient-statue.webp',
    size: 'large',
    render: OVERLAY_RENDER,
    tags: ['prop', 'statue', 'ruins'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-treasure-cache',
    name: 'Treasure Cache',
    type: 'prop',
    category: 'treasure',
    imageUrl: '/generated/props/treasure-cache.webp',
    size: 'small',
    render: OVERLAY_RENDER,
    tags: ['prop', 'treasure', 'cache'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-wooden-table-rect',
    name: 'Wooden Table (Rect)',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/wooden-table-rect.webp',
    size: 'large',
    render: OVERLAY_RENDER,
    tags: ['prop', 'furniture', 'table'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-wooden-table-round',
    name: 'Wooden Table (Round)',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/wooden-table-round.webp',
    size: 'medium',
    render: OVERLAY_RENDER,
    tags: ['prop', 'furniture', 'table'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-wooden-chair',
    name: 'Wooden Chair',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/wooden-chair.webp',
    size: 'small',
    render: OVERLAY_RENDER,
    tags: ['prop', 'furniture', 'chair'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-wooden-bench',
    name: 'Wooden Bench',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/wooden-bench.webp',
    size: 'medium',
    render: OVERLAY_RENDER,
    tags: ['prop', 'furniture', 'bench'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-stone-ritual-table',
    name: 'Stone Ritual Table',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/stone-ritual-table.webp',
    size: 'large',
    render: OVERLAY_RENDER,
    tags: ['prop', 'ritual', 'table'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-bookshelf',
    name: 'Bookshelf',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/bookshelf.webp',
    size: 'large',
    render: OVERLAY_RENDER,
    tags: ['prop', 'furniture', 'books'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-bedroll',
    name: 'Bedroll',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/bedroll.webp',
    size: 'small',
    render: OVERLAY_RENDER,
    tags: ['prop', 'sleep', 'camp'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-bunk-bed',
    name: 'Bunk Bed',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/bunk-bed.webp',
    size: 'large',
    render: OVERLAY_RENDER,
    tags: ['prop', 'furniture', 'bed'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-crate-stack',
    name: 'Crate Stack',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/crate-stack.webp',
    size: 'medium',
    render: OVERLAY_RENDER,
    tags: ['prop', 'crate', 'storage'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-barrel',
    name: 'Barrel',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/barrel.webp',
    size: 'small',
    render: OVERLAY_RENDER,
    tags: ['prop', 'barrel', 'storage'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-weapon-rack',
    name: 'Weapon Rack',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/weapon-rack.webp',
    size: 'large',
    render: OVERLAY_RENDER,
    tags: ['prop', 'weapons', 'rack'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'prop-hanging-chandelier',
    name: 'Hanging Chandelier',
    type: 'prop',
    category: 'other',
    imageUrl: '/generated/props/hanging-chandelier.webp',
    size: 'medium',
    render: OVERLAY_RENDER,
    tags: ['prop', 'light', 'chandelier'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-fire-burst',
    name: 'Fire Burst',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/fire-burst.webp',
    size: 'large',
    render: EFFECT_LIGHT_RENDER,
    tags: ['effect', 'fire', 'burst'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-ice-blast',
    name: 'Ice Blast',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/ice-blast.webp',
    size: 'large',
    render: EFFECT_LIGHT_RENDER,
    tags: ['effect', 'ice', 'blast'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-lightning-strike',
    name: 'Lightning Strike',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/lightning-strike.webp',
    size: 'large',
    render: EFFECT_LIGHT_RENDER,
    tags: ['effect', 'lightning', 'strike'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-shadow-pool',
    name: 'Shadow Pool',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/shadow-pool.webp',
    size: 'large',
    render: EFFECT_DARK_RENDER,
    tags: ['effect', 'shadow', 'zone'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-poison-cloud',
    name: 'Poison Cloud',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/poison-cloud.webp',
    size: 'large',
    render: EFFECT_LIGHT_RENDER,
    tags: ['effect', 'poison', 'cloud'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-holy-aura',
    name: 'Holy Aura',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/holy-aura.webp',
    size: 'large',
    render: EFFECT_LIGHT_RENDER,
    tags: ['effect', 'holy', 'aura'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-arcane-sigil',
    name: 'Arcane Sigil',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/arcane-sigil.webp',
    size: 'large',
    render: EFFECT_LIGHT_RENDER,
    tags: ['effect', 'arcane', 'sigil'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-smoke-screen',
    name: 'Smoke Screen',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/smoke-screen.webp',
    size: 'large',
    render: EFFECT_SMOKE_RENDER,
    tags: ['effect', 'smoke', 'cloud'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-blood-splatter',
    name: 'Blood Splatter',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/blood-splatter.webp',
    size: 'medium',
    render: EFFECT_NEUTRAL_RENDER,
    tags: ['effect', 'blood', 'hazard'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-web-trap',
    name: 'Web Trap',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/web-trap.webp',
    size: 'large',
    render: EFFECT_NEUTRAL_RENDER,
    tags: ['effect', 'web', 'trap'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-fog-of-war-dense',
    name: 'Fog of War (Dense)',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/fog-of-war-dense.webp',
    size: 'huge',
    render: EFFECT_DARK_RENDER,
    tags: ['effect', 'fog', 'lighting', 'overlay', 'darkness'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-fog-of-war-mist',
    name: 'Fog of War (Mist)',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/fog-of-war-mist.webp',
    size: 'huge',
    render: EFFECT_MIST_RENDER,
    tags: ['effect', 'fog', 'lighting', 'overlay', 'mist'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-darkness-shroud',
    name: 'Darkness Shroud',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/darkness-shroud.webp',
    size: 'huge',
    render: EFFECT_DARK_RENDER,
    tags: ['effect', 'darkness', 'shadow', 'overlay'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-dim-light-halo',
    name: 'Dim Light Halo',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/dim-light-halo.webp',
    size: 'huge',
    render: EFFECT_LIGHT_SOFT_RENDER,
    tags: ['effect', 'lighting', 'halo', 'overlay'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-bright-light-halo',
    name: 'Bright Light Halo',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/bright-light-halo.webp',
    size: 'huge',
    render: EFFECT_LIGHT_RENDER,
    tags: ['effect', 'lighting', 'halo', 'overlay', 'bright'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-torch-glow',
    name: 'Torch Glow',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/torch-glow.webp',
    size: 'large',
    render: EFFECT_LIGHT_RENDER,
    tags: ['effect', 'lighting', 'torch', 'glow', 'overlay'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-lantern-glow',
    name: 'Lantern Glow',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/lantern-glow.webp',
    size: 'large',
    render: EFFECT_LIGHT_RENDER,
    tags: ['effect', 'lighting', 'lantern', 'glow', 'overlay'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-arcane-glow',
    name: 'Arcane Glow',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/arcane-glow.webp',
    size: 'large',
    render: EFFECT_LIGHT_RENDER,
    tags: ['effect', 'lighting', 'arcane', 'glow', 'overlay'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-spotlight-cone',
    name: 'Spotlight Cone',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/spotlight-cone.webp',
    size: 'huge',
    render: EFFECT_LIGHT_SOFT_RENDER,
    tags: ['effect', 'lighting', 'cone', 'spotlight', 'overlay'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-vision-cone-narrow',
    name: 'Vision Cone (Narrow)',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/vision-cone-narrow.webp',
    size: 'huge',
    render: EFFECT_LIGHT_SOFT_RENDER,
    tags: ['effect', 'lighting', 'vision', 'cone', 'overlay'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
  {
    id: 'effect-vision-cone-wide',
    name: 'Vision Cone (Wide)',
    type: 'effect',
    category: 'effect',
    imageUrl: '/generated/effects/vision-cone-wide.webp',
    size: 'huge',
    render: EFFECT_LIGHT_SOFT_RENDER,
    tags: ['effect', 'lighting', 'vision', 'cone', 'overlay'],
    createdAt: DEFAULT_TOKEN_CREATED_AT,
  },
];

const normalizeTokenCategory = (category: string | undefined): TokenCategory => {
  if (category === 'hunter') return 'ascendant';
  if (!category) return 'other';
  if (category === 'ascendant') return 'ascendant';
  if (category === 'monster') return 'monster';
  if (category === 'boss') return 'boss';
  if (category === 'npc') return 'npc';
  if (category === 'treasure') return 'treasure';
  if (category === 'trap') return 'trap';
  if (category === 'effect') return 'effect';
  return 'other';
};

const normalizeTokenTags = (tags: string[] | undefined) => {
  if (!Array.isArray(tags)) {
    return { tags: [], changed: true };
  }
  let changed = false;
  const normalized = tags
    .map((tag) => {
      if (tag === 'hunter') {
        changed = true;
        return 'ascendant';
      }
      return tag;
    })
    .filter((tag) => tag.length > 0);
  if (!changed && normalized.length !== tags.length) {
    changed = true;
  }
  return { tags: normalized, changed };
};

const normalizeTokenEmoji = (token: LibraryToken) => {
  if (token.id.startsWith('hunter-') && token.emoji && token.emoji.startsWith('H-')) {
    return `A-${token.emoji.slice(2)}`;
  }
  return token.emoji;
};

export const normalizeLibraryTokens = (tokens: LibraryToken[]): LibraryToken[] => {
  if (!Array.isArray(tokens)) return [];
  let changed = false;
  const normalized = tokens.map((token) => {
    const category = normalizeTokenCategory(token.category);
    const tagResult = normalizeTokenTags(token.tags);
    const emoji = normalizeTokenEmoji(token);
    const createdAt = token.createdAt || new Date().toISOString();

    const updated: LibraryToken = {
      ...token,
      category,
      tags: tagResult.tags,
      emoji,
      createdAt,
    };

    if (category !== token.category) changed = true;
    if (tagResult.changed) changed = true;
    if (emoji !== token.emoji) changed = true;
    if (createdAt !== token.createdAt) changed = true;

    return updated;
  });

  return changed ? normalized : tokens;
};

export const mergeBaseTokens = (current: LibraryToken[]) => {
  const existingIds = new Set(current.map((token) => token.id));
  const missingDefaults = DEFAULT_TOKENS.filter((token) => !existingIds.has(token.id));
  if (missingDefaults.length === 0) return current;
  return [...missingDefaults, ...current];
};
