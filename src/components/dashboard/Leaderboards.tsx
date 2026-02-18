import { useQuery } from '@tanstack/react-query';
import { Trophy, Users, Swords } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';

interface TopCharacter {
  id: string;
  name: string;
  level: number;
  user_id: string;
}

interface TopCampaign {
  id: string;
  name: string;
  member_count: number;
}

export function Leaderboards() {
  const { data: topCharacters = [], isLoading: loadingCharacters } = useQuery({
    queryKey: ['leaderboard-characters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('id, name, level, user_id')
        .order('level', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as TopCharacter[];
    },
  });

  const { data: topCampaigns = [], isLoading: loadingCampaigns } = useQuery({
    queryKey: ['leaderboard-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          id,
          name,
          campaign_members!inner(count)
        `)
        .order('campaign_members(count)', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        member_count: campaign.campaign_members?.[0]?.count || 0,
      })) as TopCampaign[];
    },
  });

  return (
    <div className="space-y-6">
      <SystemWindow title="🏆 LEADERBOARDS" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Characters by Level */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-semibold">Top Characters by Level</h3>
            </div>
            {loadingCharacters ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded border border-border bg-muted/30 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-muted" />
                      <div className="w-32 h-4 bg-muted rounded" />
                    </div>
                    <div className="w-8 h-4 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {topCharacters.map((character, index) => (
                  <div key={character.id} className="flex items-center justify-between p-3 rounded border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant={index < 3 ? "default" : "secondary"} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </Badge>
                      <span className="font-heading font-medium truncate">{character.name}</span>
                    </div>
                    <Badge variant="outline">Level {character.level}</Badge>
                  </div>
                ))}
                {topCharacters.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No characters yet. Create your first character!</p>
                )}
              </div>
            )}
          </div>

          {/* Top Campaigns by Members */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-semibold">Top Campaigns by Members</h3>
            </div>
            {loadingCampaigns ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded border border-border bg-muted/30 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-muted" />
                      <div className="w-32 h-4 bg-muted rounded" />
                    </div>
                    <div className="w-12 h-4 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {topCampaigns.map((campaign, index) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 rounded border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant={index < 3 ? "default" : "secondary"} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </Badge>
                      <span className="font-heading font-medium truncate">{campaign.name}</span>
                    </div>
                    <Badge variant="outline">{campaign.member_count} members</Badge>
                  </div>
                ))}
                {topCampaigns.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No campaigns yet. Start your first campaign!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </SystemWindow>
    </div>
  );
}
