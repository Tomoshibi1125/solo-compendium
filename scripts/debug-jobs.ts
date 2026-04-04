import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env") });

const supabase = createClient(
	process.env.VITE_SUPABASE_URL || "",
	process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "",
);

async function main() {
	const { data, error } = await supabase
		.from("compendium_jobs")
		.select("id, name");
	if (error) console.error(error);
	else console.log(JSON.stringify(data, null, 2));
}
main();
