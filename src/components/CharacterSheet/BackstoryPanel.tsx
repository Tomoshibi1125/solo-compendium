import React, { useState } from 'react';
import { ScrollText, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackstoryPanelProps {
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  appearance?: string;
  backstory?: string;
  isEditing: boolean;
  onUpdate: (field: string, value: string) => void;
}

const FIELDS: { key: string; label: string }[] = [
  { key: 'personalityTraits', label: 'Personality Traits' },
  { key: 'ideals', label: 'Ideals' },
  { key: 'bonds', label: 'Bonds' },
  { key: 'flaws', label: 'Flaws' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'backstory', label: 'Backstory' },
];

export function BackstoryPanel({
  personalityTraits,
  ideals,
  bonds,
  flaws,
  appearance,
  backstory,
  isEditing,
  onUpdate,
}: BackstoryPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const values: Record<string, string | undefined> = {
    personalityTraits,
    ideals,
    bonds,
    flaws,
    appearance,
    backstory,
  };

  const hasAny = Object.values(values).some((v) => v && v.trim().length > 0);

  if (!hasAny && !isEditing) return null;

  return (
    <div className="rounded-lg border">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <ScrollText className="h-4 w-4" /> Backstory &amp; Personality
        </span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t pt-3">
          {FIELDS.map(({ key, label }) => {
            const val = values[key] || '';
            return (
              <div key={key}>
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                {isEditing ? (
                  <textarea
                    value={val}
                    onChange={(e) => onUpdate(key, e.target.value)}
                    rows={key === 'backstory' ? 4 : 2}
                    className="mt-1 w-full px-2 py-1 border rounded text-sm resize-y"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                ) : (
                  <p className={cn('text-sm mt-0.5', val ? '' : 'text-muted-foreground italic')}>
                    {val || `No ${label.toLowerCase()} set.`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
