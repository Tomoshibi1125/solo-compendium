import { useState, useCallback } from 'react';
import { Wand2, Plus, Trash2, Filter, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortableList } from '@/components/ui/SortableList';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePowers } from '@/hooks/usePowers';
import { useToast } from '@/hooks/use-toast';
import { useCharacter } from '@/hooks/useCharacters';
import { useSpellSlots, useUpdateSpellSlot } from '@/hooks/useSpellSlots';
import { getSpellcastingAbility, getSpellsKnownLimit, getSpellsPreparedLimit, getAbilityModifier } from '@/lib/characterCalculations';
import { cn } from '@/lib/utils';
import { AddPowerDialog } from './AddPowerDialog';

function CompendiumLink({ type, id, name, className }: { type: string; id: string; name: string; className?: string }) {
  return (
    <Link to={`/compendium/${type}/${id}`} className={className}>
      {name}
    </Link>
  );
}

export function PowersList({ characterId }: { characterId: string }) {
  const { powers, updatePower, removePower, reorderPowers, concentrationPower } = usePowers(characterId);
  const { data: character } = useCharacter(characterId);
  const { data: spellSlots = [] } = useSpellSlots(
    characterId,
    character?.job || null,
    character?.level || 1
  );
  const updateSpellSlot = useUpdateSpellSlot();
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterPrepared, setFilterPrepared] = useState<string>('all');

  // Get compendium power IDs for linking
  const { data: compendiumPowers = [] } = useQuery({
    queryKey: ['compendium-powers-lookup'],
    queryFn: async () => {
      const { data } = await supabase
        .from('compendium_powers')
        .select('id, name');
      return data || [];
    },
  });

  const getPowerId = (powerName: string) => {
    return compendiumPowers.find(p => p.name === powerName)?.id;
  };

  const filteredPowers = powers.filter(power => {
    if (filterLevel !== 'all' && power.power_level.toString() !== filterLevel) return false;
    if (filterPrepared === 'prepared' && !power.is_prepared) return false;
    if (filterPrepared === 'unprepared' && power.is_prepared) return false;
    return true;
  });

  const groupedPowers = filteredPowers.reduce((acc, power) => {
    const level = power.power_level === 0 ? 'Cantrip' : `Level ${power.power_level}`;
    if (!acc[level]) acc[level] = [];
    acc[level].push(power);
    return acc;
  }, {} as Record<string, typeof powers>);

  // Calculate spell limits
  const spellcastingAbility = character ? getSpellcastingAbility(character.job) : null;
  const abilityModifier = character && spellcastingAbility
    ? getAbilityModifier(character.abilities?.[spellcastingAbility] || 10)
    : 0;
  const spellsPreparedLimit = character ? getSpellsPreparedLimit(character.job, character.level, abilityModifier) : null;
  const spellsKnownLimit = character ? getSpellsKnownLimit(character.job, character.level) : null;
  const preparedCount = powers.filter(p => p.is_prepared).length;
  const knownCount = powers.length;
  const isOverPreparedLimit = spellsPreparedLimit !== null && preparedCount > spellsPreparedLimit;
  const isOverKnownLimit = spellsKnownLimit !== null && knownCount > spellsKnownLimit;

  const handleReorderGroup = useCallback(async (level: string, newOrder: typeof powers) => {
    try {
      const updates = newOrder.map((power, index) => ({
        id: power.id,
        display_order: index,
      }));
      await reorderPowers(updates);
    } catch (error) {
      // Error handled by hook
    }
  }, [reorderPowers]);

  const handleTogglePrepared = async (power: typeof powers[0]) => {
    // Check if preparing would exceed limit
    if (!power.is_prepared && spellsPreparedLimit !== null) {
      if (preparedCount >= spellsPreparedLimit) {
        toast({
          title: 'Prepared Limit Reached',
          description: `You can only prepare ${spellsPreparedLimit} spells. Unprepare another spell first.`,
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      await updatePower({
        id: power.id,
        updates: { is_prepared: !power.is_prepared },
      });
      toast({
        title: power.is_prepared ? 'Unprepared' : 'Prepared',
        description: `${power.name} has been ${power.is_prepared ? 'unprepared' : 'prepared'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update power.',
        variant: 'destructive',
      });
    }
  };

  const handleCastSpell = async (power: typeof powers[0]) => {
    // Cantrips don't use spell slots
    if (power.power_level === 0) {
      toast({
        title: 'Cantrip Cast',
        description: `${power.name} is cast without using a spell slot.`,
      });
      return;
    }

    // Find available spell slot
    const slot = spellSlots.find(s => s.level === power.power_level && s.current > 0);
    
    if (!slot) {
      toast({
        title: 'No Spell Slots Available',
        description: `You don't have any Tier ${power.power_level} spell slots available.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateSpellSlot.mutateAsync({
        characterId,
        spellLevel: power.power_level,
        current: slot.current - 1,
      });
      toast({
        title: 'Spell Cast',
        description: `${power.name} cast! Used 1 Tier ${power.power_level} spell slot.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to use spell slot.',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = async (power: typeof powers[0]) => {
    if (!confirm(`Remove ${power.name}?`)) return;

    try {
      await removePower(power.id);
      toast({
        title: 'Removed',
        description: `${power.name} has been removed.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove power.',
        variant: 'destructive',
      });
    }
  };

  return (
    <SystemWindow title="POWERS">
      <div className="space-y-4">
        {/* Spell Limits Display */}
        {(spellsPreparedLimit !== null || spellsKnownLimit !== null) && (
          <div className="p-2 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between text-sm">
              {spellsPreparedLimit !== null && (
                <div className={cn(
                  "flex items-center gap-2",
                  isOverPreparedLimit && "text-destructive"
                )}>
                  <span className="text-muted-foreground">Prepared:</span>
                  <span className={cn("font-semibold", isOverPreparedLimit && "text-destructive")}>
                    {preparedCount} / {spellsPreparedLimit}
                  </span>
                  {isOverPreparedLimit && (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  )}
                </div>
              )}
              {spellsKnownLimit !== null && (
                <div className={cn(
                  "flex items-center gap-2",
                  isOverKnownLimit && "text-destructive"
                )}>
                  <span className="text-muted-foreground">Known:</span>
                  <span className={cn("font-semibold", isOverKnownLimit && "text-destructive")}>
                    {knownCount} / {spellsKnownLimit}
                  </span>
                  {isOverKnownLimit && (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  )}
                </div>
              )}
            </div>
            {(isOverPreparedLimit || isOverKnownLimit) && (
              <div className="mt-2 text-xs text-destructive">
                Warning: You exceed the limit for {isOverPreparedLimit ? 'prepared' : ''} {isOverPreparedLimit && isOverKnownLimit ? 'and ' : ''} {isOverKnownLimit ? 'known' : ''} spells.
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="0">Cantrip</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                  <SelectItem key={level} value={level.toString()}>
                    Level {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPrepared} onValueChange={setFilterPrepared}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="prepared">Prepared</SelectItem>
                <SelectItem value="unprepared">Unprepared</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setAddDialogOpen(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Power
          </Button>
        </div>

        {concentrationPower && (
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="destructive">Concentrating</Badge>
              <span>{concentrationPower.name}</span>
            </div>
          </div>
        )}

        {powers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wand2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No powers yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddDialogOpen(true)}
              className="mt-4"
            >
              Add your first power
            </Button>
          </div>
        ) : filteredPowers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No powers match the current filters
          </div>
        ) : (
          Object.entries(groupedPowers).map(([level, levelPowers]) => (
            <div key={level} className="space-y-2">
              <div className="text-sm font-heading text-muted-foreground">
                {level}
              </div>
              <SortableList
                items={levelPowers}
                onReorder={(newOrder) => handleReorderGroup(level, newOrder)}
                renderItem={(power) => (
                  <div
                    key={power.id}
                    className={cn(
                      "p-3 rounded-lg border bg-muted/30",
                      power.is_prepared && "border-primary/50 bg-primary/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getPowerId(power.name) ? (
                          <CompendiumLink
                            type="powers"
                            id={getPowerId(power.name)!}
                            name={power.name}
                            className="font-heading font-semibold hover:text-primary"
                          />
                        ) : (
                          <span className="font-heading font-semibold">{power.name}</span>
                        )}
                          {power.power_level > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Level {power.power_level}
                            </Badge>
                          )}
                          {power.is_prepared && (
                            <Badge variant="default" className="text-xs">Prepared</Badge>
                          )}
                          {power.concentration && (
                            <Badge variant="destructive" className="text-xs">Concentration</Badge>
                          )}
                          {power.source && (
                            <Badge variant="outline" className="text-xs">{power.source}</Badge>
                          )}
                        </div>
                        {power.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {power.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                          {power.casting_time && <span>Casting: {power.casting_time}</span>}
                          {power.range && <span>Range: {power.range}</span>}
                          {power.duration && <span>Duration: {power.duration}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`prepared-${power.id}`}
                            checked={power.is_prepared}
                            onCheckedChange={() => handleTogglePrepared(power)}
                            disabled={!power.is_prepared && isOverPreparedLimit}
                          />
                          <label
                            htmlFor={`prepared-${power.id}`}
                            className="text-xs cursor-pointer"
                          >
                            Prep
                          </label>
                        </div>
                        {power.is_prepared && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCastSpell(power)}
                            disabled={
                              power.power_level > 0 &&
                              !spellSlots.find(
                                (s) => s.level === power.power_level && s.current > 0
                              )
                            }
                            className="text-xs"
                          >
                            Cast
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemove(power)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                itemClassName="mb-2"
              />
            </div>
          ))
        )}
      </div>

      <AddPowerDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        characterId={characterId}
      />
    </SystemWindow>
  );
}


