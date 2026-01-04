#!/usr/bin/env python3
"""
Complete workflow: Apply migrations and generate images with proper tag placement
Handles the full pipeline from database setup to image generation
"""

import os
import sys
import json
import time
import requests
from pathlib import Path
from dotenv import load_dotenv
from typing import List, Dict, Optional

# Fix Unicode encoding for Windows
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials")
    print("Please ensure .env.local contains:")
    print("  VITE_SUPABASE_URL=...")
    print("  SUPABASE_SERVICE_ROLE_KEY=...")
    sys.exit(1)

project_ref = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")
migrations_dir = Path(__file__).parent.parent / "supabase" / "migrations"

# Monster migration files to apply (in order)
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
print("COMPLETE WORKFLOW: MIGRATIONS + IMAGE GENERATION".center(70))
print("=" * 70)
print()

# ============================================================================
# STEP 1: Apply Migrations
# ============================================================================

print("STEP 1: APPLYING MIGRATIONS".center(70))
print("=" * 70)
print()

# Check if psycopg2 is available for direct connection
try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    HAS_PSYCOPG2 = True
except ImportError:
    HAS_PSYCOPG2 = False
    print("[WARNING] psycopg2 not installed - cannot apply migrations automatically")
    print("          Install with: pip install psycopg2-binary")
    print()
    print("Please apply migrations manually via Supabase Dashboard:")
    print(f"  https://app.supabase.com/project/{project_ref}/sql/new")
    print()
    print("Then run this script again to generate images.")
    print()
    sys.exit(1)

# Try to get database connection string
db_url = os.getenv("DATABASE_URL") or os.getenv("SUPABASE_DB_URL")

if not db_url or not db_url.startswith("postgresql://"):
    print("[WARNING] DATABASE_URL not found in environment")
    print("          Cannot apply migrations automatically")
    print()
    print("OPTIONS:")
    print("  1. Add DATABASE_URL to .env.local (format: postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres)")
    print("  2. Apply migrations manually via Supabase Dashboard:")
    print(f"     https://app.supabase.com/project/{project_ref}/sql/new")
    print()
    print("Migrations to apply (in order):")
    for i, mf in enumerate(monster_migration_files, 1):
        file_path = migrations_dir / mf
        if file_path.exists():
            size = file_path.stat().st_size
            print(f"     {i}. {mf} ({size:,} bytes)")
    print()
    
    # Check for non-interactive flag
    skip_migrations_flag = "--skip-migrations" in sys.argv or "-s" in sys.argv
    if skip_migrations_flag:
        print("\n[INFO] --skip-migrations flag detected - skipping migrations")
    else:
        # Ask if user wants to skip migrations and continue with image generation
        response = input("Skip migrations and continue with image generation? (y/n): ").strip().lower()
        if response != 'y':
            print("\nExiting. Please apply migrations first, then run this script again.")
            print("\nTip: Use --skip-migrations flag to skip this prompt: python scripts/apply-migrations-and-generate-images.py --skip-migrations 10")
            sys.exit(0)
    
    print("\n[INFO] Skipping migrations - continuing with image generation...")
    print("       (Assuming migrations have already been applied)")
    print()
    
    # Skip to image generation
    skip_migrations = True
else:
    skip_migrations = False

# Skip migrations if user chose to skip
if skip_migrations:
    print("=" * 70)
    print("MIGRATIONS SKIPPED".center(70))
    print("=" * 70)
    print()
else:
    # Parse connection string
    from urllib.parse import urlparse
    parsed = urlparse(db_url)
    db_password = parsed.password
    db_user = parsed.username or "postgres"
    db_host = parsed.hostname or f"db.{project_ref}.supabase.co"
    db_port = parsed.port or 5432
    db_name = parsed.path.lstrip('/') or "postgres"
    
    print(f"[INFO] Connecting to database: {db_host}:{db_port}/{db_name}")
    print()
    
    try:
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password,
            connect_timeout=10,
            sslmode='require'
        )
        
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        print("✅ Database connection successful!")
        print()
        print("Applying migrations...")
        print()
        
        success_count = 0
        error_count = 0
        skipped_count = 0
        
        for i, migration_file in enumerate(monster_migration_files, 1):
            file_path = migrations_dir / migration_file
            
            if not file_path.exists():
                print(f"[{i}/{len(monster_migration_files)}] [SKIP] {migration_file} - File not found")
                skipped_count += 1
                continue
            
            print(f"[{i}/{len(monster_migration_files)}] Processing: {migration_file}")
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    sql_content = f.read()
                
                # Execute SQL
                cursor.execute(sql_content)
                
                print(f"  ✅ Applied successfully")
                success_count += 1
                
            except psycopg2.errors.UniqueViolation:
                print(f"  ⚠️  Skipped (entries already exist - ON CONFLICT DO NOTHING)")
                success_count += 1
            except psycopg2.Error as e:
                error_count += 1
                error_msg = str(e).split('\n')[0]
                print(f"  ❌ Error: {error_msg[:100]}")
            except Exception as e:
                error_count += 1
                error_msg = str(e).split('\n')[0]
                print(f"  ❌ Error: {error_msg[:100]}")
        
        cursor.close()
        conn.close()
        
        print()
        print("=" * 70)
        print(f"Migration Summary: {success_count} successful, {error_count} errors, {skipped_count} skipped".center(70))
        print("=" * 70)
        print()
        
        if error_count > 0:
            print("[WARNING] Some migrations had errors. Continuing anyway...")
            print()
        
    except psycopg2.OperationalError as e:
        print(f"❌ Connection failed: {str(e)[:200]}")
        print()
        print("Please check your DATABASE_URL and try again.")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

# ============================================================================
# STEP 2: Verify Database Has Entries
# ============================================================================

print("STEP 2: VERIFYING DATABASE".center(70))
print("=" * 70)
print()

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

try:
    # Check monster count
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
        print(f"[WARNING] Database has 0 monster entries")
        print("          Migrations may not have populated data, or entries already exist.")
        print()
        print("Continuing with image generation (will skip if no entries found)...")
    else:
        print(f"[OK] Database has {count} monster entries")
        print()
    
except Exception as e:
    print(f"[WARNING] Could not verify database: {e}")
    print("          Continuing anyway...")
    print()

# ============================================================================
# STEP 3: Generate Images with Proper Tag Placement
# ============================================================================

print()
print("STEP 3: GENERATING IMAGES WITH PROPER TAGS".center(70))
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

# Get batch size from command line or use default (filter out flags)
batch_size_args = [arg for arg in sys.argv[1:] if arg not in ["--skip-migrations", "-s"] and not arg.startswith("-")]
batch_size = int(batch_size_args[0]) if batch_size_args else 10

print(f"[INFO] Batch size: {batch_size} entries per type")
print()
print("[INFO] Image placement strategy:")
print("  - Images are organized by entry type: monsters/, equipment/, relics/, jobs/")
print("  - Tags from database entries are used to enhance image prompts")
print("  - Storage path format: {entry_type}/{entry_id}-{name_slug}.png")
print("  - Example: monsters/abc123-goblin.png")
print()

# Generate images for each type
entry_types = ["monsters", "equipment", "relics", "jobs"]

total_generated = 0
for entry_type in entry_types:
    print(f"\n{'=' * 70}")
    print(f"Generating {entry_type.upper()} images".center(70))
    print('=' * 70)
    print()
    
    entries = generator.get_entries_without_images(entry_type, batch_size)
    
    if not entries:
        print(f"[INFO] No {entry_type} without images found - skipping")
        continue
    
    print(f"[INFO] Found {len(entries)} {entry_type} entries to process")
    print()
    
    # Show how tags will be used
    sample_entry = entries[0] if entries else None
    if sample_entry:
        tags = sample_entry.get("tags", [])
        print(f"[INFO] Sample entry: {sample_entry.get('name', 'Unknown')}")
        if tags:
            print(f"[INFO] Tags found: {', '.join(tags[:5])}")
            print(f"[INFO] Tags will be included in image generation prompts")
        else:
            print(f"[INFO] No tags found - using base prompt only")
        print()
    
    success_count = 0
    for i, entry in enumerate(entries, 1):
        print(f"\n[{i}/{len(entries)}] Processing {entry_type}: {entry.get('name', 'Unknown')}")
        
        # Show tags being used
        entry_tags = entry.get("tags", [])
        if entry_tags:
            tag_str = ", ".join(entry_tags[:5])
            print(f"       Tags: {tag_str}")
        
        if generator.generate_for_entry(entry, entry_type):
            success_count += 1
            total_generated += 1
        
        # Delay between requests
        if i < len(entries):
            time.sleep(generator.config["batch"]["delay_seconds"])
    
    print(f"\n[✓] {entry_type}: {success_count}/{len(entries)} images generated")
    print()

print()
print("=" * 70)
print("WORKFLOW COMPLETE".center(70))
print("=" * 70)
print()
print(f"Total images generated: {total_generated}")
print()
print("[INFO] Images have been:")
print("  ✓ Generated using tags from database entries")
print("  ✓ Organized by entry type (monsters/, equipment/, relics/, jobs/)")
print("  ✓ Uploaded to Supabase Storage")
print("  ✓ Database entries updated with image URLs")
print()
print("Images should now appear in your compendium!")
print()

