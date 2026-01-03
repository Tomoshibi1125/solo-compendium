import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Zap, BookOpen } from 'lucide-react';

interface SkillData {
  id: string;
  name: string;
  description: string;
  ability: string;
  examples?: string[];
  source_book?: string;
}

const abilityColors: Record<string, string> = {
  STR: 'text-red-400 border-red-500/30',
  AGI: 'text-green-400 border-green-500/30',
  VIT: 'text-orange-400 border-orange-500/30',
  INT: 'text-blue-400 border-blue-500/30',
  SENSE: 'text-purple-400 border-purple-500/30',
  PRE: 'text-pink-400 border-pink-500/30',
};

export const SkillDetail = ({ data }: { data: SkillData }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemWindow title={data.name.toUpperCase()} className={abilityColors[data.ability]}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <Badge variant="secondary" className={abilityColors[data.ability]}>
              {data.ability}
            </Badge>
          </div>
          <p className="text-foreground">{data.description}</p>
        </div>
      </SystemWindow>

      {/* Linked Ability */}
      <SystemWindow title="LINKED ABILITY" compact>
        <div className="flex items-center gap-3">
          <div className={`font-display text-3xl ${abilityColors[data.ability]}`}>
            {data.ability}
          </div>
          <div className="text-muted-foreground">
            Add your {data.ability} modifier to checks using this skill
          </div>
        </div>
      </SystemWindow>

      {/* Examples */}
      {data.examples && data.examples.length > 0 && (
        <SystemWindow title="EXAMPLE USES">
          <ul className="space-y-3">
            {data.examples.map((example, i) => (
              <li key={i} className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{example}</span>
              </li>
            ))}
          </ul>
        </SystemWindow>
      )}

      {data.source_book && (
        <div className="flex justify-end">
          <Badge variant="outline">{data.source_book}</Badge>
        </div>
      )}
    </div>
  );
};