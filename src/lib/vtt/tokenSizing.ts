/**
 * Token footprint calculation shared by all VTT surfaces (Pixi stage, DOM map,
 * asset browser thumbnails, player map view).
 *
 * Industry convention (Roll20 70px cells, Foundry 100px cells, DDB Maps):
 *   tiny       0.5 × 0.5 cells
 *   small      1   × 1   cells
 *   medium     1   × 1   cells
 *   large      2   × 2   cells
 *   huge       3   × 3   cells
 *   gargantuan 4   × 4   cells
 *
 * The footprint is always derived from `gridSize × units × zoom`, never from
 * a fixed pixel constant — that was the bug that caused sandbox tokens to
 * render at ~49% of a cell when `gridSize` was larger than the legacy 48px
 * default.
 */
export type TokenSize =
	| "tiny"
	| "small"
	| "medium"
	| "large"
	| "huge"
	| "gargantuan";

export const TOKEN_GRID_UNITS: Record<TokenSize, number> = {
	tiny: 0.5,
	small: 1,
	medium: 1,
	large: 2,
	huge: 3,
	gargantuan: 4,
};

interface FootprintOverride {
	/** Per-token grid-width override (Foundry parity: e.g. a 2×3 dragon). */
	gridWidth?: number;
	/** Per-token grid-height override. Defaults to `gridWidth` if omitted. */
	gridHeight?: number;
}

/**
 * Return the rendered footprint of a token in screen pixels.
 * Always uses `gridSize × units × zoom`, preserving industry convention.
 */
export function getTokenFootprintPx(
	size: TokenSize | string | undefined,
	gridSize: number,
	zoom: number,
	override?: FootprintOverride,
): { width: number; height: number } {
	const unitsFromSize = TOKEN_GRID_UNITS[size as TokenSize] ?? 1;
	const gw = override?.gridWidth ?? unitsFromSize;
	const gh = override?.gridHeight ?? override?.gridWidth ?? unitsFromSize;
	return {
		width: gw * gridSize * zoom,
		height: gh * gridSize * zoom,
	};
}

/**
 * Square-only convenience (most tokens are square-footprint; DDB/Roll20
 * default). Callers that need non-square dimensions should use
 * `getTokenFootprintPx` directly.
 */
export function getTokenSizePx(
	size: TokenSize | string | undefined,
	gridSize: number,
	zoom: number,
	override?: FootprintOverride,
): number {
	return getTokenFootprintPx(size, gridSize, zoom, override).width;
}

/**
 * Clamp a user-supplied grid-width/height override into a sane range. Used
 * by token-editor inputs so the Warden can't accidentally configure a
 * 99×99-cell token that eats the whole scene.
 */
export function clampGridUnit(value: number): number {
	if (!Number.isFinite(value)) return 1;
	return Math.max(0.25, Math.min(20, value));
}
