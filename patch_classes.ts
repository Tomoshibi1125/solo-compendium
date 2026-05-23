import * as fs from "fs";

function updateFile(path: string) {
	let content = fs.readFileSync(path, "utf-8");

	// Add classes?: string[] | null; to interface StaticCompendiumEntry
	if (!content.includes("classes?: string[] | null;")) {
		content = content.replace(
			/(export interface StaticCompendiumEntry \{[\s\S]*?tags\?: string\[\] \| null;)/,
			"$1\n\tclasses?: string[] | null;",
		);
	}

	if (path.includes("staticDataProvider.ts")) {
		// Fix transformSpell
		if (!content.includes("classes: classes,")) {
			content = content.replace(
				/(tags: \[spell\.type, spell\.rank, school, \.\.\.classes\]\.filter\(\n\s*Boolean,\n\s*\) as string\[\],)/g,
				"$1\n\t\tclasses: classes,",
			);
		}

		// Fix getPowers
		if (!content.includes("classes: power.classes,")) {
			content = content.replace(
				/(tags: \["power", power\.type, power\.rarity\]\.filter\(Boolean\) as string\[\],)/g,
				"$1\n\t\t\tclasses: (power as any).classes || [],",
			);
		}

		// Fix getTechniques
		if (!content.includes("classes: technique.classes,")) {
			content = content.replace(
				/(tags: \["technique", technique\.type, technique\.rarity\]\.filter\(\n\s*Boolean,\n\s*\) as string\[\],)/g,
				"$1\n\t\t\tclasses: (technique as any).classes || [],",
			);
		}
	}

	fs.writeFileSync(path, content);
	console.log(`Updated ${path}`);
}

[
	"src/data/compendium/staticDataProvider.ts",
	"src/data/compendium/providers/index.ts",
	"src/data/compendium/providers/types.ts",
].forEach(updateFile);
