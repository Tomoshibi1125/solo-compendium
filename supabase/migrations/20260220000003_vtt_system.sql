-- Create VTT settings table
CREATE TABLE IF NOT EXISTS public.vtt_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.active_sessions(id) ON DELETE CASCADE,
    grid_size INTEGER NOT NULL DEFAULT 50,
    grid_visible BOOLEAN NOT NULL DEFAULT TRUE,
    fog_of_war_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    dynamic_lighting_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    background_image_url TEXT,
    background_color TEXT NOT NULL DEFAULT '#ffffff',
    snap_to_grid BOOLEAN NOT NULL DEFAULT TRUE,
    zoom_level DECIMAL(4,2) NOT NULL DEFAULT 1.00,
    pan_x INTEGER NOT NULL DEFAULT 0,
    pan_y INTEGER NOT NULL DEFAULT 0,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id)
);

-- Create VTT tokens table
CREATE TABLE IF NOT EXISTS public.vtt_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.active_sessions(id) ON DELETE CASCADE,
    token_type TEXT NOT NULL CHECK (token_type IN ('player', 'monster', 'npc', 'object')),
    name TEXT NOT NULL,
    x INTEGER NOT NULL DEFAULT 0,
    y INTEGER NOT NULL DEFAULT 0,
    size INTEGER NOT NULL DEFAULT 1,
    color TEXT,
    image_url TEXT,
    stats JSONB,
    visible_to_players BOOLEAN NOT NULL DEFAULT TRUE,
    owned_by_user_id UUID REFERENCES auth.users(id), -- User who owns this token (for player characters)
    is_dm_token BOOLEAN NOT NULL DEFAULT FALSE, -- DM can move all tokens, players can only move their owned tokens
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create VTT map elements table
CREATE TABLE IF NOT EXISTS public.vtt_map_elements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.active_sessions(id) ON DELETE CASCADE,
    element_type TEXT NOT NULL CHECK (element_type IN ('drawing', 'note', 'door', 'trap', 'treasure')),
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    color TEXT NOT NULL,
    stroke_width INTEGER DEFAULT 2,
    opacity DECIMAL(3,2) DEFAULT 1.00,
    data JSONB NOT NULL DEFAULT '{}',
    visible_to_players BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vtt_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vtt_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vtt_map_elements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vtt_settings
CREATE POLICY "Users can view VTT settings in their sessions" ON public.vtt_settings
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

CREATE POLICY "DMs can manage VTT settings in their campaigns" ON public.vtt_settings
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns WHERE dm_id = auth.uid()
            )
        )
    );

-- RLS Policies for vtt_tokens
CREATE POLICY "Users can view VTT tokens in their sessions" ON public.vtt_tokens
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns
                WHERE dm_id = auth.uid() OR id IN (
                    SELECT campaign_id FROM public.campaign_members WHERE user_id = auth.uid()
                )
            )
        ) AND (visible_to_players = TRUE OR created_by = auth.uid())
    );

CREATE POLICY "DMs can manage VTT tokens in their campaigns" ON public.vtt_tokens
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns WHERE dm_id = auth.uid()
            )
        )
    );

-- RLS Policies for vtt_map_elements
CREATE POLICY "Users can view VTT map elements in their sessions" ON public.vtt_map_elements
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns
                WHERE dm_id = auth.uid() OR id IN (
                    SELECT campaign_id FROM public.campaign_members WHERE user_id = auth.uid()
                )
            )
        ) AND (visible_to_players = TRUE OR created_by = auth.uid())
    );

CREATE POLICY "DMs can manage VTT map elements in their campaigns" ON public.vtt_map_elements
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns WHERE dm_id = auth.uid()
            )
        )
    );

-- Function to update VTT settings
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create VTT token
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
) RETURNS UUID AS $$
DECLARE
    v_token_id UUID;
    v_user_id UUID;
BEGIN
    -- Get current user
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Create token
    INSERT INTO public.vtt_tokens (
        session_id, token_type, name, x, y, size, color, image_url, stats, visible_to_players, owned_by_user_id, is_dm_token, created_by
    ) VALUES (
        p_session_id, p_token_type, p_name, p_x, p_y, p_size, p_color, p_image_url, p_stats, p_visible_to_players, p_owned_by_user_id, p_is_dm_token, v_user_id
    ) RETURNING id INTO v_token_id;

    RETURN v_token_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update VTT token
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
) RETURNS VOID AS $$
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
    WHERE id = p_token_id;

    -- Check if token exists and belongs to session
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Token not found or access denied';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete VTT token
CREATE OR REPLACE FUNCTION public.delete_vtt_token(p_token_id UUID) RETURNS VOID AS $$
BEGIN
    DELETE FROM public.vtt_tokens WHERE id = p_token_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Token not found';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create VTT map element
CREATE OR REPLACE FUNCTION public.create_vtt_map_element(
    p_session_id UUID,
    p_element_type TEXT,
    p_x INTEGER,
    p_y INTEGER,
    p_width INTEGER DEFAULT NULL,
    p_height INTEGER DEFAULT NULL,
    p_color TEXT,
    p_stroke_width INTEGER DEFAULT 2,
    p_opacity DECIMAL(3,2) DEFAULT 1.00,
    p_data JSONB DEFAULT '{}',
    p_visible_to_players BOOLEAN DEFAULT TRUE
) RETURNS UUID AS $$
DECLARE
    v_element_id UUID;
    v_user_id UUID;
BEGIN
    -- Get current user
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Create map element
    INSERT INTO public.vtt_map_elements (
        session_id, element_type, x, y, width, height, color, stroke_width, opacity, data, visible_to_players, created_by
    ) VALUES (
        p_session_id, p_element_type, p_x, p_y, p_width, p_height, p_color, p_stroke_width, p_opacity, p_data, p_visible_to_players, v_user_id
    ) RETURNING id INTO v_element_id;

    RETURN v_element_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update VTT map element
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
) RETURNS VOID AS $$
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
    WHERE id = p_element_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Map element not found or access denied';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete VTT map element
CREATE OR REPLACE FUNCTION public.delete_vtt_map_element(p_element_id UUID) RETURNS VOID AS $$
BEGIN
    DELETE FROM public.vtt_map_elements WHERE id = p_element_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Map element not found';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vtt_settings_session_id ON public.vtt_settings(session_id);
CREATE INDEX IF NOT EXISTS idx_vtt_tokens_session_id ON public.vtt_tokens(session_id);
CREATE INDEX IF NOT EXISTS idx_vtt_tokens_token_type ON public.vtt_tokens(token_type);
CREATE INDEX IF NOT EXISTS idx_vtt_map_elements_session_id ON public.vtt_map_elements(session_id);
CREATE INDEX IF NOT EXISTS idx_vtt_map_elements_type ON public.vtt_map_elements(element_type);

-- Enable realtime for VTT functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.vtt_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vtt_tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vtt_map_elements;
