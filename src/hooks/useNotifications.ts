import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  read: boolean;
  createdAt: number;
  expiresAt?: number;
  category?: string; // e.g., 'character', 'campaign', 'system'
}

const STORAGE_KEY = 'solo-compendium-notifications';
const MAX_NOTIFICATIONS = 100;
const DEFAULT_EXPIRY_DAYS = 30;

/**
 * Load notifications from localStorage
 */
function loadNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const notifications = JSON.parse(stored) as Notification[];
    const now = Date.now();
    
    // Filter out expired notifications
    return notifications.filter(n => {
      if (n.expiresAt && n.expiresAt < now) {
        return false;
      }
      return true;
    });
  } catch (error) {
    logger.error('Failed to load notifications:', error);
    return [];
  }
}

/**
 * Save notifications to localStorage
 */
function saveNotifications(notifications: Notification[]): void {
  try {
    // Keep only the most recent notifications
    const toSave = notifications
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, MAX_NOTIFICATIONS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    logger.error('Failed to save notifications:', error);
  }
}

/**
 * Hook for managing notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() => loadNotifications());

  // Load notifications on mount
  useEffect(() => {
    const loaded = loadNotifications();
    setNotifications(loaded);
  }, []);

  // Save notifications whenever they change
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    const newNotification: Notification = {
      ...notification,
      id,
      read: false,
      createdAt: now,
      expiresAt: notification.expiresAt || (now + DEFAULT_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    };

    setNotifications(prev => [newNotification, ...prev]);
    return id;
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearRead = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    clearRead,
  };
}

/**
 * Helper to create notification from various sources
 */
export function createNotification(
  type: NotificationType,
  title: string,
  options?: {
    message?: string;
    priority?: NotificationPriority;
    category?: string;
    action?: { label: string; onClick: () => void };
    expiresInDays?: number;
  }
): Omit<Notification, 'id' | 'read' | 'createdAt'> {
  const now = Date.now();
  const expiresAt = options?.expiresInDays
    ? now + options.expiresInDays * 24 * 60 * 60 * 1000
    : undefined;

  return {
    type,
    title,
    message: options?.message,
    priority: options?.priority || 'normal',
    category: options?.category,
    action: options?.action,
    expiresAt,
  };
}

