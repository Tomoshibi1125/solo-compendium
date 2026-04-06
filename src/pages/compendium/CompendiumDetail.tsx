import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnomalyDetail } from "@/components/compendium/AnomalyDetail";
import { ArtifactDetail } from "@/components/compendium/ArtifactDetail";
import { BackgroundDetail } from "@/components/compendium/BackgroundDetail";
import { Breadcrumbs } from "@/components/compendium/Breadcrumbs";
import { ConditionDetail } from "@/components/compendium/ConditionDetail";
import { DeityDetail } from "@/components/compendium/DeityDetail";
import { DetailLayout } from "@/components/compendium/DetailLayout";
import { EquipmentDetail } from "@/components/compendium/EquipmentDetail";
import { FeatDetail } from "@/components/compendium/FeatDetail";
import { ItemDetail } from "@/components/compendium/ItemDetail";
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
	CompendiumSkill,
	CompendiumSovereign,
	CompendiumSpell,
	CompendiumTattoo,
	CompendiumTechnique,
} from "@/types/compendium";

type JobDetailData = Parameters<typeof JobDetail>[0]["data"];
type PathDetailData = Parameters<typeof PathDetail>[0]["data"];
type PowerDetailData = Parameters<typeof PowerDetail>[0]["data"];
type RuneDetailData = Parameters<typeof RuneDetail>[0]["data"];
type RelicDetailData = Parameters<typeof RelicDetail>[0]["data"];
type AnomalyDetailData = Parameters<typeof AnomalyDetail>[0]["data"];
type BackgroundDetailData = Parameters<typeof BackgroundDetail>[0]["data"];
type ConditionDetailData = Parameters<typeof ConditionDetail>[0]["data"];
type RegentDetailData = Parameters<typeof RegentDetail>[0]["data"];
type FeatDetailData = Parameters<typeof FeatDetail>[0]["data"];
type SigilDetailData = Parameters<typeof SigilDetail>[0]["data"];
type SkillDetailData = Parameters<typeof SkillDetail>[0]["data"];
type EquipmentDetailData = Parameters<typeof EquipmentDetail>[0]["data"];
type ShadowSoldierDetailData = Parameters<
	typeof ShadowSoldierDetail
>[0]["data"];
type ItemDetailData = Parameters<typeof ItemDetail>[0]["data"];
type SpellDetailData = Parameters<typeof SpellDetail>[0]["data"];
type TechniqueDetailData = Parameters<typeof TechniqueDetail>[0]["data"];
type ArtifactDetailData = Parameters<typeof ArtifactDetail>[0]["data"];
type LocationDetailData = Parameters<typeof LocationDetail>[0]["data"];
type SovereignData = Parameters<typeof SovereignDetail>[0]["data"];
type TattooDetailData = Parameters<typeof TattooDetail>[0]["data"];

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
		if (!entry?.tags || !Array.isArray(entry.tags)) return "";
		return (entry.tags as string[])
			.map((tag) => String(tag).toLowerCase())
			.sort()
			.join("|");
	}, [entry?.tags]);

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
						name: formatRegentVernacular(item.display_name || item.name),
						type: entryType,
						description: item.description
							? formatRegentVernacular(item.description)
							: undefined,
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
				const data: JobDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					hit_die:
						typeof e.hit_dice === "number"
							? e.hit_dice
							: Number.parseInt(
									(e.hit_dice || e.hitDie || "10")
										.toString()
										.replace(/\D/g, ""),
									10,
								),
					primary_abilities:
						e.primary_abilities ||
						(typeof e.primaryAbility === "string"
							? [e.primaryAbility]
							: e.primaryAbility || []),
					saving_throw_proficiencies: e.saving_throws || e.savingThrows || [],
					skill_choice_count: 2,
					flavor: typeof e.flavor === "string" ? e.flavor : undefined,
					lore: typeof e.lore === "string" ? e.lore : undefined,
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					image_url: e.image_url ?? e.image ?? undefined,
					armor_proficiencies:
						e.armor_proficiencies ?? e.armorProficiencies ?? [],
					weapon_proficiencies:
						e.weapon_proficiencies ?? e.weaponProficiencies ?? [],
					tool_proficiencies: e.tool_proficiencies ?? e.toolProficiencies ?? [],
				};
				return <JobDetail data={data} />;
			}
			case "paths": {
				const e = entry as CompendiumPath;
				const data: PathDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					image_url: e.image_url ?? e.image ?? undefined,
					flavor: typeof e.flavor === "string" ? e.flavor : undefined,
					lore: typeof e.lore === "string" ? e.lore : undefined,
					job_id: e.job_id ?? undefined,
					tier: e.level ?? undefined,
				};
				return <PathDetail data={data} />;
			}
			case "powers": {
				const e = entry as CompendiumPower;
				const data: PowerDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					power_level: e.power_level ?? 0,
					casting_time: e.casting_time ?? "1 action",
					range: e.range ?? "60 ft",
					duration: e.duration ?? "Instantaneous",
					description: e.description ?? "",
					concentration: !!e.concentration,
					ritual: !!e.ritual,
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					flavor: typeof e.flavor === "string" ? e.flavor : undefined,
					lore: typeof e.lore === "string" ? e.lore : undefined,
					source_book: e.source_book ?? undefined,
					school: e.school ?? undefined,
				};
				return <PowerDetail data={data} />;
			}
			case "runes": {
				const e = entry as CompendiumRune;
				const data: RuneDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? null,
					description: e.description ?? "",
					activation_action: e.activation_action ?? null,
					activation_cost: e.activation_cost ?? null,
					activation_cost_amount: e.activation_cost_amount ?? null,
					aliases: [],
					can_inscribe_on: e.can_inscribe_on ?? [],
					caster_penalty: e.caster_penalty ?? null,
					martial_penalty: e.martial_penalty ?? null,
					uses_per_rest: e.uses_per_rest ?? null,
					rarity: (e.rarity as "common") || "common",
					rune_type: (e.rune_type as "martial") || "martial",
					rune_level: e.rune_level ?? 1,
					effect_description: e.effect_description ?? "",
					rune_category: e.rune_category ?? "General",
					effect_type: (e.effect_type as "active") || "active",
					created_at: "",
					generated_reason: null,
					license_note: null,
					caster_requirement_multiplier: 1,
					source_book: e.source_book ?? null,
					martial_requirement_multiplier: 1,
					requirement_agi: 0,
					requirement_int: 0,
					requirement_pre: 0,
					requirement_sense: 0,
					requirement_str: 0,
					requirement_vit: 0,
					source_kind: "Core",
					source_name: "Rift Ascendant",
					theme_tags: [],
					updated_at: "",
					concentration: e.concentration ?? null,
					discovery_lore: e.discovery_lore ?? null,
					duration: e.duration ?? null,
					flavor: typeof e.flavor === "string" ? e.flavor : null,
					higher_levels: e.higher_levels ?? null,
					image: e.image ?? null,
					image_url: e.image_url ?? null,
					inscription_difficulty: e.inscription_difficulty ?? null,
					lore: typeof e.lore === "string" ? e.lore : null,
					passive_bonuses: null,
					range: e.range ?? null,
					recharge: e.recharge ?? null,
					requires_job: e.requires_job ?? null,
					requires_level: e.requires_level ?? null,
					mechanics: (e.mechanics as RuneDetailData["mechanics"]) ?? null, // Overcoming local Json vs Record impedance for zero-legacy compliance
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : [],
				};
				return <RuneDetail data={data} />;
			}
			case "anomalies": {
				const e = entry as CompendiumAnomaly;
				const abilityScores = e.ability_scores ||
					e.stats?.ability_scores || {
						strength: 10,
						agility: 10,
						vitality: 10,
						intelligence: 10,
						sense: 10,
						presence: 10,
					};
				const data: AnomalyDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					armor_class: e.armor_class ?? e.ac ?? 10,
					hit_points_average: e.hp ?? e.hit_points ?? 10,
					hit_points_formula: "",
					size: e.size ?? "Medium",
					alignment: e.alignment ?? "Neutral",
					cr: e.cr ?? e.challenge_rating?.toString() ?? "1",
					speed_walk: typeof e.speed === "number" ? e.speed : 30,
					str: abilityScores.strength,
					agi: abilityScores.agility,
					vit: abilityScores.vitality,
					int: abilityScores.intelligence,
					sense: abilityScores.sense,
					pre: abilityScores.presence,
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					image_url: e.image_url ?? e.image ?? undefined,
					gate_rank: e.gate_rank ?? e.rank ?? "E",
				};
				return <AnomalyDetail data={data} />;
			}
			case "backgrounds": {
				const e = entry as CompendiumBackground;
				const data: BackgroundDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					skill_proficiencies: e.skill_proficiencies ?? e.skills ?? [],
					tool_proficiencies: e.tool_proficiencies ?? [],
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					source_book: e.source_book ?? undefined,
					starting_equipment: e.equipment ? e.equipment.join(", ") : undefined,
				};
				return <BackgroundDetail data={data} />;
			}
			case "conditions": {
				const e = entry as CompendiumCondition;
				const data: ConditionDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					effects: e.effects ?? [],
				};
				return <ConditionDetail data={data} />;
			}
			case "regents": {
				const e = entry as CompendiumRegent;
				const data: RegentDetailData = {
					id: e.id,
					name: e.name,
					title: e.display_name ?? e.title ?? undefined,
					description: e.description ?? "",
					image: e.image_url ?? e.image ?? undefined,
					source_book: e.source_book ?? undefined,
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					rank: ["D", "C", "B", "A", "S"].includes(e.rank || e.rarity || "")
						? ((e.rank || e.rarity) as "D" | "C" | "B" | "A" | "S")
						: "D", // Defaulting to D instead of E for Regent types to match the union
					flavor: typeof e.flavor === "string" ? e.flavor : undefined,
					lore: typeof e.lore === "string" ? e.lore : undefined,
					hit_dice: e.hit_dice ?? undefined,
					primary_ability: e.primary_ability ?? [],
					saving_throws: e.saving_throws ?? [],
					skill_proficiencies: e.skill_proficiencies ?? [],
					armor_proficiencies: e.armor_proficiencies ?? [],
					weapon_proficiencies: e.weapon_proficiencies ?? [],
					tool_proficiencies: e.tool_proficiencies ?? [],
					class_features: (e.class_features || []).map((f) => {
						const typeVal =
							f.type &&
							[
								"passive",
								"active",
								"action",
								"bonus-action",
								"reaction",
							].includes(f.type)
								? f.type
								: "passive";
						const freqVal =
							f.frequency &&
							[
								"at-will",
								"short-rest",
								"long-rest",
								"once-per-day",
								"once-per-long-rest",
							].includes(f.frequency)
								? f.frequency
								: "at-will";
						return {
							level: f.level,
							name: f.name,
							description: f.description,
							type: typeVal as
								| "passive"
								| "active"
								| "action"
								| "bonus-action"
								| "reaction",
							frequency: freqVal as
								| "at-will"
								| "short-rest"
								| "long-rest"
								| "once-per-day"
								| "once-per-long-rest",
						};
					}),
					spellcasting: e.spellcasting ?? undefined,
					progression_table: e.progression_table ?? undefined,
					regent_requirements: e.regent_requirements
						? {
								level: e.regent_requirements.level ?? 0,
								abilities: e.regent_requirements.abilities ?? {},
								quest_completion: e.regent_requirements.quest_completion ?? "",
								warden_approval: e.regent_requirements.warden_approval ?? false,
							}
						: undefined,
					requirements: e.requirements
						? {
								quest_completion: e.requirements.quest_completion,
								warden_verification: e.requirements.warden_verification,
								power_level: e.requirements.level ?? 1,
							}
						: undefined,
					features: e.features ?? [],
				};
				return <RegentDetail data={data} />;
			}
			case "feats": {
				const e = entry as CompendiumFeat;
				const data: FeatDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					prerequisites:
						typeof e.prerequisites === "string" ? e.prerequisites : undefined,
					benefits: Array.isArray(e.benefits) ? e.benefits : [],
					flavor: typeof e.flavor === "string" ? e.flavor : undefined,
					lore: typeof e.lore === "string" ? e.lore : undefined,
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					source_book: e.source_book ?? undefined,
				};
				return <FeatDetail data={data} />;
			}
			case "skills": {
				const e = entry as CompendiumSkill;
				const data: SkillDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					ability: e.ability ?? "STR",
					description: e.description ?? "",
				};
				return <SkillDetail data={data} />;
			}
			case "items": {
				const e = entry as CompendiumItem;
				const data: ItemDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					item_type: e.item_type ?? e.type ?? "Adventuring Gear",
					weight: typeof e.weight === "number" ? e.weight : 0,
					flavor: typeof e.flavor === "string" ? e.flavor : undefined,
					lore: typeof e.lore === "string" ? e.lore : undefined,
					rarity: e.rarity ?? "Common",
					source_book: e.source_book ?? undefined,
					attunement: e.attunement ?? false,
					properties: null,
				};
				return <ItemDetail data={data} />;
			}
			case "spells": {
				const e = entry as CompendiumSpell;
				const data: SpellDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					rank:
						e.rank ??
						(e.level ? ["D", "C", "B", "A", "S"][Math.min(e.level, 4)] : "D"),
					spell_type: e.school ?? "Abjuration",
					activation:
						typeof e.activation === "string"
							? { type: e.activation }
							: (e.activation as SpellDetailData["activation"]),
					range:
						typeof e.range === "string"
							? {
									type: "distance",
									distance:
										Number.parseInt(e.range.replace(/\D/g, ""), 10) || 0,
								}
							: (e.range as SpellDetailData["range"]),
					duration:
						typeof e.duration === "string"
							? { type: "instantaneous", time: e.duration }
							: (e.duration as SpellDetailData["duration"]),
					description: e.description ?? "",
					flavor: typeof e.flavor === "string" ? e.flavor : undefined,
					lore: typeof e.lore === "string" ? e.lore : undefined,
				};
				return <SpellDetail data={data} />;
			}
			case "techniques": {
				const e = entry as CompendiumTechnique;
				const data: TechniqueDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					activation: null,
					range: null,
					duration: null,
					flavor: typeof e.flavor === "string" ? e.flavor : undefined,
					lore: typeof e.lore === "string" ? e.lore : undefined,
				};
				return <TechniqueDetail data={data} />;
			}
			case "locations": {
				const e = entry as CompendiumLocation;
				const data: LocationDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					encounters: e.encounters ?? [],
					treasures: e.treasures ?? [],
					rank: e.rank ?? "F",
					source_book: e.source_book ?? undefined,
				};
				return <LocationDetail data={data} />;
			}
			case "relics": {
				const e = entry as CompendiumRelic;
				const data: RelicDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					rarity: e.rarity ?? "Common",
					description: e.description ?? "",
					lore: null,
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					attunement: e.attunement ?? false,
					source_book: e.source_book ?? undefined,
					abilities: null,
					properties: null,
				};
				return <RelicDetail data={data} />;
			}
			case "sigils": {
				const e = entry as CompendiumRune & {
					flavor?: string;
					lore?: string;
					image_url?: string;
				};
				const data: SigilDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					image: e.image_url ?? e.image ?? undefined,
					source_book: e.source_book ?? undefined,
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					rarity: typeof e.rarity === "string" ? e.rarity : "Common",
					flavor: typeof e.flavor === "string" ? e.flavor : undefined,
					lore: typeof e.lore === "string" ? e.lore : undefined,
					effect_description: e.effect_description ?? "",
					rune_type: e.rune_type ?? "utility",
					rune_category: e.rune_category ?? "general",
					rune_level: e.rune_level ?? 1,
					effect_type: e.effect_type ?? "passive",
					requires_level:
						typeof e.requires_level === "number" ? e.requires_level : undefined,
					passive_bonuses:
						typeof e.passive_bonuses === "object"
							? e.passive_bonuses
							: undefined,
					can_inscribe_on: Array.isArray(e.can_inscribe_on)
						? (e.can_inscribe_on as string[])
						: undefined,
					inscription_difficulty:
						typeof e.inscription_difficulty === "number"
							? e.inscription_difficulty
							: undefined,
				};
				return <SigilDetail data={data} />;
			}
			case "tattoos": {
				const e = entry as CompendiumTattoo;
				const data: TattooDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					rarity: e.rarity ?? "Common",
					attunement: e.attunement ?? false,
					body_part: e.body_part ?? "Universal",
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					source_book: e.source_book ?? undefined,
				};
				return <TattooDetail data={data} />;
			}
			case "equipment": {
				const e = entry as CompendiumItem;
				const data: EquipmentDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					equipment_type: e.item_type ?? e.type ?? "gear",
					weight: typeof e.weight === "number" ? e.weight : 0,
					properties: Array.isArray(e.properties)
						? (e.properties as string[])
						: undefined,
					armor_class:
						typeof e.armor_class === "number"
							? e.armor_class
							: typeof e.armor_class === "string"
								? Number.parseInt(e.armor_class, 10)
								: undefined,
					source_book: e.source_book ?? undefined,
				};
				return <EquipmentDetail data={data} />;
			}
			case "shadow-soldiers": {
				const e = entry as CompendiumAnomaly;
				const data: ShadowSoldierDetailData = {
					id: e.id,
					name: e.name,
					description: e.description ?? "",
					role: e.rank ?? "Combatant",
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					gate_rank: e.gate_rank ?? e.rank ?? "F",
					source_book: e.source_book ?? undefined,
				};
				return <ShadowSoldierDetail data={data} />;
			}
			case "artifacts": {
				const e = entry as CompendiumItem;
				const data: ArtifactDetailData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					rarity: e.rarity ?? "Artifact",
					source_book: e.source_book ?? undefined,
				};
				return <ArtifactDetail data={data} />;
			}
			case "sovereigns": {
				const e = entry as CompendiumSovereign;
				const data: SovereignData = {
					id: e.id,
					name: e.name,
					display_name: e.display_name ?? undefined,
					description: e.description ?? "",
					tags: Array.isArray(e.tags) ? (e.tags as string[]) : undefined,
					source_book: e.source_book ?? undefined,
					job_id: e.job_id ?? undefined,
					path_id: e.path_id ?? undefined,
					regent_a_id: e.regent_a_id ?? undefined,
					regent_b_id: e.regent_b_id ?? undefined,
					fusion_theme: e.fusion_theme ?? undefined,
					fusion_description: e.fusion_description ?? undefined,
					prerequisites: e.prerequisites ?? undefined,
					is_template: e.is_template ?? false,
					is_ai_generated: e.is_ai_generated ?? false,
				};
				return <SovereignDetail data={data} />;
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
									display_name: entryDisplayName,
									name: (entryData as { name: string }).name,
									type: (entryData as { type: string }).type,
									source_book:
										(entryData as { source_book?: string | null })
											.source_book || undefined,
									tags: Array.isArray(
										(entryData as { tags?: string[] | null }).tags,
									)
										? ((entryData as { tags?: string[] | null })
												.tags as string[])
										: undefined,
									rarity:
										(entryData as { rarity?: string | null }).rarity ||
										undefined,
									gate_rank:
										(entryData as { gate_rank?: string | null }).gate_rank ||
										undefined,
									level:
										(entryData as { level?: number | null }).level || undefined,
									cr: (entryData as { cr?: string | null }).cr || undefined,
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
