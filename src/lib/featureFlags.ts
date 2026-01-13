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
  dailyQuestEnabled: false,
  artGenerationEnabled: false,
  aiEnhancementEnabled: false,
  aiAnalysisEnabled: false,
  aiTagsEnabled: false,
  aiMoodDetectionEnabled: false,
  aiStyleSuggestionsEnabled: false,
  aiContentFilteringEnabled: false,
  aiVariationsEnabled: false,
  aiBatchProcessingEnabled: false,
};

/**
 * Get feature flag value from environment or default
 * Environment variables should be prefixed with VITE_FEATURE_
 */
export function getFeatureFlag(flag: keyof FeatureFlags): boolean {
  const envKey = `VITE_FEATURE_${flag.toUpperCase()}`;
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
