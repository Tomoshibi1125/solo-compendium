/**
 * AI Integration Types
 * AI-powered enhancements for art generation
 */

import { z } from "zod";

// AI service types
export const AIServiceSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(["gemini-native", "pollinations", "ollama", "custom"]),
	capabilities: z
		.array(
			z.enum([
				"enhance-prompt",
				"analyze-image",
				"generate-tags",
				"detect-mood",
				"suggest-style",
				"filter-content",
				"create-variation",
				"generate-content",
				"generate-regents",
				"generate-fusion",
				"generate-quests",
				"generate-optimizations",
			]),
		)
		.default([]),
	apiKey: z.string().optional(),
	endpoint: z.string().optional(),
	model: z.string().optional(),
	fallbackModels: z.array(z.string()).optional(),
	maxTokens: z.number().default(2048),
	temperature: z.number().min(0).max(2).default(0.7),
	enabled: z.boolean().default(true),
});

export type AIService = z.infer<typeof AIServiceSchema>;

// AI request types
export const AIRequestSchema = z.object({
	service: z.string(),
	type: z.enum([
		"enhance-prompt",
		"analyze-image",
		"generate-tags",
		"detect-mood",
		"suggest-style",
		"filter-content",
		"create-variation",
		"generate-content",
		"generate-regents",
		"generate-fusion",
		"generate-quests",
		"generate-optimizations",
	]),
	input: z.unknown(),
	context: z.record(z.string(), z.unknown()).optional(),
	options: z.record(z.string(), z.unknown()).optional(),
});

export type AIRequest = z.infer<typeof AIRequestSchema>;

// AI response types
export const AIResponseSchema = z.discriminatedUnion("success", [
	z.object({
		success: z.literal(true),
		data: z.unknown(),
		error: z.string().optional(),
		usage: z
			.object({
				promptTokens: z.number().optional(),
				completionTokens: z.number().optional(),
				totalTokens: z.number().optional(),
			})
			.optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),
	z.object({
		success: z.literal(false),
		data: z.unknown().optional(),
		error: z.string(),
		usage: z
			.object({
				promptTokens: z.number().optional(),
				completionTokens: z.number().optional(),
				totalTokens: z.number().optional(),
			})
			.optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),
]);

export type AIResponse = z.infer<typeof AIResponseSchema>;

// Image analysis results
export const ImageAnalysisSchema = z.object({
	description: z.string(),
	tags: z.array(z.string()),
	style: z.string(),
	mood: z.string(),
	colors: z.array(z.string()),
	composition: z.string(),
	subjects: z.array(z.string()),
	quality: z.number().min(1).max(10),
	technical: z.object({
		resolution: z.string(),
		aspectRatio: z.string(),
		sharpness: z.number().min(1).max(10),
		brightness: z.number().min(0).max(1),
		contrast: z.number().min(0).max(1),
	}),
	suggestions: z.array(z.string()).default([]),
});

export type ImageAnalysis = z.infer<typeof ImageAnalysisSchema>;

// Prompt enhancement results
export const PromptEnhancementSchema = z.object({
	original: z.string(),
	enhanced: z.string(),
	additions: z.array(z.string()).default([]),
	improvements: z.array(z.string()).default([]),
	style: z.string(),
	mood: z.string(),
	technical: z.object({
		weight: z.string(),
		steps: z.number(),
		cfg: z.number(),
		sampler: z.string(),
		scheduler: z.string(),
	}),
});

export type PromptEnhancement = z.infer<typeof PromptEnhancementSchema>;

// AI configuration
export interface AIConfiguration {
	services: AIService[];
	defaultService: string;
	autoEnhancePrompts: boolean;
	autoAnalyzeImages: boolean;
	contentFiltering: boolean;
	maxRequestsPerHour: number;
	cacheResults: boolean;
}

// Default AI services configuration
export const DEFAULT_AI_SERVICES: AIService[] = [
	{
		id: "gemini-native",
		name: "Free AI — Gemini 3.5 Flash + free fallbacks",
		type: "gemini-native",
		capabilities: [
			"enhance-prompt",
			"analyze-image",
			"generate-tags",
			"detect-mood",
			"suggest-style",
			"filter-content",
			"create-variation",
			"generate-content",
			"generate-regents",
			"generate-fusion",
			"generate-quests",
			"generate-optimizations",
		],
		endpoint: "",
		// Display label only — the proxy's server-side ladder picks the model.
		model: "gemini-3.5-flash",
		maxTokens: 4096,
		temperature: 0.8,
		enabled: true,
	},
	{
		id: "pollinations",
		name: "Pollinations AI (Legacy)",
		type: "pollinations",
		capabilities: ["generate-content"],
		endpoint: "https://text.pollinations.ai",
		model: "openai",
		fallbackModels: ["mistral"],
		maxTokens: 2048,
		temperature: 0.7,
		enabled: false,
	},
	{
		id: "ollama-fallback",
		name: "Ollama Local Fallback (Legacy)",
		type: "ollama",
		capabilities: ["generate-content"],
		endpoint: "http://localhost:11434/api/generate",
		model: "qwen2.5:14b-instruct",
		fallbackModels: [
			"qwen2.5:7b-instruct",
			"llama3.1:8b-instruct",
			"mistral:7b-instruct",
		],
		maxTokens: 1536,
		temperature: 0.7,
		enabled: false,
	},
];

const parseBooleanEnv = (value: unknown, fallback: boolean) => {
	if (value === undefined || value === null) return fallback;
	if (typeof value === "boolean") return value;
	if (typeof value === "string") {
		if (value === "true" || value === "1") return true;
		if (value === "false" || value === "0") return false;
	}
	return fallback;
};

const parseNumberEnv = (value: unknown, fallback: number) => {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return fallback;
};

export const DEFAULT_AI_CONFIG: AIConfiguration = {
	services: DEFAULT_AI_SERVICES,
	defaultService: "gemini-native",
	autoEnhancePrompts: true,
	autoAnalyzeImages: true,
	contentFiltering: true,
	maxRequestsPerHour: parseNumberEnv(
		import.meta.env.VITE_AI_MAX_REQUESTS_PER_HOUR,
		60,
	),
	cacheResults: parseBooleanEnv(import.meta.env.VITE_AI_CACHE_RESULTS, true),
};

// Helper functions
export function getAIServiceById(
	id: string,
	services: AIService[],
): AIService | undefined {
	return services.find((service) => service.id === id);
}
