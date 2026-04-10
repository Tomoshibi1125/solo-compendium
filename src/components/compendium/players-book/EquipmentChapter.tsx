import { Package } from "lucide-react";
import { RiftHeading } from "@/components/ui/AscendantText";
import { comprehensiveRelics } from "@/data/compendium/relics-comprehensive";

export const EquipmentChapter = () => {
	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<RiftHeading level={1} className="text-5xl text-regent-gold mb-6">
					Relics & Artifacts
				</RiftHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					Beyond standard armaments, the Rift provisions powerful Relics—weapons
					and armor forged from condensed Aether or harvested from the remains
					of high-ranking Anomalies. These items defy physics and grant immense
					power to those who can attune to their resonance.
				</p>
			</section>

			<div className="grid lg:grid-cols-2 gap-8">
				{comprehensiveRelics.map((relic) => (
					<article
						key={relic.id}
						className="bg-glass/20 border border-regent-gold/20 rounded-xl overflow-hidden shadow-2xl flex flex-col group hover:border-regent-gold/40 transition-colors"
					>
						<header className="p-6 border-b border-regent-gold/20 bg-void/70 relative">
							<div className="absolute top-0 right-0 w-32 h-32 bg-regent-gold/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-regent-gold/10 transition-colors" />
							<div className="relative z-10">
								<h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-2">
									{relic.name}
								</h3>
								<div className="flex gap-2 text-[10px] font-mono tracking-widest uppercase">
									<span className="bg-regent-gold/20 text-regent-gold border border-regent-gold/30 px-2 py-0.5 rounded">
										{relic.rarity.replace("_", " ")}
									</span>
									<span className="bg-white/10 text-slate-300 border border-white/20 px-2 py-0.5 rounded">
										{relic.type}
									</span>
									{relic.attunement && (
										<span className="bg-cyan/20 text-cyan border border-cyan/30 px-2 py-0.5 rounded">
											Requires Attunement
										</span>
									)}
								</div>
							</div>
						</header>

						<div className="p-6 flex-1 flex flex-col space-y-6">
							<p className="text-sm text-slate-300 italic leading-relaxed border-l-2 border-regent-gold/40 pl-4 bg-regent-gold/5 py-3">
								"{relic.description}"
							</p>

							<div className="space-y-4 flex-1">
								<div>
									<h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">
										Arsenal Abilities
									</h4>
									<div className="space-y-3">
										{relic.abilities.map((ability) => (
											<div
												key={ability.name}
												className="bg-void/50 p-3 rounded-sm border border-white/5"
											>
												<h5 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
													<span>{ability.name}</span>
													<span className="text-[10px] font-mono text-slate-500 uppercase">
														{(ability as unknown as Record<string, string>)
															.type ?? "Active"}{" "}
														•{" "}
														{(ability as unknown as Record<string, string>)
															.frequency ?? "Passive"}
													</span>
												</h5>
												<p className="text-xs text-muted-foreground leading-relaxed">
													{ability.description}
												</p>
											</div>
										))}
									</div>
								</div>

								{relic.lore && (
									<div className="bg-void/80 p-4 rounded-sm border border-white/10 mt-auto">
										<h4 className="text-[10px] font-bold text-regent-gold uppercase tracking-widest mb-2 flex items-center gap-2">
											<Package className="w-3 h-3" />
											System Lore Record
										</h4>
										<p className="text-xs text-slate-400 leading-relaxed">
											<strong className="text-slate-300">Origin:</strong>{" "}
											{relic.lore.origin}
										</p>
										<p className="text-xs text-slate-400 leading-relaxed mt-2">
											<strong className="text-slate-300">History:</strong>{" "}
											{relic.lore.history}
										</p>
									</div>
								)}
							</div>
						</div>
					</article>
				))}
			</div>
		</div>
	);
};
