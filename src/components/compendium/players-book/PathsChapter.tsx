import { Shield } from "lucide-react";
import { SystemHeading } from "@/components/ui/SystemText";
import { jobs } from "@/data/compendium/jobs";
import { paths } from "@/data/compendium/paths";

export const PathsChapter = () => {
	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<SystemHeading level={1} className="text-5xl text-cyan mb-6">
					Specialized Paths
				</SystemHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					As an Ascendant's mana core matures, they unlock deeper
					specializations within their Job. These Paths dictate unique combat
					styles, specialized techniques, and exclusive Awakening features.
				</p>
			</section>

			{jobs.map((job) => {
				const jobPaths = paths.filter((p) => p.jobId === job.id);
				if (jobPaths.length === 0) return null;

				return (
					<section key={job.id} className="mb-16">
						<header className="border-b border-cyan/30 pb-4 mb-8 flex items-center justify-between">
							<h2 className="text-3xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
								<Shield className="w-6 h-6 text-cyan" />
								{job.name} Paths
							</h2>
							<span className="text-cyan/50 font-mono text-sm uppercase">
								Base Job
							</span>
						</header>

						<div className="grid lg:grid-cols-2 gap-8">
							{jobPaths.map((path) => (
								<article
									key={path.id}
									className="bg-glass border border-white/10 rounded-lg p-6 hover:border-cyan/30 transition-colors shadow-lg"
								>
									<h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
										{path.name}
									</h3>

									<p className="text-slate-300 italic mb-6 leading-relaxed bg-void/50 p-4 rounded-sm border-l-4 border-cyan/40 text-sm">
										{path.description}
									</p>

									<div className="space-y-4">
										<h4 className="text-xs font-bold text-cyan uppercase tracking-widest mb-2 border-b border-cyan/20 pb-1">
											Path Progression
										</h4>
										{path.features?.map((feat) => (
											<div
												key={feat.name}
												className="bg-void/80 border border-white/5 p-4 rounded-sm"
											>
												<div className="flex items-center justify-between mb-2">
													<h5 className="font-bold text-white flex items-center gap-2">
														<span className="w-1.5 h-1.5 bg-cyan rounded-full shrink-0" />
														{feat.name}
													</h5>
													<span className="text-[10px] font-mono bg-cyan/10 text-cyan px-2 py-0.5 rounded border border-cyan/20">
														Level {feat.level}
													</span>
												</div>
												<p className="text-xs text-muted-foreground leading-relaxed">
													{feat.description}
												</p>
											</div>
										))}
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
