#!/usr/bin/env python3
"""
Finalize setup and generate first test image
Handles migration verification and initial image generation
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")

print("=" * 70)
print("Image Generation Setup - Final Check".center(70))
print("=" * 70)
print()

# Check credentials
print("Credentials Check:")
all_ok = True

if SUPABASE_URL:
    print(f"  [OK] Supabase URL: {SUPABASE_URL[:50]}...")
else:
    print("  [FAIL] Supabase URL not set")
    all_ok = False

if SUPABASE_KEY and SUPABASE_KEY.startswith("eyJ"):
    print(f"  [OK] Service Role Key: JWT format")
elif SUPABASE_KEY:
    print(f"  [WARN] Service Role Key: {SUPABASE_KEY[:20]}... (may need JWT format)")
else:
    print("  [FAIL] Service Role Key not set")
    all_ok = False

if HUGGINGFACE_TOKEN and HUGGINGFACE_TOKEN.startswith("hf_"):
    print(f"  [OK] Hugging Face Token: Configured")
else:
    print("  [FAIL] Hugging Face Token not set")
    all_ok = False

print()

if not all_ok:
    print("⚠️  Some credentials are missing. Check .env.local")
    print()
    sys.exit(1)

# Check if we can reach Supabase
print("Testing Supabase Connection...")
try:
    import requests
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
    test_url = f"{SUPABASE_URL}/rest/v1/"
    response = requests.get(test_url, headers=headers, timeout=10)
    
    if response.status_code in [200, 400, 404]:  # 400/404 means API is reachable
        print("  [OK] Supabase API is reachable")
        api_reachable = True
    else:
        print(f"  [WARN] Unexpected status: {response.status_code}")
        api_reachable = True  # Still might work
except Exception as e:
    print(f"  [WARN] Connection test failed: {str(e)[:100]}")
    api_reachable = False

print()

# Check migrations status
print("Checking Migration Status...")
try:
    import requests
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
    
    # Try to query a table with image_url column
    test_url = f"{SUPABASE_URL}/rest/v1/compendium_monsters?select=id,image_url&limit=1"
    response = requests.get(test_url, headers=headers, timeout=10)
    
    if response.status_code == 200:
        print("  [OK] Tables exist and image_url column accessible")
        migrations_applied = True
    elif response.status_code == 400:
        error_text = response.text.lower()
        if "column" in error_text and "does not exist" in error_text:
            print("  [WARN] image_url column missing - migrations not applied")
            migrations_applied = False
        else:
            print(f"  [WARN] API returned 400: {error_text[:100]}")
            migrations_applied = None
    elif response.status_code == 404:
        print("  [WARN] Tables not found - migrations need to be applied")
        migrations_applied = False
    else:
        print(f"  [WARN] Status {response.status_code}")
        migrations_applied = None
        
except Exception as e:
    print(f"  [WARN] Could not check: {str(e)[:100]}")
    migrations_applied = None

print()

# Summary and next steps
print("=" * 70)
print("Status Summary".center(70))
print("=" * 70)
print()

if not api_reachable:
    print("⚠️  Cannot reach Supabase API")
    print("   Possible issues:")
    print("   - Network connectivity")
    print("   - Project URL might be incorrect")
    print("   - Project might be paused")
    print()
    print("Next steps:")
    print("   1. Verify Supabase URL in Dashboard")
    print("   2. Check project status in Supabase Dashboard")
    print("   3. Update .env.local with correct URL")
    print()
    sys.exit(1)

if migrations_applied == False:
    print("⚠️  Migrations not yet applied")
    print()
    print("To apply migrations:")
    print(f"   1. Open: https://app.supabase.com/project/{SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')}/sql/new")
    print("   2. Copy contents of: scripts/complete-setup-all.sql")
    print("   3. Paste and click 'Run'")
    print()
    print("After applying migrations, you can generate images:")
    print("   python scripts/generate-compendium-images.py monsters 1")
    print()
    sys.exit(1)
elif migrations_applied == True:
    print("✅ Everything is ready!")
    print()
    print("You can now generate images:")
    print("   python scripts/generate-compendium-images.py monsters 1")
    print()
    
    # Ask if user wants to generate now
    print("Would you like to generate a test image now? (Y/n): ", end='')
    try:
        response = input().strip().lower()
        if response != 'n':
            print()
            print("Generating first test image...")
            print()
            # Import and run the generation script
            import subprocess
            result = subprocess.run(
                [sys.executable, "scripts/generate-compendium-images.py", "monsters", "1"],
                cwd=Path(__file__).parent.parent
            )
            sys.exit(result.returncode)
    except:
        print("Skipping automatic generation.")
        print("Run manually: python scripts/generate-compendium-images.py monsters 1")
else:
    print("⚠️  Could not verify migration status")
    print()
    print("You can try generating images anyway:")
    print("   python scripts/generate-compendium-images.py monsters 1")
    print()
    print("If migrations are missing, you'll get clear error messages.")
    print()

sys.exit(0)

