import { Activity, Sparkles, User } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { SourceBookPage } from "@/components/compendium/SourceBookPage";
import { RiftHeading } from "@/components/ui/AscendantText";
import { paths } from "@/data/compendium/paths";
import { getStaticJobs } from "@/lib/ProtocolDataManager";

export const IntroChapter = () => {
	const awakeningText =
		"Beyond the veil of ordinary perception lies the Aether Lattice—an invisible network of power that governs the Remade World. While the general populace remains tethered to mundane reality, a rare few undergo 'The Awakening.' This traumatic spiritual event shatters an individual's mortal limits, forcibly opening a mana core within their soul and granting them at-will vision of the Lattice's complex interfaces.";

	const rankingText =
		"Every soul touched by the Awakening is assigned a Resonance Rank, from E to S. This rank is an immutable mark of an Ascendant's maximum potential, determined by the density of their mana core at the moment of birth into the Lattice. While most are bound to their starting rank, legends speak of the 'Zenith Anomaly'—a singular force capable of bypassing these celestial limits through infinite resonance expansion.";

	const allJobs = getStaticJobs();
	const allPaths = paths;

	return (
		<SourceBookPage title="Ascendant Awakening & Ranks">
			<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
				<section>
					<div className="flex items-center gap-3 mb-6 border-b border-cyan/20 pb-3">
						<User className="w-6 h-6 text-cyan" />
						<RiftHeading level={2} className="text-2xl text-white m-0">
							The Awakening Event
						</RiftHeading>
					</div>
					<div className="prose prose-invert max-w-none text-muted-foreground leading-loose text-sm p-4 bg-cyan/5 border border-cyan/10 rounded-sm">
						<p>
							<AutoLinkText text={awakeningText} />
						</p>
						<p>
							Awakenings typically occur during moments of extreme psychological
							stress or proximity to a high-resonance Rift. The spirit's
							survival is never guaranteed; those who emerge describe a
							sensation of being "rebound" to the world, their senses heightened
							to an unbearable degree as the Lattice's glowing glyphs manifest
							before their eyes.
						</p>
					</div>
				</section>

				<section>
					<div className="flex items-center gap-3 mb-6 border-b border-amethyst/20 pb-3">
						<Activity className="w-6 h-6 text-amethyst" />
						<RiftHeading level={2} className="text-2xl text-white m-0">
							Resonance Ranks & Distribution
						</RiftHeading>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
						{[
							{
								rank: "E-Rank",
								desc: "Support & Logistics. 40% of Ascendants.",
							},
							{
								rank: "D-Rank",
								desc: "Frontline Enforcers. 35% of Ascendants.",
							},
							{ rank: "C-Rank", desc: "Elite Strikers. 15% of Ascendants." },
							{ rank: "B-Rank", desc: "Commanders. 7% of Ascendants." },
							{ rank: "A-Rank", desc: "Grand Assets. ~2.9% of Ascendants." },
							{
								rank: "S-Rank",
								desc: "National Sovereigns. <0.1%. Living Catastrophes.",
							},
						].map((r, i) => (
							<div
								key={r.rank}
								className={`p-4 border rounded-sm flex flex-col justify-center ${i === 5 ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]" : "border-white/10 bg-white/5 text-muted-foreground"}`}
							>
								<h6 className="font-mono text-xs uppercase tracking-wider mb-2 font-bold">
									{r.rank}
								</h6>
								<p className="text-[10px] leading-tight opacity-80">{r.desc}</p>
							</div>
						))}
					</div>
					<div className="prose prose-invert max-w-none text-muted-foreground leading-loose text-sm">
						<p>
							<AutoLinkText text={rankingText} />
						</p>
					</div>
				</section>

				<div className="h-px w-full bg-gradient-to-r from-transparent via-cyan/30 to-transparent my-12" />

				<section>
					<div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-3">
						<RiftHeading level={2} className="text-2xl text-white m-0">
							Canonical Jobs
						</RiftHeading>
					</div>
					<div className="prose prose-invert max-w-none text-muted-foreground leading-loose text-sm mb-8">
						<p>
							Upon registering their mana core with the Lattice, an Ascendant is
							immediately bound to a specific Job. This Job dictates how their
							core resonates and the types of Aetheric Techniques they can
							master. There are currently {allJobs.length} documented Jobs in
							the canonical records, each with 6 unique Paths of advancement.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-4">
						{allJobs.map((job) => (
							<div
								key={job.id}
								className="p-4 bg-glass/5 border border-white/10 rounded-sm hover:border-cyan/30 transition-colors"
							>
								<div className="flex items-center justify-between mb-2">
									<h4 className="text-white font-display text-lg">
										{job.name}
									</h4>
									<span className="text-[10px] font-mono text-cyan/60 uppercase">
										Rank {job.rank} | {job.hit_dice}
									</span>
								</div>
								<p className="text-xs text-muted-foreground line-clamp-3 mb-3">
									{job.description}
								</p>
								<div className="text-[10px] font-mono text-amethyst/70">
									Primary: {(job.primary_abilities || []).join(", ")} | Saves:{" "}
									{(job.saving_throws || []).join(", ")}
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="mt-12">
					<div className="flex items-center gap-3 mb-6 border-b border-shadow-purple/20 pb-3">
						<RiftHeading level={2} className="text-2xl text-shadow-purple m-0">
							Ascendant Paths
						</RiftHeading>
					</div>
					<div className="prose prose-invert max-w-none text-muted-foreground leading-loose text-sm mb-8">
						<p>
							By surviving high-resonance anomalies or reaching a deeper
							connection with the Lattice, an Ascendant may select a specific
							Path to further specialize their mana frequency. The Lattice
							recognizes {allPaths.length} distinct Paths of evolution.
						</p>
					</div>

					<div className="space-y-6">
						{allJobs.map((job) => {
							const jobPaths = allPaths.filter((p) => p.jobId === job.id);
							return (
								<div
									key={job.id}
									className="p-4 bg-glass/5 border border-white/10 rounded-sm"
								>
									<h5 className="text-white font-display text-sm uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
										{job.name} Paths
									</h5>
									<div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
										{jobPaths.map((p) => (
											<div
												key={p.id}
												className="flex items-center gap-2 p-2 bg-void/30 rounded-sm"
											>
												<div className="w-1.5 h-1.5 rounded-full bg-shadow-purple/50 shrink-0" />
												<span className="text-xs text-muted-foreground/80 font-mono truncate">
													{p.name}
												</span>
											</div>
										))}
									</div>
								</div>
							);
						})}
					</div>
				</section>

				<div className="h-px w-full bg-gradient-to-r from-transparent via-regent-gold/30 to-transparent my-12" />

				<section>
					<div className="flex items-center gap-3 mb-6">
						<Sparkles className="w-8 h-8 text-amber-500" />
						<RiftHeading level={2} className="text-3xl text-amber-500 m-0">
							Sovereign Ascension
						</RiftHeading>
					</div>

					<div className="grid xl:grid-cols-2 gap-8 items-start">
						<div className="prose prose-invert max-w-none text-muted-foreground leading-loose text-sm">
							<p>
								For the anomaly—the singular individual chosen to wield the
								Infinite Resonance—a higher tier of existence is possible: the
								Sovereign Ascension. Unlike standard Ascendants bound to a
								single Job, a Sovereign undergoes a forced fusion of multiple
								Aetheric signatures, transcending rank and rewriting the rules
								of the Lattice itself.
							</p>
						</div>

						<div className="bg-glass/10 p-6 border border-amber-500/30 rounded-lg relative overflow-hidden group shadow-xl">
							<div className="absolute inset-0 bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-all duration-500" />
							<h4 className="text-amber-500 font-display text-lg uppercase tracking-widest mb-6">
								Ascension Requirements
							</h4>
							<ul className="space-y-4 font-mono text-xs text-amber-500/80 relative z-10">
								<li className="flex items-start gap-3">
									<span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
									<div>
										<strong className="block text-white mb-1">
											Mastered Job Core
										</strong>
										The foundation mechanics and techniques pushed to their
										absolute resonance threshold.
									</div>
								</li>
								<li className="flex items-start gap-3">
									<span className="w-2 h-2 rounded-full bg-cyan mt-1 shrink-0" />
									<div>
										<strong className="block text-white mb-1">
											Ascendant Path Echo
										</strong>
										The modifier template (e.g., Pyromancer, Shadow, Holy) fused
										into the sovereign's identity.
									</div>
								</li>
							</ul>
						</div>
					</div>
				</section>
			</div>
		</SourceBookPage>
	);
};
