/**
 * AoE (Area-of-Effect) Template Engine
 *
 * Provides persistent, lingering AoE shapes on the VTT map for ongoing
 * spell effects (Spirit Guardians, Wall of Fire, Moonbeam, etc.)
 * Matches Roll20's "lingering measurement" feature.
 *
 * Supports: Circle, Cone, Cube, Line, Sphere (projected as circle)
 */

// ─── Types ──────────────────────────────────────────────────

export type AoEShape = "circle" | "cone" | "cube" | "line" | "sphere";

export interface AoETemplate {
	id: string;
	shape: AoEShape;
	/** Origin point in grid coordinates */
	originX: number;
	originY: number;
	/** Size in grid squares (radius for circle/sphere/cone, side for cube, length for line) */
	size: number;
	/** Direction angle in degrees (for cone and line) */
	angle: number;
	/** Cone width in degrees (default 53° for D&D 5e) */
	coneWidth: number;
	/** Display */
	color: string;
	fillOpacity: number;
	borderWidth: number;
	label?: string;
	/** Whether this template persists between turns */
	persistent: boolean;
	/** Who placed this template */
	createdBy: string;
	createdByName: string;
	/** Scene this template belongs to */
	sceneId: string;
	/** Timestamp for ordering */
	createdAt: number;
}

// ─── Constants ──────────────────────────────────────────────

export const AOE_COLORS: Record<string, string> = {
	fire: "rgba(239, 68, 68, 0.3)",
	ice: "rgba(56, 189, 248, 0.3)",
	lightning: "rgba(250, 204, 21, 0.3)",
	acid: "rgba(34, 197, 94, 0.3)",
	poison: "rgba(132, 204, 22, 0.3)",
	necrotic: "rgba(139, 92, 246, 0.3)",
	radiant: "rgba(251, 191, 36, 0.3)",
	force: "rgba(168, 85, 247, 0.3)",
	psychic: "rgba(236, 72, 153, 0.3)",
	thunder: "rgba(99, 102, 241, 0.3)",
	neutral: "rgba(148, 163, 184, 0.3)",
};

export const AOE_BORDER_COLORS: Record<string, string> = {
	fire: "rgba(239, 68, 68, 0.8)",
	ice: "rgba(56, 189, 248, 0.8)",
	lightning: "rgba(250, 204, 21, 0.8)",
	acid: "rgba(34, 197, 94, 0.8)",
	poison: "rgba(132, 204, 22, 0.8)",
	necrotic: "rgba(139, 92, 246, 0.8)",
	radiant: "rgba(251, 191, 36, 0.8)",
	force: "rgba(168, 85, 247, 0.8)",
	psychic: "rgba(236, 72, 153, 0.8)",
	thunder: "rgba(99, 102, 241, 0.8)",
	neutral: "rgba(148, 163, 184, 0.8)",
};

export const DEFAULT_CONE_WIDTH = 53; // D&D 5e standard cone angle

// ─── Factory ────────────────────────────────────────────────

export function createAoETemplate(
	shape: AoEShape,
	originX: number,
	originY: number,
	size: number,
	options: Partial<
		Pick<
			AoETemplate,
			| "angle"
			| "coneWidth"
			| "color"
			| "fillOpacity"
			| "borderWidth"
			| "label"
			| "persistent"
			| "createdBy"
			| "createdByName"
			| "sceneId"
		>
	> = {},
): AoETemplate {
	return {
		id: `aoe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		shape,
		originX,
		originY,
		size,
		angle: options.angle ?? 0,
		coneWidth: options.coneWidth ?? DEFAULT_CONE_WIDTH,
		color: options.color ?? AOE_COLORS.neutral,
		fillOpacity: options.fillOpacity ?? 0.3,
		borderWidth: options.borderWidth ?? 2,
		label: options.label,
		persistent: options.persistent ?? true,
		createdBy: options.createdBy ?? "unknown",
		createdByName: options.createdByName ?? "Unknown",
		sceneId: options.sceneId ?? "",
		createdAt: Date.now(),
	};
}

// ─── Geometry Helpers ───────────────────────────────────────

/**
 * Get the SVG path or geometric data for rendering an AoE template
 */
export function getAoEBounds(
	template: AoETemplate,
	gridSize: number,
): {
	x: number;
	y: number;
	width: number;
	height: number;
	centerX: number;
	centerY: number;
	radiusPx: number;
} {
	const centerX = (template.originX + 0.5) * gridSize;
	const centerY = (template.originY + 0.5) * gridSize;
	const radiusPx = template.size * gridSize;

	switch (template.shape) {
		case "circle":
		case "sphere":
			return {
				x: centerX - radiusPx,
				y: centerY - radiusPx,
				width: radiusPx * 2,
				height: radiusPx * 2,
				centerX,
				centerY,
				radiusPx,
			};
		case "cube": {
			const side = template.size * gridSize;
			return {
				x: centerX - side / 2,
				y: centerY - side / 2,
				width: side,
				height: side,
				centerX,
				centerY,
				radiusPx: side / 2,
			};
		}
		case "cone":
		case "line":
			return {
				x: centerX - radiusPx,
				y: centerY - radiusPx,
				width: radiusPx * 2,
				height: radiusPx * 2,
				centerX,
				centerY,
				radiusPx,
			};
		default:
			return {
				x: centerX,
				y: centerY,
				width: 0,
				height: 0,
				centerX,
				centerY,
				radiusPx: 0,
			};
	}
}

/**
 * Generate SVG path for a cone AoE
 */
export function getConeSVGPath(
	centerX: number,
	centerY: number,
	radius: number,
	angleDeg: number,
	widthDeg: number,
): string {
	const startAngle = ((angleDeg - widthDeg / 2) * Math.PI) / 180;
	const endAngle = ((angleDeg + widthDeg / 2) * Math.PI) / 180;
	const x1 = centerX + radius * Math.cos(startAngle);
	const y1 = centerY + radius * Math.sin(startAngle);
	const x2 = centerX + radius * Math.cos(endAngle);
	const y2 = centerY + radius * Math.sin(endAngle);
	const largeArc = widthDeg > 180 ? 1 : 0;

	return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

/**
 * Generate SVG path for a line AoE (5ft wide by default)
 */
export function getLineSVGPath(
	centerX: number,
	centerY: number,
	length: number,
	angleDeg: number,
	widthPx: number = 5,
): string {
	const angleRad = (angleDeg * Math.PI) / 180;
	const perpRad = angleRad + Math.PI / 2;

	const halfW = widthPx / 2;
	const endX = centerX + length * Math.cos(angleRad);
	const endY = centerY + length * Math.sin(angleRad);

	const x1 = centerX + halfW * Math.cos(perpRad);
	const y1 = centerY + halfW * Math.sin(perpRad);
	const x2 = centerX - halfW * Math.cos(perpRad);
	const y2 = centerY - halfW * Math.sin(perpRad);
	const x3 = endX - halfW * Math.cos(perpRad);
	const y3 = endY - halfW * Math.sin(perpRad);
	const x4 = endX + halfW * Math.cos(perpRad);
	const y4 = endY + halfW * Math.sin(perpRad);

	return `M ${x1} ${y1} L ${x4} ${y4} L ${x3} ${y3} L ${x2} ${y2} Z`;
}

/**
 * Check if a grid cell is within an AoE template
 */
export function isCellInAoE(
	cellX: number,
	cellY: number,
	template: AoETemplate,
	gridSize: number,
): boolean {
	const cx = (cellX + 0.5) * gridSize;
	const cy = (cellY + 0.5) * gridSize;
	const ox = (template.originX + 0.5) * gridSize;
	const oy = (template.originY + 0.5) * gridSize;
	const dist = Math.sqrt((cx - ox) ** 2 + (cy - oy) ** 2);
	const radiusPx = template.size * gridSize;

	switch (template.shape) {
		case "circle":
		case "sphere":
			return dist <= radiusPx;
		case "cube": {
			const halfSide = (template.size * gridSize) / 2;
			return Math.abs(cx - ox) <= halfSide && Math.abs(cy - oy) <= halfSide;
		}
		case "cone": {
			if (dist > radiusPx) return false;
			const angle = (Math.atan2(cy - oy, cx - ox) * 180) / Math.PI;
			const diff = ((angle - template.angle + 540) % 360) - 180;
			return Math.abs(diff) <= template.coneWidth / 2;
		}
		case "line": {
			const angleRad = (template.angle * Math.PI) / 180;
			const dx = cx - ox;
			const dy = cy - oy;
			// Project onto line direction
			const along = dx * Math.cos(angleRad) + dy * Math.sin(angleRad);
			if (along < 0 || along > radiusPx) return false;
			// Distance from line
			const perp = Math.abs(-dx * Math.sin(angleRad) + dy * Math.cos(angleRad));
			return perp <= gridSize / 2; // 5ft width = one grid cell
		}
		default:
			return false;
	}
}
