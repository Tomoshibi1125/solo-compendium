import {
	computeVisibilityPolygon,
	isCellVisible,
	type WallSegment,
} from "./lightingEngine";
import { TOKEN_GRID_UNITS, type TokenSize } from "./tokenSizing";

export type VttFogRect = {
	rx: number;
	ry: number;
	width: number;
	height: number;
};

export type VttFogRenderState = "hidden" | "explored";

export type VttFogRenderRect = VttFogRect & {
	state: VttFogRenderState;
	opacity: number;
};

export type VttFogVisionToken = {
	id: string;
	x: number;
	y: number;
	visible?: boolean;
	tokenType?: string;
	ownerId?: string;
	characterId?: string;
	size?: TokenSize | string;
	gridWidth?: number;
	gridHeight?: number;
	visionRange?: number;
	darkvisionRange?: number;
	blindsightRange?: number;
	lightRadius?: number;
	lightDimRadius?: number;
};

export type VttFogVisibilityScene = {
	width: number;
	height: number;
	gridSize: number;
	fogOfWar?: boolean;
	tokenVisionRevealsFog?: boolean;
	fogData?: boolean[][];
	walls?: WallSegment[];
};

export type VttFogVisibilityOptions = {
	activeTokenId?: string | null;
	currentUserId?: string | null;
	ownedCharacterId?: string | null;
	defaultVisionRange?: number;
	rayCount?: number;
};

export const VTT_ASCENDANT_HIDDEN_FOG_OPACITY = 1;
export const VTT_ASCENDANT_EXPLORED_FOG_OPACITY = 0.72;
export const VTT_WARDEN_HIDDEN_FOG_OPACITY = 0.45;

export function buildVttFogRects(
	fogData: boolean[][] | null | undefined,
): VttFogRect[] {
	if (!fogData || fogData.length === 0) return [];

	const rects: VttFogRect[] = [];
	let activeRects = new Map<string, VttFogRect>();
	for (let ry = 0; ry < fogData.length; ry += 1) {
		const row = fogData[ry] ?? [];
		const nextActiveRects = new Map<string, VttFogRect>();
		let rx = 0;
		while (rx < row.length) {
			if (row[rx]) {
				rx += 1;
				continue;
			}
			const start = rx;
			while (rx < row.length && !row[rx]) {
				rx += 1;
			}
			const width = rx - start;
			const key = `${start}:${width}`;
			const activeRect = activeRects.get(key);
			if (activeRect && activeRect.ry + activeRect.height === ry) {
				activeRect.height += 1;
				nextActiveRects.set(key, activeRect);
			} else {
				const rect = { rx: start, ry, width, height: 1 };
				rects.push(rect);
				nextActiveRects.set(key, rect);
			}
		}
		activeRects = nextActiveRects;
	}

	return rects;
}

export function normalizeVttFogData(
	scene: Pick<VttFogVisibilityScene, "width" | "height" | "fogData">,
	revealed = false,
): boolean[][] {
	return Array.from({ length: scene.height }, (_, y) =>
		Array.from(
			{ length: scene.width },
			(_, x) => scene.fogData?.[y]?.[x] ?? revealed,
		),
	);
}

export function isVttTokenOwnedByUser(
	token: Pick<VttFogVisionToken, "ownerId" | "characterId">,
	options: Pick<VttFogVisibilityOptions, "currentUserId" | "ownedCharacterId">,
): boolean {
	const currentUserId = options.currentUserId ?? null;
	const ownedCharacterId = options.ownedCharacterId ?? null;
	return Boolean(
		(currentUserId && token.ownerId === currentUserId) ||
			(currentUserId && token.characterId === currentUserId) ||
			(ownedCharacterId && token.characterId === ownedCharacterId),
	);
}

export function buildVttVisibleCellSet(
	scene: VttFogVisibilityScene,
	tokens: VttFogVisionToken[],
	options: VttFogVisibilityOptions = {},
): Set<string> {
	const defaultVisionRange = options.defaultVisionRange ?? 12;
	const sources = tokens.filter((token) => {
		if (token.visible === false) return false;
		if (
			!isVttTokenOwnedByUser(token, {
				currentUserId: options.currentUserId,
				ownedCharacterId: options.ownedCharacterId,
			})
		) {
			return false;
		}
		if (options.activeTokenId && token.id !== options.activeTokenId) {
			return false;
		}
		return getVttTokenVisionRange(token, defaultVisionRange) > 0;
	});
	const visibleCells = new Set<string>();
	if (sources.length === 0) return visibleCells;
	const walls = scaleVttWallsToPixels(scene.walls ?? [], scene);
	for (const source of sources) {
		const visionRange = getVttTokenVisionRange(source, defaultVisionRange);
		const polygon = computeVisibilityPolygon(
			{
				tokenId: source.id,
				x: source.x,
				y: source.y,
				visionRange,
				darkvisionRange: source.darkvisionRange ?? 0,
				blindsightRange: source.blindsightRange ?? 0,
			},
			walls,
			scene.gridSize,
			options.rayCount ?? 96,
		);
		for (let y = 0; y < scene.height; y += 1) {
			for (let x = 0; x < scene.width; x += 1) {
				if (isCellVisible(x, y, scene.gridSize, polygon)) {
					visibleCells.add(getVttFogCellKey(x, y));
				}
			}
		}
	}
	return visibleCells;
}

export function buildVttFogRenderRects({
	scene,
	visibleCells,
	showExploredMemory = true,
}: {
	scene: VttFogVisibilityScene;
	visibleCells?: Set<string> | null;
	showExploredMemory?: boolean;
}): VttFogRenderRect[] {
	if (!scene.fogOfWar) return [];
	const fogData = normalizeVttFogData(scene, false);
	const rows: Array<Array<VttFogRenderState | null>> = [];
	for (let y = 0; y < scene.height; y += 1) {
		const row: Array<VttFogRenderState | null> = [];
		for (let x = 0; x < scene.width; x += 1) {
			const revealed = fogData[y]?.[x] === true;
			const isCurrentlyVisible =
				scene.tokenVisionRevealsFog &&
				visibleCells?.has(getVttFogCellKey(x, y)) === true;
			if (isCurrentlyVisible) {
				row.push(null);
			} else if (!revealed) {
				row.push("hidden");
			} else if (scene.tokenVisionRevealsFog && showExploredMemory) {
				row.push("explored");
			} else {
				row.push(null);
			}
		}
		rows.push(row);
	}
	return buildFogRenderRectsFromRows(rows);
}

export function isVttTokenVisibleThroughFog(
	token: VttFogVisionToken,
	scene: VttFogVisibilityScene,
	visibleCells?: Set<string> | null,
): boolean {
	if (!scene.fogOfWar) return true;
	const cells = getVttTokenFootprintCells(token, scene);
	if (scene.tokenVisionRevealsFog && visibleCells) {
		return cells.some(({ x, y }) => visibleCells.has(getVttFogCellKey(x, y)));
	}
	const fogData = normalizeVttFogData(scene, false);
	return cells.some(({ x, y }) => fogData[y]?.[x] === true);
}

export function getVttFogCellKey(x: number, y: number): string {
	return `${x},${y}`;
}

function buildFogRenderRectsFromRows(
	rows: Array<Array<VttFogRenderState | null>>,
): VttFogRenderRect[] {
	const rects: VttFogRenderRect[] = [];
	let activeRects = new Map<string, VttFogRenderRect>();
	for (let ry = 0; ry < rows.length; ry += 1) {
		const row = rows[ry] ?? [];
		const nextActiveRects = new Map<string, VttFogRenderRect>();
		let rx = 0;
		while (rx < row.length) {
			const state = row[rx];
			if (!state) {
				rx += 1;
				continue;
			}
			const start = rx;
			while (rx < row.length && row[rx] === state) {
				rx += 1;
			}
			const width = rx - start;
			const key = `${state}:${start}:${width}`;
			const activeRect = activeRects.get(key);
			if (activeRect && activeRect.ry + activeRect.height === ry) {
				activeRect.height += 1;
				nextActiveRects.set(key, activeRect);
			} else {
				const rect = {
					rx: start,
					ry,
					width,
					height: 1,
					state,
					opacity:
						state === "hidden"
							? VTT_ASCENDANT_HIDDEN_FOG_OPACITY
							: VTT_ASCENDANT_EXPLORED_FOG_OPACITY,
				};
				rects.push(rect);
				nextActiveRects.set(key, rect);
			}
		}
		activeRects = nextActiveRects;
	}
	return rects;
}

function getVttTokenFootprintCells(
	token: VttFogVisionToken,
	scene: Pick<VttFogVisibilityScene, "width" | "height">,
): Array<{ x: number; y: number }> {
	const unitsFromSize = TOKEN_GRID_UNITS[token.size as TokenSize] ?? 1;
	const width = Math.max(0.25, token.gridWidth ?? unitsFromSize);
	const height = Math.max(
		0.25,
		token.gridHeight ?? token.gridWidth ?? unitsFromSize,
	);
	const startX = Math.floor(token.x);
	const startY = Math.floor(token.y);
	const endX = Math.max(startX, Math.ceil(token.x + width) - 1);
	const endY = Math.max(startY, Math.ceil(token.y + height) - 1);
	const cells: Array<{ x: number; y: number }> = [];
	for (let y = startY; y <= endY; y += 1) {
		for (let x = startX; x <= endX; x += 1) {
			if (x >= 0 && x < scene.width && y >= 0 && y < scene.height) {
				cells.push({ x, y });
			}
		}
	}
	return cells;
}

function getVttTokenVisionRange(
	token: VttFogVisionToken,
	defaultVisionRange: number,
): number {
	const explicitRanges = [
		token.visionRange,
		token.darkvisionRange,
		token.blindsightRange,
		token.lightRadius,
		token.lightDimRadius,
	].filter((range): range is number => typeof range === "number");
	if (explicitRanges.length === 0) {
		return token.tokenType === "character" || token.characterId
			? Math.max(0, defaultVisionRange)
			: 0;
	}
	return Math.max(0, ...explicitRanges);
}

function scaleVttWallsToPixels(
	walls: WallSegment[],
	scene: Pick<VttFogVisibilityScene, "width" | "height" | "gridSize">,
): WallSegment[] {
	const maxGridCoordinate = Math.max(scene.width, scene.height) + 1;
	return walls.map((wall) => {
		const coordinates = [wall.x1, wall.y1, wall.x2, wall.y2];
		const isGridCoordinateWall = coordinates.every(
			(value) => Math.abs(value) <= maxGridCoordinate,
		);
		if (!isGridCoordinateWall) return wall;
		return {
			...wall,
			x1: wall.x1 * scene.gridSize,
			y1: wall.y1 * scene.gridSize,
			x2: wall.x2 * scene.gridSize,
			y2: wall.y2 * scene.gridSize,
		};
	});
}
