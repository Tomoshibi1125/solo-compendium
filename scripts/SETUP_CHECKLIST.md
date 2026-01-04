# ✅ Image Generation Setup Checklist

Use this checklist to verify your setup is complete.

## Prerequisites

- [ ] Python 3.8+ installed
- [ ] Required packages installed: `pip install -r requirements.txt`
- [ ] Supabase project created
- [ ] Stable Diffusion installed (optional, for image generation)

## Configuration

- [ ] `.env.local` file created
- [ ] `VITE_SUPABASE_URL` set with actual Supabase URL (not placeholder)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set with actual service role key (not placeholder)
- [ ] `STABLE_DIFFUSION_API_URL` set (when Stable Diffusion is running)

**Get credentials from:** Supabase Dashboard → Settings → API

## Database Setup

- [ ] Migration `20250109000000_add_compendium_images.sql` applied
- [ ] Migration `20250109000001_setup_compendium_images_storage.sql` applied
- [ ] Storage bucket `compendium-images` created
- [ ] Storage policies configured

**To apply:** Run `scripts/apply-migrations.sql` in Supabase SQL Editor

## Verification

- [ ] Run `python scripts/test-image-gen-setup.py` - all checks pass
- [ ] Run `python scripts/auto-apply-migrations.py` - migrations confirmed
- [ ] Can query `compendium_monsters` table with `image_url` column

## Testing

- [ ] Stable Diffusion API accessible (if configured)
- [ ] Can generate test image: `python scripts/generate-compendium-images.py monsters 1`
- [ ] Image appears in Supabase Storage bucket
- [ ] Image URL updated in database
- [ ] Image displays in compendium UI

## Completion Status

When all items are checked:
✅ **Setup is 100% complete!**

You can now generate images for your compendium entries.

