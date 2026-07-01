import { Expand } from "lucide-react";
import { type MeridianDistrict, POI_KINDS } from "@/data/compendium/meridian";
import { MapCompass } from "./MapCompass";
import { ScaleBar } from "./ScaleBar";

/**
 * A single district reference map with a static, table-ready overlay: numbered
 * facility markers, a title cartouche, a compass, and a scale bar — paired with
 * a numbered "Key facilities" legend. Marker positions are representative over
 * the illustrated art, not surveyed. No VTT interaction.
 */
export function DistrictMapFigure({
	district,
	showLabels,
	kmAcross,
	onZoom,
}: {
	district: MeridianDistrict;
	showLabels: boolean;
	kmAcross: number;
	onZoom: () => void;
}) {
	const title = `${String(district.id).padStart(2, "0")} · ${district.name}`;

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
			{/* Map + overlay */}
			<figure className="space-y-2">
				<div className="relative overflow-hidden rounded-xl border border-white/10">
					<img
						src={district.map}
						alt={`${district.name} reference map`}
						className="block w-full"
						loading="lazy"
					/>

					{showLabels && (
						<svg
							className="pointer-events-none absolute inset-0 h-full w-full"
							viewBox="0 0 1000 1000"
							preserveAspectRatio="none"
							role="img"
							aria-label={`${district.name} facility overlay`}
						>
							{/* Title cartouche */}
							<rect
								x={26}
								y={26}
								width={Math.min(620, 60 + title.length * 11)}
								height={48}
								rx={8}
								fill="rgba(8,12,20,0.72)"
								stroke="rgba(255,255,255,0.18)"
							/>
							<text x={44} y={56} fontSize={24} fontWeight={700} fill="#e2f5ff">
								{title}
							</text>

							{/* Numbered facility markers */}
							{district.pois.map((poi, i) => {
								const color = POI_KINDS[poi.kind].color;
								const cx = poi.x * 1000;
								const cy = poi.y * 1000;
								return (
									<g key={poi.name}>
										<circle
											cx={cx}
											cy={cy}
											r={20}
											fill="rgba(8,12,20,0.82)"
											stroke={color}
											strokeWidth={4}
										/>
										<text
											x={cx}
											y={cy}
											textAnchor="middle"
											dominantBaseline="central"
											fontSize={22}
											fontWeight={700}
											fill={color}
										>
											{i + 1}
										</text>
									</g>
								);
							})}

							<MapCompass />
							<ScaleBar kmAcross={kmAcross} />
						</svg>
					)}

					<button
						type="button"
						onClick={onZoom}
						className="no-print absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs text-white/80 backdrop-blur-sm transition-opacity hover:bg-black/80"
					>
						<Expand className="h-3.5 w-3.5" /> View
					</button>
				</div>
			</figure>

			{/* District info + facility key */}
			<div className="space-y-3">
				<div>
					<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
						{district.tagline}
					</p>
					<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
						{district.summary}
					</p>
				</div>

				<div className="space-y-2 rounded-lg border border-white/10 bg-white/5 p-3">
					<p className="text-xs font-semibold uppercase tracking-wider text-cyan-300/80">
						Key Facilities
					</p>
					<ol className="space-y-1.5">
						{district.pois.map((poi, i) => {
							const k = POI_KINDS[poi.kind];
							return (
								<li key={poi.name} className="flex items-center gap-2 text-sm">
									<span
										className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
										style={{
											backgroundColor: `${k.color}26`,
											color: k.color,
											border: `1px solid ${k.color}80`,
										}}
									>
										{i + 1}
									</span>
									<span aria-hidden="true" style={{ color: k.color }}>
										{k.glyph}
									</span>
									<span className="font-medium text-foreground">
										{poi.name}
									</span>
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</div>
	);
}
