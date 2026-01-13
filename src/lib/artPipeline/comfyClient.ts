/**
 * ComfyUI Client Service
 * Handles communication with local ComfyUI server
 */

import type { ComfyUIPrompt, ComfyUIResponse, ComfyUIHistory, QueueStatus } from './types.ts';

export class ComfyUIClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ComfyUIClientError';
  }
}

export class ComfyUIClient {
  private baseUrl: string;
  private clientId: string;
  private timeout: number;

  constructor(baseUrl: string = 'http://localhost:8188', timeout: number = 300000) {
    this.baseUrl = baseUrl;
    this.clientId = this.generateClientId();
    this.timeout = timeout;
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Check if ComfyUI server is running
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/system_stats`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current queue status
   */
  async getQueueStatus(): Promise<QueueStatus> {
    const response = await fetch(`${this.baseUrl}/queue`);
    if (!response.ok) {
      throw new ComfyUIClientError(`Failed to get queue status: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Submit a prompt to ComfyUI
   */
  async submitPrompt(prompt: ComfyUIPrompt): Promise<string> {
    const response = await fetch(`${this.baseUrl}/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        client_id: this.clientId,
      }),
    });

    if (!response.ok) {
      throw new ComfyUIClientError(`Failed to submit prompt: ${response.statusText}`);
    }

    const result: ComfyUIResponse = await response.json();
    return result.prompt_id;
  }

  /**
   * Get prompt history
   */
  async getHistory(promptId?: string): Promise<ComfyUIHistory> {
    const url = promptId 
      ? `${this.baseUrl}/history/${promptId}`
      : `${this.baseUrl}/history`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new ComfyUIClientError(`Failed to get history: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Wait for prompt completion
   */
  async waitForCompletion(promptId: string): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < this.timeout) {
      try {
        const history = await this.getHistory(promptId);
        const promptHistory = history[promptId];
        
        if (!promptHistory) {
          throw new ComfyUIClientError('Prompt not found in history');
        }

        const status = promptHistory.status;
        
        if (status.completed) {
          return promptHistory;
        }

        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error checking prompt status:', error);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    throw new ComfyUIClientError(`Prompt ${promptId} timed out after ${this.timeout}ms`);
  }

  /**
   * Download generated image
   */
  async downloadImage(filename: string, subfolder?: string): Promise<Blob> {
    const params = new URLSearchParams({ filename });
    if (subfolder) {
      params.append('subfolder', subfolder);
    }

    const response = await fetch(`${this.baseUrl}/view?${params}`);
    if (!response.ok) {
      throw new ComfyUIClientError(`Failed to download image: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Upload image to ComfyUI
   */
  async uploadImage(file: File, overwrite: boolean = true): Promise<{ name: string; subfolder: string }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('overwrite', overwrite.toString());

    const response = await fetch(`${this.baseUrl}/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new ComfyUIClientError(`Failed to upload image: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get system information
   */
  async getSystemInfo(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/system_stats`);
    if (!response.ok) {
      throw new ComfyUIClientError(`Failed to get system info: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Load workflow from file
   */
  async loadWorkflow(workflowPath: string): Promise<ComfyUIPrompt> {
    try {
      const response = await fetch(workflowPath);
      if (!response.ok) {
        throw new ComfyUIClientError(`Failed to load workflow: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      throw new ComfyUIClientError(`Failed to load workflow from ${workflowPath}: ${error}`);
    }
  }

  /**
   * Modify workflow with custom parameters
   */
  modifyWorkflow(workflow: ComfyUIPrompt, params: {
    prompt?: string;
    negative?: string;
    width?: number;
    height?: number;
    seed?: number;
    steps?: number;
    cfg?: number;
    sampler?: string;
    scheduler?: string;
  }): ComfyUIPrompt {
    const modified = JSON.parse(JSON.stringify(workflow));

    // Find and modify text nodes
    Object.keys(modified).forEach(nodeId => {
      const node = modified[nodeId];
      
      if (node.class_type === 'CLIPTextEncode') {
        if (node.inputs.text.includes('dark manhwa') && params.prompt) {
          node.inputs.text = params.prompt;
        }
        if (node.inputs.text.includes('low quality') && params.negative) {
          node.inputs.text = params.negative;
        }
      }

      if (node.class_type === 'EmptyLatentImage') {
        if (params.width) node.inputs.width = params.width;
        if (params.height) node.inputs.height = params.height;
      }

      if (node.class_type === 'KSampler') {
        if (params.seed !== undefined) node.inputs.seed = params.seed;
        if (params.steps) node.inputs.steps = params.steps;
        if (params.cfg) node.inputs.cfg = params.cfg;
        if (params.sampler) node.inputs.sampler_name = params.sampler;
        if (params.scheduler) node.inputs.scheduler = params.scheduler;
      }

      if (node.class_type === 'CheckpointLoaderSimple') {
        // Keep the default model for now
      }
    });

    return modified;
  }

  /**
   * Generate image with full workflow
   */
  async generateImage(workflow: ComfyUIPrompt): Promise<{
    promptId: string;
    images: Array<{ filename: string; subfolder: string; blob: Blob }>;
  }> {
    // Submit prompt
    const promptId = await this.submitPrompt(workflow);

    // Wait for completion
    const result = await this.waitForCompletion(promptId);

    // Extract image information
    const images: Array<{ filename: string; subfolder: string; blob: Blob }> = [];

    Object.values(result.outputs).forEach((output: any) => {
      if (output.images) {
        output.images.forEach(async (image: any) => {
          try {
            const blob = await this.downloadImage(image.filename, image.subfolder);
            images.push({
              filename: image.filename,
              subfolder: image.subfolder || '',
              blob,
            });
          } catch (error) {
            console.error(`Failed to download image ${image.filename}:`, error);
          }
        });
      }
    });

    return { promptId, images };
  }

  /**
   * Clear queue
   */
  async clearQueue(): Promise<void> {
    await fetch(`${this.baseUrl}/queue`, { method: 'POST' });
  }

  /**
   * Interrupt current generation
   */
  async interrupt(): Promise<void> {
    await fetch(`${this.baseUrl}/interrupt`, { method: 'POST' });
  }
}

// Singleton instance
export const comfyClient = new ComfyUIClient();
