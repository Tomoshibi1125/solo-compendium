import { Layers } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { normalizeVttSceneLevels } from "@/lib/vtt/sceneState";
import type { VTTScene } from "@/types/vtt";

/**
 * Misty Pearl A2 — top-bar Strata Selector.
 *
 * Dropdown next to the scene title that switches which stratum
 * (floor) is "active" in the renderer. Inactive strata render at a
 * reduced opacity in the canvas. Wardens can author per-stratum
 * walls / lights / tokens via the Strata Drawer (separate component).
 */
export interface StrataSelectorProps {
	scene: VTTScene;
	activeLevelId: string | null;
	onChange: (levelId: string) => void;
}

export function StrataSelector({
	scene,
	activeLevelId,
	onChange,
}: StrataSelectorProps) {
	const normalized = normalizeVttSceneLevels(scene);
	const levels = normalized.levels ?? [];
	if (levels.length <= 1) {
		// Single-stratum scene — no selector needed.
		return null;
	}
	const current = activeLevelId ?? levels[0].id;

	return (
		<div className="inline-flex items-center gap-2">
			<Layers className="w-3.5 h-3.5 text-primary/70" aria-hidden="true" />
			<Select value={current} onValueChange={onChange}>
				<SelectTrigger
					className="h-8 w-44 text-xs"
					data-testid="vtt-strata-selector"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{[...levels]
						.sort((a, b) => b.order - a.order)
						.map((level) => (
							<SelectItem
								key={level.id}
								value={level.id}
								data-testid={`vtt-strata-option-${level.id}`}
							>
								Stratum {level.elevation >= 0 ? "+" : ""}
								{level.elevation} — {level.name}
							</SelectItem>
						))}
				</SelectContent>
			</Select>
		</div>
	);
}
