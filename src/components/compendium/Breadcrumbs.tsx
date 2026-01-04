import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center gap-2 text-sm text-muted-foreground mb-6", className)}
    >
      <Link 
        to="/" 
        className="hover:text-foreground transition-colors flex items-center gap-1"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only md:not-sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        // Use composite key: label + index since breadcrumbs are stable and don't reorder
        const key = `${item.label}-${index}`;
        
        return (
          <div key={key} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            {isLast || !item.href ? (
              <span className={cn(
                "font-medium",
                isLast && "text-foreground"
              )}>
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

