import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AscendantText, RiftHeading } from "./AscendantText";

interface PageHeaderProps {
	title: ReactNode;
	/** Short strapline rendered under the title. */
	description?: ReactNode;
	/** Left slot before the title column (brand mark, icon tile). */
	leading?: ReactNode;
	/** Right-aligned slot for page-level actions (buttons, filters). */
	actions?: ReactNode;
	/** RiftHeading color variant; zone accent chrome applies regardless. */
	variant?: "rift" | "sovereign" | "gate" | "shadow";
	className?: string;
	children?: ReactNode;
}

/**
 * Standard page header: `.ra-page-header` chrome (zone-accented gradient,
 * angled corners, animated scan line — see ra-theme.css) wrapping a
 * RiftHeading + optional description and actions. Use on every top-level
 * page so headers stay visually uniform across zones.
 */
export function PageHeader({
	title,
	description,
	leading,
	actions,
	variant = "sovereign",
	className,
	children,
}: PageHeaderProps) {
	return (
		<header className={cn("ra-page-header", className)}>
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="flex min-w-0 items-center gap-4">
					{leading && <div className="shrink-0">{leading}</div>}
					<div className="min-w-0">
						<RiftHeading level={1} variant={variant} dimensional>
							{title}
						</RiftHeading>
						{typeof description === "string" ? (
							<AscendantText className="block text-sm text-muted-foreground mt-1">
								{description}
							</AscendantText>
						) : (
							description
						)}
					</div>
				</div>
				{actions && (
					<div className="flex items-center gap-2 shrink-0">{actions}</div>
				)}
			</div>
			{children}
		</header>
	);
}
