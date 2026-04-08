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

async function checkColumns() {
	const sql = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'compendium_equipment';
    `;
	const { data, error } = await supabase.rpc("exec_sql_return_data", {
		sql_string: sql,
	});
	// Note: exec_sql_return_data might not exist. I'll just try to select 1 row.
	const { data: row, error: selectError } = await supabase
		.from("compendium_equipment")
		.select("*")
		.limit(1);

	if (selectError) {
		console.error(
			"Error Selecting from compendium_equipment:",
			selectError.message,
		);
	} else if (row && row.length > 0) {
		console.log("Columns in compendium_equipment:", Object.keys(row[0]));
	} else {
		console.log(
			"Table compendium_equipment is empty. Cannot determine columns via select.",
		);
	}
}

checkColumns().catch(console.error);
