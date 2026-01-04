#!/usr/bin/env python3
"""
Apply complete setup SQL to Supabase using Supabase Management API
This uses the Supabase Management API to execute SQL
"""

import os
import sys
import requests
import json
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
print("Applying Complete Setup to Supabase".center(70))
print("=" * 70)
print()
print(f"Project: {project_ref}")
print(f"SQL File: {SQL_FILE}")
print()

# Method 1: Try Supabase Management API (requires Management API token)
# The service role key should work, but we need the correct endpoint

# Method 2: Use PostgREST to execute SQL (limited - only SELECT/INSERT/UPDATE)
# PostgREST doesn't support DDL statements

# Method 3: Use Supabase CLI if available
import subprocess

print("Checking for Supabase CLI...")
try:
    result = subprocess.run(
        ["supabase", "--version"],
        capture_output=True,
        text=True,
        timeout=5
    )
    if result.returncode == 0:
        print("✅ Supabase CLI found!")
        print(f"   {result.stdout.strip()}")
        print()
        print("Attempting to execute SQL via CLI...")
        print()
        
        # Try to execute via CLI
        # Note: This requires proper Supabase CLI setup and linking
        cmd = [
            "supabase", "db", "execute",
            "--file", str(SQL_FILE),
            "--project-ref", project_ref
        ]
        
        print(f"Running: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            print("✅ SQL executed successfully via CLI!")
            print(result.stdout)
            sys.exit(0)
        else:
            print("⚠️  CLI execution failed:")
            print(result.stderr)
            print()
            print("This might require:")
            print("  1. Supabase CLI authentication: supabase login")
            print("  2. Linking project: supabase link --project-ref " + project_ref)
            print()
    else:
        print("❌ Supabase CLI not working properly")
except FileNotFoundError:
    print("❌ Supabase CLI not installed")
except subprocess.TimeoutExpired:
    print("⚠️  Supabase CLI check timed out")
except Exception as e:
    print(f"⚠️  Error checking CLI: {e}")

print()
print("=" * 70)
print("MANUAL EXECUTION REQUIRED")
print("=" * 70)
print()
print("Supabase REST API doesn't support arbitrary SQL execution.")
print("Use one of these methods:")
print()
print("METHOD 1: Dashboard (Recommended)")
print("  1. Open: https://app.supabase.com/project/" + project_ref + "/sql/new")
print("  2. Copy SQL from: scripts/complete-setup-all.sql")
print("  3. Paste and click 'Run'")
print()
print("METHOD 2: Supabase CLI")
print("  Install: npm install -g supabase")
print("  Login: supabase login")
print("  Link: supabase link --project-ref " + project_ref)
print(f"  Execute: supabase db execute --file {SQL_FILE}")
print()
print("=" * 70)
print()

# Create a formatted SQL file for easy copy-paste
formatted_sql_path = Path(__file__).parent / "RUN_THIS_IN_DASHBOARD.sql"
with open(formatted_sql_path, 'w', encoding='utf-8') as f:
    f.write("-- Complete Setup SQL\n")
    f.write("-- Copy this entire file and paste into Supabase SQL Editor\n")
    f.write("-- Then click 'Run'\n\n")
    f.write(sql_content)
    f.write("\n\n-- Done! Check the output for success messages.\n")

print(f"✅ Formatted SQL saved to: {formatted_sql_path}")
print("   Copy the contents of this file to run in Dashboard")
print()

sys.exit(1)

