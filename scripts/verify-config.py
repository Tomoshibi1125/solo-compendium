#!/usr/bin/env python3
"""
Verify current configuration
"""

import os
import base64
import json
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

print("=" * 70)
print("Configuration Verification".center(70))
print("=" * 70)
print()

# Check Supabase
url = os.getenv('VITE_SUPABASE_URL', '')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')

print("Supabase Configuration:")
if url:
    print(f"  [OK] URL: {url}")
    project_ref = url.replace('https://', '').replace('.supabase.co', '')
    print(f"       Project Reference: {project_ref}")
else:
    print("  [FAIL] URL: Not set")

if key:
    print(f"  [OK] Service Key: Configured ({len(key)} chars)")
    if key.startswith('eyJ'):
        print("       Format: JWT")
        # Decode to verify
        try:
            parts = key.split('.')
            if len(parts) >= 2:
                payload = json.loads(base64.urlsafe_b64decode(parts[1] + '==').decode())
                key_ref = payload.get('ref', 'unknown')
                print(f"       Key Project Ref: {key_ref}")
                if key_ref in url:
                    print("       [OK] Key matches URL project")
                else:
                    print(f"       [WARN] Key project ({key_ref}) doesn't match URL")
        except:
            pass
    elif key.startswith('sb_secret_'):
        print("       Format: sb_secret_")
    else:
        print("       Format: Unknown")
else:
    print("  [FAIL] Service Key: Not set")

print()

# Check Hugging Face
hf_token = os.getenv('HUGGINGFACE_API_TOKEN', '')
hf_model = os.getenv('HUGGINGFACE_MODEL', 'stabilityai/stable-diffusion-xl-base-1.0')

print("Hugging Face Configuration:")
if hf_token:
    print(f"  [OK] Token: Configured")
else:
    print("  [FAIL] Token: Not set")

print(f"  [OK] Model: {hf_model}")

print()
print("=" * 70)
if all([url, key, hf_token]):
    print("Status: READY FOR IMAGE GENERATION".center(70))
else:
    print("Status: INCOMPLETE - Missing credentials".center(70))
print("=" * 70)
print()

