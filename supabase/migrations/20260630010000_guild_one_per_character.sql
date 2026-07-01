-- Correct the guild membership limit: ONE GUILD PER CHARACTER (not per user).
-- A user may lead/join one guild *per character* (up to the 6-character cap), so the
-- previous one-membership-per-user index is replaced with a per-character one. Guild
-- membership now binds the acting character, so create/join sets guild_members.character_id.

-- 1. Drop the (incorrect) one-guild-per-user index from 20260630000000.
DROP INDEX IF EXISTS public.guild_members_one_per_user;

-- 2. One guild per character: a character may hold only one membership row.
--    NPC rows (character_id NULL) and legacy unlinked rows are exempt via the partial index.
CREATE UNIQUE INDEX IF NOT EXISTS guild_members_one_per_character
  ON public.guild_members(character_id)
  WHERE character_id IS NOT NULL;

-- 3. create_guild_with_code now binds the founding character on the leader row.
--    (Signature changes — drop the old 5-arg version before recreating with p_character_id.)
DROP FUNCTION IF EXISTS public.create_guild_with_code(TEXT, TEXT, TEXT, UUID, UUID);

CREATE OR REPLACE FUNCTION public.create_guild_with_code(
  p_name TEXT,
  p_description TEXT,
  p_motto TEXT,
  p_leader_user_id UUID,
  p_campaign_id UUID DEFAULT NULL,
  p_character_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_guild_id UUID;
  v_share_code TEXT;
  max_attempts INTEGER := 10;
  attempts INTEGER := 0;
BEGIN
  LOOP
    v_share_code := generate_share_code();
    IF NOT EXISTS (SELECT 1 FROM public.guilds WHERE share_code = v_share_code) THEN
      EXIT;
    END IF;
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique share code after % attempts', max_attempts;
    END IF;
  END LOOP;

  INSERT INTO public.guilds (name, description, motto, leader_user_id, campaign_id, share_code)
  VALUES (p_name, p_description, p_motto, p_leader_user_id, p_campaign_id, v_share_code)
  RETURNING id INTO v_guild_id;

  INSERT INTO public.guild_members (guild_id, user_id, character_id, role)
  VALUES (v_guild_id, p_leader_user_id, p_character_id, 'leader');

  RETURN v_guild_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.create_guild_with_code(TEXT, TEXT, TEXT, UUID, UUID, UUID) TO authenticated;
