#!/usr/bin/env python3
"""
Force generate a test image - bypasses connection checks
For testing when migrations might not be applied yet
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv('.env.local', override=True)

# Add scripts to path
sys.path.insert(0, str(Path(__file__).parent))

# Import the generator
from generate_compendium_images import ImageGenerator
import json

print("=" * 70)
print("Force Generate Test Image".center(70))
print("=" * 70)
print()

# Initialize generator
generator = ImageGenerator()

# Test Hugging Face API directly
print("Testing Hugging Face API...")
try:
    hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
    if not hf_token:
        print("ERROR: HUGGINGFACE_API_TOKEN not set")
        sys.exit(1)
    
    model = os.getenv("HUGGINGFACE_MODEL", "stabilityai/stable-diffusion-xl-base-1.0")
    test_prompt = "Solo Leveling manwha style, painterly, high detail, epic fantasy, dark fantasy, a shadow monarch character, dramatic lighting, intricate, cinematic"
    
    print(f"Model: {model}")
    print(f"Prompt: {test_prompt[:80]}...")
    print()
    
    # Generate test image
    print("Generating test image...")
    image_data = generator.generate_image_huggingface(test_prompt, 1024, 1024)
    
    if image_data:
        print(f"✅ Image generated! Size: {len(image_data)} bytes")
        
        # Save locally for testing
        test_path = Path(__file__).parent.parent / "test-generated-image.png"
        with open(test_path, 'wb') as f:
            f.write(image_data)
        print(f"✅ Saved test image to: {test_path}")
        print()
        print("Hugging Face API is working! ✅")
        print()
        print("Next: Apply migrations and generate images:")
        print("  1. Apply: scripts/complete-setup-all.sql in Supabase")
        print("  2. Generate: python scripts/generate-compendium-images.py monsters 1")
    else:
        print("❌ Image generation failed")
        sys.exit(1)
        
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

