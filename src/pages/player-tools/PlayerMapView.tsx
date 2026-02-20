import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Crosshair, Send, Dice1 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import { useVTTRealtime } from '@/hooks/useVTTRealtime';
import { useCampaignToolState } from '@/hooks/useToolState';
import { useCampaignMembers } from '@/hooks/useCampaigns';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { VTTCharacterPanel } from '@/components/vtt/VTTCharacterPanel';
import { VTTAssetBrowser } from '@/components/vtt/VTTAssetBrowser';
import { cn } from '@/lib/utils';
import type { LibraryToken } from '@/data/tokenLibraryDefaults';

interface PlacedToken {
  id: string;
  characterId?: string;
  tokenType?: LibraryToken['type'];
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
  render?: LibraryToken['render'];
  hp?: number;
  maxHp?: number;
  ac?: number;
  initiative?: number;
  conditions?: string[];
  visible: boolean;
  ownerId?: string;
  auraRadius?: number;
  auraColor?: string;
  lightRadius?: number;
  lightDimRadius?: number;
  showNameplate?: boolean;
  barVisibility?: 'always' | 'owner' | 'gm';
}

interface Scene {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundImage?: string;
  backgroundScale?: number;
  backgroundOffsetX?: number;
  backgroundOffsetY?: number;
  gridSize?: number;
  tokens: PlacedToken[];
  fogOfWar: boolean;
  fogData?: boolean[][];
}

type VTTScenesState = {
  scenes: Scene[];
  currentSceneId: string | null;
};

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
  const { user } = useAuth();

  // Query campaign members to find player's character even without token
  const { data: members } = useCampaignMembers(effectiveCampaignId);
  const myCharacterId = useMemo(() => {
    if (!user?.id || !members) return null;
    const myMember = members.find((m: any) => m.user_id === user.id);
    if (!myMember) return null;
    const chars = (myMember as any).characters;
    if (chars && typeof chars === 'object' && 'id' in chars) return (chars as any).id as string;
    // Also check character_id directly on the member
    if ((myMember as any).character_id) return (myMember as any).character_id as string;
    return null;
  }, [members, user?.id]);

  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [draggedTokenId, setDraggedTokenId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<string | null>(null);
  const touchRef = useRef<{ startDist: number; startZoom: number } | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scene state received from DM
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);

  // Realtime connection
  const vttRealtime = useVTTRealtime({
    campaignId: effectiveCampaignId,
    sessionId: effectiveSessionId || undefined,
    isDM: false,
  });

  // Subscribe to campaign_tool_states for scene data from DM
  const toolKey = effectiveSessionId ? `vtt_scenes:${effectiveSessionId}` : 'vtt_scenes';
  const legacyStorageKey = effectiveCampaignId
    ? `vtt-scenes-${effectiveCampaignId}${effectiveSessionId ? `-${effectiveSessionId}` : ''}`
    : 'vtt-scenes';
  const { state: storedState, isLoading } = useCampaignToolState<VTTScenesState>(
    effectiveCampaignId || null,
    toolKey,
    {
      initialState: { scenes: [], currentSceneId: null },
      storageKey: legacyStorageKey,
    }
  );

  // Hydrate scene from stored state
  useEffect(() => {
    if (isLoading) return;
    const scenes = Array.isArray(storedState.scenes) ? storedState.scenes : [];
    if (scenes.length > 0) {
      const selected = scenes.find((s) => s.id === storedState.currentSceneId) || scenes[0];
      setCurrentScene(selected);
    }
  }, [isLoading, storedState.currentSceneId, storedState.scenes]);

  // Also subscribe to realtime postgres changes for campaign_tool_states
  useEffect(() => {
    if (!effectiveCampaignId || !isSupabaseConfigured) return;

    const channel = supabase
      .channel(`player-vtt-scenes-${effectiveCampaignId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaign_tool_states',
          filter: `campaign_id=eq.${effectiveCampaignId}`,
        },
        (payload) => {
          const row = payload.new as { tool_key?: string; state?: VTTScenesState; updated_by?: string | null } | null;
          if (!row || row.tool_key !== toolKey || !row.state) return;
          if (row.updated_by && row.updated_by === user?.id) return;
          const incoming = row.state;
          if (!Array.isArray(incoming.scenes)) return;
          const selected = incoming.scenes.find((s: Scene) => s.id === incoming.currentSceneId) || incoming.scenes[0] || null;
          setCurrentScene(selected);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [effectiveCampaignId, toolKey, user?.id]);

  // Listen for realtime broadcasts from DM
  useEffect(() => {
    if (!effectiveCampaignId) return;

    const unsub1 = vttRealtime.on('token_move', (payload) => {
      if (payload.movedBy === vttRealtime.userId) return;
      setCurrentScene((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tokens: prev.tokens.map((t) =>
            t.id === payload.tokenId ? { ...t, x: payload.x, y: payload.y } : t
          ),
        };
      });
    });

    const unsub2 = vttRealtime.on('token_update', (payload) => {
      if (payload.updatedBy === vttRealtime.userId) return;
      setCurrentScene((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tokens: prev.tokens.map((t) =>
            t.id === payload.tokenId ? { ...t, ...(payload.updates as Partial<PlacedToken>) } : t
          ),
        };
      });
    });

    const unsub3 = vttRealtime.on('token_add', (payload) => {
      setCurrentScene((prev) => {
        if (!prev) return prev;
        const newToken = payload.token as unknown as PlacedToken;
        if (prev.tokens.some((t) => t.id === newToken.id)) return prev;
        return { ...prev, tokens: [...prev.tokens, newToken] };
      });
    });

    const unsub4 = vttRealtime.on('token_remove', (payload) => {
      setCurrentScene((prev) => {
        if (!prev) return prev;
        return { ...prev, tokens: prev.tokens.filter((t) => t.id !== payload.tokenId) };
      });
    });

    const unsub5 = vttRealtime.on('scene_sync', (payload) => {
      if (payload.syncedBy === vttRealtime.userId) return;
      const incoming = payload.scenes as Scene[];
      const selected = incoming.find((s) => s.id === payload.currentSceneId) || incoming[0] || null;
      setCurrentScene(selected);
    });

    const unsub6 = vttRealtime.on('scene_change', (payload) => {
      if (payload.changedBy === vttRealtime.userId) return;
      // Scene change handled by campaign_tool_states subscription
    });

    return () => { unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); unsub6(); };
  }, [effectiveCampaignId, vttRealtime]);

  const gridSize = currentScene?.gridSize ?? 50;

  // Visible tokens (player only sees visible tokens, not DM layer)
  const visibleTokens = useMemo(() => {
    if (!currentScene?.tokens) return [];
    return currentScene.tokens.filter((t) => t.visible && t.layer !== 3);
  }, [currentScene?.tokens]);

  // Check if user owns a token
  const isOwnToken = useCallback(
    (token: PlacedToken) => {
      if (!user?.id) return false;
      return token.ownerId === user.id || token.characterId === user.id;
    },
    [user?.id],
  );

  // Initiative order
  const tokensInInitiative = useMemo(
    () =>
      [...visibleTokens]
        .filter((t) => t.initiative !== undefined && t.initiative !== null)
        .sort((a, b) => (b.initiative || 0) - (a.initiative || 0)),
    [visibleTokens],
  );

  // Grid position from mouse event
  const getGridPosition = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mapRef.current) return null;
      const rect = mapRef.current.getBoundingClientRect();
      const scrollLeft = mapRef.current.scrollLeft;
      const scrollTop = mapRef.current.scrollTop;
      const x = e.clientX - rect.left + scrollLeft;
      const y = e.clientY - rect.top + scrollTop;
      const gx = Math.floor(x / (gridSize * zoom));
      const gy = Math.floor(y / (gridSize * zoom));
      return { gx, gy };
    },
    [gridSize, zoom],
  );

  // Double-click to ping
  const handleMapDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const pos = getGridPosition(e);
      if (pos) {
        vttRealtime.sendPing(pos.gx, pos.gy);
      }
    },
    [getGridPosition, vttRealtime],
  );

  // Token drag handlers — players can drag tokens they own
  const handleTokenMouseDown = useCallback(
    (token: PlacedToken, e: React.MouseEvent) => {
      if (token.locked || !isOwnToken(token)) return;
      e.stopPropagation();
      setDraggedTokenId(token.id);
    },
    [isOwnToken],
  );

  const handleMapMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!draggedTokenId) return;
      const pos = getGridPosition(e);
      if (!pos) return;
      setCurrentScene((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tokens: prev.tokens.map((t) =>
            t.id === draggedTokenId ? { ...t, x: pos.gx, y: pos.gy } : t
          ),
        };
      });
    },
    [draggedTokenId, getGridPosition],
  );

  const handleMapMouseUp = useCallback(() => {
    if (!draggedTokenId) return;
    const token = currentScene?.tokens.find((t) => t.id === draggedTokenId);
    if (token) {
      vttRealtime.broadcastTokenMove(draggedTokenId, token.x, token.y);
    }
    setDraggedTokenId(null);
  }, [currentScene?.tokens, draggedTokenId, vttRealtime]);

  // Broadcast cursor position on mouse move (throttled)
  const lastCursorBroadcast = useRef(0);
  const handleCursorMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const now = Date.now();
      if (now - lastCursorBroadcast.current < 100) return; // throttle 100ms
      lastCursorBroadcast.current = now;
      const pos = getGridPosition(e);
      if (pos) {
        vttRealtime.updateCursor({ x: pos.gx, y: pos.gy });
      }
    },
    [getGridPosition, vttRealtime],
  );

  const sceneWidth = currentScene?.width ?? 20;
  const sceneHeight = currentScene?.height ?? 20;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 max-w-[1920px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <Button variant="ghost" onClick={() => navigate('/player-tools')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Player Tools
            </Button>
            <h1 className="font-arise text-2xl font-bold gradient-text-shadow mt-1">
              BATTLE MAP {currentScene ? `— ${currentScene.name}` : ''}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={vttRealtime.isConnected ? 'default' : 'destructive'}>
              {vttRealtime.isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            {vttRealtime.activeUsers.length > 0 && (
              <div className="flex -space-x-1.5">
                {vttRealtime.activeUsers.slice(0, 5).map((u) => (
                  <div
                    key={u.userId}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-background"
                    style={{ backgroundColor: u.color }}
                    title={`${u.userName} (${u.role})`}
                  >
                    {u.userName.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!effectiveCampaignId ? (
          <SystemWindow title="NO CAMPAIGN" variant="alert">
            <p className="text-sm text-muted-foreground">
              Open this page from a campaign to view the shared map.
            </p>
          </SystemWindow>
        ) : (
          <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-4", !isMobile && "md:h-[calc(100vh-180px)]")}>
            {/* Main Map Area */}
            <div className="col-span-1 md:col-span-9">
              <SystemWindow title="MAP" className={cn("min-h-[60vh]", isMobile && "h-screen")} contentClassName="flex-1 flex flex-col">
                {/* Controls */}
                <div className="flex items-center gap-2 mb-2">
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
                    <Plus className="w-3 h-3" />
                  </Button>
                  {!isMobile && (
                    <div className="flex items-center gap-1 ml-2">
                      <input
                        type="checkbox"
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                        className="w-3 h-3"
                        id="playerGrid"
                      />
                      <label htmlFor="playerGrid" className="text-xs cursor-pointer">Grid</label>
                    </div>
                  )}
                  {!isMobile && (
                    <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                      <Crosshair className="w-3 h-3" />
                      Double-click to ping
                    </div>
                  )}
                </div>

                {/* Map Canvas */}
                <div
                  ref={mapRef}
                  className="flex-1 relative border-2 border-border rounded-lg bg-background overflow-auto"
                  onMouseMove={(e) => { handleMapMouseMove(e); handleCursorMove(e); }}
                  onMouseUp={handleMapMouseUp}
                  onMouseLeave={handleMapMouseUp}
                  onDoubleClick={handleMapDoubleClick}
                >
                  <div
                    className="relative"
                    style={{
                      width: `${sceneWidth * gridSize * zoom}px`,
                      height: `${sceneHeight * gridSize * zoom}px`,
                    }}
                  >
                    {/* Background image */}
                    {currentScene?.backgroundImage && (
                      <div className="absolute inset-0">
                        <OptimizedImage
                          src={currentScene.backgroundImage}
                          alt="Map background"
                          className="w-full h-full object-cover"
                          size="large"
                          style={{
                            opacity: 0.95,
                            transform: `scale(${currentScene.backgroundScale ?? 1})`,
                            transformOrigin: 'top left',
                          }}
                        />
                      </div>
                    )}

                    {/* Grid overlay */}
                    {showGrid && (
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                          backgroundImage: `
                            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                          `,
                          backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
                        }}
                      />
                    )}

                    {/* Fog of war */}
                    {currentScene?.fogOfWar && currentScene.fogData && (
                      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50 }}>
                        {currentScene.fogData.map((row, ry) =>
                          row.map((revealed, rx) =>
                            !revealed ? (
                              <div
                                key={`fog-${rx}-${ry}`}
                                className="absolute"
                                style={{
                                  left: `${rx * gridSize * zoom}px`,
                                  top: `${ry * gridSize * zoom}px`,
                                  width: `${gridSize * zoom}px`,
                                  height: `${gridSize * zoom}px`,
                                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                }}
                              />
                            ) : null,
                          ),
                        )}
                      </div>
                    )}

                    {/* Token Auras */}
                    {visibleTokens.filter((t) => t.auraRadius && t.auraRadius > 0).map((token) => {
                      const auraSize = (token.auraRadius! * 2 + 1) * gridSize * zoom;
                      const tokenSize = SIZE_VALUES[token.size] * zoom;
                      const centerOffset = tokenSize / 2 - auraSize / 2;
                      return (
                        <div
                          key={`aura-${token.id}`}
                          className="absolute rounded-full pointer-events-none animate-pulse"
                          style={{
                            left: `${token.x * gridSize * zoom + centerOffset}px`,
                            top: `${token.y * gridSize * zoom + centerOffset}px`,
                            width: `${auraSize}px`,
                            height: `${auraSize}px`,
                            backgroundColor: `${token.auraColor || '#3b82f6'}18`,
                            border: `2px solid ${token.auraColor || '#3b82f6'}40`,
                            zIndex: token.layer * 10 + 5,
                          }}
                        />
                      );
                    })}

                    {/* Tokens */}
                    {visibleTokens.map((token) => {
                      const size = SIZE_VALUES[token.size] * zoom;
                      const canDrag = isOwnToken(token) && !token.locked;
                      const hpPercent = token.maxHp && token.maxHp > 0 ? ((token.hp ?? 0) / token.maxHp) * 100 : null;
                      const isOverlay = token.tokenType === 'effect' || token.tokenType === 'prop';
                      return (
                        <div
                          key={token.id}
                          className={cn(
                            'absolute transition-all',
                            canDrag ? 'cursor-move' : 'cursor-default',
                            draggedTokenId === token.id && 'opacity-70',
                          )}
                          style={{
                            left: `${token.x * gridSize * zoom}px`,
                            top: `${token.y * gridSize * zoom}px`,
                            width: `${size}px`,
                            height: `${size}px`,
                            transform: `rotate(${token.rotation}deg)`,
                            zIndex: token.layer * 10 + 10,
                          }}
                          onMouseDown={(e) => handleTokenMouseDown(token, e)}
                          title={`${token.name}${token.hp !== undefined ? ` (${token.hp}/${token.maxHp} HP)` : ''}${canDrag ? ' — drag to move' : ''}`}
                        >
                          <div
                            className={cn(
                              'w-full h-full flex items-center justify-center border-2 text-xs font-bold',
                              isOverlay ? 'border-transparent bg-transparent' : 'rounded-full',
                            )}
                            style={{
                              backgroundColor: isOverlay ? 'transparent' : token.color ? `${token.color}40` : 'rgba(0,0,0,0.3)',
                              borderColor: isOverlay ? 'transparent' : token.color || 'hsl(var(--primary))',
                              fontSize: `${size * 0.35}px`,
                            }}
                          >
                            {token.imageUrl ? (
                              <OptimizedImage
                                src={token.imageUrl}
                                alt={token.name}
                                className={cn('w-full h-full', isOverlay ? 'object-contain' : 'object-cover rounded-full')}
                                size="small"
                              />
                            ) : (
                              token.emoji || token.name.charAt(0).toUpperCase()
                            )}
                          </div>

                          {/* HP bar */}
                          {hpPercent !== null && !isOverlay && (
                            <div className="absolute -bottom-1.5 left-0 right-0 h-1.5 rounded-full bg-black/40 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${Math.max(0, Math.min(100, hpPercent))}%`,
                                  backgroundColor: hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444',
                                }}
                              />
                            </div>
                          )}

                          {/* Conditions */}
                          {token.conditions && token.conditions.length > 0 && (
                            <div className="absolute -top-2 -right-2 flex gap-0.5">
                              {token.conditions.slice(0, 3).map((cond) => (
                                <span
                                  key={cond}
                                  className="bg-amber-500 text-black text-[8px] px-1 rounded-full font-bold"
                                  title={cond}
                                >
                                  {cond.charAt(0).toUpperCase()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Pings overlay */}
                    {vttRealtime.pings.length > 0 && (
                      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 70 }}>
                        {vttRealtime.pings.map((ping) => (
                          <div
                            key={ping.timestamp}
                            className="absolute animate-ping"
                            style={{
                              left: `${(ping.x + 0.5) * gridSize * zoom}px`,
                              top: `${(ping.y + 0.5) * gridSize * zoom}px`,
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: `3px solid ${ping.color}`,
                              transform: 'translate(-50%, -50%)',
                              boxShadow: `0 0 12px ${ping.color}`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Remote cursors */}
                    {vttRealtime.activeUsers.filter((u) => u.cursor).length > 0 && (
                      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 65 }}>
                        {vttRealtime.activeUsers
                          .filter((u) => u.cursor)
                          .map((u) => (
                            <div
                              key={u.userId}
                              className="absolute transition-all duration-100"
                              style={{
                                left: `${(u.cursor!.x + 0.5) * gridSize * zoom}px`,
                                top: `${(u.cursor!.y + 0.5) * gridSize * zoom}px`,
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              <div
                                className="w-3 h-3 rounded-full border-2 border-white"
                                style={{ backgroundColor: u.color }}
                              />
                              <div
                                className="absolute top-4 left-0 text-[10px] px-1 rounded text-white whitespace-nowrap"
                                style={{ backgroundColor: u.color }}
                              >
                                {u.userName}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Empty state */}
                    {visibleTokens.length === 0 && !currentScene?.backgroundImage && (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <p className="text-sm">Waiting for DM to set up the map...</p>
                      </div>
                    )}
                  </div>
                </div>
              </SystemWindow>
            </div>

            {/* Right Sidebar — hidden on mobile, shown via bottom sheet */}
            <div className={cn("col-span-1 md:col-span-3 space-y-4 md:overflow-y-auto", isMobile && "hidden")}>
              <Tabs defaultValue="sheet" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="sheet">Sheet</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="dice">Dice</TabsTrigger>
                  <TabsTrigger value="init">Init</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                </TabsList>

                <TabsContent value="sheet" className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
                  {(() => {
                    // Auto-detect: first from owned token, then from campaign membership
                    const ownToken = visibleTokens.find((t) => isOwnToken(t) && t.characterId);
                    const charId = ownToken?.characterId || myCharacterId;
                    if (charId) {
                      return (
                        <VTTCharacterPanel
                          characterId={charId}
                          onRoll={(formula) => vttRealtime.rollAndBroadcast(formula)}
                          onChat={(msg, type) => vttRealtime.sendChatMessage(msg, type)}
                        />
                      );
                    }
                    return (
                      <SystemWindow title="CHARACTER" compact>
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No character linked. Join the campaign with a character to see your sheet here.
                        </p>
                      </SystemWindow>
                    );
                  })()}
                </TabsContent>

                <TabsContent value="chat" className="space-y-2">
                  <SystemWindow title="CHAT" className="flex flex-col h-[400px]">
                    <div className="flex-1 overflow-y-auto space-y-2 mb-2">
                      {vttRealtime.chatMessages.map((msg) => (
                        <div key={msg.id} className="text-xs">
                          {msg.type === 'emote' ? (
                            <div className="p-1.5 rounded border-l-2 border-amber-500 bg-amber-500/10 italic text-amber-200">
                              * {msg.userName} {msg.message}
                            </div>
                          ) : msg.type === 'desc' ? (
                            <div className="p-1.5 rounded border border-slate-600 bg-slate-800/60 text-center font-heading text-slate-200">
                              {msg.message}
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-1 mb-0.5">
                                <span className="font-semibold text-foreground">{msg.userName}</span>
                                {msg.type === 'whisper' && <Badge variant="outline" className="text-[9px] px-1 py-0 border-teal-500/50 text-teal-400">whisper</Badge>}
                                {msg.type === 'gmroll' && <Badge variant="outline" className="text-[9px] px-1 py-0 border-amber-500/50 text-amber-400">GM</Badge>}
                                <span className="text-muted-foreground text-[10px]">
                                  {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className={cn(
                                'p-1.5 rounded',
                                msg.type === 'chat' && 'border border-border bg-muted/20',
                                msg.type === 'system' && 'border-l-2 border-slate-500 bg-slate-800/40 text-slate-300',
                                msg.type === 'dice' && 'border border-cyan-500/40 bg-cyan-950/30 text-cyan-100',
                                msg.type === 'gmroll' && 'border border-amber-500/40 bg-amber-950/30 text-amber-100',
                                msg.type === 'whisper' && 'border border-teal-500/30 bg-teal-950/30 italic text-teal-200',
                              )}>
                                {msg.diceDisplayText ? (
                                  <span dangerouslySetInnerHTML={{ __html: msg.diceDisplayText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/~~(.+?)~~/g, '<del class="opacity-40">$1</del>') }} />
                                ) : (
                                  msg.message
                                )}
                                {msg.diceCritical && <span className="ml-1 text-green-400 font-bold">CRITICAL!</span>}
                                {msg.diceFumble && <span className="ml-1 text-red-400 font-bold">FUMBLE!</span>}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-[9px] text-muted-foreground mb-1 px-1">
                      /roll /w &quot;name&quot; /em /desc &bull; adv dis 4d6kh3
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newMessage.trim()) {
                            vttRealtime.processChat(newMessage);
                            setNewMessage('');
                          }
                        }}
                        placeholder="Type message or /roll 1d20+5..."
                        className="text-xs h-8"
                      />
                      <Button
                        onClick={() => {
                          if (newMessage.trim()) {
                            vttRealtime.processChat(newMessage);
                            setNewMessage('');
                          }
                        }}
                        size="sm"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  </SystemWindow>
                </TabsContent>

                <TabsContent value="dice" className="space-y-2">
                  <SystemWindow title="DICE ROLLER">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {['1d20', '1d12', '2d6', '1d100', '1d8', '1d4'].map((formula) => (
                          <Button
                            key={formula}
                            onClick={() => vttRealtime.rollAndBroadcast(formula)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Dice1 className="w-3 h-3 mr-1" />
                            {formula}
                          </Button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="1d20+5"
                          className="text-xs h-8"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.target as HTMLInputElement;
                              if (input.value.trim()) {
                                vttRealtime.rollAndBroadcast(input.value.trim());
                                input.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {vttRealtime.chatMessages
                          .filter((m) => m.type === 'dice')
                          .slice(-8)
                          .map((roll) => (
                            <div key={roll.id} className="text-xs p-1.5 rounded border bg-muted/30 flex justify-between">
                              <span className="truncate">{roll.userName}: {roll.diceFormula}</span>
                              <span className={cn('font-bold ml-2', roll.diceCritical && 'text-green-400')}>
                                {roll.diceResult}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </SystemWindow>
                </TabsContent>

                <TabsContent value="init" className="space-y-2">
                  <SystemWindow title="INITIATIVE">
                    <div className="space-y-2">
                      {tokensInInitiative.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No tokens in initiative order yet.
                        </p>
                      ) : (
                        tokensInInitiative.map((token, index) => {
                          const hpPercent = token.maxHp && token.maxHp > 0 ? ((token.hp ?? 0) / token.maxHp) * 100 : null;
                          return (
                            <div
                              key={token.id}
                              className={cn(
                                'p-2 rounded border flex items-center gap-2',
                                index === 0 && 'bg-primary/20 border-primary',
                              )}
                            >
                              <span className="font-arise text-lg w-6 text-center">{index + 1}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold truncate">{token.name}</div>
                                {hpPercent !== null && (
                                  <div className="h-1 rounded-full bg-black/30 mt-0.5">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${Math.max(0, Math.min(100, hpPercent))}%`,
                                        backgroundColor: hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444',
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                              <span className="text-xs font-semibold">{token.initiative}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </SystemWindow>
                </TabsContent>

                <TabsContent value="assets" className="space-y-2">
                  <SystemWindow title="ASSET LIBRARY">
                    <VTTAssetBrowser
                      campaignId={campaignId}
                      readOnly={false}
                      onUseAsToken={(imageUrl, name) => {
                        vttRealtime.sendChatMessage(`wants to use "${name}" as their token`, 'system');
                      }}
                    />
                  </SystemWindow>
                </TabsContent>
              </Tabs>

              {/* Token list */}
              <SystemWindow title="TOKENS ON MAP" compact>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {visibleTokens.map((token) => (
                    <div key={token.id} className="flex items-center gap-2 text-xs p-1 rounded hover:bg-muted/30">
                      {token.imageUrl ? (
                        <OptimizedImage src={token.imageUrl} alt={token.name} className="w-5 h-5 rounded-full object-cover" size="thumbnail" />
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">
                          {token.emoji || token.name.charAt(0)}
                        </span>
                      )}
                      <span className="truncate flex-1">{token.name}</span>
                      {isOwnToken(token) && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0">You</Badge>
                      )}
                    </div>
                  ))}
                  {visibleTokens.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">No tokens yet.</p>
                  )}
                </div>
              </SystemWindow>
            </div>
          </div>
        )}

        {/* Mobile Player Toolbar + Bottom Sheet */}
        {isMobile && effectiveCampaignId && (
          <>
            <div className="vtt-mobile-toolbar">
              <button onClick={() => setZoom(Math.max(0.5, zoom - 0.15))}>−</button>
              <span className="text-[10px] text-muted-foreground min-w-[32px] text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(2, zoom + 0.15))}>+</button>
              <div className="w-px h-8 bg-border/30 mx-1" />
              <button className={cn(mobilePanel === 'chat' && 'active')} onClick={() => setMobilePanel(mobilePanel === 'chat' ? null : 'chat')}>Chat</button>
              <button className={cn(mobilePanel === 'dice' && 'active')} onClick={() => setMobilePanel(mobilePanel === 'dice' ? null : 'dice')}>Dice</button>
              <button className={cn(mobilePanel === 'init' && 'active')} onClick={() => setMobilePanel(mobilePanel === 'init' ? null : 'init')}>Init</button>
              <button className={cn(mobilePanel === 'sheet' && 'active')} onClick={() => setMobilePanel(mobilePanel === 'sheet' ? null : 'sheet')}>Sheet</button>
              <button className={cn(mobilePanel === 'assets' && 'active')} onClick={() => setMobilePanel(mobilePanel === 'assets' ? null : 'assets')}>Assets</button>
            </div>

            <div className={cn('vtt-bottom-sheet', mobilePanel && 'open')}>
              <div className="vtt-bottom-sheet-handle" />
              <div className="vtt-bottom-sheet-content">
                {mobilePanel === 'chat' && (
                  <div>
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto mb-2">
                      {vttRealtime.chatMessages.slice(-20).map((msg) => (
                        <div key={msg.id} className="text-xs p-1.5 rounded border border-border/40 bg-muted/10">
                          <span className="font-semibold">{msg.userName}: </span>
                          {msg.diceDisplayText ? (
                            <span dangerouslySetInnerHTML={{ __html: msg.diceDisplayText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/~~(.+?)~~/g, '<del class="opacity-40">$1</del>') }} />
                          ) : msg.message}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type..." className="h-9 text-sm" onKeyPress={(e) => { if (e.key === 'Enter' && newMessage.trim()) { vttRealtime.processChat(newMessage); setNewMessage(''); }}} />
                      <Button size="sm" className="h-9 px-3" onClick={() => { if (newMessage.trim()) { vttRealtime.processChat(newMessage); setNewMessage(''); }}}>Send</Button>
                    </div>
                  </div>
                )}
                {mobilePanel === 'dice' && (
                  <div className="grid grid-cols-4 gap-2">
                    {['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '2d6', '1d100'].map((formula) => (
                      <Button key={formula} variant="outline" size="sm" className="text-xs h-10" onClick={() => vttRealtime.rollAndBroadcast(formula)}>
                        {formula}
                      </Button>
                    ))}
                  </div>
                )}
                {mobilePanel === 'init' && (
                  <div className="space-y-1 max-h-[40vh] overflow-y-auto">
                    {tokensInInitiative.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No initiative order yet.</p>
                    ) : tokensInInitiative.map((token) => (
                      <div key={token.id} className="flex items-center gap-2 p-2 rounded text-sm border border-border/40">
                        <span className="truncate flex-1">{token.name}</span>
                        <span className="font-bold">{token.initiative}</span>
                      </div>
                    ))}
                  </div>
                )}
                {mobilePanel === 'sheet' && (() => {
                  const ownToken = visibleTokens.find((t) => isOwnToken(t) && t.characterId);
                  const charId = ownToken?.characterId || myCharacterId;
                  if (charId) {
                    return (
                      <VTTCharacterPanel
                        characterId={charId}
                        onRoll={(formula) => vttRealtime.rollAndBroadcast(formula)}
                        onChat={(msg, type) => vttRealtime.sendChatMessage(msg, type)}
                      />
                    );
                  }
                  return <p className="text-xs text-muted-foreground text-center py-4">No character linked.</p>;
                })()}
                {mobilePanel === 'assets' && (
                  <VTTAssetBrowser
                    campaignId={effectiveCampaignId}
                    readOnly={false}
                    onUseAsToken={(imageUrl, name) => {
                      vttRealtime.sendChatMessage(`wants to use "${name}" as their token`, 'system');
                      setMobilePanel(null);
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Handout Share Popup Overlay */}
        {vttRealtime.sharedHandout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={vttRealtime.dismissHandout}>
            <div className="bg-background border-2 border-primary rounded-lg shadow-2xl max-w-lg w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-arise text-lg font-bold gradient-text-shadow">{vttRealtime.sharedHandout.title}</h3>
                <button onClick={vttRealtime.dismissHandout} className="text-muted-foreground hover:text-foreground text-lg">&times;</button>
              </div>
              {vttRealtime.sharedHandout.imageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden border border-border">
                  <OptimizedImage
                    src={vttRealtime.sharedHandout.imageUrl}
                    alt={vttRealtime.sharedHandout.title}
                    className="w-full max-h-[400px] object-contain"
                    size="large"
                  />
                </div>
              )}
              {vttRealtime.sharedHandout.content && (
                <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {vttRealtime.sharedHandout.content}
                </div>
              )}
              <div className="mt-3 text-xs text-muted-foreground text-right">
                Shared by {vttRealtime.sharedHandout.sharedBy}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlayerMapView;
