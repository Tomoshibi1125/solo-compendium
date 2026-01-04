# Scripts Directory

This directory contains utility scripts for the Solo Compendium application.

## Image Generation Scripts

### `generate-compendium-images.py`
Main script for generating images using Stable Diffusion.

**Usage:**
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
# Generate 1 test image
python scripts/generate-compendium-images.py monsters 1

# Generate 10 monster images
python scripts/generate-compendium-images.py monsters 10
```

### `test-image-gen-setup.py`
Validates your image generation setup.

**Usage:**
```bash
python scripts/test-image-gen-setup.py
```

Checks:
- Python version
- Required packages
- Configuration files
- Supabase credentials
- Stable Diffusion API connection
- Database migrations status

### `auto-apply-migrations.py`
Checks if database migrations have been applied.

**Usage:**
```bash
python scripts/auto-apply-migrations.py
```

## Setup Scripts

### `setup-env.ps1`
PowerShell script to help set up `.env.local`.

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-env.ps1
```

### `check-migrations.ps1`
PowerShell script to check migration status.

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/check-migrations.ps1
```

### `finalize-setup.ps1`
Complete setup validation script.

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/finalize-setup.ps1
```

## Configuration

### `image-gen-config.json`
Configuration for image generation:
- Prompt templates
- Generation parameters
- Image dimensions
- Batch settings

### `.env.local`
Environment variables (create from template):
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for image uploads
- `STABLE_DIFFUSION_API_URL` - Stable Diffusion API endpoint

## Database Migrations

### `apply-migrations.sql`
SQL script to manually apply migrations via Supabase Dashboard.

**To apply:**
1. Open Supabase Dashboard → SQL Editor
2. Copy/paste contents of `scripts/apply-migrations.sql`
3. Click "Run"

## Documentation

- **QUICK_START.md** - Quick start guide
- **COMPLETE_SETUP_GUIDE.md** - Detailed setup instructions
- **IMAGE_GEN_SETUP.md** - Technical documentation
- **FINAL_SETUP_SUMMARY.md** - Complete status overview
