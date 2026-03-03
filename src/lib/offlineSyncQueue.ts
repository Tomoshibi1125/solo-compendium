import { get, set } from 'idb-keyval';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { Json } from '@/integrations/supabase/types';

export type QueueItemType = 'roll' | 'message';

export interface RollPayload {
    dice_formula: string;
    result: number;
    roll_type: string;
    rolls: number[];
    context?: string;
    modifiers?: Json;
    character_id?: string;
    campaign_id: string;
    user_id: string;
}

export interface MessagePayload {
    campaign_id: string;
    user_id: string;
    message_type: 'chat' | 'roll' | 'system' | 'whisper';
    content: string;
    metadata?: Json;
    character_name?: string | null;
}

export interface QueueItem {
    id: string;
    type: QueueItemType;
    timestamp: number;
    payload: RollPayload | MessagePayload;
}

const QUEUE_KEY = 'solo-compendium-offline-queue';

export const getOfflineQueue = async (): Promise<QueueItem[]> => {
    try {
        const queue = await get(QUEUE_KEY);
        return Array.isArray(queue) ? queue : [];
    } catch (err) {
        logger.error('Failed to read offline queue', err);
        return [];
    }
};

const saveOfflineQueue = async (queue: QueueItem[]) => {
    try {
        await set(QUEUE_KEY, queue);
    } catch (err) {
        logger.error('Failed to write offline queue', err);
    }
};

export const enqueueRoll = async (payload: RollPayload) => {
    const queue = await getOfflineQueue();
    queue.push({
        id: crypto.randomUUID(),
        type: 'roll',
        timestamp: Date.now(),
        payload,
    });
    await saveOfflineQueue(queue);
    logger.log('Roll queued for offline sync');
};

export const enqueueMessage = async (payload: MessagePayload) => {
    const queue = await getOfflineQueue();
    queue.push({
        id: crypto.randomUUID(),
        type: 'message',
        timestamp: Date.now(),
        payload,
    });
    await saveOfflineQueue(queue);
    logger.log('Message queued for offline sync');
};

export const flushOfflineQueue = async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return;
    }
    if (!isSupabaseConfigured) {
        return; // Don't flush if there's no backend
    }

    const queue = await getOfflineQueue();
    if (queue.length === 0) return;

    // We want to process in order of timestamp
    const sortedQueue = queue.sort((a, b) => a.timestamp - b.timestamp);
    const remainingQueue: QueueItem[] = [];
    let successCount = 0;

    for (const item of sortedQueue) {
        try {
            if (item.type === 'roll') {
                const payload = item.payload as RollPayload;

                // Ensure character exists locally before inserting the linked roll if required
                // But for simplicity, push straight to supabase
                const { error: rollError } = await supabase.from('roll_history').insert({
                    ...payload,
                });
                if (rollError) throw rollError;

                // Auto-post the roll to the chat as well, mirroring what the online function does
                const { error: msgError } = await supabase.from('campaign_messages').insert({
                    campaign_id: payload.campaign_id,
                    user_id: payload.user_id,
                    message_type: 'roll',
                    content: `${payload.context || 'Roll'}: ${payload.dice_formula} = ${payload.result}`,
                    metadata: { roll_data: payload } as unknown as Json,
                });
                if (msgError) throw msgError;

            } else if (item.type === 'message') {
                const payload = item.payload as MessagePayload;
                const { error: msgError } = await supabase.from('campaign_messages').insert({
                    campaign_id: payload.campaign_id,
                    user_id: payload.user_id,
                    message_type: payload.message_type,
                    content: payload.content,
                    metadata: (payload.metadata ?? null) as Json,
                    character_name: payload.character_name,
                });
                if (msgError) throw msgError;
            }

            successCount++;
        } catch (err) {
            logger.error(`Failed to sync queued item ${item.id}`, err);
            remainingQueue.push(item);
        }
    }

    await saveOfflineQueue(remainingQueue);
    if (successCount > 0) {
        logger.log(`Successfully flushed ${successCount} items from offline queue`);
    }
};
