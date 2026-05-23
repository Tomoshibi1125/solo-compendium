import * as fs from "fs";
import * as path from "path";

function walk(dir: string, callback: (path: string) => void) {
	fs.readdirSync(dir).forEach((f) => {
		const dirPath = path.join(dir, f);
		const isDirectory = fs.statSync(dirPath).isDirectory();
		isDirectory ? walk(dirPath, callback) : callback(dirPath);
	});
}

let totalFixed = 0;

walk("src/data/compendium", (file) => {
	if (!file.endsWith(".ts")) return;

	const content = fs.readFileSync(file, "utf8");
	const parts = content.split('id: "');
	let modified = false;

	for (let i = 1; i < parts.length; i++) {
		const part = parts[i];

		// Count `classes:` properties in this object literal
		const matches = [...part.matchAll(/classes:\s*\[.*?\]/g)];

		if (matches.length > 1) {
			// Replace the empty classes array `classes: [],`
			const newPart = part.replace(/\s*classes:\s*\[\],?\r?\n/g, "\n");
			if (newPart !== part) {
				parts[i] = newPart;
				modified = true;
				totalFixed++;
			}
		}
	}

	if (modified) {
		fs.writeFileSync(file, parts.join('id: "'));
		console.log(`Fixed duplicates in ${file}`);
	}
});

console.log(`Fixed ${totalFixed} duplicates total.`);
