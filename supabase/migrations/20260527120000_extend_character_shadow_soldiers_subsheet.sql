-- Q3 of Round 3 remediation: per-soldier companion sub-sheet (R7).
-- Extends the minimal `character_shadow_soldiers` schema with the fields
-- required for a DDB-style companion sub-sheet: initiative, per-soldier
-- conditions array, freeform notes, and an HP-max override for leveled
-- / bonded soldiers.

ALTER TABLE public.character_shadow_soldiers
	ADD COLUMN IF NOT EXISTS initiative INT,
	ADD COLUMN IF NOT EXISTS conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
	ADD COLUMN IF NOT EXISTS notes TEXT,
	ADD COLUMN IF NOT EXISTS max_hp_override INT,
	ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

COMMENT ON COLUMN public.character_shadow_soldiers.initiative IS
	'Per-soldier initiative score (rolled when entering combat). Null when not in combat.';
COMMENT ON COLUMN public.character_shadow_soldiers.conditions IS
	'Active conditions on this soldier (DDB parity). Array of { id, name, source?, applied_at }.';
COMMENT ON COLUMN public.character_shadow_soldiers.notes IS
	'Per-soldier freeform scratchpad — DDB companion sheet has it.';
COMMENT ON COLUMN public.character_shadow_soldiers.max_hp_override IS
	'Override base HP for leveled / bonded soldiers without homebrewing the catalog.';
