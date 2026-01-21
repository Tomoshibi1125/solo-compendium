import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, FileText, Maximize2, Minus, Plus, Save, Upload } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import '@/styles/vtt-enhanced.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useCampaignMembers, useCampaignRole } from '@/hooks/useCampaigns';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { readLocalToolState, useCampaignToolState, useUserToolState } from '@/hooks/useToolState';
import { useAuth } from '@/lib/auth/authContext';
import {
  DEFAULT_TOKENS,
  mergeBaseTokens,
  normalizeLibraryTokens,
  type LibraryToken,
} from '@/data/tokenLibraryDefaults';

interface PlacedToken {
  id: string;
  characterId?: string;
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
  // Character stats
  hp?: number;
  maxHp?: number;
  ac?: number;
  initiative?: number;
  conditions?: string[];
  // Visibility
  visible: boolean;
}

type DrawingType = 'line' | 'rect' | 'circle';

interface VTTDrawing {
  id: string;
  type: DrawingType;
  color: string;
  width: number;
  fill?: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  layer: number;
}

interface VTTAnnotation {
  id: string;
  text: string;
  x: number;
  y: number;
  layer: number;
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
  drawings?: VTTDrawing[];
  annotations?: VTTAnnotation[];
  tokens: PlacedToken[];
  fogOfWar: boolean;
  fogData?: boolean[][]; // Grid of revealed areas
}

interface DiceRoll {
  id: string;
  player: string;
  result: number;
  dice: string;
  timestamp: Date;
  critical?: boolean;
}

interface ChatMessage {
  id: string;
  player: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'dice' | 'system';
  diceResult?: DiceRoll;
}

type VTTScenesState = {
  scenes: Scene[];
  currentSceneId: string | null;
  savedAt?: string;
};

const SIZE_VALUES = {
  small: 32,
  medium: 48,
  large: 64,
  huge: 96,
};

const DEFAULT_SCENE_SETTINGS = {
  gridSize: 50,
  backgroundScale: 1,
  backgroundOffsetX: 0,
  backgroundOffsetY: 0,
};

const LAYER_OPTIONS = [
  { id: 0, label: 'Map' },
  { id: 1, label: 'Tokens' },
  { id: 2, label: 'Effects' },
  { id: 3, label: 'Warden' },
];

const toRgba = (hex: string, alpha: number) => {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const normalizeScene = (scene: Scene): Scene => ({
  ...scene,
  gridSize: scene.gridSize ?? DEFAULT_SCENE_SETTINGS.gridSize,
  backgroundScale: scene.backgroundScale ?? DEFAULT_SCENE_SETTINGS.backgroundScale,
  backgroundOffsetX: scene.backgroundOffsetX ?? DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
  backgroundOffsetY: scene.backgroundOffsetY ?? DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
  drawings: Array.isArray(scene.drawings) ? scene.drawings : [],
  annotations: Array.isArray(scene.annotations) ? scene.annotations : [],
});

const upsertScene = (scenes: Scene[], nextScene: Scene): Scene[] => {
  const index = scenes.findIndex((scene) => scene.id === nextScene.id);
  if (index === -1) return [...scenes, nextScene];
  const next = [...scenes];
  next[index] = nextScene;
  return next;
};

const VTTEnhanced = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInputRef = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [fogOfWar, setFogOfWar] = useState(false);
  const [fogMode, setFogMode] = useState<'reveal' | 'hide'>('reveal');
  const [fogBrushSize, setFogBrushSize] = useState(1);
  const [isFogPainting, setIsFogPainting] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedLibraryTokenId, setSelectedLibraryTokenId] = useState<string | null>(null);
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [draggedToken, setDraggedToken] = useState<PlacedToken | null>(null);
  const [currentLayer, setCurrentLayer] = useState(1);
  const [visibleLayers, setVisibleLayers] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
  });
  const [selectedTool, setSelectedTool] = useState<'select' | 'fog' | 'measure' | 'draw' | 'effect' | 'note'>('select');
  const [drawingMode, setDrawingMode] = useState<DrawingType>('line');
  const [drawingColor, setDrawingColor] = useState('#38bdf8');
  const [drawingWidth, setDrawingWidth] = useState(3);
  const [activeDrawing, setActiveDrawing] = useState<VTTDrawing | null>(null);
  const [noteText, setNoteText] = useState('');
  const [tokenSearch, setTokenSearch] = useState('');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isUploadingMap, setIsUploadingMap] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [diceRolls, setDiceRolls] = useState<DiceRoll[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showInitiative, setShowInitiative] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [measurementStart, setMeasurementStart] = useState<{ x: number; y: number } | null>(null);
  const [measurementEnd, setMeasurementEnd] = useState<{ x: number; y: number } | null>(null);
  const hydratedRef = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const toolKey = 'vtt_scenes';
  const legacyStorageKey = campaignId ? `vtt-scenes-${campaignId}` : 'vtt-scenes';
  const { state: storedState, isLoading: isStateLoading, saveNow } = useCampaignToolState<VTTScenesState>(
    campaignId || null,
    toolKey,
    {
      initialState: { scenes: [], currentSceneId: null },
      storageKey: legacyStorageKey,
    }
  );
  const mergedScenes = useMemo(() => {
    if (!currentScene) return scenes;
    const index = scenes.findIndex((scene) => scene.id === currentScene.id);
    if (index === -1) return [...scenes, currentScene];
    const next = [...scenes];
    next[index] = currentScene;
    return next;
  }, [currentScene, scenes]);
  const savePayload = useMemo(
    () => ({
      scenes: mergedScenes,
      currentSceneId: currentScene?.id ?? null,
    }),
    [currentScene?.id, mergedScenes]
  );
  const debouncedState = useDebounce(savePayload, 800);
  const gridSize = currentScene?.gridSize ?? DEFAULT_SCENE_SETTINGS.gridSize;
  const backgroundScale = currentScene?.backgroundScale ?? DEFAULT_SCENE_SETTINGS.backgroundScale;
  const backgroundOffsetX = currentScene?.backgroundOffsetX ?? DEFAULT_SCENE_SETTINGS.backgroundOffsetX;
  const backgroundOffsetY = currentScene?.backgroundOffsetY ?? DEFAULT_SCENE_SETTINGS.backgroundOffsetY;
  const {
    state: libraryTokens,
    isLoading: libraryLoading,
    saveNow: saveLibraryTokens,
  } = useUserToolState<LibraryToken[]>('token_library', {
    initialState: DEFAULT_TOKENS,
    storageKey: 'vtt-tokens',
  });

  const { data: members } = useCampaignMembers(campaignId || '');
  const { data: role } = useCampaignRole(campaignId || '');
  const isGM = role === 'system' || role === 'co-system';
  const effectiveVisibleLayers = useMemo(
    () => ({
      ...visibleLayers,
      3: isGM ? visibleLayers[3] : false,
    }),
    [isGM, visibleLayers]
  );
  const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== 'false';
  const isE2E = import.meta.env.VITE_E2E === 'true';
  const isAuthed = isSupabaseConfigured && !!user?.id;
  const useLocalCharacters = !isSupabaseConfigured || isE2E || (guestEnabled && !user);
  const localCampaignCharacters = useMemo(
    () =>
      (members || [])
        .map((member) => member.characters)
        .filter(Boolean) as Record<string, unknown>[],
    [members]
  );

  // Load campaign characters via members
  const { data: campaignCharacters } = useQuery({
    queryKey: ['campaign-characters', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      const { data: membersData } = await supabase
        .from('campaign_members')
        .select('character_id, characters(*)')
        .eq('campaign_id', campaignId)
        .not('character_id', 'is', null);
      
      if (!membersData) return [];
      return membersData
        .filter((m: { character_id: string | null; characters: unknown | null }) => m.characters)
        .map((m: { characters: Record<string, unknown> | null }) => m.characters || {});
    },
    enabled: !!campaignId && isAuthed && !loading,
  });
  const resolvedCharacters = useLocalCharacters ? localCampaignCharacters : campaignCharacters || [];
  const filteredLibraryTokens = useMemo(() => {
    const query = tokenSearch.trim().toLowerCase();
    if (!query) return libraryTokens;
    return libraryTokens.filter((token) => {
      const nameMatch = token.name.toLowerCase().includes(query);
      const tagMatch = token.tags?.some((tag) => tag.toLowerCase().includes(query));
      return nameMatch || tagMatch;
    });
  }, [libraryTokens, tokenSearch]);

  useEffect(() => {
    if (libraryLoading) return;
    const normalizedTokens = normalizeLibraryTokens(Array.isArray(libraryTokens) ? libraryTokens : []);
    if (normalizedTokens.length === 0) {
      void saveLibraryTokens(DEFAULT_TOKENS);
      return;
    }
    const mergedTokens = mergeBaseTokens(normalizedTokens);
    if (mergedTokens !== libraryTokens) {
      void saveLibraryTokens(mergedTokens);
    }
  }, [libraryLoading, libraryTokens, saveLibraryTokens]);

  useEffect(() => {
    if (!currentScene) return;
    setFogOfWar(currentScene.fogOfWar ?? false);
  }, [currentScene?.id]);

  const createNewScene = useCallback(() => {
    const scene: Scene = {
      id: `scene-${Date.now()}`,
      name: `Scene ${scenes.length + 1}`,
      width: 20,
      height: 20,
      gridSize: DEFAULT_SCENE_SETTINGS.gridSize,
      backgroundScale: DEFAULT_SCENE_SETTINGS.backgroundScale,
      backgroundOffsetX: DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
      backgroundOffsetY: DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
      tokens: [],
      drawings: [],
      annotations: [],
      fogOfWar: false,
    };
    setScenes(prev => [...prev, scene]);
    setCurrentScene(scene);
  }, [scenes.length]);

  useEffect(() => {
    if (!campaignId || isStateLoading || (hydratedRef.current && isGM)) return;
    const legacyState = readLocalToolState<any>(legacyStorageKey);
    const legacyScenes = Array.isArray(legacyState?.scenes) ? legacyState.scenes : [];
    const legacyCurrentId = typeof legacyState?.currentScene === 'string' ? legacyState.currentScene : null;
    const storedScenes = Array.isArray(storedState.scenes) ? storedState.scenes : [];
    const nextScenes = (storedScenes.length > 0 ? storedScenes : legacyScenes).map(normalizeScene);
    const nextCurrentId = storedState.currentSceneId ?? legacyCurrentId;

    if (nextScenes.length > 0) {
      setScenes(nextScenes);
      const selected = nextScenes.find((scene) => scene.id === nextCurrentId) || nextScenes[0];
      setCurrentScene(selected);
      if (isGM && storedScenes.length === 0 && legacyScenes.length > 0) {
        void saveNow({ scenes: nextScenes, currentSceneId: selected?.id ?? null });
      }
    } else if (isGM) {
      createNewScene();
    }

    if (isGM) {
      hydratedRef.current = true;
      setIsHydrated(true);
    }
  }, [campaignId, createNewScene, isGM, isStateLoading, legacyStorageKey, saveNow, storedState.currentSceneId, storedState.scenes]);

  useEffect(() => {
    if (!campaignId || isStateLoading || currentScene || !isGM) return;
    createNewScene();
  }, [campaignId, createNewScene, currentScene, isGM, isStateLoading]);

  useEffect(() => {
    if (!campaignId || !isHydrated || !isGM) return;
    void saveNow({
      ...debouncedState,
      savedAt: new Date().toISOString(),
    });
  }, [campaignId, debouncedState, isGM, isHydrated, saveNow]);

  useEffect(() => {
    if (!campaignId || !isAuthed) return;
    const channel = supabase
      .channel(`vtt-scenes-${campaignId}`)
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
          if (row.updated_by && row.updated_by === user?.id) return;
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
  }, [campaignId, isAuthed, toolKey, user?.id]);

  const persistSceneState = useCallback(
    (nextScenes: Scene[], currentSceneId: string | null) => {
      if (!campaignId || !isGM) return;
      void saveNow({
        scenes: nextScenes,
        currentSceneId,
        savedAt: new Date().toISOString(),
      });
    },
    [campaignId, isGM, saveNow]
  );

  const saveScenes = () => {
    if (!campaignId || !isGM) return;
    const state = {
      scenes: mergedScenes,
      currentSceneId: currentScene?.id ?? null,
      savedAt: new Date().toISOString(),
    };
    void saveNow(state);
    toast({
      title: 'Saved!',
      description: 'Scene saved.',
    });
  };

  const updateScene = useCallback((updates: Partial<Scene>) => {
    setCurrentScene((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      setScenes((prevScenes) => upsertScene(prevScenes, next));
      return next;
    });
  }, []);

  const appendToken = useCallback((placed: PlacedToken) => {
    setCurrentScene((prev) => {
      if (!prev) return prev;
      const next = { ...prev, tokens: [...(prev.tokens ?? []), placed] };
      setScenes((prevScenes) => {
        const nextScenes = upsertScene(prevScenes, next);
        persistSceneState(nextScenes, next.id);
        return nextScenes;
      });
      return next;
    });
  }, [persistSceneState]);

  const updateToken = useCallback((tokenId: string, updates: Partial<PlacedToken>) => {
    setCurrentScene((prev) => {
      if (!prev) return prev;
      const nextTokens = prev.tokens.map((token) => (token.id === tokenId ? { ...token, ...updates } : token));
      const next = { ...prev, tokens: nextTokens };
      setScenes((prevScenes) => {
        const nextScenes = upsertScene(prevScenes, next);
        if (!draggedToken || draggedToken.id !== tokenId) {
          persistSceneState(nextScenes, next.id);
        }
        return nextScenes;
      });
      return next;
    });
  }, [draggedToken, persistSceneState]);

  const removeToken = useCallback((tokenId: string) => {
    setCurrentScene((prev) => {
      if (!prev) return prev;
      const nextTokens = prev.tokens.filter((token) => token.id !== tokenId);
      const next = { ...prev, tokens: nextTokens };
      setScenes((prevScenes) => {
        const nextScenes = upsertScene(prevScenes, next);
        persistSceneState(nextScenes, next.id);
        return nextScenes;
      });
      return next;
    });
    if (activeTokenId === tokenId) {
      setActiveTokenId(null);
    }
  }, [activeTokenId, persistSceneState]);

  const addChatMessage = useCallback((type: 'chat' | 'dice' | 'system', message: string, diceResult?: DiceRoll) => {
    const chatMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      player: 'You',
      message,
      timestamp: new Date(),
      type,
      diceResult,
    };
    setChatMessages(prev => [chatMsg, ...prev].slice(0, 100));
  }, []);

  const rollDice = useCallback((dice: string): number => {
    const match = dice.match(/^(\d+)d(\d+)(?:([+-]\d+))?/);
    if (!match) return 0;

    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;

    let total = modifier;
    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }

    const critical = rolls.every(r => r === sides) || (count === 1 && rolls[0] === 20);
    const fumble = count === 1 && rolls[0] === 1;

    const diceRoll: DiceRoll = {
      id: `roll-${Date.now()}-${Math.random()}`,
      player: 'You',
      result: total,
      dice,
      timestamp: new Date(),
      critical,
    };

    setDiceRolls(prevDiceRolls => [...prevDiceRolls, diceRoll].slice(0, 50));
    addChatMessage('system', `${dice} = ${total}${critical ? ' (CRITICAL!)' : fumble ? ' (FUMBLE!)' : ''}`, diceRoll);

    return total;
  }, [addChatMessage]);

  const getGridPosition = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return null;
    const rect = mapRef.current.getBoundingClientRect();
    const scrollLeft = mapRef.current.scrollLeft;
    const scrollTop = mapRef.current.scrollTop;
    const x = e.clientX - rect.left + scrollLeft;
    const y = e.clientY - rect.top + scrollTop;
    const size = gridSize * zoom;
    const gridX = Math.floor(x / size);
    const gridY = Math.floor(y / size);
    return { x, y, gridX, gridY };
  }, [gridSize, zoom]);

  const buildFogData = useCallback((scene: Scene, revealed = false) => {
    return Array(scene.height)
      .fill(0)
      .map(() => Array(scene.width).fill(revealed));
  }, []);

  const applyFogAt = useCallback((gridX: number, gridY: number) => {
    if (!currentScene || !fogOfWar) return;
    const radius = Math.max(0, Math.min(4, fogBrushSize));
    const fogData = currentScene.fogData ? currentScene.fogData.map((row) => [...row]) : buildFogData(currentScene, false);
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        const fx = gridX + dx;
        const fy = gridY + dy;
        if (fx >= 0 && fx < currentScene.width && fy >= 0 && fy < currentScene.height) {
          fogData[fy][fx] = fogMode === 'reveal';
        }
      }
    }
    updateScene({ fogData });
  }, [buildFogData, currentScene, fogBrushSize, fogMode, fogOfWar, updateScene]);

  const handleMapUpload = useCallback(async (file: File) => {
    if (!currentScene) return;
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingMap(true);
    try {
      let publicUrl = '';
      if (isAuthed && isSupabaseConfigured) {
        const { compressImage } = await import('@/lib/imageOptimization');
        const compressed = await compressImage(file, {
          maxWidth: 4096,
          maxHeight: 4096,
          quality: 0.85,
          format: 'webp',
        });
        const fileName = `vtt/maps/${campaignId || 'global'}/map-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        const { error: uploadError } = await supabase.storage
          .from('compendium-images')
          .upload(fileName, compressed, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/webp',
          });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('compendium-images').getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      } else {
        publicUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file.'));
          reader.readAsDataURL(file);
        });
      }

      updateScene({
        backgroundImage: publicUrl,
        backgroundScale: DEFAULT_SCENE_SETTINGS.backgroundScale,
        backgroundOffsetX: DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
        backgroundOffsetY: DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
      });
      toast({
        title: 'Map uploaded',
        description: 'Background image updated for this scene.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Could not upload the map. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingMap(false);
    }
  }, [campaignId, currentScene, isAuthed, toast, updateScene]);

  const resizeScene = useCallback((nextWidth: number, nextHeight: number) => {
    if (!currentScene) return;
    let nextFog = currentScene.fogData;
    if (nextFog) {
      const resized = buildFogData({ ...currentScene, width: nextWidth, height: nextHeight }, false);
      for (let y = 0; y < Math.min(nextHeight, nextFog.length); y += 1) {
        for (let x = 0; x < Math.min(nextWidth, nextFog[y].length); x += 1) {
          resized[y][x] = nextFog[y][x];
        }
      }
      nextFog = resized;
    }
    updateScene({ width: nextWidth, height: nextHeight, fogData: nextFog });
  }, [buildFogData, currentScene, updateScene]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentScene) return;
    const grid = getGridPosition(e);
    if (!grid) return;

    if (selectedTool === 'note' && isGM) {
      const text = noteText.trim();
      if (!text) {
        toast({
          title: 'Add a note',
          description: 'Enter note text before placing.',
          variant: 'destructive',
        });
        return;
      }
      const nextAnnotations = [
        ...(currentScene.annotations ?? []),
        {
          id: `note-${Date.now()}`,
          text,
          x: grid.gridX,
          y: grid.gridY,
          layer: currentLayer,
        },
      ];
      updateScene({ annotations: nextAnnotations });
      return;
    }

    if (selectedTool === 'effect' && isGM) {
      const size = 3;
      const effect: VTTDrawing = {
        id: `effect-${Date.now()}`,
        type: 'circle',
        color: '#ef4444',
        width: 2,
        fill: 'rgba(239, 68, 68, 0.18)',
        x1: grid.gridX - size,
        y1: grid.gridY - size,
        x2: grid.gridX + size,
        y2: grid.gridY + size,
        layer: currentLayer,
      };
      updateScene({ drawings: [...(currentScene.drawings ?? []), effect] });
      return;
    }

    if (selectedTool === 'measure') {
      if (!measurementStart) {
        setMeasurementStart({ x: grid.gridX, y: grid.gridY });
        setMeasurementEnd({ x: grid.gridX, y: grid.gridY });
      } else {
        const dx = Math.abs(grid.gridX - measurementStart.x);
        const dy = Math.abs(grid.gridY - measurementStart.y);
        const distance = Math.max(dx, dy) + Math.min(dx, dy) * 0.5;
        toast({
          title: 'Distance',
          description: `${distance.toFixed(1)} grid units (${(distance * 5).toFixed(0)} ft)`,
        });
        setMeasurementStart(null);
        setMeasurementEnd(null);
      }
      return;
    }

    if (selectedTool !== 'select') return;

    if (selectedCharacterId && resolvedCharacters) {
      const character = resolvedCharacters.find((c: Record<string, unknown> & { id: string }) => c.id === selectedCharacterId);
      if (character) {
        const characterName = typeof character.name === 'string' ? character.name : 'Unknown';
        const hpCurrent = typeof character.hp_current === 'number' ? character.hp_current : 0;
        const hpMax = typeof character.hp_max === 'number' ? character.hp_max : 0;
        const ac = typeof character.armor_class === 'number' ? character.armor_class : 10;
        const portraitUrl = typeof character.portrait_url === 'string' ? character.portrait_url : undefined;
        const characterId = typeof character.id === 'string' ? character.id : '';
        const placed: PlacedToken = {
          id: `token-${Date.now()}`,
          characterId: characterId,
          name: characterName,
          emoji: '@',
          imageUrl: portraitUrl,
          size: 'medium',
          x: grid.gridX,
          y: grid.gridY,
          rotation: 0,
          layer: currentLayer,
          locked: false,
          hp: hpCurrent || hpMax || 0,
          maxHp: hpMax || 0,
          ac: ac || 10,
          visible: true,
        };
        appendToken(placed);
        setSelectedCharacterId(null);
        setActiveTokenId(placed.id);
      }
      return;
    }

    if (selectedLibraryTokenId) {
      const libraryToken = libraryTokens.find((token) => token.id === selectedLibraryTokenId);
      if (!libraryToken) return;
      const placed: PlacedToken = {
        id: `token-${Date.now()}`,
        name: libraryToken.name,
        emoji: libraryToken.emoji,
        imageUrl: libraryToken.imageUrl,
        color: libraryToken.color,
        size: libraryToken.size,
        x: grid.gridX,
        y: grid.gridY,
        rotation: 0,
        layer: currentLayer,
        locked: false,
        visible: true,
      };
      appendToken(placed);
      setSelectedLibraryTokenId(null);
      setActiveTokenId(placed.id);
      return;
    }

    setActiveTokenId(null);
  };


  const handleMapMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentScene) return;
    const grid = getGridPosition(e);
    if (!grid) return;

    if (selectedTool === 'fog' && fogOfWar && isGM) {
      setIsFogPainting(true);
      applyFogAt(grid.gridX, grid.gridY);
      return;
    }

    if (selectedTool === 'draw' && isGM) {
      const fill = drawingMode === 'line' ? undefined : toRgba(drawingColor, 0.18);
      const drawing: VTTDrawing = {
        id: `draw-${Date.now()}`,
        type: drawingMode,
        color: drawingColor,
        width: drawingWidth,
        fill,
        x1: grid.gridX,
        y1: grid.gridY,
        x2: grid.gridX,
        y2: grid.gridY,
        layer: currentLayer,
      };
      setActiveDrawing(drawing);
    }
  };

  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const grid = getGridPosition(e);
    if (!grid) return;

    if (draggedToken) {
      updateToken(draggedToken.id, { x: grid.gridX, y: grid.gridY });
    }

    if (selectedTool === 'fog' && isFogPainting && fogOfWar && isGM) {
      applyFogAt(grid.gridX, grid.gridY);
    }

    if (selectedTool === 'measure' && measurementStart) {
      setMeasurementEnd({ x: grid.gridX, y: grid.gridY });
    }

    if (activeDrawing && selectedTool === 'draw' && isGM) {
      setActiveDrawing((prev) => (prev ? { ...prev, x2: grid.gridX, y2: grid.gridY } : prev));
    }
  };

  const handleMapMouseUp = () => {
    if (draggedToken) {
      setDraggedToken(null);
    }
    if (isFogPainting) {
      setIsFogPainting(false);
    }
    if (activeDrawing && currentScene) {
      updateScene({ drawings: [...(currentScene.drawings ?? []), activeDrawing] });
      setActiveDrawing(null);
    }
  };

  const handleTokenDragStart = (token: PlacedToken, e: React.MouseEvent) => {
    if (token.locked || !isGM) return;
    e.stopPropagation();
    setDraggedToken(token);
    setActiveTokenId(token.id);
  };

  const updateTokenHP = (tokenId: string, delta: number) => {
    const token = currentScene?.tokens.find((t) => t.id === tokenId);
    if (!token || token.hp === undefined || token.maxHp === undefined) return;
    updateToken(tokenId, { hp: Math.max(0, Math.min(token.maxHp, token.hp + delta)) });
  };

  const updateTokenInitiative = (tokenId: string, initiative: number) => {
    updateToken(tokenId, { initiative });
  };

  const visibleTokens = currentScene?.tokens.filter((token) => {
    const layerVisible = !!effectiveVisibleLayers[token.layer];
    if (!layerVisible) return false;
    return isGM ? true : token.visible;
  }) || [];
  const activeToken = currentScene?.tokens.find((token) => token.id === activeTokenId) ?? null;
  const drawingsToRender = useMemo(() => {
    const base = currentScene?.drawings ?? [];
    return activeDrawing ? [...base, activeDrawing] : base;
  }, [activeDrawing, currentScene?.drawings]);
  const annotationsToRender = currentScene?.annotations ?? [];

  const tokensInInitiative = visibleTokens
    .filter(t => t.initiative !== undefined && t.initiative !== null)
    .sort((a, b) => (b.initiative || 0) - (a.initiative || 0));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-[1920px]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate(`/campaigns/${campaignId}`)}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaign
            </Button>
            <h1 className="font-arise text-3xl font-bold gradient-text-shadow">
              VTT - {currentScene?.name || 'No Scene'}
            </h1>
          </div>
          <div className="flex gap-2">
            {isGM && (
              <>
                <Button onClick={saveScenes} variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={createNewScene} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Scene
                </Button>
              </>
            )}
          </div>
        </div>

        <div className={cn("grid grid-cols-12 gap-4 h-[calc(100vh-200px)]", isMapExpanded && "grid-cols-12")}>
          {/* Left Sidebar */}
          <div className={cn("col-span-2 space-y-4 overflow-y-auto", isMapExpanded && "hidden")}>
            {isGM && (
              <>
                <SystemWindow title="SCENES">
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {scenes.map((scene) => (
                      <button
                        key={scene.id}
                        onClick={() => setCurrentScene(scene)}
                        className={cn(
                          'w-full p-2 rounded border text-left text-sm transition-all',
                          currentScene?.id === scene.id
                            ? 'bg-primary/20 border-primary'
                            : 'border-border hover:bg-muted/50'
                        )}
                      >
                        {scene.name}
                      </button>
                    ))}
                  </div>
                </SystemWindow>

                <SystemWindow title="TOOLS">
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { key: 'select', label: 'Select' },
                      { key: 'fog', label: 'Fog' },
                      { key: 'draw', label: 'Draw' },
                      { key: 'effect', label: 'Effect' },
                      { key: 'note', label: 'Note' },
                      { key: 'measure', label: 'Measure' },
                    ] as const).map((tool) => (
                      <button
                        key={tool.key}
                        onClick={() => setSelectedTool(tool.key)}
                        className={cn(
                          'w-full p-2 rounded border text-xs uppercase tracking-wide transition-all',
                          selectedTool === tool.key
                            ? 'bg-primary/20 border-primary'
                            : 'border-border hover:bg-muted/50'
                        )}
                      >
                        {tool.label}
                      </button>
                    ))}
                  </div>
                </SystemWindow>

                <SystemWindow title="CONTROLS">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs mb-1 block">Zoom</Label>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="flex-1 text-center text-xs">{Math.round(zoom * 100)}%</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                        >
                          <Plus className="w-3 h-3" />
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
                      />
                      <label htmlFor="showGrid" className="text-xs cursor-pointer">Grid</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="fogOfWar"
                        checked={fogOfWar}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFogOfWar(checked);
                          if (!currentScene) return;
                          if (checked && !currentScene.fogData) {
                            updateScene({ fogOfWar: checked, fogData: buildFogData(currentScene, false) });
                          } else {
                            updateScene({ fogOfWar: checked });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <label htmlFor="fogOfWar" className="text-xs cursor-pointer">Fog of War</label>
                    </div>
                    {fogOfWar && isGM && currentScene && (
                      <div className="space-y-2 border-t border-border/50 pt-2">
                        <div>
                          <Label className="text-xs mb-1 block">Fog Mode</Label>
                          <div className="flex gap-2">
                            <Button
                              variant={fogMode === 'reveal' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setFogMode('reveal')}
                              className="flex-1"
                            >
                              Reveal
                            </Button>
                            <Button
                              variant={fogMode === 'hide' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setFogMode('hide')}
                              className="flex-1"
                            >
                              Hide
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">Brush Size</Label>
                          <input
                            type="range"
                            min={1}
                            max={4}
                            step={1}
                            value={fogBrushSize}
                            onChange={(e) => setFogBrushSize(Number(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-[10px] text-muted-foreground">Size: {fogBrushSize}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateScene({ fogData: buildFogData(currentScene, false) })}
                            className="flex-1"
                          >
                            Reset Fog
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateScene({ fogData: buildFogData(currentScene, true) })}
                            className="flex-1"
                          >
                            Reveal All
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedTool === 'draw' && isGM && (
                      <div className="space-y-2 border-t border-border/50 pt-2">
                        <Label className="text-xs">Draw Mode</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['line', 'rect', 'circle'] as const).map((mode) => (
                            <Button
                              key={mode}
                              variant={drawingMode === mode ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setDrawingMode(mode)}
                              className="text-xs"
                            >
                              {mode}
                            </Button>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Color</Label>
                            <Input
                              type="color"
                              value={drawingColor}
                              onChange={(e) => setDrawingColor(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Width</Label>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              value={drawingWidth}
                              onChange={(e) => setDrawingWidth(Number(e.target.value) || 1)}
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedTool === 'note' && isGM && (
                      <div className="space-y-2 border-t border-border/50 pt-2">
                        <Label className="text-xs">Note Text</Label>
                        <Input
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Enter map note..."
                          className="h-8 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </SystemWindow>
                <SystemWindow title="LAYERS">
                  <div className="space-y-2">
                    <Label className="text-xs">Active Layer</Label>
                    <Select value={String(currentLayer)} onValueChange={(value) => setCurrentLayer(Number(value))}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select layer" />
                      </SelectTrigger>
                      <SelectContent>
                        {LAYER_OPTIONS.filter((layer) => isGM || layer.id !== 3).map((layer) => (
                          <SelectItem key={layer.id} value={String(layer.id)}>
                            {layer.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="space-y-1">
                      {LAYER_OPTIONS.filter((layer) => isGM || layer.id !== 3).map((layer) => {
                        const isVisible = !!visibleLayers[layer.id];
                        return (
                          <div key={layer.id} className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => setCurrentLayer(layer.id)}
                              className={cn(
                                'flex-1 rounded border px-2 py-1 text-xs text-left',
                                currentLayer === layer.id
                                  ? 'bg-primary/20 border-primary'
                                  : 'border-border hover:bg-muted/50'
                              )}
                            >
                              {layer.label}
                            </button>
                            <button
                              onClick={() => setVisibleLayers((prev) => ({ ...prev, [layer.id]: !prev[layer.id] }))}
                              className="h-7 w-7 rounded border border-border flex items-center justify-center"
                              aria-label={isVisible ? 'Hide layer' : 'Show layer'}
                            >
                              {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </SystemWindow>
                <SystemWindow title="MAP SETTINGS">
                  <div className="space-y-3">
                    <input
                      ref={mapInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          void handleMapUpload(file);
                        }
                        e.currentTarget.value = '';
                      }}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => mapInputRef.current?.click()}
                        className="flex-1"
                        disabled={isUploadingMap}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        {isUploadingMap ? 'Uploading' : 'Upload'}
                      </Button>
                      {currentScene?.backgroundImage && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateScene({ backgroundImage: undefined })}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Width (tiles)</Label>
                        <Input
                          type="number"
                          min={5}
                          max={100}
                          value={currentScene?.width ?? 20}
                          onChange={(e) => {
                            const nextWidth = Math.max(5, Number(e.target.value) || 5);
                            resizeScene(nextWidth, currentScene?.height ?? 20);
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Height (tiles)</Label>
                        <Input
                          type="number"
                          min={5}
                          max={100}
                          value={currentScene?.height ?? 20}
                          onChange={(e) => {
                            const nextHeight = Math.max(5, Number(e.target.value) || 5);
                            resizeScene(currentScene?.width ?? 20, nextHeight);
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Grid Size (px)</Label>
                      <Input
                        type="number"
                        min={20}
                        max={120}
                        value={gridSize}
                        onChange={(e) => updateScene({ gridSize: Math.max(20, Number(e.target.value) || DEFAULT_SCENE_SETTINGS.gridSize) })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Background Scale</Label>
                      <Input
                        type="number"
                        min={0.4}
                        max={3}
                        step={0.05}
                        value={backgroundScale}
                        onChange={(e) => updateScene({ backgroundScale: Math.max(0.4, Number(e.target.value) || 1) })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Offset X</Label>
                        <Input
                          type="number"
                          value={backgroundOffsetX}
                          onChange={(e) => updateScene({ backgroundOffsetX: Number(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Offset Y</Label>
                        <Input
                          type="number"
                          value={backgroundOffsetY}
                          onChange={(e) => updateScene({ backgroundOffsetY: Number(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => updateScene({ backgroundScale: 1, backgroundOffsetX: 0, backgroundOffsetY: 0 })}
                      >
                        Reset View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => updateScene({ drawings: [] })}
                      >
                        Clear Drawings
                      </Button>
                    </div>
                  </div>
                </SystemWindow>
              </>
            )}

            <SystemWindow title="TOKENS">
              <Tabs defaultValue="characters" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="characters">Characters</TabsTrigger>
                  <TabsTrigger value="library">Library</TabsTrigger>
                </TabsList>
                <TabsContent value="characters" className="mt-3">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {resolvedCharacters.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No characters yet.</p>
                    )}
                    {resolvedCharacters.map((char: Record<string, unknown> & { id: string; name: string; hp_current?: number; hp_max?: number; armor_class?: number; portrait_url?: string | null }) => {
                      const portraitUrl = typeof char.portrait_url === 'string' ? char.portrait_url : null;
                      return (
                        <button
                          key={char.id}
                          onClick={() => {
                            setSelectedCharacterId(char.id);
                            setSelectedLibraryTokenId(null);
                            setSelectedTool('select');
                          }}
                          className={cn(
                            'w-full p-2 rounded border text-left text-xs transition-all flex items-center gap-2',
                            selectedCharacterId === char.id
                              ? 'bg-primary/20 border-primary'
                              : 'border-border hover:bg-muted/50'
                          )}
                        >
                          {portraitUrl && (
                            <OptimizedImage
                              src={portraitUrl}
                              alt={char.name}
                              className="w-8 h-8 rounded-full object-cover border border-border"
                              size="thumbnail"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{char.name}</div>
                            <div className="text-muted-foreground">
                              {char.hp_current || 0}/{char.hp_max || 0} HP | AC {char.armor_class || 10}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="library" className="mt-3">
                  <div className="space-y-3">
                    <Input
                      value={tokenSearch}
                      onChange={(e) => setTokenSearch(e.target.value)}
                      placeholder="Search tokens..."
                      className="h-8 text-xs"
                    />
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filteredLibraryTokens.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">No tokens match.</p>
                      )}
                      {filteredLibraryTokens.map((token) => (
                        <button
                          key={token.id}
                          onClick={() => {
                            setSelectedLibraryTokenId(token.id);
                            setSelectedCharacterId(null);
                            setSelectedTool('select');
                          }}
                          className={cn(
                            'w-full p-2 rounded border text-left text-xs transition-all flex items-center gap-2',
                            selectedLibraryTokenId === token.id
                              ? 'bg-primary/20 border-primary'
                              : 'border-border hover:bg-muted/50'
                          )}
                        >
                          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-muted/40 overflow-hidden">
                            {token.imageUrl ? (
                              <OptimizedImage
                                src={token.imageUrl}
                                alt={token.name}
                                className="w-full h-full object-cover"
                                size="thumbnail"
                              />
                            ) : (
                              <span className="text-sm">{token.emoji || '@'}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{token.name}</div>
                            <div className="text-muted-foreground capitalize">
                              {token.category} | {token.size}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </SystemWindow>
          </div>

          {/* Main Map Area */}
          <div className={cn(isMapExpanded ? "col-span-12" : "col-span-7")}>
            <SystemWindow
              title="MAP"
              className="h-full flex flex-col"
              actions={(
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMapExpanded((prev) => !prev)}
                >
                  <Maximize2 className="w-3 h-3 mr-2" />
                  {isMapExpanded ? 'Exit Focus' : 'Focus'}
                </Button>
              )}
            >
              <div
                ref={mapRef}
                onClick={handleMapClick}
                onMouseDown={handleMapMouseDown}
                onMouseMove={handleMapMouseMove}
                onMouseUp={handleMapMouseUp}
                onMouseLeave={handleMapMouseUp}
                className={cn(
                  'flex-1 relative border-2 border-border rounded-lg bg-background overflow-auto',
                  selectedTool !== 'select' && 'cursor-crosshair',
                  selectedTool === 'select' && (selectedCharacterId || selectedLibraryTokenId) && 'cursor-crosshair'
                )}
              >
                {currentScene && (
                  <div
                    className="vtt-scene-container"
                    style={{
                      '--scene-width': `${currentScene.width * gridSize * zoom}px`,
                      '--scene-height': `${currentScene.height * gridSize * zoom}px`,
                    } as React.CSSProperties}
                  >
                    {/* Background */}
                    {currentScene.backgroundImage && effectiveVisibleLayers[0] && (
                      <div
                        className="vtt-background"
                        style={{
                          backgroundImage: `url(${currentScene.backgroundImage})`,
                          backgroundSize: `${backgroundScale * 100}%`,
                          backgroundPosition: `${backgroundOffsetX * zoom}px ${backgroundOffsetY * zoom}px`,
                        } as React.CSSProperties}
                      />
                    )}

                    {/* Grid */}
                    {showGrid && (
                      <div
                        className="vtt-grid"
                        style={{
                          '--grid-image': `
                            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                          `,
                          '--grid-size': `${gridSize * zoom}px ${gridSize * zoom}px`,
                        } as React.CSSProperties}
                      />
                    )}

                    {/* Drawings */}
                    {drawingsToRender.map((drawing) => {
                      if (!effectiveVisibleLayers[drawing.layer]) return null;
                      if (drawing.type === 'line') {
                        const startX = (drawing.x1 + 0.5) * gridSize * zoom;
                        const startY = (drawing.y1 + 0.5) * gridSize * zoom;
                        const endX = (drawing.x2 + 0.5) * gridSize * zoom;
                        const endY = (drawing.y2 + 0.5) * gridSize * zoom;
                        const length = Math.hypot(endX - startX, endY - startY);
                        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
                        return (
                          <div
                            key={drawing.id}
                            className="vtt-drawing-line"
                            style={{
                              left: `${startX}px`,
                              top: `${startY}px`,
                              width: `${length}px`,
                              height: `${drawing.width}px`,
                              backgroundColor: drawing.color,
                              transform: `rotate(${angle}deg)`,
                            } as React.CSSProperties}
                          />
                        );
                      }

                      const left = Math.min(drawing.x1, drawing.x2) * gridSize * zoom;
                      const top = Math.min(drawing.y1, drawing.y2) * gridSize * zoom;
                      const width = (Math.abs(drawing.x2 - drawing.x1) + 1) * gridSize * zoom;
                      const height = (Math.abs(drawing.y2 - drawing.y1) + 1) * gridSize * zoom;
                      return (
                        <div
                          key={drawing.id}
                          className={cn('vtt-drawing-shape', drawing.type === 'circle' && 'is-circle')}
                          style={{
                            left: `${left}px`,
                            top: `${top}px`,
                            width: `${width}px`,
                            height: `${height}px`,
                            borderColor: drawing.color,
                            borderWidth: `${drawing.width}px`,
                            backgroundColor: drawing.fill ?? 'transparent',
                          } as React.CSSProperties}
                        />
                      );
                    })}

                    {/* Annotations */}
                    {annotationsToRender.map((note) => {
                      if (!effectiveVisibleLayers[note.layer]) return null;
                      return (
                        <div
                          key={note.id}
                          className="vtt-annotation"
                          style={{
                            left: `${note.x * gridSize * zoom}px`,
                            top: `${note.y * gridSize * zoom}px`,
                          } as React.CSSProperties}
                          onDoubleClick={(e) => {
                            if (!isGM) return;
                            e.stopPropagation();
                            updateScene({
                              annotations: (currentScene?.annotations ?? []).filter((entry) => entry.id !== note.id),
                            });
                          }}
                        >
                          {note.text}
                        </div>
                      );
                    })}

                    {/* Measurement Line */}
                    {selectedTool === 'measure' && measurementStart && measurementEnd && (() => {
                      const startX = (measurementStart.x + 0.5) * gridSize * zoom;
                      const startY = (measurementStart.y + 0.5) * gridSize * zoom;
                      const endX = (measurementEnd.x + 0.5) * gridSize * zoom;
                      const endY = (measurementEnd.y + 0.5) * gridSize * zoom;
                      const length = Math.hypot(endX - startX, endY - startY);
                      const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
                      const dx = Math.abs(measurementEnd.x - measurementStart.x);
                      const dy = Math.abs(measurementEnd.y - measurementStart.y);
                      const distance = Math.max(dx, dy) + Math.min(dx, dy) * 0.5;
                      return (
                        <div className="vtt-measurement">
                          <div
                            className="vtt-measurement-line"
                            style={{
                              left: `${startX}px`,
                              top: `${startY}px`,
                              width: `${length}px`,
                              transform: `rotate(${angle}deg)`,
                            } as React.CSSProperties}
                          />
                          <div
                            className="vtt-measurement-label"
                            style={{
                              left: `${(startX + endX) / 2}px`,
                              top: `${(startY + endY) / 2}px`,
                            } as React.CSSProperties}
                          >
                            {distance.toFixed(1)}u ({(distance * 5).toFixed(0)} ft)
                          </div>
                        </div>
                      );
                    })()}

                    {/* Tokens */}
                    {visibleTokens.map((token) => {
                      const size = SIZE_VALUES[token.size] * zoom;
                      const hpPercentage = token.maxHp ? (token.hp || 0) / token.maxHp : 1;
                      return (
                        <div
                          key={token.id}
                          draggable={!token.locked && isGM}
                          onDragStart={(e) => handleTokenDragStart(token, e)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTokenId(token.id);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            if (token.characterId) {
                              window.open(`/characters/${token.characterId}`, '_blank');
                            }
                          }}
                          className={cn(
                            'vtt-token group',
                            token.locked && 'locked',
                            activeTokenId === token.id && 'active',
                            draggedToken?.id === token.id && 'dragged'
                          )}
                          style={{
                            '--token-x': `${token.x * gridSize * zoom}px`,
                            '--token-y': `${token.y * gridSize * zoom}px`,
                            '--token-size': `${size}px`,
                            '--token-rotation': `${token.rotation}deg`,
                            zIndex: token.layer * 10 + 10,
                          } as React.CSSProperties}
                        >
                          <div
                            className="vtt-token-inner"
                            style={{
                              '--token-bg-color': token.color ? `${token.color}40` : 'transparent',
                              '--token-font-size': `${size * 0.4}px`,
                              borderColor: token.color ?? undefined,
                            } as React.CSSProperties}
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
                            {token.hp !== undefined && token.maxHp !== undefined && (
                              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 rounded-full overflow-hidden">
                                <div
                                  className="vtt-hp-bar"
                                  style={{ '--hp-percentage': `${hpPercentage * 100}%` } as React.CSSProperties}
                                />
                              </div>
                            )}
                            {isGM && (
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {token.hp !== undefined && `${token.hp}/${token.maxHp}`}
                                {token.ac !== undefined && ` AC ${token.ac}`}
                              </div>
                            )}
                          </div>
                          {isGM && (
                            <div className="absolute top-full left-0 right-0 mt-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateTokenHP(token.id, -1);
                                }}
                              >
                                -1
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateTokenHP(token.id, 1);
                                }}
                              >
                                +1
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Fog of War */}
                    {fogOfWar && currentScene.fogData && (
                      <div
                        className="vtt-fog-of-war pointer-events-none"
                        style={{ opacity: isGM ? 0.5 : 0.85 } as React.CSSProperties}
                      >
                        {currentScene.fogData.map((row, y) =>
                          row.map((revealed, x) => (
                            !revealed && (
                              <div
                                key={`${x}-${y}`}
                                className="vtt-fog-tile"
                                style={{
                                  '--tile-x': `${x * gridSize * zoom}px`,
                                  '--tile-y': `${y * gridSize * zoom}px`,
                                  '--tile-size': `${gridSize * zoom}px`,
                                } as React.CSSProperties}
                              />
                            )
                          ))
                        )}
                      </div>
                    )}

                  </div>
                )}
              </div>
            </SystemWindow>
          </div>

          {/* Right Sidebar */}
          <div className={cn("col-span-3 space-y-4 overflow-y-auto", isMapExpanded && "hidden")}>
            {activeToken && (
              <SystemWindow title="ACTIVE TOKEN">
                <div className="space-y-3 text-xs">
                  <div>
                    <Label className="text-xs">Name</Label>
                    {isGM ? (
                      <Input
                        value={activeToken.name}
                        onChange={(e) => updateToken(activeToken.id, { name: e.target.value })}
                        className="h-8 text-xs"
                      />
                    ) : (
                      <p className="mt-1 text-sm">{activeToken.name}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Size</Label>
                      <Select
                        value={activeToken.size}
                        onValueChange={(value) => updateToken(activeToken.id, { size: value as PlacedToken['size'] })}
                        disabled={!isGM}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="huge">Huge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Layer</Label>
                      <Select
                        value={String(activeToken.layer)}
                        onValueChange={(value) => updateToken(activeToken.id, { layer: Number(value) })}
                        disabled={!isGM}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Layer" />
                        </SelectTrigger>
                        <SelectContent>
                          {LAYER_OPTIONS.filter((layer) => isGM || layer.id !== 3).map((layer) => (
                            <SelectItem key={layer.id} value={String(layer.id)}>
                              {layer.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {isGM && (
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">HP</Label>
                        <Input
                          type="number"
                          value={activeToken.hp ?? 0}
                          onChange={(e) => updateToken(activeToken.id, { hp: Number(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Max</Label>
                        <Input
                          type="number"
                          value={activeToken.maxHp ?? 0}
                          onChange={(e) => updateToken(activeToken.id, { maxHp: Number(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">AC</Label>
                        <Input
                          type="number"
                          value={activeToken.ac ?? 10}
                          onChange={(e) => updateToken(activeToken.id, { ac: Number(e.target.value) || 10 })}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={activeToken.visible}
                        onChange={(e) => updateToken(activeToken.id, { visible: e.target.checked })}
                        className="w-4 h-4"
                        disabled={!isGM}
                      />
                      <span>Visible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={activeToken.locked}
                        onChange={(e) => updateToken(activeToken.id, { locked: e.target.checked })}
                        className="w-4 h-4"
                        disabled={!isGM}
                      />
                      <span>Locked</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Rotation</Label>
                    <Input
                      type="number"
                      value={activeToken.rotation}
                      onChange={(e) => updateToken(activeToken.id, { rotation: Number(e.target.value) || 0 })}
                      className="h-8 text-xs"
                      disabled={!isGM}
                    />
                  </div>
                  {isGM && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => removeToken(activeToken.id)}
                      >
                        Remove
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => updateToken(activeToken.id, { hp: activeToken.maxHp ?? activeToken.hp ?? 0 })}
                      >
                        Heal
                      </Button>
                    </div>
                  )}
                </div>
              </SystemWindow>
            )}
            <Tabs defaultValue="initiative" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="initiative">Initiative</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="dice">Dice</TabsTrigger>
                <TabsTrigger value="journal">Journal</TabsTrigger>
              </TabsList>

              <TabsContent value="initiative" className="space-y-2">
                <SystemWindow title="INITIATIVE TRACKER">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {tokensInInitiative.map((token, index) => (
                      <div
                        key={token.id}
                        className={cn(
                          'p-2 rounded border flex items-center justify-between',
                          index === 0 && 'bg-primary/20 border-primary'
                        )}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-arise text-lg">{index + 1}</span>
                          <span className="truncate text-sm">{token.name}</span>
                        </div>
                        {isGM && (
                          <Input
                            type="number"
                            value={token.initiative || 0}
                            onChange={(e) => updateTokenInitiative(token.id, parseInt(e.target.value) || 0)}
                            className="w-16 h-7 text-xs"
                          />
                        )}
                        {!isGM && (
                          <span className="text-sm font-semibold">{token.initiative}</span>
                        )}
                      </div>
                    ))}
                    {tokensInInitiative.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No tokens in initiative. {isGM && 'Set initiative values on tokens.'}
                      </p>
                    )}
                  </div>
                </SystemWindow>
              </TabsContent>

              <TabsContent value="chat" className="space-y-2">
                <SystemWindow title="CHAT" className="flex flex-col h-[400px]">
                  <div className="flex-1 overflow-y-auto space-y-2 mb-2">
                    {chatMessages.slice().reverse().map((msg) => (
                      <div key={msg.id} className="text-xs">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="font-semibold">{msg.player}</span>
                          <span className="text-muted-foreground">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className={cn(
                          'p-2 rounded border',
                          msg.type === 'system' && 'bg-muted/30',
                          msg.type === 'dice' && 'bg-blue-500/20'
                        )}>
                          {msg.message}
                          {msg.diceResult && (
                            <div className="mt-1 text-blue-400">
                              Rolled {msg.diceResult.dice} = {msg.diceResult.result}
                              {msg.diceResult.critical && ' CRITICAL!'}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newMessage.trim()) {
                          addChatMessage('chat', newMessage);
                          setNewMessage('');
                        }
                      }}
                      placeholder="Type message..."
                      className="text-sm"
                    />
                    <Button
                      onClick={() => {
                        if (newMessage.trim()) {
                          addChatMessage('chat', newMessage);
                          setNewMessage('');
                        }
                      }}
                      size="sm"
                    >
                      Send
                    </Button>
                  </div>
                </SystemWindow>
              </TabsContent>

              <TabsContent value="dice" className="space-y-2">
                <SystemWindow title="DICE ROLLER">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs mb-2 block">Quick Rolls</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => rollDice('1d20')}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          1d20
                        </Button>
                        <Button
                          onClick={() => rollDice('1d12')}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          1d12
                        </Button>
                        <Button
                          onClick={() => rollDice('2d6')}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          2d6
                        </Button>
                        <Button
                          onClick={() => rollDice('1d100')}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          1d100
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs mb-2 block">Custom Roll</Label>
                      <div className="flex gap-2">
                        <Input
                          id="customDice"
                          placeholder="1d20+5"
                          className="text-xs"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.target as HTMLInputElement;
                              rollDice(input.value);
                              input.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      <Label className="text-xs mb-2 block">Recent Rolls</Label>
                      {diceRolls.slice(0, 10).map((roll) => (
                        <div key={roll.id} className="text-xs p-2 rounded border bg-muted/30">
                          <div className="flex justify-between">
                            <span>{roll.dice}</span>
                            <span className={cn(
                              'font-bold',
                              roll.critical && 'text-green-400'
                            )}>
                              {roll.result}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SystemWindow>
              </TabsContent>

              <TabsContent value="journal" className="space-y-2">
                <SystemWindow title="JOURNAL" className="h-[400px] flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-2 mb-2">
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Quick access to journal entries. Full journal editor available separately.
                    </p>
                  </div>
                  <Link to={`/campaigns/${campaignId}/journal`}>
                    <Button variant="outline" className="w-full" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Open Full Journal
                    </Button>
                  </Link>
                </SystemWindow>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VTTEnhanced;

