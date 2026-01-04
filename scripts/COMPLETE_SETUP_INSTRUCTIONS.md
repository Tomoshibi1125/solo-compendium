# 🎯 Complete Setup Instructions - Image Generation

## ✅ Credentials Configured

All API credentials have been applied to `.env.local`:
- ✅ Supabase URL: `https://hibvqliztvfietfcylfm.supabase.co`
- ✅ Supabase Service Role Key: JWT format
- ✅ Hugging Face API Token: Configured
- ✅ Hugging Face Model: `stabilityai/stable-diffusion-xl-base-1.0`

## 🚀 Final Step: Apply Migrations

The SQL migrations need to be applied **once** to set up the database and storage:

### Step 1: Open Supabase SQL Editor

1. Go to: **https://app.supabase.com/project/hibvqliztvfietfcylfm/sql/new**
2. Or navigate: Dashboard → SQL Editor → New Query

### Step 2: Run Complete Setup SQL

1. **Open** the file: `scripts/complete-setup-all.sql`
2. **Select all** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Paste** into SQL Editor (Ctrl+V)
5. **Click "Run"** (or press F5)

**This will:**
- ✅ Create all compendium tables (if they don't exist)
- ✅ Add `image_url` columns to all tables
- ✅ Create `compendium-images` storage bucket
- ✅ Set up storage policies
- ✅ Configure Row Level Security

### Step 3: Verify Setup

```bash
python scripts/test-image-gen-setup.py
```

Should show all checks passing.

### Step 4: Generate Your First Image!

```bash
python scripts/generate-compendium-images.py monsters 1
```

This will:
1. Find a monster without an image
2. Generate a Solo Leveling-themed prompt
3. Create image via Hugging Face API (2048x2048)
4. Upload to Supabase Storage
5. Update database with image URL
6. Image appears in your compendium! 🎉

## 📊 Generate More Images

Once the first image works:

```bash
# Generate 10 monster images
python scripts/generate-compendium-images.py monsters 10

# Generate equipment images
python scripts/generate-compendium-images.py equipment 5

# Generate relic images
python scripts/generate-compendium-images.py relics 5

# Generate job images
python scripts/generate-compendium-images.py jobs 5
```

## ⚡ Performance Notes

- **First image**: 15-30 seconds (model loading)
- **Subsequent**: 5-15 seconds each
- **Batch delays**: 5 seconds between images
- **Quality**: High-quality 2048x2048 optimized images

## 🔍 Troubleshooting

**"Column does not exist"**
- Migrations not applied → Run `scripts/complete-setup-all.sql`

**"Storage bucket not found"**
- Migrations not applied → Run `scripts/complete-setup-all.sql`

**"Hugging Face 503"**
- Model loading → Script auto-retries (wait 10-20 seconds)

**"401 Unauthorized"**
- Check service role key is correct
- Verify it's JWT format (starts with `eyJ`)

## ✅ Current Status

- **Implementation**: 100% ✅
- **Configuration**: 100% ✅
- **Migrations**: Need to apply (see Step 1-2 above)
- **Ready**: After migrations are applied ✅

---

**You're ready!** Just apply the migrations and start generating! 🎨

