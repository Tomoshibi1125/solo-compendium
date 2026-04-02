import type React from "react";
import type { CompendiumMonster } from "@/types/compendium";

interface StatBlockProps {
	monster: CompendiumMonster;
}

const getModifier = (val: number | undefined) => {
	if (val === undefined) return "+0";
	const mod = Math.floor((val - 10) / 2);
	return mod >= 0 ? `+${mod}` : mod;
};

export const SourceBookStatBlock: React.FC<StatBlockProps> = ({ monster }) => {
	// Fallback to top-level or nested stats
	const ac = monster.ac ?? monster.armor_class ?? 10;
	const hp = monster.hp ?? monster.hit_points ?? 10;
	const speed = monster.speed ?? "30 ft.";

	const abilityScores = monster.stats?.ability_scores || {
		strength: 10,
		dexterity: 10,
		constitution: 10,
		intelligence: 10,
		wisdom: 10,
		charisma: 10,
	};

	const displayStats = {
		STR: abilityScores.strength || 10,
		DEX: abilityScores.dexterity || 10,
		CON: abilityScores.constitution || 10,
		INT: abilityScores.intelligence || 10,
		WIS: abilityScores.wisdom || 10,
		CHA: abilityScores.charisma || 10,
	};

	return (
		<div className="sb-stat-block">
			<div className="sb-stat-header">
				<h3 className="text-xl font-bold uppercase tracking-wider">
					{monster.name}
				</h3>
				<p className="italic text-sm text-muted-foreground">{monster.type}</p>
			</div>

			<div className="flex justify-between border-b border-amethyst/30 pb-2 mb-2">
				<div>
					<span className="font-bold text-cyan">Armor Class</span> {ac}
				</div>
				<div>
					<span className="font-bold text-cyan">Hit Points</span> {hp}
				</div>
				<div>
					<span className="font-bold text-cyan">Speed</span> {speed}
				</div>
			</div>

			<div className="sb-ability-box">
				{Object.entries(displayStats).map(([key, val]) => (
					<div key={key} className="sb-ability">
						<div className="sb-ability-label uppercase">{key}</div>
						<div className="text-lg font-bold">{val}</div>
						<div className="text-xs">({getModifier(val)})</div>
					</div>
				))}
			</div>

			{monster.traits?.map((trait) => (
				<div
					key={`${trait.name}-${trait.description.substring(0, 10)}`}
					className="mb-2"
				>
					<span className="font-bold italic text-cyan">{trait.name}.</span>{" "}
					{trait.description}
				</div>
			))}

			{monster.actions && monster.actions.length > 0 && (
				<>
					<h4 className="border-b border-cyan/30 text-cyan uppercase font-bold mt-4 mb-2">
						Actions
					</h4>
					{monster.actions.map((action) => (
						<div
							key={`${action.name}-${action.description.substring(0, 10)}`}
							className="mb-2"
						>
							<span className="font-bold italic text-amethyst">
								{action.name}.
							</span>{" "}
							{action.description}
						</div>
					))}
				</>
			)}

			{monster.legendary_actions && monster.legendary_actions.length > 0 && (
				<>
					<h4 className="border-b border-cyan/30 text-cyan uppercase font-bold mt-4 mb-2">
						Legendary Actions
					</h4>
					{monster.legendary_actions.map((action) => (
						<div
							key={`${action.name}-${action.description.substring(0, 10)}`}
							className="mb-2"
						>
							<span className="font-bold italic text-amethyst">
								{action.name}.
							</span>{" "}
							{action.description}
						</div>
					))}
				</>
			)}
		</div>
	);
};
