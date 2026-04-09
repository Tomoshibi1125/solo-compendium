import { Target } from "lucide-react";
import { RiftHeading } from "@/components/ui/AscendantText";
import { techniques } from "@/data/compendium/techniques";

export const TechniquesChapter = () => {
	// Group by style for organization
	const styles = Array.from(new Set(techniques.map((t) => t.style)));

	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<RiftHeading level={1} className="text-5xl text-red-400 mb-6">
					Martial Techniques
				</RiftHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					While Spells draw purely on Aether to manipulate reality, Techniques
					represent the absolute pinnacle of physical mastery. These are kinetic
					and martial arts that have been systemized, allowing Ascendants to
					shatter armor, deflect projectiles, and warp space through sheer
					physical force.
				</p>
			</section>

			{styles.map((style) => {
				const styleTechniques = techniques.filter((t) => t.style === style);

				return (
					<section key={style} className="mb-12">
						<h2 className="text-3xl font-display font-bold text-white uppercase tracking-widest border-b border-red-500/30 pb-3 mb-8 flex items-center gap-3">
							<Target className="w-6 h-6 text-red-500" />
							{style.charAt(0).toUpperCase() + style.slice(1)} Forms
						</h2>

						<div className="grid lg:grid-cols-2 gap-6">
							{styleTechniques.map((tech) => (
								<article
									key={tech.id}
									className="bg-glass/20 border border-white/10 p-6 rounded-lg hover:border-red-500/40 transition-colors"
								>
									<div className="flex justify-between items-start mb-3">
										<h3 className="text-xl font-display font-bold text-white uppercase m-0">
											{tech.name}
										</h3>
										<span className="text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded uppercase tracking-widest">
											{tech.type}
										</span>
									</div>

									<p className="text-sm text-slate-300 italic mb-4 leading-relaxed bg-void/50 p-3 rounded-sm border-l-2 border-red-500/40">
										{tech.description}
									</p>

									<div className="space-y-4 text-xs">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
													Activation
												</h4>
												<p className="font-mono text-white">
													{tech.activation &&
													typeof tech.activation === "object"
														? `${tech.activation.cost || tech.activation.type}`
														: `${tech.activation}`}
												</p>
											</div>
											{tech.range && (
												<div>
													<h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
														Range
													</h4>
													<p className="font-mono text-white">
														{typeof tech.range === "object"
															? tech.range.distance
																? `${tech.range.distance} ft`
																: tech.range.type
															: tech.range}
													</p>
												</div>
											)}
										</div>

										<div className="bg-void/80 p-3 rounded-sm border border-white/5 space-y-2">
											{typeof tech.effects === "object" &&
												!Array.isArray(tech.effects) &&
												(tech.effects as unknown as Record<string, string>)
													.primary && (
													<div className="flex gap-2">
														<span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 shrink-0" />
														<p className="text-slate-300">
															{
																(
																	tech.effects as unknown as Record<
																		string,
																		string
																	>
																).primary
															}
														</p>
													</div>
												)}
											{typeof tech.effects === "object" &&
												!Array.isArray(tech.effects) &&
												(tech.effects as unknown as Record<string, string>)
													.secondary && (
													<div className="flex gap-2">
														<span className="w-1.5 h-1.5 bg-red-400/70 rounded-full mt-1 shrink-0" />
														<p className="text-slate-300">
															{
																(
																	tech.effects as unknown as Record<
																		string,
																		string
																	>
																).secondary
															}
														</p>
													</div>
												)}
											{typeof tech.effects === "object" &&
												!Array.isArray(tech.effects) &&
												(tech.effects as unknown as Record<string, string>)
													.tertiary && (
													<div className="flex gap-2">
														<span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-1 shrink-0" />
														<p className="text-slate-300">
															{
																(
																	tech.effects as unknown as Record<
																		string,
																		string
																	>
																).tertiary
															}
														</p>
													</div>
												)}
										</div>

										<div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-3 border-t border-white/10">
											<span>{tech.limitations.uses}</span>
											{tech.limitations.recharge && (
												<span>Refresh: {tech.limitations.recharge}</span>
											)}
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
