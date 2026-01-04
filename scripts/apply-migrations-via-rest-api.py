#!/usr/bin/env python3
"""
Apply monster migrations via Supabase REST API
Parses SQL INSERT statements and executes them via REST API
"""

import os
import sys
import re
import json
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
    "Prefer": "return=minimal,resolution=merge-duplicates"
}

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

def parse_sql_insert(sql_content: str) -> List[Dict[str, Any]]:
    """Parse SQL INSERT statement and return list of dictionaries"""
    rows = []
    
    # Pattern to match INSERT INTO ... VALUES (...)
    pattern = r'INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*(.+)'
    match = re.search(pattern, sql_content, re.IGNORECASE | re.DOTALL)
    
    if not match:
        return rows
    
    table_name = match.group(1)
    columns_str = match.group(2)
    values_str = match.group(3)
    
    # Parse column names
    columns = [col.strip().strip('"') for col in columns_str.split(',')]
    
    # Parse VALUES - handle multiline and nested structures
    # Remove trailing semicolon
    values_str = values_str.rstrip(';').strip()
    
    # Split by ),( to get individual rows, but handle nested structures carefully
    # Use regex to find complete value groups
    value_rows = []
    depth = 0
    current_row = []
    current_value = ""
    in_string = False
    string_char = None
    i = 0
    
    while i < len(values_str):
        char = values_str[i]
        
        if char in ("'", '"') and (i == 0 or values_str[i-1] != '\\'):
            if not in_string:
                in_string = True
                string_char = char
            elif char == string_char:
                in_string = False
                string_char = None
            current_value += char
        elif not in_string:
            if char == '(':
                depth += 1
                if depth == 1:
                    # Start of new row
                    current_row = []
                    current_value = ""
                else:
                    current_value += char
            elif char == ')':
                depth -= 1
                if depth == 0:
                    # End of row
                    if current_value.strip():
                        current_row.append(current_value.strip())
                    value_rows.append(current_row)
                    current_row = []
                    current_value = ""
                else:
                    current_value += char
            elif char == ',' and depth == 1:
                # End of value within row
                current_row.append(current_value.strip())
                current_value = ""
            else:
                current_value += char
        else:
            current_value += char
        
        i += 1
    
    # Parse each row's values
    for row_values in value_rows:
        if len(row_values) != len(columns):
            continue
        
        row_dict = {}
        for i, col in enumerate(columns):
            value_str = row_values[i].strip()
            
            # Parse value based on type
            if value_str.upper() == 'NULL':
                row_dict[col] = None
            elif value_str.upper() == 'TRUE' or value_str.upper() == 'FALSE':
                row_dict[col] = value_str.upper() == 'TRUE'
            elif value_str.startswith("'") and value_str.endswith("'"):
                # String
                row_dict[col] = value_str[1:-1].replace("''", "'").replace("\\'", "'")
            elif value_str.startswith('"') and value_str.endswith('"'):
                # Quoted identifier (unlikely in VALUES, but handle it)
                row_dict[col] = value_str[1:-1]
            elif value_str.startswith('{') and value_str.endswith('}'):
                # Array/JSON - try to parse as JSON array
                try:
                    row_dict[col] = json.loads(value_str.replace("'", '"'))
                except:
                    # Fallback: parse as PostgreSQL array
                    inner = value_str[1:-1]
                    if not inner.strip():
                        row_dict[col] = []
                    else:
                        # Simple array parsing
                        parts = [p.strip().strip("'\"") for p in inner.split(',')]
                        row_dict[col] = parts
            elif value_str.startswith('{') and '}' in value_str:
                # JSON object
                try:
                    row_dict[col] = json.loads(value_str.replace("'", '"'))
                except:
                    row_dict[col] = value_str
            elif value_str.isdigit() or (value_str.startswith('-') and value_str[1:].isdigit()):
                # Integer
                row_dict[col] = int(value_str)
            elif '.' in value_str and value_str.replace('.', '').replace('-', '').isdigit():
                # Float
                row_dict[col] = float(value_str)
            else:
                # Default to string
                row_dict[col] = value_str
        
        rows.append(row_dict)
    
    return rows

def apply_migration_file(file_path: Path) -> tuple[int, int]:
    """Apply a single migration file via REST API"""
    if not file_path.exists():
        print(f"  [SKIP] File not found: {file_path.name}")
        return 0, 0
    
    print(f"  Reading: {file_path.name}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Parse INSERT statements
        rows = parse_sql_insert(sql_content)
        
        if not rows:
            print(f"  [WARN] No rows found to insert")
            return 0, 0
        
        print(f"  Parsed {len(rows)} rows...")
        
        # Insert via REST API in batches
        batch_size = 50
        success_count = 0
        error_count = 0
        
        url = f"{SUPABASE_URL}/rest/v1/compendium_monsters"
        
        for i in range(0, len(rows), batch_size):
            batch = rows[i:i+batch_size]
            
            try:
                response = requests.post(
                    url,
                    headers=headers,
                    json=batch,
                    timeout=30
                )
                
                if response.status_code in (201, 200, 204):
                    success_count += len(batch)
                elif response.status_code == 409:
                    # Conflict (duplicate) - might be intentional with ON CONFLICT DO NOTHING
                    # Try individual inserts to see which succeed
                    for row in batch:
                        try:
                            r = requests.post(url, headers=headers, json=row, timeout=10)
                            if r.status_code in (201, 200, 204):
                                success_count += 1
                            elif r.status_code == 409:
                                success_count += 1  # Assume ON CONFLICT DO NOTHING
                            else:
                                error_count += 1
                        except:
                            error_count += 1
                else:
                    error_count += len(batch)
                    print(f"    [ERROR] Status {response.status_code}: {response.text[:200]}")
            
            except Exception as e:
                error_count += len(batch)
                print(f"    [ERROR] Exception: {str(e)[:100]}")
        
        return success_count, error_count
        
    except Exception as e:
        print(f"  [ERROR] Failed to process file: {str(e)[:200]}")
        return 0, 1

print("=" * 70)
print("Apply Monster Migrations via REST API".center(70))
print("=" * 70)
print()
print(f"Project: {project_ref}")
print(f"Supabase URL: {SUPABASE_URL}")
print()

total_success = 0
total_errors = 0

for i, migration_file in enumerate(monster_migration_files, 1):
    file_path = migrations_dir / migration_file
    print(f"[{i}/{len(monster_migration_files)}] {migration_file}")
    
    success, errors = apply_migration_file(file_path)
    total_success += success
    total_errors += errors
    
    if success > 0:
        print(f"  ✅ Inserted {success} rows")
    if errors > 0:
        print(f"  ❌ {errors} errors")
    print()

print("=" * 70)
print(f"Summary: {total_success} inserted, {total_errors} errors".center(70))
print("=" * 70)
print()

if total_success > 0:
    print("✅ Migrations applied successfully!")
    print()
    print("Next step: Generate images")
    print("  python scripts/generate-compendium-images.py monsters 10")
    print()
else:
    print("⚠️  No rows inserted. Check errors above.")
    print()
    print("Alternative: Apply migrations via Supabase Dashboard")
    print(f"  https://app.supabase.com/project/{project_ref}/sql/new")
    print()

