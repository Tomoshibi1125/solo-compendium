import { Crown, ShieldAlert, Sparkles, Stars } from "lucide-react";
import { RiftHeading } from "@/components/ui/AscendantText";
import { PRIME_PANTHEON } from "@/data/compendium/pantheon";
import { regents } from "@/data/compendium/regents";

export const PantheonChapter = () => {
	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<RiftHeading level={1} className="text-5xl text-fuchsia-400 mb-6">
					The Echelon of Balance
				</RiftHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					Beyond the physical constraints of the Grid exist the
					Eternals—god-like beings who maintain the existential equilibrium of
					the Remade World. Wardens must document these Sovereigns, as their
					influence governs the very laws of Awakening and the containment of
					the Sprawl.
				</p>
			</section>

			{/* The Prime Pantheon */}
			<section className="space-y-12">
				<div className="flex items-center gap-3 mb-8 border-b border-fuchsia-500/20 pb-4">
					<Stars className="w-8 h-8 text-fuchsia-400" />
					<h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
						The Prime Pantheon (Eternals)
					</h2>
				</div>

				<div className="grid gap-8">
					{PRIME_PANTHEON.map((deity) => (
						<article
							key={deity.id}
							className="bg-glass border border-fuchsia-900/30 rounded-xl overflow-hidden shadow-2xl relative p-8"
						>
							<div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

							<div className="relative z-10 grid md:grid-cols-3 gap-8">
								<div className="md:col-span-1 border-r border-fuchsia-500/20 pr-8">
									<div className="flex items-center gap-2 mb-2">
										<Crown className="w-5 h-5 text-fuchsia-400" />
										<span className="text-[10px] font-mono text-fuchsia-300 uppercase tracking-widest">
											{deity.rank}
										</span>
									</div>
									<h3 className="text-3xl font-display font-bold text-white uppercase mb-1">
										{deity.name}
									</h3>
									<p className="text-xs text-fuchsia-400/80 italic mb-4">
										{deity.display_name}
									</p>
									<div className="space-y-4">
										<div className="bg-void/40 p-3 rounded border border-white/5">
											<h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
												Directive
											</h4>
											<p className="text-xs font-mono text-white/90">
												{deity.directive}
											</p>
										</div>
										<div className="bg-void/40 p-3 rounded border border-white/5">
											<h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
												Sigil
											</h4>
											<p className="text-xs text-slate-300 italic">
												{deity.sigil}
											</p>
										</div>
									</div>
								</div>

								<div className="md:col-span-2 space-y-6">
									<p className="text-sm text-slate-300 leading-relaxed border-l-2 border-fuchsia-500/30 pl-4 py-1 italic">
										{deity.description}
									</p>

									<div className="grid sm:grid-cols-2 gap-6">
										<div>
											<h4 className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mb-2 flex items-center gap-1">
												<Sparkles className="w-3 h-3" /> Core Domains
											</h4>
											<div className="flex flex-wrap gap-2">
												{(deity.specializations ?? []).map((spec: string) => (
													<span
														key={spec}
														className="px-2 py-0.5 bg-fuchsia-500/10 text-fuchsia-300 text-[10px] border border-fuchsia-500/20 rounded-full font-mono"
													>
														{spec}
													</span>
												))}
											</div>
										</div>
										<div>
											<h4 className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mb-2 flex items-center gap-1">
												<ShieldAlert className="w-3 h-3" /> Manifestation
											</h4>
											<p className="text-xs text-slate-400">
												{deity.manifestation}
											</p>
										</div>
									</div>

									<div>
										<h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
											Lore Record
										</h4>
										<p className="text-[11px] text-slate-400 leading-relaxed">
											{typeof deity.lore === "string" ? deity.lore : ""}
										</p>
									</div>
								</div>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* Regent Overlays */}
			<section className="space-y-12">
				<div className="flex items-center gap-3 mb-8 border-b border-fuchsia-500/20 pb-4">
					<Sparkles className="w-8 h-8 text-fuchsia-400" />
					<h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
						Regent Class Overlays
					</h2>
				</div>

				<div className="grid gap-12">
					{regents.map((regent) => (
						<article
							key={regent.id}
							className="bg-glass border border-fuchsia-900/50 rounded-xl overflow-hidden shadow-2xl relative"
						>
							<div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

							<div className="flex flex-col md:flex-row">
								<div className="md:w-1/3 bg-void/80 p-8 border-r border-fuchsia-900/30 flex flex-col items-center text-center justify-center relative z-10">
									<Crown className="w-16 h-16 text-fuchsia-400 mb-4 opacity-80" />
									<h3 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">
										{regent.name}
									</h3>
									<p className="text-fuchsia-300 font-mono text-sm uppercase tracking-widest mb-4">
										{regent.title}
									</p>
									<span className="px-4 py-1 bg-red-500/20 text-red-400 font-bold border border-red-500/40 rounded-sm font-mono text-sm shadow-lg">
										Rank {regent.rank} Sovereign
									</span>
								</div>

								<div className="md:w-2/3 p-8 relative z-10 space-y-6">
									<p className="text-sm text-slate-300 leading-relaxed italic border-l-4 border-fuchsia-500/50 pl-4 bg-fuchsia-500/5 py-4">
										{regent.description}
									</p>

									<div className="grid sm:grid-cols-2 gap-4">
										<div className="bg-void/60 p-4 rounded-sm border border-white/5 space-y-2">
											<h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 pb-1">
												Sovereign Domain
											</h4>
											<p className="text-xs font-mono text-white/90">
												{regent.theme}
											</p>
										</div>
										<div className="bg-void/60 p-4 rounded-sm border border-white/5 space-y-2">
											<h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 pb-1">
												Vitality Resonance (Hit Dice)
											</h4>
											<p className="text-xs font-mono text-white/90">
												{regent.hit_dice}
											</p>
										</div>
									</div>

									<div>
										<h4 className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest mb-3 border-b border-fuchsia-500/20 pb-1">
											Sovereign Job Features
										</h4>
										<div className="grid sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
											{regent.class_features?.map((feat) => (
												<div
													key={feat.name}
													className="bg-void p-3 rounded border border-white/5 hover:border-fuchsia-500/30 transition-colors"
												>
													<h5 className="text-white font-bold text-xs mb-1 flex justify-between">
														<span>{feat.name}</span>
														<span className="text-fuchsia-500/70 font-mono">
															Lv {feat.level}
														</span>
													</h5>
													<p
														className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2"
														title={feat.description}
													>
														{feat.description}
													</p>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</article>
					))}
				</div>
			</section>
		</div>
	);
};
