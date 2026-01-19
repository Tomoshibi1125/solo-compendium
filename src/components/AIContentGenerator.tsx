import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Save, 
  Wand2,
  BookOpen,
  Users,
  Map,
  Sword,
  Heart,
  Zap,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIContentGenerator as AIContentGeneratorClass, GeneratedContent, ContentGenerationOptions } from './AIContentGeneratorClass';
import { AIProviderSettings } from '@/components/ai/AIProviderSettings';

// Hook for AI content generation
export function useAIContentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [savedContent, setSavedContent] = useState<GeneratedContent[]>([]);
  const { toast } = useToast();

  const generator = useMemo(() => new AIContentGeneratorClass(), []);

  const generateContent = useCallback(async (
    prompt: string, 
    options: ContentGenerationOptions
  ): Promise<GeneratedContent> => {
    setIsGenerating(true);
    
    try {
      const content = await generator.generateContent(prompt, options);
      setGeneratedContent(prev => [content, ...prev.slice(0, 49)]); // Keep last 50
      
      toast({
        title: 'Content Generated',
        description: `${content.type} "${content.title}" has been created.`,
      });
      
      return content;
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Unable to generate content. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [generator, toast]);

  const saveContent = useCallback((content: GeneratedContent) => {
    setSavedContent(prev => [content, ...prev]);
    setGeneratedContent(prev => prev.filter(c => c.id !== content.id));
    
    toast({
      title: 'Content Saved',
      description: 'The content has been saved to your library.',
    });
  }, [toast]);

  const deleteContent = useCallback((id: string, fromLibrary: boolean = false) => {
    if (fromLibrary) {
      setSavedContent(prev => prev.filter(c => c.id !== id));
    } else {
      setGeneratedContent(prev => prev.filter(c => c.id !== id));
    }
    
    toast({
      title: 'Content Deleted',
      description: 'The content has been removed.',
    });
  }, [toast]);

  const regenerateContent = useCallback(async (
    content: GeneratedContent, 
    modifications?: string
  ) => {
    const newPrompt = modifications 
      ? `${content.prompt}\n\nModifications: ${modifications}`
      : content.prompt;
    
    const options: ContentGenerationOptions = {
      type: content.type,
      tone: (content.metadata?.tone || 'serious') as ContentGenerationOptions['tone'],
      length: (content.metadata?.length || 'medium') as ContentGenerationOptions['length'],
      complexity: (content.metadata?.complexity || 'moderate') as ContentGenerationOptions['complexity'],
    };

    return generateContent(newPrompt, options);
  }, [generateContent]);

  return {
    isGenerating,
    generatedContent,
    savedContent,
    generateContent,
    saveContent,
    deleteContent,
    regenerateContent,
  };
}

// React component for AI content generation
export function AIContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<ContentGenerationOptions>({
    type: 'npc',
    tone: 'serious',
    length: 'medium',
    complexity: 'moderate',
    includeStats: true,
    includeDialogue: true,
    includeDescription: true,
  });
  
  const {
    isGenerating,
    generatedContent,
    savedContent,
    generateContent,
    saveContent,
    deleteContent,
    regenerateContent,
  } = useAIContentGenerator();

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    
    try {
      await generateContent(prompt.trim(), options);
      setPrompt('');
    } catch (error) {
      // Error already handled by hook
    }
  }, [prompt, options, generateContent]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const contentTypes = [
    { value: 'npc', label: 'NPC', icon: Users },
    { value: 'encounter', label: 'Encounter', icon: Sword },
    { value: 'location', label: 'Location', icon: Map },
    { value: 'quest', label: 'Quest', icon: BookOpen },
    { value: 'dialogue', label: 'Dialogue', icon: Heart },
    { value: 'item', label: 'Item', icon: Zap },
    { value: 'backstory', label: 'Backstory', icon: Sparkles },
  ];

  const toneOptions = [
    { value: 'serious', label: 'Serious' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'epic', label: 'Epic' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <AIProviderSettings />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select value={options.type} onValueChange={(value) => 
                setOptions(prev => ({ ...prev, type: value as GeneratedContent['type'] }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={options.tone} onValueChange={(value) => 
                setOptions(prev => ({ ...prev, tone: value as any }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map(tone => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Select value={options.length} onValueChange={(value) => 
                setOptions(prev => ({ ...prev, length: value as any }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Complexity</Label>
              <Select value={options.complexity} onValueChange={(value) => 
                setOptions(prev => ({ ...prev, complexity: value as any }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional options */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="include-stats"
                checked={options.includeStats}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeStats: checked }))
                }
              />
              <Label htmlFor="include-stats">Include Stats</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="include-dialogue"
                checked={options.includeDialogue}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeDialogue: checked }))
                }
              />
              <Label htmlFor="include-dialogue">Include Dialogue</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="include-description"
                checked={options.includeDescription}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeDescription: checked }))
                }
              />
              <Label htmlFor="include-description">Include Description</Label>
            </div>
          </div>

          {/* Prompt input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe what you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          {/* Generate button */}
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated content */}
      {generatedContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedContent.map((content: GeneratedContent) => (
              <Card key={content.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{content.type}</Badge>
                        <Badge variant="secondary">{content.metadata?.tone}</Badge>
                        {content.metadata?.level && (
                          <Badge variant="outline">Level {content.metadata.level}</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg">{content.title}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(content.content)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => regenerateContent(content)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => saveContent(content)}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteContent(content.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="prose prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                      {content.content}
                    </pre>
                  </div>
                  
                  {content.metadata?.tags && content.metadata.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {content.metadata.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Saved content library */}
      {savedContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Library ({savedContent.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {savedContent.map((content: GeneratedContent) => (
              <Card key={content.id} className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{content.type}</Badge>
                        <Badge variant="secondary">{content.metadata?.tone}</Badge>
                      </div>
                      <h3 className="font-semibold">{content.title}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(content.content)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteContent(content.id, true)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
