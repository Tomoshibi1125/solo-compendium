import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { StaticJob } from "@/types/character";

interface EquipmentStepProps {
	staticJobData: StaticJob;
	equipmentChoices: Record<number, string>;
	setEquipmentChoices: (
		choices: (prev: Record<number, string>) => Record<number, string>,
	) => void;
	/** Fixed gear granted by the character's background (no choice required). */
	backgroundEquipment?: string[] | null;
}

const normalizeEquipmentLookup = (value: string) =>
	value
		.toLowerCase()
		.replace(/\([^)]*\)/g, "")
		.replace(/[^a-z0-9]+/g, "")
		.trim();

const stringifyValue = (value: unknown): string | null => {
	if (value === null || value === undefined) return null;
	if (typeof value === "string") return value.trim() || null;
	if (typeof value === "number") return `${value}`;
	if (typeof value === "boolean") return value ? "Yes" : "No";
	return null;
};

const getPropertyLabels = (entry: StaticCompendiumEntry): string[] => {
	if (Array.isArray(entry.simple_properties)) return entry.simple_properties;
	if (Array.isArray(entry.properties)) return entry.properties;
	if (entry.properties && typeof entry.properties === "object") {
		return Object.entries(entry.properties)
			.filter(([, value]) => value === true || value === "true")
			.map(([key]) => key);
	}
	return [];
};

const getCanonicalMatches = (
	option: string,
	canonicalEntries: StaticCompendiumEntry[],
	canonicalByName: Map<string, StaticCompendiumEntry>,
) => {
	const optionKey = normalizeEquipmentLookup(option);
	const direct = canonicalByName.get(optionKey);
	if (direct) return [direct];

	return canonicalEntries
		.filter((entry) => {
			const entryKey = normalizeEquipmentLookup(entry.name);
			return (
				entryKey.length >= 4 &&
				(optionKey.includes(entryKey) || entryKey.includes(optionKey))
			);
		})
		.slice(0, 3);
};

const getCanonicalLines = (entry: StaticCompendiumEntry): string[] => {
	const lines: string[] = [];
	const damage = stringifyValue(entry.damage);
	const damageType = stringifyValue(entry.damage_type);
	const armorClass = stringifyValue(entry.armor_class);
	const range = stringifyValue(
		(entry as { range?: unknown; weapon_range?: unknown }).range ??
			(entry as { weapon_range?: unknown }).weapon_range,
	);
	const equipmentType = stringifyValue(
		entry.weapon_type ??
			entry.armor_type ??
			entry.item_type ??
			entry.equipment_type,
	);
	const properties = getPropertyLabels(entry);
	const weight = stringifyValue(entry.weight);
	const rarity = stringifyValue(entry.rarity);
	const sourceBook = stringifyValue(
		(entry as { source_book?: unknown }).source_book,
	);

	if (damage)
		lines.push(`Damage ${damage}${damageType ? ` ${damageType}` : ""}`);
	if (armorClass) lines.push(`AC ${armorClass}`);
	if (range) lines.push(`Range ${range}`);
	if (equipmentType) lines.push(formatRegentVernacular(equipmentType));
	if (properties.length > 0)
		lines.push(properties.map(formatRegentVernacular).join(", "));
	if (entry.stealth_disadvantage) lines.push("Stealth Disadvantage");
	if (entry.strength_requirement)
		lines.push(`STR ${entry.strength_requirement}`);
	if (weight) lines.push(`${weight} lb`);
	if (rarity) lines.push(formatRegentVernacular(rarity));
	if (sourceBook) lines.push(formatRegentVernacular(sourceBook));

	return lines;
};

function CanonicalEquipmentDetails({
	matches,
	showAllStats,
}: {
	matches: StaticCompendiumEntry[];
	showAllStats: boolean;
}) {
	if (matches.length === 0) return null;

	return (
		<div className="mt-2 space-y-1">
			{matches.map((entry) => {
				const lines = showAllStats
					? getCanonicalLines(entry)
					: getCanonicalLines(entry).slice(0, 3);
				if (lines.length === 0) return null;
				return (
					<div key={entry.id} className="flex flex-wrap gap-1">
						{lines.map((line) => (
							<Badge
								key={`${entry.id}-${line}`}
								variant="outline"
								className="text-[11px] border-primary/20 bg-black/20"
							>
								{line}
							</Badge>
						))}
					</div>
				);
			})}
		</div>
	);
}

export const EquipmentStep: React.FC<EquipmentStepProps> = ({
	staticJobData,
	equipmentChoices,
	setEquipmentChoices,
	backgroundEquipment,
}) => {
	const [showAllStats, setShowAllStats] = useState(false);
	// DDB-style weapon-loadout picks, keyed by weaponChoices group index. Kept
	// local (the parent only owns startingEquipment choices); both fold into the
	// staged loadout for display.
	const [weaponChoicePicks, setWeaponChoicePicks] = useState<
		Record<number, string>
	>({});
	const { data: canonicalEntries = [] } = useQuery({
		queryKey: ["creation-canonical-equipment"],
		queryFn: async () => {
			const [equipment, items, relics] = await Promise.all([
				listCanonicalEntries("equipment"),
				listCanonicalEntries("items"),
				listCanonicalEntries("relics"),
			]);
			return [...equipment, ...items, ...relics];
		},
		staleTime: 5 * 60 * 1000,
	});
	const canonicalByName = useMemo(() => {
		const next = new Map<string, StaticCompendiumEntry>();
		for (const entry of canonicalEntries) {
			const key = normalizeEquipmentLookup(entry.name);
			if (key && !next.has(key)) next.set(key, entry);
		}
		return next;
	}, [canonicalEntries]);

	if (
		!staticJobData?.startingEquipment ||
		staticJobData.startingEquipment.length === 0
	) {
		if (backgroundEquipment && backgroundEquipment.length > 0) {
			// No job choices, but background gear still needs to be shown
			return (
				<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<AscendantWindow title="MODEL EQUIPMENT: AUTOMATED PROVISIONING">
						<div className="space-y-3">
							<p className="text-[11px] uppercase tracking-widest text-primary/70 font-bold mb-3">
								Background Equipment — Standard Issue
							</p>
							<ul className="space-y-2 pl-1">
								{backgroundEquipment.map((item) => (
									<li
										key={item}
										className="text-xs flex items-center gap-3 text-muted-foreground/80"
									>
										<Check className="w-3 h-3 text-primary/60 flex-shrink-0" />
										<div className="min-w-0">
											<div>{item}</div>
											<CanonicalEquipmentDetails
												matches={getCanonicalMatches(
													item,
													canonicalEntries,
													canonicalByName,
												)}
												showAllStats={showAllStats}
											/>
										</div>
									</li>
								))}
							</ul>
						</div>
					</AscendantWindow>
				</div>
			);
		}
		return (
			<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
				<AscendantWindow title="MODEL EQUIPMENT: AUTOMATED PROVISIONING">
					<div className="text-center py-12 text-muted-foreground border border-dashed border-primary/10 rounded-lg">
						<p className="font-heading text-sm uppercase tracking-widest text-primary/70">
							No Manual Provisions Required
						</p>
						<p className="text-[11px] mt-2 italic">
							Standard equipment will be initialized automatically upon unit
							activation.
						</p>
					</div>
				</AscendantWindow>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<AscendantWindow title="MODEL EQUIPMENT: LOADOUT SELECTION">
				<div className="space-y-6">
					<AscendantText className="block text-sm text-muted-foreground italic pl-3 border-l-2 border-primary/30">
						Select active equipment hardware for the current loadout. The first
						configuration in each array is staged as default.
					</AscendantText>

					{backgroundEquipment && backgroundEquipment.length > 0 && (
						<div className="p-4 rounded-lg border border-primary/10 bg-black/20 space-y-2">
							<p className="text-[11px] uppercase tracking-widest text-primary/70 font-bold">
								Background Equipment — Standard Issue
							</p>
							{backgroundEquipment.map((item) => (
								<div key={item} className="flex items-center gap-3">
									<div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
									<span className="font-heading text-sm text-primary/70">
										{item}
									</span>
									<CanonicalEquipmentDetails
										matches={getCanonicalMatches(
											item,
											canonicalEntries,
											canonicalByName,
										)}
										showAllStats={showAllStats}
									/>
								</div>
							))}
						</div>
					)}
					<div className="flex justify-end">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setShowAllStats((current) => !current)}
							className="text-[11px] uppercase tracking-widest"
						>
							{showAllStats ? "Show summary" : "Show all stats"}
						</Button>
					</div>

					<div className="space-y-4">
						{staticJobData.startingEquipment.map(
							(group: string[], groupIndex: number) => {
								const chosen = equipmentChoices[groupIndex] ?? group[0];
								const chosenCanonicalMatches = getCanonicalMatches(
									chosen,
									canonicalEntries,
									canonicalByName,
								);

								return (
									<div
										key={`eq-group-${group.join("-").replace(/\s/g, "")}`}
										className="p-4 rounded-lg border border-primary/10 bg-black/40 space-y-3"
									>
										{group.length === 1 ? (
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="w-1.5 h-1.5 rounded-full bg-primary" />
													<span className="font-heading font-semibold text-sm text-primary/80">
														{group[0]}
													</span>
													<CanonicalEquipmentDetails
														matches={chosenCanonicalMatches}
														showAllStats={showAllStats}
													/>
												</div>
												<Badge
													variant="secondary"
													className="text-[11px] uppercase tracking-tighter bg-primary/10 border-primary/20"
												>
													Standard Issue
												</Badge>
											</div>
										) : (
											<div className="space-y-3">
												<div className="flex justify-between items-center mb-1">
													<Label className="text-[11px] uppercase tracking-widest text-primary/70 font-bold">
														Package Selection Required
													</Label>
													<Badge
														variant="outline"
														className="text-[11px] uppercase tracking-tighter border-primary/20"
													>
														Select One
													</Badge>
												</div>

												<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
													{group.map((option) => {
														const canonicalMatches = getCanonicalMatches(
															option,
															canonicalEntries,
															canonicalByName,
														);
														return (
															<button
																key={option}
																type="button"
																onClick={() =>
																	setEquipmentChoices((prev) => ({
																		...prev,
																		[groupIndex]: option,
																	}))
																}
																className={cn(
																	"text-left p-3 rounded border transition-all flex items-start gap-3",
																	chosen === option
																		? "border-primary/60 bg-primary/10 text-primary-foreground"
																		: "border-primary/5 bg-black/40 text-muted-foreground hover:border-primary/20 hover:bg-black/60",
																)}
															>
																<div
																	className={cn(
																		"w-3 h-3 rounded-full border flex-shrink-0 transition-all mt-0.5",
																		chosen === option
																			? "border-primary bg-primary scale-110 shadow-[0_0_8px_rgba(var(--primary),0.5)]"
																			: "border-primary/20 bg-transparent",
																	)}
																/>
																<div className="min-w-0">
																	<span className="font-heading text-xs tracking-tight">
																		{option}
																	</span>
																	<CanonicalEquipmentDetails
																		matches={canonicalMatches}
																		showAllStats={showAllStats}
																	/>
																</div>
															</button>
														);
													})}
												</div>
											</div>
										)}
									</div>
								);
							},
						)}
					</div>

					<div className="p-4 rounded-lg bg-primary/5 border border-primary/10 mt-6">
						<div className="flex items-center gap-2 mb-3">
							<div className="w-1 h-3 bg-primary" />
							<p className="text-[11px] font-heading font-semibold text-primary uppercase tracking-widest">
								Current Staged Loadout
							</p>
						</div>
						<ul className="space-y-2 pl-1">
							{staticJobData.startingEquipment.map(
								(group: string[], i: number) => {
									const chosen = equipmentChoices[i] ?? group[0];
									return (
										<li
											key={`summary-${group.join("|")}-${chosen.replace(/\s/g, "")}`}
											className="text-xs flex items-center gap-3 text-muted-foreground/80"
										>
											<Check className="w-3 h-3 text-primary/60 flex-shrink-0" />
											<div className="min-w-0">
												<div>{chosen}</div>
												<CanonicalEquipmentDetails
													matches={getCanonicalMatches(
														chosen,
														canonicalEntries,
														canonicalByName,
													)}
													showAllStats={showAllStats}
												/>
											</div>
										</li>
									);
								},
							)}
							{(backgroundEquipment ?? []).map((item) => (
								<li
									key={`bg-summary-${item.replace(/\s/g, "")}`}
									className="text-xs flex items-center gap-3 text-muted-foreground/60"
								>
									<Check className="w-3 h-3 text-primary/70 flex-shrink-0" />
									<div className="min-w-0">
										<div>
											{item}{" "}
											<span className="text-[11px] uppercase tracking-tighter text-primary/70 ml-1">
												Background
											</span>
										</div>
										<CanonicalEquipmentDetails
											matches={getCanonicalMatches(
												item,
												canonicalEntries,
												canonicalByName,
											)}
											showAllStats={showAllStats}
										/>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</AscendantWindow>

			{/* Weapon Loadout — DDB-style canon weapon choices for this job */}
			{staticJobData.weaponChoices &&
				staticJobData.weaponChoices.length > 0 && (
					<AscendantWindow title="MODEL ARMAMENT: WEAPON LOADOUT">
						<AscendantText className="block text-sm text-muted-foreground italic pl-3 border-l-2 border-primary/30 mb-4">
							Select your starting weapon for each slot, drawn from your model's
							certified proficiencies.
						</AscendantText>
						<div className="space-y-4">
							{staticJobData.weaponChoices.map(
								(group: string[], groupIndex: number) => {
									const chosen = weaponChoicePicks[groupIndex] ?? group[0];
									return (
										<div
											key={`wpn-group-${group.join("-").replace(/\s/g, "")}`}
											className="p-4 rounded-lg border border-primary/10 bg-black/40 space-y-3"
										>
											{group.length === 1 ? (
												<div className="flex items-center gap-3">
													<div className="w-1.5 h-1.5 rounded-full bg-primary" />
													<span className="font-heading font-semibold text-sm text-primary/80">
														{group[0]}
													</span>
													<CanonicalEquipmentDetails
														matches={getCanonicalMatches(
															chosen,
															canonicalEntries,
															canonicalByName,
														)}
														showAllStats={showAllStats}
													/>
												</div>
											) : (
												<div className="space-y-3">
													<div className="flex justify-between items-center mb-1">
														<Label className="text-[11px] uppercase tracking-widest text-primary/70 font-bold">
															Weapon Selection
														</Label>
														<Badge
															variant="outline"
															className="text-[11px] uppercase tracking-tighter border-primary/20"
														>
															Select One
														</Badge>
													</div>
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
														{group.map((option) => (
															<button
																key={option}
																type="button"
																onClick={() =>
																	setWeaponChoicePicks((prev) => ({
																		...prev,
																		[groupIndex]: option,
																	}))
																}
																className={cn(
																	"text-left p-3 rounded border transition-all flex items-start gap-3",
																	chosen === option
																		? "border-primary/60 bg-primary/10 text-primary-foreground"
																		: "border-primary/5 bg-black/40 text-muted-foreground hover:border-primary/20 hover:bg-black/60",
																)}
															>
																<div
																	className={cn(
																		"w-3 h-3 rounded-full border flex-shrink-0 transition-all mt-0.5",
																		chosen === option
																			? "border-primary bg-primary scale-110"
																			: "border-primary/20 bg-transparent",
																	)}
																/>
																<div className="min-w-0">
																	<span className="font-heading text-xs tracking-tight">
																		{option}
																	</span>
																	<CanonicalEquipmentDetails
																		matches={getCanonicalMatches(
																			option,
																			canonicalEntries,
																			canonicalByName,
																		)}
																		showAllStats={showAllStats}
																	/>
																</div>
															</button>
														))}
													</div>
												</div>
											)}
										</div>
									);
								},
							)}
						</div>
					</AscendantWindow>
				)}
		</div>
	);
};
