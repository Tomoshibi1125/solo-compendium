import {
	Anchor,
	Heart,
	MapPin,
	Shield,
	Sparkles,
	Users,
	Wind,
} from "lucide-react";
import type { DragEvent } from "react";
import { Link } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumVehicle } from "@/types/compendium";

export interface VehicleData extends CompendiumVehicle {}

const vehicleTypeLabels: Record<string, string> = {
	mount: "Mount",
	land: "Land Vehicle",
	air: "Air Vehicle",
	water: "Water Vehicle",
	rift: "Rift Vehicle",
};

const sizeLabels: Record<string, string> = {
	tiny: "Tiny",
	small: "Small",
	medium: "Medium",
	large: "Large",
	huge: "Huge",
	gargantuan: "Gargantuan",
};

const humanizeActionToken = (token: string): string =>
	token.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const VehicleDetail = ({ data }: { data: VehicleData }) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const imageSrc = data.image_url || data.image || undefined;
	const isMount = data.vehicle_type === "mount";

	const speed = data.speed;
	const armorClass = data.armor_class;
	const hitPoints = data.hit_points;
	const crewPositions = data.crew_positions || [];
	const abilities = data.abilities || [];
	const carryCapacity = data.carry_capacity_lbs;
	const cargoCapacity = data.cargo_capacity_lbs;
	const bonded = data.bonded;
	const anomalyId = data.anomaly_id;
	const bondedFromName = data.bonded_from_name;

	const formatSpeed = (speedValue: number | undefined): string => {
		if (!speedValue) return "—";
		return `${speedValue} ft`;
	};

	const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
		const dragData = {
			type: "vehicle",
			id: data.id,
			name: displayName,
			vehicle_type: data.vehicle_type,
			size: data.size,
			speed: speed,
			armor_class: armorClass,
			hit_points: hitPoints,
		};
		e.dataTransfer.setData("application/json", JSON.stringify(dragData));
		e.dataTransfer.effectAllowed = "copy";
	};

	return (
		<button
			type="button"
			className="space-y-6 text-left w-full bg-transparent border-0 p-0 cursor-grab active:cursor-grabbing"
			draggable
			onDragStart={handleDragStart}
		>
			{/* Vehicle Illustration */}
			{imageSrc && (
				<div className="w-full flex justify-center">
					<CompendiumImage
						src={imageSrc}
						alt={displayName}
						size="large"
						aspectRatio="square"
						className="max-w-md"
						fallbackIcon={
							<Anchor className="w-32 h-32 text-muted-foreground" />
						}
					/>
				</div>
			)}

			{/* Header */}
			<AscendantWindow title={displayName.toUpperCase()}>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">
							{formatRegentVernacular(
								vehicleTypeLabels[data.vehicle_type] || data.vehicle_type,
							)}
						</Badge>
						<Badge variant="outline">
							{formatRegentVernacular(sizeLabels[data.size] || data.size)}
						</Badge>
						{(data as { rank?: string | null }).rank && (
							<Badge variant="outline">
								Rank {(data as { rank?: string | null }).rank}
							</Badge>
						)}
						{data.source_book && (
							<Badge variant="outline">
								{formatRegentVernacular(data.source_book)}
							</Badge>
						)}
						{isMount && bonded && (
							<Badge
								variant="secondary"
								className="bg-purple-500/10 text-purple-400"
							>
								Bonded
							</Badge>
						)}
					</div>
					{Array.isArray((data as { tags?: string[] | null }).tags) &&
						(data as { tags: string[] }).tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{[...new Set((data as { tags: string[] }).tags ?? [])].map(
									(t) => (
										<Badge key={t} variant="outline" className="text-[10px]">
											{formatRegentVernacular(t)}
										</Badge>
									),
								)}
							</div>
						)}
					{data.description && (
						<p className="text-muted-foreground leading-relaxed text-base">
							<AutoLinkText text={data.description} />
						</p>
					)}
					{isMount && bonded && anomalyId && (
						<p className="text-sm">
							<span className="text-muted-foreground">Bonded From: </span>
							<Link
								to={`/compendium/anomalies/${anomalyId}`}
								className="text-primary hover:underline"
							>
								{bondedFromName
									? formatRegentVernacular(bondedFromName)
									: "View source anomaly"}
							</Link>
						</p>
					)}
				</div>
			</AscendantWindow>

			{/* Core Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<AscendantWindow title="ARMOR CLASS" compact>
					<div className="flex items-center gap-2">
						<Shield className="w-5 h-5 text-primary" />
						<span className="font-display text-xl">{armorClass}</span>
					</div>
					<span className="text-xs text-muted-foreground">AC</span>
				</AscendantWindow>

				<AscendantWindow title="HIT POINTS" compact>
					<div className="flex items-center gap-2">
						<Heart className="w-5 h-5 text-rose-500" />
						<span className="font-display text-xl">{hitPoints.max}</span>
					</div>
					<span className="text-xs text-muted-foreground">Max HP</span>
				</AscendantWindow>

				{isMount && carryCapacity && (
					<AscendantWindow title="CARRY CAPACITY" compact>
						<div className="flex items-center gap-2">
							<Users className="w-5 h-5 text-blue-400" />
							<span className="font-display text-xl">{carryCapacity}</span>
						</div>
						<span className="text-xs text-muted-foreground">lbs</span>
					</AscendantWindow>
				)}

				{!isMount && cargoCapacity && (
					<AscendantWindow title="CARGO CAPACITY" compact>
						<div className="flex items-center gap-2">
							<Anchor className="w-5 h-5 text-blue-400" />
							<span className="font-display text-xl">{cargoCapacity}</span>
						</div>
						<span className="text-xs text-muted-foreground">lbs</span>
					</AscendantWindow>
				)}

				<AscendantWindow title="VRP" compact>
					<div className="flex items-center gap-2">
						<Sparkles className="w-5 h-5 text-primary" />
						<span className="font-display text-xl">{data.vrp_cost ?? 0}</span>
					</div>
					<span className="text-xs text-muted-foreground">Cost</span>
				</AscendantWindow>

				<AscendantWindow title="MOD CAPACITY" compact>
					<div className="flex items-center gap-2">
						<Shield className="w-5 h-5 text-primary" />
						<span className="font-display text-xl">
							{data.mod_capacity ?? 0}
						</span>
					</div>
					<span className="text-xs text-muted-foreground">Capacity</span>
				</AscendantWindow>
			</div>

			{/* Speed */}
			<AscendantWindow title="SPEED">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{speed.land && (
						<div className="flex items-center gap-2">
							<MapPin className="w-4 h-4 text-green-400" />
							<span className="text-sm">Land: {formatSpeed(speed.land)}</span>
						</div>
					)}
					{speed.air && (
						<div className="flex items-center gap-2">
							<Wind className="w-4 h-4 text-sky-400" />
							<span className="text-sm">Air: {formatSpeed(speed.air)}</span>
						</div>
					)}
					{speed.water && (
						<div className="flex items-center gap-2">
							<Anchor className="w-4 h-4 text-blue-400" />
							<span className="text-sm">Water: {formatSpeed(speed.water)}</span>
						</div>
					)}
					{speed.rift && (
						<div className="flex items-center gap-2">
							<Sparkles className="w-4 h-4 text-purple-400" />
							<span className="text-sm">Rift: {formatSpeed(speed.rift)}</span>
						</div>
					)}
				</div>
			</AscendantWindow>

			{/* Crew Positions */}
			{crewPositions.length > 0 && (
				<AscendantWindow title="CREW POSITIONS">
					<div className="space-y-3">
						{crewPositions.map((seat) => (
							<div
								key={seat.id}
								className="flex items-start gap-3 p-3 rounded-lg bg-background/20 border border-border/50"
							>
								<Users className="w-5 h-5 text-primary/70 flex-shrink-0 mt-0.5" />
								<div className="flex-1">
									<div className="font-semibold text-sm">{seat.name}</div>
									{seat.required_proficiency && (
										<div className="text-xs text-muted-foreground mt-1">
											Requires: {seat.required_proficiency}
										</div>
									)}
									{seat.grants_actions && seat.grants_actions.length > 0 && (
										<div className="text-xs text-muted-foreground mt-1">
											Grants:{" "}
											{seat.grants_actions.map(humanizeActionToken).join(", ")}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Abilities */}
			{abilities.length > 0 && (
				<AscendantWindow title="ABILITIES">
					<div className="space-y-3">
						{abilities.map((ability) => (
							<div
								key={`${ability.name}-${ability.action_type}`}
								className="p-3 rounded-lg bg-background/20 border border-border/50"
							>
								<div className="flex items-center gap-2 mb-2">
									<Badge variant="outline" className="text-xs">
										{ability.action_type}
									</Badge>
									<span className="font-semibold">{ability.name}</span>
								</div>
								<p className="text-sm text-muted-foreground leading-relaxed">
									<AutoLinkText text={ability.description} />
								</p>
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{/* Lore */}
			{(data.lore || data.discovery_lore) && (
				<AscendantWindow title="LORE & PROVENANCE" className="bg-background/20">
					<div className="space-y-4">
						{data.lore && (
							<div className="flex items-start gap-3">
								<Sparkles className="w-5 h-5 text-primary/70 flex-shrink-0 mt-1" />
								<p className="text-sm text-muted-foreground leading-relaxed">
									<AutoLinkText
										text={
											typeof data.lore === "string"
												? data.lore
												: Object.values(data.lore)
														.filter((v): v is string => typeof v === "string")
														.join(" ")
										}
									/>
								</p>
							</div>
						)}
						{data.discovery_lore && (
							<div className="flex items-start gap-3">
								<Sparkles className="w-5 h-5 text-primary/70 flex-shrink-0 mt-1" />
								<p className="text-sm text-muted-foreground/80 italic leading-relaxed">
									<AutoLinkText
										text={formatRegentVernacular(data.discovery_lore)}
									/>
								</p>
							</div>
						)}
					</div>
				</AscendantWindow>
			)}
		</button>
	);
};
