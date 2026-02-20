-- Persistent VTT chat messages for campaign sessions
CREATE TABLE IF NOT EXISTS public.vtt_chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    session_id UUID,
    user_id UUID REFERENCES auth.users(id),
    user_name TEXT NOT NULL DEFAULT 'Anonymous',
    message TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'chat' CHECK (message_type IN ('chat', 'dice', 'system', 'whisper')),
    dice_formula TEXT,
    dice_result INTEGER,
    whisper_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vtt_chat_messages ENABLE ROW LEVEL SECURITY;

-- Campaign members can view non-whisper messages
CREATE POLICY "Campaign members can view chat messages" ON public.vtt_chat_messages
    FOR SELECT USING (
        campaign_id IN (
            SELECT id FROM public.campaigns
            WHERE dm_id = auth.uid() OR id IN (
                SELECT campaign_id FROM public.campaign_members WHERE user_id = auth.uid()
            )
        )
        AND (
            message_type != 'whisper'
            OR user_id = auth.uid()
            OR whisper_to = auth.uid()
        )
    );

-- Campaign members can insert messages
CREATE POLICY "Campaign members can send chat messages" ON public.vtt_chat_messages
    FOR INSERT WITH CHECK (
        campaign_id IN (
            SELECT id FROM public.campaigns
            WHERE dm_id = auth.uid() OR id IN (
                SELECT campaign_id FROM public.campaign_members WHERE user_id = auth.uid()
            )
        )
    );

-- DMs can delete messages in their campaigns
CREATE POLICY "DMs can delete chat messages" ON public.vtt_chat_messages
    FOR DELETE USING (
        campaign_id IN (
            SELECT id FROM public.campaigns WHERE dm_id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vtt_chat_messages_campaign ON public.vtt_chat_messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_vtt_chat_messages_session ON public.vtt_chat_messages(campaign_id, session_id);
CREATE INDEX IF NOT EXISTS idx_vtt_chat_messages_created ON public.vtt_chat_messages(created_at DESC);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.vtt_chat_messages;
