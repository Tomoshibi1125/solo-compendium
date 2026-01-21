export const CUSTOM_MODIFIER_TYPES = [
  'ability',
  'skill',
  'save',
  'attack',
  'damage',
  'ac',
  'speed',
  'initiative',
] as const;

export type CustomModifierType = typeof CUSTOM_MODIFIER_TYPES[number];

export interface CustomModifier {
  id: string;
  type: CustomModifierType;
  target?: string | null;
  value: number;
  source: string;
  condition?: string | null;
  enabled: boolean;
}

const normalizeTarget = (value?: string | null) => value?.trim().toLowerCase() || null;

export function normalizeCustomModifiers(modifiers?: CustomModifier[] | null): CustomModifier[] {
  return (modifiers ?? []).map((modifier) => ({
    ...modifier,
    target: modifier.target?.trim() || null,
    condition: modifier.condition?.trim() || null,
    source: modifier.source?.trim() || 'Custom',
    enabled: modifier.enabled !== false,
  }));
}

function matchesTarget(modTarget: string | null, target: string | null): boolean {
  if (!modTarget || modTarget === 'all') return true;
  if (!target) return false;
  return modTarget === target;
}

export function sumCustomModifiers(
  modifiers: CustomModifier[],
  type: CustomModifierType,
  target?: string | null,
): number {
  const normalizedTarget = normalizeTarget(target);
  return modifiers.reduce((sum, modifier) => {
    if (!modifier.enabled || modifier.type !== type) return sum;
    const modTarget = normalizeTarget(modifier.target);
    if (!matchesTarget(modTarget, normalizedTarget)) return sum;
    return sum + modifier.value;
  }, 0);
}
