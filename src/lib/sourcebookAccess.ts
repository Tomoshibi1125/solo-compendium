import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export type SourcebookAccessContext = {
  campaignId?: string | null;
};

type AccessibleSourcebookRow = {
  sourcebook_id?: string | null;
};

type SupabaseRpcClient = {
  rpc: (
    fn: string,
    args?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message?: string } | null }>;
};

type AccessCacheRecord = {
  expiresAt: number;
  accessibleSourcebooks: Set<string>;
};

type RpcError = {
  message?: string;
};

type RpcResponse = {
  data: unknown;
  error: RpcError | null;
};

const supabaseRpc = supabase as unknown as SupabaseRpcClient;
const ACCESS_CACHE_TTL_MS = 30_000;
const accessCache = new Map<string, AccessCacheRecord>();
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeSourcebookKey = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isRpcUnavailableError = (message?: string): boolean => {
  const normalized = (message || '').toLowerCase();
  return (
    normalized.includes('does not exist') ||
    normalized.includes('no function matches') ||
    normalized.includes('schema cache') ||
    normalized.includes('permission denied')
  );
};

const getCacheKey = (userId: string, campaignId?: string | null): string =>
  `${userId}:${campaignId ?? 'none'}`;

const getCachedSourcebooks = (cacheKey: string): Set<string> | null => {
  const cached = accessCache.get(cacheKey);
  if (!cached || cached.expiresAt < Date.now()) {
    accessCache.delete(cacheKey);
    return null;
  }

  return new Set(cached.accessibleSourcebooks);
};

const setCachedSourcebooks = (cacheKey: string, sourcebooks: Set<string>) => {
  accessCache.set(cacheKey, {
    expiresAt: Date.now() + ACCESS_CACHE_TTL_MS,
    accessibleSourcebooks: new Set(sourcebooks),
  });
};

const collectSourcebooksFromRpcData = (
  data: unknown,
  target: Set<string>
) => {
  if (!Array.isArray(data)) {
    return;
  }

  for (const row of data as AccessibleSourcebookRow[]) {
    if (typeof row?.sourcebook_id !== 'string') {
      continue;
    }

    for (const candidate of sourcebookCandidates(row.sourcebook_id)) {
      target.add(candidate);
    }
  }
};

const fetchAccessibleSourcebooks = (
  userId: string,
  campaignId: string | null
): Promise<RpcResponse> =>
  supabaseRpc.rpc('get_accessible_sourcebooks', {
    p_campaign_id: campaignId,
    p_user_id: userId,
  });

export const sourcebookCandidates = (sourceBook: string | null | undefined): string[] => {
  if (!sourceBook || sourceBook.trim().length === 0) {
    return [];
  }

  const trimmed = sourceBook.trim();
  const lower = trimmed.toLowerCase();
  const normalized = normalizeSourcebookKey(trimmed);

  const candidates = new Set<string>([trimmed, lower]);
  if (normalized) {
    candidates.add(normalized);
  }

  return Array.from(candidates);
};

export function filterRowsByAccessibleSourcebooks<T>(
  rows: T[],
  getSourcebook: (row: T) => string | null | undefined,
  accessibleSourcebooks: Set<string>
): T[] {
  if (rows.length === 0) {
    return rows;
  }

  return rows.filter((row) => {
    const sourceBook = getSourcebook(row);
    if (!sourceBook || sourceBook.trim().length === 0) {
      return true;
    }

    return sourcebookCandidates(sourceBook).some((candidate) =>
      accessibleSourcebooks.has(candidate)
    );
  });
}

export async function getAccessibleSourcebookSet(
  context: SourcebookAccessContext = {}
): Promise<Set<string> | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    logger.warn('Failed to resolve auth state for sourcebook access:', authError);
    return null;
  }

  if (!user) {
    return null;
  }

  const cacheKey = getCacheKey(user.id, context.campaignId);
  const cached = getCachedSourcebooks(cacheKey);
  if (cached) {
    return cached;
  }

  const { data, error } = await fetchAccessibleSourcebooks(
    user.id,
    context.campaignId ?? null
  );

  if (error) {
    if (isRpcUnavailableError(error.message)) {
      return null;
    }

    logger.warn('Failed to load accessible sourcebooks:', error);
    return null;
  }

  const accessible = new Set<string>();
  collectSourcebooksFromRpcData(data, accessible);

  // An empty entitlements set means the user has no explicit access records.
  // Treat this as "default / unrestricted" so SRD content is always visible.
  if (accessible.size === 0) {
    return null;
  }

  setCachedSourcebooks(cacheKey, accessible);
  return accessible;
}

export async function isSourcebookAccessible(
  sourceBook: string | null | undefined,
  context: SourcebookAccessContext = {}
): Promise<boolean> {
  if (!sourceBook || sourceBook.trim().length === 0) {
    return true;
  }

  const accessibleSourcebooks = await getAccessibleSourcebookSet(context);
  if (!accessibleSourcebooks) {
    return true;
  }

  return sourcebookCandidates(sourceBook).some((candidate) =>
    accessibleSourcebooks.has(candidate)
  );
}

export async function filterRowsBySourcebookAccess<T>(
  rows: T[],
  getSourcebook: (row: T) => string | null | undefined,
  context: SourcebookAccessContext = {}
): Promise<T[]> {
  const accessibleSourcebooks = await getAccessibleSourcebookSet(context);
  if (!accessibleSourcebooks) {
    return rows;
  }

  return filterRowsByAccessibleSourcebooks(rows, getSourcebook, accessibleSourcebooks);
}

export async function getCharacterCampaignId(characterId: string): Promise<string | null> {
  if (!isSupabaseConfigured || !UUID_PATTERN.test(characterId)) {
    return null;
  }

  const { data, error } = await supabase
    .from('campaign_members')
    .select('campaign_id, joined_at')
    .eq('character_id', characterId)
    .order('joined_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.warn('Failed to resolve campaign context for character sourcebook access:', error);
    return null;
  }

  return data?.campaign_id ?? null;
}
