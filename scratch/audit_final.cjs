const fs = require("fs");
function extractNames(file) {
	const src = fs.readFileSync(file, "utf8");
	const re = /\bname: "([^"]+)"/g;
	const names = [];
	let m;
	while ((m = re.exec(src)) !== null) {
		// Skip display_name matches
		const idx = m.index;
		if (idx > 0 && src.substring(idx - 8, idx).includes("display_")) continue;
		names.push(m[1]);
	}
	return names;
}

const spN = extractNames("src/data/compendium/spells/supplemental.ts");
const rdN = extractNames("src/data/compendium/spells/rank-d.ts");
const pwN = extractNames("src/data/compendium/powers-supplemental.ts");
const pcN = extractNames("src/data/compendium/powers-core.ts");
const tcN = extractNames("src/data/compendium/techniques-supplemental.ts");
const tccN = extractNames("src/data/compendium/techniques-core.ts");

console.log(
	"Spells:",
	spN.length + rdN.length,
	"(sup:",
	spN.length,
	"+ rank-d:",
	rdN.length + ")",
);
console.log(
	"Powers:",
	pwN.length + pcN.length,
	"(sup:",
	pwN.length,
	"+ core:",
	pcN.length + ")",
);
console.log(
	"Techniques:",
	tcN.length + tccN.length,
	"(sup:",
	tcN.length,
	"+ core:",
	tccN.length + ")",
);

const allN = [...spN, ...rdN, ...pwN, ...pcN, ...tcN, ...tccN];
console.log("TOTAL:", allN.length);

const dupes = allN.filter((n, i) => allN.indexOf(n) !== i);
if (dupes.length > 0) {
	console.log("CROSS-TYPE DUPES:", [...new Set(dupes)]);
} else {
	console.log("Cross-type name dupes: NONE ✓");
}
