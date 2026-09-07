import { describe, expect, it } from "vitest";
import { staticDataProvider } from "@/data/compendium/providers";
import {
	buildCanonicalRegistry,
	type CanonicalEntryRecord,
	type CompendiumSourceDescriptor,
	canonicalCategoryByPublicType,
	canonicalProviderMethodByType,
	canonicalPublicEntryTypes,
	compendiumCategories,
	compendiumCategoryDefinitions,
	compendiumLineageRegistry,
	compendiumProviderMethods,
	compendiumSourceRegistry,
	createCompendiumCandidate,
	mergeCanonicalCandidates,
	providerBackedCompendiumCategories,
} from "@/data/compendium/registry";

const source = (id: string, ordinal: number): CompendiumSourceDescriptor => ({
	id,
	category: "items",
	modulePath: `synthetic/${id}.ts`,
	exportName: "entries",
	role: ordinal === 0 ? "authoritative" : "supplemental",
	origin: "homebrew",
	loadPolicy: "eager",
	sourceBook: "Rift Ascendant Canon",
	lineage: [],
	description: `Synthetic source ${id}`,
});

const candidate = (id: string, ordinal: number, raw: CanonicalEntryRecord) =>
	createCompendiumCandidate("items", source(id, ordinal), raw, 0, ordinal);

describe("universal compendium registry inventory", () => {
	it("registers every category, provider method, public alias, and source exactly once", () => {
		expect(Object.keys(compendiumCategoryDefinitions).sort()).toEqual(
			[...compendiumCategories].sort(),
		);
		expect(
			new Set(compendiumSourceRegistry.map((entry) => entry.id)).size,
		).toBe(compendiumSourceRegistry.length);

		const providerDefinitions = providerBackedCompendiumCategories.map(
			(category) => compendiumCategoryDefinitions[category].providerMethod,
		);
		expect(new Set(providerDefinitions)).toEqual(
			new Set(compendiumProviderMethods),
		);
		for (const method of compendiumProviderMethods) {
			expect(typeof staticDataProvider[method]).toBe("function");
		}

		for (const publicType of canonicalPublicEntryTypes) {
			const category = canonicalCategoryByPublicType[publicType];
			expect(compendiumCategoryDefinitions[category].publicTypes).toContain(
				publicType,
			);
			expect(canonicalProviderMethodByType[publicType]).toBe(
				compendiumCategoryDefinitions[category].providerMethod,
			);
		}

		const sourceById = new Map(
			compendiumSourceRegistry.map((entry) => [entry.id, entry]),
		);
		for (const category of compendiumCategories) {
			const definition = compendiumCategoryDefinitions[category];
			expect(definition.sourceIds.length).toBeGreaterThan(0);
			for (const sourceId of definition.sourceIds) {
				expect(sourceById.get(sourceId)?.category).toBe(category);
			}
		}
		for (const registered of compendiumSourceRegistry) {
			expect(
				compendiumCategoryDefinitions[registered.category].sourceIds,
			).toContain(registered.id);
			for (const parent of registered.lineage) {
				if (parent.startsWith("src/") || parent.endsWith("/*")) continue;
				expect(
					sourceById.has(parent),
					`${registered.id} has unregistered lineage parent ${parent}`,
				).toBe(true);
			}
		}

		const lineageIds = new Set(
			compendiumLineageRegistry.map((lineage) => lineage.id),
		);
		expect(lineageIds.size).toBe(compendiumLineageRegistry.length);
		for (const lineage of compendiumLineageRegistry) {
			expect(lineage.independentEvidence).toBe(false);
			for (const inputId of lineage.inputIds) {
				expect(
					sourceById.has(inputId) || lineageIds.has(inputId),
					`${lineage.id} has unknown input ${inputId}`,
				).toBe(true);
			}
		}
	});

	it("loads every eager source, preserves provenance, and resolves all structured references", async () => {
		const registry = await buildCanonicalRegistry();
		const eagerSourceIds = compendiumSourceRegistry
			.filter((entry) => entry.loadPolicy === "eager")
			.map((entry) => entry.id);
		expect(new Set(registry.loadedSourceIds)).toEqual(new Set(eagerSourceIds));
		expect(registry.candidateCount).toBeGreaterThan(4_000);
		expect(registry.entryCount).toBeGreaterThan(3_500);
		expect(registry.references.length).toBeGreaterThan(0);
		expect(
			registry.references.filter(
				(reference) =>
					reference.required &&
					(reference.matchedBy === "none" ||
						reference.matchedBy === "ambiguous"),
			),
		).toHaveLength(0);

		for (const category of compendiumCategories) {
			for (const entry of registry.entries[category]) {
				expect(entry.provenance.category).toBe(category);
				expect(entry.provenance.sourceIds.length).toBeGreaterThan(0);
				expect(entry.sourceLineage.length).toBeGreaterThan(0);
			}
		}

		// Current known debt is observable rather than silently last-wins: all
		// unresolved foundation conflicts are duplicate item names with distinct ids.
		expect(registry.blockingConflicts.length).toBeGreaterThan(0);
		expect(
			registry.blockingConflicts.every(
				(conflict) =>
					conflict.category === "items" &&
					conflict.kind === "identity-collision",
			),
		).toBe(true);
	}, 30_000);
});

describe("completeness-first canonical merge", () => {
	it("fills missing fields recursively, unions only declared set fields, and records field provenance", () => {
		const result = mergeCanonicalCandidates("items", [
			candidate("source-a", 0, {
				id: "item-one",
				name: "Item One",
				description: "Complete description.",
				mechanics: { attack: { bonus: 1 } },
				tags: ["weapon"],
			}),
			candidate("source-b", 1, {
				id: "item-one",
				name: "Item One",
				effects: { primary: "A distinct effect." },
				mechanics: { attack: { damage: "1d8" } },
				tags: ["awakened"],
			}),
		]);

		expect(result.conflicts).toHaveLength(0);
		expect(result.entries).toHaveLength(1);
		expect(result.entries[0].value).toMatchObject({
			description: "Complete description.",
			effects: { primary: "A distinct effect." },
			mechanics: { attack: { bonus: 1, damage: "1d8" } },
			tags: ["weapon", "awakened"],
		});
		expect(
			result.entries[0].provenance.fields["mechanics.attack"].operation,
		).toBe("object-merge");
		expect(result.entries[0].provenance.fields.tags.operation).toBe(
			"declared-union",
		);
	});

	it("blocks incompatible claims until a reviewed explicit resolution is supplied", () => {
		const candidates = [
			candidate("source-a", 0, {
				id: "item-one",
				name: "Item One",
				description: "First mechanical claim.",
			}),
			candidate("source-b", 1, {
				id: "item-one",
				name: "Item One",
				description: "Contradictory mechanical claim.",
			}),
		];
		const unresolved = mergeCanonicalCandidates("items", candidates);
		const conflict = unresolved.conflicts.find(
			(entry) => entry.fieldPath === "description",
		);
		expect(conflict).toMatchObject({
			kind: "field-disagreement",
			blocking: true,
			status: "unresolved",
		});

		const resolved = mergeCanonicalCandidates("items", candidates, [
			{
				conflictId: conflict?.id ?? "missing",
				selectedSourceId: "source-b",
				rationale: "Reviewed against the authored sourcebook passage.",
				reviewedBy: "canon-review",
			},
		]);
		expect(
			resolved.conflicts.find((entry) => entry.id === conflict?.id),
		).toMatchObject({ blocking: false, status: "resolved" });
		expect(resolved.entries[0].value.description).toBe(
			"Contradictory mechanical claim.",
		);
		expect(resolved.entries[0].provenance.fields.description.operation).toBe(
			"explicit-resolution",
		);
	});

	it("keeps same-name distinct-id records separate and emits one identity conflict", () => {
		const result = mergeCanonicalCandidates("items", [
			candidate("source-a", 0, {
				id: "item-one-a",
				name: "Shared Name",
				description: "First item.",
			}),
			candidate("source-b", 1, {
				id: "item-one-b",
				name: "Shared Name",
				description: "Second item.",
			}),
		]);
		expect(result.entries).toHaveLength(2);
		expect(result.conflicts).toHaveLength(1);
		expect(result.conflicts[0]).toMatchObject({
			kind: "identity-collision",
			blocking: true,
		});
	});
});
