import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { getStaggerDelay } from '@/lib/animations';

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export function AnimatedList({ children, className, staggerDelay = 30 }: AnimatedListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children.map((child, index) => (
        <div
          key={index}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{
            animationDelay: `${getStaggerDelay(index, staggerDelay)}ms`,
            animationFillMode: 'both',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

