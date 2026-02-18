-- Create session quests table
CREATE TABLE IF NOT EXISTS public.session_quests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.active_sessions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    objectives TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    rewards JSONB NOT NULL DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quest completions table
CREATE TABLE IF NOT EXISTS public.quest_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quest_id UUID NOT NULL REFERENCES public.session_quests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rewards_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(quest_id, user_id)
);

-- Enable RLS
ALTER TABLE public.session_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for session_quests
CREATE POLICY "Users can view session quests in their campaigns" ON public.session_quests
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

CREATE POLICY "DMs can manage session quests in their campaigns" ON public.session_quests
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.active_sessions
            WHERE campaign_id IN (
                SELECT id FROM public.campaigns WHERE dm_id = auth.uid()
            )
        )
    );

-- RLS Policies for quest_completions
CREATE POLICY "Users can view their quest completions" ON public.quest_completions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their quest completions" ON public.quest_completions
    FOR ALL USING (user_id = auth.uid());

-- Function to create session quest
CREATE OR REPLACE FUNCTION public.create_session_quest(
    p_session_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_objectives TEXT[],
    p_rewards JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    v_quest_id UUID;
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
        RAISE EXCEPTION 'Only DM can create session quests';
    END IF;

    -- Create quest
    INSERT INTO public.session_quests (
        session_id,
        title,
        description,
        objectives,
        rewards,
        created_by
    ) VALUES (
        p_session_id,
        p_title,
        p_description,
        p_objectives,
        p_rewards,
        v_user_id
    ) RETURNING id INTO v_quest_id;

    RETURN v_quest_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete session quest
CREATE OR REPLACE FUNCTION public.complete_session_quest(
    p_quest_id UUID,
    p_completion_notes TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    v_session_id UUID;
    v_campaign_id UUID;
    v_user_id UUID;
BEGIN
    -- Get current user and verify DM
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

    -- Update quest status
    UPDATE public.session_quests
    SET status = 'completed',
        updated_at = NOW()
    WHERE id = p_quest_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to claim quest rewards
CREATE OR REPLACE FUNCTION public.claim_quest_rewards(
    p_quest_id UUID,
    p_character_id UUID
) RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_quest_record RECORD;
    v_xp_reward INTEGER;
    v_gold_reward INTEGER;
    v_item_rewards TEXT[];
BEGIN
    -- Get current user
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Verify character belongs to user
    IF NOT EXISTS (
        SELECT 1 FROM public.characters
        WHERE id = p_character_id AND user_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Character does not belong to user';
    END IF;

    -- Get quest details
    SELECT * INTO v_quest_record
    FROM public.session_quests
    WHERE id = p_quest_id AND status = 'completed';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Quest not found or not completed';
    END IF;

    -- Check if already claimed
    IF EXISTS (
        SELECT 1 FROM public.quest_completions
        WHERE quest_id = p_quest_id AND user_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Rewards already claimed';
    END IF;

    -- Extract rewards
    v_xp_reward := (v_quest_record.rewards->>'xp')::INTEGER;
    v_gold_reward := (v_quest_record.rewards->>'gold')::INTEGER;
    v_item_rewards := ARRAY(SELECT jsonb_array_elements_text(v_quest_record.rewards->'items'));

    -- Apply rewards to character
    IF v_xp_reward > 0 THEN
        UPDATE public.characters
        SET experience = experience + v_xp_reward
        WHERE id = p_character_id;
    END IF;

    -- Note: Gold and items would need inventory system implementation
    -- For now, just record that rewards were claimed

    -- Record completion
    INSERT INTO public.quest_completions (
        quest_id,
        user_id,
        character_id,
        rewards_claimed
    ) VALUES (
        p_quest_id,
        v_user_id,
        p_character_id,
        TRUE
    );

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_session_quests_session_id ON public.session_quests(session_id);
CREATE INDEX IF NOT EXISTS idx_session_quests_status ON public.session_quests(status);
CREATE INDEX IF NOT EXISTS idx_quest_completions_quest_id ON public.quest_completions(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_completions_user_id ON public.quest_completions(user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_quests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quest_completions;
