import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import type { Database } from '@/integrations/supabase/types';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type CampaignMember = Database['public']['Tables']['campaign_members']['Row'];

interface CampaignAnalytics {
  totalSessions: number;
  totalPlaytime: number; // in minutes
  averageSessionLength: number;
  totalCombatEncounters: number;
  totalLootDistributed: number;
  activeCharacters: number;
  memberActivity: Array<{
    member_id: string;
    member_name: string;
    sessions_participated: number;
    last_active: string;
  }>;
  levelProgression: Array<{
    character_id: string;
    character_name: string;
    starting_level: number;
    current_level: number;
    levels_gained: number;
  }>;
}

export function useCampaignAnalytics() {
  const { toast } = useToast();
  const { user } = useAuth();

  const getCampaignAnalytics = useCallback(async (campaignId: string): Promise<CampaignAnalytics | null> => {
    if (!user || !isSupabaseConfigured) {
      throw new Error('Must be logged in to view campaign analytics');
    }

    try {
      // Get campaign details
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Get campaign members with user profiles
      const { data: members } = await supabase
        .from('campaign_members')
        .select(`
          *,
          user_profiles!left(
            display_name,
            email
          )
        `)
        .eq('campaign_id', campaignId);

      // Get campaign sessions
      const { data: sessions } = await supabase
        .from('campaign_sessions')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      // Get combat sessions
      const { data: combatSessions } = await supabase
        .from('campaign_combat_sessions')
        .select('*')
        .eq('campaign_id', campaignId);

      // Get loot drops
      const { data: lootDrops } = await supabase
        .from('campaign_loot_drops')
        .select('*')
        .eq('campaign_id', campaignId);

      // Get character progression data
      const { data: characterProgression } = await supabase
        .from('campaign_member_characters')
        .select(`
          campaign_member_characters.*,
          user_characters!left(
            name as character_name
          )
        `)
        .eq('campaign_id', campaignId);

      // Calculate analytics
      const totalSessions = sessions?.length || 0;
      const totalCombatEncounters = combatSessions?.length || 0;
      const totalLootDistributed = lootDrops?.length || 0;
      
      // Calculate playtime (assuming 4 hours per session as default)
      const totalPlaytime = totalSessions * 240; // minutes
      const averageSessionLength = totalSessions > 0 ? totalPlaytime / totalSessions : 0;

      // Member activity analysis
      const memberActivity = members?.map(member => {
        const memberSessions = sessions?.filter(session => 
          session.created_by === member.user_id
        ) || [];
        
        return {
          member_id: member.id,
          member_name: (member as any).user_profiles?.display_name || 'Unknown',
          sessions_participated: memberSessions.length,
          last_active: memberSessions.length > 0 
            ? memberSessions[0].created_at 
            : member.joined_at
        };
      }) || [];

      // Level progression analysis
      const levelProgression = characterProgression?.map((char: any) => {
        // This would need to be enhanced with actual level tracking
        // For now, we'll provide basic structure
        return {
          character_id: char.character_id,
          character_name: char.user_characters?.character_name || 'Unknown',
          starting_level: 1,
          current_level: 1,
          levels_gained: 0
        };
      }) || [];

      const analytics: CampaignAnalytics = {
        totalSessions,
        totalPlaytime,
        averageSessionLength,
        totalCombatEncounters,
        totalLootDistributed,
        activeCharacters: characterProgression?.length || 0,
        memberActivity,
        levelProgression
      };

      return analytics;
    } catch (error) {
      toast({
        title: 'Error Loading Analytics',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, toast]);

  const generateCampaignReport = useCallback(async (campaignId: string): Promise<string | null> => {
    try {
      const analytics = await getCampaignAnalytics(campaignId);
      if (!analytics) return null;

      const report = `
# Campaign Analytics Report

## Overview
- Total Sessions: ${analytics.totalSessions}
- Total Playtime: ${Math.round(analytics.totalPlaytime / 60)} hours
- Average Session Length: ${Math.round(analytics.averageSessionLength)} minutes
- Combat Encounters: ${analytics.totalCombatEncounters}
- Loot Items Distributed: ${analytics.totalLootDistributed}
- Active Characters: ${analytics.activeCharacters}

## Member Activity
${analytics.memberActivity.map(member => 
  `- ${member.member_name}: ${member.sessions_participated} sessions, last active ${new Date(member.last_active).toLocaleDateString()}`
).join('\n')}

## Level Progression
${analytics.levelProgression.map(char => 
  `- ${char.character_name}: Level ${char.starting_level} → ${char.current_level} (${char.levels_gained} levels gained)`
).join('\n')}

## Session Statistics
- Sessions per month: ${Math.round(analytics.totalSessions / Math.max(1, analytics.totalPlaytime / (60 * 24 * 30)))}
- Combat frequency: ${analytics.totalSessions > 0 ? Math.round((analytics.totalCombatEncounters / analytics.totalSessions) * 100) : 0}% of sessions include combat
- Average loot per session: ${analytics.totalSessions > 0 ? Math.round(analytics.totalLootDistributed / analytics.totalSessions * 10) / 10 : 0}

Generated: ${new Date().toLocaleDateString()}
      `.trim();

      return report;
    } catch (error) {
      toast({
        title: 'Error Generating Report',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return null;
    }
  }, [getCampaignAnalytics, toast]);

  const exportAnalyticsData = useCallback(async (campaignId: string): Promise<Blob | null> => {
    try {
      const analytics = await getCampaignAnalytics(campaignId);
      if (!analytics) return null;

      const data = {
        campaign_id: campaignId,
        generated_at: new Date().toISOString(),
        generated_by: user?.id,
        analytics
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      return blob;
    } catch (error) {
      toast({
        title: 'Error Exporting Data',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return null;
    }
  }, [getCampaignAnalytics, user, toast]);

  return {
    getCampaignAnalytics,
    generateCampaignReport,
    exportAnalyticsData,
  };
}
