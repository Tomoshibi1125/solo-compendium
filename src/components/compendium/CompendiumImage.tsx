import { useState, useEffect } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  optimizeImageUrl,
  generateSrcSet,
  generateSizes,
  getBestImageFormat,
  type ImageSize,
} from '@/lib/imageOptimization';

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
  const [optimizedSrc, setOptimizedSrc] = useState<string | null>(null);
  const [srcSet, setSrcSet] = useState<string>('');
  const [bestFormat, setBestFormat] = useState<'avif' | 'webp' | 'original'>('original');

  // Optimize image on mount
  useEffect(() => {
    if (!src) {
      setOptimizedSrc(null);
      setSrcSet('');
      return;
    }

    // Get best format for browser
    const format = getBestImageFormat();
    setBestFormat(format);

    // Generate optimized URL
    const optimized = optimizeImageUrl(src, {
      width: size === 'hero' ? 1920 : size === 'large' ? 512 : size === 'medium' ? 256 : 128,
      quality: 80,
      format: format === 'original' ? undefined : format,
    });
    setOptimizedSrc(optimized);

    // Generate srcset for responsive images
    const sizes: ImageSize[] = 
      size === 'hero' 
        ? ['medium', 'large', 'xlarge', 'hero']
        : size === 'large'
        ? ['small', 'medium', 'large']
        : ['thumbnail', 'small', 'medium'];
    
    const webpSrcSet = generateSrcSet(src, sizes, 'webp');
    const avifSrcSet = format === 'avif' ? generateSrcSet(src, sizes, 'avif') : '';
    
    // Combine srcsets
    const combinedSrcSet = [avifSrcSet, webpSrcSet].filter(Boolean).join(', ');
    setSrcSet(combinedSrcSet);
  }, [src, size]);

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
      <picture>
        {/* AVIF source (best compression) */}
        {bestFormat === 'avif' && srcSet && (
          <source
            srcSet={generateSrcSet(src || '', 
              size === 'hero' 
                ? ['medium', 'large', 'xlarge', 'hero']
                : size === 'large'
                ? ['small', 'medium', 'large']
                : ['thumbnail', 'small', 'medium'],
              'avif'
            )}
            sizes={generateSizes(size)}
            type="image/avif"
          />
        )}
        {/* WebP source (good compression, wider support) */}
        {srcSet && (
          <source
            srcSet={generateSrcSet(src || '', 
              size === 'hero' 
                ? ['medium', 'large', 'xlarge', 'hero']
                : size === 'large'
                ? ['small', 'medium', 'large']
                : ['thumbnail', 'small', 'medium'],
              'webp'
            )}
            sizes={generateSizes(size)}
            type="image/webp"
          />
        )}
        {/* Fallback image */}
        <img
          src={optimizedSrc || src || undefined}
          srcSet={srcSet || undefined}
          sizes={generateSizes(size)}
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
      </picture>
    </div>
  );
}

