import { Expand } from "lucide-react";
import { MERIDIAN } from "@/data/compendium/meridian";
import { MapCompass } from "./MapCompass";
import { ScaleBar } from "./ScaleBar";

/**
 * The Meridian city overview map with a static vector overlay: an always-on
 * numbered marker per district, the district footprint highlighted on hover /
 * focus, plus a compass and scale bar. Clicking a marker focuses that district's
 * section. This is reference furniture only — no VTT tokens, grid, or panning.
 */
export function MeridianCityMapFigure({
	showLabels,
	activeId,
	onHoverDistrict,
	onSelectDistrict,
	onZoom,
}: {
	showLabels: boolean;
	activeId: number | null;
	onHoverDistrict: (id: number | null) => void;
	onSelectDistrict: (id: number) => void;
	onZoom: () => void;
}) {
	return (
		<figure className="space-y-2">
			<div className="relative overflow-hidden rounded-xl border border-white/10">
				<img
					src={MERIDIAN.cityMap}
					alt={`Map of ${MERIDIAN.name}`}
					className="block w-full"
					loading="lazy"
				/>

				{showLabels && (
					<svg
						className="pointer-events-none absolute inset-0 h-full w-full"
						viewBox="0 0 1000 1000"
						preserveAspectRatio="none"
						role="img"
						aria-label={`${MERIDIAN.name} district overlay`}
					>
						{/* Active district footprint */}
						{MERIDIAN.districts.map((d) => {
							if (d.id !== activeId) return null;
							const r = d.cityRegion;
							return (
								<rect
									key={`zone-${d.id}`}
									x={r.x * 1000}
									y={r.y * 1000}
									width={r.w * 1000}
									height={r.h * 1000}
									rx={10}
									fill="rgba(34,211,238,0.12)"
									stroke="#22d3ee"
									strokeWidth={3}
								/>
							);
						})}

						<MapCompass />
						<ScaleBar kmAcross={MERIDIAN.cityScaleKmAcross} />
					</svg>
				)}

				{/* Numbered district markers — real buttons over the map (no VTT) */}
				{showLabels &&
					MERIDIAN.districts.map((d) => {
						const active = d.id === activeId;
						return (
							<button
								key={`pin-${d.id}`}
								type="button"
								aria-label={`Locate ${d.name}`}
								onMouseEnter={() => onHoverDistrict(d.id)}
								onMouseLeave={() => onHoverDistrict(null)}
								onFocus={() => onHoverDistrict(d.id)}
								onBlur={() => onHoverDistrict(null)}
								onClick={() => onSelectDistrict(d.id)}
								style={{
									left: `${d.cityPin.x * 100}%`,
									top: `${d.cityPin.y * 100}%`,
								}}
								className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-bold transition-transform hover:scale-110 focus:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
									active
										? "scale-110 border-white bg-cyan-400 text-cyan-950"
										: "border-cyan-400 bg-slate-950/80 text-cyan-200"
								}`}
							>
								{d.id}
							</button>
						);
					})}

				<button
					type="button"
					onClick={onZoom}
					className="no-print absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs text-white/80 backdrop-blur-sm transition-opacity hover:bg-black/80"
				>
					<Expand className="h-3.5 w-3.5" /> View full size
				</button>
			</div>
			<figcaption className="text-xs text-muted-foreground">
				The city of Meridian. Hover or tap a numbered marker to locate a
				district. Scale and marker positions are approximate.
			</figcaption>
		</figure>
	);
}
