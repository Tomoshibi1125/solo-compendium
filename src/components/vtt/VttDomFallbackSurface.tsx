import React, { useMemo } from "react";
import { DynamicStyle } from "@/components/ui/DynamicStyle";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { cn } from "@/lib/utils";
import {
	clampVttGridOpacity,
	getVttBackgroundTransform,
} from "@/lib/vtt/backgroundTransform";
import {
	buildVttFogRenderRects,
	buildVttVisibleCellSet,
	isVttTokenVisibleThroughFog,
	VTT_WARDEN_HIDDEN_FOG_OPACITY,
	type VttFogRenderRect,
} from "@/lib/vtt/fogRects";
import { getTokenFootprintPx } from "@/lib/vtt/tokenSizing";
import type { VTTScene, VTTTokenInstance } from "@/types/vtt";

export type VttDomFallbackSurfaceProps = {
	scene: VTTScene;
	tokens: VTTTokenInstance[];
	gridSize: number;
	zoom: number;
	showGrid: boolean;
	activeTokenId: string | null;
	activeTokenIds?: string[];
	targetedTokenIds?: string[];
	activeInitiativeTokenId: string | null;
	setActiveTokenId: (id: string | null) => void;
	onTokenPointerSelect?: (tokenId: string, additive: boolean) => void;
	fogRenderRects?: VttFogRenderRect[];
	isWarden?: boolean;
	currentUserId?: string | null;
	ownedCharacterId?: string | null;
};

const toRgba = (color: string | undefined, alpha: number) => {
	const normalized = (color || "#ffffff").trim().replace(/^#/, "");
	const hex =
		normalized.length === 3
			? normalized
					.split("")
					.map((char) => char + char)
					.join("")
			: normalized;
	if (!/^[0-9a-f]{6}$/i.test(hex)) return `rgba(255,255,255,${alpha})`;
	const value = Number.parseInt(hex, 16);
	const r = (value >> 16) & 255;
	const g = (value >> 8) & 255;
	const b = value & 255;
	return `rgba(${r},${g},${b},${alpha})`;
};

export const VttDomFallbackSurface = React.memo(function VttDomFallbackSurface({
	scene,
	tokens,
	gridSize,
	zoom,
	showGrid,
	activeTokenId,
	activeTokenIds = [],
	targetedTokenIds = [],
	activeInitiativeTokenId,
	setActiveTokenId,
	onTokenPointerSelect,
	fogRenderRects,
	isWarden = false,
	currentUserId = null,
	ownedCharacterId = null,
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
	const sceneWalls = scene.walls ?? [];
	const sceneLights = scene.lights ?? [];
	const fogVisibleCells = useMemo(() => {
		if (isWarden || !scene.fogOfWar || !scene.tokenVisionRevealsFog) {
			return null;
		}
		return buildVttVisibleCellSet(
			{
				width: scene.width,
				height: scene.height,
				gridSize,
				fogOfWar: scene.fogOfWar,
				tokenVisionRevealsFog: scene.tokenVisionRevealsFog,
				fogData: scene.fogData,
				walls: sceneWalls,
			},
			tokens,
			{
				activeTokenId,
				currentUserId,
				ownedCharacterId,
			},
		);
	}, [
		activeTokenId,
		currentUserId,
		gridSize,
		isWarden,
		ownedCharacterId,
		scene.fogData,
		scene.fogOfWar,
		scene.height,
		scene.tokenVisionRevealsFog,
		sceneWalls,
		scene.width,
		tokens,
	]);
	const fogRects = useMemo(() => {
		if (fogRenderRects) return fogRenderRects;
		if (!scene.fogOfWar) return [];
		return buildVttFogRenderRects({
			scene: {
				width: scene.width,
				height: scene.height,
				gridSize,
				fogOfWar: scene.fogOfWar,
				tokenVisionRevealsFog: scene.tokenVisionRevealsFog,
				fogData: scene.fogData,
			},
			visibleCells: isWarden ? null : fogVisibleCells,
			showExploredMemory: !isWarden,
		});
	}, [
		fogRenderRects,
		fogVisibleCells,
		gridSize,
		isWarden,
		scene.fogData,
		scene.fogOfWar,
		scene.height,
		scene.tokenVisionRevealsFog,
		scene.width,
	]);
	const renderTokens = useMemo(() => {
		if (isWarden) return tokens;
		return tokens.filter((token) => {
			if (!token.visible) return false;
			return isVttTokenVisibleThroughFog(
				token,
				{
					width: scene.width,
					height: scene.height,
					gridSize,
					fogOfWar: scene.fogOfWar,
					tokenVisionRevealsFog: scene.tokenVisionRevealsFog,
					fogData: scene.fogData,
				},
				fogVisibleCells,
			);
		});
	}, [
		fogVisibleCells,
		gridSize,
		isWarden,
		scene.fogData,
		scene.fogOfWar,
		scene.height,
		scene.tokenVisionRevealsFog,
		scene.width,
		tokens,
	]);
	const step = gridSize * zoom;

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
			{sceneLights.length > 0 && (
				<div
					className="absolute inset-0 pointer-events-none z-[2]"
					data-testid="vtt-dom-fallback-lights"
				>
					{sceneLights
						.filter((light) => light.intensity > 0 && light.dimRadius > 0)
						.map((light) => {
							const radius = light.dimRadius * step;
							const brightStop =
								light.dimRadius > 0
									? Math.min(
											100,
											Math.max(0, (light.brightRadius / light.dimRadius) * 100),
										)
									: 0;
							return (
								<DynamicStyle
									key={`fallback-light-${light.id}`}
									className="absolute rounded-full"
									data-testid={`vtt-dom-fallback-light-${light.id}`}
									vars={{
										left: `${(light.x + 0.5) * step - radius}px`,
										top: `${(light.y + 0.5) * step - radius}px`,
										width: `${radius * 2}px`,
										height: `${radius * 2}px`,
										background: `radial-gradient(circle, ${toRgba(light.color, Math.min(0.75, light.intensity * 0.55))} 0%, ${toRgba(light.color, Math.min(0.35, light.intensity * 0.25))} ${brightStop}%, transparent 100%)`,
										"mix-blend-mode": "screen",
										opacity: Math.max(0, Math.min(1, light.intensity)),
									}}
								/>
							);
						})}
				</div>
			)}
			{sceneWalls.length > 0 && (
				<div
					className="absolute inset-0 pointer-events-none z-[2]"
					data-testid="vtt-dom-fallback-walls"
				>
					<svg className="absolute inset-0 h-full w-full overflow-visible">
						<title>Scene walls</title>
						{sceneWalls.map((wall) => {
							const isOpenDoor =
								wall.type === "door" &&
								(wall.state === "open" || wall.doorOpen === true);
							const stroke =
								isWarden && wall.type === "window"
									? "#38bdf8"
									: isWarden
										? "#ef4444"
										: "rgba(0,0,0,0.35)";
							return (
								<line
									key={wall.id}
									x1={wall.x1 * step}
									y1={wall.y1 * step}
									x2={wall.x2 * step}
									y2={wall.y2 * step}
									stroke={stroke}
									strokeWidth={isWarden ? 4 : 2}
									strokeLinecap="square"
									strokeDasharray={isOpenDoor ? "8 6" : undefined}
									opacity={isOpenDoor ? 0.45 : isWarden ? 0.85 : 0.3}
								/>
							);
						})}
					</svg>
				</div>
			)}
			{fogRects.length > 0 && (
				<div
					className="absolute inset-0 pointer-events-none z-[90]"
					data-testid="vtt-dom-fallback-fog"
				>
					{fogRects.map((rect) => (
						<DynamicStyle
							key={`fallback-fog-${rect.state}-${rect.rx}-${rect.ry}-${rect.width}-${rect.height}`}
							className="absolute"
							vars={{
								left: `${rect.rx * gridSize * zoom}px`,
								top: `${rect.ry * gridSize * zoom}px`,
								width: `${rect.width * gridSize * zoom}px`,
								height: `${rect.height * gridSize * zoom}px`,
								opacity: isWarden
									? VTT_WARDEN_HIDDEN_FOG_OPACITY
									: rect.opacity,
								"background-color":
									rect.state === "hidden" ? "#000000" : "#1a1510",
							}}
						/>
					))}
				</div>
			)}
			<div className="absolute inset-0 z-[3]">
				{renderTokens.map((token) => {
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
					const isSelected =
						activeTokenId === token.id || activeTokenIds.includes(token.id);
					const isTargeted = targetedTokenIds.includes(token.id);
					const borderColor =
						activeInitiativeTokenId === token.id
							? "#10b981"
							: isSelected
								? "#fbbf24"
								: token.borderColor || token.color || "hsl(var(--primary))";
					const borderWidth =
						activeInitiativeTokenId === token.id
							? "4px"
							: isSelected
								? "3px"
								: "2px";
					const tokenBackground = isOverlayToken
						? "transparent"
						: token.color
							? `${token.color}40`
							: "rgba(0,0,0,0.18)";
					const imageScale = token.imageScale ?? 1;
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
								const additive =
									event.shiftKey || event.ctrlKey || event.metaKey;
								if (onTokenPointerSelect) {
									onTokenPointerSelect(token.id, additive);
								} else {
									setActiveTokenId(token.id);
								}
							}}
							title={`${token.name}${token.hp !== undefined && token.maxHp !== undefined ? ` (${token.hp}/${token.maxHp} HP)` : ""}`}
						>
							<DynamicStyle
								className={cn(
									"flex h-full w-full items-center justify-center text-white font-semibold",
									isOverlayToken ? "overflow-visible" : "overflow-hidden",
									!isOverlayToken && "rounded-full border-solid",
								)}
								vars={{
									"background-color": tokenBackground,
									"border-color": borderColor,
									"border-width": isOverlayToken ? 0 : borderWidth,
									"box-shadow": isTargeted
										? "0 0 0 3px rgba(239,68,68,0.9), 0 0 12px rgba(239,68,68,0.65)"
										: isSelected || activeInitiativeTokenId === token.id
											? `0 0 0 1px ${borderColor}`
											: undefined,
									opacity: token.render?.opacity ?? 1,
									"font-size": `${Math.max(14, Math.round(Math.max(width, height) * 0.35))}px`,
									transform:
										imageScale === 1 ? undefined : `scale(${imageScale})`,
									"transform-origin": "center",
									"mix-blend-mode": token.render?.blendMode ?? "normal",
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
