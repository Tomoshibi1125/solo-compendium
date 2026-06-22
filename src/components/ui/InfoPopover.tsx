import * as React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoPopoverProps {
	/** Visual trigger contents (icon / short text / badge contents). */
	children: React.ReactNode;
	/** Info shown on hover (desktop) or tap (touch). */
	content: React.ReactNode;
	side?: "top" | "bottom" | "left" | "right";
	/** Classes for the popover content. */
	className?: string;
	/** Classes for the trigger button. */
	triggerClassName?: string;
	ariaLabel?: string;
}

/**
 * Info bubble that works on BOTH platforms:
 * - Desktop (fine pointer): opens on hover/focus like the previous tooltip.
 * - Touch (coarse pointer): Radix tooltips never open on touch, so the trigger
 *   toggles the controlled open state on tap, and we close on outside tap.
 *
 * Use for tooltips that carry INFORMATION (stat breakdowns, condition effects, skill
 * detail) — the trigger is its own button so it never fights a parent's primary action.
 */
export function InfoPopover({
	children,
	content,
	side = "bottom",
	className,
	triggerClassName,
	ariaLabel = "Show details",
}: InfoPopoverProps) {
	const [open, setOpen] = React.useState(false);

	// Radix Tooltip has no dismiss-on-outside — add it for the tap-opened case.
	React.useEffect(() => {
		if (!open) return;
		const handler = (e: Event) => {
			const t = e.target as Element | null;
			if (
				t?.closest("[data-info-popover-trigger]") ||
				t?.closest("[data-info-popover-content]")
			) {
				return;
			}
			setOpen(false);
		};
		const id = window.setTimeout(
			() => document.addEventListener("pointerdown", handler, true),
			10,
		);
		return () => {
			window.clearTimeout(id);
			document.removeEventListener("pointerdown", handler, true);
		};
	}, [open]);

	return (
		<TooltipProvider delayDuration={150}>
			<Tooltip open={open} onOpenChange={setOpen}>
				<TooltipTrigger asChild>
					<button
						type="button"
						data-info-popover-trigger=""
						aria-label={ariaLabel}
						className={cn("inline-flex items-center", triggerClassName)}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							const coarse =
								typeof window !== "undefined" &&
								window.matchMedia?.("(pointer: coarse)").matches;
							// Touch: tap toggles. Desktop: keep open (hover/leave handles close).
							setOpen((v) => (coarse ? !v : true));
						}}
					>
						{children}
					</button>
				</TooltipTrigger>
				<TooltipContent
					side={side}
					data-info-popover-content=""
					className={cn(
						"max-w-[min(280px,calc(100vw-2rem))] whitespace-normal",
						className,
					)}
				>
					{content}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
