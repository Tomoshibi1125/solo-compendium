import fs from "node:fs";
import path from "node:path";

const targetPath = path.resolve(
	"C:/Users/jjcal/Documents/solo-compendium/src/data/compendium/runes.ts",
);
let content = fs.readFileSync(targetPath, "utf8");

// 1. Regex to replace description strings
content = content.replace(
	/description:\s*"A skill granting runestone\.\s*(.*?)"/g,
	(_match, p1) => {
		return `description:\n\t\t\t"A skill granting runestone. ${p1}"`;
	},
);

// Replace the effect_description
content = content.replace(/effect_description:\s*"(.*?)"/g, (_match, p1) => {
	return `effect_description:\n\t\t\t"Permanently teaches you this ability. Once learned, it can be used once per long rest without expending a resource, or you may expend normal resources. ${p1.replace(/"/g, '\\"')} Adapts to your highest applicable attribute."`;
});

// Replace Uses Per Rest
content = content.replace(
	/uses_per_rest:\s*".*?"/g,
	'uses_per_rest: "Consumable (Permanently Learned)"',
);

// Replace Activation Action
content = content.replace(
	/activation_action:\s*".*?"/g,
	'activation_action: "Study Object"',
);

// Strip old mechanical prerequisites if they exist
content = content.replace(/\t*requirement_.*?:.*?\n/g, "");

fs.writeFileSync(targetPath, content, "utf8");
console.log("Runes refactored.");
