import { formatDistanceToNow } from "date-fns";
import { Activity, Trash2 } from "lucide-react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import type { ActivityEvent } from "@/lib/activityFeed";
import { cn } from "@/lib/utils";

interface ActivityFeedPanelProps {
	events: ReadonlyArray<ActivityEvent>;
	onRemove?: (id: string) => void;
	onClear?: () => void;
	/** Restore / re-open an event (e.g. re-load a generated record). */
	onSelect?: (event: ActivityEvent) => void;
	title?: string;
	emptyLabel?: string;
	className?: string;
}

/**
 * Shared, presentational activity feed — a timestamped list of notable events
 * (generated / exported / published / joined …). Pairs with
 * {@link "@/hooks/useActivityFeed"}.
 */
export function ActivityFeedPanel({
	events,
	onRemove,
	onClear,
	onSelect,
	title = "ACTIVITY",
	emptyLabel = "No activity yet.",
	className,
}: ActivityFeedPanelProps) {
	return (
		<AscendantWindow title={title} className={className}>
			{onClear && events.length > 0 && (
				<div className="flex justify-end mb-2">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-7 gap-1.5 text-[11px]"
						onClick={onClear}
					>
						<Trash2 className="w-3.5 h-3.5" />
						Clear
					</Button>
				</div>
			)}
			{events.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
					<Activity className="w-8 h-8 mb-2 opacity-50" />
					<p className="text-sm">{emptyLabel}</p>
				</div>
			) : (
				<div className="space-y-1">
					{events.map((event) => (
						<div
							key={event.id}
							className="flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-muted/40 transition-colors"
						>
							<button
								type="button"
								onClick={() => onSelect?.(event)}
								disabled={!onSelect}
								className={cn(
									"flex-1 min-w-0 text-left",
									onSelect && "cursor-pointer",
								)}
							>
								<span className="font-heading text-sm block truncate">
									{event.label}
								</span>
								<span className="text-[11px] text-muted-foreground">
									{event.category ? `${event.category} · ` : ""}
									{formatDistanceToNow(new Date(event.at), { addSuffix: true })}
								</span>
							</button>
							{onRemove && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="h-7 w-7 shrink-0"
									onClick={() => onRemove(event.id)}
									title="Remove from activity"
								>
									<Trash2 className="w-3.5 h-3.5" />
								</Button>
							)}
						</div>
					))}
				</div>
			)}
		</AscendantWindow>
	);
}
