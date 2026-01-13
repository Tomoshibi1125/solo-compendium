/**
 * Character Art Panel
 * Integrates art generation into character sheets
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArtGenerator } from '@/components/art/ArtGenerator';
import { Image, Camera, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CharacterArtPanelProps {
  characterId: string;
  characterData: {
    name?: string;
    appearance?: string;
    backstory?: string;
    job?: string;
    level?: number;
  };
  onArtUpdated?: (assetId: string) => void;
  className?: string;
}

export function CharacterArtPanel({ 
  characterId, 
  characterData, 
  onArtUpdated,
  className 
}: CharacterArtPanelProps) {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [currentArt, setCurrentArt] = useState<string | null>(null);

  const handleArtGenerated = (assetId: string) => {
    setCurrentArt(assetId);
    onArtUpdated?.(assetId);
    setIsGeneratorOpen(false);
  };

  const getCharacterTags = () => {
    const tags = [];
    if (characterData.job) tags.push(characterData.job.toLowerCase());
    if (characterData.level) tags.push(`level ${characterData.level}`);
    if (characterData.appearance) {
      // Extract keywords from appearance
      const appearance = characterData.appearance.toLowerCase();
      if (appearance.includes('tall')) tags.push('tall');
      if (appearance.includes('short')) tags.push('short');
      if (appearance.includes('muscular')) tags.push('muscular');
      if (appearance.includes('slender')) tags.push('slender');
      if (appearance.includes('dark')) tags.push('dark hair');
      if (appearance.includes('light')) tags.push('light hair');
    }
    return tags;
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Character Art
          </div>
          <Badge variant="outline">
            Solo Leveling Style
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Art Display */}
        <div className="flex justify-center">
          {currentArt ? (
            <div className="relative group">
              <img
                src={currentArt}
                alt={characterData.name || 'Character portrait'}
                className="w-32 h-32 object-cover rounded-lg border-2 border-purple-500/30"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsGeneratorOpen(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-900/50">
              <div className="text-center">
                <Camera className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                <p className="text-xs text-gray-500">No Art</p>
              </div>
            </div>
          )}
        </div>

        {/* Generate Art Button */}
        <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsGeneratorOpen(true)}
            >
              <Camera className="w-4 h-4 mr-2" />
              Generate Character Art
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate Character Art</DialogTitle>
            </DialogHeader>
            <ArtGenerator
              entityType="character"
              entityId={characterId}
              existingData={{
                name: characterData.name,
                description: characterData.appearance,
                tags: getCharacterTags(),
                rarity: `Level ${characterData.level || 1}`,
                environment: 'fantasy world',
              }}
              onArtGenerated={handleArtGenerated}
            />
          </DialogContent>
        </Dialog>

        {/* Art Info */}
        {currentArt && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>✨ Solo Leveling themed character portrait</p>
            <p>🎨 Generated with Stable Diffusion</p>
            <p>🔄 Click Regenerate to create new art</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
