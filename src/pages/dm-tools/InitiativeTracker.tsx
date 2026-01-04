import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

const InitiativeTracker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [newCombatant, setNewCombatant] = useState({
    name: '',
    initiative: 0,
    hp: 0,
    maxHp: 0,
    ac: 0,
    isHunter: true,
  });

  const sortedCombatants = [...combatants].sort((a, b) => {
    if (b.initiative !== a.initiative) {
      return b.initiative - a.initiative;
    }
    // Tiebreaker: hunters go first
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

  const updateInitiative = (id: string, initiative: number) => {
    setCombatants(combatants.map(c =>
      c.id === id ? { ...c, initiative } : c
    ));
  };

  const updateHP = (id: string, hp: number) => {
    setCombatants(combatants.map(c =>
      c.id === id ? { ...c, hp: Math.max(0, hp) } : c
    ));
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
    setIsActive(false);
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
            GATE COMBAT TRACKER
          </h1>
          <p className="text-muted-foreground font-heading">
            Track initiative, HP, and conditions during Gate combat encounters.
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
                                <Badge variant="secondary" className="text-xs">Hunter</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">Monster</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Initiative: {combatant.initiative}
                              {combatant.ac && ` • AC: ${combatant.ac}`}
                              {combatant.hp !== undefined && combatant.maxHp && (
                                ` • HP: ${combatant.hp}/${combatant.maxHp}`
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
                      {combatant.conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {combatant.conditions.map((condition) => (
                            <Badge
                              key={condition}
                              variant="destructive"
                              className="text-xs cursor-pointer"
                              onClick={() => removeCondition(combatant.id, condition)}
                            >
                              {condition} ×
                            </Badge>
                          ))}
                        </div>
                      )}
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
                  <label className="text-xs font-display text-muted-foreground mb-1 block">
                    NAME
                  </label>
                  <Input
                    value={newCombatant.name}
                    onChange={(e) => setNewCombatant({ ...newCombatant, name: e.target.value })}
                    placeholder="Hunter or Gate creature name"
                    className="font-display"
                  />
                </div>
                <div>
                  <label className="text-xs font-display text-muted-foreground mb-1 block">
                    INITIATIVE
                  </label>
                  <Input
                    type="number"
                    value={newCombatant.initiative}
                    onChange={(e) => setNewCombatant({ ...newCombatant, initiative: parseInt(e.target.value) || 0 })}
                    className="font-display"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-display text-muted-foreground mb-1 block">
                      HP
                    </label>
                    <Input
                      type="number"
                      value={newCombatant.hp}
                      onChange={(e) => setNewCombatant({ ...newCombatant, hp: parseInt(e.target.value) || 0 })}
                      className="font-display"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-display text-muted-foreground mb-1 block">
                      MAX HP
                    </label>
                    <Input
                      type="number"
                      value={newCombatant.maxHp}
                      onChange={(e) => setNewCombatant({ ...newCombatant, maxHp: parseInt(e.target.value) || 0 })}
                      className="font-display"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-display text-muted-foreground mb-1 block">
                    AC
                  </label>
                  <Input
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

