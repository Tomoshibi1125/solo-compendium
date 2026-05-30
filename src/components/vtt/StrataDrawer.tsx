import { ArrowDown, ArrowUp, Layers, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	addLevelToScene,
	createVttSceneLevelId,
	normalizeVttSceneLevels,
	removeLevelFromScene,
	updateLevelInScene,
} from "@/lib/vtt/sceneState";
import type { VTTScene, VTTSceneLevel } from "@/types/vtt";

/**
 * Misty Pearl A2 — left-rail Strata Drawer.
 *
 * CRUD UI for managing the active scene's strata. Wardens add named
 * floors (e.g. "Stratum -1 — Subway", "Stratum +1 — Rooftop"), set
 * each one's elevation + visibility, and reorder via the up/down
 * controls. Token assignment to a specific stratum happens through
 * the token action bar (separate surface).
 */
export interface StrataDrawerProps {
	scene: VTTScene;
	onSceneChange: (next: VTTScene) => void;
}

export function StrataDrawer({ scene, onSceneChange }: StrataDrawerProps) {
	const normalized = normalizeVttSceneLevels(scene);
	const levels = (normalized.levels ?? [])
		.slice()
		.sort((a, b) => b.order - a.order);

	const [newName, setNewName] = useState("");
	const [newElevation, setNewElevation] = useState(0);

	const addStratum = () => {
		const order = (levels[0]?.order ?? 0) + 1;
		const level: VTTSceneLevel = {
			id: createVttSceneLevelId(),
			name:
				newName.trim() ||
				`Stratum ${newElevation >= 0 ? "+" : ""}${newElevation}`,
			elevation: newElevation,
			order,
			visibleToPlayers: true,
			wallIds: [],
			lightIds: [],
		};
		onSceneChange(addLevelToScene(normalized, level));
		setNewName("");
		setNewElevation(0);
	};

	const patchLevel = (id: string, patch: Partial<VTTSceneLevel>) => {
		onSceneChange(updateLevelInScene(normalized, id, patch));
	};

	return (
		<AscendantWindow title="STRATA AUTHORING">
			<div className="space-y-3" data-testid="vtt-strata-drawer">
				<p className="text-xs text-muted-foreground">
					Stack multiple floors in one Rift. Token movement between strata
					happens through the action bar; rendering dims inactive strata so the
					Warden can focus on one floor at a time.
				</p>

				<div className="space-y-1.5">
					{levels.map((level) => (
						<div
							key={level.id}
							className="rounded-md border border-border/60 bg-muted/30 p-2 space-y-2"
						>
							<div className="flex items-center gap-2">
								<Layers className="w-3.5 h-3.5 text-primary/70" />
								<Input
									className="h-7 text-xs flex-1"
									value={level.name}
									onChange={(e) =>
										patchLevel(level.id, { name: e.target.value })
									}
								/>
								<Input
									className="h-7 w-16 text-xs"
									type="number"
									value={level.elevation}
									onChange={(e) =>
										patchLevel(level.id, {
											elevation: Number(e.target.value) || 0,
										})
									}
									title="Elevation (grid units)"
								/>
								<div className="flex gap-0.5">
									<Button
										size="icon"
										variant="ghost"
										className="h-7 w-7"
										onClick={() =>
											patchLevel(level.id, { order: level.order + 1 })
										}
										aria-label="Raise stratum order"
									>
										<ArrowUp className="w-3.5 h-3.5" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										className="h-7 w-7"
										onClick={() =>
											patchLevel(level.id, { order: level.order - 1 })
										}
										aria-label="Lower stratum order"
									>
										<ArrowDown className="w-3.5 h-3.5" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										className="h-7 w-7 text-destructive"
										onClick={() =>
											onSceneChange(removeLevelFromScene(normalized, level.id))
										}
										aria-label="Remove stratum"
										disabled={levels.length <= 1}
									>
										<Trash2 className="w-3.5 h-3.5" />
									</Button>
								</div>
							</div>
							<div className="flex items-center justify-between text-[10px] text-muted-foreground">
								<span>
									{level.wallIds.length} walls · {level.lightIds.length} lights
								</span>
								<div className="flex items-center gap-1.5">
									<Label
										htmlFor={`stratum-vis-${level.id}`}
										className="text-[10px]"
									>
										Visible to Ascendants
									</Label>
									<Switch
										id={`stratum-vis-${level.id}`}
										checked={level.visibleToPlayers}
										onCheckedChange={(checked) =>
											patchLevel(level.id, { visibleToPlayers: checked })
										}
									/>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="rounded-md border border-dashed border-border p-2 space-y-2">
					<Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
						Add Stratum
					</Label>
					<div className="flex gap-1.5">
						<Input
							className="h-7 text-xs flex-1"
							placeholder="Name (e.g. Subway)"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
						/>
						<Input
							className="h-7 w-16 text-xs"
							type="number"
							value={newElevation}
							onChange={(e) => setNewElevation(Number(e.target.value) || 0)}
							title="Elevation"
						/>
						<Button
							size="sm"
							className="h-7 text-xs"
							onClick={addStratum}
							data-testid="vtt-strata-add"
						>
							<Plus className="w-3.5 h-3.5 mr-1" />
							Add
						</Button>
					</div>
				</div>
			</div>
		</AscendantWindow>
	);
}

export default StrataDrawer;
