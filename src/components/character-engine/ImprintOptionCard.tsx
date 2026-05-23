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
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"text-left p-4 rounded-lg border transition-colors",
				selected
					? "border-primary bg-primary/10"
					: "border-primary/10 bg-background/40 hover:bg-primary/5 disabled:opacity-50",
			)}
		>
			<div className="flex items-center gap-2 flex-wrap">
				<span className="font-heading font-semibold">{title}</span>
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
				<p className="text-xs text-muted-foreground mt-2 line-clamp-2">
					<AutoLinkText text={description} />
				</p>
			)}
			{metadata.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-3">
					{metadata.map((item) => (
						<Badge
							key={`${title}-metadata-${item}`}
							variant="outline"
							className="text-[9px] border-primary/20 bg-black/20"
						>
							{item}
						</Badge>
					))}
				</div>
			)}
			{actionPreview && (
				<div className="mt-2 text-[10px] text-primary/80 font-mono bg-primary/5 border border-primary/10 rounded px-2 py-1">
					{actionPreview}
				</div>
			)}
			{children}
		</button>
	);
}
