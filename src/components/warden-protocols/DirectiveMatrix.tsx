import {
	Clock,
	Copy,
	Download,
	Loader2,
	Sparkles,
	Target,
	Users,
	Wand2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AIContentGenerator } from "@/components/AIContentGeneratorClass";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataStreamText } from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
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
import { useUserToolState } from "@/hooks/useToolState";
import {
	getRandomEquipment,
	getRandomRune,
} from "@/lib/compendiumAutopopulate";
import { formatRegentVernacular } from "@/lib/vernacular";

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
	"$10 Bills",
	"$100 Bills",
	"$5 Bills",
	"$1 Bills",
	"10¢ Coins",
	"Rare material access",
	"Awakened Council favor",
	"Relic fragment",
	"Exclusive information",
	"Guild recommendation",
	"Special equipment",
	"System favor bonus",
	"Prime Architect blessing",
] as const;

// --- Interfaces ---

interface GeneratedDirective {
	type: string;
	title: string;
	rank: string;
	location: string;
	description: string;
	objectives: string[];
	complications: string[];
	rewards: string[];
	timeLimit?: string;
}

interface DirectiveState {
	genMode: "quick" | "deep";
	selectedRank: string;
	quickDirective: GeneratedDirective | null;
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
				"Eliminate all monsters",
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
		type,
		title: formatRegentVernacular(title),
		rank: selectedRank,
		location: formatRegentVernacular(location),
		description: formatRegentVernacular(description),
		objectives: objectives.slice(0, numObjectives).map(formatRegentVernacular),
		complications: complications.map(formatRegentVernacular),
		rewards: rewards.map(formatRegentVernacular),
		timeLimit,
	};
}

// --- Component ---

export function DirectiveMatrix() {
	const { toast } = useToast();
	const { isEnhancing, enhancedText, enhance, clearEnhanced } = useAIEnhance();

	// Persistence via useUserToolState
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<DirectiveState>("directive_matrix", {
		initialState: {
			genMode: "quick",
			selectedRank: "random",
			quickDirective: null,
			deepDirectiveContent: "",
			deepForm: {
				directiveType: DIRECTIVE_TYPES[0],
				difficulty: "Medium",
				setting: "",
				additionalDetails: "",
			},
		},
		storageKey: "solo-compendium.PW-tools.directive-matrix.v1",
	});

	const [genMode, setGenMode] = useState<"quick" | "deep">("quick");
	const [selectedRank, setSelectedRank] = useState<string>("random");
	const [quickDirective, setQuickDirective] =
		useState<GeneratedDirective | null>(null);
	const [deepDirectiveContent, setDeepDirectiveContent] = useState("");

	// Form states for Deep Synthesis
	const [directiveType, setDirectiveType] = useState<string>(
		DIRECTIVE_TYPES[0],
	);
	const [difficulty, setDifficulty] = useState("Medium");
	const [setting, setSetting] = useState("");
	const [additionalDetails, setAdditionalDetails] = useState("");

	const [isGeneratingDeep, setIsGeneratingDeep] = useState(false);

	// Hydration
	const hydratedRef = useRef(false);
	useEffect(() => {
		if (isLoading) return;
		if (hydratedRef.current) return;

		setGenMode(storedState.genMode);
		setSelectedRank(storedState.selectedRank);
		setQuickDirective(storedState.quickDirective);
		setDeepDirectiveContent(storedState.deepDirectiveContent);

		if (storedState.deepForm) {
			setDirectiveType(
				storedState.deepForm.directiveType || DIRECTIVE_TYPES[0],
			);
			setDifficulty(storedState.deepForm.difficulty || "Medium");
			setSetting(storedState.deepForm.setting || "");
			setAdditionalDetails(storedState.deepForm.additionalDetails || "");
		}

		hydratedRef.current = true;
	}, [storedState, isLoading]);

	// Auto-save logic
	const savePayload = useMemo(
		(): DirectiveState => ({
			genMode,
			selectedRank,
			quickDirective,
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
			quickDirective,
			deepDirectiveContent,
			directiveType,
			difficulty,
			setting,
			additionalDetails,
		],
	);

	const debouncedPayload = useDebounce(savePayload, 500);

	useEffect(() => {
		if (isLoading || !hydratedRef.current) return;
		void saveNow(debouncedPayload);
	}, [debouncedPayload, isLoading, saveNow]);

	const handleQuickGenerate = async () => {
		clearEnhanced();
		const rank = selectedRank === "random" ? undefined : selectedRank;
		const baseDirective = generateRandomDirective(rank);

		// Integration: Pull real rewards
		try {
			const [realEquip, realRune] = await Promise.all([
				getRandomEquipment(baseDirective.rank),
				getRandomRune(),
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
		} catch (e) {
			console.warn("Failed to fetch real rewards", e);
		}

		setQuickDirective(baseDirective);
		toast({
			title: "Directive Synthesized",
			description: "Operational parameters established.",
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
			const prompt = `Generate a detailed ${directiveType.toLowerCase()} for a System Ascendant campaign.
      
Directive Details:
- Type: ${directiveType}
- Rank/Difficulty: ${difficulty}
- Setting/Location: ${setting}
${additionalDetails ? `- Additional Details: ${additionalDetails}` : ""}

Please provide a complete directive structure using System Ascendant terminology.`;

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
		const seed = `Generate a complete, detailed directive briefing for a System Ascendant TTRPG campaign based on this quick seed:
    Title: ${quickDirective.title}, Rank: ${quickDirective.rank}, Location: ${quickDirective.location}, Objectives: ${quickDirective.objectives.join("; ")}.
    Include: Overview, Detailed Objectives, 2-3 Encounter sketches, Complications, Rewards, and a Read-Aloud intro.`;
		await enhance("quest", seed);
	};

	const copyToClipboard = (text: string) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		toast({
			title: "Copied!",
			description: "Directive parameters copied to clipboard.",
		});
	};

	const exportDirective = (text: string) => {
		const blob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "directive-briefing.txt";
		a.click();
		URL.revokeObjectURL(url);
	};

	const getRankColor = (rank: string) => {
		const colors: Record<string, string> = {
			E: "text-green-400 border-green-400/30 bg-green-400/10",
			D: "text-blue-400 border-blue-400/30 bg-blue-400/10",
			C: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
			B: "text-orange-400 border-orange-400/30 bg-orange-400/10",
			A: "text-red-400 border-red-400/30 bg-red-400/10",
			S: "text-purple-400 border-purple-400/30 bg-purple-400/10",
		};
		return colors[rank] || colors.C;
	};

	return (
		<SystemWindow
			title="DIRECTIVE MATRIX"
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

				<DataStreamText
					variant="system"
					speed="fast"
					className="text-[10px] opacity-70 mb-2"
				>
					{genMode === "quick"
						? "SYNT_PARAM: FAST_EXPTRAPOLATION_ACTIVE"
						: "SYNT_PARAM: DEEP_MATRIX_RECURSION_ACTIVE"}
				</DataStreamText>

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
									<Badge variant="outline" className="text-[10px] gap-1">
										<Users className="w-3 h-3" /> {quickDirective.location}
									</Badge>
									{quickDirective.timeLimit && (
										<Badge
											variant="outline"
											className="text-[10px] gap-1 text-orange-400 border-orange-400/30"
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
										<Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
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
											<Label className="text-[10px] uppercase tracking-wider text-orange-400/80">
												Complications
											</Label>
											<ul className="list-disc list-inside text-xs space-y-1 mt-1 text-orange-400/70">
												{quickDirective.complications.map((c) => (
													<li key={c}>
														<AutoLinkText text={c} />
													</li>
												))}
											</ul>
										</div>
									)}

									<div>
										<Label className="text-[10px] uppercase tracking-wider text-amber-500/80">
											Allocated Compensation
										</Label>
										<ul className="list-disc list-inside text-xs space-y-1 mt-1 text-amber-500/70">
											{quickDirective.rewards.map((r) => (
												<li key={r}>
													<AutoLinkText text={r} />
												</li>
											))}
										</ul>
									</div>
								</div>

								<div className="flex gap-2 pt-2">
									<Button
										variant="outline"
										size="sm"
										className="flex-1 h-8 gap-2"
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
										className="h-8 w-8 p-0"
										onClick={() =>
											copyToClipboard(
												`${quickDirective.title}\n${quickDirective.description}`,
											)
										}
									>
										<Copy className="w-3 h-3" />
									</Button>
								</div>

								{enhancedText && (
									<div className="bg-primary/5 p-3 rounded border border-primary/20 text-xs whitespace-pre-line max-h-60 overflow-y-auto border border-primary/30">
										<AutoLinkText text={enhancedText} />
									</div>
								)}
							</div>
						)}
					</div>
				) : (
					<div className="space-y-3">
						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-1">
								<Label className="text-[10px]">Job Priority</Label>
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
								<Label className="text-[10px]">Difficulty</Label>
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
							<Label className="text-[10px]">Setting / Location</Label>
							<Input
								placeholder="The Iron Spire, Umbral Waste..."
								value={setting}
								onChange={(e) => setSetting(e.target.value)}
								className="h-8 text-xs"
							/>
						</div>

						<div className="space-y-1">
							<Label className="text-[10px]">Additional Directives</Label>
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
										className="h-7 gap-1 text-[10px]"
									>
										<Copy className="w-3 h-3" /> Copy
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => exportDirective(deepDirectiveContent)}
										className="h-7 gap-1 text-[10px]"
									>
										<Download className="w-3 h-3" /> Export
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
		</SystemWindow>
	);
}
