-- Phase 4c: bring the last live "shadow" domain identifiers onto canon.
--
-- The player-facing feature has been "Umbral Legion" for a while (its RLS policy is
-- even already named "Users can release their own Umbral Legion"); this renames the
-- final live DB identifier in that domain to match.
--
-- ALTER TABLE ... RENAME is a metadata-only operation: every row, index, primary/
-- unique/foreign-key constraint, and RLS policy follows automatically because they
-- reference the table by OID rather than by name. Verified before writing this:
--   * no function body references character_shadow_soldiers,
--   * no other table has an incoming FK to it,
--   * it has no triggers.
-- Constraint/index NAMES intentionally keep their old spelling — renaming them is
-- purely cosmetic and would only add failure surface to this one-shot migration.
--
-- NOTE: this rename is coupled to the frontend deploy. The application cutover ships
-- in the same commit; apply this migration and deploy the frontend together, or the
-- currently-deployed frontend's .from("character_shadow_soldiers") calls will 404.
--
-- Rollback: ALTER TABLE public.character_umbral_legionnaires
--             RENAME TO character_shadow_soldiers;
ALTER TABLE public.character_shadow_soldiers
	RENAME TO character_umbral_legionnaires;

-- Drop the dead shadow-energy placeholder functions (both overloads). They were never
-- called by the app, on either the level-int or the character-uuid signature. The
-- summoning economy is derived in code (src/lib/umbralEnergy.ts, Phase 4a) using this
-- exact 10/25/50/100/200 ladder, so the SECURITY DEFINER copies are pure redundancy.
DROP FUNCTION IF EXISTS public.calculate_shadow_energy_max(integer);
DROP FUNCTION IF EXISTS public.calculate_shadow_energy_max(uuid);
