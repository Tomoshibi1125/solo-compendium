import { Coins, Shield, Sword, Weight } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { formatRaCurrencyAmount } from "@/lib/currency";
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
	const item = data as EquipmentData & {
		value?: number;
		cost_credits?: number;
		simple_properties?: string[];
	};
	const itemTypeLower = (item.item_type || "").toLowerCase();
	const isArmor = itemTypeLower.includes("armor") || itemTypeLower === "shield";
	// The provider surfaces a broad item_type ("weapon"/"armor"/"shield"); a
	// weapon is anything with a weapon_type/damage or a weapon-ish type token.
	const isWeapon =
		!isArmor &&
		(itemTypeLower.includes("weapon") ||
			itemTypeLower.includes("melee") ||
			itemTypeLower.includes("ranged") ||
			!!item.weapon_type ||
			!!item.damage);
	const displayName = formatRegentVernacular(item.display_name || item.name);
	// Cost lives in `value`/`cost_credits` on the provider entry (legacy `cost`
	// kept as a fallback).
	const costValue = item.cost ?? item.value ?? item.cost_credits;
	// 5e property tags (finesse/light/heavy/…) live in `simple_properties`; the
	// `properties` object holds nested weapon/armor rule blocks (not for badges).
	const propertyTags: string[] = Array.isArray(item.simple_properties)
		? item.simple_properties
		: Array.isArray(item.properties)
			? (item.properties as string[])
			: [];
	const categoryLabel = item.weapon_type
		? `${formatRegentVernacular(item.weapon_type)} Weapon`
		: item.armor_type
			? `${formatRegentVernacular(item.armor_type)} Armor`
			: formatRegentVernacular(
					(item.item_type && typeLabels[item.item_type]) ||
						item.item_type ||
						"Equipment",
				);
	const rangeText =
		typeof item.range === "string" && item.range.trim().length > 0
			? item.range
			: null;

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
						<Badge variant="secondary">{categoryLabel}</Badge>
						{item.rarity && (
							<Badge variant="outline" className="capitalize">
								{formatRegentVernacular(String(item.rarity))}
							</Badge>
						)}
						{item.attunement && <Badge variant="outline">Attunement</Badge>}
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
							{formatRaCurrencyAmount(costValue)}
						</span>
					</div>
					<span className="text-xs text-muted-foreground">Bureau value</span>
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

				{isWeapon && rangeText && (
					<AscendantWindow title="RANGE" compact>
						<div className="flex items-center gap-2">
							<Sword className="w-5 h-5 text-orange-400" />
							<span className="font-display text-sm">{rangeText}</span>
						</div>
					</AscendantWindow>
				)}

				{isArmor && (
					<AscendantWindow title="ARMOR CLASS" compact>
						<div className="flex items-center gap-2">
							<Shield className="w-5 h-5 text-blue-400" />
							<span className="font-display text-xl">
								{item.armor_class ?? "—"}
							</span>
						</div>
					</AscendantWindow>
				)}

				{isArmor && item.strength_requirement && (
					<AscendantWindow title="STRENGTH" compact>
						<div className="flex items-center gap-2">
							<Shield className="w-5 h-5 text-muted-foreground" />
							<span className="font-display text-xl">
								Str {item.strength_requirement}
							</span>
						</div>
					</AscendantWindow>
				)}

				{isArmor && item.stealth_disadvantage && (
					<AscendantWindow title="STEALTH" compact>
						<div className="flex items-center gap-2">
							<Shield className="w-5 h-5 text-red-400" />
							<span className="font-display text-sm">Disadvantage</span>
						</div>
					</AscendantWindow>
				)}
			</div>

			{/* Properties (5e weapon/armor property tags) */}
			{propertyTags.length > 0 && (
				<AscendantWindow title="PROPERTIES">
					<div className="flex flex-wrap gap-2">
						{propertyTags.map((prop) => (
							<Badge key={prop} variant="outline" className="capitalize">
								{formatRegentVernacular(prop)}
							</Badge>
						))}
					</div>
				</AscendantWindow>
			)}
		</div>
	);
};
