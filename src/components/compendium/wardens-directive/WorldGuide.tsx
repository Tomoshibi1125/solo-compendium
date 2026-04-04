import { Layers, MapPin } from "lucide-react";
import { SystemHeading } from "@/components/ui/SystemText";
import { locations } from "@/data/compendium/locations";
import { getMapsForTier } from "@/lib/vtt";
import type { VTTAsset } from "@/lib/vtt/vttAssetManifest";

type RankTier = "E" | "D" | "C" | "B" | "A" | "S";

export const WorldGuide = () => {
	// Group locations by rank
	const rankedLocations = (["S", "A", "B", "C", "D"] as RankTier[]).map(
		(rank) => ({
			rank,
			sites: locations.filter((loc) => loc.rank === rank),
			// WIRING: Fetch VTT maps for this tier
			vttMaps: getMapsForTier(rank),
		}),
	);

	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<SystemHeading
					level={1}
					className="text-5xl text-emerald-400 mb-6 font-display uppercase tracking-widest"
				>
					World Directory
				</SystemHeading>
				<p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
					The appearance of Rifts fractured geographical borders, giving rise to
					localized dimensional overlaps. The Protocol Warden oversees these
					anomaly sites, classifying them by Resonance Rank (S to D). Below is
					the comprehensive directory of discovered environments.
				</p>
			</section>

			{rankedLocations.map(({ rank, sites, vttMaps }) => {
				if (sites.length === 0) return null;

				return (
					<section key={rank} className="mb-24">
						<header className="border-b border-emerald-500/30 pb-4 mb-10 flex items-end justify-between">
							<h2 className="text-4xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-4">
								<span
									className={`text-2xl font-bold px-4 py-1 rounded shadow-lg ${
										rank === "S"
											? "bg-red-500/20 text-red-500 border border-red-500/30"
											: rank === "A"
												? "bg-orange-500/20 text-orange-500 border border-orange-500/30"
												: rank === "B"
													? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
													: rank === "C"
														? "bg-blue-500/20 text-blue-500 border border-blue-500/30"
														: "bg-slate-500/20 text-slate-400 border border-slate-500/30"
									}`}
								>
									Rank {rank}
								</span>
								Threat Zones
							</h2>

							{/* WIRING: VTT Map Catalog for this Tier */}
							{vttMaps.length > 0 && (
								<div className="hidden md:flex flex-col items-end gap-2 text-emerald-500/50">
									<div className="text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2">
										<Layers className="w-3 h-3" />
										Manifested Rifts: {vttMaps.length}
									</div>
									<div className="flex -space-x-4">
										{vttMaps.slice(0, 5).map((map: VTTAsset) => (
											<div
												key={map.id}
												className="w-12 h-12 rounded-full border-2 border-void bg-emerald-950 overflow-hidden shadow-xl group/map relative cursor-pointer"
												title={`VTT Map: ${map.name}`}
											>
												<img
													src={map.thumbnail || map.path}
													alt={map.name}
													className="w-full h-full object-cover group-hover/map:scale-125 transition-transform"
												/>
											</div>
										))}
									</div>
								</div>
							)}
						</header>

						<div className="grid lg:grid-cols-2 gap-8">
							{sites.map((site) => (
								<article
									key={site.id}
									className="bg-glass/20 border border-emerald-900/40 rounded-xl overflow-hidden shadow-2xl group hover:border-emerald-500/40 transition-colors"
								>
									<div className="h-48 w-full relative overflow-hidden bg-void/80 border-b border-emerald-900/50">
										<div className="absolute inset-0 bg-gradient-to-t from-void to-transparent z-10" />
										<img
											src={site.image}
											alt={site.name}
											className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 blur-sm"
										/>
										<div className="absolute bottom-4 left-4 z-20">
											<h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider text-shadow-sm">
												{site.name}
											</h3>
											<div className="flex gap-2 mt-1">
												<span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase flex items-center gap-1">
													<MapPin className="w-3 h-3" />
													{site.type}
												</span>
											</div>
										</div>
									</div>

									<div className="p-6">
										<p className="text-sm text-slate-300 leading-relaxed mb-6 italic min-h-[80px]">
											"{site.description}"
										</p>

										<div className="grid grid-cols-2 gap-4">
											<div className="bg-void/60 p-4 rounded-sm border border-red-500/20">
												<h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 border-b border-red-500/20 pb-1">
													Known Anomalies
												</h4>
												<ul className="text-xs font-mono text-slate-300 space-y-1">
													{site.encounters.map((enc) => (
														<li key={enc}>» {enc}</li>
													))}
												</ul>
											</div>
											<div className="bg-void/60 p-4 rounded-sm border border-regent-gold/20">
												<h4 className="text-[10px] font-bold text-regent-gold uppercase tracking-widest mb-2 border-b border-regent-gold/20 pb-1">
													Discovered Relics
												</h4>
												<ul className="text-xs font-mono text-slate-300 space-y-1">
													{site.treasures.map((trs) => (
														<li key={trs}>» {trs}</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								</article>
							))}
						</div>
					</section>
				);
			})}
		</div>
	);
};
