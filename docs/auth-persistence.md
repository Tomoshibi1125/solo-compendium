# Auth and Persistence Configuration

Signup verification links must return to `https://riftascendant.vercel.app/auth/callback`, and authenticated user data should be saved to Supabase while guest-only data remains local.

## Production environment

Set this in Vercel for production builds:

```env
VITE_PUBLIC_SITE_URL=https://riftascendant.vercel.app
```

## Supabase Auth settings

In Supabase Dashboard -> Authentication -> URL Configuration:

- **Site URL:** `https://riftascendant.vercel.app`
- **Redirect URL:** `https://riftascendant.vercel.app/auth/callback`
- **Optional local redirect:** `http://localhost:5173/auth/callback`

## Persistence boundaries

- **Authenticated characters:** Saved to Supabase `characters` and related character tables.
- **Authenticated homebrew:** Saved to Supabase `homebrew_content` and queued through offline sync on network failure.
- **Authenticated sheet/tool state:** Mirrored locally for fallback and saved remotely when a user is signed in.
- **Guest characters:** Saved locally through `guestStore` until an account migration flow is added.
