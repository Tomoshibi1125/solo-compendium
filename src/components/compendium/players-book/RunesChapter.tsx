import { Hexagon } from "lucide-react";
import { RiftHeading } from "@/components/ui/AscendantText";
import { sigils } from "@/data/compendium/sigils";

export const RunesChapter = () => {
	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<RiftHeading level={1} className="text-5xl text-regent-gold mb-6">
					Runes & Sigils
				</RiftHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					When an Anomaly is defeated, it occasionally leaves behind
					crystallized fragments of its essence known as Runestones. By
					absorbing these stones, Ascendants can learn abilities outside their
					Job's natural progression. Sigils, on the other hand, are permanent
					geometrical mana-brands carved onto equipment.
				</p>
			</section>

			<div className="grid lg:grid-cols-2 gap-8">
				{sigils.map((sigil) => (
					<article
						key={sigil.id}
						className="bg-glass/20 border border-regent-gold/20 p-6 rounded-lg relative overflow-hidden group"
					>
						<div className="absolute top-0 right-0 w-32 h-32 bg-regent-gold/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-regent-gold/10 transition-colors" />

						<div className="flex justify-between items-start mb-4 relative z-10">
							<div>
								<h3 className="text-xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
									<Hexagon className="w-4 h-4 text-regent-gold" />
									{sigil.name}
								</h3>
								<p className="text-[10px] font-mono text-regent-gold/70 tracking-widest uppercase mt-1">
									Vibration Level: {sigil.rune_level} / Type: {sigil.rune_type}
								</p>
							</div>
						</div>

						<p className="text-sm text-slate-300 leading-relaxed mb-6 italic pl-4 border-l-2 border-regent-gold/30">
							{sigil.description}
						</p>

						<div className="bg-void/60 border border-white/5 rounded-sm p-4 relative z-10 space-y-3">
							<h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">
								Amplification Effects
							</h4>
							<p className="text-xs font-mono text-white/90">
								{sigil.effect_description}
							</p>
						</div>
					</article>
				))}
			</div>
		</div>
	);
};
