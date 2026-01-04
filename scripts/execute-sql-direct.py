#!/usr/bin/env python3
"""
Execute SQL directly via PostgreSQL connection
Uses Supabase database connection string
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

project_ref = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")

# Read SQL file
SQL_FILE = Path(__file__).parent / "complete-setup-all.sql"
with open(SQL_FILE, 'r', encoding='utf-8') as f:
    sql_content = f.read()

print("=" * 70)
print("Executing Complete Setup SQL".center(70))
print("=" * 70)
print()
print(f"Project: {project_ref}")
print(f"SQL File: {SQL_FILE}")
print()

# Try to use psycopg2 for direct PostgreSQL connection
try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    
    # Construct connection string from Supabase details
    # Supabase PostgreSQL connection uses:
    # - Host: db.{project_ref}.supabase.co
    # - Port: 5432
    # - Database: postgres
    # - User: postgres
    # - Password: service_role_key (for service role)
    
    db_host = f"db.{project_ref}.supabase.co"
    db_port = 5432
    db_name = "postgres"
    db_user = "postgres"
    db_password = SUPABASE_KEY
    
    print(f"Connecting to: {db_host}:{db_port}/{db_name}")
    print()
    
    try:
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password,
            connect_timeout=10
        )
        
        # Set autocommit for DDL statements
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        cursor = conn.cursor()
        
        print("Connection successful! Executing SQL...")
        print()
        
        # Execute SQL
        cursor.execute(sql_content)
        
        print("SQL executed successfully!")
        print()
        
        # Try to get any result
        try:
            result = cursor.fetchone()
            if result:
                print(f"Result: {result[0]}")
        except:
            pass  # Some SQL doesn't return results
        
        cursor.close()
        conn.close()
        
        print()
        print("=" * 70)
        print("SUCCESS - Setup Complete!".center(70))
        print("=" * 70)
        print()
        print("All tables created, image columns added, and storage configured.")
        print()
        
        sys.exit(0)
        
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        print()
        print("This might be due to:")
        print("  1. Database connection string format")
        print("  2. Network firewall blocking connection")
        print("  3. Service role key format")
        print()
        
except ImportError:
    print("psycopg2 not installed")
    print("Install with: pip install psycopg2-binary")
    print()

print("=" * 70)
print("FALLBACK: Manual Execution Required".center(70))
print("=" * 70)
print()
print("Please run the SQL manually in Supabase Dashboard:")
print()
print(f"1. Go to: https://app.supabase.com/project/{project_ref}/sql/new")
print()
print(f"2. Copy contents of: {SQL_FILE}")
print()
print("3. Paste and click 'Run'")
print()
print("=" * 70)
print()

sys.exit(1)

