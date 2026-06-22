import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
	children: React.ReactNode;
	/** Lines to show when collapsed (default 3). */
	lines?: 1 | 2 | 3 | 4 | 5 | 6;
	/** Classes for the content (text size/color). */
	className?: string;
	/** Wrapper classes. */
	wrapperClassName?: string;
}

const CLAMP: Record<number, string> = {
	1: "line-clamp-1",
	2: "line-clamp-2",
	3: "line-clamp-3",
	4: "line-clamp-4",
	5: "line-clamp-5",
	6: "line-clamp-6",
};

/**
 * Shows content clamped to `lines`, with an inline "Show more / Show less" toggle
 * that reveals the FULL text in place (no overlay/drawer). The toggle only appears
 * when the content actually overflows the clamp. Identical on mobile and desktop, so
 * the PC view is unchanged aside from the (unobtrusive) toggle when text is long.
 */
export function ExpandableText({
	children,
	lines = 3,
	className,
	wrapperClassName,
}: ExpandableTextProps) {
	const [expanded, setExpanded] = React.useState(false);
	const [overflowing, setOverflowing] = React.useState(false);
	const ref = React.useRef<HTMLDivElement>(null);

	React.useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;
		const check = () => {
			// When collapsed (clamped), scrollHeight exceeds clientHeight if clipped.
			setOverflowing(el.scrollHeight - el.clientHeight > 2);
		};
		check();
		const ro = new ResizeObserver(check);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	return (
		<div className={wrapperClassName}>
			<div ref={ref} className={cn(className, !expanded && CLAMP[lines])}>
				{children}
			</div>
			{(overflowing || expanded) && (
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setExpanded((v) => !v);
					}}
					aria-expanded={expanded}
					className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary/80 hover:text-primary transition-colors min-h-[24px]"
				>
					{expanded ? "Show less" : "Show more"}
					<ChevronDown
						className={cn(
							"w-3 h-3 transition-transform",
							expanded && "rotate-180",
						)}
					/>
				</button>
			)}
		</div>
	);
}
