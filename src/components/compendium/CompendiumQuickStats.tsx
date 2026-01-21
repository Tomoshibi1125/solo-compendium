import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Book, Sword, Wand2, Shield, Crown, Users, Skull, Sparkles, Scroll, Box } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MONARCH_LABEL_PLURAL } from '@/lib/vernacular';

interface CategoryStat {
  category: string;
  count: number;
  icon: typeof Book;
  color: string;
}

export function CompendiumQuickStats() {
  const { data: stats = [] } = useQuery({
    queryKey: ['compendium-quick-stats'],
    queryFn: async () => {
      const counts = await Promise.all([
        supabase.from('compendium_jobs').select('id', { count: 'exact', head: true }),
        supabase.from('compendium_job_paths').select('id', { count: 'exact', head: true }),
        supabase.from('compendium_powers').select('id', { count: 'exact', head: true }),
        supabase.from('compendium_equipment').select('id', { count: 'exact', head: true }),
        supabase.from('compendium_relics').select('id', { count: 'exact', head: true }),
        supabase.from('compendium_monsters').select('id', { count: 'exact', head: true }),
        supabase.from('compendium_monarchs').select('id', { count: 'exact', head: true }),
        supabase.from('compendium_backgrounds').select('id', { count: 'exact', head: true }),
        supabase.from('compendium_feats').select('id', { count: 'exact', head: true }),
        supabase.from('compendium_shadow_soldiers').select('id', { count: 'exact', head: true }),
      ]);

      const categories: CategoryStat[] = [
        { category: 'Jobs', count: counts[0].count || 0, icon: Users, color: 'text-blue-400' },
        { category: 'Paths', count: counts[1].count || 0, icon: Sword, color: 'text-red-400' },
        { category: 'Powers', count: counts[2].count || 0, icon: Wand2, color: 'text-purple-400' },
        { category: 'Equipment', count: counts[3].count || 0, icon: Shield, color: 'text-green-400' },
        { category: 'Relics', count: counts[4].count || 0, icon: Sparkles, color: 'text-yellow-400' },
        { category: 'Monsters', count: counts[5].count || 0, icon: Skull, color: 'text-rose-400' },
        { category: MONARCH_LABEL_PLURAL, count: counts[6].count || 0, icon: Crown, color: 'text-arise' },
        { category: 'Backgrounds', count: counts[7].count || 0, icon: Scroll, color: 'text-cyan-400' },
        { category: 'Feats', count: counts[8].count || 0, icon: Book, color: 'text-orange-400' },
        { category: 'Umbral Legion', count: counts[9].count || 0, icon: Box, color: 'text-violet-400' },
      ];

      return categories.filter(c => c.count > 0);
    },
    staleTime: 60000,
  });

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.category} className="border-primary/20 bg-card/50 hover:border-primary/40 transition-colors">
            <CardContent className="p-3 flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-muted/50", stat.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{stat.count}</p>
                <p className="text-xs text-muted-foreground">{stat.category}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

