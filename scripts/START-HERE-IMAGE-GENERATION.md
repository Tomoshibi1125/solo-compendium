# 🎨 START HERE: Image Generation & Placement

## ✅ System Status: READY

All systems are configured and verified:
- ✅ Supabase: Connected (`hqouinpnnmjjtvgjrnff`)
- ✅ Hugging Face API: Configured (`stabilityai/stable-diffusion-xl-base-1.0`)
- ✅ Service Role Key: Valid JWT format
- ✅ Scripts: All ready
- ⚠️ **Database: Empty (0 entries) - Migrations needed first**

---

## 🚀 QUICK START (2 Steps)

### STEP 1: Apply Migrations (One-Time Setup)

**Method: Supabase Dashboard**

1. **Open SQL Editor:**
   ```
   https://app.supabase.com/project/hqouinpnnmjjtvgjrnff/sql/new
   ```

2. **Apply These Files IN ORDER:**
   - Open each file from `supabase/migrations/`
   - Copy ALL contents (Ctrl+A, Ctrl+C)
   - Paste into SQL Editor (Ctrl+V)
   - Click **"Run"** button
   - Wait for success message
   - Repeat for next file

   **Files to apply:**
   ```
   1. 20250115000001_dnd5e_monsters_cr0_to_1.sql (~30 KB)
   2. 20250115000002_dnd5e_monsters_cr1_to_4.sql (~32 KB)
   3. 20250115000003_dnd5e_monsters_cr2_to_10_complete.sql (~40 KB)
   4. 20250115000004_dnd5e_monsters_cr5_to_10_solo_leveling.sql (~40 KB)
   5. 20250115000005_dnd5e_monsters_cr11_to_20_solo_leveling.sql (~22 KB)
   6. 20250115000006_dnd5e_monsters_cr21_to_30_solo_leveling.sql (~10 KB)
   7. 20250115000007_dnd5e_named_bosses_solo_leveling.sql (~16 KB)
   ```

   **Total time:** ~5-10 minutes (depends on database performance)

3. **Verify:**
   ```bash
   python scripts/check-database-entries.py
   ```
   Should show entries in tables.

---

### STEP 2: Generate Images (After Migrations)

Once migrations are applied and entries exist:

```bash
# Test with 1 image first (recommended)
python scripts/generate-compendium-images.py monsters 1

# Generate 10 monster images
python scripts/generate-compendium-images.py monsters 10

# Generate 50 monster images (larger batch)
python scripts/generate-compendium-images.py monsters 50

# Generate other types
python scripts/generate-compendium-images.py equipment 10
python scripts/generate-compendium-images.py relics 10
python scripts/generate-compendium-images.py jobs 10
```

---

## 📊 What Happens During Image Generation

1. ✅ Script queries database for entries without images
2. ✅ Generates Solo Leveling-themed prompts automatically:
   ```
   "Solo Leveling manwha style, painterly artwork of [name], 
   [description], gate rank [rank], dark fantasy creature design..."
   ```
3. ✅ Calls Hugging Face Inference API (Stable Diffusion XL)
4. ✅ Receives 2048x2048 high-quality image
5. ✅ Optimizes image for web (PNG format, ~95% quality)
6. ✅ Uploads to Supabase Storage (`compendium-images` bucket)
7. ✅ Updates database record with image URL
8. ✅ Image automatically appears in compendium! 🎉

---

## 🎯 Generation Priority (Recommended Order)

1. **Monsters** (highest visual impact)
2. **Equipment** (weapons, armor)
3. **Relics** (magic items, artifacts)
4. **Jobs** (class concept art)

---

## ⚡ Performance

- **First image**: 15-30 seconds (model loading on Hugging Face)
- **Subsequent images**: 5-15 seconds each
- **Batch of 10**: ~2-3 minutes total
- **Automatic delays**: 2-5 seconds between images (prevents rate limiting)

---

## 🔧 Troubleshooting

### "No entries found"
- **Fix:** Apply migrations first (Step 1 above)

### "Hugging Face API error 410/503"
- **Fix:** Model may be loading, script will retry automatically
- **Fix:** Check API token is valid

### "Upload failed"
- **Fix:** Verify Storage bucket `compendium-images` exists
- **Fix:** Check service role key has write permissions

### "Connection timeout"
- **Fix:** Check internet connection
- **Fix:** Hugging Face API may be busy, wait and retry

---

## 📁 Files Ready for You

- `scripts/generate-compendium-images.py` - Main generation script
- `scripts/image-gen-config.json` - Configuration (prompts, dimensions)
- `scripts/check-database-entries.py` - Check how many entries need images
- `supabase/migrations/*.sql` - Migration files to apply

---

## ✅ After Images Are Generated

1. Images are automatically stored in Supabase Storage
2. Database entries are updated with image URLs
3. Images appear in compendium UI automatically
4. No manual steps needed!

---

**🚀 Ready to start? Apply migrations first, then run the generation commands!**

