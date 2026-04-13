-- Fix auth_rls_initplan and multiple_permissive_policies warnings.
-- Strategy:
--   1. Drop ALL duplicate/overlapping policies for each affected table.
--   2. Recreate a single consolidated policy per (table, action) using
--      (select auth.uid()) to avoid per-row re-evaluation.

-- ========================================================================
-- SECTION 1: campaigns
-- Duplicates: "Wardens can ..." (from 20260329000000) + "campaigns_select/insert/update/delete" (from 20260318/20260223)
-- Initplan: "Wardens can ..." uses auth.uid() instead of (select auth.uid())
-- ========================================================================

-- Drop ALL overlapping campaign policies
DROP POLICY IF EXISTS "Users can view campaigns they Warden or are members of" ON public.campaigns;
DROP POLICY IF EXISTS "Users can view campaigns they DM or are members of" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_select" ON public.campaigns;
DROP POLICY IF EXISTS "Wardens can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "DMs can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_insert" ON public.campaigns;
DROP POLICY IF EXISTS "Wardens can update their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "DMs can update their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_update" ON public.campaigns;
DROP POLICY IF EXISTS "Wardens can delete their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "DMs can delete their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_delete" ON public.campaigns;
DROP POLICY IF EXISTS "Players can view campaigns they're in" ON public.campaigns;
DROP POLICY IF EXISTS "DMs can manage own campaigns" ON public.campaigns;

-- Recreate single policy per action with (select auth.uid()) initplan optimization
CREATE POLICY "campaigns_select" ON public.campaigns
  FOR SELECT
  TO authenticated
  USING (
    warden_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.campaign_members
      WHERE campaign_id = public.campaigns.id AND user_id = (select auth.uid())
    )
  );

CREATE POLICY "campaigns_insert" ON public.campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (warden_id = (select auth.uid()));

CREATE POLICY "campaigns_update" ON public.campaigns
  FOR UPDATE
  TO authenticated
  USING (warden_id = (select auth.uid()));

CREATE POLICY "campaigns_delete" ON public.campaigns
  FOR DELETE
  TO authenticated
  USING (warden_id = (select auth.uid()));

-- ========================================================================
-- SECTION 2: campaign_members
-- Duplicates: "Wardens can ..." / "Users can view ..." (from 20260329000000)
--           + "campaign_members_select/insert/update/delete" (from 20260318000001)
-- Initplan: "Wardens can ..." / "Users can view ..." use auth.uid() directly
-- ========================================================================

-- Drop ALL overlapping campaign_members policies
DROP POLICY IF EXISTS "Users can view members of their campaigns" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_select" ON public.campaign_members;
DROP POLICY IF EXISTS "Wardens can add members to their campaigns" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_insert" ON public.campaign_members;
DROP POLICY IF EXISTS "Wardens can remove members, users can leave" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_delete" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_update" ON public.campaign_members;
DROP POLICY IF EXISTS "DMs can add members to their campaigns" ON public.campaign_members;
DROP POLICY IF EXISTS "DMs can remove members, users can leave" ON public.campaign_members;
DROP POLICY IF EXISTS "Users can join campaigns via share code" ON public.campaign_members;

-- Recreate single policy per action with (select auth.uid()) and TO authenticated
CREATE POLICY "campaign_members_select" ON public.campaign_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = public.campaign_members.campaign_id
      AND (warden_id = (select auth.uid()) OR EXISTS (
        SELECT 1 FROM public.campaign_members cm
        WHERE cm.campaign_id = public.campaigns.id AND cm.user_id = (select auth.uid())
      ))
    )
  );

CREATE POLICY "campaign_members_insert" ON public.campaign_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = public.campaign_members.campaign_id AND warden_id = (select auth.uid())
    )
  );

CREATE POLICY "campaign_members_update" ON public.campaign_members
  FOR UPDATE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = public.campaign_members.campaign_id AND warden_id = (select auth.uid())
    )
  );

CREATE POLICY "campaign_members_delete" ON public.campaign_members
  FOR DELETE
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = public.campaign_members.campaign_id AND warden_id = (select auth.uid())
    )
  );

-- ========================================================================
-- SECTION 3: campaign_messages
-- Initplan: "Users can view messages in their campaigns" uses auth.uid() directly
-- ========================================================================

DROP POLICY IF EXISTS "Users can view messages in their campaigns" ON public.campaign_messages;

CREATE POLICY "Users can view messages in their campaigns"
  ON public.campaign_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = campaign_messages.campaign_id
      AND (
        warden_id = (select auth.uid()) OR EXISTS (
          SELECT 1 FROM public.campaign_members
          WHERE campaign_id = public.campaigns.id AND user_id = (select auth.uid())
        )
      )
    )
    AND (
      -- If target_user_ids is null or empty, it's public to campaign members.
      -- If it's not null, only members in the array OR the warden can view it.
      -- Or the user who sent it can view it.
      (target_user_ids IS NULL OR array_length(target_user_ids, 1) IS NULL) OR
      ((select auth.uid()) = ANY(target_user_ids)) OR
      (user_id = (select auth.uid())) OR
      EXISTS (
        SELECT 1 FROM public.campaigns
        WHERE id = campaign_messages.campaign_id AND warden_id = (select auth.uid())
      )
    )
  );

-- ========================================================================
-- SECTION 4: guilds
-- Initplan: All 4 policies use auth.uid() instead of (select auth.uid())
-- ========================================================================

DROP POLICY IF EXISTS "Users can view guilds they lead or are members of" ON public.guilds;
DROP POLICY IF EXISTS "Users can create guilds" ON public.guilds;
DROP POLICY IF EXISTS "Guild leaders can update their guilds" ON public.guilds;
DROP POLICY IF EXISTS "Guild leaders can delete their guilds" ON public.guilds;

CREATE POLICY "guilds_select" ON public.guilds
  FOR SELECT
  TO authenticated
  USING (
    leader_user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.guild_members
      WHERE guild_id = public.guilds.id AND user_id = (select auth.uid())
    )
  );

CREATE POLICY "guilds_insert" ON public.guilds
  FOR INSERT
  TO authenticated
  WITH CHECK (leader_user_id = (select auth.uid()));

CREATE POLICY "guilds_update" ON public.guilds
  FOR UPDATE
  TO authenticated
  USING (leader_user_id = (select auth.uid()));

CREATE POLICY "guilds_delete" ON public.guilds
  FOR DELETE
  TO authenticated
  USING (leader_user_id = (select auth.uid()));

-- ========================================================================
-- SECTION 5: guild_members
-- Initplan: All 4 policies use auth.uid() instead of (select auth.uid())
-- ========================================================================

DROP POLICY IF EXISTS "Users can view members of their guilds" ON public.guild_members;
DROP POLICY IF EXISTS "Guild leaders can add members" ON public.guild_members;
DROP POLICY IF EXISTS "Guild leaders can remove members, members can leave" ON public.guild_members;
DROP POLICY IF EXISTS "Guild leaders can update member roles" ON public.guild_members;

CREATE POLICY "guild_members_select" ON public.guild_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_members.guild_id
      AND (leader_user_id = (select auth.uid()) OR EXISTS (
        SELECT 1 FROM public.guild_members gm
        WHERE gm.guild_id = public.guilds.id AND gm.user_id = (select auth.uid())
      ))
    )
  );

CREATE POLICY "guild_members_insert" ON public.guild_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_members.guild_id AND leader_user_id = (select auth.uid())
    )
    OR user_id = (select auth.uid())
  );

CREATE POLICY "guild_members_update" ON public.guild_members
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_members.guild_id AND leader_user_id = (select auth.uid())
    )
  );

CREATE POLICY "guild_members_delete" ON public.guild_members
  FOR DELETE
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_members.guild_id AND leader_user_id = (select auth.uid())
    )
  );

-- ========================================================================
-- SECTION 6: compendium_sigils — duplicate SELECT policies
-- "Compendium sigils are publicly readable" + "Compendium sigils public read"
-- ========================================================================

DROP POLICY IF EXISTS "Compendium sigils are publicly readable" ON public.compendium_sigils;
DROP POLICY IF EXISTS "Compendium sigils public read" ON public.compendium_sigils;

CREATE POLICY "compendium_sigils_select" ON public.compendium_sigils
  FOR SELECT USING (true);

-- ========================================================================
-- SECTION 7: compendium_tattoos — duplicate SELECT policies
-- "Allow public read access to compendium_tattoos" + "Enable read access for all users"
-- ========================================================================

DROP POLICY IF EXISTS "Allow public read access to compendium_tattoos" ON public.compendium_tattoos;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.compendium_tattoos;

CREATE POLICY "compendium_tattoos_select" ON public.compendium_tattoos
  FOR SELECT USING (true);
