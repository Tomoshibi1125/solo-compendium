-- ============================================================================
-- Misty Pearl E3 — Discord Webhook Bridge
-- ============================================================================
-- Adds an opt-in `discord_webhook_url` to campaigns so Wardens can mirror
-- session reminders, dice rolls, and Warden broadcasts to a Discord channel.
-- Default NULL = disabled. RA theming: this is a Bureau cross-channel
-- communications hook for parties that already operate from a Discord guild.
-- ============================================================================

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS discord_webhook_url text;

COMMENT ON COLUMN public.campaigns.discord_webhook_url IS
  'Optional Discord webhook URL for cross-channel session notifications. NULL = disabled. Warden-only-editable (enforced by existing campaigns RLS).';

-- No RLS change required: existing campaigns UPDATE policy already restricts
-- writes to the Warden / owner. The column is exposed in the same row read
-- to all members (URL itself is not sensitive; the secret part is the
-- webhook ID nonce which Discord rotates if abused).
