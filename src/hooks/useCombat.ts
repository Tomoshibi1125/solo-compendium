import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';

export interface CombatParticipant {
  id: string;
  session_id: string;
  character_id: string | null;
  user_id: string | null;
  name: string;
  initiative: number;
  current_hp: number;
  max_hp: number;
  ac: number;
  status: 'alive' | 'dead' | 'unconscious';
  is_player: boolean;
  turn_order: number;
  created_at: string;
  updated_at: string;
}

export interface CombatAction {
  id: string;
  combat_id: string;
  participant_id: string;
  action_type: 'attack' | 'spell' | 'ability' | 'movement' | 'other';
  description: string;
  damage_dealt?: number;
  healing_done?: number;
  created_at: string;
}

const supabaseAny = supabase as unknown as {
  auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> };
  from: (table: string) => any;
  rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: { message?: string } | null }>;
};

export const useCombatParticipants = (sessionId: string) => {
  return useQuery({
    queryKey: ['combat', 'participants', sessionId],
    queryFn: async (): Promise<CombatParticipant[]> => {
      if (!isSupabaseConfigured || !sessionId) return [];

      const { data: rows, error } = await supabaseAny
        .from('combat_participants')
        .select('*')
        .eq('session_id', sessionId)
        .order('turn_order', { ascending: true });

      if (error) throw error;
      return (rows || []) as CombatParticipant[];
    },
    enabled: !!sessionId,
  });
};

export const useStartCombat = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: {
      sessionId: string;
      participants: Array<{
        character_id?: string;
        user_id?: string;
        name: string;
        initiative: number;
        current_hp: number;
        max_hp: number;
        ac: number;
        is_player: boolean;
      }>;
    }): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { data } = await supabaseAny.auth.getUser();
      if (!data.user) {
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      const { error } = await supabaseAny.rpc('start_session_combat', {
        p_session_id: input.sessionId,
        p_participants: input.participants,
      });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['combat'] });
      toast({
        title: 'Combat started',
        description: 'Initiative has been rolled and combat is now active.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to start combat',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useAdvanceCombatTurn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sessionId: string): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { error } = await supabaseAny.rpc('advance_combat_turn', {
        p_session_id: sessionId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combat'] });
      toast({
        title: 'Turn advanced',
        description: 'Next participant\'s turn.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to advance turn',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const usePerformCombatAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      sessionId: string;
      participantId: string;
      action: {
        type: 'attack' | 'spell' | 'ability' | 'movement' | 'other';
        description: string;
        damage_dealt?: number;
        healing_done?: number;
      };
    }): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { error } = await supabaseAny
        .from('combat_actions')
        .insert({
          session_id: input.sessionId,
          participant_id: input.participantId,
          action_type: input.action.type,
          description: input.action.description,
          damage_dealt: input.action.damage_dealt || null,
          healing_done: input.action.healing_done || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combat'] });
    },
  });
};

export const useEndCombat = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sessionId: string): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { error } = await supabaseAny.rpc('end_session_combat', {
        p_session_id: sessionId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combat'] });
      toast({
        title: 'Combat ended',
        description: 'The combat encounter has concluded.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to end combat',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
