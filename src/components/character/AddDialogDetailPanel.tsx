import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { DetailMetaFooter } from "@/components/compendium/DetailMetaFooter";
import {
	getEffectLines,
	getLimitationLines,
} from "@/components/compendium/detailFormatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";

/** A labelled scalar stat rendered in the expanded detail grid. */
export interface DetailStat {
	label: string;
	value: string | number | null | undefined;
}

interface AddDialogDetailPanelProps {
	/** Compact stat pairs surfaced as a grid (damage, AC, weight, range, …). */
	stats?: DetailStat[];
	/** 5e property tags / trait labels (weapon properties, active veins, …). */
	properties?: string[];
	/** Full descriptive prose. */
	description?: string | null;
	/** Structured `effects` blob — rendered via the shared formatter. */
	effects?: unknown;
	/** Structured `limitations` blob — rendered via the shared formatter. */
	limitations?: unknown;
	/** Universal metadata surfaced through the shared footer. */
	flavor?: string | null;
	lore?: string | { history?: string } | null;
	discoveryLore?: string | null;
	tags?: string[] | null;
	sourceBook?: string | null;
	/** Extra category-specific rows forwarded to the shared footer. */
	extra?: Array<{ label: string; value: unknown }>;
}

const compactStats = (stats?: DetailStat[]): DetailStat[] =>
	(stats ?? []).filter(
		(stat) =>
			stat.value !== null &&
			stat.value !== undefined &&
			String(stat.value).trim().length > 0,
	);

/**
 * Shared "row → full canonical detail" disclosure used by the character-sheet
 * add dialogs. Reuses the compendium detail formatters (`getEffectLines`,
 * `getLimitationLines`) and the shared `DetailMetaFooter` so an expanded row
 * shows the SAME canonical fields as the Compendium detail pages, rather than
 * hand-rolling a second set of formatters.
 */
export function AddDialogDetailPanel({
	stats,
	properties,
	description,
	effects,
	limitations,
	flavor,
	lore,
	discoveryLore,
	tags,
	sourceBook,
	extra,
}: AddDialogDetailPanelProps) {
	const [open, setOpen] = useState(false);
	const panelId = useId();

	const statList = compactStats(stats);
	const propertyList = (properties ?? []).filter((prop): prop is string =>
		Boolean(prop?.trim()),
	);
	const effectLines = getEffectLines(effects);
	const limitationLines = getLimitationLines(limitations);

	const hasDetail =
		statList.length > 0 ||
		propertyList.length > 0 ||
		Boolean(description?.trim()) ||
		effectLines.length > 0 ||
		limitationLines.length > 0 ||
		Boolean(flavor?.trim()) ||
		Boolean((typeof lore === "string" ? lore : lore?.history)?.trim()) ||
		Boolean(discoveryLore?.trim()) ||
		(tags ?? []).length > 0 ||
		Boolean(sourceBook?.trim()) ||
		(extra ?? []).some((row) => row.value != null && row.value !== "");

	if (!hasDetail) return null;

	return (
		<div className="mt-1">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				aria-expanded={open}
				aria-controls={panelId}
				className="inline-flex items-center gap-1 text-[11px] font-medium text-primary/80 hover:text-primary transition-colors min-h-[24px]"
			>
				{open ? "Hide details" : "Show details"}
				<ChevronDown
					className={cn("w-3 h-3 transition-transform", open && "rotate-180")}
				/>
			</button>

			{open && (
				<div
					id={panelId}
					className="mt-2 space-y-3 rounded-md border border-border/60 bg-background/40 p-3"
				>
					{statList.length > 0 && (
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
							{statList.map((stat) => (
								<div key={stat.label}>
									<span className="text-muted-foreground">{stat.label}: </span>
									<span className="font-medium">
										{formatRegentVernacular(String(stat.value))}
									</span>
								</div>
							))}
						</div>
					)}

					{propertyList.length > 0 && (
						<div className="space-y-1">
							<p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
								Properties
							</p>
							<div className="flex flex-wrap gap-1.5">
								{propertyList.map((prop) => (
									<Badge
										key={prop}
										variant="outline"
										className="text-[11px] capitalize"
									>
										{formatRegentVernacular(prop)}
									</Badge>
								))}
							</div>
						</div>
					)}

					{effectLines.length > 0 && (
						<div className="space-y-1">
							<p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
								Effects
							</p>
							<ul className="space-y-1 text-xs">
								{effectLines.map((line) => (
									<li key={`${line.label}:${line.text}`}>
										<span className="text-muted-foreground">
											{line.label}:{" "}
										</span>
										<AutoLinkText text={line.text} />
									</li>
								))}
							</ul>
						</div>
					)}

					{limitationLines.length > 0 && (
						<div className="space-y-1">
							<p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
								Limitations
							</p>
							<ul className="space-y-1 text-xs">
								{limitationLines.map((line) => (
									<li key={`${line.label}:${line.text}`}>
										<span className="text-muted-foreground">
											{line.label}:{" "}
										</span>
										{formatRegentVernacular(line.text)}
									</li>
								))}
							</ul>
						</div>
					)}

					{description?.trim() && (
						<p className="text-sm leading-relaxed text-muted-foreground">
							<AutoLinkText text={formatRegentVernacular(description)} />
						</p>
					)}

					<DetailMetaFooter
						flavor={flavor}
						lore={lore}
						discoveryLore={discoveryLore}
						tags={tags}
						sourceBook={sourceBook}
						extra={extra}
					/>
				</div>
			)}
		</div>
	);
}
