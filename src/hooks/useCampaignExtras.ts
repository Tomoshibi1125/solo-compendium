import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, logErrorWithContext } from '@/lib/errorHandling';

export type CampaignExtra = Database['public']['Tables']['campaign_extras']['Row'];
export type CampaignExtraInsert = Database['public']['Tables']['campaign_extras']['Insert'];
export type CampaignExtraUpdate = Database['public']['Tables']['campaign_extras']['Update'];

export const useCampaignExtras = (campaignId: string | null) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: extras = [], isLoading } = useQuery({
        queryKey: ['campaign_extras', campaignId],
        queryFn: async () => {
            if (!campaignId) return [];

            const { data, error } = await supabase
                .from('campaign_extras')
                .select('*')
                .eq('campaign_id', campaignId)
                .order('name', { ascending: true });

            if (error) {
                logErrorWithContext(error, 'useCampaignExtras.query');
                throw error;
            }

            return (data || []) as CampaignExtra[];
        },
        enabled: !!campaignId,
    });

    const addExtra = useMutation({
        mutationFn: async (extra: Omit<CampaignExtraInsert, 'campaign_id'>) => {
            if (!campaignId) throw new Error('No active campaign');

            const { data, error } = await supabase
                .from('campaign_extras')
                .insert({
                    ...extra,
                    campaign_id: campaignId,
                })
                .select()
                .single();

            if (error) {
                logErrorWithContext(error, 'useCampaignExtras.addExtra');
                throw error;
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaign_extras', campaignId] });
            toast({ title: 'Added extra to campaign' });
        },
        onError: (error) => {
            logErrorWithContext(error, 'useCampaignExtras.addExtra');
            toast({
                title: 'Failed to add extra',
                description: getErrorMessage(error),
                variant: 'destructive',
            });
        },
    });

    const updateExtra = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: CampaignExtraUpdate }) => {
            const { data, error } = await supabase
                .from('campaign_extras')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                logErrorWithContext(error, 'useCampaignExtras.updateExtra');
                throw error;
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaign_extras', campaignId] });
        },
        onError: (error) => {
            logErrorWithContext(error, 'useCampaignExtras.updateExtra');
            toast({
                title: 'Failed to update extra',
                description: getErrorMessage(error),
                variant: 'destructive',
            });
        },
    });

    const removeExtra = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('campaign_extras')
                .delete()
                .eq('id', id);

            if (error) {
                logErrorWithContext(error, 'useCampaignExtras.removeExtra');
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaign_extras', campaignId] });
        },
        onError: (error) => {
            logErrorWithContext(error, 'useCampaignExtras.removeExtra');
            toast({
                title: 'Failed to remove extra',
                description: getErrorMessage(error),
                variant: 'destructive',
            });
        },
    });

    return {
        extras,
        isLoading,
        addExtra: addExtra.mutateAsync,
        updateExtra: updateExtra.mutateAsync,
        removeExtra: removeExtra.mutateAsync,
    };
};
