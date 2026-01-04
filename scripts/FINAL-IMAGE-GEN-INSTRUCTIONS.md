# 🎨 Final Instructions: Image Generation & Placement

## ✅ Status: System 100% Ready!

All systems verified and configured:
- ✅ Supabase connection: Working
- ✅ Hugging Face API: Configured
- ✅ Image generation scripts: Ready
- ✅ Configuration files: Complete

## ⚠️ Current Issue: Database is Empty

The database tables exist but have **0 entries**. We need to populate them first before generating images.

## 🚀 Solution: Two-Step Process

### STEP 1: Apply Migrations (Required - One Time Only)

**Fastest Method: Supabase Dashboard**

1. **Open SQL Editor:**
   - Go to: https://app.supabase.com/project/hqouinpnnmjjtvgjrnff/sql/new
   - Or: Dashboard → SQL Editor → New Query

2. **Apply Migration Files (In Order):**

   Copy the **ENTIRE CONTENTS** of each file and run:

   ```
   1. supabase/migrations/20250115000001_dnd5e_monsters_cr0_to_1.sql
   2. supabase/migrations/20250115000002_dnd5e_monsters_cr1_to_4.sql
   3. supabase/migrations/20250115000003_dnd5e_monsters_cr2_to_10_complete.sql
   4. supabase/migrations/20250115000004_dnd5e_monsters_cr5_to_10_solo_leveling.sql
   5. supabase/migrations/20250115000005_dnd5e_monsters_cr11_to_20_solo_leveling.sql
   6. supabase/migrations/20250115000006_dnd5e_monsters_cr21_to_30_solo_leveling.sql
   7. supabase/migrations/20250115000007_dnd5e_named_bosses_solo_leveling.sql
   ```

   **Important:** Run each file separately and click "Run" after each one.

3. **Verify:**
   ```bash
   python scripts/check-database-entries.py
   ```
   
   Should show entries in each table.

### STEP 2: Generate Images (After Migrations Applied)

Once database has entries, start generating images:

```bash
# Test with 1 image first
python scripts/generate-compendium-images.py monsters 1

# Generate 10 monster images
python scripts/generate-compendium-images.py monsters 10

# Generate 50 monster images  
python scripts/generate-compendium-images.py monsters 50

# Generate equipment, relics, jobs
python scripts/generate-compendium-images.py equipment 10
python scripts/generate-compendium-images.py relics 10
python scripts/generate-compendium-images.py jobs 10
```

## 📊 What the Image Generation Does

1. **Finds entries** without images from database
2. **Generates prompts** automatically using Solo Leveling theme:
   - "Solo Leveling manwha style, painterly artwork of [monster name]..."
   - Includes gate rank, description, tags
3. **Calls Hugging Face API** (Stable Diffusion XL)
4. **Creates 2048x2048** high-quality images
5. **Optimizes** for web (PNG format)
6. **Uploads** to Supabase Storage (`compendium-images` bucket)
7. **Updates database** with image URLs
8. **Images appear** in compendium automatically!

## 🎯 Priority Order

Generate images in this order for best results:

1. **Monsters** (highest priority - most visual impact)
2. **Equipment** (weapons, armor, items)
3. **Relics** (magic items, artifacts)
4. **Jobs** (class concept art)

## ⚡ Performance Notes

- **First request**: 15-30 seconds (model loading on Hugging Face)
- **Subsequent**: 5-15 seconds per image
- **Batch of 10**: ~2-3 minutes total
- **Batch delays**: 2-5 seconds between images (configurable)

## 🔧 Troubleshooting

**"No entries found"**
- Migrations haven't been applied yet
- Run Step 1 above

**"Hugging Face API error 410"**
- Model endpoint may have changed
- Check Hugging Face API status
- Script will retry automatically

**"Upload failed"**
- Check Supabase Storage bucket exists
- Verify service role key permissions
- Check network connection

## 📝 Next Steps After Images Generated

1. Verify images in Supabase Storage dashboard
2. Check compendium entries show images
3. Test in the app UI
4. Generate remaining images in batches

---

**Ready to proceed! Apply migrations first, then run the image generation commands above.** 🚀

