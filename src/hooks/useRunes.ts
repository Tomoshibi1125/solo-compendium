import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { calculateRuneMaxUses } from '@/lib/runeAutomation';
import { getProficiencyBonus } from '@/types/solo-leveling';
import { isLocalCharacterId } from '@/lib/guestStore';

type Rune = Database['public']['Tables']['compendium_runes']['Row'];
type RuneInscription = Database['public']['Tables']['character_rune_inscriptions']['Row'];
type RuneKnowledge = Database['public']['Tables']['character_rune_knowledge']['Row'];
type Equipment = Database['public']['Tables']['character_equipment']['Row'];

// Fetch all compendium runes
export function useCompendiumRunes() {
  return useQuery({
    queryKey: ['compendium-runes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_runes')
        .select('*')
        .order('rune_level', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Rune[];
    },
  });
}

// Fetch runes a character knows
export function useCharacterRuneKnowledge(characterId: string | undefined) {
  return useQuery({
    queryKey: ['character-rune-knowledge', characterId],
    queryFn: async () => {
      if (!characterId) return [];
      if (isLocalCharacterId(characterId)) return [];

      const { data, error } = await supabase
        .from('character_rune_knowledge')
        .select(`
          *,
          rune:compendium_runes(*)
        `)
        .eq('character_id', characterId);

      if (error) throw error;
      return data.map(rk => ({
        ...rk,
        rune: rk.rune as Rune,
      })) as Array<RuneKnowledge & { rune: Rune }>;
    },
    enabled: !!characterId,
  });
}

// Fetch runes inscribed on character equipment
export function useCharacterRuneInscriptions(characterId: string | undefined) {
  return useQuery({
    queryKey: ['character-rune-inscriptions', characterId],
    queryFn: async () => {
      if (!characterId) return [];
      if (isLocalCharacterId(characterId)) return [];

      const { data, error } = await supabase
        .from('character_rune_inscriptions')
        .select(`
          *,
          rune:compendium_runes(*),
          equipment:character_equipment(*)
        `)
        .eq('character_id', characterId)
        .eq('is_active', true);

      if (error) throw error;
      return data.map(ri => ({
        ...ri,
        rune: ri.rune as Rune,
        equipment: ri.equipment as Equipment,
      })) as Array<RuneInscription & { rune: Rune; equipment: Equipment }>;
    },
    enabled: !!characterId,
  });
}

// Fetch runes on specific equipment
export function useEquipmentRunes(equipmentId: string | undefined) {
  return useQuery({
    queryKey: ['equipment-runes', equipmentId],
    queryFn: async () => {
      if (!equipmentId) return [];
      if (equipmentId.startsWith('local_')) return [];

      const { data, error } = await supabase
        .from('character_rune_inscriptions')
        .select(`
          *,
          rune:compendium_runes(*)
        `)
        .eq('equipment_id', equipmentId)
        .eq('is_active', true);

      if (error) throw error;
      return data.map(ri => ({
        ...ri,
        rune: ri.rune as Rune,
      })) as Array<RuneInscription & { rune: Rune }>;
    },
    enabled: !!equipmentId,
  });
}

// Inscribe a rune on equipment
export function useInscribeRune() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      equipmentId,
      runeId,
      inscribedBy,
      characterLevel,
    }: {
      characterId: string;
      equipmentId: string;
      runeId: string;
      inscribedBy?: string;
      characterLevel: number;
    }) => {
      if (isLocalCharacterId(characterId)) {
        throw new Error('Sign in required to inscribe runes');
      }

      // Get rune to check inscription difficulty
      const { data: rune, error: runeError } = await supabase
        .from('compendium_runes')
        .select('*')
        .eq('id', runeId)
        .single();

      if (runeError || !rune) throw new Error('Rune not found');

      // Calculate max uses
      const proficiencyBonus = getProficiencyBonus(characterLevel);
      const maxUses = calculateRuneMaxUses(
        rune.uses_per_rest,
        characterLevel,
        proficiencyBonus
      );
      const initialUses = maxUses === -1 ? 0 : maxUses;

      const { data, error } = await supabase
        .from('character_rune_inscriptions')
        .insert({
          character_id: characterId,
          equipment_id: equipmentId,
          rune_id: runeId,
          inscribed_by: inscribedBy || 'Self',
          inscription_quality: 10, // Default quality, can be enhanced with skill checks
          uses_max: maxUses === -1 ? null : maxUses,
          uses_current: initialUses,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to character knowledge if not already known
      await supabase
        .from('character_rune_knowledge')
        .upsert({
          character_id: characterId,
          rune_id: runeId,
          learned_from: 'inscribed',
        }, {
          onConflict: 'character_id,rune_id',
        });

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-rune-inscriptions', variables.characterId] });
      queryClient.invalidateQueries({ queryKey: ['equipment-runes', variables.equipmentId] });
      queryClient.invalidateQueries({ queryKey: ['character-rune-knowledge', variables.characterId] });
      queryClient.invalidateQueries({ queryKey: ['equipment', variables.characterId] });
    },
  });
}

// Remove rune inscription
export function useRemoveRuneInscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inscriptionId }: { inscriptionId: string }) => {
      if (inscriptionId.startsWith('local_')) {
        throw new Error('Sign in required to remove rune inscriptions');
      }

      const { error } = await supabase
        .from('character_rune_inscriptions')
        .delete()
        .eq('id', inscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character-rune-inscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['equipment-runes'] });
    },
  });
}

// Toggle rune active status
export function useToggleRuneActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inscriptionId, isActive }: { inscriptionId: string; isActive: boolean }) => {
      if (inscriptionId.startsWith('local_')) {
        throw new Error('Sign in required to toggle rune inscriptions');
      }

      const { error } = await supabase
        .from('character_rune_inscriptions')
        .update({ is_active: isActive })
        .eq('id', inscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character-rune-inscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['equipment-runes'] });
    },
  });
}

// Use a rune (consume one use on a rune inscription, if tracked)
export function useUseRune() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inscriptionId }: { inscriptionId: string }) => {
      if (inscriptionId.startsWith('local_')) {
        throw new Error('Sign in required to use rune inscriptions');
      }

      const { data: inscription, error } = await supabase
        .from('character_rune_inscriptions')
        .select('id, character_id, uses_current, uses_max, times_used')
        .eq('id', inscriptionId)
        .single();

      if (error) throw error;
      if (!inscription) throw new Error('Rune inscription not found');

      const timesUsed = (inscription.times_used || 0) + 1;

      // If uses are not tracked (null max), treat as unlimited and just increment times_used
      if (inscription.uses_max === null) {
        const { error: updateError } = await supabase
          .from('character_rune_inscriptions')
          .update({ times_used: timesUsed })
          .eq('id', inscriptionId);

        if (updateError) throw updateError;
        return { characterId: inscription.character_id, usesCurrent: inscription.uses_current, usesMax: inscription.uses_max };
      }

      const currentUses = inscription.uses_current ?? inscription.uses_max ?? 0;
      if (currentUses <= 0) {
        throw new Error('No uses remaining');
      }

      const newUses = Math.max(0, currentUses - 1);

      const { error: updateError } = await supabase
        .from('character_rune_inscriptions')
        .update({ uses_current: newUses, times_used: timesUsed })
        .eq('id', inscriptionId);

      if (updateError) throw updateError;
      return { characterId: inscription.character_id, usesCurrent: newUses, usesMax: inscription.uses_max };
    },
    onSuccess: (_data, variables) => {
      // Invalidate broad queries (we don't always have equipmentId available here)
      queryClient.invalidateQueries({ queryKey: ['character-rune-inscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['equipment-runes'] });
      // Note: characterId-scoped invalidation is handled by the broad invalidation above.
    },
  });
}

// Learn a rune (add to knowledge)
export function useLearnRune() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      runeId,
      isMastered = false,
    }: {
      characterId: string;
      runeId: string;
      isMastered?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('character_rune_knowledge')
        .upsert({
          character_id: characterId,
          rune_id: runeId,
          mastery_level: isMastered ? 5 : 1,
          can_teach: isMastered,
        }, {
          onConflict: 'character_id,rune_id',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-rune-knowledge', variables.characterId] });
    },
  });
}

// Check if character meets rune requirements
export function checkRuneRequirements(
  rune: Rune,
  characterAbilities: Record<string, number>,
  characterJob: string | null,
  characterLevel: number
): { canUse: boolean; penalties: string[]; requirementMultiplier: number } {
  const penalties: string[] = [];
  let requirementMultiplier = 1.0;

  // Check level requirement
  if (characterLevel < rune.requires_level) {
    return { canUse: false, penalties: [`Requires level ${rune.requires_level}`], requirementMultiplier: 1.0 };
  }

  // Check if job is natural user
  const isNaturalUser = rune.requires_job?.includes(characterJob || '') || false;

  // Determine if cross-learning penalty applies
  const isCaster = ['Mage', 'Esper', 'Healer', 'Herald'].includes(characterJob || '');
  const isMartial = !isCaster && characterJob !== null;
  
  let needsCrossLearning = false;
  if (isCaster && rune.rune_type === 'martial') {
    needsCrossLearning = !isNaturalUser;
    requirementMultiplier = Number(rune.caster_requirement_multiplier || 1.5);
    if (rune.caster_penalty) penalties.push(rune.caster_penalty);
  } else if (isMartial && rune.rune_type === 'caster') {
    needsCrossLearning = !isNaturalUser;
    requirementMultiplier = Number(rune.martial_requirement_multiplier || 1.5);
    if (rune.martial_penalty) penalties.push(rune.martial_penalty);
  }

  // Check ability score requirements
  const requirements = [
    { ability: 'STR', score: rune.requirement_str || 0 },
    { ability: 'AGI', score: rune.requirement_agi || 0 },
    { ability: 'VIT', score: rune.requirement_vit || 0 },
    { ability: 'INT', score: rune.requirement_int || 0 },
    { ability: 'SENSE', score: rune.requirement_sense || 0 },
    { ability: 'PRE', score: rune.requirement_pre || 0 },
  ];

  for (const req of requirements) {
    if (req.score > 0) {
      const requiredScore = Math.ceil(req.score * requirementMultiplier);
      const actualScore = characterAbilities[req.ability] || 0;
      
      if (actualScore < requiredScore) {
        return {
          canUse: false,
          penalties: [`Requires ${req.ability} ${requiredScore} (have ${actualScore})`],
          requirementMultiplier,
        };
      }
    }
  }

  return { canUse: true, penalties, requirementMultiplier };
}

