import {
	Copy,
	Link as LinkIcon,
	Monitor,
	MoreHorizontal,
	Pause,
	Play,
	Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { VTTSessionState, VTTSessionStatus } from "@/hooks/useVTTSettings";
import { cn } from "@/lib/utils";

export interface SessionControlsMenuProps {
	status: VTTSessionStatus;
	onSetState: (state: VTTSessionState) => void;
	/** Deep link to the current campaign VTT view. */
	mapLink: string;
	/** Invite link for bringing new players into the campaign. */
	inviteLink?: string | null;
	/** URL for the read-only spectator window. */
	spectatorLink?: string | null;
	className?: string;
}

/**
 * Warden-only session controls: Start / Pause / End, plus the copy links
 * and Spectator View launcher. Mirrors the DDB Maps "session controls" area
 * in the bottom-right of the VTT.
 */
export function SessionControlsMenu({
	status,
	onSetState,
	mapLink,
	inviteLink,
	spectatorLink,
	className,
}: SessionControlsMenuProps) {
	const { toast } = useToast();

	const copyLink = async (url: string, label: string) => {
		try {
			await navigator.clipboard.writeText(url);
			toast({
				title: `${label} copied`,
				description: "Link copied to clipboard.",
			});
		} catch {
			toast({
				title: "Couldn't copy link",
				description: "Clipboard access was blocked.",
				variant: "destructive",
			});
		}
	};

	const isStarted = status.state === "started";
	const isPaused = status.state === "paused";
	const isEnded = status.state === "ended";

	return (
		<div
			data-testid="vtt-session-controls"
			className={cn("inline-flex items-center gap-1", className)}
		>
			{isStarted && (
				<Button
					variant="outline"
					size="sm"
					className="h-8 px-2 text-xs"
					onClick={() => onSetState("paused")}
					title="Pause session (players see 'paused' overlay)"
				>
					<Pause className="w-3.5 h-3.5 mr-1" aria-hidden />
					Pause
				</Button>
			)}
			{(isPaused || isEnded) && (
				<Button
					variant="default"
					size="sm"
					className="h-8 px-2 text-xs"
					onClick={() => onSetState("started")}
					title="Resume / start session"
				>
					<Play className="w-3.5 h-3.5 mr-1" aria-hidden />
					{isEnded ? "Start" : "Resume"}
				</Button>
			)}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="h-8 w-8 p-0"
						aria-label="Session controls menu"
					>
						<MoreHorizontal className="w-4 h-4" aria-hidden />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-foreground/70">
						Session
					</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => onSetState("started")}
						disabled={isStarted}
						className="text-xs"
					>
						<Play className="w-3.5 h-3.5 mr-2" aria-hidden />
						Start / Resume session
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onSetState("paused")}
						disabled={isPaused || isEnded}
						className="text-xs"
					>
						<Pause className="w-3.5 h-3.5 mr-2" aria-hidden />
						Pause session
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onSetState("ended")}
						disabled={isEnded}
						className="text-xs"
					>
						<Square className="w-3.5 h-3.5 mr-2" aria-hidden />
						End session
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-foreground/70">
						Share
					</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => copyLink(mapLink, "Map link")}
						className="text-xs"
					>
						<Copy className="w-3.5 h-3.5 mr-2" aria-hidden />
						Copy map link
					</DropdownMenuItem>
					{inviteLink && (
						<DropdownMenuItem
							onClick={() => copyLink(inviteLink, "Invite link")}
							className="text-xs"
						>
							<LinkIcon className="w-3.5 h-3.5 mr-2" aria-hidden />
							Copy invite link
						</DropdownMenuItem>
					)}
					{spectatorLink && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									window.open(
										spectatorLink,
										"vtt-spectator",
										"noopener,noreferrer,width=1200,height=800",
									);
								}}
								className="text-xs"
							>
								<Monitor className="w-3.5 h-3.5 mr-2" aria-hidden />
								Open spectator window
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
