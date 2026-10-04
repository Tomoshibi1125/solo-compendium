-- A clean replay has combat RLS without browser grants, and its legacy read
-- policies traverse tables the browser cannot read. Keep the campaign tracker
-- usable while protecting session/companion identity from cross-campaign rows.
BEGIN;

DROP POLICY IF EXISTS campaign_combat_sessions_select ON public.campaign_combat_sessions;
CREATE POLICY campaign_combat_sessions_select
ON public.campaign_combat_sessions FOR SELECT TO authenticated
USING (app_private.actor_in_campaign(campaign_id));

DROP POLICY IF EXISTS campaign_combatants_select ON public.campaign_combatants;
CREATE POLICY campaign_combatants_select
ON public.campaign_combatants FOR SELECT TO authenticated
USING (app_private.actor_in_campaign(campaign_id));

DROP POLICY IF EXISTS campaign_combat_sessions_insert ON public.campaign_combat_sessions;
CREATE POLICY campaign_combat_sessions_insert
ON public.campaign_combat_sessions FOR INSERT TO authenticated
WITH CHECK (public.is_campaign_system(campaign_id, auth.uid()));
DROP POLICY IF EXISTS campaign_combat_sessions_update ON public.campaign_combat_sessions;
CREATE POLICY campaign_combat_sessions_update
ON public.campaign_combat_sessions FOR UPDATE TO authenticated
USING (public.is_campaign_system(campaign_id, auth.uid()))
WITH CHECK (public.is_campaign_system(campaign_id, auth.uid()));
DROP POLICY IF EXISTS campaign_combat_sessions_delete ON public.campaign_combat_sessions;
CREATE POLICY campaign_combat_sessions_delete
ON public.campaign_combat_sessions FOR DELETE TO authenticated
USING (public.is_campaign_system(campaign_id, auth.uid()));

DROP POLICY IF EXISTS campaign_combatants_insert ON public.campaign_combatants;
CREATE POLICY campaign_combatants_insert
ON public.campaign_combatants FOR INSERT TO authenticated
WITH CHECK (public.is_campaign_system(campaign_id, auth.uid()));
DROP POLICY IF EXISTS campaign_combatants_update ON public.campaign_combatants;
CREATE POLICY campaign_combatants_update
ON public.campaign_combatants FOR UPDATE TO authenticated
USING (public.is_campaign_system(campaign_id, auth.uid()))
WITH CHECK (public.is_campaign_system(campaign_id, auth.uid()));
DROP POLICY IF EXISTS campaign_combatants_delete ON public.campaign_combatants;
CREATE POLICY campaign_combatants_delete
ON public.campaign_combatants FOR DELETE TO authenticated
USING (public.is_campaign_system(campaign_id, auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_combat_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_combatants TO authenticated;

CREATE OR REPLACE FUNCTION app_private.combatant_session_scope()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_campaign_id UUID;
BEGIN
  IF TG_OP = 'UPDATE' AND (
    NEW.id IS DISTINCT FROM OLD.id OR
    NEW.session_id IS DISTINCT FROM OLD.session_id OR
    NEW.campaign_id IS DISTINCT FROM OLD.campaign_id OR
    NEW.companion_instance_id IS DISTINCT FROM OLD.companion_instance_id
  ) THEN
    RAISE EXCEPTION 'COMBATANT_IDENTITY_IMMUTABLE' USING ERRCODE = '22023';
  END IF;

  SELECT campaign_id INTO v_campaign_id
  FROM public.campaign_combat_sessions
  WHERE id = NEW.session_id;
  IF v_campaign_id IS NULL OR NEW.campaign_id <> v_campaign_id THEN
    RAISE EXCEPTION 'COMBATANT_SESSION_CAMPAIGN_MISMATCH' USING ERRCODE = '22023';
  END IF;

  IF NEW.member_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.campaign_members
    WHERE id = NEW.member_id AND campaign_id = NEW.campaign_id
  ) THEN
    RAISE EXCEPTION 'COMBATANT_MEMBER_CAMPAIGN_MISMATCH' USING ERRCODE = '22023';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION app_private.combatant_session_scope()
  FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS campaign_combatants_session_scope ON public.campaign_combatants;
CREATE TRIGGER campaign_combatants_session_scope
BEFORE INSERT OR UPDATE ON public.campaign_combatants
FOR EACH ROW EXECUTE FUNCTION app_private.combatant_session_scope();

COMMIT;
