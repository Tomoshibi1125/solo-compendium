import { RiftHeading } from "@/components/ui/AscendantText";
import { comprehensiveFeats } from "@/data/compendium/feats-comprehensive";

export const FeatsChapter = () => {
	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<RiftHeading level={1} className="text-5xl text-cyan mb-6">
					Feats & Augmentations
				</RiftHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					As an Ascendant masters their potential, the Rift rewards them with
					profound enhancements to their physical and magical capabilities.
					These augmentations provide unique tactical advantages beyond basic
					attribute increases.
				</p>
			</section>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{comprehensiveFeats.map((feat) => (
					<article
						key={feat.id}
						className="bg-glass/20 border border-white/10 rounded-lg p-5 shadow-lg hover:border-cyan/30 transition-colors flex flex-col"
					>
						<header className="mb-4">
							<h2 className="text-lg font-display font-bold text-white uppercase tracking-wider leading-tight">
								{feat.name}
							</h2>
							{feat.mechanics && (
								<span className="text-[10px] font-mono text-cyan/70 uppercase tracking-widest mt-1 block">
									{feat.mechanics.type} • {feat.mechanics.frequency}
								</span>
							)}
						</header>

						<div className="prose prose-invert text-sm text-slate-300 leading-relaxed mb-4 flex-1">
							<p className="italic text-white/70 border-l-2 border-cyan/20 pl-3 py-1 mb-4">
								{feat.description}
							</p>

							<ul className="space-y-2 mt-4 list-disc pl-4 marker:text-cyan/50 text-xs">
								{Array.isArray(feat.benefits)
									? feat.benefits.map((benefit: string) => (
											<li key={benefit}>{benefit}</li>
										))
									: (
											feat.benefits as unknown as Record<string, string[]>
										)?.basic?.map((benefit: string) => (
											<li key={benefit}>{benefit}</li>
										))}
							</ul>
						</div>

						{feat.prerequisites &&
							Object.keys(feat.prerequisites).length > 0 && (
								<div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-muted-foreground flex gap-3 flex-wrap">
									<span className="text-white/40">PREREQ:</span>
									{(feat.prerequisites as unknown as Record<string, number>)
										.level && (
										<span>
											Level{" "}
											{
												(
													feat.prerequisites as unknown as Record<
														string,
														number
													>
												).level
											}
										</span>
									)}
									{(feat.prerequisites as unknown as Record<string, string>)
										.ability && (
										<span>
											{
												(
													feat.prerequisites as unknown as Record<
														string,
														string
													>
												).ability
											}{" "}
											{
												(
													feat.prerequisites as unknown as Record<
														string,
														number
													>
												).score
											}
										</span>
									)}
									{(feat.prerequisites as unknown as Record<string, string[]>)
										.feats && (
										<span>
											{(
												feat.prerequisites as unknown as Record<
													string,
													string[]
												>
											).feats.join(", ")}
										</span>
									)}
								</div>
							)}

						{feat.flavor && (
							<div className="mt-4 bg-void/50 p-2 rounded text-[10px] italic text-cyan/50 text-center">
								"{feat.flavor}"
							</div>
						)}
					</article>
				))}
			</div>
		</div>
	);
};
