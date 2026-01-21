import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Shield, Swords } from 'lucide-react';
import { CompendiumImage } from '@/components/compendium/CompendiumImage';
import { formatMonarchVernacular } from '@/lib/vernacular';

interface ArtifactAbility {
  name: string;
  description: string;
  type: string;
  frequency?: string;
  action?: string;
}

interface ArtifactData {
  id: string;
  name: string;
  display_name?: string | null;
  description?: string | null;
  artifact_type?: string | null;
  rarity?: string | null;
  attunement?: boolean | null;
  requirements?: {
    level?: number;
    class?: string;
    ability?: string;
    score?: number;
    alignment?: string;
    quest?: string;
  } | null;
  properties?: {
    magical?: boolean;
    unique?: boolean;
    sentient?: boolean;
    cursed?: boolean;
    legendary?: boolean;
  } | null;
  abilities?: {
    primary?: ArtifactAbility;
    secondary?: ArtifactAbility;
    tertiary?: ArtifactAbility;
    ultimate?: ArtifactAbility;
  } | null;
  lore?: {
    origin?: string;
    history?: string;
    curse?: string;
    personality?: string;
  } | null;
  mechanics?: {
    bonus?: { type?: string; value?: number; ability?: string; skills?: string[] };
    immunity?: string[];
    resistance?: string[];
    vulnerability?: string[];
    special?: string[];
  } | null;
  source_book?: string | null;
  image_url?: string | null;
  image?: string | null;
}

const rarityStyles: Record<string, string> = {
  legendary: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  mythic: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
  divine: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
};

export const ArtifactDetail = ({ data }: { data: ArtifactData }) => {
  const displayName = formatMonarchVernacular(data.display_name || data.name);
  const imageSrc = data.image_url || data.image || undefined;
  const rarityStyle = data.rarity ? rarityStyles[data.rarity] : undefined;

  const abilities = data.abilities || undefined;
  const abilityList: Array<{ label: string; ability: ArtifactAbility | undefined }> = [
    { label: 'Primary', ability: abilities?.primary },
    { label: 'Secondary', ability: abilities?.secondary },
    { label: 'Tertiary', ability: abilities?.tertiary },
    { label: 'Ultimate', ability: abilities?.ultimate },
  ];

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
            fallbackIcon={<Crown className="w-32 h-32 text-muted-foreground" />}
          />
        </div>
      )}

      <SystemWindow title={displayName.toUpperCase()}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {data.artifact_type && <Badge variant="secondary">{formatMonarchVernacular(data.artifact_type)}</Badge>}
            {data.rarity && (
              <Badge variant="outline" className={rarityStyle}>
                {formatMonarchVernacular(data.rarity)}
              </Badge>
            )}
            {data.attunement && <Badge variant="destructive">Requires Attunement</Badge>}
            {data.source_book && <Badge variant="outline">{formatMonarchVernacular(data.source_book)}</Badge>}
          </div>
          {data.description && (
            <p className="text-muted-foreground leading-relaxed">{formatMonarchVernacular(data.description)}</p>
          )}
        </div>
      </SystemWindow>

      {data.requirements && (
        <SystemWindow title="REQUIREMENTS">
          <ul className="space-y-2 text-sm">
            {data.requirements.level !== undefined && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Level {data.requirements.level}</span>
              </li>
            )}
            {data.requirements.class && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Class: {formatMonarchVernacular(data.requirements.class)}</span>
              </li>
            )}
            {data.requirements.ability && data.requirements.score !== undefined && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>{formatMonarchVernacular(data.requirements.ability)} {data.requirements.score}+</span>
              </li>
            )}
            {data.requirements.alignment && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Alignment: {formatMonarchVernacular(data.requirements.alignment)}</span>
              </li>
            )}
            {data.requirements.quest && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>{formatMonarchVernacular(data.requirements.quest)}</span>
              </li>
            )}
          </ul>
        </SystemWindow>
      )}

      {data.properties && (
        <SystemWindow id="artifact-properties" title="PROPERTIES">
          <div className="flex flex-wrap gap-2">
            {data.properties.magical && <Badge variant="secondary">Magical</Badge>}
            {data.properties.unique && <Badge variant="secondary">Unique</Badge>}
            {data.properties.sentient && <Badge variant="secondary">Sentient</Badge>}
            {data.properties.cursed && <Badge variant="destructive">Cursed</Badge>}
            {data.properties.legendary && <Badge variant="outline">Legendary</Badge>}
          </div>
        </SystemWindow>
      )}

      {abilities && (
        <SystemWindow id="artifact-abilities" title="ABILITIES">
          <div className="space-y-4">
            {abilityList.map(({ label, ability }) => (
              ability ? (
                <div key={label} className="space-y-1 border-l-2 border-primary/40 pl-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-heading font-semibold">{formatMonarchVernacular(ability.name)}</span>
                    <Badge variant="outline" className="text-xs">{label}</Badge>
                    <Badge variant="secondary" className="text-xs">{formatMonarchVernacular(ability.type)}</Badge>
                    {ability.frequency && <Badge variant="outline" className="text-xs">{formatMonarchVernacular(ability.frequency)}</Badge>}
                    {ability.action && <Badge variant="outline" className="text-xs">{formatMonarchVernacular(ability.action)}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{formatMonarchVernacular(ability.description)}</p>
                </div>
              ) : null
            ))}
          </div>
        </SystemWindow>
      )}

      {data.lore && (
        <SystemWindow id="artifact-lore" title="LORE">
          <div className="space-y-3">
            {data.lore.origin && (
              <p className="text-sm text-muted-foreground"><span className="text-foreground">Origin:</span> {formatMonarchVernacular(data.lore.origin)}</p>
            )}
            {data.lore.history && (
              <p className="text-sm text-muted-foreground"><span className="text-foreground">History:</span> {formatMonarchVernacular(data.lore.history)}</p>
            )}
            {data.lore.curse && (
              <p className="text-sm text-muted-foreground"><span className="text-foreground">Curse:</span> {formatMonarchVernacular(data.lore.curse)}</p>
            )}
            {data.lore.personality && (
              <p className="text-sm text-muted-foreground"><span className="text-foreground">Personality:</span> {formatMonarchVernacular(data.lore.personality)}</p>
            )}
          </div>
        </SystemWindow>
      )}

      {data.mechanics && (
        <SystemWindow id="artifact-mechanics" title="MECHANICS">
          <div className="space-y-3 text-sm">
            {data.mechanics.bonus && (
              <div className="flex items-start gap-2">
                <Swords className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-foreground">
                    Bonus: {formatMonarchVernacular(data.mechanics.bonus.type || '')} +{data.mechanics.bonus.value}
                  </p>
                  {data.mechanics.bonus.ability && (
                    <p className="text-muted-foreground">Ability: {formatMonarchVernacular(data.mechanics.bonus.ability)}</p>
                  )}
                  {data.mechanics.bonus.skills && data.mechanics.bonus.skills.length > 0 && (
                    <p className="text-muted-foreground">Skills: {data.mechanics.bonus.skills.map(formatMonarchVernacular).join(', ')}</p>
                  )}
                </div>
              </div>
            )}
            {data.mechanics.immunity && data.mechanics.immunity.length > 0 && (
              <p><span className="text-foreground">Immunity:</span> {data.mechanics.immunity.map(formatMonarchVernacular).join(', ')}</p>
            )}
            {data.mechanics.resistance && data.mechanics.resistance.length > 0 && (
              <p><span className="text-foreground">Resistance:</span> {data.mechanics.resistance.map(formatMonarchVernacular).join(', ')}</p>
            )}
            {data.mechanics.vulnerability && data.mechanics.vulnerability.length > 0 && (
              <p><span className="text-foreground">Vulnerability:</span> {data.mechanics.vulnerability.map(formatMonarchVernacular).join(', ')}</p>
            )}
            {data.mechanics.special && data.mechanics.special.length > 0 && (
              <div>
                <p className="text-foreground">Special:</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  {data.mechanics.special.map((entry) => (
                    <li key={entry}>{formatMonarchVernacular(entry)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SystemWindow>
      )}
    </div>
  );
};
