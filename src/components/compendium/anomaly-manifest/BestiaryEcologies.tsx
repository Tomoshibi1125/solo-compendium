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
import { anomalies } from "@/data/compendium/anomalies";

export const BestiaryEcologies = () => {
	const originText =
		"Anomalies are biological, living creatures that reproduce naturally and evolve based on the specific Rift they originate from.";

	const umbralText =
		"The Umbral Legion is an ability of the Umbral Regent. Its raised soldiers are manifestations of that Regent's power, not living Anomaly companions. A living tamed Anomaly keeps its own biology, belongs to the character who holds it, and scales with that character's level.";

	const notableAnomalies = anomalies
		.filter((entry) => entry.rank === "A" || entry.rank === "S")
		.slice(0, 6)
		.sort((a, b) => a.name.localeCompare(b.name));

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
						biological and ecological analysis of Rift environments, including
						Anomaly habitats, life cycles, and relationships with other species.
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
									<Microscope className="w-4 h-4" /> Native Biology
								</h4>
								<p className="text-xs text-slate-400 font-light">
									Anomaly species are native to Rift worlds. Their anatomy,
									reproduction, feeding, and behavior vary by species and
									habitat.
								</p>
							</div>
							<div className="space-y-4">
								<h4 className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
									<Globe className="w-4 h-4" /> Environmental Shift
								</h4>
								<p className="text-xs text-slate-400 font-light">
									Rift worlds have their own climates and food webs. Conditions
									at each threshold determine which species thrive there and
									what field precautions an expedition needs.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* 3. Catastrophe Class Records */}
				<section className="space-y-8">
					<div className="flex items-center gap-3 mb-2 border-b border-gate-s/20 pb-4">
						<ShieldAlert className="w-8 h-8 text-gate-s" />
						<h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
							Notable Anomaly Species
						</h2>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{notableAnomalies.map((anomaly) => (
							<div
								key={anomaly.id}
								className="bg-void/60 border border-white/5 p-5 rounded-lg hover:border-red-500/30 transition-all group"
							>
								<h3 className="text-white font-display uppercase tracking-widest text-base mb-1 group-hover:text-red-400 transition-colors">
									{anomaly.name}
								</h3>
								<div className="flex items-center gap-2 mb-3">
									<span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-widest">
										Rank: {anomaly.rank || "unknown"}
									</span>
									<span className="text-white/20 text-xs">|</span>
									<span className="text-[10px] font-mono text-slate-500 uppercase">
										{anomaly.type || "Anomaly"}
									</span>
								</div>
								<p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
									{anomaly.description}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* 4. The Umbral Legion */}
				<section className="p-8 bg-void border border-resurge-violet/30 rounded-xl relative shadow-2xl">
					<div className="absolute inset-0 bg-resurge-violet/5 blur-xl pointer-events-none" />
					<div className="flex items-center gap-3 mb-8 border-b border-resurge-violet/20 pb-4 relative z-10">
						<Ghost className="w-8 h-8 text-resurge-violet animate-pulse" />
						<h2 className="text-3xl font-display font-bold text-resurge-violet uppercase tracking-wider">
							The Umbral Legion
						</h2>
					</div>

					<div className="grid lg:grid-cols-3 gap-8 relative z-10">
						<div className="lg:col-span-2 space-y-6">
							<p className="text-sm text-slate-300 leading-relaxed font-light italic border-l-4 border-resurge-violet/50 pl-6 py-2 bg-resurge-violet/5">
								<AutoLinkText text={umbralText} />
							</p>
							<div className="grid sm:grid-cols-2 gap-6">
								<div className="bg-resurge-violet/20 p-5 rounded border border-resurge-violet/20 shadow-inner">
									<h4 className="text-[10px] font-bold text-resurge-violet uppercase mb-3 flex items-center gap-2">
										<Sparkles className="w-3 h-3" /> Extraction Laws
									</h4>
									<ul className="text-[10px] text-slate-400 space-y-2 list-disc pl-4 font-mono leading-relaxed">
										<li>The target's core must be neutralized.</li>
										<li>
											Extraction must occur within 180 seconds of vital
											collapse.
										</li>
										<li>Effects follow the Umbral Regent's authored rules.</li>
									</ul>
								</div>
								<div className="bg-resurge-violet/20 p-5 rounded border border-resurge-violet/20 shadow-inner">
									<h4 className="text-[10px] font-bold text-resurge-violet uppercase mb-3 flex items-center gap-2">
										<Zap className="w-3 h-3" /> Sustenance Protocol
									</h4>
									<ul className="text-[10px] text-slate-400 space-y-2 list-disc pl-4 font-mono leading-relaxed">
										<li>
											Umbral Legionnaires consume a passive mana-drain from the
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

						<div className="bg-glass border border-resurge-violet/10 p-8 rounded-lg flex flex-col items-center justify-center text-center group">
							<Skull className="w-16 h-16 text-resurge-violet mb-6 group-hover:text-resurge-violet transition-colors duration-500" />
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
