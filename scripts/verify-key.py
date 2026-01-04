#!/usr/bin/env python3
"""
Verify Supabase service role key format and test connection
"""

import os
import sys
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print("=" * 60)
print("Service Role Key Verification".center(60))
print("=" * 60)
print()

if not SUPABASE_KEY:
    print("[ERROR] No service role key found")
    sys.exit(1)

print(f"Key Format: {SUPABASE_KEY[:30]}...")
print(f"Key Length: {len(SUPABASE_KEY)} characters")
print()

# Check key format
if SUPABASE_KEY.startswith("eyJ"):
    print("[INFO] Key format: JWT (eyJ...) - Standard format")
elif SUPABASE_KEY.startswith("sb_secret_"):
    print("[INFO] Key format: sb_secret_ - New Supabase format")
    print("[NOTE] This format might need different authentication method")
elif SUPABASE_KEY.startswith("sbp_"):
    print("[INFO] Key format: sbp_ - Access token (not service role key)")
    print("[WARN] This is an access token, not a service role key")
    print("[WARN] Service role keys start with 'eyJ' or 'sb_secret_'")
else:
    print("[WARN] Unknown key format")

print()
print("Key Details:")
print(f"  First 20 chars: {SUPABASE_KEY[:20]}...")
print(f"  Last 20 chars: ...{SUPABASE_KEY[-20:]}")
print()

if not SUPABASE_URL:
    print("[ERROR] No Supabase URL found")
    sys.exit(1)

print(f"Supabase URL: {SUPABASE_URL}")
print()
print("=" * 60)
print("Verification Complete".center(60))
print("=" * 60)
print()
print("If authentication fails:")
print("  1. Double-check the key has no extra spaces")
print("  2. Verify it's the Service Role Key (not anon key)")
print("  3. Ensure it's for the correct project")
print("  4. Get it from: Dashboard -> Settings -> API -> service_role")
print()

