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

async function testRpc() {
	console.log("Testing RPC 'exec_sql'...");
	const { data, error } = await supabase.rpc("exec_sql", {
		sql_string: "SELECT 1",
	});

	if (error) {
		console.error("RPC Error:", JSON.stringify(error, null, 2));
		if (error.message.includes("Could not find the function")) {
			console.log(
				"\n>>> ACTION REQUIRED: You MUST create the 'exec_sql' RPC in the Supabase SQL Editor. <<<",
			);
		}
	} else {
		console.log("RPC 'exec_sql' is working correctly.");
	}
}

testRpc().catch(console.error);
