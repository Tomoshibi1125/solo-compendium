import {
	Check,
	Eye,
	EyeOff,
	Lock,
	LockOpen,
	Palette,
	Pencil,
	Trash2,
	UserCircle2,
	Users as UsersIcon,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DynamicStyle } from "@/components/ui/DynamicStyle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { VTTTokenInstance } from "@/types/vtt";

export const TOKEN_BORDER_PALETTE = [
	null,
	"#ef4444",
	"#f97316",
	"#eab308",
	"#84cc16",
	"#22c55e",
	"#14b8a6",
	"#06b6d4",
	"#3b82f6",
	"#8b5cf6",
	"#d946ef",
	"#f43f5e",
	"#ffffff",
] as const;

export interface TokenActionBarProps {
	token: VTTTokenInstance;
	/** Pixel position anchoring the bar (usually the token's top-left on screen). */
	anchor: { x: number; y: number };
	isWarden: boolean;
	onUpdate: (patch: Partial<VTTTokenInstance>) => void;
	onDelete: () => void;
	onOpenSheet?: () => void;
	onAddToGroup?: () => void;
	onClose: () => void;
	className?: string;
}

/**
 * Compact floating toolbar that appears above a selected token. Gives the
 * Warden direct access to Hide/Reveal, Rename, Border Color, Lock, Group,
 * Open-Sheet, and Delete without opening a drawer. Mirrors D&D Beyond
 * Maps' per-token action bar.
 */
export function TokenActionBar({
	token,
	anchor,
	isWarden,
	onUpdate,
	onDelete,
	onOpenSheet,
	onAddToGroup,
	onClose,
	className,
}: TokenActionBarProps) {
	const [isRenaming, setIsRenaming] = useState(false);
	const [draftName, setDraftName] = useState(token.name);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isRenaming) {
			// Focus + select when rename mode activates
			const raf = requestAnimationFrame(() => {
				inputRef.current?.focus();
				inputRef.current?.select();
			});
			return () => cancelAnimationFrame(raf);
		}
	}, [isRenaming]);

	const commitRename = () => {
		const next = draftName.trim();
		if (next && next !== token.name) {
			// DDB limits names to 128 chars; enforce client-side.
			onUpdate({ name: next.slice(0, 128) });
		}
		setIsRenaming(false);
	};

	const cancelRename = () => {
		setDraftName(token.name);
		setIsRenaming(false);
	};

	return (
		<DynamicStyle
			data-testid="vtt-token-action-bar"
			className={cn(
				"vtt-token-action-bar absolute z-40 pointer-events-auto",
				"flex items-center gap-0.5 rounded-full",
				"border border-border/60 bg-card/90 backdrop-blur-md",
				"shadow-[0_4px_14px_rgba(0,0,0,0.35)] px-1.5 py-1",
				className,
			)}
			vars={{
				left: `${anchor.x}px`,
				top: `${Math.max(0, anchor.y - 44)}px`,
			}}
			onClick={(e: React.MouseEvent) => e.stopPropagation()}
			onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
		>
			{isRenaming ? (
				<>
					<Input
						ref={inputRef}
						value={draftName}
						onChange={(e) => setDraftName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") commitRename();
							else if (e.key === "Escape") cancelRename();
						}}
						maxLength={128}
						className="h-7 text-xs w-40"
						aria-label="Token name"
					/>
					<Button
						variant="ghost"
						size="sm"
						className="h-7 w-7 p-0"
						onClick={commitRename}
						aria-label="Save name"
						title="Save (Enter)"
					>
						<Check className="w-3.5 h-3.5" aria-hidden />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="h-7 w-7 p-0"
						onClick={cancelRename}
						aria-label="Cancel rename"
						title="Cancel (Esc)"
					>
						<X className="w-3.5 h-3.5" aria-hidden />
					</Button>
				</>
			) : (
				<>
					{onOpenSheet && (
						<Button
							variant="ghost"
							size="sm"
							className="h-7 w-7 p-0"
							onClick={onOpenSheet}
							aria-label="Open token sheet"
							title="Open sheet"
						>
							<UserCircle2 className="w-3.5 h-3.5" aria-hidden />
						</Button>
					)}
					<Button
						variant="ghost"
						size="sm"
						className="h-7 w-7 p-0"
						onClick={() => {
							setDraftName(token.name);
							setIsRenaming(true);
						}}
						aria-label="Rename token"
						title="Rename"
					>
						<Pencil className="w-3.5 h-3.5" aria-hidden />
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-7 w-7 p-0"
								aria-label="Token border color"
								title="Border color"
							>
								<Palette className="w-3.5 h-3.5" aria-hidden />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="grid grid-cols-7 gap-1.5 p-2 w-auto"
						>
							{TOKEN_BORDER_PALETTE.map((color) => (
								<DynamicStyle
									as="button"
									key={color ?? "none"}
									type="button"
									onClick={() => onUpdate({ borderColor: color ?? undefined })}
									className={cn(
										"h-6 w-6 rounded-full border border-border/60 transition-transform hover:scale-110",
										color === null && "relative",
										token.borderColor === color &&
											"ring-2 ring-offset-1 ring-offset-card ring-primary",
									)}
									vars={color ? { "background-color": color } : undefined}
									aria-label={color ? `Border ${color}` : "No border"}
									title={color ? color : "No border"}
								>
									{color === null && (
										<span
											className="absolute inset-0 flex items-center justify-center text-[9px] text-foreground/70"
											aria-hidden
										>
											∅
										</span>
									)}
								</DynamicStyle>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
					{isWarden && (
						<Button
							variant="ghost"
							size="sm"
							className="h-7 w-7 p-0"
							onClick={() => onUpdate({ visible: !token.visible })}
							aria-label={
								token.visible ? "Hide token from players" : "Reveal token"
							}
							title={token.visible ? "Hide (Shift+H)" : "Reveal (Shift+H)"}
						>
							{token.visible ? (
								<Eye className="w-3.5 h-3.5" aria-hidden />
							) : (
								<EyeOff className="w-3.5 h-3.5 text-amber-500" aria-hidden />
							)}
						</Button>
					)}
					<Button
						variant="ghost"
						size="sm"
						className="h-7 w-7 p-0"
						onClick={() => onUpdate({ locked: !token.locked })}
						aria-label={token.locked ? "Unlock token" : "Lock token"}
						title={token.locked ? "Unlock (Shift+L)" : "Lock (Shift+L)"}
					>
						{token.locked ? (
							<Lock className="w-3.5 h-3.5 text-amber-500" aria-hidden />
						) : (
							<LockOpen className="w-3.5 h-3.5" aria-hidden />
						)}
					</Button>
					{onAddToGroup && (
						<Button
							variant="ghost"
							size="sm"
							className="h-7 w-7 p-0"
							onClick={onAddToGroup}
							aria-label="Add to group"
							title="Group with selection (Shift+G)"
						>
							<UsersIcon className="w-3.5 h-3.5" aria-hidden />
						</Button>
					)}
					{isWarden && (
						<Button
							variant="ghost"
							size="sm"
							className="h-7 w-7 p-0 text-destructive hover:text-destructive"
							onClick={onDelete}
							aria-label="Delete token"
							title="Delete (Del / Backspace)"
						>
							<Trash2 className="w-3.5 h-3.5" aria-hidden />
						</Button>
					)}
					<div className="mx-0.5 h-4 w-px bg-border/50" aria-hidden />
					<Button
						variant="ghost"
						size="sm"
						className="h-7 w-7 p-0"
						onClick={onClose}
						aria-label="Close token action bar"
						title="Deselect (Esc)"
					>
						<X className="w-3.5 h-3.5" aria-hidden />
					</Button>
				</>
			)}
		</DynamicStyle>
	);
}
