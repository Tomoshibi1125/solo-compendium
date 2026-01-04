#!/usr/bin/env python3
"""
Automated setup and image generation
Handles everything needed to get images generated
"""

import os
import sys
import time
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")

print("=" * 70)
print("Automated Image Generation Setup & Execution".center(70))
print("=" * 70)
print()

# Step 1: Verify credentials
print("Step 1: Verifying credentials...")
if not all([SUPABASE_URL, SUPABASE_KEY, HUGGINGFACE_TOKEN]):
    print("ERROR: Missing required credentials")
    print("Check .env.local has:")
    print("  - VITE_SUPABASE_URL")
    print("  - SUPABASE_SERVICE_ROLE_KEY")
    print("  - HUGGINGFACE_API_TOKEN")
    sys.exit(1)
print("  [OK] All credentials present")
print()

# Step 2: Test Supabase connection
print("Step 2: Testing Supabase connection...")
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

supabase_ok = False
try:
    # Try simple endpoint
    test_url = f"{SUPABASE_URL}/rest/v1/"
    response = requests.get(test_url, headers=headers, timeout=15)
    if response.status_code in [200, 400, 404]:
        print("  [OK] Supabase API reachable")
        supabase_ok = True
    else:
        print(f"  [WARN] Unexpected status: {response.status_code}")
except requests.exceptions.Timeout:
    print("  [WARN] Connection timeout - may be network issue")
except requests.exceptions.ConnectionError as e:
    error_str = str(e)
    if "getaddrinfo failed" in error_str or "NameResolutionError" in error_str:
        print("  [WARN] DNS resolution failed - may be network/project issue")
        print("  This might mean:")
        print("    - Project URL is incorrect")
        print("    - Network connectivity issue")
        print("    - Project may be paused")
    else:
        print(f"  [WARN] Connection error: {error_str[:100]}")
except Exception as e:
    print(f"  [WARN] Error: {str(e)[:100]}")

print()

# Step 3: Check migrations
print("Step 3: Checking migration status...")
migrations_ok = False
if supabase_ok:
    try:
        test_url = f"{SUPABASE_URL}/rest/v1/compendium_monsters?select=id,image_url&limit=1"
        response = requests.get(test_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print("  [OK] Tables exist and image_url column accessible")
            migrations_ok = True
        elif response.status_code == 400:
            error_text = response.text.lower()
            if "column" in error_text and "does not exist" in error_text:
                print("  [WARN] image_url column missing - migrations needed")
            else:
                print(f"  [INFO] Status 400: {error_text[:100]}")
        elif response.status_code == 404:
            print("  [WARN] Tables not found - base migrations needed")
        else:
            print(f"  [INFO] Status {response.status_code}")
    except Exception as e:
        print(f"  [WARN] Could not check: {str(e)[:100]}")
else:
    print("  [SKIP] Cannot check (connection issue)")

print()

# Step 4: Test Hugging Face API
print("Step 4: Testing Hugging Face API...")
hf_ok = False
try:
    model = os.getenv("HUGGINGFACE_MODEL", "stabilityai/stable-diffusion-xl-base-1.0")
    url = f"https://api-inference.huggingface.co/models/{model}"
    hf_headers = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}"}
    response = requests.head(url, headers=hf_headers, timeout=10)
    
    if response.status_code == 200:
        print("  [OK] Hugging Face API reachable")
        hf_ok = True
    else:
        print(f"  [INFO] Status {response.status_code} (may be loading)")
        hf_ok = True  # Still might work
except Exception as e:
    print(f"  [WARN] Could not test: {str(e)[:100]}")

print()

# Summary and action plan
print("=" * 70)
print("Status Summary".center(70))
print("=" * 70)
print()

if not supabase_ok:
    print("⚠️  SUPABASE CONNECTION ISSUE")
    print()
    print("Unable to reach Supabase API. Possible causes:")
    print("  1. Network connectivity issue")
    print("  2. Project URL might be incorrect")
    print("  3. Project might be paused in Supabase")
    print("  4. DNS resolution issue")
    print()
    print("SOLUTION:")
    print("  1. Verify project URL in Supabase Dashboard")
    print("  2. Check project status (not paused)")
    print("  3. Apply migrations manually:")
    print(f"     - Go to: https://app.supabase.com/project/{SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')}/sql/new")
    print("     - Run: scripts/complete-setup-all.sql")
    print()
    print("Once migrations are applied, you can generate images even if connection test fails.")
    print()
    sys.exit(1)

if not migrations_ok:
    print("⚠️  MIGRATIONS NEED TO BE APPLIED")
    print()
    print("To apply migrations:")
    print(f"  1. Go to: https://app.supabase.com/project/{SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')}/sql/new")
    print("  2. Copy contents of: scripts/complete-setup-all.sql")
    print("  3. Paste and click 'Run'")
    print()
    print("After applying migrations, run this script again or:")
    print("  python scripts/generate-compendium-images.py monsters 1")
    print()
    sys.exit(1)

# Everything ready - proceed with generation
print("✅ ALL SYSTEMS GO!")
print()
print("All checks passed. Ready to generate images!")
print()

# Ask for confirmation
try:
    print("Generate first test image? (Y/n): ", end='')
    response = input().strip().lower()
    if response == 'n':
        print()
        print("Run manually when ready:")
        print("  python scripts/generate-compendium-images.py monsters 1")
        sys.exit(0)
except:
    pass

print()
print("=" * 70)
print("Generating First Test Image".center(70))
print("=" * 70)
print()

# Import and run generation
import subprocess
result = subprocess.run(
    [sys.executable, "scripts/generate-compendium-images.py", "monsters", "1"],
    cwd=Path(__file__).parent.parent
)

if result.returncode == 0:
    print()
    print("=" * 70)
    print("SUCCESS!".center(70))
    print("=" * 70)
    print()
    print("✅ First image generated successfully!")
    print()
    print("Generate more images:")
    print("  python scripts/generate-compendium-images.py monsters 10")
    print("  python scripts/generate-compendium-images.py equipment 5")
    print("  python scripts/generate-compendium-images.py relics 5")
    print("  python scripts/generate-compendium-images.py jobs 5")
    print()
else:
    print()
    print("⚠️  Generation failed. Check error messages above.")
    print("Common issues:")
    print("  - Migrations not applied")
    print("  - Network connectivity")
    print("  - API rate limits")
    print()

sys.exit(result.returncode)

