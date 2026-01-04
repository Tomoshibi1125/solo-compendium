import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  variant?: 'card' | 'list' | 'text' | 'grid';
}

export function SkeletonLoader({ className, count = 1, variant = 'card' }: SkeletonLoaderProps) {
  if (variant === 'card' || variant === 'grid') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "glass-card border border-arise/20 relative overflow-hidden",
              className
            )}
          >
            {/* System scanning effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-arise/5 to-transparent animate-system-scan" />
            
            <div className="p-4 space-y-3 relative">
              {/* Category badge skeleton */}
              <div className="h-4 bg-gradient-to-r from-arise/20 to-shadow-purple/20 rounded w-1/4 animate-pulse" />
              {/* Title skeleton */}
              <div className="h-6 bg-gradient-to-r from-arise/30 to-shadow-purple/20 rounded w-3/4 animate-pulse" />
              {/* Description skeletons */}
              <div className="h-4 bg-arise/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-arise/10 rounded w-5/6 animate-pulse" />
            </div>
            
            {/* Bottom glow effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-arise/30 to-transparent" />
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
              "glass-card border border-arise/20 p-3 flex items-center gap-4 relative overflow-hidden",
              className
            )}
          >
            {/* System scanning effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-arise/5 to-transparent animate-system-scan" />
            
            <div className="h-4 bg-gradient-to-r from-arise/30 to-shadow-purple/20 rounded w-24 flex-shrink-0 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-arise/20 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-arise/10 rounded w-full animate-pulse" />
            </div>
            <div className="h-4 bg-arise/20 rounded w-20 flex-shrink-0 animate-pulse" />
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
          className={cn(
            "h-4 bg-gradient-to-r from-arise/20 to-shadow-purple/10 rounded animate-pulse",
            className
          )}
          style={{ width: i % 2 === 0 ? '100%' : '80%' }}
        />
      ))}
    </>
  );
}
