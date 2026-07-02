import {
	Award,
	Dice6,
	Heart,
	Minus,
	Move,
	Plus,
	Shield,
	Sparkles,
	Zap,
} from "lucide-react";
import { DeathSaveTracker } from "@/components/CharacterSheet/DeathSaveTracker";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useCampaignDice } from "@/hooks/useCampaignDice";
import { useCharacterResources } from "@/hooks/useCharacterSheetState";
import { useRecordRoll } from "@/hooks/useRollHistory";
import { formatModifier } from "@/lib/characterCalculations";
import { applyInspiration, gainInspiration } from "@/lib/characterResources";
import {
	getAffordableOptions,
	getAvailableFavorOptions,
	RIFT_BOOST_OPTION_ID,
	type RiftFavorState,
	rollRiftFavorBoost,
	spendRiftFavor,
} from "@/lib/riftFavor";

interface StatusHeaderProps {
	hp: { current: number; max: number; temp: number };
	ac: number;
	initiative: number;
	speed: number;
	proficiencyBonus: number;
	characterLevel: number;
	acBreakdown?: string;
	initiativeBreakdown?: string;
	speedBreakdown?: string;
	hitDice: { current: number; max: number; size: number };
	riftFavor: {
		current: number;
		max: number;
		die: number;
		level: number;
		deathDefianceUsed?: boolean;
		criticalSurgeUsed?: boolean;
	};
	campaignId?: string;
	onRollInitiative: () => void;
	onRollHitDice: () => void;
	onHPClick: () => void;
	onACClick: () => void;
	onAdjustResource: (
		field: "hit_dice_current" | "rift_favor_current",
		delta: number,
	) => void;
	deathSaves: {
		successes: number;
		failures: number;
		isStable: boolean;
		isDead: boolean;
		onRoll: () => void;
		onStabilize: () => void;
	};
	characterId: string;
}

export function StatusHeader({
	hp,
	ac,
	initiative,
	speed,
	proficiencyBonus,
	characterLevel,
	hitDice,
	riftFavor,
	acBreakdown,
	initiativeBreakdown,
	speedBreakdown,
	onRollInitiative,
	onRollHitDice,
	onHPClick,
	onACClick,
	onAdjustResource,
	deathSaves,
	characterId,
	campaignId,
}: StatusHeaderProps) {
	const { toast } = useToast();
	const recordRoll = useRecordRoll();
	const { rollInCampaign } = useCampaignDice();
	// DDB parity: inspiration lives on the sheet header, not just the HUD badge.
	const [sheetResources, saveSheetResources] =
		useCharacterResources(characterId);
	const inspirationPoints = sheetResources.inspiration.inspiration_points;

	const handleInspiration = (delta: number) => {
		if (delta > 0) {
			void saveSheetResources(gainInspiration(sheetResources));
			toast({
				title: "Inspiration gained",
				description: "The Warden smiles upon you.",
			});
		} else if (inspirationPoints > 0) {
			void saveSheetResources(applyInspiration(sheetResources));
			toast({
				title: "Inspiration spent",
				description: "Advantage on one roll of your choice.",
			});
		}
	};

	const riftFavorState: RiftFavorState = {
		current: riftFavor.current,
		max: riftFavor.max,
		dieSize: riftFavor.die,
		level: riftFavor.level,
		deathDefianceUsed: riftFavor.deathDefianceUsed || false,
		criticalSurgeUsed: riftFavor.criticalSurgeUsed || false,
	};

	const availableFavorOptions = getAvailableFavorOptions(riftFavor.level);
	const affordableFavorOptions = getAffordableOptions(riftFavorState);

	const handleSpendFavor = (optionId: string) => {
		const result = spendRiftFavor(riftFavorState, optionId);
		if (result.success) {
			const boostRoll =
				optionId === RIFT_BOOST_OPTION_ID
					? rollRiftFavorBoost(riftFavorState)
					: null;
			const context = boostRoll
				? `${boostRoll.message} (${result.updatedState.current}/${result.updatedState.max} Rift Favor remaining)`
				: result.message;
			const rollPayload = {
				character_id: characterId,
				campaign_id: campaignId ?? null,
				dice_formula: boostRoll?.diceFormula ?? "0",
				result: boostRoll?.result ?? 0,
				roll_type: boostRoll ? "modifier" : "rift_favor",
				rolls: boostRoll ? [boostRoll.roll] : [],
				context,
				modifiers: {
					option: result.option?.id,
					option_name: result.option?.name,
					cost: result.option?.cost,
					remaining: result.updatedState.current,
					max: result.updatedState.max,
				},
			};

			recordRoll.mutate(rollPayload);
			if (campaignId) {
				rollInCampaign(campaignId, rollPayload);
			}
			toast({
				title: result.option?.name ?? "Rift Favor",
				description: context,
			});
			onAdjustResource("rift_favor_current", -(result.option?.cost ?? 1));
		} else {
			toast({
				title: "Rift Favor unavailable",
				description: result.message,
				variant: "destructive",
			});
		}
	};

	const proficiencyTier =
		characterLevel >= 17
			? "S"
			: characterLevel >= 13
				? "A"
				: characterLevel >= 9
					? "B"
					: characterLevel >= 5
						? "C"
						: "D";

	return (
		<TooltipProvider delayDuration={200}>
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 w-full">
				{/* Armor Class Block */}
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							onClick={onACClick}
							className="relative group bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-4 flex flex-col items-center justify-center transition-all hover:bg-obsidian-charcoal/80 hover:border-primary/40 w-full"
						>
							<Shield className="w-5 h-5 text-blue-400 mb-2 transition-transform group-hover:scale-110" />
							<span className="ra-stat-number text-3xl text-white">{ac}</span>
							<span className="text-[10px] font-mono text-primary/70 uppercase tracking-widest mt-1">
								ARMOR_CLASS
							</span>
							<div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<Badge
									variant="outline"
									className="text-[10px] h-3.5 px-1 border-primary/30"
								>
									DEFENSE
								</Badge>
							</div>
						</button>
					</TooltipTrigger>
					{acBreakdown && (
						<TooltipContent
							side="bottom"
							className="font-mono text-xs max-w-[250px] whitespace-normal"
						>
							<div className="font-bold text-primary mb-1 border-b border-primary/20 pb-1">
								AC Calculation
							</div>
							<div className="text-muted-foreground">{acBreakdown}</div>
						</TooltipContent>
					)}
				</Tooltip>

				{/* Initiative Block */}
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							onClick={onRollInitiative}
							className="relative group bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-4 flex flex-col items-center justify-center transition-all hover:bg-obsidian-charcoal/80 hover:border-primary/40 w-full"
						>
							<Zap className="w-5 h-5 text-yellow-400 mb-2 transition-transform group-hover:scale-110" />
							<div className="flex items-center gap-1">
								<span className="ra-stat-number text-3xl text-white">
									{formatModifier(initiative)}
								</span>
								<Dice6 className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
							</div>
							<span className="text-[10px] font-mono text-primary/70 uppercase tracking-widest mt-1">
								INITIATIVE
							</span>
						</button>
					</TooltipTrigger>
					{initiativeBreakdown && (
						<TooltipContent
							side="bottom"
							className="font-mono text-xs max-w-[200px] whitespace-normal"
						>
							<div className="font-bold text-primary mb-1 border-b border-primary/20 pb-1">
								Initiative Calculation
							</div>
							<div className="text-muted-foreground">{initiativeBreakdown}</div>
						</TooltipContent>
					)}
				</Tooltip>

				{/* Speed Block */}
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-4 flex flex-col items-center justify-center w-full">
							<Move className="w-5 h-5 text-emerald-400 mb-2" />
							<span className="ra-stat-number text-3xl text-white">
								{speed}{" "}
								<span className="text-sm font-mono text-primary/60">FT</span>
							</span>
							<span className="text-[10px] font-mono text-primary/70 uppercase tracking-widest mt-1">
								WALK_SPEED
							</span>
						</div>
					</TooltipTrigger>
					{speedBreakdown && (
						<TooltipContent
							side="bottom"
							className="font-mono text-xs max-w-[200px] whitespace-normal"
						>
							<div className="font-bold text-primary mb-1 border-b border-primary/20 pb-1">
								Speed Calculation
							</div>
							<div className="text-muted-foreground">{speedBreakdown}</div>
						</TooltipContent>
					)}
				</Tooltip>

				{/* Proficiency Bonus Block */}
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							data-testid="status-proficiency-bonus"
							className="bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-4 flex flex-col items-center justify-center w-full"
						>
							<Award className="w-5 h-5 text-amber-300 mb-2" />
							<span className="ra-stat-number text-3xl text-white">
								{formatModifier(proficiencyBonus)}
							</span>
							<span className="text-[10px] font-mono text-primary/70 uppercase tracking-widest mt-1">
								PROF_BONUS
							</span>
						</div>
					</TooltipTrigger>
					<TooltipContent
						side="bottom"
						className="font-mono text-xs max-w-[220px] whitespace-normal"
					>
						<div className="font-bold text-primary mb-1 border-b border-primary/20 pb-1">
							Proficiency Bonus
						</div>
						<div className="text-muted-foreground">
							Added to attacks, saves, and skills you are proficient in. Tier{" "}
							{proficiencyTier} · Level {characterLevel}.
						</div>
					</TooltipContent>
				</Tooltip>

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
							<span className="ra-stat-number text-3xl text-white">
								{hp.current}
							</span>
							<span className="text-base text-primary/70">/</span>
							<span className="text-base text-primary/70 font-mono font-bold">
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

				{/* Resources (Hit Dice, Rift Favor & Inspiration) */}
				<div className="grid grid-cols-3 gap-2 h-full">
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
								<Minus className="w-3 h-3 text-primary/60" />
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
								<Plus className="w-3 h-3 text-primary/60" />
							</button>
						</div>
						<span className="text-[10px] text-primary/70 uppercase">
							HIT_DICE
						</span>
						<span className="text-[10px] text-primary/60 italic">
							d{hitDice.size}
						</span>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-2 flex flex-col items-center justify-center relative group font-mono hover:bg-amber-500/10 hover:border-amber-500/40 transition-colors w-full cursor-pointer h-full"
							>
								<div className="flex items-center gap-1.5">
									<span className="text-sm font-bold text-amber-400">
										{riftFavor.current}/{riftFavor.max}
									</span>
								</div>
								<span className="text-[10px] text-amber-500/70 uppercase mt-1 font-bold flex items-center gap-1">
									<Sparkles className="w-2 h-2" /> SPEND FAVOR
								</span>
								<span className="text-[10px] text-amber-500/50 mt-0.5">
									d{riftFavor.die}
								</span>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							{availableFavorOptions.map((opt) => {
								const canAfford = affordableFavorOptions.some(
									(a) => a.id === opt.id,
								);
								return (
									<DropdownMenuItem
										key={opt.id}
										disabled={!canAfford}
										onClick={() => handleSpendFavor(opt.id)}
										className="flex flex-col items-start gap-1 p-2 cursor-pointer"
									>
										<div className="flex justify-between w-full">
											<span className="font-bold text-amber-400">
												{opt.name}
											</span>
											<span className="text-xs">Cost: {opt.cost}</span>
										</div>
										<span className="text-[10px] text-muted-foreground whitespace-normal">
											{opt.rulesText || opt.description}
										</span>
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>

					<div className="bg-obsidian-charcoal/60 border border-primary/20 rounded-[2px] p-2 flex flex-col items-center justify-center relative group">
						<div className="flex items-center gap-1.5">
							<button
								type="button"
								onClick={() => handleInspiration(-1)}
								disabled={inspirationPoints <= 0}
								aria-label="Spend Inspiration"
								className="p-1 hover:bg-primary/10 rounded transition-colors disabled:opacity-40"
							>
								<Minus className="w-3 h-3 text-primary/60" />
							</button>
							<span
								className={`text-sm font-bold ${inspirationPoints > 0 ? "text-yellow-400" : "text-white"}`}
							>
								{inspirationPoints}
							</span>
							<button
								type="button"
								onClick={() => handleInspiration(1)}
								aria-label="Gain Inspiration"
								className="p-1 hover:bg-primary/10 rounded transition-colors"
							>
								<Plus className="w-3 h-3 text-primary/60" />
							</button>
						</div>
						<span className="text-[10px] text-primary/70 uppercase flex items-center gap-1">
							<Award className="w-2 h-2" /> INSPIRATION
						</span>
					</div>
				</div>

				{hp.current === 0 && (
					<div className="col-span-2 md:col-span-4 lg:col-span-7 mt-4">
						<DeathSaveTracker
							successes={deathSaves.successes}
							failures={deathSaves.failures}
							isStable={deathSaves.isStable}
							isDead={deathSaves.isDead}
							hpCurrent={hp.current}
							onRollDeathSave={deathSaves.onRoll}
							onStabilize={deathSaves.onStabilize}
							characterId={characterId}
						/>
					</div>
				)}
			</div>
		</TooltipProvider>
	);
}
