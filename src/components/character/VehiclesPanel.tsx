/**
 * VehiclesPanel — character-owned mounts + vehicles list (Q7 of Round 3).
 * Mounts and constructed vehicles share the same data shape; visual
 * differentiation comes from the canonical `vehicle_type` field.
 */
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AddVehicleDialog } from "@/components/character/AddVehicleDialog";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
	type CharacterVehicleRow,
	useCharacterVehicles,
	useDeleteCharacterVehicle,
	useUpdateCharacterVehicleHP,
} from "@/hooks/useVehicles";
import { cn } from "@/lib/utils";
import type { CompendiumVehicle } from "@/types/compendium";

interface VehiclesPanelProps {
	characterId: string;
	readOnly?: boolean;
}

export function VehiclesPanel({ characterId, readOnly }: VehiclesPanelProps) {
	const { data: vehicles = [] } = useCharacterVehicles(characterId);
	const deleteVehicle = useDeleteCharacterVehicle();
	const updateHp = useUpdateCharacterVehicleHP();
	const { toast } = useToast();
	const [addOpen, setAddOpen] = useState(false);
	const [catalog, setCatalog] = useState<CompendiumVehicle[]>([]);

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
		toast({ title: "Vehicle removed" });
	};

	const adjustHp = (row: CharacterVehicleRow, delta: number, maxHp: number) => {
		const next = Math.min(maxHp, Math.max(0, row.current_hp + delta));
		if (next === row.current_hp) return;
		updateHp.mutate({ characterId, vehicleLinkId: row.id, currentHp: next });
	};

	return (
		<AscendantWindow title="VEHICLES & MOUNTS">
			<div className="space-y-3">
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
													className="text-[10px] uppercase"
												>
													{catalogEntry.vehicle_type}
												</Badge>
												<Badge variant="outline" className="text-[10px]">
													{catalogEntry.size}
												</Badge>
												{catalogEntry.rank && (
													<Badge variant="secondary" className="text-[10px]">
														Rank {catalogEntry.rank}
													</Badge>
												)}
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
