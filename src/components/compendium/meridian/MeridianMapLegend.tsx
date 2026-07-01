import { MERIDIAN, POI_KINDS, type PoiKind } from "@/data/compendium/meridian";

/**
 * Master legend / key for the Meridian atlas: the numbered district index and
 * the facility-symbol key shared by every district map. Rendered under the city
 * map and included in the print handout.
 */

// Only surface the facility kinds that actually appear on a map, in a stable order.
const KEY_ORDER: PoiKind[] = [
	"bureau",
	"civic",
	"guild",
	"market",
	"entertainment",
	"hospital",
	"research",
	"transit",
	"industry",
	"port",
	"harbor",
	"residential",
];

export function MeridianMapLegend({
	onSelectDistrict,
}: {
	onSelectDistrict?: (id: number) => void;
}) {
	return (
		<div className="grid grid-cols-1 gap-6 rounded-xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
			{/* District index */}
			<div className="space-y-2">
				<h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300/80">
					District Index
				</h3>
				<ol className="space-y-1.5">
					{MERIDIAN.districts.map((d) => (
						<li key={d.id}>
							<button
								type="button"
								onClick={() => onSelectDistrict?.(d.id)}
								className="group flex w-full items-baseline gap-2 text-left text-sm"
							>
								<span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-500/20 text-xs font-bold text-cyan-200">
									{d.id}
								</span>
								<span className="font-medium text-foreground group-hover:underline">
									{d.name}
								</span>
							</button>
						</li>
					))}
				</ol>
			</div>

			{/* Facility symbol key */}
			<div className="space-y-2">
				<h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300/80">
					Facility Key
				</h3>
				<ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
					{KEY_ORDER.map((kind) => {
						const k = POI_KINDS[kind];
						return (
							<li key={kind} className="flex items-center gap-2 text-sm">
								<span
									aria-hidden="true"
									className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
									style={{
										backgroundColor: `${k.color}26`,
										color: k.color,
										border: `1px solid ${k.color}80`,
									}}
								>
									{k.glyph}
								</span>
								<span className="text-muted-foreground">{k.label}</span>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
