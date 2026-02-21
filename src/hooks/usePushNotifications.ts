import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

type PushPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

interface PushNotificationState {
  permission: PushPermissionState;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  isLoading: boolean;
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

interface CampaignNotificationOptions {
  campaignId: string;
  type: 'combat_start' | 'combat_end' | 'character_update' | 'session_reminder' | 'dm_message' | 'roll_result';
  title: string;
  body: string;
  data?: Record<string, any>;
}

export function usePushNotifications() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [state, setState] = useState<PushNotificationState>({
    permission: 'default',
    isSubscribed: false,
    subscription: null,
    isLoading: false
  });

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      
      setState(prev => ({
        ...prev,
        permission: supported ? 'default' : 'unsupported'
      }));
      
      if (supported) {
        // Get current permission status
        Notification.requestPermission().then(result => {
          setState(prev => ({
            ...prev,
            permission: result as PushPermissionState
          }));
        });
      }
    };

    checkSupport();
  }, []);

  // Request permission for push notifications
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (state.permission === 'unsupported') {
      toast({
        title: 'Push Not Supported',
        description: 'Your browser does not support push notifications',
        variant: 'destructive'
      });
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await Notification.requestPermission();
      
      setState(prev => ({
        ...prev,
        permission: result as PushPermissionState,
        isLoading: false
      }));
      
      if (result === 'granted') {
        toast({
          title: 'Notifications Enabled',
          description: 'Push notifications have been enabled',
        });
        return true;
      } else {
        toast({
          title: 'Notifications Blocked',
          description: 'Push notifications have been blocked. Please enable them in your browser settings.',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Permission Request Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return false;
    }
  }, [state.permission, toast]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!user || state.permission !== 'granted') {
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.ready;
      
      // Subscribe to push
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || '') as any
      });

      const subscriptionData: PushSubscription = {
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: pushSubscription.getKey('p256dh') ? arrayBufferToBase64(pushSubscription.getKey('p256dh')!) : '',
          auth: pushSubscription.getKey('auth') ? arrayBufferToBase64(pushSubscription.getKey('auth')!) : ''
        }
      };

      // Save subscription to backend
      await saveSubscriptionToBackend(subscriptionData);
      
      setState(prev => ({
        ...prev,
        subscription: subscriptionData,
        isSubscribed: true,
        isLoading: false
      }));

      toast({
        title: 'Successfully Subscribed',
        description: 'You will now receive push notifications',
      });

      return true;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Subscription Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return false;
    }
  }, [user, state.permission, toast]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.isSubscribed || !state.subscription) {
      return true;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.getSubscription();
      
      if (pushSubscription) {
        await pushSubscription.unsubscribe();
      }

      // Remove subscription from backend
      await removeSubscriptionFromBackend(state.subscription.endpoint);
      
      setState(prev => ({
        ...prev,
        subscription: null,
        isSubscribed: false,
        isLoading: false
      }));

      toast({
        title: 'Unsubscribed',
        description: 'You will no longer receive push notifications',
      });

      return true;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Unsubscribe Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return false;
    }
  }, [state.isSubscribed, state.subscription, toast]);

  // Send campaign-specific notification
  const sendCampaignNotification = useCallback(async (options: CampaignNotificationOptions): Promise<boolean> => {
    if (!state.isSubscribed || !state.subscription) {
      toast({
        title: 'Not Subscribed',
        description: 'Please subscribe to push notifications first',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const response = await fetch('/api/push/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: state.subscription,
          payload: {
            title: options.title,
            body: options.body,
            icon: '/icon-192.png',
            tag: `campaign_${options.campaignId}_${options.type}`,
            data: {
              ...options.data,
              campaignId: options.campaignId,
              type: options.type,
              userId: user?.id
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send campaign notification');
      }

      toast({
        title: 'Campaign Notification Sent',
        description: `Notification sent for ${options.type}`,
      });

      return true;
    } catch (error) {
      toast({
        title: 'Notification Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      return false;
    }
  }, [state.isSubscribed, state.subscription, user, toast]);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    if (!state.isSubscribed) {
      toast({
        title: 'Not Subscribed',
        description: 'Please subscribe to push notifications first',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('/api/push/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: state.subscription,
          payload: {
            title: 'Test Notification',
            body: 'This is a test push notification from System Ascendant',
            icon: '/icon-192.png',
            tag: 'test'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      toast({
        title: 'Test Notification Sent',
        description: 'Check your notifications for the test message',
      });
    } catch (error) {
      toast({
        title: 'Test Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    }
  }, [state.isSubscribed, state.subscription, toast]);

  // Save subscription to backend
  const saveSubscriptionToBackend = useCallback(async (subscriptionData: PushSubscription) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      // Use ai_usage_logs as fallback since push_subscriptions doesn't exist
      const { error } = await supabase
        .from('ai_usage_logs')
        .insert({
          user_id: user.id,
          service_id: 'push_notifications',
          request_type: 'subscription',
          metadata: {
            endpoint: subscriptionData.endpoint,
            p256dh: subscriptionData.keys.p256dh,
            auth: subscriptionData.keys.auth
          },
          timestamp: new Date().toISOString()
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      logger.error('Failed to save subscription to backend:', error);
      throw error;
    }
  }, [user, isSupabaseConfigured]);

  // Remove subscription from backend
  const removeSubscriptionFromBackend = useCallback(async (endpoint: string) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      // Use ai_usage_logs as fallback since push_subscriptions doesn't exist
      const { error } = await supabase
        .from('ai_usage_logs')
        .delete()
        .eq('user_id', user.id)
        .eq('service_id', 'push_notifications')
        .eq('request_type', 'subscription');

      if (error) {
        throw error;
      }
    } catch (error) {
      logger.error('Failed to remove subscription from backend:', error);
      throw error;
    }
  }, [user, isSupabaseConfigured]);

  // Check current subscription status
  const checkSubscriptionStatus = useCallback(async () => {
    if (!user || state.permission === 'unsupported') return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.getSubscription();
      
      if (pushSubscription) {
        const subscriptionData: PushSubscription = {
          endpoint: pushSubscription.endpoint,
          keys: {
            p256dh: pushSubscription.getKey('p256dh') ? arrayBufferToBase64(pushSubscription.getKey('p256dh')!) : '',
            auth: pushSubscription.getKey('auth') ? arrayBufferToBase64(pushSubscription.getKey('auth')!) : ''
          }
        };
        
        setState(prev => ({
          ...prev,
          subscription: subscriptionData,
          isSubscribed: true
        }));
      } else {
        setState(prev => ({
          ...prev,
          subscription: null,
          isSubscribed: false
        }));
      }
    } catch (error) {
      logger.error('Failed to check subscription status:', error);
    }
  }, [user, state.permission]);

  // Auto-check subscription status on mount
  useEffect(() => {
    if (user && state.permission !== 'unsupported') {
      checkSubscriptionStatus();
    }
  }, [user, state.permission, checkSubscriptionStatus]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    sendCampaignNotification,
    sendTestNotification,
    checkSubscriptionStatus
  };
}

// Utility function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Utility function to convert URL base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
