#!/usr/bin/env python3
"""
Complete Image Generation Runner
Ensures all images are generated and placed correctly
"""

import sys
import subprocess
import time
from pathlib import Path

print("=" * 70)
print("COMPLETE IMAGE GENERATION - STARTING".center(70))
print("=" * 70)
print()

# Run the generation script
script_path = Path(__file__).parent / "generate-all-images.py"

try:
    print("Starting image generation process...")
    print("This will generate all remaining images using DALL-E 3")
    print("Progress will be displayed as images are generated")
    print()
    
    # Run the script directly
    process = subprocess.Popen(
        [sys.executable, str(script_path)],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        universal_newlines=True
    )
    
    # Stream output
    for line in process.stdout:
        print(line, end='')
        sys.stdout.flush()
    
    process.wait()
    
    if process.returncode == 0:
        print()
        print("=" * 70)
        print("IMAGE GENERATION COMPLETE!".center(70))
        print("=" * 70)
    else:
        print()
        print("=" * 70)
        print(f"Process exited with code {process.returncode}".center(70))
        print("=" * 70)
        
except KeyboardInterrupt:
    print("\n\nGeneration interrupted by user")
    sys.exit(1)
except Exception as e:
    print(f"\n\nError running generation: {e}")
    sys.exit(1)

