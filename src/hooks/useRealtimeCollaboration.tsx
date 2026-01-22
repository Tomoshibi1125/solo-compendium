import { useState, useEffect, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import '@/styles/realtime-collaboration.css';

type CursorPosition = { x: number; y: number };

type TextChangePayload = {
  elementId: string;
  content: string;
  cursorPosition?: number;
};

type CharacterUpdatePayload = {
  characterId: string;
  updates: Record<string, unknown>;
};

type DiceRollPayload = {
  formula: string;
  result: number;
  details?: Record<string, unknown>;
};

type MapUpdatePayload = Record<string, unknown>;
type CombatStatePayload = Record<string, unknown>;

type CollaborationEventBase = {
  userId: string;
  userName: string;
  timestamp: number;
  campaignId: string;
};

export type CollaborationEvent =
  | (CollaborationEventBase & { type: 'cursor_move'; data: CursorPosition })
  | (CollaborationEventBase & { type: 'text_change'; data: TextChangePayload })
  | (CollaborationEventBase & { type: 'character_update'; data: CharacterUpdatePayload })
  | (CollaborationEventBase & { type: 'dice_roll'; data: DiceRollPayload })
  | (CollaborationEventBase & { type: 'map_update'; data: MapUpdatePayload })
  | (CollaborationEventBase & { type: 'combat_state'; data: CombatStatePayload });

type TextChangeEvent = Extract<CollaborationEvent, { type: 'text_change' }>;
type CharacterUpdateEvent = Extract<CollaborationEvent, { type: 'character_update' }>;
type DiceRollEvent = Extract<CollaborationEvent, { type: 'dice_roll' }>;
type MapUpdateEvent = Extract<CollaborationEvent, { type: 'map_update' }>;
type CombatStateEvent = Extract<CollaborationEvent, { type: 'combat_state' }>;

type PresencePayload = {
  user_id?: string;
  user_name?: string;
  cursor?: CursorPosition;
  isTyping?: boolean;
  currentElement?: string;
};

export interface ActiveUser {
  id: string;
  name: string;
  cursor?: { x: number; y: number };
  lastSeen: number;
  isTyping?: boolean;
  currentElement?: string;
}

export function useRealtimeCollaboration(campaignId: string) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [activeUsers, setActiveUsers] = useState<Map<string, ActiveUser>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const updateCursorPosition = useCallback((userId: string, position: { x: number; y: number }) => {
    setActiveUsers(prev => {
      const newMap = new Map(prev);
      const user = newMap.get(userId);
      if (user) {
        newMap.set(userId, { ...user, cursor: position, lastSeen: Date.now() });
      }
      return newMap;
    });
  }, []);

  const handleTextChange = useCallback((event: TextChangeEvent) => {
    // Emit custom event for text changes
    window.dispatchEvent(new CustomEvent('collaboration:text_change', {
      detail: event
    }));
  }, []);

  const handleCharacterUpdate = useCallback((event: CharacterUpdateEvent) => {
    // Emit custom event for character updates
    window.dispatchEvent(new CustomEvent('collaboration:character_update', {
      detail: event
    }));
  }, []);

  const handleDiceRoll = useCallback((event: DiceRollEvent) => {
    // Emit custom event for dice rolls
    window.dispatchEvent(new CustomEvent('collaboration:dice_roll', {
      detail: event
    }));
    
    toast({
      title: 'Dice Roll',
      description: `${event.userName} rolled ${event.data.formula}: ${event.data.result}`,
    });
  }, [toast]);

  const handleMapUpdate = useCallback((event: MapUpdateEvent) => {
    // Emit custom event for map updates
    window.dispatchEvent(new CustomEvent('collaboration:map_update', {
      detail: event
    }));
  }, []);

  const handleCombatStateUpdate = useCallback((event: CombatStateEvent) => {
    // Emit custom event for combat state updates
    window.dispatchEvent(new CustomEvent('collaboration:combat_state', {
      detail: event
    }));
  }, []);

  const handleCollaborationEvent = useCallback((event: CollaborationEvent) => {
    switch (event.type) {
      case 'cursor_move':
        updateCursorPosition(event.userId, event.data);
        break;
      case 'text_change':
        handleTextChange(event);
        break;
      case 'character_update':
        handleCharacterUpdate(event);
        break;
      case 'dice_roll':
        handleDiceRoll(event);
        break;
      case 'map_update':
        handleMapUpdate(event);
        break;
      case 'combat_state':
        handleCombatStateUpdate(event);
        break;
    }
  }, [updateCursorPosition, handleTextChange, handleCharacterUpdate, handleDiceRoll, handleMapUpdate, handleCombatStateUpdate]);

  const handleUserJoin = useCallback((key: string, presences: PresencePayload[]) => {
    presences.forEach((presence) => {
      const userId = presence.user_id ?? key;
      const user: ActiveUser = {
        id: userId,
        name: presence.user_name || 'Anonymous',
        lastSeen: Date.now(),
      };
      setActiveUsers(prev => new Map(prev.set(key, user)));
      
      toast({
        title: 'User Joined',
        description: `${user.name} joined the campaign`,
      });
    });
  }, [toast]);

  const handleUserLeave = useCallback((key: string, _presences: PresencePayload[]) => {
    const user = activeUsers.get(key);
    if (user) {
      setActiveUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(key);
        return newMap;
      });
      
      toast({
        title: 'User Left',
        description: `${user.name} left the campaign`,
      });
    }
  }, [toast, activeUsers]);

  // Initialize real-time connection
  useEffect(() => {
    if (!campaignId) return;

    const newChannel = supabase
      .channel(`campaign_${campaignId}`)
      .on('broadcast', { event: 'collaboration' }, (payload) => {
        handleCollaborationEvent(payload.payload as CollaborationEvent);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        handleUserJoin(key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        handleUserLeave(key, leftPresences);
      })
      .on('presence', { event: 'sync' }, () => {
        // Handle initial sync
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          toast({
            title: 'Connected to Campaign',
            description: 'Real-time collaboration enabled',
          });
        } else if (status === 'CHANNEL_ERROR') {
          toast({
            title: 'Connection Error',
            description: 'Unable to connect to real-time features',
            variant: 'destructive',
          });
        }
      });

    setChannel(newChannel);

    return () => {
      newChannel.unsubscribe();
    };
  }, [campaignId, handleCollaborationEvent, handleUserJoin, handleUserLeave, toast]);


  // Broadcasting functions
  const broadcastCursorMove = useCallback((position: { x: number; y: number }) => {
    if (!channel || !isConnected) return;

    channel.send({
      type: 'broadcast',
      event: 'collaboration',
      payload: {
        type: 'cursor_move',
        userId: 'current_user_id', // Get from auth context
        userName: 'current_user_name', // Get from auth context
        data: position,
        timestamp: Date.now(),
        campaignId,
      } as CollaborationEvent,
    });
  }, [channel, isConnected, campaignId]);

  const broadcastTextChange = useCallback((elementId: string, content: string, cursorPosition?: number) => {
    if (!channel || !isConnected) return;

    channel.send({
      type: 'broadcast',
      event: 'collaboration',
      payload: {
        type: 'text_change',
        userId: 'current_user_id',
        userName: 'current_user_name',
        data: { elementId, content, cursorPosition },
        timestamp: Date.now(),
        campaignId,
      } as CollaborationEvent,
    });
  }, [channel, isConnected, campaignId]);

  const broadcastCharacterUpdate = useCallback((characterId: string, updates: Record<string, unknown>) => {
    if (!channel || !isConnected) return;

    channel.send({
      type: 'broadcast',
      event: 'collaboration',
      payload: {
        type: 'character_update',
        userId: 'current_user_id',
        userName: 'current_user_name',
        data: { characterId, updates },
        timestamp: Date.now(),
        campaignId,
      } as CollaborationEvent,
    });
  }, [channel, isConnected, campaignId]);

  const broadcastDiceRoll = useCallback((formula: string, result: number, details?: Record<string, unknown>) => {
    if (!channel || !isConnected) return;

    channel.send({
      type: 'broadcast',
      event: 'collaboration',
      payload: {
        type: 'dice_roll',
        userId: 'current_user_id',
        userName: 'current_user_name',
        data: { formula, result, details },
        timestamp: Date.now(),
        campaignId,
      } as CollaborationEvent,
    });
  }, [channel, isConnected, campaignId]);

  const broadcastMapUpdate = useCallback((mapData: MapUpdatePayload) => {
    if (!channel || !isConnected) return;

    channel.send({
      type: 'broadcast',
      event: 'collaboration',
      payload: {
        type: 'map_update',
        userId: 'current_user_id',
        userName: 'current_user_name',
        data: mapData,
        timestamp: Date.now(),
        campaignId,
      } as CollaborationEvent,
    });
  }, [channel, isConnected, campaignId]);

  const broadcastCombatState = useCallback((combatState: CombatStatePayload) => {
    if (!channel || !isConnected) return;

    channel.send({
      type: 'broadcast',
      event: 'collaboration',
      payload: {
        type: 'combat_state',
        userId: 'current_user_id',
        userName: 'current_user_name',
        data: combatState,
        timestamp: Date.now(),
        campaignId,
      } as CollaborationEvent,
    });
  }, [channel, isConnected, campaignId]);

  // Update user presence
  const updatePresence = useCallback((state: Record<string, unknown>) => {
    if (!channel || !isConnected) return;

    channel.track({
      user_id: 'current_user_id',
      user_name: 'current_user_name',
      ...state,
    });
  }, [channel, isConnected]);

  return {
    isConnected,
    activeUsers: Array.from(activeUsers.values()),
    broadcastCursorMove,
    broadcastTextChange,
    broadcastCharacterUpdate,
    broadcastDiceRoll,
    broadcastMapUpdate,
    broadcastCombatState,
    updatePresence,
  };
}

// React component for displaying active users
export function ActiveUsersList({ activeUsers }: { activeUsers: ActiveUser[] }) {
  return (
    <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
      <div className="flex -space-x-2">
        {activeUsers.map((user) => (
          <div
            key={user.id}
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium border-2 border-background"
            title={user.name}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {activeUsers.length} active user{activeUsers.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

// React component for collaborative cursors
export function CollaborativeCursors({ activeUsers }: { activeUsers: ActiveUser[] }) {
  return (
    <>
      {activeUsers.map((user) => (
        user.cursor && (
          <div
            key={user.id}
            className="cursor-indicator"
            style={{
              '--cursor-x': `${user.cursor.x}px`,
              '--cursor-y': `${user.cursor.y}px`,
              '--cursor-color': getUserColor(user.id),
            } as React.CSSProperties}
          >
            <div className="cursor-indicator-inner" />
            <div className="cursor-indicator-info">{user.name}</div>
          </div>
        )
      ))}
    </>
  );
}

// Helper function to get consistent colors for users
function getUserColor(userId: string): string {
  const colors = [
    '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e',
    '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
  ];
  
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}
