import { useState } from 'react';
import { Wand2, Plus, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePowers } from '@/hooks/usePowers';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AddPowerDialog } from './AddPowerDialog';

export function PowersList({ characterId }: { characterId: string }) {
  const { powers, updatePower, removePower, concentrationPower } = usePowers(characterId);
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

  const handleTogglePrepared = async (power: typeof powers[0]) => {
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
              <div className="space-y-2">
                {levelPowers.map((power) => (
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
                          />
                          <label
                            htmlFor={`prepared-${power.id}`}
                            className="text-xs cursor-pointer"
                          >
                            Prep
                          </label>
                        </div>
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
                ))}
              </div>
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


