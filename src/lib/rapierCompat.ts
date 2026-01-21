import * as RAPIER from '@dimforge/rapier3d';

export * from '@dimforge/rapier3d';
export default RAPIER;

// Compatibility shim for libraries expecting the compat init() export.
export async function init(..._args: unknown[]) {
  return undefined;
}
