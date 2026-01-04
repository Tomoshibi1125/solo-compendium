/**
 * Utility functions for handling compendium images
 */

/**
 * Get the image URL from a compendium entry
 */
export function getImageUrl(entry: { image_url?: string | null }): string | null {
  return entry.image_url || null;
}

/**
 * Generate a slug from a name for use in image filenames
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get the expected image path in Supabase Storage
 */
export function getImagePath(type: string, entryId: string, name: string): string {
  const slug = slugify(name);
  return `${type}/${entryId}-${slug}.png`;
}

/**
 * Get the public URL for an image in Supabase Storage
 */
export function getPublicImageUrl(bucket: string, path: string, supabaseUrl?: string): string {
  if (!supabaseUrl) {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  }
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Check if an image URL is valid
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

