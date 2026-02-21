-- Follow-up lint fix: 1 missing FK index + drop remaining non-FK unused indexes
-- Date: 2026-02-21

------------------------------------------------------------------------
-- PART 1: Create missing FK index for vtt_chat_messages.whisper_to
------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_vtt_chat_messages_whisper_to
  ON public.vtt_chat_messages (whisper_to);


------------------------------------------------------------------------
-- PART 2: Drop remaining unused non-FK indexes missed in first pass
-- These are on filter/sort/search columns with zero recorded scans.
------------------------------------------------------------------------

-- Filter columns
DROP INDEX IF EXISTS public.assets_type_idx;
DROP INDEX IF EXISTS public.character_shares_expires_idx;
DROP INDEX IF EXISTS public.idx_compendium_powers_school;
DROP INDEX IF EXISTS public.idx_compendium_relics_rarity;
DROP INDEX IF EXISTS public.idx_compendium_relics_type;
DROP INDEX IF EXISTS public.idx_compendium_monsters_cr;
DROP INDEX IF EXISTS public.idx_compendium_monsters_type;
DROP INDEX IF EXISTS public.idx_compendium_monsters_gate_rank;
DROP INDEX IF EXISTS public.entity_assets_entity_idx;
DROP INDEX IF EXISTS public.idx_sovereigns_components;

-- Full-text search indexes (tsvector GIN) — unused; queries use static data
DROP INDEX IF EXISTS public.idx_compendium_jobs_search;
DROP INDEX IF EXISTS public.idx_compendium_powers_search;
DROP INDEX IF EXISTS public.idx_compendium_relics_search;
DROP INDEX IF EXISTS public.idx_compendium_monsters_search;


------------------------------------------------------------------------
-- NOTE: All remaining "unused index" warnings are on FK-covering indexes.
-- These are newly created (previous migration) or pre-existing indexes on
-- foreign-key columns. They show zero scans because no parent-side
-- DELETE/UPDATE has triggered an FK enforcement check yet. They MUST be
-- retained for correctness and will register usage as traffic grows.
-- This is expected behavior for a low-traffic / young database.
------------------------------------------------------------------------
