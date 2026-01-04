#!/usr/bin/env python3
"""
Update Supabase URL in .env.local to match project reference
"""

import os
import sys
import re
from pathlib import Path

def update_supabase_url(new_url: str):
    """Update VITE_SUPABASE_URL in .env.local"""
    env_file = Path('.env.local')
    
    if not env_file.exists():
        print("ERROR: .env.local not found")
        return False
    
    # Read current content
    content = env_file.read_text(encoding='utf-8')
    
    # Update or add VITE_SUPABASE_URL
    pattern = r'^VITE_SUPABASE_URL=.*$'
    if re.search(pattern, content, flags=re.MULTILINE):
        content = re.sub(pattern, f'VITE_SUPABASE_URL={new_url}', content, flags=re.MULTILINE)
        print(f"[OK] Updated VITE_SUPABASE_URL to: {new_url}")
    else:
        # Add if doesn't exist
        if not content.endswith('\n'):
            content += '\n'
        content += f'VITE_SUPABASE_URL={new_url}\n'
        print(f"[OK] Added VITE_SUPABASE_URL: {new_url}")
    
    # Also update SUPABASE_URL if it exists (for compatibility)
    pattern2 = r'^SUPABASE_URL=.*$'
    if re.search(pattern2, content, flags=re.MULTILINE):
        content = re.sub(pattern2, f'SUPABASE_URL={new_url}', content, flags=re.MULTILINE)
        print(f"[OK] Updated SUPABASE_URL to: {new_url}")
    
    # Write back
    env_file.write_text(content, encoding='utf-8')
    
    # Verify
    from dotenv import load_dotenv
    load_dotenv('.env.local', override=True)
    verified_url = os.getenv('VITE_SUPABASE_URL')
    
    if verified_url == new_url:
        print("[OK] Verification: URL loaded correctly")
        return True
    else:
        print(f"[WARN] Warning: Expected {new_url}, got {verified_url}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python update-supabase-url.py <supabase_url>")
        sys.exit(1)
    
    new_url = sys.argv[1].strip()
    
    if not new_url:
        print("ERROR: Empty URL provided")
        sys.exit(1)
    
    if update_supabase_url(new_url):
        print("\n[OK] URL update complete!")
        sys.exit(0)
    else:
        sys.exit(1)

