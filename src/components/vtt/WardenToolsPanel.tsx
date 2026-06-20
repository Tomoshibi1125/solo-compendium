/**
 * Integrated Warden Tools Panel for VTT
 * Provides all essential Warden tools without leaving the VTT interface
 */

import {
	BookOpen,
	ChevronDown,
	Coins,
	Dice1,
	DoorOpen,
	ExternalLink,
	Eye,
	EyeOff,
	Heart,
	Image,
	Map as MapIcon,
	Minus,
	Settings,
	Skull,
	Sparkles,
	Sword,
	Users,
} from "lucide-react";
import type React from "react";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectiveLattice } from "@/components/warden-directives/DirectiveMatrix";
import { EmbeddedProvider } from "@/contexts/EmbeddedContext";
import type { VTTAsset } from "@/data/vttAssetLibrary";
import { useToast } from "@/hooks/use-toast";
import { useCampaignMembers } from "@/hooks/useCampaigns";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { useWardenAudio } from "@/hooks/useWardenAudio";
import { validateDiceString } from "@/lib/advancedDiceEngine";
import { MOOD_TAGS, SOUND_CATEGORIES } from "@/lib/audio/types";
import { cn } from "@/lib/utils";
import {
	AMBIENT_SOUND_PRESETS,
	TERRAIN_PRESETS,
	type WeatherType,
} from "@/lib/vtt";
import { useMacros } from "@/lib/vtt/rollMacros";
import { createVttTokenInstanceId } from "@/lib/vtt/sceneState";
import { PartyDashboardPanel } from "./PartyDashboardPanel";
import { VTTAssetBrowser } from "./VTTAssetBrowser";

const EncounterBuilder = lazy(() =>
	import("@/components/warden-directives/EncounterBuilder").then((m) => ({
		default: m.EncounterBuilder,
	})),
);
const GateGenerator = lazy(
	() => import("@/pages/warden-directives/GateGenerator"),
);
const NPCGenerator = lazy(() =>
	import("@/components/warden-directives/NPCGenerator").then((m) => ({
		default: m.NPCGenerator,
	})),
);
const RandomEventGenerator = lazy(
	() => import("@/pages/warden-directives/RandomEventGenerator"),
);
const RelicWorkshop = lazy(
	() => import("@/pages/warden-directives/RelicWorkshop"),
);
const RollableTables = lazy(
	() => import("@/pages/warden-directives/RollableTables"),
);
const TreasureGenerator = lazy(
	() => import("@/pages/warden-directives/TreasureGenerator"),
);
const TokenLibrary = lazy(
	() => import("@/pages/warden-directives/TokenLibrary"),
);
const DungeonMapGenerator = lazy(() =>
	import("@/components/warden-directives/DungeonMapGenerator").then((m) => ({
		default: m.DungeonMapGenerator,
	})),
);
const AIEnhancedArtGenerator = lazy(() =>
	import("@/components/art/AIEnhancedArtGenerator").then((m) => ({
		default: m.AIEnhancedArtGenerator,
	})),
);

const SECTION_PANEL_IDS = {
	macros: "warden-tools-macros-panel",
	music: "warden-tools-music-panel",
	atmosphereTerrain: "warden-tools-terrain-panel",
	atmosphereAmbient: "warden-tools-ambient-panel",
} as const;

type OpenSectionKey =
	| "macros"
	| "music"
	| "atmosphereLighting"
	| "atmosphereWeather"
	| "atmosphereTerrain"
	| "atmosphereAmbient";

const createInitialOpenSections = (
	isMobile: boolean,
): Record<OpenSectionKey, boolean> => ({
	macros: !isMobile,
	music: false,
	atmosphereLighting: !isMobile,
	atmosphereWeather: !isMobile,
	atmosphereTerrain: false,
	atmosphereAmbient: false,
});

export interface VTTTokenPayload {
	name: string;
	tokenType: "actor" | "prop" | "effect" | "handout";
	imageUrl?: string;
	size?: "small" | "medium" | "large" | "huge";
	id?: string;
}

export interface VTTEffectPayload {
	id?: string;
	name: string;
	type: "magic" | "light" | "dark" | "terrain" | "ambient" | "image";
	radius?: number;
	color?: string;
	x?: number;
	y?: number;
	imageUrl?: string;
}

interface WardenToolsPanelProps {
	campaignId?: string;
	/** Callback to roll dice into VTT chat (typically vttRealtime.rollAndBroadcast) */
	onRoll?: (formula: string, type?: "dice" | "wardenroll") => void;
	onAddToken?: (token: VTTTokenPayload) => void;
	onAddEffect?: (effect: VTTEffectPayload) => void;
	onPlaySound?: (soundId: string) => void;
	onMusicChange?: (musicId: string) => void;
	/** Mutates `currentScene.weather`; pass `null` to clear. */
	onWeatherChange?: (weather: WeatherType | null) => void;
	onChangeMap?: (imageUrl: string, name?: string) => void;
	onShareHandout?: (imageUrl: string, name?: string) => void;
	customAssets?: VTTAsset[];
	onUploadAsset?: (
		file: File,
		usage: "map" | "token",
	) => Promise<VTTAsset | null>;
	onDeleteAsset?: (asset: VTTAsset) => Promise<boolean>;
	isMobile?: boolean;
	className?: string;
}

export const WardenToolsPanel: React.FC<WardenToolsPanelProps> = ({
	campaignId,
	onRoll,
	onAddToken,
	onAddEffect,
	onPlaySound,
	onMusicChange,
	onWeatherChange,
	onChangeMap,
	onShareHandout,
	customAssets,
	onUploadAsset,
	onDeleteAsset,
	isMobile = false,
	className,
}) => {
	const { toast } = useToast();
	const ascendantTools = useAscendantTools();
	const navigate = useNavigate();

	// Internal audio engine — provides live playback whenever parent doesn't
	// supply onPlaySound / onMusicChange callbacks.
	const wardenAudio = useWardenAudio();
	const resolvedPlaySound = onPlaySound ?? wardenAudio.onPlaySound;
	const resolvedMusicChange = onMusicChange ?? wardenAudio.onMusicChange;
	const [activeTool, setActiveTool] = useState<string>("encounter");
	const [quickRollValue, setQuickRollValue] = useState("1d20");
	const [quickRollResult, setQuickRollResult] = useState<number | null>(null);
	// Transient confirmation shown after a VTT-wired roll, since the numeric
	// result appears in chat rather than locally. Cleared after 1500 ms.
	const [quickRollSent, setQuickRollSent] = useState(false);
	const { macros } = useMacros();
	const [openSections, setOpenSections] = useState<
		Record<OpenSectionKey, boolean>
	>(() => createInitialOpenSections(isMobile));
	useEffect(() => {
		setOpenSections(createInitialOpenSections(isMobile));
	}, [isMobile]);
	const toggleSection = (key: OpenSectionKey) =>
		setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

	// Session Notes — React-controlled with localStorage persistence
	const notesKey = `sa-session-notes-${campaignId || "local"}`;
	const [sessionNotes, setSessionNotes] = useState("");
	useEffect(() => {
		const saved = localStorage.getItem(notesKey);
		if (saved) setSessionNotes(saved);
	}, [notesKey]);

	const handleSaveNotes = useCallback(() => {
		if (sessionNotes.trim()) {
			localStorage.setItem(notesKey, sessionNotes);
			toast({
				title: "Notes Saved",
				description: "Session notes saved locally.",
			});
		}
	}, [notesKey, sessionNotes, toast]);

	const handleClearNotes = useCallback(() => {
		setSessionNotes("");
		localStorage.removeItem(notesKey);
		toast({ title: "Notes Cleared" });
	}, [notesKey, toast]);

	// Live Party Status from campaign members
	const { data: members = [] } = useCampaignMembers(campaignId || "");
	const _partyStats = useMemo(() => {
		const players = members.filter((m) => m.role === "ascendant");
		const levels = players
			.map((m) => (m as Record<string, unknown>).characters)
			.filter(Boolean)
			.map((c) => (c as { level?: number }).level ?? 1);
		const minLevel = levels.length > 0 ? Math.min(...levels) : 1;
		const maxLevel = levels.length > 0 ? Math.max(...levels) : 1;
		return {
			count: players.length,
			levelRange:
				minLevel === maxLevel ? `${minLevel}` : `${minLevel}-${maxLevel}`,
		};
	}, [members]);

	const logWardenMacro = (macroName: string, detail: string) => {
		ascendantTools
			.trackCustomFeatureUsage(
				"WARDEN",
				`Warden Macro: ${macroName}`,
				detail,
				"SA",
			)
			.catch(console.error);
	};

	// Quick roll — routes through VTT realtime engine (crit detection, chat broadcast, Supabase persistence)
	const handleQuickRoll = () => {
		if (!validateDiceString(quickRollValue)) {
			toast({
				title: "Invalid Roll",
				description: "Please use format like '1d20', '2d6', etc.",
				variant: "destructive",
			});
			return;
		}

		try {
			if (onRoll) {
				// Use VTT engine (Roll20-class: kh/kl, exploding, multi-term, crit detection)
				onRoll(quickRollValue, "dice");
				logWardenMacro("Quick Roll", quickRollValue);
				// The numeric result appears in VTT chat; show a transient local
				// confirmation so the user knows the button did something.
				setQuickRollResult(null);
				setQuickRollSent(true);
				window.setTimeout(() => setQuickRollSent(false), 1500);
			} else {
				// Offline fallback: simple local parser
				const match = quickRollValue.match(/(\d+)d(\d+)/);
				if (match) {
					const numDice = parseInt(match[1], 10);
					const dieSize = parseInt(match[2], 10);
					let total = 0;
					for (let i = 0; i < numDice; i++) {
						total += Math.floor(Math.random() * dieSize) + 1;
					}
					setQuickRollResult(total);
					toast({
						title: "Quick Roll",
						description: `${quickRollValue} = ${total}`,
					});
				}
			}
		} catch (_error) {
			toast({
				title: "Roll Error",
				description: "Critical failure in roll engine integration.",
				variant: "destructive",
			});
		}
	};

	// Quick sound effects — routed through SFX_ASSET_MAP via useWardenAudio.
	// Every id below maps to a real WAV file in public/audio/sfx/.
	const quickSounds = [
		{ id: "door-creak", name: "Door Creak", icon: "🚪" },
		{ id: "sword-clash", name: "Sword Clash", icon: "⚔️" },
		{ id: "sword-unsheath", name: "Sword Draw", icon: "🗡️" },
		{ id: "fireball", name: "Fireball", icon: "🔥" },
		{ id: "thunder", name: "Thunder", icon: "⛈️" },
		{ id: "heal", name: "Healing", icon: "✨" },
		{ id: "spell-cast", name: "Spell Cast", icon: "🪄" },
		{ id: "arrow-shot", name: "Arrow Shot", icon: "🏹" },
		{ id: "Anomaly-roar", name: "Anomaly Roar", icon: "👹" },
		{ id: "footstep-stone", name: "Footstep", icon: "👣" },
		{ id: "dice-roll", name: "Dice Roll", icon: "🎲" },
	];

	// Quick music moods — populated from MOOD_TAGS
	const quickMusic = [
		{ id: "stop", name: "Stop Music", mood: "stop" },
		...MOOD_TAGS.map((mood) => ({
			id: mood,
			name: mood.charAt(0).toUpperCase() + mood.slice(1),
			mood,
		})),
	];
	const sectionToggleClassName = cn(
		"flex w-full items-center justify-between text-xs text-foreground/70 hover:text-foreground",
		isMobile ? "min-h-11 py-2 text-sm" : "py-1",
	);
	const compactActionClassName = isMobile ? "min-h-11 min-w-11 text-sm" : "";
	const compactTextButtonClassName = isMobile ? "min-h-11 text-sm" : "";
	const protocolTabTriggerClassName = cn(
		"flex-col gap-1",
		isMobile ? "min-w-[72px] p-3" : "p-2 min-w-[56px]",
	);
	const generatorActionClassName = cn(
		"h-auto py-3 flex-col gap-1.5",
		isMobile && "min-h-16",
	);

	return (
		<EmbeddedProvider>
			<div
				data-mobile={isMobile ? "true" : "false"}
				className={cn(
					"flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-4rem)] pr-0.5",
					className,
				)}
			>
				{/* Quick Actions Bar */}
				<AscendantWindow title="QUICK ACTIONS" compact>
					<div className="grid grid-cols-2 gap-2">
						{/* Quick Dice Roll */}
						<div className="space-y-2">
							<Label className="text-xs">Quick Roll</Label>
							<div className="flex gap-1">
								<Input
									value={quickRollValue}
									onChange={(e) => setQuickRollValue(e.target.value)}
									placeholder="1d20"
									className={cn("h-8 text-xs", isMobile && "h-11 text-sm")}
								/>
								<Button
									size="sm"
									onClick={handleQuickRoll}
									className={cn("h-8", compactActionClassName)}
								>
									<Dice1 className="w-3 h-3" />
								</Button>
							</div>
							{quickRollResult !== null && (
								<div className="text-center text-xs font-bold text-primary">
									Result: {quickRollResult}
								</div>
							)}
							{quickRollSent && (
								<output
									data-testid="warden-tools-quick-roll-sent-confirm"
									className="text-center text-[11px] text-primary/80"
									aria-live="polite"
								>
									Sent to chat — see Chat tab
								</output>
							)}
						</div>
						<div className="space-y-2">
							<Label className="text-xs">
								Quick Samples ({SOUND_CATEGORIES.SFX})
							</Label>
							<div className="grid grid-cols-3 gap-1">
								{quickSounds.map((sound) => (
									<Button
										key={sound.id}
										size="sm"
										variant="outline"
										onClick={() => {
											resolvedPlaySound(sound.id);
											logWardenMacro("Sound Effect", sound.name);
										}}
										className={cn("h-8 text-xs p-1", compactActionClassName)}
										title={sound.name}
									>
										{sound.icon}
									</Button>
								))}
							</div>
						</div>
					</div>

					{/* Custom Macros Bar */}
					{macros.length > 0 && (
						<div className="pt-2 border-t border-border/50">
							<button
								type="button"
								className={sectionToggleClassName}
								onClick={() => toggleSection("macros")}
								aria-expanded={openSections.macros}
								aria-controls={SECTION_PANEL_IDS.macros}
							>
								<Label className="text-xs cursor-pointer">
									Saved Macros ({macros.length})
								</Label>
								<ChevronDown
									className={cn(
										"w-3 h-3 transition-transform",
										openSections.macros && "rotate-180",
									)}
								/>
							</button>
							<div
								id={SECTION_PANEL_IDS.macros}
								hidden={!openSections.macros}
								className="flex gap-1 overflow-x-auto pb-1 pt-1"
							>
								{macros.map((macro) => (
									<Button
										key={macro.id}
										size="sm"
										variant="secondary"
										onClick={() => {
											onRoll?.(macro.formula, "dice");
											logWardenMacro("Custom Macro", macro.name);
										}}
										className={cn(
											"h-8 text-[10px] px-2 shrink-0",
											isMobile && "h-11 px-3 text-xs",
										)}
										style={{ borderColor: macro.color }}
										title={`${macro.name}: ${macro.formula}`}
									>
										{macro.name.slice(0, 8)}
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Quick Music (Procedural Ambient — Zero Copyright) */}
					<div className="pt-2 border-t border-border/50">
						<button
							type="button"
							className={sectionToggleClassName}
							onClick={() => toggleSection("music")}
							aria-expanded={openSections.music}
							aria-controls={SECTION_PANEL_IDS.music}
						>
							<Label className="text-xs cursor-pointer">
								Ambient Music (Procedural)
							</Label>
							<ChevronDown
								className={cn(
									"w-3 h-3 transition-transform",
									openSections.music && "rotate-180",
								)}
							/>
						</button>
						<div
							id={SECTION_PANEL_IDS.music}
							hidden={!openSections.music}
							className="grid grid-cols-3 gap-1 max-h-40 overflow-y-auto pt-1"
						>
							{quickMusic.map((music) => (
								<Button
									key={music.id}
									size="sm"
									variant={music.id === "stop" ? "destructive" : "outline"}
									onClick={() => {
										resolvedMusicChange(music.id);
										logWardenMacro("Music Change", music.name);
									}}
									className={cn(
										"h-7 text-[10px] px-1 truncate",
										isMobile && "h-11 text-xs px-2",
									)}
								>
									{music.name}
								</Button>
							))}
						</div>
					</div>
				</AscendantWindow>

				{/* Full Warden Tools */}
				<AscendantWindow title="WARDEN PROTOCOLS">
					<Suspense
						fallback={
							<div className="p-8 flex justify-center w-full min-h-[300px] items-center">
								<Sparkles className="w-6 h-6 animate-spin opacity-50 mr-2" />{" "}
								<span className="text-sm text-foreground/70 animate-pulse">
									Initializing Protocol...
								</span>
							</div>
						}
					>
						<Tabs
							value={activeTool}
							onValueChange={setActiveTool}
							className="w-full"
						>
							<div className="overflow-x-auto pb-0.5">
								<TabsList className="flex flex-nowrap w-max min-w-full gap-1 h-auto p-1">
									<TabsTrigger
										value="encounter"
										className={protocolTabTriggerClassName}
									>
										<Sword className="w-4 h-4" />
										<span className="text-[10px]">Encounter</span>
									</TabsTrigger>
									<TabsTrigger
										value="generators"
										className={protocolTabTriggerClassName}
									>
										<Sparkles className="w-4 h-4" />
										<span className="text-[10px]">Generate</span>
									</TabsTrigger>
									<TabsTrigger
										value="assets"
										className={protocolTabTriggerClassName}
									>
										<BookOpen className="w-4 h-4" />
										<span className="text-[10px]">Assets</span>
									</TabsTrigger>
									<TabsTrigger
										value="tables"
										className={protocolTabTriggerClassName}
									>
										<Coins className="w-4 h-4" />
										<span className="text-[10px]">Tables</span>
									</TabsTrigger>
									<TabsTrigger
										value="tools"
										className={protocolTabTriggerClassName}
									>
										<Settings className="w-4 h-4" />
										<span className="text-[10px]">Tools</span>
									</TabsTrigger>
								</TabsList>
							</div>

							<TabsContent value="encounter" className="space-y-4">
								<EncounterBuilder embedded />
							</TabsContent>

							<TabsContent value="assets" className="space-y-4">
								<Tabs defaultValue="browser" className="w-full">
									<TabsList className="w-full grid grid-cols-2">
										<TabsTrigger value="browser">Asset Browser</TabsTrigger>
										<TabsTrigger value="tokens">Token Library</TabsTrigger>
									</TabsList>
									<TabsContent value="browser" className="pt-2">
										<VTTAssetBrowser
											campaignId={campaignId}
											customAssets={customAssets}
											onUploadAsset={onUploadAsset}
											onDeleteAsset={onDeleteAsset}
											onUseAsMap={(url, name) => onChangeMap?.(url, name)}
											onUseAsToken={(url, name) => {
												onAddToken?.({
													name: name,
													tokenType: "actor",
													imageUrl: url,
													size: "medium",
												});
											}}
											onUseAsEffect={(url, name) => {
												onAddEffect?.({
													id: createVttTokenInstanceId(),
													name: name,
													type: "image",
													x: 5,
													y: 5,
													radius: 4,
													color: "#ffffff",
													imageUrl: url,
												});
											}}
											onShareHandout={(url, name) =>
												onShareHandout?.(url, name)
											}
										/>
									</TabsContent>
									<TabsContent value="tokens" className="pt-2">
										<TokenLibrary />
									</TabsContent>
								</Tabs>
							</TabsContent>

							<TabsContent value="generators" className="mt-3">
								<div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-0.5">
									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className={generatorActionClassName}
											>
												<Users className="w-4 h-4" />
												<span className="text-xs">NPC</span>
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>NPC Generator</DialogTitle>
											</DialogHeader>
											<NPCGenerator />
										</DialogContent>
									</Dialog>

									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className={generatorActionClassName}
											>
												<DoorOpen className="w-4 h-4" />
												<span className="text-xs">Rift</span>
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>Rift Generator</DialogTitle>
											</DialogHeader>
											<GateGenerator />
										</DialogContent>
									</Dialog>

									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className={generatorActionClassName}
											>
												<Coins className="w-4 h-4" />
												<span className="text-xs">Treasure</span>
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>Treasure Generator</DialogTitle>
											</DialogHeader>
											<TreasureGenerator />
										</DialogContent>
									</Dialog>

									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className={generatorActionClassName}
											>
												<Skull className="w-4 h-4" />
												<span className="text-xs">Random</span>
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>Random Event Generator</DialogTitle>
											</DialogHeader>
											<RandomEventGenerator />
										</DialogContent>
									</Dialog>

									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className={generatorActionClassName}
											>
												<Heart className="w-4 h-4" />
												<span className="text-xs">Relic</span>
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>Relic Workshop</DialogTitle>
											</DialogHeader>
											<RelicWorkshop />
										</DialogContent>
									</Dialog>

									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"h-auto py-3 flex-col gap-1.5 border-fuchsia-500/30",
													isMobile && "min-h-16",
												)}
											>
												<MapIcon className="w-4 h-4 text-fuchsia-400" />
												<span className="text-xs text-fuchsia-400">
													Map Gen
												</span>
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>Dungeon Topology Synthesizer</DialogTitle>
											</DialogHeader>
											<DungeonMapGenerator className="min-h-[500px]" />
										</DialogContent>
									</Dialog>

									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"h-auto py-3 flex-col gap-1.5 border-blue-500/30",
													isMobile && "min-h-16",
												)}
											>
												<Image className="w-4 h-4 text-blue-400" />
												<span className="text-xs text-blue-400">Art AI</span>
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>AI Enhanced Art Generator</DialogTitle>
											</DialogHeader>
											<div className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-xl p-4">
												<AIEnhancedArtGenerator entityType="Anomaly" />
											</div>
										</DialogContent>
									</Dialog>

									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className={generatorActionClassName}
											>
												<BookOpen className="w-4 h-4" />
												<span className="text-xs">Directives</span>
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>Directive Lattice</DialogTitle>
											</DialogHeader>
											<DirectiveLattice />
										</DialogContent>
									</Dialog>

									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className={generatorActionClassName}
											>
												<Sparkles className="w-4 h-4" />
												<span className="text-xs">Effect</span>
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-lg">
											<DialogHeader>
												<DialogTitle>Quick Effect</DialogTitle>
											</DialogHeader>
											<div className="space-y-4">
												<div className="grid grid-cols-2 gap-2">
													{[
														"Fireball",
														"Healing",
														"Lightning",
														"Shield",
														"Poison",
														"Teleport",
													].map((effect) => (
														<Button
															key={effect}
															onClick={() => {
																onAddEffect?.({
																	id: createVttTokenInstanceId(),
																	name: effect,
																	type: "magic",
																	x: Math.random() * 10,
																	y: Math.random() * 10,
																	radius: 2,
																	color:
																		effect === "Fireball"
																			? "#ff6b6b"
																			: effect === "Healing"
																				? "#51cf66"
																				: "#339af0",
																});
																logWardenMacro("Visual Effect", effect);
																toast({
																	title: "Effect Added",
																	description: `${effect} effect placed on map`,
																});
															}}
															className={cn(
																"h-10 text-xs",
																isMobile && "min-h-11 text-sm",
															)}
														>
															{effect}
														</Button>
													))}
												</div>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</TabsContent>

							<TabsContent value="tables" className="space-y-4">
								<RollableTables />
							</TabsContent>

							<TabsContent value="tools" className="space-y-4 mt-3">
								<AscendantWindow title="SESSION NOTES" compact>
									<textarea
										className={cn(
											"w-full h-32 p-2 text-xs bg-background border border-border rounded resize-none",
											isMobile && "min-h-40 text-sm",
										)}
										placeholder="Jot down key moments, NPC reactions, player decisions..."
										value={sessionNotes}
										onChange={(e) => setSessionNotes(e.target.value)}
									/>
									<div className="flex gap-2 mt-2">
										<Button
											size="sm"
											className={cn("flex-1", compactTextButtonClassName)}
											onClick={handleSaveNotes}
											disabled={!sessionNotes.trim()}
										>
											Save
										</Button>
										<Button
											size="sm"
											variant="outline"
											className={compactTextButtonClassName}
											onClick={handleClearNotes}
											disabled={!sessionNotes}
										>
											Clear
										</Button>
									</div>
								</AscendantWindow>

								<AscendantWindow title="PARTY STATUS" compact>
									<PartyDashboardPanel
										rawMembers={members}
										campaignId={campaignId}
									/>
									<div className="mt-4 pt-4 border-t border-border/50">
										<Button
											variant="secondary"
											className={cn(
												"w-full h-10 gap-2 border border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500/10",
												compactTextButtonClassName,
											)}
											aria-label="Open the Run Silent module book"
											onClick={() => navigate("/source-book/module")}
										>
											<BookOpen className="w-4 h-4" />
											Read Module Book
										</Button>
									</div>
								</AscendantWindow>

								<AscendantWindow title="EXTERNAL SYSTEMS" compact>
									<div className="space-y-2">
										<Button
											variant="outline"
											className={cn(
												"w-full justify-between h-9 text-xs",
												compactTextButtonClassName,
											)}
											aria-label="Open Party Tracker"
											onClick={() => {
												const target = campaignId
													? `/warden-directives/party-tracker?campaignId=${campaignId}`
													: "/warden-directives/party-tracker";
												navigate(target);
											}}
										>
											Open Party Tracker
											<ExternalLink className="w-3 h-3 ml-2" />
										</Button>
										<Button
											variant="outline"
											className={cn(
												"w-full justify-between h-9 text-xs",
												compactTextButtonClassName,
											)}
											aria-label="Open Session Planner"
											onClick={() => {
												const target = campaignId
													? `/warden-directives/session-planner?campaignId=${campaignId}`
													: "/warden-directives/session-planner";
												navigate(target);
											}}
										>
											Open Session Planner
											<ExternalLink className="w-3 h-3 ml-2" />
										</Button>
										<Button
											variant="outline"
											className={cn(
												"w-full justify-between h-9 text-xs",
												compactTextButtonClassName,
											)}
											aria-label="Open Warden Journal"
											onClick={() => {
												// Campaign-scoped route when we have an id, otherwise
												// the standalone Warden-directives journal surface.
												const target = campaignId
													? `/campaigns/${campaignId}/journal`
													: "/warden-directives/vtt-journal";
												navigate(target);
											}}
										>
											Open Warden Journal
											<ExternalLink className="w-3 h-3 ml-2" />
										</Button>
									</div>
								</AscendantWindow>

								<AscendantWindow title="ATMOSPHERE" compact>
									<div className="space-y-3">
										{/* Lighting — always visible, just 3 buttons */}
										<div>
											<Label className="text-xs">Lighting</Label>
											<div className="flex gap-2 mt-1">
												<Button
													size="sm"
													variant="outline"
													className={compactActionClassName}
													aria-label="Place a bright light source on the scene"
													onClick={() => {
														onAddEffect?.({
															id: createVttTokenInstanceId(),
															name: "Bright Light",
															type: "light",
															radius: 10,
															color: "#fff59d",
														});
														logWardenMacro("Lighting", "Bright Light");
													}}
												>
													<Eye className="w-3 h-3" />
												</Button>
												<Button
													size="sm"
													variant="outline"
													className={compactActionClassName}
													aria-label="Place a dim light source on the scene"
													onClick={() => {
														onAddEffect?.({
															id: createVttTokenInstanceId(),
															name: "Dim Light",
															type: "light",
															radius: 5,
															color: "#ffecb3",
														});
														logWardenMacro("Lighting", "Dim Light");
													}}
												>
													<EyeOff className="w-3 h-3" />
												</Button>
												<Button
													size="sm"
													variant="outline"
													className={compactActionClassName}
													aria-label="Place a darkness source on the scene"
													onClick={() => {
														onAddEffect?.({
															id: createVttTokenInstanceId(),
															name: "Darkness",
															type: "dark",
															radius: 8,
															color: "#000000",
														});
														logWardenMacro("Lighting", "Darkness");
													}}
												>
													<Minus className="w-3 h-3" />
												</Button>
											</div>
										</div>

										{/* Weather — plays SFX AND mutates currentScene.weather so the
										     canvas overlay updates. Clear button removes the overlay. */}
										<div>
											<Label className="text-xs">Weather</Label>
											<div className="flex gap-2 mt-1">
												<Button
													size="sm"
													variant="outline"
													className={compactActionClassName}
													aria-label="Set weather to rain"
													title="Rain"
													onClick={() => {
														resolvedPlaySound("rain");
														onWeatherChange?.("rain");
														logWardenMacro("Weather", "Rain");
													}}
												>
													🌧️
												</Button>
												<Button
													size="sm"
													variant="outline"
													className={compactActionClassName}
													aria-label="Set weather to thunderstorm"
													title="Thunderstorm"
													onClick={() => {
														resolvedPlaySound("thunder");
														onWeatherChange?.("thunderstorm");
														logWardenMacro("Weather", "Thunder");
													}}
												>
													⛈️
												</Button>
												<Button
													size="sm"
													variant="outline"
													className={compactActionClassName}
													aria-label="Set weather to wind"
													title="Wind"
													onClick={() => {
														resolvedPlaySound("wind");
														onWeatherChange?.("wind");
														logWardenMacro("Weather", "Wind");
													}}
												>
													💨
												</Button>
												<Button
													size="sm"
													variant="ghost"
													aria-label="Clear weather"
													title="Clear"
													className={cn("text-xs", compactActionClassName)}
													onClick={() => {
														onWeatherChange?.(null);
														logWardenMacro("Weather", "Clear");
													}}
												>
													Clear
												</Button>
											</div>
										</div>

										{/* Terrain Effects — collapsible + scrollable */}
										<div className="pt-2 border-t border-border/50">
											<button
												type="button"
												className={sectionToggleClassName}
												onClick={() => toggleSection("atmosphereTerrain")}
												aria-expanded={openSections.atmosphereTerrain}
												aria-controls={SECTION_PANEL_IDS.atmosphereTerrain}
											>
												<Label className="text-xs cursor-pointer">
													Terrain Effects
												</Label>
												<ChevronDown
													className={cn(
														"w-3 h-3 transition-transform",
														openSections.atmosphereTerrain && "rotate-180",
													)}
												/>
											</button>
											<div
												id={SECTION_PANEL_IDS.atmosphereTerrain}
												hidden={!openSections.atmosphereTerrain}
												className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pt-1"
											>
												{Object.entries(TERRAIN_PRESETS).map(([id, t]) => (
													<Button
														key={id}
														size="sm"
														variant="outline"
														className={cn(
															"text-[10px] h-7 px-2 border-primary/20 hover:border-primary/50",
															isMobile && "h-11 text-xs px-3",
														)}
														onClick={() => {
															onAddEffect?.({
																id: `terrain-${Date.now()}`,
																name: t.label || id,
																type: "terrain",
																radius: 8,
																color: t.fillColor,
															});
															logWardenMacro("Terrain", t.label || id);
														}}
													>
														{t.label || id}
													</Button>
												))}
											</div>
										</div>

										{/* Ambient Audio Zones — collapsible + scrollable */}
										<div className="pt-2 border-t border-border/50">
											<button
												type="button"
												className={sectionToggleClassName}
												onClick={() => toggleSection("atmosphereAmbient")}
												aria-expanded={openSections.atmosphereAmbient}
												aria-controls={SECTION_PANEL_IDS.atmosphereAmbient}
											>
												<Label className="text-xs cursor-pointer">
													Ambient Audio Zones
												</Label>
												<ChevronDown
													className={cn(
														"w-3 h-3 transition-transform",
														openSections.atmosphereAmbient && "rotate-180",
													)}
												/>
											</button>
											<div
												id={SECTION_PANEL_IDS.atmosphereAmbient}
												hidden={!openSections.atmosphereAmbient}
												className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pt-1"
											>
												{Object.entries(AMBIENT_SOUND_PRESETS).map(
													([id, s]) => (
														<Button
															key={id}
															size="sm"
															variant="outline"
															className={cn(
																"text-[10px] h-7 px-2 border-indigo-500/30 text-indigo-300 hover:border-indigo-400",
																isMobile && "h-11 text-xs px-3",
															)}
															onClick={() => {
																onAddEffect?.({
																	id: `ambient-${Date.now()}`,
																	name: s.label || id,
																	type: "ambient",
																	radius: Math.floor((s.radius || 10) / 5),
																	color: "#6366f1",
																});
																logWardenMacro("Ambient Zone", s.label || id);
															}}
														>
															{s.label || id}
														</Button>
													),
												)}
											</div>
										</div>
									</div>
								</AscendantWindow>
							</TabsContent>
						</Tabs>
					</Suspense>
				</AscendantWindow>
			</div>
		</EmbeddedProvider>
	);
};
