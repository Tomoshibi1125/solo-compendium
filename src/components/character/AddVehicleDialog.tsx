/**
 * AddVehicleDialog — pick a vehicle/mount from the canonical RA catalog
 * and add it to a character's roster (Q7 of Round 3).
 */
import { Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDialogSwipeClose } from "@/hooks/useDialogSwipeClose";
import { useAddCharacterVehicle } from "@/hooks/useVehicles";
import { formatRaCurrencyValue } from "@/lib/currency";
import type { CompendiumVehicle } from "@/types/compendium";
import { AddDialogDetailPanel } from "./AddDialogDetailPanel";

interface AddVehicleDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
	catalog: CompendiumVehicle[];
}

export function AddVehicleDialog({
	open,
	onOpenChange,
	characterId,
	catalog,
}: AddVehicleDialogProps) {
	const addVehicle = useAddCharacterVehicle();
	const [filter, setFilter] = useState<"all" | "mount" | "vehicle">("all");
	const [selectedId, setSelectedId] = useState<string>("");
	const [nickname, setNickname] = useState("");
	const bindSwipeClose = useDialogSwipeClose(() => onOpenChange(false));

	const visible = useMemo(() => {
		if (filter === "mount")
			return catalog.filter((v) => v.vehicle_type === "mount");
		if (filter === "vehicle")
			return catalog.filter((v) => v.vehicle_type !== "mount");
		return catalog;
	}, [catalog, filter]);

	const selected = visible.find((v) => v.id === selectedId);

	const handleAdd = async () => {
		if (!selected) return;
		await addVehicle.mutateAsync({
			characterId,
			vehicleId: selected.id,
			nickname: nickname.trim() || undefined,
			initialHp: selected.hit_points.max,
		});
		setSelectedId("");
		setNickname("");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-w-2xl touch-pan-y"
				data-testid="add-vehicle-dialog"
				{...bindSwipeClose()}
			>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Truck className="w-5 h-5 text-primary" />
						Add Vehicle or Mount
					</DialogTitle>
					<DialogDescription>
						Pick from the {catalog.length}-entry RA catalog. Mounts and vehicles
						share the same data model; choose the entry that fits your campaign.
					</DialogDescription>
				</DialogHeader>

				<div className="flex items-center gap-2 mb-2">
					<Label className="text-xs">Filter:</Label>
					<Select
						value={filter}
						onValueChange={(v) => setFilter(v as typeof filter)}
					>
						<SelectTrigger className="w-32 h-8">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="mount">Mounts</SelectItem>
							<SelectItem value="vehicle">Vehicles</SelectItem>
						</SelectContent>
					</Select>
					<span className="text-xs text-muted-foreground ml-auto">
						{visible.length} entries
					</span>
				</div>

				<ScrollArea className="h-[40vh] border border-border/30 rounded">
					<div className="space-y-1 p-2">
						{visible.map((v) => (
							<div
								key={v.id}
								className={`rounded border transition-colors ${
									selectedId === v.id
										? "border-primary bg-primary/15 ring-2 ring-primary/60"
										: "border-transparent hover:border-border/50 hover:bg-black/20"
								}`}
							>
								<button
									type="button"
									onClick={() => setSelectedId(v.id)}
									className="w-full text-left p-2"
									data-testid={`vehicle-catalog-${v.id}`}
								>
									<div className="flex items-center gap-2">
										<span className="font-display text-sm">{v.name}</span>
										<span className="text-[11px] uppercase text-muted-foreground">
											{v.vehicle_type}
										</span>
										<span className="text-[11px] text-muted-foreground">
											{v.size}
										</span>
										{v.price != null && (
											<Badge
												variant="outline"
												className="text-[11px] text-gate-s border-gate-s/40"
											>
												{formatRaCurrencyValue(v.price)}
											</Badge>
										)}
										<Badge variant="outline" className="text-[11px]">
											{v.vrp_cost ?? 0} VRP
										</Badge>
										<Badge variant="outline" className="text-[11px]">
											{v.mod_capacity ?? 0} cap
										</Badge>
										{v.rank && (
											<span className="text-[11px] text-resurge-violet">
												Rank {v.rank}
											</span>
										)}
									</div>
									<p className="text-xs text-muted-foreground mt-1 leading-relaxed">
										{v.description}
									</p>
								</button>
								<div className="px-2 pb-2">
									<AddDialogDetailPanel
										stats={[
											{ label: "Type", value: v.vehicle_type },
											{ label: "Size", value: v.size },
											{ label: "Rank", value: v.rank },
											{ label: "AC", value: v.armor_class },
											{ label: "HP", value: v.hit_points?.max },
											{
												label: "Land Speed",
												value: v.speed?.land ? `${v.speed.land} ft` : null,
											},
											{
												label: "Air Speed",
												value: v.speed?.air ? `${v.speed.air} ft` : null,
											},
											{
												label: "Water Speed",
												value: v.speed?.water ? `${v.speed.water} ft` : null,
											},
											{
												label: "Rift Speed",
												value: v.speed?.rift ? `${v.speed.rift} ft` : null,
											},
											{
												label: "Carry Capacity",
												value: v.carry_capacity_lbs
													? `${v.carry_capacity_lbs} lb.`
													: null,
											},
											{
												label: "Cargo Capacity",
												value: v.cargo_capacity_lbs
													? `${v.cargo_capacity_lbs} lb.`
													: null,
											},
											{ label: "VRP Cost", value: v.vrp_cost },
											{ label: "Mod Capacity", value: v.mod_capacity },
											{
												label: "Requisition",
												value: v.requisition_notes,
											},
										]}
										properties={(v.abilities ?? []).map(
											(ability) => ability.name,
										)}
										tags={(v as { tags?: string[] | null }).tags}
										lore={v.lore ?? null}
										discoveryLore={v.discovery_lore}
										sourceBook={v.source_book}
									/>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>

				{selected && (
					<div className="space-y-2 pt-2">
						<div className="flex flex-wrap items-center gap-2 text-xs">
							{selected.price != null && (
								<Badge variant="secondary" className="text-gate-s">
									{formatRaCurrencyValue(selected.price)}
								</Badge>
							)}
							<Badge variant="secondary">{selected.vrp_cost ?? 0} VRP</Badge>
							<Badge variant="outline">
								{selected.mod_capacity ?? 0} mod capacity
							</Badge>
							{selected.requisition_notes && (
								<span className="text-muted-foreground">
									{selected.requisition_notes}
								</span>
							)}
						</div>
						<Label htmlFor="vehicle-nickname">Nickname (optional)</Label>
						<Input
							id="vehicle-nickname"
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							placeholder={selected.name}
							data-testid="vehicle-nickname-input"
						/>
					</div>
				)}

				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleAdd}
						disabled={!selected || addVehicle.isPending}
						data-testid="vehicle-add-confirm"
					>
						Add to character
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
