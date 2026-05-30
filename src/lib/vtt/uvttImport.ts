/**
 * Misty Pearl F1 — Universal VTT (.dd2vtt / .uvtt) map import.
 *
 * Pure parser for the open Universal VTT format emitted by Dungeondraft
 * and Dungeon Alchemist. These are *map-authoring tools*, not
 * competitor VTTs — Wardens use them to author custom RA-themed maps
 * outside the app and bring the data in here.
 *
 * Format reference: https://arkenforge.com/universal-vtt-files/
 *
 * Strict guardrail (per plan Out-of-scope): we do NOT accept Foundry
 * `.fvtt`, Roll20 exports, or DDB Maps exports. This module only
 * recognizes the `format` field at value `0.x` and the `resolution` /
 * `line_of_sight` / `lights` / `portals` / `image` schema.
 *
 * Pure module: no React, no DOM (apart from atob), no network. Returns
 * a partial `VTTScene` payload that the caller can drop into
 * `addScene()` / merge into an existing scene.
 */
import {
	createVttLightSourceId,
	createVttSceneId,
	DEFAULT_SCENE_SETTINGS,
} from "@/lib/vtt/sceneState";
import type { LightSource, VTTScene, WallSegment } from "@/types/vtt";

// -------------------------------------------------------------------
// UVTT schema (subset we consume — the format is small but loose).
// -------------------------------------------------------------------

interface UvttPoint {
	x: number;
	y: number;
}

interface UvttPortal {
	position?: UvttPoint;
	bounds?: UvttPoint[];
	rotation?: number;
	closed?: boolean;
	freestanding?: boolean;
}

interface UvttLight {
	position?: UvttPoint;
	range?: number;
	intensity?: number;
	color?: string; // hex without "#" — "ffffff" or "ffffffff" (AARRGGBB)
	shadows?: boolean;
}

interface UvttDocument {
	format?: number;
	resolution?: {
		map_origin?: UvttPoint;
		map_size?: UvttPoint;
		pixels_per_grid?: number;
	};
	line_of_sight?: UvttPoint[][];
	objects_line_of_sight?: UvttPoint[][];
	portals?: UvttPortal[];
	lights?: UvttLight[];
	environment?: {
		baked_lighting?: boolean;
		ambient_light?: string;
	};
	image?: string; // base64 PNG, no data URL prefix
}

export interface UvttImportResult {
	scene: VTTScene;
	/** Image as a data URL, or null if the file had no embedded image. */
	backgroundDataUrl: string | null;
	/** Warnings collected during parsing (e.g. external CDN refs). */
	warnings: string[];
}

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

const isPoint = (value: unknown): value is UvttPoint =>
	!!value &&
	typeof value === "object" &&
	typeof (value as { x?: unknown }).x === "number" &&
	typeof (value as { y?: unknown }).y === "number";

const normalizeHexColor = (raw: string | undefined): string => {
	if (!raw) return "#ffffff";
	const cleaned = raw.replace(/^#/, "").trim();
	// UVTT uses AARRGGBB or RRGGBB. Strip alpha (we already model
	// intensity separately).
	const rgb = cleaned.length === 8 ? cleaned.slice(2) : cleaned;
	if (!/^[0-9a-fA-F]{6}$/.test(rgb)) return "#ffffff";
	return `#${rgb.toLowerCase()}`;
};

/**
 * Convert a UVTT base64 image payload into a data URL the renderer can
 * consume directly. We assume PNG since that's what Dungeondraft /
 * Dungeon Alchemist emit; if the bytes happen to be JPEG, the browser
 * still renders the data URL correctly because the MIME hint is just a
 * label and Image decoding sniffs the magic bytes.
 */
const toDataUrl = (b64: string | undefined): string | null => {
	if (!b64) return null;
	const trimmed = b64.replace(/\s+/g, "");
	if (!trimmed) return null;
	return `data:image/png;base64,${trimmed}`;
};

// -------------------------------------------------------------------
// Parser
// -------------------------------------------------------------------

/**
 * Parse a parsed JSON document (already `JSON.parse()`d) into a
 * partial scene. Throws on schema violations.
 */
export function parseUvttDocument(
	raw: unknown,
	options: { sceneName?: string } = {},
): UvttImportResult {
	if (!raw || typeof raw !== "object") {
		throw new Error("UVTT: not an object");
	}
	const doc = raw as UvttDocument;

	if (typeof doc.format !== "number") {
		throw new Error("UVTT: missing 'format' field — not a Universal VTT file");
	}
	if (doc.format < 0.1 || doc.format >= 2) {
		throw new Error(`UVTT: unsupported format ${doc.format}`);
	}
	if (!doc.resolution || typeof doc.resolution !== "object") {
		throw new Error("UVTT: missing 'resolution' block");
	}

	const warnings: string[] = [];
	const pixelsPerGrid = Math.round(
		Math.max(8, Math.min(1024, doc.resolution.pixels_per_grid ?? 70)),
	);
	const mapSizeUnits = isPoint(doc.resolution.map_size)
		? doc.resolution.map_size
		: { x: 20, y: 15 };
	const widthPx = Math.max(64, Math.round(mapSizeUnits.x * pixelsPerGrid));
	const heightPx = Math.max(64, Math.round(mapSizeUnits.y * pixelsPerGrid));

	// Map units in UVTT are *grid squares*. Our internal coordinates use
	// scene pixels with `gridSize` controlling the cell-pixel ratio.
	const unitToPx = (u: number) => u * pixelsPerGrid;

	// -------------------------------
	// Walls — line_of_sight + objects_line_of_sight
	// Each entry is a polyline (array of points). Convert to a series
	// of WallSegment between adjacent points.
	// -------------------------------
	const walls: WallSegment[] = [];
	const collectWalls = (
		polylines: UvttPoint[][] | undefined,
		kind: "wall" | "terrain",
	) => {
		if (!Array.isArray(polylines)) return;
		for (const poly of polylines) {
			if (!Array.isArray(poly) || poly.length < 2) continue;
			for (let i = 0; i < poly.length - 1; i++) {
				const a = poly[i];
				const b = poly[i + 1];
				if (!isPoint(a) || !isPoint(b)) continue;
				walls.push({
					id: `wall-uvtt-${walls.length}`,
					x1: unitToPx(a.x),
					y1: unitToPx(a.y),
					x2: unitToPx(b.x),
					y2: unitToPx(b.y),
					type: kind,
				});
			}
		}
	};
	collectWalls(doc.line_of_sight, "wall");
	collectWalls(doc.objects_line_of_sight, "terrain");

	// -------------------------------
	// Portals → doors. UVTT portals are stored as bounds (two endpoints)
	// plus a `closed` flag. They're vision-blocking only when closed.
	// -------------------------------
	if (Array.isArray(doc.portals)) {
		for (const portal of doc.portals) {
			if (
				!portal ||
				!Array.isArray(portal.bounds) ||
				portal.bounds.length < 2
			) {
				continue;
			}
			const a = portal.bounds[0];
			const b = portal.bounds[portal.bounds.length - 1];
			if (!isPoint(a) || !isPoint(b)) continue;
			walls.push({
				id: `door-uvtt-${walls.length}`,
				x1: unitToPx(a.x),
				y1: unitToPx(a.y),
				x2: unitToPx(b.x),
				y2: unitToPx(b.y),
				type: "door",
				doorOpen: portal.closed === false,
				state: portal.closed === false ? "open" : "closed",
			});
		}
	}

	// -------------------------------
	// Lights
	// -------------------------------
	const lights: LightSource[] = [];
	if (Array.isArray(doc.lights)) {
		for (const light of doc.lights) {
			if (!light || !isPoint(light.position)) continue;
			const range = Math.max(0, Math.min(200, light.range ?? 6));
			lights.push({
				id: createVttLightSourceId(),
				x: unitToPx(light.position.x),
				y: unitToPx(light.position.y),
				brightRadius: range * 0.6,
				dimRadius: range,
				color: normalizeHexColor(light.color),
				intensity: Math.max(0, Math.min(1, light.intensity ?? 0.85)),
				type: "ambient",
			});
		}
	}

	// -------------------------------
	// Image
	// -------------------------------
	const backgroundDataUrl = toDataUrl(doc.image);
	if (!backgroundDataUrl) {
		warnings.push(
			"UVTT file had no embedded image — scene will use a blank background.",
		);
	}

	// -------------------------------
	// Compose scene
	// -------------------------------
	const scene: VTTScene = {
		id: createVttSceneId(),
		name: options.sceneName?.trim() || "Imported Rift",
		width: widthPx,
		height: heightPx,
		backgroundImage: backgroundDataUrl ?? undefined,
		backgroundScale: DEFAULT_SCENE_SETTINGS.backgroundScale,
		backgroundOffsetX: DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
		backgroundOffsetY: DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
		gridSize: pixelsPerGrid,
		gridType: "square",
		gridOpacity: DEFAULT_SCENE_SETTINGS.gridOpacity,
		tokens: [],
		drawings: [],
		annotations: [],
		walls,
		lights,
		fogOfWar: true,
	};

	return { scene, backgroundDataUrl, warnings };
}

/**
 * Convenience: parse a `File` or `Blob` (or a raw string). Returns the
 * same result shape as `parseUvttDocument`. Use this from a file picker
 * `onChange` handler.
 */
export async function parseUvttFile(
	source: File | Blob | string,
	options: { sceneName?: string } = {},
): Promise<UvttImportResult> {
	let text: string;
	if (typeof source === "string") {
		text = source;
	} else {
		text = await source.text();
	}
	let json: unknown;
	try {
		json = JSON.parse(text);
	} catch (error) {
		throw new Error(
			`UVTT: not valid JSON (${error instanceof Error ? error.message : "parse error"})`,
		);
	}
	return parseUvttDocument(json, options);
}
