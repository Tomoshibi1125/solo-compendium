-- =============================================
-- PARITY REMEDIATION: Level Gating + Gemini/Regent Runtime State
-- =============================================
-- This migration adds:
--   1. gemini_state and regent runtime columns on characters
--   2. Level-gating validation function for feature/path/power choices
--   3. Backfill helpers for existing data

-- =============================================
-- 1. Characters: Gemini + Regent runtime state
-- =============================================

ALTER TABLE public.characters
  ADD COLUMN IF NOT EXISTS gemini_state JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS active_sovereign_id UUID REFERENCES public.saved_sovereigns(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.characters.gemini_state IS 'Runtime Gemini Protocol state: {sovereignId, isActive, fusionTheme, powerMultiplier, modifiers[]}';
COMMENT ON COLUMN public.characters.active_sovereign_id IS 'FK to the currently-active saved sovereign for Gemini Protocol';

-- =============================================
-- 2. Level-gating validation function
-- =============================================
-- Pure SQL function that validates whether a feature/path/power selection
-- is legal for a character at a given level. Returns true/false + reason.

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
  v_required_level INTEGER;
  v_path_level INTEGER;
  v_feature_level INTEGER;
BEGIN
  -- Get character info
  SELECT level, job, path INTO v_char_level, v_char_job, v_char_path
  FROM public.characters
  WHERE id = p_character_id;

  IF v_char_level IS NULL THEN
    RETURN QUERY SELECT false, 'Character not found.'::TEXT;
    RETURN;
  END IF;

  -- Validate based on selection type
  CASE p_selection_type

    WHEN 'path' THEN
      IF p_selection_id IS NULL THEN
        RETURN QUERY SELECT false, 'Path ID required.'::TEXT;
        RETURN;
      END IF;

      SELECT jp.path_level INTO v_path_level
      FROM public.compendium_job_paths jp
      WHERE jp.id = p_selection_id;

      IF v_path_level IS NULL THEN
        RETURN QUERY SELECT false, 'Path not found.'::TEXT;
        RETURN;
      END IF;

      IF v_char_level >= v_path_level THEN
        RETURN QUERY SELECT true, format('Path unlocks at level %s. Character is level %s.', v_path_level, v_char_level);
      ELSE
        RETURN QUERY SELECT false, format('Path requires level %s. Character is level %s.', v_path_level, v_char_level);
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

      IF v_feature_level IS NULL THEN
        RETURN QUERY SELECT false, 'Feature not found.'::TEXT;
        RETURN;
      END IF;

      IF v_char_level >= v_feature_level THEN
        RETURN QUERY SELECT true, format('Feature unlocks at level %s. Character is level %s.', v_feature_level, v_char_level);
      ELSE
        RETURN QUERY SELECT false, format('Feature requires level %s. Character is level %s.', v_feature_level, v_char_level);
      END IF;
      RETURN;

    WHEN 'power' THEN
      -- Power level gating: check max power level for the character's job at their level
      IF p_power_level IS NULL OR p_power_level <= 0 THEN
        -- Cantrips (level 0) are always accessible for casters
        RETURN QUERY SELECT true, 'Cantrips are always accessible.'::TEXT;
        RETURN;
      END IF;

      -- Use a simplified version of the 5e spell progression check
      DECLARE
        v_max_power_level INTEGER := 0;
        v_job_lower TEXT := lower(COALESCE(v_char_job, ''));
      BEGIN
        -- Full casters
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
        -- Half casters
        ELSIF v_job_lower IN ('crusader', 'stalker') THEN
          v_max_power_level := CASE
            WHEN v_char_level >= 17 THEN 5
            WHEN v_char_level >= 13 THEN 4
            WHEN v_char_level >= 9 THEN 3
            WHEN v_char_level >= 5 THEN 2
            WHEN v_char_level >= 2 THEN 1
            ELSE 0
          END;
        -- Pact caster
        ELSIF v_job_lower = 'contractor' THEN
          v_max_power_level := CASE
            WHEN v_char_level >= 9 THEN 5
            WHEN v_char_level >= 7 THEN 4
            WHEN v_char_level >= 5 THEN 3
            WHEN v_char_level >= 3 THEN 2
            ELSE 1
          END;
        END IF;

        IF v_max_power_level <= 0 THEN
          RETURN QUERY SELECT false, format('Job "%s" has no spellcasting at level %s.', v_char_job, v_char_level);
        ELSIF p_power_level > v_max_power_level THEN
          RETURN QUERY SELECT false, format('Power level %s exceeds max %s for job "%s" at level %s.', p_power_level, v_max_power_level, v_char_job, v_char_level);
        ELSE
          RETURN QUERY SELECT true, format('Power level %s is accessible (max: %s).', p_power_level, v_max_power_level);
        END IF;
        RETURN;
      END;

    WHEN 'asi' THEN
      -- Standard 5e ASI levels: 4, 8, 12, 16, 19
      -- Some jobs have extra ASI levels
      DECLARE
        v_is_asi_level BOOLEAN := false;
      BEGIN
        IF v_char_level IN (4, 8, 12, 16, 19) THEN
          v_is_asi_level := true;
        END IF;

        -- Job-specific overrides
        IF lower(COALESCE(v_char_job, '')) = 'vanguard' AND v_char_level IN (6, 14) THEN
          v_is_asi_level := true;
        ELSIF lower(COALESCE(v_char_job, '')) = 'assassin' AND v_char_level = 10 THEN
          v_is_asi_level := true;
        END IF;

        IF v_is_asi_level THEN
          RETURN QUERY SELECT true, format('Level %s is an ASI/Feat opportunity.', v_char_level);
        ELSE
          RETURN QUERY SELECT false, format('Level %s is not an ASI/Feat opportunity for job "%s".', v_char_level, v_char_job);
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

-- =============================================
-- 3. Backfill gemini_state for characters with active sovereign
-- =============================================

DO $$
BEGIN
  UPDATE public.characters c
  SET gemini_state = jsonb_build_object(
    'sovereignId', c.sovereign_id::text,
    'isActive', true,
    'fusionTheme', NULL,
    'powerMultiplier', NULL
  )
  WHERE c.sovereign_id IS NOT NULL
    AND (c.gemini_state IS NULL OR c.gemini_state = '{}'::jsonb);
END $$;
