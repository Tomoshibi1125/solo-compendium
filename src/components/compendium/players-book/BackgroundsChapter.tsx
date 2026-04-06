import { Shield } from "lucide-react";
import { RiftHeading } from "@/components/ui/AscendantText";
import { allBackgrounds } from "@/data/compendium/backgrounds-index";

export const BackgroundsChapter = () => {
	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<RiftHeading level={1} className="text-5xl text-amethyst mb-6">
					Ancestries & Origins
				</RiftHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					Before the Awakening, every Ascendant lived a mundane life. This
					history fundamentally shapes how their mana core develops and provides
					foundational proficiencies. Review the origins below to establish your
					Ascendant's starting capabilities.
				</p>
			</section>

			<div className="grid lg:grid-cols-2 gap-8">
				{allBackgrounds.map((bg) => (
					<article
						key={bg.id}
						className="bg-glass/20 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col hover:border-amethyst/30 transition-all duration-300"
					>
						<header className="p-6 border-b border-amethyst/30 bg-void/50">
							<h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider m-0 flex justify-between items-center">
								{bg.name}
							</h2>
						</header>

						<div className="p-6 space-y-6 flex-1 flex flex-col">
							<div className="prose prose-invert max-w-none text-muted-foreground text-sm leading-loose border-l-2 border-amethyst/40 pl-4">
								<p>{bg.description}</p>
							</div>

							<div className="space-y-4 flex-1">
								<div className="grid grid-cols-2 gap-4">
									<div className="bg-void/80 p-3 rounded-sm border border-white/5">
										<h4 className="text-[10px] font-bold text-amethyst uppercase tracking-widest mb-1">
											Skill Proficiencies
										</h4>
										<p className="text-xs text-white font-mono">
											{(bg.skill_proficiencies || []).join(", ")}
										</p>
									</div>
									<div className="bg-void/80 p-3 rounded-sm border border-white/5">
										<h4 className="text-[10px] font-bold text-amethyst uppercase tracking-widest mb-1">
											Tool / Language
										</h4>
										<p className="text-xs text-white font-mono">
											{bg.tool_proficiencies?.join(", ") ||
												bg.languages?.join(", ") ||
												"None"}
										</p>
									</div>
								</div>

								{bg.equipment && (
									<div className="bg-void/80 p-3 rounded-sm border border-white/5">
										<h4 className="text-[10px] font-bold text-amethyst uppercase tracking-widest mb-1">
											Starting Equipment
										</h4>
										<p className="text-xs text-muted-foreground font-mono">
											{bg.equipment.join(", ")}
										</p>
									</div>
								)}

								{bg.features?.[0] && (
									<div className="bg-amethyst/5 p-4 rounded-sm border border-amethyst/20 mt-auto">
										<h4 className="text-sm font-bold text-white uppercase mb-2 flex items-center gap-2">
											<Shield className="w-4 h-4 text-amethyst" />
											{bg.features[0].name}
										</h4>
										<p className="text-xs text-muted-foreground leading-relaxed">
											{bg.features[0].description}
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
