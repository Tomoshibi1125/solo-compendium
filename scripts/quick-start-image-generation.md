# Quick Start: Image Generation

## ✅ System Ready!

All configuration is complete and verified:
- ✅ Supabase: Connected
- ✅ Hugging Face API: Configured  
- ✅ Image generation scripts: Ready

## 🚀 Two-Step Process

### Step 1: Apply Migrations (One-time setup)

**Option A: Via Supabase Dashboard (Easiest)**
1. Go to: https://app.supabase.com/project/hqouinpnnmjjtvgjrnff/sql/new
2. Copy and paste each migration file (in order):
   - `supabase/migrations/20250115000001_dnd5e_monsters_cr0_to_1.sql`
   - `supabase/migrations/20250115000002_dnd5e_monsters_cr1_to_4.sql`
   - `supabase/migrations/20250115000003_dnd5e_monsters_cr2_to_10_complete.sql`
   - `supabase/migrations/20250115000004_dnd5e_monsters_cr5_to_10_solo_leveling.sql`
   - `supabase/migrations/20250115000005_dnd5e_monsters_cr11_to_20_solo_leveling.sql`
   - `supabase/migrations/20250115000006_dnd5e_monsters_cr21_to_30_solo_leveling.sql`
   - `supabase/migrations/20250115000007_dnd5e_named_bosses_solo_leveling.sql`
3. Click "Run" after each file

**Option B: Via Supabase CLI**
```bash
supabase db push
```

### Step 2: Generate Images

Once migrations are applied:

```bash
# Generate 10 monster images (recommended first batch)
python scripts/generate-compendium-images.py monsters 10

# Generate more
python scripts/generate-compendium-images.py monsters 50

# Generate other types
python scripts/generate-compendium-images.py equipment 10
python scripts/generate-compendium-images.py relics 10
python scripts/generate-compendium-images.py jobs 10
```

## 📊 What Happens

1. Script finds entries without images
2. Generates Solo Leveling-themed prompts automatically
3. Calls Hugging Face API (2048x2048 images)
4. Optimizes images for web
5. Uploads to Supabase Storage
6. Updates database with image URLs
7. Images appear in compendium automatically! 🎉

## ⚡ Performance

- **First image**: 15-30 seconds (model loading)
- **Subsequent**: 5-15 seconds each
- **Batch of 10**: ~2-3 minutes

## 🎨 Image Quality

All images are generated in Solo Leveling manwha style:
- Painterly artwork
- Dark fantasy aesthetic
- Detailed, high quality
- Fits Solo Leveling universe theme

