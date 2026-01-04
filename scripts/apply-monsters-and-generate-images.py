#!/usr/bin/env python3
"""
Apply all monster migrations and then generate images
Comprehensive automation for image generation workflow
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

print("=" * 70)
print("Apply Monster Migrations & Generate Images".center(70))
print("=" * 70)
print()

# Try psycopg2 for direct database connection
try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    HAS_PSYCOPG2 = True
except ImportError:
    print("[WARN] psycopg2 not installed - will use REST API instead")
    print("       Install with: pip install psycopg2-binary")
    HAS_PSYCOPG2 = False

migrations_dir = Path(__file__).parent.parent / "supabase" / "migrations"

# All monster migration files in order
monster_migration_files = [
    "20250115000001_dnd5e_monsters_cr0_to_1.sql",
    "20250115000002_dnd5e_monsters_cr1_to_4.sql",
    "20250115000003_dnd5e_monsters_cr2_to_10_complete.sql",
    "20250115000004_dnd5e_monsters_cr5_to_10_solo_leveling.sql",
    "20250115000005_dnd5e_monsters_cr11_to_20_solo_leveling.sql",
    "20250115000006_dnd5e_monsters_cr21_to_30_solo_leveling.sql",
    "20250115000007_dnd5e_named_bosses_solo_leveling.sql",
]

def apply_migrations_via_sql():
    """Apply migrations using direct SQL execution"""
    if not HAS_PSYCOPG2:
        return False
    
    db_host = f"db.{project_ref}.supabase.co"
    db_port = 5432
    db_name = "postgres"
    db_user = "postgres"
    
    # Try to connect - we'll need the actual database password
    # For now, let's use a different approach via REST API
    print("[INFO] Direct SQL execution requires database password")
    print("[INFO] Will attempt via Supabase Management API or REST API")
    return False

def check_entry_count():
    """Check how many entries exist in database"""
    import requests
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        url = f"{SUPABASE_URL}/rest/v1/compendium_monsters?select=id&limit=1"
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            # Get count via count header
            count_url = f"{SUPABASE_URL}/rest/v1/compendium_monsters?select=id"
            count_response = requests.get(
                count_url, 
                headers={**headers, "Prefer": "count=exact"},
                timeout=10
            )
            if 'content-range' in count_response.headers:
                range_header = count_response.headers['content-range']
                total = int(range_header.split('/')[-1]) if '/' in range_header else 0
                return total
        return 0
    except Exception as e:
        print(f"[ERROR] Could not check entry count: {e}")
        return -1

print("Step 1: Checking database status...")
print()

entry_count = check_entry_count()
if entry_count == -1:
    print("[ERROR] Could not connect to database")
    sys.exit(1)

if entry_count == 0:
    print(f"[INFO] Database is empty ({entry_count} entries)")
    print()
    print("=" * 70)
    print("MIGRATION REQUIRED".center(70))
    print("=" * 70)
    print()
    print("The database needs to be populated with monster entries first.")
    print()
    print("Option 1: Apply migrations via Supabase Dashboard (Recommended):")
    print(f"  1. Go to: https://app.supabase.com/project/{project_ref}/sql/new")
    print("  2. Copy and run each migration file in order:")
    for i, mf in enumerate(monster_migration_files, 1):
        file_path = migrations_dir / mf
        if file_path.exists():
            print(f"     {i}. {mf}")
    print()
    print("Option 2: Use Supabase CLI (if installed):")
    print("  supabase db push")
    print()
    print("After migrations are applied, run this script again to generate images.")
    print()
    sys.exit(0)

print(f"[OK] Database has {entry_count} monster entries")
print()

# Now proceed with image generation
print("Step 2: Starting image generation...")
print()

# Import and use the image generator
sys.path.insert(0, str(Path(__file__).parent))

try:
    from generate_compendium_images import ImageGenerator
except ImportError:
    # Try alternative import
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "generate_compendium_images",
        Path(__file__).parent / "generate-compendium-images.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    ImageGenerator = module.ImageGenerator

generator = ImageGenerator()

# Check how many entries need images
entries_without_images = generator.get_entries_without_images("monsters", limit=1000)

if not entries_without_images:
    print("[INFO] All monsters already have images!")
    sys.exit(0)

print(f"[OK] Found {len(entries_without_images)} monsters without images")
print()

# Ask user how many to generate
if len(sys.argv) > 1:
    batch_size = int(sys.argv[1])
else:
    batch_size = 10

print(f"Generating images for first {min(batch_size, len(entries_without_images))} monsters...")
print()

generator.generate_batch("monsters", batch_size)

print()
print("=" * 70)
print("IMAGE GENERATION COMPLETE".center(70))
print("=" * 70)

