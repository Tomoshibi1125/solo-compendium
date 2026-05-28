-- F2 of May 2026 remediation plan: per-character sheet customization.
-- DDB parity — each character can carry its own visual theme + backdrop.
-- Both columns are nullable strings; values validated client-side against
-- `src/data/sheetThemes.ts`. No CHECK constraint so we can add new themes
-- without a follow-up migration.

ALTER TABLE public.characters
	ADD COLUMN IF NOT EXISTS sheet_theme TEXT DEFAULT 'cosmic-dark',
	ADD COLUMN IF NOT EXISTS sheet_backdrop TEXT,
	ADD COLUMN IF NOT EXISTS sheet_accent TEXT;

COMMENT ON COLUMN public.characters.sheet_theme IS
	'Per-character sheet visual theme. Client-validated against src/data/sheetThemes.ts.';
COMMENT ON COLUMN public.characters.sheet_backdrop IS
	'Per-character sheet backdrop URL (uploaded portrait or canonical asset).';
COMMENT ON COLUMN public.characters.sheet_accent IS
	'Optional accent color override (hex). Falls back to theme default when null.';
