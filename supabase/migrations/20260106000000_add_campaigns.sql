-- Campaign Management System
-- Allows DMs to create campaigns and players to join via share links

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  dm_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  share_code TEXT UNIQUE NOT NULL, -- Unique code for sharing (e.g., "ABC123")
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb -- Store campaign-specific settings
);
-- Campaign members (players)
CREATE TABLE IF NOT EXISTS campaign_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL, -- Optional: linked character
  role TEXT DEFAULT 'player' CHECK (role IN ('player', 'co-dm')), -- Player or co-DM
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);
-- Indexes for performance
CREATE INDEX IF NOT EXISTS campaigns_dm_id_idx ON campaigns(dm_id);
CREATE INDEX IF NOT EXISTS campaigns_share_code_idx ON campaigns(share_code);
CREATE INDEX IF NOT EXISTS campaign_members_campaign_id_idx ON campaign_members(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_members_user_id_idx ON campaign_members(user_id);
-- Function to generate unique share codes
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Excludes confusing chars
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
-- Function to create campaign with unique share code
CREATE OR REPLACE FUNCTION create_campaign_with_code(
  p_name TEXT,
  p_description TEXT,
  p_dm_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_campaign_id UUID;
  v_share_code TEXT;
  max_attempts INTEGER := 10;
  attempts INTEGER := 0;
BEGIN
  LOOP
    v_share_code := generate_share_code();
    
    -- Check if code already exists
    IF NOT EXISTS (SELECT 1 FROM campaigns WHERE share_code = v_share_code) THEN
      EXIT;
    END IF;
    
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique share code after % attempts', max_attempts;
    END IF;
  END LOOP;
  
  -- Create campaign
  INSERT INTO campaigns (name, description, dm_id, share_code)
  VALUES (p_name, p_description, p_dm_id, v_share_code)
  RETURNING id INTO v_campaign_id;
  
  -- Add DM as member
  INSERT INTO campaign_members (campaign_id, user_id, role)
  VALUES (v_campaign_id, p_dm_id, 'co-dm');
  
  RETURN v_campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- RLS Policies
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_members ENABLE ROW LEVEL SECURITY;
-- Campaigns: DMs can manage their own campaigns, members can view
CREATE POLICY "Users can view campaigns they DM or are members of"
  ON campaigns FOR SELECT
  USING (
    dm_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM campaign_members
      WHERE campaign_id = campaigns.id AND user_id = auth.uid()
    )
  );
CREATE POLICY "DMs can create campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (dm_id = auth.uid());
CREATE POLICY "DMs can update their own campaigns"
  ON campaigns FOR UPDATE
  USING (dm_id = auth.uid());
CREATE POLICY "DMs can delete their own campaigns"
  ON campaigns FOR DELETE
  USING (dm_id = auth.uid());
-- Campaign members: Users can view members of campaigns they're in
CREATE POLICY "Users can view members of their campaigns"
  ON campaign_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_members.campaign_id
      AND (dm_id = auth.uid() OR EXISTS (
        SELECT 1 FROM campaign_members cm
        WHERE cm.campaign_id = campaigns.id AND cm.user_id = auth.uid()
      ))
    )
  );
CREATE POLICY "DMs can add members to their campaigns"
  ON campaign_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_members.campaign_id AND dm_id = auth.uid()
    )
  );
CREATE POLICY "Users can join campaigns via share code"
  ON campaign_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_members.campaign_id
      AND is_active = true
    )
  );
CREATE POLICY "DMs can remove members, users can leave"
  ON campaign_members FOR DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_members.campaign_id AND dm_id = auth.uid()
    )
  );
-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
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
    EXECUTE 'CREATE TRIGGER update_campaigns_updated_at\n'
      || '  BEFORE UPDATE ON public.campaigns\n'
      || '  FOR EACH ROW\n'
      || '  EXECUTE FUNCTION public.update_updated_at_column();';
  END IF;
END $$;
