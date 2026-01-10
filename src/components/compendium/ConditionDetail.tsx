import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface ConditionData {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  effects?: string[];
}

export const ConditionDetail = ({ data }: { data: ConditionData }) => {
  const displayName = data.display_name || data.name;

  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemWindow title={displayName.toUpperCase()} className="border-yellow-500/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
          <p className="text-foreground">{data.description}</p>
        </div>
      </SystemWindow>

      {/* Effects */}
      {data.effects && data.effects.length > 0 && (
        <SystemWindow title="EFFECTS">
          <ul className="space-y-3">
            {data.effects.map((effect, i) => (
              <li key={i} className="flex items-start gap-3 border-l-2 border-yellow-500/30 pl-4">
                <span className="text-foreground">{effect}</span>
              </li>
            ))}
          </ul>
        </SystemWindow>
      )}
    </div>
  );
};