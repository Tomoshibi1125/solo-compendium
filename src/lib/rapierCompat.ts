// Lazy Rapier WASM loader — prevents the synchronous top-level import from
// blocking the entire React render tree when CSP or WASM support is missing.

let _rapier: typeof import("@dimforge/rapier3d") | null = null;
let _initPromise: Promise<typeof import("@dimforge/rapier3d") | null> | null =
	null;

/**
 * Lazily initialise Rapier3D.  Returns the RAPIER namespace on success,
 * or `null` when WASM cannot be compiled (e.g. restrictive CSP, unsupported
 * browser, missing .wasm file).
 */
export async function init(
	..._args: unknown[]
): Promise<typeof import("@dimforge/rapier3d") | null> {
	if (_rapier) return _rapier;

	if (!_initPromise) {
		_initPromise = import("@dimforge/rapier3d")
			.then((mod) => {
				_rapier = mod;
				return mod;
			})
			.catch((err) => {
				console.warn("[RapierCompat] WASM init failed (non-fatal):", err);
				return null;
			});
	}

	return _initPromise;
}

/**
 * Synchronous access — returns the cached module or `null` if init() hasn't
 * resolved yet.
 */
export function getRapier() {
	return _rapier;
}
