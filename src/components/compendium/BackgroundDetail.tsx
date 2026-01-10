import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Coins, BookOpen, Users, Wrench } from 'lucide-react';

interface BackgroundData {
  id: string;
  name: string;
  display_name?: string | null;
  description: string;
  skill_proficiencies?: string[];
  tool_proficiencies?: string[];
  language_count?: number;
  starting_equipment?: string;
  starting_credits?: number;
  feature_name?: string;
  feature_description?: string;
  personality_traits?: string[];
  ideals?: string[];
  bonds?: string[];
  flaws?: string[];
  tags?: string[];
  source_book?: string;
}

export const BackgroundDetail = ({ data }: { data: BackgroundData }) => {
  const displayName = data.display_name || data.name;

  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemWindow title={displayName.toUpperCase()}>
        <div className="space-y-4">
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

      {/* Proficiencies & Starting */}
      <div className="grid md:grid-cols-2 gap-4">
        <SystemWindow title="PROFICIENCIES">
          <div className="space-y-3">
            <div>
              <h4 className="font-heading text-sm text-muted-foreground mb-1">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {data.skill_proficiencies?.map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                )) || <span className="text-muted-foreground">None</span>}
              </div>
            </div>
            {data.tool_proficiencies && data.tool_proficiencies.length > 0 && (
              <div>
                <h4 className="font-heading text-sm text-muted-foreground mb-1">Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {data.tool_proficiencies.map((tool) => (
                    <Badge key={tool} variant="outline">{tool}</Badge>
                  ))}
                </div>
              </div>
            )}
            {data.language_count && data.language_count > 0 && (
              <div>
                <h4 className="font-heading text-sm text-muted-foreground mb-1">Languages</h4>
                <span className="text-foreground">Choose {data.language_count}</span>
              </div>
            )}
          </div>
        </SystemWindow>

        <SystemWindow title="STARTING EQUIPMENT">
          <div className="space-y-3">
            {data.starting_equipment && (
              <p className="text-foreground">{data.starting_equipment}</p>
            )}
            {data.starting_credits && (
              <div className="flex items-center gap-2 mt-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="font-heading">{data.starting_credits} credits</span>
              </div>
            )}
          </div>
        </SystemWindow>
      </div>

      {/* Feature */}
      {data.feature_name && (
        <SystemWindow title={`FEATURE: ${data.feature_name.toUpperCase()}`} className="border-primary/50">
          <p className="text-foreground">{data.feature_description}</p>
        </SystemWindow>
      )}

      {/* Characteristics */}
      <div className="grid md:grid-cols-2 gap-4">
        {data.personality_traits && data.personality_traits.length > 0 && (
          <SystemWindow title="PERSONALITY TRAITS">
            <ul className="space-y-2">
              {data.personality_traits.map((trait, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  <span className="text-muted-foreground">{trait}</span>
                </li>
              ))}
            </ul>
          </SystemWindow>
        )}

        {data.ideals && data.ideals.length > 0 && (
          <SystemWindow title="IDEALS">
            <ul className="space-y-2">
              {data.ideals.map((ideal, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  <span className="text-muted-foreground">{ideal}</span>
                </li>
              ))}
            </ul>
          </SystemWindow>
        )}

        {data.bonds && data.bonds.length > 0 && (
          <SystemWindow title="BONDS">
            <ul className="space-y-2">
              {data.bonds.map((bond, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  <span className="text-muted-foreground">{bond}</span>
                </li>
              ))}
            </ul>
          </SystemWindow>
        )}

        {data.flaws && data.flaws.length > 0 && (
          <SystemWindow title="FLAWS">
            <ul className="space-y-2">
              {data.flaws.map((flaw, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">{i + 1}.</span>
                  <span className="text-muted-foreground">{flaw}</span>
                </li>
              ))}
            </ul>
          </SystemWindow>
        )}
      </div>

      {data.source_book && (
        <div className="flex justify-end">
          <Badge variant="outline">{data.source_book}</Badge>
        </div>
      )}
    </div>
  );
};