-- Guild quests: the Warden/DM (in-world: the Bureau) issues gate contracts; a
-- guild accepts one, assigns a strike squad, and resolves it (success/fail).
-- On success the guild treasury / contribution are credited and the assigned
-- NPC members advance one milestone level.

CREATE TABLE IF NOT EXISTS public.guild_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  source_quest_id TEXT,
  title TEXT NOT NULL,
  rank TEXT NOT NULL DEFAULT 'E',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'failed')),
  assigned_member_ids JSONB NOT NULL DEFAULT '[]',
  rewards JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS guild_quests_guild_id_idx
  ON public.guild_quests(guild_id);

ALTER TABLE public.guild_quests ENABLE ROW LEVEL SECURITY;

-- Any member of the guild can view its quests.
CREATE POLICY "View quests of your guild"
  ON public.guild_quests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_quests.guild_id AND leader_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.guild_members
      WHERE guild_id = public.guild_quests.guild_id AND user_id = auth.uid()
    )
  );

-- Officers and up (canManageQuests) accept / assign / delete quests.
CREATE POLICY "Officers manage guild quests"
  ON public.guild_quests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_quests.guild_id AND leader_user_id = auth.uid()
    )
    OR public.guild_member_role(public.guild_quests.guild_id, auth.uid())
       IN ('leader', 'vice_master', 'officer')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_quests.guild_id AND leader_user_id = auth.uid()
    )
    OR public.guild_member_role(public.guild_quests.guild_id, auth.uid())
       IN ('leader', 'vice_master', 'officer')
  );

-- Atomic resolution: verifies officer+, and on success credits the treasury /
-- contribution (bypassing the leader/vice-only guilds UPDATE RLS via SECURITY
-- DEFINER) and advances the assigned NPC members one milestone level.
CREATE OR REPLACE FUNCTION public.resolve_guild_quest(
  p_quest_id UUID,
  p_success BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_q public.guild_quests%ROWTYPE;
  v_currency TEXT;
  v_funds INTEGER;
  v_contribution INTEGER;
BEGIN
  SELECT * INTO v_q
  FROM public.guild_quests
  WHERE id = p_quest_id AND status = 'active';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quest not found or already resolved';
  END IF;

  IF NOT (
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = v_q.guild_id AND leader_user_id = auth.uid()
    )
    OR public.guild_member_role(v_q.guild_id, auth.uid())
       IN ('leader', 'vice_master', 'officer')
  ) THEN
    RAISE EXCEPTION 'Only guild officers can resolve quests';
  END IF;

  IF p_success THEN
    v_currency := COALESCE(v_q.rewards->>'currency', 'gate');
    v_funds := COALESCE((v_q.rewards->>'funds')::INTEGER, 0);
    v_contribution := COALESCE((v_q.rewards->>'contribution')::INTEGER, 0);

    UPDATE public.guilds
    SET
      funds = jsonb_set(
        COALESCE(funds, '{}'::jsonb),
        ARRAY[v_currency],
        to_jsonb(
          COALESCE((funds->>v_currency)::INTEGER, 0) + v_funds
        ),
        true
      ),
      contribution = COALESCE(contribution, 0) + v_contribution
    WHERE id = v_q.guild_id;

    UPDATE public.guild_members
    SET npc_level = COALESCE(npc_level, 1) + 1, npc_xp = 0
    WHERE guild_id = v_q.guild_id
      AND npc_id IS NOT NULL
      AND id::text IN (
        SELECT jsonb_array_elements_text(
          COALESCE(v_q.assigned_member_ids, '[]'::jsonb)
        )
      );

    UPDATE public.guild_quests
    SET status = 'completed', resolved_at = now()
    WHERE id = p_quest_id;
  ELSE
    UPDATE public.guild_quests
    SET status = 'failed', resolved_at = now()
    WHERE id = p_quest_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.resolve_guild_quest(UUID, BOOLEAN) TO authenticated;
