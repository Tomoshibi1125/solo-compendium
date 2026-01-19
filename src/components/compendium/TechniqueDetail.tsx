import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Zap, Timer, Target, Shield, Swords, Footprints, Sparkles } from 'lucide-react';
import { CompendiumImage } from '@/components/compendium/CompendiumImage';

interface TechniqueData {
  id: string;
  name: string;
  display_name?: string | null;
  description?: string | null;
  technique_type?: string | null;
  style?: string | null;
  prerequisites?: {
    level?: number;
    class?: string;
    ability?: string;
    score?: number;
    proficiency?: string[];
    technique?: string[];
  } | null;
  activation?: { type?: string; cost?: string } | null;
  duration?: { type?: string; time?: string } | null;
  range?: { type?: string; distance?: number } | null;
  components?: { verbal?: boolean; somatic?: boolean; material?: boolean; material_desc?: string } | null;
  effects?: { primary?: string; secondary?: string; tertiary?: string } | null;
  mechanics?: {
    attack?: { type?: string; modifier?: string; damage?: string };
    saving_throw?: { ability?: string; dc?: string; success?: string; failure?: string };
    movement?: { type?: string; distance?: number };
    condition?: string[];
  } | null;
  limitations?: { uses?: string; cooldown?: string; conditions?: string[]; exhaustion?: string } | null;
  flavor?: string | null;
  source_book?: string | null;
  image_url?: string | null;
  image?: string | null;
}

export const TechniqueDetail = ({ data }: { data: TechniqueData }) => {
  const displayName = data.display_name || data.name;
  const imageSrc = data.image_url || data.image || undefined;

  const prereq = data.prerequisites || undefined;
  const activation = data.activation || undefined;
  const duration = data.duration || undefined;
  const range = data.range || undefined;
  const components = data.components || undefined;
  const effects = data.effects || undefined;
  const mechanics = data.mechanics || undefined;
  const limitations = data.limitations || undefined;

  const componentFlags = [
    components?.verbal ? 'V' : null,
    components?.somatic ? 'S' : null,
    components?.material ? 'M' : null,
  ].filter(Boolean);

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
            fallbackIcon={<Swords className="w-32 h-32 text-muted-foreground" />}
          />
        </div>
      )}

      <SystemWindow title={displayName.toUpperCase()}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {data.technique_type && <Badge variant="secondary">{data.technique_type}</Badge>}
            {data.style && <Badge variant="outline">{data.style}</Badge>}
            {data.source_book && <Badge variant="outline">{data.source_book}</Badge>}
          </div>
        </div>
      </SystemWindow>

      {(activation || duration || range || components) && (
        <div id="technique-activation" className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-mt-4">
          {activation && (
            <SystemWindow title="ACTIVATION" compact>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-heading capitalize">{activation.type || 'action'}</span>
              </div>
              {activation.cost && <span className="text-xs text-muted-foreground">{activation.cost}</span>}
            </SystemWindow>
          )}
          {duration && (
            <SystemWindow title="DURATION" compact>
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-primary" />
                <span className="font-heading capitalize">{duration.type || 'instant'}</span>
              </div>
              {duration.time && <span className="text-xs text-muted-foreground">{duration.time}</span>}
            </SystemWindow>
          )}
          {range && (
            <SystemWindow title="RANGE" compact>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-heading capitalize">{range.type || 'melee'}</span>
              </div>
              {range.distance !== undefined && (
                <span className="text-xs text-muted-foreground">{range.distance} ft</span>
              )}
            </SystemWindow>
          )}
          {components && (
            <SystemWindow title="COMPONENTS" compact>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-heading">{componentFlags.join(', ') || 'None'}</span>
              </div>
              {components.material_desc && (
                <span className="text-xs text-muted-foreground">{components.material_desc}</span>
              )}
            </SystemWindow>
          )}
        </div>
      )}

      {prereq && (
        <SystemWindow title="PREREQUISITES">
          <ul className="space-y-2 text-sm">
            {prereq.level !== undefined && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Level {prereq.level}</span>
              </li>
            )}
            {prereq.class && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>{prereq.class}</span>
              </li>
            )}
            {prereq.ability && prereq.score !== undefined && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>{prereq.ability} {prereq.score}+</span>
              </li>
            )}
            {prereq.proficiency && prereq.proficiency.length > 0 && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Proficiencies: {prereq.proficiency.join(', ')}</span>
              </li>
            )}
            {prereq.technique && prereq.technique.length > 0 && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Requires: {prereq.technique.join(', ')}</span>
              </li>
            )}
          </ul>
        </SystemWindow>
      )}

      {effects && (
        <SystemWindow id="technique-effects" title="EFFECTS">
          <div className="space-y-3">
            {effects.primary && (
              <p className="text-foreground leading-relaxed">{effects.primary}</p>
            )}
            {effects.secondary && (
              <p className="text-muted-foreground leading-relaxed">{effects.secondary}</p>
            )}
            {effects.tertiary && (
              <p className="text-muted-foreground leading-relaxed">{effects.tertiary}</p>
            )}
          </div>
        </SystemWindow>
      )}

      {mechanics && (
        <SystemWindow id="technique-mechanics" title="MECHANICS">
          <div className="space-y-4">
            {mechanics.attack && (
              <div className="flex items-start gap-2">
                <Swords className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading capitalize">{mechanics.attack.type} attack</p>
                  <p className="text-sm text-muted-foreground">
                    {mechanics.attack.damage ? `Damage: ${mechanics.attack.damage}` : 'Damage varies'}
                    {mechanics.attack.modifier ? ` | Modifier: ${mechanics.attack.modifier}` : ''}
                  </p>
                </div>
              </div>
            )}
            {mechanics.saving_throw && (
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading">{mechanics.saving_throw.ability} Save</p>
                  <p className="text-sm text-muted-foreground">DC {mechanics.saving_throw.dc}</p>
                  {mechanics.saving_throw.success && (
                    <p className="text-xs text-muted-foreground">Success: {mechanics.saving_throw.success}</p>
                  )}
                  {mechanics.saving_throw.failure && (
                    <p className="text-xs text-muted-foreground">Failure: {mechanics.saving_throw.failure}</p>
                  )}
                </div>
              </div>
            )}
            {mechanics.movement && (
              <div className="flex items-start gap-2">
                <Footprints className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading capitalize">{mechanics.movement.type} movement</p>
                  {mechanics.movement.distance !== undefined && (
                    <p className="text-sm text-muted-foreground">{mechanics.movement.distance} ft</p>
                  )}
                </div>
              </div>
            )}
            {mechanics.condition && mechanics.condition.length > 0 && (
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading">Conditions</p>
                  <p className="text-sm text-muted-foreground">{mechanics.condition.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </SystemWindow>
      )}

      {limitations && (
        <SystemWindow title="LIMITATIONS">
          <ul className="space-y-2 text-sm">
            {limitations.uses && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Uses: {limitations.uses}</span>
              </li>
            )}
            {limitations.cooldown && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Cooldown: {limitations.cooldown}</span>
              </li>
            )}
            {limitations.exhaustion && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Exhaustion: {limitations.exhaustion}</span>
              </li>
            )}
            {limitations.conditions && limitations.conditions.length > 0 && (
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Conditions: {limitations.conditions.join(', ')}</span>
              </li>
            )}
          </ul>
        </SystemWindow>
      )}

      {(data.description || data.flavor) && (
        <SystemWindow id="technique-description" title="DESCRIPTION">
          <div className="space-y-3">
            {data.description && (
              <p className="text-foreground leading-relaxed">{data.description}</p>
            )}
            {data.flavor && (
              <p className="text-sm text-muted-foreground italic">{data.flavor}</p>
            )}
          </div>
        </SystemWindow>
      )}
    </div>
  );
};
