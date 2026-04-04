-- migration for comprehensive schema parity audit
BEGIN;

-- 1. compendium_jobs updates
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS rank TEXT;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS awakening_features JSONB DEFAULT '[]';
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS job_traits JSONB DEFAULT '[]';
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS ability_score_improvements JSONB DEFAULT '{}';
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS speed TEXT;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS hit_points_first_level TEXT;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS hit_points_higher_levels TEXT;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS spellcasting JSONB DEFAULT '{}';
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS class_features JSONB DEFAULT '[]';
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{}';
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS abilities TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Job';

-- 2. compendium_regents updates
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS rank TEXT;
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS hit_dice TEXT;
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS saving_throws TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS skill_proficiencies TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS armor_proficiencies TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS weapon_proficiencies TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS tool_proficiencies TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS class_features JSONB DEFAULT '[]';
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS spellcasting JSONB DEFAULT '{}';
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS progression_table JSONB DEFAULT '{}';
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS regent_requirements JSONB DEFAULT '{}';
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}';

-- 3. compendium_Anomalies updates
ALTER TABLE public."compendium_Anomalies" ADD COLUMN IF NOT EXISTS actions JSONB DEFAULT '[]';
ALTER TABLE public."compendium_Anomalies" ADD COLUMN IF NOT EXISTS traits JSONB DEFAULT '[]';
ALTER TABLE public."compendium_Anomalies" ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '[]';
ALTER TABLE public."compendium_Anomalies" ADD COLUMN IF NOT EXISTS legendary_actions JSONB DEFAULT '[]';

-- 4. compendium_spells updates
ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS at_higher_levels TEXT;
ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS classes TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS saving_throw_ability TEXT;
ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS has_attack_roll BOOLEAN DEFAULT FALSE;
ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS area_of_effect JSONB DEFAULT '{}';

-- 5. compendium_backgrounds updates
ALTER TABLE public.compendium_backgrounds ADD COLUMN IF NOT EXISTS suggested_characteristics JSONB DEFAULT '{}';
ALTER TABLE public.compendium_backgrounds ADD COLUMN IF NOT EXISTS dangers TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_backgrounds ADD COLUMN IF NOT EXISTS abilities TEXT[] DEFAULT '{}';

-- 6. compendium_runes updates
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS rune_category TEXT;
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS effect_type TEXT;
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS activation_action TEXT;
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS range TEXT;
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS concentration BOOLEAN DEFAULT FALSE;
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS uses_per_rest TEXT;
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS requires_level TEXT;
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS requires_job TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS caster_penalty TEXT;
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS martial_penalty TEXT;
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS passive_bonuses JSONB DEFAULT '{}';
ALTER TABLE public.compendium_runes ADD COLUMN IF NOT EXISTS effect_description TEXT;

-- 7. compendium_equipment updates
ALTER TABLE public.compendium_equipment ADD COLUMN IF NOT EXISTS cost_credits INTEGER DEFAULT 0;
ALTER TABLE public.compendium_equipment ADD COLUMN IF NOT EXISTS weight TEXT;
ALTER TABLE public.compendium_equipment ADD COLUMN IF NOT EXISTS properties TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_equipment ADD COLUMN IF NOT EXISTS sigil_slots_base INTEGER DEFAULT 0;

COMMIT;
