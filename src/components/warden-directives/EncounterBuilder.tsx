import { useQuery } from "@tanstack/react-query";
import {
	Download,
	FileJson,
	Loader2,
	Pin,
	PinOff,
	Plus,
	RefreshCw,
	Save,
	Search,
	Sword,
	Target,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import "./EncounterBuilder.css";
import { useToast } from "@/hooks/use-toast";
import { useJoinedCampaigns, useMyCampaigns } from "@/hooks/useCampaigns";
import { useDebounce } from "@/hooks/useDebounce";
import { useLiveEncounterScaler } from "@/hooks/useLiveEncounterScaler";
import {
	useCampaignToolState,
	useUserToolState,
	writeLocalToolState,
} from "@/hooks/useToolState";
import type { Database } from "@/integrations/supabase/types";
import { resolveAnomalyStats } from "@/lib/anomalyStats";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { getRandomAnomaly } from "@/lib/compendiumAutopopulate";
import { calculateDifficulty, calculateXP } from "@/lib/encounterMath";
import {
	type HistoryEntry,
	pushGeneration,
	removeGeneration,
	togglePin,
} from "@/lib/generationHistory";
import { downloadJson, downloadMarkdown } from "@/lib/toolExport";
import { cn } from "@/lib/utils";
import { normalizeRegentSearch } from "@/lib/vernacular";
import type { CompendiumAnomaly } from "@/types/compendium";

// --- Types ---

type Anomaly = Database["public"]["Tables"]["compendium_Anomalies"]["Row"] & {
	mechanics?: Database["public"]["Tables"]["compendium_runes"]["Row"]["mechanics"];
};

interface EncounterAnomaly {
	id: string;
	Anomaly: Anomaly;
	quantity: number;
}

/** A lightweight, serializable snapshot of a built encounter for save/restore/export. */
interface SavedEncounter {
	name: string;
	objectives: string;
	hunterLevel: number;
	hunterCount: number;
	anomalies: {
		id: string;
		name: string;
		cr: string;
		quantity: number;
		xp: number;
	}[];
	totalXP: number;
	difficulty: string;
}

interface EncounterToolState {
	hunterLevel: number;
	hunterCount: number;
	encounterAnomalies: EncounterAnomaly[];
	objectives?: string;
	savedEncounters?: HistoryEntry<SavedEncounter>[];
	version?: number;
	savedAt?: string;
}

/** Ranks offered for "Rift Optimization" random injection. */
const RANK_OPTIONS = ["D", "C", "B", "A", "S"] as const;
type OptimizationRank = (typeof RANK_OPTIONS)[number];

const ENCOUNTER_STORAGE_KEY =
	"solo-compendium.Warden-tools.encounter-builder.v1";
const INITIATIVE_STORAGE_KEY = "solo-compendium.Warden-tools.initiative.v1";

// --- Mappers ---

const toNumber = (value: number | undefined, fallback: number) =>
	Number.isFinite(value) ? (value as number) : fallback;

const toStringArray = (value: string | string[] | null | undefined) => {
	if (Array.isArray(value))
		return value.filter((item) => typeof item === "string");
	if (typeof value === "string") {
		return value
			.split(",")
			.map((entry) => entry.trim())
			.filter(Boolean);
	}
	return null;
};

const mapStaticAnomaly = (Anomaly: CompendiumAnomaly): Anomaly => {
	// `listCanonicalEntries("anomalies")` returns provider-TRANSFORMED entries,
	// so stat reconciliation (raw authored vs. transformed shape) lives in the
	// pure, unit-tested `resolveAnomalyStats` helper. See its docblock for why.
	const abilities = Anomaly.stats?.ability_scores ?? {};
	const stats = resolveAnomalyStats(Anomaly);

	return {
		id: Anomaly.id,
		name: Anomaly.name,
		display_name: Anomaly.display_name || Anomaly.name,
		description: Anomaly.description || "",
		flavor: null,
		lore: (Anomaly.lore as string) || null,
		image_url: Anomaly.image || Anomaly.image_url || null,
		mechanics: null,
		created_at: new Date().toISOString(),
		cr: stats.cr,
		xp: stats.xp,
		gate_rank: stats.rank,
		is_boss: stats.rank === "S" || stats.rank === "A",
		creature_type: Anomaly.type || "Unknown",
		armor_class: stats.ac,
		hit_points_average: stats.hp,
		hit_points_formula: "1d8",
		size: "Medium",
		str: toNumber(abilities.strength, 10),
		agi: toNumber(abilities.agility, 10),
		vit: toNumber(abilities.vitality, 10),
		int: toNumber(abilities.intelligence, 10),
		sense: toNumber(abilities.sense, 10),
		pre: toNumber(abilities.presence, 10),
		skills: null,
		saving_throws: Anomaly.stats?.saving_throws ?? null,
		senses: Anomaly.senses ?? null,
		languages: toStringArray(Anomaly.languages),
		damage_resistances: toStringArray(Anomaly.damage_resistances),
		damage_immunities: toStringArray(Anomaly.damage_immunities),
		damage_vulnerabilities: toStringArray(Anomaly.damage_vulnerabilities),
		condition_immunities: toStringArray(Anomaly.condition_immunities),
		armor_type: null,
		alignment: null,
		aliases: null,
		generated_reason: null,
		license_note: null,
		source_book: "Rift Ascendant Homebrew",
		source_kind: null,
		source_name: null,
		speed_burrow: null,
		speed_climb: null,
		speed_fly: null,
		speed_swim: null,
		speed_walk: null,
		tags: [Anomaly.type, stats.rank].filter(Boolean) as string[],
		theme_tags: null,
	} as unknown as Anomaly;
};

const loadCanonicalAnomalies = async (
	searchQuery: string,
	campaignId?: string | null,
): Promise<Anomaly[]> => {
	const query = normalizeRegentSearch(searchQuery.trim().toLowerCase());
	const entries = await listCanonicalEntries("anomalies", query || undefined, {
		campaignId,
	});
	const asAnomalies = entries as unknown as CompendiumAnomaly[];
	return asAnomalies.slice(0, 50).map(mapStaticAnomaly);
};

const encounterToMarkdown = (e: SavedEncounter): string => {
	const lines: string[] = [];
	lines.push(`# ${e.name || "Untitled Encounter"}`);
	lines.push("");
	lines.push(
		`**Party:** ${e.hunterCount} Ascendant(s) · Rating ${e.hunterLevel}`,
	);
	lines.push(`**Total XP:** ${e.totalXP.toLocaleString()}`);
	lines.push(`**Projected Difficulty:** ${e.difficulty}`);
	if (e.objectives.trim()) {
		lines.push("");
		lines.push("## Objectives");
		lines.push(e.objectives.trim());
	}
	lines.push("");
	lines.push("## Anomalies");
	if (e.anomalies.length === 0) {
		lines.push("_None_");
	} else {
		lines.push("| Anomaly | CR | Qty | XP |");
		lines.push("| --- | --- | --- | --- |");
		for (const a of e.anomalies) {
			lines.push(`| ${a.name} | ${a.cr} | ${a.quantity} | ${a.xp} |`);
		}
	}
	return `${lines.join("\n")}\n`;
};

// --- Component ---

export interface EncounterBuilderProps {
	campaignId?: string | null;
	className?: string;
	/** When true, renders in a stacked single-column layout suitable for narrow sidebars */
	embedded?: boolean;
}

export function EncounterBuilder({
	campaignId,
	className,
	embedded = false,
}: EncounterBuilderProps) {
	const navigate = useNavigate();
	const { toast } = useToast();

	useMyCampaigns();
	useJoinedCampaigns();

	const isCampaignScoped = !!campaignId;
	const persistenceContext = campaignId ? `campaign:${campaignId}` : "user";
	const hasUserInteractedRef = useRef(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [hunterLevel, setHunterLevel] = useState(1);
	const [hunterCount, setHunterCount] = useState(4);
	const [encounterAnomalies, setEncounterAnomalies] = useState<
		EncounterAnomaly[]
	>([]);
	const [objectives, setObjectives] = useState("");
	const [savedEncounters, setSavedEncounters] = useState<
		HistoryEntry<SavedEncounter>[]
	>([]);
	const [randomRank, setRandomRank] = useState<OptimizationRank>("C");
	/** Projected party-stress level (0–1) the Field Calibration previews against. */
	const [projectedStress, setProjectedStress] = useState(0.4);
	const { signal: calibration, analyze: analyzeCalibration } =
		useLiveEncounterScaler();

	const encounterStorageKey = campaignId
		? `${ENCOUNTER_STORAGE_KEY}.${campaignId}`
		: ENCOUNTER_STORAGE_KEY;
	const initiativeStorageKey = campaignId
		? `${INITIATIVE_STORAGE_KEY}.${campaignId}`
		: INITIATIVE_STORAGE_KEY;

	const initialToolState: EncounterToolState = {
		hunterLevel: 1,
		hunterCount: 4,
		encounterAnomalies: [],
		objectives: "",
		savedEncounters: [],
	};

	const userToolState = useUserToolState<EncounterToolState>(
		"encounter_builder",
		{
			initialState: initialToolState,
			storageKey: ENCOUNTER_STORAGE_KEY,
			enabled: !isCampaignScoped,
		},
	);

	const campaignToolState = useCampaignToolState<EncounterToolState>(
		campaignId ?? null,
		"encounter_builder",
		{
			initialState: initialToolState,
			storageKey: encounterStorageKey,
			enabled: isCampaignScoped,
		},
	);

	const {
		state: storedState,
		isLoading: isToolStateLoading,
		saveNow,
	} = isCampaignScoped ? campaignToolState : userToolState;

	const progressBarRef = useRef<HTMLDivElement>(null);

	const hydratedContextRef = useRef<string | null>(null);
	useEffect(() => {
		if (isToolStateLoading || hydratedContextRef.current === persistenceContext)
			return;
		if (!hasUserInteractedRef.current) {
			if (typeof storedState.hunterLevel === "number")
				setHunterLevel(storedState.hunterLevel);
			if (typeof storedState.hunterCount === "number")
				setHunterCount(storedState.hunterCount);
			if (Array.isArray(storedState.encounterAnomalies))
				setEncounterAnomalies(storedState.encounterAnomalies);
			if (typeof storedState.objectives === "string")
				setObjectives(storedState.objectives);
			if (Array.isArray(storedState.savedEncounters))
				setSavedEncounters(storedState.savedEncounters);
		}
		hydratedContextRef.current = persistenceContext;
	}, [isToolStateLoading, persistenceContext, storedState]);

	const debouncedState = useDebounce(
		{
			hunterLevel,
			hunterCount,
			encounterAnomalies,
			objectives,
			savedEncounters,
		},
		600,
	);
	useEffect(() => {
		if (hydratedContextRef.current !== persistenceContext) return;
		void saveNow({
			...debouncedState,
			version: 1,
			savedAt: new Date().toISOString(),
		});
	}, [debouncedState, persistenceContext, saveNow]);

	const { data: anomalies = [], isLoading } = useQuery({
		queryKey: ["anomalies", campaignId ?? "none", searchQuery],
		queryFn: () => loadCanonicalAnomalies(searchQuery, campaignId ?? null),
	});

	const totalXP = encounterAnomalies.reduce(
		(sum: number, em: EncounterAnomaly) =>
			sum + calculateXP(em.Anomaly, em.quantity),
		0,
	);
	const difficulty = calculateDifficulty(totalXP, hunterLevel, hunterCount);

	useEffect(() => {
		if (progressBarRef.current) {
			const progress = Math.min(100, (totalXP / 10000) * 100);
			progressBarRef.current.style.setProperty(
				"--progress-width",
				`${progress}%`,
			);
		}
	}, [totalXP]);

	const currentSnapshot = useMemo<SavedEncounter>(
		() => ({
			name: "",
			objectives,
			hunterLevel,
			hunterCount,
			anomalies: encounterAnomalies.map((em) => ({
				id: em.Anomaly.id,
				name: em.Anomaly.name,
				cr: String(em.Anomaly.cr ?? "?"),
				quantity: em.quantity,
				xp: calculateXP(em.Anomaly, em.quantity),
			})),
			totalXP,
			difficulty: difficulty || "minimal",
		}),
		[
			objectives,
			hunterLevel,
			hunterCount,
			encounterAnomalies,
			totalXP,
			difficulty,
		],
	);

	// Bureau Field Calibration: project how the fight tips if the party drops to
	// `projectedStress` HP while enemies stay full — a forward-looking read using
	// the live combat scaler against a synthetic mid-fight snapshot.
	useEffect(() => {
		if (encounterAnomalies.length === 0) return;
		const party = Array.from({ length: Math.max(1, hunterCount) }, (_, i) => ({
			id: `party-${i}`,
			side: "party" as const,
			hp: Math.round(100 * projectedStress),
			maxHp: 100,
			threat: 1 + hunterLevel / 5,
		}));
		const enemy = encounterAnomalies.flatMap((em) =>
			Array.from({ length: Math.max(1, em.quantity) }, (_, i) => ({
				id: `${em.Anomaly.id}-${i}`,
				side: "enemy" as const,
				hp: em.Anomaly.hit_points_average || 10,
				maxHp: em.Anomaly.hit_points_average || 10,
				threat: Math.max(1, calculateXP(em.Anomaly, 1) / 200),
			})),
		);
		analyzeCalibration({
			sessionId: "encounter-builder-projection",
			round: 1,
			combatants: [...party, ...enemy],
		});
	}, [
		encounterAnomalies,
		hunterCount,
		hunterLevel,
		projectedStress,
		analyzeCalibration,
	]);

	const addAnomaly = (Anomaly: Anomaly) => {
		hasUserInteractedRef.current = true;
		const existing = encounterAnomalies.find(
			(em) => em.Anomaly.id === Anomaly.id,
		);
		if (existing) {
			setEncounterAnomalies(
				encounterAnomalies.map((em) =>
					em.id === existing.id ? { ...em, quantity: em.quantity + 1 } : em,
				),
			);
		} else {
			setEncounterAnomalies([
				...encounterAnomalies,
				{ id: `${Anomaly.id}-${Date.now()}`, Anomaly, quantity: 1 },
			]);
		}
	};

	const removeAnomaly = (id: string) => {
		hasUserInteractedRef.current = true;
		setEncounterAnomalies(encounterAnomalies.filter((em) => em.id !== id));
	};

	const updateQuantity = (id: string, quantity: number) => {
		hasUserInteractedRef.current = true;
		if (quantity <= 0) {
			removeAnomaly(id);
			return;
		}
		setEncounterAnomalies(
			encounterAnomalies.map((em) => (em.id === id ? { ...em, quantity } : em)),
		);
	};

	const handleRandomize = async () => {
		hasUserInteractedRef.current = true;
		const m = await getRandomAnomaly(randomRank);
		if (m) {
			addAnomaly(m as Anomaly);
		} else {
			toast({
				title: "No match",
				description: `No Rank-${randomRank} Anomaly available to inject.`,
			});
		}
	};

	const saveCurrentEncounter = () => {
		if (encounterAnomalies.length === 0) return;
		hasUserInteractedRef.current = true;
		const defaultName = `${currentSnapshot.difficulty} · ${encounterAnomalies.length} type(s) · ${totalXP.toLocaleString()} XP`;
		const name = (
			window.prompt("Name this encounter", defaultName) ?? ""
		).trim();
		if (!name) return;
		const next = pushGeneration(
			{ current: null, history: savedEncounters },
			{ ...currentSnapshot, name },
			name,
		);
		setSavedEncounters(next.history);
		toast({ title: "Encounter saved", description: name });
	};

	const restoreSavedEncounter = (entry: HistoryEntry<SavedEncounter>) => {
		hasUserInteractedRef.current = true;
		setHunterLevel(entry.record.hunterLevel);
		setHunterCount(entry.record.hunterCount);
		setObjectives(entry.record.objectives ?? "");
		toast({
			title: "Restored settings",
			description: `${entry.label} — party + objectives loaded. Re-add Anomalies from the registry.`,
		});
	};

	const removeSavedEncounter = (id: string) => {
		hasUserInteractedRef.current = true;
		setSavedEncounters(
			removeGeneration({ current: null, history: savedEncounters }, id).history,
		);
	};

	const pinSavedEncounter = (id: string) => {
		hasUserInteractedRef.current = true;
		setSavedEncounters(
			togglePin({ current: null, history: savedEncounters }, id).history,
		);
	};

	const exportEncounter = (format: "md" | "json") => {
		const record: SavedEncounter = {
			...currentSnapshot,
			name: currentSnapshot.name || `encounter-${currentSnapshot.difficulty}`,
		};
		const base = record.name || "encounter";
		if (format === "md") downloadMarkdown(base, encounterToMarkdown(record));
		else downloadJson(base, record);
	};

	const sendToInitiativeTracker = async () => {
		if (encounterAnomalies.length === 0) return;
		const combatants = encounterAnomalies.flatMap((em) => {
			const qty = Math.max(1, em.quantity || 1);
			return Array.from({ length: qty }, (_, i) => ({
				id: `${em.Anomaly.id}-${Date.now()}-${Math.random()}-${i}`,
				name: qty > 1 ? `${em.Anomaly.name} #${i + 1}` : em.Anomaly.name,
				initiative: 0,
				hp: em.Anomaly.hit_points_average || undefined,
				maxHp: em.Anomaly.hit_points_average || undefined,
				ac: em.Anomaly.armor_class || undefined,
				conditions: [],
				// The tracker's roster render requires this array on every
				// combatant (its hydration also backfills, but write it right).
				advancedConditions: [],
				isHunter: false,
			}));
		});

		const initiativeState = {
			version: 1,
			savedAt: new Date().toISOString(),
			combatants,
			currentTurn: 0,
			round: 1,
		};
		writeLocalToolState(initiativeStorageKey, initiativeState);

		toast({
			title: "Injected to Tracker",
			description: "Encounter entities loaded into the initiative Lattice.",
		});
		navigate(
			campaignId
				? `/warden-directives/initiative-tracker?campaignId=${campaignId}`
				: "/warden-directives/initiative-tracker",
		);
	};

	return (
		<div
			className={cn(
				embedded
					? "flex flex-col gap-4"
					: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				className,
			)}
		>
			{/* Left Column: Build & Anomalys */}
			<div className={embedded ? "w-full" : "lg:col-span-8 space-y-6"}>
				<AscendantWindow
					title={embedded ? "CONSTRUCTS" : "MODEL SYNTHESIS: CONSTRUCTS"}
				>
					<div className="space-y-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
							<Input
								placeholder="Search entity registry..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 h-11 bg-black/40 border-primary/20"
							/>
						</div>

						<div
							className={cn(
								"grid gap-3 pr-2 custom-scrollbar",
								embedded
									? "grid-cols-1 max-h-[300px] overflow-y-auto"
									: "grid-cols-1 md:grid-cols-2 max-h-[600px] overflow-y-auto",
							)}
						>
							{isLoading ? (
								<div className="col-span-2 py-20 text-center">
									<Loader2 className="w-8 h-8 animate-spin mx-auto text-primary/60" />
								</div>
							) : (
								anomalies.map((Anomaly) => (
									<div
										key={Anomaly.id}
										className="group p-3 rounded-lg border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors flex justify-between items-center"
									>
										<div>
											<p className="font-heading text-sm">{Anomaly.name}</p>
											<div className="flex gap-2 mt-1">
												<Badge
													variant="outline"
													className="text-[11px] h-4 uppercase"
												>
													{Anomaly.creature_type}
												</Badge>
												<Badge className="text-[11px] h-4">
													CR {Anomaly.cr}
												</Badge>
											</div>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => addAnomaly(Anomaly)}
											aria-label={`Add ${Anomaly.name}`}
											className="h-8 w-8 p-0 opacity-100 md:opacity-20 md:group-hover:opacity-100 transition-opacity focus-within:opacity-100"
										>
											<Plus className="w-4 h-4" />
										</Button>
									</div>
								))
							)}
						</div>
					</div>
				</AscendantWindow>
			</div>

			{/* Right Column: Calculations & Controls */}
			<div className={embedded ? "w-full" : "lg:col-span-4 space-y-6"}>
				<AscendantWindow title="THREAT VECTOR ANALYSIS">
					<div className="space-y-6">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="text-[11px] uppercase tracking-widest text-muted-foreground">
									Ascendant Rating
								</Label>
								<Input
									type="number"
									value={hunterLevel}
									onChange={(e) =>
										setHunterLevel(Number.parseInt(e.target.value, 10) || 1)
									}
									className="h-9"
									min={1}
									max={20}
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-[11px] uppercase tracking-widest text-muted-foreground">
									Unit Count
								</Label>
								<Input
									type="number"
									value={hunterCount}
									onChange={(e) =>
										setHunterCount(Number.parseInt(e.target.value, 10) || 1)
									}
									className="h-9"
									min={1}
									max={20}
								/>
							</div>
						</div>

						<div className="p-4 rounded-lg bg-black/60 border border-primary/20 text-center space-y-2">
							<p className="text-[11px] uppercase tracking-tighter text-muted-foreground">
								Projected Difficulty
							</p>
							<p
								className={cn(
									"text-2xl font-sovereign uppercase tracking-widest",
									difficulty === "easy"
										? "text-green-400"
										: difficulty === "medium"
											? "text-gate-s"
											: difficulty === "hard"
												? "text-gate-a"
												: "text-red-500",
								)}
							>
								{difficulty || "Minimal"}
							</p>
							<div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
								<div
									ref={progressBarRef}
									className="h-full bg-primary transition-all duration-1000 encounter-progress-bar"
								/>
							</div>
						</div>

						{/* Bureau Field Calibration — projected outcome at a chosen party-stress level */}
						{calibration && encounterAnomalies.length > 0 && (
							<div className="p-3 rounded-lg bg-black/40 border border-accent/20 space-y-2">
								<div className="flex items-center justify-between">
									<p className="text-[11px] uppercase tracking-widest text-accent/80 font-bold flex items-center gap-1">
										<Target className="w-3 h-3" /> Field Calibration
									</p>
									<Badge
										variant="outline"
										className="text-[11px] h-4 uppercase"
									>
										{calibration.band}
									</Badge>
								</div>
								<div className="flex items-center gap-2">
									<Label className="text-[11px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">
										Party @ {Math.round(projectedStress * 100)}%
									</Label>
									<input
										type="range"
										min={10}
										max={100}
										step={5}
										value={Math.round(projectedStress * 100)}
										onChange={(e) =>
											setProjectedStress(Number(e.target.value) / 100)
										}
										className="flex-1 accent-[hsl(var(--accent))]"
										aria-label="Projected party stress level"
									/>
								</div>
								<p className="text-[11px] leading-snug text-muted-foreground">
									{calibration.recommendation}
								</p>
							</div>
						)}

						{/* Objectives */}
						<div className="space-y-2">
							<Label className="text-[11px] uppercase tracking-widest text-muted-foreground">
								Objectives
							</Label>
							<Textarea
								value={objectives}
								onChange={(e) => {
									hasUserInteractedRef.current = true;
									setObjectives(e.target.value);
								}}
								placeholder="Win conditions, complications, terrain, escape triggers…"
								className="min-h-[64px] text-xs bg-black/40 border-primary/20"
							/>
						</div>

						<div className="space-y-3">
							<p className="text-[11px] uppercase tracking-widest text-primary/60 px-1 font-bold">
								Active Lattice Entities
							</p>
							<div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
								{encounterAnomalies.length === 0 ? (
									<p className="text-xs text-center py-8 text-muted-foreground italic opacity-50">
										Lattice Empty
									</p>
								) : (
									encounterAnomalies.map((em) => (
										<div
											key={em.id}
											className="flex items-center justify-between p-2 rounded bg-primary/5 border border-primary/10"
										>
											<div className="truncate pr-2">
												<p className="text-xs font-bold truncate">
													{em.Anomaly.name}
												</p>
												<p className="text-[11px] opacity-60">
													XP {calculateXP(em.Anomaly, 1)}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Input
													type="number"
													value={em.quantity}
													onChange={(e) =>
														updateQuantity(
															em.id,
															Number.parseInt(e.target.value, 10) || 0,
														)
													}
													className="h-7 w-12 text-center text-xs p-1"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeAnomaly(em.id)}
													className="h-7 w-7 p-0 text-destructive/40 hover:text-destructive"
												>
													×
												</Button>
											</div>
										</div>
									))
								)}
							</div>
						</div>

						<div className="space-y-2 pt-4 border-t border-primary/10">
							<Button
								type="button"
								onClick={sendToInitiativeTracker}
								className="w-full h-11 gap-2"
								disabled={encounterAnomalies.length === 0}
							>
								<Sword className="w-4 h-4" />
								Commence Combat Sync
							</Button>

							<div className="flex gap-2">
								<select
									value={randomRank}
									onChange={(e) =>
										setRandomRank(e.target.value as OptimizationRank)
									}
									aria-label="Random injection rank"
									className="h-9 rounded-[2px] border border-primary/20 bg-black/40 px-2 text-xs text-foreground"
								>
									{RANK_OPTIONS.map((r) => (
										<option key={r} value={r}>
											Rank {r}
										</option>
									))}
								</select>
								<Button
									type="button"
									onClick={handleRandomize}
									variant="outline"
									className="flex-1 h-9 gap-2"
								>
									<RefreshCw className="w-3 h-3" />
									Rift Optimization
								</Button>
							</div>

							<div className="flex gap-2">
								<Button
									type="button"
									onClick={saveCurrentEncounter}
									variant="outline"
									className="flex-1 h-9 gap-2"
									disabled={encounterAnomalies.length === 0}
								>
									<Save className="w-3 h-3" />
									Save
								</Button>
								<Button
									type="button"
									onClick={() => exportEncounter("md")}
									variant="outline"
									size="icon"
									className="h-9 w-9"
									title="Export Markdown"
									disabled={encounterAnomalies.length === 0}
								>
									<Download className="w-3 h-3" />
								</Button>
								<Button
									type="button"
									onClick={() => exportEncounter("json")}
									variant="outline"
									size="icon"
									className="h-9 w-9"
									title="Export JSON"
									disabled={encounterAnomalies.length === 0}
								>
									<FileJson className="w-3 h-3" />
								</Button>
							</div>
						</div>

						{savedEncounters.length > 0 && (
							<div className="space-y-2 pt-4 border-t border-primary/10">
								<p className="text-[11px] uppercase tracking-widest text-primary/60 px-1 font-bold">
									Saved Encounters
								</p>
								<div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
									{savedEncounters.map((entry) => (
										<div
											key={entry.id}
											className="flex items-center justify-between gap-2 p-2 rounded bg-primary/5 border border-primary/10"
										>
											<button
												type="button"
												onClick={() => restoreSavedEncounter(entry)}
												className="flex-1 text-left truncate hover:text-primary transition-colors"
												title="Restore party + objectives"
											>
												<span className="text-xs font-bold truncate flex items-center gap-1">
													{entry.pinned && (
														<Pin className="w-3 h-3 text-accent shrink-0" />
													)}
													{entry.label}
												</span>
												<span className="block text-[11px] opacity-60">
													{entry.record.totalXP.toLocaleString()} XP ·{" "}
													{entry.record.anomalies.length} type(s)
												</span>
											</button>
											<div className="flex items-center gap-1 shrink-0">
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => pinSavedEncounter(entry.id)}
													className="h-6 w-6 p-0"
													title={entry.pinned ? "Unpin" : "Pin"}
												>
													{entry.pinned ? (
														<PinOff className="w-3 h-3" />
													) : (
														<Pin className="w-3 h-3" />
													)}
												</Button>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeSavedEncounter(entry.id)}
													className="h-6 w-6 p-0 text-destructive/50 hover:text-destructive"
													title="Delete"
												>
													<Trash2 className="w-3 h-3" />
												</Button>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</AscendantWindow>
			</div>
		</div>
	);
}
