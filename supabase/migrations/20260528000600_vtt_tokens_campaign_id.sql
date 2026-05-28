-- ─────────────────────────────────────────────────────────────────────────
-- D2: vtt_tokens.campaign_id — proper campaign reference for tokens
-- ─────────────────────────────────────────────────────────────────────────
-- Token-library assets are scoped to a CAMPAIGN, not a specific combat
-- session. The upload path previously overloaded `session_id` to carry the
-- campaign id ("session_id as campaign reference for now"), which conflated
-- two distinct concepts. This migration adds a first-class, nullable
-- `campaign_id` column so campaign-scoped tokens (library assets) and
-- session-scoped tokens (active encounter pieces) can coexist cleanly.
--
-- Additive + nullable so existing rows and RLS policies (which key off
-- session_id) keep working unchanged. A follow-up can migrate RLS to
-- prefer campaign_id once all writers populate it.
-- ─────────────────────────────────────────────────────────────────────────

ALTER TABLE public.vtt_tokens
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_vtt_tokens_campaign_id
  ON public.vtt_tokens (campaign_id);

COMMENT ON COLUMN public.vtt_tokens.campaign_id IS
  'Campaign this token belongs to (token-library assets). Distinct from '
  'session_id, which scopes a token to a specific active combat session. '
  'Added in migration 20260528000600 to replace the session_id-as-campaign '
  'overload.';
