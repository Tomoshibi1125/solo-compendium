import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Search, Sword } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { calculateDifficulty, calculateXP } from '@/lib/encounterMath';
import type { Database } from '@/integrations/supabase/types';

type Monster = Database['public']['Tables']['compendium_monsters']['Row'];

interface EncounterMonster {
  id: string;
  monster: Monster;
  quantity: number;
}

const ENCOUNTER_STORAGE_KEY = 'solo-compendium.dm-tools.encounter-builder.v1';
const INITIATIVE_STORAGE_KEY = 'solo-compendium.dm-tools.initiative.v1';

const EncounterBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [hunterLevel, setHunterLevel] = useState(1);
  const [hunterCount, setHunterCount] = useState(4);
  const [encounterMonsters, setEncounterMonsters] = useState<EncounterMonster[]>([]);

  // Load persisted encounter (best-effort)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ENCOUNTER_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        hunterLevel: number;
        hunterCount: number;
        encounterMonsters: EncounterMonster[];
      }>;

      if (typeof parsed.hunterLevel === 'number') setHunterLevel(parsed.hunterLevel);
      if (typeof parsed.hunterCount === 'number') setHunterCount(parsed.hunterCount);
      if (Array.isArray(parsed.encounterMonsters)) setEncounterMonsters(parsed.encounterMonsters);
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // Persist encounter (best-effort)
  useEffect(() => {
    try {
      localStorage.setItem(
        ENCOUNTER_STORAGE_KEY,
        JSON.stringify({
          version: 1,
          savedAt: new Date().toISOString(),
          hunterLevel,
          hunterCount,
          encounterMonsters,
        })
      );
    } catch {
      // ignore quota errors
    }
  }, [hunterLevel, hunterCount, encounterMonsters]);

  const { data: monsters = [], isLoading } = useQuery({
    queryKey: ['monsters', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('compendium_monsters')
        .select('*')
        .limit(50);

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Monster[];
    },
  });

  const totalXP = encounterMonsters.reduce((sum, em) => sum + calculateXP(em.monster, em.quantity), 0);
  const difficulty = calculateDifficulty(totalXP, hunterLevel, hunterCount);

  const addMonster = (monster: Monster) => {
    const existing = encounterMonsters.find(em => em.monster.id === monster.id);
    if (existing) {
      setEncounterMonsters(encounterMonsters.map(em =>
        em.id === existing.id ? { ...em, quantity: em.quantity + 1 } : em
      ));
    } else {
      setEncounterMonsters([...encounterMonsters, {
        id: `${monster.id}-${Date.now()}`,
        monster,
        quantity: 1,
      }]);
    }
      toast({
        title: 'Creature added',
        description: `${monster.name} added to Gate encounter.`,
      });
  };

  const removeMonster = (id: string) => {
    setEncounterMonsters(encounterMonsters.filter(em => em.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeMonster(id);
      return;
    }
    setEncounterMonsters(encounterMonsters.map(em =>
      em.id === id ? { ...em, quantity } : em
    ));
  };

  const clearEncounter = () => {
    setEncounterMonsters([]);
    try {
      localStorage.removeItem(ENCOUNTER_STORAGE_KEY);
    } catch {
      // ignore
    }
    toast({
      title: 'Encounter cleared',
      description: 'Encounter builder state cleared.',
    });
  };

  const sendToInitiativeTracker = () => {
    if (encounterMonsters.length === 0) return;

    const combatants = encounterMonsters.flatMap((em) => {
      const qty = Math.max(1, em.quantity || 1);
      return Array.from({ length: qty }, (_, i) => ({
        id: `${em.monster.id}-${Date.now()}-${Math.random()}-${i}`,
        name: qty > 1 ? `${em.monster.name} #${i + 1}` : em.monster.name,
        initiative: 0,
        hp: em.monster.hit_points_average || undefined,
        maxHp: em.monster.hit_points_average || undefined,
        ac: em.monster.armor_class || undefined,
        conditions: [] as string[],
        isHunter: false,
      }));
    });

    try {
      localStorage.setItem(
        INITIATIVE_STORAGE_KEY,
        JSON.stringify({
          version: 1,
          savedAt: new Date().toISOString(),
          combatants,
          currentTurn: 0,
          round: 1,
        })
      );
    } catch {
      // ignore
    }

    toast({
      title: 'Sent to tracker',
      description: 'Encounter monsters loaded into the initiative tracker.',
    });
    navigate('/dm-tools/initiative-tracker');
  };

  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-orange-400',
    deadly: 'text-red-400',
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to System Tools
          </Button>
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-shadow">
            GATE ENCOUNTER BUILDER
          </h1>
          <p className="text-muted-foreground font-heading">
            Design balanced encounters for Hunters entering Gates. The System watches.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Encounter Summary */}
          <div className="lg:col-span-1 space-y-4">
            <SystemWindow title="ENCOUNTER SUMMARY">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-display text-muted-foreground mb-1 block">
                    HUNTER LEVEL
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={hunterLevel}
                    onChange={(e) => setHunterLevel(parseInt(e.target.value) || 1)}
                    className="font-display"
                  />
                </div>
                <div>
                  <label className="text-xs font-display text-muted-foreground mb-1 block">
                    HUNTER COUNT
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={hunterCount}
                    onChange={(e) => setHunterCount(parseInt(e.target.value) || 1)}
                    className="font-display"
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-display text-muted-foreground">TOTAL XP</span>
                    <span className="font-display text-lg font-bold">{totalXP}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display text-muted-foreground">DIFFICULTY</span>
                    <Badge
                      variant={difficulty === 'deadly' ? 'destructive' : 'secondary'}
                      className={cn("font-display", difficultyColors[difficulty as keyof typeof difficultyColors])}
                    >
                      {difficulty.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {encounterMonsters.length > 0 && (
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="text-xs font-display text-muted-foreground mb-2">
                      MONSTERS ({encounterMonsters.reduce((sum, em) => sum + em.quantity, 0)})
                    </div>
                    {encounterMonsters.map((em) => (
                      <div
                        key={em.id}
                        className="p-2 rounded border bg-muted/30 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="font-heading text-sm">{em.monster.name}</div>
                          <div className="text-xs text-muted-foreground">
                            CR {em.monster.cr || '—'} • {calculateXP(em.monster, em.quantity)} XP
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(em.id, em.quantity - 1)}
                            aria-label={`Decrease quantity of ${em.monster.name}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={em.quantity}
                            onChange={(e) => updateQuantity(em.id, parseInt(e.target.value) || 1)}
                            className="w-12 h-6 text-xs font-display"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(em.id, em.quantity + 1)}
                            aria-label={`Increase quantity of ${em.monster.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-border space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={sendToInitiativeTracker}
                    disabled={encounterMonsters.length === 0}
                  >
                    Send to Initiative Tracker
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={clearEncounter}
                    disabled={encounterMonsters.length === 0}
                  >
                    Clear Encounter
                  </Button>
                </div>
              </div>
            </SystemWindow>
          </div>

          {/* Monster Search */}
          <div className="lg:col-span-2 space-y-4">
            <SystemWindow title="MONSTER SEARCH">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Gate creatures..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading Gate creatures...
                </div>
              ) : monsters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sword className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No Gate creatures found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                  {monsters.map((monster) => (
                    <div
                      key={monster.id}
                      className="p-3 rounded border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => addMonster(monster)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-heading font-semibold">{monster.name}</div>
                          <div className="text-xs text-muted-foreground">
                            CR {monster.cr || '—'} • {monster.xp || 0} XP
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            addMonster(monster);
                          }}
                          aria-label={`Add ${monster.name} to encounter`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      {monster.creature_type && (
                        <Badge variant="outline" className="text-xs">
                          {monster.creature_type}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SystemWindow>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EncounterBuilder;

