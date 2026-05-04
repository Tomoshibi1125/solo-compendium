import type { DrawingPoint, VTTDrawing } from "./drawingEngine";
import { createAoeFromMeasurement } from "./drawingEngine";

export interface VttSpellTemplateDragData {
	id?: string;
	name: string;
	range?: unknown;
	target?: unknown;
	area?: unknown;
	description?: unknown;
	mechanics?: unknown;
}

export type VttSpellTemplateShape = "line" | "circle" | "cone" | "cube";

export interface VttSpellTemplateSpec {
	shape: VttSpellTemplateShape;
	radiusInGridUnits: number;
	label: string;
}

export const VTT_SPELL_TEMPLATE_MIME = "application/vtt-spell-template";

const DEFAULT_GRID_UNITS_BY_SHAPE: Record<VttSpellTemplateShape, number> = {
	line: 12,
	circle: 4,
	cone: 6,
	cube: 4,
};

export function inferSpellTemplateSpec(
	spell: VttSpellTemplateDragData,
): VttSpellTemplateSpec | null {
	const text = stringifyTemplateHints(spell).toLowerCase();
	const shape = inferShape(text);
	if (!shape) return null;
	return {
		shape,
		radiusInGridUnits: inferGridUnits(text, shape),
		label: spell.name,
	};
}

export function createAoeFromSpellTemplate(
	spell: VttSpellTemplateDragData,
	dropPoint: DrawingPoint,
	createdBy: string,
	color = "#a855f7",
): VTTDrawing | null {
	const spec = inferSpellTemplateSpec(spell);
	if (!spec) return null;
	const end =
		spec.shape === "line" || spec.shape === "cone"
			? { x: dropPoint.x + spec.radiusInGridUnits, y: dropPoint.y }
			: dropPoint;
	const drawing = createAoeFromMeasurement(
		dropPoint,
		end,
		spec.shape,
		spec.radiusInGridUnits,
		color,
		createdBy,
	);
	return {
		...drawing,
		label: spec.label,
	};
}

export function buildSpellTemplateDragData(
	spell: VttSpellTemplateDragData,
): string {
	return JSON.stringify({
		id: spell.id,
		name: spell.name,
		range: spell.range,
		target: spell.target,
		area: spell.area,
		description: spell.description,
		mechanics: spell.mechanics,
	});
}

function inferShape(text: string): VttSpellTemplateShape | null {
	if (/\bcone\b/.test(text)) return "cone";
	if (/\b(line|beam|ray)\b/.test(text)) return "line";
	if (/\b(cube|square)\b/.test(text)) return "cube";
	if (/\b(radius|sphere|circle|burst|emanation)\b/.test(text)) return "circle";
	return null;
}

function inferGridUnits(text: string, shape: VttSpellTemplateShape): number {
	const feet = inferFeet(text);
	if (feet !== null) return Math.max(1, Math.ceil(feet / 5));
	return DEFAULT_GRID_UNITS_BY_SHAPE[shape];
}

function inferFeet(text: string): number | null {
	const matches = Array.from(
		text.matchAll(/(\d+)\s*(?:-|\s)?(?:foot|feet|ft|sq|square)/g),
	);
	if (matches.length === 0) return null;
	return Number(matches[0][1]) || null;
}

function stringifyTemplateHints(spell: VttSpellTemplateDragData): string {
	return [
		spell.name,
		stringifyUnknown(spell.area),
		stringifyUnknown(spell.target),
		stringifyUnknown(spell.range),
		stringifyUnknown(spell.mechanics),
		stringifyUnknown(spell.description),
	]
		.filter(Boolean)
		.join(" ");
}

function stringifyUnknown(value: unknown): string {
	if (value == null) return "";
	if (typeof value === "string" || typeof value === "number")
		return String(value);
	if (Array.isArray(value)) return value.map(stringifyUnknown).join(" ");
	if (typeof value === "object")
		return Object.values(value).map(stringifyUnknown).join(" ");
	return "";
}
