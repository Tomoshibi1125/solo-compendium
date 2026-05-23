import * as fs from "fs";

const allPaths = JSON.parse(fs.readFileSync("all_paths.json", "utf-8"));
const accessFile = fs.readFileSync("src/lib/pathAbilityAccess.ts", "utf-8");

const grantRegex = /jobName:\s*"([^"]+)",\s*pathName:\s*"([^"]+)"/g;
const grantedPaths = new Set();
let match;
while ((match = grantRegex.exec(accessFile)) !== null) {
	grantedPaths.add(match[1] + ":" + match[2]);
}

const missingPaths = allPaths.filter(
	(p) => !grantedPaths.has(p.job + ":" + p.path),
);

console.log("Total Missing Paths:", missingPaths.length);
for (const p of missingPaths) {
	console.log(`- ${p.job}: ${p.path}`);
}
