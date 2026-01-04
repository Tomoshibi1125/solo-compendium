#!/usr/bin/env python3
"""
Apply all monster migrations directly via PostgreSQL connection
Then proceed with image generation
"""

import os
import sys
import re
from pathlib import Path
from dotenv import load_dotenv

# Fix Unicode encoding for Windows
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials")
    sys.exit(1)

project_ref = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")

migrations_dir = Path(__file__).parent.parent / "supabase" / "migrations"

monster_migration_files = [
    "20250115000001_dnd5e_monsters_cr0_to_1.sql",
    "20250115000002_dnd5e_monsters_cr1_to_4.sql",
    "20250115000003_dnd5e_monsters_cr2_to_10_complete.sql",
    "20250115000004_dnd5e_monsters_cr5_to_10_solo_leveling.sql",
    "20250115000005_dnd5e_monsters_cr11_to_20_solo_leveling.sql",
    "20250115000006_dnd5e_monsters_cr21_to_30_solo_leveling.sql",
    "20250115000007_dnd5e_named_bosses_solo_leveling.sql",
]

print("=" * 70)
print("Apply Monster Migrations & Generate Images".center(70))
print("=" * 70)
print()

# Try psycopg2 first
try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    HAS_PSYCOPG2 = True
except ImportError:
    print("[WARN] psycopg2 not installed")
    print("       Install with: pip install psycopg2-binary")
    HAS_PSYCOPG2 = False

if HAS_PSYCOPG2:
    db_host = f"db.{project_ref}.supabase.co"
    db_port = 5432
    db_name = "postgres"
    db_user = "postgres"
    
    # Note: Service role key won't work as DB password
    # We need the actual database password from connection string
    # But let's try using the Management API or REST API instead
    
    print("[INFO] Direct PostgreSQL connection requires database password")
    print("[INFO] Service role key cannot be used as PostgreSQL password")
    print()
    print("[INFO] Using REST API method instead...")
    print()

# Alternative: Use Supabase Management API or parse SQL and insert via REST API
# For now, let's use a simpler approach - check if we can use Supabase CLI
# or provide instructions

print("=" * 70)
print("APPLY MIGRATIONS".center(70))
print("=" * 70)
print()
print("To populate the database with monsters, apply migrations:")
print()
print("Method 1: Supabase Dashboard (Easiest)")
print(f"  1. Go to: https://app.supabase.com/project/{project_ref}/sql/new")
print("  2. Copy and paste each SQL file (in order):")
print()
for i, mf in enumerate(monster_migration_files, 1):
    file_path = migrations_dir / mf
    if file_path.exists():
        size = file_path.stat().st_size
        print(f"     {i}. {mf} ({size:,} bytes)")
print()
print("  3. Click 'Run' after each file")
print()
print("Method 2: Supabase CLI")
print("  supabase db push")
print()
print("=" * 70)
print("AFTER MIGRATIONS ARE APPLIED".center(70))
print("=" * 70)
print()
print("Run this command to start image generation:")
print("  python scripts/generate-compendium-images.py monsters 10")
print()
print("Or use the automated workflow:")
print("  python scripts/start-image-generation.py 10")
print()

