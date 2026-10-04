-- Fix guild_members RLS policy to avoid InitPlan errors
-- This policy is used by Guild management pages (NOT character sheet - that's now decoupled)
-- The previous nested EXISTS structure caused Postgres InitPlan failures resulting in 500 errors

-- Drop the problematic policy
DROP POLICY IF EXISTS "guild_members_select" ON public.guild_members;

-- Create a simplified, flattened policy that avoids nested subqueries
CREATE POLICY "guild_members_select" ON public.guild_members
  FOR SELECT
  TO authenticated
  USING (
    -- User can see their own membership records
    user_id = auth.uid()
    OR
    -- User can see records for characters they own
    character_id IN (
      SELECT id FROM public.characters WHERE user_id = auth.uid()
    )
    OR
    -- Guild leaders can see all members of their guilds
    guild_id IN (
      SELECT id FROM public.guilds WHERE leader_user_id = auth.uid()
    )
    OR
    -- Guild members can see other members in their guild
    guild_id IN (
      SELECT guild_id FROM public.guild_members WHERE user_id = auth.uid()
    )
  );

-- Add comment documenting the fix
COMMENT ON POLICY "guild_members_select" ON public.guild_members IS 
  'Allows users to view guild members. Flattened structure avoids InitPlan errors. Used by Guild tool pages only - character sheet no longer queries this table.';
