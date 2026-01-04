#!/usr/bin/env python3
"""
Comprehensive script to apply migrations and generate images
Handles the complete workflow from empty database to generated images
"""

import os
import sys
import json
import re
import ast
import requests
from pathlib import Path
from dotenv import load_dotenv
from typing import List, Dict, Any

# Fix Unicode encoding for Windows
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials")
    sys.exit(1)

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

project_ref = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")

print("=" * 70)
print("COMPLETE IMAGE GENERATION WORKFLOW".center(70))
print("=" * 70)
print()

# Step 1: Check database
print("Step 1: Checking database status...")
try:
    url = f"{SUPABASE_URL}/rest/v1/compendium_monsters?select=id&limit=1"
    response = requests.get(url, headers=headers, timeout=10)
    
    count = 0
    if response.status_code == 200:
        count_response = requests.get(
            f"{SUPABASE_URL}/rest/v1/compendium_monsters?select=id",
            headers={**headers, "Prefer": "count=exact"},
            timeout=10
        )
        if 'content-range' in count_response.headers:
            range_header = count_response.headers['content-range']
            if '/' in range_header:
                count = int(range_header.split('/')[-1])
    
    if count == 0:
        print(f"[INFO] Database is empty ({count} entries)")
        print()
        print("=" * 70)
        print("MIGRATIONS NEEDED".center(70))
        print("=" * 70)
        print()
        print("The database needs to be populated before generating images.")
        print()
        print("Applying migrations via Supabase Dashboard:")
        print(f"  1. Open: https://app.supabase.com/project/{project_ref}/sql/new")
        print("  2. Apply these migration files IN ORDER:")
        print()
        
        migrations_dir = Path(__file__).parent.parent / "supabase" / "migrations"
        migration_files = [
            "20250115000001_dnd5e_monsters_cr0_to_1.sql",
            "20250115000002_dnd5e_monsters_cr1_to_4.sql",
            "20250115000003_dnd5e_monsters_cr2_to_10_complete.sql",
            "20250115000004_dnd5e_monsters_cr5_to_10_solo_leveling.sql",
            "20250115000005_dnd5e_monsters_cr11_to_20_solo_leveling.sql",
            "20250115000006_dnd5e_monsters_cr21_to_30_solo_leveling.sql",
            "20250115000007_dnd5e_named_bosses_solo_leveling.sql",
        ]
        
        for i, mf in enumerate(migration_files, 1):
            file_path = migrations_dir / mf
            if file_path.exists():
                size = file_path.stat().st_size
                print(f"     {i}. {mf} ({size:,} bytes)")
        
        print()
        print("  3. After applying migrations, run this script again:")
        print("     python scripts/apply-migrations-and-generate.py")
        print()
        print("=" * 70)
        print()
        
        # Ask if user wants to proceed anyway (for testing with empty DB)
        print("[OPTION] Test image generation with empty database? (will skip if no entries)")
        sys.exit(0)
    else:
        print(f"[OK] Database has {count} entries")
        
except Exception as e:
    print(f"[ERROR] Could not check database: {e}")
    sys.exit(1)

print()
print("=" * 70)
print("STEP 2: GENERATING IMAGES".center(70))
print("=" * 70)
print()

# Import image generator
sys.path.insert(0, str(Path(__file__).parent))

try:
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "generate_compendium_images",
        Path(__file__).parent / "generate-compendium-images.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    ImageGenerator = module.ImageGenerator
except Exception as e:
    print(f"[ERROR] Could not import image generator: {e}")
    sys.exit(1)

generator = ImageGenerator()

# Get batch size
batch_size = int(sys.argv[1]) if len(sys.argv) > 1 else 10

print(f"Generating images for {batch_size} monsters...")
print()

generator.generate_batch("monsters", batch_size)

print()
print("=" * 70)
print("WORKFLOW COMPLETE".center(70))
print("=" * 70)
print()

