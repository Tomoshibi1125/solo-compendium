-- Purge legacy requirement fields from Runes table due to the "Zero Requirements" policy.
-- Also removing cross-learning multiplier configurations and job restrictions on runes themselves.

ALTER TABLE public.compendium_runes
  DROP COLUMN IF EXISTS requirement_str,
  DROP COLUMN IF EXISTS requirement_agi,
  DROP COLUMN IF EXISTS requirement_vit,
  DROP COLUMN IF EXISTS requirement_int,
  DROP COLUMN IF EXISTS requirement_sense,
  DROP COLUMN IF EXISTS requirement_pre,
  DROP COLUMN IF EXISTS requires_job,
  DROP COLUMN IF EXISTS caster_penalty,
  DROP COLUMN IF EXISTS caster_requirement_multiplier,
  DROP COLUMN IF EXISTS martial_penalty,
  DROP COLUMN IF EXISTS martial_requirement_multiplier,
  DROP COLUMN IF EXISTS passive_bonuses,
  DROP COLUMN IF EXISTS can_inscribe_on,
  DROP COLUMN IF EXISTS inscription_difficulty;
