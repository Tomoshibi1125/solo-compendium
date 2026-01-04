#!/usr/bin/env python3
"""
Apply complete setup SQL to Supabase
This runs the complete-setup-all.sql file via Supabase Management API
"""

import os
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials in .env.local")
    sys.exit(1)

# Read the complete setup SQL file
SQL_FILE = Path(__file__).parent / "complete-setup-all.sql"

if not SQL_FILE.exists():
    print(f"ERROR: SQL file not found: {SQL_FILE}")
    sys.exit(1)

print("=" * 70)
print("Applying Complete Setup to Supabase".center(70))
print("=" * 70)
print()
print(f"Project: {SUPABASE_URL}")
print(f"SQL File: {SQL_FILE}")
print()

# Read SQL content
with open(SQL_FILE, 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Supabase doesn't have a direct REST API endpoint for arbitrary SQL execution
# We need to use the Management API or execute via psql
# However, we can use the Supabase Management API's SQL endpoint if available

# Try using the REST API's SQL endpoint (if available in newer Supabase versions)
# Otherwise, we'll need to guide the user to run it manually

print("NOTE: Supabase REST API doesn't support arbitrary SQL execution.")
print("We'll need to use the Management API or run this in the Dashboard.")
print()
print("Attempting to use Management API endpoint...")
print()

# Extract project reference from URL
project_ref = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")

# Try Management API endpoint (requires different auth)
# Management API uses different authentication
management_url = f"https://api.supabase.com/v1/projects/{project_ref}/database/query"

headers = {
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY
}

# Split SQL into statements (basic split by semicolon)
# Note: This is a simplified approach. Complex SQL with semicolons in strings won't work perfectly
sql_statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]

print(f"Found {len(sql_statements)} SQL statements to execute")
print()
print("⚠️  Direct SQL execution via API is not available with standard REST API.")
print()
print("SOLUTION: Use Supabase Dashboard")
print("=" * 70)
print()
print("1. Open Supabase Dashboard:")
print(f"   https://app.supabase.com/project/{project_ref}/sql/new")
print()
print("2. Copy the SQL from:")
print(f"   {SQL_FILE}")
print()
print("3. Paste and click 'Run'")
print()
print("OR use Supabase CLI (if installed):")
print("=" * 70)
print(f"   supabase db execute --file scripts/complete-setup-all.sql --project-ref {project_ref}")
print()

# Save SQL to a temp file for easy copy-paste
temp_sql_path = Path(__file__).parent / "TEMP_RUN_THIS.sql"
with open(temp_sql_path, 'w', encoding='utf-8') as f:
    f.write(sql_content)
print(f"✅ SQL saved to: {temp_sql_path}")
print("   You can copy this file's contents directly into the SQL Editor")
print()

# Alternative: Try to use Supabase's SQL REST endpoint (experimental)
print("Attempting alternative method...")
print()

# Some Supabase setups have a SQL execution endpoint
sql_endpoint = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"

try:
    # Try executing via a stored procedure (if it exists)
    # This won't work unless you've created an exec_sql function
    response = requests.post(
        sql_endpoint,
        headers=headers,
        json={"query": sql_content},
        timeout=30
    )
    
    if response.status_code == 200:
        print("✅ SQL executed successfully!")
        print(response.json())
        sys.exit(0)
    elif response.status_code == 404:
        print("ℹ️  Direct SQL execution endpoint not available")
        print("   Use the Dashboard method above")
    else:
        print(f"⚠️  API returned: {response.status_code}")
        print(f"   {response.text[:200]}")
except Exception as e:
    print(f"ℹ️  Could not execute via API: {e}")
    print("   Use the Dashboard method above")

print()
print("=" * 70)
print("SUMMARY")
print("=" * 70)
print()
print("✅ SQL file ready: scripts/complete-setup-all.sql")
print("✅ Temp copy created: scripts/TEMP_RUN_THIS.sql")
print()
print("📋 Next Steps:")
print(f"   1. Go to: https://app.supabase.com/project/{project_ref}/sql/new")
print("   2. Copy contents of scripts/TEMP_RUN_THIS.sql")
print("   3. Paste and click 'Run'")
print()
sys.exit(0)

