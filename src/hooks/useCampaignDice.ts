import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import type { Database } from '@/integrations/supabase/types';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type CampaignMember = Database['public']['Tables']['campaign_members']['Row'];

export function useCampaignDice() {
  const { toast } = useToast();
  const { user } = useAuth();

  const getCampaignsForRolling = useCallback(async () => {
    if (!user || !isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('campaign_details')
      .select(`
        id,
        name,
        campaign_members!inner(
          user_id,
          role
        )
      `)
      .or(`campaign_members.user_id.eq.${user.id},created_by.eq.${user.id}`);

    if (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }

    return data || [];
  }, [user]);

  const rollInCampaign = useCallback(async (
    campaignId: string,
    rollData: {
      dice_formula: string;
      result: number;
      roll_type: string;
      rolls: number[];
      context?: string;
      modifiers?: any;
      character_id?: string;
    }
  ) => {
    if (!user || !isSupabaseConfigured) {
      toast({
        title: 'Error',
        description: 'Must be logged in to roll in campaign',
        variant: 'destructive'
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('roll_history')
        .insert({
          ...rollData,
          campaign_id: campaignId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Send to campaign chat
      await supabase
        .from('campaign_messages')
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          message_type: 'roll',
          content: `${rollData.context || 'Roll'}: ${rollData.dice_formula} = ${rollData.result}`,
          metadata: {
            roll_data: rollData
          }
        });

      toast({
        title: 'Roll Recorded',
        description: `Roll added to campaign`,
      });

      return data;
    } catch (error) {
      toast({
        title: 'Roll Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, toast]);

  return {
    getCampaignsForRolling,
    rollInCampaign,
  };
}
