import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import { logger } from '@/lib/logger';

type PushPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

interface PushNotificationState {
  permission: PushPermissionState;
  isSubscribed: boolean;
  isSupported: boolean;
}

/**
 * Hook for managing push notification subscription lifecycle.
 * Requests permission, subscribes via PushManager, and stores
 * the subscription endpoint in Supabase for server-side sending.
 *
 * Requires VITE_VAPID_PUBLIC_KEY in environment variables.
 */
export function usePushNotifications() {
  const { user } = useAuth();
  const [state, setState] = useState<PushNotificationState>({
    permission: 'default',
    isSubscribed: false,
    isSupported: false,
  });

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;

    setState((prev) => ({
      ...prev,
      isSupported: supported,
      permission: supported
        ? (Notification.permission as PushPermissionState)
        : 'unsupported',
    }));

    if (supported && Notification.permission === 'granted') {
      checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setState((prev) => ({ ...prev, isSubscribed: !!subscription }));
    } catch (error) {
      logger.warn('[Push] Failed to check existing subscription:', error);
    }
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      logger.warn('[Push] Push notifications not supported');
      return false;
    }

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      setState((prev) => ({
        ...prev,
        permission: permission as PushPermissionState,
      }));

      if (permission !== 'granted') {
        logger.log('[Push] Permission denied');
        return false;
      }

      // Get VAPID key from environment
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        logger.warn('[Push] VITE_VAPID_PUBLIC_KEY not configured');
        return false;
      }

      // Subscribe via PushManager
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
      });

      // Store subscription in Supabase
      if (isSupabaseConfigured && user?.id) {
        const subscriptionJson = subscription.toJSON();
        const { error } = await (supabase as any)
          .from('push_subscriptions')
          .upsert(
            {
              user_id: user.id,
              endpoint: subscriptionJson.endpoint,
              keys: subscriptionJson.keys,
              created_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,endpoint' }
          );

        if (error) {
          logger.warn('[Push] Failed to store subscription:', error);
        }
      }

      setState((prev) => ({ ...prev, isSubscribed: true }));
      logger.log('[Push] Successfully subscribed');
      return true;
    } catch (error) {
      logger.error('[Push] Subscription failed:', error);
      return false;
    }
  }, [state.isSupported, user?.id]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Remove from Supabase
        if (isSupabaseConfigured && user?.id) {
          await (supabase as any)
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.id)
            .eq('endpoint', subscription.endpoint);
        }
      }

      setState((prev) => ({ ...prev, isSubscribed: false }));
      logger.log('[Push] Successfully unsubscribed');
      return true;
    } catch (error) {
      logger.error('[Push] Unsubscribe failed:', error);
      return false;
    }
  }, [user?.id]);

  return {
    ...state,
    subscribe,
    unsubscribe,
  };
}

/**
 * Convert a URL-safe base64 VAPID key to a Uint8Array
 * for use with PushManager.subscribe().
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
