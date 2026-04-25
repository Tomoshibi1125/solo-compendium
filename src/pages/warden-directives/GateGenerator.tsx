import { ArrowLeft, Copy, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Layout } from "@/components/layout/Layout";
import {
	AscendantText,
	ManaFlowText,
	RiftHeading,
} from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DungeonMapGenerator } from "@/components/warden-directives/DungeonMapGenerator";
import {
	RIFT_BIOMES,
	RIFT_BOSS_TYPES,
	RIFT_COMPLICATIONS,
	RIFT_THEMES,
	WARDEN_RANKS,
} from "@/data/wardenGeneratorContent";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import { formatRegentVernacular } from "@/lib/vernacular";
import {
	loadWardenGenerationContext,
	rankToTreasureRarities,
	type WardenLinkedEntry,
} from "@/lib/wardenGenerationContext";

interface GeneratedRift {
	rank: string;
	theme: string;
	biome: string;
	boss: string;
	complications: string[];
	hazards: string[];
	rewards: string[];
	linkedContent?: {
		boss?: WardenLinkedEntry | null;
		encounters?: WardenLinkedEntry[];
		hazards?: WardenLinkedEntry[];
		loot?: WardenLinkedEntry[];
		lore?: WardenLinkedEntry[];
	};
	description: string;
}

function generateRift(rank?: string): GeneratedRift {
	const selectedRank =
		rank || WARDEN_RANKS[Math.floor(Math.random() * WARDEN_RANKS.length)];
	const theme = formatRegentVernacular(
		RIFT_THEMES[Math.floor(Math.random() * RIFT_THEMES.length)],
	);
	const biome = RIFT_BIOMES[Math.floor(Math.random() * RIFT_BIOMES.length)];
	const boss = formatRegentVernacular(
		RIFT_BOSS_TYPES[Math.floor(Math.random() * RIFT_BOSS_TYPES.length)],
	);
	const numComplications = Math.floor(Math.random() * 3) + 1;
	const complications = [
		...new Set(
			Array.from(
				{ length: numComplications },
				() =>
					RIFT_COMPLICATIONS[
						Math.floor(Math.random() * RIFT_COMPLICATIONS.length)
					],
			),
		),
	].map(formatRegentVernacular);

	const description = formatRegentVernacular(
		`A ${selectedRank}-Rank Rift manifesting as ${biome} within the ${theme}. The Rift's core is protected by ${boss}. ${complications.length > 0 ? `Complications: ${complications.join(", ")}.` : ""}`,
	);

	return {
		rank: selectedRank,
		theme,
		biome,
		boss,
		complications,
		hazards: [],
		rewards: [],
		description,
	};
}

const GateGenerator = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<{
		selectedRank: string;
		rift: GeneratedRift | null;
	}>("gate_generator", {
		initialState: {
			selectedRank: "",
			rift: null,
		},
		storageKey: "solo-compendium.warden-directives.gate-generator.v1",
	});

	const [selectedRank, setSelectedRank] = useState<string>("");
	const [rift, setRift] = useState<GeneratedRift | null>(null);
	const userInteractedRef = useRef(false);

	const hydrated = useMemo(() => {
		return {
			selectedRank: storedState.selectedRank ?? "",
			rift: storedState.rift ?? null,
		};
	}, [storedState.rift, storedState.selectedRank]);

	const hydratedRef = useRef(false);
	useEffect(() => {
		if (isLoading) return;
		if (hydratedRef.current) return;
		if (userInteractedRef.current) return;
		setSelectedRank(hydrated.selectedRank);
		setRift(hydrated.rift);
		hydratedRef.current = true;
	}, [hydrated.rift, hydrated.selectedRank, isLoading]);

	const savePayload = useMemo(
		() => ({ selectedRank, rift }),
		[rift, selectedRank],
	);
	const debouncedPayload = useDebounce(savePayload, 350);

	useEffect(() => {
		if (isLoading) return;
		if (!hydratedRef.current) return;
		void saveNow(debouncedPayload);
	}, [debouncedPayload, isLoading, saveNow]);

	const { isEnhancing, enhancedText, enhance, clearEnhanced } = useAIEnhance();

	const handleGenerate = async () => {
		clearEnhanced();
		userInteractedRef.current = true;

		const baseRift = generateRift(selectedRank || undefined);
		const generationContext = await loadWardenGenerationContext({
			types: [
				"anomalies",
				"conditions",
				"equipment",
				"items",
				"relics",
				"runes",
				"sigils",
				"artifacts",
				"locations",
				"regents",
				"rollable-tables",
			],
		});
		const boss =
			generationContext.pickOne("anomalies", {
				rank: baseRift.rank,
				bossOnly: true,
			}) || generationContext.pickOne("anomalies", { rank: baseRift.rank });
		const encounters = generationContext.pickMany("anomalies", 4, {
			rank: baseRift.rank,
			theme: baseRift.theme,
			biome: baseRift.biome,
		});
		const hazards = generationContext.pickMany("conditions", 3, {
			theme: baseRift.theme,
			biome: baseRift.biome,
		});
		const treasureRarities = rankToTreasureRarities(baseRift.rank);
		const loot = [
			...generationContext.pickMany("equipment", 2, {
				rank: baseRift.rank,
				rarities: treasureRarities,
			}),
			...generationContext.pickMany("items", 2, {
				rarities: treasureRarities,
			}),
			...generationContext.pickMany("relics", 1, {
				rank: baseRift.rank,
				rarities: treasureRarities,
			}),
			...generationContext.pickMany("runes", 1, { rank: baseRift.rank }),
			...generationContext.pickMany("sigils", 1, { rank: baseRift.rank }),
			...generationContext.pickMany("artifacts", 1, {
				rank: baseRift.rank,
				rarities: treasureRarities,
			}),
		].slice(0, 8);
		const lore = [
			...generationContext.pickMany("locations", 2, {
				theme: baseRift.theme,
				biome: baseRift.biome,
			}),
			...generationContext.pickMany("regents", 1, { theme: baseRift.theme }),
			...generationContext.pickMany("rollable-tables", 1, {
				theme: baseRift.theme,
			}),
		];

		if (boss) {
			baseRift.boss = boss.name;
			baseRift.description = baseRift.description.replace(
				/protected by [^.]+/,
				`protected by ${boss.name}`,
			);
		}
		baseRift.hazards = hazards.map((entry) => entry.name);
		baseRift.rewards = loot.map((entry) => entry.name);
		baseRift.linkedContent = {
			boss,
			encounters,
			hazards,
			loot,
			lore,
		};
		baseRift.description = `${baseRift.description} Linked encounters: ${encounters.map((entry) => entry.name).join(", ") || "none"}. Rewards indexed: ${loot.map((entry) => entry.name).join(", ") || "none"}.`;

		setRift(baseRift);
		void saveNow({ selectedRank, rift: baseRift });
		toast({
			title: "Rift Generated",
			description: `Generated a ${baseRift.rank}-Rank Rift.`,
		});
	};

	const handleAIEnhance = async () => {
		if (!rift) return;
		const seed = `Generate a complete, detailed Rift dossier for a Rift Ascendant TTRPG campaign.

SEED DATA:
- Rank: ${rift.rank}
- Theme: ${rift.theme}
- Biome: ${rift.biome}
- Boss: ${rift.boss}
- Complications: ${rift.complications.join("; ") || "None"}
- Hazards: ${rift.hazards.join("; ") || "None"}
- Rewards: ${rift.rewards.join("; ") || "None"}
- Description: ${rift.description}

Provide ALL of the following sections with full detail:

1. DESCRIPTION: Rift appearance, sensory details (sight/sound/smell), entry conditions, environmental hazards
2. ANOMALIES: 3-5 anomalies with CR, type, HP, key abilities, tactical behavior
3. BOSS: Full stat block for ${rift.boss} (AC, HP, abilities, legendary actions, lair actions, tactics)
4. ENVIRONMENT: Terrain features, traps (DCs, damage, triggers), hazard zones, cover positions
5. LORE: Rift origin, which Regent domain it connects to, System classification, historical significance
6. REWARDS: Rift cores, materials, XP, rare drops with full item stats
7. MAP NOTES: Room/area descriptions for Warden to populate on VTT
8. READ-ALOUD: Boxed text for when players enter the Rift`;
		await enhance("rift", seed);
	};

	const handleCopy = () => {
		if (!rift) return;
		const text = `RIFT DETAILS\nRank: ${rift.rank}\nTheme: ${rift.theme}\nBiome: ${rift.biome}\nBoss: ${rift.boss}\nComplications: ${rift.complications.join(", ")}\n\n${rift.description}

---
D&D BEYOND STYLE RIFT DOSSIER:

DESCRIPTION:
${rift.description}

APPEARANCE:
• Visual Features: [Sensory details of Rift entrance and interior]
• Sounds: [Audio cues - humming, crackling, anomaly sounds]
• Smells: [Olfactory sensations - ozone, decay, magic]
• Entry Conditions: [Requirements to enter the Rift]
• Environmental Hazards: [Immediate dangers upon entry]

ANOMALIES:
${rift.complications
	.map(
		(_complication, i) => `${i + 1}. [Anomaly type related to ${rift.theme}]
   • Challenge Rating: [Appropriate to ${rift.rank} Rank]
   • Armor Class: [${rift.rank} Rank appropriate]
   • Hit Points: [${rift.rank} Rank appropriate]
   • Key Abilities: [Special attacks or powers]
   • Tactical Behavior: [Combat preferences and strategies]`,
	)
	.join("\n\n")}

BOSS: ${rift.boss}
• Armor Class: [${rift.rank} Rank boss appropriate]
• Hit Points: [${rift.rank} Rank boss appropriate]
• Speed: [Movement type and speed]
• Saving Throws: [Primary saves with bonuses]
• Skills: [Key skills with expertise]
• Attacks: [Primary and secondary attacks with to-hit and damage]
• Special Abilities: [Unique boss mechanics]
• Legendary Actions: [1-3 legendary actions per round]
• Lair Actions: [Environmental effects on initiative count 20]
• Tactics: [How the boss fights and uses its abilities]
• Weaknesses: [Exploitable vulnerabilities]

ENVIRONMENT:
• Terrain Features: [${rift.biome} characteristics]
• Traps: [${rift.complications.length} traps with DCs, damage, triggers, and reset conditions]
• Hazard Zones: [Areas of special danger]
• Cover Positions: [Strategic locations for combat]
• Visibility: [Lighting conditions and sight lines]
• Acoustics: [Sound propagation and stealth implications]

LORE:
• Rift Origin: [How this Rift formed and why]
• Regent Domain Connection: [Which Regent domain this connects to]
• System Classification: [Official System designation]
• Historical Significance: [Past events involving this Rift]
• Local Impact: [Effect on surrounding area]
• Discovery: [How the Rift was found]

REWARDS:
• Rift Cores: [${rift.rank} Rank appropriate number and quality]
• Materials: [${rift.rank} Rank appropriate materials]
• Experience Points: [${rift.rank} Rank appropriate XP per player]
• Rare Drops: [${rift.rank} Rank appropriate items with full stats]
• Special Rewards: [Unique items or components]

MAP NOTES:
• Room 1: [Entrance area description and features]
• Room 2: [First chamber contents and encounters]
• Room 3: [Central area with boss positioning]
• Room 4: [Treasure location and guardians]
• Room 5: [Secret areas and hidden passages]
• [Additional rooms as appropriate to ${rift.rank} Rank complexity]

READ-ALOUD ENTRY:
"[Detailed description of what players see, hear, and smell as they first approach and enter the Rift, setting the tone and atmosphere for the adventure within]"`;

		navigator.clipboard.writeText(text);
		toast({
			title: "Copied",
			description: "Complete Rift dossier copied to clipboard.",
		});
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/warden-directives")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Directives
					</Button>
					<RiftHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Dimensional Rift Synthesis
					</RiftHeading>
					<ManaFlowText variant="rift" speed="slow" className="font-heading">
						Compute localized anomalies embedding structural motifs,
						environmental strata, Guardian constructs, and entropy vectors.
					</ManaFlowText>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-1">
						<AscendantWindow title="GENERATOR SETTINGS">
							<div className="space-y-4">
								<div>
									<Label className="text-xs font-display text-muted-foreground mb-2 block">
										RIFT RANK (Optional)
									</Label>
									<div className="flex flex-wrap gap-2">
										{WARDEN_RANKS.map((rank) => (
											<Button
												key={rank}
												size="sm"
												variant={selectedRank === rank ? "default" : "outline"}
												onClick={() => {
													userInteractedRef.current = true;
													const nextRank = selectedRank === rank ? "" : rank;
													setSelectedRank(nextRank);
													void saveNow({ selectedRank: nextRank, rift });
												}}
											>
												{rank}
											</Button>
										))}
									</div>
									<AscendantText className="block text-xs text-muted-foreground mt-2">
										Leave empty for random rank
									</AscendantText>
								</div>
								<Button
									onClick={handleGenerate}
									className="w-full gap-2"
									size="lg"
								>
									<RefreshCw className="w-4 h-4" />
									Generate Rift
								</Button>
								{rift && (
									<Button
										onClick={handleAIEnhance}
										className="w-full gap-2 mt-2 btn-umbral"
										size="lg"
										disabled={isEnhancing}
									>
										{isEnhancing ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Sparkles className="w-4 h-4" />
										)}
										{isEnhancing ? "Enhancing..." : "Enhance with AI"}
									</Button>
								)}
							</div>
						</AscendantWindow>
					</div>

					<div className="lg:col-span-2">
						{rift ? (
							<div className="space-y-4">
								<AscendantWindow title={`${rift.rank}-RANK RIFT`}>
									<div className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<span className="text-xs font-display text-muted-foreground">
													THEME
												</span>
												<p className="font-heading text-lg">{rift.theme}</p>
											</div>
											<div>
												<span className="text-xs font-display text-muted-foreground">
													BIOME
												</span>
												<p className="font-heading text-lg">{rift.biome}</p>
											</div>
											<div>
												<span className="text-xs font-display text-muted-foreground">
													BOSS
												</span>
												<p className="font-heading text-lg">{rift.boss}</p>
											</div>
											<div>
												<span className="text-xs font-display text-muted-foreground">
													RANK
												</span>
												<Badge className="mt-1">{rift.rank}</Badge>
											</div>
										</div>

										{rift.complications.length > 0 && (
											<div>
												<span className="text-xs font-display text-muted-foreground">
													COMPLICATIONS
												</span>
												<div className="flex flex-wrap gap-2 mt-2">
													{rift.complications.map((comp, _i) => (
														<Badge key={comp} variant="destructive">
															{comp}
														</Badge>
													))}
												</div>
											</div>
										)}

										{rift.hazards.length > 0 && (
											<div>
												<span className="text-xs font-display text-muted-foreground">
													HAZARDS
												</span>
												<div className="flex flex-wrap gap-2 mt-2">
													{rift.hazards.map((hazard) => (
														<Badge key={hazard} variant="outline">
															{hazard}
														</Badge>
													))}
												</div>
											</div>
										)}

										{rift.rewards.length > 0 && (
											<div>
												<span className="text-xs font-display text-muted-foreground">
													INDEXED REWARDS
												</span>
												<div className="flex flex-wrap gap-2 mt-2">
													{rift.rewards.map((reward) => (
														<Badge key={reward} variant="secondary">
															{reward}
														</Badge>
													))}
												</div>
											</div>
										)}

										<div className="pt-4 border-t border-border">
											<span className="text-xs font-display text-muted-foreground">
												DESCRIPTION
											</span>
											<div className="block text-sm text-muted-foreground mt-2">
												<AutoLinkText text={rift.description} />
											</div>
										</div>

										<div className="pt-4 border-t border-primary/30">
											<div className="flex items-center gap-2 mb-2">
												<Sparkles className="w-4 h-4 text-primary" />
												<span className="text-xs font-display text-primary">
													AI-ENHANCED DOSSIER
												</span>
											</div>
											<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-4 max-h-[500px] overflow-y-auto">
												<AutoLinkText text={enhancedText || ""} />
											</div>
										</div>

										<div className="flex gap-2 pt-4 border-t border-border">
											<Button
												variant="outline"
												onClick={handleCopy}
												className="gap-2"
											>
												<Copy className="w-4 h-4" />
												Copy Details
											</Button>
											<Button
												variant="outline"
												onClick={handleGenerate}
												className="gap-2"
											>
												<RefreshCw className="w-4 h-4" />
												Regenerate
											</Button>
										</div>
									</div>
								</AscendantWindow>

								{rift && (
									<div className="pt-8">
										<AscendantWindow title="RIFT MAP GENERATOR">
											<DungeonMapGenerator riftContext={rift} />
										</AscendantWindow>
									</div>
								)}
							</div>
						) : (
							<AscendantWindow title="NO RIFT GENERATED">
								<div className="text-center py-12 text-muted-foreground">
									<p>Click "Generate Rift" to create a random Rift</p>
								</div>
							</AscendantWindow>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default GateGenerator;
