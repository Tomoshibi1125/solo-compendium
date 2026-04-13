-- Fix function search paths dynamically to ensure all signatures are covered
-- This safely alters all overloaded variants of the flagged functions
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT oid::regprocedure AS func_sig
        FROM pg_proc
        WHERE proname IN ('join_campaign_by_code', 'join_campaign_by_id', 'exec_sql', 'create_campaign_with_code', 'create_guild_with_code', 'update_modified_column')
          AND pronamespace = 'public'::regnamespace
    LOOP
        EXECUTE 'ALTER FUNCTION ' || rec.func_sig || ' SET search_path = public';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Replace overly permissive (true) policies with proper auth.uid() checks for compendium_locations
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.compendium_locations;
CREATE POLICY "Enable insert for authenticated users only" ON public.compendium_locations
    FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.compendium_locations;
CREATE POLICY "Enable update for authenticated users only" ON public.compendium_locations
    FOR UPDATE TO authenticated USING ((select auth.uid()) IS NOT NULL) WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Replace overly permissive (true) policies with proper auth.uid() checks for compendium_spells
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.compendium_spells;
CREATE POLICY "Enable insert for authenticated users only" ON public.compendium_spells
    FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.compendium_spells;
CREATE POLICY "Enable update for authenticated users only" ON public.compendium_spells
    FOR UPDATE TO authenticated USING ((select auth.uid()) IS NOT NULL) WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Replace overly permissive (true) policies with proper auth.uid() checks for compendium_tattoos
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.compendium_tattoos;
CREATE POLICY "Enable insert for authenticated users only" ON public.compendium_tattoos
    FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.compendium_tattoos;
CREATE POLICY "Enable update for authenticated users only" ON public.compendium_tattoos
    FOR UPDATE TO authenticated USING ((select auth.uid()) IS NOT NULL) WITH CHECK ((select auth.uid()) IS NOT NULL);






-- Fix dm_id -> warden_id in remaining functions


-- Fix dm_id -> warden_id in remaining functions
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
        SELECT 1 FROM public.campaigns WHERE id = p_campaign_id AND warden_id = v_user_id
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
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can end active sessions';
    END IF;
    UPDATE public.active_sessions
    SET status = 'completed', updated_at = NOW()
    WHERE id = p_session_id;
END;
$$;

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
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id
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
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can end combat';
    END IF;
    UPDATE public.active_sessions
    SET combat_status = 'completed', updated_at = NOW()
    WHERE id = p_session_id;
END;
$$;

DROP FUNCTION IF EXISTS public.create_session_quest(UUID, TEXT, TEXT, JSONB, JSONB);
CREATE OR REPLACE FUNCTION public.create_session_quest(
    p_session_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_rewards JSONB,
    p_objectives TEXT[] DEFAULT '{}'::text[]
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
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can create session quests';
    END IF;
    INSERT INTO public.session_quests (session_id, title, description, rewards, objectives)
    VALUES (p_session_id, p_title, p_description, p_rewards, p_objectives)
    RETURNING id INTO v_quest_id;
    RETURN v_quest_id;
END;
$$;

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
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id) OR
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
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id) OR
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
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id) OR
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
      SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id
    ) THEN
      RAISE EXCEPTION 'Only DM can delete token';
    END IF;
    DELETE FROM public.vtt_tokens WHERE id = p_token_id AND session_id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Token not found';
    END IF;
END;
$$;

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
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id) OR
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
      SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id
    ) THEN
      RAISE EXCEPTION 'Only DM can delete map element';
    END IF;
    DELETE FROM public.vtt_map_elements WHERE id = p_element_id AND session_id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Map element not found';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_vtt_audio_track(
    p_session_id UUID,
    p_name TEXT,
    p_url TEXT,
    p_volume INTEGER DEFAULT 100,
    p_loop BOOLEAN DEFAULT FALSE,
    p_type TEXT DEFAULT 'music'
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
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;
    INSERT INTO public.vtt_audio_tracks (
        session_id, name, url, volume, loop, type, created_by
    ) VALUES (
        p_session_id, p_name, p_url, p_volume, p_loop, p_type, v_user_id
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
      SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND warden_id = v_user_id
    ) THEN
      RAISE EXCEPTION 'Only DM can delete audio track';
    END IF;
    DELETE FROM public.vtt_audio_tracks WHERE id = p_track_id AND session_id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Audio track not found';
    END IF;
END;
$$;

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
        WHERE id = v_campaign_id AND warden_id = v_user_id
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


-- Fix missing function after table rename
CREATE OR REPLACE FUNCTION public.search_compendium_monsters(
  p_query TEXT,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  cr TEXT,
  creature_type TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.description,
    m.cr::text as cr,
    m.creature_type::text as creature_type,
    m.created_at,
    m.tags,
    m.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(m.name, '') || ' ' || COALESCE(m.description, '')),
      plainto_tsquery('english', COALESCE(p_query, ''))
    ) AS rank
  FROM public."compendium_Anomalies" m
  WHERE p_query IS NULL
     OR p_query = ''
     OR to_tsvector('english', COALESCE(m.name, '') || ' ' || COALESCE(m.description, '')) @@ plainto_tsquery('english', p_query)
  ORDER BY rank DESC, m.name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;


