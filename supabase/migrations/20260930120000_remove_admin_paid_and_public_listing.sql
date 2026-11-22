-- Remove features Rift Ascendant does not have: an admin role, paid or
-- unlisted marketplace items, and public campaign discovery (Field Roster).
--
-- The app has two roles, Warden and Ascendant. Admin and development work
-- happens outside the app (Supabase dashboard, migrations, service-role
-- scripts), so no API caller gets extra authority beyond those two roles.
--
--   * Admin role: app_private.is_account_admin, admin_set_user_role,
--     admin_set_user_ban and their audit log, the in-app suspension flag
--     (profiles.banned_at) and its guard, and every rule that let an admin
--     see or change more. 'admin' leaves both profile role checks.
--   * The shared compendium tables and its image bucket are read-only
--     through the API.
--   * Marketplace: the app is free, so prices, entitlements, gifting, bundles
--     (which only fanned out entitlements), and the verified-purchase flag
--     go. Every listing is public, so is_listed goes too.
--   * Field Roster: a campaign is visible only to its members and Wardens, so
--     the public listing column, view, and cap trigger go. campaign_details
--     selected that column and nothing reads it any more.
--   * is_warden_or_admin and is_dm_or_admin trusted the editable profile role
--     and have no callers left.
--
-- None of the dropped tables or columns hold production data (checked
-- 2026-09-30): no audit rows, suspensions, entitlements, marketplace items or
-- reviews, public listings, or admin profiles.
--
-- It also repairs two pieces of production-only drift found in the same
-- check: policies that still called is_dm_or_admin, and a homebrew owner
-- key that pointed at the empty legacy user_profiles table.
BEGIN;

-- ── Admin role ──────────────────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.admin_set_user_role(UUID, TEXT);
DROP FUNCTION IF EXISTS public.admin_set_user_ban(UUID, BOOLEAN);
DROP TABLE IF EXISTS public.admin_audit_log;

DROP TRIGGER IF EXISTS guard_profile_api_write ON public.profiles;
DROP FUNCTION IF EXISTS app_private.guard_profile_api_write();

DROP POLICY IF EXISTS profiles_insert_self ON public.profiles;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS banned_at;
CREATE POLICY profiles_insert_self ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    id = (SELECT auth.uid())
    AND role = ANY (ARRAY['warden', 'ascendant'])
  );

DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS user_profiles_select ON public.user_profiles;
CREATE POLICY user_profiles_select ON public.user_profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role = ANY (ARRAY['ascendant', 'warden']));

-- user_profiles is the legacy copy (no rows anywhere) and keeps its legacy
-- names for the same two roles.
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_role_check
  CHECK (role = ANY (ARRAY['player', 'dm']));

-- ── Homebrew: the owner and the content's campaign Wardens ─────────────────
-- Production's owner key still referenced the legacy user_profiles table,
-- which has no rows, so every homebrew save there failed its foreign key.
-- A clean replay references profiles; both now do.
ALTER TABLE public.homebrew_content
  DROP CONSTRAINT IF EXISTS homebrew_content_user_id_fkey;
ALTER TABLE public.homebrew_content
  ADD CONSTRAINT homebrew_content_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS homebrew_content_select ON public.homebrew_content;
CREATE POLICY homebrew_content_select ON public.homebrew_content
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
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

DROP POLICY IF EXISTS homebrew_content_update ON public.homebrew_content;
CREATE POLICY homebrew_content_update ON public.homebrew_content
  FOR UPDATE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR (
      campaign_id IS NOT NULL
      AND public.is_campaign_system(campaign_id, (SELECT auth.uid()))
    )
  )
  WITH CHECK (
    (
      user_id = (SELECT auth.uid())
      OR (
        campaign_id IS NOT NULL
        AND public.is_campaign_system(campaign_id, (SELECT auth.uid()))
      )
    )
    AND (campaign_id IS NULL OR app_private.actor_in_campaign(campaign_id))
  );

DROP POLICY IF EXISTS homebrew_content_delete ON public.homebrew_content;
CREATE POLICY homebrew_content_delete ON public.homebrew_content
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

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
          OR (
            content_row.campaign_id IS NOT NULL
            AND public.is_campaign_system(content_row.campaign_id, (SELECT auth.uid()))
          )
        )
    )
  );

CREATE OR REPLACE FUNCTION public.set_homebrew_content_status(
  p_homebrew_id UUID,
  p_status TEXT,
  p_visibility_scope TEXT DEFAULT NULL,
  p_campaign_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_owner UUID;
  v_visibility_scope TEXT;
  v_existing_campaign_id UUID;
  v_target_campaign_id UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_status NOT IN ('draft', 'published', 'archived') THEN
    RAISE EXCEPTION 'INVALID_HOMEBREW_STATUS' USING ERRCODE = '22023';
  END IF;

  SELECT
    content_row.user_id,
    COALESCE(p_visibility_scope, content_row.visibility_scope),
    content_row.campaign_id
  INTO
    v_owner,
    v_visibility_scope,
    v_existing_campaign_id
  FROM public.homebrew_content AS content_row
  WHERE content_row.id = p_homebrew_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'HOMEBREW_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  -- The owner, or a Warden of the campaign the content belongs to.
  IF v_owner IS DISTINCT FROM v_actor
     AND NOT (
       v_existing_campaign_id IS NOT NULL
       AND public.is_campaign_system(v_existing_campaign_id, v_actor)
     ) THEN
    RAISE EXCEPTION 'HOMEBREW_FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  IF v_visibility_scope NOT IN ('private', 'campaign', 'public') THEN
    RAISE EXCEPTION 'INVALID_VISIBILITY_SCOPE' USING ERRCODE = '22023';
  END IF;

  IF p_status = 'published' AND v_visibility_scope = 'private' THEN
    v_visibility_scope := 'public';
  END IF;

  v_target_campaign_id := COALESCE(p_campaign_id, v_existing_campaign_id);

  IF v_visibility_scope = 'campaign' AND v_target_campaign_id IS NULL THEN
    RAISE EXCEPTION 'CAMPAIGN_ID_REQUIRED_FOR_CAMPAIGN_VISIBILITY'
      USING ERRCODE = '22023';
  END IF;

  IF v_visibility_scope = 'campaign'
     AND NOT (
       public.is_campaign_member(v_target_campaign_id, v_actor)
       OR public.is_campaign_system(v_target_campaign_id, v_actor)
     ) THEN
    RAISE EXCEPTION 'CAMPAIGN_VISIBILITY_FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  UPDATE public.homebrew_content
  SET status = p_status,
      visibility_scope = v_visibility_scope,
      campaign_id = CASE
        WHEN v_visibility_scope = 'campaign' THEN v_target_campaign_id
        ELSE NULL
      END,
      updated_by = v_actor,
      updated_at = now()
  WHERE id = p_homebrew_id;

  RETURN p_homebrew_id;
END;
$$;

-- ── Shared compendium: read-only through the API ────────────────────────────
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
  END LOOP;
END;
$$;

-- The compendium-images bucket stays public for reads. Its write policy only
-- matched the retired 'dm' and 'admin' profile roles; images are managed
-- outside the app.
DROP POLICY IF EXISTS "Admins/DMs can manage compendium images" ON storage.objects;

-- ── Marketplace: free, and every listing is public ──────────────────────────
DROP FUNCTION IF EXISTS public.gift_marketplace_item(UUID, UUID, TEXT);

CREATE OR REPLACE FUNCTION public.record_marketplace_download_unchecked(
  p_item_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'MARKETPLACE_USER_CONTEXT_FORBIDDEN';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.marketplace_items AS item WHERE item.id = p_item_id
  ) THEN
    RAISE EXCEPTION 'MARKETPLACE_ITEM_NOT_FOUND';
  END IF;

  -- One row per person keeps downloads_count a count of people.
  INSERT INTO app_private.marketplace_downloads (item_id, user_id)
  VALUES (p_item_id, p_user_id)
  ON CONFLICT (item_id, user_id) DO NOTHING;

  UPDATE public.marketplace_items
  SET downloads_count = (
    SELECT count(*)::integer
    FROM app_private.marketplace_downloads AS download
    WHERE download.item_id = p_item_id
  ),
  updated_at = now()
  WHERE id = p_item_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_marketplace_review_unchecked(
  p_item_id UUID,
  p_rating INTEGER,
  p_comment TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_review_id UUID;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'MARKETPLACE_USER_CONTEXT_FORBIDDEN';
  END IF;

  IF p_rating IS NULL OR p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'INVALID_RATING';
  END IF;

  INSERT INTO public.marketplace_reviews (item_id, user_id, rating, comment)
  VALUES (p_item_id, p_user_id, p_rating, p_comment)
  ON CONFLICT (item_id, user_id)
  DO UPDATE SET
    rating = EXCLUDED.rating,
    comment = EXCLUDED.comment,
    updated_at = now()
  RETURNING id INTO v_review_id;

  UPDATE public.marketplace_items AS item
  SET rating_avg = COALESCE(agg.avg_rating, 0),
      rating_count = COALESCE(agg.rating_count, 0),
      updated_at = now()
  FROM (
    SELECT review.item_id,
           AVG(review.rating)::numeric(3,2) AS avg_rating,
           COUNT(*)::integer AS rating_count
    FROM public.marketplace_reviews AS review
    WHERE review.item_id = p_item_id
    GROUP BY review.item_id
  ) AS agg
  WHERE item.id = p_item_id;

  RETURN v_review_id;
END;
$$;

-- Counters and moderation flags stay with the download/review RPCs and
-- outside tooling; authorship never moves.
CREATE OR REPLACE FUNCTION app_private.guard_marketplace_item_api_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog
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

  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION app_private.guard_marketplace_item_api_write()
  FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS marketplace_items_listed_select ON public.marketplace_items;
DROP POLICY IF EXISTS marketplace_items_holder_select ON public.marketplace_items;
DROP POLICY IF EXISTS marketplace_items_select ON public.marketplace_items;
CREATE POLICY marketplace_items_select ON public.marketplace_items
  FOR SELECT TO anon, authenticated
  USING (true);

DROP FUNCTION IF EXISTS app_private.marketplace_item_access(UUID, UUID);
DROP TABLE IF EXISTS public.user_marketplace_entitlements;
DROP FUNCTION IF EXISTS public.update_user_marketplace_entitlements_updated_at();

ALTER TABLE public.marketplace_reviews DROP COLUMN IF EXISTS verified_purchase;
ALTER TABLE public.marketplace_items
  DROP COLUMN IF EXISTS price_type,
  DROP COLUMN IF EXISTS price_amount,
  DROP COLUMN IF EXISTS price_currency,
  DROP COLUMN IF EXISTS is_listed,
  DROP COLUMN IF EXISTS is_bundle,
  DROP COLUMN IF EXISTS bundled_item_ids;

-- ── Field Roster ────────────────────────────────────────────────────────────
DROP VIEW IF EXISTS public.campaigns_public_listings;
DROP VIEW IF EXISTS public.campaign_details;
DROP TRIGGER IF EXISTS trg_enforce_campaign_listing_cap ON public.campaigns;
DROP FUNCTION IF EXISTS public.enforce_campaign_listing_cap();
ALTER TABLE public.campaigns DROP COLUMN IF EXISTS public_listing;

-- ── Helpers that trusted the editable profile role ──────────────────────────
-- Production still carried two policy variants that called is_dm_or_admin
-- (schema dump, 2026-09-30); a clean replay has owner-only versions. Both
-- become owner-only everywhere before the helper goes.
DROP POLICY IF EXISTS character_backups_select ON public.character_backups;
CREATE POLICY character_backups_select ON public.character_backups
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS marketplace_reviews_delete ON public.marketplace_reviews;
CREATE POLICY marketplace_reviews_delete ON public.marketplace_reviews
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP FUNCTION IF EXISTS public.is_dm_or_admin(UUID);
DROP FUNCTION IF EXISTS public.is_warden_or_admin(UUID);

-- Last: fails if any policy still depends on it.
DROP FUNCTION IF EXISTS app_private.is_account_admin();

COMMIT;
