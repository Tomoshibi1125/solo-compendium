-- Guild roles, ranks & progression (Solo Leveling-style guild management)
-- Adds: Vice-Master role, informational member rank, guild rank/level/reputation/
-- contribution/funds, one-guild-per-user enforcement, and role-based RLS so
-- Vice/Officers can do delegated roster work (not just the leader).

-- 1. guild_members: add the Vice-Master role + an informational rank letter.
ALTER TABLE public.guild_members
  DROP CONSTRAINT IF EXISTS guild_members_role_check;
ALTER TABLE public.guild_members
  ADD CONSTRAINT guild_members_role_check
  CHECK (role IN ('leader', 'vice_master', 'officer', 'member', 'recruit'));

ALTER TABLE public.guild_members
  ADD COLUMN IF NOT EXISTS rank TEXT;

-- 2. guilds: guild-level progression + treasury.
ALTER TABLE public.guilds
  ADD COLUMN IF NOT EXISTS guild_rank TEXT NOT NULL DEFAULT 'E',
  ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS reputation INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS contribution INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS funds JSONB NOT NULL DEFAULT '{}';

-- 3. One guild per user: a user may hold only one membership row (NPC rows are
--    user_id NULL and exempt via the partial index).
CREATE UNIQUE INDEX IF NOT EXISTS guild_members_one_per_user
  ON public.guild_members(user_id)
  WHERE user_id IS NOT NULL;

-- 4. SECURITY DEFINER helper: a user's role in a guild (avoids RLS recursion).
CREATE OR REPLACE FUNCTION public.guild_member_role(p_guild_id UUID, p_uid UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.guild_members
  WHERE guild_id = p_guild_id AND user_id = p_uid
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.guild_member_role(UUID, UUID) TO authenticated;

-- 5. Role-based RLS on guild_members (delegate roster work to Vice/Officers).
DROP POLICY IF EXISTS "Guild leaders can add members" ON public.guild_members;
CREATE POLICY "Guild staff add members, users join"
  ON public.guild_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_members.guild_id AND leader_user_id = auth.uid()
    )
    OR public.guild_member_role(public.guild_members.guild_id, auth.uid())
       IN ('leader', 'vice_master', 'officer')
  );

DROP POLICY IF EXISTS "Guild leaders can remove members, members can leave" ON public.guild_members;
CREATE POLICY "Guild staff remove members, members leave"
  ON public.guild_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_members.guild_id AND leader_user_id = auth.uid()
    )
    OR public.guild_member_role(public.guild_members.guild_id, auth.uid())
       IN ('leader', 'vice_master')
  );

DROP POLICY IF EXISTS "Guild leaders can update member roles" ON public.guild_members;
CREATE POLICY "Guild staff update members"
  ON public.guild_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_members.guild_id AND leader_user_id = auth.uid()
    )
    OR public.guild_member_role(public.guild_members.guild_id, auth.uid())
       IN ('leader', 'vice_master', 'officer')
  );

-- 6. Guilds: Vice-Master can edit guild info; disband stays leader-only.
DROP POLICY IF EXISTS "Guild leaders can update their guilds" ON public.guilds;
CREATE POLICY "Guild leaders and vice can update guilds"
  ON public.guilds FOR UPDATE
  USING (
    leader_user_id = auth.uid()
    OR public.guild_member_role(id, auth.uid()) = 'vice_master'
  );
