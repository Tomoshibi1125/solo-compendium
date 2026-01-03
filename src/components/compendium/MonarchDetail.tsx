import { useEffect, useState } from 'react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Flame, Skull, Sparkles, AlertTriangle } from 'lucide-react';

interface MonarchData {
  id: string;
  name: string;
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
  description: string;
  level: number;
  is_signature: boolean;
  action_type?: string;
  recharge?: string;
}

export const MonarchDetail = ({ data }: { data: MonarchData }) => {
  const [features, setFeatures] = useState<MonarchFeature[]>([]);

  useEffect(() => {
    fetchFeatures();
  }, [data.id]);

  const fetchFeatures = async () => {
    const { data: featureData } = await supabase
      .from('compendium_monarch_features')
      .select('*')
      .eq('monarch_id', data.id)
      .order('level');
    
    if (featureData) setFeatures(featureData);
  };

  const signatureFeatures = features.filter(f => f.is_signature);
  const regularFeatures = features.filter(f => !f.is_signature);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemWindow title={data.name.toUpperCase()} className="border-amber-500/50 border-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-amber-400" />
            <div>
              <h2 className="font-display text-2xl gradient-text-system">{data.title}</h2>
              <p className="text-muted-foreground">{data.theme}</p>
            </div>
          </div>
          
          {data.flavor_text && (
            <p className="text-muted-foreground italic border-l-2 border-amber-500/30 pl-4">
              {data.flavor_text}
            </p>
          )}
          
          <p className="text-foreground">{data.description}</p>
          
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-amber-500 text-white">Level {data.unlock_level}+</Badge>
            {data.damage_type && <Badge variant="secondary">{data.damage_type} Damage</Badge>}
            {data.primary_abilities?.map((ability) => (
              <Badge key={ability} variant="outline">{ability}</Badge>
            ))}
          </div>
        </div>
      </SystemWindow>

      {/* Prerequisites */}
      {data.prerequisites && (
        <SystemWindow title="PREREQUISITES">
          <p className="text-foreground">{data.prerequisites}</p>
        </SystemWindow>
      )}

      {/* Manifestation */}
      {data.manifestation_description && (
        <SystemWindow title="MANIFESTATION" className="border-purple-500/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0" />
            <p className="text-foreground">{data.manifestation_description}</p>
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
                  <h4 className="font-heading font-semibold text-amber-400">{feature.name}</h4>
                  {feature.action_type && (
                    <Badge variant="secondary" className="text-xs">{feature.action_type}</Badge>
                  )}
                  {feature.recharge && (
                    <Badge variant="outline" className="text-xs">{feature.recharge}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </SystemWindow>
      )}

      {/* Regular Features */}
      {regularFeatures.length > 0 && (
        <SystemWindow title="MONARCH FEATURES">
          <div className="space-y-4">
            {regularFeatures.map((feature) => (
              <div key={feature.id} className="border-l-2 border-primary/30 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-heading font-semibold">{feature.name}</h4>
                  <Badge variant="outline" className="text-xs">Level {feature.level}</Badge>
                  {feature.action_type && (
                    <Badge variant="secondary" className="text-xs">{feature.action_type}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
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
            <p className="text-foreground">{data.corruption_risk}</p>
          </div>
        </SystemWindow>
      )}

      {/* Lore */}
      {data.lore && (
        <SystemWindow title="LORE">
          <div className="flex items-start gap-3">
            <Skull className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            <p className="text-muted-foreground italic">{data.lore}</p>
          </div>
        </SystemWindow>
      )}

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