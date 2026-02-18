import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';

export interface SessionQuest {
  id: string;
  session_id: string;
  title: string;
  description: string;
  objectives: string[];
  status: 'active' | 'completed' | 'failed';
  rewards: {
    xp?: number;
    items?: string[];
    gold?: number;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface QuestCompletion {
  id: string;
  quest_id: string;
  user_id: string;
  character_id: string | null;
  completed_at: string;
  rewards_claimed: boolean;
}

const supabaseAny = supabase as unknown as {
  auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> };
  from: (table: string) => any;
  rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: { message?: string } | null }>;
};

export const useSessionQuests = (sessionId: string) => {
  return useQuery({
    queryKey: ['quests', 'session', sessionId],
    queryFn: async (): Promise<SessionQuest[]> => {
      if (!isSupabaseConfigured || !sessionId) return [];

      const { data: rows, error } = await supabaseAny
        .from('session_quests')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (rows || []) as SessionQuest[];
    },
    enabled: !!sessionId,
  });
};

export const useCreateSessionQuest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: {
      sessionId: string;
      title: string;
      description: string;
      objectives: string[];
      rewards?: {
        xp?: number;
        items?: string[];
        gold?: number;
      };
    }): Promise<{ questId: string }> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { data } = await supabaseAny.auth.getUser();
      if (!data.user) {
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      const { data: questData, error } = await supabaseAny.rpc('create_session_quest', {
        p_session_id: input.sessionId,
        p_title: input.title,
        p_description: input.description,
        p_objectives: input.objectives,
        p_rewards: input.rewards || {},
      });

      if (error) throw error;

      return { questId: questData as string };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quests', 'session', variables.sessionId] });
      toast({
        title: 'Quest created',
        description: 'New quest has been added to the session.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create quest',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useCompleteSessionQuest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: {
      questId: string;
      completionNotes?: string;
    }): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { data } = await supabaseAny.auth.getUser();
      if (!data.user) {
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      const { error } = await supabaseAny.rpc('complete_session_quest', {
        p_quest_id: input.questId,
        p_completion_notes: input.completionNotes || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      toast({
        title: 'Quest completed',
        description: 'Quest has been marked as completed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to complete quest',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useClaimQuestRewards = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: {
      questId: string;
      characterId: string;
    }): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { data } = await supabaseAny.auth.getUser();
      if (!data.user) {
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      const { error } = await supabaseAny.rpc('claim_quest_rewards', {
        p_quest_id: input.questId,
        p_character_id: input.characterId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      toast({
        title: 'Rewards claimed',
        description: 'Quest rewards have been added to your character.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to claim rewards',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
