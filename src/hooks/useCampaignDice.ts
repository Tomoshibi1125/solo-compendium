import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import type { Database } from '@/integrations/supabase/types';
import { AIServiceManager } from '@/lib/ai/aiService';

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

    const isOfflineMode = typeof navigator !== 'undefined' && !navigator.onLine;

    try {
      if (isOfflineMode) {
        const { enqueueRoll } = await import('@/lib/offlineSyncQueue');
        await enqueueRoll({
          ...rollData,
          campaign_id: campaignId,
          user_id: user.id,
        });
        toast({
          title: 'Roll Saved Offline',
          description: `Roll will sync when reconnected`,
        });
        return { ...rollData, id: crypto.randomUUID() };
      }

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

      // AI Automated Combat Resolution
      // We do this non-blocking or at least after the roll is registered
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('settings')
        .eq('id', campaignId)
        .single();

      if (!campaignError && campaignData?.settings) {
        const settings = campaignData.settings as Record<string, any>;
        if (settings.automated_combat === true && (rollData.roll_type === 'attack' || rollData.context?.toLowerCase().includes('attack'))) {
          // Fire and forget the AI narrative generation
          (async () => {
            try {
              const aiManager = new AIServiceManager();
              const prompt = `A character just performed an attack roll.
Context: ${rollData.context || 'Standard Attack'}
Roll Result: ${rollData.result} (Formula: ${rollData.dice_formula})
Generate a brief (1-2 sentences), hyper-flavorful, cinematic description of this attack occurring in the dark-fantasy System Ascendant universe. Do not include mechanical numbers in the narrative.`;

              const response = await aiManager.processRequest({
                service: 'gemini-proxy',
                type: 'generate-content',
                input: prompt,
              });

              if (response.success && response.data) {
                const content = typeof response.data === 'string' ? response.data : response.data.content;
                if (content) {
                  await supabase
                    .from('campaign_messages')
                    .insert({
                      campaign_id: campaignId,
                      user_id: user.id,
                      message_type: 'system',
                      content: `**Warden AI:** ${content}`
                    });
                }
              }
            } catch (err) {
              console.error('Failed to generate AI combat narrative:', err);
            }
          })();
        }
      }

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
