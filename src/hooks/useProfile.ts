import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  role: 'dm' | 'player';
  created_at: string;
  updated_at: string;
}

// Fetch current user's profile
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<Profile | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // Profile might not exist yet (for existing users)
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return (data || null) as Profile | null;
    },
    retry: false,
  });
};

// Update user profile role
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ role }: { role: 'dm' | 'player' }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({ role, updated_at: new Date().toISOString() })
          .eq('id', user.id);

        if (error) throw error;
      } else {
        // Create new profile (for existing users without profiles)
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            role,
          } as Database['public']['Tables']['profiles']['Insert']);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'is-dm'] });
      toast({
        title: 'Profile updated',
        description: 'Your role has been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update profile',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

