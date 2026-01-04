#!/usr/bin/env python3
"""
Apply all monster migrations via Supabase API
Attempts to apply SQL migrations using various methods
"""

import os
import sys
import requests
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
print("Apply All Monster Migrations".center(70))
print("=" * 70)
print()
print(f"Project: {project_ref}")
print()

# Check if psycopg2 is available for direct connection
try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    HAS_PSYCOPG2 = True
    print("[OK] psycopg2 available - can attempt direct connection")
except ImportError:
    HAS_PSYCOPG2 = False
    print("[INFO] psycopg2 not installed")
    print("       Install with: pip install psycopg2-binary")
    print()

if HAS_PSYCOPG2:
    # Try to get database connection string
    # Supabase connection string format: postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
    # We need the actual database password from the connection string
    
    db_host = f"db.{project_ref}.supabase.co"
    db_port = 5432
    db_name = "postgres"
    db_user = "postgres"
    
    # Check for connection string in environment
    db_url = os.getenv("DATABASE_URL") or os.getenv("SUPABASE_DB_URL")
    
    if db_url and db_url.startswith("postgresql://"):
        # Parse connection string
        from urllib.parse import urlparse
        parsed = urlparse(db_url)
        db_password = parsed.password
        db_user = parsed.username or "postgres"
        db_host = parsed.hostname or db_host
        db_port = parsed.port or 5432
        
        print(f"[INFO] Found database connection string")
        print(f"       Attempting connection to {db_host}:{db_port}/{db_name}...")
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
            
            for i, migration_file in enumerate(monster_migration_files, 1):
                file_path = migrations_dir / migration_file
                
                if not file_path.exists():
                    print(f"[{i}/{len(monster_migration_files)}] [SKIP] {migration_file} - File not found")
                    continue
                
                print(f"[{i}/{len(monster_migration_files)}] Processing: {migration_file}")
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        sql_content = f.read()
                    
                    # Execute SQL
                    cursor.execute(sql_content)
                    
                    # Check if it was an INSERT statement (might have ON CONFLICT DO NOTHING)
                    # Count rows inserted if possible
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
            print(f"Migration Summary: {success_count} successful, {error_count} errors".center(70))
            print("=" * 70)
            print()
            
            if error_count == 0:
                print("🎉 All migrations applied successfully!")
                print()
                print("Next step: Generate images:")
                print("  python scripts/generate-compendium-images.py monsters 10")
                print()
                sys.exit(0)
            
        except psycopg2.OperationalError as e:
            print(f"❌ Connection failed: {str(e)[:200]}")
            print()
    else:
        print("[INFO] Database connection string not found in environment")
        print("       Need DATABASE_URL or SUPABASE_DB_URL")
        print()

# If we can't use direct connection, provide instructions
print("=" * 70)
print("ALTERNATIVE: Apply via Supabase Dashboard".center(70))
print("=" * 70)
print()
print(f"1. Go to: https://app.supabase.com/project/{project_ref}/sql/new")
print("2. Copy and paste each migration file IN ORDER:")
print()
for i, mf in enumerate(monster_migration_files, 1):
    file_path = migrations_dir / mf
    if file_path.exists():
        size = file_path.stat().st_size
        print(f"   {i}. {mf} ({size:,} bytes)")
print()
print("3. Click 'Run' after each file")
print()
print("After migrations are applied, run:")
print("  python scripts/generate-compendium-images.py monsters 10")
print()

