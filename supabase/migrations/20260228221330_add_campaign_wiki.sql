-- Migration to add campaign wiki articles

CREATE TABLE IF NOT EXISTS public.campaign_wiki_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'lore',
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_wiki_articles ENABLE ROW LEVEL SECURITY;

-- Add updated_at trigger
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.campaign_wiki_articles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add Indexes
CREATE INDEX IF NOT EXISTS idx_campaign_wiki_campaign_id ON public.campaign_wiki_articles(campaign_id);

-- RLS Policies
CREATE POLICY "Users can view wiki articles in their campaigns"
    ON public.campaign_wiki_articles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.campaign_members
            WHERE campaign_members.campaign_id = campaign_wiki_articles.campaign_id
            AND campaign_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create wiki articles in their campaigns"
    ON public.campaign_wiki_articles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.campaign_members
            WHERE campaign_members.campaign_id = campaign_wiki_articles.campaign_id
            AND campaign_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own or DM can update any wiki articles"
    ON public.campaign_wiki_articles
    FOR UPDATE
    USING (
        created_by = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.campaign_members
            WHERE campaign_members.campaign_id = campaign_wiki_articles.campaign_id
            AND campaign_members.user_id = auth.uid()
            AND campaign_members.role = 'dm'
        )
    );

CREATE POLICY "Users can delete their own or DM can delete any wiki articles"
    ON public.campaign_wiki_articles
    FOR DELETE
    USING (
        created_by = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.campaign_members
            WHERE campaign_members.campaign_id = campaign_wiki_articles.campaign_id
            AND campaign_members.user_id = auth.uid()
            AND campaign_members.role = 'dm'
        )
    );
