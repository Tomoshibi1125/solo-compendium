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
	LockKeyhole,
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
	parseCanonicalCompanionSource,
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
	const extra = extras.find((entry) => entry.id === extraId);

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
						<p role="status">Loading companion…</p>
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
	const canonicalSource = parseCanonicalCompanionSource(extra.npc_data);
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
		persistEquipment(equipment.filter((_, itemIndex) => itemIndex !== index));
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
		persistConditions(conditions.filter((condition) => condition.id !== id));
	};

	const handleAddToInitiative = () => {
		enqueueInitiativeAdditions({
			name: extra.name,
			hp: extra.hp_current,
			maxHp: extra.hp_max,
			ac: effectiveAc,
			isHunter: false,
			initiative: extra.initiative ?? 0,
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
				className="container mx-auto touch-pan-y px-3 py-4 sm:px-4 sm:py-6"
				data-testid="companion-extra-sheet-root"
			>
				<header className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
						<Button asChild variant="ghost" size="sm" className="self-start">
							<Link to={`/characters/${characterId}`} className="gap-2">
								<ArrowLeft className="w-4" aria-hidden="true" />
								Back to Ascendant
							</Link>
						</Button>
						<div className="flex min-w-0 flex-wrap items-center gap-2">
							<PawPrint
								className="w-5 shrink-0 text-system-green"
								aria-hidden="true"
							/>
							<h1 className="break-words font-display text-2xl">
								{extra.name}
							</h1>
							<Badge variant="outline" className="text-xs uppercase">
								{extra.extra_type}
							</Badge>
						</div>
					</div>
					<Button
						type="button"
						size="sm"
						onClick={handleAddToInitiative}
						className="w-full gap-2 sm:w-auto"
					>
						<Swords className="w-4" aria-hidden="true" />
						Add to Initiative
					</Button>
				</header>

				{canonicalSource && (
					<section
						className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-3 sm:p-4"
						aria-labelledby="canonical-companion-source-heading"
						data-testid="canonical-companion-source"
					>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<h2
									id="canonical-companion-source-heading"
									className="font-heading text-sm font-semibold uppercase tracking-wide"
								>
									Canonical source
								</h2>
								<p className="mt-1 text-xs text-muted-foreground">
									Identity and source-derived base fields from the selected
									compendium entry.
								</p>
							</div>
							<Badge variant="outline" className="w-fit gap-1 text-[10px]">
								<LockKeyhole className="w-3" aria-hidden="true" /> Read-only
							</Badge>
						</div>
						<dl className="mt-3 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
							<div className="min-w-0">
								<dt className="uppercase tracking-wide text-muted-foreground">
									Canonical type
								</dt>
								<dd className="mt-0.5 font-medium capitalize">
									{canonicalSource.provenance.canonicalType}
								</dd>
							</div>
							<div className="min-w-0">
								<dt className="uppercase tracking-wide text-muted-foreground">
									Canonical ID
								</dt>
								<dd className="mt-0.5 break-all font-mono">
									{canonicalSource.provenance.canonicalId}
								</dd>
							</div>
							{canonicalSource.provenance.sourceBook && (
								<div className="min-w-0">
									<dt className="uppercase tracking-wide text-muted-foreground">
										Source book
									</dt>
									<dd className="mt-0.5 break-words font-medium">
										{canonicalSource.provenance.sourceBook}
									</dd>
								</div>
							)}
							{canonicalSource.provenance.source && (
								<div className="min-w-0">
									<dt className="uppercase tracking-wide text-muted-foreground">
										Source
									</dt>
									<dd className="mt-0.5 break-words font-medium">
										{canonicalSource.provenance.source}
									</dd>
								</div>
							)}
							{canonicalSource.provenance.entryType && (
								<div className="min-w-0">
									<dt className="uppercase tracking-wide text-muted-foreground">
										Entry type
									</dt>
									<dd className="mt-0.5 break-words font-medium capitalize">
										{canonicalSource.provenance.entryType}
									</dd>
								</div>
							)}
							{canonicalSource.sourceFields.rank && (
								<div className="min-w-0">
									<dt className="uppercase tracking-wide text-muted-foreground">
										Rank
									</dt>
									<dd className="mt-0.5 font-medium">
										{canonicalSource.sourceFields.rank}
									</dd>
								</div>
							)}
						</dl>
						<p className="mt-3 border-t border-primary/20 pt-3 text-xs text-muted-foreground">
							Name, maximum HP, base AC, speed, and source abilities are locked
							to this saved snapshot. Current HP, initiative, equipment,
							conditions, and notes remain editable instance state.
						</p>
					</section>
				)}

				{/* Vitals */}
				<AscendantWindow title="VITALS">
					<div className="space-y-4">
						{/* HP Bar */}
						<div className="space-y-2">
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex items-center gap-2">
									<Heart className="w-4 text-destructive" aria-hidden="true" />
									<div>
										<div className="font-mono text-sm">
											Current HP {extra.hp_current} / {hpMax}
										</div>
										{canonicalSource && (
											<div className="text-[10px] uppercase tracking-wide text-muted-foreground">
												Maximum HP is source-locked
											</div>
										)}
									</div>
								</div>
								<div className="grid grid-cols-4 gap-1 sm:flex sm:items-center">
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() => handleAdjustHp(-1)}
										aria-label="Decrement current HP"
									>
										-1
									</Button>
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() => handleAdjustHp(-5)}
										aria-label="Damage current HP by 5"
									>
										-5
									</Button>
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() => handleAdjustHp(5)}
										aria-label="Heal current HP by 5"
									>
										+5
									</Button>
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() => handleAdjustHp(1)}
										aria-label="Increment current HP"
									>
										+1
									</Button>
								</div>
							</div>
							<Progress
								value={hpPercent}
								aria-label={`${extra.name} current hit points`}
								className={cn(
									"h-2",
									hpPercent < 25
										? "bg-destructive/25"
										: hpPercent < 50
											? "bg-gate-s/25"
											: "bg-system-green/25",
								)}
							/>
						</div>

						{/* AC / Speed / Initiative */}
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
							<div className="rounded border border-border/40 bg-black/30 p-3 text-center">
								<div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
									Armor Class
								</div>
								<div className="flex items-center justify-center gap-1">
									<Shield className="w-4 text-shadow-blue" aria-hidden="true" />
									<span className="font-display text-xl font-bold">
										{effectiveAc}
									</span>
								</div>
								{canonicalSource ? (
									<div className="mt-1 text-xs text-muted-foreground">
										Source base {baseAc} · read-only
										{acBonus !== 0 &&
											` · gear ${acBonus >= 0 ? "+" : ""}${acBonus}`}
									</div>
								) : (
									acBonus !== 0 && (
										<div className="mt-1 text-xs text-muted-foreground">
											(base {baseAc})
										</div>
									)
								)}
							</div>
							<div className="rounded border border-border/40 bg-black/30 p-3 text-center">
								<div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
									Speed
								</div>
								<div className="font-display text-xl font-bold">
									{extra.speed ?? 30} ft
								</div>
								{canonicalSource && (
									<div className="mt-1 text-xs text-muted-foreground">
										Source · read-only
									</div>
								)}
							</div>
							<div className="rounded border border-border/40 bg-black/30 p-3 text-center">
								<label
									htmlFor="companion-initiative"
									className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground"
								>
									Initiative
								</label>
								<div className="flex items-center justify-center gap-1">
									<Zap className="w-4 text-gate-s" aria-hidden="true" />
									<Input
										id="companion-initiative"
										type="number"
										value={initiative}
										onChange={(event) => setInitiative(event.target.value)}
										onBlur={handleSaveInit}
										className="h-8 w-20 text-center font-display text-lg"
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
												<Shield
													className="w-3.5 text-shadow-blue"
													aria-hidden="true"
												/>
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
													type="button"
													size="sm"
													variant="ghost"
													className="ml-auto h-7"
													onClick={() => handleRemoveEquipment(index)}
													aria-label={`Remove ${item.name}`}
												>
													<span aria-hidden="true">✕</span>
												</Button>
											</div>
											{(item.attack || item.damage) && (
												<div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
													{item.attack && <span>Attack: {item.attack}</span>}
													{item.damage && <span>Damage: {item.damage}</span>}
												</div>
											)}
											{item.notes && (
												<p className="mt-1 text-xs text-muted-foreground">
													{item.notes}
												</p>
											)}
										</div>
									))}
								</div>
							)}

							{/* Add gear */}
							<div className="grid grid-cols-1 gap-2 border-t border-border/40 pt-3 sm:grid-cols-2">
								<Input
									value={newName}
									onChange={(event) => setNewName(event.target.value)}
									placeholder="Name (required)"
									className="h-8"
									aria-label="Gear name"
								/>
								<Input
									type="number"
									value={newAcBonus}
									onChange={(event) => setNewAcBonus(event.target.value)}
									placeholder="AC bonus"
									className="h-8"
									aria-label="Gear AC bonus"
								/>
								<Input
									value={newAttack}
									onChange={(event) => setNewAttack(event.target.value)}
									placeholder="Attack (optional)"
									className="h-8"
									aria-label="Gear attack"
								/>
								<Input
									value={newDamage}
									onChange={(event) => setNewDamage(event.target.value)}
									placeholder="Damage (optional)"
									className="h-8"
									aria-label="Gear damage"
								/>
								<Input
									value={newNotes}
									onChange={(event) => setNewNotes(event.target.value)}
									placeholder="Notes (optional)"
									className="h-8 sm:col-span-2"
									aria-label="Gear notes"
								/>
								<Button
									type="button"
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
							{canonicalSource && (
								<p className="text-[10px] uppercase tracking-wide text-muted-foreground">
									Source abilities · read-only
								</p>
							)}
							{abilities.length === 0 ? (
								<p className="text-xs text-muted-foreground">
									No actions recorded.
								</p>
							) : (
								abilities.map((ability) => (
									<div
										key={`${ability.name}-${ability.action_type ?? ""}`}
										className="rounded border border-border/40 bg-black/20 p-3"
									>
										<div className="flex items-center gap-2">
											<Sparkles
												className="w-3.5 text-system-green"
												aria-hidden="true"
											/>
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
											<p className="mt-1 text-xs text-muted-foreground">
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
							<div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
								<Input
									value={newCondition}
									onChange={(event) => setNewCondition(event.target.value)}
									placeholder="e.g. Frightened"
									className="h-8"
									aria-label="New condition"
								/>
								<Button
									type="button"
									size="sm"
									onClick={handleAddCondition}
									disabled={!newCondition.trim()}
									aria-label="Add condition"
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
									{conditions.map((condition) => (
										<Button
											key={condition.id}
											type="button"
											variant="outline"
											size="sm"
											className="gap-1 text-xs hover:bg-destructive/10"
											onClick={() => handleRemoveCondition(condition.id)}
											aria-label={`Remove ${condition.name} condition`}
										>
											{condition.name} <span aria-hidden="true">✕</span>
										</Button>
									))}
								</div>
							)}
						</div>
					</AscendantWindow>
				</div>

				{/* Notes */}
				<div className="mt-4">
					<AscendantWindow title="NOTES">
						<label htmlFor="companion-extra-notes" className="sr-only">
							Companion notes
						</label>
						<Textarea
							id="companion-extra-notes"
							value={notes}
							onChange={(event) => setNotes(event.target.value)}
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
