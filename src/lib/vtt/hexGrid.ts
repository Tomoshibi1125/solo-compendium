/**
 * Hex Grid Engine
 *
 * Provides hex grid coordinate system, distance calculation, and rendering
 * helpers using the `honeycomb-grid` library.
 */

import {
	defineHex,
	Grid,
	type Hex,
	Orientation,
	rectangle,
	spiral,
} from "honeycomb-grid";

// ─── Types ──────────────────────────────────────────────────
export type HexOrientation = "flat" | "pointy";

export interface HexGridConfig {
	orientation: HexOrientation;
	size: number; // hex radius in pixels
	cols: number;
	rows: number;
	originX: number;
	originY: number;
}

export interface HexCell {
	q: number; // cube coordinate
	r: number; // cube coordinate
	x: number; // pixel center x
	y: number; // pixel center y
	corners: [number, number][]; // 6 corner points for rendering
}

// ─── Hex Grid Factory ───────────────────────────────────────

/**
 * Create a hex grid with the given configuration
 */
export function createHexGrid(config: HexGridConfig) {
	const CustomHex = defineHex({
		dimensions: config.size,
		orientation:
			config.orientation === "flat" ? Orientation.FLAT : Orientation.POINTY,
		origin: { x: config.originX, y: config.originY },
	});

	const grid = new Grid(
		CustomHex,
		rectangle({ width: config.cols, height: config.rows }),
	);

	return { grid, CustomHex };
}

/**
 * Get hex cell at pixel coordinates
 */
export function pixelToHex(
	px: number,
	py: number,
	config: HexGridConfig,
): { q: number; r: number } {
	const { grid } = createHexGrid(config);
	const hex = grid.pointToHex({ x: px, y: py });

	if (!hex) return { q: 0, r: 0 };
	return { q: hex.q, r: hex.r };
}

/**
 * Get pixel center of a hex cell
 */
export function hexToPixel(
	q: number,
	r: number,
	config: HexGridConfig,
): { x: number; y: number } {
	const CustomHex = defineHex({
		dimensions: config.size,
		orientation:
			config.orientation === "flat" ? Orientation.FLAT : Orientation.POINTY,
		origin: { x: config.originX, y: config.originY },
	});

	const hex = new CustomHex({ q, r });
	return { x: hex.x, y: hex.y };
}

/**
 * Calculate distance between two hex cells (in hex steps)
 */
export function hexDistance(
	q1: number,
	r1: number,
	q2: number,
	r2: number,
): number {
	// Cube distance formula
	const s1 = -q1 - r1;
	const s2 = -q2 - r2;
	return Math.max(Math.abs(q1 - q2), Math.abs(r1 - r2), Math.abs(s1 - s2));
}

/**
 * Get all hex cells within a radius (for area effects)
 */
export function hexesInRadius(
	centerQ: number,
	centerR: number,
	radius: number,
	config: HexGridConfig,
): HexCell[] {
	const CustomHex = defineHex({
		dimensions: config.size,
		orientation:
			config.orientation === "flat" ? Orientation.FLAT : Orientation.POINTY,
		origin: { x: config.originX, y: config.originY },
	});

	const center = new CustomHex({ q: centerQ, r: centerR });
	const grid = new Grid(
		CustomHex,
		spiral({ start: [center.q, center.r], radius }),
	);

	const cells: HexCell[] = [];
	grid.forEach((hex: Hex) => {
		cells.push({
			q: hex.q,
			r: hex.r,
			x: hex.x,
			y: hex.y,
			corners: hex.corners.map((c) => [c.x, c.y] as [number, number]),
		});
	});

	return cells;
}

/**
 * Get hex grid lines for rendering (SVG path data)
 */
export function getHexGridSVGPaths(config: HexGridConfig): string[] {
	const { grid } = createHexGrid(config);
	const paths: string[] = [];

	grid.forEach((hex: Hex) => {
		const corners = hex.corners;
		if (corners.length < 6) return;

		const d =
			corners
				.map((c, i) =>
					i === 0
						? `M ${c.x.toFixed(1)} ${c.y.toFixed(1)}`
						: `L ${c.x.toFixed(1)} ${c.y.toFixed(1)}`,
				)
				.join(" ") + " Z";

		paths.push(d);
	});

	return paths;
}

/**
 * Snap pixel coordinates to nearest hex center
 */
export function snapToHexCenter(
	px: number,
	py: number,
	config: HexGridConfig,
): { x: number; y: number } {
	const { q, r } = pixelToHex(px, py, config);
	return hexToPixel(q, r, config);
}

/**
 * Get neighboring hex cells
 */
export function hexNeighbors(q: number, r: number): { q: number; r: number }[] {
	// Cube coordinate neighbors
	return [
		{ q: q + 1, r: r },
		{ q: q - 1, r: r },
		{ q: q, r: r + 1 },
		{ q: q, r: r - 1 },
		{ q: q + 1, r: r - 1 },
		{ q: q - 1, r: r + 1 },
	];
}
