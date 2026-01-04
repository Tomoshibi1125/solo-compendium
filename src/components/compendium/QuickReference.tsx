import { ReactNode } from 'react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Download, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickReferenceProps {
  entry: {
    name: string;
    type: string;
    source_book?: string | null;
    tags?: string[] | null;
    rarity?: string | null;
    gate_rank?: string | null;
    level?: number | null;
    cr?: string | null;
  };
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  className?: string;
}

export function QuickReference({ 
  entry, 
  isFavorite, 
  onToggleFavorite,
  onShare,
  onExport,
  className 
}: QuickReferenceProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Actions */}
      <SystemWindow title="ACTIONS" compact>
        <div className="flex flex-col gap-2">
          {onToggleFavorite && (
            <Button
              variant={isFavorite ? "default" : "outline"}
              size="sm"
              onClick={onToggleFavorite}
              className="w-full justify-start"
            >
              <Heart className={cn("w-4 h-4 mr-2", isFavorite && "fill-current")} />
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          )}
          {onShare && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="w-full justify-start"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </SystemWindow>

      {/* Quick Stats */}
      <SystemWindow title="QUICK REFERENCE" compact>
        <div className="space-y-3">
          {entry.source_book && (
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Source</span>
              <div className="mt-1">
                <Badge variant="outline" className="text-xs">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {entry.source_book}
                </Badge>
              </div>
            </div>
          )}
          
          {(entry.rarity || entry.gate_rank) && (
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {entry.gate_rank ? 'Gate Rank' : 'Rarity'}
              </span>
              <div className="mt-1">
                <Badge variant="secondary" className="text-xs">
                  {entry.gate_rank || entry.rarity}
                </Badge>
              </div>
            </div>
          )}
          
          {(entry.level !== null && entry.level !== undefined) && (
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Level</span>
              <div className="mt-1 font-display text-lg">{entry.level}</div>
            </div>
          )}
          
          {entry.cr && (
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Challenge Rating</span>
              <div className="mt-1 font-display text-lg">{entry.cr}</div>
            </div>
          )}
          
          {entry.tags && entry.tags.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Tags</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {entry.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </SystemWindow>
    </div>
  );
}

