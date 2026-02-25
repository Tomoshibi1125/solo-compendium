/**
 * Domain Event → React Query Cache Sync Hook
 *
 * Phase 8: Bridges the DomainEventBus with React Query cache invalidation.
 * When domain events fire (level up, spell cast, rest, etc.), this hook
 * automatically invalidates the relevant query keys so the UI reflects
 * the latest state — achieving D&D Beyond-level reactivity.
 *
 * Usage: Call `useDomainEventQuerySync()` once in the app root or
 * character sheet layout to activate automatic cache invalidation.
 */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    DomainEventBus,
    type DomainEvent,
    type DomainEventType,
} from '@/lib/domainEvents';

/**
 * Map domain event types to the React Query keys that need invalidation.
 */
const EVENT_TO_QUERY_KEYS: Record<DomainEventType, (characterId: string) => string[][]> = {
    'character:save': (cid) => [
        ['character-base-data', cid],
    ],

    'character:levelup': (cid) => [
        ['character-base-data', cid],
        ['spell-slots', cid],
        ['character-rune-knowledge', cid],
        ['character-rune-inscriptions', cid],
    ],

    'spell:cast': (cid) => [
        ['character-base-data', cid],
        ['spell-slots', cid],
    ],

    'combat:attack': (cid) => [
        ['character-base-data', cid],
        ['roll-history', cid],
    ],

    'rest:short': (cid) => [
        ['character-base-data', cid],
        ['spell-slots', cid],
    ],

    'rest:long': (cid) => [
        ['character-base-data', cid],
        ['spell-slots', cid],
        ['character-rune-inscriptions', cid],
    ],

    'item:attune': (cid) => [
        ['character-base-data', cid],
    ],

    'encounter:create': () => [
        // Encounter creation doesn't invalidate character data
    ],
};

/**
 * Hook: Wire domain events to React Query cache invalidation.
 *
 * Call once at the app/layout level. Subscribes to all domain events and
 * invalidates the matching query keys so derived UI stays in sync.
 */
export function useDomainEventQuerySync(): void {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handler = (event: DomainEvent) => {
            const characterId = event.characterId;
            const getKeys = EVENT_TO_QUERY_KEYS[event.type];

            if (getKeys) {
                const queryKeys = getKeys(characterId);
                for (const queryKey of queryKeys) {
                    queryClient.invalidateQueries({ queryKey });
                }
            }
        };

        DomainEventBus.onAny(handler);
        return () => DomainEventBus.offAny(handler);
    }, [queryClient]);
}
