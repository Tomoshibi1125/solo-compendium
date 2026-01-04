# Supabase Configuration Guide

## ✅ Token Added

Your Supabase access token has been added to `.env.local`:
- **Token**: `sbp_5675a595e1ff34dc345f404e06055bf41c5af289`

## ⚠️ Important: Token Type

The token you provided (`sbp_` prefix) is a **Supabase Access Token**, which may work for some operations, but for full admin access (like uploading images to storage), you'll need a **Service Role Key**.

### Token Types:

1. **Service Role Key** (Recommended for image generation)
   - Format: Starts with `eyJ` (JWT token)
   - Location: Supabase Dashboard → Settings → API → Service Role Key (secret)
   - Has full admin access, bypasses Row Level Security

2. **Access Token** (What you provided)
   - Format: Starts with `sbp_`
   - May work for some operations but may have limited permissions
   - Good for general API access

## 🔧 How to Get Service Role Key

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Under **Project API keys**, find **service_role** (secret)
5. Copy the key (starts with `eyJ`)
6. Replace the value in `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

## ✅ What's Needed

Your `.env.local` should have:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Hugging Face (already configured ✅)
HUGGINGFACE_API_TOKEN=your_huggingface_api_token_here
HUGGINGFACE_MODEL=stabilityai/stable-diffusion-xl-base-1.0
```

## 🧪 Testing

After updating, test your configuration:

```bash
python scripts/test-image-gen-setup.py
```

This will verify:
- ✅ Supabase connection
- ✅ Authentication
- ✅ Migration status
- ✅ Hugging Face API

## 📋 Next Steps

1. ✅ Access token added (may work for basic operations)
2. ⚠️ Get Service Role Key for full functionality (recommended)
3. ✅ Apply migrations: `scripts/apply-migrations.sql`
4. ✅ Generate images: `python scripts/generate-compendium-images.py monsters 1`

---

**Note**: The access token you provided may work for querying data, but uploading images to Supabase Storage requires admin-level permissions that typically need the Service Role Key.

