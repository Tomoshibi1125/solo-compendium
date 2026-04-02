import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, RefreshCw, Search, Sword } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemWindow } from "@/components/ui/SystemWindow";
import "./EncounterBuilder.css";
import { monsters as staticMonsters } from "@/data/compendium/monsters";
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
import { getRandomMonster } from "@/lib/compendiumAutopopulate";
import { calculateDifficulty, calculateXP } from "@/lib/encounterMath";
import { getCRXP } from "@/lib/experience";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import { cn } from "@/lib/utils";
import { normalizeRegentSearch } from "@/lib/vernacular";

// --- Types ---

type Monster = Database["public"]["Tables"]["compendium_monsters"]["Row"] & {
	mechanics?: Database["public"]["Tables"]["compendium_runes"]["Row"]["mechanics"];
};

interface EncounterMonster {
	id: string;
	monster: Monster;
	quantity: number;
}

type AbilityScores = {
	strength: number;
	dexterity: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
};

type SavingThrows = Partial<AbilityScores>;

type StaticMonster = {
	id: string;
	name: string;
	type: string;
	rank: string;
	description?: string;
	lore?: string;
	size?: string;
	image?: string;
	skills?: string[] | string;
	senses?: string[] | string;
	languages?: string[] | string;
	damageResistances?: string[] | string;
	damageImmunities?: string[] | string;
	damageVulnerabilities?: string[] | string;
	conditionImmunities?: string[] | string;
	stats?: {
		abilityScores?: Partial<AbilityScores>;
		armorClass?: number;
		hitPoints?: number;
		challengeRating?: number;
		savingThrows?: SavingThrows;
	};
};

const ENCOUNTER_STORAGE_KEY = "solo-compendium.PW-tools.encounter-builder.v1";
const INITIATIVE_STORAGE_KEY = "solo-compendium.PW-tools.initiative.v1";

const RANK_CR_MAP: Record<string, string> = {
	D: "1/2",
	C: "1",
	B: "4",
	A: "8",
	S: "15",
};

// --- Mappers ---

const staticMonstersList = staticMonsters as StaticMonster[];

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

const mapStaticMonster = (monster: StaticMonster): Monster => {
	const abilities: Partial<AbilityScores> = monster.stats?.abilityScores ?? {};
	const crValue =
		typeof monster.stats?.challengeRating === "number"
			? String(monster.stats.challengeRating)
			: RANK_CR_MAP[monster.rank] || "1";
	const hitPoints = toNumber(monster.stats?.hitPoints, 1);

	return {
		id: monster.id,
		name: monster.name,
		display_name: monster.name,
		description: monster.description || "",
		flavor: null,
		lore: monster.lore || null,
		image_url: monster.image || null,
		mechanics: null,
		created_at: new Date().toISOString(),
		cr: crValue,
		xp: getCRXP(crValue),
		gate_rank: monster.rank || null,
		is_boss: monster.rank === "S" || monster.rank === "A",
		creature_type: monster.type || "Unknown",
		armor_class: toNumber(monster.stats?.armorClass, 10),
		hit_points_average: hitPoints,
		hit_points_formula: "1d8",
		size: monster.size || "Medium",
		str: toNumber(abilities.strength, 10),
		agi: toNumber(abilities.dexterity, 10),
		vit: toNumber(abilities.constitution, 10),
		int: toNumber(abilities.intelligence, 10),
		sense: toNumber(abilities.wisdom, 10),
		pre: toNumber(abilities.charisma, 10),
		skills: monster.skills ?? null,
		saving_throws: monster.stats?.savingThrows ?? null,
		senses: monster.senses ?? null,
		languages: toStringArray(monster.languages),
		damage_resistances: toStringArray(monster.damageResistances),
		damage_immunities: toStringArray(monster.damageImmunities),
		damage_vulnerabilities: toStringArray(monster.damageVulnerabilities),
		condition_immunities: toStringArray(monster.conditionImmunities),
		armor_type: null,
		alignment: null,
		aliases: null,
		generated_reason: null,
		license_note: null,
		source_book: "System Ascendant Homebrew",
		source_kind: null,
		source_name: null,
		speed_burrow: null,
		speed_climb: null,
		speed_fly: null,
		speed_swim: null,
		speed_walk: null,
		tags: [monster.type, monster.rank].filter(Boolean),
		theme_tags: null,
	};
};

const buildFallbackMonsters = (searchQuery: string) => {
	const query = normalizeRegentSearch(searchQuery.trim().toLowerCase());
	const filtered = query
		? staticMonstersList.filter((monster) => {
				const description = monster.description || "";
				return (
					normalizeRegentSearch(monster.name.toLowerCase()).includes(query) ||
					normalizeRegentSearch(monster.type.toLowerCase()).includes(query) ||
					normalizeRegentSearch(monster.rank.toLowerCase()).includes(query) ||
					normalizeRegentSearch(description.toLowerCase()).includes(query)
				);
			})
		: staticMonstersList;
	return filtered.slice(0, 50).map(mapStaticMonster);
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
	const [encounterMonsters, setEncounterMonsters] = useState<
		EncounterMonster[]
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
		encounterMonsters: EncounterMonster[];
		version?: number;
		savedAt?: string;
	}>("encounter_builder", {
		initialState: { hunterLevel: 1, hunterCount: 4, encounterMonsters: [] },
		storageKey: ENCOUNTER_STORAGE_KEY,
		enabled: !isCampaignScoped,
	});

	const campaignToolState = useCampaignToolState<{
		hunterLevel: number;
		hunterCount: number;
		encounterMonsters: EncounterMonster[];
		version?: number;
		savedAt?: string;
	}>(campaignId ?? null, "encounter_builder", {
		initialState: { hunterLevel: 1, hunterCount: 4, encounterMonsters: [] },
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
			if (Array.isArray(storedState.encounterMonsters))
				setEncounterMonsters(storedState.encounterMonsters);
		}
		hydratedContextRef.current = persistenceContext;
	}, [isToolStateLoading, persistenceContext, storedState]);

	const debouncedState = useDebounce(
		{ hunterLevel, hunterCount, encounterMonsters },
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

	const { data: monsters = [], isLoading } = useQuery({
		queryKey: ["monsters", campaignId ?? "none", searchQuery],
		queryFn: async () => {
			const fallbackMonsters = buildFallbackMonsters(searchQuery);
			if (!isSupabaseConfigured) return fallbackMonsters;

			const canonicalQuery = normalizeRegentSearch(searchQuery);
			let query = supabase.from("compendium_monsters").select("*").limit(50);
			if (canonicalQuery) query = query.ilike("name", `%${canonicalQuery}%`);

			try {
				const { data, error } = await query;
				if (error || !data || data.length === 0) return fallbackMonsters;
				const filtered = await filterRowsBySourcebookAccess(
					data as Monster[],
					(m) => m.source_book,
					{ campaignId: campaignId ?? null },
				);
				return filtered.length > 0 ? filtered : fallbackMonsters;
			} catch {
				return fallbackMonsters;
			}
		},
	});

	const totalXP = encounterMonsters.reduce(
		(sum, em) => sum + calculateXP(em.monster, em.quantity),
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

	const addMonster = (monster: Monster) => {
		hasUserInteractedRef.current = true;
		const existing = encounterMonsters.find(
			(em) => em.monster.id === monster.id,
		);
		if (existing) {
			setEncounterMonsters(
				encounterMonsters.map((em) =>
					em.id === existing.id ? { ...em, quantity: em.quantity + 1 } : em,
				),
			);
		} else {
			setEncounterMonsters([
				...encounterMonsters,
				{ id: `${monster.id}-${Date.now()}`, monster, quantity: 1 },
			]);
		}
	};

	const removeMonster = (id: string) => {
		hasUserInteractedRef.current = true;
		setEncounterMonsters(encounterMonsters.filter((em) => em.id !== id));
	};

	const updateQuantity = (id: string, quantity: number) => {
		hasUserInteractedRef.current = true;
		if (quantity <= 0) {
			removeMonster(id);
			return;
		}
		setEncounterMonsters(
			encounterMonsters.map((em) => (em.id === id ? { ...em, quantity } : em)),
		);
	};

	const handleRandomize = async () => {
		const rank = "C"; // Default to C-Rank for random
		const m = await getRandomMonster(rank);
		if (m) addMonster(m as Monster);
	};

	const sendToInitiativeTracker = async () => {
		if (encounterMonsters.length === 0) return;
		const combatants = encounterMonsters.flatMap((em) => {
			const qty = Math.max(1, em.quantity || 1);
			return Array.from({ length: qty }, (_, i) => ({
				id: `${em.monster.id}-${Date.now()}-${Math.random()}-${i}`,
				name: qty > 1 ? `${em.monster.name} #${i + 1}` : em.monster.name,
				initiative: 0,
				hp: em.monster.hit_points_average || undefined,
				maxHp: em.monster.hit_points_average || undefined,
				ac: em.monster.armor_class || undefined,
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
			description: "Encounter entities loaded into the initiative matrix.",
		});
		navigate(
			campaignId
				? `/warden-protocols/initiative-tracker?campaignId=${campaignId}`
				: "/warden-protocols/initiative-tracker",
		);
	};

	return (
		<div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-6", className)}>
			{/* Left Column: Build & Monsters */}
			<div className="lg:col-span-8 space-y-6">
				<SystemWindow title="MODEL SYNTHESIS: CONSTRUCTS">
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
								monsters.map((monster) => (
									<div
										key={monster.id}
										className="group p-3 rounded-lg border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors flex justify-between items-center"
									>
										<div>
											<p className="font-heading text-sm">{monster.name}</p>
											<div className="flex gap-2 mt-1">
												<Badge
													variant="outline"
													className="text-[10px] h-4 uppercase"
												>
													{monster.creature_type}
												</Badge>
												<Badge className="text-[10px] h-4">
													CR {monster.cr}
												</Badge>
											</div>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => addMonster(monster)}
											className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<Plus className="w-4 h-4" />
										</Button>
									</div>
								))
							)}
						</div>
					</div>
				</SystemWindow>
			</div>

			{/* Right Column: Calculations & Controls */}
			<div className="lg:col-span-4 space-y-6">
				<SystemWindow title="THREAT VECTOR ANALYSIS">
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
								Active Matrix Entities
							</p>
							<div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
								{encounterMonsters.length === 0 ? (
									<p className="text-xs text-center py-8 text-muted-foreground italic opacity-50">
										Matrix Empty
									</p>
								) : (
									encounterMonsters.map((em) => (
										<div
											key={em.id}
											className="flex items-center justify-between p-2 rounded bg-primary/5 border border-primary/10"
										>
											<div className="truncate pr-2">
												<p className="text-xs font-bold truncate">
													{em.monster.name}
												</p>
												<p className="text-[10px] opacity-60">
													XP {calculateXP(em.monster, 1)}
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
													onClick={() => removeMonster(em.id)}
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
								disabled={encounterMonsters.length === 0}
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
				</SystemWindow>
			</div>
		</div>
	);
}
