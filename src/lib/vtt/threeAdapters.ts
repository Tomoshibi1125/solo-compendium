/**
 * Misty Pearl C1 — Pure adapters for the 2D scene → 3D mesh translation.
 *
 * Lifts a 2D `VTTScene` into a typed bag of 3D mesh descriptors so the
 * `VttThreeStage` renderer can consume scene data without re-deriving
 * geometry. Side-effect free — no Three.js objects are constructed
 * here, only descriptors. Easy to unit-test.
 */
import type {
	LightSource,
	VTTScene,
	VTTSceneLevel,
	VTTTokenInstance,
	WallSegment,
} from "@/types/vtt";

/** 3D position in scene-units (1 unit = 1 grid cell). */
export interface Vec3 {
	x: number;
	y: number;
	z: number;
}

export interface WallBoxDescriptor {
	id: string;
	from: { x: number; z: number };
	to: { x: number; z: number };
	height: number;
	level: string;
	type: WallSegment["type"];
	doorOpen?: boolean;
}

export interface TokenBillboardDescriptor {
	id: string;
	position: Vec3;
	width: number;
	height: number;
	imageUrl?: string;
	color?: string;
	name: string;
	level: string;
}

export interface LightPointDescriptor {
	id: string;
	position: Vec3;
	color: string;
	intensity: number;
	dimRadius: number;
	brightRadius: number;
	level: string;
}

export interface StratumDescriptor {
	id: string;
	name: string;
	elevation: number;
	order: number;
	groundY: number;
	visibleToPlayers: boolean;
}

export interface SceneThreeDescriptor {
	strata: StratumDescriptor[];
	walls: WallBoxDescriptor[];
	tokens: TokenBillboardDescriptor[];
	lights: LightPointDescriptor[];
	sceneWidth: number;
	sceneHeight: number;
	gridSize: number;
}

const DEFAULT_WALL_HEIGHT = 3;

/** Convert a 2D pixel coordinate into a 3D scene-unit coordinate. */
const px2unit = (n: number, gridSize: number) => n / gridSize;

/**
 * Translate a `VTTScene` into a descriptor bag the 3D renderer can
 * consume. Pure — no Three.js objects are constructed.
 */
export function sceneToThreeDescriptor(scene: VTTScene): SceneThreeDescriptor {
	const gridSize = scene.gridSize || 50;
	const levels = (scene.levels ?? []).slice();
	if (levels.length === 0) {
		levels.push({
			id: "stratum-ground",
			name: "Surface",
			elevation: 0,
			order: 0,
			visibleToPlayers: true,
			wallIds: scene.walls.map((w) => w.id),
			lightIds: scene.lights.map((l) => l.id),
		});
	}

	const strata: StratumDescriptor[] = levels
		.slice()
		.sort((a, b) => a.order - b.order)
		.map((level, index) => ({
			id: level.id,
			name: level.name,
			elevation: level.elevation,
			order: level.order,
			groundY: index * (DEFAULT_WALL_HEIGHT + 0.5),
			visibleToPlayers: level.visibleToPlayers,
		}));
	const stratumGroundY = new Map(strata.map((s) => [s.id, s.groundY]));

	const wallLookup = (wall: WallSegment, fallback: VTTSceneLevel) =>
		levels.find((l) => l.wallIds.includes(wall.id))?.id ?? fallback.id;
	const lightLookup = (light: LightSource, fallback: VTTSceneLevel) =>
		levels.find((l) => l.lightIds.includes(light.id))?.id ?? fallback.id;
	const fallbackLevel = levels[0];

	const walls: WallBoxDescriptor[] = scene.walls.map((wall) => ({
		id: wall.id,
		from: { x: px2unit(wall.x1, gridSize), z: px2unit(wall.y1, gridSize) },
		to: { x: px2unit(wall.x2, gridSize), z: px2unit(wall.y2, gridSize) },
		height:
			wall.type === "window"
				? DEFAULT_WALL_HEIGHT * 0.5
				: wall.type === "ethereal"
					? DEFAULT_WALL_HEIGHT * 0.2
					: DEFAULT_WALL_HEIGHT,
		level: wallLookup(wall, fallbackLevel),
		type: wall.type,
		doorOpen: wall.doorOpen,
	}));

	const tokens: TokenBillboardDescriptor[] = scene.tokens.map(
		(token: VTTTokenInstance) => {
			const level = token.level ?? fallbackLevel.id;
			const groundY = stratumGroundY.get(level) ?? 0;
			return {
				id: token.id,
				position: {
					x: px2unit(token.x * gridSize, gridSize),
					y: groundY + (token.elevation ?? 0) + 0.5,
					z: px2unit(token.y * gridSize, gridSize),
				},
				width: 1,
				height: 1,
				imageUrl: token.imageUrl,
				color: token.color,
				name: token.name,
				level,
			};
		},
	);

	const lights: LightPointDescriptor[] = scene.lights.map((light) => {
		const level = lightLookup(light, fallbackLevel);
		const groundY = stratumGroundY.get(level) ?? 0;
		return {
			id: light.id,
			position: {
				x: px2unit(light.x, gridSize),
				y: groundY + 1.5,
				z: px2unit(light.y, gridSize),
			},
			color: light.color,
			intensity: light.intensity,
			dimRadius: light.dimRadius,
			brightRadius: light.brightRadius,
			level,
		};
	});

	return {
		strata,
		walls,
		tokens,
		lights,
		sceneWidth: px2unit(scene.width, gridSize),
		sceneHeight: px2unit(scene.height, gridSize),
		gridSize,
	};
}
