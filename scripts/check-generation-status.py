#!/usr/bin/env python3
"""
Quick status check for image generation progress
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Prefer": "count=exact"
}

tables = {
    "monsters": "compendium_monsters",
    "equipment": "compendium_equipment",
    "relics": "compendium_relics",
    "jobs": "compendium_jobs",
}

print("=" * 70)
print("IMAGE GENERATION STATUS".center(70))
print("=" * 70)
print()

total_without = 0
total_with = 0

for entry_type, table in tables.items():
    try:
        # Count with images
        url_with = f"{SUPABASE_URL}/rest/v1/{table}?select=id&image_url=not.is.null"
        r_with = requests.get(url_with, headers=headers, timeout=10)
        count_with = int(r_with.headers.get('content-range', '0/0').split('/')[-1]) if '/' in r_with.headers.get('content-range', '') else (len(r_with.json()) if r_with.json() else 0)
        
        # Count without images
        url_without = f"{SUPABASE_URL}/rest/v1/{table}?select=id&image_url=is.null"
        r_without = requests.get(url_without, headers=headers, timeout=10)
        count_without = int(r_without.headers.get('content-range', '0/0').split('/')[-1]) if '/' in r_without.headers.get('content-range', '') else (len(r_without.json()) if r_without.json() else 0)
        
        total = count_with + count_without
        if total > 0:
            pct = (count_with / total) * 100
            print(f"{entry_type.upper()}:")
            print(f"  Total: {total}")
            print(f"  With images: {count_with} ({pct:.1f}%)")
            print(f"  Without images: {count_without}")
            print()
        
        total_without += count_without
        total_with += count_with
        
    except Exception as e:
        print(f"{entry_type}: Error - {str(e)[:50]}")
        print()

print("=" * 70)
print(f"TOTAL: {total_with} with images, {total_without} remaining".center(70))
print("=" * 70)

