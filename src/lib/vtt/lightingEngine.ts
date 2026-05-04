/**
 * VTT Lighting & Line-of-Sight Engine
 *
 * Implements dynamic lighting with wall segments and raycasting for
 * token vision (Foundry VTT / Roll20 parity).
 *
 * Uses `robust-point-in-polygon` for fast polygon containment checks.
 */

import classifyPoint from "robust-point-in-polygon";

// ─── Types ──────────────────────────────────────────────────
export interface WallSegment {
	id: string;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	/**
	 * - "wall" — standard opaque wall (blocks movement + vision).
	 * - "door" — togglable (see `doorOpen`); blocks when closed.
	 * - "window" — blocks movement, allows vision.
	 * - "terrain" — blocks vision, allows movement (e.g. dense smoke).
	 * - "ethereal" — blocks vision for incorporeal-tagged tokens only
	 *   (authoring-time label; LoS engine treats it the same as "wall"
	 *   until Foundry-class incorporeal gating lands in P2-8).
	 */
	type: "wall" | "door" | "window" | "terrain" | "ethereal" | "oneway";
	state?: WallState;
	doorOpen?: boolean;
	oneWay?: boolean; // blocks vision from one side only
	direction?: WallDirection | number; // angle for one-way walls
}

export type WallDirection = "both" | "left" | "right";
export type WallState = "open" | "closed";

export interface LightSource {
	id: string;
	/**
	 * Optional human-readable label assigned by the Warden during light
	 * authoring. Persisted with scene state and round-tripped through the
	 * realtime sync; rendering ignores it.
	 */
	name?: string;
	x: number;
	y: number;
	brightRadius: number; // in grid squares
	dimRadius: number; // in grid squares
	color: string;
	intensity: number; // 0-1
	type: "token" | "ambient" | "torch" | "magical";
	animated?: boolean;
}

export interface TokenVision {
	tokenId: string;
	x: number;
	y: number;
	visionRange: number; // total vision in grid squares
	darkvisionRange: number;
	blindsightRange: number;
}

export interface VisibilityPolygon {
	vertices: [number, number][];
	tokenId: string;
}

// ─── Raycasting ─────────────────────────────────────────────

/**
 * Cast a ray from origin in a direction and find the nearest wall intersection
 */
export function rayWallIntersection(
	ox: number,
	oy: number,
	dx: number,
	dy: number,
	walls: WallSegment[],
): { x: number; y: number; dist: number } | null {
	let nearest: { x: number; y: number; dist: number } | null = null;

	for (const wall of walls) {
		if (!wallBlocksVision(wall, ox, oy, dx, dy)) continue;

		const intersection = lineSegmentIntersection(
			ox,
			oy,
			ox + dx * 9999,
			oy + dy * 9999,
			wall.x1,
			wall.y1,
			wall.x2,
			wall.y2,
		);

		if (intersection) {
			const dist = Math.sqrt(
				(intersection.x - ox) ** 2 + (intersection.y - oy) ** 2,
			);
			if (!nearest || dist < nearest.dist) {
				nearest = { ...intersection, dist };
			}
		}
	}

	return nearest;
}

function wallBlocksVision(
	wall: WallSegment,
	ox: number,
	oy: number,
	_dx: number,
	_dy: number,
): boolean {
	if (wall.type === "window") return false;
	if (wall.type === "door") return !isDoorOpen(wall);
	if (wall.type === "oneway" || wall.oneWay) {
		const direction =
			typeof wall.direction === "string" ? wall.direction : "left";
		if (direction === "both") return true;
		const side = getOriginSideOfWall(wall, ox, oy);
		return side === "both" || side === direction;
	}
	return true;
}

function isDoorOpen(wall: WallSegment): boolean {
	return wall.state === "open" || wall.doorOpen === true;
}

function getOriginSideOfWall(
	wall: WallSegment,
	ox: number,
	oy: number,
): WallDirection {
	const cross =
		(wall.x2 - wall.x1) * (oy - wall.y1) - (wall.y2 - wall.y1) * (ox - wall.x1);
	if (Math.abs(cross) < 1e-10) return "both";
	return cross > 0 ? "left" : "right";
}

/**
 * Line segment intersection (parametric)
 */
function lineSegmentIntersection(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	x3: number,
	y3: number,
	x4: number,
	y4: number,
): { x: number; y: number } | null {
	const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	if (Math.abs(denom) < 1e-10) return null; // Parallel

	const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
	const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

	if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
		return {
			x: x1 + t * (x2 - x1),
			y: y1 + t * (y2 - y1),
		};
	}
	return null;
}

// ─── Visibility Polygon ────────────────────────────────────

/**
 * Compute visibility polygon from a token position given walls
 * Uses 360-degree raycasting with rays aimed at wall endpoints + offset rays
 */
export function computeVisibilityPolygon(
	vision: TokenVision,
	walls: WallSegment[],
	gridSize: number,
	rayCount: number = 360,
): VisibilityPolygon {
	const ox = vision.x * gridSize + gridSize / 2;
	const oy = vision.y * gridSize + gridSize / 2;
	const maxDist = vision.visionRange * gridSize;

	// Collect unique angles to wall endpoints + uniform sweep
	const angles: number[] = [];

	// Uniform sweep
	for (let i = 0; i < rayCount; i++) {
		angles.push((i / rayCount) * Math.PI * 2);
	}

	// Add angles to wall endpoints (± tiny offset for precision)
	for (const wall of walls) {
		for (const [px, py] of [
			[wall.x1, wall.y1],
			[wall.x2, wall.y2],
		]) {
			const angle = Math.atan2(py - oy, px - ox);
			angles.push(angle - 0.0001);
			angles.push(angle);
			angles.push(angle + 0.0001);
		}
	}

	// Sort angles
	angles.sort((a, b) => a - b);

	// Cast rays
	const vertices: [number, number][] = [];
	for (const angle of angles) {
		const dx = Math.cos(angle);
		const dy = Math.sin(angle);

		const hit = rayWallIntersection(ox, oy, dx, dy, walls);

		if (hit && hit.dist <= maxDist) {
			vertices.push([hit.x, hit.y]);
		} else {
			// No wall hit — extend to max vision range
			vertices.push([ox + dx * maxDist, oy + dy * maxDist]);
		}
	}

	return { vertices, tokenId: vision.tokenId };
}

/**
 * Check if a grid cell is visible from a token's visibility polygon
 */
export function isCellVisible(
	cellX: number,
	cellY: number,
	gridSize: number,
	polygon: VisibilityPolygon,
): boolean {
	const cx = cellX * gridSize + gridSize / 2;
	const cy = cellY * gridSize + gridSize / 2;
	// classifyPoint returns: -1 = inside, 0 = on boundary, 1 = outside
	return classifyPoint(polygon.vertices, [cx, cy]) <= 0;
}

// ─── Light Rendering ────────────────────────────────────────

/**
 * Compute light level at a grid cell from all light sources
 * Returns 0 (dark) to 1 (bright light)
 */
export function computeLightLevel(
	cellX: number,
	cellY: number,
	lights: LightSource[],
	gridSize: number,
): number {
	let maxLight = 0;

	for (const light of lights) {
		const dx = cellX - light.x / gridSize;
		const dy = cellY - light.y / gridSize;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (dist <= light.brightRadius) {
			maxLight = Math.max(maxLight, light.intensity);
		} else if (dist <= light.dimRadius) {
			// Linear falloff in dim zone
			const factor =
				1 -
				(dist - light.brightRadius) / (light.dimRadius - light.brightRadius);
			maxLight = Math.max(maxLight, light.intensity * factor * 0.5);
		}
	}

	return Math.min(1, maxLight);
}

// ─── Wall Management ────────────────────────────────────────

/**
 * Create a new wall segment
 */
export function createWall(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	type: WallSegment["type"] = "wall",
	options: Partial<Pick<WallSegment, "direction" | "state">> = {},
): WallSegment {
	const state = type === "door" ? (options.state ?? "closed") : undefined;
	return {
		id: `wall-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		x1,
		y1,
		x2,
		y2,
		type,
		state,
		doorOpen: type === "door" ? state === "open" : undefined,
		direction:
			type === "oneway" ? (options.direction ?? "left") : options.direction,
	};
}

/**
 * Toggle door open/closed
 */
export function toggleDoor(
	walls: WallSegment[],
	wallId: string,
): WallSegment[] {
	return walls.map((w) =>
		w.id === wallId && w.type === "door"
			? {
					...w,
					state: isDoorOpen(w) ? "closed" : "open",
					doorOpen: !isDoorOpen(w),
				}
			: w,
	);
}

/**
 * Snap wall endpoints to grid intersections
 */
export function snapToGrid(value: number, gridSize: number): number {
	return Math.round(value / gridSize) * gridSize;
}
