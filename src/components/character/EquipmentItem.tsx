import { memo } from 'react';
import { Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useEquipmentRunes } from '@/hooks/useRunes';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular } from '@/lib/vernacular';
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

function EquipmentItemComponent({
  item,
  onToggleEquipped,
  onToggleAttuned,
  onRemove,
  onInscribeRune,
  canAttune,
}: EquipmentItemProps) {
  const { data: runes = [] } = useEquipmentRunes(item.id);
  const displayName = formatMonarchVernacular(item.name);
  const displayDescription = item.description ? formatMonarchVernacular(item.description) : null;
  const displayRarity = item.rarity ? formatMonarchVernacular(item.rarity) : null;

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
            <span className="font-heading font-semibold">{displayName}</span>
            {displayRarity && (
              <Badge variant="secondary" className="text-xs">
                {displayRarity}
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
          {displayDescription && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {displayDescription}
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
                  {formatMonarchVernacular(ri.rune.name)}
                </Badge>
              ))}
            </div>
          )}
          {item.properties && item.properties.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.properties.slice(0, 3).map((prop, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {formatMonarchVernacular(prop)}
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
                aria-label={`Inscribe rune on ${displayName}`}
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
            aria-label={`Remove ${displayName}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export const EquipmentItem = memo(EquipmentItemComponent, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.is_equipped === nextProps.item.is_equipped &&
    prevProps.item.is_attuned === nextProps.item.is_attuned &&
    prevProps.canAttune === nextProps.canAttune &&
    prevProps.item.properties?.length === nextProps.item.properties?.length
  );
});
