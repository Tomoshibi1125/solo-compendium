-- Create VTT audio tracks table
CREATE TABLE IF NOT EXISTS public.vtt_audio_tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.active_sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('music', 'ambient', 'sfx')),
    url TEXT NOT NULL,
    volume DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    loop BOOLEAN NOT NULL DEFAULT FALSE,
    is_playing BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create VTT audio settings table
CREATE TABLE IF NOT EXISTS public.vtt_audio_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.active_sessions(id) ON DELETE CASCADE,
    master_volume DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    music_volume DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    ambient_volume DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    sfx_volume DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    voice_chat_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    voice_chat_volume DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id)
);

-- Enable RLS
ALTER TABLE public.vtt_audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vtt_audio_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vtt_audio_tracks
CREATE POLICY "Users can view VTT audio tracks in their sessions" ON public.vtt_audio_tracks
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns
                WHERE dm_id = auth.uid() OR id IN (
                    SELECT campaign_id FROM public.campaign_members WHERE user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "DMs can manage VTT audio tracks in their campaigns" ON public.vtt_audio_tracks
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns WHERE dm_id = auth.uid()
            )
        )
    );

-- RLS Policies for vtt_audio_settings
CREATE POLICY "Users can view VTT audio settings in their sessions" ON public.vtt_audio_settings
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns
                WHERE dm_id = auth.uid() OR id IN (
                    SELECT campaign_id FROM public.campaign_members WHERE user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "DMs can manage VTT audio settings in their campaigns" ON public.vtt_audio_settings
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns WHERE dm_id = auth.uid()
            )
        )
    );

-- Function to create VTT audio track
CREATE OR REPLACE FUNCTION public.create_vtt_audio_track(
    p_session_id UUID,
    p_name TEXT,
    p_type TEXT,
    p_url TEXT,
    p_volume DECIMAL(3,2) DEFAULT 1.00,
    p_loop BOOLEAN DEFAULT FALSE,
    p_is_playing BOOLEAN DEFAULT FALSE
) RETURNS UUID AS $$
DECLARE
    v_track_id UUID;
    v_user_id UUID;
BEGIN
    -- Get current user
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Create audio track
    INSERT INTO public.vtt_audio_tracks (
        session_id, name, type, url, volume, loop, is_playing, created_by
    ) VALUES (
        p_session_id, p_name, p_type, p_url, p_volume, p_loop, p_is_playing, v_user_id
    ) RETURNING id INTO v_track_id;

    RETURN v_track_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update VTT audio track
CREATE OR REPLACE FUNCTION public.update_vtt_audio_track(
    p_track_id UUID,
    p_session_id UUID,
    p_name TEXT DEFAULT NULL,
    p_type TEXT DEFAULT NULL,
    p_url TEXT DEFAULT NULL,
    p_volume DECIMAL(3,2) DEFAULT NULL,
    p_loop BOOLEAN DEFAULT NULL,
    p_is_playing BOOLEAN DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE public.vtt_audio_tracks SET
        name = COALESCE(p_name, name),
        type = COALESCE(p_type, type),
        url = COALESCE(p_url, url),
        volume = COALESCE(p_volume, volume),
        loop = COALESCE(p_loop, loop),
        is_playing = COALESCE(p_is_playing, is_playing),
        updated_at = NOW()
    WHERE id = p_track_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Audio track not found or access denied';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete VTT audio track
CREATE OR REPLACE FUNCTION public.delete_vtt_audio_track(p_track_id UUID) RETURNS VOID AS $$
BEGIN
    DELETE FROM public.vtt_audio_tracks WHERE id = p_track_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Audio track not found';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update VTT audio settings
CREATE OR REPLACE FUNCTION public.update_vtt_audio_settings(
    p_session_id UUID,
    p_master_volume DECIMAL(3,2) DEFAULT NULL,
    p_music_volume DECIMAL(3,2) DEFAULT NULL,
    p_ambient_volume DECIMAL(3,2) DEFAULT NULL,
    p_sfx_volume DECIMAL(3,2) DEFAULT NULL,
    p_voice_chat_enabled BOOLEAN DEFAULT NULL,
    p_voice_chat_volume DECIMAL(3,2) DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get current user
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Update or insert settings
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vtt_audio_tracks_session_id ON public.vtt_audio_tracks(session_id);
CREATE INDEX IF NOT EXISTS idx_vtt_audio_tracks_type ON public.vtt_audio_tracks(type);
CREATE INDEX IF NOT EXISTS idx_vtt_audio_settings_session_id ON public.vtt_audio_settings(session_id);

-- Enable realtime for VTT audio
ALTER PUBLICATION supabase_realtime ADD TABLE public.vtt_audio_tracks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vtt_audio_settings;
