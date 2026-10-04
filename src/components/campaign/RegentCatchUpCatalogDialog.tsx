/**
 * @deprecated This component is no longer used. Regent catch-up no longer requires warden approval.
 * Players now select abilities directly from the canonical catalog just like job/path progression.
 * See: docs/deprecated/regent-catch-up-curation.md
 *
 * This file can be removed in a future cleanup pass.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
	listCanonicalEntries,
	listCanonicalPowers,
	listCanonicalSpells,
} from "@/lib/canonicalCompendium";
import { calculateTotalChoices } from "@/lib/choiceCalculations";
import {
	listRegentCuratedOptions,
	type RegentCatchUpKind,
	setRegentCuratedOptions,
} from "@/lib/regentCatchUpCatalog";
import { regentToChoiceSource } from "@/lib/regentProgression";
import type { Regent } from "@/lib/regentTypes";

interface CatalogEntry {
	kind: RegentCatchUpKind;
	id: string;
	name: string;
	tier: number;
	description: string;
}

const labels: Record<RegentCatchUpKind, string> = {
	powers: "Powers",
	techniques: "Techniques",
	cantrips: "Cantrips",
	spells: "Spells",
};
const order: RegentCatchUpKind[] = [
	"powers",
	"techniques",
	"cantrips",
	"spells",
];
const keyOf = (entry: { kind: RegentCatchUpKind; id: string }) =>
	`${entry.kind}:${entry.id}`;

export function RegentCatchUpCatalogDialog({
	open,
	onOpenChange,
	unlockId,
	campaignId,
	characterLevel,
	regent,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	unlockId: string;
	campaignId: string;
	characterLevel: number;
	regent: Regent;
}) {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [search, setSearch] = useState("");
	const [saving, setSaving] = useState(false);
	const owed = useMemo(
		() =>
			calculateTotalChoices(
				null,
				null,
				[regentToChoiceSource(regent)],
				characterLevel,
			),
		[regent, characterLevel],
	);
	const required: Record<RegentCatchUpKind, number> = {
		powers: owed.powers ?? 0,
		techniques: owed.techniques ?? 0,
		cantrips: owed.cantrips ?? 0,
		spells: owed.spells ?? 0,
	};
	const maxSpellTier = Object.entries(
		regent.spellcasting?.spell_slots ?? {},
	).reduce(
		(max, [ordinal, counts]) =>
			Array.isArray(counts) && Number(counts[characterLevel - 1]) > 0
				? Math.max(max, Number.parseInt(ordinal, 10))
				: max,
		0,
	);

	const catalogQuery = useQuery({
		queryKey: [
			"regent-curation-canonical",
			campaignId,
			regent.id,
			characterLevel,
		],
		enabled: open,
		queryFn: async (): Promise<CatalogEntry[]> => {
			const [powers, techniques, spells] = await Promise.all([
				listCanonicalPowers(undefined, { campaignId }),
				listCanonicalEntries("techniques", undefined, { campaignId }),
				listCanonicalSpells(undefined, { campaignId }),
			]);
			return [
				...powers
					.filter((entry) => entry.power_level >= 5)
					.map((entry) => ({
						kind: "powers" as const,
						id: entry.id,
						name: entry.name,
						tier: entry.power_level,
						description: entry.description ?? "",
					})),
				...techniques
					.filter((entry) => (entry.level_requirement ?? entry.level ?? 0) >= 5)
					.map((entry) => ({
						kind: "techniques" as const,
						id: entry.id,
						name: entry.name,
						tier: entry.level_requirement ?? entry.level ?? 0,
						description: entry.description ?? "",
					})),
				...spells
					.filter(
						(entry) =>
							entry.power_level <= maxSpellTier || entry.power_level === 0,
					)
					.map((entry) => ({
						kind:
							entry.power_level === 0
								? ("cantrips" as const)
								: ("spells" as const),
						id: entry.id,
						name: entry.name,
						tier: entry.power_level,
						description: entry.description ?? "",
					})),
			];
		},
	});
	const savedQuery = useQuery({
		queryKey: ["regent-curated-options", unlockId],
		enabled: open,
		queryFn: () => listRegentCuratedOptions(unlockId),
	});
	useEffect(() => {
		if (savedQuery.data) setSelected(new Set(savedQuery.data.map(keyOf)));
	}, [savedQuery.data]);
	const catalog = catalogQuery.data ?? [];
	const byKey = useMemo(
		() => new Map(catalog.map((entry) => [keyOf(entry), entry])),
		[catalog],
	);
	const counts = Object.fromEntries(
		order.map((kind) => [
			kind,
			[...selected].filter((key) => key.startsWith(`${kind}:`)).length,
		]),
	) as Record<RegentCatchUpKind, number>;
	const ready = order.every((kind) => counts[kind] >= required[kind]);
	const words = new Set(
		[regent.name, regent.theme, ...(regent.tags ?? [])]
			.flatMap((value) => (value ?? "").toLowerCase().split(/[^a-z]+/))
			.filter(
				(value) =>
					value.length >= 4 &&
					!["regent", "ascendant", "class", "overlay"].includes(value),
			),
	);
	const relevant = (entry: CatalogEntry) =>
		[...words].some((word) =>
			`${entry.name} ${entry.description}`.toLowerCase().includes(word),
		);

	const save = async () => {
		if (!ready || saving) return;
		try {
			setSaving(true);
			const options = [...selected]
				.map((key) => byKey.get(key))
				.filter((entry): entry is CatalogEntry => !!entry)
				.map(({ kind, id }) => ({ kind, id }));
			if (options.length !== selected.size)
				throw new Error(
					"A previously approved option is no longer available in this campaign's canonical catalog.",
				);
			await setRegentCuratedOptions({ unlockId, campaignId, options });
			await queryClient.invalidateQueries({
				queryKey: ["regent-curated-options", unlockId],
			});
			toast({
				title: "Regent choices approved",
				description: `${options.length} canonical choices are available for attunement.`,
			});
			onOpenChange(false);
		} catch (error) {
			toast({
				title: "Could not approve choices",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Curate {regent.name} attunement</DialogTitle>
					<DialogDescription>
						Approve canonical choices that fit this Rank-S Regent's domain.
						Powers and techniques are tier 5 or higher; the Regent overlay
						grants access independent of the base Job. Select at least the full
						owed count in each group. Players can choose only from this approved
						list.
					</DialogDescription>
				</DialogHeader>
				<Input
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder="Search canonical abilities"
					aria-label="Search Regent choices"
				/>
				{catalogQuery.error || savedQuery.error ? (
					<p className="text-sm text-destructive">
						{String(catalogQuery.error ?? savedQuery.error)}
					</p>
				) : null}
				<div className="space-y-5">
					{order
						.filter((kind) => required[kind] > 0)
						.map((kind) => {
							const entries = catalog
								.filter(
									(entry) =>
										entry.kind === kind &&
										(!search ||
											`${entry.name} ${entry.description}`
												.toLowerCase()
												.includes(search.toLowerCase())),
								)
								.sort(
									(a, b) =>
										Number(relevant(b)) - Number(relevant(a)) ||
										a.tier - b.tier ||
										a.name.localeCompare(b.name),
								);
							return (
								<section key={kind} className="space-y-2">
									<h3 className="font-semibold">
										{labels[kind]} · {counts[kind]} approved / {required[kind]}{" "}
										required
									</h3>
									<div className="max-h-48 overflow-y-auto rounded border p-2 space-y-1">
										{entries.length === 0 ? (
											<p className="text-sm text-muted-foreground">
												No canonical choices match.
											</p>
										) : (
											entries.map((entry) => (
												<label
													key={keyOf(entry)}
													className="flex items-start gap-2 rounded p-2 hover:bg-muted/40 cursor-pointer"
												>
													<input
														type="checkbox"
														checked={selected.has(keyOf(entry))}
														onChange={() =>
															setSelected((previous) => {
																const next = new Set(previous);
																const key = keyOf(entry);
																if (next.has(key)) next.delete(key);
																else next.add(key);
																return next;
															})
														}
													/>
													<span className="text-sm">
														<strong>{entry.name}</strong> · Tier {entry.tier}
														{relevant(entry) ? " · Domain match" : ""}
														<span className="block text-xs text-muted-foreground line-clamp-2">
															{entry.description}
														</span>
													</span>
												</label>
											))
										)}
									</div>
								</section>
							);
						})}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={save}
						disabled={
							!ready || saving || catalogQuery.isLoading || savedQuery.isLoading
						}
					>
						{saving ? "Saving..." : "Approve choices"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
