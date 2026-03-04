import {
	ArrowLeft,
	Copy,
	Loader2,
	RefreshCw,
	Sparkles,
	User,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DataStreamText,
	SystemHeading,
	SystemText,
} from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import { formatMonarchVernacular } from "@/lib/vernacular";

const ASCENDANT_RANKS = ["E", "D", "C", "B", "A", "S"];
const NPC_ROLES = [
	"Awakened Council Official",
	"Rift Researcher",
	"Relic Merchant",
	"Information Broker",
	"Former S-Rank Ascendant",
	"Monarch Cultist",
	"System Analyst",
	"Rift Survivor",
	"Beast Slayer",
	"Core Collector",
	"Shadow Network Agent",
	"Independent Contractor",
];
const PERSONALITIES = [
	"Cautious and methodical",
	"Bold and reckless",
	"Mysterious and secretive",
	"Friendly and helpful",
	"Paranoid and suspicious",
	"Confident and arrogant",
	"Humble and wise",
	"Greedy and opportunistic",
	"Loyal and protective",
	"Neutral and detached",
	"Passionate and driven",
	"Cynical and jaded",
];
const MOTIVATIONS = [
	"Seeking power through Rifts",
	"Protecting loved ones",
	"Revenge against monsters",
	"Researching Rift phenomena",
	"Building an ascendant organization",
	"Seeking the Umbral Monarch",
	"Escaping past trauma",
	"Proving their worth",
	"Accumulating wealth",
	"Uncovering secrets",
	"Protecting humanity",
	"Achieving immortality",
];
const SECRETS = [
	"Former S-Rank ascendant (lost power)",
	"Working for a Monarch",
	"Has a cursed relic",
	"Knows about the reset",
	"Is actually a monster",
	"Has System favor debt",
	"Betrayed their ascendant team",
	"Seeking forbidden knowledge",
	"Has a hidden Rift",
	"Is being hunted",
	"Knows the Prime Architect personally",
	"Has a duplicate identity",
];
const QUIRKS = [
	"Always checks for traps",
	"Collects monster cores obsessively",
	"Speaks in riddles",
	"Has a telltale scar",
	"Never removes their mask",
	"Quotes the System",
	"Tracks Rift statistics",
	"Has a pet shadow",
	"Wears outdated equipment",
	"Mentions the reset frequently",
	"Avoids eye contact",
	"Always has a backup plan",
];

interface GeneratedNPC {
	name: string;
	rank: string;
	role: string;
	personality: string;
	motivation: string;
	secret: string;
	quirk: string;
	description: string;
}

const NAMES = [
	"Kim Min-Su",
	"Park Ji-Hoon",
	"Lee Soo-Jin",
	"Choi Hae-Won",
	"Jung Tae-Hyun",
	"Yoon Seo-Yeon",
	"Kang Min-Jae",
	"Han So-Ra",
	"Shin Dong-Hyun",
	"Oh Yeon-Ju",
	"Baek Ji-Woo",
	"Lim Hyun-Seok",
	"Song Mi-Rae",
	"Kwon Joon-Ho",
	"Moon Ji-Ah",
];

function generateNPC(): GeneratedNPC {
	const name = NAMES[Math.floor(Math.random() * NAMES.length)];
	const rank =
		ASCENDANT_RANKS[Math.floor(Math.random() * ASCENDANT_RANKS.length)];
	const role = formatMonarchVernacular(
		NPC_ROLES[Math.floor(Math.random() * NPC_ROLES.length)],
	);
	const personality =
		PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
	const motivation = formatMonarchVernacular(
		MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)],
	);
	const secret = formatMonarchVernacular(
		SECRETS[Math.floor(Math.random() * SECRETS.length)],
	);
	const quirk = QUIRKS[Math.floor(Math.random() * QUIRKS.length)];

	const description = `${name} is a ${rank}-Rank ${role}. They are ${personality} and are motivated by ${motivation.toLowerCase()}. Their secret: ${secret.toLowerCase()}. They have a quirk: ${quirk.toLowerCase()}.`;

	return {
		name,
		rank,
		role,
		personality,
		motivation,
		secret,
		quirk,
		description,
	};
}

const NPCGenerator = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<{ npc: GeneratedNPC | null }>("npc_generator", {
		initialState: { npc: null },
		storageKey: "solo-compendium.dm-tools.npc-generator.v1",
	});

	const [npc, setNpc] = useState<GeneratedNPC | null>(null);

	const hydrated = useMemo(
		() => ({ npc: storedState.npc ?? null }),
		[storedState.npc],
	);
	const hydratedRef = useRef(false);

	useEffect(() => {
		if (isLoading) return;
		if (hydratedRef.current) return;
		setNpc(hydrated.npc);
		hydratedRef.current = true;
	}, [hydrated.npc, isLoading]);

	const debouncedPayload = useDebounce({ npc }, 350);

	useEffect(() => {
		if (isLoading) return;
		if (!hydratedRef.current) return;
		void saveNow(debouncedPayload);
	}, [debouncedPayload, isLoading, saveNow]);

	const { isEnhancing, enhancedText, enhance, clearEnhanced } = useAIEnhance();

	const handleGenerate = () => {
		clearEnhanced();
		const newNPC = generateNPC();
		setNpc(newNPC);
		toast({
			title: "NPC Generated",
			description: `Generated ${newNPC.name}.`,
		});
	};

	const handleAIEnhance = async () => {
		if (!npc) return;
		const seed = `Generate a complete, detailed NPC dossier for a System Ascendant TTRPG campaign.

SEED DATA:
- Name: ${npc.name}
- Rank: ${npc.rank}
- Role: ${npc.role}
- Personality: ${npc.personality}
- Motivation: ${npc.motivation}
- Secret: ${npc.secret}
- Quirk: ${npc.quirk}

Provide ALL of the following sections with full detail:

1. STAT BLOCK: Ability scores (STR/AGI/VIT/INT/SENSE/PRE), AC, HP, CR, saves, skills, proficiency bonus
2. COMBAT: Attack actions (to-hit, damage, range), spells/powers known, tactical behavior
3. LORE: Full backstory (2-3 paragraphs) set in the System Ascendant world (Rifts, Regents, Ascendants, the System)
4. PERSONALITY: 3 personality traits, 1 ideal, 1 bond, 1 flaw
5. DIALOGUE: 3-5 sample dialogue lines in-character
6. PLOT HOOKS: 2-3 quest/story hooks involving this NPC
7. EQUIPMENT: Notable gear, relics, consumables they carry with stats
8. DESCRIPTION: Read-aloud boxed text for when players first encounter this NPC`;
		await enhance("npc", seed);
	};

	const handleCopy = () => {
		if (!npc) return;
		const text = `NPC: ${npc.name}
Rank: ${npc.rank}
Role: ${npc.role}
Personality: ${npc.personality}
Motivation: ${npc.motivation}
Secret: ${npc.secret}
Quirk: ${npc.quirk}

${npc.description}

---
D&D BEYOND STYLE NPC DOSSIER:

STAT BLOCK:
• Ability Scores: STR [determined by rank], AGI [determined by rank], VIT [determined by rank], INT [determined by rank], SENSE [determined by rank], PRE [determined by rank]
• Armor Class: [determined by rank + role]
• Hit Points: [determined by rank]
• Challenge Rating: [equivalent to ${npc.rank} Rank]
• Proficiency Bonus: [+${npc.rank === "S" ? "6" : npc.rank === "A" ? "4" : npc.rank === "B" ? "3" : npc.rank === "C" ? "2" : "1"}]
• Saving Throws: [based on primary abilities]
• Skills: [role-appropriate skills with expertise]

COMBAT:
• Attacks: [role-appropriate weapons/abilities]
• Spellcasting: [if applicable, spells known and save DC]
• Tactical Behavior: ${npc.personality.toLowerCase()} tendencies in combat

LORE:
${npc.description}

Background: ${npc.motivation.toLowerCase()}
Secret Knowledge: ${npc.secret.toLowerCase()}

PERSONALITY:
• Traits: ${npc.personality.toLowerCase()}, ${npc.quirk.toLowerCase()}
• Ideal: ${npc.motivation.toLowerCase()}
• Bond: [Connection to campaign world]
• Flaw: ${npc.secret.toLowerCase()}

DIALOGUE:
1. [Sample line reflecting ${npc.personality.toLowerCase()} nature]
2. [Sample line about ${npc.motivation.toLowerCase()}]
3. [Sample line hinting at ${npc.secret.toLowerCase()}]

PLOT HOOKS:
1. [Quest involving ${npc.motivation.toLowerCase()}]
2. [Adventure related to ${npc.secret.toLowerCase()}]
3. [Mission connected to ${npc.role.toLowerCase()} role]

EQUIPMENT:
• [Role-appropriate gear]
• [Any notable items or relics]
• [Standard equipment for ${npc.rank} Rank]

DESCRIPTION:
${npc.description}`;

		navigator.clipboard.writeText(text);
		toast({
			title: "Copied",
			description: "Complete NPC dossier copied to clipboard.",
		});
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8">
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/dm-tools")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to System Tools
					</Button>
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Construct Synthesis Protocol
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="font-heading text-sm"
					>
						Instantiate semi-autonomous conceptual entities possessing distinct
						motivations, encrypted parameters, and idiosyncratic behaviors.
					</DataStreamText>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-1">
						<SystemWindow title="GENERATOR">
							<Button
								onClick={handleGenerate}
								className="w-full gap-2"
								size="lg"
							>
								<RefreshCw className="w-4 h-4" />
								Generate NPC
							</Button>
							{npc && (
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
						</SystemWindow>
					</div>

					<div className="lg:col-span-2">
						{npc ? (
							<SystemWindow title={npc.name.toUpperCase()}>
								<div className="space-y-4">
									<div className="flex items-center gap-2">
										<User className="w-5 h-5 text-primary" />
										<Badge>{npc.rank}-Rank</Badge>
										<span className="text-muted-foreground">{npc.role}</span>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<span className="text-xs font-display text-muted-foreground">
												PERSONALITY
											</span>
											<p className="font-heading">{npc.personality}</p>
										</div>
										<div>
											<span className="text-xs font-display text-muted-foreground">
												MOTIVATION
											</span>
											<p className="font-heading">{npc.motivation}</p>
										</div>
										<div>
											<span className="text-xs font-display text-muted-foreground">
												SECRET
											</span>
											<Badge variant="destructive" className="mt-1">
												{npc.secret}
											</Badge>
										</div>
										<div>
											<span className="text-xs font-display text-muted-foreground">
												QUIRK
											</span>
											<Badge variant="secondary" className="mt-1">
												{npc.quirk}
											</Badge>
										</div>
									</div>

									<div className="pt-4 border-t border-border">
										<span className="text-xs font-display text-muted-foreground">
											DESCRIPTION
										</span>
										<SystemText className="block text-sm text-muted-foreground mt-2">
											{npc.description}
										</SystemText>
									</div>

									{enhancedText && (
										<div className="pt-4 border-t border-primary/30">
											<div className="flex items-center gap-2 mb-2">
												<Sparkles className="w-4 h-4 text-primary" />
												<span className="text-xs font-display text-primary">
													AI-ENHANCED DETAILS
												</span>
											</div>
											<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-4 max-h-[500px] overflow-y-auto">
												{enhancedText}
											</div>
										</div>
									)}

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
							</SystemWindow>
						) : (
							<SystemWindow title="NO NPC GENERATED">
								<div className="text-center py-12 text-muted-foreground">
									<p>Click "Generate NPC" to create a random NPC</p>
								</div>
							</SystemWindow>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default NPCGenerator;
