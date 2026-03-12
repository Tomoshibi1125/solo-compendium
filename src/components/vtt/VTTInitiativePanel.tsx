/**
 * VTT Initiative Panel — compact initiative tracker for VTT sidebar
 *
 * Reuses the campaign combat hooks for real-time persistence and sync.
 * Designed to fit in the left sidebar's SystemWindow pattern.
 */

import {
	ChevronDown,
	ChevronUp,
	Plus,
	RotateCcw,
	SkipForward,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	type Combatant as CombatantRow,
	useCampaignCombatSession,
	useUpdateCombatSession,
	useUpsertCombatants,
} from "@/hooks/useCampaignCombat";
import { useCampaignCombatRealtime } from "@/hooks/useCampaignCombatRealtime";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────

interface TrackerEntry {
	id: string;
	name: string;
	initiative: number;
	hp?: number;
	maxHp?: number;
	ac?: number;
	conditions: string[];
	isHunter: boolean;
	characterId?: string;
}

interface VTTInitiativePanelProps {
	campaignId: string;
	sessionId?: string | null;
	isGM: boolean;
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
		conditions: Array.isArray(conds) ? (conds as string[]) : [],
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
	isGM,
	onHighlightToken,
}: VTTInitiativePanelProps) {
	const { data } = useCampaignCombatSession(campaignId, sessionId);
	const updateSession = useUpdateCombatSession();
	const upsertCombatants = useUpsertCombatants();
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const ddbTools = usePlayerToolsEnhancements();

	// Real-time sync
	useCampaignCombatRealtime(campaignId, sessionId ?? "");

	const session = data?.session;
	const combatants = (data?.combatants ?? []).map(rowToEntry);
	const sorted = [...combatants].sort((a, b) => b.initiative - a.initiative);
	const currentTurn = session?.current_turn ?? 0;
	const round = session?.round ?? 1;

	// Local state for quick-add form
	const [newName, setNewName] = useState("");
	const [newInit, setNewInit] = useState("");
	const [expandedId, setExpandedId] = useState<string | null>(null);

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
		updateSession.mutate({
			campaignId,
			sessionId: activeSessionId,
			updates: { current_turn: nextIdx, round: nextRound },
		});

		const nextCombatant = sorted[nextIdx];
		if (nextCombatant) {
			ddbTools
				.trackCustomFeatureUsage(
					nextCombatant.characterId || "monster",
					"Turn Start",
					`Round ${nextRound} - ${nextCombatant.name}'s Turn`,
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
		ddbTools,
	]);

	const resetCombat = useCallback(() => {
		if (!activeSessionId) return;
		updateSession.mutate({
			campaignId,
			sessionId: activeSessionId,
			updates: { current_turn: 0, round: 1 },
		});
	}, [campaignId, activeSessionId, updateSession]);

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
						conditions: entry.conditions,
						flags: { isHunter: entry.isHunter },
					},
				],
			});
		},
		[campaignId, activeSessionId, upsertCombatants],
	);

	const toggleCondition = useCallback(
		(entry: TrackerEntry, condition: string) => {
			if (!activeSessionId) return;
			const nextConds = entry.conditions.includes(condition)
				? entry.conditions.filter((c) => c !== condition)
				: [...entry.conditions, condition];
			upsertCombatants.mutate({
				campaignId,
				sessionId: activeSessionId,
				combatants: [
					{
						id: entry.id,
						name: entry.name,
						initiative: entry.initiative,
						stats: { hp: entry.hp, maxHp: entry.maxHp, ac: entry.ac },
						conditions: nextConds,
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
				<span className="text-xs font-semibold text-primary">
					Round {round}
				</span>
				<div className="flex gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6"
						onClick={nextTurn}
						title="Next turn"
					>
						<SkipForward className="h-3 w-3" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6"
						onClick={resetCombat}
						title="Reset combat"
					>
						<RotateCcw className="h-3 w-3" />
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
								<span className="w-5 text-center font-mono text-muted-foreground">
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
									<span className="text-[10px] text-muted-foreground">
										AC{entry.ac}
									</span>
								)}
								{isExpanded ? (
									<ChevronUp className="h-3 w-3 text-muted-foreground shrink-0" />
								) : (
									<ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
								)}
							</button>

							{/* Conditions row */}
							{entry.conditions.length > 0 && (
								<div className="flex flex-wrap gap-0.5 mt-1 ml-6">
									{entry.conditions.map((c) => (
										<span
											key={c}
											className="text-[9px] bg-destructive/20 text-destructive-foreground px-1 rounded"
										>
											{c}
										</span>
									))}
								</div>
							)}

							{isExpanded && isGM && (
								<div
									className="mt-2 pt-2 border-t border-border/50 space-y-2"
								>
									{/* HP adjustment */}
									<div className="flex items-center gap-1">
										<span className="text-[10px] text-muted-foreground w-6">
											HP
										</span>
										<Button
											variant="outline"
											size="icon"
											className="h-5 w-5"
											onClick={() => adjustHP(entry, -1)}
										>
											-
										</Button>
										<span className="text-xs font-mono w-10 text-center">
											{entry.hp ?? "?"}
										</span>
										<Button
											variant="outline"
											size="icon"
											className="h-5 w-5"
											onClick={() => adjustHP(entry, 1)}
										>
											+
										</Button>
									</div>

									{/* Quick conditions */}
									<div className="flex flex-wrap gap-0.5">
										{CONDITION_OPTIONS.slice(0, 8).map((c) => (
											<button
												type="button"
												key={c}
												onClick={() => toggleCondition(entry, c)}
												className={cn(
													"text-[9px] px-1 py-0.5 rounded border transition-colors",
													entry.conditions.includes(c)
														? "bg-destructive/30 border-destructive/50 text-destructive-foreground"
														: "border-border/50 text-muted-foreground hover:bg-muted/30",
												)}
											>
												{c}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					);
				})}

				{sorted.length === 0 && (
					<p className="text-[10px] text-muted-foreground text-center py-2">
						No combatants. Add one below.
					</p>
				)}
			</div>

			{/* Quick-add form (DM only) */}
			{isGM && (
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

export default VTTInitiativePanel;
