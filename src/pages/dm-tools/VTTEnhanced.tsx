import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Download, Grid, Plus, Minus, Move, RotateCw, Trash2, Layers, Eye, EyeOff, Dice6, MessageSquare, Users, Crown, Settings, Volume2, VolumeX, FileText, Maximize2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useCampaignMembers, useCampaignRole } from '@/hooks/useCampaigns';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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

interface Scene {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundImage?: string;
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

const SIZE_VALUES = {
  small: 32,
  medium: 48,
  large: 64,
  huge: 96,
};

const VTTEnhanced = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [gridSize] = useState(50);
  const [showGrid, setShowGrid] = useState(true);
  const [fogOfWar, setFogOfWar] = useState(false);
  const [isGM, setIsGM] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [draggedToken, setDraggedToken] = useState<PlacedToken | null>(null);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [selectedTool, setSelectedTool] = useState<'select' | 'fog' | 'measure'>('select');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [diceRolls, setDiceRolls] = useState<DiceRoll[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showInitiative, setShowInitiative] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [measurementStart, setMeasurementStart] = useState<{ x: number; y: number } | null>(null);
  const [measurementEnd, setMeasurementEnd] = useState<{ x: number; y: number } | null>(null);

  const { data: members } = useCampaignMembers(campaignId || '');
  const { data: role } = useCampaignRole(campaignId || '');

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
        .map((m: { characters: Record<string, unknown> }) => m.characters);
    },
    enabled: !!campaignId,
  });

  const createNewScene = useCallback(() => {
    const scene: Scene = {
      id: `scene-${Date.now()}`,
      name: `Scene ${scenes.length + 1}`,
      width: 20,
      height: 20,
      tokens: [],
      fogOfWar: false,
    };
    setScenes(prev => [...prev, scene]);
    setCurrentScene(scene);
  }, [scenes.length]);

  const loadScenes = useCallback(() => {
    if (!campaignId) return;
    const saved = localStorage.getItem(`vtt-scenes-${campaignId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setScenes(parsed.scenes || []);
        setCurrentScene(parsed.currentScene || parsed.scenes?.[0] || null);
      } catch (e) {
        createNewScene();
      }
    } else {
      createNewScene();
    }
  }, [campaignId, createNewScene]);

  useEffect(() => {
    if (role === 'system' || role === 'co-system') {
      setIsGM(true);
    }
    loadScenes();
  }, [role, campaignId, loadScenes]);

  // Real-time sync for scenes (would use Supabase Realtime in production)
  useEffect(() => {
    if (!campaignId) return;
    // In a real implementation, this would use Supabase Realtime subscriptions
    // For now, we'll use localStorage as a simple sync mechanism
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `vtt-scenes-${campaignId}` && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setScenes(parsed.scenes || []);
          if (parsed.currentScene) {
            const scene = parsed.scenes?.find((s: Scene) => s.id === parsed.currentScene);
            if (scene) setCurrentScene(scene);
          }
        } catch (e) {
          // Invalid data
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [campaignId]);

  const saveScenes = () => {
    if (!campaignId) return;
    const state = {
      scenes,
      currentScene: currentScene?.id,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(`vtt-scenes-${campaignId}`, JSON.stringify(state));
    toast({
      title: 'Saved!',
      description: 'Scene saved.',
    });
  };

  const rollDice = (dice: string) => {
    // Parse dice notation (e.g., "1d20+5", "2d6", etc.)
    const match = dice.match(/(\d+)d(\d+)([+-]\d+)?/);
    if (!match) {
      toast({
        title: 'Invalid dice',
        description: 'Use format like 1d20+5 or 2d6',
        variant: 'destructive',
      });
      return;
    }

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
      id: `roll-${Date.now()}`,
      player: 'You',
      result: total,
      dice,
      timestamp: new Date(),
      critical,
    };

    setDiceRolls([diceRoll, ...diceRolls].slice(0, 50));
    addChatMessage('system', `${dice} = ${total}${critical ? ' (CRITICAL!)' : fumble ? ' (FUMBLE!)' : ''}`, diceRoll);

    return total;
  };

  const addChatMessage = (type: 'chat' | 'dice' | 'system', message: string, diceResult?: DiceRoll) => {
    const chatMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      player: 'You',
      message,
      timestamp: new Date(),
      type,
      diceResult,
    };
    setChatMessages([chatMsg, ...chatMessages].slice(0, 100));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current || !currentScene) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridX = Math.floor(x / (gridSize * zoom));
    const gridY = Math.floor(y / (gridSize * zoom));

    // Handle fog of war reveal
    if (selectedTool === 'fog' && fogOfWar && isGM) {
      if (!currentScene.fogData) {
        currentScene.fogData = Array(currentScene.height)
          .fill(null)
          .map(() => Array(currentScene.width).fill(false));
      }
      // Reveal area (3x3 grid)
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const fx = gridX + dx;
          const fy = gridY + dy;
          if (fx >= 0 && fx < currentScene.width && fy >= 0 && fy < currentScene.height) {
            currentScene.fogData[fy][fx] = true;
          }
        }
      }
      setCurrentScene({ ...currentScene });
      setScenes(scenes.map(s => s.id === currentScene.id ? currentScene : s));
      return;
    }

    // Place token
    if (selectedTool === 'select' && selectedToken && campaignCharacters) {
      const character = campaignCharacters.find((c: Record<string, unknown> & { id: string }) => c.id === selectedToken);
      if (character) {
        const characterName = typeof character.name === 'string' ? character.name : 'Unknown';
        const hpCurrent = typeof character.hp_current === 'number' ? character.hp_current : 0;
        const hpMax = typeof character.hp_max === 'number' ? character.hp_max : 0;
        const ac = typeof character.ac === 'number' ? character.ac : 10;
        const portraitUrl = typeof character.portrait_url === 'string' ? character.portrait_url : undefined;
        const characterId = typeof character.id === 'string' ? character.id : '';
        const placed: PlacedToken = {
          id: `token-${Date.now()}`,
          characterId: characterId,
          name: characterName,
          emoji: '⚔️',
          imageUrl: portraitUrl,
          size: 'medium',
          x: gridX,
          y: gridY,
          rotation: 0,
          layer: currentLayer,
          locked: false,
          hp: hpCurrent || hpMax || 0,
          maxHp: hpMax || 0,
          ac: ac || 10,
          visible: true,
        };
        const updatedScene = {
          ...currentScene,
          tokens: [...currentScene.tokens, placed],
        };
        setCurrentScene(updatedScene);
        setScenes(scenes.map(s => s.id === updatedScene.id ? updatedScene : s));
        setSelectedToken(null);
      }
    }

    // Measurement tool
    if (selectedTool === 'measure') {
      if (!measurementStart) {
        setMeasurementStart({ x: gridX, y: gridY });
      } else {
        // Calculate distance (grid units)
        const dx = Math.abs(gridX - measurementStart.x);
        const dy = Math.abs(gridY - measurementStart.y);
        const distance = Math.max(dx, dy) + Math.min(dx, dy) * 0.5; // Diagonal movement
        toast({
          title: 'Distance',
          description: `${distance.toFixed(1)} grid units (${(distance * 5).toFixed(0)} ft)`,
        });
        setMeasurementStart(null);
      }
    }
  };

  const handleTokenDragStart = (token: PlacedToken, e: React.MouseEvent) => {
    if (token.locked || !isGM) return;
    e.stopPropagation();
    setDraggedToken(token);
  };

  const handleTokenDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedToken || !currentScene || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridX = Math.floor(x / (gridSize * zoom));
    const gridY = Math.floor(y / (gridSize * zoom));

    const updatedScene = {
      ...currentScene,
      tokens: currentScene.tokens.map(t =>
        t.id === draggedToken.id
          ? { ...t, x: gridX, y: gridY }
          : t
      ),
    };
    setCurrentScene(updatedScene);
    setScenes(scenes.map(s => s.id === updatedScene.id ? updatedScene : s));
  };

  const handleTokenDragEnd = () => {
    setDraggedToken(null);
  };

  const updateTokenHP = (tokenId: string, delta: number) => {
    if (!currentScene) return;
    const updatedScene = {
      ...currentScene,
      tokens: currentScene.tokens.map(t => {
        if (t.id === tokenId && t.hp !== undefined && t.maxHp !== undefined) {
          return { ...t, hp: Math.max(0, Math.min(t.maxHp, t.hp + delta)) };
        }
        return t;
      }),
    };
    setCurrentScene(updatedScene);
    setScenes(scenes.map(s => s.id === updatedScene.id ? updatedScene : s));
  };

  const updateTokenInitiative = (tokenId: string, initiative: number) => {
    if (!currentScene) return;
    const updatedScene = {
      ...currentScene,
      tokens: currentScene.tokens.map(t =>
        t.id === tokenId ? { ...t, initiative } : t
      ),
    };
    setCurrentScene(updatedScene);
    setScenes(scenes.map(s => s.id === updatedScene.id ? updatedScene : s));
  };

  const visibleTokens = currentScene?.tokens.filter(t => 
    t.layer === currentLayer && (isGM || t.visible)
  ) || [];

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

        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
          {/* Left Sidebar */}
          <div className="col-span-2 space-y-4 overflow-y-auto">
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
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedTool('select')}
                      className={cn(
                        'w-full p-2 rounded border text-sm transition-all',
                        selectedTool === 'select'
                          ? 'bg-primary/20 border-primary'
                          : 'border-border hover:bg-muted/50'
                      )}
                    >
                      Select
                    </button>
                    <button
                      onClick={() => setSelectedTool('fog')}
                      className={cn(
                        'w-full p-2 rounded border text-sm transition-all',
                        selectedTool === 'fog'
                          ? 'bg-primary/20 border-primary'
                          : 'border-border hover:bg-muted/50'
                      )}
                    >
                      Fog of War
                    </button>
                    <button
                      onClick={() => setSelectedTool('measure')}
                      className={cn(
                        'w-full p-2 rounded border text-sm transition-all',
                        selectedTool === 'measure'
                          ? 'bg-primary/20 border-primary'
                          : 'border-border hover:bg-muted/50'
                      )}
                    >
                      Measure
                    </button>
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
                          setFogOfWar(e.target.checked);
                          if (currentScene) {
                            setCurrentScene({ ...currentScene, fogOfWar: e.target.checked });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <label htmlFor="fogOfWar" className="text-xs cursor-pointer">Fog of War</label>
                    </div>
                  </div>
                </SystemWindow>
              </>
            )}

            <SystemWindow title="CHARACTERS">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {campaignCharacters?.map((char: Record<string, unknown> & { id: string; name: string; hp_current?: number; hp_max?: number; ac?: number; portrait_url?: string | null }) => {
                  const portraitUrl = typeof char.portrait_url === 'string' ? char.portrait_url : null;
                  return (
                    <button
                      key={char.id}
                      onClick={() => setSelectedToken(char.id)}
                      className={cn(
                        'w-full p-2 rounded border text-left text-xs transition-all flex items-center gap-2',
                        selectedToken === char.id
                          ? 'bg-primary/20 border-primary'
                          : 'border-border hover:bg-muted/50'
                      )}
                    >
                      {portraitUrl && (
                        <img
                          src={portraitUrl}
                          alt={char.name}
                          className="w-8 h-8 rounded-full object-cover border border-border"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{char.name}</div>
                        <div className="text-muted-foreground">
                          {char.hp_current || 0}/{char.hp_max || 0} HP • AC {char.ac || 10}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </SystemWindow>
          </div>

          {/* Main Map Area */}
          <div className="col-span-7">
            <SystemWindow title="MAP" className="h-full flex flex-col">
              <div
                ref={mapRef}
                onClick={handleMapClick}
                onMouseMove={handleTokenDrag}
                onMouseUp={handleTokenDragEnd}
                className={cn(
                  'flex-1 relative border-2 border-border rounded-lg bg-background overflow-auto',
                  selectedToken && selectedTool === 'select' && 'cursor-crosshair'
                )}
              >
                {currentScene && (
                  <div
                    className="relative"
                    style={{
                      width: `${currentScene.width * gridSize * zoom}px`,
                      height: `${currentScene.height * gridSize * zoom}px`,
                      minWidth: '100%',
                      minHeight: '100%',
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

                    {/* Measurement Line */}
                    {selectedTool === 'measure' && measurementStart && (
                      <div
                        className="absolute pointer-events-none z-50"
                        style={{
                          left: `${measurementStart.x * gridSize * zoom}px`,
                          top: `${measurementStart.y * gridSize * zoom}px`,
                          width: `${gridSize * zoom}px`,
                          height: `${gridSize * zoom}px`,
                        }}
                      >
                        <div className="w-full h-full border-2 border-yellow-400 rounded-full bg-yellow-400/20" />
                      </div>
                    )}

                    {/* Fog of War */}
                    {fogOfWar && currentScene.fogData && (
                      <div className="absolute inset-0 pointer-events-none">
                        {currentScene.fogData.map((row, y) =>
                          row.map((revealed, x) => (
                            !revealed && (
                              <div
                                key={`${x}-${y}`}
                                className="absolute bg-black/80 border border-black/50"
                                style={{
                                  left: `${x * gridSize * zoom}px`,
                                  top: `${y * gridSize * zoom}px`,
                                  width: `${gridSize * zoom}px`,
                                  height: `${gridSize * zoom}px`,
                                }}
                              />
                            )
                          ))
                        )}
                      </div>
                    )}

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
                            if (isGM && token.characterId) {
                              // Could open character sheet in modal
                              navigate(`/characters/${token.characterId}`);
                            }
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            if (token.characterId) {
                              window.open(`/characters/${token.characterId}`, '_blank');
                            }
                          }}
                          className={cn(
                            'absolute cursor-move transition-all group',
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
                              'w-full h-full rounded-full flex flex-col items-center justify-center text-2xl border-2 transition-all hover:scale-110 relative',
                              token.color ? `border-[${token.color}]` : 'border-border'
                            )}
                            style={{
                              backgroundColor: token.color ? `${token.color}40` : undefined,
                              fontSize: `${size * 0.4}px`,
                            }}
                          >
                            {token.imageUrl ? (
                              <img
                                src={token.imageUrl}
                                alt={token.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              token.emoji || '⚔️'
                            )}
                            {token.hp !== undefined && token.maxHp !== undefined && (
                              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/50 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full transition-all',
                                    hpPercentage > 0.5 ? 'bg-green-500' :
                                    hpPercentage > 0.25 ? 'bg-yellow-500' : 'bg-red-500'
                                  )}
                                  style={{ width: `${hpPercentage * 100}%` }}
                                />
                              </div>
                            )}
                            {isGM && (
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {token.hp !== undefined && `${token.hp}/${token.maxHp}`}
                                {token.ac !== undefined && ` • AC ${token.ac}`}
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
                  </div>
                )}
              </div>
            </SystemWindow>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
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
                              {msg.diceResult.critical && ' 🎲 CRITICAL!'}
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

