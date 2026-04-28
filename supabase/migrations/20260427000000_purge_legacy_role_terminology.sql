-- ============================================================================
-- Final Warden/Ascendant Terminology Purge
--
-- Eliminates remaining legacy `dm`/`player` terminology that earlier migrations
-- left behind:
--   * profiles.role check constraint still allowed ('player','dm','admin')
--   * profile rows might still hold legacy 'player'/'dm' literals
--   * is_dm_or_admin() helper still queried role IN ('dm','admin')
--   * is_campaign_dm() / add_player_character_to_campaign() still bore legacy names
--   * session_participants.is_dm and vtt_tokens.is_dm_token columns remained
--   * campaign_details view still exposed dm_email / dm_id / dm_name
--   * handle_new_user() still defaulted role to 'player'
--
-- This migration:
--   1. Migrates existing profile rows (dm -> warden, player -> ascendant)
--   2. Updates the role check constraint to ('ascendant','warden','admin')
--      and changes the default to 'ascendant'
--   3. Renames session_participants.is_dm -> is_warden
--   4. Renames vtt_tokens.is_dm_token -> is_warden_token
--   5. Renames is_dm_or_admin -> is_warden_or_admin (with new role values)
--      and is_campaign_dm -> is_campaign_warden
--   6. Renames add_player_character_to_campaign -> add_ascendant_character_to_campaign
--   7. Creates backward-compatibility shims under the old names so legacy
--      RLS policy/function call sites keep working during the transition
--   8. Recreates campaign_details view with warden_id/warden_email/warden_name
--      while preserving dm_id/dm_email/dm_name aliases for downstream callers
--   9. Repoints handle_new_user() to insert 'ascendant' as the default role
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. profiles role normalization + check constraint
-- ----------------------------------------------------------------------------

-- Drop any old check constraint variants that may still exist.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Migrate any legacy values still hanging around.
UPDATE public.profiles SET role = 'warden' WHERE role = 'dm';
UPDATE public.profiles SET role = 'ascendant' WHERE role = 'player';

-- Anything that still doesn't match the canonical set falls back to ascendant
-- (defensive — should be a no-op if the data is clean).
UPDATE public.profiles
SET role = 'ascendant'
WHERE role IS NULL
   OR role NOT IN ('ascendant', 'warden', 'admin');

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('ascendant', 'warden', 'admin'));

ALTER TABLE public.profiles
  ALTER COLUMN role SET DEFAULT 'ascendant';

-- ----------------------------------------------------------------------------
-- 2. session_participants.is_dm -> is_warden
-- ----------------------------------------------------------------------------

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'session_participants'
      AND column_name = 'is_dm'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'session_participants'
      AND column_name = 'is_warden'
  ) THEN
    ALTER TABLE public.session_participants RENAME COLUMN is_dm TO is_warden;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. vtt_tokens.is_dm_token -> is_warden_token
-- ----------------------------------------------------------------------------

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'vtt_tokens'
      AND column_name = 'is_dm_token'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'vtt_tokens'
      AND column_name = 'is_warden_token'
  ) THEN
    ALTER TABLE public.vtt_tokens RENAME COLUMN is_dm_token TO is_warden_token;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 4. is_warden_or_admin (canonical) + is_dm_or_admin shim
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_warden_or_admin(
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_has_role BOOLEAN := false;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  IF to_regclass('public.profiles') IS NOT NULL THEN
    EXECUTE '
      SELECT EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = $1
          AND p.role IN (''warden'', ''admin'')
      )
    '
    INTO v_has_role
    USING p_user_id;

    IF v_has_role THEN
      RETURN TRUE;
    END IF;
  END IF;

  IF to_regclass('public.user_profiles') IS NOT NULL THEN
    EXECUTE '
      SELECT EXISTS (
        SELECT 1
        FROM public.user_profiles up
        WHERE up.id = $1
          AND up.role IN (''warden'', ''admin'')
      )
    '
    INTO v_has_role
    USING p_user_id;

    RETURN COALESCE(v_has_role, FALSE);
  END IF;

  RETURN FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_warden_or_admin(UUID) TO authenticated;

-- Backward-compat shim. Lots of older policies and functions call
-- public.is_dm_or_admin(); keep that name working but route through the
-- canonical role values.
CREATE OR REPLACE FUNCTION public.is_dm_or_admin(
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
  SELECT public.is_warden_or_admin(p_user_id);
$$;

GRANT EXECUTE ON FUNCTION public.is_dm_or_admin(UUID) TO authenticated;

-- ----------------------------------------------------------------------------
-- 5. is_campaign_warden (canonical) + is_campaign_dm shim
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_campaign_warden(
  p_campaign_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaigns
    WHERE id = p_campaign_id
      AND warden_id = p_user_id
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_campaign_warden(UUID, UUID) TO authenticated;

-- Replace the legacy is_campaign_dm with a thin shim that delegates to the
-- canonical helper so any RLS still calling it keeps working.
CREATE OR REPLACE FUNCTION public.is_campaign_dm(
  p_campaign_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT public.is_campaign_warden(p_campaign_id, p_user_id);
$$;

GRANT EXECUTE ON FUNCTION public.is_campaign_dm(UUID, UUID) TO authenticated;

-- ----------------------------------------------------------------------------
-- 6. add_ascendant_character_to_campaign + add_player_character_to_campaign shim
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.add_ascendant_character_to_campaign(
  p_campaign_id UUID,
  p_character_id UUID,
  p_invite_token TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_member_id UUID;
  v_owner_id UUID;
  v_joined_campaign UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT c.user_id INTO v_owner_id
  FROM public.characters c
  WHERE c.id = p_character_id;

  IF v_owner_id IS NULL OR v_owner_id <> auth.uid() THEN
    RAISE EXCEPTION 'Character ownership validation failed';
  END IF;

  SELECT member_row.id
  INTO v_member_id
  FROM public.campaign_members member_row
  WHERE member_row.campaign_id = p_campaign_id
    AND member_row.user_id = auth.uid();

  IF v_member_id IS NULL AND p_invite_token IS NOT NULL THEN
    v_joined_campaign := public.redeem_campaign_invite(p_invite_token, NULL);
    IF v_joined_campaign <> p_campaign_id THEN
      RAISE EXCEPTION 'Invite campaign mismatch';
    END IF;

    SELECT member_row.id
    INTO v_member_id
    FROM public.campaign_members member_row
    WHERE member_row.campaign_id = p_campaign_id
      AND member_row.user_id = auth.uid();
  END IF;

  IF v_member_id IS NULL THEN
    RAISE EXCEPTION 'You must be a campaign member before attaching a character';
  END IF;

  INSERT INTO public.campaign_member_characters (
    campaign_id,
    campaign_member_id,
    character_id,
    created_by
  )
  VALUES (
    p_campaign_id,
    v_member_id,
    p_character_id,
    auth.uid()
  )
  ON CONFLICT (campaign_member_id, character_id) DO NOTHING;

  UPDATE public.campaign_members member_row
  SET character_id = COALESCE(member_row.character_id, p_character_id)
  WHERE member_row.id = v_member_id;

  RETURN v_member_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_ascendant_character_to_campaign(UUID, UUID, TEXT) TO authenticated;

-- Backward-compat shim. Existing client code calls
-- supabase.rpc('add_player_character_to_campaign', ...). Keep the legacy name
-- around delegating to the canonical implementation.
CREATE OR REPLACE FUNCTION public.add_player_character_to_campaign(
  p_campaign_id UUID,
  p_character_id UUID,
  p_invite_token TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT public.add_ascendant_character_to_campaign(
    p_campaign_id,
    p_character_id,
    p_invite_token
  );
$$;

GRANT EXECUTE ON FUNCTION public.add_player_character_to_campaign(UUID, UUID, TEXT) TO authenticated;

-- ----------------------------------------------------------------------------
-- 7. campaign_details view: rename dm_* columns -> warden_* (keep legacy
--    aliases so callers querying dm_email/dm_id/dm_name keep working).
-- ----------------------------------------------------------------------------

DROP VIEW IF EXISTS public.campaign_details;
CREATE VIEW public.campaign_details WITH (security_invoker = on) AS
SELECT
  cam.*,
  cam.warden_id   AS dm_id,
  up.email        AS warden_email,
  up.email        AS dm_email,
  up.display_name AS warden_name,
  up.display_name AS dm_name
FROM public.campaigns cam
JOIN public.profiles up ON cam.warden_id = up.id;

-- ----------------------------------------------------------------------------
-- 8. handle_new_user(): default new profile rows to 'ascendant'
--    and normalize legacy metadata role values on the way in.
-- ----------------------------------------------------------------------------

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

  IF v_role NOT IN ('ascendant', 'warden', 'admin') THEN
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMIT;

-- Refresh PostgREST schema cache so renamed columns/functions are visible.
NOTIFY pgrst, 'reload schema';
