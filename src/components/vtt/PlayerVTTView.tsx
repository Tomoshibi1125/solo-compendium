import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Grid3x3, 
  Maximize2, 
  RotateCw,
  Eye,
  EyeOff,
  Users,
  MapPin
} from 'lucide-react';
import { useVTTManager } from '@/hooks/useVTTManager';
import { useAuth } from '@/lib/auth/authContext';
import { useToast } from '@/hooks/use-toast';
import './PlayerVTTView.css';

interface PlayerVTTViewProps {
  campaignId: string;
  sessionId: string;
  className?: string;
}

interface VTTToken {
  id: string;
  name: string;
  imageUrl: string;
  x: number;
  y: number;
  isPlayerToken?: boolean;
  isVisible?: boolean;
}

interface VTTScene {
  id: string;
  name: string;
  backgroundImage?: string;
  gridSize: number;
  showGrid: boolean;
  tokens: VTTToken[];
}

export function PlayerVTTView({
  campaignId,
  sessionId,
  className
}: PlayerVTTViewProps) {
  const { user } = useAuth();
  const { loadVTTScene, getVTTAssets } = useVTTManager();
  const { toast } = useToast();

  const [scene, setScene] = useState<VTTScene | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // Refs for dynamic styling to avoid inline styles
  const viewportRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tokenRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    loadScene();
  }, [sessionId]);

  const loadScene = async () => {
    setIsLoading(true);
    try {
      const loadedScene = await loadVTTScene(campaignId, sessionId);
      if (loadedScene) {
        // Transform database tokens to VTTToken format
        const transformedTokens = (loadedScene.tokens || []).map(token => ({
          id: token.id,
          name: token.name,
          imageUrl: token.image_url || '/default-token.png',
          x: token.x,
          y: token.y,
          isPlayerToken: !token.is_dm_token,
          isVisible: true
        }));
        
        setScene({
          id: loadedScene.id,
          name: loadedScene.name,
          backgroundImage: (loadedScene as any).background_image || undefined,
          gridSize: 50,
          showGrid: true,
          tokens: transformedTokens
        });
      } else {
        // Create default scene if none exists
        const defaultScene: VTTScene = {
          id: sessionId,
          name: 'Battle Map',
          gridSize: 50,
          showGrid: true,
          tokens: []
        };
        setScene(defaultScene);
      }
    } catch (error) {
      toast({
        title: 'Failed to Load Scene',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleTokenClick = (tokenId: string) => {
    setSelectedToken(tokenId === selectedToken ? null : tokenId);
  };

  const getGridPosition = (x: number, y: number) => {
    if (!scene) return { gridX: 0, gridY: 0 };
    const gridSize = scene.gridSize || 50;
    return {
      gridX: Math.floor(x / gridSize),
      gridY: Math.floor(y / gridSize)
    };
  };

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
    }
  }, [pan, zoom]);

  useEffect(() => {
    if (backgroundRef.current && scene?.backgroundImage) {
      backgroundRef.current.style.backgroundImage = `url(${scene.backgroundImage})`;
    }
  }, [scene?.backgroundImage]);

  useEffect(() => {
    if (gridRef.current && showGrid && scene) {
      gridRef.current.style.backgroundImage = `
        repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent ${scene.gridSize}px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent ${scene.gridSize}px)
      `;
      gridRef.current.style.backgroundSize = `${scene.gridSize}px ${scene.gridSize}px`;
    }
  }, [showGrid, scene?.gridSize]);

  useEffect(() => {
    if (scene?.tokens) {
      scene.tokens.forEach(token => {
        const tokenElement = tokenRefs.current.get(token.id);
        if (tokenElement) {
          tokenElement.style.left = `${token.x}px`;
          tokenElement.style.top = `${token.y}px`;
        }
      });
    }
  }, [scene?.tokens]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-2 animate-pulse bg-muted rounded" />
            <p>Loading battle map...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scene) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-2 text-muted-foreground bg-muted rounded" />
            <p className="text-muted-foreground">No battle map available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-5 w-5 bg-muted rounded" />
          {scene.name}
          <Badge variant="outline" className="ml-auto">
            <Users className="h-3 w-3 mr-1" />
            Player View
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant={showGrid ? "default" : "outline"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetView}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {scene.tokens?.length || 0} tokens
            </Badge>
            {selectedToken && (
              <Badge variant="outline">
                Token selected
              </Badge>
            )}
          </div>
        </div>

        {/* VTT Canvas */}
        <div
          className={`relative overflow-hidden bg-slate-900 player-vtt-canvas ${
            isDragging ? 'dragging' : ''
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            ref={viewportRef}
            className={`relative w-full h-full player-vtt-viewport player-vtt-viewport-transform ${
              isDragging ? 'dragging' : ''
            }`}
          >
            {/* Background Image */}
            {scene.backgroundImage && (
              <div
                ref={backgroundRef}
                className="absolute inset-0 bg-cover bg-center player-vtt-background player-vtt-background-image"
              />
            )}

            {/* Grid */}
            {showGrid && (
              <div
                ref={gridRef}
                className="absolute inset-0 pointer-events-none player-vtt-grid player-vtt-grid-background"
              />
            )}

            {/* Tokens */}
            {scene.tokens?.map((token) => (
              <div
                key={token.id}
                ref={(el) => {
                  if (el) {
                    tokenRefs.current.set(token.id, el);
                  }
                }}
                className={`absolute cursor-pointer transition-all duration-200 player-vtt-token ${
                  selectedToken === token.id ? 'ring-2 ring-yellow-400' : ''
                } ${token.isPlayerToken ? 'ring-2 ring-blue-400' : ''}`}
                onClick={() => handleTokenClick(token.id)}
              >
                <div className="relative">
                  <img
                    src={token.imageUrl}
                    alt={token.name}
                    className={`w-12 h-12 rounded-full border-2 border-white shadow-lg ${
                      token.isVisible === false ? 'brightness-50' : ''
                    }`}
                  />
                  {token.isPlayerToken && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                  )}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {token.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Token Details */}
        {selectedToken && (
          <div className="p-4 border-t">
            {(() => {
              const token = scene.tokens?.find(t => t.id === selectedToken);
              if (!token) return null;
              
              const { gridX, gridY } = getGridPosition(token.x, token.y);
              
              return (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={token.imageUrl}
                      alt={token.name}
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <div>
                      <h4 className="font-medium">{token.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Position: ({gridX}, {gridY})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {token.isPlayerToken && (
                      <Badge variant="default">Player</Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedToken(null)}
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
