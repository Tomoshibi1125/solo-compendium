import type React from "react";
import type { CompendiumAnomaly } from "@/types/compendium";

interface StatBlockProps {
	Anomaly: CompendiumAnomaly;
}

const getModifier = (val: number | undefined) => {
	if (val === undefined) return "+0";
	const mod = Math.floor((val - 10) / 2);
	return mod >= 0 ? `+${mod}` : mod;
};

export const SourceBookStatBlock: React.FC<StatBlockProps> = ({ Anomaly }) => {
	// Fallback to top-level or nested stats
	const ac = Anomaly.ac ?? Anomaly.armor_class ?? 10;
	const hp = Anomaly.hp ?? Anomaly.hit_points ?? 10;
	const speed = Anomaly.speed ?? "30 ft.";

	const abilityScores = Anomaly.stats?.ability_scores || {
		strength: 10,
		agility: 10,
		vitality: 10,
		intelligence: 10,
		sense: 10,
		presence: 10,
	};

	const displayStats = {
		STR: abilityScores.strength || 10,
		AGI: abilityScores.agility || 10,
		VIT: abilityScores.vitality || 10,
		INT: abilityScores.intelligence || 10,
		SENSE: abilityScores.sense || 10,
		PRE: abilityScores.presence || 10,
	};

	return (
		<div className="sb-stat-block">
			<div className="sb-stat-header">
				<h3 className="text-xl font-bold uppercase tracking-wider">
					{Anomaly.name}
				</h3>
				<p className="italic text-sm text-muted-foreground">{Anomaly.type}</p>
			</div>

			<div className="flex justify-between border-b border-fuchsia-500/30 pb-2 mb-2">
				<div>
					<span className="font-bold text-fuchsia-400">Resonant Guard</span>{" "}
					{ac}
				</div>
				<div>
					<span className="font-bold text-fuchsia-400">Vitality Threshold</span>{" "}
					{hp}
				</div>
				<div>
					<span className="font-bold text-fuchsia-400">Movement</span> {speed}
				</div>
			</div>

			<div className="sb-ability-box">
				{Object.entries(displayStats).map(([key, val]) => (
					<div key={key} className="sb-ability">
						<div className="sb-ability-label uppercase text-[10px] text-fuchsia-300/70">
							{key}
						</div>
						<div className="text-lg font-bold text-white">{val}</div>
						<div className="text-[10px] text-fuchsia-400/50">
							({getModifier(val)})
						</div>
					</div>
				))}
			</div>

			{Anomaly.traits?.map((trait) => (
				<div
					key={`${trait.name}-${(trait.description || "").substring(0, 10)}`}
					className="mb-3 text-xs leading-relaxed"
				>
					<span className="font-bold italic text-fuchsia-400">
						{trait.name}.
					</span>{" "}
					<span className="text-slate-300">{trait.description || ""}</span>
				</div>
			))}

			{Anomaly.actions && Anomaly.actions.length > 0 && (
				<>
					<h4 className="border-b border-fuchsia-500/30 text-fuchsia-400 uppercase font-display text-xs tracking-widest mt-6 mb-3">
						Aetheric Techniques
					</h4>
					{Anomaly.actions.map((action) => (
						<div
							key={`${action.name}-${(action.description || "").substring(0, 10)}`}
							className="mb-3 text-xs leading-relaxed"
						>
							<span className="font-bold italic text-fuchsia-300">
								{action.name}.
							</span>{" "}
							<span className="text-slate-400">{action.description || ""}</span>
						</div>
					))}
				</>
			)}

			{Anomaly.legendary_actions && Anomaly.legendary_actions.length > 0 && (
				<>
					<h4 className="border-b border-fuchsia-500/30 text-amber-500 uppercase font-display text-xs tracking-widest mt-6 mb-3">
						Sovereign Decrees
					</h4>
					{Anomaly.legendary_actions.map((action) => (
						<div
							key={`${action.name}-${(action.description || "").substring(0, 10)}`}
							className="mb-3 text-xs leading-relaxed"
						>
							<span className="font-bold italic text-amber-400">
								{action.name}.
							</span>{" "}
							<span className="text-slate-400">{action.description || ""}</span>
						</div>
					))}
				</>
			)}
		</div>
	);
};
