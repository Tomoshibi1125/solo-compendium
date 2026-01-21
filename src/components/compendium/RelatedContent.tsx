import { Link } from 'react-router-dom';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular } from '@/lib/vernacular';

interface RelatedEntry {
  id: string;
  name: string;
  type: string;
  description?: string;
}

interface RelatedContentProps {
  title: string;
  entries: RelatedEntry[];
  className?: string;
}

export function RelatedContent({ title, entries, className }: RelatedContentProps) {
  if (entries.length === 0) return null;

  return (
    <SystemWindow title={title.toUpperCase()} compact className={className}>
      <div className="space-y-2">
        {entries.slice(0, 5).map((entry) => (
          <Link
            key={`${entry.type}-${entry.id}`}
            to={`/compendium/${entry.type}/${entry.id}`}
            className={cn(
              "flex items-start justify-between gap-2 p-2 rounded-md",
              "hover:bg-accent transition-colors group"
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-heading text-sm font-medium group-hover:text-primary transition-colors">
                  {formatMonarchVernacular(entry.name)}
                </span>
                <Badge variant="outline" className="text-xs capitalize">
                  {formatMonarchVernacular(entry.type)}
                </Badge>
              </div>
              {entry.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {formatMonarchVernacular(entry.description)}
                </p>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
          </Link>
        ))}
      </div>
    </SystemWindow>
  );
}

