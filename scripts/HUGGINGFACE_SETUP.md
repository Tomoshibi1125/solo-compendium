# Hugging Face Inference API Setup

Your image generation system is now configured to use Hugging Face Inference API!

## ✅ What's Configured

- **API Token**: `your_huggingface_api_token_here`
- **Model**: `stabilityai/stable-diffusion-xl-base-1.0` (Stable Diffusion XL)
- **Method**: Hugging Face Inference API (cloud-based, no local setup needed)

## 🚀 Advantages of Hugging Face API

- ✅ **No local installation required** - runs in the cloud
- ✅ **No GPU needed** - processing happens on Hugging Face servers
- ✅ **High-quality models** - uses state-of-the-art Stable Diffusion XL
- ✅ **Easy to use** - just needs your API token

## 📋 Usage

The script will automatically use Hugging Face API when `HUGGINGFACE_API_TOKEN` is set:

```bash
# Generate 1 test image
python scripts/generate-compendium-images.py monsters 1

# Generate 10 monster images
python scripts/generate-compendium-images.py monsters 10

# Generate equipment, relics, jobs
python scripts/generate-compendium-images.py equipment 5
python scripts/generate-compendium-images.py relics 5
python scripts/generate-compendium-images.py jobs 5
```

## 🔧 How It Works

1. Script generates a Solo Leveling-themed prompt from compendium entry data
2. Sends request to Hugging Face Inference API with your token
3. Receives generated image (may wait 10-20 seconds if model is loading)
4. Optimizes and uploads to Supabase Storage
5. Updates database with image URL

## ⚠️ Important Notes

- **First request may be slow**: If the model is "sleeping", Hugging Face needs to load it (10-30 seconds)
- **Rate limits**: Hugging Face has rate limits based on your account tier
- **Token security**: Keep your API token secret (it's in `.env.local` which should not be committed to git)

## 🔄 Switching Back to Local

If you want to use local Stable Diffusion instead, just set:
```env
STABLE_DIFFUSION_API_URL=http://localhost:7860
```

And remove or comment out the Hugging Face variables. The script will automatically prefer Hugging Face if the token is set.

## 📊 Model Options

You can change the model in `.env.local`:
- `stabilityai/stable-diffusion-xl-base-1.0` (default, best quality)
- `runwayml/stable-diffusion-v1-5` (faster, lower quality)
- `CompVis/stable-diffusion-v1-4` (older version)
- Any other compatible Stable Diffusion model on Hugging Face

---

**Status**: ✅ Ready to use! Just add your Supabase credentials and apply migrations.

