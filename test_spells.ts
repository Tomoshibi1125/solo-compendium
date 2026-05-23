import { listLearnableSpells } from "./src/lib/canonicalCompendium";
import { getJobAbilityAccess } from "./src/lib/jobAbilityAccess";

async function run() {
	console.log("Job Access:", getJobAbilityAccess("Idol"));
	const spells = await listLearnableSpells({
		jobName: "Idol",
		characterLevel: 1,
	});
	console.log("Found spells for Idol:", spells.length);
	
	const cantrips = await listLearnableSpells({
		jobName: "Idol",
		characterLevel: 1,
		maxPowerLevel: 0,
	});
	console.log("Found cantrips for Idol:", cantrips.length);
}

run().catch(console.error);
