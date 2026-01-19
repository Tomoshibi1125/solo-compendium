import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import {
  generateSrcSet,
  generateSizes,
  getBestImageFormat,
  optimizeImageUrl,
  type ImageSize,
} from '@/lib/imageOptimization';

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null;
  alt: string;
  size?: ImageSize;
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
  className,
  ...imgProps
}: OptimizedImageProps) {
  if (!src) {
    return null;
  }

  const srcValue = src;
  if (isDataUrl(srcValue)) {
    return <img src={srcValue} alt={alt} className={cn(className)} {...imgProps} />;
  }

  const isSupabaseUrl = srcValue.includes('supabase.co/storage');
  const isLocalWebp = !isRemoteUrl(srcValue) && srcValue.toLowerCase().endsWith('.webp');
  const sizes = imgProps.sizes ?? generateSizes(size);

  if (isSupabaseUrl) {
    const sizeSet = sizeVariants[size];
    const bestFormat = getBestImageFormat();
    const optimized = optimizeImageUrl(srcValue, {
      width: size === 'hero' ? 1920 : size === 'large' ? 512 : size === 'medium' ? 256 : 128,
      quality: 80,
      format: bestFormat === 'original' ? undefined : bestFormat,
    });
    const avifSrcSet = generateSrcSet(srcValue, sizeSet, 'avif');
    const webpSrcSet = generateSrcSet(srcValue, sizeSet, 'webp');

    return (
      <picture>
        {avifSrcSet && <source srcSet={avifSrcSet} sizes={sizes} type="image/avif" />}
        {webpSrcSet && <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />}
        <img
          src={optimized || srcValue}
          alt={alt}
          className={cn(className)}
          sizes={sizes}
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
        <img src={srcValue} alt={alt} className={cn(className)} {...imgProps} />
      </picture>
    );
  }

  return <img src={srcValue} alt={alt} className={cn(className)} {...imgProps} />;
}
