# Hugging Face API Endpoint Issue

## Current Status

The Hugging Face Inference API endpoints are failing:
- Router endpoints (`router.huggingface.co`) return 404 Not Found
- Old inference endpoints (`api-inference.huggingface.co`) return 410 (no longer supported)

## Solution Options

### Option 1: Use Hugging Face Inference SDK (Recommended)

Install the Hugging Face Inference SDK:
```bash
pip install huggingface_hub
```

Then use it in the script instead of direct REST calls.

### Option 2: Use Local Stable Diffusion

Set up a local Stable Diffusion WebUI and use:
```env
STABLE_DIFFUSION_API_URL=http://localhost:7860
```

### Option 3: Use Alternative API Provider

Consider using:
- Replicate API
- Stability AI API
- OpenAI DALL-E
- Local inference with Ollama

## Current Script Status

✅ **Working:**
- Database connection verified (319 monster entries)
- Tags are correctly read from database entries
- Image placement logic is correct (organizes by entry_type: monsters/, equipment/, relics/, jobs/)
- Prompt generation includes tags properly

❌ **Blocked:**
- Image generation (Hugging Face API endpoints not working)

## Next Steps

1. Check Hugging Face documentation for correct router endpoint format
2. Try using Hugging Face Inference SDK
3. Set up local Stable Diffusion WebUI as fallback
4. Or use alternative API provider

