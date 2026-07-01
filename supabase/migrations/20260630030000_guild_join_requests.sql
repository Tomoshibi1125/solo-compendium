-- Guild join requests (Solo Leveling-style join-by-code + GM/Vice approval queue).
-- A player requests to join a guild with a chosen character; the Guild Master or
-- Vice-Master approves (which adds a character-bound membership row) or rejects.

CREATE TABLE IF NOT EXISTS public.guild_join_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  -- Denormalized so guild staff can display the applicant's character without
  -- cross-RLS reads into the characters table (they aren't the character owner).
  character_name TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS guild_join_requests_guild_id_idx
  ON public.guild_join_requests(guild_id);
CREATE INDEX IF NOT EXISTS guild_join_requests_user_id_idx
  ON public.guild_join_requests(user_id);
-- At most one OPEN (pending) request per user per guild.
CREATE UNIQUE INDEX IF NOT EXISTS guild_join_requests_one_pending
  ON public.guild_join_requests(guild_id, user_id)
  WHERE status = 'pending';

ALTER TABLE public.guild_join_requests ENABLE ROW LEVEL SECURITY;

-- The requester sees their own requests; guild staff (leader/vice) see their guild's.
CREATE POLICY "View own or guild-staff join requests"
  ON public.guild_join_requests FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_join_requests.guild_id AND leader_user_id = auth.uid()
    )
    OR public.guild_member_role(public.guild_join_requests.guild_id, auth.uid())
       IN ('leader', 'vice_master')
  );

-- A user may only file a request for themselves.
CREATE POLICY "Users file their own join requests"
  ON public.guild_join_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Requester may cancel their own pending request; staff may update (reject) too.
CREATE POLICY "Requester or staff update join requests"
  ON public.guild_join_requests FOR UPDATE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_join_requests.guild_id AND leader_user_id = auth.uid()
    )
    OR public.guild_member_role(public.guild_join_requests.guild_id, auth.uid())
       IN ('leader', 'vice_master')
  );

CREATE POLICY "Requester deletes own join requests"
  ON public.guild_join_requests FOR DELETE
  USING (user_id = auth.uid());

-- Atomic approval: verifies the actor is leader/vice, inserts the character-bound
-- membership row (the one-guild-per-character index is the hard stop), and marks
-- the request approved. Returns the new member id.
CREATE OR REPLACE FUNCTION public.approve_guild_join_request(
  p_request_id UUID,
  p_role TEXT DEFAULT 'member'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_req public.guild_join_requests%ROWTYPE;
  v_member_id UUID;
BEGIN
  SELECT * INTO v_req
  FROM public.guild_join_requests
  WHERE id = p_request_id AND status = 'pending';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Join request not found or already resolved';
  END IF;

  IF NOT (
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = v_req.guild_id AND leader_user_id = auth.uid()
    )
    OR public.guild_member_role(v_req.guild_id, auth.uid())
       IN ('leader', 'vice_master')
  ) THEN
    RAISE EXCEPTION 'Only the Guild Master or Vice-Master can approve join requests';
  END IF;

  IF p_role NOT IN ('officer', 'member', 'recruit') THEN
    RAISE EXCEPTION 'Invalid role for an approved member: %', p_role;
  END IF;

  INSERT INTO public.guild_members (guild_id, user_id, character_id, role)
  VALUES (v_req.guild_id, v_req.user_id, v_req.character_id, p_role)
  RETURNING id INTO v_member_id;

  UPDATE public.guild_join_requests
  SET status = 'approved', resolved_at = now(), resolved_by = auth.uid()
  WHERE id = p_request_id;

  RETURN v_member_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.approve_guild_join_request(UUID, TEXT) TO authenticated;

-- Join-by-share-code: looks up the guild by code (bypassing the guilds SELECT RLS,
-- which only exposes guilds you already belong to), guards against duplicate/already-
-- member requests, and files a pending request with the chosen character. Returns
-- the new request id.
CREATE OR REPLACE FUNCTION public.request_to_join_guild(
  p_share_code TEXT,
  p_character_id UUID DEFAULT NULL,
  p_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_guild_id UUID;
  v_character_name TEXT;
  v_request_id UUID;
BEGIN
  SELECT id INTO v_guild_id
  FROM public.guilds
  WHERE share_code = upper(trim(p_share_code)) AND is_active IS NOT FALSE;
  IF v_guild_id IS NULL THEN
    RAISE EXCEPTION 'No guild found for that share code';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.guild_members
    WHERE guild_id = v_guild_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'You are already a member of this guild';
  END IF;

  IF p_character_id IS NOT NULL THEN
    SELECT name INTO v_character_name
    FROM public.characters
    WHERE id = p_character_id AND user_id = auth.uid();
    IF v_character_name IS NULL THEN
      RAISE EXCEPTION 'Character not found';
    END IF;
  END IF;

  INSERT INTO public.guild_join_requests
    (guild_id, user_id, character_id, character_name, message)
  VALUES (v_guild_id, auth.uid(), p_character_id, v_character_name, p_message)
  RETURNING id INTO v_request_id;

  RETURN v_request_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.request_to_join_guild(TEXT, UUID, TEXT) TO authenticated;
