import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth/authContext';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MarketplaceItem = Database['public']['Tables']['marketplace_items']['Row'];
type UserMarketplaceEntitlement = Database['public']['Tables']['user_marketplace_entitlements']['Row'];

interface LicenseCheck {
  itemId: string;
  hasEntitlement: boolean;
  licenseType: string;
  expiresAt: string | null;
  isExpired: boolean;
}

interface ContentUsage {
  contentId: string;
  contentType: string;
  usageType: 'view' | 'download' | 'share' | 'modify';
  timestamp: string;
  userId: string;
}

export function useLicenseEnforcement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [licenseChecks, setLicenseChecks] = useState<Record<string, LicenseCheck>>({});
  const [isLoading, setIsLoading] = useState(false);

  const checkLicense = useCallback(async (itemId: string): Promise<LicenseCheck> => {
    if (!user || !isSupabaseConfigured) {
      return {
        itemId,
        hasEntitlement: false,
        licenseType: 'none',
        expiresAt: null,
        isExpired: false
      };
    }

    try {
      // Check if user has entitlement for this item
      const { data: entitlement, error: entitlementError } = await supabase
        .from('user_marketplace_entitlements')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .single();

      if (entitlementError && entitlementError.code !== 'PGRST116') {
        throw entitlementError;
      }

      // Get marketplace item details
      const { data: item, error: itemError } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (itemError) {
        throw itemError;
      }

      const now = new Date();
      const expiresAt = entitlement?.expires_at ? new Date(entitlement.expires_at) : null;
      const isExpired = expiresAt ? expiresAt < now : false;

      const licenseCheck: LicenseCheck = {
        itemId,
        hasEntitlement: !!entitlement && !isExpired,
        licenseType: (entitlement?.entitlement_type as string) || 'none',
        expiresAt: entitlement?.expires_at || null,
        isExpired
      };

      // Cache the result
      setLicenseChecks(prev => ({
        ...prev,
        [itemId]: licenseCheck
      }));

      return licenseCheck;
    } catch (error) {
      console.error('License check failed:', error);
      return {
        itemId,
        hasEntitlement: false,
        licenseType: 'error',
        expiresAt: null,
        isExpired: false
      };
    }
  }, [user, isSupabaseConfigured]);

  const enforceLicense = useCallback(async (
    itemId: string,
    usageType: 'view' | 'download' | 'share' | 'modify' = 'view'
  ): Promise<boolean> => {
    const licenseCheck = await checkLicense(itemId);

    if (!licenseCheck.hasEntitlement) {
      toast({
        title: 'Access Denied',
        description: 'You do not have a valid license for this content. Please purchase it from the marketplace.',
        variant: 'destructive'
      });
      return false;
    }

    if (licenseCheck.isExpired) {
      toast({
        title: 'License Expired',
        description: 'Your license for this content has expired. Please renew it to continue using this feature.',
        variant: 'destructive'
      });
      return false;
    }

    // Check usage restrictions based on license type
    const licenseType = licenseCheck.licenseType;
    const restrictedUsage: Record<string, string[]> = {
      'trial': ['download', 'share', 'modify'],
      'personal': ['share', 'modify'],
      'commercial': [], // No restrictions for commercial licenses
      'educational': ['modify'],
      'none': ['view', 'download', 'share', 'modify']
    };

    const restrictedActions = restrictedUsage[licenseType];
    if (restrictedActions && restrictedActions.includes(usageType)) {
      toast({
        title: 'Usage Restricted',
        description: `Your ${licenseType} license does not permit ${usageType} usage of this content.`,
        variant: 'destructive'
      });
      return false;
    }

    // Log the usage for analytics
    await logContentUsage(itemId, usageType);

    return true;
  }, [checkLicense, toast]);

  const logContentUsage = useCallback(async (
    contentId: string,
    usageType: string
  ) => {
    if (!user || !isSupabaseConfigured) {
      return;
    }

    try {
      // Log to ai_usage_logs table as a fallback since content_usage_logs doesn't exist
      await supabase
        .from('ai_usage_logs')
        .insert({
          user_id: user.id,
          service_id: 'marketplace',
          request_type: usageType,
          metadata: {
            content_id: contentId,
            usage_type: usageType
          },
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      // Don't fail the operation if logging fails
      console.error('Failed to log content usage:', error);
    }
  }, [user, isSupabaseConfigured]);

  const batchCheckLicenses = useCallback(async (itemIds: string[]): Promise<Record<string, LicenseCheck>> => {
    if (!user || !isSupabaseConfigured || itemIds.length === 0) {
      return {};
    }

    setIsLoading(true);
    try {
      // Batch fetch all entitlements for these items
      const { data: entitlements, error: entitlementError } = await supabase
        .from('user_marketplace_entitlements')
        .select('*')
        .eq('user_id', user.id)
        .in('item_id', itemIds);

      if (entitlementError) {
        throw entitlementError;
      }

      // Batch fetch all marketplace items
      const { data: items, error: itemError } = await supabase
        .from('marketplace_items')
        .select('*')
        .in('id', itemIds);

      if (itemError) {
        throw itemError;
      }

      const now = new Date();
      const results: Record<string, LicenseCheck> = {};

      items.forEach((item) => {
        const entitlement = entitlements?.find(e => e.item_id === item.id);
        const expiresAt = entitlement?.expires_at ? new Date(entitlement.expires_at) : null;
        const isExpired = expiresAt ? expiresAt < now : false;

        results[item.id] = {
          itemId: item.id,
          hasEntitlement: !!entitlement && !isExpired,
          licenseType: (entitlement?.entitlement_type as string) || 'none',
          expiresAt: entitlement?.expires_at || null,
          isExpired
        };
      });

      setLicenseChecks(prev => ({ ...prev, ...results }));
      return results;
    } catch (error) {
      toast({
        title: 'License Check Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [user, isSupabaseConfigured, toast]);

  const getLicenseInfo = useCallback((itemId: string): LicenseCheck | null => {
    return licenseChecks[itemId] || null;
  }, [licenseChecks]);

  const isContentAccessible = useCallback((itemId: string): boolean => {
    const licenseCheck = licenseChecks[itemId];
    return licenseCheck ? licenseCheck.hasEntitlement && !licenseCheck.isExpired : false;
  }, [licenseChecks]);

  const getLicenseBadge = useCallback((itemId: string): { text: string; variant: 'default' | 'secondary' | 'destructive' } => {
    const licenseCheck = licenseChecks[itemId];
    
    if (!licenseCheck) {
      return { text: 'Not Checked', variant: 'secondary' as const };
    }

    if (licenseCheck.isExpired) {
      return { text: 'Expired', variant: 'destructive' as const };
    }

    if (!licenseCheck.hasEntitlement) {
      return { text: 'No License', variant: 'destructive' as const };
    }

    switch (licenseCheck.licenseType) {
      case 'commercial':
        return { text: 'Commercial', variant: 'default' as const };
      case 'educational':
        return { text: 'Educational', variant: 'default' as const };
      case 'personal':
        return { text: 'Personal', variant: 'secondary' as const };
      case 'trial':
        return { text: 'Trial', variant: 'secondary' as const };
      default:
        return { text: 'Unknown', variant: 'secondary' as const };
    }
  }, [licenseChecks]);

  // Preload licenses for user's entitled items
  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      return;
    }

    const preloadLicenses = async () => {
      try {
        const { data: entitlements } = await supabase
          .from('user_marketplace_entitlements')
          .select('item_id')
          .eq('user_id', user.id);

        if (entitlements && entitlements.length > 0) {
          await batchCheckLicenses(entitlements.map(e => e.item_id));
        }
      } catch (error) {
        console.error('Failed to preload licenses:', error);
      }
    };

    preloadLicenses();
  }, [user, isSupabaseConfigured, batchCheckLicenses]);

  return {
    licenseChecks,
    isLoading,
    checkLicense,
    enforceLicense,
    batchCheckLicenses,
    logContentUsage,
    getLicenseInfo,
    isContentAccessible,
    getLicenseBadge
  };
}
