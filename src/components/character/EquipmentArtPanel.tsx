/**
 * Equipment Art Panel
 * Integrates art generation for equipment items
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArtGenerator } from '@/components/art/ArtGenerator';
import { Image, Camera, RefreshCw, Sword } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface EquipmentArtPanelProps {
  equipmentId: string;
  equipmentData: {
    name?: string;
    description?: string;
    item_type?: string;
    rarity?: string;
    properties?: string;
  };
  onArtUpdated?: (assetId: string) => void;
  className?: string;
}

export function EquipmentArtPanel({ 
  equipmentId, 
  equipmentData, 
  onArtUpdated,
  className 
}: EquipmentArtPanelProps) {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [currentArt, setCurrentArt] = useState<string | null>(null);

  const handleArtGenerated = (assetId: string, previewUrl?: string) => {
    if (previewUrl) {
      setCurrentArt(previewUrl);
    }
    onArtUpdated?.(assetId);
    setIsGeneratorOpen(false);
  };

  const getEquipmentTags = () => {
    const tags = [];
    if (equipmentData.item_type) tags.push(equipmentData.item_type.toLowerCase());
    if (equipmentData.rarity) tags.push(equipmentData.rarity.toLowerCase());
    if (equipmentData.properties) {
      // Extract keywords from properties
      const properties = equipmentData.properties.toLowerCase();
      if (properties.includes('magical')) tags.push('magical');
      if (properties.includes('enchanted')) tags.push('enchanted');
      if (properties.includes('ancient')) tags.push('ancient');
      if (properties.includes('masterwork')) tags.push('masterwork');
      if (properties.includes('sharp')) tags.push('sharp');
      if (properties.includes('heavy')) tags.push('heavy');
      if (properties.includes('light')) tags.push('light');
    }
    return tags;
  };

  const getVariantOptions = () => {
    if (equipmentData.item_type === 'weapon') {
      return [
        { value: 'illustration', label: 'Full Art' },
        { value: 'icon', label: 'Icon' },
      ];
    } else if (equipmentData.item_type === 'armor') {
      return [
        { value: 'illustration', label: 'Full Art' },
        { value: 'icon', label: 'Icon' },
      ];
    } else {
      return [
        { value: 'icon', label: 'Icon' },
        { value: 'illustration', label: 'Illustration' },
      ];
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sword className="w-4 h-4" />
            Equipment Art
          </div>
          <Badge variant="outline">
            {equipmentData.item_type || 'Item'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Art Display */}
        <div className="flex justify-center">
          {currentArt ? (
            <div className="relative group">
              <OptimizedImage
                src={currentArt}
                alt={equipmentData.name || 'Equipment'}
                className="w-24 h-24 object-cover rounded-lg border-2 border-purple-500/30"
                size="small"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsGeneratorOpen(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-900/50">
              <div className="text-center">
                <Camera className="w-6 h-6 mx-auto text-gray-500 mb-1" />
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
              size="sm"
              onClick={() => setIsGeneratorOpen(true)}
            >
              <Camera className="w-3 h-3 mr-2" />
              Generate Art
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate Equipment Art</DialogTitle>
            </DialogHeader>
            <ArtGenerator
              entityType="item"
              entityId={equipmentId}
              existingData={{
                name: equipmentData.name,
                description: equipmentData.description,
                tags: getEquipmentTags(),
                rarity: equipmentData.rarity,
                environment: 'fantasy world',
              }}
              onArtGenerated={handleArtGenerated}
            />
          </DialogContent>
        </Dialog>

        {/* Equipment Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>{equipmentData.item_type || 'Equipment'} art generation</p>
          <p>Solo Leveling themed illustrations</p>
          <p>Multiple variants available</p>
        </div>
      </CardContent>
    </Card>
  );
}
