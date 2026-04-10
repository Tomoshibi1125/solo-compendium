import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnomalyDetail } from "@/components/compendium/AnomalyDetail";
import {
	type ArtifactData,
	ArtifactDetail,
} from "@/components/compendium/ArtifactDetail";
import { BackgroundDetail } from "@/components/compendium/BackgroundDetail";
import { Breadcrumbs } from "@/components/compendium/Breadcrumbs";
import { ConditionDetail } from "@/components/compendium/ConditionDetail";
import { DeityDetail } from "@/components/compendium/DeityDetail";
import { DetailLayout } from "@/components/compendium/DetailLayout";
import { EquipmentDetail } from "@/components/compendium/EquipmentDetail";
import { FeatDetail } from "@/components/compendium/FeatDetail";
import { type ItemData, ItemDetail } from "@/components/compendium/ItemDetail";
import { JobDetail } from "@/components/compendium/JobDetail";
import { LocationDetail } from "@/components/compendium/LocationDetail";
import { PathDetail } from "@/components/compendium/PathDetail";
import { PowerDetail } from "@/components/compendium/PowerDetail";
import { QuickReference } from "@/components/compendium/QuickReference";
import { RegentDetail } from "@/components/compendium/RegentDetail";
import { RelatedContent } from "@/components/compendium/RelatedContent";
import { RelicDetail } from "@/components/compendium/RelicDetail";
import { RuneDetail } from "@/components/compendium/RuneDetail";
import { ShadowSoldierDetail } from "@/components/compendium/ShadowSoldierDetail";
import { SigilDetail } from "@/components/compendium/SigilDetail";
import { SkillDetail } from "@/components/compendium/SkillDetail";
import { SovereignDetail } from "@/components/compendium/SovereignDetail";
import { SpellDetail } from "@/components/compendium/SpellDetail";
import { TableOfContents } from "@/components/compendium/TableOfContents";
import { TattooDetail } from "@/components/compendium/TattooDetail";
import { TechniqueDetail } from "@/components/compendium/TechniqueDetail";
import { Layout } from "@/components/layout/Layout";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/useFavorites";
import type { CompendiumEntry } from "@/hooks/useStartupData";
import {
	type CompendiumEntity,
	type EntryType,
	entryTypes,
	isValidEntryType,
	listStaticEntries,
	resolveRef,
} from "@/lib/compendiumResolver";
import { error as logError } from "@/lib/logger";
import { formatRegentVernacular, REGENT_LABEL_PLURAL } from "@/lib/vernacular";
import type {
	CompendiumAnomaly,
	CompendiumBackground,
	CompendiumCondition,
	CompendiumDeity,
	CompendiumFeat,
	CompendiumItem,
	CompendiumJob,
	CompendiumLocation,
	CompendiumPath,
	CompendiumPower,
	CompendiumRegent,
	CompendiumRelic,
	CompendiumRune,
	CompendiumShadowSoldier,
	CompendiumSigil,
	CompendiumSkill,
	CompendiumSovereign,
	CompendiumSpell,
	CompendiumTattoo,
	CompendiumTechnique,
} from "@/types/compendium";

// Unused type helpers removed for standardization. Using raw compendium types directly.

const CompendiumDetail = () => {
	const { type, id } = useParams<{ type: EntryType; id: string }>();
	const navigate = useNavigate();
	const [, setSearchParams] = useSearchParams();
	const [entry, setEntry] = useState<CompendiumEntity | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { favorites, toggleFavorite } = useFavorites();
	const { toast } = useToast();

	const entryTagsKey = useMemo(() => {
		if (!entry || !entry.tags) return "";
		return entry.tags
			.map((tag) => tag.toLowerCase())
			.sort()
			.join("|");
	}, [entry]);

	// Fetch related content
	const { data: relatedEntries = [] } = useQuery({
		queryKey: ["related-content", type, id, entryTagsKey],
		queryFn: async () => {
			if (!type || !id || !entry) return [];

			const entryTags = Array.isArray(entry.tags)
				? (entry.tags as string[])
				: [];
			if (entryTags.length === 0) return [];

			const related: Array<{
				id: string;
				name: string;
				type: string;
				description?: string;
			}> = [];
			const normalizedTags = entryTags.map((tag) => tag.toLowerCase());
			const candidateTypes = entryTypes.filter(
				(entryType) => entryType !== type,
			);

			for (const entryType of candidateTypes) {
				if (related.length >= 6) break;

				const staticEntries = await listStaticEntries(entryType);
				if (!staticEntries) continue;

				const matches = staticEntries
					.filter((item) => {
						const tags = item.tags || [];
						if (!Array.isArray(tags) || tags.length === 0) return false;
						return tags.some((tag) =>
							normalizedTags.includes(tag.toLowerCase()),
						);
					})
					.filter((item) => !(entryType === type && item.id === id))
					.slice(0, 3);

				related.push(
					...matches.map((item) => ({
						id: item.id,
						name: formatRegentVernacular(item.display_name),
						type: entryType,
						description: formatRegentVernacular(item.description),
					})),
				);
			}

			return related.slice(0, 6);
		},
		enabled: !!type && !!id && !!entry && entryTagsKey.length > 0,
	});

	useEffect(() => {
		const fetchEntry = async () => {
			if (!type || !id) return;

			setLoading(true);
			setError(null);

			if (!isValidEntryType(type)) {
				setError("Invalid entry type");
				setLoading(false);
				return;
			}

			try {
				const entity = await resolveRef(type, id);

				if (!entity) {
					setError("Entry not found");
				} else {
					setEntry(entity);
				}
			} catch (err) {
				logError("Failed to load entry:", err);
				setError("Failed to load entry");
			} finally {
				setLoading(false);
			}
		};

		if (type && id) {
			fetchEntry();
		}
	}, [type, id]);

	const tocItems = useMemo(() => {
		if (!entry || !type) return [];

		const entryNameRaw =
			(entry as { display_name?: string | null; name: string }).display_name ||
			(entry as { name: string }).name ||
			"";
		const entryName = formatRegentVernacular(entryNameRaw);
		const items: Array<{ id: string; title: string; level: number }> = [
			{ id: "entry-header", title: entryName, level: 1 },
		];

		if (type === "anomalies") {
			items.push(
				{ id: "Anomaly-stats", title: "Core Stats", level: 2 },
				{ id: "Anomaly-abilities", title: "Ability Scores", level: 2 },
				{ id: "Anomaly-traits", title: "Traits", level: 2 },
				{ id: "Anomaly-actions", title: "Actions", level: 2 },
				{ id: "Anomaly-description", title: "Description", level: 2 },
			);
		} else if (type === "jobs") {
			items.push(
				{ id: "job-proficiencies", title: "Proficiencies", level: 2 },
				{ id: "job-paths", title: "Paths", level: 2 },
				{ id: "job-features", title: "Class Features", level: 2 },
			);
		} else if (type === "powers") {
			items.push(
				{ id: "power-properties", title: "Casting Properties", level: 2 },
				{ id: "power-description", title: "Description", level: 2 },
			);
		} else if (type === "runes") {
			items.push(
				{ id: "rune-requirements", title: "Requirements", level: 2 },
				{ id: "rune-effect", title: "Effect", level: 2 },
				{ id: "rune-inscription", title: "Inscription", level: 2 },
			);
		} else if (type === "sigils") {
			items.push(
				{ id: "sigil-effect", title: "Effect", level: 2 },
				{ id: "sigil-bonuses", title: "Passive Bonuses", level: 2 },
				{ id: "sigil-inscription", title: "Inscription", level: 2 },
			);
		} else if (type === "shadow-soldiers") {
			items.push(
				{ id: "soldier-description", title: "Overview", level: 2 },
				{ id: "soldier-role", title: "Combat Role", level: 2 },
				{ id: "soldier-tags", title: "Tags", level: 2 },
			);
		} else if (type === "spells") {
			items.push(
				{ id: "spell-stats", title: "Spell Stats", level: 2 },
				{ id: "spell-effect", title: "Effect", level: 2 },
				{ id: "spell-description", title: "Description", level: 2 },
			);
		} else if (type === "techniques") {
			items.push(
				{ id: "technique-activation", title: "Activation", level: 2 },
				{ id: "technique-effects", title: "Effects", level: 2 },
				{ id: "technique-mechanics", title: "Mechanics", level: 2 },
				{ id: "technique-description", title: "Description", level: 2 },
			);
		} else if (type === "artifacts") {
			items.push(
				{ id: "artifact-properties", title: "Properties", level: 2 },
				{ id: "artifact-abilities", title: "Abilities", level: 2 },
				{ id: "artifact-lore", title: "Lore", level: 2 },
				{ id: "artifact-mechanics", title: "Mechanics", level: 2 },
			);
		} else if (type === "items") {
			items.push(
				{ id: "item-properties", title: "Properties", level: 2 },
				{ id: "item-effects", title: "Effects", level: 2 },
				{ id: "item-description", title: "Description", level: 2 },
			);
		} else if (type === "locations") {
			items.push(
				{ id: "location-details", title: "Details", level: 2 },
				{ id: "location-encounters", title: "Encounters", level: 2 },
				{ id: "location-treasures", title: "Treasures", level: 2 },
			);
		} else if (type === "sovereigns") {
			items.push(
				{ id: "sovereign-overview", title: "Overview", level: 2 },
				{ id: "sovereign-fusion", title: "Fusion Components", level: 2 },
				{ id: "sovereign-features", title: "Abilities", level: 2 },
			);
		} else if (type === "tattoos") {
			items.push(
				{ id: "tattoo-effects", title: "Circuit Effects", level: 2 },
				{ id: "tattoo-description", title: "System Recognition", level: 2 },
			);
		}

		return items;
	}, [entry, type]);

	const detailNode = useMemo(() => {
		if (!entry || !type) return null;

		switch (type) {
			case "jobs": {
				const e = entry as CompendiumJob;
				return <JobDetail data={e} />;
			}
			case "paths": {
				const e = entry as CompendiumPath;
				return <PathDetail data={e} />;
			}
			case "powers": {
				const e = entry as unknown as CompendiumPower;
				return <PowerDetail data={e} />;
			}
			case "runes": {
				const e = entry as CompendiumRune;
				return <RuneDetail data={e} />;
			}
			case "anomalies": {
				const e = entry as CompendiumAnomaly;
				return <AnomalyDetail data={e} />;
			}
			case "backgrounds": {
				const e = entry as CompendiumBackground;
				return <BackgroundDetail data={e} />;
			}
			case "conditions": {
				const e = entry as CompendiumCondition;
				return <ConditionDetail data={e} />;
			}
			case "regents": {
				const e = entry as CompendiumRegent;
				return <RegentDetail data={e} />;
			}
			case "feats": {
				const e = entry as CompendiumFeat;
				return <FeatDetail data={e} />;
			}
			case "skills": {
				const e = entry as CompendiumSkill;
				return <SkillDetail data={e} />;
			}
			case "items": {
				const e = entry as unknown as ItemData;
				return <ItemDetail data={e} />;
			}
			case "spells": {
				const e = entry as CompendiumSpell;
				return <SpellDetail data={e} />;
			}
			case "techniques": {
				const e = entry as CompendiumTechnique;
				return <TechniqueDetail data={e} />;
			}
			case "locations": {
				const e = entry as CompendiumLocation;
				return <LocationDetail data={e} />;
			}
			case "relics": {
				const e = entry as CompendiumRelic;
				return <RelicDetail data={e} />;
			}
			case "sigils": {
				const e = entry as CompendiumSigil;
				return <SigilDetail data={e} />;
			}
			case "tattoos": {
				const e = entry as CompendiumTattoo;
				return <TattooDetail data={e} />;
			}
			case "equipment": {
				const e = entry as CompendiumItem;
				return <EquipmentDetail data={e} />;
			}
			case "shadow-soldiers": {
				const e = entry as CompendiumShadowSoldier;
				return <ShadowSoldierDetail data={e} />;
			}
			case "artifacts": {
				// ArtifactDetail defines its own ArtifactData locally,
				// but it expects the data prop to match its interface.
				const e = entry as unknown as ArtifactData;
				return <ArtifactDetail data={e} />;
			}
			case "sovereigns": {
				const e = entry as CompendiumSovereign;
				return <SovereignDetail data={e} />;
			}
			case "deities": {
				const e = entry as CompendiumDeity;
				return <DeityDetail data={e} />;
			}
			default:
				return (
					<AscendantWindow title="NOT IMPLEMENTED" variant="alert">
						<AscendantText className="block text-sm text-muted-foreground">
							Detail view for {type} is not yet implemented.
						</AscendantText>
					</AscendantWindow>
				);
		}
	}, [entry, type]);

	if (!entry || !type) {
		if (loading) {
			return (
				<Layout>
					<div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
						<div className="flex items-center justify-center py-12">
							<Loader2 className="w-8 h-8 animate-spin text-primary" />
						</div>
					</div>
				</Layout>
			);
		}

		if (error) {
			return (
				<Layout>
					<div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
						<AscendantWindow title="ERROR" className="max-w-lg mx-auto">
							<p className="text-destructive">{error}</p>
							<Button
								onClick={() => {
									const nextParams = new URLSearchParams(
										window.location.search,
									);
									nextParams.delete("type");
									nextParams.delete("id");
									setSearchParams(nextParams);
									navigate("/compendium");
								}}
								className="mt-4"
							>
								Return to Compendium
							</Button>
						</AscendantWindow>
					</div>
				</Layout>
			);
		}

		return null;
	}

	const entryData = entry;

	const isFavorite = favorites.has(`${type}:${id || ""}`);
	const entryDisplayNameRaw =
		(entryData as { display_name?: string | null; name: string })
			.display_name || (entryData as { name: string }).name;
	const entryDisplayName = formatRegentVernacular(entryDisplayNameRaw);

	const handleToggleFavorite = () => {
		if (!id) return;
		const wasFavorite = isFavorite;
		toggleFavorite(type, id);
		toast({
			title: wasFavorite ? "Removed from favorites" : "Added to favorites",
			description: `${entryDisplayName} has been ${wasFavorite ? "removed from" : "added to"} your favorites`,
		});
	};

	const handleShare = () => {
		const url = window.location.href;
		navigator.clipboard
			.writeText(url)
			.then(() => {
				toast({
					title: "Link copied",
					description: "Shareable link copied to clipboard.",
				});
			})
			.catch((err) => {
				logError("Failed to copy to clipboard:", err);
				toast({
					title: "Failed to copy",
					description: "Could not copy link to clipboard.",
					variant: "destructive",
				});
			});
	};

	const handleExport = () => {
		const dataStr = formatRegentVernacular(JSON.stringify(entry, null, 2));
		const dataBlob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${entryDisplayName}-${type}-${id}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast({
			title: "Export complete",
			description: `${entryDisplayName} exported successfully.`,
		});
	};

	const categoryLabels: Record<string, string> = {
		jobs: "Jobs",
		paths: "Paths",
		powers: "Powers",
		runes: "Runestones",
		sigils: "Sigils",
		relics: "Relics",
		Anomalies: "Anomalies",
		backgrounds: "Backgrounds",
		conditions: "Conditions",
		regents: REGENT_LABEL_PLURAL,
		feats: "Feats",
		skills: "Skills",
		equipment: "Equipment",
		items: "Items",
		spells: "Spells",
		techniques: "Techniques",
		artifacts: "Artifacts",
		locations: "Locations",
		sovereigns: "Sovereigns",
		"shadow-soldiers": "Umbral Legion",
		tattoos: "Magical Tattoos",
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<div className="mb-4">
					<Button
						variant="ghost"
						onClick={() => navigate("/compendium")}
						aria-label="Back to Compendium"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Compendium
					</Button>
				</div>
				{/* Breadcrumbs */}
				<Breadcrumbs
					items={[
						{ label: "Compendium", href: "/compendium" },
						{
							label: formatRegentVernacular(categoryLabels[type] || type),
							href: `/compendium?category=${type}`,
						},
						{ label: entryDisplayName },
					]}
				/>

				<span id="entry-header" className="scroll-mt-4" />

				<DetailLayout
					main={detailNode}
					sidebar={
						<>
							<QuickReference
								entry={{
									id: id || "",
									name: (entryData as { name: string }).name,
									type: (entryData as { type: string })
										.type as CompendiumEntry["type"],
									description:
										(entryData as { description?: string | null })
											.description ?? null,
									isFavorite: isFavorite,
								}}
								isFavorite={isFavorite}
								onToggleFavorite={handleToggleFavorite}
								onShare={handleShare}
								onExport={handleExport}
							/>
							{tocItems.length > 2 && <TableOfContents items={tocItems} />}
							{relatedEntries.length > 0 && (
								<RelatedContent
									title="Related Content"
									entries={relatedEntries}
								/>
							)}
						</>
					}
				/>
			</div>
		</Layout>
	);
};

export default CompendiumDetail;
