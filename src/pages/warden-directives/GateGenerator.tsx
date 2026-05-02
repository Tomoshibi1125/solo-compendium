import {
	AlertTriangle,
	ArrowLeft,
	BookOpen,
	Copy,
	Crosshair,
	Loader2,
	Map,
	RefreshCw,
	ScrollText,
	Shield,
	Sparkles,
	Swords,
	Target,
	Trophy,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { WARDEN_RANKS } from "@/data/wardenGeneratorContent";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import {
	buildAISeed,
	generateFullRift,
	packetToLegacyRift,
	packetToTextDossier,
	type GeneratedRiftPacket,
} from "@/lib/riftGenerator";

const GateGenerator = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<{
		selectedRank: string;
		rift: GeneratedRiftPacket | null;
	}>("gate_generator", {
		initialState: {
			selectedRank: "",
			rift: null,
		},
		storageKey: "solo-compendium.warden-directives.gate-generator.v2",
	});

	const [selectedRank, setSelectedRank] = useState<string>("");
	const [rift, setRift] = useState<GeneratedRiftPacket | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [expandedSection, setExpandedSection] = useState<string | null>(null);
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

	const { isEnhancing, enhance, clearEnhanced } = useAIEnhance();
	const [enhancingSection, setEnhancingSection] = useState<string | null>(null);

	const handleGenerate = async () => {
		clearEnhanced();
		userInteractedRef.current = true;
		setIsGenerating(true);

		try {
			const packet = await generateFullRift(selectedRank || undefined);
			setRift(packet);
			void saveNow({ selectedRank, rift: packet });
			toast({
				title: "Rift Generated",
				description: `Generated a ${packet.rank}-Rank Rift with ${packet.roomKeys.length} rooms, ${packet.encounters.length} encounters, and ${packet.hazards.length} hazards.`,
			});
		} catch (error) {
			toast({
				title: "Generation Failed",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		} finally {
			setIsGenerating(false);
		}
	};

	const handleSectionEnhance = useCallback(
		async (section: "overview" | "rooms" | "encounters" | "hazards") => {
			if (!rift) return;
			setEnhancingSection(section);
			const seed = buildAISeed(rift, section);
			const result = await enhance("rift", seed,
				`You are a Rift Ascendant TTRPG Warden assistant. Enrich the ${section} section with vivid prose, tactical notes, and Rift Ascendant lore. Keep all mechanical data (DCs, damage, CR) intact. Use Rift Ascendant terminology. Return plain text only.`,
			);
			if (result) {
				setRift((prev) => {
					if (!prev) return prev;
					return {
						...prev,
						aiEnhanced: {
							...prev.aiEnhanced,
							[section]: result,
						},
					};
				});
			}
			setEnhancingSection(null);
		},
		[rift, enhance],
	);

	const handleCopy = () => {
		if (!rift) return;
		navigator.clipboard.writeText(packetToTextDossier(rift));
		toast({
			title: "Copied",
			description: "Complete Rift dossier copied to clipboard.",
		});
	};

	const toggleSection = (section: string) => {
		setExpandedSection((prev) => (prev === section ? null : section));
	};

	const legacyRiftContext = useMemo(
		() => (rift ? packetToLegacyRift(rift) : null),
		[rift],
	);

	const SectionEnhanceButton = ({
		section,
		label,
	}: {
		section: "overview" | "rooms" | "encounters" | "hazards";
		label: string;
	}) => (
		<Button
			variant="ghost"
			size="sm"
			className="gap-1 text-xs h-7"
			disabled={isEnhancing}
			onClick={() => handleSectionEnhance(section)}
		>
			{enhancingSection === section ? (
				<Loader2 className="w-3 h-3 animate-spin" />
			) : (
				<Sparkles className="w-3 h-3" />
			)}
			{enhancingSection === section ? "Enhancing..." : label}
		</Button>
	);

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
									disabled={isGenerating}
								>
									{isGenerating ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<RefreshCw className="w-4 h-4" />
									)}
									{isGenerating ? "Generating..." : "Generate Rift"}
								</Button>
							</div>
						</AscendantWindow>

						{rift && (
							<AscendantWindow title="RIFT SUMMARY" className="mt-4">
								<div className="space-y-3 text-sm">
									<div className="grid grid-cols-2 gap-2">
										<div>
											<span className="text-xs font-display text-muted-foreground">RANK</span>
											<Badge className="mt-1 block w-fit">{rift.rank}</Badge>
										</div>
										<div>
											<span className="text-xs font-display text-muted-foreground">ROOMS</span>
											<p className="font-heading">{rift.roomKeys.length}</p>
										</div>
										<div>
											<span className="text-xs font-display text-muted-foreground">ENCOUNTERS</span>
											<p className="font-heading">{rift.encounters.length}</p>
										</div>
										<div>
											<span className="text-xs font-display text-muted-foreground">HAZARDS</span>
											<p className="font-heading">{rift.hazards.length}</p>
										</div>
									</div>
									<div>
										<span className="text-xs font-display text-muted-foreground">TOTAL XP</span>
										<p className="font-heading">{rift.rewards.totalXP.toLocaleString()}</p>
									</div>
									<div className="flex flex-wrap gap-2 pt-2 border-t border-border">
										<Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
											<Copy className="w-3 h-3" />
											Copy Dossier
										</Button>
										<Button variant="outline" size="sm" onClick={handleGenerate} className="gap-1" disabled={isGenerating}>
											<RefreshCw className="w-3 h-3" />
											Regenerate
										</Button>
									</div>
								</div>
							</AscendantWindow>
						)}
					</div>

					<div className="lg:col-span-2">
						{rift ? (
							<div className="space-y-4">
								{/* Overview */}
								<AscendantWindow title={`${rift.rank}-RANK RIFT — ${rift.theme.toUpperCase()}`}>
									<div className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<span className="text-xs font-display text-muted-foreground">THEME</span>
												<p className="font-heading text-lg">{rift.theme}</p>
											</div>
											<div>
												<span className="text-xs font-display text-muted-foreground">BIOME</span>
												<p className="font-heading text-lg">{rift.biome}</p>
											</div>
											<div>
												<span className="text-xs font-display text-muted-foreground">BOSS</span>
												<p className="font-heading text-lg">{rift.boss}</p>
											</div>
											<div>
												<span className="text-xs font-display text-muted-foreground">RANK</span>
												<Badge className="mt-1">{rift.rank}</Badge>
											</div>
										</div>

										{rift.complications.length > 0 && (
											<div>
												<span className="text-xs font-display text-muted-foreground">COMPLICATIONS</span>
												<div className="flex flex-wrap gap-2 mt-2">
													{rift.complications.map((comp) => (
														<Badge key={comp} variant="destructive">{comp}</Badge>
													))}
												</div>
											</div>
										)}

										<div className="pt-4 border-t border-border">
											<div className="flex items-center justify-between mb-2">
												<span className="text-xs font-display text-muted-foreground">OVERVIEW</span>
												<SectionEnhanceButton section="overview" label="Enhance" />
											</div>
											<div className="text-sm text-muted-foreground">
												<AutoLinkText text={rift.aiEnhanced?.overview || rift.overview} />
											</div>
										</div>

										<div className="pt-4 border-t border-primary/30">
											<div className="flex items-center gap-2 mb-2">
												<ScrollText className="w-4 h-4 text-primary" />
												<span className="text-xs font-display text-primary">READ-ALOUD ENTRY</span>
											</div>
											<div className="text-sm italic text-muted-foreground bg-primary/5 rounded-lg p-4">
												<AutoLinkText text={rift.readAloudEntry} />
											</div>
										</div>
									</div>
								</AscendantWindow>

								{/* Objective */}
								<AscendantWindow title="OBJECTIVE">
									<div className="space-y-2 text-sm">
										<div className="flex items-start gap-2">
											<Target className="w-4 h-4 mt-0.5 text-red-400 shrink-0" />
											<div>
												<span className="text-xs font-display text-muted-foreground">PRIMARY</span>
												<p>{rift.objective.primary}</p>
											</div>
										</div>
										{rift.objective.secondary.map((sec, i) => (
											<div key={`sec-${i}`} className="flex items-start gap-2 pl-6">
												<Crosshair className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />
												<p className="text-muted-foreground">{sec}</p>
											</div>
										))}
										<div className="pt-2 border-t border-border text-xs text-destructive">
											<strong>Failure:</strong> {rift.objective.failureCondition}
										</div>
									</div>
								</AscendantWindow>

								{/* Room Keys */}
								<AscendantWindow title="KEYED AREAS">
									<div className="space-y-1">
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs font-display text-muted-foreground">{rift.roomKeys.length} ROOMS</span>
											<SectionEnhanceButton section="rooms" label="Enhance Rooms" />
										</div>
										{rift.roomKeys.map((room) => (
											<div
												key={room.roomId}
												className="border border-border rounded-lg overflow-hidden"
											>
												<button
													type="button"
													className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/50 transition-colors"
													onClick={() => toggleSection(room.roomId)}
												>
													<Map className="w-4 h-4 shrink-0 text-muted-foreground" />
													<span className="font-heading text-sm flex-1">{room.label}</span>
													<Badge variant="outline" className="text-xs">{room.type}</Badge>
												</button>
												{expandedSection === room.roomId && (
													<div className="px-3 pb-3 space-y-2 text-sm border-t border-border">
														<div className="pt-2 italic text-muted-foreground bg-primary/5 rounded p-2 mt-2">
															<AutoLinkText text={room.readAloud} />
														</div>
														<p className="text-muted-foreground">{room.description}</p>
														{room.encounter && (
															<div className="flex items-start gap-2 text-red-400">
																<Swords className="w-4 h-4 mt-0.5 shrink-0" />
																<span>{room.encounter.name} (CR {room.encounter.cr}, x{room.encounter.count})</span>
															</div>
														)}
														{room.hazard && (
															<div className="flex items-start gap-2 text-orange-400">
																<AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
																<span>{room.hazard.name} — DC {room.hazard.dc}, {room.hazard.damage}</span>
															</div>
														)}
														{room.loot.length > 0 && (
															<div className="flex items-start gap-2 text-yellow-400">
																<Trophy className="w-4 h-4 mt-0.5 shrink-0" />
																<span>{room.loot.join(", ")}</span>
															</div>
														)}
														{room.lore && (
															<div className="flex items-start gap-2 text-blue-400">
																<BookOpen className="w-4 h-4 mt-0.5 shrink-0" />
																<span>{room.lore}</span>
															</div>
														)}
													</div>
												)}
											</div>
										))}
									</div>
								</AscendantWindow>

								{/* Encounters */}
								<AscendantWindow title="ENCOUNTERS">
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-xs font-display text-muted-foreground">{rift.encounters.length} ENCOUNTER(S)</span>
											<SectionEnhanceButton section="encounters" label="Enhance Tactics" />
										</div>
										{rift.aiEnhanced?.encounters && (
											<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-3">
												<AutoLinkText text={rift.aiEnhanced.encounters || ""} />
											</div>
										)}
										{rift.encounters.map((enc) => (
											<div key={enc.id} className="border border-border rounded-lg p-3 space-y-1">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<Swords className="w-4 h-4 text-red-400" />
														<span className="font-heading text-sm">{enc.name}</span>
													</div>
													<div className="flex items-center gap-2">
														<Badge variant={enc.role === "boss" ? "destructive" : enc.role === "elite" ? "default" : "secondary"}>
															{enc.role}
														</Badge>
														<Badge variant="outline">CR {enc.cr}</Badge>
													</div>
												</div>
												<p className="text-xs text-muted-foreground">
													x{enc.count} — {enc.xpTotal.toLocaleString()} XP
												</p>
												<p className="text-xs text-muted-foreground italic">{enc.tactics}</p>
											</div>
										))}
										<div className="text-xs font-display text-muted-foreground pt-2 border-t border-border">
											TOTAL XP: {rift.rewards.totalXP.toLocaleString()}
										</div>
									</div>
								</AscendantWindow>

								{/* Hazards */}
								{rift.hazards.length > 0 && (
									<AscendantWindow title="HAZARDS">
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<span className="text-xs font-display text-muted-foreground">{rift.hazards.length} HAZARD(S)</span>
												<SectionEnhanceButton section="hazards" label="Enhance Hazards" />
											</div>
											{rift.aiEnhanced?.hazards && (
												<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-3">
													<AutoLinkText text={rift.aiEnhanced.hazards || ""} />
												</div>
											)}
											{rift.hazards.map((haz) => (
												<div key={haz.id} className="border border-border rounded-lg p-3 space-y-1">
													<div className="flex items-center gap-2">
														<AlertTriangle className="w-4 h-4 text-orange-400" />
														<span className="font-heading text-sm">{haz.name}</span>
													</div>
													<p className="text-xs text-muted-foreground">
														DC {haz.dc} — {haz.damage} damage
													</p>
													<p className="text-xs text-muted-foreground">{haz.trigger}</p>
													<p className="text-xs text-muted-foreground italic">{haz.effect}</p>
												</div>
											))}
										</div>
									</AscendantWindow>
								)}

								{/* Rewards */}
								<AscendantWindow title="REWARDS">
									<div className="space-y-3 text-sm">
										<div className="flex items-center gap-2">
											<Trophy className="w-4 h-4 text-yellow-400" />
											<span>Total XP: {rift.rewards.totalXP.toLocaleString()}</span>
										</div>
										{rift.rewards.treasure && (
											<div className="space-y-1">
												{(rift.rewards.treasure.hundreds > 0 || rift.rewards.treasure.tens > 0) && (
													<p className="text-muted-foreground">
														Currency: {[
															rift.rewards.treasure.hundreds > 0 ? `$${rift.rewards.treasure.hundreds * 100}` : "",
															rift.rewards.treasure.tens > 0 ? `$${rift.rewards.treasure.tens * 10}` : "",
														].filter(Boolean).join(" + ")}
													</p>
												)}
												{rift.rewards.treasure.items.length > 0 && (
													<div className="flex flex-wrap gap-1">
														{rift.rewards.treasure.items.map((item: string, i: number) => (
															<Badge key={`item-${i}`} variant="secondary">{item}</Badge>
														))}
													</div>
												)}
												{rift.rewards.treasure.relics.length > 0 && (
													<div className="flex flex-wrap gap-1">
														{rift.rewards.treasure.relics.map((relic: string, i: number) => (
															<Badge key={`relic-${i}`} variant="default">{relic}</Badge>
														))}
													</div>
												)}
											</div>
										)}
										{rift.rewards.bonusRewards.length > 0 && (
											<div>
												<span className="text-xs font-display text-muted-foreground">BONUS</span>
												<div className="flex flex-wrap gap-1 mt-1">
													{rift.rewards.bonusRewards.map((bonus, i) => (
														<Badge key={`bonus-${i}`} variant="outline">{bonus}</Badge>
													))}
												</div>
											</div>
										)}
									</div>
								</AscendantWindow>

								{/* Lore & Warden Tips */}
								<AscendantWindow title="LORE & WARDEN TIPS">
									<div className="space-y-3 text-sm">
										<div>
											<span className="text-xs font-display text-muted-foreground">LORE NOTES</span>
											{rift.loreNotes.map((note, i) => (
												<p key={`lore-${i}`} className="text-muted-foreground mt-1">
													<AutoLinkText text={note} />
												</p>
											))}
										</div>
										<div className="pt-2 border-t border-border">
											<div className="flex items-center gap-2 mb-1">
												<Shield className="w-4 h-4 text-primary" />
												<span className="text-xs font-display text-primary">WARDEN TIPS</span>
											</div>
											{rift.wardenTips.map((tip, i) => (
												<p key={`tip-${i}`} className="text-muted-foreground text-xs mt-1">
													{tip}
												</p>
											))}
										</div>
									</div>
								</AscendantWindow>

								{/* Map */}
								<div className="pt-4">
									<AscendantWindow title="RIFT MAP GENERATOR">
										<DungeonMapGenerator riftContext={legacyRiftContext!} />
									</AscendantWindow>
								</div>
							</div>
						) : (
							<AscendantWindow title="NO RIFT GENERATED">
								<div className="text-center py-12 text-muted-foreground">
									<p>Click "Generate Rift" to create a full Warden-ready adventure packet</p>
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
