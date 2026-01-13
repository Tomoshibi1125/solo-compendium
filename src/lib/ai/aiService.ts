/**
 * AI Service
 * Handles AI integrations for audio and art enhancement
 */

import type { 
  AIService, 
  AIRequest, 
  AIResponse, 
  AudioAnalysis, 
  ImageAnalysis, 
  PromptEnhancement,
  AIConfiguration 
} from './types';
import { DEFAULT_AI_SERVICES, DEFAULT_AI_CONFIG, getAIServiceById, getAIServiceForCapability } from './types';
import { AppError } from '@/lib/appError';

export class AIServiceManager {
  private config: AIConfiguration;
  private cache: Map<string, any> = new Map();
  private requestCount: number = 0;
  private lastResetTime: number = Date.now();

  constructor(config: Partial<AIConfiguration> = {}) {
    this.config = {
      ...DEFAULT_AI_CONFIG,
      ...config,
      services: config.services || DEFAULT_AI_SERVICES,
    };
  }

  /**
   * Process an AI request
   */
  async processRequest(request: AIRequest): Promise<AIResponse> {
    // Validate request
    const errors = this.validateRequest(request);
    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join('; '),
      };
    }

    // Check rate limiting
    if (this.isRateLimited()) {
      return {
        success: false,
        error: 'Rate limit exceeded',
      };
    }

    // Check cache
    const cacheKey = this.getCacheKey(request);
    if (this.config.cacheResults && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Get service
    const service = getAIServiceById(request.service, this.config.services);
    if (!service) {
      return {
        success: false,
        error: `AI service not found: ${request.service}`,
      };
    }

    try {
      const response = await this.callService(service, request);
      
      // Cache result
      if (this.config.cacheResults && response.success) {
        this.cache.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AI service error',
      };
    }
  }

  /**
   * Enhance a prompt for better art generation
   */
  async enhancePrompt(originalPrompt: string, context?: any): Promise<PromptEnhancement> {
    const request: AIRequest = {
      service: this.config.defaultService,
      type: 'enhance-prompt',
      input: originalPrompt,
      context: {
        ...context,
        style: 'dark manhwa anime cinematic fantasy, Solo Leveling style',
        mood: 'dramatic, high contrast, detailed',
      },
    };

    const response = await this.processRequest(request);
    
    if (!response.success) {
      throw new AppError('Failed to enhance prompt', 'AI_ERROR', response.error);
    }

    return response.data as PromptEnhancement;
  }

  /**
   * Analyze an image for content and style
   */
  async analyzeImage(imageUrl: string): Promise<ImageAnalysis> {
    const request: AIRequest = {
      service: this.config.defaultService,
      type: 'analyze-image',
      input: imageUrl,
      options: {
        max_size: 1024,
        detail: 'high',
      },
    };

    const response = await this.processRequest(request);
    
    if (!response.success) {
      throw new AppError('Failed to analyze image', 'AI_ERROR', response.error);
    }

    return response.data as ImageAnalysis;
  }

  /**
   * Analyze audio for mood and characteristics
   */
  async analyzeAudio(audioFile: File): Promise<AudioAnalysis> {
    const request: AIRequest = {
      service: this.config.defaultService,
      type: 'analyze-audio',
      input: audioFile,
      options: {
        analysis_type: 'mood_and_characteristics',
      },
    };

    const response = await this.processRequest(request);
    
    if (!response.success) {
      throw new AppError('Failed to analyze audio', 'AI_ERROR', response.error);
    }

    return response.data as AudioAnalysis;
  }

  /**
   * Generate tags for content
   */
  async generateTags(content: string, type: 'audio' | 'image' | 'text'): Promise<string[]> {
    const request: AIRequest = {
      service: this.config.defaultService,
      type: 'generate-tags',
      input: content,
      context: {
        content_type: type,
        style: 'dark manhwa anime cinematic fantasy, Solo Leveling',
      },
    };

    const response = await this.processRequest(request);
    
    if (!response.success) {
      throw new AppError('Failed to generate tags', 'AI_ERROR', response.error);
    }

    return response.data.tags || [];
  }

  /**
   * Detect mood from content
   */
  async detectMood(content: string, type: 'audio' | 'image' | 'text'): Promise<string> {
    const request: AIRequest = {
      service: this.config.defaultService,
      type: 'detect-mood',
      input: content,
      context: {
        content_type: type,
        style: 'dark manhwa anime cinematic fantasy',
      },
    };

    const response = await this.processRequest(request);
    
    if (!response.success) {
      throw new AppError('Failed to detect mood', 'AI_ERROR', response.error);
    }

    return response.data.mood || 'neutral';
  }

  /**
   * Suggest style variations
   */
  async suggestStyleVariations(baseStyle: string): Promise<string[]> {
    const request: AIRequest = {
      service: this.config.defaultService,
      type: 'suggest-style',
      input: baseStyle,
      context: {
        base_style: baseStyle,
        variations: ['darker', 'lighter', 'more_dramatic', 'more_mysterious', 'more_heroic'],
        universe: 'Solo Leveling',
      },
    };

    const response = await this.processRequest(request);
    
    if (!response.success) {
      throw new AppError('Failed to suggest style variations', 'AI_ERROR', response.error);
    }

    return response.data.variations || [];
  }

  /**
   * Filter content for appropriateness
   */
  async filterContent(content: string): Promise<{
    isAppropriate: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    const request: AIRequest = {
      service: this.config.defaultService,
      type: 'filter-content',
      input: content,
      context: {
        audience: 'general_audience',
        platform: 'tabletop_rpg',
        style: 'dark_fantasy',
      },
    };

    const response = await this.processRequest(request);
    
    if (!response.success) {
      throw new AppError('Failed to filter content', 'AI_ERROR', response.error);
    }

    return response.data;
  }

  /**
   * Create variations of existing content
   */
  async createVariation(originalContent: string, variationType: string): Promise<string> {
    const request: AIRequest = {
      service: this.config.defaultService,
      type: 'create-variation',
      input: originalContent,
      context: {
        variation_type: variationType,
        style: 'dark manhwa anime cinematic fantasy, Solo Leveling',
        preserve_core_elements: true,
      },
    };

    const response = await this.processRequest(request);
    
    if (!response.success) {
      throw new AppError('Failed to create variation', 'AI_ERROR', response.error);
    }

    return response.data.variation || originalContent;
  }

  // Private methods
  private validateRequest(request: AIRequest): string[] {
    const errors: string[] = [];
    
    if (!request.service) {
      errors.push('Service is required');
    }
    
    if (!request.type) {
      errors.push('Type is required');
    }
    
    if (!request.input) {
      errors.push('Input is required');
    }
    
    const service = getAIServiceById(request.service, this.config.services);
    if (!service) {
      errors.push(`Unknown AI service: ${request.service}`);
    }
    
    if (service && !service.enabled) {
      errors.push(`AI service is disabled: ${service.name}`);
    }
    
    if (service && !service.capabilities.includes(request.type as any)) {
      errors.push(`Service ${service.name} doesn't support ${request.type}`);
    }
    
    return errors;
  }

  private isRateLimited(): boolean {
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    
    // Reset counter if it's been more than an hour
    if (now - this.lastResetTime > hourInMs) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    
    return this.requestCount >= this.config.maxRequestsPerHour;
  }

  private getCacheKey(request: AIRequest): string {
    return `${request.service}:${request.type}:${JSON.stringify(request.input)}`;
  }

  private async callService(service: AIService, request: AIRequest): Promise<AIResponse> {
    this.requestCount++;

    // Route to appropriate service handler
    switch (service.type) {
      case 'google':
        return this.callGoogleGemini(service, request);
      case 'openai':
        return this.callSupabaseEdgeFunction(service, request);
      case 'anthropic':
        return this.callSupabaseEdgeFunction(service, request);
      case 'huggingface':
        return this.callSupabaseEdgeFunction(service, request);
      default:
        return this.callSupabaseEdgeFunction(service, request);
    }
  }

  private async callGoogleGemini(service: AIService, request: AIRequest): Promise<AIResponse> {
    try {
      const apiKey = service.apiKey || import.meta.env.GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error('Google Gemini API key not found');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${service.model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${this.getSystemPrompt(request.type)}\n\n${this.formatInput(request)}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: service.temperature,
            maxOutputTokens: service.maxTokens,
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Google Gemini API error');
      }

      return {
        success: true,
        data: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google Gemini API error',
      };
    }
  }

  private async callSupabaseEdgeFunction(service: AIService, request: AIRequest): Promise<AIResponse> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration not found');
      }

      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/ai-service`;
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: service.type,
          type: request.type,
          input: request.input,
          context: request.context,
          options: request.options,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || `Edge function error: ${response.status}`,
        };
      }

      // Transform edge function response to match our AI response format
      return {
        success: data.success,
        data: data.data,
        error: data.error,
        usage: data.usage,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Supabase edge function error',
      };
    }
  }

  
  private getSystemPrompt(type: string): string {
    const prompts: Record<string, string> = {
      'enhance-prompt': `You are an expert D&D and AI art prompt engineer. Enhance the given prompt for Stable Diffusion generation in the style of Solo Leveling manhwa anime. Focus on dramatic lighting, high contrast, detailed character art, and dynamic poses. Add specific Solo Leveling elements like shadow energy, gates, and system interface aesthetics.`,
      'analyze-image': `You are an expert art analyst specializing in anime/manga style artwork, particularly Solo Leveling. Analyze the given image and provide detailed information about style, mood, composition, and technical aspects. Focus on elements that would be useful for D&D campaign art generation.`,
      'analyze-audio': `You are an audio expert specializing in D&D campaign music and sound effects. Analyze the given audio and provide detailed information about mood, energy, tempo, instruments, and suitability for different D&D scenarios.`,
      'generate-tags': `You are an expert D&D content curator. Generate relevant tags for the given content in the context of a Solo Leveling themed campaign. Focus on mood, setting, and gameplay elements.`,
      'detect-mood': `You are an expert in emotional analysis for D&D content. Detect the primary mood of the given content and provide a single-word mood label that would be useful for categorizing campaign materials.`,
      'suggest-style': `You are an art style expert specializing in Solo Leveling manhwa anime. Suggest variations of the given style that would work well for different D&D scenarios while maintaining the core aesthetic.`,
      'filter-content': `You are a content moderator for D&D campaigns. Analyze the given content for appropriateness and flag any issues. Consider the audience (general TTRPG players) and platform (tabletop gaming).`,
      'create-variation': `You are a creative AI assistant helping with D&D content creation. Create a variation of the given content that maintains the core elements but adds a different twist while staying within the Solo Leveling manhwa anime style.`,
    };
    
    return prompts[type] || prompts['enhance-prompt'];
  }

  private formatInput(request: AIRequest): string {
    let formatted = `Request: ${request.type}\n`;
    formatted += `Input: ${typeof request.input === 'string' ? request.input : 'Non-text input'}\n`;
    
    if (request.context) {
      formatted += `Context: ${JSON.stringify(request.context, null, 2)}\n`;
    }
    
    if (request.options) {
      formatted += `Options: ${JSON.stringify(request.options, null, 2)}\n`;
    }
    
    return formatted;
  }

  // Public methods for configuration
  updateConfiguration(updates: Partial<AIConfiguration>): void {
    this.config = { ...this.config, ...updates };
  }

  getConfiguration(): AIConfiguration {
    return { ...this.config };
  }

  addService(service: AIService): void {
    this.config.services.push(service);
  }

  removeService(serviceId: string): void {
    this.config.services = this.config.services.filter(s => s.id !== serviceId);
  }

  enableService(serviceId: string): void {
    const service = getAIServiceById(serviceId, this.config.services);
    if (service) {
      service.enabled = true;
    }
  }

  disableService(serviceId: string): void {
    const service = getAIServiceById(serviceId, this.config.services);
    if (service) {
      service.enabled = false;
    }
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const aiService = new AIServiceManager();
