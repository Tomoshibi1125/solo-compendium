import { useSpellSlots, useUpdateSpellSlot } from '@/hooks/useSpellSlots';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

interface SpellSlotsDisplayProps {
  characterId: string;
  job: string | null;
  level: number;
  className?: string;
}

export function SpellSlotsDisplay({ characterId, job, level, className }: SpellSlotsDisplayProps) {
  const { data: slots = [], isLoading } = useSpellSlots(characterId, job, level);
  const updateSlot = useUpdateSpellSlot();

  if (isLoading) {
    return (
      <SystemWindow title="POWER SLOTS" className={className}>
        <div className="text-sm text-muted-foreground">Loading...</div>
      </SystemWindow>
    );
  }

  if (slots.length === 0) {
    return null; // Don't show if no spell slots
  }

  const handleSlotChange = async (spellLevel: number, delta: number) => {
    const slot = slots.find(s => s.level === spellLevel);
    if (!slot) return;

    const newCurrent = Math.max(0, Math.min(slot.max, slot.current + delta));
    
    try {
      await updateSlot.mutateAsync({
        characterId,
        spellLevel,
        current: newCurrent,
      });
    } catch (error) {
      logger.error('Failed to update spell slot:', error);
    }
  };

  return (
    <SystemWindow title="POWER SLOTS" className={className}>
      <div className="space-y-3">
        {slots.map((slot) => (
          <div
            key={slot.level}
            className="flex items-center justify-between p-2 rounded border border-border bg-muted/20"
          >
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-arise">
                Tier {slot.level}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {slot.current} / {slot.max}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleSlotChange(slot.level, -1)}
                disabled={slot.current === 0}
                aria-label={`Decrease tier ${slot.level} slots`}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleSlotChange(slot.level, 1)}
                disabled={slot.current >= slot.max}
                aria-label={`Increase tier ${slot.level} slots`}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        {slots.length > 0 && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            Slots recover on long rest. Some classes recover slots on short rest.
          </div>
        )}
      </div>
    </SystemWindow>
  );
}

