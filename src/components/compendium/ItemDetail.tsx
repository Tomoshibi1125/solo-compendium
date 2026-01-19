import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Coins, Weight, Zap, Sparkles, Shield, Swords, Heart } from 'lucide-react';
import { CompendiumImage } from '@/components/compendium/CompendiumImage';

interface ItemData {
  id: string;
  name: string;
  display_name?: string | null;
  description?: string | null;
  item_type?: string | null;
  rarity?: string | null;
  value?: number | null;
  weight?: number | null;
  requirements?: {
    level?: number;
    class?: string[];
    race?: string[];
    alignment?: string[];
  } | null;
  properties?: {
    weapon?: {
      damage?: string;
      damageType?: string;
      range?: number;
      versatile?: string;
      finesse?: boolean;
    };
    magical?: {
      bonus?: {
        attack?: number;
        damage?: number;
        armorClass?: number;
        savingThrows?: string[];
        abilityScores?: Record<string, number>;
      };
      resistance?: string[];
      immunity?: string[];
      vulnerability?: string[];
    };
  } | null;
  effects?: {
    passive?: string[];
    active?: {
      name: string;
      description: string;
      action?: string;
      frequency?: string;
      dc?: number;
    }[];
    value?: number;
  } | null;
  attunement?: boolean | null;
  cursed?: boolean | null;
  charges?: {
    max: number;
    current: number;
    recharge?: string;
  } | null;
  stats?: {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
  } | null;
  effect?: string | null;
  source_book?: string | null;
  image_url?: string | null;
  image?: string | null;
}

const rarityStyles: Record<string, string> = {
  common: 'text-muted-foreground border-border bg-card',
  uncommon: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  rare: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
  epic: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
  legendary: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
};

export const ItemDetail = ({ data }: { data: ItemData }) => {
  const displayName = data.display_name || data.name;
  const imageSrc = data.image_url || data.image || undefined;
  const rarityStyle = data.rarity ? rarityStyles[data.rarity] : undefined;
  const weapon = data.properties?.weapon;
  const magical = data.properties?.magical;

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
            {data.item_type && <Badge variant="secondary">{data.item_type}</Badge>}
            {data.rarity && (
              <Badge variant="outline" className={rarityStyle}>
                {data.rarity}
              </Badge>
            )}
            {data.attunement && <Badge variant="destructive">Requires Attunement</Badge>}
            {data.cursed && <Badge variant="destructive">Cursed</Badge>}
            {data.source_book && <Badge variant="outline">{data.source_book}</Badge>}
          </div>
        </div>
      </SystemWindow>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.value !== null && data.value !== undefined && (
          <SystemWindow title="VALUE" compact>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-heading">{data.value}</span>
            </div>
          </SystemWindow>
        )}
        {data.weight !== null && data.weight !== undefined && (
          <SystemWindow title="WEIGHT" compact>
            <div className="flex items-center gap-2">
              <Weight className="w-5 h-5 text-muted-foreground" />
              <span className="font-heading">{data.weight} lbs</span>
            </div>
          </SystemWindow>
        )}
        {data.charges && (
          <SystemWindow title="CHARGES" compact>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="font-heading">{data.charges.current}/{data.charges.max}</span>
            </div>
            {data.charges.recharge && (
              <span className="text-xs text-muted-foreground">{data.charges.recharge} recharge</span>
            )}
          </SystemWindow>
        )}
      </div>

      {data.requirements && (
        <SystemWindow title="REQUIREMENTS">
          <ul className="space-y-2 text-sm">
            {data.requirements.level !== undefined && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Level {data.requirements.level}</span>
              </li>
            )}
            {data.requirements.class && data.requirements.class.length > 0 && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Classes: {data.requirements.class.join(', ')}</span>
              </li>
            )}
            {data.requirements.race && data.requirements.race.length > 0 && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Races: {data.requirements.race.join(', ')}</span>
              </li>
            )}
            {data.requirements.alignment && data.requirements.alignment.length > 0 && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Alignment: {data.requirements.alignment.join(', ')}</span>
              </li>
            )}
          </ul>
        </SystemWindow>
      )}

      {(weapon || magical) && (
        <SystemWindow id="item-properties" title="PROPERTIES">
          <div className="space-y-4 text-sm">
            {weapon && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-rose-400" />
                  <span className="font-heading">Weapon Profile</span>
                </div>
                <p className="text-muted-foreground">
                  {weapon.damage ? `Damage: ${weapon.damage}` : 'Damage varies'}
                  {weapon.damageType ? ` (${weapon.damageType})` : ''}
                  {weapon.range ? ` | Range: ${weapon.range} ft` : ''}
                </p>
                {weapon.versatile && (
                  <p className="text-muted-foreground">Versatile: {weapon.versatile}</p>
                )}
                {weapon.finesse && (
                  <p className="text-muted-foreground">Finesse weapon</p>
                )}
              </div>
            )}
            {magical && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="font-heading">Magical Traits</span>
                </div>
                {magical.bonus && (
                  <ul className="space-y-1 text-muted-foreground">
                    {magical.bonus.attack !== undefined && <li>Attack bonus: +{magical.bonus.attack}</li>}
                    {magical.bonus.damage !== undefined && <li>Damage bonus: +{magical.bonus.damage}</li>}
                    {magical.bonus.armorClass !== undefined && <li>Armor Class: +{magical.bonus.armorClass}</li>}
                    {magical.bonus.savingThrows && magical.bonus.savingThrows.length > 0 && (
                      <li>Saving throws: {magical.bonus.savingThrows.join(', ')}</li>
                    )}
                    {magical.bonus.abilityScores && (
                      <li>
                        Ability boosts:{' '}
                        {Object.entries(magical.bonus.abilityScores)
                          .map(([key, value]) => `${key} +${value}`)
                          .join(', ')}
                      </li>
                    )}
                  </ul>
                )}
                {magical.resistance && magical.resistance.length > 0 && (
                  <p className="text-muted-foreground">Resistance: {magical.resistance.join(', ')}</p>
                )}
                {magical.immunity && magical.immunity.length > 0 && (
                  <p className="text-muted-foreground">Immunity: {magical.immunity.join(', ')}</p>
                )}
                {magical.vulnerability && magical.vulnerability.length > 0 && (
                  <p className="text-muted-foreground">Vulnerability: {magical.vulnerability.join(', ')}</p>
                )}
              </div>
            )}
          </div>
        </SystemWindow>
      )}

      {(data.effects || data.effect) && (
        <SystemWindow id="item-effects" title="EFFECTS">
          <div className="space-y-4 text-sm">
            {data.effects?.passive && data.effects.passive.length > 0 && (
              <div>
                <p className="font-heading text-foreground">Passive</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  {data.effects.passive.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.effects?.active && data.effects.active.length > 0 && (
              <div className="space-y-3">
                <p className="font-heading text-foreground">Active</p>
                {data.effects.active.map((active) => (
                  <div key={active.name} className="border-l-2 border-primary/40 pl-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading">{active.name}</span>
                      {active.action && <Badge variant="outline" className="text-xs">{active.action}</Badge>}
                      {active.frequency && <Badge variant="outline" className="text-xs">{active.frequency}</Badge>}
                      {active.dc !== undefined && <Badge variant="outline" className="text-xs">DC {active.dc}</Badge>}
                    </div>
                    <p className="text-muted-foreground">{active.description}</p>
                  </div>
                ))}
              </div>
            )}
            {data.effect && (
              <p className="text-muted-foreground">{data.effect}</p>
            )}
          </div>
        </SystemWindow>
      )}

      {data.description && (
        <SystemWindow id="item-description" title="DESCRIPTION">
          <p className="text-foreground leading-relaxed">{data.description}</p>
        </SystemWindow>
      )}

      {data.stats && (
        <SystemWindow title="LEGACY STATS">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {data.stats.attack !== undefined && (
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-rose-400" />
                <span>Attack: {data.stats.attack}</span>
              </div>
            )}
            {data.stats.defense !== undefined && (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Defense: {data.stats.defense}</span>
              </div>
            )}
            {data.stats.health !== undefined && (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Health: {data.stats.health}</span>
              </div>
            )}
            {data.stats.mana !== undefined && (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Mana: {data.stats.mana}</span>
              </div>
            )}
          </div>
        </SystemWindow>
      )}
    </div>
  );
};
