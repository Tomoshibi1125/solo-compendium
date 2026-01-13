/**
 * Art Pipeline React Hooks
 * React integration for the art generation system
 */

import { useState, useCallback, useEffect } from 'react';
import { artPipeline } from './service';
import type { ArtRequest, GenerationResult, ArtAsset } from './types';
import { useFeatureFlag } from '@/lib/featureFlags';

/**
 * Hook for art generation status and operations
 */
export function useArtPipeline() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [queueStatus, setQueueStatus] = useState<any>(null);
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
    try {
      const result = await artPipeline.generateArt(request);
      return result;
    } finally {
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
export function useArtAsset(entityType: string, entityId: string, variant: string = 'portrait') {
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
      entityType: entityType as any,
      entityId,
      variant: variant as any,
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
  const { generateArt } = useArtPipeline();

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
  const [queueStatus, setQueueStatus] = useState<any>(null);
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

/**
 * Hook for ComfyUI system information
 */
export function useComfyUISystem() {
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { isAvailable } = useArtPipeline();

  const loadSystemInfo = useCallback(async () => {
    if (!isAvailable) return;
    
    setLoading(true);
    try {
      const info = await (artPipeline as any).comfyClient?.getSystemInfo();
      setSystemInfo(info);
    } catch (error) {
      console.error('Failed to load system info:', error);
    } finally {
      setLoading(false);
    }
  }, [isAvailable]);

  useEffect(() => {
    loadSystemInfo();
  }, [loadSystemInfo]);

  return {
    systemInfo,
    loading,
    refresh: loadSystemInfo,
  };
}
