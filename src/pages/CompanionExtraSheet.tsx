/**
 * CompanionExtraSheet — full combat sub-sheet for a character's Companion
 * (mount / pet / familiar / sidekick / guild-ally) stored in `character_extras`.
 *
 * Sibling of the shadow-soldier sub-sheet (`CompanionSheet.tsx`); mirrors its
 * DDB-style UX: dedicated route, HP + AC + Speed + initiative bar, equipment
 * list with AC bonuses, action list, conditions bar, notes, and an
 * "Add to Initiative" hand-off to the Initiative Tracker.
 *
 * Route: `/characters/:characterId/companions/extra/:extraId`
 *
 * Reuses existing UI primitives:
 *   - `AscendantWindow` for the section frames
 *   - Companion substrate helpers from `@/lib/companions` for JSON + AC math
 */
import { useDrag } from "@use-gesture/react";
import {
	ArrowLeft,
	Heart,
	PawPrint,
	Shield,
	Sparkles,
	Swords,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCharacterExtras } from "@/hooks/useCharacterExtras";
import type { Json } from "@/integrations/supabase/types";
import {
	type CompanionCondition,
	type CompanionEquipment,
	effectiveCompanionAc,
	equipmentAcBonus,
	parseAbilities,
	parseConditions,
	parseEquipment,
} from "@/lib/companions";
import { enqueueInitiativeAdditions } from "@/lib/initiativeQueue";
import { cn } from "@/lib/utils";

export default function CompanionExtraSheet() {
	const { characterId = "", extraId = "" } = useParams<{
		characterId: string;
		extraId: string;
	}>();
	const navigate = useNavigate();
	const { toast } = useToast();

	const { extras, updateExtra, isLoading } = useCharacterExtras(characterId);
	const extra = extras.find((e) => e.id === extraId);

	// Local seed state for notes + initiative (mirrors CompanionSheet).
	const [notes, setNotes] = useState(extra?.notes ?? "");
	const [initiative, setInitiative] = useState<string>(
		extra?.initiative != null ? String(extra.initiative) : "",
	);
	const [newCondition, setNewCondition] = useState("");

	// Equipment add-row form state.
	const [newName, setNewName] = useState("");
	const [newAcBonus, setNewAcBonus] = useState("");
	const [newAttack, setNewAttack] = useState("");
	const [newDamage, setNewDamage] = useState("");
	const [newNotes, setNewNotes] = useState("");

	useEffect(() => {
		setNotes(extra?.notes ?? "");
		setInitiative(extra?.initiative != null ? String(extra.initiative) : "");
	}, [extra?.notes, extra?.initiative]);

	// Mobile swipe-back gesture (consistent with CompanionSheet).
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

	if (!extra) {
		if (isLoading) {
			return (
				<Layout>
					<div className="container mx-auto py-12 text-center text-muted-foreground">
						<p>Loading companion…</p>
					</div>
				</Layout>
			);
		}
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

	const equipment = parseEquipment(extra.equipment);
	const abilities = parseAbilities(extra.abilities);
	const conditions = parseConditions(extra.conditions);
	const baseAc = extra.ac ?? 10;
	const effectiveAc = effectiveCompanionAc(baseAc, equipment);
	const acBonus = equipmentAcBonus(equipment);

	const hpMax = extra.hp_max;
	const hpPercent = Math.min(
		100,
		Math.max(0, hpMax > 0 ? (extra.hp_current / hpMax) * 100 : 0),
	);

	const handleAdjustHp = (delta: number) => {
		const next = Math.max(0, Math.min(hpMax, extra.hp_current + delta));
		updateExtra({ id: extra.id, data: { hp_current: next } });
	};

	const handleSaveInit = () => {
		const parsed = Number.parseInt(initiative, 10);
		updateExtra({
			id: extra.id,
			data: { initiative: Number.isFinite(parsed) ? parsed : null },
		});
	};

	const handleSaveNotes = () => {
		updateExtra({ id: extra.id, data: { notes } });
	};

	const persistEquipment = (next: CompanionEquipment[]) => {
		updateExtra({
			id: extra.id,
			data: { equipment: next as unknown as Json },
		});
	};

	const handleAddEquipment = () => {
		const name = newName.trim();
		if (!name) return;
		const parsedBonus = Number.parseInt(newAcBonus, 10);
		const item: CompanionEquipment = {
			name,
			...(Number.isFinite(parsedBonus) ? { ac_bonus: parsedBonus } : {}),
			...(newAttack.trim() ? { attack: newAttack.trim() } : {}),
			...(newDamage.trim() ? { damage: newDamage.trim() } : {}),
			...(newNotes.trim() ? { notes: newNotes.trim() } : {}),
		};
		persistEquipment([...equipment, item]);
		setNewName("");
		setNewAcBonus("");
		setNewAttack("");
		setNewDamage("");
		setNewNotes("");
		toast({ title: "Gear equipped" });
	};

	const handleRemoveEquipment = (index: number) => {
		persistEquipment(equipment.filter((_, i) => i !== index));
	};

	const persistConditions = (next: CompanionCondition[]) => {
		updateExtra({
			id: extra.id,
			data: { conditions: next as unknown as Json },
		});
	};

	const handleAddCondition = () => {
		const trimmed = newCondition.trim();
		if (!trimmed) return;
		const next: CompanionCondition = {
			id: crypto.randomUUID(),
			name: trimmed,
			applied_at: new Date().toISOString(),
		};
		persistConditions([...conditions, next]);
		setNewCondition("");
	};

	const handleRemoveCondition = (id: string) => {
		persistConditions(conditions.filter((c) => c.id !== id));
	};

	const handleAddToInitiative = () => {
		enqueueInitiativeAdditions({
			name: extra.name,
			hp: extra.hp_current,
			maxHp: extra.hp_max,
			ac: effectiveAc,
			isHunter: false,
			initiative: 0,
			conditions: [],
		});
		toast({
			title: "Added to initiative",
			description: `${extra.name} is queued for the Initiative Tracker.`,
		});
	};

	return (
		<Layout>
			<div
				{...bindSwipeBack()}
				className="container mx-auto py-6 touch-pan-y"
				data-testid="companion-extra-sheet-root"
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
							<PawPrint className="w-5 h-5 text-emerald-300" />
							<h1 className="font-display text-2xl">{extra.name}</h1>
							<Badge variant="outline" className="text-xs uppercase">
								{extra.extra_type}
							</Badge>
						</div>
					</div>
					<Button size="sm" onClick={handleAddToInitiative} className="gap-2">
						<Swords className="w-4 h-4" />
						Add to Initiative
					</Button>
				</div>

				{/* Vitals */}
				<AscendantWindow title="VITALS">
					<div className="space-y-4">
						{/* HP Bar */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Heart className="w-4 h-4 text-red-500" />
									<span className="font-mono text-sm">
										HP {extra.hp_current} / {hpMax}
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
										{effectiveAc}
									</span>
								</div>
								{acBonus !== 0 && (
									<div className="text-xs text-muted-foreground mt-1">
										(base {baseAc})
									</div>
								)}
							</div>
							<div className="rounded border border-border/40 bg-black/30 p-3 text-center">
								<div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
									Speed
								</div>
								<div className="text-xl font-display font-bold">
									{extra.speed ?? 30} ft
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
					</div>
				</AscendantWindow>

				{/* Equipment */}
				<div className="mt-4">
					<AscendantWindow title="EQUIPMENT">
						<div className="space-y-3">
							{equipment.length === 0 ? (
								<p className="text-xs text-muted-foreground">
									No gear equipped.
								</p>
							) : (
								<div className="space-y-2">
									{equipment.map((item, index) => (
										<div
											key={
												item.id ??
												`${item.name}-${item.ac_bonus ?? ""}-${item.attack ?? ""}`
											}
											className="rounded border border-border/40 bg-black/20 p-3"
										>
											<div className="flex items-center gap-2">
												<Shield className="w-3.5 h-3.5 text-blue-400" />
												<span className="font-display text-sm font-semibold">
													{item.name}
												</span>
												{item.ac_bonus !== undefined && (
													<Badge variant="outline" className="text-[10px]">
														AC {item.ac_bonus >= 0 ? "+" : ""}
														{item.ac_bonus}
													</Badge>
												)}
												<Button
													size="sm"
													variant="ghost"
													className="ml-auto h-7"
													onClick={() => handleRemoveEquipment(index)}
													aria-label={`Remove ${item.name}`}
												>
													✕
												</Button>
											</div>
											{(item.attack || item.damage) && (
												<div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3">
													{item.attack && <span>Attack: {item.attack}</span>}
													{item.damage && <span>Damage: {item.damage}</span>}
												</div>
											)}
											{item.notes && (
												<p className="text-xs text-muted-foreground mt-1">
													{item.notes}
												</p>
											)}
										</div>
									))}
								</div>
							)}

							{/* Add gear */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-border/40 pt-3">
								<Input
									value={newName}
									onChange={(e) => setNewName(e.target.value)}
									placeholder="Name (required)"
									className="h-8"
									aria-label="Gear name"
								/>
								<Input
									type="number"
									value={newAcBonus}
									onChange={(e) => setNewAcBonus(e.target.value)}
									placeholder="AC bonus"
									className="h-8"
									aria-label="Gear AC bonus"
								/>
								<Input
									value={newAttack}
									onChange={(e) => setNewAttack(e.target.value)}
									placeholder="Attack (optional)"
									className="h-8"
									aria-label="Gear attack"
								/>
								<Input
									value={newDamage}
									onChange={(e) => setNewDamage(e.target.value)}
									placeholder="Damage (optional)"
									className="h-8"
									aria-label="Gear damage"
								/>
								<Input
									value={newNotes}
									onChange={(e) => setNewNotes(e.target.value)}
									placeholder="Notes (optional)"
									className="h-8 sm:col-span-2"
									aria-label="Gear notes"
								/>
								<Button
									size="sm"
									onClick={handleAddEquipment}
									disabled={!newName.trim()}
									className="sm:col-span-2"
								>
									Add Gear
								</Button>
							</div>
						</div>
					</AscendantWindow>
				</div>

				{/* Abilities (Actions) */}
				<div className="mt-4">
					<AscendantWindow title="ACTIONS & ABILITIES">
						<div className="space-y-2">
							{abilities.length === 0 ? (
								<p className="text-xs text-muted-foreground">
									No actions recorded.
								</p>
							) : (
								abilities.map((ability) => (
									<div
										key={ability.name}
										className="rounded border border-border/40 bg-black/20 p-3"
									>
										<div className="flex items-center gap-2">
											<Sparkles className="w-3.5 h-3.5 text-emerald-300" />
											<span className="font-display text-sm font-semibold">
												{ability.name}
											</span>
											{ability.action_type && (
												<Badge variant="outline" className="text-[10px]">
													{ability.action_type}
												</Badge>
											)}
										</div>
										{ability.description && (
											<p className="text-xs text-muted-foreground mt-1">
												{ability.description}
											</p>
										)}
									</div>
								))
							)}
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
							data-testid="companion-extra-notes"
						/>
					</AscendantWindow>
				</div>
			</div>
		</Layout>
	);
}
