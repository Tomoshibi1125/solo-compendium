import * as fs from "fs";
import * as path from "path";

const files = [
	"src/data/compendium/powers-core.ts",
	"src/data/compendium/techniques-core.ts",
];

for (const file of files) {
	if (fs.existsSync(file)) {
		const content = fs.readFileSync(file, "utf-8");
		const matches = content.match(/display_name:\s*"([^"]+)"/g);
		if (matches) {
			for (const m of matches) {
				console.log(m.replace(/display_name:\s*"/, "").replace('"', ""));
			}
		}
	}
}
