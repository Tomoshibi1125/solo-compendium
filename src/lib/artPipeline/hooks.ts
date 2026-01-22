/**
 * Art Pipeline React Hooks
 * React integration for the art generation system
 */

import { useState, useCallback, useEffect } from 'react';
import { artPipeline } from './service';
import type { ArtRequest, GenerationResult, ArtAsset, QueueStatus } from './types';
import { useFeatureFlag } from '@/lib/featureFlags';

/**
 * Hook for art generation status and operations
 */
export function useArtPipeline() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const enabled = useFeatureFlag('artGenerationEnabled');

  const checkAvailability = useCallback(async () => {
    const available = await artPipeline.isAvailable();
    setIsAvailable(available);
    return available;
  }, []);

  // Check availability on mount and when enabled changes
  useEffect(() => {
    if (enabled) {
      checkAvailability();
    } else {
      setIsAvailable(false);
    }
  }, [enabled, checkAvailability]);

  const generateArt = useCallback(async (request: ArtRequest): Promise<GenerationResult> => {
    if (!enabled) {
      return {
        success: false,
        error: 'Art generation is disabled',
      };
    }

    setIsGenerating(true);
    const startedAt = Date.now();
    const rawTimeout = Number.parseInt(import.meta.env.VITE_ART_OVERALL_TIMEOUT_MS || '', 10);
    const maxTimeoutMs = Number.isFinite(rawTimeout) && rawTimeout > 0 ? rawTimeout : 90000;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      const generationPromise = artPipeline
        .generateArt(request)
        .then((result) => ({ kind: 'result' as const, result }))
        .catch((error) => ({ kind: 'error' as const, error }));

      const timeoutPromise = new Promise<{ kind: 'timeout' }>((resolve) => {
        timeoutId = setTimeout(() => resolve({ kind: 'timeout' }), maxTimeoutMs);
      });

      const outcome = await Promise.race([generationPromise, timeoutPromise]);

      if (outcome.kind === 'timeout') {
        await artPipeline.interrupt();
        const fallbackAssets = await artPipeline.getAssetsForEntity(request.entityType, request.entityId);
        if (fallbackAssets.length > 0) {
          const asset = fallbackAssets[0];
          return {
            success: true,
            assetId: asset.id,
            paths: Object.values(asset.paths),
            metadata: asset.metadata,
            duration: Date.now() - startedAt,
          };
        }

        return {
          success: false,
          error: `Art generation timed out after ${maxTimeoutMs}ms`,
          duration: Date.now() - startedAt,
        };
      }

      if (outcome.kind === 'error') {
        throw outcome.error;
      }

      const result = outcome.result;
      if (result && typeof result.success === 'boolean') {
        return {
          ...result,
          duration: result.duration ?? Date.now() - startedAt,
        };
      }

      const fallbackAssets = await artPipeline.getAssetsForEntity(request.entityType, request.entityId);
      if (fallbackAssets.length > 0) {
        const asset = fallbackAssets[0];
        return {
          success: true,
          assetId: asset.id,
          paths: Object.values(asset.paths),
          metadata: asset.metadata,
          duration: Date.now() - startedAt,
        };
      }

      return {
        success: false,
        error: 'Art generation returned no result',
        duration: Date.now() - startedAt,
      };
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsGenerating(false);
    }
  }, [enabled]);

  const getQueueStatus = useCallback(async () => {
    if (!enabled) return null;
    const status = await artPipeline.getQueueStatus();
    setQueueStatus(status);
    return status;
  }, [enabled]);

  const clearQueue = useCallback(async () => {
    if (!enabled) return;
    await artPipeline.clearQueue();
    await getQueueStatus();
  }, [enabled, getQueueStatus]);

  const interrupt = useCallback(async () => {
    if (!enabled) return;
    await artPipeline.interrupt();
    await getQueueStatus();
  }, [enabled, getQueueStatus]);

  return {
    isAvailable,
    isGenerating,
    queueStatus,
    enabled,
    generateArt,
    getQueueStatus,
    clearQueue,
    interrupt,
    checkAvailability,
  };
}

/**
 * Hook for managing a specific art asset
 */
export function useArtAsset(
  entityType: ArtRequest['entityType'],
  entityId: string,
  variant: ArtRequest['variant'] = 'portrait'
) {
  const [asset, setAsset] = useState<ArtAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { generateArt } = useArtPipeline();

  const loadAsset = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const assets = await artPipeline.getAssetsForEntity(entityType, entityId);
      const variantAsset = assets.find(a => a.variant === variant);
      setAsset(variantAsset || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load asset');
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, variant]);

  const createAsset = useCallback(async (title: string, options: Partial<ArtRequest> = {}) => {
    const request: ArtRequest = {
      entityType,
      entityId,
      variant,
      title,
      tags: options.tags || [],
      description: options.description,
      rarityOrCR: options.rarityOrCR,
      environment: options.environment,
      mood: options.mood,
      extraLore: options.extraLore,
    };

    const result = await generateArt(request);
    if (result.success) {
      await loadAsset(); // Reload to get the new asset
    }
    return result;
  }, [entityType, entityId, variant, generateArt, loadAsset]);

  useEffect(() => {
    loadAsset();
  }, [loadAsset]);

  return {
    asset,
    loading,
    error,
    createAsset,
    refresh: loadAsset,
  };
}

/**
 * Hook for batch art generation
 */
export function useBatchArtGeneration() {
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBatch = useCallback(async (requests: ArtRequest[]) => {
    setIsGenerating(true);
    setProgress(0);
    setResults([]);

    try {
      const batchResults = await artPipeline.batchGenerate(requests);
      setResults(batchResults);
      
      // Update progress as we go
      for (let i = 0; i < batchResults.length; i++) {
        setProgress(((i + 1) / batchResults.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for UI updates
      }
      
      return batchResults;
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, []);

  return {
    generateBatch,
    progress,
    results,
    isGenerating,
  };
}

/**
 * Hook for art generation queue monitoring
 */
export function useArtQueueMonitor(interval: number = 2000) {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const { getQueueStatus } = useArtPipeline();

  useEffect(() => {
    if (!interval) return;

    const intervalId = setInterval(() => {
      getQueueStatus().then(setQueueStatus);
    }, interval);

    // Initial check
    getQueueStatus().then(setQueueStatus);

    return () => clearInterval(intervalId);
  }, [interval, getQueueStatus]);

  return queueStatus;
}

