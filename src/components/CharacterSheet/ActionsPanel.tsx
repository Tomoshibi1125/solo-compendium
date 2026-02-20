import React from 'react';
import { Swords, Target, Sparkles, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { CharacterAction } from '@/lib/5eRulesEngine';
import { formatModifier } from '@/lib/5eRulesEngine';
import { cn } from '@/lib/utils';

interface ActionsPanelProps {
  actions?: CharacterAction[];
}

const TYPE_ICON: Record<CharacterAction['type'], React.ReactNode> = {
  melee: <Swords className="h-4 w-4 text-red-500" />,
  ranged: <Target className="h-4 w-4 text-green-500" />,
  spell: <Sparkles className="h-4 w-4 text-purple-500" />,
  other: <MoreHorizontal className="h-4 w-4 text-gray-500" />,
};

export function ActionsPanel({ actions = [] }: ActionsPanelProps) {
  if (actions.length === 0) return null;

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
        <Swords className="h-4 w-4" /> Actions
      </h2>
      <div className="space-y-2">
        {actions.map((action) => (
          <TooltipProvider key={action.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-between rounded border px-3 py-2 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    {TYPE_ICON[action.type]}
                    <span className="text-sm font-medium">{action.name}</span>
                    {action.properties && action.properties.length > 0 && (
                      <div className="flex gap-1">
                        {action.properties.map((p) => (
                          <Badge key={p} variant="outline" className="text-[9px] h-4 px-1">{p}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {action.attackBonus !== undefined && (
                      <span className="font-mono font-bold text-blue-600">
                        {formatModifier(action.attackBonus)}
                      </span>
                    )}
                    {action.damage && (
                      <span className="font-mono text-red-600">
                        {action.damage}
                        {action.damageType && (
                          <span className="text-muted-foreground text-xs ml-1">{action.damageType}</span>
                        )}
                      </span>
                    )}
                    {action.range && (
                      <span className="text-xs text-muted-foreground">{action.range}</span>
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              {action.description && (
                <TooltipContent side="bottom" className="max-w-xs text-left">
                  <p className="text-xs">{action.description}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
