-- Phase 1 parity foundation
-- Adds foundational schema/RPC/RLS for:
-- 1) Sourcebook entitlements + campaign sharing
-- 2) Homebrew lifecycle/versioning
-- 3) Marketplace primitives
-- 4) Campaign session scheduling + session logs

-- -----------------------------------------------------------------------------
-- Shared helper: role check
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_dm_or_admin(
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_has_role BOOLEAN := false;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  IF to_regclass('public.user_profiles') IS NOT NULL THEN
    EXECUTE '
      SELECT EXISTS (
        SELECT 1
        FROM public.user_profiles up
        WHERE up.id = $1
          AND up.role IN (''dm'', ''admin'')
      )
    '
    INTO v_has_role
    USING p_user_id;

    IF v_has_role THEN
      RETURN TRUE;
    END IF;
  END IF;

  IF to_regclass('public.profiles') IS NOT NULL THEN
    EXECUTE '
      SELECT EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = $1
          AND p.role IN (''dm'', ''admin'')
      )
    '
    INTO v_has_role
    USING p_user_id;

    RETURN COALESCE(v_has_role, FALSE);
  END IF;

  RETURN FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_dm_or_admin(UUID) TO authenticated;

-- -----------------------------------------------------------------------------
-- Sourcebook entitlement + campaign sharing
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sourcebook_catalog (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_free BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_sourcebook_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sourcebook_id TEXT NOT NULL REFERENCES public.sourcebook_catalog(id) ON DELETE CASCADE,
  entitlement_type TEXT NOT NULL DEFAULT 'owned' CHECK (entitlement_type IN ('owned', 'subscription', 'grant')),
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, sourcebook_id)
);

CREATE TABLE IF NOT EXISTS public.campaign_sourcebook_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  sourcebook_id TEXT NOT NULL REFERENCES public.sourcebook_catalog(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, sourcebook_id)
);

CREATE INDEX IF NOT EXISTS sourcebook_catalog_is_free_idx
  ON public.sourcebook_catalog(is_free);

CREATE INDEX IF NOT EXISTS user_sourcebook_entitlements_user_idx
  ON public.user_sourcebook_entitlements(user_id, sourcebook_id);

CREATE INDEX IF NOT EXISTS user_sourcebook_entitlements_sourcebook_idx
  ON public.user_sourcebook_entitlements(sourcebook_id);

CREATE INDEX IF NOT EXISTS campaign_sourcebook_shares_campaign_idx
  ON public.campaign_sourcebook_shares(campaign_id, sourcebook_id);

ALTER TABLE public.sourcebook_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sourcebook_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_sourcebook_shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sourcebook_catalog_select ON public.sourcebook_catalog;
CREATE POLICY sourcebook_catalog_select
  ON public.sourcebook_catalog
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS sourcebook_catalog_manage ON public.sourcebook_catalog;
CREATE POLICY sourcebook_catalog_manage
  ON public.sourcebook_catalog
  FOR ALL
  USING (public.is_dm_or_admin(auth.uid()))
  WITH CHECK (public.is_dm_or_admin(auth.uid()));

DROP POLICY IF EXISTS user_sourcebook_entitlements_select ON public.user_sourcebook_entitlements;
CREATE POLICY user_sourcebook_entitlements_select
  ON public.user_sourcebook_entitlements
  FOR SELECT
  USING (
    user_id = auth.uid() OR public.is_dm_or_admin(auth.uid())
  );

DROP POLICY IF EXISTS user_sourcebook_entitlements_manage ON public.user_sourcebook_entitlements;
CREATE POLICY user_sourcebook_entitlements_manage
  ON public.user_sourcebook_entitlements
  FOR ALL
  USING (public.is_dm_or_admin(auth.uid()))
  WITH CHECK (public.is_dm_or_admin(auth.uid()));

DROP POLICY IF EXISTS campaign_sourcebook_shares_select ON public.campaign_sourcebook_shares;
CREATE POLICY campaign_sourcebook_shares_select
  ON public.campaign_sourcebook_shares
  FOR SELECT
  USING (
    public.is_campaign_member(campaign_id) OR public.is_campaign_dm(campaign_id)
  );

DROP POLICY IF EXISTS campaign_sourcebook_shares_manage ON public.campaign_sourcebook_shares;
CREATE POLICY campaign_sourcebook_shares_manage
  ON public.campaign_sourcebook_shares
  FOR ALL
  USING (public.is_campaign_system(campaign_id) OR public.is_campaign_dm(campaign_id))
  WITH CHECK (public.is_campaign_system(campaign_id) OR public.is_campaign_dm(campaign_id));

CREATE OR REPLACE FUNCTION public.user_has_sourcebook_access(
  p_sourcebook_id TEXT,
  p_user_id UUID DEFAULT auth.uid(),
  p_campaign_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
BEGIN
  IF p_sourcebook_id IS NULL OR btrim(p_sourcebook_id) = '' THEN
    RETURN TRUE;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.sourcebook_catalog sb
    WHERE sb.id = p_sourcebook_id
      AND sb.is_free
  ) THEN
    RETURN TRUE;
  END IF;

  IF p_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  IF p_user_id IS DISTINCT FROM auth.uid()
    AND NOT public.is_dm_or_admin(auth.uid())
  THEN
    RETURN FALSE;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.user_sourcebook_entitlements ue
    WHERE ue.user_id = p_user_id
      AND ue.sourcebook_id = p_sourcebook_id
      AND (ue.expires_at IS NULL OR ue.expires_at > now())
  ) THEN
    RETURN TRUE;
  END IF;

  IF p_campaign_id IS NOT NULL
    AND (public.is_campaign_member(p_campaign_id, p_user_id) OR public.is_campaign_dm(p_campaign_id, p_user_id))
    AND EXISTS (
      SELECT 1
      FROM public.campaign_sourcebook_shares css
      JOIN public.user_sourcebook_entitlements ue
        ON ue.user_id = css.shared_by
       AND ue.sourcebook_id = css.sourcebook_id
       AND (ue.expires_at IS NULL OR ue.expires_at > now())
      WHERE css.campaign_id = p_campaign_id
        AND css.sourcebook_id = p_sourcebook_id
    )
  THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.user_has_sourcebook_access(TEXT, UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_accessible_sourcebooks(
  p_campaign_id UUID DEFAULT NULL,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  sourcebook_id TEXT,
  access_type TEXT,
  shared_by UUID,
  expires_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  WITH effective_user AS (
    SELECT CASE
      WHEN public.is_dm_or_admin(auth.uid()) AND p_user_id IS NOT NULL THEN p_user_id
      ELSE auth.uid()
    END AS user_id
  ),
  free_books AS (
    SELECT sb.id AS sourcebook_id,
           'free'::text AS access_type,
           NULL::uuid AS shared_by,
           NULL::timestamptz AS expires_at
    FROM public.sourcebook_catalog sb
    WHERE sb.is_free
  ),
  owned_books AS (
    SELECT ue.sourcebook_id,
           ue.entitlement_type AS access_type,
           ue.user_id AS shared_by,
           ue.expires_at
    FROM public.user_sourcebook_entitlements ue
    CROSS JOIN effective_user eu
    WHERE ue.user_id = eu.user_id
      AND (ue.expires_at IS NULL OR ue.expires_at > now())
  ),
  campaign_books AS (
    SELECT css.sourcebook_id,
           'campaign-share'::text AS access_type,
           css.shared_by,
           NULL::timestamptz AS expires_at
    FROM public.campaign_sourcebook_shares css
    CROSS JOIN effective_user eu
    WHERE p_campaign_id IS NOT NULL
      AND css.campaign_id = p_campaign_id
      AND public.user_has_sourcebook_access(css.sourcebook_id, eu.user_id, p_campaign_id)
  )
  SELECT DISTINCT *
  FROM (
    SELECT * FROM free_books
    UNION ALL
    SELECT * FROM owned_books
    UNION ALL
    SELECT * FROM campaign_books
  ) entries;
$$;

GRANT EXECUTE ON FUNCTION public.get_accessible_sourcebooks(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.upsert_user_sourcebook_entitlement(
  p_user_id UUID,
  p_sourcebook_id TEXT,
  p_entitlement_type TEXT DEFAULT 'grant',
  p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_entitlement_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF NOT public.is_dm_or_admin(auth.uid()) THEN
    RAISE EXCEPTION 'SOURCEBOOK_ENTITLEMENT_FORBIDDEN';
  END IF;

  IF p_entitlement_type NOT IN ('owned', 'subscription', 'grant') THEN
    RAISE EXCEPTION 'INVALID_ENTITLEMENT_TYPE';
  END IF;

  INSERT INTO public.user_sourcebook_entitlements (
    user_id,
    sourcebook_id,
    entitlement_type,
    granted_by,
    expires_at
  )
  VALUES (
    p_user_id,
    p_sourcebook_id,
    p_entitlement_type,
    auth.uid(),
    p_expires_at
  )
  ON CONFLICT (user_id, sourcebook_id)
  DO UPDATE SET
    entitlement_type = EXCLUDED.entitlement_type,
    granted_by = EXCLUDED.granted_by,
    expires_at = EXCLUDED.expires_at,
    updated_at = now()
  RETURNING id INTO v_entitlement_id;

  RETURN v_entitlement_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_user_sourcebook_entitlement(UUID, TEXT, TEXT, TIMESTAMPTZ) TO authenticated;

CREATE OR REPLACE FUNCTION public.share_campaign_sourcebook(
  p_campaign_id UUID,
  p_sourcebook_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_share_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF NOT (public.is_campaign_system(p_campaign_id) OR public.is_campaign_dm(p_campaign_id)) THEN
    RAISE EXCEPTION 'CAMPAIGN_SOURCEBOOK_FORBIDDEN';
  END IF;

  IF NOT public.user_has_sourcebook_access(p_sourcebook_id, auth.uid(), NULL) THEN
    RAISE EXCEPTION 'SOURCEBOOK_NOT_OWNED';
  END IF;

  INSERT INTO public.campaign_sourcebook_shares (
    campaign_id,
    sourcebook_id,
    shared_by
  )
  VALUES (
    p_campaign_id,
    p_sourcebook_id,
    auth.uid()
  )
  ON CONFLICT (campaign_id, sourcebook_id)
  DO UPDATE SET
    shared_by = EXCLUDED.shared_by,
    updated_at = now()
  RETURNING id INTO v_share_id;

  RETURN v_share_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.share_campaign_sourcebook(UUID, TEXT) TO authenticated;

DROP TRIGGER IF EXISTS update_sourcebook_catalog_updated_at ON public.sourcebook_catalog;
CREATE TRIGGER update_sourcebook_catalog_updated_at
  BEFORE UPDATE ON public.sourcebook_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_sourcebook_entitlements_updated_at ON public.user_sourcebook_entitlements;
CREATE TRIGGER update_user_sourcebook_entitlements_updated_at
  BEFORE UPDATE ON public.user_sourcebook_entitlements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaign_sourcebook_shares_updated_at ON public.campaign_sourcebook_shares;
CREATE TRIGGER update_campaign_sourcebook_shares_updated_at
  BEFORE UPDATE ON public.campaign_sourcebook_shares
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------------------------------------
-- Homebrew lifecycle/versioning
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.homebrew_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('job', 'path', 'relic', 'spell', 'item')),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.homebrew_content ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.homebrew_content
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'homebrew_content_status_check'
      AND conrelid = 'public.homebrew_content'::regclass
  ) THEN
    ALTER TABLE public.homebrew_content
      ADD CONSTRAINT homebrew_content_status_check
      CHECK (status IN ('draft', 'published', 'archived'));
  END IF;
END
$$;

ALTER TABLE public.homebrew_content
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS source_book TEXT,
  ADD COLUMN IF NOT EXISTS visibility_scope TEXT NOT NULL DEFAULT 'private',
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'homebrew_content_visibility_scope_check'
      AND conrelid = 'public.homebrew_content'::regclass
  ) THEN
    ALTER TABLE public.homebrew_content
      ADD CONSTRAINT homebrew_content_visibility_scope_check
      CHECK (visibility_scope IN ('private', 'campaign', 'public'));
  END IF;
END
$$;

UPDATE public.homebrew_content
SET status = CASE WHEN is_public THEN 'published' ELSE 'draft' END,
    visibility_scope = CASE WHEN is_public THEN 'public' ELSE visibility_scope END,
    published_at = CASE WHEN is_public AND published_at IS NULL THEN created_at ELSE published_at END
WHERE status IS DISTINCT FROM CASE WHEN is_public THEN 'published' ELSE 'draft' END
   OR (is_public AND visibility_scope <> 'public')
   OR (is_public AND published_at IS NULL);

CREATE INDEX IF NOT EXISTS homebrew_content_user_idx
  ON public.homebrew_content(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS homebrew_content_status_visibility_idx
  ON public.homebrew_content(status, visibility_scope, is_public);

CREATE INDEX IF NOT EXISTS homebrew_content_campaign_idx
  ON public.homebrew_content(campaign_id);

CREATE TABLE IF NOT EXISTS public.homebrew_content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homebrew_id UUID NOT NULL REFERENCES public.homebrew_content(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  change_note TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (homebrew_id, version_number)
);

CREATE INDEX IF NOT EXISTS homebrew_content_versions_homebrew_idx
  ON public.homebrew_content_versions(homebrew_id, version_number DESC);

ALTER TABLE public.homebrew_content_versions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_view_homebrew_content(
  p_homebrew_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.homebrew_content hc
    WHERE hc.id = p_homebrew_id
      AND (
        hc.user_id = p_user_id
        OR public.is_dm_or_admin(p_user_id)
        OR (hc.status = 'published' AND (hc.is_public OR hc.visibility_scope = 'public'))
        OR (
          hc.status = 'published'
          AND
          hc.visibility_scope = 'campaign'
          AND hc.campaign_id IS NOT NULL
          AND (public.is_campaign_member(hc.campaign_id, p_user_id) OR public.is_campaign_dm(hc.campaign_id, p_user_id))
        )
      )
  );
$$;

GRANT EXECUTE ON FUNCTION public.can_view_homebrew_content(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.can_manage_homebrew_content(
  p_homebrew_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.homebrew_content hc
    WHERE hc.id = p_homebrew_id
      AND (hc.user_id = p_user_id OR public.is_dm_or_admin(p_user_id))
  );
$$;

GRANT EXECUTE ON FUNCTION public.can_manage_homebrew_content(UUID, UUID) TO authenticated;

DROP POLICY IF EXISTS "Users can view their own homebrew" ON public.homebrew_content;
DROP POLICY IF EXISTS "Users can view public homebrew" ON public.homebrew_content;
DROP POLICY IF EXISTS "Users can manage their own homebrew" ON public.homebrew_content;
DROP POLICY IF EXISTS "DMs can manage any homebrew" ON public.homebrew_content;

DROP POLICY IF EXISTS homebrew_content_select ON public.homebrew_content;
CREATE POLICY homebrew_content_select
  ON public.homebrew_content
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_dm_or_admin(auth.uid())
    OR (status = 'published' AND (is_public OR visibility_scope = 'public'))
    OR (
      status = 'published'
      AND
      visibility_scope = 'campaign'
      AND campaign_id IS NOT NULL
      AND (public.is_campaign_member(campaign_id) OR public.is_campaign_dm(campaign_id))
    )
  );

DROP POLICY IF EXISTS homebrew_content_insert ON public.homebrew_content;
CREATE POLICY homebrew_content_insert
  ON public.homebrew_content
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() OR public.is_dm_or_admin(auth.uid())
  );

DROP POLICY IF EXISTS homebrew_content_update ON public.homebrew_content;
CREATE POLICY homebrew_content_update
  ON public.homebrew_content
  FOR UPDATE
  USING (user_id = auth.uid() OR public.is_dm_or_admin(auth.uid()))
  WITH CHECK (user_id = auth.uid() OR public.is_dm_or_admin(auth.uid()));

DROP POLICY IF EXISTS homebrew_content_delete ON public.homebrew_content;
CREATE POLICY homebrew_content_delete
  ON public.homebrew_content
  FOR DELETE
  USING (user_id = auth.uid() OR public.is_dm_or_admin(auth.uid()));

DROP POLICY IF EXISTS homebrew_content_versions_select ON public.homebrew_content_versions;
CREATE POLICY homebrew_content_versions_select
  ON public.homebrew_content_versions
  FOR SELECT
  USING (public.can_view_homebrew_content(homebrew_id, auth.uid()));

DROP POLICY IF EXISTS homebrew_content_versions_insert ON public.homebrew_content_versions;
CREATE POLICY homebrew_content_versions_insert
  ON public.homebrew_content_versions
  FOR INSERT
  WITH CHECK (public.can_manage_homebrew_content(homebrew_id, auth.uid()));

CREATE OR REPLACE FUNCTION public.capture_homebrew_version_snapshot()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF (
      NEW.name IS DISTINCT FROM OLD.name
      OR NEW.description IS DISTINCT FROM OLD.description
      OR NEW.data IS DISTINCT FROM OLD.data
      OR NEW.status IS DISTINCT FROM OLD.status
      OR NEW.visibility_scope IS DISTINCT FROM OLD.visibility_scope
      OR NEW.is_public IS DISTINCT FROM OLD.is_public
      OR NEW.tags IS DISTINCT FROM OLD.tags
      OR NEW.source_book IS DISTINCT FROM OLD.source_book
      OR NEW.campaign_id IS DISTINCT FROM OLD.campaign_id
    ) THEN
      INSERT INTO public.homebrew_content_versions (
        homebrew_id,
        version_number,
        snapshot,
        created_by,
        change_note
      ) VALUES (
        OLD.id,
        COALESCE(OLD.version, 1),
        to_jsonb(OLD),
        COALESCE(auth.uid(), NEW.updated_by, OLD.user_id),
        format('Snapshot before version %s', COALESCE(OLD.version, 1) + 1)
      );

      NEW.version := COALESCE(OLD.version, 1) + 1;
    END IF;

    IF NEW.status = 'published' AND OLD.status IS DISTINCT FROM 'published' THEN
      NEW.published_at := COALESCE(NEW.published_at, now());

      IF NEW.visibility_scope = 'private' THEN
        NEW.visibility_scope := 'public';
      END IF;
    ELSIF NEW.status <> 'published' AND OLD.status = 'published' THEN
      NEW.published_at := NULL;
    END IF;

    NEW.is_public := (NEW.status = 'published' AND NEW.visibility_scope = 'public');
    NEW.updated_at := now();
    NEW.updated_by := COALESCE(auth.uid(), NEW.updated_by, OLD.updated_by, OLD.user_id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS capture_homebrew_version_snapshot ON public.homebrew_content;
CREATE TRIGGER capture_homebrew_version_snapshot
  BEFORE UPDATE ON public.homebrew_content
  FOR EACH ROW
  EXECUTE FUNCTION public.capture_homebrew_version_snapshot();

CREATE OR REPLACE FUNCTION public.set_homebrew_content_status(
  p_homebrew_id UUID,
  p_status TEXT,
  p_visibility_scope TEXT DEFAULT NULL,
  p_campaign_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_visibility_scope TEXT;
  v_existing_campaign_id UUID;
  v_target_campaign_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF p_status NOT IN ('draft', 'published', 'archived') THEN
    RAISE EXCEPTION 'INVALID_HOMEBREW_STATUS';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.homebrew_content hc
    WHERE hc.id = p_homebrew_id
  ) THEN
    RAISE EXCEPTION 'HOMEBREW_NOT_FOUND';
  END IF;

  IF NOT public.can_manage_homebrew_content(p_homebrew_id, auth.uid()) THEN
    RAISE EXCEPTION 'HOMEBREW_FORBIDDEN';
  END IF;

  SELECT
    COALESCE(p_visibility_scope, hc.visibility_scope),
    hc.campaign_id
  INTO
    v_visibility_scope,
    v_existing_campaign_id
  FROM public.homebrew_content hc
  WHERE hc.id = p_homebrew_id;

  IF v_visibility_scope NOT IN ('private', 'campaign', 'public') THEN
    RAISE EXCEPTION 'INVALID_VISIBILITY_SCOPE';
  END IF;

  IF p_status = 'published' AND v_visibility_scope = 'private' THEN
    v_visibility_scope := 'public';
  END IF;

  v_target_campaign_id := COALESCE(p_campaign_id, v_existing_campaign_id);

  IF v_visibility_scope = 'campaign'
    AND p_campaign_id IS NULL
    AND v_existing_campaign_id IS NULL
  THEN
    RAISE EXCEPTION 'CAMPAIGN_ID_REQUIRED_FOR_CAMPAIGN_VISIBILITY';
  END IF;

  IF v_visibility_scope = 'campaign'
    AND NOT (
      public.is_campaign_member(v_target_campaign_id)
      OR public.is_campaign_system(v_target_campaign_id)
      OR public.is_campaign_dm(v_target_campaign_id)
    )
  THEN
    RAISE EXCEPTION 'CAMPAIGN_VISIBILITY_FORBIDDEN';
  END IF;

  UPDATE public.homebrew_content
  SET status = p_status,
      visibility_scope = v_visibility_scope,
      campaign_id = CASE
        WHEN v_visibility_scope = 'campaign' THEN v_target_campaign_id
        ELSE NULL
      END,
      updated_by = auth.uid(),
      updated_at = now()
  WHERE id = p_homebrew_id;

  RETURN p_homebrew_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_homebrew_content_status(UUID, TEXT, TEXT, UUID) TO authenticated;

-- -----------------------------------------------------------------------------
-- Marketplace primitives
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('campaign', 'character', 'item', 'map', 'module', 'template')),
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  price_type TEXT NOT NULL DEFAULT 'free' CHECK (price_type IN ('free', 'paid', 'donation')),
  price_amount NUMERIC(10,2),
  price_currency TEXT DEFAULT 'USD',
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  compatibility JSONB NOT NULL DEFAULT '[]'::jsonb,
  license TEXT NOT NULL DEFAULT 'Custom',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  file_url TEXT,
  version TEXT NOT NULL DEFAULT '1.0.0',
  is_listed BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  downloads_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (item_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.marketplace_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'direct',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (item_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.user_marketplace_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  entitlement_type TEXT NOT NULL DEFAULT 'purchase' CHECK (entitlement_type IN ('purchase', 'grant', 'claim')),
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);

CREATE INDEX IF NOT EXISTS marketplace_items_author_idx
  ON public.marketplace_items(author_id, created_at DESC);

CREATE INDEX IF NOT EXISTS marketplace_items_listed_idx
  ON public.marketplace_items(is_listed, item_type, category);

CREATE INDEX IF NOT EXISTS marketplace_reviews_item_idx
  ON public.marketplace_reviews(item_id, created_at DESC);

CREATE INDEX IF NOT EXISTS marketplace_downloads_user_idx
  ON public.marketplace_downloads(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS user_marketplace_entitlements_user_idx
  ON public.user_marketplace_entitlements(user_id, item_id);

ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_marketplace_entitlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS marketplace_items_select ON public.marketplace_items;
CREATE POLICY marketplace_items_select
  ON public.marketplace_items
  FOR SELECT
  USING (
    is_listed OR author_id = auth.uid() OR public.is_dm_or_admin(auth.uid())
  );

DROP POLICY IF EXISTS marketplace_items_insert ON public.marketplace_items;
CREATE POLICY marketplace_items_insert
  ON public.marketplace_items
  FOR INSERT
  WITH CHECK (author_id = auth.uid() OR public.is_dm_or_admin(auth.uid()));

DROP POLICY IF EXISTS marketplace_items_update ON public.marketplace_items;
CREATE POLICY marketplace_items_update
  ON public.marketplace_items
  FOR UPDATE
  USING (author_id = auth.uid() OR public.is_dm_or_admin(auth.uid()))
  WITH CHECK (author_id = auth.uid() OR public.is_dm_or_admin(auth.uid()));

DROP POLICY IF EXISTS marketplace_items_delete ON public.marketplace_items;
CREATE POLICY marketplace_items_delete
  ON public.marketplace_items
  FOR DELETE
  USING (author_id = auth.uid() OR public.is_dm_or_admin(auth.uid()));

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
  USING (user_id = auth.uid() OR public.is_dm_or_admin(auth.uid()));

DROP POLICY IF EXISTS marketplace_reviews_delete ON public.marketplace_reviews;
CREATE POLICY marketplace_reviews_delete
  ON public.marketplace_reviews
  FOR DELETE
  USING (user_id = auth.uid() OR public.is_dm_or_admin(auth.uid()));

DROP POLICY IF EXISTS marketplace_downloads_select ON public.marketplace_downloads;
CREATE POLICY marketplace_downloads_select
  ON public.marketplace_downloads
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_dm_or_admin(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.marketplace_items mi
      WHERE mi.id = item_id
        AND mi.author_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS marketplace_downloads_insert ON public.marketplace_downloads;
CREATE POLICY marketplace_downloads_insert
  ON public.marketplace_downloads
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS user_marketplace_entitlements_select ON public.user_marketplace_entitlements;
CREATE POLICY user_marketplace_entitlements_select
  ON public.user_marketplace_entitlements
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_dm_or_admin(auth.uid()));

DROP POLICY IF EXISTS user_marketplace_entitlements_manage ON public.user_marketplace_entitlements;
CREATE POLICY user_marketplace_entitlements_manage
  ON public.user_marketplace_entitlements
  FOR ALL
  USING (public.is_dm_or_admin(auth.uid()))
  WITH CHECK (public.is_dm_or_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.user_has_marketplace_access(
  p_item_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.marketplace_items mi
    WHERE mi.id = p_item_id
      AND (
        mi.price_type = 'free'
        OR mi.author_id = p_user_id
        OR EXISTS (
          SELECT 1
          FROM public.user_marketplace_entitlements ume
          WHERE ume.item_id = p_item_id
            AND ume.user_id = p_user_id
            AND (ume.expires_at IS NULL OR ume.expires_at > now())
        )
      )
  );
$$;

GRANT EXECUTE ON FUNCTION public.user_has_marketplace_access(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.record_marketplace_download(
  p_item_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF p_user_id IS DISTINCT FROM auth.uid()
    AND NOT public.is_dm_or_admin(auth.uid())
  THEN
    RAISE EXCEPTION 'MARKETPLACE_USER_CONTEXT_FORBIDDEN';
  END IF;

  IF NOT public.user_has_marketplace_access(p_item_id, p_user_id) THEN
    RAISE EXCEPTION 'MARKETPLACE_ACCESS_DENIED';
  END IF;

  INSERT INTO public.marketplace_downloads (item_id, user_id)
  VALUES (p_item_id, p_user_id)
  ON CONFLICT (item_id, user_id) DO NOTHING;

  UPDATE public.marketplace_items
  SET downloads_count = (
    SELECT COUNT(*)::integer
    FROM public.marketplace_downloads md
    WHERE md.item_id = p_item_id
  ),
  updated_at = now()
  WHERE id = p_item_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_marketplace_download(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.upsert_marketplace_review(
  p_item_id UUID,
  p_rating INTEGER,
  p_comment TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_review_id UUID;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF p_user_id IS DISTINCT FROM auth.uid()
    AND NOT public.is_dm_or_admin(auth.uid())
  THEN
    RAISE EXCEPTION 'MARKETPLACE_USER_CONTEXT_FORBIDDEN';
  END IF;

  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'INVALID_RATING';
  END IF;

  INSERT INTO public.marketplace_reviews (item_id, user_id, rating, comment, verified_purchase)
  VALUES (
    p_item_id,
    p_user_id,
    p_rating,
    p_comment,
    public.user_has_marketplace_access(p_item_id, p_user_id)
  )
  ON CONFLICT (item_id, user_id)
  DO UPDATE SET
    rating = EXCLUDED.rating,
    comment = EXCLUDED.comment,
    verified_purchase = EXCLUDED.verified_purchase,
    updated_at = now()
  RETURNING id INTO v_review_id;

  UPDATE public.marketplace_items mi
  SET rating_avg = COALESCE(agg.avg_rating, 0),
      rating_count = COALESCE(agg.rating_count, 0),
      updated_at = now()
  FROM (
    SELECT item_id,
           AVG(rating)::numeric(3,2) AS avg_rating,
           COUNT(*)::integer AS rating_count
    FROM public.marketplace_reviews
    WHERE item_id = p_item_id
    GROUP BY item_id
  ) agg
  WHERE mi.id = p_item_id;

  RETURN v_review_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_marketplace_review(UUID, INTEGER, TEXT, UUID) TO authenticated;

DROP TRIGGER IF EXISTS update_marketplace_items_updated_at ON public.marketplace_items;
CREATE TRIGGER update_marketplace_items_updated_at
  BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_marketplace_reviews_updated_at ON public.marketplace_reviews;
CREATE TRIGGER update_marketplace_reviews_updated_at
  BEFORE UPDATE ON public.marketplace_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_marketplace_entitlements_updated_at ON public.user_marketplace_entitlements;
CREATE TRIGGER update_user_marketplace_entitlements_updated_at
  BEFORE UPDATE ON public.user_marketplace_entitlements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------------------------------------
-- Campaign session scheduling + game logs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_for TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  location TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.campaign_session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.campaign_sessions(id) ON DELETE SET NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL DEFAULT 'session' CHECK (log_type IN ('session', 'recap', 'loot', 'event', 'note')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_player_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS campaign_sessions_campaign_idx
  ON public.campaign_sessions(campaign_id, scheduled_for DESC);

CREATE INDEX IF NOT EXISTS campaign_session_logs_campaign_idx
  ON public.campaign_session_logs(campaign_id, created_at DESC);

CREATE INDEX IF NOT EXISTS campaign_session_logs_session_idx
  ON public.campaign_session_logs(session_id, created_at DESC);

ALTER TABLE public.campaign_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_session_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS campaign_sessions_select ON public.campaign_sessions;
CREATE POLICY campaign_sessions_select
  ON public.campaign_sessions
  FOR SELECT
  USING (public.is_campaign_member(campaign_id) OR public.is_campaign_dm(campaign_id));

DROP POLICY IF EXISTS campaign_sessions_manage ON public.campaign_sessions;
CREATE POLICY campaign_sessions_manage
  ON public.campaign_sessions
  FOR ALL
  USING (public.is_campaign_system(campaign_id) OR public.is_campaign_dm(campaign_id))
  WITH CHECK (public.is_campaign_system(campaign_id) OR public.is_campaign_dm(campaign_id));

DROP POLICY IF EXISTS campaign_session_logs_select ON public.campaign_session_logs;
CREATE POLICY campaign_session_logs_select
  ON public.campaign_session_logs
  FOR SELECT
  USING (
    (public.is_campaign_member(campaign_id) OR public.is_campaign_dm(campaign_id))
    AND (
      is_player_visible
      OR author_id = auth.uid()
      OR public.is_campaign_system(campaign_id)
      OR public.is_campaign_dm(campaign_id)
    )
  );

DROP POLICY IF EXISTS campaign_session_logs_insert ON public.campaign_session_logs;
CREATE POLICY campaign_session_logs_insert
  ON public.campaign_session_logs
  FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND (public.is_campaign_member(campaign_id) OR public.is_campaign_dm(campaign_id))
  );

DROP POLICY IF EXISTS campaign_session_logs_update ON public.campaign_session_logs;
CREATE POLICY campaign_session_logs_update
  ON public.campaign_session_logs
  FOR UPDATE
  USING (
    author_id = auth.uid()
    OR public.is_campaign_system(campaign_id)
    OR public.is_campaign_dm(campaign_id)
  )
  WITH CHECK (
    author_id = auth.uid()
    OR public.is_campaign_system(campaign_id)
    OR public.is_campaign_dm(campaign_id)
  );

DROP POLICY IF EXISTS campaign_session_logs_delete ON public.campaign_session_logs;
CREATE POLICY campaign_session_logs_delete
  ON public.campaign_session_logs
  FOR DELETE
  USING (
    author_id = auth.uid()
    OR public.is_campaign_system(campaign_id)
    OR public.is_campaign_dm(campaign_id)
  );

DROP TRIGGER IF EXISTS update_campaign_sessions_updated_at ON public.campaign_sessions;
CREATE TRIGGER update_campaign_sessions_updated_at
  BEFORE UPDATE ON public.campaign_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaign_session_logs_updated_at ON public.campaign_session_logs;
CREATE TRIGGER update_campaign_session_logs_updated_at
  BEFORE UPDATE ON public.campaign_session_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.upsert_campaign_session(
  p_campaign_id UUID,
  p_session_id UUID DEFAULT NULL,
  p_title TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_scheduled_for TIMESTAMPTZ DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_session_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF p_status IS NOT NULL
    AND p_status NOT IN ('planned', 'in_progress', 'completed', 'cancelled')
  THEN
    RAISE EXCEPTION 'INVALID_SESSION_STATUS';
  END IF;

  IF NOT (public.is_campaign_system(p_campaign_id) OR public.is_campaign_dm(p_campaign_id)) THEN
    RAISE EXCEPTION 'CAMPAIGN_SESSION_FORBIDDEN';
  END IF;

  IF p_session_id IS NULL THEN
    IF p_title IS NULL OR btrim(p_title) = '' THEN
      RAISE EXCEPTION 'SESSION_TITLE_REQUIRED';
    END IF;

    INSERT INTO public.campaign_sessions (
      campaign_id,
      title,
      description,
      scheduled_for,
      status,
      location,
      created_by
    )
    VALUES (
      p_campaign_id,
      p_title,
      p_description,
      p_scheduled_for,
      COALESCE(p_status, 'planned'),
      p_location,
      auth.uid()
    )
    RETURNING id INTO v_session_id;
  ELSE
    IF NOT EXISTS (
      SELECT 1
      FROM public.campaign_sessions cs
      WHERE cs.id = p_session_id
        AND cs.campaign_id = p_campaign_id
    ) THEN
      RAISE EXCEPTION 'SESSION_NOT_FOUND';
    END IF;

    UPDATE public.campaign_sessions
    SET title = COALESCE(NULLIF(p_title, ''), title),
        description = COALESCE(p_description, description),
        scheduled_for = COALESCE(p_scheduled_for, scheduled_for),
        status = COALESCE(p_status, status),
        location = COALESCE(p_location, location),
        updated_at = now()
    WHERE id = p_session_id
    RETURNING id INTO v_session_id;
  END IF;

  RETURN v_session_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_campaign_session(UUID, UUID, TEXT, TEXT, TIMESTAMPTZ, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.add_campaign_session_log(
  p_campaign_id UUID,
  p_session_id UUID DEFAULT NULL,
  p_log_type TEXT DEFAULT 'session',
  p_title TEXT DEFAULT NULL,
  p_content TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_is_player_visible BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF NOT (public.is_campaign_member(p_campaign_id) OR public.is_campaign_dm(p_campaign_id)) THEN
    RAISE EXCEPTION 'CAMPAIGN_LOG_FORBIDDEN';
  END IF;

  IF p_log_type NOT IN ('session', 'recap', 'loot', 'event', 'note') THEN
    RAISE EXCEPTION 'INVALID_LOG_TYPE';
  END IF;

  IF p_title IS NULL OR btrim(p_title) = '' THEN
    RAISE EXCEPTION 'LOG_TITLE_REQUIRED';
  END IF;

  IF p_content IS NULL OR btrim(p_content) = '' THEN
    RAISE EXCEPTION 'LOG_CONTENT_REQUIRED';
  END IF;

  IF p_session_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.campaign_sessions cs
      WHERE cs.id = p_session_id
        AND cs.campaign_id = p_campaign_id
    )
  THEN
    RAISE EXCEPTION 'SESSION_NOT_FOUND';
  END IF;

  INSERT INTO public.campaign_session_logs (
    campaign_id,
    session_id,
    author_id,
    log_type,
    title,
    content,
    metadata,
    is_player_visible
  )
  VALUES (
    p_campaign_id,
    p_session_id,
    auth.uid(),
    p_log_type,
    p_title,
    p_content,
    COALESCE(p_metadata, '{}'::jsonb),
    p_is_player_visible
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_campaign_session_log(UUID, UUID, TEXT, TEXT, TEXT, JSONB, BOOLEAN) TO authenticated;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_publication
    WHERE pubname = 'supabase_realtime'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'campaign_sessions'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_sessions;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'campaign_session_logs'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_session_logs;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'campaign_sourcebook_shares'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_sourcebook_shares;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'marketplace_items'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_items;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'marketplace_reviews'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_reviews;
    END IF;
  END IF;
END
$$;
