/**
 * Art Pipeline Service
 * Main service for generating and managing art assets
 */

import { comfyClient } from './comfyClient.ts';
import type { 
  ArtRequest, 
  ArtAsset, 
  ArtMetadata, 
  GenerationResult, 
  GenerationPreset 
} from './types.ts';
import { getPreset, buildPrompt, generateCacheKey } from './types.ts';
import { getFeatureFlag } from '@/lib/featureFlags';
import { AppError } from '@/lib/appError';

export class ArtPipelineService {
  private cacheDir: string;
  private enabled: boolean;

  constructor(cacheDir: string = './public/generated') {
    this.cacheDir = cacheDir;
    this.enabled = getFeatureFlag('artGenerationEnabled');
  }

  /**
   * Check if art generation is enabled and ComfyUI is available
   */
  async isAvailable(): Promise<boolean> {
    if (!this.enabled) return false;
    return await comfyClient.healthCheck();
  }

  /**
   * Generate art for a request
   */
  async generateArt(request: ArtRequest): Promise<GenerationResult> {
    if (!this.enabled) {
      throw new AppError('Art generation is disabled', 'FEATURE_DISABLED');
    }

    const startTime = Date.now();

    try {
      // Check if ComfyUI is available
      const isHealthy = await comfyClient.healthCheck();
      if (!isHealthy) {
        throw new AppError('ComfyUI server is not running', 'SERVICE_UNAVAILABLE');
      }

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

      // Get generation preset
      const preset = getPreset(request.entityType, request.variant);

      // Load workflow
      const workflow = await comfyClient.loadWorkflow(`/art/workflows/${preset.workflow}`);

      // Build prompt
      const prompt = buildPrompt(request, preset);

      // Modify workflow
      const modifiedWorkflow = comfyClient.modifyWorkflow(workflow, {
        prompt,
        negative: preset.negativePrompt,
        width: preset.width,
        height: preset.height,
        steps: preset.steps,
        cfg: preset.cfg,
        sampler: preset.sampler,
        scheduler: preset.scheduler,
        seed: Math.floor(Math.random() * 1000000),
      });

      // Generate image
      const result = await comfyClient.generateImage(modifiedWorkflow);

      if (result.images.length === 0) {
        throw new AppError('No images generated', 'GENERATION_FAILED');
      }

      // Process and save images
      const asset = await this.processAndSave(request, result, preset, startTime);

      return {
        success: true,
        assetId: asset.id,
        paths: Object.values(asset.paths),
        metadata: asset.metadata,
        duration: Date.now() - startTime,
      };

    } catch (error) {
      console.error('Art generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Process generated images and save to cache
   */
  private async processAndSave(
    request: ArtRequest,
    generationResult: any,
    preset: GenerationPreset,
    startTime: number
  ): Promise<ArtAsset> {
    const cacheKey = generateCacheKey(request);
    const assetId = `art_${cacheKey}_${Date.now()}`;
    
    // Create directory structure
    const entityDir = `${this.cacheDir}/${request.entityType}s`;
    const assetDir = `${entityDir}/${request.entityId}`;
    
    // Ensure directories exist (in a real implementation, you'd use fs.mkdir)
    // await fs.mkdir(entityDir, { recursive: true });
    // await fs.mkdir(assetDir, { recursive: true });

    const paths: { original: string; thumb: string; md: string; lg: string; token?: string } = {} as any;
    const metadata: ArtMetadata = {
      prompt: buildPrompt(request, preset),
      negative: preset.negativePrompt,
      seed: 0, // Would be extracted from workflow
      model: 'sdxl_base_1.0.safetensors',
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
      fileSize: 0, // Would be calculated from saved file
      mimeType: 'image/jpeg',
    };

    // Process each generated image
    for (let i = 0; i < generationResult.images.length; i++) {
      const image = generationResult.images[i];
      const blob = image.blob;
      
      // Generate different sizes
      const sizes = [
        { name: 'original', width: preset.width, height: preset.height },
        { name: 'lg', width: 1024, height: 1024 },
        { name: 'md', width: 512, height: 512 },
        { name: 'thumb', width: 256, height: 256 },
      ];

      for (const size of sizes) {
        const filename = `${request.variant}_${size.name}.jpg`;
        const path = `${assetDir}/${filename}`;
        
        // In a real implementation, you'd:
        // 1. Resize the image to the target size
        // 2. Save the file
        // await fs.writeFile(path, Buffer.from(await blob.arrayBuffer()));
        
        paths[size.name] = path;
      }

      // Generate token variant if needed
      if (request.variant === 'portrait') {
        const tokenPath = `${assetDir}/token.png`;
        // In a real implementation, you'd:
        // 1. Create circular mask
        // 2. Apply mask and border
        // 3. Save as PNG
        paths.token = tokenPath;
      }
    }

    // Save metadata
    const metadataPath = `${assetDir}/metadata.json`;
    // await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

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
      fileSize: 0, // Would be calculated
      mimeType: 'image/jpeg',
      metadataPath,
      metadata,
      hash: cacheKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save asset record
    await this.saveAssetRecord(asset);

    return asset;
  }

  /**
   * Get cached asset
   */
  private async getCachedAsset(cacheKey: string): Promise<ArtAsset | null> {
    // In a real implementation, you'd check the database or filesystem
    // For now, return null to always generate
    return null;
  }

  /**
   * Save asset record to database
   */
  private async saveAssetRecord(asset: ArtAsset): Promise<void> {
    // In a real implementation, you'd save to your database
    // For now, just log the asset
    console.log('Saving asset record:', asset);
  }

  /**
   * Get asset by ID
   */
  async getAsset(assetId: string): Promise<ArtAsset | null> {
    // In a real implementation, you'd query the database
    return null;
  }

  /**
   * Get assets for entity
   */
  async getAssetsForEntity(entityType: string, entityId: string): Promise<ArtAsset[]> {
    // In a real implementation, you'd query the database
    return [];
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
        
        // Add delay between generations to avoid overwhelming ComfyUI
        await new Promise(resolve => setTimeout(resolve, 1000));
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
  async getQueueStatus() {
    if (!this.enabled) return null;
    return await comfyClient.getQueueStatus();
  }

  /**
   * Clear generation queue
   */
  async clearQueue(): Promise<void> {
    if (!this.enabled) return;
    await comfyClient.clearQueue();
  }

  /**
   * Interrupt current generation
   */
  async interrupt(): Promise<void> {
    if (!this.enabled) return;
    await comfyClient.interrupt();
  }
}

// Singleton instance
export const artPipeline = new ArtPipelineService();
