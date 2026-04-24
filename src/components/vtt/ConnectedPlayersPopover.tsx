import { ExternalLink, MessageCircle, Users } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DynamicStyle } from "@/components/ui/DynamicStyle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ConnectedUser {
	userId: string;
	userName: string;
	role: "warden" | "ascendant";
	color: string;
	characterId?: string | null;
	characterName?: string | null;
	lastSeen?: number;
}

export interface ConnectedPlayersPopoverProps {
	users: ConnectedUser[];
	maxAvatars?: number;
	/** Triggered when the user clicks "whisper" on a connected player. */
	onWhisper?: (user: ConnectedUser) => void;
	campaignId?: string | null;
	className?: string;
}

/**
 * Expandable connected-players list (DDB Maps "Connected Players" parity).
 *
 * The trigger shows an avatar stack; clicking opens a dropdown with every
 * online user, their role, linked character (if any), and shortcuts to
 * whisper them or open their sheet.
 */
export function ConnectedPlayersPopover({
	users,
	maxAvatars = 5,
	onWhisper,
	campaignId,
	className,
}: ConnectedPlayersPopoverProps) {
	const sorted = useMemo(
		() =>
			[...users].sort((a, b) => {
				if (a.role !== b.role) return a.role === "warden" ? -1 : 1;
				return a.userName.localeCompare(b.userName);
			}),
		[users],
	);

	if (sorted.length === 0) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					data-testid="vtt-connected-players"
					className={cn(
						"inline-flex items-center gap-1 rounded-full px-1 py-0.5 hover:bg-muted/40 transition-colors",
						className,
					)}
					aria-label={`${sorted.length} connected players`}
					title={`${sorted.length} connected`}
				>
					<div className="flex -space-x-1.5">
						{sorted.slice(0, maxAvatars).map((u) => (
							<DynamicStyle
								key={u.userId}
								className="vtt-user-avatar w-5 h-5 text-[9px] border border-card"
								vars={{ "--avatar-bg-color": u.color }}
								title={`${u.userName} (${u.role})`}
							>
								{u.userName.charAt(0).toUpperCase()}
							</DynamicStyle>
						))}
					</div>
					{sorted.length > maxAvatars && (
						<span className="text-[10px] font-medium text-foreground/70">
							+{sorted.length - maxAvatars}
						</span>
					)}
					<Users className="w-3 h-3 opacity-50" aria-hidden />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-72">
				<DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-foreground/70">
					Connected players ({sorted.length})
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{sorted.map((u) => (
					<DropdownMenuItem
						key={u.userId}
						className="flex items-center gap-2 py-2"
						onSelect={(e) => e.preventDefault()}
					>
						<DynamicStyle
							className="vtt-user-avatar w-7 h-7 text-xs shrink-0"
							vars={{ "--avatar-bg-color": u.color }}
						>
							{u.userName.charAt(0).toUpperCase()}
						</DynamicStyle>
						<div className="min-w-0 flex-1">
							<div className="text-xs font-semibold truncate">{u.userName}</div>
							<div className="text-[10px] text-foreground/60 capitalize truncate">
								{u.role}
								{u.characterName ? ` · ${u.characterName}` : ""}
							</div>
						</div>
						<div className="flex items-center gap-1 shrink-0">
							{onWhisper && (
								<Button
									variant="ghost"
									size="sm"
									className="h-7 w-7 p-0"
									aria-label={`Whisper ${u.userName}`}
									title="Whisper"
									onClick={() => onWhisper(u)}
								>
									<MessageCircle className="w-3.5 h-3.5" aria-hidden />
								</Button>
							)}
							{u.characterId && campaignId && (
								<Button
									asChild
									variant="ghost"
									size="sm"
									className="h-7 w-7 p-0"
									aria-label={`Open ${u.characterName ?? u.userName}'s sheet`}
								>
									<Link
										to={`/character/${u.characterId}`}
										title="Open character sheet"
									>
										<ExternalLink className="w-3.5 h-3.5" aria-hidden />
									</Link>
								</Button>
							)}
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
