import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';

export interface VTTToken {
  id: string;
  session_id: string;
  token_type: 'player' | 'monster' | 'npc' | 'object';
  name: string;
  x: number;
  y: number;
  size: number; // in grid units
  color?: string;
  image_url?: string;
  stats?: {
    hp?: number;
    max_hp?: number;
    ac?: number;
    initiative?: number;
  };
  visible_to_players: boolean;
  owned_by_user_id?: string; // User who owns this token (for player characters)
  is_dm_token: boolean; // DM can move all tokens, players can only move their owned tokens
  created_at: string;
  updated_at: string;
}

export interface VTTMapElement {
  id: string;
  session_id: string;
  element_type: 'drawing' | 'note' | 'door' | 'trap' | 'treasure';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  stroke_width?: number;
  opacity?: number;
  data: Record<string, unknown>; // For drawings, notes, etc.
  visible_to_players: boolean;
  created_at: string;
  updated_at: string;
}

export interface VTTSettings {
  id: string;
  session_id: string;
  grid_size: number;
  grid_visible: boolean;
  fog_of_war_enabled: boolean;
  dynamic_lighting_enabled: boolean;
  background_image_url?: string;
  background_color: string;
  snap_to_grid: boolean;
  zoom_level: number;
  pan_x: number;
  pan_y: number;
  updated_at: string;
}

const supabaseAny = supabase as unknown as {
  auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> };
  from: (table: string) => any;
  rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: { message?: string } | null }>;
};

export const useVTTSettings = (sessionId: string) => {
  return useQuery({
    queryKey: ['vtt', 'settings', sessionId],
    queryFn: async (): Promise<VTTSettings | null> => {
      if (!isSupabaseConfigured || !sessionId) return null;

      const { data, error } = await supabaseAny
        .from('vtt_settings')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) throw error;
      return data as VTTSettings | null;
    },
    enabled: !!sessionId,
  });
};

export const useVTTTokens = (sessionId: string) => {
  return useQuery({
    queryKey: ['vtt', 'tokens', sessionId],
    queryFn: async (): Promise<VTTToken[]> => {
      if (!isSupabaseConfigured || !sessionId) return [];

      const { data, error } = await supabaseAny
        .from('vtt_tokens')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as VTTToken[];
    },
    enabled: !!sessionId,
  });
};

export const useVTTMapElements = (sessionId: string) => {
  return useQuery({
    queryKey: ['vtt', 'elements', sessionId],
    queryFn: async (): Promise<VTTMapElement[]> => {
      if (!isSupabaseConfigured || !sessionId) return [];

      const { data, error } = await supabaseAny
        .from('vtt_map_elements')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as VTTMapElement[];
    },
    enabled: !!sessionId,
  });
};

export const useUpdateVTTSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: Partial<VTTSettings> & { session_id: string }): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { error } = await supabaseAny.rpc('update_vtt_settings', settings);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vtt', 'settings', variables.session_id] });
      toast({
        title: 'VTT settings updated',
        description: 'Virtual tabletop settings have been saved.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update VTT settings',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useCreateVTTToken = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (token: Omit<VTTToken, 'id' | 'created_at' | 'updated_at'>): Promise<{ tokenId: string }> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { data, error } = await supabaseAny.rpc('create_vtt_token', token);
      if (error) throw error;

      return { tokenId: data as string };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vtt', 'tokens', variables.session_id] });
      toast({
        title: 'Token created',
        description: 'New token has been added to the VTT.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create token',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateVTTToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { token_id: string; session_id: string } & Partial<VTTToken>): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { error } = await supabaseAny.rpc('update_vtt_token', updates);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vtt', 'tokens', variables.session_id] });
    },
  });
};

export const useDeleteVTTToken = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tokenId, sessionId }: { tokenId: string; sessionId: string }): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { error } = await supabaseAny.rpc('delete_vtt_token', { token_id: tokenId });
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vtt', 'tokens', variables.sessionId] });
      toast({
        title: 'Token deleted',
        description: 'Token has been removed from the VTT.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete token',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useCreateVTTMapElement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (element: Omit<VTTMapElement, 'id' | 'created_at' | 'updated_at'>): Promise<{ elementId: string }> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { data, error } = await supabaseAny.rpc('create_vtt_map_element', element);
      if (error) throw error;

      return { elementId: data as string };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vtt', 'elements', variables.session_id] });
    },
  });
};

export const useUpdateVTTMapElement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { element_id: string; session_id: string } & Partial<VTTMapElement>): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { error } = await supabaseAny.rpc('update_vtt_map_element', updates);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vtt', 'elements', variables.session_id] });
    },
  });
};

export const useDeleteVTTMapElement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ elementId, sessionId }: { elementId: string; sessionId: string }): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { error } = await supabaseAny.rpc('delete_vtt_map_element', { element_id: elementId });
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vtt', 'elements', variables.sessionId] });
    },
  });
};
