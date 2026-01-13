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
import { getAssetUrl } from '@/data/compendium/assetManifest';

interface CompendiumImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero';
  fallbackIcon?: React.ReactNode;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
  // New props for canonical asset mapping
  entryId?: string;
  entryType?: string;
  assetType?: 'portrait' | 'thumbnail' | 'banner' | 'icon' | 'token';
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
  entryId,
  entryType,
  assetType,
}: CompendiumImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState<string | null>(null);
  const [srcSet, setSrcSet] = useState<string>('');
  const [bestFormat, setBestFormat] = useState<'avif' | 'webp' | 'original'>('original');

  // Determine the actual image source to use
  const getImageSource = () => {
    // If we have entry info, try canonical asset mapping first
    if (entryId && entryType && assetType) {
      const canonicalUrl = getAssetUrl(entryId, entryType, assetType);
      if (canonicalUrl && canonicalUrl !== '/placeholder.svg') {
        return canonicalUrl;
      }
    }
    
    // Fall back to provided src
    return src;
  };

  const imageSrc = getImageSource();

  // Optimize image on mount
  useEffect(() => {
    if (!imageSrc) {
      setOptimizedSrc(null);
      setSrcSet('');
      return;
    }

    // Get best format for browser
    const format = getBestImageFormat();
    setBestFormat(format);

    // Generate optimized URL
    const optimized = optimizeImageUrl(imageSrc, {
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
    
    const webpSrcSet = generateSrcSet(imageSrc, sizes, 'webp');
    const avifSrcSet = format === 'avif' ? generateSrcSet(imageSrc, sizes, 'avif') : '';
    
    // Combine srcsets
    const combinedSrcSet = [avifSrcSet, webpSrcSet].filter(Boolean).join(', ');
    setSrcSet(combinedSrcSet);
  }, [imageSrc, size]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (!imageSrc || error) {
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
            srcSet={generateSrcSet(imageSrc || '', 
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
            srcSet={generateSrcSet(imageSrc || '', 
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
          src={optimizedSrc || imageSrc || undefined}
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

