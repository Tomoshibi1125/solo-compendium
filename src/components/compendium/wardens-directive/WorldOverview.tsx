import {
	Building2,
	Crown,
	Database,
	Globe,
	Layers,
	Search,
	ShieldAlert,
	Zap,
} from "lucide-react";
import { SourceBookPage } from "@/components/compendium/SourceBookPage";
import { SourceBookStatBlock } from "@/components/compendium/SourceBookStatBlock";
import { RiftHeading } from "@/components/ui/AscendantText";
import { getAssetsByTier, searchAssets } from "@/lib/vtt";
import type { CompendiumAnomaly } from "@/types/compendium";

const kaelVoss = {
	id: "kael-voss",
	name: "Kael Voss",
	display_name: "The Zenith of Creation",
	description:
		"Kael Voss is the Prime Eternal, the absolute anchor of the Post-Reset timeline. His resonance is so dense that physical space warps in his presence.",
	type: "Grand Deity (The Absolute)",
	armor_class: 30,
	hit_points: 1000,
	speed: "Incalculable",
	stats: {
		ability_scores: {
			strength: 30,
			agility: 30,
			vitality: 30,
			intelligence: 30,
			sense: 30,
			presence: 30,
		},
	},
	traits: [
		{
			name: "Lattice-Stitch",
			description:
				"Can weave disparate reality-fragments into a unified existence. His presence stabilizes collapsing dimensional membranes.",
		},
		{
			name: "Zenith Resurge",
			description:
				"The power to reset the resonance of a single soul, restoring them to their absolute peak or unwriting their existence from the Lattice entirely.",
		},
	],
	actions: [],
} as unknown as CompendiumAnomaly;

interface CityInfo {
	id: string;
	name: string;
	location: string;
	description: string;
	demographics: string;
	color: string;
}

interface GuildInfo {
	id: string;
	name: string;
	marketCap: string;
	description: string;
	color: string;
}

const SANCTUARY_CITIES: CityInfo[] = [
	{
		id: "genesis-citadel",
		name: "The Genesis Citadel",
		location: "Former North America (New York Grid)",
		description:
			"The industrial heart of the Remade World. Genesis is a vertical arcology built to harness the massive kinetic and aetheric energy of a perpetually stable Blue Rift suspended above the city. The entire skyline is dominated by corporate spires and suspended monorails, functioning as a beacon of human resilience.",
		demographics:
			"Machinists, Artificers, and Heavy-Infantry Ascendants. Home to the Aegis Federation.",
		color: "text-cyan",
	},
	{
		id: "shard-domes",
		name: "The Shard Domes",
		location: "Former Europe (London Grid)",
		description:
			"A network of shimmering aetheric domes protecting an ancient, Gothic landscape. The Shard Domes sit on the highest concentration of volatile mana vents, requiring a massive population of Sorcerers and Clergy just to maintain the shields. It serves as the global center of magical academia.",
		demographics:
			"Sorcerers, Researchers, Clergy. The primary seat of Lattice Research.",
		color: "text-fuchsia-400",
	},
	{
		id: "abyssal-breach",
		name: "The Abyssal Breach",
		location: "Former Asia (Tokyo Grid)",
		description:
			"Built directly on the edge of the first recorded Eclipse Rift. The city is a sprawling, neon-soaked cyberpunk nightmare heavily entrenched in Anomaly-part smuggling and black markets. It is dangerous, incredibly wealthy, and highly chaotic—the only place where the Lattice's laws are openly challenged.",
		demographics:
			"Stalkers, Shadow-Sovereigns, Black-Market Dealers. Home to the Onyx Cartel.",
		color: "text-amber-500",
	},
];

const GRAND_GUILDS: GuildInfo[] = [
	{
		id: "aegis-federation",
		name: "The Aegis Federation",
		marketCap: "4.8 Trillion Credits",
		description:
			"The largest and most heavily militarized guild on the planet. They specialize in defensive holding strategies and massive raid-party logistical deployments, acting as the de-facto global police force through their monopoly on low-resonance Rifts.",
		color: "text-blue-500",
	},
	{
		id: "celestial-vanguard",
		name: "The Celestial Vanguard",
		marketCap: "3.1 Trillion Credits",
		description:
			"An elite, hyper-focused guild of S-Rank Ascendants. They exclusively clear Red Rifts and prevent national catastrophes. While small in number, their combat power is theoretically infinite, rivaling entire nations.",
		color: "text-fuchsia-500",
	},
	{
		id: "onyx-cartel",
		name: "The Onyx Cartel",
		marketCap: "Unclassified",
		description:
			"Operating out of the Abyssal Breach, the Cartel controls the illegal trade of human-engineered aetheric artifacts. They specialize in smuggling Ascendants into restricted Eclipse Zones to harvest Sovereign-grade Anomaly cores.",
		color: "text-slate-400",
	},
];

export const WorldOverview = () => {
	const cosmologyText =
		"Before the Great Reset, reality was a maelstrom of collapsing timelines known as the Sprawl. From this chaos emerged Kael Voss, the Prime Eternal, who forged the Aether Lattice—a celestial framework that stabilized our dimension. This event, 'The Reset,' anchored our timeline but left the world scarred by Rifts—dimensional bleed-points where the Lattice's membrane is thin.";

	return (
		<SourceBookPage title="World Overview: The Remade Reality">
			<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
				{/* 1. The Cosmology Section */}
				<section className="relative p-8 bg-glass border border-white/10 rounded-xl overflow-hidden shadow-2xl">
					<div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
					<div className="flex items-center gap-3 mb-6 border-b border-cyan-500/20 pb-4">
						<Globe className="w-8 h-8 text-cyan" />
						<RiftHeading
							level={2}
							className="text-3xl text-white uppercase tracking-widest font-display font-bold"
						>
							The Great Reset
						</RiftHeading>
					</div>
					<div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm">
						<p className="border-l-4 border-cyan-500/50 pl-6 py-2 italic bg-cyan-500/5 mb-6">
							{cosmologyText}
						</p>
						<p>
							Earth today is no longer a planet of nations, but a containment
							vessel. The Lattice governs every mana-flow, and the Rifts serve
							as the source of the world's new energy—and its greatest threat.
						</p>
					</div>
				</section>

				{/* 2. Sanctuary Cities */}
				<section className="space-y-8">
					<div className="flex items-center gap-3 mb-2 border-b border-amber-500/20 pb-4">
						<Building2 className="w-8 h-8 text-amber-500" />
						<h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
							The Sanctuary Cities
						</h2>
					</div>

					<div className="grid lg:grid-cols-3 gap-6">
						{SANCTUARY_CITIES.map((city) => (
							<div
								key={city.id}
								className="bg-void/60 border border-white/5 p-6 rounded-lg hover:border-white/20 transition-all group"
							>
								<h3
									className={`${city.color} font-display uppercase tracking-widest text-lg mb-1 group-hover:scale-105 transition-transform`}
								>
									{city.name}
								</h3>
								<h4 className="text-[10px] font-mono text-slate-500 uppercase mb-4 border-b border-white/5 pb-2">
									Region: {city.location}
								</h4>
								<p className="text-xs text-slate-400 leading-relaxed mb-4">
									{city.description}
								</p>
								<div className="pt-4 border-t border-white/5">
									<strong className="text-[10px] uppercase text-slate-500 block mb-1">
										Sociopolitical Profile
									</strong>
									<p className="text-[10px] text-slate-500 leading-tight italic">
										{city.demographics}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* 3. The Grand Guilds */}
				<section className="space-y-8">
					<div className="flex items-center gap-3 mb-2 border-b border-blue-500/20 pb-4">
						<ShieldAlert className="w-8 h-8 text-blue-400" />
						<h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
							The Grand Guilds
						</h2>
					</div>

					<div className="space-y-4">
						{GRAND_GUILDS.map((guild) => (
							<div
								key={guild.id}
								className="flex flex-col md:flex-row gap-6 p-6 bg-glass border border-white/5 hover:border-blue-500/20 transition-colors"
							>
								<div className="md:w-1/4">
									<h4
										className={`${guild.color} font-display uppercase text-lg tracking-wider`}
									>
										{guild.name}
									</h4>
									<span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
										Capitalization: {guild.marketCap}
									</span>
								</div>
								<div className="md:w-3/4">
									<p className="text-sm text-slate-400 leading-relaxed font-light">
										{guild.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* 4. Rift Topology */}
				<section className="bg-void p-8 border border-white/5 rounded-xl">
					<div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
						<Layers className="w-8 h-8 text-purple-400" />
						<h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
							Rift Topology
						</h2>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-blue-400 mb-2">
								<Zap className="w-4 h-4" />
								<h4 className="font-mono text-xs uppercase font-bold">
									Blue Rifts
								</h4>
							</div>
							<p className="text-[11px] text-slate-400 leading-relaxed">
								Stable chronal flow. Environments often resemble ruins of
								prehistoric landscapes. Low mana-density allows un-awakened
								presence for up to 48 hours.
							</p>
						</div>
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-red-500 mb-2">
								<ShieldAlert className="w-4 h-4" />
								<h4 className="font-mono text-xs uppercase font-bold">
									Red Rifts
								</h4>
							</div>
							<p className="text-[11px] text-slate-400 leading-relaxed">
								Severe Chronal Dilation. Absolute radio silence. High
								probability of Sovereign-tier Anomalies. Time spent inside often
								results in Dissonance Radiation poisoning.
							</p>
						</div>
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-purple-500 mb-2 animate-pulse">
								<Zap className="w-4 h-4" />
								<h4 className="font-mono text-xs uppercase font-bold">
									Eclipse Zones
								</h4>
							</div>
							<p className="text-[11px] text-slate-400 leading-relaxed">
								Total Membrane Collapse. Reality becomes non-Euclidean. If
								uncleared within 7 sun-cycles, a Dungeon Break occurs, releasing
								an apocalyptic event onto the Lattice.
							</p>
						</div>
					</div>
				</section>

				{/* 5. The Prime Eternal (Kael Voss Stat Block) */}
				<section className="space-y-8">
					<div className="flex items-center gap-3 mb-2 border-b border-fuchsia-500/20 pb-4">
						<Crown className="w-8 h-8 text-fuchsia-400" />
						<h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
							Sovereign Authority: Kael Voss
						</h2>
					</div>
					<div className="max-w-3xl mx-auto">
						<SourceBookStatBlock Anomaly={kaelVoss} />
					</div>
				</section>

				{/* 6. Lattice Resource Registry (WIRING) */}
				<section className="p-8 bg-glass border border-fuchsia-500/20 rounded-xl relative overflow-hidden">
					<div className="absolute top-0 right-0 p-4 opacity-5">
						<Database className="w-24 h-24 text-fuchsia-500" />
					</div>
					<div className="flex items-center gap-4 mb-8 border-b border-fuchsia-500/10 pb-4 relative z-10">
						<Search className="w-6 h-6 text-fuchsia-500" />
						<h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
							Lattice Resource Registry
						</h2>
					</div>

					<div className="grid md:grid-cols-2 gap-12 relative z-10">
						<div className="space-y-6">
							<h4 className="text-[10px] font-mono font-bold text-fuchsia-400 uppercase tracking-[0.2em] mb-4">
								Threat Asset Distribution
							</h4>
							<div className="space-y-3">
								{(["S", "A", "B", "C", "D"] as const).map((rank) => {
									const count = getAssetsByTier(rank).length;
									return (
										<div
											key={rank}
											className="flex items-center justify-between group"
										>
											<span className="text-xs font-mono text-slate-400">
												Rank {rank} Documentation
											</span>
											<div className="flex-1 border-b border-dotted border-white/10 mx-4 group-hover:border-fuchsia-500/30 transition-colors" />
											<span className="text-xs font-mono text-fuchsia-400 font-bold">
												{count.toString().padStart(2, "0")}
											</span>
										</div>
									);
								})}
							</div>
						</div>

						<div className="space-y-6">
							<h4 className="text-[10px] font-mono font-bold text-fuchsia-400 uppercase tracking-[0.2em] mb-4">
								Sovereign Query Status
							</h4>
							<div className="p-4 bg-void/60 border border-white/5 rounded-lg space-y-4">
								<p className="text-[10px] text-slate-500 leading-relaxed italic">
									Live scan of the Aether Lattice for 'Sovereign' resonance
									signatures:
								</p>
								<div className="flex flex-wrap gap-2">
									{searchAssets("Sovereign")
										.slice(0, 5)
										.map((asset) => (
											<span
												key={asset.id}
												className="px-2 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 text-[9px] text-fuchsia-300 font-mono rounded"
											>
												UID: {asset.id.split("-").pop()}
											</span>
										))}
								</div>
								<div className="text-[9px] text-emerald-500/70 font-mono flex items-center gap-2">
									<div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
									Protocol Sync Complete
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</SourceBookPage>
	);
};
