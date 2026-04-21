/**
 * VTT Initiative Panel — compact initiative tracker for VTT sidebar
 *
 * Reuses the campaign combat hooks for real-time persistence and sync.
 * Designed to fit in the left sidebar's AscendantWindow pattern.
 *
 * Polish: keyboard shortcuts (N = next turn), HP delta input,
 * smooth active-row highlight, combatant count badge.
 */

import {
	ChevronDown,
	ChevronUp,
	Minus,
	Plus,
	RotateCcw,
	SkipForward,
	Swords,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	type Combatant as CombatantRow,
	useCampaignCombatSession,
	useUpdateCombatSession,
	useUpsertCombatants,
} from "@/hooks/useCampaignCombat";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import type { Json } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────

/** Condition with optional duration tracking (Roll20 parity) */
interface ConditionWithDuration {
	name: string;
	duration?: number; // rounds remaining; undefined = indefinite
}

/** Normalize conditions from storage — supports both legacy string[] and new object[] */
function normalizeConditions(raw: unknown): ConditionWithDuration[] {
	if (!Array.isArray(raw)) return [];
	return raw.map((c) => {
		if (typeof c === "string") return { name: c };
		if (c && typeof c === "object" && "name" in c) {
			return {
				name: String((c as Record<string, unknown>).name),
				duration:
					typeof (c as Record<string, unknown>).duration === "number"
						? ((c as Record<string, unknown>).duration as number)
						: undefined,
			};
		}
		return { name: String(c) };
	});
}

interface TrackerEntry {
	id: string;
	name: string;
	initiative: number;
	hp?: number;
	maxHp?: number;
	ac?: number;
	conditions: ConditionWithDuration[];
	isHunter: boolean;
	characterId?: string;
}

interface VTTInitiativePanelProps {
	campaignId: string;
	sessionId?: string | null;
	isWarden: boolean;
	/** Callback to highlight a token when a combatant is selected */
	onHighlightToken?: (characterId: string) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────

function rowToEntry(row: CombatantRow): TrackerEntry {
	const stats = (row.stats ?? {}) as Record<string, unknown>;
	const conds = row.conditions;
	return {
		id: row.id,
		name: row.name,
		initiative: row.initiative,
		hp: typeof stats.hp === "number" ? stats.hp : undefined,
		maxHp: typeof stats.maxHp === "number" ? stats.maxHp : undefined,
		ac: typeof stats.ac === "number" ? stats.ac : undefined,
		conditions: normalizeConditions(conds),
		isHunter: Boolean((row.flags as Record<string, unknown>)?.isHunter),
		characterId: row.member_id ?? undefined,
	};
}

const CONDITION_OPTIONS = [
	"Blinded",
	"Charmed",
	"Deafened",
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

// ── Component ──────────────────────────────────────────────────────────

export function VTTInitiativePanel({
	campaignId,
	sessionId,
	isWarden,
	onHighlightToken,
}: VTTInitiativePanelProps) {
	const { data } = useCampaignCombatSession(campaignId, sessionId);
	const updateSession = useUpdateCombatSession();
	const upsertCombatants = useUpsertCombatants();
	const ascendantTools = useAscendantTools();

	const session = data?.session;
	const combatants = (data?.combatants ?? []).map(rowToEntry);
	const sorted = [...combatants].sort((a, b) => b.initiative - a.initiative);
	const currentTurn = session?.current_turn ?? 0;
	const round = session?.round ?? 1;

	// Local state for quick-add form
	const [newName, setNewName] = useState("");
	const [newInit, setNewInit] = useState("");
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [hpDelta, setHpDelta] = useState<Record<string, string>>({});
	const listRef = useRef<HTMLDivElement>(null);

	// Auto-scroll active combatant into view when the turn advances.
	useEffect(() => {
		const list = listRef.current;
		if (!list || currentTurn < 0) return;
		const active = list.querySelectorAll<HTMLElement>("[data-combatant-row]")[
			currentTurn
		];
		active?.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}, [currentTurn]);

	// Keyboard shortcut hook is declared below nextTurn so the callback
	// reference is assigned before the effect reads it.

	// ── Actions ────────────────────────────────────────────────────────

	const activeSessionId = sessionId ?? session?.id;

	const addCombatant = useCallback(() => {
		if (!newName.trim() || !activeSessionId) return;
		const entry = {
			id: `c-${Date.now()}`,
			name: newName.trim(),
			initiative: Number(newInit) || 0,
			stats: { hp: 10, maxHp: 10, ac: 10 },
			conditions: [],
			flags: { isHunter: false },
		};
		upsertCombatants.mutate({
			campaignId,
			sessionId: activeSessionId,
			combatants: [entry],
		});
		setNewName("");
		setNewInit("");
	}, [campaignId, activeSessionId, newName, newInit, upsertCombatants]);

	const nextTurn = useCallback(() => {
		if (!activeSessionId) return;
		const nextIdx = (currentTurn + 1) % Math.max(sorted.length, 1);
		const nextRound = nextIdx === 0 ? round + 1 : round;

		// Auto-decrement condition durations when a new round starts (Roll20 parity)
		if (nextIdx === 0 && sorted.length > 0) {
			const updatedCombatants = sorted
				.filter((entry) =>
					entry.conditions.some(
						(c) => c.duration !== undefined && c.duration > 0,
					),
				)
				.map((entry) => {
					const nextConds = entry.conditions
						.map((c) => {
							if (c.duration === undefined) return c;
							return { ...c, duration: c.duration - 1 };
						})
						.filter((c) => c.duration === undefined || c.duration > 0);
					return {
						id: entry.id,
						name: entry.name,
						initiative: entry.initiative,
						stats: { hp: entry.hp, maxHp: entry.maxHp, ac: entry.ac },
						conditions: nextConds as unknown as Json,
						flags: { isHunter: entry.isHunter },
					};
				});
			if (updatedCombatants.length > 0) {
				upsertCombatants.mutate({
					campaignId,
					sessionId: activeSessionId,
					combatants: updatedCombatants,
				});
			}
		}

		updateSession.mutate({
			campaignId,
			sessionId: activeSessionId,
			updates: { current_turn: nextIdx, round: nextRound },
		});

		const nextCombatant = sorted[nextIdx];
		if (nextCombatant?.characterId) {
			ascendantTools
				?.trackCustomFeatureUsage(
					nextCombatant.characterId,
					"Turn Start",
					`Initiative Roll: ${nextCombatant.initiative}`,
					"SA",
				)
				.catch(console.error);
		}
	}, [
		campaignId,
		activeSessionId,
		currentTurn,
		round,
		sorted,
		updateSession,
		ascendantTools,
		upsertCombatants,
	]);

	const resetCombat = useCallback(() => {
		if (!activeSessionId) return;
		updateSession.mutate({
			campaignId,
			sessionId: activeSessionId,
			updates: { current_turn: 0, round: 1 },
		});
	}, [campaignId, activeSessionId, updateSession]);

	// Keyboard shortcut: N = next turn (when panel list is focused).
	// Declared here (below nextTurn) so the callback is already in TDZ-safe scope.
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			)
				return;
			if (e.key === "n" || e.key === "N") nextTurn();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [nextTurn]);

	const adjustHP = useCallback(
		(entry: TrackerEntry, delta: number) => {
			if (!activeSessionId) return;
			const newHp = Math.max(
				0,
				Math.min((entry.hp ?? 0) + delta, entry.maxHp ?? 999),
			);
			upsertCombatants.mutate({
				campaignId,
				sessionId: activeSessionId,
				combatants: [
					{
						id: entry.id,
						name: entry.name,
						initiative: entry.initiative,
						stats: { hp: newHp, maxHp: entry.maxHp, ac: entry.ac },
						conditions: entry.conditions as unknown as Json,
						flags: { isHunter: entry.isHunter },
					},
				],
			});
		},
		[campaignId, activeSessionId, upsertCombatants],
	);

	const toggleCondition = useCallback(
		(entry: TrackerEntry, condition: string, duration?: number) => {
			if (!activeSessionId) return;
			const hasCondition = entry.conditions.some((c) => c.name === condition);
			const nextConds = hasCondition
				? entry.conditions.filter((c) => c.name !== condition)
				: [...entry.conditions, { name: condition, duration }];
			upsertCombatants.mutate({
				campaignId,
				sessionId: activeSessionId,
				combatants: [
					{
						id: entry.id,
						name: entry.name,
						initiative: entry.initiative,
						stats: { hp: entry.hp, maxHp: entry.maxHp, ac: entry.ac },
						conditions: nextConds as unknown as Json,
						flags: { isHunter: entry.isHunter },
					},
				],
			});
		},
		[campaignId, activeSessionId, upsertCombatants],
	);

	// ── Render ─────────────────────────────────────────────────────────

	return (
		<div className="space-y-2">
			{/* Round indicator + controls */}
			<div className="flex items-center justify-between">
				<span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
					<Swords className="h-3.5 w-3.5" aria-hidden="true" />
					Round {round}
				</span>
				<div className="flex gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={nextTurn}
						title="Next turn"
					>
						<SkipForward className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={resetCombat}
						title="Reset combat"
					>
						<RotateCcw className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Combatant list */}
			<div className="space-y-1 max-h-64 overflow-y-auto">
				{sorted.map((entry, idx) => {
					const isActive = idx === currentTurn;
					const hpPct = entry.maxHp
						? Math.round(((entry.hp ?? 0) / entry.maxHp) * 100)
						: null;
					const isExpanded = expandedId === entry.id;

					return (
						<div
							key={entry.id}
							data-combatant-row={entry.id}
							className={cn(
								"rounded border p-1.5 text-xs transition-all",
								isActive
									? "bg-primary/20 border-primary shadow-sm"
									: "border-border hover:bg-muted/40",
							)}
						>
							{/* Main row */}
							<button
								type="button"
								className="flex items-center gap-1.5 w-full text-left outline-none cursor-pointer focus-visible:ring-1 focus-visible:ring-primary rounded"
								onClick={() => {
									setExpandedId(isExpanded ? null : entry.id);
									if (entry.characterId && onHighlightToken) {
										onHighlightToken(entry.characterId);
									}
								}}
							>
								<span className="w-5 text-center font-mono text-foreground/70">
									{entry.initiative}
								</span>
								<span
									className={cn(
										"flex-1 truncate font-medium",
										isActive && "text-primary",
									)}
								>
									{entry.name}
								</span>
								{hpPct !== null && (
									<span
										className={cn(
											"text-[10px] font-mono",
											hpPct > 50
												? "text-emerald-400"
												: hpPct > 25
													? "text-amber-400"
													: "text-red-400",
										)}
									>
										{entry.hp}/{entry.maxHp}
									</span>
								)}
								{entry.ac != null && (
									<span className="text-[10px] text-foreground/70">
										AC{entry.ac}
									</span>
								)}
								{isExpanded ? (
									<ChevronUp className="h-3 w-3 text-foreground/70 shrink-0" />
								) : (
									<ChevronDown className="h-3 w-3 text-foreground/70 shrink-0" />
								)}
							</button>

							{/* Conditions row */}
							{entry.conditions.length > 0 && (
								<div className="flex flex-wrap gap-0.5 mt-1 ml-6">
									{entry.conditions.map((c) => (
										<span
											key={c.name}
											className="text-[9px] bg-destructive/20 text-destructive-foreground px-1 rounded inline-flex items-center gap-0.5"
										>
											{c.name}
											{c.duration !== undefined && (
												<span className="text-[8px] font-mono bg-destructive/30 px-0.5 rounded">
													{c.duration}r
												</span>
											)}
										</span>
									))}
								</div>
							)}

							{isExpanded && isWarden && (
								<div className="mt-2 pt-2 border-t border-border/50 space-y-2">
									{/* HP adjustment */}
									<div className="flex items-center gap-1">
										<span className="text-[10px] text-foreground/70 w-6">
											HP
										</span>
										<Button
											variant="outline"
											size="icon"
											className="h-7 w-7"
											onClick={() => adjustHP(entry, -1)}
											aria-label="Decrease HP by 1"
										>
											<Minus className="h-3 w-3" />
										</Button>
										<span className="text-xs font-mono w-10 text-center">
											{entry.hp ?? "?"}
										</span>
										<Button
											variant="outline"
											size="icon"
											className="h-7 w-7"
											onClick={() => adjustHP(entry, 1)}
											aria-label="Increase HP by 1"
										>
											<Plus className="h-3 w-3" />
										</Button>
										<Input
											type="number"
											placeholder="±n"
											aria-label="Apply custom HP delta"
											className="h-7 w-16 text-[10px]"
											value={hpDelta[entry.id] ?? ""}
											onChange={(e) =>
												setHpDelta((prev) => ({
													...prev,
													[entry.id]: e.target.value,
												}))
											}
											onKeyDown={(e) => {
												if (e.key !== "Enter") return;
												const raw = hpDelta[entry.id];
												const parsed = raw ? parseInt(raw, 10) : 0;
												if (Number.isFinite(parsed) && parsed !== 0) {
													adjustHP(entry, parsed);
												}
												setHpDelta((prev) => ({
													...prev,
													[entry.id]: "",
												}));
											}}
										/>
									</div>

									{/* Quick conditions */}
									<div className="flex flex-wrap gap-0.5">
										{CONDITION_OPTIONS.slice(0, 8).map((c: string) => (
											<button
												type="button"
												key={c}
												onClick={() => toggleCondition(entry, c)}
												className={cn(
													"text-[9px] px-1 py-0.5 rounded border transition-colors",
													entry.conditions.some((ec) => ec.name === c)
														? "bg-destructive/30 border-destructive/50 text-destructive-foreground"
														: "border-border/50 text-foreground/70 hover:bg-muted/30",
												)}
											>
												{c}
											</button>
										))}
									</div>
									{/* Duration-based condition (custom tracker entry) */}
									<div className="flex items-center gap-1 mt-1">
										<Input
											placeholder="Effect name"
											className="h-6 text-[10px] flex-1"
											id={`cond-name-${entry.id}`}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													const nameInput = e.currentTarget;
													const durInput = document.getElementById(
														`cond-dur-${entry.id}`,
													) as HTMLInputElement | null;
													if (nameInput.value.trim()) {
														const dur = durInput?.value
															? parseInt(durInput.value, 10)
															: undefined;
														toggleCondition(
															entry,
															nameInput.value.trim(),
															dur && dur > 0 ? dur : undefined,
														);
														nameInput.value = "";
														if (durInput) durInput.value = "";
													}
												}
											}}
										/>
										<Input
											placeholder="Rds"
											type="number"
											className="h-6 text-[10px] w-10"
											id={`cond-dur-${entry.id}`}
											title="Duration in rounds (leave empty for indefinite)"
										/>
									</div>
								</div>
							)}
						</div>
					);
				})}

				{sorted.length === 0 && (
					<p className="text-[10px] text-foreground/70 text-center py-2">
						No combatants. Add one below.
					</p>
				)}
			</div>

			{/* Quick-add form (Warden only) */}
			{isWarden && (
				<div className="flex gap-1">
					<Input
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						placeholder="Name"
						className="h-7 text-xs flex-1"
						onKeyDown={(e) => e.key === "Enter" && addCombatant()}
					/>
					<Input
						value={newInit}
						onChange={(e) => setNewInit(e.target.value)}
						placeholder="Init"
						type="number"
						className="h-7 text-xs w-12"
						onKeyDown={(e) => e.key === "Enter" && addCombatant()}
					/>
					<Button
						variant="outline"
						size="icon"
						className="h-7 w-7"
						onClick={addCombatant}
					>
						<Plus className="h-3 w-3" />
					</Button>
				</div>
			)}
		</div>
	);
}
