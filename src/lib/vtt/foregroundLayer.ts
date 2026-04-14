/**
 * Foreground Layer Engine
 *
 * Manages foreground elements that render ABOVE tokens on the VTT canvas.
 * Used for rooftops, canopies, bridges, and other architectural elements
 * that should visually occlude tokens when they pass underneath.
 *
 * Matches Foundry VTT's "Overhead Tiles" and Roll20's "Map & Background" layer system.
 *
 * Layer ordering (bottom to top):
 *   1. Background (map image)
 *   2. Grid overlay
 *   3. Terrain zones
 *   4. Tokens (character layer)
 *   5. Drawings / annotations
 *   6. AoE templates
 *   7. **Foreground tiles** ← this engine
 *   8. Fog of war
 *   9. UI overlays (pings, measurements)
 */

// ─── Types ──────────────────────────────────────────────────

export type ForegroundTileMode = "always" | "roof" | "weather";

export interface ForegroundTile {
	id: string;
	/** Image URL for the foreground element */
	imageUrl: string;
	/** Position in pixels on the canvas */
	x: number;
	y: number;
	/** Dimensions in pixels */
	width: number;
	height: number;
	/** Rotation in degrees */
	rotation: number;
	/** Base opacity (0-1) */
	opacity: number;
	/** Z-index within the foreground layer */
	zIndex: number;
	/**
	 * Display mode:
	 *  - "always": always visible above tokens
	 *  - "roof": becomes semi-transparent when a player token is underneath
	 *  - "weather": only visible during certain weather conditions
	 */
	mode: ForegroundTileMode;
	/** For "roof" mode: opacity when a token is underneath */
	occludedOpacity: number;
	/** For "weather" mode: which weather type triggers visibility */
	weatherTrigger?: string;
	/** Whether this tile is locked (can't be moved by accident) */
	locked: boolean;
	/** Scene this tile belongs to */
	sceneId: string;
	/** Display name for the Warden panel */
	label: string;
}

// ─── Factory ────────────────────────────────────────────────

export function createForegroundTile(
	imageUrl: string,
	x: number,
	y: number,
	width: number,
	height: number,
	options: Partial<
		Pick<
			ForegroundTile,
			| "rotation"
			| "opacity"
			| "zIndex"
			| "mode"
			| "occludedOpacity"
			| "weatherTrigger"
			| "locked"
			| "sceneId"
			| "label"
		>
	> = {},
): ForegroundTile {
	return {
		id: `fg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		imageUrl,
		x,
		y,
		width,
		height,
		rotation: options.rotation ?? 0,
		opacity: options.opacity ?? 1,
		zIndex: options.zIndex ?? 0,
		mode: options.mode ?? "always",
		occludedOpacity: options.occludedOpacity ?? 0.3,
		weatherTrigger: options.weatherTrigger,
		locked: options.locked ?? false,
		sceneId: options.sceneId ?? "",
		label: options.label ?? "Foreground Tile",
	};
}

// ─── Occlusion Logic ────────────────────────────────────────

/**
 * Check if a token (center point) is underneath a foreground tile
 */
export function isTokenUnderTile(
	tokenCenterX: number,
	tokenCenterY: number,
	tile: ForegroundTile,
): boolean {
	// Simple AABB check (rotation-aware would need matrix transform)
	if (tile.rotation === 0) {
		return (
			tokenCenterX >= tile.x &&
			tokenCenterX <= tile.x + tile.width &&
			tokenCenterY >= tile.y &&
			tokenCenterY <= tile.y + tile.height
		);
	}

	// For rotated tiles, use rotated point-in-rect test
	const cx = tile.x + tile.width / 2;
	const cy = tile.y + tile.height / 2;
	const angleRad = -(tile.rotation * Math.PI) / 180;
	const cos = Math.cos(angleRad);
	const sin = Math.sin(angleRad);

	// Rotate point relative to tile center
	const dx = tokenCenterX - cx;
	const dy = tokenCenterY - cy;
	const localX = dx * cos - dy * sin;
	const localY = dx * sin + dy * cos;

	return (
		Math.abs(localX) <= tile.width / 2 && Math.abs(localY) <= tile.height / 2
	);
}

/**
 * Compute effective opacity for a tile given current token positions
 */
export function computeTileOpacity(
	tile: ForegroundTile,
	playerTokenPositions: Array<{ x: number; y: number }>,
	currentWeather?: string,
): number {
	// Weather-gated tiles
	if (tile.mode === "weather") {
		if (!currentWeather || currentWeather !== tile.weatherTrigger) {
			return 0; // Hidden when weather doesn't match
		}
		return tile.opacity;
	}

	// Roof tiles: dim when a token is underneath
	if (tile.mode === "roof") {
		const hasTokenUnderneath = playerTokenPositions.some((pos) =>
			isTokenUnderTile(pos.x, pos.y, tile),
		);
		return hasTokenUnderneath ? tile.occludedOpacity : tile.opacity;
	}

	// "always" mode
	return tile.opacity;
}

/**
 * Get inline CSS transform for a foreground tile
 */
export function getTileTransformCSS(tile: ForegroundTile): string {
	const parts: string[] = [];
	if (tile.rotation !== 0) {
		parts.push(`rotate(${tile.rotation}deg)`);
	}
	return parts.join(" ");
}

/**
 * Get foreground tiles for a scene, sorted by z-index
 */
export function getSceneForegroundTiles(
	tiles: ForegroundTile[],
	sceneId: string,
): ForegroundTile[] {
	return tiles
		.filter((t) => t.sceneId === sceneId)
		.sort((a, b) => a.zIndex - b.zIndex);
}
