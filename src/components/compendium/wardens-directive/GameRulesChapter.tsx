import { ActivitySquare, AlertTriangle, ScrollText } from "lucide-react";
import { RiftHeading } from "@/components/ui/AscendantText";

export const GameRulesChapter = () => {
	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<RiftHeading level={1} className="text-5xl text-system-green mb-6">
					Running The Urban Fantasy
				</RiftHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					The Warden acts as the architect of the narrative, controlling the
					flow of anomalies, the frequency of Gate Eruptions, and the reactions
					of modern society. Below are the core guidelines for arbitrating Rift
					Ascendant.
				</p>
			</section>

			<div className="grid md:grid-cols-2 gap-8">
				<article className="bg-glass/20 border border-system-green/40 p-8 rounded-xl shadow-xl hover:border-system-green/40 transition-colors">
					<h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-3">
						<AlertTriangle className="w-6 h-6 text-system-green" />
						Rift Eruptions
					</h2>
					<p className="text-sm text-slate-300 leading-relaxed min-h-[100px]">
						Rifts form when ambient dimensional pressure reaches critical mass.
						A new Rift can be held for a time under Bureau cordon — its
						Threshold measured, its Rank estimated. If it is not cleared by an
						Ascendant strike team within that window, a Rift Break occurs: the
						Interior's conditions and Anomalies spill directly into the modern
						world. Clearing a Rift means resolving its active threat and, for a
						persistent Interior, its Anchor before containment fails. Anomalies
						within it may be neutral, defensive, friendly, or hostile.
					</p>
				</article>

				<article className="bg-glass/20 border border-system-green/40 p-8 rounded-xl shadow-xl hover:border-system-green/40 transition-colors">
					<h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-3">
						<ActivitySquare className="w-6 h-6 text-system-green" />
						The Awakening
					</h2>
					<p className="text-sm text-slate-300 leading-relaxed min-h-[100px]">
						Humans Awaken randomly. When they do, their mana core solidifies
						into a permanent Rank (E through S). A D-Rank can never naturally
						become a C-Rank. The only way to transcend this absolute limitation
						is through a horrific and legendary event known as the "Double
						Awakening," an incredibly rare occurrence the Warden can trigger for
						narrative climaxes.
					</p>
				</article>

				<article className="md:col-span-2 bg-glass/20 border border-system-green/40 p-8 rounded-xl shadow-xl hover:border-system-green/40 transition-colors">
					<h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-3">
						<ScrollText className="w-6 h-6 text-system-green" />
						Modern World Impact
					</h2>
					<div className="text-sm text-slate-300 leading-relaxed columns-1 md:columns-2 gap-8 space-y-4">
						<p>
							Rift Ascendant takes place on modern Earth. Guns exist, but
							conventional ballistics bounce off even C-Rank anomalous hide.
							This forced humanity to adapt to "Mana-Tech."
						</p>
						<p>
							Guilds operate as corporate entities, clearing Gates for profit.
							Materials can be harvested and crafted without Bureau permission;
							the Bureau regulates legality, transport, and sale. As the Warden,
							you must balance the claustrophobic politics of billionaire Guild
							Masters with the cosmic horror of higher dimensional beings
							invading reality.
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
			<section className="rounded-xl border border-system-green/40 bg-glass/20 p-8 space-y-4 text-sm text-slate-300">
				<h2 className="text-2xl font-display font-bold text-white">
					Regents, Gemini, and Sovereigns
				</h2>
				<p>
					A Warden offers exactly three distinct Regents and the player selects
					one. A Regent is a full class overlay at the character's level. Its
					maximum Hit Die is added once for every character level on top of Job
					HP; VIT is not added again, and a higher HP maximum does not heal
					current HP. Two Regents are the maximum. Gemini is their fusion and a
					Sovereign is the resulting complete overlay.
				</p>
				<p>
					A martial or half-caster Regent's known Powers, and separately its
					known Techniques, are 2 at levels 1–2, 3 at 3–5, 4 at 6–8, 5 at 9–11,
					6 at 12–14, 7 at 15–17, and 8 at 18–20. A full-caster Regent keeps its
					spell and cantrip progression. Initial Regent catch-up choices are
					Warden-curated. Later Regent Power and Technique choices come from the
					canonical tier 5–9 catalog. Regent-acquired Powers and Techniques
					spend one shared Regent Resonance pool instead of native charges: tier
					5 costs 1, tiers 6–7 cost 2, and tiers 8–9 cost 3. Maximum points are
					1 at levels 1–2, 2 at 3–5, 3 at 6–8, 4 at 9–11, 5 at 12–14, 6 at
					15–17, 7 at 18–19, and 8 at 20. Long Rest refills the pool; Short Rest
					does not.
				</p>
				<h2 className="text-2xl font-display font-bold text-white">
					Companions and mounts
				</h2>
				<p>
					A tamed or bonded creature and every mount belong to the character
					that holds them, and the owner keeps its sheet. Each species has one
					version, scaled to the owner's level. Anomaly companions, mounts
					linked to an Anomaly, and the combat-capable mounts (Mana-Touched
					Wolf, Bureau Warhorse, Bureau K9, Mountain Patrol Bear, and Pantheon
					Steed) scale. Utility mounts, guild allies, and custom companions keep
					their saved stats.
				</p>
				<p>
					A scaled creature has one Hit Die per level at its maximum value, with
					no VIT added: the stat block's Hit Die, or Tiny d4, Small d6, Medium
					d8, Large d10, Huge d12, and Gargantuan d20. A level-up does not heal
					it. Its damage rolls keep their die size and roll 1 die at levels 1–4,
					2 at 5–10, 3 at 11–16, and 4 at 17–20. Attack damage adds proficiency
					bonus; save effects roll dice only. AC is 10 + rank tier + one per
					four levels after 1st, attack bonus is 2 + rank tier + proficiency
					bonus, and save DC is 8 + rank tier + proficiency bonus, with rank
					tiers E 0 through S 5. A d10 Anomaly has 50 HP at level 5, and a
					Mana-Touched Wolf bites for 2d8 + 3.
				</p>
				<p>
					A companion rests with its character, by the character's rules. On a
					Short Rest its owner may spend its Hit Dice; each die heals one roll
					of its Hit Die, with no VIT added. On a Long Rest it regains all HP
					and half its Hit Dice (minimum 1), and its conditions end as the
					character's do. A companion that keeps its saved stats has no Hit Dice
					to spend; a Long Rest still restores all its HP. A player tells the
					Warden when a character mounts or dismounts.
				</p>
				<h2 className="text-2xl font-display font-bold text-white">
					Damage and crafting
				</h2>
				<p>
					A critical hit deals maximum normal damage dice plus rolled critical
					dice plus flat modifiers once. Additional critical dice are rolled.
					Vulnerability doubles the resolved damage. Materials have separate
					source rank and grade. Crafting roles are Consumed, Incorporated, and
					Catalyst; a formula defines recovery. Blacksmithing, Alchemy,
					Enchanting, and Field Engineering are ordinary disciplines. Field
					Survival rations and Inscription are specialized procedures. Research
					progresses through Field Standard, Known, Experimental, and Proven.
					Biological adaptation records the failed outcome authored on its
					formula; no universal mutation or rejection rule applies.
				</p>
			</section>
		</div>
	);
};
