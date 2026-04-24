-- VTT session controls (Start/Pause/End) + Warden-scoped game settings.
-- Adds two JSONB fields to `campaigns`:
--   vtt_session_status – small object tracking the Warden's session state
--     so that Ascendants see a "waiting / paused / ended" overlay when the
--     Warden has gated the session.
--   vtt_settings – Warden-tunable player permissions (draw, ping, pointer,
--     monster token interaction, fog brush). Mirrors D&D Beyond Maps'
--     "Game Settings" panel.
--
-- Both fields default to sensible "permissive" values so existing campaigns
-- keep current behavior until the Warden changes them.
--
-- Reads: any campaign member (Warden, Co-Warden, Ascendant, Spectator).
-- Writes: Warden or Co-Warden only (enforced via existing campaign RLS by
-- reusing the `is_campaign_warden` helper).

BEGIN;

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS vtt_session_status jsonb NOT NULL DEFAULT
    jsonb_build_object(
      'state', 'started',
      'updated_at', null,
      'updated_by', null,
      'message', null
    );

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS vtt_settings jsonb NOT NULL DEFAULT
    jsonb_build_object(
      'allowPlayerDraw', true,
      'allowPlayerPing', true,
      'allowPlayerPointer', true,
      'allowPlayerMonsterInteract', false,
      'allowPlayerFogBrush', false,
      'wheelBehavior', 'zoom'
    );

COMMENT ON COLUMN public.campaigns.vtt_session_status IS
  'Warden-controlled VTT session gate. state ∈ {started,paused,ended}. Non-warden clients hide or obscure the map when not started.';
COMMENT ON COLUMN public.campaigns.vtt_settings IS
  'Per-campaign VTT settings (player permissions, wheel behavior). Editable by Warden/Co-Warden only.';

-- No new RLS policy needed; both columns live on `campaigns` which already
-- has the appropriate read/write policies. We rely on those.

COMMIT;
