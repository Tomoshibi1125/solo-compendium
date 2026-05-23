const fs = require("fs");
function findName(file, name) {
	return fs.readFileSync(file, "utf8").includes('name: "' + name + '"');
}
const dupes = [
	"Harmonic Shield",
	"Shadow Step",
	"Perfect Kill",
	"Nerve Strike",
	"Pressure Point Cascade",
	"Predator's Mark",
];
const files = {
	"sp-sup": "src/data/compendium/spells/supplemental.ts",
	"pw-sup": "src/data/compendium/powers-supplemental.ts",
	"pw-core": "src/data/compendium/powers-core.ts",
	"tc-sup": "src/data/compendium/techniques-supplemental.ts",
	"tc-core": "src/data/compendium/techniques-core.ts",
};
for (const d of dupes) {
	const locs = [];
	for (const [k, f] of Object.entries(files)) {
		if (findName(f, d)) locs.push(k);
	}
	console.log(d + ": " + locs.join(", "));
}
