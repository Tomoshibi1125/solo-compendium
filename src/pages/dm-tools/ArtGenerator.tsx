/**
 * Warden Tools Art Generator
 * Allows Wardens to generate art for monsters, NPCs, and homebrew content
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArtGenerator } from '@/components/art/ArtGenerator';
import { AIEnhancedArtGenerator } from '@/components/art/AIEnhancedArtGenerator';
import { artPipeline } from '@/lib/artPipeline/service';
import type { ArtAsset } from '@/lib/artPipeline/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Sparkles, Sword, Shield, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useDebounce } from '@/hooks/useDebounce';
import { useUserToolState } from '@/hooks/useToolState';
import { getRuntimeEnvValue } from '@/lib/runtimeEnv';

type ContentType = 'monster' | 'npc' | 'item' | 'location';

interface GeneratedContent {
  id: string;
  type: ContentType;
  name: string;
  artId?: string;
  artUrl?: string;
  data: Record<string, unknown>;
}

export default function ArtGeneratorDM() {
  const navigate = useNavigate();
  const STORAGE_KEY = 'solo-compendium.dm-tools.art-generator.v1';
  const [contentType, setContentType] = useState<ContentType>('monster');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<GeneratedContent | null>(null);
  const [lastEditId, setLastEditId] = useState<string | null>(null);
  const [isAIArtPending, setIsAIArtPending] = useState(false);
  const [isDialogClosing, setIsDialogClosing] = useState(false);
  const hydratedRef = useRef(false);
  const { state: storedContent, isLoading, saveNow } = useUserToolState<GeneratedContent[]>('art_generator', {
    initialState: [],
    storageKey: STORAGE_KEY,
  });
  const debouncedContent = useDebounce(generatedContent, 800);

  useEffect(() => {
    if (isLoading || hydratedRef.current) return;
    if (Array.isArray(storedContent) && storedContent.length > 0) {
      setGeneratedContent(storedContent);
    }
    hydratedRef.current = true;
  }, [isLoading, storedContent]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    void saveNow(debouncedContent);
  }, [debouncedContent, saveNow]);

  const updateCurrentItem = useCallback((updates: Partial<GeneratedContent>) => {
    if (!currentEditItem) return;
    setGeneratedContent(prev =>
      prev.map(item =>
        item.id === currentEditItem.id ? { ...item, ...updates } : item
      )
    );
    setCurrentEditItem(prev => (prev ? { ...prev, ...updates } : prev));
  }, [currentEditItem]);

  const updateCurrentItemData = useCallback((updates: Record<string, unknown>) => {
    if (!currentEditItem) return;
    const nextData = { ...(currentEditItem.data || {}), ...updates };
    updateCurrentItem({ data: nextData });
  }, [currentEditItem, updateCurrentItem]);

  const getPreviewUrl = useCallback((asset: ArtAsset): string | undefined => {
    const paths = asset.paths;
    if (!paths || typeof paths !== 'object') return undefined;
    const candidates = [
      (paths as Record<string, string>).md,
      (paths as Record<string, string>).thumb,
      (paths as Record<string, string>).lg,
      (paths as Record<string, string>).original,
      (paths as Record<string, string>).token,
    ];
    return candidates.find((value) => typeof value === 'string' && value.length > 0);
  }, []);

  const withTimeout = useCallback(async <T,>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(label)), timeoutMs);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, []);

  const fetchArtAsset = useCallback(async (entityId: string) => {
    const supabaseUrl = getRuntimeEnvValue('VITE_SUPABASE_URL');
    const supabaseKey = getRuntimeEnvValue('VITE_SUPABASE_PUBLISHABLE_KEY') || getRuntimeEnvValue('VITE_SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseKey) return null;

    const baseUrl = supabaseUrl.replace(/\/$/, '');
    const url = new URL(`${baseUrl}/rest/v1/art_assets`);
    url.searchParams.set('select', 'id,paths');
    url.searchParams.set('entity_id', `eq.${entityId}`);
    url.searchParams.set('variant', 'eq.portrait');
    url.searchParams.set('order', 'created_at.desc');
    url.searchParams.set('limit', '1');

    const response = await withTimeout(
      fetch(url.toString(), {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }),
      8000,
      'Art asset lookup timed out'
    );

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    if (Array.isArray(payload)) {
      return payload[0] ?? null;
    }
    return payload ?? null;
  }, [withTimeout]);

  const attemptAttachArt = useCallback(async (): Promise<boolean> => {
    if (!currentEditItem) {
      setIsAIArtPending(false);
      return false;
    }
    if (currentEditItem.artId || currentEditItem.artUrl) {
      setIsAIArtPending(false);
      return true;
    }

    const entityIdCandidates = [
      currentEditItem.id,
      `ai-enhanced-${currentEditItem.id}`,
    ];

    for (let attempt = 0; attempt < 5; attempt += 1) {
      for (const candidateId of entityIdCandidates) {
        try {
          const apiAsset = await fetchArtAsset(candidateId);
          if (apiAsset) {
            const previewUrl =
              apiAsset.paths && typeof apiAsset.paths === 'object'
                ? Object.values(apiAsset.paths as Record<string, string>).find((value) => typeof value === 'string')
                : undefined;
            updateCurrentItem({ artId: apiAsset.id, artUrl: previewUrl });
            setIsAIArtPending(false);
            return true;
          }

          const assets = await artPipeline.getAssetsForEntity(currentEditItem.type, candidateId);
          if (assets.length > 0) {
            const asset = assets[0];
            const previewUrl = getPreviewUrl(asset);
            updateCurrentItem({ artId: asset.id, artUrl: previewUrl });
            setIsAIArtPending(false);
            return true;
          }
        } catch {
          // Ignore lookup errors; fallback to next candidate.
        }
      }

      if (attempt < 4) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    setIsAIArtPending(false);
    return false;
  }, [currentEditItem, fetchArtAsset, getPreviewUrl, updateCurrentItem]);

  useEffect(() => {
    if (!currentEditItem || isGeneratorOpen) return;
    if (currentEditItem.artId || currentEditItem.artUrl) return;

    let isActive = true;
    const resolveArtAttachment = async () => {
      if (!isActive) return;
      await attemptAttachArt();
    };

    void resolveArtAttachment();

    return () => {
      isActive = false;
    };
  }, [currentEditItem, isGeneratorOpen, attemptAttachArt]);

  const handleArtGenerated = (assetId: string, previewUrl?: string) => {
    const targetId = currentEditItem?.id ?? lastEditId;
    if (targetId) {
      setGeneratedContent(prev =>
        prev.map(item =>
          item.id === targetId ? { ...item, artId: assetId, artUrl: previewUrl } : item
        )
      );
      if (currentEditItem?.id === targetId) {
        setCurrentEditItem(prev => (prev ? { ...prev, artId: assetId, artUrl: previewUrl } : prev));
      }
      setIsAIArtPending(false);
      return;
    }

    const fallbackItem: GeneratedContent = {
      id: `generated-${Date.now()}`,
      type: contentType,
      name: 'Generated Art',
      artId: assetId,
      artUrl: previewUrl,
      data: {},
    };
    setGeneratedContent(prev => [...prev, fallbackItem]);
    setIsAIArtPending(false);
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
    setLastEditId(newItem.id);
    setIsGeneratorOpen(true);
  };

  const editContent = (item: GeneratedContent) => {
    setCurrentEditItem(item);
    setLastEditId(item.id);
    setIsGeneratorOpen(true);
  };

  const deleteContent = (id: string) => {
    setGeneratedContent(prev => prev.filter(item => item.id !== id));
  };

  const formatContentTypeLabel = (type: ContentType) =>
    type.charAt(0).toUpperCase() + type.slice(1);

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
            Back to Warden Tools
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
                  Generate New {formatContentTypeLabel(type)}
                </Button>
              </div>

              {/* Generated Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedContent
                  .filter(item => item.type === type)
                  .map(item => {
                    const artSrc =
                      item.artUrl ||
                      (item.artId && item.artId.startsWith('http') ? item.artId : null);

                    return (
                      <Card 
                        key={item.id} 
                        className={`border ${getContentTypeColor(item.type)} hover:shadow-lg transition-shadow`}
                        data-testid="generated-content-card"
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
                              {artSrc ? (
                                <OptimizedImage
                                  src={artSrc}
                                  alt={item.name}
                                  className="w-full h-32 object-cover rounded-lg border"
                                  size="large"
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
                              {item.artId && <p>Art Generated</p>}
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
                    );
                  })}
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
                      Generate {formatContentTypeLabel(type)} Art
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
        </Tabs>

        {/* Art Generator Dialog */}
        {currentEditItem && (
          <Dialog
            open={isGeneratorOpen}
            onOpenChange={(open) => {
              if (!open) {
                if (isAIArtPending || isDialogClosing) return;
                if (currentEditItem && !currentEditItem.artId && !currentEditItem.artUrl) {
                  setIsDialogClosing(true);
                  void (async () => {
                    await attemptAttachArt();
                    setIsDialogClosing(false);
                    setIsGeneratorOpen(false);
                  })();
                  return;
                }
              }
              setIsGeneratorOpen(open);
            }}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Generate {formatContentTypeLabel(currentEditItem.type)} Art
                </DialogTitle>
                <DialogDescription>
                  Create custom System Ascendant themed art for your {currentEditItem.type}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="content-name">Name</Label>
                  <Input
                    id="content-name"
                    value={currentEditItem.name}
                    onChange={(event) => updateCurrentItem({ name: event.target.value })}
                    placeholder="Name your content"
                  />
                </div>
                <div>
                  <Label htmlFor="content-tags">Tags</Label>
                  <Input
                    id="content-tags"
                    value={(currentEditItem.data?.tags || []).join(', ')}
                    onChange={(event) =>
                      updateCurrentItemData({
                        tags: event.target.value.split(',').map((tag: string) => tag.trim()).filter(Boolean),
                      })
                    }
                    placeholder="dark, elite, mystic"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="content-description">Description</Label>
                  <Textarea
                    id="content-description"
                    value={currentEditItem.data?.description || ''}
                    onChange={(event) => updateCurrentItemData({ description: event.target.value })}
                    placeholder="Short description to guide the art generation"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="content-rarity">Rarity / Challenge</Label>
                  <Input
                    id="content-rarity"
                    value={currentEditItem.data?.rarity || ''}
                    onChange={(event) => updateCurrentItemData({ rarity: event.target.value })}
                    placeholder="Rare, Legendary, CR 7"
                  />
                </div>
                <div>
                  <Label htmlFor="content-environment">Environment</Label>
                  <Input
                    id="content-environment"
                    value={currentEditItem.data?.environment || ''}
                    onChange={(event) => updateCurrentItemData({ environment: event.target.value })}
                    placeholder="Dungeon, city skyline, frozen rift"
                  />
                </div>
              </div>
              <Tabs defaultValue="standard" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="standard">Standard</TabsTrigger>
                  <TabsTrigger value="ai">AI Enhanced</TabsTrigger>
                </TabsList>
                <TabsContent value="standard">
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
                </TabsContent>
                <TabsContent value="ai">
                  <AIEnhancedArtGenerator
                    entityType={currentEditItem.type}
                    entityId={`ai-enhanced-${currentEditItem.id}`}
                    title={currentEditItem.name || `Generated ${formatContentTypeLabel(currentEditItem.type)}`}
                    onArtGenerated={handleArtGenerated}
                    onGenerationStart={() => setIsAIArtPending(true)}
                    onGenerationComplete={() => {
                      void attemptAttachArt();
                    }}
                  />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}


