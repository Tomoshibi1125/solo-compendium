-- Restore scoped RLS for the tables the app reads and writes directly.
--
-- 20260223163000_force_sync_policies.sql dropped every public policy and put
-- back only some; 20260317221824 then gave the tables left bare a
-- service-role-only policy. Since then signed-in users have been refused on
-- these paths: character spell slots, journal, feature choices, rune and
-- shadow army rows, technique edits, the Umbral Legion roster, campaign chat,
-- rules and the rule log, relics, invites, loot analytics, party stash links,
-- homebrew, marketplace listings, compendium notes, tool state, roll history,
-- and the feature-choice catalog. Each rule below is scoped to its caller: the
-- character's owner, a campaign member, the campaign's Wardens (primary or
-- co-Warden), or an account admin (app_metadata, never profiles.role).
--
-- Over-broad rules found alongside are closed here too:
--   * homebrew version snapshots, compendium notes, and tool state were
--     readable by anyone, including signed-out callers;
--   * unlisted marketplace items were readable by anyone;
--   * any signed-in user could grant themselves a marketplace entitlement and
--     rewrite a review, including its verified-purchase flag;
--   * any signed-in user could write compendium spells, tattoos, and
--     locations, and other compendium writes trusted the editable
--     profiles.role;
--   * sign-up metadata could claim the 'admin' profile role, which those
--     compendium and entitlement rules trusted;
--   * technique rows checked only that the character was visible, not owned;
--   * a suspended account could clear its own profiles.banned_at.
--
-- Campaign relics now store the canonical relic slug and are created only
-- through assign_campaign_relic.
BEGIN;

-- ── Character sheet rows: the character's owner ─────────────────────────────
-- Linked Wardens keep their campaign_managers_read_* policies. Each table gets
-- exactly the commands the app uses on it.
DROP POLICY IF EXISTS character_techniques_insert ON public.character_techniques;
DROP POLICY IF EXISTS character_techniques_select ON public.character_techniques;

DO $$
DECLARE
  v_target RECORD;
  v_command TEXT;
  v_policy TEXT;
BEGIN
  FOR v_target IN
    SELECT *
    FROM (VALUES
      ('character_feature_choices', ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE']),
      ('character_journal', ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE']),
      ('character_spell_slots', ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE']),
      ('character_techniques', ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE']),
      ('character_rune_knowledge', ARRAY['SELECT', 'INSERT']),
      ('character_rune_inscriptions', ARRAY['SELECT', 'INSERT']),
      ('character_shadow_army', ARRAY['SELECT', 'INSERT']),
      ('character_umbral_legionnaires', ARRAY['SELECT', 'UPDATE'])
    ) AS target(table_name, commands)
  LOOP
    FOREACH v_command IN ARRAY v_target.commands LOOP
      v_policy := v_target.table_name || '_owner_' || lower(v_command);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', v_policy, v_target.table_name);
      EXECUTE format(
        CASE v_command
          WHEN 'SELECT' THEN
            'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated '
            'USING (app_private.actor_owns_character(character_id))'
          WHEN 'INSERT' THEN
            'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated '
            'WITH CHECK (app_private.actor_owns_character(character_id))'
          WHEN 'UPDATE' THEN
            'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated '
            'USING (app_private.actor_owns_character(character_id)) '
            'WITH CHECK (app_private.actor_owns_character(character_id))'
          WHEN 'DELETE' THEN
            'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated '
            'USING (app_private.actor_owns_character(character_id))'
        END,
        v_policy,
        v_target.table_name
      );
    END LOOP;
  END LOOP;
END;
$$;

-- ── Campaign chat ───────────────────────────────────────────────────────────
-- The app posts 'rift' for Warden broadcasts and Rift announcements; the old
-- check still named that type 'system' (kept for server-written rows).
ALTER TABLE public.campaign_messages
  DROP CONSTRAINT IF EXISTS campaign_messages_message_type_check;
ALTER TABLE public.campaign_messages
  ADD CONSTRAINT campaign_messages_message_type_check
  CHECK (message_type = ANY (ARRAY['chat', 'roll', 'rift', 'system', 'whisper']));

DROP POLICY IF EXISTS campaign_messages_member_insert ON public.campaign_messages;
CREATE POLICY campaign_messages_member_insert ON public.campaign_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND message_type = ANY (ARRAY['chat', 'roll', 'rift', 'whisper'])
    AND app_private.actor_in_campaign(campaign_id)
  );

DROP POLICY IF EXISTS campaign_messages_author_or_warden_delete ON public.campaign_messages;
CREATE POLICY campaign_messages_author_or_warden_delete ON public.campaign_messages
  FOR DELETE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR public.is_campaign_system(campaign_id, (SELECT auth.uid()))
  );

-- ── Campaign rules and the rule log ─────────────────────────────────────────
-- Members read the rules; the rules and their log belong to the Wardens.
DROP POLICY IF EXISTS campaign_rules_member_select ON public.campaign_rules;
CREATE POLICY campaign_rules_member_select ON public.campaign_rules
  FOR SELECT TO authenticated
  USING (app_private.actor_in_campaign(campaign_id));

DROP POLICY IF EXISTS campaign_rules_warden_insert ON public.campaign_rules;
CREATE POLICY campaign_rules_warden_insert ON public.campaign_rules
  FOR INSERT TO authenticated
  WITH CHECK (public.is_campaign_system(campaign_id, (SELECT auth.uid())));

DROP POLICY IF EXISTS campaign_rules_warden_update ON public.campaign_rules;
CREATE POLICY campaign_rules_warden_update ON public.campaign_rules
  FOR UPDATE TO authenticated
  USING (public.is_campaign_system(campaign_id, (SELECT auth.uid())))
  WITH CHECK (public.is_campaign_system(campaign_id, (SELECT auth.uid())));

DROP POLICY IF EXISTS campaign_rule_events_warden_select ON public.campaign_rule_events;
CREATE POLICY campaign_rule_events_warden_select ON public.campaign_rule_events
  FOR SELECT TO authenticated
  USING (public.is_campaign_system(campaign_id, (SELECT auth.uid())));

DROP POLICY IF EXISTS campaign_rule_events_warden_insert ON public.campaign_rule_events;
CREATE POLICY campaign_rule_events_warden_insert ON public.campaign_rule_events
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = (SELECT auth.uid())
    AND public.is_campaign_system(campaign_id, (SELECT auth.uid()))
  );

-- ── Campaign relic vault ────────────────────────────────────────────────────
-- relic_id was a UUID foreign key to the legacy compendium_relics rows, but
-- the app's relic catalog is static and keyed by slug ("frost-axe"), so no
-- add could succeed. The table is empty everywhere; the change moves no data.
ALTER TABLE public.campaign_relic_instances
  DROP CONSTRAINT IF EXISTS campaign_relic_instances_relic_id_fkey;
ALTER TABLE public.campaign_relic_instances
  ALTER COLUMN relic_id TYPE TEXT USING relic_id::text;
COMMENT ON COLUMN public.campaign_relic_instances.relic_id IS
  'Canonical relic id (static compendium slug).';

DROP FUNCTION IF EXISTS public.assign_campaign_relic(UUID, UUID, TEXT, TEXT, JSONB, NUMERIC, UUID, BOOLEAN);
DROP FUNCTION IF EXISTS public.assign_campaign_relic_unchecked(UUID, UUID, TEXT, TEXT, JSONB, NUMERIC, UUID, BOOLEAN);

-- The Warden supplies the catalog value; it is checked against the
-- campaign's own economy cap.
CREATE FUNCTION public.assign_campaign_relic_unchecked(
  p_campaign_id UUID,
  p_relic_id TEXT DEFAULT NULL,
  p_name TEXT DEFAULT NULL,
  p_rarity TEXT DEFAULT NULL,
  p_properties JSONB DEFAULT '{}'::jsonb,
  p_value_credits NUMERIC DEFAULT NULL,
  p_bound_to_member_id UUID DEFAULT NULL,
  p_tradeable BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_rules JSONB;
  v_limit NUMERIC;
  v_id UUID;
BEGIN
  IF NOT public.is_campaign_system(p_campaign_id, auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized to assign relic';
  END IF;

  IF p_name IS NULL OR btrim(p_name) = '' THEN
    RAISE EXCEPTION 'Relic name is required';
  END IF;

  SELECT rule_row.rules INTO v_rules
  FROM public.campaign_rules AS rule_row
  WHERE rule_row.campaign_id = p_campaign_id;

  IF v_rules ? 'economy_max_relic_value' THEN
    v_limit := (v_rules ->> 'economy_max_relic_value')::numeric;
    IF v_limit IS NOT NULL AND p_value_credits IS NOT NULL AND p_value_credits > v_limit THEN
      RAISE EXCEPTION 'ECONOMY_RULE_VIOLATION: relic value exceeds limit';
    END IF;
  END IF;

  INSERT INTO public.campaign_relic_instances (
    campaign_id,
    relic_id,
    name,
    rarity,
    properties,
    value_credits,
    bound_to_member_id,
    tradeable,
    created_by,
    assigned_at
  )
  VALUES (
    p_campaign_id,
    NULLIF(btrim(p_relic_id), ''),
    btrim(p_name),
    p_rarity,
    COALESCE(p_properties, '{}'::jsonb),
    p_value_credits,
    p_bound_to_member_id,
    COALESCE(p_tradeable, true),
    auth.uid(),
    CASE WHEN p_bound_to_member_id IS NOT NULL THEN now() ELSE NULL END
  )
  RETURNING id INTO v_id;

  INSERT INTO public.campaign_rule_events (campaign_id, created_by, kind, payload)
  VALUES (
    p_campaign_id,
    auth.uid(),
    'relic_assigned',
    jsonb_build_object(
      'relic_id', v_id,
      'canonical_relic_id', NULLIF(btrim(p_relic_id), ''),
      'value_credits', p_value_credits
    )
  );

  RETURN v_id;
END;
$$;

CREATE FUNCTION public.assign_campaign_relic(
  p_campaign_id UUID,
  p_relic_id TEXT DEFAULT NULL,
  p_name TEXT DEFAULT NULL,
  p_rarity TEXT DEFAULT NULL,
  p_properties JSONB DEFAULT '{}'::jsonb,
  p_value_credits NUMERIC DEFAULT NULL,
  p_bound_to_member_id UUID DEFAULT NULL,
  p_tradeable BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  IF NOT public.is_campaign_system(p_campaign_id, auth.uid()) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_value_credits IS NOT NULL AND p_value_credits < 0 THEN
    RAISE EXCEPTION 'INVALID_RELIC_VALUE' USING ERRCODE = '22023';
  END IF;

  IF p_bound_to_member_id IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM public.campaign_members AS member_row
    WHERE member_row.id = p_bound_to_member_id
      AND member_row.campaign_id = p_campaign_id
  ) THEN
    RAISE EXCEPTION 'RELIC_MEMBER_MISMATCH' USING ERRCODE = '22023';
  END IF;

  RETURN public.assign_campaign_relic_unchecked(
    p_campaign_id,
    p_relic_id,
    p_name,
    p_rarity,
    p_properties,
    p_value_credits,
    p_bound_to_member_id,
    p_tradeable
  );
END;
$$;

REVOKE ALL ON FUNCTION public.assign_campaign_relic_unchecked(UUID, TEXT, TEXT, TEXT, JSONB, NUMERIC, UUID, BOOLEAN)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.assign_campaign_relic(UUID, TEXT, TEXT, TEXT, JSONB, NUMERIC, UUID, BOOLEAN)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.assign_campaign_relic(UUID, TEXT, TEXT, TEXT, JSONB, NUMERIC, UUID, BOOLEAN)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_campaign_relic_unchecked(UUID, TEXT, TEXT, TEXT, JSONB, NUMERIC, UUID, BOOLEAN)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.assign_campaign_relic(UUID, TEXT, TEXT, TEXT, JSONB, NUMERIC, UUID, BOOLEAN)
  TO service_role;

DROP POLICY IF EXISTS campaign_relic_instances_member_select ON public.campaign_relic_instances;
CREATE POLICY campaign_relic_instances_member_select ON public.campaign_relic_instances
  FOR SELECT TO authenticated
  USING (app_private.actor_in_campaign(campaign_id));

DROP POLICY IF EXISTS campaign_relic_instances_warden_delete ON public.campaign_relic_instances;
CREATE POLICY campaign_relic_instances_warden_delete ON public.campaign_relic_instances
  FOR DELETE TO authenticated
  USING (public.is_campaign_system(campaign_id, (SELECT auth.uid())));

-- ── Invites, the invite log, and loot analytics: the Wardens ────────────────
DROP POLICY IF EXISTS campaign_invites_warden_select ON public.campaign_invites;
CREATE POLICY campaign_invites_warden_select ON public.campaign_invites
  FOR SELECT TO authenticated
  USING (public.is_campaign_system(campaign_id, (SELECT auth.uid())));

DROP POLICY IF EXISTS campaign_invite_audit_logs_warden_select ON public.campaign_invite_audit_logs;
CREATE POLICY campaign_invite_audit_logs_warden_select ON public.campaign_invite_audit_logs
  FOR SELECT TO authenticated
  USING (public.is_campaign_system(campaign_id, (SELECT auth.uid())));

DROP POLICY IF EXISTS campaign_loot_drops_warden_select ON public.campaign_loot_drops;
CREATE POLICY campaign_loot_drops_warden_select ON public.campaign_loot_drops
  FOR SELECT TO authenticated
  USING (public.is_campaign_system(campaign_id, (SELECT auth.uid())));

-- ── Character links and shares ──────────────────────────────────────────────
-- A member reads their own links (party stash); the Wardens read all.
DROP POLICY IF EXISTS campaign_member_characters_member_select ON public.campaign_member_characters;
CREATE POLICY campaign_member_characters_member_select ON public.campaign_member_characters
  FOR SELECT TO authenticated
  USING (
    public.is_campaign_system(campaign_id, (SELECT auth.uid()))
    OR EXISTS (
      SELECT 1
      FROM public.campaign_members AS member_row
      WHERE member_row.id = campaign_member_characters.campaign_member_id
        AND member_row.user_id = (SELECT auth.uid())
    )
  );

-- Anyone in the campaign may share a character they own into it.
DROP POLICY IF EXISTS campaign_character_shares_owner_insert ON public.campaign_character_shares;
CREATE POLICY campaign_character_shares_owner_insert ON public.campaign_character_shares
  FOR INSERT TO authenticated
  WITH CHECK (
    shared_by = (SELECT auth.uid())
    AND app_private.actor_owns_character(character_id)
    AND app_private.actor_in_campaign(campaign_id)
  );

-- ── Homebrew ────────────────────────────────────────────────────────────────
-- Mirrors set_homebrew_content_status: the owner, an account admin, or a
-- Warden of the content's campaign manages it; published public content is
-- visible to every signed-in user and published campaign content to that
-- campaign. Content can only be attached to a campaign the actor is in. The
-- old can_view/can_manage helpers trusted the editable profiles.role, so
-- these rules do not use them.
DROP POLICY IF EXISTS homebrew_content_select ON public.homebrew_content;
CREATE POLICY homebrew_content_select ON public.homebrew_content
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR (SELECT app_private.is_account_admin())
    OR (status = 'published' AND visibility_scope = 'public')
    OR (
      campaign_id IS NOT NULL
      AND (
        public.is_campaign_system(campaign_id, (SELECT auth.uid()))
        OR (
          status = 'published'
          AND visibility_scope = 'campaign'
          AND app_private.actor_in_campaign(campaign_id)
        )
      )
    )
  );

DROP POLICY IF EXISTS homebrew_content_insert ON public.homebrew_content;
CREATE POLICY homebrew_content_insert ON public.homebrew_content
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (campaign_id IS NULL OR app_private.actor_in_campaign(campaign_id))
  );

DROP POLICY IF EXISTS homebrew_content_update ON public.homebrew_content;
CREATE POLICY homebrew_content_update ON public.homebrew_content
  FOR UPDATE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR (SELECT app_private.is_account_admin())
    OR (
      campaign_id IS NOT NULL
      AND public.is_campaign_system(campaign_id, (SELECT auth.uid()))
    )
  )
  WITH CHECK (
    (SELECT app_private.is_account_admin())
    OR (
      (
        user_id = (SELECT auth.uid())
        OR (
          campaign_id IS NOT NULL
          AND public.is_campaign_system(campaign_id, (SELECT auth.uid()))
        )
      )
      AND (campaign_id IS NULL OR app_private.actor_in_campaign(campaign_id))
    )
  );

DROP POLICY IF EXISTS homebrew_content_delete ON public.homebrew_content;
CREATE POLICY homebrew_content_delete ON public.homebrew_content
  FOR DELETE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR (SELECT app_private.is_account_admin())
  );

-- Version history holds earlier drafts, so it follows management, not
-- visibility. It was readable by anyone.
DROP POLICY IF EXISTS homebrew_content_versions_select ON public.homebrew_content_versions;
CREATE POLICY homebrew_content_versions_select ON public.homebrew_content_versions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.homebrew_content AS content_row
      WHERE content_row.id = homebrew_content_versions.homebrew_id
        AND (
          content_row.user_id = (SELECT auth.uid())
          OR (SELECT app_private.is_account_admin())
          OR (
            content_row.campaign_id IS NOT NULL
            AND public.is_campaign_system(content_row.campaign_id, (SELECT auth.uid()))
          )
        )
    )
  );

-- No rule uses these any more, and both trusted profiles.role through
-- is_dm_or_admin; the client never called them.
DROP FUNCTION IF EXISTS public.can_view_homebrew_content(UUID, UUID);
DROP FUNCTION IF EXISTS public.can_manage_homebrew_content(UUID, UUID);

-- Ownership never moves through a direct write.
CREATE OR REPLACE FUNCTION app_private.guard_homebrew_content_api_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  -- Only direct Data API writes are limited; definer RPCs run as the owner.
  IF current_user NOT IN ('anon', 'authenticated') THEN
    RETURN NEW;
  END IF;

  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'HOMEBREW_OWNER_READ_ONLY' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION app_private.guard_homebrew_content_api_write()
  FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS guard_homebrew_content_api_write ON public.homebrew_content;
CREATE TRIGGER guard_homebrew_content_api_write
  BEFORE UPDATE ON public.homebrew_content
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_homebrew_content_api_write();

-- ── Marketplace ─────────────────────────────────────────────────────────────
-- Listed items are the public catalog. Unlisted items are visible only to
-- their author and to entitled users. Authors manage their own listings.
DROP POLICY IF EXISTS marketplace_items_select ON public.marketplace_items;

DROP POLICY IF EXISTS marketplace_items_listed_select ON public.marketplace_items;
CREATE POLICY marketplace_items_listed_select ON public.marketplace_items
  FOR SELECT TO anon, authenticated
  USING (is_listed);

DROP POLICY IF EXISTS marketplace_items_holder_select ON public.marketplace_items;
CREATE POLICY marketplace_items_holder_select ON public.marketplace_items
  FOR SELECT TO authenticated
  USING (
    author_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.user_marketplace_entitlements AS entitlement
      WHERE entitlement.item_id = marketplace_items.id
        AND entitlement.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS marketplace_items_author_insert ON public.marketplace_items;
CREATE POLICY marketplace_items_author_insert ON public.marketplace_items
  FOR INSERT TO authenticated
  WITH CHECK (author_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS marketplace_items_author_update ON public.marketplace_items;
CREATE POLICY marketplace_items_author_update ON public.marketplace_items
  FOR UPDATE TO authenticated
  USING (author_id = (SELECT auth.uid()))
  WITH CHECK (author_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS marketplace_items_author_delete ON public.marketplace_items;
CREATE POLICY marketplace_items_author_delete ON public.marketplace_items
  FOR DELETE TO authenticated
  USING (author_id = (SELECT auth.uid()));

-- Counters and moderation flags belong to the download/review RPCs and to
-- trusted administration, and a bundle may hold only its author's items:
-- gifting a bundle grants every child, so a foreign child would hand out
-- someone else's paid item.
CREATE OR REPLACE FUNCTION app_private.guard_marketplace_item_api_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  -- Only direct Data API writes are limited; definer RPCs run as the owner.
  IF current_user NOT IN ('anon', 'authenticated') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.downloads_count := 0;
    NEW.views_count := 0;
    NEW.rating_avg := 0;
    NEW.rating_count := 0;
    NEW.is_featured := false;
    NEW.is_verified := false;
  ELSE
    IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
      RAISE EXCEPTION 'MARKETPLACE_AUTHOR_READ_ONLY' USING ERRCODE = '42501';
    END IF;
    NEW.downloads_count := OLD.downloads_count;
    NEW.views_count := OLD.views_count;
    NEW.rating_avg := OLD.rating_avg;
    NEW.rating_count := OLD.rating_count;
    NEW.is_featured := OLD.is_featured;
    NEW.is_verified := OLD.is_verified;
  END IF;

  IF NEW.is_bundle
     AND COALESCE(cardinality(NEW.bundled_item_ids), 0) > 0
     AND EXISTS (
       SELECT 1
       FROM unnest(NEW.bundled_item_ids) AS child(item_id)
       WHERE NOT EXISTS (
         SELECT 1
         FROM public.marketplace_items AS item
         WHERE item.id = child.item_id
           AND item.author_id = NEW.author_id
       )
     ) THEN
    RAISE EXCEPTION 'MARKETPLACE_BUNDLE_FOREIGN_ITEM' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION app_private.guard_marketplace_item_api_write()
  FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS guard_marketplace_item_api_write ON public.marketplace_items;
CREATE TRIGGER guard_marketplace_item_api_write
  BEFORE INSERT OR UPDATE ON public.marketplace_items
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_marketplace_item_api_write();

-- Entitlements come only from gift_marketplace_item and trusted
-- administration; users read their own. Any user could insert their own
-- entitlement to a paid item before.
DROP POLICY IF EXISTS user_marketplace_entitlements_insert ON public.user_marketplace_entitlements;
DROP POLICY IF EXISTS user_marketplace_entitlements_update ON public.user_marketplace_entitlements;
DROP POLICY IF EXISTS user_marketplace_entitlements_delete ON public.user_marketplace_entitlements;
DROP POLICY IF EXISTS user_marketplace_entitlements_select ON public.user_marketplace_entitlements;
CREATE POLICY user_marketplace_entitlements_select ON public.user_marketplace_entitlements
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR (SELECT app_private.is_account_admin())
  );

DROP POLICY IF EXISTS user_marketplace_entitlements_admin_write ON public.user_marketplace_entitlements;
CREATE POLICY user_marketplace_entitlements_admin_write ON public.user_marketplace_entitlements
  FOR ALL TO authenticated
  USING ((SELECT app_private.is_account_admin()))
  WITH CHECK ((SELECT app_private.is_account_admin()));

-- Reviews change only through upsert_marketplace_review, which sets
-- verified_purchase and recomputes the item's rating.
DROP POLICY IF EXISTS marketplace_reviews_update ON public.marketplace_reviews;

-- ── Personal data: compendium notes and tool state ──────────────────────────
DROP POLICY IF EXISTS compendium_notes_select ON public.compendium_notes;
CREATE POLICY compendium_notes_select ON public.compendium_notes
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS compendium_notes_insert ON public.compendium_notes;
CREATE POLICY compendium_notes_insert ON public.compendium_notes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS compendium_notes_update ON public.compendium_notes;
CREATE POLICY compendium_notes_update ON public.compendium_notes
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS compendium_notes_delete ON public.compendium_notes;
CREATE POLICY compendium_notes_delete ON public.compendium_notes
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS user_tool_states_select ON public.user_tool_states;
CREATE POLICY user_tool_states_select ON public.user_tool_states
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS user_tool_states_insert ON public.user_tool_states;
CREATE POLICY user_tool_states_insert ON public.user_tool_states
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS user_tool_states_update ON public.user_tool_states;
CREATE POLICY user_tool_states_update ON public.user_tool_states
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS user_tool_states_delete ON public.user_tool_states;
CREATE POLICY user_tool_states_delete ON public.user_tool_states
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ── Roll history ────────────────────────────────────────────────────────────
-- A roll is the caller's own; a campaign roll needs campaign membership, and a
-- character roll needs the character's owner or one of the campaign's Wardens.
DROP POLICY IF EXISTS roll_history_insert ON public.roll_history;
CREATE POLICY roll_history_insert ON public.roll_history
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (campaign_id IS NULL OR app_private.actor_in_campaign(campaign_id))
    AND (
      character_id IS NULL
      OR app_private.actor_owns_character(character_id)
      OR (
        campaign_id IS NOT NULL
        AND public.is_campaign_system(campaign_id, (SELECT auth.uid()))
      )
    )
  );

-- ── Profiles ────────────────────────────────────────────────────────────────
-- handle_new_user creates the row; the app self-inserts only when it is
-- missing. Suspension is set by admin_set_user_ban and is read-only here.
-- Sign-up metadata is user-supplied, so it may pick Warden or Ascendant but
-- no longer 'admin' (account admin comes only from app_metadata).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_role TEXT;
BEGIN
  v_role := lower(COALESCE(NEW.raw_user_meta_data->>'role', 'ascendant'));
  -- Legacy clients may still send dm/player; normalize to canonical.
  IF v_role = 'dm' THEN
    v_role := 'warden';
  ELSIF v_role = 'player' THEN
    v_role := 'ascendant';
  END IF;
  IF v_role NOT IN ('ascendant', 'warden') THEN
    v_role := 'ascendant';
  END IF;
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'username',
      NEW.email
    ),
    v_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
END;
$$;
DROP POLICY IF EXISTS profiles_insert_self ON public.profiles;
CREATE POLICY profiles_insert_self ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    id = (SELECT auth.uid())
    AND role = ANY (ARRAY['warden', 'ascendant'])
    AND banned_at IS NULL
  );

CREATE OR REPLACE FUNCTION app_private.guard_profile_api_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  -- Only direct Data API writes are limited; definer RPCs run as the owner.
  IF current_user NOT IN ('anon', 'authenticated') THEN
    RETURN NEW;
  END IF;

  IF NEW.banned_at IS DISTINCT FROM OLD.banned_at THEN
    RAISE EXCEPTION 'PROFILE_SUSPENSION_READ_ONLY' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION app_private.guard_profile_api_write()
  FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS guard_profile_api_write ON public.profiles;
CREATE TRIGGER guard_profile_api_write
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_profile_api_write();

-- ── Compendium catalog ──────────────────────────────────────────────────────
-- The feature-choice catalog is shared reference data like the rest of the
-- compendium.
DROP POLICY IF EXISTS compendium_feature_choice_groups_select ON public.compendium_feature_choice_groups;
CREATE POLICY compendium_feature_choice_groups_select ON public.compendium_feature_choice_groups
  FOR SELECT USING (true);

DROP POLICY IF EXISTS compendium_feature_choice_options_select ON public.compendium_feature_choice_options;
CREATE POLICY compendium_feature_choice_options_select ON public.compendium_feature_choice_options
  FOR SELECT USING (true);

-- Writes to the shared compendium (the admin importer and feature-choice
-- editor) require an account admin. The replaced rules let any signed-in user
-- write spells, tattoos, and locations, and let profiles.role 'dm'/'admin'
-- write the rest.
DROP POLICY IF EXISTS compendium_jobs_insert ON public.compendium_jobs;
DROP POLICY IF EXISTS compendium_jobs_update ON public.compendium_jobs;
DROP POLICY IF EXISTS compendium_jobs_delete ON public.compendium_jobs;
DROP POLICY IF EXISTS compendium_paths_insert ON public.compendium_paths;
DROP POLICY IF EXISTS compendium_paths_update ON public.compendium_paths;
DROP POLICY IF EXISTS compendium_paths_delete ON public.compendium_paths;
DROP POLICY IF EXISTS compendium_regent_features_insert ON public.compendium_regent_features;
DROP POLICY IF EXISTS compendium_regent_features_update ON public.compendium_regent_features;
DROP POLICY IF EXISTS compendium_regent_features_delete ON public.compendium_regent_features;
DROP POLICY IF EXISTS compendium_regents_insert ON public.compendium_regents;
DROP POLICY IF EXISTS compendium_regents_update ON public.compendium_regents;
DROP POLICY IF EXISTS compendium_regents_delete ON public.compendium_regents;
DROP POLICY IF EXISTS compendium_relics_insert ON public.compendium_relics;
DROP POLICY IF EXISTS compendium_relics_update ON public.compendium_relics;
DROP POLICY IF EXISTS compendium_relics_delete ON public.compendium_relics;
DROP POLICY IF EXISTS compendium_runes_insert ON public.compendium_runes;
DROP POLICY IF EXISTS compendium_runes_update ON public.compendium_runes;
DROP POLICY IF EXISTS compendium_runes_delete ON public.compendium_runes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.compendium_locations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.compendium_locations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.compendium_spells;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.compendium_spells;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.compendium_tattoos;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.compendium_tattoos;

DO $$
DECLARE
  v_table TEXT;
BEGIN
  FOREACH v_table IN ARRAY ARRAY[
    'compendium_Anomalies', 'compendium_backgrounds',
    'compendium_feature_choice_groups', 'compendium_feature_choice_options',
    'compendium_job_features', 'compendium_job_paths', 'compendium_jobs',
    'compendium_locations', 'compendium_paths', 'compendium_powers',
    'compendium_regent_features', 'compendium_regents', 'compendium_relics',
    'compendium_runes', 'compendium_spells', 'compendium_tattoos'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', v_table || '_admin_write', v_table);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated '
      'USING ((SELECT app_private.is_account_admin())) '
      'WITH CHECK ((SELECT app_private.is_account_admin()))',
      v_table || '_admin_write',
      v_table
    );
  END LOOP;
END;
$$;

COMMIT;
