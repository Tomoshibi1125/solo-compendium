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
import type { CompendiumVehicle } from "@/types/compendium";

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
							<button
								key={v.id}
								type="button"
								onClick={() => setSelectedId(v.id)}
								className={`w-full text-left p-2 rounded border transition-colors ${
									selectedId === v.id
										? "border-primary bg-primary/10"
										: "border-transparent hover:border-border/50 hover:bg-black/20"
								}`}
								data-testid={`vehicle-catalog-${v.id}`}
							>
								<div className="flex items-center gap-2">
									<span className="font-display text-sm">{v.name}</span>
									<span className="text-[10px] uppercase text-muted-foreground">
										{v.vehicle_type}
									</span>
									<span className="text-[10px] text-muted-foreground">
										{v.size}
									</span>
									<Badge variant="outline" className="text-[10px]">
										{v.vrp_cost ?? 0} VRP
									</Badge>
									<Badge variant="outline" className="text-[10px]">
										{v.mod_capacity ?? 0} cap
									</Badge>
									{v.rank && (
										<span className="text-[10px] text-fuchsia-300">
											Rank {v.rank}
										</span>
									)}
								</div>
								<p className="text-xs text-muted-foreground mt-1 line-clamp-1">
									{v.description}
								</p>
							</button>
						))}
					</div>
				</ScrollArea>

				{selected && (
					<div className="space-y-2 pt-2">
						<div className="flex flex-wrap items-center gap-2 text-xs">
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
