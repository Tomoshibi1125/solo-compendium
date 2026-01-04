import { useState } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompendiumImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero';
  fallbackIcon?: React.ReactNode;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
}

const sizeClasses = {
  thumbnail: 'w-16 h-16',
  small: 'w-32 h-32',
  medium: 'w-48 h-48',
  large: 'w-64 h-64',
  hero: 'w-full h-auto max-h-[500px]',
};

const aspectRatioClasses = {
  square: 'aspect-square',
  landscape: 'aspect-video',
  portrait: 'aspect-[3/4]',
  auto: '',
};

export function CompendiumImage({
  src,
  alt,
  className,
  size = 'medium',
  fallbackIcon,
  aspectRatio = 'auto',
}: CompendiumImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (!src || error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted/30 border border-dashed border-muted-foreground/30 rounded-lg',
          sizeClasses[size],
          aspectRatio === 'auto' ? '' : aspectRatioClasses[aspectRatio],
          className
        )}
        aria-label={`Image placeholder for ${alt}`}
      >
        {fallbackIcon || <ImageIcon className="w-8 h-8 text-muted-foreground" />}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      {loading && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-muted/30',
            sizeClasses[size],
            aspectRatio === 'auto' ? '' : aspectRatioClasses[aspectRatio]
          )}
        >
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'object-cover transition-opacity duration-300',
          sizeClasses[size],
          aspectRatio === 'auto' ? '' : aspectRatioClasses[aspectRatio],
          loading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

