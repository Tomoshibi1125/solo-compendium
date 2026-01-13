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
    baseColor: '#1a1a2e', // Dark shadow blue-black
    emissiveColor: '#8b5cf6', // Purple shadow energy
    glowIntensity: 0.8,
    metalness: 0.95,
    roughness: 0.05,
    particleColor: '#a78bfa',
    name: 'Shadow Monarch',
  },
  'supreme-deity': {
    baseColor: '#0f172a', // Deep void black
    emissiveColor: '#3b82f6', // Divine blue
    glowIntensity: 0.9,
    metalness: 0.98,
    roughness: 0.02,
    particleColor: '#60a5fa',
    name: 'Supreme Deity',
  },
  'gate-portal': {
    baseColor: '#450a0a', // Dark blood red
    emissiveColor: '#ef4444', // Gate portal red
    glowIntensity: 1.0,
    metalness: 0.9,
    roughness: 0.1,
    particleColor: '#f87171',
    name: 'Gate Portal',
  },
  'system-interface': {
    baseColor: '#064e3b', // Dark system green
    emissiveColor: '#10b981', // System interface green
    glowIntensity: 0.85,
    metalness: 0.85,
    roughness: 0.15,
    particleColor: '#34d399',
    name: 'System Interface',
  },
  'arise-violet': {
    baseColor: '#2e1065', // Deep royal purple
    emissiveColor: '#a855f7', // Arise violet
    glowIntensity: 0.9,
    metalness: 0.92,
    roughness: 0.08,
    particleColor: '#c084fc',
    name: 'Arise Violet',
  },
  'monarch-gold': {
    baseColor: '#713f12', // Dark antique gold
    emissiveColor: '#fbbf24', // Monarch gold
    glowIntensity: 0.85,
    metalness: 0.96,
    roughness: 0.04,
    particleColor: '#fcd34d',
    name: 'Monarch Gold',
  },
};
