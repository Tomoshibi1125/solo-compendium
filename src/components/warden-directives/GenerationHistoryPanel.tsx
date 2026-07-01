import { Pin, PinOff, Trash2 } from "lucide-react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import type { GenerationHistoryState } from "@/lib/generationHistory";

interface GenerationHistoryPanelProps<T> {
	state: GenerationHistoryState<T>;
	onRestore: (id: string) => void;
	onTogglePin: (id: string) => void;
	onRemove: (id: string) => void;
	title?: string;
	className?: string;
}

/**
 * Shared history list for the Warden generators: restore, pin, and remove
 * past generations. Renders nothing when the history is empty.
 */
export function GenerationHistoryPanel<T>({
	state,
	onRestore,
	onTogglePin,
	onRemove,
	title = "GENERATION HISTORY",
	className,
}: GenerationHistoryPanelProps<T>) {
	if (state.history.length === 0) return null;

	return (
		<AscendantWindow title={title} className={className}>
			<div className="space-y-1">
				{state.history.map((entry) => (
					<div
						key={entry.id}
						className="flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-muted/40 transition-colors"
					>
						<button
							type="button"
							onClick={() => onRestore(entry.id)}
							className="flex-1 min-w-0 text-left"
							title="Restore this generation"
						>
							<span className="font-heading text-sm block truncate">
								{entry.label}
							</span>
							<span className="text-[11px] text-muted-foreground">
								{new Date(entry.createdAt).toLocaleString()}
							</span>
						</button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-7 w-7 shrink-0"
							onClick={() => onTogglePin(entry.id)}
							title={entry.pinned ? "Unpin" : "Pin"}
						>
							{entry.pinned ? (
								<PinOff className="w-3.5 h-3.5 text-primary" />
							) : (
								<Pin className="w-3.5 h-3.5" />
							)}
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-7 w-7 shrink-0"
							onClick={() => onRemove(entry.id)}
							title="Remove from history"
						>
							<Trash2 className="w-3.5 h-3.5" />
						</Button>
					</div>
				))}
			</div>
		</AscendantWindow>
	);
}
