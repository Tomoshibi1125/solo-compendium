/**
 * CharacterCompare — side-by-side view of 2-4 Ascendants.
 *
 * Closes B1 + F7 from the May 2026 remediation plan. The Feb 2026
 * parity audit referenced this page as if it existed; the route had
 * been reserved in `RouteEffects.tsx` but the component and `App.tsx`
 * route entry were missing.
 *
 * Query param: `?ids=<id1>,<id2>[,<id3>][,<id4>]`
 * If the param is absent or empty, the page renders an empty-state
 * with a "Pick Ascendants from the manager" CTA back to /characters.
 */
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, X } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCharacters } from "@/hooks/useCharacters";
import {
	getAbilityModifier,
	getProficiencyBonus,
} from "@/lib/characterCalculations";
import {
	calculateRiftFavorDie,
	calculateRiftFavorMax,
} from "@/lib/levelUpCalculations";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { AbilityScore } from "@/types/core-rules";

const ABILITY_ORDER: AbilityScore[] = [
	"STR",
	"AGI",
	"VIT",
	"INT",
	"SENSE",
	"PRE",
];

interface CompareRowProps {
	label: string;
	values: ReadonlyArray<string | number | null | undefined>;
	keys: ReadonlyArray<string>;
	emphasis?: boolean;
}

function CompareRow({ label, values, keys, emphasis }: CompareRowProps) {
	return (
		<tr className={emphasis ? "font-semibold text-primary/90" : undefined}>
			<th
				scope="row"
				className="text-left text-xs uppercase tracking-wider text-muted-foreground py-2 px-3 whitespace-nowrap"
			>
				{label}
			</th>
			{values.map((value, idx) => (
				<td
					key={`${label}-${keys[idx] ?? idx}`}
					className="text-center text-sm py-2 px-3 border-l border-border/30"
				>
					{value ?? <span className="text-muted-foreground">—</span>}
				</td>
			))}
		</tr>
	);
}

function formatMod(score: number | null | undefined): string {
	if (score == null) return "—";
	const mod = getAbilityModifier(score);
	return mod >= 0 ? `${score} (+${mod})` : `${score} (${mod})`;
}

export default function CharacterCompare() {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	// Q2 of Round 3 — swipe-right-from-edge on mobile navigates back to
	// /characters. Guard: gesture only fires when the touch starts within
	// 24px of the left edge AND coarse-pointer is the primary input.
	const bindSwipeBack = useDrag(
		({
			swipe: [swipeX],
			initial: [startX],
		}: {
			swipe: [number, number];
			initial: [number, number];
		}) => {
			if (swipeX > 0 && startX < 24) {
				navigate("/characters");
			}
		},
		{ axis: "x", filterTaps: true, pointerContext: true },
	);
	const idsParam = searchParams.get("ids") || "";
	const ids = useMemo(
		() =>
			idsParam
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)
				.slice(0, 4),
		[idsParam],
	);

	const { data: characters = [], isLoading } = useCharacters();

	const selected = useMemo(
		() =>
			ids
				.map((id) => characters.find((c) => c.id === id))
				.filter((c): c is NonNullable<typeof c> => c != null),
		[ids, characters],
	);

	const removeId = (id: string) => {
		const remaining = ids.filter((x) => x !== id);
		if (remaining.length === 0) {
			searchParams.delete("ids");
		} else {
			searchParams.set("ids", remaining.join(","));
		}
		setSearchParams(searchParams);
	};

	if (isLoading) {
		return (
			<Layout>
				<div className="container mx-auto py-12 text-center text-muted-foreground">
					Loading Ascendants…
				</div>
			</Layout>
		);
	}

	if (selected.length < 2) {
		return (
			<Layout>
				<div className="container mx-auto py-12">
					<div className="mb-6">
						<Button asChild variant="ghost" size="sm">
							<Link to="/characters" className="gap-2">
								<ArrowLeft className="w-4 h-4" />
								Back to Characters
							</Link>
						</Button>
					</div>
					<AscendantWindow title="Compare Ascendants">
						<div className="text-center py-10 space-y-3">
							<p className="text-muted-foreground">
								Pick 2–4 Ascendants from your roster to compare them
								side-by-side.
							</p>
							<Button asChild>
								<Link to="/characters">Go to Character Manager</Link>
							</Button>
						</div>
					</AscendantWindow>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div
				{...bindSwipeBack()}
				className="container mx-auto py-6 touch-pan-y"
				data-testid="character-compare-root"
			>
				<div className="mb-6 flex items-center justify-between flex-wrap gap-3">
					<div className="flex items-center gap-3">
						<Button asChild variant="ghost" size="sm">
							<Link to="/characters" className="gap-2">
								<ArrowLeft className="w-4 h-4" />
								Back
							</Link>
						</Button>
						<h1 className="font-display text-2xl">
							Compare {selected.length} Ascendants
						</h1>
					</div>
				</div>

				<AscendantWindow title="Side-by-Side Stat Compare">
					<div className="overflow-x-auto">
						<table
							className="w-full text-sm"
							data-testid="character-compare-table"
						>
							<thead>
								<tr>
									<th
										scope="col"
										className="text-left px-3 py-3 text-xs uppercase tracking-wider text-muted-foreground"
									>
										Stat
									</th>
									{selected.map((c) => (
										<th
											key={c.id}
											scope="col"
											className="text-center px-3 py-3 border-l border-border/30"
										>
											<div className="flex flex-col items-center gap-1">
												<div className="font-display text-base">{c.name}</div>
												<Badge variant="outline" className="text-xs">
													{formatRegentVernacular(c.job ?? "—")}
												</Badge>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => removeId(c.id)}
													aria-label={`Remove ${c.name} from comparison`}
													className="text-muted-foreground hover:text-foreground"
												>
													<X className="w-3 h-3" />
												</Button>
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{(() => {
									const keys = selected.map((c) => c.id);
									return (
										<>
											<CompareRow
												label="Level"
												values={selected.map((c) => `L${c.level}`)}
												keys={keys}
												emphasis
											/>
											<CompareRow
												label="Job"
												values={selected.map((c) =>
													formatRegentVernacular(c.job ?? "—"),
												)}
												keys={keys}
											/>
											<CompareRow
												label="Path"
												values={selected.map((c) =>
													formatRegentVernacular(c.path ?? "—"),
												)}
												keys={keys}
											/>
											<CompareRow
												label="Background"
												values={selected.map((c) => c.background ?? "—")}
												keys={keys}
											/>
											<CompareRow
												label="HP"
												values={selected.map((c) =>
													c.hp_current != null && c.hp_max != null
														? `${c.hp_current} / ${c.hp_max}`
														: (c.hp_max ?? "—"),
												)}
												keys={keys}
											/>
											<CompareRow
												label="AC"
												values={selected.map((c) => c.armor_class ?? "—")}
												keys={keys}
											/>
											<CompareRow
												label="Initiative"
												values={selected.map((c) => {
													const agiMod = getAbilityModifier(c.abilities.AGI);
													return agiMod >= 0 ? `+${agiMod}` : `${agiMod}`;
												})}
												keys={keys}
											/>
											<CompareRow
												label="Proficiency"
												values={selected.map((c) => {
													const pb = getProficiencyBonus(c.level);
													return `+${pb}`;
												})}
												keys={keys}
											/>
											<CompareRow
												label="Rift Favor"
												values={selected.map((c) => {
													const max = calculateRiftFavorMax(c.level);
													const die = calculateRiftFavorDie(c.level);
													return `${max} × d${die}`;
												})}
												keys={keys}
											/>
											<CompareRow
												label="Speed"
												values={selected.map((c) =>
													c.speed != null ? `${c.speed} ft` : "—",
												)}
												keys={keys}
											/>
											<tr>
												<th
													colSpan={selected.length + 1}
													className="text-left px-3 pt-5 pb-2 text-xs uppercase tracking-wider text-muted-foreground border-t border-border/30"
												>
													Ability Scores
												</th>
											</tr>
											{ABILITY_ORDER.map((ability) => (
												<CompareRow
													key={ability}
													label={ability}
													values={selected.map((c) =>
														formatMod(c.abilities[ability]),
													)}
													keys={keys}
												/>
											))}
											<tr>
												<th
													colSpan={selected.length + 1}
													className="text-left px-3 pt-5 pb-2 text-xs uppercase tracking-wider text-muted-foreground border-t border-border/30"
												>
													Saving Throws
												</th>
											</tr>
											{ABILITY_ORDER.map((ability) => (
												<CompareRow
													key={`save-${ability}`}
													label={`${ability} Save`}
													values={selected.map((c) => {
														const baseMod = getAbilityModifier(
															c.abilities[ability],
														);
														const profs =
															(c.saving_throw_proficiencies as string[]) || [];
														const isProf = profs.includes(ability);
														const pb = getProficiencyBonus(c.level);
														const total = baseMod + (isProf ? pb : 0);
														const sign = total >= 0 ? "+" : "";
														return `${sign}${total}${isProf ? " ✦" : ""}`;
													})}
													keys={keys}
												/>
											))}
										</>
									);
								})()}
							</tbody>
						</table>
					</div>
				</AscendantWindow>
			</div>
		</Layout>
	);
}
