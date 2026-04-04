import { CheckCircle, Crown, Lock } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getStaticRegents } from "@/lib/ProtocolDataManager";
import { cn } from "@/lib/utils";
import type { DetailData } from "@/types/character";

interface RegentFeaturesDisplayProps {
	characterId: string;
	characterLevel: number;
	regentId?: string;
	regentLevel?: number;
	className?: string;
	onSelectDetail?: (detail: DetailData) => void;
}

export function RegentFeaturesDisplay({
	characterLevel,
	regentId,
	regentLevel = 1,
	className,
	onSelectDetail,
}: RegentFeaturesDisplayProps) {
	const regentData = getStaticRegents().find((r) => r.id === regentId);

	if (!regentId) {
		return (
			<Card className={cn("w-full", className)}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Crown className="w-5 h-5" />
						Regent Features
					</CardTitle>
					<CardDescription>
						No regent unlocked. Complete quests and have your Protocol Warden
						(PW) unlock a regent for you.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-muted-foreground">
						<Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
						<p className="text-sm">
							Regent abilities are locked until unlocked by your Protocol Warden
							(PW)
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
		if (!regentData || !regentData.class_features) return [];

		return regentData.class_features
			.filter((f) => f.level <= regentLevel)
			.map((f) => ({
				name: f.name,
				description: f.description,
				type: f.type,
				frequency: f.frequency,
				level: f.level,
			}));
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
				<button
					type="button"
					className="w-full text-left p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
					onClick={() =>
						onSelectDetail?.({
							title: regentData?.name || "Regent",
							description: regentData?.description || "",
							payload: { rank: regentData?.rank, type: "Regent" },
						})
					}
				>
					<div className="flex items-center gap-2 mb-2">
						<CheckCircle className="w-4 h-4 text-green-500" />
						<span className="font-medium">{regentData?.name}</span>
						<Badge variant="secondary">{regentData?.rank}</Badge>
					</div>
					<div className="text-sm text-muted-foreground line-clamp-2">
						<AutoLinkText text={regentData?.description || ""} />
					</div>
				</button>

				{/* Regent Features */}
				<div className="space-y-4">
					<h4 className="font-medium">Regent Abilities</h4>
					<div className="space-y-3">
						{regentFeatures.map((feature) => (
							<button
								key={feature.name}
								type="button"
								className="w-full text-left p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
								onClick={() =>
									onSelectDetail?.({
										title: feature.name,
										description: feature.description || "",
										payload: {
											level: feature.level,
											frequency: feature.frequency,
											type: feature.type,
										},
									})
								}
							>
								<div className="flex items-center gap-2 mb-2">
									<span className="font-medium">{feature.name}</span>
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
								<div className="text-sm text-muted-foreground line-clamp-2">
									<AutoLinkText text={feature.description || ""} />
								</div>
							</button>
						))}
						{regentFeatures.length === 0 && (
							<p className="text-sm text-muted-foreground italic">
								No regent features at this level
							</p>
						)}
					</div>
				</div>

				{/* Spell Slots & Other info remains static but clear */}
				{regentData?.spellcasting && (
					<div className="space-y-4">
						<h4 className="font-medium">Regent Power Slots</h4>
						<div className="grid grid-cols-9 gap-2 text-center">
							{Array.from({ length: 9 }, (_, i) => i + 1).map((level) => {
								const sc = regentData.spellcasting;
								if (!sc) return null;
								const slotKey =
									`${level}${level === 1 ? "st" : level === 2 ? "nd" : level === 3 ? "rd" : "th"}` as keyof typeof sc.spell_slots;
								const slots = sc.spell_slots[slotKey]?.[regentLevel - 1] || 0;
								return (
									<div key={level} className="p-2 border rounded">
										<div className="text-xs font-medium">Lvl {level}</div>
										<div className="text-sm font-bold">{slots}</div>
									</div>
								);
							})}
						</div>
					</div>
				)}

				<div className="text-xs text-muted-foreground border-t pt-4">
					<p>
						<strong>Progression:</strong> Regent abilities advance with
						character level.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
