-- ─────────────────────────────────────────────────────────────────────────
-- Option 3 / D2 follow-up: vtt_tokens RLS prefers campaign_id
-- ─────────────────────────────────────────────────────────────────────────
-- The original vtt_tokens RLS (migration 20260220000003) resolves access
-- ONLY through session_id → active_sessions → campaign. Campaign-scoped
-- tokens (token-library assets) added via the upload path carry a real
-- `campaign_id` (migration 20260528000600) but their `session_id` does not
-- point at a valid active_sessions row, so the session-based policies
-- neither expose nor permit them — and the INSERT itself can be blocked.
--
-- This migration adds campaign_id-based policies ALONGSIDE the existing
-- session-based ones. Postgres combines permissive policies with OR, so a
-- token is reachable if EITHER the session path OR the campaign path
-- grants it — session-scoped encounter tokens keep working unchanged while
-- campaign-scoped library tokens become first-class.
--
-- Terminology: this project uses RA-canon "Warden" (the campaign owner),
-- not "DM"/"GM". The physical column is `campaigns.warden_id` (renamed
-- from dm_id in migration 20260329000000) and the campaign_members role is
-- 'warden'. Policy names and comments use Warden accordingly.
--
-- Idempotent: drops same-named policies first so the migration can re-run.
-- ─────────────────────────────────────────────────────────────────────────

-- ── SELECT: members/Warden of the token's campaign can view it ───────────
DROP POLICY IF EXISTS "Users can view VTT tokens in their campaigns"
  ON public.vtt_tokens;
CREATE POLICY "Users can view VTT tokens in their campaigns"
  ON public.vtt_tokens
  FOR SELECT USING (
    campaign_id IS NOT NULL
    AND campaign_id IN (
      SELECT id FROM public.campaigns
      WHERE warden_id = auth.uid()
         OR id IN (
           SELECT campaign_id FROM public.campaign_members
           WHERE user_id = auth.uid()
         )
    )
    AND (visible_to_players = TRUE OR created_by = auth.uid())
  );

-- ── ALL: the campaign's Warden can fully manage its tokens ───────────────
DROP POLICY IF EXISTS "Wardens can manage VTT tokens by campaign"
  ON public.vtt_tokens;
CREATE POLICY "Wardens can manage VTT tokens by campaign"
  ON public.vtt_tokens
  FOR ALL
  USING (
    campaign_id IS NOT NULL
    AND campaign_id IN (
      SELECT id FROM public.campaigns WHERE warden_id = auth.uid()
    )
  )
  WITH CHECK (
    campaign_id IS NOT NULL
    AND campaign_id IN (
      SELECT id FROM public.campaigns WHERE warden_id = auth.uid()
    )
  );

-- ── ALL: a token's creator can manage their own uploaded asset ───────────
-- Lets Ascendants (players) who upload a campaign token edit/remove it, and
-- unblocks the library-asset INSERT (WITH CHECK on created_by = auth.uid()).
DROP POLICY IF EXISTS "Creators can manage their own VTT tokens"
  ON public.vtt_tokens;
CREATE POLICY "Creators can manage their own VTT tokens"
  ON public.vtt_tokens
  FOR ALL
  USING (campaign_id IS NOT NULL AND created_by = auth.uid())
  WITH CHECK (campaign_id IS NOT NULL AND created_by = auth.uid());
