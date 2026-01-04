# Image Generation Setup Guide

This guide will help you set up and test the compendium image generation system.

## Prerequisites

1. **Python 3.8+** installed (you have Python 3.14.0 ✅)
2. **Required packages** installed:
   ```bash
   pip install -r requirements.txt
   ```
   Or manually:
   ```bash
   pip install requests pillow python-dotenv
   ```

## Environment Variables Setup

Create a `.env.local` file in the project root (or add to existing one) with:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stable Diffusion Configuration (choose one method)
# Option 1: API Endpoint (recommended)
STABLE_DIFFUSION_API_URL=http://localhost:7860/api/v1

# Option 2: Local CLI (alternative)
# STABLE_DIFFUSION_CLI_PATH=python
# STABLE_DIFFUSION_MODEL=stable-diffusion-xl-base-1.0
```

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Settings → API
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Service Role Key** (secret, not anon key) → `SUPABASE_SERVICE_ROLE_KEY`

### Stable Diffusion Setup Options

#### Option A: Local Stable Diffusion Web UI (Recommended)

1. Install [Stable Diffusion Web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
2. Start with API enabled:
   ```bash
   python launch.py --api
   ```
3. Set in `.env.local`:
   ```env
   STABLE_DIFFUSION_API_URL=http://localhost:7860
   ```

#### Option B: Remote API Service

Use any Stable Diffusion API service (Replicate, Stability AI, etc.):

```env
STABLE_DIFFUSION_API_URL=https://api.replicate.com/v1/predictions
```

#### Option C: Local CLI (Advanced)

If you have Stable Diffusion installed locally via command line:

```env
STABLE_DIFFUSION_CLI_PATH=python
STABLE_DIFFUSION_MODEL=stable-diffusion-xl-base-1.0
```

## Database Setup

Make sure you've run the migrations to add image columns:

```bash
# If using Supabase CLI
supabase migration up

# Or apply manually via Supabase Dashboard SQL Editor
# Run: supabase/migrations/20250109000000_add_compendium_images.sql
# Run: supabase/migrations/20250109000001_setup_compendium_images_storage.sql
```

## Storage Bucket Setup

The migration should create the bucket automatically. If not, create it manually:

1. Go to Supabase Dashboard → Storage
2. Create bucket: `compendium-images`
3. Make it public
4. Set policies (the migration should handle this)

## Testing the Setup

### 1. Test with a Single Entry

```bash
# Test generating one monster image
python scripts/generate-compendium-images.py monsters 1
```

### 2. Generate Images for a Batch

```bash
# Generate 10 monster images
python scripts/generate-compendium-images.py monsters 10

# Generate 5 equipment images
python scripts/generate-compendium-images.py equipment 5

# Generate 3 relic images
python scripts/generate-compendium-images.py relics 3

# Generate 5 job images
python scripts/generate-compendium-images.py jobs 5
```

## Script Usage

```bash
python scripts/generate-compendium-images.py <entry_type> [batch_size]
```

**Entry Types:**
- `monsters` - Generate monster artwork
- `equipment` - Generate item illustrations
- `relics` - Generate relic artwork
- `jobs` - Generate class concept art

**Examples:**
```bash
# Generate 10 monster images
python scripts/generate-compendium-images.py monsters 10

# Generate all monsters without images (default batch size from config)
python scripts/generate-compendium-images.py monsters
```

## Configuration

Edit `scripts/image-gen-config.json` to customize:
- Image dimensions
- Prompt templates
- Generation parameters
- Batch settings

## Troubleshooting

### "Missing Supabase credentials"
- Check `.env.local` exists and has `SUPABASE_SERVICE_ROLE_KEY`
- Make sure you're using the **service role key**, not the anon key

### "Stable Diffusion API not found"
- Verify `STABLE_DIFFUSION_API_URL` is correct
- Test the API endpoint: `curl http://localhost:7860/api/v1/health` (adjust URL)

### "Failed to upload image"
- Check storage bucket `compendium-images` exists and is public
- Verify service role key has storage permissions

### "No entries found"
- Check database has entries in the requested table
- Verify entries don't already have `image_url` set

## Next Steps

Once setup is complete:
1. Start with a small batch (1-5 images) to test
2. Review generated images in the app
3. Adjust prompts in `image-gen-config.json` if needed
4. Generate images for remaining entries

## Notes

- Images are optimized automatically before upload
- The script retries failed generations (configurable)
- Progress is shown in the console
- Images are stored in: `compendium-images/{type}/{entry_id}-{name}.png`

