import {
	AlertOctagon,
	AlertTriangle,
	CheckCircle2,
	Weight,
} from "lucide-react";
import { InfoPopover } from "@/components/ui/InfoPopover";
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

/* Cool severity ramp: teal → blue → cyan → violet → crimson (no warm hues). */
const STATUS_CONFIG = {
	unencumbered: {
		barClass: "bg-success",
		icon: CheckCircle2,
		iconClass: "text-success",
		label: "Unencumbered",
		penalty: null,
	},
	light: {
		barClass: "bg-shadow-blue",
		icon: Weight,
		iconClass: "text-shadow-blue",
		label: "Light Load",
		penalty: null,
	},
	medium: {
		barClass: "bg-warning",
		icon: Weight,
		iconClass: "text-warning",
		label: "Medium Load",
		penalty: null,
	},
	heavy: {
		barClass: "bg-resurge",
		icon: AlertTriangle,
		iconClass: "text-resurge",
		label: "Heavy Load",
		penalty: "Speed −10 ft.",
	},
	overloaded: {
		barClass: "bg-destructive",
		icon: AlertOctagon,
		iconClass: "text-destructive",
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
			<InfoPopover
				side="bottom"
				ariaLabel={`${cfg.label} carrying details`}
				triggerClassName="flex items-center gap-1.5 select-none min-w-[130px]"
				className="text-xs space-y-1 max-w-xs"
				content={
					<>
						<p className="font-semibold">{cfg.label}</p>
						<p>
							Carrying:{" "}
							<span className="font-mono">{totalWeight.toFixed(1)} lb</span> of{" "}
							<span className="font-mono">{carryingCapacity} lb</span>
						</p>
						{cfg.penalty && <p className="text-resurge">{cfg.penalty}</p>}
						<p className="text-muted-foreground">
							Push/drag/lift: {enc.pushDragLift} lb
						</p>
					</>
				}
			>
				<StatusIcon className={cn("w-3.5 h-3.5 shrink-0", cfg.iconClass)} />
				<WeightBar pct={progressPct} barClass={cfg.barClass} />
				<span className="text-[10px] text-muted-foreground font-mono tabular-nums whitespace-nowrap">
					{totalWeight.toFixed(1)}/{carryingCapacity} lb
				</span>
			</InfoPopover>
		);
	}

	return (
		<div
			className={cn(
				"rounded-lg border p-3 space-y-2 transition-colors",
				enc.status === "heavy" && "border-resurge/50 bg-resurge/5",
				enc.status === "overloaded" && "border-destructive/60 bg-destructive/5",
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
							: "bg-gate-a/15 text-gate-a",
					)}
				>
					<AlertTriangle className="w-3 h-3 shrink-0" />
					{cfg.penalty}
				</div>
			)}
		</div>
	);
}
