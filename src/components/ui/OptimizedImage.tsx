import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import {
  generateSrcSet,
  generateSizes,
  getBestImageFormat,
  optimizeImageUrl,
  type ImageSize,
} from '@/lib/imageOptimization';
import { usePerformanceProfile } from '@/lib/performanceProfile';

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null;
  alt: string;
  size?: ImageSize;
  quality?: number;
};

const sizeVariants: Record<ImageSize, ImageSize[]> = {
  thumbnail: ['thumbnail', 'small'],
  small: ['small', 'medium'],
  medium: ['medium', 'large'],
  large: ['large', 'xlarge'],
  xlarge: ['xlarge', 'hero'],
  hero: ['hero'],
};

const isDataUrl = (value: string) => value.startsWith('data:') || value.startsWith('blob:');

const isRemoteUrl = (value: string) => /^https?:\/\//i.test(value);

const toAvif = (value: string) => value.replace(/\.webp$/i, '.avif');

export function OptimizedImage({
  src,
  alt,
  size = 'medium',
  quality,
  className,
  ...imgProps
}: OptimizedImageProps) {
  const { images } = usePerformanceProfile();
  const resolvedQuality = typeof quality === 'number' ? quality : images.quality;
  const loading = imgProps.loading ?? (size === 'hero' && images.eagerHero ? 'eager' : 'lazy');
  const decoding = imgProps.decoding ?? 'async';
  const fetchPriority =
    (imgProps as ImgHTMLAttributes<HTMLImageElement> & { fetchPriority?: 'auto' | 'high' | 'low' })
      .fetchPriority ?? (size === 'hero' && images.eagerHero ? 'high' : 'auto');

  if (!src) {
    return null;
  }

  const srcValue = src;
  if (isDataUrl(srcValue)) {
    return (
      <img
        src={srcValue}
        alt={alt}
        className={cn(className)}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        {...imgProps}
      />
    );
  }

  const isSupabaseUrl = srcValue.includes('supabase.co/storage');
  const isLocalWebp = !isRemoteUrl(srcValue) && srcValue.toLowerCase().endsWith('.webp');
  const sizes = imgProps.sizes ?? generateSizes(size);

  if (isSupabaseUrl) {
    const sizeSet = sizeVariants[size];
    const bestFormat = getBestImageFormat();
    const optimized = optimizeImageUrl(srcValue, {
      width: size === 'hero' ? 1920 : size === 'large' ? 512 : size === 'medium' ? 256 : 128,
      quality: resolvedQuality,
      format: bestFormat === 'original' ? undefined : bestFormat,
    });
    const avifSrcSet = generateSrcSet(srcValue, sizeSet, 'avif', resolvedQuality);
    const webpSrcSet = generateSrcSet(srcValue, sizeSet, 'webp', resolvedQuality);

    return (
      <picture>
        {avifSrcSet && <source srcSet={avifSrcSet} sizes={sizes} type="image/avif" />}
        {webpSrcSet && <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />}
        <img
          src={optimized || srcValue}
          alt={alt}
          className={cn(className)}
          sizes={sizes}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
          {...imgProps}
        />
      </picture>
    );
  }

  if (isLocalWebp) {
    const avifSrc = toAvif(srcValue);
    return (
      <picture>
        <source srcSet={avifSrc} type="image/avif" />
        <source srcSet={srcValue} type="image/webp" />
        <img
          src={srcValue}
          alt={alt}
          className={cn(className)}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
          {...imgProps}
        />
      </picture>
    );
  }

  return (
    <img
      src={srcValue}
      alt={alt}
      className={cn(className)}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      {...imgProps}
    />
  );
}
