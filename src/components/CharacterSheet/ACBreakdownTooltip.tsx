import React from 'react';
import { Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { ACBreakdown } from '@/hooks/useArmorClass';

interface ACBreakdownTooltipProps {
  breakdown: ACBreakdown;
  children?: React.ReactNode;
}

export function ACBreakdownTooltip({ breakdown, children }: ACBreakdownTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <div className="flex items-center gap-2 cursor-default">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-xl font-bold text-blue-700">{breakdown.total}</span>
              <span className="text-sm text-blue-500">AC</span>
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-left space-y-1">
          <p className="font-semibold text-sm">Armor Class Breakdown</p>
          <p className="text-xs font-mono">{breakdown.formula}</p>
          <div className="text-xs space-y-0.5 pt-1 border-t">
            <div className="flex justify-between">
              <span>Base</span>
              <span>{breakdown.base}</span>
            </div>
            {breakdown.agiApplied !== 0 && (
              <div className="flex justify-between">
                <span>AGI modifier</span>
                <span>{breakdown.agiApplied >= 0 ? '+' : ''}{breakdown.agiApplied}</span>
              </div>
            )}
            {breakdown.shieldBonus > 0 && (
              <div className="flex justify-between">
                <span>Shield</span>
                <span>+{breakdown.shieldBonus}</span>
              </div>
            )}
            {breakdown.magicalBonus > 0 && (
              <div className="flex justify-between">
                <span>Magical bonus</span>
                <span>+{breakdown.magicalBonus}</span>
              </div>
            )}
            {breakdown.otherBonuses !== 0 && (
              <div className="flex justify-between">
                <span>Other</span>
                <span>{breakdown.otherBonuses >= 0 ? '+' : ''}{breakdown.otherBonuses}</span>
              </div>
            )}
          </div>
          {breakdown.warnings.length > 0 && (
            <div className="pt-1 border-t">
              {breakdown.warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-400">⚠ {w}</p>
              ))}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
