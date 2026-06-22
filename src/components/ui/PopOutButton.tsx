import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePopOut } from "@/hooks/usePopOut";
import { cn } from "@/lib/utils";

/**
 * Misty Pearl B2 — Pop-Out button.
 *
 * Tiny inline button placed in panel headers (Initiative, Chat,
 * Journal) that opens the same panel as a separate browser window for
 * multi-monitor Wardens. State stays in sync automatically because all
 * panels are backed by Supabase realtime + TanStack Query.
 */
export interface PopOutButtonProps {
	name: string;
	path: string;
	width?: number;
	height?: number;
	label?: string;
	className?: string;
	"data-testid"?: string;
}

export function PopOutButton({
	name,
	path,
	width,
	height,
	label = "Pop out",
	className,
	"data-testid": testId,
}: PopOutButtonProps) {
	const { open } = usePopOut({ name, path, width, height });
	return (
		<Button
			type="button"
			variant="ghost"
			size="sm"
			onClick={open}
			className={cn("h-7 px-2 text-xs", className)}
			aria-label={label}
			title={label}
			data-testid={testId ?? "popout-button"}
		>
			<ExternalLink className="h-3.5 w-3.5" />
		</Button>
	);
}
