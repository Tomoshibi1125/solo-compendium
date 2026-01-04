import { useState } from 'react';
import { Package, Plus, Trash2, Shield, Zap, Gem, Heart, Coins, Weight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useEquipment } from '@/hooks/useEquipment';
import { useCharacter } from '@/hooks/useCharacters';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AddEquipmentDialog } from './AddEquipmentDialog';
import { CompendiumLink } from './CompendiumLink';
import { calculateTotalWeight, calculateEncumbrance, calculateCarryingCapacity } from '@/lib/encumbrance';
import type { Database } from '@/integrations/supabase/types';

type Equipment = Database['public']['Tables']['character_equipment']['Row'];

const ITEM_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  weapon: Zap,
  armor: Shield,
  relic: Gem,
  consumable: Heart,
  gear: Package,
  currency: Coins,
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  weapon: 'Weapons',
  armor: 'Armor',
  relic: 'Relics',
  consumable: 'Consumables',
  gear: 'Gear',
  currency: 'Currency',
};

export function EquipmentList({ characterId }: { characterId: string }) {
  const { equipment, removeEquipment, updateEquipment, attunedCount, canAttune } = useEquipment(characterId);
  const { data: character } = useCharacter(characterId);
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Calculate weight and encumbrance
  const strScore = character?.abilities?.STR || 10;
  const totalWeight = calculateTotalWeight(equipment);
  const carryingCapacity = calculateCarryingCapacity(strScore);
  const encumbrance = calculateEncumbrance(totalWeight, carryingCapacity);

  const groupedEquipment = equipment.reduce((acc, item) => {
    const type = item.item_type || 'gear';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, Equipment[]>);

  const handleToggleEquipped = async (item: Equipment) => {
    try {
      await updateEquipment({
        id: item.id,
        updates: { is_equipped: !item.is_equipped },
      });
      toast({
        title: item.is_equipped ? 'Unequipped' : 'Equipped',
        description: `${item.name} has been ${item.is_equipped ? 'unequipped' : 'equipped'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update equipment.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleAttuned = async (item: Equipment) => {
    if (!item.is_attuned && !canAttune) {
      toast({
        title: 'Attunement limit reached',
        description: 'You can only attune to 3 items at once.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateEquipment({
        id: item.id,
        updates: { is_attuned: !item.is_attuned },
      });
      toast({
        title: item.is_attuned ? 'Attunement removed' : 'Attuned',
        description: `${item.name} has been ${item.is_attuned ? 'unattuned' : 'attuned'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update attunement.',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = async (item: Equipment) => {
    if (!confirm(`Remove ${item.name} from inventory?`)) return;

    try {
      await removeEquipment(item.id);
      toast({
        title: 'Removed',
        description: `${item.name} has been removed.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove equipment.',
        variant: 'destructive',
      });
    }
  };

  return (
    <SystemWindow title="EQUIPMENT">
      <div className="space-y-4">
        {/* Weight & Encumbrance Display */}
        <div className="p-3 rounded-lg border border-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Weight className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-display text-muted-foreground">CARRYING CAPACITY</span>
            </div>
            <span className={cn("text-xs font-display font-semibold", encumbrance.statusColor)}>
              {encumbrance.statusMessage}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    encumbrance.status === 'unencumbered' && "bg-green-500",
                    encumbrance.status === 'light' && "bg-blue-500",
                    encumbrance.status === 'medium' && "bg-yellow-500",
                    encumbrance.status === 'heavy' && "bg-orange-500",
                    encumbrance.status === 'overloaded' && "bg-red-500"
                  )}
                  style={{
                    width: `${Math.min((totalWeight / carryingCapacity) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-muted-foreground">
              {totalWeight.toFixed(1)} / {carryingCapacity} lbs
            </span>
            {encumbrance.status === 'overloaded' && (
              <div className="flex items-center gap-1 text-red-400">
                <AlertTriangle className="w-3 h-3" />
                <span>Overloaded!</span>
              </div>
            )}
          </div>
          {encumbrance.status === 'heavy' || encumbrance.status === 'overloaded' ? (
            <p className="text-xs text-muted-foreground mt-1">
              Speed penalty: {encumbrance.status === 'heavy' ? '-10 ft' : '-20 ft'}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Attuned: {attunedCount}/3
          </div>
          <Button onClick={() => setAddDialogOpen(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Equipment
          </Button>
        </div>

        {equipment.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No equipment yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddDialogOpen(true)}
              className="mt-4"
            >
              Add your first item
            </Button>
          </div>
        ) : (
          Object.entries(groupedEquipment).map(([type, items]) => {
            const Icon = ITEM_TYPE_ICONS[type] || Package;
            return (
              <div key={type} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-heading text-muted-foreground">
                  <Icon className="w-4 h-4" />
                  {ITEM_TYPE_LABELS[type] || type}
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "p-3 rounded-lg border bg-muted/30",
                        item.is_equipped && "border-primary/50 bg-primary/5"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-heading font-semibold">{item.name}</span>
                            {item.rarity && (
                              <Badge variant="secondary" className="text-xs">
                                {item.rarity}
                              </Badge>
                            )}
                            {item.is_equipped && (
                              <Badge variant="default" className="text-xs">Equipped</Badge>
                            )}
                            {item.is_attuned && (
                              <Badge variant="destructive" className="text-xs">Attuned</Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          {item.properties && item.properties.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.properties.slice(0, 3).map((prop, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {prop}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`equipped-${item.id}`}
                                checked={item.is_equipped}
                                onCheckedChange={() => handleToggleEquipped(item)}
                              />
                              <label
                                htmlFor={`equipped-${item.id}`}
                                className="text-xs cursor-pointer"
                              >
                                Equip
                              </label>
                            </div>
                            {item.requires_attunement && (
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`attuned-${item.id}`}
                                  checked={item.is_attuned}
                                  onCheckedChange={() => handleToggleAttuned(item)}
                                  disabled={!item.is_attuned && !canAttune}
                                />
                                <label
                                  htmlFor={`attuned-${item.id}`}
                                  className="text-xs cursor-pointer"
                                >
                                  Attune
                                </label>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemove(item)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddEquipmentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        characterId={characterId}
      />
    </SystemWindow>
  );
}


