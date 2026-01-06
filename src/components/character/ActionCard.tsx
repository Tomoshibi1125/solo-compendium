import { memo } from 'react';
import { Zap, Sword, Wand2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { formatModifier } from '@/lib/characterCalculations';
import { useNavigate } from 'react-router-dom';
import { rollDiceString, formatRollResult } from '@/lib/diceRoller';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  name: string;
  type: 'action' | 'bonus-action' | 'reaction' | 'passive';
  description: string;
  attackBonus?: number;
  damage?: string;
  range?: string;
  uses?: { current: number; max: number };
  recharge?: string;
  onRoll?: (rollType: 'attack' | 'damage' | 'check') => void;
  className?: string;
}

const TYPE_ICONS = {
  'action': Sword,
  'bonus-action': Zap,
  'reaction': Shield,
  'passive': Wand2,
};

const TYPE_LABELS = {
  'action': 'Action',
  'bonus-action': 'Bonus Action',
  'reaction': 'Reaction',
  'passive': 'Passive',
};

export function ActionCard({
  name,
  type,
  description,
  attackBonus,
  damage,
  range,
  uses,
  recharge,
  onRoll,
  className,
}: ActionCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const Icon = TYPE_ICONS[type];

  const handleRoll = (rollType: 'attack' | 'damage' | 'check') => {
    if (onRoll) {
      onRoll(rollType);
      return;
    }

    try {
      let roll;
      let message = '';

      if (rollType === 'attack' && attackBonus !== undefined) {
        roll = rollDiceString(`1d20+${attackBonus}`);
        message = `${name} Attack: ${formatRollResult(roll)}`;
        if (roll.result === 20 + attackBonus) {
          message += ' 🎯 CRITICAL HIT!';
        } else if (roll.result === 1 + attackBonus) {
          message += ' 💀 CRITICAL MISS!';
        }
      } else if (rollType === 'damage' && damage) {
        // Parse damage string (e.g., "1d8+3" or "2d6")
        const damageMatch = damage.match(/(\d+)d(\d+)([+-]\d+)?/);
        if (damageMatch) {
          const diceStr = `${damageMatch[1]}d${damageMatch[2]}${damageMatch[3] || ''}`;
          roll = rollDiceString(diceStr);
          message = `${name} Damage: ${formatRollResult(roll)}`;
        } else {
          toast({
            title: 'Invalid damage',
            description: 'Could not parse damage string.',
            variant: 'destructive',
          });
          return;
        }
      } else {
        // Navigate to dice roller for other cases
        const params = new URLSearchParams();
        if (rollType === 'attack' && attackBonus !== undefined) {
          params.set('dice', '1d20');
          params.set('modifier', attackBonus.toString());
        }
        navigate(`/dice?${params.toString()}`);
        return;
      }

      toast({
        title: 'Dice Roll',
        description: message,
      });
    } catch (error) {
      toast({
        title: 'Roll failed',
        description: 'Could not execute roll.',
        variant: 'destructive',
      });
    }
  };

  return (
    <SystemWindow title={name.toUpperCase()} className={cn("border-primary/30", className)}>
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Icon className="w-4 h-4 text-primary" />
          <Badge variant="secondary" className="text-xs">
            {TYPE_LABELS[type]}
          </Badge>
          {range && (
            <Badge variant="outline" className="text-xs">
              {range}
            </Badge>
          )}
          {uses && (
            <Badge variant={uses.current > 0 ? "default" : "destructive"} className="text-xs">
              Uses: {uses.current}/{uses.max}
            </Badge>
          )}
          {inscriptionId && uses && uses.current > 0 && onUse && (
            <Button
              variant="outline"
              size="sm"
              onClick={onUse}
              className="h-6 text-xs"
            >
              Use
            </Button>
          )}
          {recharge && (
            <Badge variant="outline" className="text-xs">
              Recharge: {recharge}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>

        {(attackBonus !== undefined || damage) && (
          <div className="flex gap-2 pt-2 border-t border-border/50">
            {attackBonus !== undefined && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRoll('attack')}
                className="flex-1 gap-2"
                aria-label={`Roll attack for ${name}`}
              >
                <Sword className="w-4 h-4" />
                Attack: {formatModifier(attackBonus)}
              </Button>
            )}
            {damage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRoll('damage')}
                className="flex-1 gap-2"
                aria-label={`Roll damage for ${name}`}
              >
                <Zap className="w-4 h-4" />
                Damage: {damage}
              </Button>
            )}
          </div>
        )}
      </div>
    </SystemWindow>
  );
}

export const ActionCard = memo(ActionCardComponent, (prevProps, nextProps) => {
  // Custom comparison - only re-render if props actually change
  return (
    prevProps.name === nextProps.name &&
    prevProps.type === nextProps.type &&
    prevProps.attackBonus === nextProps.attackBonus &&
    prevProps.damage === nextProps.damage &&
    prevProps.range === nextProps.range &&
    prevProps.uses?.current === nextProps.uses?.current &&
    prevProps.uses?.max === nextProps.uses?.max &&
    prevProps.recharge === nextProps.recharge
  );
});

