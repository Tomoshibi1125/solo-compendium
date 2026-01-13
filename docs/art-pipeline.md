# Solo Compendium Art Pipeline - Stable Diffusion Setup

## Overview
Local Stable Diffusion art generation using ComfyUI for consistent Solo Leveling themed artwork.

## Prerequisites
- Windows PC with GPU (NVIDIA CUDA preferred, DirectML fallback)
- 8GB+ RAM minimum (16GB+ recommended)
- 10GB+ free disk space

## Installation Steps

### 1. GPU Detection & Setup

#### NVIDIA CUDA (Recommended)
```powershell
# Check CUDA availability
nvidia-smi

# If no CUDA, install NVIDIA drivers + CUDA Toolkit
# Download from: https://developer.nvidia.com/cuda-downloads
```

#### DirectML Fallback (AMD/Intel)
```powershell
# DirectML works with most GPUs
# No additional setup required
```

### 2. Install ComfyUI

```powershell
# Clone ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Install Python dependencies
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# For DirectML support (if needed)
pip install onnxruntime-directml
```

### 3. Download Models

Create folders in `ComfyUI/models/`:
```
ComfyUI/
├── models/
│   ├── checkpoints/
│   │   ├── sdxl_base_1.0.safetensors
│   │   └── sdxl_refiner_1.0.safetensors
│   ├── vae/
│   │   └── sdxl_vae.safetensors
│   └── ipadapter/
│       └── ip-adapter_sdxl.bin
```

#### Model Downloads
- **SDXL Base**: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
- **SDXL Refiner**: https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0
- **VAE**: https://huggingface.be/stabilityai/sdxl-vae
- **IP-Adapter**: https://huggingface.co/h94/IP-Adapter

### 4. Start ComfyUI Server

```powershell
# CUDA mode (default)
.\venv\Scripts\activate
python main.py --listen 0.0.0.0 --port 8188

# DirectML mode
.\venv\Scripts\activate
python main.py --directml --listen 0.0.0.0 --port 8188
```

### 5. Health Check

Verify ComfyUI is running:
```powershell
curl http://localhost:8188/system_stats
```

Expected response:
```json
{
  "system": {
    "devices": [...],
    "python_version": "...",
    "version": "..."
  }
}
```

## Art Pipeline Integration

### Workflow Files
Place workflow JSONs in `art/workflows/`:
- `sdxl_text2image.json` - Basic text-to-image
- `sdxl_img2img.json` - Image-to-image with style reference
- `style_reference.json` - IP-Adapter style transfer

### Style Reference
Place style anchor image at `art/style_refs/system_style_anchor.jpg`

### API Endpoints
- `POST http://localhost:8188/prompt` - Submit generation job
- `GET http://localhost:8188/history/{prompt_id}` - Check status
- `GET http://localhost:8188/view?filename={filename}` - Download result

## Troubleshooting

### CUDA Issues
```powershell
# Check CUDA installation
nvidia-smi
nvcc --version

# Reinstall PyTorch with CUDA
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### Memory Issues
- Reduce batch size in workflows
- Use smaller resolution (512x512 instead of 1024x1024)
- Enable `--lowvram` flag: `python main.py --lowvram`

### DirectML Performance
- Lower resolution settings
- Use CPU fallback for complex workflows
- Consider upgrading to NVIDIA GPU for better performance

## Configuration

### Environment Variables
Add to `.env`:
```
VITE_FEATURE_ART_GENERATION_ENABLED=true
COMFYUI_URL=http://localhost:8188
COMFYUI_TIMEOUT=300000
ART_CACHE_DIR=./public/generated
```

### Art Generation Settings
- Default resolution: 1024x1024
- Style strength: 0.8
- Sampling steps: 20
- CFG scale: 7.5
- Seed: Random (deterministic caching)

## File Organization

Generated images follow this structure:
```
public/generated/
├── monsters/
│   ├── goblin/
│   │   ├── portrait.jpg
│   │   ├── token.png
│   │   └── metadata.json
│   └── dragon/
│       ├── portrait.jpg
│       ├── token.png
│       └── metadata.json
├── items/
│   ├── weapons/
│   └── armor/
├── spells/
├── locations/
└── jobs/
```

## Security Notes
- ComfyUI server runs locally only
- No external API calls for generation
- All processing happens on-device
- Generated images stored locally
