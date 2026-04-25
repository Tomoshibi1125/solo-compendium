import React, { useMemo } from "react";
import { DynamicStyle } from "@/components/ui/DynamicStyle";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { cn } from "@/lib/utils";
import {
	clampVttGridOpacity,
	getVttBackgroundTransform,
} from "@/lib/vtt/backgroundTransform";
import { buildVttFogRects } from "@/lib/vtt/fogRects";
import { getTokenFootprintPx } from "@/lib/vtt/tokenSizing";
import type { VTTScene, VTTTokenInstance } from "@/types/vtt";

export type VttDomFallbackSurfaceProps = {
	scene: VTTScene;
	tokens: VTTTokenInstance[];
	gridSize: number;
	zoom: number;
	showGrid: boolean;
	activeTokenId: string | null;
	activeInitiativeTokenId: string | null;
	setActiveTokenId: (id: string | null) => void;
};

export const VttDomFallbackSurface = React.memo(function VttDomFallbackSurface({
	scene,
	tokens,
	gridSize,
	zoom,
	showGrid,
	activeTokenId,
	activeInitiativeTokenId,
	setActiveTokenId,
}: VttDomFallbackSurfaceProps) {
	const backgroundTransform = useMemo(
		() =>
			getVttBackgroundTransform({
				sceneWidth: scene.width,
				sceneHeight: scene.height,
				gridSize,
				zoom,
				backgroundScale: scene.backgroundScale,
				backgroundOffsetX: scene.backgroundOffsetX,
				backgroundOffsetY: scene.backgroundOffsetY,
			}),
		[
			scene.backgroundOffsetX,
			scene.backgroundOffsetY,
			scene.backgroundScale,
			scene.height,
			scene.width,
			gridSize,
			zoom,
		],
	);
	const effectiveGridOpacity = useMemo(
		() => (showGrid ? clampVttGridOpacity(scene.gridOpacity) : 0),
		[scene.gridOpacity, showGrid],
	);
	const fogRects = useMemo(() => {
		if (!scene.fogOfWar || !scene.fogData) return [];
		return buildVttFogRects(scene.fogData);
	}, [scene.fogData, scene.fogOfWar]);

	return (
		<div className="absolute inset-0" data-testid="vtt-dom-fallback-surface">
			{scene.backgroundImage && (
				<DynamicStyle
					className="absolute overflow-hidden pointer-events-none"
					data-testid="vtt-dom-fallback-background"
					vars={{
						left: `${backgroundTransform.offsetXPx}px`,
						top: `${backgroundTransform.offsetYPx}px`,
						width: `${backgroundTransform.imageWidthPx}px`,
						height: `${backgroundTransform.imageHeightPx}px`,
						"z-index": 0,
					}}
				>
					<OptimizedImage
						src={scene.backgroundImage}
						alt="Map background"
						className="w-full h-full max-w-none opacity-95"
						size="large"
					/>
				</DynamicStyle>
			)}
			{effectiveGridOpacity > 0 && (
				<DynamicStyle
					className="absolute inset-0 pointer-events-none"
					data-testid="vtt-dom-fallback-grid"
					vars={{
						"background-image":
							"linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
						"background-size": `${gridSize * zoom}px ${gridSize * zoom}px`,
						opacity: effectiveGridOpacity,
						"z-index": 1,
					}}
				/>
			)}
			{fogRects.length > 0 && (
				<div
					className="absolute inset-0 pointer-events-none z-[2]"
					data-testid="vtt-dom-fallback-fog"
				>
					{fogRects.map((rect) => (
						<DynamicStyle
							key={`fallback-fog-${rect.rx}-${rect.ry}-${rect.width}`}
							className="absolute bg-black/45"
							vars={{
								left: `${rect.rx * gridSize * zoom}px`,
								top: `${rect.ry * gridSize * zoom}px`,
								width: `${rect.width * gridSize * zoom}px`,
								height: `${rect.height * gridSize * zoom}px`,
							}}
						/>
					))}
				</div>
			)}
			<div className="absolute inset-0 z-[3]">
				{tokens.map((token) => {
					const { width, height } = getTokenFootprintPx(
						token.size,
						gridSize,
						zoom,
						{ gridWidth: token.gridWidth, gridHeight: token.gridHeight },
					);
					const isOverlayToken =
						token.render?.mode === "overlay" ||
						token.tokenType === "effect" ||
						token.tokenType === "prop";
					const borderColor =
						activeInitiativeTokenId === token.id
							? "#10b981"
							: activeTokenId === token.id
								? "#fbbf24"
								: token.borderColor || token.color || "hsl(var(--primary))";
					const borderWidth =
						activeInitiativeTokenId === token.id
							? "4px"
							: activeTokenId === token.id
								? "3px"
								: "2px";
					const tokenBackground = isOverlayToken
						? "transparent"
						: token.color
							? `${token.color}40`
							: "rgba(0,0,0,0.18)";
					return (
						<DynamicStyle
							as="button"
							type="button"
							key={token.id}
							className="absolute bg-transparent border-none p-0 text-left"
							data-testid={`vtt-dom-fallback-token-${token.id}`}
							vars={{
								left: `${token.x * gridSize * zoom}px`,
								top: `${token.y * gridSize * zoom}px`,
								width: `${width}px`,
								height: `${height}px`,
								transform: `rotate(${token.rotation}deg)`,
								"z-index": token.layer * 10 + 10,
							}}
							onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
								event.stopPropagation();
								setActiveTokenId(token.id);
							}}
							title={`${token.name}${token.hp !== undefined && token.maxHp !== undefined ? ` (${token.hp}/${token.maxHp} HP)` : ""}`}
						>
							<DynamicStyle
								className={cn(
									"flex h-full w-full items-center justify-center text-white font-semibold overflow-hidden",
									!isOverlayToken && "rounded-full border-solid",
								)}
								vars={{
									"background-color": tokenBackground,
									"border-color": borderColor,
									"border-width": isOverlayToken ? 0 : borderWidth,
									"box-shadow":
										activeTokenId === token.id ||
										activeInitiativeTokenId === token.id
											? `0 0 0 1px ${borderColor}`
											: undefined,
									opacity: token.render?.opacity ?? 1,
									"font-size": `${Math.max(14, Math.round(Math.max(width, height) * 0.35))}px`,
								}}
							>
								{token.imageUrl ? (
									<OptimizedImage
										src={token.imageUrl}
										alt={token.name}
										className={cn(
											"h-full w-full",
											isOverlayToken
												? "object-contain"
												: "object-cover rounded-full",
										)}
										size="small"
									/>
								) : (
									token.emoji || token.name.charAt(0).toUpperCase()
								)}
							</DynamicStyle>
						</DynamicStyle>
					);
				})}
			</div>
		</div>
	);
});
