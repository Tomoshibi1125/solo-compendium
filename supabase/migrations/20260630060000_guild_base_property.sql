-- Guild Base Property: the HQ a guild owns.
--
-- A guild owns ONE base property (one of the pre-built bases, or the buildable
-- "Cleared Lot"). Like base_facilities/guild_skills from the 2F migration, it is
-- stored on the guild row rather than in a new table, so the existing leader/
-- vice-only guilds UPDATE RLS already governs who may buy or relocate the base —
-- no new table or policy surface is introduced.
--
--   base_property : text guild-base id (e.g. "base-vermillion-spire"), or NULL
--                   when the guild has not yet acquired a home. Buying a base
--                   installs its bundled facility tiers into base_facilities.

ALTER TABLE public.guilds
  ADD COLUMN IF NOT EXISTS base_property TEXT;
