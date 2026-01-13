-- =============================================
-- Campaign Management Tables (required for campaign features)
-- =============================================

-- Campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  dm_id UUID NOT NULL,
  share_code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Campaign members table
CREATE TABLE IF NOT EXISTS public.campaign_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'hunter' CHECK (role IN ('hunter', 'co-system')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, user_id)
);

-- Campaign messages table (for in-game chat)
CREATE TABLE IF NOT EXISTS public.campaign_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  character_name TEXT,
  message_type TEXT NOT NULL DEFAULT 'chat' CHECK (message_type IN ('chat', 'roll', 'system', 'whisper')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Campaign notes table (shared/private notes)
CREATE TABLE IF NOT EXISTS public.campaign_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Campaign shared characters table
CREATE TABLE IF NOT EXISTS public.campaign_character_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL,
  permissions TEXT NOT NULL DEFAULT 'view' CHECK (permissions IN ('view', 'edit')),
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, character_id)
);

-- =============================================
-- User Favorites & Saved Searches
-- =============================================

-- User favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_type TEXT NOT NULL,
  entry_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, entry_type, entry_id)
);

-- Saved searches table
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  search_params JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- Character Journal & Roll History
-- =============================================

-- Character journal entries
CREATE TABLE IF NOT EXISTS public.character_journal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  session_date DATE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Roll history table
CREATE TABLE IF NOT EXISTS public.roll_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  roll_type TEXT NOT NULL,
  dice_formula TEXT NOT NULL,
  result INTEGER NOT NULL,
  rolls INTEGER[] NOT NULL,
  modifiers JSONB DEFAULT '{}',
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- Enable RLS on all new tables
-- =============================================

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_character_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roll_history ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies for Campaigns
-- =============================================

-- Campaigns: viewable by DM and members
CREATE POLICY "campaigns_select" ON public.campaigns FOR SELECT
USING (
  dm_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()) OR
  is_active = true
);

CREATE POLICY "campaigns_insert" ON public.campaigns FOR INSERT
WITH CHECK (dm_id = auth.uid());

CREATE POLICY "campaigns_update" ON public.campaigns FOR UPDATE
USING (dm_id = auth.uid());

CREATE POLICY "campaigns_delete" ON public.campaigns FOR DELETE
USING (dm_id = auth.uid());

-- Campaign members
CREATE POLICY "campaign_members_select" ON public.campaign_members FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid())
);

CREATE POLICY "campaign_members_insert" ON public.campaign_members FOR INSERT
WITH CHECK (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

CREATE POLICY "campaign_members_update" ON public.campaign_members FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

CREATE POLICY "campaign_members_delete" ON public.campaign_members FOR DELETE
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

-- Campaign messages
CREATE POLICY "campaign_messages_select" ON public.campaign_messages FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = campaign_messages.campaign_id AND user_id = auth.uid())
);

CREATE POLICY "campaign_messages_insert" ON public.campaign_messages FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = campaign_messages.campaign_id AND user_id = auth.uid())
  )
);

-- Campaign notes
CREATE POLICY "campaign_notes_select" ON public.campaign_notes FOR SELECT
USING (
  user_id = auth.uid() OR
  (is_shared = true AND (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = campaign_notes.campaign_id AND user_id = auth.uid())
  ))
);

CREATE POLICY "campaign_notes_insert" ON public.campaign_notes FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "campaign_notes_update" ON public.campaign_notes FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "campaign_notes_delete" ON public.campaign_notes FOR DELETE
USING (user_id = auth.uid());

-- Campaign character shares
CREATE POLICY "campaign_character_shares_select" ON public.campaign_character_shares FOR SELECT
USING (
  shared_by = auth.uid() OR
  EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = campaign_character_shares.campaign_id AND user_id = auth.uid())
);

CREATE POLICY "campaign_character_shares_insert" ON public.campaign_character_shares FOR INSERT
WITH CHECK (shared_by = auth.uid());

CREATE POLICY "campaign_character_shares_delete" ON public.campaign_character_shares FOR DELETE
USING (shared_by = auth.uid() OR EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

-- =============================================
-- RLS Policies for User Features
-- =============================================

-- User favorites
CREATE POLICY "user_favorites_all" ON public.user_favorites FOR ALL
USING (user_id = auth.uid());

-- Saved searches
CREATE POLICY "saved_searches_all" ON public.saved_searches FOR ALL
USING (user_id = auth.uid());

-- Character journal
CREATE POLICY "character_journal_all" ON public.character_journal FOR ALL
USING (EXISTS (SELECT 1 FROM public.characters WHERE id = character_id AND user_id = auth.uid()));

-- Roll history
CREATE POLICY "roll_history_select" ON public.roll_history FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "roll_history_insert" ON public.roll_history FOR INSERT
WITH CHECK (user_id = auth.uid());

-- =============================================
-- Functions
-- =============================================

-- Function to generate unique share code
CREATE OR REPLACE FUNCTION generate_share_code() RETURNS TEXT 
LANGUAGE plpgsql
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN code;
END;
$$;

-- Function to create campaign with auto-generated share code
CREATE OR REPLACE FUNCTION create_campaign_with_code(
  p_name TEXT,
  p_description TEXT,
  p_dm_id UUID
) RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_code TEXT;
  new_id UUID;
BEGIN
  -- Generate unique code
  LOOP
    new_code := generate_share_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.campaigns WHERE share_code = new_code);
  END LOOP;
  
  INSERT INTO public.campaigns (name, description, dm_id, share_code)
  VALUES (p_name, p_description, p_dm_id, new_code)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- =============================================
-- Enable realtime for chat
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_messages;

-- =============================================
-- Update triggers
-- =============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'campaigns'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'campaigns'
      AND t.tgname = 'update_campaigns_updated_at'
      AND NOT t.tgisinternal
  ) THEN
    EXECUTE 'CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'campaign_notes'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'campaign_notes'
      AND t.tgname = 'update_campaign_notes_updated_at'
      AND NOT t.tgisinternal
  ) THEN
    EXECUTE 'CREATE TRIGGER update_campaign_notes_updated_at BEFORE UPDATE ON public.campaign_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'character_journal'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'character_journal'
      AND t.tgname = 'update_character_journal_updated_at'
      AND NOT t.tgisinternal
  ) THEN
    EXECUTE 'CREATE TRIGGER update_character_journal_updated_at BEFORE UPDATE ON public.character_journal FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();';
  END IF;
END $$;