import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { MapPin, Skull, Gem } from 'lucide-react';
import { CompendiumImage } from '@/components/compendium/CompendiumImage';

interface LocationData {
  id: string;
  name: string;
  display_name?: string | null;
  description?: string | null;
  location_type?: string | null;
  rank?: string | null;
  encounters?: string[] | null;
  treasures?: string[] | null;
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

export const LocationDetail = ({ data }: { data: LocationData }) => {
  const displayName = data.display_name || data.name;
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
            fallbackIcon={<MapPin className="w-32 h-32 text-muted-foreground" />}
          />
        </div>
      )}

      <SystemWindow title={displayName.toUpperCase()}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {data.location_type && <Badge variant="secondary">{data.location_type}</Badge>}
            {data.rank && (
              <Badge variant="outline" className={rankStyle}>
                Rank {data.rank}
              </Badge>
            )}
            {data.source_book && <Badge variant="outline">{data.source_book}</Badge>}
          </div>
        </div>
      </SystemWindow>

      {data.description && (
        <SystemWindow id="location-details" title="DETAILS">
          <p className="text-foreground leading-relaxed">{data.description}</p>
        </SystemWindow>
      )}

      {data.encounters && data.encounters.length > 0 && (
        <SystemWindow id="location-encounters" title="ENCOUNTERS">
          <ul className="space-y-2">
            {data.encounters.map((encounter) => (
              <li key={encounter} className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-rose-400" />
                <span className="text-muted-foreground">{encounter}</span>
              </li>
            ))}
          </ul>
        </SystemWindow>
      )}

      {data.treasures && data.treasures.length > 0 && (
        <SystemWindow id="location-treasures" title="TREASURES">
          <ul className="space-y-2">
            {data.treasures.map((treasure) => (
              <li key={treasure} className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-amber-400" />
                <span className="text-muted-foreground">{treasure}</span>
              </li>
            ))}
          </ul>
        </SystemWindow>
      )}
    </div>
  );
};
