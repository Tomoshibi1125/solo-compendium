import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import type { VTTSettings } from "@/hooks/useVTTSettings";
import { cn } from "@/lib/utils";

export interface GameSettingsDrawerProps {
	settings: VTTSettings;
	onChange: (next: Partial<VTTSettings>) => void;
	disabled?: boolean;
	triggerClassName?: string;
}

interface Toggle {
	key: keyof VTTSettings;
	label: string;
	description: string;
	type: "boolean" | "wheel";
}

const BOOLEAN_TOGGLES: Toggle[] = [
	{
		key: "allowPlayerDraw",
		label: "Allow Ascendants to draw",
		description:
			"Lets players use the Draw tool on the map. Warden drawings are always visible.",
		type: "boolean",
	},
	{
		key: "allowPlayerPing",
		label: "Allow Ascendants to ping",
		description:
			"Enables double-click ping on the map for players (default on — DDB parity).",
		type: "boolean",
	},
	{
		key: "allowPlayerPointer",
		label: "Allow Ascendants to use pointer",
		description:
			"Turns on the trailing-highlight pointer tool (X key) for players.",
		type: "boolean",
	},
	{
		key: "allowPlayerMonsterInteract",
		label: "Allow Ascendants to move anomaly tokens",
		description:
			"When OFF, players can only drag their own character tokens. When ON, any player can move any token (DDB default is ON).",
		type: "boolean",
	},
	{
		key: "allowPlayerFogBrush",
		label: "Allow Ascendants to use fog brush",
		description:
			"Rarely desired — lets players paint / erase fog of war. Leave OFF for normal play.",
		type: "boolean",
	},
];

/**
 * Warden-only panel for toggling per-campaign VTT permissions (DDB Maps
 * "Game Settings" parity). Opens a right-side Sheet from a gear button
 * in the VTT top bar.
 */
export function GameSettingsDrawer({
	settings,
	onChange,
	disabled = false,
	triggerClassName,
}: GameSettingsDrawerProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className={cn("h-8 px-2", triggerClassName)}
					aria-label="Open VTT game settings"
					title="Game settings (Warden only)"
					data-testid="vtt-game-settings-trigger"
					disabled={disabled}
				>
					<Settings2 className="w-3.5 h-3.5" aria-hidden />
					<span className="hidden md:inline ml-1.5 text-xs">Settings</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full max-w-md">
				<SheetHeader>
					<SheetTitle>VTT Game Settings</SheetTitle>
					<SheetDescription>
						Tune what your Ascendants can do on the map. Changes apply to every
						player in this campaign immediately.
					</SheetDescription>
				</SheetHeader>

				<div className="mt-5 space-y-5">
					{BOOLEAN_TOGGLES.map((toggle) => {
						const value = settings[toggle.key] as boolean;
						const id = `vtt-setting-${toggle.key}`;
						return (
							<div
								key={toggle.key}
								className="flex items-start justify-between gap-3 pb-4 border-b border-border/40 last:border-b-0 last:pb-0"
							>
								<div className="flex-1 min-w-0">
									<Label htmlFor={id} className="text-sm font-medium">
										{toggle.label}
									</Label>
									<p className="mt-1 text-xs text-foreground/60">
										{toggle.description}
									</p>
								</div>
								<Switch
									id={id}
									checked={value}
									onCheckedChange={(checked) =>
										onChange({ [toggle.key]: checked } as Partial<VTTSettings>)
									}
								/>
							</div>
						);
					})}

					<div className="pt-1">
						<Label className="text-sm font-medium">Mouse-wheel behavior</Label>
						<p className="mt-1 text-xs text-foreground/60">
							Choose whether spinning the wheel over the map zooms (DDB /
							Foundry style) or scrolls the container (Roll20 style).
						</p>
						<div className="mt-2 inline-flex rounded-md border border-border/60 overflow-hidden">
							{(["zoom", "scroll"] as const).map((mode) => (
								<button
									key={mode}
									type="button"
									onClick={() => onChange({ wheelBehavior: mode })}
									className={cn(
										"px-3 py-1.5 text-xs font-medium capitalize",
										settings.wheelBehavior === mode
											? "bg-primary text-primary-foreground"
											: "bg-transparent text-foreground/70 hover:bg-muted/40",
									)}
								>
									{mode}
								</button>
							))}
						</div>
					</div>

					{/* Misty Pearl B3 — Scene transitions */}
					<div className="pt-3 border-t border-border/40">
						<div className="flex items-start justify-between gap-3">
							<div className="flex-1 min-w-0">
								<Label
									htmlFor="vtt-setting-scene-transitions"
									className="text-sm font-medium"
								>
									Scene transitions
								</Label>
								<p className="mt-1 text-xs text-foreground/60">
									When switching scenes, fade through a Bureau Field Brief
									title card (Foundry v14 parity). Respects reduced-motion.
								</p>
							</div>
							<Switch
								id="vtt-setting-scene-transitions"
								checked={settings.sceneTransitionEnabled}
								onCheckedChange={(checked) =>
									onChange({ sceneTransitionEnabled: checked })
								}
								data-testid="vtt-setting-scene-transitions"
							/>
						</div>
						{settings.sceneTransitionEnabled && (
							<div className="mt-3">
								<Label
									htmlFor="vtt-setting-scene-transition-duration"
									className="text-xs"
								>
									Duration: {(settings.sceneTransitionDurationMs / 1000).toFixed(1)}
									s
								</Label>
								<input
									id="vtt-setting-scene-transition-duration"
									type="range"
									min={600}
									max={6000}
									step={100}
									value={settings.sceneTransitionDurationMs}
									onChange={(e) =>
										onChange({
											sceneTransitionDurationMs: Number(e.target.value) || 2200,
										})
									}
									className="mt-1 w-full accent-primary"
								/>
							</div>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
