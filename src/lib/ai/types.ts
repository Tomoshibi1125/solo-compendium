/**
 * Legacy AI integration types retained only so older UI modules can compile
 * while A1 removes general-purpose provider access. No provider endpoints or
 * default provider configuration live in the client anymore.
 */

import { z } from "zod";

export const AIServiceSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(["gemini-native", "pollinations", "ollama", "custom"]),
	capabilities: z.array(z.string()).default([]),
	apiKey: z.string().optional(),
	endpoint: z.string().optional(),
	model: z.string().optional(),
	fallbackModels: z.array(z.string()).optional(),
	maxTokens: z.number().default(0),
	temperature: z.number().default(0),
	enabled: z.boolean().default(false),
});

export type AIService = z.infer<typeof AIServiceSchema>;

export const AIRequestSchema = z.object({
	service: z.string(),
	type: z.string(),
	input: z.unknown(),
	context: z.record(z.string(), z.unknown()).optional(),
	options: z.record(z.string(), z.unknown()).optional(),
});

export type AIRequest = z.infer<typeof AIRequestSchema>;

export const AIResponseSchema = z.discriminatedUnion("success", [
	z.object({
		success: z.literal(true),
		data: z.unknown(),
		error: z.string().optional(),
		usage: z.record(z.string(), z.number()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),
	z.object({
		success: z.literal(false),
		data: z.unknown().optional(),
		error: z.string(),
		usage: z.record(z.string(), z.number()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),
]);

export type AIResponse = z.infer<typeof AIResponseSchema>;

export const ImageAnalysisSchema = z.object({
	description: z.string(),
	tags: z.array(z.string()),
	style: z.string(),
	mood: z.string(),
	colors: z.array(z.string()),
	composition: z.string(),
	subjects: z.array(z.string()),
	quality: z.number(),
	technical: z.object({
		resolution: z.string(),
		aspectRatio: z.string(),
		sharpness: z.number(),
		brightness: z.number(),
		contrast: z.number(),
	}),
	suggestions: z.array(z.string()).default([]),
});

export type ImageAnalysis = z.infer<typeof ImageAnalysisSchema>;

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

export interface AIConfiguration {
	services: AIService[];
	defaultService: string;
	autoEnhancePrompts: boolean;
	autoAnalyzeImages: boolean;
	contentFiltering: boolean;
	maxRequestsPerHour: number;
	cacheResults: boolean;
}

export const DEFAULT_AI_SERVICES: AIService[] = [];

export const DEFAULT_AI_CONFIG: AIConfiguration = {
	services: [],
	defaultService: "",
	autoEnhancePrompts: false,
	autoAnalyzeImages: false,
	contentFiltering: false,
	maxRequestsPerHour: 0,
	cacheResults: false,
};

export function getAIServiceById(
	id: string,
	services: AIService[],
): AIService | undefined {
	return services.find((service) => service.id === id);
}
