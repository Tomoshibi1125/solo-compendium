import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { GitBranch, Swords, Star, Shield, Zap } from 'lucide-react';
import { formatMonarchVernacular } from '@/lib/vernacular';

interface PathData {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  jobId?: string;
  job_id?: string | null;
  jobName?: string;
  tier?: number;
  level?: number;
  path_level?: number | null;
  prerequisites?: string;
  tags?: string[];
  source_book?: string;
  image_url?: string;
  flavor_text?: string | null;
}

interface PathFeature {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  level: number;
  action_type?: string | null;
  recharge?: string | null;
  uses_formula?: string | null;
  prerequisites?: string | null;
}

export const PathDetail = ({ data }: { data: PathData }) => {
  const displayName = formatMonarchVernacular(data.display_name || data.name);
  const pathLevel = data.level ?? data.path_level ?? undefined;
  const [features, setFeatures] = useState<PathFeature[]>([]);
  const [jobName, setJobName] = useState<string | null>(data.jobName ?? null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let isCancelled = false;

    const loadPathData = async () => {
      const jobId = data.jobId ?? data.job_id ?? null;

      const featuresRes = await supabase
        .from('compendium_job_features')
        .select('id, name, display_name, description, level, action_type, recharge, uses_formula, prerequisites')
        .eq('path_id', data.id)
        .eq('is_path_feature', true)
        .order('level');

      if (!isCancelled) {
        setFeatures((featuresRes.data as PathFeature[]) || []);
      }

      if (!jobName && jobId) {
        const { data: jobData } = await supabase
          .from('compendium_jobs')
          .select('name, display_name')
          .eq('id', jobId)
          .maybeSingle();

        if (!isCancelled) {
          setJobName(jobData?.display_name || jobData?.name || null);
        }
      }
    };

    loadPathData();

    return () => {
      isCancelled = true;
    };
  }, [data.id, data.jobId, data.job_id, jobName]);

  const abilityFeatures = useMemo(
    () => features.filter((feature) => feature.action_type || feature.recharge || feature.uses_formula),
    [features]
  );
  const abilityIds = useMemo(
    () => new Set(abilityFeatures.map((feature) => feature.id)),
    [abilityFeatures]
  );
  const coreFeatures = useMemo(
    () => features.filter((feature) => !abilityIds.has(feature.id)),
    [features, abilityIds]
  );

  const getTierIcon = (tier?: number) => {
    switch (tier) {
      case 1: return <Star className="w-5 h-5 text-rare" />;
      case 2: return <Zap className="w-5 h-5 text-very-rare" />;
      case 3: return <Shield className="w-5 h-5 text-legendary" />;
      default: return <GitBranch className="w-5 h-5" />;
    }
  };

  const getTierColor = (tier?: number) => {
    switch (tier) {
      case 1: return 'text-rare border-rare/40 bg-rare/10';
      case 2: return 'text-very-rare border-very-rare/40 bg-very-rare/10';
      case 3: return 'text-legendary border-legendary/40 bg-legendary/10';
      default: return 'text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
            {getTierIcon(data.tier)}
            {displayName}
          </h2>
          {(jobName || data.jobName) && (
            <p className="text-muted-foreground mt-1">
              Subclass of <span className="font-semibold">{formatMonarchVernacular(jobName || data.jobName || '')}</span>
            </p>
          )}
        </div>
        {data.tier && (
          <Badge className={getTierColor(data.tier)}>
            Tier {data.tier}
          </Badge>
        )}
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold mb-3 font-heading">Overview</h3>
        <p className="text-muted-foreground leading-relaxed">{formatMonarchVernacular(data.description)}</p>
        {data.flavor_text && (
          <p className="text-muted-foreground leading-relaxed mt-3 italic">
            {formatMonarchVernacular(data.flavor_text)}
          </p>
        )}
      </div>

      {/* Requirements */}
      {(pathLevel || data.prerequisites) && (
        <div>
          <h3 className="text-lg font-semibold mb-3 font-heading">Requirements</h3>
          <div className="space-y-2">
            {pathLevel && (
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4" />
                <span>Level {pathLevel}</span>
              </div>
            )}
            {data.prerequisites && (
              <div className="text-sm text-muted-foreground">
                Prerequisites: {formatMonarchVernacular(data.prerequisites)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features */}
      <div>
        <h3 className="text-lg font-semibold mb-3 font-heading">Path Features</h3>
        {coreFeatures.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No path features available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {coreFeatures.map((feature) => (
              <div key={feature.id} className="p-4 bg-card border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-primary">Level {feature.level}</span>
                  <span className="font-semibold">{formatMonarchVernacular(feature.display_name || feature.name)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{formatMonarchVernacular(feature.description)}</p>
                {(feature.action_type || feature.recharge || feature.uses_formula) && (
                  <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                    {feature.action_type && <span>Action: {formatMonarchVernacular(feature.action_type)}</span>}
                    {feature.recharge && <span>Recharge: {formatMonarchVernacular(feature.recharge)}</span>}
                    {feature.uses_formula && <span>Uses: {formatMonarchVernacular(feature.uses_formula)}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Abilities */}
      {abilityFeatures.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 font-heading">Signature Abilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {abilityFeatures.map((ability) => (
              <div key={ability.id} className="p-4 bg-card border rounded-lg">
                <h4 className="font-semibold mb-2">{formatMonarchVernacular(ability.display_name || ability.name)}</h4>
                <p className="text-sm text-muted-foreground mb-3">{formatMonarchVernacular(ability.description)}</p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {ability.action_type && <span>Action: {formatMonarchVernacular(ability.action_type)}</span>}
                  {ability.recharge && <span>Recharge: {formatMonarchVernacular(ability.recharge)}</span>}
                  {ability.uses_formula && <span>Uses: {formatMonarchVernacular(ability.uses_formula)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 font-heading">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="capitalize">
                {formatMonarchVernacular(tag.replace('-', ' '))}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Source */}
      {data.source_book && (
        <div className="text-sm text-muted-foreground">
          Source: {formatMonarchVernacular(data.source_book)}
        </div>
      )}
    </div>
  );
};
