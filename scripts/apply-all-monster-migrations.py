#!/usr/bin/env python3
"""
Apply all monster migration files to Supabase
Reads SQL files and applies them via REST API
"""

import os
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials")
    sys.exit(1)

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

print("=" * 70)
print("Applying All Monster Migrations".center(70))
print("=" * 70)
print()

# List of migration files in order
migration_files = [
    "20250115000001_dnd5e_monsters_cr0_to_1.sql",
    "20250115000002_dnd5e_monsters_cr1_to_4.sql",
    "20250115000003_dnd5e_monsters_cr2_to_10_complete.sql",
]

migrations_dir = Path(__file__).parent.parent / "supabase" / "migrations"

total_applied = 0
total_failed = 0

for migration_file in migration_files:
    file_path = migrations_dir / migration_file
    
    if not file_path.exists():
        print(f"[SKIP] {migration_file} - File not found")
        continue
    
    print(f"\nProcessing: {migration_file}")
    
    # Read SQL file
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
    except Exception as e:
        print(f"  [ERROR] Could not read file: {e}")
        total_failed += 1
        continue
    
    # Extract INSERT statements (simplified - in reality, we'd need to execute SQL directly)
    # Since we can't execute SQL via REST API, we'll need to parse and insert records
    
    # For now, inform user to apply manually
    print(f"  [INFO] File ready: {file_path}")
    print(f"  [INFO] Size: {len(sql_content)} bytes")
    print(f"  [INFO] Note: SQL must be applied via Supabase Dashboard")
    
    # Count approximate number of INSERT statements
    insert_count = sql_content.count("INSERT INTO compendium_monsters")
    print(f"  [INFO] Contains approximately {insert_count} INSERT statement(s)")
    
    total_applied += 1

print()
print("=" * 70)
print("Summary".center(70))
print("=" * 70)
print(f"Files processed: {total_applied}")
print(f"Files failed: {total_failed}")
print()
print("These SQL files need to be applied manually in Supabase Dashboard:")
print(f"  1. Go to: https://app.supabase.com/project/{SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')}/sql/new")
print("  2. Copy and run each migration file in order:")
for i, mf in enumerate(migration_files, 1):
    print(f"     {i}. {mf}")
print()
print("Alternatively, run all existing migrations via Supabase CLI:")
print("  supabase db push")
print()

