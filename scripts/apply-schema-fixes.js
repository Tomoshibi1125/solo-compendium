import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);
async function applyFixes() {
    console.log("=== Applying Authoritative Schema Fixes ===");
    const fixes = [
        // 1. Monsters: Add image_url, is_boss, rank, monster_actions
        {
            table: "compendium_monsters",
            sql: `
        ALTER TABLE compendium_monsters ADD COLUMN IF NOT EXISTS image_url TEXT;
        ALTER TABLE compendium_monsters ADD COLUMN IF NOT EXISTS is_boss BOOLEAN DEFAULT FALSE;
        ALTER TABLE compendium_monsters ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'D';
        ALTER TABLE compendium_monsters ADD COLUMN IF NOT EXISTS monster_actions JSONB DEFAULT '[]'::jsonb;
      `,
        },
        // 2. Backgrounds: Add JSONB fields for proficiencies and equipment
        {
            table: "compendium_backgrounds",
            sql: `
        ALTER TABLE compendium_backgrounds ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'E';
        ALTER TABLE compendium_backgrounds ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Civilian';
        ALTER TABLE compendium_backgrounds ADD COLUMN IF NOT EXISTS skill_proficiencies JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE compendium_backgrounds ADD COLUMN IF NOT EXISTS tool_proficiencies JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE compendium_backgrounds ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE compendium_backgrounds ADD COLUMN IF NOT EXISTS equipment JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE compendium_backgrounds ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
      `,
        },
        // 3. Tattoos: Add comprehensive fields
        {
            table: "compendium_tattoos",
            sql: `
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS display_name TEXT;
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS image_url TEXT;
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS flavor TEXT;
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS lore TEXT;
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS system_interaction TEXT;
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common';
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS attunement BOOLEAN DEFAULT FALSE;
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS body_part TEXT;
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS effects JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS limitations JSONB DEFAULT '[]'::jsonb;
      `,
        },
        // 4. Items: Add image_url, attunement, rarity, and mechanics fields
        {
            table: "compendium_items",
            sql: `
        ALTER TABLE compendium_items ADD COLUMN IF NOT EXISTS image_url TEXT;
        ALTER TABLE compendium_items ADD COLUMN IF NOT EXISTS attunement BOOLEAN DEFAULT FALSE;
        ALTER TABLE compendium_items ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common';
        ALTER TABLE compendium_items ADD COLUMN IF NOT EXISTS properties JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE compendium_items ADD COLUMN IF NOT EXISTS effects JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE compendium_items ADD COLUMN IF NOT EXISTS limitations JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE compendium_items ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE compendium_items ADD COLUMN IF NOT EXISTS item_type TEXT;
      `,
        },
        // 5. Runes: Add rune_category, is_attunement
        {
            table: "compendium_runes",
            sql: `
        ALTER TABLE compendium_runes ADD COLUMN IF NOT EXISTS rune_category TEXT DEFAULT 'hybrid';
        ALTER TABLE compendium_runes ADD COLUMN IF NOT EXISTS is_attunement BOOLEAN DEFAULT FALSE;
      `,
        },
        // 6. Spells: Add rank, effect, higher_levels, image
        {
            table: "compendium_spells",
            sql: `
        ALTER TABLE compendium_spells ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'D';
        ALTER TABLE compendium_spells ADD COLUMN IF NOT EXISTS effect TEXT;
        ALTER TABLE compendium_spells ADD COLUMN IF NOT EXISTS higher_levels TEXT;
        ALTER TABLE compendium_spells ADD COLUMN IF NOT EXISTS image TEXT;
      `,
        },
        {
            id: "runes-effect-description-nullable",
            sql: "ALTER TABLE compendium_runes ALTER COLUMN effect_description DROP NOT NULL;",
        },
        {
            id: "tattoos-source-book",
            sql: "ALTER TABLE compendium_tattoos ADD COLUMN IF NOT EXISTS source_book TEXT;",
        },
        {
            id: "runes-drop-level-check",
            sql: "ALTER TABLE compendium_runes DROP CONSTRAINT IF EXISTS compendium_runes_rune_level_check;",
        },
    ];
    for (const fix of fixes) {
        console.log(`Applying fixes to ${fix.table}...`);
        const { error } = await supabase.rpc("exec_sql", { sql_string: fix.sql });
        if (error) {
            // If exec_sql RPC is not available, we have to use another way or warn
            console.error(`  Error applying fixes to ${fix.table}:`, error.message);
            if (error.message.includes("function exec_sql") ||
                error.message.includes("Could not find")) {
                console.log("  RPC 'exec_sql' not found. Please ensure the 'exec_sql' function is enabled in Supabase SQL Editor:");
                console.log(`
          CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
          RETURNS void AS $$
          BEGIN
            EXECUTE sql_string;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `);
            }
        }
        else {
            console.log(`  Successfully updated ${fix.table}`);
        }
    }
    console.log("=== Schema Stabilization Complete ===");
}
applyFixes().catch(console.error);
