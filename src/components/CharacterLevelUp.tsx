import { ArrowUp, Heart, Shield, Star, Trophy, Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCharacter } from "@/hooks/useCharacters";
import type { LevelingMode } from "@/lib/campaignSettings";
import { getProficiencyBonus, getSystemFavorDie } from "@/types/system-rules";
import { LevelUpWizardModal } from "./character/LevelUpWizardModal";

// System Ascendant experience thresholds by level (index = level, value = total XP needed)
const XP_THRESHOLDS = [
	0, 0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
	120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
];

function getXPForNextLevel(currentLevel: number): number {
	const nextLevel = Math.min(currentLevel + 1, 20);
	return XP_THRESHOLDS[nextLevel] ?? Infinity;
}

interface CharacterLevelUpProps {
	characterId: string;
	onLevelUp?: () => void;
	levelingMode?: LevelingMode;
}

export function CharacterLevelUp({
	characterId,
	onLevelUp,
	levelingMode,
}: CharacterLevelUpProps) {
	const { data: character } = useCharacter(characterId);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const mode = levelingMode ?? "milestone";
	const isMilestone = mode === "milestone";

	if (!character) return null;

	const level = character.level ?? 1;
	const currentXP = character.experience ?? 0;
	const xpNeeded = getXPForNextLevel(level);
	const canLevelUp = level < 20 && (isMilestone || currentXP >= xpNeeded);
	const profBonus = getProficiencyBonus(level);
	const systemFavorDie = getSystemFavorDie(level);
	const hitDieSize = character.hit_dice_size ?? 8;
	const xpProgress = isMilestone
		? 100
		: Math.min(100, (currentXP / xpNeeded) * 100);

	const handleLevelUp = () => {
		setIsModalOpen(true);
	};

	return (
		<>
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-base">
						<ArrowUp className="w-5 h-5" />
						Advancement
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Level & XP */}
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-display font-semibold">
								Level {level}
							</h3>
							<p className="text-sm text-muted-foreground">
								{isMilestone
									? "Milestone advancement"
									: `${currentXP.toLocaleString()} / ${xpNeeded.toLocaleString()} XP`}
							</p>
						</div>
						<Button onClick={handleLevelUp} disabled={!canLevelUp} size="sm">
							<Trophy className="w-4 h-4 mr-2" />
							Level Up
						</Button>
					</div>

					{/* XP Progress Bar (XP mode only) */}
					{!isMilestone && <Progress value={xpProgress} className="h-2" />}

					{/* 5e Core Stats Grid */}
					<div className="grid grid-cols-4 gap-3">
						<div className="text-center">
							<div className="flex items-center justify-center mb-1">
								<Star className="w-4 h-4 text-primary" />
							</div>
							<div className="text-lg font-display font-bold">+{profBonus}</div>
							<div className="text-xs text-muted-foreground">Proficiency</div>
						</div>
						<div className="text-center">
							<div className="flex items-center justify-center mb-1">
								<Heart className="w-4 h-4 text-red-400" />
							</div>
							<div className="text-lg font-display font-bold">
								d{hitDieSize}
							</div>
							<div className="text-xs text-muted-foreground">Hit Die</div>
						</div>
						<div className="text-center">
							<div className="flex items-center justify-center mb-1">
								<Shield className="w-4 h-4 text-blue-400" />
							</div>
							<div className="text-lg font-display font-bold">
								{character.armor_class ?? 10}
							</div>
							<div className="text-xs text-muted-foreground">AC</div>
						</div>
						<div className="text-center">
							<div className="flex items-center justify-center mb-1">
								<Zap className="w-4 h-4 text-yellow-400" />
							</div>
							<div className="text-lg font-display font-bold">
								d{systemFavorDie}
							</div>
							<div className="text-xs text-muted-foreground">Favor Die</div>
						</div>
					</div>

					{/* Status Badges */}
					<div className="flex flex-wrap gap-2">
						{isMilestone && (
							<Badge variant="outline" className="text-xs">
								Milestone — advance at Warden discretion
							</Badge>
						)}
						{!isMilestone && canLevelUp && (
							<Badge className="text-xs bg-primary">Ready to level up!</Badge>
						)}
						{level >= 20 && (
							<Badge variant="secondary" className="text-xs">
								Max Level
							</Badge>
						)}
					</div>
				</CardContent>
			</Card>

			<LevelUpWizardModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					if (onLevelUp) onLevelUp();
				}}
				characterId={characterId}
			/>
		</>
	);
}

export default CharacterLevelUp;
