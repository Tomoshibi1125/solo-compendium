-- Phase 4d: drop the dead shadow_energy_* columns from public.characters.
--
-- Owner-approved (drop, not rename). These two integer columns were a placeholder for a
-- persisted summoning counter that was never wired to any reader; the Umbral Regent
-- energy economy is now DERIVED in code (src/lib/umbralEnergy.ts, Phase 4a), so the
-- columns only ever held stale zeros. Destructive + irreversible (the column data is
-- discarded) — intended.
--
-- The columns are exposed through the public.user_characters view, which therefore has
-- to be dropped and recreated. The recreated view preserves EXACTLY:
--   * security_invoker = on  -- WITHOUT this the view runs with the owner's rights and
--       BYPASSES row-level security on characters/profiles (a data-exposure bug). Do
--       not remove this option.
--   * the full original column list, verbatim, minus the two energy columns,
--   * GRANT ALL to the PostgREST roles (the exact privilege set the view had).
-- Verified before writing: no other view / matview / function depends on user_characters.
--
-- NOTE: deploy-coupled. The currently-deployed frontend still inserts
-- shadow_energy_current into characters, so apply this together with the frontend
-- deploy (both ship in the same commit).

DROP VIEW public.user_characters;

ALTER TABLE public.characters
	DROP COLUMN IF EXISTS shadow_energy_current,
	DROP COLUMN IF EXISTS shadow_energy_max;

CREATE VIEW public.user_characters WITH (security_invoker = on) AS
SELECT
	c.id,
	c.user_id,
	c.name,
	c.level,
	c.job,
	c.path,
	c.background,
	c.proficiency_bonus,
	c.armor_class,
	c.speed,
	c.initiative,
	c.hp_current,
	c.hp_max,
	c.hp_temp,
	c.hit_dice_current,
	c.hit_dice_max,
	c.hit_dice_size,
	c.rift_favor_current,
	c.rift_favor_max,
	c.rift_favor_die,
	c.saving_throw_proficiencies,
	c.skill_proficiencies,
	c.skill_expertise,
	c.armor_proficiencies,
	c.weapon_proficiencies,
	c.tool_proficiencies,
	c.conditions,
	c.exhaustion_level,
	c.notes,
	c.appearance,
	c.backstory,
	c.portrait_url,
	c.created_at,
	c.updated_at,
	c.monarch_overlays,
	c.sovereign_id,
	c.share_token,
	c.experience,
	c.regent_overlays,
	c.gemini_state,
	c.active_sovereign_id,
	c.death_save_successes,
	c.death_save_failures,
	c.stable,
	c.senses,
	c.resistances,
	c.immunities,
	c.vulnerabilities,
	c.condition_immunities,
	c.base_class,
	c.str,
	c.agi,
	c.vit,
	c."int",
	c.sense,
	c.pre,
	c.languages,
	c.job_id,
	c.path_id,
	c.background_id,
	c.sheet_theme,
	c.sheet_backdrop,
	c.sheet_accent,
	c.derived_stats_cached_at,
	c.hp_max_override,
	up.email AS user_email,
	up.display_name AS user_name,
	up.role AS user_role
FROM characters c
	JOIN profiles up ON c.user_id = up.id;

GRANT ALL ON public.user_characters TO anon, authenticated, service_role;
