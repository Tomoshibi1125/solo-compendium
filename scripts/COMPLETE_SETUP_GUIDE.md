# Complete Image Generation Setup Guide

## ✅ What's Been Done

All code, scripts, and infrastructure are ready! The following has been completed:

### Infrastructure
- ✅ Database migration files created (add image_url columns)
- ✅ Storage bucket migration created (compendium-images bucket)
- ✅ TypeScript types updated
- ✅ UI components created and integrated
- ✅ Image generation script ready

### Python Setup
- ✅ Dependencies installed (requests, pillow, python-dotenv)
- ✅ Script updated to use REST API (no C++ compiler needed)
- ✅ Supports A1111 WebUI and generic APIs
- ✅ Error handling and retry logic
- ✅ Image optimization

### Scripts Created
- ✅ `generate-compendium-images.py` - Main generation script
- ✅ `test-image-gen-setup.py` - Validation script
- ✅ `setup-env.ps1` - Environment setup helper
- ✅ `check-migrations.ps1` - Database migration checker
- ✅ `finalize-setup.ps1` - Complete setup runner
- ✅ `apply-migrations.sql` - SQL to apply manually

## 📋 What You Need to Do

### Step 1: Environment Variables

Your `.env.local` file has been created. You need to add:

1. **Supabase Service Role Key** (if not already there):
   - Go to: Supabase Dashboard → Your Project → Settings → API
   - Copy the **Service Role Key** (the secret one, not anon key)
   - Add to `.env.local`:
     ```env
     SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
     ```

2. **Stable Diffusion API URL** (when you have it set up):
   ```env
   STABLE_DIFFUSION_API_URL=http://localhost:7860
   ```

### Step 2: Apply Database Migrations

Run the migrations to add image columns:

**Option A: Via Supabase Dashboard (Recommended)**
1. Go to Supabase Dashboard → SQL Editor
2. Open `scripts/apply-migrations.sql`
3. Copy all SQL and paste into SQL Editor
4. Click "Run"

**Option B: Via Supabase CLI**
```bash
supabase migration up
```

### Step 3: Verify Setup

Run the validation script:
```bash
python scripts/test-image-gen-setup.py
```

All checks should pass (green [OK] marks).

### Step 4: Set Up Stable Diffusion (Choose One)

#### Option A: Local A1111 WebUI (Recommended)
1. Install from: https://github.com/AUTOMATIC1111/stable-diffusion-webui
2. Start with API:
   ```bash
   python launch.py --api
   ```
3. Add to `.env.local`:
   ```env
   STABLE_DIFFUSION_API_URL=http://localhost:7860
   ```

#### Option B: Remote API
If you have access to a remote Stable Diffusion API, add its URL to `.env.local`.

### Step 5: Generate Your First Images

Once Stable Diffusion is running:

```bash
# Test with 1 image
python scripts/generate-compendium-images.py monsters 1

# Generate 10 monster images
python scripts/generate-compendium-images.py monsters 10

# Generate equipment images
python scripts/generate-compendium-images.py equipment 5

# Generate relic images
python scripts/generate-compendium-images.py relics 5

# Generate job images
python scripts/generate-compendium-images.py jobs 5
```

## 🎯 Quick Commands

```bash
# Validate everything is set up
python scripts/test-image-gen-setup.py

# Run complete setup check
powershell -ExecutionPolicy Bypass -File scripts/finalize-setup.ps1

# Check if migrations are applied
powershell -ExecutionPolicy Bypass -File scripts/check-migrations.ps1

# Generate images
python scripts/generate-compendium-images.py <type> <count>
```

## 📁 File Locations

- **Main Script**: `scripts/generate-compendium-images.py`
- **Config**: `scripts/image-gen-config.json`
- **Migrations**: 
  - `supabase/migrations/20250109000000_add_compendium_images.sql`
  - `supabase/migrations/20250109000001_setup_compendium_images_storage.sql`
- **Manual SQL**: `scripts/apply-migrations.sql`
- **Environment**: `.env.local`

## 🔧 Troubleshooting

### "Supabase Service Role Key not found"
- Make sure `.env.local` exists and has `SUPABASE_SERVICE_ROLE_KEY`
- Use the **service role key**, not the anon/public key
- Re-run: `python scripts/test-image-gen-setup.py`

### "Stable Diffusion API not responding"
- Make sure A1111 WebUI is running: `python launch.py --api`
- Check the URL: `http://localhost:7860`
- Test in browser: `http://localhost:7860/sdapi/v1/`

### "Failed to upload image"
- Verify storage bucket `compendium-images` exists in Supabase Dashboard
- Make sure bucket is public
- Check service role key has proper permissions

### "Column image_url does not exist"
- Run the migrations (see Step 2 above)
- Or manually run `scripts/apply-migrations.sql` in Supabase SQL Editor

## ✨ What Happens When You Generate

1. Script queries database for entries without images
2. Generates Solo Leveling-style prompts from entry metadata
3. Calls Stable Diffusion API to create image
4. Optimizes image for web (resize, format)
5. Uploads to Supabase Storage (`compendium-images` bucket)
6. Updates database with image URL
7. Images automatically appear in your compendium! 🎉

## 📊 Current Status

Run this to check everything:
```bash
python scripts/test-image-gen-setup.py
```

Expected output (when complete):
- [OK] Python version
- [OK] All packages installed
- [OK] Config file found
- [OK] Supabase URL configured
- [OK] Supabase Service Role Key configured
- [OK] Stable Diffusion configured (when ready)
- [OK] Supabase connection successful
- [OK] Setup looks good!

---

**You're almost there!** Just add your Service Role Key and set up Stable Diffusion, then you're ready to generate beautiful Solo Leveling artwork for your compendium! 🎨

