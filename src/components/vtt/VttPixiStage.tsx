import { useEffect, useMemo, useRef } from 'react';
import {
  Application,
  Container,
  Graphics,
  Sprite,
  Text,
  Assets,
} from 'pixi.js';

type TokenBlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'lighten'
  | 'darken'
  | 'color-dodge'
  | 'plus-lighter';

type PlacedToken = {
  id: string;
  tokenType?: 'character' | 'monster' | 'npc' | 'prop' | 'effect' | 'custom';
  name: string;
  emoji?: string;
  imageUrl?: string;
  color?: string;
  size: 'small' | 'medium' | 'large' | 'huge';
  x: number;
  y: number;
  rotation: number;
  layer: number;
  locked: boolean;
  visible: boolean;
  render?: {
    mode?: 'token' | 'overlay';
    opacity?: number;
    blendMode?: TokenBlendMode;
  };
};

type SceneLike = {
  width: number;
  height: number;
  backgroundImage?: string;
  backgroundScale?: number;
  backgroundOffsetX?: number;
  backgroundOffsetY?: number;
  fogOfWar: boolean;
  fogData?: boolean[][];
};

type VttPixiStageProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scene: SceneLike | null;
  tokens: PlacedToken[];
  gridSize: number;
  zoom: number;
  showGrid: boolean;
  isGM: boolean;
  effectiveVisibleLayers: Record<number, boolean>;
  activeTokenId: string | null;
  setActiveTokenId: (id: string | null) => void;
  updateToken: (tokenId: string, updates: Partial<PlacedToken>) => void;
  onRequestZoom: (nextZoom: number) => void;
  onTokenDragStart?: (tokenId: string) => void;
  onTokenDragEnd?: (tokenId: string) => void;
};

const SIZE_VALUES: Record<PlacedToken['size'], number> = {
  small: 32,
  medium: 48,
  large: 64,
  huge: 96,
};

const blendModeToPixi = (mode?: TokenBlendMode) => mode ?? 'normal';

export function VttPixiStage({
  containerRef,
  scene,
  tokens,
  gridSize,
  zoom,
  showGrid,
  isGM,
  effectiveVisibleLayers,
  activeTokenId,
  setActiveTokenId,
  updateToken,
  onRequestZoom,
  onTokenDragStart,
  onTokenDragEnd,
}: VttPixiStageProps) {
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);

  const longPressRef = useRef<{ tokenId: string; timer: number; pointerId: number } | null>(null);

  const worldSize = useMemo(() => {
    const w = (scene?.width ?? 0) * gridSize * zoom;
    const h = (scene?.height ?? 0) * gridSize * zoom;
    return { w, h };
  }, [gridSize, scene?.height, scene?.width, zoom]);

  const dragStateRef = useRef<{ tokenId: string; pointerId: number } | null>(null);
  const scrollDragRef = useRef<{ pointerId: number; startX: number; startY: number; startLeft: number; startTop: number } | null>(null);
  const pointersRef = useRef<Map<number, PointerEvent>>(new Map());
  const pinchRef = useRef<{
    aId: number;
    bId: number;
    startDist: number;
    startZoom: number;
    centerClientX: number;
    centerClientY: number;
  } | null>(null);

  useEffect(() => {
    if (!canvasHostRef.current) return;
    if (appRef.current) return;

    const app = new Application();
    appRef.current = app;

    let destroyed = false;

    (async () => {
      try {
        await app.init({
          backgroundAlpha: 0,
          antialias: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          autoDensity: true,
          width: Math.max(1, Math.floor(worldSize.w)),
          height: Math.max(1, Math.floor(worldSize.h)),
        });
      } catch {
        return;
      }

      if (destroyed) {
        try {
          app.destroy();
        } catch {
          // ignore
        }
        return;
      }

      app.canvas.style.display = 'block';
      app.canvas.style.width = '100%';
      app.canvas.style.height = '100%';
      app.canvas.style.touchAction = 'none';

      canvasHostRef.current?.appendChild(app.canvas);
    })();

    return () => {
      destroyed = true;
      if (appRef.current) {
        try {
          appRef.current.destroy(true);
        } catch {
          // ignore
        }
        appRef.current = null;
      }
    };
  }, [worldSize.h, worldSize.w]);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    app.renderer.resize(Math.max(1, Math.floor(worldSize.w)), Math.max(1, Math.floor(worldSize.h)));
  }, [worldSize.h, worldSize.w]);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    const stage = app.stage;
    stage.removeChildren();

    const root = new Container();
    stage.addChild(root);

    const bg = new Container();
    const grid = new Container();
    const drawings = new Container();
    const tokenLayer = new Container();
    const fog = new Container();

    root.addChild(bg);
    root.addChild(grid);
    root.addChild(drawings);
    root.addChild(tokenLayer);
    root.addChild(fog);

    const renderBackground = async () => {
      bg.removeChildren();
      if (!scene?.backgroundImage || !effectiveVisibleLayers[0]) return;

      try {
        const texture = await Assets.load(scene.backgroundImage);
        const sprite = Sprite.from(texture as any);
        sprite.x = (scene.backgroundOffsetX ?? 0) * zoom;
        sprite.y = (scene.backgroundOffsetY ?? 0) * zoom;
        const scale = scene.backgroundScale ?? 1;
        sprite.scale.set(scale);
        sprite.width = (scene.width ?? 0) * gridSize * zoom * scale;
        sprite.height = (scene.height ?? 0) * gridSize * zoom * scale;
        sprite.alpha = 0.95;
        bg.addChild(sprite);
      } catch {
        // ignore
      }
    };

    const renderGrid = () => {
      grid.removeChildren();
      if (!showGrid) return;

      const g = new Graphics();
      g.alpha = 0.2;
      const color = 0xffffff;
      const step = gridSize * zoom;
      const width = (scene?.width ?? 0) * step;
      const height = (scene?.height ?? 0) * step;

      g.stroke({ width: 1, color, alpha: 0.25 });
      for (let x = 0; x <= width; x += step) {
        g.moveTo(x, 0);
        g.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += step) {
        g.moveTo(0, y);
        g.lineTo(width, y);
      }
      grid.addChild(g);
    };

    const renderFog = () => {
      fog.removeChildren();
      if (!scene?.fogOfWar || !scene.fogData) return;

      const fg = new Graphics();
      fg.alpha = isGM ? 0.5 : 0.85;
      const step = gridSize * zoom;
      fg.beginFill(0x000000, 0.8);

      for (let y = 0; y < scene.fogData.length; y += 1) {
        const row = scene.fogData[y];
        if (!row) continue;
        for (let x = 0; x < row.length; x += 1) {
          if (row[x]) continue;
          fg.drawRect(x * step, y * step, step, step);
        }
      }

      fg.endFill();
      fog.addChild(fg);
    };

    const renderTokens = async () => {
      tokenLayer.removeChildren();

      const visible = tokens.filter((token) => {
        if (!effectiveVisibleLayers[token.layer]) return false;
        return isGM ? true : token.visible;
      });

      for (const token of visible) {
        const size = SIZE_VALUES[token.size] * zoom;
        const isOverlayToken =
          token.render?.mode === 'overlay' ||
          token.tokenType === 'effect' ||
          token.tokenType === 'prop' ||
          (!!token.imageUrl &&
            (token.imageUrl.includes('/generated/props/') || token.imageUrl.includes('/generated/effects/')));

        const container = new Container();
        container.x = token.x * gridSize * zoom;
        container.y = token.y * gridSize * zoom;
        container.width = size;
        container.height = size;
        container.rotation = (token.rotation * Math.PI) / 180;
        container.zIndex = token.layer * 10 + 10;
        container.eventMode = 'static';
        container.cursor = token.locked || !isGM ? 'default' : 'pointer';

        const tokenBg = new Graphics();
        if (!isOverlayToken) {
          const borderColor = token.color ? Number(token.color.replace('#', '0x')) : 0x3b82f6;
          tokenBg.circle(size / 2, size / 2, size / 2);
          tokenBg.fill({ color: token.color ? Number(token.color.replace('#', '0x')) : 0x000000, alpha: token.color ? 0.25 : 0.12 });
          tokenBg.stroke({ width: 2, color: borderColor, alpha: 0.9 });
          if (activeTokenId === token.id) {
            tokenBg.stroke({ width: 3, color: 0xfbbf24, alpha: 0.9 });
          }
        }
        container.addChild(tokenBg);

        if (token.imageUrl) {
          try {
            const texture = await Assets.load(token.imageUrl);
            const sprite = Sprite.from(texture as any);
            sprite.width = size;
            sprite.height = size;
            sprite.anchor.set(0);
            sprite.alpha = token.render?.opacity ?? 1;
            sprite.blendMode = blendModeToPixi(token.render?.blendMode) as any;
            if (!isOverlayToken) {
              sprite.mask = tokenBg;
            }
            sprite.scale.set(1);
            tokenLayer.addChild(container);
            container.addChild(sprite);
          } catch {
            const text = new Text({ text: token.emoji || '@', style: { fill: 0xffffff, fontSize: size * 0.4 } });
            text.x = size / 2;
            text.y = size / 2;
            text.anchor.set(0.5);
            container.addChild(text);
            tokenLayer.addChild(container);
          }
        } else {
          const text = new Text({ text: token.emoji || '@', style: { fill: 0xffffff, fontSize: size * 0.4 } });
          text.x = size / 2;
          text.y = size / 2;
          text.anchor.set(0.5);
          container.addChild(text);
          tokenLayer.addChild(container);
        }

        container.on('pointerdown', (e) => {
          e.stopPropagation();
          setActiveTokenId(token.id);
          window.dispatchEvent(
            new CustomEvent('vtt:token-pointerdown', {
              detail: { tokenId: token.id, pointerType: e.pointerType },
            })
          );
          if (!isGM || token.locked) return;

          if (e.pointerType === 'touch') {
            if (longPressRef.current) {
              window.clearTimeout(longPressRef.current.timer);
              longPressRef.current = null;
            }
            const timer = window.setTimeout(() => {
              updateToken(token.id, { rotation: (token.rotation + 90) % 360 });
              longPressRef.current = null;
            }, 550);
            longPressRef.current = { tokenId: token.id, timer, pointerId: e.pointerId };
          }

          dragStateRef.current = { tokenId: token.id, pointerId: e.pointerId };
          onTokenDragStart?.(token.id);
        });
      }

      tokenLayer.sortableChildren = true;
    };

    void renderBackground();
    renderGrid();
    renderFog();
    void renderTokens();

    return () => {
      stage.removeChildren();
    };
  }, [
    activeTokenId,
    effectiveVisibleLayers,
    gridSize,
    isGM,
    scene,
    setActiveTokenId,
    showGrid,
    tokens,
    zoom,
    worldSize.h,
    worldSize.w,
  ]);

  useEffect(() => {
    const host = canvasHostRef.current;
    const app = appRef.current;
    if (!host || !app) return;

    const handlePointerMove = (e: PointerEvent) => {
      const dragState = dragStateRef.current;
      if (dragState && dragState.pointerId === e.pointerId) {
        if (longPressRef.current && longPressRef.current.pointerId === e.pointerId) {
          window.clearTimeout(longPressRef.current.timer);
          longPressRef.current = null;
        }
        if (scrollDragRef.current && scrollDragRef.current.pointerId === e.pointerId) {
          scrollDragRef.current = null;
        }
        const rect = host.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const gx = Math.floor(x / (gridSize * zoom));
        const gy = Math.floor(y / (gridSize * zoom));
        updateToken(dragState.tokenId, { x: gx, y: gy });
        return;
      }

      const scrollDrag = scrollDragRef.current;
      if (scrollDrag && scrollDrag.pointerId === e.pointerId && containerRef.current) {
        const dx = e.clientX - scrollDrag.startX;
        const dy = e.clientY - scrollDrag.startY;
        containerRef.current.scrollLeft = scrollDrag.startLeft - dx;
        containerRef.current.scrollTop = scrollDrag.startTop - dy;
      }

      const pinch = pinchRef.current;
      if (pinch) {
        const a = pointersRef.current.get(pinch.aId);
        const b = pointersRef.current.get(pinch.bId);
        if (!a || !b) return;
        const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (pinch.startDist <= 0) return;
        const ratio = dist / pinch.startDist;
        const nextZoom = Math.max(0.5, Math.min(2, pinch.startZoom * ratio));
        onRequestZoom(nextZoom);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dragState = dragStateRef.current;
      if (dragState && dragState.pointerId === e.pointerId) {
        dragStateRef.current = null;
        onTokenDragEnd?.(dragState.tokenId);
      }

      if (longPressRef.current && longPressRef.current.pointerId === e.pointerId) {
        window.clearTimeout(longPressRef.current.timer);
        longPressRef.current = null;
      }

      const scrollDrag = scrollDragRef.current;
      if (scrollDrag && scrollDrag.pointerId === e.pointerId) {
        scrollDragRef.current = null;
      }

      pointersRef.current.delete(e.pointerId);

      const pinch = pinchRef.current;
      if (pinch && (pinch.aId === e.pointerId || pinch.bId === e.pointerId)) {
        pinchRef.current = null;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointersRef.current.set(e.pointerId, e);

      if (pointersRef.current.size === 2) {
        const entries = [...pointersRef.current.values()];
        const a = entries[0];
        const b = entries[1];
        pinchRef.current = {
          aId: a.pointerId,
          bId: b.pointerId,
          startDist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
          startZoom: zoom,
          centerClientX: (a.clientX + b.clientX) / 2,
          centerClientY: (a.clientY + b.clientY) / 2,
        };
        return;
      }

      if (containerRef.current && e.pointerType !== 'mouse' && pointersRef.current.size >= 2) {
        scrollDragRef.current = {
          pointerId: e.pointerId,
          startX: e.clientX,
          startY: e.clientY,
          startLeft: containerRef.current.scrollLeft,
          startTop: containerRef.current.scrollTop,
        };
      }
    };

    const handlePointerUpdate = (e: PointerEvent) => {
      if (pointersRef.current.has(e.pointerId)) {
        pointersRef.current.set(e.pointerId, e);
      }
    };

    host.addEventListener('pointerdown', handlePointerDown);
    host.addEventListener('pointermove', handlePointerUpdate);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      host.removeEventListener('pointerdown', handlePointerDown);
      host.removeEventListener('pointermove', handlePointerUpdate);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [containerRef, gridSize, onRequestZoom, onTokenDragEnd, onTokenDragStart, updateToken, zoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 1) return;
      e.preventDefault();
      const direction = e.deltaY > 0 ? -1 : 1;
      const nextZoom = Math.max(0.5, Math.min(2, zoom + direction * 0.1));
      onRequestZoom(nextZoom);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel as any);
    };
  }, [containerRef, onRequestZoom, zoom]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    host.addEventListener('contextmenu', handleContextMenu);
    return () => {
      host.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div
      ref={canvasHostRef}
      className="w-full h-full relative"
    />
  );
}
