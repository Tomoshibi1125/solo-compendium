import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Moon, Dices, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HitDieRoll {
  roll: number;
  vitModifier: number;
  hpRecovered: number;
  hitDiceRemaining: number;
}

interface ShortRestDialogProps {
  hitDiceAvailable: number;
  hitDiceMax: number;
  hitDieSize: number;
  hpCurrent: number;
  hpMax: number;
  onSpendHitDie: () => HitDieRoll | null;
  onFinishRest: (totalRecovered: number) => void;
}

export function ShortRestDialog({
  hitDiceAvailable,
  hitDiceMax,
  hitDieSize,
  hpCurrent,
  hpMax,
  onSpendHitDie,
  onFinishRest,
}: ShortRestDialogProps) {
  const [open, setOpen] = useState(false);
  const [rolls, setRolls] = useState<HitDieRoll[]>([]);
  const [totalRecovered, setTotalRecovered] = useState(0);
  const [remainingDice, setRemainingDice] = useState(hitDiceAvailable);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setRolls([]);
      setTotalRecovered(0);
      setRemainingDice(hitDiceAvailable);
    }
    setOpen(isOpen);
  };

  const handleSpend = () => {
    const result = onSpendHitDie();
    if (result) {
      setRolls((prev) => [...prev, result]);
      setTotalRecovered((prev) => prev + result.hpRecovered);
      setRemainingDice(result.hitDiceRemaining);
    }
  };

  const handleFinish = () => {
    onFinishRest(totalRecovered);
    setOpen(false);
  };

  const atFullHP = hpCurrent + totalRecovered >= hpMax;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Moon className="h-4 w-4" /> Short Rest
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" /> Short Rest
          </DialogTitle>
          <DialogDescription>
            Spend hit dice to recover HP. Each die: 1d{hitDieSize} + VIT modifier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hit Dice Pool */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Hit Dice Available</span>
            <span className="font-mono font-bold">
              {remainingDice} / {hitDiceMax} (d{hitDieSize})
            </span>
          </div>

          {/* HP Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">HP</span>
            <span className="font-mono">
              {Math.min(hpCurrent + totalRecovered, hpMax)} / {hpMax}
              {totalRecovered > 0 && (
                <span className="text-green-600 ml-1">(+{totalRecovered})</span>
              )}
            </span>
          </div>

          {/* Spend Button */}
          <Button
            onClick={handleSpend}
            disabled={remainingDice <= 0 || atFullHP}
            className="w-full gap-2"
          >
            <Dices className="h-4 w-4" />
            {atFullHP ? 'HP Full' : remainingDice <= 0 ? 'No Hit Dice Left' : `Spend 1d${hitDieSize}`}
          </Button>

          {/* Roll Log */}
          {rolls.length > 0 && (
            <div className="rounded-md border bg-muted/50 p-3 max-h-40 overflow-y-auto space-y-1">
              {rolls.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Roll {i + 1}</span>
                  <span className="font-mono">
                    d{hitDieSize}={r.roll} {r.vitModifier >= 0 ? '+' : ''}{r.vitModifier} VIT
                    <Heart className={cn('inline h-3 w-3 ml-1', r.hpRecovered > 0 ? 'text-green-500' : 'text-gray-400')} />
                    <span className="font-bold ml-1 text-green-600">+{r.hpRecovered} HP</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleFinish}>
            Finish Rest {totalRecovered > 0 && `(+${totalRecovered} HP)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
