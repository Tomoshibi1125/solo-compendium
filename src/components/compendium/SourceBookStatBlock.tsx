import type React from "react";

interface StatBlockProps {
	name: string;
	type: string;
	ac: number;
	hp: number;
	speed: string;
	stats: {
		str: number;
		dex: number;
		con: number;
		int: number;
		wis: number;
		cha: number;
	};
	traits?: { name: string; description: string }[];
	actions?: { name: string; description: string }[];
	reactions?: { name: string; description: string }[];
	legendaryActions?: { name: string; description: string }[];
}

const getModifier = (val: number) => {
	const mod = Math.floor((val - 10) / 2);
	return mod >= 0 ? `+${mod}` : mod;
};

export const SourceBookStatBlock: React.FC<StatBlockProps> = ({
	name,
	type,
	ac,
	hp,
	speed,
	stats,
	traits,
	actions,
	reactions,
	legendaryActions,
}) => {
	return (
		<div className="sb-stat-block">
			<div className="sb-stat-header">
				<h3 className="text-xl font-bold uppercase tracking-wider">{name}</h3>
				<p className="italic text-sm text-muted-foreground">{type}</p>
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
				{Object.entries(stats).map(([key, val]) => (
					<div key={key} className="sb-ability">
						<div className="sb-ability-label uppercase">{key}</div>
						<div className="text-lg font-bold">{val}</div>
						<div className="text-xs">({getModifier(val)})</div>
					</div>
				))}
			</div>

			{traits?.map((trait) => (
				<div
					key={`${trait.name}-${trait.description.substring(0, 10)}`}
					className="mb-2"
				>
					<span className="font-bold italic text-cyan">{trait.name}.</span>{" "}
					{trait.description}
				</div>
			))}

			{actions && (
				<>
					<h4 className="border-b border-cyan/30 text-cyan uppercase font-bold mt-4 mb-2">
						Actions
					</h4>
					{actions.map((action) => (
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

			{reactions && (
				<>
					<h4 className="border-b border-cyan/30 text-cyan uppercase font-bold mt-4 mb-2">
						Reactions
					</h4>
					{reactions.map((reaction) => (
						<div
							key={`${reaction.name}-${reaction.description.substring(0, 10)}`}
							className="mb-2"
						>
							<span className="font-bold italic text-amethyst">
								{reaction.name}.
							</span>{" "}
							{reaction.description}
						</div>
					))}
				</>
			)}

			{legendaryActions && (
				<>
					<h4 className="border-b border-cyan/30 text-cyan uppercase font-bold mt-4 mb-2">
						Legendary Actions
					</h4>
					{legendaryActions.map((action) => (
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
