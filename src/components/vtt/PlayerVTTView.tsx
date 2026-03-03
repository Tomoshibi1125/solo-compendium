import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Maximize2,
  Users,
  Ruler,
  Triangle,
  Circle,
  Square
} from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { useToast } from '@/hooks/use-toast';
import { useCampaignToolState } from '@/hooks/useToolState';
import { useVTTRealtime } from '@/hooks/useVTTRealtime';
import { useCampaignCombatSession } from '@/hooks/useCampaignCombat';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { VttPixiStage } from '@/components/vtt/VttPixiStage';
import './PlayerVTTView.css';

interface PlayerVTTViewProps {
  campaignId: string;
  sessionId: string;
  className?: string;
}

// Minimal matching types for the scenes
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
  tokens: any[];
  walls?: any[];
  lights?: any[];
  fogOfWar: boolean;
  fogData?: boolean[][];
  gridType?: 'square' | 'hex';
  weather?: string;
}

type VTTScenesState = {
  scenes: Scene[];
  currentSceneId: string | null;
  savedAt?: string;
};

const normalizeScene = (scene: any): Scene => ({
  ...scene,
  gridSize: scene.gridSize ?? 50,
  backgroundScale: scene.backgroundScale ?? 1,
  backgroundOffsetX: scene.backgroundOffsetX ?? 0,
  backgroundOffsetY: scene.backgroundOffsetY ?? 0,
  walls: Array.isArray(scene.walls) ? scene.walls : [],
  lights: Array.isArray(scene.lights) ? scene.lights : [],
  gridType: scene.gridType ?? 'square',
  weather: scene.weather ?? 'none',
});

// For Pixi: Only layers 0, 1, 2 are visible to players (3 is GM only)
const PLAYER_VISIBLE_LAYERS: Record<number, boolean> = {
  0: true,
  1: true,
  2: true,
  3: false,
};

export function PlayerVTTView({
  campaignId,
  sessionId,
  className
}: PlayerVTTViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState<'none' | 'ruler' | 'cone' | 'sphere' | 'cube'>('none');

  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const toolKey = sessionId ? `vtt_scenes:${sessionId}` : 'vtt_scenes';
  const legacyStorageKey = campaignId
    ? `vtt-scenes-${campaignId}${sessionId ? `-${sessionId}` : ''}`
    : 'vtt-scenes';

  const { state: storedState, isLoading: isStateLoading } = useCampaignToolState<VTTScenesState>(
    campaignId || null,
    toolKey,
    {
      initialState: { scenes: [], currentSceneId: null },
      storageKey: legacyStorageKey,
    }
  );

  const vttRealtime = useVTTRealtime({
    campaignId: campaignId || '',
    sessionId,
    isDM: false,
  });

  // Derive Active Initiative Token
  const { data: combatData } = useCampaignCombatSession(campaignId || '', sessionId);
  const activeInitiativeTokenId = useMemo(() => {
    if (!combatData?.session || !combatData?.combatants?.length || !currentScene) return null;
    const sorted = [...combatData.combatants].sort((a, b) => b.initiative - a.initiative);
    const activeCombatant = sorted[combatData.session.current_turn ?? 0];
    if (!activeCombatant) return null;
    const token = currentScene.tokens.find(t =>
      (activeCombatant.member_id && t.characterId === activeCombatant.member_id) ||
      t.name === activeCombatant.name
    );
    return token?.id ?? null;
  }, [combatData, currentScene]);

  const visibleTokens = useMemo(() => {
    if (!currentScene?.tokens) return [];
    return currentScene.tokens.reduce<any[]>((acc, token) => {
      const layerVisible = !!PLAYER_VISIBLE_LAYERS[token.layer];
      if (!layerVisible || !token.visible) return acc;

      let hp = token.hp;
      let maxHp = token.maxHp;
      let conditions = token.conditions || [];

      const combatant = combatData?.combatants?.find(c =>
        (c.member_id && c.member_id === token.characterId) ||
        c.name === token.name
      );

      if (combatant) {
        const stats = combatant.stats as Record<string, any>;
        if (typeof stats?.hp === 'number') hp = stats.hp;
        if (typeof stats?.maxHp === 'number') maxHp = stats.maxHp;
        if (Array.isArray(combatant.conditions)) {
          conditions = Array.from(new Set([...conditions, ...(combatant.conditions as Record<string, any>[])]));
        }
      }

      acc.push({ ...token, hp, maxHp, conditions });
      return acc;
    }, []);
  }, [currentScene?.tokens, combatData]);

  // Load initial state
  useEffect(() => {
    if (!campaignId || isStateLoading) return;
    const storedScenes = Array.isArray(storedState.scenes) ? storedState.scenes : [];
    const nextScenes = storedScenes.map(normalizeScene);
    const nextCurrentId = storedState.currentSceneId;

    if (nextScenes.length > 0) {
      setScenes(nextScenes);
      const selected = nextScenes.find((scene) => scene.id === nextCurrentId) || nextScenes[0];
      setCurrentScene(selected);
    }
  }, [campaignId, isStateLoading, storedState.currentSceneId, storedState.scenes]);

  // Handle Realtime sync from DB
  useEffect(() => {
    if (!campaignId || !isSupabaseConfigured || !user?.id) return;
    const channel = supabase
      .channel(`player-vtt-scenes-${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaign_tool_states',
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          const row = payload.new as { tool_key?: string; state?: VTTScenesState; updated_by?: string | null } | null;
          if (!row || row.tool_key !== toolKey || !row.state) return;
          // Accept all changes, even own, since player view is read-only for scenes
          const incoming = row.state;
          if (!Array.isArray(incoming.scenes)) return;
          const nextScenes = incoming.scenes.map(normalizeScene);
          setScenes(nextScenes);
          const selected = nextScenes.find((scene) => scene.id === incoming.currentSceneId) || nextScenes[0] || null;
          setCurrentScene(selected);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId, toolKey, user?.id]);

  // Handle Realtime transient moves
  useEffect(() => {
    if (!campaignId) return;
    const unsub1 = vttRealtime.on('token_move', (payload) => {
      if (payload.movedBy === vttRealtime.userId) return;
      setCurrentScene(prev => {
        if (!prev) return prev;
        const nextTokens = prev.tokens.map((token) => (token.id === payload.tokenId ? { ...token, x: payload.x, y: payload.y } : token));
        return { ...prev, tokens: nextTokens };
      });
    });
    const unsub2 = vttRealtime.on('token_update', (payload) => {
      if (payload.updatedBy === vttRealtime.userId) return;
      setCurrentScene(prev => {
        if (!prev) return prev;
        const nextTokens = prev.tokens.map((token) => (token.id === payload.tokenId ? { ...token, ...(payload.updates as Record<string, any>) } : token));
        return { ...prev, tokens: nextTokens };
      });
    });
    return () => { unsub1(); unsub2(); };
  }, [campaignId, vttRealtime]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetView = () => setZoom(1);

  // Read-only handlers for Pixi Stage
  const updateToken = useCallback((tokenId: string, updates: Partial<any>) => {
    setCurrentScene((prev) => {
      if (!prev) return prev;
      const token = prev.tokens.find(t => t.id === tokenId);
      if (!token) return prev;

      // Ownership check: Players can only drag their own tokens
      const isOwner = token.characterId === user?.id || (combatData?.combatants?.find(c => c.name === token.name)?.member_id === user?.id);
      if (!isOwner) return prev;

      const nextTokens = prev.tokens.map((t) => (t.id === tokenId ? { ...t, ...updates } : t));
      return { ...prev, tokens: nextTokens };
    });
  }, [user?.id, combatData?.combatants]);

  const handleTokenDragEnd = useCallback((tokenId: string) => {
    if (!currentScene) return;
    const token = currentScene.tokens.find((t) => t.id === tokenId);
    if (token) {
      const isOwner = token.characterId === user?.id || (combatData?.combatants?.find(c => c.name === token.name)?.member_id === user?.id);
      if (isOwner) {
        vttRealtime.broadcastTokenMove(tokenId, token.x, token.y);
      }
    }
  }, [currentScene, vttRealtime, user?.id, combatData?.combatants]);

  if (isStateLoading) {
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

  if (!currentScene) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-2 text-muted-foreground bg-muted rounded" />
            <p className="text-muted-foreground">Waiting for DM to load a map...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const gridSize = currentScene.gridSize || 50;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-5 w-5 bg-muted rounded" />
          {currentScene.name}
          <Badge variant="outline" className="ml-auto">
            <Users className="h-3 w-3 mr-1" />
            Player View
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[600px]">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant={showGrid ? "default" : "outline"} size="sm" onClick={() => setShowGrid(!showGrid)} title="Toggle Grid">
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetView} title="Reset View">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Button variant={drawMode === 'none' ? 'default' : 'outline'} size="sm" onClick={() => setDrawMode('none')} title="Select / Move">
              Select
            </Button>
            <Button variant={drawMode === 'ruler' ? 'default' : 'outline'} size="sm" onClick={() => setDrawMode('ruler')} title="Ruler">
              <Ruler className="h-4 w-4" />
            </Button>
            <Button variant={drawMode === 'cone' ? 'default' : 'outline'} size="sm" onClick={() => setDrawMode('cone')} title="Cone">
              <Triangle className="h-4 w-4" />
            </Button>
            <Button variant={drawMode === 'sphere' ? 'default' : 'outline'} size="sm" onClick={() => setDrawMode('sphere')} title="Sphere/Radius">
              <Circle className="h-4 w-4" />
            </Button>
            <Button variant={drawMode === 'cube' ? 'default' : 'outline'} size="sm" onClick={() => setDrawMode('cube')} title="Cube">
              <Square className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* VTT Pixi Canvas */}
        <div
          ref={containerRef}
          className="w-full flex-1 overflow-auto bg-slate-900 relative"
          style={{ touchAction: 'none' }}
        >
          <VttPixiStage
            containerRef={containerRef}
            scene={currentScene}
            tokens={visibleTokens}
            gridSize={gridSize}
            zoom={zoom}
            showGrid={showGrid}
            isGM={false}
            effectiveVisibleLayers={PLAYER_VISIBLE_LAYERS}
            activeTokenId={activeTokenId}
            activeInitiativeTokenId={activeInitiativeTokenId}
            setActiveTokenId={setActiveTokenId}
            updateToken={updateToken}
            walls={currentScene.walls}
            lightSources={currentScene.lights}
            gridConfig={{ type: currentScene.gridType || 'square', size: gridSize }}
            onRequestZoom={setZoom}
            onTokenDragEnd={handleTokenDragEnd}
            drawMode={drawMode}
            weather={currentScene.weather as never}
          />
        </div>
      </CardContent>
    </Card>
  );
}
