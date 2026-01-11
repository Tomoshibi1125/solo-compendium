## Setup (Local Dev + Production)

This repo supports three runtime modes:

- **Setup mode**: Supabase env vars missing → app boots and guides you at `/setup`.
- **Guest mode (guest-lite)**: Supabase configured, no login → compendium browsing + 1 local Hunter stored on this device.
- **Signed-in mode**: Supabase configured + authenticated → full persistence + online features.

---

## Prerequisites

- Node.js **20+**
- npm
- (Optional) Supabase project (recommended for full functionality)

---

## Install

```bash
npm install
```

---

## Environment Variables

Create `.env.local` (gitignored) with:

```env
# Local development
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Optional
# VITE_SENTRY_DSN=
# VITE_ANALYTICS_ENABLED=false
```

Optional (all safe to omit):

- `VITE_SENTRY_DSN`
- `VITE_ANALYTICS_ENABLED`
- `VITE_PLAUSIBLE_DOMAIN`
- `VITE_POSTHOG_KEY`
- `VITE_POSTHOG_HOST`

---

## Run the App

```bash
npm run dev
```

### Setup Mode (no Supabase env configured)

- The app will still render (no crash).
- Protected pages redirect to `/setup`.
- `src/pages/Setup.tsx` shows what’s missing and a `.env.local` template.

Key files:
- `src/integrations/supabase/client.ts` (non-throwing client + `isSupabaseConfigured`)
- `src/components/auth/ProtectedRoute.tsx` (redirects to `/setup` when unconfigured)
- `src/App.tsx` (route wiring for `/setup`)

### Guest Mode (Supabase configured, no login)

- **Compendium** remains browseable (read-only).
- **One local Hunter** is stored in browser localStorage (`solo-compendium.guest.v1`).
- Signing in upgrades persistence to Supabase-backed storage.

Key files:
- `src/lib/guestStore.ts`
- `src/hooks/useCharacters.ts` (local branching when unauthenticated / `local_*` IDs)

---

## Database Setup (Supabase)

Apply migrations in `supabase/migrations/` to your Supabase project.

Options:
- Supabase CLI: `supabase migration up`
- Supabase Dashboard SQL editor: run migrations in order

Expected DB tables include:
- Compendium: `compendium_*`
- Characters: `characters`, `character_abilities`, `character_equipment`, `character_features`, `character_powers`, `character_spell_slots`, …
- Dice log: `roll_history`

See also:
- `docs/DEPLOY_CHECKLIST.md`

---

## Quality Gates

```bash
npm run lint
npm run typecheck
npm run test -- --run
npm run test:e2e
npm run build
```

Canonical evidence lives in:
- `docs/TEST_REPORT.md`


