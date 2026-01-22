import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { useUserToolState } from '@/hooks/useToolState';

interface Combatant {
  id: string;
  name: string;
  initiative: number;
  hp?: number;
  maxHp?: number;
  ac?: number;
  conditions: string[];
  isHunter: boolean;
}

const STORAGE_KEY = 'solo-compendium.dm-tools.initiative.v1';

const CONDITION_OPTIONS = [
  'Blinded',
  'Charmed',
  'Deafened',
  'Exhaustion',
  'Frightened',
  'Grappled',
  'Incapacitated',
  'Invisible',
  'Paralyzed',
  'Petrified',
  'Poisoned',
  'Prone',
  'Restrained',
  'Stunned',
  'Unconscious',
];

const InitiativeTracker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const hydratedRef = useRef(false);
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [newCombatant, setNewCombatant] = useState({
    name: '',
    initiative: 0,
    hp: 0,
    maxHp: 0,
    ac: 0,
    isHunter: true,
  });

  const { state: storedState, isLoading, saveNow } = useUserToolState<{
    combatants: Combatant[];
    currentTurn: number;
    round: number;
    version?: number;
    savedAt?: string;
  }>('initiative_tracker', {
    initialState: { combatants: [], currentTurn: 0, round: 1 },
    storageKey: STORAGE_KEY,
  });

  const savePayload = useMemo(
    () => ({
      combatants,
      currentTurn,
      round,
    }),
    [combatants, currentTurn, round]
  );
  const debouncedState = useDebounce(savePayload, 600);

  // Load persisted state (best-effort)
  useEffect(() => {
    if (isLoading || hydratedRef.current) return;
    if (Array.isArray(storedState.combatants)) {
      setCombatants(storedState.combatants);
    }
    if (typeof storedState.currentTurn === 'number') {
      setCurrentTurn(storedState.currentTurn);
    }
    if (typeof storedState.round === 'number') {
      setRound(storedState.round);
    }
    hydratedRef.current = true;
  }, [isLoading, storedState.combatants, storedState.currentTurn, storedState.round]);

  // Persist state (best-effort)
  useEffect(() => {
    if (!hydratedRef.current) return;
    void saveNow({
      ...debouncedState,
      version: 1,
      savedAt: new Date().toISOString(),
    });
  }, [debouncedState, saveNow]);

  const sortedCombatants = [...combatants].sort((a, b) => {
    if (b.initiative !== a.initiative) {
      return b.initiative - a.initiative;
    }
    // Tiebreaker: ascendants go first
    if (a.isHunter !== b.isHunter) {
      return a.isHunter ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const addCombatant = () => {
    if (!newCombatant.name) {
      toast({
        title: 'Name required',
        description: 'Please enter a combatant name.',
        variant: 'destructive',
      });
      return;
    }

    setCombatants([...combatants, {
      id: `${Date.now()}-${Math.random()}`,
      name: newCombatant.name,
      initiative: newCombatant.initiative,
      hp: newCombatant.hp || undefined,
      maxHp: newCombatant.maxHp || undefined,
      ac: newCombatant.ac || undefined,
      conditions: [],
      isHunter: newCombatant.isHunter,
    }]);

    setNewCombatant({
      name: '',
      initiative: 0,
      hp: 0,
      maxHp: 0,
      ac: 0,
      isHunter: true,
    });

    toast({
      title: 'Added to initiative',
      description: `${newCombatant.name} added to combat tracker.`,
    });
  };

  const removeCombatant = (id: string) => {
    setCombatants(combatants.filter(c => c.id !== id));
    if (currentTurn >= combatants.length - 1) {
      setCurrentTurn(0);
    }
  };

  const updateHP = (id: string, hp: number) => {
    setCombatants(combatants.map(c => {
      if (c.id !== id) return c;
      const maxHp = typeof c.maxHp === 'number' && c.maxHp > 0 ? c.maxHp : undefined;
      const nextHp = maxHp !== undefined ? Math.min(Math.max(0, hp), maxHp) : Math.max(0, hp);
      return { ...c, hp: nextHp };
    }));
  };

  const updateMaxHP = (id: string, maxHp: number) => {
    setCombatants(combatants.map(c => {
      if (c.id !== id) return c;
      const nextMax = Math.max(0, maxHp);
      const nextHp = typeof c.hp === 'number'
        ? Math.min(Math.max(0, c.hp), nextMax > 0 ? nextMax : c.hp)
        : c.hp;
      return { ...c, maxHp: nextMax, hp: nextHp };
    }));
  };

  const adjustHP = (id: string, delta: number) => {
    setCombatants(combatants.map(c => {
      if (c.id !== id) return c;
      const base = typeof c.hp === 'number' ? c.hp : 0;
      const maxHp = typeof c.maxHp === 'number' && c.maxHp > 0 ? c.maxHp : undefined;
      const nextHp = maxHp !== undefined
        ? Math.min(Math.max(0, base + delta), maxHp)
        : Math.max(0, base + delta);
      return { ...c, hp: nextHp };
    }));
  };

  const addCondition = (id: string, condition: string) => {
    setCombatants(combatants.map(c =>
      c.id === id ? { ...c, conditions: [...c.conditions, condition] } : c
    ));
  };

  const removeCondition = (id: string, condition: string) => {
    setCombatants(combatants.map(c =>
      c.id === id ? { ...c, conditions: c.conditions.filter(cond => cond !== condition) } : c
    ));
  };

  const nextTurn = () => {
    if (sortedCombatants.length === 0) return;
    setCurrentTurn((prev) => {
      const next = (prev + 1) % sortedCombatants.length;
      if (next === 0) {
        setRound(round + 1);
      }
      return next;
    });
  };

  const previousTurn = () => {
    if (sortedCombatants.length === 0) return;
    setCurrentTurn((prev) => {
      if (prev === 0) {
        setRound(Math.max(1, round - 1));
        return sortedCombatants.length - 1;
      }
      return prev - 1;
    });
  };

  const resetCombat = () => {
    setCombatants([]);
    setCurrentTurn(0);
    setRound(1);
    toast({
      title: 'Combat reset',
      description: 'All combatants cleared from the tracker.',
    });
  };

  const currentCombatant = sortedCombatants[currentTurn];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to System Tools
          </Button>
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-shadow">
            RIFT COMBAT TRACKER
          </h1>
          <p className="text-muted-foreground font-heading">
            Track initiative, HP, and conditions during Rift combat encounters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Initiative Order */}
          <div className="lg:col-span-2 space-y-4">
            <SystemWindow title="INITIATIVE ORDER">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs font-display text-muted-foreground">ROUND</span>
                    <div className="font-display text-2xl font-bold">{round}</div>
                  </div>
                  {currentCombatant && (
                    <div>
                      <span className="text-xs font-display text-muted-foreground">CURRENT TURN</span>
                      <div className="font-heading text-lg font-semibold">{currentCombatant.name}</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={previousTurn}
                    disabled={sortedCombatants.length === 0}
                    aria-label="Previous turn"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={nextTurn}
                    disabled={sortedCombatants.length === 0}
                    aria-label="Next turn"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={resetCombat}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {sortedCombatants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No combatants yet</p>
                  <p className="text-xs mt-1">Add combatants to start tracking</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedCombatants.map((combatant, index) => (
                    <div
                      key={combatant.id}
                      className={cn(
                        "p-3 rounded border transition-all",
                        index === currentTurn
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "bg-muted/30 border-border"
                      )}
                      data-combatant-card
                      data-combatant-name={combatant.name}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-display text-sm",
                            index === currentTurn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-heading font-semibold flex items-center gap-2">
                              {combatant.name}
                              {combatant.isHunter ? (
                                <Badge variant="secondary" className="text-xs">Ascendant</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">Monster</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Initiative: {combatant.initiative}
                              {combatant.ac !== undefined && ` | AC: ${combatant.ac}`}
                              {combatant.hp !== undefined && combatant.maxHp !== undefined && (
                                ` | HP: ${combatant.hp}/${combatant.maxHp}`
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => removeCombatant(combatant.id)}
                          aria-label={`Remove ${combatant.name} from initiative`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor={`combatant-${combatant.id}-hp`} className="text-xs text-muted-foreground">HP</Label>
                          <Input
                            id={`combatant-${combatant.id}-hp`}
                            type="number"
                            min={0}
                            value={combatant.hp ?? ''}
                            onChange={(e) => updateHP(combatant.id, parseInt(e.target.value) || 0)}
                            aria-label={`HP for ${combatant.name}`}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`combatant-${combatant.id}-max-hp`} className="text-xs text-muted-foreground">Max HP</Label>
                          <Input
                            id={`combatant-${combatant.id}-max-hp`}
                            type="number"
                            min={0}
                            value={combatant.maxHp ?? ''}
                            onChange={(e) => updateMaxHP(combatant.id, parseInt(e.target.value) || 0)}
                            aria-label={`Max HP for ${combatant.name}`}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustHP(combatant.id, -1)}
                          aria-label={`Damage ${combatant.name} by 1`}
                        >
                          -1
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustHP(combatant.id, -5)}
                          aria-label={`Damage ${combatant.name} by 5`}
                        >
                          -5
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustHP(combatant.id, 5)}
                          aria-label={`Heal ${combatant.name} by 5`}
                        >
                          +5
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustHP(combatant.id, 1)}
                          aria-label={`Heal ${combatant.name} by 1`}
                        >
                          +1
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateHP(combatant.id, combatant.maxHp ?? combatant.hp ?? 0)}
                          disabled={!(typeof combatant.maxHp === 'number' && combatant.maxHp > 0)}
                          aria-label={`Set ${combatant.name} to full HP`}
                        >
                          Full
                        </Button>
                      </div>
                      {combatant.conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {combatant.conditions.map((condition) => (
                            <Badge
                              key={condition}
                              variant="destructive"
                              className="text-xs cursor-pointer"
                              onClick={() => removeCondition(combatant.id, condition)}
                            >
                              {condition} x
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">Add Condition</div>
                        <div className="flex flex-wrap gap-1">
                          {CONDITION_OPTIONS.filter((condition) => !combatant.conditions.includes(condition))
                            .map((condition) => (
                              <Badge
                                key={condition}
                                variant="outline"
                                className="text-xs cursor-pointer"
                                onClick={() => addCondition(combatant.id, condition)}
                                aria-label={`Add ${condition} to ${combatant.name}`}
                              >
                                + {condition}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SystemWindow>
          </div>

          {/* Add Combatant */}
          <div className="lg:col-span-1 space-y-4">
            <SystemWindow title="ADD COMBATANT">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="combatant-name" className="text-xs font-display text-muted-foreground mb-1 block">
                    NAME
                  </Label>
                  <Input
                    id="combatant-name"
                    value={newCombatant.name}
                    onChange={(e) => setNewCombatant({ ...newCombatant, name: e.target.value })}
                    placeholder="Ascendant or Rift creature name"
                    className="font-display"
                  />
                </div>
                <div>
                  <Label htmlFor="combatant-initiative" className="text-xs font-display text-muted-foreground mb-1 block">
                    INITIATIVE
                  </Label>
                  <Input
                    id="combatant-initiative"
                    type="number"
                    value={newCombatant.initiative}
                    onChange={(e) => setNewCombatant({ ...newCombatant, initiative: parseInt(e.target.value) || 0 })}
                    className="font-display"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="combatant-hp" className="text-xs font-display text-muted-foreground mb-1 block">
                      HP
                    </Label>
                    <Input
                      id="combatant-hp"
                      type="number"
                      value={newCombatant.hp}
                      onChange={(e) => setNewCombatant({ ...newCombatant, hp: parseInt(e.target.value) || 0 })}
                      className="font-display"
                    />
                  </div>
                  <div>
                    <Label htmlFor="combatant-max-hp" className="text-xs font-display text-muted-foreground mb-1 block">
                      MAX HP
                    </Label>
                    <Input
                      id="combatant-max-hp"
                      type="number"
                      value={newCombatant.maxHp}
                      onChange={(e) => setNewCombatant({ ...newCombatant, maxHp: parseInt(e.target.value) || 0 })}
                      className="font-display"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="combatant-ac" className="text-xs font-display text-muted-foreground mb-1 block">
                    AC
                  </Label>
                  <Input
                    id="combatant-ac"
                    type="number"
                    value={newCombatant.ac}
                    onChange={(e) => setNewCombatant({ ...newCombatant, ac: parseInt(e.target.value) || 0 })}
                    className="font-display"
                  />
                </div>
                <Button
                  onClick={addCombatant}
                  className="w-full"
                  disabled={!newCombatant.name}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Initiative
                </Button>
              </div>
            </SystemWindow>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InitiativeTracker;

