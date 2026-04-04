import { SystemHeading } from "@/components/ui/SystemText";
import { powers } from "@/data/compendium/powers";

interface PowerData {
	id: string;
	name: string;
	description: string;
	type?: string;
	rarity?: string;
	activation?: {
		type: string;
	};
	duration?: {
		type: string;
		time?: string;
	};
	range?: {
		type: string;
		distance?: number;
	};
	effects?: {
		primary: string;
		secondary?: string;
		tertiary?: string;
	};
	limitations?: {
		uses?: string;
		conditions?: string[];
		cooldown?: string;
	};
	flavor?: string;
	source?: string;
	image?: string;
	level?: number;
	requirements?: {
		job?: string;
		class?: string;
		level?: number;
	};
}

export const SpellsChapter = () => {
	// Sort powers alphabetically
	const sortedPowers = [...(powers as PowerData[])].sort((a, b) =>
		a.name.localeCompare(b.name),
	);

	// Group by Path/Source if available, or just render alphabetically like a Spellbook
	const renderPowerBlock = (p: PowerData) => {
		const activation = p.activation?.type || "Passive";
		const range = p.range
			? `${p.range.distance ? `${p.range.distance} ` : ""}${p.range.type}`
			: null;
		const duration = p.duration
			? `${p.duration.time ? `${p.duration.time} ` : ""}${p.duration.type}`
			: null;

		return (
			<div
				key={p.id}
				className="mb-6 break-inside-avoid bg-glass border border-white/10 p-5 rounded-lg hover:border-amethyst/30 transition-colors"
			>
				<h3 className="text-xl font-display font-bold text-white mb-1 flex justify-between items-start">
					<span>{p.name}</span>
					{p.level && (
						<span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-muted-foreground mt-1">
							Level {p.level}
						</span>
					)}
				</h3>

				<p className="text-xs font-mono text-amethyst/70 mb-3 italic">
					{p.type || "System Power"} • {activation}{" "}
					{p.source ? `• ${p.source}` : ""}
				</p>

				<div className="prose prose-invert text-sm text-slate-300 leading-relaxed mb-3">
					{p.description}
				</div>

				{(p.range || p.duration || p.limitations?.uses) && (
					<div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono bg-void/50 p-3 rounded-sm border border-white/5">
						{p.limitations?.uses && (
							<div>
								<strong className="text-cyan block">Usage</strong>
								{p.limitations.uses}
							</div>
						)}
						{range && (
							<div>
								<strong className="text-cyan block">Range</strong>
								{range}
							</div>
						)}
						{duration && (
							<div>
								<strong className="text-cyan block">Duration</strong>
								{duration}
							</div>
						)}
						{activation !== "Passive" && (
							<div>
								<strong className="text-cyan block">Activation</strong>
								{activation}
							</div>
						)}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto">
			<section className="text-center mb-16">
				<SystemHeading level={1} className="text-5xl text-amethyst mb-6">
					System Spells & Powers
				</SystemHeading>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
					Abilities granted by the System are fueled by Aether, a resource drawn
					directly from an Ascendant's mana core. These powers range from
					destructive elemental casts to unique martial techniques that bend the
					laws of physics. Below is the canonical index of known abilities.
				</p>
			</section>

			<div className="columns-1 md:columns-2 gap-6 space-y-6">
				{sortedPowers.map(renderPowerBlock)}
			</div>
		</div>
	);
};
