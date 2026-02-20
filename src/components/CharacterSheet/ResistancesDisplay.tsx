import React from 'react';
import { ShieldCheck, ShieldX, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResistancesDisplayProps {
  resistances?: string[];
  immunities?: string[];
  vulnerabilities?: string[];
  conditionImmunities?: string[];
}

export function ResistancesDisplay({
  resistances = [],
  immunities = [],
  vulnerabilities = [],
  conditionImmunities = [],
}: ResistancesDisplayProps) {
  const hasAny =
    resistances.length > 0 ||
    immunities.length > 0 ||
    vulnerabilities.length > 0 ||
    conditionImmunities.length > 0;

  if (!hasAny) return null;

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground">Defenses</h2>

      {resistances.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600">
            <ShieldCheck className="h-3 w-3" /> Resistances
          </div>
          <div className="flex flex-wrap gap-1">
            {resistances.map((r) => (
              <Badge key={r} variant="outline" className="text-[10px] border-blue-300 text-blue-700">{r}</Badge>
            ))}
          </div>
        </div>
      )}

      {immunities.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
            <ShieldCheck className="h-3 w-3" /> Immunities
          </div>
          <div className="flex flex-wrap gap-1">
            {immunities.map((i) => (
              <Badge key={i} variant="outline" className="text-[10px] border-green-300 text-green-700">{i}</Badge>
            ))}
          </div>
        </div>
      )}

      {vulnerabilities.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
            <ShieldX className="h-3 w-3" /> Vulnerabilities
          </div>
          <div className="flex flex-wrap gap-1">
            {vulnerabilities.map((v) => (
              <Badge key={v} variant="outline" className="text-[10px] border-red-300 text-red-700">{v}</Badge>
            ))}
          </div>
        </div>
      )}

      {conditionImmunities.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
            <ShieldAlert className="h-3 w-3" /> Condition Immunities
          </div>
          <div className="flex flex-wrap gap-1">
            {conditionImmunities.map((c) => (
              <Badge key={c} variant="outline" className="text-[10px] border-amber-300 text-amber-700">{c}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
