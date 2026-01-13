/**
 * In-App Art Generator Component
 * Allows players/DMs to generate custom art for characters, NPCs, and homebrew items
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArtPipeline, useArtAsset } from '@/lib/artPipeline/hooks';
import { Loader2, Image, Sparkles, Settings, Download, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArtGeneratorProps {
  entityType?: 'character' | 'npc' | 'item' | 'monster' | 'location';
  entityId?: string;
  existingData?: {
    name?: string;
    description?: string;
    tags?: string[];
    rarity?: string;
    environment?: string;
  };
  onArtGenerated?: (assetId: string) => void;
  className?: string;
}

export function ArtGenerator({ 
  entityType = 'character',
  entityId,
  existingData = {},
  onArtGenerated,
  className 
}: ArtGeneratorProps) {
  const { generateArt, isAvailable, isGenerating } = useArtPipeline();
  const { asset, createAsset, loading: assetLoading } = useArtAsset(entityType, entityId || 'temp');
  
  const [formData, setFormData] = useState({
    name: existingData.name || '',
    description: existingData.description || '',
    tags: existingData.tags?.join(', ') || '',
    variant: 'portrait' as 'portrait' | 'token' | 'icon' | 'illustration' | 'banner',
    rarity: existingData.rarity || '',
    environment: existingData.environment || '',
    mood: '',
    extraLore: '',
  });
  
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);

  // Map entity types to art pipeline types
  const getEntityTypeForPipeline = () => {
    switch (entityType) {
      case 'character':
      case 'npc':
        return 'monster'; // Use monster pipeline for characters/NPCs
      case 'item':
        return 'item';
      case 'monster':
        return 'monster';
      case 'location':
        return 'location';
      default:
        return 'monster';
    }
  };

  const handleGenerate = async () => {
    if (!isAvailable) {
      setGenerationResult({
        success: false,
        error: 'Art generation not available. Please ensure ComfyUI is running.',
      });
      return;
    }

    setIsGeneratingArt(true);
    setGenerationResult(null);

    const request = {
      entityType: getEntityTypeForPipeline() as any,
      entityId: entityId || `custom-${Date.now()}`,
      variant: formData.variant,
      title: formData.name || 'Custom Art',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      description: formData.description,
      rarityOrCR: formData.rarity,
      environment: formData.environment,
      mood: formData.mood,
      extraLore: formData.extraLore,
    };

    try {
      const result = await generateArt(request);
      setGenerationResult(result);
      
      if (result.success && result.assetId) {
        onArtGenerated?.(result.assetId);
      }
    } catch (error) {
      setGenerationResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsGeneratingArt(false);
    }
  };

  const getVariantOptions = () => {
    switch (entityType) {
      case 'character':
      case 'npc':
      case 'monster':
        return [
          { value: 'portrait', label: 'Portrait (Square)' },
          { value: 'token', label: 'Token (Circle)' },
        ];
      case 'item':
        return [
          { value: 'icon', label: 'Icon (Small)' },
          { value: 'illustration', label: 'Illustration (Full)' },
        ];
      case 'location':
        return [
          { value: 'banner', label: 'Banner (Wide)' },
        ];
      default:
        return [
          { value: 'portrait', label: 'Portrait' },
        ];
    }
  };

  const getMoodSuggestions = () => [
    'heroic', 'mysterious', 'dark', 'menacing', 'noble', 'ancient', 
    'magical', 'technological', 'divine', 'corrupted', 'peaceful', 'chaotic'
  ];

  const getEnvironmentSuggestions = () => [
    'dungeon', 'forest', 'castle', 'city', 'mountain', 'swamp', 
    'desert', 'arctic', 'underwater', 'void', 'celestial', 'shadow realm'
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Status */}
      {!isAvailable && (
        <Alert>
          <AlertDescription>
            Art generation is currently unavailable. Please ensure ComfyUI is running.
          </AlertDescription>
        </Alert>
      )}

      {/* Existing Asset Display */}
      {asset && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Current Art
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {asset.paths?.original && (
                <div className="flex-1">
                  <img 
                    src={asset.paths.original} 
                    alt="Generated art" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">
                    Generated: {new Date(asset.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Art Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Character/NPC/Item name"
              />
            </div>

            {/* Variant */}
            <div>
              <Label htmlFor="variant">Art Type</Label>
              <Select value={formData.variant} onValueChange={(value: any) => setFormData(prev => ({ ...prev, variant: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getVariantOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the appearance, abilities, or characteristics..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="dark, magical, armored, ancient (comma separated)"
            />
          </div>

          {/* Advanced Options */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rarity/CR */}
                <div>
                  <Label htmlFor="rarity">Rarity / Challenge</Label>
                  <Input
                    id="rarity"
                    value={formData.rarity}
                    onChange={(e) => setFormData(prev => ({ ...prev, rarity: e.target.value }))}
                    placeholder="Common, Rare, Legendary, CR 1, CR 5, etc."
                  />
                </div>

                {/* Environment */}
                <div>
                  <Label htmlFor="environment">Environment</Label>
                  <Input
                    id="environment"
                    value={formData.environment}
                    onChange={(e) => setFormData(prev => ({ ...prev, environment: e.target.value }))}
                    placeholder="dungeon, forest, castle, etc."
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getEnvironmentSuggestions().slice(0, 4).map(env => (
                      <Badge 
                        key={env}
                        variant="outline" 
                        className="text-xs cursor-pointer hover:bg-primary/20"
                        onClick={() => setFormData(prev => ({ ...prev, environment: env }))}
                      >
                        {env}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              {/* Mood */}
              <div>
                <Label htmlFor="mood">Mood</Label>
                <Input
                  id="mood"
                  value={formData.mood}
                  onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
                  placeholder="heroic, mysterious, dark, menacing..."
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {getMoodSuggestions().slice(0, 6).map(mood => (
                    <Badge 
                      key={mood}
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-primary/20"
                      onClick={() => setFormData(prev => ({ ...prev, mood: mood }))}
                    >
                      {mood}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Extra Lore */}
              <div>
                <Label htmlFor="extraLore">Extra Lore</Label>
                <Textarea
                  id="extraLore"
                  value={formData.extraLore}
                  onChange={(e) => setFormData(prev => ({ ...prev, extraLore: e.target.value }))}
                  placeholder="Additional background story, unique features, or special abilities..."
                  rows={2}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={!isAvailable || isGeneratingArt || !formData.name.trim()}
            className="w-full"
            size="lg"
          >
            {isGeneratingArt ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Art...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Art
              </>
            )}
          </Button>

          {/* Generation Result */}
          {generationResult && (
            <div className={cn(
              "p-4 rounded-lg border",
              generationResult.success ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
            )}>
              {generationResult.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">Art Generated Successfully!</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Generation time: {generationResult.duration}ms
                  </div>
                  {generationResult.paths && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Generated files:</p>
                      <ul className="text-xs text-muted-foreground">
                        {generationResult.paths.map((path: string, i: number) => (
                          <li key={i}>• {path}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-700">
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Generation Failed</span>
                  </div>
                  <p className="text-sm text-red-600">{generationResult.error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
