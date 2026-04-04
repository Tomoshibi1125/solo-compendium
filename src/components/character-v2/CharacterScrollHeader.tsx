import { Heart, Shield, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatModifier } from "@/lib/characterCalculations";
import { cn } from "@/lib/utils";

interface CharacterScrollHeaderProps {
	name: string;
	level: number;
	portraitUrl?: string | null;
	hp: { current: number; max: number };
	tempHp: number;
	ac: number;
	initiative: number;
	className?: string;
}

export function CharacterScrollHeader({
	name,
	level,
	portraitUrl,
	hp,
	tempHp,
	ac,
	initiative,
	className,
}: CharacterScrollHeaderProps) {
	const hpPercent = Math.min(100, Math.max(0, (hp.current / hp.max) * 100));

	return (
		<div
			className={cn(
				"sticky top-16 z-30 w-full border-b border-primary/20 bg-obsidian-charcoal/90 backdrop-blur-md shadow-lg transition-all duration-300 animate-in slide-in-from-top-4",
				className,
			)}
		>
			<div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
				{/* Identity */}
				<div className="flex items-center gap-3 min-w-0">
					<div className="w-8 h-8 rounded-[2px] border border-primary/40 overflow-hidden shrink-0 bg-black/40">
						{portraitUrl ? (
							<img
								src={portraitUrl}
								alt={name}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-primary/40 font-display text-lg">
								{name[0]}
							</div>
						)}
					</div>
					<div className="flex flex-col min-w-0">
						<span className="font-display font-bold text-xs tracking-wide text-white uppercase truncate">
							{name}
						</span>
						<span className="text-[9px] font-mono text-primary/60 uppercase tracking-tighter">
							Rank{" "}
							{level >= 17
								? "S"
								: level >= 13
									? "A"
									: level >= 9
										? "B"
										: level >= 5
											? "C"
											: "D"}
						</span>
					</div>
				</div>

				{/* Combat Stats */}
				<div className="flex items-center gap-4 flex-1 justify-end max-w-md">
					{/* HP Section */}
					<div className="flex items-center gap-2 flex-1 min-w-0">
						<Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20 shrink-0" />
						<div className="flex-1 space-y-1">
							<div className="flex justify-between text-[9px] font-mono leading-none">
								<span className="text-primary/40">HP</span>
								<span className="text-white font-bold">
									{hp.current}
									{tempHp > 0 ? `+${tempHp}` : ""}/{hp.max}
								</span>
							</div>
							<div className="h-1.5 w-full bg-black/50 border border-primary/10 rounded-full overflow-hidden">
								<Progress
									value={hpPercent}
									className="h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)]"
								/>
							</div>
						</div>
					</div>

					{/* AC & Init */}
					<div className="flex items-center gap-4 shrink-0 px-2 border-l border-primary/10">
						<div className="flex flex-col items-center">
							<span className="text-[8px] font-mono text-primary/40 uppercase">
								AC
							</span>
							<div className="flex items-center gap-1">
								<Shield className="w-3 h-3 text-blue-400" />
								<span className="text-xs font-bold text-blue-100">{ac}</span>
							</div>
						</div>
						<div className="flex flex-col items-center">
							<span className="text-[8px] font-mono text-primary/40 uppercase">
								Init
							</span>
							<div className="flex items-center gap-1">
								<Zap className="w-3 h-3 text-yellow-400" />
								<span className="text-xs font-bold text-yellow-100">
									{formatModifier(initiative)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Scanner Detail */}
			<div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
		</div>
	);
}
