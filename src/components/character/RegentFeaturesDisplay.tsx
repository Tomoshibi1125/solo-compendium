import { CheckCircle, Crown, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { regents } from "@/data/compendium/monarchs";
import { cn } from "@/lib/utils";

interface RegentFeaturesDisplayProps {
	characterId: string;
	characterLevel: number;
	regentId?: string;
	regentLevel?: number;
	className?: string;
}

export function RegentFeaturesDisplay({
	characterLevel,
	regentId,
	regentLevel = 1,
	className,
}: RegentFeaturesDisplayProps) {
	const regentData = regents.find((r) => r.id === regentId);

	if (!regentId) {
		return (
			<Card className={cn("w-full", className)}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Crown className="w-5 h-5" />
						Regent Features
					</CardTitle>
					<CardDescription>
						No regent unlocked. Complete quests and have your DM unlock a regent
						for you.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-muted-foreground">
						<Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
						<p className="text-sm">
							Regent abilities are locked until unlocked by your DM
						</p>
						<p className="text-xs mt-2">
							Complete the required quest to unlock regent features
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const getRegentFeatures = () => {
		if (!regentData) return [];

		return (regentData.class_features ?? [])
			.filter((f) => f.level <= regentLevel)
			.map((f) => ({
				name: f.name,
				description: f.description,
				type: f.type,
				frequency: f.frequency,
				level: f.level,
			}));
	};

	const _getSpellSlots = () => {
		if (!regentData?.spellcasting) return null;

		return regentData.spellcasting.spell_slots[`1st`]?.[regentLevel - 1] || 0;
	};

	const regentFeatures = getRegentFeatures();

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Crown className="w-5 h-5" />
					{regentData?.name} Features
				</CardTitle>
				<CardDescription>
					Regent abilities at level {regentLevel} (Character Level{" "}
					{characterLevel})
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Regent Info */}
				<div className="p-4 border rounded-lg bg-muted/50">
					<div className="flex items-center gap-2 mb-2">
						<CheckCircle className="w-4 h-4 text-green-500" />
						<span className="font-medium">{regentData?.name}</span>
						<Badge variant="secondary">{regentData?.rank}</Badge>
					</div>
					<p className="text-sm text-muted-foreground">
						{regentData?.description}
					</p>
				</div>

				{/* Regent Features */}
				<div className="space-y-4">
					<h4 className="font-medium">Regent Abilities</h4>
					<div className="space-y-3">
						{regentFeatures.map((feature, _index) => (
							<div
								key={feature.name as string}
								className="p-4 border rounded-lg bg-background"
							>
								<div className="flex items-center gap-2 mb-2">
									<span className="font-medium">{feature.name as React.ReactNode}</span>
									<Badge variant="outline" className="text-xs">
										{feature.type}
									</Badge>
									{feature.frequency && (
										<Badge variant="secondary" className="text-xs">
											{feature.frequency}
										</Badge>
									)}
									<Badge variant="outline" className="text-xs">
										Lvl {feature.level}
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									{(feature.description as React.ReactNode) ?? ""}
								</p>
							</div>
						))}
						{regentFeatures.length === 0 && (
							<p className="text-sm text-muted-foreground italic">
								No regent features at this level
							</p>
						)}
					</div>
				</div>

				{/* Spell Slots */}
				{regentData?.spellcasting && (
					<div className="space-y-4">
						<h4 className="font-medium">Regent Spell Slots</h4>
						<div className="grid grid-cols-9 gap-2 text-center">
							{Array.from({ length: 9 }, (_, i) => i + 1).map((level) => {
								const slotKey =
									`${level}${level === 1 ? "st" : level === 2 ? "nd" : level === 3 ? "rd" : "th"}` as keyof typeof regentData.spellcasting.spell_slots;
								const slots =
									regentData.spellcasting.spell_slots[slotKey]?.[
										regentLevel - 1
									] || 0;
								return (
									<div key={level} className="p-2 border rounded">
										<div className="text-xs font-medium">Lvl {level}</div>
										<div className="text-sm font-bold">{slots}</div>
									</div>
								);
							})}
						</div>
						<div className="text-xs text-muted-foreground">
							<p>
								Cantrips:{" "}
								{regentData.spellcasting.cantrips_known?.[regentLevel - 1] || 0}
							</p>
							<p>
								Spells Known:{" "}
								{regentData.spellcasting.spells_known?.[regentLevel - 1] || 0}
							</p>
						</div>
					</div>
				)}

				{/* Proficiencies */}
				<div className="space-y-4">
					<h4 className="font-medium">Regent Proficiencies</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{regentData?.armor_proficiencies &&
							regentData.armor_proficiencies.length > 0 && (
								<div className="p-3 border rounded-lg bg-background">
									<div className="text-sm font-medium mb-2">
										Armor Proficiencies
									</div>
									<div className="flex flex-wrap gap-1">
										{regentData.armor_proficiencies.map((prof, _index) => (
											<Badge key={prof} variant="outline" className="text-xs">
												{prof}
											</Badge>
										))}
									</div>
								</div>
							)}
						{regentData?.weapon_proficiencies &&
							regentData.weapon_proficiencies.length > 0 && (
								<div className="p-3 border rounded-lg bg-background">
									<div className="text-sm font-medium mb-2">
										Weapon Proficiencies
									</div>
									<div className="flex flex-wrap gap-1">
										{regentData.weapon_proficiencies.map((prof, _index) => (
											<Badge key={prof} variant="outline" className="text-xs">
												{prof}
											</Badge>
										))}
									</div>
								</div>
							)}
						{regentData?.skill_proficiencies &&
							regentData.skill_proficiencies.length > 0 && (
								<div className="p-3 border rounded-lg bg-background">
									<div className="text-sm font-medium mb-2">
										Skill Proficiencies
									</div>
									<div className="flex flex-wrap gap-1">
										{regentData.skill_proficiencies.map((prof, _index) => (
											<Badge key={prof} variant="outline" className="text-xs">
												{prof}
											</Badge>
										))}
									</div>
								</div>
							)}
					</div>
				</div>

				{/* Special Abilities */}
				{regentData?.mechanics && (
					<div className="space-y-4">
						<h4 className="font-medium">Special Abilities</h4>
						<div className="space-y-2">
							{Boolean((regentData.mechanics as Record<string, unknown>).shadow_legion_command) && (
								<div className="p-3 border rounded-lg bg-purple-50 border-purple-200">
									<div className="text-sm font-medium text-purple-800">
										Shadow Legion Command
									</div>
									<div className="text-xs text-purple-700">
										Can command Shadow Soldiers and control the Umbral Legion
									</div>
								</div>
							)}
							{Boolean((regentData.mechanics as Record<string, unknown>).essence_manipulation) && (
								<div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
									<div className="text-sm font-medium text-blue-800">
										Essence Manipulation
									</div>
									<div className="text-xs text-blue-700">
										Can manipulate and harvest essence from defeated foes
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Progression Info */}
				<div className="text-xs text-muted-foreground border-t pt-4">
					<p>
						<strong>Progression:</strong> Regent abilities advance with
						character level.
					</p>
					<p>
						<strong>Next Level:</strong> New abilities unlock at higher
						character levels.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
