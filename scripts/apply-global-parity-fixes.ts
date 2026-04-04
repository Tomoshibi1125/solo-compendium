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

async function applyGlobalFixes() {
	console.log("=== Applying Global Parity Schema Fixes ===");

	const tables = [
		"compendium_monsters",
		"compendium_spells",
		"compendium_runes",
		"compendium_backgrounds",
		"compendium_equipment",
		"compendium_jobs",
		"compendium_paths",
		"compendium_regents",
		"compendium_monarchs",
		"compendium_conditions",
		"compendium_feats",
		"compendium_skills",
		"compendium_relics",
		"compendium_powers",
		"compendium_techniques",
		"compendium_sigils",
		"compendium_tattoos",
		"compendium_shadow_soldiers",
		"compendium_locations",
	];

	let sql = "";
	for (const table of tables) {
		sql += `
            ALTER TABLE public.${table} ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb;
            ALTER TABLE public.${table} ADD COLUMN IF NOT EXISTS flavor TEXT;
            ALTER TABLE public.${table} ADD COLUMN IF NOT EXISTS lore JSONB DEFAULT '{}'::jsonb;
            ALTER TABLE public.${table} ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
            ALTER TABLE public.${table} ADD COLUMN IF NOT EXISTS image_url TEXT;
            ALTER TABLE public.${table} ADD COLUMN IF NOT EXISTS display_name TEXT;
        `;
	}

	// Special fix for items/equipment naming consistency
	sql += `
        ALTER TABLE public.compendium_equipment ADD COLUMN IF NOT EXISTS value_credits INTEGER;
        ALTER TABLE public.compendium_equipment ADD COLUMN IF NOT EXISTS weight FLOAT;
    `;

	const { error } = await supabase.rpc("exec_sql", { sql_string: sql });

	if (error) {
		console.error("Error applying global fixes:", error.message);
	} else {
		console.log(
			"Successfully applied global parity columns to all compendium tables.",
		);
	}

	console.log("=== Global Fixes Complete ===");
}

applyGlobalFixes().catch(console.error);
