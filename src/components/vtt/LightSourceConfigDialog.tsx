import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { LightSource } from "@/types/vtt";

/**
 * Form draft used while the dialog is open. Mirrors LightSource fields plus
 * the `animated` boolean (defaulted to false in the canonical type) and the
 * already-optional `name` label.
 */
interface LightDraft {
	name: string;
	x: number;
	y: number;
	brightRadius: number;
	dimRadius: number;
	color: string;
	intensity: number;
	type: LightSource["type"];
	animated: boolean;
}

export interface LightSourceConfigDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** When provided, the dialog is in edit mode and pre-fills from this light. */
	light?: LightSource | null;
	/** Default x/y for create mode (grid units). Ignored when `light` is set. */
	defaultPosition?: { x: number; y: number };
	onSave: (draft: LightSource) => void;
	onDelete?: (lightId: string) => void;
}

const DEFAULT_DRAFT: LightDraft = {
	name: "Torch",
	x: 0,
	y: 0,
	brightRadius: 6,
	dimRadius: 12,
	color: "#ffd27d",
	intensity: 0.8,
	type: "torch",
	animated: false,
};

const TYPE_OPTIONS: { value: LightSource["type"]; label: string }[] = [
	{ value: "torch", label: "Torch (warm flicker)" },
	{ value: "ambient", label: "Ambient (steady)" },
	{ value: "magical", label: "Magical (cool glow)" },
	{ value: "token", label: "Token-attached" },
];

/**
 * Configurable light authoring dialog. Used both for click-to-place new
 * lights and for editing / deleting existing scene lights.
 */
export const LightSourceConfigDialog: React.FC<
	LightSourceConfigDialogProps
> = ({ open, onOpenChange, light, defaultPosition, onSave, onDelete }) => {
	const isEdit = Boolean(light);
	const [draft, setDraft] = useState<LightDraft>(DEFAULT_DRAFT);

	// Re-seed the draft whenever the dialog opens with a new light or
	// position, so reusing the same dialog instance for sequential placements
	// doesn't leak stale values.
	useEffect(() => {
		if (!open) return;
		if (light) {
			setDraft({
				name: light.name ?? "Light",
				x: light.x,
				y: light.y,
				brightRadius: light.brightRadius,
				dimRadius: light.dimRadius,
				color: light.color,
				intensity: light.intensity,
				type: light.type,
				animated: Boolean(light.animated),
			});
			return;
		}
		setDraft({
			...DEFAULT_DRAFT,
			x: defaultPosition?.x ?? 0,
			y: defaultPosition?.y ?? 0,
		});
	}, [open, light, defaultPosition]);

	const updateField = <K extends keyof LightDraft>(
		key: K,
		value: LightDraft[K],
	) => {
		setDraft((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = () => {
		// Auto-clamp dim radius to be at least bright radius so player-view
		// rendering doesn't produce nonsensical falloff (bright > dim).
		const clampedDim = Math.max(draft.dimRadius, draft.brightRadius);
		const next: LightSource = {
			id: light?.id ?? "", // caller assigns a fresh id when creating
			x: draft.x,
			y: draft.y,
			brightRadius: draft.brightRadius,
			dimRadius: clampedDim,
			color: draft.color,
			intensity: draft.intensity,
			type: draft.type,
			animated: draft.animated,
			name: draft.name.trim() || undefined,
		};
		onSave(next);
	};

	const handleDelete = () => {
		if (!light?.id || !onDelete) return;
		onDelete(light.id);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-w-md"
				data-testid="light-source-config-dialog"
			>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Lightbulb className="w-4 h-4 text-amber-400" aria-hidden />
						{isEdit ? "Edit Light Source" : "Place Light Source"}
					</DialogTitle>
					<DialogDescription>
						Configure radius, color, and animation. Lights honor scene walls
						when placed near a wall segment.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-2">
					<div className="space-y-1.5">
						<Label htmlFor="light-name" className="text-xs">
							Name
						</Label>
						<Input
							id="light-name"
							data-testid="light-source-name-input"
							value={draft.name}
							onChange={(e) => updateField("name", e.target.value)}
							placeholder="Torch, brazier, magical sconce..."
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="light-x" className="text-xs">
								X (grid)
							</Label>
							<Input
								id="light-x"
								data-testid="light-source-x-input"
								type="number"
								value={draft.x}
								onChange={(e) =>
									updateField("x", Number.parseFloat(e.target.value) || 0)
								}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="light-y" className="text-xs">
								Y (grid)
							</Label>
							<Input
								id="light-y"
								data-testid="light-source-y-input"
								type="number"
								value={draft.y}
								onChange={(e) =>
									updateField("y", Number.parseFloat(e.target.value) || 0)
								}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="light-bright" className="text-xs">
								Bright radius (squares)
							</Label>
							<Input
								id="light-bright"
								data-testid="light-source-bright-input"
								type="number"
								min={0}
								step={1}
								value={draft.brightRadius}
								onChange={(e) =>
									updateField(
										"brightRadius",
										Math.max(0, Number.parseFloat(e.target.value) || 0),
									)
								}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="light-dim" className="text-xs">
								Dim radius (squares)
							</Label>
							<Input
								id="light-dim"
								data-testid="light-source-dim-input"
								type="number"
								min={0}
								step={1}
								value={draft.dimRadius}
								onChange={(e) =>
									updateField(
										"dimRadius",
										Math.max(0, Number.parseFloat(e.target.value) || 0),
									)
								}
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="light-color" className="text-xs">
							Color
						</Label>
						<div className="flex items-center gap-2">
							<input
								id="light-color"
								data-testid="light-source-color-input"
								type="color"
								value={draft.color}
								onChange={(e) => updateField("color", e.target.value)}
								className="h-9 w-12 rounded border border-border bg-transparent cursor-pointer"
								aria-label="Light color"
							/>
							<Input
								value={draft.color}
								onChange={(e) => updateField("color", e.target.value)}
								className="font-mono text-xs"
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<div className="flex items-center justify-between">
							<Label htmlFor="light-intensity" className="text-xs">
								Intensity
							</Label>
							<span
								className="text-xs text-foreground/70 font-mono"
								data-testid="light-source-intensity-readout"
							>
								{draft.intensity.toFixed(2)}
							</span>
						</div>
						<Slider
							id="light-intensity"
							data-testid="light-source-intensity-slider"
							value={[draft.intensity]}
							min={0}
							max={1}
							step={0.05}
							onValueChange={(values) =>
								updateField("intensity", values[0] ?? 0)
							}
						/>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="light-type" className="text-xs">
							Type
						</Label>
						<Select
							value={draft.type}
							onValueChange={(value) =>
								updateField("type", value as LightSource["type"])
							}
						>
							<SelectTrigger
								id="light-type"
								data-testid="light-source-type-select"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{TYPE_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<label className="flex items-center gap-2 text-xs cursor-pointer">
						<input
							type="checkbox"
							data-testid="light-source-animated-checkbox"
							checked={draft.animated}
							onChange={(e) => updateField("animated", e.target.checked)}
							className="rounded border-border"
						/>
						<span>Animated flicker (torch / candle look)</span>
					</label>
				</div>

				<DialogFooter className="gap-2 sm:gap-2">
					{isEdit && onDelete ? (
						<Button
							type="button"
							variant="destructive"
							size="sm"
							data-testid="light-source-delete-button"
							onClick={handleDelete}
							className="mr-auto"
						>
							Delete
						</Button>
					) : null}
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						type="button"
						size="sm"
						data-testid="light-source-save-button"
						onClick={handleSave}
					>
						{isEdit ? "Save Changes" : "Place Light"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
