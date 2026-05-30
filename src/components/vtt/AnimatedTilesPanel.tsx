import { Film, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	addAnimatedTileToScene,
	createVttAnimatedTileId,
	isAnimatedTileUrl,
	removeAnimatedTileFromScene,
	updateAnimatedTileInScene,
} from "@/lib/vtt/sceneState";
import type { VTTAnimatedTile, VTTScene } from "@/types/vtt";

/**
 * Misty Pearl B4 polish — Animated Tiles management panel.
 *
 * Per-scene CRUD for `VTTAnimatedTile` overlays (video / animated webp
 * / gif). Wardens drop a URL in, set spatial parameters (x / y /
 * width / height / opacity / loop), and the canvas picks them up
 * automatically since the renderer already accepts video URLs as
 * backgrounds (B4 VideoTexture branch).
 *
 * Mounts in the left-rail Scenes drawer as a sibling of `<StrataDrawer>`.
 */
export interface AnimatedTilesPanelProps {
	scene: VTTScene;
	onSceneChange: (next: VTTScene) => void;
}

export function AnimatedTilesPanel({
	scene,
	onSceneChange,
}: AnimatedTilesPanelProps) {
	const tiles = scene.animatedTiles ?? [];
	const [newSrc, setNewSrc] = useState("");

	const addTile = () => {
		const src = newSrc.trim();
		if (!src) return;
		const tile: VTTAnimatedTile = {
			id: createVttAnimatedTileId(),
			src,
			x: 0,
			y: 0,
			width: scene.gridSize * 4,
			height: scene.gridSize * 4,
			loop: true,
			opacity: 1,
		};
		onSceneChange(addAnimatedTileToScene(scene, tile));
		setNewSrc("");
	};

	const patchTile = (tileId: string, patch: Partial<VTTAnimatedTile>) => {
		onSceneChange(updateAnimatedTileInScene(scene, tileId, patch));
	};

	const removeTile = (tileId: string) => {
		onSceneChange(removeAnimatedTileFromScene(scene, tileId));
	};

	return (
		<AscendantWindow title="ANIMATED TILES">
			<section
				className="space-y-3"
				data-testid="vtt-animated-tiles-panel"
				aria-label="Animated tiles"
			>
				<p className="text-xs text-muted-foreground">
					Drop a video URL (
					<code className="text-[10px] bg-muted px-1">.mp4</code>,{" "}
					<code className="text-[10px] bg-muted px-1">.webm</code>) or animated
					webp / gif onto the active Rift. Tiles render above the map background
					and below tokens.
				</p>

				<div className="space-y-1.5">
					{tiles.length === 0 && (
						<p className="text-[10px] text-muted-foreground italic">
							No animated tiles on this Rift.
						</p>
					)}
					{tiles.map((tile) => (
						<div
							key={tile.id}
							className="rounded-md border border-border/60 bg-muted/30 p-2 space-y-2"
							data-testid={`vtt-animated-tile-${tile.id}`}
						>
							<div className="flex items-center gap-2">
								<Film
									className="w-3.5 h-3.5 text-primary/70 flex-shrink-0"
									aria-hidden
								/>
								<Input
									className="h-7 text-xs flex-1"
									value={tile.src}
									onChange={(e) => patchTile(tile.id, { src: e.target.value })}
									placeholder="https://example.com/flames.webm"
								/>
								<Button
									size="icon"
									variant="ghost"
									className="h-7 w-7 text-destructive"
									onClick={() => removeTile(tile.id)}
									aria-label="Remove tile"
								>
									<Trash2 className="w-3.5 h-3.5" />
								</Button>
							</div>
							<div className="grid grid-cols-4 gap-1.5">
								<div>
									<Label
										htmlFor={`tile-${tile.id}-x`}
										className="text-[10px] text-muted-foreground"
									>
										X
									</Label>
									<Input
										id={`tile-${tile.id}-x`}
										type="number"
										className="h-7 text-xs"
										value={tile.x}
										onChange={(e) =>
											patchTile(tile.id, { x: Number(e.target.value) || 0 })
										}
									/>
								</div>
								<div>
									<Label
										htmlFor={`tile-${tile.id}-y`}
										className="text-[10px] text-muted-foreground"
									>
										Y
									</Label>
									<Input
										id={`tile-${tile.id}-y`}
										type="number"
										className="h-7 text-xs"
										value={tile.y}
										onChange={(e) =>
											patchTile(tile.id, { y: Number(e.target.value) || 0 })
										}
									/>
								</div>
								<div>
									<Label
										htmlFor={`tile-${tile.id}-w`}
										className="text-[10px] text-muted-foreground"
									>
										W
									</Label>
									<Input
										id={`tile-${tile.id}-w`}
										type="number"
										className="h-7 text-xs"
										value={tile.width}
										onChange={(e) =>
											patchTile(tile.id, {
												width: Math.max(8, Number(e.target.value) || 8),
											})
										}
									/>
								</div>
								<div>
									<Label
										htmlFor={`tile-${tile.id}-h`}
										className="text-[10px] text-muted-foreground"
									>
										H
									</Label>
									<Input
										id={`tile-${tile.id}-h`}
										type="number"
										className="h-7 text-xs"
										value={tile.height}
										onChange={(e) =>
											patchTile(tile.id, {
												height: Math.max(8, Number(e.target.value) || 8),
											})
										}
									/>
								</div>
							</div>
							<div className="flex items-center justify-between text-[10px] text-muted-foreground">
								<div className="flex items-center gap-1.5">
									<Label
										htmlFor={`tile-${tile.id}-loop`}
										className="text-[10px]"
									>
										Loop
									</Label>
									<Switch
										id={`tile-${tile.id}-loop`}
										checked={tile.loop}
										onCheckedChange={(checked) =>
											patchTile(tile.id, { loop: checked })
										}
									/>
								</div>
								<div className="flex items-center gap-1.5">
									<Label
										htmlFor={`tile-${tile.id}-opacity`}
										className="text-[10px]"
									>
										Opacity
									</Label>
									<Input
										id={`tile-${tile.id}-opacity`}
										type="range"
										min={0}
										max={1}
										step={0.05}
										value={tile.opacity ?? 1}
										onChange={(e) =>
											patchTile(tile.id, {
												opacity: Number(e.target.value),
											})
										}
										className="w-20 h-2"
									/>
								</div>
							</div>
							{!isAnimatedTileUrl(tile.src) && (
								<p className="text-[10px] text-amber-300">
									URL does not look like a recognized animated format.
								</p>
							)}
						</div>
					))}
				</div>

				<div className="rounded-md border border-dashed border-border p-2 space-y-1.5">
					<Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
						Add Tile
					</Label>
					<div className="flex gap-1.5">
						<Input
							className="h-7 text-xs flex-1"
							value={newSrc}
							onChange={(e) => setNewSrc(e.target.value)}
							placeholder="Video URL"
							data-testid="vtt-animated-tile-new-src"
						/>
						<Button
							size="sm"
							className="h-7 text-xs"
							onClick={addTile}
							disabled={!newSrc.trim()}
							data-testid="vtt-animated-tile-add"
						>
							<Plus className="w-3.5 h-3.5 mr-1" />
							Add
						</Button>
					</div>
				</div>
			</section>
		</AscendantWindow>
	);
}

export default AnimatedTilesPanel;
