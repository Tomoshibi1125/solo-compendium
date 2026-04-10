import * as fs from "node:fs";
import * as path from "node:path";

const useRunesPath = path.resolve(process.cwd(), "src/hooks/useRunes.ts");
let content = fs.readFileSync(useRunesPath, "utf8");

const hooksToRemove = [
	"useCharacterRuneInscriptions",
	"useEquipmentRunes",
	"useInscribeRune",
	"useRemoveRuneInscription",
	"useToggleRuneActive",
	"useUseRune",
];

// Simple regex to match `export function HookName(...) { ... }` up to the next `export` or EOF.
// We also remove `export { useCharacterRuneInscriptions as useRunes };`
for (const hook of hooksToRemove) {
	// This regex looks for `// Fetch...` or `// Toggle...` followed by `export function XXXX` and matches until the next `// ` or EOF
	const regex = new RegExp(
		`(//[a-zA-Z0-9\\s()\\-_'"]*\\s*)?export function ${hook}\\b[\\s\\S]*?(?=\\n// |\\nexport |$)`,
		"g",
	);
	content = content.replace(regex, "");
}

content = content.replace(
	/export \{ useCharacterRuneInscriptions as useRunes \};\n/g,
	"",
);

fs.writeFileSync(useRunesPath, content, "utf8");
console.log("Successfully purged legacy rune socketing hooks from useRunes.ts");

const restSystemPath = path.resolve(process.cwd(), "src/lib/restSystem.ts");
if (fs.existsSync(restSystemPath)) {
	let restContent = fs.readFileSync(restSystemPath, "utf8");
	// Remove resetRuneUses calls from restSystem.ts
	restContent = restContent.replace(
		/\s*\/\/\s*Reset rune uses if applicable\s*try\s*\{\s*await\s*resetRuneUses\([^;]+;\s*\}\s*catch\s*\([^{]+\{\s*logger\.error\([^;]+;\s*\/\/[^\n]+\n\s*\}/g,
		"",
	);

	// Remove resetRuneUses function definition
	restContent = restContent.replace(
		/\/\*\*[\s\S]*?async function resetRuneUses[\s\S]*?\n\}\n/g,
		"",
	);
	restContent = restContent.replace(
		/import \{ calculateRuneMaxUses \} from "\.\/runeAutomation";\n/g,
		"",
	);

	fs.writeFileSync(restSystemPath, restContent, "utf8");
	console.log("Removed legacy resetRuneUses from restSystem.ts");
}
