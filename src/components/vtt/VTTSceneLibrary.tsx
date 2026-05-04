import { Image as ImageIcon, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { VTTScene } from "@/types/vtt";

export interface VTTSceneLibraryProps {
	scenes: VTTScene[];
	currentSceneId?: string | null;
	liveSceneId?: string | null;
	isWarden?: boolean;
	onSelectScene: (scene: VTTScene) => void;
	onMakeLiveScene?: (scene: VTTScene) => void;
	onReorderScenes?: (scenes: VTTScene[]) => void;
}

const sceneSlug = (scene: VTTScene) =>
	scene.name.replace(/\s+/g, "-").toLowerCase();

export const getVttSceneTokenCount = (scene: VTTScene) =>
	Array.isArray(scene.tokens) ? scene.tokens.length : 0;

export const reorderVttScenes = (
	scenes: VTTScene[],
	sourceSceneId: string,
	targetSceneId: string,
) => {
	const sourceIndex = scenes.findIndex((scene) => scene.id === sourceSceneId);
	const targetIndex = scenes.findIndex((scene) => scene.id === targetSceneId);
	if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
		return scenes;
	}
	const nextScenes = [...scenes];
	const [movedScene] = nextScenes.splice(sourceIndex, 1);
	nextScenes.splice(targetIndex, 0, movedScene);
	return nextScenes;
};

export const VTTSceneLibrary = ({
	scenes,
	currentSceneId,
	liveSceneId,
	isWarden = false,
	onSelectScene,
	onMakeLiveScene,
	onReorderScenes,
}: VTTSceneLibraryProps) => {
	const [draggedSceneId, setDraggedSceneId] = useState<string | null>(null);

	if (scenes.length === 0) {
		return (
			<div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
				No scenes yet.
			</div>
		);
	}

	return (
		<ul data-testid="vtt-scene-library" className="grid grid-cols-2 gap-2">
			{scenes.map((scene) => {
				const isCurrent = currentSceneId === scene.id;
				const isLive = liveSceneId === scene.id;
				const tokenCount = getVttSceneTokenCount(scene);
				return (
					<li
						key={scene.id}
						draggable={!!onReorderScenes}
						onDragStart={() => setDraggedSceneId(scene.id)}
						onDragOver={(event) => {
							if (!onReorderScenes || draggedSceneId === scene.id) return;
							event.preventDefault();
						}}
						onDrop={(event) => {
							if (!onReorderScenes || !draggedSceneId) return;
							event.preventDefault();
							onReorderScenes(
								reorderVttScenes(scenes, draggedSceneId, scene.id),
							);
							setDraggedSceneId(null);
						}}
						onDragEnd={() => setDraggedSceneId(null)}
						className={cn(
							"overflow-hidden rounded-lg border bg-card/80 transition-all",
							isCurrent
								? "border-primary shadow-[0_0_0_1px_hsl(var(--primary))]"
								: "border-border hover:border-primary/60",
							draggedSceneId === scene.id && "opacity-60",
						)}
					>
						<button
							type="button"
							data-testid={`vtt-scene-library-card-${sceneSlug(scene)}`}
							aria-current={isCurrent ? "page" : undefined}
							aria-label={`Select scene ${scene.name}`}
							onClick={() => onSelectScene(scene)}
							className="block w-full text-left"
						>
							<div className="relative aspect-video overflow-hidden bg-muted/60">
								{scene.backgroundImage ? (
									<img
										src={scene.backgroundImage}
										alt=""
										className="h-full w-full object-cover"
										loading="lazy"
									/>
								) : (
									<div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
										<ImageIcon className="h-5 w-5" aria-hidden />
										<span className="text-[10px] uppercase tracking-widest">
											No map
										</span>
									</div>
								)}
								<div className="absolute left-1 top-1 flex gap-1">
									{isCurrent && (
										<span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">
											Open
										</span>
									)}
									{isLive && (
										<span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
											Live
										</span>
									)}
								</div>
							</div>
							<div className="space-y-1 p-2">
								<div className="truncate text-xs font-semibold text-foreground">
									{scene.name}
								</div>
								<div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
									<span>
										{scene.width}×{scene.height}
									</span>
									<span>
										{tokenCount} token{tokenCount === 1 ? "" : "s"}
									</span>
								</div>
							</div>
						</button>
						{isWarden && onMakeLiveScene && isLive && (
							<button
								type="button"
								aria-label={`${scene.name} is live for players`}
								aria-pressed="true"
								onClick={() => onMakeLiveScene(scene)}
								className="flex w-full items-center justify-center gap-1 border-t border-amber-500/50 bg-amber-500 px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black transition-colors"
							>
								<Play className="h-3 w-3" aria-hidden />
								Live
							</button>
						)}
						{isWarden && onMakeLiveScene && !isLive && (
							<button
								type="button"
								aria-label={`Make ${scene.name} live for players`}
								aria-pressed="false"
								onClick={() => onMakeLiveScene(scene)}
								className="flex w-full items-center justify-center gap-1 border-t border-border bg-muted/40 px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/70 transition-colors hover:bg-muted"
							>
								<Play className="h-3 w-3" aria-hidden />
								Go Live
							</button>
						)}
					</li>
				);
			})}
		</ul>
	);
};
