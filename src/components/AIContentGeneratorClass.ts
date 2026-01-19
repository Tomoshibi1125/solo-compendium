import { aiService } from '@/lib/ai/aiService';
import { logger } from '@/lib/logger';

export interface GeneratedContent {
  id: string;
  type: 'npc' | 'encounter' | 'location' | 'quest' | 'dialogue' | 'item' | 'backstory';
  title: string;
  content: string;
  metadata?: {
    level?: number;
    cr?: number;
    tags?: string[];
    tone?: string;
    length?: string | number;
    complexity?: string;
  };
  generatedAt: number;
  prompt: string;
}

export interface ContentGenerationOptions {
  type: GeneratedContent['type'];
  tone: 'serious' | 'humorous' | 'dramatic' | 'mysterious' | 'epic';
  length: 'short' | 'medium' | 'long';
  level?: number;
  complexity: 'simple' | 'moderate' | 'complex';
  includeStats?: boolean;
  includeDialogue?: boolean;
  includeDescription?: boolean;
}

const AI_CONTENT_PROMPTS = {
  npc: "Generate a detailed D&D NPC with name, appearance, personality, background, motivations, and dialogue examples.",
  encounter: "Create a combat encounter with enemies, environment, tactics, treasure, and story context.",
  location: "Describe a detailed location with atmosphere, features, secrets, and interactive elements.",
  quest: "Design a quest with objectives, NPCs involved, challenges, rewards, and story hooks.",
  dialogue: "Write dialogue between characters with personality, emotion, and plot advancement.",
  item: "Create a magical or mundane item with description, properties, history, and game mechanics.",
  backstory: "Generate a character backstory with formative events, relationships, goals, and secrets.",
};

export class AIContentGenerator {
  async generateContent(
    prompt: string, 
    options: ContentGenerationOptions
  ): Promise<GeneratedContent> {
    const enhancedPrompt = this.buildEnhancedPrompt(prompt, options);
    
    try {
      const response = await aiService.processRequest({
        service: aiService.getConfiguration().defaultService,
        type: 'generate-content',
        input: enhancedPrompt,
        context: {
          contentType: options.type,
          tone: options.tone,
          length: options.length,
          complexity: options.complexity,
          includeStats: options.includeStats ?? false,
          includeDialogue: options.includeDialogue ?? false,
          includeDescription: options.includeDescription ?? false,
          universe: 'Solo Leveling',
        },
      });

      if (!response.success) {
        throw new Error(response.error || 'AI content generation failed');
      }

      const generatedText = this.resolveContentText(response.data);

      return this.parseGeneratedContent(generatedText, options);
    } catch (error) {
      logger.error('AI generation failed:', error);
      throw error;
    }
  }

  private buildEnhancedPrompt(prompt: string, options: ContentGenerationOptions): string {
    let enhancedPrompt = AI_CONTENT_PROMPTS[options.type];
    
    enhancedPrompt += `\n\nAdditional context: ${prompt}`;
    
    enhancedPrompt += `\n\nStyle requirements:
- Tone: ${options.tone}
- Length: ${options.length}
- Complexity: ${options.complexity}`;

    if (options.level) {
      enhancedPrompt += `\n- Target level: ${options.level}`;
    }

    if (options.includeStats && (options.type === 'npc' || options.type === 'encounter')) {
      enhancedPrompt += `\n- Include game statistics (AC, HP, abilities, etc.)`;
    }

    if (options.includeDialogue && (options.type === 'npc' || options.type === 'dialogue')) {
      enhancedPrompt += `\n- Include sample dialogue`;
    }

    if (options.includeDescription && (options.type === 'location' || options.type === 'item')) {
      enhancedPrompt += `\n- Include detailed descriptions`;
    }

    enhancedPrompt += `\n\nFormat the response clearly with sections and appropriate D&D terminology.`;
    enhancedPrompt += `\n\nKeep the flavor aligned with Solo Leveling: cinematic, high-stakes, and system-driven.`;

    return enhancedPrompt;
  }

  private resolveContentText(data: unknown): string {
    if (typeof data === 'string') {
      return data;
    }

    if (data && typeof data === 'object') {
      const candidate = (data as { content?: unknown; output?: unknown; text?: unknown }).content
        ?? (data as { output?: unknown }).output
        ?? (data as { text?: unknown }).text;
      if (typeof candidate === 'string') {
        return candidate;
      }
    }

    return String(data ?? '');
  }

  private parseGeneratedContent(text: string, options: ContentGenerationOptions): GeneratedContent {
    // Extract title from first line or generate one
    const lines = text.split('\n').filter(line => line.trim());
    const title = lines[0]?.replace(/^#+\s*/, '').trim() || `Generated ${options.type}`;
    
    // Extract metadata from content
    const metadata: any = {
      tone: options.tone,
      length: options.length,
      complexity: options.complexity,
    };

    // Try to extract level/CR from content
    const levelMatch = text.match(/(?:level|cr)\s*(\d+)/i);
    if (levelMatch) {
      metadata.level = parseInt(levelMatch[1]);
      metadata.cr = parseInt(levelMatch[1]);
    }

    // Extract tags based on content
    const tags = this.extractTags(text);
    if (tags.length > 0) {
      metadata.tags = tags;
    }

    return {
      id: Date.now().toString(),
      type: options.type,
      title,
      content: text,
      metadata,
      generatedAt: Date.now(),
      prompt: AI_CONTENT_PROMPTS[options.type],
    };
  }

  private extractTags(text: string): string[] {
    const tags: string[] = [];
    const tagPatterns: Record<string, RegExp> = {
      combat: /combat|battle|fight|attack|damage/i,
      magic: /magic|spell|arcane|wizard|sorcery/i,
      social: /social|dialogue|conversation|persuasion/i,
      exploration: /exploration|dungeon|wilderness|travel/i,
      mystery: /mystery|secret|puzzle|investigation/i,
      horror: /horror|scary|fear|terror|undead/i,
      urban: /city|town|urban|civilization/i,
      wilderness: /forest|mountain|nature|wild/i,
    };

    for (const [tag, pattern] of Object.entries(tagPatterns)) {
      if (pattern.test(text)) {
        tags.push(tag);
      }
    }

    return tags;
  }
}
