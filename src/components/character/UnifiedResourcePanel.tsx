/**
 * UnifiedResourcePanel — the auto-populated Resources section.
 *
 * Every resource the character owns shows up here without setup: job pools
 * seed themselves, ammunition/consumables/charged items appear the moment
 * the item lands in inventory (adjustments write back to the equipment row,
 * so the attack cards and inventory always agree), and users can still add
 * free-form custom trackers. Spending is manual everywhere; the Ammunition
 * header carries the opt-in auto-spend-on-attack toggle for tables that
 * enforce ammo.
 */

import {
	BatteryCharging,
	Crosshair,
	FlaskConical,
	Minus,
	Plus,
	Sparkles,
	Trash2,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUnifiedResources } from "@/hooks/useUnifiedResources";
import type {
	CustomResource,
	ResourceRecharge,
} from "@/lib/characterResources";
import type { EquipmentResourceEntry } from "@/lib/unifiedResources";
import { cn } from "@/lib/utils";

interface UnifiedResourcePanelProps {
	characterId: string;
	/** Tighter variant for the Actions tab (no custom-add row). */
	compact?: boolean;
	readOnly?: boolean;
	className?: string;
}

const RECHARGE_LABEL: Record<ResourceRecharge, string> = {
	"short-rest": "Short rest",
	"long-rest": "Long rest",
	encounter: "Encounter",
	daily: "Daily",
	none: "Manual",
};

function countTone(current: number, max: number | null): string {
	if (current === 0) return "text-red-500";
	const low = max !== null ? Math.max(1, Math.floor(max * 0.25)) : 5;
	return current <= low ? "text-amber-500" : "text-fuchsia-100";
}

function Stepper({
	current,
	max,
	onAdjust,
	disabled,
}: {
	current: number;
	max: number | null;
	onAdjust: (delta: number) => void;
	disabled?: boolean;
}) {
	return (
		<div className="flex items-center gap-1 bg-black/80 rounded-md p-1 border border-fuchsia-500/20 shadow-inner">
			<button
				type="button"
				onClick={() => onAdjust(-1)}
				disabled={disabled || current <= 0}
				className="p-1 hover:bg-fuchsia-500/20 rounded disabled:opacity-50 text-red-400 transition-colors"
				aria-label="Spend one"
			>
				<Minus className="w-3.5 h-3.5" />
			</button>
			<span
				className={cn(
					"min-w-12 px-1 text-center font-bold font-mono text-sm tracking-wider",
					countTone(current, max),
				)}
			>
				{current}
				{max !== null ? `/${max}` : ""}
			</span>
			<button
				type="button"
				onClick={() => onAdjust(1)}
				disabled={disabled || (max !== null && current >= max)}
				className="p-1 hover:bg-fuchsia-500/20 rounded disabled:opacity-50 text-emerald-400 transition-colors"
				aria-label="Regain one"
			>
				<Plus className="w-3.5 h-3.5" />
			</button>
		</div>
	);
}

function SectionHeading({
	icon: Icon,
	label,
	count,
	action,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	count: number;
	action?: React.ReactNode;
}) {
	return (
		<div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-fuchsia-400/80">
			<Icon className="w-3.5 h-3.5" />
			{label}
			<Badge variant="outline" className="text-[10px] h-4 px-1">
				{count}
			</Badge>
			{action && (
				<div className="ml-auto flex items-center gap-2">{action}</div>
			)}
		</div>
	);
}

export function UnifiedResourcePanel({
	characterId,
	compact = false,
	readOnly = false,
	className,
}: UnifiedResourcePanelProps) {
	const {
		jobPools,
		customRows,
		equipmentSections,
		autoSpendAmmo,
		setAutoSpendAmmo,
		adjustCustom,
		addCustom,
		removeCustom,
		adjustEquipment,
	} = useUnifiedResources(characterId, { reconcile: !readOnly });

	const [newName, setNewName] = useState("");
	const [newMax, setNewMax] = useState("");
	const [newRecharge, setNewRecharge] = useState<ResourceRecharge>("long-rest");

	const handleAdd = () => {
		const name = newName.trim();
		const max = Number.parseInt(newMax, 10);
		if (!name || !Number.isFinite(max) || max <= 0) return;
		void addCustom({ name, max, recharge: newRecharge });
		setNewName("");
		setNewMax("");
	};

	const renderCustomRow = (row: CustomResource, deletable: boolean) => (
		<div
			key={row.id}
			className="flex items-center justify-between gap-3 p-3 rounded-md border border-fuchsia-500/20 bg-black/60 shadow-inner group transition-all hover:border-fuchsia-500/40 hover:bg-black/80"
		>
			<div className="min-w-0">
				<div className="font-bold text-sm text-primary-foreground truncate">
					{row.name}
				</div>
				<div className="text-[10px] text-muted-foreground mt-0.5">
					{RECHARGE_LABEL[row.recharge ?? "none"]}
				</div>
			</div>
			<div className="flex items-center gap-2 flex-shrink-0">
				<Stepper
					current={row.current}
					max={row.max}
					onAdjust={(delta) => void adjustCustom(row.id, delta)}
					disabled={readOnly}
				/>
				{deletable && !readOnly && (
					<button
						type="button"
						onClick={() => void removeCustom(row.id)}
						className="p-2 hover:bg-red-500/20 text-red-500/50 hover:text-red-400 rounded-md transition-colors opacity-0 group-hover:opacity-100"
						aria-label={`Delete ${row.name}`}
					>
						<Trash2 className="w-4 h-4" />
					</button>
				)}
			</div>
		</div>
	);

	const renderEquipmentRow = (entry: EquipmentResourceEntry) => (
		<div
			key={entry.equipmentId}
			className="flex items-center justify-between gap-3 p-3 rounded-md border border-fuchsia-500/20 bg-black/60 shadow-inner transition-all hover:border-fuchsia-500/40 hover:bg-black/80"
		>
			<div className="min-w-0">
				<div className="font-bold text-sm text-primary-foreground truncate">
					{entry.name}
				</div>
				<div className="text-[10px] text-muted-foreground mt-0.5">
					{entry.kind === "charges" ? "Item charges" : "From inventory"}
				</div>
			</div>
			<Stepper
				current={entry.current}
				max={entry.max}
				onAdjust={(delta) => void adjustEquipment(entry, delta)}
				disabled={readOnly}
			/>
		</div>
	);

	const { ammunition, consumables, charges } = equipmentSections;
	const isEmpty =
		jobPools.length === 0 &&
		customRows.length === 0 &&
		ammunition.length === 0 &&
		consumables.length === 0 &&
		charges.length === 0;

	if (compact && isEmpty) return null;

	return (
		<Card
			className={cn(
				"bg-obsidian-charcoal/80 border border-fuchsia-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(217,70,239,0.1)]",
				className,
			)}
		>
			<CardHeader className="pb-3 border-b border-fuchsia-500/20">
				<CardTitle className="text-lg flex items-center gap-2 text-fuchsia-400 font-display tracking-wide">
					<Sparkles className="w-4 h-4" />
					Resources
				</CardTitle>
			</CardHeader>
			<CardContent className={cn("pt-4 space-y-5", compact && "space-y-4")}>
				{isEmpty && (
					<div className="text-sm text-fuchsia-400/60 text-center py-6 border border-dashed border-fuchsia-500/30 rounded-md bg-fuchsia-500/5">
						No resources yet — job pools, ammunition, consumables, and charged
						items appear here automatically.
					</div>
				)}

				{jobPools.length > 0 && (
					<div className="space-y-2">
						<SectionHeading
							icon={Zap}
							label="Job Pools"
							count={jobPools.length}
						/>
						{jobPools.map((row) => renderCustomRow(row, false))}
					</div>
				)}

				{ammunition.length > 0 && (
					<div className="space-y-2">
						<SectionHeading
							icon={Crosshair}
							label="Ammunition"
							count={ammunition.length}
							action={
								!readOnly && (
									<label
										htmlFor="auto-spend-ammo-toggle"
										className="flex items-center gap-1.5 normal-case tracking-normal text-[10px] text-muted-foreground cursor-pointer"
									>
										Auto-spend on attack
										<Switch
											id="auto-spend-ammo-toggle"
											checked={autoSpendAmmo}
											onCheckedChange={(v) => void setAutoSpendAmmo(v)}
											aria-label="Auto-spend ammunition on attack"
										/>
									</label>
								)
							}
						/>
						{ammunition.map(renderEquipmentRow)}
					</div>
				)}

				{consumables.length > 0 && (
					<div className="space-y-2">
						<SectionHeading
							icon={FlaskConical}
							label="Consumables"
							count={consumables.length}
						/>
						{consumables.map(renderEquipmentRow)}
					</div>
				)}

				{charges.length > 0 && (
					<div className="space-y-2">
						<SectionHeading
							icon={BatteryCharging}
							label="Charged Items"
							count={charges.length}
						/>
						{charges.map(renderEquipmentRow)}
					</div>
				)}

				{customRows.length > 0 && (
					<div className="space-y-2">
						<SectionHeading
							icon={Sparkles}
							label="Custom"
							count={customRows.length}
						/>
						{customRows.map((row) => renderCustomRow(row, true))}
					</div>
				)}

				{!compact && !readOnly && (
					<div className="pt-4 border-t border-fuchsia-500/20 flex flex-wrap sm:flex-nowrap items-center gap-2">
						<Input
							placeholder="New resource name..."
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							className="h-9 flex-1 min-w-[140px] text-xs bg-black/40 border-fuchsia-500/20 text-fuchsia-100 placeholder:text-fuchsia-500/30 focus-visible:ring-fuchsia-500/50"
						/>
						<Input
							type="number"
							placeholder="Max"
							value={newMax}
							onChange={(e) => setNewMax(e.target.value)}
							className="h-9 w-20 text-xs bg-black/40 border-fuchsia-500/20 text-fuchsia-100 placeholder:text-fuchsia-500/30 focus-visible:ring-fuchsia-500/50"
						/>
						<select
							value={newRecharge}
							onChange={(e) =>
								setNewRecharge(e.target.value as ResourceRecharge)
							}
							className="h-9 text-xs bg-black/40 border border-fuchsia-500/20 rounded-md px-2 text-fuchsia-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50"
						>
							<option value="long-rest">Long rest</option>
							<option value="short-rest">Short rest</option>
							<option value="encounter">Encounter</option>
							<option value="daily">Daily</option>
							<option value="none">Manual</option>
						</select>
						<Button
							size="sm"
							onClick={handleAdd}
							className="h-9 px-4 whitespace-nowrap bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-bold tracking-wide"
						>
							<Plus className="w-4 h-4 mr-1.5" /> Add
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
