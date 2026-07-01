import {
	Backpack,
	Copy,
	FileJson,
	FileText,
	Loader2,
	MapPin,
	RefreshCw,
	ScrollText,
	Sparkles,
	Star,
	User,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GenerationHistoryPanel } from "@/components/warden-directives/GenerationHistoryPanel";
import {
	NPC_MOTIVATIONS,
	NPC_NAMES,
	NPC_PERSONALITIES,
	NPC_QUIRKS,
	NPC_ROLES,
	NPC_SECRETS,
	WARDEN_RANKS,
} from "@/data/wardenGeneratorContent";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import {
	emptyHistory,
	type GenerationHistoryState,
	type HistoryEntry,
	makeEntryId,
	pushGeneration,
	removeGeneration,
	restoreGeneration,
	togglePin,
} from "@/lib/generationHistory";
import { downloadJson, downloadMarkdown } from "@/lib/toolExport";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import {
	loadWardenGenerationContext,
	type WardenLinkedEntry,
} from "@/lib/wardenGenerationContext";

// --- Types ---

export interface NPCStatBlock {
	cr: string;
	proficiency: number;
	ac: number;
	hp: number;
	speed: number;
	abilities: {
		str: number;
		dex: number;
		con: number;
		int: number;
		wis: number;
		cha: number;
	};
}

export interface GeneratedNPC {
	id: string;
	name: string;
	rank: string;
	role: string;
	personality: string;
	motivation: string;
	secret: string;
	quirk: string;
	description: string;
	statBlock: NPCStatBlock;
	equipment: string[];
	features: string[];
	aiEnhanced?: string;
	linkedContent?: {
		equipment?: WardenLinkedEntry[];
		features?: WardenLinkedEntry[];
		background?: WardenLinkedEntry | null;
		location?: WardenLinkedEntry | null;
		regent?: WardenLinkedEntry | null;
	};
}

export interface NPCGeneratorProps {
	entityId?: string;
	className?: string;
}

// --- Stat block ---

const RANK_STAT_PROFILE: Record<
	string,
	{
		cr: string;
		proficiency: number;
		hp: number;
		ac: number;
		abilityBase: number;
	}
> = {
	E: { cr: "1/8", proficiency: 2, hp: 11, ac: 12, abilityBase: 10 },
	D: { cr: "1/2", proficiency: 2, hp: 22, ac: 13, abilityBase: 12 },
	C: { cr: "2", proficiency: 2, hp: 45, ac: 14, abilityBase: 13 },
	B: { cr: "5", proficiency: 3, hp: 85, ac: 16, abilityBase: 15 },
	A: { cr: "9", proficiency: 4, hp: 136, ac: 17, abilityBase: 17 },
	S: { cr: "14", proficiency: 5, hp: 209, ac: 18, abilityBase: 19 },
};

const abilityMod = (score: number): number => Math.floor((score - 10) / 2);
const formatMod = (mod: number): string => (mod >= 0 ? `+${mod}` : `${mod}`);

function buildStatBlock(rank: string): NPCStatBlock {
	const profile = RANK_STAT_PROFILE[rank] ?? RANK_STAT_PROFILE.C;
	const rollAbility = () =>
		Math.max(
			8,
			Math.min(22, profile.abilityBase + Math.floor(Math.random() * 7) - 3),
		);
	const hpJitter =
		profile.hp +
		Math.floor(Math.random() * Math.max(1, Math.round(profile.hp * 0.2))) -
		Math.round(profile.hp * 0.1);
	return {
		cr: profile.cr,
		proficiency: profile.proficiency,
		ac: profile.ac,
		hp: Math.max(1, hpJitter),
		speed: 30,
		abilities: {
			str: rollAbility(),
			dex: rollAbility(),
			con: rollAbility(),
			int: rollAbility(),
			wis: rollAbility(),
			cha: rollAbility(),
		},
	};
}

// --- Logic ---

function generateNPCBase(): GeneratedNPC {
	const selectRandom = <T,>(arr: readonly T[]): T =>
		arr[Math.floor(Math.random() * arr.length)];

	const name = selectRandom(NPC_NAMES);
	const rank = selectRandom(WARDEN_RANKS);
	const role = formatRegentVernacular(selectRandom(NPC_ROLES));
	const personality = selectRandom(NPC_PERSONALITIES);
	const motivation = formatRegentVernacular(selectRandom(NPC_MOTIVATIONS));
	const secret = formatRegentVernacular(selectRandom(NPC_SECRETS));
	const quirk = selectRandom(NPC_QUIRKS);

	const description = `${name} is a ${rank}-Rank ${role}. They are ${personality} and are motivated by ${motivation.toLowerCase()}. Their secret: ${secret.toLowerCase()}. They have a quirk: ${quirk.toLowerCase()}.`;

	return {
		id: makeEntryId(),
		name,
		rank,
		role,
		personality,
		motivation,
		secret,
		quirk,
		description,
		statBlock: buildStatBlock(rank),
		equipment: [],
		features: [],
	};
}

const ABILITY_ORDER: Array<keyof NPCStatBlock["abilities"]> = [
	"str",
	"dex",
	"con",
	"int",
	"wis",
	"cha",
];

function npcToMarkdown(npc: GeneratedNPC): string {
	const s = npc.statBlock;
	const abilityRow = ABILITY_ORDER.map(
		(k) =>
			`${npc.statBlock.abilities[k]} (${formatMod(abilityMod(s.abilities[k]))})`,
	).join(" | ");
	const md = `# ${npc.name}

**${npc.rank}-Rank ${npc.role}**

- **Armor Class** ${s.ac}
- **Hit Points** ${s.hp}
- **Speed** ${s.speed} ft.
- **Challenge** ${s.cr}  ·  **Proficiency** ${formatMod(s.proficiency)}

| STR | DEX | CON | INT | WIS | CHA |
| --- | --- | --- | --- | --- | --- |
| ${abilityRow} |

- **Personality:** ${npc.personality}
- **Motivation:** ${npc.motivation}
- **Secret:** ${npc.secret}
- **Quirk:** ${npc.quirk}

${npc.description}

## Equipment
${npc.equipment.length > 0 ? npc.equipment.map((e) => `- ${e}`).join("\n") : "- Standard field kit"}

## Features
${npc.features.length > 0 ? npc.features.map((f) => `- ${f}`).join("\n") : "- None of note"}
${
	npc.linkedContent?.background
		? `\n**Background:** ${npc.linkedContent.background.name}`
		: ""
}${
	npc.linkedContent?.location
		? `\n**Known Location:** ${npc.linkedContent.location.name}`
		: ""
}${
	npc.linkedContent?.regent
		? `\n**Regent Vector:** ${npc.linkedContent.regent.name}`
		: ""
}
${npc.aiEnhanced ? `\n## Warden Dossier (AI)\n${npc.aiEnhanced}\n` : ""}`;
	return formatRegentVernacular(md);
}

// --- Component ---

export function NPCGenerator({ entityId, className }: NPCGeneratorProps) {
	const { toast } = useToast();
	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<GenerationHistoryState<GeneratedNPC>>("npc_generator", {
		initialState: emptyHistory<GeneratedNPC>(),
		storageKey: `solo-compendium.Warden-tools.npc-generator.v1${entityId ? `.${entityId}` : ""}`,
	});

	const [histState, setHistState] = useState<
		GenerationHistoryState<GeneratedNPC>
	>(emptyHistory<GeneratedNPC>());
	const npc = histState.current;

	const hydrated = useMemo<GenerationHistoryState<GeneratedNPC>>(() => {
		const raw = storedState as unknown as {
			current?: GeneratedNPC | null;
			history?: HistoryEntry<GeneratedNPC>[];
			npc?: GeneratedNPC | null;
		};
		if (Array.isArray(raw.history)) {
			return { current: raw.current ?? null, history: raw.history };
		}
		// Migrate the legacy latest-only shape ({ npc }).
		if (raw.npc) {
			return {
				current: { ...raw.npc, id: raw.npc.id ?? makeEntryId() },
				history: [],
			};
		}
		return emptyHistory<GeneratedNPC>();
	}, [storedState]);
	const hydratedRef = useRef(false);

	useEffect(() => {
		if (isLoading || hydratedRef.current) return;
		setHistState(hydrated);
		hydratedRef.current = true;
	}, [hydrated, isLoading]);

	const debouncedPayload = useDebounce(histState, 350);

	useEffect(() => {
		if (isLoading || !hydratedRef.current) return;
		void saveNow(debouncedPayload);
	}, [debouncedPayload, isLoading, saveNow]);

	const { isEnhancing, enhance, clearEnhanced } = useAIEnhance();
	const [isGenerating, setIsGenerating] = useState(false);

	const handleGenerate = async () => {
		clearEnhanced();
		setIsGenerating(true);
		try {
			const baseNPC = generateNPCBase();

			const generationContext = await loadWardenGenerationContext({
				types: [
					"equipment",
					"items",
					"feats",
					"backgrounds",
					"locations",
					"regents",
					"conditions",
				],
			});
			const equipment = [
				...generationContext.pickMany("equipment", 1, { rank: baseNPC.rank }),
				...generationContext.pickMany("items", 1, { rank: baseNPC.rank }),
			].slice(0, 2);
			const features = generationContext.pickMany("feats", 1, {
				rank: baseNPC.rank,
			});
			const background = generationContext.pickOne("backgrounds", {
				theme: baseNPC.role,
			});
			const location = generationContext.pickOne("locations", {
				theme: baseNPC.motivation,
			});
			const regent = generationContext.pickOne("regents", {
				theme: baseNPC.secret,
			});

			if (equipment.length > 0) {
				baseNPC.equipment = equipment.map((entry) => entry.name);
			}
			if (features.length > 0) {
				baseNPC.features = features.map((entry) => entry.name);
			}
			baseNPC.linkedContent = {
				equipment,
				features,
				background,
				location,
				regent,
			};

			setHistState((prev) =>
				pushGeneration(
					prev,
					baseNPC,
					`${baseNPC.name} · ${baseNPC.rank}-Rank ${baseNPC.role}`,
				),
			);
			toast({
				title: "NPC Generated",
				description: `Synthesized ${baseNPC.name}.`,
			});
		} finally {
			setIsGenerating(false);
		}
	};

	const updateCurrent = (updater: (current: GeneratedNPC) => GeneratedNPC) => {
		setHistState((prev) => {
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

	const handleAIEnhance = async () => {
		if (!npc) return;
		const seed = `Generate a complete, detailed NPC dossier for a Rift Ascendant TTRPG campaign.
Name: ${npc.name}
Rank: ${npc.rank}
Role: ${npc.role}
Personality: ${npc.personality}
Motivation: ${npc.motivation}
Secret: ${npc.secret}
Quirk: ${npc.quirk}
Stat block: AC ${npc.statBlock.ac}, HP ${npc.statBlock.hp}, CR ${npc.statBlock.cr}.

Include: combat tactics, full lore, dialogue samples, and plot hooks. Keep the stat block intact.`;
		const result = await enhance("npc", seed);
		if (result) {
			updateCurrent((current) => ({ ...current, aiEnhanced: result }));
		}
	};

	const handleCopy = () => {
		if (!npc) return;
		navigator.clipboard.writeText(npcToMarkdown(npc));
		toast({
			title: "Copied",
			description: "NPC dossier copied to clipboard as Markdown.",
		});
	};

	const handleExportMarkdown = () => {
		if (!npc) return;
		downloadMarkdown(`npc-${npc.name}`, npcToMarkdown(npc));
		toast({ title: "Exported", description: "NPC exported as Markdown." });
	};

	const handleExportJson = () => {
		if (!npc) return;
		downloadJson(`npc-${npc.name}`, npc);
		toast({ title: "Exported", description: "NPC exported as JSON." });
	};

	const linked = npc?.linkedContent;

	return (
		<div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
			<div className="lg:col-span-1 space-y-4">
				<AscendantWindow title="GENERATOR">
					<div className="space-y-4">
						<Button
							type="button"
							onClick={handleGenerate}
							className="w-full h-11 gap-2"
							size="lg"
							disabled={isGenerating}
						>
							{isGenerating ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<RefreshCw className="w-4 h-4" />
							)}
							{isGenerating ? "Synthesizing..." : "Synthesize Construct"}
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
						{npc && (
							<div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleCopy}
									className="gap-1"
								>
									<Copy className="w-3 h-3" />
									Copy
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleExportMarkdown}
									className="gap-1"
								>
									<FileText className="w-3 h-3" />
									Markdown
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleExportJson}
									className="gap-1"
								>
									<FileJson className="w-3 h-3" />
									JSON
								</Button>
							</div>
						)}
					</div>
				</AscendantWindow>

				{npc && (
					<AscendantWindow title="CORE PARAMETERS">
						<div className="space-y-4">
							<div>
								<span className="text-[11px] uppercase text-muted-foreground tracking-wider">
									Rank Class
								</span>
								<div className="mt-1">
									<Badge className="font-mono">{npc.rank}-Rank</Badge>
								</div>
							</div>
							<div>
								<span className="text-[11px] uppercase text-muted-foreground tracking-wider">
									Designated Role
								</span>
								<p className="font-heading text-sm">{npc.role}</p>
							</div>
							<div>
								<span className="text-[11px] uppercase text-muted-foreground tracking-wider">
									Operational Personality
								</span>
								<p className="text-sm italic opacity-80">{npc.personality}</p>
							</div>
						</div>
					</AscendantWindow>
				)}

				<GenerationHistoryPanel
					state={histState}
					onRestore={(id) =>
						setHistState((prev) => restoreGeneration(prev, id))
					}
					onTogglePin={(id) => setHistState((prev) => togglePin(prev, id))}
					onRemove={(id) => setHistState((prev) => removeGeneration(prev, id))}
				/>
			</div>

			<div className="lg:col-span-2 space-y-4">
				{npc ? (
					<AscendantWindow title={npc.name.toUpperCase()}>
						<div className="space-y-6">
							{/* Stat block */}
							<div className="bg-black/30 rounded-lg border border-primary/20 p-4 space-y-3">
								<div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
									<span>
										<span className="text-[11px] uppercase text-muted-foreground tracking-wider mr-1">
											AC
										</span>
										<span className="font-mono font-bold">
											{npc.statBlock.ac}
										</span>
									</span>
									<span>
										<span className="text-[11px] uppercase text-muted-foreground tracking-wider mr-1">
											HP
										</span>
										<span className="font-mono font-bold">
											{npc.statBlock.hp}
										</span>
									</span>
									<span>
										<span className="text-[11px] uppercase text-muted-foreground tracking-wider mr-1">
											Speed
										</span>
										<span className="font-mono font-bold">
											{npc.statBlock.speed} ft.
										</span>
									</span>
									<span>
										<span className="text-[11px] uppercase text-muted-foreground tracking-wider mr-1">
											CR
										</span>
										<span className="font-mono font-bold">
											{npc.statBlock.cr}
										</span>
									</span>
									<span>
										<span className="text-[11px] uppercase text-muted-foreground tracking-wider mr-1">
											Prof
										</span>
										<span className="font-mono font-bold">
											{formatMod(npc.statBlock.proficiency)}
										</span>
									</span>
								</div>
								<div className="grid grid-cols-6 gap-2 text-center">
									{ABILITY_ORDER.map((key) => (
										<div
											key={key}
											className="bg-primary/5 rounded border border-primary/10 py-2"
										>
											<div className="text-[11px] uppercase text-muted-foreground tracking-wider">
												{key}
											</div>
											<div className="font-mono text-sm font-bold">
												{npc.statBlock.abilities[key]}
											</div>
											<div className="text-[11px] text-primary/80 font-mono">
												{formatMod(abilityMod(npc.statBlock.abilities[key]))}
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="bg-primary/5 p-3 rounded border border-primary/10">
									<span className="text-[11px] uppercase text-primary/60 tracking-wider">
										Primary Motivation
									</span>
									<p className="font-heading text-sm mt-1">{npc.motivation}</p>
								</div>
								<div className="bg-destructive/5 p-3 rounded border border-destructive/10">
									<span className="text-[11px] uppercase text-destructive/60 tracking-wider">
										Encrypted Secret
									</span>
									<p className="font-heading text-sm mt-1 text-destructive/80">
										{npc.secret}
									</p>
								</div>
							</div>

							<div>
								<span className="text-[11px] uppercase text-muted-foreground tracking-wider">
									Construct Description
								</span>
								<div className="mt-2 text-sm leading-relaxed text-muted-foreground/90">
									<AutoLinkText text={npc.description} />
								</div>
							</div>

							{/* Linked canon content */}
							{(npc.equipment.length > 0 ||
								npc.features.length > 0 ||
								linked?.background ||
								linked?.location ||
								linked?.regent) && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{npc.equipment.length > 0 && (
										<div>
											<div className="flex items-center gap-2 mb-2">
												<Backpack className="w-3.5 h-3.5 text-muted-foreground" />
												<span className="text-[11px] uppercase text-muted-foreground tracking-wider">
													Equipment
												</span>
											</div>
											<div className="flex flex-wrap gap-1">
												{npc.equipment.map((item) => (
													<Badge key={item} variant="secondary">
														{item}
													</Badge>
												))}
											</div>
										</div>
									)}
									{npc.features.length > 0 && (
										<div>
											<div className="flex items-center gap-2 mb-2">
												<Star className="w-3.5 h-3.5 text-muted-foreground" />
												<span className="text-[11px] uppercase text-muted-foreground tracking-wider">
													Feats &amp; Features
												</span>
											</div>
											<div className="flex flex-wrap gap-1">
												{npc.features.map((feat) => (
													<Badge key={feat} variant="outline">
														{feat}
													</Badge>
												))}
											</div>
										</div>
									)}
									{linked?.background && (
										<div className="flex items-start gap-2">
											<ScrollText className="w-3.5 h-3.5 mt-0.5 text-blue-400 shrink-0" />
											<div>
												<span className="text-[11px] uppercase text-muted-foreground tracking-wider block">
													Background
												</span>
												<span className="text-sm">
													{linked.background.name}
												</span>
											</div>
										</div>
									)}
									{linked?.location && (
										<div className="flex items-start gap-2">
											<MapPin className="w-3.5 h-3.5 mt-0.5 text-emerald-400 shrink-0" />
											<div>
												<span className="text-[11px] uppercase text-muted-foreground tracking-wider block">
													Known Location
												</span>
												<span className="text-sm">{linked.location.name}</span>
											</div>
										</div>
									)}
									{linked?.regent && (
										<div className="flex items-start gap-2">
											<Star className="w-3.5 h-3.5 mt-0.5 text-amber-400 shrink-0" />
											<div>
												<span className="text-[11px] uppercase text-muted-foreground tracking-wider block">
													Regent Vector
												</span>
												<span className="text-sm">{linked.regent.name}</span>
											</div>
										</div>
									)}
								</div>
							)}

							{(npc.aiEnhanced || isEnhancing) && (
								<div className="pt-4 border-t border-primary/20">
									<div className="flex items-center gap-2 mb-3">
										<Sparkles className="w-4 h-4 text-primary" />
										<span className="text-[11px] font-display text-primary uppercase tracking-widest">
											Enhanced Dossier
										</span>
									</div>
									<div className="text-sm text-muted-foreground whitespace-pre-line bg-black/40 rounded-lg p-4 max-h-none sm:max-h-[400px] overflow-y-auto border border-primary/10">
										{isEnhancing ? (
											<div className="flex items-center justify-center py-8">
												<Loader2 className="w-8 h-8 animate-spin text-primary/60" />
											</div>
										) : (
											<AutoLinkText text={npc.aiEnhanced || ""} />
										)}
									</div>
								</div>
							)}
						</div>
					</AscendantWindow>
				) : (
					<AscendantWindow title="SYNTHESIS STATUS">
						<div className="text-center py-20 text-muted-foreground bg-black/20 rounded-lg border border-dashed border-border/50">
							<User className="w-12 h-12 mx-auto mb-4 opacity-10" />
							<p className="text-xs uppercase tracking-widest opacity-40">
								No Active Construct
							</p>
						</div>
					</AscendantWindow>
				)}
			</div>
		</div>
	);
}
