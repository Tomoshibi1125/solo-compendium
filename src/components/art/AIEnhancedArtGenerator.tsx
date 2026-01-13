/**
 * AI-Enhanced Art Generator Component
 * Integrates AI services for intelligent art generation
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIEnhancement, useAITagGeneration, useAIMoodDetection, useAIStyleSuggestions } from '@/lib/ai/hooks';
import { useArtPipeline } from '@/lib/artPipeline/hooks';
import { 
  Sparkles, 
  Brain, 
  RefreshCw, 
  Lightbulb, 
  Tag, 
  Palette, 
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIEnhancedArtGeneratorProps {
  onArtGenerated?: (assetId: string) => void;
  className?: string;
}

export function AIEnhancedArtGenerator({ onArtGenerated, className }: AIEnhancedArtGeneratorProps) {
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
  const [generationResult, setGenerationResult] = useState<any>(null);

  const handleEnhancePrompt = async () => {
    if (!originalPrompt.trim()) return;
    
    try {
      await enhancePrompt(originalPrompt, {
        style: 'dark manhwa anime cinematic fantasy, Solo Leveling style',
        mood: 'dramatic, high contrast, detailed',
        universe: 'Solo Leveling',
      });
      
      if (enhancedPrompt) {
        setFinalPrompt(enhancedPrompt);
      }
    } catch (error) {
      console.error('Failed to enhance prompt:', error);
    }
  };

  const handleGenerateTags = async () => {
    if (!finalPrompt.trim()) return;
    
    try {
      await generateTags(finalPrompt, 'text');
    } catch (error) {
      console.error('Failed to generate tags:', error);
    }
  };

  const handleDetectMood = async () => {
    if (!finalPrompt.trim()) return;
    
    try {
      const mood = await detectMood(finalPrompt, 'text');
      setSelectedMood(mood);
    } catch (error) {
      console.error('Failed to detect mood:', error);
    }
  };

  const handleSuggestStyles = async () => {
    if (!finalPrompt.trim()) return;
    
    try {
      const suggestions = await suggestStyles('dark manhwa anime cinematic fantasy, Solo Leveling');
      // Style suggestions are now available
    } catch (error) {
      console.error('Failed to suggest styles:', error);
    }
  };

  const handleGenerateArt = async () => {
    if (!finalPrompt.trim() || !artAvailable) return;
    
    setIsGenerating(true);
    setGenerationResult(null);
    
    try {
      const request = {
        entityType: 'monster' as const,
        entityId: `ai-enhanced-${Date.now()}`,
        variant: 'portrait' as const,
        title: 'AI Enhanced Art',
        tags: selectedTags,
        description: finalPrompt,
        mood: selectedMood,
        environment: 'fantasy world',
      };
      
      const result = await generateArt(request);
      setGenerationResult(result);
      
      if (result.success && result.assetId) {
        onArtGenerated?.(result.assetId);
      }
    } catch (error) {
      setGenerationResult({
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed',
      });
    } finally {
      setIsGenerating(false);
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
              <span className="text-sm">Solo Leveling Style</span>
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
                <label className="text-sm font-medium">Original Prompt</label>
                <Textarea
                  value={originalPrompt}
                  onChange={(e) => setOriginalPrompt(e.target.value)}
                  placeholder="Enter your basic prompt here..."
                  rows={3}
                />
              </div>
              
              <Button 
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
              
              {enhancedPrompt && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enhanced Prompt</label>
                  <Textarea
                    value={enhancedPrompt}
                    onChange={(e) => setFinalPrompt(e.target.value)}
                    rows={4}
                    className="border-green-500/30 bg-green-50"
                  />
                  {enhancement && (
                    <div className="text-xs text-muted-foreground">
                      <p>✨ AI enhanced with Solo Leveling styling</p>
                      <p>🎭 Added dramatic lighting and contrast</p>
                      <p>🌟 Included manhwa anime elements</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tags" className="space-y-4">
              <Button 
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
                  <label className="text-sm font-medium">AI-Generated Tags</label>
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
                  <label className="text-sm font-medium">Detected Mood</label>
                  <Badge variant="secondary" className="text-lg">
                    {detectedMood}
                  </Badge>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4">
              <Button 
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
                  <label className="text-sm font-medium">Style Variations</label>
                  <div className="space-y-2">
                    {styleSuggestions.map((style, index) => (
                      <Badge
                        key={index}
                        variant="outline"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
              <span className="font-medium">Mood:</span>
              <p className="text-muted-foreground">
                {selectedMood || 'No mood detected'}
              </p>
            </div>
          </div>
          
          <Button 
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
