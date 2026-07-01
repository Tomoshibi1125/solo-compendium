-- Extend character_extras so recruited guild NPCs can be carried onto a
-- character sheet as full combat-ready Companions.
--
-- Provenance columns (npc_id / source_guild_id / source_member_id / npc_data)
-- record where a guild-ally companion came from so a future "re-sync from
-- guild" is possible. equipment/abilities/conditions back the companion
-- combat sub-sheet; initiative gives sub-sheet parity with shadow soldiers.

ALTER TABLE public.character_extras
    ADD COLUMN IF NOT EXISTS npc_id TEXT,
    ADD COLUMN IF NOT EXISTS source_guild_id UUID,
    ADD COLUMN IF NOT EXISTS source_member_id UUID,
    ADD COLUMN IF NOT EXISTS npc_data JSONB,
    ADD COLUMN IF NOT EXISTS equipment JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS abilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS initiative INTEGER;

-- One companion row per (character, guild NPC): keep the same NPC from being
-- added to the same sheet twice. NULL npc_id (mounts/pets/manual extras) are
-- unaffected because Postgres treats NULLs as distinct in a unique index.
CREATE UNIQUE INDEX IF NOT EXISTS idx_character_extras_character_npc
    ON public.character_extras(character_id, npc_id)
    WHERE npc_id IS NOT NULL;
