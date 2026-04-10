-- Guild Management System Migration
-- Creates guilds and guild_members tables with RLS

-- 1. Create guilds table
CREATE TABLE IF NOT EXISTS public.guilds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  motto TEXT,
  leader_user_id UUID NOT NULL REFERENCES auth.users(id),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  share_code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create guild_members table
CREATE TABLE IF NOT EXISTS public.guild_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  npc_id TEXT,
  npc_name TEXT,
  npc_data JSONB,
  role TEXT NOT NULL CHECK (role IN ('leader', 'officer', 'member', 'recruit')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  -- Leveling for NPC members
  npc_level INTEGER,
  npc_xp INTEGER DEFAULT 0,
  npc_leveling_mode TEXT CHECK (npc_leveling_mode IN ('auto', 'manual')) DEFAULT 'auto'
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS guilds_leader_user_id_idx ON public.guilds(leader_user_id);
CREATE INDEX IF NOT EXISTS guilds_campaign_id_idx ON public.guilds(campaign_id);
CREATE INDEX IF NOT EXISTS guilds_share_code_idx ON public.guilds(share_code);
CREATE INDEX IF NOT EXISTS guild_members_guild_id_idx ON public.guild_members(guild_id);
CREATE INDEX IF NOT EXISTS guild_members_user_id_idx ON public.guild_members(user_id);
CREATE INDEX IF NOT EXISTS guild_members_character_id_idx ON public.guild_members(character_id);

-- 4. Updated_at trigger
CREATE TRIGGER update_guilds_updated_at
  BEFORE UPDATE ON public.guilds
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- 5. RLS for guilds
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view guilds they lead or are members of"
  ON public.guilds FOR SELECT
  USING (
    leader_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.guild_members
      WHERE guild_id = public.guilds.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create guilds"
  ON public.guilds FOR INSERT
  WITH CHECK (leader_user_id = auth.uid());

CREATE POLICY "Guild leaders can update their guilds"
  ON public.guilds FOR UPDATE
  USING (leader_user_id = auth.uid());

CREATE POLICY "Guild leaders can delete their guilds"
  ON public.guilds FOR DELETE
  USING (leader_user_id = auth.uid());

-- 6. RLS for guild_members
ALTER TABLE public.guild_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view members of their guilds"
  ON public.guild_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_members.guild_id
      AND (leader_user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.guild_members gm
        WHERE gm.guild_id = public.guilds.id AND gm.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Guild leaders can add members"
  ON public.guild_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_members.guild_id AND leader_user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Guild leaders can remove members, members can leave"
  ON public.guild_members FOR DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_members.guild_id AND leader_user_id = auth.uid()
    )
  );

CREATE POLICY "Guild leaders can update member roles"
  ON public.guild_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.guilds
      WHERE id = public.guild_members.guild_id AND leader_user_id = auth.uid()
    )
  );

-- 7. Guild share code function
CREATE OR REPLACE FUNCTION public.create_guild_with_code(
  p_name TEXT,
  p_description TEXT,
  p_motto TEXT,
  p_leader_user_id UUID,
  p_campaign_id UUID DEFAULT NULL
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

  INSERT INTO public.guild_members (guild_id, user_id, role)
  VALUES (v_guild_id, p_leader_user_id, 'leader');

  RETURN v_guild_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.create_guild_with_code(TEXT, TEXT, TEXT, UUID, UUID) TO authenticated;
