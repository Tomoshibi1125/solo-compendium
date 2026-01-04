#!/usr/bin/env python3
"""
Check what entries exist in the database
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
    "Content-Type": "application/json"
}

tables = {
    "monsters": "compendium_monsters",
    "equipment": "compendium_equipment",
    "relics": "compendium_relics",
    "jobs": "compendium_jobs"
}

print("=" * 70)
print("Database Entry Check".center(70))
print("=" * 70)
print()

for display_name, table in tables.items():
    try:
        url = f"{SUPABASE_URL}/rest/v1/{table}?select=id,name,image_url&limit=10"
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            entries = response.json()
            total_count = len(entries)
            with_images = sum(1 for e in entries if e.get("image_url"))
            without_images = total_count - with_images
            
            print(f"{display_name.upper()}:")
            print(f"  Total entries (showing first 10): {total_count}")
            print(f"  With images: {with_images}")
            print(f"  Without images: {without_images}")
            
            if entries:
                print(f"  Sample entries:")
                for entry in entries[:3]:
                    name = entry.get("name", "Unknown")
                    has_image = "Yes" if entry.get("image_url") else "No"
                    print(f"    - {name} (image: {has_image})")
            else:
                print(f"  [INFO] No entries found in {table}")
            print()
        else:
            print(f"{display_name}: Error {response.status_code}")
            print()
    except Exception as e:
        print(f"{display_name}: Error - {str(e)[:100]}")
        print()

print("=" * 70)

