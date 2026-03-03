import { useState, useCallback, useEffect, useRef } from 'react';
import { Package, Plus, Shield, Zap, Gem, Heart, Coins, Weight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { SortableList } from '@/components/ui/SortableList';
import { useEquipment } from '@/hooks/useEquipment';
import { useCharacter } from '@/hooks/useCharacters';
import { useToast } from '@/hooks/use-toast';
import { useGlobalDDBeyondIntegration } from '@/hooks/useGlobalDDBeyondIntegration';
import { cn } from '@/lib/utils';
import { AddEquipmentDialog } from './AddEquipmentDialog';
import { EquipmentItem } from './EquipmentItem';
import { calculateTotalWeight, calculateEncumbrance, calculateCarryingCapacity } from '@/lib/encumbrance';
import { EncumbranceWidget } from './EncumbranceWidget';
import { formatMonarchVernacular } from '@/lib/vernacular';
import { useEncumbranceSettings } from '@/hooks/useEncumbranceSettings';
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
  const { ignoreCurrencyWeight, setIgnoreCurrencyWeight, isLoaded } = useEncumbranceSettings(characterId);
  const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
  const ddbEnhancements = usePlayerToolsEnhancements();

  // Weight is now managed inside EncumbranceWidget; keep these for the DDB
  // encumbrance-condition-change side effect below.
  const strScore = character?.abilities?.STR || 10;
  const totalWeight = calculateTotalWeight(equipment, ignoreCurrencyWeight);
  const carryingCapacity = calculateCarryingCapacity(strScore);
  const encumbrance = calculateEncumbrance(totalWeight, carryingCapacity);

  const prevEncumbranceRef = useRef(encumbrance.status);

  useEffect(() => {
    if (prevEncumbranceRef.current !== encumbrance.status) {
      if (encumbrance.status === 'heavy' || encumbrance.status === 'overloaded') {
        ddbEnhancements.trackConditionChange(characterId, `Encumbered: ${encumbrance.status === 'heavy' ? 'Heavy Load' : 'Overloaded'}`, 'add').catch(console.error);
      } else if (prevEncumbranceRef.current === 'heavy' || prevEncumbranceRef.current === 'overloaded') {
        // Removing encumbrance condition when it steps down below heavy
        ddbEnhancements.trackConditionChange(characterId, `Encumbrance`, 'remove').catch(console.error);
      }
      prevEncumbranceRef.current = encumbrance.status;
    }
  }, [encumbrance.status, characterId, ddbEnhancements]);

  const topLevelEquipment = equipment.filter((item) => !item.container_id);
  const equipmentByContainer = equipment.reduce((acc, item) => {
    if (item.container_id) {
      if (!acc[item.container_id]) acc[item.container_id] = [];
      acc[item.container_id].push(item);
    }
    return acc;
  }, {} as Record<string, Equipment[]>);

  const groupedEquipment = topLevelEquipment.reduce((acc, item) => {
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
    } catch {
      // Error handled by hook
    }
  }, [reorderEquipment]);

  const containers = equipment.filter(e => e.is_container);

  const handleChangeContainer = async (item: Equipment, containerId: string | null) => {
    try {
      await updateEquipment({
        id: item.id,
        updates: { container_id: containerId },
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to move equipment.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleEquipped = async (item: Equipment) => {
    const displayName = formatMonarchVernacular(item.name);
    try {
      await updateEquipment({
        id: item.id,
        updates: { is_equipped: !item.is_equipped },
      });

      ddbEnhancements.trackInventoryChange(
        characterId,
        item.name,
        item.is_equipped ? 'unequip' : 'equip'
      ).catch(console.error);

      toast({
        title: item.is_equipped ? 'Unequipped' : 'Equipped',
        description: `${displayName} has been ${item.is_equipped ? 'unequipped' : 'equipped'}.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update equipment.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleAttuned = async (item: Equipment) => {
    const displayName = formatMonarchVernacular(item.name);
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

      ddbEnhancements.trackConditionChange(
        characterId,
        `Attuned: ${item.name}`,
        item.is_attuned ? 'remove' : 'add'
      ).catch(console.error);

      toast({
        title: item.is_attuned ? 'Attunement removed' : 'Attuned',
        description: `${displayName} has been ${item.is_attuned ? 'unattuned' : 'attuned'}.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update attunement.',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = async (item: Equipment) => {
    const displayName = formatMonarchVernacular(item.name);
    if (!confirm(`Remove ${displayName} from inventory?`)) return;

    try {
      await removeEquipment(item.id);

      ddbEnhancements.trackInventoryChange(
        characterId,
        item.name,
        'remove'
      ).catch(console.error);

      toast({
        title: 'Removed',
        description: `${displayName} has been removed.`,
      });
    } catch {
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
        {/* Weight & Encumbrance — rendered by EncumbranceWidget */}
        {isLoaded && (
          <div className="space-y-2">
            <div className="flex items-center justify-end gap-2">
              <Switch
                id="ignore-coin"
                checked={ignoreCurrencyWeight}
                onCheckedChange={setIgnoreCurrencyWeight}
                className="scale-75"
              />
              <Label htmlFor="ignore-coin" className="text-[10px] text-muted-foreground leading-none cursor-pointer">
                Ignore Coin Weight
              </Label>
            </div>
            <EncumbranceWidget characterId={characterId} />
          </div>
        )}

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
                      onToggleEquipped={handleToggleEquipped}
                      onToggleAttuned={handleToggleAttuned}
                      onRemove={handleRemove}
                      onChangeContainer={handleChangeContainer}
                      containers={containers.filter(c => c.id !== item.id)} // Prevent putting a container in itself
                      canAttune={canAttune}
                      nestedItems={equipmentByContainer[item.id] || []}
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

    </SystemWindow>
  );
}


