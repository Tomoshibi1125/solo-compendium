-- Protocol Warden Terminology Unification Migration
-- Renames all legacy DM/GM terminology to Warden/System

-- 1. Rename dm_id to warden_id in campaigns table
ALTER TABLE public.campaigns RENAME COLUMN dm_id TO warden_id;

-- 2. Rename associated index
ALTER INDEX IF EXISTS public.campaigns_dm_id_idx RENAME TO campaigns_warden_id_idx;

-- 3. Update campaign_members roles
-- Update the check constraint first
ALTER TABLE public.campaign_members DROP CONSTRAINT IF EXISTS campaign_members_role_check;

-- Update existing roles to new terminology
UPDATE public.campaign_members SET role = 'warden' WHERE role = 'dm';
UPDATE public.campaign_members SET role = 'co-warden' WHERE role = 'co-dm';
UPDATE public.campaign_members SET role = 'ascendant' WHERE role = 'player';

-- Re-apply the expanded check constraint to support both old and new during transition if needed, 
-- but we go full Zero Legacy here.
ALTER TABLE public.campaign_members ADD CONSTRAINT campaign_members_role_check 
  CHECK (role IN ('ascendant', 'warden', 'co-warden', 'system', 'co-system'));

-- 4. Refactor create_campaign_with_code function
CREATE OR REPLACE FUNCTION public.create_campaign_with_code(
  p_name TEXT,
  p_description TEXT,
  p_warden_id UUID -- Renamed from p_dm_id
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
    IF NOT EXISTS (SELECT 1 FROM public.campaigns WHERE share_code = v_share_code) THEN
      EXIT;
    END IF;
    
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique share code after % attempts', max_attempts;
    END IF;
  END LOOP;
  
  -- Create campaign with new column name
  INSERT INTO public.campaigns (name, description, warden_id, share_code)
  VALUES (p_name, p_description, p_warden_id, v_share_code)
  RETURNING id INTO v_campaign_id;
  
  -- Add Warden as member
  INSERT INTO public.campaign_members (campaign_id, user_id, role)
  VALUES (v_campaign_id, p_warden_id, 'warden');
  
  RETURN v_campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Update RLS Policies for campaigns
DROP POLICY IF EXISTS "Users can view campaigns they DM or are members of" ON public.campaigns;
CREATE POLICY "Users can view campaigns they Warden or are members of"
  ON public.campaigns FOR SELECT
  USING (
    warden_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.campaign_members
      WHERE campaign_id = public.campaigns.id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "DMs can create campaigns" ON public.campaigns;
CREATE POLICY "Wardens can create campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (warden_id = auth.uid());

DROP POLICY IF EXISTS "DMs can update their own campaigns" ON public.campaigns;
CREATE POLICY "Wardens can update their own campaigns"
  ON public.campaigns FOR UPDATE
  USING (warden_id = auth.uid());

DROP POLICY IF EXISTS "DMs can delete their own campaigns" ON public.campaigns;
CREATE POLICY "Wardens can delete their own campaigns"
  ON public.campaigns FOR DELETE
  USING (warden_id = auth.uid());

-- 6. Update RLS Policies for campaign_members
DROP POLICY IF EXISTS "Users can view members of their campaigns" ON public.campaign_members;
CREATE POLICY "Users can view members of their campaigns"
  ON public.campaign_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = public.campaign_members.campaign_id
      AND (warden_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.campaign_members cm
        WHERE cm.campaign_id = public.campaigns.id AND cm.user_id = auth.uid()
      ))
    )
  );

DROP POLICY IF EXISTS "DMs can add members to their campaigns" ON public.campaign_members;
CREATE POLICY "Wardens can add members to their campaigns"
  ON public.campaign_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = public.campaign_members.campaign_id AND warden_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "DMs can remove members, users can leave" ON public.campaign_members;
CREATE POLICY "Wardens can remove members, users can leave"
  ON public.campaign_members FOR DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = public.campaign_members.campaign_id AND warden_id = auth.uid()
    )
  );

-- 7. Update encounter_templates (if exists and has dm_id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'encounter_templates' AND column_name = 'dm_id'
  ) THEN
    ALTER TABLE public.encounter_templates RENAME COLUMN dm_id TO warden_id;
  END IF;
END $$;
