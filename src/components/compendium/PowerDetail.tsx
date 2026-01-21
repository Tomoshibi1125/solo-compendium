import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Timer, Zap, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular } from '@/lib/vernacular';

interface PowerData {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  power_level: number;
  school?: string;
  casting_time: string;
  range: string;
  duration: string;
  concentration: boolean;
  ritual: boolean;
  components?: string;
  higher_levels?: string;
  job_names?: string[];
  tags?: string[];
  source_book?: string;
}

const tierColors: Record<number, string> = {
  0: 'text-gray-400 border-gray-500/30',
  1: 'text-green-400 border-green-500/30',
  2: 'text-green-400 border-green-500/30',
  3: 'text-blue-400 border-blue-500/30',
  4: 'text-blue-400 border-blue-500/30',
  5: 'text-purple-400 border-purple-500/30',
  6: 'text-purple-400 border-purple-500/30',
  7: 'text-orange-400 border-orange-500/30',
  8: 'text-orange-400 border-orange-500/30',
  9: 'text-red-400 border-red-500/30',
};

export const PowerDetail = ({ data }: { data: PowerData }) => {
  const tierLabel = data.power_level === 0 ? 'Cantrip' : `Tier ${data.power_level}`;
  const tierColor = tierColors[data.power_level] || 'text-foreground';
  const displayName = formatMonarchVernacular(data.display_name || data.name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemWindow title={displayName.toUpperCase()} className={cn("border-2", tierColor)}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={tierColor}>{tierLabel}</Badge>
            {data.school && <Badge variant="secondary">{formatMonarchVernacular(data.school)}</Badge>}
            {data.concentration && <Badge variant="destructive">Concentration</Badge>}
            {data.ritual && <Badge variant="outline">Ritual</Badge>}
          </div>
          
          {data.job_names && data.job_names.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Jobs:</span>
              {data.job_names.map((job) => (
                <Badge key={job} variant="outline" className="text-xs">{formatMonarchVernacular(job)}</Badge>
              ))}
            </div>
          )}
        </div>
      </SystemWindow>

      {/* Casting Properties */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SystemWindow title="CASTING TIME" compact>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-heading">{formatMonarchVernacular(data.casting_time)}</span>
          </div>
        </SystemWindow>
        
        <SystemWindow title="RANGE" compact>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="font-heading">{formatMonarchVernacular(data.range)}</span>
          </div>
        </SystemWindow>
        
        <SystemWindow title="DURATION" compact>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-primary" />
            <span className="font-heading">{formatMonarchVernacular(data.duration)}</span>
          </div>
        </SystemWindow>
        
        <SystemWindow title="COMPONENTS" compact>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-heading">{formatMonarchVernacular(data.components || 'V, S')}</span>
          </div>
        </SystemWindow>
      </div>

      {/* Description */}
      <SystemWindow title="DESCRIPTION">
        <p className="text-foreground whitespace-pre-wrap leading-relaxed text-base">{formatMonarchVernacular(data.description)}</p>
      </SystemWindow>

      {/* At Higher Levels */}
      {data.higher_levels && (
        <SystemWindow title="AT HIGHER TIERS">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-foreground leading-relaxed text-base">{formatMonarchVernacular(data.higher_levels)}</p>
          </div>
        </SystemWindow>
      )}

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">{formatMonarchVernacular(tag)}</Badge>
          ))}
        </div>
      )}
    </div>
  );
};
