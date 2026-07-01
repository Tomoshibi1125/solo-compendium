import { Eye, EyeOff, Printer } from "lucide-react";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MERIDIAN } from "@/data/compendium/meridian";
import "@/styles/meridian-print.css";
import { DistrictMapFigure } from "./meridian/DistrictMapFigure";
import { MeridianCityMapFigure } from "./meridian/MeridianCityMapFigure";
import { MeridianMapLegend } from "./meridian/MeridianMapLegend";

/**
 * Static gazetteer for Meridian — the canon hub city presented as readable
 * sourcebook content with a table-ready vector overlay: the city map with a
 * numbered district overlay and master legend, then each district map with
 * facility pins and a key. Click any map to view it full-size, or print the
 * whole thing as a GM handout. No virtual-tabletop interaction.
 */
export function MeridianAtlas() {
	const [zoom, setZoom] = useState<{ src: string; title: string } | null>(null);
	const [showLabels, setShowLabels] = useState(true);
	const [activeId, setActiveId] = useState<number | null>(null);
	const sectionRefs = useRef<Record<number, HTMLElement | null>>({});

	const focusDistrict = (id: number) => {
		setActiveId(id);
		sectionRefs.current[id]?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	return (
		<div className="meridian-print-root space-y-10">
			{/* Header */}
			<header className="space-y-3">
				<h1 className="text-3xl font-bold tracking-tight">{MERIDIAN.name}</h1>
				<p className="text-sm font-medium uppercase tracking-wider text-cyan-300/80">
					{MERIDIAN.tagline}
				</p>
				<p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
					{MERIDIAN.overview}
				</p>

				{/* Controls */}
				<div className="no-print flex flex-wrap items-center gap-2 pt-1">
					<button
						type="button"
						onClick={() => setShowLabels((v) => !v)}
						aria-pressed={showLabels}
						className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-white/10"
					>
						{showLabels ? (
							<EyeOff className="h-3.5 w-3.5" />
						) : (
							<Eye className="h-3.5 w-3.5" />
						)}
						{showLabels ? "Hide map labels" : "Show map labels"}
					</button>
					<button
						type="button"
						onClick={() => window.print()}
						className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-white/10"
					>
						<Printer className="h-3.5 w-3.5" /> Print / Save as PDF
					</button>
				</div>
			</header>

			{/* City map + master legend */}
			<section className="space-y-4 print-avoid-break">
				<MeridianCityMapFigure
					showLabels={showLabels}
					activeId={activeId}
					onHoverDistrict={setActiveId}
					onSelectDistrict={focusDistrict}
					onZoom={() =>
						setZoom({
							src: MERIDIAN.cityMap,
							title: `${MERIDIAN.name} — city map`,
						})
					}
				/>
				<MeridianMapLegend onSelectDistrict={focusDistrict} />
			</section>

			{/* Districts */}
			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Districts</h2>
				{MERIDIAN.districts.map((d) => (
					<article
						key={d.id}
						ref={(el) => {
							sectionRefs.current[d.id] = el;
						}}
						className="scroll-mt-20 rounded-xl border border-white/10 bg-white/5 p-4 print-page print-avoid-break"
					>
						<div className="mb-3 flex items-baseline gap-2">
							<span className="text-xs font-bold text-cyan-300/70">
								{String(d.id).padStart(2, "0")}
							</span>
							<h3 className="text-lg font-semibold leading-tight">{d.name}</h3>
						</div>
						<DistrictMapFigure
							district={d}
							showLabels={showLabels}
							kmAcross={MERIDIAN.districtScaleKmAcross}
							onZoom={() => setZoom({ src: d.map, title: d.name })}
						/>
					</article>
				))}
			</section>

			{/* Full-size viewer */}
			<Dialog open={!!zoom} onOpenChange={(o) => !o && setZoom(null)}>
				<DialogContent className="max-w-6xl p-2">
					{zoom && (
						<>
							<DialogTitle className="px-2 pt-1 text-sm font-medium">
								{zoom.title}
							</DialogTitle>
							<img
								src={zoom.src}
								alt={zoom.title}
								className="max-h-[80vh] w-full rounded-lg object-contain"
							/>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
