#!/usr/bin/env python3
"""
Update Supabase Service Role Key in .env.local
"""

import os
import sys
import re
from pathlib import Path

def update_service_key(new_key: str):
    """Update SUPABASE_SERVICE_ROLE_KEY in .env.local"""
    env_file = Path('.env.local')
    
    if not env_file.exists():
        print("ERROR: .env.local not found")
        return False
    
    # Read current content
    content = env_file.read_text(encoding='utf-8')
    
    # Remove old SUPABASE_SERVICE_ROLE_KEY line
    pattern = r'^SUPABASE_SERVICE_ROLE_KEY=.*$'
    content = re.sub(pattern, '', content, flags=re.MULTILINE)
    
    # Remove trailing whitespace/newlines
    content = content.rstrip()
    
    # Add new key
    if not content.endswith('\n'):
        content += '\n'
    content += f'SUPABASE_SERVICE_ROLE_KEY={new_key}\n'
    
    # Write back
    env_file.write_text(content, encoding='utf-8')
    
    print("[OK] Service Role Key updated successfully!")
    print(f"   Key format: {new_key[:20]}...")
    print(f"   Length: {len(new_key)} characters")
    
    # Verify
    from dotenv import load_dotenv
    load_dotenv('.env.local', override=True)
    verified_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if verified_key == new_key:
        print("[OK] Verification: Key loaded correctly")
        return True
    else:
        print("[WARN] Warning: Verification failed - key may not match")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python update-service-key.py <service_role_key>")
        sys.exit(1)
    
    new_key = sys.argv[1].strip()
    
    if not new_key:
        print("ERROR: Empty key provided")
        sys.exit(1)
    
    if update_service_key(new_key):
        print("\n[OK] Update complete! Test with:")
        print("   python scripts/test-image-gen-setup.py")
        sys.exit(0)
    else:
        sys.exit(1)

