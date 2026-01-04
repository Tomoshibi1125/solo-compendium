import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Heart, Shield, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuickStatsDashboardProps {
  className?: string;
}

export function QuickStatsDashboard({ className }: QuickStatsDashboardProps) {
  const { data: characters = [] } = useQuery({
    queryKey: ['characters-quick-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('id, name, level, hp_current, hp_max, armor_class, job, path')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
  });

  const totalLevels = characters.reduce((sum, c) => sum + (c.level || 0), 0);
  const avgLevel = characters.length > 0 ? Math.round(totalLevels / characters.length) : 0;
  const totalHP = characters.reduce((sum, c) => sum + (c.hp_current || 0), 0);
  const totalMaxHP = characters.reduce((sum, c) => sum + (c.hp_max || 0), 0);
  const avgAC = characters.length > 0
    ? Math.round(characters.reduce((sum, c) => sum + (c.armor_class || 10), 0) / characters.length)
    : 0;

  return (
    <SystemWindow title="QUICK STATS" className={className}>
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded bg-muted/30">
            <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="font-display text-2xl">{characters.length}</div>
            <div className="text-xs text-muted-foreground">Characters</div>
          </div>
          <div className="text-center p-3 rounded bg-muted/30">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="font-display text-2xl">{avgLevel}</div>
            <div className="text-xs text-muted-foreground">Avg Level</div>
          </div>
          <div className="text-center p-3 rounded bg-muted/30">
            <Heart className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="font-display text-2xl">
              {totalHP}/{totalMaxHP}
            </div>
            <div className="text-xs text-muted-foreground">Total HP</div>
          </div>
        </div>

        {/* Recent Characters */}
        {characters.length > 0 && (
          <div>
            <h3 className="font-heading text-sm text-muted-foreground mb-2">Recent Characters</h3>
            <div className="space-y-2">
              {characters.map((character) => (
                <Link
                  key={character.id}
                  to={`/characters/${character.id}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-heading text-sm truncate">{character.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Level {character.level} {character.job}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-xs text-muted-foreground">
                      <Heart className="w-3 h-3 inline mr-1" />
                      {character.hp_current}/{character.hp_max}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Shield className="w-3 h-3 inline mr-1" />
                      {character.armor_class}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {characters.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No characters yet</p>
            <Link to="/characters/new" className="text-primary hover:underline text-sm mt-2 inline-block">
              Create your first character
            </Link>
          </div>
        )}
      </div>
    </SystemWindow>
  );
}

