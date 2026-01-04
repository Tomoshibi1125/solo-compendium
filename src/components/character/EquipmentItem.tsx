import { useState } from 'react';
import { Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useEquipmentRunes } from '@/hooks/useRunes';
import { cn } from '@/lib/utils';
import type { Database } from '@/integrations/supabase/types';

type Equipment = Database['public']['Tables']['character_equipment']['Row'];

interface EquipmentItemProps {
  item: Equipment;
  onToggleEquipped: () => void;
  onToggleAttuned: () => void;
  onRemove: () => void;
  onInscribeRune: () => void;
  canAttune: boolean;
}

export function EquipmentItem({
  item,
  onToggleEquipped,
  onToggleAttuned,
  onRemove,
  onInscribeRune,
  canAttune,
}: EquipmentItemProps) {
  const { data: runes = [] } = useEquipmentRunes(item.id);

  return (
    <div
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
            {runes.length > 0 && (
              <Badge variant="outline" className="text-xs gap-1">
                <Sparkles className="w-3 h-3" />
                {runes.length} Rune{runes.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
          {runes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {runes.map((ri) => (
                <Badge
                  key={ri.id}
                  variant={ri.is_active ? "default" : "secondary"}
                  className="text-xs gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {ri.rune.name}
                </Badge>
              ))}
            </div>
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
                onCheckedChange={onToggleEquipped}
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
                  onCheckedChange={onToggleAttuned}
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
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs gap-1"
              onClick={onInscribeRune}
            >
              <Sparkles className="w-3 h-3" />
              Rune
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

