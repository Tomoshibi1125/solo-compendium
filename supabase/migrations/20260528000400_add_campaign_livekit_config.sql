-- ============================================================================
-- Misty Pearl I3 — LiveKit SFU transport opt-in
-- ============================================================================
-- Adds per-campaign LiveKit server config so the Comm-Net hook can
-- pick LiveKit as its transport when the Warden has provisioned one
-- (typical reason: party size > 6, mobile clients, or bandwidth
-- constraints that make the trystero mesh degrade).
--
-- The LiveKit API secret stays server-side. The client only ever
-- receives a short-lived token minted by the `mint-livekit-token`
-- edge function.
-- ============================================================================

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS livekit_url text,
  ADD COLUMN IF NOT EXISTS livekit_api_key text,
  ADD COLUMN IF NOT EXISTS livekit_api_secret text;

COMMENT ON COLUMN public.campaigns.livekit_url IS
  'Misty Pearl I3 — LiveKit server URL (wss://...). NULL = trystero mesh transport.';
COMMENT ON COLUMN public.campaigns.livekit_api_key IS
  'Misty Pearl I3 — LiveKit API key (used by mint-livekit-token edge function only).';
COMMENT ON COLUMN public.campaigns.livekit_api_secret IS
  'Misty Pearl I3 — LiveKit API secret. Server-side only; never exposed to clients.';

-- Belt-and-suspenders: revoke any SELECT grant on the API secret column
-- from anon/authenticated even though existing RLS already restricts
-- the row. A future view can expose just `livekit_url` to members.
REVOKE SELECT (livekit_api_secret) ON public.campaigns FROM anon, authenticated;
