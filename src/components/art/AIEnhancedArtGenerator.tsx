/**
 * AI-Enhanced Art Generator Component
 * Integrates AI services for intelligent art generation
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIEnhancement, useAITagGeneration, useAIMoodDetection, useAIStyleSuggestions } from '@/lib/ai/hooks';
import { useArtPipeline } from '@/lib/artPipeline/hooks';
import { artPipeline } from '@/lib/artPipeline/service';
import type { ArtAsset, GenerationResult } from '@/lib/artPipeline/types';
import { 
  Sparkles, 
  Brain, 
  RefreshCw, 
  Tag, 
  Palette, 
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { AIProviderSettings } from '@/components/ai/AIProviderSettings';

interface AIEnhancedArtGeneratorProps {
  entityType?: 'monster' | 'npc' | 'item' | 'location';
  entityId?: string;
  title?: string;
  onArtGenerated?: (assetId: string, previewUrl?: string) => void;
  onGenerationStart?: () => void;
  onGenerationComplete?: (success: boolean) => void;
  className?: string;
}

const pickPreviewUrl = (paths?: unknown): string | undefined => {
  if (!paths) return undefined;
  if (Array.isArray(paths)) {
    const url = paths.find((value) => typeof value === 'string' && value.startsWith('http'));
    return url as string | undefined;
  }
  if (typeof paths === 'object') {
    const values = Object.values(paths as Record<string, unknown>);
    const url = values.find((value) => typeof value === 'string' && value.startsWith('http'));
    return url as string | undefined;
  }
  return undefined;
};

export function AIEnhancedArtGenerator({
  entityType,
  entityId,
  title,
  onArtGenerated,
  onGenerationStart,
  onGenerationComplete,
  className,
}: AIEnhancedArtGeneratorProps) {
  const { generateArt, isAvailable: artAvailable } = useArtPipeline();
  const { 
    isEnhancing, 
    enhancedPrompt, 
    enhancement, 
    error: enhanceError,
    enhancePrompt 
  } = useAIEnhancement();
  
  const { 
    isGenerating: isGeneratingTags, 
    tags: aiTags, 
    error: tagsError,
    generateTags 
  } = useAITagGeneration();
  
  const { 
    isDetecting, 
    mood: detectedMood, 
    error: moodError,
    detectMood 
  } = useAIMoodDetection();
  
  const { 
    isSuggesting, 
    suggestions: styleSuggestions, 
    error: styleError,
    suggestStyles 
  } = useAIStyleSuggestions();

  const [originalPrompt, setOriginalPrompt] = useState('');
  const [finalPrompt, setFinalPrompt] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);

  useEffect(() => {
    if (!finalPrompt.trim() && originalPrompt.trim() && !enhancedPrompt) {
      setFinalPrompt(originalPrompt.trim());
    }
  }, [enhancedPrompt, finalPrompt, originalPrompt]);

  const handleEnhancePrompt = async () => {
    if (!originalPrompt.trim()) return;
    
    try {
      const result = await enhancePrompt(originalPrompt, {
        style: 'dark manhwa anime cinematic fantasy, System Ascendant style',
        mood: 'dramatic, high contrast, detailed',
        universe: 'System Ascendant',
      });
      
      if (result?.enhanced) {
        setFinalPrompt(result.enhanced);
      } else if (!finalPrompt && originalPrompt.trim()) {
        setFinalPrompt(originalPrompt.trim());
      }
    } catch (error) {
      logger.error('Failed to enhance prompt:', error);
    }
  };

  const handleGenerateTags = async () => {
    if (!finalPrompt.trim()) return;
    
    try {
      await generateTags(finalPrompt, 'text');
    } catch (error) {
      logger.error('Failed to generate tags:', error);
    }
  };

  const handleDetectMood = async () => {
    if (!finalPrompt.trim()) return;
    
    try {
      const mood = await detectMood(finalPrompt, 'text');
      setSelectedMood(mood);
    } catch (error) {
      logger.error('Failed to detect mood:', error);
    }
  };

  const handleSuggestStyles = async () => {
    if (!finalPrompt.trim()) return;
    
    try {
      await suggestStyles('dark manhwa anime cinematic fantasy, System Ascendant');
    } catch (error) {
      logger.error('Failed to suggest styles:', error);
    }
  };

  const handleGenerateArt = async () => {
    if (!finalPrompt.trim() || !artAvailable) return;
    
    setIsGenerating(true);
    setGenerationResult(null);
    onGenerationStart?.();
    let completedSuccessfully = false;
    
    try {
      const startedAt = Date.now();
      const resolvedEntityType = entityType ?? 'monster';
      const resolvedEntityId = entityId ?? `ai-enhanced-${Date.now()}`;
      const resolvedTitle = title?.trim() || 'AI Enhanced Art';
      const resolvedTags =
        selectedStyle.trim().length > 0
          ? Array.from(new Set([...selectedTags, selectedStyle.trim()]))
          : selectedTags;
      const request = {
        entityType: resolvedEntityType,
        entityId: resolvedEntityId,
        variant: 'portrait' as const,
        title: resolvedTitle,
        tags: resolvedTags,
        description: finalPrompt,
        mood: selectedMood,
        environment: 'fantasy world',
      };
      
      const result = await generateArt(request);
      let resolvedResult = result;

      const needsFallback =
        !resolvedResult ||
        typeof resolvedResult.success !== 'boolean' ||
        !resolvedResult.success ||
        !resolvedResult.assetId;

      if (needsFallback) {
        let fallbackAsset: ArtAsset | null = null;
        for (let attempt = 0; attempt < 5; attempt += 1) {
          const fallbackAssets = await artPipeline.getAssetsForEntity(request.entityType, request.entityId);
          if (fallbackAssets.length > 0) {
            fallbackAsset = fallbackAssets[0];
            break;
          }
          if (attempt < 4) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }

        if (fallbackAsset) {
          resolvedResult = {
            success: true,
            assetId: fallbackAsset.id,
            paths: Object.values(fallbackAsset.paths),
            metadata: fallbackAsset.metadata,
            duration: Date.now() - startedAt,
          };
        } else if (!resolvedResult || typeof resolvedResult.success !== 'boolean') {
          resolvedResult = {
            success: false,
            error: 'Art generation returned no result',
            duration: Date.now() - startedAt,
          };
        } else if (!resolvedResult.success) {
          resolvedResult = {
            ...resolvedResult,
            duration: resolvedResult.duration ?? Date.now() - startedAt,
          };
        }
      }

      let nextResult = resolvedResult;

      if (!nextResult.success) {
        const fallbackAssets = await artPipeline.getAssetsForEntity(request.entityType, request.entityId);
        if (fallbackAssets.length > 0) {
          const fallbackAsset = fallbackAssets[0];
          nextResult = {
            success: true,
            assetId: fallbackAsset.id,
            paths: Object.values(fallbackAsset.paths),
            metadata: fallbackAsset.metadata,
            duration: Date.now() - startedAt,
          };
        }
      }

      setGenerationResult(nextResult);

      if (nextResult.success) {
        completedSuccessfully = true;
        const previewUrl = pickPreviewUrl(nextResult.paths);
        const assetId = nextResult.assetId || previewUrl;
        if (assetId) {
          onArtGenerated?.(assetId, previewUrl);
        }
      }
    } catch (error) {
      setGenerationResult({
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed',
      });
    } finally {
      setIsGenerating(false);
      onGenerationComplete?.(completedSuccessfully);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <AIProviderSettings />
      {/* AI Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI-Enhanced Art Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                artAvailable ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="text-sm">
                Art Generation: {artAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">AI Enhancement: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm">System Ascendant Style</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Enhancement Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Enhancement Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="prompt">Prompt</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
              <TabsTrigger value="mood">Mood</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prompt" className="space-y-4">
              <div>
                <p className="text-sm font-medium">Original Prompt</p>
                <Textarea
                  value={originalPrompt}
                  onChange={(e) => setOriginalPrompt(e.target.value)}
                  placeholder="Enter your basic prompt here..."
                  rows={3}
                />
              </div>
              
              <Button 
                type="button"
                onClick={handleEnhancePrompt}
                disabled={!originalPrompt.trim() || isEnhancing}
                className="w-full"
              >
                {isEnhancing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Enhance with AI
                  </>
                )}
              </Button>
              
              {enhanceError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{enhanceError}</AlertDescription>
                </Alert>
              )}
              
              {(enhancedPrompt || finalPrompt || originalPrompt.trim()) && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {enhancedPrompt ? 'Enhanced Prompt' : 'Final Prompt'}
                  </p>
                  <Textarea
                    value={finalPrompt || enhancedPrompt || originalPrompt}
                    onChange={(e) => setFinalPrompt(e.target.value)}
                    rows={4}
                    className={cn(
                      enhancedPrompt ? "border-green-500/30 bg-green-50" : "border-border"
                    )}
                  />
                  {enhancement && (
                    <div className="text-xs text-muted-foreground">
                      <p>- AI enhanced with System Ascendant styling</p>
                      <p>- Added dramatic lighting and contrast</p>
                      <p>- Included manhwa anime elements</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tags" className="space-y-4">
              <Button 
                type="button"
                onClick={handleGenerateTags}
                disabled={!finalPrompt.trim() || isGeneratingTags}
                className="w-full"
              >
                {isGeneratingTags ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Tags...
                  </>
                ) : (
                  <>
                    <Tag className="w-4 h-4 mr-2" />
                    Generate AI Tags
                  </>
                )}
              </Button>
              
              {tagsError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{tagsError}</AlertDescription>
                </Alert>
              )}
              
              {aiTags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">AI-Generated Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {aiTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="mood" className="space-y-4">
              <Button 
                type="button"
                onClick={handleDetectMood}
                disabled={!finalPrompt.trim() || isDetecting}
                className="w-full"
              >
                {isDetecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Detecting Mood...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Detect Mood
                  </>
                )}
              </Button>
              
              {moodError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{moodError}</AlertDescription>
                </Alert>
              )}
              
              {detectedMood && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Detected Mood</p>
                  <Badge variant="secondary" className="text-lg">
                    {detectedMood}
                  </Badge>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4">
              <Button 
                type="button"
                onClick={handleSuggestStyles}
                disabled={!finalPrompt.trim() || isSuggesting}
                className="w-full"
              >
                {isSuggesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Suggesting Styles...
                  </>
                ) : (
                  <>
                    <Palette className="w-4 h-4 mr-2" />
                    Suggest Variations
                  </>
                )}
              </Button>
              
              {styleError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{styleError}</AlertDescription>
                </Alert>
              )}
              
              {styleSuggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Style Variations</p>
                  <div className="space-y-2">
                    {styleSuggestions.map((style, index) => (
                      <Badge
                        key={index}
                        variant={selectedStyle === style ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/20"
                        onClick={() => setSelectedStyle(style)}
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Final Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Generate AI-Enhanced Art
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Prompt:</span>
              <p className="text-muted-foreground truncate">
                {finalPrompt || 'No enhanced prompt'}
              </p>
            </div>
            <div>
              <span className="font-medium">Tags:</span>
              <p className="text-muted-foreground">
                {selectedTags.length > 0 ? selectedTags.join(', ') : 'No tags selected'}
              </p>
            </div>
            <div>
              <span className="font-medium">Style:</span>
              <p className="text-muted-foreground">
                {selectedStyle || 'No style selected'}
              </p>
            </div>
            <div>
              <span className="font-medium">Mood:</span>
              <p className="text-muted-foreground">
                {selectedMood || 'No mood detected'}
              </p>
            </div>
          </div>
          
          <Button 
            type="button"
            onClick={handleGenerateArt}
            disabled={!finalPrompt.trim() || !artAvailable || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating AI Art...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate AI-Enhanced Art
              </>
            )}
          </Button>
          
          {generationResult && (
            <div className={cn(
              "p-4 rounded-lg border",
              generationResult.success ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
            )}>
              {generationResult.success ? (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">AI-Enhanced Art Generated Successfully!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Generation Failed</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

