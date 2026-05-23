const fs = require("fs");
const files = [
	"src/data/compendium/spells/rank-d.ts",
	"src/data/compendium/spells/supplemental.ts",
	"src/data/compendium/powers-core.ts",
	"src/data/compendium/powers-supplemental.ts",
	"src/data/compendium/techniques-core.ts",
	"src/data/compendium/techniques-supplemental.ts",
];

let totalEntries = 0;
for (const f of files) {
	if (!fs.existsSync(f)) {
		console.log(f, ": NOT FOUND");
		continue;
	}
	const c = fs.readFileSync(f, "utf-8");
	const ids = (c.match(/\bid:\s*["']/g) || []).length;
	const lines = c.split("\n").length;
	console.log(
		f,
		":",
		ids,
		"entries,",
		lines,
		"lines, size:",
		Math.round(c.length / 1024) + "KB",
	);
	totalEntries += ids;
}
console.log("\nTotal entries:", totalEntries);
