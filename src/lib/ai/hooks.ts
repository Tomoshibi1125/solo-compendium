import { useCallback } from "react";
import type { ImageAnalysis, PromptEnhancement } from "./types";

const RETIRED = "General AI features were retired in A1.";

export function useAIEnhancement() {
	const enhancePrompt = useCallback(
		async (_originalPrompt: string, _context?: Record<string, unknown>) =>
			undefined as PromptEnhancement | undefined,
		[],
	);
	return {
		isEnhancing: false,
		enhancedPrompt: "",
		enhancement: null as PromptEnhancement | null,
		error: RETIRED,
		enhancePrompt,
	};
}

export function useAITagGeneration() {
	const generateTags = useCallback(
		async (_content: string, _type: "audio" | "image" | "text" = "text") =>
			[] as string[],
		[],
	);
	return {
		isGenerating: false,
		tags: [] as string[],
		error: RETIRED,
		generateTags,
	};
}

export function useAIMoodDetection() {
	const detectMood = useCallback(
		async (_content: string, _type: "audio" | "image" | "text" = "text") =>
			"neutral",
		[],
	);
	return { isDetecting: false, mood: "neutral", error: RETIRED, detectMood };
}

export function useAIImageAnalysis() {
	const analyzeImage = useCallback(
		async (_imageUrl: string) => null as ImageAnalysis | null,
		[],
	);
	return {
		isAnalyzing: false,
		analysis: null as ImageAnalysis | null,
		error: RETIRED,
		analyzeImage,
	};
}

export function useAIStyleSuggestions() {
	const suggestStyles = useCallback(
		async (_baseStyle: string) => [] as string[],
		[],
	);
	return {
		isSuggesting: false,
		suggestions: [] as string[],
		error: RETIRED,
		suggestStyles,
	};
}
