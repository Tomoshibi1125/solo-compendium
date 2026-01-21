import tokensCompendium, { type Token as BaseToken } from '@/data/tokens';

export type TokenType = 'character' | 'monster' | 'npc' | 'prop' | 'effect' | 'custom';
export type TokenCategory = 'ascendant' | 'monster' | 'boss' | 'npc' | 'treasure' | 'trap' | 'effect' | 'other';

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
  createdAt: string;
}

const BASE_TOKEN_CREATED_AT = new Date().toISOString();
const DEFAULT_TOKEN_CREATED_AT = new Date().toISOString();

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
  const missingBase = BASE_LIBRARY_TOKENS.filter((token) => !existingIds.has(token.id));
  if (missingBase.length === 0) return current;
  return [...missingBase, ...current];
};
