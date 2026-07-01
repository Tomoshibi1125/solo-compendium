/**
 * VehiclesPanel — character-owned mounts + vehicles list (Q7 of Round 3).
 * Mounts and constructed vehicles share the same data shape; visual
 * differentiation comes from the canonical `vehicle_type` field.
 */
import { Minus, Plus, Trash2, Truck, Wrench, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AddVehicleDialog } from "@/components/character/AddVehicleDialog";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { allVehicleMods } from "@/data/compendium/vehicleMods";
import {
	type CharacterVehicleRow,
	useCharacterRequisitionProfile,
	useCharacterVehicles,
	useDeleteCharacterVehicle,
	useInstallVehicleMod,
	useRemoveVehicleMod,
	useUpdateCharacterVehicleCondition,
	useUpdateCharacterVehicleHP,
} from "@/hooks/useVehicles";
import { cn } from "@/lib/utils";
import type {
	CompendiumVehicle,
	CompendiumVehicleMod,
	VehicleConditionState,
} from "@/types/compendium";

interface VehiclesPanelProps {
	characterId: string;
	readOnly?: boolean;
}

const vehicleConditions: VehicleConditionState[] = [
	"operational",
	"strained",
	"damaged",
	"crippled",
	"dead",
];

const mountConditions: VehicleConditionState[] = [
	"calm",
	"uneasy",
	"panicked",
	"injured",
	"broken",
];

const conditionLabels: Record<VehicleConditionState, string> = {
	operational: "Operational",
	strained: "Strained",
	damaged: "Damaged",
	crippled: "Crippled",
	dead: "Dead",
	calm: "Calm",
	uneasy: "Uneasy",
	panicked: "Panicked",
	injured: "Injured",
	broken: "Broken",
};

const modById = new Map<string, CompendiumVehicleMod>(
	allVehicleMods.map((mod) => [mod.id, mod]),
);

const getInstalledMods = (row: CharacterVehicleRow) =>
	(row.installed_mod_ids ?? [])
		.map((id) => modById.get(id))
		.filter((mod): mod is CompendiumVehicleMod => Boolean(mod));

const getUsedCapacity = (mods: CompendiumVehicleMod[]) =>
	mods.reduce((total, mod) => total + mod.capacity_cost, 0);

export function VehiclesPanel({ characterId, readOnly }: VehiclesPanelProps) {
	const { data: vehicles = [] } = useCharacterVehicles(characterId);
	const { data: requisitionProfile } =
		useCharacterRequisitionProfile(characterId);
	const deleteVehicle = useDeleteCharacterVehicle();
	const updateHp = useUpdateCharacterVehicleHP();
	const updateCondition = useUpdateCharacterVehicleCondition();
	const installMod = useInstallVehicleMod();
	const removeMod = useRemoveVehicleMod();
	const [addOpen, setAddOpen] = useState(false);
	const [catalog, setCatalog] = useState<CompendiumVehicle[]>([]);
	const [selectedModByVehicle, setSelectedModByVehicle] = useState<
		Record<string, string>
	>({});

	useEffect(() => {
		let cancelled = false;
		(async () => {
			const mod = await import("@/data/compendium/vehicles");
			if (!cancelled) setCatalog(mod.allVehicles);
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const catalogById = useMemo(() => {
		const map = new Map<string, CompendiumVehicle>();
		for (const v of catalog) map.set(v.id, v);
		return map;
	}, [catalog]);

	const handleDelete = (row: CharacterVehicleRow) => {
		deleteVehicle.mutate({
			characterId,
			vehicleLinkId: row.id,
		});
	};

	const adjustHp = (row: CharacterVehicleRow, delta: number, maxHp: number) => {
		const next = Math.min(maxHp, Math.max(0, row.current_hp + delta));
		if (next === row.current_hp) return;
		updateHp.mutate({ characterId, vehicleLinkId: row.id, currentHp: next });
	};

	return (
		<AscendantWindow title="VEHICLES & MOUNTS">
			<div className="space-y-3">
				<div className="flex flex-wrap items-center justify-between gap-2 rounded border border-border/40 bg-black/20 px-3 py-2">
					<div className="text-xs text-muted-foreground">
						Vehicle Requisition Points
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">
							{requisitionProfile?.available_vrp ?? 0} /{" "}
							{requisitionProfile?.total_vrp ?? 0} VRP available
						</Badge>
						<Badge variant="outline">
							{requisitionProfile?.spent_vrp ?? 0} spent
						</Badge>
					</div>
				</div>

				{vehicles.length === 0 ? (
					<p className="text-xs text-muted-foreground text-center py-4">
						No vehicles or mounts yet. Add one from the canonical catalog.
					</p>
				) : (
					<div className="space-y-2">
						{vehicles.map((row) => {
							const catalogEntry = catalogById.get(row.vehicle_id);
							if (!catalogEntry) {
								return (
									<div
										key={row.id}
										className="rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs"
									>
										<span className="font-mono text-amber-300">
											Unknown vehicle id: {row.vehicle_id}
										</span>
									</div>
								);
							}
							const maxHp = row.max_hp_override ?? catalogEntry.hit_points.max;
							const hpPercent = Math.min(
								100,
								Math.max(0, (row.current_hp / maxHp) * 100),
							);
							const isMount = catalogEntry.vehicle_type === "mount";
							const installedMods = getInstalledMods(row);
							const usedCapacity = getUsedCapacity(installedMods);
							const modCapacity = catalogEntry.mod_capacity ?? 0;
							const remainingCapacity = Math.max(0, modCapacity - usedCapacity);
							const conditionOptions = isMount
								? mountConditions
								: vehicleConditions;
							const currentCondition: VehicleConditionState =
								row.condition_state ?? (isMount ? "calm" : "operational");
							const compatibleMods = allVehicleMods.filter((mod) => {
								if ((row.installed_mod_ids ?? []).includes(mod.id))
									return false;
								if (mod.mod_type !== (isMount ? "mount" : "vehicle"))
									return false;
								if (
									catalogEntry.allowed_mod_categories?.length &&
									!catalogEntry.allowed_mod_categories.includes(mod.category)
								) {
									return false;
								}
								return mod.capacity_cost <= remainingCapacity;
							});
							const selectedModId = selectedModByVehicle[row.id] ?? "";
							return (
								<div
									key={row.id}
									className="rounded border border-border/40 bg-black/20 p-3"
									data-testid={`vehicle-row-${row.id}`}
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 flex-wrap">
												{isMount ? (
													<span className="text-fuchsia-300">🐾</span>
												) : (
													<Truck className="w-4 h-4 text-blue-300" />
												)}
												<span className="font-display font-semibold text-sm">
													{row.nickname || catalogEntry.name}
												</span>
												<Badge
													variant="outline"
													className="text-[11px] uppercase"
												>
													{catalogEntry.vehicle_type}
												</Badge>
												<Badge variant="outline" className="text-[11px]">
													{catalogEntry.size}
												</Badge>
												{catalogEntry.rank && (
													<Badge variant="secondary" className="text-[11px]">
														Rank {catalogEntry.rank}
													</Badge>
												)}
												<Badge variant="outline" className="text-[11px]">
													{row.vrp_cost_paid ?? catalogEntry.vrp_cost ?? 0} VRP
												</Badge>
											</div>
											<div className="text-xs text-muted-foreground mt-1">
												AC {catalogEntry.armor_class} · HP {row.current_hp} /{" "}
												{maxHp}
											</div>
											<Progress
												value={hpPercent}
												className={cn(
													"h-1.5 mt-2",
													hpPercent < 25
														? "bg-red-900"
														: hpPercent < 50
															? "bg-amber-900"
															: "bg-emerald-900",
												)}
											/>
											{!readOnly && (
												<div className="mt-2 flex items-center gap-1">
													<Button
														size="sm"
														variant="outline"
														className="h-6 w-6 p-0"
														onClick={() => adjustHp(row, -1, maxHp)}
														disabled={row.current_hp <= 0}
														aria-label={`Damage ${catalogEntry.name}`}
														data-testid={`vehicle-hp-minus-${row.id}`}
													>
														<Minus className="w-3 h-3" />
													</Button>
													<Button
														size="sm"
														variant="outline"
														className="h-6 w-6 p-0"
														onClick={() => adjustHp(row, 1, maxHp)}
														disabled={row.current_hp >= maxHp}
														aria-label={`Repair ${catalogEntry.name}`}
														data-testid={`vehicle-hp-plus-${row.id}`}
													>
														<Plus className="w-3 h-3" />
													</Button>
												</div>
											)}
											<div className="mt-3 grid gap-2 md:grid-cols-[minmax(0,180px)_1fr]">
												<div className="space-y-1">
													<div className="text-[11px] uppercase text-muted-foreground">
														Condition
													</div>
													{readOnly ? (
														<Badge variant="outline">
															{conditionLabels[currentCondition]}
														</Badge>
													) : (
														<Select
															value={currentCondition}
															onValueChange={(value) =>
																updateCondition.mutate({
																	characterId,
																	vehicleLinkId: row.id,
																	conditionState:
																		value as VehicleConditionState,
																})
															}
														>
															<SelectTrigger className="h-8 text-xs">
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																{conditionOptions.map((condition) => (
																	<SelectItem key={condition} value={condition}>
																		{conditionLabels[condition]}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												</div>

												<div className="space-y-2">
													<div className="flex flex-wrap items-center gap-2">
														<span className="text-[11px] uppercase text-muted-foreground">
															Mods
														</span>
														<Badge variant="outline" className="text-[11px]">
															{usedCapacity} / {modCapacity} capacity
														</Badge>
														<Badge variant="outline" className="text-[11px]">
															{remainingCapacity} remaining
														</Badge>
													</div>
													<div className="flex flex-wrap gap-1.5">
														{installedMods.length === 0 ? (
															<span className="text-xs text-muted-foreground">
																No installed mods
															</span>
														) : (
															installedMods.map((mod) => (
																<Badge
																	key={mod.id}
																	variant="secondary"
																	className="gap-1 pr-1"
																>
																	{mod.name}
																	{!readOnly && (
																		<button
																			type="button"
																			className="rounded hover:bg-background/40"
																			onClick={() =>
																				removeMod.mutate({
																					characterId,
																					vehicleLinkId: row.id,
																					modId: mod.id,
																				})
																			}
																			aria-label={`Remove ${mod.name}`}
																		>
																			<X className="w-3 h-3" />
																		</button>
																	)}
																</Badge>
															))
														)}
													</div>
													{!readOnly && (
														<div className="flex flex-col gap-2 sm:flex-row">
															<Select
																value={selectedModId}
																onValueChange={(value) =>
																	setSelectedModByVehicle((prev) => ({
																		...prev,
																		[row.id]: value,
																	}))
																}
																disabled={compatibleMods.length === 0}
															>
																<SelectTrigger className="h-8 text-xs sm:flex-1">
																	<SelectValue
																		placeholder={
																			compatibleMods.length === 0
																				? "No compatible mods"
																				: "Choose mod"
																		}
																	/>
																</SelectTrigger>
																<SelectContent>
																	{compatibleMods.map((mod) => (
																		<SelectItem key={mod.id} value={mod.id}>
																			{mod.name} ({mod.vrp_cost} VRP,{" "}
																			{mod.capacity_cost} cap)
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<Button
																size="sm"
																variant="outline"
																className="h-8 gap-2"
																disabled={
																	!selectedModId || installMod.isPending
																}
																onClick={() => {
																	if (!selectedModId) return;
																	installMod.mutate({
																		characterId,
																		vehicleLinkId: row.id,
																		modId: selectedModId,
																	});
																	setSelectedModByVehicle((prev) => ({
																		...prev,
																		[row.id]: "",
																	}));
																}}
															>
																<Wrench className="w-3.5 h-3.5" />
																Install
															</Button>
														</div>
													)}
												</div>
											</div>
										</div>
										{!readOnly && (
											<Button
												size="sm"
												variant="ghost"
												onClick={() => handleDelete(row)}
												aria-label={`Remove ${catalogEntry.name}`}
												className="text-destructive hover:text-destructive"
											>
												<Trash2 className="w-3.5 h-3.5" />
											</Button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}

				{!readOnly && (
					<Button
						variant="outline"
						size="sm"
						className="w-full gap-2"
						onClick={() => setAddOpen(true)}
						data-testid="vehicle-add-btn"
					>
						<Plus className="w-4 h-4" />
						Add Vehicle or Mount
					</Button>
				)}
			</div>
			<AddVehicleDialog
				open={addOpen}
				onOpenChange={setAddOpen}
				characterId={characterId}
				catalog={catalog}
			/>
		</AscendantWindow>
	);
}
