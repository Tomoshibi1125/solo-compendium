-- Final Warden VTT Terminology Unification: co-system -> co-warden
-- This migration standardizes all remaining legacy 'system' terminology in the database.

-- 1. Update existing campaign members to new terminology
UPDATE public.campaign_members SET role = 'co-warden' WHERE role = 'co-system';
UPDATE public.campaign_members SET role = 'warden' WHERE role = 'system';

-- 2. Update the role check constraint to enforce unification
ALTER TABLE public.campaign_members DROP CONSTRAINT IF EXISTS campaign_members_role_check;
ALTER TABLE public.campaign_members ADD CONSTRAINT campaign_members_role_check 
  CHECK (role IN ('ascendant', 'warden', 'co-warden'));

-- 3. Update the is_campaign_system helper function to support co-warden
-- We preserve the function name for backwards compatibility with RLS policies, 
-- but update its logic to use unified roles.
CREATE OR REPLACE FUNCTION public.is_campaign_system(
  p_campaign_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT p_user_id IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM public.campaigns WHERE id = p_campaign_id AND warden_id = p_user_id
    )
    OR EXISTS (
      SELECT 1 FROM public.campaign_members
      WHERE campaign_id = p_campaign_id
        AND user_id = p_user_id
        AND role = 'co-warden'
    )
  );
$$;

-- 4. Update any hardcoded co-system references in other procedures if necessary
-- Note: RLS policies using public.is_campaign_system(campaign_id) now automatically support co-warden.
