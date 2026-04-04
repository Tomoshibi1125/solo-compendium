import { Copy, Loader2, RefreshCw, Sparkles, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import {
	getRandomEquipment,
	getRandomFeat,
} from "@/lib/compendiumAutopopulate";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

// --- Constants ---

const ASCENDANT_RANKS = ["E", "D", "C", "B", "A", "S"] as const;

const NPC_ROLES = [
	"Awakened Council Official",
	"Rift Researcher",
	"Relic Merchant",
	"Information Broker",
	"Former S-Rank Ascendant",
	"Regent Cultist",
	"System Analyst",
	"Rift Survivor",
	"Beast Slayer",
	"Core Collector",
	"Umbral Network Agent",
	"Independent Contractor",
] as const;

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
] as const;

const MOTIVATIONS = [
	"Seeking power through Rifts",
	"Protecting loved ones",
	"Revenge against Anomalies",
	"Researching Rift phenomena",
	"Building an ascendant organization",
	"Seeking the Umbral Regent",
	"Escaping past trauma",
	"Proving their worth",
	"Accumulating wealth",
	"Uncovering secrets",
	"Protecting humanity",
	"Achieving immortality",
] as const;

const SECRETS = [
	"Former S-Rank ascendant (lost power)",
	"Working for a Regent",
	"Has a cursed relic",
	"Knows about the reset",
	"Is actually a Anomaly",
	"Has System favor debt",
	"Betrayed their ascendant team",
	"Seeking forbidden knowledge",
	"Has a hidden Rift",
	"Is being hunted",
	"Knows the The Absolute personally",
	"Has a duplicate identity",
] as const;

const QUIRKS = [
	"Always checks for traps",
	"Collects Anomaly cores obsessively",
	"Speaks in riddles",
	"Has a telltale scar",
	"Never removes their mask",
	"Quotes the System",
	"Tracks Rift statistics",
	"Has a pet umbral",
	"Wears outdated equipment",
	"Mentions the reset frequently",
	"Avoids eye contact",
	"Always has a backup plan",
] as const;

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
] as const;

// --- Types ---

export interface GeneratedNPC {
	name: string;
	rank: string;
	role: string;
	personality: string;
	motivation: string;
	secret: string;
	quirk: string;
	description: string;
	equipment: string[];
	features: string[];
}

export interface NPCGeneratorProps {
	entityId?: string;
	className?: string;
}

// --- Logic ---

function generateNPCBase(): GeneratedNPC {
	const selectRandom = <T,>(arr: readonly T[]): T =>
		arr[Math.floor(Math.random() * arr.length)];

	const name = selectRandom(NAMES);
	const rank = selectRandom(ASCENDANT_RANKS);
	const role = formatRegentVernacular(selectRandom(NPC_ROLES));
	const personality = selectRandom(PERSONALITIES);
	const motivation = formatRegentVernacular(selectRandom(MOTIVATIONS));
	const secret = formatRegentVernacular(selectRandom(SECRETS));
	const quirk = selectRandom(QUIRKS);

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
		equipment: ["Standard Adventuring Gear"],
		features: ["Commoner Statistics"],
	};
}

// --- Component ---

export function NPCGenerator({ entityId, className }: NPCGeneratorProps) {
	const { toast } = useToast();
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<{ npc: GeneratedNPC | null }>("npc_generator", {
		initialState: { npc: null },
		storageKey: `solo-compendium.PW-tools.npc-generator.v1${entityId ? `.${entityId}` : ""}`,
	});

	const [npc, setNpc] = useState<GeneratedNPC | null>(null);

	const hydrated = useMemo(
		() => ({ npc: storedState.npc ?? null }),
		[storedState.npc],
	);
	const hydratedRef = useRef(false);

	useEffect(() => {
		if (isLoading || hydratedRef.current) return;
		setNpc(hydrated.npc);
		hydratedRef.current = true;
	}, [hydrated.npc, isLoading]);

	const debouncedPayload = useDebounce({ npc }, 350);

	useEffect(() => {
		if (isLoading || !hydratedRef.current) return;
		void saveNow(debouncedPayload);
	}, [debouncedPayload, isLoading, saveNow]);

	const { isEnhancing, enhancedText, enhance, clearEnhanced } = useAIEnhance();

	const handleGenerate = async () => {
		clearEnhanced();
		const baseNPC = generateNPCBase();

		const [realEquip, realFeat] = await Promise.all([
			getRandomEquipment(baseNPC.rank),
			getRandomFeat(),
		]);

		if (realEquip) {
			baseNPC.equipment = [realEquip.name];
		}
		if (realFeat) {
			baseNPC.features = [realFeat.name];
		}

		setNpc(baseNPC);
		toast({
			title: "NPC Generated",
			description: `Generated ${baseNPC.name}.`,
		});
	};

	const handleAIEnhance = async () => {
		if (!npc) return;
		const seed = `Generate a complete, detailed NPC dossier for a System Ascendant TTRPG campaign.
Name: ${npc.name}
Rank: ${npc.rank}
Role: ${npc.role}
Personality: ${npc.personality}
Motivation: ${npc.motivation}
Secret: ${npc.secret}
Quirk: ${npc.quirk}

Include: Stat block, combat tactics, full lore, dialogue samples, and plot hooks.`;
		await enhance("npc", seed);
	};

	const handleCopy = () => {
		if (!npc) return;
		const text = `NPC: ${npc.name}\nRank: ${npc.rank}\nRole: ${npc.role}\nDescription: ${npc.description}\n\nEnhanced details if available:\n${enhancedText || "N/A"}`;
		navigator.clipboard.writeText(text);
		toast({
			title: "Copied",
			description: "NPC details copied to clipboard.",
		});
	};

	return (
		<div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
			<div className="lg:col-span-1 space-y-4">
				<SystemWindow title="GENERATOR">
					<div className="space-y-4">
						<Button
							type="button"
							onClick={handleGenerate}
							className="w-full h-11 gap-2"
							size="lg"
						>
							<RefreshCw className="w-4 h-4" />
							Synthesize Construct
						</Button>
						{npc && (
							<Button
								type="button"
								onClick={handleAIEnhance}
								className="w-full h-11 gap-2 btn-umbral"
								size="lg"
								disabled={isEnhancing}
							>
								{isEnhancing ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Sparkles className="w-4 h-4" />
								)}
								{isEnhancing ? "Processing..." : "Ascendant Enhancement"}
							</Button>
						)}
					</div>
				</SystemWindow>

				{npc && (
					<SystemWindow title="CORE PARAMETERS">
						<div className="space-y-4">
							<div>
								<span className="text-[10px] uppercase text-muted-foreground tracking-wider">
									Rank Class
								</span>
								<div className="mt-1">
									<Badge className="font-mono">{npc.rank}-Rank</Badge>
								</div>
							</div>
							<div>
								<span className="text-[10px] uppercase text-muted-foreground tracking-wider">
									Designated Role
								</span>
								<p className="font-heading text-sm">{npc.role}</p>
							</div>
							<div>
								<span className="text-[10px] uppercase text-muted-foreground tracking-wider">
									Operational Personality
								</span>
								<p className="text-sm italic opacity-80">{npc.personality}</p>
							</div>
						</div>
					</SystemWindow>
				)}
			</div>

			<div className="lg:col-span-2 space-y-4">
				{npc ? (
					<SystemWindow title={npc.name.toUpperCase()}>
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="bg-primary/5 p-3 rounded border border-primary/10">
									<span className="text-[10px] uppercase text-primary/60 tracking-wider">
										Primary Motivation
									</span>
									<p className="font-heading text-sm mt-1">{npc.motivation}</p>
								</div>
								<div className="bg-destructive/5 p-3 rounded border border-destructive/10">
									<span className="text-[10px] uppercase text-destructive/60 tracking-wider">
										Encrypted Secret
									</span>
									<p className="font-heading text-sm mt-1 text-destructive/80">
										{npc.secret}
									</p>
								</div>
							</div>

							<div>
								<span className="text-[10px] uppercase text-muted-foreground tracking-wider">
									Construct Description
								</span>
								<div className="mt-2 text-sm leading-relaxed text-muted-foreground/90">
									<AutoLinkText text={npc.description} />
								</div>
							</div>

							{(enhancedText || isEnhancing) && (
								<div className="pt-4 border-t border-primary/20">
									<div className="flex items-center gap-2 mb-3">
										<Sparkles className="w-4 h-4 text-primary" />
										<span className="text-[10px] font-display text-primary uppercase tracking-widest">
											Enhanced Dossier
										</span>
									</div>
									<div className="text-sm text-muted-foreground whitespace-pre-line bg-black/40 rounded-lg p-4 max-h-[400px] overflow-y-auto border border-primary/10">
										{isEnhancing ? (
											<div className="flex items-center justify-center py-8">
												<Loader2 className="w-8 h-8 animate-spin text-primary/40" />
											</div>
										) : (
											<AutoLinkText text={enhancedText || ""} />
										)}
									</div>
								</div>
							)}

							<div className="flex gap-2 pt-4 border-t border-border/50">
								<Button
									type="button"
									variant="outline"
									onClick={handleCopy}
									className="flex-1 gap-2"
								>
									<Copy className="w-4 h-4" />
									Copy Dossier
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={handleGenerate}
									className="gap-2"
								>
									<RefreshCw className="w-4 h-4" />
									Re-Synthesize
								</Button>
							</div>
						</div>
					</SystemWindow>
				) : (
					<SystemWindow title="SYNTHESIS STATUS">
						<div className="text-center py-20 text-muted-foreground bg-black/20 rounded-lg border border-dashed border-border/50">
							<User className="w-12 h-12 mx-auto mb-4 opacity-10" />
							<p className="text-xs uppercase tracking-widest opacity-40">
								No Active Contruct
							</p>
						</div>
					</SystemWindow>
				)}
			</div>
		</div>
	);
}
