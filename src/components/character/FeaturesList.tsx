import { Minus, Plus, Power, PowerOff, Star, Zap } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { useCampaignByCharacterId } from "@/hooks/useCampaigns";
import { useFeatures } from "@/hooks/useFeatures";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { useRealtimeCollaboration } from "@/hooks/useRealtimeCollaboration";
import { useRecordRoll } from "@/hooks/useRollHistory";
import { cn } from "@/lib/utils";
import { formatMonarchVernacular } from "@/lib/vernacular";

export function FeaturesList({ characterId }: { characterId: string }) {
	const { features, updateFeature, reorderFeatures } = useFeatures(characterId);
	const { toast } = useToast();
	const [filterSource, setFilterSource] = useState<string>("all");
	const [filterLevel, setFilterLevel] = useState<string>("all");

	// D&D Beyond Parity Integration
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const playerTools = usePlayerToolsEnhancements();
	const recordRoll = useRecordRoll();
	const { data: characterCampaign } = useCampaignByCharacterId(characterId);
	const campaignId = characterCampaign?.id ?? null;
	const { broadcastDiceRoll, isConnected: isCampaignConnected } =
		useRealtimeCollaboration(campaignId || "");

	const filteredFeatures = features.filter((feature) => {
		if (filterSource !== "all" && !feature.source.includes(filterSource))
			return false;
		if (
			filterLevel !== "all" &&
			feature.level_acquired.toString() !== filterLevel
		)
			return false;
		return true;
	});

	const groupedFeatures = filteredFeatures.reduce(
		(acc, feature) => {
			const source = feature.source.split(":")[0] || "Other";
			if (!acc[source]) acc[source] = [];
			acc[source].push(feature);
			return acc;
		},
		{} as Record<string, typeof features>,
	);

	const handleReorderGroup = useCallback(
		async (source: string, newOrder: typeof features) => {
			try {
				const updates = newOrder.map((feature, index) => ({
					id: feature.id,
					display_order: index,
				}));
				await reorderFeatures(updates);
			} catch {
				// Error handled by hook
			}
		},
		[reorderFeatures],
	);

	const handleUseFeature = async (
		feature: (typeof features)[0],
		delta: number,
	) => {
		if (feature.uses_max === null) return;

		const newUses = Math.max(
			0,
			Math.min(feature.uses_max, (feature.uses_current || 0) + delta),
		);

		try {
			await updateFeature({
				id: feature.id,
				updates: { uses_current: newUses },
			});

			// Broadcast feature usage for DDB Parity
			const actionType = delta < 0 ? "spend" : "regain";
			playerTools
				.trackCustomFeatureUsage(characterId, feature.name, actionType, "5e")
				.catch(console.error);

			if (delta < 0) {
				const scope = campaignId && isCampaignConnected ? "campaign" : "local";
				recordRoll.mutate({
					dice_formula: "Feature",
					result: 0,
					rolls: [],
					roll_type: "ability", // 'feature' or 'ability' is standard for logging
					context: `Uses ${feature.name}`,
					modifiers: null,
					campaign_id: campaignId ?? null,
					character_id: characterId,
				});

				if (scope === "campaign") {
					broadcastDiceRoll("Feature", 0, {
						characterName: "Character", // Ideally passed in down the prop tree, but 'Character' is fine if not available
						rollType: "ability",
						context: `Uses ${feature.name}`,
						rolls: [],
					});
				}
			}
		} catch {
			toast({
				title: "Failed to update",
				description: "Could not update feature uses.",
				variant: "destructive",
			});
		}
	};

	const handleToggleActive = async (feature: (typeof features)[0]) => {
		try {
			const newActiveState = !feature.is_active;
			await updateFeature({
				id: feature.id,
				updates: { is_active: newActiveState },
			});

			// Broadcast toggle for DDB parity
			playerTools
				.trackCustomFeatureUsage(
					characterId,
					feature.name,
					newActiveState ? "activate" : "deactivate",
					"5e",
				)
				.catch(console.error);
		} catch {
			toast({
				title: "Failed to update",
				description: "Could not toggle feature.",
				variant: "destructive",
			});
		}
	};

	return (
		<SystemWindow title="FEATURES">
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<Select value={filterSource} onValueChange={setFilterSource}>
						<SelectTrigger className="w-[140px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Sources</SelectItem>
							<SelectItem value="Job">Job</SelectItem>
							<SelectItem value="Path">Path</SelectItem>
							<SelectItem value="Awakening">Awakening</SelectItem>
							<SelectItem value="Background">Background</SelectItem>
						</SelectContent>
					</Select>
					<Select value={filterLevel} onValueChange={setFilterLevel}>
						<SelectTrigger className="w-[120px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Levels</SelectItem>
							{[
								1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
								19, 20,
							].map((level) => (
								<SelectItem key={level} value={level.toString()}>
									Level {level}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{features.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>No features yet</p>
						<p className="text-xs mt-1">
							Features are added automatically during level up
						</p>
					</div>
				) : filteredFeatures.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						No features match the current filters
					</div>
				) : (
					Object.entries(groupedFeatures).map(([source, sourceFeatures]) => (
						<div key={source} className="space-y-2">
							<div className="text-sm font-heading text-muted-foreground">
								{formatMonarchVernacular(source)}
							</div>
							<SortableList
								items={sourceFeatures}
								onReorder={(newOrder) => handleReorderGroup(source, newOrder)}
								renderItem={(feature) => (
									<div
										key={feature.id}
										className={cn(
											"p-3 rounded-lg border bg-muted/30",
											!feature.is_active && "opacity-50",
										)}
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<span className="font-heading font-semibold">
														{formatMonarchVernacular(feature.name)}
													</span>
													<Badge variant="outline" className="text-xs">
														Level {feature.level_acquired}
													</Badge>
													{feature.action_type && (
														<Badge variant="secondary" className="text-xs">
															{formatMonarchVernacular(feature.action_type)}
														</Badge>
													)}
													{feature.recharge && (
														<Badge variant="outline" className="text-xs">
															{formatMonarchVernacular(feature.recharge)}
														</Badge>
													)}
													{!feature.is_active && (
														<Badge variant="destructive" className="text-xs">
															Inactive
														</Badge>
													)}
												</div>
												{feature.description && (
													<p className="text-xs text-muted-foreground line-clamp-2">
														{formatMonarchVernacular(feature.description)}
													</p>
												)}
												{feature.uses_max !== null && (
													<div className="flex items-center gap-2 mt-2">
														<Label className="text-xs">Uses:</Label>
														<div className="flex items-center gap-1">
															<Button
																variant="ghost"
																size="icon"
																className="h-6 w-6"
																onClick={() => handleUseFeature(feature, -1)}
																disabled={
																	!feature.uses_current ||
																	feature.uses_current <= 0
																}
															>
																<Minus className="w-3 h-3" />
															</Button>
															<span className="text-sm font-heading min-w-[3rem] text-center">
																{feature.uses_current || 0}/{feature.uses_max}
															</span>
															<Button
																variant="ghost"
																size="icon"
																className="h-6 w-6"
																onClick={() => handleUseFeature(feature, 1)}
																disabled={
																	!feature.uses_current ||
																	feature.uses_current >= feature.uses_max
																}
															>
																<Plus className="w-3 h-3" />
															</Button>
														</div>
													</div>
												)}
											</div>
											<div className="flex flex-col items-end gap-2">
												<div className="flex items-center gap-2">
													<Button
														variant={feature.is_active ? "default" : "outline"}
														size="sm"
														onClick={() => handleToggleActive(feature)}
														className={cn(
															"text-xs gap-1.5 h-8",
															feature.is_active
																? "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
																: "text-muted-foreground hover:text-foreground",
														)}
													>
														{feature.is_active ? (
															<>
																<Power className="w-3.5 h-3.5" />
																Active
															</>
														) : (
															<>
																<PowerOff className="w-3.5 h-3.5" />
																Inactive
															</>
														)}
													</Button>
												</div>

												{feature.uses_max !== null && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleUseFeature(feature, -1)}
														disabled={
															!feature.uses_current || feature.uses_current <= 0
														}
														className="h-8 text-xs gap-1.5 border-primary/20 hover:bg-primary/10"
													>
														<Zap className="w-3.5 h-3.5 text-primary" />
														Spend Use
													</Button>
												)}
											</div>
										</div>
									</div>
								)}
								itemClassName="mb-2"
							/>
						</div>
					))
				)}
			</div>
		</SystemWindow>
	);
}
