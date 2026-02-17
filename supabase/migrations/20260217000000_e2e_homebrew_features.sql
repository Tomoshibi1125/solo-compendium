-- Add modifiers JSONB column to character_features for structured homebrew modifier data.
-- Example: [{"type":"damage","value":4,"die":"1d4","source":"Eldritch Momentum"},
--           {"type":"speed","value":5,"source":"Eldritch Momentum"}]
ALTER TABLE public.character_features
  ADD COLUMN IF NOT EXISTS modifiers JSONB DEFAULT '[]'::jsonb;

-- Add homebrew_id reference so we can trace features back to their homebrew source
ALTER TABLE public.character_features
  ADD COLUMN IF NOT EXISTS homebrew_id UUID;

-- Campaign roll events table for real-time DM visibility of player rolls
CREATE TABLE IF NOT EXISTS public.campaign_roll_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  character_name TEXT,
  dice_formula TEXT NOT NULL,
  result INTEGER NOT NULL,
  rolls INTEGER[] DEFAULT '{}',
  roll_type TEXT, -- 'attack', 'damage', 'check', 'save', 'custom'
  context TEXT,
  modifiers JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.campaign_roll_events ENABLE ROW LEVEL SECURITY;

-- Campaign members can view roll events for their campaign
CREATE POLICY campaign_roll_events_select ON public.campaign_roll_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.campaign_id = campaign_roll_events.campaign_id
        AND cm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_roll_events.campaign_id
        AND c.dm_id = auth.uid()
    )
  );

-- Authenticated users can insert roll events for campaigns they belong to
CREATE POLICY campaign_roll_events_insert ON public.campaign_roll_events
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND (
      EXISTS (
        SELECT 1 FROM public.campaign_members cm
        WHERE cm.campaign_id = campaign_roll_events.campaign_id
          AND cm.user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.campaigns c
        WHERE c.id = campaign_roll_events.campaign_id
          AND c.dm_id = auth.uid()
      )
    )
  );

CREATE INDEX IF NOT EXISTS campaign_roll_events_campaign_idx
  ON public.campaign_roll_events(campaign_id, created_at DESC);

-- Enable realtime for campaign_roll_events
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_roll_events;
