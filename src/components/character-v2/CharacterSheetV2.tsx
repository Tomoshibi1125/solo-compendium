import { Sun, Zap } from "lucide-react";
import { type ReactNode, useState } from "react";
import { ConcentrationBanner } from "@/components/CharacterSheet/ConcentrationBanner";
import { ConditionBadgeBar } from "@/components/CharacterSheet/ConditionBadgeBar";
import { ShortRestDialog } from "@/components/CharacterSheet/ShortRestDialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DerivedStats } from "@/hooks/useCharacterDerivedStats";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";
import type { CharacterResources } from "@/lib/characterResources";
import { calculateTotalTempHP } from "@/lib/characterResources";
import type { AbilityScore } from "@/types/system-rules";
import { AbilityScoreStrip } from "./AbilityScoreStrip";
import { ProficiencySidebar } from "./ProficiencySidebar";
import { StatusHeader } from "./StatusHeader";

interface CharacterSheetV2Props {
	character: CharacterWithAbilities;
	stats: DerivedStats;
	characterResources: CharacterResources;
	displayNames: {
		job?: string;
		path?: string;
		background?: string;
	};
	isReadOnly?: boolean;
	actions: ReactNode;
	powers: ReactNode;
	inventory: ReactNode;
	features: ReactNode;
	bio: ReactNode;
	quests: ReactNode;
	extras: ReactNode;
	onRollAbility: (ability: AbilityScore) => void;
	onRollSave: (ability: AbilityScore) => void;
	onRollSkill: (skill: string) => void;
	onRollInitiative: () => void;
	onRollHitDice: () => void;
	onHPClick: () => void;
	onACClick: () => void;
	onShortRest: (totalRecovered: number, hitDiceSpent: number) => void;
	onLongRest: () => void;
	onLevelUp: () => void;
	onResourceAdjust: (
		field: "hit_dice_current" | "system_favor_current",
		delta: number,
	) => void;
	onExhaustionChange: (delta: number) => void;
	onAddCondition: (condition: string) => void;
	onRemoveCondition: (condition: string) => void;
	concentration: {
		isConcentrating: boolean;
		effectName?: string;
		remainingRounds?: number;
		onDrop: () => void;
	};
}

export function CharacterSheetV2({
	character,
	stats,
	characterResources,
	displayNames,
	isReadOnly,
	actions,
	powers,
	inventory,
	features,
	bio,
	quests,
	extras,
	onRollAbility,
	onRollSave,
	onRollSkill,
	onRollInitiative,
	onRollHitDice,
	onHPClick,
	onACClick,
	onShortRest,
	onLongRest,
	onLevelUp,
	onResourceAdjust,
	onExhaustionChange,
	onAddCondition,
	onRemoveCondition,
	concentration,
}: CharacterSheetV2Props) {
	const [activeTab, setActiveTab] = useState("actions");

	// ───────────────────────────────────────────────────────────────────────────
	// UI Header & Actions (Unified from CharacterSheet.tsx)
	// ───────────────────────────────────────────────────────────────────────────

	const characterHeader = (
		<div className="relative overflow-hidden bg-obsidian-charcoal/40 border border-primary/20 backdrop-blur-md rounded-[2px] p-1 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
			<div className="relative z-10 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-primary/10">
				{/* Portrait & Basic Identity */}
				<div className="p-4 flex items-center gap-6 bg-black/40">
					<div className="relative group">
						<div className="w-20 h-20 rounded-[2px] border-2 border-primary/30 overflow-hidden bg-obsidian-charcoal relative">
							{character.portrait_url ? (
								<img
									src={character.portrait_url}
									alt={character.name}
									className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center bg-primary/5">
									<span className="text-4xl font-display text-primary/20">
										{character.name[0]}
									</span>
								</div>
							)}
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
						</div>
						{/* Rank Badge */}
						<div
							className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 flex flex-col items-center justify-center font-display font-bold text-sm bg-obsidian-charcoal z-20 ${
								character.level >= 17
									? "border-gate-s text-gate-s shadow-[0_0_10px_rgba(var(--gate-s-rgb),0.5)]"
									: character.level >= 13
										? "border-gate-a text-gate-a"
										: character.level >= 9
											? "border-gate-b text-gate-b"
											: character.level >= 5
												? "border-gate-c text-gate-c"
												: character.level >= 2
													? "border-gate-d text-gate-d"
													: "border-gate-e text-gate-e"
							}`}
						>
							<span className="text-[7px] leading-none text-primary/40 -mb-0.5">
								RANK
							</span>
							<span>
								{character.level >= 17
									? "S"
									: character.level >= 13
										? "A"
										: character.level >= 9
											? "B"
											: character.level >= 5
												? "C"
												: character.level >= 2
													? "D"
													: "E"}
							</span>
						</div>
					</div>

					<div className="flex flex-col">
						<h1 className="text-2xl font-display font-bold text-white tracking-tight drop-shadow-sm">
							{character.name}
						</h1>
						<div className="flex items-center gap-2 mt-1">
							<span className="text-[10px] font-mono text-primary/60 uppercase tracking-widest bg-primary/10 px-1.5 py-0.5 rounded-[1px]">
								{displayNames.job || "Unawakened"}
							</span>
							{displayNames.path && (
								<>
									<span className="text-primary/30">/</span>
									<span className="text-[10px] font-mono text-primary/40 uppercase tracking-widest">
										{displayNames.path}
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Level & XP Progress Section */}
				<div className="flex-1 p-4 bg-black/20 flex flex-col justify-center">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-3">
							<span className="text-xs font-mono text-primary/50 uppercase tracking-widest">
								PROGRESS_LEVEL
							</span>
							<span className="text-2xl font-display font-bold text-white leading-none">
								{character.level}
							</span>
						</div>
						<span className="text-[10px] font-mono text-primary/40 tracking-[0.2em]">
							{character.experience || 0} / 1000 XP
						</span>
					</div>
					<div className="relative h-1.5 w-full bg-black border border-primary/10 overflow-hidden">
						<Progress
							value={(Number(character.experience) || 0) % 1000}
							max={1000}
							className="h-full bg-primary/40"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_infinite]" />
					</div>
				</div>

				{/* Quick Actions Panel */}
				{!isReadOnly && (
					<div className="p-4 flex items-center gap-3 bg-primary/5 min-w-[200px]">
						<ShortRestDialog
							hitDiceAvailable={character.hit_dice_current}
							hitDiceMax={character.hit_dice_max}
							hitDieSize={character.hit_dice_size}
							vitScore={stats.finalAbilities.VIT}
							hpCurrent={character.hp_current}
							hpMax={character.hp_max}
							onFinishRest={onShortRest}
						/>
						<Button
							variant="outline"
							size="sm"
							onClick={onLongRest}
							className="h-8 border-primary/20 bg-black/20 hover:bg-primary/10 transition-colors uppercase font-mono text-[10px] tracking-widest"
						>
							<Sun className="w-3 h-3 mr-1.5 text-orange-400" />
							Long Rest
						</Button>
						{character.level < 20 && (
							<Button
								variant="default"
								size="sm"
								onClick={onLevelUp}
								className="h-8 shadow-[0_0_15px_rgba(var(--primary),0.3)] uppercase font-mono text-[10px] tracking-widest"
							>
								<Zap className="w-3 h-3 mr-1.5" />
								Level Up
							</Button>
						)}
					</div>
				)}
			</div>
			{/* Scanner Line Animation */}
			<div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20 animate-[scan_4s_linear_infinite] pointer-events-none" />
		</div>
	);

	return (
		<div className="flex flex-col gap-6 animate-in fade-in duration-500">
			{/* Unified Header */}
			{characterHeader}

			{/* Concentration & Conditions */}
			{concentration.isConcentrating && (
				<ConcentrationBanner
					isConcentrating={concentration.isConcentrating}
					effectName={concentration.effectName}
					remainingRounds={concentration.remainingRounds}
					onDrop={concentration.onDrop}
				/>
			)}

			{((character.conditions && character.conditions.length > 0) ||
				character.exhaustion_level > 0) &&
				!isReadOnly && (
					<ConditionBadgeBar
						conditions={character.conditions || []}
						exhaustionLevel={character.exhaustion_level}
						onClearExhaustion={() =>
							onExhaustionChange(-character.exhaustion_level)
						}
						onAddCondition={onAddCondition}
						onRemoveCondition={onRemoveCondition}
					/>
				)}

			{/* Desktop 3-Column Layout */}
			<div className="hidden md:grid grid-cols-[120px_300px_1fr] gap-8 items-start">
				{/* COLUMN 1: Ability Scores (Vertical) */}
				<aside className="sticky top-16 pt-4 space-y-4">
					<AbilityScoreStrip
						abilities={character.abilities}
						modifiers={stats.calculatedStats.abilityModifiers}
						savingThrowProficiencies={
							character.saving_throw_proficiencies || []
						}
						onRoll={onRollAbility}
					/>
				</aside>

				{/* COLUMN 2: Proficiencies (Vertical) */}
				<aside className="sticky top-16 pt-4 space-y-4 h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-none hover:scrollbar-thin scrollbar-thumb-primary/20">
					<ProficiencySidebar
						saves={stats.calculatedStats.savingThrows}
						skills={stats.skills}
						allSkills={stats.allSkills}
						savingThrowProficiences={character.saving_throw_proficiencies || []}
						onRollSave={onRollSave}
						onRollSkill={onRollSkill}
					/>
				</aside>

				{/* COLUMN 3: Main Status & Tabs */}
				<div className="flex-1 space-y-6 pt-4">
					{/* Top Status Bar (Desktop Only) */}
					<StatusHeader
						hp={{
							current: character.hp_current,
							max: character.hp_max,
							temp: calculateTotalTempHP(characterResources),
						}}
						ac={stats.calculatedStats.armorClass}
						initiative={stats.finalInitiative}
						speed={stats.finalSpeed}
						hitDice={{
							current: character.hit_dice_current,
							max: character.hit_dice_max,
							size: character.hit_dice_size,
						}}
						systemFavor={{
							current: character.system_favor_current,
							max: character.system_favor_max,
							die: character.system_favor_die,
						}}
						onRollInitiative={onRollInitiative}
						onRollHitDice={onRollHitDice}
						onHPClick={onHPClick}
						onACClick={onACClick}
						onAdjustResource={onResourceAdjust}
					/>

					{/* Interaction Tabs */}
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="bg-obsidian-charcoal/40 border border-primary/20 rounded-[2px] backdrop-blur-md p-4 min-h-[600px]"
					>
						<TabsList className="flex bg-transparent border-b border-primary/10 w-full justify-start gap-6 rounded-none h-12 mb-4 px-2 overflow-x-auto scrollbar-none">
							<TabsTrigger
								value="actions"
								className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all"
							>
								Actions
							</TabsTrigger>
							<TabsTrigger
								value="powers"
								className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all"
							>
								Powers
							</TabsTrigger>
							<TabsTrigger
								value="inventory"
								className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all"
							>
								Items
							</TabsTrigger>
							<TabsTrigger
								value="features"
								className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all"
							>
								Features
							</TabsTrigger>
							<TabsTrigger
								value="bio"
								className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all"
							>
								Description
							</TabsTrigger>
							<TabsTrigger
								value="quests"
								className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all"
							>
								Notes
							</TabsTrigger>
							<TabsTrigger
								value="extras"
								className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all"
							>
								Extras
							</TabsTrigger>
						</TabsList>

						<TabsContent value="actions" className="mt-0 outline-none">
							{actions}
						</TabsContent>
						<TabsContent value="powers" className="mt-0 outline-none">
							{powers}
						</TabsContent>
						<TabsContent value="inventory" className="mt-0 outline-none">
							{inventory}
						</TabsContent>
						<TabsContent value="features" className="mt-0 outline-none">
							{features}
						</TabsContent>
						<TabsContent value="bio" className="mt-0 outline-none">
							{bio}
						</TabsContent>
						<TabsContent value="quests" className="mt-0 outline-none">
							{quests}
						</TabsContent>
						<TabsContent value="extras" className="mt-0 outline-none">
							{extras}
						</TabsContent>
					</Tabs>
				</div>
			</div>

			{/* Mobile Layout (Single Column with Bottom HUD managed by MainLayout) */}
			<div className="md:hidden space-y-6 pb-20">
				<StatusHeader
					hp={{
						current: character.hp_current,
						max: character.hp_max,
						temp: calculateTotalTempHP(characterResources),
					}}
					ac={stats.calculatedStats.armorClass}
					initiative={stats.finalInitiative}
					speed={stats.finalSpeed}
					hitDice={{
						current: character.hit_dice_current,
						max: character.hit_dice_max,
						size: character.hit_dice_size,
					}}
					systemFavor={{
						current: character.system_favor_current,
						max: character.system_favor_max,
						die: character.system_favor_die,
					}}
					onRollInitiative={onRollInitiative}
					onRollHitDice={onRollHitDice}
					onHPClick={onHPClick}
					onACClick={onACClick}
					onAdjustResource={onResourceAdjust}
				/>

				<Tabs defaultValue="actions" className="w-full">
					<TabsList className="grid w-full grid-cols-5 h-12 bg-obsidian-charcoal/60 border-t border-primary/20 rounded-none sticky top-16 z-20">
						<TabsTrigger
							value="actions"
							className="text-[10px] uppercase font-mono"
						>
							Combat
						</TabsTrigger>
						<TabsTrigger
							value="powers"
							className="text-[10px] uppercase font-mono"
						>
							Spells
						</TabsTrigger>
						<TabsTrigger
							value="inventory"
							className="text-[10px] uppercase font-mono"
						>
							Items
						</TabsTrigger>
						<TabsTrigger
							value="features"
							className="text-[10px] uppercase font-mono"
						>
							Feats
						</TabsTrigger>
						<TabsTrigger
							value="stats"
							className="text-[10px] uppercase font-mono"
						>
							Stats
						</TabsTrigger>
					</TabsList>

					<TabsContent value="actions">{actions}</TabsContent>
					<TabsContent value="powers">{powers}</TabsContent>
					<TabsContent value="inventory">{inventory}</TabsContent>
					<TabsContent value="features">{features}</TabsContent>
					<TabsContent value="stats" className="space-y-6 pt-4">
						<AbilityScoreStrip
							abilities={character.abilities}
							modifiers={stats.calculatedStats.abilityModifiers}
							savingThrowProficiencies={
								character.saving_throw_proficiencies || []
							}
							onRoll={onRollAbility}
						/>
						<ProficiencySidebar
							saves={stats.calculatedStats.savingThrows}
							skills={stats.skills}
							allSkills={stats.allSkills}
							savingThrowProficiences={
								character.saving_throw_proficiencies || []
							}
							onRollSave={onRollSave}
							onRollSkill={onRollSkill}
						/>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
