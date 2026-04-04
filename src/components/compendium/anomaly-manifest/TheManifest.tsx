import { Fingerprint, Radio } from "lucide-react";
import { SystemHeading } from "@/components/ui/SystemText";
import { anomalies } from "@/data/compendium/anomalies";
import { getAnomalyTokensForTier, getAssetsByCategory } from "@/lib/vtt";
import type { VTTAsset } from "@/lib/vtt/vttAssetManifest";

type RankTier = "E" | "D" | "C" | "B" | "A" | "S";

export const TheManifest = () => {
	const vttTokenCount = getAssetsByCategory("token").length;
	// Sort anomalies by Rank S -> A -> B -> C -> D
	const rankOrder: Record<string, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };
	const sortedAnomalies = [...anomalies].sort((a, b) => {
		const rankDiff =
			(rankOrder[b.rank || ""] || 0) - (rankOrder[a.rank || ""] || 0);
		if (rankDiff !== 0) return rankDiff;
		return a.name.localeCompare(b.name);
	});

	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
			<section className="text-center mb-16 relative">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 opacity-10 pointer-events-none">
					<Fingerprint className="w-32 h-32 text-orange-500" />
				</div>
				<SystemHeading
					level={1}
					className="text-5xl text-orange-500 mb-6 font-display uppercase tracking-widest"
				>
					The Anomaly Manifest
				</SystemHeading>
				<p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto mb-8">
					The absolute registry of dimensional entities documented by the
					Ascendant Bureau. Anomalies are beings warped by Aether into walking
					nightmares. Their Resonance Ranks range from localized threats to
					Sovereign-tier catastrophes.
				</p>
				<div className="inline-flex items-center gap-4 px-6 py-2 bg-orange-500/5 border border-orange-500/20 rounded-full text-[10px] uppercase font-mono text-orange-500/80 tracking-[0.2em]">
					<Radio className="w-3 h-3 animate-pulse" />
					Lattice Sync Active: {vttTokenCount} Spirits Documented
				</div>
			</section>

			<div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
				{sortedAnomalies.slice(0, 50).map(
					(
						anomaly, // Limiting to top 50 in DOM for performance, rendering high threats first!
					) => (
						<article
							key={anomaly.id}
							className="bg-glass/20 border border-orange-900/40 rounded-xl overflow-hidden shadow-2xl flex flex-col hover:border-orange-500/40 transition-colors"
						>
							<header className="p-5 border-b border-orange-500/20 bg-void/80 flex items-start justify-between gap-4">
								<div>
									<h3 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-1 line-clamp-1">
										{anomaly.name}
									</h3>
									<p className="text-[10px] font-mono text-orange-400/80 uppercase tracking-widest">
										{anomaly.type}
									</p>
								</div>
								<span
									className={`shrink-0 px-3 py-1 font-mono text-xl font-bold rounded border uppercase shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
										anomaly.rank === "S"
											? "bg-red-500/20 text-red-500 border-red-500/50"
											: anomaly.rank === "A"
												? "bg-orange-500/20 text-orange-500 border-orange-500/50"
												: anomaly.rank === "B"
													? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
													: "bg-slate-500/20 text-slate-400 border-slate-500/50"
									}`}
								>
									{anomaly.rank}
								</span>
							</header>

							<div className="p-5 flex-1 flex flex-col">
								{/* WIRING: Display VTT Tokens for this anomaly rank/type */}
								{(() => {
									const rank = anomaly.rank as RankTier;
									const tokens = getAnomalyTokensForTier(rank)
										.filter((t: VTTAsset) =>
											t.tags.some(
												(tag: string) =>
													anomaly.name
														.toLowerCase()
														.includes(tag.toLowerCase()) ||
													anomaly.type
														?.toLowerCase()
														.includes(tag.toLowerCase()),
											),
										)
										.slice(0, 3);

									if (tokens.length === 0) return null;

									return (
										<div className="flex gap-2 mb-4 bg-orange-500/5 p-2 rounded border border-orange-500/10">
											<div className="text-[8px] uppercase font-mono text-orange-500/50 [writing-mode:vertical-lr] rotate-180">
												VTT Spirits
											</div>
											<div className="flex gap-2">
												{tokens.map((token: VTTAsset) => (
													<div
														key={token.id}
														className="w-8 h-8 rounded-full border border-orange-500/30 bg-void flex items-center justify-center p-1 group/token relative cursor-help"
														title={`VTT Template: ${token.name}`}
													>
														<img
															src={token.path}
															alt={token.name}
															className="w-full h-full object-contain opacity-50 group-hover/token:opacity-100 transition-opacity"
														/>
													</div>
												))}
											</div>
										</div>
									);
								})()}

								<div className="text-xs text-slate-300 italic mb-4 line-clamp-3 bg-void/40 p-3 rounded-sm border-l-2 border-orange-500/40">
									{anomaly.description}
								</div>

								<div className="space-y-4 flex-1">
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-void/60 p-3 rounded-sm border border-white/5">
											<h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 border-b border-white/10 pb-1">
												Defenses
											</h4>
											<div className="text-xs font-mono text-white/90">
												AC: {anomaly.armor_class || anomaly.ac || "?"} <br />
												HP: {anomaly.hit_points || anomaly.hp || "?"}
											</div>
										</div>
										<div className="bg-void/60 p-3 rounded-sm border border-white/5">
											<h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 border-b border-white/10 pb-1">
												Speed
											</h4>
											<div className="text-xs font-mono text-white/90">
												{anomaly.speed || "30 ft."}
											</div>
										</div>
									</div>

									<div className="bg-void/60 p-3 rounded-sm border border-white/5 mt-auto">
										<h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2 border-b border-orange-500/20 pb-1">
											Attributes
										</h4>
										<div className="flex justify-between text-[10px] font-mono text-center">
											<div>
												<div className="text-slate-500 mb-0.5">STR</div>
												<div
													className={
														(anomaly.stats?.ability_scores?.strength || 10) > 15
															? "text-orange-400 font-bold"
															: "text-slate-300"
													}
												>
													{anomaly.stats?.ability_scores?.strength || 10}
												</div>
											</div>
											<div>
												<div className="text-slate-500 mb-0.5">AGI</div>
												<div
													className={
														(anomaly.stats?.ability_scores?.agility || 10) > 15
															? "text-orange-400 font-bold"
															: "text-slate-300"
													}
												>
													{anomaly.stats?.ability_scores?.agility || 10}
												</div>
											</div>
											<div>
												<div className="text-slate-500 mb-0.5">VIT</div>
												<div
													className={
														(anomaly.stats?.ability_scores?.vitality || 10) > 15
															? "text-orange-400 font-bold"
															: "text-slate-300"
													}
												>
													{anomaly.stats?.ability_scores?.vitality || 10}
												</div>
											</div>
											<div>
												<div className="text-slate-500 mb-0.5">INT</div>
												<div
													className={
														(anomaly.stats?.ability_scores?.intelligence ||
															10) > 15
															? "text-orange-400 font-bold"
															: "text-slate-300"
													}
												>
													{anomaly.stats?.ability_scores?.intelligence || 10}
												</div>
											</div>
											<div>
												<div className="text-slate-500 mb-0.5">SEN</div>
												<div
													className={
														(anomaly.stats?.ability_scores?.sense || 10) > 15
															? "text-orange-400 font-bold"
															: "text-slate-300"
													}
												>
													{anomaly.stats?.ability_scores?.sense || 10}
												</div>
											</div>
											<div>
												<div className="text-slate-500 mb-0.5">PRE</div>
												<div
													className={
														(anomaly.stats?.ability_scores?.presence || 10) > 15
															? "text-orange-400 font-bold"
															: "text-slate-300"
													}
												>
													{anomaly.stats?.ability_scores?.presence || 10}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</article>
					),
				)}
			</div>
			{sortedAnomalies.length > 50 && (
				<div className="text-center p-8 text-orange-500/50 font-mono text-xs uppercase tracking-widest">
					... And {sortedAnomalies.length - 50} more lower-threat entries in the
					archives. Seek Protocol Warden clearance for full D-Rank Bestiary.
				</div>
			)}
		</div>
	);
};
