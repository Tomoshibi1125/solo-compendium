-- Migration 20260413000005_fix_rls_infinite_recursion.sql
-- Fix infinite recursion introduced in 20260413000001_fix_initplan_and_duplicate_policies.sql
-- The interdependency between campaign_members and campaigns caused Postgres
-- to sporadically fail insert/select queries with infinite recursion errors, blocking wiki injection.

-- 1. Redefine campaigns_select using our safe SECURITY DEFINER helpers
DROP POLICY IF EXISTS "campaigns_select" ON public.campaigns;
CREATE POLICY "campaigns_select" ON public.campaigns
  FOR SELECT TO authenticated
  USING (
    public.is_campaign_dm(id, (select auth.uid()))
    OR public.is_campaign_member(id, (select auth.uid()))
  );

-- 2. Redefine campaign_members_select using our safe SECURITY DEFINER helpers
DROP POLICY IF EXISTS "campaign_members_select" ON public.campaign_members;
CREATE POLICY "campaign_members_select" ON public.campaign_members
  FOR SELECT TO authenticated
  USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );

-- 3. Just to be absolutely safe, we redefine the wiki_articles_insert policy
-- to use the same fast SECURITY DEFINER functions instead of raw nested SELECTs
DROP POLICY IF EXISTS "wiki_articles_insert" ON public.campaign_wiki_articles;
CREATE POLICY "wiki_articles_insert" ON public.campaign_wiki_articles
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );
