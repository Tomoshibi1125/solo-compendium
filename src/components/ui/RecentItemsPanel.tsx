import { Link } from 'react-router-dom';
import { Clock, X, BookOpen, Users, Crown, Sparkles, Swords } from 'lucide-react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRecentItems } from '@/hooks/useRecentItems';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'jobs': Swords,
  'paths': Swords,
  'powers': Sparkles,
  'relics': Sparkles,
  'monsters': Crown,
  'shadow-soldiers': Sparkles,
  'characters': Users,
  'compendium': BookOpen,
};

const typeLabels: Record<string, string> = {
  'jobs': 'Job',
  'paths': 'Path',
  'powers': 'Power',
  'relics': 'Relic',
  'monsters': 'Monster',
  'shadow-soldiers': 'Shadow',
  'characters': 'Character',
  'compendium': 'Compendium',
};

interface RecentItemsPanelProps {
  className?: string;
  maxItems?: number;
}

export function RecentItemsPanel({ className, maxItems = 10 }: RecentItemsPanelProps) {
  const { recentItems, removeRecentItem, clearRecentItems } = useRecentItems();

  const displayItems = recentItems.slice(0, maxItems);

  if (displayItems.length === 0) {
    return (
      <SystemWindow title="RECENT ITEMS" className={className}>
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No recent items</p>
        </div>
      </SystemWindow>
    );
  }

  return (
    <SystemWindow 
      title="RECENT ITEMS" 
      className={className}
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={clearRecentItems}
          className="text-xs"
        >
          Clear All
        </Button>
      }
    >
      <div className="space-y-2">
        {displayItems.map((item) => {
          const Icon = typeIcons[item.type] || BookOpen;
          return (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors group"
            >
              <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Link
                to={item.href}
                className="flex-1 min-w-0 text-sm hover:text-primary transition-colors"
              >
                <div className="truncate">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {typeLabels[item.type] || item.type}
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  removeRecentItem(item.id, item.type);
                }}
                aria-label={`Remove ${item.name} from recent items`}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </SystemWindow>
  );
}

