import { Shield } from "lucide-react";
import { RiftHeading } from "@/components/ui/AscendantText";
import { jobs } from "@/data/compendium/jobs";
import { paths } from "@/data/compendium/paths";

export const JobsChapter = () => {
	// Group paths by job for easy rendering
	const pathsByJob = paths.reduce(
		(acc, path) => {
			if (!acc[path.jobId]) acc[path.jobId] = [];
			acc[path.jobId].push(path);
			return acc;
		},
		{} as Record<string, typeof paths>,
	);

	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<RiftHeading level={1} className="text-5xl text-cyan mb-6">
					The Paths of Ascension
				</RiftHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					Upon Awakening, every Ascendant is classified by the Rift into a
					specific Job category. This Job dictates the fundamental nature of
					their mana core, their physical capabilities, and the baseline skills
					they can manifest. Below are the canonical Jobs recognized by the
					System.
				</p>
			</section>

			{jobs.map((job) => (
				<article
					key={job.id}
					className="relative bg-glass/20 border border-white/10 rounded-xl overflow-hidden p-8 shadow-2xl"
				>
					{/* Decorative background overlay */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

					<header className="flex flex-col md:flex-row md:items-end justify-between border-b border-cyan/30 pb-6 mb-8 relative z-10">
						<div>
							<div className="flex items-center gap-3 mb-2">
								<h2 className="text-4xl font-display font-bold text-white uppercase tracking-wider m-0">
									{job.name}
								</h2>
								<span className="px-3 py-1 bg-cyan/10 border border-cyan/30 text-cyan font-mono text-xs font-bold rounded-sm uppercase">
									Rank {job.rank}
								</span>
							</div>
							<p className="text-cyan/70 font-mono text-sm uppercase tracking-widest">
								{job.type} / Hit Die: {job.hitDie} / Primary:{" "}
								{job.primaryAbility}
							</p>
						</div>
					</header>

					<div className="grid lg:grid-cols-3 gap-12 relative z-10">
						<div className="lg:col-span-2 space-y-8">
							<div className="prose prose-invert max-w-none text-muted-foreground text-sm leading-loose">
								<p className="text-base text-white/90 italic mb-6 border-l-4 border-cyan/40 pl-4 py-2 bg-cyan/5">
									{job.description}
								</p>
							</div>

							<div>
								<h3 className="text-xl font-display text-cyan border-b border-cyan/20 pb-2 mb-4 uppercase">
									Awakening Features
								</h3>
								<div className="space-y-4">
									{job.awakeningFeatures.map((feat) => (
										<div
											key={feat.name}
											className="bg-void/50 border border-white/5 p-4 rounded-sm"
										>
											<h4 className="text-white font-bold mb-2 flex items-center gap-2">
												<span className="w-1.5 h-1.5 bg-cyan rounded-full" />
												{feat.name}
											</h4>
											<p className="text-sm text-muted-foreground leading-relaxed">
												{feat.description}
											</p>
										</div>
									))}
								</div>
							</div>

							<div>
								<h3 className="text-xl font-display text-cyan border-b border-cyan/20 pb-2 mb-4 uppercase">
									Class Progression
								</h3>
								<div className="bg-void/50 border border-white/5 rounded-sm overflow-hidden">
									<table className="w-full text-xs font-mono text-left">
										<thead className="bg-cyan/10 border-b border-cyan/20 text-cyan">
											<tr>
												<th className="p-3">Level</th>
												<th className="p-3">Feature</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-white/5 disabled">
											{job.classFeatures?.map((cf) => (
												<tr
													key={`${cf.level}-${cf.name}`}
													className="hover:bg-white/5 transition-colors"
												>
													<td className="p-3 w-16 text-center border-r border-white/5">
														{cf.level}
													</td>
													<td className="p-3">
														<strong className="text-white mr-2">
															{cf.name}:
														</strong>
														<span className="text-muted-foreground">
															{cf.description}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>

						<div className="space-y-6">
							<div className="bg-void/80 border border-white/10 p-5 rounded-sm">
								<h3 className="text-sm font-bold text-amethyst uppercase tracking-widest border-b border-amethyst/20 pb-2 mb-4">
									Proficiencies
								</h3>
								<ul className="space-y-3 text-xs font-mono text-muted-foreground">
									<li>
										<strong className="text-white block mb-1">Weapons</strong>
										{job.weaponProficiencies.join(", ")}
									</li>
									<li>
										<strong className="text-white block mb-1">Armor</strong>
										{job.armorProficiencies.join(", ")}
									</li>
									<li>
										<strong className="text-white block mb-1">
											Saving Throws
										</strong>
										{job.saving_throws.join(", ")}
									</li>
									<li>
										<strong className="text-white block mb-1">
											Skills (Choose)
										</strong>
										{job.skillChoices.join(", ")}
									</li>
								</ul>
							</div>

							<div className="bg-void/80 border border-white/10 p-5 rounded-sm">
								<h3 className="text-sm font-bold text-amethyst uppercase tracking-widest border-b border-amethyst/20 pb-2 mb-4">
									Base Statistics
								</h3>
								<div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
									<div className="p-2 border border-white/5 rounded-sm bg-white/5">
										<div className="text-muted-foreground mb-1">STR</div>
										<div className="text-white font-bold">
											{job.stats.strength}
										</div>
									</div>
									<div className="p-2 border border-white/5 rounded-sm bg-white/5">
										<div className="text-muted-foreground mb-1">AGI</div>
										<div className="text-white font-bold">
											{job.stats.agility}
										</div>
									</div>
									<div className="p-2 border border-white/5 rounded-sm bg-white/5">
										<div className="text-muted-foreground mb-1">VIT</div>
										<div className="text-white font-bold">
											{job.stats.vitality}
										</div>
									</div>
									<div className="p-2 border border-white/5 rounded-sm bg-white/5">
										<div className="text-muted-foreground mb-1">INT</div>
										<div className="text-white font-bold">
											{job.stats.intelligence}
										</div>
									</div>
									<div className="p-2 border border-white/5 rounded-sm bg-white/5">
										<div className="text-muted-foreground mb-1">SEN</div>
										<div className="text-white font-bold">
											{job.stats.sense}
										</div>
									</div>
									<div className="p-2 border border-white/5 rounded-sm bg-white/5">
										<div className="text-muted-foreground mb-1">PRE</div>
										<div className="text-white font-bold">
											{job.stats.presence}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Specialized Paths nested at the bottom of the job */}
					<div className="mt-12 pt-8 border-t border-white/10 relative z-10">
						<h3 className="text-2xl font-display text-white mb-6 flex items-center gap-3">
							<Shield className="w-6 h-6 text-amethyst" />
							Specialized Paths
						</h3>
						<div className="grid md:grid-cols-2 gap-4">
							{pathsByJob[job.id]?.map((p) => (
								<div
									key={p.id}
									className="bg-void/40 border border-white/5 p-4 rounded-sm hover:border-amethyst/30 transition-colors"
								>
									<h4 className="text-amethyst font-bold uppercase tracking-widest text-sm mb-2">
										{p.name}
									</h4>
									<p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
										{p.description}
									</p>
									<div className="text-[10px] font-mono text-cyan/70">
										{p.features?.length || 0} Path Features Detected
									</div>
								</div>
							))}
						</div>
					</div>
				</article>
			))}
		</div>
	);
};
