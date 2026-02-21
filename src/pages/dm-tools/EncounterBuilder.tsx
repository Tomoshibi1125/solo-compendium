import { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Plus, Trash2, Search, Sword, Sparkles, Loader2 } from 'lucide-react';
import { useAIEnhance } from '@/hooks/useAIEnhance';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { calculateDifficulty, calculateXP } from '@/lib/encounterMath';
import type { Database } from '@/integrations/supabase/types';
import { monsters as staticMonsters } from '@/data/compendium/monsters';
import { getCRXP } from '@/lib/experience';
import { useDebounce } from '@/hooks/useDebounce';
import { useSaveCampaignEncounter } from '@/hooks/useCampaignEncounters';
import {
  saveCampaignToolState,
  saveUserToolState,
  useCampaignToolState,
  useUserToolState,
  writeLocalToolState,
} from '@/hooks/useToolState';
import { useJoinedCampaigns, useMyCampaigns } from '@/hooks/useCampaigns';
import { useAuth } from '@/lib/auth/authContext';
import { formatMonarchVernacular, normalizeMonarchSearch } from '@/lib/vernacular';
import { filterRowsBySourcebookAccess } from '@/lib/sourcebookAccess';
import { useHydratedPreferredCampaignId } from '@/hooks/usePreferredCampaignSelection';

type Monster = Database['public']['Tables']['compendium_monsters']['Row'];

interface EncounterMonster {
  id: string;
  monster: Monster;
  quantity: number;
}

type CampaignWithRole = {
  id: string;
  name: string;
  access: 'owner' | 'co-system';
};

const ENCOUNTER_STORAGE_KEY = 'solo-compendium.dm-tools.encounter-builder.v1';
const INITIATIVE_STORAGE_KEY = 'solo-compendium.dm-tools.initiative.v1';
const MONSTER_QUERY_TIMEOUT_MS = 8000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: myCampaigns = [], isLoading: myCampaignsLoading } = useMyCampaigns();
  const { data: joinedCampaigns = [], isLoading: joinedCampaignsLoading } = useJoinedCampaigns();
  const campaignId = searchParams.get('campaignId')?.trim() || null;
  const isCampaignScoped = !!campaignId;
  const persistenceContext = campaignId ? `campaign:${campaignId}` : 'user';
  const isAuthed = isSupabaseConfigured && !!user?.id;
  const hydratedContextRef = useRef<string | null>(null);
  const hasUserInteractedRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hunterLevel, setHunterLevel] = useState(1);
  const [hunterCount, setHunterCount] = useState(4);
  const [encounterMonsters, setEncounterMonsters] = useState<EncounterMonster[]>([]);
  const [encounterName, setEncounterName] = useState('');
  const [encounterDescription, setEncounterDescription] = useState('');
  const encounterStorageKey = campaignId ? `${ENCOUNTER_STORAGE_KEY}.${campaignId}` : ENCOUNTER_STORAGE_KEY;
  const initiativeStorageKey = campaignId ? `${INITIATIVE_STORAGE_KEY}.${campaignId}` : INITIATIVE_STORAGE_KEY;
  const saveEncounter = useSaveCampaignEncounter();

  const manageableCampaigns = useMemo<CampaignWithRole[]>(() => {
    const byId = new Map<string, CampaignWithRole>();

    for (const campaign of myCampaigns) {
      byId.set(campaign.id, {
        id: campaign.id,
        name: campaign.name,
        access: 'owner',
      });
    }

    for (const campaign of joinedCampaigns) {
      if (campaign.member_role !== 'co-system') continue;
      if (!byId.has(campaign.id)) {
        byId.set(campaign.id, {
          id: campaign.id,
          name: campaign.name,
          access: 'co-system',
        });
      }
    }

    return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [joinedCampaigns, myCampaigns]);

  useHydratedPreferredCampaignId({
    toolKey: 'encounter_builder',
    campaigns: manageableCampaigns,
    urlCampaignId: campaignId,
    isCampaignIdValid: (id) => manageableCampaigns.some((campaign) => campaign.id === id),
    onResolveCampaignId: (id) => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('campaignId', id);
      setSearchParams(nextParams, { replace: true });
    },
  });

  const campaignsLoading = myCampaignsLoading || joinedCampaignsLoading;
  const selectedCampaign = campaignId
    ? manageableCampaigns.find((campaign) => campaign.id === campaignId) ?? null
    : null;

  const handleCampaignChange = (nextCampaignId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('campaignId', nextCampaignId);
    setSearchParams(nextParams, { replace: true });
  };

  const userToolState = useUserToolState<{
    hunterLevel: number;
    hunterCount: number;
    encounterMonsters: EncounterMonster[];
    version?: number;
    savedAt?: string;
  }>('encounter_builder', {
    initialState: { hunterLevel: 1, hunterCount: 4, encounterMonsters: [] },
    storageKey: ENCOUNTER_STORAGE_KEY,
    enabled: !isCampaignScoped,
  });

  const campaignToolState = useCampaignToolState<{
    hunterLevel: number;
    hunterCount: number;
    encounterMonsters: EncounterMonster[];
    version?: number;
    savedAt?: string;
  }>(campaignId, 'encounter_builder', {
    initialState: { hunterLevel: 1, hunterCount: 4, encounterMonsters: [] },
    storageKey: encounterStorageKey,
    enabled: isCampaignScoped,
  });

  const { state: storedState, isLoading: isToolStateLoading, saveNow } = isCampaignScoped
    ? campaignToolState
    : userToolState;

  const savePayload = useMemo(
    () => ({
      hunterLevel,
      hunterCount,
      encounterMonsters,
    }),
    [hunterCount, hunterLevel, encounterMonsters]
  );
  const debouncedState = useDebounce(savePayload, 600);

  useEffect(() => {
    hasUserInteractedRef.current = false;
  }, [persistenceContext]);

  // Load persisted encounter (best-effort)
  useEffect(() => {
    if (isToolStateLoading || hydratedContextRef.current === persistenceContext) return;

    if (!hasUserInteractedRef.current) {
      if (typeof storedState.hunterLevel === 'number') setHunterLevel(storedState.hunterLevel);
      if (typeof storedState.hunterCount === 'number') setHunterCount(storedState.hunterCount);
      if (Array.isArray(storedState.encounterMonsters)) setEncounterMonsters(storedState.encounterMonsters);
    }

    hydratedContextRef.current = persistenceContext;
  }, [isToolStateLoading, persistenceContext, storedState.encounterMonsters, storedState.hunterCount, storedState.hunterLevel]);

  // Persist encounter (best-effort)
  useEffect(() => {
    if (hydratedContextRef.current !== persistenceContext) return;
    void saveNow({
      ...debouncedState,
      version: 1,
      savedAt: new Date().toISOString(),
    });
  }, [debouncedState, persistenceContext, saveNow]);

  const { data: monsters = [], isLoading } = useQuery({
    queryKey: ['monsters', campaignId ?? 'none', searchQuery],
    queryFn: async () => {
      const fallbackMonsters = buildFallbackMonsters(searchQuery);
      const resolveFallbackMonsters = async () => {
        const filteredFallback = await filterRowsBySourcebookAccess(
          fallbackMonsters,
          (monster) => monster.source_book,
          { campaignId }
        );
        return filteredFallback.length > 0 ? filteredFallback : fallbackMonsters;
      };

      if (!isSupabaseConfigured) {
        return resolveFallbackMonsters();
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
          return resolveFallbackMonsters();
        }
        if (!data || data.length === 0) {
          return resolveFallbackMonsters();
        }

        const filteredRemoteMonsters = await filterRowsBySourcebookAccess(
          data as Monster[],
          (monster) => monster.source_book,
          { campaignId }
        );

        if (filteredRemoteMonsters.length > 0) {
          return filteredRemoteMonsters;
        }

        return resolveFallbackMonsters();
      } catch {
        return resolveFallbackMonsters();
      }
    },
    placeholderData: buildFallbackMonsters(searchQuery),
  });

  const totalXP = encounterMonsters.reduce((sum, em) => sum + calculateXP(em.monster, em.quantity), 0);
  const difficulty = calculateDifficulty(totalXP, hunterLevel, hunterCount);

  const markUserInteraction = () => {
    hasUserInteractedRef.current = true;
  };

  const addMonster = (monster: Monster) => {
    markUserInteraction();
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
    markUserInteraction();
    setEncounterMonsters(encounterMonsters.filter(em => em.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    markUserInteraction();
    if (quantity <= 0) {
      removeMonster(id);
      return;
    }
    setEncounterMonsters(encounterMonsters.map(em =>
      em.id === id ? { ...em, quantity } : em
    ));
  };

  const clearEncounter = () => {
    markUserInteraction();
    setEncounterMonsters([]);
    setEncounterName('');
    setEncounterDescription('');
    toast({
      title: 'Encounter cleared',
      description: 'Encounter builder state cleared.',
    });
  };

  const handleSaveEncounter = async () => {
    if (!campaignId) return;
    if (!encounterName.trim()) {
      toast({
        title: 'Name required',
        description: 'Give this encounter a name before saving.',
        variant: 'destructive',
      });
      return;
    }
    if (encounterMonsters.length === 0) {
      toast({
        title: 'Add monsters first',
        description: 'Include at least one monster before saving the encounter.',
        variant: 'destructive',
      });
      return;
    }

    const entries = encounterMonsters.map((entry) => ({
      entry_kind: 'monster',
      monster_id: UUID_PATTERN.test(entry.monster.id) ? entry.monster.id : null,
      name: formatMonarchVernacular(entry.monster.name),
      quantity: entry.quantity,
      stats: {
        hp: entry.monster.hit_points_average,
        max_hp: entry.monster.hit_points_average,
        ac: entry.monster.armor_class,
        cr: entry.monster.cr,
        xp: entry.monster.xp,
        gate_rank: entry.monster.gate_rank,
        is_boss: entry.monster.is_boss,
      },
      source: {
        type: 'compendium_monsters',
        id: entry.monster.id,
        name: entry.monster.name,
      },
    }));

    await saveEncounter.mutateAsync({
      campaignId,
      name: encounterName.trim(),
      description: encounterDescription.trim() || null,
      difficulty: {
        difficulty,
        total_xp: totalXP,
        hunter_level: hunterLevel,
        hunter_count: hunterCount,
      },
      entries,
      loot: [],
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

    const combatantsForSession = combatants.map((combatant) => ({
      id: combatant.id,
      name: combatant.name,
      initiative: combatant.initiative,
      stats: {
        hp: combatant.hp ?? null,
        max_hp: combatant.maxHp ?? null,
        ac: combatant.ac ?? null,
      },
      conditions: combatant.conditions,
      flags: {
        isHunter: combatant.isHunter,
      },
      member_id: null,
    }));

    let destination =
      isCampaignScoped && campaignId
        ? `/dm-tools/initiative-tracker?campaignId=${campaignId}`
        : '/dm-tools/initiative-tracker';

    if (isCampaignScoped && campaignId && isSupabaseConfigured) {
      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!authUser?.id) {
          throw new Error('Not authenticated');
        }

        const { data: activeSession, error: activeSessionError } = await supabase
          .from('campaign_combat_sessions')
          .select('id')
          .eq('campaign_id', campaignId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (activeSessionError) {
          throw activeSessionError;
        }

        let targetSessionId = activeSession?.id ?? null;

        if (!targetSessionId) {
          const { data: createdSession, error: createSessionError } = await supabase
            .from('campaign_combat_sessions')
            .insert({
              campaign_id: campaignId,
              created_by: authUser.id,
              status: 'active',
              current_turn: 0,
              round: 1,
            })
            .select('id')
            .single();

          if (createSessionError) {
            throw createSessionError;
          }

          targetSessionId = createdSession.id;
        }

        const { error: clearCombatantsError } = await supabase
          .from('campaign_combatants')
          .delete()
          .eq('session_id', targetSessionId)
          .eq('campaign_id', campaignId);

        if (clearCombatantsError) {
          throw clearCombatantsError;
        }

        const { error: upsertCombatantsError } = await supabase
          .from('campaign_combatants')
          .upsert(
            combatantsForSession.map((combatant) => ({
              ...combatant,
              campaign_id: campaignId,
              session_id: targetSessionId,
            })),
            { onConflict: 'id' }
          );

        if (upsertCombatantsError) {
          throw upsertCombatantsError;
        }

        const { error: resetSessionError } = await supabase
          .from('campaign_combat_sessions')
          .update({ current_turn: 0, round: 1, status: 'active' })
          .eq('id', targetSessionId)
          .eq('campaign_id', campaignId);

        if (resetSessionError) {
          throw resetSessionError;
        }

        destination = `/dm-tools/initiative-tracker?campaignId=${campaignId}&sessionId=${targetSessionId}`;
      } catch (error) {
        const description = error instanceof Error ? error.message : 'Unable to sync to campaign combat session.';
        toast({
          title: 'Live combat sync unavailable',
          description: `${description} Falling back to local tracker state.`,
          variant: 'destructive',
        });
      }
    }

    if (!destination.includes('sessionId=')) {
      if (isCampaignScoped && campaignId && isSupabaseConfigured) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser?.id) {
          await saveCampaignToolState(campaignId, authUser.id, 'initiative_tracker', initiativeState);
        } else {
          writeLocalToolState(initiativeStorageKey, initiativeState);
        }
      } else if (isSupabaseConfigured) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser?.id) {
          await saveUserToolState(authUser.id, 'initiative_tracker', initiativeState);
        } else {
          writeLocalToolState(initiativeStorageKey, initiativeState);
        }
      } else {
        writeLocalToolState(initiativeStorageKey, initiativeState);
      }
    }

    toast({
      title: 'Sent to tracker',
      description: 'Encounter monsters loaded into the initiative tracker.',
    });
    navigate(destination);
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
      <div className="container mx-auto px-4 py-8" data-testid="encounter-builder">
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

        {!campaignsLoading && manageableCampaigns.length > 0 && (
          <SystemWindow title="ACTIVE CAMPAIGN" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3 items-end">
              <div className="space-y-2">
                <Label htmlFor="encounter-campaign">Campaign</Label>
                <Select value={campaignId ?? ''} onValueChange={handleCampaignChange}>
                  <SelectTrigger id="encounter-campaign">
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {manageableCampaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedCampaign && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={selectedCampaign.access === 'owner' ? 'default' : 'outline'}>
                    {selectedCampaign.access === 'owner' ? 'Owner' : 'Co-System'}
                  </Badge>
                  <Button variant="outline" asChild>
                    <Link to={`/campaigns/${selectedCampaign.id}`}>
                      Open Campaign
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SystemWindow>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Encounter Summary */}
          <div className="lg:col-span-1 space-y-4">
            <SystemWindow title="ENCOUNTER SUMMARY">
              <div className="space-y-4">
                <div>
                  <label htmlFor="encounter-hunter-level" className="text-xs font-display text-muted-foreground mb-1 block">
                    ASCENDANT LEVEL
                  </label>
                  <Input
                    id="encounter-hunter-level"
                    type="number"
                    min="1"
                    max="20"
                    value={hunterLevel || 1}
                    onChange={(e) => {
                      markUserInteraction();
                      setHunterLevel(parseInt(e.target.value) || 1);
                    }}
                    className="font-display"
                  />
                </div>
                <div>
                  <label htmlFor="encounter-hunter-count" className="text-xs font-display text-muted-foreground mb-1 block">
                    ASCENDANT COUNT
                  </label>
                  <Input
                    id="encounter-hunter-count"
                    type="number"
                    min="1"
                    max="10"
                    value={hunterCount || 1}
                    onChange={(e) => {
                      markUserInteraction();
                      setHunterCount(parseInt(e.target.value) || 1);
                    }}
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

                {isCampaignScoped && (
                  <div className="pt-4 border-t border-border space-y-3">
                    <div>
                      <label
                        htmlFor="encounter-name"
                        className="text-xs font-display text-muted-foreground mb-1 block"
                      >
                        ENCOUNTER NAME
                      </label>
                      <Input
                        id="encounter-name"
                        value={encounterName}
                        onChange={(e) => {
                          markUserInteraction();
                          setEncounterName(e.target.value);
                        }}
                        placeholder="Echo Rift skirmish"
                        className="font-display"
                        data-testid="encounter-name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="encounter-notes"
                        className="text-xs font-display text-muted-foreground mb-1 block"
                      >
                        ENCOUNTER NOTES
                      </label>
                      <Input
                        id="encounter-notes"
                        value={encounterDescription}
                        onChange={(e) => {
                          markUserInteraction();
                          setEncounterDescription(e.target.value);
                        }}
                        placeholder="Optional context for the encounter"
                        className="font-display"
                        data-testid="encounter-notes"
                      />
                    </div>
                    <Button
                      onClick={handleSaveEncounter}
                      className="w-full"
                      disabled={saveEncounter.isPending}
                      data-testid="encounter-save"
                    >
                      {saveEncounter.isPending ? 'Saving...' : 'Save Encounter to Campaign'}
                    </Button>
                  </div>
                )}

                <div className="pt-4 border-t border-border space-y-2">
                  <EncounterAIEnhanceButton
                    encounterMonsters={encounterMonsters}
                    hunterLevel={hunterLevel}
                    hunterCount={hunterCount}
                    difficulty={difficulty}
                    totalXP={totalXP}
                    encounterName={encounterName}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={sendToInitiativeTracker}
                    disabled={encounterMonsters.length === 0}
                    data-testid="encounter-send-to-tracker"
                  >
                    Send to Initiative Tracker
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={clearEncounter}
                    disabled={encounterMonsters.length === 0}
                    data-testid="encounter-clear"
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
                    value={searchQuery || ''}
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
                    <button
                      key={monster.id}
                      type="button"
                      className="p-3 rounded border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => addMonster(monster)}
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
                    </button>
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

function EncounterAIEnhanceButton({ encounterMonsters, hunterLevel, hunterCount, difficulty, totalXP, encounterName }: {
  encounterMonsters: Array<{ monster: { name: string; cr?: string | number | null; creature_type?: string | null }; quantity: number }>;
  hunterLevel: number;
  hunterCount: number;
  difficulty: string;
  totalXP: number;
  encounterName: string;
}) {
  const { isEnhancing, enhancedText, enhance } = useAIEnhance();

  if (encounterMonsters.length === 0) return null;

  const handleAIEnhance = async () => {
    const monsterList = encounterMonsters.map(em => `${em.quantity}x ${em.monster.name} (CR ${em.monster.cr || '?'})`).join(', ');
    const seed = `Generate a complete, detailed encounter for a System Ascendant TTRPG campaign.

SEED DATA:
- Encounter Name: ${encounterName || 'Unnamed Encounter'}
- Party: ${hunterCount} Ascendants at Level ${hunterLevel}
- Difficulty: ${difficulty} (${totalXP} XP)
- Monsters: ${monsterList}

Provide ALL of the following sections with full detail:

1. MONSTERS: Full stat references for each monster (AC, HP, key abilities, attacks with to-hit and damage)
2. DIFFICULTY ANALYSIS: XP budget breakdown, adjusted difficulty, deadly threshold analysis
3. TERRAIN: Map layout description with cover positions, hazard zones, elevation, choke points
4. TACTICS: Round-by-round monster strategy, retreat conditions, reinforcement triggers
5. NARRATIVE: Read-aloud intro text, mid-combat events, victory/defeat narration
6. REWARDS: XP per player, loot table with full item stats, story consequences
7. LORE: Why these monsters are here, connection to Rift/Regent activity
8. VARIATIONS: Easy/hard variants with monster swaps`;
    await enhance('encounter', seed);
  };

  return (
    <>
      <Button
        onClick={handleAIEnhance}
        className="w-full gap-2 btn-umbral"
        disabled={isEnhancing}
      >
        {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {isEnhancing ? 'Generating...' : 'AI Encounter Details'}
      </Button>
      {enhancedText && (
        <div className="pt-3 border-t border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-display text-primary">AI-ENHANCED ENCOUNTER</span>
          </div>
          <div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-3 max-h-[400px] overflow-y-auto">
            {enhancedText}
          </div>
        </div>
      )}
    </>
  );
}

export default EncounterBuilder;


