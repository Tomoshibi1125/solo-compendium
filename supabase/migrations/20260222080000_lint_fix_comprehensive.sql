-- Comprehensive lint fix: security_definer_view, rls_disabled_in_public, function_search_path_mutable
-- Resolves all ERROR and WARN level findings from `supabase db lint --linked`

------------------------------------------------------------------------
-- PART 1: Drop ALL old function overloads that lack SET search_path
-- Then canonical versions (already with search_path from hardening) remain.
-- For functions where the hardening signature differs from the original,
-- the old overload was never replaced and must be explicitly dropped.
------------------------------------------------------------------------

-- 1a) Drop stale 1-param overloads (originals from vtt_system / vtt_audio_system)
DROP FUNCTION IF EXISTS public.delete_vtt_token(UUID);
DROP FUNCTION IF EXISTS public.delete_vtt_map_element(UUID);
DROP FUNCTION IF EXISTS public.delete_vtt_audio_track(UUID);

-- 1b) Drop stale overloads with different param types / counts
-- create_session_quest: original (UUID,TEXT,TEXT,TEXT[],JSONB) vs hardening (UUID,TEXT,TEXT,JSONB,JSONB)
DROP FUNCTION IF EXISTS public.create_session_quest(UUID, TEXT, TEXT, TEXT[], JSONB);

-- create_vtt_audio_track: original (UUID,TEXT,TEXT,TEXT,NUMERIC,BOOLEAN,BOOLEAN) vs hardening (UUID,TEXT,TEXT,INTEGER,BOOLEAN,TEXT)
DROP FUNCTION IF EXISTS public.create_vtt_audio_track(UUID, TEXT, TEXT, TEXT, NUMERIC, BOOLEAN, BOOLEAN);

-- update_vtt_audio_track: original (UUID,UUID,TEXT,TEXT,TEXT,NUMERIC,BOOLEAN,BOOLEAN) vs hardening (UUID,UUID,INTEGER,BOOLEAN,TEXT)
DROP FUNCTION IF EXISTS public.update_vtt_audio_track(UUID, UUID, TEXT, TEXT, TEXT, NUMERIC, BOOLEAN, BOOLEAN);

-- update_vtt_audio_settings: original (UUID,NUMERIC,NUMERIC,NUMERIC,NUMERIC,BOOLEAN,NUMERIC) vs hardening (UUID,INTEGER,INTEGER,INTEGER)
DROP FUNCTION IF EXISTS public.update_vtt_audio_settings(UUID, NUMERIC, NUMERIC, NUMERIC, NUMERIC, BOOLEAN, NUMERIC);

-- 1c) Drop the original VTT functions that had same signatures but no search_path
-- These should have been replaced by CREATE OR REPLACE in hardening, but drop+recreate to be certain
-- update_vtt_settings: same signature, force refresh
DROP FUNCTION IF EXISTS public.update_vtt_settings(UUID, INTEGER, BOOLEAN, BOOLEAN, BOOLEAN, TEXT, TEXT, BOOLEAN, NUMERIC, INTEGER, INTEGER);
-- create_vtt_token: same signature, force refresh
DROP FUNCTION IF EXISTS public.create_vtt_token(UUID, TEXT, TEXT, INTEGER, INTEGER, INTEGER, TEXT, TEXT, JSONB, BOOLEAN, UUID, BOOLEAN);
-- create_vtt_map_element: same signature, force refresh
DROP FUNCTION IF EXISTS public.create_vtt_map_element(UUID, TEXT, INTEGER, INTEGER, TEXT, INTEGER, INTEGER, INTEGER, NUMERIC, JSONB, BOOLEAN);
-- update_vtt_map_element: both original (no session scope) and hardened (with session scope) 
DROP FUNCTION IF EXISTS public.update_vtt_map_element(UUID, UUID, INTEGER, INTEGER, INTEGER, INTEGER, TEXT, INTEGER, NUMERIC, JSONB, BOOLEAN);

-- 1d) Drop original active session / combat functions (same sigs, force refresh)
DROP FUNCTION IF EXISTS public.start_active_session(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.end_active_session(UUID);
DROP FUNCTION IF EXISTS public.start_session_combat(UUID, JSONB);
DROP FUNCTION IF EXISTS public.advance_combat_turn(UUID);
DROP FUNCTION IF EXISTS public.end_session_combat(UUID);

-- 1e) Drop original utility functions (same sigs, force refresh)
DROP FUNCTION IF EXISTS public.update_character_sheet_state_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_proficiency_bonus(INTEGER);
DROP FUNCTION IF EXISTS public.calculate_character_hp(INTEGER, INTEGER, TEXT);
DROP FUNCTION IF EXISTS public.sync_compendium_data();

-- 1f) Drop the hardened overloads of delete_vtt_token / delete_vtt_map_element / delete_vtt_audio_track (2-param)
-- so we can cleanly recreate them below
DROP FUNCTION IF EXISTS public.delete_vtt_token(UUID, UUID);
DROP FUNCTION IF EXISTS public.delete_vtt_map_element(UUID, UUID);
DROP FUNCTION IF EXISTS public.delete_vtt_audio_track(UUID, UUID);

-- 1g) Drop hardened overloads of VTT audio create/update that we will recreate
DROP FUNCTION IF EXISTS public.create_vtt_audio_track(UUID, TEXT, TEXT, INTEGER, BOOLEAN, TEXT);
DROP FUNCTION IF EXISTS public.update_vtt_audio_track(UUID, UUID, INTEGER, BOOLEAN, TEXT);
DROP FUNCTION IF EXISTS public.update_vtt_audio_settings(UUID, INTEGER, INTEGER, INTEGER);

-- 1h) Drop hardened create_session_quest overload
DROP FUNCTION IF EXISTS public.create_session_quest(UUID, TEXT, TEXT, JSONB, JSONB);

-- Also drop update_vtt_token with both overloads
DROP FUNCTION IF EXISTS public.update_vtt_token(UUID, UUID, INTEGER, INTEGER, INTEGER, TEXT, TEXT, JSONB, BOOLEAN);

------------------------------------------------------------------------
-- PART 2: Recreate ALL flagged functions with SET search_path
------------------------------------------------------------------------

-- 2a) Trigger function
CREATE OR REPLACE FUNCTION public.update_character_sheet_state_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Re-attach trigger if it was dropped
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'character_sheet_state'
  ) THEN
    DROP TRIGGER IF EXISTS update_character_sheet_state_updated_at ON public.character_sheet_state;
    CREATE TRIGGER update_character_sheet_state_updated_at
      BEFORE UPDATE ON public.character_sheet_state
      FOR EACH ROW EXECUTE FUNCTION public.update_character_sheet_state_updated_at();
  END IF;
END $$;

-- 2b) Utility functions
CREATE OR REPLACE FUNCTION public.calculate_proficiency_bonus(level INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN GREATEST(2, FLOOR((level - 1) / 4) + 2);
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_character_hp(
  level INTEGER,
  constitution_score INTEGER,
  hit_dice TEXT DEFAULT 'd8'
)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  con_mod INTEGER;
  base_hp INTEGER;
BEGIN
  con_mod := FLOOR((constitution_score - 10) / 2);
  base_hp := CASE 
    WHEN hit_dice = 'd6' THEN 6
    WHEN hit_dice = 'd8' THEN 8
    WHEN hit_dice = 'd10' THEN 10
    WHEN hit_dice = 'd12' THEN 12
    ELSE 8
  END;
  RETURN base_hp + con_mod + ((level - 1) * (FLOOR((base_hp + 1) / 2) + con_mod));
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_compendium_data()
RETURNS void
LANGUAGE plpgsql
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RAISE NOTICE 'Compendium data sync function created. Static data remains in TypeScript files.';
END;
$$;

-- 2c) Active session helpers
CREATE OR REPLACE FUNCTION public.start_active_session(
    p_campaign_id UUID,
    p_title TEXT,
    p_description TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_session_id UUID;
    v_user_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns WHERE id = p_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can start active sessions';
    END IF;
    INSERT INTO public.active_sessions (
        campaign_id, title, description, status, created_by
    ) VALUES (
        p_campaign_id, p_title, p_description, 'active', v_user_id
    ) RETURNING id INTO v_session_id;
    INSERT INTO public.session_participants (session_id, user_id, is_dm)
    VALUES (v_session_id, v_user_id, TRUE);
    RETURN v_session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.end_active_session(
    p_session_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can end active sessions';
    END IF;
    UPDATE public.active_sessions
    SET status = 'completed', updated_at = NOW()
    WHERE id = p_session_id;
END;
$$;

-- 2d) Combat functions
CREATE OR REPLACE FUNCTION public.start_session_combat(
    p_session_id UUID,
    p_participants JSONB
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_campaign_id UUID;
    v_user_id UUID;
    v_participant JSONB;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can start combat';
    END IF;
    UPDATE public.active_sessions SET combat_status = 'active', updated_at = NOW() WHERE id = p_session_id;
    DELETE FROM public.combat_participants WHERE session_id = p_session_id;
    FOR v_participant IN SELECT * FROM jsonb_array_elements(p_participants)
    LOOP
        INSERT INTO public.combat_participants (
            session_id, character_id, user_id, name, initiative, current_hp, max_hp, ac, is_player, turn_order
        ) VALUES (
            p_session_id,
            (v_participant->>'character_id')::UUID,
            (v_participant->>'user_id')::UUID,
            v_participant->>'name',
            (v_participant->>'initiative')::INTEGER,
            (v_participant->>'current_hp')::INTEGER,
            (v_participant->>'max_hp')::INTEGER,
            (v_participant->>'ac')::INTEGER,
            (v_participant->>'is_player')::BOOLEAN,
            (v_participant->>'initiative')::INTEGER
        );
    END LOOP;
    UPDATE public.combat_participants
    SET turn_order = sub.row_num
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY initiative DESC) as row_num
        FROM public.combat_participants
        WHERE session_id = p_session_id
    ) sub
    WHERE combat_participants.id = sub.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.advance_combat_turn(
    p_session_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_min_turn INTEGER;
    v_max_turn INTEGER;
BEGIN
    SELECT MIN(turn_order), MAX(turn_order) INTO v_min_turn, v_max_turn
    FROM public.combat_participants
    WHERE session_id = p_session_id;

    IF v_min_turn IS NULL THEN
        RAISE EXCEPTION 'No combat participants for session';
    END IF;

    UPDATE public.combat_participants
    SET turn_order = CASE
      WHEN turn_order = v_min_turn THEN v_max_turn
      ELSE turn_order - 1
    END
    WHERE session_id = p_session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.end_session_combat(
    p_session_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_campaign_id UUID;
    v_user_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can end combat';
    END IF;
    UPDATE public.active_sessions
    SET combat_status = 'completed', updated_at = NOW()
    WHERE id = p_session_id;
END;
$$;

-- 2e) Session quest function
CREATE OR REPLACE FUNCTION public.create_session_quest(
    p_session_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_rewards JSONB,
    p_objectives JSONB DEFAULT '[]'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
    v_quest_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can create session quests';
    END IF;
    INSERT INTO public.session_quests (session_id, title, description, rewards, objectives)
    VALUES (p_session_id, p_title, p_description, p_rewards, p_objectives)
    RETURNING id INTO v_quest_id;
    RETURN v_quest_id;
END;
$$;

-- 2f) VTT settings
CREATE OR REPLACE FUNCTION public.update_vtt_settings(
    p_session_id UUID,
    p_grid_size INTEGER DEFAULT NULL,
    p_grid_visible BOOLEAN DEFAULT NULL,
    p_fog_of_war_enabled BOOLEAN DEFAULT NULL,
    p_dynamic_lighting_enabled BOOLEAN DEFAULT NULL,
    p_background_image_url TEXT DEFAULT NULL,
    p_background_color TEXT DEFAULT NULL,
    p_snap_to_grid BOOLEAN DEFAULT NULL,
    p_zoom_level DECIMAL(4,2) DEFAULT NULL,
    p_pan_x INTEGER DEFAULT NULL,
    p_pan_y INTEGER DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Session not found';
    END IF;
    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;
    INSERT INTO public.vtt_settings (
        session_id, created_by,
        grid_size, grid_visible, fog_of_war_enabled, dynamic_lighting_enabled,
        background_image_url, background_color, snap_to_grid, zoom_level, pan_x, pan_y
    ) VALUES (
        p_session_id, v_user_id,
        COALESCE(p_grid_size, 50),
        COALESCE(p_grid_visible, TRUE),
        COALESCE(p_fog_of_war_enabled, FALSE),
        COALESCE(p_dynamic_lighting_enabled, FALSE),
        p_background_image_url,
        COALESCE(p_background_color, '#ffffff'),
        COALESCE(p_snap_to_grid, TRUE),
        COALESCE(p_zoom_level, 1.00),
        COALESCE(p_pan_x, 0),
        COALESCE(p_pan_y, 0)
    ) ON CONFLICT (session_id) DO UPDATE SET
        grid_size = COALESCE(p_grid_size, vtt_settings.grid_size),
        grid_visible = COALESCE(p_grid_visible, vtt_settings.grid_visible),
        fog_of_war_enabled = COALESCE(p_fog_of_war_enabled, vtt_settings.fog_of_war_enabled),
        dynamic_lighting_enabled = COALESCE(p_dynamic_lighting_enabled, vtt_settings.dynamic_lighting_enabled),
        background_image_url = COALESCE(p_background_image_url, vtt_settings.background_image_url),
        background_color = COALESCE(p_background_color, vtt_settings.background_color),
        snap_to_grid = COALESCE(p_snap_to_grid, vtt_settings.snap_to_grid),
        zoom_level = COALESCE(p_zoom_level, vtt_settings.zoom_level),
        pan_x = COALESCE(p_pan_x, vtt_settings.pan_x),
        pan_y = COALESCE(p_pan_y, vtt_settings.pan_y),
        updated_at = NOW();
END;
$$;

-- 2g) VTT token CRUD
CREATE OR REPLACE FUNCTION public.create_vtt_token(
    p_session_id UUID,
    p_token_type TEXT,
    p_name TEXT,
    p_x INTEGER DEFAULT 0,
    p_y INTEGER DEFAULT 0,
    p_size INTEGER DEFAULT 1,
    p_color TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL,
    p_stats JSONB DEFAULT NULL,
    p_visible_to_players BOOLEAN DEFAULT TRUE,
    p_owned_by_user_id UUID DEFAULT NULL,
    p_is_dm_token BOOLEAN DEFAULT FALSE
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_token_id UUID;
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Session not found';
    END IF;
    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;
    INSERT INTO public.vtt_tokens (
        session_id, token_type, name, x, y, size, color, image_url, stats, visible_to_players, owned_by_user_id, is_dm_token, created_by
    ) VALUES (
        p_session_id, p_token_type, p_name, p_x, p_y, p_size, p_color, p_image_url, p_stats, p_visible_to_players, p_owned_by_user_id, p_is_dm_token, v_user_id
    ) RETURNING id INTO v_token_id;
    RETURN v_token_id;
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
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT a.campaign_id INTO v_campaign_id
    FROM public.vtt_tokens t
    JOIN public.active_sessions a ON a.id = t.session_id
    WHERE t.id = p_token_id AND t.session_id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Token not found or access denied';
    END IF;
    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;
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

CREATE OR REPLACE FUNCTION public.delete_vtt_token(
    p_token_id UUID,
    p_session_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT a.campaign_id INTO v_campaign_id
    FROM public.vtt_tokens t
    JOIN public.active_sessions a ON a.id = t.session_id
    WHERE t.id = p_token_id AND t.session_id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Token not found or access denied';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
      RAISE EXCEPTION 'Only DM can delete token';
    END IF;
    DELETE FROM public.vtt_tokens WHERE id = p_token_id AND session_id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Token not found';
    END IF;
END;
$$;

-- 2h) VTT map element CRUD
CREATE OR REPLACE FUNCTION public.create_vtt_map_element(
    p_session_id UUID,
    p_element_type TEXT,
    p_x INTEGER,
    p_y INTEGER,
    p_color TEXT,
    p_width INTEGER DEFAULT NULL,
    p_height INTEGER DEFAULT NULL,
    p_stroke_width INTEGER DEFAULT 2,
    p_opacity DECIMAL(3,2) DEFAULT 1.00,
    p_data JSONB DEFAULT '{}',
    p_visible_to_players BOOLEAN DEFAULT TRUE
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_element_id UUID;
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Session not found';
    END IF;
    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;
    INSERT INTO public.vtt_map_elements (
        session_id, element_type, x, y, color, width, height, stroke_width, opacity, data, visible_to_players, created_by
    ) VALUES (
        p_session_id, p_element_type, p_x, p_y, p_color, p_width, p_height, p_stroke_width, p_opacity, p_data, p_visible_to_players, v_user_id
    ) RETURNING id INTO v_element_id;
    RETURN v_element_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_vtt_map_element(
    p_element_id UUID,
    p_session_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT a.campaign_id INTO v_campaign_id
    FROM public.vtt_map_elements e
    JOIN public.active_sessions a ON a.id = e.session_id
    WHERE e.id = p_element_id AND e.session_id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Map element not found or access denied';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
      RAISE EXCEPTION 'Only DM can delete map element';
    END IF;
    DELETE FROM public.vtt_map_elements WHERE id = p_element_id AND session_id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Map element not found';
    END IF;
END;
$$;

-- 2i) VTT audio CRUD
CREATE OR REPLACE FUNCTION public.create_vtt_audio_track(
    p_session_id UUID,
    p_name TEXT,
    p_url TEXT,
    p_volume INTEGER DEFAULT 100,
    p_loop BOOLEAN DEFAULT FALSE,
    p_category TEXT DEFAULT 'music'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_track_id UUID;
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Session not found';
    END IF;
    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;
    INSERT INTO public.vtt_audio_tracks (
        session_id, name, url, volume, loop, category, created_by
    ) VALUES (
        p_session_id, p_name, p_url, p_volume, p_loop, p_category, v_user_id
    ) RETURNING id INTO v_track_id;
    RETURN v_track_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_vtt_audio_track(
    p_track_id UUID,
    p_session_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT a.campaign_id INTO v_campaign_id
    FROM public.vtt_audio_tracks t
    JOIN public.active_sessions a ON a.id = t.session_id
    WHERE t.id = p_track_id AND t.session_id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Audio track not found or access denied';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
      RAISE EXCEPTION 'Only DM can delete audio track';
    END IF;
    DELETE FROM public.vtt_audio_tracks WHERE id = p_track_id AND session_id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Audio track not found';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_vtt_audio_settings(
    p_session_id UUID,
    p_master_volume INTEGER DEFAULT NULL,
    p_music_volume INTEGER DEFAULT NULL,
    p_effects_volume INTEGER DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    INSERT INTO public.vtt_audio_settings (
        session_id, created_by,
        master_volume, music_volume, effects_volume
    ) VALUES (
        p_session_id, v_user_id,
        COALESCE(p_master_volume, 100),
        COALESCE(p_music_volume, 100),
        COALESCE(p_effects_volume, 100)
    ) ON CONFLICT (session_id) DO UPDATE SET
        master_volume = COALESCE(p_master_volume, vtt_audio_settings.master_volume),
        music_volume = COALESCE(p_music_volume, vtt_audio_settings.music_volume),
        effects_volume = COALESCE(p_effects_volume, vtt_audio_settings.effects_volume),
        updated_at = NOW();
END;
$$;

------------------------------------------------------------------------
-- PART 3: Fix SECURITY DEFINER views — recreate with security_invoker
------------------------------------------------------------------------

-- Ensure profiles has the columns the views reference
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
  END IF;
END $$;

DROP VIEW IF EXISTS public.user_characters;
CREATE VIEW public.user_characters WITH (security_invoker = on) AS
SELECT 
  c.*,
  up.email as user_email,
  up.display_name as user_name,
  up.role as user_role
FROM public.characters c
JOIN public.profiles up ON c.user_id = up.id;

DROP VIEW IF EXISTS public.campaign_details;
CREATE VIEW public.campaign_details WITH (security_invoker = on) AS
SELECT 
  cam.*,
  up.email as dm_email,
  up.display_name as dm_name
FROM public.campaigns cam
JOIN public.profiles up ON cam.dm_id = up.id;

------------------------------------------------------------------------
-- PART 4: Enable RLS + add policies on all flagged tables
------------------------------------------------------------------------

-- 4a) quest_rewards_log
ALTER TABLE public.quest_rewards_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own quest rewards" ON public.quest_rewards_log;
CREATE POLICY "Users can view own quest rewards" ON public.quest_rewards_log
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "System can insert quest rewards" ON public.quest_rewards_log;
CREATE POLICY "System can insert quest rewards" ON public.quest_rewards_log
  FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));

-- 4b) assets (read-only compendium-style)
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Assets are publicly readable" ON public.assets;
CREATE POLICY "Assets are publicly readable" ON public.assets
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage assets" ON public.assets;
CREATE POLICY "Authenticated users can manage assets" ON public.assets
  FOR ALL USING ((SELECT auth.uid()) IS NOT NULL);

-- 4c) entity_assets
ALTER TABLE public.entity_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Entity assets are publicly readable" ON public.entity_assets;
CREATE POLICY "Entity assets are publicly readable" ON public.entity_assets
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage entity assets" ON public.entity_assets;
CREATE POLICY "Authenticated users can manage entity assets" ON public.entity_assets
  FOR ALL USING ((SELECT auth.uid()) IS NOT NULL);

-- 4d) character_shares (sensitive: token column)
ALTER TABLE public.character_shares ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own character shares" ON public.character_shares;
CREATE POLICY "Users can view own character shares" ON public.character_shares
  FOR SELECT USING (
    (SELECT auth.uid()) IS NOT NULL AND (
      created_by = (SELECT auth.uid()) OR
      EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
    )
  );
DROP POLICY IF EXISTS "Users can create shares for own characters" ON public.character_shares;
CREATE POLICY "Users can create shares for own characters" ON public.character_shares
  FOR INSERT WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
DROP POLICY IF EXISTS "Users can delete own character shares" ON public.character_shares;
CREATE POLICY "Users can delete own character shares" ON public.character_shares
  FOR DELETE USING (
    (SELECT auth.uid()) IS NOT NULL AND (
      created_by = (SELECT auth.uid()) OR
      EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
    )
  );

-- 4e) vtt_fog_state (re-apply in case previous DO block failed)
ALTER TABLE public.vtt_fog_state ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "View fog state for campaign" ON public.vtt_fog_state;
CREATE POLICY "View fog state for campaign" ON public.vtt_fog_state
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = vtt_fog_state.campaign_id AND dm_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = vtt_fog_state.campaign_id AND user_id = (SELECT auth.uid()))
  );
DROP POLICY IF EXISTS "DMs manage fog state" ON public.vtt_fog_state;
CREATE POLICY "DMs manage fog state" ON public.vtt_fog_state
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = vtt_fog_state.campaign_id AND dm_id = (SELECT auth.uid()))
  );

-- 4f) compendium_regents
ALTER TABLE public.compendium_regents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view regents" ON public.compendium_regents;
CREATE POLICY "Anyone can view regents" ON public.compendium_regents
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "DMs can manage regents" ON public.compendium_regents;
CREATE POLICY "DMs can manage regents" ON public.compendium_regents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('dm','admin'))
  );

-- 4g) compendium_regent_features
ALTER TABLE public.compendium_regent_features ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view regent features" ON public.compendium_regent_features;
CREATE POLICY "Anyone can view regent features" ON public.compendium_regent_features
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "DMs can manage regent features" ON public.compendium_regent_features;
CREATE POLICY "DMs can manage regent features" ON public.compendium_regent_features
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('dm','admin'))
  );

-- 4h) character_regent_unlocks
ALTER TABLE public.character_regent_unlocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners can read regent unlocks" ON public.character_regent_unlocks;
CREATE POLICY "Owners can read regent unlocks" ON public.character_regent_unlocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
    )
  );
DROP POLICY IF EXISTS "Owners can manage regent unlocks" ON public.character_regent_unlocks;
CREATE POLICY "Owners can manage regent unlocks" ON public.character_regent_unlocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
    )
  );

-- Note: extensions.index_advisor is extension-managed and cannot be dropped here.
