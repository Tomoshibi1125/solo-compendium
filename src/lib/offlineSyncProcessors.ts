import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
import {
  registerOfflineSyncProcessor,
  type OfflineSyncAction,
  type OfflineSyncType,
} from '@/lib/offlineSync';
import type { SyncQueueItem } from '@/lib/offlineStorage';
import { logger } from '@/lib/logger';
import type { Database } from '@/integrations/supabase/types';

// The generated client now supports these tables via types-extension.ts
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let initialized = false;

const ensureUserContext = async (): Promise<string> => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    throw new Error('AUTH_REQUIRED');
  }
  return data.user.id;
};

const handleHomebrewCreate = async (item: SyncQueueItem) => {
  await ensureUserContext();
  const payload = { ...item.data };
  delete (payload as Record<string, unknown>).id;

  const { error } = await supabase
    .from('homebrew_content')
    .insert(payload as any as Database['public']['Tables']['homebrew_content']['Insert']);

  if (error) throw error;
};

const handleCampaignCombatUpdate = async (item: SyncQueueItem) => {
  await ensureUserContext();
  const mode = typeof item.data.mode === 'string' ? item.data.mode : 'session';
  const campaignId = typeof item.data.campaign_id === 'string' ? item.data.campaign_id : null;
  const sessionId = typeof item.data.session_id === 'string' ? item.data.session_id : null;

  if (!sessionId) {
    throw new Error('COMBAT_SESSION_ID_REQUIRED');
  }

  if (mode === 'session') {
    const updates =
      typeof item.data.updates === 'object' && item.data.updates !== null
        ? (item.data.updates as Record<string, unknown>)
        : {};

    const payload: Record<string, unknown> = {};
    if (typeof updates.status === 'string') {
      payload.status = updates.status;
    }
    if (typeof updates.round === 'number' && Number.isFinite(updates.round)) {
      payload.round = updates.round;
    }
    if (typeof updates.current_turn === 'number' && Number.isFinite(updates.current_turn)) {
      payload.current_turn = updates.current_turn;
    }

    if (Object.keys(payload).length === 0) {
      return;
    }

    let query = supabase
      .from('campaign_combat_sessions')
      .update(payload as any)
      .eq('id', sessionId);

    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }

    const { error } = await query;
    if (error) throw error;
    return;
  }

  if (mode === 'combatants') {
    if (!campaignId) {
      throw new Error('CAMPAIGN_ID_REQUIRED');
    }

    const rawCombatants = Array.isArray(item.data.combatants) ? item.data.combatants : [];
    const payload = rawCombatants
      .map((entry, index) => {
        if (typeof entry !== 'object' || entry === null) {
          return null;
        }

        const combatant = entry as Record<string, unknown>;
        const combatantId = typeof combatant.id === 'string' ? combatant.id : null;
        const name = typeof combatant.name === 'string' ? combatant.name : `Combatant ${index + 1}`;
        const initiativeValue = Number(combatant.initiative ?? 0);

        return {
          id: combatantId ?? `offline-${sessionId}-${index}`,
          campaign_id: campaignId,
          session_id: sessionId,
          name,
          initiative: Number.isFinite(initiativeValue) ? initiativeValue : 0,
          stats: combatant.stats ?? {},
          conditions: combatant.conditions ?? [],
          flags: combatant.flags ?? {},
          member_id: typeof combatant.member_id === 'string' ? combatant.member_id : null,
        };
      })
      .filter((combatant) => combatant !== null);

    const { error: clearError } = await supabase
      .from('campaign_combatants')
      .delete()
      .eq('campaign_id', campaignId)
      .eq('session_id', sessionId);

    if (clearError) {
      throw clearError;
    }

    if (payload.length === 0) {
      return;
    }

    const { error } = await supabase
      .from('campaign_combatants')
      .upsert(payload as any, { onConflict: 'id' });

    if (error) throw error;
    return;
  }

  throw new Error('UNSUPPORTED_CAMPAIGN_COMBAT_MODE');
};

const handleHomebrewUpdate = async (item: SyncQueueItem) => {
  await ensureUserContext();
  const id = typeof item.data.id === 'string' ? item.data.id : null;
  if (!id) throw new Error('HOMEBREW_ID_REQUIRED');

  if (typeof item.data.status === 'string') {
    const { error } = await supabase.rpc('set_homebrew_content_status', {
      p_homebrew_id: id,
      p_status: item.data.status,
      p_visibility_scope:
        (typeof item.data.visibility_scope === 'string'
          ? item.data.visibility_scope
          : undefined) as string | undefined,
      p_campaign_id:
        (typeof item.data.campaign_id === 'string' && UUID_PATTERN.test(item.data.campaign_id)
          ? item.data.campaign_id
          : undefined) as string | undefined,
    } as any);
    if (error) throw error;
    return;
  }

  const payload = { ...item.data } as Record<string, unknown>;
  delete payload.id;

  const { error } = await supabase
    .from('homebrew_content')
    .update(payload)
    .eq('id', id);

  if (error) throw error;
};

const handleHomebrewDelete = async (item: SyncQueueItem) => {
  await ensureUserContext();
  const id = typeof item.data.id === 'string' ? item.data.id : null;
  if (!id) throw new Error('HOMEBREW_ID_REQUIRED');

  const { error } = await supabase
    .from('homebrew_content')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

const handleMarketplaceCreate = async (item: SyncQueueItem) => {
  await ensureUserContext();
  const payload = { ...item.data };
  delete (payload as Record<string, unknown>).id;

  const { error } = await supabase
    .from('marketplace_items')
    .insert(payload as any as Database['public']['Tables']['marketplace_items']['Insert']);

  if (error) throw error;
};

const handleMarketplaceUpdate = async (item: SyncQueueItem) => {
  const userId = await ensureUserContext();
  const mode = typeof item.data.mode === 'string' ? item.data.mode : null;

  if (mode === 'download') {
    const itemId = typeof item.data.item_id === 'string' ? item.data.item_id : null;
    if (!itemId) throw new Error('MARKETPLACE_ITEM_REQUIRED');

    const { error } = await supabase.rpc('record_marketplace_download', {
      p_item_id: itemId,
      p_user_id: userId,
    });
    if (error) throw error;
    return;
  }

  if (mode === 'review') {
    const itemId = typeof item.data.item_id === 'string' ? item.data.item_id : null;
    if (!itemId) throw new Error('MARKETPLACE_ITEM_REQUIRED');

    const rating = Number(item.data.rating);
    const { error } = await supabase.rpc('upsert_marketplace_review', {
      p_item_id: itemId,
      p_rating: Number.isFinite(rating) ? rating : 5,
      p_comment: typeof item.data.comment === 'string' ? item.data.comment : undefined,
      p_user_id: userId,
    });
    if (error) throw error;
    return;
  }

  const id = typeof item.data.id === 'string' ? item.data.id : null;
  if (!id) throw new Error('MARKETPLACE_ID_REQUIRED');

  const payload = { ...item.data } as Record<string, unknown>;
  delete payload.id;

  const { error } = await supabase
    .from('marketplace_items')
    .update(payload as any as Database['public']['Tables']['marketplace_items']['Update'])
    .eq('id', id);

  if (error) throw error;
};

const handleMarketplaceDelete = async (item: SyncQueueItem) => {
  await ensureUserContext();
  const id = typeof item.data.id === 'string' ? item.data.id : null;
  if (!id) throw new Error('MARKETPLACE_ID_REQUIRED');

  const { error } = await supabase
    .from('marketplace_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

const handleCampaignSessionCreate = async (item: SyncQueueItem) => {
  await ensureUserContext();
  const mode = typeof item.data.mode === 'string' ? item.data.mode : 'session';

  if (mode === 'log') {
    const { error } = await supabase.rpc('add_campaign_session_log', {
      p_campaign_id: item.data.campaign_id as string,
      p_session_id: (item.data.session_id as string) ?? null,
      p_log_type: (item.data.log_type as 'session' | 'combat' | 'milestone') ?? 'session',
      p_title: item.data.title as string,
      p_content: item.data.content as string,
      p_metadata: (item.data.metadata as Record<string, unknown>) ?? {},
      p_is_player_visible: (item.data.is_player_visible as boolean) ?? true,
    } as any);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.rpc('upsert_campaign_session', {
    p_campaign_id: item.data.campaign_id as string,
    p_session_id:
      typeof item.data.session_id === 'string' && UUID_PATTERN.test(item.data.session_id)
        ? item.data.session_id
        : null,
    p_title: (item.data.title as string) ?? null,
    p_description: (item.data.description as string) ?? null,
    p_scheduled_for: (item.data.scheduled_for as string) ?? null,
    p_status: (item.data.status as 'scheduled' | 'active' | 'completed' | 'cancelled') ?? null,
    p_location: (item.data.location as string) ?? null,
  } as any);

  if (error) throw error;
};

const handleCampaignSessionUpdate = async (item: SyncQueueItem) => {
  await handleCampaignSessionCreate(item);
};

const handleCampaignSessionDelete = async (item: SyncQueueItem) => {
  await ensureUserContext();
  const mode = typeof item.data.mode === 'string' ? item.data.mode : 'session';
  if (mode !== 'session') {
    return;
  }

  const sessionId = typeof item.data.session_id === 'string' ? item.data.session_id : null;
  if (!sessionId) throw new Error('SESSION_ID_REQUIRED');

  const { error } = await supabase
    .from('campaign_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
};

const register = (
  type: OfflineSyncType,
  action: OfflineSyncAction,
  processor: (item: SyncQueueItem) => Promise<void>
) => {
  registerOfflineSyncProcessor(type, action, async (item) => {
    try {
      await processor(item);
    } catch (error) {
      logger.warn(`[OfflineSync] Failed ${type}:${action}`, error);
      throw error;
    }
  });
};

export const ensureOfflineSyncProcessors = () => {
  if (initialized || !isSupabaseConfigured) {
    return;
  }

  register('homebrew', 'create', handleHomebrewCreate);
  register('homebrew', 'update', handleHomebrewUpdate);
  register('homebrew', 'delete', handleHomebrewDelete);

  register('marketplace', 'create', handleMarketplaceCreate);
  register('marketplace', 'update', handleMarketplaceUpdate);
  register('marketplace', 'delete', handleMarketplaceDelete);

  register('campaign_session', 'create', handleCampaignSessionCreate);
  register('campaign_session', 'update', handleCampaignSessionUpdate);
  register('campaign_session', 'delete', handleCampaignSessionDelete);

  register('campaign_combat', 'create', handleCampaignCombatUpdate);
  register('campaign_combat', 'update', handleCampaignCombatUpdate);
  register('campaign_combat', 'delete', handleCampaignCombatUpdate);

  initialized = true;
};
