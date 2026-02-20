import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface FeaturesTraitsProps {
  features: string[];
}

export function FeaturesTraits({ features }: FeaturesTraitsProps) {
  const [expanded, setExpanded] = useState(false);

  if (features.length === 0) return null;

  const visible = expanded ? features : features.slice(0, 5);

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
        <BookOpen className="h-4 w-4" /> Features &amp; Traits
      </h2>
      <ul className="space-y-1">
        {visible.map((f, i) => (
          <li key={i} className="text-sm flex items-start gap-1.5">
            <span className="text-muted-foreground mt-0.5">•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {features.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          {expanded ? (
            <>Show less <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Show all {features.length} <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}
    </div>
  );
}
