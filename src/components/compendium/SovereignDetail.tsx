import { useState, useEffect } from 'react';
import { Crown, Sparkles, Merge, Flame, Shield, Swords, GitBranch, Zap, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { formatMonarchVernacular, MONARCH_LABEL } from '@/lib/vernacular';

interface SovereignData {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  job_id?: string;
  path_id?: string;
  monarch_a_id?: string;
  monarch_b_id?: string;
  fusion_theme?: string;
  fusion_description?: string;
  prerequisites?: string;
  is_template?: boolean;
  is_ai_generated?: boolean;
  tags?: string[];
  source_book?: string;
}

interface SovereignFeature {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  level: number;
  action_type?: string;
  recharge?: string;
  is_capstone: boolean;
  origin_sources?: string[];
}

interface FusionComponent {
  type: 'job' | 'path' | 'monarch';
  id: string;
  name: string;
}

export const SovereignDetail = ({ data }: { data: SovereignData }) => {
  const [features, setFeatures] = useState<SovereignFeature[]>([]);
  const [fusionComponents, setFusionComponents] = useState<FusionComponent[]>([]);
  const [loading, setLoading] = useState(true);

  const displayName = formatMonarchVernacular(data.display_name || data.name);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch features
      const { data: featureData } = await supabase
        .from('compendium_sovereign_features')
        .select('*')
        .eq('sovereign_id', data.id)
        .order('is_capstone')
        .order('level');
      
      if (featureData) setFeatures(featureData.map(feature => ({
        ...feature,
        action_type: feature.action_type ?? undefined,
        display_name: feature.display_name ?? undefined,
        generated_reason: feature.generated_reason ?? undefined,
        uses_formula: feature.uses_formula ?? undefined,
        aliases: feature.aliases ?? undefined,
        recharge: feature.recharge ?? undefined,
        origin_sources: feature.origin_sources ?? undefined
      })));

      // Fetch fusion components
      const components: FusionComponent[] = [];
      
      // Use centralized resolver for all component lookups
      const { resolveRef } = await import('@/lib/compendiumResolver');
      
      if (data.job_id) {
        const job = await resolveRef('jobs', data.job_id);
        if (job) components.push({ type: 'job', id: job.id, name: ((job as { display_name?: string | null }).display_name || job.name) });
      }
      
      if (data.path_id) {
        const path = await resolveRef('paths', data.path_id);
        if (path) components.push({ type: 'path', id: path.id, name: ((path as { display_name?: string | null }).display_name || path.name) });
      }
      
      if (data.monarch_a_id) {
        const monarch = await resolveRef('monarchs', data.monarch_a_id);
        if (monarch) {
          const rawName = (monarch as { display_name?: string | null; name: string }).display_name || monarch.name;
          components.push({ type: 'monarch', id: monarch.id, name: formatMonarchVernacular(rawName) });
        }
      }
      
      if (data.monarch_b_id) {
        const monarch = await resolveRef('monarchs', data.monarch_b_id);
        if (monarch) {
          const rawName = (monarch as { display_name?: string | null; name: string }).display_name || monarch.name;
          components.push({ type: 'monarch', id: monarch.id, name: formatMonarchVernacular(rawName) });
        }
      }
      
      setFusionComponents(components);
      setLoading(false);
    };

    fetchData();
  }, [data.id, data.job_id, data.path_id, data.monarch_a_id, data.monarch_b_id]);

  const capstoneFeatures = features.filter(f => f.is_capstone);
  const coreFeatures = features.filter(f => !f.is_capstone);

  const getComponentIcon = (type: 'job' | 'path' | 'monarch') => {
    switch (type) {
      case 'job': return Swords;
      case 'path': return GitBranch;
      case 'monarch': return Crown;
    }
  };

  const getComponentColor = (type: 'job' | 'path' | 'monarch') => {
    switch (type) {
      case 'job': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'path': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'monarch': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Gemini Protocol Title */}
      <SystemWindow 
        id="sovereign-overview"
        title="GEMINI PROTOCOL" 
        className="border-violet-500/50 border-2 bg-gradient-to-br from-violet-950/20 to-background"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Merge className="w-10 h-10 text-violet-400" />
              <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl bg-gradient-to-r from-violet-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                {displayName}
              </h2>
              {data.fusion_theme && (
                <p className="text-muted-foreground font-heading">{data.fusion_theme}</p>
              )}
            </div>
          </div>
          
          <p className="text-foreground leading-relaxed">{formatMonarchVernacular(data.description)}</p>
          
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-violet-600/80 text-white border-violet-400">
              <Merge className="w-3 h-3 mr-1" />
              Permanent Subclass Overlay
            </Badge>
            {data.is_template && (
              <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                <Star className="w-3 h-3 mr-1" />
                Template Sovereign
              </Badge>
            )}
            {data.source_book && (
              <Badge variant="secondary">{data.source_book}</Badge>
            )}
          </div>
        </div>
      </SystemWindow>

      {/* Fusion Components */}
      <SystemWindow id="sovereign-fusion" title="FUSION COMPONENTS" className="border-purple-500/30">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This Sovereign was created through the Gemini Protocol as a permanent subclass overlay of the following components:
          </p>
          
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fusionComponents.map((component, index) => {
                const Icon = getComponentIcon(component.type);
                const colorClass = getComponentColor(component.type);
                return (
                  <div 
                    key={component.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${colorClass}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {component.type === 'monarch' ? MONARCH_LABEL : component.type}
                      </p>
                      <p className="font-heading font-medium">{component.name}</p>
                    </div>
                    {index < fusionComponents.length - 1 && (
                      <Merge className="w-4 h-4 text-violet-400 ml-auto hidden md:block" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SystemWindow>

      {/* Fusion Manifestation */}
      {data.fusion_description && (
        <SystemWindow title="FUSION MANIFESTATION" className="border-violet-500/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-violet-400 flex-shrink-0" />
            <p className="text-foreground leading-relaxed italic">{formatMonarchVernacular(data.fusion_description)}</p>
          </div>
        </SystemWindow>
      )}

      {/* Prerequisites */}
      {data.prerequisites && (
        <SystemWindow title="GEMINI PROTOCOL REQUIREMENTS" className="border-rose-500/30">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <p className="text-foreground">{formatMonarchVernacular(data.prerequisites)}</p>
          </div>
        </SystemWindow>
      )}

      {/* Core Fusion Features */}
      {coreFeatures.length > 0 && (
        <SystemWindow id="sovereign-features" title="FUSION ABILITIES" className="border-primary/30">
          <div className="space-y-4">
            {coreFeatures.map((feature) => (
              <div key={feature.id} className="border-l-2 border-primary/50 pl-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <h4 className="font-heading font-semibold text-primary">
                    {formatMonarchVernacular(feature.display_name || feature.name)}
                  </h4>
                  {feature.action_type && (
                    <Badge variant="secondary" className="text-xs">{feature.action_type}</Badge>
                  )}
                  {feature.recharge && (
                    <Badge variant="outline" className="text-xs">{feature.recharge}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{formatMonarchVernacular(feature.description)}</p>
                {feature.origin_sources && feature.origin_sources.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {feature.origin_sources.map((source, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-xs text-muted-foreground border-muted-foreground/30"
                      >
                        {formatMonarchVernacular(source)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SystemWindow>
      )}

      {/* Capstone Features */}
      {capstoneFeatures.length > 0 && (
        <SystemWindow
          id={coreFeatures.length === 0 ? 'sovereign-features' : undefined}
          title="CAPSTONE ABILITIES"
          className="border-amber-500/50"
        >
          <div className="space-y-4">
            {capstoneFeatures.map((feature) => (
              <div key={feature.id} className="border-l-2 border-amber-500/50 pl-4 space-y-2 bg-amber-500/5 -ml-4 p-4 rounded-r-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h4 className="font-heading font-semibold text-amber-400">
                    {formatMonarchVernacular(feature.display_name || feature.name)}
                  </h4>
                  {feature.action_type && (
                    <Badge className="bg-amber-500/20 text-amber-300 text-xs">{feature.action_type}</Badge>
                  )}
                  {feature.recharge && (
                    <Badge variant="outline" className="text-xs border-amber-500/30">{feature.recharge}</Badge>
                  )}
                </div>
                <p className="text-sm text-foreground">{formatMonarchVernacular(feature.description)}</p>
                {feature.origin_sources && feature.origin_sources.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {feature.origin_sources.map((source, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-xs text-amber-400/70 border-amber-500/30"
                      >
                        {formatMonarchVernacular(source)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SystemWindow>
      )}

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs capitalize">
              {formatMonarchVernacular(tag.replace(/-/g, ' '))}
            </Badge>
          ))}
        </div>
      )}

      {/* Lore Note */}
      <SystemWindow title="THE PRIME ARCHITECT'S BLESSING" className="border-cyan-500/30">
        <p className="text-sm text-muted-foreground italic">
          In the post-reset timeline, the Prime Architect Kael Voss granted the Gemini Protocol to worthy Ascendants, a 
          permanent subclass overlay that transcends the limitations of single-path power. Those who complete the 
          Protocol become Sovereigns, wielding the combined might of Job, Path, and Dual {MONARCH_LABEL} Overlays as one 
          unified force. The overlay is irreversible, for to become a Sovereign is to accept that you will never 
          again be anything less.
        </p>
      </SystemWindow>
    </div>
  );
};

