/**
 * CompanionSheet — full sub-sheet view for an extracted Shadow Soldier.
 *
 * Q3 of Round 3 (R7). Mirrors the DDB Companion Sheet UX: dedicated
 * route, per-companion ability scores, AC + HP + initiative bar, action
 * list (built from the soldier's `abilities[]`), conditions bar, notes.
 *
 * Route: `/characters/:characterId/companions/:soldierLinkId`
 *
 * Reuses existing UI primitives where possible:
 *   - `AscendantWindow` for the section frames
 *   - `formatModifier` + `getAbilityModifier` for the ability strip
 */
import { useDrag } from "@use-gesture/react";
import {
	ArrowLeft,
	Dice6,
	Edit2,
	Heart,
	Shield,
	Skull,
	Sparkles,
	Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
	type SoldierCondition,
	useCharacterShadowSoldiers,
	useUpdateSoldierConditions,
	useUpdateSoldierHP,
	useUpdateSoldierInitiative,
	useUpdateSoldierMaxHp,
	useUpdateSoldierNotes,
} from "@/hooks/useShadowSoldiers";
import {
	formatModifier,
	getAbilityModifier,
} from "@/lib/characterCalculations";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

const ABILITY_KEYS = ["str", "agi", "vit", "int", "sense", "pre"] as const;

export default function CompanionSheet() {
	const { characterId = "", soldierLinkId = "" } = useParams<{
		characterId: string;
		soldierLinkId: string;
	}>();
	const navigate = useNavigate();
	const { toast } = useToast();

	const { data: companions = [] } = useCharacterShadowSoldiers(characterId);
	const link = companions.find((c) => c.id === soldierLinkId);
	const soldier = link?.soldier;

	const updateHP = useUpdateSoldierHP();
	const updateInit = useUpdateSoldierInitiative();
	const updateNotes = useUpdateSoldierNotes();
	const updateMaxHp = useUpdateSoldierMaxHp();
	const updateConditions = useUpdateSoldierConditions();

	const conditions = useMemo<SoldierCondition[]>(() => {
		const raw = (link as { conditions?: unknown } | undefined)?.conditions;
		return Array.isArray(raw) ? (raw as SoldierCondition[]) : [];
	}, [link]);

	const initialNotes =
		(link as { notes?: string | null } | undefined)?.notes ?? "";
	const initialInitiative =
		(link as { initiative?: number | null } | undefined)?.initiative ?? null;
	const persistedMaxHp =
		(link as { max_hp_override?: number | null } | undefined)
			?.max_hp_override ?? null;

	const [notes, setNotes] = useState(initialNotes);
	const [initiative, setInitiative] = useState<string>(
		initialInitiative != null ? String(initialInitiative) : "",
	);
	const [newCondition, setNewCondition] = useState("");

	useEffect(() => {
		setNotes(initialNotes);
		setInitiative(initialInitiative != null ? String(initialInitiative) : "");
	}, [initialNotes, initialInitiative]);

	// Mobile swipe-back gesture (consistent with CharacterCompare).
	const bindSwipeBack = useDrag(
		({
			swipe: [swipeX],
			initial: [startX],
		}: {
			swipe: [number, number];
			initial: [number, number];
		}) => {
			if (swipeX > 0 && startX < 24) {
				navigate(`/characters/${characterId}`);
			}
		},
		{ axis: "x", filterTaps: true, pointerContext: true },
	);

	if (!link || !soldier) {
		return (
			<Layout>
				<div className="container mx-auto py-12 text-center text-muted-foreground">
					<p className="mb-4">Companion not found in your roster.</p>
					<Button asChild>
						<Link to={`/characters/${characterId}`}>Back to Ascendant</Link>
					</Button>
				</div>
			</Layout>
		);
	}

	const maxHp = persistedMaxHp ?? soldier.hit_points;
	const hpPercent = Math.min(100, Math.max(0, (link.current_hp / maxHp) * 100));

	const handleSaveInit = () => {
		const parsed = Number.parseInt(initiative, 10);
		updateInit.mutate({
			characterId,
			shadowSoldierId: link.id,
			initiative: Number.isFinite(parsed) ? parsed : null,
		});
	};

	const handleSaveNotes = () => {
		updateNotes.mutate({
			characterId,
			shadowSoldierId: link.id,
			notes,
		});
		toast({ title: "Notes saved" });
	};

	const handleAdjustHp = (delta: number) => {
		const next = Math.max(0, Math.min(maxHp, link.current_hp + delta));
		updateHP.mutate({
			characterId,
			shadowSoldierId: link.id,
			currentHp: next,
		});
	};

	const handleAddCondition = () => {
		const trimmed = newCondition.trim();
		if (!trimmed) return;
		const next: SoldierCondition = {
			id: crypto.randomUUID(),
			name: trimmed,
			applied_at: new Date().toISOString(),
		};
		updateConditions.mutate({
			characterId,
			shadowSoldierId: link.id,
			conditions: [...conditions, next],
		});
		setNewCondition("");
	};

	const handleRemoveCondition = (id: string) => {
		updateConditions.mutate({
			characterId,
			shadowSoldierId: link.id,
			conditions: conditions.filter((c) => c.id !== id),
		});
	};

	const displayName = formatRegentVernacular(link.nickname || soldier.name);

	return (
		<Layout>
			<div
				{...bindSwipeBack()}
				className="container mx-auto py-6 touch-pan-y"
				data-testid="companion-sheet-root"
			>
				<div className="mb-6 flex items-center justify-between flex-wrap gap-3">
					<div className="flex items-center gap-3">
						<Button asChild variant="ghost" size="sm">
							<Link to={`/characters/${characterId}`} className="gap-2">
								<ArrowLeft className="w-4 h-4" />
								Back to Ascendant
							</Link>
						</Button>
						<div className="flex items-center gap-2">
							<Skull className="w-5 h-5 text-fuchsia-300" />
							<h1 className="font-display text-2xl">{displayName}</h1>
							<Badge variant="outline" className="text-xs">
								{soldier.rank}
							</Badge>
							{link.is_summoned && (
								<Badge className="text-xs bg-shadow-purple/40 border-shadow-purple">
									Summoned
								</Badge>
							)}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Combat Stats */}
					<AscendantWindow title="VITALS" className="md:col-span-2">
						<div className="space-y-4">
							{/* HP Bar */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Heart className="w-4 h-4 text-red-500" />
										<span className="font-mono text-sm">
											HP {link.current_hp} / {maxHp}
										</span>
									</div>
									<div className="flex items-center gap-1">
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleAdjustHp(-1)}
											aria-label="Decrement HP"
										>
											-1
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleAdjustHp(-5)}
											aria-label="Damage 5"
										>
											-5
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleAdjustHp(5)}
											aria-label="Heal 5"
										>
											+5
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleAdjustHp(1)}
											aria-label="Increment HP"
										>
											+1
										</Button>
									</div>
								</div>
								<Progress
									value={hpPercent}
									className={cn(
										"h-2",
										hpPercent < 25
											? "bg-red-900"
											: hpPercent < 50
												? "bg-amber-900"
												: "bg-emerald-900",
									)}
								/>
							</div>

							{/* AC / Speed / Initiative */}
							<div className="grid grid-cols-3 gap-3">
								<div className="rounded border border-border/40 bg-black/30 p-3 text-center">
									<div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
										AC
									</div>
									<div className="flex items-center justify-center gap-1">
										<Shield className="w-4 h-4 text-blue-400" />
										<span className="text-xl font-display font-bold">
											{soldier.armor_class}
										</span>
									</div>
								</div>
								<div className="rounded border border-border/40 bg-black/30 p-3 text-center">
									<div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
										Speed
									</div>
									<div className="text-xl font-display font-bold">
										{soldier.speed} ft
									</div>
								</div>
								<div className="rounded border border-border/40 bg-black/30 p-3 text-center">
									<div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
										Initiative
									</div>
									<div className="flex items-center justify-center gap-1">
										<Zap className="w-4 h-4 text-yellow-400" />
										<Input
											type="number"
											value={initiative}
											onChange={(e) => setInitiative(e.target.value)}
											onBlur={handleSaveInit}
											className="h-8 w-16 text-center font-display text-lg"
											aria-label="Initiative"
											placeholder="—"
										/>
									</div>
								</div>
							</div>

							{/* Max HP Override */}
							<div className="flex items-center gap-2 text-xs">
								<Edit2 className="w-3 h-3 text-muted-foreground" />
								<span className="text-muted-foreground">Max HP override:</span>
								<Input
									type="number"
									defaultValue={persistedMaxHp ?? ""}
									onBlur={(e) => {
										const v = e.target.value;
										const parsed = Number.parseInt(v, 10);
										updateMaxHp.mutate({
											characterId,
											shadowSoldierId: link.id,
											maxHpOverride: Number.isFinite(parsed) ? parsed : null,
										});
									}}
									placeholder={String(soldier.hit_points)}
									className="h-7 w-20 text-xs"
									aria-label="Max HP override"
								/>
								<span className="text-muted-foreground">
									(base {soldier.hit_points})
								</span>
							</div>
						</div>
					</AscendantWindow>

					{/* Ability Scores */}
					<AscendantWindow title="ABILITIES">
						<div className="grid grid-cols-3 gap-2">
							{ABILITY_KEYS.map((key) => {
								const score = (soldier as unknown as Record<string, number>)[
									key
								];
								const mod = getAbilityModifier(score);
								return (
									<div
										key={key}
										className="rounded border border-border/40 bg-black/30 p-2 text-center"
									>
										<div className="text-[9px] uppercase tracking-wider text-muted-foreground">
											{key}
										</div>
										<div className="font-display text-base font-bold">
											{score}
										</div>
										<div className="text-xs text-primary">
											{formatModifier(mod)}
										</div>
									</div>
								);
							})}
						</div>
					</AscendantWindow>
				</div>

				{/* Abilities (Actions) */}
				<div className="mt-4">
					<AscendantWindow title="ACTIONS & ABILITIES">
						<div className="space-y-2">
							{(soldier.abilities ?? []).map((ability) => (
								<div
									key={ability.name}
									className="rounded border border-border/40 bg-black/20 p-3"
								>
									<div className="flex items-center gap-2">
										<Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
										<span className="font-display text-sm font-semibold">
											{ability.name}
										</span>
										<Badge variant="outline" className="text-[10px]">
											{ability.action_type}
										</Badge>
										<Button
											size="sm"
											variant="ghost"
											className="ml-auto h-7"
											onClick={() =>
												toast({
													title: `${ability.name} prepared`,
													description: `Roll initiative & resolve on the Ascendant's turn.`,
												})
											}
										>
											<Dice6 className="w-3.5 h-3.5 mr-1" />
											Prep
										</Button>
									</div>
									<p className="text-xs text-muted-foreground mt-1">
										{ability.description}
									</p>
								</div>
							))}
						</div>
					</AscendantWindow>
				</div>

				{/* Conditions */}
				<div className="mt-4">
					<AscendantWindow title="CONDITIONS">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Input
									value={newCondition}
									onChange={(e) => setNewCondition(e.target.value)}
									placeholder="e.g. Frightened"
									className="h-8"
									aria-label="New condition"
								/>
								<Button
									size="sm"
									onClick={handleAddCondition}
									disabled={!newCondition.trim()}
								>
									Add
								</Button>
							</div>
							{conditions.length === 0 ? (
								<p className="text-xs text-muted-foreground">
									No active conditions.
								</p>
							) : (
								<div className="flex flex-wrap gap-1.5">
									{conditions.map((c) => (
										<Badge
											key={c.id}
											variant="outline"
											className="gap-1 text-xs cursor-pointer hover:bg-destructive/10"
											onClick={() => handleRemoveCondition(c.id)}
											title="Click to remove"
										>
											{c.name} ✕
										</Badge>
									))}
								</div>
							)}
						</div>
					</AscendantWindow>
				</div>

				{/* Notes */}
				<div className="mt-4">
					<AscendantWindow title="NOTES">
						<Textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							onBlur={handleSaveNotes}
							placeholder="Companion notes, lore, tactical reminders…"
							rows={4}
							className="text-sm"
							data-testid="companion-notes-textarea"
						/>
					</AscendantWindow>
				</div>
			</div>
		</Layout>
	);
}
