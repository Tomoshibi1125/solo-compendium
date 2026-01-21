import { Dice5, History, Sword, Shield, Sparkles, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRollHistory, RollRecord } from '@/hooks/useRollHistory';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular } from '@/lib/vernacular';

interface RollHistoryPanelProps {
  characterId?: string;
  limit?: number;
}

const rollTypeConfig: Record<string, { icon: typeof Dice5; color: string; label: string }> = {
  attack: { icon: Sword, color: 'text-red-400', label: 'Attack' },
  damage: { icon: Target, color: 'text-orange-400', label: 'Damage' },
  save: { icon: Shield, color: 'text-blue-400', label: 'Save' },
  skill: { icon: Sparkles, color: 'text-green-400', label: 'Skill' },
  ability: { icon: Dice5, color: 'text-purple-400', label: 'Ability' },
  initiative: { icon: Dice5, color: 'text-yellow-400', label: 'Initiative' },
  resource: { icon: Sparkles, color: 'text-indigo-400', label: 'Resource' },
  default: { icon: Dice5, color: 'text-primary', label: 'Roll' },
};

export function RollHistoryPanel({ characterId, limit = 20 }: RollHistoryPanelProps) {
  const { data: rolls = [], isLoading } = useRollHistory(characterId, limit);

  const getRollConfig = (type: string) => rollTypeConfig[type] || rollTypeConfig.default;

  const isNat20 = (roll: RollRecord) => roll.dice_formula.includes('d20') && roll.rolls.some(r => r === 20);
  const isNat1 = (roll: RollRecord) => roll.dice_formula.includes('d20') && roll.rolls.some(r => r === 1);

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <History className="h-5 w-5" />
            Roll History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <History className="h-5 w-5" />
          Roll History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {rolls.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No rolls recorded yet. Start rolling!
            </p>
          ) : (
            <div className="space-y-2">
              {rolls.map((roll) => {
                const config = getRollConfig(roll.roll_type);
                const Icon = config.icon;
                const nat20 = isNat20(roll);
                const nat1 = isNat1(roll);

                return (
                  <div
                    key={roll.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-muted/30",
                      nat20 && "border-arise/50 bg-arise/5",
                      nat1 && "border-destructive/50 bg-destructive/5"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg bg-muted/50", config.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {roll.dice_formula}
                        </span>
                        <Badge variant="outline" className={cn("text-xs", config.color)}>
                          {config.label}
                        </Badge>
                        {nat20 && (
                          <Badge className="bg-arise text-white text-xs">
                            NAT 20!
                          </Badge>
                        )}
                        {nat1 && (
                          <Badge variant="destructive" className="text-xs">
                            NAT 1
                          </Badge>
                        )}
                      </div>
                      {roll.context && (
                        <p className="text-xs text-muted-foreground truncate">
                          {formatMonarchVernacular(roll.context)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(roll.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className={cn(
                        "text-xl font-bold",
                        nat20 && "text-arise",
                        nat1 && "text-destructive",
                        !nat20 && !nat1 && "text-foreground"
                      )}>
                        {roll.result}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        [{roll.rolls.join(', ')}]
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
