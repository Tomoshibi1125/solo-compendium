import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import { warn as logWarn } from '@/lib/logger';

const DEFAULT_STORAGE_PREFIX = 'solo-compendium.tool';

export const buildToolStorageKey = (toolKey: string) => `${DEFAULT_STORAGE_PREFIX}.${toolKey}`;

export const readLocalToolState = <T,>(storageKey: string): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    logWarn(`Failed to read tool state from localStorage: ${storageKey}`, error);
    return null;
  }
};

export const writeLocalToolState = <T,>(storageKey: string, state: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    logWarn(`Failed to write tool state to localStorage: ${storageKey}`, error);
  }
};

export const loadUserToolState = async <T,>(userId: string, toolKey: string): Promise<T | null> => {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await supabase
    .from('user_tool_states')
    .select('state')
    .eq('user_id', userId)
    .eq('tool_key', toolKey)
    .maybeSingle();
  if (error) {
    logWarn(`Failed to load user tool state: ${toolKey}`);
    return null;
  }
  return (data?.state as T) ?? null;
};

export const saveUserToolState = async <T,>(userId: string, toolKey: string, state: T): Promise<void> => {
  if (!isSupabaseConfigured || !userId) return;
  const { error } = await supabase
    .from('user_tool_states')
    .upsert(
      {
        user_id: userId,
        tool_key: toolKey,
        state,
      },
      { onConflict: 'user_id,tool_key' }
    );
  if (error) {
    logWarn(`Failed to save user tool state: ${toolKey}`);
  }
};

export const loadCampaignToolState = async <T,>(campaignId: string, toolKey: string): Promise<T | null> => {
  if (!isSupabaseConfigured || !campaignId) return null;
  const { data, error } = await supabase
    .from('campaign_tool_states')
    .select('state')
    .eq('campaign_id', campaignId)
    .eq('tool_key', toolKey)
    .maybeSingle();
  if (error) {
    logWarn(`Failed to load campaign tool state: ${toolKey}`);
    return null;
  }
  return (data?.state as T) ?? null;
};

export const saveCampaignToolState = async <T,>(
  campaignId: string,
  userId: string | null,
  toolKey: string,
  state: T
): Promise<void> => {
  if (!isSupabaseConfigured || !campaignId || !userId) return;
  const { error } = await supabase
    .from('campaign_tool_states')
    .upsert(
      {
        campaign_id: campaignId,
        tool_key: toolKey,
        state,
        created_by: userId,
        updated_by: userId,
      },
      { onConflict: 'campaign_id,tool_key' }
    );
  if (error) {
    logWarn(`Failed to save campaign tool state: ${toolKey}`);
  }
};

type ToolStateOptions<T> = {
  storageKey?: string;
  initialState: T;
};

type ToolStateResult<T> = {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  isLoading: boolean;
  saveNow: (nextState?: T) => Promise<void>;
  isAuthed: boolean;
};

export const useUserToolState = <T,>(toolKey: string, options: ToolStateOptions<T>): ToolStateResult<T> => {
  const { user, loading } = useAuth();
  const [state, setState] = useState<T>(options.initialState);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthed = isSupabaseConfigured && !!user?.id;
  const storageKey = options.storageKey ?? buildToolStorageKey(toolKey);

  useEffect(() => {
    if (loading) return;
    let active = true;
    const loadState = async () => {
      setIsLoading(true);
      const fallback = readLocalToolState<T>(storageKey);
      if (!isAuthed || !user?.id) {
        if (active && fallback !== null) setState(fallback);
        setIsLoading(false);
        return;
      }

      const remote = await loadUserToolState<T>(user.id, toolKey);
      if (!active) return;
      if (remote !== null) {
        setState(remote);
      } else if (fallback !== null) {
        setState(fallback);
      }
      setIsLoading(false);
    };
    void loadState();
    return () => {
      active = false;
    };
  }, [isAuthed, loading, storageKey, toolKey, user?.id]);

  const saveNow = useCallback(
    async (nextState?: T) => {
      const payload = nextState ?? state;
      if (!isAuthed || !user?.id) {
        writeLocalToolState(storageKey, payload);
        return;
      }
      await saveUserToolState(user.id, toolKey, payload);
    },
    [isAuthed, state, storageKey, toolKey, user?.id]
  );

  return { state, setState, isLoading, saveNow, isAuthed };
};

export const useCampaignToolState = <T,>(
  campaignId: string | null,
  toolKey: string,
  options: ToolStateOptions<T>
): ToolStateResult<T> => {
  const { user, loading } = useAuth();
  const [state, setState] = useState<T>(options.initialState);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthed = isSupabaseConfigured && !!user?.id;
  const storageKey = options.storageKey ?? buildToolStorageKey(`${toolKey}.${campaignId || 'unknown'}`);

  useEffect(() => {
    if (loading) return;
    let active = true;
    const loadState = async () => {
      if (!campaignId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const fallback = readLocalToolState<T>(storageKey);
      if (!isAuthed) {
        if (active && fallback !== null) setState(fallback);
        setIsLoading(false);
        return;
      }

      const remote = await loadCampaignToolState<T>(campaignId, toolKey);
      if (!active) return;
      if (remote !== null) {
        setState(remote);
      } else if (fallback !== null) {
        setState(fallback);
      }
      setIsLoading(false);
    };
    void loadState();
    return () => {
      active = false;
    };
  }, [campaignId, isAuthed, loading, storageKey, toolKey]);

  const saveNow = useCallback(
    async (nextState?: T) => {
      const payload = nextState ?? state;
      if (!campaignId) return;
      if (!isAuthed) {
        writeLocalToolState(storageKey, payload);
        return;
      }
      await saveCampaignToolState(campaignId, user?.id ?? null, toolKey, payload);
    },
    [campaignId, isAuthed, state, storageKey, toolKey, user?.id]
  );

  return { state, setState, isLoading, saveNow, isAuthed };
};
