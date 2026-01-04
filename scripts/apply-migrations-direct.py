#!/usr/bin/env python3
"""
Apply complete setup SQL directly to Supabase PostgreSQL database
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials")
    sys.exit(1)

# Extract project reference
project_ref = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")

# Read SQL file
SQL_FILE = Path(__file__).parent / "complete-setup-all.sql"
with open(SQL_FILE, 'r', encoding='utf-8') as f:
    sql_content = f.read()

print("=" * 70)
print("Applying Complete Setup SQL to Supabase".center(70))
print("=" * 70)
print()
print(f"Project: {project_ref}")
print(f"SQL File: {SQL_FILE}")
print()

# Try to use psycopg2 for direct connection
try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    
    # Construct connection details
    # Supabase uses: db.{project_ref}.supabase.co
    db_host = f"db.{project_ref}.supabase.co"
    db_port = 5432
    db_name = "postgres"
    
    # For Supabase, the service role key might work as password
    # But typically you need the database password from connection string
    # Let's try with service role key first
    db_user = "postgres"
    db_password = SUPABASE_KEY
    
    print(f"Connecting to: {db_host}:{db_port}/{db_name}")
    print("Attempting connection...")
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
        
        # Set autocommit for DDL statements
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        cursor = conn.cursor()
        
        print("✅ Connection successful!")
        print("Executing SQL...")
        print()
        
        # Execute SQL (split by semicolon for better error reporting)
        statements = []
        current_stmt = ""
        for line in sql_content.split('\n'):
            stripped = line.strip()
            # Skip comments and empty lines
            if stripped.startswith('--') or not stripped:
                continue
            current_stmt += line + '\n'
            if stripped.endswith(';'):
                statements.append(current_stmt.strip())
                current_stmt = ""
        
        if current_stmt.strip():
            statements.append(current_stmt.strip())
        
        success_count = 0
        error_count = 0
        
        for i, stmt in enumerate(statements, 1):
            if not stmt or stmt == ';':
                continue
            try:
                cursor.execute(stmt)
                success_count += 1
                print(f"  [{i}/{len(statements)}] ✅ Executed")
            except Exception as e:
                error_count += 1
                # Some errors are expected (IF NOT EXISTS, etc.)
                error_msg = str(e).split('\n')[0]
                if 'already exists' in error_msg.lower() or 'duplicate' in error_msg.lower():
                    print(f"  [{i}/{len(statements)}] ⚠️  Skipped (already exists)")
                    success_count += 1
                    error_count -= 1
                else:
                    print(f"  [{i}/{len(statements)}] ❌ Error: {error_msg[:100]}")
        
        print()
        print("=" * 70)
        print(f"Execution Complete: {success_count} successful, {error_count} errors".center(70))
        print("=" * 70)
        print()
        
        # Try to get result from SELECT statement if any
        try:
            cursor.execute("SELECT 'Complete setup successful!' as status")
            result = cursor.fetchone()
            if result:
                print(f"✅ {result[0]}")
        except:
            pass
        
        cursor.close()
        conn.close()
        
        if error_count == 0:
            print()
            print("🎉 SUCCESS! All migrations applied successfully!")
            print()
            print("Next step: Generate your first image:")
            print("  python scripts/generate-compendium-images.py monsters 1")
            print()
            sys.exit(0)
        else:
            print()
            print("⚠️  Some statements had errors. Please review above.")
            sys.exit(1)
        
    except psycopg2.OperationalError as e:
        error_msg = str(e)
        if "password authentication" in error_msg:
            print("❌ Password authentication failed")
            print()
            print("The service role key cannot be used as a PostgreSQL password.")
            print("You need the database connection password from Supabase Dashboard:")
            print(f"  Settings → Database → Connection String (URI mode)")
            print()
            print("Alternatively, run the SQL manually in Supabase SQL Editor:")
            print(f"  https://app.supabase.com/project/{project_ref}/sql/new")
            print()
        else:
            print(f"❌ Connection error: {error_msg}")
        sys.exit(1)
        
except ImportError:
    print("psycopg2 not installed")
    print("Install with: pip install psycopg2-binary")
    print()
    print("FALLBACK: Run SQL manually in Supabase Dashboard:")
    print(f"  1. Go to: https://app.supabase.com/project/{project_ref}/sql/new")
    print(f"  2. Copy contents of: {SQL_FILE}")
    print("  3. Paste and click 'Run'")
    print()
    sys.exit(1)

except Exception as e:
    print(f"❌ Unexpected error: {e}")
    print()
    print("FALLBACK: Run SQL manually in Supabase Dashboard:")
    print(f"  1. Go to: https://app.supabase.com/project/{project_ref}/sql/new")
    print(f"  2. Copy contents of: {SQL_FILE}")
    print("  3. Paste and click 'Run'")
    print()
    sys.exit(1)

