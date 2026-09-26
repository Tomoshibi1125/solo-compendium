-- New companion and material RLS policies must not traverse legacy tables as
-- the browser role. Those tables have restricted grants; use narrow, actor-bound
-- definer predicates for the same ownership and campaign membership decisions.
BEGIN;

CREATE OR REPLACE FUNCTION app_private.actor_owns_character(
  p_character_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION app_private.actor_in_campaign(
  p_campaign_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT auth.uid() IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM public.campaign_members AS member_row
      WHERE member_row.campaign_id = p_campaign_id
        AND member_row.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.campaigns AS campaign_row
      WHERE campaign_row.id = p_campaign_id
        AND campaign_row.warden_id = auth.uid()
    )
  );
$$;

REVOKE ALL ON FUNCTION app_private.actor_owns_character(UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.actor_in_campaign(UUID)
  FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.actor_owns_character(UUID)
  TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.actor_in_campaign(UUID)
  TO authenticated;

DROP POLICY IF EXISTS companion_instances_select ON public.companion_instances;
CREATE POLICY companion_instances_select
ON public.companion_instances FOR SELECT TO authenticated
USING (
  app_private.actor_owns_character(owner_character_id)
  OR app_private.actor_in_campaign(owner_campaign_id)
  OR app_private.actor_owns_character(primary_handler_character_id)
  OR app_private.actor_owns_character(combat_controller_character_id)
  OR app_private.actor_owns_character(rider_character_id)
);

DROP POLICY IF EXISTS companion_bond_attempts_select ON public.companion_bond_attempts;
CREATE POLICY companion_bond_attempts_select
ON public.companion_bond_attempts FOR SELECT TO authenticated
USING (app_private.actor_in_campaign(campaign_id));

DROP POLICY IF EXISTS companion_bonds_select ON public.companion_bonds;
CREATE POLICY companion_bonds_select
ON public.companion_bonds FOR SELECT TO authenticated
USING (app_private.actor_in_campaign(campaign_id));

DROP POLICY IF EXISTS companion_attempt_adjudications_select
  ON public.companion_attempt_adjudications;
CREATE POLICY companion_attempt_adjudications_select
ON public.companion_attempt_adjudications FOR SELECT TO authenticated
USING (app_private.actor_in_campaign(campaign_id));

DROP POLICY IF EXISTS companion_control_events_select ON public.companion_control_events;
CREATE POLICY companion_control_events_select
ON public.companion_control_events FOR SELECT TO authenticated
USING (app_private.actor_in_campaign(campaign_id));

DROP POLICY IF EXISTS material_lots_read ON public.material_lots;
CREATE POLICY material_lots_read
ON public.material_lots FOR SELECT TO authenticated
USING (
  (owner_scope = 'character' AND app_private.actor_owns_character(owner_character_id))
  OR (owner_scope = 'campaign' AND app_private.actor_in_campaign(owner_campaign_id))
);

DROP POLICY IF EXISTS material_lot_reservations_read
  ON public.material_lot_reservations;
CREATE POLICY material_lot_reservations_read
ON public.material_lot_reservations FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.material_lots AS lot
    WHERE lot.id = material_lot_reservations.lot_id
  )
);

DROP POLICY IF EXISTS material_lot_discoveries_read ON public.material_lot_discoveries;
CREATE POLICY material_lot_discoveries_read
ON public.material_lot_discoveries FOR SELECT TO authenticated
USING (
  app_private.actor_owns_character(character_id)
  AND EXISTS (
    SELECT 1 FROM public.material_lots AS lot
    WHERE lot.id = material_lot_discoveries.lot_id
  )
);

DROP POLICY IF EXISTS harvest_authorizations_m2_read
  ON public.harvest_authorizations_m2;
CREATE POLICY harvest_authorizations_m2_read
ON public.harvest_authorizations_m2 FOR SELECT TO authenticated
USING (
  app_private.actor_owns_character(character_id)
  OR public.is_campaign_system(campaign_id, auth.uid())
);

DROP POLICY IF EXISTS harvest_attempts_m2_read ON public.harvest_attempts_m2;
CREATE POLICY harvest_attempts_m2_read
ON public.harvest_attempts_m2 FOR SELECT TO authenticated
USING (
  app_private.actor_owns_character(character_id)
  OR public.is_campaign_system(campaign_id, auth.uid())
);

COMMIT;
