import {
	ArrowDown,
	ArrowLeft,
	ArrowUp,
	ExternalLink,
	Plus,
	RotateCcw,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSendCampaignMessage } from "@/hooks/useCampaignChat";
import {
	type Combatant as CampaignCombatantRow,
	useCampaignCombatSession,
	useUpdateCombatSession,
	useUpsertCombatants,
} from "@/hooks/useCampaignCombat";
import { useCampaignCombatRealtime } from "@/hooks/useCampaignCombatRealtime";
import {
	useCampaignMembers,
	useJoinedCampaigns,
	useMyCampaigns,
} from "@/hooks/useCampaigns";
import { useDebounce } from "@/hooks/useDebounce";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { useHydratedPreferredCampaignId } from "@/hooks/usePreferredCampaignSelection";
import { useCampaignToolState, useUserToolState } from "@/hooks/useToolState";
import { supabase } from "@/integrations/supabase/client";
import {
	type ActionResolutionPayload,
	clearPendingResolution,
	getPendingResolution,
	type ResolutionOutcome,
	resolveAttack,
	resolveDamage,
	resolveHealing,
	resolveSave,
} from "@/lib/actionResolution";
import { cleanupExpiredConditions as cleanupExpiredConditionsHelper } from "@/lib/conditionTimers";
import { cn } from "@/lib/utils";

interface Combatant {
	id: string;
	name: string;
	initiative: number;
	hp?: number;
	maxHp?: number;
	ac?: number;
	conditions: string[];
	condition_timers?: Record<string, number>;
	isHunter: boolean;
	damage_resistances?: string[];
	damage_immunities?: string[];
	damage_vulnerabilities?: string[];
}

type CampaignWithRole = {
	id: string;
	name: string;
	access: "owner" | "co-system";
};

const toNumber = (value: unknown): number | undefined => {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	return undefined;
};

const toRecord = (value: unknown): Record<string, unknown> => {
	if (typeof value === "object" && value !== null && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}
	return {};
};

const toConditionArray = (value: unknown): string[] => {
	if (!Array.isArray(value)) return [];
	return value.filter((entry): entry is string => typeof entry === "string");
};

const toConditionTimers = (
	value: unknown,
): Record<string, number> | undefined => {
	if (!value || typeof value !== "object" || Array.isArray(value))
		return undefined;
	const record = value as Record<string, unknown>;
	const entries = Object.entries(record).filter(
		([, v]) => typeof v === "number" && Number.isFinite(v),
	);
	if (entries.length === 0) return undefined;
	return Object.fromEntries(entries.map(([k, v]) => [k, v as number]));
};

const toStringArray = (value: unknown): string[] | undefined => {
	if (!Array.isArray(value)) return undefined;
	const entries = value.filter(
		(entry): entry is string =>
			typeof entry === "string" && entry.trim().length > 0,
	);
	return entries.length > 0 ? entries : undefined;
};

const normalizeDamageType = (value: string) => value.trim().toLowerCase();

const applyDamageMitigation = (
	amount: number,
	damageType: string | undefined,
	target: Combatant,
): number => {
	if (!damageType) return amount;
	const dt = normalizeDamageType(damageType);

	const immunities = (target.damage_immunities ?? []).map(normalizeDamageType);
	if (immunities.includes(dt)) return 0;

	const vulnerabilities = (target.damage_vulnerabilities ?? []).map(
		normalizeDamageType,
	);
	if (vulnerabilities.includes(dt)) return amount * 2;

	const resistances = (target.damage_resistances ?? []).map(
		normalizeDamageType,
	);
	if (resistances.includes(dt)) return Math.ceil(amount / 2);

	return amount;
};

const mapCampaignCombatantToTracker = (
	combatant: CampaignCombatantRow,
): Combatant => {
	const stats = toRecord(combatant.stats);
	const flags = toRecord(combatant.flags);

	return {
		id: combatant.id,
		name: combatant.name,
		initiative: combatant.initiative,
		hp: toNumber(stats.hp),
		maxHp: toNumber(stats.max_hp ?? stats.maxHp),
		ac: toNumber(stats.ac),
		conditions: toConditionArray(combatant.conditions),
		condition_timers: toConditionTimers(
			stats.condition_timers ?? stats.conditionTimers,
		),
		isHunter:
			typeof flags.isHunter === "boolean"
				? flags.isHunter
				: Boolean(combatant.member_id),
		damage_resistances: toStringArray(
			stats.damage_resistances ?? stats.damageResistances,
		),
		damage_immunities: toStringArray(
			stats.damage_immunities ?? stats.damageImmunities,
		),
		damage_vulnerabilities: toStringArray(
			stats.damage_vulnerabilities ?? stats.damageVulnerabilities,
		),
	};
};

const STORAGE_KEY = "solo-compendium.dm-tools.initiative.v1";

const CONDITION_OPTIONS = [
	"Blinded",
	"Charmed",
	"Deafened",
	"Exhaustion",
	"Frightened",
	"Grappled",
	"Incapacitated",
	"Invisible",
	"Paralyzed",
	"Petrified",
	"Poisoned",
	"Prone",
	"Restrained",
	"Stunned",
	"Unconscious",
];

const InitiativeTracker = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { toast } = useToast();
	const hydratedContextRef = useRef<string | null>(null);
	const hydratedCombatSessionRef = useRef<string | null>(null);
	const skipNextCombatSyncRef = useRef(false);
	const { data: myCampaigns = [], isLoading: myCampaignsLoading } =
		useMyCampaigns();
	const { data: joinedCampaigns = [], isLoading: joinedCampaignsLoading } =
		useJoinedCampaigns();
	const campaignId = searchParams.get("campaignId")?.trim() || null;
	const sendMessage = useSendCampaignMessage();
	const sessionId = searchParams.get("sessionId")?.trim() || null;
	const isCampaignScoped = !!campaignId;
	const persistenceContext = campaignId ? `campaign:${campaignId}` : "user";
	const [combatants, setCombatants] = useState<Combatant[]>([]);
	const [currentTurn, setCurrentTurn] = useState(0);
	const [round, setRound] = useState(1);
	const [pendingResolution, setPendingResolution] =
		useState<ActionResolutionPayload | null>(null);
	const [resolutionOutcome, setResolutionOutcome] =
		useState<ResolutionOutcome | null>(null);
	const [resolutionTargetId, setResolutionTargetId] = useState<string>("");
	const [resolutionConditionDuration, setResolutionConditionDuration] =
		useState<number>(1);
	const [manualConditionDuration, setManualConditionDuration] =
		useState<number>(0);
	const [newCombatant, setNewCombatant] = useState({
		name: "",
		initiative: 0,
		hp: 0,
		maxHp: 0,
		ac: 0,
		isHunter: true,
	});

	// DDB Parity Integration
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const playerTools = usePlayerToolsEnhancements();

	const manageableCampaigns = useMemo<CampaignWithRole[]>(() => {
		const byId = new Map<string, CampaignWithRole>();

		for (const campaign of myCampaigns) {
			byId.set(campaign.id, {
				id: campaign.id,
				name: campaign.name,
				access: "owner",
			});
		}

		for (const campaign of joinedCampaigns) {
			if (campaign.member_role !== "co-system") continue;
			if (!byId.has(campaign.id)) {
				byId.set(campaign.id, {
					id: campaign.id,
					name: campaign.name,
					access: "co-system",
				});
			}
		}

		return Array.from(byId.values()).sort((a, b) =>
			a.name.localeCompare(b.name),
		);
	}, [joinedCampaigns, myCampaigns]);

	useHydratedPreferredCampaignId({
		toolKey: "initiative_tracker",
		campaigns: manageableCampaigns,
		urlCampaignId: campaignId,
		isCampaignIdValid: (id) =>
			manageableCampaigns.some((campaign) => campaign.id === id),
		onResolveCampaignId: (id) => {
			const nextParams = new URLSearchParams(searchParams);
			nextParams.set("campaignId", id);
			nextParams.delete("sessionId");
			setSearchParams(nextParams, { replace: true });
		},
	});

	const campaignsLoading = myCampaignsLoading || joinedCampaignsLoading;
	const selectedCampaign = campaignId
		? (manageableCampaigns.find((campaign) => campaign.id === campaignId) ??
			null)
		: null;

	const { data: combatSessionData } = useCampaignCombatSession(
		campaignId || "",
		sessionId,
	);
	useCampaignCombatRealtime(campaignId, sessionId);
	const { data: campaignMembers = [] } = useCampaignMembers(campaignId || "");
	const updateCombatSession = useUpdateCombatSession();
	const upsertCombatants = useUpsertCombatants();
	const activeCombatSession = combatSessionData?.session ?? null;
	const activeCombatants = combatSessionData?.combatants ?? [];
	const combatSessionContext = activeCombatSession
		? `${campaignId}:${activeCombatSession.id}`
		: null;
	const isSyncingCombatSession =
		isCampaignScoped && !!activeCombatSession && !!sessionId;

	const handleCampaignChange = (nextCampaignId: string) => {
		const nextParams = new URLSearchParams(searchParams);
		nextParams.set("campaignId", nextCampaignId);
		nextParams.delete("sessionId");
		setSearchParams(nextParams, { replace: true });
	};

	const userToolState = useUserToolState<{
		combatants: Combatant[];
		currentTurn: number;
		round: number;
		version?: number;
		savedAt?: string;
	}>("initiative_tracker", {
		initialState: { combatants: [], currentTurn: 0, round: 1 },
		storageKey: STORAGE_KEY,
		enabled: !isCampaignScoped,
	});

	const campaignToolState = useCampaignToolState<{
		combatants: Combatant[];
		currentTurn: number;
		round: number;
		version?: number;
		savedAt?: string;
	}>(campaignId, "initiative_tracker", {
		initialState: { combatants: [], currentTurn: 0, round: 1 },
		storageKey: campaignId ? `${STORAGE_KEY}.${campaignId}` : STORAGE_KEY,
		enabled: isCampaignScoped,
	});

	const {
		state: storedState,
		isLoading,
		saveNow,
	} = isCampaignScoped ? campaignToolState : userToolState;

	const savePayload = useMemo(
		() => ({
			combatants,
			currentTurn,
			round,
		}),
		[combatants, currentTurn, round],
	);
	const debouncedState = useDebounce(savePayload, 600);

	useEffect(() => {
		if (
			!isSyncingCombatSession ||
			!activeCombatSession ||
			!combatSessionContext
		) {
			hydratedCombatSessionRef.current = null;
			return;
		}

		if (hydratedCombatSessionRef.current === combatSessionContext) {
			return;
		}

		setCombatants(activeCombatants.map(mapCampaignCombatantToTracker));
		setCurrentTurn(activeCombatSession.current_turn ?? 0);
		setRound(activeCombatSession.round ?? 1);
		hydratedCombatSessionRef.current = combatSessionContext;
		hydratedContextRef.current = null;
		skipNextCombatSyncRef.current = true;
	}, [
		activeCombatSession,
		activeCombatants,
		combatSessionContext,
		isSyncingCombatSession,
	]);

	// Load persisted state (best-effort)
	useEffect(() => {
		if (isSyncingCombatSession) return;
		if (isLoading || hydratedContextRef.current === persistenceContext) return;
		if (Array.isArray(storedState.combatants)) {
			setCombatants(storedState.combatants);
		}
		if (typeof storedState.currentTurn === "number") {
			setCurrentTurn(storedState.currentTurn);
		}
		if (typeof storedState.round === "number") {
			setRound(storedState.round);
		}
		hydratedContextRef.current = persistenceContext;
	}, [
		isLoading,
		isSyncingCombatSession,
		persistenceContext,
		storedState.combatants,
		storedState.currentTurn,
		storedState.round,
	]);

	// Persist state (best-effort)
	useEffect(() => {
		if (isSyncingCombatSession && activeCombatSession && campaignId) {
			if (skipNextCombatSyncRef.current) {
				skipNextCombatSyncRef.current = false;
				return;
			}

			upsertCombatants.mutate({
				campaignId,
				sessionId: activeCombatSession.id,
				combatants: debouncedState.combatants.map((combatant) => ({
					id: combatant.id,
					name: combatant.name,
					initiative: combatant.initiative,
					stats: {
						hp: combatant.hp ?? null,
						max_hp: combatant.maxHp ?? null,
						ac: combatant.ac ?? null,
						damage_resistances: combatant.damage_resistances ?? null,
						damage_immunities: combatant.damage_immunities ?? null,
						damage_vulnerabilities: combatant.damage_vulnerabilities ?? null,
						condition_timers: combatant.condition_timers ?? null,
					},
					conditions: combatant.conditions,
					flags: {
						isHunter: combatant.isHunter,
					},
					member_id: null,
				})),
			});

			updateCombatSession.mutate({
				campaignId,
				sessionId: activeCombatSession.id,
				updates: {
					current_turn: debouncedState.currentTurn,
					round: debouncedState.round,
				},
			});

			void saveNow({
				...debouncedState,
				version: 1,
				savedAt: new Date().toISOString(),
			});
			return;
		}

		if (hydratedContextRef.current !== persistenceContext) return;
		void saveNow({
			...debouncedState,
			version: 1,
			savedAt: new Date().toISOString(),
		});
	}, [
		activeCombatSession,
		campaignId,
		debouncedState,
		isSyncingCombatSession,
		persistenceContext,
		saveNow,
		updateCombatSession,
		upsertCombatants,
	]);

	const sortedCombatants = [...combatants].sort((a, b) => {
		if (b.initiative !== a.initiative) {
			return b.initiative - a.initiative;
		}
		// Tiebreaker: ascendants go first
		if (a.isHunter !== b.isHunter) {
			return a.isHunter ? -1 : 1;
		}
		return a.name.localeCompare(b.name);
	});

	const addCombatant = () => {
		if (!newCombatant.name) {
			toast({
				title: "Name required",
				description: "Please enter a combatant name.",
				variant: "destructive",
			});
			return;
		}

		setCombatants([
			...combatants,
			{
				id: `${Date.now()}-${Math.random()}`,
				name: newCombatant.name,
				initiative: newCombatant.initiative,
				hp: newCombatant.hp || undefined,
				maxHp: newCombatant.maxHp || undefined,
				ac: newCombatant.ac || undefined,
				conditions: [],
				isHunter: newCombatant.isHunter,
			},
		]);

		setNewCombatant({
			name: "",
			initiative: 0,
			hp: 0,
			maxHp: 0,
			ac: 0,
			isHunter: true,
		});

		toast({
			title: "Added to initiative",
			description: `${newCombatant.name} added to combat tracker.`,
		});
	};

	const removeCombatant = (id: string) => {
		setCombatants(combatants.filter((c) => c.id !== id));
		if (currentTurn >= combatants.length - 1) {
			setCurrentTurn(0);
		}

		if (isSyncingCombatSession) {
			void supabase
				.from("campaign_combatants")
				.delete()
				.eq("id", id)
				.then(({ error }) => {
					if (error) {
						toast({
							title: "Failed to remove combatant",
							description: error.message,
							variant: "destructive",
						});
					}
				});
		}
	};

	const updateHP = (id: string, hp: number) => {
		setCombatants(
			combatants.map((c) => {
				if (c.id !== id) return c;
				const maxHp =
					typeof c.maxHp === "number" && c.maxHp > 0 ? c.maxHp : undefined;
				const nextHp =
					maxHp !== undefined
						? Math.min(Math.max(0, hp), maxHp)
						: Math.max(0, hp);

				// DDB Parity: Broadcast explicit HP override
				playerTools
					.trackHealthChange(c.id || c.name, nextHp, "healing")
					.catch(console.error);

				return { ...c, hp: nextHp };
			}),
		);
	};

	const updateMaxHP = (id: string, maxHp: number) => {
		setCombatants(
			combatants.map((c) => {
				if (c.id !== id) return c;
				const nextMax = Math.max(0, maxHp);
				const nextHp =
					typeof c.hp === "number"
						? Math.min(Math.max(0, c.hp), nextMax > 0 ? nextMax : c.hp)
						: c.hp;
				return { ...c, maxHp: nextMax, hp: nextHp };
			}),
		);
	};

	const adjustHP = (id: string, delta: number) => {
		setCombatants(
			combatants.map((c) => {
				if (c.id !== id) return c;
				const base = typeof c.hp === "number" ? c.hp : 0;
				const maxHp =
					typeof c.maxHp === "number" && c.maxHp > 0 ? c.maxHp : undefined;
				const nextHp =
					maxHp !== undefined
						? Math.min(Math.max(0, base + delta), maxHp)
						: Math.max(0, base + delta);

				// DDB Parity: Broadcast HP change
				playerTools
					.trackHealthChange(
						c.id || c.name,
						Math.abs(delta),
						delta < 0 ? "damage" : "healing",
					)
					.catch(console.error);

				return { ...c, hp: nextHp };
			}),
		);
	};

	const addCondition = (
		id: string,
		condition: string,
		expiresAtRound?: number,
	) => {
		setCombatants((prev) =>
			prev.map((c) => {
				if (c.id !== id) return c;
				const nextConditions = c.conditions.includes(condition)
					? c.conditions
					: [...c.conditions, condition];
				const nextTimers = expiresAtRound
					? { ...(c.condition_timers ?? {}), [condition]: expiresAtRound }
					: c.condition_timers;

				// DDB Parity: Broadcast Condition Added
				if (!c.conditions.includes(condition)) {
					playerTools
						.trackConditionChange(c.id || c.name, condition, "add")
						.catch(console.error);
				}

				return {
					...c,
					conditions: nextConditions,
					condition_timers: nextTimers,
				};
			}),
		);
	};

	const removeCondition = (id: string, condition: string) => {
		setCombatants((prev) =>
			prev.map((c) => {
				if (c.id !== id) return c;
				const nextConditions = c.conditions.filter(
					(cond) => cond !== condition,
				);
				const nextTimers = c.condition_timers
					? { ...c.condition_timers }
					: undefined;
				if (nextTimers && condition in nextTimers) {
					delete nextTimers[condition];
				}

				// DDB Parity: Broadcast Condition Removed
				if (c.conditions.includes(condition)) {
					playerTools
						.trackConditionChange(c.id || c.name, condition, "remove")
						.catch(console.error);
				}

				return {
					...c,
					conditions: nextConditions,
					condition_timers:
						nextTimers && Object.keys(nextTimers).length > 0
							? nextTimers
							: undefined,
				};
			}),
		);
	};

	const cleanupExpiredConditions = (nextRound: number) => {
		const expiredAnnouncements: string[] = [];

		setCombatants((prev) => {
			const updated = prev.map((c) => {
				if (!c.condition_timers) return c;

				// Find conditions that are expiring this round
				const expiringThisRound = Object.entries(c.condition_timers)
					.filter(([, expiresAt]) => expiresAt <= nextRound)
					.map(([cond]) => cond);

				if (expiringThisRound.length > 0) {
					expiredAnnouncements.push(
						`**${c.name}** is no longer ${expiringThisRound.join(", ")}.`,
					);
					expiringThisRound.forEach((cond) => {
						playerTools
							.trackConditionChange(c.id || c.name, cond, "remove")
							.catch(console.error);
					});
				}

				const next = cleanupExpiredConditionsHelper(
					c.conditions,
					c.condition_timers,
					nextRound,
				);
				if (
					next.conditions === c.conditions &&
					next.timers === c.condition_timers
				)
					return c;
				return {
					...c,
					conditions: next.conditions,
					condition_timers: next.timers,
				};
			});

			if (expiredAnnouncements.length > 0 && campaignId) {
				sendMessage
					.mutateAsync({
						campaignId,
						messageType: "system",
						content: expiredAnnouncements.join("\n"),
					})
					.catch(console.error);
			}

			return updated;
		});
	};

	const nextTurn = () => {
		if (sortedCombatants.length === 0) return;
		setCurrentTurn((prev) => {
			const next = (prev + 1) % sortedCombatants.length;
			if (next === 0) {
				const nextRound = round + 1;
				setRound(nextRound);
				cleanupExpiredConditions(nextRound);
			}

			// DDB Parity: Broadcast turn change
			const activeCombatant = sortedCombatants[next];
			if (activeCombatant) {
				playerTools
					.trackCustomFeatureUsage(
						activeCombatant.id || activeCombatant.name,
						"Turn Start",
						"start",
						"5e",
					)
					.catch(console.error);
			}

			return next;
		});
	};

	const previousTurn = () => {
		if (sortedCombatants.length === 0) return;
		setCurrentTurn((prev) => {
			if (prev === 0) {
				setRound(Math.max(1, round - 1));
				return sortedCombatants.length - 1;
			}
			return prev - 1;
		});
	};

	const resetCombat = () => {
		setCombatants([]);
		setCurrentTurn(0);
		setRound(1);

		if (isSyncingCombatSession && activeCombatSession) {
			void supabase
				.from("campaign_combatants")
				.delete()
				.eq("session_id", activeCombatSession.id);
			updateCombatSession.mutate({
				campaignId,
				sessionId: activeCombatSession.id,
				updates: {
					current_turn: 0,
					round: 1,
				},
			});
		}

		toast({
			title: "Combat reset",
			description: "All combatants cleared from the tracker.",
		});
	};

	const currentCombatant = sortedCombatants[currentTurn];

	useEffect(() => {
		const pending = getPendingResolution();
		setPendingResolution(pending);
		if (!pending) return;
		if (sortedCombatants.length > 0 && !resolutionTargetId) {
			setResolutionTargetId(sortedCombatants[0].id);
		}
	}, [resolutionTargetId, sortedCombatants]);

	const clearResolution = () => {
		clearPendingResolution();
		setPendingResolution(null);
		setResolutionOutcome(null);
	};

	const applyResolutionToTarget = () => {
		const pending = getPendingResolution();
		if (!pending) return;
		const target = combatants.find((c) => c.id === resolutionTargetId);
		const targetAC = target?.ac ?? 10;

		if (!target) return;

		const inferAttackRollMode = (targetConditions: string[]) => {
			const normalized = targetConditions.map((c) => c.toLowerCase());
			const grantsAdvantage = normalized.some((c) =>
				[
					"blinded",
					"restrained",
					"paralyzed",
					"unconscious",
					"stunned",
					"prone",
				].includes(c),
			);
			const grantsDisadvantage = normalized.some((c) =>
				["invisible"].includes(c),
			);
			if (grantsAdvantage && !grantsDisadvantage) return "advantage" as const;
			if (grantsDisadvantage && !grantsAdvantage)
				return "disadvantage" as const;
			return "normal" as const;
		};

		const inferSaveRollMode = (
			targetConditions: string[],
			ability: string | undefined,
		) => {
			if (!ability) return "normal" as const;
			const normalized = targetConditions.map((c) => c.toLowerCase());
			const ab = ability.toLowerCase();
			const hasDisadv =
				normalized.some((c) => c === "restrained") &&
				(ab === "agi" ||
					ab === "agility" ||
					ab === "dex" ||
					ab === "dexterity");
			return hasDisadv ? ("disadvantage" as const) : ("normal" as const);
		};

		const attackRollMode = inferAttackRollMode(target.conditions);
		const saveRollMode =
			pending.kind === "save"
				? inferSaveRollMode(target.conditions, pending.save?.ability)
				: "normal";

		const pendingWithMode =
			pending.kind === "attack" && pending.attack
				? {
						...pending,
						attack: {
							...pending.attack,
							rollMode: attackRollMode,
						},
					}
				: pending.kind === "save" && pending.save
					? {
							...pending,
							save: {
								...pending.save,
								rollMode: saveRollMode,
							},
						}
					: pending;

		let outcome =
			pendingWithMode.kind === "attack"
				? resolveAttack(pendingWithMode, targetAC)
				: pendingWithMode.kind === "save"
					? resolveSave(pendingWithMode)
					: pending.kind === "healing"
						? resolveHealing(pending)
						: resolveDamage(pending);

		if (outcome.kind === "save" && pending.save?.ability) {
			const ability = pending.save.ability.toLowerCase();
			const normalized = target.conditions.map((c) => c.toLowerCase());
			const autoFail =
				(ability === "agi" || ability === "dex" || ability === "str") &&
				normalized.some((c) => c === "paralyzed" || c === "unconscious");
			if (autoFail) {
				outcome = {
					...outcome,
					success: false,
				};
			}
		}

		setPendingResolution(pending);
		setResolutionOutcome(outcome);

		const pendingDamageType = pending.damage?.type;

		if (outcome.kind === "attack") {
			if (outcome.hit && typeof outcome.damageTotal === "number") {
				const mitigated = applyDamageMitigation(
					outcome.damageTotal,
					pendingDamageType,
					target,
				);
				adjustHP(target.id, -mitigated);
			}
		}

		if (outcome.kind === "save") {
			if (!outcome.success && typeof outcome.damageTotal === "number") {
				const mitigated = applyDamageMitigation(
					outcome.damageTotal,
					pendingDamageType,
					target,
				);
				adjustHP(target.id, -mitigated);
			}
		}

		if (outcome.kind === "healing") {
			adjustHP(target.id, outcome.healingTotal);
		}

		if (outcome.kind === "damage") {
			const mitigated = applyDamageMitigation(
				outcome.damageTotal,
				pendingDamageType,
				target,
			);
			adjustHP(target.id, -mitigated);
		}

		if (
			Array.isArray(pending.appliesConditions) &&
			pending.appliesConditions.length > 0
		) {
			const durationRounds =
				Number.isFinite(resolutionConditionDuration) &&
				resolutionConditionDuration > 0
					? Math.floor(resolutionConditionDuration)
					: 0;
			const expiresAt = durationRounds > 0 ? round + durationRounds : undefined;
			for (const condition of pending.appliesConditions) {
				addCondition(target.id, condition, expiresAt);
			}
		}
	};

	return (
		<Layout>
			<div
				className="container mx-auto px-4 py-8"
				data-testid="initiative-tracker"
			>
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/dm-tools")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to System Tools
					</Button>
					<h1 className="font-display text-4xl font-bold mb-2 gradient-text-shadow">
						RIFT COMBAT TRACKER
					</h1>
					<p className="text-muted-foreground font-heading">
						Track initiative, HP, and conditions during Rift combat encounters.
					</p>
				</div>

				{!campaignsLoading && manageableCampaigns.length > 0 && (
					<SystemWindow title="ACTIVE CAMPAIGN" className="mb-6">
						<div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3 items-end">
							<div className="space-y-2">
								<Label htmlFor="initiative-campaign">Campaign</Label>
								<Select
									value={campaignId ?? ""}
									onValueChange={handleCampaignChange}
								>
									<SelectTrigger id="initiative-campaign">
										<SelectValue placeholder="Select campaign" />
									</SelectTrigger>
									<SelectContent>
										{manageableCampaigns.map((campaign) => (
											<SelectItem key={campaign.id} value={campaign.id}>
												{campaign.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							{selectedCampaign && (
								<div className="flex flex-wrap items-center gap-2">
									<Badge
										variant={
											selectedCampaign.access === "owner"
												? "default"
												: "outline"
										}
									>
										{selectedCampaign.access === "owner"
											? "Owner"
											: "Co-System"}
									</Badge>
									<Button variant="outline" asChild>
										<Link to={`/campaigns/${selectedCampaign.id}`}>
											Open Campaign
											<ExternalLink className="w-4 h-4 ml-2" />
										</Link>
									</Button>
								</div>
							)}
						</div>
					</SystemWindow>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Initiative Order */}
					<div className="lg:col-span-2 space-y-4">
						<SystemWindow title="INITIATIVE ORDER">
							{pendingResolution && (
								<div className="mb-4 rounded border border-border/60 bg-muted/20 p-3">
									<div className="text-xs font-display text-muted-foreground">
										PENDING RESOLUTION
									</div>
									<div className="font-heading font-semibold">
										{pendingResolution.name}
									</div>
									<div className="mt-2 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-2 items-end">
										<div className="space-y-1">
											<Label htmlFor="resolution-target">Target</Label>
											<Select
												value={resolutionTargetId}
												onValueChange={setResolutionTargetId}
											>
												<SelectTrigger id="resolution-target">
													<SelectValue placeholder="Select target" />
												</SelectTrigger>
												<SelectContent>
													{sortedCombatants.map((combatant) => (
														<SelectItem key={combatant.id} value={combatant.id}>
															{combatant.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										{Array.isArray(pendingResolution.appliesConditions) &&
											pendingResolution.appliesConditions.length > 0 && (
												<div className="space-y-1">
													<Label htmlFor="resolution-duration">
														Condition duration (rounds)
													</Label>
													<Input
														id="resolution-duration"
														type="number"
														min={0}
														value={resolutionConditionDuration}
														onChange={(e) =>
															setResolutionConditionDuration(
																parseInt(e.target.value) || 0,
															)
														}
													/>
												</div>
											)}
										<div className="flex flex-wrap gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={applyResolutionToTarget}
											>
												Resolve
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={clearResolution}
											>
												Clear
											</Button>
										</div>
									</div>
									{resolutionOutcome && (
										<div className="mt-2 text-sm text-muted-foreground">
											{resolutionOutcome.kind === "attack" && (
												<div>
													Attack {resolutionOutcome.attackTotal} vs AC{" "}
													{resolutionOutcome.targetAC} (
													{resolutionOutcome.hit ? "Hit" : "Miss"})
													{resolutionOutcome.hit &&
														resolutionOutcome.damageTotal !== undefined &&
														` | Damage ${resolutionOutcome.damageTotal}`}
												</div>
											)}
											{resolutionOutcome.kind === "save" && (
												<div>
													Save {resolutionOutcome.saveTotal} vs DC{" "}
													{resolutionOutcome.dc} (
													{resolutionOutcome.success ? "Success" : "Failure"})
													{resolutionOutcome.damageTotal !== undefined &&
														` | Damage ${resolutionOutcome.damageTotal}`}
												</div>
											)}
											{resolutionOutcome.kind === "healing" && (
												<div>Healing {resolutionOutcome.healingTotal}</div>
											)}
											{resolutionOutcome.kind === "damage" && (
												<div>Damage {resolutionOutcome.damageTotal}</div>
											)}
										</div>
									)}
								</div>
							)}
							<div className="mb-4 flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div>
										<span className="text-xs font-display text-muted-foreground">
											ROUND
										</span>
										<div className="font-display text-2xl font-bold">
											{round}
										</div>
									</div>
									{currentCombatant && (
										<div>
											<span className="text-xs font-display text-muted-foreground">
												CURRENT TURN
											</span>
											<div className="font-heading text-lg font-semibold">
												{currentCombatant.name}
											</div>
										</div>
									)}
								</div>
								<div className="flex items-center gap-2">
									<Button
										size="sm"
										variant="outline"
										onClick={previousTurn}
										disabled={sortedCombatants.length === 0}
										aria-label="Previous turn"
										data-testid="initiative-prev-turn"
									>
										<ArrowUp className="w-4 h-4" />
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={nextTurn}
										disabled={sortedCombatants.length === 0}
										aria-label="Next turn"
										data-testid="initiative-next-turn"
									>
										<ArrowDown className="w-4 h-4" />
									</Button>
									<Button
										size="sm"
										variant="destructive"
										onClick={resetCombat}
										data-testid="initiative-reset"
									>
										<RotateCcw className="w-4 h-4 mr-2" />
										Reset
									</Button>
								</div>
							</div>

							{sortedCombatants.length === 0 ? (
								<div className="text-center py-8 text-muted-foreground">
									<p>No combatants yet</p>
									<p className="text-xs mt-1">
										Add combatants to start tracking
									</p>
								</div>
							) : (
								<div className="space-y-2">
									{sortedCombatants.map((combatant, index) => (
										<div
											key={combatant.id}
											className={cn(
												"p-3 rounded border transition-all",
												index === currentTurn
													? "border-primary bg-primary/10 shadow-lg"
													: "bg-muted/30 border-border",
											)}
											data-combatant-card
											data-combatant-name={combatant.name}
										>
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-3">
													<div
														className={cn(
															"w-8 h-8 rounded-full flex items-center justify-center font-display text-sm",
															index === currentTurn
																? "bg-primary text-primary-foreground"
																: "bg-muted text-muted-foreground",
														)}
													>
														{index + 1}
													</div>
													<div>
														<div className="font-heading font-semibold flex items-center gap-2">
															{combatant.name}
															{combatant.isHunter ? (
																<Badge variant="secondary" className="text-xs">
																	Ascendant
																</Badge>
															) : (
																<Badge variant="outline" className="text-xs">
																	Monster
																</Badge>
															)}
														</div>
														<div className="text-xs text-muted-foreground">
															Initiative: {combatant.initiative}
															{combatant.ac !== undefined &&
																` | AC: ${combatant.ac}`}
															{combatant.hp !== undefined &&
																combatant.maxHp !== undefined &&
																` | HP: ${combatant.hp}/${combatant.maxHp}`}
														</div>
													</div>
												</div>
												<Button
													size="icon"
													variant="ghost"
													className="h-6 w-6"
													onClick={() => removeCombatant(combatant.id)}
													aria-label={`Remove ${combatant.name} from initiative`}
												>
													<Trash2 className="w-3 h-3" />
												</Button>
											</div>
											<div className="grid grid-cols-2 gap-2">
												<div>
													<Label
														htmlFor={`combatant-${combatant.id}-hp`}
														className="text-xs text-muted-foreground"
													>
														HP
													</Label>
													<Input
														id={`combatant-${combatant.id}-hp`}
														type="number"
														min={0}
														value={combatant.hp ?? 0}
														onChange={(e) =>
															updateHP(
																combatant.id,
																parseInt(e.target.value) || 0,
															)
														}
														aria-label={`HP for ${combatant.name}`}
													/>
												</div>
												<div>
													<Label
														htmlFor={`combatant-${combatant.id}-max-hp`}
														className="text-xs text-muted-foreground"
													>
														Max HP
													</Label>
													<Input
														id={`combatant-${combatant.id}-max-hp`}
														type="number"
														min={0}
														value={combatant.maxHp ?? 0}
														onChange={(e) =>
															updateMaxHP(
																combatant.id,
																parseInt(e.target.value) || 0,
															)
														}
														aria-label={`Max HP for ${combatant.name}`}
													/>
												</div>
											</div>
											<div className="flex flex-wrap gap-2 mt-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => adjustHP(combatant.id, -1)}
													aria-label={`Damage ${combatant.name} by 1`}
												>
													-1
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => adjustHP(combatant.id, -5)}
													aria-label={`Damage ${combatant.name} by 5`}
												>
													-5
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => adjustHP(combatant.id, 5)}
													aria-label={`Heal ${combatant.name} by 5`}
												>
													+5
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => adjustHP(combatant.id, 1)}
													aria-label={`Heal ${combatant.name} by 1`}
												>
													+1
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														updateHP(
															combatant.id,
															combatant.maxHp ?? combatant.hp ?? 0,
														)
													}
													disabled={
														!(
															typeof combatant.maxHp === "number" &&
															combatant.maxHp > 0
														)
													}
													aria-label={`Set ${combatant.name} to full HP`}
												>
													Full
												</Button>
											</div>
											{combatant.conditions.length > 0 && (
												<div className="flex flex-wrap gap-1 mt-2">
													{combatant.conditions.map((condition) => (
														<Badge
															key={condition}
															variant="destructive"
															className="text-xs cursor-pointer"
															onClick={() =>
																removeCondition(combatant.id, condition)
															}
															title={
																combatant.condition_timers?.[condition] !==
																undefined
																	? `Expires at round ${combatant.condition_timers[condition]}`
																	: undefined
															}
														>
															{condition}
															{combatant.condition_timers?.[condition] !==
																undefined && (
																<span className="ml-1 opacity-80">
																	(R{combatant.condition_timers[condition]})
																</span>
															)}
															<span className="ml-1">x</span>
														</Badge>
													))}
												</div>
											)}
											<div className="mt-2">
												<div className="text-xs text-muted-foreground mb-1">
													Add Condition
												</div>
												<div className="mb-2">
													<Label
														htmlFor={`combatant-${combatant.id}-condition-duration`}
														className="text-xs text-muted-foreground"
													>
														Duration (rounds)
													</Label>
													<Input
														id={`combatant-${combatant.id}-condition-duration`}
														type="number"
														min={0}
														value={manualConditionDuration}
														onChange={(e) =>
															setManualConditionDuration(
																parseInt(e.target.value) || 0,
															)
														}
														aria-label={`Condition duration in rounds for ${combatant.name}`}
													/>
												</div>
												<div className="flex flex-wrap gap-1">
													{CONDITION_OPTIONS.filter(
														(condition) =>
															!combatant.conditions.includes(condition),
													).map((condition) => (
														<Badge
															key={condition}
															variant="outline"
															className="text-xs cursor-pointer"
															onClick={() => {
																const durationRounds =
																	Number.isFinite(manualConditionDuration) &&
																	manualConditionDuration > 0
																		? Math.floor(manualConditionDuration)
																		: 0;
																const expiresAt =
																	durationRounds > 0
																		? round + durationRounds
																		: undefined;
																addCondition(
																	combatant.id,
																	condition,
																	expiresAt,
																);
															}}
															aria-label={`Add ${condition} to ${combatant.name}`}
														>
															+ {condition}
														</Badge>
													))}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</SystemWindow>
					</div>
					{/* Add Combatant */}
					<div className="lg:col-span-1 space-y-4">
						<SystemWindow title="ADD COMBATANT">
							<div className="space-y-3">
								<div>
									<Label
										htmlFor="combatant-name"
										className="text-xs font-display text-muted-foreground mb-1 block"
									>
										NAME
									</Label>
									<Input
										id="combatant-name"
										value={newCombatant.name || ""}
										onChange={(e) =>
											setNewCombatant({ ...newCombatant, name: e.target.value })
										}
										placeholder="Ascendant or Rift creature name"
										className="font-display"
									/>
								</div>
								<div>
									<Label
										htmlFor="combatant-initiative"
										className="text-xs font-display text-muted-foreground mb-1 block"
									>
										INITIATIVE
									</Label>
									<Input
										id="combatant-initiative"
										type="number"
										value={newCombatant.initiative ?? 0}
										onChange={(e) =>
											setNewCombatant({
												...newCombatant,
												initiative: parseInt(e.target.value) || 0,
											})
										}
										className="font-display"
									/>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<div>
										<Label
											htmlFor="combatant-hp"
											className="text-xs font-display text-muted-foreground mb-1 block"
										>
											HP
										</Label>
										<Input
											id="combatant-hp"
											type="number"
											value={newCombatant.hp ?? 0}
											onChange={(e) =>
												setNewCombatant({
													...newCombatant,
													hp: parseInt(e.target.value) || 0,
												})
											}
											className="font-display"
										/>
									</div>
									<div>
										<Label
											htmlFor="combatant-max-hp"
											className="text-xs font-display text-muted-foreground mb-1 block"
										>
											MAX HP
										</Label>
										<Input
											id="combatant-max-hp"
											type="number"
											value={newCombatant.maxHp ?? 0}
											onChange={(e) =>
												setNewCombatant({
													...newCombatant,
													maxHp: parseInt(e.target.value) || 0,
												})
											}
											className="font-display"
										/>
									</div>
								</div>
								<div>
									<Label
										htmlFor="combatant-ac"
										className="text-xs font-display text-muted-foreground mb-1 block"
									>
										AC
									</Label>
									<Input
										id="combatant-ac"
										type="number"
										value={newCombatant.ac ?? 0}
										onChange={(e) =>
											setNewCombatant({
												...newCombatant,
												ac: parseInt(e.target.value) || 0,
											})
										}
										className="font-display"
									/>
								</div>
								<Button
									onClick={addCombatant}
									className="w-full"
									disabled={!newCombatant.name}
									data-testid="initiative-add-combatant"
								>
									<Plus className="w-4 h-4 mr-2" />
									Add to Initiative
								</Button>
							</div>
						</SystemWindow>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default InitiativeTracker;
