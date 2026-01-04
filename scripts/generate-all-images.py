#!/usr/bin/env python3
"""
Generate images for ALL entries until complete
Runs continuously until all entries have images
"""

import os
import sys
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

# Fix Unicode encoding for Windows
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv('.env.local', override=True)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials")
    sys.exit(1)

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def count_entries_without_images(table_name: str) -> int:
    """Count entries without images"""
    try:
        # Get count using PostgREST
        url = f"{SUPABASE_URL}/rest/v1/{table_name}"
        params = {
            "select": "id",
            "image_url": "is.null"
        }
        response = requests.get(
            url,
            headers={**headers, "Prefer": "count=exact"},
            params=params,
            timeout=10
        )
        
        if response.status_code == 200:
            # Get count from content-range header
            content_range = response.headers.get('content-range', '')
            if '/' in content_range:
                total = int(content_range.split('/')[-1])
                return total
            else:
                # Fallback: count results
                return len(response.json()) if response.json() else 0
        return 0
    except Exception as e:
        print(f"Error counting {table_name}: {e}")
        return 0

def get_total_counts():
    """Get counts for all entry types"""
    tables = {
        "monsters": "compendium_monsters",
        "equipment": "compendium_equipment",
        "relics": "compendium_relics",
        "jobs": "compendium_jobs",
    }
    
    counts = {}
    for entry_type, table_name in tables.items():
        counts[entry_type] = count_entries_without_images(table_name)
    return counts

# Import image generator
sys.path.insert(0, str(Path(__file__).parent))

try:
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "generate_compendium_images",
        Path(__file__).parent / "generate-compendium-images.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    ImageGenerator = module.ImageGenerator
except Exception as e:
    print(f"ERROR: Could not import image generator: {e}")
    sys.exit(1)

print("=" * 70)
print("GENERATE ALL IMAGES - UNTIL COMPLETE".center(70))
print("=" * 70)
print()

generator = ImageGenerator()

# Batch size per run
BATCH_SIZE = 20  # Process 20 at a time

entry_types = ["monsters", "equipment", "relics", "jobs"]

total_generated = 0
iteration = 0

while True:
    iteration += 1
    print(f"\n{'=' * 70}")
    print(f"ITERATION {iteration}".center(70))
    print('=' * 70)
    print()
    
    # Check remaining counts
    counts = get_total_counts()
    total_remaining = sum(counts.values())
    
    print("Remaining entries without images:")
    for entry_type, count in counts.items():
        if count > 0:
            print(f"  {entry_type.upper()}: {count}")
    
    print(f"\nTotal remaining: {total_remaining}")
    
    if total_remaining == 0:
        print("\n" + "=" * 70)
        print("🎉 ALL IMAGES GENERATED!".center(70))
        print("=" * 70)
        print()
        print(f"Total images generated in this session: {total_generated}")
        print()
        break
    
    print(f"\nProcessing batch of {BATCH_SIZE} entries per type...")
    print()
    
    iteration_generated = 0
    
    for entry_type in entry_types:
        remaining = counts[entry_type]
        if remaining == 0:
            print(f"\n[{entry_type.upper()}] All entries have images - skipping")
            continue
        
        # Process batch
        batch_size = min(BATCH_SIZE, remaining)
        print(f"\n{'=' * 70}")
        print(f"Processing {entry_type.upper()} ({batch_size} entries)".center(70))
        print('=' * 70)
        print()
        
        entries = generator.get_entries_without_images(entry_type, batch_size)
        
        if not entries:
            print(f"[INFO] No {entry_type} without images found")
            continue
        
        print(f"[INFO] Found {len(entries)} {entry_type} entries to process")
        
        success_count = 0
        for i, entry in enumerate(entries, 1):
            print(f"\n[{i}/{len(entries)}] Processing {entry_type}: {entry.get('name', 'Unknown')}")
            
            # Show tags
            entry_tags = entry.get("tags", [])
            if entry_tags:
                tag_str = ", ".join(entry_tags[:5])
                print(f"       Tags: {tag_str}")
            
            if generator.generate_for_entry(entry, entry_type):
                success_count += 1
                iteration_generated += 1
                total_generated += 1
            
            # Delay between requests (DALL-E needs more time to avoid rate limits)
            if i < len(entries):
                delay = 5  # 5 seconds between DALL-E requests to avoid rate limits
                time.sleep(delay)
        
        print(f"\n[✓] {entry_type}: {success_count}/{len(entries)} images generated")
    
    print(f"\n[✓] Iteration {iteration} complete: {iteration_generated} images generated")
    print(f"[✓] Total generated so far: {total_generated}")
    
    # Wait before next iteration
    if total_remaining > 0:
        print("\nWaiting 5 seconds before next batch...")
        time.sleep(5)

print("\n" + "=" * 70)
print("SESSION COMPLETE".center(70))
print("=" * 70)
print()
print(f"Total images generated: {total_generated}")
print()

