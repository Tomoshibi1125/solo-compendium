export type DiceTheme =
  | 'umbral-ascendant'
  | 'frost-monarch'
  | 'flame-monarch'
  | 'beast-monarch'
  | 'plague-monarch'
  | 'iron-monarch'
  | 'dragon-monarch'
  | 'regent-monarch'
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
  accentColor?: string;
  trayColor?: string;
  bloomFieldOpacity: number;
  bloomFieldScale: number;
}

export const DICE_THEMES: Record<DiceTheme, DiceThemeConfig> = {
  'umbral-ascendant': {
    baseColor: '#1a1a2e', // Dark shadow blue-black
    emissiveColor: '#8b5cf6', // Purple shadow energy
    glowIntensity: 0.8,
    metalness: 0.95,
    roughness: 0.05,
    particleColor: '#a78bfa',
    name: 'Umbral Ascendant',
    accentColor: '#4c1d95',
    trayColor: '#0b0b18',
    bloomFieldOpacity: 0.56,
    bloomFieldScale: 1.76,
  },
  'frost-monarch': {
    baseColor: '#0f172a',
    emissiveColor: '#38bdf8',
    glowIntensity: 0.75,
    metalness: 0.9,
    roughness: 0.1,
    particleColor: '#7dd3fc',
    name: 'Frost Regent',
    accentColor: '#0ea5e9',
    trayColor: '#0b1220',
    bloomFieldOpacity: 0.18,
    bloomFieldScale: 1.08,
  },
  'flame-monarch': {
    baseColor: '#2b1207',
    emissiveColor: '#f97316',
    glowIntensity: 0.95,
    metalness: 0.85,
    roughness: 0.12,
    particleColor: '#fb923c',
    name: 'Flame Regent',
    accentColor: '#ea580c',
    trayColor: '#1b0a04',
    bloomFieldOpacity: 0.68,
    bloomFieldScale: 2.12,
  },
  'beast-monarch': {
    baseColor: '#1f2937',
    emissiveColor: '#a3e635',
    glowIntensity: 0.7,
    metalness: 0.75,
    roughness: 0.2,
    particleColor: '#bef264',
    name: 'Beast Regent',
    accentColor: '#65a30d',
    trayColor: '#0f172a',
    bloomFieldOpacity: 0.28,
    bloomFieldScale: 1.22,
  },
  'plague-monarch': {
    baseColor: '#1f1b13',
    emissiveColor: '#22c55e',
    glowIntensity: 0.8,
    metalness: 0.8,
    roughness: 0.18,
    particleColor: '#4ade80',
    name: 'Plague Regent',
    accentColor: '#16a34a',
    trayColor: '#12100c',
    bloomFieldOpacity: 0.32,
    bloomFieldScale: 1.28,
  },
  'iron-monarch': {
    baseColor: '#111827',
    emissiveColor: '#9ca3af',
    glowIntensity: 0.5,
    metalness: 1.0,
    roughness: 0.05,
    particleColor: '#d1d5db',
    name: 'Iron Regent',
    accentColor: '#6b7280',
    trayColor: '#0c0f16',
    bloomFieldOpacity: 0.1,
    bloomFieldScale: 1.02,
  },
  'dragon-monarch': {
    baseColor: '#240b23',
    emissiveColor: '#ec4899',
    glowIntensity: 0.9,
    metalness: 0.9,
    roughness: 0.08,
    particleColor: '#f472b6',
    name: 'Dragon Regent',
    accentColor: '#be185d',
    trayColor: '#150612',
    bloomFieldOpacity: 0.62,
    bloomFieldScale: 1.92,
  },
  'regent-monarch': {
    baseColor: '#2d1b0f',
    emissiveColor: '#fbbf24',
    glowIntensity: 0.85,
    metalness: 0.95,
    roughness: 0.06,
    particleColor: '#fde68a',
    name: 'Architect Regent',
    accentColor: '#b45309',
    trayColor: '#1f1409',
    bloomFieldOpacity: 0.48,
    bloomFieldScale: 1.6,
  },
  'supreme-deity': {
    baseColor: '#0f172a', // Deep void black
    emissiveColor: '#3b82f6', // Divine blue
    glowIntensity: 0.9,
    metalness: 0.98,
    roughness: 0.02,
    particleColor: '#60a5fa',
    name: 'Prime Architect',
    accentColor: '#2563eb',
    trayColor: '#0b1020',
    bloomFieldOpacity: 0.52,
    bloomFieldScale: 1.7,
  },
  'gate-portal': {
    baseColor: '#450a0a', // Dark blood red
    emissiveColor: '#ef4444', // Rift portal red
    glowIntensity: 1.0,
    metalness: 0.9,
    roughness: 0.1,
    particleColor: '#f87171',
    name: 'Rift Portal',
    accentColor: '#b91c1c',
    trayColor: '#1a0404',
    bloomFieldOpacity: 0.68,
    bloomFieldScale: 2.14,
  },
  'system-interface': {
    baseColor: '#064e3b', // Dark system green
    emissiveColor: '#10b981', // System interface green
    glowIntensity: 0.85,
    metalness: 0.85,
    roughness: 0.15,
    particleColor: '#34d399',
    name: 'System Interface',
    accentColor: '#059669',
    trayColor: '#042f24',
    bloomFieldOpacity: 0.18,
    bloomFieldScale: 1.12,
  },
  'arise-violet': {
    baseColor: '#2e1065', // Deep royal purple
    emissiveColor: '#a855f7', // Ascendant violet
    glowIntensity: 0.9,
    metalness: 0.92,
    roughness: 0.08,
    particleColor: '#c084fc',
    name: 'Ascendant Violet',
    accentColor: '#7e22ce',
    trayColor: '#16052f',
    bloomFieldOpacity: 0.6,
    bloomFieldScale: 1.9,
  },
  'monarch-gold': {
    baseColor: '#713f12', // Dark antique gold
    emissiveColor: '#fbbf24', // Regent gold
    glowIntensity: 0.85,
    metalness: 0.96,
    roughness: 0.04,
    particleColor: '#fcd34d',
    name: 'Regent Gold',
    accentColor: '#d97706',
    trayColor: '#2d1808',
    bloomFieldOpacity: 0.46,
    bloomFieldScale: 1.58,
  },
};

