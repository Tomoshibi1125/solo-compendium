import React from 'react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SensesDisplayProps {
  senses?: string[];
  passivePerception: number;
  passiveInvestigation: number;
  passiveInsight: number;
}

export function SensesDisplay({
  senses = [],
  passivePerception,
  passiveInvestigation,
  passiveInsight,
}: SensesDisplayProps) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
        <Eye className="h-4 w-4" /> Senses
      </h2>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded border p-2 bg-muted/30">
          <div className="text-[10px] text-muted-foreground">Passive Perception</div>
          <div className="text-lg font-bold">{passivePerception}</div>
        </div>
        <div className="rounded border p-2 bg-muted/30">
          <div className="text-[10px] text-muted-foreground">Passive Investigation</div>
          <div className="text-lg font-bold">{passiveInvestigation}</div>
        </div>
        <div className="rounded border p-2 bg-muted/30">
          <div className="text-[10px] text-muted-foreground">Passive Insight</div>
          <div className="text-lg font-bold">{passiveInsight}</div>
        </div>
      </div>

      {senses.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {senses.map((s) => (
            <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
