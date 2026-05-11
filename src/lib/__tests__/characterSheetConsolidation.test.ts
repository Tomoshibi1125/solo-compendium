import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = resolve(here, "..", "..");

function readSrc(relativePath: string) {
	return readFileSync(resolve(srcRoot, relativePath), "utf-8");
}

function listTsxFiles(directory: string): string[] {
	return readdirSync(directory).flatMap((entry) => {
		const fullPath = join(directory, entry);
		const stat = statSync(fullPath);
		if (stat.isDirectory()) return listTsxFiles(fullPath);
		return entry.endsWith(".tsx") ? [fullPath] : [];
	});
}

describe("character sheet consolidation", () => {
	it("routes character detail pages to the single v2 sheet surface", () => {
		const appSource = readSrc("App.tsx");

		expect(appSource).toContain(
			'const CharacterSheet = lazy(\n\t() => import("./components/character-v2/CharacterSheetV2"),\n);',
		);
		expect(appSource).toContain('path="/characters/:id"');
		expect(appSource).toContain("<CharacterSheet />");
		expect(appSource).not.toContain('import("./components/CharacterSheet');
	});

	it("keeps legacy CharacterSheet modules as leaf components, not alternate pages", () => {
		const legacyDir = resolve(srcRoot, "components", "CharacterSheet");
		const legacySources = listTsxFiles(legacyDir).map((filePath) =>
			readFileSync(filePath, "utf-8"),
		);

		expect(
			legacySources.some((source) =>
				/export default function CharacterSheet\b|function CharacterSheet\b|const CharacterSheet\b/.test(
					source,
				),
			),
		).toBe(false);
	});

	it("keeps condition mutation owned by the shared page model", () => {
		const sheetSource = readSrc("components/character-v2/CharacterSheetV2.tsx");
		const modelSource = readSrc("hooks/useCharacterPageModel.ts");

		expect(sheetSource).toContain("const pm = useCharacterPageModel();");
		expect(sheetSource).toContain("characterConditions");
		expect(sheetSource).toContain("handleAddCondition");
		expect(sheetSource).toContain("handleRemoveCondition");
		expect(sheetSource).toContain("handleExhaustionChange");
		expect(sheetSource).not.toContain("const onAddCondition =");
		expect(sheetSource).not.toContain("const onRemoveCondition =");
		expect(sheetSource).not.toContain("const onExhaustionChange =");
		expect(sheetSource).not.toContain("gemini_state: {");

		expect(modelSource).toContain("characterConditions");
		expect(modelSource).toContain("persistCharacterConditions");
		expect(modelSource).toContain("handleAddCondition");
		expect(modelSource).toContain("handleRemoveCondition");
		expect(modelSource).toContain("handleExhaustionChange");
	});
});
