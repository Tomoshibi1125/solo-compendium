# Quick Start - Image Generation

## 🚀 3 Steps to Generate Images

### 1. Add Service Role Key to `.env.local`

```env
SUPABASE_SERVICE_ROLE_KEY=your_key_from_supabase_dashboard
```

Get it from: Supabase Dashboard → Settings → API → Service Role Key

### 2. Apply Database Migrations

**Easy way**: Copy/paste `scripts/apply-migrations.sql` into Supabase Dashboard → SQL Editor → Run

### 3. Generate Images

Once Stable Diffusion is running:

```bash
python scripts/generate-compendium-images.py monsters 1
```

## ✅ Verify Setup

```bash
python scripts/test-image-gen-setup.py
```

## 📚 Full Guide

See `scripts/COMPLETE_SETUP_GUIDE.md` for detailed instructions.

