-- Fix campaign RLS recursion by restoring helper functions and safe policies.

CREATE OR REPLACE FUNCTION public.is_campaign_member(
  p_campaign_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaign_members
    WHERE campaign_id = p_campaign_id
      AND user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_campaign_dm(
  p_campaign_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaigns
    WHERE id = p_campaign_id
      AND dm_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_campaign_active(p_campaign_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaigns
    WHERE id = p_campaign_id
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_campaign_by_share_code(p_share_code TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  dm_id UUID,
  share_code TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  settings JSONB
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT
    c.id,
    c.name,
    c.description,
    c.dm_id,
    c.share_code,
    c.is_active,
    c.created_at,
    c.updated_at,
    c.settings
  FROM public.campaigns c
  WHERE c.share_code = p_share_code
    AND c.is_active = true
  LIMIT 1;
$$;

DROP POLICY IF EXISTS "campaigns_select" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_insert" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_update" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_delete" ON public.campaigns;
DROP POLICY IF EXISTS "Users can view campaigns they DM or are members of" ON public.campaigns;
DROP POLICY IF EXISTS "DMs can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "DMs can update their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "DMs can delete their own campaigns" ON public.campaigns;

DROP POLICY IF EXISTS "campaign_members_select" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_insert" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_update" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_update_self" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_update_dm" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_delete" ON public.campaign_members;
DROP POLICY IF EXISTS "Users can view members of their campaigns" ON public.campaign_members;
DROP POLICY IF EXISTS "DMs can add members to their campaigns" ON public.campaign_members;
DROP POLICY IF EXISTS "Users can join campaigns via share code" ON public.campaign_members;
DROP POLICY IF EXISTS "DMs can remove members, users can leave" ON public.campaign_members;

DROP POLICY IF EXISTS "campaign_messages_select" ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign_messages_insert" ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign_messages_update" ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign_messages_delete" ON public.campaign_messages;
DROP POLICY IF EXISTS "Users can view messages in their campaigns" ON public.campaign_messages;
DROP POLICY IF EXISTS "Users can send messages in their campaigns" ON public.campaign_messages;
DROP POLICY IF EXISTS "Users can edit their own messages" ON public.campaign_messages;
DROP POLICY IF EXISTS "Users can delete their own messages, DMs can delete any" ON public.campaign_messages;

DROP POLICY IF EXISTS "campaign_notes_select" ON public.campaign_notes;
DROP POLICY IF EXISTS "campaign_notes_insert" ON public.campaign_notes;
DROP POLICY IF EXISTS "campaign_notes_update" ON public.campaign_notes;
DROP POLICY IF EXISTS "campaign_notes_delete" ON public.campaign_notes;
DROP POLICY IF EXISTS "Users can view notes in their campaigns" ON public.campaign_notes;
DROP POLICY IF EXISTS "Users can create notes in their campaigns" ON public.campaign_notes;
DROP POLICY IF EXISTS "Users can edit their own notes, DMs can edit any" ON public.campaign_notes;
DROP POLICY IF EXISTS "Users can delete their own notes, DMs can delete any" ON public.campaign_notes;

DROP POLICY IF EXISTS "campaign_character_shares_select" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "campaign_character_shares_insert" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "campaign_character_shares_update" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "campaign_character_shares_delete" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "Users can view shared characters in their campaigns" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "Users can share their own characters" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "Users can update their own shares" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "Users can delete their own shares" ON public.campaign_character_shares;

CREATE POLICY "campaigns_select" ON public.campaigns FOR SELECT
USING (public.is_campaign_dm(id) OR public.is_campaign_member(id));

CREATE POLICY "campaigns_insert" ON public.campaigns FOR INSERT
WITH CHECK (dm_id = auth.uid());

CREATE POLICY "campaigns_update" ON public.campaigns FOR UPDATE
USING (public.is_campaign_dm(id));

CREATE POLICY "campaigns_delete" ON public.campaigns FOR DELETE
USING (public.is_campaign_dm(id));

CREATE POLICY "campaign_members_select" ON public.campaign_members FOR SELECT
USING (
  user_id = auth.uid()
  OR public.is_campaign_dm(campaign_id)
  OR public.is_campaign_member(campaign_id)
);

CREATE POLICY "campaign_members_insert" ON public.campaign_members FOR INSERT
WITH CHECK (
  (user_id = auth.uid() AND public.is_campaign_active(campaign_id))
  OR public.is_campaign_dm(campaign_id)
);

CREATE POLICY "campaign_members_update_self" ON public.campaign_members FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid() AND role = 'hunter');

CREATE POLICY "campaign_members_update_dm" ON public.campaign_members FOR UPDATE
USING (public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_members_delete" ON public.campaign_members FOR DELETE
USING (user_id = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_messages_select" ON public.campaign_messages FOR SELECT
USING (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id));

CREATE POLICY "campaign_messages_insert" ON public.campaign_messages FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id))
);

CREATE POLICY "campaign_messages_update" ON public.campaign_messages FOR UPDATE
USING (user_id = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_messages_delete" ON public.campaign_messages FOR DELETE
USING (user_id = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_notes_select" ON public.campaign_notes FOR SELECT
USING (
  user_id = auth.uid()
  OR (is_shared = true AND (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id)))
);

CREATE POLICY "campaign_notes_insert" ON public.campaign_notes FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id))
);

CREATE POLICY "campaign_notes_update" ON public.campaign_notes FOR UPDATE
USING (user_id = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_notes_delete" ON public.campaign_notes FOR DELETE
USING (user_id = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_character_shares_select" ON public.campaign_character_shares FOR SELECT
USING (
  shared_by = auth.uid()
  OR public.is_campaign_dm(campaign_id)
  OR public.is_campaign_member(campaign_id)
);

CREATE POLICY "campaign_character_shares_insert" ON public.campaign_character_shares FOR INSERT
WITH CHECK (
  shared_by = auth.uid()
  AND (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id))
);

CREATE POLICY "campaign_character_shares_update" ON public.campaign_character_shares FOR UPDATE
USING (shared_by = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_character_shares_delete" ON public.campaign_character_shares FOR DELETE
USING (shared_by = auth.uid() OR public.is_campaign_dm(campaign_id));

GRANT EXECUTE ON FUNCTION public.is_campaign_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_campaign_dm(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_campaign_active(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_campaign_by_share_code(TEXT) TO authenticated;
