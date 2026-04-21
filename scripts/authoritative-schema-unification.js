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
async function applyAuthoritativeFixes() {
    console.log("=== Applying Authoritative Global Parity Schema Fixes ===");
    const sql = `
        -- 0. Essential Functions
        CREATE OR REPLACE FUNCTION public.update_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        -- 1. Artifacts (New)
        CREATE TABLE IF NOT EXISTS public.compendium_artifacts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            name TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            type TEXT NOT NULL,
            rarity TEXT NOT NULL DEFAULT 'legendary',
            attunement BOOLEAN DEFAULT false,
            requirements JSONB DEFAULT '{}',
            properties JSONB DEFAULT '{}',
            abilities JSONB DEFAULT '{}',
            lore JSONB DEFAULT '{}',
            mechanics JSONB DEFAULT '{}',
            tags TEXT[] DEFAULT '{}',
            source_book TEXT DEFAULT 'System Ascendant Canon',
            image_url TEXT,
            display_name TEXT
        );

        -- 2. Equipment (Ensure modern columns)
        CREATE TABLE IF NOT EXISTS public.compendium_equipment (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            equipment_type TEXT NOT NULL,
            rarity TEXT NOT NULL DEFAULT 'Common',
            attunement BOOLEAN DEFAULT false,
            properties JSONB DEFAULT '{}',
            stats JSONB DEFAULT '{}',
            effects JSONB DEFAULT '{}',
            limitations JSONB DEFAULT '{}',
            cost_credits INTEGER DEFAULT 0,
            weight FLOAT DEFAULT 0,
            mechanics JSONB DEFAULT '{}',
            flavor TEXT,
            lore JSONB DEFAULT '{}',
            tags TEXT[] DEFAULT '{}',
            image_url TEXT,
            display_name TEXT,
            created_at TIMESTAMPTZ DEFAULT now()
        );

        -- Ensure item_type exists for backward compatibility if needed, but equipment_type is authoritative
        ALTER TABLE public.compendium_equipment ADD COLUMN IF NOT EXISTS equipment_type TEXT;

        -- 3. Monsters (Ensure parity)
        ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS flavor TEXT;
        ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS lore JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
        ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS display_name TEXT;
        ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'D';
        ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS is_boss BOOLEAN DEFAULT false;

        -- 4. Spells
        ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS flavor TEXT;
        ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS lore JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
        ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS display_name TEXT;
        ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'D';

        -- 5. Jobs & Paths
        ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS flavor TEXT;
        ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS lore JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
        ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS display_name TEXT;

        ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS flavor TEXT;
        ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS lore JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
        ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS display_name TEXT;

        -- 6. Relics (Specialized Fixes)
        ALTER TABLE public.compendium_relics ADD COLUMN IF NOT EXISTS weight FLOAT DEFAULT 0;
        ALTER TABLE public.compendium_relics ADD COLUMN IF NOT EXISTS source_book TEXT DEFAULT 'System Ascendant Canon';
        ALTER TABLE public.compendium_relics ADD COLUMN IF NOT EXISTS lore TEXT;
        ALTER TABLE public.compendium_relics ADD COLUMN IF NOT EXISTS image_url TEXT;
        ALTER TABLE public.compendium_relics ADD COLUMN IF NOT EXISTS display_name TEXT;

        -- 7. All other tables to match Base Fields
        DO $$
        DECLARE
            t text;
        BEGIN
            FOR t IN SELECT table_name 
                     FROM information_schema.tables 
                     WHERE table_schema = 'public' AND table_name LIKE 'compendium_%'
            LOOP
                EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT ''{}''::jsonb', t);
                EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS flavor TEXT', t);
                EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS lore JSONB DEFAULT ''{}''::jsonb', t);
                EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ''{}''', t);
                EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS image_url TEXT', t);
                EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS display_name TEXT', t);
            END LOOP;
        END $$;
    `;
    const { error } = await supabase.rpc("exec_sql", { sql_string: sql });
    if (error) {
        console.error("Error applying authoritative schema fixes:", error.message);
    }
    else {
        console.log("Successfully unified all compendium schemas for the 'Zero Legacy' production sync.");
    }
    console.log("=== Authoritative Fixes Complete ===");
}
applyAuthoritativeFixes().catch(console.error);
