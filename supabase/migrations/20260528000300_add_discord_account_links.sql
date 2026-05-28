-- ============================================================================
-- Misty Pearl G2 — Two-way Discord bot
-- ============================================================================
-- Adds the surface area for slash-command interactions originating on
-- Discord and landing back in the RA campaign:
--   1. `discord_app_id` + `discord_public_key` on `campaigns` so the
--      bot endpoint can verify incoming Ed25519-signed interactions
--      against the Warden's Discord application.
--   2. `discord_account_links` mapping table that ties a Discord user
--      id to an RA user id PER CAMPAIGN (Warden may scope per-table).
--      Created via the `/link <share-code>` slash command.
--   3. Audit trail on every command dispatch so Wardens can review
--      what their bot has been doing.
-- ============================================================================

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS discord_app_id text,
  ADD COLUMN IF NOT EXISTS discord_public_key text;

COMMENT ON COLUMN public.campaigns.discord_app_id IS
  'Misty Pearl G2 — Discord Application id used to register slash commands. NULL = bot disabled.';
COMMENT ON COLUMN public.campaigns.discord_public_key IS
  'Misty Pearl G2 — Discord Application public key (hex). Used to Ed25519-verify incoming interaction webhooks. NULL = bot disabled.';

CREATE TABLE IF NOT EXISTS public.discord_account_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  discord_user_id TEXT NOT NULL,
  discord_username TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, discord_user_id)
);

CREATE INDEX IF NOT EXISTS idx_discord_account_links_campaign_user
  ON public.discord_account_links (campaign_id, user_id);

ALTER TABLE public.discord_account_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaign members can read account links"
  ON public.discord_account_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members
      WHERE campaign_members.campaign_id = discord_account_links.campaign_id
        AND campaign_members.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = discord_account_links.campaign_id
        AND campaigns.owner_id = auth.uid()
    )
  );

-- Self-link policy: a user can link / unlink their own Discord id.
CREATE POLICY "Users manage their own Discord links"
  ON public.discord_account_links
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.discord_command_audit (
  id BIGSERIAL PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  discord_user_id TEXT,
  command TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  outcome TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discord_command_audit_campaign
  ON public.discord_command_audit (campaign_id, created_at DESC);

ALTER TABLE public.discord_command_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Wardens read Discord command audit"
  ON public.discord_command_audit
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members
      WHERE campaign_members.campaign_id = discord_command_audit.campaign_id
        AND campaign_members.user_id = auth.uid()
        AND campaign_members.role IN ('warden', 'co-warden')
    )
    OR EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = discord_command_audit.campaign_id
        AND campaigns.owner_id = auth.uid()
    )
  );

-- Service-role inserts (called by the edge function) are unrestricted —
-- the function authenticates Discord signatures before writing.
COMMENT ON TABLE public.discord_command_audit IS
  'Misty Pearl G2 — append-only log of slash-command dispatches. Service-role writes only; Warden / co-Warden / owner reads.';
