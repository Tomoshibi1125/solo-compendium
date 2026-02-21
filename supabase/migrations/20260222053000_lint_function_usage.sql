-- Fix lint findings: wire unused params/vars in quest rewards, completion notes, VTT update helpers, and level-gate validator

-- 1) Quest rewards: persist gold/items; store completion notes
DO $$
BEGIN
  -- Ensure quest_rewards_log exists to capture non-XP rewards
  CREATE TABLE IF NOT EXISTS public.quest_rewards_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quest_id UUID NOT NULL REFERENCES public.session_quests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
    gold_awarded INTEGER DEFAULT 0,
    items_awarded TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE INDEX IF NOT EXISTS idx_quest_rewards_log_quest_id ON public.quest_rewards_log(quest_id);
  CREATE INDEX IF NOT EXISTS idx_quest_rewards_log_user_id ON public.quest_rewards_log(user_id);

  -- Add completion_notes to session_quests to use p_completion_notes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'session_quests' AND column_name = 'completion_notes'
  ) THEN
    ALTER TABLE public.session_quests ADD COLUMN completion_notes TEXT;
  END IF;
END $$;

-- Replace claim_quest_rewards to log gold/items and mark completion
CREATE OR REPLACE FUNCTION public.claim_quest_rewards(
    p_quest_id UUID,
    p_character_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_quest_record RECORD;
    v_xp_reward INTEGER := 0;
    v_gold_reward INTEGER := 0;
    v_item_rewards TEXT[] := '{}';
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.characters WHERE id = p_character_id AND user_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Character does not belong to user';
    END IF;

    SELECT * INTO v_quest_record
    FROM public.session_quests
    WHERE id = p_quest_id AND status = 'completed';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Quest not found or not completed';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.quest_completions
        WHERE quest_id = p_quest_id AND user_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Rewards already claimed';
    END IF;

    -- Extract rewards
    v_xp_reward := COALESCE((v_quest_record.rewards->>'xp')::INTEGER, 0);
    v_gold_reward := COALESCE((v_quest_record.rewards->>'gold')::INTEGER, 0);
    v_item_rewards := COALESCE(ARRAY(SELECT jsonb_array_elements_text(v_quest_record.rewards->'items')), '{}');

    -- Apply XP
    IF v_xp_reward > 0 THEN
        UPDATE public.characters
        SET experience = experience + v_xp_reward
        WHERE id = p_character_id;
    END IF;

    -- Record non-XP rewards (gold/items) for audit/consumption later
    INSERT INTO public.quest_rewards_log (quest_id, user_id, character_id, gold_awarded, items_awarded)
    VALUES (p_quest_id, v_user_id, p_character_id, v_gold_reward, v_item_rewards);

    -- Record completion
    INSERT INTO public.quest_completions (quest_id, user_id, character_id, rewards_claimed)
    VALUES (p_quest_id, v_user_id, p_character_id, TRUE);
END;
$$;

-- Replace complete_session_quest to persist completion notes
CREATE OR REPLACE FUNCTION public.complete_session_quest(
    p_quest_id UUID,
    p_completion_notes TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_session_id UUID;
    v_campaign_id UUID;
    v_user_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT sq.session_id INTO v_session_id
    FROM public.session_quests sq
    JOIN public.active_sessions s ON s.id = sq.session_id
    WHERE sq.id = p_quest_id;

    SELECT campaign_id INTO v_campaign_id
    FROM public.active_sessions
    WHERE id = v_session_id;

    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns
        WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can complete session quests';
    END IF;

    UPDATE public.session_quests
    SET status = 'completed',
        completion_notes = COALESCE(p_completion_notes, completion_notes),
        updated_at = NOW()
    WHERE id = p_quest_id;
END;
$$;

-- 2) VTT updates: enforce session scoping to use p_session_id parameters
-- Base VTT system version (original lightweight helpers)
CREATE OR REPLACE FUNCTION public.update_vtt_map_element(
    p_element_id UUID,
    p_session_id UUID,
    p_x INTEGER DEFAULT NULL,
    p_y INTEGER DEFAULT NULL,
    p_width INTEGER DEFAULT NULL,
    p_height INTEGER DEFAULT NULL,
    p_color TEXT DEFAULT NULL,
    p_stroke_width INTEGER DEFAULT NULL,
    p_opacity DECIMAL(3,2) DEFAULT NULL,
    p_data JSONB DEFAULT NULL,
    p_visible_to_players BOOLEAN DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
    UPDATE public.vtt_map_elements SET
        x = COALESCE(p_x, x),
        y = COALESCE(p_y, y),
        width = COALESCE(p_width, width),
        height = COALESCE(p_height, height),
        color = COALESCE(p_color, color),
        stroke_width = COALESCE(p_stroke_width, stroke_width),
        opacity = COALESCE(p_opacity, opacity),
        data = COALESCE(p_data, data),
        visible_to_players = COALESCE(p_visible_to_players, visible_to_players),
        updated_at = NOW()
    WHERE id = p_element_id AND session_id = p_session_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Map element not found or access denied';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_vtt_token(
    p_token_id UUID,
    p_session_id UUID,
    p_x INTEGER DEFAULT NULL,
    p_y INTEGER DEFAULT NULL,
    p_size INTEGER DEFAULT NULL,
    p_color TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL,
    p_stats JSONB DEFAULT NULL,
    p_visible_to_players BOOLEAN DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
    UPDATE public.vtt_tokens SET
        x = COALESCE(p_x, x),
        y = COALESCE(p_y, y),
        size = COALESCE(p_size, size),
        color = COALESCE(p_color, color),
        image_url = COALESCE(p_image_url, image_url),
        stats = COALESCE(p_stats, stats),
        visible_to_players = COALESCE(p_visible_to_players, visible_to_players),
        updated_at = NOW()
    WHERE id = p_token_id AND session_id = p_session_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Token not found or access denied';
    END IF;
END;
$$;

-- VTT audio: enforce session_id usage
CREATE OR REPLACE FUNCTION public.update_vtt_audio_track(
    p_track_id UUID,
    p_session_id UUID,
    p_name TEXT DEFAULT NULL,
    p_type TEXT DEFAULT NULL,
    p_url TEXT DEFAULT NULL,
    p_volume DECIMAL(3,2) DEFAULT NULL,
    p_loop BOOLEAN DEFAULT NULL,
    p_is_playing BOOLEAN DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
    UPDATE public.vtt_audio_tracks SET
        name = COALESCE(p_name, name),
        type = COALESCE(p_type, type),
        url = COALESCE(p_url, url),
        volume = COALESCE(p_volume, volume),
        loop = COALESCE(p_loop, loop),
        is_playing = COALESCE(p_is_playing, is_playing),
        updated_at = NOW()
    WHERE id = p_track_id AND session_id = p_session_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Audio track not found or access denied';
    END IF;
END;
$$;

-- 3) Level gate validator: use v_required_level and v_char_path in responses
CREATE OR REPLACE FUNCTION public.validate_level_gate(
  p_character_id UUID,
  p_selection_type TEXT, -- 'feature', 'path', 'power', 'asi'
  p_selection_id UUID DEFAULT NULL,
  p_power_level INTEGER DEFAULT NULL
)
RETURNS TABLE (allowed BOOLEAN, reason TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_char_level INTEGER;
  v_char_job TEXT;
  v_char_path TEXT;
  v_required_level INTEGER := NULL;
  v_path_level INTEGER;
  v_feature_level INTEGER;
BEGIN
  SELECT level, job, path INTO v_char_level, v_char_job, v_char_path
  FROM public.characters
  WHERE id = p_character_id;

  IF v_char_level IS NULL THEN
    RETURN QUERY SELECT false, 'Character not found.'::TEXT;
    RETURN;
  END IF;

  CASE p_selection_type
    WHEN 'path' THEN
      IF p_selection_id IS NULL THEN
        RETURN QUERY SELECT false, 'Path ID required.'::TEXT;
        RETURN;
      END IF;
      SELECT jp.path_level INTO v_path_level
      FROM public.compendium_job_paths jp
      WHERE jp.id = p_selection_id;
      v_required_level := v_path_level;
      IF v_path_level IS NULL THEN
        RETURN QUERY SELECT false, 'Path not found.'::TEXT;
        RETURN;
      END IF;
      IF v_char_level >= v_path_level THEN
        RETURN QUERY SELECT true, format('Path unlocks at level %s for %s. Character (%s) is level %s.', v_required_level, COALESCE(v_char_path, 'no path'), v_char_job, v_char_level);
      ELSE
        RETURN QUERY SELECT false, format('Path requires level %s. Character (%s, current path: %s) is level %s.', v_required_level, v_char_job, COALESCE(v_char_path, 'none'), v_char_level);
      END IF;
      RETURN;

    WHEN 'feature' THEN
      IF p_selection_id IS NULL THEN
        RETURN QUERY SELECT false, 'Feature ID required.'::TEXT;
        RETURN;
      END IF;
      SELECT jf.level INTO v_feature_level
      FROM public.compendium_job_features jf
      WHERE jf.id = p_selection_id;
      v_required_level := v_feature_level;
      IF v_feature_level IS NULL THEN
        RETURN QUERY SELECT false, 'Feature not found.'::TEXT;
        RETURN;
      END IF;
      IF v_char_level >= v_feature_level THEN
        RETURN QUERY SELECT true, format('Feature unlocks at level %s; character level %s meets requirement.', v_required_level, v_char_level);
      ELSE
        RETURN QUERY SELECT false, format('Feature requires level %s; character (%s, path: %s) is level %s.', v_required_level, v_char_job, COALESCE(v_char_path, 'none'), v_char_level);
      END IF;
      RETURN;

    WHEN 'power' THEN
      IF p_power_level IS NULL OR p_power_level <= 0 THEN
        RETURN QUERY SELECT true, 'Cantrips are always accessible.'::TEXT;
        RETURN;
      END IF;
      DECLARE
        v_max_power_level INTEGER := 0;
        v_job_lower TEXT := lower(COALESCE(v_char_job, ''));
      BEGIN
        IF v_job_lower IN ('mage', 'necromancer', 'technomancer', 'oracle', 'resonant', 'invoker') THEN
          v_max_power_level := CASE
            WHEN v_char_level >= 17 THEN 9
            WHEN v_char_level >= 15 THEN 8
            WHEN v_char_level >= 13 THEN 7
            WHEN v_char_level >= 11 THEN 6
            WHEN v_char_level >= 9 THEN 5
            WHEN v_char_level >= 7 THEN 4
            WHEN v_char_level >= 5 THEN 3
            WHEN v_char_level >= 3 THEN 2
            ELSE 1
          END;
        ELSIF v_job_lower IN ('crusader', 'stalker') THEN
          v_max_power_level := CASE
            WHEN v_char_level >= 17 THEN 5
            WHEN v_char_level >= 13 THEN 4
            WHEN v_char_level >= 9 THEN 3
            WHEN v_char_level >= 5 THEN 2
            WHEN v_char_level >= 2 THEN 1
            ELSE 0
          END;
        ELSIF v_job_lower = 'contractor' THEN
          v_max_power_level := CASE
            WHEN v_char_level >= 9 THEN 5
            WHEN v_char_level >= 7 THEN 4
            WHEN v_char_level >= 5 THEN 3
            WHEN v_char_level >= 3 THEN 2
            ELSE 1
          END;
        END IF;
        v_required_level := v_max_power_level; -- reuse variable for messaging
        IF v_max_power_level <= 0 THEN
          RETURN QUERY SELECT false, format('Job "%s" has no spellcasting at level %s (path: %s).', v_char_job, v_char_level, COALESCE(v_char_path, 'none'));
        ELSIF p_power_level > v_max_power_level THEN
          RETURN QUERY SELECT false, format('Power level %s exceeds max %s for job "%s" at level %s.', p_power_level, v_required_level, v_char_job, v_char_level);
        ELSE
          RETURN QUERY SELECT true, format('Power level %s is accessible (max %s) for job "%s" path "%s".', p_power_level, v_required_level, v_char_job, COALESCE(v_char_path, 'none'));
        END IF;
        RETURN;
      END;

    WHEN 'asi' THEN
      DECLARE
        v_is_asi_level BOOLEAN := false;
      BEGIN
        IF v_char_level IN (4, 8, 12, 16, 19) THEN
          v_is_asi_level := true;
          v_required_level := v_char_level;
        END IF;
        IF lower(COALESCE(v_char_job, '')) = 'vanguard' AND v_char_level IN (6, 14) THEN
          v_is_asi_level := true;
          v_required_level := v_char_level;
        ELSIF lower(COALESCE(v_char_job, '')) = 'assassin' AND v_char_level = 10 THEN
          v_is_asi_level := true;
          v_required_level := v_char_level;
        END IF;
        IF v_is_asi_level THEN
          RETURN QUERY SELECT true, format('Level %s is an ASI/Feat opportunity for job "%s" (path: %s).', v_required_level, v_char_job, COALESCE(v_char_path, 'none'));
        ELSE
          RETURN QUERY SELECT false, format('Level %s is not an ASI/Feat opportunity for job "%s" (path: %s).', v_char_level, v_char_job, COALESCE(v_char_path, 'none'));
        END IF;
        RETURN;
      END;

    ELSE
      RETURN QUERY SELECT false, format('Unknown selection type: %s', p_selection_type);
      RETURN;
  END CASE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_level_gate(UUID, TEXT, UUID, INTEGER) TO authenticated;
