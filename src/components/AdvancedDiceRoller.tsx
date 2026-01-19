import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Save, Trash2, Copy, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface DiceMacro {
  id: string;
  name: string;
  formula: string;
  description?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
  lastUsed?: number;
}

export interface DiceResult {
  formula: string;
  rolls: number[];
  modifiers: number;
  total: number;
  breakdown: string;
  timestamp: number;
  critical?: 'success' | 'failure' | null;
}

interface DiceFormulaParser {
  parse(formula: string): ParsedFormula;
  roll(formula: string): DiceResult;
}

interface ParsedFormula {
  dice: Array<{
    count: number;
    sides: number;
    modifier?: number;
    operation?: '+' | '-';
  }>;
  constant: number;
  hasAdvantage?: boolean;
  hasDisadvantage?: boolean;
  hasCrit?: boolean;
}

class AdvancedDiceEngine implements DiceFormulaParser {
  private rollDice(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }

  private rollMultiple(count: number, sides: number): number[] {
    return Array.from({ length: count }, () => this.rollDice(sides));
  }

  parse(formula: string): ParsedFormula {
    const cleanFormula = formula.toLowerCase().trim();
    
    // Check for advantage/disadvantage
    const hasAdvantage = cleanFormula.includes('advantage') || cleanFormula.includes('adv');
    const hasDisadvantage = cleanFormula.includes('disadvantage') || cleanFormula.includes('dis');
    const hasCrit = cleanFormula.includes('crit') || cleanFormula.includes('critical');

    // Remove advantage/disadvantage keywords for parsing
    const parseableFormula = cleanFormula
      .replace(/\b(advantage|adv|disadvantage|dis)\b/g, '')
      .replace(/\b(crit|critical)\b/g, '')
      .trim();

    // Parse dice notation (e.g., 2d6+3, 1d20, d8-2)
    const diceRegex = /(\d*)d(\d+)([+-]\d+)?/g;
    const dice = [];
    let constant = 0;
    let match;

    while ((match = diceRegex.exec(parseableFormula)) !== null) {
      const [_, countStr, sidesStr, modifierStr] = match;
      const count = countStr ? parseInt(countStr) : 1;
      const sides = parseInt(sidesStr);
      
      let modifier = 0;
      let operation: '+' | '-' = '+';
      
      if (modifierStr) {
        operation = modifierStr[0] as '+' | '-';
        modifier = parseInt(modifierStr.slice(1));
      }

      dice.push({ count, sides, modifier, operation });
    }

    // Extract constant modifiers
    const constantRegex = /([+-]\s*\d+)/g;
    const constants = [];
    while ((match = constantRegex.exec(parseableFormula)) !== null) {
      constants.push(parseInt(match[1].replace(/\s/g, '')));
    }
    constant = constants.reduce((sum, val) => sum + val, 0);

    return {
      dice,
      constant,
      hasAdvantage,
      hasDisadvantage,
      hasCrit
    };
  }

  roll(formula: string): DiceResult {
    const parsed = this.parse(formula);
    const rolls: number[] = [];
    let total = parsed.constant;
    let breakdown = '';

    // Roll each dice group
    parsed.dice.forEach((die, index) => {
      const dieRolls = this.rollMultiple(die.count, die.sides);
      rolls.push(...dieRolls);
      
      const dieTotal = dieRolls.reduce((sum, roll) => sum + roll, 0);
      const modifiedTotal = die.operation === '+' 
        ? dieTotal + (die.modifier || 0)
        : dieTotal - (die.modifier || 0);
      
      total += modifiedTotal;
      
      breakdown += `${index > 0 ? ' + ' : ''}${die.count}d${die.sides}`;
      if (die.modifier) {
        breakdown += `${die.operation}${die.modifier}`;
      }
      breakdown += ` [${dieRolls.join(', ')}]`;
    });

    // Handle advantage/disadvantage for d20 rolls
    if (parsed.hasAdvantage || parsed.hasDisadvantage) {
      const d20Rolls = rolls.filter((_, index) => 
        parsed.dice[index]?.sides === 20
      );
      
      if (d20Rolls.length > 0) {
        const [roll1, roll2] = d20Rolls.slice(0, 2);
        const advantageRoll = parsed.hasAdvantage 
          ? Math.max(roll1, roll2)
          : Math.min(roll1, roll2);
        
        total = total - d20Rolls[0] + advantageRoll;
        breakdown += ` (${parsed.hasAdvantage ? 'advantage' : 'disadvantage'}: ${roll1}, ${roll2} → ${advantageRoll})`;
      }
    }

    // Handle critical hits
    let critical: 'success' | 'failure' | null = null;
    if (parsed.hasCrit) {
      const d20Rolls = rolls.filter(roll => roll <= 20);
      if (d20Rolls.some(roll => roll === 20)) {
        critical = 'success';
        total += 10; // Add crit bonus
        breakdown += ' (CRITICAL SUCCESS! +10)';
      } else if (d20Rolls.some(roll => roll === 1)) {
        critical = 'failure';
        breakdown += ' (CRITICAL FAILURE!)';
      }
    }

    // Add constant modifiers
    if (parsed.constant !== 0) {
      breakdown += ` ${parsed.constant >= 0 ? '+' : ''}${parsed.constant}`;
    }

    return {
      formula,
      rolls,
      modifiers: parsed.constant,
      total,
      breakdown: `${breakdown} = ${total}`,
      timestamp: Date.now(),
      critical
    };
  }

  // Special dice mechanics
  rollExploding(sides: number, target: number): { rolls: number[]; total: number; exploded: boolean } {
    const rolls: number[] = [];
    let total = 0;
    let exploded = false;

    while (true) {
      const roll = this.rollDice(sides);
      rolls.push(roll);
      total += roll;

      if (roll >= target) {
        exploded = true;
        continue; // Roll again
      }
      break;
    }

    return { rolls, total, exploded };
  }

  rollPool(count: number, sides: number, successTarget: number): { rolls: number[]; successes: number; total: number } {
    const rolls = this.rollMultiple(count, sides);
    const successes = rolls.filter(roll => roll >= successTarget).length;
    const total = successes; // Some systems use successes as the result

    return { rolls, successes, total };
  }

  rollFate(): { rolls: number[]; total: number; result: '+' | '-' | '0' } {
    const rolls = this.rollMultiple(4, 6);
    const total = rolls.reduce((sum, roll) => {
      if (roll <= 2) return sum - 1;
      if (roll >= 5) return sum + 1;
      return sum;
    }, 0);

    const result = total > 0 ? '+' : total < 0 ? '-' : '0';

    return { rolls, total, result };
  }
}

export function useAdvancedDiceRoller() {
  const [history, setHistory] = useState<DiceResult[]>([]);
  const [macros, setMacros] = useState<DiceMacro[]>([]);
  const [favorites, setFavorites] = useState<DiceMacro[]>([]);
  const engine = useMemo(() => new AdvancedDiceEngine(), []);
  const { toast } = useToast();

  const rollDice = useCallback((formula: string): DiceResult => {
    try {
      const result = engine.roll(formula);
      setHistory(prev => [result, ...prev.slice(0, 49)]); // Keep last 50 rolls
      
      // Update macro usage
      setMacros(prev => prev.map(macro => 
        macro.formula === formula 
          ? { ...macro, lastUsed: Date.now() }
          : macro
      ));

      return result;
    } catch (error) {
      toast({
        title: 'Invalid Formula',
        description: 'Please check your dice formula and try again.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [engine, toast]);

  const saveMacro = useCallback((macro: Omit<DiceMacro, 'id' | 'createdAt'>) => {
    const newMacro: DiceMacro = {
      ...macro,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    setMacros(prev => [...prev, newMacro]);
    
    if (macro.isFavorite) {
      setFavorites(prev => [...prev, newMacro]);
    }

    toast({
      title: 'Macro Saved',
      description: `${macro.name} has been saved to your macros.`,
    });

    return newMacro;
  }, [toast]);

  const deleteMacro = useCallback((id: string) => {
    setMacros(prev => prev.filter(macro => macro.id !== id));
    setFavorites(prev => prev.filter(macro => macro.id !== id));
    
    toast({
      title: 'Macro Deleted',
      description: 'The macro has been removed.',
    });
  }, [toast]);

  const toggleFavorite = useCallback((id: string) => {
    setMacros(prev => prev.map(macro => 
      macro.id === id 
        ? { ...macro, isFavorite: !macro.isFavorite }
        : macro
    ));

    setFavorites(prev => {
      const macro = prev.find(m => m.id === id);
      if (macro) {
        return prev.filter(m => m.id !== id);
      } else {
        const found = macros.find(m => m.id === id);
        return found ? [...prev, { ...found, isFavorite: true }] : prev;
      }
    });
  }, [macros]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    toast({
      title: 'History Cleared',
      description: 'Roll history has been cleared.',
    });
  }, [toast]);

  return {
    history,
    macros,
    favorites,
    rollDice,
    saveMacro,
    deleteMacro,
    toggleFavorite,
    clearHistory,
    engine,
  };
}

// React component for advanced dice roller
export function AdvancedDiceRoller() {
  const [formula, setFormula] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [lastResult, setLastResult] = useState<DiceResult | null>(null);
  const {
    history,
    macros,
    favorites,
    rollDice,
    saveMacro,
    deleteMacro,
    toggleFavorite,
    clearHistory,
    engine,
  } = useAdvancedDiceRoller();

  const handleRoll = useCallback(async () => {
    if (!formula.trim()) return;

    setIsRolling(true);
    try {
      const result = rollDice(formula);
      setLastResult(result);
      setFormula('');
    } finally {
      setIsRolling(false);
    }
  }, [formula, rollDice]);

  const handleSaveMacro = useCallback(() => {
    if (!formula.trim()) return;

    saveMacro({
      name: `Macro ${macros.length + 1}`,
      formula: formula.trim(),
      description: `Custom dice roll: ${formula}`,
      tags: [],
      isFavorite: false,
    });
  }, [formula, macros.length, saveMacro]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const predefinedMacros = [
    { name: 'Attack Roll', formula: '1d20+5', description: 'Basic attack with +5 modifier' },
    { name: 'Damage', formula: '2d6+3', description: 'Weapon damage' },
    { name: 'Saving Throw', formula: '1d20+2', description: 'Constitution saving throw' },
    { name: 'Skill Check', formula: '1d20+4', description: 'Perception check' },
    { name: 'Advantage Roll', formula: '1d20 advantage', description: 'Roll with advantage' },
    { name: 'Disadvantage Roll', formula: '1d20 disadvantage', description: 'Roll with disadvantage' },
    { name: 'Critical Hit', formula: '1d20 crit', description: 'Roll with critical hit rules' },
    { name: 'Fireball Damage', formula: '8d6', description: '8d6 fire damage' },
    { name: 'Healing Potion', formula: '2d4+2', description: '2d4+2 healing' },
    { name: 'Fate Dice', formula: '4dF', description: 'Fate dice roll (+/-/0)' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Dice Roller</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main dice input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Enter dice formula (e.g., 2d6+3, 1d20 advantage, 4dF)"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRoll()}
              className="flex-1"
            />
            <Button onClick={handleRoll} disabled={isRolling || !formula.trim()}>
              <Play className="w-4 h-4 mr-2" />
              Roll
            </Button>
            <Button variant="outline" onClick={handleSaveMacro} disabled={!formula.trim()}>
              <Save className="w-4 h-4 mr-2" />
              Save Macro
            </Button>
          </div>

          {/* Last result display */}
          {lastResult && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">{lastResult.total}</div>
                  <div className="text-sm text-muted-foreground">{lastResult.breakdown}</div>
                  {lastResult.critical && (
                    <Badge variant={lastResult.critical === 'success' ? 'default' : 'destructive'}>
                      {lastResult.critical === 'success' ? 'CRITICAL SUCCESS!' : 'CRITICAL FAILURE!'}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(lastResult.breakdown)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="macros" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="macros">Macros</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            {/* Predefined macros */}
            <TabsContent value="macros" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predefinedMacros.map((macro) => (
                  <Card key={macro.name} className="cursor-pointer hover:bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{macro.name}</h4>
                          <p className="text-sm text-muted-foreground">{macro.formula}</p>
                          <p className="text-xs text-muted-foreground mt-1">{macro.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormula(macro.formula)}
                        >
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom macros */}
              {macros.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Custom Macros</h4>
                  {macros.map((macro) => (
                    <Card key={macro.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">{macro.name}</h4>
                            <p className="text-sm text-muted-foreground">{macro.formula}</p>
                            {macro.description && (
                              <p className="text-xs text-muted-foreground mt-1">{macro.description}</p>
                            )}
                            {macro.tags.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {macro.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(macro.id)}
                            >
                              {macro.isFavorite ? '★' : '☆'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormula(macro.formula)}
                            >
                              Use
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMacro(macro.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Favorites */}
            <TabsContent value="favorites" className="space-y-4">
              {favorites.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No favorite macros yet. Star macros to add them here.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((macro) => (
                    <Card key={macro.id} className="cursor-pointer hover:bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">★ {macro.name}</h4>
                            <p className="text-sm text-muted-foreground">{macro.formula}</p>
                            {macro.description && (
                              <p className="text-xs text-muted-foreground mt-1">{macro.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormula(macro.formula)}
                          >
                            Use
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* History */}
            <TabsContent value="history" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Recent Rolls ({history.length})</h4>
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearHistory}>
                    Clear History
                  </Button>
                )}
              </div>
              
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No rolls yet. Start rolling to see your history.
                </p>
              ) : (
                <div className="space-y-2">
                  {history.map((result, index) => (
                    <Card key={result.timestamp} className="text-sm">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="font-mono">{result.formula}</span>
                            <div className="text-muted-foreground">{result.breakdown}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{result.total}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
