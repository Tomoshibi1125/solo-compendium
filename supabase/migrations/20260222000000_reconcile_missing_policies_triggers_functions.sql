-- Reconcile missing policies, triggers, and functions from migrations
-- Addresses all NOTICE/WARN items from migration runs 20260106000000–20260221000000
-- Idempotent: safe to re-run; only adds missing objects

BEGIN;

-- Helper functions for campaign access checks (avoid RLS recursion)
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

CREATE OR REPLACE FUNCTION public.is_campaign_system(p_campaign_id UUID)
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
      AND dm_id IS NOT NULL
  );
$$;

-- Campaign member characters consistency trigger
CREATE OR REPLACE FUNCTION public.ensure_campaign_member_character_consistency()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_member_campaign_id UUID;
BEGIN
  SELECT campaign_id
  INTO v_member_campaign_id
  FROM public.campaign_members
  WHERE id = NEW.campaign_member_id;

  IF v_member_campaign_id IS NULL THEN
    RAISE EXCEPTION 'Campaign member not found for character attachment';
  END IF;

  IF v_member_campaign_id <> NEW.campaign_id THEN
    RAISE EXCEPTION 'Campaign member and character attachment campaign mismatch';
  END IF;

  RETURN NEW;
END;
$$;

-- Drop and recreate trigger to ensure it exists
DROP TRIGGER IF EXISTS ensure_campaign_member_characters_consistency ON public.campaign_member_characters;
CREATE TRIGGER ensure_campaign_member_characters_consistency
  BEFORE INSERT OR UPDATE ON public.campaign_member_characters
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_campaign_member_character_consistency();

-- Ensure RLS is enabled on campaign_member_characters
ALTER TABLE public.campaign_member_characters ENABLE ROW LEVEL SECURITY;

-- Campaign member characters policies
DROP POLICY IF EXISTS campaign_member_characters_select ON public.campaign_member_characters;
CREATE POLICY campaign_member_characters_select
  ON public.campaign_member_characters
  FOR SELECT
  USING (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id));

DROP POLICY IF EXISTS campaign_member_characters_insert ON public.campaign_member_characters;
CREATE POLICY campaign_member_characters_insert
  ON public.campaign_member_characters
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.campaign_members member_row
      WHERE member_row.id = campaign_member_characters.campaign_member_id
        AND member_row.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1
      FROM public.characters c
      WHERE c.id = campaign_member_characters.character_id
        AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS campaign_member_characters_update ON public.campaign_member_characters;
CREATE POLICY campaign_member_characters_update
  ON public.campaign_member_characters
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.campaign_members member_row
      WHERE member_row.id = campaign_member_characters.campaign_member_id
        AND member_row.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS campaign_member_characters_delete ON public.campaign_member_characters;
CREATE POLICY campaign_member_characters_delete
  ON public.campaign_member_characters
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.campaign_members member_row
      WHERE member_row.id = campaign_member_characters.campaign_member_id
        AND member_row.user_id = auth.uid()
    )
  );

-- Campaign invite audit logs policies
DROP POLICY IF EXISTS campaign_invite_audit_logs_select ON public.campaign_invite_audit_logs;
CREATE POLICY campaign_invite_audit_logs_select
  ON public.campaign_invite_audit_logs
  FOR SELECT
  USING (public.is_campaign_dm(campaign_id));

DROP POLICY IF EXISTS campaign_invite_audit_logs_insert ON public.campaign_invite_audit_logs;
CREATE POLICY campaign_invite_audit_logs_insert
  ON public.campaign_invite_audit_logs
  FOR INSERT
  WITH CHECK (public.is_campaign_dm(campaign_id));

-- Campaign RLS policies (restore missing ones)
DROP POLICY IF EXISTS "Users can view campaigns they DM or are members of" ON public.campaigns;
CREATE POLICY "Users can view campaigns they DM or are members of"
  ON public.campaigns
  FOR SELECT
  USING (dm_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "DMs can create campaigns" ON public.campaigns;
CREATE POLICY "DMs can create campaigns"
  ON public.campaigns
  FOR INSERT
  WITH CHECK (dm_id = auth.uid());

DROP POLICY IF EXISTS "DMs can update their own campaigns" ON public.campaigns;
CREATE POLICY "DMs can update their own campaigns"
  ON public.campaigns
  FOR UPDATE
  USING (dm_id = auth.uid());

DROP POLICY IF EXISTS "DMs can delete their own campaigns" ON public.campaigns;
CREATE POLICY "DMs can delete their own campaigns"
  ON public.campaigns
  FOR DELETE
  USING (dm_id = auth.uid());

-- Campaign members policies
DROP POLICY IF EXISTS campaign_members_update ON public.campaign_members;
CREATE POLICY campaign_members_update
  ON public.campaign_members
  FOR UPDATE
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view members of their campaigns" ON public.campaign_members;
CREATE POLICY "Users can view members of their campaigns"
  ON public.campaign_members
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND (dm_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()))));

DROP POLICY IF EXISTS "DMs can add members to their campaigns" ON public.campaign_members;
CREATE POLICY "DMs can add members to their campaigns"
  ON public.campaign_members
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

DROP POLICY IF EXISTS "Users can join campaigns via share code" ON public.campaign_members;
CREATE POLICY "Users can join campaigns via share code"
  ON public.campaign_members
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "DMs can remove members, users can leave" ON public.campaign_members;
CREATE POLICY "DMs can remove members, users can leave"
  ON public.campaign_members
  FOR DELETE
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

-- Campaign messages policies
DROP POLICY IF EXISTS "Users can view messages in their campaigns" ON public.campaign_messages;
CREATE POLICY "Users can view messages in their campaigns"
  ON public.campaign_messages
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND (dm_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()))));

DROP POLICY IF EXISTS "Users can send messages in their campaigns" ON public.campaign_messages;
CREATE POLICY "Users can send messages in their campaigns"
  ON public.campaign_messages
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND (dm_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()))));

DROP POLICY IF EXISTS "Users can edit their own messages" ON public.campaign_messages;
CREATE POLICY "Users can edit their own messages"
  ON public.campaign_messages
  FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own messages, DMs can delete any" ON public.campaign_messages;
CREATE POLICY "Users can delete their own messages, DMs can delete any"
  ON public.campaign_messages
  FOR DELETE
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

-- Campaign notes policies
DROP POLICY IF EXISTS "Users can view notes in their campaigns" ON public.campaign_notes;
CREATE POLICY "Users can view notes in their campaigns"
  ON public.campaign_notes
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND (dm_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()))));

DROP POLICY IF EXISTS "Users can create notes in their campaigns" ON public.campaign_notes;
CREATE POLICY "Users can create notes in their campaigns"
  ON public.campaign_notes
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND (dm_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()))));

DROP POLICY IF EXISTS "Users can edit their own notes, DMs can edit any" ON public.campaign_notes;
CREATE POLICY "Users can edit their own notes, DMs can edit any"
  ON public.campaign_notes
  FOR UPDATE
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own notes, DMs can delete any" ON public.campaign_notes;
CREATE POLICY "Users can delete their own notes, DMs can delete any"
  ON public.campaign_notes
  FOR DELETE
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

-- Campaign character shares policies
DROP POLICY IF EXISTS "Users can view shared characters in their campaigns" ON public.campaign_character_shares;
CREATE POLICY "Users can view shared characters in their campaigns"
  ON public.campaign_character_shares
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND (dm_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()))));

DROP POLICY IF EXISTS "Users can share their own characters" ON public.campaign_character_shares;
CREATE POLICY "Users can share their own characters"
  ON public.campaign_character_shares
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.characters WHERE id = character_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own shares" ON public.campaign_character_shares;
CREATE POLICY "Users can update their own shares"
  ON public.campaign_character_shares
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.characters WHERE id = character_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own shares" ON public.campaign_character_shares;
CREATE POLICY "Users can delete their own shares"
  ON public.campaign_character_shares
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.characters WHERE id = character_id AND user_id = auth.uid()));

-- Sourcebook catalog policies
DROP POLICY IF EXISTS sourcebook_catalog_select ON public.sourcebook_catalog;
CREATE POLICY sourcebook_catalog_select
  ON public.sourcebook_catalog
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS sourcebook_catalog_manage ON public.sourcebook_catalog;
CREATE POLICY sourcebook_catalog_manage
  ON public.sourcebook_catalog
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- User sourcebook entitlements policies
DROP POLICY IF EXISTS user_sourcebook_entitlements_select ON public.user_sourcebook_entitlements;
CREATE POLICY user_sourcebook_entitlements_select
  ON public.user_sourcebook_entitlements
  FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS user_sourcebook_entitlements_manage ON public.user_sourcebook_entitlements;
CREATE POLICY user_sourcebook_entitlements_manage
  ON public.user_sourcebook_entitlements
  FOR ALL
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Campaign sourcebook shares policies
DROP POLICY IF EXISTS campaign_sourcebook_shares_select ON public.campaign_sourcebook_shares;
CREATE POLICY campaign_sourcebook_shares_select
  ON public.campaign_sourcebook_shares
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND (dm_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()))));

DROP POLICY IF EXISTS campaign_sourcebook_shares_manage ON public.campaign_sourcebook_shares;
CREATE POLICY campaign_sourcebook_shares_manage
  ON public.campaign_sourcebook_shares
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

-- Homebrew content policies
DROP POLICY IF EXISTS homebrew_content_select ON public.homebrew_content;
CREATE POLICY homebrew_content_select
  ON public.homebrew_content
  FOR SELECT
  USING (is_public OR user_id = auth.uid());

DROP POLICY IF EXISTS homebrew_content_insert ON public.homebrew_content;
CREATE POLICY homebrew_content_insert
  ON public.homebrew_content
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS homebrew_content_update ON public.homebrew_content;
CREATE POLICY homebrew_content_update
  ON public.homebrew_content
  FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS homebrew_content_delete ON public.homebrew_content;
CREATE POLICY homebrew_content_delete
  ON public.homebrew_content
  FOR DELETE
  USING (user_id = auth.uid());

-- Homebrew content versions policies
DROP POLICY IF EXISTS homebrew_content_versions_select ON public.homebrew_content_versions;
CREATE POLICY homebrew_content_versions_select
  ON public.homebrew_content_versions
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.homebrew_content WHERE id = homebrew_id AND (is_public OR user_id = auth.uid())));

DROP POLICY IF EXISTS homebrew_content_versions_insert ON public.homebrew_content_versions;
CREATE POLICY homebrew_content_versions_insert
  ON public.homebrew_content_versions
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.homebrew_content WHERE id = homebrew_id AND user_id = auth.uid()));

-- Marketplace items policies
DROP POLICY IF EXISTS marketplace_items_select ON public.marketplace_items;
CREATE POLICY marketplace_items_select
  ON public.marketplace_items
  FOR SELECT
  USING (is_listed OR author_id = auth.uid());

DROP POLICY IF EXISTS marketplace_items_insert ON public.marketplace_items;
CREATE POLICY marketplace_items_insert
  ON public.marketplace_items
  FOR INSERT
  WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS marketplace_items_update ON public.marketplace_items;
CREATE POLICY marketplace_items_update
  ON public.marketplace_items
  FOR UPDATE
  USING (author_id = auth.uid());

DROP POLICY IF EXISTS marketplace_items_delete ON public.marketplace_items;
CREATE POLICY marketplace_items_delete
  ON public.marketplace_items
  FOR DELETE
  USING (author_id = auth.uid());

-- Marketplace reviews policies
DROP POLICY IF EXISTS marketplace_reviews_select ON public.marketplace_reviews;
CREATE POLICY marketplace_reviews_select
  ON public.marketplace_reviews
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS marketplace_reviews_insert ON public.marketplace_reviews;
CREATE POLICY marketplace_reviews_insert
  ON public.marketplace_reviews
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS marketplace_reviews_update ON public.marketplace_reviews;
CREATE POLICY marketplace_reviews_update
  ON public.marketplace_reviews
  FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS marketplace_reviews_delete ON public.marketplace_reviews;
CREATE POLICY marketplace_reviews_delete
  ON public.marketplace_reviews
  FOR DELETE
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.marketplace_items WHERE id = item_id AND author_id = auth.uid()));

-- Marketplace downloads policies
DROP POLICY IF EXISTS marketplace_downloads_select ON public.marketplace_downloads;
CREATE POLICY marketplace_downloads_select
  ON public.marketplace_downloads
  FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS marketplace_downloads_insert ON public.marketplace_downloads;
CREATE POLICY marketplace_downloads_insert
  ON public.marketplace_downloads
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- User marketplace entitlements policies
DROP POLICY IF EXISTS user_marketplace_entitlements_select ON public.user_marketplace_entitlements;
CREATE POLICY user_marketplace_entitlements_select
  ON public.user_marketplace_entitlements
  FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS user_marketplace_entitlements_manage ON public.user_marketplace_entitlements;
CREATE POLICY user_marketplace_entitlements_manage
  ON public.user_marketplace_entitlements
  FOR ALL
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Campaign sessions policies
DROP POLICY IF EXISTS campaign_sessions_select ON public.campaign_sessions;
CREATE POLICY campaign_sessions_select
  ON public.campaign_sessions
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND (dm_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()))));

DROP POLICY IF EXISTS campaign_sessions_manage ON public.campaign_sessions;
CREATE POLICY campaign_sessions_manage
  ON public.campaign_sessions
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

-- Campaign session logs policies
DROP POLICY IF EXISTS campaign_session_logs_select ON public.campaign_session_logs;
CREATE POLICY campaign_session_logs_select
  ON public.campaign_session_logs
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND (dm_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()))));

DROP POLICY IF EXISTS campaign_session_logs_insert ON public.campaign_session_logs;
CREATE POLICY campaign_session_logs_insert
  ON public.campaign_session_logs
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND (dm_id = auth.uid() OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = id AND user_id = auth.uid()))));

DROP POLICY IF EXISTS campaign_session_logs_update ON public.campaign_session_logs;
CREATE POLICY campaign_session_logs_update
  ON public.campaign_session_logs
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

DROP POLICY IF EXISTS campaign_session_logs_delete ON public.campaign_session_logs;
CREATE POLICY campaign_session_logs_delete
  ON public.campaign_session_logs
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()));

-- Updated_at triggers for sourcebook/homebrew/marketplace/session tables
CREATE OR REPLACE FUNCTION public.update_sourcebook_catalog_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_sourcebook_catalog_updated_at ON public.sourcebook_catalog;
CREATE TRIGGER update_sourcebook_catalog_updated_at
  BEFORE UPDATE ON public.sourcebook_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sourcebook_catalog_updated_at();

CREATE OR REPLACE FUNCTION public.update_user_sourcebook_entitlements_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_user_sourcebook_entitlements_updated_at ON public.user_sourcebook_entitlements;
CREATE TRIGGER update_user_sourcebook_entitlements_updated_at
  BEFORE UPDATE ON public.user_sourcebook_entitlements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_sourcebook_entitlements_updated_at();

CREATE OR REPLACE FUNCTION public.update_campaign_sourcebook_shares_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_campaign_sourcebook_shares_updated_at ON public.campaign_sourcebook_shares;
CREATE TRIGGER update_campaign_sourcebook_shares_updated_at
  BEFORE UPDATE ON public.campaign_sourcebook_shares
  FOR EACH ROW
  EXECUTE FUNCTION public.update_campaign_sourcebook_shares_updated_at();

CREATE OR REPLACE FUNCTION public.capture_homebrew_version_snapshot()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND (
    OLD.title IS DISTINCT FROM NEW.title OR
    OLD.description IS DISTINCT FROM NEW.description OR
    OLD.content IS DISTINCT FROM NEW.content OR
    OLD.entry_type IS DISTINCT FROM NEW.entry_type OR
    OLD.metadata IS DISTINCT FROM NEW.metadata
  ) THEN
    INSERT INTO public.homebrew_content_versions (
      homebrew_id,
      version_number,
      title,
      description,
      content,
      entry_type,
      metadata,
      user_id
    )
    SELECT
      NEW.id,
      COALESCE((SELECT MAX(version_number) FROM public.homebrew_content_versions WHERE homebrew_id = NEW.id), 0) + 1,
      NEW.title,
      NEW.description,
      NEW.content,
      NEW.entry_type,
      NEW.metadata,
      NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS capture_homebrew_version_snapshot ON public.homebrew_content;
CREATE TRIGGER capture_homebrew_version_snapshot
  BEFORE UPDATE ON public.homebrew_content
  FOR EACH ROW
  EXECUTE FUNCTION public.capture_homebrew_version_snapshot();

CREATE OR REPLACE FUNCTION public.update_marketplace_items_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_marketplace_items_updated_at ON public.marketplace_items;
CREATE TRIGGER update_marketplace_items_updated_at
  BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_marketplace_items_updated_at();

CREATE OR REPLACE FUNCTION public.update_marketplace_reviews_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_marketplace_reviews_updated_at ON public.marketplace_reviews;
CREATE TRIGGER update_marketplace_reviews_updated_at
  BEFORE UPDATE ON public.marketplace_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_marketplace_reviews_updated_at();

CREATE OR REPLACE FUNCTION public.update_user_marketplace_entitlements_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_user_marketplace_entitlements_updated_at ON public.user_marketplace_entitlements;
CREATE TRIGGER update_user_marketplace_entitlements_updated_at
  BEFORE UPDATE ON public.user_marketplace_entitlements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_marketplace_entitlements_updated_at();

CREATE OR REPLACE FUNCTION public.update_campaign_sessions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_campaign_sessions_updated_at ON public.campaign_sessions;
CREATE TRIGGER update_campaign_sessions_updated_at
  BEFORE UPDATE ON public.campaign_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_campaign_sessions_updated_at();

CREATE OR REPLACE FUNCTION public.update_campaign_session_logs_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_campaign_session_logs_updated_at ON public.campaign_session_logs;
CREATE TRIGGER update_campaign_session_logs_updated_at
  BEFORE UPDATE ON public.campaign_session_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_campaign_session_logs_updated_at();

-- Profiles insert policy (restore if missing)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (id = auth.uid());

-- Auth trigger for new user handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', COALESCE(NEW.raw_user_meta_data->>'role', 'player'));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill campaign_member_characters from existing campaign_members with character_id
INSERT INTO public.campaign_member_characters (
  campaign_id,
  campaign_member_id,
  character_id,
  created_by,
  created_at
)
SELECT
  member_row.campaign_id,
  member_row.id,
  member_row.character_id,
  member_row.user_id,
  member_row.joined_at
FROM public.campaign_members member_row
WHERE member_row.character_id IS NOT NULL
ON CONFLICT (campaign_member_id, character_id) DO NOTHING;

COMMIT;
