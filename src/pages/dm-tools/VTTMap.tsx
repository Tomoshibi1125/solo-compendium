import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download, Plus, Minus, RotateCw, Trash2, Lock, Unlock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DEFAULT_TOKENS, mergeBaseTokens, normalizeLibraryTokens, type LibraryToken } from '@/data/tokenLibraryDefaults';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useDebounce } from '@/hooks/useDebounce';
import { useUserToolState } from '@/hooks/useToolState';

interface PlacedToken {
  id: string;
  tokenId: string;
  name: string;
  tokenType?: LibraryToken['type'];
  emoji?: string;
  imageUrl?: string;
  color?: string;
  size: 'small' | 'medium' | 'large' | 'huge';
  x: number;
  y: number;
  rotation: number;
  layer: number;
  locked: boolean;
  render?: LibraryToken['render'];
}

type MapToken = Pick<
  LibraryToken,
  'id' | 'name' | 'emoji' | 'imageUrl' | 'color' | 'size' | 'category' | 'type' | 'render'
>;

type VTTMapState = {
  tokens: PlacedToken[];
  currentLayer: number;
  savedAt?: string;
};

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
  const mapHydratedRef = useRef(false);

  const { state: storedTokens, isLoading: tokensLoading, saveNow: saveTokenLibrary } = useUserToolState<LibraryToken[]>(
    'token_library',
    {
      initialState: DEFAULT_TOKENS,
      storageKey: 'vtt-tokens',
    }
  );
  const { state: storedMapState, isLoading: mapLoading, saveNow: saveMapNow } = useUserToolState<VTTMapState>('vtt_map', {
    initialState: { tokens: [], currentLayer: 0 },
    storageKey: 'vtt-map-state',
  });
  const mapSavePayload = useMemo(
    () => ({ tokens: placedTokens, currentLayer }),
    [currentLayer, placedTokens]
  );
  const debouncedMapState = useDebounce(mapSavePayload, 500);

  useEffect(() => {
    if (tokensLoading) return;
    const normalizedTokens = normalizeLibraryTokens(Array.isArray(storedTokens) ? storedTokens : []);
    const sourceTokens = normalizedTokens.length > 0 ? normalizedTokens : DEFAULT_TOKENS;
    const mergedTokens = mergeBaseTokens(sourceTokens);
    const mapped = mergedTokens.map((t) => ({
      id: t.id,
      name: t.name,
      emoji: t.emoji,
      imageUrl: t.imageUrl,
      color: t.color,
      size: t.size,
      category: t.category,
      type: t.type,
      render: t.render,
    }));
    setAvailableTokens(mapped);
    if (mergedTokens !== storedTokens) {
      void saveTokenLibrary(mergedTokens);
    }
  }, [saveTokenLibrary, storedTokens, tokensLoading]);

  useEffect(() => {
    if (mapLoading || mapHydratedRef.current) return;
    if (Array.isArray(storedMapState.tokens)) {
      setPlacedTokens(storedMapState.tokens);
    }
    if (typeof storedMapState.currentLayer === 'number') {
      setCurrentLayer(storedMapState.currentLayer);
    }
    mapHydratedRef.current = true;
  }, [mapLoading, storedMapState.currentLayer, storedMapState.tokens]);

  useEffect(() => {
    if (!mapHydratedRef.current) return;
    void saveMapNow({
      ...debouncedMapState,
      savedAt: new Date().toISOString(),
    });
  }, [debouncedMapState, saveMapNow]);

  const saveMapState = () => {
    const state = {
      tokens: placedTokens,
      currentLayer,
      savedAt: new Date().toISOString(),
    };
    void saveMapNow(state);
    toast({
      title: 'Saved!',
      description: 'Map state saved.',
    });
  };

  const placeTokenAt = (clientX: number, clientY: number) => {
    if (!mapRef.current || !selectedToken) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

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
          tokenType: token.type,
          render: token.render,
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

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    placeTokenAt(e.clientX, e.clientY);
  };

  const handleMapKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    placeTokenAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
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

  const handleTokenKeyDown = (token: PlacedToken, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRotateToken(token.id);
      return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      handleDeleteToken(token.id);
      return;
    }
    if (e.key.toLowerCase() === 'l') {
      e.preventDefault();
      handleToggleLock(token.id);
    }
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

  const visibleTokens = useMemo(
    () => placedTokens.filter((token) => token.layer === currentLayer),
    [currentLayer, placedTokens]
  );
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
            Back to Warden Tools
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
                  <p className="text-sm font-heading mb-2">Zoom</p>
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
                  <p className="text-sm font-heading mb-2">Layer</p>
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
                    const isOverlayPreview =
                      token.render?.mode === 'overlay' ||
                      token.type === 'effect' ||
                      token.type === 'prop' ||
                      (!!token.imageUrl &&
                        (token.imageUrl.includes('/generated/props/') ||
                          token.imageUrl.includes('/generated/effects/')));
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
                              'flex items-center justify-center text-lg border border-border overflow-hidden',
                              isOverlayPreview ? 'rounded-md bg-transparent' : 'rounded-full'
                            )}
                            style={{
                              width: `${Math.min(size / 2, 32)}px`,
                              height: `${Math.min(size / 2, 32)}px`,
                              borderColor: token.color ?? undefined,
                              backgroundColor: isOverlayPreview ? 'transparent' : token.color ? `${token.color}20` : undefined,
                            }}
                          >
                            {token.imageUrl ? (
                              <OptimizedImage
                                src={token.imageUrl}
                                alt={token.name}
                                className={cn(
                                  'w-full h-full',
                                  isOverlayPreview ? 'object-contain' : 'object-cover rounded-full'
                                )}
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
                {visibleTokens.map((token) => {
                  const isOverlayPreview =
                    token.render?.mode === 'overlay' ||
                    token.tokenType === 'effect' ||
                    token.tokenType === 'prop' ||
                    (!!token.imageUrl &&
                      (token.imageUrl.includes('/generated/props/') ||
                        token.imageUrl.includes('/generated/effects/')));
                  return (
                    <div
                      key={token.id}
                      className="p-2 rounded border border-border bg-muted/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {token.imageUrl ? (
                          <OptimizedImage
                            src={token.imageUrl}
                            alt={token.name}
                            className={cn(
                              'w-6 h-6 border border-border',
                              isOverlayPreview ? 'rounded-md object-contain' : 'rounded-full object-cover'
                            )}
                            size="thumbnail"
                          />
                        ) : (
                          <span>{token.emoji || '@'}</span>
                        )}
                        <span className="truncate">{token.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleLock(token.id)}
                          className="p-1 hover:bg-muted rounded"
                          title={token.locked ? 'Unlock' : 'Lock'}
                          aria-label={token.locked ? 'Unlock token' : 'Lock token'}
                        >
                          {token.locked ? (
                            <Unlock className="w-3 h-3" />
                          ) : (
                            <Lock className="w-3 h-3" />
                          )}
                        </button>
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
                  );
                })}
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
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              <div
                ref={mapRef}
                onClick={handleMapClick}
                onMouseMove={handleTokenDrag}
                onMouseUp={handleTokenDragEnd}
                onKeyDown={handleMapKeyDown}
                role="application"
                tabIndex={0}
                aria-label="Map canvas. Click to place a selected token or press Enter to place at center."
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
                    const isOverlayToken =
                      token.render?.mode === 'overlay' ||
                      token.tokenType === 'effect' ||
                      token.tokenType === 'prop' ||
                      (!!token.imageUrl &&
                        (token.imageUrl.includes('/generated/props/') || token.imageUrl.includes('/generated/effects/')));
                    const imageStyle = isOverlayToken
                      ? {
                          mixBlendMode: token.render?.blendMode ?? 'normal',
                          opacity: token.render?.opacity ?? 1,
                        }
                      : undefined;
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
                        onKeyDown={(e) => handleTokenKeyDown(token, e)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Token ${token.name}. Enter rotates, Delete removes, L toggles lock.`}
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
                            'w-full h-full flex items-center justify-center text-2xl border-2 border-border transition-all hover:scale-110',
                            isOverlayToken ? 'border-transparent bg-transparent' : 'rounded-full',
                            isOverlayToken ? 'hover:scale-100' : '',
                            token.locked && 'ring-2 ring-amber-400'
                          )}
                          style={{
                            backgroundColor: isOverlayToken ? 'transparent' : token.color ? `${token.color}40` : undefined,
                            borderColor: isOverlayToken ? 'transparent' : token.color ?? undefined,
                            fontSize: `${size * 0.5}px`,
                          }}
                          title={`${token.name}${token.locked ? ' (Locked)' : ''}`}
                        >
                          {token.imageUrl ? (
                            <OptimizedImage
                              src={token.imageUrl}
                              alt={token.name}
                              className={cn(
                                'w-full h-full',
                                isOverlayToken ? 'object-contain' : 'object-cover rounded-full'
                              )}
                              size="small"
                              style={imageStyle}
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
                  Layer {currentLayer} | {visibleTokens.length} tokens
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


