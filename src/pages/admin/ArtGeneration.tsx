/**
 * Art Generation Admin Page
 * Interface for managing Stable Diffusion art generation
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArtPipeline, useArtQueueMonitor, useBatchArtGeneration } from '@/lib/artPipeline/hooks';
import { Loader2, Play, Square, RefreshCw, Image, CheckCircle, XCircle } from 'lucide-react';

export default function ArtGenerationAdmin() {
  const {
    isAvailable,
    isGenerating,
    queueStatus,
    generateArt,
    getQueueStatus,
    clearQueue,
    interrupt,
    checkAvailability,
  } = useArtPipeline();

  const { generateBatch, progress, results, isGenerating: isBatchGenerating } = useBatchArtGeneration();
  const queueMonitor = useArtQueueMonitor(2000);

  const [testResult, setTestResult] = useState<any>(null);
  const [isTestGenerating, setIsTestGenerating] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const handleTestGeneration = async () => {
    setIsTestGenerating(true);
    setTestResult(null);

    const testRequest = {
      entityType: 'monster' as const,
      entityId: 'test-shadow-beast',
      variant: 'portrait' as const,
      title: 'Test Shadow Beast',
      tags: ['dark', 'manhwa', 'anime', 'solo leveling', 'test'],
      description: 'A test creature for art generation',
      rarityOrCR: 'CR 1',
      environment: 'dark realm',
      mood: 'mysterious'
    };

    try {
      const result = await generateArt(testRequest);
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setIsTestGenerating(false);
    }
  };

  const handleBatchGeneration = async () => {
    const sampleRequests = [
      {
        entityType: 'monster' as const,
        entityId: 'goblin-shadow',
        variant: 'portrait' as const,
        title: 'Shadow Goblin',
        tags: ['dark', 'manhwa', 'anime', 'solo leveling'],
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
          <p className="text-muted-foreground">Manage Stable Diffusion art generation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isAvailable ? 'default' : 'destructive'}>
            {isAvailable ? 'Connected' : 'Disconnected'}
          </Badge>
          <Button variant="outline" size="sm" onClick={checkAvailability}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Status
          </Button>
        </div>
      </div>

      {!isAvailable && (
        <Alert>
          <AlertDescription>
            ComfyUI is not running. Please start ComfyUI with the start-comfyui.bat script.
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
