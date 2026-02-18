-- Create active sessions table for real-time gaming sessions
CREATE TABLE IF NOT EXISTS public.active_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'paused', 'completed', 'cancelled')),
    combat_status TEXT NOT NULL DEFAULT 'waiting' CHECK (combat_status IN ('waiting', 'active', 'paused', 'completed')),
    current_initiative INTEGER,
    current_turn_player_id UUID REFERENCES auth.users(id),
    map_data JSONB,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session participants table
CREATE TABLE IF NOT EXISTS public.session_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.active_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
    is_dm BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, user_id)
);

-- Enable RLS
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for active_sessions
CREATE POLICY "Users can view active sessions in their campaigns" ON public.active_sessions
    FOR SELECT USING (
        campaign_id IN (
            SELECT id FROM public.campaigns
            WHERE dm_id = auth.uid() OR id IN (
                SELECT campaign_id FROM public.campaign_members WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "DMs can manage active sessions in their campaigns" ON public.active_sessions
    FOR ALL USING (
        campaign_id IN (
            SELECT id FROM public.campaigns WHERE dm_id = auth.uid()
        )
    );

-- RLS Policies for session_participants
CREATE POLICY "Users can view session participants" ON public.session_participants
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

CREATE POLICY "Users can manage their own session participation" ON public.session_participants
    FOR ALL USING (user_id = auth.uid());

-- Function to start an active session
CREATE OR REPLACE FUNCTION public.start_active_session(
    p_campaign_id UUID,
    p_title TEXT,
    p_description TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_session_id UUID;
    v_user_id UUID;
BEGIN
    -- Get current user
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Verify user is DM of the campaign
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns
        WHERE id = p_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can start active sessions';
    END IF;

    -- Create active session
    INSERT INTO public.active_sessions (
        campaign_id,
        title,
        description,
        status,
        created_by
    ) VALUES (
        p_campaign_id,
        p_title,
        p_description,
        'active',
        v_user_id
    ) RETURNING id INTO v_session_id;

    -- Add DM as participant
    INSERT INTO public.session_participants (
        session_id,
        user_id,
        is_dm
    ) VALUES (
        v_session_id,
        v_user_id,
        TRUE
    );

    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end an active session
CREATE OR REPLACE FUNCTION public.end_active_session(
    p_session_id UUID
) RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    -- Get current user
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Get campaign ID and verify user is DM
    SELECT campaign_id INTO v_campaign_id
    FROM public.active_sessions
    WHERE id = p_session_id;

    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns
        WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can end active sessions';
    END IF;

    -- Update session status
    UPDATE public.active_sessions
    SET status = 'completed',
        updated_at = NOW()
    WHERE id = p_session_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_active_sessions_campaign_id ON public.active_sessions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_status ON public.active_sessions(status);
CREATE INDEX IF NOT EXISTS idx_session_participants_session_id ON public.session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_user_id ON public.session_participants(user_id);

-- Enable realtime for active sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
