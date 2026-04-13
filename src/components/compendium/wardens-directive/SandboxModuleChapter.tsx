import { Scroll } from "lucide-react";
import { RiftHeading } from "@/components/ui/AscendantText";
import {
	massiveSandboxModule,
	sandboxHandouts,
	sandboxVTTScenes,
	sandboxWikiChapters,
} from "@/data/compendium/ascendant-sandbox-module";
import { sandboxRecruitableNPCs } from "@/data/compendium/sandbox-npcs";

export const SandboxModuleChapter = () => {
	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<RiftHeading level={1} className="text-5xl text-blue-400 mb-6">
					{massiveSandboxModule.title}
				</RiftHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					{massiveSandboxModule.description}
				</p>
			</section>

			<section className="mb-12">
				<h2 className="text-3xl font-display font-bold text-white uppercase tracking-widest border-b border-blue-500/30 pb-3 mb-8 flex items-center gap-3">
					<Scroll className="w-6 h-6 text-blue-500" />
					Module Contents Overview
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="bg-glass/20 border border-white/10 p-6 rounded-lg text-center">
						<h3 className="text-4xl font-display font-bold text-blue-400 mb-2">
							{sandboxWikiChapters.length}
						</h3>
						<p className="text-sm font-mono text-slate-400 uppercase tracking-widest">
							Wiki Chapters
						</p>
					</div>
					<div className="bg-glass/20 border border-white/10 p-6 rounded-lg text-center">
						<h3 className="text-4xl font-display font-bold text-blue-400 mb-2">
							{sandboxHandouts.length}
						</h3>
						<p className="text-sm font-mono text-slate-400 uppercase tracking-widest">
							Handouts
						</p>
					</div>
					<div className="bg-glass/20 border border-white/10 p-6 rounded-lg text-center">
						<h3 className="text-4xl font-display font-bold text-blue-400 mb-2">
							{sandboxVTTScenes.length}
						</h3>
						<p className="text-sm font-mono text-slate-400 uppercase tracking-widest">
							VTT Scenes
						</p>
					</div>
					<div className="bg-glass/20 border border-white/10 p-6 rounded-lg text-center">
						<h3 className="text-4xl font-display font-bold text-blue-400 mb-2">
							{sandboxRecruitableNPCs.length}
						</h3>
						<p className="text-sm font-mono text-slate-400 uppercase tracking-widest">
							Sandbox NPCs
						</p>
					</div>
				</div>
			</section>

			<section className="bg-blue-900/10 border border-blue-500/20 p-8 rounded-lg mt-12 text-center">
				<h3 className="text-2xl font-display font-bold text-white mb-4">
					Ready to play?
				</h3>
				<p className="text-slate-300 mb-0 max-w-2xl mx-auto">
					This module can be automatically imported into any campaign via the
					Warden's Directive dashboard. Navigating there will allow you to
					instantly scaffold all associated Wiki entries, NPCs, handouts, and
					VTT maps.
				</p>
			</section>
		</div>
	);
};
