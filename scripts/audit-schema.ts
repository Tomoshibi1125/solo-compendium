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

async function auditSchema() {
  const tables = [
    "compendium_monsters",
    "compendium_runes",
    "compendium_backgrounds",
    "compendium_items",
    "compendium_tattoos"
  ];

  for (const table of tables) {
    console.log(`Auditing ${table}...`);
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      console.error(`  Error: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`  Columns: ${Object.keys(data[0]).join(", ")}`);
    } else {
      console.log(`  Table empty, fetching schema via RPC if possible...`);
      // Fallback: check if we can get any column names via a failed request
      const { error: schemaError } = await supabase.from(table).insert({}).select();
      if (schemaError) {
        console.log(`  Schema hint from error: ${schemaError.message}`);
      }
    }
  }
}

auditSchema().catch(console.error);
