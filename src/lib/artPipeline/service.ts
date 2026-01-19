/**
 * Art Pipeline Service
 * Generates art using Gemini-enhanced prompts with a free image generation backend.
 */

import type { ArtRequest, ArtAsset, ArtMetadata, GenerationResult, GenerationPreset, QueueStatus } from './types.ts';
import { getPreset, buildPrompt, generateCacheKey } from './types.ts';
import { getFeatureFlag } from '@/lib/featureFlags';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/appError';
import { supabase } from '@/integrations/supabase/client';

type PendingItem = QueueStatus['pending'][number];
type RunningItem = QueueStatus['running'][number];

export class ArtPipelineService {
  private enabled: boolean;
  private pending: PendingItem[] = [];
  private running: RunningItem[] = [];
  private controllers: Map<string, AbortController> = new Map();
  private primaryBucket: string;
  private fallbackBucket: string;
  private imageTimeoutMs: number;
  private operationTimeoutMs: number;

  constructor() {
    this.enabled = getFeatureFlag('artGenerationEnabled');
    this.primaryBucket = this.normalizeBucket(import.meta.env.VITE_ART_BUCKET, 'generated-art');
    this.fallbackBucket = this.normalizeBucket(import.meta.env.VITE_ART_BUCKET_FALLBACK, 'custom-tokens');
    this.imageTimeoutMs = this.parseTimeout(import.meta.env.VITE_ART_IMAGE_TIMEOUT_MS, 60000);
    this.operationTimeoutMs = this.parseTimeout(import.meta.env.VITE_ART_OPERATION_TIMEOUT_MS, 20000);
  }

  /**
   * Check if art generation is enabled.
   */
  async isAvailable(): Promise<boolean> {
    return this.enabled;
  }

  /**
   * Generate art for a request.
   */
  async generateArt(request: ArtRequest): Promise<GenerationResult> {
    if (!this.enabled) {
      throw new AppError('Art generation is disabled', 'FEATURE_DISABLED');
    }

    const startTime = Date.now();
    let queueId: string | null = null;

    try {
      // Check cache first
      const cacheKey = generateCacheKey(request);
      const cached = await this.getCachedAsset(cacheKey);
      if (cached) {
        return {
          success: true,
          assetId: cached.id,
          paths: Object.values(cached.paths),
          metadata: cached.metadata,
          duration: Date.now() - startTime,
        };
      }

      // Enqueue
      queueId = this.enqueue(request);
      this.startQueue(queueId);
      const controller = new AbortController();
      this.controllers.set(queueId, controller);

      // Get generation preset
      const preset = getPreset(request.entityType, request.variant);

      // Build prompt
      const prompt = buildPrompt(request, preset);
      const seed = Math.floor(Math.random() * 1_000_000_000);

      const imageUrl = this.getImageEndpoint(prompt, preset, seed);
      let asset: ArtAsset | null = null;

      try {
        const imageBlob = await this.fetchImage(imageUrl, controller.signal);
        asset = await this.processAndSave(request, imageBlob, preset, prompt, startTime, seed, imageUrl);
      } catch (error) {
        if (error instanceof AppError && error.code !== 'GENERATION_FAILED') {
          throw error;
        }
        if (import.meta.env.DEV) {
          logger.warn('Falling back to external image URL:', error);
        }
        asset = await this.processAndSaveExternal(request, imageUrl, preset, prompt, startTime, seed);
      }

      return {
        success: true,
        assetId: asset.id,
        paths: Object.values(asset.paths),
        metadata: asset.metadata,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      logger.error('Art generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
      };
    } finally {
      if (queueId) {
        this.finishQueue(queueId);
      }
    }
  }

  /**
   * Process generated image and save to storage.
   */
  private async processAndSave(
    request: ArtRequest,
    imageBlob: Blob,
    preset: GenerationPreset,
    prompt: string,
    startTime: number,
    seed: number,
    imageUrl: string
  ): Promise<ArtAsset> {
    const cacheKey = generateCacheKey(request);
    const assetId = `art_${cacheKey}_${Date.now()}`;
    const safeEntityType = this.sanitizePathSegment(request.entityType);
    const safeEntityId = this.sanitizePathSegment(request.entityId);
    const safeVariant = this.sanitizePathSegment(request.variant);
    const safeAssetId = this.sanitizePathSegment(assetId);

    const extension = imageBlob.type === 'image/png' ? 'png' : 'jpg';
    const basePath = `${safeEntityType}/${safeEntityId}/${safeAssetId}_${safeVariant}`;
    const originalPath = `${basePath}_original.${extension}`;

    let uploadResult: { bucket: string; publicUrl: string };
    try {
      uploadResult = await this.uploadWithFallback(
        originalPath,
        imageBlob,
        imageBlob.type || 'image/jpeg'
      );
    } catch (error) {
      if (this.isStorageNonFatal(error) || (error instanceof AppError && error.code === 'GENERATION_FAILED')) {
        if (import.meta.env.DEV) {
          logger.warn('Art storage unavailable, saving external-only asset.', error);
        }
        return this.processAndSaveExternal(request, imageUrl, preset, prompt, startTime, seed, false);
      }
      throw new AppError(`Failed to upload art: ${this.formatStorageError(error)}`, 'UNKNOWN', error);
    }
    const { bucket, publicUrl } = uploadResult;

    const buildSizedUrl = (width: number) => {
      try {
        const url = new URL(publicUrl);
        url.searchParams.set('width', width.toString());
        url.searchParams.set('quality', '80');
        url.searchParams.set('format', 'webp');
        return url.toString();
      } catch {
        return publicUrl;
      }
    };

    const paths: { original: string; thumb: string; md: string; lg: string; token?: string } = {
      original: publicUrl,
      lg: buildSizedUrl(1024),
      md: buildSizedUrl(512),
      thumb: buildSizedUrl(256),
    };
    const metadata: ArtMetadata = {
      prompt,
      negative: preset.negativePrompt,
      seed,
      model: 'free-image-api',
      cfg: preset.cfg,
      steps: preset.steps,
      sampler: preset.sampler,
      workflowHash: cacheKey,
      timestamps: {
        started: new Date(startTime).toISOString(),
        completed: new Date().toISOString(),
        duration: Date.now() - startTime,
      },
      dimensions: {
        width: preset.width,
        height: preset.height,
      },
      fileSize: imageBlob.size,
      mimeType: imageBlob.type || 'image/jpeg',
    };

    if (request.variant === 'portrait') {
      paths.token = buildSizedUrl(256);
    }

    // Save metadata
    let metadataPath = `${safeEntityType}/${safeEntityId}/${safeAssetId}_metadata.json`;
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    try {
      await this.uploadToBucket(bucket, metadataPath, metadataBlob, 'application/json');
    } catch (error) {
      if (this.isStorageNonFatal(error) || (error instanceof AppError && error.code === 'GENERATION_FAILED')) {
        if (import.meta.env.DEV) {
          logger.warn('Art metadata storage failed; storing metadata inline only.', error);
        }
        metadataPath = this.buildExternalMetadataPath(request, assetId);
      } else {
        throw new AppError(`Failed to upload art metadata: ${this.formatStorageError(error)}`, 'UNKNOWN', error);
      }
    }

    const asset: ArtAsset = {
      id: assetId,
      entityType: request.entityType,
      entityId: request.entityId,
      variant: request.variant,
      paths,
      dimensions: {
        width: preset.width,
        height: preset.height,
      },
      fileSize: imageBlob.size,
      mimeType: imageBlob.type || 'image/jpeg',
      metadataPath,
      metadata,
      hash: cacheKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.saveAssetRecord(asset);

    return asset;
  }

  private async processAndSaveExternal(
    request: ArtRequest,
    imageUrl: string,
    preset: GenerationPreset,
    prompt: string,
    startTime: number,
    seed: number,
    storeMetadata: boolean = true
  ): Promise<ArtAsset> {
    const cacheKey = generateCacheKey(request);
    const assetId = `art_${cacheKey}_${Date.now()}`;
    const safeEntityType = this.sanitizePathSegment(request.entityType);
    const safeEntityId = this.sanitizePathSegment(request.entityId);
    const safeAssetId = this.sanitizePathSegment(assetId);
    const paths: { original: string; thumb: string; md: string; lg: string; token?: string } = {
      original: imageUrl,
      lg: imageUrl,
      md: imageUrl,
      thumb: imageUrl,
    };

    if (request.variant === 'portrait') {
      paths.token = imageUrl;
    }

    const metadata: ArtMetadata = {
      prompt,
      negative: preset.negativePrompt,
      seed,
      model: 'free-image-api',
      cfg: preset.cfg,
      steps: preset.steps,
      sampler: preset.sampler,
      workflowHash: cacheKey,
      timestamps: {
        started: new Date(startTime).toISOString(),
        completed: new Date().toISOString(),
        duration: Date.now() - startTime,
      },
      dimensions: {
        width: preset.width,
        height: preset.height,
      },
      fileSize: 0,
      mimeType: 'image/jpeg',
    };

    let metadataPath = this.buildExternalMetadataPath(request, assetId);
    if (storeMetadata) {
      const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
      try {
        const { bucket } = await this.uploadWithFallback(
          `${safeEntityType}/${safeEntityId}/${safeAssetId}_metadata.json`,
          metadataBlob,
          'application/json'
        );
        metadataPath = `${safeEntityType}/${safeEntityId}/${safeAssetId}_metadata.json`;
        if (import.meta.env.DEV && bucket !== this.primaryBucket) {
          logger.warn(`Art metadata stored in fallback bucket: ${bucket}`);
        }
      } catch (error) {
        if (this.isStorageNonFatal(error) || (error instanceof AppError && error.code === 'GENERATION_FAILED')) {
          if (import.meta.env.DEV) {
            logger.warn('Art metadata bucket missing; storing metadata inline only.', error);
          }
        } else {
          throw new AppError(`Failed to upload art metadata: ${this.formatStorageError(error)}`, 'UNKNOWN', error);
        }
      }
    }

    const asset: ArtAsset = {
      id: assetId,
      entityType: request.entityType,
      entityId: request.entityId,
      variant: request.variant,
      paths,
      dimensions: {
        width: preset.width,
        height: preset.height,
      },
      fileSize: 0,
      mimeType: 'image/jpeg',
      metadataPath,
      metadata,
      hash: cacheKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.saveAssetRecord(asset);

    return asset;
  }

  private async uploadWithFallback(
    path: string,
    blob: Blob,
    contentType: string
  ): Promise<{ bucket: string; publicUrl: string }> {
    const primary = this.primaryBucket || 'generated-art';
    const fallback = this.fallbackBucket || '';

    try {
      return await this.uploadToBucket(primary, path, blob, contentType);
    } catch (error) {
      if (fallback && fallback !== primary) {
        if (import.meta.env.DEV) {
          logger.warn('Primary art storage bucket failed, retrying with fallback.', error);
        }
        try {
          return await this.uploadToBucket(fallback, path, blob, contentType);
        } catch (fallbackError) {
          throw new AppError(
            `Failed to upload art (${this.formatStorageError(error)}; fallback failed: ${this.formatStorageError(fallbackError)})`,
            'UNKNOWN',
            fallbackError
          );
        }
      }
      throw new AppError(`Failed to upload art: ${this.formatStorageError(error)}`, 'UNKNOWN', error);
    }
  }

  private async uploadToBucket(
    bucket: string,
    path: string,
    blob: Blob,
    contentType: string
  ): Promise<{ bucket: string; publicUrl: string }> {
    const { error } = await this.withTimeout(
      supabase.storage
        .from(bucket)
        .upload(path, blob, {
          upsert: true,
          contentType,
          cacheControl: '3600',
        }),
      this.operationTimeoutMs,
      'Art storage upload timed out'
    );

    if (error) {
      throw error;
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
    return { bucket, publicUrl: publicData.publicUrl };
  }

  private formatStorageError(error: unknown): string {
    if (!error) return 'Unknown storage error';
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (typeof error === 'object' && 'message' in error) {
      return String((error as { message?: unknown }).message);
    }
    return 'Storage error';
  }

  private getStatusCode(error: unknown): number | undefined {
    if (!error || typeof error !== 'object') return undefined;
    if ('statusCode' in error && typeof (error as { statusCode?: unknown }).statusCode === 'number') {
      return (error as { statusCode?: number }).statusCode;
    }
    if ('status' in error && typeof (error as { status?: unknown }).status === 'number') {
      return (error as { status?: number }).status;
    }
    return undefined;
  }

  private isBucketMissingError(error: unknown): boolean {
    const status = this.getStatusCode(error);
    if (status === 404) return true;
    const message = this.formatStorageError(error).toLowerCase();
    return message.includes('bucket') && (message.includes('not found') || message.includes('does not exist'));
  }

  private isUnsupportedMimeError(error: unknown): boolean {
    const status = this.getStatusCode(error);
    if (status === 415) return true;
    const message = this.formatStorageError(error).toLowerCase();
    return (
      message.includes('mime') ||
      message.includes('content type') ||
      message.includes('unsupported media')
    );
  }

  private isStorageNonFatal(error: unknown): boolean {
    const status = this.getStatusCode(error);
    if (this.isBucketMissingError(error)) return true;
    if (this.isUnsupportedMimeError(error)) return true;
    if (status === 400) {
      const message = this.formatStorageError(error).toLowerCase();
      if (message.includes('bad request') || message.includes('invalid') || message.includes('malformed')) {
        return true;
      }
    }
    return false;
  }

  private buildExternalMetadataPath(request: ArtRequest, assetId: string): string {
    const safeEntityType = this.sanitizePathSegment(request.entityType);
    const safeEntityId = this.sanitizePathSegment(request.entityId);
    const safeAssetId = this.sanitizePathSegment(assetId);
    return `external://${safeEntityType}/${safeEntityId}/${safeAssetId}_metadata.json`;
  }

  private sanitizePathSegment(value: string): string {
    return value.replace(/[^a-z0-9._-]/gi, '_');
  }

  private async withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number, message: string): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => reject(new AppError(message, 'GENERATION_FAILED')), timeoutMs);
    });
    try {
      return await Promise.race([Promise.resolve(promise), timeoutPromise]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  private mergeSignals(primary: AbortSignal, secondary: AbortSignal): AbortSignal {
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    if (primary.aborted || secondary.aborted) {
      controller.abort();
      return controller.signal;
    }
    primary.addEventListener('abort', onAbort, { once: true });
    secondary.addEventListener('abort', onAbort, { once: true });
    return controller.signal;
  }

  private parseTimeout(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt((value || '').trim(), 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return fallback;
  }

  private normalizeBucket(value: string | undefined, fallback: string): string {
    const trimmed = (value || '').trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }

  private enqueue(request: ArtRequest): string {
    const id = `${generateCacheKey(request)}-${Date.now()}`;
    this.pending.push({
      id,
      title: request.title,
      queued_at: new Date().toISOString(),
    });
    return id;
  }

  private startQueue(queueId: string): void {
    const index = this.pending.findIndex((item) => item.id === queueId);
    const item = index >= 0 ? this.pending.splice(index, 1)[0] : null;
    this.running.push({
      id: queueId,
      title: item?.title || 'Art generation',
      started_at: new Date().toISOString(),
    });
  }

  private finishQueue(queueId: string): void {
    this.running = this.running.filter((item) => item.id !== queueId);
    this.controllers.delete(queueId);
  }

  private getImageEndpoint(prompt: string, preset: GenerationPreset, seed: number): string {
    const base = (import.meta.env.VITE_FREE_IMAGE_API || 'https://image.pollinations.ai/prompt/').trim();
    const encodedPrompt = encodeURIComponent(prompt);
    const baseUrl = base.includes('{prompt}')
      ? base.replace('{prompt}', encodedPrompt)
      : `${base.replace(/\/$/, '')}/${encodedPrompt}`;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const url = new URL(baseUrl, origin);
    url.searchParams.set('width', preset.width.toString());
    url.searchParams.set('height', preset.height.toString());
    url.searchParams.set('seed', seed.toString());
    url.searchParams.set('nologo', 'true');
    return url.toString();
  }

  private async fetchImage(
    imageUrl: string,
    signal: AbortSignal
  ): Promise<Blob> {
    const timeoutController = new AbortController();
    const combinedSignal = this.mergeSignals(signal, timeoutController.signal);
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      const fetchPromise = (async () => {
        const response = await fetch(imageUrl, {
          method: 'GET',
          signal: combinedSignal,
        });

        if (!response.ok) {
          throw new AppError(`Image generation failed: ${response.statusText}`, 'GENERATION_FAILED');
        }

        const blob = await response.blob();
        if (!blob || blob.size === 0) {
          throw new AppError('Image generation returned empty content', 'GENERATION_FAILED');
        }
        return blob;
      })();

      const timeoutPromise = new Promise<Blob>((_, reject) => {
        timeoutId = setTimeout(() => {
          timeoutController.abort();
          reject(new AppError('Image generation timed out', 'GENERATION_FAILED'));
        }, this.imageTimeoutMs);
      });

      return await Promise.race([fetchPromise, timeoutPromise]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  /**
   * Get cached asset
   */
  private async getCachedAsset(cacheKey: string): Promise<ArtAsset | null> {
    try {
      const { data, error } = await this.withTimeout(
        supabase
          .from('art_assets')
          .select('*')
          .eq('hash', cacheKey)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        this.operationTimeoutMs,
        'Art cache lookup timed out'
      );

      if (error || !data) return null;
      return this.toArtAsset(data);
    } catch (error) {
      logger.warn('Failed to load cached art asset:', error);
      return null;
    }
  }

  private toArtAsset(row: any): ArtAsset {
    return {
      id: row.id,
      entityType: row.entity_type,
      entityId: row.entity_id,
      variant: row.variant,
      paths: row.paths,
      dimensions: row.dimensions,
      fileSize: row.file_size,
      mimeType: row.mime_type,
      metadataPath: row.metadata_path,
      metadata: row.metadata,
      hash: row.hash,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Save asset record to database
   */
  private async saveAssetRecord(asset: ArtAsset): Promise<void> {
    try {
      const { error } = await this.withTimeout(
        supabase
          .from('art_assets')
          .upsert({
            id: asset.id,
            entity_type: asset.entityType,
            entity_id: asset.entityId,
            variant: asset.variant,
            paths: asset.paths,
            dimensions: asset.dimensions,
            file_size: asset.fileSize,
            mime_type: asset.mimeType,
            metadata_path: asset.metadataPath,
            metadata: asset.metadata,
            hash: asset.hash,
          }, {
            onConflict: 'entity_type,entity_id,variant',
          }),
        this.operationTimeoutMs,
        'Art asset save timed out'
      );

      if (error) {
        throw new AppError(`Failed to save asset: ${error.message}`, 'UNKNOWN');
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to save asset record', 'UNKNOWN');
    }
  }

  /**
   * Get asset by ID
   */
  async getAsset(assetId: string): Promise<ArtAsset | null> {
    const { data, error } = await this.withTimeout(
      supabase
        .from('art_assets')
        .select('*')
        .eq('id', assetId)
        .maybeSingle(),
      this.operationTimeoutMs,
      'Art asset lookup timed out'
    );

    if (error || !data) return null;
    return this.toArtAsset(data);
  }

  /**
   * Get assets for entity
   */
  async getAssetsForEntity(entityType: string, entityId: string): Promise<ArtAsset[]> {
    const { data, error } = await this.withTimeout(
      supabase
        .from('art_assets')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false }),
      this.operationTimeoutMs,
      'Art asset lookup timed out'
    );

    if (error || !data) return [];
    return data.map((row) => this.toArtAsset(row));
  }

  /**
   * Batch generate art for multiple entities
   */
  async batchGenerate(requests: ArtRequest[]): Promise<GenerationResult[]> {
    const results: GenerationResult[] = [];
    
    for (const request of requests) {
      try {
        const result = await this.generateArt(request);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    return results;
  }

  /**
   * Get queue status
   */
  async getQueueStatus(): Promise<QueueStatus> {
    return {
      running: [...this.running],
      pending: [...this.pending],
    };
  }

  /**
   * Clear generation queue
   */
  async clearQueue(): Promise<void> {
    this.pending = [];
  }

  /**
   * Interrupt current generation
   */
  async interrupt(): Promise<void> {
    for (const controller of this.controllers.values()) {
      controller.abort();
    }
    this.controllers.clear();
    this.running = [];
  }
}

// Singleton instance
export const artPipeline = new ArtPipelineService();
