import { Check } from "lucide-react";
import type React from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ImprintOptionBadge {
	label: string;
	variant?: "default" | "secondary" | "destructive" | "outline";
}

interface ImprintOptionCardProps {
	title: string;
	description?: string | null;
	badges?: ImprintOptionBadge[];
	metadata?: string[];
	actionPreview?: string;
	selected: boolean;
	disabled?: boolean;
	testId?: string;
	onClick: () => void;
	children?: React.ReactNode;
}

/**
 * The canonical selectable option card for character creation and level-up.
 * Selection state is made unmistakable (ring + check + tinted surface) and the
 * full compendium description is shown via {@link ExpandableText} (no clamped
 * snippets) so the choice is informed — see the "selection clarity" standard.
 */
export function ImprintOptionCard({
	title,
	description,
	badges = [],
	metadata = [],
	actionPreview,
	selected,
	disabled = false,
	testId,
	onClick,
	children,
}: ImprintOptionCardProps) {
	return (
		<button
			type="button"
			data-testid={testId}
			data-selected={selected ? "true" : "false"}
			aria-pressed={selected}
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"relative text-left p-4 rounded-lg border transition-all",
				selected
					? "border-primary bg-primary/15 ring-2 ring-primary/60 shadow-[0_0_18px_hsl(var(--primary)/0.22)]"
					: "border-primary/15 bg-background/40 hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50",
			)}
		>
			{selected && (
				<span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
					<Check className="h-3.5 w-3.5" />
				</span>
			)}
			<div className="flex items-center gap-2 flex-wrap pr-6">
				<span
					className={cn(
						"font-heading font-semibold",
						selected && "text-primary",
					)}
				>
					{title}
				</span>
				{badges.map((badge) => (
					<Badge
						key={`${badge.label}-${badge.variant ?? "default"}`}
						variant={badge.variant ?? "secondary"}
						className="text-xs"
					>
						{badge.label}
					</Badge>
				))}
			</div>
			{description && (
				<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
					<AutoLinkText text={description} />
				</p>
			)}
			{metadata.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-3">
					{metadata.map((item) => (
						<Badge
							key={`${title}-metadata-${item}`}
							variant="outline"
							className="text-[11px] border-primary/20 bg-black/20"
						>
							{item}
						</Badge>
					))}
				</div>
			)}
			{actionPreview && (
				<div className="mt-2 text-xs text-primary/80 font-mono bg-primary/5 border border-primary/10 rounded px-2 py-1">
					{actionPreview}
				</div>
			)}
			{children}
		</button>
	);
}
