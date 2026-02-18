-- Extend VTT fog-of-war state to be session-scoped
-- Allows multiple concurrent/archived sessions per campaign without overwriting fog/tokens.

ALTER TABLE public.vtt_fog_state
  ADD COLUMN IF NOT EXISTS session_id uuid;

-- Backfill existing rows to a deterministic value (NULL means legacy/unscoped)
-- New writes should always set session_id.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'vtt_fog_state_campaign_id_scene_id_key'
  ) THEN
    ALTER TABLE public.vtt_fog_state
      DROP CONSTRAINT vtt_fog_state_campaign_id_scene_id_key;
  END IF;
EXCEPTION WHEN undefined_object THEN
  NULL;
END $$;

ALTER TABLE public.vtt_fog_state
  ADD CONSTRAINT vtt_fog_state_campaign_session_scene_unique
  UNIQUE (campaign_id, session_id, scene_id);

CREATE INDEX IF NOT EXISTS idx_vtt_fog_state_campaign_session
  ON public.vtt_fog_state(campaign_id, session_id);
