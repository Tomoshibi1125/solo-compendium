-- Create combat participants table
CREATE TABLE IF NOT EXISTS public.combat_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.active_sessions(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    initiative INTEGER NOT NULL,
    current_hp INTEGER NOT NULL,
    max_hp INTEGER NOT NULL,
    ac INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'alive' CHECK (status IN ('alive', 'dead', 'unconscious')),
    is_player BOOLEAN NOT NULL DEFAULT FALSE,
    turn_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create combat actions table
CREATE TABLE IF NOT EXISTS public.combat_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.active_sessions(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES public.combat_participants(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('attack', 'spell', 'ability', 'movement', 'other')),
    description TEXT NOT NULL,
    damage_dealt INTEGER,
    healing_done INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.combat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combat_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view combat participants in their sessions" ON public.combat_participants
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

CREATE POLICY "DMs can manage combat participants in their sessions" ON public.combat_participants
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns WHERE dm_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can view combat actions in their sessions" ON public.combat_actions
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

CREATE POLICY "Users can add combat actions for their characters" ON public.combat_actions
    FOR INSERT WITH CHECK (
        participant_id IN (
            SELECT cp.id FROM public.combat_participants cp
            JOIN public.session_participants sp ON sp.session_id = cp.session_id
            WHERE sp.user_id = auth.uid() AND sp.character_id = cp.character_id
        ) OR session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns WHERE dm_id = auth.uid()
            )
        )
    );

-- Function to start combat
CREATE OR REPLACE FUNCTION public.start_session_combat(
    p_session_id UUID,
    p_participants JSONB
) RETURNS VOID AS $$
DECLARE
    v_campaign_id UUID;
    v_user_id UUID;
    v_participant JSONB;
BEGIN
    -- Get current user and verify DM
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT campaign_id INTO v_campaign_id
    FROM public.active_sessions
    WHERE id = p_session_id;

    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns
        WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can start combat';
    END IF;

    -- Update session combat status
    UPDATE public.active_sessions
    SET combat_status = 'active',
        updated_at = NOW()
    WHERE id = p_session_id;

    -- Clear existing combat participants
    DELETE FROM public.combat_participants WHERE session_id = p_session_id;

    -- Insert new participants
    FOR v_participant IN SELECT * FROM jsonb_array_elements(p_participants)
    LOOP
        INSERT INTO public.combat_participants (
            session_id,
            character_id,
            user_id,
            name,
            initiative,
            current_hp,
            max_hp,
            ac,
            is_player,
            turn_order
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

    -- Sort by initiative (higher first)
    UPDATE public.combat_participants
    SET turn_order = sub.row_num
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY initiative DESC) as row_num
        FROM public.combat_participants
        WHERE session_id = p_session_id
    ) sub
    WHERE combat_participants.id = sub.id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to advance combat turn
CREATE OR REPLACE FUNCTION public.advance_combat_turn(
    p_session_id UUID
) RETURNS VOID AS $$
DECLARE
    v_current_turn INTEGER;
    v_max_turn INTEGER;
BEGIN
    -- Get current turn
    SELECT turn_order INTO v_current_turn
    FROM public.combat_participants
    WHERE session_id = p_session_id
    ORDER BY turn_order DESC
    LIMIT 1;

    -- Get max turn order
    SELECT MAX(turn_order) INTO v_max_turn
    FROM public.combat_participants
    WHERE session_id = p_session_id;

    -- Advance to next turn (loop back to 1 if at end)
    IF v_current_turn >= v_max_turn THEN
        UPDATE public.combat_participants
        SET turn_order = turn_order + v_max_turn
        WHERE session_id = p_session_id;
    END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end combat
CREATE OR REPLACE FUNCTION public.end_session_combat(
    p_session_id UUID
) RETURNS VOID AS $$
DECLARE
    v_campaign_id UUID;
    v_user_id UUID;
BEGIN
    -- Get current user and verify DM
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT campaign_id INTO v_campaign_id
    FROM public.active_sessions
    WHERE id = p_session_id;

    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns
        WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can end combat';
    END IF;

    -- Update session combat status
    UPDATE public.active_sessions
    SET combat_status = 'completed',
        updated_at = NOW()
    WHERE id = p_session_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_combat_participants_session_id ON public.combat_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_combat_participants_turn_order ON public.combat_participants(turn_order);
CREATE INDEX IF NOT EXISTS idx_combat_actions_session_id ON public.combat_actions(session_id);
CREATE INDEX IF NOT EXISTS idx_combat_actions_participant_id ON public.combat_actions(participant_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.combat_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.combat_actions;
