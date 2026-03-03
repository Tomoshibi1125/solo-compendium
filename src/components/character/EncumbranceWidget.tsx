import {
	AlertOctagon,
	AlertTriangle,
	CheckCircle2,
	Weight,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCharacter } from "@/hooks/useCharacters";
import { useEncumbranceSettings } from "@/hooks/useEncumbranceSettings";
import { useEquipment } from "@/hooks/useEquipment";
import {
	calculateCarryingCapacity,
	calculateEncumbrance,
	calculateTotalWeight,
} from "@/lib/encumbrance";
import { cn } from "@/lib/utils";

interface EncumbranceWidgetProps {
	characterId: string;
	/** When true renders in a compact single-row form (for stat bars). Default = full */
	compact?: boolean;
}

const STATUS_CONFIG = {
	unencumbered: {
		barClass: "bg-green-500",
		icon: CheckCircle2,
		iconClass: "text-green-400",
		label: "Unencumbered",
		penalty: null,
	},
	light: {
		barClass: "bg-blue-400",
		icon: Weight,
		iconClass: "text-blue-400",
		label: "Light Load",
		penalty: null,
	},
	medium: {
		barClass: "bg-yellow-400",
		icon: Weight,
		iconClass: "text-yellow-400",
		label: "Medium Load",
		penalty: null,
	},
	heavy: {
		barClass: "bg-orange-400",
		icon: AlertTriangle,
		iconClass: "text-orange-400",
		label: "Heavy Load",
		penalty: "Speed −10 ft.",
	},
	overloaded: {
		barClass: "bg-red-500",
		icon: AlertOctagon,
		iconClass: "text-red-400",
		label: "Overloaded",
		penalty: "Speed −20 ft. · Disadvantage on STR/AGI checks",
	},
} as const;

/** Thin custom progress bar that supports any indicator color class. */
function WeightBar({ pct, barClass }: { pct: number; barClass: string }) {
	return (
		<div className="relative h-2 w-full overflow-hidden rounded-full bg-border/40">
			<div
				className={cn(
					"h-full rounded-full transition-all duration-500",
					barClass,
				)}
				style={{ width: `${pct}%` }}
			/>
		</div>
	);
}

export function EncumbranceWidget({
	characterId,
	compact = false,
}: EncumbranceWidgetProps) {
	const { equipment } = useEquipment(characterId);
	const { data: character } = useCharacter(characterId);
	const { ignoreCurrencyWeight } = useEncumbranceSettings(characterId);

	const strScore =
		(character?.abilities as Record<string, number> | undefined)?.STR ?? 10;
	const totalWeight = calculateTotalWeight(equipment, ignoreCurrencyWeight);
	const carryingCapacity = calculateCarryingCapacity(strScore);
	const enc = calculateEncumbrance(totalWeight, carryingCapacity);
	const cfg = STATUS_CONFIG[enc.status];
	const StatusIcon = cfg.icon;

	// Clamp progress at 100% visually — overloaded just fills the bar
	const progressPct = Math.min(100, (totalWeight / carryingCapacity) * 100);

	if (compact) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="flex items-center gap-1.5 cursor-default select-none min-w-[130px]">
						<StatusIcon className={cn("w-3.5 h-3.5 shrink-0", cfg.iconClass)} />
						<WeightBar pct={progressPct} barClass={cfg.barClass} />
						<span className="text-[10px] text-muted-foreground font-mono tabular-nums whitespace-nowrap">
							{totalWeight.toFixed(1)}/{carryingCapacity} lb
						</span>
					</div>
				</TooltipTrigger>
				<TooltipContent side="bottom" className="text-xs space-y-1 max-w-xs">
					<p className="font-semibold">{cfg.label}</p>
					<p>
						Carrying:{" "}
						<span className="font-mono">{totalWeight.toFixed(1)} lb</span> of{" "}
						<span className="font-mono">{carryingCapacity} lb</span>
					</p>
					{cfg.penalty && <p className="text-orange-400">{cfg.penalty}</p>}
					<p className="text-muted-foreground">
						Push/drag/lift: {enc.pushDragLift} lb
					</p>
				</TooltipContent>
			</Tooltip>
		);
	}

	return (
		<div
			className={cn(
				"rounded-lg border p-3 space-y-2 transition-colors",
				enc.status === "heavy" && "border-orange-400/50 bg-orange-400/5",
				enc.status === "overloaded" && "border-red-500/60 bg-red-500/5",
				enc.status !== "heavy" &&
					enc.status !== "overloaded" &&
					"border-border bg-muted/20",
			)}
		>
			{/* Header row */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<StatusIcon className={cn("w-4 h-4", cfg.iconClass)} />
					<span className="text-xs font-display tracking-wider text-muted-foreground">
						WEIGHT
					</span>
				</div>
				<span className={cn("text-xs font-semibold", cfg.iconClass)}>
					{cfg.label}
				</span>
			</div>

			{/* Weight bar */}
			<WeightBar pct={progressPct} barClass={cfg.barClass} />

			{/* Stats row */}
			<div className="flex items-center justify-between text-xs text-muted-foreground">
				<span className="font-mono tabular-nums">
					{totalWeight.toFixed(1)}{" "}
					<span className="opacity-60">/ {carryingCapacity} lb</span>
				</span>
				<span className="opacity-70">Push/lift {enc.pushDragLift} lb</span>
			</div>

			{/* Penalty callout */}
			{cfg.penalty && (
				<div
					className={cn(
						"flex items-center gap-1.5 text-xs rounded px-2 py-1",
						enc.status === "overloaded"
							? "bg-red-500/15 text-red-400"
							: "bg-orange-400/15 text-orange-400",
					)}
				>
					<AlertTriangle className="w-3 h-3 shrink-0" />
					{cfg.penalty}
				</div>
			)}
		</div>
	);
}
