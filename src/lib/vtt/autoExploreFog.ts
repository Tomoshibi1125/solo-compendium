import {
	computeVisibilityPolygon,
	isCellVisible,
	type WallSegment,
} from "./lightingEngine";

export interface AutoExploreFogToken {
	id: string;
	x: number;
	y: number;
	visible?: boolean;
	visionRange?: number;
	darkvisionRange?: number;
	blindsightRange?: number;
	lightRadius?: number;
}

export interface AutoExploreFogScene {
	width: number;
	height: number;
	gridSize: number;
	fogData?: boolean[][];
	walls?: WallSegment[];
	tokens: AutoExploreFogToken[];
}

export interface AutoExploreFogResult<TScene extends AutoExploreFogScene> {
	scene: TScene & { fogData?: boolean[][] };
	changed: boolean;
}

export interface ApplyTokenVisionFogOptions {
	tokenId: string;
	defaultVisionRange?: number;
	rayCount?: number;
}

const DEFAULT_TOKEN_VISION_RANGE = 12;

export function applyTokenVisionToFog<TScene extends AutoExploreFogScene>(
	scene: TScene,
	options: ApplyTokenVisionFogOptions,
): AutoExploreFogResult<TScene> {
	const token = scene.tokens.find(
		(candidate) => candidate.id === options.tokenId,
	);
	if (!token || token.visible === false) return { scene, changed: false };
	const visionRange = getTokenVisionRange(
		token,
		options.defaultVisionRange ?? DEFAULT_TOKEN_VISION_RANGE,
	);
	if (visionRange <= 0) return { scene, changed: false };
	const fogData = normalizeFogData(scene);
	const walls = scaleSceneWallsToPixels(scene.walls ?? [], scene);
	const polygon = computeVisibilityPolygon(
		{
			tokenId: token.id,
			x: token.x,
			y: token.y,
			visionRange,
			darkvisionRange: token.darkvisionRange ?? 0,
			blindsightRange: token.blindsightRange ?? 0,
		},
		walls,
		scene.gridSize,
		options.rayCount ?? 72,
	);
	let changed = false;
	for (let y = 0; y < scene.height; y += 1) {
		for (let x = 0; x < scene.width; x += 1) {
			if (!fogData[y][x] && isCellVisible(x, y, scene.gridSize, polygon)) {
				fogData[y][x] = true;
				changed = true;
			}
		}
	}
	if (!changed && scene.fogData) return { scene, changed: false };
	return {
		scene: {
			...scene,
			fogData,
		},
		changed: changed || !scene.fogData,
	};
}

export function normalizeFogData(
	scene: Pick<AutoExploreFogScene, "width" | "height" | "fogData">,
): boolean[][] {
	return Array.from({ length: scene.height }, (_, y) =>
		Array.from(
			{ length: scene.width },
			(_, x) => scene.fogData?.[y]?.[x] ?? false,
		),
	);
}

function getTokenVisionRange(
	token: AutoExploreFogToken,
	defaultVisionRange: number,
): number {
	const explicitRanges = [
		token.visionRange,
		token.darkvisionRange,
		token.blindsightRange,
		token.lightRadius,
	].filter((range): range is number => typeof range === "number");
	if (explicitRanges.length === 0) return Math.max(0, defaultVisionRange);
	return Math.max(0, ...explicitRanges);
}

function scaleSceneWallsToPixels(
	walls: WallSegment[],
	scene: Pick<AutoExploreFogScene, "width" | "height" | "gridSize">,
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
