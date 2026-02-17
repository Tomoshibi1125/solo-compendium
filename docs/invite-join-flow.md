# Invite / Join Flow Runbook

This runbook documents the secure campaign invite lifecycle implemented in the app.

## What changed

### Database

- Added invite hardening migration:
  - `supabase/migrations/20260215010000_harden_campaign_invites.sql`
- Added invite lifecycle fields:
  - `join_code`, `token_hash`, `invite_email`, `revoked_at`, `revoked_by`, `revoked_reason`, `metadata`
- Added audit table:
  - `campaign_invite_audit_logs`
- Added multi-character attachment table:
  - `campaign_member_characters`
- Added/updated RPCs:
  - `create_campaign_invite`
  - `get_campaign_invite_by_token`
  - `redeem_campaign_invite`
  - `revoke_campaign_invite`
  - `add_player_character_to_campaign`
- Invite tokens are now hashed at rest in the database.

### Frontend

- Updated invite hooks for:
  - join-code/status handling
  - invite revocation RPC
  - invite audit feed
  - character attachment to existing campaign members
- Updated DM settings invite panel:
  - email invite input
  - join code copy
  - status badges and lifecycle messaging
  - audit trail view
- Updated campaign join UX:
  - supports `/campaigns/join/:accessKey` for share code or invite key
  - sign-in required prompt for token redemption
  - safe post-auth resume
  - character creation resume link

### Serverless API

- Added `api/createInvite.js`.
- Used when an invite email is provided.
- Calls the secure DB RPC and then uses Supabase Admin invite email.

## Environment variables

The email invite API route requires:

- `VITE_SUPABASE_URL` (or `SUPABASE_URL`)
- `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY` / `SUPABASE_ANON_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY` **(required for sending email invites)**

> Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code.

## Deploy notes

- `vercel.json` rewrites now preserve `/api/*` routes before the SPA catch-all.
- Ensure DB migration is applied before enabling invite email in production.

## Validation checklist

1. DM creates invite from campaign settings.
2. DM sees generated join code and invite status.
3. DM revokes invite and sees audit entry.
4. Join page shows revoked/expired/used state messaging.
5. Logged-in existing member can re-open used-up invite to attach another character.
6. Email invite path returns invite link and email delivery status.

## Tests added

- Vitest:
  - `src/lib/__tests__/campaignInviteUtils.test.ts`
- Playwright:
  - `campaign-invite-flow.spec.ts`
