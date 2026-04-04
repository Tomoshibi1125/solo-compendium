import { ActivitySquare, AlertTriangle, ScrollText } from "lucide-react";
import { SystemHeading } from "@/components/ui/SystemText";

export const GameRulesChapter = () => {
	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<SystemHeading level={1} className="text-5xl text-emerald-400 mb-6">
					Running The Urban Fantasy
				</SystemHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					The Protocol Warden acts as the architect of the narrative,
					controlling the flow of anomalies, the frequency of Gate Eruptions,
					and the reactions of modern society. Below are the core guidelines for
					arbitrating System Ascendant.
				</p>
			</section>

			<div className="grid md:grid-cols-2 gap-8">
				<article className="bg-glass/20 border border-emerald-900/40 p-8 rounded-xl shadow-xl hover:border-emerald-500/40 transition-colors">
					<h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-3">
						<AlertTriangle className="w-6 h-6 text-emerald-500" />
						Gate Eruptions
					</h2>
					<p className="text-sm text-slate-300 leading-relaxed min-h-[100px]">
						Gates form when ambient dimensional pressure reaches critical mass.
						A Gate remains dormant for 7 days (the "Blue Phase"). If not cleared
						by an Ascendant strike team within this window, a Gate Break occurs
						(the "Red Phase"), unleashing its anomalies directly into the modern
						world. Mechanics for clearing require eliminating the Dungeon Boss
						before the timer expires.
					</p>
				</article>

				<article className="bg-glass/20 border border-emerald-900/40 p-8 rounded-xl shadow-xl hover:border-emerald-500/40 transition-colors">
					<h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-3">
						<ActivitySquare className="w-6 h-6 text-emerald-500" />
						The Awakening
					</h2>
					<p className="text-sm text-slate-300 leading-relaxed min-h-[100px]">
						Humans Awaken randomly. When they do, their mana core solidifies
						into a permanent Rank (E through S). A D-Rank can never naturally
						become a C-Rank. The only way to transcend this absolute limitation
						is through a horrific and legendary event known as the "Double
						Awakening," an incredibly rare occurrence the Protocol Warden can
						trigger for narrative climaxes.
					</p>
				</article>

				<article className="md:col-span-2 bg-glass/20 border border-emerald-900/40 p-8 rounded-xl shadow-xl hover:border-emerald-500/40 transition-colors">
					<h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-3">
						<ScrollText className="w-6 h-6 text-emerald-500" />
						Modern World Impact
					</h2>
					<div className="text-sm text-slate-300 leading-relaxed columns-1 md:columns-2 gap-8 space-y-4">
						<p>
							System Ascendant takes place on modern Earth. Guns exist, but
							conventional ballistics bounce off even C-Rank anomalous hide.
							This forced humanity to adapt to "Mana-Tech."
						</p>
						<p>
							Guilds operate as corporate entities, clearing Gates for profit.
							Relics dropped by Anomalies are harvested and sold in shadowy
							auction houses. As the Warden, you must balance the claustrophobic
							politics of billionaire Guild Masters with the cosmic horror of
							higher dimensional beings invading reality.
						</p>
						<p>
							<strong>E-Rank:</strong> Weak, standard armed humans. Usually
							baggage carriers.
							<br />
							<strong>D/C-Rank:</strong> Elite operators, standard strike force
							members.
							<br />
							<strong>B-Rank:</strong> Guild elites, celebrities, millionaires.
							<br />
							<strong>A-Rank:</strong> Strategic national assets. Walking tanks.
							<br />
							<strong>S-Rank:</strong> Walking natural disasters. Above
							international law.
						</p>
					</div>
				</article>
			</div>
		</div>
	);
};
