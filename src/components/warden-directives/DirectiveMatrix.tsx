import {
	Clock,
	Copy,
	FileJson,
	FileText,
	Loader2,
	Skull,
	Sparkles,
	Target,
	Users,
	Wand2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useCampaignToolState, useUserToolState } from "@/hooks/useToolState";
import {
	getRandomEquipment,
	getRandomFeat,
	getRandomRune,
} from "@/lib/compendiumAutopopulate";
import {
	emptyHistory,
	type GenerationHistoryState,
	makeEntryId,
	pushGeneration,
	removeGeneration,
	restoreGeneration,
	togglePin,
} from "@/lib/generationHistory";
import { rankToGateBadge } from "@/lib/rankColors";
import { downloadJson, downloadMarkdown } from "@/lib/toolExport";
import { formatRegentVernacular } from "@/lib/vernacular";
import { AIContentGenerator } from "../AIContentGeneratorClass";
import { AutoLinkText } from "../compendium/AutoLinkText";
import { ManaFlowText } from "../ui/AscendantText";
import { AscendantWindow } from "../ui/AscendantWindow";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { GenerationHistoryPanel } from "./GenerationHistoryPanel";

// --- Constants ---

const DIRECTIVE_RANKS = ["E", "D", "C", "B", "A", "S"] as const;

const DIRECTIVE_TYPES = [
	"Rift Clearance",
	"Rescue Mission",
	"Investigation",
	"Defense",
	"Extermination",
	"Retrieval",
	"Escort",
	"Reconnaissance",
	"Assassination",
	"Delivery",
	"Main Operation",
	"Localized Contract",
	"Faction Mandate",
] as const;

const DIRECTIVE_LOCATIONS = [
	"Urban Rift",
	"Forest Rift",
	"Underground Rift",
	"Sky Rift",
	"Abyssal Rift",
	"Umbral Rift",
	"Elemental Rift",
	"Beast Rift",
	"Construct Rift",
	"Necromantic Rift",
	"Celestial Rift",
	"Dimensional Rift",
] as const;

const DIRECTIVE_COMPLICATIONS = [
	"Time limit: Must complete within X hours",
	"Multiple Rifts: Series of connected Rifts",
	"Environmental hazard: Extreme weather or terrain",
	"Rival ascendants: Competing teams want the reward",
	"Hidden objective: True goal is different from stated",
	"Betrayal: NPC contact is untrustworthy",
	"Escalation: Situation worsens during mission",
	"Information blackout: Limited communication",
	"Political interference: Awakened Council politics",
	"Regent involvement: Umbral Regent fragments detected",
] as const;

const DIRECTIVE_REWARDS = [
	"Standard Rift rewards",
	"Rift Credits",
	"Core Credits",
	"Crystal Credits",
	"Mana Credits",
	"Mana Credit chips",
	"Rare material access",
	"Awakened Council favor",
	"Relic fragment",
	"Exclusive information",
	"Guild recommendation",
	"Special equipment",
	"System favor bonus",
	"The Absolute blessing",
] as const;

const DIRECTIVE_STAKES: Record<string, string> = {
	"Rift Clearance":
		"Left uncleared, the Rift stabilizes and begins to expand past its containment perimeter.",
	"Rescue Mission":
		"For every hour lost, another trapped soul is claimed by the Interior.",
	Investigation:
		"Unresolved, the anomaly's source spreads and corrupts the surrounding district.",
	Defense:
		"A breach overruns the line and the Rift floods into populated ground.",
	Extermination:
		"The target grows stronger and begins hunting the team in turn.",
	Retrieval: "The asset is destroyed or seized by a rival faction.",
	Escort: "The principal is lost — and with them, the mission's purpose.",
	Reconnaissance:
		"Discovery alerts the enemy, who relocate and fortify before the next strike.",
	Assassination: "The mark goes to ground and the contract is exposed.",
	Delivery: "The cargo spoils or falls into the wrong hands.",
};
const DEFAULT_STAKES =
	"Failure escalates the situation and forfeits the allocated compensation.";

// --- Interfaces ---

interface GeneratedDirective {
	id: string;
	type: string;
	title: string;
	rank: string;
	location: string;
	description: string;
	objectives: string[];
	complications: string[];
	stakes: string;
	rewards: string[];
	timeLimit?: string;
	aiEnhanced?: string;
}

interface DirectiveState {
	genMode: "quick" | "deep";
	selectedRank: string;
	quickHistory: GenerationHistoryState<GeneratedDirective>;
	deepDirectiveContent: string;
	deepForm: {
		directiveType: string;
		difficulty: string;
		setting: string;
		additionalDetails: string;
	};
}

// --- Local Generator Logic ---

function generateRandomDirective(rank?: string): GeneratedDirective {
	const selectedRank =
		rank || DIRECTIVE_RANKS[Math.floor(Math.random() * DIRECTIVE_RANKS.length)];
	const type =
		DIRECTIVE_TYPES[Math.floor(Math.random() * DIRECTIVE_TYPES.length)];
	const location =
		DIRECTIVE_LOCATIONS[Math.floor(Math.random() * DIRECTIVE_LOCATIONS.length)];

	const title = `${type} at ${location}`;

	const descriptions: Record<string, string> = {
		"Rift Clearance": `Clear the ${location} and eliminate all threats. The Awakened Council has marked this Rift for immediate clearance.`,
		"Rescue Mission": `A group of civilians/ascendants are trapped within the ${location}. Extract them safely before it's too late.`,
		Investigation: `Strange activity detected in the ${location}. Investigate the source and report findings to the Awakened Council.`,
		Defense: `Defend a location from an incoming Rift breach. Hold the line until reinforcements arrive.`,
		Extermination: `Eliminate a specific threat within the ${location}. Target is particularly dangerous and must be destroyed.`,
		Retrieval: `Recover a valuable item or artifact from within the ${location}. Item is critical and must not be damaged.`,
		Escort: `Escort an important individual through the ${location}. Protect them at all costs.`,
		Reconnaissance: `Gather intelligence about the ${location}. Avoid combat if possible; stealth is key.`,
		Assassination: `Eliminate a specific high-value target within the ${location}. Mission is classified and off the books.`,
		Delivery: `Deliver supplies or information through dangerous territory to the ${location}. Time-sensitive cargo.`,
	};

	const description =
		descriptions[type] || `Complete the ${type} mission at ${location}.`;

	const numObjectives = 2 + Math.floor(Math.random() * 3);
	const objectives: string[] = [`Reach the ${location}`];

	switch (type) {
		case "Rift Clearance":
			objectives.push(
				"Eliminate all Anomalies",
				"Clear the Rift boss",
				"Secure the Rift core",
			);
			break;
		case "Rescue Mission":
			objectives.push("Locate trapped individuals", "Extract survivors");
			break;
		case "Investigation":
			objectives.push("Gather evidence", "Identify the threat level");
			break;
		case "Defense":
			objectives.push("Hold for specified duration", "Protect infrastructure");
			break;
	}

	const numComplications = Math.floor(Math.random() * 2);
	const complications: string[] = [];
	const shuffled = [...DIRECTIVE_COMPLICATIONS].sort(() => Math.random() - 0.5);
	for (let i = 0; i < numComplications && i < shuffled.length; i++) {
		complications.push(shuffled[i]);
	}

	const numRewards = 1 + Math.floor(Math.random() * 2);
	const rewards: string[] = [];
	const shuffledRewards = [...DIRECTIVE_REWARDS].sort(
		() => Math.random() - 0.5,
	);
	for (let i = 0; i < numRewards && i < shuffledRewards.length; i++) {
		rewards.push(shuffledRewards[i]);
	}

	const timeLimit =
		Math.random() < 0.3
			? `${4 + Math.floor(Math.random() * 12)} hours`
			: undefined;

	return {
		id: makeEntryId(),
		type,
		title: formatRegentVernacular(title),
		rank: selectedRank,
		location: formatRegentVernacular(location),
		description: formatRegentVernacular(description),
		objectives: objectives.slice(0, numObjectives).map(formatRegentVernacular),
		complications: complications.map(formatRegentVernacular),
		stakes: formatRegentVernacular(DIRECTIVE_STAKES[type] ?? DEFAULT_STAKES),
		rewards: rewards.map(formatRegentVernacular),
		timeLimit,
	};
}

function directiveToMarkdown(d: GeneratedDirective): string {
	return formatRegentVernacular(`# ${d.title}

- **Type:** ${d.type}
- **Rank:** ${d.rank}
- **Location:** ${d.location}${d.timeLimit ? `\n- **Time Limit:** ${d.timeLimit}` : ""}

${d.description}

## Objectives
${d.objectives.map((o) => `- ${o}`).join("\n")}
${
	d.complications.length > 0
		? `\n## Complications\n${d.complications.map((c) => `- ${c}`).join("\n")}\n`
		: ""
}
## Stakes
${d.stakes}

## Allocated Compensation
${d.rewards.map((r) => `- ${r}`).join("\n")}
${d.aiEnhanced ? `\n## Warden Briefing (AI)\n${d.aiEnhanced}\n` : ""}`);
}

// --- Component ---

export interface DirectiveLatticeProps {
	/** When set, the tool persists to the campaign (shared) instead of the user. */
	campaignId?: string | null;
}

export function DirectiveLattice({ campaignId }: DirectiveLatticeProps = {}) {
	const { toast } = useToast();
	const { isEnhancing, enhance, clearEnhanced } = useAIEnhance();

	// Persistence: user-scoped by default; campaign-scoped (shared, round-trips
	// to campaign_tool_states) when a campaign is selected — mirrors EncounterBuilder.
	const isCampaignScoped = !!campaignId;
	const persistenceContext = campaignId ? `campaign:${campaignId}` : "user";

	const initialDirectiveState: DirectiveState = {
		genMode: "quick",
		selectedRank: "random",
		quickHistory: emptyHistory<GeneratedDirective>(),
		deepDirectiveContent: "",
		deepForm: {
			directiveType: DIRECTIVE_TYPES[0],
			difficulty: "Medium",
			setting: "",
			additionalDetails: "",
		},
	};

	const userToolState = useUserToolState<DirectiveState>("directive_Lattice", {
		initialState: initialDirectiveState,
		storageKey: "solo-compendium.Warden-tools.directive-Lattice.v1",
		enabled: !isCampaignScoped,
	});
	const campaignToolState = useCampaignToolState<DirectiveState>(
		campaignId ?? null,
		"directive_Lattice",
		{
			initialState: initialDirectiveState,
			storageKey: `solo-compendium.Warden-tools.directive-Lattice.v1.${campaignId ?? "none"}`,
			enabled: isCampaignScoped,
		},
	);
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = isCampaignScoped ? campaignToolState : userToolState;

	const [genMode, setGenMode] = useState<"quick" | "deep">("quick");
	const [selectedRank, setSelectedRank] = useState<string>("random");
	const [quickHist, setQuickHist] = useState<
		GenerationHistoryState<GeneratedDirective>
	>(emptyHistory<GeneratedDirective>());
	const quickDirective = quickHist.current;
	const [deepDirectiveContent, setDeepDirectiveContent] = useState("");

	// Form states for Deep Synthesis
	const [directiveType, setDirectiveType] = useState<string>(
		DIRECTIVE_TYPES[0],
	);
	const [difficulty, setDifficulty] = useState("Medium");
	const [setting, setSetting] = useState("");
	const [additionalDetails, setAdditionalDetails] = useState("");

	const [isGeneratingDeep, setIsGeneratingDeep] = useState(false);

	// Hydration — re-runs when the persistence context (user ⇄ campaign) changes.
	const hydratedContextRef = useRef<string | null>(null);
	useEffect(() => {
		if (isLoading) return;
		if (hydratedContextRef.current === persistenceContext) return;

		setGenMode(storedState.genMode);
		setSelectedRank(storedState.selectedRank);

		const raw = storedState as unknown as {
			quickHistory?: GenerationHistoryState<GeneratedDirective>;
			quickDirective?: GeneratedDirective | null;
		};
		if (Array.isArray(raw.quickHistory?.history)) {
			setQuickHist(raw.quickHistory);
		} else if (raw.quickDirective) {
			// Migrate the legacy single-directive shape.
			setQuickHist({
				current: {
					...raw.quickDirective,
					id: raw.quickDirective.id ?? makeEntryId(),
					stakes: raw.quickDirective.stakes ?? DEFAULT_STAKES,
				},
				history: [],
			});
		}

		setDeepDirectiveContent(storedState.deepDirectiveContent);

		if (storedState.deepForm) {
			setDirectiveType(
				storedState.deepForm.directiveType || DIRECTIVE_TYPES[0],
			);
			setDifficulty(storedState.deepForm.difficulty || "Medium");
			setSetting(storedState.deepForm.setting || "");
			setAdditionalDetails(storedState.deepForm.additionalDetails || "");
		}

		hydratedContextRef.current = persistenceContext;
	}, [storedState, isLoading, persistenceContext]);

	// Auto-save logic
	const savePayload = useMemo(
		(): DirectiveState => ({
			genMode,
			selectedRank,
			quickHistory: quickHist,
			deepDirectiveContent,
			deepForm: {
				directiveType,
				difficulty,
				setting,
				additionalDetails,
			},
		}),
		[
			genMode,
			selectedRank,
			quickHist,
			deepDirectiveContent,
			directiveType,
			difficulty,
			setting,
			additionalDetails,
		],
	);

	const debouncedPayload = useDebounce(savePayload, 500);

	useEffect(() => {
		if (isLoading || hydratedContextRef.current !== persistenceContext) return;
		void saveNow(debouncedPayload);
	}, [debouncedPayload, isLoading, saveNow, persistenceContext]);

	const handleQuickGenerate = async () => {
		clearEnhanced();
		const rank = selectedRank === "random" ? undefined : selectedRank;
		const baseDirective = generateRandomDirective(rank);

		// Integration: Pull real rewards
		try {
			const [realEquip, realRune, realFeat] = await Promise.all([
				getRandomEquipment(baseDirective.rank),
				getRandomRune(),
				getRandomFeat(),
			]);

			if (realEquip) {
				baseDirective.rewards = [
					realEquip.name,
					...baseDirective.rewards.slice(1),
				];
			}
			if (realRune) {
				baseDirective.rewards = [
					...baseDirective.rewards,
					`Rune: ${realRune.name}`,
				];
			}
			if (realFeat) {
				baseDirective.rewards = [
					...baseDirective.rewards,
					`Feat Training: ${realFeat.name}`,
				];
			}
		} catch (e) {
			console.warn("Failed to fetch real rewards", e);
		}

		setQuickHist((prev) =>
			pushGeneration(
				prev,
				baseDirective,
				`${baseDirective.title} · Rank ${baseDirective.rank}`,
			),
		);
		toast({
			title: "Directive Synthesized",
			description: "Operational parameters established.",
		});
	};

	const updateCurrentDirective = (
		updater: (current: GeneratedDirective) => GeneratedDirective,
	) => {
		setQuickHist((prev) => {
			if (!prev.current) return prev;
			const next = updater(prev.current);
			return {
				current: next,
				history: prev.history.map((entry) =>
					entry.id === next.id ? { ...entry, record: next } : entry,
				),
			};
		});
	};

	const handleDeepGenerate = async () => {
		if (!setting.trim()) {
			toast({
				title: "Setting required",
				description: "Please provide a setting or location for the directive.",
				variant: "destructive",
			});
			return;
		}

		setIsGeneratingDeep(true);
		setDeepDirectiveContent("");
		try {
			const prompt = `Generate a detailed ${directiveType.toLowerCase()} for a Rift Ascendant campaign.

Directive Details:
- Type: ${directiveType}
- Rank/Difficulty: ${difficulty}
- Setting/Location: ${setting}
${additionalDetails ? `- Additional Details: ${additionalDetails}` : ""}

Please provide a complete directive structure using Rift Ascendant terminology.`;

			const aiGenerator = new AIContentGenerator();
			const result = await aiGenerator.generateContent(prompt, {
				type: "quest",
				tone: "epic",
				length: "long",
				complexity: "moderate",
			});

			setDeepDirectiveContent(result.content);
			toast({
				title: "Directive Manifested",
				description: "Deep synthesis complete.",
			});
		} catch (_error) {
			toast({
				title: "Synthesis failed",
				description: "Grid interference detected. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsGeneratingDeep(false);
		}
	};

	const handleAIEnhance = async () => {
		if (!quickDirective) return;
		const seed = `Generate a complete, detailed directive briefing for a Rift Ascendant TTRPG campaign based on this quick seed:
    Title: ${quickDirective.title}, Rank: ${quickDirective.rank}, Location: ${quickDirective.location}, Objectives: ${quickDirective.objectives.join("; ")}, Stakes: ${quickDirective.stakes}.
    Include: Overview, Detailed Objectives, 2-3 Encounter sketches, Complications, Rewards, and a Read-Aloud intro.`;
		const result = await enhance("quest", seed);
		if (result) {
			updateCurrentDirective((current) => ({ ...current, aiEnhanced: result }));
		}
	};

	const copyToClipboard = (text: string) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		toast({
			title: "Copied!",
			description: "Directive parameters copied to clipboard.",
		});
	};

	const getRankColor = (rank: string) => rankToGateBadge(rank);

	return (
		<AscendantWindow
			title="DIRECTIVE Lattice"
			className="flex flex-col min-h-[400px]"
		>
			<div className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-thin">
				<div className="flex bg-muted/20 p-1 rounded-md mb-2">
					<Button
						variant={genMode === "quick" ? "secondary" : "ghost"}
						size="sm"
						onClick={() => setGenMode("quick")}
						className="flex-1 text-xs"
					>
						Quick Sync
					</Button>
					<Button
						variant={genMode === "deep" ? "secondary" : "ghost"}
						size="sm"
						onClick={() => setGenMode("deep")}
						className="flex-1 text-xs"
					>
						Deep Synthesis
					</Button>
				</div>

				<ManaFlowText
					variant="rift"
					speed="fast"
					className="text-[11px] opacity-70 mb-2"
				>
					{genMode === "quick"
						? "SYNT_PARAM: FAST_EXPTRAPOLATION_ACTIVE"
						: "SYNT_PARAM: DEEP_Lattice_RECURSION_ACTIVE"}
				</ManaFlowText>

				{genMode === "quick" ? (
					<div className="space-y-4">
						<div>
							<Label htmlFor="rank-select" className="text-xs mb-1 block">
								Priority Rank
							</Label>
							<Select value={selectedRank} onValueChange={setSelectedRank}>
								<SelectTrigger id="rank-select" className="h-8">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="random">Randomized</SelectItem>
									{DIRECTIVE_RANKS.map((r) => (
										<SelectItem key={r} value={r}>
											Rank {r}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<Button
							onClick={handleQuickGenerate}
							className="w-full btn-umbral h-9 gap-2"
						>
							<Target className="w-4 h-4" />
							Generate Quick Directive
						</Button>

						{quickDirective && (
							<div className="space-y-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2">
								<div className="flex items-center justify-between">
									<h3 className="font-heading font-bold text-lg text-primary">
										{quickDirective.title}
									</h3>
									<Badge className={getRankColor(quickDirective.rank)}>
										Rank {quickDirective.rank}
									</Badge>
								</div>

								<div className="flex gap-2 flex-wrap">
									<Badge variant="outline" className="text-[11px] gap-1">
										<Users className="w-3 h-3" /> {quickDirective.location}
									</Badge>
									{quickDirective.timeLimit && (
										<Badge
											variant="outline"
											className="text-[11px] gap-1 text-warning border-warning/30"
										>
											<Clock className="w-3 h-3" /> {quickDirective.timeLimit}
										</Badge>
									)}
								</div>

								<div className="text-sm text-balance leading-relaxed">
									<AutoLinkText text={quickDirective.description} />
								</div>

								<div className="grid grid-cols-1 gap-3">
									<div>
										<Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
											Objectives
										</Label>
										<ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground/80">
											{quickDirective.objectives.map((o) => (
												<li key={o}>
													<AutoLinkText text={o} />
												</li>
											))}
										</ul>
									</div>

									{quickDirective.complications.length > 0 && (
										<div>
											<Label className="text-[11px] uppercase tracking-wider text-warning/80">
												Complications
											</Label>
											<ul className="list-disc list-inside text-xs space-y-1 mt-1 text-warning/70">
												{quickDirective.complications.map((c) => (
													<li key={c}>
														<AutoLinkText text={c} />
													</li>
												))}
											</ul>
										</div>
									)}

									<div>
										<Label className="text-[11px] uppercase tracking-wider text-destructive/80 flex items-center gap-1">
											<Skull className="w-3 h-3" /> Stakes
										</Label>
										<div className="text-xs mt-1 text-destructive/70">
											<AutoLinkText text={quickDirective.stakes} />
										</div>
									</div>

									<div>
										<Label className="text-[11px] uppercase tracking-wider text-success/80">
											Allocated Compensation
										</Label>
										<ul className="list-disc list-inside text-xs space-y-1 mt-1 text-success/70">
											{quickDirective.rewards.map((r) => (
												<li key={r}>
													<AutoLinkText text={r} />
												</li>
											))}
										</ul>
									</div>
								</div>

								<div className="flex flex-wrap gap-2 pt-2">
									<Button
										variant="outline"
										size="sm"
										className="h-8 gap-1 text-[11px]"
										onClick={handleAIEnhance}
										disabled={isEnhancing}
									>
										{isEnhancing ? (
											<Loader2 className="w-3 h-3 animate-spin" />
										) : (
											<Sparkles className="w-3 h-3" />
										)}
										Enhance
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="h-8 gap-1 text-[11px]"
										onClick={() =>
											copyToClipboard(directiveToMarkdown(quickDirective))
										}
									>
										<Copy className="w-3 h-3" /> Copy
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="h-8 gap-1 text-[11px]"
										onClick={() =>
											downloadMarkdown(
												`directive-${quickDirective.title}`,
												directiveToMarkdown(quickDirective),
											)
										}
									>
										<FileText className="w-3 h-3" /> Markdown
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="h-8 gap-1 text-[11px]"
										onClick={() =>
											downloadJson(
												`directive-${quickDirective.title}`,
												quickDirective,
											)
										}
									>
										<FileJson className="w-3 h-3" /> JSON
									</Button>
								</div>

								{quickDirective.aiEnhanced && (
									<div className="bg-primary/5 p-3 rounded text-xs whitespace-pre-line max-h-60 overflow-y-auto border border-primary/30">
										<AutoLinkText text={quickDirective.aiEnhanced} />
									</div>
								)}
							</div>
						)}

						<GenerationHistoryPanel
							state={quickHist}
							onRestore={(id) =>
								setQuickHist((prev) => restoreGeneration(prev, id))
							}
							onTogglePin={(id) => setQuickHist((prev) => togglePin(prev, id))}
							onRemove={(id) =>
								setQuickHist((prev) => removeGeneration(prev, id))
							}
						/>
					</div>
				) : (
					<div className="space-y-3">
						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-1">
								<Label className="text-[11px]">Job Priority</Label>
								<Select value={directiveType} onValueChange={setDirectiveType}>
									<SelectTrigger className="h-7 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{DIRECTIVE_TYPES.map((t) => (
											<SelectItem key={t} value={t}>
												{t}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-1">
								<Label className="text-[11px]">Difficulty</Label>
								<Select value={difficulty} onValueChange={setDifficulty}>
									<SelectTrigger className="h-7 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{["Easy", "Medium", "Hard", "Deadly"].map((d) => (
											<SelectItem key={d} value={d}>
												{d}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-1">
							<Label className="text-[11px]">Setting / Location</Label>
							<Input
								placeholder="The Iron Spire, Umbral Waste..."
								value={setting}
								onChange={(e) => setSetting(e.target.value)}
								className="h-8 text-xs"
							/>
						</div>

						<div className="space-y-1">
							<Label className="text-[11px]">Additional Directives</Label>
							<Textarea
								placeholder="Include specific Regents, NPCs, or items..."
								value={additionalDetails}
								onChange={(e) => setAdditionalDetails(e.target.value)}
								className="text-xs min-h-[60px]"
							/>
						</div>

						<Button
							onClick={handleDeepGenerate}
							disabled={isGeneratingDeep || !setting.trim()}
							className="w-full gap-2 h-9"
						>
							{isGeneratingDeep ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									Synthesizing...
								</>
							) : (
								<>
									<Wand2 className="w-4 h-4" />
									Commence Deep Synthesis
								</>
							)}
						</Button>

						{deepDirectiveContent && (
							<div className="space-y-3 pt-4 border-t border-border">
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => copyToClipboard(deepDirectiveContent)}
										className="h-7 gap-1 text-[11px]"
									>
										<Copy className="w-3 h-3" /> Copy
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											downloadMarkdown(
												"directive-briefing",
												deepDirectiveContent,
											)
										}
										className="h-7 gap-1 text-[11px]"
									>
										<FileText className="w-3 h-3" /> Markdown
									</Button>
								</div>
								<div className="bg-muted/30 p-3 rounded-lg text-xs leading-relaxed max-h-96 overflow-y-auto border border-border/50">
									<AutoLinkText text={deepDirectiveContent} />
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</AscendantWindow>
	);
}
