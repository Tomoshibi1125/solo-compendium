import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { GeneratedSovereign, FusionAbility } from '@/lib/geminiProtocol';
import { AppError } from '@/lib/appError';

export interface SavedSovereign {
  id: string;
  name: string;
  title: string;
  description: string;
  fusion_theme: string;
  fusion_description: string;
  fusion_method: string;
  power_multiplier: string;
  fusion_stability: string;
  job_id: string;
  path_id: string;
  monarch_a_id: string;
  monarch_b_id: string;
  abilities: FusionAbility[];
  created_by: string;
  created_at: string;
  is_public: boolean;
  likes_count: number;
}

export function useSavedSovereigns() {
  return useQuery({
    queryKey: ['saved-sovereigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_sovereigns')
        .select(`
          *,
          job:compendium_jobs(name),
          path:compendium_job_paths(name),
          monarch_a:compendium_monarchs!saved_sovereigns_monarch_a_id_fkey(name, title, theme),
          monarch_b:compendium_monarchs!saved_sovereigns_monarch_b_id_fkey(name, title, theme)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    retry: false, // Don't retry on errors
  });
}

export function useMySovereigns() {
  return useQuery({
    queryKey: ['my-sovereigns'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return []; // Return empty array if not authenticated
      
      const { data, error } = await supabase
        .from('saved_sovereigns')
        .select(`
          *,
          job:compendium_jobs(name),
          path:compendium_job_paths(name),
          monarch_a:compendium_monarchs!saved_sovereigns_monarch_a_id_fkey(name, title, theme),
          monarch_b:compendium_monarchs!saved_sovereigns_monarch_b_id_fkey(name, title, theme)
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveSovereign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sovereign: GeneratedSovereign) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Must be logged in to save Sovereigns', 'AUTH_REQUIRED');

      const insertData = {
        name: sovereign.name,
        title: sovereign.title,
        description: sovereign.description,
        fusion_theme: sovereign.fusion_theme,
        fusion_description: sovereign.fusion_description,
        fusion_method: sovereign.fusion_method,
        power_multiplier: sovereign.power_multiplier,
        fusion_stability: sovereign.fusion_stability,
        job_id: sovereign.job.id,
        path_id: sovereign.path.id,
        monarch_a_id: sovereign.monarchA.id,
        monarch_b_id: sovereign.monarchB.id,
        abilities: JSON.parse(JSON.stringify(sovereign.abilities)),
        created_by: user.id,
      };

      const { data, error } = await supabase
        .from('saved_sovereigns')
        .insert(insertData as never)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-sovereigns'] });
      queryClient.invalidateQueries({ queryKey: ['my-sovereigns'] });
      toast({
        title: 'Sovereign Saved!',
        description: 'Your fusion has been preserved in the Gemini Archive.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Save Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteSovereign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sovereignId: string) => {
      const { error } = await supabase
        .from('saved_sovereigns')
        .delete()
        .eq('id', sovereignId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-sovereigns'] });
      queryClient.invalidateQueries({ queryKey: ['my-sovereigns'] });
      toast({
        title: 'Sovereign Deleted',
        description: 'The fusion has been removed from the archive.',
      });
    },
  });
}
