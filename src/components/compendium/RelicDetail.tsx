import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Gem, Sparkles, AlertTriangle, Coins } from 'lucide-react';
import { CompendiumImage } from '@/components/compendium/CompendiumImage';

interface RelicData {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  rarity: string;
  item_type: string;
  relic_tier?: string;
  requires_attunement: boolean;
  attunement_requirements?: string;
  properties?: string[];
  quirks?: string[];
  corruption_risk?: string;
  value_credits?: number;
  tags?: string[];
  source_book?: string;
  image_url?: string | null;
}

const rarityColors: Record<string, string> = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  very_rare: 'bg-purple-500',
  legendary: 'bg-amber-500',
};

const tierColors: Record<string, string> = {
  dormant: 'text-gray-400 border-gray-500/30',
  awakened: 'text-blue-400 border-blue-500/30',
  resonant: 'text-purple-400 border-purple-500/30',
  E: 'text-gray-400 border-gray-500/30',
  D: 'text-gray-300 border-gray-400/30',
  C: 'text-green-400 border-green-500/30',
  B: 'text-blue-400 border-blue-500/30',
  A: 'text-purple-400 border-purple-500/30',
  S: 'text-amber-400 border-amber-500/30',
  SS: 'text-red-400 border-red-500/30',
};

export const RelicDetail = ({ data }: { data: RelicData }) => {
  const displayName = data.display_name || data.name;

  return (
    <div className="space-y-6">
      {/* Relic Artwork */}
      {data.image_url && (
        <div className="w-full flex justify-center">
          <CompendiumImage
            src={data.image_url}
            alt={displayName}
            size="large"
            aspectRatio="square"
            className="max-w-md"
            fallbackIcon={<Gem className="w-32 h-32 text-muted-foreground" />}
          />
        </div>
      )}

      {/* Header */}
      <SystemWindow
        title={displayName.toUpperCase()}
        className={`border-2 ${tierColors[data.relic_tier || ''] || 'border-primary/50'}`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`${rarityColors[data.rarity]} text-white capitalize`}>
              {data.rarity.replace('_', ' ')}
            </Badge>
            <Badge variant="secondary">{data.item_type}</Badge>
            {data.relic_tier && (
              <Badge variant="outline" className={tierColors[data.relic_tier]}>
                {data.relic_tier}
              </Badge>
            )}
            {data.requires_attunement && (
              <Badge variant="destructive">Requires Attunement</Badge>
            )}
          </div>

          {data.attunement_requirements && (
            <p className="text-sm text-muted-foreground">
              <em>Attunement: {data.attunement_requirements}</em>
            </p>
          )}
        </div>
      </SystemWindow>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SystemWindow title="RARITY" compact>
          <div className="flex items-center gap-2">
            <Gem className={`w-5 h-5 ${rarityColors[data.rarity] ? 'text-white' : ''}`}
                 style={{ color: data.rarity === 'legendary' ? '#f59e0b' : undefined }} />
            <span className="font-heading capitalize">{data.rarity.replace('_', ' ')}</span>
          </div>
        </SystemWindow>

        {data.relic_tier && (
          <SystemWindow title="TIER" compact>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-heading capitalize">{data.relic_tier}</span>
            </div>
          </SystemWindow>
        )}

        {data.value_credits && (
          <SystemWindow title="VALUE" compact>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-heading">{data.value_credits.toLocaleString()} credits</span>
            </div>
          </SystemWindow>
        )}
      </div>

      {/* Description */}
      <SystemWindow title="DESCRIPTION">
        <p className="text-foreground whitespace-pre-wrap leading-relaxed text-base">{data.description}</p>
      </SystemWindow>

      {/* Properties */}
      {data.properties && data.properties.length > 0 && (
        <SystemWindow title="PROPERTIES">
          <ul className="space-y-2">
            {data.properties.map((prop, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-foreground">{prop}</span>
              </li>
            ))}
          </ul>
        </SystemWindow>
      )}

      {/* Quirks */}
      {data.quirks && data.quirks.length > 0 && (
        <SystemWindow title="QUIRKS">
          <ul className="space-y-2">
            {data.quirks.map((quirk, i) => (
              <li key={i} className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{quirk}</span>
              </li>
            ))}
          </ul>
        </SystemWindow>
      )}

      {/* Corruption Risk */}
      {data.corruption_risk && (
        <SystemWindow title="CORRUPTION RISK" className="border-red-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-foreground">{data.corruption_risk}</p>
          </div>
        </SystemWindow>
      )}

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  );
};