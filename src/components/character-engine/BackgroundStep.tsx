import type React from "react";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";
import { formatRaCurrencyAmount } from "@/lib/currency";
import { formatRegentVernacular } from "@/lib/vernacular";

interface BackgroundFeature {
	name: string;
	description?: string | null;
}

type Background =
	Database["public"]["Tables"]["compendium_backgrounds"]["Row"] & {
		display_name?: string | null;
	};

const collectStringValues = (value: unknown): string[] => {
	if (typeof value === "string") {
		return value
			.split(",")
			.map((part) => part.trim())
			.filter(Boolean);
	}
	if (Array.isArray(value)) return value.flatMap(collectStringValues);
	if (value && typeof value === "object") {
		return Object.values(value).flatMap(collectStringValues);
	}
	return [];
};

const isBackgroundFeature = (feature: unknown): feature is BackgroundFeature =>
	typeof feature === "object" &&
	feature !== null &&
	"name" in feature &&
	typeof feature.name === "string" &&
	(!("description" in feature) ||
		feature.description == null ||
		typeof feature.description === "string");

// ---------------------------------------------------------------------------
// Structured-description mechanic parser
// ---------------------------------------------------------------------------

/** Keywords that indicate structured mechanic phrases within descriptions */
const MECHANIC_KEYWORD_PATTERNS: { label: string; pattern: RegExp }[] = [
	{ label: "Advantage", pattern: /\badvantage on\b/i },
	{ label: "Proficiency", pattern: /\bproficiency\b/i },
	{
		label: "Skill Check",
		pattern:
			/\b(?:perception|stealth|survival|investigation|insight|persuasion|intimidation|athletics|acrobatics|arcana|history|nature|religion|medicine|deception|performance|sleight of hand|animal handling)\s+(?:checks?|rolls?)\b/i,
	},
	{ label: "Difficult Terrain", pattern: /\bdifficult terrain\b/i },
	{ label: "Exhaustion", pattern: /\bexhaustion\b/i },
	{
		label: "Shelter",
		pattern: /\b(?:hidden (?:place|shelter)|rest (?:where|safely))\b/i,
	},
	{ label: "Requisition", pattern: /\b(?:requisition|confiscate|access)\b/i },
	{
		label: "Knowledge",
		pattern: /\b(?:identify|deduce|know the|estimate|predict)\b/i,
	},
	{ label: "Network", pattern: /\b(?:informant|contact|network|alumni)\b/i },
];

interface StructuredMechanics {
	keywords: string[];
	proficiencies: string[];
	equipmentBundle: string[];
	downtimeHooks: string[];
}

function parseStructuredMechanics(
	description: string | null | undefined,
	mechanics: unknown,
): StructuredMechanics {
	const result: StructuredMechanics = {
		keywords: [],
		proficiencies: [],
		equipmentBundle: [],
		downtimeHooks: [],
	};

	if (description) {
		for (const { label, pattern } of MECHANIC_KEYWORD_PATTERNS) {
			if (pattern.test(description) && !result.keywords.includes(label)) {
				result.keywords.push(label);
			}
		}
	}

	// Parse structured mechanics JSON if present
	if (mechanics && typeof mechanics === "object" && !Array.isArray(mechanics)) {
		const mech = mechanics as Record<string, unknown>;

		if (mech.proficiencies) {
			result.proficiencies.push(...collectStringValues(mech.proficiencies));
		}
		if (mech.equipment_bundle || mech.equipment) {
			result.equipmentBundle.push(
				...collectStringValues(mech.equipment_bundle ?? mech.equipment),
			);
		}
		if (mech.downtime || mech.downtime_hooks) {
			result.downtimeHooks.push(
				...collectStringValues(mech.downtime ?? mech.downtime_hooks),
			);
		}
	}

	return result;
}

// ---------------------------------------------------------------------------
// UI Components
// ---------------------------------------------------------------------------

function BackgroundChipGroup({
	label,
	values,
	variant = "secondary",
	alreadyGranted,
	alreadyGrantedSource,
}: {
	label: string;
	values: string[];
	variant?: "default" | "secondary" | "outline";
	/** F8 of May 2026 remediation plan — values already granted by an
	 * earlier wizard step (e.g. Job → Background dup detection). Chips
	 * that match (case-insensitive) get a yellow border + tooltip. */
	alreadyGranted?: string[];
	alreadyGrantedSource?: string;
}) {
	if (values.length === 0) return null;

	const grantedLookup = new Set(
		(alreadyGranted ?? []).map((v) => v.trim().toLowerCase()),
	);

	return (
		<div className="space-y-1">
			<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
				{label}
			</Label>
			<div className="flex flex-wrap gap-2 mt-1">
				{values.map((value) => {
					const isDup = grantedLookup.has(value.trim().toLowerCase());
					return (
						<Badge
							key={`${label}-${value}`}
							variant={variant}
							className={
								isDup
									? "text-[10px] h-5 bg-amber-500/10 border-amber-400/60 text-amber-200"
									: "text-[10px] h-5 bg-primary/10 border-primary/20"
							}
							title={
								isDup
									? `Already granted by ${alreadyGrantedSource ?? "another step"} — will be de-duplicated on create.`
									: undefined
							}
							aria-label={
								isDup
									? `${value} — duplicate of ${alreadyGrantedSource ?? "earlier"} grant`
									: undefined
							}
							data-already-granted={isDup ? "true" : undefined}
						>
							{formatRegentVernacular(value)}
							{isDup && <span className="ml-1">⚠</span>}
						</Badge>
					);
				})}
			</div>
		</div>
	);
}

function BackgroundFeatureCard({
	feature,
	mechanics,
}: {
	feature: BackgroundFeature;
	mechanics?: StructuredMechanics | null;
}) {
	const hasStructuredMechanics =
		mechanics &&
		(mechanics.keywords.length > 0 ||
			mechanics.proficiencies.length > 0 ||
			mechanics.equipmentBundle.length > 0 ||
			mechanics.downtimeHooks.length > 0);

	return (
		<div className="p-3 bg-black/40 rounded border border-primary/10 space-y-2">
			<Label className="text-[10px] uppercase tracking-tighter text-primary/80 font-bold">
				{formatRegentVernacular(feature.name)}
			</Label>
			{feature.description && (
				<AscendantText className="text-[11px] text-muted-foreground mt-1 block">
					{formatRegentVernacular(feature.description)}
				</AscendantText>
			)}

			{/* Structured Mechanics Blocks */}
			{hasStructuredMechanics && (
				<div className="mt-2 space-y-2">
					{mechanics.keywords.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{mechanics.keywords.map((keyword) => (
								<Badge
									key={`keyword-${keyword}`}
									variant="outline"
									className="text-[9px] border-primary/20 bg-primary/5 text-primary/80"
								>
									{keyword}
								</Badge>
							))}
						</div>
					)}

					{mechanics.proficiencies.length > 0 && (
						<div className="text-[10px]">
							<span className="text-muted-foreground font-medium uppercase tracking-wider">
								Grants:{" "}
							</span>
							<span className="text-primary/80">
								{mechanics.proficiencies.map(formatRegentVernacular).join(", ")}
							</span>
						</div>
					)}

					{mechanics.equipmentBundle.length > 0 && (
						<div className="text-[10px]">
							<span className="text-muted-foreground font-medium uppercase tracking-wider">
								Equipment:{" "}
							</span>
							<span className="text-primary/80">
								{mechanics.equipmentBundle
									.map(formatRegentVernacular)
									.join(", ")}
							</span>
						</div>
					)}

					{mechanics.downtimeHooks.length > 0 && (
						<div className="text-[10px]">
							<span className="text-muted-foreground font-medium uppercase tracking-wider">
								Downtime:{" "}
							</span>
							<span className="text-primary/80">
								{mechanics.downtimeHooks.map(formatRegentVernacular).join(", ")}
							</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

interface BackgroundStepProps {
	selectedBackground: string;
	onBackgroundChange: (backgroundId: string) => void;
	allBackgrounds: (Background & { _homebrew?: boolean })[];
	/** F8 of May 2026 remediation plan — proficiencies already granted by
	 * the Job step, used to flag duplicates inline. */
	jobGrantedSkills?: string[];
	jobGrantedTools?: string[];
	jobName?: string;
}

export const BackgroundStep: React.FC<BackgroundStepProps> = ({
	selectedBackground,
	onBackgroundChange,
	allBackgrounds,
	jobGrantedSkills,
	jobGrantedTools,
	jobName,
}) => {
	const selectedBackgroundData = allBackgrounds.find(
		(b) => b.id === selectedBackground,
	);
	const backgroundLanguages: string[] = Array.isArray(
		selectedBackgroundData?.languages,
	)
		? (selectedBackgroundData.languages as unknown[]).filter(
				(language): language is string => typeof language === "string",
			)
		: [];
	const backgroundFeatures: BackgroundFeature[] = Array.isArray(
		selectedBackgroundData?.features,
	)
		? (selectedBackgroundData.features as unknown[]).filter(isBackgroundFeature)
		: [];
	const backgroundInventory = collectStringValues(
		selectedBackgroundData?.starting_equipment ??
			(selectedBackgroundData as { equipment?: unknown }).equipment,
	);
	const singularFeature =
		selectedBackgroundData?.feature_name &&
		!backgroundFeatures.some(
			(feature) => feature.name === selectedBackgroundData.feature_name,
		)
			? [
					{
						name: selectedBackgroundData.feature_name,
						description: selectedBackgroundData.feature_description,
					},
				]
			: [];
	const displayFeatures = [...singularFeature, ...backgroundFeatures];

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<AscendantWindow title="MODEL ORIGIN: BACKGROUND BINDING">
				<div className="space-y-6">
					<div className="space-y-3">
						<Label className="text-[10px] uppercase tracking-widest text-primary/60">
							Select Historical Imprint Pattern
						</Label>
						<Select
							value={selectedBackground}
							onValueChange={onBackgroundChange}
						>
							<SelectTrigger className="h-12 bg-black/40 border-primary/20 text-lg font-heading">
								<SelectValue placeholder="Choose a background protocol..." />
							</SelectTrigger>
							<SelectContent>
								{allBackgrounds.map((bg) => (
									<SelectItem key={bg.id} value={bg.id}>
										{formatRegentVernacular(bg.display_name || bg.name)}
										{bg._homebrew && (
											<Badge
												variant="outline"
												className="ml-2 text-[8px] uppercase h-4"
											>
												Homebrew
											</Badge>
										)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{selectedBackgroundData && (
						<div className="p-5 rounded-lg bg-black/40 border border-primary/10 space-y-4">
							<div className="flex justify-between items-start gap-3">
								<h4 className="font-heading font-semibold text-lg text-primary">
									{formatRegentVernacular(
										selectedBackgroundData.display_name ||
											selectedBackgroundData.name,
									)}
								</h4>
								<Badge
									variant="secondary"
									className="text-[9px] uppercase bg-primary/10 text-primary/70 border-primary/20"
								>
									{formatRegentVernacular(
										(selectedBackgroundData as { source_book?: string | null })
											.source_book ?? "Rift Ascendant Canon",
									)}
								</Badge>
							</div>
							<AscendantText className="block text-sm text-muted-foreground leading-relaxed italic">
								{formatRegentVernacular(selectedBackgroundData.description)}
							</AscendantText>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-primary/5">
								<BackgroundChipGroup
									label="Neural Patterns (Skills)"
									values={selectedBackgroundData.skill_proficiencies ?? []}
									alreadyGranted={jobGrantedSkills}
									alreadyGrantedSource={jobName ? `Job: ${jobName}` : "Job"}
								/>

								<BackgroundChipGroup
									label="Functional Tools (Utility)"
									values={selectedBackgroundData.tool_proficiencies ?? []}
									alreadyGranted={jobGrantedTools}
									alreadyGrantedSource={jobName ? `Job: ${jobName}` : "Job"}
								/>

								<BackgroundChipGroup
									label="Linguistic Bindings"
									values={backgroundLanguages}
								/>

								{/* Starting Wealth / Credits */}
								{selectedBackgroundData.starting_credits != null && (
									<div className="space-y-1">
										<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
											Starting Capital
										</Label>
										<div className="text-[11px] text-primary/80 font-semibold mt-1">
											{formatRaCurrencyAmount(
												selectedBackgroundData.starting_credits,
											)}
										</div>
									</div>
								)}

								{/* Starting Equipment */}
								<div className="md:col-span-2">
									<BackgroundChipGroup
										label="Starting Inventory Pack"
										values={backgroundInventory}
										variant="outline"
									/>
								</div>

								{/* Background Features (Support both array and singular) */}
								<div className="md:col-span-2 space-y-3 pt-2">
									{displayFeatures.length > 0 && (
										<div className="space-y-3">
											<Label className="text-[10px] font-heading font-semibold text-primary uppercase tracking-wider">
												Background Features
											</Label>
											{displayFeatures.map((feature) => {
												const structured = parseStructuredMechanics(
													feature.description,
													selectedBackgroundData.mechanics,
												);
												return (
													<BackgroundFeatureCard
														key={feature.name}
														feature={feature}
														mechanics={structured}
													/>
												);
											})}
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</AscendantWindow>
		</div>
	);
};
