import { AlertTriangle, Plus, ScrollText, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useRecordRoll } from "@/hooks/useRollHistory";
import type { useSpellCasting } from "@/hooks/useSpellCasting";
import { useSpellSlots } from "@/hooks/useSpellSlots";
import { type CharacterSpell, useSpells } from "@/hooks/useSpells";
import {
	getAbilityModifier,
	getCantripsKnownLimit,
	getSpellcastingAbility,
	getSpellsKnownLimit,
	getSpellsPreparedLimit,
} from "@/lib/characterCalculations";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { DetailData } from "@/types/character";
import { AddSpellDialog } from "./AddSpellDialog";

interface SpellsListProps {
	characterId: string;
	spellCasting?: ReturnType<typeof useSpellCasting>;
	campaignId?: string;
	onSelectDetail?: (detail: DetailData) => void;
	hideHeader?: boolean;
}

export function SpellsList({
	characterId,
	spellCasting,
	campaignId,
	onSelectDetail,
	hideHeader = false,
}: SpellsListProps) {
	const { spells, updateSpell, removeSpell } = useSpells(characterId);
	const { data: character } = useCharacter(characterId);
	const { data: spellSlots = [] } = useSpellSlots(
		characterId,
		character?.job || null,
		character?.level || 1,
	);
	const { toast } = useToast();
	const recordRoll = useRecordRoll();
	const ascendantTools = useAscendantTools();
	const { rollInCampaign } = ascendantTools;
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [filterLevel, setFilterLevel] = useState("all");
	const [filterPrepared, setFilterPrepared] = useState("all");

	const countedSpells = spells.filter((spell) => spell.counts_against_limit);
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
	const preparedCount = countedSpells.filter(
		(spell) => spell.is_prepared,
	).length;
	const knownCount = countedSpells.filter(
		(spell) => (spell.spell_level ?? 0) > 0,
	).length;
	const cantripCount = countedSpells.filter(
		(spell) => (spell.spell_level ?? 0) === 0,
	).length;
	const isOverPreparedLimit =
		spellsPreparedLimit !== null && preparedCount > spellsPreparedLimit;
	const isOverKnownLimit =
		spellsKnownLimit !== null && knownCount > spellsKnownLimit;
	const isOverCantripLimit =
		cantripsKnownLimit !== null && cantripCount > cantripsKnownLimit;

	const filteredSpells = useMemo(() => {
		return spells.filter((spell) => {
			if (
				filterLevel !== "all" &&
				spell.spell_level.toString() !== filterLevel
			) {
				return false;
			}
			if (filterPrepared === "prepared" && !spell.is_prepared) return false;
			if (filterPrepared === "unprepared" && spell.is_prepared) return false;
			return true;
		});
	}, [spells, filterLevel, filterPrepared]);

	const groupedSpells = useMemo(() => {
		return filteredSpells.reduce<Record<string, CharacterSpell[]>>(
			(acc, spell) => {
				const level =
					spell.spell_level === 0 ? "Cantrip" : `Level ${spell.spell_level}`;
				if (!acc[level]) acc[level] = [];
				acc[level].push(spell);
				return acc;
			},
			{},
		);
	}, [filteredSpells]);

	const handleTogglePrepared = async (spell: CharacterSpell) => {
		if (
			!spell.is_prepared &&
			spell.counts_against_limit &&
			spellsPreparedLimit !== null &&
			preparedCount >= spellsPreparedLimit
		) {
			toast({
				title: "Prepared Limit Reached",
				description: `You can only prepare ${spellsPreparedLimit} spells. Unprepare another spell first.`,
				variant: "destructive",
			});
			return;
		}

		await updateSpell.mutateAsync({
			id: spell.id,
			updates: { is_prepared: !spell.is_prepared },
		});
	};

	const handleCastSpell = async (spell: CharacterSpell) => {
		const displayName = formatRegentVernacular(spell.name);

		if (spell.uses_max !== null) {
			if ((spell.uses_current ?? 0) <= 0) {
				toast({
					title: "No Uses Available",
					description: `${displayName} has no uses remaining.`,
					variant: "destructive",
				});
				return;
			}
			await updateSpell.mutateAsync({
				id: spell.id,
				updates: { uses_current: Math.max(0, (spell.uses_current ?? 0) - 1) },
			});
			toast({
				title: "Spell Cast",
				description: `${displayName} cast.`,
			});
			return;
		}

		if (spellCasting) {
			const result = await spellCasting.castSpell({
				spell: {
					id: spell.id,
					name: spell.name,
					level: spell.spell_level,
					isRitual: spell.ritual,
					isConcentration: spell.concentration,
					castingTime: spell.casting_time,
					range: spell.range,
					duration: spell.duration,
					description: spell.description,
					higherLevels: spell.higher_levels,
				},
				characterId,
				characterName: character?.name || "Character",
				jobName: character?.job || null,
				pathName: character?.path || null,
				level: character?.level || 1,
				campaignId: campaignId ?? null,
			});

			toast({
				title: result.success ? "Spell Cast" : "Cast Failed",
				description: result.message,
				variant: result.success ? undefined : "destructive",
			});
			return;
		}

		if (spell.spell_level === 0) {
			toast({
				title: "Cantrip Cast",
				description: `${displayName} is cast without using a spell slot.`,
			});
			return;
		}

		const slot = spellSlots.find(
			(slot) => slot.level === spell.spell_level && slot.current > 0,
		);
		if (!slot) {
			toast({
				title: "No Spell Slots Available",
				description: `You don't have any level ${spell.spell_level} spell slots available.`,
				variant: "destructive",
			});
			return;
		}

		if (campaignId) {
			rollInCampaign(campaignId, {
				dice_formula: "0",
				result: 0,
				rolls: [],
				roll_type: "ability",
				context: `Casts Spell: ${displayName} (Level ${spell.spell_level})`,
				character_id: characterId,
			});
		}

		recordRoll.mutate({
			dice_formula: "0",
			result: 0,
			rolls: [],
			roll_type: "ability",
			context: `Casts Spell: ${displayName} (Level ${spell.spell_level})`,
			campaign_id: campaignId ?? null,
			character_id: characterId,
		});
	};

	const handleRemove = async (spell: CharacterSpell) => {
		const displayName = formatRegentVernacular(spell.name);
		if (!confirm(`Remove ${displayName}?`)) return;
		await removeSpell.mutateAsync(spell.id);
		toast({
			title: "Removed",
			description: `${displayName} has been removed.`,
		});
	};

	const body = (
		<>
			<div className="space-y-4">
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
									<span className="font-semibold">
										{preparedCount} / {spellsPreparedLimit}
									</span>
									{isOverPreparedLimit && <AlertTriangle className="w-4 h-4" />}
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
									<span className="font-semibold">
										{knownCount} / {spellsKnownLimit}
									</span>
									{isOverKnownLimit && <AlertTriangle className="w-4 h-4" />}
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
									<span className="font-semibold">
										{cantripCount} / {cantripsKnownLimit}
									</span>
									{isOverCantripLimit && <AlertTriangle className="w-4 h-4" />}
								</div>
							)}
						</div>
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
						Add Spell
					</Button>
				</div>

				{spells.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<ScrollText className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>No spells yet</p>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setAddDialogOpen(true)}
							className="mt-4"
						>
							Add your first spell
						</Button>
					</div>
				) : filteredSpells.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						No spells match the current filters
					</div>
				) : (
					Object.entries(groupedSpells).map(([level, levelSpells]) => (
						<div key={level} className="space-y-2">
							<div className="text-sm font-heading text-muted-foreground">
								{level}
							</div>
							{levelSpells.map((spell) => {
								const displayName = formatRegentVernacular(spell.name);
								const displayDescription = spell.description
									? formatRegentVernacular(spell.description)
									: null;
								return (
									<div
										key={spell.id}
										className="p-3 rounded-lg border bg-muted/30"
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1 flex-wrap">
													<button
														type="button"
														className="text-left font-heading font-semibold hover:text-primary transition-colors"
														onClick={() =>
															onSelectDetail?.({
																title: displayName,
																description: spell.description || "",
																payload: spell,
															})
														}
													>
														{displayName}
													</button>
													{spell.is_prepared && (
														<Badge variant="default" className="text-xs">
															Prepared
														</Badge>
													)}
													{spell.source && (
														<Badge variant="outline" className="text-xs">
															{formatRegentVernacular(spell.source)}
														</Badge>
													)}
													{spell.uses_max !== null && (
														<Badge variant="secondary" className="text-xs">
															{spell.uses_current ?? 0}/{spell.uses_max}
														</Badge>
													)}
												</div>
												{displayDescription && (
													<div className="text-xs text-muted-foreground line-clamp-3">
														<AutoLinkText text={spell.description || ""} />
													</div>
												)}
											</div>
											<div className="flex items-center gap-2">
												<div className="flex items-center gap-2">
													<Checkbox
														id={`prepared-spell-${spell.id}`}
														checked={spell.is_prepared ?? false}
														onCheckedChange={() => handleTogglePrepared(spell)}
													/>
													<label
														htmlFor={`prepared-spell-${spell.id}`}
														className="text-xs cursor-pointer"
													>
														Prep
													</label>
												</div>
												{spell.is_prepared && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleCastSpell(spell)}
														className="text-xs"
													>
														Cast
													</Button>
												)}
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													onClick={() => handleRemove(spell)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					))
				)}
			</div>
			<AddSpellDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				characterId={characterId}
			/>
		</>
	);

	if (hideHeader) return body;
	return <AscendantWindow title="SPELLS">{body}</AscendantWindow>;
}
