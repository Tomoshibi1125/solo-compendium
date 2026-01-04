import { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw, Plus, Minus, History, Sparkles, Zap, Palette, Crown, Flame, Zap as ZapIcon, Gem } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { cn } from '@/lib/utils';
import { Dice3DRoller, DICE_THEMES, type DiceTheme } from '@/components/dice/Dice3D';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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
  const [isRolling, setIsRolling] = useState(false);
  const [dice3D, setDice3D] = useState<Array<{ sides: number; value: number | null }>>([]);
  const [show3D, setShow3D] = useState(true);
  const [diceTheme, setDiceTheme] = useState<DiceTheme>('shadow-monarch');

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

    setIsRolling(true);
    
    // Prepare 3D dice array
    const diceArray: Array<{ sides: number; value: number | null }> = [];
    selectedDice.forEach(({ sides, count }) => {
      for (let i = 0; i < count; i++) {
        diceArray.push({ sides, value: null });
      }
    });
    setDice3D(diceArray);

    // Calculate rolls after animation delay
    setTimeout(() => {
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

      // Update 3D dice with values
      let rollIndex = 0;
      const updatedDice = diceArray.map((die, index) => {
        const roll = rolls[rollIndex++];
        return { ...die, value: roll };
      });
      setDice3D(updatedDice);

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
      
      // Stop rolling animation after physics settle
      setTimeout(() => {
        setIsRolling(false);
      }, 2000);
    }, 100);
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

    setIsRolling(true);
    
    // Prepare 3D dice array
    const diceArray: Array<{ sides: number; value: number | null }> = [];
    for (let i = 0; i < count; i++) {
      diceArray.push({ sides, value: null });
    }
    setDice3D(diceArray);

    // Calculate rolls after animation delay
    setTimeout(() => {
      const rolls: number[] = [];
      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
      }

      const total = rolls.reduce((a, b) => a + b, 0) + mod;

      // Update 3D dice with values
      const updatedDice = diceArray.map((die, index) => ({
        ...die,
        value: rolls[index],
      }));
      setDice3D(updatedDice);

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
      
      // Stop rolling animation after physics settle
      setTimeout(() => {
        setIsRolling(false);
      }, 2000);
    }, 100);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-arise text-4xl font-black mb-2 gradient-text-system text-glow flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-shadow-purple animate-pulse" />
                DICE ROLLER
                <Zap className="w-8 h-8 text-shadow-blue animate-pulse" style={{ animationDelay: '0.5s' }} />
              </h1>
              <p className="text-muted-foreground font-heading">
                Roll dice with the <span className="text-primary">System's</span> guidance — may the Supreme Deity's favor be with you
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShow3D(!show3D)}
              className="gap-2"
            >
              {show3D ? '2D View' : '3D View'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dice Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* 3D Dice Roller */}
            {show3D && dice3D.length > 0 && (
              <SystemWindow title={`SYSTEM DICE CHAMBER - ${DICE_THEMES[diceTheme].name.toUpperCase()}`} variant="arise" className="overflow-hidden">
                <Dice3DRoller
                  dice={dice3D}
                  isRolling={isRolling}
                  theme={diceTheme}
                  onRollComplete={(index, value) => {
                    // Handle individual die completion if needed
                  }}
                />
              </SystemWindow>
            )}
            
            {/* Dice Theme Selector */}
            {show3D && (
              <SystemWindow title="DICE THEME" variant="default">
                <div className="space-y-3">
                  <Label>Choose Your Dice Aesthetic</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(DICE_THEMES).map(([key, theme]) => {
                      const Icon = key === 'shadow-monarch' ? Crown :
                                   key === 'supreme-deity' ? ZapIcon :
                                   key === 'gate-portal' ? Flame :
                                   key === 'system-interface' ? Sparkles :
                                   key === 'arise-violet' ? Gem : Palette;
                      return (
                        <button
                          key={key}
                          onClick={() => setDiceTheme(key as DiceTheme)}
                          className={cn(
                            "p-3 rounded-lg border transition-all text-left",
                            diceTheme === key
                              ? "border-primary bg-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4" style={{ color: theme.baseColor }} />
                            <span className="font-heading text-sm font-semibold">{theme.name}</span>
                          </div>
                          <div 
                            className="w-full h-2 rounded-full"
                            style={{ backgroundColor: theme.baseColor, opacity: 0.3 }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </SystemWindow>
            )}
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
                          className={cn(
                            "w-16 h-16 font-display text-lg transition-all",
                            selected && "shadow-lg"
                          )}
                          style={selected ? {
                            boxShadow: `0 0 20px ${DICE_THEMES[diceTheme].baseColor}40, 0 0 10px ${DICE_THEMES[diceTheme].baseColor}20`,
                          } : {}}
                        >
                          {label}
                        </Button>
                        {selected && selected.count > 0 && (
                          <span 
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ 
                              backgroundColor: DICE_THEMES[diceTheme].baseColor,
                              boxShadow: `0 0 10px ${DICE_THEMES[diceTheme].baseColor}60`,
                            }}
                          >
                            {selected.count}
                          </span>
                        )}
                        {selected && (
                          <button
                            onClick={(e) => { e.stopPropagation(); removeDie(sides); }}
                            className="absolute -bottom-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform"
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
                    disabled={selectedDice.length === 0 || isRolling}
                    className={cn(
                      "flex-1 font-display text-lg relative overflow-hidden",
                      "bg-gradient-to-r from-primary via-shadow-purple to-primary",
                      "hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]",
                      "transition-all duration-300"
                    )}
                    style={{
                      boxShadow: selectedDice.length > 0 
                        ? `0 0 20px ${DICE_THEMES[diceTheme].baseColor}40` 
                        : undefined,
                    }}
                  >
                    {isRolling ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 animate-spin" />
                        ROLLING...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        ROLL
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={clearSelection}
                    disabled={isRolling}
                    className="hover:bg-destructive/10 hover:border-destructive/50 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </SystemWindow>

            {/* Last Roll Result */}
            {lastRoll && (
              <SystemWindow title="SYSTEM RESULT" variant="arise" className="animate-arise relative overflow-hidden">
                {/* Solo Leveling background effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-radial from-shadow-blue/20 via-shadow-purple/10 to-transparent rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-radial from-arise-violet/15 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                
                <div className="text-center py-6 relative z-10">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-shadow-blue/30 via-shadow-purple/30 to-arise-violet/30 blur-2xl rounded-full animate-pulse" />
                    <div className="text-7xl font-arise font-black gradient-text-monarch text-glow-gold mb-3 drop-shadow-lg relative">
                      {lastRoll.total}
                    </div>
                  </div>
                  <p className="text-muted-foreground font-heading text-lg">
                    {lastRoll.dice}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {lastRoll.rolls.map((roll, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          "px-3 py-1 rounded-lg text-sm font-display font-bold border",
                          roll === 20 ? 'bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_10px_hsl(142_71%_45%/0.3)]' :
                          roll === 1 ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_10px_hsl(0_84%_60%/0.3)]' :
                          'bg-primary/20 text-primary border-primary/40'
                        )}
                      >
                        {roll}
                      </span>
                    ))}
                    {lastRoll.modifier !== 0 && (
                      <span className="px-3 py-1 rounded-lg text-sm font-display font-bold bg-muted/50 text-muted-foreground border border-border">
                        {lastRoll.modifier >= 0 ? '+' : ''}{lastRoll.modifier}
                      </span>
                    )}
                  </div>
                  {lastRoll.type && lastRoll.type !== 'normal' && (
                    <span className={cn(
                      "inline-block mt-4 px-4 py-2 rounded-lg text-xs font-arise uppercase tracking-widest border",
                      lastRoll.type === 'advantage' 
                        ? 'bg-accent/20 text-accent border-accent/40 shadow-[0_0_15px_hsl(var(--accent)/0.4)]' 
                        : 'bg-gate-a/20 text-gate-a border border-gate-a/40 shadow-[0_0_15px_hsl(var(--gate-a)/0.4)]'
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
