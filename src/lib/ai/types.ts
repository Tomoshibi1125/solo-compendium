/**
 * AI Integration Types
 * AI-powered enhancements for audio and art generation
 */

import { z } from 'zod';

// AI service types
export const AIServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['pollinations', 'custom']),
  capabilities: z.array(z.enum([
    'enhance-prompt',
    'analyze-image',
    'analyze-audio',
    'generate-tags',
    'detect-mood',
    'suggest-style',
    'filter-content',
    'create-variation',
    'generate-content',
  ])).default([]),
  apiKey: z.string().optional(),
  endpoint: z.string().optional(),
  model: z.string().optional(),
  maxTokens: z.number().default(2048),
  temperature: z.number().min(0).max(2).default(0.7),
  enabled: z.boolean().default(true),
});

export type AIService = z.infer<typeof AIServiceSchema>;
export type AICapability = AIService['capabilities'][number];

// AI request types
export const AIRequestSchema = z.object({
  service: z.string(),
  type: z.enum([
    'enhance-prompt',
    'analyze-image',
    'analyze-audio',
    'generate-tags',
    'detect-mood',
    'suggest-style',
    'filter-content',
    'create-variation',
    'generate-content',
  ]),
  input: z.any(),
  context: z.record(z.string(), z.any()).optional(),
  options: z.record(z.string(), z.any()).optional(),
});

export type AIRequest = z.infer<typeof AIRequestSchema>;

// AI response types
export const AIResponseSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    data: z.any(),
    error: z.string().optional(),
    usage: z.object({
      promptTokens: z.number().optional(),
      completionTokens: z.number().optional(),
      totalTokens: z.number().optional(),
    }).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
  z.object({
    success: z.literal(false),
    data: z.any().optional(),
    error: z.string(),
    usage: z.object({
      promptTokens: z.number().optional(),
      completionTokens: z.number().optional(),
      totalTokens: z.number().optional(),
    }).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
]);

export type AIResponse = z.infer<typeof AIResponseSchema>;

// Audio analysis results
export const AudioAnalysisSchema = z.object({
  mood: z.string(),
  energy: z.number().min(0).max(1),
  tempo: z.number().optional(),
  key: z.string().optional(),
  instruments: z.array(z.string()),
  genre: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
  duration: z.number(),
  loudness: z.number().min(-60).max(0).optional(),
  spectralCentroid: z.number().optional(),
});

export type AudioAnalysis = z.infer<typeof AudioAnalysisSchema>;

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
  autoAnalyzeAudio: boolean;
  autoAnalyzeImages: boolean;
  contentFiltering: boolean;
  maxRequestsPerHour: number;
  cacheResults: boolean;
}

// Default AI services configuration
export const DEFAULT_AI_SERVICES: AIService[] = [
  {
    id: 'pollinations',
    name: 'Pollinations (Free)',
    type: 'pollinations',
    capabilities: [
      'enhance-prompt',
      'analyze-image',
      'analyze-audio',
      'generate-tags',
      'detect-mood',
      'suggest-style',
      'filter-content',
      'create-variation',
      'generate-content',
    ],
    endpoint: 'https://text.pollinations.ai',
    model: 'openai',
    maxTokens: 1024,
    temperature: 0.7,
    enabled: true,
  },
];

const parseBooleanEnv = (value: unknown, fallback: boolean) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
  }
  return fallback;
};

const parseNumberEnv = (value: unknown, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

export const DEFAULT_AI_CONFIG: AIConfiguration = {
  services: DEFAULT_AI_SERVICES,
  defaultService: 'pollinations',
  autoEnhancePrompts: true,
  autoAnalyzeAudio: true,
  autoAnalyzeImages: true,
  contentFiltering: true,
  maxRequestsPerHour: parseNumberEnv(import.meta.env.VITE_AI_MAX_REQUESTS_PER_HOUR, 60),
  cacheResults: parseBooleanEnv(import.meta.env.VITE_AI_CACHE_RESULTS, true),
};

// Helper functions
export function getAIServiceById(id: string, services: AIService[]): AIService | undefined {
  return services.find(service => service.id === id);
}

export function getAIServiceForCapability(capability: AICapability, services: AIService[]): AIService | undefined {
  return services.find(service => 
    service.enabled && service.capabilities.includes(capability)
  );
}

export function validateAIRequest(request: AIRequest): string[] {
  const errors: string[] = [];
  
  if (!request.input) {
    errors.push('Input is required');
  }
  
  const service = getAIServiceById(request.service, DEFAULT_AI_SERVICES);
  if (!service) {
    errors.push(`Unknown AI service: ${request.service}`);
  }
  
  if (service && !service.enabled) {
    errors.push(`AI service is disabled: ${service.name}`);
  }
  
  if (service && !service.capabilities.includes(request.type)) {
    errors.push(`Service ${service.name} doesn't support ${request.type}`);
  }
  
  return errors;
}
