import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dice1 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RollButtonProps {
  label: string;
  modifier: number;
  kind: 'ability' | 'save' | 'skill';
  rollKey: string;
  onRoll: (rollKey: string, modifier: number, kind: 'ability' | 'save' | 'skill', label?: string) => void;
  compact?: boolean;
  disabled?: boolean;
}

export function RollButton({
  label,
  modifier,
  kind,
  rollKey,
  onRoll,
  compact = false,
  disabled = false,
}: RollButtonProps) {
  const handleClick = () => {
    onRoll(rollKey, modifier, kind, label);
  };

  const buttonContent = (
    <Button
      variant="ghost"
      size={compact ? "icon" : "sm"}
      className={cn(
        "h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted/50",
        compact && "p-0"
      )}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Roll ${label}`}
    >
      <Dice1 className={cn("w-3 h-3", !compact && "mr-1")} />
      {!compact && <span className="text-xs">Roll</span>}
    </Button>
  );

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {buttonContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>Roll {label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonContent;
}
