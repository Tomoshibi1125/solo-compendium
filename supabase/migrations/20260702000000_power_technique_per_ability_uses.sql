-- Per-ability "X per rest" use economy for powers and techniques.
--
-- 5e SRD 5.1 alignment: only cantrip-level (level 0) abilities are at-will.
-- Everything above cantrip level is a limited resource. Casters keep spell
-- slots; at-will martial jobs (no spell slots) instead track leveled powers and
-- techniques per-ability: uses_max = primary-ability modifier + proficiency
-- bonus, recharging on a short rest (tiers 1-3) or long rest (tiers 4+).
--
-- character_spells already carries uses_max / uses_current / recharge (see the
-- spell-uses columns), and restSystem.ts already recharges them by rest type.
-- This brings character_powers and character_techniques to the same shape so the
-- rest engine and the sheet can track them the same way.
--
-- Self-applying / idempotent: safe to re-run. Columns are nullable; a NULL
-- uses_max means "untracked / unlimited" (cantrips, slot-cast jobs, at-will
-- overrides), so existing rows keep their current behaviour until reseeded.

ALTER TABLE public.character_powers
	ADD COLUMN IF NOT EXISTS uses_max INTEGER,
	ADD COLUMN IF NOT EXISTS uses_current INTEGER,
	ADD COLUMN IF NOT EXISTS recharge TEXT;

ALTER TABLE public.character_techniques
	ADD COLUMN IF NOT EXISTS uses_max INTEGER,
	ADD COLUMN IF NOT EXISTS uses_current INTEGER,
	ADD COLUMN IF NOT EXISTS recharge TEXT;
