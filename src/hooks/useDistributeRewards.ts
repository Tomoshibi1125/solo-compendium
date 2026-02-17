import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';
import { logger } from '@/lib/logger';

export interface RewardDistribution {
  campaignId: string;
  encounterXP: number;
  characterIds: string[];
  sessionId?: string | null;
}

/**
 * Distribute XP evenly across party members after an encounter ends.
 * Each character receives floor(totalXP / partySize).
 */
export const useDistributeRewards = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: RewardDistribution) => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      const { campaignId, encounterXP, characterIds } = input;
      if (characterIds.length === 0) {
        throw new AppError('No characters to distribute XP to', 'INVALID_INPUT');
      }

      const xpPerCharacter = Math.floor(encounterXP / characterIds.length);
      if (xpPerCharacter <= 0) {
        throw new AppError('XP per character is zero', 'INVALID_INPUT');
      }

      // Fetch current XP for each character
      const { data: characters, error: fetchError } = await supabase
        .from('characters')
        .select('id, name, experience')
        .in('id', characterIds);

      if (fetchError) throw fetchError;
      if (!characters || characters.length === 0) {
        throw new AppError('No characters found', 'NOT_FOUND');
      }

      // Update each character's XP
      const results: { id: string; name: string; oldXP: number; newXP: number }[] = [];

      for (const char of characters) {
        const oldXP = char.experience || 0;
        const newXP = oldXP + xpPerCharacter;

        const { error: updateError } = await supabase
          .from('characters')
          .update({ experience: newXP })
          .eq('id', char.id);

        if (updateError) {
          logger.error(`Failed to update XP for character ${char.id}:`, updateError);
          continue;
        }

        results.push({
          id: char.id,
          name: char.name,
          oldXP,
          newXP,
        });
      }

      return {
        totalXP: encounterXP,
        xpPerCharacter,
        results,
      };
    },
    onSuccess: (data) => {
      // Invalidate character queries so XP updates are reflected
      for (const result of data.results) {
        queryClient.invalidateQueries({ queryKey: ['character', result.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['characters'] });

      toast({
        title: 'XP Distributed',
        description: `${data.xpPerCharacter} XP awarded to ${data.results.length} character${data.results.length !== 1 ? 's' : ''}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to distribute XP',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
