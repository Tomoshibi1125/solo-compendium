import { Search, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'no-results' | 'no-favorites' | 'no-category';
  searchQuery?: string;
  onClearFilters?: () => void;
  onClearSearch?: () => void;
  className?: string;
}

export function EmptyState({ 
  type, 
  searchQuery, 
  onClearFilters, 
  onClearSearch,
  className 
}: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <SystemWindow title="NO RESULTS FOUND" className={cn("max-w-md mx-auto", className)}>
        <div className="text-center py-8 space-y-4">
          <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
          <div>
            <p className="font-heading text-lg mb-2">No entries match your search</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? (
                <>No results found for "<span className="font-semibold">{searchQuery}</span>"</>
              ) : (
                'Try adjusting your filters or search terms'
              )}
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            {onClearSearch && searchQuery && (
              <Button variant="outline" size="sm" onClick={onClearSearch}>
                Clear Search
              </Button>
            )}
            {onClearFilters && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </SystemWindow>
    );
  }

  if (type === 'no-favorites') {
    return (
      <SystemWindow title="NO FAVORITES" className={cn("max-w-md mx-auto", className)}>
        <div className="text-center py-8 space-y-4">
          <Sparkles className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
          <div>
            <p className="font-heading text-lg mb-2">No favorites yet</p>
            <p className="text-sm text-muted-foreground">
              Start favoriting entries to build your collection
            </p>
          </div>
        </div>
      </SystemWindow>
    );
  }

  return (
    <SystemWindow title="NO ENTRIES" className={cn("max-w-md mx-auto", className)}>
      <div className="text-center py-8 space-y-4">
        <Filter className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
        <div>
          <p className="font-heading text-lg mb-2">No entries in this category</p>
          <p className="text-sm text-muted-foreground">
            Try selecting a different category or adjusting your filters
          </p>
        </div>
      </div>
    </SystemWindow>
  );
}

