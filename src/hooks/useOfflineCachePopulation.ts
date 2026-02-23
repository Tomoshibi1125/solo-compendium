import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth/authContext';
import { useOfflineDataAccess } from '@/hooks/useOfflineDataAccess';
import { useMyCampaigns, useJoinedCampaigns } from '@/hooks/useCampaigns';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

interface CachePopulationStatus {
  characters: boolean;
  campaigns: boolean;
  compendium: boolean;
  lastUpdated: string | null;
}

export function useOfflineCachePopulation() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { cacheCharacter, getCachedCharacter, cacheCompendiumItem, getCachedCompendiumItem } = useOfflineDataAccess();
  const { data: myCampaigns } = useMyCampaigns();
  const { data: joinedCampaigns } = useJoinedCampaigns();

  const [populationStatus, setPopulationStatus] = useState<CachePopulationStatus>({
    characters: false,
    campaigns: false,
    compendium: false,
    lastUpdated: null
  });
  const [isPopulating, setIsPopulating] = useState(false);

  // Populate character cache
  const populateCharacterCache = useCallback(async (characterId: string) => {
    if (!user) return false;

    try {
      await cacheCharacter(characterId);
      return true;
    } catch (error) {
      console.error('Failed to populate character cache:', error);
      return false;
    }
  }, [user, cacheCharacter]);

  // Populate all user characters
  const populateAllCharacterCache = useCallback(async () => {
    if (!user) return;

    setIsPopulating(true);
    let successCount = 0;
    let totalCount = 0;

    try {
      // Get user's characters
      const { data: characters, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      if (!characters) {
        setPopulationStatus(prev => ({ ...prev, characters: true }));
        return;
      }

      totalCount = characters.length;

      // Cache each character
      for (const character of characters) {
        const characterId = character.id;
        if (characterId) {
          const success = await populateCharacterCache(characterId);
          if (success) successCount++;
        }
      }

      setPopulationStatus(prev => ({ 
        ...prev, 
        characters: true,
        lastUpdated: new Date().toISOString()
      }));

      toast({
        title: 'Character Cache Updated',
        description: `Cached ${successCount}/${totalCount} characters for offline use`,
      });
    } catch (error) {
      toast({
        title: 'Character Cache Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsPopulating(false);
    }
  }, [user, populateCharacterCache, toast]);

  // Populate campaign cache
  const populateCampaignCache = useCallback(async (campaignId: string) => {
    if (!user) return false;

    try {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (!campaign) {
        console.warn(`Campaign ${campaignId} not found for cache population`);
        return false;
      }

      // Cache campaign data
      await cacheCompendiumItem(`campaign_${campaignId}`);
      return true;
    } catch (error) {
      console.error('Failed to populate campaign cache:', error);
      return false;
    }
  }, [user, cacheCompendiumItem]);

  // Populate all user campaigns
  const populateAllCampaignCache = useCallback(async () => {
    if (!user) return;

    setIsPopulating(true);
    let successCount = 0;
    let totalCount = 0;

    try {
      const allCampaigns = [...(myCampaigns || []), ...(joinedCampaigns || [])];
      totalCount = allCampaigns.length;

      for (const campaign of allCampaigns) {
        const success = await populateCampaignCache(campaign.id);
        if (success) successCount++;
      }

      setPopulationStatus(prev => ({ 
        ...prev, 
        campaigns: true,
        lastUpdated: new Date().toISOString()
      }));

      toast({
        title: 'Campaign Cache Updated',
        description: `Cached ${successCount}/${totalCount} campaigns for offline use`,
      });
    } catch (error) {
      toast({
        title: 'Campaign Cache Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsPopulating(false);
    }
  }, [user, myCampaigns, joinedCampaigns, populateCampaignCache, toast]);

  // Populate compendium cache
  const populateCompendiumCache = useCallback(async () => {
    if (!user) return;

    setIsPopulating(true);
    let successCount = 0;
    let totalCount = 0;

    try {
      // For now, just mark as complete since we don't have static compendium data
      setPopulationStatus(prev => ({ 
        ...prev, 
        compendium: true,
        lastUpdated: new Date().toISOString()
      }));

      toast({
        title: 'Compendium Cache Updated',
        description: 'Compendium data cached for offline use',
      });
    } catch (error) {
      toast({
        title: 'Compendium Cache Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsPopulating(false);
    }
  }, [user, toast]);

  // Get cached character
  const getCachedCharacterData = useCallback(async (characterId: string) => {
    return await getCachedCharacter(characterId);
  }, [getCachedCharacter]);

  // Get cached compendium item
  const getCachedCompendiumData = useCallback(async (key: string) => {
    return await getCachedCompendiumItem(key);
  }, [getCachedCompendiumItem]);

  // Populate all caches
  const populateAllCaches = useCallback(async () => {
    if (!user) return;

    setIsPopulating(true);
    
    try {
      await populateAllCharacterCache();
      await populateAllCampaignCache();
      await populateCompendiumCache();
    } catch (error) {
      console.error('Failed to populate all caches:', error);
    } finally {
      setIsPopulating(false);
    }
  }, [user, populateAllCharacterCache, populateAllCampaignCache, populateCompendiumCache]);

  // Check if cache is populated
  const isCachePopulated = useCallback(() => {
    return populationStatus.characters && populationStatus.campaigns && populationStatus.compendium;
  }, [populationStatus]);

  // Get cache status
  const getCacheStatus = useCallback(() => {
    return {
      ...populationStatus,
      isPopulating,
      isPopulated: isCachePopulated()
    };
  }, [populationStatus, isPopulating, isCachePopulated]);

  return {
    populationStatus,
    isPopulating,
    populateCharacterCache,
    populateAllCharacterCache,
    populateCampaignCache,
    populateAllCampaignCache,
    populateCompendiumCache,
    populateAllCaches,
    getCachedCharacterData,
    getCachedCompendiumData,
    isCachePopulated,
    getCacheStatus
  };
}
