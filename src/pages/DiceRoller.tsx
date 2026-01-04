import { useState } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw, Plus, Minus, History } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { cn } from '@/lib/utils';

interface DiceRoll {
  id: string;
  dice: string;
  rolls: number[];
  modifier: number;
  total: number;
  timestamp: Date;
  type?: 'normal' | 'advantage' | 'disadvantage';
}

const diceTypes = [
  { sides: 4, label: 'd4' },
  { sides: 6, label: 'd6' },
  { sides: 8, label: 'd8' },
  { sides: 10, label: 'd10' },
  { sides: 12, label: 'd12' },
  { sides: 20, label: 'd20' },
  { sides: 100, label: 'd100' },
];

const DiceRoller = () => {
  const [selectedDice, setSelectedDice] = useState<{ sides: number; count: number }[]>([]);
  const [modifier, setModifier] = useState(0);
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);
  const [rollType, setRollType] = useState<'normal' | 'advantage' | 'disadvantage'>('normal');

  const addDie = (sides: number) => {
    setSelectedDice(prev => {
      const existing = prev.find(d => d.sides === sides);
      if (existing) {
        return prev.map(d => d.sides === sides ? { ...d, count: d.count + 1 } : d);
      }
      return [...prev, { sides, count: 1 }];
    });
  };

  const removeDie = (sides: number) => {
    setSelectedDice(prev => {
      return prev
        .map(d => d.sides === sides ? { ...d, count: d.count - 1 } : d)
        .filter(d => d.count > 0);
    });
  };

  const rollDice = () => {
    if (selectedDice.length === 0) return;

    const rolls: number[] = [];
    let diceString = '';

    selectedDice.forEach(({ sides, count }) => {
      for (let i = 0; i < count; i++) {
        let roll = Math.floor(Math.random() * sides) + 1;
        
        // Handle advantage/disadvantage for d20
        if (sides === 20 && rollType !== 'normal') {
          const roll2 = Math.floor(Math.random() * sides) + 1;
          roll = rollType === 'advantage' ? Math.max(roll, roll2) : Math.min(roll, roll2);
        }
        
        rolls.push(roll);
      }
      diceString += `${count}d${sides} + `;
    });

    diceString = diceString.slice(0, -3);
    if (modifier !== 0) {
      diceString += ` ${modifier >= 0 ? '+' : '-'} ${Math.abs(modifier)}`;
    }

    const total = rolls.reduce((a, b) => a + b, 0) + modifier;

    const newRoll: DiceRoll = {
      id: crypto.randomUUID(),
      dice: diceString,
      rolls,
      modifier,
      total,
      timestamp: new Date(),
      type: rollType,
    };

    setLastRoll(newRoll);
    setRollHistory(prev => [newRoll, ...prev.slice(0, 19)]);
  };

  const clearSelection = () => {
    setSelectedDice([]);
    setModifier(0);
    setRollType('normal');
  };

  const quickRoll = (notation: string) => {
    // Parse simple dice notation like "1d20+5" or "2d6"
    const match = notation.match(/(\d+)d(\d+)([+-]\d+)?/);
    if (!match) return;

    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const mod = match[3] ? parseInt(match[3]) : 0;

    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    const total = rolls.reduce((a, b) => a + b, 0) + mod;

    const newRoll: DiceRoll = {
      id: crypto.randomUUID(),
      dice: notation,
      rolls,
      modifier: mod,
      total,
      timestamp: new Date(),
    };

    setLastRoll(newRoll);
    setRollHistory(prev => [newRoll, ...prev.slice(0, 19)]);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-arise text-4xl font-black mb-2 gradient-text-system text-glow">
            DICE ROLLER
          </h1>
          <p className="text-muted-foreground font-heading">
            Roll dice with the <span className="text-primary">System's</span> guidance — may the Shadow Monarch's favor be with you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dice Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Rolls */}
            <SystemWindow title="SYSTEM QUICK ROLLS" variant="default">
              <div className="flex flex-wrap gap-2">
                {['1d20', '1d20+5', '2d6', '1d8+3', '1d4', '1d12'].map(notation => (
                  <Button
                    key={notation}
                    variant="outline"
                    onClick={() => quickRoll(notation)}
                    className="font-display"
                  >
                    {notation}
                  </Button>
                ))}
              </div>
            </SystemWindow>

            {/* Dice Builder */}
            <SystemWindow title="BUILD YOUR ROLL">
              <div className="space-y-4">
                {/* Dice buttons */}
                <div className="flex flex-wrap gap-3">
                  {diceTypes.map(({ sides, label }) => {
                    const selected = selectedDice.find(d => d.sides === sides);
                    return (
                      <div key={sides} className="relative">
                        <Button
                          variant={selected ? "default" : "outline"}
                          size="lg"
                          onClick={() => addDie(sides)}
                          className="w-16 h-16 font-display text-lg"
                        >
                          {label}
                        </Button>
                        {selected && selected.count > 0 && (
                          <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                            {selected.count}
                          </span>
                        )}
                        {selected && (
                          <button
                            onClick={(e) => { e.stopPropagation(); removeDie(sides); }}
                            className="absolute -bottom-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Modifier */}
                <div className="flex items-center gap-4">
                  <span className="font-heading text-muted-foreground">Modifier:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setModifier(m => m - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-display text-xl">
                      {modifier >= 0 ? '+' : ''}{modifier}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setModifier(m => m + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Roll Type (for d20) */}
                {selectedDice.some(d => d.sides === 20) && (
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-muted-foreground">D20 Roll:</span>
                    <div className="flex gap-2">
                      {(['normal', 'advantage', 'disadvantage'] as const).map(type => (
                        <Button
                          key={type}
                          variant={rollType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setRollType(type)}
                          className="capitalize font-heading"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Roll Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    size="lg"
                    onClick={rollDice}
                    disabled={selectedDice.length === 0}
                    className="flex-1 font-display text-lg"
                  >
                    ROLL
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={clearSelection}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </SystemWindow>

            {/* Last Roll Result */}
            {lastRoll && (
              <SystemWindow title="SYSTEM RESULT" variant="arise" className="animate-arise">
                <div className="text-center py-6">
                  <div className="text-7xl font-arise font-black gradient-text-monarch text-glow-gold mb-3 drop-shadow-lg">
                    {lastRoll.total}
                  </div>
                  <p className="text-muted-foreground font-heading text-lg">
                    {lastRoll.dice}
                  </p>
                  <p className="text-sm text-muted-foreground mt-3 font-display tracking-wide">
                    ROLLS: [{lastRoll.rolls.join(', ')}]
                    {lastRoll.modifier !== 0 && ` ${lastRoll.modifier >= 0 ? '+' : ''}${lastRoll.modifier}`}
                  </p>
                  {lastRoll.type && lastRoll.type !== 'normal' && (
                    <span className={cn(
                      "inline-block mt-3 px-3 py-1 rounded-lg text-xs font-arise uppercase tracking-widest",
                      lastRoll.type === 'advantage' 
                        ? 'bg-accent/20 text-accent border border-accent/40 shadow-[0_0_10px_hsl(var(--accent)/0.3)]' 
                        : 'bg-gate-a/20 text-gate-a border border-gate-a/40 shadow-[0_0_10px_hsl(var(--gate-a)/0.3)]'
                    )}>
                      {lastRoll.type}
                    </span>
                  )}
                </div>
              </SystemWindow>
            )}
          </div>

          {/* Roll History */}
          <div>
            <SystemWindow title="ROLL HISTORY" variant="monarch" className="sticky top-24">
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {rollHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 font-heading">
                    No rolls yet
                  </p>
                ) : (
                  rollHistory.map(roll => (
                    <div
                      key={roll.id}
                      className="p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display text-xl font-bold">
                          {roll.total}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {roll.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-heading">
                        {roll.dice}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </SystemWindow>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiceRoller;
