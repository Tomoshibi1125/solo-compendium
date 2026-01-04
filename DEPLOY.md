# Quick Deployment Guide

## 🚀 Deploy to Production

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
   Or connect your GitHub repo at [vercel.com](https://vercel.com)

3. **Set Environment Variables** in Vercel Dashboard:
   - Go to: Project Settings → Environment Variables
   - Add the following variables (get values from your local `.env` file or Supabase dashboard):
     - `VITE_SUPABASE_URL` (your Supabase project URL)
     - `VITE_SUPABASE_PUBLISHABLE_KEY` (your Supabase anon/public key)
   - **Important**: Vercel ignores `.env` files. Variables must be set in the dashboard.
   - After adding variables, trigger a new deployment for them to take effect.

4. **Done!** Your app will be live at `your-app.vercel.app`

---

### Option 2: Netlify

1. **Install Netlify CLI** (optional):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```
   Or connect your GitHub repo at [netlify.com](https://netlify.com)

3. **Set Environment Variables** in Netlify Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

4. **Done!** Your app will be live at `your-app.netlify.app`

---

### Option 3: Cloudflare Pages

1. **Connect Repository** at [pages.cloudflare.com](https://pages.cloudflare.com)

2. **Build Settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Framework preset: Vite

3. **Set Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

4. **Done!** Your app will be live at `your-app.pages.dev`

---

### Option 4: Supabase Hosting

1. **Install Supabase CLI**:
   ```bash
   npm i -g supabase
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   supabase hosting deploy dist
   ```

4. **Done!** Your app will be live on Supabase

---

## 📋 Pre-Deployment Checklist

### 1. Database Setup
- [ ] Apply all migrations: `supabase migration up`
- [ ] Verify SRD gap migration applied
- [ ] Test database connections

### 2. Environment Variables
- [ ] Set `VITE_SUPABASE_URL`
- [ ] Set `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Verify variables in deployment platform

### 3. Supabase Storage
- [ ] Create `character-portraits` bucket
- [ ] Set up storage policies (see DEPLOYMENT_READINESS.md)

### 4. Build Verification
- [ ] Run `npm run build` successfully
- [ ] Verify `dist/` folder created
- [ ] Check for build errors

### 5. Post-Deployment
- [ ] Test home page loads
- [ ] Test compendium search
- [ ] Test character creation
- [ ] Test character sheet
- [ ] Test mobile responsiveness

---

## 🔧 Troubleshooting

### Build Fails
- Check Node.js version (20+ required)
- Run `npm install` again
- Clear `node_modules` and reinstall

### Environment Variables Not Working
- Ensure variables are set in deployment platform
- Restart deployment after setting variables
- Check variable names match exactly

### Database Connection Issues
- Verify Supabase URL is correct
- Check Supabase project is active
- Verify RLS policies are set correctly

### Storage Issues
- Verify bucket exists
- Check storage policies
- Verify bucket is public (for portraits)

---

## 📚 Full Documentation

See `docs/DEPLOYMENT_READINESS.md` for complete deployment guide.

---

**Ready to deploy!** 🎉

