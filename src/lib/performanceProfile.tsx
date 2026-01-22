import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { warn as logWarn } from '@/lib/logger';

type NetworkInfo = {
  saveData: boolean;
  effectiveType: string | null;
  downlink: number | null;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

type HardwareInfo = {
  deviceMemory: number | null;
  cpuCores: number | null;
};

export type PerformanceTier = 'low' | 'balanced' | 'high' | 'ultra';

export type PerformanceProfile = {
  tier: PerformanceTier;
  override: PerformanceTier | 'auto';
  reducedMotion: boolean;
  saveData: boolean;
  deviceMemory: number | null;
  cpuCores: number | null;
  effectiveType: string | null;
  dpr: [number, number];
  fx: {
    particleCount: number;
    ambientOpacity: number;
    enablePointerGlow: boolean;
    enableScanline: boolean;
    enableTsparticles: boolean;
  };
  three: {
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
  images: {
    quality: number;
    eagerHero: boolean;
  };
  prefetch: boolean;
};

const PerformanceContext = createContext<PerformanceProfile | undefined>(undefined);

const readNetworkInfo = (): NetworkInfo => {
  if (typeof navigator === 'undefined') {
    return { saveData: false, effectiveType: null, downlink: null };
  }
  const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  return {
    saveData: Boolean(connection?.saveData),
    effectiveType: connection?.effectiveType ?? null,
    downlink: typeof connection?.downlink === 'number' ? connection?.downlink : null,
  };
};

const readHardwareInfo = (): HardwareInfo => {
  if (typeof navigator === 'undefined') {
    return { deviceMemory: null, cpuCores: null };
  }
  const deviceMemory =
    typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory === 'number'
      ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null
      : null;
  const cpuCores =
    typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : null;
  return { deviceMemory, cpuCores };
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const buildProfile = (
  reducedMotion: boolean,
  network: NetworkInfo,
  hardware: HardwareInfo,
  override: PerformanceTier | 'auto'
): PerformanceProfile => {
  const forceTier = override !== 'auto' ? override : null;
  const memoryScore = hardware.deviceMemory ?? 8;
  const coreScore = hardware.cpuCores ?? 8;
  const slowNetwork = network.effectiveType === 'slow-2g' || network.effectiveType === '2g';
  const lowEnd =
    network.saveData || slowNetwork || memoryScore <= 4 || coreScore <= 4;
  const ultraReady = memoryScore >= 12 && coreScore >= 12 && !network.saveData && !slowNetwork;
  const highReady = memoryScore >= 8 && coreScore >= 8 && !network.saveData && !slowNetwork;

  let tier: PerformanceTier = 'balanced';
  if (reducedMotion || lowEnd) {
    tier = 'low';
  } else if (ultraReady) {
    tier = 'ultra';
  } else if (highReady) {
    tier = 'high';
  }
  if (forceTier) {
    tier = forceTier;
  }

  const dprMax =
    tier === 'ultra' ? 2.75 : tier === 'high' ? 2.25 : tier === 'balanced' ? 1.6 : 1;
  const particleCount =
    tier === 'ultra' ? 40 : tier === 'high' ? 28 : tier === 'balanced' ? 18 : 10;
  const ambientOpacity =
    tier === 'ultra' ? 1 : tier === 'high' ? 0.9 : tier === 'balanced' ? 0.75 : 0.55;
  const imageQuality =
    tier === 'ultra' ? 95 : tier === 'high' ? 90 : tier === 'balanced' ? 85 : 75;
  const shadowMapSize =
    tier === 'ultra' ? 2048 : tier === 'high' ? 1536 : tier === 'balanced' ? 1024 : 512;
  const particleScale =
    tier === 'ultra' ? 1.25 : tier === 'high' ? 1.1 : tier === 'balanced' ? 0.95 : 0.65;
  const enableEffects = !reducedMotion && (!network.saveData || forceTier !== null);

  return {
    tier,
    override,
    reducedMotion,
    saveData: network.saveData,
    deviceMemory: hardware.deviceMemory,
    cpuCores: hardware.cpuCores,
    effectiveType: network.effectiveType,
    dpr: [1, dprMax],
    fx: {
      particleCount,
      ambientOpacity,
      enablePointerGlow: enableEffects && tier !== 'low',
      enableScanline: enableEffects && tier !== 'low',
      enableTsparticles: enableEffects && (tier === 'high' || tier === 'ultra'),
    },
    three: {
      antialias: tier !== 'low',
      powerPreference: tier === 'low' ? 'low-power' : 'high-performance',
      enableShadows: tier !== 'low',
      shadowMapSize,
      enableContactShadows: tier === 'high' || tier === 'ultra',
      contactShadowBlur: tier === 'low' ? 1.2 : tier === 'balanced' ? 2.2 : 2.8,
      contactShadowOpacity: tier === 'low' ? 0.3 : tier === 'balanced' ? 0.38 : 0.42,
      enableEnvironment: tier !== 'low',
      enableBloomField: tier !== 'low',
      enableFlair: tier !== 'low',
      particleScale,
    },
    images: {
      quality: imageQuality,
      eagerHero: tier !== 'low',
    },
    prefetch: forceTier !== null ? true : enableEffects && tier !== 'low',
  };
};

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useAccessibility();
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(() => readNetworkInfo());
  const [hardwareInfo] = useState<HardwareInfo>(() => readHardwareInfo());
  const override = useMemo<PerformanceTier | 'auto'>(() => {
    const raw = (import.meta.env.VITE_PERFORMANCE_MODE || 'auto').toString().toLowerCase();
    if (raw === 'auto') return 'auto';
    if (raw === 'low' || raw === 'balanced' || raw === 'high' || raw === 'ultra') {
      return raw;
    }
    return 'auto';
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    if (!connection || typeof connection.addEventListener !== 'function') return;

    const handleChange = () => setNetworkInfo(readNetworkInfo());
    connection.addEventListener('change', handleChange);
    return () => {
      connection.removeEventListener('change', handleChange);
    };
  }, []);

  const profile = useMemo(
    () => buildProfile(reducedMotion, networkInfo, hardwareInfo, override),
    [hardwareInfo, networkInfo, override, reducedMotion]
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.dataset.performanceTier = profile.tier;
    root.style.setProperty('--fx-ambient-opacity', String(clamp(profile.fx.ambientOpacity, 0.3, 1)));
    root.style.setProperty('--fx-particle-count', String(profile.fx.particleCount));
  }, [profile.fx.ambientOpacity, profile.fx.particleCount, profile.tier]);

  useEffect(() => {
    if (profile.saveData && profile.tier !== 'low') {
      logWarn('Save-Data enabled. Performance profile reduced to preserve bandwidth.');
    }
  }, [profile.saveData, profile.tier]);

  return (
    <PerformanceContext.Provider value={profile}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformanceProfile() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformanceProfile must be used within a PerformanceProvider');
  }
  return context;
}
