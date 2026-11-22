-- Regent oversight uses the campaign roster, including characters attached
-- through campaign membership without a separate share row.
BEGIN;

DROP POLICY IF EXISTS regent_catch_up_options_select ON public.regent_catch_up_options;
CREATE POLICY regent_catch_up_options_select ON public.regent_catch_up_options
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.character_regent_unlocks AS unlock_row
    JOIN public.characters AS character_row ON character_row.id = unlock_row.character_id
    WHERE unlock_row.id = regent_catch_up_options.unlock_id
      AND (
        character_row.user_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.campaign_members AS member_row
          WHERE member_row.user_id = character_row.user_id
            AND public.is_campaign_system(member_row.campaign_id, (SELECT auth.uid()))
        )
      )
  )
);

COMMIT;
