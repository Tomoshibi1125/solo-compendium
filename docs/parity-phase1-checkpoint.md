# Phase 1 Checkpoint - Backend Foundation (D&D Beyond Parity)

## Migration list

1. `supabase/migrations/20260216000000_parity_foundation_phase1.sql`
   - Added Phase 1 foundation for:
     - sourcebook entitlements + campaign sourcebook sharing
     - homebrew lifecycle/versioning + publish visibility controls
     - marketplace backend primitives + entitlement checks
     - campaign scheduling/session logs + write RPCs

## Schema diff summary

### New tables

- `public.sourcebook_catalog`
- `public.user_sourcebook_entitlements`
- `public.campaign_sourcebook_shares`
- `public.homebrew_content_versions`
- `public.marketplace_items`
- `public.marketplace_reviews`
- `public.marketplace_downloads`
- `public.user_marketplace_entitlements`
- `public.campaign_sessions`
- `public.campaign_session_logs`

### Altered tables

- `public.homebrew_content`
  - Added: `status`, `version`, `published_at`, `tags`, `source_book`, `visibility_scope`, `campaign_id`, `updated_by`
  - Added constraints: `homebrew_content_status_check`, `homebrew_content_visibility_scope_check`

### Index additions (high-impact)

- sourcebooks: user/sourcebook/campaign lookup indexes
- homebrew: owner/status/visibility/campaign indexes + versions index
- marketplace: listing/author/review/download/entitlement indexes
- sessions/logs: campaign and session timeline indexes

## RPC contract summary

### Sourcebook access & entitlement RPCs

- `public.user_has_sourcebook_access(p_sourcebook_id text, p_user_id uuid default auth.uid(), p_campaign_id uuid default null) -> boolean`
  - Returns whether user can access a sourcebook through free/public, direct entitlement, or campaign share.
  - Errors: none (boolean resolver).

- `public.get_accessible_sourcebooks(p_campaign_id uuid default null, p_user_id uuid default auth.uid()) -> table(sourcebook_id text, access_type text, shared_by uuid, expires_at timestamptz)`
  - Returns merged free/owned/campaign-share sourcebook set.
  - Behavior: admin/Warden can query another target `p_user_id`; otherwise caller scope.

- `public.upsert_user_sourcebook_entitlement(p_user_id uuid, p_sourcebook_id text, p_entitlement_type text default 'grant', p_expires_at timestamptz default null) -> uuid`
  - Upserts one user entitlement record.
  - Errors:
    - `AUTH_REQUIRED`
    - `SOURCEBOOK_ENTITLEMENT_FORBIDDEN`
    - `INVALID_ENTITLEMENT_TYPE`

- `public.share_campaign_sourcebook(p_campaign_id uuid, p_sourcebook_id text) -> uuid`
  - Shares a sourcebook to a campaign (upsert semantics).
  - Errors:
    - `AUTH_REQUIRED`
    - `CAMPAIGN_SOURCEBOOK_FORBIDDEN`
    - `SOURCEBOOK_NOT_OWNED`

### Homebrew lifecycle

- `public.can_view_homebrew_content(p_homebrew_id uuid, p_user_id uuid default auth.uid()) -> boolean`
- `public.can_manage_homebrew_content(p_homebrew_id uuid, p_user_id uuid default auth.uid()) -> boolean`
  - Access resolver helpers for RLS and APIs.

- `public.set_homebrew_content_status(p_homebrew_id uuid, p_status text, p_visibility_scope text default null, p_campaign_id uuid default null) -> uuid`
  - Status transitions: draft/published/archived.
  - Campaign visibility guarded by campaign membership/system rights.
  - Errors:
    - `AUTH_REQUIRED`
    - `INVALID_HOMEBREW_STATUS`
    - `HOMEBREW_NOT_FOUND`
    - `HOMEBREW_FORBIDDEN`
    - `INVALID_VISIBILITY_SCOPE`
    - `CAMPAIGN_ID_REQUIRED_FOR_CAMPAIGN_VISIBILITY`
    - `CAMPAIGN_VISIBILITY_FORBIDDEN`

### Marketplace RPCs

- `public.user_has_marketplace_access(p_item_id uuid, p_user_id uuid default auth.uid()) -> boolean`
  - Resolver for free/author/entitled access.

- `public.record_marketplace_download(p_item_id uuid, p_user_id uuid default auth.uid()) -> void`
  - Records download + updates aggregate counter.
  - Errors:
    - `AUTH_REQUIRED`
    - `MARKETPLACE_ACCESS_DENIED`

- `public.upsert_marketplace_review(p_item_id uuid, p_rating integer, p_comment text default null, p_user_id uuid default auth.uid()) -> uuid`
  - Upserts caller review and recalculates rating aggregate.
  - Errors:
    - `AUTH_REQUIRED`
    - `INVALID_RATING`

### Campaign scheduling/logs

- `public.upsert_campaign_session(p_campaign_id uuid, p_session_id uuid default null, p_title text default null, p_description text default null, p_scheduled_for timestamptz default null, p_status text default null, p_location text default null) -> uuid`
  - Create/update scheduled sessions.
  - Errors:
    - `AUTH_REQUIRED`
    - `INVALID_SESSION_STATUS`
    - `CAMPAIGN_SESSION_FORBIDDEN`
    - `SESSION_TITLE_REQUIRED`
    - `SESSION_NOT_FOUND`

- `public.add_campaign_session_log(p_campaign_id uuid, p_session_id uuid default null, p_log_type text default 'session', p_title text default null, p_content text default null, p_metadata jsonb default '{}'::jsonb, p_is_player_visible boolean default true) -> uuid`
  - Creates campaign session/game log entries.
  - Errors:
    - `AUTH_REQUIRED`
    - `CAMPAIGN_LOG_FORBIDDEN`
    - `INVALID_LOG_TYPE`
    - `LOG_TITLE_REQUIRED`
    - `LOG_CONTENT_REQUIRED`
    - `SESSION_NOT_FOUND`

## Security validation notes (RLS coverage)

### RLS - Sourcebooks

- `sourcebook_catalog`: public read; Warden/admin manage.
- `user_sourcebook_entitlements`: owner read + Warden/admin oversight; Warden/admin manage writes.
- `campaign_sourcebook_shares`: campaign member/Warden read; campaign system/Warden write.
- Entitlement/share mutation RPCs run as `SECURITY DEFINER` + explicit auth/role checks.

### RLS - Homebrew

- `homebrew_content` policies replaced with explicit ownership/Warden/public/campaign-scoped checks.
- Campaign-scoped visibility requires `status='published'` and campaign association.
- `homebrew_content_versions` RLS delegates to `can_view_homebrew_content` / `can_manage_homebrew_content`.
- Version snapshots trigger before update; publish state normalizes `is_public` from status/scope.

### RLS - Marketplace

- `marketplace_items`: listed read + author/Warden visibility; author/Warden write.
- `marketplace_reviews`: open read; owner/Warden manage.
- `marketplace_downloads`: owner read + item author/Warden visibility.
- `user_marketplace_entitlements`: owner read + Warden/admin manage.
- Download/review RPCs perform explicit entitlement/validation guards.

### RLS - Sessions/logs

- `campaign_sessions`: campaign members/Warden read; campaign system/Warden manage.
- `campaign_session_logs`: campaign members/Warden read with `is_player_visible` gate; author/system/Warden update/delete.
- Session/log write RPCs enforce campaign-role checks and input validation.

## Test evidence

### Added test

- `src/lib/__tests__/parityPhase1Migration.test.ts`
  - Verifies Phase 1 migration includes:
    - required schema objects
    - required RLS blocks
    - required RPC definitions
    - critical guard/error branches
    - idempotent realtime publication guard logic

### Executed command

- `npm run test:run -- src/lib/__tests__/parityPhase1Migration.test.ts`

### Result

- **PASS**: 1 file, 5 tests passed.

## Supabase CLI + migration apply evidence

- CLI included in repo toolchain:
  - `package.json` dev dependency: `supabase@^2.76.9`
  - Added scripts: `supabase`, `supabase:status`, `supabase:migration:list`, `supabase:db:push`
- CLI verification:
  - `npx supabase --version` -> `2.76.9`
- Remote migration apply:
  - `npx supabase db push --linked --include-all`
  - Applied in order:
    - `20260215000000_add_dm_campaign_controls.sql`
    - `20260215010000_harden_campaign_invites.sql`
    - `20260216000000_parity_foundation_phase1.sql`
- Remote migration sync verification:
  - `npx supabase migration list --linked`
  - Local/Remote aligned through `20260216000000`

## Gate criteria status

- Migrations created/updated for all required Phase 1 domains: **Complete**
- RPC + RLS coverage for required Phase 1 domains: **Complete**
- Automated verification for migration contract expectations: **Complete**
- Migration apply check with Supabase CLI (remote linked project): **Complete**
