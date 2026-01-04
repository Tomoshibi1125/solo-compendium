#!/usr/bin/env python3
"""
Check what tables exist in the Supabase database
"""

import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing credentials")
    sys.exit(1)

print("Checking Supabase Database Tables...")
print(f"URL: {SUPABASE_URL}")
print()

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Try to query different possible table names
tables_to_check = [
    "compendium_monsters",
    "compendium_equipment", 
    "compendium_relics",
    "compendium_jobs",
    "monsters",
    "equipment",
    "characters"
]

print("Checking for tables:")
for table in tables_to_check:
    try:
        url = f"{SUPABASE_URL}/rest/v1/{table}?limit=1"
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            print(f"  [OK] {table} exists")
        elif response.status_code == 404:
            print(f"  [NOT FOUND] {table}")
        else:
            print(f"  [?] {table} - Status {response.status_code}")
    except Exception as e:
        print(f"  [ERROR] {table} - {e}")

print()
print("If no compendium tables exist, you may need to:")
print("  1. Check if you're using the correct Supabase project")
print("  2. Apply base migrations that create the compendium schema")
print("  3. Import compendium data first")

