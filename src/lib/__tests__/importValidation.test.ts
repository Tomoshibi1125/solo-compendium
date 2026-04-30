import { describe, expect, it } from "vitest";
import {
	classifyImportVersion,
	collectContainerOriginalIds,
	resolveImportedContainerId,
} from "@/lib/importValidation";

describe("importValidation — collectContainerOriginalIds", () => {
	it("returns an empty set for empty input", () => {
		expect(collectContainerOriginalIds([]).size).toBe(0);
	});

	it("collects only ids of rows flagged is_container=true", () => {
		const rows = [
			{ id: "container-1", is_container: true, name: "Backpack" },
			{ id: "item-1", is_container: false, name: "Sword" },
			{ id: "item-2", name: "Potion" }, // is_container missing → not a container
			{ id: "container-2", is_container: true, name: "Pouch" },
		];
		const result = collectContainerOriginalIds(rows);
		expect(result.has("container-1")).toBe(true);
		expect(result.has("container-2")).toBe(true);
		expect(result.has("item-1")).toBe(false);
		expect(result.has("item-2")).toBe(false);
		expect(result.size).toBe(2);
	});

	it("ignores rows with missing or non-string ids", () => {
		const rows = [
			{ id: null, is_container: true },
			{ id: 42, is_container: true },
			{ id: "", is_container: true },
			{ id: "ok", is_container: true },
		];
		const result = collectContainerOriginalIds(rows);
		expect(result.size).toBe(1);
		expect(result.has("ok")).toBe(true);
	});

	it("treats truthy non-true values as NOT containers (strict equality)", () => {
		const rows = [
			{ id: "x", is_container: 1 }, // not literal true
			{ id: "y", is_container: "true" }, // string, not bool
		];
		expect(collectContainerOriginalIds(rows).size).toBe(0);
	});
});

describe("importValidation — resolveImportedContainerId", () => {
	const idMap = new Map([
		["old-cont-1", "new-cont-1"],
		["old-item-1", "new-item-1"],
	]);
	const containerSet = new Set(["old-cont-1"]);

	it("returns the new id when target is a known container", () => {
		expect(resolveImportedContainerId("old-cont-1", containerSet, idMap)).toBe(
			"new-cont-1",
		);
	});

	it("returns null when target is not a flagged container (orphan/non-container)", () => {
		// "old-item-1" is in idMap but NOT in container set → drop the ref
		expect(
			resolveImportedContainerId("old-item-1", containerSet, idMap),
		).toBeNull();
	});

	it("returns null when target id is unknown to both sets", () => {
		expect(
			resolveImportedContainerId("missing", containerSet, idMap),
		).toBeNull();
	});

	it("returns null for null/undefined/empty container id", () => {
		expect(resolveImportedContainerId(null, containerSet, idMap)).toBeNull();
		expect(
			resolveImportedContainerId(undefined, containerSet, idMap),
		).toBeNull();
		expect(resolveImportedContainerId("", containerSet, idMap)).toBeNull();
	});

	it("returns null when the container is in the set but missing from idMap", () => {
		// Edge case: container existed in export but slipped through id map
		const orphanedContainerSet = new Set(["unmapped-cont"]);
		expect(
			resolveImportedContainerId("unmapped-cont", orphanedContainerSet, idMap),
		).toBeNull();
	});
});

describe("importValidation — classifyImportVersion", () => {
	it("returns matches=true for an exact version match", () => {
		const status = classifyImportVersion({ version: "2.4" }, "2.4");
		expect(status.matches).toBe(true);
		expect(status.importedVersion).toBe("2.4");
	});

	it("returns matches=false for a different version", () => {
		const status = classifyImportVersion({ version: "2.0" }, "2.4");
		expect(status.matches).toBe(false);
		expect(status.importedVersion).toBe("2.0");
	});

	it("treats missing version as null/non-matching", () => {
		const status = classifyImportVersion({}, "2.4");
		expect(status.matches).toBe(false);
		expect(status.importedVersion).toBeNull();
	});

	it("treats non-string version (e.g. number 2.4) as null", () => {
		const status = classifyImportVersion(
			{ version: 2.4 } as unknown as { version: unknown },
			"2.4",
		);
		expect(status.importedVersion).toBeNull();
		expect(status.matches).toBe(false);
	});

	it("trims whitespace from version strings", () => {
		const status = classifyImportVersion({ version: "  2.4  " }, "2.4");
		expect(status.importedVersion).toBe("2.4");
		expect(status.matches).toBe(true);
	});

	it("treats empty version string as null", () => {
		const status = classifyImportVersion({ version: "   " }, "2.4");
		expect(status.importedVersion).toBeNull();
		expect(status.matches).toBe(false);
	});
});
