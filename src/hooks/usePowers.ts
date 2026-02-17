import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, logErrorWithContext } from '@/lib/errorHandling';
import {
  addLocalPower,
  isLocalCharacterId,
  listLocalPowers,
  removeLocalPower,
  updateLocalPower,
} from '@/lib/guestStore';
import {
  filterRowsBySourcebookAccess,
  getCharacterCampaignId,
  isSourcebookAccessible,
} from '@/lib/sourcebookAccess';

type Power = Database['public']['Tables']['character_powers']['Row'];
type PowerInsert = Database['public']['Tables']['character_powers']['Insert'];
type PowerUpdate = Database['public']['Tables']['character_powers']['Update'];

export const usePowers = (characterId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: powers = [], isLoading } = useQuery({
    queryKey: ['powers', characterId],
    queryFn: async () => {
      if (isLocalCharacterId(characterId)) {
        return listLocalPowers(characterId) as Power[];
      }

      const { data, error } = await supabase
        .from('character_powers')
        .select('*')
        .eq('character_id', characterId)
        .order('display_order', { ascending: true })
        .order('power_level', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        logErrorWithContext(error, 'usePowers');
        throw error;
      }

      const powers = (data || []) as Power[];
      if (powers.length === 0) {
        return powers;
      }

      const uniqueNames = Array.from(new Set(powers.map((power) => power.name).filter(Boolean)));
      if (uniqueNames.length === 0) {
        return powers;
      }

      const { data: compendiumPowers, error: compendiumError } = await supabase
        .from('compendium_powers')
        .select('name, source_book')
        .in('name', uniqueNames);

      if (compendiumError) {
        logErrorWithContext(compendiumError, 'usePowers (compendium source lookup)');
        return powers;
      }

      const sourceBookByName = new Map<string, string | null>();
      (compendiumPowers || []).forEach((power) => {
        sourceBookByName.set(power.name, power.source_book ?? null);
      });

      if (sourceBookByName.size === 0) {
        return powers;
      }

      const campaignId = await getCharacterCampaignId(characterId);
      const accessibleCompendiumPowers = await filterRowsBySourcebookAccess(
        (compendiumPowers || []) as Array<{ name: string; source_book: string | null }>,
        (power) => power.source_book,
        { campaignId }
      );
      const accessibleNames = new Set(accessibleCompendiumPowers.map((power) => power.name));

      return powers.filter((power) => {
        if (!sourceBookByName.has(power.name)) {
          return true;
        }

        return accessibleNames.has(power.name);
      });
    },
    enabled: !!characterId,
  });

  const addPower = useMutation({
    mutationFn: async (power: PowerInsert) => {
      if (isLocalCharacterId(characterId)) {
        addLocalPower(characterId, power as unknown as Omit<PowerInsert, 'character_id'>);
        return null;
      }

      const campaignId = await getCharacterCampaignId(characterId);
      const { data: compendiumPower, error: compendiumError } = await supabase
        .from('compendium_powers')
        .select('source_book')
        .eq('name', power.name)
        .limit(1)
        .maybeSingle();

      if (compendiumError) {
        logErrorWithContext(compendiumError, 'usePowers.addPower (compendium source lookup)');
      }

      if (
        compendiumPower &&
        !(await isSourcebookAccessible(compendiumPower.source_book, { campaignId }))
      ) {
        throw new Error('This power requires sourcebook access.');
      }

      const { data, error } = await supabase
        .from('character_powers')
        .insert({ ...power, character_id: characterId });
      if (error) {
        logErrorWithContext(error, 'usePowers.addPower');
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['powers', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'usePowers.addPower');
      toast({
        title: 'Failed to add power',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const updatePower = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PowerUpdate }) => {
      if (isLocalCharacterId(characterId)) {
        updateLocalPower(id, updates);
        return null;
      }

      if (Object.prototype.hasOwnProperty.call(updates, 'is_prepared')) {
        const campaignId = await getCharacterCampaignId(characterId);
        const { data: existingPower, error: existingPowerError } = await supabase
          .from('character_powers')
          .select('name')
          .eq('id', id)
          .maybeSingle();

        if (existingPowerError) {
          logErrorWithContext(existingPowerError, 'usePowers.updatePower (power lookup)');
        }

        if (existingPower?.name) {
          const { data: compendiumPower, error: compendiumError } = await supabase
            .from('compendium_powers')
            .select('source_book')
            .eq('name', existingPower.name)
            .limit(1)
            .maybeSingle();

          if (compendiumError) {
            logErrorWithContext(compendiumError, 'usePowers.updatePower (compendium source lookup)');
          }

          if (
            compendiumPower &&
            !(await isSourcebookAccessible(compendiumPower.source_book, { campaignId }))
          ) {
            throw new Error('This power requires sourcebook access.');
          }
        }
      }

      const { data, error } = await supabase
        .from('character_powers')
        .update(updates)
        .eq('id', id);
      if (error) {
        logErrorWithContext(error, 'usePowers.updatePower');
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['powers', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'usePowers.updatePower');
      toast({
        title: 'Failed to update power',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const removePower = useMutation({
    mutationFn: async (id: string) => {
      if (isLocalCharacterId(characterId)) {
        removeLocalPower(id);
        return;
      }

      const { error } = await supabase
        .from('character_powers')
        .delete()
        .eq('id', id);
      if (error) {
        logErrorWithContext(error, 'usePowers.removePower');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['powers', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'usePowers.removePower');
      toast({
        title: 'Failed to remove power',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const reorderPowers = useMutation({
    mutationFn: async (newOrder: { id: string; display_order: number }[]) => {
      if (isLocalCharacterId(characterId)) {
        for (const { id, display_order } of newOrder) {
          updateLocalPower(id, { display_order });
        }
        return;
      }

      const updates = newOrder.map(({ id, display_order }) =>
        supabase
          .from('character_powers')
          .update({ display_order })
          .eq('id', id)
      );
      
      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error).map(r => r.error);
      
      if (errors.length > 0) {
        const error = errors[0];
        logErrorWithContext(error, 'usePowers.reorderPowers');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['powers', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'usePowers.reorderPowers');
      toast({
        title: 'Failed to reorder powers',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const preparedCount = powers.filter(p => p.is_prepared).length;
  const concentrationPower = powers.find(p => p.concentration && p.is_prepared);

  return {
    powers,
    isLoading,
    addPower: addPower.mutateAsync,
    updatePower: updatePower.mutateAsync,
    removePower: removePower.mutateAsync,
    reorderPowers: reorderPowers.mutateAsync,
    preparedCount,
    concentrationPower,
  };
};


