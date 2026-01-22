import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { DEFAULT_DAILY_QUEST_TEMPLATES } from '@/lib/dailyQuests/data';
import {
  DailyQuestConfig,
  DailyQuestInstance,
  DailyQuestTemplate,
  QuestReward,
  QuestScalingSchema,
  calculateQuestReward,
  getQuestProgress,
} from '@/lib/dailyQuests/types';
import { isLocalCharacterId } from '@/lib/guestStore';
import { getProficiencyBonus } from '@/types/system-rules';
import { logger } from '@/lib/logger';

type QuestConfigForm = Pick<
  DailyQuestConfig,
  'enabled' | 'difficulty_mode' | 'reward_mode' | 'penalty_mode' | 'reroll_allowance' | 'max_active_quests' | 'custom_scaling'
>;

type QuestInstanceRow = Database['public']['Tables']['daily_quest_instances']['Row'];
type QuestConfigRow = Database['public']['Tables']['daily_quest_configs']['Row'];

const LOCAL_KEY_PREFIX = 'solo-compendium.daily-quests';

type LocalQuestState = {
  config: DailyQuestConfig;
  instances: DailyQuestInstance[];
};

const buildDefaultConfig = (characterId: string): DailyQuestConfig => ({
  id: `local-${characterId}`,
  character_id: characterId,
  campaign_id: null,
  enabled: false,
  difficulty_mode: 'normal',
  reward_mode: 'standard',
  penalty_mode: 'exhaustion',
  reroll_allowance: 0,
  max_active_quests: 3,
  custom_scaling: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const getLocalKey = (characterId: string) => `${LOCAL_KEY_PREFIX}:${characterId}`;

const loadLocalState = (characterId: string): LocalQuestState => {
  if (typeof window === 'undefined') {
    return { config: buildDefaultConfig(characterId), instances: [] };
  }
  const raw = window.localStorage.getItem(getLocalKey(characterId));
  if (!raw) {
    return { config: buildDefaultConfig(characterId), instances: [] };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<LocalQuestState>;
    return {
      config: parsed.config ? { ...buildDefaultConfig(characterId), ...parsed.config } : buildDefaultConfig(characterId),
      instances: parsed.instances || [],
    };
  } catch (error) {
    logger.warn('Failed to parse local daily quests:', error);
    return { config: buildDefaultConfig(characterId), instances: [] };
  }
};

const saveLocalState = (characterId: string, state: LocalQuestState) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getLocalKey(characterId), JSON.stringify(state));
};

const formatDateKey = (date: Date) => date.toISOString().split('T')[0];

const hashString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const normalizeReward = (reward: Record<string, unknown>): QuestReward => ({
  system_favor: typeof reward.system_favor === 'number' ? reward.system_favor : undefined,
  gold: typeof reward.gold === 'number' ? reward.gold : undefined,
  relic_shards: typeof reward.relic_shards === 'number' ? reward.relic_shards : undefined,
  experience: typeof reward.experience === 'number' ? reward.experience : undefined,
  description: typeof reward.description === 'string' ? reward.description : 'Quest reward',
  custom_rewards: typeof reward.custom_rewards === 'object' && reward.custom_rewards !== null
    ? (reward.custom_rewards as Record<string, unknown>)
    : {},
});

const buildLocalInstances = (
  characterId: string,
  characterLevel: number,
  config: DailyQuestConfig,
  templates: DailyQuestTemplate[],
  forceNew: boolean
): DailyQuestInstance[] => {
  const now = new Date();
  const dateKey = formatDateKey(now);
  const seedSource = forceNew ? `${characterId}-${dateKey}-${now.getTime()}` : `${characterId}-${dateKey}`;
  const questSeed = hashString(seedSource);
  const proficiencyBonus = getProficiencyBonus(characterLevel);

  const difficultyAdjust = config.difficulty_mode === 'easy'
    ? -1
    : config.difficulty_mode === 'hard'
      ? 1
      : config.difficulty_mode === 'extreme'
        ? 2
        : 0;

  const baseTierIndex = characterLevel <= 4 ? 1 : characterLevel <= 10 ? 2 : characterLevel <= 16 ? 3 : 4;
  const maxTierIndex = Math.min(4, Math.max(1, baseTierIndex + difficultyAdjust));
  const tierLabels = ['I', 'II', 'III', 'IV'];
  const allowedTiers = tierLabels.slice(0, maxTierIndex);

  const availableTemplates = templates.filter((template) => template.is_active && allowedTiers.includes(template.tier));
  const sortedTemplates = [...availableTemplates].sort((a, b) =>
    hashString(a.id + questSeed) - hashString(b.id + questSeed)
  );
  const selectedTemplates = sortedTemplates.slice(0, Math.max(1, config.max_active_quests || 3));

  return selectedTemplates.map((template, index) => {
    const customScaling = QuestScalingSchema.safeParse(config.custom_scaling);
    const scaling = customScaling.success ? customScaling.data : template.default_scaling;
    const rawTarget = template.requirements.target || 1;
    const targetMultiplier = config.difficulty_mode === 'easy'
      ? 0.8
      : config.difficulty_mode === 'hard'
        ? 1.2
        : config.difficulty_mode === 'extreme'
          ? 1.4
          : 1;
    const target = Math.max(1, Math.ceil(rawTarget * targetMultiplier));
    const reward = calculateQuestReward(template, scaling, characterLevel, proficiencyBonus, config.reward_mode);
    const scalingApplied = {
      multiplier: scaling.multiplier,
      base_multiplier: scaling.multiplier,
      reward_mode: config.reward_mode,
      difficulty_mode: config.difficulty_mode,
      level: characterLevel,
      proficiency_bonus: proficiencyBonus,
      reward,
      target,
    };

    return {
      id: `local-${dateKey}-${template.id}-${index}`,
      character_id: characterId,
      template_id: template.id,
      date_key: dateKey,
      assigned_at: now.toISOString(),
      expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      completed_at: null,
      status: 'pending',
      progress: {
        current: 0,
        target,
        completed: false,
        last_updated: now.toISOString(),
      },
      seed: questSeed,
      scaling_applied: scalingApplied,
      rewards_granted: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
  });
};

export function useDailyQuests(characterId: string | null, characterLevel?: number) {
  const queryClient = useQueryClient();
  const isLocal = !characterId || isLocalCharacterId(characterId) || !isSupabaseConfigured || import.meta.env.VITE_E2E === 'true';

  const templatesQuery = useQuery({
    queryKey: ['daily-quest-templates'],
    queryFn: async () => {
      if (isLocal) {
        return DEFAULT_DAILY_QUEST_TEMPLATES;
      }
      try {
        const { data, error } = await supabase
          .from('daily_quest_templates')
          .select('*')
          .eq('is_active', true);
        if (error) throw error;
        return (data || []) as DailyQuestTemplate[];
      } catch (error) {
        logger.warn('Failed to load daily quest templates, using defaults:', error);
        return DEFAULT_DAILY_QUEST_TEMPLATES;
      }
    },
  });

  const configQuery = useQuery({
    queryKey: ['daily-quest-config', characterId],
    queryFn: async () => {
      if (!characterId) return null;
      if (isLocal) {
        return loadLocalState(characterId).config;
      }
      const { data, error } = await supabase
        .from('daily_quest_configs')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return (data || null) as DailyQuestConfig | null;
    },
    enabled: !!characterId,
  });

  const instancesQuery = useQuery({
    queryKey: ['daily-quest-instances', characterId],
    queryFn: async () => {
      if (!characterId) return [];
      if (isLocal) {
        return loadLocalState(characterId).instances;
      }
      const { data, error } = await supabase
        .from('daily_quest_instances')
        .select('*')
        .eq('character_id', characterId)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      return (data || []) as DailyQuestInstance[];
    },
    enabled: !!characterId,
  });

  const upsertConfig = useMutation({
    mutationFn: async (updates: QuestConfigForm) => {
      if (!characterId) return null;
      if (isLocal) {
        const state = loadLocalState(characterId);
        const updatedConfig = {
          ...state.config,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        saveLocalState(characterId, { ...state, config: updatedConfig });
        return updatedConfig;
      }

      const { data: existing } = await supabase
        .from('daily_quest_configs')
        .select('id')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        const { data, error } = await supabase
          .from('daily_quest_configs')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
            custom_scaling: updates.custom_scaling as QuestConfigRow['custom_scaling'],
          })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return data as DailyQuestConfig;
      }

      const payload: QuestConfigRow = {
        id: crypto.randomUUID(),
        character_id: characterId,
        campaign_id: null,
        enabled: updates.enabled,
        difficulty_mode: updates.difficulty_mode,
        reward_mode: updates.reward_mode,
        penalty_mode: updates.penalty_mode,
        reroll_allowance: updates.reroll_allowance,
        max_active_quests: updates.max_active_quests,
        custom_scaling: updates.custom_scaling as QuestConfigRow['custom_scaling'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('daily_quest_configs')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as DailyQuestConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-quest-config', characterId] });
    },
  });

  const assignQuests = useMutation({
    mutationFn: async ({ forceNew = false }: { forceNew?: boolean } = {}) => {
      if (!characterId) return;
      if (isLocal) {
        const state = loadLocalState(characterId);
        if (!state.config.enabled) return;
        const level = characterLevel ?? 1;
        const newInstances = buildLocalInstances(characterId, level, state.config, templatesQuery.data || [], forceNew);
        const dateKey = formatDateKey(new Date());
        const filteredInstances = forceNew
          ? state.instances.filter((instance) => instance.date_key !== dateKey)
          : state.instances;
        saveLocalState(characterId, {
          ...state,
          instances: [...newInstances, ...filteredInstances],
        });
        return;
      }

      if (forceNew) {
        const dateKey = formatDateKey(new Date());
        await supabase
          .from('daily_quest_instances')
          .delete()
          .eq('character_id', characterId)
          .eq('date_key', dateKey);
      }

      const { error } = await supabase.rpc('assign_daily_quests', {
        p_character_id: characterId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-quest-instances', characterId] });
    },
  });

  const updateQuest = useMutation({
    mutationFn: async ({ questId, updates }: { questId: string; updates: Partial<QuestInstanceRow> }) => {
      if (!characterId) return null;
      if (isLocal) {
        const state = loadLocalState(characterId);
        const updatedInstances = state.instances.map((instance) =>
          instance.id === questId
            ? {
                ...instance,
                ...updates,
                updated_at: new Date().toISOString(),
              }
            : instance
        );
        saveLocalState(characterId, { ...state, instances: updatedInstances as DailyQuestInstance[] });
        return updatedInstances.find((instance) => instance.id === questId) || null;
      }

      const { data, error } = await supabase
        .from('daily_quest_instances')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', questId)
        .select()
        .single();
      if (error) throw error;
      return data as DailyQuestInstance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-quest-instances', characterId] });
    },
  });

  const normalizeQuestReward = useCallback((quest: DailyQuestInstance, template?: DailyQuestTemplate) => {
    const scalingReward = (quest.scaling_applied as Record<string, unknown>)?.reward;
    if (scalingReward && typeof scalingReward === 'object') {
      return normalizeReward(scalingReward as Record<string, unknown>);
    }
    if (quest.rewards_granted && typeof quest.rewards_granted === 'object') {
      return normalizeReward(quest.rewards_granted as Record<string, unknown>);
    }
    if (template && characterLevel !== undefined) {
      const scaling = template.default_scaling;
      const reward = calculateQuestReward(template, scaling, characterLevel, getProficiencyBonus(characterLevel));
      return reward;
    }
    return {
      description: 'Quest reward',
      custom_rewards: {},
    };
  }, [characterLevel]);

  return {
    templates: templatesQuery.data || [],
    templatesLoading: templatesQuery.isLoading,
    config: configQuery.data,
    configLoading: configQuery.isLoading,
    instances: instancesQuery.data || [],
    instancesLoading: instancesQuery.isLoading,
    upsertConfig: upsertConfig.mutateAsync,
    assignQuests: assignQuests.mutateAsync,
    updateQuest: updateQuest.mutateAsync,
    normalizeQuestReward,
    getQuestProgress,
  };
}

