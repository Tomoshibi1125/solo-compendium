-- Comprehensive schema parity migration
-- Fixes identified by full audit on 2026-04-22:
--
--   1. Recreate user_characters VIEW so it picks up all columns added since
--      the view was last defined (ability scores, languages, senses, etc.)
--      AND reflects the system_favor_* → rift_favor_* column rename.
--
--   2. Fix on_long_rest_assign_quests() which still references the old
--      system_favor_current column name (flagged by supabase db lint).
--
--   3. Ensure RLS is enabled on audio_playlists and audio_tracks tables.

------------------------------------------------------------------------
-- 1. Recreate user_characters view
------------------------------------------------------------------------
-- The view was originally `SELECT c.*, ...` but Postgres snapshots the
-- column list at CREATE VIEW time.  Columns added after the view was
-- created (agi, str, int, vit, pre, sense, senses, languages, etc.)
-- and columns renamed (system_favor_* → rift_favor_*) are not visible
-- through the stale view.  Recreating it picks up all current columns.

DROP VIEW IF EXISTS public.user_characters;
CREATE VIEW public.user_characters WITH (security_invoker = on) AS
SELECT
  c.*,
  up.email   AS user_email,
  up.display_name AS user_name,
  up.role    AS user_role
FROM public.characters c
JOIN public.profiles up ON c.user_id = up.id;


------------------------------------------------------------------------
-- 2. Fix on_long_rest_assign_quests — system_favor_current → rift_favor_current
------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.on_long_rest_assign_quests(UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.on_long_rest_assign_quests(p_character_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  quest_config RECORD;
  expired_count INTEGER;
BEGIN
  SELECT * INTO quest_config
  FROM public.daily_quest_configs
  WHERE character_id = p_character_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF quest_config IS NULL THEN
    SELECT * INTO quest_config
    FROM public.daily_quest_configs
    WHERE campaign_id = (
      SELECT campaign_id
      FROM public.campaign_members
      WHERE character_id = p_character_id
      LIMIT 1
    )
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;

  IF quest_config IS NULL OR quest_config.enabled IS NOT TRUE THEN
    RETURN;
  END IF;

  UPDATE public.daily_quest_instances
  SET status = 'expired',
      completed_at = NOW()
  WHERE character_id = p_character_id
    AND status IN ('pending', 'in_progress');

  GET DIAGNOSTICS expired_count = ROW_COUNT;

  IF expired_count > 0 THEN
    IF quest_config.penalty_mode = 'exhaustion' THEN
      UPDATE public.characters
      SET exhaustion_level = LEAST(6, COALESCE(exhaustion_level, 0) + 1)
      WHERE id = p_character_id;
    ELSIF quest_config.penalty_mode = 'system_fatigue' THEN
      -- Column was renamed: system_favor_current → rift_favor_current
      UPDATE public.characters
      SET rift_favor_current = GREATEST(0, rift_favor_current - 1)
      WHERE id = p_character_id;
    END IF;
  END IF;

  PERFORM public.assign_daily_quests(p_character_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.on_long_rest_assign_quests(UUID) TO authenticated;


------------------------------------------------------------------------
-- 3. Ensure RLS on audio tables
------------------------------------------------------------------------
ALTER TABLE public.audio_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

-- audio_playlists: owners can manage their playlists, anyone authed can view
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'audio_playlists' AND policyname = 'Users manage own playlists'
  ) THEN
    CREATE POLICY "Users manage own playlists" ON public.audio_playlists
      FOR ALL USING (user_id = (SELECT auth.uid()));
  END IF;
END $$;

-- audio_tracks: owners can manage their tracks, anyone authed can view
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'audio_tracks' AND policyname = 'Users manage own tracks'
  ) THEN
    CREATE POLICY "Users manage own tracks" ON public.audio_tracks
      FOR ALL USING (user_id = (SELECT auth.uid()));
  END IF;
END $$;
