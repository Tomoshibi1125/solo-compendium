import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, logErrorWithContext } from '@/lib/errorHandling';
import type { CharacterWithAbilities } from './useCharacters';

export interface SavedCharacterTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  character_data: Partial<CharacterWithAbilities>;
  is_public: boolean;
  share_code?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Fetch user's saved character templates
 */
export const useSavedTemplates = () => {
  return useQuery({
    queryKey: ['character-templates'],
    queryFn: async (): Promise<SavedCharacterTemplate[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('character_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        logErrorWithContext(error, 'useSavedTemplates');
        throw error;
      }
      return (data || []) as SavedCharacterTemplate[];
    },
    retry: false,
  });
};

/**
 * Fetch public templates
 */
export const usePublicTemplates = () => {
  return useQuery({
    queryKey: ['character-templates', 'public'],
    queryFn: async (): Promise<SavedCharacterTemplate[]> => {
      const { data, error } = await supabase
        .from('character_templates')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        logErrorWithContext(error, 'usePublicTemplates');
        throw error;
      }
      return (data || []) as SavedCharacterTemplate[];
    },
  });
};

/**
 * Fetch template by share code
 */
export const useTemplateByShareCode = (shareCode: string | null) => {
  return useQuery({
    queryKey: ['character-templates', 'share', shareCode],
    queryFn: async (): Promise<SavedCharacterTemplate | null> => {
      if (!shareCode) return null;

      const { data, error } = await supabase
        .from('character_templates')
        .select('*')
        .eq('share_code', shareCode.toUpperCase())
        .maybeSingle();

      if (error) {
        logErrorWithContext(error, 'useTemplateByShareCode');
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return (data || null) as SavedCharacterTemplate | null;
    },
    enabled: !!shareCode,
  });
};

/**
 * Save a character as a template
 */
export const useSaveTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      character,
      isPublic = false,
      tags = [],
    }: {
      name: string;
      description?: string;
      character: CharacterWithAbilities;
      isPublic?: boolean;
      tags?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Extract template data (exclude user-specific fields)
      const templateData = {
        name,
        description: description || null,
        character_data: {
          name: character.name,
          job: character.job,
          path: character.path,
          background: character.background,
          level: character.level,
          abilities: character.abilities,
          appearance: character.appearance,
          backstory: character.backstory,
          // Include other relevant fields
        },
        is_public: isPublic,
        tags: tags.length > 0 ? tags : null,
        user_id: user.id,
      };

      // Generate share code if public
      let shareCode: string | undefined;
      if (isPublic) {
        const { data: codeData } = await supabase.rpc('generate_share_code');
        shareCode = codeData as string;
        templateData.share_code = shareCode;
      }

      const { data, error } = await supabase
        .from('character_templates')
        .insert(templateData)
        .select()
        .single();

      if (error) {
        logErrorWithContext(error, 'useSaveTemplate');
        throw error;
      }

      return { ...data, share_code: shareCode } as SavedCharacterTemplate;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['character-templates'] });
      if (data.is_public) {
        queryClient.invalidateQueries({ queryKey: ['character-templates', 'public'] });
      }
      toast({
        title: 'Template saved',
        description: data.is_public && data.share_code
          ? `Template saved and shared! Share code: ${data.share_code}`
          : 'Template saved successfully.',
      });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useSaveTemplate');
      toast({
        title: 'Failed to save template',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Delete a template
 */
export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (templateId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('character_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', user.id);

      if (error) {
        logErrorWithContext(error, 'useDeleteTemplate');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character-templates'] });
      queryClient.invalidateQueries({ queryKey: ['character-templates', 'public'] });
      toast({
        title: 'Template deleted',
        description: 'Template has been removed.',
      });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useDeleteTemplate');
      toast({
        title: 'Failed to delete template',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

/**
 * Update template
 */
export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      isPublic,
      tags,
    }: {
      id: string;
      name?: string;
      description?: string;
      isPublic?: boolean;
      tags?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (isPublic !== undefined) {
        updates.is_public = isPublic;
        // Generate share code if making public
        if (isPublic) {
          const { data: codeData } = await supabase.rpc('generate_share_code');
          updates.share_code = codeData as string;
        } else {
          updates.share_code = null;
        }
      }
      if (tags !== undefined) updates.tags = tags.length > 0 ? tags : null;

      const { data, error } = await supabase
        .from('character_templates')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        logErrorWithContext(error, 'useUpdateTemplate');
        throw error;
      }

      return data as SavedCharacterTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character-templates'] });
      queryClient.invalidateQueries({ queryKey: ['character-templates', 'public'] });
      toast({
        title: 'Template updated',
        description: 'Template has been updated.',
      });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useUpdateTemplate');
      toast({
        title: 'Failed to update template',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

