import dotenv from "dotenv";
import { getStaticCompendiumClient } from "./src/data/compendium/staticDataProvider";
import { getPowers } from "./src/lib/abilityMappings";

dotenv.config();

async function run() {
	const client = await getStaticCompendiumClient();
	const powers = await client.getPowers();
	const techniques = await client.getTechniques();

	const allMartials = [...powers, ...techniques];

	const casterTags = [
		"Mage",
		"Esper",
		"Revenant",
		"Herald",
		"Summoner",
		"Contractor",
		"Idol",
	];

	let foundViolations = 0;
	for (const item of allMartials) {
		const classes = (item as any).classes || [];
		const overlaps = classes.filter((c) => casterTags.includes(c));
		if (overlaps.length > 0) {
			console.log(
				`${item.name} has invalid caster tags: ${overlaps.join(", ")}`,
			);
			foundViolations++;
		}
	}

	console.log(`Violations found: ${foundViolations}`);
}
run();
