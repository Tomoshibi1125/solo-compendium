#!/usr/bin/env python3
"""
Test different authentication methods for Supabase
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

print("Testing Supabase Authentication Methods...")
print(f"URL: {SUPABASE_URL}")
print(f"Key format: {SUPABASE_KEY[:20]}...")
print()

test_url = f"{SUPABASE_URL}/rest/v1/compendium_monsters?limit=1"

# Method 1: Standard JWT (apikey + Bearer)
print("Method 1: Standard JWT (apikey + Bearer)...")
try:
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.get(test_url, headers=headers, timeout=10)
    print(f"  Status: {response.status_code}")
    if response.status_code == 200:
        print("  [OK] Authentication successful!")
        sys.exit(0)
    else:
        print(f"  [FAIL] {response.text[:200]}")
except Exception as e:
    print(f"  [FAIL] {e}")

# Method 2: Bearer only (for sb_secret_ format)
if SUPABASE_KEY.startswith("sb_secret_"):
    print("\nMethod 2: Bearer only (sb_secret_ format)...")
    try:
        headers = {
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.get(test_url, headers=headers, timeout=10)
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            print("  [OK] Authentication successful!")
            sys.exit(0)
        else:
            print(f"  [FAIL] {response.text[:200]}")
    except Exception as e:
        print(f"  [FAIL] {e}")

# Method 3: apikey only
print("\nMethod 3: apikey only...")
try:
    headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
    }
    response = requests.get(test_url, headers=headers, timeout=10)
    print(f"  Status: {response.status_code}")
    if response.status_code == 200:
        print("  [OK] Authentication successful!")
        sys.exit(0)
    else:
        print(f"  [FAIL] {response.text[:200]}")
except Exception as e:
    print(f"  [FAIL] {e}")

print("\n" + "="*60)
print("All authentication methods failed.")
print("="*60)
print("\nPossible issues:")
print("  1. Key might be incorrect or for different project")
print("  2. Key format might need different authentication")
print("  3. Try getting JWT format key (starts with eyJ)")
print("  4. Verify key from: Dashboard -> Settings -> API -> service_role")
print()

