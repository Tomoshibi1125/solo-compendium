/**
 * AI Service React Hooks
 * React integration for AI-powered enhancements
 */

import { useState, useEffect, useCallback } from 'react';
import { aiService } from './aiService';
import type { 
  AIConfiguration, 
  AIRequest,
  AIResponse,
  AIService,
  AudioAnalysis, 
  ImageAnalysis, 
  PromptEnhancement 
} from './types';
import { useFeatureFlag } from '@/lib/featureFlags';

type BatchResult = {
  index: number;
  success: boolean;
  data?: AIResponse['data'];
  error?: string;
};

/**
 * Hook for AI service configuration and status
 */
export function useAIService() {
  const [config, setConfig] = useState<AIConfiguration>(aiService.getConfiguration());
  const [isAvailable, setIsAvailable] = useState(false);
  const [stats, setStats] = useState({ size: 0, keys: [] as string[] });

  useEffect(() => {
    // Check if any AI service is available
    const hasEnabledService = config.services.some(service => service.enabled);
    setIsAvailable(hasEnabledService);
  }, [config.services]);

  const updateConfiguration = useCallback((updates: Partial<AIConfiguration>) => {
    aiService.updateConfiguration(updates);
    setConfig(aiService.getConfiguration());
  }, []);

  const addService = useCallback((service: AIService) => {
    aiService.addService(service);
    setConfig(aiService.getConfiguration());
  }, []);

  const removeService = useCallback((serviceId: string) => {
    aiService.removeService(serviceId);
    setConfig(aiService.getConfiguration());
  }, []);

  const enableService = useCallback((serviceId: string) => {
    aiService.enableService(serviceId);
    setConfig(aiService.getConfiguration());
  }, []);

  const disableService = useCallback((serviceId: string) => {
    aiService.disableService(serviceId);
    setConfig(aiService.getConfiguration());
  }, []);

  const clearCache = useCallback(() => {
    aiService.clearCache();
    setStats({ size: 0, keys: [] });
  }, []);

  const getCacheStats = useCallback(() => {
    const stats = aiService.getCacheStats();
    setStats(stats);
    return stats;
  }, []);

  return {
    config,
    isAvailable,
    stats,
    updateConfiguration,
    addService,
    removeService,
    enableService,
    disableService,
    clearCache,
    getCacheStats,
  };
}

/**
 * Hook for AI-powered prompt enhancement
 */
export function useAIEnhancement() {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [enhancement, setEnhancement] = useState<PromptEnhancement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAvailable = useFeatureFlag('aiEnhancementEnabled');

  const enhancePrompt = useCallback(async (originalPrompt: string, context?: Record<string, unknown>) => {
    if (!isAvailable) {
      setError('AI enhancement is disabled');
      return;
    }

    setIsEnhancing(true);
    setError(null);
    setEnhancedPrompt('');

    try {
      const result = await aiService.enhancePrompt(originalPrompt, context);
      setEnhancedPrompt(result.enhanced);
      setEnhancement(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enhancement failed');
      throw err;
    } finally {
      setIsEnhancing(false);
    }
  }, [isAvailable]);

  return {
    isEnhancing,
    enhancedPrompt,
    enhancement,
    error,
    enhancePrompt,
  };
}

/**
 * Hook for AI-powered image analysis
 */
export function useAIImageAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAvailable = useFeatureFlag('aiAnalysisEnabled');

  const analyzeImage = useCallback(async (imageUrl: string) => {
    if (!isAvailable) {
      setError('AI analysis is disabled');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await aiService.analyzeImage(imageUrl);
      setAnalysis(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAvailable]);

  return {
    isAnalyzing,
    analysis,
    error,
    analyzeImage,
  };
}

/**
 * Hook for AI-powered audio analysis
 */
export function useAIAudioAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAvailable = useFeatureFlag('aiAnalysisEnabled');

  const analyzeAudio = useCallback(async (audioFile: File) => {
    if (!isAvailable) {
      setError('AI analysis is disabled');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await aiService.analyzeAudio(audioFile);
      setAnalysis(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAvailable]);

  return {
    isAnalyzing,
    analysis,
    error,
    analyzeAudio,
  };
}

/**
 * Hook for AI-powered tag generation
 */
export function useAITagGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isAvailable = useFeatureFlag('aiTagsEnabled');

  const generateTags = useCallback(async (content: string, type: 'audio' | 'image' | 'text' = 'text') => {
    if (!isAvailable) {
      setError('AI tag generation is disabled');
      return [];
    }

    setIsGenerating(true);
    setError(null);
    setTags([]);

    try {
      const result = await aiService.generateTags(content, type);
      setTags(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tag generation failed');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [isAvailable]);

  return {
    isGenerating,
    tags,
    error,
    generateTags,
  };
}

/**
 * Hook for AI-powered mood detection
 */
export function useAIMoodDetection() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [mood, setMood] = useState<string>('neutral');
  const [error, setError] = useState<string | null>(null);
  const isAvailable = useFeatureFlag('aiMoodDetectionEnabled');

  const detectMood = useCallback(async (content: string, type: 'audio' | 'image' | 'text' = 'text') => {
    if (!isAvailable) {
      setError('AI mood detection is disabled');
      return 'neutral';
    }

    setIsDetecting(true);
    setError(null);
    setMood('neutral');

    try {
      const result = await aiService.detectMood(content, type);
      setMood(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mood detection failed');
      throw err;
    } finally {
      setIsDetecting(false);
    }
  }, [isAvailable]);

  return {
    isDetecting,
    mood,
    error,
    detectMood,
  };
}

/**
 * Hook for AI-powered style suggestions
 */
export function useAIStyleSuggestions() {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isAvailable = useFeatureFlag('aiStyleSuggestionsEnabled');

  const suggestStyles = useCallback(async (baseStyle: string) => {
    if (!isAvailable) {
      setError('AI style suggestions are disabled');
      return [];
    }

    setIsSuggesting(true);
    setError(null);
    setSuggestions([]);

    try {
      const result = await aiService.suggestStyleVariations(baseStyle);
      setSuggestions(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Style suggestions failed');
      throw err;
    } finally {
      setIsSuggesting(false);
    }
  }, [isAvailable]);

  return {
    isSuggesting,
    suggestions,
    error,
    suggestStyles,
  };
}

/**
 * Hook for AI-powered content filtering
 */
export function useAIContentFiltering() {
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterResult, setFilterResult] = useState<{
    isAppropriate: boolean;
    issues: string[];
    suggestions: string[];
  }>({ isAppropriate: true, issues: [], suggestions: [] });
  const [error, setError] = useState<string | null>(null);
  const isAvailable = useFeatureFlag('aiContentFilteringEnabled');

  const filterContent = useCallback(async (content: string) => {
    if (!isAvailable) {
      setError('AI content filtering is disabled');
      return { isAppropriate: true, issues: [], suggestions: [] };
    }

    setIsFiltering(true);
    setError(null);
    setFilterResult({ isAppropriate: true, issues: [], suggestions: [] });

    try {
      const result = await aiService.filterContent(content);
      setFilterResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Content filtering failed');
      throw err;
    } finally {
      setIsFiltering(false);
    }
  }, [isAvailable]);

  return {
    isFiltering,
    filterResult,
    error,
    filterContent,
  };
}

/**
 * Hook for AI-powered content variation
 */
export function useAIVariations() {
  const [isCreating, setIsCreating] = useState(false);
  const [variation, setVariation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const isAvailable = useFeatureFlag('aiVariationsEnabled');

  const createVariation = useCallback(async (originalContent: string, variationType: string) => {
    if (!isAvailable) {
      setError('AI variations are disabled');
      return originalContent;
    }

    setIsCreating(true);
    setError(null);
    setVariation(originalContent);

    try {
      const result = await aiService.createVariation(originalContent, variationType);
      setVariation(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Variation creation failed');
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, [isAvailable]);

  return {
    isCreating,
    variation,
    error,
    createVariation,
  };
}

/**
 * Hook for AI-powered batch processing
 */
export function useAIBatchProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const isAvailable = useFeatureFlag('aiBatchProcessingEnabled');

  const processBatch = useCallback(async (requests: Array<Omit<AIRequest, 'service'> & { service?: string }>) => {
    if (!isAvailable) {
      setError('AI batch processing is disabled');
      return [];
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResults([]);

    try {
      const batchResults: BatchResult[] = [];
      const defaultService = aiService.getConfiguration().defaultService;
      
      for (let i = 0; i < requests.length; i++) {
        const request = requests[i];
        const requestWithService: AIRequest = {
          service: request.service ?? defaultService,
          type: request.type,
          input: request.input,
          context: request.context,
          options: request.options,
        };
        
        try {
          const result = await aiService.processRequest(requestWithService);
          batchResults.push({
            index: i,
            success: result.success,
            data: result.data,
            error: result.error,
          });
        } catch (error) {
          batchResults.push({
            index: i,
            success: false,
            error: error instanceof Error ? error.message : 'Request failed',
          });
        }
        
        setProgress(((i + 1) / requests.length) * 100);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setResults(batchResults);
      return batchResults;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Batch processing failed');
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [isAvailable]);

  return {
    isProcessing,
    results,
    progress,
    error,
    processBatch,
  };
}
