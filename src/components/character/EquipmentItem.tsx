import { Trash2 } from "lucide-react";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

type Equipment = Database["public"]["Tables"]["character_equipment"]["Row"];

function isEquipableInventoryType(itemType: string | null | undefined): boolean {
	return (
		itemType === "weapon" ||
		itemType === "armor" ||
		itemType === "tool" ||
		itemType === "gear"
	);
}

interface EquipmentItemProps {
	item: Equipment;
	onToggleEquipped: (item: Equipment) => void;
	onToggleAttuned: (item: Equipment) => void;
	onRemove: (item: Equipment) => void;
	canAttune: boolean;
	nestedItems?: Equipment[];
	containers?: Equipment[];
	onChangeContainer?: (item: Equipment, containerId: string | null) => void;
	onToggleActive?: (item: Equipment) => void;
	sigilControl?: React.ReactNode;
}

function EquipmentItemComponent({
	item,
	onToggleEquipped,
	onToggleAttuned,
	onRemove,
	canAttune,
	nestedItems,
	containers,
	onChangeContainer,
	onToggleActive,
	sigilControl,
}: EquipmentItemProps) {
	const displayName = formatRegentVernacular(item.name);
	const displayDescription = item.description
		? formatRegentVernacular(item.description)
		: null;
	const displayRarity = item.rarity
		? formatRegentVernacular(item.rarity)
		: null;
	const canEquip = isEquipableInventoryType(item.item_type);

	return (
		<div
			className={cn(
				"p-3 rounded-lg border bg-muted/30",
				item.is_equipped && "border-primary/50 bg-primary/5",
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-1">
						<span className="font-heading font-semibold">{displayName}</span>
						{displayRarity && (
							<Badge variant="secondary" className="text-xs">
								{displayRarity}
							</Badge>
						)}
						{item.is_equipped && (
							<Badge variant="default" className="text-xs">
								Equipped
							</Badge>
						)}
						{item.is_attuned && (
							<Badge variant="destructive" className="text-xs">
								Attuned
							</Badge>
						)}
					</div>
					{displayDescription && (
						<p className="text-xs text-muted-foreground line-clamp-2">
							{displayDescription}
						</p>
					)}
					{item.properties && item.properties.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-1">
							{item.properties.slice(0, 3).map((prop, _i) => (
								<Badge
									key={JSON.stringify(prop)}
									variant="outline"
									className="text-xs"
								>
									{formatRegentVernacular(prop)}
								</Badge>
							))}
						</div>
					)}
					{sigilControl}
					{containers && containers.length > 0 && (
						<div className="mt-2 w-[140px]">
							<Select
								value={item.container_id || "none"}
								onValueChange={(val) =>
									onChangeContainer?.(item, val === "none" ? null : val)
								}
							>
								<SelectTrigger className="h-6 text-[10px] px-2 border-border/50">
									<SelectValue placeholder="Move to container..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none" className="text-xs">
										No container
									</SelectItem>
									{containers.map((c) => (
										<SelectItem key={c.id} value={c.id} className="text-xs">
											{formatRegentVernacular(c.name)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
					{nestedItems && nestedItems.length > 0 && (
						<div className="mt-3 pl-3 sm:pl-4 border-l-2 border-border/50 flex flex-col gap-2">
							<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
								Contents
							</span>
							{nestedItems.map((nestedItem) => (
								<EquipmentItem
									key={nestedItem.id}
									item={nestedItem}
									onToggleEquipped={onToggleEquipped}
									onToggleAttuned={onToggleAttuned}
									onRemove={onRemove}
									canAttune={canAttune}
									onChangeContainer={onChangeContainer}
									onToggleActive={onToggleActive}
									containers={containers?.filter((c) => c.id !== nestedItem.id)}
								/>
							))}
						</div>
					)}
				</div>
				<div className="flex items-center gap-2">
					<div className="flex flex-col gap-1">
						{canEquip && (
							<Button
								variant={item.is_equipped ? "default" : "outline"}
								size="sm"
								className={cn(
									"h-7 px-2 text-[10px]",
									item.is_equipped && "bg-primary text-primary-foreground",
								)}
								onClick={() => onToggleEquipped(item)}
							>
								{item.is_equipped ? "Equipped" : "Equip"}
							</Button>
						)}

						{item.requires_attunement && (
							<Button
								variant={item.is_attuned ? "destructive" : "outline"}
								size="sm"
								className={cn(
									"h-7 px-2 text-[10px]",
									item.is_attuned &&
										"bg-destructive text-destructive-foreground",
								)}
								onClick={() => onToggleAttuned(item)}
								disabled={!item.is_attuned && !canAttune}
							>
								{item.is_attuned ? "Attuned" : "Attune"}
							</Button>
						)}

						{item.is_container && onToggleActive && (
							<Button
								variant={item.is_active ? "secondary" : "ghost"}
								size="sm"
								className={cn(
									"h-7 px-2 text-[10px]",
									!item.is_active && "opacity-50 line-through",
								)}
								onClick={() => onToggleActive(item)}
								title="If inactive, the container and contents do not count towards encumbrance."
							>
								{item.is_active ? "Active" : "Inactive"}
							</Button>
						)}
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={() => onRemove(item)}
						aria-label={`Remove ${displayName}`}
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

export const EquipmentItem = memo(
	EquipmentItemComponent,
	(prevProps, nextProps) => {
		// Custom comparison function for better performance
		return (
			prevProps.item.id === nextProps.item.id &&
			prevProps.item.is_attuned === nextProps.item.is_attuned &&
			prevProps.item.is_active === nextProps.item.is_active &&
			prevProps.item.container_id === nextProps.item.container_id &&
			prevProps.canAttune === nextProps.canAttune &&
			prevProps.item.properties?.length === nextProps.item.properties?.length &&
			prevProps.nestedItems?.length === nextProps.nestedItems?.length &&
			prevProps.containers?.length === nextProps.containers?.length
		);
	},
);
