import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Shield, Scroll, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import { formatMonarchVernacular } from '@/lib/vernacular';

type Rune = Database['public']['Tables']['compendium_runes']['Row'];

interface RuneDetailProps {
  data: Rune;
}

const RUNE_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  martial: Zap,
  caster: Scroll,
  hybrid: Sparkles,
  utility: BookOpen,
  defensive: Shield,
  offensive: Zap,
};

const RUNE_TYPE_COLORS: Record<string, string> = {
  martial: 'bg-red-500/20 text-red-400 border-red-500/30',
  caster: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  hybrid: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  utility: 'bg-green-500/20 text-green-400 border-green-500/30',
  defensive: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  offensive: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export const RuneDetail = ({ data }: RuneDetailProps) => {
  const Icon = RUNE_TYPE_ICONS[data.rune_type] || Sparkles;
  const typeColor = RUNE_TYPE_COLORS[data.rune_type] || '';
  const displayName = formatMonarchVernacular((data as { display_name?: string | null }).display_name || data.name);

  // Format requirements
  const requirements: string[] = [];
  if (data.requirement_str && data.requirement_str > 0) requirements.push(`STR ${data.requirement_str}+`);
  if (data.requirement_agi && data.requirement_agi > 0) requirements.push(`AGI ${data.requirement_agi}+`);
  if (data.requirement_vit && data.requirement_vit > 0) requirements.push(`VIT ${data.requirement_vit}+`);
  if (data.requirement_int && data.requirement_int > 0) requirements.push(`INT ${data.requirement_int}+`);
  if (data.requirement_sense && data.requirement_sense > 0) requirements.push(`SENSE ${data.requirement_sense}+`);
  if (data.requirement_pre && data.requirement_pre > 0) requirements.push(`PRE ${data.requirement_pre}+`);
  if (data.requires_level && data.requires_level > 1) requirements.push(`Level ${data.requires_level}+`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemWindow title={displayName.toUpperCase()} className={typeColor ? `border-2 ${typeColor.split(' ')[2]}` : ''}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Icon className="w-8 h-8 text-primary" />
            <div>
              <h2 className="font-display text-2xl gradient-text-system">{displayName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={typeColor || 'bg-primary/20 text-primary border-primary/30'}>
                  {formatMonarchVernacular(data.rune_type)}
                </Badge>
                <Badge variant="secondary">Level {data.rune_level}</Badge>
                <Badge variant="outline">{formatMonarchVernacular(data.rarity)}</Badge>
                <Badge variant="outline">{formatMonarchVernacular(data.rune_category)}</Badge>
              </div>
            </div>
          </div>

          <p className="text-foreground">{formatMonarchVernacular(data.description)}</p>

          {data.lore && (
            <div className="border-l-2 border-primary/30 pl-4">
              <p className="text-muted-foreground italic">{formatMonarchVernacular(data.lore)}</p>
            </div>
          )}
        </div>
      </SystemWindow>

      {/* Requirements */}
      {requirements.length > 0 && (
        <SystemWindow title="REQUIREMENTS">
          <div className="flex flex-wrap gap-2">
            {requirements.map((req, i) => (
              <Badge key={i} variant="outline">{req}</Badge>
            ))}
          </div>
          {data.requires_job && data.requires_job.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground mb-2">Natural Users (no penalties):</p>
              <div className="flex flex-wrap gap-2">
                {data.requires_job.map((job) => (
                  <Badge key={job} variant="secondary">{formatMonarchVernacular(job)}</Badge>
                ))}
              </div>
            </div>
          )}
        </SystemWindow>
      )}

      {/* Cross-Learning Penalties */}
      {(data.caster_penalty || data.martial_penalty) && (
        <SystemWindow title="CROSS-LEARNING MECHANICS">
          <div className="space-y-3">
            {data.caster_penalty && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  <h4 className="font-heading font-semibold text-sm">Casters Using Martial Runes</h4>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{formatMonarchVernacular(data.caster_penalty)}</p>
                {data.caster_requirement_multiplier && data.caster_requirement_multiplier !== 1.0 && (
                  <p className="text-xs text-muted-foreground ml-6 mt-1">
                    Requirement multiplier: {data.caster_requirement_multiplier}x
                  </p>
                )}
              </div>
            )}
            {data.martial_penalty && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <h4 className="font-heading font-semibold text-sm">Martials Using Caster Runes</h4>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{formatMonarchVernacular(data.martial_penalty)}</p>
                {data.martial_requirement_multiplier && data.martial_requirement_multiplier !== 1.0 && (
                  <p className="text-xs text-muted-foreground ml-6 mt-1">
                    Requirement multiplier: {data.martial_requirement_multiplier}x
                  </p>
                )}
              </div>
            )}
          </div>
        </SystemWindow>
      )}

      {/* Effect Details */}
      <SystemWindow title="EFFECT">
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <h4 className="font-heading font-semibold">Effect Type</h4>
            </div>
            <Badge variant="outline">{formatMonarchVernacular(data.effect_type)}</Badge>
          </div>

          {data.effect_description && (
            <div>
              <p className="text-foreground">{formatMonarchVernacular(data.effect_description)}</p>
            </div>
          )}

          {data.activation_action && (
            <div>
              <h4 className="font-heading font-semibold text-sm mb-2">Activation</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Action: </span>
                  <Badge variant="outline" className="text-xs">{formatMonarchVernacular(data.activation_action)}</Badge>
                </div>
                {data.activation_cost && (
                  <div>
                    <span className="text-muted-foreground">Cost: </span>
                    <Badge variant="outline" className="text-xs">
                      {data.activation_cost_amount} {formatMonarchVernacular(data.activation_cost)}
                    </Badge>
                  </div>
                )}
                {data.uses_per_rest && (
                  <div>
                    <span className="text-muted-foreground">Uses: </span>
                    <Badge variant="outline" className="text-xs">{formatMonarchVernacular(data.uses_per_rest)}</Badge>
                  </div>
                )}
                {data.recharge && data.recharge !== 'none' && (
                  <div>
                    <span className="text-muted-foreground">Recharge: </span>
                    <Badge variant="outline" className="text-xs">{formatMonarchVernacular(data.recharge)}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {data.range && (
            <div>
              <span className="text-muted-foreground">Range: </span>
              <span className="text-foreground">{formatMonarchVernacular(data.range)}</span>
            </div>
          )}

          {data.duration && (
            <div>
              <span className="text-muted-foreground">Duration: </span>
              <span className="text-foreground">{formatMonarchVernacular(data.duration)}</span>
              {data.concentration && (
                <Badge variant="secondary" className="ml-2 text-xs">Concentration</Badge>
              )}
            </div>
          )}

          {data.higher_levels && (
            <div className="border-l-2 border-primary/30 pl-4 mt-3">
              <h4 className="font-heading font-semibold text-sm mb-2">At Higher Rune Levels</h4>
              <p className="text-sm text-muted-foreground">{formatMonarchVernacular(data.higher_levels)}</p>
            </div>
          )}
        </div>
      </SystemWindow>

      {/* Passive Bonuses */}
      {data.passive_bonuses && Object.keys(data.passive_bonuses).length > 0 && (
        <SystemWindow title="PASSIVE BONUSES">
          <div className="space-y-2">
            {Object.entries(data.passive_bonuses).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {String(value)}
                </Badge>
              </div>
            ))}
          </div>
        </SystemWindow>
      )}

      {/* Inscription Details */}
      <SystemWindow title="INSCRIPTION">
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Can be inscribed on: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.can_inscribe_on?.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">{formatMonarchVernacular(type)}</Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Inscription Difficulty: </span>
            <Badge variant="outline">DC {data.inscription_difficulty}</Badge>
          </div>
        </div>
      </SystemWindow>

      {/* Discovery Lore */}
      {data.discovery_lore && (
        <SystemWindow title="DISCOVERY">
          <p className="text-muted-foreground italic">{formatMonarchVernacular(data.discovery_lore)}</p>
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

