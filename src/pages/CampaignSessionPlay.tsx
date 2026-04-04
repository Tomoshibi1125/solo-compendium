import {
	AlertTriangle,
	ChevronRight,
	Minus,
	Plus,
	Swords,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DataStreamText,
	SystemHeading,
	SystemText,
} from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { SystemNotificationOverlay } from "@/components/vtt/SystemNotificationOverlay";
import {
	useCampaignCombatSession,
	useEndCombatSession,
	useUpdateCombatSession,
} from "@/hooks/useCampaignCombat";
import { useWardenToolsEnhancements } from "@/hooks/useGlobalDDBeyondIntegration";
import {
	type BroadcastPayload,
	useVTTBroadcast,
} from "@/hooks/useVTTBroadcast";
import { cn } from "@/lib/utils";

const CampaignSessionPlay = () => {
	const { campaignId, sessionId } = useParams<{
		campaignId: string;
		sessionId: string;
	}>();

	// Resolved IDs
	const resolvedCampaignId = campaignId ?? "";
	const resolvedSessionId = sessionId ?? "";

	// Master integration: encounter rewards, combat tracking, VTT mgmt, analytics (DDB parity)
	const wardenTools = useWardenToolsEnhancements();

	// VTT Broadcasting Integration
	const [activeBroadcasts, setActiveBroadcasts] = useState<BroadcastPayload[]>(
		[],
	);
	const { sendBroadcast: _ } = useVTTBroadcast(
		resolvedCampaignId,
		sessionId,
		(payload) => {
			setActiveBroadcasts((prev) => [...prev, payload]);
		},
	);

	const dismissBroadcast = (id: string) => {
		setActiveBroadcasts((prev) => prev.filter((b) => b.id !== id));
	};

	const { data, isLoading, error } = useCampaignCombatSession(
		resolvedCampaignId,
		resolvedSessionId,
	);
	const session = data?.session ?? null;
	const combatants = data?.combatants ?? [];

	// Combat mutations
	const updateSession = useUpdateCombatSession();
	const endCombat = useEndCombatSession();

	// HP quick-adjust state (local, per combatant)
	const [adjustments, setAdjustments] = useState<Record<string, number>>({});

	const sorted = useMemo(() => {
		return [...combatants].sort(
			(a, b) => (b.initiative ?? 0) - (a.initiative ?? 0),
		);
	}, [combatants]);

	const currentTurnIndex = session?.current_turn ?? 0;
	const currentRound = session?.round ?? 1;
	const isActive = session?.status === "active";

	const handleNextTurn = async () => {
		if (!session) return;
		const nextTurn = (currentTurnIndex + 1) % Math.max(sorted.length, 1);
		const nextRound = nextTurn === 0 ? currentRound + 1 : currentRound;
		await updateSession.mutateAsync({
			campaignId: resolvedCampaignId,
			sessionId: resolvedSessionId,
			updates: { current_turn: nextTurn, round: nextRound },
		});
	};

	const handleEndCombat = async () => {
		if (!session || !window.confirm("End this combat session?")) return;
		await endCombat.mutateAsync({
			campaignId: resolvedCampaignId,
			sessionId: resolvedSessionId,
		});
	};

	const getHP = (c: (typeof sorted)[number]) => {
		const stats = c.stats as Record<string, unknown> | null;
		return {
			hp: typeof stats?.hp === "number" ? stats.hp : 0,
			maxHp: typeof stats?.max_hp === "number" ? stats.max_hp : 0,
		};
	};

	return (
		<Layout>
			<div
				className="container mx-auto px-4 py-8 max-w-5xl space-y-6"
				data-testid="campaign-session-play"
			>
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<div>
						<SystemHeading
							level={1}
							variant="gate"
							dimensional
							className="mb-2"
						>
							Active Engagement
						</SystemHeading>
						<DataStreamText variant="system" speed="slow" className="text-sm">
							Live engagement Lattice: initiative queues, temporal tracking, and
							dimensional topology.
						</DataStreamText>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" asChild>
							<Link to={`/campaigns/${resolvedCampaignId}`}>
								Back to Campaign
							</Link>
						</Button>
						<Button className="btn-umbral" asChild>
							<Link
								to={`/campaigns/${resolvedCampaignId}/vtt?sessionId=${encodeURIComponent(resolvedSessionId)}`}
							>
								Open VTT
							</Link>
						</Button>
					</div>
				</div>

				<SystemWindow title="LIVE COMBAT SESSION">
					{isLoading ? (
						<SystemText className="block text-sm text-muted-foreground">
							Loading session...
						</SystemText>
					) : error ? (
						<p className="text-sm text-destructive">Failed to load session.</p>
					) : !session ? (
						<SystemText className="block text-sm text-muted-foreground">
							No active session found.
						</SystemText>
					) : (
						<div className="space-y-4">
							{/* Status Bar */}
							<div className="flex flex-wrap items-center gap-3">
								<Badge variant="outline">Round {currentRound}</Badge>
								<Badge variant="outline">
									Turn {currentTurnIndex + 1} / {Math.max(sorted.length, 1)}
								</Badge>
								<Badge variant={isActive ? "default" : "outline"}>
									{String(session.status ?? "unknown").toUpperCase()}
								</Badge>
							</div>

							{/* Combatant Initiative List */}
							<div className="space-y-2" data-testid="session-initiative-list">
								{sorted.length === 0 ? (
									<SystemText className="block text-sm text-muted-foreground">
										No combatants yet.
									</SystemText>
								) : (
									sorted.map((c, idx) => {
										const isCurrentTurn = idx === currentTurnIndex;
										const { hp, maxHp } = getHP(c);
										const adj = adjustments[c.id] ?? 0;

										return (
											<div
												key={c.id}
												className={cn(
													"flex items-center justify-between rounded border px-3 py-2 gap-3 flex-wrap",
													isCurrentTurn
														? "border-primary bg-primary/10"
														: "border-border bg-muted/20",
												)}
												data-testid={
													isCurrentTurn
														? "initiative-active-combatant"
														: undefined
												}
											>
												{/* Name + HP */}
												<div className="min-w-0 flex-1">
													<div className="font-heading font-semibold truncate flex items-center gap-2">
														{isCurrentTurn && (
															<ChevronRight className="w-4 h-4 text-primary shrink-0" />
														)}
														{c.name}
													</div>
													<div className="text-xs text-muted-foreground">
														HP {hp + adj} / {maxHp > 0 ? maxHp : "—"}
														{adj !== 0 && (
															<span
																className={cn(
																	"ml-1 font-semibold",
																	adj > 0 ? "text-green-400" : "text-red-400",
																)}
															>
																({adj > 0 ? "+" : ""}
																{adj})
															</span>
														)}
													</div>
												</div>

												{/* Initiative + HP Quick-Adjust */}
												<div className="flex items-center gap-2 shrink-0">
													<Badge variant="outline">
														Init {c.initiative ?? 0}
													</Badge>
													{wardenTools.isWarden && (
														<div className="flex items-center gap-1">
															<Button
																variant="ghost"
																size="icon"
																className="h-6 w-6 text-red-400 hover:bg-red-500/10"
																onClick={() =>
																	setAdjustments((prev) => ({
																		...prev,
																		[c.id]: (prev[c.id] ?? 0) - 1,
																	}))
																}
																aria-label={`Decrease HP for ${c.name}`}
															>
																<Minus className="w-3 h-3" />
															</Button>
															{adj !== 0 && (
																<button
																	type="button"
																	className="text-xs text-muted-foreground w-5 text-center hover:text-foreground"
																	onClick={() =>
																		setAdjustments((prev) => {
																			const n = { ...prev };
																			delete n[c.id];
																			return n;
																		})
																	}
																	aria-label="Reset HP adjustment"
																>
																	×
																</button>
															)}
															<Button
																variant="ghost"
																size="icon"
																className="h-6 w-6 text-green-400 hover:bg-green-500/10"
																onClick={() =>
																	setAdjustments((prev) => ({
																		...prev,
																		[c.id]: (prev[c.id] ?? 0) + 1,
																	}))
																}
																aria-label={`Increase HP for ${c.name}`}
															>
																<Plus className="w-3 h-3" />
															</Button>
														</div>
													)}
												</div>
											</div>
										);
									})
								)}
							</div>

							<div className="pt-2 text-xs text-muted-foreground border-t border-border">
								This view updates live while the Protocol Warden advances turns
								in Initiative Tracker.
							</div>

							{/* Warden Controls */}
							{wardenTools.isWarden && (
								<div className="mt-6 pt-4 border-t border-border/50 space-y-4">
									<h3 className="font-heading font-semibold text-lg text-primary">
										Protocol Warden Controls
									</h3>

									{/* Turn / Combat Actions */}
									<div className="grid grid-cols-2 gap-3">
										<Button
											className="btn-umbral gap-2"
											onClick={handleNextTurn}
											disabled={
												updateSession.isPending ||
												!isActive ||
												sorted.length === 0
											}
										>
											<ChevronRight className="w-4 h-4" />
											Next Turn
											{currentTurnIndex + 1 >= sorted.length &&
												sorted.length > 0 && (
													<span className="text-xs opacity-70 block text-center w-full">
														(→ Round {currentRound + 1})
													</span>
												)}
										</Button>

										<Button
											variant="destructive"
											className="gap-2"
											onClick={handleEndCombat}
											disabled={endCombat.isPending || !isActive}
										>
											<X className="w-4 h-4" />
											End Combat
										</Button>
									</div>

									{/* Encounter Builder link */}
									<div className="grid grid-cols-2 gap-3">
										<Button
											variant="outline"
											className="flex flex-col items-center justify-center h-20 gap-1.5 border-primary/20 hover:border-primary/50"
											asChild
										>
											<Link
												to={`/warden-protocols/encounter-builder?campaignId=${resolvedCampaignId}&sessionId=${resolvedSessionId}`}
											>
												<Swords className="w-5 h-5" />
												<span className="font-heading text-sm">
													Manage Engagement
												</span>
												<span className="text-[10px] text-muted-foreground">
													Add/Remove Entities
												</span>
											</Link>
										</Button>

										<Button
											variant="outline"
											className="flex flex-col items-center justify-center h-20 gap-1.5 border-amber-500/20 hover:border-amber-500/50"
											onClick={() =>
												wardenTools.awardEncounterRewards(resolvedSessionId)
											}
										>
											<AlertTriangle className="w-4 h-4 text-amber-500" />
											<span className="font-heading text-sm">
												Award Rewards
											</span>
											<span className="text-[10px] text-muted-foreground">
												Distribute XP & Loot
											</span>
										</Button>
									</div>
								</div>
							)}
						</div>
					)}
				</SystemWindow>
				<SystemNotificationOverlay
					notifications={activeBroadcasts}
					onDismiss={dismissBroadcast}
				/>
			</div>
		</Layout>
	);
};

export default CampaignSessionPlay;
