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
async function applyMigration() {
    console.log("=== Applying Artifacts Table Migration ===");
    const sql = `
        CREATE TABLE IF NOT EXISTS public.compendium_artifacts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            name TEXT NOT NULL,
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
            CONSTRAINT compendium_artifacts_name_unique UNIQUE (name)
        );

        ALTER TABLE public.compendium_artifacts ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Enable read access for all users" ON public.compendium_artifacts;
        CREATE POLICY "Enable read access for all users" ON public.compendium_artifacts FOR SELECT USING (true);

        CREATE INDEX IF NOT EXISTS compendium_artifacts_name_idx ON public.compendium_artifacts (name);
        CREATE INDEX IF NOT EXISTS compendium_artifacts_type_idx ON public.compendium_artifacts (type);
        CREATE INDEX IF NOT EXISTS compendium_artifacts_rarity_idx ON public.compendium_artifacts (rarity);
    `;
    const { error } = await supabase.rpc("exec_sql", { sql_string: sql });
    if (error) {
        console.error("Error applying artifacts migration:", error.message);
    }
    else {
        console.log("Successfully created compendium_artifacts table.");
    }
    console.log("=== Migration Complete ===");
}
applyMigration().catch(console.error);
