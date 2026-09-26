-- Removing a roster row must not erase the C2 attempt, bond, and control audit.
BEGIN;

ALTER TABLE public.companion_instances
  ADD COLUMN IF NOT EXISTS lifecycle_status TEXT NOT NULL DEFAULT 'active'
    CHECK (lifecycle_status IN ('active', 'retired'));
ALTER TABLE public.companion_instances
  ADD COLUMN IF NOT EXISTS retired_at TIMESTAMPTZ;

ALTER TABLE public.companion_control_events
  ALTER COLUMN tamed_anomaly_id DROP NOT NULL;
ALTER TABLE public.companion_control_events
  DROP CONSTRAINT IF EXISTS companion_control_events_tamed_anomaly_id_fkey;
ALTER TABLE public.companion_control_events
  ADD CONSTRAINT companion_control_events_tamed_anomaly_id_fkey
    FOREIGN KEY (tamed_anomaly_id)
    REFERENCES public.campaign_tamed_anomalies(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION app_private.cleanup_companion_instance_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_instance UUID := OLD.companion_instance_id;
BEGIN
  IF v_instance IS NULL THEN RETURN NULL; END IF;
  IF EXISTS (SELECT 1 FROM public.character_extras WHERE companion_instance_id = v_instance)
     OR EXISTS (SELECT 1 FROM public.character_tamed_anomalies WHERE companion_instance_id = v_instance)
     OR EXISTS (SELECT 1 FROM public.campaign_tamed_anomalies WHERE companion_instance_id = v_instance)
     OR EXISTS (SELECT 1 FROM public.character_vehicles WHERE companion_instance_id = v_instance)
  THEN
    RETURN NULL;
  END IF;

  IF EXISTS (SELECT 1 FROM public.companion_bond_attempts WHERE companion_instance_id = v_instance)
     OR EXISTS (SELECT 1 FROM public.companion_bonds WHERE companion_instance_id = v_instance)
     OR EXISTS (SELECT 1 FROM public.companion_control_events WHERE companion_instance_id = v_instance)
  THEN
    UPDATE public.companion_bonds
    SET released_at = COALESCE(released_at, now()),
        release_reason = COALESCE(release_reason, 'companion-roster-removed')
    WHERE companion_instance_id = v_instance AND released_at IS NULL;
    UPDATE public.companion_instances
    SET lifecycle_status = 'retired', retired_at = COALESCE(retired_at, now()),
        primary_handler_character_id = NULL,
        combat_controller_character_id = NULL,
        rider_character_id = NULL,
        updated_at = now()
    WHERE id = v_instance;
  ELSE
    DELETE FROM public.companion_instances WHERE id = v_instance;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.guard_retired_companion_combat_entry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  IF NEW.companion_instance_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.companion_instances AS instance
    WHERE instance.id = NEW.companion_instance_id
      AND instance.lifecycle_status = 'retired'
  ) THEN
    RAISE EXCEPTION 'RETIRED_COMPANION_CANNOT_ENTER_COMBAT' USING ERRCODE = '22023';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_retired_companion_combat_entry
  ON public.campaign_combatants;
CREATE TRIGGER guard_retired_companion_combat_entry
BEFORE INSERT OR UPDATE OF companion_instance_id ON public.campaign_combatants
FOR EACH ROW EXECUTE FUNCTION app_private.guard_retired_companion_combat_entry();

REVOKE ALL ON FUNCTION app_private.cleanup_companion_instance_reference()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.guard_retired_companion_combat_entry()
  FROM PUBLIC, anon, authenticated;

COMMIT;
