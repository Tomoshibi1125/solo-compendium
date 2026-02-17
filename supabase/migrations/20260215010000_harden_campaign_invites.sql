-- Harden campaign invite lifecycle, add join codes, audit logs, and multi-character attachments.

CREATE OR REPLACE FUNCTION public.hash_campaign_invite_token(p_token TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
  SELECT encode(digest(trim(p_token), 'sha256'), 'hex');
$$;

CREATE OR REPLACE FUNCTION public.generate_campaign_join_code(p_length INTEGER DEFAULT 8)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code TEXT := '';
  v_i INTEGER;
BEGIN
  IF p_length < 6 THEN
    p_length := 6;
  END IF;

  FOR v_i IN 1..p_length LOOP
    v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
  END LOOP;

  RETURN v_code;
END;
$$;

ALTER TABLE public.campaign_invites
  ADD COLUMN IF NOT EXISTS join_code TEXT,
  ADD COLUMN IF NOT EXISTS token_hash TEXT,
  ADD COLUMN IF NOT EXISTS invite_email TEXT,
  ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS revoked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS revoked_reason TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS campaign_invites_join_code_uidx
  ON public.campaign_invites(join_code)
  WHERE join_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS campaign_invites_token_hash_idx
  ON public.campaign_invites(token_hash);

CREATE INDEX IF NOT EXISTS campaign_invites_lifecycle_idx
  ON public.campaign_invites(campaign_id, revoked_at, expires_at, created_at DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'campaign_invites_join_code_format'
      AND conrelid = 'public.campaign_invites'::regclass
  ) THEN
    ALTER TABLE public.campaign_invites
      ADD CONSTRAINT campaign_invites_join_code_format
      CHECK (join_code IS NULL OR join_code ~ '^[A-HJ-NP-Z2-9]{6,10}$');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.campaign_invite_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  invite_id UUID REFERENCES public.campaign_invites(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS campaign_invite_audit_logs_campaign_idx
  ON public.campaign_invite_audit_logs(campaign_id, created_at DESC);

CREATE INDEX IF NOT EXISTS campaign_invite_audit_logs_invite_idx
  ON public.campaign_invite_audit_logs(invite_id, created_at DESC);

ALTER TABLE public.campaign_invite_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS campaign_invite_audit_logs_select ON public.campaign_invite_audit_logs;
DROP POLICY IF EXISTS campaign_invite_audit_logs_insert ON public.campaign_invite_audit_logs;

CREATE POLICY campaign_invite_audit_logs_select
  ON public.campaign_invite_audit_logs
  FOR SELECT
  USING (public.is_campaign_system(campaign_id));

CREATE POLICY campaign_invite_audit_logs_insert
  ON public.campaign_invite_audit_logs
  FOR INSERT
  WITH CHECK (
    actor_id = auth.uid()
    AND public.is_campaign_system(campaign_id)
  );

CREATE TABLE IF NOT EXISTS public.campaign_member_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  campaign_member_id UUID NOT NULL REFERENCES public.campaign_members(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (campaign_member_id, character_id),
  UNIQUE (campaign_id, character_id)
);

CREATE INDEX IF NOT EXISTS campaign_member_characters_campaign_member_idx
  ON public.campaign_member_characters(campaign_member_id);

CREATE INDEX IF NOT EXISTS campaign_member_characters_campaign_idx
  ON public.campaign_member_characters(campaign_id, created_at DESC);

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

DROP TRIGGER IF EXISTS ensure_campaign_member_characters_consistency ON public.campaign_member_characters;
CREATE TRIGGER ensure_campaign_member_characters_consistency
  BEFORE INSERT OR UPDATE ON public.campaign_member_characters
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_campaign_member_character_consistency();

ALTER TABLE public.campaign_member_characters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS campaign_member_characters_select ON public.campaign_member_characters;
DROP POLICY IF EXISTS campaign_member_characters_insert ON public.campaign_member_characters;
DROP POLICY IF EXISTS campaign_member_characters_update ON public.campaign_member_characters;
DROP POLICY IF EXISTS campaign_member_characters_delete ON public.campaign_member_characters;

CREATE POLICY campaign_member_characters_select
  ON public.campaign_member_characters
  FOR SELECT
  USING (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id));

CREATE POLICY campaign_member_characters_insert
  ON public.campaign_member_characters
  FOR INSERT
  WITH CHECK (
    (
      public.is_campaign_system(campaign_id)
      OR EXISTS (
        SELECT 1
        FROM public.campaign_members member_row
        WHERE member_row.id = campaign_member_characters.campaign_member_id
          AND member_row.user_id = auth.uid()
      )
    )
    AND (
      public.is_campaign_system(campaign_id)
      OR EXISTS (
        SELECT 1
        FROM public.characters c
        WHERE c.id = campaign_member_characters.character_id
          AND c.user_id = auth.uid()
      )
    )
  );

CREATE POLICY campaign_member_characters_update
  ON public.campaign_member_characters
  FOR UPDATE
  USING (
    public.is_campaign_system(campaign_id)
    OR EXISTS (
      SELECT 1
      FROM public.campaign_members member_row
      WHERE member_row.id = campaign_member_characters.campaign_member_id
        AND member_row.user_id = auth.uid()
    )
  );

CREATE POLICY campaign_member_characters_delete
  ON public.campaign_member_characters
  FOR DELETE
  USING (
    public.is_campaign_system(campaign_id)
    OR EXISTS (
      SELECT 1
      FROM public.campaign_members member_row
      WHERE member_row.id = campaign_member_characters.campaign_member_id
        AND member_row.user_id = auth.uid()
    )
  );

DO $$
DECLARE
  v_invite RECORD;
  v_code TEXT;
BEGIN
  UPDATE public.campaign_invites
  SET token_hash = CASE
    WHEN token ~ '^[0-9a-f]{64}$' THEN token
    ELSE public.hash_campaign_invite_token(token)
  END
  WHERE token_hash IS NULL
    AND token IS NOT NULL;

  FOR v_invite IN
    SELECT id
    FROM public.campaign_invites
    WHERE join_code IS NULL
  LOOP
    LOOP
      v_code := public.generate_campaign_join_code(8);
      EXIT WHEN NOT EXISTS (
        SELECT 1
        FROM public.campaign_invites existing_row
        WHERE existing_row.join_code = v_code
      );
    END LOOP;

    UPDATE public.campaign_invites
    SET join_code = v_code
    WHERE id = v_invite.id;
  END LOOP;

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
END $$;

UPDATE public.campaign_invites
SET token = token_hash
WHERE token_hash IS NOT NULL
  AND token <> token_hash;

ALTER TABLE public.campaign_invites
  ALTER COLUMN join_code SET NOT NULL,
  ALTER COLUMN token_hash SET NOT NULL;

CREATE OR REPLACE FUNCTION public.log_campaign_invite_event(
  p_campaign_id UUID,
  p_invite_id UUID,
  p_action TEXT,
  p_details JSONB DEFAULT '{}'::jsonb,
  p_actor_id UUID DEFAULT auth.uid()
)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  INSERT INTO public.campaign_invite_audit_logs (campaign_id, invite_id, actor_id, action, details)
  VALUES (p_campaign_id, p_invite_id, p_actor_id, p_action, COALESCE(p_details, '{}'::jsonb));
$$;

DROP FUNCTION IF EXISTS public.create_campaign_invite(UUID, TEXT, TIMESTAMPTZ, INTEGER);
DROP FUNCTION IF EXISTS public.create_campaign_invite(UUID, TEXT, TIMESTAMPTZ, INTEGER, TEXT);

CREATE OR REPLACE FUNCTION public.create_campaign_invite(
  p_campaign_id UUID,
  p_role TEXT DEFAULT 'hunter',
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
BEGIN
  IF NOT public.is_campaign_system(p_campaign_id) THEN
    RAISE EXCEPTION 'Not authorized to create invite';
  END IF;

  IF p_role NOT IN ('hunter', 'co-system') THEN
    RAISE EXCEPTION 'Invalid invite role';
  END IF;

  IF COALESCE(p_max_uses, 0) < 1 THEN
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
    p_role,
    p_expires_at,
    p_max_uses,
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
      'role', p_role,
      'max_uses', p_max_uses,
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
    invite_row.role,
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

DROP FUNCTION IF EXISTS public.get_campaign_invite_by_token(TEXT);

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

DROP FUNCTION IF EXISTS public.redeem_campaign_invite(TEXT, UUID);

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
    VALUES (
      v_campaign_id,
      auth.uid(),
      p_character_id,
      CASE WHEN v_invite.role = 'co-system' THEN 'co-system' ELSE 'hunter' END
    )
    ON CONFLICT (campaign_id, user_id)
    DO UPDATE
      SET role = CASE
        WHEN public.campaign_members.role = 'co-system' OR EXCLUDED.role = 'co-system' THEN 'co-system'
        ELSE 'hunter'
      END
    RETURNING campaign_members.id INTO v_member_id;
  END IF;

  IF p_character_id IS NOT NULL THEN
    INSERT INTO public.campaign_member_characters (
      campaign_id,
      campaign_member_id,
      character_id,
      created_by
    )
    VALUES (
      v_campaign_id,
      v_member_id,
      p_character_id,
      auth.uid()
    )
    ON CONFLICT (campaign_member_id, character_id) DO NOTHING;

    UPDATE public.campaign_members member_row
    SET character_id = COALESCE(member_row.character_id, p_character_id)
    WHERE member_row.id = v_member_id;
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
      'consumed_use', (NOT v_existing_acceptance AND NOT v_was_member)
    )
  );

  RETURN v_campaign_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_campaign_invite(
  p_invite_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_campaign_id UUID;
BEGIN
  SELECT invite_row.campaign_id
  INTO v_campaign_id
  FROM public.campaign_invites invite_row
  WHERE invite_row.id = p_invite_id;

  IF v_campaign_id IS NULL THEN
    RETURN FALSE;
  END IF;

  IF NOT public.is_campaign_system(v_campaign_id) THEN
    RAISE EXCEPTION 'Not authorized to revoke invite';
  END IF;

  UPDATE public.campaign_invites invite_row
  SET revoked_at = now(),
      revoked_by = auth.uid(),
      revoked_reason = NULLIF(trim(COALESCE(p_reason, '')), '')
  WHERE invite_row.id = p_invite_id
    AND invite_row.revoked_at IS NULL;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  PERFORM public.log_campaign_invite_event(
    v_campaign_id,
    p_invite_id,
    'invite_revoked',
    jsonb_build_object('reason', NULLIF(trim(COALESCE(p_reason, '')), ''))
  );

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_player_character_to_campaign(
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

GRANT EXECUTE ON FUNCTION public.hash_campaign_invite_token(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.generate_campaign_join_code(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_campaign_invite_event(UUID, UUID, TEXT, JSONB, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_campaign_invite(UUID, TEXT, TIMESTAMPTZ, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_campaign_invite(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_campaign_invite_by_token(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.redeem_campaign_invite(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_campaign_invite(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_player_character_to_campaign(UUID, UUID, TEXT) TO authenticated;
