import { Coins, Shield, Sword, Weight } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { formatRegentVernacular } from "@/lib/vernacular";

import type { CompendiumItem } from "@/types/compendium";

interface EquipmentData extends Partial<CompendiumItem> {
	// Local structure matches legacy data if needed
}

const typeLabels: Record<string, string> = {
	simple_melee: "Simple Melee Weapon",
	simple_ranged: "Simple Ranged Weapon",
	martial_melee: "Martial Melee Weapon",
	martial_ranged: "Martial Ranged Weapon",
	light_armor: "Light Mana-Weave Armor",
	medium_armor: "Medium Aether Armor",
	heavy_armor: "Heavy Carapace Armor",
	shield: "Shield",
	gear: "Adventuring Gear",
	tools: "Tools",
	ascendant_gear: "Ascendant Gear",
};

export const EquipmentDetail = ({ data }: { data: EquipmentData }) => {
	const item = data;
	const isWeapon =
		(item.item_type || "").includes("melee") ||
		(item.item_type || "").includes("ranged");
	const isArmor =
		(item.item_type || "").includes("armor") || item.item_type === "shield";
	const displayName = formatRegentVernacular(item.display_name || item.name);

	return (
		<div className="space-y-6">
			{/* Item Illustration */}
			{item.image_url && (
				<div className="w-full flex justify-center">
					<CompendiumImage
						src={item.image_url}
						alt={displayName}
						size="large"
						aspectRatio="square"
						className="max-w-md"
						fallbackIcon={<Sword className="w-32 h-32 text-muted-foreground" />}
					/>
				</div>
			)}

			{/* Header */}
			<AscendantWindow title={displayName.toUpperCase()}>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">
							{formatRegentVernacular(
								(item.item_type && typeLabels[item.item_type]) ||
									item.item_type ||
									"Equipment",
							)}
						</Badge>
						{item.source_book && (
							<Badge variant="outline">
								{formatRegentVernacular(item.source_book)}
							</Badge>
						)}
					</div>
					{item.description && (
						<p className="text-muted-foreground leading-relaxed text-base">
							<AutoLinkText text={item.description} />
						</p>
					)}
				</div>
			</AscendantWindow>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<AscendantWindow title="COST" compact>
					<div className="flex items-center gap-2">
						<Coins className="w-5 h-5 text-yellow-400" />
						<span className="font-display text-xl">
							{item.cost?.toLocaleString() || "—"}
						</span>
					</div>
					<span className="text-xs text-muted-foreground">credits</span>
				</AscendantWindow>

				<AscendantWindow title="WEIGHT" compact>
					<div className="flex items-center gap-2">
						<Weight className="w-5 h-5 text-muted-foreground" />
						<span className="font-display text-xl">{item.weight || "—"}</span>
					</div>
					<span className="text-xs text-muted-foreground">lbs</span>
				</AscendantWindow>

				{isWeapon && (
					<AscendantWindow title="DAMAGE" compact>
						<div className="flex items-center gap-2">
							<Sword className="w-5 h-5 text-red-400" />
							<span className="font-display text-xl">{item.damage || "—"}</span>
						</div>
						{item.damage_type && (
							<span className="text-xs text-muted-foreground">
								{formatRegentVernacular(item.damage_type)}
							</span>
						)}
					</AscendantWindow>
				)}

				{isArmor && (
					<AscendantWindow title="ARMOR CLASS" compact>
						<div className="flex items-center gap-2">
							<Shield className="w-5 h-5 text-blue-400" />
							<span className="font-display text-xl">
								{item.armor_class ? `+${item.armor_class}` : "—"}
							</span>
						</div>
					</AscendantWindow>
				)}
			</div>

			{/* Properties */}
			{item.properties &&
				(Array.isArray(item.properties)
					? item.properties.length > 0
					: Object.keys(item.properties).length > 0) && (
					<AscendantWindow title="PROPERTIES">
						<div className="flex flex-wrap gap-2">
							{Array.isArray(item.properties)
								? item.properties.map((prop: string) => (
										<Badge key={prop} variant="outline" className="capitalize">
											{formatRegentVernacular(prop)}
										</Badge>
									))
								: Object.entries(item.properties || {}).map(([key, value]) => (
										<Badge
											key={key}
											variant="outline"
											className="capitalize flex items-center gap-1"
										>
											{formatRegentVernacular(key)}
											<span className="opacity-70 text-[10px]">
												({String(value)})
											</span>
										</Badge>
									))}
						</div>
					</AscendantWindow>
				)}
		</div>
	);
};
