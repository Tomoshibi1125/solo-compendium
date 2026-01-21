import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Zap, Timer, Target, Heart, Sparkles } from 'lucide-react';
import { CompendiumImage } from '@/components/compendium/CompendiumImage';
import { formatMonarchVernacular } from '@/lib/vernacular';

interface SpellData {
  id: string;
  name: string;
  display_name?: string | null;
  description?: string | null;
  spell_type?: string | null;
  rank?: string | null;
  mana_cost?: number | null;
  damage?: number | null;
  healing?: number | null;
  effect?: string | null;
  range?: number | null;
  cooldown?: number | null;
  source_book?: string | null;
  image_url?: string | null;
  image?: string | null;
}

const rankStyles: Record<string, string> = {
  S: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  A: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
  B: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
  C: 'text-green-400 border-green-500/40 bg-green-500/10',
  D: 'text-muted-foreground border-border bg-card',
};

export const SpellDetail = ({ data }: { data: SpellData }) => {
  const displayName = formatMonarchVernacular(data.display_name || data.name);
  const imageSrc = data.image_url || data.image || undefined;
  const rankStyle = data.rank ? rankStyles[data.rank] : undefined;

  return (
    <div className="space-y-6">
      {imageSrc && (
        <div className="w-full flex justify-center">
          <CompendiumImage
            src={imageSrc}
            alt={displayName}
            size="large"
            aspectRatio="square"
            className="max-w-md"
            fallbackIcon={<Sparkles className="w-32 h-32 text-muted-foreground" />}
          />
        </div>
      )}

      <SystemWindow title={displayName.toUpperCase()}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {data.spell_type && <Badge variant="secondary">{formatMonarchVernacular(data.spell_type)}</Badge>}
            {data.rank && (
              <Badge variant="outline" className={rankStyle}>
                Rank {data.rank}
              </Badge>
            )}
            {data.source_book && <Badge variant="outline">{formatMonarchVernacular(data.source_book)}</Badge>}
          </div>
        </div>
      </SystemWindow>

      <div id="spell-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-mt-4">
        {data.mana_cost !== null && data.mana_cost !== undefined && (
          <SystemWindow title="MANA COST" compact>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="font-heading">{data.mana_cost}</span>
            </div>
          </SystemWindow>
        )}

        {data.range !== null && data.range !== undefined && (
          <SystemWindow title="RANGE" compact>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span className="font-heading">{data.range} ft</span>
            </div>
          </SystemWindow>
        )}

        {data.cooldown !== null && data.cooldown !== undefined && (
          <SystemWindow title="COOLDOWN" compact>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-amber-400" />
              <span className="font-heading">{data.cooldown} rounds</span>
            </div>
          </SystemWindow>
        )}

        {data.damage !== null && data.damage !== undefined && (
          <SystemWindow title="DAMAGE" compact>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span className="font-heading">{data.damage}</span>
            </div>
          </SystemWindow>
        )}

        {data.healing !== null && data.healing !== undefined && (
          <SystemWindow title="HEALING" compact>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              <span className="font-heading">{data.healing}</span>
            </div>
          </SystemWindow>
        )}
      </div>

      {data.effect && (
        <SystemWindow id="spell-effect" title="EFFECT">
          <p className="text-foreground leading-relaxed">{formatMonarchVernacular(data.effect)}</p>
        </SystemWindow>
      )}

      {data.description && (
        <SystemWindow id="spell-description" title="DESCRIPTION">
          <p className="text-foreground leading-relaxed">{formatMonarchVernacular(data.description)}</p>
        </SystemWindow>
      )}
    </div>
  );
};
