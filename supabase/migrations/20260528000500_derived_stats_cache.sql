-- ─────────────────────────────────────────────────────────────────────────
-- P0.2: Stored-derived columns → denormalized cache
-- ─────────────────────────────────────────────────────────────────────────
-- The columns `armor_class`, `speed`, `initiative`, and `hp_max` on the
-- `characters` table are *derived* values (computed from ability scores,
-- level, equipped items, features, and conditions). Storing them risked
-- silent drift when the source inputs changed but the column did not.
--
-- This migration formalizes those columns as a denormalized write-through
-- cache: the canonical character engine (`src/lib/characterEngine.ts` +
-- `src/hooks/useCharacterDerivedStats.ts`) is the single writer; the UI
-- reads from the engine output, not from these columns. The columns
-- remain so that fast queries (VTT token sync, party dashboard list
-- views, external API consumers) can avoid re-running the engine.
--
-- Two additions:
--   1. `derived_stats_cached_at` — timestamp of the last engine write.
--      Lets readers detect staleness and trigger a recompute.
--   2. `hp_max_override` — the only legitimate manual escape hatch
--      (Warden intervention, homebrew). When non-null the engine honors
--      it as the final HP max.
-- ─────────────────────────────────────────────────────────────────────────

ALTER TABLE public.characters
  ADD COLUMN IF NOT EXISTS derived_stats_cached_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS hp_max_override INT;

COMMENT ON COLUMN public.characters.derived_stats_cached_at IS
  'Timestamp of the last engine-driven write to the denormalized derived '
  'columns (armor_class, speed, initiative, hp_max). Readers may treat '
  'rows older than recent input mutations as stale and trigger a recompute.';

COMMENT ON COLUMN public.characters.hp_max_override IS
  'Manual override for hp_max (Warden intervention or homebrew). When '
  'non-null the character engine returns this value verbatim instead of '
  'the computed hp_max. Set to NULL to restore canonical derivation.';

COMMENT ON COLUMN public.characters.armor_class IS
  'DENORMALIZED CACHE — derived from equipped armor + abilities + features '
  '+ conditions by acFormulas.ts:getArmorClass. Do not write directly; '
  'use the character engine. See migration 20260528000500.';

COMMENT ON COLUMN public.characters.speed IS
  'DENORMALIZED CACHE — derived from race + job + features + encumbrance '
  '+ conditions by characterEngine.ts. Do not write directly; use the '
  'character engine. See migration 20260528000500.';

COMMENT ON COLUMN public.characters.initiative IS
  'DENORMALIZED CACHE — derived from AGI modifier + feats + conditions '
  'by characterEngine.ts. Do not write directly; use the character '
  'engine. See migration 20260528000500.';

COMMENT ON COLUMN public.characters.hp_max IS
  'DENORMALIZED CACHE — derived from hit die + level + VIT modifier + '
  'feat HP bonuses (e.g. Tough +2/level) by 5eCharacterCalculations.ts: '
  'calculateHPMax. When hp_max_override is non-null, that value is '
  'returned instead. Do not write directly; use the character engine. '
  'See migration 20260528000500.';
