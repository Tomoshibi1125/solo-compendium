import { useState, useCallback } from 'react';
import { Package, Plus, Trash2, Shield, Zap, Gem, Heart, Coins, Weight, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { VirtualList } from '@/components/ui/VirtualList';
import { SortableList } from '@/components/ui/SortableList';
import { useEquipment } from '@/hooks/useEquipment';
import { useCharacter } from '@/hooks/useCharacters';
import { useEquipmentRunes, useInscribeRune } from '@/hooks/useRunes';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AddEquipmentDialog } from './AddEquipmentDialog';
import { InscribeRuneDialog } from './InscribeRuneDialog';
import { EquipmentItem } from './EquipmentItem';
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
  const { equipment, removeEquipment, updateEquipment, reorderEquipment, attunedCount, canAttune } = useEquipment(characterId);
  const { data: character } = useCharacter(characterId);
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [inscribeDialogOpen, setInscribeDialogOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

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

  const handleReorderGroup = useCallback(async (type: string, newOrder: Equipment[]) => {
    try {
      // Update display_order for all items in this group
      const updates = newOrder.map((item, index) => ({
        id: item.id,
        display_order: index,
      }));
      await reorderEquipment(updates);
    } catch (error) {
      // Error handled by hook
    }
  }, [reorderEquipment]);

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
                <SortableList
                  items={items}
                  onReorder={(newOrder) => handleReorderGroup(type, newOrder)}
                  renderItem={(item) => (
                    <EquipmentItem
                      key={item.id}
                      item={item}
                      onToggleEquipped={() => handleToggleEquipped(item)}
                      onToggleAttuned={() => handleToggleAttuned(item)}
                      onRemove={() => handleRemove(item)}
                      onInscribeRune={() => {
                        setSelectedEquipmentId(item.id);
                        setInscribeDialogOpen(true);
                      }}
                      canAttune={canAttune}
                    />
                  )}
                  itemClassName="mb-2"
                />
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

      {inscribeDialogOpen && selectedEquipmentId && (
        <InscribeRuneDialog
          characterId={characterId}
          equipmentId={selectedEquipmentId}
          open={inscribeDialogOpen}
          onOpenChange={setInscribeDialogOpen}
          onSuccess={() => {
            setInscribeDialogOpen(false);
            setSelectedEquipmentId(null);
          }}
        />
      )}
    </SystemWindow>
  );
}


