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

async function testInsert() {
	console.log("Testing insert into compendium_equipment...");
	const { error } = await supabase.from("compendium_equipment").insert({
		name: `Test Item ${Date.now()}`,
		description: "Test",
		equipment_type: "Gear",
		rarity: "Common",
		cost_credits: 0,
		weight: 0,
		display_name: "Test Item",
	});

	if (error) {
		console.error("Insert error:", error.message);
		console.error("Full error details:", JSON.stringify(error, null, 2));
	} else {
		console.log("Successfully inserted test item.");
	}
}

testInsert().catch(console.error);
