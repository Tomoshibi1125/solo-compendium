# Image Optimization Guide

The Solo Compendium app includes comprehensive image optimization for better performance and user experience.

## Features

### ✅ Implemented

- **WebP Support**: Automatic WebP format detection and usage
- **AVIF Support**: AVIF format support for modern browsers (best compression)
- **Responsive Images**: srcset and sizes attributes for different screen sizes
- **Image Compression**: Client-side compression for uploads
- **Lazy Loading**: Native lazy loading for all images
- **Progressive Enhancement**: Fallback to original format if modern formats aren't supported

### 📦 Image Formats

The app supports multiple image formats with automatic fallback:

1. **AVIF** (Best compression, ~50% smaller than WebP)
   - Supported in: Chrome 85+, Firefox 93+, Safari 16+
   - Best quality-to-size ratio

2. **WebP** (Good compression, wide support)
   - Supported in: Chrome, Edge, Firefox, Opera, Safari 14+
   - ~30% smaller than JPEG/PNG

3. **Original** (Fallback)
   - JPEG, PNG, GIF
   - Used when modern formats aren't supported

### 🖼️ Responsive Image Sizes

Images are automatically served in appropriate sizes:

- **Thumbnail**: 64px (icons, small previews)
- **Small**: 128px (list items, cards)
- **Medium**: 256px (detail pages, grids)
- **Large**: 512px (hero images, featured content)
- **XLarge**: 1024px (full-width hero images)
- **Hero**: 1920px (banner images, backgrounds)

### 📐 Image Sizing

The `CompendiumImage` component automatically:
- Detects browser format support
- Generates srcset for responsive images
- Applies appropriate sizes attribute
- Falls back gracefully

## Usage

### CompendiumImage Component

```tsx
import { CompendiumImage } from '@/components/compendium/CompendiumImage';

<CompendiumImage
  src={entry.image_url}
  alt={entry.name}
  size="medium"
  aspectRatio="square"
/>
```

**Props:**
- `src`: Image URL (can be Supabase storage URL)
- `alt`: Alt text (required for accessibility)
- `size`: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero'
- `aspectRatio`: 'square' | 'landscape' | 'portrait' | 'auto'
- `className`: Additional CSS classes

### Image Upload with Compression

```tsx
import { compressImage } from '@/lib/imageOptimization';

const compressedBlob = await compressImage(file, {
  maxWidth: 512,
  maxHeight: 512,
  quality: 0.85,
  format: 'webp',
});
```

**Options:**
- `maxWidth`: Maximum width in pixels
- `maxHeight`: Maximum height in pixels
- `quality`: Compression quality (0-1, default 0.8)
- `format`: 'webp' | 'jpeg' | 'png'

### Optimize Image URL

```tsx
import { optimizeImageUrl } from '@/lib/imageOptimization';

const optimizedUrl = optimizeImageUrl(imageUrl, {
  width: 512,
  quality: 80,
  format: 'webp',
});
```

## Supabase Storage Integration

### Automatic Optimization

Supabase Storage supports image transformations via query parameters:

```
https://your-project.supabase.co/storage/v1/object/public/bucket/image.jpg?width=512&quality=80&format=webp
```

The app automatically:
- Adds width parameters for responsive sizes
- Applies quality compression (80% default)
- Converts to WebP/AVIF when supported
- Falls back to original format

### Manual Optimization

For external URLs or custom optimization:

```tsx
import { optimizeImageUrl, getBestImageFormat } from '@/lib/imageOptimization';

const format = getBestImageFormat(); // 'avif' | 'webp' | 'original'
const optimized = optimizeImageUrl(url, {
  width: 512,
  quality: 80,
  format: format === 'original' ? undefined : format,
});
```

## Performance Benefits

### File Size Reduction

- **WebP**: ~30% smaller than JPEG/PNG
- **AVIF**: ~50% smaller than JPEG/PNG
- **Compression**: Additional 15-20% reduction

### Loading Performance

- **Lazy Loading**: Images load only when visible
- **Responsive Sizes**: Smaller images on mobile devices
- **Progressive Enhancement**: Fast fallback for older browsers

### Bandwidth Savings

- **Mobile**: Smaller images reduce data usage
- **Slow Connections**: Optimized images load faster
- **Caching**: Service worker caches optimized images

## Browser Support

### Format Support

| Format | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| AVIF   | 85+    | 93+     | 16+    | 85+  |
| WebP   | 23+    | 65+     | 14+    | 18+  |
| JPEG   | All    | All     | All    | All  |
| PNG    | All    | All     | All    | All  |

### Feature Support

- **Picture Element**: All modern browsers
- **Srcset**: All modern browsers
- **Lazy Loading**: Chrome 76+, Firefox 75+, Safari 15.4+
- **Async Decoding**: All modern browsers

## Best Practices

### 1. Use Appropriate Sizes

```tsx
// Thumbnail for lists
<CompendiumImage size="thumbnail" />

// Medium for detail pages
<CompendiumImage size="medium" />

// Hero for banners
<CompendiumImage size="hero" />
```

### 2. Compress Uploads

Always compress images before uploading:

```tsx
const compressed = await compressImage(file, {
  maxWidth: 512,
  maxHeight: 512,
  quality: 0.85,
  format: 'webp',
});
```

### 3. Provide Alt Text

Always include descriptive alt text:

```tsx
<CompendiumImage
  src={imageUrl}
  alt="Character portrait of a Striker hunter"
/>
```

### 4. Use Aspect Ratios

Specify aspect ratios for consistent layouts:

```tsx
<CompendiumImage
  src={imageUrl}
  alt={name}
  aspectRatio="square" // Prevents layout shift
/>
```

## Troubleshooting

### Images Not Loading

- Check image URL is valid
- Verify Supabase storage bucket permissions
- Check browser console for errors
- Ensure image format is supported

### Compression Not Working

- Verify browser supports WebP/AVIF
- Check file size limits
- Ensure canvas API is available
- Check browser console for errors

### Slow Image Loading

- Enable lazy loading (automatic)
- Use appropriate image sizes
- Compress images before upload
- Check network connection

## Future Enhancements

- Server-side image optimization
- CDN integration for faster delivery
- Image CDN with automatic optimization
- Blur-up placeholder images
- Intersection Observer for better lazy loading

