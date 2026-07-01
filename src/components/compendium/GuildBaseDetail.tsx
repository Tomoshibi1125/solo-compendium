import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { GUILD_FACILITIES } from "@/data/compendium/guild-base-mods";
import { formatRaCurrencyAmount, type RaCurrencyId } from "@/lib/currency";
import {
	type GuildBenefitSource,
	type GuildCapability,
	type GuildFacilityTier,
	summarizeGuildBenefits,
} from "@/lib/guildBase";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { FeatureEffect } from "@/types/featureEffects";

/** Facility id → display name, for listing a base's bundled wings. */
const facilityDisplayName = (id: string): string =>
	GUILD_FACILITIES.find((f) => f.id === id)?.name ?? id;

/**
 * Detail view for the Guild Base compendium category — facilities (with their
 * upgrade tiers) and guild-wide skills. RA-specific content; mirrors the
 * Vehicle/Crafting detail patterns. Materials live in the Crafting category.
 *
 * Benefits are the HONEST grounded model: a real capability (member cap / Forge
 * recipes), real 5e effects applied to member sheets, or narrative prose.
 */
export interface GuildBaseData {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string | null;
	tags?: string[] | null;
	source_book?: string | null;
	guild_base_type?: "base" | "facility" | "skill" | null;
	tiers?: GuildFacilityTier[] | null;
	cost?: { currency: RaCurrencyId; amount: number } | null;
	// Skill/base-level grounded benefits (facilities carry these per-tier). Named
	// `guild_effects` to match the compendium entry (avoids the generic `effects`).
	capability?: GuildCapability | null;
	guild_effects?: FeatureEffect[] | null;
	benefit?: string | null;
	// Base-property support: the facility tiers a base installs when acquired.
	included_facilities?: Record<string, number> | null;
	is_lot?: boolean | null;
}

const BenefitList = ({ source }: { source: GuildBenefitSource }) => {
	const labels = summarizeGuildBenefits(source);
	if (labels.length === 0) return null;
	return (
		<div className="flex flex-wrap gap-2">
			{labels.map((label) => (
				<Badge key={label} variant="outline" className="text-xs">
					{label}
				</Badge>
			))}
		</div>
	);
};

export function GuildBaseDetail({ data }: { data: GuildBaseData }) {
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const isFacility = data.guild_base_type === "facility";
	const isBase = data.guild_base_type === "base";
	const tiers = data.tiers ?? [];
	const cost = data.cost;
	const includedFacilities = Object.entries(data.included_facilities ?? {});
	const skillBenefits: GuildBenefitSource = {
		capability: data.capability ?? undefined,
		effects: data.guild_effects ?? undefined,
		benefit: data.benefit ?? undefined,
	};
	const skillLabels = summarizeGuildBenefits(skillBenefits);
	const typeLabel = isBase
		? data.is_lot
			? "Buildable Lot"
			: "Guild Base"
		: isFacility
			? "Facility"
			: "Guild Skill";

	return (
		<div className="space-y-6">
			<AscendantWindow title={displayName.toUpperCase()}>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">{typeLabel}</Badge>
						{cost && (
							<Badge variant="outline">
								{formatRaCurrencyAmount(cost.amount, cost.currency)}
							</Badge>
						)}
						{data.source_book && (
							<Badge variant="outline">
								{formatRegentVernacular(data.source_book)}
							</Badge>
						)}
					</div>
					{data.description && (
						<p className="text-muted-foreground leading-relaxed">
							<AutoLinkText text={formatRegentVernacular(data.description)} />
						</p>
					)}
					{Array.isArray(data.tags) && data.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{[...new Set(data.tags)].map((tag) => (
								<Badge key={tag} variant="outline" className="text-[11px]">
									{formatRegentVernacular(tag)}
								</Badge>
							))}
						</div>
					)}
				</div>
			</AscendantWindow>

			{isFacility && tiers.length > 0 && (
				<AscendantWindow title="FACILITY TIERS">
					<div className="space-y-3">
						{tiers.map((tier) => (
							<div
								key={tier.tier}
								className="space-y-2 rounded-lg border border-border/50 bg-background/20 p-3"
							>
								<div className="flex flex-wrap items-center gap-2">
									<Badge variant="secondary">Tier {tier.tier}</Badge>
									<span className="font-semibold">{tier.name}</span>
									<Badge variant="outline" className="ml-auto">
										{formatRaCurrencyAmount(
											tier.cost.amount,
											tier.cost.currency,
										)}
									</Badge>
								</div>
								<p className="text-sm leading-relaxed text-muted-foreground">
									<AutoLinkText text={tier.description} />
								</p>
								<BenefitList source={tier} />
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{isBase && (
				<AscendantWindow title="INCLUDED FACILITIES">
					{includedFacilities.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{includedFacilities.map(([id, tier]) => (
								<Badge key={id} variant="outline" className="text-xs">
									{facilityDisplayName(id)} · Tier {tier}
								</Badge>
							))}
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							No wings pre-built — a blank parcel. The guild raises every
							facility itself from the full slate.
						</p>
					)}
					<p className="mt-2 text-[11px] text-muted-foreground">
						Acquiring the base installs these tiers into the guild hall; every
						wing can still be upgraded further.
					</p>
				</AscendantWindow>
			)}

			{!isFacility && skillLabels.length > 0 && (
				<AscendantWindow title={isBase ? "BASE PERK" : "GUILD BENEFITS"}>
					<BenefitList source={skillBenefits} />
					{data.guild_effects && data.guild_effects.length > 0 && (
						<p className="mt-2 text-[11px] text-muted-foreground">
							Effects apply to every member's character sheet while they fly the
							guild's banner.
						</p>
					)}
				</AscendantWindow>
			)}
		</div>
	);
}
