-- Extend the canonical `rarity` enum from the original 5-value set
-- (common / uncommon / rare / very_rare / legendary, created in
-- 20260103121515) to the full 8-tier Rift Ascendant ladder. `epic` sits above
-- very_rare, `mythic` is the top-end relic tier above legendary, and `artifact`
-- is the apex. The app-side ladder is defined in src/types/core-rules.ts; this
-- aligns the persisted enum used by character_equipment, compendium_equipment,
-- compendium_relics, and compendium_runes.
--
-- These ADD VALUE statements are isolated in their own migration (no other DDL,
-- no use of the new labels as data) so they commit before any function or
-- insert references them — Postgres forbids using a freshly added enum label in
-- the same transaction that adds it. AFTER clauses reference only the original
-- labels (and `artifact` is appended last, landing after `mythic`) so the
-- enum's logical sort order matches the ascending ladder without referencing a
-- value added earlier in this same migration.
ALTER TYPE public.rarity ADD VALUE IF NOT EXISTS 'epic' AFTER 'very_rare';
ALTER TYPE public.rarity ADD VALUE IF NOT EXISTS 'mythic' AFTER 'legendary';
ALTER TYPE public.rarity ADD VALUE IF NOT EXISTS 'artifact';
