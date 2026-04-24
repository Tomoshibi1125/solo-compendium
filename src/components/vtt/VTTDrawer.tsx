import type { ReactNode } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface VTTDrawerProps {
	side: "left" | "right" | "bottom";
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	children: ReactNode;
	contentClassName?: string;
	testId?: string;
	/** Hide the built-in header (caller renders its own). */
	hideHeader?: boolean;
}

/**
 * Thin wrapper over shadcn `Sheet` that gives VTT drawers a consistent width,
 * header, and scrollable body. Desktop side drawers are ~360px wide; the
 * mobile bottom variant uses ~78vh so the map stays partially visible.
 */
export function VTTDrawer({
	side,
	open,
	onOpenChange,
	title,
	description,
	children,
	contentClassName,
	testId,
	hideHeader,
}: VTTDrawerProps) {
	const widthClasses =
		side === "bottom"
			? "h-[78vh] max-h-[78vh] rounded-t-xl"
			: "w-full sm:max-w-[380px] lg:max-w-[420px]";

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side={side}
				data-testid={
					testId ??
					`vtt-drawer-${side}-${title.toLowerCase().replace(/\s+/g, "-")}`
				}
				className={cn(
					"vtt-drawer flex flex-col gap-0 p-0",
					widthClasses,
					contentClassName,
				)}
			>
				{!hideHeader && (
					<SheetHeader className="px-4 pt-4 pb-2 border-b border-border/40 shrink-0">
						<SheetTitle className="pr-8 text-sm uppercase tracking-widest text-primary">
							{title}
						</SheetTitle>
						{description && (
							<SheetDescription className="text-xs">
								{description}
							</SheetDescription>
						)}
					</SheetHeader>
				)}
				<div
					className={cn(
						"flex-1 overflow-y-auto min-h-0",
						hideHeader ? "pt-10 px-4 pb-4" : "px-4 pt-3 pb-4",
					)}
				>
					{children}
				</div>
			</SheetContent>
		</Sheet>
	);
}
