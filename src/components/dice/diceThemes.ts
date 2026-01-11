export type DiceTheme =
  | 'shadow-monarch'
  | 'supreme-deity'
  | 'gate-portal'
  | 'system-interface'
  | 'arise-violet'
  | 'monarch-gold';

export interface DiceThemeConfig {
  baseColor: string;
  emissiveColor: string;
  glowIntensity: number;
  metalness: number;
  roughness: number;
  particleColor: string;
  name: string;
}

export const DICE_THEMES: Record<DiceTheme, DiceThemeConfig> = {
  'shadow-monarch': {
    baseColor: '#8b5cf6',
    emissiveColor: '#a78bfa',
    glowIntensity: 0.6,
    metalness: 0.9,
    roughness: 0.1,
    particleColor: '#8b5cf6',
    name: 'Shadow Monarch',
  },
  'supreme-deity': {
    baseColor: '#3b82f6',
    emissiveColor: '#60a5fa',
    glowIntensity: 0.7,
    metalness: 0.95,
    roughness: 0.05,
    particleColor: '#3b82f6',
    name: 'Supreme Deity',
  },
  'gate-portal': {
    baseColor: '#ef4444',
    emissiveColor: '#f87171',
    glowIntensity: 0.8,
    metalness: 0.85,
    roughness: 0.15,
    particleColor: '#ef4444',
    name: 'Gate Portal',
  },
  'system-interface': {
    baseColor: '#10b981',
    emissiveColor: '#34d399',
    glowIntensity: 0.65,
    metalness: 0.8,
    roughness: 0.2,
    particleColor: '#10b981',
    name: 'System Interface',
  },
  'arise-violet': {
    baseColor: '#a855f7',
    emissiveColor: '#c084fc',
    glowIntensity: 0.75,
    metalness: 0.88,
    roughness: 0.12,
    particleColor: '#a855f7',
    name: 'Arise Violet',
  },
  'monarch-gold': {
    baseColor: '#fbbf24',
    emissiveColor: '#fcd34d',
    glowIntensity: 0.7,
    metalness: 0.92,
    roughness: 0.08,
    particleColor: '#fbbf24',
    name: 'Monarch Gold',
  },
};
