#!/usr/bin/env python3
"""
Test script to validate image generation setup
Checks all dependencies and configuration
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from multiple locations
load_dotenv('.env.local', override=True)
load_dotenv('.env', override=False)
load_dotenv()  # Load from current directory

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("[FAIL] Python 3.8+ required")
        return False
    print(f"[OK] Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_packages():
    """Check required packages"""
    required = ['requests', 'PIL', 'dotenv']
    missing = []
    
    for package in required:
        try:
            if package == 'PIL':
                import PIL
            elif package == 'dotenv':
                from dotenv import load_dotenv
            else:
                __import__(package)
            print(f"[OK] {package} installed")
        except ImportError:
            print(f"[FAIL] {package} missing")
            missing.append(package)
    
    if missing:
        print(f"\nInstall missing packages: pip install {' '.join(missing)}")
        return False
    return True

def check_config_file():
    """Check config file exists"""
    config_file = Path(__file__).parent / "image-gen-config.json"
    if config_file.exists():
        print(f"[OK] Config file found: {config_file}")
        return True
    else:
        print(f"[FAIL] Config file not found: {config_file}")
        return False

def check_supabase_config():
    """Check Supabase configuration"""
    url = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if url:
        print(f"[OK] Supabase URL configured")
    else:
        print("[FAIL] Supabase URL not found (set VITE_SUPABASE_URL or SUPABASE_URL)")
    
    if key:
        print(f"[OK] Supabase Service Role Key configured")
    else:
        print("[FAIL] Supabase Service Role Key not found (set SUPABASE_SERVICE_ROLE_KEY)")
    
    return bool(url and key)

def check_stable_diffusion_config():
    """Check Stable Diffusion configuration"""
    hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
    api_url = os.getenv("STABLE_DIFFUSION_API_URL")
    cli_path = os.getenv("STABLE_DIFFUSION_CLI_PATH")
    
    # Check Hugging Face first (preferred)
    if hf_token:
        hf_model = os.getenv("HUGGINGFACE_MODEL", "stabilityai/stable-diffusion-xl-base-1.0")
        print(f"[OK] Hugging Face API configured (model: {hf_model})")
        return True
    elif api_url:
        print(f"[OK] Stable Diffusion API URL: {api_url}")
        print("   (Will test connection if server is running)")
        return True
    elif cli_path:
        print(f"[OK] Stable Diffusion CLI path: {cli_path}")
        return True
    else:
        print("[WARN] Stable Diffusion not configured")
        print("   Set HUGGINGFACE_API_TOKEN, STABLE_DIFFUSION_API_URL, or STABLE_DIFFUSION_CLI_PATH")
        return False

def test_supabase_connection():
    """Test Supabase connection"""
    url = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    # Check for placeholder values
    if url and ("your_" in url.lower() or not url.startswith("http")):
        print("[FAIL] Supabase URL contains placeholder value")
        print("   Update .env.local with your actual Supabase project URL")
        return False
    
    if not url or not key:
        return False
    
    # Check if this is a service role key or access token
    if key.startswith("sbp_"):
        print("[INFO] Using Supabase access token (sbp_ format)")
        print("[WARN] Service Role Key (JWT starting with eyJ) is recommended for admin operations")
    
    try:
        import requests
        # Try different auth methods based on key format
        if key.startswith("sb_secret_"):
            # New format - try Bearer first
            headers = {
                "Authorization": f"Bearer {key}",
                "apikey": key,
            }
        else:
            # Standard JWT format
            headers = {
                "apikey": key,
                "Authorization": f"Bearer {key}",
            }
        # Test connection with a simple query
        test_url = f"{url}/rest/v1/compendium_monsters?limit=1"
        response = requests.get(test_url, headers=headers, timeout=10)
        
        # If failed with sb_secret_, try Bearer only
        if response.status_code == 401 and key.startswith("sb_secret_"):
            headers = {"Authorization": f"Bearer {key}"}
            response = requests.get(test_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print("[OK] Supabase connection successful")
            # Also check if image_url column exists (migration status)
            test_url2 = f"{url}/rest/v1/compendium_monsters?select=id,image_url&limit=1"
            response2 = requests.get(test_url2, headers=headers, timeout=10)
            if response2.status_code == 200:
                print("[OK] Image columns exist (migrations applied)")
            elif response2.status_code == 400:
                error_text = response2.text.lower()
                if "column" in error_text and "does not exist" in error_text:
                    print("[WARN] Image columns missing - run migrations")
                    print("   Apply: scripts/apply-migrations.sql in Supabase SQL Editor")
            return True
        else:
            error_text = response.text[:200] if hasattr(response, 'text') else str(response.content[:200])
            print(f"[WARN] Supabase connection returned status {response.status_code}")
            print(f"   Error: {error_text[:100]}")
            if response.status_code == 401:
                print("[INFO] Authentication failed - check if token has correct permissions")
            return False
    except Exception as e:
        error_msg = str(e)
        if "Invalid URL" in error_msg or "No scheme" in error_msg:
            print("[FAIL] Supabase URL is invalid (should start with https://)")
        else:
            print(f"[FAIL] Supabase connection failed: {e}")
        return False

def test_stable_diffusion_api():
    """Test Stable Diffusion API if configured"""
    hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
    api_url = os.getenv("STABLE_DIFFUSION_API_URL")
    
    # Test Hugging Face API first (preferred)
    if hf_token:
        try:
            import requests
            model = os.getenv("HUGGINGFACE_MODEL", "stabilityai/stable-diffusion-xl-base-1.0")
            test_url = f"https://api-inference.huggingface.co/api/models/{model}"
            headers = {"Authorization": f"Bearer {hf_token}"}
            response = requests.get(test_url, headers=headers, timeout=10)
            if response.status_code in [200, 404]:  # 404 means model exists but might be loading
                print("[OK] Hugging Face API reachable and authenticated")
                return True
            else:
                print(f"[WARN] Hugging Face API returned {response.status_code}")
                return False
        except Exception as e:
            print(f"[WARN] Could not test Hugging Face API: {e}")
            return None
    
    # Test local API
    if not api_url:
        return None
    
    try:
        import requests
        # Try common health check endpoints
        for endpoint in ["/health", "/api/v1/health", "/"]:
            try:
                response = requests.get(f"{api_url}{endpoint}", timeout=3)
                if response.status_code == 200:
                    print(f"[OK] Stable Diffusion API reachable at {api_url}")
                    return True
            except:
                continue
        
        print(f"[WARN] Stable Diffusion API not responding at {api_url}")
        print("   Make sure the API server is running")
        return False
    except Exception as e:
        print(f"[WARN] Could not test Stable Diffusion API: {e}")
        return None

def main():
    print("=" * 60)
    print("Image Generation Setup Validation")
    print("=" * 60)
    print()
    
    checks = [
        ("Python Version", check_python_version),
        ("Required Packages", check_packages),
        ("Config File", check_config_file),
        ("Supabase Config", check_supabase_config),
        ("Stable Diffusion Config", check_stable_diffusion_config),
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\n[{name}]")
        result = check_func()
        results.append((name, result))
    
    # Connection tests
    print("\n[Connection Tests]")
    supabase_ok = test_supabase_connection()
    sd_ok = test_stable_diffusion_api()
    
    # Summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    
    all_passed = all(result for _, result in results)
    hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
    api_url = os.getenv("STABLE_DIFFUSION_API_URL")
    
    if all_passed and supabase_ok and (sd_ok is not False):
        print("[OK] Setup looks good! Ready to generate images.")
        print("\nNext steps:")
        if not hf_token and not api_url:
            print("  1. Configure image generation (Hugging Face or local API)")
        print("  2. Run: python scripts/generate-compendium-images.py monsters 1")
        return 0
    else:
        print("[WARN] Some checks failed. Please fix the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())

