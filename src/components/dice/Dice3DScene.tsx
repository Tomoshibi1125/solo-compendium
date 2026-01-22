import { useRef, useState, useEffect, useMemo, useCallback, type CSSProperties } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera as DreiPerspectiveCamera, Sparkles } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider, ConvexHullCollider, type RapierRigidBody } from '@react-three/rapier';
import { init as initRapier } from '@dimforge/rapier3d-compat';
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  DoubleSide,
  EdgesGeometry,
  Euler,
  Group,
  LineBasicMaterial,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Quaternion,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
} from 'three';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DICE_THEMES, type DiceTheme } from '@/components/dice/diceThemes';
import { DiceAudioEngine } from '@/lib/dice/audio';
import { getDieModel } from '@/components/dice/diceGeometry';
import { usePerformanceProfile } from '@/lib/performanceProfile';
import { initThreeLoaders } from '@/lib/three/loaders';

interface Dice3DProps {
  sides: number;
  value: number | null;
  displayValue?: number | null;
  displayMode?: DiceDisplayMode;
  isRolling: boolean;
  onRollComplete?: (value: number) => void;
  position: [number, number, number];
  rotation?: [number, number, number];
  theme?: DiceTheme;
}

interface DiceBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  floor: number;
  spawnY: number;
}

type ImpactFX = {
  id: string;
  position: [number, number, number];
  intensity: number;
};

type DiceRenderQuality = {
  dpr: [number, number];
  antialias: boolean;
  powerPreference: WebGLPowerPreference;
  enableShadows: boolean;
  shadowMapSize: number;
  enableContactShadows: boolean;
  contactShadowBlur: number;
  contactShadowOpacity: number;
  enableEnvironment: boolean;
  enableBloomField: boolean;
  enableFlair: boolean;
  particleScale: number;
};

const DEFAULT_RENDER_QUALITY: DiceRenderQuality = {
  dpr: [1, 1.5],
  antialias: true,
  powerPreference: 'high-performance',
  enableShadows: true,
  shadowMapSize: 1024,
  enableContactShadows: true,
  contactShadowBlur: 2.8,
  contactShadowOpacity: 0.42,
  enableEnvironment: true,
  enableBloomField: true,
  enableFlair: true,
  particleScale: 1,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const hexToRgba = (hex: string, alpha: number) => {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type DiceDisplayMode = 'standard' | 'percentile-tens' | 'percentile-ones';

const LABEL_SIZES: Record<number, number> = {
  4: 0.62,
  6: 0.6,
  8: 0.56,
  10: 0.54,
  12: 0.52,
  20: 0.46,
  100: 0.54,
};

const UP = new Vector3(0, 1, 0);
const labelTextureCache = new Map<string, CanvasTexture>();
const sigilTextureCache = new Map<string, CanvasTexture>();
const bloomTextureCache = new Map<string, CanvasTexture>();
const bloomFieldTextureCache = new Map<string, CanvasTexture>();

if (typeof window !== 'undefined') {
  const warnKey = '__rapierInitWarningFiltered__';
  const globalScope = globalThis as typeof globalThis & { [key: string]: boolean | undefined };
  if (!globalScope[warnKey]) {
    globalScope[warnKey] = true;
    const originalWarn = console.warn.bind(console);
    console.warn = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('deprecated parameters for the initialization function')
      ) {
        return;
      }
      originalWarn(...args);
    };
  }
  void initRapier().catch(() => undefined);
}

type LabelBadge = 'tens' | 'ones' | null;

type LabelStyle = {
  fill: string;
  stroke: string;
  plate: string;
  plateStroke: string;
  badge: LabelBadge;
  badgeColor: string;
};

const buildLabelStyle = (themeConfig: (typeof DICE_THEMES)[DiceTheme], mode: DiceDisplayMode): LabelStyle => {
  const accent = themeConfig.accentColor ?? themeConfig.emissiveColor;
  const badge = mode === 'percentile-tens' ? 'tens' : mode === 'percentile-ones' ? 'ones' : null;
  const badgeColor = mode === 'percentile-ones' ? themeConfig.particleColor : accent;
  const stroke = mode === 'percentile-ones' ? themeConfig.particleColor : accent;

  return {
    fill: '#f8fafc',
    stroke,
    plate: 'rgba(6, 8, 12, 0.72)',
    plateStroke: hexToRgba(accent, 0.6),
    badge,
    badgeColor,
  };
};

type SigilSpec =
  | { kind: 'polygon'; sides: number; rotation?: number }
  | { kind: 'star'; points: number; rotation?: number }
  | { kind: 'double-ring' };

type DieFlairSpec = {
  sigil: SigilSpec;
  tickCount: number;
  ringCount: number;
  ringScale: number;
  ringTilt: number;
  ringOpacity: number;
  glyphScale: number;
  glyphOpacity: number;
  floatHeight: number;
  orbitSpeed: number;
  edgeOpacity: number;
  particleBoost?: number;
};

const DEFAULT_DIE_FLAIR: DieFlairSpec = {
  sigil: { kind: 'polygon', sides: 6 },
  tickCount: 6,
  ringCount: 1,
  ringScale: 1.2,
  ringTilt: 0.45,
  ringOpacity: 0.28,
  glyphScale: 0.95,
  glyphOpacity: 0.55,
  floatHeight: 0.34,
  orbitSpeed: 0.7,
  edgeOpacity: 0.22,
};

const DIE_FLAIR: Record<number, DieFlairSpec> = {
  4: {
    sigil: { kind: 'polygon', sides: 3 },
    tickCount: 3,
    ringCount: 1,
    ringScale: 1.1,
    ringTilt: 0.55,
    ringOpacity: 0.32,
    glyphScale: 0.9,
    glyphOpacity: 0.6,
    floatHeight: 0.32,
    orbitSpeed: 0.95,
    edgeOpacity: 0.24,
    particleBoost: 1.05,
  },
  6: {
    sigil: { kind: 'polygon', sides: 4 },
    tickCount: 4,
    ringCount: 2,
    ringScale: 1.2,
    ringTilt: 0.4,
    ringOpacity: 0.26,
    glyphScale: 0.98,
    glyphOpacity: 0.55,
    floatHeight: 0.32,
    orbitSpeed: 0.8,
    edgeOpacity: 0.2,
  },
  8: {
    sigil: { kind: 'polygon', sides: 4, rotation: Math.PI / 4 },
    tickCount: 6,
    ringCount: 1,
    ringScale: 1.18,
    ringTilt: 0.45,
    ringOpacity: 0.3,
    glyphScale: 0.95,
    glyphOpacity: 0.58,
    floatHeight: 0.34,
    orbitSpeed: 0.78,
    edgeOpacity: 0.22,
  },
  10: {
    sigil: { kind: 'polygon', sides: 10 },
    tickCount: 10,
    ringCount: 2,
    ringScale: 1.25,
    ringTilt: 0.5,
    ringOpacity: 0.26,
    glyphScale: 0.9,
    glyphOpacity: 0.55,
    floatHeight: 0.36,
    orbitSpeed: 0.9,
    edgeOpacity: 0.24,
  },
  12: {
    sigil: { kind: 'polygon', sides: 5 },
    tickCount: 8,
    ringCount: 1,
    ringScale: 1.22,
    ringTilt: 0.42,
    ringOpacity: 0.28,
    glyphScale: 0.96,
    glyphOpacity: 0.56,
    floatHeight: 0.35,
    orbitSpeed: 0.76,
    edgeOpacity: 0.23,
  },
  20: {
    sigil: { kind: 'star', points: 6 },
    tickCount: 12,
    ringCount: 2,
    ringScale: 1.32,
    ringTilt: 0.6,
    ringOpacity: 0.32,
    glyphScale: 1.05,
    glyphOpacity: 0.62,
    floatHeight: 0.4,
    orbitSpeed: 1.05,
    edgeOpacity: 0.3,
    particleBoost: 1.15,
  },
  100: {
    sigil: { kind: 'double-ring' },
    tickCount: 10,
    ringCount: 2,
    ringScale: 1.3,
    ringTilt: 0.5,
    ringOpacity: 0.26,
    glyphScale: 0.92,
    glyphOpacity: 0.52,
    floatHeight: 0.36,
    orbitSpeed: 0.88,
    edgeOpacity: 0.22,
  },
};

const drawPolygon = (
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
  sides: number,
  rotation = -Math.PI / 2
) => {
  ctx.beginPath();
  for (let i = 0; i < sides; i += 1) {
    const angle = rotation + (Math.PI * 2 * i) / sides;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
};

const drawStar = (
  ctx: CanvasRenderingContext2D,
  center: number,
  outerRadius: number,
  innerRadius: number,
  points: number,
  rotation = -Math.PI / 2
) => {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = rotation + (Math.PI * i) / points;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
};

const getLabelTexture = (label: string, style: LabelStyle) => {
  const key = [
    label,
    style.fill,
    style.stroke,
    style.plate,
    style.plateStroke,
    style.badge ?? 'none',
    style.badgeColor,
  ].join('|');
  const cached = labelTextureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Dice label canvas not supported');
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const center = canvas.width / 2;
  const plateRadius = 96;
  const fontSize = label.length > 1 ? 118 : 148;

  ctx.fillStyle = style.plate;
  ctx.beginPath();
  ctx.arc(center, center, plateRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 8;
  ctx.strokeStyle = style.plateStroke;
  ctx.stroke();

  const highlight = ctx.createRadialGradient(center - 36, center - 42, 18, center, center, plateRadius);
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = highlight;
  ctx.beginPath();
  ctx.arc(center, center, plateRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `900 ${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 16;
  ctx.strokeStyle = style.stroke;
  ctx.strokeText(label, center, center);

  ctx.fillStyle = style.fill;
  ctx.fillText(label, center, center);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  ctx.fillText(label, center, center);

  if (style.badge) {
    const badgeOffsetX = style.badge === 'tens' ? 46 : -46;
    const badgeOffsetY = 46;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = style.badgeColor;
    ctx.beginPath();
    ctx.arc(center + badgeOffsetX, center + badgeOffsetY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  const texture = new CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  labelTextureCache.set(key, texture);
  return texture;
};

const getBloomTexture = (themeConfig: (typeof DICE_THEMES)[DiceTheme]) => {
  const accent = themeConfig.accentColor ?? themeConfig.emissiveColor;
  const key = `${accent}|${themeConfig.particleColor}`;
  const cached = bloomTextureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Dice bloom canvas not supported');
  }
  const center = canvas.width / 2;
  const gradient = ctx.createRadialGradient(center, center, 10, center, center, 120);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
  gradient.addColorStop(0.2, hexToRgba(accent, 0.45));
  gradient.addColorStop(0.55, hexToRgba(themeConfig.particleColor, 0.22));
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.anisotropy = 2;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  bloomTextureCache.set(key, texture);
  return texture;
};

const getBloomFieldTexture = (themeConfig: (typeof DICE_THEMES)[DiceTheme]) => {
  const accent = themeConfig.accentColor ?? themeConfig.emissiveColor;
  const key = `${accent}|${themeConfig.particleColor}|field`;
  const cached = bloomFieldTextureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Dice bloom field canvas not supported');
  }
  const center = canvas.width / 2;
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, 220);
  gradient.addColorStop(0, hexToRgba(accent, 0.36));
  gradient.addColorStop(0.35, hexToRgba(themeConfig.particleColor, 0.24));
  gradient.addColorStop(0.65, hexToRgba(accent, 0.12));
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  bloomFieldTextureCache.set(key, texture);
  return texture;
};

const getSigilTexture = (sides: number, themeConfig: (typeof DICE_THEMES)[DiceTheme]) => {
  const accent = themeConfig.accentColor ?? themeConfig.emissiveColor;
  const key = `${sides}|${accent}|${themeConfig.particleColor}`;
  const cached = sigilTextureCache.get(key);
  if (cached) return cached;

  const spec = DIE_FLAIR[sides] ?? DEFAULT_DIE_FLAIR;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Dice sigil canvas not supported');
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const center = canvas.width / 2;
  const baseRadius = 86;
  const glow = ctx.createRadialGradient(center, center, 10, center, center, 120);
  glow.addColorStop(0, hexToRgba(accent, 0.35));
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = hexToRgba(accent, 0.85);
  ctx.lineWidth = 8;
  ctx.shadowColor = hexToRgba(accent, 0.5);
  ctx.shadowBlur = 14;

  if (spec.sigil.kind === 'double-ring') {
    ctx.beginPath();
    ctx.arc(center, center, baseRadius * 0.9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(center, center, baseRadius * 0.55, 0, Math.PI * 2);
    ctx.stroke();
  } else if (spec.sigil.kind === 'star') {
    const rotation = spec.sigil.rotation ?? -Math.PI / 2;
    drawStar(ctx, center, baseRadius, baseRadius * 0.5, spec.sigil.points, rotation);
  } else {
    const rotation = spec.sigil.rotation ?? -Math.PI / 2;
    drawPolygon(ctx, center, baseRadius, spec.sigil.sides, rotation);
  }

  ctx.shadowBlur = 0;
  ctx.lineWidth = 4;
  ctx.strokeStyle = hexToRgba(themeConfig.particleColor, 0.55);
  const tickCount = Math.max(3, spec.tickCount);
  for (let i = 0; i < tickCount; i += 1) {
    const angle = (Math.PI * 2 * i) / tickCount;
    const inner = baseRadius + 8;
    const outer = baseRadius + 20;
    ctx.beginPath();
    ctx.moveTo(center + Math.cos(angle) * inner, center + Math.sin(angle) * inner);
    ctx.lineTo(center + Math.cos(angle) * outer, center + Math.sin(angle) * outer);
    ctx.stroke();
  }

  ctx.fillStyle = hexToRgba(themeConfig.particleColor, 0.6);
  ctx.beginPath();
  ctx.arc(center, center, 6, 0, Math.PI * 2);
  ctx.fill();

  const texture = new CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  sigilTextureCache.set(key, texture);
  return texture;
};

const formatFaceLabel = (sides: number, value: number, mode: DiceDisplayMode) => {
  if (sides === 10 && mode === 'percentile-tens') {
    return value === 10 ? '00' : String(value * 10);
  }
  if (sides === 10 && mode === 'percentile-ones') {
    return value === 10 ? '0' : String(value);
  }
  if (sides === 10 && mode === 'standard') {
    return value === 10 ? '10' : String(value);
  }
  return String(value);
};

const resolveDisplayValue = (sides: number, value: number | null, mode: DiceDisplayMode) => {
  if (value === null) return null;
  if (sides === 10 && value === 0 && mode !== 'standard') {
    return 10;
  }
  return value;
};

function DiceParticles({
  position,
  theme,
  isActive,
  intensity = 1,
}: {
  position: [number, number, number];
  theme: DiceTheme;
  isActive: boolean;
  intensity?: number;
}) {
  const themeConfig = DICE_THEMES[theme];

  if (!isActive) return null;

  return (
    <Sparkles
      count={Math.round(20 * intensity)}
      scale={2}
      size={1.6 * intensity}
      speed={0.5 + intensity * 0.2}
      color={themeConfig.particleColor}
      position={position}
      opacity={0.8}
    />
  );
}

function ImpactRing({
  position,
  intensity,
  color,
  onComplete,
}: {
  position: [number, number, number];
  intensity: number;
  color: string;
  onComplete: () => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const startRef = useRef(performance.now());

  useEffect(() => {
    const timeout = window.setTimeout(onComplete, 450);
    return () => window.clearTimeout(timeout);
  }, [onComplete]);

  useFrame(() => {
    if (!meshRef.current) return;
    const elapsed = (performance.now() - startRef.current) / 1000;
    const progress = clamp(elapsed / 0.45, 0, 1);
    const scale = 0.35 + progress * (1.8 + intensity);
    meshRef.current.scale.set(scale, scale, scale);
    const material = meshRef.current.material as MeshBasicMaterial;
    material.opacity = (1 - progress) * 0.6 * intensity;
  });

  return (
    <mesh ref={meshRef} position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.2, 0.32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

function ImpactFlash({
  position,
  intensity,
  color,
}: {
  position: [number, number, number];
  intensity: number;
  color: string;
}) {
  const lightRef = useRef<PointLight>(null);
  const startRef = useRef(performance.now());

  useFrame(() => {
    if (!lightRef.current) return;
    const elapsed = (performance.now() - startRef.current) / 1000;
    const progress = clamp(elapsed / 0.35, 0, 1);
    lightRef.current.intensity = (1 - progress) * (2.2 + intensity * 2.6);
  });

  return <pointLight ref={lightRef} position={[position[0], 0.9, position[2]]} distance={5} color={color} intensity={0} />;
}

function DiceTrayColliders({
  width,
  height,
  wallHeight,
}: {
  width: number;
  height: number;
  wallHeight: number;
}) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const wallThickness = 0.4;
  const floorThickness = 0.2;

  const colliderProps = { restitution: 0.32, friction: 0.75 };

  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider
        args={[halfWidth, floorThickness / 2, halfHeight]}
        position={[0, -floorThickness / 2, 0]}
        {...colliderProps}
      />
      <CuboidCollider
        args={[halfWidth, wallHeight / 2, wallThickness / 2]}
        position={[0, wallHeight / 2, -halfHeight]}
        {...colliderProps}
      />
      <CuboidCollider
        args={[halfWidth, wallHeight / 2, wallThickness / 2]}
        position={[0, wallHeight / 2, halfHeight]}
        {...colliderProps}
      />
      <CuboidCollider
        args={[wallThickness / 2, wallHeight / 2, halfHeight]}
        position={[-halfWidth, wallHeight / 2, 0]}
        {...colliderProps}
      />
      <CuboidCollider
        args={[wallThickness / 2, wallHeight / 2, halfHeight]}
        position={[halfWidth, wallHeight / 2, 0]}
        {...colliderProps}
      />
    </RigidBody>
  );
}

function DiceBloomField({
  width,
  height,
  theme,
}: {
  width: number;
  height: number;
  theme: DiceTheme;
}) {
  const themeConfig = DICE_THEMES[theme];
  const texture = useMemo(() => getBloomFieldTexture(themeConfig), [themeConfig]);
  const scaleFactor = themeConfig.bloomFieldScale ?? 1.35;
  const scale = useMemo(() => [width * scaleFactor, height * scaleFactor], [height, scaleFactor, width]);
  const opacity = clamp(themeConfig.bloomFieldOpacity ?? 0.42, 0.08, 0.7);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} renderOrder={-2}>
      <planeGeometry args={[scale[0], scale[1]]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function DieFlair({
  sides,
  theme,
  isActive,
}: {
  sides: number;
  theme: DiceTheme;
  isActive: boolean;
}) {
  const themeConfig = DICE_THEMES[theme];
  const spec = DIE_FLAIR[sides] ?? DEFAULT_DIE_FLAIR;
  const sigilTexture = useMemo(() => getSigilTexture(sides, themeConfig), [sides, themeConfig]);
  const groupRef = useRef<Group>(null);
  const ringMaterialsRef = useRef<Array<MeshBasicMaterial | null>>([]);
  const glyphMaterialRef = useRef<MeshBasicMaterial>(null);
  const timeRef = useRef(0);
  const accent = themeConfig.accentColor ?? themeConfig.emissiveColor;

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    const speed = spec.orbitSpeed * (isActive ? 1.15 : 0.65);
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.x = Math.sin(timeRef.current * 0.7 + sides) * spec.ringTilt;
    groupRef.current.rotation.z = Math.cos(timeRef.current * 0.55 + sides) * spec.ringTilt * 0.35;
    groupRef.current.position.y = spec.floatHeight + Math.sin(timeRef.current * 1.2) * 0.04;

    const pulse = 0.75 + Math.sin(timeRef.current * 2.1) * 0.12 + (isActive ? 0.1 : 0);
    ringMaterialsRef.current.forEach((material, index) => {
      if (!material) return;
      material.opacity = (spec.ringOpacity + index * 0.06) * pulse;
    });
    if (glyphMaterialRef.current) {
      glyphMaterialRef.current.opacity = spec.glyphOpacity * (0.7 + pulse * 0.3);
    }
  });

  return (
    <group ref={groupRef} position={[0, spec.floatHeight, 0]}>
      {Array.from({ length: spec.ringCount }).map((_, index) => (
        <mesh key={`ring-${sides}-${index}`} rotation={[Math.PI / 2, 0, (Math.PI / 2) * index]}>
          <ringGeometry args={[spec.ringScale * 0.62, spec.ringScale * 0.8, 64]} />
          <meshBasicMaterial
            ref={(material) => {
              ringMaterialsRef.current[index] = material;
            }}
            color={accent}
            transparent
            opacity={spec.ringOpacity}
            blending={AdditiveBlending}
            depthWrite={false}
            depthTest
            side={DoubleSide}
          />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
        <planeGeometry args={[spec.glyphScale, spec.glyphScale]} />
        <meshBasicMaterial
          ref={glyphMaterialRef}
          map={sigilTexture}
          transparent
          opacity={spec.glyphOpacity}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

interface DieProps extends Dice3DProps {
  bounds: DiceBounds;
  rollId: number;
  onImpact?: (position: [number, number, number], intensity: number) => void;
  quality: DiceRenderQuality;
}

function Die({
  sides,
  value,
  displayValue,
  displayMode = 'standard',
  isRolling,
  onRollComplete,
  position,
  rotation = [0, 0, 0],
  theme = 'umbral-ascendant',
  bounds,
  rollId,
  onImpact,
  quality,
}: DieProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<Mesh>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const themeConfig = DICE_THEMES[theme];
  const dieModel = useMemo(() => getDieModel(sides), [sides]);
  const labelScale = LABEL_SIZES[sides] ?? 0.45;
  const labelStyle = useMemo(() => buildLabelStyle(themeConfig, displayMode), [displayMode, themeConfig]);
  const flairSpec = DIE_FLAIR[sides] ?? DEFAULT_DIE_FLAIR;
  const edgeGeometry = useMemo(() => new EdgesGeometry(dieModel.geometry, 25), [dieModel.geometry]);
  const edgeMaterialRef = useRef<LineBasicMaterial>(null);
  const bloomMaterialRef = useRef<SpriteMaterial>(null);
  const bloomTexture = useMemo(() => getBloomTexture(themeConfig), [themeConfig]);
  const bloomScale = useMemo(() => 1.35 + flairSpec.ringScale * 0.7, [flairSpec.ringScale]);
  const timeRef = useRef(0);
  const settleTimerRef = useRef(0);
  const settledRef = useRef(false);
  const lastImpactRef = useRef(0);
  const yawRef = useRef(new Quaternion());

  const resolvedValue = resolveDisplayValue(sides, displayValue ?? value, displayMode);

  const alignToValue = useCallback(() => {
    if (!bodyRef.current || resolvedValue === null) return;
    const face = dieModel.faceByValue.get(resolvedValue);
    if (!face) return;
    const target = face.quaternion.clone().multiply(yawRef.current);
    bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    bodyRef.current.setRotation({ x: target.x, y: target.y, z: target.z, w: target.w }, true);
  }, [dieModel, resolvedValue]);

  const handleCollisionEnter = useCallback(() => {
    if (!bodyRef.current || !onImpact) return;
    const now = performance.now();
    if (now - lastImpactRef.current < 80) return;
    lastImpactRef.current = now;
    const linvel = bodyRef.current.linvel();
    const angvel = bodyRef.current.angvel();
    const linearSpeed = Math.hypot(linvel.x, linvel.y, linvel.z);
    const angularSpeed = Math.hypot(angvel.x, angvel.y, angvel.z);
    const intensity = clamp((linearSpeed + angularSpeed * 0.35) / 10, 0.1, 1);
    const pos = bodyRef.current.translation();
    onImpact([pos.x, bounds.floor, pos.z], intensity);
  }, [bounds.floor, onImpact]);

  useEffect(() => {
    if (!isRolling || !bodyRef.current) return;
    const body = bodyRef.current;
    setIsAnimating(true);
    settledRef.current = false;
    settleTimerRef.current = 0;
    yawRef.current = new Quaternion().setFromAxisAngle(UP, Math.random() * Math.PI * 2);

    const spawnX = clamp(position[0] + (Math.random() - 0.5) * 1.4, bounds.minX, bounds.maxX);
    const spawnZ = clamp(position[2] + (Math.random() - 0.5) * 1.4, bounds.minZ, bounds.maxZ);
    const spawnY = bounds.spawnY + Math.random() * 0.8;
    const randomRotation = new Quaternion().setFromEuler(
      new Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    );

    body.setTranslation({ x: spawnX, y: spawnY, z: spawnZ }, true);
    body.setRotation(
      { x: randomRotation.x, y: randomRotation.y, z: randomRotation.z, w: randomRotation.w },
      true
    );
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);

    const impulse = {
      x: (Math.random() - 0.5) * 8,
      y: 10 + Math.random() * 5,
      z: (Math.random() - 0.5) * 8,
    };
    const torque = {
      x: (Math.random() - 0.5) * 7,
      y: (Math.random() - 0.5) * 7,
      z: (Math.random() - 0.5) * 7,
    };
    body.applyImpulse(impulse, true);
    body.applyTorqueImpulse(torque, true);
  }, [bounds.maxX, bounds.maxZ, bounds.minX, bounds.minZ, bounds.spawnY, isRolling, position, rollId]);

  useFrame((_state, delta) => {
    if (!meshRef.current || !bodyRef.current) return;
    timeRef.current += delta;

    if (isAnimating) {
      const linvel = bodyRef.current.linvel();
      const angvel = bodyRef.current.angvel();
      const speed = Math.hypot(linvel.x, linvel.y, linvel.z);
      const angSpeed = Math.hypot(angvel.x, angvel.y, angvel.z);
      const isCalm = speed < 0.12 && angSpeed < 0.18;

      settleTimerRef.current = isCalm ? settleTimerRef.current + delta : 0;
      if (!settledRef.current && settleTimerRef.current > 0.45) {
        settledRef.current = true;
        setIsAnimating(false);
        if (resolvedValue !== null) {
          alignToValue();
        }
        if (value !== null && onRollComplete) {
          setTimeout(() => onRollComplete(value), 120);
        }
      }

      const pulse = Math.sin(timeRef.current * 6) * 0.2 + 0.8;
      const material = meshRef.current.material as MeshStandardMaterial;
      material.emissiveIntensity = themeConfig.glowIntensity * pulse;
      material.emissive = new Color(themeConfig.emissiveColor).multiplyScalar(0.5 + pulse * 0.5);

      if (edgeMaterialRef.current) {
        edgeMaterialRef.current.opacity = flairSpec.edgeOpacity * (0.85 + pulse * 0.4);
      }
      if (bloomMaterialRef.current) {
        bloomMaterialRef.current.opacity = clamp(0.18 + pulse * 0.12, 0.08, 0.35);
      }
    } else if (sides === 20 && (value === 20 || value === 1)) {
      const pulse = Math.sin(timeRef.current * 2) * 0.1 + 0.9;
      const material = meshRef.current.material as MeshStandardMaterial;
      material.emissiveIntensity = themeConfig.glowIntensity * pulse;
      if (edgeMaterialRef.current) {
        edgeMaterialRef.current.opacity = flairSpec.edgeOpacity * (0.9 + pulse * 0.3);
      }
      if (bloomMaterialRef.current) {
        bloomMaterialRef.current.opacity = clamp(0.24 + pulse * 0.18, 0.1, 0.45);
      }
    } else if (edgeMaterialRef.current) {
      edgeMaterialRef.current.opacity = flairSpec.edgeOpacity;
      if (bloomMaterialRef.current) {
        bloomMaterialRef.current.opacity = 0.12;
      }
    }
  });

  const isCritical = sides === 20 && value === 20;
  const isFumble = sides === 20 && value === 1;
  const particleIntensity =
    (isCritical || isFumble ? 1.6 : 1) * (flairSpec.particleBoost ?? 1) * quality.particleScale;

  return (
    <RigidBody
      ref={bodyRef}
      type="dynamic"
      colliders={false}
      position={position}
      rotation={rotation}
      linearDamping={0.55}
      angularDamping={0.55}
      ccd
      additionalSolverIterations={6}
    >
      <mesh ref={meshRef} castShadow={quality.enableShadows} receiveShadow={quality.enableShadows}>
        <primitive object={dieModel.geometry} attach="geometry" />
        <meshPhysicalMaterial
          color={themeConfig.baseColor}
          metalness={themeConfig.metalness}
          roughness={themeConfig.roughness}
          clearcoat={0.8}
          clearcoatRoughness={0.12}
          envMapIntensity={1.35}
          emissive={themeConfig.emissiveColor}
          emissiveIntensity={isAnimating ? themeConfig.glowIntensity * 0.9 : themeConfig.glowIntensity * 0.35}
        />
      </mesh>

      <sprite scale={[bloomScale, bloomScale, 1]} renderOrder={0}>
        <spriteMaterial
          ref={bloomMaterialRef}
          map={bloomTexture}
          color={themeConfig.emissiveColor}
          transparent
          opacity={0.12}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>

      <lineSegments geometry={edgeGeometry} renderOrder={1}>
        <lineBasicMaterial
          ref={edgeMaterialRef}
          color={themeConfig.particleColor}
          transparent
          opacity={flairSpec.edgeOpacity}
          depthWrite={false}
        />
      </lineSegments>

      <ConvexHullCollider
        args={[dieModel.colliderVertices]}
        restitution={0.4}
        friction={0.65}
        onCollisionEnter={handleCollisionEnter}
      />

      {dieModel.faces.map((face) => {
        const label = formatFaceLabel(sides, face.value, displayMode);
        const texture = getLabelTexture(label, labelStyle);
        const facePosition = face.center.clone().add(face.normal.clone().multiplyScalar(0.05));
        const faceQuaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), face.normal);
        return (
          <mesh
            key={`${sides}-${face.value}`}
            position={facePosition}
            quaternion={faceQuaternion}
            renderOrder={2}
          >
            <planeGeometry args={[labelScale, labelScale]} />
            <meshStandardMaterial
              map={texture}
              transparent
              opacity={0.95}
              roughness={0.25}
              metalness={0.2}
              emissive={new Color(themeConfig.emissiveColor)}
              emissiveIntensity={0.25}
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-2}
            />
          </mesh>
        );
      })}

      {quality.enableFlair && (
        <DieFlair sides={sides} theme={theme} isActive={isAnimating || isCritical || isFumble} />
      )}

      <DiceParticles
        position={[0, 0, 0]}
        theme={theme}
        isActive={isAnimating || (value !== null && (isCritical || isFumble))}
        intensity={particleIntensity}
      />
    </RigidBody>
  );
}

interface Dice3DSceneProps {
  dice: Array<{ sides: number; value: number | null; displayValue?: number | null; displayMode?: DiceDisplayMode }>;
  isRolling: boolean;
  rollId: number;
  onRollComplete?: (index: number, value: number) => void;
  theme?: DiceTheme;
  onDieImpact?: (position: [number, number, number], intensity: number) => void;
  reducedMotion?: boolean;
  quality?: DiceRenderQuality;
}

function Dice3DScene({
  dice,
  isRolling,
  rollId,
  onRollComplete,
  theme = 'umbral-ascendant',
  onDieImpact,
  reducedMotion = false,
  quality,
}: Dice3DSceneProps) {
  const themeConfig = DICE_THEMES[theme];
  const resolvedQuality = quality ?? DEFAULT_RENDER_QUALITY;
  const cameraRef = useRef<PerspectiveCamera>(null);
  const shakeRef = useRef(0);
  const [impacts, setImpacts] = useState<ImpactFX[]>([]);
  const layout = useMemo(() => {
    const count = Math.max(dice.length, 1);
    const columns = Math.min(count, Math.ceil(Math.sqrt(count)));
    const rows = Math.ceil(count / columns);
    const spacing = 2.4;
    const width = Math.max(10, columns * spacing + 4);
    const height = Math.max(8, rows * spacing + 4);
    return {
      columns,
      rows,
      spacing,
      width,
      height,
      wallHeight: 1.6,
    };
  }, [dice.length]);
  const baseCameraPosition = useMemo(() => {
    const size = Math.max(layout.width, layout.height);
    const distance = Math.max(8, size * 0.75);
    const height = Math.max(4.6, size * 0.45);
    return new Vector3(0, height, distance);
  }, [layout.height, layout.width]);
  const cameraFov = useMemo(() => {
    const size = Math.max(layout.width, layout.height);
    return size > 14 ? 55 : 48;
  }, [layout.height, layout.width]);
  const controlLimits = useMemo(() => {
    const distance = baseCameraPosition.z;
    return {
      minDistance: Math.max(5, distance * 0.7),
      maxDistance: distance * 1.6,
    };
  }, [baseCameraPosition.z]);
  const bounds = useMemo(
    () => ({
      minX: -layout.width / 2 + 0.9,
      maxX: layout.width / 2 - 0.9,
      minZ: -layout.height / 2 + 0.9,
      maxZ: layout.height / 2 - 0.9,
      floor: 0,
      spawnY: 5,
    }),
    [layout.height, layout.width]
  );
  const positions = useMemo(() => {
    const offsetX = (layout.columns - 1) * layout.spacing / 2;
    const offsetZ = (layout.rows - 1) * layout.spacing / 2;
    return dice.map((_, index) => {
      const col = index % layout.columns;
      const row = Math.floor(index / layout.columns);
      const x = col * layout.spacing - offsetX;
      const z = row * layout.spacing - offsetZ;
      return [x, bounds.spawnY, z] as [number, number, number];
    });
  }, [bounds.spawnY, dice, layout.columns, layout.rows, layout.spacing]);

  const handleImpact = useCallback(
    (position: [number, number, number], intensity: number) => {
      onDieImpact?.(position, intensity);
      if (reducedMotion) return;
      shakeRef.current = Math.min(1, shakeRef.current + intensity * 0.35);
      setImpacts((prev) => [
        ...prev.slice(-5),
        { id: `impact-${Date.now()}-${Math.random()}`, position, intensity },
      ]);
    },
    [onDieImpact, reducedMotion]
  );

  const clearImpact = useCallback((id: string) => {
    setImpacts((prev) => prev.filter((impact) => impact.id !== id));
  }, []);

  useFrame((state, delta) => {
    if (!cameraRef.current) return;
    if (reducedMotion) {
      cameraRef.current.position.lerp(baseCameraPosition, 0.12);
      return;
    }
    shakeRef.current = Math.max(0, shakeRef.current - delta * 1.4);
    if (shakeRef.current > 0.001) {
      const t = state.clock.getElapsedTime();
      const strength = shakeRef.current * 0.25;
      cameraRef.current.position.set(
        baseCameraPosition.x + Math.sin(t * 24) * strength,
        baseCameraPosition.y + Math.cos(t * 28) * strength,
        baseCameraPosition.z + Math.sin(t * 20) * strength
      );
    } else {
      cameraRef.current.position.lerp(baseCameraPosition, 0.12);
    }
  });

  return (
    <>
      <DreiPerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[baseCameraPosition.x, baseCameraPosition.y, baseCameraPosition.z]}
        fov={cameraFov}
      />
      <ambientLight intensity={0.4} />
      <hemisphereLight args={['#dfe8ff', '#0a0a12', 0.25]} />
      <directionalLight
        position={[10, 12, 8]}
        intensity={1.35}
        castShadow={resolvedQuality.enableShadows}
        shadow-mapSize-width={resolvedQuality.shadowMapSize}
        shadow-mapSize-height={resolvedQuality.shadowMapSize}
      />
      <spotLight
        position={[-8, 12, -6]}
        intensity={0.7}
        angle={0.35}
        penumbra={0.45}
        color={themeConfig.emissiveColor}
      />
      <pointLight position={[6, 7, -8]} intensity={0.6} color={themeConfig.particleColor} />
      {resolvedQuality.enableEnvironment && <Environment preset="studio" />}

      {resolvedQuality.enableBloomField && (
        <DiceBloomField width={layout.width} height={layout.height} theme={theme} />
      )}

      <Physics gravity={[0, -28, 0]} interpolate colliders={false}>
        <DiceTrayColliders width={layout.width} height={layout.height} wallHeight={layout.wallHeight} />
        {resolvedQuality.enableContactShadows && (
          <ContactShadows
            position={[0, 0.02, 0]}
            opacity={resolvedQuality.contactShadowOpacity}
            scale={Math.max(layout.width, layout.height)}
            blur={resolvedQuality.contactShadowBlur}
            far={10}
          />
        )}

        {impacts.map((impact) => (
          <group key={impact.id}>
            <ImpactRing
              position={impact.position}
              intensity={impact.intensity}
              color={themeConfig.emissiveColor}
              onComplete={() => clearImpact(impact.id)}
            />
            <ImpactFlash position={impact.position} intensity={impact.intensity} color={themeConfig.emissiveColor} />
          </group>
        ))}

        <fog attach="fog" args={['#08080f', 6, 20]} />

        {dice.map((die, index) => (
          <Die
            key={index}
            sides={die.sides}
            value={die.value}
            displayValue={die.displayValue ?? die.value}
            displayMode={die.displayMode ?? 'standard'}
            isRolling={isRolling}
            onRollComplete={(value) => onRollComplete?.(index, value)}
            position={positions[index] || [0, bounds.spawnY, 0]}
            theme={theme}
            bounds={bounds}
            rollId={rollId}
            onImpact={handleImpact}
            quality={resolvedQuality}
          />
        ))}
      </Physics>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={controlLimits.minDistance}
        maxDistance={controlLimits.maxDistance}
        autoRotate={!isRolling && !reducedMotion}
        autoRotateSpeed={0.4}
      />
    </>
  );
}

export interface Dice3DRollerProps {
  dice: Array<{ sides: number; value: number | null; displayValue?: number | null; displayMode?: DiceDisplayMode }>;
  isRolling: boolean;
  onRollComplete?: (index: number, value: number) => void;
  theme?: DiceTheme;
  className?: string;
}

export function Dice3DRoller({ dice, isRolling, onRollComplete, theme = 'umbral-ascendant', className }: Dice3DRollerProps) {
  const themeConfig = DICE_THEMES[theme];
  const { reducedMotion, dpr, three } = usePerformanceProfile();
  const audioEngine = useMemo(() => new DiceAudioEngine({ masterVolume: 0.35 }), []);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [rollId, setRollId] = useState(0);
  const rollingRef = useRef(false);
  const quality = useMemo(
    () => ({
      ...DEFAULT_RENDER_QUALITY,
      ...three,
      dpr,
    }),
    [dpr, three]
  );
  const themeStyle = useMemo(
    () => {
      const glowStrength = clamp(0.14 + themeConfig.glowIntensity * 0.18, 0.14, 0.32);
      return {
        '--dice-glow-primary': hexToRgba(themeConfig.emissiveColor, glowStrength),
        '--dice-glow-secondary': hexToRgba(themeConfig.particleColor, glowStrength * 0.85),
        '--dice-panel-border': hexToRgba(themeConfig.accentColor ?? themeConfig.emissiveColor, 0.35),
        '--dice-bg-top': themeConfig.baseColor,
        '--dice-bg-bottom': themeConfig.trayColor ?? themeConfig.baseColor,
        '--dice-tray-color': themeConfig.trayColor ?? themeConfig.baseColor,
        '--dice-accent': themeConfig.emissiveColor,
      };
    },
    [themeConfig]
  ) as CSSProperties;

  useEffect(() => {
    void initThreeLoaders();
  }, []);

  useEffect(() => {
    audioEngine.setEnabled(audioEnabled);
  }, [audioEnabled, audioEngine]);

  useEffect(() => {
    if (isRolling && !rollingRef.current) {
      setRollId((prev) => prev + 1);
    }
    rollingRef.current = isRolling;
  }, [isRolling]);

  useEffect(() => {
    if (!isRolling) return;
    void audioEngine.resume();
    if (audioEnabled) {
      audioEngine.play('roll', 0.8);
    }
  }, [audioEnabled, audioEngine, isRolling]);

  const handleImpact = useCallback(
    (_position: [number, number, number], intensity: number) => {
      if (!audioEnabled) return;
      audioEngine.play('impact', intensity);
    },
    [audioEnabled, audioEngine]
  );

  const handleRollComplete = useCallback(
    (index: number, value: number) => {
      const dieSides = dice[index]?.sides ?? 0;
      if (audioEnabled && dieSides === 20) {
        if (value === 20) {
          audioEngine.play('critical', 1);
        } else if (value === 1) {
          audioEngine.play('fumble', 1);
        }
      }
      onRollComplete?.(index, value);
    },
    [audioEnabled, audioEngine, dice, onRollComplete]
  );

  return (
    <div
      className={cn("dice-3d-roller", className)}
      style={themeStyle}
      onPointerDown={() => {
        void audioEngine.resume();
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="dice-glow-effect top-left" />
        <div className="dice-glow-effect bottom-right" />
      </div>

      <Canvas
        shadows={quality.enableShadows}
        className="relative z-10"
        dpr={quality.dpr}
        gl={{
          alpha: true,
          antialias: quality.antialias,
          powerPreference: quality.powerPreference,
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          gl.outputColorSpace = SRGBColorSpace;
        }}
      >
        <Dice3DScene
          dice={dice}
          isRolling={isRolling}
          rollId={rollId}
          onRollComplete={handleRollComplete}
          onDieImpact={handleImpact}
          theme={theme}
          reducedMotion={reducedMotion}
          quality={quality}
        />
      </Canvas>

      <div className="dice-vignette" />

      <div className="dice-overlay-ui">
        <div className="dice-overlay-panel">
          <p className="text-xs text-muted-foreground text-center font-heading">
            {isRolling ? 'The System is calculating your fate...' : 'Click and drag to rotate; scroll to zoom.'}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="dice-audio-toggle"
        onClick={() => setAudioEnabled((prev) => !prev)}
        aria-label={audioEnabled ? 'Mute dice audio' : 'Enable dice audio'}
        aria-pressed={!audioEnabled}
      >
        {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>
    </div>
  );
}
