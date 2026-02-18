import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Grid3X3 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealtimeCollaboration, ActiveUsersList } from '@/hooks/useRealtimeCollaboration';
import { cn } from '@/lib/utils';

interface MapToken {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  size: 'small' | 'medium' | 'large' | 'huge';
  x: number;
  y: number;
  layer: number;
}

interface MapState {
  tokens: MapToken[];
  gridSize: number;
  backgroundUrl?: string;
}

const SIZE_VALUES = {
  small: 32,
  medium: 48,
  large: 64,
  huge: 96,
};

const PlayerMapView = ({ campaignId, sessionId }: { campaignId?: string; sessionId?: string } = {}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const effectiveCampaignId = (campaignId || searchParams.get('campaign') || '') as string;
  const effectiveSessionId = (sessionId || searchParams.get('sessionId') || '') as string;
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [mapState, setMapState] = useState<MapState>({
    tokens: [],
    gridSize: 50,
  });

  const {
    isConnected,
    activeUsers,
    broadcastMapUpdate,
  } = useRealtimeCollaboration(effectiveCampaignId);

<<<<<<< Updated upstream
=======
  // Subscribe to vtt_fog_state via Supabase realtime for authoritative fog data
  useEffect(() => {
    if (!effectiveCampaignId || !isSupabaseConfigured) return;

    // Initial fetch
    let query = (supabase as any)
      .from('vtt_fog_state')
      .select('*')
      .eq('campaign_id', effectiveCampaignId);

    if (effectiveSessionId) {
      query = query.eq('session_id', effectiveSessionId);
    }

    query
      .order('updated_at', { ascending: false })
      .limit(1)
      .then(({ data }: { data: any[] | null }) => {
        if (data && data.length > 0) {
          const row = data[0];
          setMapState((prev) => ({
            ...prev,
            fogData: row.fog_data || undefined,
            tokens: (row.tokens as MapToken[]) || prev.tokens,
            gridSize: row.grid_size || prev.gridSize,
            backgroundUrl: row.background_url || prev.backgroundUrl,
          }));
        }
      })
      .catch((err: unknown) => logger.warn('[PlayerMap] Initial fog fetch failed:', err));

    // Realtime subscription
    const channel = supabase
      .channel(`vtt-fog-${effectiveCampaignId}-${effectiveSessionId || 'campaign'}`)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'vtt_fog_state',
          filter: effectiveSessionId
            ? `campaign_id=eq.${effectiveCampaignId},session_id=eq.${effectiveSessionId}`
            : `campaign_id=eq.${effectiveCampaignId}`,
        },
        (payload: any) => {
          const row = payload.new;
          if (row) {
            setMapState((prev) => ({
              ...prev,
              fogData: row.fog_data || undefined,
              tokens: (row.tokens as MapToken[]) || prev.tokens,
              gridSize: row.grid_size || prev.gridSize,
              backgroundUrl: row.background_url || prev.backgroundUrl,
            }));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [effectiveCampaignId, effectiveSessionId]);

>>>>>>> Stashed changes
  // Listen for map update events from DM
  useEffect(() => {
    const handleMapUpdate = (event: CustomEvent) => {
      const detail = event.detail;
      if (detail?.data?.mapState) {
        setMapState(detail.data.mapState as MapState);
      }
      if (detail?.data?.tokens) {
        setMapState((prev) => ({
          ...prev,
          tokens: detail.data.tokens as MapToken[],
        }));
      }
    };

    window.addEventListener(
      'collaboration:map_update',
      handleMapUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        'collaboration:map_update',
        handleMapUpdate as EventListener
      );
    };
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.25));

  // Imperatively set zoom transform to avoid inline style= attribute
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.transform = `scale(${zoom})`;
    }
  }, [zoom]);

  // Ref callback for token elements — sets position/size imperatively
  const tokenRefCallback = useCallback(
    (el: HTMLDivElement | null, token: MapToken) => {
      if (!el) return;
      const size = SIZE_VALUES[token.size] || 48;
      el.style.left = `${token.x}px`;
      el.style.top = `${token.y}px`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.backgroundColor = token.color || '';
    },
    [],
  );

  // Player can drag their own token (if one is designated)
  const handleTokenDrag = (
    tokenId: string,
    newX: number,
    newY: number
  ) => {
    setMapState((prev) => ({
      ...prev,
      tokens: prev.tokens.map((t) =>
        t.id === tokenId ? { ...t, x: newX, y: newY } : t
      ),
    }));

    // Broadcast the position update back to the DM
    broadcastMapUpdate({
      type: 'token_move',
      tokenId,
      x: newX,
      y: newY,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate('/player-tools')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Player Tools
          </Button>

          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            {!campaignId && (
              <Badge variant="secondary">No campaign selected</Badge>
            )}
          </div>
        </div>

        {!campaignId ? (
          <SystemWindow title="NO CAMPAIGN" variant="alert">
            <p className="text-sm text-muted-foreground">
              Open this page from a campaign to view the shared map. Add{' '}
              <code>?campaign=YOUR_CAMPAIGN_ID</code> to the URL.
            </p>
          </SystemWindow>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Map Canvas */}
            <div className="lg:col-span-3">
              <SystemWindow title="BATTLE MAP" className="overflow-hidden">
                {/* Controls */}
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomIn}
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomOut}
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={showGrid ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setShowGrid((prev) => !prev)}
                    aria-label="Toggle grid"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground ml-2">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Map Area */}
                <div
                  ref={mapRef}
                  className="relative overflow-auto border rounded-lg bg-muted/20 h-[60vh]"
                >
                  <div
                    ref={canvasRef}
                    className="relative origin-top-left w-[1000px] h-[800px]"
                  >
                    {/* Grid */}
                    {showGrid && (
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <pattern
                            id="player-grid"
                            width={mapState.gridSize}
                            height={mapState.gridSize}
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d={`M ${mapState.gridSize} 0 L 0 0 0 ${mapState.gridSize}`}
                              fill="none"
                              stroke="currentColor"
                              strokeOpacity="0.15"
                              strokeWidth="1"
                            />
                          </pattern>
                        </defs>
                        <rect
                          width="100%"
                          height="100%"
                          fill="url(#player-grid)"
                        />
                      </svg>
                    )}

                    {/* Tokens */}
                    {mapState.tokens.map((token) => {
                      const size = SIZE_VALUES[token.size] || 48;
                      return (
                        <div
                          key={token.id}
                          ref={(el) => tokenRefCallback(el, token)}
                          className={cn(
                            'absolute rounded-full border-2 flex items-center justify-center text-xs font-bold cursor-default select-none',
                            'border-primary/50 bg-primary/20'
                          )}
                          title={token.name}
                        >
                          {token.emoji || token.name.charAt(0).toUpperCase()}
                        </div>
                      );
                    })}

                    {mapState.tokens.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <p className="text-sm">
                          Waiting for DM to set up the map...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </SystemWindow>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <SystemWindow title="ACTIVE USERS" compact>
                {activeUsers.length > 0 ? (
                  <ActiveUsersList activeUsers={activeUsers} />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {isConnected
                      ? 'No other users connected'
                      : 'Not connected to campaign'}
                  </p>
                )}
              </SystemWindow>

              <SystemWindow title="MAP INFO" compact>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tokens</span>
                    <span>{mapState.tokens.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grid Size</span>
                    <span>{mapState.gridSize}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zoom</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                </div>
              </SystemWindow>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlayerMapView;
