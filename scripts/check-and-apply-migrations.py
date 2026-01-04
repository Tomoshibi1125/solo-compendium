#!/usr/bin/env python3
"""
Check migration status and attempt to apply if needed
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
print("Checking Migration Status".center(70))
print("=" * 70)
print()

# Check if tables exist and have image_url columns
tables_to_check = {
    "compendium_monsters": "monsters",
    "compendium_equipment": "equipment",
    "compendium_relics": "relics",
    "compendium_jobs": "jobs"
}

migrations_needed = False
tables_status = {}

for table, display_name in tables_to_check.items():
    try:
        # Try to query with image_url column
        url = f"{SUPABASE_URL}/rest/v1/{table}?select=id,image_url&limit=1"
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            tables_status[display_name] = "OK"
            print(f"[OK] {display_name}: Table exists with image_url column")
        elif response.status_code == 400:
            error_text = response.text.lower()
            if "column" in error_text and "does not exist" in error_text:
                if "image_url" in error_text:
                    tables_status[display_name] = "MISSING_COLUMN"
                    migrations_needed = True
                    print(f"[NEEDS MIGRATION] {display_name}: Table exists but image_url column missing")
                else:
                    tables_status[display_name] = "ERROR"
                    print(f"[ERROR] {display_name}: {error_text[:100]}")
            else:
                tables_status[display_name] = "ERROR"
                print(f"[ERROR] {display_name}: {response.text[:100]}")
        elif response.status_code == 404:
            tables_status[display_name] = "MISSING_TABLE"
            migrations_needed = True
            print(f"[NEEDS MIGRATION] {display_name}: Table does not exist")
        else:
            tables_status[display_name] = "ERROR"
            print(f"[ERROR] {display_name}: Status {response.status_code}")
            
    except requests.exceptions.ConnectionError as e:
        print(f"[CONNECTION ERROR] {display_name}: Cannot connect to Supabase")
        print(f"   Error: {str(e)[:100]}")
        tables_status[display_name] = "CONNECTION_ERROR"
    except Exception as e:
        print(f"[ERROR] {display_name}: {str(e)[:100]}")
        tables_status[display_name] = "ERROR"

print()

# Check storage bucket
print("Checking Storage Bucket...")
try:
    bucket_url = f"{SUPABASE_URL}/storage/v1/bucket/compendium-images"
    response = requests.get(bucket_url, headers=headers, timeout=10)
    
    if response.status_code == 200:
        print("[OK] compendium-images bucket exists")
        bucket_exists = True
    elif response.status_code == 404:
        print("[NEEDS MIGRATION] compendium-images bucket does not exist")
        migrations_needed = True
        bucket_exists = False
    else:
        print(f"[INFO] Bucket status: {response.status_code}")
        bucket_exists = None
except Exception as e:
    print(f"[ERROR] Cannot check bucket: {str(e)[:100]}")
    bucket_exists = None

print()
print("=" * 70)

if migrations_needed:
    print("MIGRATIONS NEEDED".center(70))
    print("=" * 70)
    print()
    print("To apply migrations:")
    print(f"  1. Open: https://app.supabase.com/project/{SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')}/sql/new")
    print("  2. Copy contents of: scripts/complete-setup-all.sql")
    print("  3. Paste and click 'Run'")
    print()
    print("After applying migrations, run this script again to verify.")
    sys.exit(1)
else:
    if all(status == "OK" for status in tables_status.values() if status):
        print("ALL MIGRATIONS APPLIED".center(70))
        print("=" * 70)
        print()
        print("[OK] All tables exist with image_url columns")
        if bucket_exists:
            print("[OK] Storage bucket exists")
        print()
        print("Ready to generate images!")
        sys.exit(0)
    else:
        print("VERIFICATION INCOMPLETE".center(70))
        print("=" * 70)
        print()
        print("Some checks failed. Please review above.")
        sys.exit(1)

