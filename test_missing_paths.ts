import * as fs from "fs";

const pathsFile = fs.readFileSync("src/data/compendium/paths.ts", "utf-8");
const accessFile = fs.readFileSync("src/lib/pathAbilityAccess.ts", "utf-8");

// Use regex to find all objects with jobId or jobName and name or id.
const allPaths = [];
const lines = pathsFile.split("\n");
let currentJob = "Unknown";
let currentPath = "Unknown";

for (let i = 0; i < lines.length; i++) {
	const line = lines[i];
	const jobMatch = line.match(/jobName:\s*"([^"]+)"/);
	if (jobMatch) currentJob = jobMatch[1];

	// Some paths use job_name instead of jobName
	const jobNameMatch = line.match(/job_name:\s*"([^"]+)"/);
	if (jobNameMatch) currentJob = jobNameMatch[1];

	// Path name is inside the "name:" field
	const nameMatch = line.match(/\s+name:\s*"([^"]+)"/);
	if (nameMatch && !line.includes("job_name")) {
		currentPath = nameMatch[1];
		if (
			currentPath.startsWith("Path of") ||
			currentPath.startsWith("Design:")
		) {
			allPaths.push({ job: currentJob, path: currentPath });
		}
	}
}

const grantedPaths = new Set();
const grantLines = accessFile.split("\n");
let gJob = "";
let gPath = "";

for (const line of grantLines) {
	const jobMatch = line.match(/jobName:\s*"([^"]+)"/);
	if (jobMatch) gJob = jobMatch[1];

	const pathMatch = line.match(/pathName:\s*"([^"]+)"/);
	if (pathMatch) {
		gPath = pathMatch[1];
		grantedPaths.add(gJob + ":" + gPath);
	}
}

console.log("Total Paths:", allPaths.length);
console.log("Granted Paths:", grantedPaths.size);

const missingPaths = allPaths.filter(
	(p) => !grantedPaths.has(p.job + ":" + p.path),
);
console.log("\nMissing Paths:");
for (const p of missingPaths) {
	console.log(`- ${p.job}: ${p.path}`);
}
