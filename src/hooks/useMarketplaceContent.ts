import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth/authContext';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MarketplaceItem = Database['public']['Tables']['marketplace_items']['Row'];
type UserMarketplaceEntitlement = Database['public']['Tables']['user_marketplace_entitlements']['Row'];

interface MarketplaceContent {
  items: MarketplaceItem[];
  entitlements: UserMarketplaceEntitlement[];
}

interface InjectedContent {
  jobs: any[];
  paths: any[];
  spells: any[];
  items: any[];
  features: any[];
}

export function useMarketplaceContent() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [marketplaceContent, setMarketplaceContent] = useState<MarketplaceContent>({
    items: [],
    entitlements: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchMarketplaceContent = useCallback(async () => {
    if (!user || !isSupabaseConfigured) {
      return;
    }

    setIsLoading(true);
    try {
      // Fetch marketplace items and user entitlements
      const [itemsResult, entitlementsResult] = await Promise.all([
        supabase
          .from('marketplace_items')
          .select('*')
          .eq('is_active', true),
        supabase
          .from('user_marketplace_entitlements')
          .select('*')
          .eq('user_id', user.id)
      ]);

      const content: MarketplaceContent = {
        items: itemsResult.data || [],
        entitlements: entitlementsResult.data || []
      };

      setMarketplaceContent(content);
    } catch (error) {
      toast({
        title: 'Failed to Load Marketplace Content',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchMarketplaceContent();
  }, [fetchMarketplaceContent]);

  // Transform marketplace items to compendium format
  const transformMarketplaceJob = (item: MarketplaceItem) => ({
    id: `marketplace_${item.id}`,
    name: item.title,
    description: item.description,
    hitDie: (item.content as any)?.hit_die || 'd8',
    primaryAbility: (item.content as any)?.primary_ability || 'STR',
    savingThrows: (item.content as any)?.saving_throws || [],
    skills: (item.content as any)?.skills || [],
    equipment: (item.content as any)?.equipment || [],
    features: (item.content as any)?.features || [],
    levels: (item.content as any)?.levels || [],
    source: 'marketplace',
    marketplaceId: item.id,
    price: (item.content as any)?.price || 0,
    creator: item.author_id,
    license: (item.content as any)?.license_type || 'personal'
  });

  const transformMarketplacePath = (item: MarketplaceItem) => ({
    id: `marketplace_${item.id}`,
    name: item.title,
    description: item.description,
    requirements: (item.content as any)?.requirements || [],
    features: (item.content as any)?.features || [],
    levels: (item.content as any)?.levels || [],
    source: 'marketplace',
    marketplaceId: item.id,
    price: (item.content as any)?.price || 0,
    creator: item.author_id,
    license: (item.content as any)?.license_type || 'personal'
  });

  const transformMarketplaceSpell = (item: MarketplaceItem) => ({
    id: `marketplace_${item.id}`,
    name: item.title,
    description: item.description,
    level: (item.content as any)?.level || 1,
    school: (item.content as any)?.school || 'evocation',
    castingTime: (item.content as any)?.casting_time || '1 action',
    range: (item.content as any)?.range || 'Self',
    components: (item.content as any)?.components || ['V'],
    duration: (item.content as any)?.duration || 'Instantaneous',
    atHigherLevels: (item.content as any)?.at_higher_levels || '',
    source: 'marketplace',
    marketplaceId: item.id,
    price: (item.content as any)?.price || 0,
    creator: item.author_id,
    license: (item.content as any)?.license_type || 'personal'
  });

  const transformMarketplaceItem = (item: MarketplaceItem) => ({
    id: `marketplace_${item.id}`,
    name: item.title,
    description: item.description,
    type: (item.content as any)?.type || 'equipment',
    rarity: (item.content as any)?.rarity || 'common',
    properties: (item.content as any)?.properties || [],
    requirements: (item.content as any)?.requirements || [],
    source: 'marketplace',
    marketplaceId: item.id,
    price: (item.content as any)?.price || 0,
    creator: item.author_id,
    license: (item.content as any)?.license_type || 'personal'
  });

  const transformMarketplaceFeature = (item: MarketplaceItem) => ({
    id: `marketplace_${item.id}`,
    name: item.title,
    description: item.description,
    type: (item.content as any)?.type || 'feature',
    requirements: (item.content as any)?.requirements || [],
    benefits: (item.content as any)?.benefits || [],
    source: 'marketplace',
    marketplaceId: item.id,
    price: (item.content as any)?.price || 0,
    creator: item.author_id,
    license: (item.content as any)?.license_type || 'personal'
  });

  const injectMarketplaceContent = useCallback((baseContent: any): InjectedContent => {
    if (!user || !isSupabaseConfigured) {
      return baseContent;
    }

    // Get user's entitled marketplace items
    const entitledItemIds = marketplaceContent.entitlements.map(e => e.item_id);
    const entitledItems = marketplaceContent.items.filter(item => 
      entitledItemIds.includes(item.id)
    );

    // Separate content by type
    const jobs = entitledItems
      .filter(item => item.category === 'job')
      .map(transformMarketplaceJob);

    const paths = entitledItems
      .filter(item => item.category === 'path')
      .map(transformMarketplacePath);

    const spells = entitledItems
      .filter(item => item.category === 'spell')
      .map(transformMarketplaceSpell);

    const items = entitledItems
      .filter(item => item.category === 'item')
      .map(transformMarketplaceItem);

    const features = entitledItems
      .filter(item => item.category === 'feature')
      .map(transformMarketplaceFeature);

    // Inject marketplace content into base content
    const injectedContent: InjectedContent = {
      jobs: [...(baseContent.jobs || []), ...jobs],
      paths: [...(baseContent.paths || []), ...paths],
      spells: [...(baseContent.spells || []), ...spells],
      items: [...(baseContent.items || []), ...items],
      features: [...(baseContent.features || []), ...features]
    };

    return injectedContent;
  }, [user, marketplaceContent, isSupabaseConfigured]);

  const hasEntitlement = useCallback((itemId: string): boolean => {
    return marketplaceContent.entitlements.some(e => e.item_id === itemId);
  }, [marketplaceContent.entitlements]);

  const getMarketplaceJobs = useCallback(() => {
    return marketplaceContent.items
      .filter(item => item.category === 'job' && hasEntitlement(item.id))
      .map(transformMarketplaceJob);
  }, [marketplaceContent.items, hasEntitlement]);

  const getMarketplacePaths = useCallback(() => {
    return marketplaceContent.items
      .filter(item => item.category === 'path' && hasEntitlement(item.id))
      .map(transformMarketplacePath);
  }, [marketplaceContent.items, hasEntitlement]);

  const getMarketplaceSpells = useCallback(() => {
    return marketplaceContent.items
      .filter(item => item.category === 'spell' && hasEntitlement(item.id))
      .map(transformMarketplaceSpell);
  }, [marketplaceContent.items, hasEntitlement]);

  const getMarketplaceItems = useCallback(() => {
    return marketplaceContent.items
      .filter(item => item.category === 'item' && hasEntitlement(item.id))
      .map(transformMarketplaceItem);
  }, [marketplaceContent.items, hasEntitlement]);

  const getMarketplaceFeatures = useCallback(() => {
    return marketplaceContent.items
      .filter(item => item.category === 'feature' && hasEntitlement(item.id))
      .map(transformMarketplaceFeature);
  }, [marketplaceContent.items, hasEntitlement]);

  return {
    marketplaceContent,
    isLoading,
    fetchMarketplaceContent,
    injectMarketplaceContent,
    hasEntitlement,
    getMarketplaceJobs,
    getMarketplacePaths,
    getMarketplaceSpells,
    getMarketplaceItems,
    getMarketplaceFeatures
  };
}
