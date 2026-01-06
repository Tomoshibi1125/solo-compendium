import { useEffect, useState } from 'react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { GitBranch, Swords } from 'lucide-react';
import { resolveRef } from '@/lib/compendiumResolver';

interface PathData {
  id: string;
  name: string;
  description: string;
  flavor_text?: string;
  job_id: string;
  path_level: number;
  tags?: string[];
  source_book?: string;
}

interface PathFeature {
  id: string;
  name: string;
  description: string;
  level: number;
  action_type?: string;
  recharge?: string;
}

interface Job {
  id: string;
  name: string;
}

export const PathDetail = ({ data }: { data: PathData }) => {
  const [features, setFeatures] = useState<PathFeature[]>([]);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchRelatedData = async () => {
      const [featuresRes, jobEntity] = await Promise.all([
        supabase
          .from('compendium_job_features')
          .select('*')
          .eq('path_id', data.id)
          .order('level'),
        resolveRef('jobs', data.job_id),
      ]);

      if (featuresRes.data) setFeatures(featuresRes.data);
      if (jobEntity) setJob({ id: jobEntity.id, name: jobEntity.name });
    };

    fetchRelatedData();
  }, [data.id, data.job_id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemWindow title={data.name.toUpperCase()} className="border-blue-500/50">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <GitBranch className="w-6 h-6 text-blue-400" />
            {job && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Swords className="w-3 h-3" />
                {job.name} Path
              </Badge>
            )}
            <Badge variant="outline">Available at Level {data.path_level}</Badge>
          </div>
          
          {data.flavor_text && (
            <p className="text-muted-foreground italic border-l-2 border-blue-500/30 pl-4">
              {data.flavor_text}
            </p>
          )}
          
          <p className="text-foreground">{data.description}</p>
          
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </SystemWindow>

      {/* Path Features */}
      {features.length > 0 && (
        <SystemWindow title="PATH FEATURES">
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.id} className="border-l-2 border-blue-500/30 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-heading font-semibold text-blue-400">{feature.name}</h4>
                  <Badge variant="outline" className="text-xs">Level {feature.level}</Badge>
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

      {features.length === 0 && (
        <SystemWindow title="PATH FEATURES">
          <p className="text-muted-foreground">
            Path features are integrated into the parent job's feature progression.
          </p>
        </SystemWindow>
      )}

      {data.source_book && (
        <div className="flex justify-end">
          <Badge variant="outline">{data.source_book}</Badge>
        </div>
      )}
    </div>
  );
};