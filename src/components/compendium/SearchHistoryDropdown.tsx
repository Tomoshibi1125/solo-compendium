import { History, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchHistoryDropdownProps {
  onSelect: (query: string) => void;
  className?: string;
}

export function SearchHistoryDropdown({ onSelect, className }: SearchHistoryDropdownProps) {
  const { history, removeFromHistory, clearHistory, getRecentSearches } = useSearchHistory();
  const recentSearches = getRecentSearches(10);

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("h-9 w-9", className)}>
          <History className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Search History</span>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                clearHistory();
              }}
            >
              Clear
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {recentSearches.map((item) => (
            <DropdownMenuItem
              key={item.timestamp}
              className="flex items-center justify-between gap-2 cursor-pointer"
              onSelect={() => onSelect(item.query)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.query}</div>
                {item.resultCount !== undefined && (
                  <div className="text-xs text-muted-foreground">
                    {item.resultCount} results • {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(item.query);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

