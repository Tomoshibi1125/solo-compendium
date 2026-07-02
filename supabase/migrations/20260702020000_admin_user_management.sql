-- Admin user management (Phase-5 hardening): app-level suspension flag on
-- profiles, an admin audit log, and warden-guarded SECURITY DEFINER
-- mutations that write the audit trail atomically with the change.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_created_idx
  ON public.admin_audit_log(created_at DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Wardens/admins read the audit trail. There is intentionally NO insert
-- policy: rows are written only by the SECURITY DEFINER functions below, so
-- the log cannot be forged or edited from the client.
CREATE POLICY "Wardens view the audit log"
  ON public.admin_audit_log FOR SELECT
  USING (public.is_warden_or_admin((select auth.uid())));

-- Change a user's role (warden <-> ascendant) with an audit entry.
CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  p_target UUID,
  p_role TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old TEXT;
BEGIN
  IF NOT public.is_warden_or_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized to manage users';
  END IF;
  IF p_role NOT IN ('warden', 'ascendant') THEN
    RAISE EXCEPTION 'Invalid role: %', p_role;
  END IF;

  SELECT role INTO v_old FROM public.profiles WHERE id = p_target;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  UPDATE public.profiles
  SET role = p_role, updated_at = now()
  WHERE id = p_target;

  INSERT INTO public.admin_audit_log (actor_user_id, action, target_user_id, details)
  VALUES (auth.uid(), 'set_role', p_target,
          jsonb_build_object('from', v_old, 'to', p_role));
END;
$$;

-- Suspend / reinstate an account (app-level ban) with an audit entry.
CREATE OR REPLACE FUNCTION public.admin_set_user_ban(
  p_target UUID,
  p_banned BOOLEAN
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_warden_or_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized to manage users';
  END IF;
  IF p_banned AND p_target = auth.uid() THEN
    RAISE EXCEPTION 'Cannot suspend your own account';
  END IF;

  UPDATE public.profiles
  SET banned_at = CASE WHEN p_banned THEN now() ELSE NULL END,
      updated_at = now()
  WHERE id = p_target;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  INSERT INTO public.admin_audit_log (actor_user_id, action, target_user_id, details)
  VALUES (auth.uid(),
          CASE WHEN p_banned THEN 'ban_user' ELSE 'unban_user' END,
          p_target, '{}'::jsonb);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_set_user_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_ban(UUID, BOOLEAN) TO authenticated;
