/**
 * Feature flags system for safely toggling new functionality
 * All flags default to false for production safety
 */

export interface FeatureFlags {
  dailyQuestEnabled: boolean;
  artGenerationEnabled: boolean;
  aiEnhancementEnabled: boolean;
  aiAnalysisEnabled: boolean;
  aiTagsEnabled: boolean;
  aiMoodDetectionEnabled: boolean;
  aiStyleSuggestionsEnabled: boolean;
  aiContentFilteringEnabled: boolean;
  aiVariationsEnabled: boolean;
  aiBatchProcessingEnabled: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  dailyQuestEnabled: true,
  artGenerationEnabled: true,
  aiEnhancementEnabled: true,
  aiAnalysisEnabled: true,
  aiTagsEnabled: true,
  aiMoodDetectionEnabled: true,
  aiStyleSuggestionsEnabled: true,
  aiContentFilteringEnabled: true,
  aiVariationsEnabled: true,
  aiBatchProcessingEnabled: true,
};

const FLAG_ENV_KEYS: Record<keyof FeatureFlags, string> = {
  dailyQuestEnabled: 'VITE_FEATURE_DAILY_QUESTS',
  artGenerationEnabled: 'VITE_FEATURE_ART_GENERATION',
  aiEnhancementEnabled: 'VITE_FEATURE_AI_ENHANCED_PROMPTS',
  aiAnalysisEnabled: 'VITE_FEATURE_AI_IMAGE_ANALYSIS',
  aiTagsEnabled: 'VITE_FEATURE_AI_TAG_GENERATION',
  aiMoodDetectionEnabled: 'VITE_FEATURE_AI_MOOD_DETECTION',
  aiStyleSuggestionsEnabled: 'VITE_FEATURE_AI_STYLE_SUGGESTIONS',
  aiContentFilteringEnabled: 'VITE_FEATURE_AI_CONTENT_FILTERING',
  aiVariationsEnabled: 'VITE_FEATURE_AI_VARIATIONS',
  aiBatchProcessingEnabled: 'VITE_FEATURE_AI_BATCH_PROCESSING',
};

/**
 * Get feature flag value from environment or default
 * Environment variables should be prefixed with VITE_FEATURE_
 */
export function getFeatureFlag(flag: keyof FeatureFlags): boolean {
  const envKey = FLAG_ENV_KEYS[flag];
  const envValue = import.meta.env[envKey];
  
  if (envValue !== undefined) {
    return envValue === 'true' || envValue === '1';
  }
  
  return DEFAULT_FLAGS[flag];
}

/**
 * Get all feature flags as an object
 */
export function getAllFeatureFlags(): FeatureFlags {
  return {
    dailyQuestEnabled: getFeatureFlag('dailyQuestEnabled'),
    artGenerationEnabled: getFeatureFlag('artGenerationEnabled'),
    aiEnhancementEnabled: getFeatureFlag('aiEnhancementEnabled'),
    aiAnalysisEnabled: getFeatureFlag('aiAnalysisEnabled'),
    aiTagsEnabled: getFeatureFlag('aiTagsEnabled'),
    aiMoodDetectionEnabled: getFeatureFlag('aiMoodDetectionEnabled'),
    aiStyleSuggestionsEnabled: getFeatureFlag('aiStyleSuggestionsEnabled'),
    aiContentFilteringEnabled: getFeatureFlag('aiContentFilteringEnabled'),
    aiVariationsEnabled: getFeatureFlag('aiVariationsEnabled'),
    aiBatchProcessingEnabled: getFeatureFlag('aiBatchProcessingEnabled'),
  };
}

/**
 * Hook for accessing feature flags in React components
 */
export function useFeatureFlags(): FeatureFlags {
  return getAllFeatureFlags();
}

/**
 * Hook for checking a specific feature flag
 */
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  return getFeatureFlag(flag);
}
