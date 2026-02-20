import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Zap } from 'lucide-react';
import { EXHAUSTION_TABLE } from '@/lib/conditionEffects';

interface ExhaustionTrackerProps {
  level: number;
  onChangeLevel: (level: number) => void;
}

export function ExhaustionTracker({ level, onChangeLevel }: ExhaustionTrackerProps) {
  const info = EXHAUSTION_TABLE[Math.min(level, 6)];

  return (
    <div className="flex items-center gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5">
              <Zap className={cn('h-4 w-4', level > 0 ? 'text-amber-500' : 'text-gray-400')} />
              <span className="text-sm font-medium">Exhaustion</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs text-left">
            <p className="font-semibold mb-1">Exhaustion Level {level}</p>
            <p className="text-xs">{info?.description}</p>
            {level > 0 && level < 6 && (
              <p className="text-xs mt-1 text-muted-foreground">Reduced by 1 on long rest with food & water.</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          disabled={level <= 0}
          onClick={() => onChangeLevel(Math.max(0, level - 1))}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={cn(
                'h-4 w-4 rounded-sm border text-[9px] font-bold flex items-center justify-center transition-colors',
                i <= level
                  ? i >= 6
                    ? 'bg-red-700 border-red-800 text-white'
                    : i >= 4
                      ? 'bg-amber-600 border-amber-700 text-white'
                      : 'bg-amber-400 border-amber-500 text-amber-900'
                  : 'bg-white border-gray-300 text-gray-400'
              )}
            >
              {i}
            </div>
          ))}
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          disabled={level >= 6}
          onClick={() => onChangeLevel(Math.min(6, level + 1))}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
