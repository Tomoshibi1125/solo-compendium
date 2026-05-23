import * as fs from "fs";
import * as ts from "typescript";

const code = fs.readFileSync("src/data/compendium/jobs.ts", "utf-8");
const sourceFile = ts.createSourceFile(
	"jobs.ts",
	code,
	ts.ScriptTarget.Latest,
	true,
);

let output = "";
function visit(node: any) {
	if (ts.isObjectLiteralExpression(node)) {
		let name = "";
		let hitDie = "";
		const abilities: string[] = [];
		let hasSpells = false;
		let hasPowers = false;

		for (const prop of node.properties) {
			if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
				if (prop.name.text === "name" && ts.isStringLiteral(prop.initializer))
					name = prop.initializer.text;
				if (prop.name.text === "hitDie" && ts.isStringLiteral(prop.initializer))
					hitDie = prop.initializer.text;
				if (
					prop.name.text === "primaryAbility" &&
					ts.isStringLiteral(prop.initializer)
				)
					abilities.push(prop.initializer.text);
				if (prop.name.text === "spellbook") hasSpells = true;
				if (prop.name.text === "powersKnown") hasPowers = true;

				// Check classFeatures
				if (
					prop.name.text === "classFeatures" &&
					ts.isArrayLiteralExpression(prop.initializer)
				) {
					for (const el of prop.initializer.elements) {
						if (ts.isObjectLiteralExpression(el)) {
							for (const p of el.properties) {
								if (
									ts.isPropertyAssignment(p) &&
									ts.isIdentifier(p.name) &&
									p.name.text === "description" &&
									ts.isStringLiteral(p.initializer)
								) {
									if (
										p.initializer.text.toLowerCase().includes("cast ") ||
										p.initializer.text.toLowerCase().includes(" spells ")
									)
										hasSpells = true;
								}
							}
						}
					}
				}
			}
		}
		if (name && (hitDie || abilities.length > 0)) {
			output += `Job: ${name}\n  HitDie: ${hitDie}\n  Primary: ${abilities.join(", ")}\n  Spells: ${hasSpells}\n  Powers: ${hasPowers}\n\n`;
		}
	}
	ts.forEachChild(node, visit);
}
visit(sourceFile);
fs.writeFileSync("job_analysis.txt", output);
