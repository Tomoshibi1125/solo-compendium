#!/usr/bin/env python3
"""
Compendium Image Generation Script
Generates images for compendium entries using Stable Diffusion
"""

import os
import json
import sys
import time
import requests
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from urllib.parse import urlparse

try:
    from PIL import Image
    import io
    from dotenv import load_dotenv
except ImportError as e:
    print(f"Error: Missing required package: {e}")
    print("Install with: pip install pillow requests python-dotenv")
    sys.exit(1)

# Try to import Hugging Face Inference SDK
try:
    from huggingface_hub import InferenceClient
    HAS_HF_SDK = True
except ImportError:
    HAS_HF_SDK = False

# Try to import OpenAI for DALL-E
try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

# Load environment variables from multiple locations
# Try .env.local first (if exists), then .env
load_dotenv('.env.local', override=False)
load_dotenv('.env', override=False)
load_dotenv()  # Load from current directory

# Configuration
CONFIG_FILE = Path(__file__).parent / "image-gen-config.json"
# Try both VITE_SUPABASE_URL and SUPABASE_URL (for compatibility)
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
STABLE_DIFFUSION_API_URL = os.getenv("STABLE_DIFFUSION_API_URL")
STABLE_DIFFUSION_CLI_PATH = os.getenv("STABLE_DIFFUSION_CLI_PATH", "python")
STABLE_DIFFUSION_MODEL = os.getenv("STABLE_DIFFUSION_MODEL", "stable-diffusion-xl-base-1.0")
# Hugging Face Inference API
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")
HUGGINGFACE_MODEL = os.getenv("HUGGINGFACE_MODEL", "stabilityai/stable-diffusion-xl-base-1.0")
# OpenAI DALL-E (fallback)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("CHATGPT_API_KEY")

# Load config
try:
    with open(CONFIG_FILE, "r") as f:
        config = json.load(f)
except FileNotFoundError:
    print(f"Error: Config file not found: {CONFIG_FILE}")
    sys.exit(1)

class ImageGenerator:
    def __init__(self):
        self.supabase_url = SUPABASE_URL
        self.supabase_key = SUPABASE_KEY
        self.config = config
        
    def generate_prompt(self, entry: Dict, entry_type: str) -> str:
        """Generate a prompt based on entry metadata"""
        template = self.config["prompt_templates"].get(entry_type, "{name}, {description}")
        
        # Extract relevant fields
        name = entry.get("name", "")
        description = entry.get("description", "")[:200]  # Limit description length
        tags = ", ".join(entry.get("tags", [])[:5]) if entry.get("tags") else ""
        
        # Type-specific fields
        gate_rank = entry.get("gate_rank", "")
        rarity = entry.get("rarity", "")
        equipment_type = entry.get("equipment_type", "")
        
        # Build prompt
        prompt = template.format(
            name=name,
            description=description,
            gate_rank=gate_rank,
            rarity=rarity,
            equipment_type=equipment_type,
            tags=tags
        )
        
        # Add base prompt
        full_prompt = f"{self.config['base_prompt']}, {prompt}"
        
        return full_prompt
    
    def generate_image_api(self, prompt: str, width: int = 1024, height: int = 1024) -> Optional[bytes]:
        """Generate image using Stable Diffusion API"""
        if not STABLE_DIFFUSION_API_URL:
            return None
            
        try:
            payload = {
                "prompt": prompt,
                "negative_prompt": self.config["negative_prompt"],
                "width": width,
                "height": height,
                "num_inference_steps": self.config["generation"]["steps"],
                "guidance_scale": self.config["generation"]["guidance_scale"],
            }
            
            # Try A1111 WebUI API format first (most common)
            base_url = STABLE_DIFFUSION_API_URL.rstrip('/')
            url = f"{base_url}/sdapi/v1/txt2img"
            a1111_payload = {
                "prompt": prompt,
                "negative_prompt": self.config["negative_prompt"],
                "width": width,
                "height": height,
                "steps": self.config["generation"]["steps"],
                "cfg_scale": self.config["generation"]["guidance_scale"],
                "sampler_index": "DPM++ 2M Karras",
            }
            
            print(f"Calling Stable Diffusion API: {url}")
            try:
                response = requests.post(url, json=a1111_payload, timeout=300)
                if response.status_code == 200:
                    result = response.json()
                    # A1111 returns base64 encoded image in "images" array
                    if "images" in result and len(result["images"]) > 0:
                        import base64
                        image_data = base64.b64decode(result["images"][0])
                        print(f"Generated image: {len(image_data)} bytes")
                        return image_data
                    elif "image" in result:
                        # Some APIs return direct image
                        import base64
                        image_data = base64.b64decode(result["image"])
                        return image_data
                    else:
                        print(f"Unexpected API response format: {list(result.keys())}")
                        return None
                else:
                    print(f"A1111 API returned {response.status_code}, trying alternative format...")
            except Exception as e:
                print(f"A1111 API call failed: {e}, trying alternative format...")
            
            # Fallback to generic API format
            alt_url = f"{base_url}/api/v1/generate"
            response = requests.post(alt_url, json=payload, timeout=300)
            
            if response.status_code == 200:
                return response.content
            else:
                error_text = response.text[:200] if hasattr(response, 'text') else str(response.content[:200])
                print(f"API error {response.status_code}: {error_text}")
                return None
                
        except Exception as e:
            print(f"Error calling API: {e}")
            return None
    
    def generate_image_cli(self, prompt: str, width: int = 1024, height: int = 1024) -> Optional[bytes]:
        """Generate image using Stable Diffusion CLI"""
        # This is a placeholder - actual implementation depends on your CLI setup
        # You would need to adapt this to your specific Stable Diffusion CLI
        print("CLI generation not yet implemented")
        return None
    
    def generate_image_huggingface(self, prompt: str, width: int = 1024, height: int = 1024) -> Optional[bytes]:
        """Generate image using Hugging Face Inference API"""
        if not HUGGINGFACE_TOKEN:
            return None
        
        try:
            model = HUGGINGFACE_MODEL
            
            # Use Hugging Face Inference SDK if available (preferred method)
            if HAS_HF_SDK:
                print(f"Using Hugging Face Inference SDK: {model}")
                try:
                    client = InferenceClient(
                        model=model,
                        token=HUGGINGFACE_TOKEN
                    )
                    
                    # Build parameters for text-to-image
                    parameters = {
                        "negative_prompt": self.config["negative_prompt"],
                        "width": width,
                        "height": height,
                        "num_inference_steps": self.config["generation"]["steps"],
                        "guidance_scale": self.config["generation"]["guidance_scale"],
                    }
                    
                    # Generate image using SDK
                    print(f"Generating image with prompt: {prompt[:80]}...")
                    image = client.text_to_image(
                        prompt=prompt,
                        **parameters
                    )
                    
                    # Convert PIL Image to bytes
                    img_bytes = io.BytesIO()
                    image.save(img_bytes, format='PNG')
                    image_data = img_bytes.getvalue()
                    print(f"Generated image: {len(image_data)} bytes")
                    return image_data
                    
                except Exception as e:
                    print(f"Hugging Face SDK error: {e}")
                    print("Falling back to REST API...")
                    # Fall through to REST API method
            
            # Fallback to REST API if SDK fails or is not available
            print(f"Using Hugging Face REST API: {model}")
            
            # Use the correct inference API endpoint
            url = f"https://api-inference.huggingface.co/models/{model}"
            
            headers = {
                "Authorization": f"Bearer {HUGGINGFACE_TOKEN}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "negative_prompt": self.config["negative_prompt"],
                    "width": width,
                    "height": height,
                    "num_inference_steps": self.config["generation"]["steps"],
                    "guidance_scale": self.config["generation"]["guidance_scale"],
                }
            }
            
            print(f"Calling Hugging Face API: {model}")
            response = requests.post(url, headers=headers, json=payload, timeout=300)
            
            if response.status_code == 200:
                # HF API returns image bytes directly
                image_data = response.content
                print(f"Generated image: {len(image_data)} bytes")
                return image_data
            elif response.status_code == 503:
                # Model is loading, wait and retry
                print("Model is loading, waiting 10 seconds...")
                time.sleep(10)
                response = requests.post(url, headers=headers, json=payload, timeout=300)
                if response.status_code == 200:
                    image_data = response.content
                    return image_data
                else:
                    print(f"Hugging Face API error after retry: {response.status_code}")
                    error_text = response.text[:200] if hasattr(response, 'text') else str(response.content[:200])
                    print(f"Error: {error_text}")
                    return None
            else:
                error_text = response.text[:200] if hasattr(response, 'text') else str(response.content[:200])
                print(f"Hugging Face API error {response.status_code}: {error_text}")
                return None
                
        except Exception as e:
            error_msg = str(e)
            # Check for credit/quota errors specifically
            if "quota" in error_msg.lower() or "credit" in error_msg.lower() or "limit" in error_msg.lower():
                print(f"Hugging Face credit/quota issue detected: {error_msg[:100]}")
            else:
                print(f"Error calling Hugging Face API: {e}")
            return None
    
    def generate_image_dalle(self, prompt: str, width: int = 1024, height: int = 1024) -> Optional[bytes]:
        """Generate image using OpenAI DALL-E 3"""
        if not OPENAI_API_KEY or not HAS_OPENAI:
            return None
        
        try:
            print(f"Using OpenAI DALL-E 3")
            
            client = OpenAI(api_key=OPENAI_API_KEY)
            
            # DALL-E 3 size options: "1024x1024", "1792x1024", "1024x1792"
            # Map our width/height to DALL-E sizes
            if width == 1024 and height == 1024:
                size = "1024x1024"
            elif width >= height:
                size = "1792x1024"  # Landscape
            else:
                size = "1024x1792"  # Portrait
            
            # DALL-E 3 quality options: "standard" or "hd"
            quality = "hd"  # High quality for better results
            
            # Optimize prompt for DALL-E while maintaining Solo Leveling style
            # DALL-E works best with clear, concise prompts but we want to keep the style
            simplified_prompt = prompt
            
            # Ensure Solo Leveling style is prominent
            if "Solo Leveling" not in prompt:
                # Add Solo Leveling style prefix
                simplified_prompt = f"Solo Leveling manhwa style, {prompt}"
            
            # Keep the full prompt but trim if too long (DALL-E limit is 4000 chars, but 1000 is optimal)
            if len(simplified_prompt) > 1000:
                # Try to keep the important parts: style, name, description, tags
                # Split and take first part with important keywords
                parts = simplified_prompt.split(',')
                important = []
                keywords = ['Solo Leveling', 'manhwa', 'painterly', 'dark fantasy']
                
                # Always keep parts with keywords
                for part in parts:
                    if any(kw.lower() in part.lower() for kw in keywords):
                        important.append(part.strip())
                
                # Add remaining parts until we hit limit
                for part in parts:
                    if part.strip() not in important and len(', '.join(important + [part.strip()])) < 1000:
                        important.append(part.strip())
                
                simplified_prompt = ', '.join(important)
                if len(simplified_prompt) > 1000:
                    simplified_prompt = simplified_prompt[:1000]
            
            # Ensure painterly style is mentioned
            if "painterly" not in simplified_prompt.lower():
                simplified_prompt = f"painterly artwork, {simplified_prompt}"
            
            print(f"Generating image with DALL-E 3: {simplified_prompt[:80]}...")
            
            response = client.images.generate(
                model="dall-e-3",
                prompt=simplified_prompt,
                size=size,
                quality=quality,
                n=1,  # DALL-E 3 only supports 1 image at a time
            )
            
            # Get image URL
            image_url = response.data[0].url
            
            # Download image
            print(f"Downloading image from DALL-E...")
            img_response = requests.get(image_url, timeout=60)
            if img_response.status_code == 200:
                image_data = img_response.content
                print(f"Generated image: {len(image_data)} bytes")
                return image_data
            else:
                print(f"Failed to download image: {img_response.status_code}")
                return None
                
        except Exception as e:
            error_msg = str(e)
            # Check for credit/quota errors
            if "insufficient_quota" in error_msg.lower() or "quota" in error_msg.lower():
                print(f"DALL-E quota/credit error: {error_msg[:100]}")
            elif "rate_limit" in error_msg.lower() or "rate" in error_msg.lower():
                print(f"DALL-E rate limit error: {error_msg[:100]}")
                print("Waiting 60 seconds before retry...")
                time.sleep(60)
                # Retry once after waiting
                try:
                    response = client.images.generate(
                        model="dall-e-3",
                        prompt=simplified_prompt,
                        size=size,
                        quality=quality,
                        n=1,
                    )
                    image_url = response.data[0].url
                    img_response = requests.get(image_url, timeout=60)
                    if img_response.status_code == 200:
                        image_data = img_response.content
                        print(f"Generated image: {len(image_data)} bytes")
                        return image_data
                except Exception as retry_e:
                    print(f"Retry also failed: {str(retry_e)[:100]}")
            else:
                print(f"Error calling DALL-E API: {error_msg[:200]}")
            return None
    
    def generate_image(self, prompt: str, width: int = 1024, height: int = 1024) -> Optional[bytes]:
        """Generate image using DALL-E only"""
        # Use DALL-E only
        if not OPENAI_API_KEY:
            print("Error: OPENAI_API_KEY not configured. DALL-E requires an API key.")
            return None
        
        result = self.generate_image_dalle(prompt, width, height)
        if result:
            return result
        
        print("Error: DALL-E image generation failed")
        return None
    
    def optimize_image(self, image_data: bytes, quality: int = 95) -> bytes:
        """Optimize image for web"""
        try:
            img = Image.open(io.BytesIO(image_data))
            
            # Convert RGBA to RGB if necessary (for JPEG)
            if img.mode == 'RGBA':
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])
                img = background
            
            # Resize if too large
            max_size = 2048
            if img.width > max_size or img.height > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
            # Save as optimized PNG
            output = io.BytesIO()
            img.save(output, format='PNG', optimize=True)
            return output.getvalue()
            
        except Exception as e:
            print(f"Error optimizing image: {e}")
            return image_data
    
    def upload_to_storage(self, image_data: bytes, path: str) -> Optional[str]:
        """Upload image to Supabase Storage"""
        if not self.supabase_url or not self.supabase_key:
            return None
            
        try:
            bucket = self.config["storage"]["bucket"]
            
            # Upload image using REST API
            # Note: Path needs to be URL-encoded
            from urllib.parse import quote
            encoded_path = quote(path)
            url = f"{self.supabase_url}/storage/v1/object/{bucket}/{encoded_path}"
            
            # Handle different key formats
            if self.supabase_key.startswith("sb_secret_"):
                # New format - may need different auth
                headers = {
                    "Authorization": f"Bearer {self.supabase_key}",
                    "apikey": self.supabase_key,
                    "Content-Type": "image/png",
                    "x-upsert": "true",
                    "Cache-Control": "public, max-age=3600"
                }
            else:
                # Standard JWT format
                headers = {
                    "apikey": self.supabase_key,
                    "Authorization": f"Bearer {self.supabase_key}",
                    "Content-Type": "image/png",
                    "x-upsert": "true",
                    "Cache-Control": "public, max-age=3600"
                }
            
            response = requests.post(url, headers=headers, data=image_data)
            
            if response.status_code not in [200, 201]:
                error_text = response.text[:500] if hasattr(response, 'text') else str(response.content[:500])
                print(f"Upload error {response.status_code}: {error_text}")
                # Try alternative auth method for sb_secret_ format
                if response.status_code == 401 and self.supabase_key.startswith("sb_secret_"):
                    print("Trying alternative authentication method...")
                    headers = {
                        "Authorization": f"Bearer {self.supabase_key}",
                        "Content-Type": "image/png",
                        "x-upsert": "true"
                    }
                    response = requests.post(url, headers=headers, data=image_data)
                    if response.status_code not in [200, 201]:
                        error_text = response.text[:500] if hasattr(response, 'text') else str(response.content[:500])
                        print(f"Alternative auth also failed: {error_text}")
                        response.raise_for_status()
                else:
                    response.raise_for_status()
            
            # Get public URL (no need to encode for public URL)
            public_url = f"{self.supabase_url}/storage/v1/object/public/{bucket}/{path}"
            return public_url
            
        except Exception as e:
            print(f"Error uploading to storage: {e}")
            return None
    
    def update_entry_image(self, table: str, entry_id: str, image_url: str) -> bool:
        """Update entry with image URL"""
        if not self.supabase_url or not self.supabase_key:
            return False
        
        # Check for placeholder values
        if "your_" in self.supabase_url.lower() or "your_" in (self.supabase_key or "").lower():
            print("Error: Placeholder values detected in environment variables!")
            print("Please update .env.local with your actual Supabase credentials.")
            return False
            
        try:
            # Use PostgREST filter syntax: ?id=eq.{entry_id}
            url = f"{self.supabase_url}/rest/v1/{table}?id=eq.{entry_id}"
            
            # Handle different key formats
            if self.supabase_key.startswith("sb_secret_"):
                headers = {
                    "Authorization": f"Bearer {self.supabase_key}",
                    "apikey": self.supabase_key,
                    "Content-Type": "application/json",
                    "Prefer": "return=representation",
                    "Accept": "application/json"
                }
            else:
                headers = {
                    "apikey": self.supabase_key,
                    "Authorization": f"Bearer {self.supabase_key}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation",
                    "Accept": "application/json"
                }
            data = {
                "image_url": image_url,
                "image_generated_at": datetime.utcnow().isoformat() + "Z"
            }
            
            response = requests.patch(url, headers=headers, json=data)
            
            if response.status_code not in [200, 204]:
                error_text = response.text[:500] if hasattr(response, 'text') else str(response.content[:500])
                print(f"Update error {response.status_code}: {error_text}")
                response.raise_for_status()
            
            result = response.json() if response.content else []
            return bool(result)
            
        except Exception as e:
            print(f"Error updating entry: {e}")
            return False
    
    def get_entries_without_images(self, entry_type: str, limit: int = 10) -> List[Dict]:
        """Get entries that don't have images yet"""
        if not self.supabase_url or not self.supabase_key:
            print("Warning: Supabase credentials not configured")
            return []
        
        # Check for placeholder values
        if "your_" in self.supabase_url.lower() or "your_" in self.supabase_key.lower():
            print("Error: Placeholder values detected in environment variables!")
            print("Please update .env.local with your actual Supabase credentials.")
            return []
            
        try:
            table_map = {
                "monsters": "compendium_monsters",
                "equipment": "compendium_equipment",
                "relics": "compendium_relics",
                "jobs": "compendium_jobs",
            }
            
            table = table_map.get(entry_type)
            if not table:
                return []
            
            # Query entries without images using REST API (PostgREST)
            url = f"{self.supabase_url}/rest/v1/{table}"
            
            # Handle different key formats
            if self.supabase_key.startswith("sb_secret_"):
                # New format - try different auth headers
                headers = {
                    "Authorization": f"Bearer {self.supabase_key}",
                    "apikey": self.supabase_key,
                    "Content-Type": "application/json",
                    "Prefer": "return=representation",
                    "Accept": "application/json"
                }
            else:
                # Standard JWT format
                headers = {
                    "apikey": self.supabase_key,
                    "Authorization": f"Bearer {self.supabase_key}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation",
                    "Accept": "application/json"
                }
            
            # PostgREST filter: image_url=is.null
            # Get more entries than needed and filter in Python (more reliable)
            params = {
                "select": "*",
                "limit": str(min(limit * 3, 1000))  # Get more to filter nulls
            }
            
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            
            entries = response.json() if response.json() else []
            # Filter entries without images
            filtered = [e for e in entries if not e.get("image_url")][:limit]
            
            return filtered
            
        except Exception as e:
            print(f"Error fetching entries: {e}")
            return []
    
    def generate_for_entry(self, entry: Dict, entry_type: str) -> bool:
        """Generate and upload image for a single entry"""
        print(f"\nGenerating image for {entry_type}: {entry.get('name', 'Unknown')}")
        
        # Generate prompt
        prompt = self.generate_prompt(entry, entry_type)
        print(f"Prompt: {prompt[:100]}...")
        
        # Get dimensions
        dims = self.config["dimensions"]["detail"]
        width = dims["width"]
        height = dims["height"]
        
        # Generate image (with retry)
        image_data = None
        for attempt in range(self.config["retry"]["max_attempts"]):
            try:
                image_data = self.generate_image(prompt, width, height)
                if image_data:
                    break
            except Exception as e:
                print(f"Attempt {attempt + 1} failed: {e}")
                if attempt < self.config["retry"]["max_attempts"] - 1:
                    time.sleep(self.config["retry"]["delay_seconds"])
        
        if not image_data:
            print(f"Failed to generate image after {self.config['retry']['max_attempts']} attempts")
            return False
        
        # Optimize image
        print("Optimizing image...")
        image_data = self.optimize_image(image_data)
        
        # Generate storage path
        entry_id = entry["id"]
        name_slug = entry.get("name", "unknown").lower().replace(" ", "-").replace("/", "-")
        path = f"{entry_type}/{entry_id}-{name_slug}.png"
        
        # Upload to storage
        print(f"Uploading to storage: {path}")
        image_url = self.upload_to_storage(image_data, path)
        
        if not image_url:
            print("Failed to upload image")
            return False
        
        # Update entry
        table_map = {
            "monsters": "compendium_monsters",
            "equipment": "compendium_equipment",
            "relics": "compendium_relics",
            "jobs": "compendium_jobs",
        }
        table = table_map.get(entry_type)
        
        if self.update_entry_image(table, entry_id, image_url):
            print(f"✓ Successfully generated and uploaded image for {entry.get('name')}")
            return True
        else:
            print("Failed to update entry with image URL")
            return False
    
    def generate_batch(self, entry_type: str, batch_size: int = None):
        """Generate images for a batch of entries"""
        batch_size = batch_size or self.config["batch"]["size"]
        
        print(f"\n=== Generating images for {entry_type} ===")
        entries = self.get_entries_without_images(entry_type, batch_size)
        
        if not entries:
            print(f"No entries without images found for {entry_type}")
            return
        
        print(f"Found {len(entries)} entries to process")
        
        success_count = 0
        for i, entry in enumerate(entries, 1):
            print(f"\n[{i}/{len(entries)}] Processing entry...")
            
            if self.generate_for_entry(entry, entry_type):
                success_count += 1
            
            # Delay between requests
            if i < len(entries):
                time.sleep(self.config["batch"]["delay_seconds"])
        
        print(f"\n=== Completed: {success_count}/{len(entries)} images generated ===")

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: python generate-compendium-images.py <entry_type> [batch_size]")
        print("Entry types: monsters, equipment, relics, jobs")
        sys.exit(1)
    
    entry_type = sys.argv[1].lower()
    batch_size = int(sys.argv[2]) if len(sys.argv) > 2 else None
    
    if entry_type not in ["monsters", "equipment", "relics", "jobs"]:
        print(f"Error: Invalid entry type: {entry_type}")
        sys.exit(1)
    
    generator = ImageGenerator()
    generator.generate_batch(entry_type, batch_size)

if __name__ == "__main__":
    main()

