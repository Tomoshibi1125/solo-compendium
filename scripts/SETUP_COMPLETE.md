# Image Generation Setup - Status

## ✅ Completed Setup Steps

1. **Python Dependencies** - Installed successfully
   - `requests` - For API calls
   - `pillow` - For image processing
   - `python-dotenv` - For environment variable loading

2. **Script Updates** - Modified to use REST API
   - Removed dependency on supabase Python package (which required C++ compiler)
   - Now uses direct REST API calls to Supabase
   - Supports both A1111 WebUI and generic Stable Diffusion APIs

3. **Configuration Files**
   - ✅ `scripts/image-gen-config.json` - Image generation settings
   - ✅ `scripts/generate-compendium-images.py` - Main generation script
   - ✅ `scripts/test-image-gen-setup.py` - Validation script

4. **Database & Storage**
   - ✅ Migration files created for image columns
   - ✅ Storage bucket migration created

## 📋 Next Steps (You Need to Do)

### 1. Add Supabase Service Role Key

Add to your `.env.local` file (create if it doesn't exist):

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Where to find it:**
1. Go to Supabase Dashboard → Your Project
2. Settings → API
3. Copy the **Service Role Key** (NOT the anon key - it's the secret one)

### 2. Configure Stable Diffusion (Choose One)

#### Option A: Local Stable Diffusion WebUI (Recommended)

1. Install [AUTOMATIC1111 Stable Diffusion Web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
2. Start it with API enabled:
   ```bash
   python launch.py --api
   ```
3. Add to `.env.local`:
   ```env
   STABLE_DIFFUSION_API_URL=http://localhost:7860
   ```

#### Option B: Remote API Service

If you have access to a remote Stable Diffusion API:

```env
STABLE_DIFFUSION_API_URL=https://your-api-endpoint.com
```

### 3. Run Database Migrations

Make sure the image columns are added to your database:

```bash
# Option 1: Using Supabase CLI
supabase migration up

# Option 2: Manual via Supabase Dashboard
# Go to SQL Editor and run:
# - supabase/migrations/20250109000000_add_compendium_images.sql
# - supabase/migrations/20250109000001_setup_compendium_images_storage.sql
```

### 4. Create Storage Bucket (if not auto-created)

The migration should create it, but if not:

1. Go to Supabase Dashboard → Storage
2. Create bucket: `compendium-images`
3. Make it public

### 5. Test the Setup

Run the validation script:

```bash
python scripts/test-image-gen-setup.py
```

You should see all checks pass (green [OK] marks).

### 6. Generate Your First Image

Once everything is configured:

```bash
# Test with 1 monster image
python scripts/generate-compendium-images.py monsters 1
```

## 📝 Current Status

Based on the validation:
- ✅ Python 3.14.0 installed
- ✅ Required packages installed
- ✅ Config file found
- ✅ Supabase URL configured (from your existing .env)
- ⚠️  **Needs**: SUPABASE_SERVICE_ROLE_KEY in .env.local
- ⚠️  **Needs**: STABLE_DIFFUSION_API_URL configured

## 🔧 Troubleshooting

### "Supabase Service Role Key not found"
- Make sure you've added `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- Use the **service role key**, not the anon/public key

### "Stable Diffusion API not responding"
- Make sure Stable Diffusion WebUI is running with `--api` flag
- Check the URL is correct: `http://localhost:7860`
- Try accessing `http://localhost:7860/sdapi/v1/` in a browser

### "Failed to upload image"
- Verify storage bucket `compendium-images` exists and is public
- Check service role key has storage permissions

## 📚 Documentation

- Full setup guide: `scripts/IMAGE_GEN_SETUP.md`
- Configuration: `scripts/image-gen-config.json`

## 🎉 Once Ready

The script will:
1. Query your database for entries without images
2. Generate prompts based on entry metadata
3. Create images using Stable Diffusion
4. Optimize and upload to Supabase Storage
5. Update database with image URLs

All images will appear automatically in your compendium!

