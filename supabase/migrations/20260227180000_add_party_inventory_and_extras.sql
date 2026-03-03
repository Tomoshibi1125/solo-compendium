-- Add columns to character_extras if missing
ALTER TABLE public.character_extras ADD COLUMN IF NOT EXISTS ac INTEGER DEFAULT 10;
ALTER TABLE public.character_extras ADD COLUMN IF NOT EXISTS speed INTEGER DEFAULT 30;

-- Create campaign_inventory table
CREATE TABLE IF NOT EXISTS public.campaign_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    item_type TEXT, -- e.g. currency, gear, consumable, weapon, magic item
    quantity INTEGER NOT NULL DEFAULT 1,
    weight REAL DEFAULT 0,
    description TEXT,
    is_identified BOOLEAN DEFAULT true,
    added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for campaign_inventory
ALTER TABLE public.campaign_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaign members can view campaign inventory"
    ON public.campaign_inventory FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.campaign_members
        WHERE campaign_members.campaign_id = campaign_inventory.campaign_id
        AND campaign_members.user_id = auth.uid()
    ));

CREATE POLICY "Campaign members can manage campaign inventory"
    ON public.campaign_inventory FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.campaign_members
        WHERE campaign_members.campaign_id = campaign_inventory.campaign_id
        AND campaign_members.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.campaign_members
        WHERE campaign_members.campaign_id = campaign_inventory.campaign_id
        AND campaign_members.user_id = auth.uid()
    ));

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.campaign_inventory
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_campaign_inventory_campaign_id ON public.campaign_inventory(campaign_id);

-- Create campaign_extras table
CREATE TABLE IF NOT EXISTS public.campaign_extras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    extra_type TEXT NOT NULL, -- 'vehicle', 'mount', 'pet', 'retainer'
    name TEXT NOT NULL,
    hp_current INTEGER NOT NULL DEFAULT 0,
    hp_max INTEGER NOT NULL DEFAULT 0,
    ac INTEGER DEFAULT 10,
    speed INTEGER DEFAULT 30,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for campaign_extras
ALTER TABLE public.campaign_extras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaign members can view campaign extras"
    ON public.campaign_extras FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.campaign_members
        WHERE campaign_members.campaign_id = campaign_extras.campaign_id
        AND campaign_members.user_id = auth.uid()
    ));

CREATE POLICY "Campaign members can manage campaign extras"
    ON public.campaign_extras FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.campaign_members
        WHERE campaign_members.campaign_id = campaign_extras.campaign_id
        AND campaign_members.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.campaign_members
        WHERE campaign_members.campaign_id = campaign_extras.campaign_id
        AND campaign_members.user_id = auth.uid()
    ));

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.campaign_extras
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_campaign_extras_campaign_id ON public.campaign_extras(campaign_id);

-- Ensure replication includes new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_extras;
