-- Add `languages` column to characters so job languages + player-selected
-- languages persist alongside other racial/class outputs.
--
-- Part of the Jobs-as-race+class racial parity pass — prior to this, the
-- `selectedLanguages` argument to `applyJobAwakeningTraitsToCharacter` was
-- captured by the UI but discarded (nowhere to write it).

ALTER TABLE public.characters
	ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT '{}'::text[];

COMMENT ON COLUMN public.characters.languages IS
	'Union of job.languages and player-selected languages. Populated at character creation and on job re-sync.';

-- Same column on user_characters mirror table so exports / shareable sheets
-- carry languages through.
ALTER TABLE public.user_characters
	ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT '{}'::text[];

COMMENT ON COLUMN public.user_characters.languages IS
	'Mirror of characters.languages for the user_characters public-view table.';
