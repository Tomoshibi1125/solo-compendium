import * as RAPIER from "@dimforge/rapier3d";

export * from "@dimforge/rapier3d";

RAPIER;

// Compatibility shim for libraries expecting the compat init() export.
// biome-ignore lint/correctness/noUnusedVariables: exported for use in other modules
async function init(..._args: unknown[]) {
	return undefined;
}
