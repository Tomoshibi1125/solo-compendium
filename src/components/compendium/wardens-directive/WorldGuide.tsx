import { MapPin } from "lucide-react";
import { RiftHeading } from "@/components/ui/AscendantText";
import { locations } from "@/data/compendium/locations";

type RankTier = "E" | "D" | "C" | "B" | "A" | "S";

export const WorldGuide = () => {
	// Group locations by rank
	const rankedLocations = (["S", "A", "B", "C", "D"] as RankTier[]).map(
		(rank) => ({
			rank,
			sites: locations.filter((loc) => loc.rank === rank),
		}),
	);

	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<RiftHeading
					level={1}
					className="text-5xl text-system-green mb-6 font-display uppercase tracking-widest"
				>
					World Directory
				</RiftHeading>
				<p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
					The appearance of Rifts fractured geographical borders, giving rise to
					localized dimensional overlaps. The Warden oversees these anomaly
					sites, classifying them by Resonance Rank (S to D). Below is the
					comprehensive directory of discovered environments.
				</p>
			</section>

			{rankedLocations.map(({ rank, sites }) => {
				if (sites.length === 0) return null;

				return (
					<section key={rank} className="mb-24">
						<header className="border-b border-system-green/30 pb-4 mb-10 flex items-end justify-between">
							<h2 className="text-4xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-4">
								<span
									className={`text-2xl font-bold px-4 py-1 rounded shadow-lg ${
										rank === "S"
											? "bg-red-500/20 text-red-500 border border-red-500/30"
											: rank === "A"
												? "bg-gate-a/20 text-gate-a border border-gate-a/30"
												: rank === "B"
													? "bg-gate-s/20 text-gate-s border border-gate-s/30"
													: rank === "C"
														? "bg-blue-500/20 text-blue-500 border border-blue-500/30"
														: "bg-slate-500/20 text-slate-400 border border-slate-500/30"
									}`}
								>
									Rank {rank}
								</span>
								Threat Zones
							</h2>
						</header>

						<div className="grid lg:grid-cols-2 gap-8">
							{sites.map((site) => (
								<article
									key={site.id}
									className="bg-glass/20 border border-system-green/40 rounded-xl overflow-hidden shadow-2xl group hover:border-system-green/40 transition-colors"
								>
									<div className="h-48 w-full relative overflow-hidden bg-void/80 border-b border-system-green/40">
										<div className="absolute inset-0 bg-gradient-to-t from-void to-transparent z-10" />
										<img
											src={site.image || ""}
											alt={site.name}
											className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 blur-sm"
										/>
										<div className="absolute bottom-4 left-4 z-20">
											<h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider text-shadow-sm">
												{site.name}
											</h3>
											<div className="flex gap-2 mt-1">
												<span className="text-[10px] font-mono bg-system-green/20 text-system-green border border-system-green/30 px-2 py-0.5 rounded uppercase flex items-center gap-1">
													<MapPin className="w-3 h-3" />
													{site.type}
												</span>
											</div>
										</div>
									</div>

									<div className="p-6">
										<p className="text-sm text-slate-300 leading-relaxed mb-6 italic min-h-[80px]">
											"{site.description || ""}"
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
