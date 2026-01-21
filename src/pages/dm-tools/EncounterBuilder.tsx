import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Search, Sword } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { calculateDifficulty, calculateXP } from '@/lib/encounterMath';
import type { Database } from '@/integrations/supabase/types';
import { monsters as staticMonsters } from '@/data/compendium/monsters';
import { getCRXP } from '@/lib/experience';
import { useDebounce } from '@/hooks/useDebounce';
import { saveUserToolState, useUserToolState, writeLocalToolState } from '@/hooks/useToolState';
import { useAuth } from '@/lib/auth/authContext';
import { formatMonarchVernacular, normalizeMonarchSearch } from '@/lib/vernacular';

type Monster = Database['public']['Tables']['compendium_monsters']['Row'];

interface EncounterMonster {
  id: string;
  monster: Monster;
  quantity: number;
}

const ENCOUNTER_STORAGE_KEY = 'solo-compendium.dm-tools.encounter-builder.v1';
const INITIATIVE_STORAGE_KEY = 'solo-compendium.dm-tools.initiative.v1';
const MONSTER_QUERY_TIMEOUT_MS = 8000;
const RANK_CR_MAP: Record<string, string> = {
  D: '1/2',
  C: '1',
  B: '4',
  A: '8',
  S: '15',
};

type AbilityScores = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

type SavingThrows = Partial<AbilityScores>;

type StaticMonster = {
  id: string;
  name: string;
  type: string;
  rank: string;
  description?: string;
  lore?: string;
  size?: string;
  image?: string;
  skills?: string[] | string;
  senses?: string[] | string;
  languages?: string[] | string;
  damageResistances?: string[] | string;
  damageImmunities?: string[] | string;
  damageVulnerabilities?: string[] | string;
  conditionImmunities?: string[] | string;
  stats?: {
    abilityScores?: Partial<AbilityScores>;
    armorClass?: number;
    hitPoints?: number;
    challengeRating?: number;
    savingThrows?: SavingThrows;
  };
};

const staticMonstersList = staticMonsters as StaticMonster[];

const toNumber = (value: number | undefined, fallback: number) =>
  Number.isFinite(value) ? (value as number) : fallback;

const toStringArray = (value: string | string[] | null | undefined) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === 'string');
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return null;
};

const mapStaticMonster = (monster: StaticMonster): Monster => {
  const abilities: Partial<AbilityScores> = monster.stats?.abilityScores ?? {};
  const crValue = typeof monster.stats?.challengeRating === 'number'
    ? String(monster.stats.challengeRating)
    : RANK_CR_MAP[monster.rank] || '1';
  const hitPoints = toNumber(monster.stats?.hitPoints, 1);

  return {
    id: monster.id,
    name: monster.name,
    display_name: monster.name,
    description: monster.description || null,
    lore: monster.lore || null,
    created_at: new Date().toISOString(),
    cr: crValue,
    xp: getCRXP(crValue),
    gate_rank: monster.rank || null,
    is_boss: monster.rank === 'S' || monster.rank === 'A',
    creature_type: monster.type || 'Unknown',
    armor_class: toNumber(monster.stats?.armorClass, 10),
    hit_points_average: hitPoints,
    hit_points_formula: '1d8',
    size: monster.size || 'Medium',
    str: toNumber(abilities.strength, 10),
    agi: toNumber(abilities.dexterity, 10),
    vit: toNumber(abilities.constitution, 10),
    int: toNumber(abilities.intelligence, 10),
    sense: toNumber(abilities.wisdom, 10),
    pre: toNumber(abilities.charisma, 10),
    skills: monster.skills ?? null,
    saving_throws: monster.stats?.savingThrows ?? null,
    senses: monster.senses ?? null,
    languages: toStringArray(monster.languages),
    damage_resistances: toStringArray(monster.damageResistances),
    damage_immunities: toStringArray(monster.damageImmunities),
    damage_vulnerabilities: toStringArray(monster.damageVulnerabilities),
    condition_immunities: toStringArray(monster.conditionImmunities),
    armor_type: null,
    alignment: null,
    aliases: null,
    generated_reason: null,
    image_generated_at: null,
    image_url: monster.image || null,
    license_note: null,
    source_book: 'System Ascendant Homebrew',
    source_kind: null,
    source_name: null,
    speed_burrow: null,
    speed_climb: null,
    speed_fly: null,
    speed_swim: null,
    speed_walk: null,
    tags: [monster.type, monster.rank].filter(Boolean),
    theme_tags: null,
  };
};

const buildFallbackMonsters = (searchQuery: string) => {
  const query = normalizeMonarchSearch(searchQuery.trim().toLowerCase());
  const filtered = query
    ? staticMonstersList.filter((monster) => {
        const description = monster.description || '';
        return (
          normalizeMonarchSearch(monster.name.toLowerCase()).includes(query) ||
          normalizeMonarchSearch(monster.type.toLowerCase()).includes(query) ||
          normalizeMonarchSearch(monster.rank.toLowerCase()).includes(query) ||
          normalizeMonarchSearch(description.toLowerCase()).includes(query)
        );
      })
    : staticMonstersList;
  return filtered.slice(0, 50).map(mapStaticMonster);
};

const EncounterBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthed = isSupabaseConfigured && !!user?.id;
  const hydratedRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hunterLevel, setHunterLevel] = useState(1);
  const [hunterCount, setHunterCount] = useState(4);
  const [encounterMonsters, setEncounterMonsters] = useState<EncounterMonster[]>([]);

  const { state: storedState, isLoading: isToolStateLoading, saveNow } = useUserToolState<{
    hunterLevel: number;
    hunterCount: number;
    encounterMonsters: EncounterMonster[];
    version?: number;
    savedAt?: string;
  }>('encounter_builder', {
    initialState: { hunterLevel: 1, hunterCount: 4, encounterMonsters: [] },
    storageKey: ENCOUNTER_STORAGE_KEY,
  });

  const savePayload = useMemo(
    () => ({
      hunterLevel,
      hunterCount,
      encounterMonsters,
    }),
    [hunterCount, hunterLevel, encounterMonsters]
  );
  const debouncedState = useDebounce(savePayload, 600);

  // Load persisted encounter (best-effort)
  useEffect(() => {
    if (isToolStateLoading || hydratedRef.current) return;
    if (typeof storedState.hunterLevel === 'number') setHunterLevel(storedState.hunterLevel);
    if (typeof storedState.hunterCount === 'number') setHunterCount(storedState.hunterCount);
    if (Array.isArray(storedState.encounterMonsters)) setEncounterMonsters(storedState.encounterMonsters);
    hydratedRef.current = true;
  }, [isToolStateLoading, storedState.encounterMonsters, storedState.hunterCount, storedState.hunterLevel]);

  // Persist encounter (best-effort)
  useEffect(() => {
    if (!hydratedRef.current) return;
    void saveNow({
      ...debouncedState,
      version: 1,
      savedAt: new Date().toISOString(),
    });
  }, [debouncedState, saveNow]);

  const { data: monsters = [], isLoading } = useQuery({
    queryKey: ['monsters', searchQuery],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return buildFallbackMonsters(searchQuery);
      }

      const withTimeout = async <T,>(promise: PromiseLike<T>, timeoutMs: number): Promise<T> => {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        const timeoutPromise = new Promise<T>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Monster query timed out')), timeoutMs);
        });
        try {
          return await Promise.race([Promise.resolve(promise), timeoutPromise]);
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }
      };

      const canonicalQuery = normalizeMonarchSearch(searchQuery);
      let query = supabase
        .from('compendium_monsters')
        .select('*')
        .limit(50);

      if (canonicalQuery) {
        query = query.ilike('name', `%${canonicalQuery}%`);
      }

      try {
        const { data, error } = await withTimeout(query, MONSTER_QUERY_TIMEOUT_MS);
        if (error) {
          return buildFallbackMonsters(searchQuery);
        }
        if (!data || data.length === 0) {
          return buildFallbackMonsters(searchQuery);
        }
        return data as Monster[];
      } catch {
        return buildFallbackMonsters(searchQuery);
      }
    },
    placeholderData: buildFallbackMonsters(searchQuery),
  });

  const totalXP = encounterMonsters.reduce((sum, em) => sum + calculateXP(em.monster, em.quantity), 0);
  const difficulty = calculateDifficulty(totalXP, hunterLevel, hunterCount);

  const addMonster = (monster: Monster) => {
    const displayName = formatMonarchVernacular(monster.name);
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
        description: `${displayName} added to Rift encounter.`,
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
    toast({
      title: 'Encounter cleared',
      description: 'Encounter builder state cleared.',
    });
  };

  const sendToInitiativeTracker = async () => {
    if (encounterMonsters.length === 0) return;

    const combatants = encounterMonsters.flatMap((em) => {
      const qty = Math.max(1, em.quantity || 1);
      const displayName = formatMonarchVernacular(em.monster.name);
      return Array.from({ length: qty }, (_, i) => ({
        id: `${em.monster.id}-${Date.now()}-${Math.random()}-${i}`,
        name: qty > 1 ? `${displayName} #${i + 1}` : displayName,
        initiative: 0,
        hp: em.monster.hit_points_average || undefined,
        maxHp: em.monster.hit_points_average || undefined,
        ac: em.monster.armor_class || undefined,
        conditions: [] as string[],
        isHunter: false,
      }));
    });

    const initiativeState = {
      version: 1,
      savedAt: new Date().toISOString(),
      combatants,
      currentTurn: 0,
      round: 1,
    };

    if (isAuthed && user?.id) {
      await saveUserToolState(user.id, 'initiative_tracker', initiativeState);
    } else {
      writeLocalToolState(INITIATIVE_STORAGE_KEY, initiativeState);
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

  const showLoadingState = isLoading && monsters.length === 0;

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
            RIFT ENCOUNTER BUILDER
          </h1>
          <p className="text-muted-foreground font-heading">
            Design balanced encounters for Ascendants entering Rifts. The System watches.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Encounter Summary */}
          <div className="lg:col-span-1 space-y-4">
            <SystemWindow title="ENCOUNTER SUMMARY">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-display text-muted-foreground mb-1 block">
                    ASCENDANT LEVEL
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
                    ASCENDANT COUNT
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
                          <div className="font-heading text-sm">
                            {formatMonarchVernacular(em.monster.name)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            CR {em.monster.cr || '?'} | {calculateXP(em.monster, em.quantity)} XP
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(em.id, em.quantity - 1)}
                            aria-label={`Decrease quantity of ${formatMonarchVernacular(em.monster.name)}`}
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
                            aria-label={`Increase quantity of ${formatMonarchVernacular(em.monster.name)}`}
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
                    placeholder="Search Rift creatures..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {showLoadingState ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading Rift creatures...
                </div>
              ) : monsters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sword className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No Rift creatures found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                  {monsters.map((monster) => (
                    <div
                      key={monster.id}
                      className="p-3 rounded border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => addMonster(monster)}
                      data-testid="encounter-monster-card"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-heading font-semibold">
                            {formatMonarchVernacular(monster.name)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            CR {monster.cr || '?'} | {monster.xp || 0} XP
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
                          aria-label={`Add ${formatMonarchVernacular(monster.name)} to encounter`}
                          data-testid="encounter-add-button"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      {monster.creature_type && (
                        <Badge variant="outline" className="text-xs">
                          {formatMonarchVernacular(monster.creature_type)}
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


