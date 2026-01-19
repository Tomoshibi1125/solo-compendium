import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download, Upload, Grid, Plus, Minus, Move, RotateCw, Trash2, Layers } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import tokensCompendium from '@/data/tokens';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface PlacedToken {
  id: string;
  tokenId: string;
  name: string;
  emoji?: string;
  imageUrl?: string;
  color?: string;
  size: 'small' | 'medium' | 'large' | 'huge';
  x: number;
  y: number;
  rotation: number;
  layer: number;
  locked: boolean;
}

interface MapToken {
  id: string;
  name: string;
  emoji?: string;
  imageUrl?: string;
  color?: string;
  size: 'small' | 'medium' | 'large' | 'huge';
  category: string;
}

const SIZE_VALUES = {
  small: 32,
  medium: 48,
  large: 64,
  huge: 96,
};

const VTTMap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [gridSize] = useState(50);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [placedTokens, setPlacedTokens] = useState<PlacedToken[]>([]);
  const [draggedToken, setDraggedToken] = useState<PlacedToken | null>(null);
  const [availableTokens, setAvailableTokens] = useState<MapToken[]>([]);
  const [currentLayer, setCurrentLayer] = useState(0);

  useEffect(() => {
    // Load tokens
    const savedTokens = localStorage.getItem('vtt-tokens');
    if (savedTokens) {
      try {
        const parsed = JSON.parse(savedTokens);
        const tokens: MapToken[] = parsed.map((t: { id: string; name: string; emoji?: string; imageUrl?: string; color?: string; size: 'small' | 'medium' | 'large' | 'huge'; category: string }) => ({
          id: t.id,
          name: t.name,
          emoji: t.emoji,
          imageUrl: t.imageUrl,
          color: t.color,
          size: t.size,
          category: t.category,
        }));
        setAvailableTokens(tokens);
      } catch (e) {
        // No tokens available
      }
    } else {
      const fallbackTokens: MapToken[] = tokensCompendium.map((token) => ({
        id: token.id,
        name: token.name,
        imageUrl: token.image,
        size: token.type === 'boss' ? 'huge' : token.type === 'monster' ? 'large' : 'medium',
        category: token.type,
        color: token.friendly ? '#38bdf8' : '#f97316',
      }));
      setAvailableTokens(fallbackTokens);
      localStorage.setItem('vtt-tokens', JSON.stringify(fallbackTokens));
    }

    // Load map state
    const savedState = localStorage.getItem('vtt-map-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setPlacedTokens(parsed.tokens || []);
        setCurrentLayer(parsed.currentLayer || 0);
      } catch (e) {
        // Invalid state
      }
    }
  }, []);

  const saveMapState = () => {
    const state = {
      tokens: placedTokens,
      currentLayer,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('vtt-map-state', JSON.stringify(state));
    toast({
      title: 'Saved!',
      description: 'Map state saved.',
    });
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current || !selectedToken) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Snap to grid
    const gridX = Math.floor(x / (gridSize * zoom));
    const gridY = Math.floor(y / (gridSize * zoom));

    const token = availableTokens.find(t => t.id === selectedToken);
    if (token) {
        const placed: PlacedToken = {
          id: `placed-${Date.now()}`,
          tokenId: token.id,
          name: token.name,
          emoji: token.emoji,
          imageUrl: token.imageUrl,
          color: token.color,
          size: token.size,
          x: gridX,
          y: gridY,
          rotation: 0,
          layer: currentLayer,
          locked: false,
        };
      setPlacedTokens([...placedTokens, placed]);
      setSelectedToken(null);
    }
  };

  const handleTokenDragStart = (token: PlacedToken, e: React.MouseEvent) => {
    if (token.locked) return;
    e.stopPropagation();
    setDraggedToken(token);
  };

  const handleTokenDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedToken || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridX = Math.floor(x / (gridSize * zoom));
    const gridY = Math.floor(y / (gridSize * zoom));

    setPlacedTokens(tokens =>
      tokens.map(t =>
        t.id === draggedToken.id
          ? { ...t, x: gridX, y: gridY }
          : t
      )
    );
  };

  const handleTokenDragEnd = () => {
    setDraggedToken(null);
  };

  const handleDeleteToken = (id: string) => {
    setPlacedTokens(tokens => tokens.filter(t => t.id !== id));
  };

  const handleRotateToken = (id: string) => {
    setPlacedTokens(tokens =>
      tokens.map(t =>
        t.id === id ? { ...t, rotation: (t.rotation + 90) % 360 } : t
      )
    );
  };

  const handleToggleLock = (id: string) => {
    setPlacedTokens(tokens =>
      tokens.map(t =>
        t.id === id ? { ...t, locked: !t.locked } : t
      )
    );
  };

  const handleExport = () => {
    const exportData = {
      tokens: placedTokens,
      currentLayer,
      exported: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vtt-map-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Exported!',
      description: 'Map exported.',
    });
  };

  const visibleTokens = placedTokens.filter(t => t.layer === currentLayer);
  const mapWidth = 20;
  const mapHeight = 20;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DM Tools
          </Button>
          <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow">
            VTT MAP VIEWER
          </h1>
          <p className="text-muted-foreground font-heading">
            Place tokens on maps for virtual tabletop gameplay. Drag tokens, rotate, and organize by layers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <SystemWindow title="CONTROLS">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-heading mb-2 block">Zoom</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                      aria-label="Zoom out"
                      data-testid="vtt-zoom-out"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="flex-1 text-center text-sm">{Math.round(zoom * 100)}%</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                      aria-label="Zoom in"
                      data-testid="vtt-zoom-in"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-heading mb-2 block">Layer</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentLayer(Math.max(0, currentLayer - 1))}
                      aria-label="Layer down"
                      data-testid="vtt-layer-down"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="flex-1 text-center text-sm">{currentLayer}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentLayer(currentLayer + 1)}
                      aria-label="Layer up"
                      data-testid="vtt-layer-up"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showGrid"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="w-4 h-4"
                    aria-label="Show grid"
                    data-testid="vtt-toggle-grid"
                  />
                  <label htmlFor="showGrid" className="text-sm cursor-pointer">Show Grid</label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveMapState} variant="outline" className="flex-1" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleExport} variant="outline" className="flex-1" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </SystemWindow>

            <SystemWindow title="TOKEN LIBRARY">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableTokens.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No tokens available. Go to Token Library to create tokens.
                  </p>
                ) : (
                  availableTokens.map((token) => {
                    const size = SIZE_VALUES[token.size];
                    return (
                      <button
                        key={token.id}
                        onClick={() => setSelectedToken(token.id)}
                        className={cn(
                          'w-full p-2 rounded border text-left transition-all',
                          selectedToken === token.id
                            ? 'bg-primary/20 border-primary'
                            : 'border-border hover:bg-muted/50'
                        )}
                        data-testid="vtt-token-option"
                        aria-label={`Select token ${token.name}`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'rounded-full flex items-center justify-center text-lg border',
                              token.color ? `border-[${token.color}]` : 'border-border'
                            )}
                            style={{
                              width: `${Math.min(size / 2, 32)}px`,
                              height: `${Math.min(size / 2, 32)}px`,
                              backgroundColor: token.color ? `${token.color}20` : undefined,
                            }}
                          >
                            {token.imageUrl ? (
                              <OptimizedImage
                                src={token.imageUrl}
                                alt={token.name}
                                className="w-full h-full object-cover rounded-full"
                                size="thumbnail"
                              />
                            ) : (
                              token.emoji || '@'
                            )}
                          </div>
                          <span className="text-xs font-heading truncate flex-1">{token.name}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
              <Button
                onClick={() => navigate('/dm-tools/token-library')}
                variant="outline"
                className="w-full mt-4"
                size="sm"
              >
                Manage Tokens
              </Button>
            </SystemWindow>

            <SystemWindow title="PLACED TOKENS" variant="quest">
              <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                {visibleTokens.map((token) => (
                  <div
                    key={token.id}
                    className="p-2 rounded border border-border bg-muted/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {token.imageUrl ? (
                        <OptimizedImage
                          src={token.imageUrl}
                          alt={token.name}
                          className="w-6 h-6 rounded-full object-cover border border-border"
                          size="thumbnail"
                        />
                      ) : (
                        <span>{token.emoji || '@'}</span>
                      )}
                      <span className="truncate">{token.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleRotateToken(token.id)}
                        className="p-1 hover:bg-muted rounded"
                        title="Rotate"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteToken(token.id)}
                        className="p-1 hover:bg-muted rounded text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {visibleTokens.length === 0 && (
                  <p className="text-muted-foreground text-center py-2 text-xs">
                    No tokens on this layer. Select a token and click the map to place it.
                  </p>
                )}
              </div>
            </SystemWindow>
          </div>

          <div className="lg:col-span-3">
            <SystemWindow title="MAP CANVAS">
              <div
                ref={mapRef}
                onClick={handleMapClick}
                onMouseMove={handleTokenDrag}
                onMouseUp={handleTokenDragEnd}
                data-testid="vtt-map"
                className={cn(
                  'relative border-2 border-border rounded-lg bg-background overflow-auto',
                  selectedToken && 'cursor-crosshair',
                  'max-h-[600px]'
                )}
                style={{
                  width: '100%',
                  height: '600px',
                }}
              >
                <div
                  className="relative"
                  style={{
                    width: `${mapWidth * gridSize * zoom}px`,
                    height: `${mapHeight * gridSize * zoom}px`,
                  }}
                >
                  {/* Grid */}
                  {showGrid && (
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                          linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                        `,
                        backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
                      }}
                    />
                  )}

                  {/* Placed Tokens */}
                  {visibleTokens.map((token) => {
                    const size = SIZE_VALUES[token.size] * zoom;
                    return (
                      <div
                        key={token.id}
                        draggable={!token.locked}
                        onDragStart={(e) => handleTokenDragStart(token, e)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleRotateToken(token.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          'absolute cursor-move transition-all',
                          token.locked && 'cursor-not-allowed opacity-75',
                          draggedToken?.id === token.id && 'opacity-50'
                        )}
                        style={{
                          left: `${token.x * gridSize * zoom}px`,
                          top: `${token.y * gridSize * zoom}px`,
                          width: `${size}px`,
                          height: `${size}px`,
                          transform: `rotate(${token.rotation}deg)`,
                        }}
                      >
                        <div
                          className={cn(
                            'w-full h-full rounded-full flex items-center justify-center text-2xl border-2 transition-all hover:scale-110',
                            token.color ? `border-[${token.color}]` : 'border-border',
                            token.locked && 'ring-2 ring-amber-400'
                          )}
                          style={{
                            backgroundColor: token.color ? `${token.color}40` : undefined,
                            fontSize: `${size * 0.5}px`,
                          }}
                          title={`${token.name}${token.locked ? ' (Locked)' : ''}`}
                        >
                          {token.imageUrl ? (
                            <OptimizedImage
                              src={token.imageUrl}
                              alt={token.name}
                              className="w-full h-full object-cover rounded-full"
                              size="small"
                            />
                          ) : (
                            token.emoji || '@'
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div>
                  Click map to place selected token. Drag tokens to move. Right-click to rotate.
                </div>
                <Badge variant="outline">
                  Layer {currentLayer} • {visibleTokens.length} tokens
                </Badge>
              </div>
            </SystemWindow>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VTTMap;

