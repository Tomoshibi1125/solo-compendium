/**
 * VTT Drawing Engine
 *
 * Freehand drawing, shape annotations, and ruler measurement for the VTT canvas.
 * Uses `perfect-freehand` for smooth pen strokes.
 */

import getStroke from 'perfect-freehand';

// ─── Types ──────────────────────────────────────────────────
export interface DrawingPoint {
    x: number;
    y: number;
    pressure?: number;
}

export interface VTTDrawing {
    id: string;
    type: 'freehand' | 'line' | 'circle' | 'rectangle' | 'cone' | 'text';
    points: DrawingPoint[];
    color: string;
    strokeWidth: number;
    fillColor?: string;
    fillOpacity?: number;
    layer: 'drawing' | 'gm';
    createdBy: string;
    createdAt: string;
    label?: string;
}

export interface MeasurementResult {
    distanceFt: number;
    distanceSquares: number;
    path: DrawingPoint[];
}

export interface MeasurementTemplate {
    id: string;
    type: 'cone' | 'sphere' | 'cube' | 'line' | 'cylinder';
    origin: DrawingPoint;
    radiusFt: number;
    directionDeg?: number; // for cone/line
    color: string;
    opacity: number;
}

// ─── Freehand Drawing ───────────────────────────────────────

/**
 * Convert raw input points to a smooth SVG path using perfect-freehand
 */
export function pointsToSVGPath(inputPoints: DrawingPoint[], strokeWidth: number = 4): string {
    const stroke = getStroke(
        inputPoints.map((p) => [p.x, p.y, p.pressure ?? 0.5]),
        {
            size: strokeWidth,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5,
            easing: (t: number) => t,
            start: { taper: 0, cap: true },
            end: { taper: 0, cap: true },
        },
    );

    if (stroke.length === 0) return '';

    const d: string[] = [];
    const [first, ...rest] = stroke;
    d.push(`M ${first[0].toFixed(1)} ${first[1].toFixed(1)}`);

    for (let i = 0; i < rest.length; i++) {
        const point = rest[i];
        const nextPoint = rest[i + 1];
        if (nextPoint) {
            const mx = ((point[0] + nextPoint[0]) / 2).toFixed(1);
            const my = ((point[1] + nextPoint[1]) / 2).toFixed(1);
            d.push(`Q ${point[0].toFixed(1)} ${point[1].toFixed(1)} ${mx} ${my}`);
        } else {
            d.push(`L ${point[0].toFixed(1)} ${point[1].toFixed(1)}`);
        }
    }

    d.push('Z');
    return d.join(' ');
}

// ─── Measurement ────────────────────────────────────────────

/**
 * Measure distance between two points in grid squares and feet (5ft/square)
 */
export function measureDistance(
    start: DrawingPoint,
    end: DrawingPoint,
    gridSize: number,
    ftPerSquare: number = 5,
): MeasurementResult {
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);

    // D&D diagonal: every other diagonal costs double (5-10-5-10...)
    const squaresX = dx / gridSize;
    const squaresY = dy / gridSize;
    const straight = Math.abs(squaresX - squaresY);
    const diagonal = Math.min(squaresX, squaresY);
    // Approximation: each diagonal = 1.5 squares (average of 5+10)
    const distanceSquares = straight + diagonal * 1.5;
    const distanceFt = Math.round(distanceSquares * ftPerSquare);

    return {
        distanceFt,
        distanceSquares: Math.round(distanceSquares * 10) / 10,
        path: [start, end],
    };
}

/**
 * Measure path distance along multiple waypoints
 */
export function measurePath(
    waypoints: DrawingPoint[],
    gridSize: number,
    ftPerSquare: number = 5,
): MeasurementResult {
    let totalFt = 0;
    let totalSquares = 0;
    for (let i = 1; i < waypoints.length; i++) {
        const seg = measureDistance(waypoints[i - 1], waypoints[i], gridSize, ftPerSquare);
        totalFt += seg.distanceFt;
        totalSquares += seg.distanceSquares;
    }
    return {
        distanceFt: Math.round(totalFt),
        distanceSquares: Math.round(totalSquares * 10) / 10,
        path: waypoints,
    };
}

// ─── Measurement Templates ──────────────────────────────────

/**
 * Generate grid cells covered by a measurement template (cone, sphere, cube, line)
 */
export function getTemplateCells(
    template: MeasurementTemplate,
    gridSize: number,
): { x: number; y: number }[] {
    const cells: { x: number; y: number }[] = [];
    const radiusCells = template.radiusFt / 5; // Convert ft to grid cells
    const ox = Math.floor(template.origin.x / gridSize);
    const oy = Math.floor(template.origin.y / gridSize);

    switch (template.type) {
        case 'sphere':
        case 'cylinder': {
            for (let dx = -radiusCells; dx <= radiusCells; dx++) {
                for (let dy = -radiusCells; dy <= radiusCells; dy++) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= radiusCells) {
                        cells.push({ x: ox + dx, y: oy + dy });
                    }
                }
            }
            break;
        }
        case 'cube': {
            const half = Math.floor(radiusCells / 2);
            for (let dx = -half; dx <= half; dx++) {
                for (let dy = -half; dy <= half; dy++) {
                    cells.push({ x: ox + dx, y: oy + dy });
                }
            }
            break;
        }
        case 'cone': {
            const dirRad = ((template.directionDeg ?? 0) * Math.PI) / 180;
            const halfAngle = (53 * Math.PI) / 360; // 53° full cone → 26.5° half-angle (5e PHB)
            for (let dx = -radiusCells; dx <= radiusCells; dx++) {
                for (let dy = -radiusCells; dy <= radiusCells; dy++) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > radiusCells || dist === 0) continue;
                    const angle = Math.atan2(dy, dx);
                    let diff = Math.abs(angle - dirRad);
                    if (diff > Math.PI) diff = 2 * Math.PI - diff;
                    if (diff <= halfAngle) {
                        cells.push({ x: ox + dx, y: oy + dy });
                    }
                }
            }
            break;
        }
        case 'line': {
            const dirRad = ((template.directionDeg ?? 0) * Math.PI) / 180;
            const cosD = Math.cos(dirRad);
            const sinD = Math.sin(dirRad);
            for (let i = 0; i <= radiusCells; i++) {
                const cx = Math.round(ox + cosD * i);
                const cy = Math.round(oy + sinD * i);
                cells.push({ x: cx, y: cy });
                // 5ft width: add adjacent cells perpendicular to line
                cells.push({ x: cx + Math.round(-sinD), y: cy + Math.round(cosD) });
            }
            break;
        }
    }

    return cells;
}

// ─── Shape Generators ───────────────────────────────────────

/**
 * Generate SVG path for a circle
 */
export function circlePath(cx: number, cy: number, r: number): string {
    return `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
}

/**
 * Generate SVG path for a rectangle
 */
export function rectPath(x1: number, y1: number, x2: number, y2: number): string {
    return `M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2} L ${x1} ${y2} Z`;
}

/**
 * Create a new drawing object
 */
export function createDrawing(
    type: VTTDrawing['type'],
    points: DrawingPoint[],
    color: string,
    strokeWidth: number,
    createdBy: string,
    layer: VTTDrawing['layer'] = 'drawing',
): VTTDrawing {
    return {
        id: `draw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        points,
        color,
        strokeWidth,
        layer,
        createdBy,
        createdAt: new Date().toISOString(),
    };
}
