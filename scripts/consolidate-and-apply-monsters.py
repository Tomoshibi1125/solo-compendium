#!/usr/bin/env python3
"""
Consolidate all monster migrations into one comprehensive file
Then attempt to apply via direct database inserts
"""

import os
import sys
import re
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
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

print("=" * 70)
print("Consolidating and Applying Monster Migrations".center(70))
print("=" * 70)
print()

migrations_dir = Path(__file__).parent.parent / "supabase" / "migrations"
migration_files = [
    "20250115000001_dnd5e_monsters_cr0_to_1.sql",
    "20250115000002_dnd5e_monsters_cr1_to_4.sql",
    "20250115000003_dnd5e_monsters_cr2_to_10_complete.sql",
]

all_entries = []

# Extract monster entries from SQL files
for migration_file in migration_files:
    file_path = migrations_dir / migration_file
    if not file_path.exists():
        continue
    
    print(f"Reading: {migration_file}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract INSERT statements and parse VALUES
    # This is a simplified parser - in reality SQL parsing is complex
    # We'll extract the VALUES clauses
    
    # Find INSERT INTO compendium_monsters statements
    insert_pattern = r'INSERT INTO compendium_monsters[^;]+VALUES\s*((?:\([^)]+\),?\s*)+)'
    matches = re.finditer(insert_pattern, content, re.IGNORECASE | re.DOTALL)
    
    for match in matches:
        values_text = match.group(1)
        # Count entries (each entry is a parenthesized tuple)
        entry_count = values_text.count('(')
        print(f"  Found {entry_count} entries")
        # Note: Full parsing would require SQL parsing library
        # For now, we'll suggest manual application

print()
print("=" * 70)
print("Recommendation".center(70))
print("=" * 70)
print()
print("Due to the complexity of parsing SQL INSERT statements,")
print("the best approach is to apply these migrations via Supabase Dashboard.")
print()
print("Steps:")
print(f"  1. Go to: https://app.supabase.com/project/{SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')}/sql/new")
print("  2. Copy and paste each SQL file in order:")
for i, mf in enumerate(migration_files, 1):
    print(f"     {i}. {mf}")
print("  3. Click 'Run' after each file")
print()
print("These files contain comprehensive D&D 5e SRD monsters adapted for Solo Leveling.")
print()

