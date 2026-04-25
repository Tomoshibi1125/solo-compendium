export const DEFAULT_SCENE_GRID_OPACITY = 0.18;
export const GRID_VISIBILITY_PRESETS = {
	visible: 0.18,
	faded: 0.08,
	hidden: 0,
} as const;

export type VttGridVisibilityPreset = keyof typeof GRID_VISIBILITY_PRESETS;

export type VttCalibrationPoint = {
	x: number;
	y: number;
};

export interface VttBackgroundTransformInput {
	sceneWidth: number;
	sceneHeight: number;
	gridSize: number;
	zoom: number;
	backgroundScale?: number;
	backgroundOffsetX?: number;
	backgroundOffsetY?: number;
}

export interface VttBackgroundTransform {
	worldWidthPx: number;
	worldHeightPx: number;
	imageWidthPx: number;
	imageHeightPx: number;
	offsetXPx: number;
	offsetYPx: number;
	scale: number;
}

export interface CalibrateVttBackgroundInput {
	anchorPoint: VttCalibrationPoint;
	referencePoint: VttCalibrationPoint;
	gridSize: number;
	zoom: number;
	backgroundScale?: number;
	backgroundOffsetX?: number;
	backgroundOffsetY?: number;
}

export interface CalibratedVttBackground {
	backgroundScale: number;
	backgroundOffsetX: number;
	backgroundOffsetY: number;
	measuredCellPx: number;
	targetCellPx: number;
	snappedAnchor: VttCalibrationPoint;
}

const roundValue = (value: number, precision: number) => {
	const factor = 10 ** precision;
	return Math.round(value * factor) / factor;
};

export const clampVttBackgroundScale = (value?: number) => {
	if (!Number.isFinite(value)) return 1;
	return Math.min(8, Math.max(0.1, value ?? 1));
};

export const clampVttGridOpacity = (value?: number) => {
	if (!Number.isFinite(value)) return DEFAULT_SCENE_GRID_OPACITY;
	return Math.min(1, Math.max(0, value ?? DEFAULT_SCENE_GRID_OPACITY));
};

export const resolveVttGridVisibilityPreset = (
	value?: number,
): VttGridVisibilityPreset => {
	const opacity = clampVttGridOpacity(value);
	if (opacity <= 0.01) return "hidden";
	if (opacity <= 0.12) return "faded";
	return "visible";
};

export const getVttBackgroundTransform = ({
	sceneWidth,
	sceneHeight,
	gridSize,
	zoom,
	backgroundScale,
	backgroundOffsetX,
	backgroundOffsetY,
}: VttBackgroundTransformInput): VttBackgroundTransform => {
	const safeGridSize = Math.max(0, gridSize);
	const safeZoom = Math.max(0, zoom);
	const worldWidthPx = Math.max(0, sceneWidth) * safeGridSize * safeZoom;
	const worldHeightPx = Math.max(0, sceneHeight) * safeGridSize * safeZoom;
	const scale = clampVttBackgroundScale(backgroundScale);

	return {
		worldWidthPx,
		worldHeightPx,
		imageWidthPx: worldWidthPx * scale,
		imageHeightPx: worldHeightPx * scale,
		offsetXPx: (backgroundOffsetX ?? 0) * safeZoom,
		offsetYPx: (backgroundOffsetY ?? 0) * safeZoom,
		scale,
	};
};

const getMeasuredCellPx = (
	anchorPoint: VttCalibrationPoint,
	referencePoint: VttCalibrationPoint,
) => {
	const dx = Math.abs(referencePoint.x - anchorPoint.x);
	const dy = Math.abs(referencePoint.y - anchorPoint.y);
	const candidates = [dx, dy].filter((value) => value >= 6);
	if (candidates.length === 0) return null;
	if (candidates.length === 1) return candidates[0] ?? null;
	return (candidates[0] + candidates[1]) / 2;
};

export const calibrateVttBackgroundToGrid = ({
	anchorPoint,
	referencePoint,
	gridSize,
	zoom,
	backgroundScale,
	backgroundOffsetX,
	backgroundOffsetY,
}: CalibrateVttBackgroundInput): CalibratedVttBackground | null => {
	const safeZoom = Math.max(zoom, 0.01);
	const targetCellPx = Math.max(gridSize * safeZoom, 1);
	const measuredCellPx = getMeasuredCellPx(anchorPoint, referencePoint);
	if (!measuredCellPx || measuredCellPx < 1) return null;

	const currentScale = clampVttBackgroundScale(backgroundScale);
	const currentOffsetXPx = (backgroundOffsetX ?? 0) * safeZoom;
	const currentOffsetYPx = (backgroundOffsetY ?? 0) * safeZoom;
	const nextScale = clampVttBackgroundScale(
		currentScale * (targetCellPx / measuredCellPx),
	);
	const localBaseX = (anchorPoint.x - currentOffsetXPx) / currentScale;
	const localBaseY = (anchorPoint.y - currentOffsetYPx) / currentScale;
	const snappedAnchor = {
		x: roundValue(Math.round(anchorPoint.x / targetCellPx) * targetCellPx, 2),
		y: roundValue(Math.round(anchorPoint.y / targetCellPx) * targetCellPx, 2),
	};
	const nextOffsetXPx = snappedAnchor.x - localBaseX * nextScale;
	const nextOffsetYPx = snappedAnchor.y - localBaseY * nextScale;

	return {
		backgroundScale: roundValue(nextScale, 4),
		backgroundOffsetX: roundValue(nextOffsetXPx / safeZoom, 2),
		backgroundOffsetY: roundValue(nextOffsetYPx / safeZoom, 2),
		measuredCellPx: roundValue(measuredCellPx, 2),
		targetCellPx: roundValue(targetCellPx, 2),
		snappedAnchor,
	};
};
