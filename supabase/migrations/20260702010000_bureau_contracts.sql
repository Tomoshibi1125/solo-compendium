-- Bureau dispatch board (Phase 2G): the Warden — in-fiction, the Hunter
-- Bureau — publishes gate contracts and dungeon-break alerts. Guild officers
-- accept a published contract, which atomically flips it to accepted and
-- places it on the guild's quest board (guild_quests) where the existing
-- assign/resolve flow takes over.

CREATE TABLE IF NOT EXISTS public.bureau_contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  publisher_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'contract'
    CHECK (kind IN ('contract', 'alert')),
  title TEXT NOT NULL,
  summary TEXT,
  rank TEXT NOT NULL DEFAULT 'E'
    CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S', 'SS')),
  source_quest_id TEXT,
  status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('published', 'accepted', 'closed')),
  accepted_by_guild_id UUID REFERENCES public.guilds(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS bureau_contracts_status_idx
  ON public.bureau_contracts(status);
CREATE INDEX IF NOT EXISTS bureau_contracts_publisher_idx
  ON public.bureau_contracts(publisher_user_id);

ALTER TABLE public.bureau_contracts ENABLE ROW LEVEL SECURITY;

-- The dispatch board is public in-app: any signed-in user can read it.
CREATE POLICY "Authenticated users view the dispatch board"
  ON public.bureau_contracts FOR SELECT
  TO authenticated
  USING (true);

-- Only the publishing Warden manages their own postings.
CREATE POLICY "Publishers manage their contracts"
  ON public.bureau_contracts FOR ALL
  USING (publisher_user_id = auth.uid())
  WITH CHECK (publisher_user_id = auth.uid());

-- Atomic accept: verifies the caller can manage quests for the guild
-- (leader / vice_master / officer), locks the published contract, inserts the
-- guild_quests row (reward math mirrors lib/guildQuests.ts
-- questRewardsForRank: factor = rank index, funds 50×, contribution 20×,
-- paid in gate credits), and flips the contract to accepted.
CREATE OR REPLACE FUNCTION public.accept_bureau_contract(
  p_contract_id UUID,
  p_guild_id UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_contract public.bureau_contracts%ROWTYPE;
  v_factor INT;
  v_quest_id UUID;
BEGIN
  IF NOT (
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = p_guild_id AND leader_user_id = auth.uid()
    )
    OR public.guild_member_role(p_guild_id, auth.uid())
       IN ('leader', 'vice_master', 'officer')
  ) THEN
    RAISE EXCEPTION 'Not authorized to accept contracts for this guild';
  END IF;

  SELECT * INTO v_contract
  FROM public.bureau_contracts
  WHERE id = p_contract_id AND kind = 'contract' AND status = 'published'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Contract not found or no longer available';
  END IF;

  v_factor := array_position(
    ARRAY['E', 'D', 'C', 'B', 'A', 'S', 'SS'],
    v_contract.rank
  );

  INSERT INTO public.guild_quests (guild_id, source_quest_id, title, rank, rewards)
  VALUES (
    p_guild_id,
    COALESCE(v_contract.source_quest_id, 'bureau:' || v_contract.id::text),
    v_contract.title,
    v_contract.rank,
    jsonb_build_object(
      'currency', 'gate',
      'funds', 50 * v_factor,
      'contribution', 20 * v_factor
    )
  )
  RETURNING id INTO v_quest_id;

  UPDATE public.bureau_contracts
  SET status = 'accepted',
      accepted_by_guild_id = p_guild_id,
      accepted_at = now()
  WHERE id = p_contract_id;

  RETURN v_quest_id;
END;
$$;

-- Minimal public leaderboard projection. The guilds SELECT policy is
-- member-scoped, but the Bureau's "no guild too strong" balance board needs
-- name + progression for every active guild — expose exactly that and no more.
CREATE OR REPLACE FUNCTION public.bureau_guild_leaderboard()
RETURNS TABLE (
  id UUID,
  name TEXT,
  guild_rank TEXT,
  contribution INTEGER,
  member_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    g.id,
    g.name,
    g.guild_rank,
    COALESCE(g.contribution, 0),
    (SELECT count(*) FROM public.guild_members m WHERE m.guild_id = g.id)
  FROM public.guilds g
  WHERE g.is_active
  ORDER BY COALESCE(g.contribution, 0) DESC, g.created_at ASC
  LIMIT 50;
$$;
