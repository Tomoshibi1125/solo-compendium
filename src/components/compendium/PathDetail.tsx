import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GitBranch, Swords, Star, Shield, Zap } from 'lucide-react';

interface PathData {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  jobId?: string;
  jobName?: string;
  tier?: number;
  level?: number;
  prerequisites?: string;
  tags?: string[];
  source_book?: string;
  image_url?: string;
}

export const PathDetail = ({ data }: { data: PathData }) => {
  const displayName = data.display_name || data.name;

  // Generate path features based on data structure
  const mockFeatures = [
    { name: 'Path Feature 1', description: 'Basic ability gained at this path level.', level: data.level || 5 },
    { name: 'Path Feature 2', description: 'Advanced ability gained through progression.', level: (data.level || 5) + 4 },
    { name: 'Path Feature 3', description: 'Master ability gained at higher levels.', level: (data.level || 5) + 8 },
    { name: 'Path Ultimate', description: 'Ultimate ability of this path.', level: (data.level || 5) + 12 },
  ];

  const mockAbilities = [
    { name: 'Signature Attack', description: 'A powerful attack unique to this path.', cooldown: 3, cost: 'Action' },
    { name: 'Defensive Maneuver', description: 'A defensive ability for survival.', cooldown: 5, cost: 'Bonus Action' },
    { name: 'Utility Skill', description: 'A useful ability for exploration or social interaction.', cooldown: 1, cost: 'Action' },
  ];

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
          {data.jobName && (
            <p className="text-muted-foreground mt-1">
              Subclass of <span className="font-semibold">{data.jobName}</span>
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
        <p className="text-muted-foreground leading-relaxed">{data.description}</p>
      </div>

      {/* Requirements */}
      {(data.level || data.prerequisites) && (
        <div>
          <h3 className="text-lg font-semibold mb-3 font-heading">Requirements</h3>
          <div className="space-y-2">
            {data.level && (
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4" />
                <span>Level {data.level}</span>
              </div>
            )}
            {data.prerequisites && (
              <div className="text-sm text-muted-foreground">
                Prerequisites: {data.prerequisites}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features */}
      <div>
        <h3 className="text-lg font-semibold mb-3 font-heading">Path Features</h3>
        <div className="space-y-4">
          {mockFeatures.map((feature, index) => (
            <div key={index} className="p-4 bg-card border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-primary">Level {feature.level}</span>
                <span className="font-semibold">{feature.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Abilities */}
      <div>
        <h3 className="text-lg font-semibold mb-3 font-heading">Signature Abilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAbilities.map((ability, index) => (
            <div key={index} className="p-4 bg-card border rounded-lg">
              <h4 className="font-semibold mb-2">{ability.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{ability.description}</p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                {ability.cooldown && <span>Cooldown: {ability.cooldown} turns</span>}
                {ability.cost && <span>Cost: {ability.cost}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 font-heading">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="capitalize">
                {tag.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Source */}
      {data.source_book && (
        <div className="text-sm text-muted-foreground">
          Source: {data.source_book}
        </div>
      )}
    </div>
  );
};
