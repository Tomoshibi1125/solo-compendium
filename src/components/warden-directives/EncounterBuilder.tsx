import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, RefreshCw, Search, Sword } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./EncounterBuilder.css";
import { useToast } from "@/hooks/use-toast";
import { useJoinedCampaigns, useMyCampaigns } from "@/hooks/useCampaigns";
import { useDebounce } from "@/hooks/useDebounce";
import {
	useCampaignToolState,
	useUserToolState,
	writeLocalToolState,
} from "@/hooks/useToolState";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getRandomAnomaly } from "@/lib/compendiumAutopopulate";
import { calculateDifficulty, calculateXP } from "@/lib/encounterMath";
import { getCRXP } from "@/lib/experience";
import { getStaticAnomalies } from "@/lib/ProtocolDataManager";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
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

const ENCOUNTER_STORAGE_KEY =
	"solo-compendium.Warden-tools.encounter-builder.v1";
const INITIATIVE_STORAGE_KEY = "solo-compendium.Warden-tools.initiative.v1";

const RANK_CR_MAP: Record<string, string> = {
	D: "1/2",
	C: "1",
	B: "4",
	A: "8",
	S: "15",
};

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
	const abilities = Anomaly.stats?.ability_scores ?? {};
	const crValue =
		typeof Anomaly.stats?.challenge_rating === "number"
			? String(Anomaly.stats.challenge_rating)
			: RANK_CR_MAP[Anomaly.rank || "D"] || "1";
	const hitPoints = toNumber(Anomaly.hp ?? (Anomaly as unknown as Record<string, unknown>).hit_points as number, 1);

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
		cr: crValue,
		xp: getCRXP(crValue),
		gate_rank: Anomaly.rank || null,
		is_boss: Anomaly.rank === "S" || Anomaly.rank === "A",
		creature_type: Anomaly.type || "Unknown",
		armor_class: toNumber(Anomaly.ac ?? (Anomaly as unknown as Record<string, unknown>).armor_class as number, 10),
		hit_points_average: hitPoints,
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
		tags: [Anomaly.type, Anomaly.rank].filter(Boolean) as string[],
		theme_tags: null,
	};
};

const buildFallbackAnomalies = (searchQuery: string) => {
	const query = normalizeRegentSearch(searchQuery.trim().toLowerCase());
	const staticList = getStaticAnomalies();
	const filtered = query
		? staticList.filter((Anomaly) => {
				const description = Anomaly.description || "";
				return (
					normalizeRegentSearch(Anomaly.name.toLowerCase()).includes(query) ||
					normalizeRegentSearch((Anomaly.type || "").toLowerCase()).includes(
						query,
					) ||
					normalizeRegentSearch((Anomaly.rank || "").toLowerCase()).includes(
						query,
					) ||
					normalizeRegentSearch(description.toLowerCase()).includes(query)
				);
			})
		: staticList;
	return filtered.slice(0, 50).map(mapStaticAnomaly);
};

// --- Component ---

export interface EncounterBuilderProps {
	campaignId?: string | null;
	className?: string;
}

export function EncounterBuilder({
	campaignId,
	className,
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

	const encounterStorageKey = campaignId
		? `${ENCOUNTER_STORAGE_KEY}.${campaignId}`
		: ENCOUNTER_STORAGE_KEY;
	const initiativeStorageKey = campaignId
		? `${INITIATIVE_STORAGE_KEY}.${campaignId}`
		: INITIATIVE_STORAGE_KEY;

	const userToolState = useUserToolState<{
		hunterLevel: number;
		hunterCount: number;
		encounterAnomalies: EncounterAnomaly[];
		version?: number;
		savedAt?: string;
	}>("encounter_builder", {
		initialState: { hunterLevel: 1, hunterCount: 4, encounterAnomalies: [] },
		storageKey: ENCOUNTER_STORAGE_KEY,
		enabled: !isCampaignScoped,
	});

	const campaignToolState = useCampaignToolState<{
		hunterLevel: number;
		hunterCount: number;
		encounterAnomalies: EncounterAnomaly[];
		version?: number;
		savedAt?: string;
	}>(campaignId ?? null, "encounter_builder", {
		initialState: { hunterLevel: 1, hunterCount: 4, encounterAnomalies: [] },
		storageKey: encounterStorageKey,
		enabled: isCampaignScoped,
	});

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
		}
		hydratedContextRef.current = persistenceContext;
	}, [isToolStateLoading, persistenceContext, storedState]);

	const debouncedState = useDebounce(
		{ hunterLevel, hunterCount, encounterAnomalies },
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
		queryFn: async () => {
			const fallbackAnomalies = buildFallbackAnomalies(searchQuery);
			if (!isSupabaseConfigured) return fallbackAnomalies;

			const canonicalQuery = normalizeRegentSearch(searchQuery);
			let query = supabase.from("compendium_Anomalies").select("*").limit(50);
			if (canonicalQuery) query = query.ilike("name", `%${canonicalQuery}%`);

			try {
				const { data, error } = await query;
				if (error || !data || data.length === 0) return fallbackAnomalies;
				const filtered = await filterRowsBySourcebookAccess(
					data as Anomaly[],
					(m) => m.source_book,
					{ campaignId: campaignId ?? null },
				);
				return filtered.length > 0 ? filtered : fallbackAnomalies;
			} catch {
				return fallbackAnomalies;
			}
		},
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
		const rank = "C"; // Default to C-Rank for random
		const m = await getRandomAnomaly(rank);
		if (m) addAnomaly(m as Anomaly);
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
		<div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-6", className)}>
			{/* Left Column: Build & Anomalys */}
			<div className="lg:col-span-8 space-y-6">
				<AscendantWindow title="MODEL SYNTHESIS: CONSTRUCTS">
					<div className="space-y-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
							<Input
								placeholder="Search entity registry..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 h-11 bg-black/40 border-primary/20"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
							{isLoading ? (
								<div className="col-span-2 py-20 text-center">
									<Loader2 className="w-8 h-8 animate-spin mx-auto text-primary/40" />
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
													className="text-[10px] h-4 uppercase"
												>
													{Anomaly.creature_type}
												</Badge>
												<Badge className="text-[10px] h-4">
													CR {Anomaly.cr}
												</Badge>
											</div>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => addAnomaly(Anomaly)}
											className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
			<div className="lg:col-span-4 space-y-6">
				<AscendantWindow title="THREAT VECTOR ANALYSIS">
					<div className="space-y-6">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
									Hunter Rating
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
								<Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
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
							<p className="text-[10px] uppercase tracking-tighter text-muted-foreground">
								Projected Difficulty
							</p>
							<p
								className={cn(
									"text-2xl font-sovereign uppercase tracking-widest",
									difficulty === "easy"
										? "text-green-400"
										: difficulty === "medium"
											? "text-yellow-400"
											: difficulty === "hard"
												? "text-orange-400"
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

						<div className="space-y-3">
							<p className="text-[10px] uppercase tracking-widest text-primary/60 px-1 font-bold">
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
												<p className="text-[10px] opacity-60">
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
							<Button
								type="button"
								onClick={handleRandomize}
								variant="outline"
								className="w-full h-9 gap-2"
							>
								<RefreshCw className="w-3 h-3" />
								Rift Optimization
							</Button>
						</div>
					</div>
				</AscendantWindow>
			</div>
		</div>
	);
}
