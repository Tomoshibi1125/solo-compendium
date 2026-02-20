import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Weight } from 'lucide-react';
import type { EncumbranceStatus } from '@/lib/encumbrance';

interface EncumbranceBarProps {
  encumbrance: EncumbranceStatus;
}

const STATUS_STYLES: Record<EncumbranceStatus['status'], { bar: string; text: string }> = {
  unencumbered: { bar: 'bg-green-500', text: 'text-green-600' },
  light: { bar: 'bg-blue-500', text: 'text-blue-600' },
  medium: { bar: 'bg-yellow-500', text: 'text-yellow-600' },
  heavy: { bar: 'bg-orange-500', text: 'text-orange-600' },
  overloaded: { bar: 'bg-red-500', text: 'text-red-600' },
};

export function EncumbranceBar({ encumbrance }: EncumbranceBarProps) {
  const pct = Math.min(100, (encumbrance.totalWeight / encumbrance.carryingCapacity) * 100);
  const style = STATUS_STYLES[encumbrance.status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Weight className="h-3 w-3" /> Carry Weight
              </span>
              <span className={cn('font-mono font-medium', style.text)}>
                {encumbrance.totalWeight} / {encumbrance.carryingCapacity} lb
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', style.bar)}
                // eslint-disable-next-line react/forbid-dom-props -- dynamic width requires inline style
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-left">
          <p className="font-semibold text-sm">{encumbrance.statusMessage}</p>
          <p className="text-xs">Carrying: {encumbrance.totalWeight} lb</p>
          <p className="text-xs">Capacity: {encumbrance.carryingCapacity} lb (STR × 15)</p>
          <p className="text-xs">Push/Drag/Lift: {encumbrance.pushDragLift} lb</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
