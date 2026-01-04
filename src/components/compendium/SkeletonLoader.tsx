import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  variant?: 'card' | 'list' | 'text';
}

export function SkeletonLoader({ className, count = 1, variant = 'card' }: SkeletonLoaderProps) {
  if (variant === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "glass-card border animate-pulse",
              className
            )}
          >
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'list') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "glass-card border animate-pulse p-3 flex items-center gap-4",
              className
            )}
          >
            <div className="h-4 bg-muted rounded w-24 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
            </div>
            <div className="h-4 bg-muted rounded w-20 flex-shrink-0" />
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn("h-4 bg-muted rounded animate-pulse", className)}
          style={{ width: i % 2 === 0 ? '100%' : '80%' }}
        />
      ))}
    </>
  );
}

