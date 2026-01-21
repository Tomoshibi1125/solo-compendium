import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular } from '@/lib/vernacular';

interface CompendiumLinkProps {
  type: 'jobs' | 'paths' | 'powers' | 'relics' | 'monsters' | 'backgrounds' | 'conditions' | 'monarchs' | 'feats' | 'skills' | 'equipment' | 'shadow-soldiers';
  id: string;
  name: string;
  className?: string;
  variant?: 'link' | 'button';
}

export function CompendiumLink({ type, id, name, className, variant = 'link' }: CompendiumLinkProps) {
  const href = `/compendium/${type}/${id}`;
  const displayName = formatMonarchVernacular(name);

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="sm"
        asChild
        className={cn("gap-2", className)}
      >
        <Link to={href}>
          {displayName}
          <ExternalLink className="w-3 h-3" />
        </Link>
      </Button>
    );
  }

  return (
    <Link
      to={href}
      className={cn(
        "text-primary hover:underline inline-flex items-center gap-1",
        className
      )}
    >
      {displayName}
      <ExternalLink className="w-3 h-3" />
    </Link>
  );
}

