import {
	Eye,
	EyeOff,
	Image as ImageIcon,
	MapPin,
	ShieldAlert,
	Sparkles,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LayerDef {
	id: number;
	label: string;
}

export interface LayerQuickSwitchProps {
	layers: LayerDef[];
	currentLayer: number;
	onSelectLayer: (id: number) => void;
	visibility: Record<number, boolean>;
	onToggleVisibility: (id: number) => void;
	/** Filter: only show layers matching this predicate (for player vs. warden). */
	filter?: (layer: LayerDef) => boolean;
	className?: string;
}

const LAYER_ICONS: Record<number, ComponentType<SVGProps<SVGSVGElement>>> = {
	0: ImageIcon,
	1: MapPin,
	2: Sparkles,
	3: ShieldAlert,
};

/**
 * Compact 4-button layer strip (Roll20 / Foundry parity). Lets the Warden
 * pick the active layer (where new tokens / drawings are placed) and toggle
 * visibility per layer. Designed to sit in the left rail footer.
 */
export function LayerQuickSwitch({
	layers,
	currentLayer,
	onSelectLayer,
	visibility,
	onToggleVisibility,
	filter,
	className,
}: LayerQuickSwitchProps) {
	const shown = filter ? layers.filter(filter) : layers;
	return (
		<div
			data-testid="vtt-layer-quick-switch"
			className={cn(
				"inline-flex flex-col gap-1 rounded-md border border-border/50 bg-card/70 p-1",
				className,
			)}
			role="toolbar"
			aria-label="Layer selector"
		>
			{shown.map((layer) => {
				const Icon = LAYER_ICONS[layer.id] ?? ImageIcon;
				const isActive = layer.id === currentLayer;
				const isVisible = !!visibility[layer.id];
				return (
					<div key={layer.id} className="flex items-center gap-0.5">
						<Button
							variant={isActive ? "default" : "ghost"}
							size="sm"
							className={cn(
								"h-7 w-16 justify-start px-1.5 text-[10px] font-semibold uppercase tracking-wide",
								isActive && "ring-1 ring-primary/60",
							)}
							onClick={() => onSelectLayer(layer.id)}
							aria-pressed={isActive}
							aria-label={`Activate ${layer.label} layer`}
							title={`${layer.label} layer (active: ${isActive ? "yes" : "no"})`}
							data-testid={`vtt-layer-select-${layer.id}`}
						>
							<Icon className="w-3 h-3 mr-1 shrink-0" aria-hidden />
							{layer.label}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-7 w-7 p-0"
							onClick={() => onToggleVisibility(layer.id)}
							aria-label={
								isVisible
									? `Hide ${layer.label} layer`
									: `Show ${layer.label} layer`
							}
							title={isVisible ? "Hide layer" : "Show layer"}
							data-testid={`vtt-layer-visibility-${layer.id}`}
						>
							{isVisible ? (
								<Eye className="w-3.5 h-3.5" aria-hidden />
							) : (
								<EyeOff className="w-3.5 h-3.5 text-amber-500" aria-hidden />
							)}
						</Button>
					</div>
				);
			})}
		</div>
	);
}
