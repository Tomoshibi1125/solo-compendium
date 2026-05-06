BEGIN;

CREATE OR REPLACE FUNCTION public.normalize_campaign_invite_role(p_role TEXT DEFAULT 'ascendant')
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, public, extensions
AS $$
  SELECT CASE lower(replace(trim(COALESCE(p_role, 'ascendant')), '_', '-'))
    WHEN '' THEN 'ascendant'
    WHEN 'ascendant' THEN 'ascendant'
    WHEN 'hunter' THEN 'ascendant'
    WHEN 'player' THEN 'ascendant'
    WHEN 'co-warden' THEN 'co-warden'
    WHEN 'co-system' THEN 'co-warden'
    WHEN 'system' THEN 'co-warden'
    WHEN 'co-dm' THEN 'co-warden'
    ELSE NULL
  END;
$$;

ALTER TABLE public.campaign_invites DROP CONSTRAINT IF EXISTS campaign_invites_role_check;

UPDATE public.campaign_invites
SET role = COALESCE(public.normalize_campaign_invite_role(role), 'ascendant')
WHERE role IS DISTINCT FROM COALESCE(public.normalize_campaign_invite_role(role), 'ascendant');

ALTER TABLE public.campaign_invites
  ALTER COLUMN role SET DEFAULT 'ascendant';

ALTER TABLE public.campaign_invites
  ADD CONSTRAINT campaign_invites_role_check
  CHECK (role IN ('ascendant', 'co-warden'));

CREATE OR REPLACE FUNCTION public.is_campaign_system(
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
  SELECT p_user_id IS NOT NULL AND (
    EXISTS (
      SELECT 1
      FROM public.campaigns
      WHERE id = p_campaign_id
        AND warden_id = p_user_id
    )
    OR EXISTS (
      SELECT 1
      FROM public.campaign_members
      WHERE campaign_id = p_campaign_id
        AND user_id = p_user_id
        AND role = 'co-warden'
    )
  );
$$;

DROP FUNCTION IF EXISTS public.get_campaign_by_share_code(TEXT);
CREATE OR REPLACE FUNCTION public.get_campaign_by_share_code(p_share_code TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  warden_id UUID,
  share_code TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  settings JSONB,
  party_gold JSONB
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT
    c.id,
    c.name,
    c.description,
    c.warden_id,
    c.share_code,
    c.is_active,
    c.created_at,
    c.updated_at,
    c.settings,
    c.party_gold
  FROM public.campaigns c
  WHERE c.share_code = upper(trim(p_share_code))
    AND c.is_active = true
  LIMIT 1;
$$;

DROP FUNCTION IF EXISTS public.create_campaign_invite(UUID, TEXT, TIMESTAMPTZ, INTEGER);
DROP FUNCTION IF EXISTS public.create_campaign_invite(UUID, TEXT, TIMESTAMPTZ, INTEGER, TEXT);

CREATE OR REPLACE FUNCTION public.create_campaign_invite(
  p_campaign_id UUID,
  p_role TEXT DEFAULT 'ascendant',
  p_expires_at TIMESTAMPTZ DEFAULT (now() + interval '24 hours'),
  p_max_uses INTEGER DEFAULT 1,
  p_invite_email TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  token TEXT,
  join_code TEXT,
  invite_url TEXT,
  role TEXT,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  used_count INTEGER,
  revoked_at TIMESTAMPTZ,
  invite_email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_token TEXT;
  v_token_hash TEXT;
  v_join_code TEXT;
  v_invite_id UUID;
  v_recent_invites INTEGER;
  v_invite_email TEXT;
  v_role TEXT;
  v_max_uses INTEGER;
BEGIN
  IF NOT public.is_campaign_system(p_campaign_id) THEN
    RAISE EXCEPTION 'Not authorized to create invite';
  END IF;

  v_role := public.normalize_campaign_invite_role(p_role);
  IF v_role IS NULL THEN
    RAISE EXCEPTION 'Invalid invite role';
  END IF;

  v_max_uses := COALESCE(p_max_uses, 1);
  IF v_max_uses < 1 THEN
    RAISE EXCEPTION 'Invite max uses must be at least 1';
  END IF;

  SELECT COUNT(*)
  INTO v_recent_invites
  FROM public.campaign_invite_audit_logs audit_row
  WHERE audit_row.actor_id = auth.uid()
    AND audit_row.campaign_id = p_campaign_id
    AND audit_row.action = 'invite_created'
    AND audit_row.created_at > now() - interval '1 hour';

  IF v_recent_invites >= 50 THEN
    RAISE EXCEPTION 'RATE_LIMIT: too many invites created in the last hour';
  END IF;

  v_invite_email := NULLIF(lower(trim(COALESCE(p_invite_email, ''))), '');

  LOOP
    v_token := encode(gen_random_bytes(24), 'hex');
    v_token_hash := public.hash_campaign_invite_token(v_token);
    EXIT WHEN NOT EXISTS (
      SELECT 1
      FROM public.campaign_invites invite_row
      WHERE invite_row.token_hash = v_token_hash
    );
  END LOOP;

  LOOP
    v_join_code := public.generate_campaign_join_code(8);
    EXIT WHEN NOT EXISTS (
      SELECT 1
      FROM public.campaign_invites invite_row
      WHERE invite_row.join_code = v_join_code
    );
  END LOOP;

  INSERT INTO public.campaign_invites (
    campaign_id,
    token,
    token_hash,
    join_code,
    created_by,
    role,
    expires_at,
    max_uses,
    invite_email,
    revoked_at,
    revoked_by,
    revoked_reason
  )
  VALUES (
    p_campaign_id,
    v_token_hash,
    v_token_hash,
    v_join_code,
    auth.uid(),
    v_role,
    p_expires_at,
    v_max_uses,
    v_invite_email,
    NULL,
    NULL,
    NULL
  )
  RETURNING campaign_invites.id INTO v_invite_id;

  PERFORM public.log_campaign_invite_event(
    p_campaign_id,
    v_invite_id,
    'invite_created',
    jsonb_build_object(
      'role', v_role,
      'max_uses', v_max_uses,
      'expires_at', p_expires_at,
      'join_code', v_join_code,
      'invite_email', v_invite_email
    )
  );

  RETURN QUERY
  SELECT
    invite_row.id,
    v_token AS token,
    invite_row.join_code,
    '/campaigns/join/' || v_token AS invite_url,
    invite_row.role,
    invite_row.expires_at,
    invite_row.max_uses,
    invite_row.used_count,
    invite_row.revoked_at,
    invite_row.invite_email
  FROM public.campaign_invites invite_row
  WHERE invite_row.id = v_invite_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.resolve_campaign_invite(p_access_key TEXT)
RETURNS TABLE (
  invite_id UUID,
  campaign_id UUID,
  campaign_name TEXT,
  campaign_description TEXT,
  role TEXT,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  used_count INTEGER,
  join_code TEXT,
  invite_email TEXT,
  revoked_at TIMESTAMPTZ,
  is_revoked BOOLEAN,
  is_expired BOOLEAN,
  is_exhausted BOOLEAN,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_key TEXT;
  v_key_hash TEXT;
BEGIN
  v_key := trim(COALESCE(p_access_key, ''));
  IF v_key = '' THEN
    RETURN;
  END IF;

  v_key_hash := public.hash_campaign_invite_token(v_key);

  RETURN QUERY
  SELECT
    invite_row.id,
    campaign_row.id,
    campaign_row.name,
    campaign_row.description,
    public.normalize_campaign_invite_role(invite_row.role),
    invite_row.expires_at,
    invite_row.max_uses,
    invite_row.used_count,
    invite_row.join_code,
    invite_row.invite_email,
    invite_row.revoked_at,
    invite_row.revoked_at IS NOT NULL,
    invite_row.expires_at IS NOT NULL AND invite_row.expires_at < now(),
    invite_row.max_uses IS NOT NULL AND invite_row.used_count >= invite_row.max_uses,
    CASE
      WHEN invite_row.revoked_at IS NOT NULL THEN 'revoked'
      WHEN invite_row.expires_at IS NOT NULL AND invite_row.expires_at < now() THEN 'expired'
      WHEN invite_row.max_uses IS NOT NULL AND invite_row.used_count >= invite_row.max_uses THEN 'used_up'
      ELSE 'active'
    END AS status
  FROM public.campaign_invites invite_row
  JOIN public.campaigns campaign_row
    ON campaign_row.id = invite_row.campaign_id
  WHERE campaign_row.is_active = true
    AND (
      invite_row.join_code = upper(v_key)
      OR invite_row.token_hash = v_key_hash
    )
  ORDER BY invite_row.created_at DESC
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_campaign_invite_by_token(p_token TEXT)
RETURNS TABLE (
  campaign_id UUID,
  campaign_name TEXT,
  campaign_description TEXT,
  role TEXT,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  used_count INTEGER,
  join_code TEXT,
  invite_email TEXT,
  status TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT
    resolved.campaign_id,
    resolved.campaign_name,
    resolved.campaign_description,
    resolved.role,
    resolved.expires_at,
    resolved.max_uses,
    resolved.used_count,
    resolved.join_code,
    resolved.invite_email,
    resolved.status
  FROM public.resolve_campaign_invite(p_token) resolved;
$$;

CREATE OR REPLACE FUNCTION public.attach_campaign_member_character(
  p_campaign_id UUID,
  p_member_id UUID,
  p_character_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
BEGIN
  INSERT INTO public.campaign_member_characters (
    campaign_id,
    campaign_member_id,
    character_id,
    created_by
  )
  VALUES (
    p_campaign_id,
    p_member_id,
    p_character_id,
    auth.uid()
  )
  ON CONFLICT DO NOTHING;

  IF NOT EXISTS (
    SELECT 1
    FROM public.campaign_member_characters link_row
    WHERE link_row.campaign_member_id = p_member_id
      AND link_row.character_id = p_character_id
  ) THEN
    RAISE EXCEPTION 'Character is already linked to another campaign member';
  END IF;

  UPDATE public.campaign_members member_row
  SET character_id = COALESCE(member_row.character_id, p_character_id)
  WHERE member_row.id = p_member_id;
END;
$$;

DROP FUNCTION IF EXISTS public.join_campaign_by_id(UUID);
DROP FUNCTION IF EXISTS public.join_campaign_by_id(UUID, UUID);

CREATE OR REPLACE FUNCTION public.join_campaign_by_id(
  p_campaign_id UUID,
  p_character_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_member_id UUID;
  v_character_owner UUID;
  v_was_member BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT public.is_campaign_active(p_campaign_id) THEN
    RAISE EXCEPTION 'Campaign inactive';
  END IF;

  IF p_character_id IS NOT NULL THEN
    SELECT c.user_id INTO v_character_owner
    FROM public.characters c
    WHERE c.id = p_character_id;

    IF v_character_owner IS NULL OR v_character_owner <> auth.uid() THEN
      RAISE EXCEPTION 'Character ownership validation failed';
    END IF;
  END IF;

  SELECT member_row.id
  INTO v_member_id
  FROM public.campaign_members member_row
  WHERE member_row.campaign_id = p_campaign_id
    AND member_row.user_id = auth.uid();

  v_was_member := v_member_id IS NOT NULL;

  IF v_member_id IS NULL THEN
    INSERT INTO public.campaign_members (campaign_id, user_id, character_id, role)
    VALUES (p_campaign_id, auth.uid(), p_character_id, 'ascendant')
    ON CONFLICT (campaign_id, user_id)
    DO UPDATE SET character_id = COALESCE(public.campaign_members.character_id, EXCLUDED.character_id)
    RETURNING campaign_members.id INTO v_member_id;
  END IF;

  IF p_character_id IS NOT NULL THEN
    PERFORM public.attach_campaign_member_character(p_campaign_id, v_member_id, p_character_id);
  END IF;

  RETURN p_campaign_id;
END;
$$;

DROP FUNCTION IF EXISTS public.join_campaign_by_code(TEXT);
DROP FUNCTION IF EXISTS public.join_campaign_by_code(TEXT, UUID);

CREATE OR REPLACE FUNCTION public.join_campaign_by_code(
  p_code TEXT,
  p_character_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_campaign_id UUID;
BEGIN
  SELECT c.id
  INTO v_campaign_id
  FROM public.campaigns c
  WHERE c.share_code = upper(trim(COALESCE(p_code, '')))
    AND c.is_active = true
  LIMIT 1;

  IF v_campaign_id IS NULL THEN
    RAISE EXCEPTION 'Campaign not found';
  END IF;

  RETURN public.join_campaign_by_id(v_campaign_id, p_character_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.redeem_campaign_invite(
  p_token TEXT,
  p_character_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_access_key TEXT;
  v_access_hash TEXT;
  v_invite public.campaign_invites%ROWTYPE;
  v_campaign_id UUID;
  v_member_id UUID;
  v_character_owner UUID;
  v_existing_acceptance BOOLEAN;
  v_was_member BOOLEAN;
  v_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  v_access_key := trim(COALESCE(p_token, ''));
  IF v_access_key = '' THEN
    RAISE EXCEPTION 'Invite token required';
  END IF;

  v_access_hash := public.hash_campaign_invite_token(v_access_key);

  SELECT *
  INTO v_invite
  FROM public.campaign_invites invite_row
  WHERE invite_row.join_code = upper(v_access_key)
     OR invite_row.token_hash = v_access_hash
  ORDER BY invite_row.created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite not found';
  END IF;

  v_role := public.normalize_campaign_invite_role(v_invite.role);
  IF v_role IS NULL THEN
    RAISE EXCEPTION 'Invalid invite role';
  END IF;

  IF v_invite.revoked_at IS NOT NULL THEN
    RAISE EXCEPTION 'Invite revoked';
  END IF;

  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < now() THEN
    RAISE EXCEPTION 'Invite expired';
  END IF;

  SELECT member_row.id
  INTO v_member_id
  FROM public.campaign_members member_row
  WHERE member_row.campaign_id = v_invite.campaign_id
    AND member_row.user_id = auth.uid();

  v_was_member := v_member_id IS NOT NULL;

  SELECT EXISTS (
    SELECT 1
    FROM public.campaign_invite_audit_logs audit_row
    WHERE audit_row.invite_id = v_invite.id
      AND audit_row.actor_id = auth.uid()
      AND audit_row.action = 'invite_accepted'
  )
  INTO v_existing_acceptance;

  IF v_invite.max_uses IS NOT NULL
    AND v_invite.used_count >= v_invite.max_uses
    AND NOT v_existing_acceptance
    AND v_member_id IS NULL
  THEN
    RAISE EXCEPTION 'Invite already used';
  END IF;

  v_campaign_id := v_invite.campaign_id;

  IF NOT public.is_campaign_active(v_campaign_id) THEN
    RAISE EXCEPTION 'Campaign inactive';
  END IF;

  IF p_character_id IS NOT NULL THEN
    SELECT c.user_id INTO v_character_owner
    FROM public.characters c
    WHERE c.id = p_character_id;

    IF v_character_owner IS NULL OR v_character_owner <> auth.uid() THEN
      RAISE EXCEPTION 'Character ownership validation failed';
    END IF;
  END IF;

  IF v_member_id IS NULL THEN
    INSERT INTO public.campaign_members (campaign_id, user_id, character_id, role)
    VALUES (v_campaign_id, auth.uid(), p_character_id, v_role)
    ON CONFLICT (campaign_id, user_id)
    DO UPDATE
      SET role = CASE
        WHEN public.campaign_members.role = 'warden' THEN 'warden'
        WHEN public.campaign_members.role = 'co-warden' OR EXCLUDED.role = 'co-warden' THEN 'co-warden'
        ELSE 'ascendant'
      END,
      character_id = COALESCE(public.campaign_members.character_id, EXCLUDED.character_id)
    RETURNING campaign_members.id INTO v_member_id;
  ELSIF v_role = 'co-warden' THEN
    UPDATE public.campaign_members member_row
    SET role = CASE WHEN member_row.role = 'warden' THEN 'warden' ELSE 'co-warden' END
    WHERE member_row.id = v_member_id;
  END IF;

  IF p_character_id IS NOT NULL THEN
    PERFORM public.attach_campaign_member_character(v_campaign_id, v_member_id, p_character_id);
  END IF;

  IF NOT v_existing_acceptance AND NOT v_was_member THEN
    UPDATE public.campaign_invites invite_row
    SET used_count = used_count + 1,
        last_used_at = now()
    WHERE invite_row.id = v_invite.id;
  END IF;

  PERFORM public.log_campaign_invite_event(
    v_campaign_id,
    v_invite.id,
    'invite_accepted',
    jsonb_build_object(
      'member_id', v_member_id,
      'character_id', p_character_id,
      'existing_member', v_was_member,
      'consumed_use', (NOT v_existing_acceptance AND NOT v_was_member),
      'role', v_role
    )
  );

  RETURN v_campaign_id;
END;
$$;

DROP FUNCTION IF EXISTS public.add_player_character_to_campaign(UUID, UUID);
DROP FUNCTION IF EXISTS public.add_player_character_to_campaign(UUID, UUID, TEXT);
DROP FUNCTION IF EXISTS public.add_ascendant_character_to_campaign(UUID, UUID);
DROP FUNCTION IF EXISTS public.add_ascendant_character_to_campaign(UUID, UUID, TEXT);

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

  PERFORM public.attach_campaign_member_character(p_campaign_id, v_member_id, p_character_id);

  RETURN v_member_id;
END;
$$;

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
  SELECT public.add_ascendant_character_to_campaign(p_campaign_id, p_character_id, p_invite_token);
$$;

DROP FUNCTION IF EXISTS public.get_campaign_linked_characters(UUID);

CREATE OR REPLACE FUNCTION public.get_campaign_linked_characters(p_campaign_id UUID)
RETURNS TABLE (
  campaign_id UUID,
  campaign_member_id UUID,
  user_id UUID,
  role TEXT,
  character_id UUID,
  character_name TEXT,
  hp_current INTEGER,
  hp_max INTEGER,
  armor_class INTEGER,
  portrait_url TEXT,
  level INTEGER,
  job TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  WITH linked AS (
    SELECT
      member_row.campaign_id,
      member_row.id AS campaign_member_id,
      member_row.user_id,
      member_row.role,
      link_row.character_id
    FROM public.campaign_members member_row
    JOIN public.campaign_member_characters link_row
      ON link_row.campaign_member_id = member_row.id
    WHERE member_row.campaign_id = p_campaign_id
    UNION
    SELECT
      member_row.campaign_id,
      member_row.id AS campaign_member_id,
      member_row.user_id,
      member_row.role,
      member_row.character_id
    FROM public.campaign_members member_row
    WHERE member_row.campaign_id = p_campaign_id
      AND member_row.character_id IS NOT NULL
  )
  SELECT
    linked.campaign_id,
    linked.campaign_member_id,
    linked.user_id,
    linked.role,
    linked.character_id,
    character_row.name,
    character_row.hp_current,
    character_row.hp_max,
    character_row.armor_class,
    character_row.portrait_url,
    character_row.level,
    character_row.job
  FROM linked
  JOIN public.characters character_row
    ON character_row.id = linked.character_id
  WHERE public.is_campaign_member(p_campaign_id) OR public.is_campaign_warden(p_campaign_id);
$$;

GRANT EXECUTE ON FUNCTION public.normalize_campaign_invite_role(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_campaign_system(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_campaign_by_share_code(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_campaign_invite(UUID, TEXT, TIMESTAMPTZ, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_campaign_invite(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_campaign_invite_by_token(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.attach_campaign_member_character(UUID, UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_campaign_by_id(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_campaign_by_code(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_campaign_invite(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_ascendant_character_to_campaign(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_player_character_to_campaign(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_campaign_linked_characters(UUID) TO authenticated;

COMMIT;

NOTIFY pgrst, 'reload schema';
