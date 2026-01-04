#!/usr/bin/env python3
"""
Automated image generation - checks setup and generates images
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent))

print("=" * 70)
print("Automated Image Generation".center(70))
print("=" * 70)
print()

# Import the generator
try:
    from generate_compendium_images import ImageGenerator
except ImportError:
    print("ERROR: Cannot import image generator")
    print("Make sure scripts/generate-compendium-images.py exists")
    sys.exit(1)

# Initialize generator
generator = ImageGenerator()

# Check if we can connect
print("Verifying setup...")
print()

# Test Hugging Face
hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
if not hf_token:
    print("ERROR: HUGGINGFACE_API_TOKEN not set")
    sys.exit(1)
print("[OK] Hugging Face token configured")

# Test Supabase
supabase_url = os.getenv("VITE_SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not supabase_url or not supabase_key:
    print("ERROR: Supabase credentials not set")
    sys.exit(1)
print("[OK] Supabase credentials configured")
print()

# Try to get entries
print("Checking for entries to process...")
entry_types = ["monsters", "equipment", "relics", "jobs"]

for entry_type in entry_types:
    try:
        entries = generator.get_entries_without_images(entry_type, limit=1)
        if entries:
            print(f"[OK] {entry_type}: {len(entries)} entries without images found")
        else:
            print(f"[INFO] {entry_type}: No entries without images (may need migrations or all have images)")
    except Exception as e:
        print(f"[WARN] {entry_type}: Error checking - {str(e)[:100]}")

print()

# Ask user what to generate
print("=" * 70)
print("Ready to Generate Images".center(70))
print("=" * 70)
print()

if len(sys.argv) > 1:
    entry_type = sys.argv[1].lower()
    batch_size = int(sys.argv[2]) if len(sys.argv) > 2 else 1
else:
    entry_type = "monsters"
    batch_size = 1

print(f"Generating images for: {entry_type}")
print(f"Batch size: {batch_size}")
print()

try:
    generator.generate_batch(entry_type, batch_size)
    print()
    print("=" * 70)
    print("Generation Complete!".center(70))
    print("=" * 70)
except Exception as e:
    print()
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

