import {
	ArrowDown,
	ArrowUp,
	FileJson,
	FileText,
	GripVertical,
	Plus,
	Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/useDebounce";
import { useCampaignToolState } from "@/hooks/useToolState";
import { downloadJson, downloadMarkdown } from "@/lib/toolExport";
import "@/styles/book-print.css";

const BEAT_TYPES = [
	{ value: "hook", label: "Hook" },
	{ value: "scene", label: "Scene" },
	{ value: "encounter", label: "Encounter" },
	{ value: "rift", label: "Rift" },
	{ value: "reward", label: "Reward" },
	{ value: "transition", label: "Transition" },
] as const;

type BeatType = (typeof BEAT_TYPES)[number]["value"];

const labelFor = (type: BeatType) =>
	BEAT_TYPES.find((t) => t.value === type)?.label ?? type;

const BEAT_BADGE: Record<BeatType, string> = {
	hook: "text-mana-cyan border-mana-cyan/40",
	scene: "text-primary border-primary/40",
	encounter: "text-red-400 border-red-400/40",
	rift: "text-resurge-violet border-resurge-violet/40",
	reward: "text-gate-s border-gate-s/40",
	transition: "text-muted-foreground border-border",
};

interface SessionBeat {
	id: string;
	title: string;
	type: BeatType;
	notes: string;
	/** Free-form canon references (NPCs / encounters / rifts), comma/line separated. */
	links: string;
}

interface SessionPlan {
	title: string;
	summary: string;
	beats: SessionBeat[];
}

const emptyPlan = (): SessionPlan => ({ title: "", summary: "", beats: [] });
const makeBeatId = () =>
	`beat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const splitRefs = (value: string) =>
	value
		.split(/[,\n]/)
		.map((s) => s.trim())
		.filter(Boolean);

interface SessionPlannerBoardProps {
	campaignId: string;
}

/**
 * A real session planner: an ordered timeline of beats (hook/scene/encounter/
 * rift/reward/transition), each with canon-linked notes + references, persisted
 * per campaign (shared) via {@link useCampaignToolState} and exportable to md/json.
 */
export function SessionPlannerBoard({ campaignId }: SessionPlannerBoardProps) {
	const {
		state: stored,
		isLoading,
		saveNow,
	} = useCampaignToolState<SessionPlan>(campaignId, "session_planner_board", {
		initialState: emptyPlan(),
		storageKey: `solo-compendium.warden.session-planner.${campaignId}`,
	});

	const [plan, setPlan] = useState<SessionPlan>(emptyPlan());
	const hydratedRef = useRef<string | null>(null);

	useEffect(() => {
		if (isLoading) return;
		if (hydratedRef.current === campaignId) return;
		setPlan({
			title: stored.title ?? "",
			summary: stored.summary ?? "",
			beats: Array.isArray(stored.beats) ? stored.beats : [],
		});
		hydratedRef.current = campaignId;
	}, [isLoading, stored, campaignId]);

	const debounced = useDebounce(plan, 600);
	useEffect(() => {
		if (isLoading || hydratedRef.current !== campaignId) return;
		void saveNow(debounced);
	}, [debounced, isLoading, saveNow, campaignId]);

	const addBeat = () =>
		setPlan((prev) => ({
			...prev,
			beats: [
				...prev.beats,
				{ id: makeBeatId(), title: "", type: "scene", notes: "", links: "" },
			],
		}));

	const updateBeat = (id: string, patch: Partial<SessionBeat>) =>
		setPlan((prev) => ({
			...prev,
			beats: prev.beats.map((b) => (b.id === id ? { ...b, ...patch } : b)),
		}));

	const removeBeat = (id: string) =>
		setPlan((prev) => ({
			...prev,
			beats: prev.beats.filter((b) => b.id !== id),
		}));

	const moveBeat = (index: number, dir: -1 | 1) =>
		setPlan((prev) => {
			const next = [...prev.beats];
			const target = index + dir;
			if (target < 0 || target >= next.length) return prev;
			[next[index], next[target]] = [next[target], next[index]];
			return { ...prev, beats: next };
		});

	const planToMarkdown = () => {
		const lines: string[] = [`# ${plan.title || "Session Plan"}`];
		if (plan.summary.trim()) lines.push("", plan.summary.trim());
		plan.beats.forEach((b, i) => {
			lines.push(
				"",
				`## ${i + 1}. ${b.title || "Untitled beat"} (${labelFor(b.type)})`,
			);
			if (b.notes.trim()) lines.push(b.notes.trim());
			const refs = splitRefs(b.links);
			if (refs.length) lines.push(`**Linked:** ${refs.join(", ")}`);
		});
		return lines.join("\n");
	};

	const exportPlan = (format: "md" | "json") => {
		const base = `session-plan-${plan.title || "untitled"}`;
		if (format === "md") downloadMarkdown(base, planToMarkdown());
		else downloadJson(base, plan);
	};

	return (
		<AscendantWindow title="SESSION PLAN" className="book-print-root">
			<div className="space-y-5">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
					<div className="space-y-2">
						<Label htmlFor="session-plan-title">Session Title</Label>
						<Input
							id="session-plan-title"
							value={plan.title}
							placeholder="e.g. Descent into the Harbor Threshold"
							onChange={(e) =>
								setPlan((prev) => ({ ...prev, title: e.target.value }))
							}
						/>
					</div>
					<div className="flex items-end gap-2">
						<Button
							variant="outline"
							size="sm"
							className="gap-1"
							onClick={() => exportPlan("md")}
							disabled={plan.beats.length === 0}
						>
							<FileText className="h-4 w-4" /> Markdown
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="gap-1"
							onClick={() => exportPlan("json")}
							disabled={plan.beats.length === 0}
						>
							<FileJson className="h-4 w-4" /> JSON
						</Button>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="session-plan-summary">Premise / Summary</Label>
					<Textarea
						id="session-plan-summary"
						value={plan.summary}
						placeholder="What this session is about, the table's current goal, the stakes..."
						rows={2}
						onChange={(e) =>
							setPlan((prev) => ({ ...prev, summary: e.target.value }))
						}
					/>
				</div>

				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-heading font-semibold uppercase tracking-wide text-primary/80">
							Timeline ({plan.beats.length})
						</h3>
						<Button size="sm" className="gap-1" onClick={addBeat}>
							<Plus className="h-4 w-4" /> Add Beat
						</Button>
					</div>

					{plan.beats.length === 0 ? (
						<p className="rounded-lg border border-dashed border-primary/20 bg-black/20 p-4 text-sm text-muted-foreground">
							No beats yet. Add hooks, scenes, encounters, rifts and rewards to
							build the session's flow. Notes auto-link canon entries.
						</p>
					) : (
						<ol className="space-y-3">
							{plan.beats.map((beat, index) => (
								<li
									key={beat.id}
									className="rounded-lg border border-primary/15 bg-black/20 p-4"
								>
									<div className="flex flex-wrap items-center gap-2">
										<span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
											{index + 1}
										</span>
										<Input
											value={beat.title}
											placeholder="Beat title"
											className="h-9 flex-1 min-w-[12rem]"
											onChange={(e) =>
												updateBeat(beat.id, { title: e.target.value })
											}
										/>
										<Select
											value={beat.type}
											onValueChange={(v: BeatType) =>
												updateBeat(beat.id, { type: v })
											}
										>
											<SelectTrigger className="h-9 w-36">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{BEAT_TYPES.map((t) => (
													<SelectItem key={t.value} value={t.value}>
														{t.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground"
												onClick={() => moveBeat(index, -1)}
												disabled={index === 0}
												aria-label="Move beat up"
											>
												<ArrowUp className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground"
												onClick={() => moveBeat(index, 1)}
												disabled={index === plan.beats.length - 1}
												aria-label="Move beat down"
											>
												<ArrowDown className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground hover:text-destructive"
												onClick={() => removeBeat(beat.id)}
												aria-label="Remove beat"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>

									<div className="mt-3 grid grid-cols-1 gap-3">
										<Textarea
											value={beat.notes}
											placeholder="What happens, GM cues, read-aloud... (canon names auto-link)"
											rows={2}
											className="text-sm"
											onChange={(e) =>
												updateBeat(beat.id, { notes: e.target.value })
											}
										/>
										<div className="space-y-1">
											<Label className="flex items-center gap-1 text-xs text-muted-foreground">
												<GripVertical className="h-3 w-3" /> Linked NPCs /
												encounters / rifts
											</Label>
											<Input
												value={beat.links}
												placeholder="Comma-separated, e.g. Old Man Crane, Harbor Mouth, Wraith pack"
												className="h-9 text-sm"
												onChange={(e) =>
													updateBeat(beat.id, { links: e.target.value })
												}
											/>
											{splitRefs(beat.links).length > 0 && (
												<div className="flex flex-wrap gap-1 pt-1">
													{splitRefs(beat.links).map((ref) => (
														<Badge
															key={`${beat.id}-${ref}`}
															variant="outline"
															className={`text-[11px] ${BEAT_BADGE[beat.type]}`}
														>
															<AutoLinkText text={ref} />
														</Badge>
													))}
												</div>
											)}
										</div>
										{beat.notes.trim() && (
											<div className="rounded-md border border-border/40 bg-muted/20 p-2 text-sm text-muted-foreground">
												<AutoLinkText text={beat.notes} />
											</div>
										)}
									</div>
								</li>
							))}
						</ol>
					)}
				</div>
			</div>
		</AscendantWindow>
	);
}
