-- R1 offer reads must not rely on browser SELECT privileges on the three
-- legacy campaign-to-character link tables. Keep the same owner/Warden scope.
BEGIN;

CREATE OR REPLACE FUNCTION app_private.regent_offer_readable(p_character_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT auth.uid() IS NOT NULL AND (
    app_private.actor_owns_character(p_character_id)
    OR EXISTS (
      SELECT 1 FROM (
        SELECT campaign_id FROM public.campaign_members
        WHERE character_id = p_character_id
        UNION
        SELECT campaign_id FROM public.campaign_member_characters
        WHERE character_id = p_character_id
        UNION
        SELECT campaign_id FROM public.campaign_character_shares
        WHERE character_id = p_character_id
      ) AS linked_campaign
      WHERE public.is_campaign_system(linked_campaign.campaign_id, auth.uid())
    )
  );
$$;

REVOKE ALL ON FUNCTION app_private.regent_offer_readable(UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION app_private.regent_offer_readable(UUID)
  TO authenticated;

DROP POLICY IF EXISTS regent_unlock_grants_select
  ON public.character_regent_unlock_grants;
DROP POLICY IF EXISTS campaign_managers_read_character_regent_unlock_grants
  ON public.character_regent_unlock_grants;
CREATE POLICY regent_unlock_grants_select
  ON public.character_regent_unlock_grants FOR SELECT TO authenticated
  USING (app_private.regent_offer_readable(character_id));

COMMIT;
