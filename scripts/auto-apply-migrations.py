#!/usr/bin/env python3
"""
Automatically apply database migrations for image generation
This script applies the migrations via Supabase REST API
"""

import os
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment
load_dotenv('.env.local', override=True)
load_dotenv('.env', override=False)
load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def check_placeholder_values():
    """Check if credentials are placeholders"""
    if not SUPABASE_URL or "your_" in SUPABASE_URL.lower():
        print("[FAIL] Error: VITE_SUPABASE_URL contains placeholder value")
        print("   Please update .env.local with your actual Supabase URL")
        return False
    
    if not SUPABASE_KEY or "your_" in SUPABASE_KEY.lower():
        print("[FAIL] Error: SUPABASE_SERVICE_ROLE_KEY contains placeholder value")
        print("   Please update .env.local with your actual Service Role Key")
        return False
    
    return True

def execute_sql(sql: str) -> bool:
    """Execute SQL via Supabase REST API (using RPC if available)"""
    # Note: Supabase REST API doesn't directly support arbitrary SQL execution
    # We'll need to use the SQL Editor or Supabase CLI
    # This is a placeholder that explains the limitation
    print("⚠️  Direct SQL execution via REST API is not supported.")
    print("   Please apply migrations manually via Supabase Dashboard SQL Editor")
    return False

def check_migration_status() -> dict:
    """Check if migrations have been applied by querying for columns"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return {"error": "Credentials not configured"}
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    results = {}
    tables = {
        "compendium_monsters": "monsters",
        "compendium_equipment": "equipment",
        "compendium_relics": "relics",
        "compendium_jobs": "jobs"
    }
    
    for table, name in tables.items():
        try:
            # Try to query image_url column
            url = f"{SUPABASE_URL}/rest/v1/{table}?select=id,image_url&limit=1"
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                results[name] = "applied"
            elif response.status_code == 400:
                error_text = response.text.lower()
                if "column" in error_text and "does not exist" in error_text:
                    results[name] = "missing"
                else:
                    results[name] = f"error: {response.status_code}"
            else:
                results[name] = f"error: {response.status_code}"
        except Exception as e:
            results[name] = f"exception: {str(e)[:50]}"
    
    return results

def main():
    print("=" * 60)
    print("Image Generation Migrations - Status Check".center(60))
    print("=" * 60)
    print()
    
    if not check_placeholder_values():
        print("\n📋 Please update .env.local with your actual Supabase credentials")
        print("   Get them from: Supabase Dashboard → Settings → API")
        return 1
    
    print("[OK] Credentials configured")
    print("\nChecking migration status...\n")
    
    status = check_migration_status()
    
    all_applied = True
    for table, status_text in status.items():
            if status_text == "applied":
                print(f"[OK] {table}: migrations applied")
            elif status_text == "missing":
                print(f"[FAIL] {table}: migrations NOT applied")
                all_applied = False
            else:
                print(f"[WARN] {table}: {status_text}")
                all_applied = False
    
    print()
    if all_applied:
        print("[OK] All migrations are applied!")
        print("   You're ready to generate images!")
        return 0
    else:
        print("[WARN] Some migrations are missing")
        print("\n📋 To apply migrations:")
        print("   1. Open Supabase Dashboard → SQL Editor")
        print("   2. Copy/paste contents of: scripts/apply-migrations.sql")
        print("   3. Click 'Run'")
        print("\n   OR use Supabase CLI:")
        print("   supabase migration up")
        return 1

if __name__ == "__main__":
    sys.exit(main())

