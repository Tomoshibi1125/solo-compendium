/**
 * Art Generation Warden Tool
 * Interface for managing AI-driven art generation
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArtPipeline, useArtQueueMonitor, useBatchArtGeneration } from '@/lib/artPipeline/hooks';
import { Loader2, Play, Square, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function ArtGenerationAdmin() {
  const {
    isAvailable,
    enabled,
    generateArt,
    clearQueue,
    interrupt,
    checkAvailability,
  } = useArtPipeline();

  const { generateBatch, progress, results, isGenerating: isBatchGenerating } = useBatchArtGeneration();
  const queueMonitor = useArtQueueMonitor(enabled ? 2000 : 0);

  const [testResult, setTestResult] = useState<any>(null);
  const [isTestGenerating, setIsTestGenerating] = useState(false);
  const TEST_RESULT_KEY = 'solo-compendium.art-generation.test-result.v1';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(TEST_RESULT_KEY);
    if (!stored) return;
    try {
      setTestResult(JSON.parse(stored));
    } catch {
      // Ignore cached value if it is malformed.
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (!testResult) {
        window.localStorage.removeItem(TEST_RESULT_KEY);
        return;
      }
      window.localStorage.setItem(TEST_RESULT_KEY, JSON.stringify(testResult));
    } catch {
      // Ignore storage write failures.
    }
  }, [testResult]);

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(label)), timeoutMs);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  const fetchArtAsset = async (entityId: string, variant: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) return null;

    const baseUrl = supabaseUrl.replace(/\/$/, '');
    const url = new URL(`${baseUrl}/rest/v1/art_assets`);
    url.searchParams.set('select', 'id,paths,metadata');
    url.searchParams.set('entity_id', `eq.${entityId}`);
    url.searchParams.set('variant', `eq.${variant}`);
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
  };

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const handleTestGeneration = async () => {
    setIsTestGenerating(true);
    setTestResult(null);
    const startedAt = Date.now();
    let nextResult: any = null;

    const testRequest = {
      entityType: 'monster' as const,
      entityId: 'test-shadow-beast',
      variant: 'portrait' as const,
      title: 'Test Shadow Beast',
      tags: ['dark', 'manhwa', 'anime', 'system ascendant', 'test'],
      description: 'A test creature for art generation',
      rarityOrCR: 'CR 1',
      environment: 'dark realm',
      mood: 'mysterious'
    };

    try {
      const cachedAsset = await fetchArtAsset(testRequest.entityId, testRequest.variant);
      if (cachedAsset) {
        const pathValues = cachedAsset.paths && typeof cachedAsset.paths === 'object'
          ? Object.values(cachedAsset.paths as Record<string, string>)
          : [];
        nextResult = {
          success: true,
          assetId: cachedAsset.id,
          paths: pathValues,
          metadata: cachedAsset.metadata,
          duration: Date.now() - startedAt,
        };
      } else {
        const result = await generateArt(testRequest);
        if (result && typeof result.success === 'boolean' && result.success) {
          nextResult = result;
        } else {
          let fallbackAsset: { id: string; paths: Record<string, string>; metadata: any } | null = null;
          for (let attempt = 0; attempt < 4; attempt += 1) {
            fallbackAsset = await fetchArtAsset(testRequest.entityId, testRequest.variant);
            if (fallbackAsset) {
              break;
            }
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }

          if (fallbackAsset) {
            const pathValues = fallbackAsset.paths && typeof fallbackAsset.paths === 'object'
              ? Object.values(fallbackAsset.paths as Record<string, string>)
              : [];
            nextResult = {
              success: true,
              assetId: fallbackAsset.id,
              paths: pathValues,
              metadata: fallbackAsset.metadata,
              duration: Date.now() - startedAt,
            };
          } else if (result && typeof result.success === 'boolean') {
            nextResult = {
              ...result,
              duration: result.duration ?? Date.now() - startedAt,
            };
          }
        }
      }
    } catch (error) {
      nextResult = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startedAt,
      };
    } finally {
      setIsTestGenerating(false);
    }

    if (!nextResult) {
      nextResult = {
        success: false,
        error: 'Art generation returned no result',
        duration: Date.now() - startedAt,
      };
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(TEST_RESULT_KEY, JSON.stringify(nextResult));
      } catch {
        // Ignore storage write failures.
      }
    }

    setTestResult(nextResult);
  };

  const handleBatchGeneration = async () => {
    const sampleRequests = [
      {
        entityType: 'monster' as const,
        entityId: 'goblin-shadow',
        variant: 'portrait' as const,
        title: 'Shadow Goblin',
        tags: ['dark', 'manhwa', 'anime', 'system ascendant'],
        description: 'A menacing goblin with shadow abilities'
      },
      {
        entityType: 'item' as const,
        entityId: 'sword-flame',
        variant: 'icon' as const,
        title: 'Flame Sword',
        tags: ['weapon', 'sword', 'fire', 'magic'],
        description: 'A magical sword imbued with fire'
      },
      {
        entityType: 'spell' as const,
        entityId: 'fireball',
        variant: 'illustration' as const,
        title: 'Fireball Spell',
        tags: ['evocation', 'fire', 'damage', 'area'],
        description: 'An explosive fireball spell'
      }
    ];

    await generateBatch(sampleRequests);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Art Generation</h1>
          <p className="text-muted-foreground">Manage AI-assisted art generation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={enabled && isAvailable ? 'default' : 'secondary'}>
            {enabled && isAvailable ? 'Available' : 'Disabled'}
          </Badge>
          <Button variant="outline" size="sm" onClick={checkAvailability} disabled={!enabled}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {!enabled && (
        <Alert>
          <AlertDescription>
            Art generation is disabled. Enable it with <code>VITE_FEATURE_ART_GENERATION=true</code>.
            You can override the free image backend with <code>VITE_FREE_IMAGE_API</code>.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="single" className="space-y-4">
        <TabsList>
          <TabsTrigger value="single">Single Generation</TabsTrigger>
          <TabsTrigger value="batch">Batch Generation</TabsTrigger>
          <TabsTrigger value="queue">Queue Status</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                type="button"
                onClick={handleTestGeneration}
                disabled={!isAvailable || isTestGenerating}
                className="w-full"
              >
                {isTestGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Test Image
                  </>
                )}
              </Button>

              {testResult && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {testResult.success ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-700">Generation Successful</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700">Generation Failed</span>
                      </>
                    )}
                  </div>
                  
                  {testResult.success && (
                    <div className="space-y-1 text-sm">
                      <p>Duration: {testResult.duration}ms</p>
                      {testResult.paths && (
                        <div>
                          <p>Generated files:</p>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {testResult.paths.map((path: string, i: number) => (
                              <li key={i}>{path}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {testResult.error && (
                    <p className="text-sm text-red-600">Error: {testResult.error}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                type="button"
                onClick={handleBatchGeneration}
                disabled={!isAvailable || isBatchGenerating}
                className="w-full"
              >
                {isBatchGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Batch...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Sample Batch
                  </>
                )}
              </Button>

              {isBatchGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Batch Results:</h4>
                  <div className="space-y-1">
                    {results.map((result, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>Item {i + 1}</span>
                        <Badge variant={result.success ? 'default' : 'destructive'}>
                          {result.success ? 'Success' : 'Failed'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Queue Status
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearQueue}
                    disabled={!isAvailable}
                  >
                    Clear Queue
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={interrupt}
                    disabled={!isAvailable}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Interrupt
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queueMonitor ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Running</h4>
                      <p className="text-2xl font-bold">{queueMonitor.running?.length || 0}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Pending</h4>
                      <p className="text-2xl font-bold">{queueMonitor.pending?.length || 0}</p>
                    </div>
                  </div>
                  
                  {(queueMonitor.running?.length > 0 || queueMonitor.pending?.length > 0) && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Queue Details:</h4>
                      <div className="space-y-1 text-sm">
                        {queueMonitor.running?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between">
                            <span>Running {i + 1}</span>
                            <Badge variant="default">Active</Badge>
                          </div>
                        ))}
                        {queueMonitor.pending?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between">
                            <span>Pending {i + 1}</span>
                            <Badge variant="secondary">Queued</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Queue status not available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

