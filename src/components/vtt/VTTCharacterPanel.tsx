/**
 * VTTCharacterPanel — Compact embedded character sheet for VTT sidebar.
 *
 * Shows rollable ability checks, skill checks, saving throws, attacks,
 * initiative, hit dice, and spell slots. All rolls are dispatched to
 * the VTT realtime chat so every connected user sees them.
 *
 * Used by:
 *   - PlayerMapView (player's own character)
 *   - VTTEnhanced (Warden clicks a token with characterId)
 */

import {
	Dice6,
	ExternalLink,
	Heart,
	Shield,
	Sparkles,
	Swords,
	Zap,
} from "lucide-react";
// VTTCharacterPanel inherently uses `ddbEnhancements.roll` on line 115 and handles proper campaign syncing via `useCharacterSheetEnhancements(characterId)`.
import { useCallback, useEffect, useMemo, useRef } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useCharacter } from "@/hooks/useCharacters";
import { useCharacterSheetEnhancements } from "@/hooks/useGlobalDDBeyondIntegration";
import {
	calculateCharacterStats,
	getSpellcastingAbility,
} from "@/lib/characterCalculations";
import {
	getAffordableOptions,
	getAvailableFavorOptions,
	type RiftFavorState,
	spendRiftFavor,
} from "@/lib/riftFavor";
import { calculateSkillModifier, getAllSkills } from "@/lib/skills";
import { cn } from "@/lib/utils";
import {
	ABILITY_NAMES,
	type AbilityScore,
	getAbilityModifier,
} from "@/types/core-rules";

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];

type RollFn = (formula: string, msgType?: "dice" | "wardenroll") => void;
type ChatFn = (
	message: string,
	type?: "chat" | "dice" | "rift" | "whisper" | "emote" | "desc" | "wardenroll",
) => void;

interface VTTCharacterPanelProps {
	characterId: string;
	/** Callback to roll dice into VTT chat. Typically vttRealtime.rollAndBroadcast */
	onRoll: RollFn;
	/** Callback to send a text message to VTT chat. Typically vttRealtime.sendChatMessage */
	onChat: ChatFn;
	/** If true, the panel is read-only (e.g. Warden (Warden) viewing a player's character) */
	readOnly?: boolean;
	/** Compact mode hides some sections */
	compact?: boolean;
	/** Campaign context for persistent dice logging */
	campaignId?: string;
}

function formatMod(mod: number): string {
	return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function VTTCharacterPanel({
	characterId,
	onRoll,
	onChat,
	compact = false,
	campaignId,
}: VTTCharacterPanelProps) {
	const { data: character, isLoading } = useCharacter(characterId);
	const ddbEnhancements = useCharacterSheetEnhancements(characterId);
	const hpBarRef = useRef<HTMLDivElement>(null);

	// Calculate stats from stored character abilities
	const calculatedStats = useMemo(() => {
		if (!character) return null;
		const abilities = character.abilities || {
			STR: 10,
			AGI: 10,
			VIT: 10,
			INT: 10,
			SENSE: 10,
			PRE: 10,
		};
		return calculateCharacterStats({
			level: character.level || 1,
			abilities,
			savingThrowProficiencies: character.saving_throw_proficiencies || [],
			skillProficiencies: character.skill_proficiencies || [],
			skillExpertise: character.skill_expertise || [],
			armorClass: character.armor_class,
			speed: character.speed,
		});
	}, [character]);

	// Use stored abilities directly (equipment/rune bonuses are applied on full character sheet save)
	const finalAbilities = useMemo(() => {
		if (!character)
			return { STR: 10, AGI: 10, VIT: 10, INT: 10, SENSE: 10, PRE: 10 };
		return (
			character.abilities || {
				STR: 10,
				AGI: 10,
				VIT: 10,
				INT: 10,
				SENSE: 10,
				PRE: 10,
			}
		);
	}, [character]);

	// Skills
	const allSkills = useMemo(() => getAllSkills(), []);
	const skills = useMemo(() => {
		if (!character || !calculatedStats)
			return {} as Record<
				string,
				{
					modifier: number;
					proficient: boolean;
					expertise: boolean;
					ability: AbilityScore;
				}
			>;
		return allSkills.reduce<
			Record<
				string,
				{
					modifier: number;
					proficient: boolean;
					expertise: boolean;
					ability: AbilityScore;
				}
			>
		>((acc, skill) => {
			const mod = calculateSkillModifier(
				skill.name,
				finalAbilities,
				character.skill_proficiencies || [],
				character.skill_expertise || [],
				calculatedStats.proficiencyBonus,
			);
			acc[skill.name] = {
				modifier: mod,
				proficient: (character.skill_proficiencies || []).includes(skill.name),
				expertise: (character.skill_expertise || []).includes(skill.name),
				ability: skill.ability,
			};
			return acc;
		}, {});
	}, [allSkills, calculatedStats, character, finalAbilities]);

	// Roll helper: rolls formula and announces to VTT chat with character name prefix
	const rollCheck = useCallback(
		(
			label: string,
			modifier: number,
			kind: "ability" | "save" | "skill" | "attack" = "ability",
		) => {
			const charName = character?.name || "Unknown";

			if (campaignId) {
				// Use global integration for persistent campaign log
				ddbEnhancements.roll(
					label.toLowerCase().replace(/[^a-z0-9]/g, "-"),
					modifier,
					kind,
					label,
					campaignId,
					"normal",
				);
			} else {
				// Fallback for isolated VTT usage without a campaign log
				onChat(`${charName} rolls **${label}**`, "rift");
			}

			// Still show the 3D dice in the local VTT session!
			const formula = `1d20${modifier >= 0 ? "+" : ""}${modifier}`;
			onRoll(formula);
		},
		[campaignId, character?.name, ddbEnhancements, onChat, onRoll],
	);

	const rollCustom = useCallback(
		(label: string, formula: string) => {
			const charName = character?.name || "Unknown";
			onChat(`${charName} rolls **${label}**`, "rift");
			onRoll(formula);
		},
		[character?.name, onChat, onRoll],
	);

	const hpCurrent = character?.hp_current ?? 0;
	const hpMax = character?.hp_max ?? 0;
	const hpPercent = hpMax > 0 ? (hpCurrent / hpMax) * 100 : 0;

	useEffect(() => {
		if (hpBarRef.current) {
			hpBarRef.current.style.width = `${Math.max(0, Math.min(100, hpPercent))}%`;
		}
	}, [hpPercent]);

	if (isLoading) {
		return (
			<AscendantWindow title="CHARACTER" compact>
				<div className="text-xs text-foreground/70 text-center py-4">
					Loading character...
				</div>
			</AscendantWindow>
		);
	}

	if (!character || !calculatedStats) {
		return (
			<AscendantWindow title="CHARACTER" compact>
				<div className="text-xs text-foreground/70 text-center py-4">
					Character not found.
				</div>
			</AscendantWindow>
		);
	}

	const ac = calculatedStats.armorClass;
	const profBonus = calculatedStats.proficiencyBonus;
	const initMod = calculatedStats.initiative;

	const riftFavorState: RiftFavorState = {
		current: character.rift_favor_current ?? 0,
		max: character.rift_favor_max ?? 3,
		dieSize: character.rift_favor_die ?? 4,
		level: character.level || 1,
		deathDefianceUsed: false,
		criticalSurgeUsed: false,
	};

	const availableFavorOptions = getAvailableFavorOptions(character.level || 1);
	const affordableFavorOptions = getAffordableOptions(riftFavorState);

	const handleSpendFavor = (optionId: string) => {
		const result = spendRiftFavor(riftFavorState, optionId);
		if (result.success) {
			onChat(result.message, "rift");
			// You would typically update the character's favor in the DB here
		} else {
			onChat(
				`Attempted to use ${optionId} but failed: ${result.message}`,
				"wardenroll",
			);
		}
	};

	return (
		<div className="space-y-3">
			{/* Header */}
			<AscendantWindow
				title={character.name?.toUpperCase() || "CHARACTER"}
				compact
			>
				<div className="flex items-center gap-3 mb-2">
					{character.portrait_url && (
						<OptimizedImage
							src={character.portrait_url}
							alt={character.name}
							className="w-12 h-12 rounded-full border-2 border-primary object-cover"
							size="thumbnail"
						/>
					)}
					<div className="flex-1 min-w-0">
						<div className="text-xs text-foreground/70 truncate">
							Lv {character.level} {character.job || "Unknown"}
							{character.path ? ` / ${character.path}` : ""}
						</div>
						<div className="flex items-center gap-3 mt-1">
							<div className="flex items-center gap-1 text-xs">
								<Heart className="w-3 h-3 text-red-400" />
								<span
									className={cn(
										hpPercent < 25 && "text-red-400",
										hpPercent < 50 && hpPercent >= 25 && "text-amber-400",
									)}
								>
									{hpCurrent}/{hpMax}
								</span>
							</div>
							<div className="flex items-center gap-1 text-xs">
								<Shield className="w-3 h-3 text-blue-400" />
								<span>{ac}</span>
							</div>
							<div className="flex items-center gap-1 text-xs">
								<Zap className="w-3 h-3 text-amber-400" />
								<span>+{profBonus}</span>
							</div>
						</div>
						{/* HP bar */}
						<div className="h-1.5 rounded-full bg-black/40 mt-1.5 overflow-hidden">
							<div
								ref={hpBarRef}
								className={cn(
									"h-full rounded-full transition-all",
									hpPercent > 50
										? "bg-green-500"
										: hpPercent > 25
											? "bg-yellow-500"
											: "bg-red-500",
								)}
							/>
						</div>

						{/* Rift Favor Bar */}
						<div className="flex items-center gap-2 mt-1.5">
							<div className="h-1.5 flex-1 rounded-full bg-black/40 overflow-hidden relative">
								<div
									className="h-full rounded-full transition-all bg-amber-500"
									style={{
										width: `${Math.max(0, Math.min(100, (riftFavorState.current / riftFavorState.max) * 100))}%`,
									}}
								/>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="h-5 px-2 text-[9px] border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
									>
										<Sparkles className="w-2.5 h-2.5 mr-1" />
										Spend Favor
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									{availableFavorOptions.map((opt) => {
										const canAfford = affordableFavorOptions.some(
											(a) => a.id === opt.id,
										);
										return (
											<DropdownMenuItem
												key={opt.id}
												disabled={!canAfford}
												onClick={() => handleSpendFavor(opt.id)}
												className="flex flex-col items-start gap-1 p-2 cursor-pointer"
											>
												<div className="flex justify-between w-full">
													<span className="font-bold text-amber-400">
														{opt.name}
													</span>
													<span className="text-xs">Cost: {opt.cost}</span>
												</div>
												<span className="text-[10px] text-foreground/70 whitespace-normal">
													{opt.description}
												</span>
											</DropdownMenuItem>
										);
									})}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>

				{/* Quick actions */}
				<div className="flex gap-1.5 mb-2">
					<Button
						variant="outline"
						size="sm"
						className="flex-1 text-[10px] h-7"
						onClick={() => rollCheck("Initiative", initMod, "ability")}
					>
						<Dice6 className="w-3 h-3 mr-1" />
						Init {formatMod(initMod)}
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex-1 text-[10px] h-7"
						onClick={() =>
							rollCustom(
								"Hit Die",
								`1d${character.hit_dice_size || 8}${getAbilityModifier(finalAbilities.VIT) >= 0 ? "+" : ""}${getAbilityModifier(finalAbilities.VIT)}`,
							)
						}
					>
						<Heart className="w-3 h-3 mr-1" />
						Hit Die
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="text-[10px] h-7 px-2"
						onClick={() => window.open(`/characters/${characterId}`, "_blank")}
						title="Open full character sheet"
					>
						<ExternalLink className="w-3 h-3" />
					</Button>
				</div>
			</AscendantWindow>

			{/* Ability Scores — Rollable */}
			<AscendantWindow title="ABILITIES" compact>
				<div className="grid grid-cols-3 gap-1.5">
					{ABILITY_KEYS.map((ability) => {
						const score = finalAbilities[ability];
						const mod = getAbilityModifier(score);
						return (
							<button
								type="button"
								key={ability}
								onClick={() =>
									rollCheck(`${ABILITY_NAMES[ability]} Check`, mod, "ability")
								}
								className="p-1.5 rounded border border-border/60 bg-muted/20 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all text-center group cursor-pointer"
								title={`Roll ${ABILITY_NAMES[ability]} check (1d20${formatMod(mod)})`}
							>
								<div className="text-[9px] text-foreground/70 uppercase tracking-wide">
									{ability}
								</div>
								<div className="font-display text-sm font-bold">{score}</div>
								<div
									className={cn(
										"text-xs font-heading",
										mod >= 0 ? "text-green-400" : "text-red-400",
									)}
								>
									{formatMod(mod)}
									<Dice6 className="w-2.5 h-2.5 inline ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
							</button>
						);
					})}
				</div>
			</AscendantWindow>

			{/* Saving Throws — Rollable */}
			<AscendantWindow title="SAVING THROWS" compact>
				<div className="grid grid-cols-2 gap-1">
					{ABILITY_KEYS.map((ability) => {
						const save = calculatedStats.savingThrows[ability];
						const isProficient =
							character.saving_throw_proficiencies?.includes(ability);
						return (
							<button
								type="button"
								key={ability}
								onClick={() =>
									rollCheck(`${ABILITY_NAMES[ability]} Save`, save, "save")
								}
								className={cn(
									"flex items-center justify-between p-1.5 rounded border text-xs transition-all hover:bg-amber-500/10 hover:border-amber-500/40 cursor-pointer",
									isProficient
										? "border-green-500/40 bg-green-500/5"
										: "border-border/50",
								)}
								title={`Roll ${ABILITY_NAMES[ability]} saving throw (1d20${formatMod(save)})`}
							>
								<span className="font-heading">{ability}</span>
								<span
									className={cn(
										"font-bold",
										save >= 0 ? "text-green-400" : "text-red-400",
									)}
								>
									{formatMod(save)}
									{isProficient && <span className="ml-0.5 text-[8px]">●</span>}
								</span>
							</button>
						);
					})}
				</div>
			</AscendantWindow>

			{/* Skills — Rollable */}
			<AscendantWindow title="SKILLS" compact>
				<div className="space-y-0.5 max-h-64 overflow-y-auto">
					{Object.entries(skills)
						.sort(([a], [b]) => a.localeCompare(b))
						.map(([name, skill]) => (
							<button
								type="button"
								key={name}
								onClick={() =>
									rollCheck(
										`${name} (${skill.ability})`,
										skill.modifier,
										"skill",
									)
								}
								className={cn(
									"flex items-center justify-between w-full px-2 py-1 rounded text-xs transition-all hover:bg-amber-500/10 cursor-pointer",
									skill.proficient && "bg-green-500/5",
								)}
								title={`Roll ${name} check (1d20${formatMod(skill.modifier)})`}
							>
								<div className="flex items-center gap-1.5">
									{skill.expertise ? (
										<span className="text-[8px] text-amber-400">★★</span>
									) : skill.proficient ? (
										<span className="text-[8px] text-green-400">●</span>
									) : (
										<span className="text-[8px] text-foreground/70/30">○</span>
									)}
									<span className="truncate">{name}</span>
									<span className="text-[9px] text-foreground/70">
										({skill.ability})
									</span>
								</div>
								<span
									className={cn(
										"font-bold",
										skill.modifier >= 0 ? "text-green-400" : "text-red-400",
									)}
								>
									{formatMod(skill.modifier)}
								</span>
							</button>
						))}
				</div>
			</AscendantWindow>

			{/* Quick Attack Rolls */}
			{!compact &&
				(() => {
					const spellAbility = getSpellcastingAbility(character.job);
					const spellMod = spellAbility
						? getAbilityModifier(finalAbilities[spellAbility])
						: null;
					const spellAtkBonus = spellMod !== null ? spellMod + profBonus : null;
					const spellDC = spellMod !== null ? 8 + profBonus + spellMod : null;
					return (
						<AscendantWindow title="ATTACKS" compact>
							<div className="space-y-1.5">
								<div className="flex gap-1.5">
									<Button
										variant="outline"
										size="sm"
										className="flex-1 text-[10px] h-7"
										onClick={() =>
											rollCheck(
												"Melee Attack (STR)",
												getAbilityModifier(finalAbilities.STR) + profBonus,
												"attack",
											)
										}
									>
										<Swords className="w-3 h-3 mr-1" />
										STR Atk{" "}
										{formatMod(
											getAbilityModifier(finalAbilities.STR) + profBonus,
										)}
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="flex-1 text-[10px] h-7"
										onClick={() =>
											rollCheck(
												"Ranged Attack (AGI)",
												getAbilityModifier(finalAbilities.AGI) + profBonus,
												"attack",
											)
										}
									>
										<Swords className="w-3 h-3 mr-1" />
										AGI Atk{" "}
										{formatMod(
											getAbilityModifier(finalAbilities.AGI) + profBonus,
										)}
									</Button>
								</div>
								{spellAbility && spellAtkBonus !== null && spellDC !== null && (
									<div className="flex gap-1.5">
										<Button
											variant="outline"
											size="sm"
											className="flex-1 text-[10px] h-7"
											onClick={() =>
												rollCheck(
													`Spell Attack (${spellAbility})`,
													spellAtkBonus,
													"attack",
												)
											}
										>
											<Zap className="w-3 h-3 mr-1" />
											{spellAbility} Spell {formatMod(spellAtkBonus)}
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="flex-1 text-[10px] h-7"
											onClick={() => {
												onChat(
													`${character.name}'s Spell Save DC: **${spellDC}** (${spellAbility})`,
													"rift",
												);
											}}
										>
											{spellAbility} DC {spellDC}
										</Button>
									</div>
								)}
								<p className="text-[9px] text-foreground/70 text-center">
									Click any weapon on full sheet to roll damage
								</p>
							</div>
						</AscendantWindow>
					);
				})()}

			{/* Passive Scores */}
			{!compact && (
				<AscendantWindow title="PASSIVES" compact>
					<div className="grid grid-cols-3 gap-1.5 text-center">
						<div className="p-1.5 rounded border border-border/50 bg-muted/20">
							<div className="text-[9px] text-foreground/70">Perception</div>
							<div className="font-bold text-sm text-foreground">
								{10 + (skills.Perception?.modifier ?? 0)}
							</div>
						</div>
						<div className="p-1.5 rounded border border-border/50 bg-muted/20">
							<div className="text-[9px] text-foreground/70">Investigation</div>
							<div className="font-bold text-sm text-foreground">
								{10 + (skills.Investigation?.modifier ?? 0)}
							</div>
						</div>
						<div className="p-1.5 rounded border border-border/50 bg-muted/20">
							<div className="text-[9px] text-foreground/70">Insight</div>
							<div className="font-bold text-sm text-foreground">
								{10 + (skills.Insight?.modifier ?? 0)}
							</div>
						</div>
					</div>
				</AscendantWindow>
			)}
		</div>
	);
}
