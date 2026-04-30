/**
 * Import validation helpers (D&D Beyond parity #10, #13).
 *
 * Pure functions extracted from `useCharacterExportImport.ts` so the
 * import-time invariants (container reference validation, schema-version
 * compatibility) can be verified independently of the React hook surface.
 */

/**
 * Collect the set of original (export-side) row IDs that are flagged as
 * `is_container: true`. Equipment rows whose `container_id` doesn't appear
 * in this set should be treated as orphan references and nulled out at
 * import time.
 */
export function collectContainerOriginalIds(
	rows: Array<Record<string, unknown>>,
): Set<string> {
	const containerIds = new Set<string>();
	for (const item of rows) {
		const id = typeof item.id === "string" ? item.id.trim() : "";
		if (id && item.is_container === true) {
			containerIds.add(id);
		}
	}
	return containerIds;
}

/**
 * Resolve a row's `container_id` against the import id-map.
 *
 * Returns the new id only when the original target was a flagged container
 * AND has been mapped. Stale/orphan/non-container references resolve to
 * `null` so the imported row falls back to top-level (no broken FK).
 */
export function resolveImportedContainerId(
	originalContainerId: string | null | undefined,
	originalContainerIds: Set<string>,
	idMap: Map<string, string>,
): string | null {
	if (!originalContainerId) return null;
	if (!originalContainerIds.has(originalContainerId)) return null;
	return idMap.get(originalContainerId) ?? null;
}

/**
 * Determine whether an imported character package is from a different
 * export-schema version than the current writer. Used to surface a soft
 * warning to the user — import still proceeds; we just flag the version
 * skew.
 */
export interface ImportVersionStatus {
	/** Trimmed version string from the package, or null if missing. */
	importedVersion: string | null;
	/** True when the import version exactly matches the current writer. */
	matches: boolean;
}

export function classifyImportVersion(
	pkg: { version?: unknown },
	currentVersion: string,
): ImportVersionStatus {
	const raw = typeof pkg.version === "string" ? pkg.version.trim() : "";
	const importedVersion = raw.length > 0 ? raw : null;
	return {
		importedVersion,
		matches: importedVersion === currentVersion,
	};
}
