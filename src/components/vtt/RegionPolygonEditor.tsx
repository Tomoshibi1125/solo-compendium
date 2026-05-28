import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Misty Pearl A3 polish — drag-vertex polygon editor.
 *
 * Embedded inside `RegionConfigDialog`'s Polygon tab. Renders the
 * region's polygon as an SVG mini-canvas where each vertex is a
 * draggable handle. Clicking a midpoint between two vertices inserts
 * a new vertex; clicking a vertex's trash button removes it.
 *
 * Coordinates are in scene-pixel units (same shape as the canvas
 * uses). The editor scales them to fit a 320×320 viewport with a
 * 12px margin so polygons of any size remain editable.
 *
 * Pure UI — no scene mutation. Bubbles vertex changes via `onChange`.
 */
export interface RegionPolygonEditorProps {
	polygon: Array<{ x: number; y: number }>;
	onChange: (next: Array<{ x: number; y: number }>) => void;
}

const VIEWPORT = 320;
const MARGIN = 12;

interface Viewbox {
	minX: number;
	minY: number;
	width: number;
	height: number;
	scale: number;
}

function computeViewbox(
	polygon: Array<{ x: number; y: number }>,
): Viewbox {
	if (polygon.length === 0) {
		return { minX: -100, minY: -100, width: 200, height: 200, scale: 1 };
	}
	const xs = polygon.map((p) => p.x);
	const ys = polygon.map((p) => p.y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);
	const w = Math.max(50, maxX - minX);
	const h = Math.max(50, maxY - minY);
	const usable = VIEWPORT - MARGIN * 2;
	const scale = Math.min(usable / w, usable / h);
	return {
		minX,
		minY,
		width: w,
		height: h,
		scale,
	};
}

function worldToScreen(p: { x: number; y: number }, vb: Viewbox) {
	return {
		x: MARGIN + (p.x - vb.minX) * vb.scale,
		y: MARGIN + (p.y - vb.minY) * vb.scale,
	};
}

function screenToWorld(p: { x: number; y: number }, vb: Viewbox) {
	return {
		x: vb.minX + (p.x - MARGIN) / vb.scale,
		y: vb.minY + (p.y - MARGIN) / vb.scale,
	};
}

export function RegionPolygonEditor({
	polygon,
	onChange,
}: RegionPolygonEditorProps) {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const viewbox = useMemo(() => computeViewbox(polygon), [polygon]);

	// Build the screen-space path for rendering.
	const screenPoints = polygon.map((p) => worldToScreen(p, viewbox));
	const pathD =
		screenPoints.length === 0
			? ""
			: `M ${screenPoints
					.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
					.join(" L ")} Z`;

	useEffect(() => {
		if (dragIndex === null) return;
		const onMove = (evt: PointerEvent) => {
			const svg = svgRef.current;
			if (!svg) return;
			const rect = svg.getBoundingClientRect();
			const screenX = evt.clientX - rect.left;
			const screenY = evt.clientY - rect.top;
			const world = screenToWorld({ x: screenX, y: screenY }, viewbox);
			const next = polygon.slice();
			next[dragIndex] = {
				x: Math.round(world.x),
				y: Math.round(world.y),
			};
			onChange(next);
		};
		const onUp = () => setDragIndex(null);
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
		};
	}, [dragIndex, polygon, viewbox, onChange]);

	const insertVertexBetween = (afterIndex: number) => {
		const a = polygon[afterIndex];
		const b = polygon[(afterIndex + 1) % polygon.length];
		if (!a || !b) return;
		const mid = {
			x: Math.round((a.x + b.x) / 2),
			y: Math.round((a.y + b.y) / 2),
		};
		const next = [
			...polygon.slice(0, afterIndex + 1),
			mid,
			...polygon.slice(afterIndex + 1),
		];
		onChange(next);
	};

	const removeVertex = (index: number) => {
		if (polygon.length <= 3) return; // a polygon needs ≥3 vertices
		const next = polygon.filter((_, i) => i !== index);
		onChange(next);
	};

	return (
		<div
			className="space-y-2"
			data-testid="region-polygon-editor"
			role="region"
			aria-label="Region polygon editor"
		>
			<p className="text-xs text-muted-foreground">
				Drag the round handles to reshape the region. Click the **+** on any
				edge to insert a new vertex. A polygon needs at least 3 vertices.
			</p>
			<div className="inline-block rounded-md border border-border/60 bg-muted/30 p-2">
				<svg
					ref={svgRef}
					width={VIEWPORT}
					height={VIEWPORT}
					viewBox={`0 0 ${VIEWPORT} ${VIEWPORT}`}
					className="block"
					role="img"
					aria-label="Polygon editor canvas"
				>
					<title>Region polygon editor</title>
					{/* Polygon fill */}
					{pathD && (
						<path
							d={pathD}
							fill="currentColor"
							fillOpacity={0.18}
							stroke="currentColor"
							strokeWidth={1.5}
							className="text-primary"
						/>
					)}
					{/* Edge midpoint "+" insert handles */}
					{screenPoints.map((p, i) => {
						const next = screenPoints[(i + 1) % screenPoints.length];
						if (!next) return null;
						const mid = { x: (p.x + next.x) / 2, y: (p.y + next.y) / 2 };
						return (
							<g key={`mid-${i}`}>
								<circle
									cx={mid.x}
									cy={mid.y}
									r={6}
									className="fill-muted stroke-primary cursor-pointer"
									strokeWidth={1}
									onClick={() => insertVertexBetween(i)}
								/>
								<text
									x={mid.x}
									y={mid.y + 3}
									textAnchor="middle"
									className="fill-foreground text-[10px] pointer-events-none select-none"
								>
									+
								</text>
							</g>
						);
					})}
					{/* Vertex handles */}
					{screenPoints.map((p, i) => (
						<g key={`v-${i}`}>
							<circle
								cx={p.x}
								cy={p.y}
								r={7}
								className="fill-primary stroke-foreground cursor-grab"
								strokeWidth={1.5}
								onPointerDown={(e) => {
									e.preventDefault();
									setDragIndex(i);
								}}
								data-testid={`region-polygon-vertex-${i}`}
							/>
						</g>
					))}
				</svg>
			</div>
			<div className="space-y-1.5 max-h-32 overflow-y-auto">
				{polygon.map((v, i) => (
					<div
						key={`vrow-${i}-${v.x}-${v.y}`}
						className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground"
					>
						<span className="w-6 text-right">#{i}</span>
						<span className="flex-1">
							({v.x}, {v.y})
						</span>
						<Button
							size="icon"
							variant="ghost"
							className="h-6 w-6"
							onClick={() => insertVertexBetween(i)}
							aria-label={`Insert vertex after vertex ${i}`}
						>
							<Plus className="w-3 h-3" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							className="h-6 w-6 text-destructive"
							onClick={() => removeVertex(i)}
							disabled={polygon.length <= 3}
							aria-label={`Remove vertex ${i}`}
						>
							<Trash2 className="w-3 h-3" />
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}

export default RegionPolygonEditor;
