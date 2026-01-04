# 🚀 Complete Setup Guide - Apply All Migrations

## Current Status

✅ **Authentication**: Working  
✅ **Credentials**: Configured  
⚠️ **Tables**: Need to be created (not found in this project)

## Solution: Complete Setup SQL

I've created **`scripts/complete-setup-all.sql`** which does everything in one go:

1. ✅ Creates all compendium tables (if they don't exist)
2. ✅ Adds image_url columns
3. ✅ Creates storage bucket
4. ✅ Sets up storage policies
5. ✅ Configures Row Level Security

## 🎯 Quick Setup (Recommended)

### Step 1: Apply Complete Setup

1. **Open Supabase Dashboard**:
   - https://app.supabase.com/project/hibvqliztvfietfcylfm/sql

2. **Run Complete Setup**:
   - Open: `scripts/complete-setup-all.sql`
   - Copy ALL SQL (Ctrl+A, Ctrl+C)
   - Paste into SQL Editor (Ctrl+V)
   - Click **"Run"** (or F5)

**This creates everything you need in one step!**

### Step 2: Verify Setup

```bash
python scripts/test-image-gen-setup.py
python scripts/auto-apply-migrations.py
```

Both should show all [OK] marks.

### Step 3: Generate Images!

```bash
python scripts/generate-compendium-images.py monsters 1
```

## 📋 Alternative: If Tables Already Exist

If you have compendium data in a different Supabase project:

1. **Update `.env.local`** with the correct project URL
2. **Run only image migrations**: `scripts/apply-migrations.sql`

## ✅ What the Complete Setup Creates

- ✅ `compendium_monsters` table + image columns
- ✅ `compendium_equipment` table + image columns
- ✅ `compendium_relics` table + image columns
- ✅ `compendium_jobs` table + image columns
- ✅ `compendium_job_paths` table + image columns
- ✅ `compendium_powers` table + image columns
- ✅ `compendium-images` storage bucket
- ✅ Storage policies (public read, authenticated upload)
- ✅ Row Level Security policies

---

**Run `scripts/complete-setup-all.sql` once, then you're ready to generate images!** 🎨

