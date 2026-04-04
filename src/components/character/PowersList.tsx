import { AlertTriangle, Plus, Trash2, Wand2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableList } from "@/components/ui/SortableList";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCharacter } from "@/hooks/useCharacters";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { usePowers } from "@/hooks/usePowers";
import { useRecordRoll } from "@/hooks/useRollHistory";
import type { useSpellCasting } from "@/hooks/useSpellCasting";
import type { Database } from "@/integrations/supabase/types";
import type { DetailData } from "@/types/character";

export type Power = Database["public"]["Tables"]["character_powers"]["Row"];

import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { useSpellSlots, useUpdateSpellSlot } from "@/hooks/useSpellSlots";
import {
	getAbilityModifier,
	getCantripsKnownLimit,
	getSpellcastingAbility,
	getSpellsKnownLimit,
	getSpellsPreparedLimit,
} from "@/lib/characterCalculations";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import { AddPowerDialog } from "./AddPowerDialog";

function CompendiumLink({
	name,
	onSelect,
	className,
}: {
	name: string;
	onSelect?: () => void;
	className?: string;
}) {
	const displayName = formatRegentVernacular(name);
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"text-left hover:text-primary transition-colors",
				className,
			)}
		>
			{displayName}
		</button>
	);
}

export function PowersList({
	characterId,
	spellCasting,
	campaignId,
	onSelectDetail,
}: {
	characterId: string;
	spellCasting?: ReturnType<typeof useSpellCasting>;
	campaignId?: string;
	onSelectDetail?: (detail: DetailData) => void;
}) {
	const {
		powers: rawPowers,
		updatePower,
		removePower,
		reorderPowers,
		concentrationPower,
	} = usePowers(characterId);
	const powers = rawPowers as Power[];
	const { data: character } = useCharacter(characterId);
	const { data: spellSlots = [] } = useSpellSlots(
		characterId,
		character?.job || null,
		character?.level || 1,
	);
	const updateSpellSlot = useUpdateSpellSlot();
	const { toast } = useToast();
	const recordRoll = useRecordRoll();
	const ascendantTools = useAscendantTools();
	const { rollInCampaign } = ascendantTools;

	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [filterLevel, setFilterLevel] = useState<string>("all");
	const [filterPrepared, setFilterPrepared] = useState<string>("all");

	const filteredPowers = powers.filter((power) => {
		if (filterLevel !== "all" && power.power_level.toString() !== filterLevel)
			return false;
		if (filterPrepared === "prepared" && !power.is_prepared) return false;
		if (filterPrepared === "unprepared" && power.is_prepared) return false;
		return true;
	});

	const groupedPowers = filteredPowers.reduce(
		(acc: Record<string, Power[]>, power) => {
			const level =
				power.power_level === 0 ? "Cantrip" : `Level ${power.power_level}`;
			if (!acc[level]) acc[level] = [];
			acc[level].push(power);
			return acc;
		},
		{},
	);

	// Calculate spell limits
	const spellcastingAbility = character
		? getSpellcastingAbility(character.job)
		: null;
	const abilityModifier =
		character && spellcastingAbility
			? getAbilityModifier(character.abilities?.[spellcastingAbility] || 10)
			: 0;
	const spellsPreparedLimit = character
		? getSpellsPreparedLimit(character.job, character.level, abilityModifier)
		: null;
	const spellsKnownLimit = character
		? getSpellsKnownLimit(character.job, character.level)
		: null;
	const cantripsKnownLimit = character
		? getCantripsKnownLimit(character.job, character.level)
		: null;
	const preparedCount = powers.filter((p: Power) => p.is_prepared).length;
	const knownCount = powers.filter(
		(p: Power) => (p.power_level ?? 0) > 0,
	).length;
	const cantripCount = powers.filter(
		(p: Power) => (p.power_level ?? 0) === 0,
	).length;
	const isOverPreparedLimit =
		spellsPreparedLimit !== null && preparedCount > spellsPreparedLimit;
	const isOverKnownLimit =
		spellsKnownLimit !== null && knownCount > spellsKnownLimit;
	const isOverCantripLimit =
		cantripsKnownLimit !== null && cantripCount > cantripsKnownLimit;

	const handleReorderGroup = useCallback(
		async (_level: string, newOrder: typeof powers) => {
			try {
				const updates = newOrder.map((power, index) => ({
					id: power.id,
					display_order: index,
				}));
				await reorderPowers(updates);
			} catch {
				// Error handled by hook
			}
		},
		[reorderPowers],
	);

	const handleTogglePrepared = async (power: Power) => {
		const displayName = formatRegentVernacular(power.name);
		// Check if preparing would exceed limit
		if (!power.is_prepared && spellsPreparedLimit !== null) {
			if (preparedCount >= spellsPreparedLimit) {
				toast({
					title: "Prepared Limit Reached",
					description: `You can only prepare ${spellsPreparedLimit} spells. Unprepare another spell first.`,
					variant: "destructive",
				});
				return;
			}
		}

		try {
			await updatePower({
				id: power.id,
				updates: { is_prepared: !power.is_prepared },
			});
			toast({
				title: power.is_prepared ? "Unprepared" : "Prepared",
				description: `${displayName} has been ${power.is_prepared ? "unprepared" : "prepared"}.`,
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to update power.",
				variant: "destructive",
			});
		}
	};

	const handleCastSpell = async (power: Power) => {
		const displayName = formatRegentVernacular(power.name);

		if (spellCasting) {
			const result = await spellCasting.castSpell({
				spell: {
					id: power.id,
					name: power.name,
					level: power.power_level,
					isRitual: false,
					isConcentration: power.concentration ?? false,
					castingTime: power.casting_time,
					range: power.range,
					duration: power.duration,
					description: power.description,
					higherLevels: null,
				},
				characterId,
				characterName: character?.name || "Character",
				jobName: character?.job || null,
				pathName: character?.path || null,
				level: character?.level || 1,
				campaignId: null,
			});

			if (!result.success) {
				toast({
					title: "Cast Failed",
					description: result.message,
					variant: "destructive",
				});
				return;
			}

			ascendantTools
				.trackCustomFeatureUsage(characterId, power.name, "activate", "SA")
				.catch(console.error);

			toast({
				title: "Spell Cast",
				description: result.message,
			});
			return;
		}

		if (power.power_level === 0) {
			ascendantTools
				.trackCustomFeatureUsage(characterId, power.name, "activate", "SA")
				.catch(console.error);
			toast({
				title: "Cantrip Cast",
				description: `${displayName} is activated without using a power slot.`,
			});
			return;
		}

		const slot = spellSlots.find(
			(s) => s.level === power.power_level && s.current > 0,
		);
		if (!slot) {
			toast({
				title: "No Power Slots Available",
				description: `You don't have any Tier ${power.power_level} power slots available.`,
				variant: "destructive",
			});
			return;
		}

		try {
			await updateSpellSlot.mutateAsync({
				characterId,
				spellLevel: power.power_level,
				current: slot.current - 1,
			});

			if (campaignId) {
				rollInCampaign(campaignId, {
					dice_formula: "0",
					result: 0,
					rolls: [],
					roll_type: "ability",
					context: `Activates Power: ${displayName} (Level ${power.power_level})`,
					character_id: characterId,
				});
			}

			recordRoll.mutate({
				dice_formula: "0",
				result: 0,
				rolls: [],
				roll_type: "ability",
				context: `Activates Power: ${displayName} (Level ${power.power_level})`,
				campaign_id: campaignId ?? null,
				character_id: characterId,
			});

			ascendantTools
				.trackCustomFeatureUsage(characterId, power.name, "activate", "SA")
				.catch(console.error);

			toast({
				title: "Power Used",
				description: `${displayName} activated! Used 1 Tier ${power.power_level} power slot.`,
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to use power slot.",
				variant: "destructive",
			});
		}
	};

	const handleRemove = async (power: Power) => {
		const displayName = formatRegentVernacular(power.name);
		if (!confirm(`Remove ${displayName}?`)) return;

		try {
			await removePower(power.id);
			toast({
				title: "Removed",
				description: `${displayName} has been removed.`,
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to remove power.",
				variant: "destructive",
			});
		}
	};

	return (
		<SystemWindow title="POWERS">
			<div className="space-y-4">
				{/* Spell Limits Display */}
				{(spellsPreparedLimit !== null ||
					spellsKnownLimit !== null ||
					cantripsKnownLimit !== null) && (
					<div className="p-2 rounded-lg border bg-muted/30">
						<div className="flex items-center justify-between text-sm">
							{spellsPreparedLimit !== null && (
								<div
									className={cn(
										"flex items-center gap-2",
										isOverPreparedLimit && "text-destructive",
									)}
								>
									<span className="text-muted-foreground">Prepared:</span>
									<span
										className={cn(
											"font-semibold",
											isOverPreparedLimit && "text-destructive",
										)}
									>
										{preparedCount} / {spellsPreparedLimit}
									</span>
									{isOverPreparedLimit && (
										<AlertTriangle className="w-4 h-4 text-destructive" />
									)}
								</div>
							)}
							{spellsKnownLimit !== null && (
								<div
									className={cn(
										"flex items-center gap-2",
										isOverKnownLimit && "text-destructive",
									)}
								>
									<span className="text-muted-foreground">Known:</span>
									<span
										className={cn(
											"font-semibold",
											isOverKnownLimit && "text-destructive",
										)}
									>
										{knownCount} / {spellsKnownLimit}
									</span>
									{isOverKnownLimit && (
										<AlertTriangle className="w-4 h-4 text-destructive" />
									)}
								</div>
							)}

							{cantripsKnownLimit !== null && (
								<div
									className={cn(
										"flex items-center gap-2",
										isOverCantripLimit && "text-destructive",
									)}
								>
									<span className="text-muted-foreground">Cantrips:</span>
									<span
										className={cn(
											"font-semibold",
											isOverCantripLimit && "text-destructive",
										)}
									>
										{cantripCount} / {cantripsKnownLimit}
									</span>
									{isOverCantripLimit && (
										<AlertTriangle className="w-4 h-4 text-destructive" />
									)}
								</div>
							)}
						</div>
						{(isOverPreparedLimit ||
							isOverKnownLimit ||
							isOverCantripLimit) && (
							<div className="mt-2 text-xs text-destructive">
								Warning: You exceed the limit for{" "}
								{isOverPreparedLimit ? "prepared" : ""}
								{isOverPreparedLimit && (isOverKnownLimit || isOverCantripLimit)
									? " and "
									: ""}
								{isOverKnownLimit ? "known" : ""}
								{isOverKnownLimit && isOverCantripLimit ? " and " : ""}
								{isOverCantripLimit ? "cantrip" : ""} spells.
							</div>
						)}
					</div>
				)}

				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Select value={filterLevel} onValueChange={setFilterLevel}>
							<SelectTrigger className="w-[120px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Levels</SelectItem>
								<SelectItem value="0">Cantrip</SelectItem>
								{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
									<SelectItem key={level} value={level.toString()}>
										Level {level}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select value={filterPrepared} onValueChange={setFilterPrepared}>
							<SelectTrigger className="w-[140px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="prepared">Prepared</SelectItem>
								<SelectItem value="unprepared">Unprepared</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Button
						onClick={() => setAddDialogOpen(true)}
						size="sm"
						className="gap-2"
					>
						<Plus className="w-4 h-4" />
						Add Power
					</Button>
				</div>

				{concentrationPower && (
					<div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
						<div className="flex items-center gap-2 text-sm">
							<Badge variant="destructive">Concentrating</Badge>
							<span>{formatRegentVernacular(concentrationPower.name)}</span>
						</div>
					</div>
				)}

				{powers.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<Wand2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>No powers yet</p>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setAddDialogOpen(true)}
							className="mt-4"
						>
							Add your first power
						</Button>
					</div>
				) : filteredPowers.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						No powers match the current filters
					</div>
				) : (
					Object.entries(groupedPowers).map(([level, levelPowers]) => (
						<div key={level} className="space-y-2">
							<div className="text-sm font-heading text-muted-foreground">
								{level}
							</div>
							<SortableList<Power>
								items={levelPowers}
								onReorder={(newOrder) => handleReorderGroup(level, newOrder)}
								renderItem={(power) => {
									const displayName = formatRegentVernacular(power.name);
									const displayDescription = power.description
										? formatRegentVernacular(power.description)
										: null;
									const displaySource = power.source
										? formatRegentVernacular(power.source)
										: null;
									const displayCastingTime = power.casting_time
										? formatRegentVernacular(power.casting_time)
										: null;
									const displayRange = power.range
										? formatRegentVernacular(power.range)
										: null;
									const displayDuration = power.duration
										? formatRegentVernacular(power.duration)
										: null;

									return (
										<div
											key={power.id}
											className={cn(
												"p-3 rounded-lg border bg-muted/30",
												power.is_prepared && "border-primary/50 bg-primary/5",
											)}
										>
											<div className="flex items-start justify-between gap-2">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<CompendiumLink
															name={displayName}
															className="font-heading font-semibold hover:text-primary"
															onSelect={() =>
																onSelectDetail?.({
																	title: displayName,
																	description: power.description || "",
																	payload: power,
																})
															}
														/>
														{power.power_level > 0 && (
															<Badge variant="secondary" className="text-xs">
																Level {power.power_level}
															</Badge>
														)}
														{power.is_prepared && (
															<Badge variant="default" className="text-xs">
																Prepared
															</Badge>
														)}
														{power.concentration && (
															<Badge variant="destructive" className="text-xs">
																Concentration
															</Badge>
														)}
														{displaySource && (
															<Badge variant="outline" className="text-xs">
																{displaySource}
															</Badge>
														)}
													</div>
													{displayDescription && (
														<div className="text-xs text-muted-foreground line-clamp-3">
															<AutoLinkText text={power.description || ""} />
														</div>
													)}
													<div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
														{displayCastingTime && (
															<span>Casting: {displayCastingTime}</span>
														)}
														{displayRange && <span>Range: {displayRange}</span>}
														{displayDuration && (
															<span>Duration: {displayDuration}</span>
														)}
													</div>
												</div>
												<div className="flex items-center gap-2">
													<div className="flex items-center gap-2">
														<Checkbox
															id={`prepared-${power.id}`}
															checked={power.is_prepared ?? false}
															onCheckedChange={() =>
																handleTogglePrepared(power)
															}
															disabled={
																!power.is_prepared && isOverPreparedLimit
															}
														/>
														<label
															htmlFor={`prepared-${power.id}`}
															className="text-xs cursor-pointer"
														>
															Prep
														</label>
													</div>
													{power.is_prepared && (
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleCastSpell(power)}
															disabled={
																power.power_level > 0 &&
																!spellSlots.find(
																	(s) =>
																		s.level === power.power_level &&
																		s.current > 0,
																)
															}
															className="text-xs"
														>
															Cast
														</Button>
													)}
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
														onClick={() => handleRemove(power)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</div>
										</div>
									);
								}}
								itemClassName="mb-2"
							/>
						</div>
					))
				)}
			</div>

			<AddPowerDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				characterId={characterId}
			/>
		</SystemWindow>
	);
}
