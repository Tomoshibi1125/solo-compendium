-- Migration: Restore Missing RLS Policies for campaign_members
-- Resolves linter warning: Table public.campaign_members has RLS enabled, but no policies exist

BEGIN;

-- Ensure RLS is enabled
ALTER TABLE public.campaign_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (safeguard)
DROP POLICY IF EXISTS "campaign_members_select" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_insert" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_update" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_delete" ON public.campaign_members;
DROP POLICY IF EXISTS "DMs can add members to their campaigns" ON public.campaign_members;
DROP POLICY IF EXISTS "DMs can remove members, users can leave" ON public.campaign_members;
DROP POLICY IF EXISTS "Users can join campaigns via share code" ON public.campaign_members;
DROP POLICY IF EXISTS "Users can view members of their campaigns" ON public.campaign_members;

-- Consolidated Policies using helper functions to avoid planner issues and recursion
-- Note: Helper functions like is_campaign_dm and is_campaign_member should already exist from earlier migrations (e.g., 20260222000000)

CREATE POLICY "campaign_members_select" ON public.campaign_members
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );

CREATE POLICY "campaign_members_insert" ON public.campaign_members
  FOR INSERT WITH CHECK (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

CREATE POLICY "campaign_members_update" ON public.campaign_members
  FOR UPDATE USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

CREATE POLICY "campaign_members_delete" ON public.campaign_members
  FOR DELETE USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

COMMIT;
