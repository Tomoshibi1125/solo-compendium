import { useState } from 'react';
import { Coins, Plus, Minus, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { useEquipment } from '@/hooks/useEquipment';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const CURRENCY_TYPES = [
  { id: 'gold', name: 'Gold', symbol: 'GP', color: 'text-yellow-400' },
  { id: 'silver', name: 'Silver', symbol: 'SP', color: 'text-gray-300' },
  { id: 'copper', name: 'Copper', symbol: 'CP', color: 'text-orange-400' },
];

export function CurrencyManager({ characterId }: { characterId: string }) {
  const { equipment, updateEquipment, addEquipment } = useEquipment(characterId);
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Get currency items
  const currencyItems = equipment.filter(e => e.item_type === 'currency');

  // Get or create currency for each type
  const getCurrency = (type: string) => {
    return currencyItems.find(c => c.name.toLowerCase().includes(type)) || null;
  };

  const handleAddCurrency = async (type: string, amount: number) => {
    const existing = getCurrency(type);
    const currencyType = CURRENCY_TYPES.find(t => t.id === type);
    if (!currencyType) return;

    try {
      if (existing) {
        const currentQuantity = existing.quantity || 0;
        await updateEquipment({
          id: existing.id,
          updates: { quantity: currentQuantity + amount },
        });
        toast({
          title: 'Currency updated',
          description: `Added ${amount} ${currencyType.symbol}`,
        });
      } else {
        await addEquipment({
          character_id: characterId,
          name: currencyType.name,
          item_type: 'currency',
          quantity: amount,
          weight: 0.02, // 50 coins per pound
          description: `Rift rewards - ${currencyType.name} coins`,
        });
        toast({
          title: 'Currency added',
          description: `Added ${amount} ${currencyType.symbol}`,
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update currency.',
        variant: 'destructive',
      });
    }
  };

  const handleSetCurrency = async (type: string, amount: number) => {
    const existing = getCurrency(type);
    const currencyType = CURRENCY_TYPES.find(t => t.id === type);
    if (!currencyType) return;

    try {
      if (existing) {
        await updateEquipment({
          id: existing.id,
          updates: { quantity: amount },
        });
      } else {
        await addEquipment({
          character_id: characterId,
          name: currencyType.name,
          item_type: 'currency',
          quantity: amount,
          weight: 0.02,
          description: `Rift rewards - ${currencyType.name} coins`,
        });
      }
      setEditing(null);
      toast({
        title: 'Currency updated',
        description: `Set to ${amount} ${currencyType.symbol}`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update currency.',
        variant: 'destructive',
      });
    }
  };

  return (
    <SystemWindow title="RIFT REWARDS">
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground mb-4">
          Track currency earned from Rift completions. In the post-reset world, Ascendants are rewarded by the System.
        </p>
        {CURRENCY_TYPES.map((type) => {
          const currency = getCurrency(type.id);
          const quantity = currency?.quantity || 0;
          const isEditing = editing === type.id;

          return (
            <div
              key={type.id}
              className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Coins className={cn("w-5 h-5", type.color)} />
                <div>
                  <div className="font-heading font-semibold">{type.name}</div>
                  <div className="text-xs text-muted-foreground">{type.symbol}</div>
                </div>
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-20 h-8"
                    min="0"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSetCurrency(type.id, parseInt(editValue) || 0);
                      } else if (e.key === 'Escape') {
                        setEditing(null);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSetCurrency(type.id, parseInt(editValue) || 0)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-display text-lg font-bold">{quantity}</div>
                    <div className="text-xs text-muted-foreground">
                      {(quantity * 0.02).toFixed(1)} lbs
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => handleAddCurrency(type.id, -1)}
                      disabled={quantity === 0}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => handleAddCurrency(type.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => {
                        setEditing(type.id);
                        setEditValue(quantity.toString());
                      }}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SystemWindow>
  );
}

