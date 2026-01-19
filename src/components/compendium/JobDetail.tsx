import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Swords, Shield, Heart, Zap, Wand2 } from 'lucide-react';
import { DetailHeader } from './DetailHeader';
import { CompendiumImage } from '@/components/compendium/CompendiumImage';

interface JobData {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  flavor_text?: string;
  hit_die: number;
  primary_abilities: string[];
  secondary_abilities?: string[];
  saving_throw_proficiencies: string[];
  armor_proficiencies?: string[];
  weapon_proficiencies?: string[];
  tool_proficiencies?: string[];
  skill_choices?: string[];
  skill_choice_count: number;
  tags?: string[];
  source_book?: string;
  image_url?: string | null;
}

interface JobFeature {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  level: number;
  action_type?: string;
  is_path_feature: boolean;
}

interface JobPath {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  path_level: number;
}

export const JobDetail = ({ data }: { data: JobData }) => {
  const [features, setFeatures] = useState<JobFeature[]>([]);
  const [paths, setPaths] = useState<JobPath[]>([]);
  const [relatedPowers, setRelatedPowers] = useState<Array<{ id: string; name: string; display_name?: string | null; power_level: number }>>([]);

  const displayName = data.display_name || data.name;

  useEffect(() => {
    const fetchRelatedData = async () => {
    const [featuresRes, pathsRes, powersRes] = await Promise.all([
      supabase
        .from('compendium_job_features')
        .select('*')
        .eq('job_id', data.id)
        .eq('is_path_feature', false)
        .order('level'),
      supabase
        .from('compendium_job_paths')
        .select('*')
        .eq('job_id', data.id)
        .order('name'),
      supabase
        .from('compendium_powers')
        .select('id, name, display_name, power_level')
        .contains('job_names', [data.name])
        .limit(10),
    ]);

      if (featuresRes.data) setFeatures(featuresRes.data.map(feature => ({
        ...feature,
        action_type: feature.action_type ?? undefined,
        display_name: feature.display_name ?? undefined,
        generated_reason: feature.generated_reason ?? undefined,
        uses_formula: feature.uses_formula ?? undefined,
        aliases: feature.aliases ?? undefined,
        recharge: feature.recharge ?? undefined
      })));
      if (pathsRes.data) setPaths(pathsRes.data);
      if (powersRes.data) setRelatedPowers(powersRes.data);
    };

    fetchRelatedData();
  }, [data.id, data.name]);

  return (
    <div className="space-y-6">
      {/* Class Concept Art */}
      {data.image_url && (
        <div className="w-full flex justify-center">
          <CompendiumImage
            src={data.image_url}
            alt={displayName}
            size="hero"
            aspectRatio="landscape"
            className="max-w-2xl w-full rounded-lg"
            fallbackIcon={<Swords className="w-32 h-32 text-muted-foreground" />}
          />
        </div>
      )}
      
      {/* Header */}
      <DetailHeader
        entryType="jobs"
        entryId={data.id}
        title={displayName}
        subtitle={data.source_book ? `Source: ${data.source_book}` : undefined}
      />
      <SystemWindow title={displayName.toUpperCase()} className="border-primary/50">
        <div className="space-y-4">
          {data.flavor_text && (
            <p className="text-muted-foreground italic border-l-2 border-primary/30 pl-4">
              {data.flavor_text}
            </p>
          )}
          <p className="text-foreground">{data.description}</p>
          
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </SystemWindow>

      {/* Core Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SystemWindow title="HIT DIE" compact>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="font-display text-2xl">d{data.hit_die}</span>
          </div>
        </SystemWindow>
        
        <SystemWindow title="PRIMARY ABILITIES" compact>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="font-heading">{data.primary_abilities?.join(', ') || 'None'}</span>
          </div>
        </SystemWindow>
        
        <SystemWindow title="SAVING THROWS" compact>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-heading">{data.saving_throw_proficiencies?.join(', ') || 'None'}</span>
          </div>
        </SystemWindow>
        
        <SystemWindow title="SKILL CHOICES" compact>
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-green-400" />
            <span className="font-heading">Choose {data.skill_choice_count}</span>
          </div>
        </SystemWindow>
      </div>

      {/* Proficiencies */}
      <SystemWindow title="PROFICIENCIES">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-heading text-sm text-muted-foreground mb-2">Armor</h4>
            <p className="font-heading">{data.armor_proficiencies?.join(', ') || 'None'}</p>
          </div>
          <div>
            <h4 className="font-heading text-sm text-muted-foreground mb-2">Weapons</h4>
            <p className="font-heading">{data.weapon_proficiencies?.join(', ') || 'None'}</p>
          </div>
          <div>
            <h4 className="font-heading text-sm text-muted-foreground mb-2">Tools</h4>
            <p className="font-heading">{data.tool_proficiencies?.join(', ') || 'None'}</p>
          </div>
        </div>
        {data.skill_choices && data.skill_choices.length > 0 && (
          <div className="mt-4">
            <h4 className="font-heading text-sm text-muted-foreground mb-2">Skill Options</h4>
            <p className="font-heading">{data.skill_choices.join(', ')}</p>
          </div>
        )}
      </SystemWindow>

      {/* Paths */}
      {paths.length > 0 && (
        <SystemWindow title="PATHS">
          <div className="grid md:grid-cols-2 gap-4">
            {paths.map((path) => (
              <Link
                key={path.id}
                to={`/compendium/paths/${path.id}`}
                className="glass-card p-4 border border-border hover:border-primary/30 transition-colors"
              >
                <h4 className="font-heading text-lg font-semibold text-primary mb-2 hover:underline">{path.display_name || path.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">{path.description}</p>
                <p className="text-xs text-muted-foreground mt-2">Available at level {path.path_level}</p>
              </Link>
            ))}
          </div>
        </SystemWindow>
      )}

      {/* Related Powers */}
      {relatedPowers.length > 0 && (
        <SystemWindow title="RELATED POWERS">
          <div className="grid md:grid-cols-2 gap-3">
            {relatedPowers.map((power) => (
              <Link
                key={power.id}
                to={`/compendium/powers/${power.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors group"
              >
                <Wand2 className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-semibold group-hover:text-primary transition-colors truncate">
                    {power.display_name || power.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {power.power_level === 0 ? 'Cantrip' : `Tier ${power.power_level}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to={`/compendium?category=powers&search=${encodeURIComponent(data.name)}`}
            className="block mt-4 text-sm text-primary hover:underline text-center"
          >
            View all powers for {displayName} →
          </Link>
        </SystemWindow>
      )}

      {/* Features by Level */}
      {features.length > 0 && (
        <SystemWindow title="CLASS FEATURES">
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.id} className="border-l-2 border-primary/30 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-heading font-semibold">{feature.display_name || feature.name}</h4>
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
    </div>
  );
};