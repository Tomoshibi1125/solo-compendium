-- Fix remaining lint errors: function bodies reference wrong column names/types

------------------------------------------------------------------------
-- 1) create_session_quest: objectives column is text[] but function inserts jsonb
--    Cast p_objectives from JSONB to text[] at insert time
------------------------------------------------------------------------
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
    v_objectives_arr TEXT[];
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
    -- Convert JSONB array to text[] for the objectives column
    SELECT COALESCE(array_agg(elem), '{}')
    INTO v_objectives_arr
    FROM jsonb_array_elements_text(p_objectives) AS elem;

    INSERT INTO public.session_quests (session_id, title, description, rewards, objectives, created_by)
    VALUES (p_session_id, p_title, p_description, p_rewards, v_objectives_arr, v_user_id)
    RETURNING id INTO v_quest_id;
    RETURN v_quest_id;
END;
$$;

------------------------------------------------------------------------
-- 2) create_vtt_audio_track: table has "type" column, not "category"
--    Rewrite to use the actual column names from vtt_audio_tracks
------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.create_vtt_audio_track(UUID, TEXT, TEXT, INTEGER, BOOLEAN, TEXT);
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
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;
    INSERT INTO public.vtt_audio_tracks (
        session_id, name, type, url, volume, loop, created_by
    ) VALUES (
        p_session_id, p_name, p_type, p_url, p_volume, p_loop, v_user_id
    ) RETURNING id INTO v_track_id;
    RETURN v_track_id;
END;
$$;

------------------------------------------------------------------------
-- 3) update_vtt_audio_settings: table has master_volume, music_volume,
--    ambient_volume, sfx_volume, voice_chat_enabled, voice_chat_volume
--    (all DECIMAL(3,2)), not effects_volume (INTEGER)
------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_vtt_audio_settings(
    p_session_id UUID,
    p_master_volume DECIMAL(3,2) DEFAULT NULL,
    p_music_volume DECIMAL(3,2) DEFAULT NULL,
    p_ambient_volume DECIMAL(3,2) DEFAULT NULL,
    p_sfx_volume DECIMAL(3,2) DEFAULT NULL,
    p_voice_chat_enabled BOOLEAN DEFAULT NULL,
    p_voice_chat_volume DECIMAL(3,2) DEFAULT NULL
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
        master_volume, music_volume, ambient_volume, sfx_volume, voice_chat_enabled, voice_chat_volume
    ) VALUES (
        p_session_id, v_user_id,
        COALESCE(p_master_volume, 1.00),
        COALESCE(p_music_volume, 1.00),
        COALESCE(p_ambient_volume, 1.00),
        COALESCE(p_sfx_volume, 1.00),
        COALESCE(p_voice_chat_enabled, FALSE),
        COALESCE(p_voice_chat_volume, 1.00)
    ) ON CONFLICT (session_id) DO UPDATE SET
        master_volume = COALESCE(p_master_volume, vtt_audio_settings.master_volume),
        music_volume = COALESCE(p_music_volume, vtt_audio_settings.music_volume),
        ambient_volume = COALESCE(p_ambient_volume, vtt_audio_settings.ambient_volume),
        sfx_volume = COALESCE(p_sfx_volume, vtt_audio_settings.sfx_volume),
        voice_chat_enabled = COALESCE(p_voice_chat_enabled, vtt_audio_settings.voice_chat_enabled),
        voice_chat_volume = COALESCE(p_voice_chat_volume, vtt_audio_settings.voice_chat_volume),
        updated_at = NOW();
END;
$$;

-- Drop the old INTEGER-param overload that no longer matches the table schema
DROP FUNCTION IF EXISTS public.update_vtt_audio_settings(UUID, INTEGER, INTEGER, INTEGER);
