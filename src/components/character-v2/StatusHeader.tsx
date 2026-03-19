import { Dice6, Heart, Minus, Move, Plus, Shield, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatModifier } from "@/lib/characterCalculations";

interface StatusHeaderProps {
	hp: { current: number; max: number; temp: number };
	ac: number;
	initiative: number;
	speed: number;
	hitDice: { current: number; max: number; size: number };
	systemFavor: { current: number; max: number; die: number };
	onRollInitiative: () => void;
	onRollHitDice: () => void;
	onHPClick: () => void;
	onACClick: () => void;
	onAdjustResource: (
		field: "hit_dice_current" | "system_favor_current",
		delta: number,
	) => void;
}

export function StatusHeader({
	hp,
	ac,
	initiative,
	speed,
	hitDice,
	systemFavor,
	onRollInitiative,
	onRollHitDice,
	onHPClick,
	onACClick,
	onAdjustResource,
}: StatusHeaderProps) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
			{/* Armor Class Block */}
			<button
				type="button"
				onClick={onACClick}
				className="relative group bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-4 flex flex-col items-center justify-center transition-all hover:bg-obsidian-charcoal/80 hover:border-primary/40"
			>
				<Shield className="w-5 h-5 text-blue-400 mb-2 transition-transform group-hover:scale-110" />
				<span className="text-2xl font-display font-bold text-white">{ac}</span>
				<span className="text-[10px] font-mono text-primary/50 uppercase tracking-widest mt-1">
					ARMOR_CLASS
				</span>
				<div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
					<Badge
						variant="outline"
						className="text-[8px] h-3 px-1 border-primary/30"
					>
						DEFENSE
					</Badge>
				</div>
			</button>

			{/* Initiative Block */}
			<button
				type="button"
				onClick={onRollInitiative}
				className="relative group bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-4 flex flex-col items-center justify-center transition-all hover:bg-obsidian-charcoal/80 hover:border-primary/40"
			>
				<Zap className="w-5 h-5 text-yellow-400 mb-2 transition-transform group-hover:scale-110" />
				<div className="flex items-center gap-1">
					<span className="text-2xl font-display font-bold text-white">
						{formatModifier(initiative)}
					</span>
					<Dice6 className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
				</div>
				<span className="text-[10px] font-mono text-primary/50 uppercase tracking-widest mt-1">
					INITIATIVE
				</span>
			</button>

			{/* Speed Block */}
			<div className="bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-4 flex flex-col items-center justify-center">
				<Move className="w-5 h-5 text-emerald-400 mb-2" />
				<span className="text-2xl font-display font-bold text-white">
					{speed} <span className="text-sm font-mono text-primary/40">FT</span>
				</span>
				<span className="text-[10px] font-mono text-primary/50 uppercase tracking-widest mt-1">
					WALK_SPEED
				</span>
			</div>

			{/* HP Block (Span 2 or wide) */}
			<button
				type="button"
				onClick={onHPClick}
				className="relative col-span-2 group bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-4 flex flex-col transition-all hover:bg-obsidian-charcoal/80 hover:border-primary/40"
			>
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-2">
						<Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
						<span className="text-xs font-mono text-primary/60 uppercase tracking-widest">
							HIT_POINTS
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-xl font-display font-bold text-white">
							{hp.current}
						</span>
						<span className="text-sm text-primary/40">/</span>
						<span className="text-sm text-primary/60 font-mono font-bold">
							{hp.max}
						</span>
						{hp.temp > 0 && (
							<span className="text-xs text-cyan-400 font-mono">
								+{hp.temp}
							</span>
						)}
					</div>
				</div>
				<Progress
					value={(hp.current / hp.max) * 100}
					className="h-2 bg-red-950/30"
				/>
			</button>

			{/* Resources (Hit Dice & System Favor) */}
			<div className="grid grid-cols-2 gap-2 h-full">
				<div className="bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-2 flex flex-col items-center justify-center relative group">
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onAdjustResource("hit_dice_current", -1);
							}}
							aria-label="Decrease Hit Dice"
							className="p-1 hover:bg-primary/10 rounded transition-colors"
						>
							<Minus className="w-3 h-3 text-primary/40" />
						</button>
						<button
							type="button"
							onClick={onRollHitDice}
							aria-label="Roll Hit Dice"
							className="flex flex-col items-center"
						>
							<span className="text-sm font-bold text-white">
								{hitDice.current}/{hitDice.max}
							</span>
						</button>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onAdjustResource("hit_dice_current", 1);
							}}
							aria-label="Increase Hit Dice"
							className="p-1 hover:bg-primary/10 rounded transition-colors"
						>
							<Plus className="w-3 h-3 text-primary/40" />
						</button>
					</div>
					<span className="text-[8px] text-primary/50 uppercase truncate">
						HIT_DICE
					</span>
					<span className="text-[9px] text-primary/40 italic">
						d{hitDice.size}
					</span>
				</div>

				<div className="bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-2 flex flex-col items-center justify-center relative group font-mono">
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={() => onAdjustResource("system_favor_current", -1)}
							aria-label="Decrease System Favor"
							className="p-1 hover:bg-primary/10 rounded transition-colors"
						>
							<Minus className="w-3 h-3 text-primary/40" />
						</button>
						<span className="text-sm font-bold text-white">
							{systemFavor.current}/{systemFavor.max}
						</span>
						<button
							type="button"
							onClick={() => onAdjustResource("system_favor_current", 1)}
							aria-label="Increase System Favor"
							className="p-1 hover:bg-primary/10 rounded transition-colors"
						>
							<Plus className="w-3 h-3 text-primary/40" />
						</button>
					</div>
					<span className="text-[8px] text-primary/50 uppercase truncate">
						FAVOR
					</span>
					<span className="text-[9px] text-primary/40">d{systemFavor.die}</span>
				</div>
			</div>
		</div>
	);
}
