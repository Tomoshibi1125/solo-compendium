/**
 * One-off: full-purge the compendium_* content mirror tables so the subsequent
 * sync-static-to-db run produces EXACT parity with static (the delete-by-name
 * sync leaves orphaned rows from years of old imports — SL/PHB/SRD/System
 * Ascendant/etc.). These tables are admin/import-tool-only, fully regenerable
 * from static, hold no user data (homebrew lives in homebrew_content), and are
 * leaf tables — safe to empty. Run BEFORE `tsx scripts/sync-static-to-db.ts`.
 *
 *   node scripts/purge-compendium-tables.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env") });

const url = process.env.VITE_SUPABASE_URL || "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!url || !key) {
	console.error("Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
	process.exit(1);
}
const supabase = createClient(url, key, {
	auth: { autoRefreshToken: false, persistSession: false },
});

// job_paths FIRST (FK → compendium_jobs); the rest are leaf content tables.
const TABLES = [
	"compendium_job_paths",
	"compendium_jobs",
	"compendium_Anomalies",
	"compendium_spells",
	"compendium_runes",
	"compendium_equipment",
	"compendium_powers",
	"compendium_artifacts",
	"compendium_tattoos",
	"compendium_shadow_soldiers",
	"compendium_locations",
	"compendium_backgrounds",
	"compendium_regents",
	"compendium_conditions",
	"compendium_feats",
	"compendium_skills",
	"compendium_relics",
	"compendium_techniques",
	"compendium_sigils",
	"compendium_pantheon",
];

let failed = 0;
for (const t of TABLES) {
	// delete-all: every row has a non-null name (pantheon included)
	const { error, count } = await supabase
		.from(t)
		.delete({ count: "exact" })
		.not("name", "is", null);
	if (error) {
		console.error(`  [${t}] DELETE failed: ${error.message}`);
		failed++;
	} else {
		console.log(`  [${t}] purged ${count ?? "?"} rows`);
	}
}
console.log(
	failed === 0 ? "PURGE COMPLETE (0 errors)" : `PURGE had ${failed} errors`,
);
process.exit(failed === 0 ? 0 : 1);
