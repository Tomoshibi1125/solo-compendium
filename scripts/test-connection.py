#!/usr/bin/env python3
"""
Quick connection test for Supabase with service role key
"""

import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print("Testing Supabase Connection...")
print(f"URL: {SUPABASE_URL}")
print(f"Key: {SUPABASE_KEY[:20]}..." if SUPABASE_KEY else "Key: MISSING")
print()

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing credentials")
    sys.exit(1)

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Test 1: Basic connection
print("Test 1: Basic REST API connection...")
try:
    response = requests.get(f"{SUPABASE_URL}/rest/v1/", headers=headers, timeout=10)
    if response.status_code == 200:
        print("  [OK] Connection successful!")
    else:
        print(f"  [FAIL] Status {response.status_code}: {response.text[:200]}")
except Exception as e:
    print(f"  [FAIL] Error: {e}")

# Test 2: Query monsters table
print("\nTest 2: Query compendium_monsters table...")
try:
    response = requests.get(f"{SUPABASE_URL}/rest/v1/compendium_monsters?limit=1", headers=headers, timeout=10)
    if response.status_code == 200:
        print("  [OK] Can query monsters table!")
        data = response.json()
        if data:
            print(f"  Found {len(data)} entry (sample)")
    else:
        print(f"  [FAIL] Status {response.status_code}: {response.text[:200]}")
except Exception as e:
    print(f"  [FAIL] Error: {e}")

# Test 3: Check if image_url column exists
print("\nTest 3: Check if image_url column exists...")
try:
    response = requests.get(f"{SUPABASE_URL}/rest/v1/compendium_monsters?select=id,image_url&limit=1", headers=headers, timeout=10)
    if response.status_code == 200:
        print("  [OK] image_url column exists (migrations applied)!")
    elif response.status_code == 400:
        error_text = response.text.lower()
        if "column" in error_text and "does not exist" in error_text:
            print("  [WARN] image_url column does NOT exist (migrations needed)")
        else:
            print(f"  [WARN] Status {response.status_code}: {response.text[:200]}")
    else:
        print(f"  [WARN] Status {response.status_code}: {response.text[:200]}")
except Exception as e:
    print(f"  [WARN] Error: {e}")

# Test 4: Check storage bucket
print("\nTest 4: Check storage bucket...")
try:
    response = requests.get(f"{SUPABASE_URL}/storage/v1/bucket/compendium-images", headers=headers, timeout=10)
    if response.status_code == 200:
        print("  [OK] compendium-images bucket exists!")
    elif response.status_code == 404:
        print("  [WARN] compendium-images bucket does NOT exist (migrations needed)")
    else:
        print(f"  [WARN] Status {response.status_code}: {response.text[:200]}")
except Exception as e:
    print(f"  [WARN] Error: {e}")

print("\n" + "="*60)
print("Connection test complete!")
print("="*60)

