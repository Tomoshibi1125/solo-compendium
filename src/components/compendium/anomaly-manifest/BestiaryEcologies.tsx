import {
	BoxSelect,
	Ghost,
	Globe,
	Microscope,
	ShieldAlert,
	Skull,
	Sparkles,
	Zap,
} from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { SourceBookPage } from "@/components/compendium/SourceBookPage";
import { RiftHeading } from "@/components/ui/AscendantText";
import { regents } from "@/data/compendium/regents";

export const BestiaryEcologies = () => {
	const originText =
		"Anomalies are not born through natural biological processes; they are manifested by the Lattice's response to dimensional dissonance. When a high-resonance Rift opens, the Lattice shapes the entropic energy into physical forms that our reality can stabilize—drawing from humanity's collective unconscious. This is why many Anomalies resemble mythical terrors like dragons or specters rather than formless void-horrors.";

	const umbralText =
		"The Umbral Legion represents the absolute mastery of Shadow Resonance. When a Shadow Sovereign defeats a high-rank Anomaly, they can extract its 'Shadow'—the residual mana essence—before it dissipates back into the Lattice. This echo is then re-bound to the Sovereign's own core, becoming a loyal Umbral Soldier. These entities are no longer Anomalies; they are manifestations of the master's own power, sustained by their mana reserve.";

	const sortedRegents = [...regents].sort((a, b) =>
		a.name.localeCompare(b.name),
	);

	return (
		<SourceBookPage title="The Science of Anomalies">
			<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
				{/* 1. Header Section */}
				<section className="text-center mb-16">
					<RiftHeading
						level={1}
						className="text-5xl text-red-500 mb-6 font-display uppercase tracking-widest"
					>
						Anomaly Ecologies
					</RiftHeading>
					<p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
						Anomalies do not spawn in a vacuum. This directory provides a
						biological and aetheric analysis of Rift environments—how mana
						radiation mutates native matter and the hierarchy of the Apex Nodes.
					</p>
				</section>

				{/* 2. The Origin of Anomalies */}
				<section className="relative p-8 bg-glass border border-red-950/30 rounded-xl overflow-hidden shadow-2xl">
					<div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
					<div className="flex items-center gap-4 mb-8 border-b border-red-500/20 pb-4">
						<BoxSelect className="w-8 h-8 text-red-500" />
						<h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
							Aetheric Origins
						</h2>
					</div>
					<div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm">
						<div className="p-6 bg-red-500/5 border-l-4 border-red-500/50 italic mb-8">
							<AutoLinkText text={originText} />
						</div>

						<div className="grid md:grid-cols-2 gap-8">
							<div className="space-y-4">
								<h4 className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
									<Microscope className="w-4 h-4" /> Mutation Mechanics
								</h4>
								<p className="text-xs text-slate-400 font-light">
									Native lifeforms caught within a growing Rift undergo radical
									hyper-evolution. A simple organism might mutate into a Dire
									Anomaly within hours due to concentrated Aether exposure. The
									ecosystem stabilizes rapidly under the control of the Apex
									Node.
								</p>
							</div>
							<div className="space-y-4">
								<h4 className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
									<Globe className="w-4 h-4" /> Environmental Shift
								</h4>
								<p className="text-xs text-slate-400 font-light">
									A Rift's climate always reflects the dominant soul-signature
									of its Boss. The transition from Earth's atmosphere to the
									interior of a Rift often results in instant environmental
									shock, requiring specialized Relics for survival.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* 3. Catastrophe Class Records */}
				<section className="space-y-8">
					<div className="flex items-center gap-3 mb-2 border-b border-amber-500/20 pb-4">
						<ShieldAlert className="w-8 h-8 text-amber-500" />
						<h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
							Registered Sovereign Anomalies
						</h2>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{sortedRegents.map((regent) => (
							<div
								key={regent.id}
								className="bg-void/60 border border-white/5 p-5 rounded-lg hover:border-red-500/30 transition-all group"
							>
								<h3 className="text-white font-display uppercase tracking-widest text-base mb-1 group-hover:text-red-400 transition-colors">
									{regent.name}
								</h3>
								<div className="flex items-center gap-2 mb-3">
									<span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-widest">
										Rank: {regent.rank || "S"}
									</span>
									<span className="text-white/20 text-xs">|</span>
									<span className="text-[10px] font-mono text-slate-500 uppercase">
										{regent.theme || "Sovereign"}
									</span>
								</div>
								<p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
									{regent.description}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* 4. The Umbral Legion */}
				<section className="p-8 bg-void border border-fuchsia-900/30 rounded-xl relative shadow-2xl">
					<div className="absolute inset-0 bg-fuchsia-500/5 blur-xl pointer-events-none" />
					<div className="flex items-center gap-3 mb-8 border-b border-fuchsia-500/20 pb-4 relative z-10">
						<Ghost className="w-8 h-8 text-fuchsia-400 animate-pulse" />
						<h2 className="text-3xl font-display font-bold text-fuchsia-400 uppercase tracking-wider">
							The Umbral Legion
						</h2>
					</div>

					<div className="grid lg:grid-cols-3 gap-8 relative z-10">
						<div className="lg:col-span-2 space-y-6">
							<p className="text-sm text-slate-300 leading-relaxed font-light italic border-l-4 border-fuchsia-400/50 pl-6 py-2 bg-fuchsia-500/5">
								<AutoLinkText text={umbralText} />
							</p>
							<div className="grid sm:grid-cols-2 gap-6">
								<div className="bg-fuchsia-950/20 p-5 rounded border border-fuchsia-500/20 shadow-inner">
									<h4 className="text-[10px] font-bold text-fuchsia-400 uppercase mb-3 flex items-center gap-2">
										<Sparkles className="w-3 h-3" /> Extraction Laws
									</h4>
									<ul className="text-[10px] text-slate-400 space-y-2 list-disc pl-4 font-mono leading-relaxed">
										<li>The target's core must be neutralized.</li>
										<li>
											Extraction must occur within 180 seconds of vital
											collapse.
										</li>
										<li>
											Probability scales with the Sovereign's Soul-Resonance.
										</li>
									</ul>
								</div>
								<div className="bg-fuchsia-950/20 p-5 rounded border border-fuchsia-500/20 shadow-inner">
									<h4 className="text-[10px] font-bold text-fuchsia-400 uppercase mb-3 flex items-center gap-2">
										<Zap className="w-3 h-3" /> Sustenance Protocol
									</h4>
									<ul className="text-[10px] text-slate-400 space-y-2 list-disc pl-4 font-mono leading-relaxed">
										<li>
											Shadow Soldiers consume a passive mana-drain from the
											host.
										</li>
										<li>Destruction of the Umbral essence is permanent.</li>
										<li>
											Legion capacity is capped by the host's Shadow Rank.
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="bg-glass border border-fuchsia-500/10 p-8 rounded-lg flex flex-col items-center justify-center text-center group">
							<Skull className="w-16 h-16 text-fuchsia-900 mb-6 group-hover:text-fuchsia-400 transition-colors duration-500" />
							<h4 className="text-slate-200 font-display uppercase tracking-widest text-lg mb-2">
								The Command: RISE
							</h4>
							<p className="text-[10px] text-slate-500 leading-relaxed font-mono italic">
								"Step forth from the void and serve the shadow that claimed
								you."
							</p>
						</div>
					</div>
				</section>
			</div>
		</SourceBookPage>
	);
};
