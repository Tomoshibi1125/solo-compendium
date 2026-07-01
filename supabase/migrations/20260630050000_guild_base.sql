-- Guild Base: facilities + the guild-skills tree.
--
-- Stored as JSONB on the guild row (like funds/contribution from the 2B migration)
-- rather than as separate tables, so the existing leader/vice-only guilds UPDATE
-- RLS already governs who may build/upgrade facilities and unlock skills — no new
-- table or policy surface is introduced.
--
--   base_facilities : { "<facility_id>": <built_tier_int>, ... }  (0/absent = not built)
--   guild_skills    : [ "<skill_id>", ... ]                       (unlocked guild skills)

ALTER TABLE public.guilds
  ADD COLUMN IF NOT EXISTS base_facilities JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS guild_skills JSONB NOT NULL DEFAULT '[]'::jsonb;
