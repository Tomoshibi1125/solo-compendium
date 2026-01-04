import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Hash } from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [items]);

  if (items.length === 0) return null;

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className={cn("space-y-1 print:hidden", className)}>
      <h3 className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground mb-3">
        Contents
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToId(item.id)}
              className={cn(
                "flex items-center gap-2 text-xs text-left w-full px-2 py-1 rounded transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                activeId === item.id 
                  ? "text-primary font-semibold bg-primary/10" 
                  : "text-muted-foreground"
              )}
              style={{ paddingLeft: `${(item.level - 1) * 1 + 0.5}rem` }}
            >
              <Hash className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

