/**
 * Pure geometry helpers shared by the VTT renderer (`VttPixiStage`) and the
 * orchestrator (`VTTEnhanced`) for pointer interactions: token-drag snapping,
 * ruler/measurement, and the live distance shown while dragging a token.
 *
 * No Pixi/DOM dependency, so the math is directly unit-testable.
 *
 * Distance uses the same 5e "every other diagonal counts double" approximation
 * the on-map measurement tool already used (Chebyshev distance + half the
 * diagonal overlap). It is a *display* value only and changes no game rule.
 */

export type GridCell = { gridX: number; gridY: number };

/**
 * Snap a world-space pixel position to the nearest grid cell index. `cellPx` is
 * the on-screen size of one cell (`gridSize × zoom`). Returns the origin cell
 * for a non-positive/NaN `cellPx` so callers never produce `NaN` coordinates.
 */
export function snapWorldToCell(
	worldX: number,
	worldY: number,
	cellPx: number,
): GridCell {
	if (!Number.isFinite(cellPx) || cellPx <= 0) return { gridX: 0, gridY: 0 };
	return {
		gridX: Math.round(worldX / cellPx),
		gridY: Math.round(worldY / cellPx),
	};
}

/**
 * Distance between two cells in grid units using the 5e diagonal variant
 * (first diagonal counts 1, each subsequent diagonal adds 0.5). Accepts signed
 * deltas; sign is ignored.
 */
export function gridDistanceCells(dx: number, dy: number): number {
	const adx = Math.abs(dx);
	const ady = Math.abs(dy);
	return Math.max(adx, ady) + Math.min(adx, ady) * 0.5;
}

/** The {@link gridDistanceCells} distance expressed in feet (default 5ft/cell). */
export function gridDistanceFeet(
	dx: number,
	dy: number,
	feetPerCell = 5,
): number {
	return gridDistanceCells(dx, dy) * feetPerCell;
}

/**
 * Flat-top hex distance in cells between two offset (column, row) cells using
 * the odd-q offset scheme (matches the app's "flat" hex grid). Inputs are
 * rounded to the nearest cell first.
 */
export function hexDistanceCells(
	ax: number,
	ay: number,
	bx: number,
	by: number,
): number {
	const toCube = (col: number, row: number) => {
		const q = col;
		const r = row - (col - (col & 1)) / 2;
		return { q, r, s: -q - r };
	};
	const a = toCube(Math.round(ax), Math.round(ay));
	const b = toCube(Math.round(bx), Math.round(by));
	return (Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs(a.s - b.s)) / 2;
}

/**
 * Distance in cells between two grid cells, honouring the scene's grid type.
 * Hex scenes use {@link hexDistanceCells}; everything else uses the 5e square
 * diagonal {@link gridDistanceCells}.
 */
export function cellDistance(
	ax: number,
	ay: number,
	bx: number,
	by: number,
	gridType: string,
): number {
	return gridType === "hex"
		? hexDistanceCells(ax, ay, bx, by)
		: gridDistanceCells(bx - ax, by - ay);
}

/** {@link cellDistance} expressed in feet (default 5ft/cell). */
export function cellDistanceFeet(
	ax: number,
	ay: number,
	bx: number,
	by: number,
	gridType: string,
	feetPerCell = 5,
): number {
	return cellDistance(ax, ay, bx, by, gridType) * feetPerCell;
}
