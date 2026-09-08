import {
	Dice6,
	History,
	Minus,
	Palette,
	Plus,
	Radio,
	SkipForward,
	Sparkles,
} from "lucide-react";
import {
	lazy,
	type ReactNode,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	DiceTrayContext,
	type DiceTrayContextValue,
	type DiceTrayPanel,
} from "@/components/dice/DiceTrayContext";
import { DICE_THEMES, type DiceTheme } from "@/components/dice/diceThemes";
import { ExportMenu } from "@/components/shared/ExportMenu";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCampaignDice } from "@/hooks/useCampaignDice";
import { useRecordRoll, useRollHistory } from "@/hooks/useRollHistory";
import type { Json } from "@/integrations/supabase/types";
import {
	DICE_SESSION_CSV_COLUMNS,
	type DiceSessionRoll,
	diceSessionMarkdown,
	diceSessionRows,
} from "@/lib/contentExport";
import {
	createDiceRollSession,
	type DiceRollSession,
	type DiceTraySessionInput,
	type ManualDiceEntry,
	rollManualDicePool,
} from "@/lib/diceTraySession";
import { usePerformanceProfile } from "@/lib/performanceProfile";
import { cn } from "@/lib/utils";
import "./DiceTray.css";

const Dice3DRoller = lazy(() =>
	import("@/components/dice/Dice3D").then((module) => ({
		default: module.Dice3DRoller,
	})),
);

const MANUAL_DICE = [4, 6, 8, 10, 12, 20, 100] as const;
const QUICK_ROLLS = [
	{ label: "d20", entries: [{ sides: 20, count: 1 }], modifier: 0 },
	{ label: "d20 +5", entries: [{ sides: 20, count: 1 }], modifier: 5 },
	{ label: "2d6", entries: [{ sides: 6, count: 2 }], modifier: 0 },
	{ label: "d8 +3", entries: [{ sides: 8, count: 1 }], modifier: 3 },
	{ label: "d100", entries: [{ sides: 100, count: 1 }], modifier: 0 },
] as const;

const canUseWebGL = () => {
	if (typeof document === "undefined") return false;
	try {
		const canvas = document.createElement("canvas");
		return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
	} catch {
		return false;
	}
};

const formatModifier = (modifier: number) =>
	modifier === 0 ? "" : ` ${modifier > 0 ? "+" : "-"} ${Math.abs(modifier)}`;

const resolveDisplayMode = (
	instantMode: boolean,
	reducedMotion: boolean,
	webglAvailable: boolean,
) => (instantMode || reducedMotion || !webglAvailable ? "instant" : "animated");

function StaticDiceResult({ session }: { session: DiceRollSession }) {
	return (
		<div
			className="dice-tray-static-result"
			role="status"
			aria-label="Resolved dice result"
		>
			<div className="flex flex-wrap justify-center gap-3">
				{session.dice.map((die) => (
					<div
						key={die.id}
						className={cn(
							"dice-tray-die-chip",
							die.dropped && "dice-tray-die-chip--dropped",
							die.kept && "dice-tray-die-chip--kept",
						)}
					>
						<span className="text-[10px] tracking-[0.16em] uppercase opacity-60">
							d{die.sides}
						</span>
						<strong>
							{die.displayMode === "percentile-tens"
								? die.displayValue === 0
									? "00"
									: `${die.displayValue ?? die.value}0`
								: (die.displayValue ?? die.value)}
						</strong>
						{die.dropped && (
							<span className="text-[10px] uppercase">Dropped</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

function RollResult({
	session,
	isRolling,
}: {
	session: DiceRollSession;
	isRolling: boolean;
}) {
	return (
		<div className="dice-tray-result-summary" aria-live="polite">
			<p className="text-xs font-mono uppercase tracking-[0.24em] text-primary/75">
				{isRolling ? "Resolving the roll" : session.context}
			</p>
			<div
				data-testid="dice-tray-result-total"
				className={cn(
					"dice-tray-total",
					session.isCritical && "dice-tray-total--critical",
					session.isFumble && "dice-tray-total--fumble",
				)}
			>
				{session.total}
			</div>
			<p className="font-mono text-sm text-muted-foreground">
				{session.formula}
				{session.modifier !== 0 &&
				!session.formula.includes(String(session.modifier))
					? formatModifier(session.modifier)
					: ""}
			</p>
			{session.droppedRolls.length > 0 && (
				<p className="mt-2 text-xs font-heading uppercase tracking-wide text-muted-foreground">
					Kept {session.rolls[0]} · dropped {session.droppedRolls.join(", ")}
				</p>
			)}
			{!isRolling && session.isCritical && (
				<p className="mt-3 text-sm font-heading font-bold text-system-green">
					Critical success
				</p>
			)}
			{!isRolling && session.isFumble && (
				<p className="mt-3 text-sm font-heading font-bold text-destructive">
					Critical failure
				</p>
			)}
		</div>
	);
}

function ManualPanel({
	entries,
	modifier,
	advantage,
	onEntriesChange,
	onModifierChange,
	onAdvantageChange,
	onRoll,
}: {
	entries: readonly ManualDiceEntry[];
	modifier: number;
	advantage: "normal" | "advantage" | "disadvantage";
	onEntriesChange: (entries: ManualDiceEntry[]) => void;
	onModifierChange: (modifier: number) => void;
	onAdvantageChange: (value: "normal" | "advantage" | "disadvantage") => void;
	onRoll: () => void;
}) {
	const adjustDie = (sides: number, delta: number) => {
		const existing = entries.find((entry) => entry.sides === sides)?.count ?? 0;
		const nextCount = Math.max(0, existing + delta);
		const next = entries.filter((entry) => entry.sides !== sides);
		if (nextCount > 0) next.push({ sides, count: nextCount });
		onEntriesChange(next.sort((left, right) => left.sides - right.sides));
	};
	const singleD20 =
		entries.length === 1 && entries[0]?.sides === 20 && entries[0]?.count === 1;

	return (
		<div className="space-y-5">
			<div>
				<Label className="text-xs uppercase tracking-[0.18em]">
					Quick rolls
				</Label>
				<div className="mt-2 flex flex-wrap gap-2">
					{QUICK_ROLLS.map((preset) => (
						<Button
							key={preset.label}
							type="button"
							variant="outline"
							size="sm"
							onClick={() => {
								onEntriesChange([...preset.entries]);
								onModifierChange(preset.modifier);
								onAdvantageChange("normal");
							}}
						>
							{preset.label}
						</Button>
					))}
				</div>
			</div>

			<div>
				<Label className="text-xs uppercase tracking-[0.18em]">Dice pool</Label>
				<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
					{MANUAL_DICE.map((sides) => {
						const count =
							entries.find((entry) => entry.sides === sides)?.count ?? 0;
						return (
							<div
								key={sides}
								className="flex items-center justify-between rounded-md border border-primary/20 bg-black/30 px-2 py-2"
							>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => adjustDie(sides, -1)}
									disabled={count === 0}
									aria-label={`Remove d${sides}`}
								>
									<Minus className="h-3.5 w-3.5" />
								</Button>
								<div className="text-center font-mono">
									<strong className="block text-sm">d{sides}</strong>
									<span className="text-xs text-muted-foreground">{count}</span>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => adjustDie(sides, 1)}
									aria-label={`Add d${sides}`}
								>
									<Plus className="h-3.5 w-3.5" />
								</Button>
							</div>
						);
					})}
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<Label className="text-xs uppercase tracking-[0.18em]">
						Modifier
					</Label>
					<div className="mt-2 flex items-center gap-3">
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => onModifierChange(modifier - 1)}
							aria-label="Decrease modifier"
						>
							<Minus className="h-4 w-4" />
						</Button>
						<span className="min-w-12 text-center font-mono text-xl">
							{modifier >= 0 ? "+" : ""}
							{modifier}
						</span>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => onModifierChange(modifier + 1)}
							aria-label="Increase modifier"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<div>
					<Label className="text-xs uppercase tracking-[0.18em]">
						d20 mode
					</Label>
					<div className="mt-2 flex gap-2">
						{(["normal", "advantage", "disadvantage"] as const).map((mode) => (
							<Button
								key={mode}
								type="button"
								variant={advantage === mode ? "default" : "outline"}
								size="sm"
								disabled={!singleD20 && mode !== "normal"}
								onClick={() => onAdvantageChange(mode)}
								className="capitalize"
							>
								{mode}
							</Button>
						))}
					</div>
					<p className="mt-2 text-xs text-muted-foreground">
						Advantage and disadvantage apply to one d20 check only.
					</p>
				</div>
			</div>

			<Button
				type="button"
				onClick={onRoll}
				disabled={entries.length === 0}
				className="w-full min-h-12 font-display tracking-[0.12em]"
				data-testid="dice-tray-roll-button"
			>
				<Dice6 className="mr-2 h-5 w-5" /> Roll dice
			</Button>
		</div>
	);
}

export function DiceTrayProvider({ children }: { children: ReactNode }) {
	const { reducedMotion } = usePerformanceProfile();
	const { rollInCampaign, getCampaignsForRolling } = useCampaignDice();
	const recordRoll = useRecordRoll();
	const rollHistory = useRollHistory(undefined, 20);
	const [isOpen, setIsOpen] = useState(false);
	const [panel, setPanel] = useState<DiceTrayPanel>("manual");
	const [session, setSession] = useState<DiceRollSession | null>(null);
	const [isRolling, setIsRolling] = useState(false);
	const [instantMode, setInstantMode] = useState(false);
	const [theme, setTheme] = useState<DiceTheme>("umbral-ascendant");
	const [entries, setEntries] = useState<ManualDiceEntry[]>([]);
	const [modifier, setModifier] = useState(0);
	const [advantage, setAdvantage] = useState<
		"normal" | "advantage" | "disadvantage"
	>("normal");
	const [campaigns, setCampaigns] = useState<
		{ id: string | null; name: string | null }[]
	>([]);
	const [campaignId, setCampaignId] = useState<string | null>(null);
	const [webglAvailable] = useState(canUseWebGL);
	const returnFocusRef = useRef<HTMLElement | null>(null);
	const completedDiceRef = useRef<Set<number>>(new Set());
	const completionRef = useRef<string | null>(null);

	useEffect(() => {
		void getCampaignsForRolling().then(setCampaigns);
	}, [getCampaignsForRolling]);

	useEffect(() => {
		const savedTheme = window.localStorage.getItem(
			"rift-dice-theme",
		) as DiceTheme | null;
		const savedInstant =
			window.localStorage.getItem("rift-dice-instant") === "true";
		if (savedTheme && savedTheme in DICE_THEMES) setTheme(savedTheme);
		setInstantMode(savedInstant);
	}, []);

	useEffect(() => {
		window.localStorage.setItem("rift-dice-theme", theme);
	}, [theme]);
	useEffect(() => {
		window.localStorage.setItem("rift-dice-instant", String(instantMode));
	}, [instantMode]);

	const rememberTrigger = useCallback(() => {
		const focused = document.activeElement;
		returnFocusRef.current = focused instanceof HTMLElement ? focused : null;
	}, []);

	const closeTray = useCallback(() => {
		setIsOpen(false);
		setIsRolling(false);
		window.setTimeout(() => returnFocusRef.current?.focus(), 0);
	}, []);

	const openManual = useCallback(() => {
		rememberTrigger();
		setPanel("manual");
		setSession(null);
		setIsRolling(false);
		setIsOpen(true);
	}, [rememberTrigger]);

	const openPanel = useCallback(
		(nextPanel: Exclude<DiceTrayPanel, "result">) => {
			rememberTrigger();
			setPanel(nextPanel);
			setIsOpen(true);
		},
		[rememberTrigger],
	);

	const presentRoll = useCallback(
		(input: DiceTraySessionInput) => {
			rememberTrigger();
			const nextSession = createDiceRollSession({
				...input,
				theme,
				displayMode: resolveDisplayMode(
					instantMode,
					reducedMotion,
					webglAvailable,
				),
			});
			completionRef.current = null;
			completedDiceRef.current = new Set();
			setSession(nextSession);
			setPanel("result");
			setIsRolling(
				nextSession.displayMode === "animated" && nextSession.dice.length > 0,
			);
			setIsOpen(true);
			return nextSession;
		},
		[instantMode, reducedMotion, rememberTrigger, theme, webglAvailable],
	);

	const selectTheme = useCallback((nextTheme: DiceTheme) => {
		setTheme(nextTheme);
	}, []);

	useEffect(() => {
		const openFromShortcut = () => openManual();
		window.addEventListener("open-dice-tray", openFromShortcut);
		return () => window.removeEventListener("open-dice-tray", openFromShortcut);
	}, [openManual]);

	const finishAnimation = useCallback(() => {
		if (!session || completionRef.current === session.id) return;
		completionRef.current = session.id;
		setIsRolling(false);
	}, [session]);

	useEffect(() => {
		if (!isRolling || !session) return;
		const timeout = window.setTimeout(finishAnimation, 1850);
		return () => window.clearTimeout(timeout);
	}, [finishAnimation, isRolling, session]);

	const handleDieComplete = useCallback(
		(index: number) => {
			if (!session) return;
			completedDiceRef.current.add(index);
			if (completedDiceRef.current.size >= session.dice.length)
				finishAnimation();
		},
		[finishAnimation, session],
	);

	const rollManual = () => {
		const result = rollManualDicePool(entries, modifier, advantage);
		const nextSession = createDiceRollSession({
			source: "manual",
			theme,
			displayMode: resolveDisplayMode(
				instantMode,
				reducedMotion,
				webglAvailable,
			),
			formula: result.formula,
			context: "Freeform roll",
			modifier: result.modifier,
			total: result.total,
			rolls: result.rolls,
			droppedRolls: result.droppedRolls,
			dice: result.dice,
		});
		completionRef.current = null;
		completedDiceRef.current = new Set();
		setSession(nextSession);
		setPanel("result");
		setIsRolling(
			nextSession.displayMode === "animated" && nextSession.dice.length > 0,
		);

		const payload = {
			dice_formula: result.formula,
			result: result.total,
			roll_type: advantage === "normal" ? "manual" : advantage,
			rolls: [...result.rolls, ...result.droppedRolls],
			context: "dice",
			modifiers: result.modifier
				? ({ modifier: result.modifier } as Record<string, Json | undefined>)
				: undefined,
		};
		if (campaignId) {
			void rollInCampaign(campaignId, {
				...payload,
				character_name: "Freeform",
			});
		} else {
			recordRoll.mutate({ ...payload, character_id: null, campaign_id: null });
		}
	};

	const history = useMemo<DiceSessionRoll[]>(
		() =>
			(rollHistory.data ?? []).map((roll) => ({
				dice: roll.dice_formula,
				rolls: roll.rolls ?? [],
				modifier:
					typeof (roll.modifiers as { modifier?: unknown } | null)?.modifier ===
					"number"
						? ((roll.modifiers as { modifier: number }).modifier ?? 0)
						: 0,
				total: roll.result,
				timestamp: new Date(roll.created_at),
				type:
					roll.roll_type === "advantage" || roll.roll_type === "disadvantage"
						? roll.roll_type
						: "normal",
			})),
		[rollHistory.data],
	);

	const contextValue = useMemo<DiceTrayContextValue>(
		() => ({ presentRoll, openManual, openPanel, closeTray }),
		[closeTray, openManual, openPanel, presentRoll],
	);
	const showThree = Boolean(
		session &&
			session.displayMode === "animated" &&
			!reducedMotion &&
			webglAvailable,
	);

	return (
		<DiceTrayContext.Provider value={contextValue}>
			{children}
			<Dialog
				open={isOpen}
				onOpenChange={(open) => (open ? setIsOpen(true) : closeTray())}
			>
				<DialogContent className="dice-tray-dialog max-w-6xl p-0 overflow-hidden">
					<DialogHeader className="sr-only">
						<DialogTitle>Rift dice tray</DialogTitle>
						<DialogDescription>
							Roll, inspect, and manage your digital dice.
						</DialogDescription>
					</DialogHeader>
					<div className="dice-tray-shell">
						<header className="dice-tray-header">
							<div>
								<p className="text-xs font-mono tracking-[0.24em] uppercase text-primary">
									Rift Ascendant
								</p>
								<h2 className="font-display text-xl tracking-wide">
									Digital Dice
								</h2>
							</div>
							<div className="mr-8 flex items-center gap-2">
								{session && isRolling && (
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={finishAnimation}
									>
										<SkipForward className="mr-1.5 h-4 w-4" /> Skip
									</Button>
								)}
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => setPanel("collection")}
									aria-label="Dice collection"
								>
									<Palette className="h-4 w-4" />
								</Button>
							</div>
						</header>

						<div className="dice-tray-layout">
							<section className="dice-tray-stage">
								{session ? (
									<>
										{showThree ? (
											<Suspense
												fallback={
													<div className="dice-tray-loading">
														Preparing dice tray…
													</div>
												}
											>
												<Dice3DRoller
													sessionId={session.id}
													dice={session.dice}
													isRolling={isRolling}
													theme={session.theme}
													onRollComplete={handleDieComplete}
													className="dice-tray-3d"
												/>
											</Suspense>
										) : (
											<StaticDiceResult session={session} />
										)}
										<RollResult session={session} isRolling={isRolling} />
									</>
								) : (
									<div className="dice-tray-empty-stage">
										<Dice6 className="h-12 w-12 text-primary/70" />
										<p>Build a roll or use any roll button in the app.</p>
									</div>
								)}
							</section>

							<aside className="dice-tray-controls">
								<Tabs
									value={panel}
									onValueChange={(value) => setPanel(value as DiceTrayPanel)}
								>
									<TabsList className="w-full grid grid-cols-4">
										<TabsTrigger value="result" disabled={!session}>
											<Sparkles className="h-3.5 w-3.5" />
											<span className="sr-only sm:not-sr-only">Result</span>
										</TabsTrigger>
										<TabsTrigger value="manual">
											<Dice6 className="h-3.5 w-3.5" />
											<span className="sr-only sm:not-sr-only">Roll</span>
										</TabsTrigger>
										<TabsTrigger value="collection">
											<Palette className="h-3.5 w-3.5" />
											<span className="sr-only sm:not-sr-only">Sets</span>
										</TabsTrigger>
										<TabsTrigger value="history">
											<History className="h-3.5 w-3.5" />
											<span className="sr-only sm:not-sr-only">History</span>
										</TabsTrigger>
									</TabsList>

									<TabsContent value="result">
										{session ? (
											<div className="rounded-md border border-primary/15 bg-black/20 p-4 text-sm">
												<p className="font-heading">
													{isRolling ? "Dice are settling…" : "Roll resolved"}
												</p>
												<p className="mt-1 font-mono text-muted-foreground">
													{session.formula}
												</p>
												{session.droppedRolls.length > 0 && (
													<p className="mt-2 text-xs text-muted-foreground">
														Kept {session.rolls[0]} · dropped{" "}
														{session.droppedRolls.join(", ")}
													</p>
												)}
											</div>
										) : (
											<p className="text-sm text-muted-foreground">
												No roll is active.
											</p>
										)}
										<Button
											type="button"
											className="mt-5 w-full"
											variant="outline"
											onClick={() => setPanel("manual")}
										>
											Roll again
										</Button>
									</TabsContent>

									<TabsContent value="manual">
										<ManualPanel
											entries={entries}
											modifier={modifier}
											advantage={advantage}
											onEntriesChange={(next) => {
												setEntries(next);
												if (
													!(
														next.length === 1 &&
														next[0].sides === 20 &&
														next[0].count === 1
													)
												)
													setAdvantage("normal");
											}}
											onModifierChange={setModifier}
											onAdvantageChange={setAdvantage}
											onRoll={rollManual}
										/>
									</TabsContent>

									<TabsContent value="collection">
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-2">
												{Object.entries(DICE_THEMES).map(([key, config]) => (
													<button
														type="button"
														key={key}
														onClick={() => selectTheme(key as DiceTheme)}
														className={cn(
															"rounded-md border p-3 text-left transition-colors",
															theme === key
																? "border-primary bg-primary/15"
																: "border-primary/20 hover:border-primary/60",
														)}
													>
														<span
															className="mb-2 block h-2 rounded-full"
															style={{
																background: `linear-gradient(90deg, ${config.baseColor}, ${config.emissiveColor})`,
															}}
														/>
														<span className="text-xs font-heading">
															{config.name}
														</span>
													</button>
												))}
											</div>
											<div className="flex items-center justify-between rounded-md border border-primary/20 px-3 py-3">
												<div>
													<p className="text-sm font-heading">Instant result</p>
													<p className="text-xs text-muted-foreground">
														Skip 3D motion on your next roll.
													</p>
												</div>
												<Switch
													checked={instantMode}
													onCheckedChange={setInstantMode}
													aria-label="Use instant dice results"
												/>
											</div>
										</div>
									</TabsContent>

									<TabsContent value="history">
										<div className="mb-3 flex items-center justify-between">
											<p className="text-sm font-heading">Recent rolls</p>
											<ExportMenu
												baseName="rift-dice-history"
												disabled={history.length === 0}
												markdown={() => diceSessionMarkdown(history)}
												json={() => diceSessionRows(history)}
												csv={() => ({
													rows: diceSessionRows(history),
													columns: DICE_SESSION_CSV_COLUMNS,
												})}
											/>
										</div>
										<div className="max-h-64 space-y-2 overflow-y-auto pr-1">
											{history.length === 0 ? (
												<p className="py-8 text-center text-sm text-muted-foreground">
													No recorded rolls yet.
												</p>
											) : (
												history.map((roll) => (
													<button
														type="button"
														key={`${roll.timestamp.getTime()}-${roll.dice}-${roll.total}-${roll.rolls.join("-")}`}
														className="w-full rounded-md border border-primary/15 bg-black/20 p-3 text-left hover:border-primary/50"
														onClick={() =>
															presentRoll({
																source: "manual",
																formula: roll.dice,
																context: "Previous roll",
																modifier: roll.modifier,
																total: roll.total,
																rolls: roll.rolls,
															})
														}
													>
														<span className="float-right font-mono text-lg text-primary">
															{roll.total}
														</span>
														<p className="font-mono text-sm">{roll.dice}</p>
														<p className="mt-1 text-xs text-muted-foreground">
															{roll.timestamp.toLocaleTimeString()}
														</p>
													</button>
												))
											)}
										</div>
									</TabsContent>
								</Tabs>

								<div className="mt-5 border-t border-primary/15 pt-4">
									<div className="mb-2 flex items-center gap-2">
										<Radio className="h-4 w-4 text-primary" />
										<Label className="text-xs uppercase tracking-[0.16em]">
											Broadcast
										</Label>
									</div>
									<Select
										value={campaignId ?? "local"}
										onValueChange={(value) =>
											setCampaignId(value === "local" ? null : value)
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Local only" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="local">Local only</SelectItem>
											{campaigns
												.filter(
													(
														campaign,
													): campaign is { id: string; name: string } =>
														Boolean(campaign.id && campaign.name),
												)
												.map((campaign) => (
													<SelectItem key={campaign.id} value={campaign.id}>
														{campaign.name}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</div>
							</aside>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</DiceTrayContext.Provider>
	);
}
