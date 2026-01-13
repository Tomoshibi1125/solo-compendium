/**
 * DM Tools Art Generator
 * Allows DMs to generate art for monsters, NPCs, and homebrew content
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArtGenerator } from '@/components/art/ArtGenerator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Camera, Sparkles, Sword, Shield, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type ContentType = 'monster' | 'npc' | 'item' | 'location';

interface GeneratedContent {
  id: string;
  type: ContentType;
  name: string;
  artId?: string;
  data: any;
}

export default function ArtGeneratorDM() {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState<ContentType>('monster');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<GeneratedContent | null>(null);

  const handleArtGenerated = (assetId: string) => {
    if (currentEditItem) {
      setGeneratedContent(prev => 
        prev.map(item => 
          item.id === currentEditItem.id 
            ? { ...item, artId: assetId }
            : item
        )
      );
      setCurrentEditItem(null);
      setIsGeneratorOpen(false);
    }
  };

  const createNewContent = (type: ContentType) => {
    const newItem: GeneratedContent = {
      id: `${type}-${Date.now()}`,
      type,
      name: '',
      data: {},
    };
    setGeneratedContent(prev => [...prev, newItem]);
    setCurrentEditItem(newItem);
    setIsGeneratorOpen(true);
  };

  const editContent = (item: GeneratedContent) => {
    setCurrentEditItem(item);
    setIsGeneratorOpen(true);
  };

  const deleteContent = (id: string) => {
    setGeneratedContent(prev => prev.filter(item => item.id !== id));
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'monster': return <Sword className="w-4 h-4" />;
      case 'npc': return <Shield className="w-4 h-4" />;
      case 'item': return <Sparkles className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
    }
  };

  const getContentTypeColor = (type: ContentType) => {
    switch (type) {
      case 'monster': return 'border-red-500/30';
      case 'npc': return 'border-blue-500/30';
      case 'item': return 'border-purple-500/30';
      case 'location': return 'border-green-500/30';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DM Tools
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Art Generator</h1>
            <p className="text-muted-foreground">Generate custom art for your campaign content</p>
          </div>
        </div>

        {/* Content Type Tabs */}
        <Tabs value={contentType} onValueChange={(value: ContentType) => setContentType(value)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monster" className="flex items-center gap-2">
              <Sword className="w-4 h-4" />
              Monsters
            </TabsTrigger>
            <TabsTrigger value="npc" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              NPCs
            </TabsTrigger>
            <TabsTrigger value="item" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Items
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Locations
            </TabsTrigger>
          </TabsList>

          {/* Content Lists */}
          {(['monster', 'npc', 'item', 'location'] as ContentType[]).map(type => (
            <TabsContent key={type} value={type} className="space-y-4">
              {/* Add New Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold capitalize">
                  {type} Art
                </h2>
                <Button onClick={() => createNewContent(type)}>
                  <Camera className="w-4 h-4 mr-2" />
                  Generate New {type.slice(0, -1).toUpperCase() + type.slice(1)}
                </Button>
              </div>

              {/* Generated Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedContent
                  .filter(item => item.type === type)
                  .map(item => (
                    <Card 
                      key={item.id} 
                      className={`border ${getContentTypeColor(item.type)} hover:shadow-lg transition-shadow`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getContentTypeIcon(item.type)}
                            <span className="text-lg">{item.name || 'Untitled'}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editContent(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteContent(item.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Art Display */}
                          <div className="flex justify-center">
                            {item.artId ? (
                              <img
                                src={item.artId}
                                alt={item.name}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-900/50">
                                <div className="text-center">
                                  <Camera className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                                  <p className="text-sm text-gray-500">No Art</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Content Info */}
                          <div className="text-sm text-muted-foreground">
                            <p>Type: {item.type}</p>
                            <p>ID: {item.id}</p>
                            {item.artId && <p>✨ Art Generated</p>}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editContent(item)}
                              className="flex-1"
                            >
                              <Camera className="w-3 h-3 mr-1" />
                              Regenerate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Empty State */}
                {generatedContent.filter(item => item.type === type).length === 0 && (
                  <div className="text-center py-12">
                    {getContentTypeIcon(type)}
                    <h3 className="text-lg font-semibold mt-4 mb-2">
                      No {type} Art Generated Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first {type} art to get started
                    </p>
                    <Button onClick={() => createNewContent(type)}>
                      <Camera className="w-4 h-4 mr-2" />
                      Generate {type.slice(0, -1).toUpperCase() + type.slice(1)} Art
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
        </Tabs>

        {/* Art Generator Dialog */}
        {currentEditItem && (
          <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="mb-4">
                <h2 className="text-xl font-bold">
                  Generate {currentEditItem.type.slice(0, -1).toUpperCase() + currentEditItem.type.slice(1)} Art
                </h2>
                <p className="text-muted-foreground">
                  Create custom Solo Leveling themed art for your {currentEditItem.type}
                </p>
              </div>
              <ArtGenerator
                entityType={currentEditItem.type}
                entityId={currentEditItem.id}
                existingData={{
                  name: currentEditItem.name,
                  description: currentEditItem.data.description,
                  tags: currentEditItem.data.tags,
                  rarity: currentEditItem.data.rarity,
                  environment: currentEditItem.data.environment,
                }}
                onArtGenerated={handleArtGenerated}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
