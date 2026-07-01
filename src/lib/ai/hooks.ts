/**
 * AI Service React Hooks
 * React integration for AI-powered enhancements
 */

import { useCallback, useState } from "react";
import { useFeatureFlag } from "@/lib/featureFlags";
import { aiService } from "./aiService";
import type { PromptEnhancement } from "./types";

/**
 * Hook for AI-powered prompt enhancement
 */
export function useAIEnhancement() {
	const [isEnhancing, setIsEnhancing] = useState(false);
	const [enhancedPrompt, setEnhancedPrompt] = useState<string>("");
	const [enhancement, setEnhancement] = useState<PromptEnhancement | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const isAvailable = useFeatureFlag("aiEnhancementEnabled");

	const enhancePrompt = useCallback(
		async (originalPrompt: string, context?: Record<string, unknown>) => {
			if (!isAvailable) {
				setError("AI enhancement is disabled");
				return;
			}

			setIsEnhancing(true);
			setError(null);
			setEnhancedPrompt("");

			try {
				const result = await aiService.enhancePrompt(originalPrompt, context);
				setEnhancedPrompt(result.enhanced);
				setEnhancement(result);
				return result;
			} catch (err) {
				setError(err instanceof Error ? err.message : "Enhancement failed");
				throw err;
			} finally {
				setIsEnhancing(false);
			}
		},
		[isAvailable],
	);

	return {
		isEnhancing,
		enhancedPrompt,
		enhancement,
		error,
		enhancePrompt,
	};
}

/**
 * Hook for AI-powered tag generation
 */
export function useAITagGeneration() {
	const [isGenerating, setIsGenerating] = useState(false);
	const [tags, setTags] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const isAvailable = useFeatureFlag("aiTagsEnabled");

	const generateTags = useCallback(
		async (content: string, type: "audio" | "image" | "text" = "text") => {
			if (!isAvailable) {
				setError("AI tag generation is disabled");
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
				setError(err instanceof Error ? err.message : "Tag generation failed");
				throw err;
			} finally {
				setIsGenerating(false);
			}
		},
		[isAvailable],
	);

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
	const [mood, setMood] = useState<string>("neutral");
	const [error, setError] = useState<string | null>(null);
	const isAvailable = useFeatureFlag("aiMoodDetectionEnabled");

	const detectMood = useCallback(
		async (content: string, type: "audio" | "image" | "text" = "text") => {
			if (!isAvailable) {
				setError("AI mood detection is disabled");
				return "neutral";
			}

			setIsDetecting(true);
			setError(null);
			setMood("neutral");

			try {
				const result = await aiService.detectMood(content, type);
				setMood(result);
				return result;
			} catch (err) {
				setError(err instanceof Error ? err.message : "Mood detection failed");
				throw err;
			} finally {
				setIsDetecting(false);
			}
		},
		[isAvailable],
	);

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
	const isAvailable = useFeatureFlag("aiStyleSuggestionsEnabled");

	const suggestStyles = useCallback(
		async (baseStyle: string) => {
			if (!isAvailable) {
				setError("AI style suggestions are disabled");
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
				setError(
					err instanceof Error ? err.message : "Style suggestions failed",
				);
				throw err;
			} finally {
				setIsSuggesting(false);
			}
		},
		[isAvailable],
	);

	return {
		isSuggesting,
		suggestions,
		error,
		suggestStyles,
	};
}
