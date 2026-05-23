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
import { formatActivationText } from "@/lib/canonicalCompendium";
import { formatRegentVernacular } from "@/lib/vernacular";

interface PathFeature {
	name: string;
	level: number;
	description?: string | null;
}

interface PathAbility {
	name: string;
	description?: string | null;
	cost?: string | null;
	recharge?: number | string | null;
}

interface PathStats {
	primaryAttribute: string;
	secondaryAttribute?: string | null;
}

// Accepts both DB Row shape and rich static data shape via optional fields.
interface PathRow {
	id: string;
	name: string;
	description?: string | null;
	display_name?: string | null;
	path_level?: number | null;
	requirements?: { level?: number | null } | null;
	stats?: PathStats | null;
	features?: PathFeature[] | null;
	abilities?: PathAbility[] | null;
}

interface PathStepProps {
	selectedPath: string;
	onPathChange: (pathId: string) => void;
	paths: PathRow[];
}

const formatMaybe = (value: string | null | undefined) =>
	value ? formatRegentVernacular(value) : "";

// ---------------------------------------------------------------------------
// Inline mechanic extraction from description text
// ---------------------------------------------------------------------------

/** Extracts dice formulas like "1d6", "2d8+3", "3d10 force", etc. */
const DICE_FORMULA_RE =
	/\b(\d+d\d+(?:\s*[+]\s*\w+)?(?:\s+(?:radiant|necrotic|force|fire|cold|lightning|thunder|psychic|poison|acid|bludgeoning|piercing|slashing))?)\b/gi;

/** Extracts save references like "STR save", "AGI half", "SENSE save DC" */
const SAVE_RE =
	/\b(STR|AGI|VIT|INT|SENSE|PRE|Strength|Agility|Vitality|Intelligence|Sense|Presence|Constitution|Dexterity|Wisdom|Charisma)\s+(?:save|saving throw|half)\b/gi;

/** Extracts range/radius like "30 ft", "60-ft radius", "10-ft aura", "within 5 ft" */
const RANGE_RE =
	/\b(\d+)[- ]?(?:ft|feet|foot)\b(?:\s*(?:radius|aura|cone|line|sphere|cube))?/gi;

interface ExtractedMechanics {
	diceFormulas: string[];
	saves: string[];
	ranges: string[];
	actionType: string | null;
}

function extractMechanicsFromDescription(
	description: string | null | undefined,
): ExtractedMechanics {
	const result: ExtractedMechanics = {
		diceFormulas: [],
		saves: [],
		ranges: [],
		actionType: null,
	};
	if (!description) return result;

	const diceMatches = [...description.matchAll(DICE_FORMULA_RE)];
	const seen = new Set<string>();
	for (const match of diceMatches) {
		const normalized = match[1].trim().toLowerCase();
		if (!seen.has(normalized)) {
			seen.add(normalized);
			result.diceFormulas.push(match[1].trim());
		}
	}

	const saveMatches = [...description.matchAll(SAVE_RE)];
	const seenSaves = new Set<string>();
	for (const match of saveMatches) {
		const ability = match[1].toUpperCase().slice(0, 3);
		if (!seenSaves.has(ability)) {
			seenSaves.add(ability);
			result.saves.push(`${ability} save`);
		}
	}

	const rangeMatches = [...description.matchAll(RANGE_RE)];
	const seenRanges = new Set<string>();
	for (const match of rangeMatches) {
		const range = match[0].trim();
		if (!seenRanges.has(range)) {
			seenRanges.add(range);
			result.ranges.push(range);
		}
	}

	return result;
}

function buildMechanicPreview(mechanics: ExtractedMechanics): string | null {
	const parts: string[] = [];
	if (mechanics.diceFormulas.length > 0) {
		parts.push(mechanics.diceFormulas.join(", "));
	}
	if (mechanics.saves.length > 0) {
		parts.push(mechanics.saves.join(", "));
	}
	if (mechanics.ranges.length > 0) {
		// Only show unique meaningful ranges (skip "5 ft" which is typically melee default)
		const significant = mechanics.ranges.filter((r) => !r.startsWith("5 "));
		if (significant.length > 0) {
			parts.push(significant.join(", "));
		}
	}
	return parts.length > 0 ? parts.join(" · ") : null;
}

function normalizeActivationCost(
	cost: string | null | undefined,
): string | null {
	if (!cost) return null;
	// Try the canonical formatter first (handles structured objects and strings)
	const formatted = formatActivationText(cost);
	if (formatted) return formatted;
	// Fall back to raw string
	return cost.trim() || null;
}

function PathMechanicCard({
	title,
	description,
	badges,
	mechanicPreview,
}: {
	title: string;
	description?: string | null;
	badges: { label: string; variant?: "default" | "secondary" | "outline" }[];
	mechanicPreview?: string | null;
}) {
	return (
		<div className="text-xs space-y-2 p-3 rounded bg-black/40 border border-primary/10">
			<div className="flex justify-between items-start gap-3">
				<span className="font-semibold text-primary">
					{formatRegentVernacular(title)}
				</span>
				<div className="flex flex-wrap justify-end gap-1">
					{badges.map((badge) => (
						<Badge
							key={`${title}-${badge.label}`}
							variant={badge.variant ?? "secondary"}
							className="text-[9px] uppercase"
						>
							{badge.label}
						</Badge>
					))}
				</div>
			</div>
			{description && (
				<AscendantText className="text-muted-foreground block">
					{formatRegentVernacular(description)}
				</AscendantText>
			)}
			{mechanicPreview && (
				<div className="mt-1 text-[10px] text-primary/80 font-mono bg-primary/5 border border-primary/10 rounded px-2 py-1">
					{mechanicPreview}
				</div>
			)}
		</div>
	);
}

export const PathStep: React.FC<PathStepProps> = ({
	selectedPath,
	onPathChange,
	paths,
}) => {
	const selectedPathData = paths.find((p) => p.id === selectedPath);

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<AscendantWindow title="MODEL EVOLUTION: PATH BRANCHING">
				<div className="space-y-6">
					<div className="space-y-3">
						<Label className="text-[10px] uppercase tracking-widest text-primary/60">
							Select Active Specialization Path
						</Label>
						<Select value={selectedPath} onValueChange={onPathChange}>
							<SelectTrigger className="h-12 bg-black/40 border-primary/20 text-lg font-heading">
								<SelectValue placeholder="Choose an evolution path..." />
							</SelectTrigger>
							<SelectContent>
								{paths.map((path) => (
									<SelectItem key={path.id} value={path.id}>
										{formatRegentVernacular(path.display_name || path.name)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{selectedPathData && (
						<div className="p-5 rounded-lg bg-black/40 border border-primary/10 space-y-6">
							<div className="space-y-4">
								<h4 className="font-heading font-semibold text-lg text-primary">
									{formatRegentVernacular(
										selectedPathData.display_name || selectedPathData.name,
									)}
								</h4>
								<AscendantText className="block text-sm text-muted-foreground leading-relaxed italic">
									{formatRegentVernacular(selectedPathData.description)}
								</AscendantText>

								<div className="grid grid-cols-2 gap-4 py-3 border-y border-primary/5">
									<div className="space-y-1">
										<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
											Unlock Level
										</Label>
										<div className="text-sm font-heading">
											{selectedPathData.path_level ||
												selectedPathData.requirements?.level ||
												3}
										</div>
									</div>
									<div className="space-y-1 text-right">
										<Label className="text-[9px] uppercase tracking-tighter text-muted-foreground">
											Integration Index
										</Label>
										<div className="text-[10px] uppercase tracking-widest text-primary/40 mt-1">
											Authorized Protocol
										</div>
									</div>
								</div>

								{/* Bonus Stats / Stat Priorities */}
								{selectedPathData.stats && (
									<div className="space-y-3 pt-2">
										<h4 className="text-[11px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
											<span className="h-[1px] flex-grow bg-primary/20"></span>
											Path Attributes
											<span className="h-[1px] flex-grow bg-primary/20"></span>
										</h4>
										<div className="flex flex-wrap gap-2">
											<Badge
												variant="secondary"
												className="text-[10px] bg-primary/10 border-primary/20"
											>
												Primary:{" "}
												{formatMaybe(selectedPathData.stats.primaryAttribute)}
											</Badge>
											{selectedPathData.stats.secondaryAttribute && (
												<Badge
													variant="outline"
													className="text-[10px] border-primary/20"
												>
													Secondary:{" "}
													{formatMaybe(
														selectedPathData.stats.secondaryAttribute,
													)}
												</Badge>
											)}
										</div>
									</div>
								)}

								{/* Path Features */}
								{selectedPathData.features &&
									selectedPathData.features.length > 0 && (
										<div className="space-y-3 pt-4 border-t border-primary/10">
											<h4 className="text-[11px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
												<span className="h-[1px] flex-grow bg-primary/20"></span>
												Evolution Features
												<span className="h-[1px] flex-grow bg-primary/20"></span>
											</h4>
											<div className="space-y-4">
												{[...selectedPathData.features]
													.sort((a, b) => a.level - b.level)
													.map((f) => {
														const mechanics = extractMechanicsFromDescription(
															f.description,
														);
														const preview = buildMechanicPreview(mechanics);
														return (
															<PathMechanicCard
																key={`${f.level}-${f.name}`}
																title={f.name}
																description={f.description}
																badges={[{ label: `Level ${f.level}` }]}
																mechanicPreview={preview}
															/>
														);
													})}
											</div>
										</div>
									)}

								{/* Path Abilities */}
								{selectedPathData.abilities &&
									selectedPathData.abilities.length > 0 && (
										<div className="space-y-3 pt-4 border-t border-primary/10">
											<h4 className="text-[11px] font-heading font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
												<span className="h-[1px] flex-grow bg-primary/20"></span>
												Path Actives & Abilities
												<span className="h-[1px] flex-grow bg-primary/20"></span>
											</h4>
											<div className="space-y-4">
												{selectedPathData.abilities.map((a) => {
													const normalizedCost = normalizeActivationCost(
														a.cost,
													);
													const mechanics = extractMechanicsFromDescription(
														a.description,
													);
													const preview = buildMechanicPreview(mechanics);
													return (
														<PathMechanicCard
															key={a.name}
															title={a.name}
															description={a.description}
															badges={[
																...(normalizedCost
																	? [
																			{
																				label: normalizedCost,
																			},
																		]
																	: []),
																...(a.recharge !== null &&
																a.recharge !== undefined
																	? [
																			{
																				label: `Recharge ${a.recharge}`,
																				variant: "outline" as const,
																			},
																		]
																	: []),
															]}
															mechanicPreview={preview}
														/>
													);
												})}
											</div>
										</div>
									)}
							</div>
						</div>
					)}
				</div>
			</AscendantWindow>
		</div>
	);
};
