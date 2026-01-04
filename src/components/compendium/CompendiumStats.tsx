import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BookOpen, Star } from 'lucide-react';

interface CompendiumStatsProps {
  totalEntries: number;
  filteredEntries: number;
  favoriteCount: number;
  sourceBookCount: number;
}

export function CompendiumStats({
  totalEntries,
  filteredEntries,
  favoriteCount,
  sourceBookCount,
}: CompendiumStatsProps) {
  return (
    <SystemWindow title="STATISTICS" className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Total Entries</span>
          </div>
          <Badge variant="secondary">{totalEntries}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Filtered Results</span>
          </div>
          <Badge variant={filteredEntries < totalEntries ? 'default' : 'secondary'}>
            {filteredEntries}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Favorites</span>
          </div>
          <Badge variant="secondary">{favoriteCount}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Source Books</span>
          </div>
          <Badge variant="secondary">{sourceBookCount}</Badge>
        </div>
      </div>
    </SystemWindow>
  );
}

