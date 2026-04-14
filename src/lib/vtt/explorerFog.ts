/**
 * Explorer Mode Fog Engine
 *
 * Upgrades the binary fog system to tri-state:
 *   0 = Unexplored (fully hidden, black)
 *   1 = Visible (currently in line of sight, fully revealed)
 *   2 = Previously Explored (dimmed sepia overlay, player has seen but can't currently see)
 *
 * This matches Roll20's "Advanced Fog of War" where areas players have
 * visited remain partially visible with a dim overlay when they move away.
 */

// ─── Types ──────────────────────────────────────────────────

/** 0 = unexplored, 1 = visible, 2 = previously explored */
export type FogState = 0 | 1 | 2;

export interface ExplorerFogGrid {
	/** 2D array of fog states indexed by [row][col] */
	cells: FogState[][];
	width: number;
	height: number;
}

// ─── Factory ────────────────────────────────────────────────

/**
 * Create a new fog grid initialized to fully unexplored
 */
export function createExplorerFog(
	width: number,
	height: number,
	initialState: FogState = 0,
): ExplorerFogGrid {
	const cells: FogState[][] = [];
	for (let y = 0; y < height; y++) {
		cells.push(new Array(width).fill(initialState));
	}
	return { cells, width, height };
}

/**
 * Migrate a legacy boolean[][] fogData to tri-state ExplorerFogGrid
 * true (revealed) → 1, false (hidden) → 0
 */
export function migrateFromBooleanFog(fogData: boolean[][]): ExplorerFogGrid {
	const height = fogData.length;
	const width = height > 0 ? fogData[0].length : 0;
	const cells: FogState[][] = fogData.map((row) =>
		row.map((revealed): FogState => (revealed ? 1 : 0)),
	);
	return { cells, width, height };
}

/**
 * Convert ExplorerFogGrid back to boolean[][] for backward compatibility
 * States 1 and 2 both count as "revealed" in the boolean sense
 */
export function toBooleanFog(grid: ExplorerFogGrid): boolean[][] {
	return grid.cells.map((row) => row.map((state) => state > 0));
}

// ─── Operations ─────────────────────────────────────────────

/**
 * Reveal cells (set to visible = 1)
 */
export function revealCells(
	grid: ExplorerFogGrid,
	cells: Array<{ x: number; y: number }>,
): ExplorerFogGrid {
	const next = cloneGrid(grid);
	for (const { x, y } of cells) {
		if (isInBounds(next, x, y)) {
			next.cells[y][x] = 1;
		}
	}
	return next;
}

/**
 * Hide cells (set currently visible cells to previously-explored = 2, not back to 0)
 * This is the key explorer mode behavior: once seen, always dimly visible
 */
export function hideCells(
	grid: ExplorerFogGrid,
	cells: Array<{ x: number; y: number }>,
): ExplorerFogGrid {
	const next = cloneGrid(grid);
	for (const { x, y } of cells) {
		if (isInBounds(next, x, y) && next.cells[y][x] === 1) {
			next.cells[y][x] = 2; // visible → previously explored (NOT back to 0)
		}
	}
	return next;
}

/**
 * Fully hide cells (set to unexplored = 0, for Warden manual fog painting)
 */
export function eraseCells(
	grid: ExplorerFogGrid,
	cells: Array<{ x: number; y: number }>,
): ExplorerFogGrid {
	const next = cloneGrid(grid);
	for (const { x, y } of cells) {
		if (isInBounds(next, x, y)) {
			next.cells[y][x] = 0;
		}
	}
	return next;
}

/**
 * Update fog based on token vision: reveal cells in range, dim cells that
 * were visible but are now out of range
 */
export function updateFogFromVision(
	grid: ExplorerFogGrid,
	visibleCells: Set<string>, // "x,y" coordinate strings
): ExplorerFogGrid {
	const next = cloneGrid(grid);
	for (let y = 0; y < next.height; y++) {
		for (let x = 0; x < next.width; x++) {
			const key = `${x},${y}`;
			if (visibleCells.has(key)) {
				// Currently visible
				next.cells[y][x] = 1;
			} else if (next.cells[y][x] === 1) {
				// Was visible, now out of range → previously explored
				next.cells[y][x] = 2;
			}
			// State 0 (unexplored) and 2 (previously explored) remain unchanged
		}
	}
	return next;
}

/**
 * Toggle a single cell for Warden fog painting (cycles: 0 → 1, 1 → 0, 2 → 0)
 */
export function toggleFogCell(
	grid: ExplorerFogGrid,
	x: number,
	y: number,
	mode: "reveal" | "hide",
): ExplorerFogGrid {
	if (!isInBounds(grid, x, y)) return grid;
	const next = cloneGrid(grid);
	next.cells[y][x] = mode === "reveal" ? 1 : 0;
	return next;
}

// ─── Rendering Helpers ──────────────────────────────────────

/** CSS class/style for each fog state */
export const FOG_STATE_STYLES: Record<
	FogState,
	{ opacity: number; color: string; filter: string }
> = {
	0: { opacity: 0.95, color: "#000000", filter: "none" },
	1: { opacity: 0, color: "transparent", filter: "none" },
	2: { opacity: 0.55, color: "#1a1510", filter: "sepia(0.3)" },
};

/**
 * Get the CSS styling for a fog cell
 */
export function getFogCellStyle(state: FogState): {
	opacity: number;
	backgroundColor: string;
	filter: string;
} {
	const style = FOG_STATE_STYLES[state];
	return {
		opacity: style.opacity,
		backgroundColor: style.color,
		filter: style.filter,
	};
}

// ─── Internal Helpers ───────────────────────────────────────

function cloneGrid(grid: ExplorerFogGrid): ExplorerFogGrid {
	return {
		...grid,
		cells: grid.cells.map((row) => [...row]),
	};
}

function isInBounds(grid: ExplorerFogGrid, x: number, y: number): boolean {
	return x >= 0 && x < grid.width && y >= 0 && y < grid.height;
}
