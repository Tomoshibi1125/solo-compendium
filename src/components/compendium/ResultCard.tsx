import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular, MONARCH_LABEL } from '@/lib/vernacular';

interface ResultCardEntry {
  id: string;
  name: string;
  type: string;
  description: string;
  rarity?: string;
  gate_rank?: string;
  level?: number;
  cr?: string;
  school?: string;
  source_book?: string;
  isFavorite?: boolean;
  is_boss?: boolean;
  tags?: string[];
}

interface ResultCardProps {
  entry: ResultCardEntry;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  getRarityOrRankColor: (entry: ResultCardEntry) => string;
  getRarityOrRankLabel: (entry: ResultCardEntry) => string;
  highlightText: (text: string, query: string) => React.ReactNode;
  onToggleFavorite: (e: React.MouseEvent, entry: ResultCardEntry) => void;
}

function ResultCardComponent({
  entry,
  viewMode,
  searchQuery,
  getRarityOrRankColor,
  getRarityOrRankLabel,
  highlightText,
  onToggleFavorite,
}: ResultCardProps) {
  const displayName = formatMonarchVernacular(entry.name);
  const displayType = formatMonarchVernacular(entry.type);
  const displaySourceBook = entry.source_book ? formatMonarchVernacular(entry.source_book) : null;
  if (viewMode === 'grid') {
    return (
      <Link
        to={`/compendium/${entry.type}/${entry.id}`}
        className={cn(
          "glass-card border hover:border-primary/30 transition-all duration-200 group relative p-4",
          "hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          getRarityOrRankColor(entry)
        )}
        aria-label={`View ${displayName} details`}
      >
        <button
          onClick={(e) => onToggleFavorite(e, entry)}
          className={cn(
            "absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all duration-200",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            entry.isFavorite
              ? "text-amber-400 hover:text-amber-300 bg-amber-400/10"
              : "text-muted-foreground hover:text-amber-400 opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm"
          )}
          aria-label={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn("w-4 h-4 transition-all", entry.isFavorite && "fill-current")} />
        </button>

        <div className="flex items-start justify-between mb-2">
          <span className={cn(
            "text-xs font-display uppercase",
            getRarityOrRankColor(entry)
          )}>
            {getRarityOrRankLabel(entry)}
          </span>
          <div className="flex items-center gap-2">
            {displaySourceBook && (
              <Badge variant="outline" className="text-xs">
                {displaySourceBook}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground capitalize">
              {displayType}
            </span>
          </div>
        </div>
        <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {highlightText(entry.name, searchQuery)}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {highlightText(entry.description, searchQuery)}
        </p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {entry.is_boss && (
            <Badge variant="destructive" className="text-xs">Boss</Badge>
          )}
          {entry.tags?.includes('mini-boss') && (
            <Badge variant="outline" className="text-xs border-orange-500/50 text-orange-400">Mini-Boss</Badge>
          )}
          {entry.tags?.includes('named-npc') && (
            <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-400">Named NPC</Badge>
          )}
          {entry.tags?.includes('named-boss') && (
            <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">Named Boss</Badge>
          )}
          {entry.tags?.includes('monarch') && (
            <Badge variant="outline" className="text-xs border-red-500/50 text-red-400">{MONARCH_LABEL}</Badge>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {entry.cr && (
              <span>CR {entry.cr}</span>
            )}
            {entry.school && (
              <span>• {entry.school}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/compendium/${entry.type}/${entry.id}`}
      className={cn(
        "glass-card border hover:border-primary/30 transition-all duration-200 group relative p-3 flex items-center gap-4",
        "hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        getRarityOrRankColor(entry)
      )}
      aria-label={`View ${displayName} details`}
    >
      <button
        onClick={(e) => onToggleFavorite(e, entry)}
        className={cn(
          "absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all duration-200",
          "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          entry.isFavorite
            ? "text-amber-400 hover:text-amber-300 bg-amber-400/10"
            : "text-muted-foreground hover:text-amber-400 opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm"
        )}
        aria-label={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={cn("w-4 h-4 transition-all", entry.isFavorite && "fill-current")} />
      </button>

      <span className={cn(
        "text-xs font-display uppercase w-24 flex-shrink-0",
        getRarityOrRankColor(entry)
      )}>
        {getRarityOrRankLabel(entry)}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
          {highlightText(entry.name, searchQuery)}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
          {highlightText(entry.description, searchQuery)}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {displaySourceBook && (
          <Badge variant="outline" className="text-xs">
            {displaySourceBook}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground capitalize">
          {displayType}
        </span>
      </div>
    </Link>
  );
}

export const ResultCard = memo(ResultCardComponent, (prevProps, nextProps) => {
  // Custom comparison - only re-render if entry or key props change
  return (
    prevProps.entry.id === nextProps.entry.id &&
    prevProps.entry.isFavorite === nextProps.entry.isFavorite &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.searchQuery === nextProps.searchQuery
  );
});
