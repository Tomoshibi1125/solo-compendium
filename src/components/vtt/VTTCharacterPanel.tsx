/**
 * VTTCharacterPanel — Compact embedded character sheet for VTT sidebar.
 *
 * Shows rollable ability checks, skill checks, saving throws, attacks,
 * initiative, hit dice, and spell slots. All rolls are dispatched to
 * the VTT realtime chat so every connected user sees them.
 *
 * Used by:
 *   - PlayerMapView (player's own character)
 *   - VTTEnhanced (DM clicks a token with characterId)
 */

import { Dice6, ExternalLink, Heart, Shield, Swords, Zap } from "lucide-react";
// VTTCharacterPanel inherently uses `ddbEnhancements.roll` on line 115 and handles proper campaign syncing via `useCharacterSheetEnhancements(characterId)`.
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { useCharacter } from "@/hooks/useCharacters";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import {
	calculateCharacterStats,
	getSpellcastingAbility,
} from "@/lib/characterCalculations";
import { calculateSkillModifier, getAllSkills } from "@/lib/skills";
import { cn } from "@/lib/utils";
import {
	ABILITY_NAMES,
	type AbilityScore,
	getAbilityModifier,
} from "@/types/system-rules";

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];

type RollFn = (formula: string, msgType?: "dice" | "gmroll") => void;
type ChatFn = (
	message: string,
	type?: "chat" | "dice" | "system" | "whisper" | "emote" | "desc" | "gmroll",
) => void;

interface VTTCharacterPanelProps {
	characterId: string;
	/** Callback to roll dice into VTT chat. Typically vttRealtime.rollAndBroadcast */
	onRoll: RollFn;
	/** Callback to send a text message to VTT chat. Typically vttRealtime.sendChatMessage */
	onChat: ChatFn;
	/** If true, the panel is read-only (e.g. DM viewing a player's character) */
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
	readOnly = false,
	compact = false,
	campaignId,
}: VTTCharacterPanelProps) {
	const { data: character, isLoading } = useCharacter(characterId);
	const { useCharacterSheetEnhancements } = useGlobalDDBeyondIntegration();
	const ddbEnhancements = useCharacterSheetEnhancements(characterId);

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
				onChat(`${charName} rolls **${label}**`, "system");
			}

			// Still show the 3D dice in the local VTT session!
			const formula = `1d20${modifier >= 0 ? "+" : ""}${modifier}`;
			onRoll(formula);
		},
		[campaignId, character?.name, characterId, ddbEnhancements, onChat, onRoll],
	);

	const rollCustom = useCallback(
		(label: string, formula: string) => {
			const charName = character?.name || "Unknown";
			onChat(`${charName} rolls **${label}**`, "system");
			onRoll(formula);
		},
		[character?.name, onChat, onRoll],
	);

	if (isLoading) {
		return (
			<SystemWindow title="CHARACTER" compact>
				<div className="text-xs text-muted-foreground text-center py-4">
					Loading character...
				</div>
			</SystemWindow>
		);
	}

	if (!character || !calculatedStats) {
		return (
			<SystemWindow title="CHARACTER" compact>
				<div className="text-xs text-muted-foreground text-center py-4">
					Character not found.
				</div>
			</SystemWindow>
		);
	}

	const hpCurrent = character.hp_current ?? 0;
	const hpMax = character.hp_max ?? 0;
	const hpPercent = hpMax > 0 ? (hpCurrent / hpMax) * 100 : 0;
	const ac = calculatedStats.armorClass;
	const profBonus = calculatedStats.proficiencyBonus;
	const initMod = calculatedStats.initiative;

	return (
		<div className="space-y-3">
			{/* Header */}
			<SystemWindow
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
						<div className="text-xs text-muted-foreground truncate">
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
								className="h-full rounded-full transition-all"
								style={{
									width: `${Math.max(0, Math.min(100, hpPercent))}%`,
									backgroundColor:
										hpPercent > 50
											? "#22c55e"
											: hpPercent > 25
												? "#eab308"
												: "#ef4444",
								}}
							/>
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
			</SystemWindow>

			{/* Ability Scores — Rollable */}
			<SystemWindow title="ABILITIES" compact>
				<div className="grid grid-cols-3 gap-1.5">
					{ABILITY_KEYS.map((ability) => {
						const score = finalAbilities[ability];
						const mod = getAbilityModifier(score);
						return (
							<button
								key={ability}
								onClick={() =>
									rollCheck(`${ABILITY_NAMES[ability]} Check`, mod, "ability")
								}
								className="p-1.5 rounded border border-border/60 bg-muted/20 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all text-center group cursor-pointer"
								title={`Roll ${ABILITY_NAMES[ability]} check (1d20${formatMod(mod)})`}
							>
								<div className="text-[9px] text-muted-foreground uppercase tracking-wide">
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
			</SystemWindow>

			{/* Saving Throws — Rollable */}
			<SystemWindow title="SAVING THROWS" compact>
				<div className="grid grid-cols-2 gap-1">
					{ABILITY_KEYS.map((ability) => {
						const save = calculatedStats.savingThrows[ability];
						const isProficient =
							character.saving_throw_proficiencies?.includes(ability);
						return (
							<button
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
			</SystemWindow>

			{/* Skills — Rollable */}
			<SystemWindow title="SKILLS" compact>
				<div className="space-y-0.5 max-h-64 overflow-y-auto">
					{Object.entries(skills)
						.sort(([a], [b]) => a.localeCompare(b))
						.map(([name, skill]) => (
							<button
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
										<span className="text-[8px] text-muted-foreground/30">
											○
										</span>
									)}
									<span className="truncate">{name}</span>
									<span className="text-[9px] text-muted-foreground">
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
			</SystemWindow>

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
						<SystemWindow title="ATTACKS" compact>
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
													"system",
												);
											}}
										>
											{spellAbility} DC {spellDC}
										</Button>
									</div>
								)}
								<p className="text-[9px] text-muted-foreground text-center">
									Click any weapon on full sheet to roll damage
								</p>
							</div>
						</SystemWindow>
					);
				})()}

			{/* Passive Scores */}
			{!compact && (
				<SystemWindow title="PASSIVES" compact>
					<div className="grid grid-cols-3 gap-1.5 text-center">
						<div className="p-1.5 rounded border border-border/50 bg-muted/20">
							<div className="text-[9px] text-muted-foreground">Perception</div>
							<div className="font-bold text-sm text-foreground">
								{10 + (skills["Perception"]?.modifier ?? 0)}
							</div>
						</div>
						<div className="p-1.5 rounded border border-border/50 bg-muted/20">
							<div className="text-[9px] text-muted-foreground">
								Investigation
							</div>
							<div className="font-bold text-sm text-foreground">
								{10 + (skills["Investigation"]?.modifier ?? 0)}
							</div>
						</div>
						<div className="p-1.5 rounded border border-border/50 bg-muted/20">
							<div className="text-[9px] text-muted-foreground">Insight</div>
							<div className="font-bold text-sm text-foreground">
								{10 + (skills["Insight"]?.modifier ?? 0)}
							</div>
						</div>
					</div>
				</SystemWindow>
			)}
		</div>
	);
}
