/**
 * DiceVisibilityControl — Settings panel for shared 3D dice visibility
 *
 * Compact control that lets users choose whether to see shared 3D dice
 * animations from other players (DDB parity: "Shared" / "Only Me" / "Disabled").
 */

import { Dice1, Eye, EyeOff, Users } from "lucide-react";
import type { DiceVisibility } from "@/hooks/useVTTRealtime";
import { cn } from "@/lib/utils";

interface DiceVisibilityControlProps {
	visibility: DiceVisibility;
	onChange: (visibility: DiceVisibility) => void;
	className?: string;
}

const VISIBILITY_OPTIONS: {
	value: DiceVisibility;
	label: string;
	description: string;
	icon: typeof Users;
}[] = [
	{
		value: "shared",
		label: "Shared",
		description: "Everyone sees 3D dice rolls",
		icon: Users,
	},
	{
		value: "self",
		label: "Only Me",
		description: "Only you see your 3D dice",
		icon: Eye,
	},
	{
		value: "disabled",
		label: "Disabled",
		description: "No 3D dice animations",
		icon: EyeOff,
	},
];

export function DiceVisibilityControl({
	visibility,
	onChange,
	className,
}: DiceVisibilityControlProps) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
				<Dice1 className="w-3.5 h-3.5" />
				<span>3D Dice</span>
			</div>
			<div className="flex gap-1">
				{VISIBILITY_OPTIONS.map((option) => {
					const Icon = option.icon;
					const isActive = visibility === option.value;
					return (
						<button
							key={option.value}
							type="button"
							className={cn(
								"flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium",
								"border transition-all duration-150",
								isActive
									? "bg-primary/20 border-primary/50 text-primary"
									: "border-border/50 text-muted-foreground hover:bg-muted/30 hover:text-foreground",
							)}
							onClick={() => onChange(option.value)}
							title={option.description}
						>
							<Icon className="w-3 h-3" />
							{option.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
