import { paths } from "./src/data/compendium/paths.ts";
import { PATH_ABILITY_GRANTS } from "./src/lib/pathAbilityAccess.ts";

const allPaths = paths.map((p) => ({
	job: p.job_name || "Unknown",
	path: p.name,
}));
const grantedPaths = Array.from(
	new Set(PATH_ABILITY_GRANTS.map((g) => g.jobName + ":" + g.pathName)),
);

console.log("Total Paths in compendium:", allPaths.length);
console.log("Total Unique Granted Paths:", grantedPaths.length);

const missingPaths = allPaths.filter(
	(p) => !grantedPaths.includes(p.job + ":" + p.path),
);
console.log("\nMissing Paths:");
for (const p of missingPaths) {
	console.log(`- ${p.job}: ${p.path}`);
}
