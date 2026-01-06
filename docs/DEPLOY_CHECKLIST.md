# Deployment Checklist

This checklist ensures all steps are completed before deploying Solo Compendium to production.

## Pre-Deploy Commands

Run these commands in order and verify they all pass:

```bash
# 1. Lint check
npm run lint

# 2. Type check
npm run typecheck

# 3. Run tests
npm run test -- --run

# 4. Build for production
npm run build

# Or run all at once:
npm run deploy:check
```

**Expected Results**:
- ✅ Lint: 0 errors (warnings are acceptable)
- ✅ Type check: 0 errors
- ✅ Tests: All tests passing
- ✅ Build: Successful build to `dist/` directory

## Required Environment Variables

### Production Environment

Set these in your deployment platform (Vercel, Netlify, etc.):

#### Required
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

#### Optional (Sentry)
- **Runtime (client)**:
  - `VITE_SENTRY_DSN` - Sentry DSN for error tracking
  - `VITE_APP_VERSION` - Release/version label (optional)
- **Build-time (source maps upload; only needed if using `@sentry/vite-plugin`)**:
  - `SENTRY_AUTH_TOKEN`
  - `SENTRY_ORG`
  - `SENTRY_PROJECT`

#### Optional (Analytics)
- `VITE_ANALYTICS_ENABLED` - Set to `true` to enable analytics (requires consent)
- `VITE_PLAUSIBLE_DOMAIN` - Plausible domain (optional)
- `VITE_POSTHOG_KEY` - PostHog project key (optional)
- `VITE_POSTHOG_HOST` - PostHog host (optional; defaults to `https://app.posthog.com`)

### Development Environment

Create a `.env.local` file with:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SENTRY_DSN=https://your-sentry-dsn (optional)
VITE_ANALYTICS_ENABLED=false (optional)
```

## Database Migration Steps

### 1. Apply Migrations

If using Supabase CLI:
```bash
supabase migration up
```

Or apply migrations via Supabase Dashboard:
1. Go to SQL Editor in Supabase Dashboard
2. Run each migration file in `supabase/migrations/` in order
3. Verify all migrations applied successfully

### 2. Verify Schema

Run this query to verify tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'compendium_%' OR table_name LIKE 'character_%';
```

Expected tables:
- `compendium_jobs`, `compendium_job_paths`, `compendium_powers`, `compendium_runes`, `compendium_relics`, `compendium_monsters`, `compendium_backgrounds`, `compendium_conditions`, `compendium_monarchs`, `compendium_feats`, `compendium_skills`, `compendium_equipment`, `compendium_shadow_soldiers`, `compendium_sovereigns`
- `characters`, `character_equipment`, `character_features`, `character_powers`, `character_rune_inscriptions`, `character_rune_knowledge`, `character_spell_slots`, `character_shadow_army`, `character_templates`, `roll_history`

### 3. Verify RLS Policies

Ensure Row Level Security is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

### 4. Verify Indexes

Check that full-text search indexes exist:
```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE '%search%';
```

## Storage Bucket Setup

### Required Buckets

Create these storage buckets in Supabase Dashboard:

1. **`character-portraits`**
   - Public: Yes
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
   - Max file size: 5MB

2. **`compendium-images`** (if using storage for compendium images)
   - Public: Yes
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
   - Max file size: 10MB

### Bucket Policies

Ensure public read access:
```sql
-- Example policy for character-portraits
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'character-portraits');
```

## Node Version

### Required Version
- **Node.js**: >= 20.0.0

### Verification
```bash
node --version  # Should show v20.x.x or higher
```

### Using .nvmrc
If using nvm:
```bash
nvm use  # Will use Node 20 from .nvmrc
```

## Build Configuration

### Vite Config
- ✅ `vite.config.ts` configured with code splitting
- ✅ PWA plugin configured
- ✅ Sentry plugin configured (production only)
- ✅ Manual chunks: `react-vendor`, `ui-vendor`, `query-vendor`, `supabase-vendor`

### Vercel Config
- ✅ `vercel.json` exists with SPA rewrites
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Framework: `vite`

## Post-Deploy Verification Steps

### 1. Health Check
Visit your deployed URL and verify:
- ✅ App loads without errors
- ✅ No console errors in browser DevTools
- ✅ Environment validation passes (check console)

### 2. Authentication
- ✅ Sign up flow works
- ✅ Sign in flow works
- ✅ Sign out works
- ✅ Protected routes redirect correctly

### 3. Core Features
- ✅ Compendium search works
- ✅ Compendium detail pages load
- ✅ Character creation works
- ✅ Character sheet displays correctly
- ✅ Equipment equip/unequip works
- ✅ Dice rolling works

### 4. Database Connection
- ✅ Data loads from Supabase
- ✅ Writes to database succeed
- ✅ Real-time subscriptions work (if applicable)

### 5. Error Tracking
- ✅ Sentry captures errors (if configured)
- ✅ Error boundaries catch React errors

### 6. Performance
- ✅ Page load time < 3 seconds
- ✅ No large bundle warnings
- ✅ Code splitting works (check Network tab)

## Rollback Plan

If deployment fails:

1. **Revert to previous deployment** (Vercel/Netlify dashboard)
2. **Check error logs** in deployment platform
3. **Verify environment variables** are set correctly
4. **Check database migrations** didn't break anything
5. **Review recent changes** in git history

## Troubleshooting

### Build Fails
- Check Node version: `node --version` (should be >= 20)
- Clear cache: `rm -rf node_modules .vite dist && npm install`
- Check for TypeScript errors: `npm run typecheck`

### Environment Variables Not Working
- Verify variables are set in deployment platform
- Check variable names start with `VITE_` for client-side access
- Restart deployment after adding variables

### Database Connection Issues
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are correct
- Check Supabase project is active
- Verify RLS policies allow access

### Migration Issues
- Check migration order (timestamp-based)
- Verify no conflicting migrations
- Check Supabase logs for errors

## Success Criteria

✅ All pre-deploy commands pass  
✅ All environment variables set  
✅ All migrations applied  
✅ Storage buckets created  
✅ Node version >= 20  
✅ Build succeeds  
✅ Post-deploy verification passes  

**Once all items are checked, deployment is ready!**

