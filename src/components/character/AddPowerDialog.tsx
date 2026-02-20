import { useMemo, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePowers } from '@/hooks/usePowers';
import { useToast } from '@/hooks/use-toast';
import { formatMonarchVernacular, normalizeMonarchSearch } from '@/lib/vernacular';
import { useCampaignByCharacterId } from '@/hooks/useCampaigns';
import { filterRowsBySourcebookAccess } from '@/lib/sourcebookAccess';
import { useCharacter } from '@/hooks/useCharacters';
import { getCantripsKnownLimit, getSpellsKnownLimit } from '@/lib/characterCalculations';
import { getMaxPowerLevelForJobAtLevel } from '@/lib/characterCreation';

export function AddPowerDialog({
  open,
  onOpenChange,
  characterId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characterId: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const { addPower, removePower, powers: characterPowers } = usePowers(characterId);
  const { toast } = useToast();
  const { data: character } = useCharacter(characterId);
  const { data: characterCampaign } = useCampaignByCharacterId(characterId);
  const campaignId = characterCampaign?.id ?? null;

  const [replaceTarget, setReplaceTarget] = useState<null | {
    powerToLearn: { name: string; power_level: number };
    kind: 'cantrip' | 'known';
    limit: number;
  }>(null);

  const maxPowerLevel = character ? getMaxPowerLevelForJobAtLevel(character.job, character.level) : 0;

  const { data: powers = [], isLoading } = useQuery({
    queryKey: ['compendium-powers', characterId, campaignId, searchQuery, character?.job, character?.level],
    queryFn: async () => {
      if (!character?.job) return [];

      const regentOverlayIds = Array.isArray((character as any).regent_overlays)
        ? ((character as any).regent_overlays as string[])
        : Array.isArray((character as any).monarch_overlays)
          ? ((character as any).monarch_overlays as string[])
          : [];
      let regentNames: string[] = [];
      if (regentOverlayIds.length > 0) {
        const supabaseAny = supabase as any;
        const canonicalResult = await supabaseAny
          .from('compendium_regents')
          .select('name')
          .in('id', regentOverlayIds);

        let regentRows = canonicalResult.data as Array<{ name?: string | null }> | null;
        if (canonicalResult.error) {
          const fallbackResult = await supabase
            .from('compendium_monarchs')
            .select('name')
            .in('id', regentOverlayIds);
          if (fallbackResult.error) throw fallbackResult.error;
          regentRows = fallbackResult.data as Array<{ name?: string | null }> | null;
        }

        regentNames = (regentRows || [])
          .map((row) => row?.name)
          .filter((name): name is string => typeof name === 'string' && name.length > 0);
      }

      const orParts: string[] = [];
      const escapeValue = (value: string) => value.replaceAll('"', '\\"');

      if (character.job) {
        orParts.push(`job_names.cs.{"${escapeValue(character.job)}"}`);
      }
      if (character.path) {
        orParts.push(`path_names.cs.{"${escapeValue(character.path)}"}`);
      }
      for (const regentName of regentNames) {
        orParts.push(`regent_names.cs.{"${escapeValue(regentName)}"}`);
      }

      let query = supabase
        .from('compendium_powers')
        .select('*')
        .or(orParts.join(','))
        .lte('power_level', maxPowerLevel)
        .limit(20);

      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        const canonicalQuery = normalizeMonarchSearch(trimmedQuery);
        query = query.ilike('name', `%${canonicalQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return filterRowsBySourcebookAccess(
        data || [],
        (power) => power.source_book,
        { campaignId }
      );
    },
    enabled: open && !!character?.job,
  });

  const knownNonCantripCount = useMemo(
    () => characterPowers.filter((p) => (p.power_level ?? 0) > 0).length,
    [characterPowers]
  );
  const knownCantripCount = useMemo(
    () => characterPowers.filter((p) => (p.power_level ?? 0) === 0).length,
    [characterPowers]
  );

  const replaceEligiblePowers = useMemo(() => {
    if (!replaceTarget) return [];
    const wantedLevel = replaceTarget.kind === 'cantrip' ? 0 : 1;
    return characterPowers
      .filter((p) => {
        const level = p.power_level ?? 0;
        return wantedLevel === 0 ? level === 0 : level > 0;
      })
      .sort((a, b) => (a.power_level ?? 0) - (b.power_level ?? 0) || a.name.localeCompare(b.name));
  }, [characterPowers, replaceTarget]);

  const handleAdd = async (power: typeof powers[0]) => {
    const displayName = formatMonarchVernacular(power.name);
    try {
      if (character?.job) {
        if (power.power_level === 0) {
          const cantripLimit = getCantripsKnownLimit(character.job, character.level);
          if (cantripLimit !== null && knownCantripCount >= cantripLimit) {
            setReplaceTarget({
              powerToLearn: { name: power.name, power_level: power.power_level },
              kind: 'cantrip',
              limit: cantripLimit,
            });
            toast({
              title: 'Cantrip Limit Reached',
              description: `You can only know ${cantripLimit} cantrips. Replace one to learn ${displayName}.`,
              variant: 'destructive',
            });
            return;
          }
        } else {
          const knownLimit = getSpellsKnownLimit(character.job, character.level);
          if (knownLimit !== null && knownNonCantripCount >= knownLimit) {
            setReplaceTarget({
              powerToLearn: { name: power.name, power_level: power.power_level },
              kind: 'known',
              limit: knownLimit,
            });
            toast({
              title: 'Known Limit Reached',
              description: `You can only know ${knownLimit} powers at this level. Replace one to learn ${displayName}.`,
              variant: 'destructive',
            });
            return;
          }
        }
      }

      await addPower({
        character_id: characterId,
        name: power.name,
        power_level: power.power_level,
        source: 'Compendium',
        casting_time: power.casting_time || null,
        range: power.range || null,
        duration: power.duration || null,
        concentration: power.concentration || false,
        description: power.description || null,
        higher_levels: power.higher_levels || null,
        is_prepared: false,
        is_known: true,
      });

      toast({
        title: 'Power added',
        description: `${displayName} has been added to your powers.`,
      });

      onOpenChange(false);
      setSearchQuery('');
      setReplaceTarget(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add power.',
        variant: 'destructive',
      });
    }
  };

  const handleReplace = async (existingPowerId: string) => {
    if (!replaceTarget) return;

    const { powerToLearn } = replaceTarget;
    const displayName = formatMonarchVernacular(powerToLearn.name);

    try {
      await removePower(existingPowerId);

      await addPower({
        character_id: characterId,
        name: powerToLearn.name,
        power_level: powerToLearn.power_level,
        source: 'Compendium',
        casting_time: null,
        range: null,
        duration: null,
        concentration: false,
        description: null,
        higher_levels: null,
        is_prepared: false,
        is_known: true,
      });

      toast({
        title: 'Power replaced',
        description: `${displayName} has been learned.`,
      });

      setReplaceTarget(null);
      onOpenChange(false);
      setSearchQuery('');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to replace power.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Power</DialogTitle>
          <DialogDescription>
            Search and add powers from the compendium
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {replaceTarget && (
            <div className="p-3 rounded-lg border bg-muted/30">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-heading font-semibold">
                    Replace a {replaceTarget.kind === 'cantrip' ? 'Cantrip' : 'Known Power'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Limit: {replaceTarget.limit}. Select one to replace with{' '}
                    {formatMonarchVernacular(replaceTarget.powerToLearn.name)}.
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplaceTarget(null)}
                >
                  Cancel
                </Button>
              </div>

              <div className="mt-3 space-y-2 max-h-[180px] overflow-y-auto">
                {replaceEligiblePowers.length === 0 ? (
                  <div className="text-xs text-muted-foreground">
                    No eligible powers to replace.
                  </div>
                ) : (
                  replaceEligiblePowers.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="w-full text-left p-2 rounded-md border bg-background/40 hover:bg-background/70 transition-colors"
                      onClick={() => handleReplace(p.id)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-heading font-semibold">
                          {formatMonarchVernacular(p.name)}
                        </div>
                        {(p.power_level ?? 0) > 0 ? (
                          <Badge variant="secondary" className="text-xs">
                            Level {p.power_level}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Cantrip
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search powers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : powers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No powers found' : 'Search for powers to add'}
              </div>
            ) : (
              powers.map((power) => (
                <div
                  key={power.id}
                  className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-semibold">
                          {formatMonarchVernacular(power.name)}
                        </span>
                        {power.power_level > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Level {power.power_level}
                          </Badge>
                        )}
                        {power.concentration && (
                          <Badge variant="destructive" className="text-xs">Concentration</Badge>
                        )}
                      </div>
                      {power.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {formatMonarchVernacular(power.description)}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                        {power.casting_time && <span>{formatMonarchVernacular(power.casting_time)}</span>}
                        {power.range && <span>{formatMonarchVernacular(power.range)}</span>}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(power)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


