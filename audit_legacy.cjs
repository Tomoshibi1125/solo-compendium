const fs = require("node:fs");

// Extended list: every form of legacy term that could appear in JSX or UI strings
const legacyPatterns = [
	// Quoted strings (already covered before, re-check anyway)
	'"Wisdom"', "'Wisdom'",
	'"Charisma"', "'Charisma'",
	'"Dexterity"', "'Dexterity'",
	'"Constitution"', "'Constitution'",
	'"Arcana"', "'Arcana'",
	'"History"', "'History'",
	'"Nature"', "'Nature'",
	'"Religion"', "'Religion'",
	'"Animal Handling"', "'Animal Handling'",

	// JSX text nodes (no quotes)
	">Wisdom<", ">Charisma<", ">Dexterity<", ">Constitution<",
	">Arcana<", ">History<", ">Nature<", ">Religion<", ">Animal Handling<",

	// Partial JSX text (e.g. "Wisdom modifier" or "Arcana check")
	"Wisdom modifier", "Wisdom save", "Wisdom saving", "Wisdom mod",
	"Charisma modifier", "Charisma save", "Charisma saving", "Charisma mod",
	"Dexterity modifier", "Dexterity save", "Dexterity saving", "Dexterity mod",
	"Constitution modifier", "Constitution save", "Constitution saving", "Constitution mod",
	"Arcana check", "History check", "Nature check", "Religion check", "Animal Handling check",
	"Arcana skill", "History skill", "Nature skill", "Religion skill",

	// Placeholder strings
	"placeholder=\"Wisdom", "placeholder=\"Charisma", "placeholder=\"Dexterity", "placeholder=\"Constitution",

	// Template literals (mid-string)
	"${wisdom}", "${charisma}", "${dexterity}", "${constitution}",
	"Wisdom}", "Charisma}", "Dexterity}", "Constitution}",
];

const walkSync = (dir, list) => {
	fs.readdirSync(dir).forEach((f) => {
		const fp = `${dir}/${f}`;
		if (fs.statSync(fp).isDirectory()) {
			if (!["node_modules", "dist", ".git"].includes(f)) walkSync(fp, list);
		} else if (f.endsWith(".ts") || f.endsWith(".tsx")) {
			list.push(fp);
		}
	});
	return list;
};

const files = walkSync("src", []);
const hits = {};

files.forEach((f) => {
	const content = fs.readFileSync(f, "utf8");
	legacyPatterns.forEach((term) => {
		if (content.includes(term)) {
			if (!hits[f]) hits[f] = [];
			if (!hits[f].includes(term)) hits[f].push(term);
		}
	});
});

const sorted = Object.entries(hits).sort((a, b) => a[0].localeCompare(b[0]));
sorted.forEach(([f, terms]) => console.log(`${f}:\n  - ${terms.join("\n  - ")}`));
console.log(`\nTotal files with legacy terms: ${sorted.length}`);
