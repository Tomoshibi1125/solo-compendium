import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth/authContext";
import type { CustomModifier } from "@/lib/customModifiers";
import { resolveAdvantageForRoll } from "@/lib/rollAdvantage";
import { ABILITY_NAMES, type AbilityScore } from "@/types/system-rules";
import {
	AbilityRollButton,
	InlineRollButton,
	SaveRollButton,
	SkillRollButton,
} from "./InlineRollButton";

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];

interface CharacterRollsPanelProps {
	characterId: string;
	characterName: string;
	abilities: Record<string, number>;
	proficiencyBonus: number;
	savingThrowProficiencies: string[];
	skills: Array<{
		name: string;
		ability: string;
		proficiency: string;
	}>;
	campaignId?: string;
	conditions?: string[];
	exhaustionLevel?: number;
	customModifiers?: CustomModifier[];
	className?: string;
}

export function CharacterRollsPanel({
	characterId,
	characterName,
	abilities,
	proficiencyBonus,
	savingThrowProficiencies,
	skills,
	campaignId,
	conditions = [],
	exhaustionLevel = 0,
	customModifiers = [],
	className,
}: CharacterRollsPanelProps) {
	const { user } = useAuth();

	if (!user) {
		return null;
	}

	// Calculate ability modifiers
	const getAbilityModifier = (ability: number) =>
		Math.floor((ability - 10) / 2);

	// Calculate saving throw modifiers
	const getSaveModifier = (ability: string) => {
		const baseMod = getAbilityModifier(abilities[ability.toLowerCase()] || 10);
		const isProficient = savingThrowProficiencies?.includes(
			ability.toLowerCase(),
		);
		const totalMod = baseMod + (isProficient ? proficiencyBonus : 0);

		// Apply feature-based save bonuses
		let featureBonus = 0;
		for (const modifier of customModifiers) {
			if (modifier.enabled && modifier.type === "save_bonus") {
				const target = modifier.target?.toLowerCase();
				if (
					target === "all" ||
					target === ability.toLowerCase() ||
					target === `${ability.toLowerCase()}_mod`
				) {
					featureBonus += modifier.value;
				}
			}
		}
		return totalMod + featureBonus;
	};

	// Calculate skill modifiers
	const getSkillModifier = (skill: { name: string; ability?: string; proficiency?: string } | undefined | null) => {
		if (!skill || !skill.ability || !skill.name) return 0;

		const abilityMod = getAbilityModifier(
			abilities[skill.ability.toLowerCase()] || 10,
		);
		let baseMod = abilityMod;

		if (skill.proficiency === "proficient") {
			baseMod += proficiencyBonus;
		} else if (skill.proficiency === "expertise") {
			baseMod += proficiencyBonus * 2;
		}

		// Apply feature-based skill/attack bonuses
		let featureBonus = 0;
		for (const modifier of customModifiers) {
			if (modifier.enabled) {
				const target = modifier.target?.toLowerCase();
				if (modifier.type === "bonus" || modifier.type === "skill_bonus") {
					if (
						target === skill.name.toLowerCase() ||
						target === `skill:${skill.name.toLowerCase()}`
					) {
						featureBonus += modifier.value;
					}
				}
				if (
					modifier.type === "expertise" &&
					(target === skill.name.toLowerCase() ||
						target === `skill:${skill.name.toLowerCase()}`)
				) {
					// If not already expertise, add another proficiency bonus
					if (skill.proficiency !== "expertise") {
						featureBonus += proficiencyBonus;
					}
				}
			}
		}

		return baseMod + featureBonus;
	};

	const getSaveRollType = (ability: AbilityScore) => {
		switch (ability) {
			case "STR":
				return "STR_saves" as const;
			case "AGI":
				return "AGI_saves" as const;
			case "VIT":
				return "VIT_saves" as const;
			case "INT":
				return "INT_saves" as const;
			case "SENSE":
				return "SENSE_saves" as const;
			case "PRE":
				return "PRE_saves" as const;
			default:
				return "saving_throws" as const;
		}
	};

	const resolveAdv = (params: {
		rollType: Parameters<typeof resolveAdvantageForRoll>[0]["rollType"];
		targets: Array<string | null | undefined>;
	}) => {
		return resolveAdvantageForRoll({
			conditions,
			exhaustionLevel,
			rollType: params.rollType,
			customModifiers,
			customTargets: params.targets,
		});
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="text-lg">Quick Rolls</CardTitle>
				<p className="text-sm text-muted-foreground">
					One-click rolls with auto-populated modifiers
					{campaignId && (
						<Badge variant="secondary" className="ml-2">
							Campaign: {campaignId}
						</Badge>
					)}
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Ability Checks */}
				<div>
					<h4 className="font-medium mb-2">Ability Checks</h4>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
						{ABILITY_KEYS.map((ability) => (
							<AbilityRollButton
								key={ability}
								characterId={characterId}
								characterName={characterName}
								rollKey={ability.toLowerCase()}
								label={ability}
								modifier={getAbilityModifier(
									abilities[ability.toLowerCase()] || abilities[ability] || 10,
								)}
								campaignId={campaignId}
								advantageState={resolveAdv({
									rollType: "ability_checks",
									targets: [
										"ability_checks",
										`ability:${ability.toLowerCase()}`,
										ability,
									],
								})}
							/>
						))}
					</div>
				</div>

				<Separator />

				{/* Saving Throws */}
				<div>
					<h4 className="font-medium mb-2">Saving Throws</h4>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
						{ABILITY_KEYS.map((ability) => (
							<SaveRollButton
								key={ability}
								characterId={characterId}
								characterName={characterName}
								rollKey={ability.toLowerCase()}
								label={ABILITY_NAMES[ability]}
								modifier={getSaveModifier(ability)}
								campaignId={campaignId}
								advantageState={resolveAdv({
									rollType: getSaveRollType(ability),
									targets: [
										"saving_throws",
										getSaveRollType(ability),
										`save:${ability.toLowerCase()}`,
										ability,
									],
								})}
							/>
						))}
					</div>
				</div>

				<Separator />

				{/* Skills */}
				<div>
					<h4 className="font-medium mb-2">Skills</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						{skills?.map((skill: { name: string; ability: string; proficiency?: string }) => (
							<SkillRollButton
								key={skill.name}
								characterId={characterId}
								characterName={characterName}
								rollKey={skill.name}
								label={skill.name}
								modifier={getSkillModifier(skill)}
								campaignId={campaignId}
								advantageState={resolveAdv({
									rollType: "ability_checks",
									targets: [
										"ability_checks",
										`skill:${skill.name.toLowerCase()}`,
										skill.name,
									],
								})}
							/>
						))}
					</div>
				</div>

				<Separator />

				{/* Common Actions */}
				<div>
					<h4 className="font-medium mb-2">Common Actions</h4>
					<div className="flex flex-wrap gap-2">
						<InlineRollButton
							characterId={characterId}
							characterName={characterName}
							rollType="ability"
							rollKey="initiative"
							label="Initiative"
							modifier={getAbilityModifier(
								abilities.agi || abilities.AGI || 10,
							)}
							campaignId={campaignId}
							advantageState={resolveAdv({
								rollType: "ability_checks",
								targets: ["initiative", "ability_checks"],
							})}
						/>
						<InlineRollButton
							characterId={characterId}
							characterName={characterName}
							rollType="ability"
							rollKey="perception"
							label="Perception"
							modifier={getSkillModifier(
								skills?.find((s: { name: string }) => s.name === "Perception"),
							)}
							campaignId={campaignId}
							advantageState={resolveAdv({
								rollType: "ability_checks",
								targets: ["ability_checks", "skill:perception", "Perception"],
							})}
						/>
						<InlineRollButton
							characterId={characterId}
							characterName={characterName}
							rollType="ability"
							rollKey="stealth"
							label="Stealth"
							modifier={getSkillModifier(
								skills?.find((s: { name: string }) => s.name === "Stealth"),
							)}
							campaignId={campaignId}
							advantageState={resolveAdv({
								rollType: "ability_checks",
								targets: ["ability_checks", "skill:stealth", "Stealth"],
							})}
						/>
					</div>
				</div>

				{/* Campaign Context Info */}
				{campaignId && (
					<div className="mt-4 p-3 bg-muted/50 rounded-lg">
						<p className="text-sm text-muted-foreground">
							<strong>Campaign Mode:</strong> All rolls will be shared with your
							campaign chat and recorded in the campaign's roll history.
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
