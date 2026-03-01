import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface ExhaustionTrackerProps {
    level: number;
    onChange: (delta: number) => void;
    disabled?: boolean;
}

const EXHAUSTION_LEVELS = [
    { level: 1, effect: 'Disadvantage on Ability Checks' },
    { level: 2, effect: 'Speed halved' },
    { level: 3, effect: 'Disadvantage on Attack rolls and Saving Throws' },
    { level: 4, effect: 'Hit point maximum halved' },
    { level: 5, effect: 'Speed reduced to 0' },
    { level: 6, effect: 'Death' },
];

export function ExhaustionTracker({ level, onChange, disabled }: ExhaustionTrackerProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-heading font-semibold text-sm">Exhaustion</h4>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onChange(-1)}
                        disabled={disabled || level <= 0}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-display font-medium text-base w-4 text-center">
                        {level}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onChange(1)}
                        disabled={disabled || level >= 6}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-1">
                {EXHAUSTION_LEVELS.map((item) => (
                    <div
                        key={item.level}
                        className={cn(
                            "flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors",
                            level >= item.level
                                ? "bg-destructive/15 text-destructive font-medium border border-destructive/20"
                                : "text-muted-foreground bg-muted/30 border border-transparent"
                        )}
                    >
                        <span className={cn(
                            "flex items-center justify-center w-4 h-4 rounded-sm text-[10px]",
                            level >= item.level ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"
                        )}>
                            {item.level}
                        </span>
                        <span>{item.effect}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
