/**
 * Image Optimization Utilities
 * 
 * Provides functions for image optimization, WebP support, and responsive image generation.
 */

let cachedBestFormat: 'avif' | 'webp' | 'original' | null = null;

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    return false;
  }
}

/**
 * Check if browser supports AVIF
 */
export function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  } catch {
    return false;
  }
}

/**
 * Get the best image format for the browser
 */
export function getBestImageFormat(): 'avif' | 'webp' | 'original' {
  if (cachedBestFormat) return cachedBestFormat;
  cachedBestFormat = supportsAVIF() ? 'avif' : supportsWebP() ? 'webp' : 'original';
  return cachedBestFormat;
}

/**
 * Generate responsive image sizes
 */
export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'hero';

export const IMAGE_SIZES: Record<ImageSize, number> = {
  thumbnail: 64,
  small: 128,
  medium: 256,
  large: 512,
  xlarge: 1024,
  hero: 1920,
};

/**
 * Generate srcset for responsive images
 * 
 * @param baseUrl - Base image URL
 * @param sizes - Array of sizes to generate
 * @param format - Image format (webp, avif, or original)
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: ImageSize[] = ['small', 'medium', 'large'],
  format?: 'webp' | 'avif' | 'original',
  quality = 80
): string {
  if (!baseUrl) return '';
  
  // If it's a Supabase storage URL, we can use transformations
  const isSupabaseUrl = baseUrl.includes('supabase.co/storage');
  
  if (isSupabaseUrl) {
    // Supabase supports image transformations via query params
    const srcset = sizes.map((size) => {
      const width = IMAGE_SIZES[size];
      const sizeUrl = new URL(baseUrl);
      
      // Add width parameter for Supabase transformations
      sizeUrl.searchParams.set('width', width.toString());
      sizeUrl.searchParams.set('quality', quality.toString()); // Compression
      
      if (format === 'webp') {
        sizeUrl.searchParams.set('format', 'webp');
      } else if (format === 'avif') {
        sizeUrl.searchParams.set('format', 'avif');
      }
      
      return `${sizeUrl.toString()} ${width}w`;
    }).join(', ');
    
    return srcset;
  }
  
  // For external URLs, return original (CDN should handle optimization)
  return '';
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(size: ImageSize): string {
  const sizeMap: Record<ImageSize, string> = {
    thumbnail: '64px',
    small: '(max-width: 640px) 128px, 128px',
    medium: '(max-width: 640px) 256px, (max-width: 1024px) 256px, 256px',
    large: '(max-width: 640px) 512px, (max-width: 1024px) 512px, 512px',
    xlarge: '(max-width: 1024px) 1024px, 1024px',
    hero: '100vw',
  };
  
  return sizeMap[size] || '100vw';
}

/**
 * Optimize image URL with compression and format
 */
export function optimizeImageUrl(
  url: string | null | undefined,
  options?: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'original';
  }
): string | null {
  if (!url) return null;
  
  const { width, quality = 80, format } = options || {};
  const isSupabaseUrl = url.includes('supabase.co/storage');
  
  if (!isSupabaseUrl) {
    // For external URLs, return as-is (let CDN handle it)
    return url;
  }
  
  try {
    const imageUrl = new URL(url);
    
    if (width) {
      imageUrl.searchParams.set('width', width.toString());
    }
    
    imageUrl.searchParams.set('quality', quality.toString());
    
    // Use best format if not specified
    const bestFormat = format || getBestImageFormat();
    if (bestFormat === 'webp') {
      imageUrl.searchParams.set('format', 'webp');
    } else if (bestFormat === 'avif') {
      imageUrl.searchParams.set('format', 'avif');
    }
    
    return imageUrl.toString();
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}

/**
 * Compress image on client side (for uploads)
 * Uses browser's native compression
 */
export async function compressImage(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  }
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    format = 'webp',
  } = options || {};
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with specified format and quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          `image/${format}`,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions from URL
 */
export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

/**
 * Preload image for better performance
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to preload image'));
    img.src = url;
  });
}

