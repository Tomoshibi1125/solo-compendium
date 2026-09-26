-- The older Regent unlock SELECT policy also traverses restricted campaign
-- link tables. Keep the reviewed roster policy name while using the scoped
-- actor-bound helper from the offer migration.
BEGIN;

DROP POLICY IF EXISTS regent_unlock_grants_select
  ON public.character_regent_unlock_grants;
DROP POLICY IF EXISTS campaign_managers_read_character_regent_unlock_grants
  ON public.character_regent_unlock_grants;
CREATE POLICY campaign_managers_read_character_regent_unlock_grants
  ON public.character_regent_unlock_grants FOR SELECT TO authenticated
  USING (app_private.regent_offer_readable(character_id));

DROP POLICY IF EXISTS regent_unlocks_select
  ON public.character_regent_unlocks;
CREATE POLICY regent_unlocks_select
  ON public.character_regent_unlocks FOR SELECT TO authenticated
  USING (app_private.regent_offer_readable(character_id));

COMMIT;
