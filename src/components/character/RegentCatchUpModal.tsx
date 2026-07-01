import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Crown, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { regents } from "@/data/compendium/regents";
import { useToast } from "@/hooks/use-toast";
import { useCharacter } from "@/hooks/useCharacters";
import { supabase } from "@/integrations/supabase/client";
import {
	type CanonicalCastableEntry,
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "@/lib/canonicalCompendium";
import { calculateTotalChoices } from "@/lib/choiceCalculations";
import {
	type CanonicalPickEntry,
	persistRegentPowers,
	persistRegentSpells,
	persistRegentTechniques,
} from "@/lib/regentPickPersistence";
import { regentToChoiceSource } from "@/lib/regentProgression";
import type { Regent } from "@/lib/regentTypes";
import { cn } from "@/lib/utils";
import { formatRegentVernacular, REGENT_LABEL } from "@/lib/vernacular";

interface PickOption {
	id: string;
	name: string;
	power_level: number;
	description?: string | null;
}

interface RegentCatchUpModalProps {
	characterId: string;
	regentId: string;
	unlockId: string;
	campaignId?: string;
	open: boolean;
	onComplete: () => void;
}

/**
 * One-time retroactive catch-up. Because Regents are not level-gated, unlocking
 * one mid-game owes the character every Regent pick for tiers 1..currentLevel at
 * once. This picker grants that backlog (cantrips/spells for caster Regents;
 * powers/techniques for martial ones), then stamps `caught_up_at_level` so it
 * never fires again. Per-level increments after this go through the level-up
 * wizard as usual.
 */
export function RegentCatchUpModal({
	characterId,
	regentId,
	unlockId,
	campaignId,
	open,
	onComplete,
}: RegentCatchUpModalProps) {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const { data: character } = useCharacter(characterId);
	const [selected, setSelected] = useState<Record<string, Set<string>>>({
		powers: new Set(),
		techniques: new Set(),
		cantrips: new Set(),
		spells: new Set(),
	});
	const [saving, setSaving] = useState(false);

	const regent = useMemo<Regent | undefined>(
		() => (regents as Regent[]).find((r) => r.id === regentId),
		[regentId],
	);
	const level = character?.level ?? 1;
	const regentName = regent?.name ?? "";

	// Picks owed at the current character level (regent overlay only).
	const owed = useMemo(() => {
		if (!regent) return { powers: 0, techniques: 0, cantrips: 0, spells: 0 };
		const totals = calculateTotalChoices(
			null,
			null,
			[regentToChoiceSource(regent)],
			level,
		);
		return {
			powers: totals.powers ?? 0,
			techniques: totals.techniques ?? 0,
			cantrips: totals.cantrips ?? 0,
			spells: totals.spells ?? 0,
		};
	}, [regent, level]);

	// Options come from the Regent's own grant pool (no jobName → regent-only).
	const { data: powerOpts = [] } = useQuery<CanonicalCastableEntry[]>({
		queryKey: ["regent-catchup-powers", regentName, level, campaignId],
		queryFn: () =>
			listLearnablePowers({
				accessContext: { campaignId },
				characterLevel: level,
				regentNames: [regentName],
			}),
		enabled: open && owed.powers > 0 && !!regentName,
	});

	const { data: techniqueOpts = [] } = useQuery({
		queryKey: ["regent-catchup-techniques", regentName, level, campaignId],
		queryFn: () =>
			listLearnableTechniques({
				accessContext: { campaignId },
				characterLevel: level,
				regentNames: [regentName],
				maxLevel: level,
			}),
		enabled: open && owed.techniques > 0 && !!regentName,
	});

	const { data: spellOpts = [] } = useQuery<CanonicalCastableEntry[]>({
		queryKey: ["regent-catchup-spells", regentName, level, campaignId],
		queryFn: () =>
			listLearnableSpells({
				accessContext: { campaignId },
				characterLevel: level,
				regentNames: [regentName],
			}),
		enabled: open && (owed.cantrips > 0 || owed.spells > 0) && !!regentName,
	});

	const cantripOpts = useMemo(
		() => spellOpts.filter((s) => s.power_level === 0),
		[spellOpts],
	);
	const leveledSpellOpts = useMemo(
		() => spellOpts.filter((s) => s.power_level > 0),
		[spellOpts],
	);

	const toggle = (bucket: string, id: string, limit: number) => {
		setSelected((prev) => {
			const next = new Set(prev[bucket]);
			if (next.has(id)) {
				next.delete(id);
			} else if (next.size < limit) {
				next.add(id);
			}
			return { ...prev, [bucket]: next };
		});
	};

	const buckets: {
		key: string;
		label: string;
		count: number;
		options: PickOption[];
	}[] = [
		{ key: "powers", label: "Powers", count: owed.powers, options: powerOpts },
		{
			key: "techniques",
			label: "Techniques",
			count: owed.techniques,
			options: techniqueOpts as unknown as PickOption[],
		},
		{
			key: "cantrips",
			label: "Cantrips",
			count: owed.cantrips,
			options: cantripOpts,
		},
		{
			key: "spells",
			label: "Spells",
			count: owed.spells,
			options: leveledSpellOpts,
		},
	].filter((b) => b.count > 0);

	const allChosen = buckets.every(
		(b) => selected[b.key].size >= Math.min(b.count, b.options.length),
	);

	const finish = async () => {
		try {
			setSaving(true);
			const pick = (bucket: string, options: PickOption[]) =>
				options.filter((o) =>
					selected[bucket].has(o.id),
				) as unknown as CanonicalPickEntry[];

			const source = `${regentName} Attunement (Catch-Up)`;
			await persistRegentPowers(characterId, pick("powers", powerOpts), source);
			await persistRegentTechniques(
				characterId,
				pick("techniques", techniqueOpts as unknown as PickOption[]),
				source,
			);
			await persistRegentSpells(
				characterId,
				pick("cantrips", cantripOpts),
				source,
			);
			await persistRegentSpells(
				characterId,
				pick("spells", leveledSpellOpts),
				source,
			);

			await supabase
				.from("character_regent_unlocks")
				.update({ caught_up_at_level: level })
				.eq("id", unlockId);

			queryClient.invalidateQueries({
				queryKey: ["regent-unlocks", characterId],
			});
			queryClient.invalidateQueries({ queryKey: ["character", characterId] });
			toast({
				title: `${REGENT_LABEL} Attuned`,
				description: "Your accumulated regent abilities have manifested.",
			});
			onComplete();
		} catch (err) {
			toast({
				title: "Catch-Up Failed",
				description:
					err instanceof Error ? err.message : "Could not grant regent picks.",
				variant: "destructive",
			});
		} finally {
			setSaving(false);
		}
	};

	// Nothing owed (e.g. a Regent with no structured picks): auto-complete once.
	const nothingOwed = open && !!regent && buckets.length === 0;
	useEffect(() => {
		if (!nothingOwed) return;
		let cancelled = false;
		void supabase
			.from("character_regent_unlocks")
			.update({ caught_up_at_level: level })
			.eq("id", unlockId)
			.then(() => {
				if (cancelled) return;
				queryClient.invalidateQueries({
					queryKey: ["regent-unlocks", characterId],
				});
				onComplete();
			});
		return () => {
			cancelled = true;
		};
	}, [nothingOwed, level, unlockId, characterId, queryClient, onComplete]);

	if (nothingOwed) return null;

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onComplete()}>
			<DialogContent className="bg-card border-regent-gold/40 max-w-2xl max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="font-display text-xl gradient-text-regent flex items-center gap-2">
						<Crown className="h-5 w-5" />
						{formatRegentVernacular(regent?.title || regentName)} — Attunement
					</DialogTitle>
					<p className="text-sm text-muted-foreground mt-2">
						Your bond with this {REGENT_LABEL} awakens all its accumulated power
						at once. Choose the abilities you manifest for reaching level{" "}
						{level}.
					</p>
				</DialogHeader>

				<div className="space-y-5 pt-2">
					{buckets.map((bucket) => {
						const limit = Math.min(bucket.count, bucket.options.length);
						const chosen = selected[bucket.key].size;
						return (
							<div key={bucket.key} className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="font-heading text-regent-gold flex items-center gap-2">
										<Sparkles className="h-4 w-4" />
										{bucket.label}
									</span>
									<span className="text-xs text-muted-foreground">
										{chosen} / {limit} chosen
									</span>
								</div>
								<div className="grid grid-cols-1 gap-2">
									{bucket.options.map((opt) => {
										const isSel = selected[bucket.key].has(opt.id);
										return (
											<button
												type="button"
												key={opt.id}
												onClick={() => toggle(bucket.key, opt.id, limit)}
												disabled={!isSel && chosen >= limit}
												className={cn(
													"w-full text-left p-2.5 rounded-lg border transition-all duration-150 flex items-center justify-between gap-3",
													isSel
														? "border-regent-gold bg-regent-gold/10"
														: "border-border hover:border-regent-gold/50 bg-background/50 disabled:opacity-40 disabled:hover:border-border",
												)}
											>
												<div className="min-w-0">
													<div className="font-heading text-sm truncate">
														{opt.name}
													</div>
													{opt.power_level > 0 && (
														<div className="text-[11px] text-muted-foreground">
															Level {opt.power_level}
														</div>
													)}
												</div>
												{isSel && (
													<Check className="h-4 w-4 text-regent-gold shrink-0" />
												)}
											</button>
										);
									})}
									{bucket.options.length === 0 && (
										<p className="text-xs italic text-muted-foreground">
											No eligible options found for this Regent.
										</p>
									)}
								</div>
							</div>
						);
					})}

					<Button
						className="w-full font-display tracking-wider bg-regent-gold hover:bg-regent-gold/80 text-background"
						onClick={finish}
						disabled={!allChosen || saving}
					>
						{saving ? "MANIFESTING..." : "MANIFEST REGENT POWER"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
