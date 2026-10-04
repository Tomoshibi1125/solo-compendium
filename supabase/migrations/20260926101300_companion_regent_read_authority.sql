-- Campaign roster tables are intentionally not directly readable by all
-- authenticated clients. Keep cross-owner reads behind narrow definer checks.
BEGIN;

CREATE OR REPLACE FUNCTION app_private.can_read_living_companion(p_instance_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
  SELECT (SELECT auth.uid()) IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.companion_instances AS instance
    WHERE instance.id = p_instance_id
      AND (
        EXISTS (
          SELECT 1 FROM public.characters AS character_row
          WHERE character_row.user_id = (SELECT auth.uid())
            AND character_row.id IN (
              instance.owner_character_id, instance.primary_handler_character_id,
              instance.combat_controller_character_id, instance.rider_character_id)
        )
        OR (instance.owner_campaign_id IS NOT NULL AND (
          public.is_campaign_system(instance.owner_campaign_id, (SELECT auth.uid()))
          OR EXISTS (
            SELECT 1 FROM public.campaign_members AS member_row
            WHERE member_row.campaign_id = instance.owner_campaign_id
              AND member_row.user_id = (SELECT auth.uid())
          )
        ))
        OR (instance.owner_character_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.characters AS character_row
          JOIN public.campaign_members AS member_row
            ON member_row.user_id = character_row.user_id
          WHERE character_row.id = instance.owner_character_id
            AND public.is_campaign_system(member_row.campaign_id, (SELECT auth.uid()))
        ))
      )
  );
$$;

DROP POLICY IF EXISTS companion_instances_select ON public.companion_instances;
CREATE POLICY companion_instances_select ON public.companion_instances
FOR SELECT TO authenticated
USING (app_private.can_read_living_companion(id));

CREATE OR REPLACE FUNCTION app_private.can_read_regent_catch_up_options(p_unlock_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
  SELECT (SELECT auth.uid()) IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.character_regent_unlocks AS unlock_row
    JOIN public.characters AS character_row ON character_row.id = unlock_row.character_id
    WHERE unlock_row.id = p_unlock_id
      AND (
        character_row.user_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.campaign_members AS member_row
          WHERE member_row.user_id = character_row.user_id
            AND public.is_campaign_system(member_row.campaign_id, (SELECT auth.uid()))
        )
      )
  );
$$;

DROP POLICY IF EXISTS regent_catch_up_options_select ON public.regent_catch_up_options;
CREATE POLICY regent_catch_up_options_select ON public.regent_catch_up_options
FOR SELECT TO authenticated
USING (app_private.can_read_regent_catch_up_options(unlock_id));

REVOKE ALL ON FUNCTION app_private.can_read_living_companion(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.can_read_regent_catch_up_options(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION app_private.can_read_living_companion(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.can_read_regent_catch_up_options(UUID) TO authenticated;

COMMIT;
