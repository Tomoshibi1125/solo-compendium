import { describe, expect, it } from 'vitest';
import { generateSizes, generateSrcSet, optimizeImageUrl } from '@/lib/imageOptimization';

const SUPABASE_URL =
  'https://example.supabase.co/storage/v1/object/public/compendium/asset.png';

describe('imageOptimization', () => {
  it('generates sizes strings', () => {
    expect(generateSizes('hero')).toBe('100vw');
    expect(generateSizes('thumbnail')).toContain('64px');
  });

  it('generates a responsive srcset for Supabase assets', () => {
    const srcset = generateSrcSet(SUPABASE_URL, ['small', 'medium'], 'webp', 75);
    const entries = srcset.split(',').map((entry) => entry.trim());
    expect(entries).toHaveLength(2);
    expect(srcset).toContain('width=128');
    expect(srcset).toContain('width=256');
    expect(srcset).toContain('quality=75');
    expect(srcset).toContain('format=webp');
  });

  it('optimizes Supabase URLs with explicit params', () => {
    const optimized = optimizeImageUrl(SUPABASE_URL, {
      width: 512,
      quality: 90,
      format: 'avif',
    });
    expect(optimized).not.toBeNull();
    const url = new URL(optimized!);
    expect(url.searchParams.get('width')).toBe('512');
    expect(url.searchParams.get('quality')).toBe('90');
    expect(url.searchParams.get('format')).toBe('avif');
  });
});
