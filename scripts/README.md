# Scripts Directory

This directory contains utility scripts for the Solo Compendium application.

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

### `.env.local`

Environment variables (create from template):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon key

## Database Migrations

### `apply-migrations.sql`

SQL script to manually apply migrations via Supabase Dashboard.

**To apply:**

1. Open Supabase Dashboard → SQL Editor
2. Copy/paste contents of `scripts/apply-migrations.sql`
3. Click "Run"

## Documentation

- **SUPABASE_SETUP.md** - Supabase setup instructions
- **APPLY_ALL_MIGRATIONS.md** - Database migration guide
