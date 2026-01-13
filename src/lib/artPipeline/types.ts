/**
 * Art Pipeline Types
 * Stable Diffusion integration with ComfyUI
 */

import { z } from 'zod';

// Art request types
export const ArtRequestSchema = z.object({
  entityType: z.enum(['monster', 'item', 'spell', 'location', 'job', 'background']),
  entityId: z.string(),
  variant: z.enum(['portrait', 'token', 'icon', 'illustration', 'banner']).default('portrait'),
  title: z.string(),
  tags: z.array(z.string()).default([]),
  description: z.string().optional(),
  rarityOrCR: z.string().optional(),
  environment: z.string().optional(),
  mood: z.string().optional(),
  extraLore: z.string().optional(),
});

export type ArtRequest = z.infer<typeof ArtRequestSchema>;

// Generated art metadata
export const ArtMetadataSchema = z.object({
  prompt: z.string(),
  negative: z.string(),
  seed: z.number(),
  model: z.string(),
  cfg: z.number(),
  steps: z.number(),
  sampler: z.string(),
  workflowHash: z.string(),
  timestamps: z.object({
    started: z.string(),
    completed: z.string(),
    duration: z.number(),
  }),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }),
  fileSize: z.number(),
  mimeType: z.string(),
});

export type ArtMetadata = z.infer<typeof ArtMetadataSchema>;

// Art asset record
export const ArtAssetSchema = z.object({
  id: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  variant: z.string(),
  paths: z.object({
    original: z.string(),
    thumb: z.string(),
    md: z.string(),
    lg: z.string(),
    token: z.string().optional(),
  }),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }),
  fileSize: z.number(),
  mimeType: z.string(),
  metadataPath: z.string(),
  metadata: ArtMetadataSchema,
  hash: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ArtAsset = z.infer<typeof ArtAssetSchema>;

// ComfyUI API types
export interface ComfyUIPrompt {
  prompt: Record<string, ComfyUINode>;
  client_id?: string;
}

export interface ComfyUINode {
  inputs: Record<string, any>;
  class_type: string;
}

export interface ComfyUIResponse {
  prompt_id: string;
  number: number;
  node_errors: Record<string, any>;
}

export interface ComfyUIHistory {
  [prompt_id: string]: {
    prompt: ComfyUIPrompt;
    status: {
      status_str: string;
      completed: boolean;
      queue_remaining: number;
    };
    outputs: {
      [node_id: string]: {
        images: Array<{
          filename: string;
          subfolder: string;
          type: string;
        }>;
      };
    };
  };
}

// Generation presets for different asset types
export interface GenerationPreset {
  workflow: string;
  width: number;
  height: number;
  promptTemplate: string;
  negativePrompt: string;
  steps: number;
  cfg: number;
  sampler: string;
  scheduler: string;
}

export const GENERATION_PRESETS: Record<string, GenerationPreset> = {
  'monster-portrait': {
    workflow: 'sdxl_text2image.json',
    width: 1024,
    height: 1024,
    promptTemplate: 'dark manhwa anime cinematic fantasy, Solo Leveling style, {title} {description}, dramatic lighting, high contrast, detailed character art, dynamic pose, {tags}',
    negativePrompt: 'low quality, blurry, pixelated, distorted, bad anatomy, poorly drawn face, mutation, duplicate, ugly, disfigured, jpeg artifacts',
    steps: 20,
    cfg: 7.5,
    sampler: 'dpmpp_2m',
    scheduler: 'karras',
  },
  'monster-token': {
    workflow: 'sdxl_text2image.json',
    width: 512,
    height: 512,
    promptTemplate: 'dark manhwa anime style, Solo Leveling, {title} token art, circular composition, high contrast, {tags}',
    negativePrompt: 'low quality, blurry, pixelated, distorted, bad anatomy, poorly drawn face, mutation, duplicate, ugly, disfigured, jpeg artifacts',
    steps: 15,
    cfg: 7.0,
    sampler: 'dpmpp_2m',
    scheduler: 'karras',
  },
  'item-icon': {
    workflow: 'sdxl_text2image.json',
    width: 256,
    height: 256,
    promptTemplate: 'dark manhwa anime style, Solo Leveling, {title} icon, detailed item, high contrast, {tags}',
    negativePrompt: 'low quality, blurry, pixelated, distorted, bad anatomy, poorly drawn face, mutation, duplicate, ugly, disfigured, jpeg artifacts',
    steps: 15,
    cfg: 7.0,
    sampler: 'dpmpp_2m',
    scheduler: 'karras',
  },
  'item-illustration': {
    workflow: 'sdxl_text2image.json',
    width: 1024,
    height: 768,
    promptTemplate: 'dark manhwa anime cinematic fantasy, Solo Leveling style, {title} {description}, dramatic lighting, high contrast, detailed item art, {tags}',
    negativePrompt: 'low quality, blurry, pixelated, distorted, bad anatomy, poorly drawn face, mutation, duplicate, ugly, disfigured, jpeg artifacts',
    steps: 20,
    cfg: 7.5,
    sampler: 'dpmpp_2m',
    scheduler: 'karras',
  },
  'spell-illustration': {
    workflow: 'sdxl_text2image.json',
    width: 1024,
    height: 768,
    promptTemplate: 'dark manhwa anime magical fantasy, Solo Leveling style, {title} spell effect, magical energy, dramatic lighting, high contrast, {tags}',
    negativePrompt: 'low quality, blurry, pixelated, distorted, bad anatomy, poorly drawn face, mutation, duplicate, ugly, disfigured, jpeg artifacts',
    steps: 20,
    cfg: 7.5,
    sampler: 'dpmpp_2m',
    scheduler: 'karras',
  },
  'location-banner': {
    workflow: 'sdxl_text2image.json',
    width: 1920,
    height: 512,
    promptTemplate: 'dark manhwa anime cinematic landscape, Solo Leveling style, {title} {description}, epic environment, dramatic lighting, high contrast, {tags}',
    negativePrompt: 'low quality, blurry, pixelated, distorted, bad anatomy, poorly drawn face, mutation, duplicate, ugly, disfigured, jpeg artifacts',
    steps: 25,
    cfg: 7.5,
    sampler: 'dpmpp_2m',
    scheduler: 'karras',
  },
  'job-emblem': {
    workflow: 'sdxl_text2image.json',
    width: 512,
    height: 512,
    promptTemplate: 'dark manhwa anime style, Solo Leveling, {title} job emblem, sigil design, high contrast, {tags}',
    negativePrompt: 'low quality, blurry, pixelated, distorted, bad anatomy, poorly drawn face, mutation, duplicate, ugly, disfigured, jpeg artifacts',
    steps: 15,
    cfg: 7.0,
    sampler: 'dpmpp_2m',
    scheduler: 'karras',
  },
};

// Queue status
export interface QueueStatus {
  running: Array<{
    prompt_id: string;
    prompt: ComfyUIPrompt;
    number: number;
  }>;
  pending: Array<{
    prompt_id: string;
    prompt: ComfyUIPrompt;
    number: number;
  }>;
}

// Generation result
export interface GenerationResult {
  success: boolean;
  assetId?: string;
  paths?: string[];
  metadata?: ArtMetadata;
  error?: string;
  duration?: number;
}

// Helper functions
export function getPreset(entityType: string, variant: string): GenerationPreset {
  const key = `${entityType}-${variant}`;
  return GENERATION_PRESETS[key] || GENERATION_PRESETS['monster-portrait'];
}

export function buildPrompt(request: ArtRequest, preset: GenerationPreset): string {
  return preset.promptTemplate
    .replace('{title}', request.title)
    .replace('{description}', request.description || '')
    .replace('{tags}', request.tags.join(', '))
    .replace('{rarity}', request.rarityOrCR || '')
    .replace('{environment}', request.environment || '')
    .replace('{mood}', request.mood || '')
    .replace('{lore}', request.extraLore || '');
}

export function generateCacheKey(request: ArtRequest): string {
  const parts = [
    request.entityType,
    request.entityId,
    request.variant,
    request.title,
    request.tags.join(','),
    request.description || '',
    request.rarityOrCR || '',
  ];
  return parts.join('|').toLowerCase().replace(/[^a-z0-9|]/g, '_');
}
