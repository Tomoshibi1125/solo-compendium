import {
	AlertTriangle,
	ArrowLeft,
	Clock,
	Copy,
	Loader2,
	RefreshCw,
	Sparkles,
	Target,
	Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DataStreamText, SystemHeading } from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import {
	getRandomEquipment,
	getRandomRune,
} from "@/lib/compendiumAutopopulate";
import { LocalAIIntegration } from "@/lib/localAIIntegration";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

const QUEST_TYPES = [
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
] as const;

const QUEST_LOCATIONS = [
	"Urban Rift",
	"Forest Rift",
	"Underground Rift",
	"Sky Rift",
	"Abyssal Rift",
	"Shadow Rift",
	"Elemental Rift",
	"Beast Rift",
	"Construct Rift",
	"Necromantic Rift",
	"Celestial Rift",
	"Dimensional Rift",
] as const;

const QUEST_COMPLICATIONS = [
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

const QUEST_REWARDS = [
	"Standard Rift rewards",
	"Bonus gold payment",
	"Rare material access",
	"Awakened Council favor",
	"Relic fragment",
	"Exclusive information",
	"Guild recommendation",
	"Special equipment",
	"System favor bonus",
	"Prime Architect blessing",
] as const;

const QUEST_RANKS = ["E", "D", "C", "B", "A", "S"] as const;

interface GeneratedQuest {
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

function generateQuest(rank?: string): GeneratedQuest {
	const selectedRank =
		rank || QUEST_RANKS[Math.floor(Math.random() * QUEST_RANKS.length)];
	const type = QUEST_TYPES[Math.floor(Math.random() * QUEST_TYPES.length)];
	const location =
		QUEST_LOCATIONS[Math.floor(Math.random() * QUEST_LOCATIONS.length)];

	// Generate title
	const title = `${type} at ${location}`;

	// Generate description based on type
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

	// Generate objectives (2-4 objectives)
	const numObjectives = 2 + Math.floor(Math.random() * 3);
	const objectives: string[] = [];
	objectives.push(`Reach the ${location}`);

	switch (type) {
		case "Rift Clearance":
			objectives.push(
				"Eliminate all monsters",
				"Clear the Rift boss",
				"Secure the Rift core",
			);
			break;
		case "Rescue Mission":
			objectives.push(
				"Locate trapped individuals",
				"Extract survivors",
				"Ensure no one is left behind",
			);
			break;
		case "Investigation":
			objectives.push(
				"Explore the Rift",
				"Gather evidence",
				"Identify the threat level",
			);
			break;
		case "Defense":
			objectives.push(
				"Set up defensive positions",
				"Hold for specified duration",
				"Protect key infrastructure",
			);
			break;
		case "Extermination":
			objectives.push(
				"Track the target",
				"Engage and eliminate",
				"Confirm elimination",
			);
			break;
		case "Retrieval":
			objectives.push("Locate the item", "Secure the item", "Extract safely");
			break;
		case "Escort":
			objectives.push(
				"Meet the client",
				"Navigate safely through Rift",
				"Deliver to destination",
			);
			break;
		case "Reconnaissance":
			objectives.push(
				"Enter undetected",
				"Map the area",
				"Gather intelligence",
				"Extract without alerting enemies",
			);
			break;
		case "Assassination":
			objectives.push(
				"Identify target location",
				"Eliminate target",
				"Cover tracks",
			);
			break;
		case "Delivery":
			objectives.push(
				"Collect cargo",
				"Navigate route",
				"Deliver to destination",
			);
			break;
	}

	// Generate complications (0-2 complications)
	const numComplications = Math.floor(Math.random() * 3);
	const complications: string[] = [];
	const shuffled = [...QUEST_COMPLICATIONS].sort(() => Math.random() - 0.5);
	for (let i = 0; i < numComplications && i < shuffled.length; i++) {
		complications.push(shuffled[i]);
	}

	// Generate rewards (1-3 rewards)
	const numRewards = 1 + Math.floor(Math.random() * 3);
	const rewards: string[] = [];
	const shuffledRewards = [...QUEST_REWARDS].sort(() => Math.random() - 0.5);
	for (let i = 0; i < numRewards && i < shuffledRewards.length; i++) {
		rewards.push(shuffledRewards[i]);
	}

	// Time limit for some quests
	const timeLimit =
		Math.random() < 0.4
			? `${4 + Math.floor(Math.random() * 20)} hours`
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

const QuestGenerator = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<{
		selectedRank: string;
		quest: GeneratedQuest | null;
	}>("quest_generator", {
		initialState: {
			selectedRank: "random",
			quest: null,
		},
		storageKey: "solo-compendium.dm-tools.quest-generator.v1",
	});

	const [selectedRank, setSelectedRank] = useState<string>("random");
	const [quest, setQuest] = useState<GeneratedQuest | null>(null);

	const hydrated = useMemo(() => {
		return {
			selectedRank: storedState.selectedRank ?? "random",
			quest: storedState.quest ?? null,
		};
	}, [storedState.quest, storedState.selectedRank]);

	const hydratedRef = useRef(false);
	useEffect(() => {
		if (isLoading) return;
		if (hydratedRef.current) return;
		setSelectedRank(hydrated.selectedRank);
		setQuest(hydrated.quest);

		// Wire up local AI integration
		LocalAIIntegration.getInstance().initializeAI().catch(console.error);

		hydratedRef.current = true;
	}, [hydrated.quest, hydrated.selectedRank, isLoading]);

	const savePayload = useMemo(
		() => ({ selectedRank, quest }),
		[quest, selectedRank],
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
		const rank = selectedRank === "random" ? undefined : selectedRank;
		const baseQuest = generateQuest(rank);

		// 100% Automation: Pull real rewards
		const [realEquip, realRune] = await Promise.all([
			getRandomEquipment(baseQuest.rank),
			getRandomRune(),
		]);

		if (realEquip) {
			baseQuest.rewards = [realEquip.name, ...baseQuest.rewards.slice(1)];
		}
		if (realRune) {
			baseQuest.rewards = [...baseQuest.rewards, `Rune: ${realRune.name}`];
		}

		setQuest(baseQuest);
		toast({
			title: "Quest Generated",
			description: "A new quest has been synthesized.",
		});
	};

	const handleAIEnhance = async () => {
		if (!quest) return;
		const seed = `Generate a complete, detailed quest briefing for a System Ascendant TTRPG campaign.

SEED DATA:
- Title: ${quest.title}
- Type: ${quest.type}
- Rank: ${quest.rank}
- Location: ${quest.location}
- Description: ${quest.description}
- Objectives: ${quest.objectives.join("; ")}
- Complications: ${quest.complications.join("; ") || "None"}
- Rewards: ${quest.rewards.join("; ")}
- Time Limit: ${quest.timeLimit || "None"}

Provide ALL of the following sections with full detail:

1. OVERVIEW: Quest giver NPC (name, rank, motivation), premise, stakes, urgency
2. OBJECTIVES: Primary + secondary + hidden objectives with success/fail conditions and DCs
3. ENCOUNTERS: 2-3 encounter sketches with monster types, CR, terrain, tactics
4. COMPLICATIONS: Twists, betrayals, moral dilemmas with mechanical consequences
5. REWARDS: XP amount, gold (specific GP by rank), items with full stats, faction reputation
6. LORE: How the quest connects to Rifts, Regents, the Awakened Council, or the System
7. TIMELINE: Session count estimate, time pressure mechanics, milestone triggers
8. KEY NPCs: 2-3 NPCs with brief stat blocks (AC/HP/CR) and motivations
9. READ-ALOUD: Boxed text for quest briefing scene`;
		await (enhance as any)("quest", seed);
	};

	const handleCopy = () => {
		if (!quest) return;
		const text = `QUEST: ${quest.title}
Rank: ${quest.rank}
Location: ${quest.location}

${quest.description}

OBJECTIVES:
${quest.objectives.map((obj, i) => `${i + 1}. ${obj}`).join("\n")}

${quest.complications.length > 0 ? `COMPLICATIONS:\n${quest.complications.map((c) => `- ${c}`).join("\n")}\n` : ""}${quest.timeLimit ? `TIME LIMIT: ${quest.timeLimit}\n` : ""}REWARDS:
${quest.rewards.map((r) => `- ${r}`).join("\n")}

---
D&D BEYOND STYLE QUEST BRIEFING:

OVERVIEW:
• Quest Giver: [NPC name and rank]
• Premise: ${quest.description}
• Stakes: [Consequences of success/failure]
• Urgency: ${quest.timeLimit || "No time limit"}

OBJECTIVES:
PRIMARY OBJECTIVES:
${quest.objectives.map((obj, i) => `${i + 1}. ${obj} (DC determined by complexity)`).join("\n")}

SECONDARY OBJECTIVES:
• [Optional bonus objectives]
• [Hidden objectives revealed during play]

SUCCESS CONDITIONS:
• Complete all primary objectives
• [Optional: Complete secondary objectives for bonus rewards]

FAILURE CONDITIONS:
• [Consequences of failure]
• [Partial success outcomes]

ENCOUNTERS:
ENCOUNTER 1: [Type of challenge]
• Challenge Rating: [Appropriate to ${quest.rank} Rank]
• Terrain: ${quest.location} environment
• Tactics: [Enemy strategy]

ENCOUNTER 2: [Secondary challenge]
• Challenge Rating: [Lower than primary]
• Environment: [Terrain features]
• Complications: ${quest.complications.join(", ") || "None"}

COMPLICATIONS:
${quest.complications.map((c, i) => `${i + 1}. ${c} (Mechanical effect: [DC/save/damage])`).join("\n") || "None"}

REWARDS:
EXPERIENCE POINTS:
• Base XP: [${quest.rank} Rank appropriate amount]
• Bonus XP: [For complications overcome]

GOLD:
• Base reward: [${quest.rank} Rank appropriate GP]
• Bonus: [For exceptional performance]

ITEMS:
${quest.rewards.map((r, i) => `${i + 1}. ${r} (Full stats and description)`).join("\n")}

FACTION REPUTATION:
• [Affected factions and reputation changes]

LORE:
• Connection to Rift activity: [How quest relates to current Rift events]
• Awakened Council involvement: [Official interest or authorization]
• System implications: [How this affects the greater System]

TIMELINE:
• Estimated sessions: [${quest.rank} Rank complexity determines length]
• Time pressure: ${quest.timeLimit || "Standard pacing"}
• Milestone triggers: [Key events that advance the quest]

KEY NPCs:
QUEST GIVER:
• Name: [NPC name]
• Rank: [Appropriate to quest importance]
• Motivation: ${quest.description.split(".")[0]}
• Stats: AC [appropriate], HP [appropriate], CR [appropriate]

SUPPORTING NPCS:
• [2-3 additional NPCs with brief stat blocks and motivations]

READ-ALOUD BRIEFING:
"[Opening scene description for quest briefing]"

${quest.description}

"[Closing remarks and call to action]"`;

		navigator.clipboard.writeText(text);
		toast({
			title: "Copied!",
			description: "Complete quest briefing copied to clipboard.",
		});
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
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/dm-tools")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Tools
					</Button>
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Directive Matrix
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="font-heading"
					>
						Synthesize operational directives and localized contracts.
						Extrapolate operational parameters, complication probabilities, and
						calculated systemic compensation.
					</DataStreamText>
				</div>

				<SystemWindow title="GENERATE QUEST" className="mb-6">
					<div className="space-y-4">
						<div>
							<Label htmlFor="rank" className="mb-2 block">
								Quest Rank (Optional - Random if not selected)
							</Label>
							<Select value={selectedRank} onValueChange={setSelectedRank}>
								<SelectTrigger id="rank">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="random">Random</SelectItem>
									{QUEST_RANKS.map((rank) => (
										<SelectItem key={rank} value={rank}>
											Rank {rank}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<Button
							onClick={handleGenerate}
							className="w-full btn-umbral"
							size="lg"
						>
							<Target className="w-4 h-4 mr-2" />
							Generate Quest
						</Button>
						{quest && (
							<Button
								onClick={handleAIEnhance}
								className="w-full gap-2 mt-2"
								variant="outline"
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
				</SystemWindow>

				{quest && (
					<SystemWindow title={quest.title} className="mb-6">
						<div className="space-y-4">
							<div className="flex items-center gap-3 flex-wrap">
								<Badge
									className={cn("text-lg px-4 py-2", getRankColor(quest.rank))}
								>
									Rank {quest.rank}
								</Badge>
								<Badge variant="outline" className="flex items-center gap-1">
									<Users className="w-3 h-3" />
									{quest.location}
								</Badge>
								{quest.timeLimit && (
									<Badge
										variant="outline"
										className="flex items-center gap-1 text-orange-400 border-orange-400/30"
									>
										<Clock className="w-3 h-3" />
										{quest.timeLimit}
									</Badge>
								)}
							</div>

							<div className="pt-2 border-t border-border">
								<div className="block text-muted-foreground font-heading leading-relaxed mb-4">
									<AutoLinkText text={quest.description} />
								</div>

								<div className="space-y-3">
									<div>
										<h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
											<Target className="w-4 h-4 text-primary" />
											Objectives
										</h3>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											{quest.objectives.map((objective) => (
												<li key={`quest-obj-${objective}`}>
													<AutoLinkText text={objective} />
												</li>
											))}
										</ul>
									</div>

									{quest.complications.length > 0 && (
										<div>
											<h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
												<AlertTriangle className="w-4 h-4 text-orange-400" />
												Complications
											</h3>
											<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
												{quest.complications.map((complication) => (
													<li key={`quest-comp-${complication}`}>
														<AutoLinkText text={complication} />
													</li>
												))}
											</ul>
										</div>
									)}

									<div>
										<h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
											<Badge className="text-amber-400 border-amber-400/30 bg-amber-400/10">
												Rewards
											</Badge>
										</h3>
										<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
											{quest.rewards.map((reward) => (
												<li key={`quest-reward-${reward}`}>
													<AutoLinkText text={reward} />
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>

							{enhancedText && (
								<div className="pt-4 border-t border-primary/30">
									<div className="flex items-center gap-2 mb-2">
										<Sparkles className="w-4 h-4 text-primary" />
										<span className="text-xs font-display text-primary">
											AI-ENHANCED BRIEFING
										</span>
									</div>
									<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-4 max-h-[500px] overflow-y-auto">
										<AutoLinkText text={enhancedText || ""} />
									</div>
								</div>
							)}

							<div className="flex gap-2 pt-4 border-t border-border">
								<Button
									onClick={handleCopy}
									variant="outline"
									className="flex-1"
								>
									<Copy className="w-4 h-4 mr-2" />
									Copy Quest
								</Button>
								<Button
									onClick={handleGenerate}
									variant="outline"
									className="flex-1"
								>
									<RefreshCw className="w-4 h-4 mr-2" />
									Regenerate
								</Button>
							</div>
						</div>
					</SystemWindow>
				)}
			</div>
		</Layout>
	);
};

export default QuestGenerator;
