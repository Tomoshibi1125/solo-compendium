/**
 * CampaignVehiclesPanel — the campaign's shared vehicle fleet. Wardens add
 * vehicles from the catalog and track HP; players see the fleet read-only.
 * Wires the previously-orphaned `campaign_vehicles` table.
 */
import { Car, Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type CampaignVehicleRow,
	campaignVehicleCatalog,
	campaignVehicleMaxHp,
	useAddCampaignVehicle,
	useCampaignVehicles,
	useDeleteCampaignVehicle,
	useUpdateCampaignVehicleHP,
} from "@/hooks/useCampaignVehicles";

interface Props {
	campaignId: string;
	isWarden: boolean;
}

export function CampaignVehiclesPanel({ campaignId, isWarden }: Props) {
	const { data: vehicles = [], isLoading } = useCampaignVehicles(campaignId);
	const addVehicle = useAddCampaignVehicle();
	const updateHp = useUpdateCampaignVehicleHP();
	const removeVehicle = useDeleteCampaignVehicle();

	const [pickId, setPickId] = useState("");
	const [nickname, setNickname] = useState("");

	const catalog = useMemo(
		() =>
			[...campaignVehicleCatalog].sort((a, b) => a.name.localeCompare(b.name)),
		[],
	);

	const handleAdd = () => {
		if (!pickId) return;
		addVehicle.mutate(
			{ campaignId, vehicleId: pickId, nickname },
			{
				onSuccess: () => {
					setPickId("");
					setNickname("");
				},
			},
		);
	};

	return (
		<div className="space-y-4">
			{isWarden && (
				<Card className="p-4 border-primary/20 bg-black/40">
					<h3 className="font-heading text-sm uppercase tracking-widest text-primary mb-3">
						Add Vehicle to Fleet
					</h3>
					<div className="flex flex-col sm:flex-row gap-2">
						<Select value={pickId} onValueChange={setPickId}>
							<SelectTrigger className="sm:flex-1">
								<SelectValue placeholder="Choose a vehicle…" />
							</SelectTrigger>
							<SelectContent>
								{catalog.map((v) => (
									<SelectItem key={v.id} value={v.id}>
										{v.name} · {v.vehicle_type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Input
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							placeholder="Nickname (optional)"
							className="sm:w-48"
						/>
						<Button
							onClick={handleAdd}
							disabled={!pickId || addVehicle.isPending}
							className="gap-1"
						>
							<Plus className="w-4 h-4" /> Add
						</Button>
					</div>
				</Card>
			)}

			{isLoading ? (
				<div className="text-sm text-muted-foreground">Loading fleet…</div>
			) : vehicles.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
					<Car className="w-8 h-8 mb-2 opacity-50" />
					<p className="text-sm">
						No vehicles in the campaign fleet yet.
						{isWarden ? " Add one above." : ""}
					</p>
				</div>
			) : (
				<div className="grid gap-3 sm:grid-cols-2">
					{vehicles.map((row) => (
						<VehicleCard
							key={row.id}
							row={row}
							campaignId={campaignId}
							isWarden={isWarden}
							onHp={(currentHp) =>
								updateHp.mutate({ campaignId, id: row.id, currentHp })
							}
							onRemove={() => removeVehicle.mutate({ campaignId, id: row.id })}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function VehicleCard({
	row,
	isWarden,
	onHp,
	onRemove,
}: {
	row: CampaignVehicleRow;
	campaignId: string;
	isWarden: boolean;
	onHp: (currentHp: number) => void;
	onRemove: () => void;
}) {
	const maxHp = campaignVehicleMaxHp(row);
	const pct = maxHp > 0 ? Math.round((row.current_hp / maxHp) * 100) : 0;
	const title = row.nickname || row.vehicle?.name || "Unknown Vehicle";

	return (
		<Card className="p-4 border-border bg-black/40">
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0">
					<div className="font-heading text-base truncate">{title}</div>
					{row.vehicle && (
						<div className="text-xs text-muted-foreground truncate">
							{row.vehicle.name} · AC {row.vehicle.armor_class}
						</div>
					)}
				</div>
				{row.vehicle?.vehicle_type && (
					<Badge variant="outline" className="shrink-0 uppercase text-[10px]">
						{row.vehicle.vehicle_type}
					</Badge>
				)}
			</div>

			<div className="mt-3">
				<div className="flex items-center justify-between text-xs mb-1">
					<span className="text-muted-foreground">Hull</span>
					<span className="font-mono">
						{row.current_hp} / {maxHp}
					</span>
				</div>
				<Progress value={pct} className="h-2" />
			</div>

			{isWarden && (
				<div className="mt-3 flex items-center gap-1">
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7"
						aria-label="Reduce hull by 5"
						onClick={() => onHp(row.current_hp - 5)}
					>
						<Minus className="w-3 h-3" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7"
						aria-label="Repair hull by 5"
						onClick={() => onHp(Math.min(maxHp, row.current_hp + 5))}
					>
						<Plus className="w-3 h-3" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7 ml-auto text-destructive"
						aria-label="Remove vehicle from fleet"
						onClick={onRemove}
					>
						<Trash2 className="w-3 h-3" />
					</Button>
				</div>
			)}
		</Card>
	);
}
