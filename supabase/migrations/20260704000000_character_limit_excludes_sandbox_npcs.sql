-- Per-user character limit must count only a user's *personal* characters.
--
-- Campaign sandbox NPCs are injected into `public.characters` under the owning
-- Warden's `user_id`, tagged with a `[SANDBOX_NPC]` marker in `notes`
-- (see src/hooks/useCampaignSandboxInjector.ts). The roster and creation UI hide
-- those rows via `filterPersonalCharacters`, but the original limit trigger
-- (20260630020000) counted every row for the user — so hidden NPC rows silently
-- filled the 6-character budget, blocking creation while the roster showed 0/6.
--
-- 1. Re-count excluding `[SANDBOX_NPC]` rows so the enforced count matches what
--    the app displays.
CREATE OR REPLACE FUNCTION public.enforce_character_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.user_id IS NOT NULL
     AND (
       SELECT COUNT(*) FROM public.characters
       WHERE user_id = NEW.user_id
         AND (notes IS NULL OR notes NOT LIKE '%[SANDBOX_NPC]%')
     ) >= 6 THEN
    RAISE EXCEPTION 'Character limit reached: a user may have at most 6 characters'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

-- The trigger definition itself is unchanged (BEFORE INSERT, FOR EACH ROW) and
-- already points at this function name, so no CREATE TRIGGER is needed here.

-- 2. One-time cleanup of the dead rows: delete every `[SANDBOX_NPC]` character
--    that is no longer attached to a surviving campaign (its
--    `campaign_character_shares` link is gone or dangles to a deleted campaign).
--    NPCs still bound to a live campaign are preserved — they belong to that
--    campaign's Warden roster and are re-injectable — and step 1 already stops
--    them counting against anyone's limit. Every table referencing
--    `characters(id)` is ON DELETE CASCADE, so this removes each row and its
--    children atomically.
DELETE FROM public.characters c
WHERE c.notes LIKE '%[SANDBOX_NPC]%'
  AND NOT EXISTS (
    SELECT 1
    FROM public.campaign_character_shares s
    JOIN public.campaigns ca ON ca.id = s.campaign_id
    WHERE s.character_id = c.id
  );
