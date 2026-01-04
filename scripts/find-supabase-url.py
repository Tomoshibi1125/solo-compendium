#!/usr/bin/env python3
"""
Script to help find Supabase project URL from existing configuration
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import requests

# Load environment
load_dotenv('.env.local', override=True)
load_dotenv('.env', override=False)
load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ACCESS_TOKEN")

print("=" * 60)
print("Finding Supabase Project URL".center(60))
print("=" * 60)
print()

if SUPABASE_URL and not "your_" in SUPABASE_URL.lower():
    print(f"[INFO] Supabase URL found in .env.local: {SUPABASE_URL}")
    print("[OK] URL is already configured!")
    sys.exit(0)

if not SUPABASE_KEY:
    print("[FAIL] No Supabase token found")
    print("   Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ACCESS_TOKEN in .env.local")
    sys.exit(1)

print(f"[INFO] Token found: {SUPABASE_KEY[:20]}...")
print("[INFO] Attempting to find project URL from token...")
print()

# If we have a token, we might be able to use Supabase Management API
# But access tokens (sbp_) can't access management API
if SUPABASE_KEY.startswith("sbp_"):
    print("[INFO] Access token detected (sbp_ format)")
    print("[INFO] Cannot auto-detect project URL from access token")
    print()
    print("You need to provide your Supabase project URL manually:")
    print("  1. Go to https://app.supabase.com")
    print("  2. Select your project")
    print("  3. Go to Settings → API")
    print("  4. Copy the 'Project URL' (looks like: https://xxxxx.supabase.co)")
    print()
    print("Then update .env.local:")
    print("  VITE_SUPABASE_URL=https://your-project-id.supabase.co")
    sys.exit(1)

# For service role keys, we could try to decode JWT, but it's easier to just ask
print("[INFO] Service role key detected")
print("[INFO] Please provide your Supabase project URL")
print()
print("Get it from: Supabase Dashboard → Settings → API → Project URL")
print("Format: https://xxxxx.supabase.co")
print()
print("Update .env.local with:")
print("  VITE_SUPABASE_URL=https://your-project-id.supabase.co")

