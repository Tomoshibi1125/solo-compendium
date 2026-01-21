import { useEffect, useState } from 'react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Flame, Skull, Sparkles, AlertTriangle } from 'lucide-react';
import { formatMonarchVernacular, MONARCH_LABEL } from '@/lib/vernacular';

interface MonarchData {
  id: string;
  name: string;
  display_name?: string | null;
  title: string;
  description: string;
  flavor_text?: string;
  theme: string;
  damage_type?: string;
  unlock_level: number;
  prerequisites?: string;
  primary_abilities?: string[];
  manifestation_description?: string;
  corruption_risk?: string;
  lore?: string;
  tags?: string[];
  source_book?: string;
}

interface MonarchFeature {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  level: number;
  is_signature: boolean;
  action_type?: string;
  recharge?: string;
}

export const MonarchDetail = ({ data }: { data: MonarchData }) => {
  const [features, setFeatures] = useState<MonarchFeature[]>([]);

  const displayName = formatMonarchVernacular(data.display_name || data.name);
  const displayTitle = formatMonarchVernacular(data.title);
  const displayTheme = formatMonarchVernacular(data.theme);

  useEffect(() => {
    const fetchFeatures = async () => {
      const { data: featureData } = await supabase
        .from('compendium_monarch_features')
        .select('*')
        .eq('monarch_id', data.id)
        .order('level');
      
      if (featureData) setFeatures(featureData.map(feature => ({
        ...feature,
        action_type: feature.action_type ?? undefined,
        display_name: feature.display_name ?? undefined,
        generated_reason: feature.generated_reason ?? undefined,
        uses_formula: feature.uses_formula ?? undefined,
        aliases: feature.aliases ?? undefined,
        recharge: feature.recharge ?? undefined
      })));
    };

    fetchFeatures();
  }, [data.id]);

  const signatureFeatures = features.filter(f => f.is_signature);
  const regularFeatures = features.filter(f => !f.is_signature);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemWindow title={displayName.toUpperCase()} className="border-amber-500/50 border-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-amber-400" />
            <div>
              <h2 className="font-display text-2xl gradient-text-system">{displayTitle}</h2>
              <p className="text-muted-foreground">{displayTheme}</p>
            </div>
          </div>
          
          {data.flavor_text && (
            <p className="text-muted-foreground italic border-l-2 border-amber-500/30 pl-4">
              {formatMonarchVernacular(data.flavor_text)}
            </p>
          )}
          
          <p className="text-foreground">{formatMonarchVernacular(data.description)}</p>
          
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-amber-500 text-white">Level {data.unlock_level}+</Badge>
            {data.damage_type && <Badge variant="secondary">{formatMonarchVernacular(data.damage_type)} Damage</Badge>}
            {data.primary_abilities?.map((ability) => (
              <Badge key={ability} variant="outline">{formatMonarchVernacular(ability)}</Badge>
            ))}
          </div>
        </div>
      </SystemWindow>

      {/* Prerequisites */}
      {data.prerequisites && (
        <SystemWindow title="PREREQUISITES">
          <p className="text-foreground">{formatMonarchVernacular(data.prerequisites)}</p>
        </SystemWindow>
      )}

      {/* Manifestation */}
      {data.manifestation_description && (
        <SystemWindow title="MANIFESTATION" className="border-purple-500/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0" />
            <p className="text-foreground">{formatMonarchVernacular(data.manifestation_description)}</p>
          </div>
        </SystemWindow>
      )}

      {/* Signature Features */}
      {signatureFeatures.length > 0 && (
        <SystemWindow title="SIGNATURE ABILITIES" className="border-amber-500/30">
          <div className="space-y-4">
            {signatureFeatures.map((feature) => (
              <div key={feature.id} className="border-l-2 border-amber-500/50 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h4 className="font-heading font-semibold text-amber-400">{formatMonarchVernacular(feature.display_name || feature.name)}</h4>
                  {feature.action_type && (
                    <Badge variant="secondary" className="text-xs">{feature.action_type}</Badge>
                  )}
                  {feature.recharge && (
                    <Badge variant="outline" className="text-xs">{feature.recharge}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{formatMonarchVernacular(feature.description)}</p>
              </div>
            ))}
          </div>
        </SystemWindow>
      )}

      {/* Regular Features */}
      {regularFeatures.length > 0 && (
        <SystemWindow title={`${MONARCH_LABEL.toUpperCase()} FEATURES`}>
          <div className="space-y-4">
            {regularFeatures.map((feature) => (
              <div key={feature.id} className="border-l-2 border-primary/30 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-heading font-semibold">{formatMonarchVernacular(feature.display_name || feature.name)}</h4>
                  <Badge variant="outline" className="text-xs">Level {feature.level}</Badge>
                  {feature.action_type && (
                    <Badge variant="secondary" className="text-xs">{feature.action_type}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{formatMonarchVernacular(feature.description)}</p>
              </div>
            ))}
          </div>
        </SystemWindow>
      )}

      {/* Corruption Risk */}
      {data.corruption_risk && (
        <SystemWindow title="CORRUPTION RISK" className="border-red-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <p className="text-foreground">{formatMonarchVernacular(data.corruption_risk)}</p>
          </div>
        </SystemWindow>
      )}

      {/* Lore */}
      {data.lore && (
        <SystemWindow title="LORE">
          <div className="flex items-start gap-3">
            <Skull className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            <p className="text-muted-foreground italic">{formatMonarchVernacular(data.lore)}</p>
          </div>
        </SystemWindow>
      )}

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
